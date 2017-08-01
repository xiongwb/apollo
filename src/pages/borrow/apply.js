/**
 * 申请页面
 * zgx
 *  <View style={{marginTop:15,marginLeft:10,marginRight:10,backgroundColor:'#fff'}}>
        <View style={styles.warnning}>
            <Text style={{fontSize:14,color:'#857575',padding:3}}>仅受理山西省(太原、临汾)和北京地区的融资申请；提交申请后我们将会有专门人员与您联系</Text>
        </View>
    </View>
 */
import React, { Component,PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ScrollView,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  Image,
  ART,
  TextInput,
  View,
  Alert,
  Platform,
  AsyncStorage
} from 'react-native';

import {
  PushLogin,
  BasePage,
  BackNavBar,
  LabelTextInput,
  FormProvider,
  Submit,
  Loading
  
} from 'ApolloComponent';
import { NavigatorUtils,PlateFormUtils } from 'ApolloUtils';
import { Color, DEFAULT_STYLES,COMMON_CONFIG,STORAGE_KEYS} from 'ApolloConstant';
import SwiperNative from 'react-native-swiper';
import ChinaRegionWheelPicker from '../../components/rn_city_picker/index';
import ModalDropdown from 'react-native-modal-dropdown';
import ApolloAPI from 'ApolloAPI';
import { observable, toJS } from 'mobx';
import validate from 'mobx-form-validate';
import Icon from 'react-native-vector-icons/FontAwesome';

class ApplyForm {
  // @observable
  // @validate(/^.+$/,'此处不为空.')
  // financier = '';

  // @observable
  // @validate(/^1(3|4|5|7|8)\d{9}$/, '请输入正确的手机号.')
  // telno = '';

  // @observable
  // @validate(/^.+$/,'请选择区域.')
  // areacode = '';

  // @observable
  // @validate(/^.+$/, '此处不为空.')
  // address = '';

  // @observable
  // @validate( /^.+$/,'此处不为空.')
  // business = '';

  @observable
  @validate( /^.+$/,'请填写融资用途.')
  finpurpose = '';
  
  @observable
  //@validate(/^([1-9][0-9]*)$/, '请填写大于0的数字')
  @validate(/^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,13}\.\d{0,2}$|^[1-9]\d{0,30}$/,'请输入大于0的数字')
  expfinsum = '';

  // @observable
  // @validate( /^.+$/,'请选择融资期限.')
  // finterm = '';

  @observable
 /* @validate( /^([1-9][0-9]*)$/,'请填写融资利率.')*/
  expfinrate = '';
}


var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
const DEMO_OPTIONS = ['3个月', '6个月','9个月','一年以上',];
const PRODUCT_OPTIONS = ['个人住房抵押', '汽车抵押','信用贷款'];
class Apply extends BasePage {
  constructor(props) {
    super(props);
    this.state = {
      regionName: '',
      regionCode: '',
      isPickerVisible: false,
      disabled:false,
      financier:'',
      telno:'',
      applydate:'',
      address:'',
      business:'',
      finpurpose:'',
      expfinsum:'',
      finterm:'',
      expfinrate:'',
      notes:'',
      loanprod:'',
      iconString:'circle-o',
      iconColor:'#dddddd',
      onChecked:false,
      protocoltitle:'',
      protocolcontent:''
    };
  }
  agreement (){
    // icon-ok
    if(this.state.iconString==='circle-o'){
        this.setState({iconString:'check-circle',iconColor:'#ed5565',onChecked:true})
    }
    if(this.state.iconString==='check-circle'){
        this.setState({iconString:'circle-o',iconColor:'#dddddd',onChecked:false})
    }
  }
  on_Change_finterm(id,text){
  
    this.setState({finterm:Number(id)+1});
  }
  on_Change_product(id,text){
   
    this.setState({loanprod:Number(id)+1});
  }
  onsubmit_1 = async () =>{
    try {
      let regionCode = this.state.regionCode;
      let finterm = this.state.finterm;
      let loanprod = this.state.loanprod;
      let applydate = this.state.applydate;
      let tenantno = COMMON_CONFIG.tenantNo;
      let financier = this.state.financier;
      let telno = this.state.telno    
      //将json对象合并成一个对象
      var jsonbject1= {areacode:regionCode,finterm:finterm,applydate:applydate,tenantno:tenantno,loanprod:loanprod,financier:financier,telno:telno};
      var jsonbject2 = this.form;
      var resultJsonObject={};
      for(var attr in jsonbject1){
        resultJsonObject[attr]=jsonbject1[attr];
      }
      for(var attr in jsonbject2){
        resultJsonObject[attr]=jsonbject2[attr];
      }
      //await post('/login', toJS(this));
      //alert(JSON.stringify(toJS(resultJsonObject)));

      this.get_loading().show();

      if(this.state.regionCode == ''){
        this.get_loading().dismiss();
        let tips = "错误提示";
        let showContent = "请选择区域!";
        PlateFormUtils.plateFormAlert(Platform,tips,showContent);
      }else if( this.state.finterm == '') {
        this.get_loading().dismiss();
        let tips = "错误提示";
        let showContent = "请选择融资期限!";
        PlateFormUtils.plateFormAlert(Platform,tips,showContent);
      }else if( this.state.loanprod == '') {
        this.get_loading().dismiss();
        let tips = "错误提示";
        let showContent = "请选择贷款产品";
        PlateFormUtils.plateFormAlert(Platform,tips,showContent);
      }else if(this.state.onChecked != true){
          this.get_loading().dismiss();
            let tips = "错误提示";
            let showContent = "请勾选已阅读!";
            PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            
        }else{
        ApolloAPI.APIBorrow.sendApplyData(
          resultJsonObject
          ).done((res_json, res) => {
            this.get_loading().dismiss();
            if(res_json.retCode == 1){
              let tips = "正确提示";
              let showContent = res_json.retMsg;
              this.props.navigator.pop();
              PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            }else{
              let tips = "错误提示";
              let showContent = res_json.retMsg;
              PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            }
          })
      }
    } catch (error) {
      console.error(error.stack);
    }
  }


  get_loading() {
    return this.refs.loading;
  }

  getApplyRegion(){
    this.get_loading().show();
    ApolloAPI.APIBorrow.sendApplyData({
       tenantNo:COMMON_CONFIG.tenantNo,
    }).done((res_json, res) => {
            this.get_loading().dismiss();
            if(res_json.retCode == 1){
              let tips = "正确提示";
              let showContent = res_json.retMsg;
              PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            }else{
              let tips = "错误提示";
              let showContent = res_json.retMsg;
              PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            }
          })

  }
  async protocol_get(){
    this.get_loading().show();
    ApolloAPI.APIBorrow.sendProtocolData({
       tenantNo:COMMON_CONFIG.tenantNo,
       proType:2,
       returnType:3
    }).done((res_json, res) => {
            this.get_loading().dismiss();
            if(res_json.retCode == 1){
             this.setState({protocoltitle:res_json.protocoltitle,protocolcontent:res_json.protocolcontent})
            }else{
              let tips = "错误提示";
              let showContent = res_json.retMsg;
              PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            }      
     })
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    if (!!hash) {
      this.setState({
        financier:hash.cusname,
        telno:hash.retMsg
      })
    }
  }
  componentDidMount(){
    //获得当前的时间
    let month = new Date().getMonth()+1;
    if(month.toString.length ==1){
      month= '0' + month;
    }
    let date=  new Date().getFullYear() + '-'+month+'-'+new Date().getDate();
    this.setState({
      applydate:date
    });
    //协议
    this.protocol_get();
  }
  //new一个form表单
  form = new ApplyForm();

  render() {
    return (
    <View style={styles.container}>
        <BackNavBar component={this}>融资申请登记</BackNavBar>
        
        <ScrollView style={styles.excelContainer} showsVerticalScrollIndicator={false}>
        <FormProvider form={this.form}>
          <View>
          <LabelTextInput isFill={true} name='financier'   placeholder={this.state.financier} editable={false} >申请人姓名</LabelTextInput>
               <LabelTextInput isFill={true} name="telno"  placeholder={this.state.telno} editable={false} >手机号码</LabelTextInput>
          <View style={styles.regionContainer}>
                <View style={{flex:1,justifyContent:'flex-end', alignItems:'center',flexDirection:'row'}}>
                  <Text style={styles.isFill}>*</Text>
                  <Text style={styles.fontLabel}>区域:</Text>
                </View>
                <View style = {{flex:2,flexDirection:'row', marginLeft:10,justifyContent:'center'}}>
                  <ChinaRegionWheelPicker
                    transparent
                    animationType={'fade'}
                    navBtnColor={'#ED5565'}
                    selectedProvince={'新疆维吾尔自治区'}
                    selectedCity={'乌鲁木齐市'}
                    selectedArea={'市辖区'}
                    selectedAreaCode={"650101"}
                    dataPicker={"normal"}
                    onSubmit={(params) => 
                      this.setState({
                         regionName: `${params.provinceName},${params.cityName},${params.areaName}`,
                         regionCode: `${params.areaCode}`
                   })}
                    onCancel={() => console.log('cancel')}
                  >
                    <TextInput
                      style={[DEFAULT_STYLES.textInput,styles.fontLabel,{textAlign: 'center' }]}
                      editable={false}
                      placeholder="点击选择地区"
                      value={this.state.regionName}
                    />
                  </ChinaRegionWheelPicker>
                </View>
            </View>
            <LabelTextInput  name="address"  >详细地址</LabelTextInput>
            <LabelTextInput  name="business" >主营业务</LabelTextInput>
            <LabelTextInput isFill={true} name="finpurpose"  placeholder="100字以内" maxLength={200} multiline={true} height={60}>融资用途</LabelTextInput>
            <LabelTextInput isFill={true} name="expfinsum"  keyboardType="numeric" minLenght={4}  >期望融资金额</LabelTextInput>
            <View style={styles.regionContainer}>
                <View style={{flex:1,justifyContent:'flex-end', alignItems:'center',flexDirection:'row'}}>
                  <Text style={styles.isFill}>*</Text>
                  <Text style={styles.fontLabel}>融资期限:</Text>
                </View>
                <View style = {{flex:2,flexDirection:'row', marginLeft:10,justifyContent:'center'}}>
                   <ModalDropdown 
                      style={[DEFAULT_STYLES.textInput,{justifyContent:'center',}]}
                      textStyle={{
                          fontSize:14,
                          color:'#757575',
                          textAlign:'center',
                          alignSelf:'center',
                        }}
                      dropdownStyle={[{ width:0.53 * full_width,backgroundColor:'#fff',alignItems:'center'}]}
                      options={DEMO_OPTIONS} 
                      defaultValue="请选择"
                      onSelect={(idx, value) => this.on_Change_finterm(idx, value)}
                    />
                </View>
            </View>
            <View style={styles.regionContainer}>
                <View style={{flex:1,justifyContent:'flex-end', alignItems:'center',flexDirection:'row'}}>
                  <Text style={styles.isFill}>*</Text>
                  <Text style={styles.fontLabel}>贷款产品:</Text>
                </View>
                <View style = {{flex:2,flexDirection:'row', marginLeft:10,justifyContent:'center'}}>
                   <ModalDropdown 
                      style={[DEFAULT_STYLES.textInput,{justifyContent:'center',}]}
                      textStyle={{
                          fontSize:14,
                          color:'#757575',
                          textAlign:'center',
                          alignSelf:'center',
                        }}
                      dropdownStyle={[{ width:0.53 * full_width,backgroundColor:'#fff',alignItems:'center'}]}
                      options={PRODUCT_OPTIONS} 
                      defaultValue="请选择"
                      onSelect={(idx, value) => this.on_Change_product(idx, value)}
                    />
                </View>
            </View>
            <LabelTextInput  name="expfinrate" unit={"%"} keyboardType="numeric" width={0.5 * full_width} >期望融资利率</LabelTextInput>
            <LabelTextInput name="notes" placeholder="300字以内" maxLength={600} multiline={true} height={80}  >其他融资说明</LabelTextInput>
            <View style={{ justifyContent:'center',paddingTop: 26, paddingHorizontal: 30,flexDirection:'row' }}>
              <TouchableOpacity style={{ height:25,width:25 }} onPress={()=>{this.agreement()}}>
                  <Icon name={this.state.iconString} size={20} color={this.state.iconColor}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.props.navigator.push({id: 'Agreement',params:{protocoltitle:this.state.protocoltitle,protocolcontent:this.state.protocolcontent}})} >
                  <Text style={{marginLeft:6}} >同意<Text  style={{ color: '#ed5565', }}>《{this.state.protocoltitle}》</Text></Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.btnContainer]}>
              <Submit  onChecked={this.state.onChecked} containerStyle={[styles.btn]} textStyle={[styles.textBtn]} onSubmit={this.onsubmit_1}>提 交</Submit>
            </View>
              <View style={{height:0.1 * full_height,marginTop:0.1 * full_height,alignItems:'center',borderTopColor:'#b7b7b7',borderTopWidth:onePt}}>
              <Text style={{color:'#b7b7b7',fontSize:12,marginTop:10}}>
                  我是有底线的
              </Text>
          </View>
          </View>
        </FormProvider>
      </ScrollView>
      <Loading ref="loading" />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  excelContainer: {
    height: 0.8 * full_height,
    marginTop:10,
    backgroundColor:'#fff'
  },
  warnning:{
    backgroundColor:'#ffc4b3',
    borderColor:'#f4511e',
    borderWidth:onePt,
    borderRadius:5,
    height:40,
    alignItems:'center'
  },
  regionContainer: {
    flexDirection:'row',
    marginLeft:10,
    marginRight:10,
    marginTop:6,
  },
  fontLabel:{
    fontSize:14,
    color:'#757575',
  },
  isFill:{
    color: 'red',
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  btn:{
    width:0.4 * full_width,
    borderRadius:8,
    backgroundColor:'#a19d9e',
    height:0.06 * full_height,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  textBtn: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  font: {
    fontSize: 18,
    color:'#FFFFFF',
    textAlign: 'center'
  },
  error:{
    color:'red'
  }
});

export default Apply