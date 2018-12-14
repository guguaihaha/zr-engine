Zr.add("./test/1.0.0/index",function(zr){
     console.log(zr.alias);
    var t = {
        init:function(){
            console.log("1.0.0="+index);
        }
    }
  return t;
},{alias:"tt",requires:["/test/1.0.0/test"]})