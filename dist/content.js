var q=Object.defineProperty;var C=(c,t,e)=>t in c?q(c,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):c[t]=e;var n=(c,t,e)=>C(c,typeof t!="symbol"?t+"":t,e);const o=class o{constructor(){n(this,"observer",null);n(this,"retryCount",0);n(this,"MAX_RETRIES",3);this.initObserver(),window.addEventListener("unload",()=>{this.cleanup()})}static getInstance(){return o.instance||(o.instance=new o),o.instance}initObserver(){try{this.observer=new MutationObserver(()=>{this.collectData()}),this.observer.observe(document.body,{childList:!0,subtree:!0})}catch(t){console.error("初始化观察器失败:",t)}}cleanup(){this.observer&&(this.observer.disconnect(),this.observer=null)}async collectData(){try{const t=document.querySelectorAll(".video-item"),e=Array.from(t).map(r=>{var s,i;return{id:r.getAttribute("data-id")||"",title:((s=r.querySelector(".title"))==null?void 0:s.textContent)||"",playCount:this.extractNumber(r.querySelector(".play-count")),likeCount:this.extractNumber(r.querySelector(".like-count")),commentCount:this.extractNumber(r.querySelector(".comment-count")),shareCount:this.extractNumber(r.querySelector(".share-count")),watchCompleteRate:this.extractNumber(r.querySelector(".complete-rate")),publishTime:((i=r.querySelector(".publish-time"))==null?void 0:i.getAttribute("datetime"))||""}});e.length>0&&await this.sendMessageWithRetry({type:"DATA_COLLECTED",data:e})}catch(t){console.error("数据采集错误:",t)}}async sendMessageWithRetry(t){try{await chrome.runtime.sendMessage(t),this.retryCount=0}catch(e){this.retryCount<this.MAX_RETRIES?(this.retryCount++,console.warn(`发送消息失败，正在重试 (${this.retryCount}/${this.MAX_RETRIES})`),setTimeout(()=>{this.sendMessageWithRetry(t)},1e3*this.retryCount)):(console.error("发送消息最终失败:",e),this.retryCount=0)}}extractNumber(t){if(!t)return 0;const e=t.textContent||"";return parseInt(e.replace(/[^0-9]/g,""))||0}async collectAccountData(){var t,e,r,s,i,l,m,d,h,y,b,S;try{const a={track:((e=(t=document.querySelector(".creator-info .track"))==null?void 0:t.textContent)==null?void 0:e.trim())||"",nickname:((s=(r=document.querySelector(".creator-info .nickname"))==null?void 0:r.textContent)==null?void 0:s.trim())||"",description:((l=(i=document.querySelector(".creator-info .description"))==null?void 0:i.textContent)==null?void 0:l.trim())||"",homepage:window.location.href},p={likes:this.extractNumber(document.querySelector(".stats .likes-count")),favorites:this.extractNumber(document.querySelector(".stats .favorites-count")),followers:this.extractNumber(document.querySelector(".stats .followers-count")),totalVideos:this.extractNumber(document.querySelector(".stats .videos-count")),viralVideos:this.extractNumber(document.querySelector(".stats .viral-count")),viralRate:this.extractNumber(document.querySelector(".stats .viral-rate"))},v={positioning:((d=(m=document.querySelector(".position .type"))==null?void 0:m.textContent)==null?void 0:d.trim())||"",persona:((y=(h=document.querySelector(".position .persona"))==null?void 0:h.textContent)==null?void 0:y.trim())||"",audience:((S=(b=document.querySelector(".position .audience"))==null?void 0:b.textContent)==null?void 0:S.trim())||""},x={days:30,publishedVideos:this.extractNumber(document.querySelector(".period-stats .published-count")),totalInteractions:this.extractNumber(document.querySelector(".period-stats .interactions-count")),viralVideosCount:this.extractNumber(document.querySelector(".period-stats .viral-count")),recentViralRate:this.extractNumber(document.querySelector(".period-stats .viral-rate")),viralVideoStats:{likes:this.extractNumber(document.querySelector(".viral-stats .likes-count")),favorites:this.extractNumber(document.querySelector(".viral-stats .favorites-count")),comments:this.extractNumber(document.querySelector(".viral-stats .comments-count"))}};return{basicInfo:a,accountStats:p,accountPosition:v,periodStats:x}}catch(a){throw console.error("采集账号数据失败:",a),a}}};n(o,"instance");let u=o;u.getInstance();
//# sourceMappingURL=content.js.map
