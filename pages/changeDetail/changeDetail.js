var Bmob = require('../../utils/Bmob-2.2.5.min.js');
var util = require('../../utils/util.js'); //获取时间
Bmob.initialize("dfc508a75ec17f11", "123456");
var app = getApp();
Page({
  data: {
    bgimg: 'https://ftp.bmp.ovh/imgs/2021/03/60255bf5573a1b80.png',
    title: '',
    tab: [],
    public: true,
    changeId: '',
    type: '',
    content: '',
    // choose_iisue: ['创建笔记', '创建帖子'],
    textareaAValue: '',
    imgList: [],
    scrollLeft: 0,
    notesList: [],
    postList: [],
    tagList: ''
  },
  onShow: function (options) {
    this.tabBar();
  },
  onLoad(options) {
    var type = options.type
    var changeid = options.changeid
    console.log(options.changeid)
    this.setData({
      type: type,
      changeId: changeid
    })
    if (this.data.type == 'note') {
      this.getNoteDetail(changeid).then(res => {
        console.log(res)
      })
    } else {
      this.getPostDetail(changeid).then(res => {
        console.log(res)
      })
    }
  },
  getNoteDetail: function (changeid) {
    var taglist = ''
    const query = Bmob.Query('notes_detail');
    return new Promise((resolve, reject) => {
      resolve(
        query.get(changeid).then(res => {
          this.setData({
            title: res.notes_title,
            content: res.notes_content,
            public: res.npub,
            imgList: res.notesPic
          })
          var temp = res.notes_tag
          for (var i = 0; i < temp.length; i++) {
            taglist = taglist.concat(temp[i])
            taglist = taglist.concat(' ')
          }
          this.setData({
            tagList: taglist
          })
        })
      )
    })
  },
  getPostDetail: function (changeid) {
    var taglist = ''
    const query = Bmob.Query('post_detail');
    return new Promise((resolve, reject) => {
      resolve(
        query.get(changeid).then(res => {
          this.setData({
            title: res.post_title,
            content: res.post_content,
            imgList: res.post_img
          })
          var temp = res.post_tag
          for (var i = 0; i < temp.length; i++) {
            taglist = taglist.concat(temp[i])
            taglist = taglist.concat(' ')
          }
          this.setData({
            tagList: taglist
          })
        })
      )
    })
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
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });

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
      tab: a
    })
    if (a.length == 1 && a.length != 0) {
      var a = result.split(",")
      this.setData({
        tab: a
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
  formsubmit: function () {
    if (this.data.type == 'note') { //修改笔记
      const query = Bmob.Query('notes_detail');
      query.get(this.data.changeId).then(res => {
        res.set('npub', this.data.public) //是否公开
        res.set('notes_content', this.data.content) //笔记内容
        res.set('notes_title', this.data.title) //笔记标题
        res.set('notesPic', this.data.imgList) //笔记图片
        res.set('notes_tag', this.data.tab) //笔记标签
        res.save().then(result => {
          // console.log(result)
        })
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration : 3000
        })
      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: '修改失败！'
        })
      })

    } else if (this.data.type == 'post') {
      const query = Bmob.Query('post_detail');
      query.get(this.data.changeId).then(res => {
        res.set('post_content', this.data.content) //笔记内容
        res.set('post_title', this.data.title) //笔记标题
        res.set('post_img', this.data.imgList) //笔记图片
        res.set('post_tag', this.data.tab) //笔记标签
        res.save().then(result => {
          // console.log(result)
        })
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration : 3000
        })
      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: '修改失败！'
        })
      })
    }
  },
  onCancelTap: function () {
    wx.switchTab({
      url: '../auth/auth',
    })
  }
})