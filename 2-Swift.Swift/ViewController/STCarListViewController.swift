//
//  STCarListViewController.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2019/3/12.
//  Copyright © 2019年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit
import SnapKit
import MJRefresh
import ReactNativeShenmaMini

let kSTCarListCellId = "STCarListCellId"
class STCarListViewController: SMPreViewController  {

    var tableView: UITableView?
    
    var viewModel: STCarListViewModel = STCarListViewModel()
    
    convenience init(type: STCarListViewModelType) {
        self.init()
        viewModel.type = type
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        configTableview()
//        self.tableView.mj_header.beginRefreshing()
        
        viewModel.delegate = self
//        viewModel.listDelegate = self
        
        tableView?.reloadData()
    }
    
    func configTableview() {
        let tableView = UITableView.init(frame: CGRect.zero, style: UITableViewStyle.grouped)
        
        tableView.delegate = self

        tableView.estimatedRowHeight = 100
        
        tableView.emptyViewDataSource = self

        tableView.emptyViewDelegate = self
        
        tableView.dataSource = self

        tableView.tableFooterView = UIView()

        tableView.register(UINib(nibName: "STCarListCell", bundle: nil), forCellReuseIdentifier: kSTCarListCellId)

        tableView.mj_header = MJRefreshNormalHeader.init(refreshingTarget: self, refreshingAction: #selector(refresh))

        tableView.mj_footer = MJRefreshAutoNormalFooter.init(refreshingTarget: self.viewModel, refreshingAction: #selector(STCarListViewModel.loadMoreData))

        self.view.addSubview(tableView)
        self.autoManagerScrollView = tableView
        
        tableView.snp.makeConstraints { (make) in
            make.edges.equalToSuperview()
        }
        
        self.tableView = tableView
    }
    
    func refresh() {
        self.tableView?.mj_footer.resetNoMoreData()
        self.viewModel.getData()
    }
    
    override func sourceDataAlter(_ flag: Int) {
        self.tableView?.reloadData()

        if flag == 0 {
            self.tableView?.reloadEmptyData()
        } else {
            self.tableView?.reloadData("st_sc_error")
        }
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        refresh()
    }
}

extension STCarListViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return viewModel.rawData.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: kSTCarListCellId, for: indexPath) as! STCarListCell
        
        let model = viewModel.rawData[indexPath.row]
        cell.configModel(model: model)
        cell.onReceiveBtnClick = {[weak self] in
            //点击签收车辆按钮 跳转到扫码入库
                let scan = STInventoryScanViewController()
                self?.navigationController?.pushViewController(scan, animated: true)
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let model = viewModel.rawData[indexPath.row]
        
        guard let id = model.carInfo?.id else {
            showMessage("车辆id为空！")
            return
        }

        //跳转到车辆详情页面
         SMMiniApi.openMini(byId: "ShenmaEV_RN_Order", params: ["page": "car_detail", "params": ["carId": id]])
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 0.1
    }
    
    func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 0.1
    }
    
}


extension STCarListViewController: KKEmptyViewDataSource, KKEmptyViewDelegate {
    
    func imageForemptyDataView(_ view: UIView, id: String) -> UIImage? {
        if id == "st_sc_error" {
            return UIImage(named: "st_sc_list_error")
        }
        return UIImage(named: "pic_dingdan")
    }
    
    func imageTintColorForemptyDataView(_ view: UIView, id: String) -> UIColor? {
        
        return id == "st_sc_error" ? nil : #colorLiteral(red: 0.8767463937, green: 0.8854270511, blue: 0.8854270511, alpha: 1)
    }
    
    func titleForemptyDataView(_ view: UIView, id: String) -> NSAttributedString? {
        if id == "st_sc_error" {
            return NSAttributedString.init(string: "遇到一个问题，请刷新重试", attributes: [NSForegroundColorAttributeName: UIColor.color9B(), NSFontAttributeName: UIFont.systemFont(ofSize: 14)])
        }
        return NSAttributedString.init(string: "暂无任何进货订单", attributes: [NSForegroundColorAttributeName: UIColor.color9B(), NSFontAttributeName: UIFont.systemFont(ofSize: 14)])
    }
    
    func buttonBackgroundImageForemptyDataView(_ view: UIView, forState state: UIControlState, id: String) -> UIImage? {
        return UIImage(named: "st_sc_yellow")?.resizableImage(withCapInsets: UIEdgeInsets.init(top: 0, left: 60, bottom: 0, right: 60), resizingMode: UIImageResizingMode.stretch)
    }
    
    func buttonTitleForemptyDataView(_ view: UIView, forState state: UIControlState, id: String) -> NSAttributedString? {
        if id == "st_sc_error" {
            return NSAttributedString.init(string: "请重试", attributes: [NSForegroundColorAttributeName: UIColor.black, NSFontAttributeName: UIFont.systemFont(ofSize: 20)])
        }
        return nil
    }
    
    func emptyDataView(_ view: UIView, didTapButton button: UIButton, id: String) {
        if id == "st_sc_error" {
            self.tableView?.mj_header.beginRefreshing()
            return
        }
        NotificationCenter.default.post(name: NSNotification.Name.AlterTabBarToRootViewController, object: nil)
    }
}

