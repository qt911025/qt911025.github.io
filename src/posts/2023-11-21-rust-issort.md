---
title: Rust与算法基础（1）：用Rust实现插入排序（上）
date: 2023-11-21
category: 编程
tag:
    - Rust
    - 算法
---

不知道大家在初学Rust的时候是否和我有一样的感受。教程看了不少学了不少，笔记习作做了很多，
可一到写自己想写的程序的时候却发现自己除了教程教的代码还是什么都写不出来。

当我试着去实现算法基础里的功能时，遇到的问题可以说是淋漓惨淡，几乎每一步能通过都不容易。
实现不了，阉割需求，再实现还是不行，接着阉割。断断续续写完后，又弃坑了很长一段时间，毕竟不是干这行的也没什么动力把坑填了。
但某一天突然又想把一些尾巴清理掉，卸下负担。

清理这个尾巴的过程我又逐渐开悟，不过与其说是开悟，倒不如说是观念的转变。
很多事情早就想过，现在回想起来，重新思考得出的结果和当年的没有区别，但现在却能把过去完不成的给完成了。
这个过程非常奇妙。

我现实中喜欢把自己想的东西用一种非常啰嗦的方式表达出来，只是为了精准，不被误解。这篇写出来其实很基础很小儿科，都是已经懂的人早就懂了的概念。
但我想，还是会有很多人像我一样迷茫过，希望一篇文章能把大多数困惑给解了。

国外的教程，主要是官方教程，或者API文档，会提一些比较抽象的概念，希望用抽象的概念就能自圆其说，尽量回避底层原理。而国内的教程则是反过来，会尽量提到这些概念。

就比如说C++的生命周期概念，还有Rust的官方教程会告诉你=号是“关联”等等。好像完全学会这些概念之后，就能把这个语言学好，如果不行，那就再创造些概念补全这个体系。
在看了B站杨旭老师（软件工艺师）的教程之前，我都没意识到Rust不用GC也不用指针靠的不是什么魔法。
不意识到Rust本质还是和C++/C一样，只靠去悟那些概念，记各种编译器的各种戒律，反而会越学越迷糊。最搞笑的就是当你发现怎么有的规则编译器自己却不遵守的时候，一问才知那是语法糖。

好了还是进入正题吧。

## 一个简单的插入排序怎么就这么难？

插入排序还不简单吗，原理和伪代码就不多说了，就直接把伪代码翻译成Rust吧。
这里的需求是，实现一个对参数有改动的函数，而非保护参数，生成一个新向量作为结果。
只实现升序排序

输入：`Vec<i32>`
输出：无

:::tabs
@tab main.rs
```rust

fn main() {
    let mut int_array: Vec<i32> = vec![22, 43, 145, 1, 9];

    issort(&mut int_array);

    int_array.iter().for_each(|e| {
        println!("{:?}", e);
    });
}

fn issort(vec: &mut Vec<i32>) {
    for i in 1..vec.len() {
        let e = vec[i];
        let mut j = i;
        while j > 0 && &vec[j - 1] > &e {
            vec[j] = vec[j - 1];
            j = j - 1;
        }
        vec[j] = e;
    }
}


```
:::

这个程序是正常的，下面开始逐步增加需求。

## 重构一下

如果我希望编写的排序是可供其他程序调用的，那我可以把它改造成库。
把排序函数移到lib.rs，并增加单元测试。

> 注意：这个项目的项目名是issort。函数名我也改成sort了

### 单元测试

:::tabs
@tab lib.rs
```rust
pub fn sort(vec: &mut Vec<i32>) {
    for i in 1..vec.len() {
        let e = vec[i];
        let mut j = i;
        while j > 0 && &vec[j - 1] > &e {
            vec[j] = vec[j - 1];
            j = j - 1;
        }
        vec[j] = e;
    }
}

#[cfg(test)]
mod test {
    use super::*;
    #[test]
    fn it_sort_ascending() {
        let mut v = vec![22, 43, 145, 1, 9];
        sort(&mut v);
        assert_eq!(v, vec![1, 9, 22, 43, 145]);
    }
}


```

@tab main.rs
```rust
use issort::sort;
fn main() {
    let mut int_array: Vec<i32> = vec![22, 43, 145, 1, 9];

    sort(&mut int_array);

    int_array.iter().for_each(|e| {
        println!("{:?}", e);
    });
}
```
:::

### 程序参数输入

之前的程序都是一个`cargo run`输出结果，要改变的数组却写在程序里，这都不能算是一个有用的命令行程序。

至少输入的参数得自己定，对吧？

:::tabs
@tab lib.rs
```rust
pub fn sort(vec: &mut Vec<i32>) {
    for i in 1..vec.len() {
        let e = vec[i];
        let mut j = i;
        while j > 0 && &vec[j - 1] > &e {
            vec[j] = vec[j - 1];
            j = j - 1;
        }
        vec[j] = e;
    }
}

#[cfg(test)]
mod test {
    use super::*;
    #[test]
    fn it_sort_ascending() {
        let mut v = vec![22, 43, 145, 1, 9];
        sort(&mut v);
        assert_eq!(v, vec![1, 9, 22, 43, 145]);
    }
}


```

@tab:active main.rs
```rust
use std::env;

use issort::sort;

fn main() {
    let mut args: Vec<String> = env::args().collect();
    args = args[1..].to_vec();
    let mut int_array: Vec<i32> = Vec::new();

    for s in args {
        int_array.push(s.parse().unwrap());
    }

    sort(&mut int_array);
    for i in int_array.iter() {
        println!("{:?}", i);
    }
}

```
:::

在这里，我们需要引入`std::env`来获取输入的参数，输入的参数是一个`Vec<String>`，因为输入的多个字段本质上就是字符串，而不是代表的数字，
所以需要解析成i32。

为了图方便，这里频繁使用了`unwrap()`，实际开发中这是不负责任的做法。开发者应当考虑到错误的输入并提供相应的处理（增加合理的处理还是直接中断并向使用者报错）。

现在执行一下`cargo run 22 43 145 1 9`，输出是正确的。

#### 除了for循环，也可以用一种函数式编程的写法

:::tabs
@tab lib.rs
```rust
pub fn sort(vec: &mut Vec<i32>) {
    for i in 1..vec.len() {
        let e = vec[i];
        let mut j = i;
        while j > 0 && &vec[j - 1] > &e {
            vec[j] = vec[j - 1];
            j = j - 1;
        }
        vec[j] = e;
    }
}

#[cfg(test)]
mod test {
    use super::*;
    #[test]
    fn it_sort_ascending() {
        let mut v = vec![22, 43, 145, 1, 9];
        sort(&mut v);
        assert_eq!(v, vec![1, 9, 22, 43, 145]);
    }
}


```

@tab:active main.rs
```rust
use std::env;

use issort::sort;

fn main() {
    let mut int_array: Vec<i32> = env
        ::args()
        .skip(1)
        .map(|s| s.parse().unwrap())
        .collect();

    sort(&mut int_array);

    int_array.iter().for_each(|e| {
        println!("{:?}", e);
    });
}

```
:::

`env::args()`是一个Iterator（迭代器），它用`skip(1)`跳过了第一个参数（程序名本身），从第二个参数开始，就是输入的数组的每一个元素了。

## 从i32到所有数

输入是一个`Vec<i32>`，这限定了数组的元素必须是i32的，那么如果我想要比较其他数呢？不能是每一种参数都写一个函数，所以就需要用到泛型。

不只是所有数，只要是可以比大小的元素，这个排序函数都应该能胜任。

所以直接将sort改成带泛型的

```rust
pub fn sort<Elem>(vec: &mut Vec<Elem>) {
    for i in 1..vec.len() {
        let e = vec[i];
        let mut j = i;
        while j > 0 && &vec[j - 1] > &e {
            vec[j] = vec[j - 1];
            j = j - 1;
        }
        vec[j] = e;
    }
}
```

显然这是错的，不是什么类型的数据都是可以被比较的。

我们应该加入个限定`PartialOrd`，只有实现了PartialOrd特质的元素才能被比较，这很合理。

```rust
pub fn sort<Elem: PartialOrd>(vec: &mut Vec<Elem>) {
    for i in 1..vec.len() {
        let e = vec[i];
        let mut j = i;
        while j > 0 && &vec[j - 1] > &e {
            vec[j] = vec[j - 1];
            j = j - 1;
        }
        vec[j] = e;
    }
}
```

编译器显示了这样的错误
```
error[E0507]: cannot move out of index of `Vec<Elem>`
```

并提示我们应该限定Elem为实现Copy特质的类型。

好吧，那就加吧。

```rust
pub fn sort<Elem: PartialOrd + Copy>(vec: &mut Vec<Elem>) {
    for i in 1..vec.len() {
        let e = vec[i];
        let mut j = i;
        while j > 0 && &vec[j - 1] > &e {
            vec[j] = vec[j - 1];
            j = j - 1;
        }
        vec[j] = e;
    }
}
```

运行正常！

## 可是，凭什么？

且听下回分解。