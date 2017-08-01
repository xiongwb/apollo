//
//  NSKeyViewManager.m
//  keyboard
//
//  Created by Tinklin on 2017/5/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "NSKeyViewManager.h"
#import <NKeyBoard/NKeyBoardTextField.h>

#import "NSKeyView.h"
@interface NSKeyViewManager ()
@property (nonatomic,retain)NSKeyView *keyView;
@end

@implementation NSKeyViewManager
RCT_EXPORT_MODULE(NSKeyboard)
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(size, NSArray)

- (UIView *)view
{
  _keyView = [[NSKeyView alloc]initWithFrame:CGRectMake(0, 0, 0, 0)];
  return _keyView;

}

RCT_EXPORT_METHOD(getTextField:(RCTResponseSenderBlock)callback)
{
  NSLog(@"%@",[_keyView.textField getNKeyboardText]);
  NSString *text = [_keyView.textField getNKeyboardText];
  callback(@[[NSNull null],text]);
  
}

@end
