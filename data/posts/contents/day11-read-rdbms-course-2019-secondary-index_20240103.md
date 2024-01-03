# [Day11] 讀 RDBMS 課程 2019 - Secondary Index

> Author: Triton Ho

> At Lesson 3: Page 15 - Page 24

## Notes

- aka. non-clustered index
- index 是犧牲 WRITE 效能去提升 READ 的效能

### Question to ask yourself, before adding index

1. 如果你要增加的是 unique index ，你有強烈原因不讓它作為 table 的 Natural key 嗎? (沒搞懂原因)
2. 你的資料庫是讀重要還是寫重要?
3. non-unique index 能使 candidate records 數目變到 100 下。 E.g.

    ```sql
    -- 創建非唯一索引
    CREATE INDEX idx_category ON products(Category);

    -- 查詢某一商品類別的商品
    SELECT * FROM products WHERE Category = 'Electronics';
    ```
4. 是否真的需要「即時性」的資料?

### 是否需要 Index

- 若已經做了 time-based partitioning ，也許不需要再做 index
- 若只是偶爾查詢， Full Table Scan 並不是不好的選擇

> p.s Sequential Read 原則上不應該大於5秒

- 如果用戶多數時只關心「活躍」的 Record ，你可以考慮把 table 分割
    - 已完成的訂單、未完成的訂單

### Index and Good schema

建立 user table 若有 Oauth 功能，可以考慮建立三個 table: user, user_name_login, user_facebook_login => 不需要 secondary index ，而且體 index 體積也較小

### Loose index

- 在支援 loose index 的 RDBMS 要建立 composite PK 時，最有機會在 `where` clause 的 column 放在前面

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
