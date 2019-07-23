import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()
Page({
  data: {
    tabs: [{
        value: 0,
        name: '全部'
      },
      {
        value: 1,
        name: '待支付'
      },
      {
        value: 2,
        name: '待发货'
      },
      {
        value: 3,
        name: '待收货'
      },
      {
        value: 4,
        name: '退货'
      }
    ],
    selected: 0,
    lists: [],
    listall: '',
    order: '',
  },

  onLoad: function(options) {
    let that = this
    let user = wx.getStorageSync('user')
    let data = options.data
    console.log(data)
    if (options.data) {
      this.setData({
        selected: data
      });

    }
  },


  onShow: function() {
    this.allorder()
  },
  // 查询全部订单
  allorder: function() {
    let that = this
    let user = wx.getStorageSync('user')
    let surl = app.globalData.api + 'index/SelectMyOrder'
    let datas = {
      id: user.id
    }
    request.sendRequest(surl, 'get', datas, {})
      .then(function(res) {
        let all = res.data.data
        console.log(all)
        that.setData({
          listall: all,
          lists: all.quanbu
        })
      })
  },
  // tab点击切换
  onOrderTabTap: function(e) {
    let that = this
    var index = e.currentTarget.dataset.index
    this.setData({
      selected: index
    });
    if (index == 0) {
      that.setData({
        lists: that.data.listall.quanbu
      })
    } else if (index == 1) {
      that.setData({
        lists: that.data.listall.daizhifu
      })
    } else if (index == 2) {
      that.setData({
        lists: that.data.listall.daifahuo
      })
    } else if (index == 3) {
      that.setData({
        lists: that.data.listall.daishouhuo
      })
    } else if (index == 4) {
      that.setData({
        lists: that.data.listall.tuihuo
      })
    }
  },

  // 取消订单
  delate: function(e) {
    let that = this
    let user = wx.getStorageSync('user')
    let id = e.currentTarget.dataset.id.id
    console.log(id)
    let surl = app.globalData.api + 'index/DeleteOrder'
    let datas = {
      userid: user.id,
      orderid: id
    }
    request.sendRequest(surl, 'post', datas, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        that.changeorder()
      })
  },

  // 确认收货index/SetOrderSuccess
  makesure: function(e) {
    let that = this
    console.log(e.currentTarget.dataset.item)
    let user = wx.getStorageSync('user')
    let id = e.currentTarget.dataset.item.id
    console.log(id)
    let surl = app.globalData.api + 'index/SetOrderSuccess'
    let datas = {
      userid: user.id,
      orderid: id
    }
    request.sendRequest(surl, 'post', datas, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        let all = res.data.data
        console.log(all)
        // 刷新页面
        that.allorder()
      })
  },

  // 退货
  tuihuo: function(e) {
    console.log(e.currentTarget.dataset.id)
    let data = JSON.stringify(e.currentTarget.dataset.id)
    console.log(data)
    let url = "/pages/order/return/return?data="
    modals.navigate(url, data)
  },

  // 立即支付
  lijipay: function(e) {
    let that = this
    let order = e.currentTarget.dataset.data
    console.log(order, order.price)
    that.setData({
      order: order
    })
    if (order.paytype == 1) {
      // 微信
      that.wxpay()
    } else if (order.paytype == 2) {
      // 余额
      that.yuepay()
    } else {
      // 积分
      that.jifenpay()
    }
  },

  // 微信支付
  wxpay: function() {
    let order = this.data.order
    let that = this
    let openid = wx.getStorageSync('openid')
    let user = wx.getStorageSync('user')
    let url = app.globalData.api + "Wxpay/payJoinfee"
    let data = {
      out_trade_no: order.ordernum,
      total_fee: order.price,
      body: '化妆品',
      openid: openid
    }
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log(res.data)
        let json = res.data
        wx.requestPayment({
          'appId': json.appId,
          'timeStamp': json.timeStamp,
          'nonceStr': json.nonceStr,
          'package': json.package,
          'signType': 'MD5',
          'paySign': json.paySign,
          'success': function(res) {
            wx.showToast({
              title: '支付成功',
            })
            // 修改订单状态
            that.changeorder()
          },
          'fail': function(res) {
            wx.showToast({
              title: '支付失败',
            })

            // 返积分
            // that.backjifen()
          },
        })

      }, function(err) {});

  },
  // 余额支付
  yuepay: function() {
    let that = this
    let user = wx.getStorageSync('user')
    let dismoney = this.data.order.price
    let order = this.data.order;
    console.log(dismoney, user.yue)
    if (parseInt(user.yue) > parseInt(dismoney)) {
      let url2 = app.globalData.api + 'index/BalancePay'
      let data2 = {
        id: order.id
      }
      request.sendRequest(url2, 'get', data2, {})
        .then(function(res) {
          console.log(res.data)
          modals.showToast('余额支付成功', 'success')
          // 修改订单状态
          that.changeorder()
          // // 返积分
          // that.backjifen()
        })
    } else {
      modals.showToast('余额不足', 'loading')
    }
  },
  // 积分支付
  jifenpay: function() {
    let that = this
    let user = wx.getStorageSync('user')
    let amount = that.data.order.price
    let order = that.data.order;
    console.log(user.integral, amount)
    if (parseInt(user.integral) > parseInt(amount)) {
      let url3 = app.globalData.api + '/index/InteGralPay'
      let data3 = {
        id: order.id
      }
      wx.showLoading({
        title: '请求中',
      })
      request.sendRequest(url3, 'get', data3, {})
        .then(function(res) {
          wx.hideLoading();
          console.log(res.data)
          modals.showToast('积分支付成功', 'success')
          modals.toswitch(backurl)
          that.changeorder(opt)
        })
    } else {
      modals.showToast('积分不足', 'loading')
    }
  },
  // 修改订单状态
  changeorder: function(opt) {
    let that = this;
    let dismoney = this.data.dismoney
    let order = this.data.order
    let url = app.globalData.api + "index/Paysuccess"
    let data = {
      id: order.id
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        if (!opt) {
          // 返积分
          that.backjifen()
        } else {
          let backurl = '/pages/index/index'
          modals.toswitch(backurl)
        }
        // 刷新页面
        that.allorder()
      })
  },
  // 返积分
  backjifen: function() {
    let dismoney = this.data.dismoney
    let user = wx.getStorageSync('user')
    let url = app.globalData.api + "index/GiveInteGral"
    let data = {
      userid: user.id,
      price: dismoney
    }
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log(res)
      })
  },
  // 提醒发货
  weak: function() {
    setTimeout(function() {
      modals.showToast('提醒发货成功', 'success')
    }, 400)

  },
  // 查看物流
  logistics: function(e) {
    let that = this
    let wuliu = e.currentTarget.dataset.item.wuliu;
    let str = JSON.stringify(wuliu);
    //wx.setStorageSync('url',url)
    wx.navigateTo({
      url: '/pages/order/all-orders/wuliu/wuliu?jsonStr=' + str,
    })
  }

})