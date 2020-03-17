// pages/test/test.js\
import * as echarts from '../../ec-canvas/echarts.js'
import geoJson from '../../lib/mapData.js'
/**
 * 生成1000以内的随机数
 */
function randomData() {
  return Math.round(Math.random() * 1000);
}


/**
 * 全国疫情分布地图
 */
function initChartMap(canvas, width, height, dpr) {
  let myMap = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(myMap);
  echarts.registerMap('china', geoJson);  // 绘制中国地图

  const option = {
    tooltip: {
      trigger: 'item',
        padding: [
        10,  // 上
        15, // 右
        8,  // 下
        15, // 左
      ],
      formatter: '{b}: {c}'
    },
    // tooltip: {
    //   trigger: 'item',
    //   backgroundColor: "#FFF",
    //   padding: [
    //     10,  // 上
    //     15, // 右
    //     8,  // 下
    //     15, // 左
    //   ],
    //   extraCssText: 'box-shadow: 2px 2px 10px rgba(21, 126, 245, 0.35);',
    //   textStyle: {
    //     fontFamily: "'Microsoft YaHei', Arial, 'Avenir', Helvetica, sans-serif",
    //     color: '#005dff',
    //     fontSize: 12,
    //   },
    //   renderMode: 'richText',
    //   formatter: (a) => {
    //     console.log(a)
    //     return `${a.data.name}${a.data.value}确诊<button>123</button>`
    //   }
    //   // `{b} :  {c}确诊`
    // },
    geo: [
      {
        // 地理坐标系组件
        map: "china",
        roam: false, // 可以缩放和平移
        aspectScale: 0.8, // 比例
        layoutCenter: ["50%", "38%"], // position位置
        layoutSize: 370, // 地图大小，保证了不超过 370x370 的区域
        label: {
          // 图形上的文本标签
          normal: {
            show: true,
            textStyle: {
              color: "rgba(0, 0, 0, 0.9)",
              fontSize: '8'
            }
          },
          emphasis: { // 高亮时样式
            color: "#333"
          }
        },
        itemStyle: {
          // 图形上的地图区域
          normal: {
            borderColor: "rgba(0,0,0,0.2)",
            areaColor: "#005dff"
          }
        },
        regions: [
          {
            name: "南海诸岛",
            value: 0,
            itemStyle: {
              normal: {
                opacity: 0,
                label: {
                  show: false
                }
              }
            }
          }
        ]
      }
    ],
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    visualMap: {
      min: 0,
      max: 2000,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'], // 文本，默认为数值文本
      calculable: true
      // min: 800,
      // max: 50000,
      // text: ['High', 'Low'],
      // realtime: false,
      // calculable: true,
      // inRange: {
      //   color: ['lightskyblue', 'yellow', 'orangered']
      // }
    },
    series: [
      {
        type: 'map',
        mapType: 'china',
        geoIndex: 0,
        roam: true, // 鼠标是否可以缩放
        label: {
          normal: {
            show: true
          },
          emphasis: {
            show: true
          }
        },
        data: [
          { name: '北京', value: randomData() },
          { name: '天津', value: randomData() },
          { name: '上海', value: randomData() },
          { name: '重庆', value: randomData() },
          { name: '河北', value: randomData() },
          { name: '河南', value: randomData() },
          { name: '云南', value: randomData() },
          { name: '辽宁', value: randomData() },
          { name: '黑龙江', value: randomData() },
          { name: '湖南', value: randomData() },
          { name: '安徽', value: randomData() },
          { name: '山东', value: randomData() },
          { name: '新疆', value: randomData() },
          { name: '江苏', value: randomData() },
          { name: '浙江', value: randomData() },
          { name: '江西', value: randomData() },
          { name: '湖北', value: randomData() },
          { name: '广西', value: randomData() },
          { name: '甘肃', value: randomData() },
          { name: '山西', value: randomData() },
          { name: '内蒙古', value: randomData() },
          { name: '陕西', value: randomData() },
          { name: '吉林', value: randomData() },
          { name: '福建', value: randomData() },
          { name: '贵州', value: randomData() },
          { name: '广东', value: randomData() },
          { name: '青海', value: randomData() },
          { name: '西藏', value: randomData() },
          { name: '四川', value: randomData() },
          { name: '宁夏', value: randomData() },
          { name: '海南', value: randomData() },
          { name: '台湾', value: randomData() },
          { name: '香港', value: randomData() },
          { name: '澳门', value: randomData() }
        ]
      }]
  };

  myMap.setOption(option);
  myMap.on('click', (a) => {
    console.log(a)
  })
  return myMap
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ecMap: {
      onInit: initChartMap
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  gop () {
    wx.navigateTo({
      url: '/pages/test/test',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})