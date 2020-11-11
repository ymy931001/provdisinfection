import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Modal,
  Cascader,
  Select,
  Input,
  message,
  DatePicker,
} from "antd";
import {
  readinglist,
  hotellist,
  boardlists,
  getbasetype,
  basename,
  getregion,
  insertboard,
  andsmartdevice,
  patchboard,
  roomlist,
  delectboard,
  boardonlinestatus
} from "../axios";
import "./socket.css";
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const { Content } = Layout;
const Option = Select.Option;

var now = new Date();
var date = new Date(now.getTime());
var year = date.getFullYear();
var month = date.getMonth() + 1 > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();


var date1 = new Date(now.getTime());
var year1 = date1.getFullYear();
var month1 = date1.getMonth() + 1 > 9 ? (date1.getMonth() + 1) : '0' + (date1.getMonth() + 1);
var day1 = date1.getDate() > 9 ? date1.getDate() : '0' + date1.getDate();







class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      sitelist: [],
      roomlist: [],
      boardlist: [],
      deviceList: [],
      endtime: year1 + '-' + month1 + '-' + day1,
      begintime: year + '-' + month + '-' + day,
      devicelists: [],
      devicedis: 'none',
      readouts: [
        // //   {
        // //   title: 'MAC',
        // //   dataIndex: 'mac',
        // // },
        // {
        //   title: '电流',
        //   dataIndex: 'electricity',
        // }, {
        //   title: '功率',
        //   dataIndex: 'power',
        // },
        {
          title: '开始时间',
          dataIndex: 'begin',
          // render: (text, record, index) => {
          //   if (text === true) {
          //     return (
          //       <div style={{ color: 'green', cursor: 'pointer' }}>
          //         开启
          //       </div>
          //     )
          //   }
          //   if (text === false) {
          //     return (
          //       <div style={{ color: 'red', cursor: 'pointer' }}>
          //         关闭
          //       </div>
          //     )
          //   }
          // }
        }, {
          title: '结束时间',
          dataIndex: 'end',
        }],

      socketcolumns: [
        //   {
        //   title: 'MAC',
        //   dataIndex: 'mac',
        // }, 
        {
          title: '设备状态',
          dataIndex: 'status',
          render: (text, record, index) => {
            if (text === true) {
              return (
                <div style={{ color: 'green', cursor: 'pointer' }}>
                  上线
                </div>
              )
            }
            if (text === false) {
              return (
                <div style={{ color: 'red', cursor: 'pointer' }}>
                  离线
                </div>
              )
            }
          }
        }, {
          title: '上报时间',
          dataIndex: 'date',
        }],

    };


    if (localStorage.getItem('type') === "1") {
      this.nodeInfoTableColumns = [
        {
          title: "所属酒店",
          dataIndex: "siteName",
        }, {
          title: "设备位置",
          dataIndex: "roomName",
        },
        {
          title: "imei",
          dataIndex: "imei",
        },
        // {
        //   title: "mac",
        //   dataIndex: "mac",
        // },
        {
          title: "设备状态",
          dataIndex: "onlineStatus",
          render: (text, record, index) => {
            if (text === true) {
              return (
                <div style={{ color: 'green', cursor: 'pointer' }} onClick={() => this.showonlinehistory(text, record, index)}>
                  在线
                </div>
              )
            }
            if (text === false) {
              return (
                <div style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.showonlinehistory(text, record, index)}>
                  离线
                </div>
              )
            }
          }
        }
        // ,{
        //   title: "累计电量",
        //   dataIndex: "tec",
        // }
        , {
          title: '工作记录',
          dataIndex: 'id',
          render: (text, record, index) =>
            <div>
              <a onClick={() => this.showhistory(text, record, index)}
              >详情</a>
            </div>
        }
        , {
          title: "信号强度",
          dataIndex: "sig",
          render: (text, record, index) => {
            if (text === null) {
              return (
                <div style={{ color: 'green' }}>
                  30
                </div>
              )
            } else {
              return (
                <div style={{ color: 'green' }}>
                  {text}
                </div>
              )
            }
          }
        },
        {
          title: '修改阈值',
          dataIndex: 'id',
          render: (text, record, index) =>
            <div>
              <a onClick={() => this.showyuzhi(text, record, index)}
              >修改</a>
            </div>
        },
        {
          title: "创建时间",
          dataIndex: "gmtcreate",
        }, {
          title: '操作',
          dataIndex: 'id',
          key: 'id',
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
    } else {
      this.nodeInfoTableColumns = [
        {
          title: "所属酒店",
          dataIndex: "siteName",
        }, {
          title: "设备位置",
          dataIndex: "roomName",
        },
        {
          title: "imei",
          dataIndex: "imei",
        },
        {
          title: "设备状态",
          dataIndex: "onlineStatus",
          render: (text, record, index) => {
            if (text === true) {
              return (
                <div style={{ color: 'green', cursor: 'pointer' }} onClick={() => this.showonlinehistory(text, record, index)}>
                  在线
                </div>
              )
            }
            if (text === false) {
              return (
                <div style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.showonlinehistory(text, record, index)}>
                  离线
                </div>
              )
            }
          }
        }
        , {
          title: '工作记录',
          dataIndex: 'id',
          render: (text, record, index) =>
            <div>
              <a onClick={() => this.showhistory(text, record, index)}
              >详情</a>
            </div>
        }
        , {
          title: "信号强度",
          dataIndex: "sig",
          render: (text, record, index) => {
            if (text === null) {
              return (
                <div style={{ color: 'green' }}>
                  30
                </div>
              )
            } else {
              return (
                <div style={{ color: 'green' }}>
                  {text}
                </div>
              )
            }
          }
        },
        {
          title: "创建时间",
          dataIndex: "gmtcreate",
        }
      ];
    }


  }


  componentWillMount() {
    document.title = "插座管理";
    if (localStorage.getItem("type") === "2" || localStorage.getItem("type") === "3" || localStorage.getItem("type") === "4") {
      this.setState({
        typenone: 'none'
      })
    }
  }

  componentDidMount() {

    getbasetype([
      "board"
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          boardlist: JSON.parse(res.data.data)
        })
      }
    });

    andsmartdevice([
    ]).then(res => {
      if (res.data && res.data.resultMessage === "success") {
        var arr = []
        for (var i in res.data.data) {
          arr.push({
            "name": res.data.data[i].deviceName,
            "imei": res.data.data[i].imei,
            "id": res.data.data[i].socketId
          })
        }
        console.log(arr)
        this.setState({
          devicelists: arr
        })
      }
    });






    boardlists([

    ]).then(res => {
      if (res.data && res.data.message === "success") {

        this.setState({
          userlist: res.data.data
        }, function () {
          console.log(this.state.userlist)
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




    basename().then(res => {
      // console.log(res.data.data)
      // this.setState({
      //   deviceList: res.data.data
      // });
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

    var arr = []
    hotellist().then(res => {
      console.log(res.data.data)
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

  //删除插座
  onDelete = (text, record, index) => {
    this.setState({
      deletevisible: true,
      socketid: record.id,
    })
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

  //房间选择
  roomchange = (value) => {
    console.log(value)
    this.setState({
      roomid: value
    })
  }

  //时间筛选
  timeonChange = (value, dateString) => {
    if (value.length === 0) {
      this.setState({
        begintime: undefined,
        endtime: undefined,
      });
    } else {
      this.setState({
        begintime: moment(dateString[0]),
        endtime: moment(dateString[1]),
      });
    }
  }

  //时间筛选
  timeonChanges = (value, dateString) => {
    if (value.length === 0) {
      this.setState({
        begintimes: undefined,
        endtimes: undefined,
      });
    } else {
      this.setState({
        begintimes: moment(dateString[0]),
        endtimes: moment(dateString[1]),
      });
    }

  }






  handleCancel = (e) => {
    console.log(e);
    this.setState({
      historyvisible: false,
      visible: false,
      yuzhivisible: false,
      deletevisible: false,
      socketlinevisible: false,
    });
  }

  state = { historyvisible: false }
  showhistory = (text, record, index) => {
    console.log(record)
    localStorage.setItem('mac', record.mac)
    this.setState({
      historyvisible: true,
      socketmac: record.mac,
      begintime: moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 7),
      endtime: moment(new Date().getTime()),
    });
    readinglist([
      record.mac,
      moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 7).format("YYYY-MM-DD"),
      moment(new Date().getTime()).format("YYYY-MM-DD"),
    ]).then(res => {
      if (res.data && res.data.message === 'success') {
        if (res.data.data.length !== 0) {
          var arr = []
          var newarr = []
          var arrlist = []
          for (var i in res.data.data) {
            if (res.data.data[res.data.data.length - 1].loadStatus === false) {
              if (parseInt(i, 10) !== res.data.data.length - 1) {
                if (res.data.data[i].loadStatus === false) {
                  arr.push(res.data.data[i].gmtcreate)
                }
                if (res.data.data[i].loadStatus === true) {
                  newarr.push(res.data.data[i].gmtcreate)
                }
              }
            } else {
              if (res.data.data[i].loadStatus === false) {
                arr.push(res.data.data[i].gmtcreate)
              }
              if (res.data.data[i].loadStatus === true) {
                newarr.push(res.data.data[i].gmtcreate)
              }
            }
          }
          if (res.data.data[0].loadStatus === true) {
            arr.push("使用中")
          }
          for (var j in arr) {
            arrlist.push({
              "begin": newarr[j],
              "end": arr[j]
            })
          }
          this.setState({
            readout: arrlist,
          });
          if (arrlist.length < 10) {
            this.setState({
              pages: false
            })
          } else {
            this.setState({
              pages: true
            })
          }
        } else {
          this.setState({
            readout: [],
            pages: false
          });
        }
      }
    });
  }

  showonlinehistory = (text, record, index) => {
    this.setState({
      socketlinevisible: true,
      begintimes: moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 7),
      endtimes: moment(new Date().getTime()),
      socketId: record.id
    });
    boardonlinestatus([
      record.id,
      moment(new Date().getTime() - 24 * 60 * 60 * 1000 * 7).format("YYYY-MM-DD"),
      moment(new Date().getTime()).format("YYYY-MM-DD"),
    ]).then(res => {
      if (res.data && res.data.message === 'success') {
        this.setState({
          socketline: res.data.data,
        });
        if (res.data.data.length < 10) {
          this.setState({
            linepages: false
          })
        } else {
          this.setState({
            linepages: true
          })
        }
      }
    });
  }


  linequery = () => {
    boardonlinestatus([
      this.state.socketId,
      this.state.begintimes === undefined ? undefined : moment(this.state.begintimes).format('YYYY-MM-DD'),
      this.state.endtimes === undefined ? undefined : moment(this.state.endtimes).format('YYYY-MM-DD'),
    ]).then(res => {
      if (res.data && res.data.message === 'success') {
        this.setState({
          socketline: res.data.data,
        });
        if (res.data.data.length < 10) {
          this.setState({
            linepages: false
          })
        } else {
          this.setState({
            linepages: true
          })
        }
      }
    });
  }



  timequery = () => {
    readinglist([
      this.state.socketmac,
      this.state.begintime === undefined ? undefined : moment(this.state.begintime).format('YYYY-MM-DD'),
      this.state.endtime === undefined ? undefined : moment(this.state.endtime).format('YYYY-MM-DD'),
    ]).then(res => {
      if (res.data && res.data.message === 'success') {
        if (res.data.data.length !== 0) {
          var arr = []
          var newarr = []
          var arrlist = []
          for (var i in res.data.data) {
            if (res.data.data[res.data.data.length - 1].loadStatus === false) {
              if (parseInt(i, 10) !== res.data.data.length - 1) {
                if (res.data.data[i].loadStatus === false) {
                  arr.push(res.data.data[i].gmtcreate)
                }
                if (res.data.data[i].loadStatus === true) {
                  newarr.push(res.data.data[i].gmtcreate)
                }
              }
            } else {
              if (res.data.data[i].loadStatus === false) {
                arr.push(res.data.data[i].gmtcreate)
              }
              if (res.data.data[i].loadStatus === true) {
                newarr.push(res.data.data[i].gmtcreate)
              }
            }
          }
          if (res.data.data[0].loadStatus === true) {
            arr.push("使用中")
          }
          for (var j in arr) {
            arrlist.push({
              "begin": newarr[j],
              "end": arr[j]
            })
          }
          this.setState({
            readout: arrlist,
          });
          if (arrlist.length < 10) {
            this.setState({
              pages: false
            })
          } else {
            this.setState({
              pages: true
            })
          }
        } else {
          this.setState({
            readout: [],
            pages: false
          });
        }
      }
    });
  }


  query = () => {
    boardlists([
      this.state.cityid,
      this.state.areaid,
      this.state.siteId,
      this.state.keytext,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        console.log(res.data.data)
        this.setState({
          userlist: res.data.data
        }, function () {
          console.log(this.state.userlist)
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


  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  //添加插座
  handleOk = () => {
    // var arr = [{
    //   "mac": this.state.macvalue,
    //   "roomid": this.state.roomid,
    //   "threshold": this.state.threshold,
    //   "type": this.state.sockettype,
    //   "imei": this.state.socketid,
    // }]
    console.log(this.state.socketid)
    console.log(this.state.macvalue)
    if (this.state.socketid.length === 0) {
      message.error('请选择IMEI号')
    } else if (!this.state.threshold) {
      message.error('请输入额定功率')
    } else if (!this.state.roomid) {
      message.error('请选择所属房间')
    } else {
      var arr = []
      for (var i in this.state.socketid) {
        if (this.state.macvalue === undefined || this.state.macvalue === "" || this.state.macvalue === null) {
          arr.push({
            "roomid": this.state.roomid,
            "threshold": this.state.threshold,
            "type": "3",
            "imei": this.state.socketid[i],
          })
        } else {
          arr.push({
            "mac": this.state.macvalue.split(',')[i],
            "roomid": this.state.roomid,
            "threshold": this.state.threshold,
            "type": "3",
            "imei": this.state.socketid[i],
          })
        }
      }



      insertboard(
        JSON.stringify(arr)
      ).then(res => {
        if (res.data && res.data.message === "success") {
          message.success('添加成功')
          boardlists([

          ]).then(res => {
            if (res.data && res.data.message === "success") {
              console.log(res.data.data)
              localStorage.removeItem('roomid')
              this.setState({
                userlist: res.data.data
              }, function () {
                console.log(this.state.userlist)
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

          andsmartdevice([
          ]).then(res => {
            if (res.data && res.data.resultMessage === "success") {
              var arr = []
              for (var i in res.data.data) {
                arr.push({
                  "name": res.data.data[i].deviceName,
                  "imei": res.data.data[i].imei,
                  "id": res.data.data[i].socketId
                })
              }
              console.log(arr)
              this.setState({
                devicelists: arr
              })
            }
          });
          this.setState({
            visible: false,
            socketid: []
          })
        }
        if (res.data && res.data.code === -1) {
          message.error(res.data.data)
        }

      });
    }

  }

  //额定功率填写
  threshold = (e) => {
    this.setState({
      threshold: e.target.value.replace(/[^0-9.]/g, '')
    })
  }

  //mac值填写
  macvalue = (e) => {
    this.setState({
      macvalue: e.target.value
    })
  }

  // //插座类型选择
  // typechange = (value) => {
  //   console.log(value)
  //   this.setState({
  //     sockettype: value
  //   }, function () {
  //     if (this.state.sockettype === "3") {
  //       this.setState({
  //         devicedis: 'block'
  //       })
  //     } else {
  //       this.setState({
  //         devicedis: 'none'
  //       })
  //     }
  //   })
  // }

  //设备选择
  socketchange = (value, b) => {
    console.log(value)
    console.log(b)
    var arr = []
    for (var i in b) {
      arr.push(b[i].props.name)
    }
    this.setState({
      socketid: value,
      macvalue: arr.join(',')
    })
  }

  //设备输入
  onSearch = (value) => {
    console.log(value)
    this.setState({
      socketid: value,
    })
  }

  onFocus = (value) => {
    console.log(value)
  }

  onBlur = (value) => {
    var arr = value
    console.log(arr)
    this.setState({
      socketid: arr,
    }, function () {

    })
  }
  //修改上阈值
  thresholdup = (e) => {
    this.setState({
      thresholdup: e.target.value
    })
  }

  //修改下阈值
  thresholddown = (e) => {
    console.log(e.target.value)
    this.setState({
      thresholddown: e.target.value
    })
  }

  //修改阈值打开
  showyuzhi = (text, record, index) => {
    console.log(record)
    this.setState({
      yuzhivisible: true,
      modelid: record.id,
      thresholdup: record.thresholdUp,
      thresholddown: record.thresholdDown,
    })
  }

  //修改阈值确认
  yuzhiOk = () => {
    patchboard([
      this.state.modelid,
      parseInt(this.state.thresholddown, 10),
      parseInt(this.state.thresholdup, 10),
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("修改成功")
        boardlists([

        ]).then(res => {
          if (res.data && res.data.message === "success") {
            console.log(res.data.data)
            localStorage.removeItem('roomid')
            this.setState({
              userlist: res.data.data
            }, function () {
              console.log(this.state.userlist)
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
          yuzhivisible: false,
        });
      }
      if (res.data && res.data.code === -1) {
        if (res.data && res.data.data === "device is offline") {
          message.error("设备离线")
        } else {
          message.error("阈值填写错误")
        }
      }
    });
  }


  //删除插座
  deleteOk = (text, record, index) => {
    console.log(this.state.socketid)
    delectboard([
      this.state.socketid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success("删除插座成功");
        this.setState({
          deletevisible: false,
        })
        boardlists([

        ]).then(res => {
          if (res.data && res.data.message === "success") {
            console.log(res.data.data)
            this.setState({
              userlist: res.data.data
            }, function () {
              console.log(this.state.userlist)
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
        message.error(res.data.data)
      }
    });
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
      boardlists([
        this.state.cityid,
        this.state.areaid,
        this.state.siteId,
        this.state.keytext,
      ]).then(res => {
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
    })
  }


  render() {
    const prooptions = this.state.sitelist.map((province) => <Option key={province.id}  >{province.value}</Option>);
    const roomoption = this.state.roomlist.map((province) => <Option key={province.id}>{province.name}</Option>);
    // const borardtypelist = this.state.boardlist.map((province) => <Option key={province.type}>{province.desc}</Option>);
    const alldevicelist = this.state.devicelists.map((province) => <Option key={province.imei} name={province.id}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {province.imei}
        </div>
        <div style={{ color: '#999', fontSize: '12px' }}>
          -{province.name}
        </div>
      </div>
    </Option>);


    return (
      <Layout>
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="设备管理-插座管理" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={<Button type="primary"
                style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px', display: this.state.typenone }} onClick={this.showModal}
              >
                设备添加
              </Button>}
            >
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
                    关键字搜索&nbsp;: &nbsp;&nbsp;&nbsp;
                <Input placeholder="请输入关键字" style={{ width: '200px', marginRight: '20px' }}
                  value={this.state.keytext}
                  onChange={this.keytext}
                />
                <Button type="primary" onClick={this.query}>查询</Button>
                <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
                {/* <Button type="primary" style={{ marginLeft: '20px' }}>
                  <Link to="/app/withoutsocket">未绑定插座列表</Link>
                </Button> */}
                <Table
                  dataSource={this.state.userlist}
                  columns={this.nodeInfoTableColumns}
                  pagination={this.state.page}
                />
              </div>
            </Card>

            <Modal
              title="工作记录"
              width='600px'
              destroyOnClose
              // maskStyle={{ background: "black", opacity: '0.1' }}
              visible={this.state.historyvisible}
              // onOk={this.handleOk}
              centered
              footer={null}
              onCancel={this.handleCancel}
              mask={false}
            >
              时间&nbsp;:
                    <RangePicker
                style={{ marginLeft: '20px', marginRight: '20px' }}
                format={dateFormat}
                ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                onChange={this.timeonChange}
                value={[this.state.begintime, this.state.endtime]}
              />
              <Button type="primary" onClick={this.timequery}>查询</Button>
              <Table
                bordered
                dataSource={this.state.readout}
                columns={this.state.readouts}
                pagination={this.state.pages}
                rowClassName="editable-row"
                style={{ marginTop: '5px' }}
              />
            </Modal>

            <Modal
              title="上下线记录"
              width='500px'
              destroyOnClose
              visible={this.state.socketlinevisible}
              centered
              footer={null}
              onCancel={this.handleCancel}
              mask={false}
            >
              时间&nbsp;:
                    <RangePicker
                style={{ marginLeft: '20px', marginRight: '20px', width: '300px' }}
                format={dateFormat}
                ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                onChange={this.timeonChanges}
                value={[this.state.begintimes, this.state.endtimes]}
              />
              <Button type="primary" onClick={this.linequery}>查询</Button>
              <Table
                bordered
                dataSource={this.state.socketline}
                columns={this.state.socketcolumns}
                pagination={this.state.linepages}
                rowClassName="editable-row"
                style={{ marginTop: '5px' }}
              />
            </Modal>



            <Modal
              title="阈值修改"
              width='300px'
              destroyOnClose
              visible={this.state.yuzhivisible}
              centered
              onCancel={this.handleCancel}
              onOk={this.yuzhiOk}
              mask={false}
            >
              <div>
                <span>下阈值：</span>
                <Input placeholder="请输入下阈值"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  addonAfter="W"
                  autoComplete="off"
                  onChange={this.thresholddown}
                  value={this.state.thresholddown}
                />
              </div>
              <div>
                <span>上阈值：</span>
                <Input placeholder="请输入上阈值"
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  addonAfter="W"
                  autoComplete="off"
                  onChange={this.thresholdup}
                  value={this.state.thresholdup}
                />
              </div>
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
                {/* <span>插座类型：</span>
                <Select
                  style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                  placeholder="请选择连接方式"
                  onChange={this.typechange}
                  value={this.state.sockettype}
                >
                  {borardtypelist}
                </Select> */}
                <div>
                  <span>IMEI：</span>
                  <Select
                    style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                    placeholder="请选择设备"
                    onChange={this.socketchange}
                    value={this.state.socketid}
                    mode="multiple"
                    showSearch
                    // optionFilterProp="imei"
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onSearch={this.onSearch}
                  // filterOption={(input, option) =>
                  //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  // }
                  >
                    {alldevicelist}
                  </Select>
                </div>
                <div>
                  <span>额定功率：</span>
                  <Input placeholder="请输入额定功率"
                    style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                    autoComplete="off"
                    onChange={this.threshold}
                    value={this.state.threshold}
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
                <div>
                  <span>所属房间：</span>
                  <Select
                    style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                    placeholder="请选择所属房间"
                    onChange={this.roomchange}
                    value={this.state.roomid}
                  >
                    {roomoption}
                  </Select>
                </div>
              </div>
            </Modal>
            <Modal
              title="删除插座"
              visible={this.state.deletevisible}
              onOk={this.deleteOk}
              width="400px"
              okText="删除"
              centered
              onCancel={this.handleCancel}
            >
              您确认要删除该插座吗？
          </Modal>
          </Content>

        </Layout>
      </Layout >
    );
  }
}

export default App;
