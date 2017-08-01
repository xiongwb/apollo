//import React from 'react';
import React, { Component ,PropTypes} from 'react';
import {
  View,
  ART,
  TextInput,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  PixelRatio,
  Dimensions
} from 'react-native';
import {
  PushLogin,
} from 'ApolloComponent';
import { Color, DEFAULT_STYLES } from 'ApolloConstant';
import { observer } from 'mobx-react/native';
import camelCase from 'camelcase';



var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
/**
 * 银行卡（封装公共部分）
 */
export default class changePwd_txtin extends React.Component {
   static propTypes = {
    name: PropTypes.string.isRequired,
    form: PropTypes.object,
    children: PropTypes.string.isRequired,
    autoFocus: PropTypes.boolean,
    ...TextInput.propTypes,
  };
  static contextTypes = {
    form:PropTypes.object,
  };
  state = {
    // isFill:true,
    // mark:'*',
     multiline:false,
    focused: this.props.autoFocus,
  };

  onChangeText = (text) => {
    const { name } = this.props;
    const form = this.context.form || this.props.form;
    form[name] = text;
  }
  onFocus = () => {
    if (!this.state.focused) {
      this.setState({ focused: true });
    }
  };
  handleState(){
    // if (!this.props.isFill){
    //   this.setState({
    //     isFill:false,
    //     mark:'',
    //   })
    // }
    if (this.props.multiline){
      this.setState({
       multiline:true
      })
    }
  };
  
  componentWillMount(){
    this.handleState();
  }


  __detail(){
    return this.props._rightButtonClick();
  };
  render(){
    let {children,placeholder,keyboardType,multiline,editable,name,form:_,...others} = this.props;
    const { focused } = this.state;
    const form = this.context.form || this.props.form;

    styles = StyleSheet.create({
    input: {
    borderBottomWidth:this.props.bBWidthdraw,
      flex:this.flexdraw,
    },
 
});
//alert(children);
    return (
   <View  style={{justifyContent:'center', borderBottomColor:'#e5e5e5',borderBottomWidth:this.props.bBWidthdraw,flexDirection:'row',flex:1,borderColor:'#e5e5e5',height:44}}>
          <View style={{ justifyContent: 'center', marginLeft:12,flex:this.props.flexdraw}}>
           <Text style={{fontSize:16,color:this.props.colorTex}}>{children}:</Text>
          </View>
          <View style={{ flex: 2, justifyContent:'center',}}>
            <TextInput
             style={{justifyContent:'center',alignItems:'center',fontSize:16,height:44,color:'#000000'}}
              
              // editable={this.props.editabledraw}
              // placeholder={this.props.pholderdraw}
              editable={editable}
              onChangeText={this.onChangeText}
              //value={form[name]}
              onFocus={this.onFocus}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder={placeholder}
              keyboardType={keyboardType}
              //underlineColorAndroid='transparent'
              multiline={this.state.multiline}
              //maxLength={maxLength}
              {...others}
            ></TextInput>
          </View>
            <View style={{width:50,height:50,justifyContent:'center',alignItems:'center'}}>
               <TouchableOpacity onPress={() => this.__detail()}>
                   <Image source={this.props.ImageRight }/>
                </TouchableOpacity>
            </View>
          <View>
            {focused && <Text style={styles.error}>{form[camelCase('', name)]}</Text>}
          </View>  
        </View>
    )
  }

}

 styles = StyleSheet.create({
   container: {
   // flex: 1,
    backgroundColor: Color.backgroundColor,
    //marginTop:6,
  },
  excelContainer: {
    //flex:1,
    backgroundColor:'#fff'
  },
  excelItem:{
   justifyContent:'center', 
   borderBottomColor:'#e5e5e5',
   //borderBottomWidth:this.props.bBWidthdraw,
   flexDirection:'row',
   flex:1,borderColor:'#e5e5e5',
   height:44,
  },
   isFill:{
    color: 'red',
  },
  fontLabel:{
    fontSize:14,
    color:'#757575',
    textAlign:'center',
    alignSelf:'center'
  },
  error:{
    color:'red',
    marginLeft:10
  }
});
