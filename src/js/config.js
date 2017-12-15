export default {
    isWeiXin:function(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;      
        }
    },
    setTopClass:function(){
        return ""
        // if(this.isWeiXin()){
        //     return ""
        // }else{
        //      return "loadmoreTop"
        // }
    },
    appSource:"hemo",
    info:{
        appName:"合末财富",
        phone:'400-888-0000',    //TODO:电话虚假，等待产品提供
        finaName:"定期理财",
        brisk: '活期',
        briskLang: '活期·无忧宝',
    }
}