/**
 * Created by SongPeng on 2019-5-31
 */
export default {
	/**
	 * 十六进制字符串转字节数组
	 * 每2个字符串转换
	 * 100102030405060708 转为 [16, 1, 2, 3, 4, 5, 6, 7, 8]
	 * @param {String} str 符合16进制字符串
	 */
  Str2Bytes(str) {
    var pos = 0
    var len = str.length
    if (len % 2 !== 0) {
      return null
    }
    len /= 2
    var hexA = []
    for (var i = 0; i < len; i++) {
      var s = str.substr(pos, 2)
      var v = parseInt(s, 16)
      hexA.push(v)
      pos += 2
    }
    return hexA
  },
	/**
	 * 字节数组转十六进制字符串
	 * [16, 1, 2, 3, 4, 5, 6, 7, 8] 转换 100102030405060708
	 * @param {Array} arr 符合16进制数组
	 */
  Bytes2Str(arr) {
    var str = ''
    for (var i = 0; i < arr.length; i++) {
      // var tmp = arr[i].toString(16)
      var tmp = this.toHex(arr[i])
      if (tmp.length === 1) {
        tmp = '' + tmp
      }
      str += tmp
    }
    return str
  },
	/**
	 * 数组进行异或
	 * @param {Array} arr 数组
	 */
  BytesDes(arr) {
    console.log(123123)
    console.log(arr)
    var des = arr[0]
    for (var i = 1; i < arr.length; i++) {
      des ^= arr[i]
    }
    return des
  },
	/**
	 * 十六进制数组转十进制数组
	 * @param {Array} arr 十六进制数组
	 */
  Array16to10(arr) {
    var list = []
    arr.forEach(element => {
      list = [
        ...list,
        ...this.Str2Bytes(element)
      ]
    })
    return list
  },
	/**
	 * 十进制数组转十六进制数组
	 * @param {Array} arr 十进制数组
	 */
  Array10to16(arr) {
    var list = []
    arr.forEach(element => {
      list[list.length] = this.toHex(element)
    })
    return list
  },
	/**
	 * 十进制转十六进制字符串
	 * 15 转 0F
	 * @param {Number} num 十进制数字
	 */
  toHex(num) {
    if (num <= 255) {
      return ('0' + (Number(num).toString(16))).slice(-2).toUpperCase()
    } else {
      var str = num.toString(16)
      if (str.length === 3) {
        return '0' + str
      } else {
        return str
      }
    }
  },
	/**
	 * byte数组 转 int
	 * @param {Array} arr
	 */
  byteToInt(arr) {
    let [all, int] = ['', 0]
    arr.forEach(value => {
      value = value.toString(2)
      if (value.length < 8) {
        for (let i = 0; i < 10; i++) {
          value = '0' + value
          if (value.length === 8) {
            i = 10
          }
        }
      }
      all = all + value
    })
    for (let o = 0; o < all.length; o++) {
      int = int + +all[o] * Math.pow(2, all.length - o - 1)
    }
    return int
  },
	/**
	 * int 转 两位byte数组
	 * @param {Array} arr
	 */
  intToTwoByte(int) {
    console.log(int)
    let arr = []
    if (int <= 255) {
      arr = [0, int]
    } else {
      arr = this.Str2Bytes(this.toHex(int))
    }
    return arr
  },
	/**
	 * int 转 byte数组
	 * @param {Number} int
	 * @param {number} len 需要转换成几个byte
	 */
  intToByte(int, len = 1) {
    let arr = this.Str2Bytes(this.toHex(int))
    let arrLen = arr.length
    if (arrLen < len) {
      for (let i = 0; i < len - arrLen; i++) {
        arr.unshift(0)
      }
    }
    return arr
  },
	/**
	 * 扇区计算
	 * @param {Number} int 180
	 */
  dealSector(number, int = 180) {
    if (number <= int) {
      return 1
    } else {
      if (number % int == 0) {
        return parseInt(number / int)
      } else {
        return parseInt(number / int) + 1
      }
    }
  },
	/**
	 * 深拷贝
	 * @param {*} obj
	 */
  clone(obj) {
    let objClone = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] && typeof obj[key] === 'object') {
            objClone[key] = this.clone(obj[key])
          } else {
            objClone[key] = obj[key]
          }
        }
      }
    }
    return objClone
  }
}


