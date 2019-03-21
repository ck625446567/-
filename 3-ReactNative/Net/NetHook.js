/**
 * Created on 22:37 2018/06/14.
 * file name NetHook
 * by chenkai
 */

import { SMNetRequestOptions, parseSetType } from '@shenmajr/shenmajr-react-native-net';

import { Log } from '@shenmajr/shenmajr-react-native-logger';

import NativeBridge from '@shenmajr/shenmajr-react-native-nativebridge';

/**
 * 挂钩
 * @param options
 */
export default function hookOptions(options: SMNetRequestOptions) {
    // 勾掉 parseSet 字段，自定义 success code 和 token code
    hookParseSet(options);

    // 挂钩，打印网络日志
    hookToLogRequest(options);

    /// 勾掉 complete 的回调，检测是否是登录失效，重新登录
    hookCompleteCheckLogin(options);
}

/**
 * 挂钩，监控网络请求的发出日志和返回日志
 * @param options
 */
function hookToLogRequest(options: SMNetRequestOptions) {
    if (!options) {
        return;
    }

    Log('========== 网络请求发出 ==  ' + options.path + ' ====');

    Log(
        {
            path: options.path,
            post: options.post,
            json: options.json,
            params: options.params,
            parseSet: options.parseSet
        },
        false
    );

    let complete = options.complete;

    options.complete = function(data) {
        Log('========== 网络请求返回 ==  ' + options.path + ' ====');

        Log(data, false);

        if (complete) complete(data);
    };
}

/**
 * 对返回数据的解析
 * @type {{success: string, token: string[]}}
 * @private
 */
const customParseSet: parseSetType = {
    success: '200',
    token: ['-2', '5001', '101']
};

/**
 * 勾掉 parseSet 字段，自定义 success code 和 token code
 * @param options
 */
function hookParseSet(options: SMNetRequestOptions) {
    if (!options.parseSet) {
        options.parseSet = customParseSet;
    }
}

/**
 * 勾掉 complete 字段，检测是否 token fail 需要重新登录
 * @param options
 */
function hookCompleteCheckLogin(options) {
    let complete = options.complete;

    options.complete = data => {
        if (data && data.error && data.error.isTokenFail()) {
            sendNativeToLogin();
        } else {
            if (complete) complete(data);
        }
    };
}

/**
 * 发送给原生，需要重新登录
 */
function sendNativeToLogin() {
    /// 调用原生方法，需要重新登录
    NativeBridge.tokenFail();
}
