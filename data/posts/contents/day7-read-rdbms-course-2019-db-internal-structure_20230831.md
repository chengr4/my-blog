# [Day7] 讀 RDBMS 課程 2019 - Database Internal Structure

> By Triton Ho

> At Lesson 2: Page 1 - Page 12

## Notes

### File System

- Normally, Most file systems will divide the hard disk into blocks (aka. pages).
- Even if a file is only 1 bytes, it will still occupy 4 KB of space at file system based on 4 KB block size.
- 硬體操作是以區塊為單位
- 每個 page 在同一時間只能被一個 TX 改動

> 把性質相近的 Record 物理性放到一起會提高 cache hit rate ，但是更容易發生 Contention => 就是說:單一 page 能儲存越多的東西，READ的效能會越好，但是 WRITE 效能會越差

### How RDBMS Saves Data?

- RDBMS 建立一個/數個巨型的檔案，然後把空間切成 8KB (postgreSQL, Oracle) 或者16KB (MariaDB) 的區塊
- 一個區塊會被多個 record 共用，並且緊密地排列
    - 不管 Create / Update / Delete 也好，要重新整理 8/16KB 的數據還是很簡單的
- 如果是需要排序的，區塊會用 double-linked list 的方式連結起來

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
