/**
 *
 * 配套视频教程请移步微信->小程序->灵动云课堂
 * 关注订阅号【huangxiujie85】，第一时间收到教程推送
 *
 * @link http://blog.it577.net
 * @author 黄秀杰
 */


/* 聊天窗口
 * 其中54px为回复框高度，css同
 * mode true为文本，false为语音
 * cancel true为取消录音，false为正常录音完毕并发送
 * 上拉超过50px为取消发送语音
 * status 0为normal，1为pressed，2为cancel
 * hud的尺寸是150*150
 */
var Bmob = require('../../utils/Bmob-2.2.5.min.js');
Bmob.initialize("dfc508a75ec17f11", "123456","fe13728d9425cdb5ac91a79ddae1a5a6");
var that;
Page({
  data: {
    message_list: [],
    user_list: [],
    scroll_height: getApp().screenHeight - 54,
    page_index: 0,
    page_size: 10,
    mode: true,
    cancel: false,
    status: 0,
    tips: ['按住 说话', '松开 结束', '取消 发送'],
    state: {
      'normal': 0,
      'pressed': 1,
      'cancel': 2
    },
    hud_top: (getApp().screenHeight - 180) / 2,
    hud_left: (getApp().screenWidth - 150) / 2,
    current_user: {}
  },
  onLoad: function (options) {
    that = this;
    that.setData({
      mpid: options.mpid,
      fans_id: options.to_uid,
      verify_type: options.verify_type,
      current_user: Bmob.User.current()
    });
    that.getMessages(options.mpid, options.to_uid, that.data.page_index);
    // that.getDemoMessages();
    // 存储会话双方id
    that.setData({
      mpid: options.mpid,
      to_uid: options.to_uid
    });
  },
  scrollToBottom: function () {
    that.setData({
      toView: 'row_' + (that.data.message_list.length - 1)
    });
  },
  getMessages: function (mpid, to_uid, page_index) {
    // 获取聊天记录
    // var Chat = Bmob.Object.extend("Chat");
    var query = new Bmob.Query(Chat);
    query.limit(that.data.page_size);
    query.include('user');
    query.skip(that.data.page_index * that.data.page_size);
    query.descending('updatedAt');
      // 排序按照创建日期
      query.find({
        success: function(result) {
          // 反转
          result = result.reverse();
          // 保存数据
          var user_list = [];
          result.forEach(function (item, index) {
            user_list[index] = item.get('user');
          });

          that.setData({
            message_list: result.concat(that.data.message_list),
            user_list: user_list.concat(that.data.user_list)
          });
          // 滚动到底部，必须在网络请求后回调，不能在onLoad中请求
          if (page_index == 0) {
            that.scrollToBottom();
          }
      },
      error: function(object, error) {
          // 查询失败
          console.log(error);
        }
      });
  },
  reply: function (e) {
    var content = e.detail.value;
    if (content == '') {
      wx.showToast({
        title: '总要写点什么吧'
      });
      return ;
    }
    // 清空文本
    that.setData({
      content: ''
    });
    // 发送聊天文本
    // var Chat = Bmob.Object.extend("Chat");
    var chat = new Chat();
    chat.set("content", content);
    chat.set("msg_type", "text");
    chat.set("user", Bmob.User.current());
    //添加数据，第一个入口参数是null
    chat.save(null, {
        success: function(result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            // console.log("日记创建成功, objectId:"+result.id);
            wx.showToast({
              title: '发送成功'
            });
            that.pushMessage(result);
            that.scrollToBottom();
        },
        error: function(result, error) {
          // 添加失败
          console.log('提交失败');
        }
    });
  },
  pushMessage: function (message) {
    // 聊天记录添加一行刚刚发送的内容本身，更佳的方案是由服务端返回
    var message_list = that.data.message_list;
    message_list.push(message);
    that.setData({
      message_list: message_list
    });
  },
  loadMore: function () {
    var page_index = that.data.page_index;
    that.setData({
      page_index: ++page_index
    });
    that.getMessages(that.data.mpid, that.data.fans_id, that.data.page_index);
  },
  chooseImage: function () {
    // 选择图片供上传
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'], 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths);
        // 遍历多图
        // tempFilePaths.forEach(function (tempFilePath) {
        //   that.upload(tempFilePath, 'image');
        // });
        that.upload(tempFilePaths, 'image');
      }
    })
  },
  preview: function (e) {
    // 当前点击图片的地址
    var src = e.currentTarget.dataset.src;
    // 遍历出使用images
    var images = [];
    that.data.message_list.forEach(function (message) {
      if (message != null && message.get('msg_type') == 'image') {
        images.push(message.get('content'));
      }
    });
    // 预览图片
    wx.previewImage({
      urls: images,
      current: src
    });
  },
  switchMode: function () {
    // 切换语音与文本模式
    that.setData({
      mode: !that.data.mode
    });
  },
  record: function () {
    // 录音事件
    wx.startRecord({
      success: function(res) {
        if (!that.data.cancel) {
          that.upload(res.tempFilePath, 'voice');
        }
      },
      fail: function(res) {
        console.log(res);
         //录音失败

      },complete: function (res) {
        console.log(res);
        
      }
    })
  },
  stop: function () {
    wx.stopRecord();
  },
  touchStart: function (e) {
    // 触摸开始
    var startY = e.touches[0].clientY;
    // 记录初始Y值
    that.setData({
      startY: startY,
      status: that.data.state.pressed
    });
  },
  touchMove: function (e) {
    // 触摸移动
    var movedY = e.touches[0].clientY;
    var distance = that.data.startY - movedY;
    // console.log(distance);
    // 距离超过50，取消发送
    that.setData({
      status: distance > 50 ? that.data.state.cancel : that.data.state.pressed
    });
  },
  touchEnd: function (e) {
    // 触摸结束
    var endY = e.changedTouches[0].clientY;
    var distance = that.data.startY - endY;
    // console.log(distance);
    // 距离超过50，取消发送
    that.setData({
      cancel: distance > 50 ? true : false,
      status: that.data.state.normal
    });
    // 不论如何，都结束录音
    that.stop();
  },
  upload: function (tempFilePaths, type) {
    // 开始上传
    // wx.showLoading({
    //   title: '发送中'
    // });
    wx.showNavigationBarLoading()
    that.setData({
      loading: false
    })
    console.log(tempFilePaths)
    var imgLength = tempFilePaths.length;
    if (imgLength > 0) {
      var newDate = new Date();
      var newDateStr = newDate.toLocaleDateString();
      //如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
      for (var i = 0; i < imgLength; i++) {
        var tempFilePath = [tempFilePaths[i]];
        var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
        if (extension) {
          extension = extension[1].toLowerCase();
        }
        var name = newDateStr + "." + extension;//上传的图片的别名      

        var file = new Bmob.File(name, tempFilePath);
        file.save().then(function (res) {
          // console.log(res);
          wx.hideNavigationBarLoading()
          // wx.hideToast();
          var url = res.url();
          var message = new Bmob.Object("Chat");
          message.set('user', Bmob.User.current());
          message.set('content', url);
          message.set('msg_type', 'image');
          that.pushMessage(message);
          that.scrollToBottom();
          message.save().then(function (res) {
            console.log(res);
          }, function (error) {
            console.log(error);
          });
        }, function (error) {
          console.log(error)
        });
      }
    }
  }
})


