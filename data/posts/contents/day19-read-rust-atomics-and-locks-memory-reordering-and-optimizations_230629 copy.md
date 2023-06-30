# [Day20] Read Rust Atomics and Locks - The Memory Model

> by Mara Bos

> From: The Memory Model

> To: The Memory Model

> At Topics: Chapter 3. Memory Ordering

## Notes

Why we need the memory model?

The different memory ordering options have a strict formal definition. To avoid being tied to the specifics of particular processor architectures, it is defined based on an abstract memory model.

- Rust’s memory model, which is mostly copied from C++
- One of the examples of memory model: concurrent atomic stores is allowed, but concurrent non-atomic stores to the same variable is however a data race (undefined behavior).

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
