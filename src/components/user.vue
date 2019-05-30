<template>
    <div align="center" style="margin-top: 3%">
      <el-row>
        <el-col :span=16 :offset=4>
      <el-dialog title="Sign in" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <el-form style="" :model="loginForm" >
          <el-form-item label="用户名">
            <el-input v-model="loginForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="loginForm.passWord"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login" plain>登陆</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-tabs :tab-position="tabPosition" style=" width: 80%;" >
        <el-tab-pane label="人员信息查询">
          <el-table :data="userData">
            <el-table-column prop="CardId" label="卡号"></el-table-column>
            <el-table-column prop="Name" label="姓名"></el-table-column>
            <el-table-column prop="Division" label="部门" :filters="divisionFilter" :filter-method="filterHandler"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger" plain
                  @click="handleEdit(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="人员信息添加">
          <el-row style="margin-top: 2%">
            <el-col :span=6 :offset=6>
          <el-form ref="form" :model="userForm" label-width="80px" style=" margin-top: 5%;">
            <el-form-item label='卡号' >
              <el-input v-model="userForm.cardId" style="width: 200px" clearable></el-input>
            </el-form-item>
            <el-form-item label='姓名'>
              <el-input v-model="userForm.name" style="width: 200px" clearable></el-input>
            </el-form-item>
            <el-form-item label='部门'>
            <el-select v-model="userForm.division" placeholder="请选择部门" clearable style="width: 200px">
              <el-option v-for="item in divisions" :label="item.name" :value="item.value"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" >添加</el-button>
              <!--<el-button>取消</el-button>-->
            </el-form-item>
          </el-form>
              <el-upload
                class="upload-demo"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-change="beforeUpload"
                :file-list="fileList"
                :auto-upload="false"
                :on-success = "onSuccess"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">解析</el-button>
                <div slot="tip" class="el-upload__tip">请上传XLSX/XLS文件</div>
              </el-upload>
            </el-col>
          </el-row>
          <el-row>
            <el-table :data="excelData">
              <el-table-column prop="卡号" label="卡号"></el-table-column>
              <el-table-column prop="姓名" label="姓名"></el-table-column>
              <el-table-column prop="部门" label="部门" :filters="divisionFilter" :filter-method="filterHandler"></el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
      </el-tabs>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'user',
  data () {
    return {
      fileList: [],
      userList: [],
      divisionFilter: [],
      dialogVisible: false,
      divisions: [],
      activeName: 'first',
      userData: [],
      excelData: [],
      tabPosition: 'left',
      userForm: {
        name: null,
        cardId: null,
        division: null
      },
      loginForm: {
        userName: '',
        passWord: ''
      },
      quitHidden: false
    }
  },
  mounted () {
    if (!localStorage.getItem('JWT_TOKEN')) {
      this.quitHidden = true
    }
    let _this = this
    this.$axios.get('/staff/getAllInfo')
      .then(function (response) {
        console.log(response.data)
        let data = response.data
        let p = []
        for (let i = 0; i < data.length; i++) {
          p.push({
            CardId: data[i]['card_id'],
            Division: data[i]['division_name'],
            Name: data[i]['name']
          })
        }
        _this.userData = p
      })
    this.$axios.get('/division/getAll')
      .then(function (response) {
        let data = response.data
        for (let i = 0; i < data.length; i++) {
          _this.divisions.push({
            name: data[i]['division_name'],
            value: data[i]['division_id']
          })
          _this.divisionFilter.push({
            text: data[i]['division_name'],
            value: data[i]['division_name']
          })
        }
      })
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    onSubmit () {
      let _this = this
      this.$axios.post('/staff', {
        card_id: _this.userForm.cardId,
        name: _this.userForm.name,
        division_id: _this.userForm.division
      })
        .then(function (response) {
          console.log(response.data)
          _this.$axios.get('/staff/getAllInfo')
            .then(function (response) {
              console.log(response.data)
              if (response.data === 0) {
                _this.$message({
                  message: '操作失败',
                  type: 'success'
                })
              }
              _this.userForm = {
                name: null,
                cardId: null,
                division: null
              }
              _this.$message({
                message: '操作成功',
                type: 'success'
              })
              _this.userData = []
              let data = response.data
              let p = []
              for (let i = 0; i < data.length; i++) {
                p.push({
                  CardId: data[i]['card_id'],
                  Division: data[i]['division_name'],
                  Name: data[i]['name']
                })
              }
              _this.userData = p
            })
        })
    },
    handleEdit (index, row) {
      console.log(index)
      console.log(row)
      let _this = this
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$axios.delete('/staff/' + row['CardId'])
          .then(function (response) {
            console.log(response.data)
            if (response.data === 0) {
              return
            }
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
            _this.$axios.get('/staff/getAllInfo')
              .then(function (response) {
                console.log(response.data)
                _this.userData = []
                let data = response.data
                let p = []
                for (let i = 0; i < data.length; i++) {
                  p.push({
                    CardId: data[i]['card_id'],
                    Division: data[i]['division_name'],
                    Name: data[i]['name']
                  })
                }
                _this.userData = p
              })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // login () {
    //   let _this = this
    //   if (this.$store.state.loginMessage.isLogin === true) {
    //   } else {
    //     let loginForm = this.loginForm
    //     let obj = {
    //       isLogin: true,
    //       userName: loginForm.userName,
    //       passWord: loginForm.passWord
    //     }
    //     this.$axios.post('/login', {
    //       userName: loginForm.userName,
    //       passWord: loginForm.passWord
    //     }).then(function (response) {
    //       if (response.data === 'success') {
    //         _this.$store.dispatch('checkLoginMethods', obj)
    //         console.log(_this.$store.state.loginMessage.isLogin)
    //         _this.dialogVisible = false
    //       }
    //     })
    //   }
    // },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    handleClose (done) {
      done()
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`)
    },
    onSuccess (file) {
      console.log('上传文件')
      console.log(file)
    },
    beforeUpload (file) {
      const types = file.name.split('.')[1]
      const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
      if (!fileType) {
        this.$message('格式错误！请重新选择')
        return
      }
      console.log('before upload')
      this.file2Xce(file).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          this.excelData = tabJson[0].sheet
          console.log('数据', this.excelData)
          // xlsxJson就是解析出来的json数据,数据格式如下
          // [
          //   {
          //     sheetName: sheet1
          //     sheet: sheetData
          //   }
          // ]
        }
      })
      console.log(file)
    },

    /**
     * 读取excel文件
     * @param file
     * @returns {Promise<any>}
     */
    file2Xce (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        reader.onload = function (e) {
          const data = e.target.result
          this.wb = XLSX.read(data, {
            type: 'binary'
          })
          const result = []
          this.wb.SheetNames.forEach((sheetName) => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
            })
          })
          resolve(result)
        }
        reader.readAsBinaryString(file.raw)
        // reader.readAsBinaryString(file) // 传统input方法
      })
    }
  }
}
</script>

<style scoped>

</style>
