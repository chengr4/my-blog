# [Day18] Read Rust Atomics and Locks - Atomic Compare-and-Exchange Operations

> by Mara Bos

> From: Compare-and-Exchange Operations

> To: Example: Example: Lazy One-Time Initialization

> At Topics: Chapter 2. Atomics


## Recalls

### Fetch-and-Modify Operations

- `fetch_add` and `fetch_sub` implement wrapping behavior for overflows
    > overflow: Incrementing a value past the maximum representable value

    > wrapping: Make the overflow be the minimum representable value
- There are three common solutions to prevent overflows: `std::process::abort`, `fetch_sub` to decrement the counter again before panicking, `compare-and-exchange operations` (the only truly correct one)

### Lazy Initialization

```rust
use std::sync::atomic::AtomicU64;

fn get_x() -> u64 {
    // X is Allocated once and persist throughout the entire program's execution
    static X: AtomicU64 = AtomicU64::new(0);
    let mut x = X.load(Relaxed);
    // only the first thread runs at the first time
    if x == 0 {
        x = calculate_x(); // calculate 0
        X.store(x, Relaxed); // make it available for future use
    }
    x
}
```

- Better to work with `std::sync::Once` and `std::sync::OnceLock`.

## Notes

- Compare-and-Exchange checks if the atomic value is equal to a given value, and only if that is the case does it replace it with a new value (as a single operation)
- `compare_exchange_weak`: Similar to `compare_exchange`, but the difference is that the weak version may still sometimes leave the value untouched and return an Err, even though the atomic value matched the expected value.
- We could use Compare-and-Exchange to implement all the other atomic operations by putting it in a loop to retry if it did change

Eg.

```Rust
use std::sync::atomic::AtomicU32;
use std::sync::atomic::Ordering::Relaxed;

// simulate fetch_add()
fn increment(a: &AtomicU32) {
    let mut current = a.load(Relaxed);
    loop {
        let new = current + 1;
        // current: is expected to be same as a.into_inner()
        // new: a.into_inner() to udpate
        match a.compare_exchange(current, new, Relaxed, Relaxed) {
            // If `a` was indeed still the same as before, it is now replaced by our new value and we are done.
            Ok(_) => return,
            // another thread must’ve changed it in the brief moment since we loaded it
            Err(v) => current = v,
        }
    }
}

fn main() {
    let a = AtomicU32::new(0);
    increment(&a);
    increment(&a);
    // into_innter(): Returns the inner value, consuming the `AtomicU32`
    assert_eq!(a.into_inner(), 3);
}
```

### Example: ID Allocation Without Overflow

Look at this example: `allocate_new_id()` may cause to overflow

```rust
// improve needed
fn allocate_new_id() -> u32 {
    static NEXT_ID: AtomicU32 = AtomicU32::new(0);
    NEXT_ID.fetch_add(1, Relaxed)
}
```

And we have learned to use Compare-and-Exchange to implement all the other atomic operations by putting it in a loop. Therefore, it is possible to solve overflow issue in this way:

```rust
fn allocate_new_id() -> u32 {
    static NEXT_ID: AtomicU32 = AtomicU32::new(0);
    let mut id = NEXT_ID.load(Relaxed);
    loop {
        // we check and panic before modifying NEXT_ID
        assert!(id < 1000, "too many IDs!");
        match NEXT_ID.compare_exchange_weak(id, id + 1, Relaxed, Relaxed) {
            Ok(_) => return id,
            Err(v) => id = v,
        }
    }
}

fn main() {
    // Do not need to worry about overflow now
    for _ in 0..=u32::MAX {
        allocate_new_id();
    }
}
```

- There is  a method called `fetch_update` and it is equal to `load` + loop + `compare_exchange_weak`
    ```rust
    // we could implement our allocate_new_id function with a one-liner
    NEXT_ID.fetch_update(Relaxed, Relaxed, |n| n.checked_add(1)).expect("too many IDs!")
    ```

### Example: Lazy One-Time Initialization

- While [Lazy Initialization](https://marabos.nl/atomics/atomics.html#example-lazy-init) is for a constant (the same result each time), Lazy One-Time Initialization is for a dynamic value. Eg. a randomly encryption key which needs to be unique every time the program is run, but stays constant within a process.

```rust
fn get_key() -> u64 {
    static KEY: AtomicU64 = AtomicU64::new(0);
    let key = KEY.load(Relaxed);
    if key == 0 {
        // We only generate a new key if KEY was not yet initialized
        let new_key = generate_random_key();
        // We replace `KEY` with our newly generated key, but only if it is still zero.
        match KEY.compare_exchange(0, new_key, Relaxed, Relaxed) {
            Ok(_) => new_key,
            // lost the race, use the key from KEY instead
            Err(k) => k,
        }
    } else {
        key
    }
}
```

- Better to work with `std::sync::Once` and `std::sync::OnceLock`.

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Unwinding the Stack or Aborting in Response to a Panic](https://doc.rust-lang.org/stable/book/ch09-01-unrecoverable-errors-with-panic.html#unwinding-the-stack-or-aborting-in-response-to-a-panic)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
