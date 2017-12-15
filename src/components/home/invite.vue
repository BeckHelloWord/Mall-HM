<template>
	<section class="invite">
		<div class="inviteTop">
			<div class="inviteTopTitle">
				<ul class="clearfix">
					<li class="fl">
						<p class="fz1">今日发放奖金(元)</p>
						<p class="num" :data-id="init.willAmount">
							<div v-if="init.willAmount">{{init.willAmount}}</div>
							<div v-else>{{init.amount}}</div>
						</p>
					</li>
					<li class="fl">
						<p class="fz1">累计发放奖金(元)</p>
						<p class="num">{{init.sum}}</p>
					</li>
				</ul>
			</div>
			<div class="inviteTopGrade leftRight" v-if="init.grade">
				<router-link to="/home/inviteRule">
					<img alt="" :src='"../../assets/images/invite/icon_crown_"+init.grade+".png"' />
					<span>当前等级为：{{init.gradeName}}</span>
				</router-link>
			</div>
		</div>
		<div class="middle">
			<div class="friend">
				<ul class="clearfix">
					<li class="fl">
						<router-link to="/home/inviteList">
							<p>一级好友({{init.memberCountOne}}),已投资</p>
							<span>{{init.amountOne}}元</span>
						</router-link>
					</li>
					<li class="fl">
						<p>二级好友({{init.memberCountTwo}}),已投资</p>
						<span>{{init.amountTwo}}元</span>
					</li>
				</ul>
			</div>
			<a :href='"tel:" + $config.info.phone ' class="tel link" :data-android-url='"baoxiang://APPDial&phonenumber=tel:"+ $config.info.phone'>
				<font>成为理财师&nbsp;&nbsp;&nbsp;&nbsp;</font>
				<span>认证后享更多权益</span>
				<i><img alt="" src="../../assets/images/invite/tel.png" /></i>
			</a>
			<div class="code link" v-clipboard:copy="init.recommendCode" v-clipboard:success="onCopy" v-clipboard:error="onError">
				<font>你的邀请码&nbsp;&nbsp;&nbsp;&nbsp;</font>
				<span>{{init.recommendCode}}</span>
				<i><img alt="" src="../../assets/images/invite/copy.png" /></i>
			</div>
		</div>
		<div class="record leftRight">
			<div class="img">
				<img alt="" src="../../assets/images/invite/grade.png" />
			</div>
			<div class="mBottom">
				<ul class="recordTitle leftRight">
					<li class="clearfix">
						<span class="s1">排名</span>
						<span class="s2">账号</span>
						<span class="s3">累计获得奖金(元)</span>
					</li>
				</ul>
				<ul class="recordPerson leftRight">
					<li v-for="(item,i) in list" class="clearfix">
						<span class="s1" v-if="i == 0"><img src="../../assets/images/fina/h5-ranking1.png" alt></span>
						<span class="s1" v-else-if="i == 1"><img src="../../assets/images/fina/h5-ranking2.png" alt></span>
						<span class="s1" v-else-if="i == 2"><img src="../../assets/images/fina/h5-ranking3.png" alt></span>
						<span class="s1" v-else>{{i+1}}</span>
						<span class="s2 clearfix"><img v-if="item.memberFace" v-lazy="'//bxwd-img.oss-cn-hangzhou.aliyuncs.com/'+item.memberFace" /><i v-else class="iconfontHM icon-touxiang fl"></i>{{item.memberName}}</span>
						<span class="s3">{{item.fund}}万</span>
					</li>
				</ul>
				<div class="noData" v-show='list.length==0'>
					暂无数据
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	import layer from "../../../static/layer.js";
	import {
		Lazyload
	} from "mint-ui";
	Vue.use(Lazyload);
	export default {
		data: function() {
			return {
				init: {},
				list: [],
				share: {}
			};
		},
		methods: {
			initData: function() {
				this.$public.API_GET({
					url: "getInvite",
					data: {},
					success: result => {
						if (result.isSuccess) {
							this.init = result.data;
						}
					}
				});
			},
			records: function() {
				this.$public.API_GET({
					url: "inviteFriendRankOn",
					success: result => {
						if (result.isSuccess) {
							this.list = result.data;
						}
					}
				});
			},
			inviteBtnFun: function() {
				this.$public.API_GET({
					url: "getMemberRecommend",
					success: result => {
						if (result.isSuccess) {
							this.share = result.data;
						}
					}
				});
			},
			addFooter(url) {
				var it = this;
				var packet = Vue.extend({
					data: function() {
						return {
							text: "推荐好友，让TA帮你赚钱"
						};
					},
					methods: {
						shareBtnFun() {
							this.$public.shareJs({
								title: it.share.title,
								desc: it.share.description,
								link: it.share.recommendUrl,
								imgUrl: "//bxwd-img.oss-cn-hangzhou.aliyuncs.com/" + it.share.coverUrl
							});
						}
					},
					template: `<div class="shareBtn" @click="shareBtnFun"><div class="btn btn-bottom">{{this.text}}</div><div class="shareBtnBottom"></div></div>`
				});
				var packetIntance = new packet({
					el: document.createElement("div")
				});
				document.body.appendChild(packetIntance.$el);
			},
			//复制成功
			onCopy: function(e) {
				layer.dialog({
					content: "邀请码复制成功：" + e.text,
					time: 2000
				});
			},
			//复制失败
			onError: function(e) {
				layer.dialog({
					content: "复制失败，长按复制",
					time: 2000
				});
			}
		},
		mounted() {
			window.Hub.$emit("refresh", null);
			window.Hub.$emit("setTitle", "邀请好友", false, null, " ", null);
			window.Hub.$emit("setFooter", false);
			this.initData();
			this.records();
			this.inviteBtnFun();
			this.addFooter(this.recommendUrl);
		},
		beforeRouteLeave: function(to, from, next) {
			$(".shareBtn").remove();
			next();
		}
	};
</script>

<style lang="scss" type="text/css">
	@import "../../assets/skin";
	.invite {
		font-size: pxToRem(24);
		.inviteTop {
			.inviteTopTitle {
				text-align: center;
				line-height: 1.8;
				color: #fff;
				background: #4183fe;
				ul {
					padding: pxToRem(40) 0 pxToRem(50);
				}
				li {
					position: relative;
					width: 50%;
					.num {
						font-size: pxToRem(44);
						line-height: 1;
					}
				}
				li:first-child::before {
					content: "";
					display: block;
					position: absolute;
					right: 0;
					top: 0;
					width: 1px;
					height: 80%;
					background: $bg-5e96fe;
				}
			}
			.inviteTopGrade {
				background: $bg-5e96fe;
				height: 4rem;
				line-height: 4rem;
				a {
					color: $white;
					display: block;
					position: relative;
					img {
						max-width: 2.4rem;
						vertical-align: text-bottom;
						transform: translateY(7px);
						-webkit-transform: translateY(7px);
					}
					span {
						margin-right: pxToRem(16);
					}
				}
				a::before {
					content: "";
					display: block;
					width: 1rem;
					height: 1rem;
					border-top: 1px solid $white;
					border-left: 1px solid $white;
					background: $bg-5e96fe;
					position: absolute;
					top: 1.5rem;
					right: 4%;
					transform: rotate(135deg) translate(-50%, -50%);
					-webkit-transform: rotate(135deg) translate(-50%, -50%);
				}
			}
		}
		.middle {
			background: $white;
			.friend {
				a {
					display: block;
				}
				padding: 1rem 0;
				text-align: center;
				border-bottom: 1px solid $background;
				li {
					width: 50%;
					position: relative;
					span {
						color: $e71c18;
						font-size: pxToRem(30);
					}
					p {
						margin-bottom: 0.4rem;
						color: $ft-999;
					}
				}
				li:first-child::before {
					content: "";
					display: block;
					position: absolute;
					right: 0;
					top: 0;
					width: 1px;
					height: 100%;
					background: $background;
				}
				li:first-child::after {
					content: "";
					display: block;
					position: absolute;
					right: 5px;
					bottom: 0;
					width: 0px;
					height: 0px;
					border-left: 10px solid $white;
					border-top: 10px solid $white;
					border-right: 10px solid transparent;
					background: $e71c18;
				}
			}
			.link {
				height: pxToRem(88);
				line-height: pxToRem(88);
				font-size: pxToRem(28);
				margin: 0 0 0 4%;
				color: $ft-666;
				display: block;
				position: relative;
				span {
					color: $ft-333;
					font-size: pxToRem(30);
				}
				i {
					position: absolute;
					right: 4%;
					top: 0;
					img {
						height: 2rem;
					}
				}
			}
		}
		.record {
			.img {
				width: 60%;
				margin: 0.5rem auto;
				img {
					width: 100%;
				}
			}
			.recordTitle {
				color: $ft-999;
			}
			.mBottom {
				margin-bottom: 1rem;
			}
			.recordPerson {
				background: $white;
				.s2 {
					i {
						position: relative;
						top:pxToRem(25);
						display: inline-block;
						width: pxToRem(50);
						height: pxToRem(50);
						border-radius: 50%;
						font-size: pxToRem(55);
						color: $white;
						background: $bg-5e96fe;
						margin-right:6px;
						&::before {
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
						}
					}
				}
				.s3 {
					color: $f6aa2d;
				}
			}
			ul {
				li {
					width: 100%;
					height: pxToRem(100);
					line-height: pxToRem(100);
					border-bottom: 1px solid $background;
					text-align: center;
					span {
						float: left;
						text-align: left;
					}
					.s1 {
						width: 15%;
						text-align: center;
					}
					.s2 {
						width: 50%;
						img {
							border-radius: 50%;
						}
					}
					.s3 {
						width: 35%;
						text-align: right;
					}
					img {
						height: 2.4rem;
						margin-right: 6px;
						vertical-align: text-bottom;
						transform: translateY(7px);
						-webkit-transform: translateY(7px);
					}
				}
			}
		}
	}
	.invite .record .recordTitle li {
		height: pxToRem(60);
		line-height: pxToRem(60);
	}
	.leftRight {
		padding: 0 4%;
	}
	.invite {
		padding-bottom: 4rem;
	}
	.shareBtn {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
	}
	.shareBtn .btn {
		position: relative;
		width: 92%;
		border-radius: 0;
		margin: 0 4%;
	}
	.shareBtnBottom {
		height: 1rem;
		position: relative;
		bottom: 0;
		left: 0;
		background: $background;
	}
	.noData {
		text-align: center;
	}
</style>

