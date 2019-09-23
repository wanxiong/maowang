const app = getApp()
const api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0
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

  login() {
    // 存在第一步没完成 直接跳转第二部
    let login_first = wx.getStorageSync('login_first');
    if (login_first) {
      wx.navigateTo({
        url: `../login/phoneAuth/phoneAuth`
      })
      return
    }
    wx.navigateTo({
      url: '../login/login',
    })
  },
  clearAll () {
    wx.clearStorageSync()
    wx.showToast({
      title: '清除成功',
      icon: 'none',
      duration: 2000
    })
  },
  clearLogin() {
    wx.removeStorageSync('login_first')
    wx.showToast({
      title: '清除成功',
      icon: 'none',
      duration: 2000
    })
  },
  clearLoginOne() {
    wx.removeStorageSync('login_info')
    wx.showToast({
      title: '清除成功',
      icon: 'none',
      duration: 2000
    })
  }
})