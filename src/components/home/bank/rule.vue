<!--提现规则 hmc-->
<template>
  <div class="recharge-all">
    <div class="ruleIfo" v-html="ruleInfo"></div>
  </div>
</template>

<script type="text/javascript">

  export default {
    components:{
    },
    data: function() {
      return {
        ruleInfo:""
      }
    },
    methods: {
      rule(){
        $.ajax({
          url:this.$public.myHost+'/rule/rule.html?code=withdraw',
          success : (result) => {
            this.ruleInfo = $(result).find(".tempLate").html();
//            console.log($(result).find(".tempLate").text());
          }
        });
      }
    },
    mounted: function() {
      window.Hub.$emit('refresh', null);
      window.Hub.$emit('setTitle', "提现规则", false, null, " ", null);
      window.Hub.$emit('setFooter',false);
      this.rule();
    }
  }
</script>
<style lang="scss" scoped="" type="text/css">
@import "../../../assets/skin";
.recharge-all{background:$white;font-size:14px;line-height:1.8;color:$ft-666;text-align: justify;
  .ruleIfo{padding: 32px 0;width:91%;margin:0 auto;}
}
</style>



