import React from 'react';
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
} from 'react-native';


import {
  BackNavBar,
  NavigatorUtils,
} from 'ApolloComponent'

/**
 * 我的消息（封装公共部分）
 */

var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width;
export default class MyMessage_txt extends React.Component {
 constructor(props){
    super(props);
    this.state={
      disabled:false,
    }
   
  }
  render(){
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
     return (
        <View style={{height:full_height/6.2,borderBottomColor:'#dddddd',borderBottomWidth:1}}>
          <View style={{marginHorizontal:12,flexDirection:'row',marginTop:12}}>
          <View style={{justifyContent:'center',alignItems:'flex-start',}}>
            <Image source={this.props.Imageremind}/> 
          </View>
          <View style={{justifyContent:'center',marginHorizontal:8}}>
            <Text style={{fontSize:16,color:this.props.colorfont}}>{this.props.title_Message}</Text>
            <Text style={{fontSize:14,color:'#999999',marginVertical:8}}>{this.props.receipt}</Text>
            <Text style={{fontSize:14,color:'#999999'}}>{this.props.dates}</Text>
          </View>
          <View style={{justifyContent:'flex-end',flex:5, flexDirection:'row'}}>
              <View style={{justifyContent:'center',marginRight:8}}>
              <Text style={{backgroundColor:this.props.backgroundColordoit,color:this.props.colordoit,fontSize:14,height:7,width:7,borderRadius: 50,}}>{this.props.doit}</Text>
              </View>  
              <View style={{justifyContent:'center',alignItems:'flex-end',}}>
              <Image source={this.props.Imagearrow_right}/>
              </View>
              </View>
          </View>
        </View> 
    );
  }

}