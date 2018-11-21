/**
 * Created by zhangjinglin on 16/9/2.
 */
    //
    var Zr = {
        //全局函数
        global:{
            //加载模块挂载对象数组,一经使用立刻加载到MODULEArray中
            /*param
            * {
            *   moduleName:"",//模块被使用的名称
            *   total:"",//模块加载的总次数
            *   moduleCaller:[//模块引用的统计
            *     {
            *       moduleName:"",//当前模块引用名称
            *       total:"",//当前模块引用次数
            *     }
            *   ]
            * }
            * */
            MODULEArray:{},
            MODULES:{//当前所有模块名称列表

            },
            config:{

            }
        },
        log:function(msg){
            // console.log(msg);
        },
        error:function(msg){
            throw msg;
        },
        //状态
        Loader:{
            Status:{
                /** error */
                'ERROR': -1,
                /** init */
                'INIT': 0,
                /** loading */
                'LOADING': 1,
                /** loaded */
                'LOADED': 2,
                /**dependencies are loaded or attached*/
                'READY_TO_ATTACH': 3,
                /** attaching */
                'ATTACHING': 4,
                /** attached */
                'ATTACHED': 5
            }
        },
        //基本配置
        config:{
            base:""
        }
    };
    window.Zr = Zr;
    export default Zr;