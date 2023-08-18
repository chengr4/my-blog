# [Day1] 讀 RDBMS 課程 2019 - RDBMS 和 ACID

> By Triton Ho

> At Lesson 0: Page 1 - Page 27

## Prerequise

### NoSQL 的 2pc

- Two-Phase Commit
- Prepare Phase and Commit Phase
- 分佈式事務處理協議
- 讓分佈式系統中的 nodes 可以在一致的狀態下進行 commit 或 rollback

## Notes

### 為何選擇 RDBMS

- 使用 RDBMS 比 noSQL 有更快的開發速度 
- 對一般中小型系統， RDBMS 效能足夠了 
- 使用 RDBMS 更加安全
- RDBMS 支援十進制的 numeric (支援浮點數) ，在計算金錢數 值時特別有用

### ACID

#### Atomicity

- RDBMS 所有運作都是以 Transaction (TX) 為單位
- **一個 TX 可以自由包含多個 SQL 指令**
- **同一 TX 內的所有資料改動必須全部被順序執行，或是同一 TX 內所有資料改動都不被執行**
- 在當機時，所有還沒有 commited 的 TX 全被 Rollback
- 當機後，需要修復資料時。 RDBMS 必須以 TX 為單位進行修復

Why Atomicity is important?

- 當機是不能避免的
- 讓許多情境能簡單完成

    ```sql
    <!-- 用戶轉帳 -->
    START TRANSACTION;
    Update user_balance set balance = balance – amount where username = 'UserA'; 
    Update user_balance set balance = balance + amount where username = 'UserB'; 
    COMMIT;
    ```
- 保證系統數據 consistent state 直接移到下一個 consistent state

#### Consistency

- 不同人對 Consistency 定義不完全相同 (= =")
- 系統的 Unique constraint 和 User-customized constraint 都必須滿足，否則，RDBMS 將會自動復原當前 TX 一切資料改動

Why Consistency is important?

- 有錯誤就 rollback TX，不用動腦讚拉
- 在 noSQL 的 2pc ，有一半以上的程式碼花在當機後怎來復原資料
- **Atomicity 保證系統數據安全地移到下一個正確狀態; Consistency 保證系統在移動失敗時，能安全地回到本來正確狀態。**

#### Isolation

- 同一筆資料，RDBMS 保證不會同時被兩個 TX access
- 多層級的 Isolation ，能讓 application 只看到應該看到的資料
- RDBMS 能自動管理 LOCK (自動避免 race condition) 。換言之，如果沒有 RDBMS 的 Isolation ，便需要額外的 locking 系統
- 在 RDBMS 世界， update 會自動為受影響的數據加上 WRITE lock ，並且自動在 TX 結束時釋放，以保證一份資料不能被同時改動。
- RDBMS 支持 atomic check-and-set 模式: 檢查用戶是否有足夠錢和改動戶口餘額是在同一 statement 內完成

#### Durability

- 一旦 Committed 的資料改動，除非存儲空間受損，否則永不流失

>  MongoDB 標準設定是沒有等待 Disk WRITE 

- 一旦斷電了， RDBMS 將會以 TX 為單位進行 Data Recovery ，保證資料庫不會停留在不正確的狀態。也就是說，RDBMS 的使用者不應該處理當機而發生的數據錯誤

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)

