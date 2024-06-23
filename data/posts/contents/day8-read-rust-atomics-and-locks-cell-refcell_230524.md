# [Day8] Read Rust Atomics and Locks - Cell, RefCell

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Recall

### Interior Mutability

Why do we need interior mutability?

Ans: Threads following the common borrowing rules makes communication between each extremely limited, since no data can be mutated. By interior mutability and under certain conditions, data can allow mutation through an "immutable" reference

- Interior mutability only bends the rules of shared borrowing to allow mutation when shared
- Interior mutability does not change anything about exclusive borrowing

## Notes

### `Cell<T>`

- `std::cell::Cell<T>`
- `Cell` has interior mutability.
- If `T` is `Copy`, it allows you to copy the value out (with `get` method).
- All types `T` can be replaced with another value as a whole.
- It can only be used within a single thread.

Let's compare the following two functions:

```rust
// nothing in the entire program can "mutably borrow" the integer that `a` refers to as long as `a` is borrowing it.
fn f1(a: &i32, b: &mut i32) {
    let before = *a;
    *b += 1; // never incrementing the integer that a refers to
    let after = *a; // 'after' never changes from `*b += 1`
    if before != after {
        x(); // never happens
    }
}

// v.s.

use std::cell::Cell;

fn f2(a: &Cell<i32>, b: &Cell<i32>) {
    let before = a.get();
    b.set(b.get() + 1); // Both a and b might refer to the same value, such that mutating through b might affect a as well
    let after = a.get();
    if before != after {
        x(); // might happen, because Because a Cell<i32> has interior mutability
    }
}
```

In addition, `Cell` **can’t** directly let us borrow the value it holds. We need to move a value out and leave something in its place in advance, modify it, and then put it back to mutate its contents:

```rust
fn f(v: &Cell<Vec<i32>>) {
    let mut v2 = v.take(); // Replaces the contents of the Cell with an empty Vec (leaving "something" in its place)
    v2.push(1);
    v.set(v2); // Put the modified Vec back into the Cell
}
```

### `RefCell<T>`

- `std::cell::RefCell`
- Better than `Cell`, it allows you to borrow its contents (call `borrow()` or `borrow_mut()`)

    ```rust
    // source: https://github.com/m-ou-se/rust-atomics-and-locks/blob/d945e828bd08719a2d7cb6d758be4611bd90ba2b/examples/ch1-07-refcell.rs
    use std::cell::RefCell;

    fn f(v: &RefCell<Vec<i32>>) {
        v.borrow_mut().push(1); // We can modify the `Vec` directly.
    }

    fn main() {
        let v = RefCell::new(vec![1, 2, 3]);
        f(&v);
        assert_eq!(v.into_inner(), vec![1, 2, 3, 1]);
    }
    ```

- It has a counter for outstanding (仍然存在的) borrows
- It can only be used within a single thread (like `Cell`)
- concurrent version of a RefCell is ` RwLock<T>`

### `RefCell` vs `Cell`

|| `Cell` | `RefCell` |
|---|---|---|
| Can be borrowed | No | Yes |
| Can be borrowed mutably | No | Yes |
| Can be used across multiple threads | No | No |

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [`Cell<T>`](https://doc.rust-lang.org/std/cell/#cellt)
