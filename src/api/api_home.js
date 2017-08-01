import APIFetch from 'APIFetch';

//获取banner图片
const getBanner = (data) => {
  const url = HOSTURL + '/index/getBannerList';
  return APIFetch.post(url, data);
};
//获取3Dswiper数据
const getProducts = (data) => {
  const url = HOSTURL + '/invest/getPrdinfoList';
  return APIFetch.post(url,data);
};
//获取租户简称，logo
const getTenantName =(data) => {
  const url = HOSTURL + '/index/getTenant';
  return APIFetch.post(url,data);
}
//获取公告
const getNotics = (data) => {
  const url = HOSTURL + '/index/getNoticeList';
  return APIFetch.post(url,data);
}
//签到
const ScoreSign = (data) => {
  const url = HOSTURL + '/index/seal';
  return APIFetch.post(url,data);
}

export default {
  getBanner,
  getProducts,
  getTenantName,
  getNotics,
  ScoreSign
};
