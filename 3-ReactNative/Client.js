/**
 * Created on 12:12 2018/05/07.
 * file name Client
 * by chenkai
 */

import { request } from './Net/Net';

import { SMError } from '@shenmajr/shenmajr-react-native-net';

/**
 * 此类为项目中具体的某个接口的网络请求
 * 建议每个模块都有一个这样的文件
 */

/**
 * 网络请求URL定义
 * @type {{login: string}}
 */
export const URLDefine = {
    inventoryList: 'stock/shopStock',
    waitingPickList: 'stock/waitingByFrameNo',
    waitingList: 'stock/waiting',
    handInStock: 'stock/hand/instock',
    stockCarInfo: 'stock/stockCarInfo',
    stockInOutList: 'stock/inOutStock',
    stockOutPickList: 'stock/hand/stock',
    stockOutConstant: 'stock/outType',
    handStockOut: 'stock/hand/outStock'
};

export function httpRequest(options) {
    getUserInfo(userInfo => {
        request(
            Object.assign(options, {
                header: {
                    token: userInfo.token,
                    deviceidmd5: userInfo.deviceidmd5
                }
            })
        );
    });
}

/*
 *  获取订单URL
 * */
function getFullPath(path) {
    return sm.urlInfo.rompUrl + path;
}

/**
 * 生成请求参数
 * @param params
 * @returns {{}}
 */
function requestParams(params) {
    let base = {
        storeId: sm.userInfo.storeId
    };
    return Object.assign(base, params);
}

export function getUserInfo(callBack: any => void) {
    if (global.sm.userInfo) {
        callBack(global.sm.userInfo);
        return;
    }
    sm.getUserInfo(info => {
        global.sm.userInfo = info.dealerInfo;
        callBack(global.sm.userInfo);
    });
}

/*获取库存列表*/
export function getInventoryList(params: any, complete: ({ data: any, error: SMError }) => void) {
    httpRequest({
        path: getFullPath(URLDefine.inventoryList),
        params: requestParams(params),
        complete: complete
    });
}

/*获取库存列表用来选择的列表*/
export function getInventoryPickList(
    params: any,
    complete: ({ data: any, error: SMError }) => void
) {
    httpRequest({
        path: getFullPath(URLDefine.stockOutPickList),
        params: requestParams(params),
        complete: complete
    });
}

/*获取待入库列表*/
export function getWaitingList(params: any, complete: ({ data: any, error: SMError }) => void) {
    httpRequest({
        path: getFullPath(URLDefine.waitingList),
        params: requestParams(params),
        complete: complete
    });
}

/*获取待入库列表，用于手动选择的界面*/
export function getWaitingPickList(params: any, complete: ({ data: any, error: SMError }) => void) {
    httpRequest({
        path: getFullPath(URLDefine.waitingPickList),
        params: requestParams(params),
        complete: complete
    });
}

/*手动入库*/
export function handInStock(params: any, complete: ({ data: any, error: SMError }) => void) {
    httpRequest({
        path: getFullPath(URLDefine.handInStock),
        params: requestParams(params),
        complete: complete
    });
}

/*库存详情*/
export function stockCarInfo(params: any, complete: ({ data: any, error: SMError }) => void) {
    httpRequest({
        path: getFullPath(URLDefine.stockCarInfo),
        params: requestParams(params),
        complete: complete
    });
}

/*库存出入库列表*/
export function stockInOutList(params: any, complete: ({ data: any, error: SMError }) => void) {
    httpRequest({
        path: getFullPath(URLDefine.stockInOutList),
        params: requestParams(params),
        complete: complete
    });
}

/*出库常量*/
export function stockOutConstant(params: any, complete: ({ data: any, error: SMError }) => void) {
    httpRequest({
        path: getFullPath(URLDefine.stockOutConstant),
        params: requestParams(params),
        complete: complete
    });
}

/*出库常量*/
export function handStockOut(params: any, complete: ({ data: any, error: SMError }) => void) {
    httpRequest({
        path: getFullPath(URLDefine.handStockOut),
        params: requestParams(params),
        complete: complete
    });
}
