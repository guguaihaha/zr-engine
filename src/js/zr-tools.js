/**
 * Created by zhangjinglin on 16/9/2.
 * *underscore1.7 and modify some methods
 */
   var $ = {}
   //
   //  var reg_html = /^\s*<(\w+|!)[^>]*>/,
   //      reg_selector = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/;
    //
    //
    var ArrayProto = Array.prototype, ObjProto = Object.prototype;// FuncProto = Function.prototype;
    //
    var
        // push             = ArrayProto.push,
        slice            = ArrayProto.slice,
        // concat           = ArrayProto.concat,
        toString         = ObjProto.toString;
        // hasOwnProperty   = ObjProto.hasOwnProperty;
    //
    var
        // nativeIsArray      = Array.isArray,
        nativeKeys         = Object.keys;
        // nativeBind         = FuncProto.bind,
        // nativeCreate       = Object.create;
    //
    // [root, dir, basename, ext]
    var splitPath = /^(\/?)([\s\S]+\/(?!$)|\/)?((?:\.{1,2}$|[\s\S]+?)?(\.[^.\/]*)?)$/,
        RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g;
    //ready Dom
    //
    $.isArray = function(obj){
        return toString.call(obj) === "[object Array]";
    }
    $.isObject = function(obj){
        return toString.call(obj) === "[object Object]";
    }
    $.isPlainObject = function(obj){
          //确保不是dom节点与window对象
        if(!obj || !$.isObject(obj) || obj.nodeType || obj.window ==obj){
            return false;
        }
        //hasOwnProperty(不检测原型链),isPrototypeOf(对象原型中是否存在对象),constructor(创建此对象的数组函数的引用),instanceof(测试对象是否为标杆对象的实例)
        try{
            if(!ObjProto.hasOwnProperty.call(obj,"constructor") && !ObjProto.hasOwnProperty.call(obj.constructor.prototype,"isPrototypeOf")){
                return false;
            }
        } catch(e){
            return false;
        }
        //
        for(var key in obj){}
        return ((key===undefined) || ObjProto.hasOwnProperty.call(obj,key));
    }
    $.isFunction = function(obj){
        return toString.call(obj) === "[object Function]";
    }
    $.isString = function(obj){
        return typeof obj === "string";
    }
    $.isRegExp = function(obj){
        return toString.call(obj) === "[object RegExp]";
    }
    $.isNumber = function(obj){
        return toString.call(obj) === "[object Number]";
    }
    $.isUndefined = function(obj){
        $.each(obj,function(i,n){
            if(i !== undefined){
                return false;
            }
        })
        return true;
    }
    $.isNull = function(obj){
        if(null === obj){
            return true;
        }
    }
    $.isBoolean = function(obj){
        return toString.call(obj) === "[object Boolean]";
    }
    $.isDate = function(obj){
        return toString.call(obj) === "[object Date]";
    }
    $.isEmptyObject = function(obj){
        var isTrue = true;
        $.each(obj,function(){
            isTrue = false;
            return true;
        })
        return isTrue;
    }
    //
    $.each = function(obj,callback){
        obj = obj || [];
      if($.isArray(obj)){
          obj.forEach(function(currentValue,index,array){
              callback.call(this,index,currentValue);
          });
          return;
      }
      var length = obj.length || 0;

      if(length > 0){
         for(var i = 0;i < obj.length; i++){
            callback.call(this,i,obj[i]);
         }
         return;
      }
        //
      for(var o in obj){
          if(obj.hasOwnProperty(o)){
              callback.call(this,o,obj[o]);
          }
      }
    }
    //
    $.keys = function(obj){
        if(!$.isObject(obj)) return [];
        if(nativeKeys) return nativeKeys(obj);
        var keys = [];
        $.each(obj,function(i,n){
            keys.push(i);
        })
        return keys;
    }
    //
    $.values = function(obj){
        if(!$.isObject(obj)) return [];
        var array = [];
        $.each(obj,function(i,n){
            array.push(n);
        })
        return array;
    }
    //
    $.makeArray = function(obj){
        if(!obj) return [];
        if($.isArray(obj))return slice.call(obj);
        var array = [];
        if($.isObject(obj) && obj.length>=0){
            $.each(obj,function(i,n){
                array.push(n);
            })
            return array;
        }
        $.each(obj,function(i,n){
            array.push({i:n});
        })
        return array;
        //
    }
    //
    $.grep = function(obj,callback,invert){

    }
    //
    $.map = function(obj,callback){

    }
    //
    $.indexArray = function(value,obj,fromIndex){

    }
    //
    $.merge = function(first,second){

    }
    //
    $.uniqueSort = function(array){

    }
    //
    $.trim = function(obj){
         return obj == null ? "" : (obj + "").replace(RE_TRIM,"");
    }
    //
    $.param = function(obj,traditional){

    }
    //
    $.size = function(obj){
        if(!obj) return 0;
        return obj.length >= 0 ? obj.length : $.keys(obj).length;
    }
    //
    $.stringArray = function(obj){
        if(!obj)return [];
        var splitAlt = ",";
        var args = arguments;
        if(args[1])splitAlt = args[1];
        if($.isString(obj))return obj.split(splitAlt);
        return [];
    }
    //
    $.extend = function(){
        var args = arguments;
        var deeps = false;
        var parent = args[0] || {},
            child = args[1] || {},
            i = 0,
            l = args.length;
        if($.isBoolean(args[0])){
            deeps = args[0];
            parent = args[1];
            child = args[2] || {};
            i = 3;
        }else{
            i = 2;
        }
        //
        //
        $.each(child,function(i,n){
            var copy = n;
            if(parent == copy)return;
            if(copy && $.isObject(copy) && deeps){
                parent[i] = $.extend(parent[i] || {},copy);
            }else if(copy && $.isArray(copy) && deeps){
                parent[i] = $.extend(parent[i] || [],copy);
            }else{
                parent[i] = copy;
            }
        })
        //
        if(l > i){
            for(var m = i; m < l; m++){
                parent = $.extend(deeps,parent,args[m]);
            }
        }
        //
        return parent;
    }
    //
    $.inherit = function(){
        var args = slice.call(arguments),
            starts = {},
            deep = "";
        if($.isBoolean(args[0])) {
            deep = args[0];
            args.splice(0,1);
        }
        $.each(args,function(i,n){
            (function (status,ret) {
                if(status){
                    starts = $.fextend(deep,starts,ret)
                }else{
                    starts = $.fextend(starts,ret)
                }
            })(deep,n)
        })
        return starts;

    }
    //
    $.extname = function(path){
        var fileName = (path.match(splitPath) || [])[4] || "";
        return fileName.toLowerCase();
    }
    //
    $.later = function(fn,time,which){
        time = time || 0;
        var r = (which) ? setInterval(fn, time) : setTimeout(fn, time);
        return {
            id:r,
            interval:which,
            cancel:function(){
                if(this.interval){
                    clearInterval(this.id);
                }else{
                    clearTimeout(this.id);
                }
            }
        }


    }
    //
    $.cookie = function(key,value,time){
        if(typeof(value)=="undefined"&&typeof(key)!="undefined"&&typeof(value)!="boolean"){
            var arr = document.cookie.match(new RegExp("(^| )"+key+"=([^;]*)(;|$)"));
            // console.log(document.cookie);
            if(arr != null) return (unescape(arr[2])); return null;
        }else if(typeof(key)=="string"&&typeof(value)=="string"){
            //默认30天
            if(typeof(time)=="undefined"||typeof(time)!="number") time=30;
            var exp = new Date();
            exp.setTime(exp.getTime() + time*24*60*60*1000);
            document.cookie = key + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/;";
        }else if(typeof(value)=="boolean"){
            if(value===true){
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var arr = document.cookie.match(new RegExp("(^| )"+key+"=([^;]*)(;|$)"));
                if(arr[2]!=null) document.cookie= key + "="+arr[2]+";expires="+exp.toGMTString()+";path=/";
            }
        }
    }
    //第三个参数是否使用临时会话默认不使用
    $.storage = function(key,value){
        if(typeof(value) == "object"){
            value = JSON.stringify(value);
        }
        var arg = arguments[2],
            local = arg?sessionStorage:localStorage;
        if(key&&!value){
            //读取相关信息
            return local.getItem(key);
        }else if(key&&value&&typeof(value)!="boolean"){
            //存储信息
            local.setItem(key,value);
        }else if(key&&value&&typeof(value)=="boolean"){
            local.removeItem(key);
        }
        if(arguments[3] === true){
            local.clear();
        }
    }

    $.browser = {
        versions:function(){
            var u = navigator.userAgent;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/(i[^;]+\;(U;)? CPU.+Mac OS X)/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                isSupportTouch : "ontouchend" in document ? true : false,//是否支持touch
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language:(navigator.browserLanguage || navigator.language).toLowerCase()
    }
    //
    //
    $.endWidth = function(str,suffix){
        var l = str.length - suffix.length;
        return l >= 0 && str.indexOf(suffix,l) === l;
    }
    //
    $.bind = function(r,fn,obj){
            function o(){};
            var args = slice.call(arguments,3),
                newFn = function(){
                       var inArgs = slice.call(arguments);
                       return fn.apply(this instanceof o ? this : obj || this,r ? inArgs.concat(args):args.concat(inArgs))
                }
            o.prototype = fn.prototype;
            newFn.prototype = new o();
            return newFn;
    }
    //
    $.format = function(fmt,time){
        var date = new Date(time);
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }
    /**
     * 数字分割方法 e.g:"1000023 => 1,000,023"
     * @param {number} [number] 一个整数字
     * @param {split} [number] 以几位进行分割，默认是3
     * @param {qt} [string] 以什么字符进行分割
     * */
    $.splitNumber = function(number,split,qt){
        var split = split || 3,
            number = number + "",
            qt = qt || ",";
        number = number.split("");
        number = number.reverse();
        var ret = [];
        $.each(number,function(i,n){
            if(i != 0 && i % split == 0){
                ret.push(qt);
                ret.push(n);
            }else{
                ret.push(n);
            }
        })
        ret = ret.reverse();
        ret = ret.join("");
        return ret;
    }
    //
    $.splitMoney = function(q){
        var r = parseInt(q)+"";
        if(r.length > 3){
            q = q / 100;
            q = Math.round(q);
            q = q /100;
            q = q + "万";
        }
        return q;
    }
    //
    $.transUrl = function(search){
        var ser = search.replace("?",""),
            o = ser.split("&"),
            p,
            rets = {};
        $.each(o,function(i,n){
            p = n.split("=");
            rets[p[0]] = p[1];
        })

        return rets;
    }
    $.reduce = function(){
    }
    export default $