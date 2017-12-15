<template>
    <div class="fixed-details" v-if="loadEnd">
        <div class="details-con">
            <h3 class="con-title">{{dataInfo.finaTitle}}</h3>
            <p class="con-date">加入日:
                <span>{{dataInfo.joinTime}}</span>
            </p>
            <div class="details-money clearfix">
                <div class="w-50 fl">
                    <span class="money-title">加入金额(元)</span>
                    <p class="money-amount">{{dataInfo.capital | formatMoney}}</p>
                </div>
                <div class="w-50 fr">
                    <span class="money-title">{{dataInfo.finaStatus =='run'?'预期收益':'实收收益'}}(元)</span>
                    <p class="money-amount red">{{dataInfo.income | formatMoney}}</p>
                </div>
            </div>
            <p class="details-quitDate clearfix" v-if="dataInfo.finaStatus =='done'">
                <span class="fl">退出日</span>
                <span class="fr">{{dataInfo.deadline}}</span>
            </p>
        </div>
        <p class="details-remarks clearfix">
            <template v-if="dataInfo.finaStatus =='run'">
                <!-- 持有中 -->
                <span class="fl">待回本息</span>
                <span class="fr">{{dataInfo.waitIncome | formatMoney}}</span>
            </template>
            <template v-else>
                <!-- 已退出 -->
                <span class="fl">已回本息</span>
                <span class="fr">{{dataInfo.doneIncome | formatMoney}}</span>
            </template>
        </p>
    </div>
</template>
<script>
/*  定期产品-详情
*   wd_api/finaApp/getMemberFinaInvestDetail
* 参数：
*  finaId 投资产品投资ID
* 返回参数：
*   finaId 投资产品ID
*   finaTitle 投资产品名称
*   finaStatus 投资产品状态 none:未上线 online:已上线 process:待加入 success:已满额 run:收益中 done:已结束 failure:已失败
*   finaInvestId 投资产品投资ID
*   joinTime   加入时间
*   income  收益金额
*   capital  加入月月丰本金
*   deadline 到期时间（待回款的情况）
*            退出时间（待回款的情况）
*   waitIncome 待回款
*   doneIncome 已回款
 *   shouldReward 应发奖励
 *   waitReward   待发奖励
 *   doneReward   已发奖励
 */
import { Toast } from "mint-ui";
export default {
  data: function() {
    return {
      finaId: "",
      dataInfo: {},
      loadEnd: false
    };
  },
  methods: {
    initData(finishFun) {
      this.$public.API_GET({
        url: "getMemberFinaInvestDetail",
        data: { finaId: this.finaId },
        success: result => {
          this.loadEnd = true;
          if (!result.isSuccess) {
            //接口调用失败
            Toast(result.message);
            return false;
          }
          if (result.isSuccess) {
            this.dataInfo = result.data;
          }
          //下拉刷新释放函数
          if (typeof finishFun == "function") {
            finishFun();
          }
        }
      });
    }
  },
  mounted: function() {
    this.finaId = this.$route.params.id;
    window.Hub.$emit("refresh", this.initData);
    window.Hub.$emit("setFooter", false);
    window.Hub.$emit("setTitle", "标的详情", false, null, "持标明细", () => {
      //持标明细跳转
      this.$router.push({ path: "/home/fixed/stream/" + this.finaId });
    });
    this.initData();
  }
};
</script>

<style lang="scss" type="text/css" >
@import "../../../assets/skin";
.fixed-details {
  .w-50 {
    width: 50%;
  }
  .clearfix {
    &:before {
      content: " ";
      display: table;
    }
    &:after {
      content: " ";
      display: table;
      clear: both;
    }
  }
  font-size: pxToRem(24);
  color: $ft-999;
  .details-con {
    padding: pxToRem(30) pxToRem(32);
    line-height: 2;
    text-align: center;
    background: $white;
    .con-title {
      font-size: pxToRem(30);
      color: $ft-555;
    }
    .con-date {
    }

    .details-money {
      line-height: 1.5;
      padding: pxToRem(28) 0;
      .money-amount {
        font-size: pxToRem(32);
        color: $ft-333;
      }
      .red {
        color: $e71c18;
      }
      & > div:last-child {
        box-sizing: border-box;
        border-left: 1px solid $e1e8f2;
      }
    }
  }
  .details-remarks {
    margin-top: pxToRem(20);
    padding: pxToRem(40) pxToRem(32);
    background: $white;
    font-size: pxToRem(28);
    color: $ft-666;
  }
  .details-quitDate {
    border-top: 1px solid $e1e8f2;
    padding: pxToRem(30) 0 0;
    font-size: pxToRem(28);
    color: $ft-666;
  }
}
</style>