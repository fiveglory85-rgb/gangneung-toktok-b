/*LOGIC*/
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeLink=v=>{try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}};
let items=[],institutions=[],limit=9,toastTimer,api={};
let saved=[];try{let s=JSON.parse(localStorage.getItem('toktok-b-saved')||'[]');if(Array.isArray(s))saved=s.filter(x=>typeof x==='string')}catch{}
const state={mode:'',institution:'',cost:'all',family:false,open:false,savedOnly:false};
const money=x=>x.cost===0?'무료':x.cost==null?'운영기관에 확인':x.price||Number(x.cost).toLocaleString('ko-KR')+'원';
const shortDate=s=>s?Number(s.slice(5,7))+'.'+Number(s.slice(8,10)):'';
const schedule=x=>x.start?shortDate(x.start)+(x.end&&x.end!==x.start?' — '+shortDate(x.end):''):x.isDirectory?'회차별 안내':'기관 안내 확인';
const priceLabel=x=>x.cost===0?'무료':x.cost==null?'비용 확인':Number(x.cost).toLocaleString('ko-KR')+'원';
function toast(t){clearTimeout(toastTimer);$('toast').hidden=false;$('toast').textContent=t;toastTimer=setTimeout(()=>$('toast').hidden=true,2400)}
function remember(id){saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];try{localStorage.setItem('toktok-b-saved',JSON.stringify(saved));toast(saved.includes(id)?'담은 일정에 저장했어요.':'담은 일정에서 뺐어요.')}catch{toast('지금은 저장할 수 없어요. 브라우저 저장 공간을 확인해 주세요.')}render();syncHearts()}
function syncHearts(){$('savedCount').textContent=saved.filter(id=>items.some(x=>x.id===id)).length;document.querySelectorAll('[data-save]').forEach(b=>{let yes=saved.includes(b.dataset.save);b.textContent=yes?'♥':'♡';b.setAttribute('aria-pressed',String(yes))})}
function heart(x){return '<button class="heart" aria-label="'+esc(x.title)+' 일정 담기" aria-pressed="'+saved.includes(x.id)+'" data-save="'+esc(x.id)+'">'+(saved.includes(x.id)?'♥':'♡')+'</button>'}
const covers={
'a-262':{title:'영화 한 편,<br>책 한 권.',label:'CINEMA & BOOK',decor:'“',tone:'blue',foot:'김민섭 × 허태준'},
'a-264':{title:'우리 동네를<br>기록하는 법.',label:'RECORD OUR TOWN',decor:'▣',tone:'yellow',foot:'2026 시민기록가 양성교육'},
'a-152':{title:'파도 속에<br>흐르는 현.',label:'SOUND OF GANGNEUNG',decor:'〰',tone:'warm',foot:'이로사리아 가야금독주회'},
'a-154':{title:'고요한<br>사이.',label:'A MOMENT OF ART',decor:'◯',tone:'plum',foot:'갤러리 초당 · 김민진 개인전'},
'a-252':{title:'하고 싶은 거,<br>아무거나.',label:'MAKE YOUR OWN',decor:'✳',tone:'',foot:'청소년 개인·팀 프로젝트'}
};
function cover(x){const c=covers[x.id]||{title:esc(x.category)+'의<br>발견.',label:'OUR LOCAL MOMENT',decor:'✳',tone:'',foot:esc(x.institution)};const short={'a-264':'동네의<br>기록.','a-262':'영화와<br>책.','a-152':'가야금의<br>울림.','a-154':'고요한<br>사이.','a-252':'나만의<br>도전.'}[x.id]||esc(x.category);return '<div class="cover '+c.tone+'" aria-hidden="true"><span class="cover-label">'+c.label+'</span><div class="cover-title"><span class="cover-desktop">'+c.title+'</span><span class="cover-mobile">'+short+'</span></div><span class="cover-decoration">'+c.decor+'</span><small class="cover-foot">'+c.foot+'</small></div>'}
function pickCard(x){return '<article class="pick-card">'+cover(x)+'<div class="pick-copy"><div class="mini">'+esc(x.institution)+' · '+esc(x.category)+'</div><h3>'+esc(x.title)+'</h3><p>'+esc(x.description)+'</p><div class="pick-meta"><span>'+esc(schedule(x))+' · '+esc(priceLabel(x))+'</span><button class="plain-link" data-open="'+esc(x.id)+'">자세히 보기 ↗</button></div></div></article>'}
function setupEditorial(){
 const current=filterItems(items,{history:false});const feature=current.find(x=>x.id==='a-264'&&phase(x).key==='open')||current.find(x=>x.id==='a-152')||current[0];
 if(feature){let p=phase(feature);$('spotlight').innerHTML=cover(feature)+'<div class="spotlight-copy"><p class="mini">'+esc(p.label)+' · '+esc(feature.institution)+'</p><h2>'+esc(feature.title)+'</h2><div class="spotlight-bottom"><span>'+esc(feature.deadline?'접수 ~ '+shortDate(feature.deadline):schedule(feature))+'</span><button data-open="'+esc(feature.id)+'">자세히 보기 ↗</button></div></div>'}else $('spotlight').innerHTML='<span class="skeleton">새로운 일정을 준비하고 있어요.</span>';
 let picks=['a-262','a-154','a-152'].map(id=>current.find(x=>x.id===id)).filter(Boolean);for(const x of current)if(picks.length<3&&!picks.includes(x))picks.push(x);$('pickCards').innerHTML=picks.map(pickCard).join('');
 const count=new Set(current.map(x=>x.institution)).size;$('heroMeta').textContent=count+'개 기관·안내처의 소식 · 공고별 확인일 표시';
 $('institutionGrid').innerHTML=institutions.map((x,i)=>{const n=current.filter(e=>e.institution===x.filter).length;return '<article class="institution"><span class="institution-icon">'+esc(x.icon)+'</span><h3>'+esc(x.name)+'</h3><p>'+esc(x.topic)+'</p><div class="institution-bottom">'+(n?'<button data-institution="'+i+'">소식 '+n+'건 보기</button>':'<span>공식 소식 둘러보기</span>')+'<a href="'+esc(safeLink(x.url))+'" target="_blank" rel="noopener noreferrer">홈페이지 ↗</a></div></article>'}).join('');
 $('region').innerHTML='<option value="">강릉 전체</option>'+[...new Set(items.map(x=>x.region).filter(Boolean))].sort().map(v=>'<option>'+esc(v)+'</option>').join('');
 const statusNames={missing_key:'추가 연결 준비 중',error:'연결 확인 필요',connected:'조회 연결됨',partial:'일부 범위 조회'};
 $('providerStatus').innerHTML=(api.providers||[]).map(p=>'<div class="provider-row"><a href="'+esc(safeLink(p.source))+'" target="_blank" rel="noopener noreferrer">'+esc(p.name)+' ↗</a> · '+esc(statusNames[p.state]||p.state)+'<br>'+esc(p.cycle)+'</div>').join('');
 $('dataNote').textContent='이번주 강릉의 11월 2일 정리 자료를 반영하고 일부 공고를 11월 4일 재확인했습니다. 공고별 확인일은 상세에서 볼 수 있어요. 자동 최신화는 준비 중이며, 신청 전 공식 안내를 확인해 주세요.';
}
function filters(){return {...state,query:$('query').value,from:$('from').value,to:$('to').value,region:$('region').value,category:$('category').value,audience:$('audience').value,history:$('history').checked,sort:$('sort').value,saved}}
function render(){const f=filters(),rows=filterItems(items,f);$('filterError').textContent=f.from&&f.to&&f.from>f.to?'끝 날짜를 시작 날짜 이후로 골라 주세요.':'';
 $('resultsCount').innerHTML=(state.savedOnly?'담아둔 일정':'조건에 맞는 소식')+' <em>'+rows.length+'</em>건';$('activeInstitution').textContent=state.institution?'· '+state.institution:'';
 document.querySelectorAll('.mode-tabs [data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===state.mode);b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode))});
 for(const [id,v] of [['free',state.cost==='free'],['family',state.family],['open',state.open],['saved',state.savedOnly]]){$(id).classList.toggle('active',v);$(id).setAttribute('aria-pressed',String(v))}
 $('cards').innerHTML=rows.length?rows.slice(0,limit).map(x=>{let p=phase(x);return '<article class="event-card"><div class="event-top"><span class="status '+p.tone+'">'+esc(p.label)+'</span><span class="category-text">'+esc(x.category)+'</span></div><p class="event-institution">'+esc(x.institution)+'</p><h3>'+esc(x.title)+'</h3><p class="event-description">'+esc(x.description)+'</p><div class="event-data"><p><span>일정</span><b>'+esc(schedule(x))+(x.start?' · '+esc(x.region):'')+'</b></p><p><span>대상</span><b>'+esc(x.target)+'</b></p><p><span>비용</span><b>'+esc(money(x))+'</b></p></div><div class="event-actions"><button class="plain-link" data-open="'+esc(x.id)+'">내용과 신청 정보 ↗</button>'+heart(x)+'</div></article>'}).join(''):'<div class="empty"><h3>'+(state.savedOnly?'아직 담아둔 일정이 없어요.':'지금 조건에 맞는 소식이 없어요.')+'</h3><p>'+(state.cost==='free'?'무료가 확인된 프로그램만 표시하고 있어요. 전체 소식도 살펴보세요.':'조건을 조금 바꾸거나 지난 일정을 함께 살펴보세요.')+'</p><button class="chip" data-reset>전체 소식 보기</button></div>';
 decorateCards(rows.slice(0,limit));$('more').hidden=rows.length<=limit;syncHearts();
}
function reset(){for(const id of ['query','from','to','region','category','audience'])$(id).value='';$('history').checked=false;$('sort').value='recommended';Object.assign(state,{mode:'',institution:'',cost:'all',family:false,open:false,savedOnly:false});limit=9;render()}
function jump(){$('explore').scrollIntoView({behavior:'smooth',block:'start'})}
function showDetail(x){let p=phase(x);const row=(k,v)=>'<div><dt>'+k+'</dt><dd>'+esc(v)+'</dd></div>';let url=safeLink(x.applicationUrl)||safeLink(x.sourceUrl);let closed=['closed','ended'].includes(p.key);
 $('detailBody').innerHTML='<div class="detail-kicker">'+esc(x.institution)+' · '+esc(x.category)+'</div><h2 class="detail-title">'+esc(x.title)+'</h2><span class="status '+p.tone+'">'+esc(p.label)+'</span><p class="detail-description">'+esc(x.description)+'</p><dl class="detail-table">'+row('일정',x.scheduleText||[x.start,x.end].filter(Boolean).join(' ~ ')||'세부 일정은 기관에 문의해 주세요.')+row('장소',x.place)+row('대상',x.target)+row('비용',money(x))+row('접수',x.applicationText||'신청 방법과 마감은 공식 안내를 확인해 주세요.')+'</dl>'+(x.sessions?.length?'<h3>프로그램 순서</h3>'+x.sessions.map(s=>'<div class="session">'+esc(s.date)+' · '+esc(s.title)+'</div>').join(''):'')+(closed?'<p class="detail-warning">'+(p.key==='ended'?'이미 지난 일정입니다. 다음 회차는 운영기관에 확인해 주세요.':'공개된 접수 마감이 지났습니다. 추가 참여 가능 여부는 운영기관에 문의해 주세요.')+'</p>':'<p class="detail-warning">조기 마감되거나 내용이 바뀔 수 있어요. 참여 조건과 비용은 공식 안내에서 한 번 더 확인해 주세요.</p>')+'<div class="detail-actions">'+(url?'<a class="primary" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+(closed?'공식 공고 확인':'공식 안내·신청 확인')+' ↗</a>':'')+heart(x)+'</div><p class="detail-source">'+(x.provenance==='editorial'?'기관 공고 정리 자료 · 공고 확인일 ':'공공 API 자료 · 원본 기준일 ')+esc(x.referenceDate||'미제공')+'<br>'+(x.provenance==='editorial'?'이번주 강릉 자료를 B에 반영했습니다.':'API 조회 시각은 원본 갱신일과 다릅니다.')+' '+(safeLink(x.sourceUrl)?'<a href="'+esc(safeLink(x.sourceUrl))+'" target="_blank" rel="noopener noreferrer">출처 보기 ↗</a>':'')+'</p>';
 $('detailBody').insertAdjacentHTML('beforeend',archiveDetailHTML(x));$('detail').showModal();syncHearts();loadEditionReviews(x);
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.open){const x=items.find(x=>x.id===b.dataset.open);if(x)showDetail(x)}
 if(b.dataset.save)remember(b.dataset.save);
 if(b.dataset.mode!==undefined){reset();state.mode=b.dataset.mode;render();if(!b.closest('.mode-tabs'))jump()}
 if(b.dataset.institution!==undefined){reset();state.institution=institutions[+b.dataset.institution].filter;render();jump()}
 if(b.hasAttribute('data-reset'))reset();
});
let beforeModalFocus;$('detail').addEventListener('close',()=>{beforeModalFocus?.focus()});
document.addEventListener('click',e=>{if(e.target.closest('[data-open]'))beforeModalFocus=e.target.closest('[data-open]')});
document.querySelector('.close').onclick=()=>$('detail').close();$('detail').addEventListener('click',e=>{if(e.target===$('detail')){let r=$('detail').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('detail').close()}});
['query','from','to','region','category','audience','history','sort'].forEach(id=>$(id).addEventListener(id==='query'?'input':'change',()=>{limit=9;render()}));$('searchForm').onsubmit=e=>{e.preventDefault();limit=9;render()};$('reset').onclick=reset;
for(const [id,key] of [['free','cost'],['family','family'],['open','open'],['saved','savedOnly']])$(id).onclick=()=>{state[key]=key==='cost'?(state.cost==='free'?'all':'free'):!state[key];limit=9;render()};
$('heroFree').onclick=()=>{reset();state.cost='free';render();jump()};$('familyShortcut').onclick=()=>{reset();state.family=true;render();jump()};$('savedNav').onclick=()=>{reset();state.savedOnly=true;render();jump()};$('more').onclick=()=>{limit+=9;render()};
$('weekend').onclick=()=>{const today=koreaDate(),date=new Date(today+'T00:00:00Z'),day=date.getUTCDay();date.setUTCDate(date.getUTCDate()+(day===0?0:(6-day+7)%7));$('from').value=date.toISOString().slice(0,10);if(day!==0)date.setUTCDate(date.getUTCDate()+1);$('to').value=date.toISOString().slice(0,10);limit=9;render()};
async function load(){try{let r=await fetch('/api/events');if(!r.ok)throw Error();api=await r.json();items=api.items||[];institutions=api.institutions||[];setupEditorial();render();renderArchiveHome();loadReviewCounts()}catch{$('resultsCount').textContent='소식을 불러오지 못했어요.';$('cards').innerHTML='<div class="empty"><h3>잠시 후 다시 확인해 주세요.</h3><p>연결이 원활하지 않습니다.</p><button class="chip" id="retry">다시 불러오기</button></div>';$('retry').onclick=load;$('spotlight').innerHTML='<span class="skeleton">연결을 확인하고 있어요.</span>'}}load();
