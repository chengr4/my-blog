# [Day2] Read Rust Atomics and Locks

> by Mara Bos

> At Topics: Chapter 1. Basics of Rust Concurrency

## Notes

- A process should always ask OS kernel first and then interact with another process
- in Rust, to spawn a new thread:

```rust
use std::thread;

fn main(){
    thread::spawn(f);
}

fn f() {
    // ...function to do
}
```