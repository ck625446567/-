//
//  STOrderCarViewController.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2019/3/12.
//  Copyright © 2019年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

class STOrderCarViewController: UIViewController {

    lazy var titleSegmentControl: UISegmentedControl = {
        let segment = UISegmentedControl(items: ["进货订单", "进货车辆"])
        
        segment.tag = 200
        
        segment.frame = CGRect(x: 0, y: 0, width: 140, height: 32)
        
        segment.setBackgroundImage(#imageLiteral(resourceName: "whiteColor1px"), for: .normal, barMetrics: UIBarMetrics.default)
        segment.setBackgroundImage(#imageLiteral(resourceName: "themeColor1px"), for: .selected, barMetrics: UIBarMetrics.default)
        segment.setBackgroundImage(#imageLiteral(resourceName: "whiteColor1px"), for: .highlighted, barMetrics: UIBarMetrics.default)

        segment.tintColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        
        segment.layer.cornerRadius = 4
        segment.layer.masksToBounds = true
        segment.layer.borderWidth = 1
        segment.layer.borderColor = #colorLiteral(red: 0.8, green: 0.8, blue: 0.8, alpha: 1).cgColor
        
        segment.setTitleTextAttributes([NSFontAttributeName: UIFont.systemFont(ofSize: 12), NSForegroundColorAttributeName: #colorLiteral(red: 0.6078431373, green: 0.6078431373, blue: 0.6078431373, alpha: 1)], for: .normal)
        segment.setTitleTextAttributes([NSFontAttributeName: UIFont.systemFont(ofSize: 14), NSForegroundColorAttributeName: #colorLiteral(red: 0, green: 0, blue: 0, alpha: 1)], for: .selected)

        segment.addTarget(self, action: #selector(segmentValueChanged(sender:)), for: .valueChanged)
        segment.selectedSegmentIndex = 0
        return segment
    }()
    
    lazy var orderListVC: STOrderListPageViewController = {
        let vc = STOrderListPageViewController()
        return vc
    }()
    
    lazy var carListVC: STCarListPageViewController = {
        let vc = STCarListPageViewController()
        return vc
    }()
    
    func segmentValueChanged(sender: UISegmentedControl) {
        
        showViewController(sender.selectedSegmentIndex)
    }
    
    convenience init(orderVcPageIndex: Int) {
        self.init()
        orderListVC.setScrollViewScrollToIndex(orderVcPageIndex)
    }
    
    convenience init(carVcPageIndex: Int) {
        self.init()
        showViewController(1)
        titleSegmentControl.selectedSegmentIndex = 1
        carListVC.setScrollViewScrollToIndex(carVcPageIndex)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        addChildViewControllers()
        
        navigationItem.titleView = titleSegmentControl
        
        showViewController(0)

    }
    
    func addChildViewControllers() {
        addChildViewController(orderListVC)
        addChildViewController(carListVC)
    }
    
    func showViewController(_ index: Int) {
        if index == 0 {
            orderListVC.view.frame = view.bounds
            view.addSubview(orderListVC.view)
            view.sendSubview(toBack: carListVC.view)
        } else if index == 1 {
            carListVC.view.frame = view.bounds
            view.addSubview(carListVC.view)
            view.sendSubview(toBack: orderListVC.view)
        }
    }

}
