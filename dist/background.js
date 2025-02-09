class c{constructor(){this.initListeners()}initListeners(){chrome.runtime.onMessage.addListener((e,t,a)=>{if(e.type==="DATA_COLLECTED")this.handleCollectedData(e.data);else if(e.type==="GET_ACCOUNT_DATA")return a({basicInfo:{track:"生活",nickname:"测试账号",description:"这是一个测试账号的简介",homepage:"https://channels.weixin.qq.com/platform"},accountStats:{likes:1e5,favorites:5e4,followers:2e4,totalVideos:100,viralVideos:10,viralRate:10},accountPosition:{positioning:"生活分享",persona:"邻家大姐姐",audience:"18-35岁女性"},periodStats:{days:30,publishedVideos:30,totalInteractions:5e4,viralVideosCount:5,recentViralRate:16.7,viralVideoStats:{likes:2e4,favorites:1e4,comments:5e3}}}),!0})}async handleCollectedData(e){try{await this.saveData(e);try{await this.sendNotification("数据更新","新的视频数据已收集完成")}catch(t){console.warn("通知发送失败:",t)}}catch(t){console.error("数据处理错误:",t)}}async saveData(e){const i=[...(await chrome.storage.local.get("videoData")).videoData||[],...e].filter((o,n,r)=>n===r.findIndex(s=>s.id===o.id));await chrome.storage.local.set({videoData:i})}async sendNotification(e,t){if(chrome.notifications)return new Promise((a,i)=>{chrome.notifications.create({type:"basic",iconUrl:"assets/icon128.png",title:e,message:t},o=>{chrome.runtime.lastError?i(chrome.runtime.lastError):a()})});console.log("通知功能不可用:",e,t)}}new c;
//# sourceMappingURL=background.js.map
