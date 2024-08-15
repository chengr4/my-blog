# [Day38] Read Rust Atomics and Locks - Build Basic Arc

> by Mara Bos

> At Topic: Chapter 6. Basic Reference Counting

## Recall

### `Arc`

- Goal: To share ownership
- Thread safe (While `Rc` is not)
- immutable (So is `Rc`)

```rust
let a = Arc::new([1, 2, 3]);
let b = a.clone();

assert_eq!(a.as_ptr(), b.as_ptr()); // Same allocation!
```

## Notes

> To see full implementation, please go [here](https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/src/ch6_arc/s1_basic.rs). I just write down things that I feel important.

- `ArcData<T>` is the unit and should not be public

```rust
struct ArcData<T> {
  ref_count: AtomicUsize,
  data: T
}
```

Arc is basically a pointer to a shared `ArcData<T>` object. For this:

- `Box<ArcData<T>>` is unacceptable because a Box represents exclusive ownership, not shared ownership.
- Using reference is also unacceptable because of the lifetime issue (Arc does not follow the lifetime rule).
- Instead, `std::ptr::NonNull<T>` is used which represents a pointer to `T` that is never null.

```rust
pub struct Arc<T> {
  ptr: NonNull<ArcData<T>>
}
```

For

```rust
pub fn new(data: T) -> Arc<T> {
    Arc {
        ptr: NonNull::from(Box::leak(Box::new(ArcData {
            ref_count: AtomicUsize::new(1),
            data,
        }))),
    }
}
```

- Using `Box::new()` to allocate memory not `&ArcData` because `&ArcData` causes lifetime issues.
- `Box::leak()` is used to give up the exclusive ownership of the allocation.

- `Box::from_raw()`: reclaim exclusive ownership of the allocation (for dropping)
- An `Arc` should not implement `DerefMut` since it represents shared ownership.
- When `ref_count == 1`, get mutable reference is possible.
- After changing the value by `get_mut`, we need to use mutex etc. to access the value (Actually, I do not understand why it is necessary).

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
