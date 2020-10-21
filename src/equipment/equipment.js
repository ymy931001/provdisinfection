import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Input,
  Modal,
  message,
  Cascader,
  Select,
  Drawer,
  Tree,
  Tabs,
  Radio
} from "antd";
import {
  devicelist,
  hotellist,
  getroomdevice,
  getregion,
  getonlinestatus,
  getbasetype,
  isclist,
  iscarea,
  iscdevice,
  addcamera,
  getbackUrl,
  roomlist,
  deletecamera,
  addhandheld,
  geisctUrl
} from "../axios";
import "./equipment.css";
import moment from 'moment';

const { Content } = Layout;
const Option = Select.Option;
const { DirectoryTree } = Tree;
const { TabPane } = Tabs;
const { Search } = Input;
const { TextArea } = Input;




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      sitelist: [],
      AutoCompletedata: [],
      macedata: [],
      typenone: 'inline-block',
      typecolor: '#40a9ff',
      oneadd: 'none',
      iscdis: 'none',
      twoadd: 'none',
      threeadd: 'none',
      cameralist: [],
      roomlist: [],
      iscoption: [],
      addnum: 1,
      disthree: 'none',
      disone: 'none',
      distwo: 'none',
      disfour: 'none',
      iscplatformid: '',
      disfive: 'none',
      iscplatformdis: 'none',
      roomshow: 'none',
      treeData: [],
      type: null,
      serial: null,
      stream: null,
      deviceIp: null,
      port: null,
      account: null,
      password: null,
      roomId: null,
      iscplatform: [],
      tabvalue: '1',
      onlines: [{
        title: '序列号',
        dataIndex: 'serial',
      }, {
        title: '状态',
        dataIndex: 'status',
        render: (text, record, index) => {
          if (text === true) {
            return (
              <div>
                <a onClick={() => this.showonline(text, record, index)} style={{ color: 'green' }}
                >在线</a>
              </div>
            )
          }
          if (text === false) {
            return (
              <div>
                <a onClick={() => this.showonline(text, record, index)} style={{ color: 'red' }}
                >离线</a>
              </div>
            )
          }
        }
      }, {
        title: '时间',
        dataIndex: 'date',
      }],
    };


    this.isclistcolumns = [

      {
        title: "摄像头名称",
        dataIndex: "cameraName",
        key: 'cameraName',
      }, {
        title: "摄像头类型",
        dataIndex: "cameraTypeName",
        key: 'cameraTypeName',
      }, {
        title: "IndexCode",
        dataIndex: "cameraIndexCode",
        key: 'cameraIndexCode',
      }, {
        title: "创建时间",
        dataIndex: "createTime",
        key: 'createTime',
        render: (text, record, index) => {
          return (
            <div>
              {moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          )
        }
      },
    ];



    this.handleColumns = [
      {
        title: "设备ID",
        dataIndex: "id",
        key: 'roomName',
      }, {
        title: "单位名称",
        dataIndex: "siteName",
        key: 'siteName',
      },
      {
        title: "联网状态",
        dataIndex: "onlinestatus",
        key: 'onlinestatus',
        render: (text, record, index) => {
          if (text === true) {
            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a onClick={() => this.showonline(text, record, index)} style={{ color: '#08c04d' }}
                > <span className="circle"></span> 在线</a>
              </div>
            )
          }
          if (text === false) {
            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a onClick={() => this.showonline(text, record, index)} style={{ color: '#e72e2e' }}
                ><span className="circle1"></span> 离线</a>
              </div>
            )
          }
        }
      }, {
        title: "实时画面",
        dataIndex: "streams",
        key: 'streams',
        render: (text, record, index) => {
          if (record.onlinestatus === true) {
            return (
              <div onClick={() => this.findvideo(text, record, index)} style={{ color: '#40a9ff', cursor: 'pointer' }} >
                查看
              </div>
            )
          } else {
            return (
              <div style={{ color: '#40a9ff', cursor: 'pointer' }} >
                暂无
              </div>
            )
          }
        }
      },
      {
        title: "添加时间",
        dataIndex: "gmtcreate",
        key: 'gmtcreate',
      }, {
        title: "备注",
        dataIndex: "remark",
        key: 'remark',
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => {
          // const editable = this.isEditing(record);
          return (
            <div>
              <span style={{ marginLeft: '20px' }} onClick={() => this.onDelete(text, record, index)}>
                <a><img src={require('./delete.png')} alt="" /></a>
              </span>
            </div>
          );
        }
      }
    ];

    if (localStorage.getItem("type") === "2" || localStorage.getItem("type") === "3") {
      this.nodeInfoTableColumns = [
        {
          title: "设备ID",
          dataIndex: "id",
          key: 'roomName',
        }, {
          title: "单位名称",
          dataIndex: "siteName",
          key: 'siteName',
        }, {
          title: "设备位置",
          dataIndex: "roomName",
          key: 'roomName',
        },
        {
          title: "联网状态",
          dataIndex: "onlinestatus",
          key: 'onlinestatus',
          render: (text, record, index) => {
            if (text === true) {
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <a onClick={() => this.showonline(text, record, index)} style={{ color: '#08c04d' }}
                  > <span className="circle"></span> 在线</a>
                </div>
              )
            }
            if (text === false) {
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <a onClick={() => this.showonline(text, record, index)} style={{ color: '#e72e2e' }}
                  ><span className="circle1"></span> 离线</a>
                </div>
              )
            }
          }
        }, {
          title: "实时画面",
          dataIndex: "streams",
          key: 'streams',
          render: (text, record, index) => {
            if (record.onlinestatus === true) {
              return (
                <div onClick={() => this.findvideo(text, record, index)} style={{ color: '#40a9ff', cursor: 'pointer' }} >
                  查看
                </div>
              )
            } else {
              return (
                <div style={{ color: '#40a9ff', cursor: 'pointer' }} >
                  暂无
                </div>
              )
            }
          }
        },
        {
          title: "添加时间",
          dataIndex: "gmtcreate",
          key: 'gmtcreate',
        }
      ];
    } else {
      this.nodeInfoTableColumns = [
        {
          title: "设备ID",
          dataIndex: "id",
          key: 'roomName',
        }, {
          title: "单位名称",
          dataIndex: "siteName",
          key: 'siteName',
        }, {
          title: "设备位置",
          dataIndex: "roomName",
          key: 'roomName',
        },
        {
          title: "联网状态",
          dataIndex: "onlinestatus",
          key: 'onlinestatus',
          render: (text, record, index) => {
            if (text === true) {
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <a onClick={() => this.showonline(text, record, index)} style={{ color: '#08c04d' }}
                  > <span className="circle"></span> 在线</a>
                </div>
              )
            }
            if (text === false) {
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <a onClick={() => this.showonline(text, record, index)} style={{ color: '#e72e2e' }}
                  ><span className="circle1"></span> 离线</a>
                </div>
              )
            }
          }
        }, {
          title: "实时画面",
          dataIndex: "streams",
          key: 'streams',
          render: (text, record, index) => {
            if (record.onlinestatus === true) {
              return (
                <div onClick={() => this.findvideo(text, record, index)} style={{ color: '#40a9ff', cursor: 'pointer' }} >
                  查看
                </div>
              )
            } else {
              return (
                <div style={{ color: '#40a9ff', cursor: 'pointer' }} >
                  暂无
                </div>
              )
            }
          }
        }
        , {
          title: "参数设置",
          dataIndex: "cover",
          key: 'roomId',
          render: (text, record, index) => {
            return (
              <div style={{ color: this.state.typecolor, cursor: 'pointer' }} onClick={() => this.parameter(text, record, index)}>
                <span>查看</span>
              </div>
            )
          }
        },
        //  {
        //   title: "插座绑定",
        //   dataIndex: "id",
        //   render: (text, record, index) => {
        //     return (
        //       <div onClick={() => this.socket(text, record, index)} style={{ color: this.state.typecolor, cursor: 'pointer' }} >
        //         添加
        //       </div>
        //     )
        //   }
        // },
        {
          title: "添加时间",
          dataIndex: "gmtcreate",
          key: 'gmtcreate',
        },
        {
          title: '操作',
          dataIndex: 'id',
          key: 'id',
          render: (text, record, index) => {
            // const editable = this.isEditing(record);
            return (
              <div>
                {/* {editable ? (
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
                  )} */}
                {/* <span style={{ marginLeft: '20px' }} onClick={() => this.onDelete(text, record, index)}>
                  <a><img src={require('./edit.png')} alt="" /></a>
                </span> */}
                <span style={{ marginLeft: '20px' }} onClick={() => this.onDelete(text, record, index)}>
                  <a><img src={require('./delete.png')} alt="" /></a>
                </span>
              </div>
            );
          }
        }
      ];
    }


  }

  componentWillMount() {
    document.title = "摄像头管理";
  }

  componentDidMount() {


    if (localStorage.getItem("type") === "2" || localStorage.getItem("type") === "3") {
      this.setState({
        typenone: 'none',
        typecolor: '#999'
      })
    }

    isclist([
    ]).then(res => {
      if (res.data && res.data.code === 0) {
        console.log(77777)
        var arr = []
        for (var i in res.data.data) {
          arr.push({
            'id': i,
            "value": res.data.data[i]
          })
        }
        this.setState({
          iscplatform: arr
        })
        console.log(arr)
        // this.setState({
        //   boardlist: JSON.parse(res.data.data)
        // })
      }
    });




    getbasetype([
      "camera"
    ]).then(res => {
      console.log(JSON.stringify(res.data))
      if (res.data && res.data.message === "success") {
        this.setState({
          cameralist: JSON.parse(res.data.data)
        })
      }
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



    if (localStorage.getItem("roomid") != undefined) {   //eslint-disable-line
      getroomdevice([
        localStorage.getItem('roomid'),
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          localStorage.removeItem('roomid')
          var arr = []
          var arrs = []
          if (res.data.data.mode === 0) {
            arr.push(res.data.data)
          }
          if (res.data.data.mode === 1) {
            arrs.push(res.data.data)
          }
          this.setState({
            videoListDataSource: arr,
            addhandheldSource: arrs,
          }, function () {
            if (arr.length < 10) {
              this.setState({
                page: false
              })
            } else {
              this.setState({
                page: true
              })
            }

            if (arrs.length < 10) {
              this.setState({
                handlepage: false
              })
            } else {
              this.setState({
                handlepage: true
              })
            }
          });
        }
      });
    } else {
      this.device()
    }




    // devicelist([
    //   localStorage.getItem('eqsiteid'),
    //   localStorage.getItem('eqname'),
    //   localStorage.getItem('roomid'),
    // ]).then(res => {
    //   if (res.data && res.data.message === "success") {
    //     localStorage.removeItem('roomid')
    //     var arr = []
    //     var arrs = []
    //     for (var i in res.data.data) {
    //       if (res.data.data[i].mode === 0) {
    //         arr.push(res.data.data[i])
    //       }
    //       if (res.data.data[i].mode === 1) {
    //         arrs.push(res.data.data[i])
    //       }
    //     }

    //     this.setState({
    //       videoListDataSource: arr,
    //       addhandheldSource: arrs,
    //     }, function () {
    //       if (arr.length < 10) {
    //         this.setState({
    //           page: false
    //         })
    //       } else {
    //         this.setState({
    //           page: true
    //         })
    //       }

    //       if (arrs.length < 10) {
    //         this.setState({
    //           handlepage: false
    //         })
    //       } else {
    //         this.setState({
    //           handlepage: true
    //         })
    //       }
    //     });
    //   }
    // });




    var arr = []
    hotellist().then(res => {
      console.log(res.data)
      for (var i in res.data.data) {
        arr.push({
          'id': i,
          'value': res.data.data[i]
        })
      }
      this.setState({
        sitelist: arr
      });
    });
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  //网点选择
  handleChanges = (value, b) => {
    console.log(value, b.props.children);
    this.setState({
      siteid: value,
    }, function () {
      roomlist([
        this.state.siteid
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          var arr = []
          for (var i in res.data.data) {
            arr.push({
              'id': res.data.data[i].id,
              'name': res.data.data[i].name,
            })
          }
          this.setState({
            roomlist: arr
          })
        }
      });
    })
  }


  //网点选择
  handleChange = (value, b) => {
    this.setState({
      siteid: value,
    })
  }

  //设备类型选择
  typeChanges = (value) => {
    console.log(value)
    this.setState({
      equtype: value
    }, function () {
      if (this.state.equtype === "IPC") {
        this.setState({
          disone: 'block',
          disfive: 'none'
        })
      }
      if (this.state.equtype === "NVR") {
        this.setState({
          disfive: 'block',
          disone: 'block'
        })
      }
    })
  }


  //删除摄像头
  deleteOk = (text, record, index) => {
    console.log(this.state.camertid)
    deletecamera([
      this.state.camertid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("删除摄像头成功");
        this.setState({
          deletevisible: false,
        })
        this.device()
        // const dataSource = [...this.state.videoListDataSource];
        // this.setState({
        //   deletevisible: false,
        //   videoListDataSource: dataSource.filter(item => item.id !== this.state.camertid),
        // });

      } else {
        message.error(res.data.data)
      }
    });
  }


  //房间选择
  roomchange = (value) => {
    console.log(value)
    this.setState({
      roomId: value
    })
  }

  //链接方式选择
  typechange = (value) => {
    console.log(value);
    this.setState({
      types: value
    }, function () {
      console.log(this.state.types)
      if (this.state.types === '1' || this.state.types === '3' || this.state.types === '6') {
        if (this.state.types === '3') {
          this.setState({
            disone: 'block',
            distwo: 'none',
            disthree: 'none',
            disfour: 'none',
            disfive: 'none',
            iscplatformdis: 'block',
            equtype: undefined,
          })
        } else {
          this.setState({
            disone: 'block',
            distwo: 'none',
            disthree: 'none',
            disfour: 'none',
            disfive: 'none',
            iscplatformdis: 'none',
            equtype: undefined
          })
        }
      }
      if (this.state.types === '2' || this.state.types === '4') {
        this.setState({
          disone: 'block',
          distwo: 'block',
          disthree: 'none',
          disfive: 'none',
          disfour: 'none',
          iscplatformdis: 'none',
          equtype: undefined
        })
      }
      if (this.state.types === '5') {
        this.setState({
          disone: 'none',
          distwo: 'none',
          disthree: 'block',
          disfive: 'none',
          iscplatformdis: 'none',
          disfour: 'none',
          equtype: undefined
        })
      }
      if (this.state.types === '7') {
        this.setState({
          disone: 'none',
          distwo: 'none',
          iscplatformdis: 'none',
          disthree: 'none',
          disfive: 'none',
          disfour: 'block',
          equtype: undefined
        })
      }
    })
  }

  device = () => {
    devicelist([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var arr = []
        var arrs = []
        for (var i in res.data.data) {
          if (res.data.data[i].mode === 0) {
            arr.push(res.data.data[i])
          }
          if (res.data.data[i].mode === 1) {
            arrs.push(res.data.data[i])
          }
        }

        this.setState({
          videoListDataSource: arr,
          addhandheldSource: arrs,
        }, function () {
          if (arr.length < 10) {
            this.setState({
              page: false
            })
          } else {
            this.setState({
              page: true
            })
          }

          if (arrs.length < 10) {
            this.setState({
              handlepage: false
            })
          } else {
            this.setState({
              handlepage: true
            })
          }
        });
      }
    });
  }


  handleOk = () => {
    if (this.state.cameratype === null || this.state.cameratype === undefined || this.state.cameratype === "") {
      message.error('请选择摄像头类型')
    } else {
      if (this.state.cameratype === 1) {
        addcamera([
          this.state.roomId,
          this.state.iscplatformid,
          this.state.indexCode,
          this.state.cameraname,
          this.state.siteid,
        ]).then(res => {
          if (res.data && res.data.code === 0) {
            message.success('设备添加成功')
            this.setState({
              visible: false,
            })
            this.device()
          }
        });
      }
      if (this.state.cameratype === 2) {
        addhandheld([
          this.state.siteid,
          this.state.iscplatformid,
          this.state.indexCode,
          this.state.cameraname,
          this.state.remark,
        ]).then(res => {
          if (res.data && res.data.code === 0) {
            message.success('设备添加成功')
            this.setState({
              visible: false,
            })
            this.device()
          }
        });
      }
    }
  }

  findvideo(text, record, index) {
    geisctUrl(
      record,
    ).then(res => {
      console.log(text)
      localStorage.setItem('videoid', res.data)
      localStorage.setItem('hotelnames', record.siteName)
      if (!res.data) {
        message.error('暂无视频')
      } else {
        window.location.href = "/app/onlinevideo"
      }
    });


  }

  findlastvideo(text, record, index) {

    getbackUrl([
      text,
      moment(new Date().getTime() - 1 * 24 * 3600 * 1000).format('YYYY-MM-DD'),
      moment(new Date()).format('YYYY-MM-DD'),
    ]).then(res => {
      localStorage.setItem('videoid', res.data.data.url)
      if (res.data.data.url === null || res.data.data.url === '') {
        message.error('暂无视频')
      }
      // else {
      //   window.location.href = "/app/onlinevideo"
      // }
    });

  }


  parameter(text, record, index) {
    localStorage.setItem('cover', text)
    localStorage.setItem('cameraid', record.id)
    window.location.href = "/app/camera"
  }



  showModal = () => {
    this.setState({
      visible: true,
    })
    if (this.state.tabvalue === "2") {
      this.setState({
        cameratype: 2,
        roomdis: 'none',
        roomshow: 'block',
      })
    }
    if (this.state.tabvalue === "1") {
      this.setState({
        cameratype: 1,
        roomdis: 'block',
        roomshow: 'none',
      })
    }
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
      onlinevisible: false,
      visibles: false,
      oneadd: 'none',
      twoadd: 'none',
      threeadd: 'none',
      iscdis: 'none',
      addnum: 1,
      serial: undefined,
      deletevisible: false,
    });
  }

  onClose = (e) => {
    this.setState({
      iscvisible: false,
    });
  }


  socket = (text, record, index) => {
    if (localStorage.getItem("type") === "2" || localStorage.getItem("type") === "1") {

    } else {
      localStorage.setItem('socketid', text)
      this.setState({
        visibles: true,
      })
    }
  }

  state = { onlinevisible: false }
  showonline = (text, record, index) => {
    this.setState({
      onlinevisible: true,
    });
    getonlinestatus([
      record.serial,
    ]).then(res => {
      if (res.data && res.data.message === 'success') {
        this.setState({
          onlinelist: res.data.data,
        });
        if (res.data.data.length < 10) {
          this.setState({
            onlinepage: false
          })
        } else {
          this.setState({
            onlinepage: true
          })
        }
      }
    });
  }


  query = () => {
    console.log(this.state.site)
    console.log(this.state.name)
    devicelist([
      this.state.cityid,
      this.state.areaid,
      this.state.siteId,
      0,
      this.state.keytext,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          videoListDataSource: res.data.data,
        }, function () {
          if (this.state.videoListDataSource.length < 10) {
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


  //手持式筛选
  handlequery = () => {
    devicelist([
      this.state.cityid,
      this.state.areaid,
      this.state.siteId,
      1,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          addhandheldSource: res.data.data,
        }, function () {
          if (this.state.addhandheldSource.length < 10) {
            this.setState({
              handlepage: false
            })
          } else {
            this.setState({
              handlepage: true
            })
          }
        });
      }
    });
  }





  // handleOks = () => {
  //   console.log(this.state.addnum)
  //   var threshold = document.getElementById('threshold').value
  //   if (this.state.addnum === 1) {

  //     insertboard([
  //       localStorage.getItem('socketid'),
  //       this.state.macdata,
  //       threshold
  //     ]).then(res => {
  //       if (res.data && res.data.message === "success") {
  //         message.success('设备添加成功')
  //         this.setState({
  //           visibles: false,
  //         })
  //       }
  //       if (res.data && res.data.message === "查找不到设备") {
  //         message.error('mac不存在，设备添加失败')
  //       }
  //     });
  //   } else {
  //     var arr = []
  //     var newarr = []
  //     var power1 = document.getElementById('power1').value
  //     var power2 = document.getElementById('power2').value
  //     var power3 = document.getElementById('power3').value
  //     if (this.state.addnum === 2) {
  //       if (this.state.macdata1 === "" || this.state.macdata === "") {
  //         message.error("请输入完整信息")
  //       } else {
  //         arr.push(this.state.macdata, this.state.macdata1)
  //         newarr.push(threshold, power1)
  //         insertboard([
  //           localStorage.getItem('socketid'),
  //           arr.join(',').replace(/\s/g, ""),
  //           newarr.join(',').replace(/\s/g, ""),
  //         ]).then(res => {
  //           if (res.data && res.data.message === "success") {
  //             message.success('设备添加成功')
  //             this.setState({
  //               visibles: false,
  //             })
  //           }
  //           if (res.data && res.data.message === "查找不到设备") {
  //             message.error('mac不存在，设备添加失败')
  //           }
  //         });
  //       }
  //     }
  //     if (this.state.addnum === 3) {
  //       if (this.state.macdata1 === "" || this.state.macdata === "" || threshold === "" || power1 === "") {
  //         message.error("请输入完整信息")
  //       } else {
  //         arr.push(this.state.macdata)
  //         arr.push(this.state.macdata1)
  //         arr.push(this.state.macdata2)
  //         newarr.push(threshold)
  //         newarr.push(power1)
  //         newarr.push(power2)
  //         insertboard([
  //           localStorage.getItem('socketid'),
  //           arr.join(',').replace(/\s/g, ""),
  //           newarr.join(',').replace(/\s/g, ""),
  //         ]).then(res => {
  //           if (res.data && res.data.message === "success") {
  //             message.success('设备添加成功')
  //             this.setState({
  //               visibles: false,
  //             })
  //           }
  //           if (res.data && res.data.message === "查找不到设备") {
  //             message.error('mac不存在，设备添加失败')
  //           }
  //         });
  //       }
  //     }
  //     if (this.state.addnum === 4) {
  //       if (this.state.macdata1 === "" || this.state.macdata === "" || threshold === "" || power1 === "" || this.state.macdata2 === "" || power2 === "") {
  //         message.error("请输入完整信息")
  //       } else {
  //         arr.push(this.state.macdata, this.state.macdata1, this.state.macdata2, this.state.macdata3)
  //         newarr.push(threshold)
  //         newarr.push(power1)
  //         newarr.push(power2)
  //         newarr.push(power3)
  //         insertboard([
  //           localStorage.getItem('socketid'),
  //           arr.join(',').replace(/\s/g, ""),
  //           newarr.join(',').replace(/\s/g, ""),
  //         ]).then(res => {
  //           if (res.data && res.data.message === "success") {
  //             message.success('设备添加成功')
  //             this.setState({
  //               visibles: false,
  //             })
  //           }
  //           if (res.data && res.data.message === "查找不到设备") {
  //             message.error('mac不存在，设备添加失败')
  //           }
  //         });
  //       }
  //     }
  //   }
  // }


  // statuschange = (text, record, index) => {
  //   console.log(record)
  //   devicestatus([
  //     record.id,
  //   ]).then(res => {
  //     if (res.data && res.data.message === "success") {
  //       message.success('状态修改成功')
  //       devicelist({

  //       }).then(res => {
  //         if (res.data && res.data.message === "success") {
  //           this.setState({
  //             videoListDataSource: res.data.data
  //           }, function () {
  //             if (res.data.data.length < 10) {
  //               this.setState({
  //                 page: false
  //               })
  //             } else {
  //               this.setState({
  //                 page: true
  //               })
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }


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


  //手持设备位置选择
  handleaddresschange = (e) => {
    console.log(e)
    this.setState({
      handleaddresslist: e,
      cityid: e[0] === undefined ? null : e[0],
      areaid: e[1] === undefined ? null : e[1],
      siteId: e[2] === undefined ? null : e[2]
    });
  }




  devicedata = (value) => {
    console.log(value)
    this.setState({
      devicedata: value
    })
  }

  macdata = (e) => {
    this.setState({
      macdata: e.target.value
    })
  }

  macdata1 = (e) => {
    this.setState({
      macdata1: e.target.value
    })
  }

  macdata2 = (e) => {
    this.setState({
      macdata2: e.target.value
    })
  }

  macdata3 = (e) => {
    this.setState({
      macdata3: e.target.value
    })
  }

  //摄像头列表
  iscquery = () => {
    if (this.state.iscplatformid === "") {
      message.error("请选择安防平台种类")
    } else {
      this.setState({
        iscvisible: true
      })
    }
  }

  //树形图选择
  onSelects = (keys, event) => {
    console.log(keys)
    console.log(keys.length)
    console.log(keys.join(','))
    console.log(event)
    iscdevice([
      this.state.iscplatformid,
      keys.join(',')
    ]).then(res => {
      if (res.data && res.data.msg === "SUCCESS") {
        for (var i in res.data.data.list) {
          res.data.data.list[i].key = res.data.data.list[i].cameraName
        }
        this.setState({
          iscdata: res.data.data.list
        }, function () {
          console.log(this.state.iscdata)
        })
      }
    });
  }

  //table选择
  onSelectChange = (selectedRowKeys, b) => {
    console.log(b)
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys,
      indexCode: b[0].cameraIndexCode
    }, function () {
      console.log(this.state.indexCode)
    });
  };


  //删除摄像头
  onDelete = (text, record, index) => {
    this.setState({
      deletevisible: true,
      camertid: record.id,
    })
  }
  //摄像头列表选择
  submitcamera = () => {
    this.setState({
      cameraname: this.state.selectedRowKeys.join(','),
      iscvisible: false,
    })
  }

  //视频流输入
  stream = (e) => {
    this.setState({
      stream: e.target.value
    })
  }

  //摄像头IP
  deviceIp = (e) => {
    this.setState({
      deviceIp: e.target.value
    })
  }

  //摄像头端口
  port = (e) => {
    this.setState({
      port: e.target.value
    })
  }

  //摄像头用户名
  account = (e) => {
    this.setState({
      account: e.target.value
    })
  }

  //摄像头密码
  password = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  //备注填写
  remarkchange = (e) => {
    this.setState({
      remark: e.target.value
    })
  }



  //ISC平台选择
  iscchange = (value) => {
    this.setState({
      iscplatformid: value
    }, function () {
      iscarea([
        this.state.iscplatformid,
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          console.log(res.data.data[0].name)
          var arr = []
          for (var a in res.data.data) {
            arr.push({
              'title': res.data.data[a].name,
              'key': res.data.data[a].indexCode,
              'children': res.data.data[a].children
            })
          }
          for (var i in arr) {
            for (var j in arr[i].children) {
              if (arr[i].children[j].children != undefined && arr[i].children[j].children.length != 0) {  //eslint-disable-line
                arr[i].children[j].title = arr[i].children[j].name
                arr[i].children[j].key = arr[i].children[j].indexCode
                arr[i].children[j].children = arr[i].children[j].children
                for (var k in arr[i].children[j].children) {
                  if (arr[i].children[j].children[k].children != undefined && arr[i].children[j].children[k].children.length != 0) {  //eslint-disable-line
                    arr[i].children[j].children[k].title = arr[i].children[j].children[k].name
                    arr[i].children[j].children[k].key = arr[i].children[j].children[k].indexCode
                  } else {
                    arr[i].children[j].children[k].title = arr[i].children[j].children[k].name
                    arr[i].children[j].children[k].key = arr[i].children[j].children[k].indexCode
                    arr[i].children[j].children[k].children = undefined
                  }
                }
              } else {
                arr[i].children[j].title = arr[i].children[j].name
                arr[i].children[j].key = arr[i].children[j].indexCode
                arr[i].children[j].children = undefined
              }
            }
          }
          console.log(arr)

          this.setState({
            treeData: arr,
            iscoption: arr
          })
        }
      });
    })
  }

  //设备类型选择
  typeonChange = (e) => {
    console.log(e.target.value)
    this.setState({
      cameratype: e.target.value
    }, function () {
      if (this.state.cameratype === 1) {
        this.setState({
          roomdis: 'block',
          roomshow: 'none',
        })
      } else {
        this.setState({
          roomdis: 'none',
          roomshow: 'block',
        })
      }
    })
  }


  callback = (value) => {
    this.setState({
      tabvalue: value
    }, function () {
      if (this.state.tabvalue === "2") {
        this.setState({
          cameratype: 2
        })
      }
      if (this.state.tabvalue === "1") {
        this.setState({
          cameratype: 1
        })
      }
    })


  }

  //关键字录入
  keytext = (e) => {
    this.setState({
      keytext: e.target.value
    })
  }


  //重置
  reset = () => {
    this.setState({
      cityid: undefined,
      areaid: undefined,
      siteId: undefined,
      addresslist: [],
      keytext: undefined,
    }, function () {
      this.query()
    })
  }


  render() {
    // console.log(this.state.AutoCompletedata)
    const prooptions = this.state.sitelist.map((province) => <Option key={province.id}  >{province.value}</Option>);
    // const cameratypelist = this.state.cameralist.map((province) => <Option key={province.type}  >{province.desc}</Option>);
    const isclistoption = this.state.iscplatform.map((province) => <Option key={province.id}  >{province.value}</Option>);
    const roomoption = this.state.roomlist.map((province) => <Option key={province.id}>{province.name}</Option>);
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelect,
      type: "radio",
    };

    return (
      <Layout>
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="equipment">
            <Card title="设备管理-摄像头管理" headStyle={{ fontWeight: 'bold', fontSize: '18px' }} extra={<Button type="primary"
              style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px', display: this.state.typenone }} onClick={this.showModal}
            >
              设备添加
            </Button>}>
              <Tabs defaultActiveKey="1" onChange={this.callback} value={this.state.tabvalue}>
                <TabPane tab="固定式" key="1">
                  <div className="gutter-example-nodemanage">
                    设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                <Cascader
                      fieldNames={{ label: 'name', value: 'adcode' }}
                      options={this.state.deviceList}
                      onChange={this.addresschange}
                      value={this.state.addresslist}
                      changeOnSelect
                      style={{ width: "350px", marginRight: '20px' }}
                      placeholder="选择酒店" />
                          关键字搜索&nbsp;: &nbsp;&nbsp;&nbsp;
                <Input placeholder="请输入关键字" style={{ width: '200px', marginRight: '20px' }}
                      value={this.state.keytext}
                      onChange={this.keytext}
                    />
                    <Button type="primary" onClick={this.query}>查询</Button>
                    <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
                  </div>
                  <div style={{ marginTop: 20 }}>

                    <Table
                      dataSource={this.state.videoListDataSource}
                      columns={this.nodeInfoTableColumns}
                      pagination={this.state.page}
                    />
                  </div>
                </TabPane>
                <TabPane tab="手持式" key="2" style={{ minHeight: "700px", marginLeft: '20px' }}>
                  <div className="gutter-example-nodemanage">
                    选择酒店&nbsp;: &nbsp;&nbsp;&nbsp;
                    <Cascader
                      fieldNames={{ label: 'name', value: 'adcode' }}
                      options={this.state.deviceList}
                      onChange={this.handleaddresschange}
                      value={this.state.handleaddresslist}
                      changeOnSelect
                      style={{ width: "350px", marginRight: '20px' }}
                      placeholder="选择酒店" />
                    <Button type="primary" onClick={this.handlequery}>查询</Button>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Table
                      dataSource={this.state.addhandheldSource}
                      columns={this.handleColumns}
                      pagination={this.state.handlepage}
                    />
                  </div>
                </TabPane>
              </Tabs>

            </Card>
          </Content>
          <Modal
            title="上下线记录"
            width='500px'
            destroyOnClose
            // maskStyle={{ background: "black", opacity: '0.1' }}
            visible={this.state.onlinevisible}
            centered
            footer={null}
            onCancel={this.handleCancel}
            mask={false}
          >

            {/* 时间选择:<RangePicker
                disabledDate={disabledDate}
                style={{ marginLeft: '20px', marginBottom: '20px' }}
                defaultValue={[moment(this.state.begintime, dateFormat), moment(this.state.endtime, dateFormat)]}
                format={dateFormat}
                ranges={{ 
                  今天: [moment().startOf('day'), moment().endOf('day')], 
                  '本周': [moment().startOf('week'), moment().endOf('week')],
                  '本月': [moment().startOf('month'), moment().endOf('month')]
               }}
                onChange={this.timeonChange}
              /> */}
            {/* <div  style={{textAlign:'right'}}>
                <Button type="primary" className="daybtn" onClick={this.dayquery}>本日</Button>
                <Button type="primary" className="daybtn" onClick={this.weekquery}>本周</Button>
                <Button type="primary" className="daybtn" onClick={this.monthquery}>本月</Button>
              </div> */}
            <Table
              bordered
              dataSource={this.state.onlinelist}
              columns={this.state.onlines}
              pagination={this.state.onlinepage}
              rowClassName="editable-row"
            />
          </Modal>
          <Modal
            title="添加设备"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确认"
            width="400px"
            destroyOnClose
            mask={false}
          >
            <div>
              <span>设备类型：</span>
              <Radio.Group onChange={this.typeonChange} value={this.state.cameratype}>
                <Radio value={1}>固定式</Radio>
                <Radio value={2}>手持式</Radio>
              </Radio.Group>
            </div>
            {/* <div style={{ marginTop: '10px' }}>
              <span>连接方式：</span>
              <Select
                style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                placeholder="请选择连接方式"
                onChange={this.typechange}
              >
                {cameratypelist}
              </Select>
            </div> */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>ISC平台列表：
               {/* <Button type="primary" onClick={this.iscquery} >摄像头列表</Button> */}
              </div>
              <Select
                style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                placeholder="请选择ISC平台"
                onChange={this.iscchange}
              >
                {isclistoption}
              </Select>
            </div>
            <div style={{ display: this.state.disfour }}>
              <span>设备类型：</span>
              <Select
                style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                placeholder="请选择设备类型"
                onChange={this.typeChanges}
                value={this.state.equtype}
              >
                <Option key="IPC">IPC</Option>
                <Option key="NVR">NVR</Option>
              </Select>
            </div>
            <div>
              <span>摄像头：    </span>
              <Search
                placeholder="请选择摄像头"
                enterButton="摄像头列表"
                size="middle"
                onSearch={this.iscquery}
                value={this.state.cameraname}
                style={{ width: '100%', marginBottom: "5px", marginTop: '5px', fontSize: '14px' }}
              />
              {/* <AutoComplete
                      style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                      id="serial"
                      dataSource={serialdata}
                      placeholder="请输入设备标识"
                      onChange={this.devicedata}
                      optionLabelProp="text"
                      filterOption={
                        (inputValue, option) =>
                          option.props.text.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                    /> */}
            </div>
            <div style={{ display: this.state.disfive }}>
              <span>序列号：</span>
              <Input placeholder="请输入序列号"
                style={{ width: '100%', marginBottom: "5px", marginTop: '5px', }}
                value={this.state.serial}
                onChange={this.serial}
                autoComplete="off" />
            </div>

            <div style={{ display: this.state.disfive }}>
              <span>通道号：</span>
              <Input placeholder="请输入通道号"
                style={{ width: '100%', marginBottom: "5px", marginTop: '5px' }}
                autoComplete="off"
              />
            </div>
            <div style={{ display: this.state.disthree }}>
              <span>视频流：</span>
              <Input placeholder="请输入视频流"
                style={{ width: '100%', marginBottom: "5px", marginTop: '5px' }}
                onChange={this.stream}
                value={this.state.stream}
                autoComplete="off"
              />
            </div>




            <div style={{ display: this.state.distwo }}>
              <span>摄像头ip：</span>
              <Input placeholder="请输入摄像头ip"
                style={{ width: '100%', marginBottom: "5px", marginTop: '5px' }}
                autoComplete="off"
                onChange={this.deviceIp}
                value={this.state.deviceIp}
              />
            </div>
            <div style={{ display: this.state.distwo }} >
              <span>摄像头端口：</span>
              <Input placeholder="请输入摄像头端口"
                style={{ width: '100%', marginBottom: "5px", marginTop: '5px' }}
                autoComplete="off"
                onChange={this.port}
                value={this.state.port}
              />
            </div>
            <div style={{ display: this.state.distwo }}>
              <span>摄像头用户名：</span>
              <Input placeholder="请输入摄像头用户名"
                style={{ width: '100%', marginBottom: "5px", marginTop: '5px' }}
                autoComplete="off"
                onChange={this.account}
                value={this.state.account}
              />
            </div>
            <div style={{ display: this.state.distwo }}>
              <span>摄像头密码：</span>
              <Input placeholder="请输入摄像头密码"
                style={{ width: '100%', marginBottom: "5px", marginTop: '5px' }}
                autoComplete="off"
                onChange={this.password}
                value={this.state.password}
              />
            </div>
            <div>
              <span>所属酒店：</span>
              <Select
                style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                placeholder="请选择所属酒店"
                onChange={this.handleChanges}
              >
                {prooptions}
              </Select>
            </div>

            <div style={{ display: this.state.roomdis }}>
              <span>所属房间：</span>
              <Select
                style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                placeholder="请选择所属房间"
                onChange={this.roomchange}
              >
                {roomoption}
              </Select>
            </div>
            <div style={{ display: this.state.roomshow }}>
              <span>备注：</span>
              <TextArea rows={4} style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                onChange={this.remarkchange}
                value={this.state.remark}
                placeholder="请输入备注（选填）"
              />
            </div>
          </Modal>
          <Modal
            title="删除摄像头"
            visible={this.state.deletevisible}
            onOk={this.deleteOk}
            width="400px"
            okText="删除"
            centered
            onCancel={this.handleCancel}
          >
            您确认要删除该摄像头吗？
          </Modal>
          <Drawer
            title="摄像头列表"
            width={1100}
            onClose={this.onClose}
            visible={this.state.iscvisible}
            bodyStyle={{ paddingBottom: 80 }}
          >
            <div className="drawermain">
              <div className="treelist">
                <DirectoryTree
                  multiple
                  defaultExpandAll
                  onSelect={this.onSelects}
                  // onExpand={onExpand}
                  treeData={this.state.treeData}
                />
              </div>
              <div style={{ width: '650px' }}>
                < Table
                  // components={components} 
                  dataSource={this.state.iscdata}
                  rowSelection={rowSelection}
                  columns={this.isclistcolumns}
                  bordered
                />
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                  <Button type="primary" onClick={this.submitcamera}>确定</Button>
                </div>
              </div>
            </div>

          </Drawer>
        </Layout >
      </Layout >
    );
  }
}

export default App;
