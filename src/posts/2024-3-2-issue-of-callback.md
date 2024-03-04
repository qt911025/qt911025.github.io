---
title: Rust与算法基础（4+）：回调函数的问题
date: 2024-03-02
category: 编程
tag:
    - Rust
    - 算法
---

排序在实际应用中不只是对数值本身的排序，还是根据键排序键对应的整个数据项。
如果有这么两个项，它们的键是相同的，我们认为它们应该在排序时维持原来的顺序，
但结果并不是那么理想。

在之前的例子中，我们加入一个这样的测试。

```rust
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

        InsertionSorter(&mut v).sort_by(|prev, next| prev.id < next.id);
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
```

这里有两个id为43的Foo，一个叫"LS"另一个叫"LS2"。
我们希望排序后，LS和LS2的顺序不变。

然而测试结果并不是这样，排序后的LS2排在了LS的前面。
```
...
assertion `left == right` failed
  left: [Foo { id: 1, name: "ZL" }, Foo { id: 9, name: "SQ" }, Foo { id: 22, name: "ZS" }, Foo { id: 43, name: "LS2" }, Foo { id: 43, name: "LS" }, Foo { id: 145, name: "WW" }]
 right: [Foo { id: 1, name: "ZL" }, Foo { id: 9, name: "SQ" }, Foo { id: 22, name: "ZS" }, Foo { id: 43, name: "LS" }, Foo { id: 43, name: "LS2" }, Foo { id: 145, name: "WW" }]
...
```

因为这个测试的回调函数是要prev < next，我们推演一下排序发生了什么。
前面几个的排序是正常的，就直接略过。
排序直到这个局面：
> 1ZL 9SQ 22ZS 43LS 145WW 43LS2
指针已经指向了最后一个元素`43LS2`，把它抽到了临时区域里。

>                         43LS2
> 1ZL 9SQ 22ZS 43LS 145WW *43LS2*

比较145WW和43LS2，145大于等于43，就往后复制了一位，待插入的位置往前移一格

>                   43LS2
> 1ZL 9SQ 22ZS 43LS *145WW* 145WW

再比较43LS和43LS2，43大于等于43，所以43LS也向后移了一格！

>              43LS2
> 1ZL 9SQ 22ZS *43LS* 43LS 145WW

所以我们希望prev < next，实际上回调需要写成prev <= next才能达到想要的效果。

我们把测试用例换成：

```rust

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

        InsertionSorter(&mut v).sort_by(|prev, next| prev.id <= next.id); //这里改了一下
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
```

测试就通过了。