import React from 'react'

import {
  ART,
  Dimensions,
  Text,
  Image,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
  PixelRatio,
  ScrollView,
  Platform,
  Modal
} from 'react-native'
import {
  BasePage,
  NavigatorUtils,
  Wcardtxtin,
  Logintxtin,
  FormProvider,
  Submit,
  Loading,
  NavBar,
  PushLogin
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
} from 'ApolloConstant'
import { Color } from 'ApolloConstant';
import ApolloAPI from 'ApolloAPI';
import { observable, toJS } from 'mobx';
import validate from 'mobx-form-validate';
import {PlateFormUtils} from "ApolloUtils";
import Icon from 'react-native-vector-icons/FontAwesome'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width;

/**
 * 绑定的卡列表
*  充值--只显示主卡--(点击)--卡列表
*  zqf
*2017-4-29
*/
class CardBindList extends BasePage {
  constructor(props) {
        super(props)
        this.state = {
            form_validate: false,
            varCode: '',
            newPhone: '',
            m: 0,
            iconString:'circle-o',
            iconColor:'#dddddd',
            disabled:true,
            selectedValue: '',
            show:false,//model是否显示

            is_bankcard : false,
            bindListSource:[],
            openbank:'',
            bankCardNo:'',
            phoneNo:'',
            //telno:''
        }
    }

 request_api=async ()=>{
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value)
    if(!!hash && !! hash.retCode){
      let hash = JSON.parse(value)
      console.log(hash)
      ApolloAPI.APIcard.getIsBindList({
        //通过参数手机号获取银行卡信息
      telno:hash.retMsg
      }).done((res_json, res)=>{
        if(res_json.retCode === 1){
          //alert(telno);
          //let mainflag='';
            console.log(res_json)
            //显示卡列表，从后台返回的是个数组
          this.setState({//finacctno账户号
            // is_bankcard:true,
            bindListSource : res_json.bindList
        })
        }else{
            PlateFormUtils.plateFormAlert(Platform,'错误提示',"银行卡信息未获得!");
        }
      })
    }else{
    //没有绑定的  显示添加银行卡
    //this.setState({is_bankcard:false})
    //应该返回到登录界面
  }
  }

showMessage =() =>{
   let bindListArray=[];
   let bindListSou =[];
    bindListSou= this.state.bindListSource;
    console.log("bindListSou===的对象是",bindListSou)
   if(bindListSou.length==0){
    //  //没有绑定的  显示添加银行卡
   return(
      <View style={{justifyContent:'center',alignItems:'center'}}>
        <Text>您还没有绑卡哦!</Text>
      </View>
    )
  }else{
    for(let j=0;j<bindListSou.length;j++){
        let acctno=bindListSou[j].acctno.substr(bindListSou[j].acctno.length-4,bindListSou[j].acctno.length);
        let xhao = "";
        for(let i=0;i<bindListSou[j].acctno.length-4;i++){
          xhao+="*"
        }
        acctno = xhao + acctno;
        bindListArray.push(
          <View key={j}>
            <TouchableOpacity onPress={() =>  this.retRechange(bindListSou[j])}>
                <View style={styles.input_box}>
                  <View style={{flexDirection:'row',flex:1, justifyContent:'center',backgroundColor:'transparent',marginHorizontal:1}}>
                    <View style={{flexDirection:'row',flex:0.7, justifyContent:'center',marginVertical:16,}}>
                      <Image source={require('apollo/src/image/wbank_card.png')} style={{width:80,height:50}}/>
                    </View>
                    <View style={{flex:2, justifyContent:'center',}}>
                        <Text style={{fontSize:20,color:'#4d4d4d',marginLeft:16,marginTop:12}}>{bindListSou[j].openbank}</Text>
                        <Text style={{fontSize:16,color:'#4d4d4d',marginLeft:16,marginTop:12}}>{acctno}</Text>
                    </View>
                  </View>
                </View>
            </TouchableOpacity>
        </View>     
        )
          
        
  }
  return bindListArray;
}
}

 async retRechange(bindListSou){
  //将选中的银行卡信息存储
  await AsyncStorage.setItem(STORAGE_KEYS.BANKCARDINFO,JSON.stringify(bindListSou));
  //广播已经存储
  RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.BANKINFOSUCCESS, 'cardBindLlist');     
  this.props.navigator.pop();  
 }

 componentWillMount() {
    this.request_api();
 }
  _rightButtonClick() {
    this.props.navigator.push({id:'DeleCard',params:{}})
    console.log('右侧按钮点击了');
    //this._setModalVisible();
  }
 

  toCardAdd(){
     this.props.navigator.push({id: 'CardAdd'})
  }

    render() {
    return (
        <View style={styles.root}>
           <NavBar
            backgroundColor={'#ED5565'}
            width = {full_width}
            titleContent={<Text style={{color: "white", fontSize: 18}}>选择银行卡</Text>}
            leftContent={
              <TouchableOpacity onPress={()=>this.props.navigator.pop()}>
                <Icon style={{marginRight: 15}} name="angle-left" size={22} color={'#fff'} />
              </TouchableOpacity>
            }
            rightContent={
              <TouchableOpacity onPress={() => this.toCardAdd()}>
                <Text style={{color: "white", fontSize: 18}}>添加</Text>
              </TouchableOpacity>
            }
          />
            {this.showMessage()}
        </View>     
    );
  }
}

const styles = StyleSheet.create({
   root: {
    //backgroundColor: '#ffffff',//页面的布局和颜色
    backgroundColor: '#dddddd',//页面的布局和颜色
    flex: 1,
  },
  input_box: {
    height: 90,
    width: full_width,
    marginTop: 12,
    flexDirection: 'row',
    borderColor: '#e5e5e5',
    backgroundColor: 'white',
    borderWidth: 1,
  },
buttonStyle:{
      height:44, 
      width:full_width*0.85,
      marginHorizontal:12,
      justifyContent: "center",
      alignItems:'center',
      backgroundColor:'#ffffff',  
      borderRadius: 8,
      marginTop:12,
},
btnConfirm:{ 
      fontSize:16,
      color:'#ed5565',
},
btnCancel:{ 
      fontSize:16,
      color:'#333333',
},
});

export default CardBindList
