export const allowedReviewTags=['설명이 이해하기 쉬워요','직접 해볼 수 있어요','준비물 안내가 좋아요','아이와 함께하기 좋아요','다음에도 참여하고 싶어요'];
import {reviewEligibility} from './archive.mjs';
export function validateReview(input,edition,now=new Date()){
 const eligibility=reviewEligibility(edition,now);if(!eligibility.allowed)throw new Error(eligibility.reason);
 if(input.confirmed!==true||input.shareConsent!==true)throw new Error('참여 사실과 후기 공유에 동의해 주세요.');
 if(!['completed','attending'].includes(input.stage))throw new Error('참여 상태를 골라 주세요.');
 if(input.stage==='completed'&&!eligibility.completedAllowed)throw new Error('전체 과정이 끝나기 전에는 중간 후기로 남겨 주세요.');
 const attendedOn=String(input.attendedOn||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(attendedOn)||!Number.isFinite(Date.parse(attendedOn))||new Date(attendedOn).toISOString().slice(0,10)!==attendedOn||attendedOn<eligibility.earliest||attendedOn>eligibility.latest)throw new Error('실제 참여한 날짜를 과정 기간 안에서 골라 주세요.');
 const satisfaction=Number(input.satisfaction),clarity=input.clarity==null||input.clarity===''?null:Number(input.clarity);
 if(![1,2,3].includes(satisfaction))throw new Error('만족도를 골라 주세요.');
 if(clarity!==null&&(!edition.instructors?.length||![1,2,3].includes(clarity)))throw new Error('강의 설명 평가를 확인해 주세요.');
 if(!['easy','appropriate','hard'].includes(input.difficulty))throw new Error('체감 난이도를 골라 주세요.');
 const tags=Array.isArray(input.tags)?[...new Set(input.tags)]:[];if(tags.length>3||tags.some(t=>!allowedReviewTags.includes(t)))throw new Error('도움 된 점은 목록에서 3개까지 골라 주세요.');
 const comment=String(input.comment||'').trim();if(comment.length>300)throw new Error('한 줄 후기는 300자 이내로 적어 주세요.');
 return {stage:input.stage,attendedOn,satisfaction,clarity,difficulty:input.difficulty,tags,comment};
}
export async function reviewerKey(req){const id=req.headers.get('oai-authenticated-user-id');if(!id)return null;const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('toktok-review:'+id));return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function handleReviews(req,env,editions,now=new Date()){
 const url=new URL(req.url),key=await reviewerKey(req),db=env.DB;
 if(url.pathname==='/api/review-counts'){
  if(req.method!=='GET')return reply({error:'지원하지 않는 요청입니다.'},405);
  if(!db)return reply({ready:false,counts:{}});
  try{let r=await db.prepare("SELECT edition_id,COUNT(*) AS count FROM reviews WHERE status='published' GROUP BY edition_id").all();return reply({ready:true,counts:Object.fromEntries(r.results.map(x=>[x.edition_id,x.count]))})}catch{return reply({ready:false,counts:{}})}
 }
 if(req.method==='GET'){
  const edition=editions.find(x=>x.editionId===url.searchParams.get('edition'));if(!edition)return reply({error:'회차를 찾을 수 없어요.'},404);
  if(!db)return reply({ready:false,signedIn:!!key,reviews:[],error:'후기 저장소를 연결하고 있어요. 잠시 후 다시 확인해 주세요.'});
  try{const result=await db.prepare("SELECT * FROM reviews WHERE edition_id=? AND status='published' ORDER BY updated_at DESC LIMIT 100").bind(edition.editionId).all();const reviews=result.results.map(r=>({id:r.id,stage:r.stage,attendedOn:r.attended_on,satisfaction:r.satisfaction,clarity:r.clarity,difficulty:r.difficulty,tags:JSON.parse(r.tags_json),comment:r.comment,createdAt:r.created_at,updatedAt:r.updated_at,mine:!!key&&r.user_key===key,participation:'self_reported'}));return reply({ready:true,signedIn:!!key,reviews,note:'최근 100개 후기 · 참여 사실 본인 확인, 기관의 수강 인증 아님'})}catch{return reply({ready:false,signedIn:!!key,reviews:[],error:'후기를 불러오지 못했어요.'},503)}
 }
 if(!['POST','DELETE'].includes(req.method))return reply({error:'지원하지 않는 요청입니다.'},405);
 if(!key)return reply({error:'로그인한 뒤 후기를 남길 수 있어요.'},401);
 if(req.headers.get('origin')!==url.origin)return reply({error:'이 사이트의 후기 양식에서 다시 시도해 주세요.'},403);
 if(!db)return reply({error:'후기 저장소 연결이 필요해요.'},503);
 if(Number(req.headers.get('content-length')||0)>8000)return reply({error:'입력 내용이 너무 길어요.'},413);
 let input;try{const raw=await req.text();if(raw.length>8000)return reply({error:'입력 내용이 너무 길어요.'},413);input=JSON.parse(raw)}catch{return reply({error:'입력 내용을 확인해 주세요.'},400)}
 const edition=editions.find(x=>x.editionId===input.editionId);if(!edition)return reply({error:'회차를 찾을 수 없어요.'},404);
 if(req.method==='DELETE'){try{await db.prepare("UPDATE reviews SET status='deleted',updated_at=? WHERE edition_id=? AND user_key=?").bind(now.toISOString(),edition.editionId,key).run();return reply({ok:true})}catch{return reply({error:'삭제하지 못했어요. 다시 시도해 주세요.'},503)}}
 let value;try{value=validateReview(input,edition,now)}catch(e){return reply({error:e.message},400)}
 try{const time=now.toISOString();await db.batch([
 db.prepare('INSERT OR IGNORE INTO program_editions (id,program_id,record_id,snapshot_json,created_at) VALUES (?,?,?,?,?)').bind(edition.editionId,edition.programId,edition.sourceRecordId,JSON.stringify(edition),time),
 db.prepare("INSERT INTO reviews (id,edition_id,user_key,stage,attended_on,satisfaction,clarity,difficulty,tags_json,comment,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,'published',?,?) ON CONFLICT(edition_id,user_key) DO UPDATE SET stage=excluded.stage,attended_on=excluded.attended_on,satisfaction=excluded.satisfaction,clarity=excluded.clarity,difficulty=excluded.difficulty,tags_json=excluded.tags_json,comment=excluded.comment,status='published',updated_at=excluded.updated_at").bind(crypto.randomUUID(),edition.editionId,key,value.stage,value.attendedOn,value.satisfaction,value.clarity,value.difficulty,JSON.stringify(value.tags),value.comment,time,time)
 ]);return reply({ok:true})}catch{return reply({error:'저장하지 못했어요. 입력 내용은 그대로 두었으니 다시 시도해 주세요.'},503)}
}
