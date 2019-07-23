var app = getApp()
import modals from '../../../../class/methods/modal.js'
const request = require('../../../../class/api/htts.js')
Page({
  data: {
    notice: [],
    list: [],
    taocan: {},
    rab: false,
    id: '',
    gift: ''
  },

  onLoad: function(options) {
    let that = this
    //  公告
    let data = JSON.parse(options.data)
    console.log(data)
    that.setData({
      list: data.goods,
      id: data.id,
      taocan: data

    })
    if (data.kucun) {
      that.setData({
        rab: true,
        gift: data.gift
      })
    }
  },
  // 立即抢购
  robgoods: function() {
    let data = JSON.stringify(this.data.taocan)
    let id = this.data.id
    wx.navigateTo({
      url: '/pages/order/robconfirm/robconfirm?data=' + data + '&pid=' + id,
    })
  }

})