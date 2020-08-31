import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Input,
  Modal,
  message,
  Cascader,
  Select,
  AutoComplete
} from "antd";
import {
  devicelist,
  getDeviceList,
  adddevice,
  hotellist,
  insertboard,
  devicestatus,
  deviceserial,
  allargss
} from "../axios";
import "./parameter.css";

const { Content} = Layout;
const Option = Select.Option;







class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      sitelist: [],
      AutoCompletedata: [],
      macedata: [],
    };

    this.nodeInfoTableColumns = [
      {
        title: "设备ID",
        dataIndex: "deviceId",
      }, {
        title: "运行时长",
        dataIndex: "running",
      }, {
        title: "消毒时长",
        dataIndex: "working",
      },
      {
        title: "bbox",
        dataIndex: "bbox",
      }, {
        title: "参数设置",
        dataIndex: "id",
        render: (text, record, index) => {
          return (
            <div style={{ color: '#40a9ff', cursor: 'pointer' }} onClick={() => this.parameter(text, record, index)}>
              <span>查看</span>
            </div>
          )
        }
      }, {
        title: "插座绑定",
        dataIndex: "id",
        render: (text, record, index) => {
          return (
            <div onClick={() => this.socket(text, record, index)} style={{ color: '#40a9ff', cursor: 'pointer' }} >
              添加
          </div>
          )
        }
      },
      {
        title: "添加时间",
        dataIndex: "gmtcreate",
      },
    ];
  }

  componentWillMount() {
    document.title = "酒店设备管理";
  }

  componentDidMount() {
    getDeviceList().then(res => {
      this.setState({
        deviceList: res.data.data
      });
    });


    allargss([
      localStorage.getItem('parameter')
    ]).then(res => {
      this.setState({
        videoListDataSource: res.data.data
      }, function () {
        if (res.data.data.length < 10) {
          this.setState({
            page: false
          })
        } else {
          this.setState({
            page: true
          })
        }
      });
    });


    deviceserial({

    }).then(res => {
      if (res.data && res.data.message === "success") {
        var arr1 = []
        for (var i in res.data.data) {
          arr1.push({
            'left': i,
            'right': res.data.data[i]
          })
        }
        this.setState({
          AutoCompletedata: arr1
        });
      }
    });


    // boardmac({

    // }).then(res => {
    //   if (res.data && res.data.message === "success") {
    //     var arr2 = []
    //     for (var i in res.data.data) {
    //       arr2.push({
    //         'left': i,
    //         'right': res.data.data[i]
    //       })
    //     }
    //     this.setState({
    //       macedata: arr2
    //     });
    //   }
    // });


    var arr = []
    hotellist().then(res => {
      console.log(res.data.data)
      for (var i in res.data.data) {
        arr.push({
          'id': i,
          'value': res.data.data[i]
        })
      }
      this.setState({
        sitelist: arr
      });
    });
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  handleChanges = (value) => {
    console.log(value);
    this.setState({
      siteid: value
    })
  }



  handleOk = () => {
    var sitename = document.getElementById('sitename').value
    adddevice([
      this.state.siteid,
      sitename,
      this.state.devicedata,
    ]).then(res => {
      if (res.data && res.data.code === 1217) {
        message.success('设备添加成功')
        this.setState({
          visible: false,
        })
        devicelist({

        }).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              videoListDataSource: res.data.data
            });
          }
        });

        getDeviceList().then(res => {
          this.setState({
            deviceList: res.data.data
          });
        });
      }
      if (res.data && res.data.code === 1216) {
        message.error('序列号不正确请重新输入')
      }
      if (res.data && res.data.code === 1218) {
        message.success('修改成功')
        this.setState({
          visible: false,
        })
        devicelist({

        }).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              videoListDataSource: res.data.data
            });
          }
        });

        getDeviceList().then(res => {
          this.setState({
            deviceList: res.data.data
          });
        });
      }
    });
  }
  parameter(text, record, index) {

    localStorage.setItem('parameter', text)
    window.location.href = "/app/camera"
  }



  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
      visibles: false,
    });
  }

  socket = (text, record, index) => {
    localStorage.setItem('socketid', text)
    this.setState({
      visibles: true,
    })
  }

  query = () => {
    console.log(this.state.site)
    console.log(this.state.name)
    allargss([
      this.state.site,
      this.state.name,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          videoListDataSource: res.data.data
        })
      }
    });
  }


  handleOks = () => {
    var threshold = document.getElementById('threshold').value
    insertboard([
      localStorage.getItem('socketid'),
      this.state.macdata,
      threshold
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('设备添加成功')
        this.setState({
          visibles: false,
        })
      }
      if (res.data && res.data.message === "查找不到设备") {
        message.error('mac不存在，设备添加失败')
      }
    });
  }

  statuschange = (text, record, index) => {
    console.log(record)
    devicestatus([
      record.id,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('状态修改成功')
        devicelist({

        }).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              videoListDataSource: res.data.data
            }, function () {
              if (res.data.data.length < 10) {
                this.setState({
                  page: false
                })
              } else {
                this.setState({
                  page: true
                })
              }
            });
          }
        });
      }
    });
  }


  addresschange = (e) => {
    console.log(e)
    this.setState({
      site: e[0],
      name: e[1],
    });
  }

  devicedata = (value) => {
    console.log(value)
    this.setState({
      devicedata: value
    })
  }

  macdata = (value) => {
    console.log(value)
    this.setState({
      macdata: value
    })
  }

  render() {
    console.log(this.state.AutoCompletedata)
    const prooptions = this.state.sitelist.map((province) => <Option key={province.id}  >{province.value}</Option>);
    const serialdata = this.state.AutoCompletedata.map(
      (province) => <Option key={province.left} text={province.left}>
        <div className="global-search-item">
          <span className="global-search-item-desc">
            {province.left}
          </span>
          <span className="global-search-item-count" style={{ float: 'right' }}>
            {province.right}
          </span>
        </div>
      </Option>);
    const serialdatas = this.state.macedata.map(
      (province) => <Option key={province.left} text={province.left}>
        <div className="global-search-item">
          <span className="global-search-item-desc" style={{ color: '#1890ff' }}>
            {province.left}
          </span>
          <span className="global-search-item-count" style={{ float: 'right', fontSize: "12px", color: '#999' }}>
            {province.right}
          </span>
        </div>
      </Option>);

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="酒店设备管理" headStyle={{ fontWeight: 'bold', fontSize: '18px' }} id="nodeManage" >
              <div className="gutter-example-nodemanage">
                设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                <Cascader
                  options={this.state.deviceList}
                  onChange={this.addresschange}
                  changeOnSelect
                  style={{ width: "200px", marginRight: '20px' }}
                  placeholder="选择宾馆：消毒间" />
                <Button type="primary" onClick={this.query}>查询</Button>
                <Modal
                  title="添加设备"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  okText="确认"
                  width="400px"
                  destroyOnClose
                  mask={false}
                >
                  <div>
                    <span>设备标识：</span>
                    <Input placeholder="请输入设备标识" id="sitename" style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }} autoComplete="off" />
                  </div>
                  <div>
                    <span>序列号：</span>
                    <AutoComplete
                      style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                      id="serial"
                      dataSource={serialdata}
                      placeholder="请输入设备标识"
                      onChange={this.devicedata}
                      optionLabelProp="text"
                      filterOption={
                        (inputValue, option) =>
                          option.props.text.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                  </div>
                  <div>
                    <span>所属酒店：</span>
                    <Select
                      style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                      placeholder="请选择所属酒店"
                      onChange={this.handleChanges}
                    >
                      {prooptions}
                    </Select>
                  </div>
                </Modal>


                <Modal
                  title="绑定插座"
                  visible={this.state.visibles}
                  onOk={this.handleOks}
                  onCancel={this.handleCancel}
                  okText="确认"
                  destroyOnClose
                  width="400px"
                // mask={false}
                >
                  <div>
                    <span>mac：</span>
                    {/* <Input placeholder="请输入mac值" id="macname" style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }} autoComplete="off" /> */}
                    <AutoComplete
                      style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                      id="macname"
                      dataSource={serialdatas}
                      placeholder="请输入mac值"
                      onChange={this.macdata}
                      optionLabelProp="text"
                      filterOption={
                        (inputValue, option) =>
                          option.props.text.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                    <span>消毒柜工作功率：</span>
                    <Input placeholder="请输入消毒柜工作功率" id="threshold" style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }} autoComplete="off" />
                  </div>
                </Modal>
              </div>
              <div style={{ marginTop: 20 }}>
                <Table
                  dataSource={this.state.videoListDataSource}
                  columns={this.nodeInfoTableColumns}
                  pagination={this.state.page}
                />
              </div>
            </Card>
          </Content>

        </Layout >
      </Layout >
    );
  }
}

export default App;
