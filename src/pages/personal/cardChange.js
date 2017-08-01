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
    Modal,
    ScrollView,
    TouchableHighlight,
    PixelRatio,
    Platform
} from 'react-native'
import {
    BasePage,
    BackNavBar,
    NavigatorUtils,
    Wcardtxtin,
    MgAddCardtxt,
    FormProvider,
    Submit,
    Loading,
} from 'ApolloComponent'
import {
    EVENT_EMITTER_CONST,
    STORAGE_KEYS,
    COMMON_CONFIG,
    DEFAULT_STYLES
} from 'ApolloConstant'
import {PlateFormUtils} from 'ApolloUtils';
import ApolloAPI from 'ApolloAPI';
import {observable, toJS} from 'mobx';
import validate from 'mobx-form-validate';
import {Color} from 'ApolloConstant';
import Icon from 'react-native-vector-icons/FontAwesome'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width;
import ChinaRegionWheelPicker from '../../components/rn_city_picker/index';
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度

class addCardForm {

}
/**
 *  银行卡管理---添加银行卡
 *  zqf
 *2017-4-14
 */
class CardChange extends BasePage {
    constructor(props) {
        super(props)
        this.state = {
            regionName: '',
            regionCode: '',
            form_validate: false,
            varCode: '',
            newPhone: '',
            m: 0,
            iconString: 'circle-o',
            iconColor: '#dddddd',
            //disabled:false,
            selectedValue: '',

            //editable:false,
            //verifyCode:'',
            isPickerVisible: false,
            // Vdisabled:false,
            cardholder: '',
            IdCardNo: '',
            chooseBank: '',
            bankCardNo: '',
            ConfirmCardNo: '',
            cardPwd: '',
            telno: '',
            verifyCode: '',
            verified: false,
            onChecked: false,
            haveVfcode: false,
            editable: false,
            acctno:'', //卡号
            bankname:'', //开户行名字
            bankcode:'',//开户行行号
            branchname:'',//联行
            interbankno: ''//联行号

        }
    }

    componentWillMount() {
        this.request_api();
    }

   async  request_api() {
       
     

        let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
        let hash = JSON.parse(value);
        console.log(hash);
        if (!!hash) {
            this.get_loading().show();
            ApolloAPI.APIPersonal.getPerInfo({
                //通过参数获取个人信息
                telno: hash.retMsg
            }).done((res_json, res) => {
                if (res_json.retCode === 1) {
                    this.setState({
                        cusname: res_json.cusname,
                        telno: res_json.loginno,
                        certno: res_json.certno,
                    })
                    //获取协议内容
                    ApolloAPI.APIBorrow.sendProtocolData({
                    tenantNo:COMMON_CONFIG.tenantNo,
                    proType:4,
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
                            PlateFormUtils.plateFormAlert(Platform,"错误提示",res_json.retMsg);
                        }
                    })
                    
                } else {
                    this.get_loading().dismiss();
                    PlateFormUtils.plateFormAlert(Platform, '错误提示', "个人信息未获得!");
                }
            })
        }

    }
    
    //银行信息
    getBankCode(text){
        if(text.length>15 && text.length<20){
            ApolloAPI.APIcard.getBankCode({
             acctno: text
            }).done((res_json, res) => {
                if (res_json.retCode === 1) {
                    this.setState({
                        bankname:res_json.map.bankname,
                        bankcode:res_json.map.bankcode
                    })
                } else {
                    PlateFormUtils.plateFormAlert(Platform, '错误提示', res_json.retMsg);
                }
            })
        }
       this.setState({
                        acctno: text
                    })
    }
    on_change_vfCode = (text) => {
        let phoneNo = this.state.telno;
        this.setState({verifyCode: text});
        if (text.length == 6) {
            ApolloAPI.APIcard.cardValidateVarCode({
                phoneNo: phoneNo,
                // flag:3,
                varCode: text,
            }).done((res_data_json, res) => {
                if (res_data_json.retCode == 0) {
                    let tips = "错误提示";
                    let showContent = res_data_json.retMsg;
                    PlateFormUtils.plateFormAlert(Platform, tips, showContent);
                } else {
                    this.setState({
                        verified: true,
                        haveVfcode: true,
                    })
                }
            });
        }

    }
    
    acctOpen(){
        if(this.state.bankcode == "" || this.state.bankcode ==null){
            let tips = "错误提示";
            let showContent = "请先选择开户行！";
            PlateFormUtils.plateFormAlert(Platform, tips, showContent);
        }else if(this.state.cityCode == "" || this.state.cityCode ==null){
            let tips = "错误提示";
            let showContent = "请先选择区域！";
            PlateFormUtils.plateFormAlert(Platform, tips, showContent);
        }else{
            this.props.navigator.push({id: "AccountOpen",params: {accountBank:this}})
        }
    }
    _onsubmit = async () => {
            let telno = this.state.telno;//银行卡号---
            let acctno = this.state.acctno; //卡号
            let openbank = this.state.bankname; //开户行名字
            let bankcode=this.state.bankcode;//开户行行号
            let openbranch = this.state.branchname;//联行
            let interbankno = this.state.interbankno;//联行号

            this.get_loading().show();

            if (this.state.onChecked == false) {
                this.get_loading().dismiss();
                let tips = "错误提示";
                let showContent = "请阅读协议并勾选!";
                PlateFormUtils.plateFormAlert(Platform, tips, showContent);
            }else if (telno == "" || telno==null) {
                this.get_loading().dismiss();
                let tips = "错误提示";
                let showContent = "请输入手机号!";
                PlateFormUtils.plateFormAlert(Platform, tips, showContent);
            }else if (acctno == "" || acctno == null) {
                this.get_loading().dismiss();
                let tips = "错误提示";
                let showContent = "请填写银行卡卡号!";
                PlateFormUtils.plateFormAlert(Platform, tips, showContent);
            }else if (openbank == false || openbank==null) {
                this.get_loading().dismiss();
                let tips = "错误提示";
                let showContent = "请选择开户行!";
                PlateFormUtils.plateFormAlert(Platform, tips, showContent);
            }else if (openbranch == false || openbranch ==null) {
                this.get_loading().dismiss();
                let tips = "错误提示";
                let showContent = "请选择网点!";
                PlateFormUtils.plateFormAlert(Platform, tips, showContent);
            }else {
                ApolloAPI.APIcard.changeCard({//银行卡管理，添加银行卡=提现和充值添加银行卡
                     oldacctno:this.props.acctno,//原卡号
                     telno :this.state.telno,//手机号---
                     acctno :this.state.acctno,//卡号
                     openbank : this.state.bankname,//开户行名字
                     openbranch : this.state.branchname,//联行
                     bankcode:this.state.bankcode,
                     interbankno : this.state.interbankno,//联行号
                     businessSeqNo:this.props.businessSeqNo //流水号
                }).done((res_json, res) => {
                    this.get_loading().dismiss();
                    if (res_json.retCode == 1) {
                        RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.CARDCHANGESUCCESS, 'cardBandSuccess'); 
                        PlateFormUtils.plateFormAlert(Platform, '提示', '变更成功!');
                        this.props.navigator.popN(2);

                        //提交成功，把界面pop出去
                    } else {
                        let tips = "错误提示";
                        let showContent = res_json.retMsg;
                        PlateFormUtils.plateFormAlert(Platform, tips, showContent);
                    }
                })
            }
    }

    get_loading() {
        return this.refs.loading;
    }

    agreement() {
        // icon-ok
        if (this.state.iconString === 'circle-o') {
            this.setState({iconString: 'check-circle', iconColor: '#ed5565', onChecked: true})
        }
        if (this.state.iconString === 'check-circle') {
            this.setState({iconString: 'circle-o', iconColor: '#dddddd', onChecked: false})
        }
    }
    checkPhone(strPhone) {
        // const phoneRegNoArea = /^1(3|4|5|7|8)\d{9}$/;
        // const prompt = "您输入的电话号码不正确!"
        // if (strPhone.length = 11) {
        //     if (phoneRegNoArea.test(strPhone)) {
        //         return true;
        //     } else {
        //         let tips = "错误提示";
        //         let showContent = prompt;
        //         PlateFormUtils.plateFormAlert(Platform, tips, showContent);
        //         return false;
        //     }
            
        // } 
        this.setState({telno:strPhone})
    }
    //new一个form表单
    form = new addCardForm();

    render() {
        return (
            <View style={styles.root}>
                <BackNavBar style={{backgroundColor: '#ed5565'}} component={this}>变更银行卡</BackNavBar>
                <ScrollView style={styles.excelContainer} showsVerticalScrollIndicator={false}>
                    <FormProvider form={this.form}>
                        <View>
                            <MgAddCardtxt name='cusname' value={this.state.cusname} bBWidthdraw={1} flexdraw={1.3} colorTex='#101010' editable={false} disabled={true}>客户名称</MgAddCardtxt>
                            <View  style={{justifyContent:'center', borderBottomColor:'#e5e5e5',borderBottomWidth:1,flexDirection:'row',flex:1,borderColor:'#e5e5e5',height:44}}>
                                <View style={{ justifyContent: 'center', marginLeft:12,flex:1.08}}>
                                <Text style={{fontSize:16,color:'#101010'}}>手机号:</Text>
                                </View>
                                <View style={{ flex: 3, justifyContent:'center',}}>
                                    <TextInput
                                    style={{justifyContent:'center',alignItems:'center',fontSize:16,height:44,color:'#000000'}}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    keyboardType="numeric"
                                    placeholder='与银行卡预留手机号一致'
                                    underlineColorAndroid='transparent'
                                    maxLength={11}
                                    editable={true}
                                    value={this.state.telno}
                                    onChangeText={(text)=> this.checkPhone(text)}
                                    ></TextInput>
                                </View>
                            </View>
                            <MgAddCardtxt name="certno" value={this.state.certno} bBWidthdraw={1} flexdraw={1.3} colorTex='#101010' editable={false} disabled={true}>证件号码</MgAddCardtxt>
                            <View  style={{justifyContent:'center', borderBottomColor:'#e5e5e5',borderBottomWidth:1,flexDirection:'row',flex:1,borderColor:'#e5e5e5',height:44}}>
                                <View style={{ justifyContent: 'center', marginLeft:12,flex:1.08}}>
                                    <Text style={{fontSize:16,color:'#101010'}}>卡号:</Text>
                                </View>
                                <View style={{ flex: 3, justifyContent:'center',}}>
                                    <TextInput
                                    style={{justifyContent:'center',alignItems:'center',fontSize:16,height:44,color:'#000000'}}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    keyboardType="numeric"
                                    placeholder='请输入银行卡号'
                                    maxLength={19}
                                    underlineColorAndroid='transparent'
                                    editable={true}
                                    value={this.state.acctno}
                                    onChangeText={(text)=>this.getBankCode(text)}
                                    ></TextInput>
                                </View>
                            </View>
                            <MgAddCardtxt name="bankname" value={this.state.bankname!=null?this.state.bankname:null||this.state.bankname} _rightButtonClick={() => this.props.navigator.push({id: "OpenBank",params: {openbank:this}})} ImageRight={require('apollo/src/image/arrow_right.png')} keyboardType="numeric" bBWidthdraw={1} flexdraw={1.3} colorTex='#101010' editable={false}>开户行</MgAddCardtxt>
                          
                            <View
                                style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e5e5e5',}}>

                                <View style={{justifyContent: 'center', marginLeft: 12, flex: 1.1}}>
                                    <Text style={{fontSize: 16, color: '#101010'}}>区域:</Text>
                                </View>
                                <View style={{flex: 3, justifyContent: 'center',}}>
                                    <ChinaRegionWheelPicker

                                        transparent
                                        animationType={'fade'}
                                        navBtnColor={'#ED5565'}
                                        selectedProvince={'新疆维吾尔族自治区'}
                                        selectedCity={'乌鲁木齐市'}
                                        selectedArea={'乌鲁木齐市'}
                                        selectedAreaCode={"881000"}
                                        dataPicker={"bindCard"}
                                        onSubmit={(params) =>
                                            this.setState({
                                                regionName: `${params.provinceName},${params.cityName},${params.areaName}`,
                                                cityCode: `${params.areaCode}`
                                            })}
                                        onCancel={() => console.log('cancel')}
                                    >

                                        <TextInput
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                fontSize: 16,
                                                height: 44,
                                                color: '#000000'
                                            }}
                                            editable={false}
                                            placeholder="点击选择地区"
                                            value={this.state.regionName}
                                            underlineColorAndroid='rgba(0,0,0,0)'
                                        />
                                    </ChinaRegionWheelPicker>
                                </View>
                            </View>

                            <MgAddCardtxt name='dot' ImageRight={require('apollo/src/image/arrow_right.png')}
                                          _rightButtonClick={() => this.acctOpen()} 
                                          placeholder='请点击选择网点'
                                          value={this.state.branchname!=null?this.state.branchname:null||this.state.branchname} 
                                          keyboardType="numeric" bBWidthdraw={1} flexdraw={1.3} colorTex='#101010'
                                          editable={false}>开户网点</MgAddCardtxt>
                            
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
                                <Submit onChecked={this.state.onChecked} haveVfcode={true} containerStyle={[styles.btn]} textStyle={[styles.textBtn]} onSubmit={this._onsubmit}>变 更</Submit>                          
                            </View>
                            <View style={{justifyContent: 'flex-start', alignItems: 'flex-end', marginTop: 10}}>
                                <Text style={{fontSize: 12, color: '#4b73ca', marginRight: 12}}>支持的银行卡及限额</Text>
                            </View>
                        </View>
                    </FormProvider>
                    <View style={styles.downView}>
                        <View style={{flexDirection:'row',marginTop:24,alignItems:'center',marginLeft:5,marginRight:5}}>
                            <Image style={{height:12,width:12,}} source={require('apollo/src/image/prompt.png')}/>
                            <Text style={{marginLeft:4,fontSize:12,color:'#4d4d4d'}}>手机号，户名，银行卡卡号，证件号码必须与银行开户时一致。</Text>
                        </View>
                    </View>
                </ScrollView>
                <Loading ref="loading"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#ffffff',//页面的布局和颜色
        flex: 1,
    },
    verification: {
        height: 48,
        width: full_width,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1

    },
    input_box: {
        // height: full_height/2.5,
        height: full_height / 5,
        backgroundColor: '#ffffff',
    },
    nextStyle: {
        height: 44,
        marginHorizontal: 12,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: '#ed5565',
        borderRadius: 8,
        marginTop: 30,
        overflow: 'hidden'
    },
//   disabled:{
//       height:44, 
//       marginHorizontal:12,
//       justifyContent: "center",
//       alignItems:'center',
//       backgroundColor:'#a19d9e', 
//      // backgroundColor:'#ed5565', 
//       borderRadius: 8,
//       marginTop:30,
//       overflow:'hidden'
//   },
    btnContainer: {
        height: 44,
        marginHorizontal: 12,
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 30
    },
    btn: {
        width: 0.8 * full_width,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#ed5565',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    textBtn: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    regionContainer: {
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 6,
    },
    fontLabel: {
        flex: 1,
        fontSize: 14,
        color: '#757575',
    },
    isFill: {
        color: 'red',
    },
    downView:{
        marginTop:6,
        backgroundColor:'#ffffff',
    },
});

export default CardChange
