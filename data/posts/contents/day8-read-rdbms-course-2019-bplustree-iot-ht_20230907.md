# [Day8] 讀 RDBMS 課程 2019 - B+ Tree, Index-Organized Table, Heap Table

> By Triton Ho

> At Lesson 2: Page 3 - Page 27

## Notes

### B+ Tree

- 主流的 RDBMS eg. PostgreSQL, MariaDB, Oracle 用來實現 Indexing 的方式

> Primary key, Unique Constraint 背後也是 index

- Height of B+ Tree is O(log n), and is normally <= 4
    - only need 4 disk read to find the data
    - Besides, in the real world, non-leaf node is always cached in memory, so disk read is ~= 1
- 如果2個 TX 改動的 record 不在同一 data page ，他們便能同時更
動 B+ tree
- Auto balancing

> balanced 和 even distributed 不是同一概念，請注意

### Index-Organized Table (IOT)

優點：

- 因為 Records 全都順序整理好了，在 range scan on Primary Key 時非常快
- Less storage I/O

缺點：

- 如果 PK 是有規律的 (eg. auto-increment)，讀取/寫入很容易集中在少量的 leaf-node 中，引發 Contention (競爭) 問題 => 併發性的 blocking 問題產生
- 因為整個 Records 都存放於 B+ tree 的 leaf node ，每個 leaf node 能存的 rows 有限

### Heap Table

Record data 「隨意」找一個 data page 存放。 Primary key 獨立放在一個 B+ tree index ，並且在 index leaf node 儲存指向 data page 的 pointer

優點：

- 因為 index leaf node 只存放 (PK + pointer)
    - 一個 index leaf node 可以存放更多的 rows ，leaf node splitting/merging 自然大減
    - 即使發生 index leaf node splitting/merging ，也不會令 row data 需要移動位置
- Record data 能存放到 heap 中任何一個 data page ，沒有指定位置
    - 即使 PK 是用上 auto-increment ，相近 PK 的 row 仍然會散落到整個 heap 之內，先天性不容易發生 data page contention
    - 在 insert new rows 時， Record data 輕易能找一個沒有正被改動中的 datapage 來寫入。不容易發生 blocking

缺點：

- Range Scan on PK 一般需要整個 table 都作一次 scaning ，極吃 IO
    - 若很少使用 range scan on PK ，這個缺點便不算是缺點，例如 OLTP (Online Transaction Processing) 系統
    - 若是做數據分析/產生報表的 OLAP (Online Analytical Processing) 系統，這便是缺點
- 只少需要兩次 storage IO 才能找到一個 row
    - 一次是在 index leaf node 找到 data page 的 pointer
    - 一次是在 data page 找到 row data

### Conclusion

- 有沒有 range scan on PK ，決定了你應該用那一種 table structure
- Cache hit rate 是應該被重視的，但不應被過份追求

> Cache hit rate: 指的是在 memory 中找到需要的資料的機率

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
