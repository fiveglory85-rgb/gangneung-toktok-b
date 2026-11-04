import {readFile,mkdir,writeFile,copyFile} from 'node:fs/promises';
import {buildCurated,institutions} from '../src/content.mjs';
await mkdir('dist/server',{recursive:true}); await mkdir('dist/.openai',{recursive:true});
let html=await readFile('src/home.html','utf8');
const logic=(await readFile('src/logic.mjs','utf8')).replaceAll('export ','');
const app=(await readFile('src/app.js','utf8')).replace('/*LOGIC*/',logic);
html=html.replace('/*STYLES*/',await readFile('src/styles.css','utf8')).replace('/*APP*/',app);
const curated=buildCurated(JSON.parse(await readFile('data/reference.json','utf8')));
const server=await readFile('src/server.mjs','utf8');
await writeFile('dist/server/index.js',server.replace('/*HTML*/null',JSON.stringify(html)).replace('/*CONTENT*/null',JSON.stringify(curated)).replace('/*INSTITUTIONS*/null',JSON.stringify(institutions)));
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Built worker with embedded UI');

