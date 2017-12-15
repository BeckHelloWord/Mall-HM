<template>
	<div class="briskList">
		<div class="brisk-top t_c">
			<div class="rate">{{brisk.briskYesterdayProfitAmount}}</div>
			<div class="rate-txt">昨日收益(元)</div>
			<ul class="money clearfix">
				<li>
					<p>{{brisk.briskTotalAmount}}</p>
					<p>在投金额(元)</p>
				</li>
				<li>
					<p>{{brisk.briskTotalProfitAmount}}</p>
					<p>累计收益(元)</p>
				</li>
			</ul>
		</div>
		<div class="earnings-list">
			<ul class="canvas-bg">
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
			<div class="chart t_c clearfix">
				<dl>
					<dd></dd>
					<dt>8-16</dt>
				</dl>
				<dl>
					<dd></dd>
					<dt>8-17</dt>
				</dl>
				<dl>
					<dd></dd>
					<dt>8-18</dt>
				</dl>
				<dl>
					<dd></dd>
					<dt>8-19</dt>
				</dl>
				<dl>
					<dd></dd>
					<dt>8-20</dt>
				</dl>
				<dl>
					<dd></dd>
					<dt>8-21</dt>
				</dl>
			</div>
		</div>
		<div class="particulars-list">
			<router-link to="">交易明细</router-link>
			<router-link to="">投标明细</router-link>
		</div>
		<template v-if="brisk.briskTotalAmount">
			<router-link to="/home/brisk-redeem" class="btn btn-bottom">立即赎回</router-link>
		</template>

		<template v-else>
			<div class="btn btn-bottom disabled">立即赎回</div>
		</template>
	</div>
</template>

<script>
	/*
	 * 短期投资计划主页
	 * wd_api/wealthApp/showBriskProduct
	 * 参数：
	 *   无
	 * 返回参数：
	 * Map的结构：
	 * showMessage 头部为投资过的用户提示信息
	 * briskStatus 用户短期投资计划状态 "none" : 未用过短期投资计划,
	 *                          "being": 有短期投资计划余额,
	 *                          "over": 加入过后来全退后,
	 *                          "longLongAgo": 加入过后来全退后超过30天
	 * briskTotalAmount    短期投资计划账户金额
	 * briskYesterdayProfitAmount  昨日收益
	 * briskTotalProfitAmount  累计收益
	 *
	 * briskLineUpStatus 排队中状态 无排队时返回  "undeal"：投资中  "redeeming"：赎回中
	 * briskLineUpProcess  赎回进度
	 * briskLineUpAmount 排队金额
	 *
	 * wealthYearRate 年化收益率
	 * wealthRateIncome 每万元收益
	 * wealthInvestMin 起投金额
	 * investButtonStatus 投资按钮状态 use：可投资 done：平台已售罄  over 用户额度已用完
	 * redeemButtonStatus 赎回按钮状态 use：可赎回 done：平台已售罄  over 用户额度已用完
	 *
	 * 以下变量有就显示，没有就不显示
	 * memberSurplusAmount 个人剩余可投金额
	 * wealthMessage  提示信息 （可换行） 8种提示语
	 */
	import {
		Toast
	} from 'mint-ui';
	export default {
		data: function() {
			return {
				brisk: {},
				list: {}
			}
		},
		methods: {
			getData(finishFun) {
				this.$public.API_GET({
					url: "showBriskProduct",
					success: (result) => {
						if (!result.isSuccess) {
							Toast(result.message);
							return false;
						}
						sessionStorage.setItem("briskTotalAmount", result.data.briskTotalAmount);
						this.brisk = result.data;
						this.getTransactionDetail(finishFun);
					}
				});
			},
			getTransactionDetail(finishFun) {
				this.$public.API_GET({
					url: "getMemberBriskAccountRecordList",
					success: (result) => {
						if (typeof(finishFun) == "function") {
							finishFun()
						}
						if (!result.isSuccess) {
							Toast(result.message);
							return false;
						}
						this.list = result.data;
					}
				});
			}
		},
		mounted: function() {
			this.getData();
			window.Hub.$emit('refresh', this.getData);
			window.Hub.$emit('setTitle', this.$public.info.briskLang, false, null, false, null);
			window.Hub.$emit('setFooter', false);
			window.Hub.$emit('showHeader')
		}
	}
</script>

<style lang="scss" scoped="" type="text/css">
	@import "../../assets/skin";
	.briskList {
		padding-bottom: pxToRem(60);
		font-size: pxToRem(22);
		.brisk-top {
			padding-top: pxToRem(60);
			background-color: $white;
			.rate {
				line-height: pxToRem(100);
				font-size: pxToRem(80);
				color: $e71c18;
			}
			.rate-txt {
				font-size: pxToRem(24);
				color: $ft-999;
			}
			.money {
				padding: pxToRem(45) 0;
				li {
					float: left;
					width: 50%;
					line-height: 1.6;
					box-sizing: border-box;
					&+li {
						border-left: 1px solid $ft-dedede;
					}
					p:first-child {
						font-size: pxToRem(36);
						color: $ft-333;
					}
					p:last-child {
						font-size: pxToRem(24);
						color: $ft-999;
					}
				}
			}
		}
		.earnings-list {
			position: relative;
			padding: pxToRem(40) pxToRem(30);
			margin-top: pxToRem(20);
			background-color: $white;
			.canvas-bg {
				position: absolute;
				left: pxToRem(30);
				top: pxToRem(40);
				right: pxToRem(30);
				z-index: 0;
				li {
					height: pxToRem(60);
					box-sizing: border-box;
					&:first-child {
						height: pxToRem(76);
					}
					&+li {
						border-top: 1px solid $ft-dedede;
					}
				}
			}
			.chart {
				position: relative;
				z-index: 10;
				dl {
					float: left;
					width: 16.66%;
					dt {
						height: pxToRem(60);
						line-height: pxToRem(60);
						border-top: 1px solid $f6ab2c;
						font-size: pxToRem(24);
						color: $ft-999;
					}
					dd {
						height: pxToRem(316);
					}
					&+dl {
						dd {
							border-left: 1px solid $ft-dedede;
						}
					}
				}
			}
		}
		.particulars-list {
			padding-left: pxToRem(30);
			margin-top: pxToRem(20);
			background-color: $white;
			a {
				position: relative;
				display: block;
				height: pxToRem(108);
				line-height: pxToRem(108);
				font-size: pxToRem(28);
				&+a {
					border-top: 1px solid $ft-dedede;
				}
				&:before {
					content: "";
					position: absolute;
					top: 50%;
					right: pxToRem(30);
					width: pxToRem(20);
					height: pxToRem(20);
					border: 1px solid $ft-dedede;
					border-width: pxToRem(4) pxToRem(4) 0 0;
					margin-top: - pxToRem(10);
					box-sizing: border-box;
					transform: rotate(45deg);
				}
			}
		}
	}
</style>