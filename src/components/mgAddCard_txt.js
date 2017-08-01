import React,{ PropTypes } from 'react';
import {
  View,
  ART,
  TextInput,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { observer } from 'mobx-react/native';
import camelCase from 'camelcase';

const styles = StyleSheet.create({
    input_box: {
      height: 45,
      marginHorizontal: 20,
      marginTop: 12,
      flexDirection: 'row',
    // borderColor: 'red',<Image source={require('apollo/src/image/account.png')} />
      borderColor: '#e5e5e5',
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderRadius: 2,
    },
    error:{
      color:'red',
      marginLeft:30
    }
});
/**
 * 设置--银行卡管理---添加银行卡（封装公共部分）
 */
@observer
export default class mgAddCard_txt extends React.Component {
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
   __detail(){
    return this.props._rightButtonClick();
  };
  render(){
      let {disabled,children,ImageLeft,editable,keyboardType,placeholder,name,form:_,...others} =this.props;
      const { focused } = this.state;
      const form = this.context.form || this.props.form;
      styles = StyleSheet.create({
          input: {
          borderBottomWidth:this.props.bBWidthdraw,
          flex:this.flexdraw,
          },
      });
        return (
   <View  style={{justifyContent:'center', borderBottomColor:'#e5e5e5',borderBottomWidth:this.props.bBWidthdraw,flexDirection:'row',flex:1,borderColor:'#e5e5e5',height:44}}>
          <TouchableOpacity disabled={disabled||false} style={{ flex: 1, flexDirection:'row', justifyContent:'center',alignItems:'center'}} onPress={() => this.__detail()}>
            <View style={{ justifyContent: 'center', marginLeft:12,flex:this.props.flexdraw}}>
                <Text style={{fontSize:16,color:this.props.colorTex}}>{children}:</Text>
            </View>
            <View style={{ flex: 3, justifyContent:'center',}}>
                <TextInput
                style={{justifyContent:'center',alignItems:'center',fontSize:16,height:44,color:'#000000'}}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  // editable={this.props.editabledraw}
                  // placeholder={this.props.pholderdraw}
                  keyboardType={keyboardType}
                  placeholder={placeholder}
                  underlineColorAndroid='transparent'
                  //multiline={this.state.multiline}
                  //maxLength={maxLength}
                  editable={editable}
                  value={form[name]}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  {...others}
                />
            </View>
            <View style={{justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:16,color:'#101010'}}>{this.props.units}</Text>
            </View>
            <View style={{width:50,height:50,justifyContent:'center',alignItems:'center'}}>
                <Image  source={this.props.ImageRight }/>
            </View>
          </TouchableOpacity>
      </View>
    )
  }

}