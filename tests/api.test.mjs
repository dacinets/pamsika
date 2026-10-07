// Integration tests for the PHP API, run against `php -S` with a throwaway SQLite database.
// Requires the php CLI with pdo_sqlite (present on CI and most dev machines).
import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateEnquiry} from '../lib/enquiry-validation.mjs';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const port=18000+Math.floor(Math.random()*1000);
const base=`http://127.0.0.1:${port}`;
const origin={Origin:base};
let server,dir;

before(async()=>{
 dir=mkdtempSync(join(tmpdir(),'pamsika-api-'));
 const db=join(dir,'test.sqlite');
 execFileSync('php',['-r',`$p=new PDO('sqlite:${db}');$p->exec(file_get_contents('${join(root,'tools/dev-schema.sqlite.sql')}'));`]);
 const hash=execFileSync('php',['-r',"echo password_hash('correct horse battery', PASSWORD_DEFAULT);"]).toString();
 writeFileSync(join(dir,'config.php'),`<?php return ['db'=>['driver'=>'sqlite','path'=>'${db}'],'app'=>['url'=>'${base}','hash_salt'=>'test-salt','allowed_origins'=>[]],'admins'=>[['email'=>'admin@example.com','password_hash'=>'${hash}']],'notify'=>['to'=>'','from'=>''],'security'=>['enquiries_per_hour'=>100]];`);
 server=spawn('php',['-S',`127.0.0.1:${port}`,'-t',join(root,'public')],{env:{...process.env,PAMSIKA_CONFIG:join(dir,'config.php')},stdio:'ignore'});
 for(let i=0;i<50;i++){try{await fetch(`${base}/api/health.php`);return}catch{await new Promise(r=>setTimeout(r,100))}}
 throw new Error('PHP server did not start');
});
after(()=>{server?.kill();rmSync(dir,{recursive:true,force:true})});

const uuid=()=>crypto.randomUUID();
const good=()=>({kind:'campaign',name:'Test Person',email:'person@example.com',business:'Example business',message:'Launch our new product to local customers.',consent:true,budget:'Discuss with us',services:['Commercial production'],requestId:uuid()});
const post=(path,body,headers={})=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',...origin,...headers},body:JSON.stringify(body)});

test('health check reaches the database',async()=>{
 const r=await fetch(`${base}/api/health.php`);assert.equal(r.status,200);assert.equal((await r.json()).ok,true);
});

test('stores a valid enquiry and is idempotent per request id',async()=>{
 const body=good();
 const first=await post('/api/enquiry.php',body);assert.equal(first.status,201);
 const {reference}=await first.json();assert.match(reference,/^PAM-[0-9A-F]{8}$/);
 const retry=await post('/api/enquiry.php',body);assert.equal(retry.status,201);assert.equal((await retry.json()).reference,reference);
 const reused=await post('/api/enquiry.php',{...body,message:'A different message for the same id.'});assert.equal(reused.status,409);
});

test('rejects cross-site posts, wrong content type and the honeypot',async()=>{
 assert.equal((await post('/api/enquiry.php',good(),{Origin:'https://evil.example'})).status,403);
 assert.equal((await fetch(`${base}/api/enquiry.php`,{method:'POST',headers:{...origin,'Content-Type':'text/plain'},body:'{}'})).status,415);
 assert.equal((await post('/api/enquiry.php',{...good(),website:'spam'})).status,400);
 assert.equal((await fetch(`${base}/api/enquiry.php`)).status,405);
});

test('PHP and browser validation agree on the same inputs',async()=>{
 const cases=[good(),{...good(),consent:false,email:'bad'},{...good(),kind:'adapt'},{...good(),kind:'admin'},{...good(),message:'a'.repeat(5001)},
  {...good(),kind:'market',services:['Film and video']},{...good(),kind:'market',services:[]},
  {...good(),kind:'creator',business:'',services:['Photography'],market:'Lilongwe',portfolio:'https://portfolio.example/work'},
  {...good(),kind:'creator',services:['Photography'],market:'Lilongwe',portfolio:'http://example.com'},{...good(),requestId:'not-a-uuid'}];
 for(const body of cases){
  const js=validateEnquiry(body);
  const r=await post('/api/enquiry.php',body);
  const php=await r.json();
  if(js.success)assert.equal(r.status,201,`expected PHP to accept ${JSON.stringify(body).slice(0,80)}`);
  else{assert.equal(r.status,400);assert.deepEqual(Object.keys(php.errors).sort(),Object.keys(js.errors).sort())}
 }
});

test('analytics beacon records page views without query strings and skips DNT',async()=>{
 const send=(body,headers={})=>fetch(`${base}/api/collect.php`,{method:'POST',headers:{...origin,'User-Agent':'Mozilla/5.0 Chrome/120',...headers},body:JSON.stringify(body)});
 assert.equal((await send({t:'pageview',p:'/adlab?utm=x',r:'https://www.google.com/',w:390})).status,204);
 assert.equal((await send({t:'pageview',p:'/faq'},{DNT:'1'})).status,204);
 assert.equal((await send({t:'not-allowed',p:'/'})).status,204);
 const rows=execFileSync('php',['-r',`$p=new PDO('sqlite:${join(dir,'test.sqlite')}');echo json_encode($p->query('SELECT type,path,referrer,device FROM analytics_events')->fetchAll(PDO::FETCH_ASSOC));`]).toString();
 assert.deepEqual(JSON.parse(rows),[{type:'pageview',path:'/adlab/',referrer:'google.com',device:'mobile'}]);
});

test('admin API requires sign-in, CSRF and locks out repeated failures',async()=>{
 assert.equal((await fetch(`${base}/api/admin/stats.php`)).status,401);
 const bad=await post('/api/admin/login.php',{email:'admin@example.com',password:'wrong'});assert.equal(bad.status,401);
 const ok=await post('/api/admin/login.php',{email:'admin@example.com',password:'correct horse battery'});assert.equal(ok.status,200);
 const cookie=ok.headers.get('set-cookie').split(';')[0];const {csrf}=await ok.json();
 const stats=await fetch(`${base}/api/admin/stats.php?days=7`,{headers:{Cookie:cookie}});assert.equal(stats.status,200);
 const s=await stats.json();assert.equal(s.series.length,7);assert.ok(s.totals.enquiries>=1);
 const leads=await(await fetch(`${base}/api/admin/leads.php`,{headers:{Cookie:cookie}})).json();assert.ok(leads.total>=1);
 const id=leads.leads[0].id;
 assert.equal((await post('/api/admin/leads.php',{id,status:'won'},{Cookie:cookie})).status,403,'missing CSRF token');
 assert.equal((await post('/api/admin/leads.php',{id,status:'won'},{Cookie:cookie,'X-CSRF-Token':csrf})).status,200);
 assert.equal((await post('/api/admin/leads.php',{id,status:'bogus'},{Cookie:cookie,'X-CSRF-Token':csrf})).status,400);
 const csv=await(await fetch(`${base}/api/admin/export.php`,{headers:{Cookie:cookie}})).text();assert.match(csv,/Reference,/);
 for(let i=0;i<5;i++)await post('/api/admin/login.php',{email:'admin@example.com',password:'wrong'});
 assert.equal((await post('/api/admin/login.php',{email:'admin@example.com',password:'correct horse battery'})).status,429);
});

test('private helpers are not web-accessible through Apache rules',()=>{
 assert.match(readFileSync(join(root,'public/api/inc/.htaccess'),'utf8'),/Require all denied/);
});
