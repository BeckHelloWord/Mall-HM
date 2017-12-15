<!--银行卡列表 hmc-->
<!--* 获取银行卡限额接口-->
<!--* 地址：-->
<!--* /wd_api/recharge/getBankList-->
<!--* 参数：-->
<!--* params.channel 充值渠道：yibao lianlian jdapi-->
<!--* 返回值：-->
<!--* List-->
<!--* bankName 名称-->
<!--* onceMoney 单笔限额-->
<!--* dayMoney 单日限额-->
<!--* phone  电话号码-->
<!--* imageUrl 图片-->
<!--* content   备注-->
<!--* @return 200成功  500异常  返回异常信息-->
<template>
  <div class="select-bank" id="select-bank">
    <p class="tips">支付额度会根据银行规定适时调整，仅供参考</p>
    <div class="clearfix bankList"  v-for="item in bankListData" @click="bankChange(item.bankName)" >
      <div class="bankLogo fl"><img :src='"../../assets/images/bankLogo/bank_select_icon_"+ item.bankCode +".png"'></div>
      <div class="bankInfo">
        <h2>{{item.bankName}}</h2>
        <p>单笔{{item.onceMoney}}.00元,单日{{item.dayMoney}}.00元</p>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    data: function() {
      return {
        bankListData:[],
        flag:false
      }
    },
    methods: {
      bankChange(e){
        if(this.flag){
          return;
        }
        window.Hub.$emit('bankName', e);
      },
      bankList(){
        this.$public.API_GET({
          url : 'bankList',
          data:{},
          success : (result) => {
            if(!result.isSuccess){
              Toast({
                message: result.message,
                position: 'bottom',
                duration: 2000
              });
              return
            }
            this.bankListData = result.data;
          }
        });
      },/*moduleList接口*/
    },
    mounted: function() {
      this.bankList();

      if(this.$router.history.current.path == "/home/bank/bankCard"){
        this.flag = true;
      }
    }
  }
</script>

<style lang="scss" scoped="" type="text/css">
  @import "../../assets/skin";
  .bankLogo img {width: $img;}
  .tips {color:$red;font-size: pxToRem(22);min-height: pxToRem(58);line-height: pxToRem(58);padding-left:10px;background: $background;}

  .bankList {
    max-height: pxToRem(120);
    border-bottom: 1px solid $ft-dedede;
    background: $white;

    .bankLogo {width: 10%;padding: 6px 10px 0;}
    .bankInfo {
      padding: 9px 0;
      h2 {font-size: pxToRem(30);color:$ft-666;font-weight: normal;}
      p {font-size: pxToRem(24);color: $fontgary;}
    }
  }
</style>
