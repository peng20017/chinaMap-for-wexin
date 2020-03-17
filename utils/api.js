export const message = {
  warning: (t) => {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: '提示',
        showCancel: !1,
        confirmColor: "#DC143C",
        content: '你的网络开小差了哦~',
        success: res => {
          if (res.confirm) {
            resolve()
          } else if (res.cancel) {
            reject()
          }
        },
        ...t
      })
    })
  }
}