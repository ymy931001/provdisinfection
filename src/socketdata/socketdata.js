import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Modal,
  Cascader,
  DatePicker,
  Pagination,
  Input, message
} from "antd";
import {
  newdetectionsearch,
  newdetection,
  getregion
} from "../axios";
import "./socketdata.css";
import moment from 'moment';

const { Content } = Layout;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      sitelist: [],
      deviceList: [],
      pageNum: 1,
      pageNumSize: 10,
      begintime: undefined,
      endtime: undefined,
      readouts: [{
        title: '开始时间',
        dataIndex: 'begin',
        render: (text, record, index) => {
          return (
            <div>
              <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
          )
        }
      }, {
        title: '结束时间',
        dataIndex: 'end',
        render: (text, record, index) => {
          return (
            <div>
              <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
          )
        }
      }, {
        title: '监测时长(分)',
        dataIndex: 'begin',
        render: (text, record, index) => {
          return (
            <div>
              <span>{(Math.round(parseFloat((record.end - record.begin) / 100 / 60)) / 10).toFixed(1)}</span>
            </div>
          )
        }
      }
        // , {
        //   title: "电流",
        //   dataIndex: "electricity",
        // }
        , {
        title: "功率",
        dataIndex: "power",
      }],
    };



    this.nodeInfoTableColumns = [
      {
        title: "所属酒店",
        dataIndex: "siteName",
      }, {
        title: "设备位置",
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
        // sorter: (a, b) => new Date(a) > new Date(b) ? 1 : -1,
        // sortOrder: 'ascend',
        render: (text, record, index) => {
          return (
            <div>
              <span>{moment(new Date(text.replace(/-/g, '/'))).format('YYYY-MM-DD')}</span>
            </div>
          )
        }
      }, {
        title: "监测时长(分)",
        dataIndex: "runtime",
        render: (text, record, index) => {
          return (
            <div>
              <span>{parseFloat(text / 60).toFixed(1)}</span>
            </div>
          )
        }
      }, {
        title: "监测数据",
        dataIndex: "id",
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
      }
    ];
  }


  componentWillMount() {
    document.title = "插座监测数据";
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

    this.detectionService()

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
            userlist: []
          })
        } else {
          this.setState({
            userlist: res.data.data.detectionVOList,
            total: res.data.data.total
          })
        }
      }
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
      null,
      null,
      this.state.endtime === undefined ? moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
      text
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          userlist: res.data.data.detectionVOList,
          total: res.data.data.total,
        })
      }
    })
  }


  handleCancel = (e) => {
    console.log(e);
    this.setState({
      historyvisible: false,
    });
  }

  state = { historyvisible: false }
  showhistory = (text, record, index) => {
    newdetection([
      record.id,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        if (res.data.data.readings === undefined) {
          message.error('暂无插座数据')
        } else {
          if (JSON.parse(res.data.data.readings).length === 0) {
            message.error('暂无插座数据')
          } else {
            this.setState({
              historyvisible: true,
              readout: res.data.data.readings === null ? [] : JSON.parse(res.data.data.readings)
            }
              , function () {
                if (this.state.readout.length < 10) {
                  this.setState({
                    pages: false
                  })
                } else {
                  this.setState({
                    pages: true
                  })
                }
              }
            );
          }

        }

      }
    })
  }



  query = () => {
    console.log(this.state.site)
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
        this.setState({
          userlist: res.data.data.detectionVOList,
          total: res.data.data.total,
        })
      }
    });

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
        this.setState({
          userlist: res.data.data.detectionVOList,
          total: res.data.data.total,
        });
      });
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
    return (
      <Layout>
        <Layout id="socketdata">
          <Content style={{ margin: "16px 16px" }}>
            <Card title="插座监测数据" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
            >
              <div>
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
                <div style={{ marginTop: "20px", marginBottom: '20px' }}>
                  关键字搜索&nbsp;: &nbsp;&nbsp;&nbsp;
                <Input placeholder="请输入关键字" style={{ width: '300px', marginRight: '20px' }}
                    value={this.state.keytext}
                    onChange={this.keytext}
                  />
                  <Button type="primary" onClick={this.query}>查询</Button>
                  <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
                </div>
                <Table
                  dataSource={this.state.userlist}
                  columns={this.nodeInfoTableColumns}
                  pagination={false}
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
            </Card>
            <Modal
              title="本日读数"
              width='600px'
              destroyOnClose
              // maskStyle={{ background: "black", opacity: '0.1' }}
              visible={this.state.historyvisible}
              onOk={this.handleOk}
              centered
              footer={null}
              onCancel={this.handleCancel}
              mask={false}
            >

              <Table
                bordered
                dataSource={this.state.readout}
                columns={this.state.readouts}
                pagination={this.state.pages}
                rowClassName="editable-row"
              />
            </Modal>
          </Content>

        </Layout>
      </Layout >
    );
  }
}

export default App;
