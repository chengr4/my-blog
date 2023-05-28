# [Day10] Read Rust Atomics and Locks - Trait Send and Sync

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Recalls

### Cell

- `std::cell::Cell<T>`
- If `T` is Copy, it allows you to copy the value out
- Or replace the value with another value as a whole (not allow to borrow its content)
- It can only be used within a single thread
- Cell has interior mutability

## Notes

### Trait Send and Sync

Rust uses trait `Send` and `Sync` to keep track of which types can be safely used across threads. With them, the compiler can check for you, so you can use these types without having to use `unsafe` blocks.

**Send**

A type is `Send` if it can be sent to another thread. In other words, if ownership of a value of that type can be transferred to another thread. 

For example, `Arc<i32>` is `Send`, but `Rc<i32>` is not.

**Sync**

A type is `Sync` if it can be shared with another thread. In other words, a type `T` is `Sync` if and only if a shared reference to that type, `&T`, is `Send`.

For example, an `i32` is `Sync`, but a `Cell<i32>` is not. (A `Cell<i32>` is `Send`, however.)

>  because a shared reference `&i32` to an `i32` can be safely sent to another thread. The `i32` type itself is considered thread-safe for sharing between threads -- ChatGTP (2023.05)

- All primitive types such as `i32`, `bool`, and `str` are both `Send` and `Sync`.
- A `struct` with fields that are all `Send` and `Sync`, is itself also `Send` and `Sync`. (aka auto traits)
- The `thread::spawn function` requires its argument to be `Send`. Eg. `Rc<i32>` is not.

### PhantomData<T>

- `std::marker::PhantomData<T>`
- It is commonly used for opting out (解除) `struct`'s auto traits
- It is treated by the compiler as a `T`, except it doesn’t actually exist at runtime. 
- It’s a zero-sized type, taking no space.

eg:

```rust
use std::marker::PhantomData;

// struct X is not Sync becuase `Cell<()>` is not
// but it is Send, since all its fields implement Send
struct X {
    handle: i32,
    _not_sync: PhantomData<Cell<()>>,
}
```

## Opt in and out Send and Sync

Opt in:

```rust
struct X {
    p: *mut i32,
}

unsafe impl Send for X {} // requires the unsafe keyword
unsafe impl Sync for X {} // requires the unsafe keyword
```

Opt out: Use `PhantomData<T>`

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
