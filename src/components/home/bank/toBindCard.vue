<!--未实名未绑卡（已实名未绑卡）页面 hmc-->

<!--* 根据新银行卡号获取支付渠道-->
<!--* 访问地址：-->
<!--* wd_api/appPay/getNewPayChannelCode-->
<!--* 参数：-->
<!--* bankAccount 银行卡号-->
<!--* realName: 真实姓名  (可选，传了之后就校验)-->
<!--* idCard ： 身份证号  (可选，传了之后就校验)-->
<!--* 返回map-->
<!--* channelCode ：jdapi 京东支付  llweb 连连支付-->


<!--/**-->
<!--* 获取银行卡限额接口-->
<!--* 地址：-->
<!--* /wd_api/recharge/getBankName-->
<!--* 参数：-->
<!--* params.bankAccount 银行卡号-->
<!--* 返回值：-->
<!--* bankName 名称-->
<!--* @return 200成功  500异常  返回异常信息-->
<!--*/-->

<template>
  <div class="recharge-all">
    <div class="recharge" id="recharge">
      <form class="recharge-form">
        <div class="page-part page-part01 noBd3">
          <div v-if="amountReadOnly" @input="keyFun" onkeyPress="var keyCode = event.keyCode;if ((keyCode >= 48 && keyCode <= 57) || keyCode == 46){event.returnValue = true;}else {event.returnValue = false;}">
            <mt-field label="充值金额" placeholder="最低充值100.00元" v-model="sendData.amount" :readonly="amountReadOnly"></mt-field>
          </div>
          <div v-else @input="keyFun" onkeyPress="var keyCode = event.keyCode;if ((keyCode >= 48 && keyCode <= 57) || keyCode == 46){event.returnValue = true;}else {event.returnValue = false;}">
            <mt-field label="充值金额" placeholder="最低充值100.00元" id="testAmount" v-model="sendData.amount" v-validate="'required|amount'" data-vv-value-path="innerValue" data-vv-as=" " data-vv-name="amountTips" :has-error="errors.has('amountTips')"></mt-field>
            <span v-show="errors.has('amountTips')" class="help is-danger">{{ errors.first('amountTips') }}</span>
          </div>
        </div>
        <div class="page-part page-part02">
          <div v-if="realNameReadOnly" class="noBd">
            <mt-field label="持卡人" placeholder="请输入持卡人姓名" v-model="sendData.realName" style="display: none;"></mt-field>
            <a class="mint-cell mint-field">
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title"><span class="mint-cell-text">持卡人</span></div>
                <div class="mint-cell-value">{{sendData.realName | formatName}}</div>
              </div>
            </a>
          </div>
          <div v-else class="noBd3 noBd2">
            <mt-field label="持卡人" placeholder="请输入持卡人姓名" v-model="sendData.realName" v-validate="'required|name'" data-vv-value-path="innerValue" data-vv-as=" " data-vv-name="nameTips" :has-error="errors.has('nameTips')"></mt-field>
            <span v-show="errors.has('nameTips')" class="help is-danger">{{ errors.first('nameTips') }}</span>
          </div>

          <div v-if="idCardReadOnly">
            <mt-field label="身份证" placeholder="请输入持卡人身份证" v-model="sendData.idCard" style="display: none;"></mt-field>
            <a class="mint-cell mint-field">
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title"><span class="mint-cell-text">身份证</span></div>
                <div class="mint-cell-value">{{sendData.idCard | formatIdCart}}</div>
              </div>
            </a>
          </div>
          <div v-else class="noBd2">
            <mt-field label="身份证" placeholder="请输入持卡人身份证" v-model="sendData.idCard" v-validate="'required|idCard'" data-vv-value-path="innerValue" data-vv-as=" " data-vv-name="idCardTips" :has-error="errors.has('idCardTips')"></mt-field>
            <span v-show="errors.has('idCardTips')" class="help is-danger">{{ errors.first('idCardTips') }}</span>
          </div>
        </div>
        <div class="page-part page-part03">
          <div @click="aloneBank" class="selBank  noBd3" >
            <mt-field label="所属银行" placeholder="请选择所属银行" v-model="bankName" readonly="readonly" :class="test"></mt-field>
          </div>
          <mt-field label="银行卡卡号" placeholder="请输入银行卡卡号" v-model="sendData.bankNo" type="text" :attr="{maxlength:19}" v-validate="'required|bank'" data-vv-value-path="innerValue" data-vv-as=" " data-vv-name="bankNoTips" :has-error="errors.has('bankNoTips')"></mt-field>
          <span class="help is-danger" v-if="bankNameError">* 卡号不正确或暂不支持该银行卡</span>
          <span v-show="errors.has('bankNoTips')" class="help is-danger" v-else>{{ errors.first('bankNoTips') }}</span>
        </div>
        <div :class="btnClass" @click="toBankCard" >下一步</div>
      </form>
      <div class="img"><img src="../../../assets/images/tip.png" class="img" /></div>
    </div>
    <div v-show="false" id="bankList">
      <bank-list></bank-list>
    </div>
    <div v-if="llweb" id="bankLlweb">
      <bank-llweb></bank-llweb>
    </div>
    <div v-if="getBankVerifyNo" id="getBankVerifyNo">
      <get-bank-verify-no></get-bank-verify-no>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { Field,Toast,Indicator } from 'mint-ui';
  import bankList from '../../public/bankList';
  import bankLlweb from './bankLlweb';
  import getBankVerifyNo from './getBankVerifyNo';

  export default {
    components:{
      mtField:Field,
      bankList:bankList,
      bankLlweb:bankLlweb,
      getBankVerifyNo:getBankVerifyNo,
      Toast,
      Indicator
    },
    data: function() {
      return {
        tradeNo:"",
        test:"off",
        InterValObj:"",
        bankName:"",
        sendData : {
          amount:"",
          realName:"",
          idCard: "",
          bankNo: "",
          way:""
        },
        llweb:false,
        getBankVerifyNo:false,
        btnClass:"gary",
        amountReadOnly:false,
        realNameReadOnly:false,
        idCardReadOnly:false,
        bankNameError:false
      }
    },
    watch: {
      "sendData.amount" : function (){
        this.btnFun();
      },
      "sendData.realName" : function (){
        this.btnFun();
      },
      "sendData.idCard" : function (){
        this.btnFun();
      },
      "sendData.bankNo" : function (){
        this.btnFun();
        this.bankNoFun();
      },
      bankName : function (){
        this.btnFun();
      }
    },
    methods: {
      aloneBank(){
        $("#bankList").show();
        $("#recharge").hide();
        window.Hub.$emit('setTitle', "银行卡列表", false, this.closeBankList, " ", null);
      },
      closeBankList(){
        $("#recharge").show();
        $("#bankList").hide();
        window.Hub.$emit('setTitle', "充值", false, null, " ", null)
      },
      bankNoFun(){
        var value =  /^[0-9]{16,19}$/.test(this.sendData.bankNo);
        if(this.sendData.bankNo == "" || !value){
          return;
        }
        this.cardBin();
      },
      cardBin(){
        var verifyCard = {flag: "mobile", bankAccount: this.sendData.bankNo};
        this.$public.API_GET({
          url: 'getBankName',
          data: verifyCard,
          success: (result) => {
            if(!result.isSuccess){
              Toast({
                message: result.message,
                position: 'bottom',
                duration: 2000
              });
              this.bankNameError= true;
            }else{
              this.bankNameError= false;
              this.bankName = result.data.bankName;
              this.test = "on";
            }
            this.btnFun();
          }
        })
      },
      toBankCard(){
        if(this.btnClass == "gary"){
          return;
        }
        var sendDataLong = {realName:this.sendData.realName,idCard:this.sendData.idCard,bankAccount:this.sendData.bankNo};

        this.$public.API_GET({
          url : 'toBankCard',
          data:sendDataLong,
          success : (result) => {
            if(!result.isSuccess){
              Toast({
                message: result.message,
                position: 'bottom',
                duration: 2000
              });
              return
            }
            if(result.data.channelCode == "jdapi"){
              this.sendData.way = "jdapi"
              $("#recharge").hide();
              $("#getBankVerifyNo").show();
              this.getBankVerifyNo = true;
            }else{
              this.llweb = true;
              this.sendData.isProj=true;
              this.sendData.way = "llwap";
              Indicator.open({
                text: '加载中...',
              });
            }
          }
        });
      },
      btnFun(){
        if((this.sendData.amount >= 100 || this.$route.query.amount)  && this.sendData.realName != "" && this.sendData.idCard != "" && this.sendData.bankNo != "" && this.bankName != ""){
          var that=this;
          setTimeout(function(){
            that.count = that.errors.count() ;
            if(that.count > 0 || that.bankNameError){
              that.btnClass = "gary";
              return;
            }else{
              that.btnClass = "red";
            }
          },100)
        }else{
          this.btnClass = "gary";
          return;
        }
      },
      keyFun(){
        this.sendData.amount = this.sendData.amount.replace(/([0-9]+\.[0-9]{2})[0-9]*/,"$1");
      }
    },
    mounted: function() {
      window.Hub.$emit('refresh', null);
      window.Hub.$emit('setTitle', "充值", false, null, " ", null);
      window.Hub.$emit('setFooter', false);
      // 投资列表带数据金额
      if(this.$route.query.amount){
        this.sendData.amount = this.$route.query.amount ;
        window.Hub.$emit('setTitle', "投资", false, null, " ", null);
        this.amountReadOnly = true;
      }
      // 投资列表带投资订单号
      if(this.$route.query.tradeNo){
        this.sendData.tradeNo = this.$route.query.tradeNo ;
        window.Hub.$emit('setTitle', "投资", false, null, " ", null);
      }

      //点击银行卡列表
      window.Hub.$on('bankName', (event) => {
        this.bankName = event;
        this.test="on";
        $("#recharge").show();
        $("#bankList").hide();
        window.Hub.$emit('setTitle', "充值", false, null, " ", null);
      });
      //接口实名带数据
      var getSenData = sessionStorage.getItem("enterData");
      getSenData = JSON.parse(getSenData);
      //已绑卡未实名不许点击
        if(getSenData && getSenData.idCard ){
        this.sendData.idCard = getSenData.idCard;
        this.idCardReadOnly = true;
      }
      if(getSenData && getSenData.realName ){
        this.sendData.realName = getSenData.realName;
        this.realNameReadOnly = true;
      }
    },
    destroyed(){
      sessionStorage.removeItem("enterData");
    }
  }
</script>

<style lang="scss" scoped="" type="text/css">
  @import "../../../assets/skin";
  .recharge-all{
  .page-part {margin-top: pxToRem(20);}
  .page-part02 {margin-top: pxToRem(30);}

  .img{width:pxToRem(300);margin:0 auto;}
  .img img{width:$img;}

  .mint-cell-title{width: 105px;-webkit-box-flex: 0;-ms-flex: none;flex: none;}

  .red{@include btn;}
  .gary{@include btn;background:$gary;color:$garyFont;}
  .is-danger{background: $white;color:$red;padding-left:10px;margin:0;}
  }
</style>

