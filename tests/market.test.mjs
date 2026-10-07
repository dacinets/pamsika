import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterMarketServices} from '../lib/market-services.mjs';
test('search finds a discipline by its deliverable',()=>{assert.deepEqual(filterMarketServices('  retouching ').map(s=>s.slug),['photography'])});
test('search and group are combined',()=>{assert.equal(filterMarketServices('photography','Design').length,0);assert.equal(filterMarketServices('','Production').length,3)});
test('unmatched query returns an empty result',()=>{assert.deepEqual(filterMarketServices('xyz987'),[])});
