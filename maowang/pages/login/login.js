const app = getApp()
const api = app.globalData.api
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime-module.js');
import { params } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,
    params: false,
    text: '',
    shareInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })
    //  是否微信扫码过来的
    let shareId = ''
    if (options.q) {
      let url = decodeURIComponent(options.q);
      if (url.indexOf('?') != -1) {
        let share = params(url.split('?')[1], 'u');
        shareId = share;
      }
    }
    //
    if (options.share || shareId) {
      this.setData({ text: options.share, params: true})
      this.getShare()
    }
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
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  goPhone() {
    wx.navigateTo({
      url: './phoneLogin/phoneLogin',
    })
  },

  async bindgetuserinfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      wx.login({
        success: res => {
          if (res.errMsg === 'login:ok') {
            var params = {
              code: res.code,
              user_iv: encodeURIComponent(e.detail.iv),
              userencryptedData: encodeURIComponent(e.detail.encryptedData)
            }
            let info = JSON.parse(e.detail.rawData);
            this.unionLogin(params, {
              nickname: info.nickName,
              usericon: info.avatarUrl,
              sex: info.gender
            })
          }
        }
      })
    } else {
      // console.log('取消和未知异常')
    }
  },
  // uiniodId登录
  async unionLogin (params, info) {
    await api.showLoading()
    api.postData(app.baseUrl + app.configApi.unionIdLogin, params).then((res) => {
      api.hideLoading()
      if (res.code == 200 && res.data.status == 1) {
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
      } else if (res.code == 200 && res.data.status == 0) {
        if (this.data.params) {
          wx.setStorageSync('login_first', {
            invitationStatus: this.data.params ? 1 : 0,
            invitation_code: this.data.shareInfo.user_id,
            invitation_Name: this.data.shareInfo.user_name,
            nickname: info.nickname,
            usericon: info.usericon,
            sex: info.sex,
            encryption_unionid: res.data.user_info.encryption_unionid,
          })
          wx.navigateTo({
            url: `./phoneAuth/phoneAuth`,
          })
        } else {
          wx.setStorageSync('login_first', {
            invitationStatus: this.data.params ? 1 : 0,
            nickname: info.nickname,
            usericon: info.usericon,
            sex: info.sex,
            encryption_unionid: res.data.user_info.encryption_unionid,
          })
          wx.navigateTo({
            url: `./phoneAuth/phoneAuth`,
          })
        }
        
      }
    })
      .catch((err) => {
        console.error(err)
        api.hideLoading()
      })
  },
  // 获取上级邀请人信息
  async getShare () {
    await api.showLoading()
    api.postData(app.baseUrl + app.configApi.share, { invitation_code: this.data.text, hideLoading: false}).then((res) => {
      if (res.code == 200) {
        api.hideLoading()
        this.setData({ shareInfo: res.data})
      }
    })
    .catch((err) => {
      console.error(err)
      api.hideLoading()
    })
  }
})