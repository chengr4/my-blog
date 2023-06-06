# [Day15] Read Rust Atomics and Locks - Intro of Atmoics

> by Mara Bos

> From: Chapter 2. Atomics

> To: Chapter 2. Atomics

> At Topics: Chapter 2. Atomics

## Notes

- Atomic operations allow for different threads to safely read and modify the same variable
- Eg. `std::sync::atomic::AtomicI32;`, `std::sync::atomic::AtomicUsize`
- Almost all platforms provide at least all atomic types up to the size of a pointer
- By interior mutability, they allow modification through a shared reference
- They all have the same interface with methods for storing and loading and atomic "fetch-and-modify"
- Every atomic operation takes an argument of type `std::sync::atomic::Ordering`: To guarantee we get about the relative ordering of operations

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
