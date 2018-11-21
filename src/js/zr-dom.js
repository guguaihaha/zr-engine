
    /**
    * @Author: zhangjinglin
    * @Email: zhangjinglin@jd.com
    * @Date: Created in 2018/1/23 上午10:37
    * @Description:统一管理内置组件的公共方法
    * @params <String> paramName
    * @paramsDescription  paramName :
    */
    function init(){
       alert(123);
    }
    /**
    * @Author: zhangjinglin
    * @Email: zhangjinglin@jd.com
    * @Date: Created in 2018/1/23 上午10:41
    * @Description:查找所需的节点
    * @params <String> selectors
    * @paramsDescription  选择器
    * @params <Number> type
    * @paramsDescription  返回的类型:1,默认，表示返回未标示（选择后将被标示）,2表示返回已标示的，3表示返回所有类别
    */
    function find(selectors,type){

    }



   export default {
       init:init,
       find:find
   }
