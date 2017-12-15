<template>
	<div class="money">
		<!-- <div class="over">
			<ul class='clearfix'>
				<li>
					<router-link to='/money/all'>全部</router-link>
				</li>
				<li>
					<router-link to='/money/invest'>投资</router-link>
				</li>
				<li>
					<router-link to='/money/recharge'>充值</router-link>
				</li>
				<li>
					<router-link to='/money/withdraw'>提现</router-link>
				</li>
				<li>
					<router-link to='/money/receipt'>回款</router-link>
				</li>
				<li>
					<router-link to='/money/reward'>奖励</router-link>
				</li>
				<li>
					<router-link to='/money/other'>其他</router-link>
				</li>

			</ul>
		</div> -->
		<!-- <router-view></router-view> -->
		<moneyItem :type='typeName'></moneyItem>
	</div>
</template>
<script>



	// import Vue from 'vue'
	import moneyItem from '../public/moneyItem'

	export default{
		components:{
			moneyItem
		},
		data:function(){
			return{
				typeName:'all',
				// 保存导航移动的距离
				distance:0
			}
		},
		methods:{

			addNav:function(){
				var moneyNav = window.Vue.extend( {
        			methods:{
        				moveNav($event,index,typeName){
        					// console.log(_this)
        					_this.typeName = typeName

        					// console.log($event)
        					var bodyWidth = $('body').width()
				      		var ulWidth = $('.moneyNav').find('ul').width()

				      		var ul_body = ulWidth - bodyWidth;
        					var width = $event.srcElement.offsetWidth
				      		// console.log(index*width)
        					if(index*width>ul_body){
        						$('.moneyNav').find('ul')[0].style.transform = 'translateX('+ (-ul_body)+'px)'
        						_this.distance = ul_body
        					}else{
        						$('.moneyNav').find('ul')[0].style.transform = 'translateX('+ (-index*width)+'px)'
        						_this.distance = index*width
        					}
        					$($event.srcElement).addClass('router-link-active').siblings('').removeClass('router-link-active')

        				}
        			},
			        template: `

                        <div class="moneyNav" id="moneyNav">
                            <ul class='clearfix'>
                                <li class='moneyNav_all router-link-active' @click='moveNav($event,0,"all")'>
                                    全部
                                </li>
                                <li class='moneyNav_invest' @click='moveNav($event,0,"invest")'>
                                    投资
                                </li>
                                <li class='moneyNav_recharge' @click='moveNav($event,1,"recharge")'>
                                    充值
                                </li>
                                <li class='moneyNav_withdraw' @click='moveNav($event,2,"withdraw")'>
                                    提现
                                </li>
                                <li class='moneyNav_receipt' @click='moveNav($event,3,"receipt")'>
                                    回款
                                </li>
                                <li class='moneyNav_reward' @click='moveNav($event,4,"reward")'>
                                    奖励
                                </li>
                                <li class='moneyNav_other' @click='moveNav($event,5,"other")'>
                                    其他
                                </li>
                            </ul>
                        </div>
                    `
			    })

			    var navIntance = new moneyNav({
			      el: document.createElement('div'),
			    })
                $('.main-body')[0].appendChild(navIntance.$el)
  				// document.body
			}
		},
		mounted:function(){
			window.Hub.$emit('refresh', null); 
			window.Hub.$emit('setTitle', "交易记录", false, null,' ', null)
			window.Hub.$emit('setFooter',false)
			this.addNav();
			window._this = this;
			if(!config.isWeiXin()){
                $('section.top').append($('#moneyNav'))
			}else{
                $('#moneyNav').addClass('moneyNavToHeader')
            }
			// 拖动导航
			var moneyNav = document.getElementById('moneyNav').children[0];
            // moneyNav = moneyNav.children[0]
			var startX = 0;
			var endX = 0;
			// var _this.distance = 0;
			var preDistance = 0;
			// var width = $(el).width()
      		var bodyWidth = $('body').width()
      		var ulWidth = $('.moneyNav').find('ul').width()

      		var ul_body = ulWidth - bodyWidth;
            // moneyNav.style.width=ulWidth+'px';
			moneyNav.addEventListener('touchstart',(e)=>{
				// console.log('start')
				// console.log(e.touches[0].clientX)
				startX = e.touches[0].clientX;
				preDistance = _this.distance;

				// event.preventDefault();
			})

			moneyNav.addEventListener('touchmove',(e)=>{
				// console.log('move')
				// console.log(e.touches[0].clientX)
				endX = e.touches[0].clientX;

				_this.distance = startX-endX + preDistance;
				// console.log(_this.distance)
				moneyNav.style.transition = 'none';

				if(_this.distance > 0 && _this.distance < ul_body){
					// console.log(distance)
					// console.log(ul_body)
					moneyNav.style.transform = 'translateX('+ (-_this.distance)+'px)'
				}else if(_this.distance <0){
					_this.distance = 0;
				}else if(_this.distance > ul_body){
					_this.distance  = ul_body;
				}
			})

			document.addEventListener('touchend',(e)=>{
				// console.log('end')
				moneyNav.style.transition = 'transform 1s';
			})


			// 导航置顶
			window.onscroll = (function(event) {
					/* Act on the event */
				// var top = $('body').scrollTop()
				var nav = document.getElementById('moneyNav')
				if($('body').scrollTop()>50){
					// $('#nav')
					$('#moneyNav').addClass('moneyNavTop')
				}else{
					$('#moneyNav').removeClass('moneyNavTop');
				}
			});

            // $('body').css('overflow-x', 'hidden');
		},
        beforeRouteLeave:function(to,from,next){
        	$('.moneyNav').remove()
            $('body').removeAttr('style')
            next();
        }
	}
</script>

<style lang="scss" type="text/css" >
@import "../../assets/skin";

/*资金流水*/

	.money{
		padding-top:pxToRem(40*2);
	}
	.moneyNavTop{
        position:fixed;
		top:0px !important;
		box-shadow:0 1px 5px $red;

	}
    .moneyNavToHeader{
        position:fixed;
        top:0;
        z-index:100000;

    }
    .moneyNav {

        overflow: hidden;
        // 隐藏滚动bar
        &::-webkit-scrollbar {
            display: none;
        }
	    ul {
	    	// transition:all 1s;
	        width:   pxToRem( 525*2);
	        li {
	            float: left;
	            width:     pxToRem(  75*2);
	            height:     pxToRem(  40*2);
	            text-align: center;
	            font-size:     pxToRem(  14*2);
	            box-sizing: border-box;
	            color: #aaa;
                background-color: white;
                line-height:     pxToRem(  40*2);
	            // a {
	            //     display: inline-block;
	            //     width: 100%;
	            //     height: 100%;

	            // }
	            &.router-link-active {
                    border-bottom:    pxToRem(   2*2) solid $navBorderBottom;
                }
	        }
	    }
    }



</style>