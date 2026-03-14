const DEFAULT_URL = 'https://xykcb.pylin.cn?__ua=xykcb_app/1.0.0%20(MiniApp%3B%20Channel/WeChat)'
const STORAGE_KEY = 'webview_url'

const TITLE_MAP = {
  'zh_CN': '小雨课程表',
  'en': 'Xiaoyu Schedule'
}

Page({
  onLoad() {
    const url = wx.getStorageSync(STORAGE_KEY) || DEFAULT_URL
    wx.setStorageSync(STORAGE_KEY, url)
    this.setData({ url })

    const lang = wx.getSystemInfoSync().language
    const title = TITLE_MAP[lang] || TITLE_MAP['zh_CN']
    wx.setNavigationBarTitle({ title })
  }
})
