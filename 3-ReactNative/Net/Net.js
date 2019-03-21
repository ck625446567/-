/**
 * Created on 11:32 2018/05/07.
 * file name Net
 * by chenkai
 */

import { request as SMRequest, SMNetRequestOptions } from '@shenmajr/shenmajr-react-native-net';

import hookOptions from './NetHook';

/**
 * 发起一个网络请求，项目中所有的网络请求都会进入此方法。
 * 此方法作为整个项目的网关
 * @param options
 */
export function request(options: SMNetRequestOptions) {
    /// 对网络请求挂钩
    hookOptions(options);

    /// 发起网络请求
    SMRequest(options);
}
