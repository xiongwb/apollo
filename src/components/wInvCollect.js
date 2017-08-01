import React,{PropTypes,Component} from 'react';
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

});


/**
 * 融资意向征集卡（封装公共部分）
 */
@observer
export default class wcard_txtin extends Component {
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
    let {flexdraw,colorTex,editabledraw,bBWidthdraw,pholderdraw,ImageRight,children,units,name,form:_,...others} = this.props;
    const { focused } = this.state;
    const form = this.context.form || this.props.form;
    styles = StyleSheet.create({
     input: {
        borderBottomWidth:bBWidthdraw,
        flex:flexdraw,
    },
    error:{
        color:'red',
        marginLeft:10
    }
    })
    return (
        <View>
        <View  style={{justifyContent:'center', borderBottomColor:'#e5e5e5',borderBottomWidth:bBWidthdraw,flexDirection:'row',flex:1,borderColor:'#e5e5e5',height:44}}>
            
            <View style={{ justifyContent: 'center', marginLeft:12,flex:flexdraw}}>
                <Text style={{fontSize:16,color:colorTex}}>{children}</Text>
            </View>

            <View style={{ flex: 2, justifyContent:'center',}}>
                <TextInput
                style={{justifyContent:'center',alignItems:'center',fontSize:16,height:44,color:'#000000'}}
                underlineColorAndroid='rgba(0,0,0,0)'
                editable={editabledraw}
                placeholder={pholderdraw}
                value={form[name]}
                onFocus={this.onFocus}
                onChangeText={this.onChangeText}
                {...others}
                />
            </View>

            <View style={{justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:16,color:'#101010'}}>{units}</Text>
            </View>

            <View style={{width:50,height:50,justifyContent:'center',alignItems:'center'}}>
               <TouchableOpacity onPress={() => this.__detail()}>
                   <Image source={ImageRight }/>
                </TouchableOpacity>
            </View>
            
        </View>
        <View>
            {focused && <Text style={styles.error}>{form[camelCase('validateError', name)]}</Text>}
        </View>
        </View>
    )
  }

}


