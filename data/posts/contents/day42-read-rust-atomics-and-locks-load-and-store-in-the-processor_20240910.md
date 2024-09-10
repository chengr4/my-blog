# [Day42] Read Rust Atomics and Locks - Load and Store in the Processor

> by Mara Bos

> At Topic: Chapter 7 Load and Store

## Notes

Interestingly, both Non-atomic store through `&mut i32` and atomic store to an `AtomicI32` are compiled to the same assembly code.

```rust
// Non-atomic store through &mut i32
pub fn a(x: &mut i32) {
    *x = 0;
}

// Atomic store to an AtomicI32
pub fn b(x: &AtomicI32) {
    x.store(0, Relaxed);
}
```

=>

```
// Compiled x86-64
// copy (move) dats from a zero constant to memory
a:
    mov dword ptr [rdi], 0 ret

// Compiled ARM64
// store a 32-bit register into memory
// wzr: register that always contains zero
a:
    str wzr, [x0] ret
```

Because `mov` and `str` (store) have already been atomic on x86-64 and ARM64. => They either happened or did not happen at all.

Therefore, the meaning of atomic "relaxed" store is only relevant for the compiler checks and optimizations and useless for the processor.

> The `load` operation remains the same.

- Although it makes no difference for the processor between atomic and non-atomic operations stores and loads, we still need to identify them in our Rust code.

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
