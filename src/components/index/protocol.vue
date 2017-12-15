<template>
	<div class="protocol">

	</div>
</template>
<script>
	export default{
		data(){
			return {

			}
		},
		mounted(){
			window.Hub.$emit('refresh', null);
			window.Hub.$emit('setTitle', this.$config.info.appName+"注册协议", false, null, ' ', null)
			window.Hub.$emit('setFooter',false);
			$('.mint-loadmore').css('background','white')
			$.ajax({
				url: this.$public.myHost+'/agreement/xnService.html',
				// url: 'http://10.0.20.101/agreement/xnService.html',
			})
			.done((result) => {
				// console.log(result)
				// console.log($(result));

				var div = document.createElement('div')
				$(div).append($(result))
				var content = $(div).find('section.moduleTab.mt20')
				$(content).find('a').remove();

				document.getElementsByClassName('protocol')[0].style.padding = '25px 15px'

				$('.protocol').append(content)
			})
			.fail(function() {
				// console.log("error");
			})
			.always(function() {
				// console.log("complete");
			});

		},
		beforeRouteLeave(to,from,next){
			$('.mint-loadmore').removeAttr('style')
			
			next();
		}

	}
</script>

<style lang="scss" type="text/css">
    .ragmt span{font-size:12px !important;}
    .mt20 {margin-top: 5px;}
</style>