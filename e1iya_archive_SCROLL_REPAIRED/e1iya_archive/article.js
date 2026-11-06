(() => {
'use strict';
const all=window.ARCHIVE_RECORDS||[];
const $=id=>document.getElementById(id);
const id=new URLSearchParams(location.search).get('id'),r=all.find(x=>x.id===id);
if(!r){$('article-title').textContent='Record not found_';$('article-body').textContent='This record does not exist. Return to Archive.';return}
document.title=r.title+' — e1iya.archive';
$('record-label').textContent='RESEARCH LOG / '+r.id.split('.')[1];
$('article-title').textContent=r.title+'_';
$('article-meta').textContent=r.id+' / '+r.date+' / '+r.tags.map(t=>'#'+t).join(' ');
$('article-body').innerHTML=r.html;
const headings=[...$('article-body').querySelectorAll('h2,h3')];
headings.forEach((h,i)=>{h.id='section-'+i;const a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;a.onclick=e=>{e.preventDefault();h.scrollIntoView({behavior:'smooth'});history.replaceState(null,'','#'+h.id)};$('toc-links').append(a)});
const same=all.filter(x=>x.folder===r.folder).sort((a,b)=>b.date.localeCompare(a.date));
const pos=same.findIndex(x=>x.id===r.id);
for(const [name,other] of [['prev',same[pos-1]],['next',same[pos+1]]]){const link=$(name);if(other)link.href='article.html?id='+encodeURIComponent(other.id);else{link.classList.add('disabled');link.removeAttribute('href')}}
const codeBlocks=[...$('article-body').querySelectorAll('pre')];
codeBlocks.forEach((pre,i)=>{const box=document.createElement('div');box.className='code-fragment';const bar=document.createElement('div');bar.className='code-bar';bar.textContent='CODE FRAGMENT / '+String(i+1).padStart(3,'0');const copy=document.createElement('button');copy.textContent='COPY';copy.onclick=async()=>{const txt=pre.innerText;try{await navigator.clipboard.writeText(txt)}catch{const ta=document.createElement('textarea');ta.value=txt;document.body.append(ta);ta.select();document.execCommand('copy');ta.remove()}copy.textContent='COPIED ✓';setTimeout(()=>copy.textContent='COPY',1200)};bar.append(copy);pre.before(box);box.append(bar,pre)});
$('copyLink').onclick=async()=>{const link=location.href;try{await navigator.clipboard.writeText(link)}catch{const ta=document.createElement('textarea');ta.value=link;document.body.append(ta);ta.select();document.execCommand('copy');ta.remove()}$('copyLink').textContent='LINK COPIED ✓';setTimeout(()=>$('copyLink').textContent='COPY LINK ↗',1400)};
const tocLinks=[...$('toc-links').querySelectorAll('a')];
if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){tocLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}},{rootMargin:'-10% 0px -65% 0px'});headings.forEach(h=>io.observe(h))}
if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)setTimeout(()=>target.scrollIntoView(),30)}
})();