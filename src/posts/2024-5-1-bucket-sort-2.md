---
title: Rust与算法基础（14）：桶排序（中）
date: 2024-05-01
category: 编程
tag:
    - Rust
    - 算法
---

算法学习已经进入了一个新阶段，开始变得越来越难了。后面将会接触到各种各样的数据结构，这些数据结构大多是链式的。
链式的数据结构对于rust来说是个大坑，错综复杂的索引关系和Rust的内存安全机制八字不合。

今天就来个开胃菜，用链表实现桶。

## 需求分析

首先确定一下需要什么接口，先看看序列桶用到了哪些功能，我们实现链表桶就出一个对应的：

* 建造桶的集合还是用Vec实现，只是桶换成链表而已
* 不需要插入后再集中排序，而是插入时就插入指定的位置，所以需要一个`insert`方法
* 桶要像`Vec`一样能转成迭代器，只需要实现吃所有权的迭代器就行，引用迭代器不用实现

排序函数就改造成这样：
:::tabs

@tab lib.rs
```rust
mod linked_list_bucket;
use linked_list_bucket::*;

use conv::*;

// 桶排序
// 适用于输入元素的值均匀分布在[0,1)，或者能近似线性地建立单射者
// 根据输入的规模n，建立大小为n的桶集
// 输入元素乘以n并向下取整，结果会分布在[0,n)中
// 找到对应的桶，桶是一个链表，元素按线性查找插入排序到桶中
// 将所有桶首尾相接
pub fn bucket_sort<T, F>(arr: Vec<T>, mapper: F) -> Result<Vec<T>, &'static str>
    where F: Fn(&T) -> f64
{
    let arr_length = arr.len();

    // 建桶
    let mut buckets: Vec<Bucket<T>> = Vec::with_capacity(arr_length);
    buckets.resize_with(arr_length, || Bucket::new());

    // 进桶
    for e in arr {
        let key = mapper(&e);
        if key >= 0.0 && key < 1.0 {
            let bucket_id = (key * (arr_length as f64)).approx_as::<usize>().unwrap();
            buckets[bucket_id].insert(key, e);
        } else {
            return Err("元素值溢出");
        }
    }

    // 排序每个桶，并连接
    let result = buckets
        .into_iter()
        .flat_map(|bucket| bucket)
        .collect();
    Ok(result)
}
```
:::

创建了一个模块`linked_list_bucket`，所以新建一个`linked_list_bucket.rs`文件，初步实现几个接口。
这个链表是*无头节点式*的，开头比较插入的判定会多一点。

:::tabs

@linked_list_bucket.rs
```rust
pub struct Bucket<T> {
    head: Link<T>,
}

type Link<T> = Option<Box<Node<T>>>;
struct Node<T> {
    key: f64,
    elem: T,
    next: Link<T>,
}

impl<T> Bucket<T> {
    pub fn new() -> Bucket<T> {
        Bucket { head: None }
    }

    // key升序插入，顺序查询
    pub fn insert(&mut self, key: f64, elem: T) {
        unimplemented!()
    }
}
```
:::

先看看数据结构和接口的设计，首先设计一个桶（`Bucket`）类，再设计一个节点（`Node`）类。
此外还类型指定了了一个链（`Link`）类，链和节点是相互包含的关系。

为了防止静态分析无限递归，Link包含了一个Box指针。这个Box指针外部包裹了一个Option泛型，表示可能不存在。

`new`是新建一个空桶，`insert`是插入排序，插入的元素会根据`key`，在桶中的元素中挨个查询，直到找到`key`大于新插入元素的key的对象，
放在找到的元素的前面。

## 插入

实现一下`insert`：

```rust
pub fn insert(&mut self, key: f64, elem: T) {
    let mut new_node = Box::new(Node { key, elem, next: None });
    match self.head {
        None => {
            // 空桶
            self.head = Some(new_node);
        }
        Some(head_node) => {
            if head_node.key > new_node.key {
                //插入开头
                new_node.next = self.head.take();
                self.head = Some(new_node);
            } else {
                // 顺序查询
                let mut cur_node = head_node;
                while let Some(next_node) = cur_node.next {
                    if next_node.key > new_node.key {
                        break;
                    } else {
                        cur_node = next_node;
                    }
                }
                new_node.next = cur_node.next.take();
                cur_node.next = Some(new_node);
            }
        }
    }
}
```

函数在本作用域创建了一个`Box<Node<T>>`类型的新节点，因为后面要改变next的值，所以要加`mut`。

这里要注意的是本作用域创建的新节点，`new_node`是拥有这个对象的所有权的。因为需要修改成员，所以要求成员得是可变的，
所以要求包含它的对象也是可变的。

`Option`的`take`函数是一个安全的函数，会将`Some()`返回，并将原来位置替换成`None`，用来实现链表节点指针的替换。

## 成员的移出

当然这段代码没法通过编译，我们一个一个排查。首先看这行：
```rust
match self.head {
```
这里显示的是`self.head`无法被移出，通过这个可以知道`match`操作，以及`if let`、还有各种析取赋值操作本质上还是和一般的赋值一样，
都是移出行为。`self`只是一个可变引用，自然无法移出其成员（field）。

如果`self`的所有权进入了这个函数，它的成员就可以移出了，因为`self`本身活不过这个作用域了。

那么这里就得改成：
```rust
match &mut self.head {
```

得是可变引用，因为后面要修改`head`属性。

这样一改，后面的类型就对不上了:
```rust
cur_node = next_node;
```
`cur_node`是`&mut Box<Node<T>>`类型的，但`next_node`是`Box<Node<T>>`类型的。
试着改一下这句，直接创建它的可变引用。

```rust
cur_node = &mut next_node;
```

这下编译器暴露出了一个新问题，`cur_node.next`不能移出，原因和`self.head`不能移出是一样的。`cur_node`只有可变引用，不能将成员`next`移出。

那么用同样的方法改过来：
```rust
while let Some(next_node) = &mut cur_node.next {
```
这时候`next_node`已经是`&mut Box<Node<T>>`类型的了，下面就不需要`&mut`了，改回来。

整个函数现在变成了这样：
```rust
pub fn insert(&mut self, key: f64, elem: T) {
    let mut new_node = Box::new(Node { key, elem, next: None });
    match &mut self.head {
        None => {
            // 空桶
            self.head = Some(new_node);
        }
        Some(head_node) => {
            if head_node.key > new_node.key {
                //插入开头
                new_node.next = self.head.take();
                self.head = Some(new_node);
            } else {
                // 顺序查询
                let mut cur_node = head_node;
                while let Some(next_node) = &mut cur_node.next {
                    if next_node.key > new_node.key {
                        break;
                    } else {
                        cur_node = next_node;
                    }
                }
                new_node.next = cur_node.next.take();
                cur_node.next = Some(new_node);
            }
        }
    }
}
```

现在最恼火的部分来了，最后两句无论怎么改，都是可变引用多次借出问题，如果改成不可变引用，本身就不允许修改。

但是cur_node是每一步都指向一个新的节点，到底是哪里重复借用了呢？

## 引用与借用

### 真正的含义
到现在为止，我们好像都是在被编译器牵着鼻子走，编译器教我们改哪里我们就改哪里，改到编译器通过为止。
虽然编译器通过了，运行可能也没问题，但我们还是对其中的概念一头雾水，下次还是会出同样的问题。

引用、借用，哪怕是看《The Rust Book》还是《Rust Primer》，都只是一笔带过。编译器的错误信息都比书本解释得清楚。

我们应该先搞清楚引用和借用得含义。如果懂得这到底是什么，你甚至会发现“引用和借用有什么区别”是个蠢问题。

引用是reference，借用是borrow，只看中文，两个词只差了一个字，而且两个词几乎在所有场合都是一同出现的。
很容易让人想到这两个词是同义词，是写书的人在随意混用，甚至还有老师直接就告诉你“引用和借用是一个意思，你知道是什么回事就行”。

然而看原文，reference是名词，而borrow是动词。编译器提示里，也从来不会搞错reference和borrow，两者一换就是病句了。

其实**引用是一种数据类型，而借用是一个行为**。当我们“引用”时，不应该说“我们引用了”，而应该说我们“创建了一个引用”。

那么这个例子：
```rust
let mut a = 1;
let b = &mut a;

*a = 2;
```
应当这么解释：

声明了一个可变变量a和一个不可变变量b。

a变量初始化了一个值，为1，变量a拥有1这个对象的所有权；同理，我们创建了一个对a的可变引用，这也是一个对象，这个可变引用本身的所有权交给了b。

这个“b得到&mut a的所有权”的行为被定义为“变量a被借给了b”。

只要清楚借用本质上也是一个新建对象和移交所有权的过程就行。

### 有借有还，再借不难

不可变引用是允许多次创建的。而可变引用只能从未被借用的变量中创建，即使被借用过，也要先归还。

写Rust的时候总是有一种感觉，就是借用一借出去，这个变量就废了，因为借用从来就没还过，借用了之后这个变量也不允许移动了。

但这其实还是幸存者偏差，因为成功编译通过的程序你并不关心。

我们已经知道引用的创建本质上还是在创建一个对象并赋值到变量上，也是所有权转移，有所有权就有生命周期。
引用也是有生命周期的，生命周期的结束就在这个引用“被吃掉（consumed）”的时候。

引用和非引用只有一点区别，那就是非引用被吃掉之后，将会在更内层的作用域内走到生命终点，它的结局是被Drop掉；
而引用本身的生命周期结束，就意味着引用对象没了，但本尊还在。引用对象没了，也就意味着本尊又自由了，可以再创建引用了。

此外，Rust的静态分析还会判断每一个应用最后一次被访问是在哪一行，来确定引用的生命周期。
所以即使引用被赋值给和本尊同一个作用域内的其他变量，这个变量也会被视为在最后一次访问时结束生命周期，之后本尊就可以被访问了。

像这段代码：
```rust
    let mut a = 1;
    let b = &mut a;
    println!("{}", b); // 1
    *b = 2;
    println!("{}", b);
    
    a = 3;
    
    println!("{}", a);
```

是可以被编译通过的。尽管第一个`println`就传入了一个不可变引用，实际上b并没有被传进这个宏（宏内包的作用域，效果和函数是一样的，可以把这个宏当函数看）。

在b被传进println前，b其实隐式地执行了一个“解引再引用”的操作，也就是`&*b`（注意&在前*在后）。这是合法的，这也会导致b本身被借用了，必须得等传进去的`&*b`结束生命周期才会归还。

println本身就把`&*b`吃掉了，所以b在执行完println后又可以访问了，可以再解引并改值。后来的也是这样操作，而编译器会分析b在之后不会再被访问，就在第二个println后结束生命周期，
让a可以访问。

这要是把`a = 3`放到前面几行，除非放在`b`创建之前，`a = 3`都会报改动已借出变量的错的。

### 五脏六腑怎么借？

前面提到，想要修改一个变量的成员，必须让这个变量是可变变量，以此类推，修改成员的成员，也要求最顶层是可变的。

对应到引用的创建，也是同理，拥有一个变量的引用，将其解引，得到的可变性与这个引用相同。可变引用解引才可变，否则不可变。
那么将一个不可变引用解引，创建其成员的引用，也只能创建不可变的，反过来则是自由的。

当然，**内部可变模式**可以打破这个规则，不过这里不考虑。

回到桶实现，这里的问题就是有一个变量，它不断地向内索引，这个其实是合法的，我把后面两句注释掉，就不报错了。

```rust
let mut cur_node = head_node;
while let Some(next_node) = &mut cur_node.next {
    if next_node.key > new_node.key {
        break;
    } else {
        cur_node = next_node;
    }
}
// new_node.next = cur_node.next.take();
// cur_node.next = Some(new_node);
```

Rust的静态分析并不会知道你是要实现一个链表，只会将你实现的链表理解为一个非常深的包含关系。
这个循环就意味着cur_node是不断地向内借用其成员，那么包含这个成员的可变引用，在最深层的借用被归还前，会一直被占用着。

这个while循环可以理解为：不断地可变借用`cur_node.next`，直到终止条件break，如果break能被执行，那么意味着`let Some(next_node) = &mut cur_node.next`
仍为`true`，并且`cur_node`没有执行else分支的语句，所以`&mut cur_node.next`依然还在借出；而另一个情况就是while判定得到`&mut cur_node.next`为None的情况，
循环终止时，这个判定语句还是被执行了一遍，那么`cur_node = next_node`之后还有一次`&mut cur_node.next`。

无论哪种情况，`&mut cur_node.next`总是最后执行，这也是后两句能成立的基石，同样也因为最后总是已经可变借出了`cur_node.next`，
导致不可再可变借出。

但实际上，静态分析总不可能连这都分析到了，静态分析只会分析分支，它会把while循环也当成条件分支去分析，while在静态分析里和if是一样的。
它的问题其实不在这里。

我们可以改另一行看看：
```rust
let mut cur_node = head_node;
while let Some(next_node) = &mut cur_node.next {
    if next_node.key > new_node.key {
        break;
    } else {
        next_node.key = 0.0;
        // cur_node = next_node;
    }
}
new_node.next = cur_node.next.take();
cur_node.next = Some(new_node);
```

这行居然也不会报错，但为什么反而是因为就改了这句，多次可变借用就不报错了呢？
发生这种情况是因为编译器认为前一次可变借用已经归还，为什么编译器会这么认为呢？

我们改成这个等价情形方便理解：

```rust
let mut cur_node = head_node;
if let Some(next_node) = &mut cur_node.next {
    if next_node.key > new_node.key {
        // break;
    } else {
        // next_node.key = 0.0;
        cur_node = next_node;
    }
}
new_node.next = cur_node.next.take();
cur_node.next = Some(new_node);
```

`if let`表达式的作用域是这样的：
```rust
let Some(next_node) = &mut cur_node.next
```
表达式本身就是在`if let`作用域内的，你在这个`if let`大括号之外的地方访问`next_node`，是访问不到的。

如果`cur_node = next_node`没有执行，`next_node`的生命周期会在这个作用域内结束，顺带地这个析取赋值，`Some(next_node)`的生命周期也会结束。

变量的生命周期结束，则意味着`&mut cur_node.next`被编译器认为是最后一次使用了。所以这个借用就归还了。

如果`cur_node = next_node`执行了，就意味着`next_node`被带出了作用域。这和函数的返回值不会被drop掉一样，所有权被带出去了。
那么`next_node`，作为`cur_node.next`的成员，成员的借用没有被归还，而是保存在了`cur_node`中，自然包含这个成员的`&mut cur_node.next`也不会被释放。

所以这导致了两次借用。

## 如何解决？

可以用**内部可变模式**，这需要用到`RefCell`，但这意味着又得加一层，Link会变成
```rust
type Link<T> = Option<Box<RefCell<Node<T>>>>;
```

可怕。。。

而且具体调用需要各种显式调用`borrow_mut()`，烦得要死。

其实这种涉及底层的实现就应该简单粗暴，只要你懂的背后的内存分配原理，最简单的才是最安全的。

人还能被尿憋死？上unsafe！

```rust
// 顺序查询
unsafe {
    let mut cur_node = head_node as *mut Box<Node<T>>;
    while let Some(next_node) = &mut (*cur_node).next {
        if next_node.key > new_node.key {
            break;
        } else {
            cur_node = next_node;
        }
    }
    new_node.next = (*cur_node).next.take();
    (*cur_node).next = Some(new_node);
}
```

可变裸指针不会隐式地解引了，需要你手动解引，所以都改成`(*cur_node)`。

## 迭代！

最终实现是这样的:
```rust
pub struct Bucket<T> {
    head: Link<T>,
}

type Link<T> = Option<Box<Node<T>>>;
struct Node<T> {
    key: f64,
    elem: T,
    next: Link<T>,
}

impl<T> Bucket<T> {
    pub fn new() -> Bucket<T> {
        Bucket { head: None }
    }

    // key升序插入，顺序查询
    pub fn insert(&mut self, key: f64, elem: T) {
        let mut new_node = Box::new(Node { key, elem, next: None });
        match &mut self.head {
            None => {
                // 0
                self.head = Some(new_node);
            }
            Some(head_node) => {
                if head_node.key > new_node.key {
                    //插入开头
                    new_node.next = self.head.take();
                    self.head = Some(new_node);
                } else {
                    // 顺序查询
                    unsafe {
                        let mut cur_node = head_node as *mut Box<Node<T>>;
                        while let Some(next_node) = &mut (*cur_node).next {
                            if next_node.key > new_node.key {
                                break;
                            } else {
                                cur_node = next_node;
                            }
                        }
                        new_node.next = (*cur_node).next.take();
                        (*cur_node).next = Some(new_node);
                    }
                }
            }
        }
    }
}

pub struct BucketIter<T>(Bucket<T>);

impl<T> IntoIterator for Bucket<T> {
    type Item = T;
    type IntoIter = BucketIter<T>;

    fn into_iter(self) -> Self::IntoIter {
        BucketIter(self)
    }
}

// 迭代器 只实现夺取所有权的
impl<T> Iterator for BucketIter<T> {
    type Item = T;
    fn next(&mut self) -> Option<Self::Item> {
        // 弹出
        self.0.head.take().map(|node| {
            self.0.head = node.next;
            node.elem
        })
    }
}


```

直接看后面的迭代器实现，首先要有一个迭代器结构体`BucketIter<T>`，
然后实现一个从`Bucket<T>`到`BucketIter<T>`的`IntoIterator`trait，
还要为`BucketIter<T>`本身实现`Iterator`Trait。

用链表实现的桶，插入排序是顺序查找的，链表本身很难实现二分查找，因为二分查找的界索引值是计算出来的。

同样是将新元素一个个放进桶，每次放进都进行一次排序，这个过程和一种复杂度更低的算法很像，那就是堆。

下一篇我们直接实现一个链二叉堆，再次提速（并不能）！