(function(){
  var d=document;
  // rok
  var rok=d.getElementById('rok'); if(rok) rok.textContent=new Date().getFullYear();

  // menu mobilne
  var burger=d.querySelector('.burger'), menu=d.getElementById('menu-mob');
  function zamknij(){burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');menu.hidden=true;d.body.style.overflow='';}
  burger.addEventListener('click',function(){
    var o=burger.getAttribute('aria-expanded')==='true';
    if(o){zamknij();return;}
    burger.setAttribute('aria-expanded','true');burger.setAttribute('aria-label','Zamknij menu');menu.hidden=false;d.body.style.overflow='hidden';
  });
  menu.addEventListener('click',function(e){if(e.target.closest('a'))zamknij();});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden)zamknij();});
  window.addEventListener('resize',function(){if(innerWidth>1000&&!menu.hidden)zamknij();});

  // galerie w kartach: palec, mysz, strzałki, licznik
  d.querySelectorAll('[data-galeria]').forEach(function(g){
    var tor=g.querySelector('.tor'), imgs=tor.querySelectorAll('img'), n=imgs.length;
    if(n<2) return;
    var licz=d.createElement('span');licz.className='g-licz';licz.textContent='1/'+n;g.appendChild(licz);
    function btn(cl,lab,dir){var b=d.createElement('button');b.type='button';b.className='g-strz '+cl;b.setAttribute('aria-label',lab);b.innerHTML='<svg><use href="#strz"/></svg>';b.addEventListener('click',function(e){e.preventDefault();idz(akt()+dir);});g.appendChild(b);}
    btn('wst','Poprzednie zdjęcie',-1);btn('dal','Następne zdjęcie',1);
    function akt(){return Math.round(tor.scrollLeft/tor.clientWidth);}
    function idz(i){i=(i+n)%n;tor.scrollTo({left:i*tor.clientWidth,behavior:'smooth'});}
    tor.addEventListener('scroll',function(){licz.textContent=(Math.min(n-1,Math.max(0,akt()))+1)+'/'+n;},{passive:true});
    // przeciąganie myszą
    var start=null,sl=0,ruch=false;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;start=e.clientX;sl=tor.scrollLeft;ruch=false;tor.classList.add('ciag');tor.setPointerCapture(e.pointerId);});
    tor.addEventListener('pointermove',function(e){if(start===null)return;var dx=e.clientX-start;if(Math.abs(dx)>4)ruch=true;tor.scrollLeft=sl-dx;});
    function koniec(e){if(start===null)return;var dx=e.clientX-start;start=null;tor.classList.remove('ciag');var i=Math.round(sl/tor.clientWidth);if(dx<-40)i++;else if(dx>40)i--;idz(Math.max(0,Math.min(n-1,i)));}
    tor.addEventListener('pointerup',koniec);tor.addEventListener('pointercancel',koniec);
    tor.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();}},true);
    g.tabIndex=0;g.setAttribute('aria-roledescription','galeria');
    g.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){idz(akt()+1);e.preventDefault();}if(e.key==='ArrowLeft'){idz(akt()-1);e.preventDefault();}});
  });

  // pasek postępu floty na telefonie
  var fl=d.querySelector('.flota'), fn=d.querySelector('.flota-nav');
  if(fl&&fn){var karty=fl.children,bar=fn.querySelector('b'),lz=fn.querySelector('.fn-licz');
    fl.addEventListener('scroll',function(){var w=karty[0].getBoundingClientRect().width+14;var i=Math.min(karty.length-1,Math.round(fl.scrollLeft/w));if(fl.scrollLeft+fl.clientWidth>=fl.scrollWidth-4)i=karty.length-1;lz.textContent=(i+1)+' z '+karty.length;bar.style.transform='translateX('+(i*100)+'%)';},{passive:true});}

  // "Zapytaj o ten dźwig" ustawia pole w formularzu
  var sel=d.getElementById('pole-dzwig');
  d.querySelectorAll('[data-wybierz]').forEach(function(a){
    a.addEventListener('click',function(){var k=a.closest('[data-dzwig]');if(k&&sel)sel.value=k.getAttribute('data-dzwig');});
  });

  // realizacje: na telefonie najpierw 3
  var real=d.querySelector('.realizacje'), wiecej=d.querySelector('.btn-wiecej');
  if(real&&wiecej){
    var mq=matchMedia('(max-width:760px)');
    function ust(){if(mq.matches&&!real.dataset.rozw){real.classList.add('zwin');wiecej.hidden=false;}else{real.classList.remove('zwin');wiecej.hidden=true;}}
    ust();mq.addEventListener('change',ust);
    wiecej.addEventListener('click',function(){real.dataset.rozw='1';ust();});
  }

  // aktywna pozycja menu
  var linki=d.querySelectorAll('.nav a');
  var sekcje=[].map.call(linki,function(a){return d.querySelector(a.getAttribute('href'));});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(ws){ws.forEach(function(w){if(w.isIntersecting){var i=sekcje.indexOf(w.target);linki.forEach(function(l,j){l.classList.toggle('akt',j===i);});}});},{rootMargin:'-45% 0px -50% 0px'});
    sekcje.forEach(function(s){if(s)io.observe(s);});
    // pasek mobilny po minięciu przycisku w pierwszym ekranie
    var cta=d.getElementById('hero-cta'), mob=d.querySelector('.mob');
    new IntersectionObserver(function(ws){var w=ws[0];mob.classList.toggle('widac',!w.isIntersecting&&w.boundingClientRect.top<0);}).observe(cta);
  }

  // formularz pokazowy
  var f=d.getElementById('formularz');
  f.addEventListener('submit',function(e){e.preventDefault();var info=f.querySelector('.form-info');info.hidden=false;info.scrollIntoView({block:'nearest',behavior:'smooth'});});
})();
