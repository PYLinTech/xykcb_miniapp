const STORAGE_KEY = 'setting_theme'
const COLOR_STORAGE_KEY = 'setting_color'
const DEFAULT_THEME = 'system'
const DEFAULT_COLOR = 'appleGreen'

const THEME_MAP = {
  light: {
    navBgColor: '#f7f7f7',
    navFrontColor: '#000000',
    bgColor: '#f7f7f7',
    bgTextStyle: 'dark'
  },
  dark: {
    navBgColor: '#1e1e1e',
    navFrontColor: '#ffffff',
    bgColor: '#1e1e1e',
    bgTextStyle: 'light'
  }
}

const COLOR_MAP = {
  appleGreen: { main: '#07c160', shadow: 'rgba(7, 193, 96, 0.22)' },
  vividYellow: { main: '#ffc107', shadow: 'rgba(255, 193, 7, 0.24)' },
  dreamyPurple: { main: '#9c27b0', shadow: 'rgba(156, 39, 176, 0.24)' },
  iceBlue: { main: '#03a9f4', shadow: 'rgba(3, 169, 244, 0.24)' },
  sheerPink: { main: '#ff4081', shadow: 'rgba(255, 64, 129, 0.24)' },
  distantCyan: { main: '#009688', shadow: 'rgba(0, 150, 136, 0.24)' },
  freedomOrange: { main: '#ff5722', shadow: 'rgba(255, 87, 34, 0.24)' }
}

const normalizeTheme = (value) => {
  const theme = String(value || '').toLowerCase()
  return theme === 'light' || theme === 'dark' || theme === 'system' ? theme : DEFAULT_THEME
}

const normalizeColor = (value) => {
  const color = String(value || '')
  return COLOR_MAP[color] ? color : DEFAULT_COLOR
}

const getSystemTheme = () => {
  try {
    return wx.getSystemInfoSync().theme === 'dark' ? 'dark' : 'light'
  } catch (e) {
    return 'light'
  }
}

const resolveTheme = (value) => {
  const theme = normalizeTheme(value || wx.getStorageSync(STORAGE_KEY) || DEFAULT_THEME)
  return theme === 'system' ? getSystemTheme() : theme
}

const setCurrentTheme = (value) => {
  const theme = normalizeTheme(value)
  wx.setStorageSync(STORAGE_KEY, theme)
  return theme
}

const setCurrentColor = (value) => {
  const color = normalizeColor(value)
  wx.setStorageSync(COLOR_STORAGE_KEY, color)
  return color
}

const getColorConfig = (value) => COLOR_MAP[normalizeColor(value || wx.getStorageSync(COLOR_STORAGE_KEY) || DEFAULT_COLOR)]

const applyTheme = (value) => {
  const colors = THEME_MAP[resolveTheme(value)]

  if (typeof wx.setNavigationBarColor === 'function') {
    wx.setNavigationBarColor({
      frontColor: colors.navFrontColor,
      backgroundColor: colors.navBgColor
    })
  }

  if (typeof wx.setBackgroundColor === 'function') {
    wx.setBackgroundColor({
      backgroundColor: colors.bgColor,
      backgroundColorTop: colors.bgColor,
      backgroundColorBottom: colors.bgColor
    })
  }

  if (typeof wx.setBackgroundTextStyle === 'function') {
    wx.setBackgroundTextStyle({ textStyle: colors.bgTextStyle })
  }
}

module.exports = {
  applyTheme,
  getColorConfig,
  setCurrentColor,
  setCurrentTheme
}
