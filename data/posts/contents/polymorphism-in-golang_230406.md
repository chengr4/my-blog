# Polymorphism in Golang

> 以下是我與 ChatGTP 老師問答的總結，所以可能會有錯誤，請斟酌閱讀，感謝

## 什麼是 Polymorphism ?

poly: Multiple

morphism: Forms

Polymorphism 是物件導向程式設計 (OOP) 中的一個核心概念，表示同一個方法 (method) 可以在不同的物件中具有不同的實現方式。這個概念讓我們可以用統一的方式來操作不同的物件，並且能夠根據不同的情況，呼叫適當的方法。

Polymorphism 的核心思想是「以一種通用的介面，操作不同的物件，使其產生不同的結果」。在 Polymorphism 中，物件的行為會根據所屬的物件，而有所不同。這種行為的多樣性，是 Polymorphism 最重要的特徵之一。

## Polymorphism 的目的？

藉由 Polymorphism 使 code 更加靈活、reusable、易擴展和可維護

Eg:

```golang
type Shape interface {
    Area() float64
}

type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

type Rectangle struct {
    Width  float64
    Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// 靈活：藉由 type Shape interface 可以讓不同的 struct 對同一 function 做出不同的 respond。這使得我們可以在運行時決定使用哪個具體類型的 struct，而不必在編譯時就指定。
func CalculateArea(s Shape) float64 {
    return s.Area()
}

// Line 48-56: 易擴展，
type Triangle struct {
    Base   float64
    Height float64
}

func (t Triangle) Area() float64 {
    return 0.5 * t.Base * t.Height
}

func main() {
    c := Circle{Radius: 5.0}
    r := Rectangle{Width: 10.0, Height: 5.0}

    fmt.Println(CalculateArea(c)) // Output: 78.53981633974483
    fmt.Println(CalculateArea(r)) // Output: 50
}
```

## References

- [Coding with John; Java Polymorphism Fully Explained In 7 Minutes (2021.04)](https://youtu.be/jhDUxynEQRI)