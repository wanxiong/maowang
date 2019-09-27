// pages/home/home.js
const app = getApp()
const api = app.globalData.api
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime-module.js');
import { params } from '../../utils/util.js'

let countTimer = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    opacity: 0,
    interval: 3000,
    duration: 1000,
    indicatorDots: true,
    data: {},
    navH: 0,
    timer: '',
    isShow: false,
    shareMoney: 0,
    showMoney: false,
    apiTwoPage: 1, // 1 2 3 4第二个API  56第3个API， 789没有了
    apiTwoPageData: [
      '','','',''
    ],
    apiThreePageData: {
       // 大牌专区 优选好店
    },
    loadMoreFlag: false, //全部架子完毕
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })
    this.initData()
    this.initMoney()
    this.initDataTwo(this.data.apiTwoPage);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.popUp = this.selectComponent(".changeAward");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.initData(() => {
      clearInterval(countTimer)
      this.setData({
        apiTwoPage: 1,
        apiTwoPageData: [
          '', '', '', ''
        ],
        apiThreePageData: {},
        loadMoreFlag: false,
        timer: ''
      })
      wx.stopPullDownRefresh()
    })
    this.initDataTwo(1);
    
  },
  async initData (fn) {
    await api.showLoading() // 显示loading
    let { data } = await this.getList()  // 请求数据
    this.setData({
      data
    })
    fn && fn()
    this.countDowm(data.promote_goods.promote_info.leave_sale_time)
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
  },
  getList (parans = {}) {
    return new Promise((resolve, reject) => {
      api.getData(app.baseUrl + app.configApi.homeApi, {
      }).then((res) => {
        resolve(res)
      })
      .catch((err) => {
        console.error(err)
        reject(err)
      })
    })
  },
  /**
   * 外部链接web-view
  */
  taplink(e) {
    var json = e.target.dataset.json
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: `./../webview/webview?url=${json.ad_link}`
    })
  },
  // 自定义头触发
  onChangeTitleBar () {
    // console.log(111)
  },
  onPageScroll: function (e) {
    // console.log(e);//{scrollTop:99}
    let ratioMax = 66
    let y = e.scrollTop;
    if (y >= 66 ) {
      this.setData({ opacity:1})
    } else {
      this.setData({ opacity: y / ratioMax })
    }
  },
  // 打开领钱弹出层
  openMoney () {
    this.popUp.openBox()
    this.setData({
      showMoney: false
    })
  },
  close_money() {
    this.popUp.hideBox()
    this.setData({
      showMoney: true
    })
  },

  // 去分享页面
  onChangeQrcode() {
    
    let info = wx.getStorageSync('login_info');
    console.log(info)
    if (info || info.sesskey) {
      wx.navigateTo({
        url: './../shareMy/shareMy',
      })
    } else {
      let login_first = wx.getStorageSync('login_first');
      if (login_first) {
        wx.navigateTo({
          url: `./../login/phoneAuth/phoneAuth`
        })
        return
      }
      wx.navigateTo({
        url: './../login/login',
      })
    }
  },
  // 获取钱袋
  async initMoney () {
    let info = wx.getStorageSync('login_info');
    if (info || info.sesskey) {
      return;
    }
    await api.showLoading() // 显示loading
    api.postData(app.baseUrl + app.configApi.newRegister, {
      
    }).then((res) => {
      if (res.data.status == 1) {
        this.setData({
          shareMoney: res.data.bonus_money,
          showMoney: true
        })
        this.openMoney()
      }
      api.hideLoading() // 等待请求数据成功后，隐藏loading
    })
      .catch((err) => {
        console.error(err)
        api.hideLoading() // 等待请求数据成功后，隐藏loading
      })
  },
  // 跳转新人分享
  goShare () {
    wx.navigateTo({
      url: './../newPeople/newPeople',
    })
    setTimeout(() => {
      this.close_money()
    }, 1000) 
  },
  // 去拼团页面
  goPinTuan () {
    wx.navigateTo({
      url: './../pintuan/pintuan',
    })
  },
  // 去秒杀
  goMiaoSha () {
    wx.navigateTo({
      url: './../miaosha/miaosha',
    })
  },
  // 扫码
  scan() {
    wx.scanCode({
      success(res) {
        console.log(res)
        if (res.errMsg === 'scanCode:ok') {
          if (res.result.indexOf(app.testUrl) == -1 && res.result.indexOf(app.proUrl) == -1) {
            wx.showToast({
              title: '请选择猫王的二维码',
              icon: 'none',
              duration: 2000
            })
            return
          }
          if (res.result.indexOf("?") != -1) {
            let para = res.result.split('?')[1]
            let type = params(para, 'type')
            if (type === 'register') { // 跳转注册
              let share = params(para, 'u');
              wx.navigateTo({
                url: './../login/login?share=' + share,
              })
            } else if (type === 'goods') {
              let goods_id = params(para, 'goods_id');
              wx.navigateTo({
                url: './../webview/webview?url=' + res.result,
              })
            }
          }
          
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(res) {
        // wx.showToast({
        //   title: res.errMsg || '未知错误，请重试',
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    })
  },
  // 获取商城商品 自主品牌 商家商品  置换专区
  async initDataTwo (page) {
    let info = wx.getStorageSync('login_info');
    await api.showLoading() // 显示loading
    api.getData(app.baseUrl + app.configApi.homeApiTwo, {
      key: info && info.sesskey || '',
      cur_page: page
    }).then((res) => {
      console.log(res)
      let data = this.data.apiTwoPageData;
      data[page] = res.data;
      this.setData({
        apiTwoPageData: data
      })
      api.hideLoading() // 等待请求数据成功后，隐藏loading
    })
    .catch((err) => {
      console.error(err)
      api.hideLoading() // 等待请求数据成功后，隐藏loading
    })
  },
  // 获取大牌专区，优选好店
  async initDataThree(page) {
    let info = wx.getStorageSync('login_info');
    await api.showLoading() // 显示loading
    api.getData(app.baseUrl + app.configApi.homeApiThree, {
      key: info && info.sesskey || ''
    }).then((res) => {
      console.log(res)
      this.setData({
        apiThreePageData: res.data
      })
      api.hideLoading() // 等待请求数据成功后，隐藏loading
    })
      .catch((err) => {
        console.error(err)
        api.hideLoading() // 等待请求数据成功后，隐藏loading
      })
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let num = this.data.apiTwoPage;
    num++;
    if (num >= 6) {
      this.setData({
        loadMoreFlag: true
      })
      return false
    }
    this.setData({
      apiTwoPage: num
    })
    if (num <= 4) { // 2屏API
      this.initDataTwo(num);
    } else { // 3屏API
      this.initDataThree()
    }
    
  },
  /**
   * @param timeStr
   * @param timeNum 毫秒转换 默认为秒
   */
  countDowm (timeStr, timeNum = 1) {
    let timer = timeStr;
    countTimer = setInterval(() => {
      if (timer <= 0) {
        clearInterval(countTimer)
        this.setData({
          timer: ''
        })
        this.initData()
      }
      let minutes = parseInt(timer / timeNum / 60 % 60, 10);//计算剩余的分钟
      let seconds = parseInt(timer / timeNum % 60, 10);//计算剩余的秒数
      minutes = this.countDownStr(minutes);
      seconds = this.countDownStr(seconds);
      let hours = parseInt(timer / (timeNum * 60 * 60), 10); //计算剩余的小时
      hours = this.countDownStr(hours);
      let str = hours + ':' + minutes + ':' + seconds
      this.setData({
        timer: str
      })
      timer--
    }, 1000);
  },
  // 时间加0
  countDownStr(i) { //将0-9的数字前面加上0，例1变为01
    if(i < 10) {
      i = "0" + i;
    }
    return i;
  }
})