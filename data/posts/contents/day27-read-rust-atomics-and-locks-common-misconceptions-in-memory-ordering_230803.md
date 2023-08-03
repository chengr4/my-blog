# [Day27] Read Rust Atomics and Locks - Common Misconceptions in memory ordering

> by Mara Bos

> At Topic: Chapter 3. Memory Ordering, Common Misconceptions

## Notes

- Memory ordering is about things like reordering instructions, which usually happen at nanosecond scale no matter which ordering is used.
- Even if we disable compiler optimization, we should still care about memory ordering.
- Even if we use processors having only one core and only ever executing one instruction at a time, all in order, we should still care about memory ordering.
- On all modern platforms (After 2023), relaxed load and store operations compile down to the same processor instructions as non-atomic reads and writes.
- Compilers tend to avoid most types of optimizations for atomic variables.
- If any other memory ordering is correct, `SeqCst` is also correct. However, it’s possible that a concurrent algorithm is simply incorrect, regardless of memory ordering.
- When seeing `Release`, it means "this relates to an acquire operation on the same variable"
- When seeing `SeqCst`, it means "this operation depends on the total order of every single `SeqCst` operation in the program"
- When Seeing `SeqCst`, two things should come to mind:
    1. something complicated is going on
    2. The author might not take the time to analyze the memory ordering
- A "acquire-store" or "release-load" are not possible
- A Release-store does not form any release-acquire relationship with a SeqCst-store.

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
