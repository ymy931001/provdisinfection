import React from "react";
import {
  Layout,
  Card,
  Button, Tooltip
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


const timelinelist = [
  {
    "left": '0%',
    "width": "1px",
  },
  {
    "left": '12.5%',
    "width": "1px",
  },
  {
    "left": '25%',
    "width": "1px",
  },
  {
    "left": '37.5%',
    "width": "1px",
  },
  {
    "left": '50%',
    "width": "1px",
  },
  {
    "left": '62.5%',
    "width": "1px",
  },
  {
    "left": '75%',
    "width": "1px",
  },
  {
    "left": '87.5%',
    "width": "1px",
  },
  {
    "left": '99.8%',
    "width": "1px",
  },
]




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
      time1list: [],
      time2list: [],
    };




  }


  componentWillMount() {
    document.title = "酒店消毒--监测报告";
    this.detectionService()
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


          if (res.data.data.detectionVOList[0].detail != null && res.data.data.detectionVOList[0].detail != "null") {
            if (JSON.parse(res.data.data.detectionVOList[0].detail).length != 0) {  //eslint-disable-line
              var time = JSON.parse(res.data.data.detectionVOList[0].detail)
              var arr = []
              for (var a in time) {
                var num1 = moment(time[a].beginTime).format('HH:mm:ss')
                var num2 = moment(time[a].endTime).format('HH:mm:ss')
                arr.push({
                  'left': ((Number(num1.split(':')[0] * 3600) + Number(num1.split(':')[1] * 60) + Number(num1.split(':')[2])) / 86400).toFixed(5) * 660 + "px",
                  'width': ((Number(num2.split(':')[0] * 3600) + Number(num2.split(':')[1] * 60) + Number(num2.split(':')[2]) -
                    Number(num1.split(':')[0] * 3600) - Number(num1.split(':')[1] * 60) - Number(num1.split(':')[2])) / 864).toFixed(1) <= 0.1 ?
                    '1px' : ((Number(num2.split(':')[0] * 3600) + Number(num2.split(':')[1] * 60) + Number(num2.split(':')[2]) -
                      Number(num1.split(':')[0] * 3600) - Number(num1.split(':')[1] * 60) - Number(num1.split(':')[2])) / 864).toFixed(1) + '%',
                  'time': moment(time[a].beginTime).format('HH:mm:ss') + " ~ " + moment(time[a].endTime).format('HH:mm:ss')
                })
              }
              console.log(arr)
              this.setState({
                time1list: arr,
              })
            }
          }


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
              siteName: res.data.data.detectionVOList[0].siteName,
              timelist1: JSON.parse(res.data.data.detectionVOList[0].detail)
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
              imgdis: 'block',
              siteName: res.data.data.detectionVOList[0].siteName,
              timelist1: JSON.parse(res.data.data.detectionVOList[0].detail)
            }, function () {
              console.log(this.state.timelist1)
            })
          }

        }
      }
    })
  }

  render() {
    const { handledata } = this.state;
    // const timeoption2 = this.state.timelist1.map((province) =>
    //   <tr>
    //     <td className="tabletd" style={{ width: '266px' }}>{moment(new Date(province.beginTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
    //     <td className="tabletd" style={{ width: '266px' }}>{moment(new Date(province.endTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
    //   </tr>
    // );

    const time1line = this.state.time1list.map((province) =>
      <Tooltip title={province.time}>
        <span style={{ position: 'absolute', width: province.width, left: province.left, height: '10px', top: '-10px', background: '#139df4' }} ></span>
      </Tooltip>
    );
    const timelines = timelinelist.map((province) =>
      <Tooltip>
        <span style={{ position: 'absolute', width: province.width, left: province.left, height: '5px', top: '-5px', background: '#999' }} >
        </span>
      </Tooltip>
    );

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
                      {this.state.siteName}
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
                  <div className="reportresult" style={{ marginTop: '40px' }} >
                    监测详情
                  </div>
                  <div style={{ paddingRight: '45px' }}>
                    <div className="timeline" >
                      <div className="lefttime">0时</div>
                      <div className="lefttime1">3时</div>
                      <div className="lefttime2">6时</div>
                      <div className="lefttime3">9时</div>
                      <div className="lefttime4">12时</div>
                      <div className="lefttime5">15时</div>
                      <div className="lefttime6">18时</div>
                      <div className="lefttime7">21时</div>
                      <div className="righttime">24时</div>
                      {time1line}
                      {/* {time2line} */}
                      {timelines}
                    </div>
                  </div>
                  {/* <div className="tablescrolls">
                    <table border="1" style={{ width: '100%', textAlign: 'center', border: '1px solid #cacaca', }} align="center">
                      <tr>
                        <td className="tabletitle" style={{ width: '266px' }}>开始时间</td>
                        <td className="tabletitle" style={{ width: '266px' }}>结束时间</td>
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
