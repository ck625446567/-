//
//  STOrderListViewController.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2018/6/21.
//  Copyright © 2018年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

protocol STOrderListViewModelDelegate: class {
    
    /// 支付上牌保证金
    func payLicencePlate(orderNo: String, feeType: String)
    
    /// 再次购买
    func buyAgain()
    
    /// 订单支付
    func orderPay(model: STPayModel)
    
}

/// 列表分类
enum STOrderListViewModelType: String {
    /// 待付款
    case paying = "Paying"
    /// 付款完成
    case finished = "Finished"
    /// 已取消
    case canceled = "Canceled"
    case all = ""
}

class STOrderListViewModel: SMPreViewModel {
    
    var type: STOrderListViewModelType = .all
    
    weak var listDelegate: STOrderListViewModelDelegate?
    
    var client: STOrderAPI = STOrderAPI()
    
    var rawData: [STOrderListModel] = []
    
    var data: [[STOrderListCellModel]] = []
    
    var size: Int = 10
    
    /// 下拉刷新
    func getData() {
        if self.isRequesting {
            return
        }
        self.isRequesting = true
        self._getData(refresh: true)
    }
    
    /// 上拉加载
    func loadMoreData() {
        if self.isRequesting {
            return
        }
        self.isRequesting = true
        self._getData(refresh: false)
    }
    
    /// 网络请求
    func _getData(refresh: Bool) {
        
        var params: [String: Any] = [
            "size": self.size,
            "type": type.rawValue
        ]
        
        if let createTime = self.rawData.last?.orderInfo.createTime, !refresh {
            params["timestamp"] = createTime
        }
        
        self.client.getOrderList(params: params) { (data, error) in
            
            self.isRequesting = false
            
            if let _ = self.dealResponse(data, error) {
                self.end(refresh, done: false)
                self.delegate?.sourceDataAlter(self.data.isEmpty ? 1 : 0)
                return
            }
            
            if refresh {
                self.data.removeAll()
                self.rawData.removeAll()
            }
            
            guard let listModels = data?.data, !listModels.isEmpty else {
                self.end(refresh, done: true)
                self.delegate?.sourceDataAlter(0)
                return
            }
            
            for m in listModels {
                if !m.isValid() {
                    self.delegate?.showMessage("返回数据缺少必要参数")
                    self.end(refresh, done: false)
                    return
                }
            }
            
            var newList: [[STOrderListCellModel]] = []
            
            for model in listModels {
                
                newList.append(self.toRowModels(model: model))
            }
            
            self.data.append(contentsOf: newList)
            
            self.rawData.append(contentsOf: listModels)
            
            self.delegate?.sourceDataAlter(0)
            
            self.end(refresh, done: listModels.count < self.size)
        }
    }
    
    /// 再次购买
    func buyAgain() {
        self.listDelegate?.buyAgain()
    }

    /// 支付
    func pay(model: STOrderListModel) {
        
        guard let orderNo = model.orderInfo.orderNo, let payType = STOrderPayType(rawValue: model.payInfo.payType), let money = model.payInfo.restReceivable else {
            self.delegate?.showMessage("数据异常(0)")
            return
        }
        let payModel = STPayModel()
        payModel.payType = payType
        payModel.orderNo = orderNo
        payModel.amount = money
        payModel.checkOrderRedEnvelope = true
        payModel.creditLoanStatus = model.payInfo.creditStatus
        self.listDelegate?.orderPay(model: payModel)
    }
    
    func confirm(orderNo: String?) {
        guard let no = orderNo else {
            self.delegate?.showMessage("未获取到订单号(0)")
            return
        }
        self.delegate?.makeActivity(nil)
        self.client.orderEnsure(params: ["orderNo": no]) { (data, error) in
            if let _ = self.dealResponse(data, error) {
                return
            }
            self.delegate?.hiddenActivity()
            self.getData()
        }
    }
    
    /// 将订单转化为 cell 模型
    func toRowModels(model: STOrderListModel) -> [STOrderListCellModel] {
        
        let orderNo: String? = model.orderInfo.orderNo
        
        var result: [STOrderListCellModel] = []
        
        // 订单状态
        let statusModel: STOrderListStatusCellModel = STOrderListStatusCellModel()
        statusModel.type = model.statusCellType()
        statusModel.typeBGColor = model.statusCellTypeBGColor()
        statusModel.typeTextColor = model.statusCellTypeTextColor()
        statusModel.orderNum = model.statusCellOrderNum()
        statusModel.status = model.statusCellStatus()
        statusModel.statusColor = model.statusCellStatusColor()
        result.append(statusModel)
        
        // 物流
        if model.hasLogistics() {
            let logistics: STOrderListLogisticsCellModel = STOrderListLogisticsCellModel()
            logistics.sizeFitText(text: model.orderListLogisticsStatus())
            logistics.status = model.orderListLogisticsStatus()
            logistics.time = model.orderListLogisticsTime()
            result.append(logistics)
        }
       
        // 列表
        let list: STOrderListVehicleListCellModel = STOrderListVehicleListCellModel()
        var listItem: [STOrderListVehicleCollectionViewCellModel] = []
        for item in model.commodities {
            let itemModel = STOrderListVehicleCollectionViewCellModel()
            itemModel.carTypeImage = item.carTypeImage()
            itemModel.vehicleCount = item.vehicleCount()
            itemModel.vehicleName = item.vehicleName()
            itemModel.vehicleImage = item.vehicleImage()
            itemModel.vehiclePHImage = item.vehiclePHImage()
            listItem.append(itemModel)
        }
        list.vehicleItems = listItem
        result.append(list)
        
        // 金额
        let amount: STOrderListOrderAmountCellModel = STOrderListOrderAmountCellModel()
        amount.amountDesc = model.orderListOrderAmountDesc()
        amount.preAmount = model.orderListOrderPreAmount()
        amount.nowAmount = model.orderListOrderNowAmount()
        result.append(amount)
        
        // 按钮
        let funcModel: STOrderListFuncCellModel = STOrderListFuncCellModel()
        
        /// 处理中
        let processing = model.orderIsProcessing()
        if processing == nil || processing! {
            funcModel.funcItems = []
        }
        // 待支付尾款
        else if model.orderInfo.status == STOrderStatus.AwaitingRestMoney.rawValue {
            funcModel.funcItems = [
                STOrderListFuncModel.leftAmount { [weak self] in
                    self?.pay(model: model)
                },
            ]
        }
        // 待支付定金
        else if model.orderInfo.status == STOrderStatus.AwaitingFrontMoney.rawValue {
            funcModel.funcItems = [
                STOrderListFuncModel.preAmount { [weak self] in
                    self?.pay(model: model)
                },
            ]
        }
            // 待支付
        else if model.orderInfo.status == STOrderStatus.Paying.rawValue {
            funcModel.funcItems = [
                STOrderListFuncModel.pay { [weak self] in
                    self?.pay(model: model)
                },
            ]
        }
            // 已取消
        else if model.orderInfo.status == STOrderStatus.Canceled.rawValue {
            funcModel.funcItems = []
        }
            // 已完成
        else if model.orderInfo.status == STOrderStatus.Finished.rawValue {
            funcModel.funcItems = []
        }
            // 待收货
        else if model.orderInfo.status == STOrderStatus.AwaitingVehicle.rawValue {
            funcModel.funcItems = []
            
        }
        
        // 去支付上牌保证金
        if model.orderInfo.licenseStatus == STOrderLicenseStatus.WaitPayLicenseBail.rawValue {
            funcModel.funcItems.append(STOrderListFuncModel.licencePlate { [weak self] in
                guard let no = orderNo else { return }
                self?.listDelegate?.payLicencePlate(orderNo: no, feeType: "DEPOSIT")
            })
        }
        
        // 去支付提档费
        if model.orderInfo.filingFeeStatus == STOrderFilingFeeStatus.WaitPay.rawValue {
            funcModel.funcItems.append(STOrderListFuncModel.filingPay { [weak self] in
                guard let no = orderNo else { return }
                self?.listDelegate?.payLicencePlate(orderNo: no, feeType: "FILING")
            })
        }
        
        if !funcModel.funcItems.isEmpty {
            result.append(funcModel)
        }
        return result
    }
    
    func phoneCall() {
        UIApplication.shared.phoneCall(url: STUserInfo.CSPhoneNumURL())
    }
    
    func modelAtIndex(indexPath: IndexPath) -> STOrderListCellModel? {
        guard indexPath.section < self.data.count && indexPath.row < self.data[indexPath.section].count else {
            return nil
        }
        return self.data[indexPath.section][indexPath.row]
    }
}
