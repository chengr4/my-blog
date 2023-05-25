# [Day9] Read Rust Atomics and Locks - Mutex, RwLock, Atomics and UnsafeCell

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Recalls

### RefCell

- `std::cell::RefCell`
- Unlike `Cell`, it allows you to borrow its contents (call `borrow()` or `borrow_mut()`)

    ```rust
    use std::cell::RefCell;

    fn f(v: &RefCell<Vec<i32>>) {
        v.borrow_mut().push(1); // We can modify the `Vec` directly.
    }
    ```

- It has a counter for outstanding (未處理的) borrows
- It can only be used within a single thread

## Notes

### Mutex and RwLock

- An `RwLock` or reader-writer lock is the concurrent version of a `RefCell`
- An `RwLock<T>` holds a `T` and tracks any outstanding borrows.
- When conflicting borrows happen, it does not panic. Instead, it blocks the current thread (​putting it to sleep) and waits for conflicting borrows to disappear.
Borrowing the contents of an `RwLock` is called **locking**
- `RwLock` keeps tracking shared and exclusive borrows
- A `Mutex` is very similar to `RwLock`, but it only allows exclusive borrows.

### Atomics

- While an `RwLock` is the concurrent version of a `RefCell`, The atomic types represent the concurrent version of a `Cell`
- They cannot be of arbitrary size, so there is no `Atomic<T>`
- Usually use `AtomicU32` and `AtomicPtr<T>` (depends on the processor)

### UnsafeCell

- An UnsafeCell is the primitive building block (scope) for interior mutability
- Can only be used in `unsafe` block
- Commonly, an `UnsafeCell` is wrapped in another type that provides safety through a limited interface, such as `Cell` or `Mutex`. 
- All types with interior mutability are built on top of `UnsafeCell`.

> Including: `Cell`, `RefCell`, `RwLock`, `Mutex`....

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
