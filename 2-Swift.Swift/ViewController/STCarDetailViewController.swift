//
//  STCarDetailViewController.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2019/3/18.
//  Copyright © 2019年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit
import ReactNativeShenmaMini

class STCarDetailViewController: STMiniBaseViewController {
    
    override init!(_ miniId: String!) {
        super.init("ShenmaEV_RN_Order")
        self.page = "car_detail"
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init("ShenmaEV_RN_Order")
        self.page = "car_detail"
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        registEvent("order_sign_in") { [weak self] (data, callBack) in
            let scan = STInventoryScanViewController()
            self?.navigationController?.pushViewController(scan, animated: true)
        }
    }
    
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nil, bundle: nil)
    }
}
