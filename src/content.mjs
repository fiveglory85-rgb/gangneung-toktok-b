// Structured dates are transcribed from the retained official-source records;
// missing dates stay missing. No weekday-based session dates are generated.
const meta={
250:{start:'2026-11-14',end:'2026-11-15',deadline:'2026-10-21',deadlineTime:'23:00',institution:'강릉시가족센터',region:'강릉 외 지역',summary:'가족과 함께 숲에서 하룻밤을 보내는 1박 2일 캠프입니다. 국립횡성숲체원에서 진행하며, 접수는 종료됐습니다.'},
264:{start:'2026-11-10',end:'2026-12-08',deadline:'2026-11-06',institution:'강릉문화재단',region:'명주동',summary:'사진과 영상으로 우리 동네를 기록해 보세요. 아카이빙 이론·실습 4회와 기록활동을 함께하는 시민 과정입니다.'},
262:{start:'2026-11-07',end:'2026-11-07',deadline:'2026-11-06',deadlineTime:'18:00',institution:'강릉교육문화관',region:'노암동',summary:'영화 한 편을 보고, 작가와 감독의 이야기를 듣는 토요일. 김민섭 작가·허태준 감독과 영화와 책을 함께 나눕니다.'},
257:{start:'2026-11-14',end:'2026-11-14',deadline:'2026-11-06',deadlineTime:'23:00',institution:'강릉시가족센터',region:'초당동',summary:'아이와 함께 아쿠아리움에서 바다 생물을 만나는 가족 관람 프로그램입니다. 참여 대상과 비용은 센터에서 확인해 주세요.'},
265:{start:'2026-11-18',end:'2026-12-16',deadline:'2026-11-10',deadlineTime:'22:00',institution:'강릉문화재단',region:'강릉 전역'},
252:{start:'2026-11-16',end:'2026-12-13',deadline:'2026-11-10',deadlineTime:'23:00',institution:'강릉문화재단',region:'강릉 전역',summary:'해보고 싶었던 일을 직접 기획하고 실행하는 청소년 프로젝트입니다. 강릉의 11~19세 청소년이 개인이나 팀으로 참여할 수 있습니다.'},
17:{start:'2026-01-01',end:'2026-12-31',institution:'강릉시가족센터',region:'입암동',summary:'대상 가정의 자녀에게 한글 학습을 지원합니다. 자격과 신청 방법은 가족센터에 문의해 주세요.'},
29:{end:'2026-12-31',institution:'강릉시 통합예약',region:'여러 지역',summary:'숲해설·자원순환센터·도시정보센터 등 체험·견학 정보를 모은 공식 예약 목록입니다. 원하는 프로그램과 회차를 선택해 확인하세요.',isDirectory:true},
32:{start:'2026-01-01',end:'2026-12-31',institution:'강릉시가족센터',region:'입암동',summary:'다문화가족 자녀가 자신의 관심사와 진로를 살펴볼 수 있도록 돕는 개인상담입니다. 상담 일정은 센터와 조율합니다.'},
33:{institution:'강릉시가족센터',region:'입암동',summary:'가족관계와 심리적 어려움을 나눌 수 있는 상담 안내입니다. 신청 대상과 상담 가능 일정은 센터에서 확인해 주세요.'},
154:{start:'2026-11-04',end:'2026-11-09',institution:'강릉문화재단',region:'초당동',verifiedAt:'2026-11-04',summary:'갤러리 초당에서 만나는 김민진 작가의 개인전입니다. 잠시 걸음을 늦추고 전시를 둘러보세요.'},
153:{start:'2026-11-06',end:'2026-11-07',institution:'유니버설발레단 · 강릉아트센터',region:'교동'},
152:{start:'2026-11-14',end:'2026-11-14',institution:'강릉문화재단',region:'명주동',verifiedAt:'2026-11-04',summary:'작은공연장 단에서 가야금의 울림을 만나는 무료 독주회입니다. 11월 14일 토요일 오후 5시에 열립니다.'},
151:{start:'2026-11-03',end:'2026-11-08',institution:'강릉문화재단',region:'명주동',summary:'명주예술마당에서 열리는 전시 〈닳는중〉입니다. 일상 속 잠깐의 전시 나들이로 만나보세요.'},
149:{start:'2026-10-27',end:'2026-11-02',institution:'강릉문화재단',region:'강릉 전역'},
138:{start:'2026-07-01',institution:'강릉관광개발공사',region:'강릉 전역'},
118:{start:'2026-08-14',end:'2026-11-15',institution:'오죽헌·시립박물관',region:'죽헌동'},
122:{start:'2026-10-30',end:'2026-10-30',institution:'강릉단오제전수교육관',region:'노암동'},
123:{start:'2026-11-06',end:'2026-11-06',institution:'강릉단오제전수교육관',region:'노암동',summary:'금요일 저녁, 사물놀이의 흥겨운 장단을 만나보세요. 단오제전수교육관 공연장에서 열리는 공연입니다.'},
109:{start:'2026-07-22',end:'2026-10-25',institution:'강릉시립미술관 솔올',region:'교동'},
110:{institution:'강릉시',region:'초당동',isDirectory:true}
};
const groupMeta={
'family-1031-kleague':{start:'2026-11-08',end:'2026-11-08',deadline:'2026-11-06',deadlineTime:'10:00',region:'교동',category:'체험',summary:'강원FC와 전북현대의 경기를 함께 관람하는 가족친화문화 프로그램입니다.'},
'family-1030-dream-frame':{start:'2026-11-07',end:'2026-11-28',deadline:'2026-11-06',deadlineTime:'16:00',region:'입암동',summary:'다문화가족 자녀가 자신의 꿈과 미래를 그려보는 4회 프로그램입니다.'},
'family-1028-child-3dpen':{start:'2026-11-07',end:'2026-11-21',deadline:'2026-11-04',deadlineTime:'16:00',region:'입암동',summary:'3D펜으로 상상을 입체 작품으로 만드는 3회 과정입니다. 세부 연령은 센터 안내를 확인해 주세요.'},
'family-1029-mentor-cooking':{start:'2026-11-04',end:'2026-11-04',deadline:'2026-11-04',deadlineTime:'18:00',region:'입암동',category:'체험',summary:'멘토와 멘티가 함께 한국 요리를 배우는 하루 수업입니다.'},
'gnslib-fall-moru-adult':{start:'2026-10-25',end:'2026-11-15',deadline:'2026-10-23',deadlineTime:'18:00',region:'교동',summary:'몸과 물건, 마음을 살펴보는 성인·시니어 4회 과정입니다. 현재 접수는 종료됐습니다.'},
'family-1020-parent-young':[
{start:'2026-11-03',end:'2026-11-24',deadline:'2026-11-24',deadlineTime:'18:00',region:'입암동',target:'2~7세 자녀를 둔 부모 1인',summary:'2~7세 자녀를 둔 부모를 위한 명상요가 과정입니다. 잠시 나를 돌보는 시간을 가져보세요.'},
{start:'2026-11-03',end:'2026-11-17',deadline:'2026-11-07',deadlineTime:'10:00',region:'입암동',target:'예비부모 또는 3세 미만 자녀와 부모 1인',summary:'예비부모와 3세 미만 자녀를 둔 부모가 첫 이유식을 배우는 3회 수업입니다.'}
],
'cku-lifelong-2026-fall':[
{start:'2026-09-08',end:'2026-11-24',region:'내곡동',summary:'화요일 저녁, 보이차를 주제로 배우는 가을학기 강좌입니다. 중도 참여 가능 여부는 교육원에 문의해 주세요.'},
{start:'2026-09-08',end:'2026-11-24',region:'내곡동',summary:'포트폴리오를 위한 AI 활용과 포토샵을 배우는 화요일 오후 강좌입니다. 세부 준비물과 참여 방법을 확인해 보세요.'},
{start:'2026-09-07',end:'2026-11-23',region:'내곡동',summary:'삶과 죽음을 주제로 배우는 월요일 오후의 평생교육 강좌입니다. 중도 참여 가능 여부는 교육원에 문의해 주세요.'},
{start:'2026-09-09',end:'2026-11-25',region:'내곡동',summary:'수요일 오전에 유화를 배우는 가을학기 강좌입니다. 수업 참여와 준비물은 교육원에서 안내받을 수 있습니다.'}
]
};
export function fee(value){if(/^무료(?:$|\s*[·(])/u.test(value.trim()))return 0;const m=value.match(/(?:^|·\s*)([\d,]+)원/);return m?Number(m[1].replaceAll(',','')):null}
export function buildCurated(ref){
 const records=[];
 for(const e of [...ref.events,...ref.travel]){let m=meta[e.id];if(!m)continue;records.push({id:'a-'+e.id,title:e.title,category:e.category,description:m.summary||e.summary,place:e.location,address:e.location,region:m.region,institution:m.institution,source:m.institution,sourceUrl:e.sourceUrl,applicationUrl:e.sourceUrl,target:e.audience,audienceGroups:e.audienceGroups,price:e.price,cost:fee(e.price),scheduleText:e.dateText,applicationText:e.applicationText,tags:e.tags,referenceDate:m.verifiedAt||ref.verifiedAt,provenance:'editorial',sample:false,sessions:e.lectureDetails?.sessions||[],...m})}
 for(const g of ref.groups){const gm=groupMeta[g.id];if(!gm)continue;g.courses.forEach((c,i)=>{const m=Array.isArray(gm)?gm[i]:gm;records.push({id:'g-'+g.id+'-'+i,title:c.title,category:m.category||'교육',description:m.summary||'관심 있는 주제를 꾸준히 배우는 가톨릭관동대학교 평생교육원의 가을학기 강좌입니다. 중도 참여 가능 여부는 교육원에 문의해 주세요.',place:g.place,address:g.place,region:m.region,institution:g.institution,source:g.institution,sourceUrl:c.sourceUrl,applicationUrl:c.sourceUrl,target:g.audience,audienceGroups:g.institution.includes('가족')?['일반']:['일반','시니어'],price:c.detail.includes('원')?c.detail.match(/[\d,]+원(?:·재료비 별도)?/)?.[0]||'비용 확인 필요':'비용 확인 필요',cost:c.detail.includes('원')?fee(c.detail):null,scheduleText:c.detail,applicationText:g.registrationLabel,tags:[],referenceDate:g.id.startsWith('cku')?'2026-09-18':ref.verifiedAt,provenance:'editorial',sample:false,...m})})}
 const direct={
 'g-family-1031-kleague-0':'https://gangneung.familynet.or.kr/center/lay1/program/S295T322C451/recruitReceipt/view.do?seq=286098',
 'g-family-1028-child-3dpen-0':'https://gangneung.familynet.or.kr/center/lay1/program/S295T322C451/recruitReceipt/view.do?seq=284762'
 };
 for(const r of records)if(direct[r.id]){r.sourceUrl=direct[r.id];r.applicationUrl=direct[r.id]}
 return records;
}
export const institutions=[
 {name:'강릉문화재단',topic:'전시·공연·시민 문화활동',url:'https://www.gncaf.or.kr/ko/community/event',icon:'문화',filter:'강릉문화재단'},
{name:'강릉시가족센터',topic:'아이·부모·가족 프로그램',url:'https://gangneung.familynet.or.kr/center/lay1/program/S295T322C451/recruitReceipt/list.do',icon:'가족',filter:'강릉시가족센터'},
{name:'강릉교육문화관',topic:'독서·강연·평생학습',url:'https://lib.gwe.go.kr/gnecc/menu/259/board/51/list',icon:'책',filter:'강릉교육문화관'},
{name:'강릉시립도서관',topic:'도서관별 강좌·독서 문화',url:'https://www.gnslib.or.kr/participation/culture-event',icon:'배움',filter:'모루도서관'},
{name:'가톨릭관동대 평생교육원',topic:'성인을 위한 취미·전문 강좌',url:'https://lifelong.cku.ac.kr/fro_end/html/main/',icon:'강좌',filter:'가톨릭관동대학교 평생교육원'},
{name:'강릉시 통합예약',topic:'공공시설 체험·견학 신청',url:'https://www.gn.go.kr/yeyak/index.do',icon:'동네',filter:'강릉시 통합예약'},
{name:'오죽헌·시립박물관',topic:'지역의 역사·전시·문화',url:'https://www.gn.go.kr/museum/selectBbsNttList.do?bbsNo=67&key=943',icon:'역사',filter:'오죽헌·시립박물관'},
{name:'율곡국학진흥원',topic:'인문학·지역문화 강좌',url:'https://www.yulgok.or.kr/pub/notice.do',icon:'인문',filter:'율곡국학진흥원'}
];


