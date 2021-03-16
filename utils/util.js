var Bmob = require('/Bmob-2.2.5.min.js');
Bmob.initialize("dfc508a75ec17f11", "123456");
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  console.log(year)
  const month = date.getMonth() + 1
  console.log(month)
  const day = date.getDate()
  console.log(day)

  return [year, month, day].map(formatNumber).json('-')
}

function getNotes() { //封装(获取笔记表可见的所有记录)
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('notes_detail');
    query.equalTo("npub", "!=", "false");
    query.limit(10);
    resolve(
      query.find().then(res => {
        // console.log(res)
        return res;
      })
    )
  })
}


function getPost() { //封装(获取帖子表的所有记录)
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('post_detail');
    query.limit(10);
    resolve(
      query.find().then(res => {
        return res;
      })
    )
  })
}

function getspecifiedNotePost(db, username) { //封装(获取某个用户笔记/帖子表的所有记录)
  return new Promise((resolve, reject) => {
    const query = Bmob.Query(db);
    query.select('username');
    query.limit(10);
    resolve(
      query.find().then(res => {
        console.log(res)
        // return res;
      })
    )
  })
}

function AddLikeCollectNum(db, filed, id, num) { //封装(自增/减指定列(点赞数)的值)
  return new Promise((resolve, reject) => {
    const query = Bmob.Query(db)
    resolve(
      query.get(id).then(res => {
        res.increment(filed, num)
        res.save()
        return res; //返回一条记录
      }).catch(err => {
        console.log(err)
      })
    )
  })
}

// function getPostDetail() { //获取帖子表可见的所有记录
//   return new Promise((resolve, reject) => {
//     const query = Bmob.Query('post_detail');
//     query.limit(10); //限制十条
//     resolve(
//       query.find().then(res => {
//         const result = res;
//         return result;
//       })
//     )
//   })
// }


function addCollect(type, id, username) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('collect_detail');
    query.set("type", type)
    query.set("note_post_objectId", id)
    query.set("username", username)
    resolve(
      query.save().then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    )
  })
}

function addField(db) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query(db)
    query.set("name", "Bmob")
    query.set("cover", "后端云")
    resolve(
      query.save().then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    )
  })
}

function deleteField(db, objectId) { //删除以objectId为主键的db表
  return new Promise((resolve, reject) => {
    const query = Bmob.Query(db);
    resolve(
      query.destroy(objectId).then(res => {
        // console.log(res)
      }).catch(err => {
        console.log(err)
      })
    )
  })
}


function goToTap(type, id) {
  switch (type) {
    case 1:
      wx.switchTab({
        url: '../index/index',
      });
      break;
    case 2:
      wx.switchTab({
        url: '../notes/notes',
      });
      break;
    case 3:
      wx.switchTab({
        url: '../issue/issue',
      });
      break;
    case 4:
      wx.switchTab({
        url: '../post/post',
      });
      break;
    case 5:
      wx.switchTab({
        url: '../auth/auth',
      })
      break;
  }

}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  // promise : promise
  getNotes: getNotes,
  getPost: getPost,
  // getNotesDetail: getNotesDetail,
  AddLikeCollectNum: AddLikeCollectNum,
  // addLike: addLike,
  addCollect: addCollect,
  addField: addField,
  deleteField: deleteField,
  getspecifiedNotePost: getspecifiedNotePost
}