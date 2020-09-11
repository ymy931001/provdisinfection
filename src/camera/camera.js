import React from "react";
import {
  Layout,
  Card,
  Button,
  Input,
  message,
  Icon,
  Tooltip
} from "antd";
import {
  devicecover,
  insertargs,
  findById
} from "../axios";
import "./camera.css";
import { Link } from 'react-router-dom';

const { Content} = Layout;
const text = <span>请在图片上框选检测范围</span>;
// const text1 = <span>消毒柜消毒所需时长</span>;
// const text2 = <span>消毒人员在消毒间停留时长</span>;
// const text3 = <span>
//   0~0 → 全天检测(24小时制)，<br />0点即为24点，<br /> 监测结束时间不可小于开始时间。
// </span>;



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      sitelist: [],
      width: 0,
      height: 0,
      xmin: '',
      xmax: '',
      ymax: '',
      ymin: '',
    };



    this.nodeInfoTableColumns = [
      {
        title: "设备ID",
        dataIndex: "deviceId",
      },
      {
        title: "消毒时长（分钟）",
        dataIndex: "running",
      }, {
        title: "停留时长（分钟）",
        dataIndex: "working"
      },
      {
        title: "监测开始时间",
        dataIndex: "start",
      }, {
        title: "监测结束时间",
        dataIndex: "stop"
      },
      {
        title: "创建时间",
        dataIndex: "gmtcreate",
      },
    ];
  }


  componentWillMount() {
    document.title = "摄像头参数";
    this.setState({
      cameraimg: "http://iva.terabits.cn/" + localStorage.getItem('cover')
    })
  }

  componentDidMount() {

    findById([
      localStorage.getItem('cameraid')
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          deviceId: res.data.data.id,
          xmin: res.data.data.xmin,
          xmax: res.data.data.xmax,
          ymax: res.data.data.ymax,
          ymin: res.data.data.ymin,
          widths: res.data.data.xmax - res.data.data.xmin,
          heights: res.data.data.ymax - res.data.data.ymin,
          lefts: res.data.data.xmin,
          tops: res.data.data.ymin,
          borderss: '1px solid red',
          bbox: res.data.data.bbox,
        })
      }
    });




  }


  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  one = (e) => {
    console.log(e.target.value)
    this.setState({
      running: e.target.value
    })
  }

  two = (e) => {
    console.log(e.target.value)
    this.setState({
      working: e.target.value.replace(/[^0-9.]/g, '')
    })
  }

  two = (e) => {
    console.log(e.target.value)
    this.setState({
      working: e.target.value.replace(/[^0-9.]/g, '')
    })
  }

  three = (e) => {
    console.log(e.target.value)
    this.setState({
      start: e.target.value.replace(/[^0-9.]/g, '')
    })
  }

  four = (e) => {
    console.log(e.target.value)
    this.setState({
      stop: e.target.value.replace(/[^0-9.]/g, '')
    })
  }

  addschool = () => {
    if (this.state.ymin === null) {
      message.error('请选择检测范围，在图片中画框')
    } else {
      insertargs([
        this.state.deviceId,
        this.state.xmin,
        this.state.xmax,
        this.state.ymin,
        this.state.ymax,
        this.state.bbox
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          message.success('参数修改成功')
          setTimeout(() => {
            window.location = "/app/equipment"
          }, 1000);
        }
      });
    }
  }

  move = (e) => {
    this.setState({
      right: e.pageX > 1014 ? 1014 : e.pageX,
      bottom: e.pageY > 530 ? 530 : e.pageY,
      lefts: this.state.left - 374,
      tops: this.state.top - 170,
    }, function () {
      this.setState({
        width: this.state.right - this.state.left,
        height: this.state.bottom - this.state.top,
      })
    })
  }

  mousedown = (e) => {
    // var startX, startY;
    // // 是否拖动，初始为 false
    // startX = e.pageX;
    // startY = e.pageY;
    // console.log(e.pageX)
    this.setState({
      left: e.pageX,
      top: e.pageY,
      borders: '1px solid red',
      borderss: 'none',
      width: 0,
      height: 0,
    })
  }
  up = (e) => {
    this.setState({
      borders: 'none',
      borderss: '1px solid red',
    })
    // var startX, startY;
    window.event.stopPropagation()
    // 是否拖动，初始为 false
    // startX = e.pageX;
    // startY = e.pageY;
    console.log(e.pageX)
    this.setState({
      xmin: this.state.left - 374,
      ymax: e.pageY - 170 > 360 ? 360 : e.pageY - 170,
      xmax: e.pageX - 374 > 640 ? 640 : e.pageX - 374,
      ymin: this.state.top - 170,
      right: e.pageX > 1014 ? 1014 : e.pageX,
      bottom: e.pageY > 530 ? 530 : e.pageY,
      lefts: this.state.left - 374 > 640 ? 640 : this.state.left - 374,
      tops: this.state.top - 170 > 360 ? 360 : this.state.top - 170,
    }, function () {
      this.setState({
        width: this.state.right - this.state.left,
        height: this.state.bottom - this.state.top,
        widths: this.state.right - this.state.left,
        heights: this.state.bottom - this.state.top,
      })
    })
  }


  xmin = (e) => {
    this.setState({
      xmin: e.target.value
    })
  }

  ymax = (e) => {
    this.setState({
      ymax: e.target.value
    })
  }

  xmax = (e) => {
    this.setState({
      xmax: e.target.value
    })
  }

  ymin = (e) => {
    this.setState({
      ymin: e.target.value
    })
  }

  bbox = (e) => {
    this.setState({
      bbox: e.target.value
    })
  }

  //刷新图片
  freshen = () => {
    devicecover([
      this.state.deviceId
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        message.success('刷新成功')
        // this.setState({
        //   cameraimg: "http://iva.terabits.cn/" + res.data.data
        // })
        setTimeout(function () {
          window.location.href = "/app/camera";
        }, 1000);
      }
    });
  }


  render() {
    return (
      <Layout >
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="摄像头参数" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary" size='large' onClick={this.freshen} style={{ marginLeft: '20px' }}>刷新封面</Button>
                </div>}
            >
              <div>
                <div style={{ display: 'block', textAlign: 'center' }}>
                  <div style={{ textAlign: 'center', width: "640px", height: '360px', zIndex: '999', position: "relative", marginLeft: "150px" }} id="coordiv"
                    // onMouseOut={this.out} 
                    onMouseDown={this.mousedown}
                    onMouseUp={this.up}
                  // onDoubleClick={this.double}
                  >
                    <div style={{
                      position: "absolute",
                      width: '660px',
                      height: '380px',
                      left: "0",
                    }}
                      onMouseMove={this.move}
                    >
                    </div>
                    <div style={{
                      position: "absolute",
                      width: this.state.width,
                      height: this.state.height,
                      top: this.state.tops,
                      left: this.state.lefts,
                      border: this.state.borders,
                      zIndex: '999'
                    }}
                    >
                    </div>
                    <div style={{
                      position: "absolute",
                      width: this.state.widths,
                      height: this.state.heights,
                      top: this.state.tops,
                      left: this.state.lefts,
                      border: this.state.borderss,
                      zIndex: '999'
                    }}
                    >
                    </div>
                    <img src={this.state.cameraimg} alt="" style={{ width: '100%', height: '360px' }} />
                  </div>
                </div>
                <div className="cameraimg">
                  <div style={{ display: "inline-block" }}>
                    <div>
                      <span className="imgtext">设备ID：</span>
                      <Input placeholder="请输入设备ID" id="macname" className="textinput" autoComplete="off" value={this.state.deviceId} disabled
                        style={{ textAlign: 'left' }}
                      />
                    </div>
                    <div>
                      <span className="imgtext">
                        <Tooltip placement="topLeft" title={text}>
                          xmin:
                          <Icon type="question-circle" theme="filled" />
                        </Tooltip>
                      </span>
                      <Input placeholder="请输入xmin:" id="macname" className="textinput" autoComplete="off" value={this.state.xmin} onChange={this.xmin} />
                    </div>
                    <div>
                      <span className="imgtext">xmax:</span>
                      <Input placeholder="请输入xmax" id="macname" className="textinput" autoComplete="off" value={this.state.xmax} onChange={this.xmax} />
                    </div>
                  </div>
                  <div style={{ display: "inline-block", verticalAlign: 'top' }}>
                    <div>
                      <span className="imgtext">
                        <Tooltip placement="topLeft" title={'边框置信度阈值'}>
                          box:
                          <Icon type="question-circle" theme="filled" />
                        </Tooltip>
                      </span>
                      <Input placeholder="请输入bbox" id="macname" className="textinput" autoComplete="off" value={this.state.bbox} onChange={this.bbox} />
                    </div>
                    <div>
                      <span className="imgtext">ymax:</span>
                      <Input placeholder="请输入ymax" id="macname" className="textinput" autoComplete="off" value={this.state.ymax} onChange={this.ymax} />
                    </div>
                    <div>
                      <span className="imgtext">
                        ymin:
                      </span>
                      <Input placeholder="请输入ymin" id="macname" className="textinput" autoComplete="off" value={this.state.ymin} onChange={this.ymin} />
                    </div>
                  </div>
                  <div>
                    <span className="imgtext"></span>
                    <div style={{ width: '460px', textAlign: 'right', marginTop: "20px", display: 'inline-block', }}>
                      <Button type="primary"
                        style={{ marginRight: '20px', background: 'white', border: '1px solid #333', color: '#333' }}
                      >
                        <Link to="/app/equipment">返回</Link>
                      </Button>
                      <Button type="primary" size='large' onClick={this.addschool}>修改</Button>
                    </div>
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
