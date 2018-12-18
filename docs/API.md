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
  第二个参数开始是对应use的对象入参顺序。如果use对象过多可以参考使用zr.alias 来使用
  

- 参考用法：[使用方法](//github.com/guguaihaha/zr-engine/issues/4)

<br/>
<br/>
<br/>


> Zr.add <span id="add">#</span>

- 语法：
` Zr.add(param,callback,options)`

- 入参类型：
  + `{String}  param`
  
  + `{Function}  callback`
  
  + `{Object} options`
  
- 参数解析：

  + param   是组件路径，相对于[Zr.config](#config)中baseUrl的路径,也是Zr.use的使用路径，名称对应
  
  + callback 是回调钩子，钩子结构function(zr,callbackParam1,callbackParam2,...),第一个参数永远是zr对象，
  第二个参数开始是对应入参中options.requires的数组中的顺序。当然如果options.requires对象过多可以参考zr.alias来使用
  
  + options 是配置项目，目前包含两个对象{alias:"aliasName",requires:["param1","param2",...]}
  
- 参考用法：[使用方法](//github.com/guguaihaha/zr-engine/issues/5) 
 
 <br/>
 <br/>
 <br/>
 
 > Zr.document <span id="document">#</span>
 
 - 语法：
 `Zr.document`
 
 - 参考用法：直接调用即可，防止全局document污染。
 
    <br/>
    <br/>
    <br/>
 
 > Zr.window <span id="window">#</span>
 
 - 语法：
 `Zr.window`
 
 - 参考用法：直接调用即可，防止全局window污染
 
   <br/>
   <br/>
   <br/>
   
 > Zr.alias <span id="alias">#</span> 
 
 - 语法：
 `zr.alias`
 
 - 用法：
 此方法直接在Zr.use或者Zr.add方法的回调函数中第一个参数调用。用于快速获取具有别名的组件
 
 - 参考用法：[使用方法](//github.com/guguaihaha/zr-engine/issues/4#user-content-alias)
 
<br/>
<br/>
<br/>

> Zr.config <span id="config">#</span>

 - 语法：
 `Zr.config`
 
 - 入参类型：
   
   `{Object}  options`
 
 - 参数解析：
 
   + options.baseUrl 
   
     **必填字段**，配置业务js和css等静态资源代码库地址，可以是项目中地址，也可以是线上CDN等地址
   
   + options.requestTime
   
     **选填**,  
 
 
 - 参考用法：[使用方法]()
 
