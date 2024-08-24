# [Day39] Read Rust Atomics and Locks - Upgrade Arc with `Weak` ability

> by Mara Bos

> At Topic: Chapter 6. Basic Reference Counting

A `Weak<T>` aka. weak pointer provides a solution for dropping "cyclic structure"

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

> To see full implementation, please go [here](https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/src/ch6_arc/s2_weak.rs). I just write down things that I feel important.

- `Weak<T>` behaves similar to `Arc<T>`, but does not prevent an object from getting dropped => `Weak<T>` can exist without a `T`
- `Weak<T>` can be upgraded to `Arc<T>` through its `upgrade` method, but only if the `T` still exists.
- To provide `Arc` as well as `Weak`, it is needed to modify `ArcData` struct:

```rust
// Before
struct ArcData<T> {
    ref_count: AtomicUsize,
    data: T,
}

// After
struct ArcData<T> {
    /// Number of `Arc`s.
    data_ref_count: AtomicUsize,
    /// Number of `Arc`s and `Weak`s combined.
    alloc_ref_count: AtomicUsize,
    /// The data. `None` if there's only weak pointers left.
    data: UnsafeCell<Option<T>>,
}
```

- When implementing `Deref` for `Arc`, note that the type of `ArcData.data` is now `UnsafeCell<Option<T>>` rather than `T`. Therefore, it takes more steps to get `&T`:

```rust
// Instead of 
fn deref(&self) -> &T {
        &self.data().data
}

// It should be
fn deref(&self) -> &T {
    // Using `UnsafeCell::get()`
    let ptr = self.weak.data().data.get();
    // Safty: Since there's an Arc to the data,
    // the data exists and may be shared.
    // (*ptr): *mut Option<T> => Option<T>
    // (*ptr).as_ref(): &Option<T> to Option<&T>
    unsafe { (*ptr).as_ref().unwrap() }
}
```

There are 2 focal points about `Arc::get_mut`:

```rust
struct ArcData<T> {
    data_ref_count: AtomicUsize,
    alloc_ref_count: AtomicUsize, // key for checking if it's the only Arc
    data: UnsafeCell<Option<T>>,
}

impl<T> Arc<T> {
    pub fn get_mut(arc: &mut Self) -> Option<&mut T> {
        if arc.weak.data().alloc_ref_count.load(Relaxed) == 1 {
            fence(Acquire);
            // Safety: Nothing else can access the data, since
            // there's only one Arc, to which we have exclusive access,
            // and no Weak pointers.
            let arcdata: &mut ArcData<T> = unsafe { arc.weak.ptr.as_mut() };
            let option: &mut Option<T> = arcdata.data.get_mut();
            // We know the data is still available since we
            // have an Arc to it, so this won't panic.
            let data: &mut T = option.as_mut().unwrap();
            Some(data)
        } else {
            None
        }
    }
}
```

1. By `alloc_ref_count`, we can check both `Arc` and `Weak` count at the same time. If `alloc_ref_count` is 1, it means there's only one `Arc` and no `Weak` pointers. So, it's safe to get mutable access to the data.
2. (my guess) `arc.weak.ptr.as_mut()` is used rather than `arc.weak.data()` because we need `&mut ArcData<T>` rather than `&ArcData<T>`.

- (Quote from the book) Dropping an object in Rust will first run its Drop::drop function (if it implements Drop), and then drop all of its fields, one by one, recursively.

## Questions

### Why does not `Weak` implemented `Deref`?

> According to Claude

1. Safety considerations: Weak pointers don't guarantee that the data they point to still exists. If `Weak` implemented `Deref`, users might incorrectly assume that the data is always available, which could lead to unsafe behavior.
2. Semantic mismatch: `Deref` is typically used to represent some kind of "ownership" or "guaranteed existence" relationship. Weak pointers fundamentally don't provide this guarantee.
3. Different usage patterns: `Arc` needs frequent access to its internal data, so `Deref` is useful. `Weak` is primarily used to check if data exists and potentially upgrade to an `Arc`, not for direct access.

## My Difficulty

- I know `UnsafeCell` supplies more control and lower overhead and is great for synchronization. But the timing to use it rather than `Cell` or `RefCell` is quite difficult!
- When to know my customized struct needs to implement `Drop`?

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
