import APIFetch from 'APIFetch';

const signIn = (user) => {
  const url = HOSTURL + '/login/sign_in';
  return APIFetch.post(url, user);
};

const signOut = (data) => {
  const url = HOSTURL + '/login/sign_out';
  return APIFetch.post(url,data);
}

//检测登陆状态
const getloginState = (data) => {
  const url = HOSTURL + '/login/getLoginStatus';
  return APIFetch.post(url,data);
}
//忘记密码
const forgot_pd = (data) => {
  const url = HOSTURL + '/register/findPswd';
  return APIFetch.post(url,data);
}
export default {
  signIn,
  signOut,
  getloginState,
  forgot_pd
};
