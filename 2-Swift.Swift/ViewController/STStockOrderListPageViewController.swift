//
//  STOrderListPageViewController.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2018/8/1.
//  Copyright © 2018年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

class STOrderListPageViewController: SMBasePageViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        title = "进货订单"
        
        self.setStyle_shenmaEV()

        let allVC = STOrderListViewController(type: .all)
        let payingVC = STOrderListViewController(type: .paying)
        let awaitingVehicleVC = STOrderListViewController(type: .finished)
        let canceledVC = STOrderListViewController(type: .canceled)
        
        pageBar.itemTitle = ["全部", "待付款", "付款完成", "已取消"]
        setViewControllers([allVC, payingVC, awaitingVehicleVC, canceledVC], index: 0)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        SMAnalyticTool.beginLogView("进货订单")
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        SMAnalyticTool.endLogView("进货订单")
    }
    
    /// 设置默认样式
    func setStyle_shenmaEV() {
        pageBar.normalColor = UIColor(netHex: 0x9b9b9b)
        pageBar.selectedColor = UIColor(netHex: 0x000000)
        pageBar.lineColor = UIColor(netHex: 0xffe600)
        pageBar.lineWidth = 40
        scrollViewInset = UIEdgeInsetsMake(pageBarHeight, 0, 0, 0)
    }
    
}
