//
//  NSKeyView.m
//  keyboard
//
//  Created by Tinklin on 2017/5/5.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "NSKeyView.h"
#import <NKeyBoard/NKeyBoardTextField.h>
#define SCREEN_WIDTH ([UIScreen mainScreen].bounds.size.width)
#define SCREEN_HEIGHT ([UIScreen mainScreen].bounds.size.height)


@implementation NSKeyView

- (instancetype) initWithFrame:(CGRect)frame{
  if ((self = [super initWithFrame:frame])) {
    NSLog(@"搜");
    self.textField = [[NKeyBoardTextField alloc] initWithFrame:CGRectMake(0, 0, 200, 30)];
    [self.textField setSecureTextEntry:NO];
    [self.textField setBorderStyle:NO];
    [self.textField setNkeyboardType:NKeyBoard_NUM_KEYBOARD];
    [self.textField setNKeyboardTitle:@"投融资安全键盘"];
    [self.textField setClearButtonMode:UITextFieldViewModeWhileEditing];
    [self.textField setNKeyNoRandomLetter:YES num:YES];
    [self addSubview:self.textField];
      }
  return self;
}

- (void)setPlaceholder:(NSString *)placeholder {
  [self.textField setPlaceholder:placeholder];
}

- (void)setSize:(NSArray *)size {
  float width = [size[0] floatValue];
  float height = [size[1] floatValue];
  self.textField.frame = CGRectMake(0, 0, width, height);
//
}

#pragma mark- UITextFieldDelegate
- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
  if (range.length == 0 && [self.textField.text length] > 10) {
    return NO;
  }
  return YES;
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

@end
