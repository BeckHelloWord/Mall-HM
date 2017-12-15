<template>
	<div class="reset">
		<div>
			<div class="relative">
				<i class="iconfont icon-mima"></i>
				<input type="password" placeholder="新密码" class="pass" v-model='password'>
			</div>
			<div :class="{showPassword:true,closePassword:closePassword}" v-show='showpass' @click='showPassword($event)'></div>
			<p v-show='isPasswordEmpty'>*此处不能为空</p>
			<p v-show='isPasswordValid'>*最少6个字符</p>
		</div>
		<div>
			<div class="relative">
				<i class="iconfont icon-mima"></i>
				<input type="password" placeholder="确认密码" class="pass" v-model='confirmPass'>
			</div>
			<p v-show='isConfirmPassEmpty'>*此处不能为空</p>
			<p v-show='isSame'>*两次输入的密码不一致</p>
		</div>
		<div class="btn btnRadius" @click='confirm'>
			确认
		</div>
	</div>
</template>
<script>
	import { MessageBox } from 'mint-ui';
	import { Toast } from 'mint-ui';
	export default {
		data:function(){
			return{
				isPasswordEmpty:false,
				isPasswordValid:false,
				isConfirmPassEmpty:false,
				isSame:false,
				password:'',
				confirmPass:'',
				closePassword:false,
				showpass:true
			}
		},
		watch:{
			password(to){
				if(to != ''){
					this.isPasswordEmpty= false;
					this.isPasswordValid = false
					this.isSame = false;
				}
			},
			confirmPass(to){
				if(to != ''){
					this.isConfirmPassEmpty= false;

					this.isSame = false;
				}
			}
		},
		methods:{
			showPassword(e){
				this.closePassword=!this.closePassword
				if(this.closePassword){
					$('.pass').attr('type', 'text')
				}else{
					$('.pass').attr('type', 'password')
				}
			},
			confirm(){
				if(this.password == ''){
					this.isPasswordEmpty=true;
					return false;
				}
				if(this.password.length<6){
					this.isPasswordValid = true;
					return false;
				}
				if(this.confirmPass == ''){
					this.isConfirmPassEmpty = true;
					return false;
				}
				if(this.password != this.confirmPass){
					this.isSame = true;
					return false;
				}



				this.$public.API_GET({
	                url : 'doRetrievePwdReset',
	                data : {
	                 		 mobile:this.$route.params.tel,
							 code:this.$route.params.code,
							 newPwd:this.password
	                },
	                success :(result) =>{

	                	// console.log(result)
	                	if(!result.isSuccess){
	                		// MessageBox('提示', result.message);
	                		Toast({
							  message: result.message,
							  position: 'bottom',
							  duration: 3000
							});
	                		return false;
	                	}else{
	                		// MessageBox('提示', '修改成功');
	                		MessageBox.alert('修改成功').then(action => {
	                			this.$router.push('/index/login')
							});
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

			// console.log(this.$route.params)
		},

		beforeRouteLeave(to,from,next){
			if((to.path != '/index/login')&&(to.path != '/index/forget')){
				$('body').css('background', '#edf0f3');
			}
			next();
		}
	}
</script>

<style lang="scss" type="text/css">
	@import "../../assets/skin";
	.reset{
		p{
			color:$red;
			font-size:pxToRem(24);
		}
		height:100%;
		background:white;
		padding:pxToRem(50) pxToRem(30);
		&>div{
			margin-bottom:    pxToRem(14*2);
			position:relative;
			i{
				position:absolute;
				top:50%;
				left:pxToRem(3);
				// margin-left:pxToRem( -40*2);
				padding:0 pxToRem(10);
				transform:translateY(-50%);
				-webkit-transform: translateY(-50%);
				   -moz-transform: translateY(-50%);
				    -ms-transform: translateY(-50%);
				     -o-transform: translateY(-50%);

				font-size: pxToRem(46);
				color:$red;
			}
		}
		.relative{
			position:relative;
		}

		input{
			font-size:pxToRem(28);
			height:    pxToRem(36*2);
		    // line-height:    pxToRem(20*2);
		    // padding:   pxToRem( 8*2);
		    border:   pxToRem( 1*2) solid #d3d3d3;
		    -webkit-box-sizing: border-box;
			box-sizing: border-box;
			width:100%;
			padding-left:    pxToRem(40*2);
			// background: url(../../assets/images/key_icon.png) no-repeat   pxToRem( 8*2) center;
		 //    background-size:   pxToRem(21*2)    pxToRem(24*2);
		}
		input[type="button"]{
			@include btn;
			padding:0;
			width:100%;
		}

		.showPassword{
			position:absolute;
			top:50%;

			// margin-left:pxToRem( -40*2);

			transform:translateY(-50%);
			-webkit-transform: translateY(-50%);
			   -moz-transform: translateY(-50%);
			    -ms-transform: translateY(-50%);
			     -o-transform: translateY(-50%);



			right:pxToRem(10);
			width: 10%;
	    	height:   pxToRem(  36*2);
			background:url(../../assets/images/close.png) no-repeat center;
			background-size:pxToRem(38) pxToRem(20);
		}
		.closePassword{
			background:url(../../assets/images/open.png) no-repeat center !important;
			background-size:pxToRem(36) pxToRem(26) !important;
		}
	}
</style>