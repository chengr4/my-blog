# [Day37] Read Rust Atomics and Locks - A Blocking Type Check Channel

> by Mara Bos

> At Topic: Chapter 5. Blocking

> An Extension of the previous Records: Better Performance of Type Check Channel

> Every design and implementation decision involves a trade-off and can best be made with a specific use case in mind.

## Recall

### `PhantomData<T>`

- Is always treated by the compiler as a `T`
- Does not actually exist at runtime
- A zero-sized type, taking up no space 
- A common way to combine with `*const`, `Cell` etc. to remove `Send` and `Sync` traits

E.g.

```rust
use std::marker::PhantomData;

struct X {
    handle: i32,
    _not_sync: PhantomData<Cell<()>>,
}
```

## Notes

Target: Create a blocking channel

How: Put parking pattern in the `Receiver` and `Sender`

**Step 1**: Refering thread of receiver to the sender and promise receiver cannot be sent to another thread

```rust
use std::thread::Thread;

pub struct Sender<'a, T> {
    channel: &'a Channel<T>,
    receiving_thread: Thread, // New!
}

// We remove the Send trait to prevent the Sender from refering to the wrong thread
pub struct Receiver<'a, T> {
    channel: &'a Channel<T>,
    // remove Send trait from the receiver
    _no_send: PhantomData<*const ()>, // New!
}

pub fn split<'a>(&'a mut self) -> (Sender<'a, T>, Receiver<'a, T>) {
    *self = Self::new();
    (
        Sender {
            channel: self,
            // the Receiver object we return will stay on the current thread
            receiving_thread: thread::current(), // New!
        },
        Receiver {
            channel: self,
            _no_send: PhantomData, // New!
        }
    )
}
```

**Step 2**: The sender unparks the receiver when the sender sends a message

```rust
impl<T> Sender<'_, T> {
    pub fn send(self, message: T) {
        unsafe { (*self.channel.message.get()).write(message) };
        self.channel.ready.store(true, Release);
        self.receiving_thread.unpark(); // New!
    }
}
```

**Step 3**: The receiver repeatedly waits for messages.

```rust
// Before:
impl<T> Receiver<'_, T> {
    pub fn receive(self) -> T {
        if !self.channel.ready.swap(false, Acquire) {
            panic!("no message available!");
        }
        unsafe { (*self.channel.message.get()).assume_init_read() }
    }
}

// After:
impl<T> Receiver<'_, T> {
    pub fn receive(self) -> T {
        // using "while" becasue the receiver might be woken up by a spurious wakeup
        while !self.channel.ready.swap(false, Acquire) {
            thread::park();
        }
        unsafe { (*self.channel.message.get()).assume_init_read() }
    }
}

```

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
