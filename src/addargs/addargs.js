import React from "react";
import {
  Layout,
  Card,
  Button,
  Input,
  message,
  Select,
  Tooltip, Icon
} from "antd";
import {
  changeargs,
  argslist
} from "../axios";
import "./addargs.css";
import { Link } from 'react-router-dom';

const { Content } = Layout;
const Option = Select.Option;

// const text = <span>请在图片上框选检测范围</span>;
const text1 = <span>消毒柜消毒所需时长</span>;
const text2 = <span>消毒人员在消毒间停留时长</span>;
const text3 = <span>
  0~0 → 全天检测(24小时制)，<br />0点即为24点，<br /> 监测结束时间不可小于开始时间。
</span>;


class App extends React.Component {
  state = {
    datalist: []
  };

  componentWillMount() {
    document.title = "修改参数";
  }

  componentDidMount() {
    argslist([
      localStorage.getItem('roomid')
    ]).then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          running: res.data.data.running,
          working: res.data.data.working,
          starttime: res.data.data.start,
          stoptime: res.data.data.stop,
          createtime: res.data.data.gmtcreate,
          frequency: res.data.data.frequency,
          grabsize: res.data.data.grabsize,
          mintimepairsremove: res.data.data.mintimepairsremove,
          mergetimepairsscale: res.data.data.mergetimepairsscale,
          mergeindexpiarsscale: res.data.data.mergeindexpiarsscale,
          minindexnumremove: res.data.data.minindexnumremove,
          videoframerate: res.data.data.videoframerate,
          grabframerate: res.data.data.grabframerate,
          imgmat: res.data.data.imgmat,
          videomat: res.data.data.videomat,
        })
      }
    });

  }

  submit = () => {
    changeargs([
      localStorage.getItem('roomid'),
      this.state.running,
      this.state.working,
      this.state.starttime,
      this.state.stoptime,
      this.state.frequency,
      this.state.mintimepairsremove,
      this.state.mergetimepairsscale,
      this.state.mergeindexpiarsscale,
      this.state.minindexnumremove,
      this.state.grabsize,
      this.state.videoframerate,
      this.state.grabframerate,
      this.state.imgmat,
      this.state.videomat,
    ]).then(res => {
      if (res.data && res.data.message === '修改成功') {
        message.success('参数修改成功');
        setTimeout(() => {
          window.location.href = "/app/houseroom";
        }, 1000);
      }
    });
  }

  //工作时间
  running = (e) => {
    this.setState({
      running: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }


  //消毒柜时间
  working = (e) => {
    this.setState({
      working: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }

  //检测开始时间
  starttime = (e) => {
    this.setState({
      starttime: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }

  //检测结束时间
  stoptime = (e) => {
    this.setState({
      stoptime: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }

  //检测频率
  frequency = (e) => {
    this.setState({
      frequency: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }

  //视频转图片帧率
  grabsize = (e) => {
    this.setState({
      grabsize: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }


  //最小时间对
  mintimepairsremove = (e) => {
    this.setState({
      mintimepairsremove: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }

  //合并时间对
  mergetimepairsscale = (e) => {
    this.setState({
      mergetimepairsscale: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }



  //合并索引对
  mergeindexpiarsscale = (e) => {
    this.setState({
      mergeindexpiarsscale: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }

  //最小索引对
  minindexnumremove = (e) => {
    this.setState({
      minindexnumremove: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }

  //最终视频的帧率
  videoframerate = (e) => {
    this.setState({
      videoframerate: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }

  //视频流抓取帧率
  grabframerate = (e) => {
    this.setState({
      grabframerate: e.target.value.replace(/[^0-9.]/g, ''),
    })
  }



  //保存视频的格式
  videomat = (value) => {
    this.setState({
      videomat: value,
    })
  }


  //保存图片的格式
  imgmat = (value) => {
    this.setState({
      imgmat: value,
    })
  }




  render() {
    return (
      <Layout id="addarges">
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="修改参数" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px' }} onClick={this.showModal}>
                  <Link to="/app/houseroom">返回</Link>
                </Button>
              }
            >
              <div className="gutter-example-nodemanage" style={{ textAlign: "right" }}>

              </div>
              <div className='addargsinput'>
                <span>工作时间（单位S）<Tooltip placement="topLeft" title={text2}>
                  <Icon type="question-circle" theme="filled" />
                </Tooltip> ：</span>
                <Input placeholder="请输入工作时间" style={{ width: '250px' }}
                  value={this.state.working}
                  onChange={this.working}
                />
                <span>消毒柜时间（单位S）<Tooltip placement="topLeft" title={text1}>
                  <Icon type="question-circle" theme="filled" />
                </Tooltip> ：</span>
                <Input placeholder="请输入消毒时间" style={{ width: '250px' }}
                  value={this.state.running}
                  onChange={this.running}
                />
              </div>
              <div className='addargsinput'>
                <span>
                  检测开始时间 <Tooltip placement="topLeft" title={text3}>
                    <Icon type="question-circle" theme="filled" />
                  </Tooltip> ：
                </span>
                <Input placeholder="请输入检测开始时间" style={{ width: '250px' }}
                  value={this.state.starttime}
                  onChange={this.starttime}
                />
                <span>检测结束时间：</span>
                <Input placeholder="请输入检测结束时间" style={{ width: '250px' }}
                  value={this.state.stoptime}
                  onChange={this.stoptime}
                />
              </div>
              <div className='addargsinput'>
                <span>检测频率（单位S）：</span>
                <Input placeholder="请输入检测频率" style={{ width: '250px' }}
                  value={this.state.frequency}
                  onChange={this.frequency}
                />
                <span>视频转图片帧率：</span>
                <Input placeholder="请输入视频转图片帧率" style={{ width: '250px' }}
                  value={this.state.grabsize}
                  onChange={this.grabsize}
                />
              </div>
              <div className='addargsinput'>
                <span>最小时间对（单位S）：</span>
                <Input placeholder="请输入最小时间对" style={{ width: '250px' }}
                  value={this.state.mintimepairsremove}
                  onChange={this.mintimepairsremove}
                />
                <span>合并时间对（单位S）：</span>
                <Input placeholder="请输入合并时间对" style={{ width: '250px' }}
                  value={this.state.mergetimepairsscale}
                  onChange={this.mergetimepairsscale}
                />
              </div>
              <div className='addargsinput'>
                <span>合并索引对：</span>
                <Input placeholder="请输入合并索引对" style={{ width: '250px' }}
                  value={this.state.mergeindexpiarsscale}
                  onChange={this.mergeindexpiarsscale}
                />
                <span>最小索引对：</span>
                <Input placeholder="请输入最小索引对" style={{ width: '250px' }}
                  value={this.state.minindexnumremove}
                  onChange={this.minindexnumremove}
                />
              </div>
              <div className='addargsinput'>
                <span>最终视频的帧率：</span>
                <Input placeholder="请输入最终视频的帧率" style={{ width: '250px' }}
                  value={this.state.videoframerate}
                  onChange={this.videoframerate}
                />
                <span>视频流抓取帧率：</span>
                <Input placeholder="请输入视频流抓取帧率" style={{ width: '250px' }}
                  value={this.state.grabframerate}
                  onChange={this.grabframerate}
                />
              </div>
              <div className='addargsinput'>
                <span>保存图片的格式：</span>
                <Select
                  style={{ width: '250px' }}
                  placeholder="请选择保存图片的格式"
                  value={this.state.imgmat}
                  onChange={this.imgmat}
                >
                  {/* <Option value="bmp">bmp</Option> */}
                  <Option value="jpg">jpg</Option>
                  <Option value="png">png</Option>
                  {/* <Option value="gif">gif</Option> */}
                  {/* <Option value="tif">tif</Option> */}
                </Select>
                <span>保存视频的格式：</span>
                <Select
                  style={{ width: '250px' }}
                  placeholder="请选择保存视频的格式"
                  value={this.state.videomat}
                  onChange={this.videomat}
                >
                  <Option value="mp4">mp4</Option>
                  {/* <Option value="avi">avi</Option> */}
                  <Option value="rmvb">rmvb</Option>
                  {/* <Option value="flv">flv</Option>
                  <Option value="rm">rm</Option> */}
                </Select>
              </div>
              <div className='addargsinput'>
                <span>摄像头创建时间：</span>
                <Input style={{ width: '250px', textAlign: 'left' }}
                  value={this.state.createtime}
                  disabled
                />
                <span></span>
                <span></span>

              </div>

              <div className="btn" style={{ textAlign: 'right', marginTop: "20px", width: '80%' }}>
                <Button type="primary" style={{ marginRight: '20px' }} onClick={this.submit}>确认</Button>
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout >
    );
  }
}

export default App;
