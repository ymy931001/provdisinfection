import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Tabs,
  Modal,
  message,
  Cascader,
  Pagination,
  DatePicker,
  Tooltip
} from "antd";
import {
  getDeviceList,
  detectionService,
  imageExist,
  getImage
} from "../axios";
import "./hospitalvideo.css";
import moment from 'moment';

const { Content} = Layout;
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
      begintime: null,
      opentype: true,
      endtime: null,
      pdpage: false,
      indexs: 0,
      pageNum: 1,
      pageNumSize: 10,
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
    };

    this.nodeInfoTableColumns = [
      {
        title: "医院名称",
        dataIndex: "room.siteName",
      },
      {
        title: "监控酒店",
        dataIndex: "room.name",
      }, {
        title: "检测日期",
        dataIndex: "detection.date",
        sorter: (a, b) => new Date(a) > new Date(b) ? 1 : -1,
        render: (text, record, index) => {
          return (
            <div>
              {moment(new Date(text)).format('YYYY-MM-DD')}
            </div>
          )
        }
      },
      {
        title: "抓拍片段",
        dataIndex: "detection.runtime",
        render: (text, record, index) => {
          if (text === 0 && record.detection.worktime === 0) {
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
      // {
      //   title: "检测结果",
      //   dataIndex: "detection.result",
      //   render: (text, record, index) => {
      //     if (record.date === moment(new Date()).format("YYYY-MM-DD")) {
      //       if (text === "1") {
      //         return (
      //           <div>
      //             <Button type="primary" style={{ border: '1px solid #28A745', background: '#28A745', borderRadius: '50px', fontSize: '14px' }}>已消毒</Button>
      //           </div>
      //         )
      //       } else if (text === "-1") {
      //         return (
      //           <div>
      //             <span style={{ color: 'red' }}>异常</span>
      //           </div>
      //         )
      //       } else {
      //         return (
      //           <div>
      //             <span style={{ color: 'blue' }}>进行中</span>
      //           </div>
      //         )
      //       }
      //     } else {
      //       if (text === 0) {
      //         return (
      //           <div>
      //             <span style={{ color: 'red' }}>未达标</span>
      //           </div>
      //         )
      //       }
      //       if (text === 1) {
      //         return (
      //           <div>
      //             <Button type="primary" style={{ border: '1px solid #28A745', background: '#28A745', borderRadius: '50px', fontSize: '14px' }}>已消毒</Button>
      //             {/* <span style={{ color: 'green' }}>已消毒</span> */}
      //           </div>
      //         )
      //       }
      //       if (text === -1) {
      //         return (
      //           <div>
      //             <span style={{ color: 'red' }}>
      //               <Tooltip placement="topLeft" title={'离线时间过长'}>
      //                 &nbsp;&nbsp;异常
      //               </Tooltip>
      //             </span>
      //           </div>
      //         )
      //       }
      //       if (record.status === 5) {
      //         if (text === 2) {
      //           return (
      //             <div>
      //               <span style={{ color: 'red' }}>未达标</span>
      //             </div>
      //           )
      //         }
      //       } else {
      //         if (text === 2) {
      //           return (
      //             <div>
      //               <span style={{ color: 'red' }}>未达标</span>
      //             </div>
      //           )
      //         }
      //       }
      //       if (text === null) {
      //         return (
      //           <div>
      //             <span >无</span>
      //           </div>
      //         )
      //       }
      //     }
      //   }
      // },
      {
        title: "详情",
        dataIndex: "detection.id",
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
      }
    ];
  }


  componentWillMount() {
    document.title = "医废管理--监测列表";
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

    // hotellist().then(res => {
    //   var arr = []
    //   for (var i in res.data.data) {
    //     arr.push({
    //       'id': i,
    //       'value': res.data.data[i]
    //     })
    //   }
    //   localStorage.setItem('sitelist', JSON.stringify(arr))
    // });

    this.detectionService()
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  detectionService = () => {
    detectionService([
      this.state.pageNum,
      this.state.pageNumSize,
      2,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        if (res.data.data === null) {
          this.setState({
            videoListDataSource: []
          })
        } else {
          var arr = []
          var arrs = []

          for (var i in res.data.data.detectionVOList) {
            if (moment(res.data.data.detectionVOList[i].detection.date).format("YYYY-MM-DD") === moment(new Date()).format("YYYY-MM-DD")) {
              arr.push(res.data.data.detectionVOList[i])
            } else {
              arrs.push(res.data.data.detectionVOList[i])
            }
          }
          this.setState({
            videoListDataSource: arrs,
            total: res.data.data.total,
            totals: arr.length,
            videoListDataSources: arr,
          })
        }
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
    if (record.detection.videoAddress != null) {
      localStorage.setItem('videoid', record.detection.videoAddress)
    }
    localStorage.setItem('hotelnames', record.room.siteName)
    localStorage.setItem('floor', record.room.name)
    if (record.detection.valid === 0) {
      message.error('此时间段无视频')
    }
    if (record.detection.valid === -1) {
      message.error('此时间段无视频')
    }
    if (record.detection.valid === 1) {
      window.location.href = "/app/video"
    }
  }

  timeonChange = (value, dateString) => {
    this.setState({
      begintime: dateString[0],
      endtime: dateString[1],
    });
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
    console.log(record)
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
        max = JSON.parse(record.confident[i]) > this.state.indexs ? JSON.parse(record.confident[i]) : max
        indexs = i
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


  query = () => {
    detectionService([
      this.state.pageNum,
      this.state.pageNumSize,
      2,
      this.state.site,
      this.state.name,
      this.state.begintime,
      this.state.endtime,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        if (res.data.data.pageInfo === null) {
          this.setState({
            total: 0,
            videoListDataSource: [],
            videoListDataSources: [],
          })
        } else {
          var arr = []
          var arrs = []
          for (var i in res.data.data.detectionVOList) {
            if (moment(res.data.data.detectionVOList[i].detection.date).format("YYYY-MM-DD") === moment(new Date()).format("YYYY-MM-DD")) {
              arr.push(res.data.data.detectionVOList[i])
            } else {
              arrs.push(res.data.data.detectionVOList[i])
            }
          }
          this.setState({
            total: res.data.data.total,
            totals: arr.length,
            videoListDataSource: arrs,
            videoListDataSources: arr,
          })
        }
      }
    });
  }

  //工作时长详情
  state = { historyvisible: false }
  showhistory = (text, record, index) => {
    this.setState({
      historyvisible: true,
      imgid: record.detection.id,
      readout: JSON.parse(record.detection.readings),
      decendingdatas: JSON.parse(record.detection.timepairs),
      time1: Math.ceil(record.detection.runtime / 60),
      time2: Math.ceil(record.detection.worktime / 60)
    }, function () {
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
      if (this.state.decendingdatas != null) {
        if (this.state.decendingdatas.length !== 0 && this.state.decendingdatas !== null) {
          var newarr = []
          for (var i in this.state.decendingdatas) {
            var num3 = moment(this.state.decendingdatas[i].start).format('HH:mm:ss')
            var num4 = moment(this.state.decendingdatas[i].end).format('HH:mm:ss')
            newarr.push({
              'left': ((Number(num3.split(':')[0] * 3600) + Number(num3.split(':')[1] * 60) + Number(num3.split(':')[2])) / 86400).toFixed(5) * 452 + "px",
              'width': ((Number(num4.split(':')[0] * 3600) + Number(num4.split(':')[1] * 60) + Number(num4.split(':')[2]) -
                Number(num3.split(':')[0] * 3600) - Number(num3.split(':')[1] * 60) - Number(num3.split(':')[2])) / 864).toFixed(1) <= 0.1 ?
                '1px' : ((Number(num4.split(':')[0] * 3600) + Number(num4.split(':')[1] * 60) + Number(num4.split(':')[2]) -
                  Number(num3.split(':')[0] * 3600) - Number(num3.split(':')[1] * 60) - Number(num3.split(':')[2])) / 864).toFixed(1) + "%",
              'time': moment(this.state.decendingdatas.start).format('HH:mm:ss') + " ~ " + moment(this.state.decendingdatas.end).format('HH:mm:ss')
            })
          }
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

  //分页

  pagechange = (page, num) => {
    console.log(page, num)
    console.log(this.state.endtime)
    this.setState({
      pageNum: page,
      pageNumSize: num,
    }, function () {
      detectionService([
        this.state.pageNum,
        this.state.pageNumSize,
        2,
        this.state.site,
        this.state.name,
        this.state.begintime,
        this.state.endtime,
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          if (res.data.data === null) {
            this.setState({
              videoListDataSource: []
            })
          } else {
            var arr = []
            var arrs = []

            for (var i in res.data.data.detectionVOList) {
              if (moment(res.data.data.detectionVOList[i].detection.date).format("YYYY-MM-DD") === moment(new Date()).format("YYYY-MM-DD")) {
                arr.push(res.data.data.detectionVOList[i])
              } else {
                arrs.push(res.data.data.detectionVOList[i])
              }
            }
            this.setState({
              videoListDataSource: arrs,
              total: res.data.data.total,
              totals: arr.length,
              videoListDataSources: arr,
            })
          }
        }
      })

    })
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
      <Layout style={{ minHeight: "100vh" }} id="hospitalvideodata">
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="医废管理--监测列表" id="nodeManage" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}>
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="历史数据" key="1">
                  <div className="gutter-example-nodemanage">
                    设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                <Cascader
                      fieldNames={{ label: 'name', value: 'id' }}
                      options={this.state.deviceList}
                      onChange={this.addresschange}
                      value={this.state.addresslist}
                      changeOnSelect
                      style={{ width: "250px", marginRight: '20px' }}
                      placeholder="选择医废间" />
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
                      pagination={false}
                      onChange={this.tablechange}
                    />
                  </div>
                  <div className="pageone">
                    <Pagination
                      onShowSizeChange={this.onShowSizeChange}
                      defaultCurrent={1}
                      onChange={this.pagechange}
                      total={this.state.total}
                      hideOnSinglePage={true}
                    />
                  </div>
                </TabPane>
                <TabPane tab="当日数据" key="2" style={{ minHeight: "700px", marginLeft: '20px' }}>
                  <div className="gutter-example-nodemanage" >
                    设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                <Cascader
                      fieldNames={{ label: 'name', value: 'id' }}
                      options={this.state.deviceList}
                      onChange={this.addresschange}
                      value={this.state.addresslist}
                      changeOnSelect
                      style={{ width: "250px", marginRight: '20px' }}
                      placeholder="选择医废间" />
                    <Button type="primary" onClick={this.query}>查询</Button>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Table
                      dataSource={this.state.videoListDataSources}
                      columns={this.nodeInfoTableColumns}
                      pagination={false}
                      onChange={this.tablechange}
                    />
                  </div>
                  <div className="pageone">
                    <Pagination
                      onShowSizeChange={this.onShowSizeChange}
                      defaultCurrent={1}
                      onChange={this.pagechanges}
                      total={this.state.totals}
                      hideOnSinglePage={true}
                    />
                  </div>
                </TabPane>
              </Tabs>
              <Modal
                title="抓拍详情"
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
                  摄像头抓拍时间 <span className="botleft"></span>
                </div>
                <div className="modeltitle">摄像头抓拍时长:&nbsp;&nbsp;{this.state.time2}&nbsp;&nbsp;分</div>
                <Table
                  dataSource={this.state.decendingdatas}
                  columns={this.state.decendinglist}
                  pagination={this.state.pdpage}
                  rowClassName="editable-row"
                  style={{ width: '100%', textAlign: 'center' }}
                  bordered
                />
                <div style={{ width: '100%' }}>
                  <img src={this.state.lookimgurl} alt="" style={{ width: '100%' }} />
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
