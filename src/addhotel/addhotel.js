import React from "react";
import {
  Layout,
  Card,
  Button,
  Input,
  message,
  Select,
  Drawer,
  Table,
  Tree,
  Radio, Upload, Icon
} from "antd";
import {
  addsite,
  allProvinceCityDistrict,
  findenterprise, isclist, iscarea, iscdevice
} from "../axios";
import "./addhotel.css";
import { Link } from 'react-router-dom';
import moment from 'moment';


// const props = {
//   // action: '//watersupervision.terabits.cn:9091/approvalimg/upload',
//   // action: url + '/case/details/inputFieldRecord?caseId=' + localStorage.getItem("caseId") + '&access_token=' + localStorage.getItem('token'),
//   listType: 'picture',
// };

const { Content } = Layout;
const { Search } = Input;
const { DirectoryTree } = Tree;
const AMap = window.AMap;
const Option = Select.Option;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoListDataSource: [],
      device_ip: null,
      arealist: [],
      iscplatform: [],
      iscplatformid: '',
      activationvalue: null,
      treeData: [],
      xukeimg: 'http://disimg.terabits.cn/timg.jpg'
    };

    this.isclistcolumns = [

      {
        title: "摄像头名称",
        dataIndex: "cameraName",
        key: 'cameraName',
      }, {
        title: "摄像头类型",
        dataIndex: "cameraTypeName",
        key: 'cameraTypeName',
      }, {
        title: "IndexCode",
        dataIndex: "cameraIndexCode",
        key: 'cameraIndexCode',
      }, {
        title: "创建时间",
        dataIndex: "createTime",
        key: 'createTime',
        render: (text, record, index) => {
          return (
            <div>
              {moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          )
        }
      },
    ];
  }

  componentWillMount() {
    document.title = "添加酒店";
    isclist([
    ]).then(res => {
      if (res.data && res.data.code === 0) {
        var arr = []
        for (var i in res.data.data) {
          arr.push({
            'id': i,
            "value": res.data.data[i]
          })
        }
        this.setState({
          iscplatform: arr
        })
      }
    });
  }

  componentDidMount() {
    this.initMap()
  }

  changeData = (e) => {
    this.setState({
      hotelname: e.target.value
    })
  }

  addschool = () => {
    if (!this.state.hotelname) {
      message.error('请输入酒店名称')
    } else if (!this.state.hoteladdress) {
      message.error('请输入酒店地址')
    } else if (!this.state.personname) {
      message.error('请输入负责人姓名')
    } else if (!this.state.personphone) {
      message.error('请输入负责人电话')
    } else if (!this.state.regionCode) {
      message.error('请选择所属区域')
    } else if (this.state.activationvalue === null) {
      message.error('请选择杯具管理功能')
    } else if (!this.state.completename) {
      message.error('请输入酒店全称')
    } else if (!this.state.creditCode) {
      message.error('请输入酒店信用代码')
    } else if (!this.state.faRen) {
      message.error('请输入酒店法人姓名')
    } else if (!this.state.phone) {
      message.error('请输入酒店法人手机号')
    } else if (!this.state.xukeimg) {
      message.error('请上传酒店许可证')
    } else {
      addsite([
        this.state.hotelname,
        this.state.hoteladdress,
        this.state.personname,
        this.state.personphone,
        this.state.provinceid,
        this.state.cityid,
        this.state.areaid,
        this.state.iscplatformid,
        this.state.regionCode,
        this.state.activationvalue,
        this.state.longitude,
        this.state.latitude,
        this.state.completename,
        this.state.creditCode,
        this.state.faRen,
        this.state.phone,
        this.state.companyaddress,
        this.state.xukeimg,
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          message.success('酒店添加成功')
          setTimeout(function () {
            window.location.href = "/app/hotel"
          }, 1000);
        }
      })
    }
    ;
  }

  addresschange = (e) => {
    console.log(e.target.value)
    this.setState({
      hoteladdress: e.target.value
    })
  }

  initMap() {
    var that = this
    var map = new AMap.Map("mapContainer", {
      resizeEnable: true,
      keyboardEnable: false,
      center: [120.201316, 30.236285],//地图中心点
      zoom: 15,//地图显示的缩放级别
    });

    AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
      var autoOptions = {
        city: "3301", //城市，默认全国
        citylimit: true,
        input: "facilityLocation",//使用联想输入的input的id
      };
      var autocomplete = new AMap.Autocomplete(autoOptions);

      // var clickEventListener = map.on('click', function (e) {
      //   console.log(e)
      //   document.getElementById('longitudetext').innerHTML = e.lnglat.getLng();
      //   document.getElementById('latitudetext').innerHTML = e.lnglat.getLat();
      //   // alert(e.lnglat.getLng() + ',' + e.lnglat.getLat())
      // });
      var placeSearch = new AMap.PlaceSearch({
        // city: '浙江',
        map: map
      })
      AMap.event.addListener(autocomplete, "select",
        function (e) {
          console.log(e)
          // console.log(e.poi.name)
          // console.log(e.poi.adcode)
          //TODO 针对选中的poi实现自己的功能
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);
          that.setState({
            hotelname: e.poi.name,
            hoteladdress: e.poi.district + e.poi.address,
            area: e.poi.district,
            longitude: e.poi.location.lng,
            latitude: e.poi.location.lat,
            areacode: e.poi.adcode,
          }, function () {
            allProvinceCityDistrict([
              this.state.areacode,
            ]).then(res => {
              if (res.data && res.data.message === "success") {
                var arr = []
                for (var i in res.data.data) {
                  if (res.data.data[i].adcode != "100000") {  //eslint-disable-line
                    arr.push(res.data.data[i].adcode)
                  }
                }
                function mysort(a, b) {
                  return a - b;
                }
                this.setState({
                  arealist: arr.sort(mysort)
                }, function () {
                  console.log(this.state.arealist)
                  console.log(this.state.arealist[0])
                  this.setState({
                    provinceid: this.state.arealist[0],
                    cityid: this.state.arealist[1],
                    areaid: this.state.arealist[2],
                  })
                })
              }
            });
          })

        },

      );
    });
  }

  handleChanges = (value, b) => {
    console.log(b)
    this.setState({
      areaId: value,
      areaname: b.props.children
    })
  }
  standchange = (value) => {
    console.log(value)
    this.setState({
      standard: value
    })
  }

  personname = (e) => {
    console.log(e.target.value)
    this.setState({
      personname: e.target.value
    })
  }

  personphone = (e) => {
    console.log(e.target.value)
    this.setState({
      personphone: e.target.value
    })
  }

  //酒店全称输入
  completename = (e) => {
    console.log(e.target.value)
    this.setState({
      completename: e.target.value
    })
  }


  //信用代码输入
  creditCode = (e) => {
    console.log(e.target.value)
    this.setState({
      creditCode: e.target.value
    })
  }




  //法人姓名输入
  faRen = (e) => {
    console.log(e.target.value)
    this.setState({
      faRen: e.target.value
    })
  }


  //法人联系方式输入
  phone = (e) => {
    console.log(e.target.value)
    this.setState({
      phone: e.target.value
    })
  }

  //API调用
  hotelblur = () => {
    if (!this.state.completename) {
      message.error('请输入酒店全称')
    } else {
      findenterprise([
        this.state.completename,
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          if (res.data.data != undefined) {  //eslint-disable-line
            this.setState({
              creditCode: res.data.data.creditCode,
              faRen: res.data.data.faRen,
              phone: res.data.data.phone,
              companyaddress: res.data.data.address,
            })
          }
        }
      });
    }
  }


  //摄像头列表
  iscquery = () => {
    if (this.state.iscplatformid === "") {
      message.error("请选择安防平台种类")
    } else {
      this.setState({
        iscvisible: true
      })
    }
  }

  //ISC平台选择
  iscchange = (value) => {
    this.setState({
      iscplatformid: value
    }, function () {
      iscarea([
        this.state.iscplatformid,
      ]).then(res => {
        if (res.data && res.data.message === "success") {
          console.log(res.data.data[0].name)
          var arr = []
          for (var a in res.data.data) {
            arr.push({
              'title': res.data.data[a].name,
              'key': res.data.data[a].indexCode,
              'children': res.data.data[a].children
            })
          }
          for (var i in arr) {
            for (var j in arr[i].children) {
              if (arr[i].children[j].children != undefined && arr[i].children[j].children.length != 0) {  //eslint-disable-line
                arr[i].children[j].title = arr[i].children[j].name
                arr[i].children[j].key = arr[i].children[j].indexCode
                arr[i].children[j].children = arr[i].children[j].children
                for (var k in arr[i].children[j].children) {
                  if (arr[i].children[j].children[k].children != undefined && arr[i].children[j].children[k].children.length != 0) {  //eslint-disable-line
                    arr[i].children[j].children[k].title = arr[i].children[j].children[k].name
                    arr[i].children[j].children[k].key = arr[i].children[j].children[k].indexCode
                  } else {
                    arr[i].children[j].children[k].title = arr[i].children[j].children[k].name
                    arr[i].children[j].children[k].key = arr[i].children[j].children[k].indexCode
                    arr[i].children[j].children[k].children = undefined
                  }
                }
              } else {
                arr[i].children[j].title = arr[i].children[j].name
                arr[i].children[j].key = arr[i].children[j].indexCode
                arr[i].children[j].children = undefined
              }
            }
          }
          console.log(arr)

          this.setState({
            treeData: arr,
            iscoption: arr
          })
        }
      });
    })
  }


  //table选择
  onSelectChange = (selectedRowKeys, b) => {
    console.log(b)
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys,
      indexCode: b[0].cameraIndexCode
    }, function () {
      console.log(this.state.indexCode)
    });
  };

  //关闭抽屉
  onClose = (e) => {
    this.setState({
      iscvisible: false,
    });
  }

  //树形图选择
  onSelects = (keys, event) => {
    console.log(keys)
    console.log(keys.length)
    console.log(keys.join(','))
    console.log(event)
    this.setState({
      regionCode: keys.join(','),
      regionname: event.node.props.name,
    })
    iscdevice([
      this.state.iscplatformid,
      keys.join(',')
    ]).then(res => {
      if (res.data && res.data.msg === "SUCCESS") {
        for (var i in res.data.data.list) {
          res.data.data.list[i].key = res.data.data.list[i].cameraName
        }
        this.setState({
          iscdata: res.data.data.list,

        }, function () {
          console.log(this.state.iscdata)
        })
      }
    });
  }

  //摄像头列表选择
  submitcamera = () => {
    console.log(this.state.selectedRowKeys)
    this.setState({
      iscvisible: false,
      cameraname: this.state.regionname
    })
  }

  //是否具有杯具管理功能
  activationchange = (e) => {
    console.log(e.target.value)
    this.setState({
      activationvalue: e.target.value
    })
  }


  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('请上传图片');
    }
    return isJpgOrPng;
  }


  //上传图片
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      // message.success('上传失败')
      return;
    }
    if (info.file.status === 'done') {
      message.success('上传成功')
      return;
    }
  };


  render() {
    // const prooptions = this.state.arealist.map((province) => <Option key={province.id}  >{province.name}</Option>);
    const isclistoption = this.state.iscplatform.map((province) => <Option key={province.id}  >{province.value}</Option>);
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelect,
      type: "radio",
    };

    const imgheader = {
      authorization: localStorage.getItem('authorization')
    }
    return (
      <Layout id="mapcontent">
        <Layout>
          <Content style={{ margin: "16px 16px" }} >
            <Card title="添加酒店" headStyle={{ fontWeight: 'bold', fontSize: '18px' }}
              extra={
                <Button type="primary" style={{ background: '#0070CC', border: '1px solid #0070CC', marginRight: '20px' }}>
                  <Link to="/app/hotel">返回</Link>
                </Button>
              }
            >
              <div className="current">
                <div className="current_text">
                  <div className="clearfix">
                    {/* <div className="location" style={{ width: '40%', float: 'left' }}>
                      位置选择:<Cascader disabled={this.state.disabled} value={[this.state.province, this.state.city, this.state.area]}
                        options={options} onChange={this.onChange} changeOnSelect style={{ marginLeft: '20px', width: "60%" }} />
                    </div> */}
                  </div>
                  <div className="clearfix" >
                    <div className="mapcontainer">
                      {/* <input type="text" id="facilityLocation" placeholder="请输入关键字" name="facilityLocation" onfocus='this.value=""'
                        style={{
                          position: 'absolute', zIndex: '99', paddingLeft: '10px',
                          paddingRight: '10px',
                          fontSize: '14px', right: '10px', top: '10px', border: '1px solid #999', borderRadius: '10px',
                          outline: 'none', width: '35%',
                        }} /> */}
                      <div id="mapContainer">
                      </div>
                    </div>
                    <div className="explains">
                      <p style={{ marginTop: "20px" }}><span className="explainspan">酒店名称：</span> <Input placeholder="请输入单位名称" style={{ width: '60%' }}
                        id="facilityLocation"

                        value={this.state.hotelname}
                        onChange={(e) => this.changeData(e)}
                      /></p>
                      {/* <p style={{ marginTop: "20px" }}><span>所属区域：</span>
                        <Select
                          style={{ width: '60%' }}
                          placeholder="请选择所属区域"
                          onChange={this.handleChanges}
                        >
                          {prooptions}
                        </Select>
                      </p> */}
                      {/* <p style={{ marginTop: "20px" }}><span>报警阈值：</span>
                        <Select
                          style={{ width: '60%', }}
                          placeholder="请选择报警阈值"
                          onChange={this.standchange}
                        >
                          <Option key="1" >1天</Option>
                          <Option key="2" >2天</Option>
                          <Option key="3" >3天</Option>
                        </Select>
                      </p> */}
                      <p style={{ marginTop: "20px" }}><span className="explainspan">详细地址：</span>
                        <Input placeholder="请输入详细地址"
                          style={{ width: '60%' }}
                          id="address"
                          value={this.state.hoteladdress}
                          onChange={this.addresschange}
                        /></p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">负责人：</span>
                        <Input placeholder="请输入负责人姓名"
                          style={{ width: '60%' }}
                          value={this.state.personname}
                          onChange={this.personname}
                        /></p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">联系电话：</span>
                        <Input placeholder="请输入联系电话"
                          style={{ width: '60%' }}
                          value={this.state.personphone}
                          onChange={this.personphone}
                        /></p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">平台列表：</span>
                        <Select
                          style={{ width: '60%', }}
                          placeholder="请选择ISC平台"
                          onChange={this.iscchange}
                        >
                          {isclistoption}
                        </Select>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">所属区域：</span>
                        <Search
                          placeholder="请选择所属区域"
                          enterButton="区域列表"
                          size="middle"
                          onSearch={this.iscquery}
                          value={this.state.cameraname}
                          style={{ width: '60%', fontSize: '14px', verticalAlign: 'middle', textAlign: 'left' }}
                        />
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">杯具管理：</span>
                        <Radio.Group onChange={this.activationchange} value={this.state.activationvalue}>
                          <Radio value={true}>具有此功能</Radio>
                          <Radio value={false}>不具有此功能</Radio>
                        </Radio.Group>
                      </p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">酒店全称：</span>
                        <Input placeholder="请输入酒店全称"
                          style={{ width: '60%' }}
                          id="address"
                          value={this.state.completename}
                          onChange={this.completename}
                          onBlur={this.hotelblur}
                        /></p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">信用代码：</span>
                        <Input placeholder="请输入信用代码"
                          style={{ width: '60%' }}
                          id="address"
                          value={this.state.creditCode}
                          onChange={this.creditCode}
                        /></p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">法人姓名：</span>
                        <Input placeholder="请输入法人姓名"
                          style={{ width: '60%' }}
                          id="address"
                          value={this.state.faRen}
                          onChange={this.faRen}
                        /></p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">手机号码：</span>
                        <Input placeholder="请输入信用代码"
                          style={{ width: '60%' }}

                          id="address"
                          value={this.state.phone}
                          onChange={this.phone}
                        /></p>
                      <p style={{ marginTop: "20px" }}><span className="explainspan">许可证：</span>
                        <Upload
                          action='http://iva.terabits.cn:9090/upload/file'
                          onChange={this.handleChange}
                          beforeUpload={this.beforeUpload}
                          headers={imgheader}
                          // onPreview={this.handlePreview}
                          name="multipartFile"
                        >
                          <Button>
                            <Icon type="upload" /> 上传一张许可证照片(只能上传一张图片)
                          </Button>
                        </Upload>
                      </p>
                      {/* <p style={{ marginTop: "20px" }}><span> 经度：</span> <span id="longitudetext">{this.state.longitude}</span> </p>
                      <p style={{ marginTop: "20px" }}><span>纬度：</span> <span id="latitudetext">{this.state.latitude}</span></p> */}
                      <p className="bottom" style={{ marginTop: "30px" }}>
                        <span style={{ width: '100px', height: '30px', float: 'left' }}></span>
                        <div style={{ width: '60%', display: 'inline-block', float: 'left' }}>
                          <Button type="primary" size='large' onClick={this.addschool}>添加</Button>
                        </div>
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </Card>
          </Content>
          <Drawer
            title="摄像头列表"
            width={1100}
            onClose={this.onClose}
            visible={this.state.iscvisible}
            bodyStyle={{ paddingBottom: 80 }}
          >
            <div className="drawermain">
              <div className="treelist">
                <DirectoryTree
                  multiple
                  defaultExpandAll
                  onSelect={this.onSelects}
                  // onExpand={onExpand}
                  treeData={this.state.treeData}
                />
              </div>
              <div style={{ width: '650px' }}>
                < Table
                  // components={components} 
                  dataSource={this.state.iscdata}
                  rowSelection={rowSelection}
                  columns={this.isclistcolumns}
                  bordered
                />
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                  <Button type="primary" onClick={this.submitcamera}>确定</Button>
                </div>
              </div>
            </div>

          </Drawer>
        </Layout>
      </Layout >
    );
  }
}

export default App;
