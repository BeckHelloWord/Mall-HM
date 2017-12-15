<template>
	<div class="contract" v-html="itemContent">

	</div>
</template>
<script>
export default {
  data() {
    return {
      itemContent: ""
    };
  },
  methods: {
    initData() {
      this.$public.API_GET({
        url: "getHomePageNoticeOn",
        data: {
          articleType: this.$route.params.type
        },
        success: result => {
          this.itemContent = result.data.itemContent;
          window.Hub.$emit(
            "setTitle",
            result.data.title,
            false,
            null,
            " ",
            null
          );
        }
      });
    }
  },
  mounted() {
    window.Hub.$emit("refresh", null);
    this.initData();
    window.Hub.$emit("setFooter", false);
    $(".mint-loadmore").css("background", "white");
  },
  beforeRouteLeave(to, from, next) {
    $(".mint-loadmore").removeAttr("style");
    next();
  }
};
</script>

<style lang="scss" type="text/css">
</style>