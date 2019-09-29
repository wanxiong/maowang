const app = getApp()
const api = app.globalData.api
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime-module.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,
    data: [],
    pageSize: 10,
    page: 1,
    loadmore: false,
    loadMoreFlag: false,
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
    this.initList({
      per_page: this.data.pageSize,
      cur_page: 1
    })
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

  async initList (params, loadmore = false, fn) {
    let info = wx.getStorageSync('login_info');
    this.setData({ loadMoreFlag: true})
    api.getData(app.baseUrl + app.configApi.pinTuanList, {
      key: info && info.sesskey || '',
      keyword: '',
      ...params
    }).then((res) => {
      api.hideLoading()
      if (res.code == 200) {
        api.hideLoading()
        let arr = this.data.data.concat(res.data.list)
        let flag = res.hasmore
        if (loadmore) {
          arr = [].concat(res.data.list)
        }
        this.setData({
          data: arr,
          loadmore: flag,
          loadMoreFlag: false
        })
      }
      fn && fn()
    })
    .catch((err) => {
      console.error(err)
      this.setData({ loadMoreFlag: true})
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
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    this.initList({
      per_page: this.data.pageSize,
      cur_page: 1
    }, true, () => {
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.loadmore) return;
    let num = this.data.page;
    num++;
    this.setData({
      page: num
    })
    this.initList({
      per_page: this.data.pageSize,
      cur_page: num
    })

  },
})