---
title: Rust与算法基础（4）：重构工作空间
date: 2024-02-08
category: 编程
tag:
    - Rust
    - 算法
---

考虑到接下来的整个算法学习路线，未来的新算法会存在共同点，已实现的算法也常常要用到，
我要把整个学习路线放在一个workspace里，统一管理，方便引用。

文件结构就像这样：

```
/-
 |-/_2_1_issort
 |-/algorithms_prelude
 |-Cargo.lock
 |-Cargo.toml
```

_2_1_issort文件夹命名方式是以_开头，《算法导论》的章节号命名，有时候会自定义。
开头下划线主要是习惯，新创建的包名默认是文件夹名，包名不能是数字开头，所以才加的下划线。
但我后来又把包名自己改了一次，改成比较通用的名称，文件夹名是什么格式就不太重要了，主要还是为了排序。

根目录的Cargo.toml即工作空间配置，内容包括了这个工作空间里有的包：

:::tabs
@tab Cargo.toml
```toml
[workspace]
resolver = "2"

members = [
    "algorithms_prelude",
    "_2_1_issort",
]
```
:::

以\[workspace\]打头，没有了package块。

resolver设定了整个工作空间用的是那个版本的依赖处理，只有1版和2版，这里用2。

members里写的是文件夹名而不是包名，包括了要囊括进工作空间的所有包。

_2_1_issort就是之前实现的插入排序，algorithms_prelude是整个算法学习要用到的基本元件，都是自己写的。

现在我们要做的是：

## 抽象出排序这个接口，将插入排序改成对它的实现

algorithms_prelude是一个库，里面只有一个lib.rs

:::tabs
@tab algorithms_prelude/src/lib.rs
```rust
// 定义一个Sorter Trait
// 建议实现Sorter Trait的是一个Wrapper
// sort_by一个断言函数，定义的是前一个与后一个元素满足断言函数的关系。
// | 比如传入一个大于关系的函数gt()，排序后，前一个应比后一个大
// | 那么gt的定义为
// | fn gt(prev:i32, next:i32) {
// |     prev > next
// | }
// 使得这个排序的结果为降序
// Sorter获取原序列的可变引用，以sort_by改变原序列
pub trait Sorter {
    type Element;
    fn sort_by(&mut self, compare: fn(prev: &Self::Element, next: &Self::Element) -> bool);
}

#[cfg(test)]
mod tests {
    use super::*;

    struct InsertionSorter<'a, Seq>(&'a mut Seq);
    
    impl<'a, Elem: Copy> Sorter for InsertionSorter<'a, Vec<Elem>> {
        type Element = Elem;
    
        fn sort_by(&mut self, compare: fn(prev: &Self::Element, next: &Self::Element) -> bool) {
            let vec = &mut self.0;
            let len = vec.len();
    
            if len < 2 {
                return;
            }
    
            for i in 1..vec.len() {
                let e = vec[i];
                let mut j = i;
                while j > 0 && !compare(&vec[j - 1], &e) {
                    vec[j] = vec[j - 1];
                    j = j - 1;
                }
                vec[j] = e;
            }
        }
    }
    
    #[test]
    fn it_sort_ascending() {
        let mut v = vec![22, 43, 145, 1, 9];
        InsertionSorter(&mut v).sort_by(|prev, next| prev < next);
        assert_eq!(v, vec![1, 9, 22, 43, 145]);
    }
}
```
:::

测试里提供了一个简单的插入排序实现，为了方便就限定了Copy trait。
很容易就知道_2_1_issort如何改成实现这个接口了，这里就不多说了。

就解释一下这接口吧，`struct XX(YY)`是一种很常见的实现，结构体的结构仅用了一个元组包含了唯一的目标。
这是很典型的**装饰器模式**，装饰器包裹目标，装饰器实现接口，而不影响目标。
显然，装饰器和目标是一个生命周期，而且装饰器包裹的是目标的可变引用而非目标本身，
可见装饰器和目标并不是整体-部分关系，所以需要显示指明两者的生命周期关系。

Sorter trait指定了一个类型绑定，类型绑定的特点就是实现谁就绑定谁，不允许重复实现（而泛型可以代入不同的实类型实现多次）。