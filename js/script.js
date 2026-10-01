/* NAVEGAÇÃO — comportamento ao rolar a página */
const nav=document.getElementById('nav');addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>28),{passive:true});

/* ANIMAÇÕES GERAIS DE ENTRADA — elementos .reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.target.classList.contains('mission-topic')){
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
  }else{
    e.target.classList.toggle('in',e.isIntersecting)
  }
}),{threshold:.04,rootMargin:'0px 0px 6% 0px'});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* TRAJETÓRIA EXIMIUS — troca entre segmentos de ensino */
const segNames=['<span class="segment-one-line">Educação Infantil</span>','<span class="segment-one-line">Ensino Fundamental</span><span class="segment-subline">Anos Iniciais</span>','<span class="segment-one-line">Ensino Fundamental</span><span class="segment-subline">Anos Finais</span>','<span class="segment-one-line">Ensino Médio</span>'];
const segSlides=[...document.querySelectorAll('.segment-slide')];let seg=0;
function showSeg(i){seg=(i+4)%4;segSlides.forEach((s,j)=>s.classList.toggle('active',j===seg));document.getElementById('segTitle').innerHTML=segNames[seg];document.getElementById('segmentos').dataset.segment=seg}
document.getElementById('segPrev').onclick=()=>showSeg(seg-1);document.getElementById('segNext').onclick=()=>showSeg(seg+1);

/* PROJETOS — carrossel e abertura dos cards */
function attachProjectCard(card){
  const btn=card.querySelector('.project-toggle');
  if(btn)btn.addEventListener('click',e=>{e.stopPropagation();card.classList.toggle('open')});
  card.addEventListener('click',e=>{
    if(e.target.closest('.project-toggle'))return;
    if(!card.classList.contains('open'))card.classList.add('open');
  });
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.classList.toggle('open')}});
}

const pt=document.getElementById('projectTrack');
const originalProjects=[...pt.children];
let projectSeqWidth=0;
originalProjects.forEach(card=>{
  card.dataset.projectOriginal='1';
  attachProjectCard(card);
});

if(originalProjects.length){
  const before=originalProjects.map(card=>{
    const clone=card.cloneNode(true);
    clone.removeAttribute('data-project-original');
    attachProjectCard(clone);
    return clone;
  });
  const after=originalProjects.map(card=>{
    const clone=card.cloneNode(true);
    clone.removeAttribute('data-project-original');
    attachProjectCard(clone);
    return clone;
  });

  before.reverse().forEach(card=>pt.insertBefore(card,pt.firstChild));
  after.forEach(card=>pt.appendChild(card));
}

function projectStep(){
  const card=pt.querySelector('.project-card');
  if(!card)return 320;
  const styles=getComputedStyle(pt);
  const gap=parseFloat(styles.columnGap||styles.gap)||22;
  return card.getBoundingClientRect().width+gap;
}

function initProjects(){
  const originals=[...pt.querySelectorAll('[data-project-original="1"]')];
  if(!originals.length)return;

  const first=originals[0];
  const last=originals[originals.length-1];
  const gap=projectStep()-first.getBoundingClientRect().width;
  projectSeqWidth=(last.offsetLeft+last.offsetWidth)-first.offsetLeft+gap;
  pt.scrollLeft=first.offsetLeft-(pt.clientWidth-first.offsetWidth)/2;
}

addEventListener('load',initProjects);

pt.addEventListener('scroll',()=>{
  if(!projectSeqWidth)return;
  const originals=[...pt.querySelectorAll('[data-project-original="1"]')];
  if(!originals.length)return;

  const first=originals[0];
  const last=originals[originals.length-1];
  const center=pt.scrollLeft+pt.clientWidth/2;
  const firstCenter=first.offsetLeft+first.offsetWidth/2;
  const lastCenter=last.offsetLeft+last.offsetWidth/2;

  if(center<firstCenter-projectSeqWidth*.65)pt.scrollLeft+=projectSeqWidth;
  else if(center>lastCenter+projectSeqWidth*.65)pt.scrollLeft-=projectSeqWidth;
},{passive:true});

function projectMove(dir){
  pt.scrollBy({left:dir*projectStep(),behavior:'smooth'});
}

document.getElementById('projectPrev').onclick=()=>projectMove(-1);
document.getElementById('projectNext').onclick=()=>projectMove(1);

const selected=document.getElementById('labSelected');
const center=document.getElementById('mandalaCenter');
document.querySelectorAll('.lab-node').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.lab-node').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  selected.textContent=b.dataset.label;
  document.getElementById('labDetail').classList.add('show');
  center.classList.add('is-selected');
  center.style.background=b.dataset.color||'#073763';
});

/* RESULTADOS — carrossel automático */
const rt=document.getElementById('resultsTrack');
let resultsReady=false, resultSeqWidth=0, resultPauseUntil=0, lastResultTime=0;
function setupResults(){
  const originals=[...rt.children];
  if(!originals.length||resultsReady)return;
  originals.forEach(c=>c.dataset.original='1');
  const before=originals.map(c=>{const n=c.cloneNode(true);n.removeAttribute('data-original');return n}), after=originals.map(c=>{const n=c.cloneNode(true);n.removeAttribute('data-original');return n});
  before.reverse().forEach(c=>rt.insertBefore(c,rt.firstChild));
  after.forEach(c=>rt.appendChild(c));
  requestAnimationFrame(()=>{
    const firstOriginal=rt.querySelector('[data-original="1"]');
    const originalsNow=[...rt.querySelectorAll('[data-original="1"]')];
    const first=originalsNow[0], last=originalsNow[originalsNow.length-1];
    resultSeqWidth=(last.offsetLeft+last.offsetWidth)-first.offsetLeft+26;
    rt.scrollLeft=first.offsetLeft-(rt.clientWidth-first.offsetWidth)/2;
    resultsReady=true;
  });
}
function pauseResults(ms=900){resultPauseUntil=performance.now()+ms}
['pointerdown','touchstart','wheel'].forEach(ev=>rt.addEventListener(ev,()=>pauseResults(),{passive:true}));
rt.addEventListener('scroll',()=>{
  if(!resultsReady)return;
  const originals=[...rt.querySelectorAll('[data-original="1"]')];
  const first=originals[0], last=originals[originals.length-1];
  const firstCenter=first.offsetLeft+first.offsetWidth/2;
  const lastCenter=last.offsetLeft+last.offsetWidth/2;
  const centerPos=rt.scrollLeft+rt.clientWidth/2;
  if(centerPos < firstCenter-resultSeqWidth*.65)rt.scrollLeft+=resultSeqWidth;
  else if(centerPos > lastCenter+resultSeqWidth*.65)rt.scrollLeft-=resultSeqWidth;
},{passive:true});
function animateResults(t){
  if(resultsReady){
    if(!lastResultTime)lastResultTime=t;
    const dt=Math.min(40,t-lastResultTime);lastResultTime=t;
    if(t>resultPauseUntil)rt.scrollLeft+=dt*0.12;
  }
  requestAnimationFrame(animateResults);
}
addEventListener('load',()=>{setupResults();requestAnimationFrame(animateResults)});

/* PROPOSTA PEDAGÓGICA — abertura dos tópicos */
document.querySelectorAll('.mission-topic-head').forEach(head=>{
  head.addEventListener('click',()=>{
    const topic=head.closest('.mission-topic');
    const willOpen=!topic.classList.contains('open');
    document.querySelectorAll('.mission-topic.open').forEach(other=>{
      other.classList.remove('open');
      const otherHead=other.querySelector('.mission-topic-head');
      if(otherHead)otherHead.setAttribute('aria-expanded','false');
    });
    if(willOpen){
      topic.classList.add('open');
      head.setAttribute('aria-expanded','true');
    }else{
      head.setAttribute('aria-expanded','false');
    }
  });
});

(() => {
  const section=document.querySelector('.segments.curve-rise');
  if(!section)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>section.classList.toggle('in',e.isIntersecting));
  },{threshold:.06,rootMargin:'0px 0px -6% 0px'});
  obs.observe(section);
})();

/* ESTRUTURA — interação da mandala de laboratórios */
(() => {
  const wheel=document.getElementById('labWheel');
  const detail=document.getElementById('labDetail');
  if(!wheel||!detail)return;

  const labs=[
    {key:'maker',title:'Laboratório Maker',chips:['Pensamento crítico','Gestão de projetos'],text:'Um espaço para transformar ideias em projetos, experimentar soluções e aprender fazendo.'},
    {key:'alimentar',title:'Educação Alimentar',chips:['Conhecimento nutricional','Consciência sobre sustentabilidade'],text:'Experiências que aproximam alimentação, saúde, escolhas conscientes e sustentabilidade.'},
    {key:'linguagens',title:'Linguagens Literárias e Cênicas',chips:['Expressão criativa','Interpretação e análise crítica'],text:'Um ambiente para leitura, criação, expressão e construção de repertório cultural.'},
    {key:'artes',title:'Laboratório Artes',chips:['Percepção estética','Habilidades técnicas'],text:'Experimentação artística para desenvolver sensibilidade, repertório, técnica e autoria.'},
    {key:'ciencias',title:'Ciências da Natureza',chips:['Investigação científica','Análise crítica'],text:'Observação, experimentação e investigação aproximam o estudante da prática científica.'},
    {key:'pesquisa',title:'Linguagem e Pesquisa',chips:['Habilidade de pesquisa','Leitura crítica e interpretação'],text:'Pesquisa e leitura crítica ajudam a organizar perguntas, interpretar fontes e construir conhecimento.'},
    {key:'google',title:'Laboratório Google',chips:['Competência digital','Colaboração'],text:'Tecnologia a serviço da aprendizagem, da criação e do trabalho colaborativo.'},
    {key:'recursos',title:'Recursos Multifuncionais',chips:['Empatia e sensibilidade','Inteligência emocional'],text:'Um espaço de acolhimento e apoio pensado para diferentes formas e ritmos de aprender.'},
    {key:'tecnologia',title:'Tecnologia e Cooperação',chips:['Inovação e criatividade','Pensamento computacional'],text:'Desafios que combinam tecnologia, raciocínio, criatividade e cooperação.'},
    {key:'vivo',title:'Laboratório Vivo',chips:['Consciência ambiental','Conexão com a natureza'],text:'Contato com a natureza para observar, compreender e cuidar do ambiente de forma responsável.'}
  ];
  const byKey=Object.fromEntries(labs.map(l=>[l.key,l]));

  let rotation=0;
  let down=false, rotating=false;
  let startX=0,startY=0,lastX=0,lastY=0,startRotation=0,moved=0,pointerId=null;

  const paint=()=>{
    wheel.style.transform=`rotate(${rotation}deg)`;
    wheel.style.setProperty('--counter-rotation',`${-rotation}deg`);
  };

  function showLab(lab){
    if(!lab)return;
    detail.innerHTML=`<button class="lab-close" type="button" aria-label="Fechar">×</button><h3>${lab.title}</h3><p>${lab.text}</p><div class="lab-competencies">${lab.chips.map(c=>`<span class="lab-chip">${c}</span>`).join('')}</div>`;
    detail.classList.add('show');
    detail.querySelector('.lab-close')?.addEventListener('click',e=>{e.stopPropagation();detail.classList.remove('show')},{once:true});
  }

  wheel.querySelectorAll('.mandala-label').forEach(label=>{
    label.addEventListener('click',e=>{
      if(rotating||moved>9){e.preventDefault();e.stopPropagation();return}
      e.stopPropagation();showLab(byKey[label.dataset.lab]);
    });
  });

  wheel.addEventListener('pointerdown',e=>{
    down=true;rotating=false;moved=0;pointerId=e.pointerId;
    startX=lastX=e.clientX;startY=lastY=e.clientY;startRotation=rotation;
  });

  wheel.addEventListener('pointermove',e=>{
    if(!down)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    moved+=Math.hypot(e.clientX-lastX,e.clientY-lastY); lastX=e.clientX;lastY=e.clientY;
    if(!rotating){
      if(Math.abs(dy)>Math.abs(dx)*1.15 && Math.abs(dy)>7)return;
      if(Math.abs(dx)<6 && Math.abs(dy)<6)return;
      rotating=true;wheel.classList.add('dragging');
      try{wheel.setPointerCapture?.(e.pointerId)}catch(_){}
    }
    if(rotating){
      if(e.cancelable)e.preventDefault();
      rotation=startRotation+dx*.34;
      paint();
    }
  });

  const finish=e=>{
    if(!down)return;
    down=false;
    if(rotating){
      wheel.classList.remove('dragging');
      try{wheel.releasePointerCapture?.(e.pointerId)}catch(_){}
      rotation=Math.round(rotation/3)*3;
      paint();
      setTimeout(()=>{rotating=false;moved=0},40);
    }else{
      rotating=false;
    }
  };
  wheel.addEventListener('pointerup',finish);
  wheel.addEventListener('pointercancel',finish);
  wheel.setAttribute('role','group');
  wheel.setAttribute('aria-label','Mandala interativa dos laboratórios do Colégio EXIMIUS. Deslize lateralmente sobre qualquer parte da mandala para girar e toque no sinal de mais para conhecer um laboratório.');
  paint();
})();

/* ESTRUTURA — mandala ativa e rotação automática */
(() => {
  const wheel=document.getElementById('labWheelV14');
  const detail=document.getElementById('labDetailV14');
  if(!wheel||!detail)return;

  const labs={
    maker:{title:'Laboratório Maker',chips:['Pensamento crítico','Gestão de projetos'],text:'Um espaço para transformar ideias em projetos, experimentar soluções e aprender fazendo.'},
    alimentar:{title:'Educação Alimentar',chips:['Conhecimento nutricional','Consciência sobre sustentabilidade'],text:'Experiências que aproximam alimentação, saúde, escolhas conscientes e sustentabilidade.'},
    linguagens:{title:'Linguagens Literárias e Cênicas',chips:['Expressão criativa','Interpretação e análise crítica'],text:'Um ambiente para leitura, criação, expressão e construção de repertório cultural.'},
    artes:{title:'Laboratório Artes',chips:['Percepção estética','Habilidades técnicas'],text:'Experimentação artística para desenvolver sensibilidade, repertório, técnica e autoria.'},
    ciencias:{title:'Ciências da Natureza',chips:['Investigação científica','Análise crítica'],text:'Observação, experimentação e investigação aproximam o estudante da prática científica.'},
    pesquisa:{title:'Linguagem e Pesquisa',chips:['Habilidade de pesquisa','Leitura crítica e interpretação'],text:'Pesquisa e leitura crítica ajudam a organizar perguntas, interpretar fontes e construir conhecimento.'},
    google:{title:'Laboratório Google',chips:['Competência digital','Colaboração'],text:'Tecnologia a serviço da aprendizagem, da criação e do trabalho colaborativo.'},
    recursos:{title:'Recursos Multifuncionais',chips:['Empatia e sensibilidade','Inteligência emocional'],text:'Um espaço de acolhimento e apoio pensado para diferentes formas e ritmos de aprender.'},
    tecnologia:{title:'Tecnologia e Cooperação',chips:['Inovação e criatividade','Pensamento computacional'],text:'Desafios que combinam tecnologia, raciocínio, criatividade e cooperação.'},
    vivo:{title:'Laboratório Vivo',chips:['Consciência ambiental','Conexão com a natureza'],text:'Contato com a natureza para observar, compreender e cuidar do ambiente de forma responsável.'}
  };

  let rotation=0, down=false, rotating=false, moved=0;
  let startX=0,startY=0,lastX=0,lastY=0,startRotation=0,startAngle=0;
  let resumeAt=0,lastFrame=performance.now();

  const norm=a=>{
    while(a>180)a-=360;
    while(a<-180)a+=360;
    return a;
  };
  const angleAt=(x,y)=>{
    const r=wheel.getBoundingClientRect();
    return Math.atan2(y-(r.top+r.height/2),x-(r.left+r.width/2))*180/Math.PI;
  };
  const paint=()=>{
    wheel.style.transform=`rotate(${rotation}deg)`;
    wheel.style.setProperty('--counter-rotation',`${-rotation}deg`);
  };

  const showLab=lab=>{
    if(!lab)return;
    detail.innerHTML=`<button class="v14-lab-close" type="button" aria-label="Fechar">×</button><h3>${lab.title}</h3><p>${lab.text}</p><div class="lab-competencies">${lab.chips.map(c=>`<span class="lab-chip">${c}</span>`).join('')}</div>`;
    detail.classList.add('show');
    detail.querySelector('.v14-lab-close')?.addEventListener('click',()=>detail.classList.remove('show'),{once:true});
  };

  wheel.querySelectorAll('.v14-lab-plus').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      if(moved>10)return;
      showLab(labs[btn.dataset.lab]);
      resumeAt=performance.now()+2200;
    });
  });

  wheel.addEventListener('pointerdown',e=>{
    if(e.target.closest('.v14-lab-plus'))return;
    down=true;rotating=false;moved=0;
    startX=lastX=e.clientX;startY=lastY=e.clientY;
    startRotation=rotation;startAngle=angleAt(e.clientX,e.clientY);
  });

  wheel.addEventListener('pointermove',e=>{
    if(!down)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    moved+=Math.hypot(e.clientX-lastX,e.clientY-lastY);
    lastX=e.clientX;lastY=e.clientY;
    if(!rotating){
      if(Math.abs(dy)>Math.abs(dx)*1.15 && Math.abs(dy)>8)return;
      if(Math.hypot(dx,dy)<7)return;
      rotating=true;
      wheel.classList.add('dragging');
      try{wheel.setPointerCapture?.(e.pointerId)}catch(_){}
    }
    if(rotating){
      if(e.cancelable)e.preventDefault();
      rotation=startRotation+norm(angleAt(e.clientX,e.clientY)-startAngle);
      paint();
    }
  });

  const finish=e=>{
    if(!down)return;
    down=false;
    if(rotating){
      wheel.classList.remove('dragging');
      try{wheel.releasePointerCapture?.(e.pointerId)}catch(_){}
      resumeAt=performance.now()+1800;
    }
    setTimeout(()=>{rotating=false;moved=0},50);
  };
  wheel.addEventListener('pointerup',finish);
  wheel.addEventListener('pointercancel',finish);

  const spin=t=>{
    const dt=Math.min(40,t-lastFrame); lastFrame=t;
    if(!down && !rotating && t>resumeAt){
      rotation=(rotation+dt*0.0012)%360;
      paint();
    }
    requestAnimationFrame(spin);
  };
  paint();
  requestAnimationFrame(spin);
})();

/* MATRÍCULAS — abertura e fechamento do formulário */
(() => {
  const modal=document.getElementById('visitModal');
  const triggers=[...document.querySelectorAll('.enrollment-modal-trigger')];
  const form=document.getElementById('visitForm');
  const note=document.getElementById('visitFormNote');
  if(!modal||!triggers.length)return;
  let lastFocus=null;
  const open=e=>{
    e?.preventDefault?.();
    lastFocus=document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('visit-modal-open');
    setTimeout(()=>modal.querySelector('input')?.focus(),30);
  };
  const close=()=>{
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('visit-modal-open');
    lastFocus?.focus?.();
  };
  triggers.forEach(el=>el.addEventListener('click',open));
  modal.querySelectorAll('[data-close-visit]').forEach(el=>el.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close()});

  form?.addEventListener('submit',e=>{
    e.preventDefault();

    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }

    /* ========================================
      ! INTEGRAÇÃO BACKEND — FORMULÁRIO
      ======================================== */

    note.textContent='Dados preenchidos. A integração de envio do formulário será conectada na publicação.';

    /* ========================================
      ! FIM DA INTEGRAÇÃO BACKEND
      ======================================== */
  });
})();

/* DEPOIMENTOS — pilha de cards e gesto de arrastar */
(function(){
  const stack=document.getElementById('testimonialStack');
  if(!stack) return;
  let cards=[...stack.querySelectorAll('[data-testimonial-card]')];
  let busy=false;
  let pointerId=null, startX=0, startY=0, dx=0, dy=0, dragging=false, verticalGesture=false;

  function layout(){
    cards.forEach((card,i)=>{
      card.dataset.depth=String(i);
      card.style.pointerEvents=i===0?'auto':'none';
      card.setAttribute('aria-hidden',i===0?'false':'true');
    });
  }
  function advance(direction=1){
    if(busy||!cards.length) return;
    busy=true;
    const front=cards[0];
    front.classList.add('is-leaving');
    front.style.transform=`translate3d(${direction*115}%,${Math.min(Math.abs(dx)*.04,16)}px,0) rotate(${direction*10}deg) scale(.98)`;
    window.setTimeout(()=>{
      front.classList.remove('is-leaving');
      front.style.transform='';
      cards.push(cards.shift());
      layout();
      busy=false;
    },290);
  }
  function resetFront(){
    if(!cards[0]) return;
    cards[0].style.transition='transform .28s cubic-bezier(.18,.72,.22,1)';
    cards[0].style.transform='';
    window.setTimeout(()=>{ if(cards[0]) cards[0].style.transition=''; },290);
  }

  stack.addEventListener('pointerdown',e=>{
    if(busy || e.button!==undefined && e.button!==0) return;
    const front=cards[0]; if(!front || !front.contains(e.target)) return;
    pointerId=e.pointerId; startX=e.clientX; startY=e.clientY; dx=0; dy=0; dragging=false; verticalGesture=false;
  });
  stack.addEventListener('pointermove',e=>{
    if(pointerId!==e.pointerId || busy) return;
    dx=e.clientX-startX; dy=e.clientY-startY;
    if(!dragging){
      if(Math.abs(dy)>Math.abs(dx) && Math.abs(dy)>7){verticalGesture=true;return;}
      if(Math.abs(dx)>7) dragging=true;
    }
    if(!dragging) return;
    const front=cards[0];
    front.style.transition='none';
    front.style.transform=`translate3d(${dx}px,${Math.abs(dx)*.025}px,0) rotate(${dx*.025}deg) scale(.995)`;
  });
  function endPointer(e){
    if(pointerId!==e.pointerId || busy) return;
    const wasDragging=dragging;
    const wasVertical=verticalGesture;
    const localDx=dx;
    pointerId=null; dragging=false; verticalGesture=false;
    if(wasVertical){ resetFront(); return; }
    if(wasDragging && Math.abs(localDx)>55){ advance(localDx>0?1:-1); }
    else if(wasDragging){ resetFront(); }
    else { advance(1); }
  }
  stack.addEventListener('pointerup',endPointer);
  stack.addEventListener('pointercancel',e=>{ if(pointerId===e.pointerId){pointerId=null;dragging=false;verticalGesture=false;resetFront();} });
  layout();
})();

document.querySelectorAll('.reveal').forEach(el=>{
  if(/coordena[cç][aã]o|coordena[cç][oõ]es/i.test(el.textContent||'')){
    el.classList.remove('reveal');
    el.classList.add('v15-static');
  }
});

/* PROPOSTA PEDAGÓGICA — repetir animação ao entrar na tela */
(() => {
  const targets=[
    document.querySelector('.mission-lead p.reveal'),
    ...document.querySelectorAll('.mission-topic.reveal')
  ].filter(Boolean);
  if(!targets.length) return;

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){
    targets.forEach(el=>el.classList.add('in'));
    return;
  }

  const replayObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      entry.target.classList.toggle('in',entry.isIntersecting);
    });
  },{
    threshold:.02,
    rootMargin:'7% 0px 7% 0px'
  });

  targets.forEach(el=>replayObserver.observe(el));
})();

/* TRAJETÓRIA EXIMIUS — movimento da seção durante a rolagem */
(() => {
  const section=document.querySelector('.segments.curve-rise');
  if(!section) return;

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){
    section.style.setProperty('--v16-trajectory-y','0px');
    return;
  }

  let currentY=Math.min(130,window.innerHeight*.16);
  let ticking=false;

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const smoothstep=t=>t*t*(3-2*t);

  function update(){
    ticking=false;
    const rect=section.getBoundingClientRect();
    /* Remove our current visual offset to recover the natural scroll position. */
    const naturalTop=rect.top-currentY;
    const vh=Math.max(window.innerHeight,1);
    const start=vh*1.04;
    const end=vh*.46;
    const raw=clamp((start-naturalTop)/(start-end),0,1);
    const progress=smoothstep(raw);
    const maxOffset=Math.min(130,vh*.16);
    currentY=(1-progress)*maxOffset;
    section.style.setProperty('--v16-trajectory-y',`${currentY.toFixed(2)}px`);
  }

  function requestUpdate(){
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(update);
  }

  addEventListener('scroll',requestUpdate,{passive:true});
  addEventListener('resize',requestUpdate,{passive:true});
  addEventListener('load',requestUpdate,{once:true});
  requestUpdate();
})();
