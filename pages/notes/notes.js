const app = getApp();
var Bmob = require('../../utils/Bmob-2.2.5.min.js');
var util = require('../../utils/util.js');
Bmob.initialize("dfc508a75ec17f11", "123456");
Page({
  data: {
    bgimg : 'https://ftp.bmp.ovh/imgs/2021/03/60255bf5573a1b80.png',
    likeobjId: 0,
    collectobjId: 0,
    pagenum: 1,
    currentId: 0,
    likeId: 0,
    collectId: 0,
    notesliked: false,
    notescollected: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    notesList: []
  },
  onShow: function (options) {
    this.tabBar()
  },
  tabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  onLoad: function (options) {
    this.getNotes()
  },
  onDetailTap: function (e) {
    var id = e.currentTarget.dataset.objectid;
    var like = this.data.notesliked
    var favor = this.data.notesfavored
    wx.navigateTo({
      url: '../notes_detail/notes_detail?objectid=' + id + '&notesliked=' + like + '&notesfavored=' + favor,
    })
  },
  onCenterTap: function (e) {
    var name = e.currentTarget.dataset.name
    var pic = e.currentTarget.dataset.pic
    wx.navigateTo({
      url: '../center/other/other?name=' + name + '&pic=' + pic,
    })
  },
  onLikeTap: function (e) {
    var that = this
    var likeid = e.currentTarget.dataset.objectid
    var liked = this.data.notesliked
    that.setData({
      notesliked: !liked,
      likeId: likeid
    })
    if (this.data.notesliked) { //点赞数+1
      this.AddLikeCollectNum('notes_detail', 'notes_like', this.data.likeId, 1).then(result => { //封
        // console.log(result)
        this.getNotes().then(result => {
          that.setData({
            notesList: result,
            currentId: likeid
          })
        })
        that.setData({
          currentId: likeid
        })
        that.addLikeRelation().then(result => { //封
        })
      })
      wx.showToast({
        title: '已点赞',
        icon: 'none'
      })
    } else { //点赞数-1
      this.AddLikeCollectNum('notes_detail', 'notes_like', this.data.likeId, -1).then(result => {
        this.getNotes().then(result => {
          that.setData({
            notesList: result,
            currentId: likeid
          })
        })
        that.setData({
          currentId: likeid
        })
        that.deleteLikeRelation().then(result => { //封
        })
      })
      wx.showToast({
        title: '已取消点赞',
        icon: 'none'
      })
    }
  },
  onCollectTap: function (e) { //收藏
    var that = this
    var collectid = e.currentTarget.dataset.id
    var collected = this.data.notescollected
    that.setData({
      notescollected: !collected,
      collectId: collectid
    })
    if (this.data.notescollected) { //收藏数+1
      this.AddLikeCollectNum('notes_detail', 'notes_collect', this.data.collectId, 1).then(result => {
        this.getNotes().then(result => {
          that.setData({
            notesList: result,
            currentId: collectid
          })
          console.log(result)
        })
        that.setData({
          currentId: collectid
        })
        that.addCollectRelation().then(result => {
          console.log(result)
        })
        // that.getRelationNodes().then(result => {
        //   console.log(result)
        // })
        



      })
      wx.showToast({
        title: '已收藏',
        icon: 'none'
      })
    } else { //收藏数-1
      this.AddLikeCollectNum('notes_detail', 'notes_collect', this.data.collectId, -1).then(result => {
        this.getNotes().then(result => {
          that.setData({
            notesList: result,
            currentId: collectid
          })
          console.log(result)
        })
        that.deleteCollectRelation().then(result => {
          console.log(result)
        })
      })
      wx.showToast({
        title: '已取消收藏',
        icon: 'none'
      })
    }
  },
  // getNotes: function () { //封装(获取笔记表可见的所有记录)
  //   var that = this
  //   return new Promise((resolve, reject) => {
  //     const query = Bmob.Query('notes_detail');
  //     query.equalTo("npub", "!=", "false");
  //     query.limit(10);
  //     resolve(
  //       query.find().then(res => {
  //         that.setData({
  //           notesList: res
  //         })
  //       })
  //     )
  //   })
  // },
  AddLikeCollectNum: function (db, filed, id, num) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query(db)
      resolve(
        query.get(id).then(res => {
          res.increment(filed, num)
          res.save()
          return res
        }).catch(err => {
          console.log(err)
        })
      )
    })
  },
  addLikeRelation: function () { //增加点赞的关联的记录
    return new Promise((resolve, reject) => {
      const relation = Bmob.Relation('notes_detail') // 需要关联的表
      const reID = relation.add([this.data.likeId,app.globalData.userid]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
      const query = Bmob.Query('_User')
      resolve(
        query.get(app.globalData.userid).then(res => {
          res.set('note_likes', reID); // 将Relation对象保存到two字段中，即实现了一对多的关联
          res.save()
          console.log(res)
          console.log(reID)
        })
      )
    })
  },
  deleteLikeRelation: function () { //删除点赞的关联的记录
    return new Promise((resolve, reject) => {
      const relation = Bmob.Relation('notes_detail') // 需要关联的表
      const reID = relation.remove([ this.data.likeId,app.globalData.userid]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
      const query = Bmob.Query('_User')
      resolve(
        query.get(app.globalData.userid).then(res => {
          res.set('note_likes', reID); // 将Relation对象保存到likes字段中，即实现了一对多的关联
          res.save()
          console.log(reID)
        })
      )
    })
  },
  addCollectRelation: function () { //增加收藏的关联的记录
    return new Promise((resolve, reject) => {
      const relation = Bmob.Relation('notes_detail') // 需要关联的表
      const reID = relation.add([this.data.collectId,app.globalData.userid]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
      const query = Bmob.Query('_User')
      resolve(
        query.get(app.globalData.userid).then(res => {
          res.set('note_collects', reID); // 将Relation对象保存到two字段中，即实现了一对多的关联
          res.save()
          console.log(res)
        })
      )
    })
  },
  deleteCollectRelation: function () { //删除收藏的关联的记录
    return new Promise((resolve, reject) => {
      const relation = Bmob.Relation('notes_detail') // 需要关联的表
      const reID = relation.remove([ this.data.collectId,app.globalData.userid]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
      const query = Bmob.Query('_User')
      resolve(
        query.get(app.globalData.userid).then(res => {
          res.set('note_collects', reID); // 将Relation对象保存到two字段中，即实现了一对多的关联
          res.save()
          console.log(res)
        })
      )
    })
  },
  getNotes: function () {
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('notes_detail');
      query.equalTo("npub", "!=", "false");
      query.limit(6);
      resolve(
        query.find().then(res => {
          that.setData({
            notesList: res
          })
        })
      )
    })
  },
  freshData: function () {
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('notes_detail');
      query.skip(6); //跳过查询的前6条数据
      resolve(
        query.find().then(res => {
          that.setData({
            notesList: res //合并后更新postList
          })
        })
      )
    })
  },
  onReachBottom: function () { //触底开始下一页
    var that = this;
    var pagenum = that.data.pagenum + 1; //获取当前页数并+1
    that.setData({
      pagenum: pagenum, //更新当前页数
    })
    this.freshData()
  },
})