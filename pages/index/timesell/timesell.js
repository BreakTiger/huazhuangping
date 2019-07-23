var app=getApp()
const request = require('../../../class/api/htts.js')
import modals from '../../../class/methods/modal.js'
Page({
  data: {
    notice: [],
    goods_info_list: [],
    gonggao:''

  },

  onLoad: function (options) {
    let that=this
    //  公告
    let url1 = app.globalData.api + "index/FindMsGonggao"
    request.sendRequest(url1, 'get')
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          gonggao: res.data.data
        })
      }, function (err) {
        // console.log(err);
    })
    // 抢购商品
    let url2 = app.globalData.api + "index/SelectPackage"
    request.sendRequest(url2, 'get')
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          goods_info_list: res.data.data
        })
      }, function (err) {
      })
  },
  timesell:function(e){
    let data=e.currentTarget.dataset.item
    let info=JSON.stringify(data)
    let url = "/pages/index/timesell/sell/sell?data="
    modals.navigate(url,info)
  }
  
})