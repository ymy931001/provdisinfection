import React from "react";
import {
  Table,
  Layout,
  Card,
  Tabs,
  Modal,
  Input,
  message,
  Cascader,
  Button,
  DatePicker,
  Tooltip,
  Pagination
} from "antd";

import {
  getalarm,
  addalarmRemark, getregion, getalarms, nowalarm
} from "../axios";
import "./warning.css";
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const { Content } = Layout;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { RangePicker } = DatePicker;



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      otaInfoTableDataSource: [],
      otaModalVisible: null,
      begintime: undefined,
      endtime: undefined,
      pageNum: 1,
      hispageNum: 1,
      nowpageNum: 1,
      pageNumSize: 10,
    };
  }
  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() {

  }

  componentDidMount() {
    this.getalarm()
    this.getdevicealarm()
    this.getnowalarm()
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


  getdevicealarm = () => {
    getalarm([
      this.state.pageNum,
      this.state.pageNumSize,
      3,
      this.state.cityid,
      this.state.areaid,
      this.state.siteId,
      this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
      this.state.endtime === undefined ? moment(new Date()).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
    ]).then(res => {
      this.setState({
        offlinedata: res.data.data.alarmHistoryVOList,
        offlinetotal: res.data.data.total,
      })
    });
  }


  getnowalarm = () => {
    nowalarm([
      this.state.nowpageNum,
      this.state.pageNumSize,
      false,
      "0,1, 2, 4, 5, 6,7",
      this.state.cityid,
      this.state.areaid,
      this.state.siteId,
      this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
      this.state.endtime === undefined ? moment(new Date()).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
    ]).then(res => {
      this.setState({
        warningListDataSource: res.data.data.alarmHistoryVOList,
        nowtotal: res.data.data.total,
      })
    });
  }

  getalarm = () => {
    getalarms([
      this.state.hispageNum,
      this.state.pageNumSize,
      true,
      this.state.cityid,
      this.state.areaid,
      this.state.siteId,
      this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
      this.state.endtime === undefined ? moment(new Date()).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
    ]).then(res => {
      this.setState({
        historydata: res.data.data.alarmHistoryVOList,
        histotal: res.data.data.total,
      })
    });
  }


  //打开负责人说明
  explain = (text, record, index) => {
    this.setState({
      describevisible: true,
      alarmid: record.id
    })
  }



  //关闭model
  handleCancel = () => {
    this.setState({
      describevisible: false,
    })
  }

  explainok = () => {
    addalarmRemark([
      this.state.alarmid,
      this.state.remark,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('添加成功')
        this.setState({
          describevisible: false,
        })
        this.getalarm()
      }
    });
  }

  //添加说明
  remarkchange = (e) => {
    this.setState({
      remark: e.target.value
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

  //查询
  query = () => {
    this.getalarm()
    this.getdevicealarm()
    this.getnowalarm()
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
      this.getalarm()
      this.getdevicealarm()
      this.getnowalarm()
    })
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

  //设备离线筛选
  pagechange = (page, num) => {
    this.setState({
      pageNum: page,
      pageNumSize: num,
    }, function () {
      this.getdevicealarm()
    })
  }

  //已处理分页
  hispagechange = (page, num) => {
    this.setState({
      hispageNum: page,
      pageNumSize: num,
    }, function () {
      console.log(11)
      this.getalarm()
    })
  }


  //当前报警分页
  nowpagechange = (page, num) => {
    this.setState({
      nowpageNum: page,
      pageNumSize: num,
    }, function () {
      this.getnowalarm()
    })
  }



  render() {
    const otaInfoTableColumns = [
      {
        title: "酒店名称",
        dataIndex: "siteName",
      },
      {
        title: "房间位置",
        dataIndex: "roomName",
        render: (text, record, index) => {
          if (!text) {
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
      },
      {
        title: "报警原因",
        dataIndex: "message",
        render: (text, record, index) => {
          if (record.type === 3) {
            return (
              <div style={{ color: 'red', cursor: "pointer" }}>
                <Tooltip placement="topLeft" title={"离线时间：" + record.duration + "小时"}>
                  {text}
                </Tooltip>
              </div>
            )
          }
          else if (record.type === 0) {
            if (!record.duration) {
              return (
                <div style={{ color: 'red' }}>
                  {text}
                </div>
              )
            } else {
              return (
                <div style={{ color: 'red', cursor: "pointer" }}>
                  <Tooltip placement="topLeft" title={"未开启天数：" + record.duration + "天"}>
                    消毒柜未开启
                  </Tooltip>
                </div>

              )
            }

          }
          else {
            return (
              <div style={{ color: 'red' }} >
                {text}
              </div >
            )
          }

        }
      }, {
        title: "报警级别",
        dataIndex: "level",
        filters: [
          { text: "预报警", value: 1 },
          { text: "报警", value: 2 },
        ],
        onFilter: (value, record) => record.level == value,  //eslint-disable-line 
        render: (text, record, index) => {
          if (text === 1) {
            return (
              <div style={{ color: 'orange' }}>
                预报警
              </div>
            )
          }
          if (text === 2) {
            return (
              <div style={{ color: 'red' }}>
                报警
              </div>
            )
          }
          if (record.type === 1) {
            return (
              <div style={{ color: '#1890ff' }}>
                提醒
              </div>
            )
          }
          if (text === undefined) {
            return (
              <div>
                无
              </div>
            )
          }
        }
      }, {
        title: "报警时长",
        dataIndex: "duration",
        sorter: (a, b) => a.duration - b.duration,
        render: (text, record, index) => {
          if (!text) {
            return (
              <div>
                无
              </div>
            )
          } else {
            return (
              <div>
                <span style={{ fontWeight: 'bold', color: "red" }}>{text}</span>  天
              </div>
            )
          }

        }
      },
      {
        title: "报警时间",
        dataIndex: "date",
        render: (text, record, index) => {
          if (text === null || !record.duration) {
            return (
              <div style={{ color: 'red' }}>
                暂无
              </div>
            )
          } else {
            return (
              <div style={{ color: 'green' }}>
                {moment(new Date(text) - 3600 * 24 * 1000 * record.duration).format('YYYY-MM-DD')}
              </div>
            )
          }

        }
      }, {
        title: "异常说明",
        dataIndex: "remark",
        render: (text, record, index) => {
          if (text === null || text === undefined) {
            return (
              <div >
                <a onClick={() => this.explain(text, record, index)}>添加</a>
              </div>
            )
          } else {
            return (
              <div style={{ color: 'red' }}>
                {text}
              </div>
            )
          }
        }
      }

    ];

    const offlineColumns = [
      {
        title: "酒店名称",
        dataIndex: "siteName",
      },
      {
        title: "房间位置",
        dataIndex: "roomName",
        render: (text, record, index) => {
          if (!text) {
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
      },
      {
        title: "报警原因",
        dataIndex: "message",
        render: (text, record, index) => {
          return (
            <div style={{ color: 'red' }} >
              {text}
            </div >
          )
        }
      }, {
        title: "离线时长",
        dataIndex: "duration",
        sorter: (a, b) => a.duration - b.duration,
        render: (text, record, index) => {
          return (
            <div>
              <span style={{ fontWeight: 'bold', color: "red" }}>{Math.ceil(text / 24)}</span>  天
            </div>
          )
        }
      },
      {
        title: "报警时间",
        dataIndex: "date",
        render: (text, record, index) => {
          if (text === null) {
            return (
              <div style={{ color: 'red' }}>
                暂无
              </div>
            )
          } else {
            return (
              <div style={{ color: 'green' }}>
                {moment(new Date(text) - 3600 * 24 * 1000 * (Math.ceil(record.duration / 24))).format('YYYY-MM-DD')}
              </div>
            )
          }

        }
      }
    ];
    return (
      <Layout>
        <Layout id="warning">
          <Content style={{ margin: "16px 16px" }} >
            <Card title="运行概览-报警监测" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}>
              <div className="gutter-example-nodemanage" style={{ marginTop: '20px' }}>
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
                <Button type="primary" onClick={this.query}>查询</Button>
                <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
              </div>
              <Tabs defaultActiveKey="1">
                <TabPane tab="当前" key="1">
                  <div style={{ marginTop: 5 }}>
                    <Table
                      dataSource={this.state.warningListDataSource}
                      columns={otaInfoTableColumns}
                      pagination={false}
                    />
                    <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                      <Pagination
                        defaultCurrent={1}
                        onChange={this.nowpagechange}
                        total={this.state.nowtotal}
                        hideOnSinglePage={true}
                        current={this.state.nowpageNum}
                      />
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="已处理" key="2" style={{ minHeight: "700px" }}>
                  <div style={{ marginTop: 5 }}>
                    <Table
                      dataSource={this.state.historydata}
                      columns={otaInfoTableColumns}
                      pagination={false}
                    />
                    <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                      <Pagination
                        defaultCurrent={1}
                        onChange={this.hispagechange}
                        total={this.state.histotal}
                        hideOnSinglePage={true}
                        current={this.state.hispageNum}
                      />
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="设备离线" key="3" style={{ minHeight: "700px" }}>
                  <div style={{ marginTop: 5 }}>
                    <Table
                      dataSource={this.state.offlinedata}
                      columns={offlineColumns}
                      pagination={false}
                    />
                    <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                      <Pagination
                        defaultCurrent={1}
                        onChange={this.pagechange}
                        total={this.state.offlinetotal}
                        hideOnSinglePage={true}
                        current={this.state.pageNum}
                      />
                    </div>
                  </div>

                </TabPane>
              </Tabs>
            </Card>
          </Content>
          <Modal
            title="负责人说明"
            destroyOnClose
            onOk={this.explainok}
            visible={this.state.describevisible}
            centered
            width='400px'
            onCancel={this.handleCancel}
            mask={false}
          >
            <TextArea rows={4} style={{ width: '100%', height: '200px' }}
              onChange={this.remarkchange}
              value={this.state.remark}
              placeholder="请输入说明"
            />
          </Modal>

        </Layout>
      </Layout>
    );
  }
}

export default App;
