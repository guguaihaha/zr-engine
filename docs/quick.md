如何快速开始引入
---
***此页面建立了[讨论区](//github.com/guguaihaha/zr-engine/issues/3)，欢迎提问和协同解决问题***
> 原始方式

```html
    <!--css样式请放在head标签内部-->
    <link type="text/css" rel="stylesheet" href="//storage.360buyimg.com/v1.0.0/zr/css/cdn_zr.css" />
    <!--以下script请放到</body>前-->
    <script type="text/javascript" language="javascript" src="//storage.360buyimg.com/v1.0.0/zr.min.js"></script>
    <!--具体初始化全局配置-->
    <script type="text/javascript">
       //配置方法；
       Zr.config({
           //配置plugin_modules的目录；
           baseUrl:"/js/plugin_modules/",
           //开发模式，默认关闭；开发模式可以开启。
           requestTime:true
       })
       //初始入口，Zr各个模块准备就绪后调用；
       Zr.ready(function(){
           //使用相应的模块；
           Zr.use("jquery","./js/code",function(zr,$,code){
               //自动注入了jquery组件；
               $(function({
                 //todo something
               }))
               //自动注入了./js/code组件；
               code.init()
           })
       })
    </script>
```
当然以上方式直接使用即可，但是不建议采用页面书写业务逻辑的方式，其他书写方式[请一起讨论](//github.com/guguaihaha/zr-engine/issues/2)

> 只引用样式
```html
    <!--css样式请放在head标签内部-->
    <link type="text/css" rel="stylesheet" href="//storage.360buyimg.com/v1.0.0/zr/css/cdn_zr.css" />
```
样式引用可以自由使用内置组件的基本样式红利，但是内置组件涉及到的动画、业务处理逻辑则丢失，请根据需求自行决定

> 全量产品线引入

这种方式就是采用Zr-pro布局，我们可以使用的具体方案如下

[此处是如何使用Pro系统解决方案](//github.com/guguaihaha/zr-pro-flex)