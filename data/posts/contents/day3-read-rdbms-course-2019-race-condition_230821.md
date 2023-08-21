# [Day3] 讀 RDBMS 課程 2019 - Race Condition

> By Triton Ho

> At Lesson 1: Page 1 - Page 13

## Notes

Why is isolation important?

- 正規化的基礎訓練，能讓你設計系統時能跟蹤前人的智慧，而不是自行發明看起來沒問題的演算法
- 避免 race condition

> 為了最大化效能， RDBMS 會同時處理盡量多的 TX

### Race Condition

Race Condition 的必需條件

1. 同一資源會被同時改動
2. 「檢查」和「資料改動」不是在同一 Atomic operation 中完成

> 註:這是假設有 atomic WRITE 的情況下

#### Safe Case 1

- 讓同一航班所有資料改動都要先拿到該航班 WRITE LOCK ，改動完成後便解除 WRITE LOCK => Eg. Zookeeper Redis
- 缺點: WRITE LOCK 的伺服器可能會當機

#### Safe Case 2

- 為每一航班建立對應的 Queue ，並且，對同一航班的改動，必須先把工作放到對應的 Queue ，然後單線程順序執行
- 因為同一時間只有一個線程正在改動同一份資料，所以不會發生 Race condition
- 缺點: 
    - 麻煩: need MQ Server, worker, server push... 
    - Some scenarios do not fit (eg. money transfer)

#### Safe Case 3

- 善用 RDBMS 的 Atomicity 還有 Isolation

    ```sql
    Update seats set user = $user
    where flight_no='BR855' and flight_date = '16SEP' and user IS NULL;
    <!-- user IS NULL is important -->
    ```

    - And use `AffectedRowCount` to check it
- Keyword: atomic check-and-set

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
