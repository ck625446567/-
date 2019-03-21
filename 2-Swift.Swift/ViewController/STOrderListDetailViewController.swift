//
//  STOrderListDetailViewController.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2018/6/22.
//  Copyright © 2018年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

import ReactNativeShenmaMini

import SMJRAlertView

class STOrderListDetailViewController: STMiniBaseViewController, STPayDelegate {
    
    var orderNo: String!
    
    var rnCallBack: React.RCTResponseSenderBlock?
    
    var bindCardHelper: UserBindCardEntrance = UserBindCardEntrance()
    
    var payManager: STPayManager?
    
    init(orderNo: String) {
        super.init("ShenmaEV_RN_Order")
        self.orderNo = orderNo
        self.page = "order_detail"
        self.params = ["orderNo": self.orderNo]
    }
    
    override init!(_ miniId: String!) {
        super.init("ShenmaEV_RN_Order")
    }
    
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        /// 信用支付绑卡
        self.registEvent("order_pay_bind_card", eventWithCallBack: { [weak self] (data, callBack) in
            guard let wSelf = self else { return }
            var cardId: String?
            if let eData = data as? [String: Any], let cid = eData["cardId"] as? String, !cid.isEmpty {
                cardId = cid
            }
            self?.rnCallBack = callBack
            self?.bindCardHelper.bindCard(fromVC: wSelf, cardId: cardId, bindCardType: BindCardType.repayment, entranceType: EntranceType.EntranceTypePush)
            }
        )
        
        /// 商品详情
        self.registEvent("goods_detail", event: { [weak self] (data) in
            
            guard let model = data as? [String: Any], let goodsId = model["goodsId"] as? String else {
                return
            }
            let carType = model["carType"] as? String
            let cfgCode = model["cfgCode"] as? String
            let iconPath = model["imagePath"] as? String
            let vc = STGoodsViewController(goodsId: goodsId, carType: carType, cfgCode: cfgCode, iconPath: iconPath)
            
            self?.navigationController?.pushViewController(vc, animated: true)
        })
        
        self.registEvent("order_breakOrderList", event: { (data) in
            guard let orderId = (data as? [String: String])?["orderId"] else {
                return
            }
            SMMiniApi.openMini(byId: "ShenmaEV_RN_Access", params: ["page": "order_breakOrderList", "params": ["batApplNo": orderId, "orderId": orderId, "orderNo": orderId]])
        })
        
        self.registEvent("order_pay", event: { [weak self] (data) in
            guard let wSelf = self else { return }
            guard let body = data as? [String: Any] else {
                return
            }
            let payModel: STPayModel = STPayModel.createByRNData(data: body)
            payModel.sourceVC = self
            payModel.delegate = self
            payModel.payWayPageAnimatedDismiss = true
            guard payModel.isValid()  else {
                wSelf.view.makeHint("支付参数异常")
                return
            }
            wSelf.payManager = STPayManager()
            wSelf.payManager?.orderPay(payModel: payModel)
        })
    }
    
    /// 支付回调结果
    ///
    /// - Parameter resp: 支付回调数据
    func onResp(resp: STPayResp) {
        self.rootView.bridge.reload()
        if !(resp.result == .cancel || resp.payWay == .credit) {
            let result = STOrderPayResultViewController.init(resp: resp)
            result.autoPushToOrderDetail = false
            self.navigationController?.pushViewController(result, animated: true)
        }
    }
    
}
