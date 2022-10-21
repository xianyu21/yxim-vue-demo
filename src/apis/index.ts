import axios, { AxiosResponse } from 'axios';
import logger from '../utils/logger';
import { Md5 } from 'ts-md5';
export interface ICommonRes {
  code: number;
  msg: string;
  requestId: string;
  data: any;
}

export interface ISendSmsCodeRes extends ICommonRes {
  isFirstRegister: boolean;
}
export interface ISendSmsv1 extends ICommonRes {
  isFirstRegister: boolean;
}

export interface ISmsLoginRes extends ICommonRes {
  user: string;
  accessToken: string;
  imAccid: string;
  imToken: string;
  avatar: string;
  avRoomUid: string;
  nickname: string;
  accountId: string;
}

export const urlMap = {
  sendSmsCode: '/userCenter/v1/auth/sendLoginSmsCode',
  smsLogin: '/userCenter/v1/auth/loginRegisterByCode',
  sendSmsv1: '/api/common/randcode/sendSmsv1'
};

const Request = {
  headers: {
    test: '1'
  },
  baseDomain: '',
  setHeaders(headers: any) {
    console.log(headers,'-------------');
    Request.headers = headers;
  },
  setBaseDomain(baseDomain: string) {
    Request.baseDomain = baseDomain;
  },
  request: async <T>({ method, url, data, domain }: { method: 'get' | 'post'; url: string; data?: any; domain?: string }): Promise<T> => {
    try {
      const time = (new Date().getTime() + '').substr(0, 10);
      // data.time = time
      // data.secret = Md5.hashStr(`erlang${time}`)
      Request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      logger.log(`request ${url}`, data);
      logger.log(Request);

      const baseDomain = domain ? domain : process.env.ENV === 'mock' ? '/api' : Request.baseDomain;

      const res: AxiosResponse<T & ICommonRes> = await axios({
        method,
        url: `${baseDomain}${url}`,
        data,
        headers: Request.headers
      });
      if (res.data.code !== 200) {
        logger.error(`request fail ${url}`, data, res);
        return Promise.reject(res.data);
      }
      logger.log(`request success ${url}`, data, res);
      return res.data.data;
    } catch (err) {
      logger.error(`request fail ${url}`, data, err);
      return Promise.reject(err);
    }
  },

  sendSmsCode: (mobile: string) => {
    return Request.request<ISendSmsCodeRes>({
      method: 'post',
      url: urlMap.sendSmsCode,
      data: {
        mobile
      }
    });
  },
  sendSmsv1: (phone: string) => {
    return Request.request<ISendSmsv1>({
      method: 'post',
      url: urlMap.sendSmsv1,
      data: {
        telephone: phone,
        areaCode: 86,
        invideCode: 1,
        isRegister: 2,
        language: 'zh'
      }
    });
  },

  smsLogin: ({ mobile, code }: { mobile: string; code: string }) => {
    return Request.request<ISmsLoginRes>({
      method: 'post',
      url: urlMap.smsLogin,
      data: {
        mobile,
        smsCode: code
      }
    });
  }
};

export default Request;
