# [Day15] 讀 RDBMS 課程 2019 - Common Mistakes in Large System Architecture

> Author: Triton Ho

> At Lesson 4: Page 27 - Page 45

## Notes

### Check API Design

1. 單一行動請不要用2個 Request 來處理
    - 例如：轉帳請不要用兩次 PUT User_balances API ，而是用一次 POST Transfer API
    - 避免 race condition

### Prevent Positive Feedback

> Postive feedback: 簡言之，就是使用者不斷按重新整理導致 request 大增

1. 可以先讓部分網頁顯示
2. 可以先接收使用者的 Request (HTTP 202(Accepted))
    - 很多網上訂位系統，都是先收下用戶指令，然後再慢慢處理
3. 對部份用戶返回 HTTP 503

### Defend Unnormal Request

1. 請先在 application tier 阻擋有問題的 request

### Cache

- 原本有 n 台 caching 主機，新增主機至 m 台後應該先 `mod(md5(key), m)` 看看新位置有否有資料，若沒有則去 `mod(md5(key), n)` 取得資料
- 不應該將 hot data 只放在一台 caching 主機上

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
