# [Day40] Read Rust Atomics and Locks - Optimize Arc

> by Mara Bos

> At Topic: Chapter 6. Optimizing

> An Extension of the previous Record: Upgrade Arc with `Weak` ability

## Recall

### `Arc`

- Goal: To share ownership
- Thread safe (While `Rc` is not)
- Immutable (So is `Rc`)

```rust
let a = Arc::new([1, 2, 3]);
let b = a.clone();

assert_eq!(a.as_ptr(), b.as_ptr()); // Same allocation!
```

### UnsafeCell

- An `UnsafeCell` is the primitive building unit for **interior mutability**
- No restrictions to avoid undefined behavior
- Can only be used in `unsafe` block
- Commonly, an `UnsafeCell` is wrapped in another type that provides safety through a limited interface, such as `Cell` or `Mutex`.
- In other words, all types with interior mutability are built on top of `UnsafeCell`, Including: `Cell`, `RefCell`, `RwLock`, `Mutex`...
- Gets a mutable raw pointer (`*mut T`) to the wrapped value by `get` method.

```rust
pub const fn get(&self) -> *mut T
```

### Compare-and-Exchange Operations

- Compare-and-Exchange checks if the atomic value is equal to a given value, and only if that is the case does it replace it with a new value (as a single operation)
- `compare_exchange_weak`: Similar to `compare_exchange`, but the difference is that the weak version may still sometimes leave the value untouched and return an Err, even though the atomic value matched the expected value.
- We could use Compare-and-Exchange to implement all the other atomic operations by putting it in a loop to retry if it did change

```rust
// source: https://doc.rust-lang.org/std/sync/atomic/struct.AtomicUsize.html#examples-11
use std::sync::atomic::{AtomicUsize, Ordering};

let some_var = AtomicUsize::new(5);

// some_var compares to the first argument (5) and if it is equal, it will be replaced by the second argument (10)
assert_eq!(some_var.compare_exchange(5, 10,
                                     Ordering::Acquire,
                                     Ordering::Relaxed), Ok(5));
assert_eq!(some_var.load(Ordering::Relaxed), 10);
```

## Notes

> To see full implementation, please go [here](https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/src/ch6_arc/s3_optimized.rs). I just write down things that I feel important.

1. Since the existence of `Arc<T>` has already told us whether the data is sill alive or not, we do not need another `None` state to tell us that. Therefore, instead of `Option<T>`, we use `ManuallyDrop<T>` to store the data.
2. `std::mem::ManuallyDrop<T>`: it takes the exact same amount of space as a `T`, but allows us to manually drop it at any point by using an `unsafe` call to `ManuallyDrop::drop()`.
3. The way to design `alloc_ref_count` is really cool

```rust
struct ArcData<T> {
    /// Number of `Arc`s.
    data_ref_count: AtomicUsize,
    /// Number of `Weak`s, plus one if there are any `Arc`s.
    alloc_ref_count: AtomicUsize,
    /// The data. Dropped if there are only weak pointers left.
    data: UnsafeCell<ManuallyDrop<T>>,
}
```

- `get_mut` method is a great case to study (I might only understand about 60% on this read)
- The locking operation must use `Acquire` to ensure that all previous writes are visible to the current thread. The unlocking operation (`store`) must use `Release` to ensure that all subsequent writes are visible to other threads.


## Questions

> Some questions I hope someone can answer me.

1. I think if another thread runs `weak.clone()` right after the main thread runs `get_mut()`, it is possible that the process could be aborted.

2. In `get_mut()` implementation, I think it is allowed to clone an `Arc` between `fence(Acquire)` and if condition which might violate the exclusive access to the data.

```rust
pub fn get_mut(arc: &mut Self) -> Option<&mut T> {
        // Acquire matches Weak::drop's Release decrement, to make sure any
        // upgraded pointers are visible in the next data_ref_count.load.
        if arc.data().alloc_ref_count.compare_exchange(
            1, usize::MAX, Acquire, Relaxed
        ).is_err() {
            return None;
        }
        let is_unique = arc.data().data_ref_count.load(Relaxed) == 1;
        // Release matches Acquire increment in `downgrade`, to make sure any
        // changes to the data_ref_count that come after `downgrade` don't
        // change the is_unique result above.
        arc.data().alloc_ref_count.store(1, Release);
        if !is_unique {
            return None;
        }

        // I think it is allowed to clone an `Arc` here

        fence(Acquire);
        unsafe { Some(&mut *arc.data().data.get()) }
    }
```

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
