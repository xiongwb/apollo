import React from 'react'
/**
 * 
 * 
 * 
 * 
 * 
 *  <MyMessagetxt Imageremind={require('apollo/src/image/remind.png')} colorfont='#101010' title_Message='感恩专享标感恩专享标感恩专享标感...' 
        receipt='预期年化收益8.0%' dates='2017-04-01 16:24:12' backgroundColordoit='#ed5565' colordoit='#101010' doit='.' Imagearrow_right={require('apollo/src/image/gray_right.png')}/>
        <MyMessagetxt Imageremind={require('apollo/src/image/remind.png')} colorfont='#101010' title_Message='感恩专享标感恩专享标感恩专享标感...' 
        receipt='预期年化收益8.0%' dates='2017-04-01 16:24:12' backgroundColordoit='#ed5565' colordoit='#101010' doit='.' Imagearrow_right={require('apollo/src/image/gray_right.png')}/>
        <MyMessagetxt Imageremind={require('apollo/src/image/remind.png')} colorfont='#999999' title_Message='感恩专享标感恩专享标感恩专享标感...' 
        receipt='预期年化收益8.0%' dates='2017-04-01 16:24:12' Imagearrow_right={require('apollo/src/image/gray_right.png')}/>
        <MyMessagetxt Imageremind={require('apollo/src/image/remind.png')} colorfont='#999999' title_Message='感恩专享标感恩专享标感恩专享标感...' 
        receipt='预期年化收益8.0%' dates='2017-04-01 16:24:12'  Imagearrow_right={require('apollo/src/image/gray_right.png')}/>
        <MyMessagetxt Imageremind={require('apollo/src/image/remind.png')} colorfont='#999999' title_Message='感恩专享标感恩专享标感恩专享标感...' 
        receipt='预期年化收益8.0%' dates='2017-04-01 16:24:12' Imagearrow_right={require('apollo/src/image/gray_right.png')}/>
 */
import {
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
} from 'react-native'
import {
  BasePage,
  BackNavBar,
  NavigatorUtils,
  MyMessagetxt,
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
} from 'ApolloConstant'
import { Color } from 'ApolloConstant';
import Icon from 'react-native-vector-icons/FontAwesome'
import ApolloAPI from 'ApolloAPI';
var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width;

/**
*  我的消息
*  zqf
*2017-4-14
*/
class MyMessage extends BasePage {
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
            titleMessage:'感恩专享标感恩专享标感恩专享标感...',
            messageContent:'',//内容
            sendTime:'',//发送时间
            messListSource:[],
        }
    }
 request_api=async()=>{
      //登录后请求数据
        let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
        let hash = JSON.parse(value);
        if(!!hash){
            ApolloAPI.APIPersonal.MyMessageList({
              //通过参数手机号获取总资产相关信息，目前手机号
              //console.log(this.props.Personal.state.phoneNum),
            telno:hash.retMsg,
            //telno:18722151801,
            readFlag:0//阅读标志不应该当参数：0未阅读，首先默认统一为0，
            //当打开具体消息内容时修改成1为已阅读状态，再以后查询的时候作为返回的参数显示是已阅读还是未阅读状态
            
            }).done((res_json, res)=>{
              if(res_json.retCode === 1){
                console.log("接收的对象是",res_json.messageVOList);
                this.setState({
                  messListSource : res_json.messageVOList
                })
              
              }else{
                PlateFormUtils.plateFormAlert(Platform,'错误提示',"消息信息未获得!");
              }
            })
        }
        
 
  }
showMessage =() =>{
  let messages = [];
  console.log("messListSource的对象是",this.state.messListSource)
  let messList = this.state.messListSource;
  if(messList.length == 0){//没有消息的时候
    return(
      <View  style={{justifyContent:'center',alignItems:'center',marginTop:10,backgroundColor:'#fff',height:0.8 * full_height}}>
           <Text style={styles.textStyle}>您还没有收到消息哦！</Text>
      </View>
    )
  }else{  //有消息的时候,后期消息详情添加touchable，把消息id传入进去,----需往数据库里添加消息标题
      for(let j = 0;j<messList.length;j++){
        messages.push(
          <View key={j}>
            <MyMessagetxt Imageremind={require('apollo/src/image/remind.png')} colorfont='#101010' title_Message={messList[j].messageid} 
            receipt={messList[j].message} dates={messList[j].sendtime} backgroundColordoit='#ed5565' colordoit='#101010' doit='.' Imagearrow_right={require('apollo/src/image/gray_right.png')}/>
          </View>
    )
  }
  return messages;
  }

  
}
componentWillMount() {
    this.request_api();
  }
    render() {
    return (
    <View style={styles.root}>
        <BackNavBar  style={{backgroundColor:'#ed5565'}} component={this}
        //  rightContent={
        //      <View>
        //         <TouchableOpacity onPress={()=>this.props.navigator.pop()}>
        //           <Text style={{fontSize:16,color:'#fff'}}>全部已读</Text>
        //         </TouchableOpacity>
        //       </View>
        //      }
        >我的消息  
        </BackNavBar>
        {this.showMessage()}
       
  </View>     
    );
  }
}

const styles = StyleSheet.create({

   root: {
    backgroundColor: '#ffffff',//页面的布局和颜色
    //backgroundColor: '#dddddd',//页面的布局和颜色
    flex: 1,
  },
   submitStyle:{
      height:44, 
      flexDirection:'row',
      marginHorizontal:12,
      justifyContent: "center",
      alignItems:'center',
      backgroundColor:'#ffffff', 
      borderRadius: 4,
      marginTop:30
    },
});

export default MyMessage
