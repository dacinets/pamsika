// Preview builds only: Next.js adds basePath to links and its own scripts, but not to
// plain asset strings like "/media/…", CSS url(/fonts/…) or plain <a href="/…"> links
// (SiteLink renders ordinary anchors). Prefix those in out/, in the HTML and in the
// matching RSC payloads so hydration sees the same values.
// Usage: node tools/prefix-base-path.mjs out /pamsika
import {readdirSync,readFileSync,writeFileSync,statSync} from 'node:fs';
import {join,extname} from 'node:path';

const [dir='out',base]=process.argv.slice(2);
if(!base||!/^\/[\w-]+$/.test(base))throw new Error('usage: prefix-base-path.mjs <dir> /base');
const roots='media|brand|fonts|og|api';
const pattern=new RegExp(`([\\s,"'(\`]|\\\\")/(${roots})/`,'g');
// href="/x", "href":"/x" and the escaped \"href\":\"/x inside inline payload scripts.
const links=new RegExp(`(href=|\\\\?"href\\\\?":)(\\\\?")/(?!/|${base.slice(1)}/)`,'g');
const exts=new Set(['.html','.js','.css','.txt','.json','.xml']);
let changed=0;
const walk=d=>{for(const name of readdirSync(d)){
 const p=join(d,name);
 if(statSync(p).isDirectory()){walk(p);continue}
 if(!exts.has(extname(name)))continue;
 const src=readFileSync(p,'utf8');const out=src.replace(pattern,`$1${base}/$2/`).replace(links,`$1$2${base}/`);
 if(out!==src){writeFileSync(p,out);changed++}
}};
walk(dir);
console.log(`prefixed asset paths in ${changed} files`);
