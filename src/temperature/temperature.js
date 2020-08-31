import React, { Component } from 'react';
import './temperature.css';
import { InputNumber, Input, Button, Radio, message, Modal } from "antd";
import { Toast } from 'antd-mobile';
import { addtemperature, allHospital, updatetemperature } from '../axios';
import moment from 'moment';


const nowTimeStamps = new Date();
const nowTimeStamp = new Date();
const nows = new Date(nowTimeStamps.getTime());

const now = new Date(nowTimeStamp.getTime() - 7 * 24 * 3600 * 1000);
const cardrulelist = {
    0: 1,
    1: 0,
    2: 'X',
    3: 9,
    4: 8,
    5: 7,
    6: 6,
    7: 5,
    8: 4,
    9: 3,
    10: 2,
}

export default class Devicedisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onlinecolor: 'green',
            date: now,
            dates: nows,
            time: now,
            tempdis: 'none',
            tempnum: null,
            cardno: null,
            telphone: null,
            sex: null,
            address: null,
            pleadingvisible: false,
            phonetest: 'none',
            temptest: 'none',
            cardtest: 'none',
            testvisible: false,
            username: null,
            temp: null,
            disone: "none",
            distwo: "none",
            disthree: "none",
        };

    }



    componentWillMount = () => {

        document.title = "温度登记";
        let url = window.location.href;
        console.log(url);
        let url1 = url.split('=');
        console.log(url1[1])
        localStorage.setItem("hospitalid", url1[1])
        this.setState({
            hospitalid: url1[1]
        })

        allHospital([

        ]).then(res => {
            if (res.data && res.data.message === "success") {
                console.log(url1[1])
                for (var i in res.data.data) {
                    if (parseInt(url1[1]) === parseInt(res.data.data[i].id)) {
                        this.setState({
                            hospitalname: res.data.data[i].name
                        }, function () {
                            console.log(this.state.hospitalname)
                        })
                    }
                }
            }
        });
    }

    tempchange = (e) => {
        this.setState({
            temp: e.target.value
        }, function () {
            if (this.state.temp === true) {
                this.setState({
                    tempdis: "none",
                    tempnum: null,
                    cardno: null,
                    address: null,
                })
            } else {
                this.setState({
                    tempdis: "block"
                })
            }
        })
    }

    sexchange = (e) => {
        this.setState({
            sex: e.target.value
        })
    }

    handleCancel = () => {
        this.setState({
            pleadingvisible: false,
            testvisible: false,
        })
    }


    handleOk = () => {
        updatetemperature([
            this.state.hospitalid,
            this.state.username,
            this.state.sex,
            this.state.telphone,
            this.state.temp,
            this.state.tempnum,
            this.state.cardno,
            this.state.address,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                Toast.success('修改成功');
                this.setState({
                    pleadingvisible: false,
                })
            }
        });
    }

    submit = () => {
        var telrule = /^[1][3,4,5,7,8][0-9]{9}$/;
        var cardrule = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
        if (this.state.temp === false) {
            if (this.state.username === null) {
                Toast.fail('请填写姓名');
            } else if (this.state.sex === null) {
                Toast.fail('请选择性别');
            } else if (this.state.telphone === null) {
                Toast.fail('请填写手机号码');
            } else if (this.state.tempnum === null) {
                Toast.fail('请填写具体温度');
            } else if (this.state.cardno === null) {
                Toast.fail('请填写身份证号');
            } else if (this.state.address === null) {
                Toast.fail('请填写家庭住址');
            } else if (this.state.disone === "block" || this.state.distwo === "block" || this.state.disthree === "block") {
                this.setState({
                    testvisible: true
                })
            } else {
                addtemperature([
                    this.state.hospitalid,
                    this.state.username,
                    this.state.sex,
                    this.state.telphone,
                    this.state.temp,
                    this.state.tempnum,
                    this.state.cardno,
                    this.state.address,
                ]).then(res => {
                    if (res.data && res.data.message === "success") {
                        Toast.success('提交成功');
                        setTimeout(() => {
                            window.location.href = "/mobilesuccess";
                        });
                    }
                    if (res.data && res.data.message === "common fail") {
                        this.setState({
                            pleadingvisible: true
                        })
                    }
                });
            }

        } else {
            if (this.state.username === null) {
                Toast.fail('请填写姓名');
            } else if (this.state.sex === null) {
                Toast.fail('请选择性别');
            } else if (this.state.telphone === null) {
                Toast.fail('请填写手机号码');
            } else if (this.state.temp === null) {
                Toast.fail('请选择体温范围');
            } else if (!telrule.test(this.state.telphone)) {
                this.setState({
                    disone: 'block',
                    testvisible: true,
                })
            } else {
                addtemperature([
                    this.state.hospitalid,
                    this.state.username,
                    this.state.sex,
                    this.state.telphone,
                    this.state.temp,
                    this.state.tempnum,
                    this.state.cardno,
                    this.state.address,
                ]).then(res => {
                    if (res.data && res.data.message === "success") {
                        Toast.success('提交成功');
                        setTimeout(() => {
                            window.location.href = "/mobilesuccess";
                        });
                    }
                    if (res.data && res.data.message === "common fail") {
                        this.setState({
                            pleadingvisible: true
                        })
                    }
                });
            }
        }


    }


    version = (e) => {
        this.setState({
            version: e.target.value
        })
    }

    phoneblur = () => {
        var telrule = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!telrule.test(this.state.telphone)) {
            this.setState({
                phonetest: 'block',
                disone: "block",
            })
        } else {
            this.setState({
                phonetest: 'none',
                disone: "none",
            })
        }
    }

    tempblur = () => {
        if (parseFloat(this.state.tempnum) > 43 || parseFloat(this.state.tempnum) <= 37.3) {
            this.setState({
                temptest: 'block',
                distwo: "block",
            })
        } else {
            this.setState({
                temptest: 'none',
                distwo: "none",
            })
        }
    }


    cardblur = () => {
        var cardrule = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
        var cardrules = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
        if (this.state.cardno.length === 15) {
            if (!cardrules.test(this.state.cardno)) {
                this.setState({
                    cardtest: 'block',
                    disthree: "block",
                })
            } else {
                this.setState({
                    cardtest: 'none',
                    disthree: "none",
                })
            }
        }
        else {
            if (!cardrule.test(this.state.cardno)) {
                this.setState({
                    cardtest: 'block',
                    disthree: "block",
                })
            } else {
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                var sum = 0
                for (var i = 0; i < 17; i++) {
                    sum += this.state.cardno[i] * factor[i]
                }
                if (this.state.cardno[17] != "X") {
                    if (parseInt(this.state.cardno[17]) === cardrulelist[sum % 11]) {
                        this.setState({
                            cardtest: 'none',
                            disthree: "none",
                        })
                    } else {
                        this.setState({
                            cardtest: 'block',
                            disthree: "block",
                        })
                    }
                } else {
                    if (this.state.cardno[17] === cardrulelist[sum % 11]) {
                        this.setState({
                            cardtest: 'none',
                            disthree: "none",
                        })
                    } else {
                        this.setState({
                            cardtest: 'block',
                            disthree: "block",
                        })
                    }
                }

            }
        }

    }


    render() {
        return (
            <div id="mobilebody">
                <div className="head">
                    <div className="text"> {this.state.hospitalname}温度登记</div>
                </div>
                <div className="descripe">
                    感谢您的配合，请如实填写并点击提交！
                </div>
                <div style={{ marginBottom: '.3rem' }}>
                    <div className="title">
                        1.姓名 <span style={{ color: 'red' }}> *</span>
                    </div>
                    <div className="scan">
                        <Input
                            size="large"
                            placeholder="请输入姓名"
                            type="text"
                            onChange={e => this.setState({ username: e.target.value })}
                            value={this.state.username}
                            style={{ marginTop: '.2rem' }}
                        />
                    </div>
                    <div className="title">
                        2.性别 <span style={{ color: 'red' }}> *</span>
                    </div>
                    <div className="scan">
                        <Radio.Group name="radiogroup"
                            style={{ marginTop: '.2rem', width: '100%' }}
                            onChange={this.sexchange}
                        >
                            <div style={{ width: "50%", display: "inline-block" }}>
                                <Radio value={1} style={{ fontSize: ".35rem" }}>男</Radio>
                            </div>
                            <div style={{ width: "50%", display: "inline-block" }}>
                                <Radio value={2} style={{ fontSize: ".35rem" }}>女</Radio>
                            </div>
                        </Radio.Group>
                    </div>
                    <div className="title">
                        3.手机 <span style={{ color: 'red' }}> *</span>
                    </div>
                    <div className="scan">
                        <Input
                            size="large"
                            placeholder="请输入手机"
                            type="text"
                            onChange={e => this.setState({ telphone: e.target.value.replace(/\D/g, '') })}
                            value={this.state.telphone}
                            onBlur={this.phoneblur}
                            style={{ marginTop: '.2rem' }}
                        />
                        <div style={{ color: 'red', marginTop: '.2rem', display: this.state.phonetest }}>* 请输入正确的手机号码</div>
                    </div>

                    <div className="title">
                        4.温度 <span style={{ color: 'red' }}> *</span>
                    </div>
                    <div className="scan">
                        <Radio.Group name="radiogroup"
                            onChange={this.tempchange}
                            style={{ marginTop: '.2rem', width: '100%' }}
                        >
                            <div style={{ width: "50%", display: "inline-block" }}>
                                <Radio value={true} style={{ fontSize: ".35rem" }}>37.3°以下</Radio>
                            </div>
                            <div style={{ width: "50%", display: "inline-block" }}>
                                <Radio value={false} style={{ fontSize: ".35rem" }}>37.3°及以上</Radio>
                            </div>
                        </Radio.Group>
                    </div>

                    <div style={{ display: this.state.tempdis }}>
                        <div className="title">
                            5.具体温度 <span style={{ color: 'red' }}> *</span>
                        </div>
                        <div className="scan">
                            <Input
                                size="large"
                                placeholder="请输入具体温度"
                                type="text"
                                onBlur={this.tempblur}
                                onChange={e => this.setState({
                                    tempnum: e.target.value.replace(/^[0]\d*$/, '').replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3')
                                })}
                                value={this.state.tempnum}
                                style={{ marginTop: '.2rem' }}
                            />
                            <div style={{ color: 'red', marginTop: '.2rem', display: this.state.temptest }}>* 请输入正确的温度</div>
                        </div>
                        <div className="title">
                            6.身份证 <span style={{ color: 'red' }}> *</span>
                        </div>
                        <div className="scan">
                            <Input
                                size="large"
                                placeholder="请输入身份证"
                                type="text"
                                onBlur={this.cardblur}
                                onChange={e => this.setState({ cardno: e.target.value.replace(/[\W]/g, '') })}
                                value={this.state.cardno}
                                style={{ marginTop: '.2rem' }}
                            />
                            <div style={{ color: 'red', marginTop: '.2rem', display: this.state.cardtest }}>* 请输入正确的身份证号</div>
                        </div>
                        <div className="title">
                            7.家庭住址 <span style={{ color: 'red' }}> *</span>
                        </div>
                        <div className="scan">
                            <Input
                                size="large"
                                placeholder="请输入家庭住址"
                                type="text"
                                onChange={e => this.setState({ address: e.target.value })}
                                value={this.state.address}
                                style={{ marginTop: '.2rem', marginBottom: '.2rem' }}
                            />
                        </div>
                    </div>
                    <div className="btn">
                        <Button
                            className="SignIn-requestbutton"
                            onClick={this.submit}
                            style={{ height: '40px', width: '100%', fontSize: '18px', background: '#1890ff', color: 'white', border: 'none' }}
                        >
                            <span>提交</span>
                        </Button>
                    </div>
                    <Modal
                        title="温馨提示"
                        visible={this.state.pleadingvisible}
                        onCancel={this.handleCancel}
                        centered
                        onOk={this.handleOk}
                        mask={false}
                        width='70%'
                    >
                        <div>
                            您已于1小时内进行过提交，请勿重复提交，如需要修改，请点击确定！
                        </div>
                    </Modal>

                    <Modal
                        title="温馨提示"
                        visible={this.state.testvisible}
                        onCancel={this.handleCancel}
                        centered
                        footer={null}
                        // onOk={this.handleOk}
                        mask={false}
                        width='70%'
                    >
                        <div style={{ color: 'red', fontSize: '16px' }}>
                            <div style={{ marginBottom: '10px', display: this.state.disone }}> *  请输入正确的手机号码! </div>
                            <div style={{ marginBottom: '10px', display: this.state.distwo }}> *  请输入正确的温度! </div>
                            <div style={{ display: this.state.disthree }}> *  请输入正确的身份证号!</div>
                        </div>
                    </Modal>
                </div>
                <div className="footer">
                    <div className="foot">
                        监管单位:<img src={require('./foot2.png')} alt="" className="footimg" />上城区卫生监督所&nbsp;&nbsp;
                        技术支持:<img src={require('./foot3.png')} alt="" className="footimg" />钛比科技
                    </div>
                </div>
            </div>
        )
    }
}