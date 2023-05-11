# [Day5] Read Rust Atomics and Locks

> by Mara Bos

## Prerequisites

- Understand smart pointers

## Notes

-  Any data shared between threads will need to live as long as the longest living thread.
- A `static` item is never droped and has already exists before the main function of the program even starts.

    ```rust
    static X: [i32; 3] = [1, 2, 3];

    thread::spawn(|| dbg!(&X)); // [src/main.rs:6] &X = [ 1, 2, 3,]
    ```

- Some ways to share ownership to threads: `static`, `Box::leak(Box::new([1, 2, 3]));`, `Arc`
- `References` are `Copy`, meaning that when you "move" them, the original still exists, just like with an integer or boolean.

### Reference Counting

```rust
// reference counted
use std::rc::Rc;

// Both 'a' and 'b' Rc will refer to the same allocation; they share ownership.
let a = Rc::new([1, 2, 3]);
let b = a.clone();

assert_eq!(a.as_ptr(), b.as_ptr()); // Same allocation!
```

- Threads use `std::sync::Arc` instead of `std::rc::Rc` while it guarantees that modifications to the reference counter are **indivisible atomic** operations

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)