---
title: Rust与算法基础（5）：归并排序（上）
date: 2024-03-03
category: 编程
tag:
    - Rust
    - 算法
---

来实现一个归并排序，照例，按照算法导论第三版（《Introduction to Algorithms》）的伪代码，结合之前插入排序的写法。
先写一个有PartialOrd + Copy特质的（这里就略过了），再改为无Copy特质、PartialOrd用回调代替的。

main和lib没什么大变化：

:::tabs

@tab lib.rs
```rust
use std::ptr;
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

    let mut left = Vec::with_capacity(left_length);
    let mut right = Vec::with_capacity(right_length);

    unsafe {
        ptr::copy(&vec[p], &mut left[0], left_length); // 运行时报错
        ptr::copy(&vec[q], &mut right[0], right_length); // 运行时报错

        let mut i = 0;
        let mut j = 0;
        let mut k = p;

        while i < left_length && j < right_length {
            if compare(&left[i], &right[j]) {
                ptr::copy(&left[i], &mut vec[k], 1);
                i += 1;
            } else {
                ptr::copy(&right[j], &mut vec[k], 1);
                j += 1;
            }
            k += 1;
        }

        if i < left_length {
            ptr::copy(&left[i], &mut vec[k], left_length - i);
        } else if j < right_length {
            ptr::copy(&right[j], &mut vec[k], right_length - j);
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
}

```

@tab main.rs
```rust
use algorithms_prelude::Sorter;
use merge_sort::MergeSorter;
use std::env;

fn main() {
    let mut int_array: Vec<i32> = env
        ::args()
        .skip(1)
        .map(|s| s.parse().unwrap())
        .collect();

    MergeSorter(&mut int_array).sort_by(|prev, next| prev < next);

    int_array.iter().for_each(|e| {
        println!("{:?}", e);
    });
}
```
:::

`merge_sort`会实现成一个递归函数，照例，产生临时存储区，用`ptr::copy`来复制整块数据。

相对于原书，p、q、r的意义有了一些改变，原书的伪代码第一个索引是从1开始数的，遍历循环，数组的右界是个闭区间。
也就是A\[p..r\]，p是第一个，r是最后一个。显然索引从1开始的话，A\[A.length()\]就是最后一个数，而程序中并不是这样。

> \[1..5\] => \[1, 5\] => \[1, 2, 3, 4, 5\]

Rust是从0开始数的，那么数组的最后一个数的下标就是数组长度减一。用数学符号表示的话，表示一个数组总是要用左闭右开区间。
取一个数组的切片，从p到r（\[p, r\)），如果r是开区间的话，取这个切片的长度正好就是r-p，不需要像原书那样还要加个1。

> \[0, 5\) => \[0, 1, 2, 3, 4\]

习惯了用这种方式思考，切片、取长短就不用费神去想哪里要+1哪里要-1了。在这里，p代表的是左界（闭），r是右界（开）。
q是切分位，q是左边数组的右界（开），右边数组的左界（闭）。

> \[p, r\) => \[p, q\) 与 \[q, r\)

当切分一个偶数长度的数组时，右界与左界的平均数正好为切分位，比如长度为4的数组下标是`0, 1, 2, 3`，切分位正好为2。
而当切分奇数长度的数组时，直接取平均值，由于整数相除得到的小数取整是直接舍去小数位，所以结果总是向下取整。

切分出的数组，右边长度总是大于等于左边的，最终切出来的二叉树，右边会深一些。
如果想要深的在左边，就要想办法让切分位的计算向上取整。结合未整除向下取整的特性，只需要使计算平均数时分子+1。
所以得到这样的表达式：

```rust
let q = (p + 1 + r) >> 1;
```

递归函数`merge_sort()`的终止条件是待切分数组的长度小于等于1，长度为1的数组切分之后得到的是长度0和长度1的数组，
这样就无法终止了。所以在将两个长度为1的数组传进`merge_sort()`时，递归函数什么都不做，就能执行到合并函数`merge()`了。

merge函数的意图是将数组切分开，暂存为两个数组。这两个切分开的数组可以理解成两个已经排序好的牌堆，
比较牌堆顶的牌，取最小的那张（升序排序），牌堆顶中最小的牌就是两个牌堆中最小的牌（证明略）。

## 溢出

理想的结果是，通过`Vec::with_capacity()`函数创造一个足够长度的向量，再通过`ptr::copy()`直接将切片拷到临时数组去。

然而运行的时候却报错了，错误信息是：

```
...
index out of bounds: the len is 0 but the index is 0
...
```

其他信息就不贴了，断点调试找到报错的位置就是在`ptr::copy()`的时候，向量的长度为0，所以不能拷贝进去。
当然我们可以用`copy_from_slice`安全地拷贝，但现在我们要实现的是不安全复制，最终这些临时数组是要抛弃的，
结果上没有数据被拷贝，我们可以保证这个函数是安全的。

那么回到原来的问题，我们该怎么去实现呢？用fill_with之类的长度撑一下？
这不就是在拷贝真正的数据之前先初始化了一遍吗？

那么Rust有没有像C/C++那种先申请空间再自行初始化的方法？当然有！不过在这之前，我们需要了解一下Rust的Vec是个什么结构。

Vec在其所在的地方保存了三个信息：一个指向申请的堆空间头部的指针，向量长度，和向量容量。
一个被安全初始化的Vec，指针指向的空间是已经申请好了的，向量长度由初始化决定，而向量容量是申请空间的长度。
Vec被不断地push数据，直到碰到向量容量，当碰到向量容量时，Vec会再申请一个新的更长的空间，把原来的数据拷贝过去，并释放原来的空间。

```
            ptr      len  capacity
       +--------+--------+--------+
       | 0x0123 |      2 |      4 |
       +--------+--------+--------+
            |
            v
Heap   +--------+--------+--------+--------+
       |    'a' |    'b' | uninit | uninit |
       +--------+--------+--------+--------+
```

可以预知，向量的容量足够长，实际上不会遇到真正的溢出。但向量依然会用长度来禁止用不安全的方式随意拷贝数据到向量中，
只要是超过长度的下标，就不允许访问。

**但Vec本身提供了一个不安全的方法，允许你初始化一个有长度而未初始化的数组。**Vec在初始化时，比如这里用到的`with_capacity()`函数，
就是以传入的参数作为大小，去申请堆空间。在Rust里，需要创建Layout，
再对Layout申请空间（alloc），而Vec也是用这个流程申请空间的。

Vec提供的这个方法，就是让你照着Vec的内部实现，自定义初始化过程，这个方法就是：
```rust
pub unsafe fn from_raw_parts(
    ptr: *mut T,
    length: usize,
    capacity: usize
) -> Vec<T>
```

我们将代码改成这样：

```rust
use std::{ alloc::{ alloc, Layout }, ptr };
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
        let left_layout = Layout::array::<T>(left_length).expect("left allocation failed!");
        let left_mem = alloc(left_layout).cast::<T>();
        let mut left = Vec::from_raw_parts(left_mem, left_length, left_length);

        let right_layout = Layout::array::<T>(right_length).expect("right allocation failed!");
        let right_mem = alloc(right_layout).cast::<T>();
        let mut right = Vec::from_raw_parts(right_mem, right_length, right_length);

        ptr::copy(&vec[p], &mut left[0], left_length);
        ptr::copy(&vec[q], &mut right[0], right_length);

        let mut i = 0;
        let mut j = 0;
        let mut k = p;

        while i < left_length && j < right_length {
            if compare(&left[i], &right[j]) {
                ptr::copy(&left[i], &mut vec[k], 1);
                i += 1;
            } else {
                ptr::copy(&right[j], &mut vec[k], 1);
                j += 1;
            }
            k += 1;
        }

        if i < left_length {
            ptr::copy(&left[i], &mut vec[k], left_length - i);
        } else if j < right_length {
            ptr::copy(&right[j], &mut vec[k], right_length - j);
        }
    }
}
```

运行测试，成功了！

`Layout::array::<T>(left_length)`是声明要申请的空间是什么类型的，这里就是一个元素为泛型T的数组。
Layout的创建本身是安全的，因为它只是“填个申请表”，还没真正开始申请空间，不安全的是alloc。
当alloc之后，就申请了一段未初始化数据的内存空间，并返回一个u8类型的可变引用，这个引用可以转为T类型的。

这个引用就是指向已申请空间的“指针”，把这个“指针”，传给`Vec::from_raw_parts`，设定好长度和容量，
就得到了一个没初始化，又有长度和容量的数组了。这样就可以将数据整段拷贝到新建的向量了。

## 一数组的指针

这个实现和之前的插入排序一样，还是没有解决堆中数据的释放问题。我们要按照[这篇文章](./2024-3-6-issue-of-pointer.md)的方法，
解决这个问题。

首先把测试用例拷过来，改一下方法名。运行报错了。

那么我们在结尾，也就是unsafe括号回之前加`forget`函数，
```rust
mem::forget(left);
mem::forget(right);
```
运行一下，测试是通过的。

**但是，这样并不好！**首先，这不是像插入排序那样，只是夺取一个变量的所有权，而是夺取一个数组的。

直接forget掉left和right，只是让这两个临时数组不会被回收掉。这两个临时数组没有被回收，也没有别的地方回收这两个数组，
就造成了内存泄漏。两个保存了一长串地址值的数组并没有被释放掉。而我们想要的“忘掉”，目的是避免重复释放。
重复释放是因为重复索引，重复索引的点在于数组中每一个Box指针，在临时数组中都有另一个“二重身”。我们的目的是精准除掉二重身，
需要的就是精准地“忘掉”每一个保存在临时数组里保存的Box指针，而保存指针的临时数组是应该被释放掉的。

所以正确的写法是：
```rust
for e in left {
    mem::forget(e);
}

for e in right {
    mem::forget(e);
}
```

## 等等，不是成员不可移出吗？

如果上面的两个for循环是这么写的：
```rust
for i in 0..left.len() {
    mem::forget(left[i]);
}

for i in 0..right.len() {
    mem::forget(right[i]);
}
```
编译器会直接报成员不可移出的错。为什么前面的又没有问题，这是因为两者有本质区别。

`for in`是一个针对迭代器的操作，而迭代器是一次性的。`in`的后面应该跟一个迭代器，
left不是迭代器而是Vec，也没报错，是因为Vec实现了IntoIterator trait，它在这个调用里被隐式地执行了`left.into_iter()`。
`into_iter()`方法会夺取left向量的所有权，left在这里就被移出了。

这种将一个变量移动到一个函数中，参数夺取所有权的行为叫做**consume，直白的翻译就是吃掉**。`left`被`into_iter`吃掉生成了一个迭代器，迭代器本身又被for循环吃掉了，每次循环执行一次迭代函数`next()`，返回一个**自带所有权的成员**，
成员的所有权流入了for循环体的作用域中（也就是后面大括号包裹的区域），可以任意处置。

如果什么都不做，`e`会在本次循环结束时结束生命周期，默认执行`drop()`回收。`forget(e)`就是阻止`e`调用`drop()`。
这样只有外层这个包含了Box指针的left向量被回收了。

而对于第二种写法，left的所有权并没有被夺取，`left[i]`操作只是一次**引用再解引**。for循环体作用域并没有`left[i]`的所有权，
如果什么都不做，`left[i]`在循环结束后也不会被释放，这就是和前者的区别。