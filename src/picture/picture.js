import React from "react";
import {
  Layout,
  Card,
} from "antd";

import {
  getPictureAddress
} from "../axios";
import "./picture.css";

const { Content} = Layout;

class App extends React.Component {
  state = {
    pic_address_0: null,
    pic_address_1: null,
    name: null,
    start_time: null,
    end_time: null

  };


  componentWillMount() {
    getPictureAddress([
      localStorage.getItem('pictureid')
    ]).then(res => {
      // let info = res.data.pic_address;
      // this.setState({
      //   name: info.name,
      //   start_time: info.start_time,
      //   end_time: info.end_time,
      //   pic_address_0: info.picture_address_0,
      //   pic_address_1: info.picture_address_1
      // });
    });
  }

  componentDidMount() {
    document.title = "抓拍照片";
  }


  render() {

    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title={`${this.state.name}-抓拍照片`} id="nodeManage">
              <div style={{ bottom: '0', marginTop: 5 }}>
                <p>时间段：{this.state.start_time}-{this.state.end_time}</p>
                <img src={this.state.pic_address_0 ? 'http://127.0.0.1:4100/app' + this.state.pic_address_0 : require('./noimg.jpg')} style={{ width: "45%" }} alt="pic0" />
                <img src={this.state.pic_address_1 ? 'http://127.0.0.1:4100/app' + this.state.pic_address_1 : require('./noimg.jpg')} style={{ width: "45%", marginLeft: "5%" }} alt="pic1" />
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout >
    );
  }
}

export default App;
