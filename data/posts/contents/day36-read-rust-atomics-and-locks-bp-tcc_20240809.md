# [Day36] Read Rust Atomics and Locks - Better Performance of Type Check Channel

> by Mara Bos

> At Topic: Chapter 5. Borrowing to Avoid Allocation

> An Extension of the previous Records: Safe Channel Through Types

Better performance means less convenience and simplicity. It is just a trade-off.

## Notes

Target: preventing overhead of allocating memory

How: Create a `Channel` that can be borrowed by the `Sender` and `Receiver`.

**Step 1**: Channel is public again and remove `fn channel`

```rust
pub struct Channel<T> {
    message: UnsafeCell<MaybeUninit<T>>,
    ready: AtomicBool,
}

// removed
// pub fn channel<T>() -> (Sender<T>, Receiver<T>) { ... }
```

**Step 2**: Declare `Sender` and `Receiver` to borrow the channel

```rust
// Before
pub struct Sender<T> {
    channel: Arc<Channel<T>>,
}

pub struct Receiver<T> {
    channel: Arc<Channel<T>>,
}

// After
pub struct Sender<'a, T> {
    channel: &'a Channel<T>,
}

pub struct Receiver<'a, T> {
    channel: &'a Channel<T>,
}
```

Step 3: (Cool implementation)

1. We need an exclusive borrow (`&mut Channel`) to prevent multiple `sender` and `receivers` for the same channel.
2. We must avoid using a channel that has already been used (in certain situations)

```rust
impl<T> Channel<T> {
    // `&'a mut self` for #1
    pub fn split<'a>(&'a mut self) -> (Sender<'a, T>, Receiver<'a, T>) {
        // reset channel
        // for #2
        *self = Self::new();
        (Sender { channel: self }, Receiver { channel: self })
    }
}
```

Full implementation:

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/src/ch5_channels/s5_borrowing.rs

use std::cell::UnsafeCell;
use std::mem::MaybeUninit;
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering::{Acquire, Relaxed, Release};

pub struct Channel<T> {
    message: UnsafeCell<MaybeUninit<T>>,
    ready: AtomicBool,
}

unsafe impl<T> Sync for Channel<T> where T: Send {}

pub struct Sender<'a, T> {
    channel: &'a Channel<T>,
}

pub struct Receiver<'a, T> {
    channel: &'a Channel<T>,
}

impl<T> Channel<T> {
    pub const fn new() -> Self {
        Self {
            message: UnsafeCell::new(MaybeUninit::uninit()),
            ready: AtomicBool::new(false),
        }
    }

    pub fn split<'a>(&'a mut self) -> (Sender<'a, T>, Receiver<'a, T>) {
        *self = Self::new();
        (Sender { channel: self }, Receiver { channel: self })
    }
}

impl<T> Sender<'_, T> {
    pub fn send(self, message: T) {
        unsafe { (*self.channel.message.get()).write(message) };
        self.channel.ready.store(true, Release);
    }
}

impl<T> Receiver<'_, T> {
    pub fn is_ready(&self) -> bool {
        self.channel.ready.load(Relaxed)
    }

    pub fn receive(self) -> T {
        if !self.channel.ready.swap(false, Acquire) {
            panic!("no message available!");
        }
        unsafe { (*self.channel.message.get()).assume_init_read() }
    }
}

impl<T> Drop for Channel<T> {
    fn drop(&mut self) {
        if *self.ready.get_mut() {
            unsafe { self.message.get_mut().assume_init_drop() }
        }
    }
}
```

## My Guess

### `sender`'s `Send` Trait

For the implementation, there is a test case:

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/src/ch5_channels/s5_borrowing.rs
#[test]
fn main() {
    use std::thread;
    let mut channel = Channel::new();
    thread::scope(|s| {
        let (sender, receiver) = channel.split();
        let t = thread::current();
        s.spawn(move || {
            // why sender can be passed into another thread?
            sender.send("hello world!");
            t.unpark();
        });
        while !receiver.is_ready() {
            thread::park();
        }
        assert_eq!(receiver.receive(), "hello world!");
    });
}
```

I was curious why `sender` could be passed into another thread. My understanding is based on the fact that the `Channel` struct implements the `Sync` trait, which implies that `&Channel` is `Send`. Given the declaration of Sender:

```rust
pub struct Sender<'a, T> {
    // it implements Send trait
    channel: &'a Channel<T>,
}
```

Since `&Channel` is `Send`, the `sender` also implements the `Send` trait. This allows `sender` to be safely passed into another thread.

(Can someone confirm this understanding? Thanks!)

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
