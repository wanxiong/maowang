const app = getApp()
const api = app.globalData.api
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime-module.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,
    data: {}
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
    this.initData()
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
  async initData () {
    await api.showLoading()
    api.postData(app.baseUrl + app.configApi.preferential, {}).then((res) => {
      api.hideLoading()
      console.log(res)
      this.setData({
        data: res.data
      })
    })
    .catch((err) => {
      api.hideLoading()
    })
  },
  goDetail() {
    wx.showToast({
      title: '功能暂未开放哦',
      icon: 'none',
      duration: 2000
    })
  },
  onChangeNavBack() {
    wx.navigateBack({
      delta: 1
    })
  }
})