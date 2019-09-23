import { trim, regPhone } from '../../../utils/util.js'

const app = getApp()
const api = app.globalData.api
const regeneratorRuntime = require('../../../lib/regenerator-runtime/runtime-module.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,
    phoneValue: '',
    passwordValue: '',
    type: 'password',
    disabled: true
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

  changeValue(e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
    this.btnStatus()
  },
  close(e) {
    setTimeout(() => {
      this.setData({
        [e.currentTarget.dataset.name]: ''
      })
      this.btnStatus()
    }, 100)
    
  },
  eyeStatus(e) {
    console.log(e.currentTarget.dataset.name)
    this.setData({
      type: e.currentTarget.dataset.name
    })
  },
  btnStatus () {
    if (this.data.phoneValue && this.data.passwordValue) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  onChangeNavBack () {
    wx.navigateBack({
      delta: 1
    })
  },
  async login() {
    if (this.data.disabled) return;
    var phone = trim(this.data.phoneValue);
    var password = trim(this.data.passwordValue);
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!regPhone(phone)) {
      wx.showToast({
        title: '请输入正确格式的手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var params = {
      user: phone,
      password: password
    }
    await api.showLoading()
    api.postData(app.baseUrl + app.configApi.mobileLogin, params).then((res) => {
      console.log(res)
      if (res.code === 200) {
        api.hideLoading()
        wx.setStorageSync('login_info', res.data.user_info)
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
  // 忘记密码
  forgetPassword() {
    wx.navigateTo({
      url: '../forgetPassword/forgetPassword',
    })
  }
})