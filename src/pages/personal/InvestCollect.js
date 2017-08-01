
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  Platform,
  PixelRatio
} from 'react-native';
import { Color,COMMON_STYLES,COMMON_CONFIG } from 'ApolloConstant';
import {
  BasePage,
  BackNavBar,
  Pertxtin,
  InvCollect,
  FormProvider,
  Submit, 
  Loading,
} from 'ApolloComponent'
import { NavigatorUtils,PlateFormUtils } from 'ApolloUtils';
import ApolloAPI from 'ApolloAPI';
import { observable, toJS } from 'mobx';
import validate from 'mobx-form-validate';
import ModalDropdown from 'react-native-modal-dropdown';

const DEMO_OPTIONS = ['3个月', '6个月','9个月','一年以上'];
class invCollectForm {
  @observable
  @validate(/^.+$/,'此处不为空.')
  cusname = '';

  @observable
  @validate(/^1(3|4|5|7|8)\d{9}$/, '请输入正确的手机号.')
  telno = '';

  @observable
  @validate(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, '请输入正确的邮箱.')
  email = '';

  @observable
  @validate(/^((1[0-9])|([2-9]\d)|([1-9]\d{2,}))$/,'最低为100.')
  toinvsum = '';

  @observable
  @validate(/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,'此处不为空.')
  expprofit = '';


}

const full_height = Dimensions.get('window').height
const full_width = Dimensions.get('window').width;
const onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
class InvestCollect extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
          regdate:'',
          invterm:'0',
        };
      }
    form = new invCollectForm();
    
    onsubmit_1 = async () =>{
        let regdate = this.state.regdate;
        let invterm = this.state.invterm;
        let tenantno = COMMON_CONFIG.tenantNo;
        //将json对象合并成一个对象
        const jsonbject1= {regdate:regdate,invterm:invterm,tenantno:tenantno};
        const jsonbject2 = this.form;
        const resultJsonObject={};
        for(let attr in jsonbject1){
          resultJsonObject[attr]=jsonbject1[attr];
        }
        for(let attr in jsonbject2){
          resultJsonObject[attr]=jsonbject2[attr];
        }
        //await post('/login', toJS(this));
        //alert(JSON.stringify(toJS(resultJsonObject)));

        this.get_loading().show();

        if(this.state.invterm == ''){
          this.get_loading().dismiss();
          let tips = "错误提示";
          let showContent = "请选择投资期限!";
          PlateFormUtils.plateFormAlert(Platform,tips,showContent);
        }else{
             ApolloAPI.APILogin.getloginState({
                tenantNo:COMMON_CONFIG.tenantNo
              }).done((res_json, res) => {
                      if(res_json.retCode == 1){
                        //登录后请求数据
                         ApolloAPI.APIPersonal.saveInvCollect(
                            resultJsonObject
                            ).done((res_json, res) => {
                              this.get_loading().dismiss();
                              if(res_json.retCode == 1){
                                let tips = "正确提示";
                                let showContent = res_json.retMsg;
                                PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                              }else{
                                let tips = "错误提示";
                                let showContent = res_json.retMsg;
                                PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                              }
                            })
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
    get_loading() {
      return this.refs.loading;
    }
    componentWillMount(){
      let month = new Date().getMonth()+1;
      if(month.toString.length ==1){
        month= '0' + month;
      }
      let date=  new Date().getFullYear() + '-'+month+'-'+new Date().getDate();
      this.setState({
        regdate:date
      });
    }
  
    render() {
    return (
    <View style={styles.root}> 
        <BackNavBar  style={{backgroundColor:'#ed5565'}} component={this}>投资意向征集</BackNavBar>
        
          <FormProvider form={this.form}>
            <ScrollView ScrollView style={styles.input_box}  showsVerticalScrollIndicator={false}>
                <InvCollect name={"cusname"} bBWidthdraw={onePt} flexdraw={1.3} colorTex='#101010' pholderdraw='请输入联系人' editabledraw={true}>联系人:</InvCollect>
                <InvCollect name={"telno"} bBWidthdraw={onePt} flexdraw={1.3} colorTex='#101010' pholderdraw='请输入手机号' editabledraw={true}>手机号:</InvCollect>
                <InvCollect name={"email"} bBWidthdraw={onePt} flexdraw={1.3} colorTex='#101010' pholderdraw='请输入邮箱地址' editabledraw={true}>邮箱:</InvCollect>
                
                <View style={{flexDirection:'row',height:44,borderBottomWidth:1,borderBottomColor:'#e5e5e5'}}>
                    <View style={{marginLeft:12,flex:1.3,justifyContent:'center'}}>
                        <Text style={{fontSize:16,color:'#101010',}}>投资期限:</Text>
                    </View>
                    <View style={{ flex: 2.65, justifyContent:'center',}}>
                        <ModalDropdown 
                            textStyle={{
                                fontSize:14,
                                color:'#101010',
                                textAlign:'center',
                                alignSelf:'center',
                                }}
                            dropdownStyle={[{ width:0.53 * full_width,backgroundColor:'#fff',alignItems:'center'}]}
                            options={DEMO_OPTIONS} 
                            defaultValue={'请选择'}
                            defaultIndex={0}
                            onSelect={(idx, value) => this.setState({invterm: parseInt(idx)+1})}
                            />
                    </View>
                </View>

                <InvCollect name={"toinvsum"} bBWidthdraw={onePt} flexdraw={1.3} colorTex='#101010'  pholderdraw='最低100'  editabledraw={true} units='元'>可投资金额:</InvCollect>
                <InvCollect name={"expprofit"} bBWidthdraw={onePt} flexdraw={1.9} colorTex='#101010'  pholderdraw=''  editabledraw={true} units='%以上'>期望年化收益率:</InvCollect>
                <InvCollect name={"notes"} bBWidthdraw={onePt} flexdraw={1.9} colorTex='#101010'  pholderdraw=''  editabledraw={true}>其他投资需求:</InvCollect>
                <View style={styles.btnContainer}>
                      <Submit  containerStyle={[styles.btn]} textStyle={[styles.textBtn]} onSubmit={this.onsubmit_1}>提 交</Submit>
                </View>
        </ScrollView>
      </FormProvider>
    <Loading ref="loading" />
</View>  
    );
  }
}

const styles = StyleSheet.create({

  root: {
    backgroundColor: '#dddddd',//页面的布局和颜色
    flex: 1,
  },
  verification: {
        height: 44,
        width:full_width,
        flexDirection: 'row',
        borderColor: '#e5e5e5',
        backgroundColor: '#ffffff',

    },
 input_box: {
    backgroundColor: '#ffffff', 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.backgroundColor,
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
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

export default InvestCollect