<template>
	<div class="packet">
		<div class="header">
			<p>可用红包总价值(元)</p>
			<p>{{packetData.useableAmount | formatMoney}}</p>
		</div>

		<div class="list">
			<h3 class="clearfix"><span>已使用红包(元)</span><span>{{packetData.usedAmount | formatMoney}}</span></h3>
			<ul   v-infinite-scroll="loadMore"
				  infinite-scroll-disabled="loading"
				  infinite-scroll-distance="10">
				<li v-for='item in packetData.voucherList'>
					<div>
						<h4><span>{{item.name}}</span><span>{{item.voucherTypeContent}}</span></h4>
						<div>
							<div>
								<p>{{item.voucherType=='profit'?item.interestRate:item.amount | formatMoney}}<span>{{item.voucherType=='profit'?'%':'元'}}</span></p>
								<p>投{{item.useLimitMoney}}可用</p>
							</div>
							<div>
								<p>{{item.timeLimitContent}}</p>
                                <p v-html='formatProfitContent(item.profitContent)'></p>
                                <p v-show='formatDue(item.dueTime)>3'>{{item.dueTimeContent}}</p>
								<p v-show='formatDue(item.dueTime)<=3 && formatDue(item.dueTime)>1'>{{formatDue(item.dueTime)}}天后到期</p>
                                <p v-show='formatDue(item.dueTime)==1'>有效期：最后一天</p>
								<p>获得途径：{{item.sendRemark}}</p>
							</div>
						</div>
					</div>
				</li>
			</ul>
            <empty v-show='showImg' :showImg='true'></empty>
		</div>


	</div>
</template>
<script>

    import empty from '../public/empty'
    import Vue from 'vue'
	export default{
        components:{
            empty,
        },
		data:function(){
			return {
				packetData:{},
				packetList:[],
				offset:0,
				max:10,
				// 判定是否继续
				bool:false,
                showImg:false,

			}
		},

		methods:{
            addFooter(){
                var _this = this
                var packet = Vue.extend( {
                    data:function(){
                        return {
                            text:'我要投资'
                        }
                    },
                    methods:{
                        goInvest(){
                            // console.log(window.location)
                            // location.hash='/invest'
                            _this.$router.push({ path: '/invest/fina'})
                        }
                    },
                    template: `<div class="goInvest" @click='goInvest'>{{this.text}}</div>`
                })
                var packetIntance = new packet({
                  el: document.createElement('div'),

                })

                document.body.appendChild(packetIntance.$el)
            },
			loadMore(){
				this.loading=true;
				if(this.bool){
					this.initData();
				}else{
					return false;
				}
			},
			initData(){
				this.$public.API_GET({
					url : 'packetList',
					data:{
						// memberId :,
						reqSource : this.$config.appSource,
						offset:this.offset,
						max:this.max
					},
					success : (result) => {
                        // console.log(result)
                        if(result.data.voucherList.length == 0 && this.offset == 0){
                            this.showImg = true;
                        }
						// console.log(result.data)
						result.data.voucherList.forEach(v=>{

							this.packetList.push(v)
						})
						this.bool = result.data.voucherList.length
						this.packetData=result.data
						this.packetData.voucherList=this.packetList;
						this.offset+=this.max;
						this.loading=false;
					}
				});
			}
		},
		mounted:function(){
            window.Hub.$emit('refresh', null);
			window.Hub.$emit('setTitle', "我的红包", false, null,' ', null)
            window.Hub.$emit('setFooter',false)
			this.initData();
            this.addFooter();


            // 红包 加息字段格式化
            Vue.prototype.formatProfitContent = function(value){
                value=value==null?'':value;

                return  value.replace(/，|,/,'<br>');
            }

            Vue.prototype.formatDue=function(value){
                // 当前时间
                var nowTime = new Date().getTime()
                var dueTime = new Date(value).getTime()
                return parseInt((dueTime-nowTime)/1000/60/60/24)

            }

		},
        beforeRouteLeave:function(to,from,next){
            $('.goInvest').remove()
            next();
        }

	}
</script>

<style lang="scss" type="text/css">
@import "../../assets/skin";

.goInvest{
    position: fixed;
    line-height: pxToRem(40*2);
    text-align:center;
    bottom:0;
    left:0;
    width:100%;
    background:rgba(230,230,230,0.6);
}
/*我的红包*/

.packet {
    .header {
        height:    pxToRem(  70*2);
        background-color: $red;
        text-align: center;
        color: white;
        padding-top:    pxToRem(  10*2);
        p {
            &:last-child {
                font-size:    pxToRem(  30*2);
            }
        }
    }
    .list {
        h3 {
            background-color: white;
            color: $red;
            font-weight: normal;
            line-height:    pxToRem(  40*2);
            padding: 0    pxToRem(  25*2);
            span {
                font-size: pxToRem(16*2);
                &:first-child {
                    float: left;
                }
                &:last-child {
                    float: right;
                }
            }
        }
        ul {
            padding:    pxToRem(  20*2)    pxToRem(  10*2);
            li {
                color: white;
                position: relative;
                margin-bottom:   pxToRem(  15*2);
                padding-bottom: pxToRem(15);
                background: url(../../assets/images/packet.png) repeat-x bottom;
                background-size:   pxToRem(  14*2)    pxToRem(  10*2);
                &>div {
                    background:$packetColor;
                    padding:   pxToRem(   5*2);
                    padding-bottom:0;
                    &::before {
                        position: absolute;
                        content: ' ';
                        width:    pxToRem(  15*2);
                        height:    pxToRem(  15*2);
                        background: $background;
                        border-radius:50%;
                        top:   pxToRem(  30*2);
                        left:   pxToRem(  -7.5*2);
                    }
                    &::after {
                        position: absolute;
                        content: ' ';
                        width:   pxToRem(  15*2);
                        height:   pxToRem(  15*2);
                        background: $background;
                        border-radius:50%;
                        top:  pxToRem(  30*2);
                        right:  pxToRem(  -7.5*2);
                    }
                    h4 {
                        font-size:  pxToRem(  15*2);
                        font-weight: normal;
                        line-height:  pxToRem(  65);
                        border-bottom: pxToRem(   1*2) dashed white;
                        padding: 0  pxToRem(  10*2);

                        span:last-child{
                          float:right;
                          font-size:pxToRem(26);
                        }
                    }
                    &>div {
                        font-size:pxToRem(24);
                        letter-spacing:0.08em;
                        padding: pxToRem(  10*2) 0 pxToRem(  10*2)  pxToRem( 110*2);
                        div {
                            &:first-child {
                                vertical-align: top;
                                text-align: center;
                                width:pxToRem( 105*2);
                                display: inline-block;
                                margin-left:    pxToRem(-110*2);
                                p {
                                    &:first-child {
                                        color: #FFEA39;
                                        font-size: pxToRem(  26*2);
                                        padding-top:pxToRem(6);
                                        padding-bottom: pxToRem(16);
                                        span {
                                            font-size: pxToRem(  12*2);
                                        }
                                    }
                                }
                            }
                            &:last-child {
                                display: inline-block;
                                padding-left: pxToRem(  10*2);
                                p {
                                    line-height: pxToRem(  22*2);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>