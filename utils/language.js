const STORAGE_KEY = 'setting_language'
const DEFAULT_LANGUAGE = 'zh-cn'

const LANGUAGE_MAP = {
  'zh-cn': {
    title: '小雨课程表',
    jumpButton: '继续跳转',
    changingLanguage: '正在切换语言...',
    clearing: '正在清理数据...',
    changingTheme: '正在切换主题...',
    changingColor: '正在切换颜色...'
  },
  en: {
    title: 'Xiaoyu Schedule',
    jumpButton: 'Continue',
    changingLanguage: 'Changing language...',
    clearing: 'Clearing data...',
    changingTheme: 'Changing theme...',
    changingColor: 'Changing color...'
  }
}

const normalizeLanguage = (value) => {
  const lang = String(value || '').replace('_', '-').toLowerCase()
  return LANGUAGE_MAP[lang] ? lang : DEFAULT_LANGUAGE
}

const getCurrentLanguage = () => normalizeLanguage(wx.getStorageSync(STORAGE_KEY) || DEFAULT_LANGUAGE)

const setCurrentLanguage = (value) => {
  const lang = normalizeLanguage(value)
  wx.setStorageSync(STORAGE_KEY, lang)
  return lang
}

const getLanguageText = (key, value) => {
  const lang = value ? normalizeLanguage(value) : getCurrentLanguage()
  return LANGUAGE_MAP[lang][key] || LANGUAGE_MAP[DEFAULT_LANGUAGE][key] || ''
}

const getTitle = (value) => getLanguageText('title', value)

const applyNavigationBarTitle = (value) => {
  if (typeof wx.setNavigationBarTitle === 'function') {
    wx.setNavigationBarTitle({ title: getTitle(value) })
  }
}

module.exports = {
  setCurrentLanguage,
  getLanguageText,
  getTitle,
  applyNavigationBarTitle
}
