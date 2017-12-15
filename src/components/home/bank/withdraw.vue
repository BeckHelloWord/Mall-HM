<!--提现 hmc-->
<!--获取银行卡信息-->
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



<!--* 提现手续费计算-->
<!--* 接口访问地址：-->
<!--* wd_api/recharge/getMemberWithdraw-->
<!--* 接口输入参数：-->
<!--* params amount 金额-->
<!--* 接口返回参数：-->
<!--*   withdrawFee 提现手续费-->
<!--* @return 200 成功-->

<!--* 可用余额-->
<!--* 接口访问路径：-->
<!--* wd_api/memberAssetInfo/getMemberBalance-->
<!--* 参数：-->
<!--* 无 登录后可用接口-->
<!--* 返回值：-->
<!--* Map-->
<!--* availableBalance  账户余额-->

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



<template>
  <div class="recharge-all" v-if="loadEnd">
    <div id="withdraw" class="withdraw">
      <div class="withdraw-top">
        <div v-if="toDo" class="bind">
          <router-link :to="{ path: '/home/bank/bankDetail'}">
            <div class="more">
            <div class="bankLogo fl"><img :src='"../../../assets/images/bankLogo/bank_select_icon_"+ withdrawData.bankCode +".png"'></div>
            <div class="bankInfo">
              <h2>{{withdrawData.bankName}}</h2>
              <p>{{withdrawData.bankAccount | formatBankCard}}</p>
            </div>
          </div>
          </router-link>
        </div>
        <div v-else class="toBind clearfix">
          <router-link  to="/home/bank/bindCard">
            <h2><span></span>添加银行卡</h2>
          </router-link>
        </div>
        <mt-field label="可提现金额" v-model="canDraw" readonly="readonly" class="canDraw"></mt-field>
      </div>
      <div class="rule"><mt-cell title="" value="提现规则" to="/home/bank/rule"></mt-cell></div>
      <div class="noBd" @input="keyFun" onkeyPress="var keyCode = event.keyCode;if ((keyCode >= 48 && keyCode <= 57) || keyCode == 46){event.returnValue = true;}else {event.returnValue = false;}">
        <mt-field label="提现金额" placeholder="请输入提现金额" v-model="amount" type="text"></mt-field>
        <span class="help is-danger">{{enterAmount}}</span>
      </div>
      <div class="noBd2">
        <mt-field v-if="typeBool" label="交易密码" v-model="password" :placeholder='"请输入"+$config.info.appName+"交易密码"' class="password" type="password">
          <img src="../../../assets/images/close.png" @click="text" class="eye">
        </mt-field>
        <mt-field v-else label="交易密码" v-model="password" :placeholder='"请输入"+$config.info.appName+"交易密码"' class="password" type="password">
          <img src="../../../assets/images/open.png" @click="pwd" class="eye">
        </mt-field>
      </div>
      <p class="tips">若您没有修改过交易密码，则交易密码与您注册时获取的验证码相同，您可以在账户安全中修改或者<router-link  to="/home/resetOutPassword">找回交易密码</router-link>。</p>
      <div :class="btnClass" @click="checkOutPassword">确认提现</div>
      <p class="fee">{{feeText}}</p>
    </div>
    <div v-if="getWithDrawVerifyNo" id="getWithDrawVerifyNo">
      <get-with-draw-verify-no></get-with-draw-verify-no>
    </div>
  </div>
</template>

<script type="text/javascript">
  import layer from '../../../../static/layer.js'
  import { Field,Cell, Toast} from 'mint-ui';
  import getWithDrawVerifyNo from './getWithDrawVerifyNo';

  export default {
    components:{
      mtField:Field,
      mtCell:Cell,
      Toast,
      getWithDrawVerifyNo:getWithDrawVerifyNo,
    },
    data: function() {
      return {
        toDo:false,
        withdrawData:{},
        feeText:"本次提现手续费0.00(元)",
        withdrawFee:"",
        canDraw:"0.00元",
        canDrawNum:0,
        amount:"",
        password:"",
        typeBool:true,
        btnClass:"gary",
        getWithDrawVerifyNo:false,
        enterAmount:"",
        loadEnd:false
      }
    },
    watch:{
      amount:function(){
        this.btnFun();
        this.blurInput();
      },
      password:function () {
        this.btnFun();
      }
    },
    methods: {
      // 提现 获取银行卡信息
      doWithdrawGetBank(){
        this.$public.API_GET({
          url : 'bankDetail',
          success : (result) => {
            this.loadEnd=true;
            if(!result.isSuccess){
              Toast({
                message: result.message,
                position: 'bottom',
                duration: 2000
              });
              return
            }
            this.withdrawData = result.data;
            if(result.data && result.data.bankAccount && result.data.realName && result.data.idCard){
              this.toDo = true;
            }
            // 已实名已绑卡带入添加银行卡
            sessionStorage.setItem("info",JSON.stringify(this.withdrawData));
            this.getMemberBalance();
            
            //已实名已绑卡未填支行，提示去完善银行卡信息，跳转到支行信息页面。
            if(!result.data.realName || !result.data.bankAccount || !result.data.idCard || !result.data.bankSubName || !result.data.bankCity){
              layer.dialog({
                  title: ['提示'], // 第一个是标题内容  第二个是标题栏的style(可以为空)
                  content: "您的银行卡信息还没完善，为保证顺利提现，请先完善银行卡信息。",
                  contentClass: "layerJump",
                  btn: ['取消','去完善'],
                  time: 2000000,
                  closeFlag:true,
                  bindFun: () => {}
              })
                // 如果有btn
              .then((res) =>{
                  // res为0时是用户点击了左边  为1时用户点击了右边
                  let position = res === 0 ? 'left' : 'right';
                if(position == "left") {
                  this.$router.push({ path: '/home/index' });
                }else{
                  if(result.data.realName && result.data.bankAccount && result.data.idCard ){
                    this.$router.push({ path: '/home/bank/bankDetail'});
                  }else{
                    this.$router.push({ path: '/home/bank/bindCard'});
                  }
                }
              })
            }
          }
        });
      },
      //提现 手续费计算
      getMemberWithdraw(){
        if(this.amount == "" || this.amount == null || this.amount == undefined){
          return;
        };
          var data = {amount:this.amount};
          this.$public.API_GET({
            url : 'getMemberWithdraw',
            data:data,
            success : (result) => {
              if(!result.isSuccess){
                Toast({
                  message: result.message,
                  position: 'bottom',
                  duration: 2000
                });
                return
              }
              this.withdrawFee = result.data.withdrawFee;
              if(this.withdrawFee == 0){
                this.feeText = "本次提现免手续费";
              }else{
                this.feeText = "本次提现手续费"+ this.filterFun(this.withdrawFee) +"(元)";
              }
            }
          });

      },
      //提现 可提现余额
      getMemberBalance(){
        this.$public.API_GET({
          url : 'getMemberBalance',
          success : (result) => {
            if(!result.isSuccess){
              Toast({
                message: result.message,
                position: 'bottom',
                duration: 2000
              });
              return
            }
            this.canDraw = this.filterFun(result.data.availableBalance)+"元";
            this.canDrawNum= result.data.availableBalance
          }
        });
      },
      // 交易密码验证
      checkOutPassword(){
          if(this.btnClass == "gary"){
              return;
          }
        var sendPwdData = {outPassword:this.password};
        this.$public.API_GET({
          url : 'checkOutPassword',
          data:sendPwdData,
          success : (result) => {
            if(!result.isSuccess){
              Toast({
                message: result.message,
                position: 'bottom',
                duration: 2000
              });
              return
            }
            $("#withdraw").hide();
            $("#getWithDrawVerifyNo").show();
            this.getWithDrawVerifyNo = true;
          }
        });
      },
      //显示密码
      text(){
        this.typeBool = false;
        $(".password input").attr("type","text");
      },
      //隐藏密码
      pwd(){
        this.typeBool = true;
        $(".password input").attr("type","password");
      },
      //提现 手续费监听
      blurInput(){
        if(this.amount >= 100 && this.amount <= this.canDrawNum){
          this.enterAmount = "";
          this.getMemberWithdraw();
        }else{
          this.enterAmount = "* 提现金额必须大于100小于等于可提现金额";
          this.btnClass = "gary";
          return;
        }
      },
      btnFun(){
        if(this.amount >= 100 && this.amount <= this.canDrawNum && this.password.length >= 6){
          this.btnClass = "red";
        }else{
          this.btnClass = "gary";
        }
      },
      //如果小数三位，会四舍五入
      filterFun(num) {
        num=num==null?0:num;
        return Number(Math.abs(num)).toFixed(2);
      },
      keyFun(){
        this.amount = this.amount.replace(/([0-9]+\.[0-9]{2})[0-9]*/,"$1");
      }
    },
    mounted: function() {
      window.Hub.$emit('refresh', null);
      window.Hub.$emit('setTitle', "提现", false, null, " ", null);
      window.Hub.$emit('setFooter',false);
      this.doWithdrawGetBank();
    },
    destroyed:function(){    
			if(layer.instanceList[0]){
        layer.instanceList[0].closeFlag=false
				layer.instanceList[0].close()
			}
		}
  }
</script>
<style lang="scss" scoped="" type="text/css">
@import "../../../assets/skin";
  .withdraw {
  .withdraw-top{
    .bind{
      background:$white;
      max-height: pxToRem(120);
      .more{
        .bankLogo {width: 10%;padding: 6px 10px 0;}
          .bankInfo {
            padding: 9px 0;position:relative;
            p{font-size:pxToRem(24);color:$ft-666;}
            }
        .bankInfo:after{border: solid 2px $gary;border-bottom-width: 0;border-left-width: 0;content: " ";top: 50%;right: 20px;position: absolute;width: 5px;height: 5px; -webkit-transform: translateY(-50%) rotate(45deg);transform: translateY(-50%) rotate(45deg); }
        }
      }
    .toBind{
      background:$white;
      position:relative;
      text-align:center;
      h2{height:pxToRem(130);line-height:pxToRem(130);position:relative;margin-left:pxToRem(40);}
      span{width:pxToRem(74);height:pxToRem(74);border:1px solid $ft-999;border-radius:50%;-webkit-border-radius:50%;display:block;position:absolute;top:pxToRem(30);left:pxToRem(140)}
      span:before{content:'';width:1px;height:16px;border-radius:8px;-webkit-border-radius:8px;background:$ft-999;display:block;position:absolute;top:50%;left:50%;z-index:0;margin-top:-8px;margin-left:-.5px;}
      span:after{content:'';width:16px;height:1px;border-radius:8px;-webkit-border-radius:8px;background:$ft-999;display:block;position:absolute;top:50%;left:50%;z-index:1;margin-top:-.5px;margin-left:-8px;}
      }
  }
  h2 {font-size: pxToRem(30);color: $ft-333;font-weight: normal;}
  p {font-size: pxToRem(20);color:$fontgary ;}
  img{width:$img;}
  .tips{
        color:$ft-999;font-size:pxToRem(24);padding:pxToRem(30);line-height:2;
        a{color:$red;text-decoration:underline;}
  }
  .red{@include btn;}
  .gary{@include btn;background:$gary;color:$garyFont;}
  .fee{color:$red;text-align:right;padding-right:pxToRem(30);font-size:pxToRem(24);}
  .eye{width:50%}
.is-danger{background: $white;color:$red;padding-left:10px;margin:0;}
}

</style>



