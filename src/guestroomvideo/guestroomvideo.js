import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Input,
  Cascader,
  Pagination,
  DatePicker,
} from "antd";
import {
  getregion,
  sitelist,
  gethandheld, iscid
} from "../axios";
import "./guestroomvideo.css";
import moment from 'moment';

const { Content } = Layout;
const { RangePicker } = DatePicker;
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
      begintime: undefined,
      endtime: undefined,
      hotellist: [],
      opentype: true,
      pdpage: false,
      indexs: 0,
      pageNum: 1,
      pageNumSize: 10,
      sitelist: {}
    };

    this.nodeInfoTableColumns = [
      {
        title: "酒店名称",
        dataIndex: "siteName",
        render: (text, record, index) => {
          return (
            <div>
              {text}
            </div>
          )
        }
      },
      {
        title: "检测日期",
        dataIndex: "date",
        sorter: (a, b) => new Date(a) > new Date(b) ? 1 : -1,
        render: (text, record, index) => {
          return (
            <div>
              {moment(new Date(text.replace(/-/g, '/'))).format('YYYY-MM-DD')}
            </div>
          )
        }
      },
      {
        title: "保洁时长（分）",
        dataIndex: "worktime",
        render: (text, record, index) => {
          return (
            <div>
              {parseFloat(text / 60).toFixed(1)}
            </div>
          )
        }
      },
      {
        title: "摄像头名称",
        dataIndex: "cameraName",
      },
      // {
      //   title: "摄像头名称",
      //   dataIndex: "cameraName",
      // },
      {
        title: "查看回放",
        dataIndex: "id",
        render: (text, record, index) => {
          return (
            <div onClick={() => this.findback(text, record, index)} style={{ display: 'inline-block' }}  >
              <a href={this.state.export1} >
                查看
              </a>
            </div>
          )
        }
      },
      // {
      //   title: "详情",
      //   dataIndex: "id",
      //   render: (text, record, index) => {
      //     return (
      //       <div>
      //         <div onClick={() => this.findpicture(text, record, index)} style={{ display: 'inline-block' }} >
      //           <a href={this.state.export1} >
      //             图片下载
      //         </a>
      //         </div>
      //         <span onClick={() => this.findvideo(text, record, index)} style={{ color: '#40a9ff', cursor: 'pointer', marginLeft: '10PX' }} >
      //           视频播放
      //       </span>

      //       </div>
      //     )
      //   }
      // }
    ];
  }


  componentWillMount() {
    document.title = "视频监测-客房保洁";
  }

  componentDidMount() {
    localStorage.setItem('imgopen', true)
    sitelist([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var arr = {}
        for (var i in res.data.data) {
          arr[res.data.data[i].id] = res.data.data[i].sitename
        }
        this.setState({
          sitelist: arr,
        });
      }
    });

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
    this.detectionService()
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  detectionService = () => {
    gethandheld([
      this.state.pageNum,
      this.state.pageNumSize,
      this.state.cityid,
      this.state.areaid,
      this.state.siteId,
      null,
      moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD"),
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
  }

  //查看回放
  findback = (text, record, index) => {
    localStorage.setItem('indexCode', record.indexcode)
    localStorage.setItem('hotelnames', record.siteName)
    localStorage.setItem('roomname', !record.roomName ? "" : record.roomName)
    localStorage.setItem('iscdate', record.date)
    iscid([
      record.iscId,
    ]).then(res => {
      if (res.data && res.data.message === 'success') {
        localStorage.setItem('appkey', res.data.data.appkey)
        localStorage.setItem('appsecret', res.data.data.appsecret)
        localStorage.setItem('iscip', res.data.data.host.split(':')[0])
        localStorage.setItem('iscport', res.data.data.host.split(':')[1])
        window.location.href = "/app/handleback"
      }
    });
    // console.log(record)
    // if (record.picture === undefined) {
    //   message.error('暂无图片')
    // } else {
    //   localStorage.setItem('backlist', record.picture)
    //   setTimeout(function () {
    //     window.location.href = "/app/backvideo";
    //   }, 1000);
    // }

    // handheldbackUrl([
    //   text
    // ]).then(res => {
    //   if (res.data && res.data.message === "success") {

    //   }
    // })
  }



  //时间选择
  timeonChange = (value, dateString) => {
    this.setState({
      begintime: moment(dateString[0]),
      endtime: moment(dateString[1]),
    });
  }

  query = () => {
    gethandheld([
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
      gethandheld([
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

  //酒店选择
  hotelchange = (value) => {
    this.setState({
      hotelid: value
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
    return (
      <Layout id="guestroomvideo">
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="视频监测-客房保洁" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}>
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
              <div className="pageone">
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
