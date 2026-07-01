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

Page({
  onLoad(options = {}) {
    const type = decodeParam(options.type)
    const target = decodeParam(options.target)

    if (!target) {
      wx.redirectTo({ url: '/pages/index/index' })
      return
    }

    if (type === 'wechat_miniapp') {
      wx.navigateToMiniProgram({
        ...parseMiniProgramTarget(target),
        fail: () => wx.redirectTo({ url: '/pages/index/index' })
      })
      return
    }

    if (type === 'wechat_link') {
      this.openWechatLink(target)
      return
    }

    wx.redirectTo({ url: '/pages/index/index' })
  },

  openWechatLink(url) {
    if (typeof wx.openOfficialAccountArticle === 'function') {
      wx.openOfficialAccountArticle({
        url,
        fail: () => this.copyLink(url)
      })
      return
    }

    this.copyLink(url)
  },

  copyLink(url) {
    wx.setClipboardData({
      data: url,
      success: () => {
        wx.showModal({
          title: '无法打开链接',
          content: '链接已复制，请在微信中打开。',
          showCancel: false,
          complete: () => wx.navigateBack()
        })
      }
    })
  }
})
