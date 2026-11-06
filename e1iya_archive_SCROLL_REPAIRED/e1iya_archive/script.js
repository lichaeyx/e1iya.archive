(() => {
'use strict';
const records=window.ARCHIVE_RECORDS||[];
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const folders=[...new Set(records.flatMap(r=>r.folder.split('/').map((_,i)=>r.folder.split('/').slice(0,i+1).join('/'))))].sort((a,b)=>a.localeCompare(b));
let selected='',tag='',expanded=new Set(['study']),visible=8,queue=[],busy=false,logs=[],tab='archive',returning=false;
const state=()=>({selected,tag,q:$('search').value,sort:$('sort').value});
function store(){try{sessionStorage.setItem('archive-view',JSON.stringify(state()))}catch{}}
function restore(){try{let s=JSON.parse(sessionStorage.getItem('archive-view')||'null');if(s){selected=s.selected||'';tag=s.tag||'';$('search').value=s.q||'';$('sort').value=s.sort||'new';for(let i=1;i<=selected.split('/').length;i++)expanded.add(selected.split('/').slice(0,i).join('/'))}}catch{}}
function appendLog(message,kind=''){queue.push({message,kind});if(!busy)typeNext()}
function typeNext(){if(!queue.length){busy=false;return}busy=true;let entry=queue.shift(),node=document.createElement('div');node.className='log '+entry.kind;node.textContent='> ';$('logs').append(node);logs.push(node);if(logs.length>10)logs.shift().remove();let i=0;const tick=()=>{if(i<entry.message.length){node.textContent+=entry.message[i++];setTimeout(tick,22)}else{setTimeout(typeNext,75)}};tick()}
function goArchive(folder){if(folder!==undefined)selected=folder;document.documentElement.classList.add('archive-direct');history.pushState({page:'archive'},'',location.pathname+location.search+'#archive');scrollTo(0,0);render();appendLog('OPEN /archive/'+(selected?selected+'/':''),'open')}
function goHome(){document.documentElement.classList.remove('archive-direct');history.pushState({page:'home'},'',location.pathname+location.search);scrollTo(0,0)}
function renderTree(){const tree=$('tree'),old=new Map([...tree.children].map(el=>[el.dataset.folder,el.getBoundingClientRect()]));tree.replaceChildren();
for(const folder of folders){const parts=folder.split('/'),depth=parts.length-1,parent=parts.slice(0,-1).join('/');if(parent&&!expanded.has(parent))continue;
const b=document.createElement('button');b.className='tree-item'+(selected===folder?' active':'');b.dataset.folder=folder;b.style.paddingLeft=depth*18+'px';
b.innerHTML='<span class="arrow">'+(expanded.has(folder)?'⌄':'&gt;')+'</span>'+esc(parts.at(-1))+'/';
b.onclick=()=>{expanded.has(folder)?expanded.delete(folder):expanded.add(folder);selected=folder;visible=8;render();appendLog('OPEN /archive/'+folder+'/','open')};tree.append(b)}
[...tree.children].forEach(el=>{const oldRect=old.get(el.dataset.folder),dy=oldRect?oldRect.top-el.getBoundingClientRect().top:0;
el.animate(oldRect?[{transform:`translateY(${dy}px)`},{transform:'translateY(0)'}]:[{opacity:0,transform:'translateY(-7px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'})})}
function render(){renderTree();store();let q=$('search').value.trim().toLowerCase(),sort=$('sort').value;
let items=records.filter(r=>(!selected||r.folder===selected||r.folder.startsWith(selected+'/'))&&(!tag||r.tags.some(t=>t.toLowerCase()===tag.toLowerCase()))&&[r.title,r.file,r.folder,r.summary,...r.tags].join(' ').toLowerCase().includes(q));
items.sort((a,b)=>sort==='title'?a.title.localeCompare(b.title):sort==='old'?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
$('path').textContent='/archive/'+(selected?selected+'/':'')+(tag?' #'+tag:'');
$('status').textContent='ARCHIVE ONLINE / '+String(records.length).padStart(3,'0')+' RECORDS';
const target=$('entries');target.replaceChildren();const featured=!selected&&!q&&!tag?items.filter(r=>r.featured).slice(0,3):[];
const recent=items.filter(r=>!featured.includes(r));
function heading(t){let h=document.createElement('div');h.className='section-title';h.textContent=t;target.append(h)}
function item(r){let row=document.createElement('div');row.className='record-row';
let b=document.createElement('button');b.className='record'+(localStorage.getItem('read_'+r.id)?' read':'');b.innerHTML=(r.featured?'✦ ':'')+esc(r.title)+' <span class="record-arrow">↗</span><span class="meta">'+esc(r.file)+' · '+esc(r.date)+'</span>';b.onclick=()=>openRecord(r);row.append(b);
let tags=document.createElement('div');tags.className='tags';for(const t of r.tags){let tb=document.createElement('button');tb.textContent='#'+t;tb.className='tag'+(tag===t?' active':'');tb.onclick=()=>{tag=tag===t?'':t;visible=8;render();appendLog('SEARCH #'+t,'searchlog')};tags.append(tb)}row.append(tags);target.append(row)}
if(featured.length){heading('FEATURED RECORDS');featured.forEach(item)}
heading('RECENT ENTRIES');recent.slice(0,visible).forEach(item);
if(!items.length)target.innerHTML='<div class="empty">☾<strong>Nothing but silence_</strong>Some fragments have yet to be found.</div>';
$('load').hidden=recent.length<=visible}
function openRecord(r){try{localStorage.setItem('read_'+r.id,'1')}catch{};store();appendLog('READ '+r.id,'read');location.href='article.html?id='+encodeURIComponent(r.id)}
function showAbout(){const o=$('aboutOverlay');o.hidden=false;appendLog('OPEN identity_e1iya.sys','open')}
function hideAbout(){$('aboutOverlay').hidden=true;appendLog('CLOSE identity_e1iya.sys')}
function setTab(t){tab=t;document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));$('archive').dataset.mobileTab=t}
const about=window.ABOUT_CONTENT||{};$('aboutLabel').textContent=about.label||'IDENTITY FILE / e1iya';$('aboutHeading').textContent=about.heading||'Behind the signal_';$('aboutPoem').textContent=about.poem||'';for(const [key,value] of Object.entries(about.fields||{})){const el=document.createElement('p');el.textContent=key+' : '+value;$('aboutFields').append(el)}
restore();
$('heroScroll').onclick=()=>goArchive('');
$('heroArchive').onclick=()=>goArchive('');
document.querySelectorAll('[data-folder]').forEach(b=>b.onclick=()=>goArchive(b.dataset.folder));
$('heroAbout').onclick=showAbout;
$('logo').onclick=$('navHome').onclick=goHome;
$('navArchive').onclick=()=>goArchive();
$('navAbout').onclick=showAbout;
$('closeAbout').onclick=hideAbout;
$('aboutOverlay').onclick=e=>{if(e.target===$('aboutOverlay'))hideAbout()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('aboutOverlay').hidden)hideAbout();if(e.key==='/'&&document.documentElement.classList.contains('archive-direct')&&document.activeElement.tagName!=='INPUT'){e.preventDefault();$('search').focus()}});
$('search').oninput=()=>{visible=8;render();appendLog('SEARCH '+$('search').value,'searchlog')};
$('sort').onchange=render;
$('load').onclick=()=>{visible+=8;render()};
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
addEventListener('popstate',()=>{document.documentElement.classList.toggle('archive-direct',location.hash==='#archive');scrollTo(0,0)});
if(location.hash==='#archive')document.documentElement.classList.add('archive-direct');
setTab('archive');render();appendLog('SYSTEM ARCHIVE ONLINE');
})();