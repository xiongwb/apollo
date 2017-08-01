//
//  NSKeyView.h
//  keyboard
//
//  Created by Tinklin on 2017/5/5.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

#import <React/RCTComponent.h>
#import <React/UIView+React.h>

#import <NKeyBoard/NKeyBoardTextField.h>

@interface NSKeyView : UIView
@property (strong, nonatomic) NKeyBoardTextField *textField;
@property (nonatomic,copy) NSString *placeholder;
@property (nonatomic,copy)NSArray *size;
@end
