import APIFetch from 'APIFetch';

//点击我的时获取相关信息
const getMycenter = (data) =>{
    let url = HOSTURL + '/login/getMyInfo';
    return APIFetch.post(url,data);
}

//点击我的信息时，获取个人信息
const getPerInfo = (data) => {
    let url = HOSTURL + '/myInfo/getInfo';
    return APIFetch.post(url,data);
    
}

//保存修改的我的信息
const savePerInfo = (data) => {
    let url = HOSTURL + '/myInfo/updInfo';
    return  APIFetch.post(url,data);
}


//点击总资产时，获取总资产的信息
const getTotalassets2 = (data) => {
    let url = HOSTURL + '/myAsset/asset_total';
    return APIFetch.post(url,data);  
}
/**
 * 我的消息
 * @param {*} data 
 */
const MyMessageList = (data) => {
    let url = HOSTURL + '/myMessage/msgList';
    return APIFetch.post(url,data);  
}

/**
 * 我的设置--修改密码
 * @param {*} data 
 */
const changePwd = (data) => {
    let url = HOSTURL + '/register/updatePswd';
    return APIFetch.post(url,data);  
}

//获取投资记录列表
const getInvRcdList = (data)=>{
    let url = HOSTURL + '/myInv/invList';
    return APIFetch.post(url,data);
}

//获取投资记录详情
const getInvRcdItem = (data)=>{
    let url = HOSTURL + '';
    return APIFetch.post(url,data);
}

//获取融资记录列表
const getFinRcdList = (data)=>{
    let url = HOSTURL + '/myFin/finList';
    return APIFetch.post(url,data);
}

//获取融资记录详情
const getFinRcdItem = (data)=>{
    let url = HOSTURL + '';
    return APIFetch.post(url,data);
}

//获取融资记录详情
const saveInvCollect = (data)=>{
    let url = HOSTURL + '/invInt/save';
    return APIFetch.post(url,data);
}

//获取风险评估模板
const getRiskTemp = (data)=>{
    let url = HOSTURL + '/myRiskRcd/riskTemp';
    return APIFetch.post(url,data);
}

//获取风险评估列表
const getRiskList = (data)=>{
    let url = HOSTURL + '/myRiskRcd/riskList';
    return APIFetch.post(url,data);
}

//取风险评估模板题目
const getRiskTempDet = (data)=>{
    let url = HOSTURL + '/myRiskRcd/riskTempDet';
    return APIFetch.post(url,data);
}


//保存风险评估模板题目
const saveRiskRcd = (data)=>{
    let url = HOSTURL + '/myRiskRcd/newRiskRcd';
    return APIFetch.post(url,data);
}

//我的风险评估详情
const getRiskDet = (data)=>{
    let url = HOSTURL + '/myRiskRcd/riskDet';
    return APIFetch.post(url,data);
}
//转让申请
const transApp = (data) =>{
    console.log(data);
    let url = HOSTURL + '/myInv/transApp';
    return APIFetch.post(url,data);
}

//验证是否设置了支付密码
const haveTradePassword = (data) =>{
    let url = HOSTURL + '/myInfo/getInfo';
    return APIFetch.post(url,data);
}

//获取融资申请记录
const getInvAppRcd = (data) =>{
    let url = HOSTURL + '/finApply/finAppProgress';
    return APIFetch.post(url,data);
}
//获取转让申请记录
const getAssignRec = (data) =>{
    let url = HOSTURL + '/myInv/transAppProgress';
    return APIFetch.post(url,data);
}

//充值记录查询
const getRechargeRec = (data) =>{
    let url = HOSTURL + '/mySup/supList';
    return APIFetch.post(url,data);
}

//提现记录查询
const getWithDrawRec = (data) =>{
    let url = HOSTURL + '/myDraw/drawList';
    return APIFetch.post(url,data);
}
//还款列表
const getFinPayPlan = (data) =>{
    let url = HOSTURL + '/myFin/getFinPayPlan';
    return APIFetch.post(url,data);
}

//单期还款
const finPay = (data) =>{
    let url = HOSTURL + '/myFin/finPay';
    return APIFetch.post(url,data);
}

//设置和修改支付密码
const updateTranPswd = (data) =>{
    let url = HOSTURL + '/register/updateTranPswd';
    return APIFetch.post(url,data);
}

//验证交易密码
const validateTranPswd = (data) =>{
    let url = HOSTURL + '/invest/validateTranPswd';
    return APIFetch.post(url,data);
}

//还款：查询支付费用类型
const getFeeType = (data) =>{
    let url = HOSTURL + '/index/getDictList';
    return APIFetch.post(url,data);
}

//还款：支付费用
const finFee = (data) =>{
    let url = HOSTURL + '/myFin/finFee';
    return APIFetch.post(url,data);
}

//还款：判断是否已申请提前结清
const getPrePayStatus = (data) =>{
    let url = HOSTURL + '/myFin/getPrePayStatus';
    return APIFetch.post(url,data);
}

//提前还款申请
const finPrePayApp = (data) =>{
    let url = HOSTURL + '/myFin/finPrePayApp';
    return APIFetch.post(url,data);
}

//提前结清还款
const finPrePay = (data) =>{
    let url = HOSTURL + '/myFin/finPrePay';
    return APIFetch.post(url,data);
}

//获取评估详情
const riskDet = (data) =>{
    let url = HOSTURL + '/myRiskRcd/riskDet';
    return APIFetch.post(url,data);
}

//我的礼包
const getMygiftList = (data) =>{
    let url = HOSTURL + '/myGift/getMygiftList';
    return APIFetch.post(url,data);
}

//获取支付费用
const sumFee = (data) =>{
    let url = HOSTURL + '/myFin/sumFee';
    return APIFetch.post(url,data);
}

//通过天数获取罚息
const payPenalty = (data) =>{
    let url = HOSTURL + '/myFin/sumPenaltyInt';
    return APIFetch.post(url,data);
}

//保存罚息
const savePenalty = (data) =>{
    let url = HOSTURL + '/myFin/payPenaltyInt';
    return APIFetch.post(url,data);
}

//免密协议
const signFreeAgreement = (data) =>{
    let url = HOSTURL + '/invest/signFreeAgreement';
    return APIFetch.post(url,data);
}

//投资/融资电子合同接口 
const getDigitalContract = (data) =>{
    let url = HOSTURL + '/finApply/cont_get';
    return APIFetch.post(url,data);
}
export default {
  getPerInfo,
  savePerInfo,
  getTotalassets2,
  MyMessageList,
  changePwd,
  getInvRcdList,
  getInvRcdItem,
  getMycenter,
  saveInvCollect,
  getRiskTemp,
  getRiskList,
  getRiskTempDet,
  saveRiskRcd,
  getRiskDet,
  getFinRcdList,
  transApp,
  haveTradePassword,
  getAssignRec,
  getInvAppRcd,
  getRechargeRec,
  getWithDrawRec,
  getFinPayPlan,
  finPay,
  updateTranPswd,
  validateTranPswd,
  getFeeType,
  finFee,
  getPrePayStatus,
  finPrePayApp,
  finPrePay,
  riskDet,
  getMygiftList,
  sumFee,
  signFreeAgreement,
  getDigitalContract,
  payPenalty,
  savePenalty,
}
