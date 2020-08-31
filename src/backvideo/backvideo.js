import React from 'react'
import 'video.js/dist/video-js.css'
import 'videojs-flash'
import { Link } from 'react-router-dom';
import {
  Carousel,
  Layout,
  Card,
  Button,
} from "antd";
import "./backvideo.css";

const { Content} = Layout;

class App extends React.Component {
  state = {
    imglist: !localStorage.getItem('backlist') ? [] : JSON.parse(localStorage.getItem('backlist'))
  };


  componentWillMount() {
    document.title = "图片回放";
  }

  componentDidMount() {

  }

  render() {
    const imgoption = this.state.imglist.map((img) => <div>
      <img src={"http://iva.terabits.cn" + img} alt="" style={{ width: "100%" }} />
    </div>)
    return (
      <Layout>

        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title={"录像回放"}
              extra={
                <Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC' }}>
                  <Link to="/app/guestroomvideo">返回</Link>
                </Button>
              }
            >
              <div style={{ bottom: '0', padding: '20px 10%' }}>
                <Carousel autoplay effect="fade">
                  {imgoption}
                </Carousel>
              </div>
            </Card>
          </Content>
        </Layout>
      </Layout >
    );
  }
}

export default App;