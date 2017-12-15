<template>
	<div class="subscribe">
		<div class="part">
			<dl>
				<dt>在投本金(元)</dt>
				<dd>{{briskTotalAmount}}</dd>
			</dl>
			<dl>
				<dt>可赎回金额(元)</dt>
				<dd>{{member.wealthCanRedeem}}</dd>
			</dl>
		</div>
		<div class="part">
			<dl>
				<dt>赎回金额(元)</dt>
				<dd>
					<input type="text" v-model="amount" maxlength="11" placeholder="请输入转出金额" />
					<a @click="setAll" href="javascript:void(0);">全部</a>
				</dd>
			</dl>
		</div>
		<div class="btn btn-bottom" @click="subForm" v-if="member.wealthCanRedeem">赎回到账户余额</div>
		<div class="btn btn-bottom disabled" v-else>赎回到账户余额</div>
	</div>
</template>

<script>
	  /**
     * 短期投资计划赎回
     * wd_api/wealthApp/redeemWealth
     * 参数：
     *   redeemAmount 赎回金额
     *   channel   渠道标识 1:ios  2:android
     * 返回参数：
     *  redeemAmount 赎回金额
     *  redeemTime 赎回时间
     */
	 /**
     * 短期投资计划赎回界面初始化
     * wd_api/wealthApp/showRedeemWealth
     * 参数：
     *   无
     * 返回参数：
     * Map的结构：
     * surplusAmount 平台可赎回金额
     * wealthRedeemDayMax 单人单日最高累计赎回金额
     * wealthCanRedeem 实际当日可赎回金额
     */
	import {
		Toast
	} from 'mint-ui';
	import layer from '../../../static/layer.js'
	export default {
		data: function() {
			return {
				briskTotalAmount: sessionStorage.getItem("briskTotalAmount"), // 在投添添金金额
				member: {}, // 初始化数据
				amount: "", // 投资金额
				briskLayer: null // 弹框
			}
		},
		methods: {
			getData(finishFun) {
				Public.API_GET({
					url: "showRedeemWealth",
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
				this.amount = this.member.wealthCanRedeem.split(".")[0];
			},
			subForm() {
				if (!this.amount) {
					this.layerFn("fail", "请输入赎回金额")
					return false;
				}
				if (this.amount > this.member.wealthCanRedeem) {
					this.layerFn("fail", "可用额度不足")
					return false;
				}
				Public.API_GET({
					url: "redeemWealth",
					data: {
						redeemAmount: this.amount,
						channel: 3
					},
					success: (result) => {
						if (!result.isSuccess) {
							this.layerFn("fail", result.message)
							return false;
						}
						this.getData();
						this.amount = "";
						this.layerFn("success", "赎回金额" + result.data.redeemAmount + "元")
					}
				});
			},
			layerFn(status, message) {
				var title = "赎回失败",
					aClass = "fail";
				if (status == "success") {
					title = "提交赎回申请成功";
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
			window.Hub.$emit('setTitle', "赎回", false, null, false, null);
			window.Hub.$emit('setFooter', false);
			window.Hub.$emit('showHeader')
		},
		watch: {
			amount: function(val, oldVal) {
				this.amount = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
				this.amount = this.amount.replace(/^\./g, ""); //验证第一个字符是数字而不是
				this.amount = this.amount.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
				this.amount = this.amount.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
				this.amount = this.amount.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
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