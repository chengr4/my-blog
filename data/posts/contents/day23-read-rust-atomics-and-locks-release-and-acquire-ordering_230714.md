# [Day23] Read Rust Atomics and Locks - Release and Acquire Ordering

> by Mara Bos

> From: Release and Acquire Ordering

> To: Example: Lazy Initialization with Indirection

> At Topics: Chapter 3. Memory Ordering

## Prerequisites

### `Box<T>`

- A smart pointer
- Box allows you to store data on the *heap* rather than the *stack*
- And its pointer remains in the *stack*
- Box has two important traits
    - `Deref` allows `Box<T>` values to be treated like references
    - `Drop`: When a `Box<T>` value goes out of scope, the heap data that the box is pointing to is cleaned up as well

When to Use?

Usually,

- When you have a type whose size can’t be known at compile time and you want to use a value of that type in a context that requires an exact size
- When you have a large amount of data and you want to **transfer ownership** but ensure the data won’t be copied when you do so
- When you want to own a value and you care only that it’s a type that implements a particular trait rather than being of a specific type

### Raw Pointer

Why to use raw pointer?

One of reasons is in scenarios where there is a requirement to interface with another language or hardware

- Only used with **unsafe Rust**
- Two types: `*const T` (immutable), `*mut T` (mutable)
- A few attributes different from references and smart pointers:
    - Are allowed to ignore the borrowing rules by having both immutable and mutable pointers or multiple mutable pointers to the same location
    - Aren’t guaranteed to point to valid memory
    - Are allowed to be null
    - Don’t implement any automatic cleanup
- We can create raw pointers in safe code, while we can’t dereference raw pointers outside an unsafe block

## Recaps

When working with atomics (mutating data that's shared between threads), we have to explicitly tell the compiler and processor what they can and can't do with our atomic operations by the `std::sync::atomic::Ordering` enum.

Which are:

- Relaxed ordering: `Ordering::Relaxed`
- Release and acquire ordering: `Ordering::{Release, Acquire, AcqRel}`
- Sequentially consistent ordering: `Ordering::SeqCst`

### Mutex

- A mutex has only two states: locked and unlocked
- When a thread locks an unlocked mutex, the mutex is marked as locked and the thread can immediately continue (the only to access data). When an another thread then attempts to lock an already locked mutex, that operation will block and put to sleep.

## Notes

- Release and acquire memory ordering work together to
- Target: to form a happens-before relationship between threads.
- "Release memory ordering" applies to store operations
- "Acquire memory ordering" applies to load operations.
- "The store (Release) and everything before it", happened before "the load (acquire) and everything after it".

> - one thread releases data == storing some value to an atomic variable == unlock a mutex
> - one thread acquires the same data == loading that value == lock a mutex

Eg.

```rust
use std::sync::atomic::AtomicBool;
use std::sync::atomic::AtomicU64;
use std::sync::atomic::Ordering::Relaxed;
use std::sync::atomic::Ordering::{Acquire, Release};
use std::thread;
use std::time::Duration;

static DATA: AtomicU64 = AtomicU64::new(0);
static READY: AtomicBool = AtomicBool::new(false);

fn main() {
    // Everything from before `READY.store(true, Release)` is visble after` READY.load(Acquire)`
    // However, if we use Relax Ordering, `READY.store(true, Relaxed)` may run before `DATA.store(123, Relaxed)`
    thread::spawn(|| {
        DATA.store(123, Relaxed);
        READY.store(true, Release);
    });
    while !READY.load(Acquire) {
        thread::sleep(Duration::from_millis(100));
        println!("waiting...");
    }
    println!("{}", DATA.load(Relaxed));
}
```

### Example: Locking

- Mutexes are the most common use case for release and acquire ordering

Here is a simulation of the mutex pattern:

```rust
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering::{Acquire, Relaxed, Release};
use std::thread;

// Data to access
static mut DATA: String = String::new();
// our lock
static LOCKED: AtomicBool = AtomicBool::new(false);

fn f() {
    // (expected, new_value, success_order, failure_order)
    if LOCKED.compare_exchange(false, true, Acquire, Relaxed).is_ok() {
        // Safety: We hold the exclusive lock, so nothing else is accessing DATA.
        // `unsafe` is to tell the compiler that we take responsibility for this synchronization mechanism
        unsafe { DATA.push('!') };
        LOCKED.store(false, Release);
    }
}

fn main() {
    thread::scope(|s| {
        for _ in 0..100 {
            s.spawn(f);
        }
    });
    // DATA now contains at least one exclamation mark (and maybe more).
    assert!(unsafe { DATA.len() } > 0);
    assert!(unsafe { DATA.chars().all(|c| c == '!') });
}
```

Important to understand here is that: the `{ DATA.push('!') }` is happened-before `Release` and is happened-before `Acquire` (next `compare-and-exchange`) and is happened-before the next `{ DATA.push('!') }`

### Example: Lazy Initialization with Indirection

- For larger data not fitting in a single atomic variable (eg. `AtomicU64`)
- Non-blocking behavior (so has "race")

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/examples/ch3-09-lazy-init-box.rs

// AtomicPtr<T> is the raw pointer of the atomic version
use std::sync::atomic::AtomicPtr;
use std::sync::atomic::Ordering::{Acquire, Release};

fn get_data() -> &'static Data {
    static PTR: AtomicPtr<Data> = AtomicPtr::new(std::ptr::null_mut());

    // if p is not null go to ignore if condition
    let mut p = PTR.load(Acquire);

    if p.is_null() {
        // `Box::new` return a raw pointer
        //  race happens here
        p = Box::into_raw(Box::new(generate_data()));
        if let Err(e) = PTR.compare_exchange(
            std::ptr::null_mut(), p, Release, Acquire
        ) {
            // Safety: p comes from Box::into_raw right above, and wasn't shared with any other thread.
            // deallocate meomory
            drop(unsafe { Box::from_raw(p) });
            // continue with the pointer that the other thread stored in PTR
            p = e;
        }
    }

    // Safety: p is not null and points to a properly initialized value.
    unsafe { &*p }
}

struct Data([u8; 100]);

fn generate_data() -> Data {
    Data([123; 100])
}

fn main() {
    println!("{:p}", get_data());
    println!("{:p}", get_data()); // Same address as before.
}
```

>  Since we’re not only sharing the atomic variable containing the pointer, but also the data it points to, instead of relaxed memory ordering, we should use release and acquire ordering.

See the figure:

![https://marabos.nl/atomics/memory-ordering.html#example-lazy-initialization-with-indirection](https://marabos.nl/atomics/images/raal_0305.png)

## Questions

What will happen if I use relaxed ordering in Lazy Initialization with Indirection?

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
- [Using Box<T> to Point to Data on the Heap](https://doc.rust-lang.org/stable/book/ch15-01-box.html#using-boxt-to-point-to-data-on-the-heap)
- [Dereferencing a Raw Pointer](https://doc.rust-lang.org/stable/book/ch19-01-unsafe-rust.html?highlight=raw%20poin#dereferencing-a-raw-pointer)
