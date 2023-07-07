# [Day22] Read Rust Atomics and Locks - Relaxed Ordering

> by Mara Bos

> From: Relaxed Ordering

> To: Relaxed Ordering

> At Topics: Chapter 3. Memory Ordering

## Notes

- Atomic operations using relaxed memory ordering do not provide any happens-before relationship
- But it promises from the perspective of every other threads all modifications of the same atomic variable happen in a same order

See following example:

```rust
static X: AtomicI32 = AtomicI32::new(0);

// possible order of modification X is 0 => 5 => 15
fn a() {
    X.fetch_add(5, Relaxed);
    X.fetch_add(10, Relaxed);
}

fn b() {
    let a = X.load(Relaxed);
    let b = X.load(Relaxed);
    let c = X.load(Relaxed);
    let d = X.load(Relaxed);
    println!("{a} {b} {c} {d}");
    // possible results: "0 0 0 0", "0 0 5 15", "0 15 15 15"
    // impossible results: "0 5 0 15", "0 0 10 15"
}
```

And with two threads:

```rust
use std::sync::atomic::AtomicI32;
use std::sync::atomic::Ordering::Relaxed;
use std::thread;

static X: AtomicI32 = AtomicI32::new(0);

// possible order should be 0=>5=>15 or 0=>10=>15
fn a1() {
    X.fetch_add(5, Relaxed);
}
fn a2() {
    X.fetch_add(10, Relaxed);
}

// if we see eg. "0 10 10 15", "5" will never be printed out
fn b() {
    let a = X.load(Relaxed);
    let b = X.load(Relaxed);
    let c = X.load(Relaxed);
    let d = X.load(Relaxed);
    println!("{a} {b} {c} {d}");
}

fn main() {
    thread::scope(|s| {
        s.spawn(a1);
        s.spawn(a2);
        s.spawn(b);
    });
}
```

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
