# [Day4] 讀 RDBMS 課程 2019 - Read Phenomena

> By Triton Ho

> At Lesson 1: Page 14 - Page 22

## Notes

Three types: dirty read, non-reapeatable read, phantom read

### Dirty Read

- 能讀取其他還未 committed 的 TX 的資料改動
- 在還未 Commit 之前， database 是處於 inconsistent state (不應該被其他人看到)
- 任何情況下， Dirty Read 在 RDBMS 都應該避免的

> MySQL, Oracle, PostgreSQL default dirty read will never happen

### Non-repeatable read

> Non-repeatable read vs. Phantom read!!

- 讀取的資料包含其他已經 committed TX 的 **update** ，而這些 TX 的 commit 時間發生在此 TX 的開始之後 (同一個 TX ，同一筆資料在第一次讀取和第二次讀取出現不同結果)
- 第一次 Query 和第二次返回是同一批的 Record ，但是 Record 的**內容不同**了
- 一般來說，同一數據的第一次 select 是用作 data verification ，第二次是用作 data processing。如果 verification 和 processing 是使用不同的數值， 那麼 verification 根本沒意義

### Phantom read

> Non-repeatable read vs. Phantom read!!

- 讀取的資料包含其他已經 committed TX 的 **insert/update** ，而這些 TX 的 commit 時間發生在本 TX 的開始之後 (同一TX，同一 Query 在第一次和第二次執行時，出現不同結果)
- 第二次返回的結果比第一次多了 Record
- Phantom read 會讓第二次的 query 出現了新的 Record (Phantom = 阿飄)

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
