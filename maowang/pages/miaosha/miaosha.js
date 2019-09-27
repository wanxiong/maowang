const app = getApp()
const api = app.globalData.api
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime-module.js');
import { accMul } from '../../utils/util.js';

let timer = null
let timerRight = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,
    tabbar: 1, // 1 正在抢购 2 即将开抢
    startData: [],
    ingData: [],
    mStart: '--',
    sStart: '--',
    hStart: '--',
    mIng: '--',
    sIng: '--',
    hIng: '--',
    page: 1, // 秒杀中
    page2: 1, // 即将开始
    pageSize: 2,
    pageSize2: 10,
    leftFlag: true,
    rightFlag: true
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
    this.initData(1, 'left', {
      per_page: this.data.pageSize,
      cur_page: this.data.page
    })

    this.initData(2, 'right', {
      per_page: this.data.pageSize2,
      cur_page: this.data.page2
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(111)
    if (this.data.tabbar == 1) { // 左边 正在秒杀
      if (!this.data.leftFlag) {
        return
      }
      let pag = this.data.page + 1;
      this.setData({
        page: pag
      })
      this.initData(1, 'left', {
        per_page: this.data.pageSize,
        cur_page: pag
      })
    } else { // 右边 即将开始
      if (!this.data.rightFlag) {
        return
      }
      let pag = this.data.page2 + 1;
      this.setData({
        page: pag
      })
      this.initData(1, 'left', {
        per_page: this.data.pageSize2,
        cur_page: pag
      })
    }
  },
  // tabbar 切换
  switchBar(e) {
    console.log(e)
    if (this.data.tabbar == e.currentTarget.dataset.index) {
      return
    } else if (e.currentTarget.dataset.index == 1) {
      // 1
      this.setData({
        tabbar: 1
      })
    } else {
      // 2
      this.setData({
        tabbar: 2
      })
    }
  },
  onChangeNavBack () {
    wx.navigateBack({
      detail: -1
    })
  },
  async initData(order, type, params, initDataFlag = false) {
    let info = wx.getStorageSync('login_info');
    await api.showLoading() // 显示loading
    api.getData(app.baseUrl + app.configApi.miaoShaList, {
      key: info.sesskey || '',
      order: order,
      ...params
    }).then((res) => {
      console.log(res)
      if (res.code == 200) {
        if (type === 'left') {
          let origin = this.data.ingData;
          let flag = res.hasmore
          let originAnimate = this.data.ingData;
          if (initDataFlag) {
            origin = [];
            originAnimate = [];
          }
          // 完整的数组
          let newArr = res.data.map((item) => {
            return {
              proportionCustom: accMul(item.proportion, 100),
              ...item
            }
          })
          let arr = origin.concat(res.data);
          let arrAnimate = originAnimate.concat(newArr);
          this.setData({
            ingData: arr,
            leftFlag: flag
          })
          setTimeout(() => {
            this.setData({
              ingData: arrAnimate
            })
          }, 100)
        } else {
          let arr = this.data.startData.concat(res.data)
          let flag = res.hasmore
          if (initDataFlag) {
            arr = [];
          }
          arr.concat(res.data)
          this.setData({
            startData: arr,
            rightFlag: flag
          })

        }
        this.checkCountDown(type);
      } else {
        if (type === 'left') {
          this.setData({
            page: this.data.page - 1, // 秒杀中
          })
        } else {
          this.setData({
            page2: this.data.page2 - 1, // 即将开始
          })
        }

      }
      api.hideLoading() // 等待请求数据成功后，隐藏loading
    })
    .catch((err) => {
      console.error(err)
      api.hideLoading() // 等待请求数据成功后，隐藏loading
    })
  },
  // s是否倒计时
  checkCountDown (type) {
    console.log(type)
    if (type === 'left' && this.data.page == 1 && this.data.ingData.length) {
      let data = this.data.ingData[0];
      let timerStamp = data.promote_end_date - data.now_time;
      this.countDowm(timerStamp, 1, 'left');
    } else if (type === 'right' && this.data.page == 1 && this.data.startData.length) {
      let data = this.data.startData[0];
      let timerStamp = data.promote_start_date - data.now_time;
      this.countDowm(timerStamp, 1, 'right');
    }
    
  },
  // 倒计时
  countDowm(timeStr, timeNum = 1, type) {
    let time = timeStr;
    let id = setInterval(() => {
      if (time <= 0) {
        if (type === 'left') {
          clearInterval(timer)
        } else {
          clearInterval(timerRight)
        }
        this.setData({
          page: 1,
          page2: 1,
          mIng: '--',
          sIng: '--',
          hIng: '--',
          mStart: '--',
          sStart: '--',
          hStart: '--'
        })
        this.initData(1, 'left', {
          per_page: this.data.pageSize,
          cur_page: 1
        }, true)
        this.initData(2, 'right', {
          per_page: this.data.pageSize2,
          cur_page: 1
        }, true)
      }
      let minutes = parseInt(time / timeNum / 60 % 60, 10);//计算剩余的分钟
      let seconds = parseInt(time / timeNum % 60, 10);//计算剩余的秒数
      minutes = this.countDownStr(minutes);
      seconds = this.countDownStr(seconds);
      let hours = parseInt(time / (timeNum * 60 * 60), 10); //计算剩余的小时
      hours = this.countDownStr(hours);
      let str = hours + ':' + minutes + ':' + seconds
      if (type === 'left') {
        this.setData({
          mIng: minutes,
          sIng: seconds,
          hIng: hours,
        })
      } else {
        console.log(minutes)
        this.setData({
          mStart: minutes,
          sStart: seconds,
          hStart: hours,
        })
      }
      
      time--
    }, 1000);
    if (type === 'left') {
      timer = id
    } else {
      timerRight = id
    }
  },
  // 时间加0
  countDownStr(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  // 预约 提醒接口
  async initRemind(params, index) {
    console.log(params)
    let info = wx.getStorageSync('login_info');
    console.log(info)
    await api.showLoading() // 显示loading
    api.getData(app.baseUrl + app.configApi.miaoShaRemind, {
      key: info.sesskey || '',
      ...params
    }).then((res) => {
      console.log(res)
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
        })
        let item = this.data.startData;
        item[0].is_send = 1;
        this.setData({
          startData: item
        })
      } else {
      }
      api.hideLoading() // 等待请求数据成功后，隐藏loading
    })
      .catch((err) => {
        console.error(err)
        api.hideLoading() // 等待请求数据成功后，隐藏loading
      })
  },
  startRemind (e) {
    console.log(e)
    let json = e.currentTarget.dataset.json;
    let index = e.currentTarget.dataset.index;
    const { goods_id } = json
    this.initRemind({
      goods_id,
      form_id: e.detail.formId
    }, index)
  },
  goDetail (e) {
    wx.showToast({
      title: '此功能暂未开发',
    })
  }
})