# unusewxss  

unusewxss用于快速查找微信小程序页面中wxss中声明的类样式在wxml中未使用的样式类，协助微信小程序删除多余无用的样式

## Installation
```
git clone https://github.com/momobeizi/unusewxss.git

npm install
```
## Examples
```js
 // 编辑index.js中的wxssPath,wxssPath路径
 //注意/**/*.wxss不需要修改，只修改前面的文件路径

 const wxssPath = 'E:/xxxx/wx-xxx/pages/**/*.wxss'; // wxss文件的路径
 const wxmlPath = 'E:/xxxx/wx-xxx/pages/**/*.wxml'; // wxml文件的路径
 
 // 执行
 node index.js
```
## Output
```
第1个没有使用的类名: test  所在目录： E:\xxxx\wx-xxx\pages\xxxxx\index.wxss
第2个没有使用的类名: name  所在目录： E:\xxxx\wx-xxx\pages\xxxxx\index.wxss
```