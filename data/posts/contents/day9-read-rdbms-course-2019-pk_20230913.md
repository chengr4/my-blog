# [Day9] 讀 RDBMS 課程 2019 - Primary Key

> By Triton Ho

> At Lesson 2: Page 28 - End

## Notes

- Nature Key: Eg. 身份證號碼, Email, 航班日期 + 航班編號
- Surrogate Key: no specific meaning key, Eg. auto increment, UUID
- 一般商業系統(不考慮報表的部份)，90%的資料讀取/改動都是基於 PK 的
- 同一時期建立的 Record ，它們相近時間被改動/刪除的可能性比較高
    - 所以為了避免發生 Contention ，不應該把同一時期建立的 Record 集中儲存在一起
    - 但也不能過份分散 (影響: Cache hit rate)
- Random PK 會引發大量 Random IO => 會，但若是 heap table ，Random IO 只集中在體積很小的 PK index

### Nature Key

Pros:

- 不用再額外建立 Secondary index
    - Eg. 若以 Email 作登入的系統，即使不用 Email 作為 PK ，還是要為 email 建立 index 吧
- In general, there is enough randomness to avoid contention

Cons:

- Natural Key 有機會失效
- 部份 ORM 對 composite key 的支援不好，開發時很麻煩

### Surrogate Key

Pros:

- 系統邏輯被更動， Surrogate key 幾乎都不受影響的
- PK index and FK index have smaller size

Cons:

- Auto increment 本身是一個潛在的 Contention 問題
- 單純地使用 Auto increment 會讓所有的 insert 集中在 B+ tree 的其中一邊
    - Insert 可能造成 contention
    - Delete 時造成 B+ tree uneven distribution
- UUID 不能保證 100% 的 uniqueness ，只是相撞可能性很很低

### Monotonic Increasing PK

- Eg. Auto increment, timestamp
- Problem: 同一時期的 record ，集中在 PK index 的某一邊 => MI PK 會造成 PK index 一邊不停 splitting ，一邊不停的 merging

## More to read

- Rodo log
- Undo log
- check point
- background writer: 每隔一段時間，檢查一次 buffer pool ，把 dirty page 寫回 disk

> dirty page: buffer pool 中的 page 被改動過，但尚未寫回 disk

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
