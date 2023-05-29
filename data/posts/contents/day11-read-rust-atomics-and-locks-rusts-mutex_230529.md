# [Day11] Read Rust Atomics and Locks - Rust's Mutex

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Recalls

### Mutex and RwLock

- An `RwLock` or reader-writer lock is the concurrent version of a `RefCell`
- An `RwLock<T>` holds a `T` and tracks any outstanding borrows.
- When conflicting borrows happen, it does not panic. Instead, it blocks the current thread (​putting it to sleep) and waits for conflicting borrows to disappear.
- Borrowing the contents of an `RwLock` is called **locking**
- `RwLock` keeps tracking shared and exclusive borrows
- A `Mutex` is very similar to `RwLock`, but it only allows exclusive borrows.

## Notes

### Locking: Mutexes and RwLocks

The most commonly used tool for sharing (mutable) data between threads is a mutex (mutual exclusion): Data will only be used by a thread at a time

Conceptually,

- A mutex has only two states: locked and unlocked
- When a thread locks an unlocked mutex, the mutex is marked as locked and the same thread can immediately continue
- When a thread attempts to lock an already locked mutex, that operation will block and is put to sleep
- Unlocking is only possible to be done by the same thread that locked it.
- Unlocking will wake up one of those waiting threads, after mutex is unlocked
- The only thread having the mutex locked can access the data

### Rust’s Mutex

- `std::sync::Mutex<T>`
- `T` can only be accessed through the mutex
- It does not have an `unlock()` method, because a locked mutex can only be unlocked by the thread that locked it
- While using a mutex can ensure serialized execution, it also negates the advantages of parallelism

```rust
use std::sync::Mutex;

fn main() {
    let n = Mutex::new(0);
    thread::scope(|s| {
        for _ in 0..10 {  // spawn ten threads
            s.spawn(|| {
                let mut guard = n.lock().unwrap(); lock the mutex to obtain `MutexGuard`
                for _ in 0..100 {
                    *guard += 1;
                }
            }); // The guard is implicitly dropped right after
        }
    });
    // The into_inner method takes ownership of the mutex, which guarantees that nothing else can have a reference to the mutex anymore, making locking unnecessary. (remove the protection)
    assert_eq!(n.into_inner().unwrap(), 1000);
}
```

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
