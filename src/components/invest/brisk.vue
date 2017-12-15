<template>
	<div class="briskList t_c">
		<div class="title">{{$public.info.briskLang}}</div>
		<div class="explain t_r">
			<router-link to="/invest/brisk-explain">产品说明</router-link>
		</div>
		<div class="rate">{{brisk.wealthYearRate | formatInteger}}<span>.{{brisk.wealthYearRate | formatDecimals}}%</span></div>
		<div class="rate-txt">历史年利率</div>
		<ul class="money clearfix">
			<li>
				<p>{{isLogin ? (brisk.memberSurplusAmount ? brisk.memberSurplusAmount : "0.00") : brisk.wealthSurplusAmount}}</p>
				<p>可申请额度(元)</p>
			</li>
			<li>
				<p>{{brisk.wealthInvestMin}}</p>
				<p>起投金额(元)</p>
			</li>
		</ul>
		<div class="advantage">
			<dl>
				<dt><img src="../../assets/images/brisk/advantage-01.png" alt="" /></dt>
				<dd>
					<h3>存取随心</h3>
					<p>投资门槛低，100元起投</p>
					<p>期限灵活，随时可申请赎回</p>
				</dd>
			</dl>
			<dl>
				<dt><img src="../../assets/images/brisk/advantage-02.png" alt="" /></dt>
				<dd>
					<h3>安全无忧</h3>
					<p>借款项目严格审核，安全有保障</p>
					<p>资金分级投资，风险更低</p>
				</dd>
			</dl>
			<dl>
				<dt><img src="../../assets/images/brisk/advantage-03.png" alt="" /></dt>
				<dd>
					<h3>超高收益</h3>
					<p>高出余额宝0.6%收益率</p>
					<p>当日计息，收益次日自动转入账户余额</p>
				</dd>
			</dl>
		</div>
		<template v-if="isLogin">
				<router-link to="/invest/brisk-detail" class="btn btn-bottom" v-if="brisk.investButtonStatus == 'use'">立即申购</router-link>
				<div class="btn btn-bottom disabled" v-else-if="brisk.investButtonStatus == 'over'">用户额度已用完</div>
				<div class="btn btn-bottom disabled" v-else>平台已售罄</div>
		</template>

		<template v-else>
			<router-link to="/index/login?redirect=/invest/brisk" class="btn btn-bottom" v-if="brisk.wealthButtonStatus == 'invest'">
			立即申购</router-link>
			<div class="btn btn-bottom disabled" v-else>平台已售罄</div>
		</template>
	</div>
</template>

<script>
	/*
	 * 短期投资计划介绍(未登录)
	 * 投资列表用
	 * wd_api/wealthApp/showWealthProductOn
	 * 参数：
	 *   无
	 * 返回参数：
	 * Map的结构：
	 * nowDay 服务器时间 yyyy.MM.dd
	 * wealthYearRate 年化收益率
	 * wealthRateIncome 每万元收益
	 * wealthInvestMin 起投金额
	 * wealthSurplusAmount 平台剩余可投金额
	 * wealthButtonStatus 投资按钮状态
	 *                      invest：可投资
	 *                      done：平台已售罄
	 * wealthMessage  提示信息 （可换行） "短期投资计划申购额度已抢完"
	 *                          "您的今日投资额度已用完\n去看看其他高收益产品吧~！"
	 * 
	 * 
	 */
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
				brisk: {
					wealthYearRate: "5.50",
					wealthSurplusAmount: "0.00",
					wealthInvestMin: "100.00"
				},
				isLogin: false
			}
		},
		methods: {
			getData(finishFun) {
				var url = "showWealthProductOn";
				if (this.$public.Auth.get()) {
					url = "showBriskProduct";
					this.isLogin = true;
				}
				this.$public.API_GET({
					url: url,
					success: (result) => {
						if (typeof(finishFun) == "function") {
							finishFun()
						}
						if (!result.isSuccess) {
							Toast(result.message);
							return false;
						}
						this.brisk = result.data;
					}
				});
			}
		},
		mounted: function() {
			this.getData();
			window.Hub.$emit('refresh', this.getData);
			window.Hub.$emit('setTitle', this.$public.info.brisk, true, null, " ", null);
			window.Hub.$emit('setFooter', true);
			window.Hub.$emit('showHeader')
		}
	}
</script>

<style lang="scss" scoped="" type="text/css">
	@import "../../assets/skin";
	.briskList {
		padding-bottom: pxToRem(60);
		margin-bottom: 30px;
		font-size: pxToRem(22);
		background-color: $white;
		.title {
			line-height: 1;
			padding-top: pxToRem(26);
			font-size: pxToRem(26);
		}
		.explain a {
			display: inline-block;
			height: pxToRem(44);
			line-height: pxToRem(44);
			padding: 0 pxToRem(24);
			color: $red;
			background-color: $e9f1ff;
			border-radius: pxToRem(40) 0 0 pxToRem(40);
		}
		.rate {
			margin-top: pxToRem(18);
			line-height: pxToRem(100);
			font-size: pxToRem(100);
			color: $e71c18;
			span {
				font-size: pxToRem(68);
			}
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
		.advantage dl {
			padding: pxToRem(30) 0;
			border-top: 1px solid $ft-dedede;
			margin: 0 pxToRem(26);
			overflow: hidden;
			dt {
				float: left;
				width: pxToRem(252);
				height: pxToRem(118);
				line-height: pxToRem(118);
				img {
					height: 100%;
				}
			}
			dd {
				line-height: 1.6;
				text-align: left;
				h3 {
					margin-bottom: pxToRem(10);
					font-size: pxToRem(26);
					font-weight: normal;
				}
				p {
					color: $ft-999;
				}
			}
		}
		.btn-bottom{
			margin-top: pxToRem(30);
		}
	}
</style>