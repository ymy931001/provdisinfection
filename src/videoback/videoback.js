import React from "react";
import {
  Table,
  Layout,
  Card,
  Modal,
  Input,
  Button,
  Select,
  Tree,
  message,
  Switch,
  Form,
  InputNumber,
} from "antd";
import $ from "jquery"
import {

} from "../axios";

import "./videoback.css";


const { Content } = Layout;

class App extends React.Component {
  state = {
    collapsed: false,
    thirdpartylist: [],
    permissionlist: [],
    warningListDataSource: [],
  };



  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() {
 
  }

  componentDidMount() {
    // //页面加载时创建播放实例初始化
    // $(window).load(function () {
    //   initPlugin();
    // });

    // //声明公用变量
    // var initCount = 0;
    // var pubKey = '';

    // // 创建WebControl实例与启动插件
    // function initPlugin() {
    //   oWebControl = new WebControl({
    //     szPluginContainer: "playWnd",                       //指定容器id
    //     iServicePortStart: 15900,                           //指定起止端口号，建议使用该值
    //     iServicePortEnd: 15909,
    //     cbConnectSuccess: function () {
    //       // setCallbacks();
    //       //实例创建成功后需要启动服务
    //       oWebControl.JS_StartService("window", {
    //         dllPath: "./VideoPluginConnect.dll"
    //       }).then(function () {
    //         oWebControl.JS_CreateWnd("playWnd", 1000, 600).then(function () {         //JS_CreateWnd创建视频播放窗口，宽高可设定
    //           console.log("JS_CreateWnd success");
    //           init();                                 //创建播放实例成功后初始化
    //         });
    //       }, function () {

    //       });
    //     },
    //     cbConnectError: function () {
    //       console.log("cbConnectError");
    //       oWebControl = null;
    //       $("#playWnd").html("插件未启动，正在尝试启动，请稍候...");
    //       WebControl.JS_WakeUp("VideoWebPlugin://");        //程序未启动时执行error函数，采用wakeup来启动程序
    //       initCount++;
    //       if (initCount < 3) {
    //         setTimeout(function () {
    //           initPlugin();
    //         }, 3000)
    //       } else {
    //         $("#playWnd").html("插件启动失败，请检查插件是否安装！");
    //       }
    //     },
    //     cbConnectClose: function () {
    //       console.log("cbConnectClose");
    //       oWebControl = null;
    //     }
    //   });

    // }


    // //初始化
    // function init() {
    //   getPubKey(function () {

    //     ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
    //     var appkey = "28730366";                           //综合安防管理平台提供的appkey，必填
    //     var secret = setEncrypt("HSZkCJpSJ7gSUYrO6wVi");   //综合安防管理平台提供的secret，必填
    //     var ip = "10.19.132.75";                           //综合安防管理平台IP地址，必填
    //     var playMode = 1;                                  //初始播放模式：0-预览，1-回放
    //     var port = 443;                                    //综合安防管理平台端口，若启用HTTPS协议，默认443
    //     var snapDir = "D:\\SnapDir";                       //抓图存储路径
    //     var videoDir = "D:\\VideoDir";                     //紧急录像或录像剪辑存储路径
    //     var layout = "1x1";                                //playMode指定模式的布局
    //     var enableHTTPS = 1;                               //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
    //     var encryptedFields = 'secret';					   //加密字段，默认加密领域为secret
    //     var showToolbar = 1;                               //是否显示工具栏，0-不显示，非0-显示
    //     var showSmart = 1;                                 //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
    //     var buttonIDs = "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769";  //自定义工具条按钮
    //     //var reconnectTimes = 2;                            // 重连次数，回放异常情况下有效
    //     //var reconnectTime = 4;                             // 每次重连的重连间隔 >= reconnectTime
    //     ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////

    //     oWebControl.JS_RequestInterface({
    //       funcName: "init",
    //       argument: JSON.stringify({
    //         appkey: appkey,                            //API网关提供的appkey
    //         secret: secret,                            //API网关提供的secret
    //         ip: ip,                                    //API网关IP地址
    //         playMode: playMode,                        //播放模式（决定显示预览还是回放界面）
    //         port: port,                                //端口
    //         snapDir: snapDir,                          //抓图存储路径
    //         videoDir: videoDir,                        //紧急录像或录像剪辑存储路径
    //         layout: layout,                            //布局
    //         enableHTTPS: enableHTTPS,                  //是否启用HTTPS协议
    //         encryptedFields: encryptedFields,          //加密字段
    //         showToolbar: showToolbar,                  //是否显示工具栏
    //         showSmart: showSmart,                      //是否显示智能信息
    //         buttonIDs: buttonIDs                       //自定义工具条按钮
    //         //reconnectTimes：reconnectTimes,            //重连次数
    //         //reconnectDuration：reconnectTime           //重连间隔
    //       })
    //     }).then(function (oData) {
    //       oWebControl.JS_Resize(1000, 600);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
    //     });
    //   });
    // }



    // // 获取公钥
    // function getPubKey(callback) {
    //   oWebControl.JS_RequestInterface({
    //     funcName: "getRSAPubKey",
    //     argument: JSON.stringify({
    //       keyLength: 1024
    //     })
    //   }).then(function (oData) {
    //     console.log(oData);
    //     if (oData.responseMsg.data) {
    //       pubKey = oData.responseMsg.data;
    //       callback()
    //     }
    //   })
    // }

    // // RSA加密
    // function setEncrypt(value) {
    //   var encrypt = new JSEncrypt();
    //   encrypt.setPublicKey(pubKey);
    //   return encrypt.encrypt(value);
    // }

  }






  render() {
    return (
      <Layout>
        <Layout id="warning">
          <Content style={{ margin: "16px 16px" }} >
            <Card title="视频回放" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}>
              <div id="playWnd">

              </div>
            </Card>
          </Content>

        </Layout>
      </Layout>
    );
  }
}

export default App;
