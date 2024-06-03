# [Day14] Read Rust Atomics and Locks - Thread Parking and condition variables

> by Mara Bos

> From: Waiting: Parking and Condition Variables

> To: Condition Variables

> At Topics: Chapter 1. Basics of Rust Concurrency

## Recall

- `std::thread::scope`: It allows us to spawn threads that **cannot outlive** the scope of the closure we pass to that function, making it possible to safely borrow local variables.
- `MutexGuard`: it represents the guarantee that we have locked the mutex.

## Notes

When data is mutated by multiple threads, there are many situations where they would need to wait for some event, for some condition about the data to become true. 

For example, if we have a mutex protecting a Vec, we might want to wait until it contains anything.

At this point, we need *thread parking* or *condition variables*

### Thread Parking

- `std::thread::park()`
- A thread can park itself, which puts it to sleep
- Another thread can unpark the parked thread, waking it up from its nap
- Unpark requests don’t stack up: Calling unpark two times only has one time's effect
- The request to unpark is recorded, even if it is called before the thread parks itself

> Use `std::thread::current()` or `JoinHandle` returned by `spawn` of the the parked thread and call `unpark()`

> Warning: `park()` does not guarantee that it will **only** return (wake up) because of a matching `unpark()` (spurious wake-ups, 虛假的喚醒)

Here is an simple example:

```rust
use std::sync::Mutex;
use std::collections::VecDeque;
use std::thread;
use std::time::Duration;

fn main() {
    let que = Mutex::new(VecDeque::new());

    thread::scope(|s| {
        // consuming thread
        let t = s.spawn(|| loop {
            let item = que.lock().unwrap().pop_front();
            if let Some(item) = item {
                dbg!(item);
            } else {
                // it’s important that we only park the thread if we’ve seen the queue is empty
                thread::park();
            }
        });

        // Producing thread
        for i in 0.. {
            que.lock().unwrap().push_back(i);
            t.thread().unpark();
            thread::sleep(Duration::from_secs(1));
        }
    });
}
```

### Condition Variables

A more commonly used option for waiting for something to happen to data protected by a mutex

- Two basic operations: `wait` and `notify`
- `std::sync::Condvar`
- `Condvar` must works together with a Mutex (downside)
- Moreover, a `Condvar` is normally only used together with a **single** Mutex (no more Mutex).
- Multiple threads can wait on the same `Condar`
- Also, notifications can either be sent to one or all of waiting threads.
- Use Cases: Build a channel 
- `Condvar::wait_timeout()`: If the thread does not get notified within a certain time, it should wake up and get the lock back.

Eg:

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/examples/ch1-12-condvar.rs
use std::collections::VecDeque;
use std::sync::Condvar;
use std::sync::Mutex;
use std::thread;
use std::time::Duration;

fn main() {
    let queue = Mutex::new(VecDeque::new());
    let not_empty = Condvar::new(); // Ensure that the queue is not empty before a thread continues execution

    // it contains two threads
    thread::scope(|s| {
        s.spawn(|| {
            loop {
                let mut q = queue.lock().unwrap();
                let item = loop {
                    if let Some(item) = q.pop_front() {
                        // break and return the item
                        break item;
                    } else {
                        // It unlocks the mutex and pushes the thread to sleep
                        // after being notified (wake up), it will lock the mutex again
                        q = not_empty.wait(q).unwrap();
                    }
                };
                drop(q); // unlock the mutex
                dbg!(item);
            }
        });

        for i in 0.. {
            queue.lock().unwrap().push_back(i);
            not_empty.notify_one();
            thread::sleep(Duration::from_secs(1));
        }
    });
}
```

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
