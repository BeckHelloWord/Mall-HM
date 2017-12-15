<!--预留手机号 hmc-->

<!--* 修改预留银行手机号码-->
<!--* 接口访问地址：-->
<!--* /wd_api/bankApp/changeBankMobile-->
<!--* 参数：-->
<!--* params.mobile 银行预留手机号-->
<!--* 返回值：-->
<!--* @return 200成功  500异常  返回异常信息-->
<template>
  <div class="recharge-all">
    <form id="bankMobileForm" class="bankMobileForm">
      <mt-field label="预留手机号" placeholder="请填写预留手机号" v-model="myMobile" type="text" :attr="{maxlength:11}" v-validate="'required|leftMobile'" data-vv-value-path="innerValue" data-vv-as=" " data-vv-name="mobileTips" :has-error="errors.has('mobileTips')" ></mt-field>
      <span v-show="errors.has('mobileTips')" class="help is-danger">{{ errors.first('mobileTips') }}</span>
      <pre class="bankInfomsg"> * 为了您能顺利提现，请正确填写您的开户信息</pre>
      <div :class="btnClass" @click="mobileBtn">保存</div>
    </form>
  </div>
</template>



<script type="text/babel">
  import { Field,Toast } from 'mint-ui';
  export default {
    components:{
      mtField:Field
    },
    data() {
      return {
        myMobile:"",
        btnClass:"gary"
      };
    },
    watch:{
      myMobile:function(){
        this.mobileFun();
      }
    },
    methods: {
      mobileBtn(){
        if(this.btnClass == "gary"){
          return;
        }
        var sendData = {mobile:this.myMobile};
        this.$public.API_GET({
          url : 'reBankPhone',
          data:sendData,
          success : (result) => {
            if(!result.isSuccess){
              Toast({
                message: result.message,
                position: 'bottom',
                duration: 2000
              });
              return
            }
            Toast({
              message: '开户信息修改成功',
              position: 'bottom',
              duration: 2000
            });
            history.back();
          }
        });
      },
      mobileFun(){
        if(/^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.myMobile)){
           this.btnClass = "red";
        }else{
           this.btnClass = "gary";
        }
      }
    },
    mounted() {
      window.Hub.$emit('refresh', null);
      window.Hub.$emit('setTitle', "预留手机号", false, null, " ", null);
      window.Hub.$emit('setFooter',false);
		//银行预留手机号
      var addBankMobile = sessionStorage.getItem("addBankMobile");
      if(addBankMobile){
        this.myMobile = addBankMobile;
      }
    },
    destroyed(){
      sessionStorage.removeItem("addBankMobile");
    }
  };
</script>

<style lang="scss" scoped="" type="text/css">
  @import "../../../assets/skin";
  .recharge-all{
  pre{color:$ft-999;font-size: pxToRem(24);margin:20px;}
  .red {@include btn;}
  .gary{@include btn;background:$gary;color:$fontgary;}
  .is-danger{background: $white;color:$red;padding-left:10px;margin:0;}
  }
</style>

