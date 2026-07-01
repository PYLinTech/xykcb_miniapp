const DEFAULT_URL = 'https://xykcb.pylin.cn'

const TITLE_MAP = {
  'zh_CN': '小雨课程表',
  'en': 'Xiaoyu Schedule'
}

const getTitle = () => {
  const lang = wx.getSystemInfoSync().language
  return TITLE_MAP[lang] || TITLE_MAP['zh_CN']
}

const decodeParam = (value) => {
  if (!value) return ''
  try {
    return decodeURIComponent(value)
  } catch (e) {
    return ''
  }
}

Page({
  onLoad(options = {}) {
    this.setData({ url: decodeParam(options.url) || DEFAULT_URL })

    const title = getTitle()
    wx.setNavigationBarTitle({ title })
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
