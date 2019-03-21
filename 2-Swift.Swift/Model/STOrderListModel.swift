//
//  STOrderListModel.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2018/6/21.
//  Copyright © 2018年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

import ObjectMapper

class STOrderListModel: STOrderListCellModel, Mappable {
    
    /// 订单详情
    var orderInfo: STOrderListInfoModel = STOrderListInfoModel()
    
    /// 支付详情
    var payInfo: STOrderListPayInfoModel = STOrderListPayInfoModel()
    
    /// 商品列表
    var commodities: [STOrderListCommoditiesModel] = []
    
    required init?(map: Map) {
        super.init()
        self.mapping(map: map)
    }
    
    func mapping(map: Map) {
        
        orderInfo      <-  map["orderInfo"]
        
        payInfo         <-  map["payInfo"]
        
        commodities  <-  map["commodities"]
    }
    
    func isValid() -> Bool {
        guard let _ = self.orderInfo.category, !self.orderInfo.status.isEmpty else {
            return false
        }
        return true
    }
}

class STOrderListPayInfoModel: Mappable {
    
    /// 动力贷使用状态
    var  creditStatus: String?
    
    /// 已付定金
    var         frontMoneyPaid: Float?
    
    /// 订单支付类型
    var         payType: String = ""
    
    /// 已付尾款
    var         restMoneyPaid: Float?
    
    /// 剩余应付金额
    var         restReceivable: Float?
    
    /// 已付总金额
    var         totalPaid: Float?
    
    init() {
        
    }
    
    required init?(map: Map) {
        self.mapping(map: map)
    }
    
    func mapping(map: Map) {
        
        creditStatus      <-  map["creditStatus"]
        
        frontMoneyPaid    <-  map["frontMoneyPaid"]
        
        payType           <-  map["payType"]
        
        restMoneyPaid     <-  map["restMoneyPaid"]
        
        restReceivable    <-  map["restReceivable"]
        
        totalPaid         <-  map["totalPaid"]
    }

}

class STOrderListInfoModel: Mappable {
    
    /// 进货方式 CrowdFunding为众筹进货，PreSale为预售进货，Normal为普通进货
    var category: String!
    
    /// 商品总数
    var     commodityCount: Int?
    
    /// 订单编码
    var     orderNo: String?
    
    /// 订单状态变更
    var latestChangeLog: STOrderLatestChangeLogModel?
    
    /// 订单状态
    /// Paying：待支付，AwaitingVehicle：待交车，Canceled：已取消，AwaitingFrontMoney：待支付定金, AwaitingRestMoney：待支付尾款，Processing：付款处理中，Finished：已完成, AwaitingLicensePlate: 上牌保证金，WaitLoan:待审核放款
    var     status: String = ""
    
    /// 订单总价（含运费）
    var     totalPrice: Float?
    
    /// 订单创建时间。刷新使用
    var createTime: Double?
    
    /// 商品总价（不含运费）
    var     commodityPrice: Float?
    
    /// 运费
    var     shippingPrice: Float?
    
    /// 上牌状态
    var     licenseStatus: String?
    
    /// 提档费状态。 WAIT_PAY:待支付；NOT_USE：无需支付
    var     filingFeeStatus: String?
    
    init() {
        
    }

    required init?(map: Map) {
        self.mapping(map: map)
    }
    
    func mapping(map: Map) {
        filingFeeStatus    <-  map["filingFeeStatus"]

        licenseStatus    <-  map["licenseStatus"]
        
        category         <-  map["category"]
        
        commodityCount   <-  map["commodityCount"]
        
        orderNo          <-  map["orderNo"]
        
        latestChangeLog  <-  map["latestChangeLog"]
        
        status           <-  map["status"]
        
        totalPrice       <-  map["totalPrice"]
        
        createTime       <-  map["createTime"]
        
        commodityPrice   <-  map["commodityPrice"]
        
        shippingPrice    <-  map["shippingPrice"]
        
    }
}

class STOrderLatestChangeLogModel: Mappable {
    
    var createTime: String?
    
    var description: String?
    
    var createTimeString: String? {
        return self.createTime
    }
    
    required init?(map: Map) {
        self.mapping(map: map)
    }
    
    func mapping(map: Map) {
        
        createTime       <-  map["createTime"]
        
        description  <-  map["description"]
    }
    
}

/// 商品列表
class STOrderListCommoditiesModel: Mappable {
    
    var customModel: String?
    
    var picUrl: String?
    
    var quantity: Int?
    
    var model: String?
    
    var carType: String?
    
    required init?(map: Map) {
        self.mapping(map: map)
    }
    
    func mapping(map: Map) {
        
        carType      <-  map["carType"]
        
        customModel  <-  map["customModel"]
        
        picUrl       <-  map["picUrl"]
        
        quantity     <-  map["quantity"]
        
        model        <-  map["model"]
    }
    
    func vehicleName() -> String? {
        return self.customModel ?? "--"
    }
    
    func vehicleCount() -> String? {
        if let count = self.quantity {
            return String(count).appending("X")
        }
        return "-"
    }
    
    func vehicleImage() -> String? {
        return self.picUrl
    }
    
    func vehiclePHImage() -> UIImage? {
        return UIImage(named: "order_list_ph")
    }
    
    func carTypeImage() -> UIImage? {
        return STGlobalTool.carTypeImage(carType: carType)
    }
}
