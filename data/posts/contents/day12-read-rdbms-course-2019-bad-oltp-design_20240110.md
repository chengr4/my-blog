# [Day12] 讀 RDBMS 課程 2019 - Bad Schema Design in OLTP

> Author: Triton Ho

> At Lesson 3: Page 25 - Page 35

## Notes

### Bad Design: Smart Column

1. 違反 1NF (所有 column 的 value 都必須是 atomic value) => E.g. 用上了 `array`, `json`, `xml` 等
2. E.g. flight number BR829 應該拆成 BR 和 829 兩個 column => 提高 query 效能 (不需要用上 `%`)

Q: 但是第一點該怎麼解決?

### Bad Design: Denormalization

- E.g. 在 ticket table 中，也存放航次 table 的數據 => 但是這樣會造成資料重複，且不易維護、容易出錯

### Bad Design: 多用途的 Column

- `auth` col 在 password 登入時存 A 資訊，在 OAuth 登入時存 B 資訊

### Bad Design: 多用途的 Table

- **此 pattern 一旦發生，系統必亡**

若出現以下情況，很有可能是多用途的 table:

- Table 的 Column 有很多是 NULL
- Name of Col 是 「type」、「kind」=> 要知道 value 才知道功能

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
