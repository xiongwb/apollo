import APIFetch from 'APIFetch';
/**
 * 1.提现
 * @param {*} user 
 * zqf
 * 2017/04/28
 */
//查询该用户是否绑定了银行卡
const getIsBindList = (data) => {
  let url = HOSTURL + '/bindCard/bindList';
  return APIFetch.post(url,data)
}
/**
 * 1.2提现----添加银行卡（绑卡）
 * @param {*} data 
 */
const addBindCard = (data) => {
  //bindCard/bind?telno=1111&acctno=sss
  let url = HOSTURL + '/bindCard/bind';
  return APIFetch.post(url,data)
}

/**
 *1.3 提现:根据手机号，查询余额（已经绑卡的状况下）
 * @param {*} data 
 */
const getMyAsset = (data) => {
  //myAsset/asset_total?telno=111
  let url = HOSTURL + '/myAsset/asset_total';
  return APIFetch.post(url,data)
}
/**
 *1.4 提现:提交（已经绑卡的状况下）
 * @param {*} data 
 */
const commitDrawals = (data) => {
  let url = HOSTURL + '/invest/withdrawals';
  return APIFetch.post(url,data)
}
/**
 * 2.充值
 */
const getRecharge = (data) => {
  let url = HOSTURL + '/invest/recharge';
  return APIFetch.post(url,data)
}
 
/**
 * 3.1银行卡管理，添加银行卡的验证码
 */
const getbindVarCode = (data) => {
  //原卡号，
  let url = HOSTURL + '/varCode/get';
  return APIFetch.post(url,data)
}

// 
/**
 * 3.12银行卡管理，添加银行卡的校验验证码
 */
const cardValidateVarCode = (data) => {
  //原卡号，
  let url = HOSTURL + '/varCode/validateVarCode';
  return APIFetch.post(url,data)
}
/**
 * 3.2银行卡管理，删除(解绑)银行卡
 */
const unbind = (data) => {
  //原卡号，原密码
  let url = HOSTURL + '/bindCard/unBind';
  return APIFetch.post(url,data)
}
/**
 * 查询提现/充值费用
 */
const getFee = (data) => {
  let url = HOSTURL + '/invest/getFee';
  return APIFetch.post(url,data)
}

//验证银行卡卡号
const getBankCode = (data) => {
  let url = HOSTURL + '/bindCard/getBankCode';
  return APIFetch.post(url,data)
}

//获取银行卡列表
const getBankNameList = (data) => {
  let url = HOSTURL + '/bindCard/getBankList';
  return APIFetch.post(url,data)
}
//获取开户网点列表
const getAccountBankList = (data) => {
  let url = HOSTURL + '/bindCard/getInterBankNo';
  return APIFetch.post(url,data)
}
//绑定银行卡
const saveBindBank = (data) => {
  let url = HOSTURL + '/bindCard/bind';
  return APIFetch.post(url,data)
}
//变更银行卡
const changeCard = (data) => {
  let url = HOSTURL + '/bindCard/changeCard';
  return APIFetch.post(url,data)
}
//获取充值提现规则所需的值
const getRechargeRule = (data) => {
  let url = HOSTURL + '/index/getTenantPara';
  return APIFetch.post(url,data)
}
export default {
    getIsBindList,
    addBindCard,
    getMyAsset,
    getbindVarCode,
    cardValidateVarCode,
    unbind,
    commitDrawals,
    getRecharge,
    getFee,
    getBankCode,
    getBankNameList,
    getAccountBankList,
    saveBindBank,
    changeCard,
    getRechargeRule,
}
