import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js');
const Quantity = require('../../../template/quantity/index.js');
var app = getApp()
Page(Object.assign({}, Quantity, {

  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    user: '',
    goods: [],
    amount: '', //总金额 
    pay: [{
        name: '余额支付',
        id: 2
      },
      {
        name: '积分支付',
        id: 3
      },
      {
        name: '微信支付',
        id: 1,
      }
    ], //支付方式
    paystatus: 2, //选择的支付方式
    ordernumber: '', //订单编号
    paytype: '余额支付',
    paybox: false,
    order: '', //订单信息
    ordernumlist: [], //订单组,
    id: '',
    goodsNum: 1
  },

  /**
   * 处理数量选择器请求
   */
  handleZanQuantityChange(e) {
    var cartId = e.componentId;
    var num = e.quantity;
    this.setData({
      goodsNum: num,
      amount: this.data.taocan_amount * this.data.goodsNum
    });
  },

  onShow: function() {
    app.syncUser();
  },

  onLoad: function(options) {
    let that = this
    let user = wx.getStorageSync('user')
    let taocan = JSON.parse(options.data)
    let goods = taocan.goods;
    let id = options.pid
    console.log('taocan', taocan, id)
    let amount = 0
    // 总价
    for (var i = 0; i < goods.length; i++) {
      amount += parseInt(goods[i].price)
    }

    let taocan_amount = taocan.price;

    console.log(148 + 198 + 168, amount)
    this.setData({
      user: user,
      goods: goods,
      taocan_amount: taocan_amount,
      amount: taocan_amount * this.data.goodsNum,
      id: id
    })
    // 支付方式
    let surl = app.globalData.api + 'index/SelectMiaoshaPaytype'
    request.sendRequest(surl, 'get', {})
      .then(function(res) {
        console.log(res.data.data)
        that.setData({
          pay: res.data.data
        })
      })
  },
  // 选择支付方式
  selectpay: function(e) {
    let item = e.currentTarget.dataset.item
    let id = e.currentTarget.dataset.item.value
    let index = e.currentTarget.dataset.index
    let user = wx.getStorageSync('user')
    console.log(user)
    let that = this
    let amount = this.data.taocan_amount * this.data.goodsNum;
    let dismoney = amount * user.zhekou
    this.setData({
      paystatus: id,
      paytype: item.type,
      paybox: false
    })
  },
  // 支付
  topay: function() {
    let paystatus = this.data.paystatus
    let that = this
    let amount = this.data.taocan_amount * this.data.goodsNum
    let id = that.data.id
    // 生成订单
    let surl = app.globalData.api + 'index/MiaoshaOrder'
    let user = wx.getStorageSync('user')
    let datas = {
      userid: user.id,
      price: amount,
      paytype: paystatus,
      packageid: id,
      number: that.data.goodsNum
    }
    wx.showLoading({
      title: '请求中',
      mask: true
    })
    request.sendRequest(surl, 'post', datas, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.code == 'Lack of stock') {
          wx.showToast({
            title: '库存不足',
          })
          return;
        }
        let order = res.data.data

        that.setData({
          order: order
        })

        if (paystatus == 1) {
          //  微信支付
          that.wxpay()
        } else if (paystatus == 2) {
          // 余额支付
          wx.showModal({
            title: '提示',
            content: '確定用余额支付吗',
            showCancel: '取消',
            confirmText: '立即支付',
            confirmColor: '#D85B3F',
            success: function(res) {
              if (res.confirm) {
                that.yuepay()
              } else if (res.cancel) {}
            }
          })

        } else if (paystatus == 3) {
          //  积分支付
          wx.showModal({
            title: '提示',
            content: '確定用积分支付吗',
            showCancel: '取消',
            confirmText: '立即支付',
            confirmColor: '#D85B3F',
            success: function(res) {
              if (res.confirm) {
                that.yuepay()
              } else if (res.cancel) {}
            }
          })
        }
      }, function(err) {});





  },

  // 微信支付
  wxpay: function() {
    let amount = this.data.taocan_amount * this.data.goodsNum
    let order = this.data.order
    let that = this
    let openid = wx.getStorageSync('openid')
    let user = wx.getStorageSync('user')
    let url = app.globalData.api + "Wxpay/payJoinfee"
    let data = {
      out_trade_no: order.ordernum,
      total_fee: amount,
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

          },
        })

      }, function(err) {});

  },
  // 余额支付
  yuepay: function() {
    let that = this
    let amount = this.data.taocan_amount * this.data.goodsNum;
    let user = wx.getStorageSync('user');
    if (parseInt(user.yue) >= parseInt(amount)) {
      let url2 = app.globalData.api + 'index/BalancePay'
      let data2 = {
        id: that.data.order.id
      }
      request.sendRequest(url2, 'get', data2, {})
        .then(function(res) {
          console.log(res.data)
          modals.showToast('余额支付成功', 'success')
          // 修改订单状态
          that.changeorder()
        })
    } else {
      modals.showToast('余额不足', 'loading')
    }
  },

  // 修改订单状态
  changeorder: function() {
    let dismoney = this.data.dismoney
    let order = this.data.order
    let url = app.globalData.api + "index/Paysuccess"
    let data = {
      id: order.id
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let backurl = '/pages/index/index'
        modals.toswitch(backurl)
      })
  },
  // 积分支付
  jifenpay: function() {
    let that = this
    let user = wx.getStorageSync('user')
    let amount = this.data.taocan_amount * this.data.goodsNum
    if (parseInt(user.integral) > parseInt(amount)) {
      let orderid = that.data.order.id
      let url3 = app.globalData.api + '/index/InteGralPay'
      let data3 = {
        id: orderid
      }
      request.sendRequest(url3, 'get', data3, {})
        .then(function(res) {
          console.log(res.data)
          modals.showToast('积分支付成功', 'success')
          that.changeorder(res)
        })
    } else {
      modals.showToast('积分不足', 'loading')
    }
  },
  // 重新选择支付方式
  changepay: function() {
    this.setData({
      paybox: true
    })
  }

}))