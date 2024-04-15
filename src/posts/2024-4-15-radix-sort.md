---
title: Rust与算法基础（12）：基数排序
date: 2024-04-15
category: 编程
tag:
    - Rust
    - 算法
---

上一篇我们实现了一个针对10以内数的计数排序，里面有一个回调函数的设计。
这个回调函数将在这里用到。

基数排序需要用到一个稳定排序，首先确定排序元素的进制，然后按进制从低到高位一遍遍地排序。

比如现在要升序排一组数：153、356、321、26

我们先规定这组数都是十进制的数码构成的序列，是小于1000的自然数。
基数排序需要进行这样的循环：

先排个位数，得：321、153、356、26

这里356和26的个位数是相同的，因为这是一个稳定排序，所以两者的前后顺序在排序后不变。

然后再排十位数，得：321、26、153、356

这次排序保证了十位数次序不变，这次排序是稳定的，这也意味着之前的个位数排序的结果依然稳定。
在十位数相等的前提下，个位数的前后关系仍然保留，也就仍是升序。

按照数学归纳法可以证明最终所有位数排序后，能得到正确的结果。

最后排百位数，得：26、153、321、356

这种算法不但可以排数字，还可以很方便地实现字符串的排序，这里就不展开了。

初步实现一下，这个实现用到了上一篇的代码，所以需要在Cargo.toml引入一下：

```rust
use counting_sort::counting_sort;

pub fn radix_sort(arr: Vec<usize>, scale: usize, max_bit: u32) -> Result<Vec<usize>, &'static str> {
    if let Some(max_value) = scale.checked_pow(max_bit) {
        for &e in arr.iter() {
            if e >= max_value {
                return Err("Element overflow!");
            }
        }
    } else {
        return Err("Max value overflow!");
    }

    let mut result = arr;

    for bit in 1..=max_bit {
        result = counting_sort(result, scale, |&e| { (e % scale.pow(bit)) / scale.pow(bit - 1) })?;
    }
    Ok(result)
}
```

然而却报错了，`counting_sort`的`enumerate`的类型要求是一个函数指针，但是却传入了一个**闭包**。
这在之前的调用中没遇到过，这个**匿名函数**调用了bit，使得这个**匿名函数**成了闭包。

## 闭包

我们需要`counting_sort`函数的回到能用上闭包，所以需要把`counting_sort`改成这样：

```rust
pub fn counting_sort<T, F>(
    vec: Vec<T>,
    max_key: usize,
    enumerate: F 
) -> Result<Vec<T>, &'static str>
    where F: Fn(&T) -> usize
```

然后测试一下：

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_sort_ascending() -> Result<(), &'static str> {
        let mut v = vec![22, 43, 145, 1, 9];
        v = radix_sort(v, 10, 3)?;
        assert_eq!(v, vec![1, 9, 22, 43, 145]);
        Ok(())
    }
}
```

这是可以通过的。

书上说这种算法能够有O(n)的时间复杂度，是因为传入的位数与进制是与排序的序列规模无关的。
然而位数与进制本身是一个比较大的常数，这个算法的复杂度常数相对是比较大的。