// 创建一个路由器实例
// 并且配置路由规则
const investRouter = [{
    //投资列表
    path: '/invest/fina',
    component: (resolve) => {
        require(['./components/invest/finaList.vue'], resolve)
    }
}, {
    //添添金
    path: '/invest/brisk',
    component: (resolve) => {
        require(['./components/invest/brisk.vue'], resolve)
    }
}, {
    //添添金产品说明
    path: '/invest/brisk-explain',
    component: (resolve) => {
        require(['./components/invest/briskExplain.vue'], resolve)
    }
}, {
    //添添金详情
    path: '/invest/brisk-detail',
    component: (resolve) => {
        require(['./components/invest/briskDetail.vue'], resolve)
    }
}, {
    //收银台
    path: '/invest/pay/:id',
    component: (resolve) => {
        require(['./components/invest/pay.vue'], resolve)
    }
}, {
    //投资成功
    path: '/invest/paySuccess',
    component: (resolve) => {
        require(['./components/invest/paySuccess.vue'], resolve)
    }
}, {
    //定期首页
    path: "/invest/finaIndex/:id",
    component: resolve => {
        require(["./components/invest/finaIndex.vue"], resolve);
    }
},{
    //定期服务协议
    path: "/invest/service",
    component: resolve => {
        require(["./components/invest/service.vue"], resolve);
    }
},]

export default investRouter;
