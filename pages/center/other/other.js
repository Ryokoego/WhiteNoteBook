const app = getApp();
var Bmob = require('../../../utils/Bmob-2.2.5.min.js');
var util = require('../../../utils/util.js');
Bmob.initialize("dfc508a75ec17f11", "123456");
Page({
  data: {
    _id: "",
    img1: 'https://ftp.bmp.ovh/imgs/2021/03/60255bf5573a1b80.png',
    img2: 'https://7469-timeplan-9yepf-1259735400.tcb.qcloud.la/image/personal/wave.gif?sign=69282d287f761cee9dac9d0cfa4e0dd4&t=1590243821',
    choose_iisue: ['他的笔记', '他的帖子'],
    TabCur: 0,
    scrollLeft: 0,
    notesList: [],
    time: [],
    postList: [],
    notescount : 0,
    postcount : 0,
    userName: '',
    userPic : '',
    plan_complish_number: 0,
    tomato_time: 0,
    user_grade: 0
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  onLoad: function (options) {
    var name = options.name
    var pic = options.pic
    const notesquery = Bmob.Query("notes_detail");
    const postquery = Bmob.Query("post_detail");
    this.setData({
      userName : name,
      userPic : pic
    })
    var _that = this

    //获取当前用户发布的笔记
    notesquery.equalTo("username", "==", this.data.userName);
    notesquery.order("createdAt");
    notesquery.find().then(res => {
      // console.log(res)
      _that.setData({
        notesList: res
      })
      // console.log(this.data.notesList.length)
      for (var i = 0; i < this.data.notesList.length; i++) {
        // console.log(this.data.notesList[i].createdAt)
        var TIME = this.data.notesList[i].createdAt.substring(5, 10);
        // console.log(TIME)
        let temp = 'time[' + i + ']' // 获取goodsList[index].num
        this.setData({
          [temp]: TIME
        })
        console.log(this.data.time)
      }
    });
    
    //获取当前用户发布的帖子
    postquery.equalTo("username", "==", this.data.userName);
    postquery.order("-createdAt");
    postquery.find().then(res => {
      // console.log(res)
      _that.setData({
        postList: res
      })
    });

    //查询当前用户帖子记录个数
    postquery.equalTo("username", "==", this.data.userName);
    postquery.find().then(res => {
        _that.setData({
          postcount : res.length
        })
        console.log(this.data.postcount)
    });

    //查询当前用户笔记记录个数
    notesquery.equalTo("username", "==", this.data.userName);
    notesquery.find().then(res => {
        _that.setData({
          notescount : res.length
        })
        console.log(this.data.notescount)
    });
  },
  onPostDetailTap: function (e) {
    var objectid = e.currentTarget.dataset.objectid;
    // var like = this.data.notesliked
    // var favor = this.data.notesfavored
    wx.navigateTo({
      url: '../../post_detail/post_detail?objectid=' + objectid 
    })
  },
  onNotesDetailTap: function (e) {
    var objectid = e.currentTarget.dataset.objectid;
    // var like = this.data.notesliked
    // var favor = this.data.notesfavored
    wx.navigateTo({
      url: '../../notes_detail/notes_detail?objectid=' + objectid 
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  //  async maintian(){
  //    await this.maintian1()
  //    await this.maintian2()
  //    await this.maintian3()
  //    await this.maintian4()
  // },
  // maintian1:function(){
  //   return new Promise((resolved, reject) => {
  //   const plan = wx.cloud.database().collection("plan");
  //   var openid = wx.getStorageSync('token');
  //   plan.where({
  //     _openid: openid
  //   }).get({
  //     success: res => {
  //       // console.log(res.data[0]);
  //       this.setData({
  //         data :res.data
  //       })
  //       resolved()
  //     } 
  //   })
  //   })
  // }, 
  // maintian2: function () {
  //   return new Promise((resolved, reject) => {
  //     var num =0
  //     for(var i=0;i<this.data.data.length;i++){
  //       if (this.data.data[i].plan_finish)
  //       num++
  //     }
  //     const user = wx.cloud.database().collection("user");
  //     var openid = wx.getStorageSync('token');
  //     user.where({
  //       _openid: openid
  //     }).get({
  //       success: res => {
  //         // console.log(res.data[0]);
  //         this.setData({
  //           _id: res.data[0]._id,
  //           tomato_time: res.data[0].tomato_time,
  //           plan_complish_number:num,
  //         })
  //         resolved()
  //       }
  //     })
  //   })
  //   }, 
  //   maintian3: function () {
  //     return new Promise((resolved, reject) => {
  //     var user_grade='0'
  //     if (this.data.tomato_time > 480 && this.data.plan_complish_numbe>32 ){
  //       user_grade =5
  //     } else if (this.data.tomato_time > 240 && this.data.plan_complish_numbe > 16) {
  //       user_grade = 4
  //     } else if (this.data.tomato_time > 120 && this.data.plan_complish_numbe > 8) {
  //       user_grade = 3
  //     } else if (this.data.tomato_time >60 && this.data.plan_complish_numbe > 4) {
  //       user_grade = 2
  //     } else if (this.data.tomato_time > 30 && this.data.plan_complish_numbe > 3) {
  //       user_grade = 1
  //     }
  //     const user = wx.cloud.database().collection("user") 
  //     user.doc(this.data._id).update({
  //       data: {
  //         user_grade: user_grade,
  //         plan_complish_number: this.data.plan_complish_number
  //       },

  //       success: res => {

  //         // console.log("用户添加成功")
  //         resolved(res)
  //       }
  //     })
  //     })


  // },
  // maintian4: function () {
  //   return new Promise((resolved, reject) => {
  //     const user = wx.cloud.database().collection("user");
  //     var openid = wx.getStorageSync('token');
  //     user.where({
  //       _openid: openid
  //     }).get({
  //       success: res => {
  //         // console.log(res.data[0]);
  //         this.setData({
  //           plan_complish_number: res.data[0].plan_complish_number,
  //           tomato_time: res.data[0].tomato_time,
  //           user_grade: res.data[0].user_grade,
  //         })
  //       }
  //     })

  //   })
  // },

  onShow: function () {
    // this.maintian()
    // var that = this;
    // wx.getUserInfo({
    //   success: function (res) {
    //     // console.log(res);
    //     var avatarUrl = 'userInfo.avatarUrl';
    //     var nickName = 'userInfo.nickName';
    //     that.setData({
    //       [avatarUrl]: res.userInfo.avatarUrl,
    //       [nickName]: res.userInfo.nickName,
    //     })
    //   }
    // })
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  }
})