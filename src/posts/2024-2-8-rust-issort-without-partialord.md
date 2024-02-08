---
title: Rust与算法基础（3）：用Rust实现插入排序（下）
date: 2024-02-08
category: 编程
tag:
    - Rust
    - 算法
---

上一集我们用unsafe实现去掉了排序函数的Copy特质限定。
这个排序函数只实现了升序排序，如果想要实现降序排序，需要另写一个函数吗？
然而降序排序和升序排序仅仅是一个符号的区别，输入类型的差异的不同实现可以用泛型、重载等方法解决，而目的差异往往是需要另外实现。

## 加个降序？

如果差异很小，我们可以再加些选项参数，并在函数内部实现里用一系列条件判定来控制，比如这样：

```rust
pub fn sort<Elem: PartialOrd>(vec: &mut Vec<Elem>, ascend: bool) {
    for i in 1..vec.len() {
        unsafe {
            let e = ptr::read(&vec[i]);
            let mut j = i;
            if ascend {
                while j > 0 && &vec[j - 1] > &e {
                    ptr::copy(&vec[j - 1], &mut vec[j], 1);
                    j = j - 1;
                }
            } else {
                while j > 0 && &vec[j - 1] < &e {
                    ptr::copy(&vec[j - 1], &mut vec[j], 1);
                    j = j - 1;
                }
            }
            vec[j] = e;
        }
    }
}
```

这算不上有多优雅，调用者如果要加一些别的排序规则，就要修改排序函数本身。
不如做一个抽象，让调用者自己决定排序的规则，我只提供一个标准，也就是回调函数的标准。

## 回调函数

回调函数可以把排序的规则扔给调用者实现，就像定义一个接口一样。

我们现在就规定回调函数符合这样的输入，输出应为什么：
> 输入一个“前一个元素”`prev`，一个“后一个元素”`next`。
> 返回每一个`prev`和`next`的应有关系的断言，比如前者应该大于后者，则断言为`prev > next`。

修改之后，排序函数就变成了这样

```rust
pub fn sort<Elem>(vec: &mut Vec<Elem>, compare: fn(prev: &Elem, next: &Elem) -> bool) {
    for i in 1..vec.len() {
        unsafe {
            let e = ptr::read(&vec[i]);
            let mut j = i;
            while j > 0 && !compare(&vec[j - 1], &e) {
                ptr::copy(&vec[j - 1], &mut vec[j], 1);
                j = j - 1;
            }
            vec[j] = e;
        }
    }
}
```

我们规定了回调函数compare是这个格式的：

```
fn(prev: &Elem, next: &Elem) -> bool
```

而比较前后元素的部分变成了这样：

```
!compare(&vec[j - 1], &e)
```

也就是说，前后排序如果不符合应有的顺序，就调换位置。排序抛给调用者自定义，就不限定元素必须实现PartialOrd了。

测试也可以想升序升序，想降序降序了：

```rust
#[cfg(test)]
mod test {
    use super::*;
    #[test]
    fn it_sort_ascending() {
        let mut v = vec![22, 43, 145, 1, 9];
        sort(&mut v, |prev, next| prev < next);
        assert_eq!(v, vec![1, 9, 22, 43, 145]);
    }

    #[test]
    fn it_sort_descending() {
        let mut v = vec![22, 43, 145, 1, 9];
        sort(&mut v, |prev, next| prev > next);
        assert_eq!(v, vec![145, 43, 22, 9, 1]);
    }

    #[test]
    fn it_struct_sort_ascending() {
        #[derive(Debug, PartialEq)]
        struct Foo {
            id: u32,
            name: &'static str,
        }

        let mut v = vec![
            Foo {
                id: 22,
                name: "ZS",
            },
            Foo {
                id: 43,
                name: "LS",
            },
            Foo {
                id: 145,
                name: "WW",
            },
            Foo {
                id: 1,
                name: "ZL",
            },
            Foo {
                id: 9,
                name: "SQ",
            }
        ];

        sort(&mut v, |prev, next| prev.id < next.id);
        assert_eq!(
            v,
            vec![
                Foo {
                    id: 1,
                    name: "ZL",
                },
                Foo {
                    id: 9,
                    name: "SQ",
                },
                Foo {
                    id: 22,
                    name: "ZS",
                },
                Foo {
                    id: 43,
                    name: "LS",
                },
                Foo {
                    id: 145,
                    name: "WW",
                }
            ]
        );
    }
}
```

第三个用例里，我也把为Foo实现的PartialOrd trait去掉了，回调函数改为比较两个元素的id。

## 总结

这个排序算法算是变得比较强大了，支持的元素类型没有限定特质，还加入了回调。

这次改造我们也逐渐发现，我们要实现的功能遵循一定的范式。
无论用什么算法排序，都有一些共同点：
* 都在一个列表里
* 元素类型相同
* 前一个元素与后一个元素的比较

那么对于不同的算法，都要考虑：
1. 列表是什么形式？
2. 元素是什么类型？
3. 怎么比较？

1决定了元素的移动怎么实现；2可以用泛型解决；3依赖2，定义新结构体的时候可以预定义一些开箱即用的排序规则。
可以根据项目需要进行一定抽象，让结构更有条理一些。