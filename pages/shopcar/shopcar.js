import modals from '../../class/methods/modal.js'
const request = require('../../class/api/htts.js')
var app = getApp(); 
Page({
  data: {
    hpUrl: app.globalData.hpUrl,
    imgUrl: app.globalData.imgUrl,
    carts: [],

    // 实现bindSelectAll事件，改变全选状态
    selectedAllStatus: true,
 
    total: 0,
    //  页面打开时的短暂加载数据初始化1
    newload: '',
    minusStatuses: "disabled",
    //判断购物车是否为空时的页面
    hasList: true,
  },

  onLoad: function (options) {
  },
  onShow:function(){
    this.shuaXin()
    //登录
    let user = wx.getStorageSync('user')
    if (!user) {
      let url = "/pages/login/login"
      modals.navigate(url)
    }
    if (app.globalData.closestatus == 0) {
      let url = "/pages/close/close"
      modals.navigate(url)
      console.log('zhwe')
    }
  },
  //短暂加载函数
  newload: function () {
    wx.showLoading({
      title: '加载中', 
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 500);
  },
  // 减号被禁用时在初始化数据函数
  minusStatuses:function(){
    var minusStatuses=[];
    var length = this.data.carts.length;
    for (var i = 0; i < length;i++){
      minusStatuses.push("disabled");
    }
    this.setData({
      minusStatuses: minusStatuses
    });
  },
  // 减号减商品数量
  bindMinus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    this.addupgoods('reduce', index)
  },
  // 加号加商品数量
  bindPlus: function (e) {
     var index = parseInt(e.currentTarget.dataset.index);
     this.addupgoods('add',index)
  },
  // 输入的商品数量
  bindManual:function(e){
    // console.log(e.detail.value)
    var cheValue = e.detail.value;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.carts[index].num;
    var sum = this.data.carts[index].sum;
    var price = this.data.carts[index].price;
    // console.log(num);
 
    if (cheValue == '' || cheValue==0){
      cheValue=1
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = (cheValue <= 1) ? 'disabled' : 'normal';
    // 购物车数据
    var carts = this.data.carts;
    carts[index].num = cheValue;
    carts[index].sum = (cheValue * price).toFixed(1);
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;

      // 将数值与状态写回
      this.setData({
        carts: carts,
        minusStatuses: minusStatuses
      });
      this.sum();
  },
  // 单击复选框是否选中
  bindCheckbox: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.carts[index].selected;
    var carts = this.data.carts;
    // 对勾选状态取反
    carts[index].selected = !selected;
    console.log(carts[index].selected);
    // 写回经点击修改后的数组
    this.setData({
      carts: carts
    });
    this.sum();
  },
  // 全选复选框是否选中
  bindSelectAll: function () {
    // 环境中目前已选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值
    var carts = this.data.carts;
    // 遍历
    for (var i = 0; i < carts.length; i++) {
      carts[i].selected = selectedAllStatus;
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts
    });
    this.sum();
  },
  // 全选
  bindCheckout: function () {
    // 初始化toastStr字符串
    var toastStr = 'cid:';
    // 遍历取出已勾选的cid
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected) {
        toastStr += this.data.carts[i].cid;
        toastStr += ' ';
      }
    }
    //存回data
    this.setData({
      // toastHidden: false,
      // toastStr: toastStr
    });
  },
  bindToastChange: function () {
    this.setData({
      // toastHidden: true
    });
  },
  // 计算总的金额
  sum: function () {
    var carts = this.data.carts;
    // 计算总金额
    var total = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        total += carts[i].number * carts[i].price;
      }
    }
    total = total.toFixed(2);
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: total
    });
  },
  // 回tabar中的首页
  tobackHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  // 立即结算点击处理函数
  orderInto:function(){
    let che = { total: '', carts: '' }
    let that = this;
    let total = this.data.total;
    let carts = this.data.carts;
    let sel = [];
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        sel.push(carts[i])
      }
    }
    carts = sel
    che.total = total;
    che.carts = carts;
    console.log(che.carts.length, che.total,che)
    if (che.carts.length>0){
      let url = '/pages/order/shopconfirm/shopconfirm?data=' 
      let data = JSON.stringify(che)
      console.log(data)
      modals.navigate(url,data)
    }else{
      wx.showToast({
        title: '请选择要结算的商品',
        icon: 'success',
        duration: 2000
      })
    }

  },

  // 页面刷新
  shuaXin: function () {
    var that = this;
    var user = wx.getStorageSync('user')
    let url = app.globalData.api + "index/SelectShopcar"
    let data = {
      id: user.id
    }
    request.sendRequest(url, 'get', data, {})
      .then(function (res) {
        console.log(res.data.data)
        that.setData({
          carts: res.data.data
        })
        let result = res.data.data;
        if (result) {
          for (var i = 0; i < result.length; i++) {
            result[i].selected = true;
          }
          // console.log(result)
          that.setData({
            carts: result,
            hasList: true
          });
          // 加载弹框
          that.newload();
          // 减号被禁用时在初始化数据函
          that.minusStatuses();
          //  计算总的金额
          that.sum();
        }else{
          that.setData({
            carts: result,
            hasList: false
          });

        }
      }, function (err) {
        console.log(err);
      });
  },
  // 购物车删除
  deleteList(e) {
    var that = this
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let id = carts[index].id
  
    wx.showModal({
      title: '提示',
      content: '是否要删除该商品吗',
      showCancel: '取消',
      confirmText: '删除',
      confirmColor: '#D85B3F',
      success: function (res) {
        if (res.confirm) {
        
    let url = app.globalData.api + "index/DeleteShopcar"
    let data = {
      id:id
    }
    request.sendRequest(url, 'post', data, { "Content-Type": "application/x-www-form-urlencoded" })
      .then(function (res) {
        modals.showToast('删除成功', 'success')
        that.shuaXin()
      }, function (err) {
      });
    
    that.setData({
      carts: carts
    });
    if (carts.length==0) {                  // 如果购物车为空
      this.setData({
        hasList: false              // 修改标识为false，显示购物车为空页面
      });
    } else {                              // 如果不为空
      this.sum();           // 重新计算总价格
    }
        } else if (res.cancel) {
        }
      }
    })
  },
  // 加减
  addupgoods:function(status,index){
    var that=this
    var index = index;
    var carts = this.data.carts
    var num = carts.num;
    var sum = this.data.carts[index].sum;
    var price = carts[index].price;
    
    if (status=='add'){
      let url = app.globalData.api + "index/AddShopCarNum"
      let data = {
        id: carts[index].id
      }
      request.sendRequest(url, 'get', data, {})
        .then(function (res) {
          console.log(res.data.data)
          let result = res.data.data;
          that.shuaXin()
        })  
    }else if (status == 'reduce'){
      let url = app.globalData.api + "index/DeductShopcarNum"
      let data = {
        id: carts[index].id
      }
      request.sendRequest(url, 'get', data, {})
        .then(function (res) {
          console.log(res.data.data)
          let result = res.data.data;
          that.shuaXin()
        }) 
      
    }
  }
})