# [Day28] Read Rust Atomics and Locks - Introduction of Spin Lock

> by Mara Bos

> At Topic: Chapter 4. Building Our Own Spin Lock

## Recaps

### Mutex

- Locking a regular mutex will put your thread to sleep when the mutex is already locked.

## Notes

We have two locking strategies to ensure that only one thread at a time can access a shared resource: **mutex** and **spin lock**

What is spin lock?

Instead of putting the thread to sleep, the thread will continuously attempt to lock the locked lock

When to use spin lock?

If a lock is only ever held for **very brief moments** and the threads locking it can run in parallel on different processor cores.

- Attempting to lock an already locked mutex will result in busy-looping or spinning

>  Many real-world implementations of mutexes, including `std::sync::Mutex` on some platforms, briefly behave like a spin lock before asking the operating system to put a thread to sleep.

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
