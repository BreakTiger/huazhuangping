import modals from '../../class/methods/modal.js'
const request = require('../../class/api/htts.js')
var app = getApp()
Page({
  data: {
    topnav: [
      { nav: '分类', id: '0', img: '/imgs/car/red.png', zq: '/imgs/car/black.png' },
      { nav: '排序', id: '1', img: '/imgs/car/red.png', zq: '/imgs/car/black.png' }
    ],
    lists: [],
    indexId: 0,
    array: [],
    floor3box: [],
    block: false,
    topindex: 0,  //顶部导航状态
    perorders: [],
    typeid: '',
    pinpid: ''

  },
  onLoad: function (options) {
    let that = this;
    // 获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
  },
  // 选择标签
  close: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    console.log(item)
    let url = app.globalData.api + "index/SelectXilieGood"
    let data = {
      id: item.id
    }
    request.sendRequest(url, 'get', data, {})
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          array: res.data.data,
          block: false,
          typeid: item.id
        })

      }, function (err) {
        console.log(err);
      });

  },
  // 顶部导航选项卡/index/SortGood
  changenav: function (e) {
    let that = this
    let typeid
    if (that.data.typeid == '') {
      console.log(11)
      typeid = 0
    } else {
      typeid = that.data.typeid
      console.log('ss')
    }
    let index = e.currentTarget.dataset.index
    let topnav = this.data.topnav;
    this.setData({
      topindex: index,
    })
    let url = app.globalData.api + "/index/SortGood"
    let data = {
      typeid: typeid
    }
    request.sendRequest(url, 'get', data, {})
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          perorders: res.data.data
        })
      })

  },
  // 商品详情
  goodsdetail: function (e) {
    let data = JSON.stringify(e.currentTarget.dataset.item)
    let pinpid = this.data.pinpid
    wx.navigateTo({
      url: '/pages/index/detail/detail?data=' + data,
    })
  },

  // 点击进入搜索页面
  onSearchTap: function (e) {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })

  },
  onShow: function () {
    let that=this
    let user = wx.getStorageSync('user')
    if (!user) {
      let url = "/pages/login/login"
      modals.navigate(url)
    }
    if (app.globalData.closestatus == 0) {
      let url = "/pages/close/close"
      modals.navigate(url)
      console.log('zhwe')
    }
    // 获取系列标签
    let url = app.globalData.api + "index/SelectPinpaiXilie"
    request.sendRequest(url)
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          lists: res.data.data
        })
      }, function (err) {
        console.log(err);
      });
    // 获取商场商品
    let urls = app.globalData.api + "index/SelectCommondity"
    let userid = wx.getStorageSync('user').id
    let data = {
      userid: userid
    }
    request.sendRequest(urls, 'get', data, {})
      .then(function (res) {
        console.log(res.data)
        that.setData({
          array: res.data.data
        })
      }, function (err) {
        console.log(err);
      });
  },
  // 左邊导航大标签
  jumpIndex(e) {
    let that = this
    let id = e.currentTarget.dataset.menuindex
    let data = e.currentTarget.dataset.item.xilie
    let pinpid = e.currentTarget.dataset.item.id
    console.log(data, id, pinpid)
    if (that.data.block == true) {
      that.setData({
        block: false,
      })
    } else {
      that.setData({
        indexId: id,
        block: true,
        floor3box: data,
        pinpid: pinpid
      });
    }
  },
  // 分享
  onShareAppMessage: function () {
    let user = wx.getStorageSync('user');
    let sharid = user.id;
    return {
      title: '快来购买商品啦',
      path: '/pages/index/index/?sharid=' + JSON.stringify(sharid),
      success: function (res) {
        console.log('转发成功')
      },

      fail: function (res) {
      }
    }

  },

})