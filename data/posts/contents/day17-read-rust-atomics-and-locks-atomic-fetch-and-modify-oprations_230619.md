# [Day17] Read Rust Atomics and Locks - Atomic Fetch-and-Modify Operations

> by Mara Bos

> From: Fetch-and-Modify Operations

> To: Example: Example: ID Allocation

> At Topics: Chapter 2. Atomics

## Prerequisites

By default, when a panic occurs, the program starts *unwinding*, which means Rust walks back up the stack and cleans up the data from each function it encounters. However, this walking back and cleanup is a lot of work. Rust, therefore, allows you to choose the alternative of immediately *aborting*, which ends the program without cleaning up (OS will take it over).

## Recaps

- Atomic operations allow for different threads to safely read and modify the same variable
- By interior mutability, they allow modification through a shared reference
- Every atomic operation takes an argument of type `std::sync::atomic::Ordering`, which determines what guarantees we get about the relative ordering of operations.
- The simplest variant with the fewest guarantees is `Relaxed`. `Relaxed` still guarantees consistency on a single atomic variable, but does not promise anything about the relative order of operations between different atomic variables.

## Notes

### Fetch-and-Modify Operations

- "Fetch-and-Modify" is one operation
- These operations `modify` the atomic variable, but also `load (fetch)` the original value, **as a single atomic operation**.
- Common use: `fetch_add`, `fetch_sub`

Eg.

```rust
use std::sync::atomic::AtomicI32;
use std::sync::atomic::Ordering::Relaxed;

fn main() {
    let a = AtomicI32::new(100);
    let b = a.fetch_add(23, Relaxed); // b = 100
    let c = a.load(Relaxed); // c = 123
}
```

- `fetch_add` and `fetch_sub` implement wrapping behavior for overflows
    > overflow: Incrementing a value past the maximum representable value

    > wrapping: Make the overflow be the minimum representable value
- There are three common solutions to prevent overflows: `std::process::abort`, `fetch_sub` to decrement the counter again before panicking, `compare-and-exchange operations` (the only truly correct one)

#### Example: Progress Reporting from Multiple Threads

```rust
use std::sync::atomic::AtomicUsize;
use std::sync::atomic::Ordering::Relaxed;
use std::thread;
use std::time::Duration;

fn main() {
    // the atomic types do not implement the Copy trait (not able to move one into more than one thread), so we have to use its reference
    let num_done = &AtomicUsize::new(0);

    thread::scope(|s| {
        // Four background threads to process all 100 items, 25 each.
        for t in 0..4 {
            // with move, each closure will have its own copy of t, preventing any lifetime issues
            s.spawn(move || {
                for i in 0..25 {
                    process_item(t * 25 + i); // Assuming this takes some time.
                    num_done.fetch_add(1, Relaxed);
                }
            });
        }

        // The main thread shows status updates, every second.
        loop {
            let n = num_done.load(Relaxed);
            if n == 100 { break; }
            println!("Working.. {n}/100 done");
            thread::sleep(Duration::from_secs(1));
        }
    });

    println!("Done!");
}
```

> Compare to a single thread: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/examples/ch2-02-progress-reporting.rs

- We don’t know in which order the threads will increment `num_done`, but as the addition is **atomic**, we don’t have to worry about anything and can be sure it will be exactly 100 when all threads are done.

## Do Not Understand

[Topic: Example: ID Allocation] Now, the assert statement will panic after a thousand calls. However, this happens after the atomic add operation already happened, meaning that NEXT_ID has already been incremented to 1001 when we panic. If another thread then calls the function, it’ll increment it to 1002 before panicking, and so on. Although it might take significantly longer, we’ll run into the same problem after 4,294,966,296 panics when NEXT_ID will overflow to zero again.

Although it might take significantly longer, we’ll run into the same problem after 4,294,966,296 panics when NEXT_ID will overflow to zero again. <= What does this mean?

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Unwinding the Stack or Aborting in Response to a Panic](https://doc.rust-lang.org/stable/book/ch09-01-unrecoverable-errors-with-panic.html#unwinding-the-stack-or-aborting-in-response-to-a-panic)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
