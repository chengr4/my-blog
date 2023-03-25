# [JavaScript] 我對 Object key 的錯誤認知

> I do not know JS Object key YET

我原本一直以為假若使用 Array 或者 Object 當作另一個 Object 的 key 時，會使用他們的 reference，直到我遇到了 bug 並且簡單做了測試

以下為測試的例子，使用的環境為 `Nodejs` ，關注的焦點是 Object 被當作 key 時的情況

```javascript
// Case Array
const arr1 = [1, 3];
const arr2 = [2, 4];
const obj1 = {};
obj1[arr1] = 3;
obj1[arr2] = 4;
console.log(obj1); // { '1,3': 3, '2,4': 4 }
// Case Object
const keyObj1 = { a: 3 };
const keyObj2 = { b: 4 };
const obj2 = {};
obj2[keyObj1] = 3;
obj2[keyObj2] = 4;
// !! issue happened
console.log(obj2); // { '[object Object]': 4 }
```

從上面的例子可以知道，不論是 Array 或者 Object 都不會使用各自的 reference 當作 key 。 Array 的值會整個被拿來使用，Object 則會變成 `[object Object]`

請觀察 **Case Object** ：當將 `4` assign 至 `obj2[keyObj2]` 時，由於 key 都是一樣的 `'[object Object]'` 所以會直接將上一行的 assign 給蓋掉，於是在 obj2 中，將會只有最後一次 assign 的結果

## 結論

1. Object 會把所有的 key 的 type 都變成 string
2. 若 key 是 Array 或者 Object ，他並不會使用他們的 reference
3. 若使用 Array 當 key ， Array 整體都會被當成 key
4. 若使用 Object 當 key，所有的 key 都會變成 `'[object Object]'` ，並且都是同一個 key
5. Object 不適合也不應該當 key，若需要 Object 當 key 時，可以考慮用 Map

> 跟 Leetcode 138 有關
