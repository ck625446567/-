//
//  STCarListViewModel.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2019/3/12.
//  Copyright © 2019年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

/// 列表分类
enum STCarListViewModelType: String {
    /// 待发货
    case awaitingDeliver = "Wait"
    /// 待签收
    case awaitingReceive = "Delivery"
    /// 已签收
    case received = "Receive"
    /// 已退订
    case canceled = "Back"
    
    case all = "All"
}

class STCarListViewModel: SMPreViewModel {
    var rawData: [STCarListModel] = []
    
    var pageSize: Int = 10
    
    var pageNo: Int = 0

    var type: STCarListViewModelType = .all
    
    var client: STCarApi = STCarApi()

    /// 下拉刷新
    func getData() {
        if self.isRequesting {
            return
        }
        self.isRequesting = true
        self._getData(pageNo: 0)
    }
    
    func loadMoreData() {
        if self.isRequesting {
            return
        }
        self.isRequesting = true
        
        self._getData(pageNo: pageNo + 1)
    }
    
    /// 网络请求
    func _getData(pageNo: Int) {
        
        var params: [String: Any] = [
            "pageNo": pageNo,
            "pageSize": pageSize,
            "param": type.rawValue,
            "reqType": "STATUS"
        ]
        
        client.getCarList(params: params) { (data, error) in
            let refresh = pageNo == 0
            self.isRequesting = false
            
            if let _ = self.dealResponse(data, error) {
                self.end(refresh, done: false)
                self.delegate?.sourceDataAlter(self.rawData.isEmpty ? 1 : 0)
                return
            }
            
            if pageNo == 0 {
                self.rawData.removeAll()
            }
            
            guard let listModels = data?.data, !listModels.isEmpty else {
                self.end(refresh, done: true)
                self.delegate?.sourceDataAlter(0)
                return
            }
            self.rawData.append(contentsOf: listModels)
            
            self.delegate?.sourceDataAlter(0)
            
            self.end(refresh, done: listModels.count < self.pageSize)
            self.pageNo = pageNo
        }
    }
}
