<template>
	<div class="subscribe">
		<div class="part">
			<ul class="step t_c clearfix">
				<li>
					<div><img src="../../assets/images/brisk/subscribe-01.png" alt="" /></div>
					<h3>16:00之前投资</h3>
					<p>{{time}}</p>
				</li>
				<li>
					<div><img src="../../assets/images/brisk/subscribe-02.png" alt="" /></div>
					<h3>开始计息</h3>
					<p>{{time}}</p>
				</li>
				<li>
					<div><img src="../../assets/images/brisk/subscribe-03.png" alt="" /></div>
					<h3>24:00收益到账</h3>
					<p>{{time}}</p>
				</li>
			</ul>
			<dl>
				<dt>可申购额度(元)</dt>
				<dd>{{member.wealthCanInvest}}</dd>
			</dl>
			<dl>
				<dt>当前历史年利率</dt>
				<dd>{{member.wealthYearRate}}%</dd>
			</dl>
		</div>
		<div class="part">
			<dl>
				<dt>账户余额(元)</dt>
				<dd>{{member.canUseMoney}}
					<router-link to="/home/bank/bindCard">充值</router-link>
				</dd>
			</dl>
			<dl>
				<dt>投资金额(元)</dt>
				<dd>
					<input type="text" v-model="amount" maxlength="11" :placeholder='member.wealthInvestMin + "元起投，1元递增"' />
					<a @click="setAll" href="javascript:void(0);">全部</a>
				</dd>
			</dl>
			<dl>
				<dt>预计每日收益(元)</dt>
				<dd><span>{{interest ? interest: "--"}}</span></dd>
			</dl>
		</div>
		<div class="btn btn-bottom" @click="subForm" v-if="member.wealthCanInvest">确认投资</div>
		<div class="btn btn-bottom disabled" v-else>确认投资</div>
		<div class="agreement t_c">点击“确认投资”即代表同意
			<router-link to="">{{$public.info.brisk}}服务协议</router-link>
		</div>
	</div>
</template>

<script>
	/*
	 * 短期投资计划投资界面初始化
	 * wd_api/wealthApp/showInvestWealth
	 * 参数：
	 *   无
	 * 返回参数：
	 * Map的结构：
	 * wealthYearRate 年化收益率
	 * wealthRateIncome 每万元收益
	 * wealthInvestMin 起投金额
	 * surplusAmount 平台可投金额
	 * wealthInvestDayMax 单人单日最高累计转入金额
	 * wealthCanInvest 实际当日可投金额
	 * wealthInvestDay  预计收益到账时间  格式化完成 YY-MM(星期几)
	 * canUseMoney  账户余额
	 */
	/*
	 * 短期投资计划投资
	 * wd_api/wealthApp/investWealth
	 * 参数：
	 *   investAmount 投资金额
	 *   channel   渠道标识 1:ios  2:android
	 * 返回参数：
	 * investAmount 投资金额
	 * investTime 投资时间
	 * interestBearingTime 开始计息时间
	 * paymentDate  到帐时间
	 * rechargeAmount 充值金额
	 */
	import {
		Toast
	} from 'mint-ui';
	import layer from '../../../static/layer.js'
	export default {
		data: function() {
			return {
				time: (new Date()).Format("yyyy.M.d"), // 时间
				member: {}, // 初始化数据
				amount: "", // 投资金额
				interest: 0, // 利息
				briskLayer: null // 弹框
			}
		},
		methods: {
			getData(finishFun) {
				Public.API_GET({
					url: "showInvestWealth",
					success: (result) => {
						if (typeof(finishFun) == "function") {
							finishFun();
						}
						if (!result.isSuccess) {
							Toast(result.message);
							return false;
						}
						this.member = result.data;
					}
				});
			},
			setAll() {
				this.amount = this.member.canUseMoney.split(".")[0];
			},
			subForm() {
				if (!this.amount) {
					this.layerFn("fail", "请输入投资金额")
					return false;
				}
				if (this.amount > this.member.canUseMoney) {
					this.layerFn("fail", "可用余额不足，请充值")
					return false;
				}
				Public.API_GET({
					url: "investWealth",
					data: {
						investAmount: this.amount,
						channel: 3
					},
					success: (result) => {
						if (!result.isSuccess) {
							this.layerFn("fail", result.message)
							return false;
						}
						this.getData();
						this.amount = "";
						this.layerFn("success", "成功申购" + result.data.investAmount + "元<br />预计" + result.data.paymentDate + "收益到账")
					}
				});
			},
			layerFn(status, message) {
				var title = "提交投资失败",
					aClass = "fail";
				if (status == "success") {
					title = "恭喜您，提交成功";
					aClass = "success";
				}
				this.briskLayer = layer.dialog({
					content: '<div class="brisk-layer t_c">' +
						'<div class="title">' + this.$public.info.siteName + '</div>' +
						'<div class="img-icon ' + aClass + '"></div>' +
						'<h3>' + title + '</h3>' +
						'<p>' + message + '</p>' +
						'<div class="layer-btn clearfix">' +
						'<span class="fl js-go">继续购买</span>' +
						'<span class="fr js-know">我知道了</span>' +
						'</div>' +
						'</div>'
				});
				$(".js-go").on("touchstart", function() {
					layer.close(this.briskLayer);
				});
				$(".js-know").on("touchstart", function() {
					layer.close(this.briskLayer);
					history.go(-1);
				});
			}
		},
		mounted: function() {
			if (!this.$public.Auth.get()) {
				this.$router.push({
					path: '/index/login',
					query: {
						"redirect": "/invest/brisk-detail"
					}
				});
				return false;
			}
			this.getData();
			window.Hub.$emit('setTitle', "申购", false, null, false, null);
			window.Hub.$emit('setFooter', false);
			window.Hub.$emit('showHeader')
		},
		watch: {
			amount: function(val, oldVal) {
				this.amount = val.replace(/[^\d]/g, '');
				const interest = this.amount * this.member.wealthYearRate / 100 / 365 + "";
				if (this.amount >= 100) {
					this.interest = interest.split(".")[0] + "." + interest.split(".")[1].slice(0, 2)
				} else {
					this.interest = 0;
				}
			}
		}
	}
</script>

<style lang="scss" type="text/css">
	@import "../../assets/skin";
	.subscribe {
		.part {
			padding-left: pxToRem(30);
			background-color: $white;
			&+.part {
				margin-top: pxToRem(20);
			}
		}
		.step {
			padding: pxToRem(40) pxToRem(30) pxToRem(40) 0;
			border-bottom: 1px solid $ft-dedede;
			li {
				position: relative;
				float: left;
				width: 33.33%;
				line-height: 1.6;
				box-sizing: border-box;
				div {
					display: inline-block;
					width: pxToRem(86);
					height: pxToRem(86);
					line-height: pxToRem(46);
					padding: pxToRem(20);
					border: 1px solid $e9f1ff;
					border-radius: 50%;
					box-sizing: border-box;
					img {
						max-width: 100%;
						max-height: 100%;
					}
				}
				h3 {
					padding-top: pxToRem(10);
					font-size: pxToRem(26);
					font-weight: normal;
				}
				p {
					color: $ft-999;
				}
				&+li:before {
					content: "";
					position: absolute;
					left: calc(2.41rem - 50%);
					top: pxToRem(43);
					width: calc(100% - 4.82rem);
					height: 1px;
					background-color: $e9f1ff;
				}
			}
		}
		dl {
			height: pxToRem(108);
			line-height: pxToRem(108);
			font-size: pxToRem(28);
			overflow: hidden;
			&+dl {
				border-top: 1px solid $ft-dedede;
			}
			dt {
				float: left;
			}
			dd {
				position: relative;
				padding-left: pxToRem(236);
				font-size: pxToRem(30);
				color: $ft-333;
				a {
					position: absolute;
					right: pxToRem(30);
					top: 0;
					font-size: pxToRem(28);
					color: $red;
				}
				input {
					width: 100%;
					height: 100%;
					border: none;
					font-size: inherit;
				}
				::-webkit-input-placeholder,
				span {
					font-size: pxToRem(26);
					color: $ft-999;
				}
			}
		}
		.agreement {
			padding-top: pxToRem(30);
			font-size: pxToRem(24);
			color: $ft-999;
			a {
				color: $red;
				text-decoration: underline;
			}
		}
	}
	.brisk-layer {
		// position: fixed;
		// left: pxToRem(50);
		// top: 50%;
		// right: pxToRem(50);
		// margin-top: - pxToRem(640);
		background-color: $white;
		border-radius: pxToRem(15);
		.title {
			height: pxToRem(88);
			line-height: pxToRem(88);
			font-size: pxToRem(28);
			color: $red;
			background: url(../../assets/images/brisk/layer-title.png) no-repeat center center;
			background-size: 100% 100%;
		}
		.img-icon {
			height: pxToRem(140);
			margin-top: pxToRem(40);
			background: url(../../assets/images/brisk/fail.png) no-repeat center center;
			background-size: auto 100%;
		}
		h3 {
			height: auto;
			line-height: 1;
			padding: pxToRem(30) 0 pxToRem(20);
			font-size: pxToRem(36);
			font-weight: normal;
		}
		p {
			padding: 0 pxToRem(32);
			font-size: pxToRem(24);
			color: $ft-999;
		}
		.layer-btn {
			padding: pxToRem(60) pxToRem(32);
			span {
				display: block;
				width: 48%;
				height: pxToRem(80);
				line-height: pxToRem(80);
				text-align: center;
				font-size: pxToRem(32);
				color: $white;
				background-color: $red;
				border-radius: pxToRem(80);
				&+span {
					color: $red;
					background-color: $e9f1ff;
				}
			}
		}
	}
	.layui-m-layerchild {
		background-color: transparent;
	}
	.layui-m-layercont {
		padding: 0;
	}
</style>