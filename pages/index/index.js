const DEFAULT_URL = 'https://xykcb.pylin.cn'
const { getTitle, applyNavigationBarTitle } = require('../../utils/language')

Page({
  onLoad() {
    this.setData({ url: DEFAULT_URL })
    applyNavigationBarTitle()
  },

  onShow() {
    applyNavigationBarTitle()
  },

  onShareAppMessage() {
    return {
      title: getTitle(),
      path: '/pages/index/index'
    }
  },

  onShareTimeline() {
    return {
      title: getTitle()
    }
  }
})
