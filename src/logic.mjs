export const koreaDate=(now=new Date())=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(now);
export function phase(x,now=new Date()){
 const today=koreaDate(now);
 if(x.end&&x.end<today)return {label:'지난 일정',tone:'ended',key:'ended'};
 if(x.deadline){const past=x.deadline<today||(x.deadlineTime&&new Date(x.deadline+'T'+x.deadlineTime+':00+09:00')<now);if(past)return {label:'접수 종료',tone:'muted',key:'closed'};const days=(Date.parse(x.deadline)-Date.parse(today))/86400000;return {label:days===0?'오늘 마감':days<=3?'마감 임박':'접수 기간',tone:days<=3?'urgent':'open',key:'open'}}
 if(x.isDirectory)return {label:'상시 안내',tone:'muted',key:'info'};
 if(x.start&&x.start>today)return {label:'예정된 일정',tone:'open',key:'upcoming'};
 if(x.start&&x.end&&x.start<=today&&x.end>=today)return {label:'진행 중',tone:'open',key:'ongoing'};
 return {label:'기관 확인',tone:'muted',key:'info'};
}
export function filterItems(items,f,now=new Date()){
 if(f.from&&f.to&&f.from>f.to)return [];
 const q=(f.query||'').trim().toLowerCase();
 return items.filter(x=>{
 const p=phase(x,now);if(!f.history&&p.key==='ended')return false;
 if(f.savedOnly&&!f.saved?.includes(x.id))return false;
 if(f.mode==='learn'&&!['교육','상담·지원','모집·공모'].includes(x.category))return false;
 if(f.mode==='play'&&['교육','상담·지원','모집·공모'].includes(x.category))return false;
 if(f.category&&x.category!==f.category)return false;
 if(f.institution&&x.institution!==f.institution)return false;
 if(f.region&&!String(x.region||x.address).includes(f.region))return false;
 if(f.cost==='free'&&x.cost!==0)return false;
 if(f.audience&&!(x.audienceGroups||[]).includes(f.audience)&&!x.target?.includes(f.audience))return false;
 if(f.family&&!(x.audienceGroups||[]).some(a=>['미취학','초등 저학년','초등 고학년'].includes(a))&&!/가족|부모|자녀|어린이/.test(x.target||''))return false;
 if(f.open&&p.key!=='open')return false;
 if(q&&![x.title,x.description,x.place,x.institution,x.target,...(x.instructors||[]).map(t=>t.name+' '+t.role)].join(' ').toLowerCase().includes(q))return false;
 if(f.from&&(!x.start||(x.end||x.start)<f.from))return false;
 if(f.to&&(!x.start||x.start>f.to))return false;
 return true;
 }).sort((a,b)=>f.sort==='start'?(a.start||'9999').localeCompare(b.start||'9999'):f.sort==='deadline'?(a.deadline||'9999').localeCompare(b.deadline||'9999'):(['open','upcoming','ongoing','info','closed','ended'].indexOf(phase(a,now).key)-['open','upcoming','ongoing','info','closed','ended'].indexOf(phase(b,now).key))||(a.deadline||a.start||'9999').localeCompare(b.deadline||b.start||'9999'));
}
