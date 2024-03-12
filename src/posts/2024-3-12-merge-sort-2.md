---
title: Rust与算法基础（6）：归并排序（中）
date: 2024-03-12
category: 编程
tag:
    - Rust
    - 算法
---

## 除了forget外，另一种解决方式

上一篇结尾用了forget函数避免了资源的重复释放，但是这种方法需要再钻进临时向量中，对元素一个个执行。
其实有另一种方法，可以在一开始就把资源标记为不需要释放，那就是
[ManuallyDrop](https://doc.rust-lang.org/std/mem/struct.ManuallyDrop.html)。

官方文档里的例子是类似这样的用法：
```rust
use std::mem::ManuallyDrop;
let mut x = ManuallyDrop::new(String::from("Hello World!"));
```
新建对象，然后包裹进去。但我们现在不这么操作，将向量中一个一个元素创建ManuallyDrop然后塞进临时向量里，
和之前一个一个forget也没什么两样。

我们看官方文档的描述，最开头强调ManuallyDrop是“零开销（0-cost）”抽象：
> ...
> This wrapper is 0-cost.
> `ManuallyDrop<T>` is guaranteed to have the same layout and bit validity as T
> ...

也就是说在内存空间中存储的数据，`ManuallyDrop<T>`是与`T`完全一致，此即零开销。

这就意味着，我们可以通过改变指针类型，把一个类型的数据“当成”另一种数据，这是C/C++里常用的操作。

在merge函数里，把创建的临时数组类型

```rust
let left_layout = Layout::array::<T>(left_length).expect("left allocation failed!");
let left_mem = alloc(left_layout).cast::<T>();
let mut left = Vec::from_raw_parts(left_mem, left_length, left_length);

let right_layout = Layout::array::<T>(right_length).expect("right allocation failed!");
let right_mem = alloc(right_layout).cast::<T>();
let mut right = Vec::from_raw_parts(right_mem, right_length, right_length);
```

改为`Vec<ManuallyDrop<T>>`的：

```rust
let left_layout = Layout::array::<T>(left_length).expect("left allocation failed!");
let left_mem = alloc(left_layout).cast::<ManuallyDrop<T>>();
let mut left = Vec::from_raw_parts(left_mem, left_length, left_length);

let right_layout = Layout::array::<T>(right_length).expect("right allocation failed!");
let right_mem = alloc(right_layout).cast::<ManuallyDrop<T>>();
let mut right = Vec::from_raw_parts(right_mem, right_length, right_length);
```

只改动了left_mem要转换成的指针类型，这个指针是`*mut ManuallyDrop<T>`类型的，其他都没有改。

left_layout没有改，因为0-cost，只要给出的长度（left_length/right_length）相同，申请的空间总大小（left_length*(size of T)）就是相同的。

而`Vec::from_raw_parts`因为第一个参数的指针类型变成了`*mut ManuallyDrop<T>`类型，left/right向量就是
`Vec<ManuallyDrop<T>>`类型的。

这么一改，下面的copy函数，编译器就报出了参数类型不匹配的错误了。

看到报错的代码里，比如这句：
```rust
ptr::copy(&left[i], &mut vec[k], 1);
```
copy函数需要的参数都是生指针，而代入的参数是引用。这里因为引用可以用as关键字转为对应类型的生指针，
所以代入这个函数的时候已经隐式地转换了指针类型，所以这行代码等价于：
```rust
ptr::copy((&left[i] as *const ManuallyDrop<T>), (&mut vec[k] as *mut T), 1);
```
所以我们只需要显式强转一下这个生指针类型就行了：
```rust
ptr::copy((&left[i] as *const ManuallyDrop<T>).cast::<T>(), &mut vec[k], 1);
```

其他地方也做类似的转换，最终编译器通过，运行也正常。

```rust
fn merge<T>(
    vec: &mut Vec<T>,
    compare: fn(prev: &T, next: &T) -> bool,
    p: usize,
    q: usize,
    r: usize
) {
    let left_length = q - p;
    let right_length = r - q;

    unsafe {
        let left_layout = Layout::array::<T>(left_length).expect("left allocation failed!");
        let left_mem = alloc(left_layout).cast::<ManuallyDrop<T>>();
        let mut left = Vec::from_raw_parts(left_mem, left_length, left_length);

        let right_layout = Layout::array::<T>(right_length).expect("right allocation failed!");
        let right_mem = alloc(right_layout).cast::<ManuallyDrop<T>>();
        let mut right = Vec::from_raw_parts(right_mem, right_length, right_length);

        ptr::copy(&vec[p], (&mut left[0] as *mut ManuallyDrop<T>).cast::<T>(), left_length);
        ptr::copy(&vec[q], (&mut right[0] as *mut ManuallyDrop<T>).cast::<T>(), right_length);

        let mut i = 0;
        let mut j = 0;
        let mut k = p;

        while i < left_length && j < right_length {
            if compare(&left[i], &right[j]) {
                ptr::copy((&left[i] as *const ManuallyDrop<T>).cast::<T>(), &mut vec[k], 1);
                i += 1;
            } else {
                ptr::copy((&right[j] as *const ManuallyDrop<T>).cast::<T>(), &mut vec[k], 1);
                j += 1;
            }
            k += 1;
        }

        if i < left_length {
            ptr::copy(
                (&left[i] as *const ManuallyDrop<T>).cast::<T>(),
                &mut vec[k],
                left_length - i
            );
        } else if j < right_length {
            ptr::copy(
                (&right[j] as *const ManuallyDrop<T>).cast::<T>(),
                &mut vec[k],
                right_length - j
            );
        }
    }
}
```

对于这两句

```rust
ptr::copy(&vec[p], (&mut left[0] as *mut ManuallyDrop<T>).cast::<T>(), left_length);
ptr::copy(&vec[q], (&mut right[0] as *mut ManuallyDrop<T>).cast::<T>(), right_length);
```

因为第二个参数就是指向向量第一个元素的指针，也就是指向新开辟内存的首位，这不就是left_mem/right_mem嘛。
所以可以直接改过去，变成：

```rust
ptr::copy(&vec[p], left_mem.cast::<T>(), left_length);
ptr::copy(&vec[q], right_mem.cast::<T>(), right_length);
```

编译器提示之前的left/right声明的变量可以不为可变的了，可以把mut删掉。
```rust
let left_layout = Layout::array::<T>(left_length).expect("left allocation failed!");
let left_mem = alloc(left_layout).cast::<ManuallyDrop<T>>();
let left = Vec::from_raw_parts(left_mem, left_length, left_length);

let right_layout = Layout::array::<T>(right_length).expect("right allocation failed!");
let right_mem = alloc(right_layout).cast::<ManuallyDrop<T>>();
let right = Vec::from_raw_parts(right_mem, right_length, right_length);

ptr::copy(&vec[p], left_mem.cast::<T>(), left_length);
ptr::copy(&vec[q], right_mem.cast::<T>(), right_length);
```

甚至可以把这两个copy提前到`from_raw_parts`前面，居然也能正常运行。

也就是说`Vec::from_raw_parts`函数，就是把一段开辟的堆空间“当成”是对应类型的向量。

最终的代码是这样的：

:::tabs

@tab lib.rs
```rust
use std::{ alloc::{ alloc, Layout }, mem::ManuallyDrop, ptr };
use algorithms_prelude::Sorter;

pub struct MergeSorter<'a, Seq>(pub &'a mut Seq);

impl<'a, Elem> Sorter for MergeSorter<'a, Vec<Elem>> {
    type Element = Elem;

    fn sort_by(&mut self, compare: fn(prev: &Self::Element, next: &Self::Element) -> bool) {
        let vec = &mut self.0;

        if vec.len() < 2 {
            return;
        }

        merge_sort(vec, compare, 0, vec.len());
    }
}

fn merge_sort<T>(vec: &mut Vec<T>, compare: fn(prev: &T, next: &T) -> bool, p: usize, r: usize) {
    if p < r - 1 {
        let q = (p + 1 + r) >> 1;
        merge_sort(vec, compare, p, q);
        merge_sort(vec, compare, q, r);
        merge(vec, compare, p, q, r);
    }
}

fn merge<T>(
    vec: &mut Vec<T>,
    compare: fn(prev: &T, next: &T) -> bool,
    p: usize,
    q: usize,
    r: usize
) {
    let left_length = q - p;
    let right_length = r - q;

    unsafe {
        // ManuallyDrop的零成本抽象，让ManuallyDrop<T>和T在内存中的数据结构完全一致，也就允许用指针强转的方式强行写入。
        let left_layout = Layout::array::<T>(left_length).expect("left allocation failed!");
        // 申请相应尺寸的空间（前面已定义），返回一个指针，但并没有假设你的指针是对应类型的，需要你手动强转一遍。
        let left_mem = alloc(left_layout).cast::<ManuallyDrop<T>>();
        // 强转指针，匹配类型
        ptr::copy(&vec[p], left_mem.cast::<T>(), left_length);
        let left = Vec::from_raw_parts(left_mem, left_length, left_length);

        let right_layout = Layout::array::<T>(right_length).expect("right allocation failed!");
        let right_mem = alloc(right_layout).cast::<ManuallyDrop<T>>();
        ptr::copy(&vec[q], right_mem.cast::<T>(), right_length);
        let right = Vec::from_raw_parts(right_mem, right_length, right_length);

        let mut i = 0;
        let mut j = 0;
        let mut k = p;

        while i < left_length && j < right_length {
            if compare(&left[i], &right[j]) {
                ptr::copy((&left[i] as *const ManuallyDrop<T>).cast::<T>(), &mut vec[k], 1);
                i += 1;
            } else {
                ptr::copy((&right[j] as *const ManuallyDrop<T>).cast::<T>(), &mut vec[k], 1);
                j += 1;
            }
            k += 1;
        }

        if i < left_length {
            ptr::copy(
                (&left[i] as *const ManuallyDrop<T>).cast::<T>(),
                &mut vec[k],
                left_length - i
            );
        } else if j < right_length {
            ptr::copy(
                (&right[j] as *const ManuallyDrop<T>).cast::<T>(),
                &mut vec[k],
                right_length - j
            );
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    #[test]
    fn it_sort_ascending() {
        let mut v = vec![22, 43, 145, 1, 9];
        MergeSorter(&mut v).sort_by(|prev, next| prev < next);
        assert_eq!(v, vec![1, 9, 22, 43, 145]);
    }

    #[test]
    fn it_sort_descending() {
        let mut v = vec![22, 43, 145, 1, 9];
        MergeSorter(&mut v).sort_by(|prev, next| prev > next);
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

        MergeSorter(&mut v).sort_by(|prev, next| prev.id < next.id);
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

    #[test]
    fn it_struct_sort_ascending_equal() {
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
            },
            Foo {
                id: 43,
                name: "LS2",
            }
        ];

        MergeSorter(&mut v).sort_by(|prev, next| prev.id <= next.id);
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
                    id: 43,
                    name: "LS2",
                },
                Foo {
                    id: 145,
                    name: "WW",
                }
            ]
        );
    }

    #[test]
    fn it_struct_sort_ascending_equal_box() {
        #[derive(Debug, PartialEq)]
        struct Foo {
            id: u32,
            name: &'static str,
        }

        let mut v = vec![
            Box::new(Foo {
                id: 22,
                name: "ZS",
            }),
            Box::new(Foo {
                id: 43,
                name: "LS",
            }),
            Box::new(Foo {
                id: 145,
                name: "WW",
            }),
            Box::new(Foo {
                id: 1,
                name: "ZL",
            }),
            Box::new(Foo {
                id: 9,
                name: "SQ",
            }),
            Box::new(Foo {
                id: 43,
                name: "LS2",
            })
        ];

        MergeSorter(&mut v).sort_by(|prev, next| prev.id <= next.id);
        assert_eq!(
            v,
            vec![
                Box::new(Foo {
                    id: 1,
                    name: "ZL",
                }),
                Box::new(Foo {
                    id: 9,
                    name: "SQ",
                }),
                Box::new(Foo {
                    id: 22,
                    name: "ZS",
                }),
                Box::new(Foo {
                    id: 43,
                    name: "LS",
                }),
                Box::new(Foo {
                    id: 43,
                    name: "LS2",
                }),
                Box::new(Foo {
                    id: 145,
                    name: "WW",
                })
            ]
        );
    }
}
```
:::

## 再优化
在这个归并排序中，每次合并都是将待合并的两个切片先拷贝到临时区域，再重新写入，一来一回，遍及整个向量。
显然有个拷贝更少的方案，就是让切分至末端的数组归并到临时的数组，再继续归并，最终才写入原数组，从反复横跳，到转一圈走完。

原本的复杂度是2nlgn，新的复杂度优化为(n+1)lgn。怎么优化，下一篇再说。