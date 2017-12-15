<template>
	<section class="pt4 youpinG">
		<!--标简介-->
		<section class="main youpin compd">
			<div class="detail_title t_c">
				<ul>
					<li>
						<p class="fz1">借款年利率</p>
						<p class="num">{{list.yearRate|expectYear}}
							<span class="fz2">%</span>
						</p>
					</li>
					<li>
						<p class="fz1">投资期限</p>
						<p class="num">{{list.cycleNumber}}
							<span class="fz2 adjust">{{list.cycleTypeShow}}</span>
						</p>
					</li>
				</ul>
				<div class="clearfix liner">
					<div class="load_line">
						<span v-bind:style="'width:'+schedule+'%'"></span>
					</div>
					<span class="percent">{{schedule}}%</span>
				</div>
			</div>
			<div class="detail_plain">
				<ul>
					<li class="clearfix">
						<span class="fl">{{list.investMin}}元起投</span>
						<span class="fr" v-bind:class="detailsType.colorClass">{{detailsType.txt}}</span>
					</li>
				</ul>
			</div>
		</section>
		<!--标简介-->
		<!--标详情-->
		<ul class="compd safeguard-box commt">
			<li class="clearfix">
				<span class="fl">到期结算收益</span>
				<span class="fr safeguard">
					<router-link to='/index/safety/'>多重保障</router-link>
				</span>
			</li>
		</ul>
		<!--标详情-->
		<section class="details commt">
			<ul class="column clearfix">
				<li class="on" data-type="explain" @click="cutTabs">产品说明</li>
				<li data-type="project" @click="cutTabs">项目清单</li>
				<li data-type="record" @click="cutTabs">{{list.joinedNumber?list.joinedNumber:0}}人加入</li>
			</ul>
			<div class="items">
				<!--产品说明 start-->
				<div class="product showbox">
					<div class="element">
						<div class="ptblr">
							<table>
								<tr>
									<td>总额(元)</td>
									<td>{{list.amount|expectYear}}</td>
								</tr>
								<tr>
									<td>收益</td>
									<td>由实际投资的项目决定</td>
								</tr>
								<tr>
									<td>退出</td>
									<td>到期退出，完成时间视市场而定</td>
								</tr>
								<tr>
									<td>收费</td>
									<td>加入费用{{list.joinFee}}元，退出费用{{list.outFee}}元</td>
								</tr>
								<tr>
									<td>加入截止日期</td>
									<td>{{list.overTime}}</td>
								</tr>
							</table>
						</div>
					</div>
					<div class="brief">
						<div class="compdl" @click="flex">
							<h2 class="arrow">
								<i></i>项目简介</h2>
						</div>
						<div class="defaultHideen">
							<p class="ptblr bgfd" v-html="list.introduce"></p>
						</div>
					</div>
					<div class="flow">
						<div class="compdl" @click="flex">
							<h2 class="arrow">
								<i></i>项目原理</h2>
						</div>

						<div class="defaultHideen ptblr bgfd ">
							<ul class="flow-one clearfix">
								<li>
									<i></i>
									<p>个人账户</p>
								</li>
								<li>
									<i></i>
									<p>开放加入</p>
								</li>
							</ul>
							<ul class="flow-two clearfix">
								<li>
									<i></i>
									<p>续投或退出</p>
								</li>
								<li>
									<i></i>
									<p>借款人还款</p>
								</li>
								<li>
									<i></i>
									<p>系统自动投标</p>
								</li>
							</ul>
						</div>
					</div>
					<div class="problem">
						<div class="compdl" @click="flex">
							<h2 class="arrow">
								<i></i>常见问题</h2>
						</div>
						<div class="defaultHideen">
							<p class="ptblr bgfd" v-html="list.commonProblem"></p>
						</div>
					</div>
					<div class="service">
						<router-link to='/invest/service/'>
							<div class="compdl">
								<h2 class="arrow">
									<i></i>服务协议</h2>
							</div>
						</router-link>
					</div>

				</div>
				<!--产品说明 end-->

				<!--项目清单 start-->
				<div class="project compd">
					<template v-if="projectlist.length > 0">
						<ul>
							<a v-for="item in projectlist" @click="goDetail(item.borrowId)">
								<li>
									<p class="clearfix">
										<span class="">
											<font style="position: relative" class="ellipsis ">{{item.borrowTitle}}</font>
											<em v-if="item.borrowIsTransfer" class="transferZhuan">转</em>
										</span>
										<span>{{item.borrowStatusName}}</span>
									</p>
									<p class="clearfix">
										<span class="year">{{item.borrowLoanRate | formatInvest}}%</span>
										<span>{{item.borrowCycle}}{{item.borrowCycleTypeName}}</span>
									</p>
								</li>
							</a>
						</ul>
					</template>
					<template v-else>
						<table>
							<tbody>
								<tr class="noData">
									<td>哎呀,暂无内容</td>
								</tr>
							</tbody>
						</table>
					</template>

				</div>
				<!--项目清单 end-->

				<!--加入记录 start-->
				<div class="record">
					<div class="top-list compd">
						<ul class="clearfix">
							<li>
								<div class="rankingImg">
									<i></i>
								</div>
								<p>{{jion[1]?jion[1].username:"暂无"}}</p>
								<p>{{jion[1] && jion[1].amount|formatMillionMoney}}</p>
							</li>
							<li class="list-middle" :data-id="jion[0].amount">
								<div class="rankingImg first">
									<i></i>
								</div>
								<p>{{jion[0]?jion[0].username:"暂无"}}</p>
								<p>{{jion[0] &&jion[0].amount|formatMillionMoney}}</p>
							</li>
							<li>
								<div class="rankingImg">
									<i></i>
								</div>
								<p>{{jion[2]?jion[2].username:"暂无"}}</p>
								<p>{{jion[2] && jion[2].amount|formatMillionMoney}}</p>
							</li>
						</ul>
					</div>
					<p class="invest-liist compd clearfix">
						<span class="fl">投资人
							<strong>(共{{list.joinedNumber?list.joinedNumber:0}}人)</strong>
						</span>
						<span class="fr">加入金额(元)</span>
					</p>
					<template v-if="jionlist.length > 0">
						<div class="record-list compd">
							<table>
								<tbody>
									<tr v-for="item in jionlist">
										<td width="21%">
											<i v-if="item.userFace" class="headimg" v-bind:style="'background-image:url(https://bxwd-img.oss-cn-hangzhou.aliyuncs.com/'+item.userFace+');'"></i>
											<i v-else class="defaultHead"></i>
										</td>
										<td width="40%">{{item.username}}</td>
										<td class="list-right">
											<span class="g333">{{item.amount|formatInvest}}</span>
											<p class="g999">{{item.dateCreated}}</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</template>
					<template v-else>
						<table>
							<tbody>
								<tr class="noData">
									<td>哎呀,暂无内容</td>
								</tr>
							</tbody>
						</table>
					</template>
				</div>
				<!--加入记录 end-->
			</div>
		</section>
		<a href="javascript:;" class="noMore">没有更多了</a>
		<p class="remind">市场有风险，投资需谨慎</p>
	</section>
</template>
<script>
export default {
  data: function() {
    return {
      id: this.$route.params.id,
      list: {
        yearRate: "",
        cycleNumber: "",
        cycleTypeShow: "",
        investMin: ""
      },
      projectlist: [],
      jion: [{}, {}, {}],
      jionlist: [],
      detailsType: {
        txt: "",
        colorClass: ""
      },
      type: "explain",
      offset: 0,
      max: 10,
      isIos: false,
      schedule: 0,
      throttleProject: true,
      throttleRecord: true,
      hasJoinBtn: "hasJoinBtn"
    };
  },

  methods: {
    //打开关闭产品说明其余栏目
    flex: function(event) {
      $(event.currentTarget)
        .parent()
        .toggleClass("shrink");
      $("body").scrollTop($(event.currentTarget).offset().top - 100);
      //解决ios中，收缩后栏目依旧定位在顶部的问题
      if (this.isIos) {
        if (/^(brief)$/g.test(event.currentTarget.parentNode.className)) {
          $(".column").removeClass("fix");
        }
      }
    },
    //点击项目详情
    goDetail: function(id) {
      var urlStatus = this.$public.Auth.get();
      if (!urlStatus) {
        location.href = "/login/index.html";
      } else {
        location.href = "/lc/invest/datum/" + id + ".html";
      }
    },
    //首页头部数据
    indexFun() {
      this.$public.API_GET({
        url: "getFinaDetailsOn",
        data: {
          finaId: this.id
        },
        success: result => {
          if (result.isSuccess) {
            //根据type设置状态及字体颜色,除PROCESS状态外，其余状态一律显示100
            switch (result.data &&
              result.data.finaStatus &&
              result.data.finaStatus.toLocaleUpperCase()) {
              case "SUCCESS":
                this.detailsType.txt = "已满额";
                this.schedule = 100;
                break;
              case "RUN":
                this.detailsType.txt = "收益中";
                this.schedule = 100;
                break;
              case "DONE":
                this.detailsType.txt = "已结束";
                this.schedule = 100;
                break;
              default:
                this.detailsType.txt =
                  "可投 " + result.data.surplusAmount + " 元";
                this.schedule = result.data.investProcess;
                break;
            }
            this.list = result.data;
            if (this.schedule < 100) {
              $(".youpinG").addClass("hasJoinBtn");
              this.addFooter(this.id, this.schedule);
            }
          }
        }
      });
    },
    //切换栏目
    cutTabs: function(event) {
      var that = this;
      //切换栏目
      $(event.currentTarget)
        .addClass("on")
        .siblings("li")
        .removeClass("on");
      $(".items>div")
        .eq($(event.currentTarget).index())
        .addClass("showbox")
        .siblings("div")
        .removeClass("showbox");
      that.type = event.currentTarget.getAttribute("data-type");
      this.offset = 0;

      //给苹果
      if (this.isIos) {
        $(".column").removeClass("fix");
      }

      //获得数据

      switch (that.type) {
        case "project":
          if (!this.throttleProject) {
            return false;
          }
          this.throttleProject = false;
          this.$public.API_GET({
            url: "getFinaLibraryOn",
            data: {
              finaId: this.id,
              offset: this.offset,
              max: this.max
            },
            success: result => {
              this.throttleProject = true;
              if (result.isSuccess) {
                this.projectlist = result.data;
                this.offset += this.max;
              }
            }
          });
          break;
        case "record":
          this.$public.API_GET({
            url: "getFinaHistoryRankOn",
            data: {
              finaId: this.id
            },
            success: result => {
              this.throttleProject = true;
              if (result.isSuccess) {
                this.jion = result.data;
                //投资详情
                if (!this.throttleRecord) {
                  return false;
                }
                this.throttleRecord = false;
                this.$public.API_GET({
                  url: "getFinaHistoryOn",
                  data: {
                    finaId: this.id,
                    offset: this.offset,
                    max: this.max
                  },
                  success: result => {
                    this.throttleRecord = true;
                    if (result.isSuccess) {
                      this.jionlist = result.data;
                      this.offset += this.max;
                    }
                  }
                });
              }
            }
          });
          break;
        default:
          break;
      }
    },
    loadData: function() {
      var type = arguments[0];
      if (type === "project" || type === "record") {
        if (type == "project") {
          if (!this.throttleProject) {
            return false;
          }
          this.throttleProject = false;
          this.$public.API_GET({
            url: "getFinaLibraryOn",
            data: { finaId: this.id, offset: this.offset, max: this.max },
            success: result => {
              this.throttleProject = true;
              if (result.isSuccess) {
                if (result.data.length === 0) {
                  this.noMore();
                } else {
                  this.projectlist = this.projectlist.concat(result.data);
                  this.offset += this.max;
                }
              }
            }
          });
        }
        if (type == "record") {
          if (!this.throttleRecord) {
            return false;
          }
          this.throttleRecord = false;
          this.$public.API_GET({
            url: "getFinaHistoryOn",
            data: { finaId: this.id, offset: this.offset, max: this.max },
            success: result => {
              this.throttleRecord = true;
              if (result.isSuccess) {
                if (result.data.length === 0) {
                  this.noMore();
                } else {
                  this.jionlist = this.jionlist.concat(result.data);
                  this.offset += this.max;
                }
              }
            }
          });
        }
      }
    },
    noMore: function() {
      $(".noMore").show();
      setTimeout(function() {
        $(".noMore").hide();
      }, 600);
    },
    addFooter(id, schedule) {
      var packet = Vue.extend({
        data: function() {
          return {
            text: "立即加入"
          };
        },
        methods: {
          joinBtnFun() {
            location.hash = "/invest/pay/" + id;
          }
        },
        template: `<div class="joinBtn" @click="joinBtnFun"><div class="btn btnBottom">{{this.text}}</div></div>`
      });
      var packetIntance = new packet({
        el: document.createElement("div")
      });

      document.body.appendChild(packetIntance.$el);
    }
  },
  mounted() {
    var self = this;
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "定期理财", false, null, " ", null);
    window.Hub.$emit("setFooter", false);
    this.indexFun();
    /(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLocaleLowerCase())
      ? (this.isIos = true)
      : this.isIos;

    var domTop,
      fixClass = "fix";
    setTimeout(function() {
      domTop = $(".column").offset() ? $(".column").offset().top : 0;
    }, 0);

    $(window).bind("scroll", function() {
      if ($("body").scrollTop() >= domTop) {
        $(".column").addClass(fixClass);
      } else {
        $(".column").removeClass(fixClass);
      }

      if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
        self.loadData(self.type);
      } else {
        return false;
      }
    });
    if (this.isIos) {
      var start,
        end,
        move,
        touchFlg = 0;
      window.addEventListener("touchstart", function(event) {
        start = event.touches[0].pageY;
      });
      window.addEventListener("touchmove", function(event) {
        end = event.touches[0].pageY;
        move = start - end;
        touchFun(move);
      });

      function touchFun(move) {
        if (move < 0) {
          $(".column").removeClass(fixClass);
        }
        touchFlg += move;
      }
    }
  },
  beforeRouteLeave: function(to, from, next) {
    $(".joinBtn").remove();
    next();
  }
};
</script>
<style lang="scss" type="text/css">
@import "../../assets/skin";
html {
  font-size: 68.8%;
}

.fz1 {
  font-size: 1.1rem;
}

.fz2 {
  font-size: 2.4rem !important;
}

.compd {
  padding: 0 4.266%;
}

.compdl {
  padding-left: 4.375%;
}

.ptblr {
  padding: 6.5% 6%;
}

.bgfd {
  background: #fbfcfd;
}

.commt {
  margin-top: 2.415%;
}

.youpin {
  font-size: 1.2rem;
  line-height: 1.8;
  color: $white;
  background: $red;
}

.g333 {
  color: $ft-333;
}

.g999 {
  color: $ft-999;
}

.g555 {
  color: $ft-555;
}

.pt4 {
  padding-bottom: 4%;
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 80%;
  display: block;
  float: left;
}

.transferZhuan {
  display: inline-block;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 1rem;
  background: $bg-blue;
  color: $red;
  right: 0;
  top: 3px;
  margin-right: -25px;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border: 0;
}

.adjust {
  position: relative;
  top: -3px;
}

.detail_title {
  padding-top: 2.666%;
}

.detail_title h3 {
  font-size: 1.5rem;
  font-weight: normal;
}

.detail_title ul {
  overflow: hidden;
  padding: 10.266% 0 16.266%;
}

.detail_title ul li {
  font-size: 1.3rem;
  float: left;
  width: 50%;
}

.detail_title ul li .num {
  font-size: 3.8rem;
  line-height: 1;
  margin-top: 2.66%;
}

.detail_title ul li .num span {
  font-size: 1.1rem;
}

.detail_title .load_line {
  display: inline-block;
  width: 86%;
  height: 2px;
  vertical-align: middle;
  background-color: #26346b;
}

.percent {
  display: inline-block;
  width: 12%;
  text-align: right;
  vertical-align: middle;
  color: #ecb81c;
}

.detail_title .load_line span {
  display: block;
  width: 0%;
  height: 2px;
  background-color: #ecb81c;
}

.detail_plain ul li {
  font-size: 1.2rem;
  line-height: 1.5rem;
  padding-top: 6%;
  padding-bottom: 6%;
}

.detail_plain ul li + li {
  border-top: 1px solid #e1e8f2;
}

.detail_plain ul li .safeguard {
  position: relative;
  padding-right: 1.2rem;
  color: #333;
}

.detail_plain ul li .safeguard:after {
  position: absolute;
  top: 50%;
  right: 0;
  width: 0.8rem;
  height: 0.8rem;
  content: "";
  -webkit-transform: translateY(-50%) rotate(45deg);
  -moz-transform: translateY(-50%) rotate(45deg);
  -ms-transform: translateY(-50%) rotate(45deg);
  -o-transform: translateY(-50%) rotate(45deg);
  transform: translateY(-50%) rotate(45deg);
  border-top: 0.2rem solid #d6ddea;
  border-right: 0.2rem solid #d6ddea;
}

.details {
  position: relative;
}

.details .column {
  font-size: 1.3rem;
  position: absolute;
  z-index: 9;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  text-align: center;
  color: #a9b3c2;
  border-bottom: 0.1rem solid #e1e8f2;
  background: $white;
}

.details .fix {
  position: fixed;
  top: 40px;
}

.noNav .details .fix {
  position: fixed;
  top: 0;
}

.details .column li {
  box-sizing: border-box;
  float: left;
  width: 33.333%;
  padding-top: 13px;
  padding-bottom: 11px;
  border-bottom: 2px solid $white;
}

.details .column li:last-child {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.details .column li.on {
  font-size: 1.5rem;
  color: $red;
  border-bottom-color: #f6cd53;
}

.product > div {
  overflow: hidden;
  border-bottom: 0.1rem solid #e1e8f2;
  background: $white;
}

.items {
  padding-top: 15%;
}

.items > div {
  display: none;
}

.items .showbox {
  display: block;
}

.product h2 {
  font-size: 1.45rem;
  font-weight: normal;
  position: relative;
  padding: 3.43% 0 3.43% 3rem;
  color: #666;
}

.product h2 i {
  position: absolute;
  top: 50%;
  left: 0;
  width: 1.8rem;
  height: 1.8rem;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
}

.product .arrow:after {
  position: absolute;
  top: 50%;
  right: 5.6%;
  width: 0.8rem;
  height: 0.8rem;
  content: "";
  -webkit-transform: translateY(-50%) rotate(45deg);
  -moz-transform: translateY(-50%) rotate(45deg);
  -ms-transform: translateY(-50%) rotate(45deg);
  -o-transform: translateY(-50%) rotate(45deg);
  transform: translateY(-50%) rotate(45deg);
  border-top: 0.2rem solid #d6ddea;
  border-right: 0.2rem solid #d6ddea;
}

.product a .arrow:after {
  border-top: 0.2rem solid #d6ddea;
  border-right: 0.2rem solid #d6ddea;
}

.product .defaultHideen {
  display: none;
  font-size: 1.4rem !important;
}

.product .shrink h2 {
  border-bottom: 0.1rem solid #e1e8f2;
}

.product .shrink .arrow:after {
  -webkit-transform: translateY(-50%) rotate(135deg);
  -moz-transform: translateY(-50%) rotate(135deg);
  -ms-transform: translateY(-50%) rotate(135deg);
  -o-transform: translateY(-50%) rotate(135deg);
  transform: translateY(-50%) rotate(135deg);
}

.product .shrink .defaultHideen {
  display: block;
}

.element {
  overflow: hidden;
}

.element h2 {
  border-bottom: 0.1rem solid #e1e8f2;
}

.element h2 i {
  background: url(../../assets/images/fina/element-icon.png) no-repeat center;
  background-size: contain;
}

.element table {
  font-size: 1.2rem;
  color: #666;
}

.element table tr td {
  padding: 2% 0;
}

.element table tr td:last-child {
  width: 67%;
  text-align: right;
  color: #333;
}

.brief h2 i {
  background: url(../../assets/images/fina/brief-icon.png) no-repeat center;
  background-size: contain;
}

.brief p,
.problem {
  font-size: 1.4rem !important;
  line-height: 1.5;
  text-align: justify;
  color: #333;
}

.brief p,
.problem p {
  font-size: 1.2rem !important;
}

.brief p span,
.problem p span {
  font-size: 1.4rem !important;
}

.problem h2 i {
  background: url(../../assets/images/fina/problem-icon.png) no-repeat center;
  background-size: contain;
}

.problem ul li {
  margin-bottom: 8.66%;
}

.problem ul li:last-child {
  margin-bottom: 0;
}

.flow ul {
  font-size: 1.2rem;
  text-align: center;
  color: #333;
}

.flow h2 i {
  background: url(../../assets/images/fina/flow-icon.png) no-repeat center;
  background-size: 92%;
}

.flow i {
  display: block;
  width: 3.4rem;
  height: 3.4rem;
  margin: 0 auto;
  border-radius: 5px;
}

.flow li {
  position: relative;
}

.flow li:after {
  width: 2.4rem;
  height: 1rem;
  content: "";
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  background: url(../../assets/images/fina/arrow.png) no-repeat center;
  background-size: 100% 100%;
}

.flow p {
  padding: 2.93% 0;
}

.flow ul {
  margin-bottom: 8.666%;
}

.flow ul:last-child {
  margin-bottom: 0;
}

.flow .flow-one li i {
  background: #6076cf url(../../assets/images/fina/account-icon.png) no-repeat
    center;
  background-size: 80%;
}

.flow .flow-one li:last-child i {
  background: #6076cf url(../../assets/images/fina/plan-icon.png) no-repeat
    center;
  background-size: 80%;
}

.flow .flow-two li i {
  background: #6076cf url(../../assets/images/fina/refund-icon.png) no-repeat
    center;
  background-size: 80%;
}

.flow .flow-two li:first-child i {
  background: #6076cf url(../../assets/images/fina/exit-icon.png) no-repeat
    center;
  background-size: 80%;
}

.flow .flow-two li:last-child i {
  background: #6076cf url(../../assets/images/fina/autobid-icon.png) no-repeat
    center;
  background-size: 80%;
}

.flow .flow-one li:first-child:after {
  position: absolute;
  top: 32%;
  right: -6%;
}

.flow .flow-one li:last-child:after {
  position: absolute;
  bottom: -25%;
  left: 50%;
  -webkit-transform: rotate(50deg);
  -moz-transform: rotate(50deg);
  -ms-transform: rotate(50deg);
  -o-transform: rotate(50deg);
  transform: rotate(50deg);
}

.flow .flow-one li {
  float: left;
  width: 50%;
}

.flow .flow-two li {
  float: left;
  width: 33.333%;
}

.flow .flow-two li:after {
  position: absolute;
  top: 35%;
  left: -16%;
  -webkit-transform: translateY(-50%) rotate(180deg);
  -moz-transform: translateY(-50%) rotate(180deg);
  -ms-transform: translateY(-50%) rotate(180deg);
  -o-transform: translateY(-50%) rotate(180deg);
  transform: translateY(-50%) rotate(180deg);
}

.flow .flow-two li:first-child:after {
  top: -30%;
  left: 35%;
  transform: rotate(-45deg);

  -webkit-transform: rotate(-45deg);
}

.service h2 {
  border-bottom: none;
}

.service h2 i {
  background: url(../../assets/images/fina/service.png) no-repeat center;
  background-size: contain;
}

.project {
  background: $white;
}

.project a {
  display: block;
  color: #999;
  border-bottom: 0.1rem solid #e1e8f2;
}

.project a:last-child {
  border-bottom: none;
}

.project ul {
  font-size: 1.2rem;
  color: #999;
}

.project ul li {
  width: 100%;
  padding: 4.266% 0;
}

.project li p {
  width: 100%;
  line-height: 1.7;
}

.project li p span {
  display: inline-block;
  vertical-align: middle;
  text-align: right;
}

.project li p span:first-child {
  width: 70%;
  font-size: 1.4rem;
  color: #555;
  text-align: left;
}

.project li p span:last-child {
  width: 28%;
}

.project ul li span.year {
  font-size: 1.4rem;
  color: #e71c18;
}

.top-list {
  font-size: 1.2rem;
  padding-top: 7.6%;
  padding-bottom: 3.46%;
  background: $white;
}

.top-list .rankingImg {
  height: 1rem;
  margin-bottom: 5rem;
  vertical-align: text-bottom;
}

.top-list ul li {
  float: left;
  width: 33.33%;
  text-align: center;
}

.top-list ul li i {
  display: block;
  width: 3.5rem;
  height: 5rem;
  margin: 0 auto;
  background: url(../../assets/images/fina/h5-ranking2.png) no-repeat center;
  background-size: 100% 100%;
}

.top-list ul li:last-child i {
  display: block;
  width: 3.5rem;
  height: 5rem;
  margin: 0 auto;
  background: url(../../assets/images/fina/h5-ranking3.png) no-repeat center;
  background-size: 100% 100%;
}

.top-list ul li .first {
  position: relative;
  top: -10px;
}

.top-list ul li .first i {
  display: block;
  width: 4.2rem;
  height: 5.7rem;
  margin: 0 auto;
  background: url(../../assets/images/fina/h5-ranking1.png) no-repeat center;
  background-size: 100% 100%;
}

.top-list ul li i {
  display: block;
  width: 3.5rem;
  height: 5rem;
  margin: 0 auto;
}

.top-list ul li img {
  display: inline-block;
  width: 30%;
  margin-bottom: 10px;
}

.top-list ul li:nth-child(2) img {
  width: 36%;
  margin-top: -10px;
}

.top-list ul li p:last-child {
  font-size: 1.6rem;
  line-height: 2;
  color: #e71c18;
}

.user-record {
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 14px 20px;
}

.user-record i {
  color: $red;
}

.record-list {
  background-color: $white;
}

.invest-liist {
  font-size: 1.2rem;
  padding-top: 3.7333%;
  padding-bottom: 3.7333%;
  color: #666;
}

.invest-liist strong {
  font-weight: normal;
  color: $red;
}

.record-list table {
  font-size: 1.4rem;
  line-height: 2;
  border-collapse: collapse;
  color: #555;
  background-color: $white;
}

.record-list table tr th {
  background: #edf0f3;
}

.record-list table tr th:first-child {
  padding: 13px 14px;
  text-align: left;
}

.record-list table tr th:last-child {
  text-align: right;
  color: #333;
}

.record-list table tr th span {
  color: $red;
}

.record-list table tbody tr td {
  padding: 3.333% 0;
  border-bottom: 1px solid #ececec;
}

.record-list table tbody tr td:first-child {
  border: 0;
}

.record-list table tbody tr td:nth-child(2) {
  text-indent: 1em;
}

.record-list table tr:last-child td {
  border: none;
}

.record-list .list-right {
  text-align: right;
}

.record-list .list-right span {
  font-size: 1.4rem;
  color: #e71c18;
}

.record-list .list-right p {
  font-size: 1.2rem;
}

.record-list table i {
  display: block;
  width: 4rem;
  height: 4rem;
  margin: 0 auto;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}

.server {
  font-size: 1.2rem !important;
  line-height: 1.7;
  padding-top: 6%;
  padding-bottom: 10%;
  text-align: justify;
}

.server h1 span {
  font-size: 1.5rem !important;
}

.server p {
  font-size: 1.2rem !important;
  text-indent: 2em !important;
  margin-left: 0 !important;
}

.server p span {
  font-size: 1.4rem !important;
}

.noMore {
  display: none;
  position: fixed;
  bottom: 10px;
  left: 50%;
  width: 20%;
  padding: 10px;
  -webkit-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -o-transform: translateX(-50%);
  transform: translateX(-50%);
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  color: $white;
}

.liner {
  line-height: 1;
}

.safeguard-box {
  color: #666;
  background: $white;
  font-size: 1.3rem;
}

.safeguard-box li {
  padding-top: 6.933%;
  padding-bottom: 6.933%;
}

.safeguard-box .safeguard {
  position: relative;
  padding-right: 1.2rem;
}

.safeguard-box .safeguard:after {
  position: absolute;
  top: 50%;
  right: 0;
  width: 0.8rem;
  height: 0.8rem;
  content: "";
  -webkit-transform: translateY(-50%) rotate(45deg);
  -moz-transform: translateY(-50%) rotate(45deg);
  -ms-transform: translateY(-50%) rotate(45deg);
  -o-transform: translateY(-50%) rotate(45deg);
  transform: translateY(-50%) rotate(45deg);
  border-top: 0.2rem solid #d6ddea;
  border-right: 0.2rem solid #d6ddea;
}

.white {
  color: $white;
}

i,
em {
  font-style: normal;
}

.remind {
  padding-top: 4%;
  color: #bfbfbf;
  font-size: 1.2rem;
  text-align: center;
}
.hasJoinBtn {
  padding-bottom: 7rem;
}
.joinBtn {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background: $white;
}
.joinBtn .btn {
  width: 92%;
  margin: 4%;
  border-radius: 3.63636rem;
}
</style>
