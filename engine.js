/* OLS educational engine. jStat is used only for Student-t probabilities. */
(function(root){
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
function inverse(a){let n=a.length,m=a.map((r,i)=>[...r,...Array.from({length:n},(_,j)=>+(i===j))]);for(let k=0;k<n;k++){let p=k;for(let i=k+1;i<n;i++)if(Math.abs(m[i][k])>Math.abs(m[p][k]))p=i;[m[p],m[k]]=[m[k],m[p]];if(Math.abs(m[k][k])<1e-9)throw Error('特徵完全共線，請移除重複或相依的特徵後重試。');let v=m[k][k];m[k]=m[k].map(x=>x/v);for(let i=0;i<n;i++)if(i!==k){v=m[i][k];m[i]=m[i].map((x,j)=>x-v*m[k][j]);}}return m.map(r=>r.slice(n));}
function fit(X,y){let k=X[0].length,n=X.length;if(n<=k+2)throw Error('訓練資料不足，請減少特徵或增加資料。');let A=Array.from({length:k},()=>Array(k).fill(0)),b=Array(k).fill(0);X.forEach((r,i)=>r.forEach((x,j)=>{b[j]+=x*y[i];r.forEach((z,l)=>A[j][l]+=x*z);}));let inv=inverse(A),beta=inv.map(r=>r.reduce((s,x,i)=>s+x*b[i],0)),pred=X.map(r=>dot(r,beta)),sse=pred.reduce((s,x,i)=>s+(x-y[i])**2,0),df=n-k,s2=sse/df;return{beta,inv,s2,df,p:beta.map((v,i)=>s2<1e-20?0:2*(1-jStat.studentt.cdf(Math.abs(v/Math.sqrt(s2*inv[i][i])),df)))};}
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function shuffle(a){let s=42;for(let i=a.length-1;i>0;i--){s=(Math.imul(s,1664525)+1013904223)>>>0;let j=Math.floor(s/4294967296*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const metrics=(y,p)=>{let m=mean(y),ss=y.reduce((s,x)=>s+(x-m)**2,0);return{r2:ss?1-y.reduce((s,x,i)=>s+(x-p[i])**2,0)/ss:null,rmse:Math.sqrt(mean(y.map((x,i)=>(x-p[i])**2))),mae:mean(y.map((x,i)=>Math.abs(x-p[i])))};};
function run(rows,target,features,selection=true,log=false){
 if(!features.length)throw Error('請至少選一個特徵。');
 if(features.includes(target))throw Error('目標欄位不能同時為特徵。');
 if(rows.length>30000)throw Error('瀏覽器版上限為 30,000 筆，請先縮小資料。');
 const valid=v=>v!==''&&v!==null&&v!==undefined;
 const clean=rows.filter(r=>valid(r[target])&&Number.isFinite(Number(r[target]))&&(!log||Number(r[target])>0)&&features.every(f=>valid(r[f])));
 if(clean.length<20)throw Error('有效資料至少需要 20 筆（空值與無效目標列會移除）。');
 let ids=shuffle(clean.map((_,i)=>i)),cut=Math.floor(ids.length*.8),train=ids.slice(0,cut),test=ids.slice(cut),cols=[],names=[],notes=[];
 for(const f of features){let numeric=train.every(i=>Number.isFinite(Number(clean[i][f])));if(numeric){cols.push(clean.map(r=>Number(r[f])));names.push(f);}else{let cats=[...new Set(train.map(i=>String(clean[i][f])))].sort();if(cats.length>25)throw Error(f+' 類別超過 25 種；請移除 ID／日期或先完成特徵工程。');notes.push(f+' 參考類別：'+cats[0]+'；未見類別以參考類別處理');for(const c of cats.slice(1)){names.push(f+'='+c);cols.push(clean.map(r=>+(String(r[f])===c)));}}}
 let kept=[];cols=cols.filter((c,j)=>{let m=mean(train.map(i=>c[i])),sd=Math.sqrt(mean(train.map(i=>(c[i]-m)**2)));if(sd<1e-10){notes.push('移除常數欄位 '+names[j]);return false;}kept.push(names[j]);c.forEach((x,i)=>c[i]=(x-m)/sd);return true;});names=kept;
 if(names.length>50)throw Error('編碼後特徵上限為 50 個。');if(!names.length)throw Error('沒有可用的非固定特徵。');
 let all=clean.map((r,i)=>[1,...cols.map(c=>c[i])]),y=clean.map(r=>log?Math.log(Number(r[target])):Number(r[target])),active=all[0].map((_,i)=>i),removed=[],model;
 for(;;){let X=train.map(i=>active.map(j=>all[i][j]));model=fit(X,train.map(i=>y[i]));if(!selection||active.length<=2)break;let worst=1;for(let j=2;j<model.p.length;j++)if(model.p[j]>model.p[worst])worst=j;if(model.p[worst]<=.05)break;removed.push({name:names[active[worst]-1],p:model.p[worst]});active.splice(worst,1);}
 const back=x=>log?Math.exp(x):x,t=jStat.studentt.inv(.975,model.df);
 const predictions=test.map(i=>{let x=active.map(j=>all[i][j]),mu=dot(x,model.beta),h=dot(x,model.inv.map(r=>dot(r,x))),ci=t*Math.sqrt(Math.max(0,model.s2*h)),pi=t*Math.sqrt(Math.max(0,model.s2*(1+h)));return{actual:back(y[i]),pred:back(mu),lo:back(mu-pi),hi:back(mu+pi),ciLo:back(mu-ci),ciHi:back(mu+ci),logActual:y[i],logPred:mu};});
 const actual=predictions.map(p=>p.actual),pred=predictions.map(p=>p.pred);
 return{n:clean.length,dropped:rows.length-clean.length,train:train.length,test:test.length,names:active.map(i=>i?names[i-1]:'Intercept'),model,removed,notes,log,predictions,metrics:metrics(actual,pred),logMetrics:metrics(predictions.map(p=>p.logActual),predictions.map(p=>p.logPred)),coverage:mean(predictions.map(p=>+(p.actual>=p.lo&&p.actual<=p.hi))),trainMetrics:metrics(train.map(i=>y[i]),train.map(i=>dot(active.map(j=>all[i][j]),model.beta)))};
}
const api={run,fit,inverse,metrics};if(typeof module!=='undefined')module.exports=api;else root.Regression=api;
})(typeof window==='undefined'?globalThis:window);
