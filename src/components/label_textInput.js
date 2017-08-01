
import React, { Component ,PropTypes} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  Image,
  ART,
  TextInput,
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

@observer
class labelTextInput extends Component {
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
    isFill:true,
    mark:'*',
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
    if (!this.props.isFill){
      this.setState({
        isFill:false,
        mark:'',
      })
    }
    if (this.props.multiline){
      this.setState({
       multiline:true
      })
    }
  };
  
  componentWillMount(){
    this.handleState();
  }
  render() {
    let {isFill,children,placeholder,marginTop,keyboardType,maxLength,unit,editable,name,form:_,...others} = this.props;
    let textInput = {
      borderColor: this.props.borderColor || DEFAULT_STYLES.textInput.borderColor,
      borderRadius: this.props.borderRadius || DEFAULT_STYLES.textInput.borderRadius,
      borderWidth: this.props.borderWidth || DEFAULT_STYLES.textInput.borderWidth,
      height: this.props.height || DEFAULT_STYLES.textInput.height,
      width: this.props.width || DEFAULT_STYLES.textInput.width,
    }
    const { focused } = this.state;
    const form = this.context.form || this.props.form;

    return (
    <View style={styles.container}>
        <View style={[styles.excelContainer,{marginTop:marginTop}]}>
            <View style={[styles.excelItem,{height:this.props.height+5}]}>
                <View style={{flex:1,justifyContent:'flex-end', alignItems:'center',flexDirection:'row'}}>
                    <Text style={this.state.isFill && styles.isFill}>{this.state.mark}</Text>
                    <Text style={styles.fontLabel}>{children}:</Text>
                </View>
                <View style = {{flex:2,flexDirection:'row', marginLeft:10,justifyContent:'center'}}>
                    <TextInput style={[textInput,styles.fontLabel]}
                      keyboardType={keyboardType}
                      //returnKeyType="search"
                      placeholder={placeholder}
                      underlineColorAndroid='transparent'
                      multiline={this.state.multiline}
                      maxLength={maxLength}
                      editable={editable}
                      value={form[name]}
                    // onChangeText={this.props.onChangeText}
                      onFocus={this.onFocus}
                      onChangeText={this.onChangeText}
                      {...others}
                    ></TextInput>
                    <Text style={[styles.fontLabel,{marginLeft:3}]}>{unit}</Text>
                </View>
            </View>
            <View>
                {focused && <Text style={styles.error}>{form[camelCase('validateError', name)]}</Text>}
            </View>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundColor,
    marginTop:6,
  },
  excelContainer: {
    flex:1,
    backgroundColor:'#fff'
  },
  excelItem:{
    flexDirection:'row',
    height:35,
    marginLeft:10,
    marginRight:10,
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

export default labelTextInput