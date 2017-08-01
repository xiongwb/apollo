import React from 'react'

import {
  Dimensions,
  Text,
  Image,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  TextInput,
  PixelRatio,
  ScrollView
} from 'react-native'
import {
  BasePage,
  BackNavBar,
  NavigatorUtils,
  Wcardtxtin,
  Loading,
  PushLogin,
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_CONFIG,
} from 'ApolloConstant'
import { Color } from 'ApolloConstant';
import ApolloAPI from 'ApolloAPI';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Icon from 'react-native-vector-icons/FontAwesome'
var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width;

/**
*  设置--银行卡管理---银行卡(添加，解除)
*  zqf
*2017-4-14
  zgx修改
*/
class CardMagAddRelieve extends BasePage {
  constructor(props) {
        super(props)
        this.state = {
            is_bankcard : false,
            bindListSource:[],
            openbank:'',
            bankCardNo:'',
            acctno:''
        }
    }

  get_loading() {
    return this.refs.loading;
  }

 request_api=async()=>{
     this.get_loading().show();
     let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
      let hash = JSON.parse(value)
        if(!!hash && hash.retCode == 1){
         ApolloAPI.APIcard.getIsBindList({
           //通过参数手机号获取银行卡信息
          telno:hash.retMsg,
        }).done((res_json, res)=>{
            this.get_loading().dismiss();
            if(res_json.retCode === 1){
               let mainflag='';
               console.log(res_json)
              this.setState({//finacctno账户号
                is_bankcard:true,
                bindListSource : res_json.bindList
            })
          }else{
               this.setState({is_bankcard:false})
            }
          })
        }
  }

  toCardAdd(){
    this.props.navigator.push({id: 'CardAdd'})
  }

  toCardChange(route){
    this.props.navigator.push({id: route})
  }

  showMessage =() =>{
   let bindListSouList =[];
   let bindListSou= this.state.bindListSource;
   // console.log("bindListSou===的对象是",bindListSou)
    for(let j=0;j<bindListSou.length;j++){
        let openbank = bindListSou[j].openbank;
        if(bindListSou[j].mainflag ==1){
            openbank = bindListSou[j].openbank + "   " +"主卡";
        }
        let acctno=bindListSou[j].acctno.substr(bindListSou[j].acctno.length-4,bindListSou[j].acctno.length);
        let xhao = "";
        for(let i=0;i<bindListSou[j].acctno.length-4;i++){
          xhao+="*"
        }
        acctno = xhao + acctno;
        bindListSouList.push (
                <TouchableOpacity key={j} onPress={() => this.props.navigator.push({ id: 'CardChange',params:{acctno:bindListSou[j].acctno,CardMagAddRelieve:this.CardMagAddRelieve} })}>
                    <View style={styles.input_box}>
                        <View style={{flexDirection:'row',flex:0.75, justifyContent:'center',alignItems:'center',marginLeft:10}}>
                           <Image source={require('apollo/src/image/wbank_card.png')} style={{width:80,height:50}}/>
                        </View>
                        <View style={{flex:2, justifyContent:'center',}}>
                            <Text style={{fontSize:20,color:'#4d4d4d',marginLeft:16,marginTop:12}}>{openbank}</Text>
                            <Text style={{fontSize:16,color:'#4d4d4d',marginLeft:16,marginTop:12}}>{acctno}</Text>
                        </View>
                        <View style={{flex:0.8,justifyContent:'center',alignItems:'center'}}>
                            <Image style={{justifyContent:'flex-end',alignItems:'flex-end'}} source={require('apollo/src/image/change.png')}/>
                        </View>
                      </View>
                </TouchableOpacity>        
        );
    }
  return bindListSouList;
}
  componentDidMount(){
     this.listener1 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.DIDBNDCARDSUCCESS,(value)=>{
      // 接受到通知后的处理
      if(value == "bindcard"){
         this.request_api();
      }
     
    });

     this.listener2 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.CARDCHANGESUCCESS,(value)=>{
      // 接受到通知后的处理
      if(value == "cardBandSuccess"){
         this.request_api();
      }
     
    });
     this.request_api();
  }
  componentWillUnmount(){
    // 移除 一定要写
    this.listener1.remove();
    this.listener2.remove();
  }
  
  _rightButtonClick() {
    this.props.navigator.push({id:'DeleCard',params:{}})
    console.log('右侧按钮点击了');
    //this._setModalVisible();
  }
    // 显示/隐藏 modal
  _setModalVisible() {
    let isShow = this.state.show;
    this.setState({
      show:!isShow,
    });

  }
    render() {
    return (
        <View style={styles.root}>
            <BackNavBar  style={{backgroundColor:'#ed5565'}} component={this}>银行卡管理</BackNavBar>
            <ScrollView showsVerticalScrollIndicator={false}>
            {this.state.is_bankcard == true ? 
              <View>
                {this.showMessage()}
                <TouchableOpacity onPress={() =>  this.toCardAdd()}>
                  <View style={{flexDirection:'row',height:full_height*0.078,backgroundColor:'#ffffff',justifyContent:'center',alignItems:'center',marginTop:12}}>
                      <View style={{flex:0.15}}>
                      <Image style={{marginLeft:16}} source={require('apollo/src/image/add_bank.png')}/>
                      </View>
                      <View style={{flex:1}}>
                      <Text style={{fontSize:16,color:'#101010',}}>添加银行卡</Text>
                      </View>
                      <Image style={{justifyContent:'flex-end',alignItems:'flex-end',marginRight:16}} source={require('apollo/src/image/arrow_right.png')}/>
                  </View>
              </TouchableOpacity> 
              </View>
              :
              <TouchableOpacity onPress={() =>  this.toCardAdd()}>
                  <View style={{flexDirection:'row',height:full_height*0.078,backgroundColor:'#ffffff',justifyContent:'center',alignItems:'center',marginTop:12}}>
                      <View style={{flex:0.15}}>
                      <Image style={{marginLeft:16}} source={require('apollo/src/image/add_bank.png')}/>
                      </View>
                      <View style={{flex:1}}>
                      <Text style={{fontSize:16,color:'#101010',}}>添加银行卡</Text>
                      </View>
                      <Image style={{justifyContent:'flex-end',alignItems:'flex-end',marginRight:16}} source={require('apollo/src/image/arrow_right.png')}/>
                  </View>
              </TouchableOpacity> 
            }
            </ScrollView>
            <Loading ref="loading" />
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
    flex:1,
    height: 90,
    width: full_width,
    marginTop: 5,
    flexDirection: 'row',
    borderColor: '#e5e5e5',
    backgroundColor: 'white',
    borderWidth: 1,
  },
});

export default CardMagAddRelieve
