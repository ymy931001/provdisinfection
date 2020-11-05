import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Modal,
  message,
  Cascader,
  Input,
  DatePicker,
  Pagination,
  Tooltip
} from "antd";
import {
  // newdetection,
  imageExist,
  getchaincode,
  newdetectionsearch,
  getregion,
  detectionvison
} from "../axios";
import "./hotelvideo.css";
import moment from 'moment';

const { Content } = Layout;
const { RangePicker } = DatePicker;


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



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      videoListDataSources: [],
      msg: true,
      site: undefined,
      name: undefined,
      pageNum: 1,
      pageNumSize: 10,
      hotelname: localStorage.getItem('hotelname') === null || localStorage.getItem('hotelname') === "undefined" || localStorage.getItem('hotelname') === undefined ? null : localStorage.getItem('hotelname'),
      // addresslist: localStorage.getItem('addresslist') === "" || localStorage.getItem('addresslist') === null || localStorage.getItem('addresslist') === undefined ? localStorage.getItem('addresslist') : localStorage.getItem('addresslist').split(','),
      begintime: undefined,
      opentype: true,
      endtime: undefined,
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

      }
        , {
        title: '截取图片',
        dataIndex: 'id',
        render: (text, record, index) =>
          <div onClick={() => this.lookimg(text, record, index)} style={{ color: '#1890ff', cursor: 'pointer' }}>
            查看
            </div>
      }
      ],



      readouts: [
        //   {
        //   title: 'MAC',
        //   dataIndex: 'mac',
        // }
        //   ,
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
        dataIndex: "siteName",
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
      }, {
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
      }
    ];
  }


  componentWillMount() {
    document.title = "视频监测-杯具消毒";
  }

  componentDidMount() {
    localStorage.setItem('imgopen', true)
    console.log(localStorage.getItem("addresslist"))

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

    detectionvison([
      1192
    ]).then(res => {

    })

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
    newdetectionsearch([
      this.state.pageNum,
      this.state.pageNumSize,
      null,
      null,
      null,
      null,
      moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD")
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
  }

  findpicture = (text, record, index) => {
    imageExist([
      text
    ]).then(res => {
      if (record.valid === 0) {
        message.error('暂无图片')
      } else {
        if (res.data.data.ifExist === true) {
          // getPictureAddress([
          //   res.data.data.zipAddress,
          //   111
          // ]).then(res => {

          // })
          window.open('http://iva.terabits.cn:9090/download/image?zipAddress=' + res.data.data.zipAddress, '_self')
        } else {
          message.error('暂无图片')
        }
      }
    });
  }



  //房间搜索
  findroom = (text, record, index) => {
    this.setState({
      keytext: text
    })
    newdetectionsearch([
      this.state.pageNum,
      this.state.pageNumSize,
      null,
      null,
      record.siteId,
      null,
      this.state.endtime === undefined ? moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
      text
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
  }


  findvideo(text, record, index) {
    console.log(record)
    if (record.videoAddress != null) {
      localStorage.setItem('videoid', record.videoAddress.replace("D:", ""))
    }
    localStorage.setItem('hotelnames', record.siteName)
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

  //时间选择
  timeonChange = (value, dateString) => {
    console.log(dateString)
    if (dateString[0] === "") {
      this.setState({
        begintime: undefined
      })
    } else {
      this.setState({
        begintime: moment(dateString[0]),
      });
    }
    if (dateString[1] === "") {
      this.setState({
        endtime: undefined
      })
    } else {
      this.setState({
        endtime: moment(dateString[1]),
      });
    }
  }


  motionclick = (text, record, index) => {
    console.log(JSON.parse(text))
    var arr = []
    for (var i in JSON.parse(text)) {
      if (JSON.parse(text)[i].confident != undefined) { //eslint-disable-line
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

  //设备位置选择
  addresschange = (e) => {
    console.log(e)
    this.setState({
      addresslist: e,
      cityid: e[0] === undefined ? null : e[0],
      areaid: e[1] === undefined ? null : e[1],
      siteId: e[2] === undefined ? null : e[2]
    });
  }

  lookimg = (text, record, index) => {
    console.log(record.timePiarsInfo)
    var arr = []
    for (var i in record.timePiarsInfo) {
      if (record.timePiarsInfo[i].file != undefined) { //eslint-disable-line
        arr.push(record.timePiarsInfo[i])
      }
    }
    if (arr.length != 0) {  //eslint-disable-line
      this.setState({
        lookimgurl: 'http://iva.terabits.cn/' + arr[0].file
      })
    } else {
      message.error('暂无图片')
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
      cupboarddiss: 'block',
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
    newdetectionsearch([
      1,
      10,
      this.state.cityid,
      this.state.areaid,
      this.state.siteId,
      this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
      this.state.endtime === undefined ? moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
      this.state.keytext,
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
    })
  }

  //工作时长详情
  state = { historyvisible: false }
  showhistory = (text, record, index) => {
    console.log(record)
    detectionvison([
      record.id
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var arr = []
        if (res.data.data.timepairs !== undefined) {
          for (var i in JSON.parse(res.data.data.timepairs)) {
            if ((JSON.parse(res.data.data.timepairs)[i].end - JSON.parse(res.data.data.timepairs)[i].start) > 0) {
              arr.push(JSON.parse(res.data.data.timepairs)[i])
            }
          }
        } else {
          for (var j in res.data.data.timePiarsList) {
            if ((res.data.data.timePiarsList[j].end - res.data.data.timePiarsList[j].start) > 0) {
              arr.push(res.data.data.timePiarsList[j])
            }
          }
        }
        this.setState({
          historyvisible: true,
          imgid: res.data.data.id,
          readout: res.data.data.readings === undefined ? [] : JSON.parse(res.data.data.readings),
          decendingdatas: arr,
          time1: Math.ceil(res.data.data.runtime / 60),
          time2: Math.ceil(res.data.data.worktime / 60)
        }, function () {
          console.log(this.state.readout)
          if (this.state.time1 === 0) {
            this.setState({
              cupboarddis: 'none',
              cupboarddiss: 'none',
            })
          } else {
            this.setState({
              cupboarddis: 'block',
              cupboarddiss: 'inline-block',
            })
          }
          if (this.state.readout != null) {
            if (this.state.readout.length < 10) {
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
            if (this.state.readout.length != 0) {  //eslint-disable-line
              console.log(111)
              var arr = []
              for (var i in JSON.parse(res.data.data.readings)) {
                var num1 = moment(JSON.parse(res.data.data.readings)[i].begin).format('HH:mm:ss')
                var num2 = moment(JSON.parse(res.data.data.readings)[i].end).format('HH:mm:ss')
                arr.push({
                  'left': ((Number(num1.split(':')[0] * 3600) + Number(num1.split(':')[1] * 60) + Number(num1.split(':')[2])) / 86400).toFixed(5) * 452 + "px",
                  'width': ((Number(num2.split(':')[0] * 3600) + Number(num2.split(':')[1] * 60) + Number(num2.split(':')[2]) -
                    Number(num1.split(':')[0] * 3600) - Number(num1.split(':')[1] * 60) - Number(num1.split(':')[2])) / 864).toFixed(1) <= 0.1 ?
                    '1px' : ((Number(num2.split(':')[0] * 3600) + Number(num2.split(':')[1] * 60) + Number(num2.split(':')[2]) -
                      Number(num1.split(':')[0] * 3600) - Number(num1.split(':')[1] * 60) - Number(num1.split(':')[2])) / 864).toFixed(1) + '%',
                  'time': moment(JSON.parse(res.data.data.readings)[i].begin).format('HH:mm:ss') + " ~ " + moment(JSON.parse(res.data.data.readings)[i].end).format('HH:mm:ss')
                })
              }
              console.log(arr)
              this.setState({
                time1list: arr,
              })
            }
          }

          if (this.state.decendingdatas != null) {
            if (this.state.decendingdatas.length != 0 && this.state.decendingdatas != null) {  //eslint-disable-line
              var newarr = []
              for (var k in this.state.decendingdatas) {
                var num3 = moment(this.state.decendingdatas[k].start).format('HH:mm:ss')
                var num4 = moment(this.state.decendingdatas[k].end).format('HH:mm:ss')
                newarr.push({
                  'left': ((Number(num3.split(':')[0] * 3600) + Number(num3.split(':')[1] * 60) + Number(num3.split(':')[2])) / 86400).toFixed(5) * 452 + "px",
                  'width': ((Number(num4.split(':')[0] * 3600) + Number(num4.split(':')[1] * 60) + Number(num4.split(':')[2]) -
                    Number(num3.split(':')[0] * 3600) - Number(num3.split(':')[1] * 60) - Number(num3.split(':')[2])) / 864).toFixed(1) <= 0.1 ?
                    '1px' : ((Number(num4.split(':')[0] * 3600) + Number(num4.split(':')[1] * 60) + Number(num4.split(':')[2]) -
                      Number(num3.split(':')[0] * 3600) - Number(num3.split(':')[1] * 60) - Number(num3.split(':')[2])) / 864).toFixed(1) + "%",
                  'time': moment(this.state.decendingdatas[k].start).format('HH:mm:ss') + " ~ " + moment(this.state.decendingdatas[k].end).format('HH:mm:ss')
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
    })

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
      newdetectionsearch([
        this.state.pageNum,
        this.state.pageNumSize,
        this.state.cityid,
        this.state.areaid,
        this.state.siteId,
        this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
        this.state.endtime === undefined ? moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
        this.state.keytext,
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

  //重置
  reset = () => {
    this.setState({
      cityid: undefined,
      areaid: undefined,
      siteId: undefined,
      addresslist: [],
      keytext: undefined,
      begintime: undefined,
      endtime: undefined,
    }, function () {
      this.detectionService()
    })
  }

  //关键字录入
  keytext = (e) => {
    this.setState({
      keytext: e.target.value
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
      <Layout >
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="hotelvideo" >
            <Card title="视频监测-杯具消毒" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}>
              <div className="gutter-example-nodemanage">
                &nbsp;&nbsp;&nbsp;设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                <Cascader
                  fieldNames={{ label: 'name', value: 'adcode' }}
                  options={this.state.deviceList}
                  onChange={this.addresschange}

                  value={this.state.addresslist}
                  changeOnSelect
                  style={{ width: "350px", marginRight: '20px' }}
                  placeholder="选择酒店" />
                    时间&nbsp;:
                    <RangePicker
                  style={{ marginLeft: '20px', marginRight: '20px', width: '300px' }}
                  format={dateFormat}
                  ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                  onChange={this.timeonChange}
                  value={[this.state.begintime, this.state.endtime]}
                />
                <div style={{ marginTop: "20px" }}>
                  关键字搜索&nbsp;: &nbsp;&nbsp;&nbsp;
                <Input placeholder="请输入关键字" style={{ width: '300px', marginRight: '20px' }}
                    value={this.state.keytext}
                    onChange={this.keytext}
                  />
                  <Button type="primary" onClick={this.query}>查询</Button>
                  <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <Table
                  dataSource={this.state.videoListDataSource}
                  columns={this.nodeInfoTableColumns}
                  pagination={false}
                  onChange={this.tablechange}
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
                  <span style={{ display: this.state.cupboarddiss }}>消毒柜工作时间 <span className="botright"></span></span>
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
            </Card>
          </Content>

        </Layout>
      </Layout >
    );
  }
}

export default App;
