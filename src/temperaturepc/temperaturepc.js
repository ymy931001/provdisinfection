import React from "react";
import {
  Upload,
  Table,
  Layout,
  Row,
  Col,
  Card,
  Button,
  Input,
  Badge,
  Tabs,
  Select,
  Popconfirm,
  DatePicker,
  Statistic
} from "antd";
import {
  roomlist,
  deleteroom,
  allhospital,
  alltemperature
} from "../axios";
import "./temperaturepc.css";
import { Link } from 'react-router-dom';
import moment from 'moment';

const { Content, F } = Layout;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Option = Select.Option;

const { TabPane } = Tabs;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      typenone: "inline-block",
      sitelist: [],
      hospitallist: [],
      sitelists: [],
      hospitallists: [],
      weekback: '#0070CC',
      monthback: '#0070CC',
      yesback: 'green',
      listtitle: '昨日',
      hospitalid: null,
      false: false,
      begin: moment(new Date().getTime() - 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
      end: moment(new Date().getTime()).format("YYYY-MM-DD"),
    };
    this.nodeInfoTableColumns = [
      {
        title: "所属医院",
        dataIndex: "hospitalId",
        render: (text, record, index) => {
          for (var i in this.state.hospitallist) {
            if (this.state.hospitallist[i].id === text) {
              return (
                <div>
                  {this.state.hospitallist[i].value}
                </div>
              )
            }
          }
        }
      },
      {
        title: "姓名",
        dataIndex: "name",
      },
      {
        title: "性别",
        dataIndex: "sex",
        render: (text, record, index) => {
          if (text === 1) {
            return (
              <div>
                男
            </div>
            )
          } else {
            return (
              <div>
                女
              </div>
            )
          }
        }
      },
      {
        title: "联系电话",
        dataIndex: "phone",
        render: (text, record, index) => {
          if (text === null) {
            return (
              <div>
                无
            </div>
            )
          } else {
            return (
              <div>
                {text}
              </div>
            )
          }
        }
      }, {
        title: "测量温度",
        dataIndex: "temperature",
        render: (text, record, index) => {
          if (text === null) {
            return (
              <div style={{ color: 'green', fontSize: "14px" }}>
                正常
              </div>
            )
          } else {
            return (
              <div style={{ color: 'red', fontSize: "14px", cursor: 'pointer' }} onClick={() => this.tempimf(text, record, index)}>
                {text}
              </div>
            )
          }

        }
      }, {
        title: "测量时间",
        dataIndex: "gmtcreate",
      },
    ];


    this.unusualcolumns = [
      {
        title: "所属医院",
        dataIndex: "hospitalId",
        render: (text, record, index) => {
          for (var i in this.state.hospitallist) {
            if (this.state.hospitallist[i].id === text) {
              return (
                <div>
                  {this.state.hospitallist[i].value}
                </div>
              )
            }
          }
        }
      },
      {
        title: "姓名",
        dataIndex: "name",
      },
      {
        title: "性别",
        dataIndex: "sex",
        render: (text, record, index) => {
          if (text === 1) {
            return (
              <div>
                男
            </div>
            )
          } else {
            return (
              <div>
                女
              </div>
            )
          }
        }
      },
      {
        title: "联系电话",
        dataIndex: "phone",
        render: (text, record, index) => {
          if (text === null) {
            return (
              <div>
                无
            </div>
            )
          } else {
            return (
              <div>
                {text}
              </div>
            )
          }
        }
      }, {
        title: "测量温度",
        dataIndex: "temperature",
        render: (text, record, index) => {
          if (text === null) {
            return (
              <div style={{ color: 'green', fontSize: "14px" }}>
                正常
              </div>
            )
          } else {
            return (
              <div style={{ color: 'red', fontSize: "14px", cursor: 'pointer' }} onClick={() => this.tempimf(text, record, index)}>
                {text}
              </div>
            )
          }

        }
      }, {
        title: "身份证号",
        dataIndex: "idCard",
      }, {
        title: "住址",
        dataIndex: "address",
      }, {
        title: "测量时间",
        dataIndex: "gmtcreate",
      }
    ];


    this.rankcolumns = [
      {
        title: "排名",
        dataIndex: "aNum",
        render: (text, record, index) => {
          if (index === 0) {
            return (
              <div className="firsttitle">
                <span className="firstcircle"> {index + 1}</span>
              </div>
            )
          }
          else if (index === 1) {
            return (
              <div className="firsttitle">
                <span className="twocircle"> {index + 1}</span>
              </div>
            )
          }
          else if (index === 2) {
            return (
              <div className="firsttitle">
                <span className="threecircle"> {index + 1}</span>
              </div>
            )
          }
          else {
            return (
              <div className="firsttitle">
                <span className="othercircle"> {index + 1}</span>
              </div>
            )
          }
        }
      }, {
        title: "医院名",
        dataIndex: "hospitalId",
        render: (text, record, index) => {
          for (var i in this.state.hospitallist) {
            if (this.state.hospitallist[i].id === text) {
              return (
                <div onClick={() => this.hospitalclick(text, record, index)} style={{ cursor: 'pointer' }}>
                  {this.state.hospitallist[i].value}
                </div>
              )
            }
          }
        }
      },
      {
        title: "人数",
        dataIndex: "totallength",
        sortOrder: 'descend',
        sorter: (a, b) => a.totallength - b.totallength,
        render: (text, record, index) => {
          return (
            <div>
              {text} 人
            </div>
          )
        }
      }
    ];
  }

  componentWillMount() {
    document.title = "体温管理";
  }

  componentDidMount() {

    allhospital([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var arr = []
        for (var i in res.data.data) {
          arr.push({
            'value': res.data.data[i].name,
            'id': res.data.data[i].id,
          })
        }
        this.setState({
          hospitallist: arr,
        })
      }
    });

    this.templist()
    // this.setState({
    //   begin: moment(new Date().getTime()).format("YYYY-MM-DD"),
    //   end: moment(new Date().getTime()).format("YYYY-MM-DD"),
    //   weekback: '#0070CC',
    //   monthback: '#0070CC',
    // }, function () {
    //   this.templist()
    // })


    alltemperature([
      null,
      moment(new Date().getTime() - 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
      moment(new Date().getTime() - 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        function up(x, y) {
          return new Date(y.gmtcreate) - new Date(x.gmtcreate)
        }
        var arr = []
        var usualarr = []
        for (var i in res.data.data.sort(up)) {
          if (res.data.data[i].temperature != null) {
            arr.push(res.data.data[i])
          }
          if (res.data.data[i].temperature === null) {
            usualarr.push(res.data.data[i])
          }
        }
        this.setState({
          yesunusualnum: arr.length,
          yestotalnum: res.data.data.length,
        })
      }
    });

    alltemperature([
      null,
      moment(new Date().getTime()).format("YYYY-MM-DD"),
      moment(new Date().getTime()).format("YYYY-MM-DD"),
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        function up(x, y) {
          return new Date(y.gmtcreate) - new Date(x.gmtcreate)
        }
        var arr = []
        var usualarr = []
        for (var i in res.data.data.sort(up)) {
          if (res.data.data[i].temperature != null) {
            arr.push(res.data.data[i])
          }
          if (res.data.data[i].temperature === null) {
            usualarr.push(res.data.data[i])
          }
        }
        this.setState({
          unusualtoday: arr.length,
          totaltoday: res.data.data.length,
        })
      }
    });

  }



  templist = () => {
    alltemperature([
      this.state.hospitalId,
      this.state.begin,
      this.state.end,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        function up(x, y) {
          return new Date(y.gmtcreate) - new Date(x.gmtcreate)
        }
        var arr = []
        var usualarr = []
        for (var i in res.data.data.sort(up)) {
          if (res.data.data[i].temperature != null) {
            arr.push(res.data.data[i])
          }
          if (res.data.data[i].temperature === null) {
            usualarr.push(res.data.data[i])
          }
        }

        var map = {}, dest = [];
        var maps = {}, dests = [];
        for (var i = 0; i < res.data.data.length; i++) {
          //异常人数数据获取
          if (res.data.data[i].temperature != null) {
            var ai = res.data.data[i];
            if (!maps[ai.hospitalId]) {
              dests.push({
                hospitalId: ai.hospitalId,
                data: [ai]
              });
              maps[ai.hospitalId] = ai;
            } else {
              for (var j = 0; j < dests.length; j++) {
                var dj = dests[j];
                if (dj.hospitalId == ai.hospitalId) {
                  dj.data.push(ai);
                  break;
                }
              }
            }
          }
          //提交总人数数据获取
          var ai = res.data.data[i];
          if (!map[ai.hospitalId]) {
            dest.push({
              hospitalId: ai.hospitalId,
              data: [ai]
            });
            map[ai.hospitalId] = ai;
          } else {
            for (var j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.hospitalId == ai.hospitalId) {
                dj.data.push(ai);
                break;
              }
            }
          }
        }

        //提交总人数排名数据获取
        var newarr = []
        for (var i in dest) {
          newarr.push({
            'hospitalId': dest[i].hospitalId,
            'totallength': dest[i].data.length,
          })
        }

        //异常人数排名数据获取
        var unusualarr = []
        for (var i in dests) {
          unusualarr.push({
            'hospitalId': dests[i].hospitalId,
            'totallength': dests[i].data.length,
          })
        }


        this.setState({
          templist: usualarr,
          untemplist: arr,
          unusuallist: arr.length,
          unusuallength: arr.length,
          usuallength: usualarr.length,
          firstlist: newarr,
          twolist: unusualarr
        }, function () {
          if (this.state.firstlist.length <= 5) {
            this.setState({
              page: false
            })
          } else {
            this.setState({
              page: true
            })
          }

          if (this.state.twolist.length <= 5) {
            this.setState({
              pages: false
            })
          } else {
            this.setState({
              pages: true
            })
          }
          var max = 1;
          var hostid = null
          for (var i in this.state.twolist) {
            if (max > parseInt(this.state.twolist[i].totallength)) {
              max = max
            } else {
              max = parseInt(this.state.twolist[i].totallength)
              hostid = this.state.twolist[i].hospitalId
            }
          }
          if (this.state.flag != true) {
            console.log(this.state.hospitallist.length === 0)
            if (this.state.hospitallist.length === 0) {
              allhospital([

              ]).then(res => {
                if (res.data && res.data.message === "success") {
                  var arr = []
                  for (var i in res.data.data) {
                    arr.push({
                      'value': res.data.data[i].name,
                      'id': res.data.data[i].id,
                    })
                  }
                  this.setState({
                    hospitallist: arr,
                  }, function () {
                    for (var i in this.state.hospitallist) {
                      if (this.state.hospitallist[i].id === hostid) {
                        this.setState({
                          flag: true,
                          hospitalmaxId: hostid,
                          hostitalname: this.state.hospitallist[i].value
                        })
                      }
                    }
                  })
                }
              });

            } else {
              for (var i in this.state.hospitallist) {
                if (this.state.hospitallist[i].id === hostid) {
                  this.setState({
                    flag: true,
                    hospitalmaxId: hostid,
                    hostitalname: this.state.hospitallist[i].value
                  })
                }
              }
            }
          }
        });
      }
    });
  }

  templistbot = () => {
    alltemperature([
      this.state.hospitalId,
      this.state.begin,
      this.state.end,
    ]).then(res => {
      function up(x, y) {
        return new Date(y.gmtcreate) - new Date(x.gmtcreate)
      }
      var arr = []
      var usualarr = []
      for (var i in res.data.data.sort(up)) {
        if (res.data.data[i].temperature != null) {
          arr.push(res.data.data[i])
        }
        if (res.data.data[i].temperature === null) {
          usualarr.push(res.data.data[i])
        }
      }
      this.setState({
        templist: usualarr,
        untemplist: arr,
        unusuallength: arr.length,
        usuallength: usualarr.length
      })
    })

  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }


  handleCancel = () => {
    this.setState({
      pleadingvisible: false
    })
  }


  cleanername = (e) => {
    this.setState({
      cleanername: e.target.value
    })
  }

  tempimf = (text, record, index) => {
    this.setState({
      pleadingvisible: true,
      name: record.name,
      cardno: record.idCard,
      address: record.address,
    })
  }



  hospitalchange = (value) => {
    this.setState({
      hospitalId: value
    }, function () {
      this.templistbot()
    })
  }
  // //昨日列表
  // yeslist = () => {
  //   this.setState({
  //     hospitalId: null,
  //     begin: moment(new Date().getTime() - 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
  //     end: moment(new Date().getTime() - 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
  //     listtitle: '昨日',
  //     weekback: '#0070CC',
  //     monthback: '#0070CC',
  //     yesback: 'green',
  //   }, function () {
  //     this.templist()
  //   })
  // }
  //近一周列表
  weeklist = () => {
    this.setState({
      hospitalId: null,
      begin: moment(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
      end: moment(new Date().getTime()).format("YYYY-MM-DD"),
      // listtitle: '近一周',
      weekback: 'green',
      monthback: '#0070CC',
      yesback: '#0070CC',
      flag: true,
    }, function () {
      this.templist()
    })
  }
  //近一月列表
  monthlist = () => {
    this.setState({
      hospitalId: null,
      begin: moment(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
      end: moment(new Date().getTime()).format("YYYY-MM-DD"),
      // listtitle: '近一月',
      weekback: '#0070CC',
      monthback: 'green',
      yesback: '#0070CC',
      flag: true,
    }, function () {
      this.templist()
    })
  }

  //点击异常最多网点刷新列表
  maxlist = () => {
    this.setState({
      hospitalId: this.state.hospitalmaxId
    }, function () {
      this.templistbot()
    })
  }
  //通过时间筛选列表
  querybtn = () => {
    this.templist()
  }

  //通过点击异常人数最多网点来筛选
  hospitalclick = (text, record, index) => {
    this.setState({
      hospitalId: text
    }, function () {
      this.templistbot()
    })
  }

  //时间选择
  timeonChange = (value, dateString) => {
    this.setState({
      begin: dateString[0],
      end: dateString[1],
      flag: true,
    });
  }


  render() {
    const prooptions = this.state.hospitallist.map((province) => <Option key={province.id}  >{province.value}</Option>);
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
        }),
      };
    });

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

    const unusualcolumns = this.unusualcolumns.map((col) => {
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





    return (
      <Layout id="temppc">
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="体温管理"  headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  {/* <Button type="primary" style={{ background: this.state.yesback, border: 'none' }} onClick={this.yeslist} >
                    昨日
                  </Button> */}
                  <Button type="primary" style={{ background: this.state.weekback, border: 'none', marginLeft: '20px' }} onClick={this.weeklist} >
                    近一周
                  </Button>
                  <Button type="primary" style={{ background: this.state.monthback, border: 'none', marginLeft: '20px' }} onClick={this.monthlist}>
                    近一月
                  </Button>
                </div>
              }
            >
              <div>
                <div>
                  <Row gutter={24}>
                    <Col span={8}>
                      <div style={{ border: '1px solid #D4D8D8', borderRadius: '10px', minHeight: '250px' }}>
                        <div className="ranktitle">
                          数据概览
                      </div>
                        <div style={{ padding: '10px' }}>
                          <div class="lefttitle">今日异常人数：
                            <span>
                              <span style={{ color: "red", fontSize: '15px', fontWeight: 'bold' }}>{this.state.unusualtoday}</span> &nbsp;&nbsp;人
                             </span>
                          </div>
                          <div class="lefttitle">今日提交总数：
                              <span>
                              <span style={{ fontSize: '15px' }}>{this.state.totaltoday}</span> &nbsp;&nbsp;人
                               </span>
                          </div>
                          <div class="lefttitle" >今日异常人数最多网点：<span>
                            <span style={{ cursor: 'pointer' }} onClick={this.maxlist}>{this.state.hostitalname}</span> </span>
                          </div>
                          <div class="lefttitle">
                            {/* {this.state.listtitle} */}
                            昨日异常人数：
                            <span>
                              <span style={{ color: "red", fontSize: '15px', fontWeight: 'bold' }}>{this.state.yesunusualnum}</span> &nbsp;&nbsp;人
                             </span>
                          </div>
                          <div class="lefttitle" style={{ marginBottom: 0 }}>
                            {/* {this.state.listtitle} */}
                            昨日提交总数：
                              <span>
                              <span style={{ fontSize: '15px' }}>{this.state.yestotalnum}</span> &nbsp;&nbsp;人
                               </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ border: '1px solid #D4D8D8', borderRadius: '10px', minHeight: '250px' }}>
                        <div className="ranktitle">
                          提交总人数排名
                        </div>
                        <div style={{ padding: '10px', paddingTop: '0px' }} id="ranktable">
                          <Table
                            dataSource={this.state.firstlist}
                            columns={rankcolumns}
                            pagination={this.state.page}
                            showHeader={false}

                          />
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ border: '1px solid #D4D8D8', borderRadius: '10px', minHeight: '250px' }}>
                        <div className="ranktitle">
                          异常人数排名
                      </div>
                        <div style={{ padding: '10px', paddingTop: '0px' }} id="ranktables">
                          <Table
                            dataSource={this.state.twolist}
                            columns={rankcolumns}
                            pagination={this.state.pages}
                            showHeader={false}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div style={{ marginBottom: "20px", marginTop: '20px' }}>
                  医院名称&nbsp;: &nbsp;&nbsp;&nbsp;
                <Select
                    style={{ width: '200px', marginRight: '20px' }}
                    placeholder="请选择所属网点"
                    onChange={this.hospitalchange}
                  >
                    {prooptions}
                  </Select>
                  时间选择&nbsp;: &nbsp;&nbsp;
                  <RangePicker
                    style={{ marginRight: '20px' }}
                    format={'YYYY-MM-DD'}
                    ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                    onChange={this.timeonChange}
                  />
                  <Button type="primary" onClick={this.querybtn} >
                    查询
                  </Button>
                </div>
                <Tabs defaultActiveKey="1">
                  <TabPane tab={
                    <div><span style={{ color: 'red', fontWeight: 'bold' }}> 异常列表 ( {this.state.unusuallength} ) </span></div>
                  } key="1">
                    <Table
                      dataSource={this.state.untemplist}
                      columns={unusualcolumns}
                    />
                  </TabPane>
                  <TabPane tab={
                    <div> <span style={{ color: 'green', fontWeight: 'bold' }}>正常列表 ( {this.state.usuallength} )</span> </div>
                  }

                    key="2" style={{ minHeight: "700px" }}>
                    <Table
                      dataSource={this.state.templist}
                      columns={nodeInfoTableColumns}
                    />
                  </TabPane>
                </Tabs>
              </div>
            </Card>
          </Content>
        </Layout>
      </Layout >
    );
  }
}

export default App;
