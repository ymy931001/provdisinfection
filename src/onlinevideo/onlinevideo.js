import React from 'react'
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import {
  Layout,
  Card,
  Button
} from "antd";
// import Hls from 'hls.js';

import "./onlinevideo.css";
import { Link } from 'react-router-dom';


const { Content } = Layout;


class App extends React.Component {
  state = {
    pic_address_0: null,
    pic_address_1: null,
    name: null,
    start_time: null,
    end_time: null

  };


  componentWillMount() {
    document.title = "监控视频";
    //   if (this.player) {
    //     this.player.dispose();
    // }
  }

  componentDidMount() {
    // const video = document.getElementById('hlsVedio');
    // if (Hls.isSupported()) {
    //   const hls = new Hls();
    //   this.hls = hls;
    //   hls.loadSource(localStorage.getItem('videoid'));
    //   hls.attachMedia(video);
    //   hls.on(Hls.Events.MANIFEST_PARSED, function () {
    //     video.play();
    //   });
    // } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    //   video.src = localStorage.getItem('videoid');
    //   video.addEventListener('loadedmetadata', function () {
    //     video.play();
    //   });
    // }
  }


  render() {
    // var player = cyberplayer("playercontainer").setup({
    //   image: "../video/banner0.png",//相当于video标签的poster图片
    //   width: 1280,
    //   height: 720,
    //   stretching: "uniform",
    //   //        file: "http://play.bcelive.com/live/lss-hbzkvrv1bucqcb0y.flv",
    //   file: "http://hbruagstgnqx15jf9xv.exp.bcelive.com/lss-hbzkvrv1bucqcb0y/live.m3u8",//需要播放的流地址。
    //   autostart: false,
    //   repeat: false,
    //   volume: 100,
    //   controls: true,
    //   isLive: true,
    //   type: "m3u8",
    //   rtmp: {
    //     reconnecttime: 10,
    //     bufferlength: 1
    //   },
    //   ak: "xxxxxxxxxxxxxxxx" // 公有云平台注册即可获得accessKey
    // });
    return (
      <Layout >

        <Layout>
          <Content style={{ margin: "16px 16px" }}>
            <Card title={`${localStorage.getItem('hotelnames')}-监控视频`} headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={<Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px' }} onClick={this.showModal}
              >
                <Link to="/app/equipment">返回</Link>
              </Button>}>
              <div style={{ bottom: '0' }}>
                {/* <video width="85%" controls="controls" type="application/x-mpegURL" autoPlay="autoplay" loop="loop" controls id="example-video">
                  <source src='http://szpaasalihlsgw.lechange.cn:9001/LCO/5D0621EPAJC2831/0/1/20190910173317/dev_20190910173317_zka3q48z5nadadpc.m3u8' type="application/x-mpegURL" loop="loop" />
                </video> */}
                {/* <video id="hlsVedio"></video> */}
                {/* <p>时间段：{this.state.start_time}-{this.state.end_time}</p> */}
                {/* <ReactPlayer url='http://szpaasalihlsgw.lechange.cn:9001/LCO/5D0621EPAJC2831/0/1/20190911141626/dev_20190911141626_0pkhkeins3s1kfns.m3u8' playing /> */}
                {/* <video src="rtsp://39.107.227.244:554/openUrl/e4iRZU4" controls="controls"></video> */}
                <VideoPlayer

                  // src="rtsp://39.107.227.244:554/openUrl/e4iRZU4"
                 src={localStorage.getItem('videoid')}
                ></VideoPlayer>

                {/* <video width="100%" controls="controls" type="application/x-mpegURL" autoPlay="autoplay" loop="loop"  >
                  <source src={localStorage.getItem('videoid')} type='application/x-mpegURL' />
                </video> */}
                {/* <video width="85%"  autoPlay="autoplay" loop="loop" controls id="example-video" preload="auto"> 
                  <source src={'http://disinfection.terabits.cn' + localStorage.getItem('videoid')} type='video/mp4' autoPlay="autoplay" loop="loop" />
                  <source src='http://szpaasalihlsgw.lechange.cn:9001/LCO/5D0621EPAJC2831/0/1/20190910173317/dev_20190910173317_zka3q48z5nadadpc.m3u8'  type="application/x-mpegURL"></source>
                </video> */}
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout >
    );
  }
}

export default App;