import React, { Component } from 'react';
import {
    //  Avatar,
     Icon 
    } from 'antd';
// import adminTypeConst from './config/adminTypeConst';





// const menu = (
//     <Menu>
//       <Menu.Item>
//         <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
//           1st menu item
//         </a>
//       </Menu.Item>
//       <Menu.Item>
//         <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
//           2nd menu item
//         </a>
//       </Menu.Item>
//       <Menu.Item>
//         <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
//           3rd menu item
//         </a>
//       </Menu.Item>
//     </Menu>
//   );


class Headers extends Component {
    state = {
        user: '',
        visible: false,
        collapsed: false,
        areaname: null
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    out = () => {
        localStorage.removeItem("authorization");
        localStorage.clear();
        window.location.reload();
    }
    componentWillMount = () => {
        if (localStorage.getItem('authorization') === "" || localStorage.getItem('authorization') === null || localStorage.getItem('authorization') === undefined) {
            // message.error('登录信息已过期,请重新登录')
            setTimeout(() => {
                window.location = "/";
                localStorage.clear();
            }, 1500);
        }
        if (localStorage.getItem('type') === "6" || localStorage.getItem('type') === "2" || localStorage.getItem('type') === "7") {
            this.setState({
                areaname: "-" + localStorage.getItem('namezh').substring(0, 3)
            })
        }
        // function showTime() {
        //     let nowtime = new Date();
        //     let year = nowtime.getFullYear();
        //     let month = nowtime.getMonth() + 1;
        //     let date = nowtime.getDate();
        //     document.getElementById("mytime").innerText = year + "年" + month + "月" + date + "日 " + nowtime.toLocaleTimeString();
        // }
        // setInterval(showTime, 1000);
    }
    render() {
        // const menu = (
        //     <Menu>
        //         {/* <Menu.Item>
        //             <Icon type="user" style={{ marginRight: '5px' }} />个人中心
        //       </Menu.Item> */}

        //         <Menu.Item>
        //             <span><TeamOutlined /> 账号角色</span>
        //         </Menu.Item>
        //         <Menu.Item>
        //             <span>{localStorage.getItem("rolename")}</span>
        //         </Menu.Item>
        //         <Menu.Item>
        //             <span><SmileOutlined /> 上次登陆时间</span>
        //         </Menu.Item>
        //         <Menu.Item>
        //             <span>{moment(new Date(parseFloat(localStorage.getItem("lastLogin")))).format('YYYY-MM-DD HH:mm:ss')}</span>
        //         </Menu.Item>
        //         <Menu.Item onClick={this.out}>
        //             <Icon type="poweroff" /><span >退出</span>
        //         </Menu.Item>
        //     </Menu>
        // );
        return (
            <div style={{ textAlign: 'center', height: '64px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{
                    lineHeight: '50px', height: '50px',
                    color: 'white', fontSize: "25px", borderRadius: '5px',
                    marginLeft: "1%", marginRight: '10px', marginTop: "6px", display: 'flex', alignItems: 'center'
                }}>
                    <img src={require('./logo666.png')} alt="" style={{ marginRight: '20px' }} /> 浙江省住宿场所消毒保洁智能监管平台{this.state.areaname}
                </div>
                <div style={{ marginRight: "20px", float: 'right', height: '64px', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '16x', display: 'inline-block', height: '56px' }}>欢迎您，</span>
                        <img src={require('./logo2.png')} alt="" style={{ marginRight: '10px' ,width:'25px'}} />
                        <span style={{ marginRight: '10px' }}>
                            {/* <Icon type="user" style={{ marginRight: '5px' }} /> */}
                            {localStorage.getItem("namezh")}
                        </span>
                    </div>
                    <div style={{ height: "32px", lineHeight: "32px", textAlign: 'right' }}>
                        <span onClick={this.out} style={{ cursor: 'pointer' }}> <Icon type="export" /> 退出</span>
                    </div>

                    {/* <Avatar icon="user" style={{ marginRight: '10px' }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    <span>欢迎您，</span>
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{ color: 'white' }}>
                            {localStorage.getItem("namezh")}
                            <DownOutlined />
                        </a>
                    </Dropdown> */}
                    {/* <img src={require('./manager.png')} alt="" style={{ float: 'left',width:'70%' }} /> */}
                </div>
            </div>
        )
    }
}
export default Headers;
