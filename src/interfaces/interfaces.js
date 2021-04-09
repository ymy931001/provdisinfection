import React from "react";
import {
  Table,
  Layout,
  Card,
  Modal,
  Input,
  Button,
  Select,
  Tree,
  message,
  Switch,
  Form,
  InputNumber,
} from "antd";

import {
  getthirdparty,
  basename,
  getbasetype,
  getallRegion,
  addthirdparty,
  thirdpartystatus,
  deletethirdparty,
  postthirdparty
} from "../axios";
import "./interfaces.css";

const { Content } = Layout;
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;





const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}


class App extends React.Component {
  state = {
    collapsed: false,
    thirdpartylist: [],
    permissionlist: [],
    warningListDataSource: [],
    opensecret: true,
    editingKeys: []
  };



  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() {

  }

  componentDidMount() {
    getthirdparty([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var arr = res.data.data
        for (var i in arr) {
          arr[i].secretstatus = true
        }
        this.setState({
          warningListDataSource: arr
        })
      }
    });

    getallRegion([
      330000
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          permissionlist: res.data.data
        })
      }
    });



    basename([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({

        })
      }
    });

    getbasetype([
      "thirdparty"
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          thirdpartylist: JSON.parse(res.data.data)
        }, function () {
          // var arr = []
          // for (var i in this.state.thirdpartylists) {
          //   arr.push({
          //     'desc': this.state.thirdpartylists[i].desc,
          //     'type': this.state.thirdpartylists[i].type.toString()
          //   })
          // }
          // console.log(arr)
          // this.setState({
          //   thirdpartylist: arr
          // })

        })
      }
    });


  }






  //关闭model
  handleCancel = () => {
    this.setState({
      visible: false,
      deletevisible: false,
    })
  }

  //关闭model
  handleCancels = () => {
    this.setState({
      menuvisible: false,
    })
  }



  //打开添加弹窗
  addthirdparty = () => {
    this.setState({
      visible: true,
    })
  }

  //打开区域弹框
  selectarea = (text, index, record) => {
    console.log(record)
    this.setState({
      menuvisible: true,
    })
  }

  //树状图

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.adcode} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
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


  //添加接口推送
  handleOk = () => {
    addthirdparty([
      this.state.pushRange,
      this.state.name,
      this.state.checkedKeys,
      this.state.host,
      this.state.remark,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("添加成功")
        getthirdparty([

        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              warningListDataSource: res.data.data
            })
          }
        });
        this.setState({
          visible: false,
        })
      }
    });
  }

  //名字录入
  namechange = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  //推送内容选择
  handleChanges = (value) => {
    console.log(value.join(','))
    this.setState({
      pushRange: value.join(',')
    })
  }

  //地址录入
  hostchange = (e) => {
    console.log(e)
    this.setState({
      host: e.target.value
    })
  }

  //备注录入
  remarkchange = (e) => {
    console.log(e)
    this.setState({
      remark: e.target.value
    })
  }

  //关闭区域弹窗
  saveOk = () => {
    this.setState({
      menuvisible: false,
    })
  }

  //修改推送状态
  switchchange = (text, record, index) => {
    thirdpartystatus([
      record.id,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("修改状态成功");
        getthirdparty([

        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              warningListDataSource: res.data.data
            })
          }
        });
      } else {
        message.error("修改状态失败")
      }
    });
  }

  //打开统计区域
  lookarea = () => {
    this.setState({
      menuvisible: true,
    })
  }

  //打开删除推送弹窗
  onDelete = (text, record, index) => {
    this.setState({
      deletevisible: true,
      thirdpartyid: record.id
    })
  }

  //删除推送
  deleteOk = (text, record, index) => {
    deletethirdparty([
      this.state.thirdpartyid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("推送删除成功");
        const dataSource = [...this.state.warningListDataSource];
        this.setState({
          deletevisible: false,
          warningListDataSource: dataSource.filter(item => item.id !== this.state.thirdpartyid),
        });
      } else {
        message.error(res.data.data)
      }
    });
  }


  //编辑

  isEditing = (record) => {
    return record.id === this.state.editingKey

  };
  edit(text, record, index) {
    this.setState({
      name: record.name,
      editingKey: record.id,
      thirdpartyid: record.id,
      host: record.host,
      remark: record.remark,
      pushRange: !record.pushRange ? [] : JSON.parse(record.pushRange),
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  //保存

  save(form, key, text) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.warningListDataSource];
      console.log(newData)
      const index = newData.findIndex(item => key === item.key);
      console.log(newData[index])
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({
          warningListDataSource: newData, editingKey: '',
          name: newData[index].name,
          host: newData[index].host,
          remark: newData[index].remark,
        }, () => {
          postthirdparty([
            this.state.thirdpartyid,
            this.state.name,
            this.state.host,
            this.state.remark,
            this.state.pushRange,
          ]).then(res => {
            if (res.data && res.data.message === 'success') {
              message.success("信息修改成功");
              getthirdparty([

              ]).then(res => {
                if (res.data && res.data.message === "success") {
                  this.setState({
                    warningListDataSource: res.data.data
                  })
                }
              });
            }
          });
        });
      } else {
        newData.push(this.state.warningListDataSource);
        this.setState({ warningListDataSource: newData, editingKey: '' });
      }
    });
  }


  isEditings = (record) => {
    return record.id === this.state.editingKeys

  };

  //查看appsecret
  looksecret = (text, record, index) => {
    console.log(this.state.editingKeys)
    if (this.state.editingKeys === record.id) {
      this.setState({
        editingKeys: [],
      });
    } else {
      this.setState({
        editingKeys: record.id,
      });
    }

  }


  render() {


    const prooptions = this.state.thirdpartylist.map((province) => <Option key={province.type}  >{province.desc}</Option>);
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    this.otaInfoTableColumns = [
      {
        title: "接口名字",
        dataIndex: "name",
        editable: true,
      },
      {
        title: "推送内容",
        dataIndex: "pushRange",
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <div >
                  <Select
                    style={{ width: '320px', marginBottom: "10px", marginTop: '10px', marginRight: '20px' }}
                    placeholder="请选择推送内容"
                    mode="multiple"
                    onChange={this.handleChanges}
                  // defaultValue={JSON.parse(text)}
                  >
                    {prooptions}
                  </Select>
                </div>
              ) : (
                <div >
                  <Select
                    style={{ width: '320px', marginBottom: "10px", marginTop: '10px', marginRight: '20px' }}
                    placeholder="请选择推送内容"
                    mode="multiple"
                    onChange={this.handleChanges}
                    disabled
                    defaultValue={text.replace(/\[/g, "").replace(/\]/g, "").split(',')}
                  // defaultValue={JSON.parse(text)}
                  >
                    {prooptions}
                  </Select>
                </div>
              )
              }</div>
          )
        }
      },
      {
        title: "接口地址",
        dataIndex: "host",
        editable: true,
      },
      {
        title: "appid",
        dataIndex: "appid",
      },
      {
        title: "appSecret",
        dataIndex: "appSecret",
        render: (text, record, index) => {
          const editable = this.isEditings(record);
          return (
            <div >
              {editable ? (
                <div>
                  <span onClick={() => this.looksecret(text, record, index)} style={{ cursor: 'pointer' }}>
                    {text}
                  </span>
                </div>
              ) : (
                <div>
                  <a onClick={() => this.looksecret(text, record, index)}>
                    <img src={require('./eye.png')} alt="" />
                  </a>
                </div>

              )}
            </div>
          )
        }
      },
      {
        title: "接口状态",
        dataIndex: "status",
        render: (text, record, index) => {
          return (
            <div >
              <Switch
                checked={text}
                checkedChildren="开启" unCheckedChildren="关闭"
                onChange={() => this.switchchange(text, record, index)}
              />
            </div>
          )
        }
      }, {
        title: "统计区域",
        dataIndex: "x",
        render: (text, record, index) => {
          return (
            <div >
              <a onClick={() => this.lookarea(text, record, index)}>查看</a>
            </div>
          )
        }
      }, {
        title: "备注",
        dataIndex: "remark",
        editable: true,
      },
      {
        title: "操作",
        dataIndex: "id",
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a

                        onClick={() => this.save(form, record.key, text)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <a onClick={() => this.cancel(record.key, text)}>取消</a>
                </span>
              ) : (
                <a onClick={() => this.edit(text, record, index)}><img src={require('./edit.png')} alt="" /></a>
              )}
              <span style={{ marginLeft: '20px' }} onClick={() => this.onDelete(text, record, index)}>
                <a><img src={require('./delete.png')} alt="" /></a>
              </span>
            </div>
          );
        }
      }

    ];

    const otaInfoTableColumns = this.otaInfoTableColumns.map((col) => {
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
      <Layout>
        <Layout id="warning">
          <Content style={{ margin: "16px 16px" }} >
            <Card title="系统管理-接口管理" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}

              extra={
                <div>
                  <Button type="primary"
                    style={{ background: '#2c94f4', border: '1px solid #2c94f4' }} onClick={this.addthirdparty}
                  >
                    添加第三方接口
                    </Button>
                </div>
              }>
              <div style={{ marginTop: 15 }}>
                <Table
                  dataSource={this.state.warningListDataSource}
                  columns={otaInfoTableColumns}
                  components={components}
                  pagination={this.state.page}
                />
              </div>
            </Card>
          </Content>
          <Modal
            title="添加第三方接口"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            className="qrCodeModal"
            width="370px"
            centered
          >
            <div>
              推送内容：
                  <Select
                style={{ width: '100%', marginBottom: "10px", marginTop: '10px', marginRight: '20px' }}
                placeholder="请选择推送内容"
                mode="multiple"
                onChange={this.handleChanges}
              >
                {prooptions}
              </Select>
              <div>
                <span>接口名字：</span>
                <Input placeholder="请输入接口名字"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  value={this.state.name}
                  onChange={this.namechange}
                  autoComplete="off" />

              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>统计区域：</span>
                <Button type="primary"
                  style={{ background: '#2c94f4', border: '1px solid #2c94f4' }} onClick={this.selectarea}
                >
                  选择
                </Button>
              </div>
              <div>
                <span>接口地址：</span>
                <Input placeholder="请输入接口地址"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  value={this.state.host}
                  onChange={this.hostchange}
                  autoComplete="off" />

              </div>
              <span>备注：</span>
              <TextArea rows={4} style={{ width: '100%', marginBottom: "10px", marginTop: '10px', }}
                onChange={this.remarkchange}
                value={this.state.remark}
                placeholder="请输入备注（选填）"
              />
            </div>
          </Modal>
          <Modal
            title="选择统计区域"
            visible={this.state.menuvisible}
            onOk={this.saveOk}
            onCancel={this.handleCancels}
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
          <Modal
            title="删除推送"
            visible={this.state.deletevisible}
            onOk={this.deleteOk}
            width="400px"
            okText="删除"
            centered
            onCancel={this.handleCancel}
          >
            您确认要删除该推送吗？
          </Modal>
        </Layout>
      </Layout>
    );
  }
}

export default App;
