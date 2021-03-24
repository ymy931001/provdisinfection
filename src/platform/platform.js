import React from "react";
import {
  Table,
  Layout,
  Card,
  Tabs,
  Modal,
  Input,
  Button,
  message
} from "antd";

import {
  allisc,
  addisc
} from "../axios";
import "./platform.css";

const { Content } = Layout;
const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}


class App extends React.Component {
  state = {
    collapsed: false,
    otaInfoTableDataSource: [],
    otaModalVisible: null,
    historydata: [{
      "sitename": "小移插座",
      "name": "10",
      "date": "2020-05-28 16:25:22",
      "explain": null
    }]
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() {

  }

  componentDidMount() {

    allisc([

    ]).then(res => {
      this.setState({
        isclist: res.data.data
      }, function () {
        if (res.data.data.length < 10) {
          this.setState({
            page: false
          })
        }
      })
    });
  }



  //关闭model
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  //打开model
  addplatform = () => {
    this.setState({
      visible: true,
    })
  }

  //添加安防平台
  handleOk = () => {
    addisc([
      this.state.name,
      this.state.host,
      this.state.appSecret,
      this.state.appKey,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('安防平台添加成功')
        allisc([

        ]).then(res => {
          this.setState({
            isclist: res.data.data
          }, function () {
            if (res.data.data.length < 10) {
              this.setState({
                page: false
              })
            }
          })
        });
        this.setState({
          visible: false
        })

      }
    })
  }

  //安防平台名称输入
  name = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  //安防平台地址输入
  host = (e) => {
    this.setState({
      host: e.target.value
    })
  }

  //安防平台appSecret输入
  appSecret = (e) => {
    this.setState({
      appSecret: e.target.value
    })
  }

  //安防平台appKey输入
  appKey = (e) => {
    this.setState({
      appKey: e.target.value
    })
  }
  render() {
    const otaInfoTableColumns = [
      {
        title: "平台名称",
        dataIndex: "name",
      },
      {
        title: "ip地址",
        dataIndex: "host",
      },
      {
        title: "appkey",
        dataIndex: "appkey",
        render: (text, record, index) => {
          return (
            <div>
              {text}
            </div>
          )
        }
      },
      // {
      //   title: "报警推送",
      //   dataIndex: "id",
      // },
      // , {
      //   title: "操作",
      //   dataIndex: "explain",
      //   render: (text, record, index) => {
      //     return (
      //       <div >
      //         <a onClick={() => this.explain(text, record, index)}>删除</a>
      //       </div>
      //     )
      //   }
      // }

    ];
    return (
      <Layout>
        <Layout id="warning">
          <Content style={{ margin: "16px 16px" }} >
            <Card title="系统管理-平台管理" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary"
                    style={{ background: '#2c94f4', border: '1px solid #2c94f4', marginRight: '20px' }} onClick={this.addplatform}
                  >
                    添加平台
                  </Button>
                </div>
              }>
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="安防平台" key="1">
                  <div style={{ marginTop: 5 }}>
                    <Table
                      dataSource={this.state.isclist}
                      columns={otaInfoTableColumns}
                      pagination={this.state.page}
                    />
                  </div>
                </TabPane>
                <TabPane tab="andsmart平台" key="2" style={{ minHeight: "700px" }}>
                  <div style={{ marginTop: 5 }}>
                    <Table
                      dataSource={this.state.historydata}
                      columns={otaInfoTableColumns}
                      pagination={this.state.page}
                    />
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Content>
          <Modal
            title="添加安防平台"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            width="400px"
            centered
          >
            <div>
              <div style={{ display: this.state.twoadd }}>
                <span>平台名称：</span>
                <Input placeholder="请输入平台名称"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }} autoComplete="off"
                  value={this.state.name}
                  onChange={this.name}
                />
                <span>平台地址：</span>
                <Input placeholder="请输入平台地址" style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }} autoComplete="off"
                  value={this.state.host}
                  onChange={this.host}
                />
                <span>appSecret：</span>
                <Input placeholder="请输入appSecret" style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }} autoComplete="off"
                  value={this.state.appSecret}
                  onChange={this.appSecret}
                />
                <span>appKey：</span>
                <Input placeholder="请输入appKey" style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }} autoComplete="off"
                  value={this.state.appKey}
                  onChange={this.appKey}
                />
              </div>
            </div>
          </Modal>

        </Layout>
      </Layout>
    );
  }
}

export default App;
