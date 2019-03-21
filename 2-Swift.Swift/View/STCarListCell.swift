//
//  STCarListCell.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2019/3/12.
//  Copyright © 2019年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

class STCarListCell: UITableViewCell {
     /// 车辆编号
    @IBOutlet weak var codeLabel: UILabel!
     /// 状态
    @IBOutlet weak var statusLabel: UILabel!
     /// 物流icon
    @IBOutlet weak var logisticsIconImageView: UIImageView!
     /// 物流描述
    @IBOutlet weak var logisticsDescLabel: UILabel!
     /// 物流时间
    @IBOutlet weak var logisticsTimeLabel: UILabel!
     /// 车辆图片
    @IBOutlet weak var carImageView: UIImageView!
     /// 车辆型号
    @IBOutlet weak var carModelLabel: UILabel!
     /// 版本信息
    @IBOutlet weak var versionInfoLabel: UILabel!
    /// 配置信息
    @IBOutlet weak var configInfoLabel: UILabel!
    /// 签收按钮所在view
    @IBOutlet weak var bottomView: UIView!
    
    /// 签收按钮所在view高度
    @IBOutlet weak var bottomViewHeightConstraint: NSLayoutConstraint!
    
    /// 签收按钮
    @IBOutlet weak var signBtn: UIButton!
    
    var onReceiveBtnClick: (() -> Void)?
    
    @IBAction func signBtnClicked(_ sender: Any) {
        onReceiveBtnClick?()
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        
        signBtn.layer.cornerRadius = 12
        signBtn.layer.borderColor = #colorLiteral(red: 0.3621281683, green: 0.3621373773, blue: 0.3621324301, alpha: 1).cgColor
        signBtn.layer.borderWidth = 1
    }
    
    func configModel(model: STCarListModel?) {
        
        guard let model = model else {
            return
        }
        
        codeLabel.text = model.codeText
        statusLabel.text = model.statusText
        logisticsIconImageView.image = model.logisticsIconImage
        logisticsDescLabel.text = model.logisticsDescText
        logisticsTimeLabel.text = model.logisticsTimeText
        versionInfoLabel.text = model.versionText
        carModelLabel.text = model.carModelText
        
        carImageView.image = nil
        if let url = URL(string: model.carInfo?.picUrl ?? "") {
            carImageView.sd_setImage(with: url)
        }
        
        bottomView.isHidden = model.isBottomViewHidden
        bottomViewHeightConstraint.constant = model.bottomViewHeight
        
    }
}
