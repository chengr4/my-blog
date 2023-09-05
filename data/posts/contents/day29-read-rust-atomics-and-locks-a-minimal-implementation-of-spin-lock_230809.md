# [Day29] Read Rust Atomics and Locks - A Minimal Implementation of Spin Lock

> by Mara Bos

> At Topic: Chapter 4. Building Our Own Spin Lock, A Minimal Implementation

## Recall

What is spin lock?

Instead of putting the thread to sleep, the thread will continuously attempt to lock the locked lock

When to use spin lock?

If a lock is only ever held for **very brief moments** and the threads locking it can run in parallel on different processor cores.

## Notes

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/src/ch4_spin_lock/s1_minimal.rs
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering::{Acquire, Release};

pub struct SpinLock {
    // use AtomicBool since we want more than one thread to be able to interact with it simultaneously
    locked: AtomicBool,
}

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

> `std::hint::spin_loop()`: a special instruction that causes the processor core to optimize its behavior for such a situation 

By acquire and release memory ordering, after locking it again, we can safely assume that whatever happened during the last time it was locked has already happened.

See:

![https://marabos.nl/atomics/building-spinlock.html#a-minimal-implementation](https://marabos.nl/atomics/images/raal_0401.png)

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
- [Constant evaluation](https://doc.rust-lang.org/reference/const_eval.html)
