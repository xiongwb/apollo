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

import Icon from 'react-native-vector-icons/FontAwesome';

var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_height = Dimensions.get('window').height
/**
 * 融资记录（封装公共部分）
 */
export default class Record_finc_txt extends React.Component {
  constructor(props){
    super(props);
    this.state={
      disabled:false,
    }
   
  }
  __detail(){
    return this.props.onPressDetail();
  };
  __commit(){
    return this.props.onCommit();
  }

  render(){
      

    return (
       
            <View style={{marginHorizontal:8,paddingHorizontal:8,borderColor:'#dddddd',borderWidth:onePt,backgroundColor:'#ffffff',marginTop:5,marginBottom:5,borderRadius:5,height:100}}>
              <TouchableOpacity style={{flex:2}} onPress={() => this.__detail()}>
                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}} >
                  <View style={{justifyContent:'space-between'}}>
                    <Text style={{fontSize:16,fontWeight:'bold',color:'#101010'}}>感恩专项标</Text>
                    <Text>融资金额：100,000.00</Text>
                  </View>
                  <View style={{alignItems:'center',justifyContent:'center',height:40,width:40,borderColor:'#ED5565',borderWidth:1,borderRadius:35}}>
                    <Text style={{color:'#ED5565'}}>正常</Text>
                  </View>
                  <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Icon name='chevron-right' size={20}/>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderTopColor:'#dddddd',borderTopWidth:1}}>
                <Text style={{fontSize:10,color:'#4d4d4d'}}>募集时间:0000-00-00至0000-00-00</Text>
                <TouchableOpacity onPress={()=>this.__commit()} disabled={false}>
                  <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#ED5565',width:50,height:20,borderRadius:2}}>
                    <Text style={{fontSize:10,color:'#ffffff',}}>还款</Text>
                  </View>
                </TouchableOpacity>
              </View> 
            </View>
        
      
    )
  }
  styles = StyleSheet.create({
    points: {
      fontSize:16,
      alignSelf:'center',
      color:'#ed5565'
    },  
    inputText:{ 
      flex:2,
      height:35,
      borderWidth:onePt,
      borderColor:'#dddddd',
      backgroundColor:'transparent',  
      fontSize:16,
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'center',
    },  
    touchContainer:{
      backgroundColor:'#ed5565',
      justifyContent: 'center',
      alignItems: 'center',
      //flex:1,
      width:50,
      height:20,
      borderRadius:2
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
          marginTop:12,marginLeft:5
        }
      }),
      position:'absolute',
    }
  });
}