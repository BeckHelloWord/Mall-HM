<!--添加银行卡获取验证码 hmc-->
<!--//  提现绑定银行卡短信验证码-->
<!--#define API_URI_BINGBANKON-->
<!--@"wd_api/userCenter/bingBankOn"-->

<template>
  <div class="recharge-all">
    <div id="phoneDom">
      <form id="phone-form" class="phone-form">
        <mt-field label="手机号" v-model="mobile" placeholder="请填写手机号" type="text" :attr="{maxlength:11}" v-validate="'required|leftMobile'" data-vv-value-path="innerValue" data-vv-as=" " data-vv-name="mobileTips" :has-error="errors.has('mobileTips')" ></mt-field>
        <span v-show="errors.has('mobileTips')" class="help is-danger">{{ errors.first('mobileTips') }}</span>
        <mt-field label="验证码" v-model="verifyNo" :attr="{maxlength:6}">
          <div class="getVerifyNo" @click="bingBankOn" :class="grayColor">{{getVerifyNoText}}</div>
        </mt-field>
        <a class="phone-form-btn" @click="saveBank">确认</a>
      </form>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { Field,Toast} from 'mint-ui';
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
      bingBankOn(){
        if(this.grayColor == "grayColor"){
          return
        }
        var bingBankOnData = {mobile:this.mobile};
          this.$public.API_GET({
            url : 'bingBankOn',
            data: bingBankOnData,
            success : (result) => {
              if(!result.isSuccess){
                Toast({
                  message: result.message,
                  position: 'bottom',
                  duration: 2000
                });
                return
              }
              this.verifyNo = result.data.verifyNo
              setTimeout(this.SetRemainTime());
            }
          });
      },
//      确认提现
      saveBank(){
        var saveBankData = {realName:this.$parent.realName,idCard:this.$parent.idCard,bankAccount:this.$parent.bankAccount,bankName:this.$parent.bankName,bankSubName:this.$parent.bankSubName,province:this.$parent.addressProvince,city:this.$parent.addressCity,mobile:this.mobile,verifyNo:this.verifyNo};
        this.$public.API_GET({
          url : 'saveBank',
          data:saveBankData,
          success : (result) => {
            if(!result.isSuccess){
              Toast({
                message: result.message,
                position: 'bottom',
                duration: 2000
              });
              return
            }
            this.$router.push({ path: '/home/bank/withdraw' });
          }
        });},
    },
    mounted: function() {
      window.Hub.$emit('refresh', null);
      window.Hub.$emit('setTitle', "添加银行卡", false, null, " ", null);
      window.Hub.$emit('setFooter',false);
      this.mobile = this.$parent.mobile;
    }
  }
</script>

<style lang="scss" scoped="" type="text/css">
  @import "../../../assets/skin";
  .recharge-all{
  .phone-form-btn {@include btn;}
  .getVerifyNo{color:$red;}
  .grayColor{color:$fontgary;}
  .is-danger{background: #fff;color:$red;padding-left:10px;margin:0;}
  }
</style>
