const fs = require('fs');
const glob = require('glob');

const wxssPath = 'E:/xxxx/wx-xxx/pages/**/*.wxss'; // wxss文件的路径
const wxmlPath = 'E:/xxxx/wx-xxx/pages/**/*.wxml'; // wxml文件的路径

const wxssFiles = glob.sync(wxssPath); // 获取所有的wxss文件
const wxmlFiles = glob.sync(wxmlPath); // 获取所有的wxml文件

const wxssClassMap = {}; // 存放wxss中出现的类名和对应的文件名
const wxmlClassMap = {}; // 存放wxml中使用的类名和对应的文件名
const unusedClasses = {}; // 存放未被使用的类名和对应的文件名

// console.log(wxssFiles)
// console.log(wxmlFiles)

wxssFiles.forEach(function (file) {
  const content = fs.readFileSync(file, 'utf8');
  let classes = content.match(/\.([\w\d-]+)(?=[^{}]*\{[^{}]*\})/g);
  if (classes) {
    classes = classes.map(function (cls) {
      return cls.replace(/^\./, '');
    });
    wxssClassMap[file] = classes;
  }
});

wxmlFiles.forEach(function (file) {
  const content = fs.readFileSync(file, 'utf8');
  let classes = content.match(/(?:class|custom-class)=["'](?:\\.|[^\\"])*["']/g);
  if (classes) {
    classes.forEach((cls) => {
      wxmlClassMap[file] = wxmlClassMap[file] ? `${wxmlClassMap[file]} ${cls}` : cls
    })
  }
});

// 遍历wxssClassMap，将其中未使用的类名加入unusedClasses
Object.keys(wxssClassMap).forEach(function (file) {
  wxssClassMap[file].forEach(function (cls) {
    let used = false;
    Object.keys(wxmlClassMap).forEach(function (wxmlFile) {
      if (wxmlClassMap[wxmlFile].indexOf(cls) >= 0) {
        used = true;
      }
    });
    if (!used) {
      if (!unusedClasses[cls]) {
        unusedClasses[cls] = [];
      }
      unusedClasses[cls].push(file);
    }
  });
});


let duplicateArray = []
let unusedClassesArray = []
Object.keys(unusedClasses).forEach((classObj) => {
  // /* pages/tao_can/index.wxss */ wxss中这种也被匹配到了.wxss，手动去除一下。
  if (classObj !== 'wxss') {
    unusedClasses[classObj].forEach((path) => {
      if (duplicateArray.indexOf(classObj + '@' + path) < 0) {
        duplicateArray.push(classObj + '@' + path)
        unusedClassesArray.push({ className: classObj, path: path })
      }
    })
  }
});

unusedClassesArray.forEach((cls, index) => {
  console.log(`第${index + 1}个没有使用的类名: ${cls.className}  所在目录： ${cls.path}`)
});
