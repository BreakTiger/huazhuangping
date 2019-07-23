const app = getApp();
const request = require('../../../class/api/htts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  tosubmit: function(e) {
    console.log(e)
    let that = this;
    let user = wx.getStorageSync('user');
    let old_password = e.detail.value.old_password;
    let new_password = e.detail.value.new_password;
    if (old_password == '' || new_password == '') {
      wx.showToast({
        title: '密码不能为空',
      })
      return;
    }
    let data = {
      'phone': user.phone,
      'old_password': old_password,
      'new_password': new_password
    };
    let url = app.globalData.api + "index/UserModifyPwd"
    request.sendRequest(url, 'post', data, {
      "Content-Type": "application/x-www-form-urlencoded"
    }).then(res => {
      let code = res.data.code;
      if (code == 0) {
        wx.showToast({
          title: '密码修改成功',
        })
      } else {
        wx.showToast({
          title: '旧密码错误',
        })
      }
    });
  }
})