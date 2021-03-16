var Bmob = require('../../utils/Bmob-2.2.5.min.js');
var util = require('../../utils/util.js'); //获取时间
Bmob.initialize("dfc508a75ec17f11", "123456");
var app = getApp();
Page({
  data: {
    bgimg : 'https://ftp.bmp.ovh/imgs/2021/03/60255bf5573a1b80.png',
    title: '',
    tab: [],
    public: true,
    content: '',
    choose_iisue: ['创建笔记', '创建帖子'],
    textareaAValue: '',
    imgList: [],
    TabCur: 0,
    scrollLeft: 0
  },
  onShow: function (options) {
    this.tabBar();

  },
  onLoad(options) {

  },
  tabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    // console.log(this.data.TabCur)
  },
  ChooseImage() {
    // wx.chooseImage({
    //   count: 4, //默认9
    //   sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album'], //从相册选择
    //   success: (res) => {
    //     if (this.data.imgList.length != 0) {
    //       this.setData({
    //         imgList: this.data.imgList.concat(res.tempFilePaths)
    //       })
    //     } else {
    //       this.setData({
    //         imgList: res.tempFilePaths
    //       })
    //     }
    //   }
    // });
    wx.chooseImage({
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        var file;
        for (let item of tempFilePaths) {
          console.log('itemn',item)
          file = Bmob.File('abc.jpg', item);
        }
        file.save().then(res => {
          console.log(res.length);
          console.log(res);
        })

      }
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '照片',
      content: '确定要删除这张照片吗？',
      cancelText: '再想想',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  getTitle(e) {
    this.setData({
      title: e.detail.value
    })
  },
  getTab(e) {
    var result = e.detail.value
    var a = result.split(" ")
    this.setData({
      tab : a
    })
    if(a.length==1&&a.length!=0){
      var a = result.split(",")
      this.setData({
        tab : a
      })
    }
    // console.log(this.data.tab)
  },
  switchChange: function (e) {
    // var checkedValue = e.detail.value;
    // console.info("当前开关按钮是否打开："+checkedValue);
    this.setData({
      public: e.detail.value
    })
  },
  getContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  formsubmit1: function () {
    if(this.data.TabCur==0){ //是上传笔记
      const query = Bmob.Query('notes_detail');
      query.set("username", app.globalData.username) //用户名 
      query.set("userPic", app.globalData.userInfo.avatarUrl) //用户头像
      query.set("npub", this.data.public) //是否公开
      query.set("notes_content", this.data.content) //笔记内容
      query.set("notes_title", this.data.title) //笔记标题
      query.set("notesPic", this.data.imgList) //笔记图片
      query.set("notes_tag", this.data.tab) //笔记标签
      query.set("notes_like", 0) //点赞数
      query.set("notes_collect", 0) //收藏数
      query.save().then(res => {
        console.log(res)
        wx.showToast({
          title: '发布成功',
          icon: 'success'
        })
        wx.switchTab({
          url: '../notes/notes',
        })
      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: '发布失败！'
        })
      })
    }
   
  },
  formsubmit2:function(){
    if(this.data.TabCur==1){ //是上传帖子
      const query = Bmob.Query('post_detail');
      query.set("username", app.globalData.username) //用户名 
      query.set("userPic", app.globalData.userInfo.avatarUrl) //用户头像
      query.set("post_content", this.data.content) //笔记内容
      query.set("post_title", this.data.title) //笔记标题
      query.set("post_img", this.data.imgList) //笔记图片
      query.set("post_tag", this.data.tab) //笔记标签
      query.set("post_like", 0) //点赞数
      query.set("post_collect", 0) //收藏数
      query.save().then(res => {
        console.log(res)
        wx.showToast({
          title: '发布成功',
          icon: 'success'
        })
        wx.switchTab({
          url: '../post/post',
        })
      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: '发布失败！',
          icon: 'success'
        })
      })
    }
  },
  onCacelTap : function(){
    wx.switchTab({
      url: '../index/index',
    })
  }
})