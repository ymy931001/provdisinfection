import React from 'react'
// import { WebControl } from './utils/jsWebControl-1.0.0.min.js'
import $ from 'jquery'
import JSEncrypt from 'jsencrypt'
import {
  Layout,
  Card,
  Button,
  DatePicker
} from "antd";
import moment from 'moment';
import "./videopreview.css";
import { Link } from 'react-router-dom';



const { Content } = Layout;

let oWebControl = null
let WebControl = null
//声明公用变量
var initCount = 0;
var pubKey = '';
export const injectScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.src = src
    script.addEventListener('load', resolve)
    script.addEventListener('error', reject)
    document.head.appendChild(script)
  })
}


let nowtime = new Date();
let year = nowtime.getFullYear();
let month = nowtime.getMonth() + 1 > 9 ? nowtime.getMonth() + 1 : '0' + (nowtime.getMonth() + 1);;
let date = nowtime.getDate() ? nowtime.getDate() : '0' + (nowtime.getDate());


class App extends React.Component {
  state = {
    collapsed: false,
    thirdpartylist: [],
    permissionlist: [],
    warningListDataSource: [],
    number: localStorage.getItem('indexCode')
  };

  componentWillUnmount() {
    oWebControl.JS_Disconnect().then(function () { // oWebControl 为 WebControl 的对象 // 断开与插件服务的连接成功 
    }, function () { // 断开与插件服务的连接失败 
    });
  }


  componentDidMount() {
    let that = this
    injectScript('https://mainimg.terabits.cn/jsWebControl-1.0.0.min.js').then(res => {
      WebControl = window.WebControl
      //加载后要做的事情
      that.initPlugin()
    })

    console.log(localStorage.getItem('appkey'))
    console.log(localStorage.getItem('appsecret'))
    console.log(localStorage.getItem('iscip'))
    console.log(parseInt(localStorage.getItem('iscport'), 10))

  }





  // 创建WebControl实例与启动插件
  initPlugin() {
    console.log(111)
    let that = this
    oWebControl = new WebControl({
      szPluginContainer: "playWnds",                       //指定容器id
      iServicePortStart: 15900,                           //指定起止端口号，建议使用该值
      iServicePortEnd: 15909,
      szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11",   // 用于IE10使用ActiveX的clsid
      cbConnectSuccess: function () {
        // setCallbacks();
        //实例创建成功后需要启动服务
        oWebControl.JS_StartService("window", {
          dllPath: "./VideoPluginConnect.dll"
        }).then(function () {
          // oWebControl.JS_SetWindowControlCallback({   // 设置消息回调
          //   cbIntegrationCallBack: this.cbIntegrationCallBack()
          // });
          oWebControl.JS_CreateWnd("playWnds", 700, 400).then(function () {         //JS_CreateWnd创建视频播放窗口，宽高可设定
            console.log("JS_CreateWnd success");
            that.init();                                 //创建播放实例成功后初始化
          });
        }, function () {

        });
      },
      cbConnectError: function () {
        console.log("cbConnectError");
        oWebControl = null;
        $("#playWnds").html("插件未启动，正在尝试启动，请稍候...");
        WebControl.JS_WakeUp("VideoWebPlugin://");        //程序未启动时执行error函数，采用wakeup来启动程序
        initCount++;
        if (initCount < 3) {
          setTimeout(function () {
            that.initPlugin();
          }, 3000)
        } else {
          $("#playWnds").html("插件启动失败，请检查插件是否安装！");
        }
      },
      cbConnectClose: function () {
        console.log("cbConnectClose");
        oWebControl = null;
      }
    });

  }

  // // 推送消息
  // cbIntegrationCallBack = (oData) => {
  //   showCBInfo(JSON.stringify(oData.responseMsg));
  // }



  //初始化
  init() {

    this.getPubKey(() => {

      ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
      // var appkey = "26227743";                           //综合安防管理平台提供的appkey，必填
      // var secret = this.setEncrypt("aGDGU9FFAFeEcMTtZGbh");   //综合安防管理平台提供的secret，必填
      // var ip = "218.108.33.77";                           //综合安防管理平台IP地址，必填
      // var port = 444;                                    //综合安防管理平台端口，若启用HTTPS协议，默认443
      var appkey = localStorage.getItem('appkey');                           //综合安防管理平台提供的appkey，必填
      var secret = this.setEncrypt(localStorage.getItem('appsecret'));   //综合安防管理平台提供的secret，必填
      var ip = localStorage.getItem('iscip');                           //综合安防管理平台IP地址，必填
      var port = parseInt(localStorage.getItem('iscport'), 10);                                   //综合安防管理平台端口，若启用HTTPS协议，默认443
      var playMode = 0;                                  //初始播放模式：0-预览，1-回放
      var snapDir = "D:\\SnapDir";                       //抓图存储路径
      var videoDir = "D:\\VideoDir";                     //紧急录像或录像剪辑存储路径
      var layout = "1x1";                                //playMode指定模式的布局
      var enableHTTPS = 1;                               //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
      var encryptedFields = 'secret';					   //加密字段，默认加密领域为secret
      var showToolbar = 1;                               //是否显示工具栏，0-不显示，非0-显示
      var showSmart = 1;                                 //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
      var buttonIDs = "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769";  //自定义工具条按钮
      //var reconnectTimes = 2;                            // 重连次数，回放异常情况下有效
      //var reconnectTime = 4;                             // 每次重连的重连间隔 >= reconnectTime
      ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////

      oWebControl.JS_RequestInterface({
        funcName: "init",
        argument: JSON.stringify({
          appkey: appkey,                            //API网关提供的appkey
          secret: secret,                            //API网关提供的secret
          ip: ip,                                    //API网关IP地址
          playMode: playMode,                        //播放模式（决定显示预览还是回放界面）
          port: port,                                //端口
          snapDir: snapDir,                          //抓图存储路径
          videoDir: videoDir,                        //紧急录像或录像剪辑存储路径
          layout: layout,                            //布局
          enableHTTPS: enableHTTPS,                  //是否启用HTTPS协议
          encryptedFields: encryptedFields,          //加密字段
          showToolbar: showToolbar,                  //是否显示工具栏
          showSmart: showSmart,                      //是否显示智能信息
          buttonIDs: buttonIDs                       //自定义工具条按钮
          //reconnectTimes：reconnectTimes,            //重连次数
          //reconnectDuration：reconnectTime           //重连间隔
        })
      }).then(function (oData) {
        oWebControl.JS_Resize(700, 400);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
      });
    });
  }


  // 获取公钥
  getPubKey(callback) {
    oWebControl.JS_RequestInterface({
      funcName: "getRSAPubKey",
      argument: JSON.stringify({
        keyLength: 1024
      })
    }).then(function (oData) {
      console.log(oData);
      if (oData.responseMsg.data) {
        pubKey = oData.responseMsg.data;
        callback()
      }
    })
  }


  // RSA加密
  setEncrypt = (value) => {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(pubKey);
    return encrypt.encrypt(value);
  }




  //预览
  startpreivew = () => {
    var cameraIndexCode = this.state.number;
    console.log(cameraIndexCode)
    var streamMode = 0;                                     //主子码流标识：0-主码流，1-子码流
    var transMode = 1;                                      //传输协议：0-UDP，1-TCP
    var gpuMode = 0;                                        //是否启用GPU硬解，0-不启用，1-启用
    var wndId = -1;                                         //播放窗口序号（在2x2以上布局下可指定播放窗口）
    oWebControl.JS_RequestInterface({
      funcName: "setFullScreen"
    })
    oWebControl.JS_RequestInterface({
      funcName: "startPreview",
      argument: JSON.stringify({
        cameraIndexCode: cameraIndexCode,                //监控点编号
        streamMode: streamMode,                         //主子码流标识
        transMode: transMode,                           //传输协议
        gpuMode: gpuMode,                               //是否开启GPU硬解
        wndId: wndId                                     //可指定播放窗口
      })
    })

  }



//打开全屏
openfull = () => {
  oWebControl.JS_RequestInterface({
    funcName: "setFullScreen"
  })
}

download = () => {
  window.open("https://mainimg.terabits.cn/VideoWebPlugin.exe", '_self')
}


render() {
  return (
    <Layout>
      <Layout id="warning">
        <Content style={{ margin: "16px 16px" }} >
          <Card title={`${localStorage.getItem('hotelnames')}${localStorage.getItem('roomname')}-实时画面`} headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
            extra={<Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px' }} onClick={this.showModal}
            >
              <Link to="/app/equipment">返回</Link>
            </Button>}>
            <div id="operate" className="operate">
              <div className="module">
                <div className="item" style={{ marginTop: '10px' }}>
                  <span className="label"></span>
                  <Button type="primary" onClick={() => this.startpreivew()}> 预览</Button>
                  <Button type="primary" onClick={() => this.openfull()} style={{ marginLeft: '15px' }}>全屏</Button>
                  <Button type="primary" onClick={() => this.download()} style={{ marginLeft: '15px', marginRight: '10px' }}>插件下载</Button>
                   （若无插件请点击此按钮进行插件下载并安装）
                  </div>
              </div>
            </div>
            <div id="playWnds" className="playWnd"></div>
          </Card>
        </Content>

      </Layout>
    </Layout>
  );
}
}

export default App;
