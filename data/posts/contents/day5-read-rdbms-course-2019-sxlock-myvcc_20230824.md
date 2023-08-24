# [Day5] 讀 RDBMS 課程 2019 - SX Lock and MVCC

> By Triton Ho

> At Lesson 1: Page 23 - Page 27

## Notes

### SX Lock and MVCC

> SX lock: Shared-exclusive Lock

- 用途: 達到 isoliation 避免 race condition
- Oracle 和 PostgreSQL 使用 MVCC ，而 MySQL 和 MSSQL 使用 SX lock
- 就單一 TX 而言 ， MVCC 使用比較多的 IO 還有 CPU ，所以比較花時間
    - 因為要決定那個版本才是「最新」
    - 因為要管理舊的版本的刪除
- 在高流量環境， MVCC 比較高效能
    - 因為 MVCC 的 READ 永遠不被阻擋，同一時間資料庫能處理更多的 TX
    - MVCC 只有 X lock 而沒有 S lock ，其 Deadlock detector 要管理的 lock 的數目一定更少，所以一定比較快

#### SX Lock

> aka. Readers–writer lock(RW lock)

- 在資料庫中，每一個 Record 都有其 SX lock
- 所有由 TX 擁有的 lock ，會在 TX 結束時自動歸還 (S Lock 視 Isolation level 決定歸還時間)
- S lock 是對應資料讀取的， X lock 是對應資料改動
- 因為 S lock 能發給多個 TX ，所以同一時間能有多個 TX 讀取同一塊資料
- 發行 X lock 時， Record 必須沒有其他的 lock (不管是 S 還是 X)。直到該 X lock 結束之前，該 Record 都不能發行其他的 lock

#### MVCC

> Multiversion concurrency control

- 最簡單來說，每次的 insert/update 會為該 Record 增加額外的版本
- 所以，Record 的每個版本都儲有時間(或相似東西)，讓 RDBMS 知道那份版本才是最新的
- Record 太舊的版本會被 RDBMS 自動刪除
- MVCC 的資料庫的 Record 只有 X lock ，而沒有 S lock
- MVCC 在讀取時，會讀最該 Record 「最新」的 Committed 版本，所以 自然地沒有了 Dirty Read
- MVCC 只有 WRITE-WRITE conflict ，所以 MVCC 的 Read 永遠不會被阻擋

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
