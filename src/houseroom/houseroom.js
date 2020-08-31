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
  Drawer,
  Switch,
  Form,
  InputNumber,
} from "antd";
import {
  roomlist,
  deleteroom,
  insertroom,
  insertcleaner,
  cleanerlist,
  addboard,
  bindcamera,
  roomstatus,
  deletecleaner,
  putroom,
} from "../axios";
import "./houseroom.css";
import { Link } from 'react-router-dom';

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
      scenelist: [],
      scenetype: [],
      cameralist: [],
      boardlist: [],
      cleanerdata: [],
    };
  }

  componentWillMount() {
    document.title = "房间管理";
  }

  componentDidMount() {
    if (localStorage.getItem("userID") === 'lsadmin') {
      this.setState({
        lsdis: 'none',
      })
    }


    cleanerlist([
      localStorage.getItem('hotelid')
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          cleanerdata: res.data.data
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

    // var newarr = []
    // var arrlist = {}
    // getscene().then(res => {
    //   for (var i in res.data.data) {
    //     newarr.push({
    //       'id': res.data.data[i].id,
    //       'value': res.data.data[i].name
    //     })
    //     arrlist[res.data.data[i].id] = res.data.data[i].name
    //   }
    //   console.log(arrlist)
    //   this.setState({
    //     scenelist: newarr,
    //     scenetype: arrlist
    //   }, function () {
    //     console.log(this.state.scenetype[2])
    //   });
    // });

    roomlist([
      localStorage.getItem('hotelid')
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          roomlist: res.data.data
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


  handleCancel = () => {
    this.setState({
      visible: false,
      socketvisible: false,
      boardvisible: false,
      deletevisible: false,
      roomvisible: false,
      deleteclear: false,
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
    this.setState({
      deletevisible: true,
      roomid: text,
    })
  }

  deleteOk = (text, record, index) => {
    console.log(record)
    deleteroom([
      this.state.roomid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("房间删除成功");
        const dataSource = [...this.state.roomlist];
        this.setState({
          roomlist: dataSource.filter(item => item.id !== this.state.roomid),
          deletevisible:false,
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
    console.log(record)
    this.setState({
      editingKey: record.id,
      siteId: record.siteId,
      roomid: record.id,
      sceneId: record.sceneId,
      name: record.name,
      cleanerId: record.cleanerId,
      standard: record.standard,
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
      const newData = [...this.state.roomlist];
      const index = newData.findIndex(item => key === item.key);
      console.log(newData[index])
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({
          roomlist: newData, editingKey: '',
          remark: newData[index].remark,
          name: newData[index].name,
        }, () => {
          putroom([
            this.state.roomid,
            this.state.name,
            this.state.cleanerId,
            this.state.standard,
            this.state.remark,
            localStorage.getItem('hotelid'),
          ]).then(res => {
            if (res.data && res.data.message === 'success') {
              message.success("信息修改成功");
              roomlist([
                localStorage.getItem('hotelid')
              ]).then(res => {
                if (res.data && res.data.message === "success") {
                  this.setState({
                    roomlist: res.data.data
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

        });

      } else {
        newData.push(this.state.roomlist);
        this.setState({ roomlist: newData, editingKey: '' });
      }
    });
  }

  scenechange = (value) => {
    console.log(value)
    this.setState({
      sceneId: value
    })
  }
  //绑定摄像头弹框
  addsocket = () => {
    this.setState({
      socketvisible: true,
    })
  }

  //查看摄像头
  looksocket = (text, record, index) => {
    console.log(record)
    localStorage.setItem('roomid', record.id)
    window.location.href = "/app/equipment";
  }

  //摄像头选择
  camerachange = (value) => {
    this.setState({
      cameraid: value,
    })
  }

  //打开绑定插座
  addboard = (text, record, index) => {
    console.log(record)
    this.setState({
      roomid: record.id,
      boardvisible: true,
    })
  }

  //插座选择
  boardchange = (value) => {
    this.setState({
      boardid: value,
    })
  }

  //查看摄像头
  lookboard = (text, record, index) => {
    console.log(record)
    localStorage.setItem('roomid', record.id)
    window.location.href = "/app/socket";
  }
  //参数设置
  changeparm = (text, record, index) => {
    console.log(record)
    localStorage.setItem('roomid', record.id)
    window.location.href = "/app/addargs";
  }

  //绑定插座
  boardOk = () => {
    addboard([
      this.state.roomid,
      this.state.boardid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("插座绑定成功");
        this.setState({
          boardvisible: true,
        })
      }
    });
  }

  //绑定摄像头
  socketOk = () => {
    bindcamera([
      this.state.roomid,
      this.state.cameraid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("摄像头绑定成功");
        this.setState({
          socketvisible: true,
        })
      }
    });
  }



  //检测状态
  switchchange = (text, record, index) => {
    roomstatus([
      record.id,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success(res.data.data);
        roomlist([
          localStorage.getItem('hotelid')
        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              roomlist: res.data.data
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
      } else {
        message.error(res.data.message)
      }
    });
  }

  //打开添加房间弹窗
  addroom = () => {
    this.setState({
      roomvisible: true
    })
  }

  //房间roomname
  roomname = (e) => {
    this.setState({
      roomname: e.target.value
    })
  }

  //关闭保洁员抽屉
  onClose = (e) => {
    this.setState({
      cleanervisible: false,
    });
  }

  //打开保洁员管理抽屉
  cleanerlist = () => {
    this.setState({
      cleanervisible: true,
    });
  }

  //打开添加保洁员弹窗
  addclearner = () => {
    this.setState({
      visible: true
    })
  }

  //添加保洁员
  handleOk = () => {
    insertcleaner([
      this.state.cleanername,
      this.state.cleanerphone,
      this.state.remark,
      localStorage.getItem('hotelid'),
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('添加成功')
        cleanerlist([
          localStorage.getItem('hotelid')
        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              cleanerdata: res.data.data
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

  //打开删除保洁员弹窗
  clearnerdelete = (text, record, index) => {
    this.setState({
      deleteclear: true,
      cleanerId: text
    })
  }

  //删除保洁员
  deleteclearok = (text, record, index) => {
    deletecleaner([
      this.state.cleanerId,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("删除成功");
        const dataSource = [...this.state.cleanerdata];
        this.setState({
          deleteclear: false,
          cleanerdata: dataSource.filter(item => item.id !== this.state.cleanerId),
        });
      }
    });
  }

  //添加房间
  addroomOk = (text, record, index) => {
    insertroom([
      this.state.roomname,
      localStorage.getItem('hotelid'),
      this.state.cleanerid,
      this.state.standard,
      this.state.remark,
    ]).then(res => {
      if (res.data && res.data.message === 'success') {
        message.success('房间添加成功');
        this.setState({
          roomvisible: false,
        })
        roomlist([
          localStorage.getItem('hotelid')
        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              roomlist: res.data.data
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

  //保洁员
  cleanerid = (value) => {
    this.setState({
      cleanerid: value
    })
  }


  //报警阈值修改
  standardchange = (value) => {
    this.setState({
      standard: value
    })
  }



  render() {
    const prooptions = this.state.cleanerdata.map((province) => <Option key={province.id}  >{province.name}</Option>);
    const cleanercolumn = [{
      title: '保洁员姓名',
      dataIndex: 'name',
    }, {
      title: '联系电话',
      dataIndex: 'phone',
    }, {
      title: '备注',
      dataIndex: 'remark',
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record, index) => {
        return (
          <div>
            <span onClick={() => this.clearnerdelete(text, record, index)}>
              <a><img src={require('./delete.png')} alt="" /></a>
            </span>
          </div>
        );
      }
    }]


    const nodeInfoTableColumn = [
      {
        title: "房间名称",
        dataIndex: "name",
        editable: true,
        width: 120
      },
      // {
      //   title: "保洁员",
      //   dataIndex: "cleanerName",
      //   // editable: true,
      //   render: (text, record, index) => {
      //     const editable = this.isEditing(record);
      //     if (text === null) {
      //       return (
      //         <div>
      //           无
      //         </div>
      //       )
      //     } else {

      //       return (
      //         <div>
      //           {text}
      //         </div>
      //       )
      //     }
      //   }
      // }, 
      {
        title: "报警阈值",
        dataIndex: "standard",
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <div>
                  <Select
                    style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                    placeholder="请选择报警阈值"
                    onChange={this.standardchange}
                    value={this.state.standard}
                  >
                    <Option key="1" >1天</Option>
                    <Option key="2" >2天</Option>
                    <Option key="3" >3天</Option>
                  </Select>
                </div>
              ) : (
                  <div>
                    {text} 天
                  </div>
                )}
            </div>
          );
        }
      },
      // {
      //   title: "所属场景",
      //   dataIndex: "sceneId",
      //   render: (text, record, index) => {
      //     const editable = this.isEditing(record);
      //     if (text === null) {
      //       return (
      //         <div>
      //           {editable ? (
      //             <Select
      //               style={{ width: '60%', marginRight: '20px' }}
      //               placeholder="请选择房间场景"
      //               onChange={this.scenechange}
      //               value={this.state.scenetype[this.state.sceneId]}
      //             >
      //               {sceneoptions}
      //             </Select>
      //           ) : (
      //               <span>
      //                 无
      //               </span>
      //             )}

      //         </div>
      //       )
      //     } else {
      //       return (
      //         <div>
      //           {editable ? (
      //             <Select
      //               style={{ width: '60%', marginRight: '20px' }}
      //               placeholder="请选择房间场景"
      //               onChange={this.scenechange}
      //               value={this.state.scenetype[this.state.sceneId]}
      //             >
      //               {sceneoptions}
      //             </Select>
      //           ) : (
      //               <span>
      //                 {this.state.scenetype[text]}
      //               </span>
      //             )}

      //         </div>
      //       )
      //     }
      //   }
      // },
      {
        title: "摄像头",
        dataIndex: "sceneId",
        render: (text, record, index) => {
          return (
            <div>
              {/* <a style={{ marginRight: '5px' }} onClick={() => this.addsocket(text, record, index)}
              >绑定</a> */}
              <a onClick={() => this.looksocket(text, record, index)}
              >查看</a>
            </div>
          )
        }
      }, {
        title: "插座",
        dataIndex: "sceneId",
        render: (text, record, index) => {
          return (
            <div>
              {/* <a style={{ marginRight: '5px' }} onClick={() => this.addboard(text, record, index)}
              >绑定</a> */}
              <a onClick={() => this.lookboard(text, record, index)}
              >查看</a>
            </div>
          )
        }
      },
      {
        title: "检测状态",
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
        title: "参数设置",
        dataIndex: "id",
        render: (text, record, index) => {
          return (
            <div>
              <a onClick={() => this.changeparm(text, record, index)} >修改</a>
            </div>
          )
        }
      },
      // {
      //   title: "备注",
      //   dataIndex: "remark",
      //   editable: true,
      //   width: 200,
      //   render: (text, record, index) => {
      //     if (text === null || text === "") {
      //       return (
      //         <div>
      //           无
      //         </div>
      //       )
      //     } else {
      //       return (
      //         <div>
      //           {text}
      //         </div>
      //       )
      //     }
      //   }
      // },
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
                  <a onClick={() => this.cancel(record.key, text)} >取消</a>
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

    const nodeInfoTableColumns = nodeInfoTableColumn.map((col) => {
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
      <Layout >
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="houseroom">
            <div style={{ marginBottom: '10px', fontSize: '14px' }}>
              <Link to="/app/hotel" style={{ color: '#999' }}>返回</Link>     &nbsp;&nbsp; {localStorage.getItem('hotelname')}     &nbsp;&nbsp;/&nbsp;&nbsp;房间管理
            </div>
            <Card title="网点管理-房间管理" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary" style={{ background: '#2c94f4', border: '1px solid #2c94f4', display: this.state.typenone }} onClick={this.addroom} >
                    添加房间
                  </Button>
                  <Button type="primary" style={{ marginLeft: '20px', background: '#2c94f4', border: '1px solid #2c94f4', display: this.state.lsdis }} onClick={this.cleanerlist}>
                    保洁员管理
                  </Button>
                </div>
              }>
              <div>
                <Table
                  dataSource={this.state.roomlist}
                  columns={nodeInfoTableColumns}
                  pagination={this.state.page}
                  components={components}
                />
              </div>
            </Card>
          </Content>

          <Modal
            title="添加房间"
            visible={this.state.roomvisible}
            onOk={this.addroomOk}
            onCancel={this.handleCancel}
            okText="添加"
            destroyOnClose
            width="400px"
          >
            <div>
              <div style={{ display: this.state.twoadd }}>
                <span> <span style={{ color: 'red' }}>*</span> 房间名称：</span>
                <Input placeholder="请输入房间名称"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.roomname}
                  value={this.state.roomname}
                />
                <span> <span style={{ color: 'red' }}>*</span> 负责保洁员：</span>
                <Select
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  placeholder="请选择负责保洁员"
                  onChange={this.cleanerid}
                  value={this.state.cleanerid}
                >
                  {prooptions}
                </Select>
                <span> <span style={{ color: 'red' }}>*</span> 报警阈值：</span>
                <Select
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  placeholder="请选择报警阈值"
                  onChange={this.standardchange}
                  value={this.state.standard}
                >
                  <Option key="1" >1天</Option>
                  <Option key="2" >2天</Option>
                  <Option key="3" >3天</Option>
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

          <Modal
            title="添加保洁员"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="添加"
            destroyOnClose
            width="400px"
            centered
          >
            <div>
              <div style={{ display: this.state.twoadd }}>
                <span>  <span style={{ color: 'red' }}>*</span>  保洁员姓名：</span>
                <Input placeholder="请输入保洁员姓名"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.cleanername}
                  value={this.state.cleanername}
                />
                <span> <span style={{ color: 'red' }}>*</span>  保洁员电话：</span>
                <Input placeholder="请输入保洁员电话"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.cleanerphone}
                  value={this.state.cleanerphone}
                />
                <span>备注：</span>
                <TextArea rows={4} style={{ marginTop: '10px' }}
                  onChange={this.remarkchange}
                  value={this.state.remark}
                  placeholder="请输入备注（选填）"
                />
              </div>
            </div>
          </Modal>

          <Modal
            title="删除房间"
            visible={this.state.deletevisible}
            onOk={this.deleteOk}
            width="400px"
            okText="删除"
            centered
            onCancel={this.handleCancel}
          >
            您确定要删除该房间吗？
          </Modal>
          <Modal
            title="删除保洁员"
            visible={this.state.deleteclear}
            onOk={this.deleteclearok}
            width="400px"
            okText="删除"
            centered
            onCancel={this.handleCancel}
          >
            您确定要删除该保洁员吗？
          </Modal>
          <Drawer
            title="保洁员管理"
            width={600}
            onClose={this.onClose}
            visible={this.state.cleanervisible}
          >
            <div style={{ width: '100%' }}>
              <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <Button type="primary" style={{ background: '#2c94f4', border: '1px solid #2c94f4' }} onClick={this.addclearner} >
                  添加保洁员
              </Button>
              </div>
              < Table
                dataSource={this.state.cleanerdata}
                columns={cleanercolumn}
                bordered
              />
            </div>
          </Drawer>


          {/* <Modal
            title="摄像头绑定"
            visible={this.state.socketvisible}
            onOk={this.socketOk}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            width="400px"
            mask={false}
          >
            <div>
              <div>
                <span>摄像头列表：</span>
                <Select
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  placeholder="请选择摄像头"
                  onChange={this.camerachange}
                  value={this.state.cameraid}
                >
                  {cameraoptions}
                </Select>
              </div>
            </div>
          </Modal> */}

          {/* <Modal
            title="插座绑定"
            visible={this.state.boardvisible}
            onOk={this.boardOk}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            width="400px"
            mask={false}
          >
            <div>
              <div>
                <span>插座列表：</span>
                <Select
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  placeholder="请选择插座"
                  onChange={this.boardchange}
                  value={this.state.boardid}
                >
                  {boardoptions}
                </Select>
              </div>
            </div>
          </Modal> */}
        </Layout>
      </Layout >
    );
  }
}

export default App;
