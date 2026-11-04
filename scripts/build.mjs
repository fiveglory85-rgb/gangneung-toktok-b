import {readFile,mkdir,writeFile,copyFile} from 'node:fs/promises';
import {buildCurated,institutions} from '../src/content.mjs';
await mkdir('dist/server',{recursive:true}); await mkdir('dist/.openai',{recursive:true});
let html=await readFile('src/home.html','utf8');
const logic=(await readFile('src/logic.mjs','utf8')).replaceAll('export ','');
const archive=(await readFile('src/archive.mjs','utf8')).replaceAll('export ','');
const reviewServer=(await readFile('src/reviews.mjs','utf8')).replace("import {reviewEligibility} from './archive.mjs';",'').replaceAll('export ','');
const archiveClient=await readFile('src/archive-ui.js','utf8');
const app=(await readFile('src/app.js','utf8')).replace('/*LOGIC*/',logic+'\n'+archive)+'\n'+archiveClient;
html=html.replace('/*STYLES*/',await readFile('src/styles.css','utf8')).replace('/*APP*/',app);
const curated=JSON.parse(await readFile('data/editions.json','utf8'));
const server=(await readFile('src/server.mjs','utf8')).replace("import {enrichEdition,mergeArchive} from './archive.mjs';",'').replace("import {handleReviews} from './reviews.mjs';",'');
await writeFile('dist/server/index.js',server.replace('/*HTML*/null',JSON.stringify(html)).replace('/*CONTENT*/null',JSON.stringify(curated)).replace('/*INSTITUTIONS*/null',JSON.stringify(institutions)).replace('/*ARCHIVE_SERVER*/',archive+'\n'+reviewServer));
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Built worker with embedded UI');

