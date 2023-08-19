# [Day2] 讀 RDBMS 課程 2019 - Misconceptions about RDBMS

> By Triton Ho

> At Lesson 0: Page 28 - End

## Notes

- NoSQL 正是發明來解決像 facebook 這種巨型系統的東西
- Line 是用 HBase (2019)
- 在中小型資料庫/只面對地區性用戶的系統， RDBMS 的可信度遠大於 NoSQL
- 用 rabbitMQ 來做 IPC (inter process channel) 

### Misconceptions about RDBMS

- 24x7 是指沒有計劃外的 downtime ，不是沒有 downtime
- RDBMS 也能 flexible schema
    - 但是中小型 DB (eg. 總數據量 <100GB) 不應該使用之
- RDBMS 可能比 NoSQL 「慢」，但是他卻多做了很多事
    - Support multi-row, multi-statement atomicity
- Database 存放 log
    - 小型系統使用 txt 檔案取代之
    - 大型系統使用 logging software (eg. Amazon Kinesis)

### ORM

- 在一般 OLTP 系統 (Online Transaction Processing)，有不少的場合都是讀取/建立/改動/刪除單一的物件 (Object)
- 良好的 DB Design，大部分的 Model Class 都是對應單一的 table
- 若好好設定 table 對應的 class 、 class 的 attribute 對應的 column 、 class 的 primary key 等， ORM 能自動產生出 select/insert/update/delete 的 SQL => 加速開發時間，減少人為出錯
- 善用切碎 statement 來達到目的


## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
- https://www.mongodb.com/docs/manual/core/transactions/
