
<template>
    <div class="fixed-list" v-if="loadEnd">

        <ul class="menu clearfix">
            <li class="menu-item fl on" @click="clickMenu">持有中</li>
            <li class="menu-item fr" @click="clickMenu">已退出</li>
        </ul>
        <template v-if="dataInfo.length>0">
            <div class="item-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                <div class="item" v-for="item in dataInfo" :key="item.finaId">
                    <router-link :to="{ path: '/home/fixed/details/'+item.finaId }">
                        <div class="item-con">
                            <h3 class="title">{{item.finaTitle}}</h3>
                            <div class="money clearfix">
                                <div class="fl w-50">
                                    <p>
                                        <span class="capital">{{item.capital | formatMoney}}</span>
                                        </br>
                                        <span class="p-3">加入金额(元)</span>
                                    </p>
                                </div>
                                <div class="fr w-50">
                                    <p>
                                        <span class="interest">{{item.income | formatMoney}}</span>
                                        </br>
                                        <span class="p-3" v-if="item.finaStatus=='run'">待回收益(元)</span>
                                        <span class="p-3" v-else>实收收益(元)</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="item-date clearfix">
                            <p class="fl w-50">加入日:
                                <span>{{item.joinTime}}</span>
                            </p>
                            <template v-if="item.finaStatus=='run'">
                                <p class="fl w-50">预期到期日:
                                    <span>{{item.deadline}}</span>
                                </p>
                            </template>
                            <template v-else>
                                <p class="fl w-50">退出日:
                                    <span>{{item.deadline}}</span>
                                </p>
                            </template>

                        </div>
                    </router-link>

                </div>
            </div>

        </template>
        <div class="empty">
            <empty v-show='dataInfo.length==0' :showImg='true' :padding='"120px"'></empty>
        </div>
    </div>
</template>
<script>
//  定期产品-列表
//  wd_api/finaApp/getMemberFinaInvestItemList
/*  
*   参数：
*   finaInvestStatus 传hold或者done
*   offset  
*   max
* 返回参数：
*   List:
*      Map:
/*  finaId 投资产品ID
*   finaTitle 投资产品名称
*   finaStatus 投资产品状态 none:未上线 online:已上线 process:待加入 success:已满额 run:收益中 done:已结束 failure:已失败
*   joinTime   加入时间
*   incomeFlg  是否部分回款  true 是  false 不是
*   finaIsTender 是否显示投标中 (持有中独有） true 是  false 不是
*   income
*          持有中的情况：待收益金额
*          已回款的情况：已收益金额
*   capital  加入月月丰本金
*   deadline 到期时间（待回款的情况） 没有就不显示
*            退出时间（待回款的情况）
*/
import empty from "../../public/empty";
import { Toast } from "mint-ui";
export default {
  components: {
    empty
  },
  data: function() {
    return {
      dataInfo: [],
      parameter: {
        offset: 0,
        max: 10,
        finaInvestStatus: "hold"
      },
      loadEnd: false,
      initLock: true,
      hasNext: true
    };
  },
  methods: {
    //修改不同状态的信息
    updateDiffStatusInfo(flg) {
      if (flg) {
        //已退出
        this.parameter.finaInvestStatus = "done";
      } else {
        //持有中
        this.parameter.finaInvestStatus = "hold";
      }
      this.initData();
    },
    //切换状态
    clickMenu(event) {
      var dom = event.currentTarget,
        _this = this;
      //栏目切换
      Array.prototype.filter.call(dom.parentNode.children, function(
        child,
        index
      ) {
        //当前点击事件元素
        if (child == dom) {
          //控制条目移动
          if (index) {
            //已退出
            dom.parentNode.classList.add("move-50");
            _this.updateDiffStatusInfo(true);
          } else {
            //持有中
            dom.parentNode.classList.remove("move-50");
            _this.updateDiffStatusInfo(false);
          }
          //添加选中效果
          dom.classList.add("on");
        } else {
          child.classList.remove("on");
        }
      });
    },
    loadMore() {
      //上拉加载更多
      if (this.initLock) {
        return;
      }
      if (!this.hasNext) {
        return;
      }
      this.loading = true;
      this.$public.API_GET({
        url: "getMemberFinaInvest",
        data: this.parameter,
        success: result => {
          if (!result.isSuccess) {
            //接口调用失败
            Toast(result.message);
            return false;
          }
          this.dataInfo = this.dataInfo.concat(result.data);
          this.offset += this.max;
          this.loading = false;
          if (result.data.length < this.parameter.max) {
            this.hasNext = false;
          }
        }
      });
    },
    initData(finishFun) {
      
      //初始化信息&&下拉刷新
      this.parameter.offset = 0;
      this.$public.API_GET({
        url: "getMemberFinaInvest",
        data: this.parameter,
        success: result => {
          this.loadEnd = true;
          if (!result.isSuccess) {
            //接口调用失败
            Toast(result.message);
            return false;
          }
          this.dataInfo = result.data;
          this.offset += this.max;
          if (result.data.length < this.parameter.max) {
            this.hasNext = false;
          }
          this.initLock = false;
          //下拉刷新释放函数
          if (typeof finishFun == "function") {
            finishFun();
          }
        }
      });
    }
  },
  mounted: function() {
    this.initData();
    window.Hub.$emit("refresh", this.initData);
    window.Hub.$emit("setFooter", false);
    window.Hub.$emit("setTitle", "定期产品", false, null, " ", null);
  }
};
</script>

<style lang="scss" type="text/css" >
@import "../../../assets/skin";

/*定期产品-列表*/
.fixed-list {
  padding-top: pxToRem(84);
  .p-3 {
    padding-left: 3%;
  }
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
  .menu {
    position: fixed;
    top: 50px;
    left: 0;
    width: 100%;
    font-size: pxToRem(26);
    color: $ft-b3bdcf;
    text-align: center;
    background: $white;
    .menu-item {
      width: 50%;
      height: pxToRem(84);
      line-height: pxToRem(84);
    }
    .on {
      font-size: pxToRem(30);
      color: $red;
    }
    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50%;
      height: pxToRem(4);
      background: $f6aa2d;
      transition: left 0.5s ease 0s;
    }
    &.move-50::before {
      left: 50%;
    }
  }
  .item {
    margin-top: pxToRem(34);
    padding: 0 pxToRem(32);
    background: $white;
    color: $ft-aaa;
    .item-con {
      .title {
        padding: pxToRem(32) 0;
        font-size: pxToRem(30);
        color: $ft-555;
      }
      .money {
        padding-bottom: pxToRem(28);
        line-height: 1.6;
        span {
          font-size: pxToRem(22);
          color: $ft-aaa;
        }
        .interest,
        .capital {
          font-size: pxToRem(44);
          color: $ft-333;
        }
        .interest {
          color: $e71c18;
        }
      }
    }
    .item-date {
      padding: pxToRem(34) 0;
      font-size: pxToRem(22);
      border-top: 1px solid $e1e8f2;
      span {
        padding-left: pxToRem(12);
      }
    }
  }
}

.empty {
  margin-top: pxToRem(80);
}
</style>