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
  Form,
  InputNumber,
} from "antd";
import {
  getscene,
  addscene,
  getbasetype,
  putscene
} from "../axios";
import "./scene.css";

const { Content } = Layout;
const { TextArea } = Input;
const Option = Select.Option;




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
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      typenone: "inline-block",
      sitelist: [],
      sitelists: [],
      strategylist: [],
      levellist: [],
      leveltype: [],
      strategytype: [],
    };
  }

  componentWillMount() {
    document.title = "场景管理";
  }

  componentDidMount() {

    getscene([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          scenelist: res.data.data
        })
      }
    });

    getbasetype([
      "roomStrategy"
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          strategylist: JSON.parse(res.data.data)
        }, function () {
          var arr = {}
          for (var i in this.state.strategylist) {
            arr[i] = this.state.strategylist[i].desc
          }
          this.setState({
            strategytype: arr
          })
        })
      }
    });

    getbasetype([
      "roomLevel"
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          levellist: JSON.parse(res.data.data)
        }, function () {
          var arr = {}
          for (var i in this.state.levellist) {
            arr[i] = this.state.levellist[i].desc
          }
          this.setState({
            leveltype: arr
          })
        })
      }
    });
  }




  sitechange = (value) => {
    this.setState({
      site: value
    })
  }

  // onDelete = (text, record, index) => {
  //   console.log(record)
  //   deleteroom([
  //     record.id,
  //   ]).then(res => {
  //     if (res.data && res.data.message === "success") {
  //       message.success("房间删除成功");
  //       const dataSource = [...this.state.roomlist];
  //       this.setState({
  //         roomlist: dataSource.filter(item => item.id !== record.id),
  //       });
  //     }
  //   });
  // }


  //编辑

  isEditing = (record) => {
    return record.id === this.state.editingKey
  };
  edit(text, record, index) {
    console.log(record)
    this.setState({
      editingKey: record.id,
      id: record.id,
      remark: record.remark,
      scenename: record.name,
      strategy: record.strategy,
      level: record.level,
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  //编辑保存
  save(form, key, text) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.scenelist];
      const index = newData.findIndex(item => key === item.key);
      console.log(newData[index])
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({
          scenelist: newData, editingKey: '',
          scenename: newData[index].name,
          remark: newData[index].remark,
        }, () => {
          putscene([
            this.state.id,
            this.state.scenename,
            this.state.strategy,
            this.state.level,
            this.state.remark,
          ]).then(res => {
            if (res.data && res.data.message === 'success') {
              message.success("信息修改成功");
              getscene([

              ]).then(res => {
                if (res.data && res.data.message === "success") {
                  this.setState({
                    scenelist: res.data.data
                  })
                }
              });
            }
          });

        });

      } else {
        newData.push(this.state.scenelist);
        this.setState({ scenelist: newData, editingKey: '' });
      }
    });
  }



  //打开添加场景的model
  addscene = () => {
    this.setState({
      visible: true
    })
  }
  //关闭添加场景的model
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  //场景名字输入
  scenename = (e) => {
    this.setState({
      scenename: e.target.value
    })
  }
  //备注输入
  remarkchange = (e) => {
    console.log(e.target.value)
    this.setState({
      remark: e.target.value
    })
  }
  //选择检测策略
  strategychange = (value) => {
    console.log(value)
    this.setState({
      strategy: value
    })
  }
  //选择检测级别
  levelchange = (value) => {
    console.log(value)
    this.setState({
      level: value
    })
  }

  //添加场景
  handleOk = () => {
    // console.log(this.state.remark)
    addscene([
      this.state.scenename,
      this.state.strategy,
      this.state.level,
      this.state.remark,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('场景添加成功')
        this.setState({
          visible: false
        })
        getscene([

        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              scenelist: res.data.data
            })
          }
        });
      }
    });
  }

  render() {
    const strategyoptions = this.state.strategylist.map((province) => <Option key={province.type}  >{province.desc}</Option>);
    const leveloptions = this.state.levellist.map((province) => <Option key={province.type}  >
      <div className="selecttype">
        <span>{province.desc}</span>
        {/* <span style={{ color: '#d9d9d9', fontSize: '12px' }}>{province.identifier}</span> */}
      </div>
    </Option>);
    const sceneColumn = [
      {
        title: "场景名字",
        dataIndex: "name",
        editable: true,
      }, {
        title: "场景策略",
        dataIndex: "strategy",
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          if (text === null) {
            return (
              <div>
                无
              </div>
            )
          } else {
            return (
              <div>
                {editable ? (
                  <Select
                    style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                    placeholder="请选择检测策略"
                    onChange={this.strategychange}
                    value={this.state.strategytype[this.state.strategy]}
                  >
                    {strategyoptions}
                  </Select>
                ) : (
                    <span>
                      {this.state.strategytype[text]}
                    </span>
                  )}

              </div>
            )
          }
        }

      },
      {
        title: "场景级别",
        dataIndex: "level",
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          if (text === null) {
            return (
              <div>
                无
              </div>
            )
          } else {
            return (
              <div>
                {editable ? (
                  <Select
                    style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                    placeholder="请选择检测级别"
                    onChange={this.levelchange}
                    value={this.state.leveltype[this.state.level]}
                  >
                    {leveloptions}
                  </Select>
                ) : (
                    <span>
                      {this.state.leveltype[text]}
                    </span>
                  )}

              </div>
            )
          }
        }
      }, {
        title: "备注",
        dataIndex: "remark",
        editable: true,
      }, {
        title: "创建时间",
        dataIndex: "gmtcreate",
      },
      {
        title: '操作',
        dataIndex: 'id',
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
                  <Popconfirm
                    title="确认要取消吗?"
                    onConfirm={() => this.cancel(record.key, text)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                  <a onClick={() => this.edit(text, record, index)}><img src={require('./edit.png')} alt="" /></a>
                )}
            </div>
          );
        }
      }
    ];

    const sceneColumns = sceneColumn.map((col) => {
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

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="场景管理" id="nodeManage" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC' }} onClick={this.addscene} >
                    添加场景
                  </Button>
                </div>
              }>
              <div>
                <Table
                  dataSource={this.state.scenelist}
                  columns={sceneColumns}
                  pagination={this.state.page}
                  components={components}
                />
              </div>
            </Card>
          </Content>
          <Modal
            title="添加场景"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            width="400px"
            mask={false}
          >
            <span>场景名字：</span>
            <Input placeholder="请输入场景名字"
              style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
              autoComplete="off"
              onChange={this.scenename}
              value={this.state.scenename}
            />
            <span>检测策略：</span>
            <Select
              style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
              placeholder="请选择检测策略"
              onChange={this.strategychange}
              value={this.state.strategy}
            >
              {strategyoptions}
            </Select>
            <span>检测级别：</span>
            <Select
              style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
              placeholder="请选择检测级别"
              onChange={this.levelchange}
              value={this.state.level}
            >
              {leveloptions}
            </Select>
            <span>备注：</span>
            <TextArea rows={4} style={{ marginTop: '10px' }}
              onChange={this.remarkchange}
              value={this.state.remark}
              placeholder="请输入备注（选填）"
            />
          </Modal>
        </Layout>
      </Layout >
    );
  }
}

export default App;
