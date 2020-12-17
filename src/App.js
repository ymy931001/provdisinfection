import React, { Component } from 'react';
import { } from 'antd';
import './App.css';
import {
  Layout,
  Menu,
  Icon,
  // Card,
  ConfigProvider
} from "antd";
import { Route, Switch, Link } from 'react-router-dom';
import { BankOutlined, RobotOutlined, PushpinOutlined, CloudOutlined } from '@ant-design/icons';
import {
  getsysmenu,
} from "./axios";
import * as config from "./axios/config";


import warning from "./warning/warning";
import picture from "./picture/picture";
import video from "./video/video";
import equipment from "./equipment/equipment";
import user from "./user/user";
import adduser from "./adduser/adduser";
import hotel from "./hotel/hotel";
import addhotel from "./addhotel/addhotel";
import onlinevideo from "./onlinevideo/onlinevideo";
import camera from "./camera/camera";
import socket from "./socket/socket";
import parameter from "./parameter/parameter";
import blockchain from "./blockchain/blockchain";
import sitestatistics from "./sitestatistics/sitestatistics";
import areastatistics from "./areastatistics/areastatistics";
import cleaner from "./cleaner/cleaner";
import houseroom from "./houseroom/houseroom";
import addroom from "./addroom/addroom";
// import temperaturepc from "./temperaturepc/temperaturepc";
// import tempstatistics from "./tempstatistics/tempstatistics";
import cuplistpc from "./cuplistpc/cuplistpc";
import monthstatistics from "./monthstatistics/monthstatistics";
// import hospitalvideo from "./hospitalvideo/hospitalvideo";
import hotelvideo from "./hotelvideo/hotelvideo";
import cinemavideo from "./cinemavideo/cinemavideo";
// import hospitaldisvideo from "./hospitaldisvideo/hospitaldisvideo";
// import publicplace from "./publicplace/publicplace";
import hotelplace from "./hotelplace/hotelplace";
import scene from "./scene/scene";
import role from "./role/role";
import hotelreport from "./hotelreport/hotelreport";
import publicreport from "./publicreport/publicreport";
import power from "./power/power";
import socketdata from "./socketdata/socketdata";
import addargs from "./addargs/addargs";
import guestroomvideo from "./guestroomvideo/guestroomvideo";
import housereport from "./housereport/housereport";
import examine from "./examine/examine";
import platform from "./platform/platform";
import interfaces from "./interfaces/interfaces";
import housereportdetail from "./housereportdetail/housereportdetail";
import erweima from "./erweima/erweima";
import sederweimalist from "./sederweimalist/sederweimalist";
import testpage from "./testpage/testpage";
import backvideo from "./backvideo/backvideo";
import videoback from "./videoback/videoback";
import handleback from "./handleback/handleback";
import videopreview from "./videopreview/videopreview";


import Headers from './headers';
import moment from 'moment';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Content, Sider, Header } = Layout;
const SubMenu = Menu.SubMenu;


class App extends Component {
  rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub6', 'sub7', 'sub10', 'sub11', 'sub12'];

  state = {
    // collapsed: true,
    mode: "inline",
    usertypenone: 'block',
    disnone: "none",
    data1: [],
    data2: [],
    data3: [],
    data4: [],
    data5: [],
    data6: [],
    openKeys: [localStorage.getItem("menuline")],
    // firstHide: false // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
  };

  componentwillMount = () => {


  }
  componentDidMount() {
    if (localStorage.getItem("type") !== '1') {
      this.setState({
        lsdis: 'none',
      })
    }
    if (localStorage.getItem("type") === '4') {
      this.setState({
        hoteldis: 'none',
        // jddis: 'none',
      })
    }


    getsysmenu().then(res => {
      if (res.data && res.data.message === "success") {
        this.setState({
          powerlist: res.data.data,
        }, function () {
          var arrs = this.state.powerlist
          var data1 = []
          var data2 = []
          var data3 = []
          var data4 = []
          var data5 = []
          var data6 = []
          for (var i in arrs) {
            if (arrs[i].id === 85 || arrs[i].id === 86 || arrs[i].id === 87 || arrs[i].id === 96 || arrs[i].id === 94) {
              data1.push(arrs[i])
            }
            if (arrs[i].id === 89 || arrs[i].id === 90 || arrs[i].id === 91 || arrs[i].id === 92 || arrs[i].id === 93 || arrs[i].id === 97) {
              data2.push(arrs[i])
            }
            if (arrs[i].id === 4 || arrs[i].id === 9 || arrs[i].id === 15 || arrs[i].id === 16) {
              data3.push(arrs[i])
            }
            if (arrs[i].id === 6 || arrs[i].id === 7) {
              data4.push(arrs[i])
            }
            if (arrs[i].id === 2 || arrs[i].id === 80 || arrs[i].id === 74) {
              data5.push(arrs[i])
            }
            if (arrs[i].id === 10) {
              data6.push(arrs[i])
            }
          }
          this.setState({
            data1: data1,
            data2: data2,
            data3: data3,
            data4: data4,
            data5: data5,
            data6: data6,
          })
        })
      }
    });


  }

  menuClick = e => {
    console.log(e)
    localStorage.setItem("menuid", e.key)
    localStorage.setItem("menuline", e.keyPath[1])

  };


  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  render() {
    const powers1 = this.state.data1.map((province, id) => <Menu.Item key={province.id}><Link to={province.path}>
      <span> {province.name}</span>
    </Link></Menu.Item>)
    const powers2 = this.state.data2.map((province, id) => <Menu.Item key={province.id}><Link to={province.path}>
      <span> {province.name}</span>
    </Link></Menu.Item>)
    const powers3 = this.state.data3.map((province, id) => <Menu.Item key={province.id}><Link to={province.path}>
      <span> {province.name}</span>
    </Link></Menu.Item>)
    const powers4 = this.state.data4.map((province, id) => <Menu.Item key={province.id}><Link to={province.path}>
      <span> {province.name}</span>
    </Link></Menu.Item>)
    const powers5 = this.state.data5.map((province, id) => <Menu.Item key={province.id}><Link to={province.path}>
      <span> {province.name}</span>
    </Link></Menu.Item>)
    const powers6 = this.state.data6.map((province, id) => <Menu.Item key={province.id}><Link to={province.path}>
      <BankOutlined /><span>{province.name}</span>
    </Link></Menu.Item>)
    return (
      <ConfigProvider locale={zh_CN}>
        <div>
          <Header style={{ display: this.state.mobiledis }}>
            <Headers />
          </Header>
          <Layout>
            <Sider
              collapsed={this.state.collapsed}
              style={{ display: this.state.mobiledis }}
            >
              <Menu theme="dark"
                onClick={this.menuClick}
                mode="inline"
                defaultSelectedKeys={['100']}
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                selectedKeys={[localStorage.getItem("menuid")]}
              >
                <Menu.Item key="0"
                  style={{ display: this.state.hoteldis }}
                >
                  <a href={"http://datav.aliyuncs.com/share/95aef6059199ee86ef8610153005e68e?Authorization=" + localStorage.getItem('authorization')}
                    style={{ color: 'rgba(255, 255, 255, 0.65)', }}>
                    <Icon type="dashboard" /><span>仪表盘</span>
                  </a>
                </Menu.Item>


                <SubMenu
                  key="sub10"
                  title={
                    <span>
                      <Icon type="bar-chart" />
                      <span>运行概览</span>
                    </span>
                  }
                  style={{ display: this.state.jddis }}
                >
                  <Menu.Item key="100"
                  >
                    <Link to="/app/areastatistics">
                      <span>区域概览</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="102"
                  >
                    <Link to="/app/sitestatistics">
                      <span>酒店概览</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="103"
                  >
                    <Link to="/app/warning">
                      <span>报警监测</span>
                    </Link>
                  </Menu.Item>
                </SubMenu>




                <SubMenu
                  key="sub7"
                  style={{ display: this.state.usertypenone }}
                  title={
                    <span>
                      <Icon type="file-exclamation" />
                      <span>监测报告</span>
                    </span>
                  }
                >
                  {powers1}
                  {/* <Menu.Item key="37"
                    style={{ display: this.state.lsdis }}
                  >
                    <Link to="/app/publicreport">
                      <span>医废管理</span>
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="38"
                  >
                    <Link to="/app/hotelreport">
                      <span>酒店消毒</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="40" style={{ display: this.state.lsdis }}
                  >
                    <Link to="/app/fenzreport">
                      <span>分诊监控</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="41" style={{ display: this.state.lsdis }}
                  >
                    <Link to="/app/hotelreport">
                    <span>影院消毒</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="42" style={{ display: this.state.lsdis }}
                  >
                    <Link to="/app/hotelreport">
                    <span>医院消毒</span>
                    </Link>
                  </Menu.Item> */}
                </SubMenu>

                <SubMenu
                  key="sub6"
                  title={
                    <span>
                      <Icon type="video-camera" />
                      <span>视频监测</span>
                    </span>
                  }
                  style={{ display: this.state.usertypenone }}
                >
                  {/* <Menu.Item key="27" style={{ display: this.state.lsdis }}>
                    <Link to="/app/hospitalvideo">
                      <span>医废管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="30" style={{ display: this.state.lsdis }}>
                    <Link to="/app/video_data" >
                      <span>分诊监控</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="31">
                    <Link to="/app/hotelvideo">
                      <span>酒店消毒</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="32" style={{ display: this.state.lsdis }}>
                    <Link to="/app/cinemavideo" >
                      <span>影院消毒</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="33" style={{ display: this.state.lsdis }}>
                    <Link to="/app/hospitaldisvideo"  >
                      <span>医院消毒</span>
                    </Link>
                  </Menu.Item> */}
                  {powers2}
                </SubMenu>
                {/* <SubMenu
                  key="sub7"
                  style={{ display: this.state.usertypenone }}
                  title={
                    <span>
                      <Icon type="file-exclamation" />
                      <span>体温管理</span>
                    </span>
                  }
                >
                  <Menu.Item key="19">
                    <Link to="/app/temperaturepc">
                      <span>体温管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="21">
                    <Link to="/app/tempstatistics" >
                      <span>信息统计</span>
                    </Link>
                  </Menu.Item>
                </SubMenu> */}



                <Menu.Item key="49"
                >
                  <Link to="/app/socketdata">
                    <RobotOutlined />
                    <span>插座监测</span>
                  </Link>
                </Menu.Item>
                <SubMenu
                  key="sub1"
                  title={
                    <span>
                      <Icon type="home" />
                      <span>网点管理</span>
                    </span>
                  }
                  style={{ display: this.state.usertypenone }}
                >
                  {powers3}
                  {/* <Menu.Item key="6">
                    <Link to="/app/hotel">
                      <span>单位管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="15">
                    <Link to="/app/houseroom">
                      <span>房间管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="18" style={{ display: this.state.lsdis }}>
                    <Link to="/app/scene">
                      <span>场景管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="19" style={{ display: this.state.lsdis }}>
                    <Link to="/app/parmer">
                      <span>参数管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="16" style={{ display: this.state.lsdis }}>
                    <Link to="/app/cleaner">
                      <span>保洁员管理</span>
                    </Link>
                  </Menu.Item> */}
                  {/* <Menu.Item key="17">
                    <Link to="/app/hospital">
                      <span>医院管理</span>
                    </Link>
                  </Menu.Item> */}
                </SubMenu>



                {powers6}
                {/* <Menu.Item key="39" style={{ display: this.state.lsdis }}
                >

                  <Link to="/app/cuplistpc">
                    <BankOutlined />
                    <span>酒店管理</span>
                  </Link>
                </Menu.Item> */}


                {/* <SubMenu
                  key="sub4"
                  style={{ display: this.state.usertypenone }}
                  title={
                    <span>
                  
                      <span>数据统计</span>
                    </span>
                  }
                >
                
                  <Menu.Item key="14">
                    <Link to="/app/sitestatistics" >
                      <span>酒店统计</span>
                    </Link>
                  </Menu.Item>
                </SubMenu> */}



                <SubMenu
                  key="sub2"
                  title={
                    <span>
                      <Icon type="laptop" />
                      <span>设备管理</span>
                    </span>
                  }
                  style={{ display: this.state.usertypenone }}
                >
                  {powers4}
                  {/* <Menu.Item key="3" >
                    <Link to="/app/equipment" >
                      <span>摄像头</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="5">
                    <Link to="/app/socket">
                      <span>插座</span>
                    </Link>
                  </Menu.Item> */}
                </SubMenu>




                {/* <Menu.Item key="6">
                  <Link to="/app/hotel">
                    <Icon type="home" />
                    <span>酒店管理</span>
                  </Link>
                </Menu.Item> */}
                {/* 
                <Menu.Item key="13" style={{ display: this.state.lsdis }} >
                  <Link to="/app/areastatistics" >
                    <Icon type="bar-chart" />
                    <span>区域统计</span>
                  </Link>
                </Menu.Item> */}



                <Menu.Item key="59"
                  style={{ display: this.state.lsdis }}
                >
                  <Link to="/app/examine">
                    <PushpinOutlined />
                    <span>审核管理</span>
                  </Link>
                </Menu.Item>

                <SubMenu
                  key="sub3"
                  title={
                    <span>
                      <Icon type="user" />
                      <span>账号管理</span>
                    </span>
                  }
                  style={{ display: this.state.lsdis }}
                >
                  {powers5}
                  {/* <Menu.Item key="7"
                  >
                    <Link to="/app/user">
                      <span>用户管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="11"
                  >
                    <Link to="/app/role">
                      <span>角色管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="12"
                  >
                    <Link to="/app/power">
                      <span>权限管理</span>
                    </Link>
                  </Menu.Item> */}
                </SubMenu>



                <SubMenu
                  key="sub11"
                  title={
                    <span>
                      <CloudOutlined />
                      <span>系统管理</span>
                    </span>
                  }
                  style={{ display: this.state.lsdis }}
                >
                  <Menu.Item key="110"
                  >
                    <Link to="/app/platform">
                      <span>平台管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="111"
                  >
                    <Link to="/app/interfaces">
                      <span>接口管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="112"
                  >
                    <Link to="/app/sederweimalist">
                      <span>二维码管理</span>
                    </Link>
                  </Menu.Item>

                </SubMenu>


                {/* <Menu.Item key="9">
                  <Link to="/app/blockchain">
                    <Icon type="link" />
                    <span>区块信息</span>
                  </Link>
                </Menu.Item> */}

                <SubMenu
                  key="sub12"
                  title={
                    <span>
                      <Icon type="laptop" />
                      <span>运维监控</span>
                    </span>
                  }
                  style={{ display: this.state.lsdis }}
                >
                  <Menu.Item key="18">
                    <Link to="/app/testpage">
                      <span>测试信息</span>
                    </Link>
                  </Menu.Item>
                  {/* <Menu.Item key="22">
                    <Link to="/app/videoback">
                      <span>视频回放</span>
                    </Link>
                  </Menu.Item> */}
                  <Menu.Item key="19">
                    <a href="http://iva.terabits.cn:9000" target="_blank" rel="noopener noreferrer">控制台</a>
                  </Menu.Item>
                  <Menu.Item key="20">
                    <a href={config.requestIp + "/druid"} target="_blank" rel="noopener noreferrer">sql统计</a>
                  </Menu.Item>
                  <Menu.Item key="21">
                    <a href={config.requestIp + "/doc.html"} target="_blank" rel="noopener noreferrer">接口文档</a>
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>

            <Layout   >
              <Content id="Farmer">
                <Switch>
                  <Route exact path='/app' component={hotelreport} />
                  <Route path="/app/warning" component={warning} />
                  <Route path="/app/picture" component={picture} />
                  <Route path="/app/video" component={video} />
                  <Route path="/app/equipment" component={equipment} />
                  <Route path="/app/user" component={user} />
                  <Route path="/app/adduser" component={adduser} />
                  <Route path="/app/hotel" component={hotel} />
                  <Route path="/app/addhotel" component={addhotel} />
                  <Route path="/app/onlinevideo" component={onlinevideo} />
                  <Route path="/app/camera" component={camera} />
                  <Route path="/app/socket" component={socket} />
                  <Route path="/app/parameter" component={parameter} />
                  <Route path="/app/blockchain" component={blockchain} />
                  <Route path="/app/sitestatistics" component={sitestatistics} />
                  <Route path="/app/areastatistics" component={areastatistics} />
                  <Route path="/app/cleaner" component={cleaner} />
                  <Route path="/app/houseroom" component={houseroom} />
                  <Route path="/app/addroom" component={addroom} />
                  {/* <Route path="/app/temperaturepc" component={temperaturepc} />
                  <Route path="/app/tempstatistics" component={tempstatistics} /> */}
                  <Route path="/app/cuplistpc" component={cuplistpc} />
                  <Route path="/app/monthstatistics" component={monthstatistics} />
                  {/* <Route path="/app/hospitalvideo" component={hospitalvideo} /> */}
                  <Route path="/app/hotelvideo" component={hotelvideo} />
                  <Route path="/app/cinemavideo" component={cinemavideo} />
                  {/* <Route path="/app/hospitaldisvideo" component={hospitaldisvideo} /> */}
                  {/* <Route path="/app/publicplace" component={publicplace} /> */}
                  <Route path="/app/hotelplace" component={hotelplace} />
                  <Route path="/app/scene" component={scene} />
                  <Route path="/app/role" component={role} />
                  <Route path="/app/power" component={power} />
                  <Route path="/app/publicreport" component={publicreport} />
                  <Route path="/app/hotelreport" component={hotelreport} />
                  <Route path="/app/socketdata" component={socketdata} />
                  <Route path="/app/addargs" component={addargs} />
                  <Route path="/app/guestroomvideo" component={guestroomvideo} />
                  <Route path="/app/housereport" component={housereport} />
                  <Route path="/app/examine" component={examine} />
                  <Route path="/app/platform" component={platform} />
                  <Route path="/app/interfaces" component={interfaces} />
                  <Route path="/app/housereportdetail" component={housereportdetail} />
                  <Route path="/app/erweima" component={erweima} />
                  <Route path="/app/sederweimalist" component={sederweimalist} />
                  <Route path="/app/backvideo" component={backvideo} />
                  <Route path="/app/testpage" component={testpage} />
                  <Route path="/app/handleback" component={handleback} />
                  <Route path="/app/videoback" component={videoback} />
                  <Route path="/app/videopreview" component={videopreview} />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </div>
      </ConfigProvider >



    )
  }
}

export default App;