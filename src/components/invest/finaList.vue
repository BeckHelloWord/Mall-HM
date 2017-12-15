<template>
	<div class="investList" v-if="loadEnd">
		<ul  v-infinite-scroll="loadMore"
			infinite-scroll-disabled="loading"
			infinite-scroll-distance="10">
			<template v-if="investList.length>0" v-for="item in investList">
				<invest-item :item="item" ></invest-item>
			</template>	
		</ul>
		<div class="empty">
		<empty v-show='investList.length==0' :showImg='true' :padding='"120px"'></empty>
		</div>
	</div>
</template>

<script>
/*
标的列表
	接口：investList
	传参：
	max 		单页最大条数
	offset 		偏移值
 * @return Map
     *           title 标题
     *           yearRate 利率
     *           id 借款id
     *           cycleType 期限类型
     *           cycle 期限
     *           amount 借款金额
     *           surplusAmount 剩余金额
     *           schedule 定时发布时间
     *           subsidyRate 贴息利率
     *           rewardRate 奖励利率
     *           classify 标的类型
     *           isExclusiveApp 是否APP专享
     *           isLimitBeginner 是否新手投资
     *           isLimitRegularer 是否老客投资
     *           investProcess 投资进度
日期		作者		操作
5-8 	倪文斌		新建
*/
import { InfiniteScroll  } from 'mint-ui';
import investItem from '../public/investItem';
import empty from '../public/empty'
Vue.use(InfiniteScroll);
	export default {
		components:{
			investItem:investItem,
			empty
		},
		data: function() {
			return {
				investList:[
					{
						// id:522,
						// title:"测试1232大声道32131打碎打算1",
						// yearRate:7.8,
						// cycle:56,
						// cycleType:"day",
						// rewardRate:1,
						// isExclusiveApp:true,
						// isLimitBeginner:true,
						// isLimitRegularer:true,
						// investProcess:50,
						// surplusAmount:20000
					}
				],
				list:{},
				offset:0,
				max:10,
				hasNext:true,
				initLock:true,
				loadEnd:false
			}
		},
		methods: {
			loadMore() {
				if(this.initLock){
					return
				}
				if(!this.hasNext){
					return
				}
				this.loading = true;
				this.$public.API_GET({
					url : 'getFinaListOn',
					data:{
						offset:this.offset,
						max:this.max
					},
					success : (result) => {
						for(var item in result.data){
							this.investList.push(result.data[item])
						}
						this.offset+=this.max;
						this.loading = false;
						if(result.data.length<this.max){
							this.hasNext = false
						}
					}
				});
			},
			initData(finishFun) {
				this.offset=0;
				this.max=10;
				this.hasNext=true;
				this.investList=[];
				this.loadEnd=false;
				this.$public.API_GET({
					url : 'getFinaListOn',
					data:{
						offset:this.offset,
						max:this.max
					},
					success : (result) => {
						this.loadEnd=true
						this.investList=result.data;
						this.offset+=this.max;
						if(result.data.length<this.max){
							this.hasNext = false
						}
						this.initLock=false
						if(typeof(finishFun)=="function"){
							finishFun()
						}
					}
				});
			}
		},
		mounted: function() {
			
			this.initData()
			window.Hub.$emit('refresh', this.initData);
			window.Hub.$emit('setTitle', "投资", true, null, " ", null);
			window.Hub.$emit('setFooter',true);
			window.Hub.$emit('showHeader')
		}
	}
	/*
	* 获取投资项目列表
     * wd_api/finaApp/getFinaListOn
     * 参数：
     * offset  开始位置
     * max   每次获取件数
     * 返回参数：
     * List
     * Map
     * finaId 投资项目ID
     * title 投资项目名称
     * yearRate 年化利率(%)
     * investMin 最低投资额 默认1
     * investMax 最高投资额 默认0 不限制
     * cycle 期限
     * cycleNew H5嵌套页面使用期限
     * cycleNumber  数字 几天/几个月
     * cycleTypeShow "天" : "个月"
     * cycleType  "day" : "month"
     * type  类型 "月计划", "month" "季计划", "season"  "半年计划", "half"
     * typeName  类型名称
     * finaStatus 状态
     * finaStatusName 状态 名称 none ： 未上线  online：已上线 process ：待加入  success：已满额 run：收益中 done：已结束
     * amount  计划募集金额
     * alreadyAmount 已募集金额(本金)
     * surplusAmount 剩余可投金额
     * joinedNumber 加入人次
     * minYearRate 项目最低年化
     * maxYearRate 项目最高年化
     * openingTime 开始售卖时间
     * canRaiseDay 可募集天数
     * investProcess 投资进度
	*/ 
</script>
<style lang="scss" scoped="" type="text/css">
@import "../../assets/skin";

.empty{
	margin-top:pxToRem(80)
}
</style>