# [Day45] Read Rust Atomics and Locks - Caching and Cache Coherence

> by Mara Bos

> At Topic: Chapter 7: Caching and Cache Coherence

> The cache aka. caché in French, meaning "hidden"

## Notes

- When an instruction writes to memory, the cache might keep the modified data temporarily without immediately updating the main memory. => Any subsequent read requests for the same memory address will receive the updated data from the cache, ignoring the outdated data in main memory.
- Most processor architectures read and write cache in blocks of 64 bytes (aka. cache lines), even if onlt a single byte is needed.

> => (Advantage) Caching the entire block allows subsequent instructions to access the same block without needing to fetch it from memory again.

### Cache Coherence

Background:

In multi-core systems, each core typically has its own L1 cache and shares L2, L3 caches etc.. If a core modifies data in its cache without notifying other caches, inconsistencies can arise.

=> To solve this problem, a **cache coherence protocol** is used.

- The specific cache coherence protocol implemented can differ based on the architecture, the processor model, and even the cache level.
- E.g. The write-through protocol, the MESI protocol

#### The write-through protocol

- "Writes" are not cached but are immediately written to the next layer of cache.
- All caches can observe the same communication and therefore can update to the same value.
- Pros: Simple and easy to implement, Good for optimizing read-heavy workloads.
- Cons: Writes are slower

#### The MESI protocol

> Too lazy for this part = =!

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計 (zh-hant)](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
