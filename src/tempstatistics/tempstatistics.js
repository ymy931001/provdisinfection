import React from "react";
import {
  Upload,
  Table,
  Layout,
  Row,
  Col,
  Card,
  Button,
  Input,
  Badge,
  Tabs,
  Select,
  Popconfirm,
  DatePicker,
  Statistic
} from "antd";
import {
  roomlist,
  deleteroom,
  allhospital,
  hospitalstatistics,
  alltemperature
} from "../axios";
import "./tempstatistics.css";
import { Link } from 'react-router-dom';
import moment from 'moment';
import DataSet from "@antv/data-set";

import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

const { Content, F } = Layout;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Option = Select.Option;

const { TabPane } = Tabs;



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      typenone: "inline-block",
      sitelist: [],
      hospitallist: {},
      sitelists: [],
      hospitalion: [],
      totallist: [],
      tongjilist: [],
      hospitallists: [],
      usualtype: [],
      unusualtype: [],
      weekback: 'green',
      monthback: '#1890ff',
      // four: '杭州中兴医院',
      hospitalid: null,
      begin: moment(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
      stop: moment(new Date().getTime()).format("YYYY-MM-DD")
    };
  }

  componentWillMount() {
    document.title = "信息统计";
  }

  componentDidMount() {


    allhospital([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var arr = []
        var map = {}
        for (var i in res.data.data) {
          arr.push({
            'value': res.data.data[i].name,
            'id': res.data.data[i].id,
          })
          map[res.data.data[i].id] = res.data.data[i].name
        }
        this.setState({
          hospitalion: arr,
          one: arr.length,
          hospitallist: map
        })
      }
    });

    this.linechange()
  }


  linechange = () => {
    hospitalstatistics([
      this.state.begin,
      this.state.stop,
      this.state.hospitalid,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var num1 = 0;
        var num2 = 0
        for (var i in res.data.data) {
          num1 += parseInt(res.data.data[i].count);
          num2 += parseInt(res.data.data[i].dangerous);
        }
        this.setState({
          two: num1,
          three: num2
        })
      }
      //计算异常次数做多医院
      var maps = {}, dests = [];
      for (var i = 0; i < res.data.data.length; i++) {
        //异常人数数据获取
        var ai = res.data.data[i];
        if (!maps[ai.hospitalid]) {
          dests.push({
            hospitalid: ai.hospitalid,
            data: [ai],
            num: 0,
            totalnum: 0,
          });
          maps[ai.hospitalid] = ai;
        } else {
          for (var j = 0; j < dests.length; j++) {
            var dj = dests[j];
            if (dj.hospitalid == ai.hospitalid) {
              dj.num = dj.num + parseInt(ai.dangerous)
              dj.totalnum = dj.totalnum + parseInt(ai.count)
              dj.data.push(ai);
              break;
            }
          }
        }
      }
      //存在数据的医院的数组
      var usualarr = []
      var unusualarr = []
      for (var i in dests) {
        if (parseInt(dests[i].num) != 0) {
          unusualarr.push(this.state.hospitallist[dests[i].hospitalid])
        }
        if (parseInt(dests[i].totalnum) != 0) {
          usualarr.push(this.state.hospitallist[dests[i].hospitalid])
        }
      }
      //通过存在数据的医院筛选有用的数据
      var arrs = []
      for (var i in res.data.data) {
        if (usualarr.includes(this.state.hospitallist[res.data.data[i].hospitalid])) {
          arrs.push({
            "city": this.state.hospitallist[res.data.data[i].hospitalid],
            'month': moment(res.data.data[i].date).format("YYYY-MM-DD"),
            'temperature': parseInt(res.data.data[i].count),
          })
        }
      }

      var arr = []
      for (var i in res.data.data) {
        if (unusualarr.includes(this.state.hospitallist[res.data.data[i].hospitalid])) {
          arr.push({
            "city": this.state.hospitallist[res.data.data[i].hospitalid],
            'month': moment(res.data.data[i].date).format("YYYY-MM-DD"),
            'temperature': parseInt(res.data.data[i].dangerous),
          })
        }
      }

      var max = 0;
      for (var i in dests) {
        if (max > parseInt(dests[i].num)) {
          max = max
        } else {
          max = parseInt(dests[i].num)
          this.setState({
            four: this.state.hospitallist[dests[i].hospitalid]
          })
        }
      }

      this.setState({
        usualtype: usualarr,
        unusualtype: unusualarr,
        tongjilist: arr,
        totallist: arrs,
      })

    });
  }

  handleCancel = () => {
    this.setState({
      pleadingvisible: false
    })
  }

  weeklist = () => {
    this.setState({
      begin: moment(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
      stop: moment(new Date().getTime()).format("YYYY-MM-DD"),
      weekback: 'green',
      monthback: '#1890ff',
    }, function () {
      this.linechange()
    })
  }

  monthlist = () => {
    this.setState({
      begin: moment(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
      stop: moment(new Date().getTime()).format("YYYY-MM-DD"),
      weekback: '#1890ff',
      monthback: 'green',
    }, function () {
      this.linechange()
    })
  }

  hospitalchange = (value) => {
    this.setState({
      hospitalid: value
    }, function () {
      this.linechange()
    })
  }

  queryall = () => {
    this.setState({
      hospitalid: null
    }, function () {
      this.linechange()
    })
  }



  render() {
    const prooptions = this.state.hospitalion.map((province) => <Option key={province.id}  >{province.value}</Option>);
    const cols = {
      sales: {
        alias: '标题名称'
      },
      month: {
        range: [0.05, 0.98]
      },

    };

    const ds = new DataSet();
    const dvs = ds.createView().source(this.state.tongjilist);
    dvs.transform({
      type: "fold",
      fields: this.state.unusualtype,
      // 展开字段集
      key: "type",
      // key字段
      value: "value" // value字段
    });

    const dv = ds.createView().source(this.state.totallist);
    dv.transform({
      type: "fold",
      fields: this.state.usualtype,
      // 展开字段集
      key: "type",
      // key字段
      value: "value" // value字段
    });



    return (
      <Layout id="tempstatistic">
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="信息统计" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary" style={{ background: this.state.weekback, border: 'none', marginLeft: '20px' }} onClick={this.weeklist} >
                    近一周
                  </Button>
                  <Button type="primary" style={{ background: this.state.monthback, border: 'none', marginLeft: '20px' }} onClick={this.monthlist}>
                    近一月
                  </Button>
                  {/* <Button type="primary" style={{ background: this.state.yearback, border: 'none', marginLeft: '20px' }} onClick={this.monthlist}>
                    近一年
                  </Button> */}
                </div>
              }
            >
              <div>
                <div style={{ background: '#ECECEC', padding: '20px' }}>
                  <Row gutter={24}>
                    <Col span={6}>
                      <Card>
                        <Statistic
                          title="医院总数"
                          value={this.state.one}
                          // precision={2}
                          valueStyle={{ color: '#3f8600', textAlign: 'center' }}
                          // prefix={<Icon type="arrow-up" />}
                          suffix="所"
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic
                          title="提交总人数"
                          value={this.state.two}
                          // precision={2}
                          valueStyle={{ color: 'blue', textAlign: 'center' }}
                          // prefix={<Icon type="arrow-down" />}
                          suffix="人"
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic
                          title="异常总人数"
                          value={this.state.three}
                          // precision={2}
                          valueStyle={{ color: '#cf1322', textAlign: 'center' }}
                          // prefix={<Icon type="arrow-down" />}
                          suffix="人"
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic
                          title="异常人次最多网点"
                          value={this.state.four}
                          // precision={2}
                          valueStyle={{ color: 'orange', textAlign: 'center', fontSize: "20px" }}
                        // prefix={<Icon type="arrow-down" />}
                        // suffix="分"
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
                <div style={{ marginBottom: "20px", marginTop: '20px' }}>
                  医院名称&nbsp;: &nbsp;&nbsp;&nbsp;
                <Select
                    style={{ width: '200px', marginRight: '20px' }}
                    placeholder="请选择所属网点"
                    onChange={this.hospitalchange}
                  >
                    {prooptions}
                  </Select>
                  <Button type="primary" onClick={this.queryall} >
                    返回所有
                  </Button>
                </div>
                <div className="areatitle">
                  异常人数统计
                </div>
                <div style={{ padding: '10px' }}>
                  <Chart height={300} data={dvs} scale={cols} forceFit>
                    <Axis name="month" />
                    <Axis name="temperature"
                      label={{
                        formatter: val => `${val}人`
                      }}
                    />
                    <Legend />
                    <Tooltip
                      crosshairs={{
                        type: "y"
                      }}
                    />
                    <Geom type="interval"
                      position="month*temperature"
                      color={"city"}

                      tooltip={[
                        'month*temperature*city', (month, temperature, city) => {
                          return {
                            name: city,
                            value: temperature + "人"
                          }
                        }
                      ]}
                    />
                  </Chart>
                  {/* <Chart height={300} data={data} scale={cols} forceFit>
                    <Legend />
                    <Axis name="month" />
                    <Axis
                      name="temperature"
                      // title={title}
                      label={{
                        formatter: val => `${val}人`
                      }}
                    />
                    <Tooltip
                      crosshairs={{
                        type: "y"
                      }}
                    />
                    <Geom
                      type="area"
                      position="month*temperature"
                      size={2}
                      color={"city"}
                      shape={"smooth"}
                      tooltip={[
                        'month*temperature*city', (month, temperature, city) => {
                          return {
                            name: city,
                            value: temperature + "人"
                          }
                        }
                      ]}
                    />
                    <Geom
                      type="point"
                      position="month*temperature"
                      size={4}
                      shape={"circle"}
                      color={"city"}
                      style={{
                        stroke: "#fff",
                        lineWidth: 1
                      }}
                    />
                  </Chart> */}
                </div>

                <div className="areatitle">
                  提交总人数统计
                </div>
                <div style={{ padding: '10px' }}>
                  <Chart height={300} data={dv} scale={cols} forceFit>
                    <Axis name="month" />
                    <Axis name="temperature"
                      label={{
                        formatter: val => `${val}人`
                      }}
                    />
                    <Legend />
                    <Tooltip
                      crosshairs={{
                        type: "y"
                      }}
                    />
                    <Geom type="interval"
                      position="month*temperature"
                      color={"city"}
                      tooltip={[
                        'month*temperature*city', (month, temperature, city) => {
                          return {
                            name: city,
                            value: temperature + "人"
                          }
                        }
                      ]}
                    />
                  </Chart>
                </div>
              </div>
            </Card>
          </Content>
        </Layout>
      </Layout >
    );
  }
}

export default App;
