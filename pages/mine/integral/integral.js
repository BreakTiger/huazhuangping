import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: [{
        goodimg: '/imgs/mine/header.png',
        goodname: '完美保湿面膜护肤套装，还你一个年轻的肌肤',
        goodprice: '123',
        timelog: '2018.05.15'
      },
      {
        goodimg: '/imgs/mine/header.png',
        goodname: '完美保湿面膜护肤套装，还你一个年轻的肌肤',
        goodprice: '321',
        timelog: '2018.05.15'
      },
      {
        goodimg: '/imgs/mine/header.png',
        goodname: '完美保湿面膜护肤套装，还你一个年轻的肌肤',
        goodprice: '574',
        timelog: '2018.05.15'
      }
    ],
    user:'',
    jifen:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this
    
    console.log(options.data)
    this.setData({
      jifen: options.data
    })

    
  },
  onShow:function(){
    // 积分购买详细
    let that = this
    let user = wx.getStorageSync('user')
    let url = app.globalData.api + "index/IntegralConsumptionRecord"
    let data = {
      userid: user.id
    }
    request.sendRequest(url, 'get', data)
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          record: res.data.data
        })
      }, function (err) {
        console.log(err);
      });
  }
  
  
  
})