import $ from '../zr-tools'
    var Utils = {};

    function pluginAlias(runtime, name){
        //var index = name.indexOf("!");
        //if(index > -1){
        //   var pluginName = name.substring(0, index);
        //   name = name.substring(index+1);
        //}

        return name;
    }

    /**
     *名称改装以 / 结尾自动添加 index
     *
     * */
    function addIndexAndRemoveJsExt(modName){
          if($.isString(modName)){
              return addIndexAndRemoveJsExtFromName(modName);
          }else{
              return "";
          }
    }

    function addIndexAndRemoveJsExtFromName(modName){
         // 'x/' 'x/y/z/'
        if(modName.charAt(modName.length - 1) === "/") {
            modName += "index";
        }
        //以"/ or \"开头替换为"./"
        modName = modName.replace(/^[\/|\\]/g,"./");
        //
        if($.endWidth(modName,".js")){
            modName = modName.slice(0,-3);
        }
        return modName;
    }


    Utils = $.extend(Utils,{
        //filter path name
        extRouteName:function(name){
            // 'x/' 'x/y/z'
            if(name.charAt(name.length - 1) === "/"){
                name += "index";
            }
            if($.endWidth(name, ".js")){
                name = name.slice(0,-3);
            }
            return name;
        },
        //update config information
        addQueenRequire:function(config,factory){
            //if(factory.length > 1 && typeof factory === "function" && !config){
            //
            //}
            if(config && config.requires && !config.cjs){
                config.cjs = 0;
            }
            return config;
       },
        /**
         * register Module to Zr,But not use and load right now
         * @param {String} [name]  this is Module's name
         * @param {function/String/Array} [factory]
         * @param {Object} [cfg] module config
         * @param {Object} [runtime] this if Global Object ,as Zr;
         * @return {null}
         * */
        registerModule:function(name,factory,cfg,runtime){
            name = this.extRouteName(name);
            //
            var mods = runtime.global.MODULES,
                module = mods[name] || {};
            var loader = runtime.Loader;
            if(module && module.factory !== undefined){
                runtime.log("The name of '"+name + "' is defined more than once");
                return;
            }
            //
            //
            mods[name] = $.extend(module,{
                name:name,
                status:loader.Status.LOADED,
                factory:factory
            },cfg);
        },

        /**
         * Get modules
         * @param {Object} [runtime] this if Global Object ,as Zr;
         * @param {String[]} modNames module names
         * @return {Array} modules exports
         * */
        getModules:function(runtime,modNames){
            //初始化清空
            runtime.alias = {};
            //
             var module,
                 modFactory,
                 modExports,
                 modAlias,
                 mods = [runtime],
                //  child_mods = [],
                 alias = {},
                 _c,
                 runtimeMods = runtime.global.MODULES;

            // var child_module;
            $.each(modNames,function(index,modName){
                // child_mods = [];
                module = runtimeMods[modName];
                modName = module["name"] || modName;
                modFactory = module["factory"];
                modExports = module["exports"];
                modAlias = module["alias"] || "";
                // modRequires = module["requires"] || [];
                //迭代依赖关系并建立回显内容
                // $.each(modRequires,function(ind,mod){
                //     child_module = runtimeMods[mod];
                //     //
                //     child_mods.push(child_module.exports);
                // })
                //
                
                
                //
                if(!modName || $.extname(modName) !== ".css"){
                    try {
                        _c = modExports ? modExports : modFactory()
                        mods.push(_c);
                        //注册alias关系
                        if(modAlias){
                            alias[modAlias] = _c;
                            // Utils.registerAliasExports(runtime,modAlias,modName);
                        }
                    } catch(err) {
                        throw "请检查您的"+modName+"模块名称异常！";
                    }

                }else{
                    mods.push(undefined);
                }
            })
            //是否启用别名系统
            if(mods.length > 1){
                $.each(mods,function(i,n){
                    if(i == 1){
                        runtime.alias = alias;
                    }
                    return false;
                })
            }
              
            return mods;
        },
        //注册依赖路径
        registerAliasExports:function(runtime,name,path){
            var module = runtime.global.baseConfig.module;
            if(!module[name]){
                module[name] = {path:path};
            }

        },
        /**
         *
         * */
        normalDepModuleName:function(modName, depName){

        },

        /**
         * normalize module names with alias
         * @param {Object} [runtime] this if Global Object ,as Zr;
         * @param {String[]} modNames module names
         * @param [refModName] module to be referred if module name path is relative
         * @return {String[]} normalize module names with alias
         */
        normalizeModNamesWidthAlias:function(runtime, modNames, refModName){
            var ret = [];
            if(modNames){
                $.each(modNames,function(index,modName){
                    if(modName){
                        ret.push(pluginAlias(runtime, addIndexAndRemoveJsExt(modName)));
                    }
                })
            }
            //相对路径转化绝对路径
            if(refModName){
                ret = Utils.normalDepModuleName(refModName,ret);
            }
            return ret;
        },
        /**
         * ./a/ => ./a/index || ./a/b.js => ./a/b
         * @param {String[]} modNames module names
         * @return {String[]} normalize module names with alias
         */
        extModnames:function(modNames){
            var ret = [];
            if(modNames && $.isArray(modNames)){
                $.each(modNames,function(index,modName){
                    if(modName){
                        ret.push(addIndexAndRemoveJsExt(modName));
                    }
                })
            }
            if(modNames && $.isString(modNames)){
                ret = addIndexAndRemoveJsExt(modNames);
            }
            return ret;
        },
        /**
         * check import modules
         * 0 不用等待直接加载，1等待检查后再加载
         * */
        checkIsLoadingStatus:function(modNames,runtime){
             var ret = 0,end = 0;
             // runtime.global.MODULES
             $.each(modNames,function(i,n){
                 var r = runtime.global.MODULES[n] || 0;
                 ret = (ret || r);
             })
            if(!ret){
                 return 0;
            }
            //
            $.each(modNames,function(i,n){
                var r = runtime.global.MODULES[n] || 0;
                if(r){
                    end = (end || r.factory ? 0 : 1);
                }
            })
            return end;
        },
        /**
         *
         *
         * */
        reloadModule:function(runtime,moduleName,cfg){
            var loader = runtime.Loader,
                _module = this;
            if(!(_module instanceof Utils.reloadModule)){
                return new Utils.reloadModule(runtime,moduleName,cfg);
            }
            //update current module status
            _module.status = loader.Status.INIT;
            //
            _module.name = undefined;
            _module.factory = undefined;
            //
            _module.cjs = 1;
            //
            _module = $.extend(_module,cfg);
            //
            _module.waitedCallbacks = [];
        },
        /**
         * create single module information
         * @param runtime is Module Object, as Zr
         * @param {String} modeName to be craeted module name
         * @param {Object} [cfg] module config
         * @return {Zr.Module}
         *
         * */
        createModuleInfo:function(runtime,modName,cfg){
            modName = this.extRouteName(modName);
            var mods = runtime.global.MODULES,
                module = mods[modName];
            //检查是否已经配置到Zr模块上
            if(module){
                return module;
            }
            //
            cfg = cfg || {};
            //如果没有,则需要重新登记模块到Zr
             mods[modName] = module = this.reloadModule(runtime,modName,cfg);
            return module;
        },
        /**
         * check modules is exist
         * @param {Array} [modules]
         * @param {Object} [runtime] this if Global Object ,as Zr
         * @return {Boolean}
         * */
        checkModsLoadRecursively:function(modNames,runtime){
            var s = 1;
            $.each(modNames,function(i,n){
                s = s && Utils.checkModLoadRecursively(n,runtime);
            })
            return !!s;
        },

        /**
         * Dependent on checkModsLoadRecursively
         * @param {Array} [modules]
         * @param {Object} [runtime] this if Global Object ,as Zr
         * @return {Boolean}
         * */
        checkModLoadRecursively:function(modName,runtime){
             var mods = runtime.global.MODULES,
                 status,
                 m = mods[modName];
             if(!m){
                 return false;
             }
            status = m.status;
            return true;
        },

        /**
         *重新绑定关系
         * */
        bindModsRecursively:function(modNames,runtime){
              $.each(modNames,function(i,n){
                  Utils.attachModRecursively(n,runtime);
              })
        },
        attachModRecursively:function(modName,runtime){
            var mods = runtime.global.MODULES,
                status,
                m = mods[modName];
            status = m.status;
            if(status >= runtime.Loader.Status.ATTACHING){
                return;
            }
            m.status = runtime.Loader.Status.ATTACHING;
            // Utils.attachMod(runtime,m);
            Utils.attachModFix(runtime,m);

        },
        attachModFix:function(runtime,module){
            var factory = module.factory,
                mods = runtime.global.MODULES,
                requires = module.requires,
                array = [runtime],
                callfn,
                callback;
            //矫正加载的名称./a/b.js => ./a/b 或者 ./a/b/ => ./a/b/index
            requires = Utils.extModnames(requires);
            //根据模块名，获取正确的命名规则
            requires = Utils.checkFromModuleList(requires,runtime);
            requires = Utils.extModnames(requires);
            //
            if($.isFunction(factory)){
                // var require;
                if(factory.length > 1){
                    $.each(requires,function(i,n){
                        if(!mods[n]){
                            throw "请检查该模块:"+n+",是否已注册或者拼写是否有误！";
                            // return;
                        }
                        //
                        if($.extname(n) == ".css"){
                            callfn = undefined;
                        }else{
                            callfn = mods[n].exports ? mods[n].exports : mods[n].factory();
                        }
                        //

                        array.push(callfn);
                    })
                }
                callback = factory.apply(module,array);
                if(callback){
                    module.exports = callback;
                }
            }else{
                module.exports = factory;
            }
            module.status = runtime.Loader.Status.ATTACHED;
        },

        attachMod:function(runtime,module){
             var factory = module.factory,
                 myEx;

             if($.isFunction(factory)){
                var require;

                if(factory.length > 1){
                    require = $.bind(module.requires,module);
                }
                //
                 myEx = factory.apply(module,runtime,require,module);
                 if(myEx){
                     module.exports = myEx;
                 }
                 //
             }else{
                 module.exports = factory;
             }
             module.status = runtime.Loader.Status.ATTACHED;
        },
        /**
         * 以下只是测试版本的方法
         * 测试版本方法
         * **/

        checkDependOn:function(modName,runtime){
            var mods = runtime.global.MODULES,
                // status,
                m = mods[modName];
            if(!m){
                // console.log("未查询到该模块,请加载后再执行");
                return false;
            }else{
                return true;
            }
        },
        getWaitingModName:function(mods){
           var modName,status = false;
            $.each(mods,function(i,n){
                if(status === false){
                    modName = i;
                    return false;
                }
            })
            return modName;
        },
        dependOnMod:function(waitingModules,runtime){
            //如果不为空,则执行依次依赖执行
            var modName = Utils.getWaitingModName(waitingModules.waitMods);
            //
            //
            var modObj = runtime.global.MODULES[modName] || "";
            //
            //
            if(!modObj){
                waitingModules.notifyAll();
                return;
            }
            //
            waitingModules.remove(modName);
            //
            if(modObj.status > runtime.Loader.Status.LOADED){
                //已加载继续执行
                Utils.dependOnModEach(waitingModules,runtime);
            }else{
                //已经开始加载
                runtime.global.MODULES[modName].status = runtime.Loader.Status.READY_TO_ATTACH;
                //未加载执行依次加载
                var requires = modObj.requires;
                if(requires){
                    requires = requires.join(",");
                    runtime.use(requires,function(){
                        Utils.dependOnModEach(waitingModules,runtime);
                    })
                }else{
                    Utils.dependOnModEach(waitingModules,runtime);
                }

            }
        },
        dependOnModEach:function(waitingModules,runtime){
            if(!$.isEmptyObject(waitingModules.waitMods)){
                Utils.dependOnMod(waitingModules,runtime);
            }else{
                waitingModules.notifyAll();
            }
        },
        checkRequireModules:function(modNames,runtime){
            var ret = [],
                modObj,r,s;
            $.each(modNames,function(i,n){
                modObj = runtime.global.MODULES[n];
                r = modObj.requires;
                s = modObj.status;
                if(r && s <= runtime.Loader.Status.LOADED){
                    ret = ret.concat(modObj.requires);
                }
            })
            return ret;
        },
        registerNameAndAddRequireName:function(name,deps,runtime){
            var r = Utils.checkNameRex(name);
            var ret = [];
            if(deps.length > 0 && r){
                $.each(deps,function(i,n){
                    //判断当前是否是以"./  or .\"开头
                    var isExt = Utils.isAddExtName(n);
                    if(isExt){
                        n = n.replace(/^(\.[\/|\\])/g,"");
                        ret.push(r+n);
                        return;
                    }
                    //判断当前是否以"/ or \"开头
                    isExt = Utils.isAddExtshortName(n);
                    if(isExt){
                        n = n.replace(/^[\/|\\]/g,"");
                        ret.push("./"+n);
                        return;
                    }
                    //如果以上都不是那就是以别名进行命名的规则
                    ret.push(n);
                })
            }
            //最后检查依赖是否有别名，有就替换，没有就继续
            ret = Utils.checkFromModuleList(ret,runtime);
            if(!ret.length){
                ret = deps;
            }
            return ret;
        },
        isAddExtName:function(name){
            var ret = name.match(/^(\.[\/|\\])/g);
            return ret ? 1 : 0;
        },
        isAddExtshortName:function(name){
            var ret = name.match(/^[\/|\\]/g);
            return ret ? 1 : 0;
        },
        checkNameRex:function(name){
            var rex = /^\.[\/|\\]\w+[\/|\\]/;
            var rname = name.match(rex) || "";
            return rname;
        },
        checkFromModuleList:function(modNames,Zr){
            var config = Zr.baseConfig,
                mod,mdname;
            //
            var repeat = {};    
            $.each(modNames,function(i,n){
                mod = Utils.extModnames([n]);
                if(repeat[mod]){
                    modNames[i] = repeat[mod];
                    return;
                }
                mdname = config.module[mod];
                if(mdname){
                    modNames[i] = mdname.version ? mdname.path.replace("@version",mdname.version) : mdname.path;
                }
                repeat[mod] = modNames[i];
            })
            return modNames;
        },
        checkAttachStatus:function(modsNames,runtime){
            var ret = [],
                mods = runtime.global.MODULES,
                mod,
                status;
            if(modsNames){
                $.each(modsNames,function(i,n){
                    //
                    n = Utils.extModnames(n);
                    //
                    mod = mods[n] || {};
                    status = mod.status;
                    if(!status){
                        ret.push(n);
                    }
                })
            }
            return ret;
        },
        //检查并返回第0项为伪数组转换为数组
        checkChildStringToArray:function(modules){
            if(!modules){
                return modules;
            }
            var rets = modules[0];
            if(rets.lastIndexOf(",") > 0){
                try{
                    rets = rets.split(",");
                }catch(error){
                    throw "转换modules的String => Array 异常，请检查后重试";
                }
            }else{
                rets = modules;
            }
            return rets;
        }
    })
    // module.exports = Utils;
    export default Utils