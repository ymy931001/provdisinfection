import React from 'react'
// import VideoPlayer from '../VideoPlayer/VideoPlayer';
// import ReactPlayer from 'react-player'
import 'video.js/dist/video-js.css'
import 'videojs-flash'
// import videojs from 'video.js'
// import { Player } from 'video-react';
import { Link } from 'react-router-dom';
import {
  Layout,
  Card,
  Button,
} from "antd";

import "./video.css";

const { Content} = Layout;


// const url = [
//   {
//     url: "rtmp://58.200.131.2:1935/livetv/hunantv",
//     name: "湖南卫视"
//   },
//   {
//     url: "rtmp://47.98.249.97:1935/vod/openUrl/zKbw6Kk",
//     name: "香港财经"
//   }
// ]



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
  }

  componentDidMount() {
    // const videoJsOptions = {
    //   autoplay: true,
    //   controls: true,
    //   sources: [{
    //     src: localStorage.getItem('backid'),
    //     type: 'rtmp/flv'
    //   }]
    // }
    // this.player = videojs('my-video', videoJsOptions, function onPlayerReady() { //(id或者refs获取节点，options，回调函数)
    //   videojs.log('Your player is ready!');
    //   // In this context, `this` is the player that was created by Video.js.
    //   this.play();
    //   // How about an event listener?
    //   this.on('ended', function () {
    //     videojs.log('Awww...over so soon?!');
    //   });
    // });
  }

  handleClick(item) {
    if (item.name === this.state.nowPlay) {
      return
    }
    this.setState({
      nowPlay: item.name
    })
    this.player.pause();
    this.player.src(item.url);
    this.player.load();
    this.player.play();
  }


  render() {
    // let li = {
    //   background: "cadetblue",
    //   padding: "11px",
    //   width: "fit-content",
    //   marginBottom: "5px",
    //   cursor: "pointer"
    // }
    // let playing = {
    //   background: "rgb(141, 182, 28)",
    //   padding: "11px",
    //   width: "fit-content",
    //   marginBottom: "5px",
    //   cursor: "pointer"
    // }
    return (
      <Layout>

        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title={`${localStorage.getItem('hotelnames')}-${localStorage.getItem('floor')}-监控视频`}
              extra={
                <Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px' }} onClick={this.showModal}>
                  <Link to="/app/hotelvideo">返回</Link>
                </Button>
              }
            >
              <div style={{ bottom: '0' }}>
                {/* <ul style={{ listStyleType: "decimal-leading-zero", float: "left" }}>
                  {
                    url.map((item, index) => {
                      return <li style={{ height: 60 }} key={item.name} onClick={() => this.handleClick(item)}>
                        <span style={this.state.nowPlay === item.name ? playing : li}>{item.name}</span>
                      </li>
                    })
                  }
                </ul> */}
                {/* <video style={{ width: "50vw", height: "50vh", margin: "0 auto" }} id="my-video" className="video-js vjs-default-skin">
                </video> */}
                {/* <object type='application/x-vlc-plugin' pluginspage="http://www.videolan.org/" id='vlc' events='false' width="720" height="410">
                  <param name='mrl' value='rtsp://39.107.227.244:554/openUrl/nqgr7YQ' />
                  <param name='volume' value='50' />
                  <param name='autoplay' value='true' />
                  <param name='loop' value='false' />
                  <param name='fullscreen' value='false' />
                  <param name='controls' value='false' />
                </object> */}

                {/* <object type='application/x-vlc-plugin' id='vlc' events='True' width="720" height="540" 
                pluginspage="http://www.videolan.org" codebase="http://downloads.videolan.org/pub/videolan/vlc-webplugins/2.0.6/npapi-vlc-2.0.6.tar.xz">

                  <param name='mrl' value='rtsp://39.107.227.244:554/openUrl/nqgr7YQ' />

                  <param name='volume' value='50' />

                  <param name='autoplay' value='true' />

                  <param name='loop' value='false' />

                  <param name='fullscreen' value='false' />

                </object> */}
                {/* <Player

                  playsInline

                  src="rtsp://39.107.227.244:554/openUrl/Po6WbBe"

                /> */}
                {/* <video id="test_video" controls autoPlay="autoplay" 
                src="rtsp://39.107.227.244:554/openUrl/Po6WbBe" 
                type="application/x-rtsp" data-ignore="true"></video> */}

                {/* <video width="100%" controls="controls" autoPlay="autoplay" >
                  <source src="rtmp://47.98.249.97:1935/vod/openUrl/zKbw6Kk" type="rtmp/mp4" />
                </video> */}
                {/* <video width="100%" id="liveVideo" class="video-js" controls autoplay preload="auto" width="1280"
                  height="720" data-setup="{}" >
                  <source src="rtmp://58.200.131.2:1935/livetv/hunantv" type="rtmp/mp4" autoPlay="autoplay" loop="loop" />
                </video> */}
                <video width="100%" controls="controls" type="video/mp4" autoPlay="autoplay" loop="loop" id="example-video" >
                  <source src={'https://iva.terabits.cn' + localStorage.getItem('videoid')} type='video/mp4' autoPlay="autoplay" loop="loop" />
                </video>
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout >
    );
  }
}

export default App;