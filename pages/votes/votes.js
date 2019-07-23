import modals from '../../class/methods/modal.js'
const request = require('../../class/api/htts.js')
var app=getApp()
Page({

  data: {
    types: 0,
    voteinfo: [],
  },

 
  onLoad: function(options) {
    
  },
  // 投票
  touticket:function(e){
    let user = wx.getStorageSync('user')
    let that=this
    let isvote = e.currentTarget.dataset.item.isvote
    let vid=e.currentTarget.dataset.item.id
    let index = e.currentTarget.dataset.index
    if (isvote==0){
      let surl = app.globalData.api + 'index/UserVote'
      let datas = {
        userid: user.id,
        voteid: vid
      }
      request.sendRequest(surl, 'post', datas, { "Content-Type": "application/x-www-form-urlencoded" })
        .then(function (res) {
          console.log(res.data.data)
          that.onShow()
          modals.showToast('投票成功', 'success')
        })
    }else{
      modals.showToast('您已投过票', 'loading')
    }
    
  },
  onShow:function(){
    let that = this
    if (app.globalData.closestatus == 0) {
      let url = "/pages/close/close"
      modals.navigate(url)
      console.log('zhwe')
    }
    let user = wx.getStorageSync('user')
    let surl = app.globalData.api + 'index/SelectVote'
    let datas = {
      userid: user.id
    }
    request.sendRequest(surl, 'get', datas, {})
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          voteinfo: res.data.data
        })
    })
  },
  // 详情
  todetail:function(e){
    let data = e.currentTarget.dataset.item
    let info = JSON.stringify(data)
    let url = "/pages/index/timesell/sell/sell?data="
    modals.navigate(url, info)
    
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