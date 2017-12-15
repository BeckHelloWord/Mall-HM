<template>
    <div class="main-body">
        <my-header :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" v-show="showHeader"></my-header>
        <mt-loadmore :top-method="refresh" ref="my_track" @top-status-change="handleTopChange" :class="loadmoreTop">
            <div slot="top" class="mint-loadmore-top">
                <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }"><div class="loadingCoin"></div></span>
                <span v-show="topStatus === 'loading'">
              <div class="loadingCoin"></div>
              </span>
            </div>
            <router-view></router-view>
        </mt-loadmore>
        <my-footer></my-footer>
    </div>
</template>

<script>
    import 'mint-ui/lib/style.css'
    import "./assets/iconfont.css";
    import "./assets/normalize.css";
    import Interface from './js/interface.js'
    import Scroller from './components/public/Scroller.vue'
    import header from './components/public/header.vue'
    import footer from './components/public/footer.vue';
    import Loadmore from './components/public/loadmore.vue';
    import Public from './js/public.js';
    import {
        Toast
    } from 'mint-ui';
    import config from './js/config.js';
    window.Public = Public;
    window.config = config;
    export default {
        components: {
            Scroller: Scroller,
            myHeader: header,
            myFooter: footer,
            mtLoadmore: Loadmore
        },
        watch: {
            '$route': function() {
                this.$refs.my_track.onTopLoaded();
            }
        },
        data() {
            return {
                title: "",
                leftIcon: "",
                rightIcon: "",
                showHeader: this.$config.isWeiXin(),
                topStatus: '',
                toastFlag: false,
                loadmoreTop: ""
            }
        },
        methods: {
            handleTopChange(status) {
                this.topStatus = status;
            },
            refresh: function() {
                var _this = this
                this.refreshFun(function() {
                    _this.$refs.my_track.onTopLoaded();
                })
            },
            setTitle: function(Name) {
                this.title = Name
                document.title = Name;
                var titletxt = Name;
                //解决ios无法获取title问题123
                setTimeout(function() {
                    var body = document.getElementsByTagName('body')[0];
                    document.title = titletxt;
                    var iframe = document.createElement("iframe");
                    iframe.style.display = "none";
                    var d = function() {
                        setTimeout(function() {
                            iframe.removeEventListener('load', d);
                            document.body.removeChild(iframe);
                        }, 0);
                    };
                    iframe.addEventListener('load', d);
                    document.body.appendChild(iframe);
                }, 0);
            },
    
            refreshFun: function() {
                this.$refs.my_track.onTopLoaded();
            },
            refreshFunDef: function() {
                this.$refs.my_track.onTopLoaded();
            },
            rightFunDef: function() {},
            leftFunDef: function() {
                history.back();
            }
        },
        beforeCreate: function() {
            
            if (config.isWeiXin()) {
                this.$public.initShare()
            }
            // else{
            //     this.$public.initApp()
            // }
            
            //设置下拉刷新方法
            window.Hub.$on('refresh', (event) => {
                if (typeof(event) == "function") {
                    window.Hub.$emit('closeLoaderMore', true);
                    this.refreshFun = event;
                } else {
                    window.Hub.$emit('closeLoaderMore', false);
                    this.refreshFun = this.refreshFunDef;
                }
            });
            //header事件
            window.Hub.$on('setTitle', (title, leftIcon, leftFun, rightIcon, rightFun) => {
                this.leftIcon = leftIcon;
                this.rightIcon = rightIcon;
    
                if (config.isWeiXin()) {
                    window.Hub.$emit('hideHeader');
                } else {
                    this.loadmoreTop = config.setTopClass()
                    window.Hub.$emit('showHeader');
                }
                var setLeftFun = typeof(leftFun) == "function" ? leftFun : this.leftFunDef;
                var setRightFun = typeof(rightFun) == "function" ? rightFun : this.rightFunDef;
                window.Hub.$emit('setHeader', setLeftFun, setRightFun);
                this.setTitle(title);
            });
            window.Hub.$on('hideHeader', () => {
                this.showHeader = false;
                $(".mint-loadmore-content").css("paddingTop", "0")
            });
            window.Hub.$on('showHeader', () => {
                // this.showHeader = false;
                // $(".mint-loadmore-content").css("paddingTop", "0")
                this.showHeader = true;
                $(".mint-loadmore-content").css("paddingTop", "50px")
            });
            window.Hub.$on('loginOut', (message) => {
                if (this.toastFlag) {
                    return
                }
                this.toastFlag = true;
                Toast({
                    message: message,
                    position: 'bottom',
                    duration: 2000
                })
                window.setTimeout(() => {
                    this.toastFlag = false;
                    this.$router.push({
                        path: '/index/login'
                    })
                }, 2000)
            });
            window.Hub.$on('toast', (message) => {
                if (this.toastFlag) {
                    return
                }
                this.toastFlag = true;
                Toast({
                    message: message,
                    position: 'bottom',
                    duration: 2000
                })
                  window.setTimeout(() => {
                    this.toastFlag = false;
                }, 2000)
            });
        },
        mounted: function() {
    
        }
    }
</script>

<style lang="sass-loader">
    @import "./assets/skin";
    @import "./assets/pubilc";
</style>

