import React from "react";
import {
  Layout,
  Card,
  Button,
  Tooltip
} from "antd";
import {
  newdetection,
  detectioncuprecord,
  getDeviceList
} from "../axios";
import "./hotelplace.css";
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
      roomlist: [],
      detection: [],
      timelist: [],
      timelist1: [],
      cuplist: [],
      resdis: 'none',
      unresdis: 'none',
      unreport: 'none',
      cameradis: 'none',
      resultyes: 'none',
      xiaodudis: 'none',
      zhuapaidis: 'none',
      resultno: 'none',
      imgdis: 'none',
      timedisone: 'none',
      workerdiss: 'none',
      cupboarddiss: 'none',
      time1list: [],
      time2list: [],
      timeresult: [],
      cupnum: [],
      worktime: 0.00,
      runtime: 0.00
    };
  }


  componentWillMount() {
    document.title = "酒店消毒--监测报告";
    getDeviceList().then(res => {
      this.setState({
        deviceList: res.data.data
      })
    });

    detectioncuprecord([
      localStorage.getItem('detectionId')
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        if (res.data.data != undefined) { //eslint-disable-line
          if (res.data.data.length != 0) { //eslint-disable-line
            // var arr = "杯具添加记录："
            // for (var i in res.data.data) {
            //   for (var j in JSON.parse(res.data.data[i].detail)) {
            //     arr += JSON.parse(res.data.data[i].detail)[j].name + JSON.parse(res.data.data[i].detail)[j].count + "个，"
            //   }
            //   arr += "时间为 " + moment(res.data.data[0].gmtcreate).format('HH:mm:ss') + "。"
            // }
            this.setState({
              cuplist: res.data.data
            }, function () {
              var cuparr = []
              for (var i in this.state.cuplist) {
                var num = 0
                for (var j in JSON.parse(this.state.cuplist[i].detail)) {
                  num += JSON.parse(this.state.cuplist[i].detail)[j].count
                }
                cuparr[i] = num
              }
              this.setState({
                cupnum: cuparr
              })
            })
          }
        }
      }
    })

    this.detectionService()
  }

  componentDidMount() {


  }


  detectionService = () => {
    newdetection([
      localStorage.getItem('detectionId'),
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          timelist: !res.data.data.readings ? [] : JSON.parse(res.data.data.readings),
          timelist1: !res.data.data.timepairs ? [] : JSON.parse(res.data.data.timepairs),
          detection: res.data.data,
          worktime: parseFloat(res.data.data.worktime / 60).toFixed(2),
          runtime: parseFloat(res.data.data.runtime / 60).toFixed(2),
          roomlist: res.data.data,
          readout: JSON.parse(res.data.data.readings),
          decendingdatas: !res.data.data.timepairs ? [] : JSON.parse(res.data.data.timepairs),
        }, function () {
          console.log(this.state.decendingdatas)
          this.setState({
            timeresult: this.state.readout
          }, function () {
            console.log(this.state.timeresult)
            if (this.state.timeresult.length === 0) {
              this.setState({
                timedisone: 'inline-block',
                timedis: 'none',
              })
            } else {
              this.setState({
                timedisone: 'none',
                timedis: 'inline-block',
              })
            }
          })
          // console.log(timearr)
          if (this.state.roomlist.sceneId === 2) {
            this.setState({
              cameradis: 'block',
            })
          } else {
            this.setState({
              cameradis: 'none',
              chazuo: 'block',
            })
          }


          if (this.state.detection.runtime === 0) {
            this.setState({
              xiaodudis: 'none',
              cupboarddiss: 'none',
            })
          } else {
            this.setState({
              xiaodudis: 'block',
              cupboarddiss: 'inline-block',
            })
          }


          if (this.state.detection.worktime === 0) {
            this.setState({
              zhuapaidis: 'none',
              workerdiss: 'none',
            })
          } else {
            this.setState({
              zhuapaidis: 'block',
              workerdiss: 'inline-block',
            })
          }

          if (this.state.detection.result === 1) {
            this.setState({
              resdis: 'none',
              unresdis: 'block',
              resultyes: 'none',
              resultno: 'inline-block',
            })
          }
          if (this.state.detection.result === 2) {
            this.setState({
              resultyes: 'inline-block',
              resultno: 'none',
              resdis: 'block',
              unresdis: 'none'
            })
          }

          //获取图片
          var imgarr = []
          for (var i in this.state.timelist1) {
            if (this.state.timelist1[i].timePiarsInfo != undefined) {//eslint-disable-line
              if (this.state.timelist1[i].timePiarsInfo[0].file != undefined) { //eslint-disable-line
                imgarr.push(this.state.timelist1[i].timePiarsInfo[0])
              }
            }
          }
          console.log(imgarr)
          if (imgarr.length === 1) {
            this.setState({
              img1: "http://iva.terabits.cn/" + imgarr[0].file,
            })
          }
          else if (imgarr.length === 2) {
            this.setState({
              img1: "http://iva.terabits.cn/" + imgarr[0].file,
              img2: "http://iva.terabits.cn/" + imgarr[1].file,
            })
          } else if (imgarr.length > 2) {
            this.setState({
              img1: "http://iva.terabits.cn/" + imgarr[0].file,
              img2: "http://iva.terabits.cn/" + imgarr[2].file,
            })
          } else {
            this.setState({
              imgdis: 'block'
            })
          }



          if (this.state.readout != null) {
            if (this.state.readout.length != 0) {  //eslint-disable-line
              console.log(111)
              var arr = []
              for (var a in this.state.readout) {
                var num1 = moment(this.state.readout[a].begin).format('HH:mm:ss')
                var num2 = moment(this.state.readout[a].end).format('HH:mm:ss')
                arr.push({
                  'left': ((Number(num1.split(':')[0] * 3600) + Number(num1.split(':')[1] * 60) + Number(num1.split(':')[2])) / 86400).toFixed(5) * 810 + "px",
                  'width': ((Number(num2.split(':')[0] * 3600) + Number(num2.split(':')[1] * 60) + Number(num2.split(':')[2]) -
                    Number(num1.split(':')[0] * 3600) - Number(num1.split(':')[1] * 60) - Number(num1.split(':')[2])) / 864).toFixed(1) <= 0.1 ?
                    '1px' : ((Number(num2.split(':')[0] * 3600) + Number(num2.split(':')[1] * 60) + Number(num2.split(':')[2]) -
                      Number(num1.split(':')[0] * 3600) - Number(num1.split(':')[1] * 60) - Number(num1.split(':')[2])) / 864).toFixed(1) + '%',
                  'time': moment(this.state.readout[a].begin).format('HH:mm:ss') + " ~ " + moment(this.state.readout[a].end).format('HH:mm:ss')
                })
              }
              console.log(arr)
              this.setState({
                time1list: arr,
              })
            }
          }

          if (this.state.decendingdatas != null) {
            if (this.state.decendingdatas.length != 0 && this.state.decendingdatas != null) { //eslint-disable-line
              var newarr = []
              for (var b in this.state.decendingdatas) {
                var num3 = moment(this.state.decendingdatas[b].start).format('HH:mm:ss')
                var num4 = moment(this.state.decendingdatas[b].end).format('HH:mm:ss')
                newarr.push({
                  'left': ((Number(num3.split(':')[0] * 3600) + Number(num3.split(':')[1] * 60) + Number(num3.split(':')[2])) / 86400).toFixed(5) * 810 + "px",
                  'width': ((Number(num4.split(':')[0] * 3600) + Number(num4.split(':')[1] * 60) + Number(num4.split(':')[2]) -
                    Number(num3.split(':')[0] * 3600) - Number(num3.split(':')[1] * 60) - Number(num3.split(':')[2])) / 864).toFixed(1) <= 0.1 ?
                    '1px' : ((Number(num4.split(':')[0] * 3600) + Number(num4.split(':')[1] * 60) + Number(num4.split(':')[2]) -
                      Number(num3.split(':')[0] * 3600) - Number(num3.split(':')[1] * 60) - Number(num3.split(':')[2])) / 864).toFixed(1) + "%",
                  'time': moment(this.state.decendingdatas[b].start).format('HH:mm:ss') + " ~ " + moment(this.state.decendingdatas[b].end).format('HH:mm:ss')
                })
              }
              console.log(newarr)
              this.setState({
                time2list: newarr,
              })
            }
          }
        })




      }
    })
  }


  render() {
    const time1line = this.state.time1list.map((province) =>
      <Tooltip title={province.time}>
        <span style={{ position: 'absolute', width: province.width, left: province.left, height: '10px', top: 0, background: '#b10be8' }} >
        </span>
      </Tooltip>
    );
    const timelines = timelinelist.map((province) =>
      <Tooltip>
        <span style={{ position: 'absolute', width: province.width, left: province.left, height: '5px', top: '-5px', background: '#999' }} >
        </span>
      </Tooltip>
    );
    const time2line = this.state.time2list.map((province) =>
      <Tooltip title={province.time}>
        <span style={{ position: 'absolute', width: province.width, left: province.left, height: '10px', top: '-10px', background: '#139df4' }} ></span>
      </Tooltip>
    );


    const timeoption = this.state.timeresult.map((province) =>
      <div>
        <b>{moment(new Date(province.begin)).format('HH:mm:ss')}~{moment(new Date(province.end)).format('HH:mm:ss')}</b>
             存在一次消毒记录<br />
      </div>
    );

    const cupoption = this.state.cuplist.map((province, index) =>
      <div>
        {JSON.parse(province.detail).map((cup) =>
          <span>
            {cup.name}{cup.count}个，
          </span>)}
          共计
          {this.state.cupnum[index]}个，
          提交时间为 &nbsp;
        <span style={{ fontWeight: 'bold' }}>
          {moment(province.gmtcreate).format('HH:mm:ss')}。
        </span>
        {/* arr += JSON.parse(res.data.data[i].detail)[j].name + JSON.parse(res.data.data[i].detail)[j].count + "个，"
        <b>{moment(new Date(province.begin)).format('HH:mm:ss')}~{moment(new Date(province.end)).format('HH:mm:ss')}</b>
           存在一次消毒记录<br /> */}
      </div>
    );



    const timeoption1 = this.state.timelist.map((province) =>
      <tr>
        <td className="tabletd" style={{ width: '163px' }}>{moment(new Date(province.begin)).format('YYYY-MM-DD HH:mm:ss')}</td>
        <td className="tabletd" style={{ width: '163px' }}>{moment(new Date(province.end)).format('YYYY-MM-DD HH:mm:ss')}</td>
        <td className="tabletd" style={{ width: '78px' }}>{((new Date(province.end) - new Date(province.begin)) / 60000).toFixed(1)}分钟</td>
      </tr>
    );

    const timeoption2 = this.state.timelist1.map((province) =>
      <tr>
        <td className="tabletd" style={{ width: '163px' }}>{moment(new Date(province.start)).format('YYYY-MM-DD HH:mm:ss')}</td>
        <td className="tabletd" style={{ width: '163px' }}>{moment(new Date(province.end)).format('YYYY-MM-DD HH:mm:ss')}</td>
        <td className="tabletd" style={{ width: '77px' }}>{((new Date(province.end) - new Date(province.start)) / 60000).toFixed(1)}分钟</td>
      </tr>
    );

    return (
      <Layout id="hotelplace">
        <Layout>
          <Content style={{ margin: "16px 16px", padding: "0px" }} >
            <Card title="监测报告-杯具消毒" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary"
                    style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px', }}
                  >
                    <Link to="/app/hotelreport">返回</Link>
                  </Button>
                </div>
              }
            >
              <div>
                <div style={{ fontSize: '80px', textAlign: 'center', marginTop: '100px', display: this.state.unreport }}>
                  暂无报告
                </div>
                <div className="reportmain">
                  <img src={require('./tab2.png')} alt="" className="tabletab" style={{ display: this.state.resdis }} />
                  <img src={require('./tab1.png')} alt="" className="tabletab" style={{ display: this.state.unresdis }} />
                  <div className="reporttitle">
                    视频监测分析报告
                  </div>
                  <div className="contheader">
                    <div className="contwidth">
                      <span className="conttitle">监测单位：</span>{localStorage.getItem('hotelname')}
                    </div>
                    <div className="contwidth">
                      <span className="conttitle">监测日期：</span>{localStorage.getItem('reportdate')}
                    </div>
                    <div className="contwidth">
                      <span className="conttitle">监测地点：</span>{localStorage.getItem('roomname')}
                    </div>
                  </div>
                  <div className="contheader">
                    <div className="contwidth">
                      <span className="conttitle">消毒柜型号：</span>ZTD100J-12E
                    </div>
                    <div className="contwidth">
                      <span className="conttitle">消毒柜功率：</span>700W
                    </div>
                    <div className="contwidth">
                      {/* <span className="conttitle">监测结果：</span>
                      <span style={{ color: 'green', display: this.state.resultyes }}>
                        已消毒
                      </span>
                      <span style={{ color: '#d61919', display: this.state.resultno }}>
                        未达标
                      </span> */}
                    </div>
                  </div>
                  <div className="reportresult">
                    监测结果
                  </div>
                  <div className="contheader">
                    <div className="contwidth">
                      <span className="conttitle">保洁人员工作时长(分)：</span>{this.state.worktime}
                      {/* {parseFloat(detection.worktime / 60).toFixed(2)} */}
                    </div>
                    <div className="contwidth">
                      <span className="conttitle">消毒柜工作时长(分)：</span>{this.state.runtime}
                      {/* {parseFloat(detection.runtime / 60).toFixed(2)} */}
                    </div>
                    <div className="contwidth">

                    </div>
                  </div>

                  <div style={{ fontWeight: 'bold', verticalAlign: 'top', color: '#666', display: this.state.timedis }}>经分析得出：该单位于 </div>
                  <div style={{ display: this.state.timedisone, color: 'red', marginBottom: '20px' }}>经分析得出：该单位无消毒记录</div>
                  <div className="resultline">
                    <div style={{ display: 'inline-block', color: '#d61919', marginBottom: '20px' }}>
                      {timeoption}
                    </div>
                  </div>
                  <div style={{ width: '100%', marginBottom: '20px' }}>
                    <div style={{ display: 'inline-block', verticalAlign: 'top', color: '#666', fontWeight: 'bold', }}>杯具添加记录：</div>
                    <div style={{ display: 'inline-block', }} className="cupscroll" >
                      {this.state.cuplist.length > 0 ? cupoption : "无"}
                    </div>
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
                      {time2line}
                      {timelines}
                    </div>
                  </div>
                  <div className="titlebot">
                    <span style={{ display: this.state.workerdiss }}>工作人员消毒时间 <span className="botleft"></span></span>
                    <span style={{ display: this.state.cupboarddiss }}>消毒柜工作时间 <span className="botright"></span></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: this.state.xiaodudis, paddingRight: '20px' }}>
                      <div className="reportresult" >
                        消毒柜工作详情
                      </div>
                      <div>
                        <table border="1" style={{ width: '100%', textAlign: 'center', border: '1px solid #cacaca' }} align="center">
                          <tr>
                            <td className="tabletitle" style={{ width: '163px' }}>监测开始时间</td>
                            <td className="tabletitle" style={{ width: '163px' }}>监测结束时间</td>
                            <td className="tabletitle" style={{ width: '78px' }}>监测时长</td>
                          </tr>
                        </table>
                        <div className="tablescroll">
                          <table border="1" style={{ width: '100%', textAlign: 'center', border: '1px solid #cacaca', borderTop: 'none' }} align="center">
                            {timeoption1}
                          </table>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: this.state.zhuapaidis }}>
                      <div className="reportresult"  >
                        抓拍详情
                      </div>
                      <div className="tablescrolls">
                        <table border="1" style={{ width: '100%', textAlign: 'center', border: '1px solid #cacaca', }} align="center">
                          <tr>
                            <td className="tabletitle" style={{ width: '163px' }}>监测开始时间</td>
                            <td className="tabletitle" style={{ width: '163px' }}>监测结束时间</td>
                            <td className="tabletitle" style={{ width: '76px' }}>监测时长</td>
                          </tr>
                        </table>
                        <div className="tablescroll">
                          <table border="1" style={{ width: '100%', textAlign: 'center', border: '1px solid #cacaca', borderTop: 'none' }} align="center">
                            {timeoption2}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="reportresult" style={{ marginTop: '20px' }} >
                    监测图片
                  </div>
                  <div style={{ paddingRight: '45px', textAlign: 'center' }}>
                    <img src={this.state.img1} alt="" style={{ width: "50%" }} />
                    <img src={this.state.img2} alt="" style={{ width: "50%" }} />
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
