 var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beizhu:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData.beizhu)
    this.setData({
      beizhu:app.globalData.beizhu
    })
  }    
})