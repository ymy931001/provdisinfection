import React from "react";
import {
  Layout,
  Card,
  Button,
  Input,
  message,
  Select,AutoComplete
} from "antd";
import {
  adduser,
  hotellist,
  getAreaMap,
  rolelist,

} from "../axios";
import "./adduser.css";
import { Link } from 'react-router-dom';

const { Content } = Layout;
const Option = Select.Option;

const { TextArea } = Input;

class App extends React.Component {
  state = {
    videoListDataSource: [],
    device_ip: null,
    sitelist: [],
    siteid: '',
    typelist: [],
    rolelist: [],
    userdis: 'none',
    superdis: 'none',
    arealist: [],
    areaid: [],
    hoteloptions: [],
  };

  componentWillMount() {
    document.title = "添加用户";
  }

  componentDidMount() {


    rolelist([

    ]).then(res => {
      if (res.data && res.data.message === "success") {
        var arr = []
        for (var i in res.data.data) {
          arr.push({
            "value": res.data.data[i].namezh,
            "id": res.data.data[i].id,
          })
        }
        this.setState({
          rolelist: arr
        });
      }
    });


    var arr = []
    var newarr = {}
    hotellist().then(res => {
      console.log(res.data)
      for (var i in res.data.data) {
        arr.push(res.data.data[i])
        newarr[i] = res.data.data[i]
      }
      console.log(newarr)
      this.setState({
        hoteloptions: arr,
        sitelist: newarr,
      }, function () {
        console.log(this.state.sitelist)
      });
    });

    var arrs = []
    getAreaMap().then(res => {
      if (res.data && res.data.message === "success") {
        for (var i in res.data.data) {
          arrs.push({
            'id': i,
            'name': res.data.data[i]
          })
        }
        this.setState({
          arealist: arrs
        })
      }
    });

    // if (localStorage.getItem('type') === '0') {
    //   this.setState({
    //     superdis: 'block',
    //     typelist: [{
    //       'id': '0',
    //       'name': '超级管理员',
    //     }, {
    //       'id': '1',
    //       'name': '管理员',
    //     }, {
    //       'id': '2',
    //       'name': '酒店管理员',
    //     }]
    //   })
    // } else {
    //   this.setState({
    //     typelist: [{
    //       'id': '1',
    //       'name': '管理员',
    //     }, {
    //       'id': '2',
    //       'name': '酒店管理员',
    //     }]
    //   })
    // }
  }

  // handleChanges = (value) => {
  //   console.log(value);
  //   this.setState({
  //     siteid: value
  //   })
  // }


    //网点选择
    handleChanges = (value, b) => {
      console.log(value, b);
      const { sitelist } = this.state
      for (var i in sitelist) {
        if (sitelist[i] === value) {
          this.setState({
            siteid: i,
          })
        }
      }
  
    }

  areaChanges = (value) => {
    console.log(value);
    this.setState({
      areaid: value
    })
  }


  submit = () => {
    let realname = document.getElementById('realname').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;
    // var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    var reg = /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    var telrule = /^[1][3,4,5,7,8][0-9]{9}$/;
    var namerule = /^[\u4e00-\u9fa5]+$/;
    if (!namerule.test(realname)) {
      message.error('请输入您的真实姓名');
    }
    else if (!telrule.test(this.state.telphone)) {
      message.error('您输入的手机号码不合法');
    }
    else if (!reg.test(email)) {
      message.error('您输入的邮箱不合法');
    }
    else if (username === "") {
      message.error('请输入用户名');
    }
    else if (password === "") {
      message.error('请输入密码');
    } else {
      adduser([
        realname,
        this.state.telphone,
        username,
        password,
        this.state.siteid,
        this.state.type,
        email,
        this.state.areaid,
        this.state.remark,
      ]).then(res => {
        if (res.data && res.data.message === 'success') {
          message.success('账号创建成功');
          setTimeout(() => {
            window.location.href = "/app/user";
          }, 1000);
        } else if (res.data && res.data.code === 1222) {
          message.error('该用户名已存在，请重新输入')
        } else {
          message.error(res.data.data)
        }
      });
    }

  }

  ions = (value) => {
    console.log(value)
    this.setState({
      type: value
    }, function () {
      if (this.state.type === "1") {
        this.setState({
          userdis: 'none',
          siteid: null,
          areaid: null,
          superdis: 'none',
        })
      }
      else if (this.state.type === "2") {
        this.setState({
          userdis: 'none',
          areaid: null,
          superdis: 'block',
        })
      }
      else if (this.state.type === "4") {
        this.setState({
          userdis: 'block',
          superdis: 'block',
        })
      }
      else {
        this.setState({
          userdis: 'none',
          siteid: null,
          areaid: null,
          superdis: 'none',
        })
      }
    })
  }

  //备注填写
  remarkchange = (e) => {
    this.setState({
      remark: e.target.value
    })
  }

  //手机号码输入
  telphone = (e) => {
    this.setState({
      telphone: e.target.value.replace(/[^0-9.]/g, '')
    })
  }






  render() {
    // const prooptions = this.state.sitelist.map((province) => <Option key={province.id}  >{province.value}</Option>);
    const usertypeions = this.state.rolelist.map((province) => <Option key={province.id}  >{province.value}</Option>);
    // const arealistions = this.state.arealist.map((province) => <Option key={province.id}  >{province.name}</Option>);

    return (
      <Layout id="userbody">
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="添加用户" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px' }}>
                  <Link to="/app/user">返回</Link>
                </Button>
              }
            >
              <div className="gutter-example-nodemanage" style={{ textAlign: "right" }}>

              </div>
              <div className='addinput'>
                <span>姓名：</span>
                <Input placeholder="请输入姓名" style={{ width: '60%' }} id="realname" />
              </div>
              <div className='addinput'>
                <span>手机：</span>
                <Input placeholder="请输入您的手机号" style={{ width: '60%' }} value={this.state.telphone} onChange={this.telphone} />
              </div>
              <div className='addinput'>
                <span>邮箱：</span>
                <Input placeholder="请输入您的邮箱" style={{ width: '60%' }} id="email" />
              </div>
              <div className='addinput'>
                <span>用户名：</span>
                <Input placeholder="请输入用户名" style={{ width: '60%' }} id="username" />
              </div>
              <div className='addinput'>
                <span>初始密码：</span>
                <Input placeholder="请输入密码" style={{ width: '60%' }} id="password" />
              </div>
              <div className='addinput'>
                <span>用户类型：</span>
                <Select
                  style={{ width: '60%' }}
                  placeholder="请选择用户类型"
                  onChange={this.ions}
                >
                  {usertypeions}
                </Select>
              </div>
              {/* <div className='addinput' style={{ display: this.state.superdis }}>
                <span>所属区域：</span>
                <Select
                  style={{ width: '60%', marginRight: '20px' }}
                  placeholder="请选择所属区域"
                  onChange={this.areaChanges}
                  mode="multiple"
                >
                  {arealistions}
                </Select>
              </div> */}
              <div className='addinput' style={{ display: this.state.userdis }}>
                <span>所属酒店：</span>
                {/* <Select
                  style={{ width: '60%', marginRight: '20px' }}
                  placeholder="请选择所属酒店"
                  onChange={this.handleChanges}
                >
                  {prooptions}
                </Select> */}
                <AutoComplete
                  style={{ width: '60%' }}
                  dataSource={this.state.hoteloptions}
                  placeholder="请选择所属酒店"
                  onChange={this.handleChanges}
                  filterOption={(inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              </div>

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
