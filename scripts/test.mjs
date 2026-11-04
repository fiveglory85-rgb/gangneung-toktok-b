import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {Script} from 'node:vm';import worker,{normalize,providers,safeURL,collect,data} from '../src/server.mjs';
let tests=0;const ok=(v)=>{assert.ok(v);tests++};
ok(safeURL('javascript:alert(1)')===null);ok(safeURL('https://www.gn.go.kr/')==='https://www.gn.go.kr/');
ok(normalize({lctreNm:'강좌',edcRdnmadr:'강릉시 교동',lctreCost:'0',edcStartDay:'2026-11-09'},providers[2]).cost===0);
ok(normalize({lctreNm:'강좌',edcRdnmadr:'강릉시',lctreCost:''},providers[2]).cost===null);
ok(normalize({fstvlNm:'축제',rdnmadr:'강릉시'},providers[1]).cost===null);
ok(normalize({lctreNm:'강좌',edcRdnmadr:'서울시',lctreCost:'0'},providers[2])===null);
let calls=0;const mock=async()=>{calls++;return Response.json({response:{header:{resultCode:'00'},body:{totalCount:101,items:Array.from({length:calls===1?100:1},(_,i)=>({fstvlNm:'축제'+calls+i,rdnmadr:'강릉시 교동'}))}}})};
ok((await collect(providers[1],'test',mock)).records.length===101);ok(calls===2);
await assert.rejects(()=>collect(providers[0],'test',async()=>Response.json({response:{header:{resultCode:'30'}}})));tests++;
const d=await data({});ok(d.items.length===0&&d.providers.every(p=>p.state==='missing_key'));
ok((await worker.fetch(new Request('https://test/api/events'),{})).status===200);ok((await worker.fetch(new Request('https://test/nope'),{})).status===404);
const html=await readFile('src/index.html','utf8');new Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);tests++;
console.log(tests+' checks passed: normalization, unknown fees, location, pagination, provider errors, missing keys, routes, UI syntax');

