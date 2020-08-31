import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Input,
  Modal,
  Col,
  Row,
  Select,
  DatePicker,
  Switch,
  message,
  Radio,
} from "antd";

import {
  hotellist,
  sendQRcode,
  QRcodelist,
  changeQRcodestatus,
  getQRcode
} from "../axios";
import "./sederweimalist.css";
import QRCode from 'qrcode-react';
import moment from 'moment';

const { Content } = Layout;
const { TextArea } = Input;
const { Search } = Input;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
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
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() {
    document.title = "二维码管理";
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

    QRcodelist([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          senddatasource: res.data.data
        });
      }
    });

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


  lookerweima = (text, record, index) => {
    getQRcode([
      record.id,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          openerweimalist: res.data.data,
          erweimamodel: true,
        }, function () {
          console.log(this.state.openerweimalist)
          const erweimalist = this.state.openerweimalist.map((item, i) => {
            if (item.type === 0) {
              return (
                <div style={{ textAlign: 'center' }}>
                  <div className="custom-image">
                    <QRCode
                      value={'http://mobileprovdis.terabits.cn/mobilelogin?deviceid?=' + item.code}
                      size="200"
                      style={{width:'100%'}}
                    />
                  </div>
                  <div className="custom-card">
                    <h3 style={{ textAlign: "center", fontWeight: "700" }}>
                      信息码编号：{parseInt(item.id,10) > 9 ? "0000" + item.id : "00000" + item.id}
                    </h3>
                  </div>
                </div>
              )
            } else {
              return (
                <div style={{ textAlign: 'center' }}>
                  <div className="custom-image">
                    <QRCode
                      value={'http://mobileprovdis.terabits.cn/mobilelogin?deviceid?=' + item.code}
                      size="200"
                      style={{width:'100%'}}
                    />
                  </div>
                  <div className="custom-card">
                    <h3 style={{ textAlign: "center", fontWeight: "700" }}>
                      工作码编号：{parseInt(item.id,10) > 9 ? "0000" + item.id : "00000" + item.id}
                    </h3>
                  </div>
                </div>
              )
            }

          });
          this.setState({ erweimamodels: true, erweimalist });
        });
      }
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
              value={'http://mobileprovdis.terabits.cn/mobilelogin?deviceid?=' + item.cardid}
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



  //修改发货状态
  switchchange = (text, record, index) => {
    changeQRcodestatus([
      record.id,
      !record.status
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("修改状态成功");
        QRcodelist([

        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              senddatasource: res.data.data
            });
          }
        });
      } else {
        message.error("修改状态失败")
      }
    });
  }

  //添加工作码
  adderweima = (text, record, index) => {
    this.setState({
      visible: true,
    })
  }

  //批次
  s = (e) => {
    this.setState({
      batch: e.target.value
    })
  }

  //备注
  remarkchange = (e) => {
    this.setState({
      remark: e.target.value
    })
  }

  //输入二维码数量
  workerweimanum = (e) => {
    this.setState({
      workerweimanum: e.target.value.replace(/[^0-9.]/g, '')
    })
  }


  //发货
  handleOk = () => {
    sendQRcode([
      this.state.activationvalue === 1 ? this.state.batch : null,
      this.state.workerweimanum,
      this.state.activationvalue === 2 ? this.state.siteid : null,
      this.state.remark,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('添加成功')
        QRcodelist([

        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              senddatasource: res.data.data,
              visible: false,
            });
          }
        });
      }
    });
  }

  //查询
  query = () => {
    QRcodelist([
      this.state.batchs,
      this.state.begintime,
      this.state.endtime
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          senddatasource: res.data.data,
        });
      }
    });
  }

  //重置
  reset = () => {
    this.setState({
      batchs: null,
      begintime: undefined,
      endtime: undefined,
    }, function () {
      QRcodelist([

      ]).then(res => {
        if (res.data && res.data.message === "success") {
          this.setState({
            senddatasource: res.data.data,
          });
        }
      });
    })
  }

  //发货地址输入
  batchchanges = (e) => {
    this.setState({
      batchs: e.target.value
    })
  }

  //所属酒店选择
  handleChanges = (value) => {
    this.setState({
      siteid: value
    })
  }



  //激活与否
  activationchange = (e) => {
    console.log(e.target.value)
    this.setState({
      activationvalue: e.target.value
    }, function () {
      if (this.state.activationvalue === 1) {
        this.setState({
          distwo: 'none',
          disone: 'block'
        })
      } else {
        this.setState({
          distwo: 'block',
          disone: 'none'
        })
      }
    })
  }

  render() {

    const prooptions = this.state.sitelist.map((province) => <Option key={province.id}  >{province.value}</Option>);
    // const { selectedRowKeys } = this.state;
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    // };
    const sendcolumns = [
      {
        title: "发放地址",
        dataIndex: "batch",
        key: 'batch',
      }, {
        title: "发放数量",
        dataIndex: "count",
        key: 'count',
        render: (text, record, index) => {
          return (
            <div >
              <a onClick={() => this.lookerweima(text, record, index)}>{text}</a>
            </div>
          )
        }
      }, {
        title: "发放时间",
        dataIndex: "gmtcreate",
        key: 'gmtcreate',
      }, {
        title: "收货状态",
        dataIndex: "status",
        key: 'status',
        render: (text, record, index) => {
          return (
            <div >
              <Switch
                checked={text}
                checkedChildren="已收货" unCheckedChildren="未收货"
                onChange={() => this.switchchange(text, record, index)}
              />
            </div>
          )
        }
      },
      {
        title: "备注",
        dataIndex: "remark",
        key: 'remark',
      }
    ];


    return (
      <Layout>
        <Layout id="warning">
          <Content style={{ margin: "16px 16px" }} >
            <Card title="系统管理-二维码发放记录" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary"
                    style={{ background: '#2c94f4', border: '1px solid #2c94f4', marginRight: '20px' }} onClick={this.adderweima}
                  >
                    添加二维码
                      </Button>
                  {/* <Button type="primary"
                    style={{ background: '#2c94f4', border: '1px solid #2c94f4' }} onClick={this.opensend}
                  >
                    <Link to="/app/erweima">返回</Link>
                  </Button> */}
                </div>
              }>
              <div>
                发货地址：
                <Input placeholder="请输入发货地址" style={{ width: '200px', marginRight: '20px' }}
                  value={this.state.batchs}
                  onChange={this.batchchanges}
                />
                时间&nbsp;:
                    <RangePicker
                  style={{ marginLeft: '20px', marginRight: '20px', marginBottom: '10px', marginTop: '20px', width: "240px" }}
                  format={dateFormat}
                  ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                  onChange={this.timeonChange}
                // value={[moment(this.state.begintime, dateFormat), moment(this.state.endtime, dateFormat)]}
                />
                <Button type="primary" onClick={this.query}>查询</Button>
                <Button onClick={this.reset} style={{ marginLeft: "20px" }}>重置</Button>
                <Table
                  dataSource={this.state.senddatasource}
                  columns={sendcolumns}
                  pagination={this.state.sendpage}
                />
              </div>
            </Card>
          </Content>
          <Modal
            title="发放二维码记录"
            visible={this.state.erweimamodel}
            onCancel={this.handleCancel}
            footer={null}
            // okText="导出图片"
            className="qrCodeModal"
            centered
            width="300px"
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
                  导出二维码
                </Button>
              </div>
            </Row>
          </Modal>

          <Modal
            title="添加二维码"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            className="qrCodeModal"
            width="300px"
            centered
          >
            <div>
              <div className="activation">
                <Radio.Group onChange={this.activationchange} value={this.state.activationvalue}>
                  <Radio value={1}>未激活</Radio>
                  <Radio value={2}>已激活</Radio>
                </Radio.Group>
              </div>
              <div style={{ display: this.state.disone }}>
                <span>发往酒店：</span>
                <Input placeholder="请输入发往酒店"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  value={this.state.batch}
                  onChange={this.s}
                  autoComplete="off" />

              </div>
              <div style={{ display: this.state.distwo }}>
                <span>所属酒店：</span>
                <Select
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  placeholder="请选择所属酒店"
                  onChange={this.handleChanges}
                  value={this.state.siteid}
                >
                  {prooptions}
                </Select>
              </div>
              <div>
                <span>工作码数量：</span>
                {/* <Input placeholder="请输入工作码数量"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  onChange={this.workerweimanum}
                  value={this.state.workerweimanum}
                /> */}
                <Search
                  placeholder="请输入工作码数量"
                  enterButton="张"
                  size="middle"
                  // onSearch={this.createerweima}
                  onChange={this.workerweimanum}
                  value={this.state.workerweimanum}
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px', fontSize: '14px' }}
                />
              </div>
              <span>备注：</span>
              <TextArea rows={4} style={{ width: '100%', marginBottom: "10px", marginTop: '10px', }}
                onChange={this.remarkchange}
                value={this.state.remark}
                placeholder="请输入备注（选填）"
              />
              {/* <Row>
                <Col lg={24} xs={24} id="webBox" style={{ marginTop: '20px', textAlign: 'center' }}>
                  {this.state.webContent}
                </Col>
              </Row>
              <div
                id="QRBox"
                style={{ marginTop: "20px", textAlign: 'center' }}
              >
                <Button type="primary" onClick={() => this.getQrImage("webBox")}>
                  导出工作码
                </Button>
              </div> */}
            </div>
          </Modal>
        </Layout>
      </Layout >
    );
  }
}

export default App;
