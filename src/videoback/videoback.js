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

// const WebControl = window.WebControl;

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
    //页面加载时创建播放实例初始化
    // $(window).load(function () {
    //   initPlugin();
    // });
    $(window).on("load", function () {
      initPlugin();
    });
    //声明公用变量
    var initCount = 0;
    var pubKey = '';

    // 创建WebControl实例与启动插件
    function initPlugin() {
      // eslint-disable-next-line
      oWebControl = new WebControl({
        szPluginContainer: "playWnd",                       //指定容器id
        iServicePortStart: 15900,                           //指定起止端口号，建议使用该值
        iServicePortEnd: 15909,
        cbConnectSuccess: function () {
          // setCallbacks();
          //实例创建成功后需要启动服务
          // eslint-disable-next-line
          oWebControl.JS_StartService("window", {
            dllPath: "./VideoPluginConnect.dll"
          }).then(function () {
            // eslint-disable-next-line
            oWebControl.JS_CreateWnd("playWnd", 1000, 600).then(function () {         //JS_CreateWnd创建视频播放窗口，宽高可设定
              console.log("JS_CreateWnd success");
              init();                                 //创建播放实例成功后初始化
            });
          }, function () {

          });
        },
        cbConnectError: function () {
          console.log("cbConnectError");
          // eslint-disable-next-line
          oWebControl = null;
          $("#playWnd").html("插件未启动，正在尝试启动，请稍候...");
          // eslint-disable-next-line
          WebControl.JS_WakeUp("VideoWebPlugin://");        //程序未启动时执行error函数，采用wakeup来启动程序
          initCount++;
          if (initCount < 3) {
            setTimeout(function () {
              initPlugin();
            }, 3000)
          } else {
            $("#playWnd").html("插件启动失败，请检查插件是否安装！");
          }
        },
        cbConnectClose: function () {
          console.log("cbConnectClose");
          // eslint-disable-next-line
          oWebControl = null;
        }
      });

    }


    //初始化
    function init() {
      getPubKey(function () {

        ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
        var appkey = "28730366";                           //综合安防管理平台提供的appkey，必填
        var secret = setEncrypt("HSZkCJpSJ7gSUYrO6wVi");   //综合安防管理平台提供的secret，必填
        var ip = "10.19.132.75";                           //综合安防管理平台IP地址，必填
        var playMode = 1;                                  //初始播放模式：0-预览，1-回放
        var port = 443;                                    //综合安防管理平台端口，若启用HTTPS协议，默认443
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
        // eslint-disable-next-line
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
          // eslint-disable-next-line
          oWebControl.JS_Resize(1000, 600);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
        });
      });
    }



    // 获取公钥
    function getPubKey(callback) {
      // eslint-disable-next-line
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
    function setEncrypt(value) {
      // eslint-disable-next-line
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(pubKey);
      return encrypt.encrypt(value);
    }

    // 监听resize事件，使插件窗口尺寸跟随DIV窗口变化
    $(window).resize(function () {
      // eslint-disable-next-line
      if (oWebControl != null) {
        // eslint-disable-next-line
        oWebControl.JS_Resize(1000, 600);
        setWndCover();
      }
    });

    // 监听滚动条scroll事件，使插件窗口跟随浏览器滚动而移动
    $(window).scroll(function () {
      // eslint-disable-next-line
      if (oWebControl != null) {
        // eslint-disable-next-line
        oWebControl.JS_Resize(1000, 600);
        setWndCover();
      }
    });

    // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    function setWndCover() {
      var iWidth = $(window).width();
      var iHeight = $(window).height();
      var oDivRect = $("#playWnd").get(0).getBoundingClientRect();

      var iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left) : 0;
      var iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top) : 0;
      var iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
      var iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;

      iCoverLeft = (iCoverLeft > 1000) ? 1000 : iCoverLeft;
      iCoverTop = (iCoverTop > 600) ? 600 : iCoverTop;
      iCoverRight = (iCoverRight > 1000) ? 1000 : iCoverRight;
      iCoverBottom = (iCoverBottom > 600) ? 600 : iCoverBottom;
      // eslint-disable-next-line
      oWebControl.JS_RepairPartWindow(0, 0, 1001, 600);   // 多1个像素点防止还原后边界缺失一个像素条
      if (iCoverLeft != 0) {
        // eslint-disable-next-line
        oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, 600);
      }
      if (iCoverTop != 0) {
        // eslint-disable-next-line
        oWebControl.JS_CuttingPartWindow(0, 0, 1001, iCoverTop);  // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
      }
      if (iCoverRight != 0) {
        // eslint-disable-next-line
        oWebControl.JS_CuttingPartWindow(1000 - iCoverRight, 0, iCoverRight, 600);
      }
      if (iCoverBottom != 0) {
        // eslint-disable-next-line
        oWebControl.JS_CuttingPartWindow(0, 600 - iCoverBottom, 1000, iCoverBottom);
      }
    }


    //录像回放功能
    $("#startPlayback").click(function () {

      var cameraIndexCode = $("#cameraIndexCode").val();         //获取输入的监控点编号值，必填
      var startTimeStamp = new Date($("#startTimeStamp").val().replace('-', '/').replace('-', '/')).getTime();    //回放开始时间戳，必填
      var endTimeStamp = new Date($("#endTimeStamp").val().replace('-', '/').replace('-', '/')).getTime();        //回放结束时间戳，必填
      var recordLocation = 0;                                     //录像存储位置：0-中心存储，1-设备存储
      var transMode = 1;                                          //传输协议：0-UDP，1-TCP
      var gpuMode = 0;                                            //是否启用GPU硬解，0-不启用，1-启用
      var wndId = -1;                                             //播放窗口序号（在2x2以上布局下可指定播放窗口）
      // eslint-disable-next-line
      oWebControl.JS_RequestInterface({
        funcName: "startPlayback",
        argument: JSON.stringify({
          cameraIndexCode: cameraIndexCode,                   //监控点编号
          startTimeStamp: Math.floor(startTimeStamp / 1000).toString(),  //录像查询开始时间戳，单位：秒
          endTimeStamp: Math.floor(endTimeStamp / 1000).toString(),      //录像结束开始时间戳，单位：秒
          recordLocation: recordLocation,                     //录像存储类型：0-中心存储，1-设备存储
          transMode: transMode,                               //传输协议：0-UDP，1-TCP
          gpuMode: gpuMode,                                   //是否启用GPU硬解，0-不启用，1-启用
          wndId: wndId                                         //可指定播放窗口
        })
      })
    });

    // 停止回放
    $("#stopAllPlayback").click(function () {
      // eslint-disable-next-line
      oWebControl.JS_RequestInterface({
        funcName: "stopAllPlayback"
      })
    });

    //设置录像回放时间的默认值
    var endTime = dateFormat(new Date(), "yyyy-MM-dd 23:59:59");
    var startTime = dateFormat(new Date(), "yyyy-MM-dd 00:00:00");
    $("#startTimeStamp").val(startTime);
    $("#endTimeStamp").val(endTime);

    // 格式化时间
    function dateFormat(oDate, fmt) {
      var o = {
        "M+": oDate.getMonth() + 1, //月份
        "d+": oDate.getDate(), //日
        "h+": oDate.getHours(), //小时
        "m+": oDate.getMinutes(), //分
        "s+": oDate.getSeconds(), //秒
        "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
        "S": oDate.getMilliseconds()//毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    }

    // 标签关闭
    $(window).on('unload', function () {
      // eslint-disable-next-line
      if (oWebControl != null) {
        // eslint-disable-next-line
        oWebControl.JS_HideWnd();   // 先让窗口隐藏，规避插件窗口滞后于浏览器消失问题
        // eslint-disable-next-line
        oWebControl.JS_Disconnect().then(function () { }, function () { });
      }
    })
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
