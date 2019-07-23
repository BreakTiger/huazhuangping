// pages/order/all-orders/wuliu/wuliu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wuliu: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let wuliu = JSON.parse(options.jsonStr);
    this.setData({
      wuliu: wuliu
    });
  },
  showWuliu: function(e) {
    let item = e.currentTarget.dataset.item;
    console.log(item);
    let str = JSON.stringify(item);
    wx.navigateTo({
      url: '/pages/order/wuliu/wuliu?jsonStr=' + str
    })
  }
})