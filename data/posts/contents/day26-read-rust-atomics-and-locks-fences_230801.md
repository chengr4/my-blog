# [Day26] Read Rust Atomics and Locks - Fences

> by Mara Bos

> At Topic: Chapter 3. Memory Ordering, Fences

## Recaps

When working with atomics (mutating data that's shared between threads), we have to explicitly tell the compiler and processor what they can and can't do with our atomic operations by the `std::sync::atomic::Ordering` enum.

Which are:

- Relaxed ordering: `Ordering::Relaxed`
- Release and acquire ordering: `Ordering::{Release, Acquire, AcqRel}`
- Sequentially consistent ordering: `Ordering::SeqCst`

## Notes

- In addition to memory operations on atomic variables, memory ordering can also be applied to "atomic fences" in concurrent programming
- `std::sync::atomic::fence`
- Four types: release fence (Release), acquire fence (Acquire), AcqRel or SeqCst
- An atomic fence allows you to separate the memory ordering from the atomic operation:

    ```rust
    a.store(1, Release);

    // is equal to

    fence(Release);
    a.store(1, Relaxed);

    // and

    a.load(Acquire);

    // is equal to

    a.load(Relaxed);
    fence(Acquire);

    // Benefit: apply a memory ordering to multiple operations, conditionally usecases etc.
    ```

- Using a separate fence can result in an extra processor instruction, though, which can be slightly less efficient.
- A fence is not tied to any single atomic variable => a single fence can be used for multiple variables at once.
- By using fence conditionally, we can avoid unnecessary memory ordering and optimize performance
- A `SeqCst` and `AcqRel` fence cannot be split into a relaxed operation and a memory fence

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
