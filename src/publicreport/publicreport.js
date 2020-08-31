import React from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Cascader,
  DatePicker
} from "antd";
import {

} from "../axios";
import "./publicreport.css";
import { Link } from 'react-router-dom';
import moment from 'moment';

const { Content } = Layout;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      typenone: "inline-block",
      deviceList: [
        {
          label: '杭州市第三人民医院',
          value: '杭州市第三人民医院',
        },
        {
          label: '浙江大学医学院附属第二医院',
          value: '浙江大学医学院附属第二医院',
          children: [{
            label: '医疗废物处2',
            value: '医疗废物处2',
          }]
        },
      ],
      sitelist: [
        {
          "sitename": "浙江大学医学院附属第二医院",
          "adminName": "医疗废物处2",
          "date": '2020-04-15',
          "result": 1,
          "id": 1
        },
        {
          "sitename": "浙江大学医学院附属第二医院",
          "adminName": "医疗废物处2",
          "date": '2020-04-14',
          "result": 1,
          "id": 1
        },
        {
          "sitename": "浙江大学医学院附属第二医院",
          "adminName": "医疗废物处2",
          "date": '2020-04-13',
          "result": 1,
          "id": 1
        }
      ]
    };
    this.nodeInfoTableColumns = [
      {
        title: "医院名称",
        dataIndex: "sitename",
      },
      {
        title: "监控酒店",
        dataIndex: "adminName",
      },
      {
        title: "监测日期",
        dataIndex: "date",
      },
      // {
      //   title: "监测结果",
      //   dataIndex: "result",
      // },
      {
        title: "监测报告",
        dataIndex: "id",
        render: (text, record, index) => {
          return (
            <div>
              <a>
                <Link to="/app/publicplace">查看</Link>
              </a>
            </div>
          )
        }
      },
    ];


  }

  componentWillMount() {
    document.title = "医废管理监测报告";
  }

  componentDidMount() {
    // sitelist().then(res => {
    //   if (res.data && res.data.message === "success") {
    //     this.setState({
    //       sitelist: res.data.data
    //     }, function () {
    //       if (res.data.data.length < 10) {
    //         this.setState({
    //           page: false
    //         })
    //       } else {
    //         this.setState({
    //           page: true
    //         })
    //       }
    //     });
    //   }
    // });
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }


  //设备位置选择
  addresschange = (e) => {
    console.log(e)
    this.setState({
      site: e[0],
      name: e[1],
      addresslist: e
    });
  }

  render() {
    const nodeInfoTableColumns = this.nodeInfoTableColumns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="医废管理--监测报告" id="nodeManage" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}>
              <div className="gutter-example-nodemanage">
                设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                <Cascader
                  options={this.state.deviceList}
                  onChange={this.addresschange}
                  value={this.state.addresslist}
                  changeOnSelect
                  style={{ width: "250px", marginRight: '20px' }}
                  placeholder="选择医废间" />
                    时间&nbsp;:
                    <RangePicker
                  style={{ marginLeft: '20px', marginRight: '20px' }}
                  format={dateFormat}
                  ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                  onChange={this.timeonChange}
                // value={[moment(this.state.begintime, dateFormat), moment(this.state.endtime, dateFormat)]}
                />
                <Button type="primary" onClick={this.query}>查询</Button>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Table
                  dataSource={this.state.sitelist}
                  columns={nodeInfoTableColumns}
                  pagination={this.state.page}
                />
              </div>
            </Card>
          </Content>
        </Layout>
      </Layout >
    );
  }
}

export default App;
