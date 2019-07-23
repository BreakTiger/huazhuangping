import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()
Page({

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
    dismoney: '', //折扣后的钱
    ninimum: '', //最低消费
    ordernumlist: [], //订单组,
    zhekou: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let user = wx.getStorageSync('user')
    let goods = JSON.parse(options.data)
    console.log(goods.carts, goods)
    let amount = goods.total
    this.setData({
      user: user,
      goods: goods.carts,
      amount: amount
    })
    // 判断最低消费
    let surl = app.globalData.api + 'index/FindSetMoney'
    request.sendRequest(surl, 'get', {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        that.setData({
          ninimum: res.data.data.money
        })
      })

    // 商品折扣
    let orderShopList = JSON.stringify(goods.carts)
    let sur2 = app.globalData.api + 'index/CalculationShopCar'
    let datas = {
      goods: orderShopList,
      userid: user.id
    }
    request.sendRequest(sur2, 'post', datas, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log(res.data)
        that.setData({
          dismoney: res.data.data,
          zhekou: res.data.data
        })
      })
  },
  onShow: function() {
    app.syncUser();
  },
  // 选择支付方式
  selectpay: function(e) {
    let item = e.currentTarget.dataset.item
    let id = e.currentTarget.dataset.item.id
    let index = e.currentTarget.dataset.index
    let user = wx.getStorageSync('user')
    console.log(user)
    let that = this
    let amount = that.data.amount
    let dismoney = that.data.zhekou
    this.setData({
      paystatus: id,
      paytype: item.name,
      paybox: false
    })
    if (id == 1) {
      // 微信
      that.setData({
        dismoney: dismoney
      })
    } else if (id == 2) {

      // 余额
      that.setData({
        dismoney: dismoney
      })
    } else {
      // 积分
      that.setData({
        dismoney: amount
      })
    }
  },
  // 支付
  topay: function() {
    let dismoney = this.data.dismoney
    let paystatus = this.data.paystatus
    let that = this
    let goods = this.data.goods
    console.log(goods)
    let num = this.data.num
    let ninimum = that.data.ninimum
    let amount = that.data.amount
    // 判断最低消费
    if (dismoney >= ninimum) {
      //  生成订单
      let paystatus = this.data.paystatus
      let that = this
      let orderShopList = JSON.stringify(this.data.goods)
      let num = this.data.num
      // 生成订单
      let surl = app.globalData.api + 'index/ShopcarNowBuy'
      let user = wx.getStorageSync('user')
      let datas = {
        userid: user.id,
        price: dismoney,
        paytype: paystatus,
        goods: orderShopList
      }
      wx.showLoading({
        title: '请求中',
        mask:true
      })
      request.sendRequest(surl, 'post', datas, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(function(res) {
          console.log(res.data.data)
          let order = res.data.data
          wx.hideLoading();
          if (order == null) {
            modals.showToast('库存不足啦', 'loading')
          } else {
            console.log(paystatus)
            that.setData({
              order: order
            })
            console.log('生成订单订单', that.data.order)
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
            } else {
              // 积分支付 
              wx.showModal({
                title: '提示',
                content: '確定用积分支付吗',
                showCancel: '取消',
                confirmText: '立即支付',
                confirmColor: '#D85B3F',
                success: function(res) {
                  if (res.confirm) {
                    that.jifenpay()
                  } else if (res.cancel) {}
                }
              })

            }
          }

        }, function(err) {});
    } else {
      modals.showToast('不满最低消费哦', 'loading')
    }



  },

  // 微信支付
  wxpay: function() {
    let dismoney = this.data.dismoney
    let order = this.data.order
    let that = this
    let openid = wx.getStorageSync('openid')
    let user = wx.getStorageSync('user')
    let url = app.globalData.api + "Wxpay/payJoinfee"
    let data = {
      out_trade_no: order.ordernum,
      total_fee: dismoney,
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
            let backurl = '/pages/classif/classif'
            modals.toswitch(backurl)
          },
        })

      }, function(err) {});

  },
  // 余额支付
  yuepay: function() {
    let that = this
    let user = wx.getStorageSync('user')
    let dismoney = this.data.dismoney
    console.log('余额支付', dismoney)
    if (parseInt(user.yue) >= parseInt(dismoney)) {
      let url2 = app.globalData.api + 'index/BalancePay'
      let data2 = {
        id: that.data.order.id
      }
      request.sendRequest(url2, 'get', data2, {})
        .then(function(res) {
          console.log(res.data)
          // 修改订单状态
          that.changeorder()
          // 返积分
          if (user.sj_id != '') {

            let sjid = user.sj_id
            console.log(1, sjid)
            that.backjifen(sjid)
          }
          if (wx.getStorageSync('ssjid') != '') {

            let ssjid = wx.getStorageSync('ssjid')
            console.log(3, ssjid)
            that.backjifen(ssjid)
          }
          modals.showToast('余额支付成功', 'success')

        })
    } else {
      modals.showToast('余额不足', 'loading')
    }
  },
  // 积分支付
  jifenpay: function() {
    let that = this
    let user = wx.getStorageSync('user')
    let amount = that.data.amount
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
  // 修改订单状态
  changeorder: function(opt) {
    let that = this
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
        let backurl = '/pages/index/index'
        modals.toswitch(backurl)
        console.log(res)
      })
  },
  // 重新选择支付方式
  changepay: function() {
    this.setData({
      paybox: true
    })
  }

})