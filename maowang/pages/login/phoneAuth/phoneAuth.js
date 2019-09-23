const app = getApp()
const api = app.globalData.api
const regeneratorRuntime = require('../../../lib/regenerator-runtime/runtime-module.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,
    params: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })
    let login_first = wx.getStorageSync('login_first');
    this.setData({
      params: login_first
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  onChangeNavBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  bindgetuserinfo(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      wx.login({
        success: res => {
          if (res.errMsg === 'login:ok') {
            var params = {
              code: res.code,
              phone_iv: encodeURIComponent(e.detail.iv),
              phoneencryptedData: encodeURIComponent(e.detail.encryptedData),
              ...this.data.params
            }
            this.phoneLogin(params)
          }
        }
      })
    } else {
      console.log('未知异常')
    }
  },
  async phoneLogin (data) {
    console.log('发送请求开始')
    await api.showLoading()
    api.postData(app.baseUrl + app.configApi.phoneLogin, data).then((res) => {
      api.hideLoading()
      if (res.code == 200) {
        api.hideLoading()
        wx.setStorageSync('login_info', res.data.user_info)
        // 清空记录 防止影响第一步
        wx.removeStorageSync('login_first')
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/home/home'
          })
        }, 2000)
      }
    })
      .catch((err) => {
        console.error(err)
        api.hideLoading()
      })
  },
  // 获取上级邀请人信息
  async getShare() {
    await api.showLoading()
    api.postData(app.baseUrl + app.configApi.share, { invitation_code: '', hideLoading: true }).then((res) => {
      if (res.code == 200) {
        api.hideLoading()
        this.setData({ text: res.data.user_name })
      }
    })
      .catch((err) => {
        console.error(err)
        api.hideLoading()
      })
  }
})