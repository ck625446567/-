//
//  STOrderListCancelViewController.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2018/6/22.
//  Copyright © 2018年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

import ReactNativeShenmaMini

class STOrderProgressViewController: SMMiniBaseViewController {
    
    init(orderNo: String) {
        super.init("ShenmaEV_RN_Access")
        self.page = "order_progress"
        self.params = ["orderId": orderNo]
    }
    
    override init!(_ miniId: String!) {
        super.init("ShenmaEV_RN_Access")
        self.page = "order_progress"
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init("ShenmaEV_RN_Access")
        self.page = "order_progress"
    }
    
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nil, bundle: nil)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.setNavigationBarHidden(true, animated: true)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        self.navigationController?.setNavigationBarHidden(false, animated: true)
    }
}
