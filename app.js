//app.js
const request = require('/class/api/htts.js')
App({
  onLaunch: function() {
    // 展示本地存储能力
    let that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        let code = res.code
        wx.request({
          url: 'https://didu2.didu86.com/hzp/public/index.php/index/Wx/wxopenid',
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            js_code: code
          },
          success: function(res) {
            let openid = res.data.openid
            wx.setStorageSync('openid', openid)
            // console.log(wx.getStorageSync('openid'))
          }
        })
      }
    })
    // 是否关闭
    wx.request({
      url: 'https://didu2.didu86.com/hzp/public/index.php/index/index/SystemOpen',
      method: 'get',
      success: function(res) {
        console.log(res.data.data)

        that.globalData.closestatus = res.data.data.open
        that.globalData.beizhu = res.data.data.beizhu
        if (res.data.data.open == 0) {
          wx.navigateTo({
            url: '/pages/close/close',
          })
        }

      }
    })
  },
  globalData: {
    api: 'https://didu2.didu86.com/hzp/public/index.php/index/',
    closestatus: 1,
    beizhu: ''
  },
  syncUser: function() {
    let user = wx.getStorageSync('user')
    let that = this
    let url = this.globalData.api + 'index/FindUserYue'
    let data = {
      id: user.id
    }
    request.sendRequest(url, 'get', data)
      .then(function(res) {
        //  console.log(res.data.data)
        let result = res.data.data
        wx.setStorageSync('user', result)
      }, function(err) {
        console.log(err);
      });
  }
})