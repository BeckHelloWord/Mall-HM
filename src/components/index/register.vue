<template>
	<div class="register">
		<div class="banner">
			<img src="../../assets/images/login_bg.png" />
			<p class="title">{{$config.info.appName}}</p>
      <i class="iconfontLogin icon-X closed-icon" @click="goBack"></i>
		</div>
		<div class="register-con">
			<div class="tel">
				<div>
					<i class="iconfontLogin icon-shoujihao"></i>
					<input type="tel" placeholder="请输入手机号码" maxlength="11" v-model='tel'>
				</div>
				<p v-show='isNotTel'>*无效的手机号码</p>
				<p v-show='isTelEmpty'>*此处不可空白</p>
				<p v-show='isNotNewUser'>*手机号已被注册</p>
			</div>
			<!-- <div class="password">
			<input type="text" placeholder="输入密码" v-model='password'>
			<p v-show='isPasswordEmpty'>*此处不可空白</p>
			<p v-show='isInvalidPass'>*最少6个字符</p>
		</div> -->
			<div class="verify">
				<i class="iconfontLogin icon-tuxingyanzhengma icon-common"></i>
				<div class="verify-wrap clearfix">
					<div class="left">
						<input type="tel" maxlength="4" v-model="verif" placeholder="图片验证码">
					</div>
					<div class="verify-code">
						<verification :inputValue='verif' @verifyValue='verifyValue'></verification>
					</div>
				</div>
			</div>
			<div class="clearfix verificate">
				<div class="half">
					<i class="iconfontLogin icon-duanxinyanzhengma icon-common"></i>
					<input type="text" placeholder="短信验证码" class="verification" v-model='verification'>
					<input type="button" id="sendVer" @click='sendVerification' value="获取短信验证码">
				</div>
				<p v-show='isVerificationEmpty'>*此处不可空白</p>
			</div>
			<div class="password">
				<div class="password-wrap">
					<i class="iconfontLogin icon-mima icon-common"></i>
					<template v-if="showPasswrod">
						<input type="password" v-model="password" placeholder="请输入登录密码" />
					</template>
					<template v-else>
						<input type="text" v-model="password" placeholder="请输入登录密码" />
					</template>
					<span class="passwrodMode iconfontLogin" @click="clickPassWordMode" v-bind:class="{'icon-biyan':showPasswrod,'icon-yanjing':!showPasswrod}"></span>
				</div>
				<p v-show="isPasswordEmpty">*此处不可空白</p>
				<p v-show="isInvalidPass">*请输入6~16位字母及数字组合的密码</p>
			</div>
			<div class="recommend">
				<p @click="showInvite">点击填写邀请码<span class="arrow" v-bind:class="{'down-arrow':isInvite}"></span></p>
				<div class="invite-wrap" v-bind:class="{ isActive:isInvite }">
					<i class="iconfont icon-home"></i>
					<input type="text" placeholder="可输入 邀请码 或者 推荐人 手机号码" v-model='recommendCode'>
				</div>
			</div>

			<div class="btn" @click='register'>
				注册并登录
			</div>
			<div class="overBtn">
				<p>点击上面“注册并登录”按钮，即表示您同意</p>
				<router-link to='/index/protocol' class="red">《{{$config.info.appName}}注册协议》</router-link>
			</div>
			<!-- <div>
				已经有账号，
				<router-link to='/index/login' class="red">立即登录</router-link>
			</div> -->
		</div>

	</div>
</template>

<script>
// import { MessageBox } from 'mint-ui';
import { Toast } from "mint-ui";
import layer from "../../../static/layer.js";
import verification from "../public/verification";
export default {
  components: {
    verification
  },
  data: function() {
    return {
      tel: "",
      password: "",

      verification: "",
      recommendCode: "",
      agree: true,
      count: 120,
      timer: null,
      isNotTel: false,
      // 改过多少次的标识
      isNotTelCount: 0,
      isTelEmpty: false,

      isInvalidPass: false,
      isPasswordEmpty: false,
      isVerificationEmpty: false,
      isVerificationEmptyCount: 0,
      isNotNewUser: false,
      isInvite: false, //填写邀请码
      showPasswrod: true, //闭眼模式

      // 图片验证码是否正确
      isVerifyRight: false,

      verif: ""
    };
  },
  watch: {
    tel: function(to, from) {
      //只能输入数字
      this.tel = to.replace(/[^0-9]/g, "");

      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      this.isNotTelCount++;
      if (!myreg.test(to)) {
        this.isNotTel = true;
      } else {
        this.isNotTel = false;
      }
      this.isTelEmpty = false;

      if (to.length == 11) {
        this.verifyTel();
      } else {
        this.isNotNewUser = false;
      }
    },
    password: function(to, from) {
      this.isPasswordEmpty = false;
      if (to.length > 5 && to.length < 17) {
        this.isInvalidPass = false;
      } else {
        this.isInvalidPass = true;
      }
    },
    verification: function(to, from) {
      this.isVerificationEmptyCount++;
      if (to) {
        this.isVerificationEmpty = false;
      } else {
        this.isVerificationEmpty = true;
      }
      this.canRegister();
    },

    agree: function(to, from) {
      this.canRegister();
    },
    isNotNewUser: function(to, from) {
      this.canRegister();
    }
  },
  methods: {
    goBack(){
      window.history.go(-1);
    },
    clickPassWordMode() {
      //开眼闭眼切换
      this.showPasswrod = !this.showPasswrod;
    },
    verifyValue(bool) {
      this.isVerifyRight = bool;
      if ($("#sendVer").attr("disabled") == "disabled") {
        return false;
      }
      if (bool) {
        this.sendVerification();
      }
    },
    canRegister() {
      // console.log(this.isNotTel)
      // console.log(this.isTelEmpty)
      // console.log(this.isVerificationEmpty)
      if (
        this.isNotTel == false &&
        this.isTelEmpty == false &&
        this.isNotNewUser == false &&
        this.isVerificationEmpty == false &&
        this.agree
      ) {
        if (this.isNotTelCount == 0 || this.isVerificationEmptyCount == 0) {
          return false;
        }
        $(".btn input")
          .css({ backgroundColor: "", color: "white" })
          .removeAttr("disabled");
      } else {
        $(".btn input")
          .css({ backgroundColor: "#e0e0e0", color: "#c2c2c2" })
          .attr("disabled", "disabled");
      }
    },
    register() {
      // 手机号 密码 验证码 不能有空
      if (!this.tel) {
        this.isTelEmpty = true;
      }
      if (!this.password) {
        this.isPasswordEmpty = true;
      }
      if (!this.verification) {
        this.isVerificationEmpty = true;
      }
      if (!this.tel || !this.verification) {
        return false;
      }
      // 手机为有效
      if (this.isNotTel) {
        return false;
      }
      // 密码为有效的
      if (this.isInvalidPass) {
        return false;
      }
      var data = {
        mobile: this.tel,
        verifyNo: this.verification,
        reqSource: this.$config.appSource,
        password: this.password
      };
      if (this.recommendCode) {
        data.recommendCode = this.recommendCode;
      }
      // console.log(data)
      this.$public.API_GET({
        url: "register",
        data: data,
        success: result => {
          // console.log(result)
          if (result.isSuccess) {
            this.$public.Auth.set(result.data);
            this.successAlert();
            window.setTimeout(this.toIndex, 2000);
          } else {
            // MessageBox('提示', result.message);
            Toast({
              message: result.message,
              position: "bottom",
              duration: 3000
            });
          }
        }
      });
    },
    changeBtn() {
      $('.half input[type="button"]')
        .css({ backgroundColor: "#535553", color: "white" })
        .attr("disabled", "disabled");
      this.timer = setInterval(() => {
        this.count--;
        $('.half input[type="button"]').val(this.count + "秒后可重发");
        if (this.count <= 0) {
          $('.half input[type="button"]')
            .css({ backgroundColor: "", color: "" })
            .removeAttr("disabled");
          $('.half input[type="button"]').val("发送验证码");
          this.count = 120;
          clearInterval(this.timer);
        }
      }, 1000);
    },
    toIndex() {
      this.$router.push("/index/index");
    },
    successAlert() {
      layer.dialog({
        // title: ['这是标题', 'background:red;'], // 第一个是标题内容  第二个是标题栏的style(可以为空)
        content:
          "<div class='regSuccess'><div class='regSuccessIcon'>终于等到你，恭喜注册成功</div></div>",
        contentClass: "voucherList",
        // btn: ['确定'],
        time: 2000,
        bindFun: () => {}
      });
    },
    verifyTel() {
      this.$public.API_GET({
        url: "checkRegisterMobile",
        data: {
          mobile: this.tel
        },
        success: result => {
          // console.log(result)
          if (!result.isSuccess) {
            this.isNotNewUser = true;
            Toast({
              message: result.message,
              position: "bottom",
              duration: 3000
            });
          }
        }
      });
    },
    sendVerification() {
      if (!this.tel) {
        // MessageBox('提示', '请先输入手机号');
        Toast({
          message: "请先输入手机号",
          position: "bottom",
          duration: 3000
        });
        return false;
      }
      if (this.isNotTel) {
        // MessageBox('提示', '请输入有效手机号');
        Toast({
          message: "请输入有效手机号",
          position: "bottom",
          duration: 3000
        });
        return false;
      }
      if (this.isNotNewUser) {
        // MessageBox('提示', '请输入有效手机号');
        Toast({
          message: "该手机号码已被绑定，请更换手机号码",
          position: "bottom",
          duration: 3000
        });
        return false;
      }

      if (!this.isVerifyRight) {
        // MessageBox('提示', '请输入有效手机号');
        Toast({
          message: "请输入正确图片验证码",
          position: "bottom",
          duration: 3000
        });
        return false;
      }

      this.$public.API_GET({
        url: "sendVerifyForLogin",
        data: {
          mobile: this.tel,
          reqSource: this.$config.appSource
        },
        success: result => {
          // console.log(result)
          if (!result.isSuccess) {
            // MessageBox('提示', result.message);
            Toast({
              message: result.message,
              position: "bottom",
              duration: 3000
            });
          } else {
            if (result.data.isNewUser) {
              this.changeBtn();
            } else {
              this.isNotNewUser = true;
              // MessageBox('提示', '手机已被注册');
              Toast({
                message: "手机已被注册",
                position: "bottom",
                duration: 3000
              });
            }
          }
        }
      });
    },
    showInvite() {
      this.isInvite = !this.isInvite;
    }
  },
  mounted() {
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "注册", false, null, " ", null);
    window.Hub.$emit("setFooter", false);
    window.Hub.$emit("hideHeader");
    this.recommendCode = this.$route.query.recommendCode
      ? this.$route.query.recommendCode
      : "";
    $("body").css("background", "white");
    $(".btn input")
      .css("backgroundColor", "#e0e0e0")
      .attr("disabled", "disabled");
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    if (to.path != "/index/login" && to.path != "/index/protocol") {
      $("body").css("background", "#edf0f3");
    }
    next();
  }
};
</script>

<style lang="scss" type="text/css" scoped="">
@import "../../assets/skin";
.register {
  min-height: 100%;
  background: $white;
  .banner {
    position: relative;
    font-size: pxToRem(42);
    color: $white;
    img {
      width: 100%;
    }
    .title {
      position: absolute;
      top: 50%;
      left: 50%;
      letter-spacing: 10px;
      transform: translate(-50%, -50%);
    }
  }
  .register-con {
    padding: pxToRem(35) pxToRem(30);
    font-size: pxToRem(28);
    & > div:not(:last-child) {
      margin-bottom: pxToRem(14*2);
    }
    p {
      color: $red;
    }
  }
  .banner {
    position: relative;
  }

  .tel {
    div {
      position: relative;
      padding-left: pxToRem(40*2);
      padding-bottom: 1px;
      i {
        position: absolute;
        top: 50%;
        left: pxToRem(3);
        padding: 0 pxToRem(10);
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        font-size: pxToRem(46);
        color: $red;
      }
    }
    p {
      padding-left: pxToRem(40*2);
    }
  }
  .recommend {
    color: $red;
    .invite-wrap {
      position: relative;
      display: none;
      padding-left: pxToRem(40*2);
      input[type="text"] {
        border-bottom: pxToRem(1*2) solid #d3d3d3;
      }
    }
    .isActive {
      display: block;
    }
    .arrow{
      display: inline-block;
      position: relative;
      top:pxToRem(10);
      width:pxToRem(20);
      padding-top:pxToRem(20);
      margin-left:pxToRem(20);
      border:2px solid $red;
      border-left:none;
      border-bottom:none;
      transform:translateY(0%) rotate(-45deg);
    }
    .down-arrow{
      top:pxToRem(0);
      transform: rotate(135deg);
    }
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
      border: none;
      // padding-left:      pxToRem(40*2);
      // background: url(../../assets/images/user_icon.png) no-repeat    pxToRem( 8*2) center;
      // background-size:     pxToRem(21*2)     pxToRem(24*2);
    }
  }
  input {
    height: pxToRem(36*2);
    outline: none;
    border: none;
    padding-left: pxToRem(20);
    border-bottom: pxToRem(1*2) solid #d3d3d3;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    width: 100%;
    &[type="checkbox"] {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: pxToRem(16*2);
      height: pxToRem(16*2);
      float: left;
      margin-right: pxToRem(5*2);
      padding: 0;
      // margin-top: pxToRem( 4);
    }
  }
  .overBtn {
    margin-bottom: 0;
    margin-top: pxToRem(15*2);
    position: relative;
    font-size: pxToRem(24);
    color: $ft-c6c6c6;
    text-align: center;
    p {
      line-height: 2;
      color: $ft-c6c6c6;
    }
  }
  .btn {
    border-radius: pxToRem(40);
  }
  .red {
    color: $red;
  }
  span.red {
    font-size: pxToRem(24);
  }
  .underline {
    text-decoration: underline;
  }
  .half {
    [type="button"] {
      position: absolute;
      top: 50%;
      right: 0;
      width: pxToRem(210);
      height: pxToRem(44);
      line-height: pxToRem(44);
	  border-radius: pxToRem(22);
	  font-size:pxToRem(24);
	  padding-left:0;
      color: $white;
      background: $red;
      transform: translateY(-50%);
    }
  }
  .verify {
    position: relative;
    height: pxToRem(72);
    padding-left: pxToRem(40*2);

    .left {
      position: relative;
      width: 100%;
    }
    .verify-code {
      width: 120px;
      position: absolute;
      top: 45%;
      right: 0;
    }
  }
  .verificate {
    position: relative;

    margin-bottom: pxToRem(20);
    .half {
      position: relative;
      padding-left: pxToRem(80);
    }
    p {
      padding-left: pxToRem(80);
    }
  }
  .password {
    .password-wrap {
      position: relative;
      padding-left: pxToRem(80);
    }
    .passwrodMode {
      position: absolute;
      top: 50%;
      right: 0;
      font-size: pxToRem(24);
      color: $red;
      transform: translateY(-50%);
    }
    & > p {
      padding-left: pxToRem(80);
    }
  }
  .icon-common {
    position: absolute;
    top: 50%;
    left: pxToRem(3);
    padding: 0 pxToRem(10);
    transform: translateY(-50%);
    font-size: pxToRem(46);
    color: $red;
  }
  .closed-icon{
    position: absolute;
    top:5%;
    left:5%;
  }
}
</style>