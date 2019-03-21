//
//  STOrderListViewController.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2018/6/21.
//  Copyright © 2018年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

import MJRefresh

import KKHint

import SMJRAlertView

import ReactNativeShenmaMini

class STOrderListViewController: SMPreViewController, UITableViewDelegate, UITableViewDataSource, STOrderListViewModelDelegate {
    
    var payManager: STPayManager?
    
    var tableView: UITableView!
    
    var viewModel: STOrderListViewModel = STOrderListViewModel()
    
    var intentionalGoldAlertEnsure: (()->Void)?
    
    convenience init(type: STOrderListViewModelType) {
        self.init()
        viewModel.type = type
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        
        self.title = "进货订单"
        
        self.viewModel.delegate = self
        self.viewModel.listDelegate = self
        
        self.edgesForExtendedLayout = UIRectEdge()
        
        self.tableView = UITableView.init(frame: self.view.bounds, style: UITableViewStyle.grouped)
        
        self.tableView.delegate = self
        
        self.tableView.emptyViewDataSource = self
        
        self.tableView.emptyViewDelegate = self
        
        self.tableView.dataSource = self
        
        self.tableView.tableFooterView = UIView()
        
        self.view.addSubview(self.tableView)
        
        self.autoManagerScrollView = self.tableView
        
        // 物流
        self.tableView.register(UINib.init(nibName: "STOrderListLogisticsCell", bundle: nil), forCellReuseIdentifier: STOrderListLogisticsCellId)
        
        // 订单状态
        self.tableView.register(UINib.init(nibName: "STOrderListStatusCell", bundle: nil), forCellReuseIdentifier: STOrderListStatusCellId)
        
        // 列表
        self.tableView.register(STOrderListVehicleListCell.classForCoder(), forCellReuseIdentifier: STOrderListVehicleListCellId)
        
        // 定金
        self.tableView.register(UINib.init(nibName: "STOrderListOrderAmountCell", bundle: nil), forCellReuseIdentifier: STOrderListOrderAmountCellId)
        
        // 功能按钮
        self.tableView.register(STOrderListFuncCell.classForCoder(), forCellReuseIdentifier: STOrderListFuncCellId)
        
        // self.navigationItem.rightBarButtonItem = UIBarButtonItem.init(title: "客服", style: UIBarButtonItemStyle.plain, target: self.viewModel, action: #selector(STOrderListViewModel.phoneCall))
        
        self.tableView.mj_header = MJRefreshNormalHeader.init(refreshingTarget: self, refreshingAction: #selector(refresh))
        
        self.tableView.mj_footer = MJRefreshAutoNormalFooter.init(refreshingTarget: self.viewModel, refreshingAction: #selector(STOrderListViewModel.loadMoreData))
        
        self.tableView.mj_header.beginRefreshing()
    }
    
    
    func refresh() {
        self.tableView.mj_footer.resetNoMoreData()
        self.viewModel.getData()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.refresh()
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        self.tableView.frame = self.view.bounds
    }
    
    /// 支付上牌保证金
    func payLicencePlate(orderNo: String, feeType: String) {
        navigationController?.pushViewController(STPayDepositViewController(feeType: feeType), animated: true)
    }
    
    /// 再次购买
    func buyAgain() {
        let alert = STAlertController.init(title: "该功能暂未实现",
                               message: nil,
                               actions: [STAlertAction.init(title: "知道了", type: STAlertActionType.default, handler: nil)])
        self.present(alert, animated: true, completion: nil)
    }
    
    override func sourceDataAlter(_ flag: Int) {
        self.tableView.reloadData()
        self.navigationItem.rightBarButtonItem?.isEnabled = !self.viewModel.data.isEmpty
        if flag == 0 {
            self.tableView.reloadEmptyData()
        } else {
            self.tableView.reloadData("st_sc_error")
        }
    }
    
    override func showMessage(_ message: String?) {
        guard let m = message else { return }
        self.view.hiddenActivity()
        self.view.makeHintBlowNaviBar(title: m)
    }
}

extension STOrderListViewController: STPayDelegate {
    
    func orderPay(model: STPayModel) {
        model.sourceVC = self
        model.delegate = self
        self.payManager = STPayManager()
        self.payManager?.orderPay(payModel: model)
    }
    
    func onResp(resp: STPayResp) {
        self.refresh()
        if resp.result == .cancel || resp.payWay == .credit {
            self.jumpDetail(orderNo: resp.orderNo)
        } else {
            let result = STOrderPayResultViewController.init(resp: resp)
            self.navigationController?.pushViewController(result, animated: true)
        }
    }
    
    /// 跳转到订单详情
    func jumpDetail(orderNo: String) {
        let detail = STOrderListDetailViewController.init(orderNo: orderNo)
        self.navigationController?.pushViewController(detail, animated: true)
    }
}

extension STOrderListViewController {
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return self.viewModel.data.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.viewModel.data[section].count
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return self.viewModel.modelAtIndex(indexPath: indexPath)?.rowHeight ?? 0
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 10
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        guard let model = self.viewModel.modelAtIndex(indexPath: indexPath) else {
            return UITableViewCell()
        }
        
        let cell: STOrderListBaseCell = tableView.dequeueReusableCell(withIdentifier: model.cellReuseId, for: indexPath) as! STOrderListBaseCell
        
        cell.showData(data: model)
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let orderNo = self.viewModel.rawData[indexPath.section].orderInfo.orderNo else {
            self.showMessage("未获取到订单号(0)")
            return
        }
        let detail = STOrderListDetailViewController.init(orderNo: orderNo)
        self.navigationController?.pushViewController(detail, animated: true)
        // self.present(detail, animated: true, completion: nil)
    }
}

extension STOrderListViewController: KKEmptyViewDataSource, KKEmptyViewDelegate {
    
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
            self.tableView.mj_header.beginRefreshing()
            return
        }
        NotificationCenter.default.post(name: NSNotification.Name.AlterTabBarToRootViewController, object: nil)
    }
}







