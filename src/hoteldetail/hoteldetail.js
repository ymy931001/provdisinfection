import React from "react";
import {
  Layout,
  Card,
  Button,
  Input,
  message,
  Select,
  Drawer,
  Table,
  Tree,
  Radio, Upload, Icon
} from "antd";
import {
  addsite,
  allProvinceCityDistrict,
  findenterprise, isclist, iscarea, iscdevice
} from "../axios";
import "./hoteldetail.css";
import { Link } from 'react-router-dom';
import moment from 'moment';

const { Content } = Layout;
const { Search } = Input;
const { DirectoryTree } = Tree;
const AMap = window.AMap;
const Option = Select.Option;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      arealist: [],
      iscplatform: [],
      iscplatformid: '',
      activationvalue: null,
      treeData: [],
      xukeimg: 'http://disimg.terabits.cn/timg.jpg'
    };
  }

  componentWillMount() {
    document.title = "酒店详情";
    isclist([
    ]).then(res => {
      if (res.data && res.data.code === 0) {
        var arr = []
        for (var i in res.data.data) {
          arr.push({
            'id': i,
            "value": res.data.data[i]
          })
        }
        this.setState({
          iscplatform: arr
        })
      }
    });
  }

  componentDidMount() {
 
  }


  

  render() {
   
    return (
      <Layout id="mapcontent">
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="酒店详情" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px' }}>
                  <Link to="/app/hotel">返回</Link>
                </Button>
              }
            >
              <div className="current">
                <div className="current_text">
                  <div className="clearfix" >
                    <div className="explains">
                      <p style={{ marginTop: "20px" }}><span className="explainspan">酒店名称：</span> <Input placeholder="请输入单位名称" style={{ width: '60%' }}
                        id="facilityLocation"

                        value={this.state.hotelname}
                        onChange={(e) => this.changeData(e)}
                      /></p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">详细地址：</span>
                        <Input placeholder="请输入详细地址"
                          style={{ width: '60%' }}
                          id="address"
                          value={this.state.hoteladdress}
                          onChange={this.addresschange}
                        /></p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">负责人：</span>
                        <Input placeholder="请输入负责人姓名"
                          style={{ width: '60%' }}
                          value={this.state.personname}
                          onChange={this.personname}
                        /></p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">联系电话：</span>
                        <Input placeholder="请输入联系电话"
                          style={{ width: '60%' }}
                          value={this.state.personphone}
                          onChange={this.personphone}
                        /></p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">所属区域：</span>
                        <Search
                          placeholder="请选择所属区域"
                          enterButton="区域列表"
                          size="middle"
                          onSearch={this.iscquery}
                          value={this.state.cameraname}
                          style={{ width: '60%', fontSize: '14px', verticalAlign: 'middle', textAlign: 'left' }}
                        />
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">杯具管理：</span>
                        <Radio.Group onChange={this.activationchange} value={this.state.activationvalue}>
                          <Radio value={true}>具有此功能</Radio>
                          <Radio value={false}>不具有此功能</Radio>
                        </Radio.Group>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">信用代码：</span>
                        <Input placeholder="请输入信用代码"
                          style={{ width: '60%' }}
                          id="address"
                          value={this.state.creditCode}
                          onChange={this.creditCode}
                        /></p>
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
