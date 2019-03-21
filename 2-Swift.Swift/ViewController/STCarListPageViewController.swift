//
//  STCarListPageViewController.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2019/3/12.
//  Copyright © 2019年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

class STCarListPageViewController: SMBasePageViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        title = "进货车辆"
        
        self.setStyle_shenmaEV()
        
        let allVC = STCarListViewController(type: .all)
        let awaitingDeliverVC = STCarListViewController(type: .awaitingDeliver)
        let awaitingReceiveVC = STCarListViewController(type: .awaitingReceive)
        let receivedVC = STCarListViewController(type: .received)
        let canceledVC = STCarListViewController(type: .canceled)
        
        pageBar.itemTitle = ["全部", "待发货", "待签收", "已签收", "已退订"]
        setViewControllers([allVC, awaitingDeliverVC, awaitingReceiveVC, receivedVC, canceledVC], index: 0)
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
