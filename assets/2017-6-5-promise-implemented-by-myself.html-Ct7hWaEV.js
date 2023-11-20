const n=JSON.parse(`{"key":"v-fa08896a","path":"/posts/2017-6-5-promise-implemented-by-myself.html","title":"一个自己实现的Promise","lang":"zh-CN","frontmatter":{"title":"一个自己实现的Promise","date":"2017-06-05T00:00:00.000Z","category":"编程","tag":"Javascript","description":"自己照着 Promise A+ 标准，以及 es6 的标准 Promise 实现的。没做任何优化（比如说那些钩子应该用链表来聚合的），没有 defer 。完全 es5 和 commonjs （不对应 es6 模块机制）。 留作备份。 'use strict'; function MyPromise(handler){ var _this = this; this.state = 'pending'; this.resolveHooks = []; this.rejectHooks = []; var resolve = genHandler(_this.resolveHooks, 'fulfilled'); var reject = genHandler(_this.rejectHooks, 'rejected'); try { handler(resolve, reject); } catch(e) { if(_this.state === 'pending') { reject(e); } } function genHandler(hooks, state) { return function (value){ setTimeout(function (){ if(_this.state === 'pending'){ _this.state = state; _this.result = value; for(var i in hooks) { hooks[i](value); } }else{ throw new Error('This promise is already '+_this.state+'!'); } }, 0); } } } MyPromise.prototype.then = function (onFulfilled, onRejected){ if(arguments.length === 0) return this; var _this = this; return new MyPromise(function (resolve, reject) { switch(_this.state) { case 'pending': _this.resolveHooks.push(genHandler(onFulfilled)); _this.rejectHooks.push(genHandler(onRejected)); break; case 'fulfilled': setTimeout(function () { genHandler(onFulfilled)(_this.result); }, 0); break; case 'rejected': setTimeout(function () { genHandler(onRejected)(_this.result); }, 0); break; default: throw new Error('Invalid promise state!'); } function genHandler(thenHook) { return function (value) { try { var result = typeof thenHook === 'function' ? thenHook(value) : value; if(result &amp;&amp; result.then) { result.then(resolve, reject); } else { resolve(result); } } catch (e) { reject(e); } } }; }); }; MyPromise.prototype.catch = function (onRejected){ return this.then(undefined, onRejected); }; MyPromise.resolve = function (result) { return new Promise(function (resolve, reject) { resolve(result); }); }; MyPromise.reject = function (reason) { return new Promise(function (resolve, reject) { reject(reason); }); }; module.exports = exports = MyPromise;","head":[["meta",{"property":"og:url","content":"https://qt911025.github.io/posts/2017-6-5-promise-implemented-by-myself.html"}],["meta",{"property":"og:site_name","content":"QuenTine的博客"}],["meta",{"property":"og:title","content":"一个自己实现的Promise"}],["meta",{"property":"og:description","content":"自己照着 Promise A+ 标准，以及 es6 的标准 Promise 实现的。没做任何优化（比如说那些钩子应该用链表来聚合的），没有 defer 。完全 es5 和 commonjs （不对应 es6 模块机制）。 留作备份。 'use strict'; function MyPromise(handler){ var _this = this; this.state = 'pending'; this.resolveHooks = []; this.rejectHooks = []; var resolve = genHandler(_this.resolveHooks, 'fulfilled'); var reject = genHandler(_this.rejectHooks, 'rejected'); try { handler(resolve, reject); } catch(e) { if(_this.state === 'pending') { reject(e); } } function genHandler(hooks, state) { return function (value){ setTimeout(function (){ if(_this.state === 'pending'){ _this.state = state; _this.result = value; for(var i in hooks) { hooks[i](value); } }else{ throw new Error('This promise is already '+_this.state+'!'); } }, 0); } } } MyPromise.prototype.then = function (onFulfilled, onRejected){ if(arguments.length === 0) return this; var _this = this; return new MyPromise(function (resolve, reject) { switch(_this.state) { case 'pending': _this.resolveHooks.push(genHandler(onFulfilled)); _this.rejectHooks.push(genHandler(onRejected)); break; case 'fulfilled': setTimeout(function () { genHandler(onFulfilled)(_this.result); }, 0); break; case 'rejected': setTimeout(function () { genHandler(onRejected)(_this.result); }, 0); break; default: throw new Error('Invalid promise state!'); } function genHandler(thenHook) { return function (value) { try { var result = typeof thenHook === 'function' ? thenHook(value) : value; if(result &amp;&amp; result.then) { result.then(resolve, reject); } else { resolve(result); } } catch (e) { reject(e); } } }; }); }; MyPromise.prototype.catch = function (onRejected){ return this.then(undefined, onRejected); }; MyPromise.resolve = function (result) { return new Promise(function (resolve, reject) { resolve(result); }); }; MyPromise.reject = function (reason) { return new Promise(function (resolve, reject) { reject(reason); }); }; module.exports = exports = MyPromise;"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-20T13:02:07.000Z"}],["meta",{"property":"article:author","content":"QuenTine"}],["meta",{"property":"article:tag","content":"Javascript"}],["meta",{"property":"article:published_time","content":"2017-06-05T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-20T13:02:07.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"一个自己实现的Promise\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2017-06-05T00:00:00.000Z\\",\\"dateModified\\":\\"2023-11-20T13:02:07.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"QuenTine\\",\\"url\\":\\"https://qt911025.github.io\\"}]}"]]},"headers":[],"git":{"createdTime":1700399653000,"updatedTime":1700485327000,"contributors":[{"name":"qt911025","email":"qt911025@qq.com","commits":2}]},"readingTime":{"minutes":0.87,"words":262},"filePathRelative":"posts/2017-6-5-promise-implemented-by-myself.md","localizedDate":"2017年6月5日","excerpt":"<p>自己照着 <a href=\\"https://promisesaplus.com/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Promise A+</a>  标准，以及 es6 的标准 Promise 实现的。没做任何优化（比如说那些钩子应该用链表来聚合的），没有 defer 。完全 es5 和 commonjs （不对应 es6 模块机制）。</p>\\n<p>留作备份。</p>\\n<div class=\\"language-javascript line-numbers-mode\\" data-ext=\\"js\\"><pre class=\\"language-javascript\\"><code><span class=\\"token string\\">'use strict'</span><span class=\\"token punctuation\\">;</span>\\n\\n<span class=\\"token keyword\\">function</span> <span class=\\"token function\\">MyPromise</span><span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">handler</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token keyword\\">var</span> _this <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">this</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token keyword\\">this</span><span class=\\"token punctuation\\">.</span>state <span class=\\"token operator\\">=</span> <span class=\\"token string\\">'pending'</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token keyword\\">this</span><span class=\\"token punctuation\\">.</span>resolveHooks <span class=\\"token operator\\">=</span> <span class=\\"token punctuation\\">[</span><span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token keyword\\">this</span><span class=\\"token punctuation\\">.</span>rejectHooks <span class=\\"token operator\\">=</span> <span class=\\"token punctuation\\">[</span><span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">;</span>\\n  \\n  <span class=\\"token keyword\\">var</span> resolve <span class=\\"token operator\\">=</span> <span class=\\"token function\\">genHandler</span><span class=\\"token punctuation\\">(</span>_this<span class=\\"token punctuation\\">.</span>resolveHooks<span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'fulfilled'</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token keyword\\">var</span> reject <span class=\\"token operator\\">=</span> <span class=\\"token function\\">genHandler</span><span class=\\"token punctuation\\">(</span>_this<span class=\\"token punctuation\\">.</span>rejectHooks<span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'rejected'</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n  \\n  <span class=\\"token keyword\\">try</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token function\\">handler</span><span class=\\"token punctuation\\">(</span>resolve<span class=\\"token punctuation\\">,</span> reject<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token punctuation\\">}</span> <span class=\\"token keyword\\">catch</span><span class=\\"token punctuation\\">(</span>e<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">if</span><span class=\\"token punctuation\\">(</span>_this<span class=\\"token punctuation\\">.</span>state <span class=\\"token operator\\">===</span> <span class=\\"token string\\">'pending'</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n      <span class=\\"token function\\">reject</span><span class=\\"token punctuation\\">(</span>e<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n  <span class=\\"token punctuation\\">}</span>\\n  \\n  <span class=\\"token keyword\\">function</span> <span class=\\"token function\\">genHandler</span><span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">hooks<span class=\\"token punctuation\\">,</span> state</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">return</span> <span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">value</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">{</span>\\n      <span class=\\"token function\\">setTimeout</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token keyword\\">if</span><span class=\\"token punctuation\\">(</span>_this<span class=\\"token punctuation\\">.</span>state <span class=\\"token operator\\">===</span> <span class=\\"token string\\">'pending'</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">{</span>\\n          _this<span class=\\"token punctuation\\">.</span>state <span class=\\"token operator\\">=</span> state<span class=\\"token punctuation\\">;</span>\\n          _this<span class=\\"token punctuation\\">.</span>result <span class=\\"token operator\\">=</span> value<span class=\\"token punctuation\\">;</span>\\n          <span class=\\"token keyword\\">for</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">var</span> i <span class=\\"token keyword\\">in</span> hooks<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n            hooks<span class=\\"token punctuation\\">[</span>i<span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">(</span>value<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n          <span class=\\"token punctuation\\">}</span>\\n        <span class=\\"token punctuation\\">}</span><span class=\\"token keyword\\">else</span><span class=\\"token punctuation\\">{</span>\\n          <span class=\\"token keyword\\">throw</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">Error</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'This promise is already '</span><span class=\\"token operator\\">+</span>_this<span class=\\"token punctuation\\">.</span>state<span class=\\"token operator\\">+</span><span class=\\"token string\\">'!'</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span>\\n      <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n  <span class=\\"token punctuation\\">}</span>\\n  \\n<span class=\\"token punctuation\\">}</span>\\n\\n<span class=\\"token class-name\\">MyPromise</span><span class=\\"token punctuation\\">.</span>prototype<span class=\\"token punctuation\\">.</span><span class=\\"token function-variable function\\">then</span> <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">onFulfilled<span class=\\"token punctuation\\">,</span> onRejected</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token keyword\\">if</span><span class=\\"token punctuation\\">(</span>arguments<span class=\\"token punctuation\\">.</span>length <span class=\\"token operator\\">===</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">return</span> <span class=\\"token keyword\\">this</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token keyword\\">var</span> _this <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">this</span><span class=\\"token punctuation\\">;</span>\\n\\n  <span class=\\"token keyword\\">return</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">MyPromise</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">resolve<span class=\\"token punctuation\\">,</span> reject</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">switch</span><span class=\\"token punctuation\\">(</span>_this<span class=\\"token punctuation\\">.</span>state<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n      <span class=\\"token keyword\\">case</span> <span class=\\"token string\\">'pending'</span><span class=\\"token operator\\">:</span>\\n        _this<span class=\\"token punctuation\\">.</span>resolveHooks<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">push</span><span class=\\"token punctuation\\">(</span><span class=\\"token function\\">genHandler</span><span class=\\"token punctuation\\">(</span>onFulfilled<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        _this<span class=\\"token punctuation\\">.</span>rejectHooks<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">push</span><span class=\\"token punctuation\\">(</span><span class=\\"token function\\">genHandler</span><span class=\\"token punctuation\\">(</span>onRejected<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">break</span><span class=\\"token punctuation\\">;</span>\\n      <span class=\\"token keyword\\">case</span> <span class=\\"token string\\">'fulfilled'</span><span class=\\"token operator\\">:</span>\\n        <span class=\\"token function\\">setTimeout</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n          <span class=\\"token function\\">genHandler</span><span class=\\"token punctuation\\">(</span>onFulfilled<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">(</span>_this<span class=\\"token punctuation\\">.</span>result<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">break</span><span class=\\"token punctuation\\">;</span>\\n      <span class=\\"token keyword\\">case</span> <span class=\\"token string\\">'rejected'</span><span class=\\"token operator\\">:</span>\\n        <span class=\\"token function\\">setTimeout</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n          <span class=\\"token function\\">genHandler</span><span class=\\"token punctuation\\">(</span>onRejected<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">(</span>_this<span class=\\"token punctuation\\">.</span>result<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">break</span><span class=\\"token punctuation\\">;</span>\\n      <span class=\\"token keyword\\">default</span><span class=\\"token operator\\">:</span>\\n        <span class=\\"token keyword\\">throw</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">Error</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'Invalid promise state!'</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    \\n    <span class=\\"token keyword\\">function</span> <span class=\\"token function\\">genHandler</span><span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">thenHook</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n      <span class=\\"token keyword\\">return</span> <span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">value</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token keyword\\">try</span> <span class=\\"token punctuation\\">{</span>\\n          <span class=\\"token keyword\\">var</span> result <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">typeof</span> thenHook <span class=\\"token operator\\">===</span> <span class=\\"token string\\">'function'</span> <span class=\\"token operator\\">?</span> <span class=\\"token function\\">thenHook</span><span class=\\"token punctuation\\">(</span>value<span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">:</span> value<span class=\\"token punctuation\\">;</span>\\n          <span class=\\"token keyword\\">if</span><span class=\\"token punctuation\\">(</span>result <span class=\\"token operator\\">&amp;&amp;</span> result<span class=\\"token punctuation\\">.</span>then<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n            result<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">then</span><span class=\\"token punctuation\\">(</span>resolve<span class=\\"token punctuation\\">,</span> reject<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n          <span class=\\"token punctuation\\">}</span> <span class=\\"token keyword\\">else</span> <span class=\\"token punctuation\\">{</span>\\n            <span class=\\"token function\\">resolve</span><span class=\\"token punctuation\\">(</span>result<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n          <span class=\\"token punctuation\\">}</span>\\n        <span class=\\"token punctuation\\">}</span> <span class=\\"token keyword\\">catch</span> <span class=\\"token punctuation\\">(</span>e<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n          <span class=\\"token function\\">reject</span><span class=\\"token punctuation\\">(</span>e<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span>\\n      <span class=\\"token punctuation\\">}</span>\\n    <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">;</span>\\n    \\n  <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">;</span>\\n\\n<span class=\\"token class-name\\">MyPromise</span><span class=\\"token punctuation\\">.</span>prototype<span class=\\"token punctuation\\">.</span><span class=\\"token function-variable function\\">catch</span> <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">onRejected</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token keyword\\">return</span> <span class=\\"token keyword\\">this</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">then</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">undefined</span><span class=\\"token punctuation\\">,</span> onRejected<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">;</span>\\n\\nMyPromise<span class=\\"token punctuation\\">.</span><span class=\\"token function-variable function\\">resolve</span> <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">result</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token keyword\\">return</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">Promise</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">resolve<span class=\\"token punctuation\\">,</span> reject</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token function\\">resolve</span><span class=\\"token punctuation\\">(</span>result<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">;</span>\\n\\nMyPromise<span class=\\"token punctuation\\">.</span><span class=\\"token function-variable function\\">reject</span> <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">reason</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token keyword\\">return</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">Promise</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">resolve<span class=\\"token punctuation\\">,</span> reject</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token function\\">reject</span><span class=\\"token punctuation\\">(</span>reason<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">;</span>\\n\\nmodule<span class=\\"token punctuation\\">.</span>exports <span class=\\"token operator\\">=</span> exports <span class=\\"token operator\\">=</span> MyPromise<span class=\\"token punctuation\\">;</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`);export{n as data};
