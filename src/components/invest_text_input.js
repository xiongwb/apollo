import React from 'react';
import {
  View,
  ART,
  TextInput,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  PixelRatio,
  Platform,
  Dimensions
} from 'react-native';
import { StringUtils } from 'ApolloUtils';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import CountDownTimer from './countDownTime';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';

var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width
var full_height = Dimensions.get('window').height
const startTime = observable("1");
const startInvest = observable("");
/**
 * 理财（封装公共部分）
 */
export default class invest_text_input extends React.Component {
  constructor(props){
    super(props);
    this.state={
      disabled:false,
      text:'',
      startTime:'',
      startInvest:''
    }
   
  }
  __detail(){
    return this.props.onPressDetail();
  };
  __commit(){
   // const { onCommit } = this.props;
    
    return this.props.onCommit();
  }
  onTimeOut(){
    startTime.set("0"),
    startInvest.set("立即投资"),
    this.setState({}) 
  }
  // componentWillMount(){
  //     startTime.set(this.props.startTime),
  //     startInvest.set(this.props.startInvest)  
  // }
  render(){
      styles = StyleSheet.create({
        input: {
        backgroundColor:this.props.backgroundColor1
        },
        points100:{
          fontSize:13.5,
          alignSelf:'center',
          color:'#ed5565'
        },
        points: {
          fontSize:16,
          alignSelf:'center',
          color:'#ed5565'
        },
        searchBox:{//搜索框  
          //height:35,  
          flexDirection: 'row',   // 水平排布    
          flex:1,  
          borderRadius: 5,  // 设置圆角边    
          backgroundColor: 'white',  
          alignItems: 'center',
          justifyContent:'center',
          marginLeft: 8,    
          marginRight: 8,    
      },  
      inputText:{ 
        flex:2,
        height:35,
        borderWidth:onePt,
        borderColor:'#dddddd',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'transparent',  
        fontSize:13,    
        paddingLeft:10
      },  
      touchContainer:{
        backgroundColor:'#ed5565',
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        height:35
      },
      disabled:{
        backgroundColor:'#cccccc'
      },
      circleContent:{
          ...Platform.select({
          android:{
            marginTop:10,marginLeft:7
          },
          ios:{
            marginTop:11,marginLeft:3
          }
        }),
        position:'absolute',
      },
      circleContent0:{
        ...Platform.select({
        android:{
          marginTop:10,marginLeft:10
        },
        ios:{
          marginTop:11,marginLeft:8
          }
        }),
        position:'absolute',
      },
      circleContent100:{
      ...Platform.select({
          android:{
          marginTop:11,marginLeft:3
          },
          ios:{
            marginTop:12,marginLeft:3
          }
        }),
        position:'absolute',
      },
      //时间文字

      time: {

        paddingHorizontal: 3,

        backgroundColor: 'rgba(85, 85, 85, 1)',

        fontSize: 12,

        color: 'white',

        marginHorizontal: 3,

        borderRadius: 2,

      },

      //冒号

      colon: {

        fontSize: 12, color: 'rgba(85, 85, 85, 1)'

      },
      
    });

    return (
       
           <View style={[{  borderColor:'#dddddd',borderWidth:onePt,flex:1,backgroundColor:'#ffffff',marginTop:5},{height:this.props.height,width:this.props.width}]}>
      
                <View style={[{flexDirection:'row',alignItems:'center',height:25,marginLeft:10,borderBottomWidth:onePt,borderColor:"#dddddd", justifyContent: 'space-between'}]}>
                   <Text style={{fontSize:14,fontWeight:'bold',color:'#555555'}}>{this.props.prdname}</Text>
                   <Text style={{fontSize:12,color:'#808080',marginRight:10}}>项目规模:{StringUtils.moneyFormatData2Money(this.props.prdquota)}元</Text>
                </View>
                <TouchableOpacity  style={[{flex:1,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}]} onPress={() => this.__detail()}>
                <View>
                  <Text style={{fontSize:21,color:'#ff5300',alignSelf:'center'}}>{this.props.yearprofitrate}</Text>
                  <Text style={{fontSize:10,color:'#808080',alignSelf:'center'}}>年化收益</Text>
                </View>
                <View>
                  <Text style={{fontSize:21,color:'#ed5565',alignSelf:'center'}}>{this.props.prddays}</Text>
                  <Text style={{fontSize:10,color:'#808080',alignSelf:'center'}}>项目期限</Text>
                </View>
                <View>
                  <AnimatedCircularProgress
                      size={40}
                      width={3 * onePt}
                      fill={this.props.percent}
                      tintColor="#ED5565"
                      rotation={0}
                      backgroundColor="#DDDDDD">
                      {
                      (fill) => (
                      <View style={[this.props.percent>=0 && this.props.percent <=9 && styles.circleContent0,
                                    this.props.percent>=10 && this.props.percent <=99 && styles.circleContent,
                                    this.props.percent >=100 && styles.circleContent100]}>
                        <Text style={[styles.points,this.props.percent >= 100 &&  styles.points100 ]}>
                            {this.props.percent}%
                        </Text>
                      </View>
                      )
                      }
                  </AnimatedCircularProgress>
                </View>
                <View>
                  <Image source={require('apollo/src/image/arrow_right.png')} style={{backgroundColor:'transparent',}}/>
                </View>
              </TouchableOpacity>
              <View style={styles.searchBox}>  
                <View style={{  flex:2,height:35,justifyContent:'center'}}>
                  <TextInput ref="invMoney" editable={!this.props.disabled} style={styles.inputText}  keyboardType='numeric'  
                    onChangeText={(text)=>this.props.onChangeText(text)}  placeholder='请输入投资金额'  underlineColorAndroid='rgba(0,0,0,0)' />         
                </View>
                <View style={{  flex:1,height:35,justifyContent:'center'}}>
                  <TouchableOpacity onPress={()=>this.__commit()} disabled={this.props.disabled} style={[styles.touchContainer, this.props.disabled && styles.disabled]}>
                    <Text style={{fontSize:13,color:'#ffffff',fontWeight:'bold'}}>{this.props.startInvest || startInvest.get() }</Text>  
                  </TouchableOpacity>
                </View>
                
            </View>  
            <View style={[{flexDirection:'row',alignItems:'center',borderBottomWidth:onePt,backgroundColor:'#f8f8f8' ,borderColor:"#dddddd", justifyContent: 'space-between',height:25}]}>
              <Text style={{fontSize:10,color:'#808080',marginLeft:10}}>￥{StringUtils.moneyFormatData2Money(this.props.startYuan)}元起投</Text>
              {
                this.props.startTime != '' && startTime.get() =='1' ?
                 <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                     <Text style={{color:'#ff6068',fontWeight:'bold'}}>抢购倒计时：</Text>
                     <CountDownTimer
                      date={this.props.startTime}
                      days={{plural: '天 ',singular: '天 '}}
                      hours=':'
                      mins=':'
                      segs=''
                      
                      daysStyle={styles.time}
                      hoursStyle={styles.time}
                      minsStyle={styles.time}
                      secsStyle={styles.time}
                      firstColonStyle={styles.colon}
                      secondColonStyle={styles.colon}
                      onEnd={()=>this.onTimeOut()}
                  />
                   </View>
                :
                <Text style={{fontSize:10,color:'#808080',marginRight:10}}>剩余可投:{StringUtils.moneyFormatData2Money(this.props.end_Words)}元</Text>
              }
             
            </View> 
         </View>
        
      
    )
  }

}