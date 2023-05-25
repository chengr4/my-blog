# [Day8] Read Rust Atomics and Locks - Cell, RefCell

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Recalls

### Interior Mutability

Why do we need interior mutability?

Ans: Threads following the common borrowing rules makes communication between each extremely limited, since no data can be mutated. By interior mutability and under certain conditions, data can allow mutation through an "immutable" reference

- Interior mutability only bends the rules of shared borrowing to allow mutation when shared
- Interior mutability does not change anything about exclusive borrowing

## Notes

### Cell

- `std::cell::Cell<T>`
- If `T` is `Copy`, it allows you to copy the value out
- Or replace the value with another value as a whole (not allow to borrow its content)
- It can only be used within a single thread
- `Cell` has interior mutability

Let's compare the following two functions:

```rust
// nothing in the entire program can mutably borrow the integer that `a` refers to as long as `a` is borrowing it.
fn f(a: &i32, b: &mut i32) {
    let before = *a;
    *b += 1; // incrementing the integer that b refers to
    let after = *a; // *a will not change
    if before != after {
        x(); // never happens
    }
}

use std::cell::Cell;

fn f(a: &Cell<i32>, b: &Cell<i32>) {
    let before = a.get();
    b.set(b.get() + 1); // Both a and b might refer to the same value, such that mutating through b might affect a as well
    let after = a.get();
    if before != after {
        x(); // might happen, because Because a Cell<i32> has interior mutability
    }
}
```

In addition, Since `Cell` can’t directly let us borrow the value it holds, we need to move a value out (leaving something in its place), modify it, then put it back, to mutate its contents:

```rust
fn f(v: &Cell<Vec<i32>>) {
    let mut v2 = v.take(); // Replaces the contents of the Cell with an empty Vec (leaving something in its place)
    v2.push(1);
    v.set(v2); // Put the modified Vec back
}
```

### RefCell

- `std::cell::RefCell`
- Unlike `Cell`, it allows you to borrow its contents (call `borrow()` or `borrow_mut()`)

    ```rust
    use std::cell::RefCell;

    fn f(v: &RefCell<Vec<i32>>) {
        v.borrow_mut().push(1); // We can modify the `Vec` directly.
    }
    ```

- It has a counter for outstanding (未處理的) borrows
- It can only be used within a single thread

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
