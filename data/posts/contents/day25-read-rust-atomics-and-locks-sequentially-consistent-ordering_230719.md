# [Day25] Read Rust Atomics and Locks - Sequentially Consistent Ordering

> by Mara Bos

> At Topic: Chapter 3. Memory Ordering, Sequentially Consistent Ordering

## Recaps

When working with atomics (mutating data that's shared between threads), we have to explicitly tell the compiler and processor what they can and can't do with our atomic operations by the `std::sync::atomic::Ordering` enum.

Which are:

- Relaxed ordering: `Ordering::Relaxed`
- Release and acquire ordering: `Ordering::{Release, Acquire, AcqRel}`
- Sequentially consistent ordering: `Ordering::SeqCst`

## Notes

- The strongest memory ordering
- `Ordering::SeqCst`
- Each operation using SeqCst memory ordering contributes to a global order in which all operations are arranged
- And the total order of operations on shared variables is consistent with the total modification order of each individual variable
    - Eg. if thread A writes a value to variable X and then thread B writes another value to variable X, all other threads will observe these writes to variable X in the same order (A's write first, then B's write) as they occurred in the program's execution.
- Because it is strictly stronger than acquire and release memory ordering, we can use `SeqCst + Release` or `SeqCst + Acquire` and it still works fine

> Only when both sides of a happens-before relationship use SeqCst ordering is it guaranteed to be consistent with the single total order of SeqCst operations.

- However, only rare cases need `SeqCst`, while acquire and release ordering suffice

Here is an example:

```rust
// source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/main/examples/ch3-10-seqcst.rs
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering::SeqCst;
use std::thread;

static A: AtomicBool = AtomicBool::new(false);
static B: AtomicBool = AtomicBool::new(false);

static mut S: String = String::new();

fn main() {
    let a = thread::spawn(|| {
        A.store(true, SeqCst);
        if !B.load(SeqCst) {
            unsafe { S.push('!') };
        }
    });

    let b = thread::spawn(|| {
        B.store(true, SeqCst);
        if !A.load(SeqCst) {
            unsafe { S.push('!') };
        }
    });

    a.join().unwrap();
    b.join().unwrap();
}
```

The code tells us:

- Both store operations maybe happen before either of the load operations, and neither thread ends up accessing `S`
- But both threads to access `S` is impossible, because in every possible single total order, the first operation will be a store operation preventing the other thread from accessing `S`.

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks.](https://github.com/m-ou-se/rust-atomics-and-locks)
