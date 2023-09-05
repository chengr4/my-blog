# [Day7] Read Rust Atomics and Locks - Interior Mutability

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Recall

What is `unsafe`?

`Unsafe` doesn’t mean that the code is incorrect or never safe to use, but rather that the compiler is not validating for you that the code is safe. If the code does violate rules, it is called unsound.

What is "undefined behavior"?

The compiler does not need to consider these situations, and will simply assume they do not happen.

## Notes

### Interior Mutability

Why do we need interior mutability?

Threads following the common borrowing rules makes communication between each extremely limited, since no data can be mutated. By interior mutability and under certain conditions, data can allow mutation through an "immutable" reference

>  Since in this book we will mostly be working with exceptions, we’ll use the more accurate terms in the rest of this book: instead of "immutable" and "mutable", a shared reference (`&T`) and an exclusive reference (`&mut T`) are used

- Interior mutability only bends the rules of shared borrowing to allow mutation when shared
- Interior mutability does not change anything about exclusive borrowing
- `Unsafe` code that results in more than one active exclusive reference to something always invokes undefined behavior, regardless of interior mutability

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
