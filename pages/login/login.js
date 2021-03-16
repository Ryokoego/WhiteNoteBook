var Bmob = require('../../utils/Bmob-2.2.5.min.js');
Bmob.initialize("dfc508a75ec17f11", "123456", "fe13728d9425cdb5ac91a79ddae1a5a6");
var app = getApp();
Page({
  data: {
    username: '',
    password: '',
    email: '',
    name_flag: true,
    pwd_flag: true,
    mail_flag: true,
    defaultType: true,
    passwordType: true,
    flag: true,
    angle: 0,
    userInfo: {}
  },
  getName(e) {
    //console.log(e.detail.value)// {value: "ff", cursor: 2}
    var regexp = /^[\u4E00-\u9FA5A-Za-z]+$/
    var uusename = e.detail.value
    var flg = regexp.test(uusename)
    this.setData({
      username: uusename,
      name_flag: flg
    })
    // console.log(uusename)
    // console.log(flg)
  },
  getPassword(e) {
    var regexp = /^\w+$/
    var ppassword = e.detail.value
    var flg = regexp.test(ppassword)
    this.setData({
      password: ppassword,
      pwd_flag: flg
    })
    // console.log(ppassword)
    // console.log(this.data.pwd_flag) 
  },
  getEmail(e) {
    var regexp = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
    var eemail = e.detail.value
    var flg = regexp.test(eemail)
    this.setData({
      email: eemail,
      mail_flag: flg
    })
  },
  changeIcon: function () {
    if (this.data.defaultType) {
      this.setData({
        passwordType: false,
        defaultType: false,
      })
    } else {
      this.setData({
        passwordType: true,
        defaultType: true,
      })
    }
  },
  bindgetuserinfo: function (e) {
    var _that = this
    if (!this.data.name_flag) { //判断用户名是否正确
      wx.showToast({
        title: '您输入的用户名格式有误，不能包含特殊字符',
        duration: 2000,
        icon: 'none'
      });
    }
    if (!this.data.pwd_flag) { //判断密码是否正确
      wx.showToast({
        title: '您输入的密码格式有误，密码中仅能包含字母和数字以及下划线',
        duration: 2000,
        icon: 'none'
      });
    }
    if (!this.data.mail_flag) { //判断邮箱格式是否正确
      wx.showToast({
        title: '您输入的邮箱格式有误',
        duration: 2000,
        icon: 'none'
      });
    }
    if (this.data.username == '') { //判断用户名是否为空
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 2000
      })
    }
    if (this.data.password == '') { //判断密码是否为空
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      })
    }
    if (this.data.email == '') { //判断邮箱是否为空
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none',
        duration: 2000
      })
    }
    //获取后台用户信息
    var userList = []
    const query = Bmob.Query("_User");
    query.find().then(res => {
      userList = res
      //  console.log(userList) //没有返回密码，因此需要login之后看返回的是sucess还是err
      var flags = true
      for (var i = 0; i < userList.length; i++) {
        if (this.data.username == userList[i].username) { //用户名匹配成功
          // console.log('用户名匹配成功')
          // console.log('userList[i].password'+userList[i].password)
            if (this.data.email == userList[i].email) { //判断邮箱是否匹配
              // console.log('邮箱匹配成功')
              Bmob.User.login(this.data.username, this.data.password).then(res => { //登陆成功
                // console.log(res)
                app.globalData.username = this.data.username
                app.globalData.password = this.data.password
                console.log(app.globalData.username)
                console.log(app.globalData.password)
                wx.showToast({
                  title: '登陆成功',
                  icon: 'none',
                  duration: 3000
                })
                this.getUserId()
                wx.getSetting({ //获取头像等信息
                  success: res => {
                    if (res.authSetting['scope.userInfo']) {
                      // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                      wx.getUserInfo({
                        success: res => {
                          // 可以将 res 发送给后台解码出 unionId
                          app.globalData.userInfo = res.userInfo
                          // console.log( res.userInfo)
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
                app.globalData.username = this.data.username
                app.globalData.password = this.data.password
                wx.switchTab({
                  url: '../index/index',
                })
              }).catch(err => {
                wx.showToast({
                  title: '您输入的密码有误',
                  icon: 'none',
                  duration: 2000
                })
              });
              break;//成功了就可以停止循环了
            } else { //您输入的邮箱有误
              wx.showToast({
                title: '您输入的邮箱有误',
                icon: 'none',
                duration: 2000
              })
              // console.log('邮箱匹配失败')
            }
          } else { //用户名匹配失败
          // console.log('用户名匹配失败')
        }
      }
    });
    //判断用户名是否存在
    // const query = Bmob.Query('_User');
    // query.get(nickName).then(res => {
    // // console.log(res)
    // }).catch(err => {
    // console.log(err)
    // })
    // wx.switchTab({
    //   url: '/pages/index/index',
    // });
  },
  getUserId : function(){
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('_User');
      resolve(
        query.find().then(res => {
          console.log(res)
          for(var i = 0;i<res.length;i++){
            console.log('app:'+app.globalData.username)
            console.log('res:'+res[i].username)
            // console.log('id:'+res[i].objectId)
            if(app.globalData.username==res[i].username){
              app.globalData.userid = res[i].objectId
              console.log(app.globalData.userid)
            }
          }
        })
      )
      console.log(app.globalData.userid)
    })
  },
  goToRegister: function () {
    wx.navigateTo({
      url: '../register/register',
    });
  },
  goToChangePwd: function () {
    wx.navigateTo({
      url: '../changepwd/changepwd',
    });
  },
  onLoad: function () {

  },
  onShow: function () {
    // console.log('onLoad')
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
  },
  onReady: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    });
  },
});