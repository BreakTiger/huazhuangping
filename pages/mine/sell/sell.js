
import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['一级会员','二级会员'],
    current: 0,
    one:[],
    two:[]

  },

  tabItemClick: function (e) {
    this.setData({
      current: e.currentTarget.dataset.pos
     
    })
    console.log(e.currentTarget.dataset.pos)
  },

  onLoad: function (options) {
    let user = wx.getStorageSync('user')
    let that=this
    let url = app.globalData.api + "index/SelectMyXj"
    let data = {
      userid: user.id
    }
    request.sendRequest(url, 'get', data)
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          one: res.data.data.one,
          two: res.data.data.two
        })
      }, function (err) {
        console.log(err);
      });
  },

})