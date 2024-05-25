import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as t,c as p,e,a as n,b as s}from"./app-vGhL8v2_.js";const o={},c=e(`<p>先上实现</p><div class="language-rust line-numbers-mode" data-ext="rs" data-title="rs"><pre class="language-rust"><code><span class="token keyword">pub</span> <span class="token keyword">struct</span> <span class="token type-definition class-name">QuickSorter</span><span class="token operator">&lt;</span><span class="token lifetime-annotation symbol">&#39;a</span><span class="token punctuation">,</span> <span class="token class-name">Seq</span><span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token keyword">pub</span> <span class="token operator">&amp;</span><span class="token lifetime-annotation symbol">&#39;a</span> <span class="token keyword">mut</span> <span class="token class-name">Seq</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">impl</span><span class="token operator">&lt;</span><span class="token lifetime-annotation symbol">&#39;a</span><span class="token punctuation">,</span> <span class="token class-name">Elem</span><span class="token operator">&gt;</span> <span class="token class-name">Sorter</span> <span class="token keyword">for</span> <span class="token class-name">QuickSorter</span><span class="token operator">&lt;</span><span class="token lifetime-annotation symbol">&#39;a</span><span class="token punctuation">,</span> <span class="token class-name">Vec</span><span class="token operator">&lt;</span><span class="token class-name">Elem</span><span class="token operator">&gt;&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">type</span> <span class="token type-definition class-name">Element</span> <span class="token operator">=</span> <span class="token class-name">Elem</span><span class="token punctuation">;</span>

    <span class="token keyword">fn</span> <span class="token function-definition function">sort_by</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token keyword">mut</span> <span class="token keyword">self</span><span class="token punctuation">,</span> compare<span class="token punctuation">:</span> <span class="token keyword">fn</span><span class="token punctuation">(</span>prev<span class="token punctuation">:</span> <span class="token operator">&amp;</span><span class="token keyword">Self</span><span class="token punctuation">::</span><span class="token class-name">Element</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token operator">&amp;</span><span class="token keyword">Self</span><span class="token punctuation">::</span><span class="token class-name">Element</span><span class="token punctuation">)</span> <span class="token punctuation">-&gt;</span> <span class="token keyword">bool</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> vec <span class="token operator">=</span> <span class="token operator">&amp;</span><span class="token keyword">mut</span> <span class="token keyword">self</span><span class="token punctuation">.</span><span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token keyword">if</span> vec<span class="token punctuation">.</span><span class="token function">len</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;</span> <span class="token number">2</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token function">quick_sort</span><span class="token punctuation">(</span>vec<span class="token punctuation">,</span> compare<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> vec<span class="token punctuation">.</span><span class="token function">len</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">fn</span> <span class="token function-definition function">quick_sort</span><span class="token operator">&lt;</span><span class="token class-name">T</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>
    vec<span class="token punctuation">:</span> <span class="token operator">&amp;</span><span class="token keyword">mut</span> <span class="token class-name">Vec</span><span class="token operator">&lt;</span><span class="token class-name">T</span><span class="token operator">&gt;</span><span class="token punctuation">,</span>
    compare<span class="token punctuation">:</span> <span class="token keyword">fn</span><span class="token punctuation">(</span>prev<span class="token punctuation">:</span> <span class="token operator">&amp;</span><span class="token class-name">T</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token operator">&amp;</span><span class="token class-name">T</span><span class="token punctuation">)</span> <span class="token punctuation">-&gt;</span> <span class="token keyword">bool</span><span class="token punctuation">,</span>
    first<span class="token punctuation">:</span> <span class="token keyword">usize</span><span class="token punctuation">,</span>
    end<span class="token punctuation">:</span> <span class="token keyword">usize</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> end <span class="token operator">-</span> first <span class="token operator">&gt;</span> <span class="token number">1</span> <span class="token punctuation">{</span>
        <span class="token comment">// 用相同的末尾开区间原则，避免usize在0的情况下-1（即使是safe代码，这还是会panic）</span>
        <span class="token keyword">let</span> divider <span class="token operator">=</span> <span class="token function">partrition</span><span class="token punctuation">(</span>vec<span class="token punctuation">,</span> compare<span class="token punctuation">,</span> first<span class="token punctuation">,</span> end<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">quick_sort</span><span class="token punctuation">(</span>vec<span class="token punctuation">,</span> compare<span class="token punctuation">,</span> first<span class="token punctuation">,</span> divider<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">quick_sort</span><span class="token punctuation">(</span>vec<span class="token punctuation">,</span> compare<span class="token punctuation">,</span> divider <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> end<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">fn</span> <span class="token function-definition function">partrition</span><span class="token operator">&lt;</span><span class="token class-name">T</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>
    vec<span class="token punctuation">:</span> <span class="token operator">&amp;</span><span class="token keyword">mut</span> <span class="token class-name">Vec</span><span class="token operator">&lt;</span><span class="token class-name">T</span><span class="token operator">&gt;</span><span class="token punctuation">,</span>
    compare<span class="token punctuation">:</span> <span class="token keyword">fn</span><span class="token punctuation">(</span>prev<span class="token punctuation">:</span> <span class="token operator">&amp;</span><span class="token class-name">T</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token operator">&amp;</span><span class="token class-name">T</span><span class="token punctuation">)</span> <span class="token punctuation">-&gt;</span> <span class="token keyword">bool</span><span class="token punctuation">,</span>
    first<span class="token punctuation">:</span> <span class="token keyword">usize</span><span class="token punctuation">,</span>
    end<span class="token punctuation">:</span> <span class="token keyword">usize</span>
<span class="token punctuation">)</span> <span class="token punctuation">-&gt;</span> <span class="token keyword">usize</span> <span class="token punctuation">{</span>
    <span class="token comment">// 随机选一个主元，让划分更平均，但这样强行换位置，就做不到幂等了</span>
    <span class="token comment">// 而且最后一个元素的大小本来就是随机的，所以再随机并没有意义</span>
    <span class="token comment">// let random_pivot = rand::thread_rng().gen_range(first..end);</span>
    <span class="token keyword">let</span> last <span class="token operator">=</span> end <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token comment">// unsafe {</span>
    <span class="token comment">//     ptr::swap_nonoverlapping(&amp;mut vec[random_pivot], &amp;mut vec[last], 1);</span>
    <span class="token comment">// }</span>
    <span class="token keyword">let</span> <span class="token keyword">mut</span> i <span class="token operator">=</span> first<span class="token punctuation">;</span>
    <span class="token keyword">for</span> j <span class="token keyword">in</span> first<span class="token punctuation">..</span>last <span class="token punctuation">{</span>
        <span class="token comment">// 最后一个是待换的</span>
        <span class="token keyword">if</span> <span class="token function">compare</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>vec<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>vec<span class="token punctuation">[</span>last<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">unsafe</span> <span class="token punctuation">{</span>
                <span class="token namespace">ptr<span class="token punctuation">::</span></span><span class="token function">swap_nonoverlapping</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token keyword">mut</span> vec<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span><span class="token keyword">mut</span> vec<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            i <span class="token operator">+=</span> <span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">unsafe</span> <span class="token punctuation">{</span>
        <span class="token namespace">ptr<span class="token punctuation">::</span></span><span class="token function">swap_nonoverlapping</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token keyword">mut</span> vec<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span><span class="token keyword">mut</span> vec<span class="token punctuation">[</span>last<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    i
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),l=n("p",null,[s("快速排序最差情形是"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",{mathvariant:"normal"},"O"),n("mo",{stretchy:"false"},"("),n("msup",null,[n("mi",null,"n"),n("mn",null,"2")]),n("mo",{stretchy:"false"},")")]),n("annotation",{encoding:"application/x-tex"},"\\Omicron(n^2)")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"1.0641em","vertical-align":"-0.25em"}}),n("span",{class:"mord mathrm"},"O"),n("span",{class:"mopen"},"("),n("span",{class:"mord"},[n("span",{class:"mord mathnormal"},"n"),n("span",{class:"msupsub"},[n("span",{class:"vlist-t"},[n("span",{class:"vlist-r"},[n("span",{class:"vlist",style:{height:"0.8141em"}},[n("span",{style:{top:"-3.063em","margin-right":"0.05em"}},[n("span",{class:"pstrut",style:{height:"2.7em"}}),n("span",{class:"sizing reset-size6 size3 mtight"},[n("span",{class:"mord mtight"},"2")])])])])])])]),n("span",{class:"mclose"},")")])])]),s("的，当划分函数划分的子序列长度总是一个为1一个为i-1时， 每次都只切分出一个长度为1的数组，让另一个数组继续遍历。这种情况常常发生在有大量键相同的情况下， 。当每次划分大多都能让划分位（divider）处于中间，算法就越趋于最佳情形。")],-1),i=n("p",null,"还有如果数组本身如果已经接近排序好，算法也会趋于最坏情形，因为选择的作为划分位的数，在子序列的末尾。",-1),u=n("p",null,"课后习题会要求用一个随机函数随机抽取某个位置的数作为划分位，这在一定程度上平衡混乱程度不同的输入序列， 让有序的序列也变得混乱（已在注释中写出）。这种实现的弊端便是无法保证幂等性。",-1),k=n("h2",{id:"比较排序",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#比较排序"},[n("span",null,"比较排序")])],-1),r=n("p",null,[s("前面几个实现的排序算法都基于元素的两两比较，效率取决于能将多少无需比较的元素排除掉。 这些排序算法统称"),n("strong",null,"比较排序"),s("，比较排序在最坏情形下，效率的下界是"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",{mathvariant:"normal"},"Ω"),n("mo",{stretchy:"false"},"("),n("mi",null,"n"),n("mi",null,"lg"),n("mo",null,"⁡"),n("mi",null,"n"),n("mo",{stretchy:"false"},")")]),n("annotation",{encoding:"application/x-tex"},"\\Omega(n\\lg{n})")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),n("span",{class:"mord"},"Ω"),n("span",{class:"mopen"},"("),n("span",{class:"mord mathnormal"},"n"),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mop"},[s("l"),n("span",{style:{"margin-right":"0.01389em"}},"g")]),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord"},[n("span",{class:"mord mathnormal"},"n")]),n("span",{class:"mclose"},")")])])]),s(" （算法导论中考虑问题都是二进制的，规定"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"lg"),n("mo",null,"⁡"),n("mi",null,"n")]),n("annotation",{encoding:"application/x-tex"},"\\lg{n}")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.8889em","vertical-align":"-0.1944em"}}),n("span",{class:"mop"},[s("l"),n("span",{style:{"margin-right":"0.01389em"}},"g")]),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord"},[n("span",{class:"mord mathnormal"},"n")])])])]),s("为"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("msub",null,[n("mrow",null,[n("mi",null,"log"),n("mo",null,"⁡")]),n("mn",null,"2")]),n("mi",null,"n")]),n("annotation",{encoding:"application/x-tex"},"\\log_2{n}")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.9386em","vertical-align":"-0.2441em"}}),n("span",{class:"mop"},[n("span",{class:"mop"},[s("lo"),n("span",{style:{"margin-right":"0.01389em"}},"g")]),n("span",{class:"msupsub"},[n("span",{class:"vlist-t vlist-t2"},[n("span",{class:"vlist-r"},[n("span",{class:"vlist",style:{height:"0.207em"}},[n("span",{style:{top:"-2.4559em","margin-right":"0.05em"}},[n("span",{class:"pstrut",style:{height:"2.7em"}}),n("span",{class:"sizing reset-size6 size3 mtight"},[n("span",{class:"mord mtight"},"2")])])]),n("span",{class:"vlist-s"},"​")]),n("span",{class:"vlist-r"},[n("span",{class:"vlist",style:{height:"0.2441em"}},[n("span")])])])])]),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord"},[n("span",{class:"mord mathnormal"},"n")])])])]),s("）。")],-1),m=n("p",null,"自此，《算法导论》第三版教的比较排序就告一段落了，一些低效的比较排序比如选择排序、冒泡排序都在课后练习里， 这里就不实现了。",-1),d=n("p",null,[s("接下来要学的是非比较排序，都是些线性时间复杂度的排序算法。之前用到的接口形式都是比较排序的，并不适用于接下来的算法。 算法的测试目标也会做一些改变，不方便实现比较函数回调。所以接口也改个名，把"),n("code",null,"Sorter"),s("trait改成"),n("code",null,"CompareSorter"),s("。")],-1),v=[c,l,i,u,k,r,m,d];function y(g,w){return t(),p("div",null,v)}const h=a(o,[["render",y],["__file","2024-4-8-quick-sort.html.vue"]]),_=JSON.parse(`{"path":"/posts/2024-4-8-quick-sort.html","title":"Rust与算法基础（10）：快速排序","lang":"zh-CN","frontmatter":{"title":"Rust与算法基础（10）：快速排序","date":"2024-04-08T00:00:00.000Z","category":"编程","tag":["Rust","算法"],"description":"先上实现 快速排序最差情形是O(n2)的，当划分函数划分的子序列长度总是一个为1一个为i-1时， 每次都只切分出一个长度为1的数组，让另一个数组继续遍历。这种情况常常发生在有大量键相同的情况下， 。当每次划分大多都能让划分位（divider）处于中间，算法就越趋于最佳情形。 还有如果数组本身如果已经接近排序好，算法也会趋于最坏情形，因为选择的作为划分位...","head":[["meta",{"property":"og:url","content":"https://qt911025.github.io/posts/2024-4-8-quick-sort.html"}],["meta",{"property":"og:site_name","content":"QuenTine的博客"}],["meta",{"property":"og:title","content":"Rust与算法基础（10）：快速排序"}],["meta",{"property":"og:description","content":"先上实现 快速排序最差情形是O(n2)的，当划分函数划分的子序列长度总是一个为1一个为i-1时， 每次都只切分出一个长度为1的数组，让另一个数组继续遍历。这种情况常常发生在有大量键相同的情况下， 。当每次划分大多都能让划分位（divider）处于中间，算法就越趋于最佳情形。 还有如果数组本身如果已经接近排序好，算法也会趋于最坏情形，因为选择的作为划分位..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-08T13:26:36.000Z"}],["meta",{"property":"article:author","content":"QuenTine"}],["meta",{"property":"article:tag","content":"Rust"}],["meta",{"property":"article:tag","content":"算法"}],["meta",{"property":"article:published_time","content":"2024-04-08T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-04-08T13:26:36.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Rust与算法基础（10）：快速排序\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-04-08T00:00:00.000Z\\",\\"dateModified\\":\\"2024-04-08T13:26:36.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"QuenTine\\",\\"url\\":\\"https://qt911025.github.io\\"}]}"]]},"headers":[{"level":2,"title":"比较排序","slug":"比较排序","link":"#比较排序","children":[]}],"git":{"createdTime":1712582796000,"updatedTime":1712582796000,"contributors":[{"name":"qt911025","email":"qt911025@qq.com","commits":1}]},"readingTime":{"minutes":2.6,"words":780},"filePathRelative":"posts/2024-4-8-quick-sort.md","localizedDate":"2024年4月8日","excerpt":"<p>先上实现</p>\\n<div class=\\"language-rust\\" data-ext=\\"rs\\" data-title=\\"rs\\"><pre class=\\"language-rust\\"><code><span class=\\"token keyword\\">pub</span> <span class=\\"token keyword\\">struct</span> <span class=\\"token type-definition class-name\\">QuickSorter</span><span class=\\"token operator\\">&lt;</span><span class=\\"token lifetime-annotation symbol\\">'a</span><span class=\\"token punctuation\\">,</span> <span class=\\"token class-name\\">Seq</span><span class=\\"token operator\\">&gt;</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">pub</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token lifetime-annotation symbol\\">'a</span> <span class=\\"token keyword\\">mut</span> <span class=\\"token class-name\\">Seq</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n\\n<span class=\\"token keyword\\">impl</span><span class=\\"token operator\\">&lt;</span><span class=\\"token lifetime-annotation symbol\\">'a</span><span class=\\"token punctuation\\">,</span> <span class=\\"token class-name\\">Elem</span><span class=\\"token operator\\">&gt;</span> <span class=\\"token class-name\\">Sorter</span> <span class=\\"token keyword\\">for</span> <span class=\\"token class-name\\">QuickSorter</span><span class=\\"token operator\\">&lt;</span><span class=\\"token lifetime-annotation symbol\\">'a</span><span class=\\"token punctuation\\">,</span> <span class=\\"token class-name\\">Vec</span><span class=\\"token operator\\">&lt;</span><span class=\\"token class-name\\">Elem</span><span class=\\"token operator\\">&gt;&gt;</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">type</span> <span class=\\"token type-definition class-name\\">Element</span> <span class=\\"token operator\\">=</span> <span class=\\"token class-name\\">Elem</span><span class=\\"token punctuation\\">;</span>\\n\\n    <span class=\\"token keyword\\">fn</span> <span class=\\"token function-definition function\\">sort_by</span><span class=\\"token punctuation\\">(</span><span class=\\"token operator\\">&amp;</span><span class=\\"token keyword\\">mut</span> <span class=\\"token keyword\\">self</span><span class=\\"token punctuation\\">,</span> compare<span class=\\"token punctuation\\">:</span> <span class=\\"token keyword\\">fn</span><span class=\\"token punctuation\\">(</span>prev<span class=\\"token punctuation\\">:</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token keyword\\">Self</span><span class=\\"token punctuation\\">::</span><span class=\\"token class-name\\">Element</span><span class=\\"token punctuation\\">,</span> next<span class=\\"token punctuation\\">:</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token keyword\\">Self</span><span class=\\"token punctuation\\">::</span><span class=\\"token class-name\\">Element</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">-&gt;</span> <span class=\\"token keyword\\">bool</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token keyword\\">let</span> vec <span class=\\"token operator\\">=</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token keyword\\">mut</span> <span class=\\"token keyword\\">self</span><span class=\\"token punctuation\\">.</span><span class=\\"token number\\">0</span><span class=\\"token punctuation\\">;</span>\\n\\n        <span class=\\"token keyword\\">if</span> vec<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">len</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">&lt;</span> <span class=\\"token number\\">2</span> <span class=\\"token punctuation\\">{</span>\\n            <span class=\\"token keyword\\">return</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span>\\n\\n        <span class=\\"token function\\">quick_sort</span><span class=\\"token punctuation\\">(</span>vec<span class=\\"token punctuation\\">,</span> compare<span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">,</span> vec<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">len</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n<span class=\\"token punctuation\\">}</span>\\n\\n<span class=\\"token keyword\\">fn</span> <span class=\\"token function-definition function\\">quick_sort</span><span class=\\"token operator\\">&lt;</span><span class=\\"token class-name\\">T</span><span class=\\"token operator\\">&gt;</span><span class=\\"token punctuation\\">(</span>\\n    vec<span class=\\"token punctuation\\">:</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token keyword\\">mut</span> <span class=\\"token class-name\\">Vec</span><span class=\\"token operator\\">&lt;</span><span class=\\"token class-name\\">T</span><span class=\\"token operator\\">&gt;</span><span class=\\"token punctuation\\">,</span>\\n    compare<span class=\\"token punctuation\\">:</span> <span class=\\"token keyword\\">fn</span><span class=\\"token punctuation\\">(</span>prev<span class=\\"token punctuation\\">:</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token class-name\\">T</span><span class=\\"token punctuation\\">,</span> next<span class=\\"token punctuation\\">:</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token class-name\\">T</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">-&gt;</span> <span class=\\"token keyword\\">bool</span><span class=\\"token punctuation\\">,</span>\\n    first<span class=\\"token punctuation\\">:</span> <span class=\\"token keyword\\">usize</span><span class=\\"token punctuation\\">,</span>\\n    end<span class=\\"token punctuation\\">:</span> <span class=\\"token keyword\\">usize</span>\\n<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">if</span> end <span class=\\"token operator\\">-</span> first <span class=\\"token operator\\">&gt;</span> <span class=\\"token number\\">1</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token comment\\">// 用相同的末尾开区间原则，避免usize在0的情况下-1（即使是safe代码，这还是会panic）</span>\\n        <span class=\\"token keyword\\">let</span> divider <span class=\\"token operator\\">=</span> <span class=\\"token function\\">partrition</span><span class=\\"token punctuation\\">(</span>vec<span class=\\"token punctuation\\">,</span> compare<span class=\\"token punctuation\\">,</span> first<span class=\\"token punctuation\\">,</span> end<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token function\\">quick_sort</span><span class=\\"token punctuation\\">(</span>vec<span class=\\"token punctuation\\">,</span> compare<span class=\\"token punctuation\\">,</span> first<span class=\\"token punctuation\\">,</span> divider<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token function\\">quick_sort</span><span class=\\"token punctuation\\">(</span>vec<span class=\\"token punctuation\\">,</span> compare<span class=\\"token punctuation\\">,</span> divider <span class=\\"token operator\\">+</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">,</span> end<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n<span class=\\"token punctuation\\">}</span>\\n\\n<span class=\\"token keyword\\">fn</span> <span class=\\"token function-definition function\\">partrition</span><span class=\\"token operator\\">&lt;</span><span class=\\"token class-name\\">T</span><span class=\\"token operator\\">&gt;</span><span class=\\"token punctuation\\">(</span>\\n    vec<span class=\\"token punctuation\\">:</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token keyword\\">mut</span> <span class=\\"token class-name\\">Vec</span><span class=\\"token operator\\">&lt;</span><span class=\\"token class-name\\">T</span><span class=\\"token operator\\">&gt;</span><span class=\\"token punctuation\\">,</span>\\n    compare<span class=\\"token punctuation\\">:</span> <span class=\\"token keyword\\">fn</span><span class=\\"token punctuation\\">(</span>prev<span class=\\"token punctuation\\">:</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token class-name\\">T</span><span class=\\"token punctuation\\">,</span> next<span class=\\"token punctuation\\">:</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token class-name\\">T</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">-&gt;</span> <span class=\\"token keyword\\">bool</span><span class=\\"token punctuation\\">,</span>\\n    first<span class=\\"token punctuation\\">:</span> <span class=\\"token keyword\\">usize</span><span class=\\"token punctuation\\">,</span>\\n    end<span class=\\"token punctuation\\">:</span> <span class=\\"token keyword\\">usize</span>\\n<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">-&gt;</span> <span class=\\"token keyword\\">usize</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token comment\\">// 随机选一个主元，让划分更平均，但这样强行换位置，就做不到幂等了</span>\\n    <span class=\\"token comment\\">// 而且最后一个元素的大小本来就是随机的，所以再随机并没有意义</span>\\n    <span class=\\"token comment\\">// let random_pivot = rand::thread_rng().gen_range(first..end);</span>\\n    <span class=\\"token keyword\\">let</span> last <span class=\\"token operator\\">=</span> end <span class=\\"token operator\\">-</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token comment\\">// unsafe {</span>\\n    <span class=\\"token comment\\">//     ptr::swap_nonoverlapping(&amp;mut vec[random_pivot], &amp;mut vec[last], 1);</span>\\n    <span class=\\"token comment\\">// }</span>\\n    <span class=\\"token keyword\\">let</span> <span class=\\"token keyword\\">mut</span> i <span class=\\"token operator\\">=</span> first<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token keyword\\">for</span> j <span class=\\"token keyword\\">in</span> first<span class=\\"token punctuation\\">..</span>last <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token comment\\">// 最后一个是待换的</span>\\n        <span class=\\"token keyword\\">if</span> <span class=\\"token function\\">compare</span><span class=\\"token punctuation\\">(</span><span class=\\"token operator\\">&amp;</span>vec<span class=\\"token punctuation\\">[</span>j<span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">,</span> <span class=\\"token operator\\">&amp;</span>vec<span class=\\"token punctuation\\">[</span>last<span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n            <span class=\\"token keyword\\">unsafe</span> <span class=\\"token punctuation\\">{</span>\\n                <span class=\\"token namespace\\">ptr<span class=\\"token punctuation\\">::</span></span><span class=\\"token function\\">swap_nonoverlapping</span><span class=\\"token punctuation\\">(</span><span class=\\"token operator\\">&amp;</span><span class=\\"token keyword\\">mut</span> vec<span class=\\"token punctuation\\">[</span>i<span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">,</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token keyword\\">mut</span> vec<span class=\\"token punctuation\\">[</span>j<span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n            <span class=\\"token punctuation\\">}</span>\\n            i <span class=\\"token operator\\">+=</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    <span class=\\"token keyword\\">unsafe</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token namespace\\">ptr<span class=\\"token punctuation\\">::</span></span><span class=\\"token function\\">swap_nonoverlapping</span><span class=\\"token punctuation\\">(</span><span class=\\"token operator\\">&amp;</span><span class=\\"token keyword\\">mut</span> vec<span class=\\"token punctuation\\">[</span>i<span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">,</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token keyword\\">mut</span> vec<span class=\\"token punctuation\\">[</span>last<span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    i\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre></div>","autoDesc":true}`);export{h as comp,_ as data};