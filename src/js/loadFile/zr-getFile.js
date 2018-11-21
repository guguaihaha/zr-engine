import $ from '../zr-tools'
    var doc = document,
        headNode,
        norepeat = {};

    var getFile = function(url,success,charset){
         var defaults = success,
             css = false,
             error,
             callbacks,
             attrs,
             timeout,
             timer;
         var baseConfig = Zr.baseConfig;
        //
        var randomTime = +(new Date()),
        randomMath = Math.floor(Math.random() * 10000000);
        randomTime ="?requestTime="+randomTime + randomMath;
        if(url.lastIndexOf(".css",url.length) > 0){
            css = true;
        }
        //
        if($.isPlainObject(defaults)){
            success = defaults.success;
            error = defaults.error;
            timeout = defaults.timeout;
            charset = defaults.charset;
            attrs = defaults.attrs;
        }
        //存储并调用节点,以防重复加载数据;norepeat是根据url的关键key存储的数组
        callbacks = norepeat[url] = norepeat[url] || [];
        //将callbacks数组加入新方法
        success = success || function(){};
        error = error || function(){};
        callbacks.push([success,error]);
        //如果已存在url请求,则直接返回存储的节点名称即可
        if(callbacks.length > 1){
            return callbacks.node;
        }
        //
        //
        var node = doc.createElement(css ? 'link' : 'script'),
            clearTimer = function(){
                if(timer){
                    timer.cancel();
                    timer = undefined;
                }
            }
        //
        //
        if(attrs){
            $.each(timer,function(i,n){
                node.setAttribute(i,n);
            })
        }
        //
        if(charset){
            node.charset = charset;
        }
        //
        //设置开发模式
        if(css){
            if(baseConfig.requestTime){
                node.href = url + randomTime;
            }else{
                node.href = url;
            }
            node.rel = 'stylesheet';
        }else{
            if(baseConfig.requestTime){
                node.src = url + randomTime;
            }else{
                node.src = url;
            }
            node.async = true;
        }
        //设置版本信息
        if(!baseConfig.requestTime && baseConfig.requestVersion && css){
            node.href = url + "?ver=" + baseConfig.requestVersion;
        }else if(!baseConfig.requestTime && baseConfig.requestVersion){
            node.src = url + "?ver=" + baseConfig.requestVersion;
        }
        //缓存节点
        callbacks.node = node;
        //遍历存储方法体,方便回调(不存储直接回调容易被重复调用其他函数体覆盖先前函数体)
        function n(index){
            var index = index,
                fn;
            clearTimer();
            $.each(norepeat[url],function(i,n){
                if((fn = n[index])){
                    fn.call(node);
                }
            });
            delete callbacks[url];
        }
        //
        var supportLoad = "onload" in node,
            onEvent = supportLoad ? "onload" : "onreadystatechange";
        node[onEvent] = function(){
            node.onreadystatechange = node.onload = null;
            n(0);
        }
        if(timeout){
            timer = $.later(function(){
                n(1);
            },timeout*1000)
        }
        //
        if(!headNode){
            headNode = doc.getElementsByTagName("head")[0] || doc.documentElement;
        }
        //
        if(css){
            headNode.appendChild(node);
        }else{
            headNode.insertBefore(node,headNode.firstChild);
        }
        //
    }
export default getFile