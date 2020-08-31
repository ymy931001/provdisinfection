import React, { Component } from 'react';
import './mobilenext.css';
import { Table, Button } from "antd";
import { timepairs, QRcodegetImage } from '../axios';
import { Link } from 'react-router-dom';
import moment from 'moment';


export default class Devicedisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobileurl: '',
            mobiledis: 'none',
            worklist: [{
                "start": "2020-06-02 09:32:24",
                "end": '2020-06-02 10:01:13',
                "id": 2
            }, {
                "start": "2020-06-02 13:41:24",
                "end": '2020-06-02 14:05:16',
                "id": 2
            }],
            accesslist: [{
                "begin": "2020-06-02 14:04:18",
                "end": '2020-06-02 14:39:36',
                "id": 2,
                "power": "320.9"
            }]
        };

    }

    componentWillMount = () => {
        document.title = "消毒详情";
        let url = window.location.href;
        console.log(url)
        let url1 = url.split('=');
        console.log(url1[1])
        // url = url[1].split('&', 2);
        this.setState({
            mobileurl: "/mobile?serial=" + localStorage.getItem("detailsid")
        })
        // timepairs([
        //     localStorage.getItem('detailsid'),
        //     localStorage.getItem('devicetime'),
        //     localStorage.getItem('devicetime'),
        // ]).then(res => {
        //     console.log(res.data)
        //     if (res.data && res.data.message === "success") {
        //         this.setState({
        //             worklist: res.data.data.timePairsVOS[0].timePiars,
        //             accesslist: res.data.data.timePairsVOS[0].readingVOS,
        //             imgid: res.data.data.timePairsVOS[0].id,
        //             time1: Math.ceil(res.data.data.timePairsVOS[0].worktime / 60),
        //             time2: Math.ceil(res.data.data.timePairsVOS[0].runtime / 60),
        //         })
        //     }
        // });
    }

    lookimg = (text, record, index) => {
        this.setState({
            mobiledis: 'block',
            lookimgurl: "http://maoyang.terabits.cn/1591077640204.jpg"
        })
        // if (record.indexs === undefined || record.indexs === "undefined" || record.indexs.length === 0) {
        //     //   message.error('暂无图片')
        // } else {
        //     QRcodegetImage([
        //         this.state.imgid,
        //         record.indexs[Math.floor(Math.random() * (record.indexs.length))],
        //     ]).then(res => {
        //         if (res.data && res.data.message === "success") {
        //             this.setState({
        //                 mobiledis: 'block',
        //                 lookimgurl: "http://disinfection.terabits.cn/mnt/detection/3/backup/2020-03-26/018482.jpg"
        //                 // lookimgurl: 'http://scdisinfection.terabits.cn' + res.data.data.replace('D:', "")
        //             })
        //         }
        //     });
        // }
    }

    mobilechange = () => {
        localStorage.setItem("mobilenum", "1")
    }


    render() {
        const components = {
            body: {
            },
        };
        this.nodeInfoTableColumns = [
            {
                title: "开始时间",
                dataIndex: "start",
                render: (text, record, index) =>
                    <div>
                        {moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
            }, {
                title: "结束时间",
                dataIndex: "end",
                render: (text, record, index) =>
                    <div>
                        {moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
            },
            {
                title: "图片",
                dataIndex: "adminname",
                render: (text, record, index) =>
                    <div onClick={() => this.lookimg(text, record, index)} style={{ color: '#1890ff', cursor: 'pointer' }}>
                        查看
                    </div>
            },
        ];

        this.accessolumns = [
            {
                title: "开始时间",
                dataIndex: "begin",
            }, {
                title: "结束时间",
                dataIndex: "end",
            }, {
                title: "功率",
                dataIndex: "power",
            },
        ];

        const nodeInfoTableColumns = this.nodeInfoTableColumns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                }),
            };
        });

        const accessolumns = this.accessolumns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                }),
            };
        });
        return (
            <div id="mobilenetxbody">
                <div className="head">
                    <div>
                        监管单位：浙江省卫生监督所
                    </div>
                    <div>
                        技术支持：钛比科技
                    </div>
                </div>
                <div className="header">
                    <div className="headertitle">
                        <div>
                            <img src={require('./border.png')} className="borderimg" />
                            消毒间信息
                        </div>
                        <div className="more">
                            <Button type="primary" onClick={this.mobilechange} style={{ float: 'right' }}>
                                <Link to={this.state.mobileurl}>
                                    <span>返回</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="content">
                        <div className="contentline">
                            <span className="lefttitle">
                                <img src={require('./img.png')} /> &nbsp;酒店名称：
                            </span>
                            <span>
                                赞成宾馆
                            </span>
                        </div>
                        <div className="contentline">
                            <span className="lefttitles">
                                <img src={require('./img1.png')} /> &nbsp;消毒间位置：
                            </span>
                            <span>
                                主15F消毒间
                            </span>
                        </div>
                        <div className="contentline">
                            <span className="lefttitle">
                                <img src={require('./img.png')} /> &nbsp;消毒人员工作时长（分）：
                            </span>
                            <span>
                                54
                            </span>
                        </div>
                        <div className="contentline">
                            <span className="lefttitles">
                                <img src={require('./img1.png')} /> &nbsp;消毒柜工作时长（分）：
                            </span>
                            <span>
                                35
                            </span>
                        </div>
                    </div>
                </div>
                <div className="header">
                    <div className="headertitle">
                        <div>
                            <img src={require('./border.png')} className="borderimg" />
                            消毒人员工作情况
                        </div>
                    </div>
                    <div className="content">
                        <Table
                            dataSource={this.state.worklist}
                            components={components}
                            columns={nodeInfoTableColumns}
                            pagination={false}
                            bordered
                            style={{ marginTop: '.05rem' }}
                        />
                        <div style={{ width: '100%', marginTop: '.1rem', display: this.state.mobiledis }}>
                            <img src={this.state.lookimgurl} alt="" style={{ width: '100%' }} />
                        </div>
                    </div>
                </div>

                <div className="header">
                    <div className="headertitle">
                        <div>
                            <img src={require('./border.png')} className="borderimg" />
                            智能插座工作情况
                        </div>
                    </div>
                    <div className="content">
                        <Table
                            dataSource={this.state.accesslist}
                            components={components}
                            columns={accessolumns}
                            pagination={false}
                            bordered
                            style={{ marginTop: '.05rem', marginBottom: '.05rem' }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}