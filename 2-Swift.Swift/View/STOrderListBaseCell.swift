//
//  STOrderListBaseCell.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2018/6/21.
//  Copyright © 2018年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

import UIKit

let STOrderThemeRedColor: UIColor = UIColor.init(hexString: "#d4493b")!

let STOrderThemeYellowColor: UIColor = UIColor.yellow

protocol STOrderListCellProtocol: class {
    
    var rowHeight: CGFloat { get }
}

class STOrderListBaseCell: UITableViewCell {

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    func showData(data: STOrderListCellProtocol) {
        
    }
    
    /// 行高
    class func heightByData(data: STOrderListCellProtocol?) -> CGFloat {
        return 44
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
