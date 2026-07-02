const { setCurrentLanguage, getLanguageText, applyNavigationBarTitle } = require('../../utils/language')
const { applyTheme, getColorConfig, setCurrentColor, setCurrentTheme } = require('../../utils/theme')
const LANGUAGE_TYPE = 'language'
const THEME_TYPE = 'theme'
const COLOR_TYPE = 'color'
const CLEAR_DATA_TYPE = 'clear_data'
const JUMP_TYPES = ['wechat_miniapp', 'wechat_link']
const SWITCH_BACK_DELAY = 1200
const CLEAR_EXIT_DELAY = 1200

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

const isPreviousSwitchingPage = () => {
  const pages = getCurrentPages()
  const previous = pages[pages.length - 2]
  return previous?.route === 'pages/redirect/redirect' && previous.isLanguageSwitching
}

Page({
  data: {
    type: '',
    target: '',
    message: '',
    jumpButtonText: getLanguageText('jumpButton'),
    buttonColor: getColorConfig().main,
    buttonShadowColor: getColorConfig().shadow
  },

  onLoad(options = {}) {
    const { type, target } = getRedirectPayload(options)

    if (!target && type !== CLEAR_DATA_TYPE) {
      this.backHome()
      return
    }

    this.routeRedirect(type, target)
  },

  onUnload() {
    this.clearDelayTimer()
  },

  routeRedirect(type, target) {
    const handlers = {
      [LANGUAGE_TYPE]: this.handleLanguageSwitch,
      [THEME_TYPE]: this.handleThemeSwitch,
      [COLOR_TYPE]: this.handleColorSwitch,
      [CLEAR_DATA_TYPE]: this.handleClearDataAndExit
    }

    if (handlers[type]) return handlers[type].call(this, target)

    if (JUMP_TYPES.includes(type)) {
      this.showJumpPage(type, target)
      return
    }

    this.backHome()
  },

  handleLanguageSwitch(target) {
    if (isPreviousSwitchingPage()) {
      this.backPrevious()
      return
    }

    this.isLanguageSwitching = true
    const lang = setCurrentLanguage(target)
    applyNavigationBarTitle(lang)
    this.setData({ message: getLanguageText('switching', lang) }, () => applyNavigationBarTitle(lang))
    this.delayRun(() => this.backPrevious(), SWITCH_BACK_DELAY)
  },

  handleThemeSwitch(target) {
    const theme = setCurrentTheme(target)
    applyTheme(theme)
    this.backPrevious()
  },

  handleColorSwitch(target) {
    setCurrentColor(target)
    this.backPrevious()
  },

  handleClearDataAndExit() {
    this.setData({ message: getLanguageText('clearing') }, () => {
      wx.clearStorageSync()
      this.delayRun(() => {
        if (typeof wx.exitMiniProgram === 'function') {
          wx.exitMiniProgram({ fail: this.backHome })
          return
        }

        this.backHome()
      }, CLEAR_EXIT_DELAY)
    })
  },

  showJumpPage(type, target) {
    applyTheme()
    const colorConfig = getColorConfig()
    const jumpButtonText = getLanguageText('jumpButton')
    applyNavigationBarTitle()
    this.setData({
      type,
      target,
      jumpButtonText,
      buttonColor: colorConfig.main,
      buttonShadowColor: colorConfig.shadow
    }, applyNavigationBarTitle)
  },

  backHome() {
    wx.reLaunch({ url: '/pages/index/index' })
  },

  backPrevious() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({ delta: 1 })
      return
    }

    this.backHome()
  },

  delayRun(fn, delay) {
    this.clearDelayTimer()
    this.delayTimer = setTimeout(() => {
      this.delayTimer = null
      fn()
    }, delay)
  },

  clearDelayTimer() {
    if (!this.delayTimer) return
    clearTimeout(this.delayTimer)
    this.delayTimer = null
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
