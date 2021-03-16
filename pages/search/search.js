var Bmob = require('../../utils/Bmob-2.2.5.min.js');
Bmob.initialize("dfc508a75ec17f11", "123456");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: false,
    current_name: '未选择',
    item_name: [
      '图书',
      '影视',
      '音乐',
      '其他'
    ],
    inpuVal: "",//input框内值
    listarr: [],//创建数组
    SearchText: '取消',//按钮变动值
    keydown_number: 0,//检测input框内是否有内容
    input_value: "",//value值
    hostarr: [],//热门搜索接收请求存储数组  
    name_focus: true//获取焦点
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const query = Bmob.Query("user");
    query.find().then(res => {
    console.log(res)
});
  },
  //一旦有输入的值，搜索变为取消
  inputvalue: function (e) { 
    this.setData({
      inputVal: e.detail.value
    })
    if (e.detail.cursor != 0) {
      this.setData({
        SearchText: "搜索",
        keydown_number: 1
      })
    } else {
      this.setData({
        SearchText: "取消",
        keydown_number: 0
      })
    }
  },
  //搜索方法
  OnsearchTap: function () {
    // wx.navigateTo({
    //   url: '../Search_Result/Search_Result.js',//未改好跳转
    // })
    if (this.data.keydown_number == 1) {
      let This = this;
      //把获取的input值插入数组里面
      let arr = this.data.listarr;
      //console.log(this.data.inputVal)
      //console.log(this.data.input_value)
      //判断取值是手动输入还是点击赋值
      if (this.data.input_value == "") {
        // console.log('进来第er个')
        // 判断数组中是否已存在
        let arrnum = arr.indexOf(this.data.inputVal);
       // console.log(arr.indexOf(this.data.inputVal));
        if (arrnum != -1) {
          // 删除已存在后重新插入至数组
          arr.splice(arrnum, 1)
          arr.unshift(this.data.inputVal);
        } else {
          arr.unshift(this.data.inputVal);
        }
      } else {
        //console.log('进来第一个')
        let arr_num = arr.indexOf(this.data.input_value);
        //console.log(arr.indexOf(this.data.input_value));
        if (arr_num != -1) {
          arr.splice(arr_num, 1)
          arr.unshift(this.data.input_value);
        } else {
          arr.unshift(this.data.input_value);
        }

      }
     // console.log(arr)
      //存储搜索记录
      wx.setStorage({
        key: "list_arr",
        data: arr
      })
      //取出搜索记录
      wx.getStorage({
        key: 'list_arr',
        success: function (res) {
          This.setData({
            listarr: res.data
          })
        }
      })
      this.setData({
        input_value: '',
      })
    } else {
      //console.log("取消")
    }

  },
  //清除搜索记录
  delete_list: function () {
    //清除当前数据
    this.setData({
      listarr: []
    });
    //清除缓存数据
    wx.removeStorage({
      key: 'list_arr'
    })
  },
  //点击赋值到input框
  this_value: function (e) {
    this.setData({
      name_focus: true
    })
    let value = e.currentTarget.dataset.text;
    this.setData({
      input_value: value,
      SearchText: "搜索",
      keydown_number: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let This = this;
    //设置当前页标题
    wx.setNavigationBarTitle({
      title: '搜索'
    });
    //读取缓存历史搜索记录
    wx.getStorage({
      key: 'list_arr',
      success: function (res) {
        This.setData({
          listarr: res.data
        })
      }
    })
    // //请求热门搜索
    // wx.request({
    //   url: 'http://192.168.1.222:8081/StaticPage/list.json', //仅为示例，并非真实的接口地址
    //   method: 'GET',
    //   data: {},
    //   success: function (res) {
    //     This.setData({
    //       hostarr: res.data.History
    //     })
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })
  },
  OnMySelectTap: function (e) {
    //console.log(e)
    var name = e.currentTarget.dataset.name
    this.setData({
      current_name: name,
      selected: false
    })
  },
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  OnSelectMenu: function () {
    this.setData({
      selected: !this.data.selected
    })
  },
})