/**
 * 管理地址
 * zqf
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
  NavBar,
  Loading
} from 'ApolloComponent';

import { NavigatorUtils,PlateFormUtils } from 'ApolloUtils';
import { Color, DEFAULT_STYLES, STORAGE_KEYS} from 'ApolloConstant';
import SwiperNative from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome'
import ApolloAPI from 'ApolloAPI';


var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;

class Address extends BasePage {
  constructor(props) {
    super(props);
    this.state = {
      address:'',
      ret_address:'',
    };
  }  
  //得到Loading页面的方法
  get_loading() {
    return this.refs.loading;
  }

  savePerAddress(){
    if(this.state.ret_address == this.state.address){
       this.props.navigator.pop();
    }else{
      this.get_loading().show();
      const { perInfo } = this.props;
        if(!!perInfo){
          //修改的信息
          perInfo.address = this.state.address;
          //发送修改的信息
          ApolloAPI.APIPersonal.savePerInfo( perInfo ).done((res_json, res)=>{
            this.get_loading().dismiss();
            if(res_json.retCode === 1){
              //保存信息
              //PlateFormUtils.plateFormAlert(Platform,'成功提示',"保存成功!");
              this.props.navigator.pop();
            }else{
              PlateFormUtils.plateFormAlert(Platform,'错误提示',"保存失败!");
            }
          })
        }
    }
  }

 async request_api(){
      //console.log(this.props.Personal)
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    console.log(hash);
    if(!!hash){
      ApolloAPI.APIPersonal.getPerInfo({
        //通过参数获取个人信息
        telno:hash.retMsg
      }).done( async (res_json, res)=>{
        if(res_json.retCode === 1){
        //将json对象存起来
        await AsyncStorage.setItem(STORAGE_KEYS.PERINFO,JSON.stringify(res_json)) ;
        //获取回的信息填满表格
        this.setState({
            address:res_json.address,
            ret_address:res_json.address,
        })
        }else{
          PlateFormUtils.plateFormAlert(Platform,'错误提示',"个人信息未获得!");
        }
      })
    }
  }

  componentWillMount(){
    this.request_api();
  }
  on_change(text){
    this.setState({address:text})
  }
  render() {
    return (
    <View style={styles.container}> 
          <NavBar
          backgroundColor='#ed5565'
          leftContent={
            <View >
              <TouchableOpacity onPress={()=>this.savePerAddress()}>
                <Icon style={{marginRight: 15}} name="angle-left" size={22} color={'#fff'} />
              </TouchableOpacity>
            </View>
          }
          titleContent={
            <View style={styles.title}>
              <Text style={{fontSize:18,color:'#fff'}}>居住地址</Text>
            </View>
          }
          />
          <View style={styles.input_box}>
              <View style={{ flex:1,justifyContent: 'center',}}>
                  <TextInput style={{height:45,marginLeft:10,marginRight:10}}
                      onChangeText={this.on_change.bind(this)}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      placeholder='请输入详细地址'
                      value={this.state.address}
                  />
              </View>
          </View>
          <Loading ref="loading" /> 
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dddddd',
  },
  input_box: {
    height: 45,
    marginTop: 8,
    flexDirection: 'row',
    borderColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    borderWidth: onePt,
    justifyContent:'center',
    alignItems:'center',
  },
  fontLabel:{
    width:full_width,
    fontSize:14,
    //color:'#757575',
    color:'#101010',
  },
  isFill:{
    color: 'red',
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  btn:{
    width:0.9*full_width,
    //marginHorizontal:12,
    borderRadius:8,
    //backgroundColor:'#a19d9e',
    backgroundColor:'#ed5565',
    height:0.07 * full_height,
    justifyContent:'center',
    alignItems:'center',
    //overflow:'hidden'
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

export default Address