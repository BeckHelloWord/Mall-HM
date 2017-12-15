<template>
	<div class="record-list">
		<ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100">
			<li class="moneyItem">
				<ul v-for='(k,v) in items'>
					<li>
						<h3><span>{{v | formatDate}}</span></h3>
						<ul>
							<li :class="item.briskType" v-for='item in k'>
								<div class="clearfix">
									<div>
										<p>{{item.briskTypeDescription}}</p>
										<p>{{item.briskOperateDate}}</p>
									</div>
									<div>
										{{item.briskType=="rollOut"?'+':'-'}}{{item.briskAmount | formatMoney}}
									</div>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</li>
		</ul>
		<empty v-show='isShow' :showImg=true :padding='"120px"'></empty>
	</div>
</template>
<script>
	/**
	 * 用户短期投资计划资金流水
	 * wd_api/wealthApp/getMemberBriskAccountRecordList
	 * 参数：
	 * 以下参数 均为选填
	 *   briskType 状态 投资：rollIn,转出：rollOut,收益：profit
	 *   fromDate  开始时间  yyyyMMdd
	 *   toDate    结束时间  yyyyMMdd
	 *   offset    开始位置
	 *   max       最大条数
	 * 返回参数：
	 *  List < Map >  用户产品账户业务流水
	 *      briskOperateDate： 操作时间  yyyy.MM.dd HH:mm
	 *      briskOperateDay ： 操作时间  MM.dd
	 *      briskAmount： 操作金额 0.00
	 *      briskType： 流水类型 投资：rollIn,转出：rollOut,收益：profit
	 *      briskTypeDescription：流水类型文字 投资：rollIn,转出：rollOut,收益：profit
	 *      briskTotalAmount：总金额 0.00
	 */
	import {
		InfiniteScroll
	} from 'mint-ui';
	import empty from '../public/empty'
	export default {
		components: {
			InfiniteScroll,
			empty
		},
		data: function() {
			return {
				items: {},
				typeName: 'all',
				offset: 0,
				max: 20,
				size: 20,
				loading: false,
				totalCount: 0,
				preTotalCount: 0,
				isShow: false
			}
		},
		methods: {
			loadMore() {
				if (this.totalCount != this.preTotalCount) {
					this.preTotalCount = this.totalCount;
					this.loading = true;
					this.loadMessage();
				} else {
					return false;
				}
			},
			loadMessage() {
				this.$public.API_GET({
					url: 'getMemberBriskAccountRecordList',
					data: {
						offset: this.offset,
						max: this.max
					},
					success: (result) => {
						if (result.data.length == 0 && this.max == 20) {
							this.isShow = true
						}
						// 获取第一次totalcount
						this.totalCount = result.totalCount;
						// console.log(this.typeName)
						// console.log(result)
						var obj = {};
						result.data.forEach(v => {
							// console.log(v.dateCreated.slice(0, 7));
							var str = v.briskOperateDate.slice(0, 8)
							if (typeof obj[str] == 'undefined') {
								obj[str] = []
							}
							obj[str].push(v)
						})
						this.max += this.size;
						this.items = obj;
						this.loading = false;
						console.log(this.items)
					}
				});
			}
		},
		mounted: function() {
			this.loadMessage();
			window.Hub.$emit('refresh', this.loadMessage);
			window.Hub.$emit('setTitle', "交易明细", false, null, false, null);
			window.Hub.$emit('setFooter', false);
			window.Hub.$emit('showHeader')
		},
		watch: {
			type(to, from) {
				// 跳转路由的时候清零
				// console.log(111)
				// window.scrollTo(0)
				this.offset = 0;
				this.max = 20;
				this.isShow = false;
				this.typeName = to;
				this.loadMessage();
				// 置顶
				$(window).scrollTop(0)
			},
		}
	}
</script>


<style lang="scss" type="text/css">
	@import "../../assets/skin";
	.moneyItem {
		padding: pxToRem(10*2);
		ul:first-child {
			span::after {
				content: ' ';
				display: block;
				width: pxToRem(20);
				height: pxToRem(20);
				position: absolute;
				background: #EDF0F3;
				top: pxToRem(-15);
				left: pxToRem(-10);
			}
		}
		&>ul {
			border-left: pxToRem( 1*2) dashed #E6E9EC;
			li {
				h3 {
					height: pxToRem(30*2);
					display: table-cell;
					vertical-align: middle;
					span {
						display: inline-block;
						background-color: white;
						color: $red;
						padding-left: pxToRem(20*2);
						padding-right: pxToRem(10);
						border-radius: 2px;
						font-weight: normal;
						position: relative;
						&::before {
							content: ' ';
							display: inline-block;
							position: absolute;
							height: pxToRem(18*2);
							width: pxToRem(20*2);
							left: pxToRem(-5*2);
							background: url(../../assets/images/money01.jpg) no-repeat center;
							background-size: pxToRem(30*2) pxToRem(19*2);
						}
					}
				}
				ul {
					li {
						padding-left: pxToRem(10*2);
						&>div {
							background-color: white;
							border-bottom: pxToRem( 1*2) solid #F1F4F9;
							div {
								padding: pxToRem(10*2);
								&:first-child {
									float: left;
									line-height: pxToRem(20*2);
									padding-left: pxToRem(50*2);
									p {
										&:first-child {
											color: black;
											font-size: pxToRem(14*2);
										}
										&:last-child {
											color: #b8b8b8;
											font-size: pxToRem(12*2);
										}
									}
								}
								&:last-child {
									float: right;
									line-height: pxToRem(35*2);
								}
							}
						} // border-left:  pxToRem( 1*2) dashed #E6E9EC;
						// border-left:  pxToRem( 1*2) dashed black;
						&.rollIn {
							&>div {
								background: white url(../../assets/images/money03.jpg) no-repeat pxToRem(18*2);
								background-size: pxToRem(20*2) pxToRem(20*2);
								div:last-child {
									color: $e71c18;
								}
							}
						}
						&.rollOut {
							&>div {
								background: white url(../../assets/images/money02.png) no-repeat pxToRem(18*2);
								background-size: pxToRem(20*2) pxToRem(20*2);
								div:last-child {
									color: $ft-84BB25;
								}
							}
						}
						&.profit {
							&>div {
								background: white url(../../assets/images/money01.png) no-repeat pxToRem(18*2);
								background-size: pxToRem(20*2) pxToRem(20*2);
								div:last-child {
									color: $e71c18;
								}
							}
						}
					}
				}
			}
		}
	}
</style>