//
//  STCarListModel.swift
//  ShenmaEV
//
//  Created by 陈凯 on 2018/5/13.
//  Copyright © 2019年 SHENMA NETWORK TECHNOLOGY (SHANGHAI) Co.,Ltd. All rights reserved.
//
#import "BSNDrawSignatureView.h"
#import <QuartzCore/QuartzCore.h>

@interface BSNDrawSignatureView ()  {
@private
    CGPoint currentPoint;
    CGPoint previousPoint1;
    CGPoint previousPoint2;
}

@end


static NSUInteger const LENGTH_LIMIT = 8;
static CGFloat const CLAMP_MAX = 6;
static CGFloat const CLAMP_MIN = 1.5;
static CGFloat const SPEED_MULTIPLIER = 500;

CGPoint midPoint(CGPoint p1, CGPoint p2) {
    return CGPointMake((p1.x + p2.x) * 0.5, (p1.y + p2.y) * 0.5);
}

CGFloat distanceBetweenPoints(CGPoint p1, CGPoint p2) {
    return sqrt(pow((p2.x - p1.x), 2.0) + pow((p2.y - p1.y), 2.0));
}

CGFloat clamp(CGFloat value, CGFloat max, CGFloat min) {
    CGFloat result = value;
    if (value > max) {
        result = max;
    } else if (value < min) {
        result = min;
    }
    return result;
}

@interface NSMutableArray (averages)

- (CGFloat)meanValue;
- (void)addObject:(id)anObject lengthLimit:(NSUInteger)limit;

@end

@interface BSNDrawSignatureView ()
@property (nonatomic) BOOL clearOnRedraw;
@property (nonatomic, strong) UIImage *currentImage;
@property (nonatomic, strong) UIImage *nextImage;
@property (nonatomic, strong) NSDate *lastTouch;
@property (nonatomic, strong) NSMutableArray *touchSpeeds;

@end

@implementation BSNDrawSignatureView

- (void)awakeFromNib {
    [super awakeFromNib];
    self.touchSpeeds = [NSMutableArray arrayWithCapacity:LENGTH_LIMIT];
    self.lineColor = [UIColor blackColor];
    self.empty = YES;
    [self initializeTouchSpeeds];
}

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.touchSpeeds = [NSMutableArray arrayWithCapacity:LENGTH_LIMIT];
        self.lineColor = [UIColor blackColor];
        self.empty = YES;
        [self initializeTouchSpeeds];
    }
    return self;
}

- (void)initializeTouchSpeeds {
    [self.touchSpeeds removeAllObjects];
    CGFloat initValue = ((CLAMP_MAX - CLAMP_MIN) * 0.5) + CLAMP_MIN;
    for (NSUInteger i = 0; i < LENGTH_LIMIT; i++) {
        [self.touchSpeeds addObject:[NSNumber numberWithFloat:initValue] lengthLimit:LENGTH_LIMIT];
    }
}

- (void)setFixedLineWidth:(BOOL)fixed {
    self.lineWidth = 3;
    self.fixedWidth = fixed;
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    [super touchesBegan:touches withEvent:event];
    if (!self.fixedWidth) {
        [self initializeTouchSpeeds];
        self.lastTouch = [NSDate date];
    }
    UITouch *touch = [touches anyObject];
    
    previousPoint1 = [touch previousLocationInView:self];
    previousPoint2 = [touch previousLocationInView:self];
    currentPoint = [touch locationInView:self];
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    [super touchesMoved:touches withEvent:event];
    [self renderTouchToScreen:[touches anyObject]];
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
    [super touchesEnded:touches withEvent:event];
    [self renderTouchToScreen:[touches anyObject]];
    [self widthToFit:[touches anyObject]];
}


- (void)renderTouchToScreen:(UITouch *)touch {
    previousPoint2  = previousPoint1;
    previousPoint1  = [touch previousLocationInView:self];
    currentPoint    = [touch locationInView:self];
    
    if (!self.fixedWidth) {
        NSDate *currentTouch = [NSDate date];
        NSTimeInterval timeInterval = [currentTouch timeIntervalSinceDate:self.lastTouch];
        CGFloat distance = distanceBetweenPoints(currentPoint, previousPoint1);
        CGFloat speed = distance/timeInterval;
        CGFloat clampedSpeed = clamp(SPEED_MULTIPLIER/speed, CLAMP_MAX, CLAMP_MIN);
        [self.touchSpeeds addObject:[NSNumber numberWithFloat:clampedSpeed] lengthLimit:LENGTH_LIMIT];
        self.lineWidth = [self.touchSpeeds meanValue];
        self.lastTouch = currentTouch;
    }
    // calculate mid point
    CGPoint mid1    = midPoint(previousPoint1, previousPoint2);
    CGPoint mid2    = midPoint(currentPoint, previousPoint1);
    
    CGMutablePathRef path = CGPathCreateMutable();
    CGPathMoveToPoint(path, NULL, mid1.x, mid1.y);
    CGPathAddQuadCurveToPoint(path, NULL, previousPoint1.x, previousPoint1.y, mid2.x, mid2.y);
    CGRect bounds = CGPathGetBoundingBox(path);
    CGPathRelease(path);
    
    CGRect drawBox = bounds;
    
    //Pad our values so the bounding box respects our line width
    drawBox.origin.x        -= self.lineWidth * 2;
    drawBox.origin.y        -= self.lineWidth * 2;
    drawBox.size.width      += self.lineWidth * 4;
    drawBox.size.height     += self.lineWidth * 4;
    
    /* 2019.3.15
     原代码此处会在3x屏手机上造成drawRect 方法死循环,
     解决方式:(目前采用方式1)
     1. 2x屏无需执行以下if中的代码.
     2. 把下面的设置刷新layer的方法放在延迟函数闭包中执行. (不知道为什么这样可以)
     */
    CGFloat scale = [UIApplication sharedApplication].keyWindow.screen.scale;
    if (scale == 2) {
        UIGraphicsBeginImageContextWithOptions(drawBox.size, YES, 0);
        [self.layer renderInContext:UIGraphicsGetCurrentContext()];
        UIGraphicsEndImageContext();
    }
    //    dispatch_after(DISPATCH_TIME_NOW, dispatch_get_main_queue(), ^{
    //        self.empty = NO;
    //        [self setNeedsDisplayInRect:drawBox];
    //    });
    self.empty = NO;
    [self setNeedsDisplayInRect:drawBox];
}

- (void)drawRect:(CGRect)rect {
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (self.clearOnRedraw) {
        CGContextSetFillColorWithColor(context, [UIColor clearColor].CGColor);
        
        // draw the filled rectangle
        CGContextFillRect (context, self.bounds);
        self.clearOnRedraw = NO;
        if (self.nextImage) {
            [self.nextImage drawInRect:self.bounds];
            self.empty = NO;
            self.nextImage = nil;
        }
    } else {
        CGPoint mid1 = midPoint(previousPoint1, previousPoint2);
        CGPoint mid2 = midPoint(currentPoint, previousPoint1);
        
        [self.layer renderInContext:context];
        
        CGContextMoveToPoint(context, mid1.x, mid1.y);
        // Use QuadCurve is the key
        CGContextAddQuadCurveToPoint(context, previousPoint1.x, previousPoint1.y, mid2.x, mid2.y);
        
        CGContextSetLineCap(context, kCGLineCapRound);
        CGContextSetLineWidth(context, self.lineWidth);
        CGContextSetStrokeColorWithColor(context, self.lineColor.CGColor);
        
        CGContextStrokePath(context);
    }
}

- (void)clear {
    self.empty = YES;
    self.clearOnRedraw = YES;
    [self setNeedsDisplay];
}

- (void)widthToFit:(UITouch *)touch {
    
    CGPoint point = [touch locationInView:self.superview.superview];
    
    if (point.x > self.superview.superview.frame.size.width - 100) {
        
        [self.delegate drawSignatureViewNeedExtenWidth:self];
    }
}

- (UIImage *)getImage {
    if (self.empty) {
        return nil;
    }
    UIGraphicsBeginImageContext(self.bounds.size);
    [self.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *result = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return result;
}

- (void)setImage:(UIImage *)image {
    self.nextImage = image;
    [self clear];
}

//签名图片截取
-(UIImage *)cropSignature:(UIImage *)image {
    NSData *pngData = UIImagePNGRepresentation(image);
    UIImage *tempImage = [UIImage imageWithData:pngData];
    CGImageRef imageRefWithTransparency = [tempImage CGImage];
    CGDataProviderRef provider = CGImageGetDataProvider(imageRefWithTransparency);
    NSData* data = (__bridge_transfer NSData *)CGDataProviderCopyData(provider);
    const uint8_t* newBytes = [data bytes];
    size_t bpr = CGImageGetBytesPerRow(imageRefWithTransparency);
    size_t bpp = CGImageGetBitsPerPixel(imageRefWithTransparency);
    size_t bpc = CGImageGetBitsPerComponent(imageRefWithTransparency);
    size_t bytes_per_pixel = bpp / bpc;
    size_t width = CGImageGetWidth(imageRefWithTransparency);
    size_t height = CGImageGetHeight(imageRefWithTransparency);
    NSInteger columnTotals[width];
    NSInteger rowTotals[height];
    for (NSInteger i = 0; i < width; i++) {
        columnTotals[i] = 0;
    }
    for (NSInteger i = 0; i < height; i++) {
        rowTotals[i] = 0;
    }
    for (size_t curRow = 0; curRow < height; curRow++) {
        for (size_t curCol= 0; curCol < width; curCol++) {
            const uint8_t* pixel =
            &newBytes[curRow * bpr + curCol * bytes_per_pixel];
            if (pixel[0] != 255 || pixel[1] != 255 || pixel[2] != 255) {
                columnTotals[curCol] += 1;
                rowTotals[curRow] += 1;
            }
        }
    }
    NSRange rowRange = MakeRange(rowTotals, height);
    NSRange columnRange = MakeRange(columnTotals, width);
    
    CGRect cropBounds = CGRectMake(columnRange.location,rowRange.location, columnRange.length, rowRange.length);
    
    CGImageRef croppedImageRef = CGImageCreateWithImageInRect(imageRefWithTransparency, cropBounds);
    
    UIImage *croppedImage = [UIImage imageWithCGImage:croppedImageRef];
    if (croppedImageRef == NULL) {
        return nil;
    }
    CFRelease(croppedImageRef);
    return croppedImage;
}

NSRange MakeRange(NSInteger* sumArray, NSInteger length) {
    NSInteger cropStart = 0;
    NSInteger cropEnd = 0;
    NSInteger total = 0;
    for (NSInteger i = 0; i < length; i++) {
        if (total != 0 && cropStart == 0) {
            cropStart = i - 1;
        }
        NSInteger newTotal = total + sumArray[i];
        if (newTotal != total) {
            cropEnd = i;
        }
        total = newTotal;
    }
    return NSMakeRange(cropStart, cropEnd-cropStart+1);
}

@end

@implementation NSMutableArray (averages)

- (CGFloat)meanValue {
    CGFloat result = 0;
    for (NSNumber *num in self) {
        result += [num floatValue];
    }
    return result/[self count];
}

- (void)addObject:(id)anObject lengthLimit:(NSUInteger)limit {
    [self addObject:anObject];
    if ([self count] > limit) {
        [self removeObjectAtIndex:0];
    }
}

@end
