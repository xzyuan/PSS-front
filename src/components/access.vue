<!--suppress ALL -->
<template>
  <div align="center" style="margin-top: 2%">
    <el-dialog align="center" :visible.sync="dialogVisible" width="80%">
      <highcharts :options = 'options'></highcharts>
      <el-row>
        <el-col :span="4" :offset="3">
          <el-switch
          active-color="#0055fa"
          inactive-color="#696969"
          active-text="Beam Current"
          v-model="switchValue1"
          @change="addBeamCurrSeries"
          align="left">
        </el-switch>
        </el-col>
        <el-col :span="10" >
      <el-checkbox-group v-model="checkedList" @change="handleCheckedPvListChange" border="true">
        <el-checkbox v-for="pv1 in pvList" :label="pv1.position" :key="pv1.position" style="color: #000;"><font size=4  style="font-family: 'Consolas';font-weight: normal; ">{{pv1.name}}</font></el-checkbox>
      </el-checkbox-group>
        </el-col>
      </el-row>
      <el-date-picker
        v-model="timeSelectorValue"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="to"
        start-placeholder="start time"
        end-placeholder="end time"
        align="right"
      style="margin-top: 1%">
      </el-date-picker>
      <div style="margin-top: 1%">
        <el-button type="primary" @click="queryPCHistory">查询</el-button>
        <el-button type="primary" @click="downloadPCHistory">下载</el-button>
      </div>
    </el-dialog>
    <el-row>
      <el-col :span="5" :offset="3">
        <el-table :data="personnelCount" style="margin-top: 4%; width: 100%;font-size: 15px;color: #000;" align="center" cell-style="font-weight:550  " :header-cell-style="tableHeaderColor1" row-style="{height:40px}">
          <el-table-column prop="position" ></el-table-column>
          <el-table-column prop="count" label="当前人数" align="center"></el-table-column>
          <el-table-column label="查看历史">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning" plain
                @click="showHistory(scope.$index, scope.row)">view</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10" :offset="1">
      <el-row>
        <el-col :span="4">
          <span class="spanClass">
            卡号
          </span>
        </el-col>
        <el-col :span="8">
          <el-input v-model="form.cardId" placeholder="请选择卡号" clearable  size="mini"  class="inputClass"></el-input>
        </el-col>
        <el-col :span="4">
        <span class="spanClass">部门</span>
        </el-col>
        <el-col :span="8">
          <el-select class="selectClass" v-model="form.division" placeholder="请选择部门" clearable size="mini" style="color: #000;display: block" >
            <el-option v-for="item in divisions" :label="item.name" :value="item.value" style="color: #000;"></el-option>
          </el-select>
        </el-col>
       </el-row>
        <el-row style="margin-top: 2px">
          <el-col :span="4">
            <span class="spanClass">安全门</span>
          </el-col>
          <el-col :span="8">
            <el-select class="selectClass" v-model="form.door" placeholder="请选择安全门" clearable size="mini" style="color: #000;display: block">
              <el-option v-for="item in doors" :label="item.name" :value="item.value" style="color: #000;"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <span class="spanClass">刷卡结果</span>
          </el-col>
          <el-col :span="8">
            <el-select class="selectClass" v-model="form.result" placeholder="请选择刷卡结果" clearable size="mini" style="color: #000;display: block">
              <el-option v-for="item in result" :label="item.name" :value="item.value" style="color: #000;"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 2px">
          <el-col :span="8" :offset="4">
        <el-date-picker
          class="dataClass"
          v-model="value5"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="to"
          start-placeholder="start time"
          end-placeholder="end time"
          align="right"
        size="mini">
        </el-date-picker>
          </el-col>
        <el-button @click="query" size="mini">查询</el-button>
        </el-row>
        <el-table :data="eventData.slice((currentPage-1)*pageSize, currentPage*pageSize)" :row-style="tableStyle"  cell-style="padding:0; border:1px solid #696969;"
                  style="margin-top: 2%; width: 100%; font-size: 10px; color: #000; border:1px solid #696969;" :row-class-name="tableRowClassName"
                  :header-cell-style="tableHeaderColor">
          <el-table-column type="index" :index="indexMethod"></el-table-column>
          <el-table-column prop="SwipeTime" label="刷卡时间" align="center"></el-table-column>
          <el-table-column prop="CardId" label="卡号" align="center"></el-table-column>
          <el-table-column  label="读卡器名称" align="center">
            <el-table-column prop="In" label="门内"  align="center"></el-table-column>
            <el-table-column prop="Out" label="门外"  align="center"></el-table-column>
          </el-table-column>
          <el-table-column  prop="SwipeResult" label="刷卡结果" align="center">
            <template style="color: red; " slot-scope="scope">
              <div v-if="scope.row.SwipeResult === 1" style="color: 	#32CD32; font-weight: 550; font-size: large">
                √
              <!--<i class="el-icon-check" ></i>-->
              </div>
              <div v-else style="color: red; font-weight: 550; font-size: large">
                ×
                <!--<el-button type="success" icon="el-icon-check" v-if="scope.row.SwipeResult === 1" circle ></el-button>-->
              <!--<i class="el-icon-close" ></i>-->
              </div>
            </template>
          </el-table-column>
        </el-table>
    <el-pagination
      background
      :page-size="pageSize"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      layout="prev, pager, next"
      :total="pageCount1" style="margin-top: 1%">
    </el-pagination>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10" :offset="9">
        <el-table :data="statistics" style="margin-top: 1%; width: 100%; color: #000;" align="center" :header-cell-style="tableHeaderColor1" row-style="height:25px;" cell-style="padding:0;">
          <!--<el-table-column label="统计" width="50px"></el-table-column>-->
          <el-table-column prop="total" label="总刷卡次数" align="center"></el-table-column>
          <el-table-column prop="success" label="成功次数" align="center"></el-table-column>
          <!--由于读卡器于进入方向相反，进出记录out读卡器次数-->
          <el-table-column prop="out" label="进入次数" align="center"></el-table-column>
          <el-table-column prop="in" label="离开次数" align="center"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'access',
  data () {
    return {
      checkedList:[],     //设置PSS区域历史人数查询列表
      result: [{name:'成功', value: 1},{name: '失败', value: 0}],    //刷卡结果
      pvList:[{name: 'Linac',position: 'Linac'},{name: 'Ring Center', position: 'Ring Center'},{name: 'Ring Hall', position: 'Ring Hall'}],   //
      map: {
        Linac: 'Linac',
        'Ring Center': 'ringCenter',
        'Ring Hall': 'ringHall',
      },
      switchValue1:false,
      dialogVisible: false,
      doors: [],
      tableSize: 1,
      pageCount1: 1,
      currentPage: 1,
      pageSize: 15,
      personnelCount: [{
        position: 'Linac',
        count: 0
      }, {
        position: 'Ring Center',
        count: 0
      }, {
        position: 'Ring Hall',
        count: 0
      }],
      form: {
        cardId: null,
        divisionId: null,
        door: null,
        result: null,
        startTime: null,
        endTime: null
      },
      divisions: [],
      readerValue: '',
      reader: [],
      statistics: [{
        total: 0,
        success: 0,
        in: 0,
        out: 0
      }],
      gridData: [],
      eventData: [],
      options: {
        chart: {
          width: 1000,
          height: 500,
          zoomType: 'x',
          resetZoomButton: {
            position: {
              align: 'right', // by default
              verticalAlign: 'top', // by default
            },
            relativeTo: 'chart',
            animation: false
          },
          plotBorderWidth: 2,
          plotBorderColor: 'grey',
        },
        colors: ['#f45b5b','#f7a35c','#8085e9', '#434348', '#7cb5ec',
          '#f15c80', '#e4d354', '#2b908f', '#90ed7d', '#91e8e1'],
        plotOptions: {
          animation: false,
          series: {
            turboThreshold: 10000
          },
          line: {
            dataGrouping: {
              enabled: false
            }
          }
        },
        title: {
          text: ''
        },
        xAxis: {
          lineWidth: 1,
          gridLineDashStyle: 'ShortDash',
          lineColor: 'grey',
          gridLineWidth: 1,
          ordinal: false,
          title: {
            text: 'Time',
            style: {
              color: 'black',
              fontWeight: 1000
            }
          },
          type: 'datetime',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%Y-%m-%d',
            year: '%Y'
          },
          max: null,
          min: null
        },
        yAxis: [{
          gridLineWidth: 0,
          linewidth: 2,
          showFirstLabel: true,
          showLastLabel: true,
          opposite: false,
          type: 'linear',
          lineColor: 'black',
          title: {
            text: 'Personnel Count',
            style: {
              color: 'black',
              fontWeight: 1000
            }
          },
          softMin: 0,
          allowDecimals:false
        },{
          gridLineWidth:1,
          opposite:true,
          type: 'linear',
          title: {
            text: 'BeamCurrent(mA)',
            style: {
              color:"black",
              fontWeight:1000
            }
          },
          showFirstLabel: true,
          showLastLabel: true,
          lineWidth:2,
          startOnTick:false,
          softMin:150,
        }],
        tooltip: {
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%Y-%m-%d',
            week: '%m-%d',
            month: '%Y-%m-%d',
            year: '%Y'
          },
          pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>.'
        },
        lang:{
          printChart:'打印图表',
          downloadJPEG:'下载 JPEG 文件',
          downloadPDF: '下载 PDF  文件',
          downloadPNG: '下载 PNG  文件',
          downloadSVG: '下载 SVG  文件',
          downloadCSV: '下载 CSV  文件',
          downloadXLS: '下载 XLS  文件',
          viewData: '查看数据表格'
        },
        navigation:{
          menuItemStyle:{
            padding:'6px 14px'
          }
        },
        credits: {
          enabled: false
        },
        rangeSelector: false,
        legend: {
          enabled: true,
          verticalAlign: 'bottom',
          // layout: 'vertical',
          align: 'middle'
        },
        series: []
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value5: [new Date(Date.now() - 3600 * 24 * 1000), new Date(Date.now())],
      timeSelectorValue: [new Date(Date.now() - 3600 * 24 * 1000), new Date(Date.now())]
    }
  },
  mounted () {
    for (let i = 0; i < 14; i++) {
      let str
      if ( i < 9) {
        str = 'Door0' + (i+1)
      } else {
      str = 'Door' + (i+1)
      }
      this.doors.push({
        name: '#' + (i+1) + ': in',
        value: str + ':Inner'
      })
      this.doors.push({
        name: '#' + (i+1) + ': out',
        value: str + ':Outer'
      })
    }
    this.initWebSocket();
    console.log(this.form.divisions)
    let _this = this
    this.$axios.get('/division/getAll')
      .then(function (response) {
        let data = response.data
        for (let i = 0; i < data.length; i++) {
          _this.divisions.push({
            name: data[i]['division_name'],
            value: data[i]['division_id']
          })
        }
      })
  },
  methods: {
    /**
     * 设置获取实时区域人数的WebSocket设置
     */
    initWebSocket:function () {
      let str = window.location.href;
      // const wsuri = "ws://"+ str.split("/")[2] + "/ws/personnelCount";
      const wsuri = "ws://"+ '222.195.82.88:8088' + "/personnelCount";
      let websock = new WebSocket(wsuri);
      websock.onopen = () => {
        var postValue={};
        websock.send(JSON.stringify(postValue));
      }
      websock.onmessage = e => {
        this.personnelCount[0].count = null
        this.personnelCount[1].count = null
        this.personnelCount[2].count = null
        let data = JSON.parse(e.data)
        // console.log(data)
        this.personnelCount[0].count = parseInt(data['HLS:PSS:Linac:PersonnelCount:longin'])
        this.personnelCount[1].count = parseInt(data['HLS:PSS:Ringcenter:PersonnelCount:longin'])
        this.personnelCount[2].count = parseInt(data['HLS:PSS:Ringhall:PersonnelCount:longin'])
      }
      websock.onclose = function () {
        // 关闭 websocket
      }
      // 路由跳转时结束websocket链接
      this.$router.afterEach(function () {
        websock.close()
      })
      websock.onerror = function () {
        console.log("error occurred")
      }
    },
    /**
     * 根据过滤参数查询刷卡事件
     */
    query () {
      let _this = this
      let urlFragment = '/event'
      if (this.form.cardId !== null && this.form.cardId !== '') {
        urlFragment = urlFragment + '/getByCardIdAndTime' + '/' + this.form.cardId + '/' + this.value5[0].getTime() + '/' + this.value5[1].getTime()
      } else if (this.form.division !== null && this.form.division !== '') {
        urlFragment = urlFragment + '/getByDivisionIdAndTime' + '/' + this.form.division + '/' + this.value5[0].getTime() + '/' + this.value5[1].getTime()
      } else if (this.form.door != null && this.form.door !== '') {
        urlFragment = urlFragment + '/getByDoorAndTime' + '/' + this.form.door + '/' + this.value5[0].getTime() + '/' + this.value5[1].getTime()
      } else {
        urlFragment = urlFragment + '/getByTime/' + this.value5[0].getTime() + '/' + this.value5[1].getTime()
      }
      console.log(this.form)
      this.$axios.post('/event',{
        cardId: this.form.cardId === null || this.form.cardId === "" ? -1 : this.form.cardId,
        divisionId: this.form.divisionId === null || this.form.divisionId === '' ? -1 : this.form.doorId,
        door: this.form.door === '' ? null : this.form.door,
        result: this.form.result === null ? -1 : this.form.result,
        startTime: this.value5[0].getTime(),
        endTime: this.value5[1].getTime()
      })
        .then(function (response) {
          console.log(response.data)
          let n = response.data.length
              // _this.pageCount = n % _this.pageSize === 0 ? n / _this.pageSize : (n / _this.pageSize + 1)
              _this.pageCount1 = n
              _this.currentPage = 1
              _this.statistics[0].total = n
              let data = response.data
              let p = []
              let success = 0
              let inner = 0
              let outer = 0
              let s1, s2
              for (let i = 0; i < n; i++) {
                let readerName = data[i]['reader_name'].split(':')
                let doorName = '#' + readerName[0].substring(4, 6)
                if (readerName[1] === 'Inner') {
                  if (data[i]['swipe_result'] === 1) {
                    inner++
                    success++
                  }
                  s1 = doorName
                  s2 = ''
                } else {
                  if (data[i]['swipe_result'] === 1) {
                    outer++
                    success++
                  }
                  s2 = doorName
                  s1 = ''
                }
                p.push({
                  SwipeTime: new Date(data[i]['swipe_time']).format('yyyy-MM-dd hh:mm:ss').toString(),
                  ReaderName: data[i]['reader_name'],
                  User: data[i]['name'],
                  SwipeResult: data[i]['swipe_result'],
                  CardId: data[i]['card_id'],
                  Group: data[i]['division_name'],
                  In: s1,
                  Out: s2
                })
              }
              _this.statistics[0].success = success
              _this.statistics[0].in = inner
              _this.statistics[0].out = outer
              _this.gridData = p
              _this.eventData = p
        })
    },
    indexMethod (index) {
      return index + 1
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    tableRowClassName ({row, rowIndex}) {
      if (row.SwipeResult === 0) {
        console.log(row.SwipeResult)
        return 'background: red; border:1px solid #696969;'
      }
      return ''
    },
    tableStyle({ row, rowIndex }){
      return "height: 25px; border: 1px solid #696969"
    },
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      return 'color: black;font-weight: 800;font-size: 13px; border:1px solid #696969;'
    },

    tableHeaderColor1 ({ row, column, rowIndex, columnIndex }) {
      return 'color: black;font-weight: 800;font-size: 15px; '
    },
    showHistory (index, row) {
      this.dialogVisible = true
      console.log(row)
      this.switchValue1 = false
      this.options.title.text =' Personnel Count'
      this.options.series = []
      this.checkedList = []
      this.checkedList.push(row.position)
    },
    /**
     * 查询区域历史人数数据并渲染到Highcharts折线图中
     */
    queryPCHistory () {
      this.options.series = []
      this.switchValue1 = false
      for (let i = 0; i < this.checkedList.length; i++) {
        let _this = this
        this.$axios.get('/event/getPersonnelCount/' + this.map[this.checkedList[i]] + '/' + this.timeSelectorValue[0].getTime() + '/' + this.timeSelectorValue[1].getTime())
          .then(function (response) {
            let data = response.data
            let p = []
            p.push([_this.timeSelectorValue[0].getTime(), null])
            for (let i = 0; i < data.length; i++) {
              p.push([data[i].time, data[i].count])
            }
            p.push([_this.timeSelectorValue[1].getTime(), data[data.length - 1].count])
            // _this.options.xAxis.max = _this.timeSelectorValue[0].getTime()
            // _this.options.xAxis.min = _this.timeSelectorValue[0].getTime()
            _this.options.series.push({
              name: _this.map[_this.checkedList[i]],
              data: p,
              lineWidth: 2,
              step: 'left',
              yAxis: 0
            })
          })
      }
    },
    /**
     * 查询束流流强数据并渲染到Highchats图中
     */
    addBeamCurrSeries:function () {
      if(this.switchValue1 === true){  //先对Beam Current开关状态进行判断
        this.Loading = true;
        let _this = this;
        let p = [];
        let date1 = this.timeSelectorValue[0];
        let date2 = this.timeSelectorValue[1];
        console.log(date1);
        let time1 = date1.format("yyyy-MM-dd hh:mm:ss");
        let time2 = date2.format("yyyy-MM-dd hh:mm:ss");
        this.$axios.get('http://192.168.113.35/data/history/id/149/' + time1 + '/' + time2)
          .then(function (response) {
            let n = response.data.length;
            for (var i = 0; i < n; i++){
              p.push([response.data[i].smpl_time,response.data[i].float_val]);
            }
            _this.options.series.push({
              name: 'Beam Current(mA)',
              data: p,
              color: "#0055fa",
              yAxis:1,
              lineWidth:1.5,
            })
            _this.Loading = false;
          })
      }else if(this.switchValue1 === false){
        this.options.series.pop();
      }
    },
    handleCheckedPvListChange () {
      console.log(this.checkedList)
    },
    /**
     * 下载区域历史人数数据
     */
    downloadPCHistory () {
      if (this.checkedList.length === 0){
        return
      }
      let nameList = ''
      for (let i = 0; i < this.checkedList.length; i++) {
        nameList = nameList + this.map[this.checkedList[i]] + '@'
      }
      this.$axios.get('/event/downloadPersonnelCount/' + nameList + '/' + this.timeSelectorValue[0].getTime() + '/' + this.timeSelectorValue[1].getTime())
        .then(function (response) {
          console.log(response.data)
          window.open('http://192.168.126.14:8088/event/media/' + response.data)
        })
    }
  }
}
</script>

<style scoped>
  /**
     *表单前的文字字号
     */
  .spanClass{
    font-weight: bold;
  }
</style>

<style>
  .inputClass input.el-input__inner {
    border: 1px solid #000000;
  }

  .selectClass input.el-input__inner{
    border: 1px solid #000000;
  }

  .dataClass .el-date-editor.el-input, .el-date-editor.el-input__inner{
    border: 1px solid #000000;
  }

</style>

