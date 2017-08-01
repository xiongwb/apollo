# App前端系统


## 运行方法

### windows + android 4.x 或 mac + android 4.x
```
git clone https://git.coding.net/mahaomahao/apollo.git
cd apollo
npm install
react-native run-android

# 需要确保手机和电脑在同一个局域网
# 手机进入 app,晃动手机选择 dev setting -> Debug server host & port for device 设置本机IP+8081
# 比如本机IP是 192.168.2.233 那么就需要填写 192.168.2.233:8081
```

### windows + android 5.x(国产手机)
```
git clone https://git.coding.net/mahaomahao/apollo.git
cd apollo
npm install
run_android.bat

# 需要确保手机和电脑在同一个局域网
```

### mac + android 5.x(国产手机)
```
git clone https://git.coding.net/mahaomahao/apollo.git
cd apollo
npm install
./run_android

# 需要确保手机和电脑在同一个局域网
```

### mac + iphone虚拟机
```
git clone https://git.coding.net/mahaomahao/apollo.git
cd apollo
npm install
react-native run-ios
```

### mac+iphone手机（ios10+）
教程如下：
https://coding.net/u/pimgeek/p/scrolls/git/blob/master/iphone手机运行说明.md


## 项目代码说明
[项目代码说明](项目代码说明.md)