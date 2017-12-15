<template>
	<div class="forget">
		<div class="tel">
			<div>
				<i class="iconfont icon-phone"></i>
				<input type="tel" placeholder="请输入手机号码" maxlength="11" v-model = 'tel'>
			</div>
			<p v-show='isTelEmpty'>*此处不可为空</p>
			<p v-show='isNotTel'>*无效的手机号</p>
		</div>
		<div class="verify">
			<div class="left">
				<input type="tel" maxlength="4" v-model="verif" placeholder="图片验证码">
			</div>
			<div class='right'>
				<verification :inputValue='verif' @verifyValue='verifyValue'></verification>
			</div>
		</div>
		<div class="verification clearfix">
			<div>
				<input type="tel" placeholder="输入手机验证码" maxlength="6" v-model = 'verificationCode'>
				<p v-show='isVerificationCodeEmpty'>*此处不可为空</p>
				<p v-show='isValid'>*无效的验证码</p>
			</div>
			<div>
				<input type="button" v-model="sendText" @click = 'sendRetrievePwdCode(false,$event)' >
				<input type="button" v-model="audioText" @click = 'sendRetrievePwdCode(true,$event)' >
				<!-- <input type="button" value="语言验证" @click = 'sendRetrievePwdCode(true)' > -->
			</div>
		</div>
		<div class="btn btnRadius"  @click='next'>
			下一步
		</div>
	</div>
</template>
<script>

	import { Toast } from 'mint-ui';
	import verification from '../public/verification'
	export default {
		components:{
			verification,
		},
		data:function(){
			return {
				isNotTel:false,
				isTelEmpty:false,
				isVerificationCodeEmpty:false,
				isValid:false,
				tel:'',
				verificationCode:'',
				audioText:'语音验证码',
				sendText:'发送验证码',
				count:120,
				// 图片验证码是否正确
				isVerifyRight:false,

				verif:''
			}
		},
		watch:{
			tel:function(to){
				//只能输入数字
				this.tel = to.replace(/[^0-9]/g,'')

				if(to != ''){
					this.isTelEmpty= false;
				}
				var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				if(!myreg.test(to))
				{
				    this.isNotTel = true
				} else{
					this.isNotTel = false;
				}
			},
			verificationCode:function(to){
				if(to != ''){
					this.isVerificationCodeEmpty= false;
				}
			},
		},
		methods:{
			verifyValue(bool){
				this.isVerifyRight = bool


			},
			next(){
				if(this.tel == ''){
					this.isTelEmpty = true;
				}
				if(this.verificationCode == ''){
					this.isVerificationCodeEmpty = true;
				}
				if(this.isNotTel || this.isTelEmpty || this.isVerificationCodeEmpty){
					return false;
				}

				this.$public.API_GET({
	                url : 'validRetrievePwdCode',
	                data : {
	                 		mobile:this.tel,
 							code:this.verificationCode
	                },
	                success :(result) =>{

	                	// console.log(result)
	                	if(!result.isSuccess){

	                		Toast({
							  message: result.message,
							  position: 'bottom',
							  duration: 3000
							});
	                		return false;
	                	}
	                	this.$router.push({name:'resetPassword',params:{tel:this.tel,code:this.verificationCode}})
	                }
           		});


			},
			sendRetrievePwdCode(bool,$event){

				if(this.tel == ''){

					Toast({
						message: '请先输入手机号',
						position: 'bottom',
						duration: 3000
					});
					return false;
				}
				if(!this.isVerifyRight){
					Toast({
						message: '请输入正确的验证码',
						position: 'bottom',
						duration: 3000
					});
					return false;
				}
				// console.log($event.srcElement)


				this.$public.API_GET({
	                url : 'sendRetrievePwdCode',
	                data : {
	                 		mobile:this.tel,
 							voice:bool
	                },
	                success :(result) =>{

	                	// console.log(result)
	                	if(!result.isSuccess){

	                		Toast({
							  message: result.message,
							  position: 'bottom',
							  duration: 3000
							});
	                		return false;
	                	}else{
	                		// 倒计时
	                		$($event.srcElement).parent().children('input').attr('disabled', 'disabled');
							var text = $($event.srcElement).val()=='发送验证码'?true:false;
							var timer = setInterval(()=>{
								this.count--;
								if(text){
									this.sendText = this.count +'s后可重新发送'
								}else{
									this.audioText = this.count +'s后可重新发送'
								}
								if(this.count == 0){
									clearInterval(timer)
									this.audioText = '语言验证码'
									this.sendText = '发送验证码'
									$($event.srcElement).parent().children('input').removeAttr('disabled')
									this.count = 120;
								}
							},1000)
	                	}

	                }
           		});
			}


		},
		mounted(){
			window.Hub.$emit('refresh', null);
			window.Hub.$emit('setTitle', "重置登录密码", false, null, ' ', null)
			window.Hub.$emit('setFooter',false);

			$('body').css('background', 'white');
		},
		beforeRouteLeave(to,from,next){
			if((to.path != '/index/login')&&(to.path != '/index/resetPassword')){
				$('body').css('background','#edf0f3')
			}
			next();
		}
	}
</script>

<style lang="scss" type="text/css" scoped="">
	@import "../../assets/skin";

	.forget{
		p{
			color:$red;
			font-size:pxToRem(24);
		}
		padding:pxToRem(50) pxToRem(30);
		input {
			box-sizing: border-box;
		    height:   pxToRem(36*2);
		    //line-height:    pxToRem(20*2);
		    //padding:   pxToRem( 8*2);
		    border:pxToRem( 1*2) solid #d3d3d3;
		    z-index: 0;
		    font-size:pxToRem(28);
		    &[type='tel']{
		    	width:100%;
			    padding-left:    pxToRem(40*2);
		    	// background: url(../../assets/images/mobiel_icon_blue.png) no-repeat  pxToRem( 8*2) center;
			    // background-size:     pxToRem(16*2)     pxToRem(24*2);
		    }
		    &[disabled="disabled"]{
		    	background:rgb(83,85,83) !important;
		    	color:white;
		    }
		    &[type='button']{
		    	font-size:pxToRem(24);
		    }

		}
		.tel{
			margin-bottom:    pxToRem(14*2);
  			position:relative;
  			&>div{
  				position: relative;
  			}
  			i{
  				position:absolute;
				top:50%;
				left:pxToRem(3);
				// margin-left:pxToRem( -40*2);
				padding:0 pxToRem(10);
				transform:translateY(-50%);
				-webkit-transform:translateY(-50%);
				font-size: pxToRem(46);
				color:$red;

  			}
		}
		.verification{
			margin-bottom:      pxToRem(14*2);
			div:first-child{
				float:left;
				width:48%;
				input{
					width:100%;
				}
				input{
					text-indent:1em;
					padding-left:0;
				}
			}
			div:last-child{
				width:48%;
				float:right;
					input{
						white-space:normal;
						line-height:normal;
						padding:0;
						width:48%;
						background:#f6f6f6;
						&:first-child{
							float:left;
						}
						&:last-child{
							float:right;
						}
					}

			}
		}
		.next{

			input[type='button']{
				@include btn;
				// background: #f90;
			 //    display: block;
			 //    height: 46px;
			 //    line-height: 46px;
			 //    font-size: 22px;
			 //    -webkit-border-radius: 5px;
			 //    -moz-border-radius: 5px;
			 //    -ms-border-radius: 5px;
			 //    -o-border-radius: 5px;
			 //    border-radius: 5px;
			 //    color: #fff;
			 //    border: 0;
			 //    text-align: center;
			    padding:0;
			    width:100%;
			}
		}
		.verify{
			margin-bottom:    pxToRem(14*2);
    		height:pxToRem(72);
    		.left{
    			width:48%;
    		}
			input{
				text-indent:1em;
				padding-left:0;
			}
    		.right{
				width:48%;
				height:100%;
    		}
    	}
	}
</style>