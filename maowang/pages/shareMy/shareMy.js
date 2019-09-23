const app = getApp()
const api = app.globalData.api
const iamgeUrl = app.baseUrlImage
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime-module.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,
    url: '',
    shareMoney: '',
    qrcode: '',
    data: {},
    imageUrl: iamgeUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.popUp = this.selectComponent(".changeAward");
    this.initMoney()
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  async initMoney() {
    let info = wx.getStorageSync('login_info');
    await api.showLoading() // 显示loading
    api.getData(app.baseUrl + app.configApi.myQrcode, {
      key: info.sesskey
    }).then((res) => {
      let info = wx.getStorageSync('shareInfo')
      this.setData({
        qrcode: info.qrcode_url
      })
      this.setData({
        data: res.data,
        qrcode: res.data.qrcode_url,
        shareMoney: res.data.bonus_money
      })
      api.hideLoading() // 等待请求数据成功后，隐藏loading
    })
    .catch((err) => {
      console.error(err)
      api.hideLoading() // 等待请求数据成功后，隐藏loading
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.share_title,
      path: '/pages/login/login?share=' + this.data.invitation_code,
      imageUrl: this.data.share_image
    }
  },
  onChangeNavBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 分享事件触发
  share() {
    this.popUp.openBox()
  },
  closeShare() {
    this.popUp.hideBox()
  },
  //生产海报
  poster() {
    wx.showToast({
      title: '还没开发此功能呢',
      icon: 'none'
    })
  }
})