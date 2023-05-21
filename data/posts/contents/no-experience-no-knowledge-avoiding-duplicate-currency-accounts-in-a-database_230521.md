# [沒遇過就不會] 避免資料庫的重複貨幣帳戶

> 沒遇過就不會系列之一

## 引言

在軟體開發的世界裡，有許多知識和技巧無法完全被書本所涵蓋，也許存在於書或者影片的一隅，卻很容易忽略它。有時候，這些知識並不是特別困難的技術，只需要別人的點撥，或可迅速理解。然而，若沒有真正遭遇過，也許會浪費十天半個月，因此，有了這個系列。

我雖然只是一名小小工程師，在漫漫的軟體工程生涯中，也許能幫助那些遇到與我相同問題的人。

## Abstract

在具有多帳戶功能的系統中，一個 User 可以有多個 Account ，而在 Account table 中又可以儲存多種幣別 (USD, NTD…) 。我們可以利用 `composite index` 加上 `unique` 的特性， 令 User 避免持有相同的幣別的 Account。

例子：

```sql
// PostgreSQL
CREATE UNIQUE INDEX ON "account" ("owner", "currency");
-- or
ALTER TABLE "account" ADD CONSTRAINT "account_owner_currency_unique" UNIQUE ("owner", "currency");
```

## 狀況

在具有多帳戶功能的系統的資料庫中，我們有兩個 table，一個是 User，另一個是 Account，Account 的作用是儲存金錢，並且支援多種幣別。我們希望一個 User 能有多個 Account，於是有了以下設計：

![Figure 1](https://github.com/chengr4/my-blog/blob/000c08b349a7093dcde9f899e4120e32f8993b89/data/images/figure_1_230521.png)

我們可以以下 Command 來達到一對多的目的：

```sql
// PostgreSQL
ALTER TABLE "account" ADD FOREIGN KEY ("owner") REFERENCES "user" ("username");
```

然而，此時可能會出現一個問題：一個 User 可能會持有兩個或兩個以上「相同貨幣」的 Account。

試想，如果在同一家銀行中，你有兩個 USD 的外幣帳戶是一件多麼奇怪的事，你的 USD 應該存到哪一個帳戶去？

## 解決： Composite index + Unique

我們可以利用 index 來輕鬆解決這個問題：

```sql
// PostgreSQL
CREATE UNIQUE INDEX ON "account" ("owner", "currency");
-- or
ALTER TABLE "account" ADD CONSTRAINT "account_owner_currency_unique" UNIQUE ("owner", "currency");
```

將 index 添加到 `(owner, currency)` 這個組合上，並且設定該 index 為 `unique`，可以避免同一個 User 同時擁有兩個相同貨幣（例如 USD）的帳戶。

Composite Index + unique 確保了 `(owner, currency)` 這個組合的值在 table 中是唯一的。當你嘗試插入一筆新的 Account record 時，系統會檢查該 index 是否已經存在相同 `(owner, currency)` 組合的值。如果已經存在，則插入操作將會失敗，從而避免了同一個 User 同時擁有兩個相同貨幣的帳戶。
