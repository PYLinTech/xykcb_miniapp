const DEFAULT_URL = 'https://xykcb.pylin.cn'
const { getTitle, applyNavigationBarTitle } = require('../../utils/language')
const { applyTheme } = require('../../utils/theme')

Page({
  onLoad() {
    applyTheme()
    this.setData({ url: DEFAULT_URL })
    applyNavigationBarTitle()
  },

  onShow() {
    applyTheme()
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
