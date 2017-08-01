/**
 *  <Logintxtin ImageLeft={require('apollo/src/image/referee.png')} placeholder='推荐人用户名(可不填)' />
 */
import React from 'react'
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
    ToastAndroid,
    Platform,
    ScrollView,

} from 'react-native'
import {
    BasePage,
    BackNavBar,
    NavigatorUtils,
    Logintxtin,
    FormProvider,
    Submit,
    Loading

} from 'ApolloComponent'
import {
    EVENT_EMITTER_CONST,
    STORAGE_KEYS,
    COMMON_CONFIG,
    DEFAULT_STYLES
} from 'ApolloConstant'
import { PlateFormUtils } from 'ApolloUtils';

import Icon from 'react-native-vector-icons/FontAwesome';
import ApolloAPI from 'ApolloAPI';
import { observable, toJS,computed } from 'mobx';
import validate from 'mobx-form-validate';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import Toast, {DURATION} from 'react-native-easy-toast';
import ModalDropdown from 'react-native-modal-dropdown';

var Md5_Encrypt = require("crypto-js/md5"); //引入md5加密
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
const DEMO_OPTIONS = ['个人', '企业'];
const verifyCode = observable(0);

class RegisterForm {
  
  @observable
  @validate(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/, '密码必须为数字、字母的组合，长度为6-30位!')
  pswd = '';

  @observable
  @validate(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/, '密码必须为数字、字母的组合，长度为6-30位!')
  pswdConfirm = '';

  @observable
  @validate(/^1(3|4|5|7|8)\d{9}$/,'请输入正确的手机号码!')
  loginNo = '';

  @observable
  @validate(/^.+$/,'此处不为空.')
  cusName = '';

  @observable
  @validate(/^.+$/,'此处不为空.')
  nickName = '';
}


const styles = StyleSheet.create({
    root: {
        backgroundColor: "#fff",
        flex: 1,
    },
    input_box: {
        height: 45,
        marginHorizontal: 20,
        marginTop: 8,
        flexDirection: 'row',
        // borderColor: 'red',
        borderColor: '#e5e5e5',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 2,
        justifyContent:'center',
        alignItems:'center',
    },
    sign_box: {
        paddingHorizontal: 10,
        //alignItems:'stretch',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
        marginHorizontal: 30,
    },
    forgetPwd_box: {
        paddingHorizontal: 10,
        alignItems: 'flex-end',
    },
    btnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    btn:{
        width:0.8 * full_width,
        borderRadius:8,
        backgroundColor:'#a19d9e',
        height:0.06 * full_height,
        justifyContent:'center',
        alignItems:'center',
        overflow:'hidden'
    },
    textBtn: {
        fontSize: 16,
        color: '#FFFFFF',
    },
});


/**
*  注册页面
*  by fushang318
*/
class Register extends BasePage {

    form = new RegisterForm();

    constructor(props) {
        super(props)
        this.state = {
            varCode: '',
            newPhone: '',
            m: '',
            iconString:'circle-o',
            iconColor:'#dddddd',
            verifyCode:'',
            verified:false,
            onChecked:false,
            haveVfcode:false,
            editable:false,
            cusType:1,
            disabled:true,
            verifyCreditCode:false,
            verifyCertNo:false,
            secureTextEntry1:true,
            secureTextEntry2:true,
        }
    }

    componentDidMount(){
        this.get_loading().show();
        ApolloAPI.APIBorrow.sendProtocolData({
           tenantNo:COMMON_CONFIG.tenantNo,
           channel:COMMON_CONFIG.channel,
           proType:3,
           returnType:3
        }).done((res_json, res) => {
            if(res_json.retCode == 1){
                this.get_loading().dismiss();
                this.setState({
                    disabled:false,
                    protocoltitle:res_json.protocoltitle,
                    protocolcontent:res_json.protocolcontent
                })
            }else{
                this.get_loading().dismiss();
                this.refs.toast.show(res_json.retMsg,DURATION.LENGTH_SHORT);
                //PlateFormUtils.plateFormAlert(Platform,"错误提示",res_json.retMsg);
            }
        })
    }

    //点击获取验证码按钮 触发这个方法，获取到手机验证码
    on_pushone() {
        let phoneNo= this.form.loginNo;
        if(phoneNo == ''){
            //let tips = "错误提示";
            let showContent = "获取验证码前必须先输入手机号码!";
            //PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
        }else{
            Alert.alert('确认手机号', `短信验证码将发送到你的手机\n+86 ${phoneNo}`, [
                { text: '取消'},
                { text: '好的', onPress: () => {
                    this.get_loading().show();
                    ApolloAPI.APIRegister.getVarCode({
                            phoneNo: phoneNo,
                            flag:3,
                            tenantNo: COMMON_CONFIG.tenantNo,
                            //.done是什么意思,res_data_json这是从哪知道的，没有声明
                        }).done((res_data_json, res) => {
                            this.get_loading().dismiss();
                            if (res_data_json.retCode == 1) { 
                              this.setState({
                                    editable:true
                                })
                             } else {
                                //let tips = "错误提示";
                                let showContent = res_data_json.retMsg;
                                //PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                                this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
                        }
                        });
                        this.daojishi(60);
                    }
                },
            ])
           
        }     
        
    }
    //倒计时验证码，默认为60秒

    daojishi(m) {
        if (m > 0) {
           this.timer= setTimeout(() => {
                m = m - 1
                this.setState({ 
                    m: m ,
                })
            }, 1000)
        }
    }
    componentWillUnmount(){
        this.timer && clearTimeout(this.timer)
    }
    agreement (){
        // icon-ok
        if(this.state.iconString==='circle-o'){
            this.setState({iconString:'check-circle',iconColor:'#ed5565',onChecked:true})
        }
        if(this.state.iconString==='check-circle'){
            this.setState({iconString:'circle-o',iconColor:'#dddddd',onChecked:false})
        }
    }
    _onblur(){
        dismissKeyboard();  //隐藏键盘     
        let firstPswd = Md5_Encrypt(this.form.pswd).toString();//进行MD5加密
        let secondPswd = Md5_Encrypt(this.form.pswdConfirm).toString();//进行MD5加密
        if(firstPswd != secondPswd){
            let showContent = "两次输入密码不一致!";
            this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
        }
    }
    _onsubmit= ()=>{
        dismissKeyboard();  //隐藏键盘      
        let tenantNo = COMMON_CONFIG.tenantNo;
        let verifyCode = this.state.verifyCode;
        let firstPswd = Md5_Encrypt(this.form.pswd).toString();//进行MD5加密
        let secondPswd = Md5_Encrypt(this.form.pswdConfirm).toString();//进行MD5加密
        let cusType = this.state.cusType;
        let certNo = this.state.certNo;
        let creditCode = this.state.creditCode;
        let verifyCertNo = this.state.verifyCertNo;
        let verifyCreditCode = this.state.verifyCreditCode;
        let channel =  COMMON_CONFIG.channel;
        
        if(cusType == 1 && verifyCertNo == false){
            let showContent = "输入的身份证号不合法.";
            this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
        }else if(cusType == 2 && verifyCreditCode == false){
            //let tips = "错误提示";
            let showContent = "输入的社会统一信用代码不合法.";
            this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
        }else if(firstPswd != secondPswd){
            let showContent = "两次输入密码不一致!";
            this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
        
        }else if(verifyCode == ''){
            let showContent = "请输入验证码!";
            this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
        }else if(this.state.onChecked != true){
            let showContent = "请勾选已阅读!";
            this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
        }else if(this.state.verified != true){
            let showContent = "验证码不正确!";
            this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
        }else{
            let jsonbject1 = {tenantNo:tenantNo,cusType:cusType,creditCode:creditCode,certNo:certNo,pswd:secondPswd,};
            //将json对象合并成一个对象
            let jsonbject2 = this.form;
            let resultJsonObject={};
            for(var attr in jsonbject2){
            resultJsonObject[attr]=jsonbject2[attr];
            }
            for(var attr in jsonbject1){
            resultJsonObject[attr]=jsonbject1[attr];
            }
           
            
            this.get_loading().show(); // 显示loading界面
            ApolloAPI.APIRegister.reg({
                ...resultJsonObject,
                checkCode:this.state.checkCode,
                channel:channel
            }).done((res_json, res) => {
                if(res_json.retCode == 1){
                //步骤1 注册成功后自动登录
                    ApolloAPI.APILogin.signIn(
                        {
                            tenantNo : COMMON_CONFIG.tenantNo,
                            phoneNo : this.form.loginNo,
                            pswd : secondPswd,
                        }
                        ).done(async (res_data, res) => {
                            
                            if(res_data.retCode == 1){   
                                //步骤2 登录后改变我的界面，首页，更多添加退出按钮
                                await AsyncStorage.setItem(STORAGE_KEYS.SIGN_TOKEN, JSON.stringify(res_data));
                                //登录成功后更改我的界面
                                RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.DIDLOGINSUCCESS, 'login'); 
                                //步骤3 登录成功后进行绑定银行卡  同时进行实名认证
                                this.refs.toast.show("注册成功！",DURATION.LENGTH_SHORT);
                                this.get_loading().dismiss();
                                this.props.navigator.push({id:"TradePasswordSetup"})
                            }else{
                                    this.get_loading().dismiss();
                                    let showContent = res_data.retMsg;
                                    this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
                                 }
                        })
            
                }else{
                    this.get_loading().dismiss();
                    let showContent = res_json.retMsg;
                    this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
                
                }
            })
        }
    }

   get_loading() {
        return this.refs['loading']
   }
   //验证身份证号
   on_change_vfCertNo(text){
       this.setState({certNo:text})
       if(text.length == 18){
            let result= /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(text);
            if(result == false){
                dismissKeyboard();  //隐藏键盘
                //let tips = "错误提示";
                let showContent = "输入的身份证号不合法.";
                //PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
            }else{
                this.setState({verifyCertNo:true})
            }
       }
   }
   //验证社会号
   on_change_vfCreditNo(text){
       this.setState({creditCode:text})
       if(text.length == 18){
            let result= /^[0-9A-Z]{18}$/.test(text);
            if(result == false){
                dismissKeyboard();  //隐藏键盘
                //let tips = "错误提示";
                let showContent = "输入的社会统一信用代码不合法.";
                //PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
            }else{
                this.setState({verifyCreditCode:true})
            }
       }
   }
   //验证验证码
   on_change_vfCode = (text) => {
        let phoneNo= this.form.loginNo;
        this.setState({ verifyCode:text});      
        if(text.length == 6){
              this.get_loading().show();
              ApolloAPI.APIRegister.validateVarCode({
                        phoneNo: phoneNo,
                       // flag:3,
                        varCode: text,
                    }).done((res_data_json, res) => {
                        this.get_loading().dismiss();
                        if (res_data_json.retCode == 0) {
                            //let tips = "错误提示";
                            dismissKeyboard();  //隐藏键盘
                            let showContent = res_data_json.retMsg;
                            //PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                            this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
                        }else{
                            //let tips = "正确提示";
                            let showContent = res_data_json.retMsg;
                            //PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                            this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
                            this.setState({
                                verified:true,
                                haveVfcode:true,
                                checkCode:res_data_json.map.checkCode
                            })
                        }
                    });
        }
    }

    packerOnchange(index,value){
        let idx = parseInt(index)+1;
        this.setState({
            cusType: idx,
            cusName:idx==1?'真实姓名':'企业全称'
        })
    }
   
    render() {
        let d;
        let t;
        let varCodeTextStyle;
        if (this.state.m == 0) {
            d = false;
            t = '获取验证码';
            varCodeTextStyle = { color: '#ffffff', fontSize: 14, marginHorizontal: 8 };
        } else {
            d = true;
            t = this.state.m + '秒后重发验证码';
            varCodeTextStyle = { color: '#cccccc', fontSize: 14, justifyContent: 'center' };
            this.daojishi(this.state.m);
        }

        return (
            <View style={styles.root}>
                <BackNavBar component={this}>注册</BackNavBar>
                <ScrollView showsVerticalScrollIndicator={false}>
                <FormProvider form={this.form}>
                    <View>
                        <Logintxtin name="nickName" ImageLeft={require('apollo/src/image/account_number.png')} placeholder='昵称' />
                        <Logintxtin name="loginNo" ImageLeft={require('apollo/src/image/phone.png')} placeholder='请输入您的手机号' />
                        <Logintxtin name="pswd" secureTextEntry={this.state.secureTextEntry1} ImageLeft={require('apollo/src/image/lock.png')} placeholder='请输入密码' onPress={()=>this.setState({secureTextEntry1:!this.state.secureTextEntry1})} showPswd={true}/>
                        <Logintxtin name="pswdConfirm" secureTextEntry={this.state.secureTextEntry2} ImageLeft={require('apollo/src/image/lock.png')} placeholder='请再次输入密码' onPress={()=>this.setState({secureTextEntry2:!this.state.secureTextEntry2})}  onBlur={()=>this._onblur()} showPswd={true}/>
                        <View style={{flexDirection:'row',height:44,borderWidth:1,borderColor:'#e5e5e5',marginTop:10,marginHorizontal: 20,paddingHorizontal: 12,}}>
                            <View style={{flex:1.3,justifyContent:'center'}}>
                                <Text style={{fontSize:16,color:'#a19d9e',}}>客户类型:</Text>
                            </View>
                            <View style={{ flex: 2.65, justifyContent:'center',}}>
                                <ModalDropdown 
                                    textStyle={{
                                        fontSize:14,
                                        color:'#757575',
                                        textAlign:'center',
                                        alignSelf:'center',
                                        }}
                                    dropdownStyle={[{ width:0.53 * full_width,backgroundColor:'#fff',alignItems:'center'}]}
                                    options={DEMO_OPTIONS} 
                                    defaultValue="个人"
                                    defaultIndex={1}
                                    onSelect={(idx, value) => this.packerOnchange(idx, value)}
                                    />
                              
                            </View>
                        </View>
                        {
                            this.state.cusType == 1 ?
                            <View style={styles.input_box}>
                                <View style={{ justifyContent: 'center', marginHorizontal: 8 }}>
                                    <Image source={require('apollo/src/image/identifying_code.png')} />
                                </View>
                                <View style={{ flex: 1,justifyContent: 'center', }}>
                                    <TextInput
                                        style={{height:45}}
                                        onChangeText={(text)=>this.on_change_vfCertNo(text)}
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        placeholder='请填写身份证号'
                                        maxLength={18}
                                        value={this.state.certNo}
                                    />
                                </View>
                            </View>
                            :
                             <View style={styles.input_box}>
                                <View style={{ justifyContent: 'center', marginHorizontal: 8 }}>
                                    <Image source={require('apollo/src/image/identifying_code.png')} />
                                </View>
                                <View style={{ flex: 1,justifyContent: 'center', }}>
                                    <TextInput
                                        style={{height:45}}
                                        onChangeText={(text)=>this.on_change_vfCreditNo(text)}
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        placeholder='请填写社会统一信用代码'
                                        maxLength={18}
                                        value={this.state.creditCode}
                                    />
                                </View>
                             </View>
                        }
                        
                        <Logintxtin name="cusName" ImageLeft={require('apollo/src/image/account_number.png')} placeholder={this.state.cusName||'真实姓名'} />
                        <Logintxtin name="inviteCode" ImageLeft={require('apollo/src/image/identifying_code.png')} placeholder={'请输入邀请码'} />
                        <View style={styles.input_box}>
                            <View style={{ justifyContent: 'center', marginHorizontal: 8 }}>
                                <Image source={require('apollo/src/image/identifying_code.png')} />
                            </View>
                            <View style={{ flex: 1,justifyContent: 'center', }}>
                                <TextInput
                                    style={{height:45}}
                                   // editable={this.state.editable}
                                    onChangeText={this.on_change_vfCode.bind(this)}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    placeholder='请输入验证码'
                                    keyboardType='numeric'
                                    value={this.state.verifyCode}
                                />
                            </View>
                            <View style={{ flex: 0.8, backgroundColor: d == true ? "#a19d9e" : "#ed5565", justifyContent: "center",alignItems:'center', borderRadius: 4, height: 32,marginRight:10 }}>
                                <TouchableOpacity disabled={d} onPress={this.on_pushone.bind(this)}>
                                    <Text style={varCodeTextStyle}>{t}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ paddingTop: 26, paddingHorizontal: 30,flexDirection:'row' ,justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity style={{ height:25,width:25 }} onPress={()=>{this.agreement()}} disabled={this.state.disabled}>
                                <Icon name={this.state.iconString} size={20} color={this.state.iconColor}/>
                            </TouchableOpacity>
                            <Text style={{marginLeft:6}} >同意</Text>
                            <TouchableOpacity onPress={()=>this.props.navigator.push({id: 'Agreement',params:{protocoltitle:this.state.protocoltitle,protocolcontent:this.state.protocolcontent}})}>
                                <Text style={{ color: '#ed5565', }}>《{this.state.protocoltitle}》</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.btnContainer}>
                            <Submit onChecked={this.state.onChecked} haveVfcode={this.state.haveVfcode} containerStyle={[styles.btn]} textStyle={[styles.textBtn]} onSubmit={this._onsubmit}>注 册</Submit>                          
                        </View>
                    </View>
                </FormProvider>
                <View style={styles.sign_box}>
                    <Image source={require('apollo/src/image/safe_bank02.png')} style={{ justifyContent: 'center', marginVertical: 3, marginHorizontal: 6 }} />
                    <Text style={{ fontSize: 14, color: '#909090' }}>乌鲁木齐商业银行专项账号监管</Text>
                </View>
                <Loading ref={'loading'} />
            </ScrollView>
            <Toast ref="toast" position="bottom"/>
        </View>
        )
    }
}

export default Register
