/**
 * Created by zhangjinglin on 16/9/2.
 */
import Zr from '../zr-nameSpace';
import $ from '../zr-tools';
import utils from './utils';
import moduleLoader from './moduleLoader'

    var loader = Zr.Loader;
    var ModulesObject = {};
    //
    $.extend(ModulesObject,{
        Modules:function(){
            //沙箱模式
            var args = Array.prototype.slice.call(arguments),
                callback = args.pop(),
                error,
                sync,
                loader,
                waitingModules,
                finalCallback,
                tryCount= 0,
                _self = this,
                modules = (args[0] && typeof(args[0]) === "string")?args:args[0];

            if(!(_self instanceof ModulesObject.Modules)){
                return new ModulesObject.Modules(modules,callback);
            }
            //check list
            if($.isObject(callback)){
                error = callback.error;
                sync = callback.sync;
                callback = callback.success;
            }
            if(typeof(callback) !== "function"){
                throw "Callback must be a function";
            }
            //将结果集返回到回到函数体内, 此函数只有在依赖载入完毕,模块功能生效时调用
            finalCallback = function(){
                callback.apply(Zr,utils.getModules(Zr,modules));
            }
            //根据模块名称进行修改 => 获取正确模块名称
            modules = utils.extModnames(modules);
            //
            //
            function loadReady(){
                ++tryCount;
                var start = +new Date(),
                    ret;
                // console.log("开始执行模块依赖加载");
                ret = utils.checkModsLoadRecursively(modules,Zr);
                Zr.log(tryCount + " check duration :" + (+(new Date()) - start)+"ms");
                if(ret){
                    // console.log("检测模块是否依赖");
                    utils.attachModsRecursively(modules,Zr);
                }else{
                    // console.log("您有模块未注册,正在注册该模块");
                    waitingModules.fn = loadReady();
                    loader.use();
                    finalCallback();
                }
            }
            //(new)新建等待对象,将需要等待的模块名称添加到其中
            waitingModules = ModulesObject.waitingModules(loadReady);
            //(new)创建新loader对象,可以异步加载数据
            loader = moduleLoader(Zr,waitingModules);
            //

            //模块加载
            if(sync){
                //是否执行同步任务,同步则立即执行
                waitingModules.notifyAll();
            }else{
                //将任务塞入队列中等待
            }
            return Zr;
        },
        ModulesFix:function(){
            //沙箱模式
            var args = Array.prototype.slice.call(arguments),
                // error,
                // sync,
                // allModNames,
                loader,
                waitingModules,
                finalCallback,
                tryCount= 0,
                // attachFn,
                // modName,
                modNames,
                modObj,
                _self = this,
                modules = (args[0] && typeof(args[0]) === "string")?args:args[0];
            var callback = args[args.length - 1];
            if($.isFunction(callback)){
                callback = args.pop();
            }else{
                callback = function(){};
            }
            if(!(_self instanceof ModulesObject.ModulesFix)){
                return new ModulesObject.ModulesFix(modules,callback);
            }
            //check list
            if($.isObject(callback)){
                // error = callback.error;
                // sync = callback.sync;
                callback = callback.success;
            }
            if(typeof(callback) !== "function"){
                throw "callback was not defined";
            }
            //==========补丁=======>因为modules传入是string类型的数组，所以需要进行判断分析后转化为数组进行操作
            modules = utils.checkChildStringToArray(modules);
            //根据模块名称进行修改 => 获取正确模块名称
            var extModules = utils.extModnames(modules);
            //根据模块名，获取正确的命名规则
            modNames = utils.checkFromModuleList(extModules,Zr);
            modNames = utils.extModnames(modNames);
            //将结果集返回到回到函数体内, 此函数只有在依赖载入完毕,模块功能生效时调用
            finalCallback = function(){
                callback.apply(Zr,utils.getModules(Zr,modNames));
            }
            //
            function loadReady(){
                ++tryCount;
                var start = +new Date(),
                    ret;
                //检查模块是否全部都已经加载就绪，缺少一项则需要挂起后执行加载后才能再次执行此方法
                // ret = utils.checkModsLoadRecursively(extModules,Zr);
                ret = utils.checkModsLoadRecursively(modNames,Zr);
                Zr.log(tryCount + " check duration :" + (+(new Date()) - start)+"ms");
                if(ret){
                    //因为需要的模块已经成功载入，但是还没有检查该模块是否有需要依赖的模块
                    modObj = utils.checkRequireModules(modNames,Zr);
                    if(modObj.length){
                         modObj.push(function(){
                             //检查模块是否已经大于loaded，如果是，则重新从缓存中绑定模块关系，否则无法回调使用！！
                             utils.bindModsRecursively(modNames,Zr);
                             //
                             //
                             finalCallback();
                         })
                         Zr.use.apply(this,modObj);
                        return;
                    }
                    //检查模块是否已经大于loaded，如果是，则重新从缓存中绑定模块关系，否则无法回调使用！！
                    if(modNames.length){
                        utils.bindModsRecursively(modNames,Zr);
                    }
                    //
                    //
                    finalCallback();
                }else{
                    // console.log("您有模块未注册,正在注册该模块");
                    waitingModules.fn = loadReady;
                    //检查模块是否已经载入并检测状态
                    modules = utils.checkAttachStatus(modules,Zr);
                    //
                    loader.use(modules);
                    // finalCallback();
                }
            }
            //(new)新建等待对象,将需要等待的模块名称添加到其中
            waitingModules = ModulesObject.waitingModules(loadReady);
            //(new)创建新loader对象,可以异步加载数据
            loader = moduleLoader(Zr,waitingModules);
            //开始进行所有操作进行检查挂起,如果状态为2以内,则需要进行函数执行操作
            //第一步,全部挂起
            if(extModules.length > 0){
                $.each(extModules,function(i,n){
                    waitingModules.add(n);
                })
            }
            //并将第一步方法存储
            waitingModules.fn = loadReady;
            //分析模块并开始执行加载依赖
            function startAnalyse(waitingModules){
                if(!$.isEmptyObject(waitingModules.waitMods)){
                    utils.dependOnMod(waitingModules,Zr);
                }else{
                    //直接执行
                    waitingModules.notifyAll();
                }
            }
            function checkWaiting(modNames,waitingModules){
                startAnalyse(waitingModules)
            }
            //
            function reCheck(modNames,waitingModules){
                if(utils.checkIsLoadingStatus(modNames,Zr)){
                    (function(modNames,waitingModules){
                        setTimeout(function(){
                            reCheck(modNames,waitingModules);
                        },30)
                    })(modNames,waitingModules)
                }else{
                    //直接执行
                    checkWaiting(modNames,waitingModules);
                }
            }
            //第二步,开始分析并执行
            if($.isEmptyObject(Zr.global.MODULES)){
                checkWaiting(modNames,waitingModules);
            }else{
                reCheck(modNames,waitingModules);
            }
            // checkWaiting(modNames,waitingModules);
            //waitingModules.notifyAll();
            return Zr;
        },
        ModulesAdd:function(name,factory,deps){
            var array = [],
                deps = deps || {},
                config = deps;
            array.push(Zr.global);
            deps = deps.requires || [];
            //分析name格式，将保留./name/这样形式的字符到requires
            deps = utils.registerNameAndAddRequireName(name,deps,Zr);
            config.requires = deps;
            //
            //
            if(arguments.length == 3 && $.isArray(factory)){
                var tmp = factory;
                factory = deps;
                deps = tmp;
                config = {
                    requires:deps,
                    status:1
                };
            }
            //
            //
            config = utils.addQueenRequire(config,factory);
            //
            utils.registerModule(name,factory,config,Zr);
        },
        /**
        * 计算动态依赖模块加载
        * */
        calculate:function(modNames, cache, ret){
            var m,
                modStatus,
                mod;

            cache = cache || {};
            // ret = ret || {};
            $.each(modNames,function(i,n){
                m = n;
                if(cache[m]){
                    return;
                }
                cache[m] = 1;
                mod = utils.createModuleInfo(Zr,m);
                modStatus = mod.status;
                if (modStatus >= loader.Status.READY_TO_ATTACH) {
                    return
                }
                if(modStatus != loader.Status.LOADED){

                }
            })
        },
        /**
        * 依赖模块加载处理方法
        * */
        waitingModules:function(fn){
            var _self = this;
            if(!(_self instanceof ModulesObject.waitingModules)){
                return new ModulesObject.waitingModules(fn);
            }
            //
            $.extend(_self,{
                fn:fn,
                waitMods:{},
                notifyAll:function(){
                    var fn = _self.fn;
                    if(fn && $.isUndefined(_self.waitMods)){
                        _self.fn = null;
                        fn();
                    }
                },
                add:function(modName){
                    _self.waitMods[modName] = 1;
                },
                remove:function(modName){
                    delete _self.waitMods[modName];
                },
                contains:function(modName){
                    return _self.waitMods[modName];
                }
            })
            //

            //
            return _self;
        }

    })
    //
    ModulesObject.Modules.prototype = {


    }
    //
export default ModulesObject