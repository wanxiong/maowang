// request get 请求
const getData = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'GET',
      data: param,
      success(res) {
        if (res.data.code != 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// request post 请求
const postData = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: param,
      success(res) {
        console.log(res)
        
        if (res.data.code != 200) {
          if(!param.hideLoading) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
        
        resolve(res.data)
      },
      fail(err) {
        wx.showToast({
          title: '未知异常',
          icon: 'none',
          duration: 2000
        })
        reject(err)
      }
    })
  })
}

// loading加载提示
const showLoading = () => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success(res) {
        console.log('显示loading')
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 关闭loading
const hideLoading = () => {
  return new Promise((resolve) => {
    wx.hideLoading()
    console.log('隐藏loading')
    resolve()
  })
}

module.exports = {
  getData,
  postData,
  showLoading,
  hideLoading
}