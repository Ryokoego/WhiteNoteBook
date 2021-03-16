var Bmob = require('../../utils/Bmob-2.2.5.min.js');
Bmob.initialize("dfc508a75ec17f11", "123456");
Page({
  data: {
    comment_content : null,
    cardCur: 0,
    liuyanlist : null,
    swiperList : [],
    postList : []
  },
  bindblur:function(e){
    // console.log('1111111:', e.detail.value)
    bindblur = e.detail.value;
  },
  formSubmit: function (e) {
    wx.showToast({
      title: '已留言',
      icon: 'success'
    })
    var that = this;
    var liuyantext = e.detail.value.liuyantext; //获取表单所有name=liuyantext的值 
    var nickName = e.detail.value.nickname; //获取表单所有name=nickName的值 
    var headimg = e.detail.value.headimg; //获取表单所有name=headimg的值 
  },

  onLoad(options) {
    var _that = this
    this.towerSwiper('swiperList');
    var _that = this
    const query = Bmob.Query('post_detail');
    query.get(options.objectid).then(res => {
        _that.setData({
          postList: res,
          swiperList : res.post_img
        })
    }).catch(err => {
        console.log(err)
    });

    //留言列表
    const query2 = Bmob.Query("comment_detail");
    query2.find().then(res => {
        // console.log(res)
        _that.setData({
            liuyanlist: res
        })
    });
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    //console.log(list)
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
})