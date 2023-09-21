# [Day31] Read Rust Atomics and Locks - A safe Spin Lock with a Lock Guard

> by Mara Bos

> At Topic: Chapter 4. A Safe Interface Using a Lock Guard

> Recommendation: Start reading from the beginning of the chapter to get the full picture

## Prerequisites

### Lifetime Annotations in Struct Definitions

Eg. Struct `ImportantExcerpt` has the single field part that holds a string slice, which is a reference. `'a` means an instance of `ImportantExcerpt` can’t outlive the reference it holds in its `part` field.

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}
```

### `Deref`

- Enable dereferencing with the `*` operator
- Enable to use the method of the inner type directly on the outer type of struct
- `DerefMut` is the same as `Deref` but for mutable references

## Recall

What is spin lock?

Instead of putting the thread to sleep, the thread will continuously attempt to lock the locked lock

When to use spin lock?

If a lock is only ever held for **very brief moments** and the threads locking it can run in parallel on different processor cores.

## Notes

To be able to provide a fully safe interface, we need to tie the unlocking operation to the end of the `&mut T`.

How to do it?

1. wrapping reference of SpinLock in our own type that behaves like a reference. => use type `Guard` + `Deref` trait + `DerefMut` trait
2. implements the `Drop` trait to do something when it is dropped.

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/src/ch4_spin_lock/s3_guard.rs
use std::ops::{Deref, DerefMut};
use std::cell::UnsafeCell;
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering::{Acquire, Release};

pub struct SpinLock<T> {
    locked: AtomicBool,
    value: UnsafeCell<T>,
}

// implement `Send` trait to make sure that the data can be shared between threads
unsafe impl<T> Sync for SpinLock<T> where T: Send {}

// it effectively guards the state of the lock, and stays responsible for that state until it is dropped.
pub struct Guard<'a, T> {
    // use ref because we want to be able to access UnsafeCell and AtomicBool
    lock: &'a SpinLock<T>,
}

unsafe impl<T> Sync for Guard<'_, T> where T: Sync {}

impl<T> SpinLock<T> {
    pub const fn new(value: T) -> Self {
        Self {
            locked: AtomicBool::new(false),
            value: UnsafeCell::new(value),
        }
    }

    pub fn lock(&self) -> Guard<T> {
        while self.locked.swap(true, Acquire) {
            std::hint::spin_loop();
        }

        // Our Guard type has no constructor and its field is private meaning this is the only way the user can obtain a Guard => spin lock has been locked
        Guard { lock: self }
    }
}

impl<T> Deref for Guard<'_, T> {
    type Target = T;
    fn deref(&self) -> &T {
        // Safety: The very existence of this Guard
        // guarantees we've exclusively locked the lock.
        unsafe { &*self.lock.value.get() }
    }
}

impl<T> DerefMut for Guard<'_, T> {
    fn deref_mut(&mut self) -> &mut T {
        // Safety: The very existence of this Guard
        // guarantees we've exclusively locked the lock.
        unsafe { &mut *self.lock.value.get() }
    }
}

// we do not need unsafe unlock method no more (see day 30)
impl<T> Drop for Guard<'_, T> {
    fn drop(&mut self) {
        self.lock.locked.store(false, Release);
    }
}

#[test]
fn main() {
    use std::thread;
    let x = SpinLock::new(Vec::new());
    thread::scope(|s| {
        // we can call push method because we implement Deref and DerefMut
        s.spawn(|| x.lock().push(1));
        s.spawn(|| {
            let mut g = x.lock();
            g.push(2);
            g.push(2);
        });
    });
    let g = x.lock();
    assert!(g.as_slice() == [1, 2, 2] || g.as_slice() == [2, 2, 1]);
}
```

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
- [Lifetime Annotations in Struct Definitions](https://doc.rust-lang.org/stable/book/ch10-03-lifetime-syntax.html#lifetime-annotations-in-struct-definitions)
