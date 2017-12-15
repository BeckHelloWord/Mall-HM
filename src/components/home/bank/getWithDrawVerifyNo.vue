<!--提现页面获取验证码 hmc-->
<!--* 获取验证码接口-->
<!--*-->
<!--h3. * 接口名称：-->
<!--&gt; > 获取验证码接口-->
<!--h3. * 接口访问地址：-->
<!--&gt; > wd_api/userCenter/sendVerifyOn-->
<!--h3. * 接口输入参数：-->
<!--&gt; > mobile：手机号-->
<!--&gt; > type：验证码类型（暂时没用）-->
<!--&gt; > operate：中文信息，用于显示在短信上						通过想念金融手机客户端进行提现操作"-->
<!--&gt; > voice  是否需要语音  true 需要  false 不需要 或者不传也是不需要-->
<!--&gt; > > 例如：您正在${action}，本次的动态验证码为。。。-->
<!--h3. * 接口返回参数：-->
<!--&gt; > 返回类型：APIResponse-->
<!--&gt; > > int size：每页显示的记录条数-->
<!--&gt; > > int page：当前多少页-->
<!--&gt; > > long totalCount：总记录条数-->
<!--&gt; > > Object data：List数据对象-->
<!--&gt; > > > 无数据-->
<!--&gt; > > int status：状态码(200：正常，401：验证失败，500：系统异常)-->
<!--&gt; > > String message：需要返回的提示信息-->
<!--&gt; > > boolean isSuccess：接口处理是否成功-->

<!--* 提现操作-->
<!--* 接口访问地址：-->
<!--* wd_api/recharge/doWithdraw-->
<!--* 接口输入参数：-->
<!--* params amount 金额-->
<!--* params outPassword 交易密码-->
<!--* params verifyNo 校验码-->
<!--* 接口返回参数：-->
<!--* @return 200 成功-->



<template>
  <div class="recharge-all">
    <div id="phoneDom">
      <form id="phone-form" class="phone-form">
        <mt-field label="手机号" v-model="sendData.mobile" placeholder="请填写手机号" type="text" readonly="readonly"></mt-field>
        <mt-field label="验证码" v-model="verifyNo" :attr="{maxlength:6}">
          <div class="getVerifyNo" @click="getVerifyNo" :class="grayColor" >{{getVerifyNoText}}</div>
        </mt-field>
        <a :class="btnClass" @click="doWithdraw">确认提现</a>
      </form>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { Field,Toast } from 'mint-ui';
  export default {
    components:{
      mtField:Field,
      Toast
    },
    data: function() {
      return {
        verifyNo:"",
        getVerifyNoText:"获取验证码",
        grayColor:"",
        curCount:120,
        btnClass:"gary",
        sendData:{
          mobile:"",
          operate:"通过"+this.$config.info.appName+"手机进行提现操作",
          reqSource:this.$config.appSource,
        },
        flag:false
      }
    },
    watch:{
      "sendData.mobile":function(){
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
//      获取验证码
      getVerifyNo(){
        if(this.grayColor == "grayColor"){
          return
        }
          this.$public.API_GET({
            url : 'sendVerifyOn',
            data: this.sendData,
            success : (result) => {
              if(!result.isSuccess){
                Toast({
                  message: result.message,
                  position: 'bottom',
                  duration: 2000
                });
                return
              }
            setTimeout(this.SetRemainTime());
            this.flag = true;
            }
          });
      },
//      确认提现
      doWithdraw(){
        if(this.btnClass == "gary"){
          return;
        }
        var doWithdrawData = {amount:this.$parent.amount,outPassword:this.$parent.password,verifyNo:this.verifyNo};
        this.$public.API_GET({
          url : 'doWithdraw',
          data:doWithdrawData ,
          success : (result,request) => {
            if(!result.isSuccess){
              Toast({
                message: result.message,
                position: 'bottom',
                duration: 2000
              });
              return
            }
            var time = new Date(request.getResponseHeader('Date'));
            time = time.getFullYear() + '.' + (time.getMonth() + 1) + '.' + time.getDate() + ' ' + time.toString().split(" ")[4] ;
            window.Hub.withDraw={time:time};

            if(result.status && result.status == 200){
              this.$router.push({ path: '/home/bank/withDrawResult',query: {"success":true,"amount":this.$parent.amount}});
            }else{
              this.$router.push({ path: '/home/bank/withDrawResult',query: {"success":false,"amount":this.$parent.amount}});
            }
          }
        });
      },
      getNo(){
        if(/^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.sendData.mobile)){
          this.grayColor = "redColor"
        }else{
          this.grayColor = "grayColor"
        }
      },
      verifyNoFun(){
        if(this.verifyNo.length >= 6 && this.flag){
           this.btnClass = "red";
        }else{
           this.btnClass = "gary";
        }
      }
    },
    mounted: function() {
      window.Hub.$emit('refresh', null);
      window.Hub.$emit('setTitle', "提现", false, null, " ", null);
      window.Hub.$emit('setFooter',false);
      //如果有手机号直接显示
      var myInfo = sessionStorage['info'] && JSON.parse(sessionStorage['info']);
      if(myInfo && myInfo.memberMobile){
        this.sendData.mobile = myInfo.memberMobile;
      }else{
        this.sendData.mobile = "";
      }
    },
    destroyed(){
      sessionStorage.removeItem("info");
    }
  }
</script>

<style lang="scss" scoped="" type="text/css">
  @import "../../../assets/skin";
  .recharge-all{
  .red {@include btn;}
  .gary{@include btn;background:$gary;color:$fontgary;}
  .getVerifyNo{color:$red;}
  .grayColor{color:$graycolor;}
  .is-danger{background: #fff;color:$red;padding-left:10px;margin:0;}
  }
</style>
