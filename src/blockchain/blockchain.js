import React from "react";
import {
  Table,
  Layout,
  Row,
  Col,
  Card,
  Modal,
  Tooltip
} from "antd";
import {
  getstatistical
} from "../axios";
import "./blockchain.css";

const { Content } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      sitelist: [],
    };



    this.nodeInfoTableColumns = [
      {
        title: "交易ID",
        dataIndex: "txid",
      }, {
        title: "块号",
        dataIndex: "blocknumber",
      },
      {
        title: "块大小",
        dataIndex: "blocksize",
      },
      {
        title: "当前块交易数量",
        dataIndex: "blocktxcount",
      }, {
        title: "块Hash",
        dataIndex: "blockhash",
        render: (text, record, index) => {
          return (
            <div style={{ cursor: 'pointer' }} >
              <Tooltip title={text}>
                <span>{text.substring(0, 30) + "......"}</span>
              </Tooltip>
            </div>
          )
        }
      },
      {
        title: "上一个块Hash",
        dataIndex: "preblockhash",
        render: (text, record, index) => {
          return (
            <div style={{ cursor: 'pointer' }}>
              <Tooltip title={text}>
                <span>{text.substring(0, 30) + "......"}</span>
              </Tooltip>
            </div>
          )
        }
      },
      {
        title: "创建时间",
        dataIndex: "date",
      },
    ];
  }


  componentWillMount() {
    document.title = "区块链信息管理";
  }

  componentDidMount() {


    getstatistical([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          userlist: res.data.data.list,
          one: res.data.data.block_num,
          two: res.data.data.transaction_num,
          three: res.data.data.node_num,
          four: res.data.data.chaincode_num,
        }, function () {
          if (res.data.data.list.length < 10) {
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

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  modeltwo = (text, record, index) => {
    this.setState({
      pleadingvisibles: true,
      preblockhash: text,
    })
  }

  modelone = (text, record, index) => {
    this.setState({
      pleadingvisible: true,
      blockhash: text,
    })
  }


  stateCancel = (text, record, index) => {
    this.setState({
      pleadingvisibles: false,
      pleadingvisible: false,
    })
  }



  render() {
    return (
      <Layout style={{ minHeight: "100vh" }} id="blockchain">
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="区块链信息管理" headStyle={{ fontWeight: 'bold', fontSize: '18px' }} >
              <div style={{ background: '#ECECEC', padding: '25px', marginBottom: '20px', height: '160px' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <div className="topheader">
                      <div className="headerleft">

                      </div>
                      <div className="headerright">
                        <div className="headertitle">块数</div>
                        <div className="headernum"> <span className="titlecolor">{this.state.one}</span>  块 </div>
                      </div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="topheader">
                      <div className="headerleft1">

                      </div>
                      <div className="headerright">
                        <div className="headertitle">交易数</div>
                        <div className="headernum"> <span className="titlecolor">{this.state.two}</span>  条 </div>
                      </div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="topheader">
                      <div className="headerleft2">

                      </div>
                      <div className="headerright">
                        <div className="headertitle">记账节点数</div>
                        <div className="headernum"> <span className="titlecolor">{this.state.three}</span>  个 </div>
                      </div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="topheader">
                      <div className="headerleft3">

                      </div>
                      <div className="headerright">
                        <div className="headertitle">链码数</div>
                        <div className="headernum"> <span className="titlecolor">{this.state.four}</span>  条 </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div>
                <Table
                  dataSource={this.state.userlist}
                  columns={this.nodeInfoTableColumns}
                  pagination={this.state.page}
                />
              </div>
            </Card>
          </Content>
          <Modal
            title="块Hash值"
            visible={this.state.pleadingvisible}
            onCancel={this.stateCancel}
            footer={null}
            destroyOnClose
            centered
            mask={false}
            width='330px'
          >
            {
              this.state.blockhash
            }
          </Modal>
          <Modal
            title="上一个块Hash值"
            visible={this.state.pleadingvisibles}
            onCancel={this.stateCancel}
            footer={null}
            destroyOnClose
            centered
            mask={false}
            width='330px'
          >
            {
              this.state.preblockhash
            }
          </Modal>
        </Layout>
      </Layout >
    );
  }
}

export default App;
