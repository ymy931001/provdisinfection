import React from "react";
import {
  Upload,
  Table,
  Layout,
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Modal,
  message,
  Cascader,
  Icon,
  DatePicker,
  Tooltip
} from "antd";
import { Link } from 'react-router-dom';
import {
  getVideoList,
  getDeviceList,
  detectionService,
  downloadimg,
  readinglist,
  detectionreading,
  getPictureAddress,
  imageExist,
  getchaincode,
  detectionServices,
  hotellist,
  getImage
} from "../axios";
import "./hospitaldisvideo.css";
import moment from 'moment';

const { Content, F } = Layout;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const timelinelist = [
  {
    "left": '0%',
    "width": "1px",
  },
  {
    "left": '12.5%',
    "width": "1px",
  },
  {
    "left": '25%',
    "width": "1px",
  },
  {
    "left": '37.5%',
    "width": "1px",
  },
  {
    "left": '50%',
    "width": "1px",
  },
  {
    "left": '62.5%',
    "width": "1px",
  },
  {
    "left": '75%',
    "width": "1px",
  },
  {
    "left": '87.5%',
    "width": "1px",
  },
  {
    "left": '99.8%',
    "width": "1px",
  },
]

const dateFormat = 'YYYY-MM-DD';

function callback(key) {
  console.log(key);
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      videoListDataSources: [],
      msg: true,
      site: undefined,
      name: undefined,
      hotelname: localStorage.getItem('hotelname') === null || localStorage.getItem('hotelname') === "undefined" || localStorage.getItem('hotelname') === undefined ? null : localStorage.getItem('hotelname'),
      addresslist: localStorage.getItem('addresslist') === "" || localStorage.getItem('addresslist') === null || localStorage.getItem('addresslist') === undefined ? localStorage.getItem('addresslist') : localStorage.getItem('addresslist').split(','),
      begintime: null,
      opentype: true,
      endtime: null,
      pdpage: false,
      indexs: 0,
      time1list: [],
      time2list: [],
      // page:localStorage.getItem('pagesize'),
      decendinglist: [{
        title: '开始时间',
        dataIndex: 'start',
        render: (text, record, index) => {
          if (new Date(record.end) - new Date(text) < 180000) {
            return (
              <div>
                {moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            )
          } else {
            return (
              <div style={{ fontWeight: 'bold' }}>
                {moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            )
          }
        }

      }, {
        title: '结束时间',
        dataIndex: 'end',
        render: (text, record, index) => {
          if (new Date(record.end) - new Date(record.start) < 180000) {
            return (
              <div>
                {moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            )
          } else {
            return (
              <div style={{ fontWeight: 'bold' }}>
                {moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            )
          }
        }

      }, {
        title: '截取图片',
        dataIndex: 'id',
        render: (text, record, index) =>
          <div onClick={() => this.lookimg(text, record, index)} style={{ color: '#1890ff', cursor: 'pointer' }}>
            查看
          </div>
      }],


   
      readouts: [{
        title: 'MAC',
        dataIndex: 'mac',
      }
        ,
      {
        title: '开始时间',
        dataIndex: 'begin',
        render: (text, record, index) => {
          return (
            <div>
              {moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          )
        }
      }, {
        title: '结束时间',
        dataIndex: 'end',
        render: (text, record, index) => {
          return (
            <div>
              {moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          )
        }
      }]
    };
    this.nodeInfoTableColumns = [
      {
        title: "酒店名称",
        dataIndex: "sitename",
      },
      {
        title: "监控酒店",
        dataIndex: "name",
      }, {
        title: "检测日期",
        dataIndex: "date",
        sorter: (a, b) => new Date(a) > new Date(b) ? 1 : -1,
      },
      {
        title: "工作时长",
        dataIndex: "runtime",
        render: (text, record, index) => {
          if (text === 0 && record.worktime === 0) {
            return (
              <div>
                <span style={{ color: 'red' }}>无记录</span>
              </div>
            )
          } else {
            return (
              <div>
                <a onClick={() => this.showhistory(text, record, index)}
                >详情</a>
              </div>
            )
          }
        }
      },
      {
        title: "检测结果",
        dataIndex: "result",
        render: (text, record, index) => {
          if (record.date === moment(new Date()).format("YYYY-MM-DD")) {
            if (text === "1") {
              return (
                <div>
                  <Button type="primary" style={{ border: '1px solid #28A745', background: '#28A745', borderRadius: '50px', fontSize: '14px' }}>已消毒</Button>
                </div>
              )
            } else if (text === "-1") {
              return (
                <div>
                  <span style={{ color: 'red' }}>异常</span>
                </div>
              )
            } else {
              return (
                <div>
                  <span style={{ color: 'blue' }}>进行中</span>
                </div>
              )
            }
          } else {
            if (text === 0) {
              return (
                <div>
                  <span style={{ color: 'red' }}>未达标</span>
                </div>
              )
            }
            if (text === 1) {
              return (
                <div>
                  <Button type="primary" style={{ border: '1px solid #28A745', background: '#28A745', borderRadius: '50px', fontSize: '14px' }}>已消毒</Button>
                  {/* <span style={{ color: 'green' }}>已消毒</span> */}
                </div>
              )
            }
            if (text === -1) {
              return (
                <div>
                  <span style={{ color: 'red' }}>
                    <Tooltip placement="topLeft" title={'离线时间过长'}>
                      &nbsp;&nbsp;异常
                    </Tooltip>
                  </span>
                </div>
              )
            }
            if (record.status === 5) {
              if (text === 2) {
                return (
                  <div>
                    <span style={{ color: 'red' }}>未达标</span>
                  </div>
                )
              }
            } else {
              if (text === 2) {
                return (
                  <div>
                    <span style={{ color: 'red' }}>未达标</span>
                  </div>
                )
              }
            }
            if (text === null) {
              return (
                <div>
                  <span >无</span>
                </div>
              )
            }
          }
        }
      },
      {
        title: "详情",
        dataIndex: "id",
        render: (text, record, index) => {
          return (
            <div>
              <div onClick={() => this.findpicture(text, record, index)} style={{ display: 'inline-block' }} >
                <a href={this.state.export1} >
                  图片下载
              </a>
              </div>
              <span onClick={() => this.findvideo(text, record, index)} style={{ color: '#40a9ff', cursor: 'pointer', marginLeft: '10PX' }} >
                视频播放
            </span>

            </div>
          )
        }
      }, {
        title: "交易ID",
        dataIndex: "txid",
        render: (text, record, index) => {
          if (text === null) {
            return (
              <div>
                <span>暂无</span>
              </div>
            )
          }
          else {
            return (
              <div style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.modelone(text, record, index)}>
                <Tooltip title={text}>
                  <span> {text.substring(0, 10) + "......"}</span>
                </Tooltip>
              </div>
            )
          }
        }
      }
    ];
  }


  componentWillMount() {
    document.title = "医院消毒--监测列表";
  }

  componentDidMount() {
    localStorage.setItem('imgopen', true)
    console.log(localStorage.getItem("addresslist"))
    getDeviceList([

    ]).then(res => {
      if (res.data.data === null) {
        this.setState({
          deviceList: []
        });
      } else {
        this.setState({
          deviceList: res.data.data
        });
      }
    });

    hotellist().then(res => {
      var arr = []
      for (var i in res.data.data) {
        arr.push({
          'id': i,
          'value': res.data.data[i]
        })
      }
      localStorage.setItem('sitelist', JSON.stringify(arr))
    });

    this.detectionService()
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  detectionService = () => {
    detectionService([
      localStorage.getItem("site") === "null" ? null : localStorage.getItem("site"),
      this.state.hotelname,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        // if (res.data.data === null) {
        //   this.setState({
        //     videoListDataSource: []
        //   })
        // } else {
        //   var arr = []
        //   var arrs = []
        //   for (var i in res.data.data) {
        //     if (res.data.data[i].deviceid === 1) {
        //       if (res.data.data[i].date === moment(new Date()).format("YYYY-MM-DD")) {
        //         arr.push(res.data.data[i])
        //       } else {
        //         arrs.push(res.data.data[i])
        //       }
        //     }
        //   }
        //   this.setState({
        //     videoListDataSource: arrs,
        //     videoListDataSources: arr,
        //   }, function () {
        //     if (res.data.data.length < 10) {
        //       this.setState({
        //         page: false
        //       })
        //     } else {
        //       this.setState({
        //         page: true
        //       })
        //     }
        //   })
        // }
      }
    })
  }

  findpicture = (text, record, index) => {

    imageExist([
      text
    ]).then(res => {
      if (record.valid === 0) {
        message.error('暂无图片')
      } else {
        if (res.data.data.ifExist === true) {
          window.open('http://47.94.211.109:9090/download/image?token=' + localStorage.getItem('token') + "&pictureAddress=" + res.data.data.pictureAddress + "&zipAddress=" + res.data.data.zipAddress, '_self')
        } else {
          message.error('暂无图片')
        }
      }
    });
  }



  findvideo(text, record, index) {
    console.log(record)
    if (record.videoAddress != null) {
      localStorage.setItem('videoid', record.videoAddress.replace("D:", ""))
    }
    localStorage.setItem('hotelnames', record.sitename)
    localStorage.setItem('floor', record.name)
    if (record.valid === 0) {
      message.error('此时间段无视频')
    }
    if (record.valid === -1) {
      message.error('此时间段无视频')
    }
    if (record.valid === 1) {
      window.location.href = "/app/video"
    }
  }

  timeonChange = (value, dateString) => {
    this.setState({
      begintime: dateString[0],
      endtime: dateString[1],
    });
  }

  motionclick = (text, record, index) => {
    console.log(JSON.parse(text))
    var arr = []
    for (var i in JSON.parse(text)) {
      if (JSON.parse(text)[i].confident != undefined) {
        arr.push(
          JSON.parse(text)[i]
        )
      }
    }
    this.setState({
      imgid: record.id,
      motionvisible: true,
      motiondata: arr
    })
  }

  addresschange = (e) => {
    console.log(e)
    this.setState({
      site: e[0],
      name: e[1],
      addresslist: e
    }, function () {
      localStorage.setItem('site', this.state.site === undefined ? null : this.state.site);
      localStorage.setItem('hotelname', this.state.name);
      localStorage.setItem('addresslist', this.state.addresslist);
    });
  }

  lookimg = (text, record, index) => {
    if (JSON.stringify(record.confident) === "{}") {
      if (record.indexs === undefined || record.indexs === "undefined" || record.indexs.length === 0) {
        message.error('暂无图片')
      } else {
        getImage([
          this.state.imgid,
          record.indexs[Math.floor(Math.random() * (record.indexs.length))],
        ]).then(res => {
          if (res.data && res.data.message === "success") {

            this.setState({
              // imgvisible: true,
              lookimgurl: 'http://scdisinfection.terabits.cn' + res.data.data.replace("D:/", "")
            })
          }
        });
      }
    } else {
      var max = 0
      var indexs = 0
      for (var i in record.confident) {
        console.log(JSON.parse(record.confident[i]) > this.state.indexs)
        var max = JSON.parse(record.confident[i]) > this.state.indexs ? JSON.parse(record.confident[i]) : max
        var indexs = i
      }
      getImage([
        this.state.imgid,
        indexs,
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          console.log(res.data.data.replace("D:/", ""))
          this.setState({
            // imgvisible: true,
            lookimgurl: 'http://scdisinfection.terabits.cn/' + res.data.data.replace("D:/", "")
          })
        }
      });
    }
  }


  handleCancel = (e) => {
    this.setState({
      decendingmodel: false,
      historyvisible: false,
      pleadingvisible: false,
      imgvisible: false,
      motionvisible: false,
      lookimgurl: '',
      cupboarddis: 'block',
      motionimgurl: '',
      time1list: [],
      time2list: [],
    });
  }

  modelone = (text, record, index) => {
    getchaincode([
      record.txid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          pleadingvisible: true,
          txid: text,
          blockhash: res.data.data.blockhash,
          blocknumber: res.data.data.blocknumber,
          blocksize: res.data.data.blocksize,
          blocktxcount: res.data.data.blocktxcount,
          date: res.data.data.date,
          preblockhash: res.data.data.preblockhash,
        })
      }
    });
  }


  query = () => {
    detectionService([
      this.state.site,
      this.state.name,
      this.state.begintime,
      this.state.endtime,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var arr = []
        var arrs = []
        for (var i in res.data.data) {
          if (res.data.data[i].date === moment(new Date()).format("YYYY-MM-DD")) {
            arr.push(res.data.data[i])
          } else {
            arrs.push(res.data.data[i])
          }
        }
        this.setState({
          videoListDataSource: arrs,
          videoListDataSources: arr,
        })
      }
    });
  }

  //工作时长详情
  state = { historyvisible: false }
  showhistory = (text, record, index) => {
    localStorage.setItem('mac', record.mac)
    this.setState({
      historyvisible: true,
      imgid: record.id,
      readout: JSON.parse(record.readings),
      decendingdatas: eval(record.timepairs),
      time1: Math.ceil(record.runtime / 60),
      time2: Math.ceil(record.worktime / 60)
    }, function () {
      if (this.state.time1 === 0) {
        this.setState({
          cupboarddis: 'none'
        })
      } else {
        this.setState({
          cupboarddis: 'block'
        })
      }
      if (JSON.parse(record.readings) != null) {
        if (JSON.parse(record.readings).length < 10) {
          this.setState({
            pages: false
          })
        } else {
          this.setState({
            pages: {
              pageSize: 10, // 每页条数
            }
          })
        }
      }

      if (this.state.decendingdatas != null) {
        if (this.state.decendingdatas.length < 10) {
          this.setState({
            pdpage: false
          })
        } else {
          this.setState({
            pdpage: {
              pageSize: 10, // 每页条数
            }
          })
        }
      }




      if (this.state.readout != null) {
        if (this.state.readout.length != 0) {
          console.log(111)
          var arr = []
          for (var i in JSON.parse(record.readings)) {
            var num1 = moment(JSON.parse(record.readings)[i].begin).format('HH:mm:ss')
            var num2 = moment(JSON.parse(record.readings)[i].end).format('HH:mm:ss')
            arr.push({
              'left': ((Number(num1.split(':')[0] * 3600) + Number(num1.split(':')[1] * 60) + Number(num1.split(':')[2])) / 86400).toFixed(5) * 452 + "px",
              'width': ((Number(num2.split(':')[0] * 3600) + Number(num2.split(':')[1] * 60) + Number(num2.split(':')[2]) -
                Number(num1.split(':')[0] * 3600) - Number(num1.split(':')[1] * 60) - Number(num1.split(':')[2])) / 864).toFixed(1) <= 0.1 ?
                '1px' : ((Number(num2.split(':')[0] * 3600) + Number(num2.split(':')[1] * 60) + Number(num2.split(':')[2]) -
                  Number(num1.split(':')[0] * 3600) - Number(num1.split(':')[1] * 60) - Number(num1.split(':')[2])) / 864).toFixed(1) + '%',
              'time': moment(JSON.parse(record.readings)[i].begin).format('HH:mm:ss') + " ~ " + moment(JSON.parse(record.readings)[i].end).format('HH:mm:ss')
            })
          }
          console.log(arr)
          this.setState({
            time1list: arr,
          })
        }
      }

      if (this.state.decendingdatas != null) {
        if (this.state.decendingdatas.length != 0 && this.state.decendingdatas != null) {
          var newarr = []
          for (var i in eval(record.timepairs)) {
            var num3 = moment(eval(record.timepairs)[i].start).format('HH:mm:ss')
            var num4 = moment(eval(record.timepairs)[i].end).format('HH:mm:ss')
            newarr.push({
              'left': ((Number(num3.split(':')[0] * 3600) + Number(num3.split(':')[1] * 60) + Number(num3.split(':')[2])) / 86400).toFixed(5) * 452 + "px",
              'width': ((Number(num4.split(':')[0] * 3600) + Number(num4.split(':')[1] * 60) + Number(num4.split(':')[2]) -
                Number(num3.split(':')[0] * 3600) - Number(num3.split(':')[1] * 60) - Number(num3.split(':')[2])) / 864).toFixed(1) <= 0.1 ?
                '1px' : ((Number(num4.split(':')[0] * 3600) + Number(num4.split(':')[1] * 60) + Number(num4.split(':')[2]) -
                  Number(num3.split(':')[0] * 3600) - Number(num3.split(':')[1] * 60) - Number(num3.split(':')[2])) / 864).toFixed(1) + "%",
              'time': moment(eval(record.timepairs)[i].start).format('HH:mm:ss') + " ~ " + moment(eval(record.timepairs)[i].end).format('HH:mm:ss')
            })
          }
          console.log(newarr)
          this.setState({
            time2list: newarr,
          })
        }
      }
    });
  }

  tablechange = (a, b, c, d) => {
    localStorage.setItem('pagesize', a.current)
  }



  render() {
    const time1line = this.state.time1list.map((province) =>
      <Tooltip title={province.time}>
        <span style={{ position: 'absolute', width: province.width, left: province.left, height: '10px', top: 0, background: '#b10be8' }} >
        </span>
      </Tooltip>
    );
    const timelines = timelinelist.map((province) =>
      <Tooltip>
        <span style={{ position: 'absolute', width: province.width, left: province.left, height: '5px', top: '-5px', background: '#999' }} >
        </span>
      </Tooltip>
    );
    const time2line = this.state.time2list.map((province) =>
      <Tooltip title={province.time}>
        <span style={{ position: 'absolute', width: province.width, left: province.left, height: '10px', top: '-10px', background: '#139df4' }} ></span>
      </Tooltip>
    );
    return (
      <Layout style={{ minHeight: "100vh" }} id="videodata">
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="医院消毒--监测列表" id="nodeManage" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}>
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="历史数据" key="1">
                  <div className="gutter-example-nodemanage">
                    设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                <Cascader
                      options={this.state.deviceList}
                      onChange={this.addresschange}
                      value={this.state.addresslist}
                      changeOnSelect
                      style={{ width: "250px", marginRight: '20px' }}
                      placeholder="选择医院：消毒间" />
                    时间&nbsp;:
                    <RangePicker
                      style={{ marginLeft: '20px', marginRight: '20px' }}
                      format={dateFormat}
                      ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                      onChange={this.timeonChange}
                    // value={[moment(this.state.begintime, dateFormat), moment(this.state.endtime, dateFormat)]}
                    />
                    <Button type="primary" onClick={this.query}>查询</Button>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Table
                      dataSource={this.state.videoListDataSource}
                      columns={this.nodeInfoTableColumns}
                      // pagination={this.state.page}
                      onChange={this.tablechange}
                    />
                  </div>
                </TabPane>
                <TabPane tab="当日数据" key="2" style={{ minHeight: "700px", marginLeft: '20px' }}>
                  <div className="gutter-example-nodemanage" >
                    设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                <Cascader
                      options={this.state.deviceList}
                      onChange={this.addresschange}
                      value={this.state.addresslist}
                      changeOnSelect
                      style={{ width: "250px", marginRight: '20px' }}
                      placeholder="选择医院：消毒间" />
                    <Button type="primary" onClick={this.query}>查询</Button>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Table
                      dataSource={this.state.videoListDataSources}
                      columns={this.nodeInfoTableColumns}
                      // pagination={this.state.page}
                      onChange={this.tablechange}
                    />
                  </div>
                </TabPane>
              </Tabs>
              <Modal
                title="工作详情"
                width='500px'
                destroyOnClose
                visible={this.state.historyvisible}
                centered
                footer={null}
                onCancel={this.handleCancel}
                mask={false}
              >
                <div className="timeline">
                  <div className="lefttime">0时</div>
                  <div className="lefttime1">3时</div>
                  <div className="lefttime2">6时</div>
                  <div className="lefttime3">9时</div>
                  <div className="lefttime4">12时</div>
                  <div className="lefttime5">15时</div>
                  <div className="lefttime6">18时</div>
                  <div className="lefttime7">21时</div>
                  {time1line}
                  {time2line}
                  {timelines}
                  <div className="righttime">24时</div>
                </div>
                <div className="titlebot">
                  工作人员消毒时间 <span className="botleft"></span>
                  <span style={{ display: this.state.cupboarddis }}>消毒柜工作时间 <span className="botright"></span></span>
                </div>
                <div className="modeltitle">工作人员消毒时长:&nbsp;&nbsp;{this.state.time2}&nbsp;&nbsp;分</div>
                <Table
                  dataSource={this.state.decendingdatas}
                  columns={this.state.decendinglist}
                  pagination={this.state.pdpage}
                  rowClassName="editable-row"
                  style={{ width: '100%', textAlign: 'center' }}
                  bordered
                />
                <div style={{ display: this.state.cupboarddis }}>
                  <div className="modeltitle">消毒柜工作时长:&nbsp;&nbsp;{this.state.time1}&nbsp;&nbsp;分</div>
                  <Table
                    bordered
                    dataSource={this.state.readout}
                    columns={this.state.readouts}
                    pagination={this.state.pages}
                    rowClassName="editable-row"
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <img src={this.state.lookimgurl} alt="" style={{ width: '100%' }} />
                </div>
              </Modal>

        
              <Modal
                title="交易信息"
                visible={this.state.pleadingvisible}
                onCancel={this.handleCancel}
                footer={null}
                destroyOnClose
                centered
                mask={false}
                width='650px'
              >
                <div>
                  交易ID：{this.state.txid}
                </div>
                <br />
                <div>
                  块号：{this.state.blocknumber}
                </div>
                <br />
                <div>
                  块大小：{this.state.blocksize}
                </div>
                <br />
                <div>
                  当前块交易数量：{this.state.blocktxcount}
                </div>
                <br />
                <div>
                  块Hash：{this.state.blockhash}
                </div>
                <br />
                <div>
                  上一个块Hash：{this.state.preblockhash}
                </div>
                <br />
                <div>
                  创建时间：{this.state.date}
                </div>
              </Modal>
            </Card>
          </Content>

        </Layout>
      </Layout >
    );
  }
}

export default App;
