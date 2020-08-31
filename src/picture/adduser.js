import React from "react";
import {
  Upload,
  Table,
  Layout,
  Row,
  Col,
  Card,
  Button,
  Input,
  Modal,
  message,
  Cascader,
  Icon,
  DatePicker
} from "antd";
import {
  getVideoList,
  getDeviceList,
  userlist
} from "../axios";
import "./adduser.css";
import { Link } from 'react-router-dom';

const { Content, F } = Layout;
const { RangePicker } = DatePicker;


const nodeInfoTableColumns = [
  {
    title: "用户名",
    dataIndex: "name",
  },
  {
    title: "姓名",
    dataIndex: "adminname",
  },
  {
    title: "密码",
    dataIndex: "password",
    render: (text) => {
      return (
        <div>
          {text = text.substr(0, 2) + '****' + text.substr(6)}
        </div>
      )
    }
  },
  {
    title: "联系方式",
    dataIndex: "phone",
  },
  {
    title: "创建时间",
    dataIndex: "gmtcreate",
  },
];







class App extends React.Component {
  state = {
    videoListDataSource: [],
    device_ip: null
  };

  componentWillMount() {

  }

  componentDidMount() {
    userlist().then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          userlist: res.data.data
        });
      }
    });
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  query = () => {
    if (!this.state.device_ip || !this.state.start_date || !this.state.end_date) {
      message.error('请选择设备及时间范围后再查询');
      return;
    }
    let starttime = new Date(this.state.start_date);
    let endtime = new Date(this.state.end_date);
    let pad = n => n < 10 ? `0${n}` : n;
    let start_dateStr = `${starttime.getFullYear()}-${pad(starttime.getMonth() + 1)}-${pad(starttime.getDate())}`;
    let end_dateStr = `${endtime.getFullYear()}-${pad(endtime.getMonth() + 1)}-${pad(endtime.getDate())}`;
    getVideoList([this.state.device_ip, start_dateStr, end_dateStr]).then(res => {
      let videoListDataSource = [];
      res.data.video_list.forEach(item => {
        let obj = {};
        obj.name = item.name;
        obj.date = item.date;
        obj.start_time = item.start_time;
        obj.end_time = item.end_time;
        obj.result = item.result ? '有消毒操作' : '无消毒操作';
        obj.key = item.id;
        videoListDataSource.push(obj);
      });
      this.setState({ videoListDataSource: videoListDataSource })
    });
  }


  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="用户管理" id="nodeManage">
              <div className="gutter-example-nodemanage"  style={{textAlign:"right"}}>
                {/* <Row>
                  <Col className="gutter-row-nodemanage" span={4}>
                    <Cascader
                      options={this.state.deviceList}
                      onChange={(e) => { this.setState({ device_ip: e[1] }) }}
                      placeholder="选择宾馆：消毒间" />
                  </Col>
                  <Col className="gutter-row-nodemanage" span={1}>
                  </Col>
                  <Col className="gutter-row-nodemanage" span={6}>
                    <RangePicker onChange={(e) => { this.setState({ start_date: e[0]._d, end_date: e[1]._d }) }} />
                  </Col>
                  <Col className="gutter-row-nodemanage" span={1}>
                  </Col>
                  <Col className="gutter-row-nodemanage" span={6}>
                    <Button type="primary" onClick={this.query}>查询</Button>
                  </Col>
                </Row> */}
                <Button type="primary" style={{ background: 'red', border: '1px solid red', marginRight: '20px' }}  >
                  <Link to="/adduser">添加用户</Link>
                </Button>
              </div>
              <div style={{ marginTop: 20 }}>
                <Table
                  dataSource={this.state.userlist}
                  columns={nodeInfoTableColumns}
                  bordered
                />
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout >
    );
  }
}

export default App;
