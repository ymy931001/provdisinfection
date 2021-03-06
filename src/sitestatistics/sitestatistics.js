import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Modal,
  DatePicker,
  Select,
  Tooltip,
  Pagination,
  message,
  Cascader
} from "antd";
import {
  siteStatistics,
  sitelist, getregion
} from "../axios";
import "./sitestatistics.css";
import moment from 'moment';
import { Link } from 'react-router-dom';


const { Content } = Layout;
const { RangePicker } = DatePicker;

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';






class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      sitelist: [],
      allhotel: [],
      typenone: "inline-block",
      notaddress: [],
      unnormallist: [],
      pageNum: 1,
      pageNumSize: 10,
    };



    this.nodeInfoTableColumns = [
      {
        title: "酒店名称",
        dataIndex: "siteName",
        render: (text, record, index) => {
          return (
            <div style={{ cursor: 'pointer' }} onClick={() => this.sitechange(text, record, index)}>
              {text}
            </div>
          )
        }
      }, {
        title: <Tooltip title={'消毒人员每天累计工作时长'}>
          <span> 累计工作时长（分）</span>
        </Tooltip>,
        dataIndex: "worktime",
        // sorter: (a, b) => (Math.ceil(a.worktime / 60) / (a.qualifiedRoomCount)) > (Math.ceil(b.worktime / 60) / (b.qualifiedRoomCount)) ? 1 : -1,
        sorter: (a, b) => a.worktime - b.worktime,
        render: (text, record, index) => {
          return (
            <div>
              {(Math.ceil(text / 60)).toFixed(1)}
            </div>
          )
        }
      },
      {
        title: <Tooltip title={'消毒柜每天累计工作时长'}>
          <span> 累计运行时长（分）</span>
        </Tooltip>,
        dataIndex: "runtime",
        sorter: (a, b) => a.runtime - b.runtime,
        render: (text, record, index) => {
          return (
            <div>
              {Math.ceil(text / 60).toFixed(1)}
            </div>
          )
        }
      },
      {
        title: "保洁时长（分）",
        dataIndex: "housekeeping",
        // sorter: (a, b) => (Math.ceil(a.worktime / 60) / (a.aNum)) > (Math.ceil(b.worktime / 60) / (b.aNum)) ? 1 : -1,
        render: (text, record, index) => {
          return (
            <div>
              {(Math.ceil(text / 60)).toFixed(1)}
            </div>
          )
        }
      },
      {
        title: "消毒间数",
        dataIndex: "roomCount",
      },
      {
        title: "未达标",
        dataIndex: "unqualifiedRoomCount",
        render: (text, record, index) => {
          if (record.unqualifiedRooms) {
            if (JSON.parse(record.unqualifiedRooms).length === 0) {
              return (
                <div>
                  无
                </div>
              )
            } else {
              return (
                <div>
                  <Tooltip placement="topLeft" title={JSON.parse(record.unqualifiedRooms).join(',')}>
                    {/* <Link to="/app/hotelvideo" > */}
                    <span>
                      <a onClick={() => this.notstandard(text, record, index)}
                      >{text}</a></span>
                    {/* </Link> */}
                  </Tooltip>
                </div>
              )
            }
          } else {
            return (
              <div>
                无
              </div>
            )
          }
        }
      },
      // {
      //   title: "异常设备",
      //   dataIndex: "eNum",
      //   render: (text, record, index) =>
      //     <div>
      //       <a onClick={() => this.unnormal(text, record, index)}
      //       >{text}</a>
      //     </div>
      // },
      // {
      //   title: "消毒率",
      //   dataIndex: "rate",
      //   sorter: (a, b) => a.rate - b.rate,
      //   render: (text) => {
      //     return (
      //       <div>
      //         {text * 100 + "%"}
      //       </div>
      //     )
      //   }
      // },
      {
        title: "检测时间",
        dataIndex: "date",
        render: (text, record, index) => {
          return (
            <div>
              {moment(text).format("YYYY-MM-DD")}
            </div>
          )
        }
      },
    ];
  }


  componentWillMount() {

  }

  componentDidMount() {
    if (localStorage.getItem("type") === "2") {
      this.setState({
        typenone: 'none'
      })
    }


    siteStatistics([
      this.state.pageNum,
      this.state.pageNumSize,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        console.log(res.data.data)
        this.setState({
          sitelist: res.data.data.siteStatisticsList,
          total: res.data.data.total,
        })
      }
    });


    sitelist([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var arr = []
        for (var i in res.data.data) {
          if (res.data.data[i].quantity != 0) { //eslint-disable-line
            arr.push({
              'id': res.data.data[i].id,
              'name': res.data.data[i].sitename
            })
          }
        }
        this.setState({
          allhotel: arr
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



  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  notstandard = (text, record, index) => {
    console.log(JSON.parse(record.nDevice).join(','))
    localStorage.setItem('selecttype', "1")
    localStorage.setItem('testtime', moment(record.date).format("YYYY-MM-DD"))
    localStorage.setItem('sitename', record.siteName)
    localStorage.setItem('names', JSON.parse(record.nDevice).join(','))
    localStorage.removeItem('site');
    localStorage.removeItem('addresslist');
  }

  unnormal = (text, record, index) => {
    localStorage.setItem('eqsiteid', record.siteId)
    if (JSON.parse(record.eDevice).length === 0) {

    } else {
      var arr = []
      for (var i in JSON.parse(record.eDevice)) {
        arr.push({
          'value': JSON.parse(record.eDevice)[i]
        })
      }
      this.setState({
        unnormallist: arr,
        visibles: true,
      })
    }
  }


  handleCancel = () => {
    this.setState({
      visible: false,
      visibles: false,
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

  // nostandardhotel = (province) => {
  //   localStorage.setItem('name', province.value)
  //   localStorage.setItem('selecttype', "1")
  //   localStorage.removeItem('site');
  //   localStorage.removeItem('addresslist');
  // }

  unnormalclick = (province) => {
    localStorage.setItem('selecttype', "2")
    localStorage.setItem('eqname', province.value)
  }


  sitechange = (text, record, index) => {
    siteStatistics([
      this.state.pageNum,
      this.state.pageNumSize,
      record.siteId
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          sitelist: res.data.data.siteStatisticsList,
          total: res.data.data.total,
        })
      }
    });
  }


  //时间选择
  timeonChange = (value, dateString) => {
    console.log(dateString)
    if (dateString[0] === "") {
      this.setState({
        begintime: undefined
      })
    } else {
      this.setState({
        begintime: moment(dateString[0]).format('YYYY-MM-DD'),
      });
    }
    if (dateString[1] === "") {
      this.setState({
        endtime: undefined
      })
    } else {
      this.setState({
        endtime: moment(dateString[1]).format('YYYY-MM-DD'),
      });
    }
  }
  reset = () => {
    this.setState({
      cityid: undefined,
      areaid: undefined,
      siteId: undefined,
      addresslist: [],
      keytext: undefined,
      begintime: undefined,
      endtime: undefined,
    })
    siteStatistics([
      1,
      10,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          sitelist: res.data.data.siteStatisticsList,
          total: res.data.data.total,
          hotelname: undefined,
        })
      }
    });
  }

  query = () => {
    siteStatistics([
      this.state.pageNum,
      this.state.pageNumSize,
      this.state.siteId,
      this.state.begintime,
      this.state.endtime,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          sitelist: res.data.data.siteStatisticsList,
          total: res.data.data.total,
        })
      }
    });
  }

  //分页筛选
  pagechange = (page, num) => {
    this.setState({
      pageNum: page,
      pageNumSize: num,
    }, function () {
      siteStatistics([
        this.state.pageNum,
        this.state.pageNumSize,
        this.state.hotelname,
        this.state.begintime,
        this.state.endtime,
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          this.setState({
            sitelist: res.data.data.siteStatisticsList,
            total: res.data.data.total,
          })
        }
      });
    })
  }

  //选择酒店
  hotelchange = (value) => {
    this.setState({
      hotelname: value
    })
  }

  //数据导出
  export = () => {
    if (!this.state.begintime || !this.state.endtime) {
      message.error('请选择导出时间范围')
    } else {
      if (this.state.siteId) {
        window.open("https://iva.terabits.cn:9092/statistics/getExcel?Authorization=" + localStorage.getItem('authorization') + "&area=" + this.state.areaid +
          "&siteIds=" + this.state.siteId
          + "&start=" + this.state.begintime + "&stop=" + this.state.endtime, "_self")
      } else {
        window.open("https://iva.terabits.cn:9092/statistics/getExcel?Authorization=" + localStorage.getItem('authorization') + "&area=" + this.state.areaid +
          "&start=" + this.state.begintime + "&stop=" + this.state.endtime, "_self")
      }
    }
  }

  render() {
    const options = this.state.allhotel.map((province) => <Option key={province.id}  >{province.name}</Option>);


    const unoptions = this.state.unnormallist.map((province) =>
      <span style={{ marginRight: '20px' }} onClick={() => this.unnormalclick(province)}>
        <Link to="/app/equipment" >
          <span>{province.value}</span>
        </Link>
      </span>
    );
    return (
      <Layout >
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="运行概览-酒店概览" headStyle={{ fontWeight: 'bold', fontSize: '18px' }} >
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <span className="titlemid">
                    酒店名称：
                </span>
                  <Cascader
                    fieldNames={{ label: 'name', value: 'adcode' }}
                    options={this.state.deviceList}
                    onChange={this.addresschange}

                    value={this.state.addresslist}
                    changeOnSelect
                    style={{ width: "350px", marginRight: '20px' }}
                    placeholder="选择酒店" />
                  时间&nbsp;:
                    <RangePicker
                    style={{ marginLeft: '20px', marginRight: '20px' }}
                    format={dateFormat}
                    ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                    onChange={this.timeonChange}
                  // value={[moment(this.state.begintime, dateFormat), moment(this.state.endtime, dateFormat)]}
                  />
                  <Button type="primary" onClick={this.query}>查询</Button>
                  <Button type="primary" onClick={this.reset}
                    style={{ background: 'white', border: '1px solid #999', color: "#999", marginLeft: '20px' }}>重置</Button>
                  <Button type="primary" onClick={this.export} style={{ marginLeft: '20px' }}>数据导出</Button>
                </div>
                <Table
                  dataSource={this.state.sitelist}
                  columns={this.nodeInfoTableColumns}
                  pagination={false}
                />
                <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                  <Pagination
                    defaultCurrent={1}
                    onChange={this.pagechange}
                    total={this.state.total}
                    hideOnSinglePage={true}
                    current={this.state.pageNum}
                  />
                </div>
              </div>
            </Card>
          </Content>
          {/* <Modal
            title="未达标消毒间"
            visible={this.state.visible}
            width="500px"
            onCancel={this.handleCancel}
            footer={null}
            mask={false}
          >
            <div>
              {prooptions}
            </div>
          </Modal> */}
          <Modal
            title="异常设备"
            visible={this.state.visibles}
            width="400px"
            onCancel={this.handleCancel}
            footer={null}
            mask={false}
          >
            <div>
              {unoptions}
            </div>
          </Modal>
        </Layout>
      </Layout >
    );
  }
}

export default App;
