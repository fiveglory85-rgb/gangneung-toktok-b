import {readFile,writeFile} from 'node:fs/promises';import {buildCurated} from '../src/content.mjs';import {mergeArchive} from '../src/archive.mjs';
let previous=[];try{previous=JSON.parse(await readFile('data/editions.json','utf8'))}catch(e){if(e.code!=='ENOENT')throw e}
const current=buildCurated(JSON.parse(await readFile('data/reference.json','utf8')));const editions=mergeArchive(previous,current);
await writeFile('data/editions.json',JSON.stringify(editions,null,2)+'\n');console.log('Archive contains '+editions.length+' retained editions. Existing snapshots were preserved.');
