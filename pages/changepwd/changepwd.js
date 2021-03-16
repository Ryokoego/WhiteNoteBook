var Bmob = require('../../utils/Bmob-2.2.5.min.js');
userInfo: [],
  Bmob.initialize("dfc508a75ec17f11", "123456", "fe13728d9425cdb5ac91a79ddae1a5a6");
var app = getApp();
Page({
  data: {
    password: '',
    email: '',
    pwd_flag: true,
    mail_flag: true,
    defaultType: true,
    passwordType: true,
    angle: 0,
    userInfo: {}
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
  goToIndex: function (e) {
    var _that = this
    if (!this.data.pwd_flag) { //判断密码是否正确
      wx.showToast({
        title: '您输入的密码格式有误，密码中仅能包含字母和数字以及下划线',
        duration: 2000,
        icon: 'none'
      });
    } else if (!this.data.mail_flag) { //判断邮箱格式是否正确
      wx.showToast({
        title: '您输入的邮箱格式有误',
        duration: 2000,
        icon: 'none'
      });
    } else if (this.data.username == '') { //判断用户名是否为空
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.password == '') { //判断密码是否为空
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.email == '') { //判断邮箱是否为空
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none',
        duration: 2000
      })
    } else {
      //获取后台用户信息
      var userList = []
      const query = Bmob.Query("_User");
      query.find().then(res => {
        userList = res
        var flags = true
        for (var i = 0; i < userList.length; i++) {
          if (this.data.email == userList[i].email) { //判断邮箱是否匹配
            // console.log('邮箱匹配成功')
            let data = {
              email: this.data.email
            }
            Bmob.requestPasswordReset(data).then(res => {
              console.log(res)
              // query.set('password', this.data.password) //修改密码
              wx.showToast({
                title: '修改成功',
                icon: 'none',
                duration: 2000
              })
            }).catch(err => {
              console.log(err)
              wx.showToast({
                title: '该邮箱尚未注册',
                icon: 'none',
                duration: 2000
              })
            })
          }
        }
      });
    }

  },
  onLoginTap: function () {
    wx.navigateTo({
      url: '../login/login',
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