import APIFetch from 'APIFetch';

const getApplyRegion = (data) => {
    let url = HOSTURL + '/finApply/fin_apply';
    return APIFetch.post(url,data);
}


const sendApplyData = (data) => {
    let url = HOSTURL + '/finApply/fin_apply';
    return APIFetch.post(url,data);
}

const sendProtocolData = (data) => {

    let url = HOSTURL + '/finApply/protocol_get';
    return APIFetch.post(url,data);
}
const getFinAdvertise = (data) => {
    
    let url = HOSTURL + '/finApply/getFinAdvertise';
    return APIFetch.post(url,data);
}



export default {
  sendApplyData,
  sendProtocolData,
  getApplyRegion,
  getFinAdvertise
}
