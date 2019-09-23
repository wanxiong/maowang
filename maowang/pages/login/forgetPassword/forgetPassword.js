import { trim, regPhone, regPassword } from '../../../utils/util.js'

const app = getApp()
const api = app.globalData.api
const regeneratorRuntime = require('../../../lib/regenerator-runtime/runtime-module.js');

let wait = 60;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,
    phoneValue: '',
    passwordValue: '',
    conFirmPasswordValue: '',
    verifyCode: '',
    type: 'password',
    type2: 'password',
    verifyCodeText: '发送验证码',
    countDownLoading: false,
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
    this.setData({
      type: e.currentTarget.dataset.name
    })
  },
  eyeStatus2(e) {
    this.setData({
      type2: e.currentTarget.dataset.name
    })
  },
  btnStatus() {
    if (this.data.phoneValue && this.data.passwordValue && this.data.conFirmPasswordValue && this.data.verifyCode) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },

  async login() {
    if (this.data.disabled) return;
    var phone = trim(this.data.phoneValue);
    var password = trim(this.data.passwordValue);
    var conFirmPasswordValue = trim(this.data.conFirmPasswordValue);
    var verifyCode = this.data.verifyCode;
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
        title: '请输入正确手机号码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if ((verifyCode + '').length < 6) {
      wx.showToast({
        title: '请输入正确格式的验证码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!regPassword(password)) {
      wx.showToast({
        title: '新密码由6-20位英文或数字组成',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!conFirmPasswordValue) {
      wx.showToast({
        title: '请输入确认密码',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (conFirmPasswordValue !== password ) {
      wx.showToast({
        title: '两次输入的密码不一致，请重新输入',
        icon: 'none',
        duration: 2000
      })
      return
    }

    var params = {
      mobile: phone,
      password,
      password_repeat: conFirmPasswordValue,
      verification_code: verifyCode
    }
    await api.showLoading()
    api.postData(app.baseUrl + app.configApi.reetPassword, params).then((res) => {
      if (res.code == 200) {
        api.hideLoading()
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
  // 发送验证码
  async sendCode () {
    let mobile = this.data.phoneValue
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!regPhone(mobile)) {
      wx.showToast({
        title: '请输入正确手机号码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    await api.showLoading()
    await api.postData(app.baseUrl + app.configApi.verifyCode, {
      mobile
    }).then(async (res) => {
      console.log(res)
      // await api.hideLoading()
      console.log(9999)
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
        this.countDown()
      }
    })
    .catch((err) => {
      console.error(err)
      api.hideLoading()
    })
    
  },
  // 倒计时
  countDown () {
    if (wait == 0) {
      this.setData({ verifyCodeText: '重新发送', countDownLoading: false})
      wait = 60;
    } else {
      this.setData({ verifyCodeText: `${wait}s后重新发送`, countDownLoading: true })
      wait--;
      setTimeout(() => {
        this.countDown()
      }, 1000)
    }
  },
  onChangeNavBack() {
    wx.navigateBack({
      delta: 1
    })
  },
})