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
 * 登录（封装公共部分）
 */
@observer
export default class login_txtin extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    form: PropTypes.object,
    // children: PropTypes.string.isRequired,
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
  
  render(){
      let {ImageLeft,editable,placeholder,name,form:_,...others} =this.props;
      const { focused } = this.state;
      const form = this.context.form || this.props.form;
      let disabled = true;
      let showPswdname = '';
      if(form[name] != '' && form[name] != null){
          disabled = false;        
      }
      if(this.props.secureTextEntry){
        showPswdname='显示密码'
      }else{
        showPswdname='隐藏密码'
      }
    return ( 
      <View>
          <View style={{ height: 44,marginHorizontal: 20, marginTop: 12,flexDirection: 'row', borderColor: '#e5e5e5',backgroundColor: '#ffffff',borderWidth: 1,borderRadius: 2,}}>
            <View style={{ justifyContent: 'center', marginHorizontal: 12 }}>
                <Image source={ImageLeft}/>
            </View>
            <View style={{ flex: 1,flexDirection:'row',alignItems:'center'}}>
            <View style={{ flex: 3,}}>
                <TextInput style={{height:45}}
                editable={editable}
                onChangeText={this.onChangeText}
                value={form[name]}
                onFocus={this.onFocus}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder={placeholder}
                {...others}
              />
            </View>
            
              {
                this.props.showPswd ?
                <TouchableOpacity disabled={disabled} style={{flex: 1,marginLeft:30}} onPress={()=>this.props.onPress()}>
                 <Text style={[{color: '#a19d9e'},disabled == false && {color: '#0073ff'}]}>{showPswdname}</Text>
                </TouchableOpacity>
                : 
                null
              }
             
             
            </View>
          </View>
          <View>
              {focused && <Text style={styles.error}>{form[camelCase('validateError', name)]}</Text>}
          </View>
     </View>
    )
  }

}