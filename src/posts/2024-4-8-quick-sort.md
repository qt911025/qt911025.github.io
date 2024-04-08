---
title: Rust与算法基础（10）：快速排序
date: 2024-04-08
category: 编程
tag:
    - Rust
    - 算法
---

先上实现

```rust
pub struct QuickSorter<'a, Seq>(pub &'a mut Seq);

impl<'a, Elem> Sorter for QuickSorter<'a, Vec<Elem>> {
    type Element = Elem;

    fn sort_by(&mut self, compare: fn(prev: &Self::Element, next: &Self::Element) -> bool) {
        let vec = &mut self.0;

        if vec.len() < 2 {
            return;
        }

        quick_sort(vec, compare, 0, vec.len());
    }
}

fn quick_sort<T>(
    vec: &mut Vec<T>,
    compare: fn(prev: &T, next: &T) -> bool,
    first: usize,
    end: usize
) {
    if end - first > 1 {
        // 用相同的末尾开区间原则，避免usize在0的情况下-1（即使是safe代码，这还是会panic）
        let divider = partrition(vec, compare, first, end);
        quick_sort(vec, compare, first, divider);
        quick_sort(vec, compare, divider + 1, end);
    }
}

fn partrition<T>(
    vec: &mut Vec<T>,
    compare: fn(prev: &T, next: &T) -> bool,
    first: usize,
    end: usize
) -> usize {
    // 随机选一个主元，让划分更平均，但这样强行换位置，就做不到幂等了
    // 而且最后一个元素的大小本来就是随机的，所以再随机并没有意义
    // let random_pivot = rand::thread_rng().gen_range(first..end);
    let last = end - 1;
    // unsafe {
    //     ptr::swap_nonoverlapping(&mut vec[random_pivot], &mut vec[last], 1);
    // }
    let mut i = first;
    for j in first..last {
        // 最后一个是待换的
        if compare(&vec[j], &vec[last]) {
            unsafe {
                ptr::swap_nonoverlapping(&mut vec[i], &mut vec[j], 1);
            }
            i += 1;
        }
    }
    unsafe {
        ptr::swap_nonoverlapping(&mut vec[i], &mut vec[last], 1);
    }
    i
}
```

快速排序最差情形是$\Omicron(n^2)$的，当划分函数划分的子序列长度总是一个为1一个为i-1时，
每次都只切分出一个长度为1的数组，让另一个数组继续遍历。这种情况常常发生在有大量键相同的情况下，
。当每次划分大多都能让划分位（divider）处于中间，算法就越趋于最佳情形。

还有如果数组本身如果已经接近排序好，算法也会趋于最坏情形，因为选择的作为划分位的数，在子序列的末尾。

课后习题会要求用一个随机函数随机抽取某个位置的数作为划分位，这在一定程度上平衡混乱程度不同的输入序列，
让有序的序列也变得混乱（已在注释中写出）。这种实现的弊端便是无法保证幂等性。

## 比较排序
前面几个实现的排序算法都基于元素的两两比较，效率取决于能将多少无需比较的元素排除掉。
这些排序算法统称**比较排序**，比较排序在最坏情形下，效率的下界是$\Omega(n\lg{n})$
（算法导论中考虑问题都是二进制的，规定$\lg{n}$为$\log_2{n}$）。

自此，《算法导论》第三版教的比较排序就告一段落了，一些低效的比较排序比如选择排序、冒泡排序都在课后练习里，
这里就不实现了。

接下来要学的是非比较排序，都是些线性时间复杂度的排序算法。之前用到的接口形式都是比较排序的，并不适用于接下来的算法。
算法的测试目标也会做一些改变，不方便实现比较函数回调。所以接口也改个名，把`Sorter`trait改成`CompareSorter`。