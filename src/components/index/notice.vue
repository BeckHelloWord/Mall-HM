<template>
	<div class="notice">

	</div>
</template>

<script>
	export default{
		data:function(){
			return{
				// 样式是否加载
				// isStyleAdd:false,
				// host:'http://10.0.1.33:8686'
				host:''
			}
		},
		methods:{
			initData(){
				$.ajax({
					url: this.$public.myHost+'/about/content/'+this.$route.params.id+'.html',

				})
				.done(function(result) {
					// console.log($(result))
					var div = $('<div></div>')
					div.append($(result))

					var content = div.find('section.moduleTab.mt20.contractDetail')


					$(content).find('.register_ad').remove()
					// console.log(content)
					$('.notice').append(content)

				})

			}
		},
		mounted(){
			window.Hub.$emit('refresh', null);
			window.Hub.$emit('setTitle', "日常公告", false, null, ' ', null)
			window.Hub.$emit('setFooter',false);

			$('.mint-loadmore').css('background', 'white');
			this.initData();
		},
		beforeRouteLeave(to,from,next){
			$('.mint-loadmore').removeAttr('style')
			next();
		}
	}
</script>

<style lang="scss" type="text/css">
	.notice {
		h2{
			text-align:center;
			line-height:100px;
		}
		#noticeText{
			padding:0 20px;
		}
		p.mt20{
			padding:0 20px;
		}
	}
</style>