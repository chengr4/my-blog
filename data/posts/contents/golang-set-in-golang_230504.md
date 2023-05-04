# [Golang] Golang 的 Set

## 前言

某天在使用 Golang 的時候，突然發現原來 Golang 沒有像其他語言一樣有實作 `Set` 的 data structure，稍微爬了文後發現，原來 Golang 會用 `map` 來模擬 `Set` ，以下是僅是小小的紀錄。

## 用 `map` 模擬 `Set`

`map` 是一個 key-value pair 的 data structure，`key` 和 `value` 可以是任意的 type，並且 `key` 必須要是唯一。而正因為 `key` 必須要是唯一的，所有重複的 `key` 將會被刪除，藉此達到實作 `Set` 的目的。

作法：將 `string` 作為 `key` 並將 `value` 設為 `true`

Eg:

```golang
mySet := map[string]bool{}
mySet["apple"] = true
mySet["banana"] = true

// 檢查某個值是否在 set 中
if mySet["orange"] {
    fmt.Println("orange 在 set 中")
} else {
    fmt.Println("orange 不在 set 中")
}

// iterate all values in set 
for key, _ := range mySet {
    fmt.Println(key)
}

// 獲取 set 的大小
fmt.Println(len(mySet))
```