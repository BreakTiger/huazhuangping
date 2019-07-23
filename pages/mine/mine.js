import modals from '../../class/methods/modal.js'
const request = require('../../class/api/htts.js')
var app = getApp()
Page({
  data: {
    fourTags: [{
        id: 1,
        url: '/imgs/mine/dfk.png',
        text: '待支付'
      },
      {
        id: 2,
        url: '/imgs/mine/dfh.png',
        text: '待发货'
      },
      {
        id: 3,
        url: '/imgs/mine/dsh.png',
        text: '待收货'
      },
      {
        id: 4,
        url: '/imgs/mine/th.png',
        text: '退货'
      }
    ],
    user: '',
    yuemoney: [] //余额查询
  },

  onLoad: function(options) {
    let that = this
    // 否注册登录
    let user = wx.getStorageSync('user')
    if (!user) {
      let url = "/pages/login/login"
      modals.navigate(url)
    }
    // 分销
    if (options.sharid) {
      let sharid = options.sharid
      wx.setStorageSync('sharid', sharid)
      console.log(wx.getStorageSync('sharid'))
    }
  },

  // 全部订单
  allorder: function() {
    let url = "/pages/order/all-orders/all-orders"
    modals.navigate(url)
  },

  // 导航标签
  toOther: function(e) {
    let index = e.currentTarget.dataset.index
    let data = parseInt(index) + 1
    console.log(data)
    let url = "/pages/order/all-orders/all-orders?data="
    modals.navigate(url, data)
  },

  // 分享
  onShareAppMessage: function() {
    let user = wx.getStorageSync('user');
    let sharid = user.id;
    return {
      title: '快来购买商品啦',
      path: '/pages/index/index/?sharid=' + JSON.stringify(sharid),
      success: function(res) {
        console.log('转发成功')
      },

      fail: function(res) {}
    }
  },

  onShow: function() {
    this.setData({
      user: wx.getStorageSync('user')
    })
    if (app.globalData.closestatus == 0) {
      let url = "/pages/close/close"
      modals.navigate(url)
      console.log('zhwe')
    }
    //余额查询接口---------------------------------------------------
    let user = wx.getStorageSync('user')
    let that = this
    let url = app.globalData.api + 'index/FindUserYue'
    let data = {
      id: user.id
    }
    request.sendRequest(url, 'get', data)
      .then(function(res) {
        //  console.log(res.data.data)
        let result = res.data.data
        that.setData({
          yuemoney: result
        })
      }, function(err) {
        console.log(err);
      });



  },

  // 我的余额
  balance: function(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    // console.log(id)
    let str = JSON.stringify(id);
    let url = "/pages/mine/chargeintopay/chargeintopay?jsonStr=" + str
    modals.navigate(url)
  },

  tomodifypwd: function(e) {
    let url = '/pages/mine/modifypwd/modifypwd';
    modals.navigate(url);
  },

  // 我的积分
  integral: function() {
    let data = this.data.yuemoney.integral

    console.log(data)
    let url = "/pages/mine/integral/integral?data="
    modals.navigate(url, data)
  },

  // 分销中心
  toshare: function() {
    let url = "/pages/mine/sell/sell"
    modals.navigate(url)
  },
  // 投票
  totoupiao: function() {
    let url = "/pages/mine/employees/employees"
    modals.navigate(url)
  },
  toLogout: function() {
    wx.removeStorageSync('user')
    wx.reLaunch({
      url: '/pages/login/login',
    })
  }
})