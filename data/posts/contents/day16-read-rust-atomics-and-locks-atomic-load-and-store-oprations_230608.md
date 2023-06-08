# [Day16] Read Rust Atomics and Locks - Atomic Load and Store Operations

> by Mara Bos

> From: Atomic Load and Store Operations

> To: Example: Lazy Initialization

> At Topics: Chapter 2. Atomics

## Recalls

- Atomic operations allow for different threads to safely read and modify the same variable
- By interior mutability, they allow modification through a shared reference
- Every atomic operation takes an argument of type `std::sync::atomic::Ordering`, which determines what guarantees we get about the relative ordering of operations.
- The simplest variant with the fewest guarantees is `Relaxed`. `Relaxed` still guarantees consistency on a single atomic variable, but does not promise anything about the relative order of operations between different atomic variables.

## Notes

### Atomic Load and Store Operations

Eg.

```rust
impl AtomicI32 {
    // loads the value stored in the atomic variable
    // Note: its parameter is type Ordering
    pub fn load(&self, ordering: Ordering) -> i32;
    // stores a new value in it
    pub fn store(&self, value: i32, ordering: Ordering);
}
```

- Some common use cases: a stop flag, process reporting, Lazy Initialization

Example of Lazy Initialization:

```rust
use std::sync::atomic::AtomicU64;
use std::sync::atomic::Ordering::Relaxed;
use std::thread;
use std::time::Duration;

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

fn calculate_x() -> u64 {
    thread::sleep(Duration::from_secs(1));
    123
}

fn main() {
    dbg!(get_x());
    dbg!(get_x());
}
```

- The code above may cause "race" (not "data race")
- The Rust standard library provides exactly a functionality to wait for the first thread through `std::sync::Once` and `std::sync::OnceLock`.

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
