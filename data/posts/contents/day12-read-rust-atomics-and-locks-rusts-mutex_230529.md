# [Day12] Read Rust Atomics and Locks - Lock Poisoning

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Notes

### Lock Poisoning

A Mutex in Rust gets marked as poisoned when a thread panics while holding the lock. When that happens, the Mutex will no longer be locked, but calling its lock method will result in an `Err` to indicate it has been poisoned.

Why we need to mark the mutex as poisoned?

If we do not do so, may break assumptions made by other threads (Generate inconsistent state). By marking the mutex as poisoned, we can be forced to handle inconsistent state.

How it works?

Calling `lock()` on a poisoned mutex still locks the mutex. The `Err` returned by `lock()` contains the `MutexGuard`, allowing us to correct an inconsistent state if necessary.

### Lifetime of the MutexGuard

Lock and unlock the mutex in a single statement:

```rust
// it is Mutex<Vec<i32>>
// You can lock the mutex, push an item into the Vec, and unlock the mutex again, in a single statement
list.lock().unwrap().push(1);
```

We should be careful of using mutex with `match`, `if let`, or `while let`. Look at the following example:

```rust
// Bad one
if let Some(item) = list.lock().unwrap().pop() {
    process_item(item); // we still hold on to the lock unnecessarily
} // The temporary guard will be dropped after here

// Good one
let item = list.lock().unwrap().pop(); // guard does get dropped here
if let Some(item) = item {
    process_item(item);
}

// Similar one but is ok
// A regular if statement is always a plain boolean, which cannot borrow anything
if list.lock().unwrap().pop() == Some(1) { // guard does get dropped here
    do_something();
}
```

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
