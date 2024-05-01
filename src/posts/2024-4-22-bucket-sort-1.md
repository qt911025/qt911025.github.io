---
title: Rust与算法基础（13）：桶排序（上）
date: 2024-04-22
category: 编程
tag:
    - Rust
    - 算法
---

大家好啊，今天我们就来完成《算法导论（第三版）》第八章的最后一节——桶排序。

当我们需要对一串大小为$[0,1)$的序列进行排序，我们可以用桶排序算法。
这一串数在这个区间中分布越平均，算法的时间复杂度就越接近$\Omicron(n)$，而最坏情形的时间复杂度为$\Omicron(n^2)。

在输入的数据规模为n时，算法将$[0,1)$区间平均划分为n份，建立n个桶。
输入的数据也被等比拉长到$[0,n)$，将n乘以输入数据并向下取整，得知这个数据会被放进几号桶。

每个数据进入桶时会进行一次插入排序，这个排序的时间复杂度就是整个算法时间复杂度的最大项。
现在要实现的插入桶的过程是一个顺序查找法，所以时间复杂度为$\Omicron(n^2)$，
而之前的例子也实现了$\Omicron(n\lg{n})$的比较排序，所以之后会逐步优化到这个速度。

## Vec桶

在优化前先实现一个简单版的，掌握掌握思想。

桶排序像之前的实现一样，会吃掉原序列，生成新序列。
算法总共分三步：

* 建桶
* 进桶
* 连桶

:::tabs
@tab lib.rs
```rust
use conv::*;
use issort::InsertionSorter;
use algorithms_prelude::CompareSorter;

pub fn bucket_sort(arr: Vec<f64>) -> Result<Vec<f64>, &'static str> {
    let arr_length = arr.len();

    // 建桶
    let mut buckets: Vec<Vec<f64>> = Vec::with_capacity(arr_length);
    buckets.resize_with(arr_length, || Vec::new());

    // 进桶
    for e in arr {
        if e >= 0.0 && e < 1.0 {
            let bucket_id = (e * (arr_length as f64)).approx_as::<usize>().unwrap();
            buckets[bucket_id].push(e);
        } else {
            return Err("元素值溢出");
        }
    }

    // 排序每个桶，并连接
    let result = buckets
        .into_iter()
        .flat_map(|mut bucket| {
            InsertionSorter(&mut bucket).sort_by(|prev, next| prev <= next);
            bucket
        })
        .collect();
    Ok(result)
}
```

@tab Cargo.toml
```toml
[package]
name = "bucket_sort"
version = "0.1.0"
edition = "2021"

[dependencies]
conv = "0.3.3"
issort = { path = "../_2_1_issort" }
algorithms_prelude = { path = "../algorithms_prelude" }

```
:::

`resize_with`方法将数据批量填充，将arr扩充到指定大小。

```rust
let bucket_id = (e * (arr_length as f64)).approx_as::<usize>().unwrap();
```
这句则是一个数据转换问题，一个f64能表示的数的范围是非常大的，所以不能直接转成整型。
但这里程序是能保证这个f64转成的usize是在范围内的。Rust不支持转换，但我们可以引入`conv`库，
来转换这个数，既然已经能保证转换的数是符合大小的，就直接unwrap了。

> 要较真的话，这依然是不安全的。f64只用52位来表示整型，当arr_length超过了$2^52$，f64将会丢失精度，这样转换的数是不精确的。
> 当然相乘之后的数还是不会超限，所以不会崩溃，只是计算出来的bucket_id会不准。如果真的输入了这么长的数组的话，那就要考虑了。

排序桶并连接这一步，用的是函数式编程方法。`into_iter`会吃掉`buckets`。
在`flat_map`中，回调输入的是`buckets`的每个元素，并且要求返回的是一个可转变成迭代器的对象，
`flat_map`会将所有结果链接（`chain`）起来。

这是一个将二维数组扁平化的过程，如果是用`map`的话，还需要重新`collect`成一个二维数组再`concat`。

## 排序更大的数

我们可以通过映射的方式排序更大范围的数，只要像前面几个算法那样，能建立一个单射即可。

```rust
pub fn bucket_sort<T, F>(arr: Vec<T>, mapper: F) -> Result<Vec<T>, &'static str>
    where F: Fn(&T) -> f64
{
    let arr_length = arr.len();

    // 建桶
    let mut buckets: Vec<Vec<(f64, T)>> = Vec::with_capacity(arr_length);
    buckets.resize_with(arr_length, || Vec::new());

    // 进桶
    for e in arr {
        let key = mapper(&e);
        if key >= 0.0 && key < 1.0 {
            let bucket_id = (key * (arr_length as f64)).approx_as::<usize>().unwrap();
            buckets[bucket_id].push((key, e));
        } else {
            return Err("元素值溢出");
        }
    }

    // 排序每个桶，并连接
    let result = buckets
        .into_iter()
        .flat_map(|mut bucket| {
            InsertionSorter(&mut bucket).sort_by(|prev, next| prev.0 <= next.0);
            bucket
        })
        .map(|item| item.1)
        .collect();
    Ok(result)
}

#[cfg(test)]
mod test {
    use super::*;
    use issort::InsertionSorter;
    use algorithms_prelude::CompareSorter;
    #[test]
    fn it_sort_ascending() {
        let v = vec![0.79, 0.13, 0.16, 0.64, 0.39, 0.2, 0.89, 0.53, 0.71, 0.42];
        let mut expected = v.clone();
        InsertionSorter(&mut expected).sort_by(|prev, next| prev <= next);
        if let Ok(result) = bucket_sort(v, |e| *e) {
            assert_eq!(result, expected);
        } else {
            panic!("测试失败，不应该返回错误");
        }
    }

    #[test]
    fn it_overflow() {
        let v = vec![2, 4, 1, 7, 10];
        let result = bucket_sort(v, |e| *e as f64);
        assert_eq!(result, Err("元素值溢出"))
    }

    #[test]
    fn it_struct_sort_ascending() {
        #[derive(Debug, PartialEq)]
        struct Foo {
            id: f64,
            name: &'static str,
        }

        let v = vec![
            Foo {
                id: 0.9,
                name: "ZS",
            },
            Foo {
                id: 0.0,
                name: "LS",
            },
            Foo {
                id: 0.2,
                name: "WW",
            },
            Foo {
                id: 0.1,
                name: "ZL",
            },
            Foo {
                id: 0.3,
                name: "SQ",
            }
        ];

        if let Ok(result) = bucket_sort(v, |e| e.id) {
            assert_eq!(
                result,
                vec![
                    Foo {
                        id: 0.0,
                        name: "LS",
                    },
                    Foo {
                        id: 0.1,
                        name: "ZL",
                    },
                    Foo {
                        id: 0.2,
                        name: "WW",
                    },
                    Foo {
                        id: 0.3,
                        name: "SQ",
                    },
                    Foo {
                        id: 0.9,
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
            id: f64,
            name: &'static str,
        }

        let v = vec![
            Box::new(Foo {
                id: 0.9,
                name: "ZS",
            }),
            Box::new(Foo {
                id: 0.0,
                name: "LS",
            }),
            Box::new(Foo {
                id: 0.2,
                name: "WW",
            }),
            Box::new(Foo {
                id: 0.1,
                name: "ZL",
            }),
            Box::new(Foo {
                id: 0.3,
                name: "SQ",
            })
        ];

        if let Ok(result) = bucket_sort(v, |e| e.id) {
            assert_eq!(
                result,
                vec![
                    Box::new(Foo {
                        id: 0.0,
                        name: "LS",
                    }),
                    Box::new(Foo {
                        id: 0.1,
                        name: "ZL",
                    }),
                    Box::new(Foo {
                        id: 0.2,
                        name: "WW",
                    }),
                    Box::new(Foo {
                        id: 0.3,
                        name: "SQ",
                    }),
                    Box::new(Foo {
                        id: 0.9,
                        name: "ZS",
                    })
                ]
            );
        } else {
            panic!("测试失败，不应该返回错误");
        }
    }
}

```

为了保证元素依然是平均分布的，元素本身得是均匀分布的，而且mapper**只能是一个线性函数**，让元素计算得的键仍保持均匀分布。

插入排序已经使用了二分查找法，所以这个算法的排序最坏情形是可以提高到$\Omicron(n\lg{n})$的。
但是用Vec实现的桶，毕竟是一个序列表，在内存中是紧密排列的。
当需要插入一个数据时，如果超过了容量（capacity），就会另外申请空间并拷贝过去。
而且在进行插入排序时，插入的位置越靠前，则序列需要向后整体位移的数据块就越大，这种位移是非常消耗算力的。

所以要在此基础上优化，桶就应该用链式存储实现，下一节要实现的就是是一个链表，链表是一个只能用顺序查找插入的，所以在速度上，未必比Vec快。
而且桶排序本身适合的理想情形就是输入数据均匀分布，对于均匀分布的输入，每个桶的大小会是相当平均。
每个桶平均只有一个元素，所以插入和排序操作并不会消耗太多算力。链表化优化更多是针对最坏情形的，而越接近最坏情形，链表在排序上还是比二分查找慢。

所以下一节只是展示一下如何在Rust实现链表，实现链表推荐[这个网站](https://rust-unofficial.github.io/too-many-lists/index.html)。