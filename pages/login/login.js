const request = require('../../class/api/htts.js')
import modals from '../../class/methods/modal.js'
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    nav:['注册','登录'],
    curindex:0,
    navindex:0,
    ajxtrue:false,
    shopid:1,
    status:1,
    
  },
  // 注册或登录
  navbar:function(e){
    let index=e.currentTarget.dataset.index
    this.setData({
      navindex:index
    })
  },
//  选择tab
  changetab:function(e){
    let that=this
    let data=e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    console.log(data,index)
    that.setData({
      shopid:data.id,
      curindex: index
    })
  },
  tosubmit:function(e){
   console.log(e)
   let info=e.detail.value
   console.log(info)
   let that=this
   let sharid=''
   console.log(wx.getStorageSync('sjid'))
   if (wx.getStorageSync('sjid')){
     sharid = wx.getStorageSync('sjid')
   }
   
   let ajxtrue = that.data.ajxtrue
   console.log(info.dpname)
   if (ajxtrue==true){
     if (info.password!='' && info.name!='' && info.shopname!='' && info.address!=''){
       let url = app.globalData.api + "index/RegisterUser"
       let data = {
         sj_id: sharid,
         pinpaiid:that.data.shopid,
         name:info.name,
         address:info.address,
         dpname: info.dpname,
         password: info.password,
         phone:info.phone
       }
       request.sendRequest(url, 'post', data, { "Content-Type": "application/x-www-form-urlencoded" })
         .then(function (res) {
           let data = res.data.data
           console.log(res)
            let code=res.data.code
            if (code =='password length Range 6-19！'){
              modals.showToast('密码长度6-19位', 'loading')
            } else if (code =='The phone number has already existed'){
              modals.showToast('该手机号已存在', 'loading')
            }
            else{
              modals.showToast('提交成功', 'success')
              that.setData({
                navindex: 1
              })
            }
             
         }, function (err) {
           console.log(err);
         });

     }else{
      //  信息不完整
       modals.showToast('信息不完整','loading')
     }
   }else{
     modals.showToast('请检查手机号', 'loading')
    //shoujihao 
    //  modals.modalTwo('您注册的号码正在后台审核，请稍等', '提示', '确认', '取消')
   }
  },
  //验证手机号
  blurPhone: function (e) {
    var phone = e.detail.value;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        ajxtrue: false
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 2000
        })
      }
    } else {
      this.setData({
        ajxtrue: true
      })
    }

  },
  onLoad: function (options) {
    //index/SelectPinpai
    let that=this
    let url = app.globalData.api + "index/SelectPinpai"
    
    request.sendRequest(url, 'get', {})
      .then(function (res) {
        console.log(res.data)
        that.setData({
          list:res.data.data
        })
      }, function (err) {
        console.log(err);
      });
  },
  // 登录
  tologin: function (e) {
    console.log(e)
    let info = e.detail.value
    console.log(info)
    let that = this
    let ajxtrue = that.data.ajxtrue
    if (ajxtrue) {
      if (info.password != '') {
        let url = app.globalData.api + "index/UserLogin"
        let data = {
          password: info.password, 
          phone: info.phone
        }
        request.sendRequest(url, 'post', data, { "Content-Type": "application/x-www-form-urlencoded" })
          .then(function (res) {
            let data = res.data.data
            console.log(res)
            if(res.data.code==1){
              modals.modalTwo('您注册的号码正在后台审核，审核时间较长，请耐心等待',  '提示', '确认', '取消')
            } else if (res.data.code == 2){
              modals.modalTwo('检查手机号和密码,或者您没有完成注册', '登录失败', '确认', '取消')
            } else if (res.data.code == 0){
                let user = res.data.data
                wx.setStorageSync('user', user)
                console.log(wx.getStorageSync('user'))
                modals.showToast('登录成功', 'success')
                let url = "/pages/index/index"
                modals.toswitch(url)
            }
          }, function (err) {
            console.log(err);
          });

      }
    }else{
      modals.showToast('手机号有误', 'loading')
    }
  },
  onShow(){
    console.log('少时诵诗书', wx.getStorageSync('sjid'))
  }

  
})