import APIFetch from 'APIFetch';

//获取list数据
const getInvList = (data) => {
  let url = HOSTURL + '/invest/getAllPrdinfoList';
  return APIFetch.post(url,data);
}
//获取item数据
const getInvItemDetail = (data) => {
  let url = HOSTURL + '/invest/getPrdinfo';
  return APIFetch.post(url,data);
}
//获取 立即投资  所需资料
const getInvInvest = (data) =>{
  let url = HOSTURL + '';
  return APIFetch.post(url,data);
}
//确认投资
const doInvest = (data) =>{
  console.log(data);
  let url = HOSTURL + '/invest/doInvest';
  return APIFetch.post(url,data);
}
//投资后台验证
const validateInv = (data) =>{
  console.log(data);
  let url = HOSTURL + '/invest/validateInv';
  return APIFetch.post(url,data);
}
//加载产品图片
const getPrdimg = (data) =>{
  console.log(data);
  let url = HOSTURL + '/invest/getPrdimg';
  return APIFetch.post(url,data);
}
//获得抢购间隔时间
const getRushTime = (data) => {
  const url = HOSTURL + '/invest/getStartTime';
  return APIFetch.post(url,data);
}
export default {
  getInvList,
  getInvItemDetail,
  getInvInvest,
  doInvest,
  validateInv,
  getPrdimg,
  getRushTime,
}
