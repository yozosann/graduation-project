## 简介
该项目为本人大连理工大学软件学院2017年毕业设计项目《基于Vue实现的外卖商家子系统的设计与实现》。客户端为eleme商家系统的实现本人自己重写了一遍，以及状态管理使用了Vuex，自己添加了一个后台和商家信息管理系统。

## 运行方法

### 条件
* node环境
* mongodb环境

```
# 创建数据库
cd server
cd db
# 打开bulid-db.js解开注释部分
node bulid-db.js

# 运行后台
cd server
npm install
node app.js

# 运行客户端
cd client
# 这里建议运行后关闭页面（页面只有框架没有信息）
npm install
npm run dev

# 运行信息管理系统
cd sell-db-manage
npm install
npm run dev

# 此时信息管理系统已运行，可以点击页面上 '进入当前商家界面' 按钮进入客户端查看商家页面
# 搜索框可以输入任意字符删除后查看所有商家信息
```

## 毕设&答辩ppt
draft里放有相关文档内容

## 声明
不建议直接抄袭使用，可以借鉴