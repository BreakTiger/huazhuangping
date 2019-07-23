import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lables: [{
        lable_name: '护肤',
        object_id: '0',
      },
      {
        lable_name: '美容',
        object_id: '0'
      },
      {
        lable_name: '保湿',
        object_id: '0'
      },
      {
        lable_name: '美白',
        object_id: '0'
      },
      {
        lable_name: '祛痘',
        object_id: '0'
      },
      {
        lable_name: '去皱纹',
        object_id: '0'
      },

    ],
    check:0,
    list: [
     
    ]

  },

  onLoad: function(options) {

  },

  
  // 标签点击,隐藏热门搜索事件
  onLableTap:function(e){
    var checkId = e.currentTarget.dataset.id
    console.log(checkId)
    this.setData({
      check: checkId
    })
  },
  // 搜索
  onSearchTap:function(e){
    let that=this
    let name = e.detail.value.keyword
    console.log(name)
    let surl = app.globalData.api + 'index/SearchGoods'
    let data={
      typeid:0,
      key:name
    }
    request.sendRequest(surl, 'post',data, { "Content-Type": "application/x-www-form-urlencoded" })
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          list:res.data.data
        })
      })
  },
  // 去详情
  todetail:function(e){
   console.log(e.currentTarget.dataset.data)
   let data = JSON.stringify(e.currentTarget.dataset.item)
   let url = "/pages/index/detail/detail?data="
   modals.navigate(url, data)
  }

})