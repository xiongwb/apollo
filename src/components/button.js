/**
 * Component : Common Button
 * Author :zgx
 * date : 2017/02/24
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PixelRatio
} from 'react-native';

var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
export default class Button extends Component {
   constructor(props){
    super(props);
    this.state = {
      show:false,
      disabled:false
    };
  }
  custumPressHandler = () =>{
    //自定义的方法，用属性来定义

    //alert(this.state.value+"当前状态是"+this.state.status);
    const {onPressButton} = this.props;
    this.disable();
    //回调方法的使用
    onPressButton(this.enable);
  };
  disable = () =>{
    this.setState({
       disabled:true
    }
    )
  } 

  enable = () =>{
  this.setState({
      disabled:false
   }
   )
  } 
  
  render() {
      
    const {text,backgroundColor} = this.props;
    return (
      
      <View style={styles.container}>
       <TouchableOpacity 
         disabled={this.state.disabled}
         style={[styles.btn,this.state.disabled && styles.disabled, ]}
        //   {backgroundColor:backgroundColor} 
         onPress={this.custumPressHandler}>
          <Text style={[styles.search ,this.state.disabled && styles.disabledfont,]}>
          {this.props.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  search:{
      color:'#ed5565',
      fontSize:15,
      fontWeight:'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  btn:{
    width:45,
    marginLeft:-5,
    marginRight:5,
    borderRadius:4,
    backgroundColor:'#FFFFFF',
    borderColor:'#ed5565',
    borderWidth:onePt,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  disabled:{
      backgroundColor:'#ed5565',
  },
  disabledfont:{
      color:'#fff',
      fontSize:15,
      fontWeight:'bold',
  }
});

