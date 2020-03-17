//index.js
//获取应用实例
const app = getApp()
import mqttClient from '../../utils/mqttClient.js'
let pageStart = 1;
Page({
  data: {
    duration: 300, // swiper-item 切换过渡时间
    categoryCur: 0, // 当前数据列索引
    categoryMenu: ['菜单一', '菜单二', '菜单三', '菜单四', '菜单五'], // 分类菜单数据, 字符串数组格式
    categoryData: [{
        requesting: false,
        categoryCur: 0,
        end: false,
        emptyShow: false,
        page: 1,
        listData: []
      },
      {
        requesting: false,
        categoryCur: 1,
        end: false,
        emptyShow: false,
        page: 1,
        listData: []
      },
      {
        requesting: false,
        categoryCur: 2,
        end: false,
        emptyShow: false,
        page: 1,
        listData: []
      },
      {
        requesting: false,
        categoryCur: 3,
        end: false,
        emptyShow: false,
        page: 1,
        listData: []
      },
      {
        requesting: false,
        categoryCur: 4,
        end: false,
        emptyShow: false,
        page: 1,
        listData: []
      },
      {
        requesting: false,
        categoryCur: 5,
        end: false,
        emptyShow: false,
        page: 1,
        listData: []
      }
    ], // 所有数据列
  },
  getList(type, currentPage) {
    console.log(type, currentPage)
    // let currentCur = this.data.categoryCur;
    // let pageData = this.getCurrentData(currentCur);
    // console.log(1)
    // if (pageData.end) return;
    // pageData.requesting = true;
    // this.setCurrentData(currentCur, pageData);
    // console.log(2)
    // app.httpGet(`/wxarticle/list/${pageData.id}/${currentPage}/json`).then((res) => {
    //   let data = res.data || {
    //     datas: [],
    //     over: false
    //   };
    //   let listData = data.datas || [];
    //   pageData.requesting = false;

    //   if (type === 'refresh') {
    //     pageData.listData = listData;
    //     pageData.end = data.over;
    //     pageData.page = currentPage + 1;
    //   } else { // more
    //     pageData.listData = pageData.listData.concat(listData);
    //     pageData.end = data.over;
    //     pageData.page = currentPage + 1;
    //   }

    //   this.setCurrentData(currentCur, pageData);
    // });
  },
  // 更新页面数据
  setCurrentData(currentCur, pageData) {
    let categoryData = this.data.categoryData
    categoryData[currentCur] = pageData
    this.setData({
      categoryData: categoryData
    })
  },
  // 获取当前激活页面的数据
  getCurrentData() {
    return this.data.categoryData[this.data.categoryCur]
  },
  // 顶部tab切换事件
  toggleCategory(e) {
    console.log(e.detail)
    this.setData({
      duration: 0
    });
    setTimeout(() => {
      this.setData({
        categoryCur: e.detail.index
      });
    }, 0);
  },
  // 页面滑动切换事件
  animationFinish(e) {
    console.log('页面滑动切换事件')
    console.log(1313)

    this.setData({
      duration: 300
    });
    setTimeout(() => {
      this.setData({
        categoryCur: e.detail.current
      });
      // let pageData = this.getCurrentData();
      // // 如果加载过数据就不加载了
      // if (pageData.listData.length === 0) {
      //   this.getList('refresh', pageStart);
      // }
    }, 0);
  },
  // 刷新数据
  refresh() {
    console.log('refresh')
    const currentCur = this.data.categoryCur
    switch (currentCur) {
      case 0:
        this.getIndexList('refresh')
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break
    }
    // this.getList('refresh', pageStart);
  },
  // 加载更多
  more() {
    const currentCur = this.data.categoryCur
    switch (currentCur) {
      case 0:
        this.getIndexList('more');
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break
    }
  },
  showArticle(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success(res) {
        wx.showToast({
          icon: "none",
          title: "链接已复制到剪切板"
        })
      }
    })
    // wx.navigateTo({
    // 	url: `/pages/swipe-list/webview/index?link=${e.currentTarget.dataset.link}`
    // })
  },
  async getIndexList(type, currentCur = 0) {
    console.log(type)
    let pageData = this.getCurrentData(currentCur);
    if (pageData.requesting) {
      return
    }
    pageData.requesting = true;
    this.setCurrentData(currentCur, pageData); // loading
    setTimeout(() => { // request
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      if (type === 'refresh') {
        pageData.listData = data
        pageData.page = 1
      } else { // more
        pageData.listData = [
          ...pageData.listData,
          ...data
        ];
        pageData.page = pageData.page + 1;
      }
      pageData.requesting = false;
      pageData.end = false; // data.end
      this.setCurrentData(currentCur, pageData);
    }, 1000)
  },
  dataLoad(type) {
    const currentCur = this.data.categoryCur
    switch (currentCur) {
      case 0:
        this.getIndexList(type, currentCur)
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break
    }
  },
  onLoad() {
    setInterval(() => {
      wx.navigateTo({
        url: '/pages/test/test',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }, 2000)
    this.refresh()
    // this.getIndexList('refresh', currentCur)
    // this.dataLoad('refresh')
    // setTimeout(() => {
    //   this.refresh();
    // }, 350);
    // setTimeout(() => {
    //   this.refresh();
    // }, 350);
    // app.httpGet("/wxarticle/chapters/json").then((res) => {
    //   let menus = res.data || [];

    //   let categoryMenu = [];
    //   let categoryData = [];

    //   menus.forEach((item, index) => {
    //     categoryMenu.push(item.name.replace("&amp;", "&"));
    //     categoryData.push({
    //       id: item.id,
    //       categoryCur: index,
    //       requesting: false,
    //       end: false,
    //       emptyShow: false,
    //       page: pageStart,
    //       listData: []
    //     });
    //   });

    //   this.setData({
    //     categoryMenu,
    //     categoryData
    //   });

    //   // 第一次加载延迟 350 毫秒 防止第一次动画效果不能完全体验
    //   setTimeout(() => {
    //     this.refresh();
    //   }, 350);
    // })
  },
  // send () {
  //   const options = {
  //     equiImei: 867459048453609,
  //     sendData: [],
  //     cmdType: 0x52,
  //     _this: this,
  //     showInterval: !0,
  //     showFailTip: !1,
  //     message: '连接中',
  //     subscribePrefix: '2/5',
  //     publishPrefix: '2/3'
  //   }
  //   console.log(mqttClient)
  //   mqttClient.sendMessage(options).then((res) => {
  //     console.log('sendMessage')
  //     console.log(res)
  //     message.warning({ // 考虑用组件来控制
  //       content: '启动超时'
  //     }).then(() => {
  //       console.log('confirm')
  //     })
  //   })
  // }
})