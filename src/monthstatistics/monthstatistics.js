import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Input,
  Modal,
  Cascader,
  Select,
  Popconfirm,
} from "antd";
// import {
//   userlist,
//   hotellist,
//   addUserAlarm,
//   removeUserAlarm,
//   adduser,
//   getAreaMap
// } from "../axios";
import "./monthstatistics.css";

import { Link } from 'react-router-dom';

const { Content } = Layout;
const { TextArea } = Input;
const Option = Select.Option;



const cuplist = [{
  "hotel": "赞成宾馆(杭州国际店)",
  "room": '2L',
  "time": '2020-02',
  "result": "27",
  "cup1": 540,
  "cup2": 270,
  "cup3": 555,
  "cup4": 621,
  "cup5": 789,
  "operator": "张阿姨",
  "explain": null,
  "cabinetlist": "834"
}, {
  "hotel": "赞成宾馆(杭州国际店)",
  "room": '3L',
  "time": '2020-02',
  "result": "20",
  "cup1": 400,
  "cup2": 200,
  "cup3": 412,
  "cup4": 499,
  "cup5": 388,
  "operator": "李阿姨",
  "explain": null,
  "cabinetlist": "604"
}, {
  "hotel": "赞成宾馆(杭州国际店)",
  "room": '1L',
  "time": '2020-02',
  "result": "23",
  "cup1": 123,
  "cup2": 211,
  "cup3": 345,
  "cup4": 432,
  "cup5": 212,
  "operator": "王阿姨",
  "explain": "消毒柜故障",
  "cabinetlist": "689"
}, {
  "hotel": "赞成宾馆(杭州国际店)",
  "room": '2L',
  "time": '2020-01',
  "result": "21",
  "cup1": 232,
  "cup2": 167,
  "cup3": 245,
  "cup4": 234,
  "cup5": 194,
  "operator": "张阿姨",
  "explain": null,
  "cabinetlist": "654"
}, {
  "hotel": "赞成宾馆(杭州国际店)",
  "room": '3L',
  "time": '2020-01',
  "result": "18",
  "cup1": 180,
  "cup2": 270,
  "cup3": 360,
  "cup4": 257,
  "cup5": 353,
  "operator": "李阿姨",
  "explain": null,
  "cabinetlist": "589"
}, {
  "hotel": "赞成宾馆(杭州国际店)",
  "room": '1L',
  "time": '2020-01',
  "result": "20",
  "cup1": 253,
  "cup2": 199,
  "cup3": 178,
  "cup4": 160,
  "cup5": 126,
  "operator": "张阿姨",
  "explain": "无入住记录",
  "cabinetlist": "629"
}, {
  "hotel": "赞成宾馆(杭州国际店)",
  "room": '2L',
  "time": '2019-12',
  "result": "19",
  "cup1": 228,
  "cup2": 55,
  "cup3": 233,
  "cup4": 255,
  "cup5": 301,
  "operator": "张阿姨",
  "explain": null,
  "cabinetlist": "600"
}]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceList: [{
        value: '赞成宾馆(杭州国际店)',
        label: '赞成宾馆(杭州国际店)',
        children: [
          {
            value: '1L',
            label: '1L',
          },
          {
            value: '2L',
            label: '2L',
          },
          {
            value: '3L',
            label: '3L',
          },
        ],
      }],
    };
    this.cupcolumns = [
      {
        title: "酒店名称",
        dataIndex: "hotel",
      }, {
        title: "房间号",
        dataIndex: "room",
      },
      {
        title: "检测日期",
        dataIndex: "time",
      },
      {
        title: "消毒天数(天)",
        dataIndex: "result",
      },
      {
        title: "消毒时长(分)",
        dataIndex: "cabinetlist",
      }
      , {
        title: "漱口杯(个)",
        dataIndex: "cup1",
      },
      {
        title: "平底杯(个)",
        dataIndex: "cup2",
        render: (text) => {
          if (text === null || text === "" || text === undefined) {
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
      }
      ,
      {
        title: "长水杯(个)",
        dataIndex: "cup3",
      }
      ,
      {
        title: "马克杯(个)",
        dataIndex: "cup4",
      }
      ,
      {
        title: "咖啡杯+碟(个)",
        dataIndex: "cup5",
      }
      ,
      {
        title: "操作人",
        dataIndex: "operator",
      }
      ,
      {
        title: "数据提交",
        dataIndex: "explain",
        render: (text, record, index) => {
          if (text === null || text === "" || text === undefined) {
            return (
              <div>
                <Popconfirm title="确定要提交吗?" >
                  <Button type="primary" >
                    提交
                    </Button>
                </Popconfirm>
              </div>
            )
          } else {
            return (
              <div style={{ color: "green" }}>
                已提交
              </div>
            )
          }
        }
      }
    ];

    this.cabinetcolumns = [

      {
        title: "开始时间",
        dataIndex: "begintime",
      }
      ,
      {
        title: "结束时间",
        dataIndex: "endtime",
      }
      , {
        title: "消毒时长(分)",
        dataIndex: "timelenth",
      }
      ,
    ]



  }


  componentWillMount() {
    document.title = "杯具清洗记录";
  }

  componentDidMount() {
  }

  //打开消毒柜工作详情
  detillist = (text, record, index) => {
    this.setState({
      cabinetlist: record.cabinetlist,
      visible: true,
    })
  }

  //打开负责人说明
  explain = (text, record, index) => {
    this.setState({
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

  //选择时间
  timeonChange = (value, dateString) => {
    this.setState({
      begintime: dateString[0],
      endtime: dateString[1],
    });
  }

  //添加负责人说明
  explainok = () => [
    this.setState({
      visible: false,
      describevisible: false,
    })
  ]

  //房间位置
  addresschange = (e) => {
    this.setState({
      addresslist: e
    });
  }

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }} id="cuplistpc">
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="月度打卡" id="nodeManage" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
            >
              <div>
                <div className="header">
                  <div>
                    房间位置&nbsp;: &nbsp;&nbsp;&nbsp;
                  <Cascader
                      options={this.state.deviceList}
                      onChange={this.addresschange}
                      value={this.state.addresslist}
                      changeOnSelect
                      style={{ width: "250px", marginRight: '20px' }}
                      placeholder="选择房间位置" />

                    时间&nbsp;: &nbsp;&nbsp;&nbsp;
                   <Select
                      placeholder="请选择时间"
                      onChange={this.ions}
                      style={{ width: "130px", marginRight: '20px' }}
                    >
                      <Option key={1}  >2020-01</Option>
                      <Option key={2}  >2020-02</Option>
                      <Option key={3}  >2020-03</Option>
                    </Select>
                    <Button type="primary" onClick={this.query}>查询</Button>
                  </div>
                  <div>
                    <Button type="primary" onClick={this.monthbtn}>
                      <Link to="/app/cuplistpc">
                        <span>返回</span>
                      </Link>
                    </Button>
                  </div>
                </div>
                <Table
                  dataSource={cuplist}
                  columns={this.cupcolumns}
                  pagination={this.state.page}
                />
              </div>
            </Card>
          </Content>
          <Modal
            title="消毒柜工作详情"
            // width='700px'
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
              pagination={false}
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
