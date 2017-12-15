<template>
    <div class="fixed-stream" v-if="loadEnd">
        <div class="stream-menu">
            <span class="w-42">项目名称</span>
            <span class="w-32">待回本息(元)</span>
            <span class="w-26">已回本息(元)</span>
        </div>
        <ul class="stream-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <li v-for="item in dataInfo" :key="item.id">
                <p class="w-42 list-title">
                    <span>{{item.itemName}}
                    </span>
                    <i class="tips" v-if="item.itemType=='bond'">转</i>
                </p>
                <span class="w-32">{{item.waitIncome | formatMoney}}</span>
                <span class="w-26">{{item.doneIncome | formatMoney}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
//  定期产品-持标明细
//  wd_api/finaApp/getMemberFinaInvestItemList
/*  
*   参数：
*   finaId 投资产品投资ID
*   offset  
*   max
* 返回参数：
*   List:
*      Map:
*   itemId 底层标的产品ID
*   itemName 底层标的名称
*   itemType  invest：直投标 bond：债券转让
*   waitIncome 待回款
*   doneIncome 已回款
*/
import { Toast } from "mint-ui";
export default {
  data: function() {
    return {
      finaId: "",
      dataInfo: [],
      max: 10,
      offset: 0,
      loadEnd: false,
      hasNext: true,
      initLock: true
    };
  },
  methods: {
    loadMore() {
      if (this.initLock) {
        return;
      }
      if (!this.hasNext) {
        return;
      }
      this.loading = true;
      this.$public.API_GET({
        url: "getMemberFinaInvestItemList",
        data: { finaId: this.finaId, max: this.max, offset: this.offset },
        success: result => {
          if (!result.isSuccess) {
            //接口调用失败
            Toast(result.message);
            return false;
          }
          if (result.isSuccess) {
            this.dataInfo = this.dataInfo.concat(result.data);
          }
          this.offset += this.max;
          this.loading = false;
          if (result.data.length < this.max) {
            this.hasNext = false;
          }
          //下拉刷新释放函数
          if (typeof finishFun == "function") {
            finishFun();
          }
        }
      });
    },
    initData(finishFun) {
      this.offset = 0;
      this.loadEnd = false;
      this.hasNext = true;
      this.$public.API_GET({
        url: "getMemberFinaInvestItemList",
        data: { finaId: this.finaId, max: this.max, offset: this.offset },
        success: result => {
          this.loadEnd = true;
          this.initLock = false;
          if (!result.isSuccess) {
            //接口调用失败
            Toast(result.message);
            return false;
          }
          if (result.isSuccess) {
            this.dataInfo = result.data;
          }
          this.offset += this.max;

          if (result.data.length < this.max) {
            this.hasNext = false;
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
    this.finaId = this.$route.params.id; //获取标的ID
    window.Hub.$emit("refresh", this.initData);
    window.Hub.$emit("setFooter", false);
    window.Hub.$emit("setTitle", "持标明细", false, null, "", null);
    this.initData();
  }
};
</script>

<style lang="scss" type="text/css" >
@import "../../../assets/skin";
.fixed-stream {
  .w-32 {
    width: 32%;
  }
  .w-42 {
    width: 42%;
  }
  .w-26 {
    width: 26%;
  }
  .stream-menu {
    padding: pxToRem(30) pxToRem(32);
    font-size: 0;
    color: $ft-999;
    background: $background;
    & > span {
      display: inline-block;
      font-size: pxToRem(26);
    }
  }
  .stream-list {
    background: $white;
    .tips {
      display: inline-block;
      vertical-align: top;
      margin-left: 8%;
      color: $ft-793cca;
    }
    li {
      padding: pxToRem(30) pxToRem(32);
      font-size: 0;
      vertical-align: middle;
      &:not(:last-child) {
        border-bottom: 1px solid $ft-dedede;
      }
      & > span,
      .list-title {
        display: inline-block;
        vertical-align: top;
        font-size: pxToRem(28);
        color: $ft-333;
      }
      & > span:last-child {
        color: $e71c18;
      }
      .list-title {
        line-height: 1.25;
        span {
          display: inline-block;
          max-width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>