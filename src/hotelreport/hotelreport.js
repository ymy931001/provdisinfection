import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Input,
  Cascader,
  DatePicker,
  Pagination, Tooltip, Select
} from "antd";
import {
  getregion,
  detectionService
} from "../axios";
import "./hotelreport.css";
import moment from 'moment';

const { Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      typenone: "inline-block",
      pageNum: 1,
      pageNumSize: 10,
      begintime: localStorage.getItem('begintime') ? moment(localStorage.getItem('begintime')) : undefined,
      endtime: localStorage.getItem('endtime') ? moment(localStorage.getItem('endtime')) : undefined,
      cityid: localStorage.getItem('cityid'),
      areaid: localStorage.getItem('areaid'),
      siteId: localStorage.getItem('siteId'),
    };
    this.nodeInfoTableColumns = [
      {
        title: "酒店名称",
        dataIndex: "siteName",
        render: (text, record, index) => {
          return (
            <div>
              <a onClick={() => this.findhotel(text, record, index)} style={{ color: '#666' }}>
                {text}
              </a>
            </div>
          )
        }
      },
      {
        title: "监控位置",
        dataIndex: "name",
        render: (text, record, index) => {
          return (
            <div>
              <a onClick={() => this.findroom(text, record, index)} style={{ color: '#666' }}>
                {text}
              </a>
            </div>
          )
        }
      },
      {
        title: "监测日期",
        dataIndex: "date",
        sorter: (a, b) => new Date(a) > new Date(b) ? 1 : -1,
        // defaultSortOrder: 'descend',
        render: (text, record, index) => {
          return (
            <div>
              {moment(new Date(text.replace(/-/g, '/'))).format('YYYY-MM-DD')}
            </div>
          )
        }
      },
      {
        title: "监测结果",
        dataIndex: "result",
        render: (text, record, index) => {
          if (text === 1) {
            return (
              <div>
                <span style={{ color: 'green' }}>已消毒</span>
              </div>
            )
          }
          else if (text === - 1) {
            return (
              <div>
                <span style={{ color: 'red', cursor: "pointer" }}>
                  <Tooltip title={"插座长时间离线"}>
                    <span>设备离线</span>
                  </Tooltip>
                </span>
              </div>
            )
          }
          else if (text === -2) {
            return (
              <div>
                <span style={{ color: 'red', cursor: "pointer" }}>
                  <Tooltip title={"摄像头长时间离线"}>
                    <span>设备离线</span>
                  </Tooltip>
                </span>
              </div>
            )
          }
          else if (text === -3) {
            return (
              <div>
                <span style={{ color: 'red', cursor: "pointer" }}>
                  <Tooltip title={"摄像头和插座均长时间离线"}>
                    <span>设备离线</span>
                  </Tooltip>
                </span>
              </div>
            )
          } else {
            return (
              <div>
                <Tooltip placement="topLeft" title={
                  record.result === 0 ? "消毒柜工作时间和洗消时长均未达标" : record.result === 2 ? "消毒柜工作时间未达标" : record.result === 3 ? "洗消时长未达标" : ''
                }>
                  <span style={{ color: 'red', cursor: 'pointer' }}>未达标</span>
                </Tooltip>
              </div>
            )
          }
        }
      },
      {
        title: "监测报告",
        dataIndex: "sceneId",
        render: (text, record, index) => {
          return (
            <div>
              <a onClick={() => this.lookreport(text, record, index)}>
                查看
              </a>
            </div>
          )
        }
      },
    ];


  }

  componentWillMount() {
    document.title = "酒店消毒监测报告";

    if (localStorage.getItem('selectarea')) {
      var arr = localStorage.getItem('selectarea').split(',')
      if (arr.length > 2) {
        arr[2] = parseInt(arr[2], 10)
      }
      this.setState({
        addresslist: arr,
      }, function () {
        this.detectionService()
      })
    } else {
      this.setState({
        keytext: localStorage.getItem('keytext')
      }, function () {
        this.detectionService()
      })
    }
  }

  componentDidMount() {
    getregion().then(res => {
      if (res.data && res.data.message === "success") {
        if (res.data.data.length !== 0) {
          for (var i in res.data.data[0].children) {
            for (var j in res.data.data[0].children[i].children) {
              for (var k in res.data.data[0].children[i].children[j].children) {
                if (res.data.data[0].children[i].children[j].children[k].children.length === 0) {
                  res.data.data[0].children[i].children[j].children[k].adcode = res.data.data[0].children[i].children[j].children[k].id
                  res.data.data[0].children[i].children[j].children[k].children = undefined
                }
              }
            }
          }
          this.setState({
            deviceList: res.data.data[0].children
          })
        } else {
          this.setState({
            deviceList: []
          })
        }
      }
    });



  }

  detectionService = () => {
    detectionService([
      this.state.pageNum,
      this.state.pageNumSize,
      this.state.cityid === 'null' ? null : this.state.cityid,
      this.state.areaid === 'null' ? null : this.state.areaid,
      this.state.siteId === 'null' ? null : this.state.siteId,
      this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
      this.state.endtime === undefined ? moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
      localStorage.getItem('keytext'),
      this.state.result
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        localStorage.removeItem('keytext')
        if (res.data.data === null) {
          this.setState({
            videoListDataSource: []
          })
        } else {
          this.setState({
            videoListDataSource: res.data.data.detectionVOList,
            total: res.data.data.total,
          })
        }
      }
    })
  }

  //房间搜索
  findroom = (text, record, index) => {
    console.log(record.siteId)
    this.setState({
      keytext: text,
      siteId: record.siteId,
    }, function () {
      detectionService([
        1,
        this.state.pageNumSize,
        null,
        null,
        this.state.siteId,
        this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
        this.state.endtime === undefined ? moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
        text,
        this.state.result
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          if (res.data.data === null) {
            this.setState({
              videoListDataSource: []
            })
          } else {
            this.setState({
              videoListDataSource: res.data.data.detectionVOList,
              total: res.data.data.total,
            })
          }
        }
      })
    })
  }

  //酒店搜索
  findhotel = (text, record, index) => {
    this.setState({
      siteId: record.siteId,
    }, function () {
      detectionService([
        1,
        this.state.pageNumSize,
        null,
        null,
        this.state.siteId,
        this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
        this.state.endtime === undefined ? moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
        this.state.result
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          if (res.data.data === null) {
            this.setState({
              videoListDataSource: []
            })
          } else {
            this.setState({
              videoListDataSource: res.data.data.detectionVOList,
              total: res.data.data.total,
            })
          }
        }
      })
    })
  }



  onChange = (date, dateString) => {
    console.log(date, dateString);
  }


  //时间选择
  timeonChange = (value, dateString) => {
    console.log(dateString)
    if (dateString[0] === "") {
      this.setState({
        begintime: undefined
      }, function () {
        localStorage.setItem('begintime', this.state.begintime)
      })
    } else {
      this.setState({
        begintime: moment(dateString[0]),
      }, function () {
        localStorage.setItem('begintime', this.state.begintime)
      });
    }
    if (dateString[1] === "") {
      this.setState({
        endtime: undefined
      }, function () {
        localStorage.setItem('endtime', this.state.endtime)
      })
    } else {
      this.setState({
        endtime: moment(dateString[1]),
      }, function () {
        localStorage.setItem('endtime', this.state.endtime)
      });
    }
  }

  //查询
  query = () => {
    detectionService([
      1,
      10,
      this.state.cityid === 'null' ? null : this.state.cityid,
      this.state.areaid === 'null' ? null : this.state.areaid,
      this.state.siteId === 'null' ? null : this.state.siteId,
      this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
      this.state.endtime === undefined ? moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
      this.state.keytext,
      this.state.result
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        if (res.data.data === null) {
          this.setState({
            videoListDataSource: []
          })
        } else {
          this.setState({
            videoListDataSource: res.data.data.detectionVOList,
            total: res.data.data.total,
            pageNum: 1,
          })
        }
      }
    });
  }

  //今日数据
  todaydata = () => {
    this.setState({
      begintime: moment(new Date()),
      endtime: moment(new Date()),
    })
    detectionService([
      1,
      10,
      this.state.cityid === 'null' ? null : this.state.cityid,
      this.state.areaid === 'null' ? null : this.state.areaid,
      this.state.siteId === 'null' ? null : this.state.siteId,
      moment(new Date()).format("YYYY-MM-DD"),
      moment(new Date()).format("YYYY-MM-DD"),
      this.state.keytext,
      this.state.result
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        if (res.data.data === null) {
          this.setState({
            videoListDataSource: []
          })
        } else {
          this.setState({
            videoListDataSource: res.data.data.detectionVOList,
            total: res.data.data.total,
            pageNum: 1,
          })
        }
      }
    });
  }



  //分页

  pagechange = (page, num) => {
    console.log(page, num)
    console.log(this.state.siteId)
    this.setState({
      pageNum: page,
      pageNumSize: num,
    }, function () {
      detectionService([
        this.state.pageNum,
        this.state.pageNumSize,
        this.state.cityid === 'null' ? null : this.state.cityid,
        this.state.areaid === 'null' ? null : this.state.areaid,
        this.state.siteId === 'null' ? null : this.state.siteId,
        this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
        this.state.endtime === undefined ? moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
        this.state.keytext,
        this.state.result
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          if (res.data.data === null) {
            this.setState({
              videoListDataSource: []
            })
          } else {
            this.setState({
              videoListDataSource: res.data.data.detectionVOList,
              total: res.data.data.total,
            })
          }
        }
      })

    })
  }



  //查看报告
  lookreport = (text, record, index) => {
    console.log(text)
    console.log(record)
    localStorage.setItem('detectionId', record.id)
    localStorage.setItem('reportdate', moment(new Date(record.date)).format('YYYY-MM-DD'))
    localStorage.setItem('reportsite', record.siteId)
    localStorage.setItem('hotelname', record.siteName)
    localStorage.setItem('roomname', record.name)
    localStorage.setItem('reportroomId', record.roomId)
    localStorage.setItem('cameraid', record.cameraId)
    setTimeout(function () {
      window.location.href = "/app/hotelplace";
    }, 1000);
  }

  //设备位置选择
  addresschange = (e) => {
    console.log(e)
    localStorage.setItem('selectarea', e)
    this.setState({
      addresslist: e,
      cityid: e[0] === undefined ? null : e[0],
      areaid: e[1] === undefined ? null : e[1],
      siteId: e[2] === undefined ? null : e[2]
    }, function () {
      localStorage.setItem('cityid', this.state.cityid)
      localStorage.setItem('areaid', this.state.areaid)
      localStorage.setItem('siteId', this.state.siteId)
    });
  }


  //重置
  reset = () => {
    this.setState({
      cityid: null,
      areaid: null,
      siteId: null,
      addresslist: [],
      keytext: undefined,
      begintime: undefined,
      endtime: undefined,
      pageNum: 1,
      result: undefined
    }, function () {
      localStorage.setItem('selectarea', [])
      localStorage.setItem('cityid', this.state.cityid)
      localStorage.setItem('areaid', this.state.areaid)
      localStorage.removeItem('begintime')
      localStorage.removeItem('endtime')
      localStorage.setItem('siteId', this.state.siteId)
      this.detectionService()
    })
  }

  //关键字录入
  keytext = (e) => {
    this.setState({
      keytext: e.target.value
    })
  }

  //监测结果筛选
  resultype = (value) => {
    console.log(value)
    this.setState({
      result: value
    })
  }

  render() {
    const nodeInfoTableColumns = this.nodeInfoTableColumns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <Layout >
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="监测报告-杯具消毒" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}>
              <div className="gutter-example-nodemanage">
                &nbsp;&nbsp;&nbsp;设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                <Cascader
                  fieldNames={{ label: 'name', value: 'adcode' }}
                  options={this.state.deviceList}
                  onChange={this.addresschange}
                  value={this.state.addresslist}
                  changeOnSelect
                  style={{ width: "320px", marginRight: '20px' }}
                  placeholder="选择酒店" />
                <span style={{ display: 'inline-block', width: '70px', textAlign: 'right' }}>时间&nbsp;:</span>
                <RangePicker
                  style={{ marginLeft: '10px', marginRight: '10px', width: '300px' }}
                  format={dateFormat}
                  ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                  onChange={this.timeonChange}
                  value={[this.state.begintime, this.state.endtime]}
                />
                <Button type="primary" onClick={this.todaydata}>今日</Button>
                <div style={{ marginTop: "20px" }}>
                  关键字搜索&nbsp;: &nbsp;&nbsp;&nbsp;
                <Input placeholder="请输入关键字" style={{ width: '320px', marginRight: '20px' }}
                    value={this.state.keytext}
                    onChange={this.keytext}
                  />
                  <span style={{ display: 'inline-block', width: '70px', textAlign: 'right' }}>监测结果&nbsp;:</span>
                  <Select
                    style={{ marginLeft: '10px', marginRight: '10px', width: '300px' }}
                    placeholder="请选择监测结果"
                    value={this.state.result}
                    onChange={this.resultype}
                  >
                    <Option value="0">均未达标</Option>
                    <Option value="1">达标</Option>
                    <Option value="2">消毒柜未达标</Option>
                    <Option value="3">洗消时长未达标</Option>
                  </Select>
                  <Button type="primary" onClick={this.query}>查询</Button>
                  <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Table
                  dataSource={this.state.videoListDataSource}
                  columns={nodeInfoTableColumns}
                  pagination={false}
                />
              </div>
              <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                <Pagination
                  onShowSizeChange={this.onShowSizeChange}
                  defaultCurrent={1}
                  onChange={this.pagechange}
                  total={this.state.total}
                  hideOnSinglePage={true}
                  current={this.state.pageNum}
                />
              </div>
            </Card>
          </Content>
        </Layout>
      </Layout >
    );
  }
}

export default App;
