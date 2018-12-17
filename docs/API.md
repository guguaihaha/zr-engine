Zr的API
---
> Zr.use <span id="use">#</span>

- 语法：

` Zr.use(param1,param2,...,callback)`

- 入参类型：

   + `{String}  param1,param2,...`  
   
   + `{Function}  callback`

- 参数解析：
  
  + param1,param2,... 是可以支持同时调用多个组件名或者组件路径（一定是Zr.add）封装的，如果调用
  其他的非Zr封装，请参考Zr.require。
  
  + callback 是回调钩子，钩子结构function(zr,callbackParam1,callbackParam2,...),第一个参数永远是zr对象，
  第二个参数开始是对应use的对象入参顺序。如果use对象过多可以参考使用zr.alias.aliasName 来使用
  

- 参考用法：[使用方法](//github.com/guguaihaha/zr-engine/issues/4)




> Zr.add <span id="add">#</span>

- 语法：
` Zr.add(param,callback,options)`

- 用法：
  

