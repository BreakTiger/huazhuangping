import request from '../../class/api/htts.js'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  created() {
    // console.log(this)
  },
  attached() {
    // console.log(this.data.myProperty)
  },
  data: {
  },
  ready() {
    // console.log('输出数据', this)
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    myProperty: { // 属性名
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
  },
  methods: {
    onGotUserInfo(e) {
      let that = this
      let userinfo = e.detail.userInfo
      console.log(userinfo)
      if (userinfo) {
        that.setUser(userinfo)
      } else {
        wx.openSetting({
          success: (res) => {
            wx.getUserInfo({
              success: function (res) {
                console.log(res.userInfo)
                let userinfo = res.userInfo
                that.setUser(userinfo)
              }
            })
          }
        })
      }
    },
    //存入userinfo
    setUser(userinfo) {
      let that = this
      let openid = wx.getStorageSync('openid')
      let url = app.globalData.api + 'index/RegisterUser';
      let data = { name: userinfo.nickName, url: userinfo.avatarUrl, openid: openid }
      request.sendRequest(url, 'POST', data, { "Content-Type": "application/x-www-form-urlencoded" })
        .then(function (res) {
          let user = res.data.data
          wx.setStorageSync('user', user)
          var addEvent = {
            val: 1
          }
          that.triggerEvent('myevent', addEvent)
        }, function (err) {
          console.log(err);
        });
    }
  }
})