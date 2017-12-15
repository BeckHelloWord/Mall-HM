/*
	 * 新建订单（登录用户）
     * 接口访问路径：wd_api/tradeOrdLog/newOrder
     * 参数：
     * type invest 直投 bond 债权转让 fina 理财产品
     * objectKey 项目ID
     * number  份数
     * amount  金额
     * voucherId 红包ID
     *
     * 返回数据结构
     * status = 200 的场合 余额直接支付
     * tradeNo 订单号
     * status = 202 的场合 账户余额不足
     * tradeNo 订单号
     * truthAmt 需要支付的总额
     * memberAmt 用户账户可用余额
     * realName 用户真实姓名
     * idCard 用户身份证号
     * bankName 银行名称
     * bankAccount 银行账户号
     * mobile 银行卡预留手机号
     * dayDayMoney 短期投资计划 余额
     * wealAmt 红包抵扣金额


	 
	     * 投资计算（散标专用）
     * 接口访问路径：
     *     wd_api/borrowInvestApp/computerInvestMoney
     * 参数：
     *     memberId 用户id
     *     investMoney 投资金额
     *     borrowId 投资标的id
     *     voucherId 红包id （可选）
     * 返回参数：map
     *     totalIncome 标的收益
     *     unInvestRewardMoney 奖励金额
     *     payMoney 实际支付金额

*/

<template>
	<div class="investDetail">
		<div class="mainBox">
			<p class="rate">{{investData.loanRate|formatMoney}}<font class="subsidyRate" v-if="investData.subsidyRate>0">+{{investData.subsidyRate|formatMoney}}</font><span>%</span></p>
			<p class="rateTitle">借款年利率</p>
			<div class="rateTag">
				<div class="tagBox">
					<font v-if="investData.rewardRate>0" class="exclusive rewardRate">返现{{investData.rewardRate}}%</font>
					<font v-if="investData.isLimitBeginner" class="exclusive newbee">新手专享</font>
					<font v-if="investData.isLimitRegularer" class="exclusive oldCustomer">老客专享</font>
					<font v-if="investData.isExclusiveApp" class="exclusive oldCustomer">APP专享</font>
					<font v-if="!investData.isCanWorth" class="exclusive cant">不可转让</font>
					<font v-if="!investData.isAllowBond" class="exclusive cant">不可抵押</font>
				</div>
				<div class="rateCycle">
					项目期限：{{investData.cycle}}{{investData.cycleType}}
				</div>
			</div>
		</div>
		<div class="info">
			<div class="parts">
				<router-link :to="{ path: '/invest/datum/'+investId+'?type='+type}">
					<span class="fl"><i class="iconfont icon-info"></i>项目详情</span>
					<span class="fr">完善的信息披露</span>
				</router-link>
				<router-link to="/index/guarantee">
					<span class="fl"><i class="iconfont icon-safe"></i>安全保障</span>
					<span class="fr">10大安全保障</span>
				</router-link>
				<router-link :to="{ path: '/invest/history/'+investId+'?type='+type}">
					<span class="fl"><i class="iconfont icon-record"></i>投资记录</span>
					<span class="fr">{{investData.investorCount}}人已投资</span>
				</router-link>
			</div>
		</div>

			<div v-if="schedule" class="count-down-content">
                <div class="countDown"><i class="icon-clock"></i>开抢倒计时</div>

                <div class="cdTime">
                    <ul>
                        <li>
                            <div class="countdown-hour">
                                <ul>
                                    <li>{{hour1}}</li>
                                    <li>{{hour2}}</li>
                                </ul>
                            </div>
                        </li>
                        <li>时</li>
                        <li><div class="countdown-minute">
                            <ul>
                                <li>{{minute1}}</li>
                                <li>{{minute2}}</li>
                            </ul>
                        </div></li>
                        <li>分</li>
                        <li><div class="countdown-second">
                            <ul>
                                <li>{{second1}}</li>
                                <li>{{second2}}</li>
                            </ul>
                        </div></li>
                        <li>秒</li>
                    </ul>
                </div>
                
            </div>

		<div v-if="!schedule&&investType=='invest'" :class="detailMain">
			<ul>
				<li class="canVote clearfix">
					<div class="fl">
						<span>可投金额(元)</span>
						<p class="fontRed">{{investData.borrowLast|formatMoney }}</p>
					</div>
					<div class="gain fr">
						<span>预计收益(元)</span>
						<p class="yqsy fontRed">{{income}}</p>
					</div>
				</li>
				<li class="clearfix amountCont">
					<input type="number" name="amount" id="amount" align="center" onkeyPress="var keyCode = event.keyCode;if ((keyCode >= 48 && keyCode <= 57)){event.returnValue = true;} else {event.returnValue = false;}"  @input="userInput" v-model="investMoney" :placeholder="'起投金额'+investData.borrowMin+'元'">
				</li>
				<li class="redSelect clearfix" @click="selectVoucher">
					<div class="clearfix">
						<p>{{voucherText}}</p>
					</div>
				</li>
			</ul>
		</div>
		<div :class="investBtn" @click="checkOrder" v-if="bondBtn()">
			{{investData.status,schedule|btnText}}
			<img v-if="investData.status=='success'||investData.status=='done'||investData.status=='repayment'" class="sellOut" src="../../assets/images/sell_out.png" alt="">
		</div>
		
		<div id="voucherBox" style="display:none">
			<ul class="voucherUl">
				<li class='voucherNone voucher' data-index="-1">不使用红包</li>
				<template v-for="(item,index) in voucherList">
						<li class='voucher' :data-index="index">
						<div class="hongbao">
						<i class="iconfont icon-hongbao"></i>
						</div>
						<div>
						<p>{{item.amountContent}}</p>
						<p>{{item.conditionContent}}</p>
						<p class="dueTime">{{item.dueTime|voucherTime}}</p>
						</div>
						</li>
				</template>
			</ul>
		</div>
	</div>
</template>


<script>
import layer from '../../../static/layer.js'
import {Toast } from 'mint-ui';
	export default {
		components: {
	
		},
		data: function() {
			return {
				voucher: {},
				voucherText: "-",
				investMoney: "",
				investId: this.$route.params.investId,
				investData: {
					"lastTime": "",
					"classify": "",
					"isAllowBond": true,
					"overTime": "",
					"interestType": "",
					"title": "",
					"cycle": 0,
					"repayType": "",
					"number": 0,
					"min": 0,
					"isCanWorth": true,
					"dateCreated": "",
					"price": 0.00,
					"isFullExamine": false,
					"borrowMax": 0.00,
					"alreadyNumber": 0,
					"id": 522,
					"borrowLast": 0.00,
					"nowDate": "",
					"publishTime": "",
					"amount": 0.00,
					"subsidyRate": 0.00,
					"borrowBreif": "",
					"rewardRate": 0,
					"ensure": "",
					"address": "",
					"isLimitBeginner": false,
					"max": 0,
					"borrowUse": "",
					"borrower": "",
					"investorCount": 0,
					"borrowMin": 0,
					"alreadyAmount": 0.00,
					"cycleType": "",
					"isExclusiveApp": false,
					"borrowId": 522,
					"loanRate": 0,
					"status": ""
				},
				voucherList: [],
				type:this.$route.query.type?this.$route.query.type:"invest",
				income: "0.00",
				detailMain:"detailMain",
				investBtn:"investBtnDisable",
				customerInput:true,//用户自己输入金额
				customerSelect:true,//用户自己选择红包
				schedule:false,
				currentTime:0,
				currentInterval:{},
				hour1:0,
				hour2:0,
				minute1:0,
				minute2:0,
				second1:0,
				second2:0,
				investType:this.$route.query.type?this.$route.query.type:"invest",
				investLock:false
			}
		},
		watch: {
			investMoney: function(e) {
				this.calMoney()
			}
		},
		methods: {
			onYearChange(picker, values) {
				this.year = values[0];
			},
			countDown(){			
				this.currentInterval = window.setInterval(()=>{
					this.hour1 = Math.floor(this.currentTime /1000 / 3600 / 10);
					this.hour2 = Math.floor(this.currentTime /1000 / 3600 % 10);
					this.minute1 = Math.floor(this.currentTime /1000 % 3600 / 60 /10);
					this.minute2 = Math.floor(this.currentTime /1000 % 3600 / 60 %10);
					this.second1 = Math.floor(this.currentTime /1000 % 3600 % 60 /10);
					this.second2 = Math.floor(this.currentTime /1000 % 3600 % 60 %10);
					if(this.currentTime<0){
						window.clearInterval(this.currentInterval)
						this.schedule=false
					}
					this.currentTime -= 1000;	
				},1000)
			},
			bondBtn:function(){
				if(this.investType=="bond"){
					if(this.investData.status=='success'||this.investData.status=='done'||this.investData.status=='repayment'){
						return true
					}else{
						return false
					}
				}
				return true
			},
			userInput(){
				  
				this.customerInput=false
								
				if (this.investMoney > this.investData.borrowLast) {
					this.investMoney = this.investData.borrowLast
				}
				if(this.customerSelect){
					this.bestVoucher()
				}
				
			},
			selectVoucher() {
				this.customerSelect=false
				var _this = this
				if (this.voucherList.length == 0) {
					Toast({
						message:"无可用红包",
						position: 'bottom',
						duration: 2000
					})
					return
				}
				layer.dialog({
					// title: ['这是标题', 'background:red;'], // 第一个是标题内容  第二个是标题栏的style(可以为空)
					content: $("#voucherBox").html(),
					contentClass: "voucherList",
					// btn: ['确定'],
					time: 2000000,
					bindFun: () => {
						var voucherHeight = (this.voucherList.length + 1) * 62.08,
							showHeight;
						showHeight = voucherHeight > window.innerHeight / 1.5 ? window.innerHeight / 1.5 : voucherHeight
						$(".voucherList").css("height", showHeight)
						$(".voucherList").css("width", window.innerWidth*0.9)
						$(".voucher").on("click", function(e) {
							if(_this.customerInput){
								_this.setVoucher(e.currentTarget.dataset.index,true)
							}else{
								_this.setVoucher(e.currentTarget.dataset.index,false)
							}
							
							layer.instanceList[0].close()
							_this.calMoney()
						})
					}
				})
			},
			//最优红包加载
			bestVoucher: function() {
				var bestAmount=0,bestVoucher = -1;
				for(var item in this.voucherList){
					var tempVoucher=this.voucherList[item],redDeployAmount,tempAmount;
					if (tempVoucher.voucherType == "cash") {
						if(tempVoucher.useLimitMoney>this.investMoney){
							tempAmount = 0;
						}else if(tempVoucher.useLimitMoney>this.investData.borrowLast){
							tempAmount = 0;
						}else{
							tempAmount = tempVoucher.amount;
							if (tempVoucher.voucherAmountDeploy > 0) {
								redDeployAmount = tempVoucher.voucherAmountDeploy * this.investMoney / 100
								if (tempVoucher.amount > redDeployAmount) {
									tempAmount = redDeployAmount
								}
							}	
						}
					} else {
						if(tempVoucher.useLimitMoney>this.investMoney){
							tempAmount = 0;
						}else if(tempVoucher.useLimitMoney>this.investData.borrowLast){
							tempAmount = 0;
						}else{
							var effectiveMoney, effectiveDay, dayRate;
							if(tempVoucher.interestRate>0){
								dayRate=tempVoucher.interestRate/36000
							}
							if (tempVoucher.effectiveMaxMoney > 0 && tempVoucher.effectiveMaxMoney <= this.investData.borrowLast) {
								effectiveMoney = tempVoucher.effectiveMaxMoney
							} else {
								effectiveMoney = this.investMoney
							}
							if (tempVoucher.interestDay > 0) {
								effectiveDay = tempVoucher.interestDay
							} else {
								effectiveDay = this.investData.cycle * (investData.cycleType == "day" ? 1 : 30)
							}
							tempAmount =effectiveMoney*effectiveDay*dayRate
						}
					}
					// console.log(item+"金额"+tempAmount)
					// console.log(tempAmount>bestAmount)
					if(tempAmount>bestAmount){
						bestAmount=tempAmount;
						bestVoucher=item;
					}
				}
				this.setVoucher(bestVoucher)
			},
			setVoucher: function(num,isUserInput) {
				if (num > -1) {
					this.voucher = this.voucherList[num]
					this.voucherText = this.voucher.amountContent + "(" + this.voucher.conditionContent + ")"
					if(isUserInput){
						//最低金额
						var tempLimit=this.investData.borrowLast>this.investData.borrowMin?this.investData.borrowMin:this.investData.borrowLast
						var useLimitMoneyDeploy;
						var useLimitMoneyTemp;
						//比例计算
						if(this.voucher.voucherAmountDeploy>0){
							useLimitMoneyDeploy=this.voucher.amount/this.voucher.voucherAmountDeploy*100
							useLimitMoneyTemp=useLimitMoneyDeploy>this.voucher.useLimitMoney?useLimitMoneyDeploy:this.voucher.useLimitMoney
						}else{
							useLimitMoneyTemp=this.voucher.useLimitMoney
						}
						//比例红包超限改动
						if(this.investData.borrowMax<useLimitMoneyTemp){
							this.investMoney=this.investData.borrowMax
							return;
						}
						if(useLimitMoneyTemp>tempLimit){
							this.investMoney=useLimitMoneyTemp
						}else{
							this.investMoney=tempLimit
						}
						
					}
				} else {
					this.voucher = {
						amount: 0,
						amountContent: "不使用红包",
						conditionContent: "",
						dueTime: "",
						effectiveMaxMoney: null,
						interestDay: 0,
						interestRate: 0,
						name: "",
						sid: 0,
						startTime: "",
						status: "",
						useLimitMoney: 0,
						useLimitMonth: "",
						useTime: null,
						voucherAmountDeploy: 0,
						voucherType: ""
					}
					this.voucherText = "不使用红包"
				}

			},
			toLogin:function(){
				this.$router.push({ path: '/index/login',query:{"redirect":this.$route.path}})
			},
			investCheck: function() {
				if(this.investData.status!="process"){
					return false
				}
				if(!this.$public.Auth.get()){
					this.toLogin()
					
					return false
				}
				if(this.schedule){
					return false
				}
				if(this.investMoney==""){
					Toast({
						message:"请填写投资金额",
						position: 'bottom',
						duration: 2000
					})
					return false
				}
				if(this.investMoney.toString().indexOf(".")>-1){
					Toast({
						message:"请填写正确的投资金额",
						position: 'bottom',
						duration: 2000
					})
					return false
				}
				if(this.investMoney<this.voucher.useLimitMoney){
					Toast({
						message:"投资额小于红包起投金额"+this.voucher.useLimitMoney+"元",
						position: 'bottom',
						duration: 2000
					})
					return false
				}
				if(this.investMoney<(this.investData.borrowMin>this.investData.borrowLast?this.investData.borrowLast:this.investData.borrowMin)){
					Toast({
						message:"投资金额小于"+(this.investData.borrowMin>this.investData.borrowLast?this.investData.borrowLast:this.investData.borrowMin),
						position: 'bottom',
						duration: 2000
					})
					return false
				}
				return true
			},
			checkOrder(){
				if(!this.investCheck()){
					return
				}
				if(this.investLock){
					return
				}
				this.investLock=true
				var sendOrderData={
					objectKey : this.investId,
					type : "invest",
					amount :this.investMoney
				}
				if (this.voucher.sid != 0) {
					sendOrderData.voucherId  = this.voucher.sid
				}
				this.$public.API_GET({
					url: 'checkOrder',
					data: sendOrderData,
					success: (result) => {	
						this.investLock=false
						if(result.isSuccess){
							this.createOrder()
						}else{
							Toast({
								message:result.message,
								position: 'bottom',
								duration: 2000
							})
						}
					}
				});
			},
			calMoney: function() {
				
				if (this.investMoney == "" || this.investMoney == 0) {
					this.income = "0.00"
					return
				}
				var sendData = {
					borrowId: this.investId,
					investMoney: this.investMoney
				}
				if (this.voucher.sid != 0) {
					sendData.voucherId = this.voucher.sid
				}
				this.$public.API_GET({
					url: 'investIncome',
					data: sendData,
					success: (result) => {
						this.income = Number(result.data.totalIncome+result.data.unInvestRewardMoney).toFixed(2)
					}
				});
			},
			createOrder:function(){
				
				var sendOrderData={
					objectKey : this.investId,
					type : "invest",
					amount :this.investMoney
				}
				if (this.voucher.sid != 0) {
					sendOrderData.voucherId  = this.voucher.sid
				}
				this.$public.API_GET({
					url: 'investOrder',
					data: sendOrderData,
					success: (result) => {	
						this.investLock=false
						if(result.data&&result.isSuccess){
							if(result.data.truthAmt){
								if(result.messageCode==999||result.messageCode==998){
									this.$router.push({ path: '/home/bank/bindCard', query: { "amount": result.data.truthAmt , "tradeNo": result.data.tradeNo}})
									return
								}else if(result.messageCode==997){
									sessionStorage.setItem("payData",JSON.stringify(result.data))
									this.$router.push({ path: '/invest/pay'})
									return
								}
								//实名、绑卡跳转至收银台确认信息页面
								if(result.data.realName&&result.data.idCard &&result.data.bankAccount ){
									sessionStorage.setItem("payData",JSON.stringify(result.data))
									this.$router.push({ path: '/invest/pay'})
								}else{
									//未实名、未绑卡跳转至绑卡页面
									this.$router.push({ path: '/home/bank/bindCard', query: { "amount": result.data.truthAmt , "tradeNo": result.data.tradeNo}})
								}					
							}else{					
								this.$router.push({ path: '/invest/paySuccess', query: { "tradeNo": result.data.tradeNo }})
							}
						}else{
							Toast({
								message:result.message,
								position: 'bottom',
								duration: 2000
							})
						}
					}
				});
			},
			initData: function(finishFun) {
				this.$public.API_GET({
					url: 'investDetail',
					data: {
						id: this.investId,
						type: this.$route.query.type?this.$route.query.type:"invest"
					},
					success: (result,request) => {
						if(!result.isSuccess){
							if(result.status=="201"){
								Toast({
									message:"无法找到标的",
									position: 'bottom',
  									duration: 2000
								})
							}
							return
						}
						if(result.data.status !="process"){
							this.investBtn="investBtnDisable";
						}else{
							if(this.$public.Auth.get()){
								this.detailMain="detailMain showDetail"
							}
							this.investBtn="investBtn"
							if(result.data.schedule){
								this.currentTime = new Date(result.data.schedule).getTime() - new Date(request.getResponseHeader("date")).getTime()
								if(new Date(request.getResponseHeader("date")).getTime()<new Date(result.data.schedule).getTime()){
									this.countDown()
									this.schedule=true;
								}else{
									this.schedule= false;
								}								
							}
						}	
						this.investData = result.data;
						var investItem;
						var investItem = {};
						if (localStorage.investItem) {
							investItem = JSON.parse(localStorage.investItem)
						}
						investItem[this.investId] = {
							amount: result.data.amount,
							repayType: result.data.repayType,
							interestType: result.data.interestType?result.data.interestType:"满标审核后计息" ,
							type:this.type,
							classify:result.data.classify
						};
						localStorage.investItem = JSON.stringify(investItem)
		
						if(this.$public.Auth.get()){
							this.getVoucher()
						}else{
							this.voucherText = "不使用红包"
						}

						window.Hub.$emit('setTitle', result.data.title?result.data.title:"标的详情 ", false, null, " ", null)
						if (typeof(finishFun) == "function") {
							finishFun()
						}
					}
				});
			},
			getVoucher: function() {
				this.$public.API_GET({
					url: 'investVoucher',
					data: {
						id: this.investId,
						type: "invest"
					},
					success: (result) => {
						if (result.data.voucherList) {
							// this.voucherList.push(result.data.voucherList[0])
							this.voucherList = result.data.voucherList
							this.voucherText = "您有" + result.data.voucherList.length + "个红包可以使用"
						}else{
							this.voucherText = "不使用红包"
						}

					}
				});
			}
		},
		mounted: function() {
			this.initData()
			localStorage.setItem("webViewHeight",$(window).height())
			window.Hub.$emit('refresh', this.initData);
			window.Hub.$emit('setTitle', "标的详情", false, null, " ", null)
			window.Hub.$emit('setFooter', false);
 			//
		},
		beforeMount: function() {
	
		},
		destroyed:function(){
			if(layer.instanceList[0]){
				layer.instanceList[0].close()
			}
		},
		filters: {  
			formatLoanRate: function (value) {  
				return Number(value).toFixed(2)
			},
			voucherTime:function(value){
				return value.split(" ")[0]
			},
			btnText: function(value,schedule){
				switch (value){
					case "success":
					return "正在还款"
					break ;
					case "process":
					if(schedule){
						return "尚未开始"
					}else{
						return "立即投资"
					}
					break ;
					case "done":
					return "回款完毕"
					break ;
					case "failure":
					return "募集失败"
					break ;
					case "repayment":
					return "正在还款"
					break ;
					default :
					return "立即投资"
				}
			}
		}  

		
	}
</script>

<style lang="scss" scoped="" type="text/css">
	@import "../../assets/skin";
	//标的详情
	@font-face {
		font-family: 'fontName-num';
		src: url('../../assets/fontNum/font-num-webfont.eot');
		src: url('../../assets/fontNum/font-num-webfont.eot?#iefix') format('embedded-opentype'),
		url('../../assets/fontNum/font-num-webfont.woff2') format('woff2'),
		url('../../assets/fontNum/font-num-webfont.woff') format('woff'),
		url('../../assets/fontNum/font-num-webfont.ttf') format('truetype'),
		url('../../assets/fontNum/font-num-webfont.svg#fontName-num') format('svg');
		font-weight: normal;
		font-style: normal;
	}
	.investDetail {
		.mainBox {
			background: #fff;
			text-align: center;
			padding: 30px 10px 5px 10px;
			margin-bottom: 10px;
			.rate {
				font-size: pxToRem(80);
				color: $red;
				height: pxToRem(80);
				line-height: pxToRem(80);
				span {
					font-size: pxToRem(40);
				}
				
			}
			.subsidyRate{
				font-size: pxToRem(40);
			}
			.rateTitle {
				font-size: pxToRem(30);
			}
			.rateTag {
				display: inline-block;
				width: 100%;
				.tagBox {
					margin-top: 15px;
					width: 65%
				}
				.exclusive {
					height: 20px;
					line-height: 20px;
					padding: 0 6px;
					font-weight: normal;
					font-size: 0.8rem;
					display: inline-block;
					float: left;
					margin: 5px;
				}
				.newbee {
					background: #f2f8e9;
					color: #84bb25;
				}
				.rewardRate {
					background: #fde8e7;
					color: #fd7e80;
				}
				.oldCustomer {
					color: #2d449f;
					background: #eaecf5;
				}
				.cant {
					color: #d6a000;
					background: #fdfaf2;
				}
				.rateCycle {
					float: right;
					height: 20px;
					line-height: 20px;
					display: inline-block;
					width: 35%;
					text-align: right;
					margin: 5px 0;
					font-size: 1rem;
				}
			}
		}
		.info {
			background: #fff;
			position: relative;
			overflow: hidden;
			margin-bottom: 10px;
			.parts {
				a {
					height: 32px;
					line-height: 32px;
					padding: 9px 5% 8px 0;
					margin: 0 10px;
					border-bottom: 1px solid #dedede;
					position: relative;
					display: block;
					font-size: 1.2rem;
					background: url(../../assets/images/gt.jpg) no-repeat right center;
					background-size: 8px 14px;
					color: #1b2b3f;
					i {
						font-size: 20px;
						margin: 5px;
						color:$red;
					}
				}
				a:last-child {
					border-bottom: none;
				}
			}
		}
		.showDetail{
			height:204px!important;
		}
		.detailMain {
			transition:all 2s;
			-webkit-transition:all 2s;
			height:0;
			overflow:hidden;
			ul{
				padding: 14px;
			}
			
			background: #fff;
			li.canVote {
				div {
					width: 50%;
					.fontRed {
						color: #e71c18;
						font-size: 1.6rem;
						line-height: 1.6;
					}
				}
				.fr {
					text-align: right;
				}
			}
			.amountCont {
				border: 1px solid #d2d2d2;
				height: 48px;
				line-height: 48px;
				margin-bottom: 20px;
				margin-top: 10px;
				input {
					width: 100%;
					line-height: 30px;
					padding: 9px 0;
					border: 0;
					text-align: center;
					float: left;
					font-size: 1.3rem;
				}
			}
			.redSelect {
				width: 100%;
				height: 48px;
				line-height: 48px;
				text-align: center;
				font-size: 1.2rem;
				border: 1px solid #d2d2d2;
				p {
					max-width: 80%;
					margin-left: 10%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					display: block;
					text-align: center;
				}
			}
		}
		.investBtn {
			margin: 10px;
			background: $red;
			color: #fff;
			height: 46px;
			line-height: 46px;
			font-size: 22px;
			border: 0;
			text-align: center;
		}
		.investBtnDisable {
			margin: 10px;
			background: $gary;
			color: $garyFont;
			height: 46px;
			line-height: 46px;
			font-size: 22px;
			border: 0;
			text-align: center;
		}
		.sellOut {
			width: 30%;
			position: absolute;
			right: -10px;
			bottom: -10px;
			z-index: 99;
		}
		.count-down-content{position: relative;padding:14px;margin:14px 0;background-color:#fff;}
		.count-down-content .icon-clock{display: block;width: 26px;height: 26px;background: url(../../assets/images/detail-clock.png) no-repeat center center;position: absolute;left: 0;top:0;margin-left: -26px}
		.count-down-content .countDown{height: 26px;text-align: center;width: 100px;margin: 20px auto;font-size: 18px;line-height: 26px;position: relative }
		.count-down-content .cdTime{width: 280px;height: 36px;margin: 0 auto 20px;}
		.count-down-content .cdTime li{display: block;float: left;font-size: 18px;line-height: 36px;height: 36px;margin-left: 8px}
		.count-down-content .cdTime .countdown-hour li,.count-down-content .cdTime .countdown-minute li,.count-down-content .cdTime .countdown-second li{font-size: 36px;color: red;min-width:18.33px;line-height: 36px;font-family: fontName-num}
		.count-down-content .btn{line-height:42px;text-align:center;font-size:16px;color:#fff;background-color:#2d449f;display:block;-webkit-border-radius:3px;border-radius:3px;}
		.count-down-content .auto-tip{width:100%;height:24px;line-height:24px;padding:0 10px;border:1px solid #f5f5f5;text-align:center;color:#999;background-color:#fafafa;overflow:hidden;box-sizing:border-box;-webkit-box-sizing:border-box;}

	}
</style>