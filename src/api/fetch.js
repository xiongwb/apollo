/*
 * @providesModule APIFetch
 */


//global.HOSTURL = 'http://113.31.18.100:9001/fat';
//global.HOSTURL = 'http://124.88.117.244:8888/fat/dev';
global.HOSTURL = 'http://192.168.191.6:9001/fat';
//global.HOSTURL = 'http://waptest.e96518.com/fat'
export default {
  get(url, data = {}) {
    return this.request('GET', url, data, 'query');
  },

  post(url, data = {}) {
    return this.request('POST', url, data, 'form_data');
  },

  put(url, data = {}) {
    return this.request('PUT', url, data, 'form_data');
  },

  delete(url, data = {}) {
    return this.request('DELETE', url, data, 'form_data');
  },

  request(method, url, data = {}, dataType) {
    console.log(`request method:${method} url:${url} data_type:${dataType}`);
    console.log('data is ~~~~~');
    console.log(data);
    console.log('~~~~~');

    const promise = new FetchPromise();
    fetchByDataType(url, method, data, dataType).then(requestThen(promise)).catch((err)=> {
        console.error(err)
    })

    return promise;
  },
};

const fetchByDataType = (url, method, data, dataType) => {
  if (dataType === 'query') {
    url = url + hash2Query(data);
    console.log(`${method} ${url}`);
    return fetch(url, { method: method });
  }

  if (dataType === 'form_data') {
    return fetch(url, {
      method: method,
      body: hash2FormData(data),
    });
  }

  if (dataType === 'urlencoded') {
    return fetch(url, {
      method: method,
      body: hash2UrlEncoded(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }
}

const hash2FormData = (hash) => {
  if (Object.keys(hash).length === 0) {
    return null;
  }

  const formData = new FormData();
  for (const key in hash) {
    let value = hash[key];
    if(value == null){
      value='';
    }
    formData.append(key, value);
  }
  return formData;
};

const hash2Query = (hash) => {
  if (Object.keys(hash).length === 0) {
    return '';
  }
  const queryArr = [];
  for (const property in hash) {
    const key = encodeURIComponent(property);
    let value = encodeURIComponent(hash[property]);
    if(value == null){
      value='';
    }
    queryArr.push(`${key}=${value}`);
  }

  const query = `?${query_arr.join('&')}`;

  return query;
};

const hash2UrlEncoded = (hash) => {
  if (Object.keys(hash).length === 0) {
    return '';
  }

  const formBody = [];
  for (const property in data) {
    const key = encodeURIComponent(property);
    let value = encodeURIComponent(data[property]);
    if(value == null){
      value='';
    }
    formBody.push(`${key}=${value}`);
  }
  return formBody.join('&');
};

const requestThen = (promise) => {
  return (res) => {
    if (isJson(res)) {
      res.json().then(
        res.ok ? (json) => { promise.done_func(json, res); } : (json) => { promise.fail_func(json, res); },
      );
    } else {
      console.log('返回的不是 JSON 信息');
    }
    promise.always_func(res);
  };
};

const isJson = function(res) {
  return true;
}

class FetchPromise {
  constructor(props) {
    this.done_func_callbacks = [];
    this.fail_func_callbacks = [];
    this.always_func_callbacks = [];

    this.done_func = function () {
      console.log('done func');
      const args = arguments;
      console.log(args);
      Array.from(this.done_func_callbacks).forEach((fun) => {
        fun(...args);
      });
    };

    this.fail_func = function () {
      console.log('fail func');
      const args = arguments;
      Array.from(this.fail_func_callbacks).forEach((fun) => {
        fun(...args);
      });
    };

    this.always_func = function () {
      console.log('always func');
      const args = arguments;
      console.log(arguments);
      Array.from(this.always_func_callbacks).forEach((fun) => {
        fun(...args);
      });
    };
  }

  done(func) {
    this.done_func_callbacks.push(func);
    return this;
  }

  fail(func) {
    this.fail_func_callbacks.push(func);
    return this;
  }

  always(func) {
    this.always_func_callbacks.push(func);
    return this;
  }
}
