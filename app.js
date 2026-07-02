const { applyNavigationBarTitle } = require('./utils/language')
const { applyTheme } = require('./utils/theme')

App({
  onLaunch() {
    applyTheme()
    applyNavigationBarTitle()
  }
})
