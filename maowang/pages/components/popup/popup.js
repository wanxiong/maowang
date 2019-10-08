
Component({
  data: {
    animateFlg:false
  },
  properties: {
    show: { // 属性名
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) { 
      }
    },
    style_in: { // 属性名
      type: String,
      value: 'bounceInUp',
      observer: function (newVal, oldVal) {
      }
    },
    style_out: { // 属性名
      type: String,
      value: 'bounceOutDown',
      observer: function (newVal, oldVal) {
      }
    },
    trigger: { // 属性名
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
      }
    }
  },

  methods: {
    // 开启动画
    openBox() {
      this.setData({ show: true, animateFlg: true })

    },
    /*影藏动画
    *@params {Function callback} 动画完成的回调
    */
    hideBox(callback) {
      this.setData({ show: false })
      console.log(this.data.style_out)
      if (this.data.style_out === 'hide') {
        this.setData({ animateFlg: false })
        callback && callback()
      } else {
      setTimeout(() => {
        this.setData({ animateFlg: false })
        //if (flg) return this.triggerEvent('animaEnd', '')
        callback && callback()
        
      }, 800)
      }
    },
    //关闭弹出层
    triggerClose() {
      console.log('点击关闭按钮')
      this.hideBox()
      this.triggerEvent('closePop','')
    },
    onPreventTouchMove() {
      
    }
    
  }
 
})