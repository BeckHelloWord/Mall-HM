<!-- 我的页面 beck-->
<!--
 *  2017.12.12
 *  获取首页用户相关信息接口（登录后用- 与宝象APP共用一个接口）
 *
 * 接口访问路径：
 * /wd_api/memberInfoApp/getMemberCenterNewInfo
 -->


<template>
    <div class="home-index">
        <div class="index-top padding-content">
            <div class="user-info clearfix">
                <router-link to="/home/set" class="fl">
                    <i class="iconfontHM icon-touxiang"></i>
                </router-link>
                <span class="fr">{{user.nickname}}</span>
            </div>
            <router-link to='/home/assets' tag='div' class='user-asset t_c'>
                <h3>净资产(元)</h3>
                <p>
                    <span>{{user.netAssets | formatMoney}}</span>
                </p>
            </router-link>
            <router-link to='/home/assets' tag='div' class='user-asset t_c'>
                <h3>累计收益(元)</h3>
                <p>
                    <span>{{user.allIncome | formatMoney}}</span>
                </p>
            </router-link>
        </div>
        <div class="index-recharge padding-content clearfix">
            <div class="left">
                <p>账户余额 (元)</p>
                <p>{{user.canUseMoney | formatMoney}}</p>

            </div>
            <div class="right t_c">
                <router-link to="/home/bank/withdraw">提现</router-link>
                <router-link to="/home/bank/bindCard">充值</router-link>
            </div>
        </div>
        <div class="set-list">
            <div class="module padding-content">
                <router-link class="invest module-item clearfix" to="/home/brisk">
                    <i class="iconfont icon-record fl"></i>
                    <span class="fl">{{$public.info.brisk}}</span>
                    <i class="iconfont icon-arrow fr"></i>
                </router-link>
                <router-link class="capital module-item clearfix" to="/home/fixed/list">
                    <i class="iconfont icon-capital fl"></i>
                    <span class="fl">定期产品</span>
                    <i class="iconfont icon-arrow fr"></i>
                </router-link>
            </div>
            <div class="module padding-content">
                <router-link class="packet module-item clearfix" to="/home/money">
                    <i class="iconfontHM icon-jiaoyijilu fl"></i>
                    <span class="fl">交易记录</span>
                    <span class="msg fl" v-if="user.size">{{user.size}}</span>
                    <i class="iconfont icon-arrow fr"></i>
                </router-link>
                <router-link class="capital module-item clearfix" to="/home/bank/bankCard">
                    <i class="iconfontHM icon-icon fl"></i>
                    <span class="fl">我的银行卡</span>
                    <i class="fr">
                        <i class="iconfont icon-arrow fl"></i>
                    </i>
                </router-link>
                <router-link class="set module-item clearfix" to="/home/invite">
                    <i class="iconfontHM icon-haoyou fl"></i>
                    <span class="fl">邀请好友</span>
                    <i class="iconfont icon-arrow fr"></i>
                </router-link>
            </div>
            <div class="module padding-content clearfix mb-20">
                <router-link class="item-left fl t_c" to="/home/set">
                    关于我们
                </router-link>
                <a :href="'tel:'+$config.info.phone" class="item-right fr t_c">我的客服</a>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      user: {}
    };
  },
  methods: {
    getUserData: function() {
      Public.API_GET({
        url: "getMemberCenterNewInfo",
        async: false,
        success: result => {
          this.user = result.data;  
          this.init();
        }
      });
    },
    toMessage: function() {
      this.$router.push({ path: "/home/message" });
    },
    showName: function() {
      if (this.user.userName == this.user.hideMobile) {
        return this.user.userName;
      } else {
        return this.user.userName + "(" + this.user.hideMobile + ")";
      }
    },
    init: function() {
      window.Hub.$emit("refresh", null);   
      window.Hub.$emit('setTitle', "个人中心", true, null, " ", null);
       window.Hub.$emit('hideHeader');
      window.Hub.$emit("setFooter", true);
    }
  },
  mounted: function() {
    this.getUserData();
    window.Hub.$emit("hideLeft");
    window.Hub.$emit("setFooter", true);
  },
  destroyed: function() {
    window.Hub.$emit("showLeft");
    sessionStorage.removeItem("addBankProvince");
    sessionStorage.removeItem("addBankCity");
    sessionStorage.removeItem("addBankSubName");
  }
};
</script>
<style lang="sass-loader">
@import "../../assets/home";
</style>
