let Service = require('node-windows').Service;
 
let svc = new Service({
  name: 'danmu-service',    //服务名称
  description: '', //描述
  script: './' //nodejs项目要启动的文件路径
});
 
svc.on('install', () => {
  svc.start();
});
 
svc.install();