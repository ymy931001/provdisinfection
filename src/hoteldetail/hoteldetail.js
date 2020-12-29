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
  sitedetail,
} from "../axios";
import "./hoteldetail.css";
import { Link } from 'react-router-dom';
import moment from 'moment';

const { Content } = Layout;

const watertype = {
  1: "集中式供水",
  2: "二次供水",
  3: "分散式供水",
  4: "其他",
}

const operationstatus = {
  0: "正常",
  1: "暂停营业",
  2: "关闭",
  3: "注销",
}

const leval = {
  "01": "A",
  "02": "B",
  "03": "C",
  "05": "不予评级",
  "09": "未评级",
}

const jzgslx = {
  1: "公共供水",
  2: "自建设式供水",
  3: "分质供水",
  0: "未选择"
}


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
      datalist: []
    };
  }

  componentWillMount() {
    document.title = "酒店详情";
    sitedetail([
      localStorage.getItem('hotelid'),
    ]).then(res => {
      if (res.data && res.data.message === 'success') {
        this.setState({
          datalist: res.data.data.value
        }, function () {
          console.log(this.state.datalist)
        })
      }
    });
  }

  componentDidMount() {

  }




  render() {
    const { datalist } = this.state
    return (
      <Layout id="hoteldetail">
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title={<span> {localStorage.getItem('hotelname')}酒店详情</span>} headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px' }}>
                  <Link to="/app/hotel">返回</Link>
                </Button>
              }
            >
              <div className="current">
                <div className="current_text">
                  <div className="clearfix" >
                    <div style={{ display: 'inline-block' }}>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">酒店全称：</span>
                        <span className="textright"> {datalist.comp_name}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">法人姓名：</span>
                        <span className="textright"> {datalist.principal}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">法人电话：</span>
                        <span className="textright">{datalist.pphone}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">法人身份证：</span>
                        <span className="textright">{datalist.idcard}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">负责人姓名：</span>
                        <span className="textright">{datalist.applicant}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">负责人电话：</span>
                        <span className="textright">{datalist.applicant_phone}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">社会信用代码：</span>
                        <span className="textright">{localStorage.getItem('creditcode')}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">职工总数：</span>
                        <span className="textright">{datalist.total_staff} 人</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">持健康合格证明人数：</span>
                        <span className="textright">{datalist.total_health_cert} 人</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">应体检人数：</span>
                        <span className="textright">{datalist.test_employees} 人</span>
                      </p>
                    </div>
                    <div style={{ display: 'inline-block' }}>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">详细地址：</span>
                        <span className="textright">{datalist.bus_addr}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">营业面积（m²）：</span>
                        <span className="textright">{datalist.total_area}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">经营状态：</span>
                        <span className="textright">{operationstatus[datalist.operation_status]}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">集中式供水类型：</span>
                        <span className="textright">{jzgslx[datalist.jzgslx]}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">饮用水类型：</span>
                        <span className="textright">{watertype[datalist.water_type]}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">集中空调通风系统：</span>
                        <span className="textright">{datalist.central_air_sys === "1" ? "有" : "无"}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">监督机构编码：</span>
                        <span className="textright">{datalist.r_orgcode}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">处置单位：</span>
                        <span className="textright">{datalist.r_orgname}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">被监督单位唯一标识：</span>
                        <span className="textright">{datalist.comp_no}</span>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">量化等级：</span>
                        <span className="textright">{leval[datalist.project_level1]}</span>
                      </p>
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
