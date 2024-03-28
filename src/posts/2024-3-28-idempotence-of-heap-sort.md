---
title: Rust与算法基础（9）：堆排序的幂等性
date: 2024-03-28
category: 编程
tag:
    - Rust
    - 算法
---

[之前的文章](./2024-3-2-issue-of-callback.md)中提到了比较函数中，小于号与小于等于号的区别。
比较函数应当符合许多性质，首先应当符合的就是传递性，如果函数返回的结果是随机的，那么整个排序的结果也是随机的。

比较函数使用小于号会使等于的情况下，把本来的先后关系对调。待插入对象是在已插入数组右边的，一直在向左移动。
所以遇“等”就停合情合理。

但当用同样的测试测下面这个堆排序，就出了问题。

:::tabs
@tab lib.rs
```rust
pub struct BiheapSorter<'a, Seq>(pub &'a mut Seq);

impl<'a, Elem> Sorter for BiheapSorter<'a, Vec<Elem>> {
    type Element = Elem;

    fn sort_by(&mut self, compare: fn(prev: &Self::Element, next: &Self::Element) -> bool) {
        let vec = &mut self.0;

        if vec.len() < 2 {
            return;
        }

        build_max_heap(vec, compare);
        for i in (1..vec.len()).rev() {
            unsafe {
                ptr::swap_nonoverlapping(&mut vec[0], &mut vec[i], 1);
            }
            max_heapify(vec, compare, 0, i);
        }
    }
}

// 构建最大堆，这个只会执行一次
// 构建后，父节点都会大于左右节点，而左右节点之间的大小未定
// i向下取整，因为i不是一个右开区间的右界，而是指向具体下标的“指针”
fn build_max_heap<T>(vec: &mut Vec<T>, compare: fn(prev: &T, next: &T) -> bool) {
    for i in (0..vec.len() >> 1).rev() {
        max_heapify(vec, compare, i, vec.len());
    }
}

fn max_heapify<T>(
    arr: &mut Vec<T>,
    compare: fn(prev: &T, next: &T) -> bool,
    i: usize,
    heap_size: usize
) {
    let l = ((i + 1) << 1) - 1; // 转换成1开头下标，乘以2后再转换成0开头下标
    let r = (i + 1) << 1; // 就在右边
    let mut largest = i;
    if l < heap_size && !compare(&arr[l], &arr[largest]) {
        largest = l;
    }
    if r < heap_size && !compare(&arr[r], &arr[largest]) {
        largest = r;
    }
    if largest != i {
        unsafe {
            ptr::swap_nonoverlapping(&mut arr[i], &mut arr[largest], 1);
        }
        max_heapify(arr, compare, largest, heap_size);
    }
}
```
:::

当vec里存在两个key相同的元素时，排序与理想的结果不符。两个相同key的元素应当在排序后维持原来的左右关系，然而并没有。

因为之前的两个排序都是按排序的结果推出一个个升序的结果从左往右排列。
而这次的堆排序，本质上是一次次将子序列\[0..vec.len()\]、\[0..vec.len()-1\]、\[0..vec.len()-2\]、……、\[0..1\]
的0号元素从右向左排列的过程。

而每次子序列的max_heapify过程都是一次向左“冒泡”，所以要让本来更靠右的元素在结果上还是靠右，那么就应该让元素在冒泡的时候，
相等条件应该也向左冒泡。
而正好，i、l、r三者的关系原本也是先后比较。试想一个i == l == r的情况。想让结果也符合i、l、r排序，
应该让r先出堆，再到l，再到i。那么至少应该让r先符合比较条件。

前面几次的测试用例可以换成这个测试**幂等性**的用例：

```rust
#[test]
fn it_struct_sort_ascending_idempotence() {
    // 幂等性测试，当比较函数包含等于时，结果应当是幂等的
    #[derive(Debug, PartialEq, Clone)]
    struct Foo {
        id: u32,
        name: &'static str,
    }

    let compare = |prev: &Foo, next: &Foo| prev.id <= next.id;

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

    BiheapSorter(&mut v).sort_by(compare);
    let sorted_v = v.clone();
    BiheapSorter(&mut v).sort_by(compare);
    // BiheapSorter(&mut v).sort_by(compare);
    // BiheapSorter(&mut v).sort_by(compare);

    assert_eq!(v, sorted_v);
}
```

幂等性即$f(x) = f(f(x))$。如果把x当作是序列，f是排序函数，那么幂等性的排序就是排序一个已按照这个规则排序好的序列，
其结果不变。特别是当序列含有相同key的多元素的时候，元素的顺序依然是不变的。

执行这个测试，发现并没有通过。我们再多排序一次，发现又通过了。排序的结果有一点震荡，排序偶数次，结果正确，奇数次则错误。

我们不破坏比较函数，光是在`max_heapify`中修改对比较函数的调用，让“等于”情况向上排序：

```rust
if l < heap_size && compare(&arr[largest], &arr[l]) {
    largest = l;
}
if r < heap_size && compare(&arr[largest], &arr[r]) {
    largest = r;
}
```

然后，幂等性测试通过了。