# [Day6] 讀 RDBMS 課程 2019 - Isolation levels

> By Triton Ho

> At Lesson 1: Page 28 - End

## Notes

4 levels:

- Read Uncommitted
- Read Committed: Prevent Dirty Read
- Repeatable Read: Prevent Dirty Read and Non-Repeatable Read
- Serializable: Prevent Dirty Read, Non-Repeatable Read and Phantom Read

### Read Committed

SX Lock:

- 「改動」前，為 Record 加上 X LOCK ，直到 TX 完結
- 「讀取」(Read) 前，為 Record 加上 S LOCK ，在 statement 結束後立馬歸還
- 其他試圖讀取/改動這些 rows 的 TX 將會等待 (blocked)，直到本 TX 完成
- **改動會阻擋讀取**

MVCC:

- 進行 insert/update/delete 時，會先為 Record 其加上 X LOCK，直到 TX完成
- Read Record 時，只會考慮已經 committed 的最新版本

> 即使 Record 已被加上 X lock ， Read 也不會被阻擋

- 當兩個 TX 想改動同一 Record 時，其中一個才被阻擋

#### Practical Recommendations

To prevent Non-Repeatable Reads:

Utilizing "Conflict Promotion" within the Read Committed isolation level to prevent Non-Repeatable Reads, instead of relying on the built-in Repeatable Read isolation level of the RDBMS

> Conflict Promotion: 在 checking 時，在 `select` 的指令尾部加入 `for share` ，讓所有讀取過的 Record 被加上 S lock ，直到 TX 結束 => 比用 Repeatable Read mode 更精準地控制資料

> MVCC 的資料庫不一定有 `for share` ，改用 `for update` 去拿 X lock 也有相同效果

To prevent Phantom Read:

不建議使用 Serializable Isolation level，而是用 Conflict promotion + Conflict materialization 來預防

以下是 Conflict materialization 的意思:

如果兩個 table 存在 parent-child 關係

- 所有對 child record 的 Read 都要為其 parent record 加上 S lock
- 所有對 child record 的 Write 都要為其 parent record 加上 X lock

=> 當對 child table 加入新 record 時，便會跟其他正在讀取該範圍(指同一 parent )的 TX 的 S lock 發生碰撞， 讓其 insert 被阻擋

### Repeatable Read

SX Lock:

- 「改動」前，為 Record 加上 X LOCK ，直到 TX 完結
- 「讀取」(Read) 前，為 Record 加上 S LOCK ，在 **TX** 結束後歸還
- **改動會阻擋讀取並且讀取會阻擋改動**

> 很容易引起 deadlock

MVCC:

- 讀取資料時，只考慮在 **TX 開始前**已經 committed 的版本 (aka. snapshot isolation)
- 改動資料時，除了拿取 X lock ，還檢查 Record 是否存在 TX 開始後的 Committed 版本。如果存在，便 raise exception 並強制 Rollback 目前 TX

> PostgreSQL: could not serialize access due to concurrent update

### Serializable

> 極度吃 CPU 也極容易引起 deadlock ，沒特別原因別使用這模式

SX Lock:

- predicate lock: 例如 `where age between 20 and 35`
- based on Repeatable Read, when executing a query, in addition to applying READ_LOCK to the rows that will be read, a predicate lock is also added.
- 其他 TX 的 insert/update ，只要影響到的 rows 滿足 predicate lock 的範圍，那個 TX 也會被阻擋

MVCC:

- 當有新版本的 committed rows 滿足 predicate ，而其版本是在本 TX 開始的時間點後，則本 TX raise exception 並且 rollback
- Oracle 沒有這個級別
- 在 MVCC 世界中的 Serializable Isolation ，是專門用來防範 write skew 的

> skew: skew (a kind of phantom read) is a phenomenon in which a transaction reads data that is written by another transaction that commits after it started reading the data, but before it commits.

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
