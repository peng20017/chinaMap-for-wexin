// pages/test/test.js\
import * as echarts from '../../ec-canvas/echarts.js'
import geoJson from '../../lib/mapData.js'
import provinceMap from '../../utils/province.js'
const app = getApp()
/**
 * 生成1000以内的随机数
 */
function randomData() {
  return Math.round(Math.random() * 1000);
}
let provinceData = []
let drawProvinceName = ''
let cityList = []
let selectCity = {}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    isLoaded: false,
    isDisposed: false,
    showToolTip: true,
    toolTip: {
      x: -200,
      y: -200,
      name: '',
      value: ''
    },
    showBack: false,
    showMap: !1,
    // 地图数据
    centerPoint: {
      longitude:0,
      latitude: 0,
    },
    markers: [{
      iconPath: "/resources/others.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.chinaTool = this.data.toolTip
    this.provinceTool = this.data.toolTip
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-map');
    this.drawChina()
  },
  drawChina() {
    const defaultTip = {
      x: -200,
      y: -200,
      name: '',
      value: ''
    }
    this.setData({
      toolTip: defaultTip,
      showBack: !1
    })
    this.provinceTool = defaultTip
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);
      echarts.registerMap('china', geoJson); // 绘制中国地图

      this.setChinaOption(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false,
      });

      setTimeout(() => {
        this.setData({
          showToolTip: true
        })
      }, 500)
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  drawProvince(defaultCityList) {
    this.setData({
      toolTip: this.provinceTool,
      showBack: true
    })
    console.log(this.ecComponent)
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);
      console.log('drawProvinceName:', drawProvinceName) // todo
      echarts.registerMap(drawProvinceName, provinceData); // 绘制中国地图
      this.setProvinceOption(chart);
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  setChinaOption(chart) {
    const option = {
      // tooltip: {
      //   trigger: 'item',
      //   padding: [
      //     10,  // 上
      //     15, // 右
      //     8,  // 下
      //     15, // 左
      //   ],
      //   formatter: '{b}: {c}'
      // },
      tooltip: {
        show: false,
        trigger: 'item',
        backgroundColor: "#FFF",
        padding: [
          10, // 上
          15, // 右
          8, // 下
          15, // 左
        ],
        extraCssText: 'box-shadow: 2px 2px 10px rgba(21, 126, 245, 0.35);',
        textStyle: {
          fontFamily: "'Microsoft YaHei', Arial, 'Avenir', Helvetica, sans-serif",
          color: '#005dff',
          fontSize: 12,
        },
        renderMode: 'richText',
        formatter: (a) => {
          console.log(a)
          return `${a.data.name}${a.data.value}确诊<button>123</button>`
        }
        // `{b} :  {c}确诊`
      },
      geo: [{
        // 地理坐标系组件
        map: "china",
        roam: false, // 可以缩放和平移
        aspectScale: 0.8, // 比例
        layoutCenter: ["50%", "50%"], // position位置
        layoutSize: 370, // 地图大小，保证了不超过 370x370 的区域
        label: {
          // 图形上的文本标签
          normal: {
            show: true,
            textStyle: {
              color: "rgba(0, 0, 0, 0.9)",
              fontSize: '10'
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
        // regions: [{
        //   name: "南海诸岛",
        //   value: 0,
        //   itemStyle: {
        //     // areaColor: 'red',
        //     // color: 'red',
        //     // normal: {
        //     //   opacity: 0,
        //     //   label: {
        //     //     show: false
        //     //   }
        //     // }
        //   }
        // }]
      }],
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: {
            readOnly: false
          },
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
      series: [{
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
        data: [{
            name: '北京',
            value: randomData()
          },
          {
            name: '天津',
            value: randomData()
          },
          {
            name: '上海',
            value: randomData()
          },
          {
            name: '重庆',
            value: randomData()
          },
          {
            name: '河北',
            value: randomData()
          },
          {
            name: '河南',
            value: randomData()
          },
          {
            name: '云南',
            value: randomData()
          },
          {
            name: '辽宁',
            value: randomData()
          },
          {
            name: '黑龙江',
            value: randomData()
          },
          {
            name: '湖南',
            value: randomData()
          },
          {
            name: '安徽',
            value: randomData()
          },
          {
            name: '山东',
            value: randomData()
          },
          {
            name: '新疆',
            value: randomData()
          },
          {
            name: '江苏',
            value: randomData()
          },
          {
            name: '浙江',
            value: randomData()
          },
          {
            name: '江西',
            value: randomData()
          },
          {
            name: '湖北',
            value: randomData()
          },
          {
            name: '广西',
            value: randomData()
          },
          {
            name: '甘肃',
            value: randomData()
          },
          {
            name: '山西',
            value: randomData()
          },
          {
            name: '内蒙古',
            value: randomData()
          },
          {
            name: '陕西',
            value: randomData()
          },
          {
            name: '吉林',
            value: randomData()
          },
          {
            name: '福建',
            value: randomData()
          },
          {
            name: '贵州',
            value: randomData()
          },
          {
            name: '广东',
            value: randomData()
          },
          {
            name: '青海',
            value: randomData()
          },
          {
            name: '西藏',
            value: randomData()
          },
          {
            name: '四川',
            value: randomData()
          },
          {
            name: '宁夏',
            value: randomData()
          },
          {
            name: '海南',
            value: randomData()
          },
          {
            name: '台湾',
            value: randomData()
          },
          {
            name: '香港',
            value: randomData()
          },
          {
            name: '澳门',
            value: randomData()
          }
        ]
      }]
    };

    chart.setOption(option);
    chart.on('click', (e) => {
      const toolTip = {
        x: e.event.offsetX,
        y: e.event.offsetY,
        name: e.data.name,
        value: e.data.value
      }
      this.setData({
        toolTip
      })
      console.log(e)
    })
    chart.on('mousemove', (e) => {
      const toolTip = {
        x: e.event.offsetX,
        y: e.event.offsetY,
        name: e.data.name,
        value: e.data.value
      }
      this.setData({
        toolTip
      })
      console.log(e)
    })
  },
  setProvinceOption(chart) {
    const option = {
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: '{b}: {c}'
      },
      visualMap: {
        min: 0,
        max: 2000,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'], // 文本，默认为数值文本
        calculable: true
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: {
            readOnly: false
          },
          restore: {},
          saveAsImage: {}
        }
      },
      geo: [{
        // 地理坐标系组件
        map: drawProvinceName,
        roam: false, // 可以缩放和平移
        aspectScale: 0.8, // 比例
        layoutCenter: ["50%", "50%"], // position位置
        layoutSize: 370, // 地图大小，保证了不超过 370x370 的区域
        label: {
          // 图形上的文本标签
          normal: {
            show: true,
            textStyle: {
              color: "rgba(0, 0, 0, 0.9)",
              fontSize: '10'
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
        // regions: [{
        //   name: "南海诸岛",
        //   value: 0,
        //   itemStyle: {
        //     // areaColor: 'red',
        //     // color: 'red',
        //     // normal: {
        //     //   opacity: 0,
        //     //   label: {
        //     //     show: false
        //     //   }
        //     // }
        //   }
        // }]
      }],
      series: [{
        type: 'map',
        mapType: drawProvinceName,
        geoIndex: 0,
        roam: true, // 鼠标是否可以缩放
        label: {
          normal: {
            show: true
          },
          emphasis: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        itemStyle: {
          normal: {
            borderColor: '#389BB7',
            areaColor: '#fff',
          },
          emphasis: {
            areaColor: '#389BB7',
            borderWidth: 0
          }
        },
        animation: false,
        data: cityList
      }],
    };
    chart.on('click', (e) => {
      const toolTip = {
        x: e.event.offsetX,
        y: e.event.offsetY,
        name: e.data.name,
        value: e.data.value
      }
      this.setData({
        toolTip
      })
      // selectCity = e.data
      console.log(e)
    })
    chart.on('mousemove', (e) => {
      const toolTip = {
        x: e.event.offsetX,
        y: e.event.offsetY,
        name: e.data.name,
        value: e.data.value
      }
      this.setData({
        toolTip
      })
      console.log(e)
    })
    chart.on('mouseup', (e) => {
      console.log('mouseup')
      selectCity = e.data
      console.log(e.data)
    })
    chart.setOption(option);
  },
  checkoutDetail() {
    console.log('checkoutProvince')
    if (!this.data.showBack) { // go province
      console.log(provinceMap[this.data.toolTip.name])
      drawProvinceName = provinceMap[this.data.toolTip.name]
      this.getProvinceData(drawProvinceName, (defaultCityList) => {
        this.drawProvince()
      })
    } else { // go city
      this.setData({
        showBack: !1,
        showToolTip: !1,
        showMap: !0
      })
      this.provinceTool = this.data.toolTip
      this.setData({
        centerPoint: {
          longitude: selectCity.cp[0],
          latitude: selectCity.cp[1]
        }
      })
    }
  },
  backChart () {
    this.setData({
      showBack: !0,
      showMap: !1,
      showToolTip: !0,
      toolTip: this.provinceTool
    })
  },
  backChina () {
    this.setData({
      toolTip: this.provinceTool
    })
  },
  getProvinceData (provinceName, callback = function () {}) {
    const url = `http://sp5566.top/map/${provinceName}.json`
    app.request('get', url).then(res => {
      console.log(res)
      cityList = []
      res.features.forEach((item) => {
        cityList[cityList.length] = {
          name: item.properties.name,
          value: randomData(),
          id: item.id,
          cp: item.properties.cp
        }
      })
      provinceData = res
      callback(cityList)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})