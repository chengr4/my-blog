# [Day34] Read Rust Atomics and Locks - Safty Through Runtime Checks

> by Mara Bos

> At Topic: Chapter 5. Safety Through Runtime Checks

> An Extension of the previous paragraph: An Unsafe One-Shot Channel

The target of this chapter os to make misuse result in a panic with a clear message, rather than undefined behavior.

## Recall

### Release and Acquire Ordering

- "The store (Release) and everything before it" happened before "the load (acquire) and everything after it".
- One thread releases data == storing some value to an atomic variable == unlock a mutex
- One thread acquires the same data == loading that value == lock a mutex

## Notes

We want the `receive` method:

1. Avoid `receive` method being called before a message is ready
2. Avoid `receive` method being called more than once

=> Two things have been updated here:

1. Use `ready` flag to promise that the message is available.
2. Use `swap` method to promise that the `receive` method is called only once.

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/tree/main/src/ch5_channels
pub struct Channel<T> {
    message: UnsafeCell<MaybeUninit<T>>,
    ready: AtomicBool,
}

// Before:
pub unsafe fn receive(&self) -> T {
    (*self.message.get()).assume_init_read()
}

// After:
/// Panics if no message is available yet,
/// or if the message was already consumed.
///
/// Tip: Use `is_ready` to check first.
pub fn receive(&self) -> T {
    if !self.ready.swap(false, Acquire) {
        panic!("no message available!");
    }

    unsafe { (*self.message.get()).assume_init_read() }
}
```

Because we have added an acquire-load of the ready flag inside  the `receive` method, we can downgrade the `is_ready` method to a relaxed load to reduce the overhead:

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/tree/main/src/ch5_channels

// Before:
pub fn is_ready(&self) -> bool {
    self.ready.load(Acquire)
}

// After:
pub fn is_ready(&self) -> bool {
    self.ready.load(Relaxed)
}
```

For the `send` method, we like to prevent multiple send calls.

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/src/ch5_channels/s3_checks.rs
pub struct Channel<T> {
    message: UnsafeCell<MaybeUninit<T>>,
    in_use: AtomicBool, // To indicate whether the channel has been taken in use.
    ready: AtomicBool,
}

impl<T> Channel<T> {
    pub const fn new() -> Self {
        Self {
            message: UnsafeCell::new(MaybeUninit::uninit()),
            in_use: AtomicBool::new(false), // New!
            ready: AtomicBool::new(false),
        }
    }

    /// Panics when trying to send more than one message.
    pub fn send(&self, message: T) {
        if self.in_use.swap(true, Relaxed) {
            panic!("can't send more than one message!");
        }
        unsafe { (*self.message.get()).write(message) };
        self.ready.store(true, Release);
    }
    // ... other methods
}
```

There is a case that the channel never gets dropped: when sending a message that is never received. We can implement the `Drop` trait to handle this case.

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/src/ch5_channels/s3_checks.rs
impl<T> Drop for Channel<T> {
    fn drop(&mut self) {
        // `get_mut` promises that only a thread that has exclusive access to the channel
        if *self.ready.get_mut() {
            unsafe { self.message.get_mut().assume_init_drop() }
        }
    }
}
```

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
