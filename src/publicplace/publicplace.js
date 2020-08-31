import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Input,
  Modal,
  Cascader,
  Select,
  Transfer,
  Popconfirm,
  DatePicker,
  Form
} from "antd";
import {
  userlist,
  hotellist,
  addUserAlarm,
  removeUserAlarm,
  adduser,
  getAreaMap
} from "../axios";
import "./publicplace.css";
import moment from 'moment';
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceList: [{
        value: '浙江大学医学院附属第二医院',
        label: '浙江大学医学院附属第二医院',
        children: [
          {
            value: '医疗废物处2',
            label: '医疗废物处2',
          },
        ],
      }
      ],
    };




  }


  componentWillMount() {
    document.title = "分析报告";
  }

  componentDidMount() {
  }



  //选择时间
  timeonChange = (value, dateString) => {
    this.setState({
      begintime: dateString[0],
      endtime: dateString[1],
    });
  }



  render() {
    return (
      <Layout style={{ minHeight: "100vh" }} id="cuplistpc">
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="医院医废间--监测报告" id="nodeManage" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <div>
                  <Button type="primary"
                    style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px', }}
                  >
                    <Link to="/app/publicreport">返回</Link>
                  </Button>
                </div>
              }
            >
              <div>
                <div className="header">
                  <div>
                    位置选择&nbsp;: &nbsp;&nbsp;&nbsp;
                  <Cascader
                      options={this.state.deviceList}
                      onChange={this.addresschange}
                      // value={this.state.addresslist}
                      changeOnSelect
                      style={{ width: "250px", marginRight: '20px' }}
                      placeholder="选择房间位置" />
                    {/* <span>场景选择：</span>
                    <Select
                      style={{ width: '250px', marginRight: '20px' }}
                      placeholder="请选择场景"
                      onChange={this.ions}
                    >
                      <Option key="1"  >酒店消毒</Option>
                      <Option key="2"  >影院消毒</Option>
                    </Select> */}
                    时间&nbsp;:&nbsp;&nbsp;
                    <DatePicker onChange={this.onChange} style={{ marginRight: '20px' }} />
                    <Button type="primary" onClick={this.query}>查询</Button>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }} id="publicplace">
                  <table border="1">
                    <tr>
                      <td colSpan="6" className="resulttitle" >视频监测分析报告</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>监测单位</td>
                      <td>浙江大学医学院附属第二医院</td>
                      <td style={{ fontWeight: 'bold' }}>监测日期</td>
                      <td>2020-03-23</td>
                      <td style={{ fontWeight: 'bold' }}>监测地点</td>
                      <td>医疗废物处2</td>
                    </tr>
                    <tr>
                      <td colSpan="6" style={{ fontWeight: 'bold' }}>监测结果</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>监测时长（分）</td>
                      <td colSpan="2">40</td>
                      <td style={{ fontWeight: 'bold' }}>监测次数（次）</td>
                      <td colSpan="2">18</td>
                    </tr>
                    <tr>
                      <td colSpan="6" style={{ fontWeight: 'bold' }}>抓拍详情</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>00:00 ~ 05:59 片段数</td>
                      <td>1</td>
                      <td style={{ fontWeight: 'bold' }}>监测时长（分）</td>
                      <td>5</td>
                      <td style={{ fontWeight: 'bold' }}>异常片段</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>6:00 ~ 11:59 片段数</td>
                      <td>5</td>
                      <td style={{ fontWeight: 'bold' }}>监测时长（分）</td>
                      <td>20</td>
                      <td style={{ fontWeight: 'bold' }}>异常片段</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>12:00 ~ 17:59 片段数</td>
                      <td>8</td>
                      <td style={{ fontWeight: 'bold' }}>监测时长（分）</td>
                      <td>15</td>
                      <td style={{ fontWeight: 'bold' }}>异常片段</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>18:00 ~ 23:59 片段数</td>
                      <td>4</td>
                      <td style={{ fontWeight: 'bold' }}>监测时长（分）</td>
                      <td>5</td>
                      <td style={{ fontWeight: 'bold' }}>异常片段</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td colSpan="6" style={{ fontWeight: 'bold' }}>抓拍图片</td>
                    </tr>
                    <tr>
                      <td colSpan="6" style={{ padding: "20px" }}>
                        <img src="http://scdisinfection.terabits.cn/detection/1/backup/2020-03-05/027116.jpg" alt="" style={{ width: "50%" }} />
                        <img src="http://scdisinfection.terabits.cn/detection/1/backup/2020-03-08/019885.jpg" alt="" style={{ width: "50%" }} />
                      </td>
                    </tr>
                  </table>
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
