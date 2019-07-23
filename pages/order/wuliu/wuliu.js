// pages/order/wuliu/wuliu.js
const request = require('../../../class/api/htts.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let wuliu = JSON.parse(options.jsonStr);
    let surl = app.globalData.api + 'index/Findlogistics';
    request.sendRequest(surl, 'post', wuliu, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log(res)
        that.setData({
          datalist: res.data.data
        });
      });
  }
})