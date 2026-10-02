export type Lead = {
  id:string; createdAt:string; source:string; status:'new'|'contacted'|'qualified'|'closed';
  name:string; phone:string; eventType:string; city:string; message:string;
};
export type Vendor = {
  id:string; createdAt:string; status:'new'|'approved'|'hold'|'rejected';
  name:string; phone:string; business:string; category:string; city:string; event:string; location:string; packageName:string; notes:string; paymentFile:string;
};
export type Customer = {
  id:string; createdAt:string; status:'new'|'registered'|'attended'|'closed';
  name:string; phone:string; interest:string; category:string; city:string; event:string; location:string; registration:string; notes:string;
};
export type EventRecord = {
  id:string; createdAt:string; name:string; type:string; date:string; city:string; venue:string; status:'draft'|'planned'|'live'|'completed'; capacity:string; notes:string;
};
export type Payment = { id:string; createdAt:string; party:string; type:'vendor'|'customer'|'expense'; amount:number; status:'pending'|'paid'|'verified'; reference:string; notes:string };
export type Task = { id:string; createdAt:string; title:string; owner:string; due:string; status:'todo'|'progress'|'done'; priority:'low'|'medium'|'high' };

export type CRMState = { leads:Lead[]; vendors:Vendor[]; customers:Customer[]; events:EventRecord[]; payments:Payment[]; tasks:Task[] };
const KEY='exovia-crm-v2';
const empty:CRMState={leads:[],vendors:[],customers:[],events:[],payments:[],tasks:[]};

export function loadCRM():CRMState{
  try { const raw=localStorage.getItem(KEY); return raw ? {...empty,...JSON.parse(raw)} : empty; } catch { return empty; }
}
export function saveCRM(state:CRMState){ localStorage.setItem(KEY,JSON.stringify(state)); window.dispatchEvent(new CustomEvent('exovia-crm-change')); }
export function addCRM<K extends keyof CRMState>(kind:K, record:CRMState[K][number]):CRMState{
  const state=loadCRM();
  (state[kind] as unknown[]).unshift(record);
  saveCRM(state); return state;
}
export function updateCRM<K extends keyof CRMState>(kind:K,id:string,patch:Partial<CRMState[K][number]>):CRMState{
  const state=loadCRM();
  state[kind]=(state[kind] as any[]).map(x=>x.id===id?{...x,...patch}:x) as CRMState[K];
  saveCRM(state); return state;
}
export function removeCRM<K extends keyof CRMState>(kind:K,id:string):CRMState{
  const state=loadCRM();
  state[kind]=(state[kind] as any[]).filter(x=>x.id!==id) as CRMState[K];
  saveCRM(state); return state;
}
export function makeId(prefix:string){ return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`; }
export function csv(rows:any[]){
  if(!rows.length) return '';
  const cols=Object.keys(rows[0]);
  return [cols.join(','),...rows.map(r=>cols.map(c=>`"${String(r[c]??'').replaceAll('"','""')}"`).join(','))].join('\n');
}
export function download(filename:string, content:string, type='text/plain'){
  const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}
