// pages/order/return-detail/return-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [{
      types: '商家受理中',

      message: [{
          imgsrc: '/imgs/mine/header.png',
          name: '春纪保湿面膜护肤套装水润保湿面膜护肤',
          guige:'套餐一',
          price: '123',
          numbers: '2',
        },
        {
          imgsrc: '/imgs/mine/header.png',
          name: '春纪保湿面膜护肤套装水润保湿面膜护肤',
          color: '白色',
          sku: 'M',
          price: '123',
          numbers: '2',
        }
      ],
      reason: '多拍/拍错/不想要',
      time: '2018.1.23 01：15：06',
      suhao: '123456'

    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})