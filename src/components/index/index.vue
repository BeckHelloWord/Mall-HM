<template>
	<div class="index">
		<div class="title">
			{{$config.info.appName}}
			<div class="indexMessage" @click="toMessage">
				<i class="iconfontLogin icon-sound"></i>
			</div>
		</div>
		<banner v-if="bannerList>0" :banner='bannerList' :height='"375px"'></banner>
		<div v-else>
			<img src="../../assets/images/banner_default.jpg" alt="" width="100%">
		</div>

		<div class="recommend">
			<ul class="clearfix">
				<li>
					<router-link to='/index/guide'>
						<b>安全保障</b>
						大数据风控安全体系
					</router-link>
				</li>
				<li>
					<router-link to="/home/packet">
						<b>我的红包</b>
						投资抵扣更实惠
					</router-link>
				</li>
			</ul>
		</div>
		<div class="rookie" v-show="!$public.Auth.get()">
			<router-link to="/index/register">
			<img src="../../assets/images/rookie.jpg" alt="" >
			</router-link>
		</div>
		<router-link to='/invest/brisk'>
			<div class="brisk">
				
				<span class="brisk-title">历史年利率</span>
				<h2>{{integer}}<span class="point">{{decimal}}%</span></h2>
				<p class="info">灵活投资，存取随心，超高利率</p>
				<p class="showMore">点击查看更多></p>
			</div>
		</router-link>
	</div>
</template>

<script>
	import banner from '../public/banner'
	import { Swipe, SwipeItem } from 'mint-ui';

	export default {
		components:{
			banner,
			Swipe,
			SwipeItem
		},
		data: function() {
			return {
				bannerList:[],
				investList:[],
				currentCount:0,
				interval:null,
				timeout:null,
				integer:0,
				decimal:".00"
			}
		},
		methods: {
			toMessage(){
				this.$router.push("/home/message");
			},
			initData() {
				this.$public.API_GET({
					url : 'homePage',
					data:{
						distributionChannel:this.$config.appSource,
                        max:2,
					},
					success : (result) => {
						this.bannerList=result.data.indexList;
						this.investList=result.data.borrowList;
						this.integer = result.data.wealth.wealthYearRate.split(".")[0]
						this.decimal = result.data.wealth.wealthYearRate.split(".")[1]?"." + result.data.wealth.wealthYearRate.split(".")[1]:".00"
					}
				});
			}
		},
		mounted: function() {
			window.Hub.$emit('refresh', null);
			// window.Hub.$emit('setTitle', this.$config.info.appName, false, null, false, null)
			window.Hub.$emit('hideHeader');
			window.Hub.$emit('setFooter',true);
			this.initData();
			// window.Hub.$emit('showHeader')

		},
		destroyed:function(){
			clearTimeout(this.timeout)
			clearInterval(this.interval)
		}
	}
</script>

<style lang="scss" scoped="" type="text/css">
@import "../../assets/skin";


/*首页*/

.index {
	position: relative;
	.title{
		position: absolute;
		color: #333333;
		font-size: pxToRem(30);
		text-align: center;
		width: 100%;
		padding: pxToRem(18) 0;
		.indexMessage{
			position: absolute;
			right: pxToRem(18);
			top: pxToRem(18);
			font-size: pxToRem(32);
			color: #f6aa2d;
		}
	}
    .notice {
        height: 30px;
        overflow:hidden;
        font-size: pxToRem(  14*2);
        background-color: white;
        padding: 0 pxToRem(  14*2);
        ul {
            max-width: 92%;
            list-style: none;
            transition:all 1s;
            -webkit-transform: all 1s;
               -moz-transform: all 1s;
                -ms-transform: all 1s;
                 -o-transform: all 1s;


            li{
                // height:100%;
              // padding-left: pxToRem(  30*2);
              a{
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                background: url(../../assets/images/speaker.png) no-repeat left 7px;
                background-size: 16px;
                text-indent: pxToRem(  30*2);
                display:block;
                line-height: pxToRem(60);
                color: $red;

              }
            }

        }
	}
	.rookie{
		margin:    pxToRem(14*2) 0;
		img{
			width: 100%;
		}
	}
	.brisk{
		margin-bottom: pxToRem(32);
		background-color: white;
		text-align: center;
		padding-top: pxToRem(28);
		.brisk-title{
			font-size:  pxToRem(24);
			font-weight: normal;
			color: #999999;
			position: relative;
			&:before{
				display: block;
				content: "";
				position: absolute;
				height: 6px;
				width:6px;
				border-radius: 100%;
				background-color: #999;
				left: 0;
				top:50%;
				margin-left: -15px;
				margin-top: -2.5px;
			}
			&:after{
				display: block;
				content: "";
				position: absolute;
				height: 6px;
				width:6px;
				border-radius: 100%;
				background-color: #999;
				right: 0;
				top:50%;
				margin-right: -15px;
				margin-top: -2.5px;
			}
		}
		h2{
			font-size:  pxToRem(96);
			color: $e71c18;
			font-weight: normal;
			padding-top: 5px;
			.point{
				font-size: pxToRem(60);
				font-weight: normal;
			}
		}
		.info{
			color: #666666;
			font-size:  pxToRem(30);
		}
		.showMore{
			padding: pxToRem(14) 0 pxToRem(30) 0;
			color: #999999;
		}
	}
    .recommend {
        margin:    pxToRem(  14*2) 0;
        background-color: white;
        ul {
            list-style: none;
            padding:    pxToRem(  14*2);
            li {
                float: left;
                width: 50%;
                color: #666;
				box-sizing: border-box;
				text-align: left;
                &:nth-child(1) {
                    padding-right: 4%;
                    &>a::after {
                        content: ' ';
                        display: block;
                        width:    pxToRem(  36*2);
                        height:    pxToRem(  36*2);
                        position: absolute;
                        top: 0;
                        right: 0;
                        background: url(../../assets/images/safe.png) no-repeat;
                        background-size: 100%;
                    }
                }
                &:nth-child(2) {
                    padding-left: 4%;
                    border-left:   pxToRem(   1*2) solid #dedede;
                    &>a::after {
                        content: ' ';
                        display: block;
                        width:    pxToRem(  36*2);
                        height:    pxToRem(  36*2);
                        position: absolute;
                        top: 0;
                        right: 0;
                        background: url(../../assets/images/red.png) no-repeat;
                        background-size: 100%;
                    }
                }
                a {
                    display: block;
                    width: 100%;
                    font-size:    pxToRem(  12*2);
                    position: relative;
                    b {
                        color: #000;
                        display: block;
                        font-size:    pxToRem(  16*2);
                        font-weight: normal;
                    }
                }
            }
        }
    }
}

</style>
