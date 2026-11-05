const room=document.getElementById('room');let selected=null;let id=0;
const auditItems=[
"Semua peserta didik dapat melihat papan tulis dari tempat duduknya.",
"Guru dapat melihat seluruh peserta didik dari beberapa titik di kelas.",
"Guru dapat menjangkau setiap kelompok atau barisan tanpa melangkahi perabot.",
"Jalur dari pintu ke tempat duduk dan ke rak bebas hambatan.",
"Perlengkapan yang sering dipakai mudah diambil.",
"Susunan sesuai dengan kegiatan yang sedang dilakukan.",
"Cahaya dari jendela tidak menyilaukan papan tulis atau mata peserta didik.",
"Susunan dapat diubah dengan cepat dan mudah oleh guru dan peserta didik."
];
function addItem(label,type,x=330,y=150){
 const el=document.createElement('div');el.className='item '+type;el.textContent=label;el.dataset.movable='1';el.dataset.id=++id;
 el.style.left=x+'px';el.style.top=y+'px';room.appendChild(el);makeDraggable(el);selectItem(el);
}
function selectItem(el){if(selected)selected.classList.remove('selected');selected=el;if(el)el.classList.add('selected')}
function makeDraggable(el){
 let startX,startY,left,top,drag=false;
 el.addEventListener('pointerdown',e=>{drag=true;selectItem(el);el.setPointerCapture(e.pointerId);startX=e.clientX;startY=e.clientY;left=parseFloat(el.style.left);top=parseFloat(el.style.top);e.preventDefault()});
 el.addEventListener('pointermove',e=>{if(!drag)return;let scale=room.getBoundingClientRect().width/800;el.style.left=Math.max(0,Math.min(800-el.offsetWidth,left+(e.clientX-startX)/scale))+'px';el.style.top=Math.max(45,Math.min(700-el.offsetHeight,top+(e.clientY-startY)/scale))+'px'});
 el.addEventListener('pointerup',()=>drag=false);el.addEventListener('pointercancel',()=>drag=false);
 el.addEventListener('click',()=>selectItem(el));
}
function removeSelected(){if(selected&&selected.dataset.movable){selected.remove();selected=null}}
function clearMovables(){room.querySelectorAll('[data-movable="1"]').forEach(e=>e.remove());selected=null}
function setLayout(type){
 clearMovables();
 if(type==='baris'){
  [95,205,315,425].forEach(y=>[85,190,295,400,505,610].forEach(x=>addItem('Meja','desk',x,y)));
 }else if(type==='kelompok'){
  [90,365].forEach(x=>[115,315,515].forEach(y=>{[[0,0],[75,0],[0,62],[75,62]].forEach(([dx,dy])=>addItem('Meja','desk',x+dx,y+dy))}));
 }else{
  [75,175,275,375,475,575,675].forEach(x=>{addItem('Meja','desk',x,90);addItem('Meja','desk',x,600)});
  [195,295,395].forEach(y=>{addItem('Meja','desk',75,y);addItem('Meja','desk',675,y)});
 }
 document.querySelector('[data-tab="simulasi"]').click();
}
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));
 document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
 b.classList.add('active');document.getElementById(b.dataset.tab).classList.add('active');
}));
function buildAudit(){
 const list=document.getElementById('auditList');
 auditItems.forEach((t,i)=>{const row=document.createElement('div');row.className='audit-row';row.innerHTML=`<label><b>${i+1}.</b> ${t}</label><label class="audit-yes"><input type="checkbox" class="audit-check" aria-label="Ya untuk indikator ${i+1}"> Ya</label>`;list.appendChild(row)});
 list.addEventListener('change',updateScore);
}
function updateScore(){let n=document.querySelectorAll('.audit-check:checked').length;document.getElementById('score').textContent=n;document.getElementById('feedback').textContent=n===8?'Semua indikator terpenuhi. Pertahankan kondisi ruang kelas.':n>=6?`Sudah memenuhi ${n} dari 8 indikator. Periksa kembali indikator yang belum terpenuhi.`:`${n} dari 8 indikator terpenuhi. Perlu perbaikan pada beberapa aspek penataan.`}
function resetAudit(){document.querySelectorAll('.audit-check').forEach(x=>x.checked=false);updateScore()}
buildAudit();
setLayout('baris');