import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,e as t}from"./app-Bu0aElw-.js";const p={},e=t(`<p>排序在实际应用中不只是对数值本身的排序，还是根据键排序键对应的整个数据项。 如果有这么两个项，它们的键是相同的，我们认为它们应该在排序时维持原来的顺序， 但结果并不是那么理想。</p><p>在之前的例子中，我们加入一个这样的测试。</p><div class="language-rust line-numbers-mode" data-ext="rs" data-title="rs"><pre class="language-rust"><code>    <span class="token attribute attr-name">#[test]</span>
    <span class="token keyword">fn</span> <span class="token function-definition function">it_struct_sort_ascending_equal</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token attribute attr-name">#[derive(Debug, PartialEq)]</span>
        <span class="token keyword">struct</span> <span class="token type-definition class-name">Foo</span> <span class="token punctuation">{</span>
            id<span class="token punctuation">:</span> <span class="token keyword">u32</span><span class="token punctuation">,</span>
            name<span class="token punctuation">:</span> <span class="token operator">&amp;</span><span class="token lifetime-annotation symbol">&#39;static</span> <span class="token keyword">str</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">let</span> <span class="token keyword">mut</span> v <span class="token operator">=</span> <span class="token macro property">vec!</span><span class="token punctuation">[</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">22</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;ZS&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">43</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;LS&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">145</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;WW&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;ZL&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">9</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;SQ&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">43</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;LS2&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">]</span><span class="token punctuation">;</span>

        <span class="token class-name">InsertionSorter</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token keyword">mut</span> v<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">sort_by</span><span class="token punctuation">(</span><span class="token closure-params"><span class="token closure-punctuation punctuation">|</span>prev<span class="token punctuation">,</span> next<span class="token closure-punctuation punctuation">|</span></span> prev<span class="token punctuation">.</span>id <span class="token operator">&lt;</span> next<span class="token punctuation">.</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token macro property">assert_eq!</span><span class="token punctuation">(</span>
            v<span class="token punctuation">,</span>
            <span class="token macro property">vec!</span><span class="token punctuation">[</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;ZL&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">9</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;SQ&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">22</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;ZS&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">43</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;LS&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">43</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;LS2&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">145</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;WW&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">]</span>
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里有两个id为43的Foo，一个叫&quot;LS&quot;另一个叫&quot;LS2&quot;。 我们希望排序后，LS和LS2的顺序不变。</p><p>然而测试结果并不是这样，排序后的LS2排在了LS的前面。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>...
assertion \`left == right\` failed
  left: [Foo { id: 1, name: &quot;ZL&quot; }, Foo { id: 9, name: &quot;SQ&quot; }, Foo { id: 22, name: &quot;ZS&quot; }, Foo { id: 43, name: &quot;LS2&quot; }, Foo { id: 43, name: &quot;LS&quot; }, Foo { id: 145, name: &quot;WW&quot; }]
 right: [Foo { id: 1, name: &quot;ZL&quot; }, Foo { id: 9, name: &quot;SQ&quot; }, Foo { id: 22, name: &quot;ZS&quot; }, Foo { id: 43, name: &quot;LS&quot; }, Foo { id: 43, name: &quot;LS2&quot; }, Foo { id: 145, name: &quot;WW&quot; }]
...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为这个测试的回调函数是要prev &lt; next，我们推演一下排序发生了什么。 前面几个的排序是正常的，就直接略过。 排序直到这个局面：</p><blockquote><p>1ZL 9SQ 22ZS 43LS 145WW 43LS2 指针已经指向了最后一个元素<code>43LS2</code>，把它抽到了临时区域里。</p></blockquote><blockquote><pre><code>                    43LS2
</code></pre><p>1ZL 9SQ 22ZS 43LS 145WW <em>43LS2</em></p></blockquote><p>比较145WW和43LS2，145大于等于43，就往后复制了一位，待插入的位置往前移一格</p><blockquote><pre><code>              43LS2
</code></pre><p>1ZL 9SQ 22ZS 43LS <em>145WW</em> 145WW</p></blockquote><p>再比较43LS和43LS2，43大于等于43，所以43LS也向后移了一格！</p><blockquote><pre><code>         43LS2
</code></pre><p>1ZL 9SQ 22ZS <em>43LS</em> 43LS 145WW</p></blockquote><p>所以我们希望prev &lt; next，实际上回调需要写成prev &lt;= next才能达到想要的效果。</p><p>我们把测试用例换成：</p><div class="language-rust line-numbers-mode" data-ext="rs" data-title="rs"><pre class="language-rust"><code>
    <span class="token attribute attr-name">#[test]</span>
    <span class="token keyword">fn</span> <span class="token function-definition function">it_struct_sort_ascending_equal</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token attribute attr-name">#[derive(Debug, PartialEq)]</span>
        <span class="token keyword">struct</span> <span class="token type-definition class-name">Foo</span> <span class="token punctuation">{</span>
            id<span class="token punctuation">:</span> <span class="token keyword">u32</span><span class="token punctuation">,</span>
            name<span class="token punctuation">:</span> <span class="token operator">&amp;</span><span class="token lifetime-annotation symbol">&#39;static</span> <span class="token keyword">str</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">let</span> <span class="token keyword">mut</span> v <span class="token operator">=</span> <span class="token macro property">vec!</span><span class="token punctuation">[</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">22</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;ZS&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">43</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;LS&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">145</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;WW&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;ZL&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">9</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;SQ&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                id<span class="token punctuation">:</span> <span class="token number">43</span><span class="token punctuation">,</span>
                name<span class="token punctuation">:</span> <span class="token string">&quot;LS2&quot;</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">]</span><span class="token punctuation">;</span>

        <span class="token class-name">InsertionSorter</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token keyword">mut</span> v<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">sort_by</span><span class="token punctuation">(</span><span class="token closure-params"><span class="token closure-punctuation punctuation">|</span>prev<span class="token punctuation">,</span> next<span class="token closure-punctuation punctuation">|</span></span> prev<span class="token punctuation">.</span>id <span class="token operator">&lt;=</span> next<span class="token punctuation">.</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//这里改了一下</span>
        <span class="token macro property">assert_eq!</span><span class="token punctuation">(</span>
            v<span class="token punctuation">,</span>
            <span class="token macro property">vec!</span><span class="token punctuation">[</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;ZL&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">9</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;SQ&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">22</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;ZS&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">43</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;LS&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">43</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;LS2&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token class-name">Foo</span> <span class="token punctuation">{</span>
                    id<span class="token punctuation">:</span> <span class="token number">145</span><span class="token punctuation">,</span>
                    name<span class="token punctuation">:</span> <span class="token string">&quot;WW&quot;</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">]</span>
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试就通过了。</p>`,17),o=[e];function c(u,i){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","2024-3-2-issue-of-callback.html.vue"]]),d=JSON.parse(`{"path":"/posts/2024-3-2-issue-of-callback.html","title":"Rust与算法基础（4+）：回调函数的问题","lang":"zh-CN","frontmatter":{"title":"Rust与算法基础（4+）：回调函数的问题","date":"2024-03-02T00:00:00.000Z","category":"编程","tag":["Rust","算法"],"description":"排序在实际应用中不只是对数值本身的排序，还是根据键排序键对应的整个数据项。 如果有这么两个项，它们的键是相同的，我们认为它们应该在排序时维持原来的顺序， 但结果并不是那么理想。 在之前的例子中，我们加入一个这样的测试。 这里有两个id为43的Foo，一个叫\\"LS\\"另一个叫\\"LS2\\"。 我们希望排序后，LS和LS2的顺序不变。 然而测试结果并不是这样，排...","head":[["meta",{"property":"og:url","content":"https://qt911025.github.io/posts/2024-3-2-issue-of-callback.html"}],["meta",{"property":"og:site_name","content":"QuenTine的博客"}],["meta",{"property":"og:title","content":"Rust与算法基础（4+）：回调函数的问题"}],["meta",{"property":"og:description","content":"排序在实际应用中不只是对数值本身的排序，还是根据键排序键对应的整个数据项。 如果有这么两个项，它们的键是相同的，我们认为它们应该在排序时维持原来的顺序， 但结果并不是那么理想。 在之前的例子中，我们加入一个这样的测试。 这里有两个id为43的Foo，一个叫\\"LS\\"另一个叫\\"LS2\\"。 我们希望排序后，LS和LS2的顺序不变。 然而测试结果并不是这样，排..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-04T14:14:56.000Z"}],["meta",{"property":"article:author","content":"QuenTine"}],["meta",{"property":"article:tag","content":"Rust"}],["meta",{"property":"article:tag","content":"算法"}],["meta",{"property":"article:published_time","content":"2024-03-02T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-04T14:14:56.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Rust与算法基础（4+）：回调函数的问题\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-03-02T00:00:00.000Z\\",\\"dateModified\\":\\"2024-03-04T14:14:56.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"QuenTine\\",\\"url\\":\\"https://qt911025.github.io\\"}]}"]]},"headers":[],"git":{"createdTime":1709561696000,"updatedTime":1709561696000,"contributors":[{"name":"qt911025","email":"qt911025@qq.com","commits":1}]},"readingTime":{"minutes":2.11,"words":632},"filePathRelative":"posts/2024-3-2-issue-of-callback.md","localizedDate":"2024年3月2日","excerpt":"<p>排序在实际应用中不只是对数值本身的排序，还是根据键排序键对应的整个数据项。\\n如果有这么两个项，它们的键是相同的，我们认为它们应该在排序时维持原来的顺序，\\n但结果并不是那么理想。</p>\\n<p>在之前的例子中，我们加入一个这样的测试。</p>\\n<div class=\\"language-rust\\" data-ext=\\"rs\\" data-title=\\"rs\\"><pre class=\\"language-rust\\"><code>    <span class=\\"token attribute attr-name\\">#[test]</span>\\n    <span class=\\"token keyword\\">fn</span> <span class=\\"token function-definition function\\">it_struct_sort_ascending_equal</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token attribute attr-name\\">#[derive(Debug, PartialEq)]</span>\\n        <span class=\\"token keyword\\">struct</span> <span class=\\"token type-definition class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n            id<span class=\\"token punctuation\\">:</span> <span class=\\"token keyword\\">u32</span><span class=\\"token punctuation\\">,</span>\\n            name<span class=\\"token punctuation\\">:</span> <span class=\\"token operator\\">&amp;</span><span class=\\"token lifetime-annotation symbol\\">'static</span> <span class=\\"token keyword\\">str</span><span class=\\"token punctuation\\">,</span>\\n        <span class=\\"token punctuation\\">}</span>\\n\\n        <span class=\\"token keyword\\">let</span> <span class=\\"token keyword\\">mut</span> v <span class=\\"token operator\\">=</span> <span class=\\"token macro property\\">vec!</span><span class=\\"token punctuation\\">[</span>\\n            <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">22</span><span class=\\"token punctuation\\">,</span>\\n                name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"ZS\\"</span><span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">43</span><span class=\\"token punctuation\\">,</span>\\n                name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"LS\\"</span><span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">145</span><span class=\\"token punctuation\\">,</span>\\n                name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"WW\\"</span><span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">,</span>\\n                name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"ZL\\"</span><span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">9</span><span class=\\"token punctuation\\">,</span>\\n                name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"SQ\\"</span><span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">43</span><span class=\\"token punctuation\\">,</span>\\n                name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"LS2\\"</span><span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token punctuation\\">}</span>\\n        <span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">;</span>\\n\\n        <span class=\\"token class-name\\">InsertionSorter</span><span class=\\"token punctuation\\">(</span><span class=\\"token operator\\">&amp;</span><span class=\\"token keyword\\">mut</span> v<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">sort_by</span><span class=\\"token punctuation\\">(</span><span class=\\"token closure-params\\"><span class=\\"token closure-punctuation punctuation\\">|</span>prev<span class=\\"token punctuation\\">,</span> next<span class=\\"token closure-punctuation punctuation\\">|</span></span> prev<span class=\\"token punctuation\\">.</span>id <span class=\\"token operator\\">&lt;</span> next<span class=\\"token punctuation\\">.</span>id<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token macro property\\">assert_eq!</span><span class=\\"token punctuation\\">(</span>\\n            v<span class=\\"token punctuation\\">,</span>\\n            <span class=\\"token macro property\\">vec!</span><span class=\\"token punctuation\\">[</span>\\n                <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                    id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">,</span>\\n                    name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"ZL\\"</span><span class=\\"token punctuation\\">,</span>\\n                <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n                <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                    id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">9</span><span class=\\"token punctuation\\">,</span>\\n                    name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"SQ\\"</span><span class=\\"token punctuation\\">,</span>\\n                <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n                <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                    id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">22</span><span class=\\"token punctuation\\">,</span>\\n                    name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"ZS\\"</span><span class=\\"token punctuation\\">,</span>\\n                <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n                <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                    id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">43</span><span class=\\"token punctuation\\">,</span>\\n                    name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"LS\\"</span><span class=\\"token punctuation\\">,</span>\\n                <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n                <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                    id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">43</span><span class=\\"token punctuation\\">,</span>\\n                    name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"LS2\\"</span><span class=\\"token punctuation\\">,</span>\\n                <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n                <span class=\\"token class-name\\">Foo</span> <span class=\\"token punctuation\\">{</span>\\n                    id<span class=\\"token punctuation\\">:</span> <span class=\\"token number\\">145</span><span class=\\"token punctuation\\">,</span>\\n                    name<span class=\\"token punctuation\\">:</span> <span class=\\"token string\\">\\"WW\\"</span><span class=\\"token punctuation\\">,</span>\\n                <span class=\\"token punctuation\\">}</span>\\n            <span class=\\"token punctuation\\">]</span>\\n        <span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n</code></pre></div>","autoDesc":true}`);export{r as comp,d as data};
