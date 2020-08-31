import React from "react";
import {
  Table,
  Layout,
  Card,
  Tabs,
  Modal,
  Input,
  Drawer,
  Button,
  Select,
  message,
  Tree, Tooltip, Radio
} from "antd";
import {
  getaudit,
  isclist,
  iscarea,
  checkaudit,
  failaudit
} from "../axios";
import "./examine.css";

const { DirectoryTree } = Tree;
const { Content } = Layout;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Search } = Input;
const Option = Select.Option;

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
      iscplatform: [],
      roomdetaildata: [],
    };
    this.cleanercolumn = [{
      title: '保洁员姓名',
      dataIndex: 'name',
    }, {
      title: '联系电话',
      dataIndex: 'phone',
    }, {
      title: '性别',
      dataIndex: 'sex',
      render: (text, record, index) => {
        if (text === 2) {
          return (
            <div>
              女
            </div>
          )
        }
        if (text === 1) {
          return (
            <div>
              男
            </div>
          )
        }
      }
    }, {
      title: '健康证编号',
      dataIndex: 'certificatecode',
    }, {
      title: '发证时间',
      dataIndex: 'issueDate',
      render: (text, record, index) => {
        return (
          <div>
            <span>
              {text}
            </span>
          </div>
        );
      }
    }, {
      title: '健康证',
      dataIndex: 'remark',
      render: (text, record, index) => {
        return (
          <div>
            <span onClick={() => this.openhealthcard(text, record, index)}>
              <a>查看</a>
            </span>
          </div>
        );
      }
    }]

      this.cabinetcolumn = [{
        title: '品牌',
        dataIndex: 'brand',
      }, {
        title: '型号',
        dataIndex: 'model',
      }, {
        title: '容量',
        dataIndex: 'capacity',
      }, {
        title: '功率',
        dataIndex: 'power',
      }, {
        title: '额定工作时长',
        dataIndex: 'standartTime',
      }, {
        title: '照片',
        dataIndex: 'photo',
        render: (text, record, index) => {
          return (
            <div>
              <span onClick={() => this.opencabinetimg(text, record, index)}>
                <a>查看</a>
              </span>
            </div>
          );
        }
      }]
  }
  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() {

  }

  componentDidMount() {

    this.getaudit()
    isclist([
    ]).then(res => {
      if (res.data && res.data.code === 0) {
        console.log(77777)
        var arr = []
        for (var i in res.data.data) {
          arr.push({
            'id': i,
            "value": res.data.data[i]
          })
        }
        this.setState({
          iscplatform: arr
        })
        console.log(arr)
        // this.setState({
        //   boardlist: JSON.parse(res.data.data)
        // })
      }
    });
  }

  getaudit = () => {
    getaudit([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var arr = []
        var roomarr = []
        for (var i in res.data.data) {
          if (res.data.data[i].type === 1) {
            arr.push(res.data.data[i])
          } else {
            roomarr.push(res.data.data[i])
          }
        }
        this.setState({
          warningListDataSource: arr,
          roomdata: roomarr
        }, function () {
          if (arr.length < 10) {
            this.setState({
              page: false
            })
          } else {
            this.setState({
              page: true
            })
          }
          if (roomarr.length < 10) {
            this.setState({
              roompage: false
            })
          } else {
            this.setState({
              roompage: true
            })
          }
        })
      }
    });

  }


  //打开负责人说明
  explain = (text, record, index) => {
    this.setState({
      describevisible: true,
    })
  }

  //查看健康证
  openhealthcard = (text, record, index) => {
    this.setState({
      certificate: record.certificate
    })
  }

  //查看消毒柜照片
  opencabinetimg = (text, record, index) => {
    this.setState({
      cabinetimg: record.photo
    })
  }




  //关闭model
  handleCancel = () => {
    this.setState({
      describevisible: false,
      successvisible: false,
      failvisible: false,
    })
  }


  //关闭审核详情抽屉
  onClose = (e) => {
    this.setState({
      cleanervisible: false,
      iscvisible: false,
      successcleanervisible: false,
      certificate: null,
      successroomvisible: false,
    });
  }

  //打开审核详情抽屉
  lookdetail = (text, record, index) => {
    console.log(JSON.parse(record.detail))
    this.setState({
      cleanerdata: JSON.parse(record.detail).cleanerDTOS,
      cleanervisible: true,
      hotelname: JSON.parse(record.detail).sitename,
      hoteladdress: JSON.parse(record.detail).address,
      creditcode: JSON.parse(record.detail).creditcode,
      mail: JSON.parse(record.detail).mail,
      phone: JSON.parse(record.detail).phone,
      license: JSON.parse(record.detail).license,
      adminName: JSON.parse(record.detail).adminName,
    }, function () {
      if (this.state.cleanerdata.length < 10) {
        this.setState({
          cleanerpage: false,
        })
      }
    });
  }



  //打开审核通过详情抽屉
  looksueccessdetail = (text, record, index) => {
    console.log(JSON.parse(record.detail))
    this.setState({
      cleanerdata: JSON.parse(record.detail).cleanerDTOS,
      successcleanervisible: true,
      hotelname: JSON.parse(record.detail).sitename,
      hoteladdress: JSON.parse(record.detail).address,
      creditcode: JSON.parse(record.detail).creditcode,
      mail: JSON.parse(record.detail).mail,
      phone: JSON.parse(record.detail).phone,
      license: JSON.parse(record.detail).license,
      adminName: JSON.parse(record.detail).adminName,
      iscName: record.iscName,
      regionName: record.regionName,
    }, function () {
      if (this.state.cleanerdata.length < 10) {
        this.setState({
          successcleanerpage: false,
        })
      }
    });
  }


  //打开审核通过
  successbtn = (text, record, index) => {
    this.setState({
      successvisible: true,
      checkid: record.id
    })
  }

  //打开审核不通过
  failbtn = (text, record, index) => {
    this.setState({
      failvisible: true,
      checkid: record.id
    })
  }



  successOk = () => {
    checkaudit([
      this.state.checkid,
      true,
      this.state.iscplatformid,
      this.state.iscplatformname,
      localStorage.getItem('namezh'),
      this.state.regionCode,
      this.state.regionName,
      this.state.ifHasCup,
      this.state.remark,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('审核通过')

        this.getaudit()
        this.setState({
          successvisible: false,
        })
      }
    });
  }


  failOk = () => {
    failaudit([
      this.state.checkid,
      false,
      localStorage.getItem('namezh'),
      this.state.remark,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.error('审核不通过')
        this.setState({
          failvisible: false,
        })
        this.getaudit()
      }
    });
  }




  //ISC平台选择
  iscchange = (value, b) => {
    console.log(b)
    this.setState({
      iscplatformid: value,
      iscplatformname: b.props.children
    }, function () {
      iscarea([
        this.state.iscplatformid,
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          console.log(res.data.data[0].name)
          var arr = []
          for (var a in res.data.data) {
            arr.push({
              'title': res.data.data[a].name,
              'key': res.data.data[a].indexCode,
              'children': res.data.data[a].children
            })
          }
          for (var i in arr) {
            for (var j in arr[i].children) {
              if (arr[i].children[j].children != undefined && arr[i].children[j].children.length != 0) {  //eslint-disable-line
                arr[i].children[j].title = arr[i].children[j].name
                arr[i].children[j].key = arr[i].children[j].indexCode
                arr[i].children[j].children = arr[i].children[j].children
                for (var k in arr[i].children[j].children) {
                  if (arr[i].children[j].children[k].children != undefined && arr[i].children[j].children[k].children.length != 0) {  //eslint-disable-line
                    arr[i].children[j].children[k].title = arr[i].children[j].children[k].name
                    arr[i].children[j].children[k].key = arr[i].children[j].children[k].indexCode
                  } else {
                    arr[i].children[j].children[k].title = arr[i].children[j].children[k].name
                    arr[i].children[j].children[k].key = arr[i].children[j].children[k].indexCode
                    arr[i].children[j].children[k].children = undefined
                  }
                }
              } else {
                arr[i].children[j].title = arr[i].children[j].name
                arr[i].children[j].key = arr[i].children[j].indexCode
                arr[i].children[j].children = undefined
              }
            }
          }
          this.setState({
            treeData: arr,
            // iscoption: arr
          })
        }
      });
    })
  }


  //摄像头列表
  iscquery = () => {
    if (this.state.iscplatformid === "") {
      message.error("请选择安防平台种类")
    } else {
      this.setState({
        iscvisible: true
      })
    }
  }


  //树形图选择
  onSelects = (keys, event) => {
    console.log(keys)
    console.log(keys.length)
    console.log(keys.join(','))
    console.log(event)
    this.setState({
      regionName: event.node.props.name,
      regionCode: keys.join(','),
    })
  }


  //备注填写
  remarkchange = (e) => {
    this.setState({
      remark: e.target.value
    })
  }

  //关闭弹窗
  submitcamera = () => {
    this.setState({
      iscvisible: false,
      areaname: this.state.regionName,
    })
  }


  //打开消毒间注册详情
  lookroomdetail = (text, record, index) => {
    this.setState({
      successroomvisible: true,
      roomdetaildata: JSON.parse(record.detail),
      roomaddress: JSON.parse(record.detail).name,
      hotelname: record.sitename,
      cabinetdata: JSON.parse(record.detail).sterilizerDTOS,
    }, function () {
      if (this.state.cabinetdata.length < 10) {
        this.setState({
          cabinetpage: false,
        })
      }
    })
  }


  //是否具备杯具配置
  ifHasCup = (e) => {
    console.log(e)
    this.setState({
      ifHasCup: e.target.value
    })
  }

  render() {
    const isclistoption = this.state.iscplatform.map((province) => <Option key={province.id}  >{province.value}</Option>);
    const { roomdetaildata } = this.state;
    const otaInfoTableColumns = [
      {
        title: "酒店名称",
        dataIndex: "sitename",
      },
      {
        title: "提交人",
        dataIndex: "author",
      },
      {
        title: "提交时间",
        dataIndex: "gmtcreate",
        defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(a.gmtcreate) - new Date(b.gmtcreate),
      }, {
        title: "审核状态",
        dataIndex: "status",
        render: (text, record, index) => {
          if (text === 1) {
            return (
              <div style={{ color: 'green' }}>
                已审核
              </div>
            )
          }
          else if (text === -1) {
            return (
              <div style={{ color: 'red' }}>
                <Tooltip placement="topLeft" title={record.remark}>
                  审核未通过
                </Tooltip>
              </div>
            )
          }
          else {
            return (
              <div style={{ color: 'red' }}>
                未审核
              </div>
            )
          }
        }
      }, {
        title: "审核人",
        dataIndex: "auditor",
        render: (text, record, index) => {
          if (text === undefined) {
            return (
              <div style={{ color: 'red' }}>
                未审核
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
        title: "审批时间",
        dataIndex: "gmtmodify",
        render: (text, record, index) => {
          if (text === undefined) {
            return (
              <div style={{ color: 'red' }}>
                审核中
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
        title: "提交详情",
        dataIndex: "detail",
        render: (text, record, index) => {
          if (record.status === 1) {
            return (
              <div >
                <a onClick={() => this.looksueccessdetail(text, record, index)}>查看</a>
              </div>
            )
          } else {
            return (
              <div >
                <a onClick={() => this.lookdetail(text, record, index)}>查看</a>
              </div>
            )
          }

        }
      }, {
        title: "操作",
        dataIndex: "id",
        render: (text, record, index) => {
          if (record.status === 1) {
            return (
              <div style={{ color: 'green' }}>
                审核通过
              </div>
            )
          }
          if (record.status === -1) {
            return (
              <div style={{ color: 'red' }}>
                审核未通过
              </div>
            )
          }
          if (record.status === 0) {
            return (
              <div >
                <Button type="primary" style={{ background: '#2c94f4', border: '1px solid #2c94f4' }} onClick={() => this.successbtn(text, record, index)}>
                  通过
                </Button>
                <Button type="primary" style={{ background: 'red', border: '1px solid red', marginLeft: '10px', }} onClick={() => this.failbtn(text, record, index)}>
                  不通过
                </Button>
              </div>
            )
          }
        }
      }

    ];


    const alreadyColumns = [
      {
        title: "酒店名称",
        dataIndex: "sitename",
      },
      {
        title: "房间位置",
        dataIndex: "detail",
        render: (text, record, index) => {
          return (
            <div >
              {JSON.parse(text).name}
            </div>
          )
        }
      }, {
        title: "提交人",
        dataIndex: "author",
      }, {
        title: "联系方式",
        dataIndex: "authorPhone",
      }, {
        title: "插座验证结果",
        dataIndex: "board",
        render: (text, record, index) => {
          if (text === undefined) {
            return (
              <div >
                无
              </div>
            )
          } else {
            if (JSON.parse(text).workStatus === true) {
              return (
                <div style={{ color: 'green' }}>
                  通过
                </div>
              )
            } else {
              return (
                <div style={{ color: 'red' }}>
                  失败
                </div>
              )
            }
          }

        }
      }, {
        title: "提交时间",
        dataIndex: "gmtcreate",
        defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(a.gmtcreate) - new Date(b.gmtcreate),
      }, {
        title: "提交详情",
        dataIndex: "detail",
        render: (text, record, index) => {
          return (
            <div >
              <a onClick={() => this.lookroomdetail(text, record, index)}>查看</a>
            </div>
          )
        }
      }

    ];


    const cabinetcolumn = this.cabinetcolumn.map((col) => {
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

    const cleanercolumn = this.cleanercolumn.map((col) => {
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
      <Layout id="examine">
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="审核统计" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}>
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="酒店注册" key="1">
                  <div style={{ marginTop: 5 }}>
                    <Table
                      dataSource={this.state.warningListDataSource}
                      columns={otaInfoTableColumns}
                      pagination={this.state.page}
                    />
                  </div>
                </TabPane>
                <TabPane tab="消毒间注册" key="2" style={{ minHeight: "700px" }}>
                  <div style={{ marginTop: 5 }}>
                    <Table
                      dataSource={this.state.roomdata}
                      columns={alreadyColumns}
                      pagination={this.state.roompage}
                    />
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Content>
          <Drawer
            title="提交详情"
            width={650}
            onClose={this.onClose}
            visible={this.state.cleanervisible}
          >
            <div style={{ width: '100%' }}>
              <div className="checkline">
                酒店名称：  <span> {this.state.hotelname}</span>
              </div>
              <div className="checkline">
                酒店地址：  <span> {this.state.hoteladdress}</span>
              </div>
              <div className="checkline">
                酒店信用代码：  <span> {this.state.creditcode}</span>
              </div>
              <div className="checkline">
                酒店卫生管理员：  <span> {this.state.adminName}</span>
              </div>
              <div className="checkline">
                酒店卫生管理员联系电话：  <span> {this.state.phone}</span>
              </div>
              <div className="checkline">
                酒店卫生管理员邮箱：  <span> {this.state.mail}</span>
              </div>
              <div className="checklines">
                酒店许可证：
                  <a href={this.state.license} target="_blank" style={{ display: 'contents' }}>
                  <img src={this.state.license} alt="" style={{ width: "25%" }} />
                </a>
              </div>
              <div className="clearlisttitle">
                保洁员列表
              </div>
              <div>
                < Table
                  dataSource={this.state.cleanerdata}
                  columns={cleanercolumn}
                  pagination={this.state.cleanerpage}
                  // components={components}
                  bordered
                />
              </div>
              <div className="healthlines">
                <a href={this.state.certificate} target="_blank" >
                  <img src={this.state.certificate} alt="" style={{ width: "50%" }} />
                </a>
              </div>
            </div>
          </Drawer>

          <Drawer
            title="提交详情"
            width={650}
            onClose={this.onClose}
            visible={this.state.successcleanervisible}
          >
            <div style={{ width: '100%' }}>
              <div className="checkline">
                酒店名称：  <span> {this.state.hotelname}</span>
              </div>
              <div className="checkline">
                酒店地址：  <span> {this.state.hoteladdress}</span>
              </div>
              <div className="checkline">
                酒店信用代码：  <span> {this.state.creditcode}</span>
              </div>
              <div className="checkline">
                酒店卫生管理员：  <span> {this.state.adminName}</span>
              </div>
              <div className="checkline">
                酒店卫生管理员联系电话：  <span> {this.state.phone}</span>
              </div>
              <div className="checkline">
                酒店卫生管理员邮箱：  <span> {this.state.mail}</span>
              </div>
              <div className="checklines">
                酒店许可证：
                  <a href={this.state.license} target="_blank" style={{ display: 'contents' }}>
                  <img src={this.state.license} alt="" style={{ width: "25%" }} />
                </a>
              </div>
              <div className="checkline">
                所属安防平台：  <span> {this.state.iscName}</span>
              </div>
              <div className="checkline">
                所属区域：  <span> {this.state.regionName}</span>
              </div>
              <div className="clearlisttitle">
                保洁员列表
              </div>
              <div>
                < Table
                  dataSource={this.state.cleanerdata}
                  columns={cleanercolumn}
                  pagination={this.state.successcleanerpage}
                  // components={components}
                  bordered
                />
              </div>
              <div className="healthlines">
                <a href={this.state.certificate} target="_blank" >
                  <img src={this.state.certificate} alt="" style={{ width: "50%" }} />
                </a>
              </div>
            </div>
          </Drawer>

          <Drawer
            title="提交详情"
            width={600}
            onClose={this.onClose}
            visible={this.state.successroomvisible}
          >
            <div style={{ width: '100%' }}>
              <div className="cabinetline">
                酒店名称：  <span> {this.state.hotelname}</span>
              </div>
              <div className="cabinetline">
                消毒间位置：  <span> {this.state.roomaddress}</span>
              </div>
              <div className="cabinetline">
                插座IMEI号：  <span> {roomdetaildata.imei}</span>
              </div>
              <div className="cabinetline">
                摄像头编号：  <span> {roomdetaildata.indexCode}</span>
              </div>
              <div className="cabinettitle">
                消毒柜详情
              </div>
              <div>
                < Table
                  dataSource={this.state.cabinetdata}
                  columns={cabinetcolumn}
                  pagination={this.state.cabinetpage}
                  // components={components}
                  bordered
                />
              </div>
              <div className="healthlines">
                <a href={this.state.cabinetimg} target="_blank" >
                  <img src={this.state.cabinetimg} alt="" style={{ width: "50%" }} />
                </a>
              </div>
            </div>
          </Drawer>
          <Modal
            title="审核通过"
            visible={this.state.successvisible}
            onOk={this.successOk}
            width="400px"
            okText="通过"
            centered
            onCancel={this.handleCancel}
          >
            <div className="successline">
              审核人： <span>{localStorage.getItem('namezh')}</span>
            </div>
            <div>
              所属ISC平台：
            <Select
                style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                placeholder="请选择ISC平台"
                onChange={this.iscchange}
              >
                {isclistoption}
              </Select>
            </div>
            <div>
              所属区域：
              <Search
                placeholder="请选择所属区域"
                enterButton="所属区域"
                size="middle"
                onSearch={this.iscquery}
                value={this.state.areaname}
                style={{ width: '100%', marginBottom: "10px", marginTop: '10px', fontSize: '14px' }}
              />
            </div>
            <div>
              是否具备杯具管理功能：
              <Radio.Group onChange={this.ifHasCup} value={this.state.ifHasCup} style={{ marginLeft: '10px' }}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </div>

            <div>
              <span>备注：</span>
              <TextArea rows={4} style={{ width: '100%', marginBottom: "10px", marginTop: '10px', }}
                onChange={this.remarkchange}
                value={this.state.remark}
                placeholder="请输入备注（选填）"
              />
            </div>
          </Modal>
          <Modal
            title="审核不通过"
            visible={this.state.failvisible}
            onOk={this.failOk}
            width="350px"
            okText="不通过"
            centered
            onCancel={this.handleCancel}
          >
            <div className="successline">
              审核人： <span>{localStorage.getItem('namezh')}</span>
            </div>
            <div>
              <span>备注：</span>
              <TextArea rows={4} style={{ width: '100%', marginBottom: "10px", marginTop: '10px', }}
                onChange={this.remarkchange}
                value={this.state.remark}
                placeholder="请输入备注（选填）"
              />
            </div>
          </Modal>
          <Drawer
            title="摄像头列表"
            width={600}
            onClose={this.onClose}
            visible={this.state.iscvisible}
            bodyStyle={{ paddingBottom: 80 }}
          >
            <div className="drawermains">
              <div className="treelists">
                <DirectoryTree
                  multiple
                  defaultExpandAll
                  onSelect={this.onSelects}
                  // onExpand={onExpand}
                  treeData={this.state.treeData}
                />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={this.submitcamera}>确定</Button>
            </div>
          </Drawer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
