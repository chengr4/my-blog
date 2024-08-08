# [Day35] Read Rust Atomics and Locks - Safty Through Types

> by Mara Bos

> At Topic: Chapter 5. Safety Through Types

> An Extension of the previous Record: An Unsafe One-Shot Channel, Safety Through Runtime Checks

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

Target: Prevent `send` and `receive` methods being called multiple times.

How:

1. Create two separate types called `Sender` and `Receiver` (If the book hadn't taught it, I would never have thought of this approach in my entire life)
2. Use `self` in the `send` and `receive` methods to consume the entire `Sender` and `Receiver` instances.

```rust
pub fn channel<T>() -> (Sender<T>, Receiver<T>) { … }

pub struct Sender<T> { … }
pub struct Receiver<T> { … }

impl<T> Sender<T> {
    // consume the entire Sender instance after sending a message
    pub fn send(self, message: T) { … }
}

impl<T> Receiver<T> {
    pub fn is_ready(&self) -> bool { … }
    // consume the entire Receiver instance after receiving a message
    pub fn receive(self) -> T { … }
}
```

Entire implementation:

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/src/ch5_channels/s4_types.rs
pub struct Sender<T> {
    channel: Arc<Channel<T>>,
}

pub struct Receiver<T> {
    channel: Arc<Channel<T>>,
}

pub fn channel<T>() -> (Sender<T>, Receiver<T>) {
    let a = Arc::new(Channel {
        message: UnsafeCell::new(MaybeUninit::uninit()),
        ready: AtomicBool::new(false),
        // in_use: AtomicBool::new(false), // no longer needed

    });
    (Sender { channel: a.clone() }, Receiver { channel: a })
}

struct Channel<T> {
    message: UnsafeCell<MaybeUninit<T>>,
    ready: AtomicBool,
}

impl<T> Sender<T> {
    // do not need panic since being called once is now compile guaranteed
    pub fn send(self, message: T) {
        unsafe { (*self.channel.message.get()).write(message) };
        self.channel.ready.store(true, Release);
    }
}

impl<T> Receiver<T> {
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

unsafe impl<T> Sync for Channel<T> where T: Send {}

impl<T> Drop for Channel<T> {
    fn drop(&mut self) {
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
