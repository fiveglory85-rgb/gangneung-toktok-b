const HTML=/*HTML*/null;
const CURATED=/*CONTENT*/null;
const INSTITUTIONS=/*INSTITUTIONS*/null;
export const providers=[
 {id:'tour',name:'한국관광공사 TourAPI',key:'TOUR_API_KEY',url:'https://apis.data.go.kr/B551011/KorService2/searchFestival2',source:'https://www.data.go.kr/data/15101578/openapi.do',cycle:'공식 메타데이터: 실시간 · 개별 행사 변경 확인 필요'},
 {id:'festival',name:'전국문화축제',key:'FESTIVAL_API_KEY',url:'https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api',source:'https://www.data.go.kr/data/15013104/standard.do',cycle:'분기 갱신 · 전국 병합 매월 초'},
 {id:'learning',name:'전국평생학습강좌',key:'LEARNING_API_KEY',url:'https://api.data.go.kr/openapi/tn_pubr_public_lftm_lrn_lctre_api',source:'https://www.data.go.kr/data/15013110/standard.do',cycle:'분기 갱신 · 전국 병합 매월 초'}
];
export function safeURL(v){try{let u=new URL(v);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}}
export function date(v){v=String(v||'');if(/^\d{8}$/.test(v))v=v.slice(0,4)+'-'+v.slice(4,6)+'-'+v.slice(6);return /^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v))?v:''}
export function normalize(r,p){
 const title=r.title||r.fstvlNm||r.lctreNm||'';const address=r.addr1||r.rdnmadr||r.edcRdnmadr||'';
 if(!title||!address.includes('강릉'))return null;
 const cost=p.id==='learning'&&String(r.lctreCost).trim()!==''&&r.lctreCost!=null?Number(r.lctreCost):null;
 return {id:p.id+':'+(r.contentid||title+address+(r.edcStartDay||r.fstvlStartDate||'')),title,address,region:address,category:p.id==='learning'?'교육':'축제',start:date(r.eventstartdate||r.fstvlStartDate||r.edcStartDay),end:date(r.eventenddate||r.fstvlEndDate||r.edcEndDay),deadline:date(r.rceptEndDate),cost:Number.isFinite(cost)?cost:null,target:r.edcTrgetType||'공식 안내 확인',place:r.opar||r.edcPlace||address,description:r.fstvlCo||r.lctreCo||'세부 내용과 신청 조건은 공식 출처에서 확인해 주세요.',source:p.name,institution:p.name,sourceUrl:p.source,applicationUrl:safeURL(r.homepageUrl),referenceDate:date(r.referenceDate)||null,sample:false,provenance:'api'};
}
export async function collect(p,key,fetcher=fetch){
 const records=[];let total=0;let incomplete=false;
 for(let page=1;page<=10;page++){
  const u=new URL(p.url);u.searchParams.set('serviceKey',key);u.searchParams.set('numOfRows','100');u.searchParams.set('pageNo',String(page));
  if(p.id==='tour'){u.searchParams.set('MobileOS','ETC');u.searchParams.set('MobileApp','GangneungTokTokB');u.searchParams.set('_type','json');u.searchParams.set('eventStartDate',new Date().getUTCFullYear()+'0101')}
  else u.searchParams.set('type','json');
  const res=await fetcher(u,{signal:AbortSignal.timeout(12000)});if(!res.ok)throw Error('upstream');
  const body=await res.json();const header=body.response?.header;if(!header||!['00','0000'].includes(String(header.resultCode)))throw Error('provider');
  const b=body.response.body;let rows=b?.items?.item??b?.items??[];if(!Array.isArray(rows))rows=rows?[rows]:[];
  records.push(...rows.map(r=>normalize(r,p)).filter(Boolean));total=Number(b?.totalCount)||0;
  if(rows.length<100||page*100>=total)break;if(page===10)incomplete=true;
 }
 return {records,total,incomplete};
}
let cached=null;
export async function data(env,fetcher=fetch){
 const signature=providers.map(p=>env[p.key]||'').join('|');
 if(cached&&cached.signature===signature&&Date.now()-cached.time<900000)return cached.value;
 const results=await Promise.all(providers.map(async p=>{const base={id:p.id,name:p.name,source:p.source,cycle:p.cycle};if(!env[p.key])return {...base,state:'missing_key',count:0,records:[]};try{let d=await collect(p,env[p.key],fetcher);return {...base,state:d.incomplete?'partial':'connected',count:d.records.length,records:d.records}}catch{return {...base,state:'error',count:0,records:[]}}}));
 const items=[...new Map([...(CURATED||[]),...results.flatMap(p=>p.records)].map(x=>[x.title+'|'+x.start+'|'+x.sourceUrl,x])).values()];
 const value={items,institutions:INSTITUTIONS||[],providers:results.map(({records,...p})=>p),fetchedAt:new Date().toISOString(),editorialVerifiedAt:'2026-11-02',importedAt:'2026-11-04',mode:results.some(p=>p.state==='connected'||p.state==='partial')?'connected':'editorial',note:'기관 공고를 정리한 자료를 제공합니다. 공공 API 추가 연결은 준비 중이며 자동 최신화로 표시하지 않습니다.'};
 cached={signature,time:Date.now(),value};return value;
}
export default {async fetch(req,env={}){const u=new URL(req.url);if(req.method!=='GET')return new Response('Method not allowed',{status:405});if(u.pathname==='/api/events')return Response.json(await data(env),{headers:{'Cache-Control':'no-store'}});if(u.pathname==='/robots.txt')return new Response('User-agent: *\nDisallow: /');if(u.pathname!=='/')return new Response('Not found',{status:404});return new Response(HTML,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}})}};
