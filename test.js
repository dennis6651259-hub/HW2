const assert=require('node:assert/strict'),fs=require('node:fs');
global.jStat=require('./vendor/jstat.js').jStat;
const R=require('./engine.js'),Papa=require('./vendor/papaparse.js');
const rows=Papa.parse(fs.readFileSync(__dirname+'/data/startups.csv','utf8'),{header:true,skipEmptyLines:true}).data;
const result=R.run(rows,'Profit',['R&D Spend','Administration','Marketing Spend','State'],true,false);
assert.equal(result.n,50);assert.equal(result.train,40);assert.equal(result.test,10);
assert.ok(Math.abs(result.metrics.r2-.9237437389)<1e-7);
assert.deepEqual(result.names,['Intercept','R&D Spend','Marketing Spend']);
for(const p of result.predictions){assert.ok(p.lo<=p.ciLo&&p.ciLo<=p.pred&&p.pred<=p.ciHi&&p.ciHi<=p.hi);}
const data=Array.from({length:60},(_,i)=>({x:i,y:3+2*i+(i%3-.9)}));
assert.ok(R.run(data,'y',['x'],true).metrics.r2>.99);
assert.throws(()=>R.run(data,'y',[]));assert.throws(()=>R.run(data,'y',['y']));assert.throws(()=>R.run(data.slice(0,5),'y',['x']));
assert.throws(()=>R.run(data.map(r=>({...r,z:r.x*2})),'y',['x','z']));
console.log('OLS fixture, selection, ordered intervals, synthetic fit and invalid-input checks passed.');
