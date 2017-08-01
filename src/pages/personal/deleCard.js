/**
 * 解绑（删除银行卡）
 * zgx
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Image,
  Dimensions,
  ART,
  Alert,
  AsyncStorage,
  ScrollView,
  Platform,
  PixelRatio,
  TextInput,
  
} from 'react-native';

import {
  BasePage,
  PushLogin,
  BackNavBar,
  Logintxtin,
  FormProvider,
  Submit,
  Loading,
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_STYLES,
  Color,
  COMMON_CONFIG
} from 'ApolloConstant'

import Icon from 'react-native-vector-icons/FontAwesome';
import ApolloAPI from 'ApolloAPI';
import { observable, toJS } from 'mobx';
import validate from 'mobx-form-validate';
import {PlateFormUtils} from "ApolloUtils";
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
/*viewWidth指的是顶部文字view的宽度
  宽度=屏幕宽度-左边距-头像宽度-间距-间距-箭头宽度-右边距
 */
const onePt =1 / PixelRatio.get();
let viewWidth = full_width-15-75-10-10-20-15;



const {Surface, Shape, Path} = ART;  
class deleCardForm {
  // @observable
  // @validate(/^.+$/,'此处不为空.')
  // oldAcctno = '';

  @observable
  @validate(/^.+$/,'此处不为空.')
  oldPswd = '';
}
class DeleCard extends BasePage {
  form = new deleCardForm();
    constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state={
      oldAcctno: '',//原卡号
      oldPswd:'',//原卡密码
    }
  }

  onBack(){
    return this.props.navigator.popN(2);
  }

 request_api=()=>{
    console.log(this.props.CardMagAddRelieve)
    //alert(this.props.acctno)
    this.setState({
      oldAcctno:this.props.acctno
    })
  console.log("oldAcctno原卡号是否得到:",this.state.oldAcctno)

  }
get_loading() {
        return this.refs.loading;
    }
componentWillMount() {
    this.request_api();
  }
onsubmit_1(){
      let oldAcctno = this.state.oldAcctno;//银行卡号
      let oldPswd = this.form.oldPswd;//
      console.log(this.form);
      //将json对象合并成一个对象
      var jsonbject1= {oldAcctno:oldAcctno,oldPswd:oldPswd};
      var resultJsonObject={};
      for(var attr in jsonbject1){
        resultJsonObject[attr]=jsonbject1[attr];
      }
      this.get_loading().show();
      if(oldAcctno === ''){
        this.get_loading().dismiss();
        let tips = "错误提示";
        let showContent = "请输入原卡号"; 
        PlateFormUtils.plateFormAlert(Platform,tips,showContent);
      }else if(oldPswd===''){
        this.get_loading().dismiss();
        let tips = "错误提示";
        let showContent = "请输入原卡密码";
        PlateFormUtils.plateFormAlert(Platform,tips,showContent);
      }else{
        ApolloAPI.APIcard.unbind(//银行卡管理，添加银行卡=提现和充值添加银行卡
        //alert("卡号",oldAcctno,"密码",oldPswd),
        console.log("resultJsonObject银行卡解绑提交api的参数",resultJsonObject),
          resultJsonObject
          ).done((res_json, res) => {
            this.get_loading().dismiss();
            if(res_json.retCode == 1){
              let tips = "正确提示";
              let showContent = res_json.retMsg;
              PlateFormUtils.plateFormAlert(Platform,tips,showContent);
              this.props.navigator.popN(2);
              //提交成功，把界面pop出去
            }else{
              let tips = "错误提示";
              let showContent = res_json.retMsg;
              PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            }
          })
      }
}
  render() {
  
    return(
      <View style={styles.root}>
        <BackNavBar  component={this}>银行卡解绑</BackNavBar>
        <ScrollView showsVerticalScrollIndicator={false}>
                <FormProvider form={this.form}>
                    <View>
                        <Logintxtin name="oldAcctno" ImageLeft={require('apollo/src/image/bank_card.png')} editable={false} value={this.state.oldAcctno} />
                        <Logintxtin name="oldPswd" secureTextEntry ImageLeft={require('apollo/src/image/lock.png')} placeholder='请输入原卡密码' />
                     <View style={[styles.btnContainer]}>
                        <Submit  containerStyle={[styles.btn]} textStyle={[styles.textBtn]}  onSubmit={()=>this.onsubmit_1()}>提 交</Submit>
                     </View>
                    </View>
                </FormProvider>
                <Loading ref={'loading'} />
            </ScrollView>
        </View>
    )}
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: COMMON_STYLES.MAIN_BACKGROUND_COLOR,
    width:full_width,
    height:full_height,
  },
    btnContainer:{
      height:44,
      marginHorizontal:12,
      justifyContent: "center",
      alignItems:'center',
      marginTop:30
    },
  btn:{
    width:0.8 * full_width,
    height:44,
    borderRadius:8,
    //backgroundColor:'#a19d9e',//灰色
    backgroundColor:'#ed5565',
    
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  textBtn: {
    fontSize: 18,
    color: '#FFFFFF',
  },

});

export default DeleCard