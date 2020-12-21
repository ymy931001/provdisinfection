import React from "react";
import {
  Table,
  Layout,
  Row,
  Col,
  Card,
  Button,
  DatePicker,
  Radio
} from "antd";
import {
  sitelist,
  areaStatisticsByDate,
} from "../axios";

import "./areastatistics.css";
import moment from 'moment';
const { Content } = Layout;
const { RangePicker } = DatePicker;


const dateFormat = 'YYYY-MM-DD';


function disabledDate(current) {
  // Can not select days before today and today
  return current && current > moment().endOf('day');
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      sitelist: [],
      allhotel: [],
      typenone: "inline-block",
      notaddress: [],
      firstlist: [],
      twolist: [],
      threelist: [],
      fourlist: [],
      fivelist: [],
      sixlist: [],
      size: 'week',
      begintime: moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 7),
      endtime: moment(new Date().getTime()),
      unnormallist: [],
      tongjilist: [],
      titlechange: "近一周未达标酒店数",
      weekrankba: "#1890ff",
      monthrankba: 'green',
      weekchangeba: "#1890ff",
      monthchangeba: 'green',
      yearchangeba: 'green',
    };



    this.rankcolumns = [
      {
        title: "排序",
        dataIndex: "pm",
        render: (text, record, index) => {
          if (text === 1) {
            return (
              <div className="firsttitle">
                <span className="firstcircle"> {text}</span>
              </div>
            )
          }
          else if (text === 2) {
            return (
              <div className="firsttitle">
                <span className="twocircle"> {text}</span>
              </div>
            )
          }
          else if (text === 3) {
            return (
              <div className="firsttitle">
                <span className="threecircle"> {text}</span>
              </div>
            )
          }
          else {
            return (
              <div className="firsttitle">
                <span className="othercircle"> {text}</span>
              </div>
            )
          }
        }
      }, {
        title: "网点名",
        dataIndex: "siteName",
        render: (text, record, index) => {
          return (
            <div style={{ cursor: 'pointer' }} onClick={() => this.sitechanges(text, record, index)}>
              {text}
            </div>
          )
        }
      },
      {
        title: "保洁时长",
        dataIndex: "housekeeping",
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.housekeeping - b.housekeeping,
        render: (text, record, index) => {
          return (
            <div>
              {text === undefined ? 0 : (text / 60).toFixed(1)} 分
            </div>
          )
        }
      }
    ];


    this.rankcolumnssix = [
      {
        title: "排序",
        dataIndex: "pm5",
        render: (text, record, index) => {
          if (text === 1) {
            return (
              <div className="firsttitle">
                <span className="firstcircle"> {text}</span>
              </div>
            )
          }
          else if (text === 2) {
            return (
              <div className="firsttitle">
                <span className="twocircle"> {text}</span>
              </div>
            )
          }
          else if (text === 3) {
            return (
              <div className="firsttitle">
                <span className="threecircle"> {text}</span>
              </div>
            )
          }
          else {
            return (
              <div className="firsttitle">
                <span className="othercircle"> {text}</span>
              </div>
            )
          }
        }
      }, {
        title: "网点名",
        dataIndex: "siteName",
        render: (text, record, index) => {
          return (
            <div style={{ cursor: 'pointer' }} onClick={() => this.sitechange(text, record, index)}>
              {text}
            </div>
          )
        }
      },
      {
        title: "报警次数",
        dataIndex: "alarmCount",
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.alarmCount - b.alarmCount,
        render: (text, record, index) => {
          return (
            <div>
              {text === undefined ? 0 : text} 次
            </div>
          )
        }
      }
    ];

    this.rankcolumnstwo = [
      {
        title: "排序",
        dataIndex: "pm1",
        render: (text, record, index) => {
          if (text === 1) {
            return (
              <div className="firsttitle">
                <span className="firstcircle"> {text}</span>
              </div>
            )
          }
          else if (text === 2) {
            return (
              <div className="firsttitle">
                <span className="twocircle"> {text}</span>
              </div>
            )
          }
          else if (text === 3) {
            return (
              <div className="firsttitle">
                <span className="threecircle"> {text}</span>
              </div>
            )
          }
          else {
            return (
              <div className="firsttitle">
                <span className="othercircle"> {text}</span>
              </div>
            )
          }
        }
      }, {
        title: "网点名",
        dataIndex: "siteName",
        render: (text, record, index) => {
          return (
            <div style={{ cursor: 'pointer' }} onClick={() => this.sitechange(text, record, index)}>
              {text}
            </div>
          )
        }
      },
      {
        title: "消毒时长",
        dataIndex: "runtime",
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.runtime - b.runtime,
        render: (text, record, index) => {
          if (text === undefined) {
            return (
              <div>
                0 分
              </div>
            )
          } else {
            return (
              <div>
                {(text / 60).toFixed(1)} 分
              </div>
            )
          }

        }
      }
    ];

    this.rankcolumnsthree = [
      {
        title: "排序",
        dataIndex: "pm2",
        render: (text, record, index) => {
          if (text === 1) {
            return (
              <div className="firsttitle">
                <span className="firstcircle"> {text}</span>
              </div>
            )
          }
          else if (text === 2) {
            return (
              <div className="firsttitle">
                <span className="twocircle"> {text}</span>
              </div>
            )
          }
          else if (text === 3) {
            return (
              <div className="firsttitle">
                <span className="threecircle"> {text}</span>
              </div>
            )
          }
          else {
            return (
              <div className="firsttitle">
                <span className="othercircle"> {text}</span>
              </div>
            )
          }
        }
      }, {
        title: "网点名",
        dataIndex: "siteName",
        render: (text, record, index) => {
          return (
            <div style={{ cursor: 'pointer' }} onClick={() => this.sitechange(text, record, index)}>
              {text}
            </div>
          )
        }
      },
      {
        title: "洗消时长",
        dataIndex: "worktime",
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.worktime - b.worktime,
        render: (text, record, index) => {
          if (text === undefined) {
            return (
              <div>
                0 分
              </div>
            )
          } else {
            return (
              <div>
                {(text / 60).toFixed(1)} 分
              </div>
            )
          }
        }
      }
    ];


    this.rankcolumnsfive = [
      {
        title: "网点名",
        dataIndex: "siteName",
        render: (text, record, index) => {
          return (
            <div style={{ cursor: 'pointer' }} onClick={() => this.sitechange(text, record, index)}>
              {text}
            </div>
          )
        }
      },
      {
        title: "摄像头",
        dataIndex: "cameraCount",
        // defaultSortOrder: 'descend',
        sorter: (a, b) => a.cameraCount - b.cameraCount,
        render: (text, record, index) => {
          if (text === null || text === undefined) {
            return (
              <div>
                无
              </div>
            )
          } else if (text === 0) {
            return (
              <div>
                无设备
              </div>
            )
          }
          else {
            if (!record.cameraOnlineRate) {
              return (
                <div>
                  { text}/{text}(100%)
                </div>
              )
            } else {
              return (
                <div>
                  { Math.round(text * (record.cameraOnlineRate))}/{text}({(record.cameraOnlineRate * 100).toFixed(1)}%)
                </div>
              )
            }
          }

        }
      },
      {
        title: "插座",
        dataIndex: "boardCount",
        // defaultSortOrder: 'descend',
        sorter: (a, b) => a.boardCount - b.boardCount,
        render: (text, record, index) => {
          if (text === null || text === undefined) {
            return (
              <div>
                无
              </div>
            )
          } else if (text === 0) {
            return (
              <div>
                无设备
              </div>
            )
          } else {
            if (!record.cameraOnlineRate) {
              return (
                <div>
                  { text}/{text}(100%)
                </div>
              )
            } else {
              return (
                <div>
                  { Math.round(text * (record.boardOnlineRate))}/{text}({(record.boardOnlineRate * 100).toFixed(1)}%)
                </div>
              )
            }

          }


        }
      }
    ];


    this.rankcolumnsfour = [
      {
        title: "排序",
        dataIndex: "pm4",
        render: (text, record, index) => {
          if (text === 1) {
            return (
              <div className="firsttitle">
                <span className="firstcircle"> {text}</span>
              </div>
            )
          }
          else if (text === 2) {
            return (
              <div className="firsttitle">
                <span className="twocircle"> {text}</span>
              </div>
            )
          }
          else if (text === 3) {
            return (
              <div className="firsttitle">
                <span className="threecircle"> {text}</span>
              </div>
            )
          }
          else {
            return (
              <div className="firsttitle">
                <span className="othercircle"> {text}</span>
              </div>
            )
          }
        }
      }, {
        title: "网点名",
        dataIndex: "siteName",
        render: (text, record, index) => {
          return (
            <div style={{ cursor: 'pointer' }} onClick={() => this.sitechange(text, record, index)}>
              {text}
            </div>
          )
        }
      },
      {
        title: "达标率",
        dataIndex: "rate",
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.rate - b.rate,
        render: (text, record, index) => {
          return (
            <div>
              {(text * 100).toFixed(1)} %
            </div>
          )
        }
      }
    ];



    // this.rankcolumnsfour = [
    //   {
    //     title: "网点名",
    //     dataIndex: "siteName",
    //     render: (text, record, index) => {
    //       return (
    //         <div style={{ cursor: 'pointer' }} onClick={() => this.sitechange(text, record, index)}>
    //           {text}
    //         </div>
    //       )
    //     }
    //   },
    //   {
    //     title: "插座",
    //     dataIndex: "boardOnlineRate",
    //     sorter: (a, b) => a.boardOnlineRate - b.boardOnlineRate,
    //     // defaultSortOrder: 'descend',
    //     render: (text, record, index) => {
    //       return (
    //         <div>
    //           {text === null || text === undefined ? "无" : (text * 100).toFixed(1) + "%"}
    //         </div>
    //       )
    //     }
    //   },
    //   {
    //     title: "摄像头",
    //     dataIndex: "cameraOnlineRate",
    //     sorter: (a, b) => a.cameraOnlineRate - b.cameraOnlineRate,
    //     render: (text, record, index) => {
    //       return (
    //         <div>
    //           {text === null || text === undefined ? "无" : (text * 100).toFixed(1) + "%"}
    //         </div>
    //       )
    //     }
    //   }
    // ];


  }


  componentWillMount() {

  }

  componentDidMount() {
    if (localStorage.getItem("type") === "2") {
      this.setState({
        typenone: 'none'
      })
    }


    sitelist([]).then(res => {
      if (res.data && res.data.message === "success") {
        console.log(res.data.data)
        var arr = 0
        for (var i in res.data.data) {
          arr += parseInt(res.data.data[i].boardQuantity, 10) + parseInt(res.data.data[i].cameraQuantity, 10)
        }
        this.setState({
          one: res.data.data.length,
          two: arr
        })
      }
    });


    areaStatisticsByDate([
      moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 1).format("YYYY-MM-DD"),
      moment(new Date().getTime()).format("YYYY-MM-DD"),
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          three: !res.data.data.housekeeping ? 0 : (parseFloat(res.data.data.housekeeping, 10) / 60).toFixed(1),
          four: !res.data.data.worktime ? 0 : (parseFloat(res.data.data.worktime, 10) / 60).toFixed(1),
          five: !res.data.data.runtime ? 0 : (parseFloat(res.data.data.runtime, 10) / 60).toFixed(1),
        })
      }
    });


    areaStatisticsByDate([
      moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 7).format("YYYY-MM-DD"),
      moment(new Date().getTime()).format("YYYY-MM-DD"),
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          datelist: res.data.data.siteStatistics,
          fourlist: res.data.data.siteStatistics,
        }, function () {
          var arr = []
          var arr1 = []
          var arr2 = []
          var arr4 = []
          var arr5 = []

          for (var i in this.state.datelist) {
            if (this.state.datelist[i].housekeeping != undefined) { //eslint-disable-line
              arr.push(this.state.datelist[i])
            }
            if (this.state.datelist[i].runtime != undefined) { //eslint-disable-line
              arr1.push(this.state.datelist[i])
            }
            if (this.state.datelist[i].worktime != undefined) { //eslint-disable-line
              arr2.push(this.state.datelist[i])
            }
            if (this.state.datelist[i].boardOnlineRate != undefined || this.state.datelist[i].cameraOnlineRate != undefined) { //eslint-disable-line
              arr4.push(this.state.datelist[i])
            }
            if (this.state.datelist[i].alarmCount != undefined) { //eslint-disable-line
              arr5.push(this.state.datelist[i])
            }
          }
          arr.sort(function (a, b) {
            return a.housekeeping < b.housekeeping ? 1 : -1
          })
          for (var a in arr) {
            arr[a].pm = parseInt(a, 10) + 1
          }

          arr1.sort(function (a, b) {
            return a.runtime < b.runtime ? 1 : -1
          })
          for (var b in arr1) {
            arr1[b].pm1 = parseInt(b, 10) + 1
          }

          arr2.sort(function (a, b) {
            return a.worktime < b.worktime ? 1 : -1
          })
          for (var c in arr2) {
            arr2[c].pm2 = parseInt(c, 10) + 1
          }

          arr4.sort(function (a, b) {
            return a.rate < b.rate ? 1 : -1
          })
          for (var d in arr4) {
            arr4[d].pm4 = parseInt(d, 10) + 1
          }

          arr5.sort(function (a, b) {
            return a.alarmCount < b.alarmCount ? 1 : -1
          })
          for (var d in arr5) {
            arr5[d].pm5 = parseInt(d, 10) + 1
          }

          this.setState({
            firstlist: arr,
            twolist: arr1,
            threelist: arr2,
            fivelist: arr4,
            sixlist: arr5,
          })
        })
      }
    });
  }

  sitechange = (text, record, index) => {
    localStorage.setItem('keytext', text)
    localStorage.setItem('menuline', "sub7")
    localStorage.setItem('menuid', 85)
    window.location.href = "/app/hotelreport";
  }


  sitechanges = (text, record, index) => {
    localStorage.setItem('keytext', text)
    window.location.href = "/app/housereport";
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }


  //时间筛选
  handleSizeChange = (e) => {
    this.setState({
      size: e.target.value
    }, function () {
      console.log(this.state.size)
      if (this.state.size === "week") {
        this.setState({
          begintime: moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 7),
          endtime: moment(new Date().getTime()),
        }, function () {
          this.datalist()
        })
      }
      if (this.state.size === "month") {
        this.setState({
          begintime: moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 30),
          endtime: moment(new Date().getTime()),
        }, function () {
          this.datalist()
        })
      }
      if (this.state.size === "year") {
        this.setState({
          begintime: moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 183),
          endtime: moment(new Date().getTime()),
        }, function () {
          this.datalist()
        })
      }
    })
  }


  datalist = () => {
    areaStatisticsByDate([
      moment(this.state.begintime).format("YYYY-MM-DD"),
      moment(this.state.endtime).format("YYYY-MM-DD"),
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          datelist: res.data.data.siteStatistics,
          fourlist: res.data.data.siteStatistics,
          fivelist: res.data.data.siteStatistics,
        }, function () {
          var arr = []
          var arr1 = []
          var arr2 = []
          var arr4 = []
          var arr5 = []
          for (var i in this.state.datelist) {
            if (this.state.datelist[i].housekeeping != undefined) { //eslint-disable-line
              arr.push(this.state.datelist[i])
            }
            if (this.state.datelist[i].runtime != undefined) { //eslint-disable-line
              arr1.push(this.state.datelist[i])
            }
            if (this.state.datelist[i].worktime != undefined) { //eslint-disable-line
              arr2.push(this.state.datelist[i])
            }
            if (this.state.datelist[i].boardOnlineRate != undefined || this.state.datelist[i].cameraOnlineRate != undefined) { //eslint-disable-line
              arr4.push(this.state.datelist[i])
            }
            if (this.state.datelist[i].alarmCount != undefined) { //eslint-disable-line
              arr5.push(this.state.datelist[i])
            }
          }

          arr.sort(function (a, b) {
            return a.housekeeping < b.housekeeping ? 1 : -1
          })
          for (var a in arr) {
            arr[a].pm = parseInt(a, 10) + 1
          }

          arr1.sort(function (a, b) {
            return a.runtime < b.runtime ? 1 : -1
          })
          for (var b in arr1) {
            arr1[b].pm1 = parseInt(b, 10) + 1
          }

          arr2.sort(function (a, b) {
            return a.worktime < b.worktime ? 1 : -1
          })
          for (var c in arr2) {
            arr2[c].pm2 = parseInt(c, 10) + 1
          }

          arr5.sort(function (a, b) {
            return a.alarmCount < b.alarmCount ? 1 : -1
          })
          for (var d in arr5) {
            arr5[d].pm5 = parseInt(d, 10) + 1
          }


          this.setState({
            firstlist: arr,
            twolist: arr1,
            threelist: arr2,
            fivelist: arr4,
            sixlist: arr5,
          })
        })
      }
    });
  }

  //时间筛选
  timeonChange = (value, dateString) => {
    if (value.length === 0) {
      this.setState({
        begintime: undefined,
        endtime: undefined,
      });
    } else {
      this.setState({
        begintime: moment(dateString[0]),
        endtime: moment(dateString[1]),
      });
    }

  }

  query = () => {
    this.datalist()
  }


  render() {

    const rankcolumns = this.rankcolumns.map((col) => {
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
        }),
      };
    });

    const rankcolumnstwo = this.rankcolumnstwo.map((col) => {
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
        }),
      };
    });

    const rankcolumnsthree = this.rankcolumnsthree.map((col) => {
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
        }),
      };
    });

    const rankcolumnsfive = this.rankcolumnsfive.map((col) => {
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
        }),
      };
    });


    const rankcolumnssix = this.rankcolumnssix.map((col) => {
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
        }),
      };
    });

    const rankcolumnsfour = this.rankcolumnsfour.map((col) => {
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
        }),
      };
    });


    const paginationProps = {
      pageSize: 5, // 每页条数
    };


    return (
      <Layout >
        <Layout id="arealist">
          <Content style={{ margin: "16px 16px" }} >
            <Card title="运行概览-区域概览" headStyle={{ fontWeight: 'bold', fontSize: '18px' }} >
              <div>
                <div>
                  <Row gutter={24}>
                    <Col span={4}>
                      <div className="dashmain tongji1">
                        <img src={require('./tongji31.png')} alt="" style={{ width: '25%' }} />
                        <div style={{ textAlign: 'center' }}>
                          <span className="dashtxt">{this.state.one}</span><span className="dashdw">个</span>
                          <div className="dashleft">
                            酒店数量
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col span={5}>
                      <div className="dashmain tongji2">
                        <img src={require('./tongji21.png')} alt="" className="dashimg" />
                        <div style={{ textAlign: 'center' }}>
                          <span className="dashtxt">{this.state.two}</span><span className="dashdw">个</span>
                          <div className="dashleft">
                            设备数量
                        </div>
                        </div>
                      </div>
                    </Col>
                    <Col span={5}>
                      <div className="dashmain  tongji4">
                        <img src={require('./tongji61.png')} alt="" className="dashimg" />
                        <div style={{ textAlign: 'center' }}>
                          <span className="dashtxt">{this.state.four}</span><span className="dashdw">分</span>
                          <div className="dashleft">
                            昨日洗消时长
                        </div>
                        </div>
                      </div>
                    </Col>
                    <Col span={5}>
                      <div className="dashmain  tongji5">
                        <img src={require('./tongji71.png')} alt="" className="dashimg" />
                        <div style={{ textAlign: 'center' }}>
                          <span className="dashtxt">{this.state.five}</span><span className="dashdw">分</span>
                          <div className="dashleft">
                            昨日消毒柜工作时长
                        </div>
                        </div>
                      </div>
                    </Col>
                    <Col span={5}>
                      <div className="dashmain  tongji3">
                        <img src={require('./tongji11.png')} alt="" className="dashimg" />
                        <div style={{ textAlign: 'center' }}>
                          <span className="dashtxt">{this.state.three}</span><span className="dashdw">分</span>
                          <div className="dashleft">
                            昨日保洁时长
                        </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
            <Card title="运行概览-数据榜单" headStyle={{ fontWeight: 'bold', fontSize: '18px', marginTop: '20px' }} >
              <div>
                <div style={{ marginLeft: '10px' }}>
                  <Radio.Group value={this.state.size} onChange={this.handleSizeChange}>
                    <Radio.Button value="week">近7天</Radio.Button>
                    <Radio.Button value="month">近一月</Radio.Button>
                    <Radio.Button value="year">近半年</Radio.Button>
                  </Radio.Group>
                  <RangePicker
                    style={{ marginLeft: '20px', marginRight: '20px' }}
                    format={dateFormat}
                    ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                    onChange={this.timeonChange}
                    value={[this.state.begintime, this.state.endtime]}
                    disabledDate={disabledDate}
                    picker="month"
                  />
                  <Button type="primary" onClick={this.query}>查询</Button>
                </div>
                <Row >
                  <Col span={8} style={{ padding: '10px', paddingRight: '20px', paddingTop: '0px' }}>
                    <div className="linemain">
                      <div className="ranktitle">
                        消毒柜开启时长统计
                        </div>
                      <div style={{ padding: '10px' }}>
                        <Table
                          dataSource={this.state.twolist}
                          columns={rankcolumnstwo}
                          pagination={this.state.twolist.length < 5 ? false : paginationProps}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col span={8} style={{ padding: '10px', paddingRight: '20px', paddingLeft: '20px', paddingTop: '0px' }}>
                    <div className="linemain">
                      <div className="ranktitle">
                        洗消时长统计
                        </div>
                      <div style={{ padding: '10px' }}>
                        <Table
                          dataSource={this.state.threelist}
                          columns={rankcolumnsthree}
                          pagination={this.state.threelist.length < 5 ? false : paginationProps}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col span={8} style={{ padding: '10px', paddingRight: '20px', paddingLeft: '20px', paddingTop: '0px' }}>
                    <div className="linemain">
                      <div className="ranktitle">
                        各单位消毒达标率统计
                        </div>
                      <div style={{ padding: '10px' }}>
                        <Table
                          dataSource={this.state.fivelist}
                          columns={rankcolumnsfour}
                          pagination={this.state.fivelist.length < 5 ? false : paginationProps}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div >
                <Row style={{ marginTop: '0px' }}>
                  <Col span={8} style={{ padding: '10px', paddingRight: '20px' }}>
                    <div className="linemain">
                      <div className="ranktitle">
                        设备统计
                        </div>
                      <div style={{ padding: '10px' }}>
                        <Table
                          dataSource={this.state.fourlist}
                          columns={rankcolumnsfive}
                          pagination={this.state.fourlist.length < 5 ? false : paginationProps}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col span={8} style={{ padding: '10px', paddingRight: '20px', paddingLeft: '20px' }}>
                    <div className="linemain">
                      <div className="ranktitle">
                        报警次数统计
                        </div>
                      <div style={{ padding: '10px' }}>
                        <Table
                          dataSource={this.state.sixlist}
                          columns={rankcolumnssix}
                          pagination={this.state.sixlist.length < 5 ? false : paginationProps}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col span={8} style={{ padding: '10px', paddingLeft: '20px', paddingRight: '20px' }}>
                    <div className="linemain">
                      <div className="ranktitle">
                        客房保洁时长统计
                        </div>
                      <div style={{ padding: '10px' }}>
                        <Table
                          dataSource={this.state.firstlist}
                          columns={rankcolumns}
                          pagination={this.state.firstlist.length < 5 ? false : paginationProps}
                        />
                      </div>
                    </div>

                  </Col>
                </Row>
              </div>

            </Card>
          </Content>
        </Layout>
      </Layout >
    );
  }
}

export default App;
