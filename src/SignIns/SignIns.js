import React, { Component } from "react";
import { Button, Input } from "antd";
import { createForm } from 'rc-form';
import "./SignIns.css";


class SignIn extends Component {
  state = {
    userID: "",
    password: ""
  };



  componentwillMount = () => {
    let url = window.location.href;
    url = url.split('=', 2);
    localStorage.setItem("authorization", url)
    window.location.href = "http://datav.aliyuncs.com/share/95aef6059199ee86ef8610153005e68e?Authorization=" + url;

  }
  componentDidMount = () => {
    let url = window.location.href;
    url = url.split('=', 2);
    localStorage.setItem("authorization", url)
    window.location.href = "http://datav.aliyuncs.com/share/95aef6059199ee86ef8610153005e68e?Authorization=" + url;
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