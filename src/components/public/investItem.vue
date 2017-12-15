<template>
    <li>
        <router-link :to="{ path: '/invest/finaIndex/'+item.finaId}">
            <div class="finaListLeft">
                <h2>{{item.title }}
                    <span v-if="item.isUseBonus">可用红包</span>
                </h2>
                <p class="finaRate">{{item.yearRate|formatMoney }}
                    <span>%</span>
                </p>
                <p>借款年利率</p>
            </div>
            <div class="finaListRight">
                <span class="finaBtn canInvest" v-if="item.surplusAmount > 0">立即加入</span>
                <span class="finaBtn noInvest" v-if="item.surplusAmount == 0">已售罄</span>
                <p>剩余额度(元)：{{item.surplusAmount|formatMoney}}</p>
            </div>
            <div class="clearfix"></div>
        </router-link>
    </li>
</template>

<script>
export default {
  props: ["item"],
  methods: {
    formatSchedule(schedule) {
      if (
        schedule &&
        new Date(schedule.replace("-", "/")).getTime() > new Date().getTime()
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted: function() {},
  beforeMount: function() {},
  filters: {
    filterFun: function(value) {
      if (value == "day") {
        return "天";
      } else if (value == "month") {
        return "个月";
      }
    },
    showDay: function(value) {
      var month = value.split(" ")[0].split("-")[1];
      var day = value.split(" ")[0].split("-")[2];
      return month + "月" + day + "日";
    },
    showTime: function(value) {
      return value.split(" ")[1].substring(0, 5);
    }
  }
};
</script>

<style lang="scss"  type="text/css">
@import "../../assets/skin";

@media screen and (min-width: 180px) and (max-width: 321px) {
  .investList {
    li {
      .finaListLeft {
        h2 {
          padding-left: pxToRem(5) !important;
          font-size: pxToRem(30) !important;
          span {
            padding: pxToRem(6) pxToRem(14) !important;
            font-size: pxToRem(6) !important;
          }
        }
        .finaRate {
          padding: pxToRem(6) pxToRem(14) !important;
          span {
            font-size: pxToRem(6) !important;
          }
        }
        p {
          padding-left: pxToRem(6) !important;
        }
      }
    }
  }
}
.investList {
  ul {
    li + li {
      border-top: 1px solid #dedede;
    }
    padding: 0 pxToRem(24);
    background-color: white;
    li {
      padding: pxToRem(30) 0;

      .finaListLeft {
        float: left;
        width: 50%;
        color: #999999;
        h2 {
          padding-left: pxToRem(16);
          font-weight: 500;
          font-size: pxToRem(30);
          color: #555555;

          span {
            padding: pxToRem(8) pxToRem(16);
            background-color: #fff6e8;
            color: #f6aa2d;
            border-radius: 20px;
            font-size: pxToRem(8);
            white-space: nowrap;
          }
        }
        .finaRate {
          font-size: pxToRem(60);
          color: #e71c18;
          padding: pxToRem(10) 0 pxToRem(10) pxToRem(24);
          font-weight: normal;
          span {
            font-size: pxToRem(26);
          }
        }
        p {
          padding-left: pxToRem(24);
        }
      }
      .finaListRight {
        float: right;
        width: 50%;
        text-align: center;
        margin-top: pxToRem(64);
        position: relative;
        color: #999999;
        &:before {
          display: block;
          position: absolute;
          content: "";
          left: 0;
          top: - pxToRem(30);
          width: 1px;
          height: pxToRem(100);
          background-color: #dedede;
        }
        .finaBtn {
          padding: pxToRem(16) 0;
          line-height: 1;
          color: white;
          border-radius: 20px;
          font-size: pxToRem(26);
          width: pxToRem(180);
          display: inline-block;
          margin-bottom: pxToRem(16);
        }
        .canInvest {
          background-color: $red;
        }
        .noInvest {
          background-color: #999;
        }
      }
    }
  }
}
</style>