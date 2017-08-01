
/**
 * zgx
 * 
                <View style={{height: 46,flexDirection: 'row', alignItems:'center', borderColor: '#e5e5e5',borderBottomWidth:1, backgroundColor: '#ffffff'}}>
                    <View style={{justifyContent: "center", marginLeft: 10}}>
                        <Image source={require('apollo/src/image/login_password.png')} style={{ width:25,height:25}}/>
                    </View>

                    <View style={{marginLeft:5,alignItems:'center',flexDirection:'row',flex: 2}}>
                        <Text style={{fontSize: 16, color: '#808080'}}>开启自动投资</Text>
                    </View>

                    <View style={{flex: 0.4, justifyContent: "center",}}>
                        <Switch disabled={!this.state.ifNoPswd} value={this.state.ifAutoInv} onValueChange={()=>this.saveAutoInv()}></Switch>
                    </View>
                </View>

                 <Text style={{fontSize:12,color:'#4d4d4d'}}>开启自动投资后，系统将根据您设置的最小投资金额和最大投资金额按照一定规则进行投资适合您的项目。</Text>
 */

import React, { Component } from 'react';
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
Platform,
ScrollView,
Switch,
AsyncStorage,
TextInput
} from 'react-native';

import {
PushLogin,
BasePage,
BackNavBar,
Loading,
Moretxtin,
} from 'ApolloComponent';
import { PlateFormUtils } from 'ApolloUtils';
import { Color,EVENT_EMITTER_CONST,COMMON_CONFIG,STORAGE_KEYS} from 'ApolloConstant';
import { NavBar } from 'ApolloComponent';
import SwiperNative from 'react-native-swiper';
import ApolloAPI from 'ApolloAPI';
import Modal from 'react-native-root-modal';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Icon from 'react-native-vector-icons/FontAwesome';

const onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
const full_width = Dimensions.get('window').width;
const full_height = Dimensions.get('window').height;

class NoPswdPay extends BasePage {
    constructor(props){
        super(props);
        this.state = {
            ifNoPswd:false,
            ifAutoInv:false,
            modalVisible:false,
            minDisabled:true,
            maxDisabled:true,
            autoinvsummin:'',
            autoinvsummax:'',
        };
    }
    //保存
    async saveNoPswd(){
        // this.setState({
        //     ifNoPswd:!this.state.ifNoPswd,
        // })
       // this.get_loading().show();
        //是否设置了交易密码
        let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
        let hash = JSON.parse(value);
        if(!!hash && hash.retCode == 1 && hash.retMsg){
            ApolloAPI.APIPersonal.haveTradePassword({
            telno:hash.retMsg
            }).done((res_json, res) => {
                if(res_json.retCode == 1&&res_json.settranpswdflag=='0'){
                    // this.get_loading().dismiss();
                    //没有设置交易密码
                    PlateFormUtils.plateFormAlert(Platform,'提示','请先设置交易密码！');
                }else if(res_json.retCode == 1&&res_json.settranpswdflag=='1'){
                    if(this.state.ifNoPswd == true){
                        busiType='B04';//签协议
                    }else{
                        busiType='B05';//撤销协议
                        //撤销免密协议时，设置自动投资为false
                        const { perInfo } = this.props;
                        if(perInfo){
                            //修改的信息
                            perInfo.autoinvflag = 0;
                            perInfo.nopswdflag = 0;
                            //发送修改的信息
                            ApolloAPI.APIPersonal.savePerInfo( perInfo ).done((res_json, res)=>{
                            // this.get_loading().dismiss();
                            if(res_json.retCode === 1){
                                //保存信息
                                this.setState({
                                    ifAutoInv:false
                                });
                                RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.AUTOINVESTSUCCESS, 'autoInvestSuccess'); 
                            }else{
                                PlateFormUtils.plateFormAlert(Platform,'错误提示',"保存失败!");
                            }
                            })
                        }
                    }

                    //设置过交易密码跳转验证密码   暂不需要验密
                    PushLogin.push_login_destination('TradePasswordValidate', this.props.navigator,{from:'noPswdPay',ifNoPswd:!this.state.ifNoPswd,telno:hash.retMsg});
                }else{
                    //this.get_loading().dismiss();
                    PlateFormUtils.plateFormAlert(Platform,"提示",res_json.retMsg);
                }
            })
        }
    }
    //设置自动投资
    saveAutoInv(){
        let ifAutoInv=!this.state.ifAutoInv;
        if(ifAutoInv == true){
            //设置成功，打开model
            this.setState({
                modalVisible:true,
                ifAutoInv:ifAutoInv
            })
        }else{
           // this.get_loading().show();
            ApolloAPI.APILogin.getloginState({
                tenantNo:COMMON_CONFIG.tenantNo
                }).done((res_json, res) => {
                        if(res_json.retCode == 1){
                        //登录后请求数据
                        const { perInfo } = this.props;
                            if(!!perInfo){
                                //修改的信息
                                perInfo.autoinvflag = 0;
                                //发送修改的信息
                                ApolloAPI.APIPersonal.savePerInfo( perInfo ).done((res_json, res)=>{
                                //this.get_loading().dismiss();
                                if(res_json.retCode === 1){
                                    //保存信息
                                    this.setState({
                                        modalVisible:false,
                                        ifAutoInv:ifAutoInv,
                                    });
                                    PlateFormUtils.plateFormAlert(Platform,'成功提示',"保存成功!");
                                    RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.AUTOINVESTSUCCESS, 'autoInvestSuccess'); 
                                }else{
                                    this.setState({
                                        modalVisible:false,
                                        ifAutoInv:ifAutoInv,
                                    });
                                    PlateFormUtils.plateFormAlert(Platform,'错误提示',"保存失败!");
                                }
                                })
                            }
                        }else{
                        //跳转登录页面
                        PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
                        this.props.navigator.push({
                            id:'Login',params:{}
                        });
                    }
            })
        }
    }
    //确认开启自动投资
    comfirmInv(){
        if(parseFloat(this.state.autoinvsummin) > parseFloat(this.state.autoinvsummax)){
            PlateFormUtils.plateFormAlert(Platform,"错误提示","最小金额不能大于最大金额!");
        }else{
            //保存状态
            //this.get_loading().show();
            ApolloAPI.APILogin.getloginState({
                tenantNo:COMMON_CONFIG.tenantNo
                }).done((res_json, res) => {
                        if(res_json.retCode == 1){
                        //登录后请求数据
                        const { perInfo } = this.props;
                            if(perInfo){
                                //修改的信息
                                perInfo.autoinvflag = 1;
                                perInfo.autoinvsummin = this.state.autoinvsummin;
                                perInfo.autoinvsummax = this.state.autoinvsummax;
                                //发送修改的信息
                                ApolloAPI.APIPersonal.savePerInfo( perInfo ).done((res_json, res)=>{
                                //this.get_loading().dismiss();
                                if(res_json.retCode === 1){
                                    //保存信息
                                    this.setState({
                                        modalVisible:false,
                                    });
                                    PlateFormUtils.plateFormAlert(Platform,'成功提示',"保存成功!");
                                    RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.AUTOINVESTSUCCESS, 'autoInvestSuccess'); 
                                }else{
                                    this.setState({
                                        modalVisible:false,
                                    })
                                    PlateFormUtils.plateFormAlert(Platform,'错误提示',"保存失败!");
                                }
                                })
                            }
                        }else{
                        //跳转登录页面
                        PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
                        this.props.navigator.push({
                            id:'Login',params:{}
                        });
                    }
            })
        }
    }
    //查看是否签署免密协议
    request_api(){
            const { perInfo } = this.props;
            if(perInfo){
                if(perInfo.nopswdflag == '1'){
                    this.setState({
                        ifNoPswd:true,
                    })
                }else{
                    this.setState({
                        ifNoPswd:false,
                    })
                }
                if(perInfo.autoinvflag == '1'){
                    this.setState({
                        ifAutoInv:true,
                        autoinvsummin:perInfo.autoinvsummin,
                        autoinvsummax:perInfo.autoinvsummax,
                       
                    })
                }else{
                    this.setState({
                        ifAutoInv:false,
                        autoinvsummin:perInfo.autoinvsummin,
                        autoinvsummax:perInfo.autoinvsummax
                    })
                }
                if(perInfo.autoinvsummin >0 && perInfo.autoinvsummax > 0){
                     this.setState({
                        minDisabled:false,
                        maxDisabled:false,
                     })
                }            
            }
    }
    componentDidMount(){
        this.request_api();
    }
    componentWillUnmount(){
        this.setState({
            ifNoPswd:false,
            ifAutoInv:false,
        })
    }
    get_loading() {
        return this.refs.loading;
    }

    checkInvMin(text){
        this.setState({
                autoinvsummin:text,
                minDisabled:false
            });
        let result = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,13}\.\d{0,2}$|^[1-9]\d{0,30}$/.test(text);
        if(result ==false){
            this.setState({
                autoinvsummin:'',
                minDisabled:true
            });
        }
    }
    checkInvMax(text){
        this.setState({
            autoinvsummax:text,
            maxDisabled:false
        });
        let result = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,13}\.\d{0,2}$|^[1-9]\d{0,30}$/.test(text);
        if(result ==false){
            this.setState({
                autoinvsummax:'',
                maxDisabled:true,
            });
        }
    }
    render() {
        return (
            <View style={styles.container}>
            <Modal   
            style={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)'}}
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalVisible}>
            <View style={styles.modalView}>
            <TouchableOpacity style={{alignSelf:'flex-end',marginRight:10,marginTop:5}} onPress={() => this.setState({modalVisible:!this.state.modalVisible,ifAutoInv:!this.state.ifAutoInv})}>
                <Icon name='close' size={20} />
            </TouchableOpacity> 
                <View style={styles.modalTitle}>
                    <Text style= {[styles.modalText,{fontSize:20,color:'#333333',fontWeight:'bold'}]}>开启自动投资</Text>    
                </View>
                
                <View style={{marginTop:15,marginLeft:5,marginRight:5,alignItems:'center',}}>       
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:16,color:'#4d4d4d'}}>最小金额</Text>
                        <TextInput  style={styles.inputText} keyboardType='numeric'    onChangeText={(text)=>this.checkInvMin(text)} value ={this.state.autoinvsummin}
                        placeholder='请输入最小投资金额'  underlineColorAndroid='rgba(0,0,0,0)'/> 
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:16,color:'#4d4d4d'}}>最大金额</Text>
                        <TextInput  style={styles.inputText} keyboardType='numeric'    onChangeText={(text)=> this.checkInvMax(text)} value ={this.state.autoinvsummax}
                        placeholder='请输入最大投资金额'  underlineColorAndroid='rgba(0,0,0,0)'/> 
                    </View>
                </View>

                <View style={[styles.btnContainer]}>
                <TouchableOpacity 
                disabled={this.state.maxDisabled || this.state.minDisabled }
                onPress={() => this.comfirmInv()}
                style={[styles.btn,(this.state.maxDisabled || this.state.minDisabled) && styles.disabled]} >
                    <Text style={[styles.textBtn]}>
                    立即开启
                    </Text>
                </TouchableOpacity>
            </View>
            
            </View>
        </Modal>
      
            <BackNavBar  style={{backgroundColor:'#ed5565'}}  component={this}>免密支付设置</BackNavBar>
                <View style={{height: 46,flexDirection: 'row', alignItems:'center', borderColor: '#e5e5e5',borderBottomWidth:1, backgroundColor: '#ffffff'}}>
                    <View style={{justifyContent: "center", marginLeft: 10}}>
                        <Image source={require('apollo/src/image/login_password.png')} style={{ width:25,height:25}}/>
                    </View>

                    <View style={{marginLeft:5,alignItems:'center',flexDirection:'row',flex: 2}}>
                        <Text style={{fontSize: 16, color: '#808080'}}>开启免密支付</Text>
                    </View>

                    <View style={{flex: 0.4, justifyContent: "center",}}>
                        <Switch value={this.state.ifNoPswd} onValueChange={()=>this.saveNoPswd()}></Switch>
                    </View>
                </View>
                <View style={styles.downView}>
                    <View style={{flexDirection:'row',marginTop:24,marginLeft:10,marginRight:10}}>
                        <View style={{alignItems:'center'}}>
                            <Image style={{height:12,width:12,}} source={require('apollo/src/image/prompt.png')}/>
                        </View>
                        <View style={{alignItems:'center',marginLeft:3,marginRight:10}}>
                            <Text style={{fontSize:12,color:'#4d4d4d'}}>开启免密支付后，除了充值，提现和设置开启关闭免密支付功能（本功能）外，其他交易不需要资金交易密码。</Text>
                           
                        </View>
                    </View>
                </View>
            <Loading ref="loading" />       
        </View>
        );
    }
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    input_box:{
        borderColor:'#e5e5e5',
        backgroundColor:'#ffffff',
        marginBottom:10,
        
    },
    downView:{
        marginTop:15,
        backgroundColor:'#ffffff',
        height:full_height*0.5
    },
    modalView: {
        marginTop: 0.28 * full_height,
        marginLeft:15,
        marginRight:15,
        borderRadius:16,
        backgroundColor:'#fff',
        height:0.4 * full_height
    },
    modalTitle: {
        marginTop:15,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:20,
        marginRight:20,
    },
    modalText: {
        fontSize:16,
        color:'#4d4d4d',
        alignSelf:'center'
    },
    btn:{
        width:0.6 * full_width,
        borderRadius:8,
        marginTop:15,
        backgroundColor:'#ED5565',
        height:0.06 * full_height,
        justifyContent:'center',
        alignItems:'center',
        overflow:'hidden',
    },
    btnContainer: {
        marginHorizontal:12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row',
        marginTop: 8,
    },
    textBtn: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    inputText:{ 
        width:0.55 * full_width,
        height:0.06 * full_height,
        borderWidth:onePt,
        borderColor:'#dddddd',
        backgroundColor:'transparent',  
        fontSize:16,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:15,
        marginTop:5
    },
    disabled:{
        backgroundColor:'#cccccc'
    },
    });
    export default NoPswdPay