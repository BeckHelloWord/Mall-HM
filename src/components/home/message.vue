<template>
	<div class="message">
		<ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
			<li v-for='item in messageList'>
				<p v-html='item.content'></p>
				<p>{{item.dateCreated}}</p>
			</li>

		</ul>
        <empty v-show='messageList.length==0' :showImg='true' :padding='"120px"'></empty>
	</div>
</template>
<script>
	import { InfiniteScroll } from 'mint-ui';
    import empty from '../public/empty';
	export default{
		components:{
			InfiniteScroll,
            empty
		},
		data:function(){
			return {
				messageList:[0],
				loading:false,
				offset:0,
				max:15,
				total:0,

                // 第一次
                isFirst:0
			}
		},
		methods:{
			loadMore(){
				this.loading=true
				if(this.offset<this.total){
					this.offset+=this.max
					this.loadMessage()
				}else{
					this.loading=false;
					return false;
				}
			},
			loadMessage(){
                this.isFirst++;
				this.$public.API_GET({
					url : 'message',
					data:{
						offset:this.offset,
						max:this.max
					},
					success : (result) => {
                        if(this.isFirst == 1){
                            this.messageList.shift();
                        }
						// console.log(result.data)
						result.data.forEach(v=>{
							this.messageList.push(v)
						})
						this.total=result.totalCount;
						this.loading=false;
					}
				});
			}
		},
		mounted: function() {

			window.Hub.$emit('refresh', null);
			window.Hub.$emit('setTitle', "消息中心", false, null, ' ', null)
			window.Hub.$emit('setFooter',false);
			this.loadMessage();
		},

	}
</script>

<style lang="scss" type="text/css">
/*消息中心*/
@import "../../assets/skin";
.message {
    ul {
        padding:   pxToRem( 10*2)   pxToRem( 16*2);
        list-style: none;
        background-color: #EDF0F3;
        li {
            background-color: white;
            padding:  pxToRem( 10*2) pxToRem( 16*2);
            margin-bottom:   pxToRem( 10*2);
            font-size:   pxToRem( 14*2);
            p {
                text-align:justify;
                color: #000;
                line-height:   pxToRem( 25*2);
                &:first-child a {
                    color: $red;
                    text-decoration: underline;
                    // word-break: break-all;
                }
                &:last-child {
                    font-size:   pxToRem( 12*2);
                    color: #8291a5;
                }
            }
        }
    }
}

</style>