# [Day6] Read Rust Atomics and Locks

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Recall

Why we need Reference Counting?

To make sure that shared data gets dropped and deallocated, we can’t completely give up its ownership. Instead, we can share ownership. By keeping track of the number of owners, we can make sure the value is dropped only when there are no owners left.

## Notes

- Reference counting pointers (`Rc<T>` and `Arc<T>`) have the same restrictions as shared references (&T). They **do not give you mutable access** to their contained value

### Borrowing and Data Races

- Immutable borrowing(&) + Mutable borrowing(&mut) = fully prevent data races
- The compiler will assume data races never happen

### Undefined Behavior

- "Unsafe" doesn’t mean that the code is incorrect or never safe to use, but rather that the compiler is not validating for you that the code is safe. If the code does violate these rules, it is called unsound.
- Undefined behavior can even "travel back in time," causing problems in code that precedes it. (有可能回到過去 = =")
- When calling any unsafe function, read its documentation carefully and make sure you fully understand its safety requirements: the assumptions you need to uphold, as the caller, to avoid undefined behavior.

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)