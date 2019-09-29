const app = getApp()
Component({
  data: {
    status: false
  },
  properties: {
    twoText: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
      }
    },
    oneText: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
      }
    },
    time: {
      type: Number,
      value: 2000
    }
  },

  methods: {
    show(callback) {
      this.setData({ status: true })
      setTimeout(() => {
        this.setData({ status: false })
        callback && callback()
      }, this.data.time)
    }
  }
})