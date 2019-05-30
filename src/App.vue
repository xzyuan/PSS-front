<template>
    <div style="min-width: 1400px; font-" >
      <el-dialog align="center" :visible.sync="dialogVisible" width="20%">
        <el-form style="width: 100%" :model="loginForm">
          <el-form-item label="用户名">
            <el-input v-model="loginForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="loginForm.passWord" show-password @keyup.enter.native="login"></el-input>
          </el-form-item>
          <el-form-item label="" style="color: red" :hidden="tipHidden">登陆失败，请检查用户名和密码</el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login" plain>登陆</el-button>
          </el-form-item>
          <el-form-item></el-form-item>
        </el-form>
      </el-dialog>
      <el-row style="background-color: #ffffff; height:80px; "  type="flex">
        <el-col :span=12 :offset=6 align="center">
          <p class="grid-content bg-purple-dark" style="font-size: xx-large; margin-top: 20px;" >
            <font style="font-size: xx-large;font-weight: bold;font-family: Arial, Helvetica, sans-serif; color: #004499">HLS-Ⅱ {{this.$route.name}}</font>
          </p>
        </el-col>
        <el-col :span=4 align="left" style="margin-bottom: 0; margin-top: 20px"><p style="color: #2d6ba9;font-size: large"  >{{timeNow}}</p></el-col>
        <el-col :span=2 align="center" style="margin-bottom: 0; margin-top: 20px">
          <el-button type="primary" @click="loginClick" plain>{{loginOption}}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <!-- #004499   #2d6ba9   #ffd04b  -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#004499"
                 text-color="#ffffff"
                 active-text-color="#ffd04b"
                 :router="routerMode"
        >
          <el-col :span=4 :offset=6 align="center">
            <el-submenu index="3" align="center" style="width: 100%">
              <template slot="title" style="width: 100%"><font style="font-size: large;">Personal Safety</font></template>
              <el-menu-item index="/access" style="width: 100%">Swipe data</el-menu-item>
              <el-menu-item index="/user" :hidden="manageHidden">Personnel management</el-menu-item>
            </el-submenu>
          </el-col>
          <!--<el-col :span="4" align="center">-->
          <!--<el-menu-item index="/alarm" align="center">Alarm</el-menu-item>-->
          <!--</el-col>-->
          <el-col :span="4" align="center">
            <el-menu-item index="/radiation" align="center"></el-menu-item>
          </el-col>
          <el-col :span="4" align="center">
            <el-menu-item index="/help" align="center"></el-menu-item>
          </el-col>
          <el-col :span="2"><div><p></p></div></el-col>
        </el-menu>
      </el-row>
      <el-row>
        <div>
          <!-- 路由匹配到的组件将渲染在这里 -->
          <router-view></router-view>
        </div>
      </el-row>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      routerMode: true,
      loginOption: 'Log in',
      // activeIndex2: "$route.path",
      activeIndex: '/home',
      timeNow: '',
      manageHidden: true,
      dialogVisible: false,
      tipHidden: true,
      loginForm: {
        userName: '',
        passWord: ''
      }
    }
  },
  mounted () {
    if (window.sessionStorage.getItem('JWT_TOKEN')) {
      this.loginOption = 'Log out'
      this.manageHidden = false
    }
    this.defaultIndex()
    let _this = this // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(function () {
      _this.timeNow = new Date().format('yyyy-MM-dd hh:mm:ss').toString() // 修改数据date
    }, 1000)
  },
  methods: {
    defaultIndex () {
      this.activeIndex = this.$route.matched[0].path
    },
    loginClick () {
      if (!window.sessionStorage.getItem('JWT_TOKEN')) {
        this.dialogVisible = true
        this.loginForm = {
          userName: '',
          passWord: ''
        }
      } else if (this.loginOption === 'Log out') {
        window.sessionStorage.clear()
        console.log(this.$route.path)
        if (this.$route.path === '/user') {
          this.$router.push('/access')
        }
        this.loginForm = {
          userName: '',
          passWord: ''
        }
        this.$message({
          message: '已退出登录',
          type: 'success'
        })
        this.manageHidden = true
        this.loginOption = 'Log in'
      }
    },
    login () {
      this.tipHidden = true
      let _this = this
      let loginForm = this.loginForm
      this.$axios.post('/login', {
        userName: loginForm.userName,
        passWord: loginForm.passWord
      }).then(function (response) {
        if (response.data === 'failed') {
          _this.tipHidden = false
        } else {
          window.sessionStorage.setItem('JWT_TOKEN', response.data)
          _this.loginOption = 'Log out'
          _this.$message({
            message: '登陆成功',
            type: 'success'
          })
          _this.loginForm = {
            userName: '',
            passWord: ''
          }
          _this.tipHidden = true
          _this.manageHidden = false
          _this.$router.push({path: '/user'})
          _this.dialogVisible = false
        }
      }).catch(function (error) {
        _this.tipHidden = false
        console.log(error)
      })
    }
  },
  beforeDestory: function () { // 清除定时器
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除定时器
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
