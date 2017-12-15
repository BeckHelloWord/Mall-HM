<template>
    <section class="service">
      <div v-html="msg.content" ></div>
    </section>
</template>
<script>
export default {
  data: function() {
    return {
      msg: ""
    };
  },
  methods: {
    xy: function() {
      this.$public.API_GET({
        url: "getFinaServiceContentOn",
        success: result => {
          if (result.isSuccess) {
            this.msg = result.data;
          }
        }
      });
    }
  },
  mounted() {
    this.xy();
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "定期理财服务协议", false, null, " ", null);
    window.Hub.$emit("setFooter", false);
  }
};
</script>
<style lang="scss" type="text/css">
@import "../../assets/skin";
.service{background: $white;}
.service>div{padding:4%;}
.service p,.service span{font-size: pxToRem(24)!important;line-height:2;}
.service h1,.service h1 span{font-size: pxToRem(34)!important;line-height:2;}
</style>

