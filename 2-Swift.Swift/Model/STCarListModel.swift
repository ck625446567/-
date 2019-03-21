//
//  STCarListModel.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2019/3/13.
//  Copyright © 2019年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit
import ObjectMapper

class STCarListModel: Mappable {
    
    ///
    var carInfo: CarInfoModel?
    ///最后变更信息
    var latestChangeLog: LatestChangeLogModel?
    
    init() {
        
    }
    
    required init?(map: Map) {
        self.mapping(map: map)
    }
    
    func mapping(map: Map) {
        
        carInfo         <-  map["carInfo"]
        
        latestChangeLog         <-  map["latestChangeLog"]
        
    }
}


class CarInfoModel: Mappable {
    ///颜色
    var color: String?
    ///配件
    var configInfo: String?
    ///型号
    var customModel: String?
    ///车辆编号
    var id: String?
    ///版本
    var model: String?
    ///车型图片
    var picUrl: String?
    ///状态
    var status: String?
    
    ///时间戳
    var createTime: String?
    
    init() {
        
    }
    
    required init?(map: Map) {
        self.mapping(map: map)
    }
    
    func mapping(map: Map) {
        createTime         <-  map["createTime"]

        color         <-  map["color"]
        
        configInfo         <-  map["configInfo"]
        
        customModel         <-  map["customModel"]
        
        id         <-  map["id"]
        
        model         <-  map["model"]
        
        picUrl         <-  map["picUrl"]
        
        status         <-  map["status"]
        
    }
}

///最后变更信息
class LatestChangeLogModel: Mappable {
    
    ///变更时间
    var createTime: String?
    ///变更描述
    var description: String?
    
    init() {
        
    }
    
    required init?(map: Map) {
        self.mapping(map: map)
    }
    
    func mapping(map: Map) {
        
        createTime         <-  map["createTime"]
        
        description         <-  map["description"]
        
    }
}


