const app = getApp()
var Bmob = require('../../utils/Bmob-2.2.5.min.js');
var util = require('../../utils/util.js');
Bmob.initialize("dfc508a75ec17f11", "123456");
Page({
  data: {
    bgimg : 'https://ftp.bmp.ovh/imgs/2021/03/60255bf5573a1b80.png',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    notesList : [],
    postList : [],
    MainCur: 0,
    VerticalNavTop: 0,
    list: [{name:'笔记',id:0},{name:'帖子',id:1}],
    load: true
  },
  onShow: function () {
    this.tabBar() ;
    // console.log('show:hi')
  },
 
  //事件处理函数
  bindViewTap: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  onSearchTap:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  onCenterTap: function (e) {
    var name = e.currentTarget.dataset.name
    var pic = e.currentTarget.dataset.pic
    wx.navigateTo({
      url: '../center/other/other?name=' + name + '&pic=' + pic,
    })
  },
  onDetailTap: function (e) {
    var id = e.currentTarget.dataset.objectid;
    wx.navigateTo({
      url: '../notes_detail/notes_detail?objectid=' + id ,
    })
  },
  onLoad: function (options) {
    this.tabBar() ;
    // let list = [{}];
    // for (let i = 0; i < 26; i++) {
    //   list[i] = {};
    //   list[i].name = String.fromCharCode(65 + i);
    //   list[i].id = i;
    // }
    // this.setData({
    //   list: list,
    //   listCur: list[0]
    // })
    // console.log(this.data.list)
    this.getNotes()
    this.getPost()
  },
  tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected:0
      })
    }
  },
  getNotes: function () { //获取所有用户发表的笔记(按照点赞数排列)
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('notes_detail');
      query.equalTo("npub", "!=", "false");
      query.order("notes_like");
      query.limit(10)
      resolve(
        query.find().then(res => {
          that.setData({
            notesList: res
          })
          // console.log(res)
        })
      )
    })
  },
  getPost: function () { //获取当前用户发表的帖子
    var that = this
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('post_detail');
      query.order("post_like");
      resolve(
        query.find().then(res => {
          that.setData({
            postList: res
          })
        })
      )
    })
  },


  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  }
})


