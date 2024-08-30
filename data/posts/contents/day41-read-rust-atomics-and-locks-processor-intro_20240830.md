# [Day41] Read Rust Atomics and Locks - Processor Introduction

> by Mara Bos

> At Topic: Chapter 7

## Notes

Two main specific processor architectures:

### x86

- CISC, complex instruction set computer
- Able to directly operate on memory
- Intel + AMD
- Mainly used in desktops, laptops, servers and game consoles
- x86-16 and x86-32 are mainly dominated by Intel
- x86-64: AMD64, IA-64 (Intel) and more popular AMD's extensions IA-32e (Intel), EMT64T (Intel), Intel 64
- ARM64

### ARM64

> aka. AArch64

- RISC, reduced instruction set computer
- Loading and storing ot memory takes a seperate instruction
- Mainly used in modern mobile devices, embedded systems, and increasingly in laptops and desktops
- E.g. cars, electronic COVID tests

### Assembly

```
ldr x, 1234 // load from memory address 1234 into x
li y, 0     // set y to zero
inc x       // increment x
add y, x    // add x to y
mul x, 3    // multiply x by 3
cmp y, 10   // compare y to 10
jne -5      // jump five instructions back if not equal
str 1234, x // store x to memory address 1234
// =>
         ldr x, SOME_VAR
         li y, 0
my_loop: inc x
         add y, x
         mul x, 3
         cmp y, 10
         jne my_loop
         str SOME_VAR, x
```

- Registers (part of the processor, hold a single integer or memory address): `x`, `y`

## References

- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/)
- [並行程式設計](https://hackmd.io/@sysprog/concurrency/https%3A%2F%2Fhackmd.io%2F%40sysprog%2FS1AMIFt0D)
- [Code examples of Rust Atomics and Locks](https://github.com/m-ou-se/rust-atomics-and-locks)
