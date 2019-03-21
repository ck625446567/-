//
//  STOrderListModelExtension.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2018/6/21.
//  Copyright © 2018年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import Foundation

import UIKit

import ObjectMapper

extension STOrderListModel {
    func floatToMoneyIntString(money: Float?) -> String {
        guard let m = money else {
            return "**"
        }
        return String.init(format: "%.2f", m)
    }
    func intToMoneyString(money: Int?) -> String {
        guard let m = money else {
            return "**"
        }
        return String.init(format: "%d", m)
    }
}

/// 订单跟踪
extension STOrderListModel {
    
    /// CrowdFunding为众筹进货，PreSale为预售进货，Normal为普通进货
    /// 状态，预售，常规，众筹
    func statusCellType() -> String? {
        return STGlobalTool.orderCategory(ct: self.orderInfo.category)
    }
    
    /// 状态背景颜色
    func statusCellTypeBGColor() -> UIColor? {
        return STGlobalTool.orderCategoryBGColor(ct: self.orderInfo.category)
    }
    
    /// 状态文本颜色
    func statusCellTypeTextColor() -> UIColor? {
        return STGlobalTool.orderCategoryColor(ct: self.orderInfo.category)
    }
    
    /// 订单号
    func statusCellOrderNum() -> String? {
        return self.orderInfo.orderNo
    }
    
    /// 状态
    /// Paying：待支付，AwaitingVehicle：待交车，VehicleReceived：已收车，PostSale：售后，Canceled：已取消
    func statusCellStatus() -> String? {
        guard let processing = self.orderIsProcessing() else {
            return "Error"
        }
        if processing {
            return "处理中"
        }
        switch self.orderInfo.status {
        case STOrderStatus.WaitLoan.rawValue:
            return "待审核放款"
        case STOrderStatus.Paying.rawValue:
            return "待支付"
        case STOrderStatus.AwaitingFrontMoney.rawValue:
            return "待支付定金"
        case STOrderStatus.AwaitingRestMoney.rawValue:
            return "待支付尾款"
        case STOrderStatus.Canceled.rawValue:
            return "已取消"
        case STOrderStatus.AwaitingVehicle.rawValue:
            return "待收货"
        case STOrderStatus.Finished.rawValue:
            return "订单完成"
        default:
            return ""
        }
    }
    
    /// 状态颜色
    func statusCellStatusColor() -> UIColor? {
        if self.orderIsProcessing() == nil {
            return UIColor.red
        }
        switch self.orderInfo.status {
        case STOrderStatus.Finished.rawValue, STOrderStatus.Canceled.rawValue:
            return UIColor.color4A()
        default:
            return STOrderThemeRedColor
        }
    }
}

/// 物流信息
extension STOrderListModel {
    
    func hasLogistics() -> Bool {
        return self.orderInfo.latestChangeLog != nil
    }
    
    func orderListLogisticsStatus() -> String? {
        return self.orderInfo.latestChangeLog?.description
    }
    
    func orderListLogisticsTime() -> String?{
        return self.orderInfo.latestChangeLog?.createTimeString
    }
}

/// 关于定金的模块
extension STOrderListModel {
    
    /// 订单是否是在处理中
    /// 根据订单状态判断。
    /// 待支付定金：根据定金的支付状态判断是否是处理中
    /// 待支付尾款和待支付：根据尾款的支付状态判断是否是处理中
    func orderIsProcessing() -> Bool? {
        return self.orderInfo.status == STOrderStatus.Processing.rawValue
    }
    
    /// 订单描述 共3辆车，订单金额：￥91000
    func orderListOrderAmountDesc() -> String? {
        return "共".appending(intToMoneyString(money: self.orderInfo.commodityCount)).appending("辆车，订单金额:￥").appending(floatToMoneyIntString(money: self.orderInfo.totalPrice))
    }
    
    /// 当前金额。金额数量。尾款金额或者实付金额，包含￥
    func orderListOrderNowAmount() -> String? {
        switch self.orderInfo.status {
        case STOrderStatus.AwaitingRestMoney.rawValue:
            return "￥".appending(floatToMoneyIntString(money: self.payInfo.restReceivable))
        case STOrderStatus.AwaitingFrontMoney.rawValue:
            return "￥".appending(floatToMoneyIntString(money: self.payInfo.restReceivable))
        case STOrderStatus.Paying.rawValue:
            return "￥".appending(floatToMoneyIntString(money: self.payInfo.restReceivable))
        case STOrderStatus.Canceled.rawValue, STOrderStatus.AwaitingVehicle.rawValue, STOrderStatus.Finished.rawValue:
            return "￥".appending(floatToMoneyIntString(money: self.payInfo.totalPaid))
        default:
            return ""
        }
    }
    
    /// 定金金额。包含尾款或者实付金额的描述 example: 已付定金：￥1500     需付尾款：
    func orderListOrderPreAmount() -> String? {
        switch self.orderInfo.status {
        case STOrderStatus.AwaitingRestMoney.rawValue:
            return "已付定金:￥".appending(floatToMoneyIntString(money: self.payInfo.frontMoneyPaid)).appending("     需付尾款:")
        case STOrderStatus.AwaitingFrontMoney.rawValue:
            return "需付定金："
        case STOrderStatus.Paying.rawValue:
            return "应付："
        case STOrderStatus.Canceled.rawValue, STOrderStatus.AwaitingVehicle.rawValue, STOrderStatus.Finished.rawValue:
            return "实付金额："
        default:
            return ""
        }
        
    }
    
}
