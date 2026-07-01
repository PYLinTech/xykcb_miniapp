const TITLE_MAP = {
  zh_CN: '小雨课程表',
  en: 'Xiaoyu Schedule'
}

const getTitle = () => {
  const lang = wx.getSystemInfoSync().language
  return TITLE_MAP[lang] || TITLE_MAP.zh_CN
}

const decodeParam = (value) => {
  if (!value) return ''
  try {
    return decodeURIComponent(value)
  } catch (e) {
    return ''
  }
}

const parseMiniProgramTarget = (target) => {
  const pagesIndex = target.indexOf('\\pages\\')
  if (pagesIndex < 0) return { appId: target }

  const appId = target.slice(0, pagesIndex)
  const path = target.slice(pagesIndex + 1).replace(/\\/g, '/')
  return path ? { appId, path } : { appId }
}

const getRedirectPayload = (options = {}) => ({
  type: decodeParam(options.type),
  target: decodeParam(options.target)
})

Page({
  data: {
    type: '',
    target: ''
  },

  onLoad(options = {}) {
    wx.setNavigationBarTitle({ title: getTitle() })

    const { type, target } = getRedirectPayload(options)

    if (!target) {
      this.backHome()
      return
    }

    if (type === 'wechat_miniapp' || type === 'wechat_link') {
      this.setData({ type, target })
      return
    }

    this.backHome()
  },

  backHome() {
    wx.reLaunch({ url: '/pages/index/index' })
  },

  openMiniProgram(target) {
    wx.navigateToMiniProgram({
      ...parseMiniProgramTarget(target),
      complete: this.backHome
    })
  },

  openWechatLink(url) {
    if (typeof wx.openOfficialAccountArticle === 'function') {
      wx.openOfficialAccountArticle({
        url,
        complete: this.backHome
      })
      return
    }

    this.backHome()
  },

  handleJump() {
    const { type, target } = this.data
    if (type === 'wechat_miniapp') {
      this.openMiniProgram(target)
      return
    }
    if (type === 'wechat_link') {
      this.openWechatLink(target)
    }
  }
})
