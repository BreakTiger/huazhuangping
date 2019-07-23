import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp();
Page({
  data: {
    user: '',
    active: '',
    recharge: [1000,2000,4000,6000,8000,10000],
    // 充值参数
    chong:[],
    money:1000,
    yue:[] //余额查询
  },
  // 充值切换焦点函数
  rechargeActive: function (e) {
    let that = this;
    let money=e.currentTarget.dataset.item
    // console.log(money)
    let index = e.currentTarget.dataset.index;
    this.setData({
      active: index,
      money:money
    });
  },
  // -----------------------------------------------------
  /**
   * 生命周期函数--监听页面加载
   */
  bannerInto: function () {
    wx.navigateTo({
      url: '/pages/index/banner/banner?index=10'
    })
  },
  onLoad: function (opt) {
    // console.log(options)
    var that = this
    let id = JSON.parse(opt.jsonStr)
    // console.log(id)
    that.setData({
      yue: id
    })
  

  },
  onShow:function(){
    let that = this;
    //当前 余额请求
    that.setData({
      user: wx.getStorageSync('user')
    });
    console.log(that.data.user)
  },
  //  生成订单
  chargepayD:function(){
    let chong = this.data.chong;
    let user = wx.getStorageSync('user');
    console.log(user)
    let that=this;
    wx.request({
      url: app.globalData.api + 'index/ChongzhiMoney',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data:{
        userid: user.id,
        price: that.data.money
      },
      success: function (res) {
        let result = res.data.data
        console.log(result)
        that.pay(result)
      }
    })
  },

  seletPay: function () {
    let that = this;
    // 头部数据
    wx.showModal({
      title: '微信支付',
      content: '确定支付吗?',
      success: function (res) {
        if (res.confirm) {
          that.chargepayD();
        } else if (res.cancel) {
        }
      }
    })

  },

  // 支付
  pay: function (result) {
    let that = this;
    let openid = wx.getStorageSync('openid')
    console.log(openid)
    // 微信支付请求
    self = this;
    wx.showToast({
      title: '请求中.....',
      icon: 'loading',
      duration: 1000
    })
    let url = app.globalData.api + "Wxpay/payJoinfee"
    let data= {
         openid: openid,
         total_fee: that.data.money,
         body: '化妆品',
         out_trade_no: result.ordernum
           }
    request.sendRequest(url, 'post', data, { "Content-Type": "application/x-www-form-urlencoded" })
        .then(function (res) {
          console.log(res.data)
          let json = res.data
          wx.requestPayment({
            'appId': json.appId,
            'timeStamp': json.timeStamp,
            'nonceStr': json.nonceStr,
            'package': json.package,
            'signType': 'MD5',
            'paySign': json.paySign,
            'success': function (res) {
              console.log(res)
              wx.showToast({
                title: '支付成功',
              })
              request.sendRequest(url, 'get', data, {})
                .then(function (res) {
                  wx.removeStorageSync('user')
                  console.log(res.data.data)
                  let user = res.data.data
                  wx.setStorageSync('user', user)
                  that.setData({
                    user: wx.getStorageSync('user')
                  });
              })
            },
            'fail': function (res) {
              console.log(res.data)
              wx.showToast({
                title: '支付失败',
              })
              let url = app.globalData.api + "index/ChongzhiSuccess"
              let data={
                orderid: result.id
              }
              
            },
          })
     
      } ,function (err) {
      });
   
  },  
})