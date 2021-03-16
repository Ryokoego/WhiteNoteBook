Component({
  properties: {

  },
  data: {
    selected:0,
    tabList:[
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/notes/notes",
        "text": "笔记"
      },
      {
        "pagePath": "pages/issue/issue",
        "text": "发布"
      },
      {
        "pagePath": "pages/post/post",
        "text": "帖子"
      },
      {
        "pagePath": "pages/auth/auth",
        "text": "我的"
      }
    ]
  },
  methods: {
    switchTab(e){
      // console.log(this.data)
      let key = Number(e.currentTarget.dataset.index);
      let tabList = this.data.tabList;
      let selected = this.data.selected;

      if(selected !== key){
        this.setData({
          selected:key
        });
        wx.switchTab({
          url: `/${tabList[key].pagePath}`,
        })
      }
    }
  }
})

