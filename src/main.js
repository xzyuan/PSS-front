// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueHighCharts from 'vue-highcharts'
import Highcharts from 'highcharts/highstock'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import store from './store/index'
import loadExporting from 'highcharts/modules/exporting'

Vue.prototype.$axios = axios
axios.defaults.timeout = '50000000'
// axios.defaults.baseURL="http://192.168.113.35:80"
axios.defaults.baseURL = 'http://222.195.82.88:8088'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.interceptors.request.use(
  config => {
    if (window.sessionStorage.JWT_TOKEN) {
      config.headers.Authorization = `token ${window.sessionStorage.JWT_TOKEN}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

loadExporting(Highcharts)
Vue.use(VueHighCharts, {Highcharts})
Vue.use(ElementUI)
Highcharts.setOptions({
  global: {
    useUTC: false
  },
  lang: {
    downloadCSV: 'Download CSV',
    downloadXLS: 'Download XLS',
    viewData: 'View data table'
  },
  navigation: {
    menuItemStyle: {
      padding: '6px 14px'
    }
  }
})

Date.prototype.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

router.beforeEach(({name}, from, next) => {
  console.log('test test test')
  console.log(window.sessionStorage)
  if (name !== 'User') {
    next()
  } else if (window.sessionStorage.getItem('JWT_TOKEN')) {
    // 如果用户在login页面
    if (name === 'Login') {
      next()
    } else {
      next()
    }
  } else {
    if (name === 'Login') {
      next()
    } else {
      next({name: 'Login'})
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
