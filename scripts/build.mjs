import {readFile,mkdir,writeFile,copyFile} from 'node:fs/promises';
await mkdir('dist/server',{recursive:true}); await mkdir('dist/.openai',{recursive:true});
const html=await readFile('src/index.html','utf8');
const server=await readFile('src/server.mjs','utf8');
await writeFile('dist/server/index.js',server.replace('/*HTML*/null',JSON.stringify(html)));
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Built worker with embedded UI');
