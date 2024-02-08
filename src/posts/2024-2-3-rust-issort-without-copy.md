---
title: Rust与算法基础（2）：用Rust实现插入排序（中）
date: 2024-02-03
category: 编程
tag:
    - Rust
    - 算法
---

上一集我们用泛型实现了一个参数可以是任何类型元素的数组。
实现到这里，这个sort函数已经能胜任所有数字类型的参数了，无论是isize还是usize，f32还是f64都可以用，因为它们都是原生实现了这两个特质的基础数据类型。即使是没有实现它的，也可以手动实现这两个trait再使用。

然而增加了PartialOrd和Copy限定的真的能算是“任何类型”吗？
试想一下我们要将我们写的工具用于实际开发，写了一个限定了trait bound的函数，如果我想使用复杂的数据类型，我也得实现Copy。现在这个排序的目标是能接受所有类型，当然就包括没有Copy trait的。所以要如何做，应该先回答几个问题。

## 让目标数据实现copy trait，还是让函数支持非copy？

Copy是与Move相对应的概念。Copy的意义就是完全的数据拷贝，是将内存上一整块数据复制到另一个地址的相同空间，复制出来的数据应该与原数据完全相同，任何对copy trait的实现必须遵守它。Copy trait也是对`=`号的运算符重载，实现了copy的就是复制，没实现的就是移动。

> 与Copy相似的Clone则是“随便备份”的意思。Clone就是个普通的trait，实现它不需要遵循什么守则。所以Clone的含义就是再创建一个对象，对象的**某些属性**与原对象相同，实现者可以自己决定哪些与原对象相同。

我们现在要让仅支持move的类型也支持这个算法，可以吗？当然可以，因为排序只是移位，结果上并没有复制，所以实现它是没问题的，只是编译器没法知道我的意图，不让我这么干而已。

## 为什么编译器不许？

如果你已经知道“读者写者问题”，这个问题就很好解释了。这是Rust编译器静态分析所遵循的核心原则之一————一个对象有多个“读者”或一个“写者”。move可以理解为电脑里的文件移动————复制，然后删除原来的文件。这么理解好像是move也是copy，还比copy多了一步。

实际上这是错的，你不能将c/c++的`=`放到这里来对应。如果是copy那是一样的，但如果是move，编译器既然认识，就自然会优化。那么当以下语句执行时：

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let a = Point { x: 1, y: 2};
    let b = a;
}

并不会发生值拷贝。
```

函数变量相当于各种各样的窗口，将对象（move）赋值给函数变量就是将对象与窗口以各种形式绑定。你可以绑定为可变的，不可变的（只读）的，以及各种引用。这里就有一个“引用再解引不可移出”原则：

```rust
let foo_f = Foo { a: 1, b: 2 };
let bar_f = *&foo_f; // 会报错：cannot move out of a shared reference
```

移动是所有权的移交，而引用并没有改变所有权，那么解引后的这个对象的所有权仍然属于原来的窗口，解引只代表借给了你，原所有者允许你读写你就能读写，但你不能自作主张给其他人，这就是“借用”。

而成员变量（包括对象的成员、数组以及元组的元素）本质仍是“地址加偏移”。即使这个窗口拥有了这个对象的所有权，这个对象的所有成员，我仍然只能通过引用的方式访问，成员的所有权不可以单独被转移。

在Rust中，你能够直接给对象的某个成员赋值，是因为你将对象移动到了某个可变的“窗口”，对象里的所有成员都会提供一个可变**引用**（如果是不可变窗口那成员自然是不可变引用）。当需要对成员读写的时候，`.`号**暗含了一层解引**，让你可以读写。

所以成员不可移出原则本质上是“引用再解引不可移出原则”的一种情形。它一刀切地解决了许多指针悬垂的问题，也禁止我们这么做。

而我们现在要实现的，本来就能保证不会有这个问题。数据移位了，并没有发生复制，也没有真正地移出，只是移到了另一个成员变量里。

所以理由很充分，我们需要某些方法来“特事特办”。

## mem::take()

现在我把Copy trait限定去掉，然后在位移里做个小改动。

```rust
use std::mem;

pub fn sort<Elem: PartialOrd>(vec: &mut Vec<Elem>) {
    for i in 1..vec.len() {
        let e = mem::take(&mut vec[i]);
        let mut j = i;
        while j > 0 && &vec[j - 1] > &e {
            let t = mem::take(&mut vec[j - 1]);
            vec[j] = t;
            j = j - 1;
        }
        vec[j] = e;
    }
}
```

编译报错，需要加个Default限定，虽然减了又加了没比原来简单多少，但是你有没有发现这个take的神奇之处？

它居然能够把成员变量的所有权给提取了出来，需要的只是获取目标位置的可变引用！

这个函数的意思就是给它目标位置的引用，它就能解引用，并且把解引用的数据直接返回。返回值当然包括了所有权的交还，这意味着mem::take取得了解引用对象的所有权。同时为了保证原来的位置合法，函数会将这个类型数据的默认值填充进去（所以参数是可变引用），所以它必须限定有默认值。

我们测试一下，在测试块中加入：

```rust


    #[test]
    fn it_struct_sort_ascending() {
        #[derive(Debug, PartialEq, Default)]
        struct Foo {
            id: u32,
            name: &'static str,
        }

        impl PartialOrd for Foo {
            fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
                return self.id.partial_cmp(&other.id);
            }
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

        sort(&mut v);
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

```

这里的derive默认实现了三个特质，Debug和PartialEq是为了测试断言宏`assert_eq!`的，Default默认实现了默认值，就不用手动写了。

Default的默认实现是将所有的成员的默认值取其默认值，这个过程是递归的。

而PartialOrd我手动实现了，取其id作比较。

这个测试是能通过的，现在我们成功地实现了无Copy trait的类型数据的排序！

### mem::take()为什么这么神奇？

`mem::take()`在执行后依然保证了所有位置的数据是合法的，所以它没有加unsafe，它保证是一个安全函数。
但它显然又违反了解引不可移出原则，这是怎么办到的？不妨直接看它的源码。

```rust
#[inline]
#[stable(feature = "mem_take", since = "1.40.0")]
pub fn take<T: Default>(dest: &mut T) -> T {
    replace(dest, T::default())
}
```

调用了`mem::replace()`，那么再看看replace。

```rust
#[inline]
#[stable(feature = "rust1", since = "1.0.0")]
#[must_use = "if you don't need the old value, you can just assign the new value directly"]
#[rustc_const_unstable(feature = "const_replace", issue = "83164")]
#[cfg_attr(not(test), rustc_diagnostic_item = "mem_replace")]
pub const fn replace<T>(dest: &mut T, src: T) -> T {
    // SAFETY: We read from `dest` but directly write `src` into it afterwards,
    // such that the old value is not duplicated. Nothing is dropped and
    // nothing here can panic.
    unsafe {
        let result = ptr::read(dest);
        ptr::write(dest, src);
        result
    }
}
```

从这里开始就出现了unsafe块，unsave块里调用了两个unsafe函数。注释里也解释了为什么这是安全的，
简单来说就是读取之后就把原来的内存给覆写了，对象自始至终都是单份的，所以这就是安全。

这是不是有点《致命魔术》里狼叔每次大变活人都把原来的自己给杀掉的感觉？只要没给整出双份的来，就是正常的。

就着这个思想，只要保证我们也遵守它，我们也可以这么做。

所谓unsafe就是万能钥匙，当你开始用unsafe的时候，就得像一个开锁公司一样守规矩，而不是当小偷，
哪怕盗亦有道当梁上君子也不行（要守序，而不是善良）。

虽然用上了安全的mem::take()，但这好像没什么运行效率，每次调换位置都要一读一写，实际上在完全排序完成前，允许短暂出现双份也没什么不行（还是有不行的地方）。

## unsafe

那么不妨自己实现一个unsafe的插入排序，没有中间商赚差价。

现在我们直接开始用std::ptr里的函数。这个mod里的函数已经全是用生指针（raw pointer）对内存数据的直接操作了，
基本上全是unsafe函数，调用时需要注意按照注释里的安全事项来实现。
再往深处的调用基本都是内部实现了，看不到源码了。

直接一步到位，把“读后写”改成ptr::copy

:::tabs
@tab lib.rs
```rust
use std::ptr;

pub fn sort<Elem: PartialOrd>(vec: &mut Vec<Elem>) {
    for i in 1..vec.len() {
        unsafe {
            let e = ptr::read(&vec[i]);
            let mut j = i;
            while j > 0 && &vec[j - 1] > &e {
                ptr::copy(&vec[j - 1], &mut vec[j], 1);
                j = j - 1;
            }
            vec[j] = e;
        }
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

    #[test]
    fn it_struct_sort_ascending() {
        #[derive(Debug, PartialEq)]
        struct Foo {
            id: u32,
            name: &'static str,
        }

        impl PartialOrd for Foo {
            fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
                return self.id.partial_cmp(&other.id);
            }
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

        sort(&mut v);
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
:::

cargo test测试正常。来看看里面的unsafe块
```rust
unsafe {
    let e = ptr::read(&vec[i]);
    let mut j = i;
    while j > 0 && &vec[j - 1] > &e {
        ptr::copy(&vec[j - 1], &mut vec[j], 1);
        j = j - 1;
    }
    vec[j] = e;
}
```

这里就改动了两个地方，用`ptr::read()`取代了第一个`mem::take()`，用`ptr::copy()`取代了第二个用`mem::take()`实现的移位。

第一个`ptr::read()`是不安全的，因为它并不会过问目标位置是否合法，目标位置的内存写什么就能读出什么。
而且这个过程没有问目标数据是否支持copy，就强行发生了拷贝，并获取了所有权，不应滥用它来实现对所有没copy trait的拷贝行为。
如果你的函数实现目的就是拷贝，那就要加copy trait bound。

第二个`ptr::copy()`对应C语言的`memmove()`（还有个`ptr::copy_nonoverlapping()`，对应C的`memcpy()`）。
实现的是，将源位置的数据，复制一定长度到目标位置。第三个参数count即“步长”，每个步长的长度就是这个类型的数据的长度，
这里是count是1，就是一个Elem的长度。

因为这里步长为1而且源位置和目标位置一定不同，所以两个范围保证不会重叠，所以可以用`ptr::copy_overlapping()`提速。

> C的`memmove()`与`memcpy()`的区别：
> `memmove()`会做一些安全措施，所以会更慢；
> 而`memcpy()`的行为更简单，所以会在源位置区间和目标位置区间有重叠时，会发生“未定义行为”，也就是根据不同编译器各自对C的实现，会有不同的操作，导致不同的结果。
> 未定义行为，打个比方。我们为人定义了标准的走路行为，要求走路是两条腿交替向前迈步。但是这个走路标准并没有规定你应该先迈左腿还是先迈右腿，你先迈哪个腿都是符合标准的。而现在你的左腿前面有个坑，先迈左腿会踩坑摔跤，先迈右腿不会，同是走路标准的两种不同实现会有不同结果。先迈哪个腿就是走路标准的未定义行为。

## 还是有不行的地方

之前提到过“还是有不行的地方”，指的是我们平常写这样的代码总是默认它是顺序执行的。但实际上程序会并发运行，
就可能会发生多个函数或者同一个函数的多个实例跳转着运行，如果它们同时操作着同一个数组，数据就会错乱。

应当保证这个函数的运行是“原子的（atomic）”，运行到这个函数的时候只有这个函数的这个实例在运行。

现在至少把Copy trait bound给去掉了。那么PartialOrd呢？对象应该是可以没有这个特质的。
大多数时候我们并不需要给某个类型的数据比大小，概念上我不认为它是可以比大小的。
只是在某些时候需要用一套规则来排序，这个规则应该是可以自定义的，而不是在定义类型的时候就给它定死。
那么该怎么办呢？且听下回分解。
