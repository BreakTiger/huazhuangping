import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emlist:[]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    let user=wx.getStorageSync('user')
    let url = app.globalData.api + "index/SelectAdminUser"
    let data = {
      userid:user.id
    }
    request.sendRequest(url, 'post', data, { "Content-Type": "application/x-www-form-urlencoded" })
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          emlist:res.data.data
        })
      })
  },
  totp:function(e){
    let that=this
    let adminid=e.currentTarget.dataset.id
    let user = wx.getStorageSync('user')
    let url = app.globalData.api + "index/VoteAdminUser"
    let data = {
      adminid: adminid,
      userid:user.id
    }
    request.sendRequest(url, 'post', data, { "Content-Type": "application/x-www-form-urlencoded" })
      .then(function (res) {
        console.log(res.data)
        if (res.data.data==1){
          modals.showToast('投票成功', 'success')
          that.onLoad()
        }
      })
  },
  // dbgchfbddnjenfd djfb cdhsbfcd s
  onShow: function () {
    
  },
  tishi:function(){
    modals.showToast('您已经投过哦', 'loading')
  }
  
})