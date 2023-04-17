# [Day3] Read Rust Atomics and Locks

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Recalls

What is `.join()`? => make sure the threads are finished before we return from `main`

```rust
fn main() {
    let t1 = thread::spawn(f);

    // use JoinHandle to ahcieve it
    // The .join() method waits until the thread has finished executing 
    // and returns a std::thread::Result.
    // unwrap() is for panic
    t1.join().unwrap();
}
```

## Notes

- The `std::thread::spawn` function is actually just a convenient shorthand for `std::thread::Builder::new().spawn().unwrap()`

    Eg:
    ```rust
    let numbers = Vec::from_iter(0..=1000);

    let t = thread::spawn(move || {
        let len = numbers.len();
        let sum = numbers.iter().sum::<usize>();
        sum / len
    });

    let average = t.join().unwrap();

    println!("average: {average}");
    ```

- A `std::thread::Builder` can: eg set size, give thread a name
- The `std::thread::spawn` function simply panics if it is unable to spawn a new thread => by `std::io::Result`

## Not Understand Yet

- for loop in closure: &number vs number

    ```rust
    let numbers = vec![1, 2, 3];

    thread::spawn(move || {
        for n in &numbers { // <== here
            println!("{n}");
        }
    }).join().unwrap();

    // vs

    let numbers = vec![1, 2, 3];

    thread::spawn(move || {
        for n in numbers { // <== here
            println!("{n}");
        }
    }).join().unwrap();
    ```


## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)