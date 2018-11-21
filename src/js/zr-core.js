/**
 * Created by zhangjinglin on 16/9/2.
 */
import Zr from './zr-nameSpace';
import modules from './base/modules';
// import dom from './zr-dom';
import tools from './zr-tools';
import event from './zr-event';
import getFile from './loadFile/zr-getFile';
import config from './zr-config';

//
Zr.global.document = Zr.document = document;
Zr.global.window = Zr.window = window;
Zr.global.baseConfig = Zr.baseConfig = config;
Zr.global.config = Zr.config = function(options){
    Zr.global.baseConfig = Zr.baseConfig = tools.extend(true,Zr.global.baseConfig,options);
};
//添加完后执行别名执行操作
//Zr.global.use = Zr.use = modules.Modules;
Zr.global.use = Zr.use = modules.ModulesFix;
Zr.global.add = Zr.add = modules.ModulesAdd;
Zr.global.require = Zr.require = getFile;
Zr.global.tools = Zr.tools = tools;
Zr.global.extend = Zr.extend = tools.extend;
// Zr.global.dom = Zr.dom = dom;
// Zr.global.init = Zr.init = dom.init;
Zr.global.event = Zr.event = event;
//
Zr.global.readyQueen = Zr.readyQueen = [];
Zr.global.ready = Zr.ready = function(fn){
    Zr.readyQueen.push(fn);
}
Zr.tools.later(function(){
    Zr.use("zr","dp",function(zr){
        Zr.tools.each(Zr.readyQueen,function(i,n){
            n();
        })
    });
},0)
    //
export default Zr