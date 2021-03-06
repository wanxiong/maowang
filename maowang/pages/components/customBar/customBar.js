const app = getApp()
Component({
  data: {
    animateFlg: false,
    statusHeight: app.globalData.statusBarHeight,
    top: app.globalData.top,
    inputWidth: app.globalData.inputWidth,
    navH: app.globalData.navHeight,
    right: app.globalSystem.screenWidth - app.globalMenuBound.right,
    rightSan: (app.globalMenuBound.width / 2) + (app.globalMenuBound.width / 4) - 10,
    showSave: true
  },
  properties: {
    // navH: { // 属性名
    //   type: String,
    //   value: '',
    //   observer: function (newVal, oldVal) {
    //   }
    // },
    background: {
      type: String,
      value: '#fff',
      observer: function (newVal, oldVal) {
      }
    },
    titleTexit: {
      type: String,
      value: '#333',
      observer: function (newVal, oldVal) {
      }
    },
    backIcon: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
      }
    },
    
    isFix: {
      type: Boolean,
      value: true,
    },
    text: {
      type: String,
      value: ''
    },
    opacity: {
      type: String,
      value: '0'
    }
  },

  methods: {
    changeInput() {
      this.triggerEvent('onChangeTitleBar');
    },
    navBack () {
      this.triggerEvent('onChangeNavBack');
    },
    myQrcode() {
      this.triggerEvent('onChangeQrcode');
    },
    closeSave() {
      this.setData({
        showSave: false
      })
    }
  }

})