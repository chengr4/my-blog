# [Day24] Read Rust Atomics and Locks - Consume Ordering

> by Mara Bos

> From: Consume Ordering, To: Consume Ordering

> At Topic: Chapter 3. Memory Ordering

## Recaps

When working with atomics (mutating data that's shared between threads), we have to explicitly tell the compiler and processor what they can and can't do with our atomic operations by the `std::sync::atomic::Ordering` enum.

Which are:

- Relaxed ordering: `Ordering::Relaxed`
- Release and acquire ordering: `Ordering::{Release, Acquire, AcqRel}`
- Sequentially consistent ordering: `Ordering::SeqCst`

## Notes

- There is a weaker ordering than Acquire Ordering called "Consume Ordering"
- Its effects are only applicable to expressions depending on the "loaded value"
    - Eg. you have `x.store(false, Release);` and all expressions like `*x`, `array[x]` or `table.lookup(x + 1)` will happen after it
- All modern processor architectures—​consume ordering is achieved with the exact same instructions as relaxed ordering.
- However, no compiler actually implements consume ordering and upgrades consume ordering to acquire ordering, just to be safe. See one example here: a compiler might be able to optimize `x + 2 - x` to just `2`, effectively dropping the dependency on `x`. 

> C++ 20 standard even explicitly discourages the use of consume ordering as well

- In conclusion, at lease in 2023, `Ordering::Consume` in Rust is not feasible

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
