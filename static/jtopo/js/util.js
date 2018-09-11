/**
 * 获取系统路径
 * @type {{getRootPath: SysUtil.getRootPath}}
 */
var SysUtil = {
  getRootPath: function () {
    // 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href
    // 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname
    var pos = curWwwPath.indexOf(pathName, 7)
    // 获取主机地址，如： http://localhost:8083
    var localhostPath = curWwwPath.substring(0, pos)
    // 获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 2)
    return localhostPath + projectName
  }
}
// url根路径
var rootPath = SysUtil.getRootPath()
var topoImgPath = '/jtopo_topology/static/jtopo/img/'

/*
 * 生成uuid算法,碰撞率低于1/2^^122
 * @param x 0-9或a-f范围内的一个32位十六进制数
 */
function generateUUID () {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

/**
 * 计算程序执行时间
 * @type {{startTime: {}, timeSpan: number, start: Timer.start, stop: Timer.stop, getTimeSpan: Timer.getTimeSpan}}
 */
var Timer = {
  startTime: {},
  stoppedStatus: true,
  start: function () {
    if (this.stoppedStatus) {
      this.startTime = new Date()
      this.stoppedStatus = false
    }
  },
  pause: function () {
    var startTime = this.startTime
    if (startTime) {
      return new Date() - startTime
    } else {
      return -1
    }
  },
  stop: function () {
    var startTime = this.startTime
    if (startTime) {
      this.stoppedStatus = true
      return new Date() - startTime
    } else {
      this.stoppedStatus = true
      return -1
    }
  }
}
