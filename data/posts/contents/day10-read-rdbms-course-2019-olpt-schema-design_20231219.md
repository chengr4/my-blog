# [Day10] 讀 RDBMS 課程 2019 - Schema Design of OLTP

> Author: Triton Ho

> At Lesson 3: Page 1 - Page 14

## Recall

What is OLTP?

- Stands for Online Transaction Processing
- Eg. E-commerce, Banking System, Airline Reservation System

What is Aggregation?

- Database combines mutiple records in a dataset to produce a single result. Eg: SUM, AVG, COUNT, MIN, MAX

What is Conflict Promotion?

> Remark: cannot find the explanation of term on the Internet

- When checking, add S lock (eg. `for share` at the end of `select`) to all read records, until the TX ends. =>  equal to "Repeatable Read" isolation level

What is Conflict materialization?

> Remark: cannot find the explanation of term on the Internet

If there is a parent-child relationship between two tables:

=> All parent tables needs adding locks while reading or writing child table.

## Notes

- Normalization is quite important in OLTP
- Each Class corresponds to a table, and each Object corresponds to a record

### OOP Inheritance in Data Modeling

Eg. 

- Class `Cat` and Class `Dog` are both subclass of Class `Animal`
- **Three Tables** should be established: Animal, Cat and Dog, and Add foreign key in Cat and Dog to Animal

### Data partitioning

- Some data are old and not necessary no more => move to secondary system from primary system
- Use cron job **too slow** (too many IO) and waste efficiency => Truncate table instead

> BTW, data partitioning and data sharding are two different things

### Other Concepts

- Intentional Data Redundancy
- Data Materialization
- Data fan-out

## References

- [Taipei 2019-04 course](https://github.com/TritonHo/slides/tree/master/Taipei%202019-04%20course)
