# [Day30] Read Rust Atomics and Locks - An Unsafe Spin Lock

> by Mara Bos

> At Topic: Chapter 4. Building Our Own Spin Lock, A Minimal Implementation

## Prerequisites

- [Interior Mutability](https://marabos.nl/atomics/basics.html#interior-mutability)

## Recaps

What is spin lock?

Instead of putting the thread to sleep, the thread will continuously attempt to lock the locked lock

When to use spin lock?

If a lock is only ever held for **very brief moments** and the threads locking it can run in parallel on different processor cores.

### `&T` and `&mut T`

- A shared reference (`&T`) can be copied and shared with others
- An exclusive reference (`&mut T`) guarantees it’s the only exclusive borrowing of that `T`.

### UnsafeCell

- An `UnsafeCell` is the primitive building unit for interior mutability
- No restrictions to avoid undefined behavior
- Can only be used in `unsafe` block
- Commonly, an `UnsafeCell` is wrapped in another type that provides safety through a limited interface, such as `Cell` or `Mutex`. 
- All types with interior mutability are built on top of `UnsafeCell`.

## Notes

In most use cases, A spin lock will be used to protect mutations to a shared variable

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/src/ch4_spin_lock/s2_unsafe.rs
use std::cell::UnsafeCell;
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering::{Acquire, Release};

pub struct SpinLock<T> {
    // use AtomicBool since we want more than one thread to be able to interact with it simultaneously
    locked: AtomicBool,
    // the spin lock itself is shared but the data can be mutated => interior mutability
    value: UnsafeCell<T>,
}

unsafe impl<T> Sync for SpinLock<T> where T: Send {}

impl SpinLock {
    // ensure initialization at compile-time
    pub const fn new() -> Self {
        Self { locked: AtomicBool::new(false) }
    }

    pub fn lock(&self) {
        while self.locked.swap(true, Acquire) {
            // keep trying to set the value to true until it succeeds
            std::hint::spin_loop();
        }
    }

    pub fn unlock(&self) {
        self.locked.store(false, Release);
    }
}
```


---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
- [Constant evaluation](https://doc.rust-lang.org/reference/const_eval.html)
