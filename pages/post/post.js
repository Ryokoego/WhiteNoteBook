const app = getApp();
var Bmob = require('../../utils/Bmob-2.2.5.min.js');
var util = require('../../utils/util.js');
Bmob.initialize("dfc508a75ec17f11", "123456");
Page({
  data: {
    bgimg : 'https://ftp.bmp.ovh/imgs/2021/03/60255bf5573a1b80.png',
    likeobjId: 0,
    collectobjId: 0,
    currentId: 0,
    postliked: false,
    postcollected: false,
    postList: [],
    pagenum: 1, //初始页默认值为1
  },
  onLoad: function () {
  },
  onDetailTap: function (e) {
    var id = e.currentTarget.dataset.id;
    // console.log(e)
    wx.navigateTo({
      url: '../post_detail/post_detail?objectid=' + id,
    })
  },
  onShow: function () {
    this.tabBar();
    this.getPost()
  },
  tabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
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
    var likeid = e.currentTarget.dataset.id
    var liked = this.data.postliked
    that.setData({
      postliked: !liked,
      likeId : likeid
    })
    if (this.data.postliked) { //点赞数+1
      this.AddLikeCollectNum('post_detail', 'post_like', this.data.likeId, 1).then(result => { //封
        this.getPost().then(result => { //数据重新渲染
          that.setData({
            postList: result,
            currentId: likeid
          })
        })
        that.addLikeRelation().then(result => {})
      })
      wx.showToast({
        title: '已点赞',
        icon: 'none'
      })
    } else { //点赞数-1
      this.AddLikeCollectNum('post_detail', 'post_like', this.data.likeId, -1).then(result => {
        this.getPost().then(result => { //数据重新渲染
          that.setData({
            postList: result,
            currentId: likeid
          })
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
    var collected = this.data.postcollected
    that.setData({
      postcollected: !collected,
      collectId : collectid
    })
    if (this.data.postcollected) { //收藏数+1
      this.AddLikeCollectNum('post_detail', 'post_collect', this.data.collectId, 1).then(result => {
        this.getPost().then(result => { //数据重新渲染
          that.setData({
            postList: result,
            currentId: collectid
          })
          console.log(result)
        })
        that.addCollectRelation().then(result => {
          console.log(result)
        })
      })
      wx.showToast({
        title: '已收藏',
        icon: 'none'
      })
    } else { //收藏数-1
      this.AddLikeCollectNum('post_detail', 'post_collect', this.data.collectId, -1).then(result => {
        this.getPost().then(result => { //数据重新渲染
          that.setData({
            postList: result,
            currentId: collectid
          })
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
      const relation = Bmob.Relation('post_detail') // 需要关联的表
      const reID = relation.add([this.data.likeId,app.globalData.userid]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
      const query = Bmob.Query('_User')
      resolve(
        query.get(app.globalData.userid).then(res => {
          res.set('post_likes', reID); // 将Relation对象保存到two字段中，即实现了一对多的关联
          res.save()
          console.log(res)
          console.log(reID)
        })
      )
    })
  },
  deleteLikeRelation: function () { //删除点赞的关联的记录
    return new Promise((resolve, reject) => {
      const relation = Bmob.Relation('post_detail') // 需要关联的表
      const reID = relation.remove([ this.data.likeId,app.globalData.userid]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
      const query = Bmob.Query('_User')
      resolve(
        query.get(app.globalData.userid).then(res => {
          res.set('post_likes', reID); // 将Relation对象保存到likes字段中，即实现了一对多的关联
          res.save()
          console.log(reID)
        })
      )
    })
  },
  addCollectRelation: function () { //增加收藏的关联的记录
    return new Promise((resolve, reject) => {
      const relation = Bmob.Relation('post_detail') // 需要关联的表
      const reID = relation.add([this.data.collectId,app.globalData.userid]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
      const query = Bmob.Query('_User')
      resolve(
        query.get(app.globalData.userid).then(res => {
          res.set('post_collects', reID); // 将Relation对象保存到two字段中，即实现了一对多的关联
          res.save()
          console.log(res)
        })
      )
    })
  },
  deleteCollectRelation: function () { //删除收藏的关联的记录
    return new Promise((resolve, reject) => {
      const relation = Bmob.Relation('post_detail') // 需要关联的表
      const reID = relation.remove([ this.data.collectId,app.globalData.userid]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
      const query = Bmob.Query('_User')
      resolve(
        query.get(app.globalData.userid).then(res => {
          res.set('post_collects', reID); // 将Relation对象保存到two字段中，即实现了一对多的关联
          res.save()
          console.log(res)
        })
      )
    })
  },
  getPost : function(){
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('post_detail');
      query.limit(6); 
      resolve(
        query.find().then(res => {
          that.setData({
            postList: res
          })
        })
      )
    })
  },
  freshData: function () {
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('post_detail');
      query.skip(6); //跳过查询的前6条数据
      resolve(
        query.find().then(res => {
          // var arr1 = this.data.postList; //从data获取当前postList数组
          // console.log(arr1)
          // var arr2 = res; //从此次请求返回的数据中获取新数组
          // console.log(arr2)
          // arr1 = arr1.concat(arr2); //合并数组
          // console.log(arr1)
          that.setData({
            postList: res //合并后更新postList
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