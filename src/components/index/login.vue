<template>
	<div class="login">
		<div class="topBg">
			<div class="title">{{$config.info.appName}}</div>
			<div class="title-close" @click="closePage"><i class="iconfontLogin icon-X"></i></div>
			<img src="../../assets/images/login_bg.png" alt="" width="100%">
		</div>
		<div class="userName">
			<div>
				<i class="iconfontLogin icon-shoujihao"></i>
				<input type="text" placeholder="请输入用户名/认证手机号" v-model='username' @keyup='showDel_name()'>
			</div>
			<div class="del" v-show='del_username' @click='delUsername'></div>
			<p v-show='bool_username'>*此处不可空白</p>
			<p v-show='bool_message'> {{'*'+message_username}}</p>
		</div>
		<div class="password">
			<div>
				<i class="iconfontLogin icon-mima"></i>
				<input type="password" placeholder="请输入密码" v-model='password' @keyup='showDel_pass()'>
			</div>
			<div class="del" v-show='del_password' @click='delPassword'></div>
			<div :class="{showPassword:true,closePassword:closePassword}" v-show='del_password' @click='showPassword'></div>
			<p v-show='bool_password'>*此处不可空白</p>
			<p v-show='bool_password_length'>*最少6个字符</p>
			<p v-show='bool_nameOrpassword_error'>*账号或密码错误</p>
		</div>
		<p class="forgetLink">
			<router-link to='/index/forget'>忘记密码?</router-link>
		</p>
		<div class="loginBtn">
			<input class="btn" type="button" value="登录" @click='login'>
		</div>
		<div class="other clearfix">
			<router-link to='/index/register'>注册领红包></router-link>

		</div>
		<div class="weixin" v-show='isWeiXin' @click='loginByWeixin'>
			<div class="contain">
				<img src="../../assets/images/wx_login.png" alt="">
				<span>{{weixinLogin}}</span>
			</div>
		</div>
	</div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data: function() {
    return {
      username: "",
      password: "",

      message_username: "",
      bool_message: false,
      bool_username: false,
      bool_password: false,
      bool_password_length: false,
      bool_nameOrpassword_error: false,
      del_username: false,
      del_password: false,
      isCheck: false,
      isWeiXin: true,
      weixinLogin: "微信登录",

      closePassword: false
    };
  },
  watch: {
    isCheck(to, from) {
      if (to) {
        this.saveUsername();
      } else {
        this.removeUsername();
      }
    }
  },
  methods: {
    showPassword() {
      this.closePassword = !this.closePassword;
      if (!this.closePassword) {
        $(".password>div:first-child input").attr("type", "password");
      } else {
        $(".password>div:first-child input").attr("type", "text");
      }
    },
    loginByWeixin() {
      /*微信登录*/

      var url = encodeURIComponent("/index");

      //线上地址
      var wx_url =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbfd7c3d589090b70&redirect_uri=http%3A%2F%2Fm.bxjr.com%2Flogin%2Findex.html?redirect=" +
        url +
        "&response_type=code&scope=snsapi_userinfo&state=wechat";
      //本地测试地址
      //                wx_url="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx524534af04a5662c&redirect_uri=http%3A%2F%2Fhzh.test.bawsun.com%2Flogin%2Findex.html?redirect="+url+"&response_type=code&scope=snsapi_userinfo&state=wechat";
      this.weixinLogin = "正在登录";

      clearTimeout(timer);
      var timer = setTimeout(function() {
        location.href = wx_url;
      }, 1000);
	},
	closePage(){
		history.back()
	},
    is_weixin() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        // return true;
        //
        // 一直关闭
        return false;
      } else {
        return false;  
      }
    },
    saveUsername(timeout) {
      // 保存用户名 7天
      timeout = timeout || 7;
      var d = new Date();
      d.setTime(d.getTime() + 3600 * 24 * 1000 * timeout);
      // console.log(d)
      document.cookie = "username =" + this.username + ";expires=" + d;
    },
    getUsername() {
      var arr = document.cookie.split("; ");
      for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split("=");
        if (arr2[0] == "username") {
          return arr2[1];
          // console.log(arr2[1]);
        }
      }
      return "";
    },
    removeUsername() {
      this.saveUsername(-1);
    },
    showDel_name() {
      if (this.username) {
        this.del_username = true;
        this.bool_username = false;
        this.bool_message = false;
      } else {
        this.del_username = false;
      }
    },
    showDel_pass() {
      // console.log(this.password)
      if (this.password) {
        this.del_password = true;
        this.bool_password = false;
        this.bool_password_length = false;
      } else {
        this.del_password = false;
      }
    },
    delUsername() {
      this.username = "";
      this.showDel_name();
    },
    delPassword() {
      this.password = "";
      this.showDel_pass();
    },
    login() {
      // console.log(this.username)
      // console.log(this.password)

      // 判断是否为空
      if (this.username == "") {
        this.bool_username = true;
        return false;
      }
      if (this.password == "") {
        this.bool_password = true;
        return false;
      } else if (this.password.length < 6) {
        this.bool_password_length = true;

        return false;
      }

      this.$public.API_GET({
        url: "loginOn",
        data: { username: this.username, password: this.password },
        success: result => {
          // console.log(result)
          if (result.message == "账号不存在") {
            this.message_username = result.message;
            this.bool_message = true;
          } else if (result.message != "") {
            this.message_username = result.message;
            this.bool_nameOrpassword_error = true;
          }

          if (result.isSuccess) {
            this.$public.Auth.set(result.data);
            if (this.$route.query && this.$route.query.redirect) {
              this.$router.push(this.$route.query.redirect);
            } else {
              this.$router.push("/index/index");
            }
          } else {
            // alert(result.message);
            // Toast(result.message);
            Toast({
              message: result.message,
              position: "bottom",
              duration: 3000
            });
          }
        }
      });
    }
  },
  mounted: function() {
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "登录", false, null, " ", null);
    window.Hub.$emit("setFooter", false);
    window.Hub.$emit("hideHeader");
    // 获取用户名

    this.username = this.getUsername();

    this.showDel_name();
    this.showDel_pass();

    // 判断是否微信
    this.isWeiXin = this.is_weixin();

    $("body").css("background", "white");
  },
  beforeRouteLeave(to, from, next) {
    // console.log(to.path)
    if (to.path != "/index/register" && to.path != "/index/forget") {
      $("body").removeAttr("style");
    }
    next();
  }
};
</script>
<style lang="scss" type="text/css" scoped="">
@import "../../assets/skin";

.login {
  height: 100%;
  background: white;

  .topBg {
    position: relative;
	padding-bottom: pxToRem(50);
	.title{
		position: absolute;
		margin-top: 20%;
		text-align: center;
		width: 100%;
		font-size: pxToRem(44);
		color: white;
	}
	.title-close{
		position: absolute;
		padding: 5%;
		text-align: left;
		width: 100%;
		font-size: pxToRem(36);
		color: white;
	}
  }
  p {
    color: $red;
    font-size: pxToRem(24);
  }
  input {
    border: none;
    outline: none;
    font-size: pxToRem(28);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    // width:100%;
    &[type="checkbox"] {
      width: pxToRem(16*2);
      height: pxToRem(16*2);
      float: left;
      margin-right: pxToRem(5*2);
      padding: 0;
      margin-top: pxToRem(9*2);
    }
  }
  .userName {
    padding: 0 pxToRem(30);
    & > div:first-child {
      padding-left: pxToRem(40*2);
      position: relative;
      i {
        position: absolute;
        top: 50%;
        left: pxToRem(3);
        // margin-left:pxToRem( -40*2);
        padding: 0 pxToRem(10);
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);

        font-size: pxToRem(46);
        color: $red;
      }
      input {
        border-bottom: pxToRem(1*2) solid #d3d3d3;
        width: 100%;

        padding: pxToRem(9*2) pxToRem(40) pxToRem(9*2) pxToRem(9*2);
      }
    }
  }
  .password {
    padding: 0 pxToRem(30);
    position: relative;
    & > div:first-child {
      padding-left: pxToRem(40*2);
      position: relative;
      i {
        position: absolute;
        top: 50%;
        left: pxToRem(3);
        // margin-left:pxToRem( -40*2);
        padding: 0 pxToRem(10);
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);

        font-size: pxToRem(46);
        color: $red;
      }
      input {
        border-bottom: pxToRem(1*2) solid #d3d3d3;
        width: 100%;

        padding: pxToRem(9*2) pxToRem(100) pxToRem(9*2) pxToRem(9*2);
      }
    }
    .showPassword {
      position: absolute;
      top: 0;
      right: pxToRem(60);
      width: 10%;
      height: pxToRem(36*2);
      background: url(../../assets/images/close.png) no-repeat center;
      background-size: pxToRem(38) pxToRem(20);
    }
    .closePassword {
      background: url(../../assets/images/open.png) no-repeat center !important;
      background-size: pxToRem(36) pxToRem(26) !important;
    }
  }
  .forgetLink {
    text-align: right;
    padding: 0 pxToRem(30);
    color: #616b75;
  }
  .del {
    display: block;

    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

    width: 10%;
    height: pxToRem(36*2);
    text-align: center;
    top: 0;
    right: 0;
    position: absolute;
    z-index: 100;
    cursor: pointer;

    background: url(../../assets/images/del.jpg) no-repeat center;
  }
  .userName,
  .password {
    position: relative;
    margin-bottom: pxToRem(14*2);
  }

  .remember {
    label {
      display: block;
      overflow: hidden;
      line-height: pxToRem(36*2);
      font-size: pxToRem(16*2);
      color: #666;
    }
  }
  .loginBtn {
    padding: 0 pxToRem(30);
    margin-top: pxToRem(60);
    input[type="button"] {
      @include btn;
      padding: 0;
      width: 100%;
      border-radius: pxToRem(40);
    }
  }
  .other {
    padding: 0 pxToRem(30);
    margin-top: pxToRem(20);
    text-align: center;
    a {
      color: #c6c6c6;
      font-size: pxToRem(24);
    }
  }
  .weixin {
    position: relative;
    width: pxToRem(86*2);
    height: pxToRem(86*2);
    margin: 0 auto;
    box-sizing: border-box;
    border-radius: 50%;
    padding: pxToRem(5*2);
    // line-heightpxToRem(:130*2);
    text-align: center;
    border: pxToRem(1*2) solid #ddd;
    // background:url(../../assets/images/wx_login.png) no-repeat center 15%;
    // background-size:70%;

    img {
      width: 70%;
      display: block;
      margin: 0 auto;
    }
    .contain {
      background: white;
      border-radius: 50%;
    }
  }
}
</style>