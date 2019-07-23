import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareId: 0,
    user: { extract:1200},
    list1:[
       { 
         ordernumber: '132458725647h4d', 
         userimage:'/imgs/index/com.jpg',
         username:'柿子',
         time:'2018-12-02',
         money:'224'
         }
    ],
    list2: [
      { daytime: '2018-6-2', money: '100.00' },
      { daytime: '2018-6-2', money: '120.00' },
    ]
  },

  onLoad: function (options) {
  },
  // 我的分销
  myShare:function(){
    let url = "/pages/mine/sell/sell"
    modals.navigate(url)
  },
  // 导航
  shareFn: function (e) {
    let shareId = e.currentTarget.dataset.shareid;
    this.setData({
      shareId: shareId
    });
  },
 
})