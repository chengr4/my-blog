# [Day21] Read Rust Atomics and Locks - Happens-Before Relationship

> by Mara Bos

> From: The Memory Model

> To: The Memory Model

> At Topics: Chapter 3. Memory Ordering

## Recaps

### The Memory Model

Q: Why we need the memory model?

A: The different memory ordering options have a strict formal definition. To avoid being tied to the specifics of particular processor architectures, it is defined based on an abstract memory model.

## Notes

The memory model does not talk about a concrete computer behavior. Instead, it only defines situations where one thing is guaranteed to happen before another thing and leaves the order of everything else undefined (aka. happens-before relationships).

Eg.

The basic happens-before rule is that everything that happens within **the same thread** happens **in order**. Eg, if a thread is executing `f(); g();`, then `f()` happens-before `g()`.

> Between threads, *happens-before relationships* only occur in a few specific cases:
> - Spawning and joining a thread
> - Unlocking and locking a mutex
> - Through atomic operations that use non-relaxed memory ordering.

- Relaxed memory ordering is the most basic and most performant memory ordering.
- Relaxed memory ordering never results in any cross-thread happens-before relationships.

Eg.

```rust
use std::sync::atomic::AtomicI32;
use std::sync::atomic::Ordering::Relaxed;
use std::thread;

static X: AtomicI32 = AtomicI32::new(0);
static Y: AtomicI32 = AtomicI32::new(0);

fn a() {
    // it has happens-before relationship in a()
    X.store(10, Relaxed);
    Y.store(20, Relaxed);
}

fn b() {
    // it has happens-before relationship in b()
    let y = Y.load(Relaxed);
    let x = X.load(Relaxed);
    println!("{x} {y}");
}

fn main() {
    thread::scope(|s| {
        // it does not have happens-before relationship between a nd b
        s.spawn(a);
        s.spawn(b);
    });
}
```

The code above tells us two things:

1. All `0 0`, `10 20`, `10 0`, `0 20` are valid outcomes, even though `0 20` will never happen in this case
2. From the perspective of the thread executing `b`, operations in `a` might happen in any order

### Spawning and Joining

- Spawning a thread creates a happens-before relationship between what happened before the `spawn()` call, and the new thread
- Joining a thread creates a happens-before relationship between the joined thread and what happens after the `join()` call

```rust
use std::sync::atomic::AtomicI32;
use std::sync::atomic::Ordering::Relaxed;
use std::thread;

static X: AtomicI32 = AtomicI32::new(0);

fn main() {
    X.store(1, Relaxed); // this operation always runs before `spawn`
    let t = thread::spawn(f);
    X.store(2, Relaxed);
    t.join().unwrap();
    X.store(3, Relaxed); // this operation alwats runs after `join`
}

fn f() {
    let x = X.load(Relaxed);
    // the assertion here never fails
    // But we do not know whether load or store(2) will go first, so x can be either 1 or 2
    assert!(x == 1 || x == 2);
}
```

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
