import mqtt from '../lib/mqtt.js'
import tools from './tools.js'
import { message as Dialog } from './api.js'
export const mqttConfig = {
  head: 170,
  end: 221,
  defaultParams: {
    port: 8083,
    keepalive: 60,
    username: 'SwClient',
    password: 'swindus',
    path: '/mqtt',
  },
  url: 'wx://47.105.162.0',
  mqttOutlineMsg: '与设备服务器连接失败，请刷新或重新登录后重试',
  defaultTimeOut: 10, // 默认超时时间 s
  defaultMessage: 'loading'
}

const mqttClient = {
  ws: null,
  vm: null,
  pramas: {},
  showInterval: false,
  countdownTimer: null,
  mqttOnline: !1,
  mqttIndex: 1,
  initMqtt(props) {
    this.pramas = {
      ...mqttConfig.defaultParams,
      ...props
    }
    this.ws = mqtt.connect(mqttConfig.url, this.pramas)
    this.ws.on('connect', (e) => {
      console.log(`${this.pramas.clientId}连接成功`)
      if (!this.mqttOnline) this.mqttOnline = !0
    })
    this.ws.on('error', (e) => {
      console.log('error', e)
    })
    this.ws.on('offline', (e) => {
      if (this.mqttOnline) this.mqttOnline = !1
      console.log('offline', e)
    })
    this.ws.on('disconnect', (e) => {
      console.log('disconnect', e)
    })
    this.ws.on('close', (e) => {
      console.log('close', e)
    })
    this.ws.on('message', (topic, payload) => {
      console.log('%c收到message，解密前原始数据', 'color:#0088f5', payload)
      const data = decryptedData(payload)
      console.log(this.vm.mqttIndex, data)
      if (this.mqttIndex === data.index) { // 下标位置对应
        if (this.showInterval) {
          clearInterval(this.countdownTimer)
          wx.hideLoading()
        }
        if (this.vm.onMqttMessage) this.vm.onMqttMessage(topic, data)
      } else {
        console.warn('index位不对应')
      }
      this.mqttIndex = mqttIndex + 1
    })
  },
  end() {
    this.ws.end()
  },
  destroy() {
    if (this.showInterval) {
      clearInterval(this.countdownTimer)
      wx.hideLoading()
    }
  },
  subscribe(topic, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.mqttOnline) {
        console.log(mqttOutlineMsg)
        reject('outline')
        return false
      }
      this.ws.subscribe(topic, Object.assign({
        qos: 0
      }, options), (err) => {
        if (!err) {
          console.log('订阅成功')
          resolve()
        } else {
          console.log('订阅失败')
          reject('subscribe error')
        }
      })
    })
  },
  unsubscribe(topic, options) {
    return new Promise((resolve, reject) => {
      if (!this.mqttOnline) {
        console.log(mqttOutlineMsg)
        reject('outline')
      }
      this.ws.unsubscribe(topic, Object.assign({
        qos: 0
      }, options), (err) => {
        if (!err) {
          resolve()
          return
        } else {
          reject('unsubscribe error')
          return
        }
      })
    })
  },
	/**
	 * 自定义mqtt sendMessage (11)
	 * @param {Object} t 总数据
	 * @param {0x} cmdType 命令类型 
	 * @param {Object} t._this vue实例
	 * @param {Array} t.sendData 加密前数据
	 * @param {String} t.equiImei 设备Imei
	 * @param {Boolean} t.showInterval 展示定时器
	 * @param {Boolean} t.showFailTip 展示错误提示
	 * @param {String} t.message 信息提示
	 * @param {String} t.subscribePrefix sub前缀
	 * @param {String} t.publishPrefix pub前缀
	 * @param {Object} t.DialogOptions Dialog参数
	 * @param {Object} t.options mqtt publish options
	 * @param {Number} t.timeOut 超时时间
	 */
  sendMessage(t) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.subscribe(`${t.subscribePrefix}/${t.equiImei}`, {})
        const key = '241'
        // t.encryptedData = getEncryptedData(t.cmdType, [...t.data], key)
        const res = await this.publish({
          ...t,
          key
        })
        resolve(res)
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  },
	/**
	 * 自定义mqtt publish 参数同 sendMessage() extends { key }
	 */
  publish(data) {
    data = {
      _this: null,
      data: [],
      equiImei: '',
      showInterval: !0,
      showFailTip: !0,
      message: mqttConfig.defaultMessage,
      subscribePrefix: '2/5',
      publishPrefix: '2/3',
      DialogOptions: {
        title: '提示',
        content: '与设备连接超时',
        confirmText: '确认'
      },
      timeOut: mqttConfig.defaultTimeOut,
      options: {},
      ...data
    }
    const {
      _this,
      showInterval,
      message,
      timeOut,
      showFailTip,
      sendData,
      options,
      cmdType,
      publishPrefix,
      equiImei,
      DialogOptions,
      key
    } = data
    const topic = `${publishPrefix}/${equiImei}`
    return new Promise((resolve, reject) => {
      if (!this.mqttOnline) {
        console.error(mqttOutlineMsg)
        reject(new Error(mqttOutlineMsg))
      }
      if (_this === null || _this === undefined) {
        console.error('[this] can not be null, you should check if send vue[this]?')
      } else {
        this.vm = _this
      }
      if (topic === '' || undefined) console.error('[topic] can not be undefined')
      if (key === '' || undefined) console.error('[key] can not be undefined')
      let second = timeOut
      clearInterval(this.countdownTimer)
      if (showInterval) {
        this.showInterval = showInterval
        wx.showLoading({
          title: `${message}${second}秒`,
          mask: true
        })
      }
      this.countdownTimer = setInterval(() => {
        second--
        if (!second) { // end
          if (showInterval) wx.hideLoading()
          console.log('timeOut')
          console.log(showFailTip)
          clearInterval(this.countdownTimer)
          if (showFailTip) {
            console.log('Dialog')
            Dialog.warning(DialogOptions)
          }
          resolve({
            action: 'timeOut',
            topic
          })
        } else {
          if (showInterval) {
            wx.showLoading({
              title: `${message}${second}秒`,
              mask: true
            })
          }
        }
      }, 1000)
      console.log(new Uint8Array(getEncryptedData(cmdType, [...sendData], key)))
      this.ws.publish(topic, new Uint8Array(getEncryptedData(cmdType, [...sendData], key)), Object.assign({
        qos: 0
      }, options), (err) => {
        if (err) {
          clearInterval(countdownTimer)
          wx.hideLoading()
          Dialog.warning()({
            title: '提示',
            content: '发送信息失败'
          })
          reject({
            action: 'error'
          })
        } else {
          if (data.success) data.success()
          console.log('%c数据发送成功', 'color:#ea3800')
        }
      })

    })
  }
}

export const getEncryptedData = (cmdType, dataArray = [], license) => {
  // if (config.CMDLIST.indexOf(cmdType) === -1) {
  // 	Toast.fail(`命令类型--${cmdType}--未定义`)
  // 	return
  // }
  dataArray.forEach((element, index) => {
    dataArray[index] = +dataArray[index]
  })
  let [length, index, check] = [tools.intToTwoByte(dataArray.length + 5), tools.intToTwoByte(mqttClient.mqttIndex), 0]
  check = tools.BytesDes([...index, cmdType, ...dataArray])
    console.log(
      `
        %c🚀
        加密后数据：
        head: ${mqttConfig.head}
        length[byte]:${JSON.stringify(length)} —— length[int]: ${tools.byteToInt(length)}
        index[byte]:${JSON.stringify(index)} —— index[int]: ${tools.byteToInt(index)}
        cmd: ${cmdType}
        Data: ${dataArray}
        check: ${check}
        license: ${license}
        end: ${mqttConfig.end}
      `,
      'color:#ea3800')
  return [mqttConfig.head, ...length, ...index, cmdType, ...dataArray, check, license, mqttConfig.end]
}
/**
 * mqtt数据解密
 * @param {Array} arr
 */
export const decryptedData = (arr) => {
  arr = Array.from(arr)
  const end = arr.pop()
  const head = arr.shift()
  console.log(head, end)
  if (head === mqttConfig.head && end === mqttConfig.end) {
    let [length, index, cmdType, data, check, license] = [arr.slice(0, 2), arr.slice(2, 4), arr[4], arr.slice(5, arr.length -
      2), arr[arr.length - 2], arr[arr.length - 1]]
    length = tools.byteToInt(length)
    index = tools.byteToInt(index)
    // console.log(head, end)
      console.log(
        `
          %c🚀
          解密后数据：
          head: ${head}
          length[byte]: ${JSON.stringify(arr.slice(0, 2))}, —— length[int]: ${length},
          index[byte]: ${JSON.stringify(arr.slice(2, 4))}, —— index[int]: ${index},
          cmdType: ${cmdType},
          data: ${data},
          check: ${check},
          license: ${license},
          end: ${end}
        `,
        'color:#0088f5;')
    return {
      length,
      index,
      cmdType,
      data,
      check,
      license
    }
  } else {
    console.error('头尾错误')
  }
}

export default mqttClient