import React from "react";
import {
  Table,
  Layout,
  Form,
  Card,
  Button,
  Input,
  Modal,
  message,
  InputNumber,
  DatePicker,
  Drawer,
  Row, Col,
  Icon,
  Upload, Radio,
  Tooltip,
} from "antd";
import {
  cleanerlist,
  sitelist,
  insertcleaner,
  getallRegion,
  putsite,
  deletesite,
  getsterilizer,
  bindQRcode,
  deletecleaner
} from "../axios";
import "./hotel.css";
import QRCode from 'qrcode-react';
import { Link } from 'react-router-dom';
import moment from "moment"
// import data from './demo.html';

const { Content } = Layout;
const { Search } = Input;
const { TextArea } = Input;
const html2canvas = require("html2canvas");

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
      selectedRowKeys: [],
    };


    this.cleanercolumn = [{
      title: '保洁员姓名',
      dataIndex: 'name',
    }, {
      title: '性别',
      dataIndex: 'phone',
      render: (text, record, index) => {
        return (
          <div>
            女
          </div>
        )
      }
    }, {
      title: '健康证',
      dataIndex: 'remark',
      render: (text, record, index) => {
        return (
          <div>
            <span onClick={() => this.openhealthcard(text, record, index)}>
              <a>查看</a>
            </span>
            <span onClick={() => this.openhealthcard(text, record, index)} style={{ marginLeft: '10px' }}>
              <a>替换</a>
            </span>
          </div>
        );
      }
    }, {
      title: '发证日期',
      dataIndex: 'issueDate',
      render: (text, record, index) => {
        return (
          <div>
            {moment(text).format('YYYY-MM-DD')}
          </div>
        );
      }
    }, {
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
                <a onClick={() => this.cancel(record.key, text)}>取消</a>
              </span>
            ) : (
                <a onClick={() => this.edit(text, record, index)}><img src={require('./edit.png')} alt="" /></a>
              )}
            <span style={{ marginLeft: '10px' }} onClick={() => this.clearnerdelete(text, record, index)}>
              <a><img src={require('./delete.png')} alt="" /></a>
            </span>
          </div>
        );
      }
    }]

    this.erweimacolumn = [{
      title: '所属酒店',
      dataIndex: 'siteName',
    }, {
      title: '所属消毒间',
      dataIndex: 'roomName',
      render: (text, record, index) => {
        if (text === undefined) {
          return (
            <div>
              所有
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
      title: '二维码类型',
      dataIndex: 'qrcodeTypeEnum',
      render: (text, record, index) => {
        if (text === "WORK") {
          return (
            <div>
              工作码
            </div>
          )
        } else {
          return (
            <div>
              信息码
            </div>
          )
        }
      }
    }, {
      title: '操作',
      dataIndex: 'remark',
      render: (text, record, index) => {
        return (
          <div>
            <span onClick={() => this.openerweimacard(text, record, index)}>
              <a>查看</a>
            </span>
          </div>
        );
      }
    }]



    this.roomcolumn = [{
      title: '所属消毒间',
      dataIndex: 'roomName',
    }, {
      title: '消毒柜品牌',
      dataIndex: 'brand',
    }, {
      title: '型号',
      dataIndex: 'model',
    }, {
      title: '功率',
      dataIndex: 'power',
    }, {
      title: '容量',
      dataIndex: 'capacity',
    }, {
      title: '额定时间',
      dataIndex: 'standartTime',
    }, {
      title: '图片',
      dataIndex: 'id',
      render: (text, record, index) => {
        return (
          <div>
            <span onClick={() => this.openphoto(text, record, index)}>
              <a>查看</a>
            </span>
          </div>
        );
      }
    }, {
      title: '创建时间',
      dataIndex: 'gmtcreate',
    }
      // , {
      //   title: '操作',
      //   dataIndex: 'remark',
      //   render: (text, record, index) => {
      //     return (
      //       <div>
      //         <span onClick={() => this.deleteroom(text, record, index)}>
      //           <a>删除</a>
      //         </span>
      //       </div>
      //     );
      //   }
      // }
    ]





    this.nodeInfoTableColumns = [
      {
        title: "酒店名称",
        dataIndex: "sitename",
        editable: true,
        render: (text, record, index) => {
          return (
            <div onClick={() => this.toroom(text, record, index)} style={{ cursor: 'pointer' }}>
              {text}
            </div>
          )
        }
      },
      {
        title: "负责人姓名",
        dataIndex: "adminName",
        editable: true,
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
        title: "联系电话",
        dataIndex: "phone",
        editable: true,
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
        title: "保洁员数量",
        dataIndex: "cleanerQuantity",
        render: (text, record, index) => {
          if (text === null) {
            return (
              <div>
                无
              </div>
            )
          } else {
            return (
              <div onClick={() => this.opencleanerlist(text, record, index)} style={{ color: '#1890ff', cursor: 'pointer' }}>
                {text}
              </div>
            )
          }
        }
      },
      {
        title: "设备数量",
        dataIndex: "deviceQuantity",
        render: (text, record, index) => {
          return (
            <div>
              <Tooltip title={"插座数量：" + record.boardQuantity + "个  ~ 摄像头数量：" + record.cameraQuantity + "个"}>
                <span style={{ color: '#1890ff' }}>{record.boardQuantity + record.cameraQuantity} </span>
              </Tooltip>
            </div>
          )
        }
      },
      {
        title: "卫生许可证",
        dataIndex: "borard",
        render: (text, record, index) => {
          return (
            <div onClick={() => this.openlicence(text, record, index)} style={{ color: '#1890ff', cursor: 'pointer' }}>
              查看
            </div>
          )
        }
      },
      {
        title: "消毒间数量",
        dataIndex: "roomQuantity",
        render: (text, record, index) => {
          return (
            <div onClick={() => this.openroomlist(text, record, index)} style={{ color: '#1890ff', cursor: 'pointer' }}>
              查看
            </div>
          )
        }
      },
      {
        title: "二维码",
        dataIndex: "roomQuantity",
        render: (text, record, index) => {
          return (
            <div onClick={() => this.lookerweima(text, record, index)} style={{ color: '#1890ff', cursor: 'pointer' }}>
              查看
            </div>
          )
        }
      },
      {
        title: "杯具管理功能",
        dataIndex: "ifHasCup",
        render: (text, record, index) => {
          if (text === true) {
            return (
              <div>
                有
              </div>
            )
          } else {
            return (
              <div>
                无
              </div>
            )
          }
        }
        // render: (text, record, index) => {
        //   return (
        //     <div >
        //       <Switch
        //         checked={text}
        //         checkedChildren="有" unCheckedChildren="无"
        //       // onChange={() => this.switchchange(text, record, index)}
        //       />
        //     </div>
        //   )
        // }
      },

      {
        title: "详细地址",
        dataIndex: "address",
        render: (text, record, index) => {
          return (
            <div>
              {text}
            </div>
          )
        }
      },
      {
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


  }

  componentWillMount() {
    document.title = "单位管理";
  }

  componentDidMount() {
    document.title = "单位管理";
    if (localStorage.getItem("type") === "2" || localStorage.getItem("type") === "3") {
      this.setState({
        typenone: 'none'
      })
    }
    sitelist([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          sitelist: res.data.data,
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
      "330000"
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          deviceList: res.data.data
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
      deletevisible: false,
      licencevisible: false,
      xukevisible: false,
      healthvisible: false,
      erweimavisible: false,
      previewVisible: false,
      erweimamodels: false,
      workvisible: false,
      xiaoduvisible: false,
    })
  }


  //添加保洁员
  handleOk = () => {
    if (!this.state.fzimg) {
      message.error('请上传健康证')
    } else if (!this.state.certificatecode) {
      message.error('请输入健康证编号')
    } else if (!this.state.cleanername) {
      message.error('请输入保洁员姓名')
    } else if (!this.state.sex) {
      message.error('请选择保洁员性别')
    } else if (!this.state.cleanerphone) {
      message.error('请输入保洁员电话')
    } else if (!this.state.issueDate) {
      message.error('请选择发证日期')
    } else {
      insertcleaner([
        this.state.siteid,
        this.state.fzimg,
        this.state.certificatecode,
        this.state.cleanername,
        this.state.sex,
        this.state.cleanerphone,
        this.state.issueDate,
        this.state.remark,
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
  }

  //编辑

  isEditing = (record) => {
    return record.id === this.state.editingKey
  };
  edit(text, record, index) {
    console.log(record)
    this.setState({
      editingKey: record.id,
      editingid: record.id,
      sitename: record.sitename,
      address: record.address,
      adminName: record.adminName,
      phone: record.phone,
    }, function () {
      console.log(this)
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };


  //打开删除保洁员弹窗
  clearnerdelete = (text, record, index) => {
    this.setState({
      deleteclear: true,
      cleanerId: text
    })
  }


  save(form, key, text) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.sitelist];
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
          sitelist: newData, editingKey: '',
          phone: newData[index].phone,
          adminName: newData[index].adminName,
          sitename: newData[index].sitename
        }, () => {
          putsite([
            this.state.sitename,
            this.state.adminName,
            this.state.phone,
            this.state.editingid,
          ]).then(res => {
            if (res.data && res.data.message === 'success') {
              message.success("信息修改成功");
              sitelist([

              ]).then(res => {
                if (res.data && res.data.message === 'success') {
                  this.setState({
                    sitelist: res.data.data,
                  });
                }
              });
            }
          });

        });

      } else {
        newData.push(this.state.userlist);
        this.setState({ userlist: newData, editingKey: '' });
      }
    });
  }
  //区域地址
  addresschange = (e) => {
    console.log(e)
    this.setState({
      addresschange: e.target.value
    })
    // this.setState({
    //   provinceId: e[0] === undefined ? null : e[0],
    //   cityId: e[1] === undefined ? null : e[1],
    //   districtId: e[2] === undefined ? null : e[2],
    // })
  }

  //区域联系人电话
  telphone = (e) => {
    this.setState({
      telphone: e.target.value
    })
  }

  //打开删除单位弹窗
  onDelete = (text, record, index) => {
    this.setState({
      deletevisible: true,
      hotelid: record.id
    })
  }

  //删除单位
  deleteOk = (text, record, index) => {
    console.log(record)
    deletesite([
      this.state.hotelid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("单位删除成功");
        const dataSource = [...this.state.sitelist];
        this.setState({
          deletevisible: false,
          sitelist: dataSource.filter(item => item.id !== this.state.hotelid),
        });
      } else {
        message.error(res.data.data)
      }
    });
  }

  //房间跳转
  toroom = (text, record, index) => {
    console.log(record)
    localStorage.setItem('hotelid', record.id)
    localStorage.setItem('hotelname', record.sitename)
    window.location.href = "/app/houseroom";
  }

  //搜索
  onsearch = () => {
    console.log(111)
    sitelist([
      this.state.searchname
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          sitelist: res.data.data
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

  //打开许可证
  openlicence = (text, record, index) => {
    this.setState({
      licencevisible: true,
      xukeimg: record.license
    })
  }

  // //打开健康证
  // openhealthcard = () => {
  //   this.setState({
  //     xukevisible: true,
  //   })
  // }

  //打开保洁员管理抽屉
  opencleanerlist = (text, record, index) => {
    this.setState({
      siteid: record.id,
    })
    cleanerlist([
      record.id
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          cleanerdata: res.data.data,
          cleanervisible: true,
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

  //关闭抽屉
  onClose = (e) => {
    this.setState({
      cleanervisible: false,
      openerweima: false,
      roomvisible: false,
    });
  }

  //打开添加保洁员弹窗
  addclearner = () => {
    this.setState({
      visible: true
    })
  }

  openhealthcard = (text, record, index) => {
    this.setState({
      healthvisible: true,
      certificate: record.certificate,
    })
  }

  //打开二维码弹窗
  lookerweima = (text, record, index) => {
    // this.createerweimas()
    bindQRcode([
      record.id,
      null,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        for (var i in res.data.data) {
          res.data.data[i].key = res.data.data[i].id
        }
        this.setState({
          erweimadata: res.data.data,
          openerweima: true,
        }, function () {
          if (res.data.data.length < 10) {
            this.setState({
              erweimapage: false
            })
          } else {
            this.setState({
              erweimapage: true
            })
          }
        });
      } 
    });
  }

  //下载二维码
  saveFile = (data, filename) => {
    var save_link = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "a"
    );
    save_link.href = data;
    save_link.download = filename;

    var event = document.createEvent("MouseEvents");
    event.initMouseEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    save_link.dispatchEvent(event);
  };

  fixType = type => {
    type = type.toLowerCase().replace(/jpg/i, "jpeg");
    var r = type.match(/png|jpeg|bmp|gif/)[0];
    return "image/" + r;
  };
  getQrImage = box => {
    const that = this;
    html2canvas(document.getElementById(box)).then(function (canvas) {
      var imgData = canvas.toDataURL();
      imgData = imgData.replace(that.fixType("jpg"), "image/octet-stream");
      var filename = "二维码.jpg";
      that.saveFile(imgData, filename);
    });
  };



  //打开消毒间列表
  openroomlist = (text, record, index) => {
    getsterilizer([
      record.id
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          roomvisible: true,
          roomdata: res.data.data
        })
      } else {
        message.error('暂无数据')
      }
    });

  }


  //上传图片
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      message.success('上传成功')
      this.setState({
        fzimg: info.file.response.data
      })
      return;
    }
  };






  //性别选择
  sexonChange = (e) => {
    console.log(e.target.value)
    this.setState({
      sex: e.target.value
    })
  }

  //健康证编号
  certificatecode = (e) => {
    this.setState({
      certificatecode: e.target.value
    })
  }


  //保洁员姓名
  cleanername = (e) => {
    this.setState({
      cleanername: e.target.value
    })
  }


  //备注填写
  remarkchange = (e) => {
    this.setState({
      remark: e.target.value
    })
  }

  //保洁员手机
  cleanerphone = (e) => {
    this.setState({
      cleanerphone: e.target.value
    })
  }

  //发证时间填写
  fzdate = (e, b) => {
    this.setState({
      issueDate: b
    })
  }





  //搜索信息录入
  searchname = (e) => {
    this.setState({
      searchname: e.target.value
    })
  }

  //勾选列表
  onSelectChange = (selectedRowKeys, b) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys, b);
    this.setState({
      selectedRowKeys,
      selectlist: b
    });
  };


  //打开选中二维码
  blurs = () => {
    console.log(this.state.selectlist)
    if (this.state.selectlist === undefined || this.state.selectlist.length === 0) {
      message.error('请勾选要生成的二维码编号')
    } else {
      const erweimalist = this.state.selectlist.map((item, i) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <div className="custom-image">
              <QRCode
                value={'http://provdisinfection.terabits.cn/mobilelogin?deviceid?=' + item.code}
                size="200"
              />
            </div>
            <div className="custom-card">
              <h3 style={{ textAlign: "center", fontWeight: "700" }}>
                设备编号  {parseInt(item.id, 10) > 9 ? "0000" + item.id : "00000" + item.id}
              </h3>
              <h3 style={{ textAlign: "center", fontWeight: "700" }}>
                所属消毒间 {item.roomName === undefined ? "所有" : item.roomName}
              </h3>
              <h3 style={{ textAlign: "center", fontWeight: "700" }}>
                二维码类型 {item.qrcodeTypeEnum === "WORK" ? "工作码" : "信息码"}
              </h3>
            </div>
          </div>
        );
      });
      this.setState({ erweimamodels: true, erweimalist });
    }
  }


  //查看二维码
  openerweimacard = (text, record, index) => {
    console.log(record)
    this.setState({
      cardid: record.id,
      roomname: record.roomName,
      workvisible: true,
      erweimacode: record.code,
      qrcodeTypeEnum: record.qrcodeTypeEnum,
    })
  }

  //查看消毒柜图片
  openphoto = (text, record, index) => {
    console.log(record)
    this.setState({
      xiaoduvisible: true,
      photo: record.photo,
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
        sitelist([

        ]).then(res => {
          if (res.data && res.data.message === "success") {
            this.setState({
              sitelist: res.data.data
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


  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

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

    const imgheader = {
      authorization: localStorage.getItem('authorization')
    }


    const cleanercolumn = this.cleanercolumn.map((col) => {
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

    const erweimacolumn = this.erweimacolumn.map((col) => {
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

    const roomcolumn = this.roomcolumn.map((col) => {
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
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="hotel">
            <Card title="网点管理-单位管理" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary" style={{ background: '#2c94f4', border: '1px solid #2c94f4', marginLeft: '20px', display: this.state.typenone }}  >
                    <Link to="/app/addhotel">添加单位</Link>
                  </Button>
                  {/* <Button type="primary" style={{ background: '#2c94f4', border: '1px solid #2c94f4', marginLeft: '20px', display: this.state.typenone }}  >
                    <Link to="/app/addhotel">添加消毒柜</Link>
                  </Button> */}
                </div>}>
              <div>
                <Search placeholder="搜索单位名称" onSearch={this.onsearch}
                  onChange={this.searchname}
                  value={this.state.searchname}
                  enterButton style={{ marginBottom: '10px', width: '300px' }}

                />
                <Table
                  dataSource={this.state.sitelist}
                  columns={nodeInfoTableColumns}
                  pagination={this.state.page}
                  components={components}
                />
              </div>
            </Card>
          </Content>
          <Modal
            title="删除单位"
            visible={this.state.deletevisible}
            onOk={this.deleteOk}
            width="400px"
            okText="删除"
            centered
            onCancel={this.handleCancel}
          >
            您确认要删除该单位吗？
          </Modal>

          <Modal
            title="卫生许可证"
            visible={this.state.licencevisible}
            // onOk={this.deleteOk}
            width="400px"
            // okText="删除"
            centered
            footer={null}
            onCancel={this.handleCancel}
          >


            <img src="http://home.terabits.cn/59b6362c7510266ded40740d0a33923.png" alt="" style={{ width: '100%' }} />
            {/* <img src={this.state.xukeimg} alt="" style={{ width: '100%' }} /> */}
          </Modal>

          <Modal
            title="消毒柜图片"
            visible={this.state.xiaoduvisible}
            // onOk={this.deleteOk}
            width="400px"
            // okText="删除"
            centered
            footer={null}
            onCancel={this.handleCancel}
          >
            <img src={this.state.photo} alt="" style={{ width: '100%' }} />
          </Modal>

          <Modal
            title="健康证"
            visible={this.state.healthvisible}
            // onOk={this.deleteOk}
            width="400px"
            // okText="删除"
            centered
            footer={null}
            onCancel={this.handleCancel}
          >
            <img src={this.state.certificate} alt="" style={{ width: '100%' }} />
          </Modal>
          <Modal
            title="二维码图片"
            visible={this.state.erweimamodels}
            onCancel={this.handleCancel}
            footer={null}
            okText="导出图片"
            className="qrCodeModal"
            width="400px"
          >
            <Row>
              <Col lg={24} xs={24} id="webBox" style={{ marginBottom: '20px' }}>
                {this.state.erweimalist}
              </Col>
              <div
                id="QRBox"
                style={{ marginTop: "20px", textAlign: 'center' }}
              >
                <Button type="primary" onClick={() => this.getQrImage("webBox")}>
                  导出水表二维码
                </Button>
              </div>
            </Row>
          </Modal>
          <Modal
            title="工作码展示"
            visible={this.state.workvisible}
            footer={null}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            className="qrCodeModal"
            width="300px"
            centered
          >
            <div>
              <Row>
                <Col lg={24} xs={24} id="webBox" style={{ textAlign: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div className="custom-image">
                      <QRCode
                        value={'http://provdisinfection.terabits.cn/mobilelogin?deviceid?=' + this.state.erweimacode}
                        size="200"
                      />
                    </div>
                    <div className="custom-card">
                      <p style={{ textAlign: "center", fontWeight: "700" }}>
                        设备编号：{parseInt(this.state.cardid, 10) > 9 ? "0000" + this.state.cardid : "00000" + this.state.cardid}
                      </p>
                      <p style={{ textAlign: "center", fontWeight: "700" }}>
                        所属消毒间：{this.state.roomname === undefined ? "所有" : this.state.roomname}
                      </p>
                      <p style={{ textAlign: "center", fontWeight: "700" }}>
                        二维码类型：{this.state.qrcodeTypeEnum === "WORK" ? "工作码" : "信息码"}
                      </p>
                    </div>

                  </div>
                </Col>
              </Row>
              <div
                id="QRBox"
                style={{ textAlign: 'center' }}
              >
                <Button type="primary" onClick={() => this.getQrImage("webBox")}>
                  导出工作码
                </Button>
              </div>
            </div>
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
                components={components}
                bordered
              />
            </div>
          </Drawer>

          <Drawer
            title="二维码管理"
            width={600}
            onClose={this.onClose}
            visible={this.state.openerweima}
          >
            <div style={{ width: '100%' }}>
              <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <Button type="primary" style={{ background: '#2c94f4', border: '1px solid #2c94f4' }} onClick={this.blurs} >
                  导出二维码
                </Button>
              </div>
              < Table
                dataSource={this.state.erweimadata}
                columns={erweimacolumn}
                components={components}
                rowSelection={rowSelection}
                bordered
              />
            </div>
          </Drawer>

          <Drawer
            title="消毒柜管理"
            width={750}
            onClose={this.onClose}
            visible={this.state.roomvisible}
          >
            <div style={{ width: '100%' }}>
              < Table
                dataSource={this.state.roomdata}
                columns={roomcolumn}
                components={components}
                bordered
              />
            </div>
          </Drawer>
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
          <Modal
            title="添加保洁员"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="添加"
            destroyOnClose
            width="350px"
            centered
          >
            <div>
              <div style={{ display: this.state.twoadd }}>
                <span>  <span style={{ color: 'red' }}>*</span>  上传健康证：</span> <br />
                <div style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}>
                  <Upload
                    action='http://iva.terabits.cn:9090/upload/file'
                    onChange={this.handleChange}
                    beforeUpload={this.beforeUpload}
                    headers={imgheader}
                    // onPreview={this.handlePreview}
                    name="multipartFile"
                  >
                    <Button>
                      <Icon type="upload" /> 上传健康证(只能上传一张图片)
                </Button>
                  </Upload>
                </div>
                <span>  <span style={{ color: 'red' }}>*</span>  健康证编号：</span>
                <Input placeholder="请输入健康证编号"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.certificatecode}
                  value={this.state.certificatecode}
                />
                <span>  <span style={{ color: 'red' }}>*</span>  保洁员姓名：</span>
                <Input placeholder="请输入保洁员姓名"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.cleanername}
                  value={this.state.cleanername}
                />
                <div style={{ width: '100%', marginBottom: "10px" }}>
                  <span style={{ marginRight: '20px' }}> <span style={{ color: 'red' }}>*</span>  性别：</span>
                  <Radio.Group onChange={this.sexonChange} value={this.state.sex}>
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                  </Radio.Group>
                </div>
                <span> <span style={{ color: 'red' }}>*</span>  保洁员手机号：</span>
                <Input placeholder="请输入保洁员手机号"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  autoComplete="off"
                  onChange={this.cleanerphone}
                  value={this.state.cleanerphone}
                />

                <span> <span style={{ color: 'red' }}>*</span>  发证时间：</span>
                <DatePicker placeholder="请选择发证时间"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  onChange={this.fzdate}
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
            title="二维码展示"
            visible={this.state.erweimavisible}
            onCancel={this.handleCancel}
            okText="确认"
            destroyOnClose
            className="qrCodeModal"
            width="300px"
            centered
          >
            <div>
              <Row>
                <Col lg={24} xs={24} id="webBox" style={{ marginTop: '20px', textAlign: 'center' }}>
                  {this.state.webContents}
                </Col>
              </Row>
              <div
                id="QRBox"
                style={{ marginTop: "20px", textAlign: 'center' }}
              >
                <Button type="primary" onClick={() => this.getQrImage("webBox")}>
                  导出工作码
                </Button>
              </div>
            </div>
          </Modal>
        </Layout>
      </Layout >
    );
  }
}

export default App;
