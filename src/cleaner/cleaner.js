import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Input,
  Modal,
  message,
  Select,
  Popconfirm,
} from "antd";
import {
  cleanerlist,
  insertcleaner,
  deletecleaner,
  hotellist
} from "../axios";
import "./cleaner.css";
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { TextArea } = Input;
const Option = Select.Option;



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      typenone: "inline-block",
      sitelist: [],
      sitelists: [],
    };
    this.nodeInfoTableColumns = [
      {
        title: "保洁员姓名",
        dataIndex: "name",
      },
      {
        title: "联系电话",
        dataIndex: "phone",
        render: (text, record, index) => {
          if (text === null) {
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
      },
      {
        title: "所属酒店",
        dataIndex: "siteName",
        render: (text, record, index) => {
          return (
            <div>
              {text}
            </div>
          )
        }
      },
      {
        title: "备注",
        dataIndex: "remark",
        render: (text, record, index) => {
          return (
            <div>
              {text}
            </div>
          )
        }
      },
      // {
      //   title: "创建时间",
      //   dataIndex: "gmtcreate",
      // },
      {
        title: '操作',
        dataIndex: 'id',
        render: (text, record, index) => {
          return (
            <div>
              <span style={{ marginLeft: '10px' }}>
                <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(text, record, index)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            </div>
          );
        }
      }
    ];
  }

  componentWillMount() {
    document.title = "保洁员管理";
  }

  componentDidMount() {
    cleanerlist([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          cleanerlist: res.data.data
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

    hotellist([

    ]).then(res => {
      console.log(JSON.parse(res.data))
      if (res.data && res.data.message === "success") {
        console.log(11111)
        var arr = []
        for (var i in res.data.data) {
          arr.push({
            'value': res.data.data[i],
            'id': i,
          })
        }

        this.setState({
          sitelist: arr,
          sitelists: res.data.data
        })
      }
    });
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  addarea = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  handleOk = () => {
    insertcleaner([
      this.state.cleanername,
      this.state.cleanerphone,
      this.state.remark,
      this.state.site,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('添加成功')
        cleanerlist(

        ).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              cleanerlist: res.data.data
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
        this.setState({
          visible: false
        })
      }
    })
  }

  cleanername = (e) => {
    this.setState({
      cleanername: e.target.value
    })
  }

  cleanerphone = (e) => {
    this.setState({
      cleanerphone: e.target.value
    })
  }

  remarkchange = (e) => {
    console.log(e.target.value)
    this.setState({
      remark: e.target.value
    })
  }

  sitechange = (value) => {
    this.setState({
      site: value
    })
  }

  onDelete = (text, record, index) => {
    console.log(record)
    deletecleaner([
      record.id,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("删除成功");
        const dataSource = [...this.state.cleanerlist];
        this.setState({
          cleanerlist: dataSource.filter(item => item.id !== record.id),
        });
      }
    });
  }


  render() {
    const prooptions = this.state.sitelist.map((province) => <Option key={province.id}  >{province.value}</Option>);

    const nodeInfoTableColumns = this.nodeInfoTableColumns.map((col) => {
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
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="保洁员管理" id="nodeManage" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC', display: this.state.typenone }} onClick={this.addarea} >
                    添加保洁员
                  </Button>
                  <Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px', marginLeft: '20px' }} onClick={this.showModal}>
                    <Link to="/app/houseroom">返回</Link>
                  </Button>

                </div>
              }>
              <div className="gutter-example-nodemanage" style={{ textAlign: "right" }}>
              </div>
              <div>
                <Table
                  dataSource={this.state.cleanerlist}
                  columns={nodeInfoTableColumns}
                  pagination={this.state.page}
                />
              </div>
            </Card>
          </Content>
          <Modal
            title="添加保洁员"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            width="400px"
            mask={false}
          >
            <div>
              <div style={{ display: this.state.twoadd }}>
                <span>保洁员姓名：</span>
                <Input placeholder="请输入保洁员姓名"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.cleanername}
                  value={this.state.cleanername}
                />
                <span>保洁员电话：</span>
                <Input placeholder="请输入保洁员电话"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.cleanerphone}
                  value={this.state.cleanerphone}
                />
                <span>所属酒店：</span>
                <Select
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  placeholder="请选择所属酒店"
                  onChange={this.sitechange}
                  value={this.state.site}
                >
                  {prooptions}
                </Select>
                <span>备注：</span>
                <TextArea rows={4} style={{ marginTop: '10px' }}
                  onChange={this.remarkchange}
                  value={this.state.remark}
                  placeholder="请输入备注（选填）"
                />
              </div>
            </div>
          </Modal>

        </Layout>
      </Layout >
    );
  }
}

export default App;
