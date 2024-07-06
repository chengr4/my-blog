# [Day32] Read Rust Atomics and Locks - A Simple Mutex-Based Channel

> by Mara Bos

> At Topic: Chapter 5. A Simple Mutex-Based Channel

## Recall

### `std::sync::Condvar`

A more commonly used option for waiting for something to happen to data protected by a mutex

- Two basic operations: `wait` and `notify`
- `Condvar` **must** works together with a Mutex (downside)
- Moreover, a `Condvar` is normally only used together with a **single** Mutex (no more Mutex).
- Multiple threads can wait on the same `Condar`
- Also, notifications can either be sent to one or all of waiting threads.
- Use Cases: Build a channel 
- `Condvar::wait_timeout()`: If the thread does not get notified within a certain time, it should wake up and get the lock back.

## Notes

> Understanding `Condvar` is quite important for this article.

Function of Channel: Send data from one thread to another.

The simple implementation:

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/d945e828bd08719a2d7cb6d758be4611bd90ba2b/src/ch5_channels/s1_simple.rs
use std::collections::VecDeque;
use std::sync::Condvar;
use std::sync::Mutex;

pub struct Channel<T> {
    queue: Mutex<VecDeque<T>>,
    item_ready: Condvar,
}

impl<T> Channel<T> {
    pub fn new() -> Self {
        Self {
            queue: Mutex::new(VecDeque::new()),
            item_ready: Condvar::new(),
        }
    }

    pub fn send(&self, message: T) {
        self.queue.lock().unwrap().push_back(message);
        self.item_ready.notify_one();
    }

    pub fn receive(&self) -> T {
        let mut b = self.queue.lock().unwrap();
        loop {
            if let Some(message) = b.pop_front() {
                return message;
            }
            b = self.item_ready.wait(b).unwrap();
        }
    }
}
```

- I personally feel that this implementation only encapsulates the use of `Condvar` into a channel.
- This channel allows any number of sending and receiving threads.
- (Downside) If `VecDeque::push` has to grow the capacity of the `VecDeque`, all sending and receiving threads will have to wait for that one thread to finish the reallocation.
- (Downside) this channel’s queue might grow without limit.

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
