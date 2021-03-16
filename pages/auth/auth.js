const app = getApp()
var Bmob = require('../../utils/Bmob-2.2.5.min.js');
Bmob.initialize("dfc508a75ec17f11", "123456");
Page({
  data: {
    bgimg: 'https://ftp.bmp.ovh/imgs/2021/03/60255bf5573a1b80.png',
    userInfo: {},
    username: '',
    userPic: '',
    modal_flag : false,
    note_flag: true,
    post_flag: true,
    deleteId: '',
    currentNoteId: '',
    currentPostId: '',
    notesCount: 0,
    postCount: 0,
    followTotal: 0,
    choose_iisue: ['我的笔记', '我的帖子', '我的点赞', '我的收藏'],
    TabCur: 0,
    scrollLeft: 0,
    notesList: [],
    postList: [],
    notelikeList: [], //点赞笔记
    postlikeList: [], //点赞帖子
    notecollectList: [], //收藏笔记
    postcollectList: [], //收藏帖子
    time: [],
    modalName : ''
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      username: app.globalData.username,
      userPic: app.globalData.userPic
      // hasUserInfo: true
    })
    this.getNotes()
    this.getPost()
    this.getNoteLikes().then(result => {}) //获取笔记点赞记录
    this.getNoteCollects().then(result => {}) //获取笔记收藏记录
    this.getPostLikes().then(result => {}) //获取笔记点赞记录
    this.getPostCollects().then(result => {}) //获取笔记收藏记录
    this.getPostCount().then(result => {}) //获取当前用户发布帖子个数
    this.getNotesCount().then(result => {}) //获取当前用户发布笔记个数
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  onShow: function (options) {
    this.tabBar();
    this.getNotes()
    this.getPost()
    this.getNoteLikes().then(result => {}) //获取笔记点赞记录
    this.getNoteCollects().then(result => {}) //获取笔记收藏记录
    this.getPostLikes().then(result => {}) //获取笔记点赞记录
    this.getPostCollects().then(result => {}) //获取笔记收藏记录
    this.getPostCount().then(result => {}) //获取当前用户发布帖子个数
    this.getNotesCount().then(result => {}) //获取当前用户发布笔记个数
  },
  tabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }
  },
  getNotes: function () { //获取当前用户发表的笔记
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('notes_detail');
      query.equalTo("username", "==", this.data.username);
      query.order("-createdAt");
      resolve(
        query.find().then(res => {
          that.setData({
            notesList: res
          })
        })
      )
    })
  },
  getPost: function () { //获取当前用户发表的帖子
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('post_detail');
      query.equalTo("username", "==", this.data.username);
      query.order("-createdAt");
      resolve(
        query.find().then(res => {
          that.setData({
            postList: res
          })
        })
      )
    })
  },
  getNoteLikes: function () { //获取点赞的笔记列表
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('_User')
      query.field('note_likes', app.globalData.userid)
      // console.log(app.globalData.userid)
      query.order("-createdAt")
      resolve(
        query.relation('notes_detail').then(result => {
          // console.log(result)
          that.setData({
            notelikeList: result.results
          })
        })
      )
    })
  },
  getNoteCollects: function () { //获取收藏的笔记列表
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('_User')
      query.field('note_collects', app.globalData.userid)
      query.order("-createdAt")
      resolve(
        query.relation('notes_detail').then(result => {
          // console.log(result)
          that.setData({
            notecollectList: result.results
          })
        })
      )
    })
  },
  getPostLikes: function () { //获取点赞的帖子列表
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('_User')
      query.field('post_likes', app.globalData.userid)
      query.order("-createdAt")
      resolve(
        query.relation('post_detail').then(result => {
          // console.log(result)
          that.setData({
            postlikeList: result.results
          })
        })
      )
    })
  },
  getPostCollects: function () { //获取收藏的帖子列表
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('_User')
      query.field('post_collects', app.globalData.userid)
      query.order("-createdAt")
      resolve(
        query.relation('post_detail').then(result => {
          // console.log(result)
          that.setData({
            postcollectList: result.results
          })
        })
      )
    })
  },
  // getLikeDetail: function () { //获取点赞表
  //   var that = this
  //   return new Promise((resolve, reject) => {
  //     const query = Bmob.Query('like_detail'); //获取点赞表
  //     query.equalTo("username", "==", this.data.username);
  //     query.order("-createdAt");
  //     resolve(
  //       query.find().then(res => {
  //         for (var i = 0; i < res.length; i++) {
  //           if (res[i].type == 'note')
  //             this.getOneLikeCollectRecord('notes_detail', res[i].note_post_objectId)
  //           else
  //             this.getOneLikeCollectRecord('post_detail', res[i].note_post_objectId)
  //         }
  //       })
  //     )

  //   })
  // },
  // getPostDetail: function () { //获取收藏表
  //   var that = this
  //   return new Promise((resolve, reject) => {
  //     const query = Bmob.Query('collect_detail'); //获取收藏表
  //     query.equalTo("username", "==", this.data.username);
  //     query.order("-createdAt");
  //     resolve(
  //       query.find().then(res => {
  //         console.log(res)
  //         for (var i = 0; i < res.length; i++) {
  //           if (res[i].type == 'note')
  //             this.getOnelikePostRecord('notes_detail', res[i].note_post_objectId)
  //           else
  //             this.getOnelikePostRecord('post_detail', res[i].note_post_objectId)
  //         }
  //       })
  //     )

  //   })
  // },
  // getOneLikeCollectRecord: function (db, objectId) {
  //   var that = this
  //   if (db == 'notes_detail') {
  //     return new Promise((resolve, reject) => {
  //       const query = Bmob.Query(db);
  //       resolve(
  //         query.get(objectId).then(res => {
  //           var temp = this.data.likeList.concat(res)
  //           this.setData({
  //             likeList: temp
  //           })
  //         })
  //       )
  //     })
  //   } else {
  //     return new Promise((resolve, reject) => {
  //       const query = Bmob.Query(db);
  //       resolve(
  //         query.get(objectId).then(res => {
  //           var temp = this.data.postList.concat(res)
  //           this.setData({
  //             postList: temp
  //           })
  //         })
  //       )
  //     })
  //   }

  // },
  // getOneCollectDetail: function (objectId) {
  //   var that = this
  //   return new Promise((resolve, reject) => {
  //     const query = Bmob.Query('post_detail');
  //     resolve(
  //       query.get(objectId).then(res => {
  //         var temp = collectList.concat(res)
  //         this.setData({
  //           collectList: temp
  //         })
  //       })
  //     )
  //   })
  // },
  // getCollectDetail: function () { //获取收藏表记录
  //   var that = this
  //   return new Promise((resolve, reject) => {
  //     const query = Bmob.Query('collect_detail'); //获取点赞表
  //     query.equalTo("username", "==", this.data.username)
  //     query.order("-createdAt")
  //     resolve(
  //       query.find().then(res => {
  //         console.log(res)
  //       })
  //     )
  //   })
  // },
  getNotesCount: function () { //查询当前用户笔记记录个数
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('notes_detail')
      query.equalTo("username", "==", app.globalData.username);
      resolve(
        query.find().then(result => {
          // console.log(result)
          that.setData({
            notesCount: result.length
          })
        })
      )
    })
  },
  getPostCount: function () { //查询当前用户帖子记录个数
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('post_detail')
      query.equalTo("username", "==", app.globalData.username);
      resolve(
        query.find().then(result => {
          // console.log(result)
          that.setData({
            postCount: result.length
          })
        })
      )
    })
  },
  onPostDetailTap: function (e) { //跳转至帖子详情页
    var objectid = e.currentTarget.dataset.objectid;
    // console.log(objectid)
    wx.navigateTo({
      url: '../post_detail/post_detail?objectid=' + objectid
    })
  },
  onNotesDetailTap: function (e) { //跳转至笔记详情页
    var objectid = e.currentTarget.dataset.objectid;
    // console.log(objectid)
    wx.navigateTo({
      url: '../notes_detail/notes_detail?objectid=' + objectid
    })
  },

  // attached() {
  //   // console.log("success")
  //   let that = this;
  //   that.setData({
  //     userInfo: app.globalData.userInfo,
  //     hasUserInfo: true
  //   })
  //   wx.showLoading({
  //     title: '数据加载中',
  //     mask: true,
  //   })
  //   let i = 0;
  //   numDH();
  //   function numDH() {
  //     if (i < 20) {
  //       setTimeout(function () {
  //         that.setData({
  //           starCount: i,
  //           forksCount: i,
  //           visitTotal: i
  //         })
  //         i++
  //         numDH();
  //       }, 20)
  //     } else {
  //       that.setData({
  //         starCount: that.coutNum(3000),
  //         forksCount: that.coutNum(484),
  //         visitTotal: that.coutNum(24000)
  //       })
  //     }
  //   }
  //   wx.hideLoading()
  // },
  notelongTap: function (e) {
    var temp = e.currentTarget.dataset.objectid
    var flags = this.data.note_flag
    flags = !flags
    //currentId = itemData[currentId].postId
    this.setData({
      note_flag: flags,
      currentNoteId: temp
    })
    // console.log(this.data.currentNoteId)
  },
  postlongTap: function (e) {
    var temp = e.currentTarget.dataset.objectid
    console.log(e)
    var flags = this.data.post_flag
    flags = !flags
    //currentId = itemData[currentId].postId
    this.setData({
      post_flag: flags,
      currentPostId: temp
    })
  },
  hideModal(e) {
    console.log(this.data.modal_flag)
    var flag = this.data.modal_flag
    this.setData({
      modal_flag : !flag
    })
  },
  showModal(e) {
    var flag = this.data.modal_flag
    console.log(this.data.modal_flag)
    this.setData({
      modal_flag : !flag
    })
  },
  OnDeleteTap: function (e) {
    var that = this
    var deleteObjectId = e.currentTarget.dataset.objectid
    if (this.data.TabCur == 0) { //删除笔记
      this.deleteField('notes_detail', deleteObjectId).then(result => {
        wx.showToast({
          title: '删除成功！',
          icon: 'success'
        })
        this.getNotes().then(result => {
          that.setData({
            notesList: result
          })
        })
      })
    }
    if (this.data.TabCur == 1) { //删除帖子
      this.deleteField('post_detail', deleteObjectId).then(result => {
        wx.showToast({
          title: '删除成功！',
          icon: 'success'
        })
        this.getPost().then(result => {
          that.setData({
            postList: result
          })
        })
      })
    }
  },
  deleteField: function (db, id) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query(db);
      resolve(
        query.destroy(id).then(res => {
          console.log(res)
        })
      )
    })
  },
  OnChangeTap: function (e) {
    var type
    var changeId = e.currentTarget.dataset.objectid
    if (this.data.TabCur == 0) //修改笔记
      type = 'note'
    if (this.data.TabCur == 1) //修改帖子
      type = 'post'
    wx.navigateTo({
      url: '../changeDetail/changeDetail?changeid=' + changeId + '&type=' + type
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
    console.log(e)
  },
  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
    console.log(e)
  },
  // ListTouch计算滚动
  ListTouchEnd(e) {
    console.log(e)
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  coutNum(e) {
    if (e > 1000 && e < 10000) {
      e = (e / 1000).toFixed(1) + 'k'
    }
    if (e > 10000) {
      e = (e / 10000).toFixed(1) + 'W'
    }
    return e
  },
  CopyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },
  showQrcode() {
    wx.previewImage({
      urls: ['https://image.weilanwl.com/color2.0/zanCode.jpg'],
      current: 'https://image.weilanwl.com/color2.0/zanCode.jpg' // 当前显示图片的http链接      
    })
  },
})