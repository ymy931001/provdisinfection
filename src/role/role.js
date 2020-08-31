import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Input,
  Modal,
  message,
  Tree
} from "antd";
import {
  getmenu,
  addrole,
  rolelist,
  updateMenuRole,
  deleterole
} from "../axios";
import "./role.css";

const { Content } = Layout;
const TreeNode = Tree.TreeNode;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      sitelist: [],
      typenone: "inline-block",
      mockData: [],
      targetKeys: [],
      hotllists: [],
      arealist: [],
      sitelists: [],
      permissionlist: [],
    };


  }


  componentWillMount() {
    document.title = "角色管理";
  }

  componentDidMount() {

    rolelist([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          rolelist: res.data.data
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




  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  //打开权限弹框
  showModal = (text, index, record) => {
    console.log(record)
    this.setState({
      roleid: record.id
    });
    getmenu([
      record.id
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          permissionlist: res.data.data.menus,
          // rolemenu: res.data.data.mids,
          checkedKeys: res.data.data.mids,
          menuvisible: true,

        })
      }
    });
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
      deletevisible: false,
    })
  }

  //输入角色中文
  roleZh = (e) => {
    this.setState({
      roleZh: e.target.value
    })
  }
  //输入角色英文
  role = (e) => {
    this.setState({
      role: e.target.value
    })
  }
  //添加角色
  handleOk = () => {
    addrole([
      this.state.roleZh,
      this.state.role,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('角色添加成功')
        this.setState({
          visible: false
        })
        rolelist([

        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              rolelist: res.data.data
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
      }
    });
  }

  //修改权限
  saveOk = () => {
    updateMenuRole([
      this.state.roleid,
      this.state.checkedKeys.join(','),
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('角色权限修改成功')
        this.setState({
          menuvisible: false
        })
        rolelist([

        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              rolelist: res.data.data
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
      }
    });
  }

  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: true,
    });
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({
      checkedKeys: checkedKeys,
    });
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }

  //删除角色
  deleteOk = (text, record, index) => {
    console.log(record)
    deleterole([
      this.state.roleid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("角色删除成功");
        const dataSource = [...this.state.rolelist];
        this.setState({
          deletevisible:false,
          rolelist: dataSource.filter(item => item.id !== this.state.roleid),
        });
      } else {
        message.error(res.data.data)
      }
    });
  }



  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  //删除
  onDelete = (text, record, index) => {
    this.setState({
      deletevisible: true,
      roleid: text,
    })
  }

  render() {
    const components = {
      body: {
        // row: EditableFormRow,
        // cell: EditableCell,
      },
    };

    this.nodeInfoTableColumns = [
      {
        title: "角色名称",
        dataIndex: "namezh",
      }, {
        title: "角色简写",
        dataIndex: "name",
      },
      {
        title: "权限分配",
        dataIndex: "id",
        render: (text, record, index) => {
          return (
            <div>
              <span onClick={() => this.showModal(text, index, record)} style={{ color: 'blue', cursor: 'pointer' }}>
                选择权限
              </span>
              <span style={{ marginLeft: '10px' }}>
              </span>
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (text, record, index) => {
          return (
            <div>
              <span onClick={() => this.onDelete(text, record, index)}>
                <a><img src={require('./delete.png')} alt="" /></a>
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
          <Content style={{ margin: "16px 16px" }} id="role">
            <Card title="账号管理-角色管理" headStyle={{ fontWeight: 'bold', fontSize: '18px' }} extra={
              <div>
                <Button type="primary" onClick={this.setup}
                  style={{ marginRight: '20px', display: this.state.typenone }}
                >
                  添加角色
                </Button>
              </div>
            }>
              <div>
                <Table
                  dataSource={this.state.rolelist}
                  components={components}
                  columns={nodeInfoTableColumns}
                  pagination={this.state.page}
                />
              </div>
            </Card>
          </Content>
          <Modal
            title="添加角色"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            width="400px"
            centered
          // mask={false}
          >
            <div>
              <div style={{ display: this.state.twoadd }}>
                <span>角色名称：</span>
                <Input placeholder="请输入角色名称"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.roleZh}
                  value={this.state.roleZh}
                />
                <span>角色简写：</span>
                <Input placeholder="请输入角色简写"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.role}
                  value={this.state.role}
                />
              </div>
            </div>
          </Modal>
          <Modal
            title="删除角色"
            visible={this.state.deletevisible}
            onOk={this.deleteOk}
            width="400px"
            okText="删除"
            centered
            onCancel={this.handleCancel}
          >
            您确定要删除该角色吗？
          </Modal>
          <Modal
            title="选择权限"
            visible={this.state.menuvisible}
            onOk={this.saveOk}
            onCancel={this.handleCancel}
            okText="保存"
            // centered
            mask={false}
          >
            <Tree
              checkable
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              defaultCheckedKeys={this.state.tree}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
            >
              {this.renderTreeNodes(this.state.permissionlist)}
            </Tree>
          </Modal>
        </Layout>
      </Layout >
    );
  }
}

export default App;
