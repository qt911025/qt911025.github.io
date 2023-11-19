---
title: 一个自己实现的Promise
date: 2017-6-15
category: 编程
tag: Javascript
---

自己照着 [Promise A+](https://promisesaplus.com/)  标准，以及 es6 的标准 Promise 实现的。没做任何优化（比如说那些钩子应该用链表来聚合的），没有 defer 。完全 es5 和 commonjs （不对应 es6 模块机制）。

留作备份。

```javascript
'use strict';

function MyPromise(handler){
  var _this = this;
  this.state = 'pending';
  this.resolveHooks = [];
  this.rejectHooks = [];
  
  var resolve = genHandler(_this.resolveHooks, 'fulfilled');
  var reject = genHandler(_this.rejectHooks, 'rejected');
  
  try {
    handler(resolve, reject);
  } catch(e) {
    if(_this.state === 'pending') {
      reject(e);
    }
  }
  
  function genHandler(hooks, state) {
    return function (value){
      setTimeout(function (){
        if(_this.state === 'pending'){
          _this.state = state;
          _this.result = value;
          for(var i in hooks) {
            hooks[i](value);
          }
        }else{
          throw new Error('This promise is already '+_this.state+'!');
        }
      }, 0);
    }
  }
  
}

MyPromise.prototype.then = function (onFulfilled, onRejected){
  if(arguments.length === 0) return this;
  var _this = this;

  return new MyPromise(function (resolve, reject) {
    switch(_this.state) {
      case 'pending':
        _this.resolveHooks.push(genHandler(onFulfilled));
        _this.rejectHooks.push(genHandler(onRejected));
        break;
      case 'fulfilled':
        setTimeout(function () {
          genHandler(onFulfilled)(_this.result);
        }, 0);
        break;
      case 'rejected':
        setTimeout(function () {
          genHandler(onRejected)(_this.result);
        }, 0);
        break;
      default:
        throw new Error('Invalid promise state!');
    }
    
    function genHandler(thenHook) {
      return function (value) {
        try {
          var result = typeof thenHook === 'function' ? thenHook(value) : value;
          if(result && result.then) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (e) {
          reject(e);
        }
      }
    };
    
  });
};

MyPromise.prototype.catch = function (onRejected){
  return this.then(undefined, onRejected);
};

MyPromise.resolve = function (result) {
  return new Promise(function (resolve, reject) {
    resolve(result);
  });
};

MyPromise.reject = function (reason) {
  return new Promise(function (resolve, reject) {
    reject(reason);
  });
};

module.exports = exports = MyPromise;
```
