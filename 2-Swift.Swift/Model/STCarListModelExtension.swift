//
//  STCarListModelExtension.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2019/3/13.
//  Copyright © 2019年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

extension STCarListModel {
    
    var codeText: String {
        return carInfo?.id ?? ""
    }
    
    var versionText: String {
        let version = carInfo?.model ?? ""
        let color = carInfo?.color ?? ""
        return version + " | " + color
    }
    
    var isBottomViewHidden: Bool {
        return carInfo?.status != STCarListViewModelType.awaitingReceive.rawValue
    }
    
    var bottomViewHeight: CGFloat {
        return isBottomViewHidden ? 0 : 44
    }
    
    var carModelText: String {
        return carInfo?.customModel ?? " "
    }
    
    var configText: String {
        return carInfo?.configInfo ?? " "
    }
    
    var timeText: String {
        return latestChangeLog?.createTime ?? " "
    }
    
    var logisticsIconImage: UIImage {
        switch carInfo?.status ?? "" {
        case STCarListViewModelType.awaitingDeliver.rawValue:
            return #imageLiteral(resourceName: "daifahuo")
        case STCarListViewModelType.awaitingReceive.rawValue:
            return #imageLiteral(resourceName: "fahuo")
        case STCarListViewModelType.received.rawValue:
            return #imageLiteral(resourceName: "qianshou")
        case STCarListViewModelType.canceled.rawValue:
            return #imageLiteral(resourceName: "tuiding")
        default:
            return #imageLiteral(resourceName: "daifahuo")
        }
    }
    
    var logisticsDescText: String {
        return latestChangeLog?.description ?? " "
    }
    
    var logisticsTimeText: String {
        return latestChangeLog?.createTime ?? " "
    }
    
    var statusText: String {
        switch carInfo?.status ?? "" {
        case STCarListViewModelType.awaitingDeliver.rawValue:
            return "待发货"
        case STCarListViewModelType.awaitingReceive.rawValue:
            return "待签收"
        case STCarListViewModelType.received.rawValue:
            return "已签收"
        case STCarListViewModelType.canceled.rawValue:
            return "已退订"
        default:
            return ""
        }
    }
}
