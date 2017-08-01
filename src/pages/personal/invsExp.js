/**
 * 互联网投资经验
 * zgx
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
  AsyncStorage,
  Platform
} from 'react-native';

import {
  PushLogin,
  StringUtils,
  BasePage,
  BackNavBar,
  LabelTextInput,
  FormProvider,
  Submit,
  NavBar,
  Loading,
} from 'ApolloComponent';

import ChinaRegionWheelPicker from '../../components/rn_city_picker/index';
import { NavigatorUtils,PlateFormUtils } from 'ApolloUtils';
import { Color, DEFAULT_STYLES,STORAGE_KEYS} from 'ApolloConstant';
import SwiperNative from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome'
import ApolloAPI from 'ApolloAPI';
import ModalDropdown from 'react-native-modal-dropdown';

var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
const DEMO_OPTIONS = ['1年以下', '1-3年','3年以上'];
class InvsExp extends BasePage {
   constructor(props) {
    super(props);
    this.state = {
      selectedValue:'1',
      res_selectedValue:'',
    };
  }
 
//得到Loading页面的方法
get_loading() {
    return this.refs.loading;
}

savePerInfotxt(){
    if(this.state.selectedValue == this.state.res_selectedValue){
      this.props.navigator.pop();
    }else{
        this.get_loading().show();
        const { perInfo } = this.props;
          console.log(perInfo);
          if(!!perInfo){
            //修改的信息
            perInfo.invexp = this.state.selectedValue;
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

request_api=async()=>{
    //console.log(this.props.Personal)
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    if(!!hash){
      ApolloAPI.APIPersonal.getPerInfo({
        //通过参数获取个人信息
        telno:hash.retMsg
      }).done(async (res_json, res)=>{
        if(res_json.retCode === 1){
          //将json对象存起来
          await AsyncStorage.setItem(STORAGE_KEYS.PERINFO,JSON.stringify(res_json));
          //获取回的信息填满表格
          this.setState({
              selectedValue:res_json.invexp,
              res_selectedValue:res_json.invexp,
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
 
  render() {
    return (
    <View style={styles.container}>
           <NavBar
            backgroundColor='#ed5565'
            leftContent={
              <View >
                <TouchableOpacity onPress={()=>this.savePerInfotxt()}>
                  <Icon style={{marginRight: 15}} name="angle-left" size={22} color={'#fff'} />
                </TouchableOpacity>
              </View>
            }
            titleContent={
              <View style={styles.title}>
                <Text style={{fontSize:18,color:'#fff'}}>互联网投资经验</Text>
              </View>
            }
            />
        <View style={{flexDirection:'row',height:44,backgroundColor:'#fff',marginTop:10}}>
            <View style={{marginLeft:12,flex:1.3,justifyContent:'center'}}>
                <Text style={{fontSize:16,color:'#101010',}}>投资经验:</Text>
            </View>
            <View style={{ flex: 2.65, justifyContent:'center',}}>
                <ModalDropdown 
                    textStyle={{
                        fontSize:14,
                        color:'#757575',
                        textAlign:'center',
                        alignSelf:'center',
                        }}
                    dropdownStyle={[{ width:0.53 * full_width,backgroundColor:'#fff',alignItems:'center'}]}
                    options={DEMO_OPTIONS} 
                    defaultValue="请选择"
                    defaultIndex={1}
                    onSelect={(idx, value) => this.setState({selectedValue: idx+2})}
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


});

export default InvsExp