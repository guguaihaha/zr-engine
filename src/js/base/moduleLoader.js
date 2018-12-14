/**
 * Created by zhangjinglin on 16/9/2.
 */
import Zr from '../zr-nameSpace';
import $ from '../zr-tools';
import utils from './utils';
import getFile from '../loadFile/zr-getFile'
import config from '../zr-config'
    //
    function moduleLoader(runtime,waitingModules){
        var _self = this;
        if(!(_self instanceof moduleLoader)){
            return new moduleLoader(runtime,waitingModules);
        }
        $.extend(this,{
            runtime:runtime,
            waitingModules:waitingModules
        })
        //
        return _self;
    }

    $.extend(moduleLoader.prototype,{
        /**
         *
         *
         *
         * */
        // use:function(normalizedModNames){
        //     var _self = this,
        //         allModNames,
        //         comboUrls,
        //         moduleUrl,
        //         timeout ;
        //     var length = normalizedModNames.length,
        //         index = 1;
        //     var array = [];
        //     $.each(normalizedModNames,function(i,n){
        //         moduleUrl = config.baseUrl + n;
        //         var type = $.extname(n);
        //         if(type == ".js"){
        //             array.push(n);
        //         }
        //        getFile(moduleUrl,function(){
        //            index++;
        //            if(index == length){
        //                array.push(function(){
        //                    alert("run")
        //                    _self.waitingModules.notifyAll();
        //                })
        //                Zr.use.apply("",array);
        //            }
        //        })
        //     })
        //
        // },
        /**
         * 因为Zr.use方法使用的方法至少有一种未加载，所以将所有use方法挂起，并逐一检查与加载
         * 第一步挂起use的方法到loader.fn中
         * 第二部将use的使用js插件与css分别挂起到到loader.waitMods中
         * 第三步开始执行挂起loader.waitMods的文件---->寻找策略（）
         * 1.已加载的Zr.global.MODULES列表中查找
         * 2.config配置文件的Zr.config.module中查找
         * 3.直接到config配置根目录插件列表中查找相应文件
         * 故使用如下方法进行文件加载，首先分析模块信息
         *
         *
         * */
        use:function(normalizedModNames,runtime){
            var _self = this,
                modules;
                        // allModNames,
                        // comboUrls,
                        // timeout ;
                //从config文件中查找对应的路径文件
                normalizedModNames = utils.checkFromModuleList(normalizedModNames,runtime);
                // console.log(normalizedModNames)
                //开始第一步筛查已存在的对象,并登记未使用对象到Zr.global.MODULES中
                modules = _self.calculate(normalizedModNames);
                //开始遍历加载模块到页面
                if(!$.isEmptyObject(modules)){
                    _self.eachLoadModules(modules);
                }

            //

            //
        },
        // calculate:function(modNames, cache, ret){
        //     var m,
        //         mod,
        //         modStatus,
        //         self = this,
        //         waitingModules = self.waitingModules,
        //         runtime = self.runtime;
        //     ret = ret || {};
        //     //
        //     // console.log(self.runtime.global.MODULES)
        //     //
        //     $.each(modNames,function(i,n){
        //       mod = utils.createModuleInfo(runtime,n);
        //       modStatus = mod.status;
        //       m = utils.extModnames([n]);
        //        if(modStatus >= runtime.Loader.Status.READY_TO_ATTACH){
        //            //再次判定当前是否存在
        //            waitingModules.remove(m[0]);
        //            //remove this
        //            return;
        //        }
        //        if(modStatus !== runtime.Loader.Status.LOADED){
        //            if(waitingModules.contains(m)){
        //                if(modStatus !== runtime.Loader.Status.LOADING){
        //                    mod.status = runtime.Loader.Status.LOADING;
        //                    ret[n] = 1;
        //                }
        //            }else{
        //                mod.status = runtime.Loader.Status.INIT;
        //                ret[n] = 0;
        //            }
        //        }
        //     })
        //     return ret;
        //
        // },
        calculate:function(modNames, cache, ret){
            var m,
                mod,
                modStatus,
                self = this,
                waitingModules = self.waitingModules,
                runtime = self.runtime;
            ret = ret || [];
            //
            // console.log(self.runtime.global.MODULES)
            //
            $.each(modNames,function(i,n){
                mod = utils.createModuleInfo(runtime,n);
                modStatus = mod.status;
                m = utils.extModnames([n]);
                if(modStatus >= runtime.Loader.Status.READY_TO_ATTACH){
                    //再次判定当前是否存在
                    waitingModules.remove(m[0]);
                    //remove this
                    return;
                }
                if(modStatus !== runtime.Loader.Status.LOADED){
                    if(waitingModules.contains(m)){
                        if(modStatus !== runtime.Loader.Status.LOADING){
                            mod.status = runtime.Loader.Status.LOADING;
                            ret.push(n);
                        }
                    }else{
                        mod.status = runtime.Loader.Status.INIT;
                        ret.push(n);
                    }
                }
            })
            return ret;

        },
        // checkFromModuleList:function(modNames){
        //     var config = this.runtime.baseConfig,
        //         mod,mdname
        //     $.each(modNames,function(i,n){
        //         mod = utils.extModnames([n]);
        //         mdname = config.module[mod];
        //         if(mdname){
        //             modNames[i] = mdname.path;
        //         }
        //     })
        //     return modNames;
        // },
        checkCDNStatus:function(modName){
            var status = 1;
            if(!modName.match(".cdn")){
                status = 0;
            }
            return status;
        },
        eachLoadModules:function(normalizedModNames){
            var cssArray = [],jsArray =[],allLength=0,index = 0,moduleUrl,type,m;
            var _self = this;
            $.each(normalizedModNames,function(i,n){
                //
                //
                m = utils.extModnames(n);
                // alert(_self.waitingModules.contains(m));
                // if(!_self.waitingModules.contains(m)){
                //     _self.waitingModules.remove(m);
                //     return;
                // }
                //
                type = $.extname(n);
                //再次筛查等待列表是否有此次任务名称
                if(type == ".css"){
                    cssArray.push(n);
                }
                if(type == ".js"){
                    jsArray.push(n);
                }
                if(!type){
                    m += ".js";
                    jsArray.push(m);
                }
                allLength++;
            })
            //
            //
            $.each(cssArray,function(a,b){
                //
                if(Zr.global.MODULES[b].status == Zr.Loader.Status.ATTACHED){
                    index++;
                    return;
                }
                //
                if(_self.checkCDNStatus(b)){
                    moduleUrl = config.cdnUrl + b;
                }else{
                    moduleUrl = config.baseUrl + b;
                }
                moduleUrl = moduleUrl.replace(/\.[\/|\\]+/,"");
                getFile(moduleUrl,function(){
                               index++;
                               _self.waitingModules.remove(b);
                               if(index == allLength){
                                   _self.waitingModules.notifyAll();
                               }
                               //css载入后直接更改为已绑定依赖状态
                               Zr.global.MODULES[b].status = Zr.Loader.Status.ATTACHED;
                           })
            })
            //
            $.each(jsArray,function(c,d){
                if(_self.checkCDNStatus(d)){
                    moduleUrl = config.cdnUrl + d;
                }else{
                    moduleUrl = config.baseUrl + d;
                }
                moduleUrl = moduleUrl.replace(/\.[\/|\\]+/,"");
                m = utils.extModnames(d);
                _self.runtime.global.MODULES[m].status = _self.runtime.Loader.Status.LOADING;
                getFile(moduleUrl,function(){
                    index++;
                    _self.waitingModules.remove(m);
                    if(index == allLength){
                         _self.waitingModules.notifyAll();
                    }
                })
            })

        }
    })
export default moduleLoader