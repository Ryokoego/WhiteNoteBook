// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id:"",
    money:0,
    data:"",
    userInfo: {
      avatarUrl: "",//用户头像
      nickName: "",//用户昵称
    },
    plan_complish_number:0,
    tomato_time:0,
    user_grade:0
  },

  seTup: function(){
    wx.navigateTo({
      url: '../setup/setup',
    })
  },

  mytemplate: function () {
    wx.navigateTo({
      url: '../mytemplate/mytemplate',
    })
  },
  mydynamic: function () {
    wx.navigateTo({
      url: '../mydynamic/mydynamic',
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  my_plan:function(){
   var openid = wx.getStorageSync('token')
    //console.log(openid)
    wx.navigateTo({
      url: "../my_plan/others?id=" + openid
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
   async maintian(){
     await this.maintian1()
     await this.maintian2()
     await this.maintian3()
     await this.maintian4()
  },
  maintian1:function(){
    return new Promise((resolved, reject) => {
    const plan = wx.cloud.database().collection("plan");
    var openid = wx.getStorageSync('token');
    plan.where({
      _openid: openid
    }).get({
      success: res => {
        // console.log(res.data[0]);
        this.setData({
          data :res.data
        })
        resolved()
      } 
    })
    })
  }, 
  maintian2: function () {
    return new Promise((resolved, reject) => {
      var num =0
      for(var i=0;i<this.data.data.length;i++){
        if (this.data.data[i].plan_finish)
        num++
      }
      const user = wx.cloud.database().collection("user");
      var openid = wx.getStorageSync('token');
      user.where({
        _openid: openid
      }).get({
        success: res => {
          // console.log(res.data[0]);
          this.setData({
            _id: res.data[0]._id,
            tomato_time: res.data[0].tomato_time,
            plan_complish_number:num,
          })
          resolved()
        }
      })
    })
    }, 
    maintian3: function () {
      return new Promise((resolved, reject) => {
      var user_grade='0'
      if (this.data.tomato_time > 480 && this.data.plan_complish_numbe>32 ){
        user_grade =5
      } else if (this.data.tomato_time > 240 && this.data.plan_complish_numbe > 16) {
        user_grade = 4
      } else if (this.data.tomato_time > 120 && this.data.plan_complish_numbe > 8) {
        user_grade = 3
      } else if (this.data.tomato_time >60 && this.data.plan_complish_numbe > 4) {
        user_grade = 2
      } else if (this.data.tomato_time > 30 && this.data.plan_complish_numbe > 3) {
        user_grade = 1
      }
      const user = wx.cloud.database().collection("user") 
      user.doc(this.data._id).update({
        data: {
          user_grade: user_grade,
          plan_complish_number: this.data.plan_complish_number
        },

        success: res => {

          // console.log("用户添加成功")
          resolved(res)
        }
      })
      })

      
  },
  maintian4: function () {
    return new Promise((resolved, reject) => {
      const user = wx.cloud.database().collection("user");
      var openid = wx.getStorageSync('token');
      user.where({
        _openid: openid
      }).get({
        success: res => {
          // console.log(res.data[0]);
          this.setData({
            plan_complish_number: res.data[0].plan_complish_number,
            tomato_time: res.data[0].tomato_time,
            user_grade: res.data[0].user_grade,
          })
        }
      })

    })
  },

  onShow: function () {
    this.maintian()
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        // console.log(res);
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})