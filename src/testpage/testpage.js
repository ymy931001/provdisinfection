import React from "react";
import {
  Table,
  Layout,
  Card,
  Tabs,
  Button,
  DatePicker,
  Cascader,
  Select, Modal
} from "antd";

import {
  testmotion,
  testindex,
  getregion,
  roomlist,
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

  //房间选择
  roomchange = (value) => {
    console.log(value)
    this.setState({
      roomId: value
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
        </Layout>
      </Layout>
    );
  }
}

export default App;
