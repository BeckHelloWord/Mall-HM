//正式版本服务器
// var host = "http://10.0.20.101";
var host = "http://10.0.1.33:8686";
// var host = "http://10.0.1.1:8686";
// var host="";

export default {
    myHost:host,
    Model: {
        //list接口
        investList: host + "/wd_api/miss/getMissListOn",
        //detail接口
        investDetail: host + "/wd_api/subject/detailNewOn",
        //投资详情
        investVoucher: host + "/wd_api/subject/memberAmountByBorrow",
        //投资详情
        investHistoryRank: host + "/wd_api/subject/getDetailHistoryRankOn",
        //投资详情
        investHistory: host + "/wd_api/subject/getDetailHistoryOn",
        //invest 风控文章读取
        investRisk: host + "/wd_api/about/getNoticeDetailByTypeOn",
        //invest 标的详情页面
        investDatum: host + "/wd_api/subject/getDetailOn",
        //invest 收益计算
        investIncome: host + "/wd_api/borrowInvestApp/computerInvestMoney",
        //invest 订单检查
        checkOrder: host + "/wd_api/tradeOrdLog/checkOrder",
        //invest 创建订单
        investOrder: host + "/wd_api/tradeOrdLog/newOrder",
        //invest 订单状态查询
        findOrder: host + "/wd_api/tradeOrdLog/findOrder",
        //invest 订单状态查询
        getWeiXinSign: host + "/wechat/sign.html",
        //登录
        loginOn: host + "/wd_api/userCenter/loginOn",
        //设置登录密码
        editPassword: host + "/wd_api/userCenter/editPassword",
        //设置交易密码
        editOutPassword: host + "/wd_api/userCenter/editOutPassword",
        //重置交易密码（短信验证）
        resetOutPassword: host + "/wd_api/userCenter/resetOutPassword",
        //重置交易密码（短信验证）
        sendRestOutPassword: host + "/wd_api/memberInfoApp/sendRestOutPassword",
        //充值 实名绑卡
        BankCard: host + "/wd_api/appPay/getPayChannelCode",
        //获取银行卡信息
        bankDetail: host + "/wd_api/recharge/doWithdrawGetBank",
        //充值 银行列表
        bankList: host + "/wd_api/recharge/getBankList",
        //充值  去绑卡
        toBankCard: host + "/wd_api/appPay/getNewPayChannelCode",
        // 充值 开户信息
        bankInfo: host + "/wd_api/bankApp/changeBankDetail",
        bankMsg: host + "/wd_api/recharge/getMemberBankPhone",
        // 充值 预留手机号
        reBankPhone: host + "/wd_api/bankApp/changeBankMobile",
        //充值 京东支付
        toBankCardJd: host + "/wd_api/jDPay/doJDReadyPay",
        toBankCardJdPay: host + "/wd_api/jDPay/doJDPay",
        //充值 连连支付
        toBankCardLl: host + "/wd_api/recharge/lianlianSubmitByProj",
        //提现 手续费计算
        getMemberWithdraw: host + "/wd_api/recharge/getMemberWithdraw",
        //提现 可提现余额
        getMemberBalance: host + "/wd_api/memberAssetInfo/getMemberBalance",
        //提现 获取验证码接口
        sendVerifyOn: host + "/wd_api/userCenter/sendVerifyOn",
        //提现 银行卡添加以及修改
        saveBank: host + "/wd_api/recharge/saveBank",
        //提现 交易密码验证
        checkOutPassword: host + "/wd_api/userCenter/checkOutPassword",
        //确认提现
        doWithdraw: host + "/wd_api/recharge/doWithdraw",
        //提现绑定银行卡短信验证码
        bingBankOn: host + "/wd_api/userCenter/bingBankOn",
        //提现 银行卡名称
        getBankName: host + "/wd_api/recharge/getBankName",
        //首页    共同信息接口
        homePage: host + '/wd_api/homePage/getHomePageInitByProjOn',
        //消息中心
        message: host + '/wd_api/userCenter/getUserMessageList',
        //资金流水
        flowAmount: host + '/wd_api/memberAssetInfo/getMemberAssetFlowAmount',
        //我的红包
        packetList: host + '/wd_api/packetApp/getVoucherListByProj',
        // 投资记录
        // 我的投资
        investMine: host + '/wd_api/borrowInvestApp/memberInvestMoney',
        // 募集中
        process: host + '/wd_api/borrowInvestApp/memberInvestProcessList',
        //  待回款
        success: host + '/wd_api/borrowInvestApp/memberInvestSuccessList',
        //已回款
        done: host + '/wd_api/borrowInvestApp/memberInvestDoneList',
        //我的投资详情
        investDetails: host + '/wd_api/borrowInvestApp/memberInvestDetails',
        //未回款列表
        receiptWaitList: host + '/wd_api/borrowInvestApp/memberInvestDetailsReceiptWaitList',
        //已回款列表
        receiptDoneList: host + '/wd_api/borrowInvestApp/memberInvestDetailsReceiptDoneList',
        //债权转让
        receiptBondList: host + '/wd_api/borrowInvestApp/memberInvestDetailsReceiptBondList',
        // 我的
        getMemberCenterNewInfo: host + '/wd_api/memberInfoApp/getMemberCenterNewInfo',
        // 账户设置
        authentication: host + '/wd_api/userCenter/authentication',
        // 找回密码发送验证码
        sendRetrievePwdCode: host + "/wd_api/userCenter/sendRetrievePwdCodeOn",
        // 找回密码 验证码验证
        validRetrievePwdCode: host + '/wd_api/userCenter/validRetrievePwdCodeOn',
        // 找回密码 设置新的登陆密码
        doRetrievePwdReset: host + "/wd_api/userCenter/doRetrievePwdResetOn",
        //我的投资详情--债权转让
        memberInvestDetailsReceiptBondList: host + '/wd_api/borrowInvestApp/memberInvestDetailsReceiptBondList',
        //用手机号码注册或登录 验证短信码
        register: host + '/wd_api/userCenter/registerByProjOn',
        // 验证手机号是否已经注册
        checkRegisterMobile: host + '/wd_api/userCenter/checkRegisterMobileOn',
        //用户资产明细
        memberAsset: host + '/wd_api/memberAssetInfo/getMemberAsset',
        // 在途金额明细接口
        freezingAmount: host + '/wd_api/memberAssetInfo/getMemberFreezingAmount',
        // 登录发送验证码
        sendVerifyForLogin: host + '/wd_api/userCenter/sendVerifyForLoginOn',
        // 月月丰列表接口
        getFinaListOn: host + '/wd_api/finaApp/getFinaListOn',
        // 月月丰列表接口
        getFinaDetailByMember: host + '/wd_api/finaApp/getFinaDetailByMember',
        //投资项目的时候获取红包
        getVouchersByFina: host + '/wd_api/finaApp/getVouchersByFina',
        // 添添金申购页面 - 未登录
        showWealthProductOn: host + '/wd_api/wealthApp/showWealthProductOn',
        // 添添金申购页面 - 登录
        showBriskProduct: host + '/wd_api/wealthApp/showBriskProduct',
        // 添添金说明
        getBriskProductOn: host + '/wd_api/wealthApp/getBriskProductOn',
        // 添添金交易明细
        getMemberBriskAccountRecordList: host + '/wd_api/wealthApp/getMemberBriskAccountRecordList',
        // 添添金赎回 - 详情
        showRedeemWealth: host + '/wd_api/wealthApp/showRedeemWealth',
        // 添添金赎回 - 提交申请
        redeemWealth: host + '/wd_api/wealthApp/redeemWealth',
        // 短期投资计划投资界面初始化
        showInvestWealth: host + '/wd_api/wealthApp/showInvestWealth',
        // 短期投资计划投资
        investWealth: host + '/wd_api/wealthApp/investWealth',
        //个人中心-定期产品列表
        getMemberFinaInvest:host+'/wd_api/finaApp/getMemberFinaInvest',
        //定期首页
        getFinaDetailsOn: host + "/wd_api/finaApp/getFinaDetailsOn",
        //定期项目详情
        getFinaLibraryOn: host + "/wd_api/finaApp/getFinaLibraryOn",
        //定期前三名投资人
        getFinaHistoryRankOn: host + "/wd_api/finaApp/getFinaHistoryRankOn",
        //定期全部投资人
        getFinaHistoryOn: host + "/wd_api/finaApp/getFinaHistoryOn",
        //定期服务协议
        getFinaServiceContentOn:host+"/wd_api/finaApp/getFinaServiceContentOn",        
        //服务协议公共
        getHomePageNoticeOn:host+"/wd_api/about/getHomePageNoticeOn",
        //个人中心-定期产品详情
        getMemberFinaInvestDetail:host+"/wd_api/finaApp/getMemberFinaInvestDetail",
        //个人中心-定期产品持标明细
        getMemberFinaInvestItemList:host+"/wd_api/finaApp/getMemberFinaInvestItemList",
        //邀请好友
        getInvite: host + "/wd_api/inviteIndex/getInvite",
        //邀请好友top10
        inviteFriendRankOn: host + "/wd_api/inviteIndex/inviteFriendRankOn",
        //邀请好友按钮
        getMemberRecommend: host + "/wd_api/member/getMemberRecommend",
        //邀请好友列表
        getInviteDetail: host + "/wd_api/inviteIndex/getInviteDetail",
        //邀请好友奖励规则
        getRecommendRulesOn: host + "/wd_api/inviteIndex/getRecommendRulesOn"
    }
}
