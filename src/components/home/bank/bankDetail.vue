<!--银行卡详情-->
<!--* 提现操作的时候获取银行卡信息-->
<!--* 接口访问地址：-->
<!--* wd_api/recharge/doWithdrawGetBank-->
<!--* 接口输入参数：-->
<!--* 无-->
<!--* 接口返回参数：-->
<!--* String bankId：银行卡ID-->
<!--* String bankName：银行名称-->
<!--* String bankAccount：银行卡账户-->
<!--* String bankSubName: 开户支行-->
<!--* String bankProvince : 开户省份-->
<!--* String bankCity : 开户城市-->
<!--* String bankMobile : 开户电话-->
<!--* String realName ：真实姓名-->
<!--* String idCard ： 身份证号-->

<template>
  <div class="recharge-all">
    <div id="module-list" class="module-list">
      <div class="page-part noBd3">
        <mt-cell title="持卡人" :value="bankDetailData.realName | formatName"></mt-cell>
        <mt-cell title="身份证" :value="bankDetailData.idCard | formatIdCart"></mt-cell>
      </div>
      <div class="page-part page-part02 noBd3">
        <mt-cell title="所属银行" :value="bankDetailData.bankName"></mt-cell>
        <mt-cell title="银行卡号" :value="bankDetailData.bankAccount | formatBankCard"></mt-cell>
        <mt-cell title="开户城市" :value="bankDetailData.bankProvince + ' ' + bankDetailData.bankCity" is-link :to="{ path: '/home/bank/bankInfo'}"  :class="bankProvinceTest"></mt-cell>
        <mt-cell title="开户支行" :value="bankDetailData.bankSubName" is-link :to="{ path: '/home/bank/bankInfo'}" :class="bankSubNameTest"></mt-cell>
        <mt-cell title="预留手机号" :value="bankDetailData.bankMobile | formatMobile" is-link  to="/home/bank/bankPhone" :class="bankMobileTest"></mt-cell>
      </div>
      <p class="module-list-p"> * 为了您能顺利提现，请正确填写您的开户信息</p>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { Cell ,Toast } from 'mint-ui';
  export default {
    components:{
        mtCell:Cell,
      Toast
    },
    data: function() {
      return {
        bankDetailData:{
          idCard: "",bankAccount:"",realName:""
        },
        bankProvinceTest:false,
        bankSubNameTest:false,
        bankMobileTest:false,
      }
    },
    methods: {
      bankDetail(){
        this.$public.API_GET({
          url : 'bankDetail',
          success : (result) => {
            if(!result.isSuccess){
          Toast({
            message: result.message,
            position: 'bottom',
            duration: 2000
          });
          return
        }
          this.bankDetailData = result.data;
          //没有开户城市，显示请选择开户城市
          if(!result.data.bankCity || !result.data.bankProvince){
            result.data.bankCity = "请选择开户城市";
            result.data.bankProvince =" ";
            this.bankProvinceTest = "off";
          }else{
            this.bankProvinceTest = "";
          }
          //没有开户支行，显示请选择开户支行
          if(!result.data.bankSubName){
            result.data.bankSubName = "请填写开户支行";
            this.bankSubNameTest = "off";
          }else{
            this.bankSubNameTest = "";
          }
          //没有预留手机号，显示请填写预留手机号
          if(!result.data.bankMobile){
            this.bankMobileTest = "off";
          }else{
            this.bankMobileTest = "";
          }


		      //带参到开户信息页面
          if(result.data.bankProvince){
            sessionStorage.setItem("addBankProvince",result.data.bankProvince);
          }
          if(result.data.bankCity){
            sessionStorage.setItem("addBankCity",result.data.bankCity);
          }
          if(result.data.bankSubName){
            sessionStorage.setItem("addBankSubName",result.data.bankSubName);
          }
			//银行预留手机号
          if(result.data.bankMobile){
            sessionStorage.setItem("addBankMobile",result.data.bankMobile);
          }
      }
      });
      }/*moduleList接口*/
    },
    mounted: function() {
      window.Hub.$emit('refresh', null);
      window.Hub.$emit('setTitle', "银行卡详情", false, null, " ", null);
      window.Hub.$emit('setFooter',false);
      this.bankDetail();
    }
  }
</script>
<style lang="scss" scoped="" type="text/css">
  @import "../../../assets/skin";
  .recharge-all{
    .module-list-p {
      padding: 10px;
      font-size: pxToRem(24);
    }
    .page-part{margin-top:pxToRem(20)}
  }
</style>

