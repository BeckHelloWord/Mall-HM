import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
// import VueResource from 'vue-resource'
import '../static/need/layer.css'
import Public from './js/public'
import myConfig from './js/config'
import { InfiniteScroll  } from 'mint-ui';
Vue.use(InfiniteScroll);
import zh_CN from '../static/js/zh_CN';  //汉化包
import VeeValidate from 'vee-validate';
import Validator from './customValidate.js';
Validator.addLocale(zh_CN); //添加汉化
import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard)
const config = {
  errorBagName: 'errors', // change if property conflicts.
  delay: 0,
  locale: 'zh_CN',
  messages: null,
  strict: true
};
Vue.prototype.$public = Public;
Vue.prototype.$config = myConfig;
Vue.use(VeeValidate, config);
// var layer = require('./js/layer')
// import layer from '../node_modules/vue-layer-mobile/index.js'

// import Mint from 'mint-ui';
// import Vuex from 'vuex';
// import store from './store'

window.Vue = Vue;
// 开启debug模式
// Vue.config.debug = false;

// Vue.use(Mint);
Vue.use(VueRouter);
// Vue.use(VueResource);


import routerOption from './router.js'

const router = new VueRouter(routerOption);
// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。

//图表插件
window.Hub = new Vue();
router.beforeEach(({meta, path}, from, next) => {　　
    $(window).scrollTop(0);//页面切换移至视角移至顶部
    if(!Public.Auth.get()){
        if(!(path.indexOf("/index/")>-1||path.indexOf("invest")>-1)){
          var query = ""
          if(from.query){
            query = "?"
            for(var Key  in from.query){
              query+=Key+"="+from.query[Key]+"&"
            }
          }
          if(from.path=='/index/login'){
            next()
          }else{
            next({ path: '/index/login', query: { "redirect":from.path+query}});
          }
        }else{
            next()
        }
    }else{
        if(path=='/index/login'){
            next({ path: '/home/index'})
        }else{
          next()   // 进行下一个钩子函数
        }
    }
})

/*处理名字*/
Vue.filter('formatName', function (value) {
  if (value && value.length != 0 && value.indexOf('null') == -1) {
    // var len = value.length <= 2 ? value.length : value.length - 1;
    // value = "俞炜鱼鱼"
    var len = value.length;
    var symbol = value.slice(1, len).length;
    var str = "";
    for (var i = 0; i < symbol; i++) {
      str += "*";
    }
    return value.replace(value.slice(1, len), str);
  } else {
    return "未实名";
  }
})
//身份证
Vue.filter('formatIdCart',function(value){
  if(value){
    var length = value.length;
    var temp = "";
    for(var i = 0 ;i<value.length-4;i++){
      temp +="*";
    }
    var last =  value.substr(length - 4, length);
    return temp + last;
  }
})
/*处理手机*/
Vue.filter('formatMobile', function (value) {
  if(!value){
    return "请填写预留手机号";
  }

  if (value && value.length == 11) {
    return value.substr(0, 3) + " **** " + value.substr(7, 11);
  }
})
/*处理金额,保留两位小数*/
Vue.filter('formatMoney', function (value) {
  value=value==null?0:value;
  return Number(Math.abs(value)).toFixed(2);
})
/*处理银行卡*/
Vue.filter('formatBankCard', function (value) {
  if(value){
    var length = value.length - 8;
    var last = value.length - 4;
    var num="";
    for(var i = 0 ;i< length;i++){
      num +="*";
    }
    return value.substr(0, 4) + num + value.substr(last, value.length);
  }
})
// 格式化年月
Vue.filter('formatDate', function (value) {
    var arr = value.split('');
    arr.splice(4,1,'年')
    arr.splice(7,1,'月')

  return arr.join('');
})
// 处理小数，返回整数部分
Vue.filter('formatInteger', function (value) {
  if(!value){
    return false;
  }
  
  var arr = value.split('.');

  return arr[0];
})
// 处理小数，返回小数部分
Vue.filter('formatDecimals', function (value) {
  if(!value){
    return false;
  }
  
  var arr = value.split('.');

  return arr[1] || "00";
})
//预期年化处理
Vue.filter("expectYear", function (value) {
  if (!value) {
    return "0.00";
  }
  return Number(value).toFixed(2);
}); 
//投资记录金额处理
Vue.filter("formatInvest", function (value) {
  return Number(value).toFixed(2);
});
//处理投资金额显示
Vue.filter("formatMillionMoney", function (value) {
  if (value) {
    var val = value * 1;
    if (val < 1000) {
      return val.toFixed(2);
    } else {
      return (val / 10000).toFixed(2) + "万";
    }
  } else {
    return "0.00";
  }
});
//投资记录金额处理
Vue.filter("formatFina", function (value) {
  if (value == "day") {
    return "天";
  } else {
    return "个月";
  }
});
const app = new Vue({
    router: router,
    render: h => h(App)
}).$mount('#app')
