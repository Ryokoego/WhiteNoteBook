var Bmob = require('../../utils/Bmob-2.2.5.min.js');
userInfo: [],
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
  onRegisterTap: function (e) {
    var _that = this
    if (!this.data.name_flag) { //判断用户名是否正确
      wx.showToast({
        title: '用户名输入有误!不能包含特殊字符',
        duration: 3000,
        icon: 'none'
      });
    } else if (!this.data.pwd_flag) { //判断密码是否正确
      wx.showToast({
        title: '密码中仅能包含字母和数字以及下划线',
        duration: 3000,
        icon: 'none'
      });
    } else if (!this.data.mail_flag) { //判断邮箱格式是否正确
      wx.showToast({
        title: '您输入的邮箱格式有误',
        duration: 3000,
        icon: 'none'
      });
    } else if (this.data.username == '') { //判断用户名是否为空
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 3000
      })
    } else if (this.data.password == '') { //判断密码是否为空
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 3000
      })
    } else if (this.data.email == '') { //判断用户名是否为空
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none',
        duration: 3000
      })
    } else {
      //获取后台用户信息
      var flag = true
      var userList = []
      const query = Bmob.Query("_User");
      query.find().then(res => {
        userList = res
        //  console.log(userList) //没有返回密码，因此需要login之后看返回的是sucess还是err
        for (var i = 0; i < userList.length; i++) {
          // console.log('this.data.username:'+this.data.username+'userList[i].username:'+userList[i].username)
          if (this.data.username === userList[i].username) {
            wx.showToast({ //判断用户名是否重复
              title: '该用户名已被占用！',
              icon: 'none',
              duration: 3000
            })
            flag = false
          } else if (this.data.email == userList[i].email) { //判断邮箱是否重复
            wx.showToast({
              title: '该邮箱已被占用',
              icon: 'none',
              duration: 3000
            })
            flag = false
          }
        }
      });
    }
    if (flag) {
      let params = {
        username: this.data.username,
        password: this.data.password,
        points: 100,
        email: this.data.email,
        userPic: app.globalData.userPic,
      }
      console.log(params)
      Bmob.User.register(params).then(res => {
        // console.log(res)
        wx.showToast({ //登陆成功
          title: '注册成功！',
          icon: 'none',
          duration: 3000
        })
      }).catch(err => {
        wx.showToast({ //登陆失败
          title: '注册失败！',
          icon: 'none',
          duration: 3000
        })
      });
    }
  },
  onLoginTap: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
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