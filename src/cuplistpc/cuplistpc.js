import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Input,
  Modal,
  Cascader,
  DatePicker,
} from "antd";
import {
  getregion, getcup
} from "../axios";
import "./cuplistpc.css";
import moment from 'moment';
// import { Link } from 'react-router-dom';

const { Content } = Layout;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      begintime: undefined,
      endtime: undefined,
    };
    this.cupcolumns = [
      {
        title: "酒店名称",
        dataIndex: "siteName",
      }, {
        title: "房间号",
        dataIndex: "roomName",
      },
      {
        title: "清洗日期",
        dataIndex: "date",
        render: (text, record, index) => {
          return (
            <div>
              <span>{moment(text.replace(/-/g, '/')).format('YYYY-MM-DD')}</span>
            </div>
          )
        }
      },
      {
        title: "退房数量",
        dataIndex: "checkoutCount",
        // render: (text, record, index) => {
        //   if (text === "1") {
        //     return (
        //       <div>
        //         <span style={{ color: 'green' }}>已消毒</span>
        //       </div>
        //     )
        //   } else {
        //     return (
        //       <div>
        //         <span style={{ color: 'red' }}>未消毒</span>
        //       </div>
        //     )
        //   }
        // }
      }
      , {
        title: "详情",
        dataIndex: "detail",
        render: (text, record, index) => {
          if (text === null) {
            return (
              <div>
                <span style={{ color: 'red' }}>无记录</span>
              </div>
            )
          } else {
            return (
              <div>
                <a
                  onClick={() => this.detillist(text, record, index)}
                >详情</a>
              </div>
            )
          }
        }
      },
      {
        title: "操作人",
        dataIndex: "cleanerName",
      }
      ,
      {
        title: "提交时间",
        dataIndex: "gmtcreate",
        sorter: (a, b) => new Date(a.gmtcreate) > new Date(b.gmtcreate) ? 1 : -1,
        defaultSortOrder: "descend"
      }


      // {
      //   title: "负责人说明",
      //   dataIndex: "cupRecord.remark",
      //   render: (text, record, index) => {
      //     if (text === null || text === "" || text === undefined) {
      //       return (
      //         <div>
      //           <a
      //             onClick={() => this.explain(text, record, index)}
      //           >添加</a>

      //         </div>
      //       )
      //     } else {
      //       return (
      //         <div style={{ color: "red" }}>
      //           {text}
      //         </div>
      //       )
      //     }
      //   }
      // }
    ];

    this.cabinetcolumns = [

      {
        title: "杯具编号",
        dataIndex: "id",
      }
      ,
      {
        title: "杯具名称",
        dataIndex: "name",
      }
      , {
        title: "杯具数量",
        dataIndex: "count",
      }
      ,
    ]



  }


  componentWillMount() {
    document.title = "杯具清洗记录";

    getcup([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          cuplist: res.data.data
        });
      }
    });

    getregion().then(res => {
      if (res.data && res.data.message === "success") {
        console.log(res.data.data[0].children[0].children[0].children[0].children.length)
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
      }
    });

  }

  componentDidMount() {
  }

  //打开清洗记录详情
  detillist = (text, record, index) => {
    this.setState({
      cabinetlist: JSON.parse(record.detail),
      visible: true,
    }, function () {
      if (this.state.cabinetlist.length < 10) {
        this.setState({
          cuppage: false,
        })
      } else {
        this.setState({
          cuppage: true,
        })
      }
    })
  }

  //打开负责人说明
  explain = (text, record, index) => {
    console.log(record)
    this.setState({
      id: record.cupRecord.id,
      describevisible: true,
    })
  }


  //关闭model
  handleCancel = () => {
    this.setState({
      visible: false,
      describevisible: false,
    })
  }

  //负责人说明
  remarkchange = (e) => {
    this.setState({
      remark: e.target.value,
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
  // //添加负责人说明
  // explainok = () => {
  //   addRemark([
  //     this.state.id,
  //     this.state.remark
  //   ]).then(res => {
  //     if (res.data && res.data.message === "success") {
  //       message.success('添加成功')
  //       this.setState({
  //         visible: false,
  //         describevisible: false,
  //       })
  //       getcup([

  //       ]).then(res => {
  //         if (res.data && res.data.message === "success") {
  //           this.setState({
  //             cuplist: res.data.data
  //           });
  //         }
  //       });
  //     }

  //   });

  // }

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
      getcup([
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          this.setState({
            cuplist: res.data.data
          });
        }
      });
    })

  }

  //查询
  query = () => {
    getcup([
      this.state.cityid,
      this.state.areaid,
      this.state.siteId,
      this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
      this.state.endtime === undefined ? moment(new Date() - 3600 * 24 * 1000).format("YYYY-MM-DD") : moment(this.state.endtime).format('YYYY-MM-DD'),
      this.state.keytext,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          cuplist: res.data.data
        });
      }
    });
  }

  //关键字录入
  keytext = (e) => {
    this.setState({
      keytext: e.target.value
    })
  }


  render() {
    return (
      <Layout id="cuplistpc">
        <Layout>
          <Content style={{ margin: "16px 16px" }}>
            <Card title="杯具清洗记录" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
            >
              <div>
                <div className="header">
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
                    <div style={{ marginTop: "20px" }}>
                      关键字搜索&nbsp;: &nbsp;&nbsp;&nbsp;
                <Input placeholder="请输入关键字" style={{ width: '300px', marginRight: '20px' }}
                        value={this.state.keytext}
                        onChange={this.keytext}
                      />
                      <Button type="primary" onClick={this.query}>查询</Button>
                      <Button onClick={this.reset} style={{ marginLeft: '15px', marginRight: '15px' }}>重置</Button>
                      {/* <Button type="primary" onClick={this.monthbtn}>
                        <Link to="/app/monthstatistics">
                          <span>月度打卡</span>
                        </Link>
                      </Button> */}
                    </div>
                  </div>
                </div>
                <Table
                  dataSource={this.state.cuplist}
                  columns={this.cupcolumns}
                  pagination={this.state.page}
                />
              </div>
            </Card>
          </Content>
          <Modal
            title="杯具清洗记录"
            width='400px'
            destroyOnClose
            visible={this.state.visible}
            centered
            footer={null}
            onCancel={this.handleCancel}
            mask={false}
          >
            <Table
              dataSource={this.state.cabinetlist}
              columns={this.cabinetcolumns}
              pagination={this.state.cuppage}
              bordered
            />
          </Modal>
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
      </Layout >
    );
  }
}

export default App;
