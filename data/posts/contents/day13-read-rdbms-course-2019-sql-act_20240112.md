# [Day13] 讀 RDBMS 課程 2019 - The Act of SQL

> Author: Triton Ho

> At Lesson 3: Page 36 - End

## Notes

- 不應該輕易使用 looping
  ```golang
  // very bad
  flight_no_array:=[]string{“BR892”,“BR893”} for _, flight_no in range flight_no_array {
    executeStatement(`Update flight set enabled = false where flight_no = $1`, flight_no)
  }
  ```
- 如果使用 looping 請一個接一個地發出指令
- SQL 支持 check-and-set: `UPDATE ... WHERE ...`
- SQL 支持 stored procedure (trade off: algorithm in stored procedure or in application tier)
- SQL 不應該太長 (請善用 transaction)
- 善用 Temporary table 寫報表
  - 每個 Connection 有專屬的 Temp table ，不會互相干涉(no locking / blocking)
- 在 OLTP 中，不應該為了迴避 joining 而作 denormalization
- 避免使用 anti-join: `not in`, `not exists` => use `EXCEPT` instead (其實我還沒搞懂哪些是 anti-join)

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
