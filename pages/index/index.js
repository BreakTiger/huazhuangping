import modals from '../../class/methods/modal.js'
const request = require('../../class/api/htts.js')
var app=getApp()
Page({

  data: {
    banner: [],
    login:1, //
    // 限时抢购
    perorders: [],
    num: 1,
    allgoods:[]
  },

  onLoad: function (options) {
    console.log(options)
    let that = this
    // 分销
    if (options.user) {
      let user = JSON.parse(options.user)
      let sjid = user.id
      wx.setStorageSync('sjid', sjid)
    }else{
      console.log(222)
    }
    // 关闭
    console.log(app.globalData.closestatus)
    
    // 轮播图
    let url = app.globalData.api + "index/SelectSlider"
    request.sendRequest(url)
      .then(function (res) {
       that.setData({
         banner:res.data.data
       })
      }, function (err) {
        console.log(err);
    });
    // 商品
    let url2 = app.globalData.api + "index/SelectShouCommondity"
    request.sendRequest(url2, 'get')
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          allgoods: res.data.data
        })
      }, function (err) {
    })
    // 限时抢购
    let urls = app.globalData.api + "index/SelectPackage"
    request.sendRequest(urls, 'get')
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          perorders: res.data.data
     })
      }, function (err) {
        // console.log(err);
    })
    // 否注册登录
    let user = wx.getStorageSync('user')
    if (!user) {
      let url = "/pages/login/login"
      modals.navigate(url)
    }
  },
  onShow:function(){
    if (app.globalData.closestatus == 0) {
      let url = "/pages/close/close"
      modals.navigate(url)
      console.log('zhwe')
    }
  },
  //抢购
  turnpreorder:function(e){
    let data = e.currentTarget.dataset.item
    let info = JSON.stringify(data)
    let url = "/pages/index/timesell/sell/sell?data="
    modals.navigate(url, info)
  },
  // 商品详情
  todetail:function(e){
    console.log(e)
    let data = JSON.stringify(e.currentTarget.dataset.item)
    let url = "/pages/index/detail/detail?data="
    modals.navigate(url, data)
  },
  // 查看更多的限时秒杀
  watchmoresell:function(){
    let url = "/pages/classif/classif"
    modals.toswitch(url)
  },
  // 查看更过商品
  watchmore:function(){
    let url = "/pages/classif/classif"
    modals.toswitch(url)
  },
  // 分享
  onShareAppMessage: function () {
    let user = wx.getStorageSync('user');
    let data = this.data.info;
    // console.log('/pages/index/index?user=' + JSON.stringify(user))
      return {
        title: '快来购买商品啦',
        path: '/pages/index/index?user=' +JSON.stringify(user),
        success: function (res) {
          console.log('转发成功')
        },

        fail: function (res) {
        }
      }
    
  },
  // 搜索页面
  toSelect:function(){
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  }
})