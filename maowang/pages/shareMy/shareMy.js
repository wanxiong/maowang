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
    this.a();
  },
  a() {
    const ctx = wx.createCanvasContext('myCanvas');
    let w = 750;
    let h = 1334;
    let winW = '';
    let winH = '';
    let ratio = 0.8;
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        winW = res.screenWidth * ratio;
        winH = res.screenHeight * ratio;
        let nowW = winW;
        let nowH = (winW / w) * h;
        ctx.drawImage('/image/share_bg.png', 0, 0, nowW, nowH)
        ctx.save()
        let shareW = 390;
        let shareH = 110;
        let shareNowW = (res.screenWidth / 750) * shareW * ratio
        let shareNowH = (res.screenHeight / 1334) * shareH * ratio
        // ctx.drawImage('/image/share_title.png', (winW - shareNowW)/2  , 20, shareNowW, shareNowH)
        // 绘制文字
        ctx.setFillStyle('#F50745')
        ctx.setFontSize('40')
        ctx.setTextBaseline('top')
        let baseTop = 35;
        let textWith = ctx.measureText('418').width;
        let moneyTextW = 274;
        let moneyTextH = 110;
        let moneyTextNowW = (res.screenWidth / 750) * moneyTextW * ratio
        let moneyTextNowH = (res.screenHeight / 1334) * moneyTextH * ratio
        let textLeft = (winW - textWith - moneyTextNowW) / 2;
        ctx.drawImage('/image/share_title_1.png', textLeft + textWith, shareNowH + baseTop + 5, moneyTextNowW, moneyTextNowH)
        ctx.fillText('418', textLeft, shareNowH + baseTop);
        ctx.fillText('418', textLeft, shareNowH + baseTop - 0.5);
        ctx.fillText('418', textLeft - 0.5, shareNowH + baseTop);
        ctx.fillText('418', textLeft, shareNowH + baseTop + 0.5);
        ctx.fillText('418', textLeft + 0.5, shareNowH + baseTop);
        ctx.save()
        // 钱包背景图
        let moneyBotW = 674;
        let moneyBotH = 959;
        let moneyBotNowW = (res.screenWidth / 750) * moneyBotW * ratio
        let moneyBotNowH = (res.screenHeight / 1334) * moneyBotH * ratio
        ctx.drawImage('/image/share_bg_1.png', (winW - moneyBotNowW) / 2, winH - moneyBotNowH, moneyBotNowW, moneyBotNowH)
        // 钱包二维码匡匡子
        let qrcodeBorderW = 380;
        let qrcodeBorderH = 324;
        let qrcodeBorderNowW = (res.screenWidth / 750) * qrcodeBorderW * ratio
        let qrcodeBorderNowH = (res.screenHeight / 1334) * qrcodeBorderH * ratio
        let qrcodeTop = (76 / moneyBotH) * moneyBotNowH;
        ctx.drawImage('/image/codeBorder.png', (winW - qrcodeBorderNowW) / 2, winH - moneyBotNowH + qrcodeTop, qrcodeBorderNowW, qrcodeBorderNowH)
        let qrcode = _this.data.qrcode;
        _this.base64src(qrcode).then((filePath) => {
          let url = filePath;
          console.log(url)
          let qrcodeW = 227;
          let qrcodeH = 227;
          let qrcodeNowW = (res.screenWidth / 750) * qrcodeW * ratio
          let qrcodeNowH = (res.screenHeight / 1334) * qrcodeH * ratio
          ctx.drawImage(url, (winW - qrcodeNowW) / 2, winH - moneyBotNowH + qrcodeTop, qrcodeNowW, qrcodeNowH)
        });
        ctx.draw()
      }
    })
  },
  base64src(base64data) {
    const fsm = wx.getFileSystemManager();
    const FILE_BASE_NAME = 'tmp_base64src';
    return new Promise((resolve, reject) => {
      const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
      if (!format) {
        reject(new Error('ERROR_BASE64SRC_PARSE'));
      }
      const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
      const buffer = wx.base64ToArrayBuffer(bodyData);
      fsm.writeFile({
        filePath,
        data: buffer,
        encoding: 'binary',
        success() {
          resolve(filePath);
        },
        fail() {
          reject(new Error('ERROR_BASE64SRC_WRITE'));
        },
      });
    });
  }
})