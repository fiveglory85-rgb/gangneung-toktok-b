import {DatabaseSync} from 'node:sqlite';import {readFileSync,readdirSync,mkdirSync} from 'node:fs';
export function localD1(filename=':memory:'){
 if(filename!==':memory:')mkdirSync('.local',{recursive:true});const sqlite=new DatabaseSync(filename);sqlite.exec('PRAGMA foreign_keys=ON');
 const exists=sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='reviews'").get();if(!exists)for(const f of readdirSync('drizzle').filter(x=>x.endsWith('.sql')).sort())sqlite.exec(readFileSync('drizzle/'+f,'utf8'));
 const wrap=(sql,args=[])=>({bind(...values){return wrap(sql,values)},async all(){return {results:sqlite.prepare(sql).all(...args),success:true}},async run(){let r=sqlite.prepare(sql).run(...args);return {success:true,meta:{changes:Number(r.changes)}}}});
 return {prepare:sql=>wrap(sql),async batch(statements){sqlite.exec('BEGIN');try{const r=[];for(const s of statements)r.push(await s.run());sqlite.exec('COMMIT');return r}catch(e){sqlite.exec('ROLLBACK');throw e}},close(){sqlite.close()}};
}
