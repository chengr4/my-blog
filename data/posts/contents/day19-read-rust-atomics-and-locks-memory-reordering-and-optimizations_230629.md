# [Day19] Read Rust Atomics and Locks - Memory Reordering and Optimizations

> by Mara Bos

> From: Reordering and Optimizations

> To: Reordering and Optimizations

> At Topics: Chapter 3. Memory Ordering

## Notes

- A processor can determine, that two particular consecutive instructions in your program will not impact each other, and execute them out of order to make the program faster.
- A compiler might decide to reorder or rewrite parts of your program if it might result in faster execution.

Eg.

```rust
// our code
fn f(a: &mut i32, b: &mut i32) {
    *a += 1;
    *b += 1;
    *a += 1;
}

// after compiler and processor
fn f(a: &mut i32, b: &mut i32) {
    // Assuming *b was available in a cache, while *a had to be fetched from the main memory
    *b += 1; // processor makes this instruction earlier
    *a += 2; // compiler rewrites instructions
}
```

### Optimization with Mutiple threads

The optimization performed by processors and compilers does not take other threads into consideration. Therefore, when working with atomics (data shared between threads), we have to explicitly tell the compiler and processor what they can and can’t do.

How? Instead of a precise specification, we use `std::sync::atomic::Ordering` enum:

- Relaxed ordering: `Ordering::Relaxed`
- Release and acquire ordering: `Ordering::{Release, Acquire, AcqRel}`
- Sequentially consistent ordering: `Ordering::SeqCst`

> In `C++`, there is also something called `consume ordering` (purposely omitted from Rust)

## In Need of Further Investigation

- `Ordering::{Release, Acquire, AcqRel, SeqCst}`

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
