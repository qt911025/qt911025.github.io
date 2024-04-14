---
title: Rust与算法基础（11）：计数排序
date: 2024-04-11
category: 编程
tag:
    - Rust
    - 算法
---

## 当输入数据的种类是可以确定的

快速排序中提到了一些最坏情形，当元素不够乱序，或者是重合元素过多时，快速排序越慢。

到目前为止，我们实现的算法都是一次性准备好的输入数据，求一个输出。
这意味着输入的数据总是有限的，与之相对应的，也有“无限”的输入，比如**流**，这里就不展开了。

输入的数据是有限的，就意味着输入的每个元素的种类是有限的。如果每个元素不是各不相同，那就必然有重复的数据。

对于规模为$n$的数组，有$k$种数据，存在$k \le n$，简单的抽屉原理。

那么当k是一个常数时，就适用于今天要说的排序算法————计数排序。

计数排序要求输入的元素是正整数（自然数也行），并且有最大值，这意味着元素的种类是有限的。
之所以有这种要求是因为这个算法希望元素可以直接作为下标。

算法将统计每种元素的出现次数，按顺序重新“铺设”在新的的数组中，也就是说这个算法的实现已经不是**原址**的了。

```rust
pub fn counting_sort(vec: Vec<usize>, max_key: usize) -> Result<Vec<usize>, &'static str> {
    let mut count = vec![0; max_key];
    for &e in &vec {
        if e < max_key {
            count[e] += 1; // 统计同key量
        } else {
            return Err("元素值溢出");
        }
    }

    for i in 1..count.len() {
        count[i] += count[i - 1];
    }

    let result_len = vec.len();
    let mut result = Vec::with_capacity(result_len); // 应该定义好容量，而不是new，new出来的vec容量为0
    unsafe {
        result.set_len(result_len);
    }
    for j in (0..result_len).rev() {
        result[count[vec[j]] - 1] = vec[j]; // 注意下标
        count[vec[j]] -= 1;
    }
    Ok(result)
}

#[cfg(test)]
mod test {
    const MAX_VALUE: usize = 10;

    use super::*;
    use issort::InsertionSorter;
    use algorithms_prelude::CompareSorter;
    #[test]
    fn it_sort_ascending() {
        let v = vec![2, 4, 1, 7, 9, 9, 5, 5, 2, 4, 2, 3];
        let mut expected = v.clone();
        InsertionSorter(&mut expected).sort_by(|prev, next| prev <= next);
        if let Ok(result) = counting_sort(v, MAX_VALUE) {
            assert_eq!(result, expected);
        } else {
            panic!("测试失败，不应该返回错误");
        }
    }

    #[test]
    fn it_overflow() {
        let v = vec![2, 4, 1, 7, 10];
        let result = counting_sort(v, MAX_VALUE);
        assert_eq!(result, Err("元素值溢出"))
    }
}
```

## 错误处理
因为要求的数据有严格的限制，所以输出加了错误处理。Rust没有try/catch捕捉机制，因为Rust要求所有开发者都遵循底层对调用者负责的原则。而且还有这样的说法：如果你写的代码可以预见会出错，你为什么要让它出错呢？所以出错只会发生在上游出错了，或者是理论上就是会有不属于我这层应该处理的情况。在Java里会有Error和Exception的区别，而在Rust里，理应关掉程序的就是panic，需要交给调用者处理的则应该像函数的返回值一样处理，于是便有了Result。

当然对于panic，rust也有捕捉机制————`std::panic::catch_unwind()`，这还是将panic处理为Result来管理，这里暂时还用不到。

## 可数

我们当然不希望这个排序只有这点用，元素居然限定为usize，前面的比较排序哪怕是优化前的，都支持浮点型呢。

术业有专攻，不同的算法肯定是各有利弊，不然早就被淘汰了。
虽然不能要求计数排序也能实现比较排序相同的功能，但是因为需要让元素值能够作为计数数组的下标，才要求元素得是usize，
**那是否可以建立一个映射，让每种元素都对应一个usize数？**

这其实就是**可枚举**，对应数学里的概念，元素是**可数的**且**有限的**。
只要元素是可枚举的，就能建立一个从`element`到`key`的**单射**，从而可以排序更多类型、更大范围的数据。

## 键的枚举

比较排序有一个`compare`回调，对应计数排序也有一个枚举回调，像这样：
```rust
fn(elem: &T) -> usize
```
一个最简单的单射就是它本身：
```rust
fn it_self(elem: &usize) -> usize {
    *elem
}
```

那么计数排序可以这么实现：
```rust
pub fn counting_sort<T>(
    vec: Vec<T>,
    max_key: usize,
    enumerate: fn(elem: &T) -> usize
) -> Result<Vec<T>, &'static str> {
    let mut count = vec![0; max_key];
    for e_ref in &vec {
        let key = enumerate(e_ref);
        if key < max_key {
            count[key] += 1; // 统计同key量
        } else {
            return Err("元素值溢出");
        }
    }

    for i in 1..count.len() {
        count[i] += count[i - 1];
    }

    let result_len = vec.len();
    let mut result = Vec::with_capacity(result_len); // 应该定义好容量，而不是new，new出来的vec容量为0
    unsafe {
        result.set_len(result_len);
    }
    for e in vec.into_iter().rev() {
        let key = enumerate(&e);
        unsafe {
            ptr::write(&mut result[count[key] - 1], e); // 注意下标
        }
        count[key] -= 1;
    }
    Ok(result)
}

#[cfg(test)]
mod test {
    const MAX_VALUE: usize = 10;

    use super::*;
    use issort::InsertionSorter;
    use algorithms_prelude::CompareSorter;
    #[test]
    fn it_sort_ascending() {
        let v = vec![2, 4, 1, 7, 9, 9, 5, 5, 2, 4, 2, 3];
        let mut expected = v.clone();
        InsertionSorter(&mut expected).sort_by(|prev, next| prev <= next);
        if let Ok(result) = counting_sort(v, MAX_VALUE, |e| *e) {
            assert_eq!(result, expected);
        } else {
            panic!("测试失败，不应该返回错误");
        }
    }

    #[test]
    fn it_overflow() {
        let v = vec![2, 4, 1, 7, 10];
        let result = counting_sort(v, MAX_VALUE, |e| *e);
        assert_eq!(result, Err("元素值溢出"))
    }
}
```

我们增加结构体、Box，和幂等性测试。这个算法是幂等性（《算法导论》里是“稳定性”，两者概念不一样，但等价）的，
这很重要，因为后面的**基数排序**需要这个性质。

```rust

    #[test]
    fn it_struct_sort_ascending() {
        #[derive(Debug, PartialEq)]
        struct Foo {
            id: usize,
            name: &'static str,
        }

        let v = vec![
            Foo {
                id: 9,
                name: "ZS",
            },
            Foo {
                id: 0,
                name: "LS",
            },
            Foo {
                id: 2,
                name: "WW",
            },
            Foo {
                id: 1,
                name: "ZL",
            },
            Foo {
                id: 3,
                name: "SQ",
            }
        ];

        if let Ok(result) = counting_sort(v, MAX_VALUE, |e| e.id) {
            assert_eq!(
                result,
                vec![
                    Foo {
                        id: 0,
                        name: "LS",
                    },
                    Foo {
                        id: 1,
                        name: "ZL",
                    },
                    Foo {
                        id: 2,
                        name: "WW",
                    },
                    Foo {
                        id: 3,
                        name: "SQ",
                    },
                    Foo {
                        id: 9,
                        name: "ZS",
                    }
                ]
            );
        } else {
            panic!("测试失败，不应该返回错误");
        }
    }

    #[test]
    fn it_struct_sort_ascending_box() {
        #[derive(Debug, PartialEq)]
        struct Foo {
            id: usize,
            name: &'static str,
        }

        let v = vec![
            Box::new(Foo {
                id: 9,
                name: "ZS",
            }),
            Box::new(Foo {
                id: 0,
                name: "LS",
            }),
            Box::new(Foo {
                id: 2,
                name: "WW",
            }),
            Box::new(Foo {
                id: 1,
                name: "ZL",
            }),
            Box::new(Foo {
                id: 3,
                name: "SQ",
            })
        ];

        if let Ok(result) = counting_sort(v, MAX_VALUE, |e| e.id) {
            assert_eq!(
                result,
                vec![
                    Box::new(Foo {
                        id: 0,
                        name: "LS",
                    }),
                    Box::new(Foo {
                        id: 1,
                        name: "ZL",
                    }),
                    Box::new(Foo {
                        id: 2,
                        name: "WW",
                    }),
                    Box::new(Foo {
                        id: 3,
                        name: "SQ",
                    }),
                    Box::new(Foo {
                        id: 9,
                        name: "ZS",
                    })
                ]
            );
        } else {
            panic!("测试失败，不应该返回错误");
        }
    }

    #[test]
    fn it_struct_sort_ascending_idempotence() -> Result<(), &'static str> {
        // 幂等性测试
        #[derive(Debug, PartialEq, Clone)]
        struct Foo {
            id: usize,
            name: &'static str,
        }

        let v = vec![
            Foo {
                id: 9,
                name: "ZS",
            },
            Foo {
                id: 0,
                name: "LS",
            },
            Foo {
                id: 2,
                name: "WW",
            },
            Foo {
                id: 1,
                name: "ZL",
            },
            Foo {
                id: 3,
                name: "SQ",
            },
            Foo {
                id: 0,
                name: "LS2",
            }
        ];

        let enumerate = |e: &Foo| e.id;

        let mut expected = v.clone();
        InsertionSorter(&mut expected).sort_by(|prev, next| prev.id <= next.id);

        let result1 = counting_sort(v, MAX_VALUE, enumerate)?;
        assert_eq!(result1, expected);
        let result2 = counting_sort(result1, MAX_VALUE, enumerate)?;
        assert_eq!(result2, expected);
        Ok(())
    }
```

## 带异常处理的函数

注意最后一个用例，它要求返回值是这样的格式：`Result<(), &'static str>`。

这是因为在函数内部我们用到了`?`。表示的是返回的是Result或者Option时，
返回Ok或Some则赋值，否则中断并返回Err或None。

这段

```rust
let result1 = counting_sort(v, MAX_VALUE, enumerate)?;
```

近似等价于
```rust
let result1 = match counting_sort(v, MAX_VALUE, enumerate) {
    Ok(result) => result,
    Err(err) => {
        return Err(err);
    }
};
```

前者和后者的区别是用`match`匹配Err时，仍然需要把Err包裹的内容析取再重新包装，
而`?`调用是直接抛出。

`?`调用还需要注意的是只能用于类型上与调用者相同的函数，
也就是说`it_struct_sort_ascending_idempotence`是返回`Result`类型的，
调用的`counting_sort`也得是`Result`类型的，且两个`Result`的`Err`包裹的类型要匹配（这里都是`&'static str`）。

## 返回值

`it_struct_sort_ascending_idempotence`的返回值的`Ok`部分包裹的是一个`()`，
对应的是一般函数的没写返回值的函数，比如前面几个用例。

没返回值的函数，对应C/C++的void函数，这在rust里并不是真的没返回值，这只是一个语法糖。
一个没写返回值的函数，比如

```rust
fn main() {
    println!("Hello World!");
}
```

等价于

```rust
fn main() -> () {
    println!("Hello World!");
    ()
}
```

都是有返回值的。

还有一种函数是**不返回**的函数————Diverging Function，它声明了这个函数在任何条件分支下都不会返回某个值，
即使这个函数会结束也是如此。

```rust
fn foo() -> ! {
    panic!("This call never returns.");
}
```

不返回的函数内部往往有无限循环、panic、结束进程等过程。
一个函数内部有返回和不返回的分支，那么这个函数是什么样的函数，就要看返回值类型声明的是什么。

diverging也就是数学里的divergent，即“发散的”，相对的概念“收敛的”，叫做convergent。
发散的不光有函数，函数的调用作为表达式，也是整个“发散的”表达式的子集。

比如`continue`也是一个发散表达式。

发散的表达式的作用就是声明这个表达式会中止一个过程，编译器静态分析会**识别出这种中止，不再要求这个分支有返回值**。

具体案例可以看[这篇文章](https://doc.rust-lang.org/rust-by-example/fn/diverging.html)。