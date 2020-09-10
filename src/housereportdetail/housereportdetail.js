import React from "react";
import {
  Layout,
  Card,
  Button,
} from "antd";
import {
  sitelist,
  detectionService,
  getDeviceList,
  gethandheld
} from "../axios";
import "./housereportdetail.css";
import moment from 'moment';
import { Link } from 'react-router-dom';

const { Content } = Layout;



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chazuo: 'none',
      pageNum: 1,
      pageNumSize: 10,
      reportlist: [],
      imgdis: 'none',
      roomlist: [],
      detection: [],
      timelist: [],
      sitelist: {},
      timelist1: [],
      handledata: [],
      picturelist: [],
      // resdis: 'none',
      // unresdis: 'none',
      // unreport: 'none',
      // cameradis: 'none',
      // resultyes: 'none',
      // resultno: 'none',
      time1list: [],
      time2list: [],
    };




  }


  componentWillMount() {
    document.title = "酒店消毒--监测报告";
    getDeviceList().then(res => {
      this.setState({
        deviceList: res.data.data
      })
    });
    this.detectionService()

    sitelist([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var arr = {}
        var arrs = []
        for (var i in res.data.data) {
          arr[res.data.data[i].id] = res.data.data[i].sitename
          arrs.push({
            'id': res.data.data[i].id,
            "name": res.data.data[i].sitename,
          })
        }
        console.log(arr)
        this.setState({
          sitelist: arr,
          hotellist: arrs
        });
      }
    });
  }

  componentDidMount() {


  }


  detectionService = () => {
    gethandheld([
      this.state.pageNum,
      this.state.pageNumSize,
      null,
      null,
      localStorage.getItem('reportsite'),
      localStorage.getItem('reportdate'),
      localStorage.getItem('reportdate'),
      null,
      localStorage.getItem('cameraName'),
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        if (res.data.data.detectionVOList.length === 0) {
          this.setState({
            unreport: 'block',
            chazuo: 'none',
            cameradis: 'none',
          })
        } else {
          if (res.data.data.detectionVOList[0].picture != undefined) {   //eslint-disable-line
            var arr = []
            for (var i in JSON.parse(res.data.data.detectionVOList[0].picture)) {
              if (i < 4) {
                arr.push(JSON.parse(res.data.data.detectionVOList[0].picture)[i])
              }
            }
            console.log(arr)
            this.setState({
              handledata: res.data.data.detectionVOList[0],
              picturelist: arr,  //eslint-disable-line
            }, function () {
              console.log(this.state.handledata.date)
              console.log(this.state.picturelist)
              if (this.state.picturelist.length === 0) {
                this.setState({
                  imgdis: 'block'
                })
              }
            })
          } else {
            this.setState({
              handledata: res.data.data.detectionVOList[0],
              picturelist: [],
              imgdis: 'block'
            })
          }

        }
      }
    })
  }


  //选择时间
  onChange = (value, dateString) => {
    console.log(value, dateString)
    this.setState({
      time: dateString,
    });
  }

  //设备位置选择
  addresschange = (e) => {
    console.log(e)
    this.setState({
      site: e[0],
      name: e[1],
      addresslist: e
    });
  }

  //查询
  query = () => {
    detectionService([
      this.state.pageNum,
      this.state.pageNumSize,
      this.state.site,
      this.state.name,
      this.state.time,
      this.state.time,
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        if (res.data.data.detectionVOList.length === 0) {
          this.setState({
            unreport: 'block',
            chazuo: 'none',
            cameradis: 'none',
          })
        } else {
          this.setState({
            unreport: 'none',
            chazuo: 'none',
            cameradis: 'block',
            detection: res.data.data.detectionVOList[0],
            roomlist: res.data.data.detectionVOList[0],
          }, function () {
            if (this.state.detection.result === 0) {
              this.setState({
                resdis: 'none',
                unresdis: 'block',
                unreport: 'none',
              })
            }
            if (this.state.detection.result === 1) {
              this.setState({
                resdis: 'block',
                unresdis: 'none',
                unreport: 'none',
              })
            }
            console.log(this.state.roomlist)
            console.log(this.state.detection)
          })
        }
      }
    })
  }



  render() {
    const { handledata } = this.state;


    // const timeoption1 = this.state.timelist.map((province) =>
    //   <tr>
    //     <td className="tabletd">{moment(new Date(province.begin)).format('YYYY-MM-DD HH:mm:ss')}</td>
    //     <td className="tabletd">{moment(new Date(province.end)).format('YYYY-MM-DD HH:mm:ss')}</td>
    //     <td className="tabletd">{((new Date(province.end) - new Date(province.begin)) / 60000).toFixed(1)}分钟</td>
    //   </tr>
    // );

    // const timeoption2 = this.state.timelist1.map((province) =>
    //   <tr>
    //     <td className="tabletd" style={{ width: '266px' }}>{moment(new Date(province.start)).format('YYYY-MM-DD HH:mm:ss')}</td>
    //     <td className="tabletd" style={{ width: '266px' }}>{moment(new Date(province.end)).format('YYYY-MM-DD HH:mm:ss')}</td>
    //     <td className="tabletd" style={{ width: '127px' }}>{((new Date(province.end) - new Date(province.start)) / 60000).toFixed(1)}分钟</td>
    //   </tr>
    // );

    const pictureoption = this.state.picturelist.map((province) =>

      <img src={"http://iva.terabits.cn" + province} alt="" style={{ width: "50%" }} />

    );
    return (
      <Layout id="housereportdetail">
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="客房保洁--监测报告" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary"
                    style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px', }}
                  >
                    <Link to="/app/housereport">返回</Link>
                  </Button>
                </div>
              }
            >
              <div>
                {/* <div className="header">
                  <div>
                    位置选择&nbsp;: &nbsp;&nbsp;&nbsp;
                  <Cascader
                      fieldNames={{ label: 'name', value: 'id' }}
                      options={this.state.deviceList}
                      onChange={this.addresschange}
                      // value={this.state.addresslist}
                      changeOnSelect
                      style={{ width: "250px", marginRight: '20px' }}
                      placeholder="选择房间位置" />
                    时间&nbsp;:&nbsp;&nbsp;
                    <DatePicker onChange={this.onChange} style={{ marginRight: '20px' }} />
                    <Button type="primary" onClick={this.query}>查询</Button>
                  </div>
                </div> */}
                {/* <div style={{ fontSize: '80px', textAlign: 'center', marginTop: '100px', display: this.state.unreport }}>
                  暂无报告
                </div> */}
                {/* <div className="reportmain" style={{ display: this.state.chazuo }}> */}
                <div className="reportmain" >
                  {/* <img src={require('./tab2.png')} alt="" className="tabletab" style={{ display: this.state.resdis }} /> */}
                  {/* <img src={require('./tab1.png')} alt="" className="tabletab" style={{ display: this.state.unresdis }} /> */}
                  <div className="reporttitle">
                    客房保洁分析报告
                  </div>
                  <div className="contheader">
                    <div className="contwidth">
                      <span className="conttitle">监测单位：</span>
                      {this.state.sitelist[handledata.siteId]}
                    </div>
                    <div className="contwidth">
                      <span className="conttitle">监测日期：</span>
                      {!handledata.date ? "" : moment(new Date(handledata.date)).format('YYYY-MM-DD')}
                    </div>
                  </div>
                  <div className="contheader">
                    <div className="contwidth">
                      <span className="conttitle">摄像头编号：</span>
                      {handledata.cameraName}
                    </div>
                    <div className="contwidth">
                      <span className="conttitle">监测时长：</span>
                      {(parseFloat(handledata.worktime) / 60).toFixed(1)}分
                    </div>

                  </div>
                  {/* <div className="reportresult" style={{ marginTop: '20px' }} >
                    监测详情
                  </div>
                  <div className="tablescrolls">
                    <table border="1" style={{ width: '100%', textAlign: 'center', border: '1px solid #cacaca', }} align="center">
                      <tr>
                        <td className="tabletitle" style={{ width: '266px' }}>监测开始时间</td>
                        <td className="tabletitle" style={{ width: '266px' }}>监测结束时间</td>
                        <td className="tabletitle" style={{ width: '127px' }}>监测时长</td>
                      </tr>
                    </table>
                  </div> */}
                  {/* <div className="tablescroll">
                    <table border="1" style={{ width: '100%', textAlign: 'center', border: '1px solid #cacaca', borderTop: 'none' }} align="center">
                      {timeoption2}
                    </table>
                  </div> */}
                  <div className="reportresult" style={{ marginTop: '40px' }} >
                    监测图片
                  </div>
                  <div style={{ paddingRight: '45px' }}>
                    {pictureoption}
                    {/* <img src="http://maoyang.terabits.cn/1591070587599.jpg" alt="" style={{ width: "50%" }} />
                    <img src="http://maoyang.terabits.cn/1591077954639.jpg" alt="" style={{ width: "50%" }} />
                    <img src="http://maoyang.terabits.cn/1591079580239.jpg" alt="" style={{ width: "50%" }} />
                    <img src="http://maoyang.terabits.cn/1591083190362.jpg" alt="" style={{ width: "50%" }} /> */}
                  </div>
                  <div style={{ fontSize: '80px', textAlign: 'center', marginTop: '50px', display: this.state.imgdis }}>
                    暂无图片
                  </div>

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
