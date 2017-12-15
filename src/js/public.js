/**
 * Created by huangyexin on 2016/10/31.
 */
var Interface = require("./interface.js");
var MD5 = require("./md5.js");
import Vue from 'vue'
import layer from '../../static/layer.js'
Vue.use(layer);
export default {

    myHost:Interface.default.myHost,
    Auth : {
        get: function () {
            var result = {};
            try{
                result = JSON.parse(localStorage['persion']);
                //添加时间戳 超过一天调用接口时 自动登出
                if(result && new Date().getTime()-result.timeStamp>86400000){
                    this.remove()
                    return 0
                }
            }catch(r){
                result = sessionStorage['persion'] && JSON.parse(sessionStorage['persion']);
                 if(result && new Date().getTime()-result.timeStamp>86400000){
                    this.remove()
                    return 0
                }
            }
            if("object" === typeof result){
                return result['accessToken'];
            }
            return 0;
        },
        set: function (_user) {
            window.setTokenFlag=true;
            //添加时间戳 超过一天调用接口时 自动登出
            _user.timeStamp=new Date().getTime()
            if(_user.accessToken&&_user.accessToken=="app"){
                this.remove()
			}else{
                try{
                    window.setTokenFlag=true
                    localStorage['persion'] = JSON.stringify(_user);
                    //DOTO! 使用此方法需要解决切换用户后第一次访问的问题(立即token覆盖问题)
                }catch(r){
                    sessionStorage['persion'] = JSON.stringify(_user);
                }
            }
        },
        remove: function () {
            try{
                localStorage.removeItem('persion');
            }catch(r){
                sessionStorage.removeItem('persion');
            }
        }
    },
    API_GET :function(config){
        var data = config['data'] || {};
        var _this=this
        config['success'] = config['success'] || function(){};
        config['fail'] = function(response){
            //console.log(response);
            if(/重新登录/.test(response.message)){
                this.Auth.remove();
            }
        };
        var _config = {
            'API_KEY' : this.Auth.get(), //不可为null
            'SECRET' : 'UYGGYG876T6759HUHI975T7GGKJO9786456EDC08'
        };

        var param = function(obj) {
            //console.log(_config);
            var newobj = { 'api_key' : _config['API_KEY'], 'ct' : 1, 'bt' : 2 },
                tmparr = ['api_key', 'ct', 'bt'],
                query = [], name, value, subName, querytext;

            for(name in obj) {
                tmparr.push(name);
                newobj[name] = obj[name]; //复制一个新的obj,为了不影响原有formData数据
            }
            tmparr.sort();

            for(var i = 0, len = tmparr.length; i < len; i++) {
                name = tmparr[i];
                value = newobj[name];
                if(value instanceof Array) {
                    value = value.join(',');
                }else if(value instanceof Object) { //解决 select BUG
                    for(subName in value) {
                        value = value[subName];
                        break;
                    }
                }
                if(value !== undefined && value !== null){
                    query.push(name + '=' + value);
                    //query.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
                }
            }
            querytext = _config['SECRET'] + query.join('').split('=').join('');
            return query.join('&') + '&sign=' + MD5.MD5(querytext).toUpperCase();
        };

        config['xhr'] = $.ajax({
            type: 'POST',
            url: Interface.default.Model[config['url']],
            data: (String(data) == '[object Object]' ? param(data) : data),
            dataType: 'json',
            success: function(response,textStatus, request){
                if(response.data == null){ response.data = []; }
                if(response.isSuccess == false){
                    //  if(response.status=="201"){
                    //      //业务异常 alert
                    //     alert(response.message)
                    // }
                    if(response.status=="301"){
                         //登出 alert
                        window.Hub.$emit("loginOut",response.message)
                        _this.Auth.remove();
                        return
                    }
                    if(response.status=="500"){
                         //系统异常
                        alert(response.message);
                      return
                    }
                    if(response.status=="501"){
                         //网络不稳定
                       alert(response.message)
                      return
                    }
                    if(response.status=="401"){
                         //非法客户端  网络异常
                      alert(response.message)
                      return
                    }

                }
                //publicArr[cache['url']][cache['data']] = JSON.stringify(response);
                config['success'](response, request);
            },
            error: config['error']
        });

    },
    initShare:function(){
      
        this.loadjs('//res.wx.qq.com/open/js/jweixin-1.0.0.js',this.shareJs)
    },
    shareJs:function(myShare){
        $.ajax({
            url: Interface.default.Model["getWeiXinSign"],
            data: {url:location.href},
            success: (data)=> {
                // 微信分享事件监听
                wx.config({
                    debug: false,
                    appId: data.appId, // 公众号的唯一标识
                    timestamp: data.timestamp, // 生成签名的时间戳
                    nonceStr: data.nonceStr, // 生成签名的随机串
                    signature: data.signature, // 签名
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'hideMenuItems',
                        'hideAllNonBaseMenuItem',
                        'hideOptionMenu',
                        'hideOptionMenu',
                        'showMenuItems',
                        'hideMenuItem'
                    ]
                });
                var shareData;
                if(myShare){
                    shareData = myShare
                }else{
                    shareData={//默认值
                        title: "花钱容易赚钱难，轻轻一点钱生钱！",
                        desc: "惊喜大红包已发送给您，请笑纳~！本月线上更多活动火热进行中，一起来赚钱吧！",
                        link: location.origin+"/m/xiangnian/#/index/index",
                        imgUrl: "http://bxwd-img.oss-cn-hangzhou.aliyuncs.com/upload/image/1706/68ab8210-e64c-44f5-b091-901dc7c55901.jpg"
                    }
                }
                
                wx.ready(()=> {
                    //全部屏蔽掉
                    wx.hideOptionMenu();
                    wx.showMenuItems({
                        menuList:[
                            'menuItem:readMode', // 阅读模式
                            'menuItem:share:timeline', // 分享到朋友圈
                            'menuItem:copyUrl', // 复制链接
                            'menuItem:share:appMessage'
                        ]});
                    
                    //分享到朋友圈
                    wx.onMenuShareTimeline(shareData);
                    //分享到微信好友
                    wx.onMenuShareAppMessage(shareData);
                    wx.onMenuShareQQ(shareData);
                });
            }
        });
    },
    loadjs:function(src,func){
        if(typeof func != 'function')
        {
            console.log('param 2 is not a function!!') ;
            return false ;
        }
        var script = document.createElement('script') ;
        script.type ='text/javascript' ;
        script.src = src ;
        var head = document.getElementsByTagName('head').item(0);
        head.appendChild(script);
        script.onload = function(){
            func();
        }
    },
    initApp:function(){
        // alert("加载js")
        window.setDeviceready=this.myDeviceready;
        window.setBackbutton=this.myBackbutton;
        window.setExitApp=this.exitApp;

        this.loadjs('cordova.js',this.appFunc)
    },
    appFunc:function(){
        // alert("加载js成功回调")
        document.addEventListener('deviceready',window.setDeviceready,false);
    },
    myDeviceready:function(){
        // alert("监听事件注册完成")
        document.addEventListener('backbutton',window.setBackbutton,false);
    },
    myBackbutton:function(){
        // alert("返回按钮触发事件")
        //下面的if判断页面是否是id为indexPage的页面如果是才执行，否则执行else的返回上一页
        if (location.hash=="#/index/index"||location.hash=="#/invest"||location.hash=="#/home/index") {
            window.Hub.$emit('toast','再点击一次退出!');
            document.removeEventListener("backbutton", window.setBackbutton, false); // 注销返回键
            document.addEventListener("backbutton", window.setExitApp, false);// 通过监听返回键绑定退出事件
            // 3秒后重新注册
            var intervalID = window.setTimeout(function() {
                window.clearTimeout(intervalID);
                document.removeEventListener("backbutton", window.setExitApp, false); // 注销返退出事件
                document.addEventListener("backbutton", window.setBackbutton, false); // 返回键
            }, 3000);
        }else{
            // navigate.app.backHistory();//相当于浏览器的后退
            history.back()
        }                
    },
    exitApp:function() {
        navigator.app.exitApp();
    },
    appSource:"xnjf",
    info:{
        phone:'400-888-0000',    //TODO:电话虚假，等待产品提供
        brisk: '活期',
        briskLang: '活期·无忧宝',
        siteName: '合末财富'
    }
    
}
window.setDeviceready=function(){}
window.setBackbutton=function(){}
window.setExitApp=function(){}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };

    if (/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o){
        if (new RegExp("(" + k + ")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
}
