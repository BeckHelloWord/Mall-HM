<template>
  <div class="myFooter" v-show='showFlag'>
    <ul>
      <router-link to="/index/index"><li><i class="iconfont icon-index"></i> 首页</li></router-link>
      <router-link to="/invest/brisk"><li><i class="iconfont icon-invest"></i> 活期</li></router-link>
      <router-link to="/invest/fina"><li><i class="iconfont icon-invest"></i> 定期</li></router-link>
      <router-link to="/home/index"><li><i class="iconfont icon-home"></i> 我的</li></router-link>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showFlag: false
    }
  },
  beforeCreate:function(){
    //footer事件
    window.Hub.$on('setFooter', (flag) => { 
      this.showFlag = flag
      if(flag){
        $(".mint-loadmore-content").css("padding-bottom","44px")
      }else{
        $(".mint-loadmore-content").css("padding-bottom","0")
      }
    });
  }
}
</script>
<style lang="scss" scoped="" type="text/css">
@import "../../assets/skin";
  .myFooter{
    li{
      font-size:pxToRem(32);
    }
  }
</style>




 