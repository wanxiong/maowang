//app.js
const api = require('./http/index')

App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        //导航高度
        // this.globalData.navHeight = res.statusBarHeight + 46;
        let bar = wx.getMenuButtonBoundingClientRect();
        let h = ''
        let top = 0
        if (res.system.indexOf('iOS') > -1) {
          h = 44; 
          top = 6;
        } else {
          h = 48;
          top = 8;
        }
        this.globalData.navHeight = res.statusBarHeight + h;
        this.globalData.statusBarHeight = res.statusBarHeight;
        this.globalData.top = top;
        this.globalData.inputWidth = bar.left - 30 -10;
      }, fail(err) {
        console.log(err);
      }
    })
    // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             // 可以将 res 发送给后台解码出 unionId
  //             this.globalData.userInfo = res.userInfo

  //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //             // 所以此处加入 callback 以防止这种情况
  //             if (this.userInfoReadyCallback) {
  //               this.userInfoReadyCallback(res)
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  },
  globalData: {
    userInfo: null,
    api: api,
    navHeight: 0
  },
  baseUrl: 'https://mao.520haigo.com/', // 正式环境 https://api.caose.cn/
  testUrl: 'https://mao.520haigo.com/',
  proUrl: 'https://api.caose.cn/',
  baseUrlImage: 'https://api.caose.cn/shopapi/image/', // 正式环境   
  configApi: {
    homeApi: 'shopapi/index.php/first/indexOne', // 广告图、轮播图、秒杀、拼团
    mobileLogin: 'shopapi/user/login', // 登录接口
    register: 'shopapi/user/register', // 用户手机号注册
    verifyCode: 'shopapi/user/send_forget_code', // 获取短息验证码
    reetPassword: 'shopapi/user/reset_password', // 重置密码
    share: 'shopapi/wxamp/getUserParentInfo', // 邀请人信息查询
    unionIdLogin: 'shopapi/wxamp/OpenidLogin', // uniodid 微信授权登录
    phoneLogin: 'shopapi/wxamp/create_user_data', // 手机号微信授权登录
    myQrcode: 'shopapi/user/share_register', // 我的二维码
    newRegister: 'shopapi/first/new_register_bones', // 首页新人红包弹框
    preferential: 'shopapi/first/Preferential', // 新人商品推荐单页接口
    pinTuanList: 'shopapi/pintuan/pintuan_list', // 拼团接口
    homeApiTwo: 'shopapi/index.php/first/indexTwo', // 首页商品分页,1代表商城商品，2代表自主品牌,3代表商家商品，4代表置换专区
    homeApiThree: 'shopapi/index.php/first/indexThree', // 大牌专区和优选好店
    miaoShaList :'shopapi/goods_promote/goods_promote', // 秒杀接口
    miaoShaRemind: 'shopapi/goods_promote/setUserRemind', // 杀提醒预约
  },
})