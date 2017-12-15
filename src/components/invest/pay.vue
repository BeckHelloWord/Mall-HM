<template>
	<div class="pay">
		<div class="payBox">
			<div class="field">
				<span class="label">剩余金额(元)</span>
				<span class="labelText">{{finaDetail.surplusAmount|formatMoney}}</span>
			</div>
		</div>
		<div class="h5_title"></div>
		<div class="payBox">
			<div class="field">
				<span class="label">账户余额(元)</span>
				<span class="labelText">{{availableBalance|formatMoney}}</span>
				<span class="exBtn" @click="toRecharge">充值</span>
			</div>
			<div class="field">
				<span class="label">投资金额(元)</span>
				<span class="labelText"><input type="number" name="amount" id="amount" align="center" onkeyPress="var keyCode = event.keyCode;if ((keyCode >= 48 && keyCode <= 57)){event.returnValue = true;} else {event.returnValue = false;}" v-model="investMoney" :placeholder="'起投金额'+finaDetail.investMin+'元,'+finaDetail.canRaiseDay+'元递增'"></span>
				<span :class="investAllClass" @click="investAll">全部</span>
			</div>
			<div class="field">
				<span class="label">使用红包</span>
				<span class="labelText" @click="selectVoucher">
					<p class="voucher">{{voucherText}}</p>
				</span>
			</div>
		</div>
		<div class="btn btn-bottom" @click="toNext">确认投资</div>
		<p class="tips">点击“确认投资”即代表同意
			<router-link to='/invest/service/'>{{$config.info.finaName}}服务协议</router-link>
		</p>
		<div id="voucherBox" style="display:none">
			<ul class="voucherUl">
				<li class='voucherNone voucher' data-index="-1">不使用红包</li>
				<template v-for="(item,index) in voucherList">
					<li class='voucher' :data-index="index">
						<div class="hongbao">
							<i class="iconfont icon-hongbao"></i>
						</div>
						<div>
							<p>{{item.amountContent}}</p>
							<p>{{item.conditionContent}}</p>
							<p class="dueTime">{{item.dueTime|voucherTime}}</p>
						</div>
					</li>
				</template>
			</ul>
		</div>
		<div id="failToast" style="display:none">
			<div class="layerTitle">{{$config.info.appName}}</div>
			<div class="finaFail"></div>
			<h2>提交投资失败</h2>
			<p>失败金额{{investMoney|formatMoney}}元</p>
			<p>金额已返还到您的账户余额</p>
			<div class="continue btn btn-left">继续购买</div>
			<div class="knowed btn btn-right">我知道了</div>
			<div style="clear:both"></div>
		</div>
		<div id="successToast" style="display:none">
			<div class="layerTitle">{{$config.info.appName}}</div>
			<div class="finaSuccess"></div>
			<h2>恭喜您，加入成功</h2>
			<p>系统将帮您智能分散投资项目</p>
			<div class="continue btn btn-left">继续购买</div>
			<div class="knowed btn btn-right">我知道了</div>
			<div style="clear:both"></div>
		</div>
	</div>
</template>

<script>
import layer from "../../../static/layer.js";
import { Field, Toast } from "mint-ui";
export default {
  components: {
    mtField: Field
  },
  data: function() {
    return {
      investAllClass: "exBtn",
      finaDetail: {
        finaId: 1,
        title: "定期投资",
        yearRate: 0,
        investMin: 1000,
        investMax: 0,
        cycleNew: 1,
        cycleType: "month",
        isUseBonus: false,
        cycleTypeShow: "个月",
        cycleNumber: 3,
        cycle: 3,
        type: "season",
        typeName: "",
        finaStatus: "process",
        finaStatusName: "待加入",
        amount: 0,
        alreadyAmount: 0,
        surplusAmount: 0,
        joinedNumber: 0,
        minYearRate: 0,
        maxYearRate: 0,
        openingTime: "",
        canRaiseDay: 1,
        investProcess: 0,
        overTime: "",
        joinFee: 0,
        outFee: 0
      },
      availableBalance: "",
      investMoney: "",
      voucherList: [],
      voucher: "",
      voucherText: "-",
      tradeNo: ""
    };
  },
  methods: {
    toRecharge(){
      this.$router.push({ path: '/home/bank/bindCard'})
    },
    investAll() {
      if (this.availableBalance < this.finaDetail.investMin) {
        return;
      }
      if (this.availableBalance > this.finaDetail.surplusAmount) {
        this.investMoney = this.finaDetail.surplusAmount;
      } else {
        this.investMoney = this.availableBalance;
      }
    },
    showFail() {
      layer.dialog({
        // title: ['这是标题', 'background:red;'], // 第一个是标题内容  第二个是标题栏的style(可以为空)
        content: $("#failToast").html(),
        contentClass: "layerBox",
        // btn: ['确定'],
        time: 2000000,
        bindFun: () => {
          $(".layui-m-layerchild").css("background", "transparent");
          // layer.instanceList[0].close();
          $(".continue").on("click", function() {
            layer.instanceList[0].close();
          });
          $(".knowed").on("click", function() {
            layer.instanceList[0].close();
            history.back();
          });
        }
      });
    },
    showSuccess() {
      layer.dialog({
        // title: ['这是标题', 'background:red;'], // 第一个是标题内容  第二个是标题栏的style(可以为空)
        content: $("#successToast").html(),
        contentClass: "layerBox",
        // btn: ['确定'],
        time: 2000000,
        bindFun: () => {
          $(".layui-m-layerchild").css("background", "transparent");
          // layer.instanceList[0].close();
          $(".continue").on("click", function() {
            layer.instanceList[0].close();
          });
          $(".knowed").on("click", function() {
            layer.instanceList[0].close();
            history.back();
          });
        }
      });
    },
    toLogin() {
      this.$router.push({
        path: "/index/login",
        query: { redirect: this.$route.path }
      });
    },
    findOrder() {
      this.$public.API_GET({
        url: "findOrder",
        data: {
          tradeNo: this.tradeNo
        },
        success: result => {
          if (result.status == "201") {
            Toast({
              message: result.message,
              position: "bottom",
              duration: 2000
            });
          } else {
            if (result.data.ordStatus == "notFinace" || result.data.ordStatus == "finace") {
              layer.close();
              if (result.data.ordStatus == "finace") {
                this.showSuccess();
              } else if (result.data.ordStatus == "notFinace") {
                this.showFail();
              }
            } else {
              window.setTimeout(this.findOrder, 1000);
            }
          }
        }
      });
    },
    toNext() {
      if (this.investMoney == "") {
        Toast({
          message: "请填写投资金额",
          position: "bottom",
          duration: 2000
        });
        return false;
      }
      if (this.investMoney.toString().indexOf(".") > -1) {
        Toast({
          message: "请填写正确的投资金额",
          position: "bottom",
          duration: 2000
        });
        return false;
      }
      if (this.investMoney < this.finaDetail.investMin) {
        Toast({
          message: "最小加入金额" + this.finaDetail.investMin + "元",
          position: "bottom",
          duration: 2000
        });
        return false;
      }
      if (this.investMoney < this.voucher.useLimitMoney) {
        Toast({
          message: "投资额小于红包起投金额" + this.voucher.useLimitMoney + "元",
          position: "bottom",
          duration: 2000
        });
        return false;
	  }
	  if (this.investMoney > this.finaDetail.surplusAmount) {
        this.$router.push({ path: '/home/bank/bindCard'})
        return false;
      }
      var sendOrderData = {
        objectKey: this.$route.params.id,
        type: "fina",
        amount: this.investMoney
      };
      if (this.voucher.sid != 0) {
        sendOrderData.voucherId = this.voucher.sid;
      }
      this.$public.API_GET({
        url: "investOrder",
        data: sendOrderData,
        success: result => {
          this.investLock = false;
          if (result.isSuccess) {
            this.tradeNo = result.data.tradeNo;
            if(result.data.truthAmt){
              Toast({
              message: "余额不足，请先充值",
              position: "bottom",
              duration: 2000
            });
            }else{

            layer.loading();
            this.findOrder();
            }
          } else {
            Toast({
              message: result.message,
              position: "bottom",
              duration: 2000
            });
          }
        }
      });
    },
    selectVoucher() {
      this.customerSelect = false;
      var _this = this;
      if (this.voucherList.length == 0) {
        Toast({
          message: "无可用红包",
          position: "bottom",
          duration: 2000
        });
        return;
      }
      layer.dialog({
        // title: ['这是标题', 'background:red;'], // 第一个是标题内容  第二个是标题栏的style(可以为空)
        content: $("#voucherBox").html(),
        contentClass: "voucherList",
        // btn: ['确定'],
        time: 2000000,
        bindFun: () => {
          var voucherHeight = (this.voucherList.length + 1) * 62.08,
            showHeight;
          showHeight =
            voucherHeight > window.innerHeight / 1.5
              ? window.innerHeight / 1.5
              : voucherHeight;
          $(".voucherList").css("height", showHeight);
          $(".voucherList").css("width", window.innerWidth * 0.9);
          $(".voucher").on("click", function(e) {
            _this.setVoucher(e.currentTarget.dataset.index);
            layer.instanceList[0].close();
          });
        }
      });
    },
    setVoucher(index) {
      if (index > -1) {
        this.voucher = this.voucherList[index];
        this.voucherText =
          this.voucher.amountContent +
          "(" +
          this.voucher.conditionContent +
          ")";
        $(".voucher").css("color", "#333333");
      } else {
        this.voucher = {
          amount: 0,
          amountContent: "不使用红包",
          conditionContent: "",
          dueTime: "",
          effectiveMaxMoney: null,
          interestDay: 0,
          interestRate: 0,
          name: "",
          sid: 0,
          startTime: "",
          status: "",
          useLimitMoney: 0,
          useLimitMonth: "",
          useTime: null,
          voucherAmountDeploy: 0,
          voucherType: ""
        };
        this.voucherText = "不使用红包";
      }
    },
    getVouchers() {
      this.$public.API_GET({
        url: "getFinaDetailByMember",
        data: {
          finaId: this.$route.params.id
        },
        success: result => {
          if (result.isSuccess) {
            this.availableBalance = result.data.availableBalance;
            this.finaDetail = result.data.finaDetail;
            if (this.availableBalance < this.finaDetail.investMin) {
              this.investAllClass = "exBtn disable";
            }
            if (result.data.voucherList) {
              this.voucherList = result.data.voucherList;
              this.voucherText = result.data.voucherList.length + "个红包可用";
            } else {
              this.voucherText = "您暂无支持此项目的红包";
            }
          } else {
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
  filters: {
    formatLoanRate: function(value) {
      return Number(value).toFixed(2);
    },
    voucherTime: function(value) {
      return value.split(" ")[0];
    }
  },
  mounted: function() {
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", this.$config.info.finaName, false, null, " ", null);
    window.Hub.$emit("setFooter", false);
    this.getVouchers();
  },
  beforeMount: function() {}
};
</script>
<style lang="scss" scoped="" type="text/css">
@import "../../assets/skin";
.pay {
  .h5_title {
    color: #999;
    height: 15px;
    line-height: pxToRem(30);
    font-size: pxToRem(24);
    padding-left: pxToRem(28);
  }
  .payBox {
    background-color: white;
  }
  .field + .field {
    border-top: 1px solid #edf0f3;
  }
  .field {
    font-size: pxToRem(26);
    background: #fff;
    margin: 0 pxToRem(30);
    height: pxToRem(100);
    line-height: pxToRem(108);
    position: relative;
    span {
      display: inline-block;
    }
    .label {
      width: 40%;
      overflow: hidden;
    }
    .labelText {
      width: 50%;
      text-align: left;
      overflow: hidden;
      color: #333333;
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .voucher {
        color: #aaaaaa;
      }
      input {
        border: none;
        &::-webkit-input-placeholder {
          color: #aaaaaa;
        }
      }
    }
    .exBtn {
      position: absolute;
      color: $aLink;
      &.disable {
        color: #aaaaaa;
      }
    }
    .amount {
      font-size: pxToRem(30);
    }
  }
  .tips {
    margin-top: pxToRem(30);
    font-size: pxToRem(20);
    text-align: center;
    color: #aaaaaa;
    a {
      color: $aLink;
      text-decoration: underline;
    }
  }
}
</style>
