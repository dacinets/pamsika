import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {stockPhotos,stockSrcSet} from '../lib/stock-photos.mjs';
import {marketServices} from '../lib/market-services.mjs';
test('every stock photo has each responsive size on disk and alt text',()=>{for(const [key,photo] of Object.entries(stockPhotos)){assert.ok(photo.alt.length>10,key);for(const entry of stockSrcSet(key).split(', ')){const path=`public${entry.split(' ')[0]}`;assert.ok(existsSync(path),path)}}});
test('every Creative Market discipline has a stock photo',()=>{for(const s of marketServices)assert.ok(stockPhotos[s.image],s.slug)});
