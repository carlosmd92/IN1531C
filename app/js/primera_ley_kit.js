/* Piezas comunes de las figuras del capítulo Primera ley: bucle de animación, degradados SVG,
   moléculas con choques, barras de energía con signo y números que cuentan hasta su valor. */
(function(){
"use strict";
var PL={ticks:[],rows:{},nums:{}};
PL.comma=function(x,d){var s=Math.abs(x)<Math.pow(10,-d)/2?0:x;return s.toFixed(d).replace('.',',').replace('-','−');};
PL.signed=function(x,d){var s=PL.comma(x,d);return (x>0&&s.charAt(0)!=='−'&&Number(x.toFixed(d))!==0?'+':'')+s;};
PL.shown=function(e){if(document.body.classList.contains('embed'))return true;var v=e.closest('.view');return !!v&&!v.hidden;};
PL.lcg=function(seed){var s=seed;return function(){s=(s*1664525+1013904223)%4294967296;return s/4294967296;};};
PL.set=function(id,o){var e=document.getElementById(id);if(e)for(var q in o)e.setAttribute(q,o[q]);return e;};
(function loop(t){requestAnimationFrame(loop);PL.ticks.forEach(function(f){try{f(t);}catch(e){}});})(0);

/* ---------- Degradados, sombra y símbolos (ids con prefijo para no chocar entre figuras) ---------- */
PL.defs=function(p){
  function lg(id,x2,y2,stops){return '<linearGradient id="'+p+'-'+id+'" x1="0" y1="0" x2="'+x2+'" y2="'+y2+'">'+stops.map(function(s){return '<stop offset="'+s[0]+'" stop-color="'+s[1]+'"'+(s[2]!=null?' stop-opacity="'+s[2]+'"':'')+'/>';}).join('')+'</linearGradient>';}
  return '<defs>'+
    lg('bg',0,1,[[0,'#fcfdff'],[1,'#edf3fc']])+
    lg('glass',0,1,[[0,'#f7faff'],[1,'#d9e7fb']])+
    lg('rim',1,1,[[0,'#a9bbd9'],[.5,'#52688f'],[1,'#9db1d3']])+
    lg('metal',0,1,[[0,'#b4bccb'],[.5,'#7b859a'],[1,'#3d4558']])+
    lg('metalh',1,0,[[0,'#8d97ab'],[.2,'#dde3ef'],[.5,'#f7f9fc'],[.8,'#c2cad9'],[1,'#7d879c']])+
    lg('pipe',0,1,[[0,'#f6f9ff',.9],[.45,'#b9c9e4',.7],[1,'#7d93b8',.9]])+
    lg('shaft',0,1,[[0,'#8d97ab'],[.35,'#2b3348'],[1,'#10141f']])+
    lg('gear',1,1,[[0,'#8591a8'],[.5,'#2a3247'],[1,'#151a28']])+
    lg('flame',0,-1,[[0,'#a8231b'],[.5,'#e0582b'],[1,'#f7b955']])+
    lg('flame2',0,-1,[[0,'#f29b3a'],[1,'#fff2b8']])+
    lg('ice',0,1,[[0,'#eaf6ff'],[1,'#9fc9ea']])+
    lg('water',0,1,[[0,'#cfe3fb'],[1,'#8fb4e6']])+
    lg('hot',0,1,[[0,'#f6c6bf'],[1,'#d9715f']])+
    lg('blk',0,1,[[0,'#8f98ac'],[1,'#4a5266']])+
    '<radialGradient id="'+p+'-mol" cx=".35" cy=".32" r=".7" fx=".3" fy=".28"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#8fb4ee"/><stop offset="1" stop-color="#1f5fbf"/></radialGradient>'+
    '<radialGradient id="'+p+'-bub" cx=".35" cy=".32" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#e9f1fb"/><stop offset="1" stop-color="#9fb4d4"/></radialGradient>'+
    '<filter id="'+p+'-sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="#1c2333" flood-opacity=".28"/></filter>'+
    '</defs>';
};
PL.gearPath=function(R,r,n){
  var d='',st=2*Math.PI/n,k,i,a,P=[[-0.30,r],[-0.16,R],[0.16,R],[0.30,r]];
  for(k=0;k<n;k++){for(i=0;i<4;i++){a=k*st+P[i][0]*st;d+=((k||i)?'L':'M')+(Math.cos(a)*P[i][1]).toFixed(1)+' '+(Math.sin(a)*P[i][1]).toFixed(1);}}
  return d+'Z';
};
PL.gearG=function(p,id,x,y,R){
  R=R||25;var r=R*0.78,s='<g'+(id?' id="'+id+'"':'')+' transform="translate('+x+' '+y+')">'+
    '<path d="'+PL.gearPath(R,r,12)+'" fill="url(#'+p+'-gear)" stroke="#0d111b" stroke-width="1"/>';
  [0,90,180,270].forEach(function(a){var q=a*Math.PI/180;s+='<circle cx="'+(R*.52*Math.cos(q)).toFixed(1)+'" cy="'+(R*.52*Math.sin(q)).toFixed(1)+'" r="'+(R*.144).toFixed(1)+'" fill="#edf3fc" stroke="#0d111b" stroke-width=".8"/>';});
  return s+'<circle r="'+(R*.28).toFixed(1)+'" fill="url(#'+p+'-metal)" stroke="#2c3347" stroke-width="1"/><circle r="'+(R*.088).toFixed(1)+'" fill="#10141f"/></g>';
};
PL.waveSprite=function(col,w){
  w=w||28;var c=col||'#c0392b';
  return '<path d="M'+(-w)+' 0 q'+(w/4)+' -9 '+(w/2)+' 0 t'+(w/2)+' 0 t'+(w/2)+' 0 t'+(w/2)+' 0" fill="none" stroke="'+c+'" stroke-width="3.4" stroke-linecap="round"/>'+
         '<path d="M'+(-w)+' -1 q'+(w/4)+' -9 '+(w/2)+' 0 t'+(w/2)+' 0 t'+(w/2)+' 0 t'+(w/2)+' 0" fill="none" stroke="#f4a49a" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>';
};
PL.flameG=function(p,id,x,y,s){
  return '<g id="'+id+'" transform="translate('+x+' '+y+')"><g transform="scale('+(s||1)+')">'+
    '<path d="M0 0 C-14 0 -19 -12 -14 -22 C-11 -29 -4 -34 -3 -43 C4 -37 10 -32 14 -23 C19 -12 14 0 0 0 Z" fill="url(#'+p+'-flame)"/>'+
    '<path d="M0 0 C-8 0 -10 -8 -7 -15 C-5 -19 -1 -22 0 -27 C5 -22 9 -17 8 -10 C7 -4 4 0 0 0 Z" fill="url(#'+p+'-flame2)"/></g></g>';
};

/* ---------- Moléculas confinadas con choques elásticos ---------- */
/* box: {x0,x1,y0,y1} (puede cambiar entre cuadros); f: factor de rapidez (temperatura). */
PL.Mols=function(prefix,n,box,r,seed,sp){
  var rg=PL.lcg(seed),arr=[],i,k,m,tries,ok,q;sp=sp||55;
  for(i=0;i<n;i++){
    tries=0;
    do{m={x:box.x0+r+rg()*(box.x1-box.x0-2*r),y:box.y0+r+rg()*(box.y1-box.y0-2*r),r:r};ok=true;
      for(q=0;q<arr.length;q++){var dx=arr[q].x-m.x,dy=arr[q].y-m.y;if(dx*dx+dy*dy<(2*r+1)*(2*r+1)){ok=false;break;}}tries++;}while(!ok&&tries<80);
    k=rg()*6.2832;m.bx=sp*Math.cos(k);m.by=sp*Math.sin(k);m.id=prefix+i;m.el=null;arr.push(m);
  }
  this.a=arr;this.box=box;this.f=1;this.prefix=prefix;
};
PL.Mols.prototype.markup=function(sprite){var s='';for(var i=0;i<this.a.length;i++)s+='<g id="'+this.prefix+i+'">'+sprite+'</g>';return s;};
PL.Mols.prototype.bind=function(){var self=this;this.a.forEach(function(m){m.el=document.getElementById(m.id);});return self;};
PL.Mols.prototype.step=function(dt){
  var a=this.a,b=this.box,f=this.f,n=a.length,i,j,p,q,dx,dy,d2,d,nx,ny,dv,ov,rr;
  for(i=0;i<n;i++){
    p=a[i];p.x+=p.bx*f*dt;p.y+=p.by*f*dt;
    if(p.x<b.x0+p.r){p.x=b.x0+p.r;p.bx=Math.abs(p.bx);}
    if(p.x>b.x1-p.r){p.x=b.x1-p.r;p.bx=-Math.abs(p.bx);}
    if(p.y<b.y0+p.r){p.y=b.y0+p.r;p.by=Math.abs(p.by);}
    if(p.y>b.y1-p.r){p.y=b.y1-p.r;p.by=-Math.abs(p.by);}
  }
  for(i=0;i<n;i++)for(j=i+1;j<n;j++){
    p=a[i];q=a[j];dx=q.x-p.x;dy=q.y-p.y;d2=dx*dx+dy*dy;rr=p.r+q.r;
    if(d2<rr*rr&&d2>1e-6){
      d=Math.sqrt(d2);nx=dx/d;ny=dy/d;dv=(p.bx-q.bx)*nx+(p.by-q.by)*ny;
      if(dv>0){p.bx-=dv*nx;p.by-=dv*ny;q.bx+=dv*nx;q.by+=dv*ny;}
      ov=(rr-d)/2;p.x-=nx*ov;p.y-=ny*ov;q.x+=nx*ov;q.y+=ny*ov;
    }
  }
  for(i=0;i<n;i++){p=a[i];if(p.el)p.el.setAttribute('transform','translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+')');}
};

/* ---------- Números con conteo hasta su valor ---------- */
PL.setNum=function(id,v,d,jump){
  var el=document.getElementById(id);if(!el)return;
  var n=PL.nums[id];if(!n||n.el!==el){n=PL.nums[id]={el:el,cur:v,tgt:v,d:d};}
  n.tgt=v;n.d=d;if(jump)n.cur=v;el.textContent=PL.comma(n.cur,d);
  clearTimeout(PL._tm);
  PL._tm=setTimeout(function(){Object.keys(PL.nums).forEach(function(k){var q=PL.nums[k];q.cur=q.tgt;q.el.textContent=PL.comma(q.cur,q.d);});},900);
};
PL.ticks.push(function(t){
  var dt=PL._lt?Math.min(0.05,Math.max(0,(t-PL._lt)/1000)):0.016;PL._lt=t;
  Object.keys(PL.nums).forEach(function(k){
    var n=PL.nums[k];if(n.cur===n.tgt)return;
    n.cur+=(n.tgt-n.cur)*(1-Math.exp(-dt*12));
    if(Math.abs(n.tgt-n.cur)<Math.pow(10,-n.d)*0.5)n.cur=n.tgt;
    n.el.textContent=PL.comma(n.cur,n.d);
  });
});

/* ---------- Barras de energía con signo ---------- */
/* rows: {id,label,col,col2,scale,pos,unk}. pos: de 0 a scale (sin signo); si no, simétrica de -scale a scale. */
PL.bars=function(box,title,rows){
  var h='<h5>'+title+'</h5>';
  rows.forEach(function(r){
    PL.rows[r.id]=r;
    h+='<div class="erow'+(r.unk?' unk':'')+'" id="er-'+r.id+'"><span class="el">'+r.label+'</span>'+
       '<div class="etrack'+(r.pos?' pos':'')+'" style="--bc:'+r.col+';--bc2:'+(r.col2||r.col)+'"><span class="z"></span><i></i><i class="b2"></i>'+(r.pos?'<em></em>':'')+'</div>'+
       '<span class="ev" id="ev-'+r.id+'"></span></div>';
  });
  box.classList.add('ebars');box.innerHTML=h;
};
/* ivs: lista de intervalos [desde,hasta] en unidades de valor; txt: texto del valor */
PL.setBar=function(id,ivs,txt){
  var r=PL.rows[id],row=document.getElementById('er-'+id);if(!r||!row)return;
  var is=row.querySelectorAll('.etrack i');
  function m(v){return r.pos?v/r.scale*100:50+v/r.scale*50;}
  [0,1].forEach(function(k){
    var iv=ivs[k],el=is[k];if(!el)return;
    if(!iv){el.style.width='0%';return;}
    var a=Math.min(iv[0],iv[1]),b=Math.max(iv[0],iv[1]),l=Math.max(0,Math.min(100,m(a))),rr=Math.max(0,Math.min(100,m(b)));
    el.style.left=l+'%';el.style.width=(rr-l)+'%';
  });
  var ev=document.getElementById('ev-'+id);if(ev&&txt!=null)ev.textContent=txt;
};
PL.setMark=function(id,v){
  var r=PL.rows[id],row=document.getElementById('er-'+id);if(!r||!row)return;
  var e=row.querySelector('.etrack em');if(e)e.style.left=Math.max(0,Math.min(100,v/r.scale*100))+'%';
};

/* ---------- TeX con unidades en azul y factores de conversión en verde ---------- */
/* U('kPa') -> unidad azul; N('200','kPa') -> número con su unidad; F('1 kJ','1 kPa\\cdot m^3') -> factor verde.
   Las unidades se pasan ya en TeX (m^3, kg\\cdot m/s^2). */
PL.U=function(u){return '{\\color{#1f5fbf}\\mathrm{'+u+'}}';};
PL.N=function(v,u){return v+'\\ '+PL.U(u);};
PL.F=function(a,b){
  function g(s){var m=String(s).match(/^\s*([0-9.,{}]+)\s*(.*)$/);return m[1]+(m[2]?'\\ \\mathrm{'+m[2]+'}':'');}
  return '{\\color{#1a7f4b}\\dfrac{'+g(a)+'}{'+g(b)+'}}';
};

window.PL=PL;
})();
