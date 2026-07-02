const { setCurrentLanguage, getLanguageText, applyNavigationBarTitle } = require('../../utils/language')

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
    target: '',
    visible: false,
    jumpButtonText: getLanguageText('jumpButton')
  },

  onLoad(options = {}) {
    applyNavigationBarTitle()

    const { type, target } = getRedirectPayload(options)

    if (!target) {
      this.backHome()
      return
    }

    if (type === 'language') {
      setCurrentLanguage(target)
      applyNavigationBarTitle()
      this.setData({ jumpButtonText: getLanguageText('jumpButton') })
      return
    }

    if (type === 'wechat_miniapp' || type === 'wechat_link') {
      this.setData({ type, target, visible: true, jumpButtonText: getLanguageText('jumpButton') })
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
