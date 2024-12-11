# [Day44] Read Rust Atomics and Locks - Load-linked and Store-Conditional Instructions on RISC

> by Mara Bos

> At Topic: Chapter 7: Load-linked and Store-Conditional Instructions

## Notes

Background: A `compare-and-exchange` loop is the most common way to implement atomic operations.

- The closest thing to a `compare-and-exchange` loop on a RISC architecture is a load-linked/store-conditional loop (aka. LL/SC loop).
- Load-linked (LL): Similar to regular load
- Store-conditional (SC): Similar to regular store, but conditional
- LL/SC should be used together and target the same memory location.
- SC refuses to store if memory has been overwritten since LL.
- If SC fails, the loop will simply retry. => Promise of atomicity
- ARM64 always lacks single-instruction atomic `fetch-and-modify` or `compare-and-exchange` operations.
- Due to its design, ARM64 separates load and store steps from calculations and comparisons.
- ARM64 uses `ldxr` (load exclusive register) and `stxr` (store exclusive register) for load-linked and store-conditional operations.
- Use `fetch-and-modify` methods instead of a `compare-and-exchange` loop when possible.

> `clrex` (clear exclusive) is available as an alternative to `stxr` to stop tracking memory writes without storing any data.

Here is an example for `x.fetch_add(10, Relaxed)` in ARM64:

```
; Non-atomic code to add 10 in function a
a:
    ldr w8, [x0]
    add w8, w8, #10
    str w8, [x0]
    ret

; x.fetch_add(10, Relaxed) in function a
a:
.L1:
    ldxr w8, [x0] ; Load the value at address pointed to by x0 into register w8 (LL).
    add w9, w8, #10 ; Add 10 to the value in w8 and store the result in w9.
    stxr w10, w9, [x0] ; Attempt to store the value in w9 back to the address pointed to by x0 (SC).
                       ; The result of the store is written to w10. 0 = success, 1 = fail.
    cbnz w10, .L1 ; If the store failed (w10 != 0), branch back to .L1 to retry the loop.
    ret ; Return from the function.
```

> Compilers generally minimize the number of instructions in LL/SC patterns to reduce the risk of LL/SC loops failing repeatedly or spinning indefinitely.

### ARMv8.1 Atomic Instructions

- ARMv8.1 introduced new CISC-style atomic instructions in ARM64 for common atomic operations.
- E.g. `ldadd` (load and add) for `fetch_add`, without the need for LL/SC loops.
- E.g. instructions for `fetch_max`
- E.g. `cas` (compare and swap) corresponds to `compare_exchange`.
- These new instructions can be more performant than LL/SC pattern and good for some specialized hardware.

### Compare-and-exchange on ARM

`compare_exchange_weak`:

```rust
pub fn a(x: &AtomicI32) {
    x.compare_exchange_weak(5, 6, Relaxed, Relaxed);
}
```

=> 

```
a:
    ldxr w8, [x0] ; Load the value at memory address in x0 into register w8 (LL)
    cmp w8, #5 ; Compare the value in w8 with 5
    b.ne .L1 ; If w8 is not equal to 5, branch to label .L1
    mov w8, #6 ; If comparison succeeded (w8 == 5), move the value 6 into register w8
    stxr w9, w8, [x0] ; (SC) Try to store the value in w8 to the address in x0 
                      ; and set w9 based on success (0 = success, 1 = failure)
    ret ; Return
.L1: ; Handling the failure case
    clrex ; Abort the LL/SC pattern
    ret ; Return
```

> Normally, `compare_exchange_weak` is used in a loop to retry on failure. In this example, we only call it once and ignore the return value to focus on the relevant assembly.

> `stxr` is allowed to have false negatives that it might fail even if the memory location has not been changed by another thread. (This is why `compare_exchange_weak` is called weak.)

`compare_exchange`:

```rust
pub fn a(x: &AtomicI32) {
    x.compare_exchange(5, 6, Relaxed, Relaxed);
}
```

=> 

```
a:
    mov w8, #6 ; Move the value 6 into register w8 (this will be used for the store)
.L1:
    ldxr w9, [x0] ; Load the value from memory at address x0 into register w9 (LL)
    cmp w9, #5 ; Compare the value in w9 with 5
    b.ne .L2 ; If w9 is not equal to 5, branch to label .L2 to handle failure
    stxr w9, w8, [x0] ; (SC) Attempt to store w8 (value 6) at memory address in x0
                      ; w9 will be set to 0 on success or 1 on failure
    cbnz w9, .L1 ; If w9 is non-zero (store failed), branch back to .L1 to retry
    ret ; Return
.L2: ; Handling the failure case (comparison failed)
    clrex ;  Abort the LL/SC pattern
    ret ; Return
```

To compare with `compare_exchange_weak`, `compare_exchange` has:

1. An extra branch
2. An extra `chnz` (compare and branch on nonzero) instruction
3. The `mov` instruction is outside the loop to keep the loop as short as possible.

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計 (zh-hant)](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
