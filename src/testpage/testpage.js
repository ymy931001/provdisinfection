import React from "react";
import {
  Table,
  Layout,
  Card,
  Tabs,
  Button,
  DatePicker,
  Cascader,
  Select, Modal, message,
  Input, Pagination
} from "antd";

import {
  testmotion,
  testindex,
  getregion,
  roomlist,
  testai
} from "../axios";
import "./testpage.css";
import moment from 'moment';
const { Content } = Layout;
const { TabPane } = Tabs;
const Option = Select.Option;
function callback(key) {
  console.log(key);
}


class App extends React.Component {
  state = {
    collapsed: false,
    otaInfoTableDataSource: [],
    deviceList: [],
    isclist: [],
    historydata: [],
    roomlist: [],
    otaModalVisible: null,
    time: moment(new Date().getTime()),
    times: moment(new Date().getTime()),
    pageNum: 1,
    pageNumSize: 10,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() {

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




  }



  //关闭model
  handleCancel = () => {
    this.setState({
      visible: false,
      historyvisible: false,
      requestvisible: false,
      responsevisible: false,
    })
  }

  //关闭model
  requestCancel = () => {
    this.setState({
      requestimgvisible: false,
      lookimgurl: null
    })
  }

  //关闭model
  responseCancel = () => {
    this.setState({
      responseimgvisible: false,
      lookimgurls: null
    })
  }




  //打开model
  detail = (text, record, index) => {
    this.setState({
      historyvisible: true,
      readout: JSON.parse(text)
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
    }, function () {
      roomlist([
        this.state.siteId
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          var arr = []
          for (var i in res.data.data) {
            arr.push({
              'id': res.data.data[i].id,
              'name': res.data.data[i].name,
            })
          }
          this.setState({
            roomlist: arr
          })
        }
      });
    });
  }

  timeChange = (value, values) => {
    console.log(values)
    this.setState({
      time: moment(values)
    });
  }

  timeChanges = (value, values) => {
    this.setState({
      times: moment(values)
    });
  }


  query = () => {
    testmotion([
      this.state.roomId,
      moment(this.state.time).format("YYYY-MM-DD"),
    ]).then(res => {
      this.setState({
        isclist: res.data.data
      })
    });

    testindex([
      this.state.roomId,
      moment(this.state.time).format('YYYY-MM-DD'),
    ]).then(res => {
      this.setState({
        historydata: res.data.data
      })
    });
  }



  aiquery = () => {
    testai([
      this.state.pageNum,
      this.state.pageNumSize,
      moment(this.state.times).format("YYYY-MM-DD"),
    ]).then(res => {
      this.setState({
        aidata: res.data.data.detectionAiList,
        total: res.data.data.total,
      })
    });
  }


  //房间选择
  roomchange = (value) => {
    console.log(value)
    this.setState({
      roomId: value
    })
  }

  //打开请求详情
  openrequest = (text, record, index) => {
    this.setState({
      requestvisible: true,
      requestdata: JSON.parse(text),
      requestdatas: JSON.parse(text),
    }, function () {
      console.log(this.state.requestdata)
    })
  }

  //打开返回详情
  openresponse = (text, record, index) => {
    if (!text) {
      message.error('暂无数据')
    } else {
      this.setState({
        responsevisible: true,
        responsedata: JSON.parse(text).result,
        responsedatas: JSON.parse(text).result,
      }, function () {
        console.log(this.state.requestdata)
      })
    }
  }


  //打开请求图片列表
  opendetail = (text, record, index) => {
    this.setState({
      requestimgvisible: true,
      requestimgdata: text,
    }, function () {
      if (this.state.requestimgdata.length > 10) {
        this.setState({
          imgpage: true
        })
      } else {
        this.setState({
          imgpage: false
        })
      }
    })
  }

  //打开返回图片列表
  opendetails = (text, record, index) => {
    this.setState({
      responseimgvisible: true,
      responseimgdata: text,
    }, function () {
      if (this.state.responseimgdata.length > 10) {
        this.setState({
          imgpages: true
        })
      } else {
        this.setState({
          imgpages: false
        })
      }
    })
  }



  //code输入
  keytext = (e) => {
    this.setState({
      keytext: e.target.value
    })
  }

  //code搜索
  codequery = () => {
    var arr = []
    if (!this.state.keytext) {
      message.error('请输入搜索内容')
    } else {
      for (var i in this.state.requestdata) {
        if (this.state.requestdata[i].code === this.state.keytext) {
          arr.push(this.state.requestdata[i])
        }
      }
      this.setState({
        requestdata: arr
      })
    }
  }


  //code输入
  codetext = (e) => {
    this.setState({
      codetext: e.target.value
    })
  }



  //code搜索
  codequerys = () => {
    var arr = []
    if (!this.state.codetext) {
      message.error('请输入搜索内容')
    } else {
      for (var i in this.state.responsedata) {
        if (this.state.responsedata[i].code === this.state.codetext) {
          arr.push(this.state.responsedata[i])
        }
      }
      this.setState({
        responsedata: arr
      })
    }
  }



  codereset = () => {
    var arr = this.state.requestdatas
    this.setState({
      requestdata: arr,
      keytext: null
    })
  }

  coderesets = () => {
    var arr = this.state.responsedatas
    this.setState({
      responsedata: arr,
      codetext: null
    })
  }

  //查看返回图片
  openresponseimg = (text, record, index) => {
    if (!text) {
      message.error('暂无图片')
    } else {
      this.setState({
        lookimgurls: 'http://iva.terabits.cn/' + text
      })
    }
  }

  //查看图片
  openrequestimg = (text, record, index) => {
    if (!text) {
      message.error('暂无图片')
    } else {
      this.setState({
        lookimgurl: 'http://iva.terabits.cn/' + text
      })
    }
  }


  //设备离线筛选
  pagechange = (page, num) => {
    this.setState({
      pageNum: page,
      pageNumSize: num,
    }, function () {
      testai([
        this.state.pageNum,
        this.state.pageNumSize,
        moment(this.state.times).format("YYYY-MM-DD"),
      ]).then(res => {
        this.setState({
          aidata: res.data.data.detectionAiList,
          total: res.data.data.total,
        })
      });
    })
  }



  render() {
    const roomoption = this.state.roomlist.map((province) => <Option key={province.id}>{province.name}</Option>);
    const otaInfoTableColumns = [
      {
        title: "时间",
        dataIndex: "gmtcreate",
      }
    ];

    const readouts = [
      {
        title: "结果",
        dataIndex: "confident",
      }, {
        title: "时间",
        dataIndex: "index",
        render: (text, record, index) => {
          return (
            <div>
              <div>
                {/* {new Date(text)} */}
                {moment(new Date(parseInt(text, 10))).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
          )
        }
      }
    ];


    const nextColumns = [
      {
        title: "code",
        dataIndex: "code",
      },
      {
        title: "时间",
        dataIndex: "gmtcreate",
      },
      {
        title: "状态",
        dataIndex: "status",
        render: (text, record, index) => {
          if (text === true) {
            return (
              <div>
                <div style={{ color: 'green' }}>
                  true
                </div>
              </div>
            )
          } else {
            return (
              <div>
                <div style={{ color: 'red' }}>
                  false
                </div>
              </div>
            )
          }

        }
      }
      ,
      {
        title: "详情",
        dataIndex: "indexs",
        render: (text, record, index) => {
          return (
            <div>
              <div onClick={() => this.detail(text, record, index)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                详情
              </div>
            </div>
          )
        }
      }
    ];


    const aiColumns = [
      {
        title: "uuid",
        dataIndex: "uuid",
      },
      {
        title: "时间",
        dataIndex: "gmtcreate",
      },
      {
        title: "请求",
        dataIndex: "request",
        render: (text, record, index) => {
          return (
            <div>
              <div onClick={() => this.openrequest(text, record, index)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                详情
              </div>
            </div>
          )
        }
      },
      {
        title: "返回",
        dataIndex: "response",
        render: (text, record, index) => {
          return (
            <div>
              <div onClick={() => this.openresponse(text, record, index)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                详情
              </div>
            </div>
          )
        }
      }
    ];

    const requestcolumns = [
      {
        title: "code",
        dataIndex: "code",
      },
      {
        title: "详情",
        dataIndex: "files",
        render: (text, record, index) => {
          return (
            <div>
              <div onClick={() => this.opendetail(text, record, index)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                详情
              </div>
            </div>
          )
        }
      },
      {
        title: "hash",
        dataIndex: "hash",
      }
    ];


    const responsecolumns = [
      {
        title: "code",
        dataIndex: "code",
      },
      {
        title: "详情",
        dataIndex: "files",
        render: (text, record, index) => {
          return (
            <div>
              <div onClick={() => this.opendetails(text, record, index)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                详情
              </div>
            </div>
          )
        }
      },
      {
        title: "hash",
        dataIndex: "hash",
      }
      ,
      {
        title: "检测状态",
        dataIndex: "status",
        filters: [
          { text: "有效", value: true },
          { text: "无效", value: false },
        ],
        onFilter: (value, record) => record.status == value,  //eslint-disable-line 
        render: (text, record, index) => {
          if (text === false) {
            return (
              <div>
                <span style={{ color: 'red' }}>无效</span>
              </div>
            )
          } else {
            return (
              <div>
                <span style={{ color: 'green' }}>有效</span>
              </div>
            )
          }
        }
      }
    ];

    const requestimgcolumns = [
      {
        title: "路径",
        dataIndex: "filename",
      },
      {
        title: "详情",
        dataIndex: "filename",
        render: (text, record, index) => {
          return (
            <div>
              <div onClick={() => this.openrequestimg(text, record, index)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                查看
              </div>
            </div>
          )
        }
      }
    ];

    const responseimgcolumns = [
      {
        title: "路径",
        dataIndex: "filename",
        width: '300px'
      }, {
        title: "置信度",
        dataIndex: "confidence",
      }, {
        title: "是否有人",
        dataIndex: "status",
        render: (text, record, index) => {
          if (text === false) {
            return (
              <div>
                <span style={{ color: 'red' }}>无</span>
              </div>
            )
          } else {
            return (
              <div>
                <span style={{ color: 'green' }}>有</span>
              </div>
            )
          }
        }
      },
      {
        title: "详情",
        dataIndex: "filename",
        render: (text, record, index) => {
          return (
            <div>
              <div onClick={() => this.openresponseimg(text, record, index)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                查看
              </div>
            </div>
          )
        }
      }
    ];

    return (
      <Layout>
        <Layout id="warning">
          <Content style={{ margin: "16px 16px" }} >
            <Card title="测试信息" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
            >
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="动检信息" key="1">
                  <Cascader
                    fieldNames={{ label: 'name', value: 'adcode' }}
                    options={this.state.deviceList}
                    onChange={this.addresschange}

                    value={this.state.addresslist}
                    changeOnSelect
                    style={{ width: "350px", marginRight: '20px' }}
                    placeholder="选择酒店" />
                  <Select
                    style={{ width: '200px', marginRight: '20px' }}
                    placeholder="请选择所属房间"
                    onChange={this.roomchange}
                    value={this.state.roomId}
                  >
                    {roomoption}
                  </Select>
                  <DatePicker onChange={this.timeChange} value={this.state.time} />
                  <Button type="primary" onClick={this.query} style={{ marginLeft: '15px' }}>查询</Button>
                  <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
                  <div style={{ marginTop: 20 }}>
                    <Table
                      dataSource={this.state.isclist}
                      columns={otaInfoTableColumns}
                    />
                  </div>
                </TabPane>
                <TabPane tab="原始信息" key="2" style={{ minHeight: "700px" }}>
                  <div style={{ marginTop: 5 }}>
                    <Cascader
                      fieldNames={{ label: 'name', value: 'adcode' }}
                      options={this.state.deviceList}
                      onChange={this.addresschange}

                      value={this.state.addresslist}
                      changeOnSelect
                      style={{ width: "350px", marginRight: '20px' }}
                      placeholder="选择酒店" />
                    <Select
                      style={{ width: '200px', marginRight: '20px' }}
                      placeholder="请选择所属房间"
                      onChange={this.roomchange}
                      value={this.state.roomId}
                    >
                      {roomoption}
                    </Select>
                    <DatePicker onChange={this.timeChange} value={this.state.time} />
                    <Button type="primary" onClick={this.query} style={{ marginLeft: '15px' }}>查询</Button>
                    <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
                    <Table
                      dataSource={this.state.historydata}
                      columns={nextColumns}
                      style={{ marginTop: '20px' }}
                    // pagination={this.state.page}
                    />
                  </div>
                </TabPane>
                <TabPane tab="ai交互信息" key="3" style={{ minHeight: "700px" }}>
                  <div style={{ marginTop: 5 }}>
                    <DatePicker onChange={this.timeChanges} value={this.state.times} />
                    <Button type="primary" onClick={this.aiquery} style={{ marginLeft: '15px' }}>查询</Button>
                    <Table
                      dataSource={this.state.aidata}
                      columns={aiColumns}
                      style={{ marginTop: '20px' }}
                      pagination={false}
                    />
                    <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                      <Pagination
                        defaultCurrent={1}
                        onChange={this.pagechange}
                        total={this.state.total}
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
            title="详情"
            width='600px'
            destroyOnClose
            // maskStyle={{ background: "black", opacity: '0.1' }}
            visible={this.state.historyvisible}
            centered
            footer={null}
            onCancel={this.handleCancel}
            mask={false}
          >
            <Table
              bordered
              dataSource={this.state.readout}
              columns={readouts}
              rowClassName="editable-row"
            />
          </Modal>
          <Modal
            title="请求详情"
            width='600px'
            destroyOnClose
            visible={this.state.requestvisible}
            centered
            footer={null}
            onCancel={this.handleCancel}
            mask={false}
          >
            <Input placeholder="请输入code" style={{ width: '300px', marginRight: '20px', marginBottom: '20px' }}
              value={this.state.keytext}
              onChange={this.keytext}
            />
            <Button type="primary" onClick={this.codequery}>查询</Button>
            <Button onClick={this.codereset} style={{ marginLeft: '15px' }}>重置</Button>
            <Table
              bordered
              dataSource={this.state.requestdata}
              columns={requestcolumns}
              rowClassName="editable-row"
            />
          </Modal>
          <Modal
            title="返回详情"
            width='600px'
            destroyOnClose
            visible={this.state.responsevisible}
            centered
            footer={null}
            onCancel={this.handleCancel}
            mask={false}
          >
            <Input placeholder="请输入code" style={{ width: '300px', marginRight: '20px', marginBottom: '20px' }}
              value={this.state.codetext}
              onChange={this.codetext}
            />
            <Button type="primary" onClick={this.codequerys}>查询</Button>
            <Button onClick={this.coderesets} style={{ marginLeft: '15px' }}>重置</Button>
            <Table
              bordered
              dataSource={this.state.responsedata}
              columns={responsecolumns}
              rowClassName="editable-row"
            />
          </Modal>
          <Modal
            title="请求图片查看"
            width='600px'
            destroyOnClose
            visible={this.state.requestimgvisible}
            centered
            footer={null}
            onCancel={this.requestCancel}
            mask={false}
          >
            <Table
              bordered
              dataSource={this.state.requestimgdata}
              columns={requestimgcolumns}
              pagination={this.state.imgpage}
              rowClassName="editable-row"
            />
            <div style={{ width: '100%' }}>
              <img src={this.state.lookimgurl} alt="" style={{ width: '100%' }} />
            </div>
          </Modal>
          <Modal
            title="返回图片查看"
            width='600px'
            destroyOnClose
            visible={this.state.responseimgvisible}
            centered
            footer={null}
            onCancel={this.responseCancel}
            mask={false}
          >
            <Table
              bordered
              dataSource={this.state.responseimgdata}
              columns={responseimgcolumns}
              pagination={this.state.imgpages}
              rowClassName="editable-row"
            />
            <div style={{ width: '100%' }}>
              <img src={this.state.lookimgurls} alt="" style={{ width: '100%' }} />
            </div>
          </Modal>
        </Layout>
      </Layout>
    );
  }
}

export default App;
