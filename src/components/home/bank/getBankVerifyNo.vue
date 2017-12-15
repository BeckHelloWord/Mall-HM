<!--充值页面获取验证码 hmc-->
<!--* 京东支付第一步-->
<!--* 访问地址：-->
<!--* wd_api/jDPay/doJDReadyPay-->
<!--* 参数：-->
<!--* tradeNo  投资订单号  (可选)-->
<!--* way：第三方通道-->
<!--*          JDH5 ：安卓端京东认证支付-->
<!--*          JDandroid ：安卓端京东认证支付-->
<!--*          JDios ：苹果端京东认证支付-->
<!--* amount：资金-->
<!--* bankNo：银行卡号(可选，与银行卡ID必填一项)-->
<!--* bankId：银行卡ID(可选，与银行卡号必填一项)-->
<!--* realName: 真实姓名  (可选，第一次的时候需要)-->
<!--* idCard ： 身份证号  (可选，第一次的时候需要)-->
<!--* mobile ： 银行预留手机号码-->
<!--* 返回map-->
<!--* orderNo 充值订单号-->
<!--* amount  充值金额-->


<!--* 京东支付第二步-->
<!--* 访问地址：-->
<!--* wd_api/jDPay/doJDPay-->
<!--* 参数：-->
<!--* orderNo： 充值订单号-->
<!--* amount： 资金-->
<!--* mobile： 银行预留手机号码-->
<!--* verifyNo： 验证码-->
<!--* 返回map-->
<!--* orderNo 充值订单号-->
<!--* amount  充值金额-->


<template>
  <div class="recharge-all">
    <div id="phoneDom">
      <form id="phone-form" class="phone-form">
        <mt-field label="预留手机号" v-model="mobile" placeholder="请填写预留手机号" type="text" :attr="{maxlength:11}" v-validate="'required|leftMobile'" data-vv-value-path="innerValue" data-vv-as=" " data-vv-name="mobileTips" :has-error="errors.has('mobileTips')" ></mt-field>
        <span v-show="errors.has('mobileTips')" class="help is-danger">{{ errors.first('mobileTips') }}</span>
        <mt-field label="验证码" v-model="verifyNo" :attr="{maxlength:6}">
          <div class="getVerifyNo" @click="getVerifyNo" :class="grayColor">{{getVerifyNoText}}</div>
        </mt-field>
        <a :class="btnClass" @click="sureRecharge">确认充值</a>
      </form>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { Field,Toast  } from 'mint-ui';
  export default {
    components:{
      mtField:Field,
      Toast
    },
    data: function() {
      return {
        mobile:"",
        verifyNo:"",
        getVerifyNoText:"获取验证码",
        grayColor:"",
        curCount:120,
        btnClass:"gary",
        flag:false
      }
    },
    watch:{
      mobile:function(){
        this.getNo();
      },
      verifyNo:function(){
        this.verifyNoFun();
      }
    },
    methods: {
//        倒计时
      SetRemainTime() {
        if(this.curCount < 120){
          return;
        }
        this.curCount--;
        this.InterValObj = window.setInterval(this.setTime,1000);
      },
      setTime(){
        if (this.curCount == 0) {
          this.curCount = 120;
          this.getVerifyNoText = "获取验证码";
          window.clearInterval(this.InterValObj);
          this.grayColor = "";
        }else {
          this.curCount--;
          this.getVerifyNoText = this.curCount + "s 重新发送";
          this.grayColor = "grayColor";
        }
      },
      //获取验证码
      getVerifyNo(){
        //获取倒计时变成灰色时，不点击
          if(this.grayColor == "grayColor"){
            return
          }
          this.$parent.sendData.mobile = this.mobile;
          this.$public.API_GET({
            url : 'toBankCardJd',
            data: this.$parent.sendData,
            success : (result) => {
              if(!result.isSuccess){
                Toast({
                  message: result.message,
                  position: 'bottom',
                  duration: 2000
                });
                return
              }
            //返回的订单号
              this.$parent.sendData.orderNo = result.data.orderNo;
              this.$parent.sendData.amount = result.data.amount;
              setTimeout(this.SetRemainTime());
              this.flag = true;
            }
          });
      },
//      确认充值
      sureRecharge(){
        if(this.btnClass == "gary"){
          return;
        }

        var toBankCardJdPayData = this.$parent.sendData ;
        toBankCardJdPayData.verifyNo = this.verifyNo;

        this.$public.API_GET({
          url : 'toBankCardJdPay',
          data:toBankCardJdPayData,
          success : (result,request) => {
            if(!result.isSuccess){
              Toast({
                message: result.message,
                position: 'bottom',
                duration: 2000
              });
              return
            }
            //有订单号直接调回投资成功，否则跳入充值成功
            if(this.$route.query.tradeNo){
              this.$router.push({ path: '/invest/paySuccess',query:{tradeNo:this.$route.query.tradeNo} });
            }else{
              var time = new Date(request.getResponseHeader('Date'));
              time = time.getFullYear() + '.' + (time.getMonth() + 1) + '.' + time.getDate() + ' ' + time.toString().split(" ")[4] ;
              window.Hub.recharge={time:time};

              if(result.status && result.status == 200){
                this.$router.push({ path: '/home/bank/rechargeResult',query: {"success":true,"amount":this.$parent.sendData.amount} });
              }else{
                this.$router.push({ path: '/home/bank/rechargeResult',query: {"success":false,"amount":this.$parent.sendData.amount} });
              }
            }
          }
        });
      },
      getNo(){
        if(/^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.mobile)){
          this.grayColor = "redColor"
        }else{
          this.grayColor = "grayColor"
        }
      },
      verifyNoFun(){
        // this.flag是为了点击获取验证之后才走下一步
        if(this.verifyNo.length >= 6 && this.flag){
           this.btnClass = "red";
        }else{
           this.btnClass = "gary";
        }
      }
    },
    mounted: function() {
      window.Hub.$emit('refresh', null);
      window.Hub.$emit('setTitle', "充值", false, null, " ", null);
      window.Hub.$emit('setFooter',false);

      //如果有手机号直接显示
      if(this.$parent.sendData.mobile){
        this.mobile = this.$parent.sendData.mobile;
      }
    },
    destroyed(){
      sessionStorage.removeItem("persion");
    }
  }
</script>

<style lang="scss" scoped="" type="text/css">
  @import "../../../assets/skin";
  .recharge-all{
  .red {@include btn;}
  .gary{@include btn;background:$gary;color:$fontgary;}
  .getVerifyNo{color:$red;}
  .grayColor{color:$fontgary;}
  .is-danger{background: #fff;color:$red;padding-left:10px;margin:0;}
  }
</style>
