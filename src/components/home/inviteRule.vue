<template>
	<section class="inviteRule">
		<section class="rule rule-h">
			<h3>等级规则</h3>
			<table width="100%" cellspacing="0" cellpadding="0">
				<tbody>
					<tr>
						<th width="40%">级别</th>
						<th width="60%">升级要求</th>
					</tr>
					<tr v-for="(item,i) in list">
						<td><img :src='"../../assets/images/invite/icon_crown_"+ item.grade +".png"' class="icon_grade" />{{item.name}}</td>
						<td v-if="i == 0">默认级别</td>
						<td v-else-if="i == 1">一级好友结算金额达{{item.shouldCapital | formatMillionMoney}}或在投一级好友数达{{item.secondFriends}}位</td>
						<td v-else="i == 2">一级好友结算金额达{{item.shouldCapital | formatMillionMoney}}</td>
					</tr>
				</tbody>
			</table>
			<ul class="level">
				<li>等级每日评定一次。</li>
				<li>邀请好友结算金额 = 当日散标待回款本金 + 当日新增{{$config.info.finaName}}本金 - 当日总负债，不包括红包、{{$config.info.brisk}}、债权转让。</li>
				<li>好友当天加入{{$config.info.finaName}}的金额以新评定的等级一次性结算投资期限内好友收益。</li>
			</ul>
		</section>
		<section class="rule rule-h role">
			<h3>奖励计算规则</h3>
			<table width="100%" cellspacing="0" cellpadding="0">
				<tbody>
					<tr>
						<th width="30%">标准</th>
						<th width="35%">一级好友奖励</th>
						<th width="35">二级好友奖励</th>
					</tr>
					<tr v-for="item in list">
						<td><img :src='"../../assets/images/invite/icon_crown_"+ item.grade +".png"' class="icon_grade" />{{item.name}}</td>
						<td>{{item.grade1Rate|formatMoney}}%</td>
						<td>{{item.grade2Rate|formatMoney}}%</td>
					</tr>
				</tbody>
			</table>
			<ul class="level">
				<li class="M12">评定等级后结算收益，收益自动划入您的账户余额。</li>
			</ul>
		</section>
		<section class="attention rule-h">
			<h3>注意事项</h3>
			<ul>
				<li>1、您的好友注册之日起，3年内好友奖励关系有效，即可享一级好友的投资奖励和二级好友投资奖励。</li>
				<li>2、如发现使用非正常方式赚取奖励的，{{$config.info.appName}}有权在不进行通知的前提下解除您与好友之间的奖励关系。</li>
				<li>3、本奖励方案最终解释权归{{$config.info.appName}}</li>
			</ul>
		</section>
		<div class="footBtn">
			<router-link to="/home/invite/" class="btn btn-bottom">知道了</router-link>
		</div>
	</section>
</template>

<script>
	export default {
		data: function() {
			return {
				list: []
			};
		},
		methods: {
			init: function() {
				this.$public.API_GET({
					url: "getRecommendRulesOn",
					success: result => {
						if (result && result.isSuccess) {
							this.list = result.data.findGrade;
						}
					}
				})
			}
		},
		mounted() {
			window.Hub.$emit("refresh", null);
			window.Hub.$emit("setTitle", "奖励规则", false, null, " ", null);
			window.Hub.$emit("setFooter", false);
			this.init();
		}
	};
</script>

<style lang="scss" type="text/css">
	@import "../../assets/skin";
	.inviteRule {
		section {
			padding: 0 14px;
		}
		.rule {
			margin: 14px 0;
		}
		.rule img {
			width: auto;
		}
		.rule table {
			background: #fff;
			border-collapse: collapse;
		}
		.rule table,
		.rule td,
		.rule th {
			border: 1px solid #333;
		}
		.rule table th {
			background-color: #eaecf5;
		}
		.rule td,
		.rule th {
			padding: 10px 0;
			font-size: 12px;
			text-align: center;
		}
		.rule tr td:last-child {
			padding-left: -6px;
			text-align: center;
		}
		.rule table.table_2,
		.rule table.table_2 tr.tr_2,
		.rule table.table_2 td {
			border: 0;
		}
		.rule th {
			font-weight: normal;
			padding: 10px 0;
		}
		.rule td span,
		.rule th span {
			font-size: 12px;
			line-height: 1.8;
		}
		.rule tr td span {
			font-size: 14px;
		}
		.rule .level li.M12::before {
			margin-top: -12px;
		}
		.ruleDetail {
			border: 1px solid #d9d9d9;
			padding-bottom: 14px;
			margin: 0 14px 14px;
			background: #fff;
			font-size: 14px;
		}
		.ruleDetail h3 {
			height: 40px;
			line-height: 40px;
			font-size: 18px;
			font-weight: normal;
			margin-bottom: 10px;
		}
		.rule-h {
			background: #fff;
			padding-top: 10px;
			padding-bottom: 10px;
		}
		.rule .level li {
			position: relative;
			padding: 5px 0 5px 10px;
		}
		.rule .level li::before {
			content: "";
			position: absolute;
			top: 50%;
			left: 0;
			margin-top: -3px;
			width: 4px;
			height: 4px;
			border-radius: 50%;
			background: #666;
		}
		.rule .level li:nth-child(2)::before {
			top: 30%;
		}
		.rule .level li:last-child::before {
			top: 0;
			margin-top: 13px;
		}
		.rule-h h3 {
			position: relative;
			padding-left: 10px;
			font-size: 14px;
			line-height: 2.5;
			font-weight: 500;
			margin-left: 10px;
			color: #333;
		}
		.rule-h h3:before {
			content: "";
			width: 0.5rem;
			height: 0.5rem;
			transform: rotate(45deg);
			-webki-transform: rotate(45deg);
			-moz-transform: rotate(45deg);
			position: absolute;
			top: 13px;
			left: -8px;
			background: $red;
		}
		.footBtn a.know_btn {
			display: block;
			width: 90%;
			margin: 30px auto 40px;
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			text-align: center;
			color: #fff;
		}
		.footBtn {
			padding: 30px 0 50px;
		}
		.attention li {
			margin-bottom: 5px;
		}
		.icon_grade {
			position: relative;
			top: -2px;
			margin-right: 5px;
			width: 25px;
			height: 25px;
		}
		li {
			line-height: 1.8;
		}
	}
</style>
