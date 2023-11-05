# [Rust] 理解 TreeNode 的子節點的 `Option<Rc<RefCell<TreeNode>>>`

## 引言

由於最近開始研究 Rust ，於是開始嘗試用 Rust 寫 Leetcode 的題目 (我原本是習慣使用 JS/TS)，然而，在寫 Tree 相關的題目的時候，看到子節點的 Type 是 `Option<Rc<RefCell<TreeNode\>>>` 直接傻眼貓咪 =_="，不明白為何包這麼多層。

```rust
pub struct TreeNode {
  pub val: i32,
  pub left: Option<Rc<RefCell<TreeNode>>>,
  pub right: Option<Rc<RefCell<TreeNode>>>,
}
```

因此有了這一篇文章，以幫助自己釐清為什麼 TreeNode 要這樣定義。

在開始介紹 Type 之前先說結論:

## 結論

- 使用 `Option<T>` 是因為 left child 和 right child 可能會是空值。
- 使用 `Rc<T>` 表示多個父節點有機會共享同一個子節點。 (當然多數的 Leetcode 題目應該是用不到這個性質)
- 使用 `RefCell<T>` 是因為即使父節點是不可變的，父節點上的子節點也可以被修改。

---

`TreeNode` 的 child 一共有3個 Type: `RefCell<T>`, `Rc<T>` 和 `Option<T>` ，我們將由外而內進行剖析。

## `Option<T>`

Rust 用 enum `Option<T>` 來實作空值 (null) 的概念，因此 `Option<T>` 表示一個數值可能有某個東西，或者什麼都沒有。

## `Rc<T>`

> aka. Reference Counting

`Rc<T>` 讓數個擁有者能共享相同資料。

### 性質

- 只能在單一 thread 中使用
- 慣例使用 `Rc::clone` 來拷貝 reference 。(因為僅增加參考計數，時間花費比深拷貝少很多)
- 慣例透過 method `Rc::strong_count` 來印出參考計數

> 還有一個 method `weak_count` 在某些場景下有其功能。 Eg. 避免參考循環

### 為何需要 `Rc<T>`?

1. **一個數值可能會有數個 owner**
    Eg. 在 Graph 的資料結構中，數個邊可能都會指向同個節點，意味著該節點就被所有指向它的邊所擁有。直到沒有任何邊指向它，也就是沒有任何擁有者時它才會被清除。

## `RefCell<T>`

`RefCell<T>` 會讓編譯器忽略，然後在 runtime 才檢查借用規則，使得不可變的參考內部的 type 能夠被修改

- 內部可變性 (Interior Mutability)
- 只能在單一 thread 中使用
- 在 runtime 檢查參考: 編譯器會允許內部可變性，然後在 runtime 才檢查借用規則
- `borrow_mut`: 取得 `RefCell<T>` 內的可變參考數值 `T` ， return `RefMut<T>`
- `borrow`: return `Ref<T>`
- 模擬物件 (mock objects) 時，有時候會用到

### 為何需要 `RefCell<T>`?

1. 在編譯時期無法確定是否需要可變性
    Eg. 在 `TreeNode` 中，父節點可能是不可變的，但是父節點上的子節點可能是可變的。

## References

- [Rust 程式設計語言](https://rust-lang.tw/book-tw/title-page.html#rust-%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88%E8%AA%9E%E8%A8%80)