import React from "react";
import {
  Layout,
  Card,
  Button,
  Input,
  message,
  Select,
} from "antd";
import {
  insertroom,
  hotellist,
  findCleanerBySiteid,
  findCameraWithoutSite,
  listWithoutSite,
  getscene
} from "../axios";
import "./addroom.css";
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { TextArea } = Input;
const Option = Select.Option;


class App extends React.Component {
  state = {
    videoListDataSource: [],
    device_ip: null,
    sitelist: [],
    siteid: '',
    cleanerid: '',
    standard: '',
    typelist: [],
    cameralist: [],
    userdis: 'none',
    superdis: 'none',
    arealist: [],
    cleanerlist: [],
    boardlist: [],
    areaid: undefined,
    scenelist: [],
  };

  componentWillMount() {
    document.title = "添加房间";
  }

  componentDidMount() {
    var arr = []
    hotellist().then(res => {
      console.log(res.data.data)
      for (var i in res.data.data) {
        arr.push({
          'id': i,
          'value': res.data.data[i]
        })
      }
      this.setState({
        sitelist: arr
      });
    });

    var newarr = []
    getscene().then(res => {
      for (var i in res.data.data) {
        newarr.push({
          'id': res.data.data[i].id,
          'value': res.data.data[i].name
        })
      }
      this.setState({
        scenelist: newarr
      });
    });

    //摄像头列表
    findCameraWithoutSite([
    ]).then(res => {
      var arr = []
      for (var i in res.data.data) {
        arr.push({
          'id': res.data.data[i].id,
          'value': res.data.data[i].serial,
        })
      }
      this.setState({
        cameralist: arr
      });
    });

    //插座列表
    listWithoutSite().then(res => {
      if (res.data && res.data.message === "success") {
        console.log(res.data.data)
        var arr = []
        for (var i in res.data.data) {
          arr.push({
            'id': res.data.data[i].id,
            'value': res.data.data[i].mac
          })
        }
        this.setState({
          boardlist: arr
        })
      }
    });

  }

  handleChanges = (value) => {
    console.log(value);
    this.setState({
      siteid: value
    })
  }

  areaChanges = (value) => {
    console.log(value);
    this.setState({
      areaid: value
    })
  }


  submit = () => {
    var roomname = document.getElementById('roomname').value
    if (roomname === "") {
      message.error('请输入房间名字');
    }
    else if (this.state.siteid === "") {
      message.error('请选择酒店');
    }
    else if (this.state.standard === "") {
      message.error('请选择报警阈值');
    }
    else if (this.state.roomtype === "") {
      message.error('请选择房间场景');
    } else {
      insertroom([
        roomname,
        this.state.siteid,
        this.state.cleanerid,
        this.state.standard,
        this.state.scenechange,
        this.state.cameraid,
        this.state.boardid,
        this.state.remark,
      ]).then(res => {
        if (res.data && res.data.message === 'success') {
          message.success('房间添加成功');
          setTimeout(() => {
            window.location.href = "/app/houseroom";
          }, 1000);
        }
      });
    }

  }


  standchange = (value) => {
    console.log(value)
    this.setState({
      standard: value
    })
  }

  //场景选择
  scenechange = (value) => {
    this.setState({
      scenechange: value
    })
  }



  remarkchange = (e) => {
    this.setState({
      remark: e.target.value
    })
  }

  cleanerlist = (value) => {
    this.setState({
      cleanerid: value
    })
  }

  sitechange = (value) => {
    console.log(value)
    this.setState({
      siteid: value
    }, function () {
      findCleanerBySiteid([
        this.state.siteid
      ]).then(res => {
        var arr = []
        for (var i in res.data.data) {
          arr.push({
            'id': res.data.data[i].id,
            'name': res.data.data[i].name
          })
        }
        this.setState({
          cleanerlist: arr
        });
      });
    })
  }

  //摄像头选择
  camerachange = (value) => {
    this.setState({
      cameraid: value,
    })
  }

  //插座选择
  boardchange = (value) => {
    console.log(value.join(','))
    this.setState({
      boardid: value.join(','),
    })
  }




  render() {
    const prooptions = this.state.sitelist.map((province) => <Option key={province.id}  >{province.value}</Option>);
    const sceneoptions = this.state.scenelist.map((province) => <Option key={province.id}  >{province.value}</Option>);
    const cleanerions = this.state.cleanerlist.map((province) => <Option key={province.id}  >{province.name}</Option>);
    const cameraoptions = this.state.cameralist.map((province) => <Option key={province.id}  >{province.value}</Option>);
    const boardoptions = this.state.boardlist.map((province) => <Option key={province.id}  >{province.value}</Option>);
    return (
      <Layout style={{ minHeight: "100vh" }} id="userbody">
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="添加房间" id="nodeManage" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px' }} onClick={this.showModal}>
                  <Link to="/app/houseroom">返回</Link>
                </Button>
              }
            >
              <div className="gutter-example-nodemanage" style={{ textAlign: "right" }}>

              </div>
              <div className='addinput'>
                <span>房间名：</span>
                <Input placeholder="请输入房间名" style={{ width: '60%' }} id="roomname" />
              </div>
              <div className='addinput'>
                <span>所属酒店：</span>
                <Select
                  style={{ width: '60%', marginRight: '20px' }}
                  placeholder="请选择所属酒店"
                  onChange={this.sitechange}
                >
                  {prooptions}
                </Select>
              </div>
              <div className='addinput'>
                <span>负责保洁员（选填）：</span>
                <Select
                  style={{ width: '60%', marginRight: '20px' }}
                  placeholder="请选择所属酒店"
                  onChange={this.cleanerlist}
                >
                  {cleanerions}
                </Select>
              </div>
              <div className='addinput'>
                <span>报警阈值：</span>
                <Select
                  style={{ width: '60%', }}
                  placeholder="请选择报警阈值"
                  onChange={this.standchange}
                >
                  <Option key="1" >1天</Option>
                  <Option key="2" >2天</Option>
                  <Option key="3" >3天</Option>
                </Select>
              </div>
              <div className='addinput'>
                <span>房间场景：</span>
                <Select
                  style={{ width: '60%', marginRight: '20px' }}
                  placeholder="请输入房间场景"
                  onChange={this.scenechange}
                >
                  {sceneoptions}
                </Select>
              </div>
              <div className='addinput'>
                <span>绑定摄像头：</span>
                <Select
                  style={{ width: '60%' }}
                  placeholder="请选择摄像头"
                  onChange={this.camerachange}
                  value={this.state.cameraid}
                >
                  {cameraoptions}
                </Select>
              </div>
              <div className='addinput'>
                <span>绑定插座：</span>
                <Select
                  style={{ width: '60%' }}
                  placeholder="请选择插座"
                  onChange={this.boardchange}
                  mode="multiple"
                  value={this.state.boardid}
                >
                  {boardoptions}
                </Select>
              </div>



              {/* <div className='addinput'>
                <span>策略：</span>
                <Input placeholder="请输入策略" style={{ width: '60%' }} id="strategy" />
              </div> */}
              <div className='addinput'>
                <span>备注：</span>
                <TextArea rows={4} style={{ width: '60%', verticalAlign: 'top' }}
                  onChange={this.remarkchange}
                  value={this.state.remark}
                  placeholder="请输入备注（选填）"
                />
              </div>

              <div className="btn" style={{ textAlign: 'right', marginTop: "20px", width: '80%' }}>
                <Button type="primary" style={{ marginRight: '20px' }} onClick={this.submit}>添加</Button>
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout >
    );
  }
}

export default App;
