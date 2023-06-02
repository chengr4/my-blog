# [Day13] Read Rust Atomics and Locks - More about Reader-Writer Lock

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Recalls

- A type is `Send` if it can be sent to another thread. In other words, if ownership of a value of that type can be transferred to another thread.
- A type is `Sync` if it can be shared with another thread. In other words, a type `T` is `Sync` if and only if a shared reference to that type `&T` is `Send`.

## Notes

### Reader-Writer Lock

A mutex is only concerned with exclusive access. The `MutexGuard` will always provide us an exclusive reference (&mut T) to the protected data, even if we only wanted to look at the data and and a shared reference (&T) would have benen enough

A reader-writer understands the difference between exclusive and shared access, and can provide either.

A reader-writer has tree states:

- Unlocked
- Locked by a single writer (for exclusive access)
- Locked by any number of readers (for shared access)

*When to use it?*

It is commonly used for data that is often read by multiple threads, but only updated once in a while.

#### Rust's Reader-Writer Lock

- `std::sync::RwLock<T>`
- Instead of `lock()`, it has a `read()` and `write()` method
- Two guard types: `RwLockReadGuard` (for readers), `RwLockWriteGuard` (for writers)
- Both `Mutex<T>` and `RwLock<T>` require `T` to be `Send` (able be used to send a `T` to another thread)
- `RwLock<T>`'s `T` is also `Sync`
- The Rust standard library provides only one general purpose `RwLock` type, but its implementation depends on the OS

### Mutexes vs Other Languages

- Rust’s `Mutex<T>` **contains** the data it is protecting. In C++, for example, `std::mutex` does not contain the data it protects, nor does it even know what it is protecting.

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
