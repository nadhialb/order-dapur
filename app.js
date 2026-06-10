// ═══════════════════════════════════════════════════
// CONFIG & CONSTANTS
// ═══════════════════════════════════════════════════
const SB_URL='https://iwwugdsvetcxouuuubiz.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3VnZHN2ZXRjeG91dXV1Yml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzQxMzQsImV4cCI6MjA5NTgxMDEzNH0.XQcRDZiKy-lMLYjGP5JMcSPDoDzmbXvIww7g2wO8IfY';
const H=()=>({'apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`,'Content-Type':'application/json','Prefer':'return=representation'});
const sbG=async(t,p='')=>{const r=await fetch(`${SB_URL}/rest/v1/${t}?${p}`,{headers:H()});if(!r.ok)throw new Error(`GET ${t}:${r.status}`);return r.json();};
const sbP=async(t,b)=>{const r=await fetch(`${SB_URL}/rest/v1/${t}`,{method:'POST',headers:H(),body:JSON.stringify(b)});if(!r.ok)throw new Error(`POST ${t}:${r.status} ${await r.text()}`);return r.json();};
const sbPa=async(t,p,b)=>{const r=await fetch(`${SB_URL}/rest/v1/${t}?${p}`,{method:'PATCH',headers:H(),body:JSON.stringify(b)});if(!r.ok)throw new Error(`PATCH ${t}:${r.status}`);return r.json();};
const sbU=async(t,b)=>{const r=await fetch(`${SB_URL}/rest/v1/${t}`,{method:'POST',headers:{...H(),'Prefer':'resolution=merge-duplicates,return=representation'},body:JSON.stringify(b)});if(!r.ok)throw new Error(`UPSERT ${t}:${r.status}`);return r.json();};
const sbD=async(t,p)=>{const r=await fetch(`${SB_URL}/rest/v1/${t}?${p}`,{method:'DELETE',headers:H()});if(!r.ok)throw new Error(`DELETE ${t}:${r.status}`);};

// ═══════════════════════════════════════════════════
// DAPUR CONFIG
// ═══════════════════════════════════════════════════
const DAPURS_DEFAULT=[
  {id:'kebonsari-001', name:'Kebonsari 001', icon:'🍗', pattern:'pattern-e', accent:'#60a5fa', bg:'#1a3a6e'},
  {id:'ajung-ajung-3', name:'Ajung Ajung 3', icon:'🥩', pattern:'pattern-b', accent:'#4ade80', bg:'#1a3d2e'},
  {id:'dapur-3',       name:'Dapur 3',       icon:'🍳', pattern:'pattern-d', accent:'#fbbf24', bg:'#3d2800'},
  {id:'dapur-4',       name:'Dapur 4',       icon:'🥪', pattern:'pattern-c', accent:'#a78bfa', bg:'#2d1a5e'},
];

function getDAPURS(){
  try{
    const saved=JSON.parse(localStorage.getItem('kok_dapur_names')||'{}');
    return DAPURS_DEFAULT.map(d=>({...d, name:saved[d.id]||d.name}));
  }catch(e){return DAPURS_DEFAULT;}
}
let DAPURS=getDAPURS();

function saveDapurName(id, name){
  try{
    const saved=JSON.parse(localStorage.getItem('kok_dapur_names')||'{}');
    saved[id]=name;
    localStorage.setItem('kok_dapur_names', JSON.stringify(saved));
    DAPURS=getDAPURS();
  }catch(e){}
}


// ═══════════════════════════════════════════════════
// THEME (DARK / LIGHT)
// ═══════════════════════════════════════════════════
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme');
  const next=cur==='light'?'dark':'light';
  applyThemeMode(next);
}
function applyThemeMode(mode){
  if(mode==='light'){
    document.documentElement.setAttribute('data-theme','light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  const btn=document.getElementById('theme-toggle');
  if(btn) btn.textContent=mode==='light'?'🌙':'☀️';
  try{localStorage.setItem('kok_theme',mode);}catch(e){}
}
function loadTheme(){
  const saved=localStorage.getItem('kok_theme')||'dark';
  applyThemeMode(saved);
}

// ═══════════════════════════════════════════════════
// KATEGORI
// ═══════════════════════════════════════════════════
const CC={
  beras:  {l:'Beras',          e:'🌾',c:'#f59e0b',b:'rgba(245,158,11,.18)'},
  protein:{l:'Protein Hewani', e:'🍗',c:'#f87171',b:'rgba(248,113,113,.18)'},
  ayam:   {l:'Ayam Fresh',     e:'🐔',c:'#fb923c',b:'rgba(251,146,60,.18)'},
  frozen: {l:'Frozen Food',    e:'🧊',c:'#94a3b8',b:'rgba(148,163,184,.18)'},
  tempe:  {l:'Tempe',          e:'🫘',c:'#4ade80',b:'rgba(74,222,128,.18)'},
  tahu:   {l:'Tahu',           e:'⬜',c:'#f472b6',b:'rgba(244,114,182,.18)'},
  susu:   {l:'Susu UHT',       e:'🥛',c:'#60a5fa',b:'rgba(96,165,250,.18)'},
  buah:   {l:'Buah',           e:'🍊',c:'#c084fc',b:'rgba(192,132,252,.18)'},
  sayur:  {l:'Sayuran',        e:'🥬',c:'#34d399',b:'rgba(52,211,153,.18)'},
  bumbu:  {l:'Bumbu',          e:'🧄',c:'#fbbf24',b:'rgba(251,191,36,.18)'},
  lain:   {l:'Lainnya',        e:'📦',c:'#8a9ab8',b:'rgba(138,154,184,.18)'},
};
const CO=['beras','protein','ayam','frozen','tempe','tahu','susu','buah','sayur','bumbu','lain'];
const FK=['ayam dada fillet','ayam giling','french fries'];
const AK=['ayam paha','ayam potong','ayam kampung'];
const PISANG_KW=['pisang'];
const BUAH_KW=['apel','mangga','pepaya','nanas','semangka','melon','anggur','kelengkeng','lengkeng','leci','kiwi','strawberry','jambu','salak','rambutan','durian','alpukat','lemon','markisa','sirsak','belimbing','duku','manggis','sawo','nangka','kurma','buah naga','kesemek','srikaya'];
const BUMBU_KW=['bawang','bombay','garam','gula','merica','lada','cabe','cabai','rawit','kunyit','kunir','jahe','lengkuas','laos','kencur','temulawak','temu kunci','ketumbar','jintan','adas','pala','cengkeh','kayu manis','kapulaga','bunga lawang','kemiri','kluwek','asam jawa','asam kandis','asam','kari','bumbu','rempah','kaldu','daun salam','daun jeruk','daun pandan','daun kemangi','daun kari','daun bawang','serai','sereh','daun kunyit','daun suji','daun pepaya','daun singkong','seledri','peterseli','saos','saus','kecap','sambal','terasi','petis','tauco','tiram','inggris','teriyaki','worcester','minyak','margarin','mentega','butter','shortening','tepung','maizena','tapioka','sagu','tepung beras','knorr','royco','masako','ajinomoto','ajinamoto','micin','msg','penyedap','mayonaise','mayo','mustard','siracha','keju','krim','santan','coconut','evaporasi','madu','sirup','cuka','vanili','vanilla','baking','soda kue','ragi','yeast','pewarna','essence','pasta','paprika','oregano','thyme','rosemary','kulit pangsit','saffron'];
const SAYUR_KW=['sawi','wortel','kubis','kol','selada','bayam','kangkung','buncis','terong','jagung','timun','mentimun','labu siam','pare','brokoli','kembang kol','kacang panjang','tauge','toge','rebung','asparagus','tomat','kentang','singkong','ubi','talas','lobak','bengkuang','nangka muda','melinjo','pete','petai','jengkol','oyong','gambas','okra'];

let CUSTOM_KAT={};

function gc(b){
  if(!b) return 'lain';
  const n=b.toLowerCase().trim();
  if(CUSTOM_KAT[n]) return CUSTOM_KAT[n];
  for(const[k,v]of Object.entries(CUSTOM_KAT)){if(n.includes(k))return v;}
  if(n==='nasi'||n.startsWith('nasi ')) return 'beras';
  if(n.includes('beras')) return 'beras';
  if(n.includes('susu'))  return 'susu';
  if(n.includes('tempe')) return 'tempe';
  if(/\btahu\b/.test(n))  return 'tahu';
  if(FK.some(k=>n.includes(k))) return 'frozen';
  if(AK.some(k=>n.includes(k))) return 'ayam';
  if(['telur','daging','ikan','udang','cumi','sapi','kambing','ayam'].some(k=>n.includes(k))) return 'protein';
  if(n.includes('jeruk')&&!n.includes('daun')&&!n.includes('kulit')&&!n.includes('air')) return 'buah';
  if(PISANG_KW.some(k=>n.includes(k))) return 'buah';
  if(BUAH_KW.some(k=>n.includes(k)))   return 'buah';
  if(BUMBU_KW.some(k=>n.includes(k)))  return 'bumbu';
  if(SAYUR_KW.some(k=>n.includes(k)))  return 'sayur';
  return 'lain';
}

function isPisang(b){return b&&PISANG_KW.some(k=>b.toLowerCase().includes(k));}

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
const BULAN=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const HARI=['Minggu','Senin','Selasa','Rabu','Kamis',"Jum'at",'Sabtu'];
const BULAN_SHORT=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

function normSat(s){if(!s)return'';const n=s.toLowerCase().trim();if(['l','liter','ltr','lt','litre'].includes(n))return'ltr';return s.trim();}
function fNum(n){if(n===null||n===undefined||n==='')return'';return Number(n).toLocaleString('id-ID');}
function toTitle(s){if(!s)return'';return s.trim().replace(/\w\S*/g,w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase());}
function escH(s){return(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}

function toast(msg,dur=2400){
  const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');
  clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),dur);
}
function setLoad(on){const el=document.getElementById('loading-bar');if(el)el.style.width=on?'65%':'0';}

function fmtTgl(str){
  if(!str)return str;
  const ok=/^(Senin|Selasa|Rabu|Kamis|Jum'at|Sabtu|Minggu),\s(\d{2})\s(\w+)\s(\d{4})$/;
  if(ok.test(str))return str;
  const wh=/^(Senin|Selasa|Rabu|Kamis|Jum'at|Sabtu|Minggu),\s(\d{1,2})\s(\w+)\s(\d{4})$/;
  const wm=str.match(wh);
  if(wm){const dd=String(parseInt(wm[2])).padStart(2,'0');const bi=BULAN.findIndex(b=>b.toLowerCase()===wm[3].toLowerCase());return`${wm[1]}, ${dd} ${bi>=0?BULAN[bi]:wm[3]} ${wm[4]}`;}
  const m=str.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if(!m)return str;
  const dd=String(parseInt(m[1])).padStart(2,'0');
  const bi=BULAN.findIndex(b=>b.toLowerCase()===m[2].toLowerCase());
  if(bi<0)return str;
  const dt=new Date(parseInt(m[3]),bi,parseInt(m[1]));
  return`${HARI[dt.getDay()]}, ${dd} ${BULAN[bi]} ${m[3]}`;
}

function orderDay(tglStr){
  const m=tglStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if(!m)return'';
  const bi=BULAN.findIndex(b=>b.toLowerCase()===m[2].toLowerCase());
  if(bi<0)return'';
  const dt=new Date(parseInt(m[3]),bi,parseInt(m[1]));
  dt.setDate(dt.getDate()-1);
  const dd=String(dt.getDate()).padStart(2,'0');
  return`${HARI[dt.getDay()]}, ${dd} ${BULAN[dt.getMonth()]} ${dt.getFullYear()}`;
}

function shortDay(n){
  const m=n.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if(!m)return n.split(',')[0];
  const bi=BULAN.findIndex(b=>b.toLowerCase()===m[2].toLowerCase());
  const dt=new Date(parseInt(m[3]),bi>=0?bi:0,parseInt(m[1]));
  const dd=String(parseInt(m[1])).padStart(2,'0');
  const mm=String((bi>=0?bi:0)+1).padStart(2,'0');
  return`${HARI[dt.getDay()].slice(0,3)}\n${dd}/${mm}`;
}

// Cek notifikasi H berapa untuk suatu hari menu
function getDaysUntil(tglStr){
  if(!tglStr) return null;
  const m=tglStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if(!m) return null;
  const bi=BULAN.findIndex(b=>b.toLowerCase()===m[2].toLowerCase());
  if(bi<0) return null;
  const target=new Date(parseInt(m[3]),bi,parseInt(m[1]));
  target.setHours(0,0,0,0);
  const today=new Date();today.setHours(0,0,0,0);
  return Math.round((target-today)/(1000*60*60*24));
}

// ═══════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════
let curDapurId=null, curDapurCfg=null;
let CK={}, STOK=[], SUMBER=['Beli Sendiri','Stok Sendiri','Dapur Sempolan','Kejayan'];
let curWeekId=null, curTab='dashboard-dapur', prevView='dashboard';

let WD={days:[]};

const DEFAULT_WD={days:[
  {n:"Selasa, 02 Juni 2026",od:"Senin, 01 Juni 2026",os:"Senin 01/06",items:[
    {b:"Beras",q:150,s:"kg",h:16000,hb:null,ket:""},{b:"Ayam Dada Fillet",q:170,s:"kg",h:51500,hb:null,ket:""},
    {b:"Tempe",q:75,s:"kg",h:15000,hb:null,ket:""},{b:"Susu UHT",q:5,s:"ltr",h:23000,hb:null,ket:""},
    {b:"Jeruk Jawara",q:240,s:"kg",h:22000,hb:null,ket:""},{b:"Sawi Putih",q:70,s:"kg",h:11000,hb:null,ket:""},
    {b:"Wortel",q:20,s:"kg",h:10000,hb:null,ket:""},{b:"Pisang Berlin",q:4800,s:"pcs",h:850,hb:null,ket:""},
    {b:"Garam",q:3,s:"kg",h:9000,hb:null,ket:""},{b:"Bawang Putih",q:2,s:"kg",h:30000,hb:null,ket:""},
  ]},
  {n:"Kamis, 04 Juni 2026",od:"Rabu, 03 Juni 2026",os:"Rabu 03/06",items:[
    {b:"Beras",q:150,s:"kg",h:16000,hb:null,ket:""},{b:"Ayam Paha (Potong 10)",q:240,s:"kg",h:36000,hb:null,ket:""},
    {b:"Tempe",q:90,s:"kg",h:15000,hb:null,ket:""},{b:"Apel Manalagi",q:175,s:"kg",h:32000,hb:null,ket:""},
  ]},
]};

function saveLocal(){
  try{localStorage.setItem(`kok_${curDapurId}`,JSON.stringify({WD,CK,STOK,curWeekId}));}catch(e){}
  try{localStorage.setItem('kok_global',JSON.stringify({SUMBER,CUSTOM_KAT}));}catch(e){}
}
function loadLocal(dapurId){
  try{
    const s=JSON.parse(localStorage.getItem(`kok_${dapurId}`)||'{}');
    WD=s.WD||JSON.parse(JSON.stringify(DEFAULT_WD));
    CK=s.CK||{};STOK=s.STOK||[];curWeekId=s.curWeekId||null;
  }catch(e){WD=JSON.parse(JSON.stringify(DEFAULT_WD));CK={};STOK=[];curWeekId=null;}
  try{
    const g=JSON.parse(localStorage.getItem('kok_global')||'{}');
    if(g.SUMBER)SUMBER=g.SUMBER;
    if(g.CUSTOM_KAT)CUSTOM_KAT=g.CUSTOM_KAT;
  }catch(e){}
}

// ═══════════════════════════════════════════════════
// DB OPS
// ═══════════════════════════════════════════════════
async function dbSave(){
  try{
    setLoad(true);
    const label=getWeekLabel();
    if(curWeekId){
      await sbPa('weeks',`id=eq.${curWeekId}`,{data:WD,label,dapur_id:curDapurId,updated_at:new Date().toISOString()});
      await sbPa('checklist',`week_id=eq.${curWeekId}`,{ck_data:CK});
      await sbPa('stok',`week_id=eq.${curWeekId}`,{items:STOK});
    }else{
      const rows=await sbP('weeks',{label,data:WD,dapur_id:curDapurId});
      curWeekId=rows[0].id;
      await sbP('checklist',{week_id:curWeekId,ck_data:CK});
      await sbP('stok',{week_id:curWeekId,items:STOK});
    }
    saveLocal();setLoad(false);toast('✓ Tersimpan ke database!');
  }catch(e){setLoad(false);toast('⚠️ Gagal simpan: '+e.message,4000);}
}
async function dbLoadWeeks(dapurId){
  try{setLoad(true);const r=await sbG('weeks',`dapur_id=eq.${dapurId}&order=updated_at.desc&limit=30`);setLoad(false);return r;}
  catch(e){setLoad(false);toast('⚠️ '+e.message,3000);return[];}
}
async function dbLoadWeek(id){
  try{
    setLoad(true);
    const[w,c,s]=await Promise.all([sbG('weeks',`id=eq.${id}`),sbG('checklist',`week_id=eq.${id}`),sbG('stok',`week_id=eq.${id}`)]);
    setLoad(false);return{week:w[0],ck:c[0],stok:s[0]};
  }catch(e){setLoad(false);return null;}
}
async function dbDelWeek(id){setLoad(true);await sbD('weeks',`id=eq.${id}`);setLoad(false);}
async function dbLoadCustomKat(){
  try{const r=await sbG('custom_kategori','');r.forEach(x=>{CUSTOM_KAT[x.bahan_key]=x.kategori;});}catch(e){}
}
async function dbSaveCustomKat(name,kat){
  const key=name.toLowerCase().trim();CUSTOM_KAT[key]=kat;
  try{await sbU('custom_kategori',{bahan_key:key,bahan_name:name,kategori:kat,updated_at:new Date().toISOString()});}catch(e){}
  saveLocal();
}
async function dbDelCustomKat(key){
  delete CUSTOM_KAT[key];
  try{await sbD('custom_kategori',`bahan_key=eq.${encodeURIComponent(key)}`);}catch(e){}
  saveLocal();
}
async function dbSaveSettings(){
  try{await sbU('settings',{key:'sumber',value:SUMBER,updated_at:new Date().toISOString()});}catch(e){}
  saveLocal();
}
async function dbLoadSettings(){
  try{const r=await sbG('settings','key=eq.sumber');if(r[0])SUMBER=r[0].value;}catch(e){}
}

// ═══════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════
function showPage(id){
  document.querySelectorAll('.page').forEach(v=>v.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
}

function openDapur(dapurId){
  const cfg=DAPURS.find(d=>d.id===dapurId);
  if(!cfg)return;
  curDapurId=dapurId;curDapurCfg=cfg;
  loadLocal(dapurId);
  applyDapurTheme(cfg);

  // Update topbar dapur
  const topbar=document.getElementById('dapur-topbar');
  topbar.className='dapur-topbar '+cfg.pattern;
  document.getElementById('dapur-title').textContent=cfg.icon+' '+cfg.name;
  document.getElementById('dapur-sub').textContent=
    WD.days[0]?fmtTgl(WD.days[0].n):'Belum ada data';

  // Init tab bar event listeners (sekali saja)
  if(!topbar._tabsInit){
    document.querySelectorAll('.tb').forEach(btn=>{
      btn.addEventListener('click',function(){
        switchTab(this.dataset.tab);
      });
    });
    topbar._tabsInit=true;
  }

  window.location.hash=dapurId;
  showPage('dapur');
  switchTab('ringkasan');
  updateProgress();
}


function resetToBaseTheme(mode){
  const r = document.documentElement.style;
  // Hapus semua CSS variable override dari dapur theme
  r.removeProperty('--bg');
  r.removeProperty('--bg2');
  r.removeProperty('--bg3');
  r.removeProperty('--surface');
  r.removeProperty('--surface2');
  r.removeProperty('--accent');
  // Set data-theme attribute saja, biarkan CSS menangani
  if(mode === 'light'){
    document.documentElement.setAttribute('data-theme','light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

function goBack(){
  window.location.hash='';
  // Reset CSS variables ke default (dark/light sesuai user preference, bukan tema dapur)
  const savedTheme = localStorage.getItem('kok_theme') || 'dark';
  resetToBaseTheme(savedTheme);
  showPage('dashboard');
  renderDashboard();
}

function goSettings(){
  prevView=document.querySelector('.view.active')?.id?.replace('view-','');
  showPage('settings');
  renderSettings();
}

function applyDapurTheme(cfg){
  // Set accent warna dapur untuk tab indicator
  // Gunakan cfg.accent (dari DAPURS_DEFAULT baru, bukan cfg.theme)
  const accent = cfg.accent || cfg.theme?.accent || '#6366f1';
  document.documentElement.style.setProperty('--dapur-accent', accent);
  document.documentElement.setAttribute('data-dapur', cfg.id);
}

function switchTab(name){
  curTab=name;
  // Tab buttons
  document.querySelectorAll('.tb').forEach(b=>{
    b.classList.toggle('active', b.dataset.tab===name);
  });
  // Panels
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  const panel=document.getElementById('panel-'+name);
  if(panel) panel.classList.add('active');
  // Render
  const map={
    ringkasan:   renderRingkasan,
    input:       ()=>renderInput(false),
    pesan:       renderOrderH,
    checklist:   renderCL,
    rekap:       renderRekap,
    stok:        renderStok,
    histori:     rHist,
  };
  if(map[name]) map[name]();
}

function toggleMore(){return;// removed

  document.getElementById('more-overlay').classList.toggle('show');
  document.getElementById('more-menu').classList.toggle('show');
}

// ═══════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════
function renderDashboardStok(){
  const cont=document.getElementById('dash-stok-c');
  if(!cont) return;
  cont.innerHTML='';

  // Kumpulkan semua data stok
  const allItems={};
  DAPURS.forEach(d=>{
    try{
      const s=JSON.parse(localStorage.getItem('kok_'+d.id)||'{}');
      (s.STOK||[]).forEach(item=>{
        if(!item.b) return;
        const key=item.b.toLowerCase().trim();
        if(!allItems[key]) allItems[key]={name:item.b,sat:item.s,perDapur:{}};
        // Support format baru (jml) dan lama (qdapur)
        const qty=item.jml!=null?item.jml:(item.qdapur!=null?item.qdapur:null);
        if(qty!=null) allItems[key].perDapur[d.id]=(allItems[key].perDapur[d.id]||0)+qty;
      });
    }catch(e){}
  });

  const items=Object.values(allItems);

  // Entitas: Koperasi + tiap dapur
  const entities=DAPURS.map(d=>({id:d.id, name:d.name, icon:d.icon}));

  entities.forEach(entity=>{
    const hasData = items.some(it=>it.perDapur[entity.id]>0);
    if(!hasData) return;

    const entityItems = items.filter(it=> it.perDapur[entity.id]>0);

    const wrap=document.createElement('div');
    wrap.className='stok-entity-block';
    wrap.innerHTML=`
      <div class="stok-entity-title">${entity.icon} ${entity.name}</div>
      <div style="overflow-x:auto">
        <table class="stok-entity-table">
          <thead><tr>
            <th style="text-align:left;min-width:120px">Bahan</th>
            <th style="text-align:right;min-width:80px">Jumlah</th>
            <th style="text-align:center;min-width:60px">Satuan</th>
          </tr></thead>
          <tbody>
            ${entityItems.map(it=>{
              const qty=it.perDapur[entity.id];
              return `<tr>
                <td style="font-weight:500">${escH(it.name)}</td>
                <td class="se-num">${fNum(qty)}</td>
                <td class="se-sat">${escH(normSat(it.sat||''))}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
    cont.appendChild(wrap);
  });

  if(!cont.children.length){
    cont.innerHTML='<p class="empty" style="padding:1.5rem 0;text-align:center">Belum ada data stok dari dapur manapun.</p>';
  }
}


function renderDashboard(){
  // Date
  const today=new Date();
  document.getElementById('dash-date').textContent=
    `${HARI[today.getDay()]}, ${String(today.getDate()).padStart(2,'0')} ${BULAN[today.getMonth()]} ${today.getFullYear()}`;

  // Alert strip — cek semua dapur dari localStorage
  const alerts=[];
  DAPURS.forEach(d=>{
    try{
      const s=JSON.parse(localStorage.getItem(`kok_${d.id}`)||'{}');
      const wd=s.WD;if(!wd)return;
      const ck=s.CK||{};
      wd.days.forEach((day,di)=>{
        const daysUntil=getDaysUntil(day.n);
        if(daysUntil===null)return;
        day.items.forEach((item,ii)=>{
          if(ck[`${di}_${ii}`])return; // sudah diorder
          const isP=isPisang(item.b);
          const duOrder=daysUntil!==null?daysUntil-1:null;
          if(isP&&duOrder!==null&&duOrder<=4&&duOrder>0){
            alerts.push({type:'h4',dapur:d.name,icon:d.icon,bahan:item.b,qty:item.q,sat:item.s});
          } else if(!isP&&duOrder===1){
            alerts.push({type:'h1',dapur:d.name,icon:d.icon,bahan:item.b,qty:item.q,sat:item.s});
          } else if(!isP&&duOrder===2){
            alerts.push({type:'h2',dapur:d.name,icon:d.icon,bahan:item.b,qty:item.q,sat:item.s});
          }
        });
      });
    }catch(e){}
  });

  const strip=document.getElementById('alert-strip');
  strip.innerHTML='';

  // Group by: type → dapur → items
  const typeConfig={
    h1:{icon:'🔴',label:'H-1 — Harus diorder HARI INI',cls:'h1'},
    h2:{icon:'🟠',label:'H-2 — Perlu diorder besok',cls:'h2'},
    h4:{icon:'🍌',label:'H-4 Pisang — Pesan sekarang',cls:'h4'},
  };

  ['h1','h2','h4'].forEach(type=>{
    const group=alerts.filter(a=>a.type===type);
    if(!group.length)return;
    const cfg=typeConfig[type];

    // Group by dapur
    const byDapur={};
    group.forEach(a=>{
      if(!byDapur[a.dapur])byDapur[a.dapur]={icon:a.icon,items:[]};
      byDapur[a.dapur].items.push(`${a.bahan}${a.qty?' '+fNum(a.qty)+' '+(a.sat||''):''}`);
    });

    const div=document.createElement('div');
    div.className='alert-item '+cfg.cls;
    const dapurLines=Object.entries(byDapur).map(([name,d])=>
      `<div class="alert-dapur-row">${d.icon} <strong>${name}:</strong> ${d.items.join(', ')}</div>`
    ).join('');
    div.innerHTML=`
      <div class="alert-icon">${cfg.icon}</div>
      <div class="alert-body">
        <div class="alert-title">${cfg.label}</div>
        <div class="alert-breakdown">${dapurLines}</div>
      </div>
      <div class="alert-badge">H-${type.slice(1)}</div>`;
    strip.appendChild(div);
  });

  // Stok gabungan
  renderDashboardStok();

  // Dapur cards
  const cont=document.getElementById('dapur-cards');
  cont.innerHTML='';
  DAPURS.forEach(d=>{
    let tot=0,dn=0,h1=0,pisang=0;
    try{
      const s=JSON.parse(localStorage.getItem(`kok_${d.id}`)||'{}');
      const wd=s.WD;const ck=s.CK||{};
      if(wd)wd.days.forEach((day,di)=>{
        const du=getDaysUntil(day.n);
        day.items.forEach((item,ii)=>{
          tot++;if(ck[`${di}_${ii}`])dn++;
          if(!ck[`${di}_${ii}`]){
            if(isPisang(item.b)&&du!==null&&du<=4&&du>0)pisang++;
            if(!isPisang(item.b)&&du===1)h1++;
          }
        });
      });
    }catch(e){}
    const pct=tot>0?Math.round(dn/tot*100):0;
    const card=document.createElement('div');
    card.className='dapur-card';
    card.onclick=()=>openDapur(d.id);
    // Hitung h2 juga
    let h2=0;
    try{
      const s2=JSON.parse(localStorage.getItem(`kok_${d.id}`)||'{}');
      const wd2=s2.WD;const ck2=s2.CK||{};
      if(wd2)wd2.days.forEach((day,di)=>{
        const du=getDaysUntil(day.n);
        day.items.forEach((item,ii)=>{
          if(!ck2[`${di}_${ii}`]&&!isPisang(item.b)){
            const duO=du!==null?du-1:null;
            if(duO===2)h2++;
          }
        });
      });
    }catch(e){}
    const isAllDone=tot>0&&dn===tot;
    card.innerHTML=`
      <div class="dc-header ${d.pattern}" style="background:linear-gradient(135deg,${d.bg} 0%,${d.bg}88 100%)">
        <div class="dc-icon">${d.icon}</div>
        <div class="dc-info">
          <div class="dc-name">${escH(d.name)}</div>
          <div class="dc-loc">${tot} bahan</div>
        </div>
        <div class="dc-pct-wrap">
          <div class="dc-pct">${pct}%</div>
          <div class="dc-pct-lbl">diorder</div>
        </div>
      </div>
      <div class="dc-prog-bar"><div class="dc-prog-fill" style="width:${pct}%;background:${d.accent}"></div></div>
      <div class="dc-body" style="grid-template-columns:1fr 1fr 1fr 1fr">
        <div class="dc-stat">
          <div class="dc-stat-val ${isAllDone?'green':''}">${dn}/${tot}</div>
          <div class="dc-stat-lbl">Diorder</div>
        </div>
        <div class="dc-stat">
          <div class="dc-stat-val ${h1>0?'red':''}">${h1}</div>
          <div class="dc-stat-lbl">H-1</div>
        </div>
        <div class="dc-stat">
          <div class="dc-stat-val ${h2>0?'orange':''}">${h2}</div>
          <div class="dc-stat-lbl">H-2</div>
        </div>
        <div class="dc-stat">
          <div class="dc-stat-val ${pisang>0?'yellow':''}">${pisang}</div>
          <div class="dc-stat-lbl">🍌 H-4</div>
        </div>
      </div>
      <div class="dc-footer">
        <span style="font-size:11px;color:var(--text3)">Tap untuk buka detail</span>
        <span style="font-size:14px;color:var(--text3)">›</span>
      </div>`
    cont.appendChild(card);
  });
}

// ═══════════════════════════════════════════════════
// DAPUR SUMMARY (Ringkasan)
// ═══════════════════════════════════════════════════

function switchTabToDay(tabName, orderDay){
  switchTab(tabName);
  // Scroll ke blok order yang sesuai (berdasarkan hari ORDER, bukan hari menu)
  setTimeout(()=>{
    if(!orderDay) return;
    // Cari od-title yang mengandung nama hari order
    const shortName=orderDay.split(',')[0].trim(); // misal "Minggu"
    const panels=document.querySelectorAll('.od-title');
    let found=false;
    panels.forEach(el=>{
      if(!found && (el.textContent.includes(shortName)||el.textContent.includes(orderDay))){
        found=true;
        el.scrollIntoView({behavior:'smooth',block:'start'});
        el.style.background='rgba(79,142,247,.15)';
        el.style.borderColor='var(--accent)';
        setTimeout(()=>{el.style.background='';el.style.borderColor='';},2000);
      }
    });
  },250);
}
function renderRingkasan(){
  const cont=document.getElementById('ringkasan-c');if(!cont)return;
  cont.innerHTML='';
  let tot=0,dn=0,h1Items=[],h2Items=[],pisangItems=[];
  WD.days.forEach((day,di)=>{
    const du=getDaysUntil(day.n); // hari sampai hari MENU
    // Hari order = sehari sebelum menu (du-1)
    // H-1 alert: order besok → du==2 (menu 2 hari lagi, order besok)
    // H-2 alert: order 2 hari lagi → du==3 (menu 3 hari lagi... 
    //   TAPI: menu Senin(du=3), order Minggu(du-1=2), H-2 notif = Jumat → du==3? 
    //   Logika: H-X = X hari sebelum hari ORDER
    //   H-1: du_menu==2 (order besok=Minggu, menu lusa=Senin)  ← alert hari Sabtu
    //   H-2: du_menu==3 (order 2 hari lagi, alert sekarang)    ← alert hari Jumat ✓
    // Pisang H-4: du_order<=4 → du_menu<=5
    day.items.forEach((item,ii)=>{
      tot++;if(CK[iid(di,ii)])dn++;
      if(!CK[iid(di,ii)]){
        const lbl=`${item.b}${item.q?' '+fNum(item.q)+' '+(normSat(item.s)||''):''}`;
        const duOrder=du!==null?du-1:null; // hari sampai hari ORDER
        if(isPisang(item.b)&&duOrder!==null&&duOrder<=4&&duOrder>0){
          pisangItems.push({lbl,di,ii,orderDay:day.od,menuDay:day.n});
        } else if(duOrder===1){
          h1Items.push({lbl,di,ii,orderDay:day.od,menuDay:day.n});
        } else if(duOrder===2){
          h2Items.push({lbl,di,ii,orderDay:day.od,menuDay:day.n});
        }
      }
    });
  });
  const pct=tot>0?Math.round(dn/tot*100):0;

  // Stat grid
  const grid=document.createElement('div');grid.className='summary-grid';
  grid.innerHTML=`
    <div class="sum-card ${h1Items.length?'red':''}" onclick="switchTabToDay('checklist','${h1Items[0]?.day||''}')">
      <div class="sum-val">${h1Items.length}</div>
      <div class="sum-lbl">Belum order H-1</div>
      ${h1Items.length?`<div class="sum-detail">${h1Items.slice(0,3).map(x=>x.lbl).join(', ')}${h1Items.length>3?` +${h1Items.length-3} lagi`:''}</div>`:''}
    </div>
    <div class="sum-card ${h2Items.length?'orange':''}" onclick="switchTabToDay('checklist','${h2Items[0]?.day||''}')">
      <div class="sum-val">${h2Items.length}</div>
      <div class="sum-lbl">Perlu order H-2</div>
      ${h2Items.length?`<div class="sum-detail">${h2Items.slice(0,3).map(x=>x.lbl).join(', ')}${h2Items.length>3?` +${h2Items.length-3} lagi`:''}</div>`:''}
    </div>
    <div class="sum-card ${pisangItems.length?'yellow':''}" onclick="switchTab('checklist')">
      <div class="sum-val">${pisangItems.length}</div>
      <div class="sum-lbl">🍌 Pisang H-4</div>
      ${pisangItems.length?`<div class="sum-detail">${pisangItems.slice(0,2).map(x=>x.lbl).join(', ')}</div>`:''}
    </div>
    <div class="sum-card ${pct===100?'green':''}" onclick="switchTab('checklist')">
      <div class="sum-val">${dn}/${tot}</div>
      <div class="sum-lbl">Diorder (${pct}%)</div>
    </div>`;
  cont.appendChild(grid);

  // Alert detail — klik langsung ke checklist
  if(h1Items.length){
    const a=document.createElement('div');a.className='sum-alert red';const h1Day=h1Items[0]?.orderDay;a.onclick=()=>switchTabToDay('checklist',h1Day);
    a.innerHTML=`<div class="sum-alert-icon">🔴</div><div><div class="sum-alert-title">H-1 — Harus diorder HARI INI</div>
      <div class="sum-alert-body">${h1Items.map(x=>x.lbl).join(' · ')}</div>
      <div class="tap-hint">↑ tap untuk lihat checklist</div></div>`;
    cont.appendChild(a);
  }
  if(h2Items.length){
    const a=document.createElement('div');a.className='sum-alert orange';const h2Day=h2Items[0]?.orderDay;a.onclick=()=>switchTabToDay('checklist',h2Day);
    a.innerHTML=`<div class="sum-alert-icon">🟠</div><div><div class="sum-alert-title">H-2 — Perlu diorder besok</div>
      <div class="sum-alert-body">${h2Items.map(x=>x.lbl).join(' · ')}</div>
      <div class="tap-hint">↑ tap untuk lihat checklist</div></div>`;
    cont.appendChild(a);
  }
  if(pisangItems.length){
    const a=document.createElement('div');a.className='sum-alert yellow';const pDay=pisangItems[0]?.orderDay;a.onclick=()=>switchTabToDay('checklist',pDay);
    a.innerHTML=`<div class="sum-alert-icon">🍌</div><div><div class="sum-alert-title">Pisang — pesan H-4</div>
      <div class="sum-alert-body">${pisangItems.map(x=>x.lbl).join(' · ')}</div>
      <div class="tap-hint">↑ tap untuk lihat checklist</div></div>`;
    cont.appendChild(a);
  }
  if(!h1Items.length&&!h2Items.length&&!pisangItems.length){
    const a=document.createElement('div');a.className='sum-alert green';
    a.innerHTML=`<div class="sum-alert-icon">✅</div><div><div class="sum-alert-title" style="color:var(--green)">Semua order on track!</div></div>`;
    cont.appendChild(a);
  }
}

function renderDapurSummary(){ renderRingkasan(); }

// ═══════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════
const iid=(di,ii)=>`${di}_${ii}`;
function toggle(di,ii){CK[iid(di,ii)]=!CK[iid(di,ii)];saveLocal();refreshActive();updateNavDots();}
function toggleGroup(ids){const a=ids.every(id=>CK[id]);ids.forEach(id=>{CK[id]=!a;});saveLocal();refreshActive();updateNavDots();}
function refreshActive(){
  if(curTab==='ringkasan')  renderRingkasan();
  if(curTab==='input')      renderInput(false);
  if(curTab==='pesan')      renderOrderH();
  if(curTab==='checklist')  renderCL();
  updateProgress();
}
function updateProgress(){
  let tot=0,dn=0;
  WD.days.forEach((d,di)=>d.items.forEach((_,ii)=>{tot++;if(CK[iid(di,ii)])dn++;}));
  const pct=tot>0?Math.round(dn/tot*100):0;
  const pf=document.getElementById('cl-prog');if(pf)pf.style.width=pct+'%';
  const ll=document.getElementById('cl-lbl');if(ll)ll.textContent=`${dn}/${tot}`;
  const ring=document.getElementById('ring-fill');if(ring)ring.style.strokeDashoffset=75.4*(1-pct/100);
  const rl=document.getElementById('ring-pct');if(rl)rl.textContent=pct+'%';
}
function updateNavDots(){
  let dn=0;WD.days.forEach((d,di)=>d.items.forEach((_,ii)=>{if(CK[iid(di,ii)])dn++;}));
  const el=document.getElementById('bnav-badge');if(el)el.className='bnav-badge'+(dn>0?' show':'');
}
function getWeekLabel(){
  if(WD.days?.length)return`${fmtTgl(WD.days[0].n)} – ${fmtTgl(WD.days[WD.days.length-1].n)}`;
  return'Minggu baru';
}

// ═══════════════════════════════════════════════════
// IMPORT EXCEL
// ═══════════════════════════════════════════════════
function triggerImport(){document.getElementById('xl-input').click();}
async function handleImport(evt){
  const file=evt.target.files[0];if(!file)return;
  toast('⏳ Membaca file...');
  try{
    const data=await file.arrayBuffer();
    const wb=XLSX.read(data,{type:'array'});
    const sn=wb.SheetNames.includes('Menu Harian')?'Menu Harian':wb.SheetNames[0];
    const rows=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,defval:''});
    const DAY=/(\d{1,2})\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+(\d{4})/i;
    const SKIP=/^(menu|bahan|kebutuhan|satuan|harga|total|pagu|sisa|keterangan)/i;
    const newDays=[];let curDay=null;
    rows.forEach(row=>{
      const a=String(row[0]||'').trim(),b=String(row[1]||'').trim();
      const c=row[2],d=String(row[3]||'').trim(),e=row[4];
      if(DAY.test(a)&&!b){
        const formatted=fmtTgl(a);
        const od=orderDay(a);
        const tm=a.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
        let os='';
        if(tm){const bi=BULAN.findIndex(bx=>bx.toLowerCase()===tm[2].toLowerCase());const dt=new Date(parseInt(tm[3]),bi>=0?bi:0,parseInt(tm[1]));os=`${HARI[dt.getDay()]} ${String(parseInt(tm[1])).padStart(2,'0')}/${String((bi>=0?bi:0)+1).padStart(2,'0')}`;}
        curDay={n:formatted,od,os,items:[]};newDays.push(curDay);return;
      }
      if(SKIP.test(a)||!curDay||!b)return;
      if(typeof c==='string'&&c.startsWith('='))return;
      let nb=toTitle(b.trim());
      if(nb.toLowerCase()==='nasi'||nb.toLowerCase().startsWith('nasi '))nb='Beras';
      const qty=c!==''&&c!==null?parseFloat(String(c).replace(/[^0-9.]/g,''))||null:null;
      const harga=e!==''&&e!==null?parseFloat(String(e).replace(/[^0-9.]/g,''))||null:null;
      curDay.items.push({b:nb,q:qty,s:normSat(d),h:harga,hb:null,ket:''});
    });
    const valid=newDays.filter(d=>d.items.length>0);
    if(!valid.length){toast('⚠️ Format tidak terbaca.',4000);evt.target.value='';return;}
    WD={days:valid};CK={};curWeekId=null;
    saveLocal();renderInput();updateNavDots();
    document.getElementById('dapur-header-sub').textContent=fmtTgl(WD.days[0].n);
    toast(`✓ ${valid.length} hari diimport — klik Simpan`,3000);
  }catch(err){console.error(err);toast('⚠️ Gagal membaca file.',3000);}
  evt.target.value='';
}

// ═══════════════════════════════════════════════════
// INPUT
// ═══════════════════════════════════════════════════
function sumberOptions(sel){
  return SUMBER.map(s=>`<option value="${escH(s)}" ${sel===s?'selected':''}>${escH(s)}</option>`).join('')
    +`<option value="__lain__" ${sel&&!SUMBER.includes(sel)?'selected':''}>Lainnya...</option>`;
}

function renderInput(full=true){
  const c=document.getElementById('days-c');c.innerHTML='';
  WD.days.forEach((day,di)=>{
    const dN=day.items.filter((_,ii)=>CK[iid(di,ii)]).length;
    const allDone=dN===day.items.length&&day.items.length>0;
    const el=document.createElement('div');el.className='day-block';
    el.innerHTML=`<div class="day-hdr" onclick="togDay(${di})">
        <div class="day-hdr-l">${escH(fmtTgl(day.n))}<span class="chip ${allDone?'green':''}" id="bdg-${di}">${dN}/${day.items.length}</span></div>
        <div class="day-hdr-r"><span class="order-tag">${escH(day.od)}</span><span class="chev" id="chv-${di}">▾</span></div>
      </div>
      <div class="day-body" id="db-${di}">
        <div class="row-lbl"><span></span><span>Bahan</span><span>Jml</span><span>Sat</span><span>Harga</span><span>H.Baru</span><span>Keterangan</span><span></span></div>
        <div id="it-${di}"></div>
        <button class="btn-add" onclick="addIt(${di})">+ Tambah bahan</button>
      </div>`;
    c.appendChild(el);rItems(di);
  });
  updateProgress();
}

function togDay(di){
  const b=document.getElementById(`db-${di}`),ch=document.getElementById(`chv-${di}`);
  const open=b.style.display!=='none';b.style.display=open?'none':'block';
  if(ch)ch.className='chev'+(open?'':' open');
}

function sumberOptions(sel){
  return SUMBER.map(s=>`<option value="${escH(s)}" ${sel===s?'selected':''}>${escH(s)}</option>`).join('')
    +`<option value="__lain__" ${sel&&!SUMBER.includes(sel)?'selected':''}>Lainnya...</option>`;
}

function rItems(di){
  const c=document.getElementById(`it-${di}`);if(!c)return;c.innerHTML='';
  WD.days[di].items.forEach((item,ii)=>{
    const id=iid(di,ii),ck=CK[id];
    const cat=gc(item.b),cfg=CC[cat];
    const hargaAktif=item.hb||item.h;
    const total=(item.q&&hargaAktif)?item.q*hargaAktif:null;
    const isCustomKet=item.ket&&!SUMBER.includes(item.ket);
    const hMissing=!item.h&&!item.hb;
    const isCustomKat=CUSTOM_KAT[item.b.toLowerCase().trim()];

    const fBahan=`<input type="text" class="inp-bahan" value="${escH(item.b)}" placeholder="Nama bahan"
      onblur="upItB(${di},${ii},this.value)" oninput="upIt(${di},${ii},'b',this.value)">`;
    const fQty=`<input type="text" class="inp-num" value="${item.q?fNum(item.q):''}" placeholder="Qty"
      onblur="upItN(${di},${ii},'q',this.value)" onfocus="this.value=this.value.replace(/[.]/g,'')">`;
    const fSat=`<input type="text" class="inp-sat" value="${escH(normSat(item.s||''))}" placeholder="kg"
      oninput="upIt(${di},${ii},'s',this.value)">`;
    const fH=`<input type="text" class="inp-num${hMissing?' harga-missing':''}" value="${item.h?fNum(item.h):''}"
      placeholder="${hMissing?'⚠ harga':'harga'}"
      onblur="upItN(${di},${ii},'h',this.value)" onfocus="this.value=this.value.replace(/[.]/g,'')">`;
    const fHB=`<input type="text" class="inp-num inp-hbaru${item.hb?' changed':''}" value="${item.hb?fNum(item.hb):''}"
      placeholder="ubah harga"
      onblur="upItN(${di},${ii},'hb',this.value)" onfocus="this.value=this.value.replace(/[.]/g,'')">`;
    const fKet=`<div class="ket-wrap" id="ketwrap-${di}-${ii}">
      <select class="inp-ket-sel" onchange="ketC(${di},${ii},this.value)">
        <option value="">— sumber —</option>${sumberOptions(isCustomKet?'__lain__':item.ket)}
      </select>
      ${isCustomKet
        ?`<input type="text" class="inp-ket-custom" value="${escH(item.ket)}" placeholder="nama dapur..." oninput="upIt(${di},${ii},'ket',this.value)" onblur="saveLocal()">`
        :`<input type="text" class="inp-ket-custom" style="display:none" placeholder="nama dapur..." oninput="upIt(${di},${ii},'ket',this.value)">`}
      </div>`;
    const fChk=`<div class="chk ${ck?'on':''}" onclick="toggle(${di},${ii})" title="Tandai diorder">${ck?'✓':''}</div>`;
    const fDel=`<button class="btn-x" onclick="rmIt(${di},${ii})" title="Hapus">✕</button>`;

    const row=document.createElement('div');

    if(window.innerWidth<=580){
      // MOBILE: kartu vertikal
      row.className='item-row item-card'+(ck?' is-ck':'');
      row.innerHTML=`
        <div class="card-row1">${fChk}${fBahan}${fDel}</div>
        <div class="card-row2">
          <div class="card-half">
            <div class="card-lbl">Jumlah & Satuan</div>
            <div class="card-inline">${fQty}${fSat}</div>
          </div>
          <div class="card-half">
            <div class="card-lbl">Harga / H.Baru</div>
            <div class="card-inline">${fH}${fHB}</div>
          </div>
        </div>
        <div class="card-row3">
          <div class="card-lbl">Sumber</div>
          ${fKet}
        </div>`;
    } else {
      // DESKTOP: grid 8 kolom
      row.className='item-row'+(ck?' is-ck':'');
      row.innerHTML=`${fChk}${fBahan}${fQty}${fSat}${fH}${fHB}${fKet}${fDel}`;
    }
    c.appendChild(row);

    // Subtotal + kategori badge
    const sub=document.createElement('div');
    sub.className='item-subtotal'+(ck?' is-ck':'');
    sub.innerHTML=`
      <div style="position:relative">
        <button class="kat-btn${isCustomKat?' custom':''}" id="kat-btn-${di}-${ii}"
          onclick="showKatPicker(${di},${ii},'${escH(item.b)}')"
          title="Klik untuk ubah kategori">${cfg.e} ${cfg.l}${isCustomKat?' ✏️':''}</button>
      </div>
      ${total?`<span class="subtotal-val">= Rp ${fNum(total)}</span>`:''}
      ${item.hb?'<span class="hbaru-badge">harga diubah</span>':''}
      ${item.ket&&item.ket!=='Beli Sendiri'?`<span class="ket-badge">${escH(item.ket)}</span>`:''}`;
    c.appendChild(sub);
  });
}

function ketC(di,ii,val){
  if(val==='__lain__'){WD.days[di].items[ii].ket='';saveLocal();rItems(di);
    setTimeout(()=>{const w=document.getElementById(`ketwrap-${di}-${ii}`);if(w){const inp=w.querySelector('.inp-ket-custom');if(inp){inp.style.display='';inp.focus();}}},50);
  }else{WD.days[di].items[ii].ket=val;saveLocal();rItems(di);}
}
function upIt(di,ii,f,v){WD.days[di].items[ii][f]=v;saveLocal();}
function upItB(di,ii,v){WD.days[di].items[ii].b=toTitle(v);saveLocal();rItems(di);}
function upItN(di,ii,f,v){const c=String(v).replace(/\./g,'').replace(/[^0-9]/g,'');WD.days[di].items[ii][f]=c?parseInt(c):null;saveLocal();rItems(di);}
function addIt(di){WD.days[di].items.push({b:'',q:null,s:'kg',h:null,hb:null,ket:''});saveLocal();renderInput(false);}
function rmIt(di,ii){WD.days[di].items.splice(ii,1);delete CK[iid(di,ii)];saveLocal();renderInput(false);}
async function saveW(){
  await dbSave();
  const btn=document.getElementById('btn-sv'),o=btn.innerHTML;
  btn.innerHTML='✓';setTimeout(()=>{btn.innerHTML=o;},2000);
}

// ═══════════════════════════════════════════════════
// KAT PICKER
// ═══════════════════════════════════════════════════
function showKatPicker(di,ii,name){
  document.querySelectorAll('.kat-picker').forEach(e=>e.remove());
  const btn=document.getElementById(`kat-btn-${di}-${ii}`);if(!btn)return;
  const pop=document.createElement('div');pop.className='kat-picker';
  pop.innerHTML=`<div class="kat-picker-ttl">Kategori untuk:<strong>${escH(name)}</strong></div>
    <div class="kat-picker-grid">${CO.map(k=>`<button class="kat-opt" onclick="applyKat(${di},${ii},'${escH(name)}','${k}')">${CC[k].e} ${CC[k].l}</button>`).join('')}</div>
    <button class="kat-opt" style="width:100%;margin-top:4px;color:var(--text3)" onclick="document.querySelectorAll('.kat-picker').forEach(e=>e.remove())">✕ Batal</button>`;
  btn.parentNode.style.position='relative';
  btn.parentNode.appendChild(pop);
  setTimeout(()=>document.addEventListener('click',function h(e){if(!pop.contains(e.target)&&e.target!==btn){pop.remove();document.removeEventListener('click',h);}},true),10);
}
async function applyKat(di,ii,name,kat){
  document.querySelectorAll('.kat-picker').forEach(e=>e.remove());
  await dbSaveCustomKat(name,kat);
  toast(`✓ "${name}" → ${CC[kat].e} ${CC[kat].l}`);
  rItems(di);
}

// ═══════════════════════════════════════════════════
// ORDER GROUPS
// ═══════════════════════════════════════════════════
function buildOG(){
  const G={},seq=[];
  WD.days.forEach((day,di)=>{
    const k=day.os;
    if(!G[k]){G[k]={label:fmtTgl(day.od||day.os),menu:fmtTgl(day.n),cats:{}};seq.push(k);}
    day.items.forEach((item,ii)=>{
      if(!item.b)return;const cat=gc(item.b);
      if(!G[k].cats[cat])G[k].cats[cat]=[];
      const ex=G[k].cats[cat].find(i=>i.b.toLowerCase()===item.b.toLowerCase());
      if(ex){if(item.q)ex.q=(ex.q||0)+item.q;ex.ids.push(iid(di,ii));}
      else G[k].cats[cat].push({...item,s:normSat(item.s||''),ids:[iid(di,ii)]});
    });
  });
  return{G,seq};
}

// ═══════════════════════════════════════════════════
// PESAN ORDER
// ═══════════════════════════════════════════════════
function renderOrderH(){
  const{G,seq}=buildOG();
  const cont=document.getElementById('order-h-c');cont.innerHTML='';
  seq.forEach(key=>{
    const grp=G[key];const block=document.createElement('div');block.className='msg-block';
    const cats=Object.keys(grp.cats).sort((a,b)=>CO.indexOf(a)-CO.indexOf(b));
    let lines=[grp.label,''],bHtml='';
    cats.forEach(cat=>{
      const cfg=CC[cat],items=grp.cats[cat];
      lines.push(`${cfg.e} ${cfg.l}`);
      bHtml+=`<div class="msg-cat"><div class="msg-cat-lbl">${cfg.e} ${cfg.l}</div>`;
      items.forEach(item=>{
        const ck=item.ids.every(id=>CK[id]);
        const line=item.q?`- ${item.b} ${fNum(item.q)} ${item.s||''}`:`- ${item.b}`;
        lines.push(ck?line+' ✓':line);
        const ids=JSON.stringify(item.ids).replace(/"/g,"'");
        bHtml+=`<div class="msg-row${ck?' ck':''}" onclick="toggleGroup(${ids})">
          <div class="chk-sm ${ck?'on':''}">${ck?'✓':''}</div>
          <span class="pill" style="background:${cfg.b};color:${cfg.c}">${cfg.e} ${cfg.l}</span>
          <span>${escH(item.b)}</span>
          <span class="q">${item.q?fNum(item.q)+' '+(item.s||''):''}</span>
          ${ck?'<span class="ck-mark">✅</span>':''}
        </div>`;
      });
      bHtml+='</div>';
    });
    const txt=lines.join('\n'),enc=encodeURIComponent(txt);
    block.innerHTML=`<div class="msg-hdr"><div class="msg-hdr-l">◎ Order ${escH(grp.label)}</div>
      <span class="msg-for">untuk ${escH(grp.menu)}</span></div>
      <div class="msg-body">${bHtml}
        <div class="msg-pre" onclick="copyT(this,'${enc}')">${txt}</div>
        <div class="copy-hint">↑ klik untuk copy</div>
      </div>`;
    cont.appendChild(block);
  });
}
function copyT(el,enc){
  navigator.clipboard.writeText(decodeURIComponent(enc)).then(()=>{
    el.style.borderColor='rgba(74,222,128,.5)';el.style.color='#4ade80';
    toast('✓ Dicopy!');setTimeout(()=>{el.style.borderColor='';el.style.color='';},1500);
  }).catch(()=>toast('Gagal copy.'));
}

// ═══════════════════════════════════════════════════
// CHECKLIST
// ═══════════════════════════════════════════════════
function renderCL(){
  const{G,seq}=buildOG();const cont=document.getElementById('cl-c');cont.innerHTML='';
  seq.forEach(key=>{
    const grp=G[key];const block=document.createElement('div');block.className='order-day';
    const cats=Object.keys(grp.cats).sort((a,b)=>CO.indexOf(a)-CO.indexOf(b));
    let items=[];cats.forEach(cat=>grp.cats[cat].forEach(it=>items.push({...it,cat})));
    const dN=items.filter(it=>it.ids.every(id=>CK[id])).length;
    const isAll=dN===items.length&&items.length>0;
    block.innerHTML=`<div class="od-title" id="od-${key}">◎ Order ${escH(grp.label)} — untuk ${escH(grp.menu)}
      <span class="chip ${isAll?'green':''}" style="margin-left:auto">${dN}/${items.length}</span></div>`;
    items.forEach(item=>{
      const ck=item.ids.every(id=>CK[id]),cfg=CC[item.cat];
      const row=document.createElement('div');row.className='oi'+(ck?' ck':'');
      row.onclick=()=>toggleGroup(item.ids);
      row.innerHTML=`<div class="chk-sm ${ck?'on':''}">${ck?'✓':''}</div>
        <span class="pill" style="background:${cfg.b};color:${cfg.c}">${cfg.e} ${cfg.l}</span>
        <span>${escH(item.b)}</span>
        <span class="q">${item.q?fNum(item.q)+' '+(item.s||''):''}</span>
        ${item.ket?`<span class="ket-badge">${escH(item.ket)}</span>`:''}`;
      block.appendChild(row);
    });
    cont.appendChild(block);
  });
  updateProgress();
}

// ═══════════════════════════════════════════════════
// REKAP
// ═══════════════════════════════════════════════════
function renderRekap(){
  const head=document.getElementById('rekap-head');
  if(head){
    while(head.firstChild) head.removeChild(head.firstChild);
    // Kolom chk
    const thChk=document.createElement('th');thChk.style.width='32px';head.appendChild(thChk);
    // Kolom Bahan
    const thBahan=document.createElement('th');
    thBahan.style.textAlign='left';thBahan.style.minWidth='120px';
    thBahan.textContent='Bahan';head.appendChild(thBahan);
    // Per hari
    WD.days.forEach((d,i)=>{
      const th=document.createElement('th');th.id=`rh${i}`;
      th.style.minWidth='62px';th.style.whiteSpace='pre';
      th.textContent=shortDay(d.n);head.appendChild(th);
    });
    // Total
    const thTot=document.createElement('th');
    thTot.className='th-total';thTot.style.minWidth='70px';
    thTot.textContent='Total';head.appendChild(thTot);
  }
  const map={};
  WD.days.forEach((day,di)=>day.items.forEach((item,ii)=>{
    if(!item.b)return;const k=item.b.toLowerCase().trim();
    if(!map[k])map[k]={d:item.b,s:item.s,cat:gc(item.b),pd:{},ids:[]};
    map[k].ids.push(iid(di,ii));
    if(item.q)map[k].pd[day.n]=(map[k].pd[day.n]||0)+item.q;
  }));
  const multi=Object.values(map).filter(v=>Object.keys(v.pd).length>=2);
  document.getElementById('rekap-c').textContent=`${multi.length} bahan`;
  const tb=document.getElementById('rekap-tb');tb.innerHTML='';
  if(!multi.length){
    tb.innerHTML=`<tr><td colspan="${1+WD.days.length+1}" style="text-align:center;padding:2rem;color:var(--text3)">Tidak ada bahan berulang.</td></tr>`;
    return;
  }
  multi.sort((a,b)=>CO.indexOf(a.cat)-CO.indexOf(b.cat)||a.d.localeCompare(b.d));
  let curC=null;
  multi.forEach(item=>{
    if(item.cat!==curC){
      curC=item.cat;const cfg=CC[curC];
      const tr=document.createElement('tr');tr.className='cat-row';
      tr.innerHTML=`<td colspan="${3+WD.days.length}" style="padding-left:10px">${cfg.e} ${cfg.l}</td>`;
      tb.appendChild(tr);
    }
    // Per-hari: cari ids per hari untuk status visual
    const idsPerDay={};
    WD.days.forEach((day,di)=>{
      day.items.forEach((it,ii)=>{
        if(it.b.toLowerCase().trim()!==item.d.toLowerCase().trim())return;
        if(!idsPerDay[day.n])idsPerDay[day.n]=[];
        idsPerDay[day.n].push(iid(di,ii));
      });
    });

    const allCk=item.ids.every(id=>CK[id]);
    const tr=document.createElement('tr');
    if(allCk) tr.className='ck-row';
    let tot=0;

    // Cell per hari: visual saja (tidak interaktif dari rekap)
    const cells=WD.days.map(d=>{
      const v=item.pd[d.n];
      const dayIds=idsPerDay[d.n]||[];
      const dayCk=dayIds.length>0&&dayIds.every(id=>CK[id]);
      if(v){
        tot+=v;
        if(dayCk){
          return`<td class="nv" style="opacity:.38;text-decoration:line-through;color:var(--text3)">
            ${fNum(v)}</td>`;
        }
        return`<td class="nv">${fNum(v)}</td>`;
      }
      return`<td class="nd">—</td>`;
    }).join('');

    // Kotak checklist kiri → tandai/batal SEMUA hari sekaligus
    const idsStr=JSON.stringify(item.ids).replace(/"/g,"'");
    tr.innerHTML=`
      <td style="text-align:center;width:32px">
        <div class="chk-sm ${allCk?'on':''}" onclick="toggleGroup(${idsStr})" style="margin:0 auto">
          ${allCk?'✓':''}
        </div>
      </td>
      <td style="font-weight:500">
        ${escH(item.d)}
        <div style="font-size:10px;color:var(--text3);margin-top:1px">${escH(normSat(item.s||''))}</div>
      </td>
      ${cells}
      <td class="nv-total">${fNum(tot)}</td>`;
    tb.appendChild(tr);
  });
}

// ═══════════════════════════════════════════════════
// STOK
// ═══════════════════════════════════════════════════
function renderStok(){
  const cont=document.getElementById('stok-c');if(!cont)return;
  cont.innerHTML=`
    <div class="stok-hdr-simple">
      <span class="sh-bahan">Bahan</span>
      <span class="sh-jml">Jumlah</span>
      <span class="sh-sat">Satuan</span>
      <span></span>
    </div>
    <div id="stok-items"></div>
    <button class="btn-add" onclick="addStok()">+ Tambah stok</button>`;
  const si=document.getElementById('stok-items');
  if(!STOK.length){si.innerHTML='<p class="empty" style="padding:1rem 0;font-size:12px">Belum ada data stok.</p>';}
  STOK.forEach((item,i)=>{
    const row=document.createElement('div');row.className='stok-row-simple';
    row.innerHTML=`
      <input type="text" class="sh-bahan" value="${escH(item.b)}" placeholder="Nama bahan"
        onblur="upStokB(${i},this.value)" oninput="upStok(${i},'b',this.value)">
      <input type="text" class="inp-num sh-jml" value="${item.jml!=null?fNum(item.jml):''}" placeholder="0"
        onblur="upStokN(${i},'jml',this.value)" onfocus="this.value=this.value.replace(/[.]/g,'')">
      <input type="text" class="inp-sat sh-sat" value="${escH(normSat(item.s||''))}" placeholder="kg"
        oninput="upStok(${i},'s',this.value)">
      <button class="btn-x" onclick="rmStok(${i})">✕</button>`;
    si.appendChild(row);
  });
}
function addStok(){STOK.push({b:'',jml:null,s:'kg'});saveLocal();renderStok();}
function rmStok(i){STOK.splice(i,1);saveLocal();renderStok();}
function upStok(i,f,v){STOK[i][f]=v;saveLocal();}
function upStokB(i,v){STOK[i].b=toTitle(v);saveLocal();renderStok();}
function upStokN(i,f,v){const c=String(v).replace(/\./g,'').replace(/[^0-9]/g,'');STOK[i][f]=c?parseInt(c):null;saveLocal();renderStok();}

// ═══════════════════════════════════════════════════
// HISTORI
// ═══════════════════════════════════════════════════
async function rHist(){
  const c=document.getElementById('hist-c');
  c.innerHTML='<p class="empty">Memuat...</p>';
  const rows=await dbLoadWeeks(curDapurId);
  if(!rows.length){c.innerHTML='<p class="empty">Belum ada histori.</p>';return;}
  c.innerHTML='';
  rows.forEach(row=>{
    const el=document.createElement('div');el.className='hist-row';
    const saved=new Date(row.updated_at).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
    el.innerHTML=`<div><div class="hist-title">${escH(row.label)}</div><div class="hist-sub">${saved}</div></div>
      <div class="hist-actions">
        <button class="hist-btn" onclick="loadH('${row.id}')">↖ Lihat</button>
        <button class="hist-btn" onclick="dupH('${row.id}')">⊕ Duplikat</button>
        <button class="hist-btn del" onclick="delH('${row.id}','${escH(row.label)}')">✕</button>
      </div>`;
    c.appendChild(el);
  });
}
async function loadH(id){
  const res=await dbLoadWeek(id);if(!res?.week)return;
  WD=res.week.data;CK=res.ck?.ck_data||{};STOK=res.stok?.items||[];
  curWeekId=id;saveLocal();switchTab('input');renderInput();toast('✓ Dimuat');
}
async function dupH(id){
  const res=await dbLoadWeek(id);if(!res?.week)return;
  WD=JSON.parse(JSON.stringify(res.week.data));CK={};STOK=[];curWeekId=null;
  saveLocal();switchTab('input');renderInput();toast('Duplikat berhasil');
}
async function dupFirst(){
  const rows=await dbLoadWeeks(curDapurId);
  if(!rows.length){toast('Belum ada histori.');return;}
  await dupH(rows[0].id);
}
async function delH(id,label){
  if(!confirm(`Hapus "${label}"?`))return;
  try{await dbDelWeek(id);if(curWeekId===id){curWeekId=null;saveLocal();}rHist();toast('🗑️ Dihapus.');}
  catch(e){toast('⚠️ '+e.message,4000);}
}

// ═══════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════
async function renderSettings(){
  const c=document.getElementById('settings-c');if(!c)return;
  let katRows=[];try{katRows=await sbG('custom_kategori','order=bahan_name.asc');}catch(e){}
  // Nama dapur saat ini
  const dapurNames=JSON.parse(localStorage.getItem('kok_dapur_names')||'{}');

  c.innerHTML=`
    <div class="settings-section">
      <div class="settings-title">Tampilan</div>
      <div class="theme-options">
        <button class="theme-opt ${localStorage.getItem('kok_theme')!=='light'?'active':''}"
          onclick="applyThemeMode('dark');renderSettings()">🌙 Dark</button>
        <button class="theme-opt ${localStorage.getItem('kok_theme')==='light'?'active':''}"
          onclick="applyThemeMode('light');renderSettings()">☀️ Light</button>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-title">Nama Dapur</div>
      <div id="dapur-names-list">
        ${DAPURS_DEFAULT.map(d=>`
          <div class="sumber-row" style="margin-bottom:8px">
            <span style="font-size:13px;flex-shrink:0;width:28px">${d.icon}</span>
            <input type="text" value="${escH(dapurNames[d.id]||d.name)}" placeholder="${escH(d.name)}"
              onblur="saveDapurNameUI('${d.id}',this.value)"
              style="flex:1">
          </div>`).join('')}
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-title">Sumber Keterangan</div>
      <div id="sumber-list"></div>
      <button class="btn-add" onclick="addSumber()">+ Tambah sumber</button>
    </div>
    <div class="settings-section">
      <div class="settings-title">Kategori Custom (${katRows.length})</div>
      <div id="custom-kat-list">
        ${katRows.length?katRows.map(r=>`<div class="custom-kat-row">
          <span class="custom-kat-name">${escH(r.bahan_name)}</span>
          <span class="custom-kat-badge">${CC[r.kategori]?.e||''} ${CC[r.kategori]?.l||r.kategori}</span>
          <button class="btn-x" onclick="resetKat('${escH(r.bahan_key)}','${escH(r.bahan_name)}')">✕</button>
        </div>`).join(''):'<p class="empty" style="padding:.5rem 0;font-size:12px">Belum ada.</p>'}
      </div>
    </div>`;
  renderSumberList();
}

function saveDapurNameUI(id, name){
  saveDapurName(id, name.trim()||DAPURS_DEFAULT.find(d=>d.id===id)?.name||id);
  // Update tampilan topbar kalau sedang di dapur itu
  if(curDapurId===id){
    document.getElementById('dapur-title').textContent=
      (DAPURS.find(d=>d.id===id)?.icon||'')+ ' ' + (name.trim()||id);
  }
  toast('✓ Nama dapur disimpan');
}

function renderSumberList(){
  const c=document.getElementById('sumber-list');if(!c)return;c.innerHTML='';
  SUMBER.forEach((s,i)=>{
    const row=document.createElement('div');row.className='sumber-row';
    row.innerHTML=`<input type="text" value="${escH(s)}" placeholder="Nama sumber"
      onblur="upSumber(${i},this.value)"><button class="btn-x" onclick="delSumber(${i})">✕</button>`;
    c.appendChild(row);
  });
}
function upSumber(i,v){SUMBER[i]=v;dbSaveSettings();}
function delSumber(i){if(SUMBER.length<=1){toast('Minimal 1.');return;}SUMBER.splice(i,1);dbSaveSettings();renderSettings();}
function addSumber(){SUMBER.push('');dbSaveSettings();renderSettings();
  setTimeout(()=>{const inputs=document.querySelectorAll('#sumber-list input');if(inputs.length)inputs[inputs.length-1].focus();},50);}
async function resetKat(key,name){
  if(!confirm(`Reset "${name}"?`))return;
  await dbDelCustomKat(key);toast('↩ Reset');renderSettings();refreshActive();
}

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════
async function init(){
  loadTheme();
  await Promise.all([dbLoadCustomKat(),dbLoadSettings()]);
  const hash=window.location.hash.slice(1);
  const dapur=DAPURS.find(d=>d.id===hash);
  if(dapur){openDapur(dapur.id);}
  else{showPage('dashboard');renderDashboard();}
}

window.addEventListener('hashchange',()=>{
  const hash=window.location.hash.slice(1);
  const dapur=DAPURS.find(d=>d.id===hash);
  if(dapur)openDapur(dapur.id);
  else{showPage('dashboard');renderDashboard();}
});

init();
