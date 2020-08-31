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
  Switch,
} from "antd";
import {
  allpowermenu,
  addmenu,
  putmenu
} from "../axios";
import "./power.css";

const { Content } = Layout;
const Option = Select.Option;
const { TextArea } = Input;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlname: null,
      path: null,
      component: null,
      menuname: null,
      iconcls: null,
      keepalive: true,
      requireauth: true,
      requestType: null,
      typenone: "inline-block",
      powerlist: [],
      parentlist: [],
    };


  }


  componentWillMount() {
    document.title = "权限管理";
  }

  componentDidMount() {
    allpowermenu([
      // 1
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          powerlist: res.data.data
        })
        var arr = []
        for (var i in res.data.data) {
          if (res.data.data[i].parentid === 1) {
            arr.push(res.data.data[i])
          }
        }
        // console.log(arr)
        this.setState({
          parentlist: arr
        })
      }
    });

    // allparentmenu([

    // ])
    // .then(res => {
    //   console.log(res)
    //   if (res.data && res.data.message === "success") {
    //     this.setState({
    //       parentlist: res.data.data
    //     })
    //   }
    // })


  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }



  //打开弹框
  setup = () => {
    this.setState({
      visible: true
    })
  }

  //关闭弹框
  handleCancel = () => {
    this.setState({
      visible: false,
      menuvisible: false,
      visibles: false,
    })
  }

  //添加权限
  handleOk = () => {
    console.log(this.state.keepalive,
      this.state.requireauth)
    addmenu([
      this.state.urlname,
      this.state.path,
      this.state.component,
      this.state.menuname,
      this.state.iconcls,
      this.state.keepalive,
      this.state.requireauth,
      this.state.parentid,
      this.state.requestType,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('权限添加成功')
        this.setState({
          visible: false
        })
        allpowermenu([
          // 1
        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              powerlist: res.data.data
            })
          }
        });
      }
    });
  }

  //修改权限
  changeok = () => {
    putmenu([
      this.state.urlname,
      this.state.path,
      this.state.component,
      this.state.menuname,
      this.state.iconcls,
      this.state.keepalive,
      this.state.requireauth,
      this.state.parentid,
      this.state.requestType,
      this.state.menuid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('权限修改成功')
        this.setState({
          visibles: false
        })
        allpowermenu([
          // 1
        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              powerlist: res.data.data
            })
          }
        });
      }
    });
  }


  //是否需要权限
  requireauth = (value) => {
    console.log(value)
    this.setState({
      requireauth: value,

    })
  }

  //是否需要权限
  keepalive = (value) => {
    console.log(value)
    this.setState({
      keepalive: value
    })
  }

  //菜单名称
  menuname = (e) => {
    this.setState({
      menuname: e.target.value
    })
  }

  //后端路径
  urlname = (e) => {
    this.setState({
      urlname: e.target.value
    })
  }

  //前端路径
  path = (e) => {
    this.setState({
      path: e.target.value
    })
  }

  //图标
  iconcls = (e) => {
    this.setState({
      iconcls: e.target.value
    })
  }

  //请求类型
  requestType = (e) => {
    this.setState({
      requestType: e.target.value
    })
  }

  //描述
  component = (e) => {
    this.setState({
      component: e.target.value
    })
  }


  //修改  
  onEdit = (text, record, index) => {
    console.log(record)
    this.setState({
      visibles: true,
      menuname: record.name,
      menuid: record.id,
      urlname: record.url,
      path: record.path,
      requestType: record.requestType,
      iconcls: record.iconcls,
      component: record.component,
      requireauth: record.requireauth,
      keepalive: record.keepalive,
      parentid: record.parentid,
      parentidname: record.parentMenu,
    })
  }

  //父级菜单选择
  handleChanges = (value) => {
    console.log(value)
    this.setState({
      parentid: value
    })
  }

  //父级菜单选择
  menuparentchange = (value) => {
    console.log(value)
    this.setState({
      parentid: value
    }, function () {
      allpowermenu([
        this.state.keytext,
        this.state.parentid,
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          this.setState({
            powerlist: res.data.data
          })
        }
      });
    })
  }

  //查询
  query = (value) => {
    allpowermenu([
      this.state.keytext,
      this.state.parentid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          powerlist: res.data.data
        })
      }
    });
  }

  //重置
  reset = (value) => {
    allpowermenu([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          powerlist: res.data.data
        })
      }
    });
  }

  //权限搜索
  keytext = (e) => {
    this.setState({
      keytext: e.target.value
    })
  }


  render() {
    const poweroption = this.state.parentlist.map((province) => <Option key={province.id}  >{province.name}</Option>);
    const components = {
      body: {
        // row: EditableFormRow,
        // cell: EditableCell,
      },
    };

    this.nodeInfoTableColumns = [
      {
        title: "权限名称",
        dataIndex: "name",
      }, {
        title: "父级菜单",
        dataIndex: "parentMenu",
        render: (text) => {
          if (text === undefined) {
            return (
              <div>
                /
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
      }, {
        title: "接口地址",
        dataIndex: "url",
      }, {
        title: "接口方法",
        dataIndex: "requestType",
        render: (text) => {
          if (text === undefined) {
            return (
              <div>
                /
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
      }, {
        title: "对应路径",
        dataIndex: "path",
        render: (text) => {
          if (text === null || text === "" || text === undefined) {
            return (
              <div>
                /
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
        title: '操作',
        dataIndex: 'id',
        render: (text, record, index) => {
          return (
            <div>
              <span onClick={() => this.onEdit(text, record, index)}>
                <a><img src={require('./edit.png')} alt="" /></a>
              </span>
            </div>
          );
        }
      }
    ];
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
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <Layout >
        <Layout>
          <Content style={{ margin: "16px 16px" }}>
            <Card title="账号管理-权限管理" headStyle={{ fontWeight: 'bold', fontSize: '18px' }} extra={
              <div>
                <Button type="primary" onClick={this.setup}
                  style={{ marginRight: '20px', display: this.state.typenone }}
                >
                  添加权限
                </Button>
              </div>
            }>
              <div>
                权限搜索&nbsp;: &nbsp;&nbsp;&nbsp;
                <Input placeholder="请输入权限" style={{ width: '200px', marginRight: '20px' }}
                  value={this.state.keytext}
                  onChange={this.keytext}
                />
                父级权限&nbsp;: &nbsp;&nbsp;&nbsp;
                <Select
                  placeholder="请选择父级菜单"
                  onChange={this.menuparentchange}
                  style={{ width: '200px', marginBottom: "20px", marginRight: '20px' }}
                >
                  {poweroption}
                </Select>
                <Button type="primary" onClick={this.query}>查询</Button>
                <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
                <Table
                  dataSource={this.state.powerlist}
                  components={components}
                  columns={nodeInfoTableColumns}
                // pagination={this.state.page}
                />
              </div>
            </Card>
          </Content>
          <Modal
            title="修改权限"
            visible={this.state.visibles}
            onOk={this.changeok}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            width="400px"
            mask={false}
          >
            <div>
              <div style={{ display: this.state.twoadd }}>
                <span>菜单名称：</span>
                <Input placeholder="请输入菜单名称"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.menuname}
                  value={this.state.menuname}
                />
                <span>后端路径：</span>
                <Input placeholder="请输入后端路径"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.urlname}
                  value={this.state.urlname}
                />
                <span>前端路径：</span>
                <Input placeholder="请输入前端路径"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.path}
                  value={this.state.path}
                />
                <span>图标：</span>
                <Input placeholder="请输入图标"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.iconcls}
                  value={this.state.iconcls}
                />
                <div>
                  <span>是否需要权限：</span>
                  <Switch defaultChecked
                    onChange={this.requireauth}
                  />
                  <span style={{ marginLeft: '20px' }}>是否可用：</span>
                  <Switch defaultChecked
                    onChange={this.keepalive}
                  />
                </div>
                <span>父级菜单：</span>
                <Select
                  placeholder="请选择父级菜单"
                  onChange={this.handleChanges}
                  defaultValue={this.state.parentidname}
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                >
                  {poweroption}
                </Select>
                <span>请求类型：</span>
                <Input placeholder="请输入请求类型"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.requestType}
                  value={this.state.requestType}
                />
                <span>描述：</span>
                <TextArea rows={4} style={{ width: '100%', verticalAlign: 'top' }}
                  onChange={this.component}
                  value={this.state.component}
                  placeholder="请输入描述"
                />
              </div>
            </div>
          </Modal>
          <Modal
            title="添加权限"
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
                <span>菜单名称：</span>
                <Input placeholder="请输入菜单名称"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.menuname}
                  value={this.state.menuname}
                />
                <span>后端路径：</span>
                <Input placeholder="请输入后端路径"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.urlname}
                  value={this.state.urlname}
                />
                <span>前端路径：</span>
                <Input placeholder="请输入前端路径"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.path}
                  value={this.state.path}
                />
                <span>图标：</span>
                <Input placeholder="请输入图标"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.iconcls}
                  value={this.state.iconcls}
                />
                <div>
                  <span>是否需要权限：</span>
                  <Switch defaultChecked
                    onChange={this.requireauth}
                  />
                  <span style={{ marginLeft: '20px' }}>是否可用：</span>
                  <Switch defaultChecked
                    onChange={this.keepalive}
                  />
                </div>
                <span>父级菜单：</span>
                <Select
                  placeholder="请选择父级菜单"
                  onChange={this.handleChanges}
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                >
                  {poweroption}
                </Select>
                <span>请求类型：</span>
                <Input placeholder="请输入请求类型"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.requestType}
                  value={this.state.requestType}
                />
                <span>描述：</span>
                <TextArea rows={4} style={{ width: '100%', verticalAlign: 'top' }}
                  onChange={this.component}
                  value={this.state.component}
                  placeholder="请输入描述"
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
