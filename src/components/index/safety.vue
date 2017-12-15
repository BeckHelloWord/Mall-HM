<template>
	<div class="safty">
		<img src="../../assets/images/safty/banner.png" alt="">
		<section class="part1">
			<h2>01 全面风险控制体系</h2>
			<ul>
				<li>
					<h3>大数据风控</h3>
					<p>基于云技术，创新的大数据风控手段，提供反欺诈、道德风险的保障</p>
				</li>
				<li>
					<h3>完善的流程控制</h3>
					<p>全流程四眼法则，有效规避操作风险</p>
				</li>
				<li>
					<h3>严谨全面的尽调风控体系</h3>
					<p>对借款人以及保全手段全方位的尽职调查，确保信用风险可控</p>
				</li>
				<li>
					<h3>法律保障</h3>
					<p>最大程度保障出借人权益</p>
				</li>
				<li>
					<h3>风险预警机制</h3>
					<p>通过压力测试、市场调研等方法，对风险进行前瞻性分析</p>
				</li>
			</ul>
		</section>
		<section class="part2">
			<h2>02 分级授权体系与科学的审批流程</h2>
			<img src="../../assets/images/safty/part2.png" alt="">
		</section>
		<section class="part3">
			<h2>03 全生命周期项目管理</h2>
			<img src="../../assets/images/safty/part3.png" alt="">
		</section>
		<section class="part4">
			<h2>04 资金安全</h2>
			<img src="../../assets/images/safty/part4.png" alt="">
		</section>
		<section class="part5">
			<h2>05 分散而透明的业务模式</h2>
			<ul>
				<li>
					<h3>小额贷款投资分散</h3>
					<p>平台多以小额借款项目为主，投资人可分散投资给多个借款债权人，极大降低投资风险。</p>
					<img class="lazy" data-original="../../assets/images/safty/table_01.png" src="../../assets/images/safty/table_01.png" alt="" style="display: block;">
				</li>
				<li>
					<h3>项目真实透明</h3>
					<p>三类信息，公开透明，有凭证，可追溯，透明无虚假，避免资金安全风险。</p>
					<img class="lazy" data-original="../../assets/images/safty/table_02.png" src="../../assets/images/safty/table_02.png" alt="" style="display: block;">
				</li>
			</ul>
		</section>
	</div>
</template>

<script>
	export default {
		components: {},
		data: function() {
			return {};
		},
		methods: {},
		mounted: function() {
			window.Hub.$emit("refresh", null);
			window.Hub.$emit("setTitle", "安全保障", false, null, " ", null);
			window.Hub.$emit("setFooter", false);
		}
	};
</script>

<style lang="scss" scoped="" type="text/css">
	@import "../../assets/skin";
	.safty {
		background: $white;
		font-size: pxToRem(26);
		color: $ft-666;
		line-height: 1;
		img {
			width: 100%;
		}
		section {
			padding: 1.6rem 0.8rem;
		}
		h2 {
			color: $red;
			font-size: pxToRem(42);
			font-weight: normal;
			margin-bottom: pxToRem(70);
		}
		h3 {
			color: $red;
			font-size: pxToRem(30);
			font-weight: normal;
			margin-bottom: pxToRem(10);
		}
		p {
			line-height: 2;
		}
		.part1 {
			background: url(../../assets/images/safty/part-white-bg.jpg) no-repeat center;
			background-size: 100% 100%;
			ul {
				li {
					padding: 0 0 1.6rem 2.4rem;
					position: relative;
					&:last-child {
						padding-bottom: 0;
					}
					&:before {
						content: "";
						width: 11px;
						height: 11px;
						border: 2px solid $red;
						background-color: #fff;
						position: absolute;
						left: 0;
						top: 0;
						z-index: 10;
						-webkit-transform: rotate(45deg);
						transform: rotate(45deg);
					}
					&:after {
						content: "";
						width: 1px;
						height: 100%;
						background-color: $red;
						position: absolute;
						left: 7px;
						top: 0;
						z-index: 0;
					}
					&:last-child:after {
						height: 0;
					}
				}
			}
		}
		.part2 {
			background: $white;
		}
		.part3 {
			background: url(../../assets/images/safty/part-yellow-bg.png) $ft-e6b31b no-repeat center;
			background-size: 100% 100%;
			h2 {
				color: $white;
			}
		}
		.part5 {
			color: $white;
			background: url(../../assets/images/safty/part-blue-bg.png) $red no-repeat center;
			background-size: 100% 100%;
			h2 {
				color: $white;
				padding-top: 1rem;
			}
			h3 {
				color: $f6aa2d;
			}
			li {
				padding-left: 2.4rem;
				position: relative;
				&+li {
					padding-top: 1.6rem;
					border-top: 1px solid #4255a3;
					margin-top: 1.6rem;
				}
				h3 {
					position: relative;
					&:before {
						content: "";
						width: .7rem;
						height: .7rem;
						background-color: #ecb81c;
						position: absolute;
						left: -2rem;
						top: 3px;
						z-index: 10;
						-webkit-transform: rotate(45deg);
						transform: rotate(45deg);
					}
				}
			}
		}
	}
</style>
