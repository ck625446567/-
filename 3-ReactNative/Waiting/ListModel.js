/**
 * Created on 16:51 2018/07/31.
 * file name ListModel
 * by chenkai
 */

export interface ListWaitingStockInfoModel {
    modelConfigInfos: ListWaitingStockConfigModel[];

    orderNo: string;

    waitingStockNumber: number;
}

export interface ListWaitingStockConfigModel {
    /// 	选配
    optionalPart: string;

    /// 车型名称
    smModel: string;

    /// 车型图片
    pictureUrl: string;

    /// skuId
    skuid: string;

    /// 车型版本
    modelConfig: string;

    /// 车架号
    frameNo: string;

    /// 订单编号
    orderNo: string;

    /// 颜色
    color: string;

    /// 车辆类型
    carType: string;
}
