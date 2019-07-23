import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alert: 0,
    alertLlist: [
      '拍多了',
      '拍错了',
      '想重新购买',
      '不适合皮肤',
      '不想要了'
    ],
    selected: 0,
    index: 0,
    switch: 0,
    returns: [],
    value:''

  },
  // 点击事件
  goAlert: function () {
    let that = this
    that.setData({
      alert: 1
    })
  },

  // 选择
  selected: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let value = e.currentTarget.dataset.item
    that.setData({
      value: value,
      switch: 1
    })
    console.log(value)
    if (index == 0) {
      that.setData({
        selected: 0,
        alert: 0
      })
    } else if (index == 1) {
      that.setData({
        selected: 1,
        alert: 0
      })
    } else if (index == 2) {
      that.setData({
        selected: 2,
        alert: 0
      })
    } else if (index == 3) {
      that.setData({
        selected: 3,
        alert: 0
      })
    } else if (index == 4) {
      that.setData({
        selected: 4,
        alert: 0
      })
    } else {
      that.setData({
        selected: 5,
        alert: 0
      })
    }
  },

  onLoad: function(options) {
    let that=this
    // console.log(JSON.parse(options.data))
    console.log(options)
    let data = JSON.parse(options.data)
    that.setData({
      returns:data
    })
    // console.log(data)
  },
  
  // 表单提交index/ReturnGoods
  submit:function(e){
    let that=this
    let user = wx.getStorageSync('user')
    console.log(e.detail.value)
    let info = e.detail.value
    let result=that.data.value
    let surl = app.globalData.api + 'index/ReturnGoods'
    let datas = {
      userid: user.id,
      orderid: that.data.returns.id,
      desc: result
      }
   request.sendRequest(surl, 'post', datas, { "Content-Type": "application/x-www-form-urlencoded" })
    .then(function (res) {
      let all = res.data.data
      console.log(all)
      let url = "/pages/mine/mine"
      modals.toswitch(url)                 
    })
  }
})