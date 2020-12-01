import React, { Component } from "react";
import { Button, Input, message } from "antd";
import { login, hotellist } from "../axios";
import { createForm } from 'rc-form';
import "./SignIn.css";


class SignIn extends Component {
  state = {
    userID: "",
    password: ""
  };

  componentwillMount = () => {
    localStorage.clear();


  }
  componentDidMount = () => {

    let url = window.location.href;
    url = url.split('=', 2);
    if (url[1] === "1201") {
      login([
        "hzadmin",
        "Hz123456"
      ]).then(res => {
        if (res.data.message === 'success') {
          hotellist().then(res => {
            var arr = []
            for (var i in res.data.data) {
              arr.push({
                'id': i,
                'value': res.data.data[i]
              })
            }
            localStorage.setItem('sitelist', arr)
          });
          var arr = []
          var arrs = []
          for (var i in res.data.data.roles) {
            arr.push(res.data.data.roles[i].id)
            arrs.push(res.data.data.roles[i].namezh)
          }
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("authorization", res.headers.authorization);
          localStorage.setItem("namezh", res.data.data.name);
          localStorage.setItem("rolename", arrs.join(','));
          localStorage.setItem("lastLogin", res.data.data.lastLogin);
          localStorage.setItem("menuid", "100");
          localStorage.setItem("menuline", "sub10");
          localStorage.removeItem('addresslist');
          localStorage.removeItem('site');
          localStorage.setItem("userID", this.state.userID);
          localStorage.setItem("type", arr);
          localStorage.setItem("areaId", res.data.data.areaId);
          localStorage.setItem("currenttime", new Date().getTime());
          setTimeout(function () {
            window.location.href = "/app/areastatistics";
          }, 1000);
        } else {
          message.error("用户名或密码错误");
        }
      });
    }


    // gettoken([
    //   "201a0f3a8c58471787b315108ae35950",
    //   "1a52b64a6506e52cec442fe7c013fada"
    // ]).then(res => {
    //   // if (res.data.message === 'success') {
    //   console.log(res)
    //   // console.log(res.data.httpSession)
    //   // console.log(res.response)
    //   // }
    // })

    // getvideolist([
    // ]).then(res => {
    //   // if (res.data.message === 'success') {
    //   console.log(res)
    //   // console.log(res.data.httpSession)
    //   // console.log(res.response)
    //   // }
    // })

  };


  logindown = (e) => {
    if (e.keyCode === 13) {
      login([
        this.state.userID,
        this.state.password
      ]).then(res => {
        if (res.data.message === 'success') {
          console.log(res)
          message.success("登陆成功");
          // accountsession([

          // ]).then(res => {
          //   // if (res.data.message === 'success') {
          //     console.log(res.data)
          //   console.log(res.data.httpSession)
          //   console.log(res.response)
          //   // }
          // })
          // localStorage.setItem("namezh", res.data.data.role.namezh);
          var arr = []
          var arrs = []
          for (var i in res.data.data.roles) {
            arr.push(res.data.data.roles[i].id)
            arrs.push(res.data.data.roles[i].namezh)
          }
          // console.log(arr.join(','))
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("authorization", res.headers.authorization);
          localStorage.setItem("userID", this.state.userID);
          localStorage.setItem("namezh", res.data.data.name);
          localStorage.setItem("menuid", "100");
          localStorage.setItem("menuline", "sub10");
          localStorage.setItem("lastLogin", res.data.data.lastLogin);
          localStorage.setItem("rolename", arrs.join(','));
          localStorage.removeItem('addresslist');
          localStorage.setItem("type", arr);
          localStorage.setItem("areaId", res.data.data.areaId);
          localStorage.setItem("currenttime", new Date().getTime());
          hotellist().then(res => {
            var arr = []
            for (var i in res.data.data) {
              arr.push({
                'id': i,
                'value': res.data.data[i]
              })
            }
            localStorage.setItem('sitelist', arr)
          });
          setTimeout(function () {
            window.location.href = "/app/areastatistics";
          }, 1000);
        } else {
          message.error("用户名或密码错误");
        }
      });
    }
  }


  login = () => {
    console.log(this.state.userID)
    if (!this.state.userID) {
      message.error("请输入用户名");
      return;
    }
    if (!this.state.password) {
      message.error("请输入密码");
      return;
    }
    login([
      this.state.userID,
      this.state.password
    ]).then(res => {
      if (res.data.message === 'success') {
        message.success("登陆成功");
        hotellist().then(res => {
          var arr = []
          for (var i in res.data.data) {
            arr.push({
              'id': i,
              'value': res.data.data[i]
            })
          }
          localStorage.setItem('sitelist', arr)
        });

        var arr = []
        var arrs = []
        for (var i in res.data.data.roles) {
          arr.push(res.data.data.roles[i].id)
          arrs.push(res.data.data.roles[i].namezh)
        }
        console.log(res.headers)
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("authorization", res.headers.authorization);
        localStorage.setItem("namezh", res.data.data.name);
        localStorage.setItem("rolename", arrs.join(','));
        localStorage.setItem("lastLogin", res.data.data.lastLogin);
        localStorage.setItem("menuid", "100");
        localStorage.setItem("menuline", "sub10");
        localStorage.removeItem('addresslist');
        localStorage.removeItem('site');
        localStorage.setItem("userID", this.state.userID);
        localStorage.setItem("type", arr);
        localStorage.setItem("areaId", res.data.data.areaId);
        localStorage.setItem("currenttime", new Date().getTime());
        setTimeout(function () {
          window.location.href = "/app/areastatistics";
        }, 1000);
      } else {
        message.error("用户名或密码错误");
      }
    });
  };

  render() {
    return (
      <div id="signbody">
        <div style={{ display: "flex", flexDirection: 'column' }}>
          <div className="SignIn-body">
            <div className="cover">
              <div className="logo">
                <img src={require('./logo1.png')} alt="" style={{ width: "70px", marginRight: '20px' }} />
                卫生监督管理平台
              </div>
              <div className="loginmain">
                <div className="loginl">

                </div>
                <div className="loginr">
                  <span className="logintitle">
                    登录
                  </span>
                  <div>
                    <Input
                      size="large"
                      className="SignIn-Input"
                      placeholder="请输入用户名"
                      prefix={
                        <span style={{ borderRight: '1px solid #d9d9d9', paddingRight: '10px' }}>
                          <img src={require('./user.png')} alt="" style={{ width: "15px" }} />
                        </span>
                      }
                      onChange={e => this.setState({ userID: e.target.value })}
                      value={this.state.userID}
                      onKeyDown={this.logindown}
                    />
                  </div>
                  <div>
                    <Input
                      size="large"
                      className="SignIn-Inputs"
                      placeholder="请输入密码"
                      prefix={
                        <span style={{ borderRight: '1px solid #d9d9d9', paddingRight: '10px' }}>
                          <img src={require('./pass.png')} alt="" style={{ width: "15px" }} />
                        </span>
                      }
                      type="password"
                      onChange={e => this.setState({ password: e.target.value })}
                      value={this.state.password}
                      onKeyDown={this.logindown}
                    />
                  </div>
                  <div>
                    <Button
                      className="SignIn-requestbutton"
                      onClick={() => {
                        this.login();
                      }}
                      style={{ height: '40px', width: '100%', fontSize: '18px', background: '#325d88', color: 'white', border: 'none' }}
                    >
                      <span>登录</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bombtn">
                平台服务商：&nbsp;&nbsp;<a href="http://www.terabits.cn/" target="_blank" rel="noopener noreferrer" style={{ color: '#666666' }}>杭州钛比科技有限公司</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话：&nbsp;&nbsp;0571-87755736
              </div>
              <div className="bombtns">
                浙ICP备16003817号-1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;网站标识码：3610782
              </div>
              <div className="bombtns">
                <img src={require('./bot.png')} alt="" style={{ width: '20px', marginRight: '10px' }} />
                <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602007808" target="_blank" rel="noopener noreferrer" style={{ color: '#666666' }}>浙公网安备33010602009975号</a>
              </div>

            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default SignIn = createForm()(SignIn);