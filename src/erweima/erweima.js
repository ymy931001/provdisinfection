import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Modal,
  Col,
  Row,
  Select,
  message,
} from "antd";

import {
  hotellist,
  sendQRcode
} from "../axios";
import "./erweima.css";
import QRCode from 'qrcode-react';
import { Link } from 'react-router-dom';

const { Content } = Layout;
const Option = Select.Option;
const html2canvas = require("html2canvas");



class App extends React.Component {
  state = {
    collapsed: false,
    otaInfoTableDataSource: [],
    sitelist: [],
    selectedRowKeys: [],
    otaModalVisible: null,
    activationvalue: 1,
    distwo: 'none',
    warningListDataSource: [{
      "sitename": "赞成宾馆",
      "key": 1,
      "name": "海康对接接口",
      "room": "主15F消毒间",
      "worknum": 5,
      "date": "2020-05-29 13:20:12",
      "cardid": 135454643,
      "explain": null,
      "reason": "5天未消毒",
      "description": "5天未消毒5天未消毒5天未消毒5天未消毒5天未消毒",
      // "children": [{
      //   "key": 11,
      //   "name": 'John Brown',
      //   "worknum": 42,
      //   "room": "主15F消毒间",
      //   "address": '查看',
      //   "cardid": 135454643
      // }]
    }, {
      "sitename": "赞成宾馆",
      "name": "海康对接接口",
      "worknum": 5,
      "room": "主11F消毒间",
      "key": 2,
      "date": "2020-05-28 16:25:22",
      "cardid": 135464233,
      "explain": null,
      "reason": "5天未消毒",
      "description": "5天未消毒5天未消毒5天未消毒5天未消毒5天未消毒",
    }],
    selectedRows: [{
      "cardid": 135464233,
      "sitename": "赞成宾馆",
    }, {
      "cardid": 135463232,
      "sitename": "赞成宾馆",
    }
    ],
    senddatasource: [{
      "address": "赞成宾馆",
      "num": 15,
      "time": "2020-06-28",
      "remark": "联系人张三，手机13735875774"
    }, {
      "address": "西湖大酒店",
      "num": 10,
      "time": "2020-06-27",
      "remark": "联系人李四，手机15355497220"
    }]
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() {

  }

  componentDidMount() {
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



  //添加工作码
  adderweima = (text, record, index) => {
    this.setState({
      visible: true,
    })
  }



  //关闭model
  handleCancel = () => {
    this.setState({
      visible: false,
      erweimamodel: false,
      workvisible: false,
      sendvisible: false,
      erweimamodels: false,
    })
  }


  lookerweima = () => {
    this.setState({
      erweimamodel: true,
    });
  }

  //时间查询
  timeonChange = (value, dateString) => {
    this.setState({
      begintime: dateString[0],
      endtime: dateString[1],
    });
  }




  createerweima = () => {
    const webContent = this.state.selectedRows.map((item, i) => {
      return (
        <div style={{ textAlign: 'center' }}>
          <div className="custom-image">
            <QRCode
              value={'http://watersupervision.terabits.cn/mobile?deviceId=' + item.cardid}
              size="200"
            />
          </div>
          <div className="custom-card">
            <h5 style={{ textAlign: "center", fontWeight: "700" }}>
              设备编号：{item.cardid}
            </h5>
            {/* <h5 style={{ textAlign: "center", fontWeight: "700" }}>
              所属消毒间：{item.sitename}
            </h5> */}
          </div>

        </div>
      );
    });
    this.setState({
      webContent
    });
  }



  saveFile = (data, filename) => {
    var save_link = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "a"
    );
    save_link.href = data;
    save_link.download = filename;

    var event = document.createEvent("MouseEvents");
    event.initMouseEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    save_link.dispatchEvent(event);
  };

  fixType = type => {
    type = type.toLowerCase().replace(/jpg/i, "jpeg");
    var r = type.match(/png|jpeg|bmp|gif/)[0];
    return "image/" + r;
  };
  getQrImage = box => {
    const that = this;
    html2canvas(document.getElementById(box)).then(function (canvas) {
      var imgData = canvas.toDataURL();
      imgData = imgData.replace(that.fixType("jpg"), "image/octet-stream");
      var filename = "二维码.jpg";
      that.saveFile(imgData, filename);
    });
  };


 

  //查看工作码
  lookworkerweima = (text, record, index) => {
    this.setState({
      cardid: record.cardid,
      room: record.room,
      workvisible: true,
    })
  }

  //打开发放记录
  opensend = () => {
    this.setState({
      sendvisible: true,
    })
  }

  //勾选列表
  onSelectChange = (selectedRowKeys, b) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys, b);
    this.setState({
      selectedRowKeys,
      selectlist: b
    });
  };

  //打开选中二维码
  blurs = () => {
    console.log(this.state.selectlist)
    if (this.state.selectlist === undefined) {
      message.error('请勾选要生成的二维码编号')
    } else {
      const erweimalist = this.state.selectlist.map((item, i) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <div className="custom-image">
              <QRCode
                value={'http://watersupervision.terabits.cn/mobile?deviceId=' + item.cardid}
                size="200"
              />
            </div>
            <div className="custom-card">
              <h3 style={{ textAlign: "center", fontWeight: "700" }}>
                设备编号：{item.cardid}
              </h3>
            </div>
          </div>
        );
      });
      this.setState({ erweimamodels: true, erweimalist });
    }
  }



  //发货
  handleOk = () => {
    sendQRcode([
      this.state.batch,
      this.state.workerweimanum,
      null,
      this.state.remark,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('添加成功')
        this.setState({
          visible: false,
        })
        // this.setState({
        //   deviceList: res.data.data
        // });
      }
    });
  }



  render() {

    const prooptions = this.state.sitelist.map((province) => <Option key={province.id}  >{province.value}</Option>);
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const otaInfoTableColumns = [
      {
        title: "酒店名称",
        dataIndex: "sitename",
        key: 'sitename',
        render: (text, record, index) => {
          return (
            <div >
              <a onClick={() => this.lookerweima(text, record, index)}>{text}</a>
            </div>
          )
        }
      }
      // , {
      //   title: "信息码",
      //   dataIndex: "infonum",
      //   key: 'infonum',

      // }
      , {
        title: "消毒间位置",
        dataIndex: "room",
        key: 'room',
      },

      {
        title: "工作码",
        dataIndex: "address",
        key: 'address',
        render: (text, record, index) => {
          return (
            <div >
              <a onClick={() => this.lookworkerweima(text, record, index)}>查看</a>
            </div>
          )
        }
      }, {
        title: "工作码编号",
        dataIndex: "cardid",
        key: 'cardid',
      }
      , {
        title: "激活时间",
        dataIndex: "date",
        key: 'date',
      }
    ];
    return (
      <Layout>
        <Layout id="warning">
          <Content style={{ margin: "16px 16px" }} >
            <Card title="系统管理-二维码管理" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                
                  <Button type="primary"
                    style={{ background: '#2c94f4', border: '1px solid #2c94f4', marginRight: '20px' }} onClick={this.opensend}
                  >

                    <Link to="/app/sederweimalist">发放二维码记录</Link>
                  </Button>
                  <Button type="primary"
                    style={{ background: 'green', border: '1px solid green' }} onClick={this.blurs}
                  >
                    生成二维码
                      </Button>
                </div>
              }>
              <div>
                <div>
                  酒店名称：
                  <Select
                    style={{ width: '200px', marginBottom: "20px", marginTop: '20px', marginRight: '20px' }}
                    placeholder="请选择所属酒店"
                    onChange={this.handleChanges}
                  >
                    {prooptions}
                  </Select>
                  <Button type="primary" onClick={this.query}>查询</Button>
                </div>
                <Table
                  dataSource={this.state.warningListDataSource}
                  columns={otaInfoTableColumns}
                  rowSelection={rowSelection}
                  // pagination={this.state.page}
                  expandable={{
                    expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                    // rowExpandable: record => record.name !== 'Not Expandable',
                  }}
                />
              </div>
            </Card>
          </Content>
          <Modal
            title="二维码图片"
            visible={this.state.erweimamodels}
            onCancel={this.handleCancel}
            footer={null}
            okText="导出图片"
            className="qrCodeModal"
            width="400px"
          >
            <Row>
              <Col lg={24} xs={24} id="webBox" style={{ marginBottom: '20px' }}>
                {this.state.erweimalist}
              </Col>
              <div
                id="QRBox"
                style={{ marginTop: "20px", textAlign: 'center' }}
              >
                <Button type="primary" onClick={() => this.getQrImage("webBox")}>
                  导出水表二维码
                        </Button>
              </div>
            </Row>
          </Modal>
       

          <Modal
            title="工作码展示"
            visible={this.state.workvisible}
            footer={null}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            className="qrCodeModal"
            width="300px"
            centered
          >
            <div>
              <Row>
                <Col lg={24} xs={24} id="webBox" style={{ textAlign: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div className="custom-image">
                      <QRCode
                        value={'http://watersupervision.terabits.cn/mobile?deviceId=' + this.state.cardid}
                        size="200"
                      />
                    </div>
                    <div className="custom-card">
                      <p style={{ textAlign: "center", fontWeight: "700" }}>
                        设备编号：{this.state.cardid}
                      </p>
                      <p style={{ textAlign: "center", fontWeight: "700" }}>
                        所属消毒间：{this.state.room}
                      </p>
                    </div>

                  </div>
                </Col>
              </Row>
              <div
                id="QRBox"
                style={{ textAlign: 'center' }}
              >
                <Button type="primary" onClick={() => this.getQrImage("webBox")}>
                  导出工作码
                </Button>
              </div>
            </div>
          </Modal>
          <Modal
            title="信息码展示"
            visible={this.state.erweimamodel}
            onCancel={this.handleCancel}
            footer={null}
            okText="导出图片"
            className="qrCodeModal"
            centered
            width="300px"
          >
            <Row>
              <Col lg={24} xs={24} id="webBox" style={{ marginBottom: '10px', textAlign: 'center' }}>
                <QRCode
                  value={'http://provdisinfection.terabits.cn/mobile'}
                  size="200"
                />
              </Col>
              <div style={{ marginTop: "10px", textAlign: 'center' }}>
                所属酒店：赞成宾馆
              </div>
              <div
                id="QRBox"
                style={{ marginTop: "10px", textAlign: 'center' }}
              >
                <Button type="primary" onClick={() => this.getQrImage("webBox")}>
                  导出信息码
                </Button>
              </div>
            </Row>
          </Modal>
        </Layout>
      </Layout >
    );
  }
}

export default App;
