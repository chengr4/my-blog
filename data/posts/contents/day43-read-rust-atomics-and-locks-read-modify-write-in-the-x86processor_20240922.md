# [Day43] Read Rust Atomics and Locks - Read-Modify-Write in the x86 Processor

> by Mara Bos

> At Topic: Chapter 7 Read-Modify-Write Operations

## Recall

### Compare-and-Exchange Operations

- Compare-and-Exchange checks if the atomic value is equal to a given value, and only if that is the case does it replace it with a new value (as a single operation)
- `compare_exchange_weak`: Similar to `compare_exchange`, but the difference is that the weak version may still sometimes leave the value untouched and return an Err, even though the atomic value matched the expected value.
- We could use Compare-and-Exchange to implement all the other atomic operations by putting it in a loop to retry if it did change.

```rust
// source: https://doc.rust-lang.org/std/sync/atomic/struct.AtomicUsize.html#examples-11
use std::sync::atomic::{AtomicUsize, Ordering};

let some_var = AtomicUsize::new(5);

// some_var compares to the first argument (5) and if it is equal, it will be replaced by the second argument (10)
assert_eq!(some_var.compare_exchange(5, 10,
                                     Ordering::Acquire,
                                     Ordering::Relaxed), Ok(5));
assert_eq!(some_var.load(Ordering::Relaxed), 10);
```

## Notes

An example of read-modify-write operation in x86-64 and ARM64:

```rust
// Rust code
pub fn a(x: &mut i32) {
    *x += 10;
}
```

=> 

```
// Compiled x86-64
a:
    add dword ptr [rdi], 10
    ret

// Compiled ARM64
a:
    ldr w8, [x0]
    add w8, w8, #10
    str w8, [x0]
    ret
```

- While loading and storing happens in different steps in `ARM64`, it is clear that the instructions are not atomic.
- `x86-64`'s `add` instruction will be separated by the process into several **micro-instructions** behind the scenes, so it is not atomic as well.

> If instructions run on a single core, the atomic issue is not a problem, as switching a processor core between threads generally only happens **between instructions**. But if multiple cores are involved, it is crucial to consider the multiple steps of a read-modify-write operation.

`x86` systems provide an instruction prefix called `lock` as a modifier to make instructions like `add` **atomic**.

```
a:
    lock add dword ptr [rdi], 10
    ret
```

- In modern processors, The `lock` prefix blocks the using memory while allowing other cores to operate on unrelated memory.
- The `lock` prefix can only be applied to a few instructions, including `add`, `sub`, `and`, `not`, `or`, and `xor`.
- The `xchg` instruction (exchange), used for atomic swaps, **implicitly** behaves as if it has a lock prefix, ensuring it is always atomic.

A `fetch_add` example in `x86-64`:

```rust
pub fn a(x: &AtomicI32) -> i32 {
    x.fetch_add(10, Relaxed)
}
```

=> 

```
a:
    mov eax, 10
    lock xadd dword ptr [rdi], eax
    ret
```

Instead of the `add` instruction,  the `xadd` (exchange and add) instruction is used, as it places the original value of `x` into a register (`eax`) before performing the addition.

> `add` can provide a little of useful to next instructions though, such as whether the updated value was zero or negative.

- `xadd` (O), `xchf` (O), `xsub` (X), `xand` (X), `xor` (X)
- For subtraction, this isn't problematic since `xadd` can be used with negative values.
- For `and`, `or` and `xor`(Bitwise Operations) => `bts` (bit test and set), `btr` (bit test and reset), and `btc` (bit test and complement)
- When operations affect more than one bit, they cannot be represented by a single `x86-64` instruction.
- The `x86-64` architecture supports a lock-prefixable `cmpxchg` (compare and exchange) instruction, which can be used to implement atomic operations that are not directly supported by the `x86-64` instruction such as `fetch_or`:

```rust
pub fn a(x: &AtomicI32) -> i32 {
    x.fetch_or(10, Relaxed)
}
```

=> 

```
a:
    mov eax, dword ptr [rdi]      ; Load the value from the atomic variable (pointed to by rdi) into eax
.L1:
    mov ecx, eax                  ; Copy the value in eax to ecx (prepare for OR operation)
    or ecx, 10                    ; Perform a bitwise OR on ecx with 10, storing the result in ecx
    lock cmpxchg dword ptr [rdi], ecx  ; Atomically compare and exchange:
                                       ; - Compare the value in eax with the value at the memory address rdi
                                       ; - If they are equal, store ecx (new value) at eax
                                       ; - If not, store the current value at rdi in eax
    jne .L1                       ; If the comparison failed (values were not equal), jump back to .L1 to retry
    ret                           ; Return from the function, with the original value in eax
```

> On `x86-64`, there is no difference between `compare_exchange` and `compare_exchange_weak`. Both compile down to a `lock cmpxchg` instruction.

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計 (zh-hant)](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
