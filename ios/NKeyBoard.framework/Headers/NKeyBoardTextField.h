//
//  NKeyBoardTextField.h
//  JMKeyBoard
//
//  Created by YYH on 16/9/23.
//  Copyright © 2016年 爱加密. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSUInteger, NKeyBoardConstant) {
    /** 字母键盘 */
    NKeyBoard_LETTERS_KEYBOARD = 0,
    /** 数字键盘 */
    NKeyBoard_NUM_KEYBOARD
};

@interface NKeyBoardTextField : UITextField

/**
 *  获取文本
 *
 *  @return 返回当前NKeyBoardTextField对象的值
 */
- (NSString *)getNKeyboardText;

/**
 *  清空文本
 */
- (void) clearNkeyboard;

/**
 *  隐藏键盘
 */
- (void) hideNKeyboard;

/**
 *  设置键盘按键是否随机显示
 *
 *  @param isLetterRandom YES:字母键盘随机; NO:字母键盘不随机;
 *  @param isNumRandom    YES:数字键盘随机; NO:数字键盘不随机;
 */
- (void) setNKeyNoRandomLetter:(BOOL)isLetterRandom num:(BOOL)isNumRandom;

/**
 *  设置键盘模式：数字键盘和字母键盘
 *
 *  @param type设置为NKeyBoard_LETTERS_KEYBOARD时表示是字母键盘，type设置为NKeyBoard_NUM_KEYBOARD 时表示是数字键盘，默认设置为NKeyBoard_LETTERS_KEYBOARD
 */
- (void) setNkeyboardType:(NKeyBoardConstant)type;

/**
 *  设置安全键盘名称
 *
 *  @param name 安全键盘名称
 */
- (void) setNKeyboardTitle:(NSString *)name;

@end
