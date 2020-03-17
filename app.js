//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // mqttClient.initMqtt({ clientId: `C${}${new Date().getTime()}` })
  },
  baseUrl: 'https://www.wanandroid.com',
  globalData: {
    userInfo: null
  },
  httpGet: function (url, data, loading, loadingMsg) {
    return this.httpBase("GET", url, data, loading, loadingMsg);
  },
  httpBase: function (method, url, data, loading = false, loadingMsg) {
    let _this = this;

    let requestUrl = this.baseUrl + url;

    if (loading) {
      wx.showLoading({
        title: loadingMsg || '提交中...',
        mask: true
      });
    } else {
      wx.showNavigationBarLoading()
    }

    function request(resolve, reject) {
      wx.request({
        header: {
          'Content-Type': 'application/json'
        },
        method: method,
        url: requestUrl,
        data: data,
        success: function (result) {
          if (loading) {
            wx.hideLoading();
          } else {
            wx.hideNavigationBarLoading()
          }

          let res = result.data || {};
          let code = res.errorCode;

          if (code !== 0) {
            reject(res);
            if (res.message) {
              wx.showToast({
                title: res.message,
                icon: 'none'
              });
            }
          } else {
            resolve(res);
          }
        },
        fail: function (res) {
          reject(res);
          if (loading) {
            wx.hideLoading();
          } else {
            wx.hideNavigationBarLoading()
          }
          wx.showToast({
            title: '网络出错',
            icon: 'none'
          });
        }
      })
    }
    return new Promise(request);
  },
  request(method, url, data = {}, loading = false, loadingMsg = 'loading...') {
    return new Promise((resolve, reject) => {
      if (loading) {
        wx.showLoading({
          title: loadingMsg,
          mask: true
        });
      } else {
        wx.showNavigationBarLoading()
      }
      wx.request({
        header: {
          'Content-Type': 'application/json'
        },
        method: method,
        url,
        data: data,
        success: function (result) {
          if (loading) {
            wx.hideLoading();
          } else {
            wx.hideNavigationBarLoading()
          }
          if(result.statusCode === 200) {
            const res = result.data || {};
            resolve(res);
          } else {
            wx.showToast({
              title: '出错了',
              icon: 'none'
            });
            reject(res);
          }
          // let code = res.errorCode;
          // if (code !== 0) {
          //   reject(res);
          //   if (res.message) {
          //     wx.showToast({
          //       title: res.message,
          //       icon: 'none'
          //     });
          //   }
          // } else {
          // }
        },
        fail: function (res) {
          reject(res);
          if (loading) {
            wx.hideLoading();
          } else {
            wx.hideNavigationBarLoading()
          }
          wx.showToast({
            title: '网络出错',
            icon: 'none'
          });
        }
      })
    })
  }
})