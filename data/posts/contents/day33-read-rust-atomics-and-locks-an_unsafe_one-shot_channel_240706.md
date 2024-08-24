# [Day33] Read Rust Atomics and Locks - An Unsafe One-Shot Channel

> by Mara Bos

> At Topic: Chapter 5. An Unsafe One-Shot Channel

## Recall

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

### Sync and Send Trait

- `Sync`: A type is `Sync` if it is safe to reference its value from multiple threads
- `Send`: A type is `Send` if it is safe to transfer ownership of its value to another thread

### Acquire and Release Ordering

- One thread releases data == storing some value to an atomic variable == unlock a mutex
- One thread acquires the same data == loading that value == lock a mutex

## Notes

> Function of One-Shot Channel: Send "exactly one" message from one thread to another.

Firstly, we define a `Channel` struct with two fields: `message` and `ready`:

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/d945e828bd08719a2d7cb6d758be4611bd90ba2b/src/ch5_channels/s2_unsafe.rs
use std::cell::UnsafeCell;
use std::mem::MaybeUninit;
use std::sync::atomic::AtomicBool;

pub struct Channel<T> {
    message: UnsafeCell<MaybeUninit<T>>,
    ready: AtomicBool,
}
```

- `UnsafeCell`: for multi-threaded environments
- `MaybeUninit`: A low-level unsafe version alternative to `Option<T>` for message storage. (trade-off here: It saves memory but requires manual safety checks)
- `AtomicBool`: for the ready flag

Sequentially, it is needed to tell the compiler that our channel is OK to share between threads:

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/d945e828bd08719a2d7cb6d758be4611bd90ba2b/src/ch5_channels/s2_unsafe.rs

unsafe impl<T> Sync for Channel<T> where T: Send {}
```

- We set `Channel<T>` to be `Sync` because the channel is designed to be used in a multi-threaded environment.
- And `T`, which is `Send` (aka. message), can be safely sent between threads.
- `Send` and `Sync` should always be with `unsafe` block.

Next, let's implement methods of the channel:

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/d945e828bd08719a2d7cb6d758be4611bd90ba2b/src/ch5_channels/s2_unsafe.rs
use std::sync::atomic::Ordering::{Acquire, Release};

impl<T> Channel<T> {
    pub const fn new() -> Self {
        Self {
            message: UnsafeCell::new(MaybeUninit::uninit()),
            ready: AtomicBool::new(false),
        }
    }

    /// Safety: Only call this once!
    pub unsafe fn send(&self, message: T) {
        // initialize the message
        (*self.message.get()).write(message);
        self.ready.store(true, Release);
    }

    pub fn is_ready(&self) -> bool {
        self.ready.load(Acquire)
    }

    /// Safety: Only call this once,
    /// and only after is_ready() returns true!
    pub unsafe fn receive(&self) -> T {
        (*self.message.get()).assume_init_read()
    }
}
```

- It is needed to deference the `self.message.get()` to get the `MaybeUninit` value because it returns a raw pointer.
- For receiving message in our channel, we do not provide a blocking interface. Instead, we will let the user to decide whether to block or not.
- (Downside) Calling `send` more than once might cause a data race, while two or more threads try to write to the cell concurrently.
- (Downside) Calling `receive` more than once causes two copies of the message, even if `T` is not `Copy`.
- (Downside) `Drop` trait is not implemented => if a message is sent but never received, it will never be dropped.

**To sum up, since we made the user responsible for everything, the user must use this channel very carefully.**

## Did Not Get It

- `MaybeUninit::assume_init_read()`, which unsafely assumes it has already been initialized and "that it isn’t being used to produce multiple copies of non-Copy objects"?

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
