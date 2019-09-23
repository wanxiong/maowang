const app = getApp()
const api = app.globalData.api
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime-module.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,
    data: []
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
    this.initList()
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

  async initList () {
    let info = wx.getStorageSync('login_info');
    await api.showLoading()
    api.getData(app.baseUrl + app.configApi.pinTuanList, {
      key: info && info.sesskey || '',
      keyword: ''
    }).then((res) => {
      api.hideLoading()
      if (res.code == 200) {
        api.hideLoading()
        this.setData({
          data: res.data.list
        })
      }
    })
    .catch((err) => {
      console.error(err)
      api.hideLoading()
    })
  },

  onChangeNavBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 平团
  goPinTuan (e) {
    console.log('去拼团')
    wx.showToast({
      title: '此功能暂未开发',
      duration: 2000,
      icon: 'none'
    })
  }
})