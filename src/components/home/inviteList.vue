<template>
	<section class="inviteList">
		<div class="title">
			<ul class="leftRight">
				<li class="clearfix">
					<p class="s1">好友</p>
					<p class="s2">投资状态</p>
					<p class="s3">TA的好友数</p>
				</li>
			</ul>
		</div>
		<ul class="person leftRight" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
			<li v-for="item in list" class="clearfix">
				<p class="s1">
					<table border="0">
						<tr>
							<td>{{item.realName}}</td>
						</tr>
						<tr>
							<td>{{item.mobile}}</td>
						</tr>
					</table>
				</p>
				<p class="s2">{{item.capital}}</p>
				<p class="s3">{{item.num}}人</p>
			</li>
		</ul>
		<div class="empty">
			<empty v-show='list.length==0' :showImg='true' :padding='"120px"'></empty>
		</div>
	</section>
</template>

<script>
	import empty from '../public/empty';
	import layer from "../../../static/layer.js";
	import {
		Lazyload
	} from "mint-ui";
	Vue.use(Lazyload);
	export default {
		components: {
			empty
		},
		data: function() {
			return {
				list: [],
				offset: 0,
				max: 10,
				lock: true,
				hasNext: true,
				initLock: true,
				loadEnd: false
			};
		},
		methods: {
			loadMore() {
				if (this.initLock) {
					return
				}
				if (!this.hasNext) {
					return
				}
				this.loading = true;
				this.$public.API_GET({
					url: 'getInviteDetail',
					data: {
						offset: this.offset,
						max: this.max
					},
					success: (result) => {
						for (var item in result.data) {
							this.list.push(result.data[item])
						}
						this.offset += this.max;
						this.loading = false;
						if (result.data.length < this.max) {
							this.hasNext = false
						}
					}
				});
			},
			initData(finishFun) {
				this.offset = 0;
				this.max = 10;
				this.hasNext = true;
				this.list = [];
				this.loadEnd = false;
				this.$public.API_GET({
					url: 'getInviteDetail',
					data: {
						offset: this.offset,
						max: this.max
					},
					success: (result) => {
						this.loadEnd = true
						this.list = result.data;
						this.offset += this.max;
						if (result.data.length < this.max) {
							this.hasNext = false
						}
						this.initLock = false
						if (typeof(finishFun) == "function") {
							finishFun()
						}
					}
				});
			}
		},
		mounted() {
			var self = this;
			window.Hub.$emit("refresh", null);
			window.Hub.$emit("setTitle", "好友列表", false, null, " ", null);
			window.Hub.$emit("setFooter", false);
			this.initData();
		}
	};
</script>

<style lang="scss" type="text/css">
	@import "../../assets/skin";
	html {
		background: $white;
	}
	.inviteList {
		font-size: pxToRem(24);
		ul {
			li {
				width: 100%;
				border-bottom: 1px solid $background;
				text-align: center;
				p {
					float: left;
					text-align: left;
					font-size: pxToRem(26);
				}
				.s1 {
					width: 50%;
				}
				.s2 {
					width: 25%;
				}
				.s3 {
					width: 25%;
					text-align: right;
				}
			}
		}
		.title {
			color: $ft-999;
			background: $background;
			li {
				height: pxToRem(70);
				line-height: pxToRem(70);
			}
		}
		.person {
			li {
				height: 5rem;
				line-height: 5rem;
			}
			.s3 {
				color: $f6aa2d;
			}
			table {
				transform: translateY(8px);
				height: 100%;
			}
			tr {
				height: 2rem;
				line-height: 1;
				padding: 0;
			}
		}
		.leftRight {
			padding: 0 4%;
		}
	}
</style>

