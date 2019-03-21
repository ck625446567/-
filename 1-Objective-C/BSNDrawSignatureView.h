//
//  STCarListModel.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2018/5/13.
//  Copyright © 2019年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>

@class BSNDrawSignatureView;

@protocol BSNDrawSignatureViewDelegate <NSObject>

@optional
- (void)drawSignatureViewNeedExtenWidth:(BSNDrawSignatureView *)view;

@end

@interface BSNDrawSignatureView : UIView

@property (nonatomic, weak)id <BSNDrawSignatureViewDelegate> delegate;
@property (nonatomic, strong) UIColor *lineColor;
@property (nonatomic) CGFloat lineWidth;
@property (nonatomic) BOOL fixedWidth;
@property (nonatomic, getter = isEmpty) BOOL empty;

- (void)setFixedLineWidth:(BOOL)fixed;
- (void)clear;
- (UIImage *)getImage;
- (void)setImage:(UIImage *)image;
//签名图片截取
-(UIImage *)cropSignature:(UIImage *)image;


@end


