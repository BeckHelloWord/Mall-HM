<template>
	<div class='wrapper'>

	</div>
</template>
<script>
	export default {
		data:function(){
			return {
				// 样式是否加载
				isStyleAdd:false,
				// host:'http://10.0.1.33:8686'
				host:''
			}
		},
		methods:{
			initData(){
				// console.log(this.host+this.$route.params.contractUrl)
				$.ajax({
					url: this.$public.myHost+'/'+this.$route.params.contractUrl,

				})
				.done((result) => {
					// console.log($(result))
					var div = $('<div></div>')
					div.append($(result))
					var content = div.find('div.wrapper')
					var style = div.find('style')
					// $('.agreement table td').css('wordBreak', 'break-all');
					$('head').append(style)
					this.isStyleAdd = true;
					$('.wrapper').html(content)

				});

			}
		},
		mounted:function(){
			$('.mint-loadmore').css('background','white')

			window.Hub.$emit('setTitle', "查看合同", false, null, ' ', null)
			this.initData();

			// console.log(this.$route.params.investId)
		},

		beforeRouteLeave(to,from,next){
			$('.mint-loadmore').removeAttr('style')
			if(this.isStyleAdd){
				$('head').find(':last-child').remove();
			}
			next();
		}
	}
</script>
<style lang="scss" type="text/css">
	.wrapper{

		padding-bottom: 40px;
	}
		.agreement table td{
			word-break:break-all !important;
		}
</style>