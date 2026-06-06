'use strict';

const TOPICS = [
  'Proposiciones, conectivos, tablas de verdad; traducción de enunciados',
  'Equivalencias lógicas, De Morgan, tautología/contradicción/contingencia'
];
const DIFFICULTIES = ['básico','medio','avanzado'];
const PATTERN_LIBRARY = [
  {id:'fila1', name:'Fila superior', desc:'Completa toda la primera fila.', cells:[0,1,2,3,4]},
  {id:'fila3', name:'Fila central', desc:'Completa toda la fila central.', cells:[10,11,12,13,14]},
  {id:'fila5', name:'Fila inferior', desc:'Completa toda la última fila.', cells:[20,21,22,23,24]},
  {id:'col1', name:'Columna B', desc:'Completa toda la primera columna.', cells:[0,5,10,15,20]},
  {id:'col3', name:'Columna N', desc:'Completa toda la columna central.', cells:[2,7,12,17,22]},
  {id:'col5', name:'Columna O', desc:'Completa toda la última columna.', cells:[4,9,14,19,24]},
  {id:'diag1', name:'Diagonal principal', desc:'Completa la diagonal de izquierda a derecha.', cells:[0,6,12,18,24]},
  {id:'diag2', name:'Diagonal secundaria', desc:'Completa la diagonal de derecha a izquierda.', cells:[4,8,12,16,20]},
  {id:'x', name:'Figura X', desc:'Completa las dos diagonales.', cells:[0,4,6,8,12,16,18,20,24]},
  {id:'corners', name:'Cuatro esquinas', desc:'Completa las cuatro esquinas.', cells:[0,4,20,24]},
  {id:'cruz', name:'Cruz lógica', desc:'Completa fila central y columna central.', cells:[2,7,10,11,12,13,14,17,22]},
  {id:'diamante', name:'Diamante', desc:'Completa el rombo alrededor del centro.', cells:[2,6,8,10,12,14,16,18,22]},
  {id:'marco', name:'Marco corto', desc:'Completa esquinas y centros laterales.', cells:[0,2,4,10,14,20,22,24]}
];
const PATTERNS = shuffle(PATTERN_LIBRARY).slice(0,3).map((p,idx)=>({...p, unit:idx+1, completed:false}));
const LETTERS = ['B','I','N','G','O'];
const SYMBOL = {and:'\\land', or:'\\lor', not:'\\lnot', imp:'\\to', iff:'\\leftrightarrow'};
const NAT = {
  p:['estudio lógica','leo el enunciado con cuidado','completo la tabla de verdad','asisto a clase'],
  q:['apruebo la práctica','identifico el conectivo principal','justifico mi respuesta','resuelvo el ejercicio'],
  r:['uso una equivalencia lógica','reviso la pista','obtengo una tautología','corrijo mi procedimiento']
};

function formulaText(f){ return `\\(${f}\\)`; }
function choice(values){ return values[Math.floor(Math.random()*values.length)]; }
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
function asVF(v){ return v ? 'V' : 'F'; }
function boolRows(vars){ const n=vars.length; const rows=[]; for(let i=0;i<Math.pow(2,n);i++){ const row={}; vars.forEach((v,idx)=>{ row[v]=!!(Math.floor(i/Math.pow(2,n-idx-1))%2===0); }); rows.push(row); } return rows; }
const EVALS = {
  'p\\land q': r => r.p && r.q,
  'p\\lor q': r => r.p || r.q,
  '\\lnot p': r => !r.p,
  'p\\to q': r => (!r.p) || r.q,
  'q\\to p': r => (!r.q) || r.p,
  'p\\leftrightarrow q': r => r.p === r.q,
  '\\lnot(p\\land q)': r => !(r.p && r.q),
  '\\lnot p\\lor \\lnot q': r => (!r.p) || (!r.q),
  '\\lnot(p\\lor q)': r => !(r.p || r.q),
  '\\lnot p\\land \\lnot q': r => (!r.p) && (!r.q),
  '(p\\lor q)\\land \\lnot p': r => (r.p || r.q) && !r.p,
  '\\lnot p\\land q': r => (!r.p) && r.q,
  '(p\\to q)\\land(q\\to p)': r => ((!r.p)||r.q) && ((!r.q)||r.p),
  '(p\\lor q)\\to r': r => (!(r.p || r.q)) || r.r,
  '(p\\land q)\\to r': r => (!(r.p && r.q)) || r.r,
  'p\\to(q\\lor r)': r => (!r.p) || (r.q || r.r),
  '(p\\to q)\\land(q\\to r)': r => ((!r.p)||r.q) && ((!r.q)||r.r),
  '(p\\leftrightarrow q)\\lor r': r => (r.p===r.q) || r.r
};
function classify(formula, vars){
  const rows = boolRows(vars); const vals = rows.map(r=>EVALS[formula](r));
  if(vals.every(Boolean)) return 'tautología';
  if(vals.every(v=>!v)) return 'contradicción';
  return 'contingencia';
}
function latexFormula(f){ return formulaText(f); }
function makeOptions(correct, distractors){
  const all = shuffle([correct, ...distractors.filter(x=>x!==correct)]).slice(0,6);
  while(all.length<6) all.push(`Opción ${all.length+1}`);
  return {options: all, answer: all.indexOf(correct)};
}

function generateQuestionBank(){
  const bank=[];
  const formulas2 = ['p\\land q','p\\lor q','p\\to q','q\\to p','p\\leftrightarrow q','\\lnot(p\\land q)','\\lnot(p\\lor q)','(p\\lor q)\\land \\lnot p'];
  const formulas3 = ['(p\\lor q)\\to r','(p\\land q)\\to r','p\\to(q\\lor r)','(p\\to q)\\land(q\\to r)','(p\\leftrightarrow q)\\lor r'];
  const deMorganPairs = [
    ['\\lnot(p\\land q)','\\lnot p\\lor \\lnot q'],
    ['\\lnot(p\\lor q)','\\lnot p\\land \\lnot q']
  ];
  const implicationOptions = ['\\lnot p\\lor q','\\lnot q\\to \\lnot p','\\lnot(p\\land \\lnot q)','q\\lor \\lnot p'];
  const allLatexDistractors = ['p\\land q','p\\lor q','q\\to p','p\\leftrightarrow q','\\lnot p\\land q','p\\land \\lnot q','\\lnot p\\lor q','\\lnot q\\lor p','\\lnot(p\\lor q)','\\lnot(p\\land q)'];

  for(let i=0;i<10000;i++){
    const diff = DIFFICULTIES[i%3];
    const topicGroup = (i%2)+1;
    const serial = String(i+1).padStart(5,'0');
    const t = i%10;
    const pText = choice(NAT.p), qText = choice(NAT.q), rText = choice(NAT.r);

    if(t===0){
      const correct = 'Una oración declarativa que puede ser verdadera o falsa.';
      const opts = makeOptions(correct,[
        'Una pregunta que se responde con sí o no.',
        'Una orden expresada en modo imperativo.',
        'Un deseo o exclamación sin valor de verdad.',
        'Cualquier expresión que contenga letras.',
        'Una definición sin valor de verdad.'
      ]);
      bank.push({id:`Q${serial}`,type:'mc6',topicGroup:1,difficulty:diff,cell:i%25,title:'Proposiciones lógicas',
        prompt:`Seleccione la descripción correcta de una proposición en lógica proposicional.`,...opts,
        hint:`Una proposición debe poder clasificarse como verdadera o falsa.`,
        explanation:`Una proposición es un enunciado declarativo con valor de verdad. Las preguntas, órdenes o deseos no son proposiciones.`});
    } else if(t===1){
      const f = choice(formulas2); const vars=['p','q']; const rows=boolRows(vars); const ans=rows.map(r=>asVF(EVALS[f](r)));
      bank.push({id:`Q${serial}`,type:'truthTable',topicGroup:1,difficulty:diff,cell:i%25,title:'Tabla de verdad con lista desplegable',
        prompt:`Complete la última columna de la tabla de verdad para la fórmula ${latexFormula(f)}.`,vars,formula:latexFormula(f),rows,answer:ans,
        hint:`Evalúa la fórmula fila por fila. Recuerda que ${formulaText('p\\to q')} solo es falsa cuando ${formulaText('p')} es verdadera y ${formulaText('q')} es falsa.`,
        explanation:`La columna correcta para ${latexFormula(f)} es ${ans.join(', ')}.`});
    } else if(t===2){
      const f = choice(formulas3); const vars=['p','q','r']; const rows=boolRows(vars); const sampleRows=rows.slice(0,4); const ans=sampleRows.map(r=>asVF(EVALS[f](r)));
      bank.push({id:`Q${serial}`,type:'truthTable',topicGroup:1,difficulty:'avanzado',cell:i%25,title:'Tabla de verdad parcial',
        prompt:`Complete la columna indicada para la fórmula ${latexFormula(f)} en las filas mostradas.`,vars,formula:latexFormula(f),rows:sampleRows,answer:ans,
        hint:`Trabaja desde los paréntesis internos hacia el conectivo principal.`,
        explanation:`Para las filas mostradas, la columna de ${latexFormula(f)} es ${ans.join(', ')}.`});
    } else if(t===3){
      const mode=i%4;
      let correct, prompt;
      if(mode===0){ correct=`p\\land q`; prompt=`Sea ${formulaText('p')}: “${pText}” y ${formulaText('q')}: “${qText}”. Traduzca: “${pText} y ${qText}”.`; }
      else if(mode===1){ correct=`p\\lor q`; prompt=`Sea ${formulaText('p')}: “${pText}” y ${formulaText('q')}: “${qText}”. Traduzca: “${pText} o ${qText}”.`; }
      else if(mode===2){ correct=`p\\to q`; prompt=`Sea ${formulaText('p')}: “${pText}” y ${formulaText('q')}: “${qText}”. Traduzca: “si ${pText}, entonces ${qText}”.`; }
      else { correct=`p\\leftrightarrow q`; prompt=`Sea ${formulaText('p')}: “${pText}” y ${formulaText('q')}: “${qText}”. Traduzca: “${pText} si y solo si ${qText}”.`; }
      const opts=makeOptions(formulaText(correct), allLatexDistractors.map(formulaText));
      bank.push({id:`Q${serial}`,type:'mc6',topicGroup:1,difficulty:diff,cell:i%25,title:'Traducción de enunciados a fórmula',prompt,...opts,
        hint:`Identifica el conectivo del lenguaje natural: “y”, “o”, “si... entonces”, “si y solo si”.`,
        explanation:`La traducción correcta es ${formulaText(correct)}.`});
    } else if(t===4){
      const f = choice(['p\\land q','p\\lor q','p\\to q','p\\leftrightarrow q','\\lnot p\\lor q']);
      const texts={
        'p\\land q':`“${pText} y ${qText}”`,
        'p\\lor q':`“${pText} o ${qText}”`,
        'p\\to q':`“si ${pText}, entonces ${qText}”`,
        'p\\leftrightarrow q':`“${pText} si y solo si ${qText}”`,
        '\\lnot p\\lor q':`“no ${pText} o ${qText}”`
      };
      const opts=makeOptions(texts[f],[`“${pText} y no ${qText}”`,`“si ${qText}, entonces ${pText}”`,`“${qText} si y solo si ${pText}”`,`“no es cierto que ${pText} o ${qText}”`,`“${pText}, pero no ${qText}”`]);
      bank.push({id:`Q${serial}`,type:'mc6',topicGroup:1,difficulty:diff,cell:i%25,title:'Traducción de fórmula a lenguaje natural',
        prompt:`Sea ${formulaText('p')}: “${pText}” y ${formulaText('q')}: “${qText}”. ¿Cuál enunciado traduce mejor ${latexFormula(f)}?`,...opts,
        hint:`Lee primero la negación y luego el conectivo principal.`,
        explanation:`La fórmula ${latexFormula(f)} corresponde a ${texts[f]}.`});
    } else if(t===5){
      const form = choice(formulas2); const cls = classify(form,['p','q']);
      const opts=makeOptions(cls,['tautología','contradicción','contingencia','equivalencia material','implicación inversa','proposición abierta']);
      bank.push({id:`Q${serial}`,type:'mc6',topicGroup:2,difficulty:diff,cell:i%25,title:'Clasificación por tabla de verdad',
        prompt:`Clasifique la fórmula ${latexFormula(form)} según su tabla de verdad.`,...opts,
        hint:`Es tautología si siempre es verdadera, contradicción si siempre es falsa y contingencia si cambia de valor.`,
        explanation:`La fórmula ${latexFormula(form)} es una ${cls}.`});
    } else if(t===6){
      const pair = deMorganPairs[i%2]; const opts=makeOptions(formulaText(pair[1]), allLatexDistractors.map(formulaText));
      bank.push({id:`Q${serial}`,type:'mc6',topicGroup:2,difficulty:diff,cell:i%25,title:'Leyes de De Morgan',
        prompt:`Seleccione una fórmula equivalente a ${formulaText(pair[0])}.`,...opts,
        hint:`Al negar una conjunción se obtiene una disyunción de negaciones; al negar una disyunción se obtiene una conjunción de negaciones.`,
        explanation:`Por De Morgan, ${formulaText(pair[0]+'\\equiv '+pair[1])}.`});
    } else if(t===7){
      const statements=[
        {text:`I. ${formulaText('p\\to q')} es falsa únicamente cuando ${formulaText('p')} es verdadera y ${formulaText('q')} es falsa.`, val:true},
        {text:`II. ${formulaText('p\\to q\\equiv \\lnot p\\lor q')}.`, val:true},
        {text:`III. ${formulaText('p\\to q\\equiv q\\to p')}.`, val:false},
        {text:`IV. ${formulaText('p\\to q')} es equivalente a su contrapositiva ${formulaText('\\lnot q\\to \\lnot p')}.`, val:true}
      ];
      const opts=makeOptions('Solo I, II y IV',['Solo I y II','Solo II y III','Solo I, III y IV','I, II, III y IV','Ninguna']);
      bank.push({id:`Q${serial}`,type:'statements',topicGroup:2,difficulty:diff,cell:i%25,title:'Afirmaciones I, II, III y IV',
        prompt:`Considere las afirmaciones sobre el condicional. ¿Cuáles son verdaderas?`,statements:statements.map(s=>s.text),truths:statements.map(s=>s.val),...opts,
        hint:`La conversa ${formulaText('q\\to p')} no es equivalente al condicional original.`,
        explanation:`Son verdaderas I, II y IV; III es falsa.`});
    } else if(t===8){
      const statements=[
        {text:`${formulaText('\\lnot(p\\land q)\\equiv \\lnot p\\lor \\lnot q')}.`, val:true},
        {text:`${formulaText('p\\leftrightarrow q')} es verdadera cuando ${formulaText('p')} y ${formulaText('q')} tienen el mismo valor de verdad.`, val:true},
        {text:`Toda fórmula con el conectivo ${formulaText('\\lor')} es una tautología.`, val:false},
        {text:`Una contradicción es falsa en todas las filas de su tabla de verdad.`, val:true}
      ];
      bank.push({id:`Q${serial}`,type:'tfStatements',topicGroup:2,difficulty:diff,cell:i%25,title:'Afirmaciones de verdadero y falso',
        prompt:`Determine si cada afirmación es verdadera o falsa.`,statements:statements.map(s=>s.text),answer:statements.map(s=>s.val),
        hint:`Verifica cada afirmación con definiciones y equivalencias lógicas.`,
        explanation:`Las respuestas correctas son V, V, F, V.`});
    } else {
      const correct = formulaText(choice(implicationOptions));
      const opts=makeOptions(correct, allLatexDistractors.map(formulaText));
      bank.push({id:`Q${serial}`,type:'mc6',topicGroup:2,difficulty:'avanzado',cell:i%25,title:'Equivalencia de la implicación',
        prompt:`Seleccione una fórmula equivalente a ${formulaText('p\\to q')}.`,...opts,
        hint:`La implicación material puede expresarse sin el símbolo ${formulaText('\\to')}.`,
        explanation:`Una equivalencia fundamental es ${formulaText('p\\to q\\equiv \\lnot p\\lor q')}. También es equivalente a su contrapositiva ${formulaText('\\lnot q\\to \\lnot p')}.`});
    }
  }
  return bank;
}

const QUESTION_BANK = generateQuestionBank();

const state = {
  started:false, finalized:false, drawing:false, current:null, currentCell:null, selected:null, marked:new Set([12]), answered:0, correct:0, attempts:0, hints:0, draws:0, score:0, completedPatternIds:new Set(), history:[], startTime:Date.now(), bankOrder:shuffle([...Array(QUESTION_BANK.length).keys()]), bankCursor:0
};

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function typeLabel(t){return {mc6:'Opción múltiple de 6', tfStatements:'Verdadero/Falso', statements:'Afirmaciones I–IV', truthTable:'Tabla de verdad'}[t] || t;}
function difficultyClass(d){return d==='básico'?'basic':d==='medio'?'medium':'advanced';}
function clampScore(x){ return Math.max(0, Math.min(5, Number(x.toFixed(2)))); }
function grade(){ return clampScore(state.score); }
function elapsedSeconds(){return Math.floor((Date.now()-state.startTime)/1000);}
function fmtTime(s){ const m=Math.floor(s/60); const ss=String(s%60).padStart(2,'0'); return `${m}:${ss}`; }

function renderAllMath(root=document.body){
  if(window.MathJax && window.MathJax.typesetPromise){ window.MathJax.typesetPromise([root]).catch(()=>{}); }
}
function normalizeLatex(s){ return String(s||'').replace(/\\\\\(/g,'\\(').replace(/\\\\\)/g,'\\)').replace(/\\\\\[/g,'\\[').replace(/\\\\\]/g,'\\]'); }

function init(){
  buildCageBalls(); buildBoard(); renderPatterns(); updateStats(); bindEvents();
  window.EduScorm?.init?.();
  setTimeout(()=>renderAllMath(), 700);
}
function bindEvents(){
  $('#startFullscreenBtn').addEventListener('click', async()=>{ await enterFullscreen(); $('#splash').classList.add('hidden'); state.started=true; state.startTime=Date.now(); });
  $('#howStartBtn').addEventListener('click', ()=>openHow());
  $('#howBtn').addEventListener('click', ()=>openHow());
  $('#fullscreenBtn').addEventListener('click', enterFullscreen);
  $('#drawBtn').addEventListener('click', drawQuestion);
  $('#finishBtn').addEventListener('click', ()=>finishGame('manual'));
  $('#hintBtn').addEventListener('click', showHint);
  $('#submitBtn').addEventListener('click', submitAnswer);
  $('#nextBtn').addEventListener('click', closeQuestion);
  $('#closeQuestionBtn').addEventListener('click', closeQuestion);
  $('#downloadReportBtn').addEventListener('click', downloadReportHtml);
  $('#downloadCsvBtn').addEventListener('click', downloadCsv);
  $$('[data-close]').forEach(b=>b.addEventListener('click',()=>{$('#'+b.dataset.close).close();}));
}
async function enterFullscreen(){
  try{
    if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
  }catch(e){ /* Brightspace o navegador puede impedirlo; no se bloquea el intento. */ }
}
function openHow(){ $('#howModal').showModal(); setTimeout(()=>renderAllMath($('#howModal')),100); }
function buildCageBalls(){
  const holes=document.querySelector('.board-holes'); if(holes){ holes.innerHTML=''; for(let h=0; h<45; h++){ const span=document.createElement('span'); holes.appendChild(span); } }
  const box=$('#cageBalls'); box.innerHTML='';
  for(let i=0;i<18;i++){
    const b=document.createElement('span'); b.className='mini-ball'; b.textContent=LETTERS[i%5]+'-'+(i+3);
    b.style.setProperty('--x', `${Math.round(Math.cos(i*1.7)*70)}px`);
    b.style.setProperty('--y', `${Math.round(Math.sin(i*2.1)*55)}px`);
    b.style.animationDelay=`${-i*.18}s`;
    box.appendChild(b);
  }
}
function buildBoard(){
  const board=$('#board'); board.innerHTML='';
  for(let i=0;i<25;i++){
    const cell=document.createElement('div'); cell.className='cell'; cell.dataset.i=i;
    const col=i%5, row=Math.floor(i/5), n=col*15+row*3+7;
    if(i===12){ cell.classList.add('free','correct'); cell.innerHTML='<b>LIBRE</b><span>Centro</span>'; }
    else cell.innerHTML=`<b>${LETTERS[col]}-${n}</b><span>${i%2?TOPICS[1].split(';')[0]:TOPICS[0].split(';')[0]}</span>`;
    board.appendChild(cell);
  }
}
function renderPatterns(){
  const container=$('#patterns'); container.innerHTML='';
  for(const p of PATTERNS){
    const done = state.completedPatternIds?.has(p.id);
    const card=document.createElement('article'); card.className='pattern'+(done?' completed':'');
    card.innerHTML=`<div class="unit-pill">Unidad ${p.unit}</div><h3>${p.name}</h3><p>${p.desc}</p><div class="mini-board ${p.id}">${Array.from({length:25},(_,i)=>`<span class="${patternCells(p).includes(i)?'on':''}"></span>`).join('')}</div><small>${done?'Completada ✓':'Pendiente'}</small>`;
    container.appendChild(card);
  }
}
function patternCells(p){ return p.cells || []; }
function completedPatternsNow(){
  const marked=i=>state.marked.has(i);
  return PATTERNS.filter(p=>patternCells(p).every(marked));
}
function updatePatternCompletion(){
  const completed = completedPatternsNow();
  for(const p of completed) state.completedPatternIds.add(p.id);
  renderPatterns();
  return state.completedPatternIds.size;
}
function updateStats(){
  $('#gradeMini').textContent=grade().toFixed(1);
  $('#correctMini').textContent=state.correct;
  $('#answeredMini').textContent=`/${state.answered}`;
  $('#attemptsMini').textContent=state.attempts;
  $('#bankMini').textContent=QUESTION_BANK.length.toLocaleString('es-CO');
}
function animateDraw(label, onReady){
  $('#statusPill').textContent='Mezclando balotas...';
  $('#cage').classList.add('spin-fast');
  const ball=$('#flyingBall');
  ball.textContent=label;
  ball.classList.add('hidden');
  ball.classList.remove('fly');
  setTimeout(()=>{
    $('#statusPill').textContent='Sale la balota';
    ball.classList.remove('hidden');
    ball.classList.add('fly');
  },1800);
  setTimeout(()=>{
    $('#cage').classList.remove('spin-fast');
    ball.classList.add('hidden');
    ball.classList.remove('fly');
    if(typeof onReady==='function') onReady();
  },2750);
}
function nextQuestion(){
  let safety=0;
  while(safety++<QUESTION_BANK.length){
    const q=QUESTION_BANK[state.bankOrder[state.bankCursor++ % state.bankOrder.length]];
    if(!state.history.some(h=>h.id===q.id)) return q;
  }
  return QUESTION_BANK[Math.floor(Math.random()*QUESTION_BANK.length)];
}
function drawQuestion(){
  if(state.finalized || state.drawing) return;
  state.drawing=true;
  $('#drawBtn').disabled=true;
  const q=nextQuestion(); state.current=q; state.selected=null; state.draws++;
  const cellIndex = chooseAvailableCell(q.cell);
  state.currentCell=cellIndex;
  const col=cellIndex%5, row=Math.floor(cellIndex/5); const label=`${LETTERS[col]}-${col*15+row*3+7}`;
  $('#currentBall').textContent='...';
  $('#currentTitle').textContent='La balotera está mezclando...';
  $('#currentMeta').textContent='Espera a que salga la balota para ver la pregunta.';
  $$('.cell').forEach(c=>c.classList.remove('active'));
  $(`.cell[data-i="${cellIndex}"]`)?.classList.add('active');
  animateDraw(label, ()=>{
    $('#currentBall').textContent=label;
    $('#currentTitle').textContent=q.title;
    $('#currentMeta').textContent=`${q.difficulty} · ${TOPICS[q.topicGroup-1]}`;
    $('#statusPill').textContent='Pregunta activa';
    state.drawing=false;
    $('#drawBtn').disabled=false;
    openQuestion(q);
  });
}
function chooseAvailableCell(preferred){
  if(preferred!==12 && !state.marked.has(preferred)) return preferred;
  const available=[]; for(let i=0;i<25;i++) if(i!==12 && !state.marked.has(i)) available.push(i);
  return available.length?choice(available):preferred;
}
function openQuestion(q){
  $('#qTopic').textContent=TOPICS[q.topicGroup-1];
  $('#qTitle').textContent=q.title;
  $('#qDifficulty').textContent=q.difficulty;
  $('#qDifficulty').className=`badge ${difficultyClass(q.difficulty)}`;
  $('#qType').textContent=typeLabel(q.type);
  $('#qPrompt').innerHTML=normalizeLatex(q.prompt);
  $('#hintBox').classList.add('hidden'); $('#feedbackBox').classList.add('hidden'); $('#nextBtn').classList.add('hidden'); $('#submitBtn').classList.remove('hidden');
  renderQuestionBody(q);
  $('#questionModal').showModal();
  setTimeout(()=>renderAllMath($('#questionModal')),100);
}
function renderQuestionBody(q){
  const body=$('#qBody'); body.innerHTML=''; state.selected=null;
  if(q.type==='mc6' || q.type==='statements'){
    if(q.type==='statements'){
      const box=document.createElement('div'); box.className='statement-box latex'; box.innerHTML=q.statements.map(s=>`<p>${normalizeLatex(s)}</p>`).join(''); body.appendChild(box);
    }
    const list=document.createElement('div'); list.className='options-list';
    q.options.forEach((op,i)=>{ const btn=document.createElement('button'); btn.className='option latex'; btn.innerHTML=`<b>${String.fromCharCode(65+i)}</b> ${normalizeLatex(op)}`; btn.addEventListener('click',()=>{state.selected=i; $$('.option').forEach(x=>x.classList.remove('selected')); btn.classList.add('selected');}); list.appendChild(btn); });
    body.appendChild(list);
  }
  if(q.type==='tfStatements'){
    const table=document.createElement('table'); table.className='truth-table statement-table latex';
    table.innerHTML='<thead><tr><th>Afirmación</th><th>V</th><th>F</th></tr></thead><tbody>'+q.statements.map((s,i)=>`<tr><td>${normalizeLatex(s)}</td><td><label class="radio-cell"><input type="radio" name="tf${i}" value="true"></label></td><td><label class="radio-cell"><input type="radio" name="tf${i}" value="false"></label></td></tr>`).join('')+'</tbody>';
    body.appendChild(table);
  }
  if(q.type==='truthTable'){
    const table=document.createElement('table'); table.className='truth-table latex';
    table.innerHTML='<thead><tr>'+q.vars.map(v=>`<th>${formulaText(v)}</th>`).join('')+`<th>${q.formula}</th></tr></thead><tbody>`+q.rows.map((r,i)=>`<tr>${q.vars.map(v=>`<td>${asVF(r[v])}</td>`).join('')}<td><select class="truth-select" data-row="${i}"><option value="">—</option><option>V</option><option>F</option></select></td></tr>`).join('')+'</tbody>';
    body.appendChild(table);
  }
}
function showHint(){
  if(!state.current) return; state.hints++;
  $('#hintBox').innerHTML=`<b>Pista:</b> ${normalizeLatex(state.current.hint)}`;
  $('#hintBox').classList.remove('hidden'); renderAllMath($('#hintBox'));
}
function submitAnswer(){
  const q=state.current; if(!q) return;
  let ok=false; let submitted='';
  if(q.type==='mc6' || q.type==='statements'){
    if(state.selected===null){ flashFeedback('Selecciona una opción antes de responder.', false, false); return; }
    ok = state.selected === q.answer; submitted = q.options[state.selected];
  } else if(q.type==='tfStatements'){
    const vals=[]; for(let i=0;i<q.statements.length;i++){ const checked=document.querySelector(`input[name="tf${i}"]:checked`); if(!checked){ flashFeedback('Completa todas las afirmaciones antes de responder.', false, false); return; } vals.push(checked.value==='true'); }
    ok = vals.every((v,i)=>v===q.answer[i]); submitted = vals.map(v=>v?'V':'F').join(', ');
  } else if(q.type==='truthTable'){
    const vals=$$('.truth-select').map(s=>s.value); if(vals.some(v=>!v)){ flashFeedback('Completa todas las filas de la tabla antes de responder.', false, false); return; }
    ok = vals.every((v,i)=>v===q.answer[i]); submitted = vals.join(', ');
  }
  state.attempts++; state.answered++;
  if(ok){
    state.correct++;
    state.score = clampScore(state.score + 0.2);
    state.marked.add(state.currentCell);
    $(`.cell[data-i="${state.currentCell}"]`)?.classList.add('correct');
  } else {
    state.score = clampScore(state.score - 0.1);
  }
  const unitsBefore = state.completedPatternIds.size;
  const unitsAfter = updatePatternCompletion();
  if(unitsAfter>unitsBefore){
    $('#statusPill').textContent=`Unidad ${unitsAfter}/3 completa`;
    if(unitsAfter>=3) state.score = 5;
  }
  state.history.push({
    id:q.id,
    title:q.title,
    type:typeLabel(q.type),
    rawType:q.type,
    topic:TOPICS[q.topicGroup-1],
    topicGroup:q.topicGroup,
    difficulty:q.difficulty,
    correct:ok,
    submitted,
    answer:expectedAnswerText(q),
    hint:q.hint || '',
    explanation:q.explanation || '',
    prompt:q.prompt || '',
    options:q.options ? [...q.options] : [],
    statements:q.statements ? [...q.statements] : [],
    vars:q.vars ? [...q.vars] : [],
    formula:q.formula || '',
    rows:q.rows ? JSON.parse(JSON.stringify(q.rows)) : [],
    truthAnswer:q.answer ? (Array.isArray(q.answer) ? [...q.answer] : q.answer) : '',
    hintUsed:!$('#hintBox').classList.contains('hidden'),
    cell:state.currentCell,
    ball: LETTERS[state.currentCell%5]+(Math.floor(state.currentCell/5)+1),
    scoreAfter:grade(),
    units:state.completedPatternIds.size,
    timestamp:new Date().toLocaleString()
  });
  updateStats();
  let extra = unitsAfter>unitsBefore ? ` <b>Además completaste una unidad del cartón (${unitsAfter}/3).</b>` : '';
  flashFeedback((ok?'Correcto. Sumaste 0.2. ':'Incorrecto. Perdiste 0.1. ')+normalizeLatex(q.explanation)+extra, ok, true);
  $('#submitBtn').classList.add('hidden'); $('#nextBtn').classList.remove('hidden');
  if(state.completedPatternIds.size>=3){ setTimeout(()=>finishGame('tres-figuras-completas'),1200); }
  else if(grade()>=5){ setTimeout(()=>finishGame('nota-5'),900); }
}
function expectedAnswerText(q){
  if(q.type==='mc6'||q.type==='statements') return q.options[q.answer];
  if(q.type==='tfStatements') return q.answer.map(v=>v?'V':'F').join(', ');
  if(q.type==='truthTable') return q.answer.join(', ');
  return '';
}
function flashFeedback(msg, ok, latex=true){
  const box=$('#feedbackBox'); box.className=`feedback ${ok?'ok':'bad'}`; box.innerHTML=msg; box.classList.remove('hidden'); if(latex) renderAllMath(box);
}
function closeQuestion(){ try{$('#questionModal').close();}catch(e){} $('#statusPill').textContent='Listo'; }
function checkWin(){ return state.completedPatternIds.size>=3 || grade()>=5; }
function finishGame(reason='manual'){
  if(state.finalized) return; state.finalized=true; state.finishReason=reason; closeQuestion();
  if(state.completedPatternIds.size>=3) state.score = 5;
  const g=Number(grade().toFixed(2));
  $('#finalGrade').textContent=g.toFixed(2);
  buildReport(reason);
  $('#reportPanel').classList.remove('hidden');
  $('#reportPanel').scrollIntoView({behavior:'smooth'});
  const status = g>=3 ? 'passed' : 'failed';
  window.EduScorm?.report?.({score:g, min:0, max:5, status, suspendData:JSON.stringify(summaryData(reason)).slice(0,3900), interactions: state.history});
  setTimeout(()=>downloadReportHtml(),700);
}
function summaryData(reason){ return {reason, grade:grade(), answered:state.answered, correct:state.correct, attempts:state.attempts, hints:state.hints, time:elapsedSeconds(), completedUnits:state.completedPatternIds.size, completedPattern:checkWin(), patterns:PATTERNS.map(p=>({name:p.name,cells:p.cells,completed:state.completedPatternIds.has(p.id)}))}; }
function buildReport(reason){
  const data=summaryData(reason);
  $('#reportGrid').innerHTML=`
    <article><span>Nota</span><b>${data.grade.toFixed(2)}/5.0</b></article>
    <article><span>Aciertos</span><b>${data.correct}/${data.answered}</b></article>
    <article><span>Intentos</span><b>${data.attempts}</b></article>
    <article><span>Tiempo</span><b>${fmtTime(data.time)}</b></article>
    <article><span>Pistas usadas</span><b>${data.hints}</b></article>
    <article><span>Unidades del cartón</span><b>${data.completedUnits}/3</b></article>`;
  const rows=state.history.map((h,i)=>`<tr><td>${i+1}</td><td>${h.type}</td><td>${h.difficulty}</td><td>${h.topic}</td><td>${h.title}</td><td>${h.submitted}</td><td>${h.answer}</td><td>${h.correct?'Correcta':'Incorrecta'}</td><td>${(h.scoreAfter??0).toFixed? h.scoreAfter.toFixed(2):h.scoreAfter}</td><td>${h.units??0}/3</td></tr>`).join('');
  $('#reportTable').innerHTML='<thead><tr><th>#</th><th>Tipo</th><th>Dificultad</th><th>Tema</th><th>Pregunta</th><th>Respuesta</th><th>Esperada</th><th>Resultado</th><th>Nota</th><th>Unidades</th></tr></thead><tbody>'+rows+'</tbody>';
  renderAllMath($('#reportPanel'));
}

function escHtml(value){
  return String(value ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
function reportPercent(ok,total){ return total ? Math.round((ok/total)*100) : 0; }
function groupStats(items, keyFn){
  const map = new Map();
  items.forEach(item=>{
    const key = keyFn(item) || 'Sin categoría';
    if(!map.has(key)) map.set(key,{name:key,total:0,correct:0});
    const entry = map.get(key); entry.total++; if(item.correct) entry.correct++;
  });
  return Array.from(map.values()).sort((a,b)=>a.name.localeCompare(b.name));
}
function reportBarRows(stats){
  if(!stats.length) return '<p class="muted">Aún no hay datos suficientes para generar esta gráfica.</p>';
  return stats.map(s=>{
    const pct = reportPercent(s.correct,s.total);
    return `<div class="bar-row"><div class="bar-label"><strong>${escHtml(s.name)}</strong><span>${s.correct}/${s.total} · ${pct}%</span></div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div></div>`;
  }).join('');
}
function reasonLabel(reason){
  const labels={
    'manual':'Finalización manual del estudiante',
    'tres-figuras-completas':'Juego terminado por completar las tres figuras del cartón',
    'nota-5':'Juego terminado por alcanzar nota 5.0'
  };
  return labels[reason] || reason;
}
function reportFormulaCards(){
  const cards = [
    ['Conectivos proposicionales básicos','Tabla mínima de conectivos usados en el juego.',
      '\\[\\lnot p,\\qquad p\\land q,\\qquad p\\lor q,\\qquad p\\to q,\\qquad p\\leftrightarrow q\\]',
      'Identifica primero el conectivo principal y luego evalúa las subfórmulas de izquierda a derecha.',
      'Confundir la disyunción inclusiva con la exclusiva o tratar el condicional como una conjunción.'],
    ['Condicional material','El condicional solo es falso cuando el antecedente es verdadero y el consecuente es falso.',
      '\\[p\\to q\\equiv \\lnot p\\lor q\\]',
      'Evalúa primero el valor de verdad de \\(p\\) y \\(q\\); después verifica si aparece el caso V-F.',
      'Pensar que \\(p\\to q\\) exige que \\(p\\) sea verdadero para que toda la fórmula sea verdadera.'],
    ['Bicondicional','El bicondicional es verdadero cuando ambas proposiciones tienen el mismo valor de verdad.',
      '\\[p\\leftrightarrow q\\equiv (p\\to q)\\land(q\\to p)\\]',
      'Compara las columnas de \\(p\\) y \\(q\\). Si coinciden, el bicondicional es verdadero.',
      'Olvidar que el bicondicional también es verdadero cuando ambas proposiciones son falsas.'],
    ['Leyes de De Morgan','Reglas fundamentales para negar conjunciones y disyunciones.',
      '\\[\\lnot(p\\land q)\\equiv \\lnot p\\lor\\lnot q,\\qquad \\lnot(p\\lor q)\\equiv \\lnot p\\land\\lnot q\\]',
      'Distribuye la negación y cambia el conectivo: conjunción pasa a disyunción y disyunción pasa a conjunción.',
      'Negar cada proposición sin cambiar el conectivo principal.'],
    ['Tautología, contradicción y contingencia','Clasificación de fórmulas mediante su columna final.',
      '\\[\\text{tautología: siempre V},\\qquad \\text{contradicción: siempre F},\\qquad \\text{contingencia: mezcla V y F}\\]',
      'Construye la tabla completa y observa únicamente la última columna.',
      'Clasificar mirando una sola fila de la tabla o una subfórmula que no es la fórmula principal.'],
    ['Traducción entre lenguaje natural y fórmula','Correspondencia entre expresiones lingüísticas y conectivos lógicos.',
      '\\[\\text{“si }p\\text{, entonces }q\\text{”}\\longleftrightarrow p\\to q\\]',
      'Ubica palabras clave: “no”, “y”, “o”, “si... entonces”, “si y solo si”.',
      'Invertir antecedente y consecuente en los condicionales.']
  ];
  return cards.map(([title,desc,formula,method,error])=>`<article class="formula-card"><h3>${escHtml(title)}</h3><p><strong>Resultado que debe revisar:</strong> ${escHtml(desc)}</p><div class="formula">${formula}</div><p><strong>Método recomendado:</strong> ${escHtml(method)}</p><p><strong>Error frecuente:</strong> ${escHtml(error)}</p></article>`).join('');
}
function truthRowsHtml(h){
  if(h.rawType!=='truthTable' || !h.rows?.length) return '';
  const vars = h.vars || [];
  const expected = Array.isArray(h.truthAnswer) ? h.truthAnswer : [];
  const submitted = String(h.submitted||'').split(',').map(x=>x.trim());
  const rows = h.rows.map((r,i)=>`<tr>${vars.map(v=>`<td>${r[v]?'V':'F'}</td>`).join('')}<td>${escHtml(submitted[i] || '—')}</td><td>${escHtml(expected[i] || '—')}</td></tr>`).join('');
  return `<div class="subcard"><strong>Tabla de verdad evaluada:</strong><table><thead><tr>${vars.map(v=>`<th>\\(${escHtml(v)}\\)</th>`).join('')}<th>Respuesta</th><th>Esperada</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function optionsHtml(h){
  if(!h.options?.length) return '';
  return `<div class="subcard"><strong>Opciones disponibles:</strong><ol>${h.options.map(op=>`<li><span class="latex">${escHtml(op)}</span></li>`).join('')}</ol></div>`;
}
function statementsHtml(h){
  if(!h.statements?.length) return '';
  return `<div class="subcard"><strong>Afirmaciones evaluadas:</strong>${h.statements.map((s,i)=>`<div class="mini-check"><strong>${['I','II','III','IV'][i] || (i+1)}.</strong> <span class="latex">${escHtml(s)}</span></div>`).join('')}</div>`;
}
function reportQuestionCards(){
  if(!state.history.length) return '<p class="muted">El estudiante no respondió preguntas antes de finalizar.</p>';
  return state.history.map((h,i)=>{
    const pill = h.correct ? '<span class="pill ok">Correcta</span>' : '<span class="pill bad">Incorrecta</span>';
    const comparisonClass = h.correct ? 'yes' : 'no';
    const comparisonMark = h.correct ? '✓' : '✗';
    return `<article class="question-card">
      <div class="question-top"><span class="num">${i+1}</span><div><h3>${escHtml(h.title)} · ${escHtml(h.topic)}</h3><p>Balota ${escHtml(h.ball || '')} · ${escHtml(h.type)} · ${escHtml(h.difficulty)} · Nota acumulada: ${Number(h.scoreAfter||0).toFixed(2)}/5.0 · Unidades: ${h.units||0}/3</p></div>${pill}</div>
      <div class="twocol"><div class="answer-box"><strong>Respuesta del estudiante</strong><p class="latex">${escHtml(h.submitted || 'Sin respuesta')}</p></div><div class="answer-box"><strong>Respuesta correcta</strong><p class="latex">${escHtml(h.answer || 'No registrada')}</p></div></div>
      <div class="feedback-panel">
        <h4>Retroalimentación específica de esta pregunta</h4>
        <div class="subcard"><strong>Pregunta respondida:</strong><div class="formula">${escHtml(h.prompt || h.title)}</div></div>
        ${statementsHtml(h)}
        ${truthRowsHtml(h)}
        ${optionsHtml(h)}
        <div class="subcard"><strong>Pista disponible:</strong><p class="latex">${h.hint ? escHtml(h.hint) : 'Esta pregunta no tenía pista disponible.'}</p><p><strong>Uso de pista:</strong> ${h.hintUsed ? 'Sí' : 'No'}</p></div>
        <div class="subcard"><strong>Diagnóstico:</strong><p>${h.correct ? 'Tu respuesta coincide con la respuesta esperada. El procedimiento muestra comprensión del conectivo o criterio evaluado.' : 'Tu respuesta no coincide con la respuesta esperada. Revisa el conectivo principal, la tabla de verdad o la traducción formal antes de concluir.'}</p></div>
        <div class="subcard"><div class="comparison-list"><div class="mini-check ${comparisonClass}"><strong>${comparisonMark} Comparación:</strong> tu respuesta fue <span class="latex">${escHtml(h.submitted || 'Sin respuesta')}</span> y la respuesta esperada era <span class="latex">${escHtml(h.answer || 'No registrada')}</span>.</div></div></div>
        <div class="subcard"><strong>Pasos necesarios:</strong><ol><li>Identifica el tipo de pregunta: tabla de verdad, traducción, equivalencia o afirmaciones.</li><li>Ubica el conectivo principal de la fórmula o del enunciado.</li><li>Evalúa las subfórmulas en orden, cuidando negaciones y condicionales.</li><li>Compara tu resultado con las opciones y justifica por qué las demás no aplican.</li></ol></div>
        <div class="subcard"><strong>Procedimiento lógico correcto:</strong><p class="latex">${escHtml(h.explanation || 'Revisa la definición del conectivo principal y repite la tabla de verdad completa.')}</p></div>
        <div class="subcard"><strong>Cómo resolver tu duda:</strong><p>Vuelve a escribir la fórmula en una hoja, construye su tabla de verdad paso a paso y marca la columna final. Si era una traducción, identifica primero las palabras clave del lenguaje natural.</p></div>
      </div>
    </article>`;
  }).join('');
}
function improvementPlanHtml(){
  const byTopic = groupStats(state.history,h=>h.topic);
  if(!byTopic.length) return '<p class="muted">No hay preguntas respondidas para generar plan de mejora.</p>';
  const sorted = [...byTopic].sort((a,b)=>(a.correct/a.total)-(b.correct/b.total));
  return `<ol>${sorted.map(s=>{
    const pct = reportPercent(s.correct,s.total);
    let advice = pct>=80 ? 'Mantén el dominio con ejercicios de mayor complejidad y explicaciones escritas.' : pct>=50 ? 'Refuerza procedimientos y revisa errores puntuales en tablas y traducciones.' : 'Prioriza este tema: reconstruye definiciones, ejemplos básicos y tablas completas.';
    return `<li><strong>${escHtml(s.name)}:</strong> ${s.correct}/${s.total} · ${pct}%. ${advice}</li>`;
  }).join('')}</ol>`;
}
function patternReportHtml(){
  return PATTERNS.map((p,idx)=>{
    const done = state.completedPatternIds.has(p.id);
    const pct = Math.round((p.cells.filter(c=>state.marked.has(c)).length / p.cells.length)*100);
    return `<div class="bar-row"><div class="bar-label"><strong>Unidad ${idx+1}: ${escHtml(p.name)}</strong><span>${done?'Completada':'En progreso'} · ${pct}%</span></div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><p class="muted">${escHtml(p.desc)} Celdas: ${p.cells.map(c=>LETTERS[c%5]+(Math.floor(c/5)+1)).join(', ')}</p></div>`;
  }).join('');
}
function eventLogHtml(reason){
  const events = [];
  events.push({time:new Date(state.startTime).toLocaleString(), event:'La práctica comenzó. Se seleccionaron tres figuras aleatorias del cartón.'});
  PATTERNS.forEach((p,idx)=>events.push({time:'Durante la partida', event:`Unidad ${idx+1}: ${p.name}. ${state.completedPatternIds.has(p.id)?'Completada':'No completada'} al finalizar.`}));
  state.history.forEach((h,i)=>events.push({time:h.timestamp || 'Durante la partida', event:`Balota ${h.ball}: ${h.correct?'respuesta correcta (+0.2)':'respuesta incorrecta (-0.1)'} en ${h.type}. Nota acumulada ${Number(h.scoreAfter||0).toFixed(2)}/5.0.`}));
  events.push({time:new Date().toLocaleString(), event:`Juego finalizado: ${reasonLabel(reason)}. Nota enviada a Brightspace mediante SCORM 1.2.`});
  return `<table><tr><th>#</th><th>Hora</th><th>Evento</th></tr>${events.map((e,i)=>`<tr><td>${i+1}</td><td>${escHtml(e.time)}</td><td>${escHtml(e.event)}</td></tr>`).join('')}</table>`;
}
function bookReportHtml(reason='manual'){
  const data = summaryData(reason);
  const pct = reportPercent(data.correct,data.answered);
  const byTopic = groupStats(state.history,h=>h.topic);
  const byType = groupStats(state.history,h=>h.type);
  const byDifficulty = groupStats(state.history,h=>h.difficulty);
  const endTime = new Date().toLocaleString();
  const startTime = new Date(state.startTime).toLocaleString();
  const statusText = data.grade>=3 ? 'Aprobado' : 'En proceso de refuerzo';
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Informe final · Bingo lógico proposicional</title>
<script>window.MathJax={tex:{inlineMath:[["\\\\(","\\\\)"]],displayMath:[["\\\\[","\\\\]"]],processEscapes:true},svg:{fontCache:'global'},options:{skipHtmlTags:['script','noscript','style','textarea','pre','code']}};</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<style>
:root{--blue:#0b3d79;--blue2:#06234c;--gold:#b8860b;--soft:#f7f9fd;--paper:#fffdf7;--rose:#d63b5f;--ok:#0b7f54;--ink:#10243d;--line:#e7edf5;--purple:#4f46e5;--teal:#19b8ad}*{box-sizing:border-box}body{margin:0;background:linear-gradient(180deg,#f4f7fb,#fff);color:var(--ink);font-family:Georgia,'Times New Roman',serif;line-height:1.58;font-size:16px}.page{width:min(980px,calc(100% - 28px));margin:22px auto 56px}.hero,.section{background:var(--paper);border:1px solid #e4eaf3;border-radius:24px;padding:26px;margin:22px 0;box-shadow:0 10px 28px rgba(8,35,74,.08)}.hero{border:3px solid rgba(79,70,229,.38);text-align:center}.stamp{background:linear-gradient(135deg,#10243d,#0b3d79 58%,#3b2f79);color:#fff;border-radius:18px;padding:18px;margin-bottom:18px;box-shadow:inset 0 0 0 2px rgba(255,255,255,.18)}.stamp h1{margin:0;font-size:clamp(2.1rem,6vw,4.3rem);letter-spacing:2px;text-transform:uppercase;color:#fff}.stamp h2{margin:10px 0 0;font-size:clamp(1.25rem,3vw,2.2rem);color:#ffe7a3}.eyebrow{letter-spacing:4px;text-transform:uppercase;color:var(--gold);font-weight:900;font-size:.82rem}.title{font-size:clamp(2rem,5vw,4rem);line-height:.98;color:#072e59;margin:10px 0 8px}.subtitle{font-size:1.35rem;color:#956507;font-weight:900;margin:0 0 16px}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:24px 0}.metric{background:linear-gradient(180deg,#0d4780,#061f43);color:#fff;border-radius:18px;padding:18px;text-align:left;min-height:118px}.metric b{font-size:1.9rem;color:#ffde79}.metric span{display:block;text-transform:uppercase;letter-spacing:.8px;font-size:.76rem;font-weight:900;color:#e9f4ff}.metric.red{background:linear-gradient(180deg,#d63b5f,#a80929)}.metric.green{background:linear-gradient(180deg,#0b7f54,#064d35)}h2{font-size:2rem;color:#072e59;margin:0 0 14px;border-bottom:3px solid rgba(184,134,11,.35);padding-bottom:8px}h3{color:#0b3d79}.bar-row{background:#f6f9fd;border:1px solid #e1e9f3;border-radius:16px;padding:13px 14px;margin:12px 0}.bar-label{display:flex;justify-content:space-between;gap:12px;color:#12365c}.bar-track{height:14px;background:#e7eef8;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 2px rgba(0,0,0,.08)}.bar-fill{height:100%;background:linear-gradient(90deg,#0b3d79,#19b8ad,#ffd35a);border-radius:999px}.formula-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.formula-card,.question-card{border:1px solid #e0e7f0;border-radius:18px;padding:18px;background:#fff;box-shadow:0 5px 18px rgba(8,35,74,.05)}.formula-card h3{color:#0b3d79;margin-top:0}.formula,.latex{background:#f7faff;border:1px solid #e0e9f4;border-radius:14px;padding:13px;margin:10px 0;overflow-x:auto}.security-table,table{width:100%;border-collapse:collapse;background:#fff;border-radius:14px;overflow:hidden}th{background:#0b3d79;color:#fff;text-align:left}td,th{padding:12px;border-bottom:1px solid #e8edf5}.question-top{display:flex;align-items:center;gap:13px;margin-bottom:13px}.question-top h3{margin:0;color:#10243d}.question-top p{margin:3px 0 0;color:#617089;font-size:.95rem}.num{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:#0b3d79;color:#fff;font-weight:900;flex:0 0 auto}.pill{margin-left:auto;padding:8px 14px;border-radius:999px;font-weight:900}.pill.ok{background:#e5f7ef;color:#0b7f54}.pill.bad{background:#ffedf1;color:#b31336}.twocol{display:grid;grid-template-columns:1fr 1fr;gap:14px}.answer-box{background:#eef6ff;border:1px solid #dbe9f7;border-radius:14px;padding:14px}.answer-box p{margin:6px 0 0}.feedback-panel{background:#fffaf0;border:1px solid #efe1bf;border-radius:18px;padding:16px;margin-top:14px}.feedback-panel h4{font-size:1.1rem;color:#8a620d;margin:0 0 12px}.subcard{background:#fff;border:1px solid #e8edf2;border-radius:13px;padding:12px;margin:10px 0}.mini-check{padding:10px;border:1px solid #e7edf5;border-radius:12px;margin:8px 0}.mini-check.yes{background:#f0fff7}.mini-check.no{background:#fff2f5}.muted{color:#65748a;font-style:italic}.footer{text-align:right;color:#65748a;margin:28px 0}.book-note{background:#fff9e8;border:1px solid #ead8aa;border-radius:16px;padding:15px;margin:18px 0}mjx-container[jax='SVG']{font-size:108%!important;margin:.35em 0}.question-card mjx-container[jax='SVG'],.formula-card mjx-container[jax='SVG']{font-size:112%!important}@media(max-width:760px){.cards{grid-template-columns:repeat(2,1fr)}.formula-grid,.twocol{grid-template-columns:1fr}.page{width:calc(100% - 14px);margin-top:8px}.hero,.section{padding:16px;border-radius:18px}.metric{min-height:94px}.stamp h1{font-size:2.1rem}body{font-size:15px}mjx-container[jax='SVG']{font-size:100%!important}}@media print{body{background:white}.page{width:100%;margin:0}.hero,.section{break-inside:avoid;box-shadow:none}.question-card{break-inside:avoid}.stamp{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
</style></head><body><main class="page">
<section class="hero"><div class="stamp"><h1>Informe final</h1><h2>Nota final: ${data.grade.toFixed(2)} / 5.0</h2></div><div class="eyebrow">Bingo lógico proposicional · práctica SCORM</div><div class="title">Lógica proposicional y tablas de verdad</div><div class="subtitle">Diagnóstico del desempeño a partir del cartón, las balotas y las preguntas respondidas</div><p>El juego evaluó proposiciones, conectivos lógicos, construcción de tablas de verdad, traducción entre lenguaje natural y fórmulas, equivalencias lógicas, leyes de De Morgan y clasificación de fórmulas como tautologías, contradicciones o contingencias. La nota combinó progreso en el cartón y desempeño pregunta a pregunta: cada respuesta correcta sumó 0.2, cada error restó 0.1 y completar las tres figuras equivalió a dominar las tres unidades de la práctica.</p><div class="cards"><div class="metric"><b>${data.correct}/${data.answered}</b><span>Aciertos globales</span></div><div class="metric"><b>${pct}%</b><span>Porcentaje global</span></div><div class="metric green"><b>${data.completedUnits}/3</b><span>Unidades completadas</span></div><div class="metric ${data.grade<3?'red':''}"><b>${data.grade.toFixed(2)}</b><span>Nota sobre 5.0</span></div></div><div class="book-note">Inicio: ${escHtml(startTime)} · Fin: ${escHtml(endTime)} · Duración: ${fmtTime(data.time)} · Estado: ${escHtml(statusText)} · Cierre: ${escHtml(reasonLabel(reason))}</div></section>
<section class="section"><h2>1. Resumen del jugador</h2><div class="cards"><div class="metric"><b>${data.grade.toFixed(2)}</b><span>Nota en escala 0–5.0</span></div><div class="metric"><b>${data.attempts}</b><span>Intentos respondidos</span></div><div class="metric"><b>${state.draws}</b><span>Balotas sorteadas</span></div><div class="metric"><b>${data.hints}</b><span>Pistas usadas</span></div></div></section>
<section class="section"><h2>2. Gráficas de desempeño</h2><h3>Por tema</h3>${reportBarRows(byTopic)}<h3>Por tipo de pregunta</h3>${reportBarRows(byType)}<h3>Por dificultad</h3>${reportBarRows(byDifficulty)}<h3>Por figuras del cartón</h3>${patternReportHtml()}</section>
<section class="section"><h2>3. Fórmulas y resultados que debe revisar el estudiante</h2><div class="formula-grid">${reportFormulaCards()}</div></section>
<section class="section"><h2>4. Plan de mejora individual</h2>${improvementPlanHtml()}</section>
<section class="section"><h2>5. Registro de evaluación, intentos y envío SCORM</h2><table class="security-table"><tr><th>Evento</th><th>Cantidad</th></tr><tr><td>Nota reportada a Brightspace</td><td>${data.grade.toFixed(2)} / 5.0</td></tr><tr><td>Escala SCORM enviada</td><td>min 0 · max 5 · raw ${data.grade.toFixed(2)}</td></tr><tr><td>Respuestas correctas</td><td>${data.correct}</td></tr><tr><td>Respuestas incorrectas</td><td>${Math.max(0,data.answered-data.correct)}</td></tr><tr><td>Figuras del cartón completadas</td><td>${data.completedUnits}/3</td></tr><tr><td>Motivo de finalización</td><td>${escHtml(reasonLabel(reason))}</td></tr><tr><td>Banco de preguntas disponible</td><td>10.000 preguntas algorítmicas</td></tr></table><h3>Bitácora de eventos</h3>${eventLogHtml(reason)}</section>
<section class="section"><h2>6. Detalle de preguntas respondidas</h2><p class="muted">Cada tarjeta conserva la respuesta esperada, la pista disponible, la retroalimentación específica y el procedimiento que debía seguirse.</p>${reportQuestionCards()}</section>
<div class="footer">Informe generado automáticamente por Bingo lógico proposicional · Página HTML tipo libro · SCORM 1.2</div>
</main></body></html>`;
}
function downloadReportHtml(){
  const reason = state.finishReason || 'manual';
  downloadBlob(bookReportHtml(reason),'informe-bingo-logico-tipo-libro.html','text/html');
}
function downloadCsv(){
  const header=['id','tipo','dificultad','tema','pregunta','respuesta_estudiante','respuesta_correcta','resultado','nota_despues','unidades'];
  const rows=state.history.map(h=>[h.id,h.type,h.difficulty,h.topic,h.title,h.submitted,h.answer,h.correct?'correcta':'incorrecta',h.scoreAfter,h.units].map(x=>`"${String(x).replace(/"/g,'""')}"`).join(','));
  downloadBlob([header.join(','),...rows].join('\n'),'intentos-bingo-logico.csv','text/csv');
}
function downloadBlob(text,name,type){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type})); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }

window.addEventListener('DOMContentLoaded', init);
