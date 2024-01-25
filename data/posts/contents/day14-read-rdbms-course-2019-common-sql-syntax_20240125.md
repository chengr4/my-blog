# [Day14] 讀 RDBMS 課程 2019 - Common SQL Syntax

> Author: Triton Ho

> At Lesson 4: Page 1 - Page 26

## Notes

### `case when`

- SQL 的 if-else
- 使用時機：通常要修正報表或者資料時會用到

Eg. 

```sql
SELECT * frim students ORDER BY gender
  (
    case
    when gender = 'female' then height
    when gender = 'male' then height * -1
    end
  )
```

### Window Function

- Start from SQL 2003
- 如果沒有 window function => 需要 pagination
- Eg. `ROW_NUMBER() OVER, RANK() OVER`
- (2019 時間點) MYSQL 5.7 不支持、PostgresSQL 不支持 MERGE, Oracle 全面支持、MARIADB 10.2 支持

### `WITH` Clause

- 能在 Query statement 中，建立只給這 statement 使用的 view (modularization)

Eg.

每班成績首三名的學生中，他們之間有兄弟姐妹關係的人

```sql
With top3students as (
  select * from (
    SELECT class_id, student_id, parent_id
      rank() over (partition by class_id order by score desc) as ranking FROM students
  ) t1
  where t1.ranking <= 3
)

Select * from top3students t1 
  where exists (
    Select 1 from top3students t2
      where t1.student_id != t2.student_id and t1.parent_id = t2.parent_id 
  )
```

- 推測：也就是說有重複的 query 時，可以用 `WITH` clause 來避免重複寫

## Recursive Query

- 在 2019 年時語法尚未統一 (儘管 Oracale/PostgresSQL/MYSQL 都有支援)
- 一般來說是為了 tree-like 的資料，像是： 祖譜、物種分類

## Others

- `Insert into...... select`: A table 抄到 B table 很好用

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
