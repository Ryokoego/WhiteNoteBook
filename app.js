//app.js
var Bmob = require('/utils/Bmob-2.2.5.min.js');
Bmob.initialize("dfc508a75ec17f11", "123456");
App({
  globalData: {
    userInfo :[],
    username : '',
    password : '',
    hasLogin: false,
    openid: null
  },
  onLaunch: function () {
    // this.globalData.userPic = userpic
  //获取用户当前信息
      // let current = Bmob.User.current()
      let current = Bmob.User.current()
      // console.log(current)
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userPic = res.userInfo.avatarUrl
              // console.log(this.globalData.userPic)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  // GetUserEntity :function() {
  //   return new Promise(function (resolve, reject) {
  //     wx.request({
  //       url: http_config.getUserDetail,
  //       data: {
  //         Sha1OpenId: wx.getStorageSync('LoginSessionKey')
  //       },
  //       success: (res) => {
  //         let result = res.data.data;
  //         resolve(result) ;
  //       },
  //       fail:()=>{
  //         reject("系统异常，请重试！")
  //       }
  //     })
  //   })
     
  // },
})