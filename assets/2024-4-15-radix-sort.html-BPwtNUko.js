import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,e as t}from"./app-vGhL8v2_.js";const p={},e=t(`<p>上一篇我们实现了一个针对10以内数的计数排序，里面有一个回调函数的设计。 这个回调函数将在这里用到。</p><p>基数排序需要用到一个稳定排序，首先确定排序元素的进制，然后按进制从低到高位一遍遍地排序。</p><p>比如现在要升序排一组数：153、356、321、26</p><p>我们先规定这组数都是十进制的数码构成的序列，是小于1000的自然数。 基数排序需要进行这样的循环：</p><p>先排个位数，得：321、153、356、26</p><p>这里356和26的个位数是相同的，因为这是一个稳定排序，所以两者的前后顺序在排序后不变。</p><p>然后再排十位数，得：321、26、153、356</p><p>这次排序保证了十位数次序不变，这次排序是稳定的，这也意味着之前的个位数排序的结果依然稳定。 在十位数相等的前提下，个位数的前后关系仍然保留，也就仍是升序。</p><p>按照数学归纳法可以证明最终所有位数排序后，能得到正确的结果。</p><p>最后排百位数，得：26、153、321、356</p><p>这种算法不但可以排数字，还可以很方便地实现字符串的排序，这里就不展开了。</p><p>初步实现一下，这个实现用到了上一篇的代码，所以需要在Cargo.toml引入一下：</p><div class="language-rust line-numbers-mode" data-ext="rs" data-title="rs"><pre class="language-rust"><code><span class="token keyword">use</span> <span class="token namespace">counting_sort<span class="token punctuation">::</span></span>counting_sort<span class="token punctuation">;</span>

<span class="token keyword">pub</span> <span class="token keyword">fn</span> <span class="token function-definition function">radix_sort</span><span class="token punctuation">(</span>arr<span class="token punctuation">:</span> <span class="token class-name">Vec</span><span class="token operator">&lt;</span><span class="token keyword">usize</span><span class="token operator">&gt;</span><span class="token punctuation">,</span> scale<span class="token punctuation">:</span> <span class="token keyword">usize</span><span class="token punctuation">,</span> max_bit<span class="token punctuation">:</span> <span class="token keyword">u32</span><span class="token punctuation">)</span> <span class="token punctuation">-&gt;</span> <span class="token class-name">Result</span><span class="token operator">&lt;</span><span class="token class-name">Vec</span><span class="token operator">&lt;</span><span class="token keyword">usize</span><span class="token operator">&gt;</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span><span class="token lifetime-annotation symbol">&#39;static</span> <span class="token keyword">str</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token keyword">let</span> <span class="token class-name">Some</span><span class="token punctuation">(</span>max_value<span class="token punctuation">)</span> <span class="token operator">=</span> scale<span class="token punctuation">.</span><span class="token function">checked_pow</span><span class="token punctuation">(</span>max_bit<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token operator">&amp;</span>e <span class="token keyword">in</span> arr<span class="token punctuation">.</span><span class="token function">iter</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> e <span class="token operator">&gt;=</span> max_value <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token class-name">Err</span><span class="token punctuation">(</span><span class="token string">&quot;Element overflow!&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">Err</span><span class="token punctuation">(</span><span class="token string">&quot;Max value overflow!&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">let</span> <span class="token keyword">mut</span> result <span class="token operator">=</span> arr<span class="token punctuation">;</span>

    <span class="token keyword">for</span> bit <span class="token keyword">in</span> <span class="token number">1</span><span class="token punctuation">..=</span>max_bit <span class="token punctuation">{</span>
        result <span class="token operator">=</span> <span class="token function">counting_sort</span><span class="token punctuation">(</span>result<span class="token punctuation">,</span> scale<span class="token punctuation">,</span> <span class="token closure-params"><span class="token closure-punctuation punctuation">|</span><span class="token operator">&amp;</span>e<span class="token closure-punctuation punctuation">|</span></span> <span class="token punctuation">{</span> <span class="token punctuation">(</span>e <span class="token operator">%</span> scale<span class="token punctuation">.</span><span class="token function">pow</span><span class="token punctuation">(</span>bit<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">/</span> scale<span class="token punctuation">.</span><span class="token function">pow</span><span class="token punctuation">(</span>bit <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">?</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token class-name">Ok</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然而却报错了，<code>counting_sort</code>的<code>enumerate</code>的类型要求是一个函数指针，但是却传入了一个<strong>闭包</strong>。 这在之前的调用中没遇到过，这个<strong>匿名函数</strong>调用了bit，使得这个<strong>匿名函数</strong>成了闭包。</p><h2 id="闭包" tabindex="-1"><a class="header-anchor" href="#闭包"><span>闭包</span></a></h2><p>我们需要<code>counting_sort</code>函数的回到能用上闭包，所以需要把<code>counting_sort</code>改成这样：</p><div class="language-rust line-numbers-mode" data-ext="rs" data-title="rs"><pre class="language-rust"><code><span class="token keyword">pub</span> <span class="token keyword">fn</span> <span class="token function-definition function">counting_sort</span><span class="token operator">&lt;</span><span class="token class-name">T</span><span class="token punctuation">,</span> <span class="token class-name">F</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>
    vec<span class="token punctuation">:</span> <span class="token class-name">Vec</span><span class="token operator">&lt;</span><span class="token class-name">T</span><span class="token operator">&gt;</span><span class="token punctuation">,</span>
    max_key<span class="token punctuation">:</span> <span class="token keyword">usize</span><span class="token punctuation">,</span>
    enumerate<span class="token punctuation">:</span> <span class="token class-name">F</span> 
<span class="token punctuation">)</span> <span class="token punctuation">-&gt;</span> <span class="token class-name">Result</span><span class="token operator">&lt;</span><span class="token class-name">Vec</span><span class="token operator">&lt;</span><span class="token class-name">T</span><span class="token operator">&gt;</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span><span class="token lifetime-annotation symbol">&#39;static</span> <span class="token keyword">str</span><span class="token operator">&gt;</span>
    <span class="token keyword">where</span> <span class="token class-name">F</span><span class="token punctuation">:</span> <span class="token class-name">Fn</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token class-name">T</span><span class="token punctuation">)</span> <span class="token punctuation">-&gt;</span> <span class="token keyword">usize</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后测试一下：</p><div class="language-rust line-numbers-mode" data-ext="rs" data-title="rs"><pre class="language-rust"><code><span class="token attribute attr-name">#[cfg(test)]</span>
<span class="token keyword">mod</span> <span class="token module-declaration namespace">tests</span> <span class="token punctuation">{</span>
    <span class="token keyword">use</span> <span class="token keyword">super</span><span class="token punctuation">::</span><span class="token operator">*</span><span class="token punctuation">;</span>

    <span class="token attribute attr-name">#[test]</span>
    <span class="token keyword">fn</span> <span class="token function-definition function">it_sort_ascending</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">-&gt;</span> <span class="token class-name">Result</span><span class="token operator">&lt;</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span><span class="token lifetime-annotation symbol">&#39;static</span> <span class="token keyword">str</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> <span class="token keyword">mut</span> v <span class="token operator">=</span> <span class="token macro property">vec!</span><span class="token punctuation">[</span><span class="token number">22</span><span class="token punctuation">,</span> <span class="token number">43</span><span class="token punctuation">,</span> <span class="token number">145</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        v <span class="token operator">=</span> <span class="token function">radix_sort</span><span class="token punctuation">(</span>v<span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token operator">?</span><span class="token punctuation">;</span>
        <span class="token macro property">assert_eq!</span><span class="token punctuation">(</span>v<span class="token punctuation">,</span> <span class="token macro property">vec!</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">,</span> <span class="token number">22</span><span class="token punctuation">,</span> <span class="token number">43</span><span class="token punctuation">,</span> <span class="token number">145</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Ok</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是可以通过的。</p><p>书上说这种算法能够有O(n)的时间复杂度，是因为传入的位数与进制是与排序的序列规模无关的。 然而位数与进制本身是一个比较大的常数，这个算法的复杂度常数相对是比较大的。</p>`,21),o=[e];function c(l,i){return s(),a("div",null,o)}const k=n(p,[["render",c],["__file","2024-4-15-radix-sort.html.vue"]]),d=JSON.parse('{"path":"/posts/2024-4-15-radix-sort.html","title":"Rust与算法基础（12）：基数排序","lang":"zh-CN","frontmatter":{"title":"Rust与算法基础（12）：基数排序","date":"2024-04-15T00:00:00.000Z","category":"编程","tag":["Rust","算法"],"description":"上一篇我们实现了一个针对10以内数的计数排序，里面有一个回调函数的设计。 这个回调函数将在这里用到。 基数排序需要用到一个稳定排序，首先确定排序元素的进制，然后按进制从低到高位一遍遍地排序。 比如现在要升序排一组数：153、356、321、26 我们先规定这组数都是十进制的数码构成的序列，是小于1000的自然数。 基数排序需要进行这样的循环： 先排个位...","head":[["meta",{"property":"og:url","content":"https://qt911025.github.io/posts/2024-4-15-radix-sort.html"}],["meta",{"property":"og:site_name","content":"QuenTine的博客"}],["meta",{"property":"og:title","content":"Rust与算法基础（12）：基数排序"}],["meta",{"property":"og:description","content":"上一篇我们实现了一个针对10以内数的计数排序，里面有一个回调函数的设计。 这个回调函数将在这里用到。 基数排序需要用到一个稳定排序，首先确定排序元素的进制，然后按进制从低到高位一遍遍地排序。 比如现在要升序排一组数：153、356、321、26 我们先规定这组数都是十进制的数码构成的序列，是小于1000的自然数。 基数排序需要进行这样的循环： 先排个位..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-15T12:24:58.000Z"}],["meta",{"property":"article:author","content":"QuenTine"}],["meta",{"property":"article:tag","content":"Rust"}],["meta",{"property":"article:tag","content":"算法"}],["meta",{"property":"article:published_time","content":"2024-04-15T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-04-15T12:24:58.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Rust与算法基础（12）：基数排序\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-04-15T00:00:00.000Z\\",\\"dateModified\\":\\"2024-04-15T12:24:58.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"QuenTine\\",\\"url\\":\\"https://qt911025.github.io\\"}]}"]]},"headers":[{"level":2,"title":"闭包","slug":"闭包","link":"#闭包","children":[]}],"git":{"createdTime":1713183898000,"updatedTime":1713183898000,"contributors":[{"name":"qt911025","email":"qt911025@qq.com","commits":1}]},"readingTime":{"minutes":2.34,"words":702},"filePathRelative":"posts/2024-4-15-radix-sort.md","localizedDate":"2024年4月15日","excerpt":"<p>上一篇我们实现了一个针对10以内数的计数排序，里面有一个回调函数的设计。\\n这个回调函数将在这里用到。</p>\\n<p>基数排序需要用到一个稳定排序，首先确定排序元素的进制，然后按进制从低到高位一遍遍地排序。</p>\\n<p>比如现在要升序排一组数：153、356、321、26</p>\\n<p>我们先规定这组数都是十进制的数码构成的序列，是小于1000的自然数。\\n基数排序需要进行这样的循环：</p>\\n<p>先排个位数，得：321、153、356、26</p>\\n<p>这里356和26的个位数是相同的，因为这是一个稳定排序，所以两者的前后顺序在排序后不变。</p>\\n<p>然后再排十位数，得：321、26、153、356</p>","autoDesc":true}');export{k as comp,d as data};