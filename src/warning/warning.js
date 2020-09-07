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
  Tooltip
} from "antd";

import {
  getalarm,
  addalarmRemark, getregion
} from "../axios";
import "./warning.css";
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const { Content } = Layout;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

function callback(key) {
  console.log(key);
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      otaInfoTableDataSource: [],
      otaModalVisible: null,
      begintime: undefined,
      endtime: undefined,
    };
  }
  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() {

  }

  componentDidMount() {
    this.getalarm()

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


  getalarm = () => {
    getalarm([

    ]).then(res => {
      var arr = []
      var newarr = []
      for (var i in res.data.data) {
        if (res.data.data[i].status === false) {
          arr.push(res.data.data[i])
        } else {
          newarr.push(res.data.data[i])
        }
      }
      this.setState({
        warningListDataSource: arr,
        historydata: newarr,
      }, function () {
        if (arr.length < 10) {
          this.setState({
            page: false
          })
        }
        if (newarr.length < 10) {
          this.setState({
            pages: false
          })
        }
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
    getalarm([
      this.state.cityid,
      this.state.areaid,
      this.state.siteId,
      this.state.begintime,
      this.state.endtime,
    ]).then(res => {
      var arr = []
      var newarr = []
      for (var i in res.data.data) {
        if (res.data.data[i].status === false) {
          arr.push(res.data.data[i])
        } else {
          newarr.push(res.data.data[i])
        }
      }
      this.setState({
        warningListDataSource: arr,
        historydata: newarr,
      }, function () {
        if (arr.length < 10) {
          this.setState({
            page: false
          })
        }
        if (newarr.length < 10) {
          this.setState({
            pages: false
          })
        }
      })
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
      this.getalarm()
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
                  <Tooltip placement="topLeft" title={"未消毒天数：" + record.duration + "天"}>
                    {text}
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
        render: (text, record, index) => {
          if (text === 1) {
            return (
              <div style={{ color: 'red' }}>
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
          if (text === undefined) {
            return (
              <div>
                无
              </div>
            )
          }
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
                {moment(new Date(text)).format('YYYY-MM-DD')}
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
                // value={[this.state.begintime, this.state.endtime]}
                />
                <Button type="primary" onClick={this.query}>查询</Button>
                <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
              </div>
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="当前" key="1">
                  <div style={{ marginTop: 5 }}>
                    <Table
                      dataSource={this.state.warningListDataSource}
                      columns={otaInfoTableColumns}
                      pagination={this.state.page}
                    />
                  </div>
                </TabPane>
                <TabPane tab="历史" key="2" style={{ minHeight: "700px" }}>
                  <div style={{ marginTop: 5 }}>
                    <Table
                      dataSource={this.state.historydata}
                      columns={otaInfoTableColumns}
                      pagination={this.state.pages}
                    />
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
