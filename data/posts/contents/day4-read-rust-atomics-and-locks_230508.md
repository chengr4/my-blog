# [Day4] Read Rust Atomics and Locks

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Prerequisites

- Know `'static` : A reference can live for the entire duration of the program

## Notes

- `std::thread::scope` spawn scoped threads => possible to safely borrow local variables. eg:
  
    ```rust
    let numbers = vec![1, 2, 3];

    // it does not have a 'static bound
    // allowing us to ref. anything as long as it outlives the scope, such as number
    thread::scope(|s| {
      s.spawn(|| {
        println!("length: {}", numbers.len());
      });
      s.spawn(|| {
        for n in &numbers {
          println!("{n}");
        }
      });
    }); // the program waits for both spawned threads to finish executing before continuing
    ```

- The "Leakpocalypse": The design of a safe interface cannot rely on the assumption that objects will always be dropped at the end of their lifetime.
    > Eg. a cycle of reference-counted nodes
- Leaking is always a possibility 

## Not Understand Yet

Actually the topic: The Leakpocalypse

---

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [Generic Types, Traits, and Lifetimes - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)