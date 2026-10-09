import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {filterMarketServices,marketGroups,marketServiceNames,marketServices} from '../lib/market-services.mjs';
test('search finds a discipline by its deliverable',()=>{assert.deepEqual(filterMarketServices('  retouching ').map(s=>s.slug),['photography'])});
test('search and group are combined',()=>{assert.equal(filterMarketServices('photography','Design').length,0);assert.equal(filterMarketServices('','Production').length,3)});
test('unmatched query returns an empty result',()=>{assert.deepEqual(filterMarketServices('xyz987'),[])});
test('every discipline belongs to a presented group',()=>{for(const s of marketServices)assert.ok(marketGroups.includes(s.group),s.slug)});
test('the PHP API accepts exactly the Creative Market disciplines',()=>{
 const php=readFileSync(new URL('../public/api/inc/validation.php',import.meta.url),'utf8');
 const list=php.match(/const MARKET_SERVICES = \[([^\]]*)\]/)[1].match(/'([^']+)'/g).map(v=>v.slice(1,-1));
 assert.deepEqual(list,marketServiceNames);
});
