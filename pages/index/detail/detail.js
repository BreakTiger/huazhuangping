import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()
Page({


  data: {
    info: '',
    banner: [],
    detailimg: '', //详情图
    animationData: '',
    showModalStatus: false,
    minusStatuses: true,
    myBtn: '',
    zhuang: [{
      name: '水乳'
    }, {
      name: '面膜系列'
    }, {
      name: '面部精华'
    }, {
      name: '去皱眼霜'
    }],
    detailDatas: {
      num: 1
    },
    myselect: '水乳',
    zhuIndex: 0, //默认选择第一个
    gift:[]
  },

  onLoad: function(options) {
    console.log(options)
    let that = this
    let info = JSON.parse(options.data)
    console.log(info.gift)
    let pinpid = info.pinpaiid
    console.log(info, pinpid)
    if (options.user) {
      let user = JSON.parse(options.user)
      let sjid = user.id
      wx.setStorageSync('sjid', sjid)
    }
    that.setData({
      info: info,
      banner: info.slider,
      detailimg: info.detail,
      pinpid: pinpid,
      gift: info.gift
    })

    let myself = wx.getStorageSync('user')
    if (!myself) {
      let jumpurl = "/pages/login/login"
      modals.navigate(jumpurl)
    }
  },
  // 加入购物车
  addShopcar: function(e) {
    let that = this
    let num = e.currentTarget.dataset.num
    let goodsid = this.data.info.id
    let user = wx.getStorageSync('user')
    let userid = user.id
    let pinpid = this.data.pinpid
    console.log(pinpid, user.pinpaiid)
    if (pinpid == user.pinpaiid) {
      let url = app.globalData.api + "index/JoinShopCar"
      let data = {
        spid: goodsid,
        userid: userid,
        number: num
      }
      request.sendRequest(url, 'post', data, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(function(res) {
          console.log(res.data)
          if (res.data.code =='Lack of rank'){
            modals.modalTwo('您已经被限制购买该商品', '提示', '确定', '取消')
          }else{
            modals.showToast('添加成功', 'success')
            that.setData({
              showModalStatus: false
            })
          }
          
        }, function(err) {});
    } else {
      modals.modalTwo('该商品不是您选择的品牌，该分类的商品无法加入购物车', '提示', '确定', '取消')
    }
  },
  // 立即购买
  tobuy: function(e) {
    let user = wx.getStorageSync('user')
    let pinpid = this.data.pinpid
    if (pinpid == user.pinpaiid) {
      let num = e.currentTarget.dataset.num
      console.log(num)
      let data = JSON.stringify(this.data.info)
      wx.navigateTo({
        url: '/pages/order/confirm/confirm?data=' + data + '&num=' + num,
      })
    } else {
      modals.modalTwo('该商品不是您选择的品牌，该分类的商品无法购买', '提示', '确定', '取消')
    }


  },
  // 返回首页
  homeBack: function() {
    let url = '/pages/index/index'
    modals.toswitch(url)
  },
  // 返回购物车
  shopcarBack: function() {
    let url = '/pages/shopcar/shopcar'
    modals.toswitch(url)
  },
  onShareAppMessage: function(res) {
    let user = wx.getStorageSync('user');
    let data = this.data.info;

    return {
      title: '快来购买商品啦',
      path: '/pages/index/detail/detail?data=' + JSON.stringify(data) + '&user=' + JSON.stringify(user),
      success: function(res) {
        console.log('转发成功')
        console.log(JSON.stringify(data), JSON.stringify(user))
      },

      fail: function(res) {}
    }



  },
  // 弹窗
  setModalStatus: function(e) {
    let that = this;
    let detailDatas = this.data.detailDatas;
    let my = e.currentTarget.dataset.my;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step();
    that.setData({
      animationData: animation.export(),
      myBtn: my
    })
    if (e.currentTarget.dataset.status == 1) {
      this.setData({
        showModalStatus: true
      });
    }
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
  },

  // 减号号的数据处理
  bindMinus: function(e) {
    var num = this.data.detailDatas.num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    } else {
      this.setData({
        minusStatuses: true,
      });
    }
    // 购物车数据
    var detailDatas = this.data.detailDatas;
    detailDatas.num = num;
    // 将数值与状态写回
    this.setData({
      detailDatas: detailDatas,
    });
  },
  // 加号号的数据处理
  bindPlus: function(e) {
    var num = this.data.detailDatas.num;
    // 自增
    num++;
    // 购物车数据
    var detailDatas = this.data.detailDatas;
    detailDatas.num = num;
    // 将数值与状态写回
    this.setData({
      detailDatas: detailDatas,
      minusStatuses: false,
    });
  },
  // 加购买商品的输入数量
  bindChange: function(event) {
    var detailDatas = this.data.detailDatas;
    if (event.detail.value > 1) {
      detailDatas.num = event.detail.value;
      this.setData({
        detailDatas: detailDatas,
        minusStatuses: false,
      });
    } else {
      detailDatas.num = 1;
      this.setData({
        detailDatas: detailDatas,
        minusStatuses: true,
      });
    }

  },
  onShow:function(){
    if (app.globalData.closestatus == 0) {
      let url = "/pages/close/close"
      modals.navigate(url)
      console.log('zhwe')
    }
  }

})