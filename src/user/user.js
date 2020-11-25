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
  Transfer,
  Popconfirm,
  InputNumber,
  Form,
  Tabs,
  Cascader,
  Tree
} from "antd";
import {
  userlist,
  hotellist,
  addUserAlarm,
  removeUserAlarm,
  getAreaMap,
  updateAdminAreas,
  getAdminAreas,
  getallRegion,
  putuser,
  deleteuser,
  puthoteluser, getregion
} from "../axios";
import "./user.css";
import { Link } from 'react-router-dom';

const { Content } = Layout;
const Option = Select.Option;
const { TabPane } = Tabs;
const TreeNode = Tree.TreeNode;

function callback(key) {
  console.log(key);
}




// const typetext = {
//   "0": "超级管理员",
//   "1": '管理员',
//   "2": '酒店管理员',
// };

// const typetexts = {
//   "超级管理员": "0",
//   "管理员": '1',
//   "酒店管理员": '2',
// };



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
      sitelist: [],
      typenone: "inline-block",
      mockData: [],
      targetKeys: [],
      hotllists: [],
      arealist: [],
      sitelists: [],
      permissionlist: [],
      deviceList: [],
      typelist: [{
        'id': '0',
        'value': '超级管理员'
      }, {
        'id': '1',
        'value': '管理员'
      }, {
        'id': '2',
        "value": '酒店管理员'
      }],

    };


  }


  componentWillMount() {
    document.title = "用户管理";
  }

  componentDidMount() {
    if (localStorage.getItem("type") === "2") {
      this.setState({
        typenone: 'none'
      })
    }
    if (localStorage.getItem("type") === "0") {
      this.setState({
        typelist: [{
          'id': '0',
          'value': '超级管理员'
        }, {
          'id': '1',
          'value': '管理员'
        }, {
          'id': '2',
          "value": '酒店管理员'
        }]
      })
    } else {
      this.setState({
        typelist: [{
          'id': '1',
          'value': '管理员'
        }, {
          'id': '2',
          "value": '酒店管理员'
        }]
      })
    }

    this.getMock();

    hotellist().then(res => {
      console.log(res.data.data)
      var arr = []
      for (var i in res.data.data) {
        arr.push({
          i: res.data.data[i]
        })
      }
      arr.push({
        '无': undefined
      })
      console.log(arr)
      this.setState({
        sitelist: res.data.data,
        sitelists: arr,
      });
    });

    getregion().then(res => {
      if (res.data && res.data.message === "success") {
        if (res.data.data.length !== 0) {
          for (var i in res.data.data[0].children) {
            for (var j in res.data.data[0].children[i].children) {
              for (var k in res.data.data[0].children[i].children[j].children) {
                if (res.data.data[0].children[i].children[j].children[k].children.length === 0) {
                  res.data.data[0].children[i].children[j].children[k].adcode = res.data.data[0].children[i].children[j].children[k].id
                  res.data.data[0].children[i].children[j].children[k].children = undefined
                }
              }
            }
          }
          this.setState({
            deviceList: res.data.data[0].children
          })
        } else {
          this.setState({
            deviceList: []
          })
        }
      }
    });


    getAreaMap().then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          arealist: res.data.data
        })
      }
    });

    userlist([1]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          userlist: res.data.data
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

    userlist([2]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          areauserlist: res.data.data
        }, function () {
          userlist([6]).then(res => {
            var arr = this.state.areauserlist
            if (res.data && res.data.message === "success") {
              for (var i in res.data.data) {
                arr.push(res.data.data[i])
              }
              this.setState({
                areauserlist: arr
              }, function () {
                userlist([7]).then(res => {
                  var arrs = this.state.areauserlist
                  if (res.data && res.data.message === "success") {
                    for (var i in res.data.data) {
                      arrs.push(res.data.data[i])
                    }
                    this.setState({
                      areauserlist: arrs
                    });
                  }
                });
              });
            }
          });
        });
      }
    });


    userlist([4]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          hoteluserlist: res.data.data
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




    getallRegion([
      330000
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          permissionlist: res.data.data
        })
      }
    });






  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  setup = () => {
    this.setState({
      visible: true
    })
  }

  //设备位置选择
  addresschange = (e) => {
    console.log(e)
    this.setState({
      addresslist: e,
      cityid: e[0] === undefined ? null : e[0],
      areaid: e[1] === undefined ? null : e[1],
      siteId: e[2] === undefined ? null : e[2]
    });
  }

  query = () => {
    userlist([
      4,
      this.state.siteId,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          hoteluserlist: res.data.data
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


  reset = () => {
    this.setState({
      addresslist: [],
      cityid: undefined,
      areaid: undefined,
      siteId: undefined
    }, function () {
      userlist([
        4,
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          this.setState({
            hoteluserlist: res.data.data
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
    });

  }

  typeChange = (value) => {
    console.log(value)
    this.setState({
      usertypeid: value
    }, function () {
      if (this.state.usertypeid === "2") {
        this.setState({
          hotllists: JSON.parse(localStorage.getItem('sitelist'))
        })
      } else {
        this.setState({
          siteid: undefined,
          hotllists: []
        })
      }
    })
  }

  hotelChange = (value) => {
    console.log(value)
    this.setState({
      siteid: value
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      menuvisible: false,
      deletevisible: false,
    })
  }


  getMock = () => {
    userlist([
      1
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        const targetKeys = [];
        const mockData = [];
        for (var i in res.data.data) {
          mockData.push({
            'key': res.data.data[i].id,
            'name': res.data.data[i].adminname,
            'phone': res.data.data[i].phone,
            'id': res.data.data[i].id,
            'chosen': res.data.data[i].notifier === null || res.data.data[i].notifier === false || res.data.data[i].notifier === 'null' ? false : true,
          })
        }
        for (var j in mockData) {
          if (mockData[j].chosen === true) {
            targetKeys.push(mockData[j].id);
          }
        }
        console.log(targetKeys)
        this.setState({
          mockData,
          targetKeys,
        });
      }
    });
  };

  handleChange = (targetKeys, direction, moveKeys) => {
    console.log(targetKeys.length)
    console.log(this.state.targetKeys.length)
    if (targetKeys.length > this.state.targetKeys.length) {
      addUserAlarm([
        moveKeys.length === 0 ? '' : moveKeys.join(',')
      ]).then(res => {

      });
    }
    if (targetKeys.length < this.state.targetKeys.length) {
      removeUserAlarm([
        moveKeys.length === 0 ? '' : moveKeys.join(',')
      ]).then(res => {

      });
    }
    this.setState({ targetKeys });
  };

  renderItem = item => {
    const customLabel = (
      <span className="custom-item">
        {item.name} - {item.phone}
      </span>
    );

    return {
      label: customLabel, // for displayed item
      value: item.name, // for title and filter matching
    };
  };


  isEditing = (record) => {
    return record.id === this.state.editingKey

  };
  edit(text, record, index) {
    console.log(text)
    console.log(record.type)
    if (record.siteId === null) {
      this.setState({
        siteid: '无'
      })
    }
    if (record.type === 2) {
      this.setState({
        hotllists: JSON.parse(localStorage.getItem('sitelist'))
      })
    } else {
      this.setState({
        hotllists: []
      })
    }
    this.setState({
      usertypeid: record.type,
      editingKey: record.id,
      userid: record.id,
      siteid: record.siteId,
      username: record.name,
      mail: record.mail,
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };


  save(form, key, text) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.areauserlist];
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
          areauserlist: newData, editingKey: '',
          adminname: newData[index].name,
          username: newData[index].username,
          phone: newData[index].phone,
          password: newData[index].password,
          mail: newData[index].mail,
        }, () => {
          putuser([
            this.state.userid,
            this.state.adminname,
            this.state.phone,
            this.state.username,
            this.state.mail,
          ]).then(res => {
            if (res.data && res.data.message === 'success') {
              message.success("信息修改成功");
              userlist([
                2
              ]).then(res => {
                if (res.data && res.data.message === 'success') {
                  this.setState({
                    areauserlist: res.data.data,
                  }, function () {
                    userlist([6]).then(res => {
                      var arr = this.state.areauserlist
                      if (res.data && res.data.message === "success") {
                        for (var i in res.data.data) {
                          arr.push(res.data.data[i])
                        }
                        this.setState({
                          areauserlist: arr
                        }, function () {
                          userlist([7]).then(res => {
                            var arrs = this.state.areauserlist
                            if (res.data && res.data.message === "success") {
                              for (var i in res.data.data) {
                                arrs.push(res.data.data[i])
                              }
                              this.setState({
                                areauserlist: arrs
                              });
                            }
                          });
                        });
                      }
                    });
                  });
                }
              });
            }
          });

        });

      } else {
        newData.push(this.state.areauserlist);
        this.setState({ areauserlist: newData, editingKey: '' });
      }
    });
  }

  //酒店管理员编辑
  saves(form, key, text) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.hoteluserlist];
      const index = newData.findIndex(item => key === item.key);
      console.log(newData[index])
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({
          hoteluserlist: newData, editingKey: '',
          adminname: newData[index].name,
          username: newData[index].username,
          phone: newData[index].phone,
          password: newData[index].password,
          mail: newData[index].mail,
        }, () => {
          puthoteluser([
            this.state.userid,
            this.state.adminname,
            this.state.phone,
            this.state.mail,
          ]).then(res => {
            if (res.data && res.data.message === 'success') {
              message.success("信息修改成功");
              userlist([
                4
              ]).then(res => {
                if (res.data && res.data.message === 'success') {
                  this.setState({
                    hoteluserlist: res.data.data,
                  });
                }
              });
            }
          });

        });

      } else {
        newData.push(this.state.areauserlist);
        this.setState({ areauserlist: newData, editingKey: '' });
      }
    });
  }


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

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }

  //打开区域弹框
  showModal = (text, index, record) => {
    console.log(record)
    this.setState({
      userid: record.id
    })
    getAdminAreas([
      record.id
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          menuvisible: true,
          checkedKeys: res.data.data
        })
      }
    });
  }


  //修改权限
  saveOk = () => {
    updateAdminAreas([
      this.state.userid,
      this.state.checkedKeys.join(','),
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('用户管辖区域修改成功')
        this.setState({
          menuvisible: false
        })
        userlist([1]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              userlist: res.data.data
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



  //删除用户
  onDelete = (text, record, index) => {
    this.setState({
      deletevisible: true,
      userid: record.id
    })
  }



  //删除用户
  deleteOk = (text, record, index) => {
    console.log(record)
    deleteuser([
      this.state.userid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("用户删除成功");
        const dataSource = [...this.state.areauserlist];
        this.setState({
          deletevisible: false,
          areauserlist: dataSource.filter(item => item.id !== this.state.userid),
        });

        const dataSources = [...this.state.hoteluserlist];
        this.setState({
          deletevisible: false,
          hoteluserlist: dataSources.filter(item => item.id !== this.state.userid),
        });

      } else {
        message.error(res.data.data)
      }
    });
  }


  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const typeOptions = this.state.hotllists.map(type => <Option key={type.id}>{type.value}</Option>);
    // const typeOption = this.state.typelist.map(type => <Option key={type.id}>{type.value}</Option>);

    this.nodeInfoTableColumns = [
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "姓名",
        dataIndex: "name",
        editable: true,
      },
      {
        title: "联系方式",
        dataIndex: "phone",
        editable: true,
        render: (text) => {
          return (
            <div>
              {text = text.substr(0, 4) + '****' + text.substr(-4)}
            </div>
          )
        }
      },
      {
        title: "邮箱",
        dataIndex: "mail",
        editable: true,
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
                {text = text.substr(0, 4) + '****' + text.substr(-4)}
              </div>
            )
          }

        }
      }
      ,
      {
        title: "创建时间",
        dataIndex: "gmtcreate"
      }
    ]



    this.areaColumns = [
      {
        title: "用户名",
        dataIndex: "username",
        editable: true,
      },
      {
        title: "姓名",
        dataIndex: "name",
        editable: true,
      },
      {
        title: "联系方式",
        dataIndex: "phone",
        editable: true,
        render: (text) => {
          return (
            <div>
              {text = text.substr(0, 4) + '****' + text.substr(-4)}
            </div>
          )
        }
      },
      {
        title: "邮箱",
        dataIndex: "mail",
        editable: true,
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
                {text = text.substr(0, 4) + '****' + text.substr(-4)}
              </div>
            )
          }

        }
      }
      ,
      // {
      //   title: "所属部门",
      //   dataIndex: "areaId",
      //   render: (text) => {
      //     if (text === null || text === "" || text === undefined) {
      //       return (
      //         <div>
      //           无
      //         </div>
      //       )
      //     } else {
      //       return (
      //         <div>
      //           {this.state.arealist[text]}
      //         </div>
      //       )
      //     }
      //   }
      // }

      {
        title: "管辖区域",
        dataIndex: "areaId",
        render: (text, record, index) => {
          return (
            <div>
              <span onClick={() => this.showModal(text, index, record)} style={{ color: 'blue', cursor: 'pointer' }}>
                查看
              </span>
            </div>
          );
        }
      }
      ,
      {
        title: "创建时间",
        dataIndex: "gmtcreate",
      }
      , {
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
              <span style={{ marginLeft: '20px' }} onClick={() => this.onDelete(text, record, index)}>
                <a><img src={require('./delete.png')} alt="" /></a>
              </span>
            </div>
          );
        }
      }
    ];



    this.hotelColumns = [
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "姓名",
        dataIndex: "name",
        editable: true,
      },
      {
        title: "联系方式",
        dataIndex: "phone",
        editable: true,
        render: (text) => {
          return (
            <div>
              {text = text.substr(0, 4) + '****' + text.substr(-4)}
            </div>
          )
        }
      },
      {
        title: "邮箱",
        dataIndex: "mail",
        editable: true,
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
                {text = text.substr(0, 4) + '****' + text.substr(-4)}
              </div>
            )
          }

        }
      }
      , {
        title: "所属酒店",
        dataIndex: "siteName",
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          if (text === null) {
            return (
              <div>
                {editable ? (
                  <Select value={this.state.sitelist[this.state.siteid]} onChange={this.hotelChange} style={{ width: '250px' }} placeholder="请选择所属酒店" >
                    {typeOptions}
                  </Select>
                ) : (
                    <span>无</span>
                  )
                }</div>
            )
          } else {
            return (
              <div>
                {editable ? (
                  <Select value={this.state.sitelist[this.state.siteid]} onChange={this.hotelChange} style={{ width: '250px' }} >
                    {typeOptions}
                  </Select>
                ) : (
                    <span>
                      {text}
                    </span>
                  )
                }
              </div>
            )
          }
        }
      },
      {
        title: "创建时间",
        dataIndex: "gmtcreate",
      }
      , {
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

                        onClick={() => this.saves(form, record.key, text)}
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
              <span style={{ marginLeft: '20px' }} onClick={() => this.onDelete(text, record, index)}>
                <a><img src={require('./delete.png')} alt="" /></a>
              </span>
            </div>
          );
        }
      },
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


    const areaColumns = this.areaColumns.map((col) => {
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

    const hotelColumns = this.hotelColumns.map((col) => {
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
          <Content style={{ margin: "16px 16px" }} id="user">
            <Card title="账号管理-用户管理" id="nodeManage" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary" onClick={this.setup}
                    style={{ marginRight: '20px', display: this.state.typenone }}
                  >
                    添加推送
                </Button>
                  <Button type="primary"
                    style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px', display: this.state.typenone }}
                  >
                    <Link to="/app/adduser">添加用户</Link>
                  </Button>
                </div>
              }
            >
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="超级管理员" key="1">
                  <div>
                    <Table
                      dataSource={this.state.userlist}
                      components={components}
                      columns={nodeInfoTableColumns}
                    // pagination={this.state.page}
                    />
                  </div>
                </TabPane>
                <TabPane tab="区域管理员" key="2" style={{ minHeight: "700px", marginLeft: '20px' }}>
                  <div>
                    <Table
                      dataSource={this.state.areauserlist}
                      components={components}
                      columns={areaColumns}
                    // pagination={this.state.page}
                    />
                  </div>
                </TabPane>
                <TabPane tab="酒店管理员" key="3" style={{ minHeight: "700px", marginLeft: '20px' }}>
                  <div>
                    <div>
                      &nbsp;&nbsp;&nbsp;设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                <Cascader
                        fieldNames={{ label: 'name', value: 'adcode' }}
                        options={this.state.deviceList}
                        onChange={this.addresschange}
                        value={this.state.addresslist}
                        changeOnSelect
                        style={{ width: "350px", marginRight: '20px', marginBottom: '20px' }}
                        placeholder="选择酒店" />
                      <Button type="primary" onClick={this.query}>查询</Button>
                      <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
                    </div>
                    <Table
                      dataSource={this.state.hoteluserlist}
                      components={components}
                      columns={hotelColumns}
                    // pagination={this.state.page}
                    />
                  </div>
                </TabPane>
              </Tabs>

            </Card>
          </Content>
          <Modal
            title="添加推送"
            width='700px'
            destroyOnClose
            visible={this.state.visible}
            centered
            footer={null}
            onCancel={this.handleCancel}
            mask={false}
          >
            <Transfer
              dataSource={this.state.mockData}
              listStyle={{
                width: 300,
                height: 300,
              }}
              targetKeys={this.state.targetKeys}
              onChange={this.handleChange}
              render={this.renderItem}
            />
          </Modal>
          <Modal
            title="删除用户"
            visible={this.state.deletevisible}
            onOk={this.deleteOk}
            width="400px"
            okText="删除"
            centered
            onCancel={this.handleCancel}
          >
            您确认要删除该用户吗？
          </Modal>
          <Modal
            title="选择管辖区域"
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
