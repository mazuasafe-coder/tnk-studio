(() => {
 'use strict';
 const host=document.querySelector('#world-canvas'),stage=document.querySelector('.world-stage'),story=document.querySelector('.world-story');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!window.THREE){document.querySelector('#render-status').textContent='STATIC PRESENTATION';return;}
 const T=THREE;let renderer;
 try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});}catch(error){document.querySelector('#render-status').textContent='STATIC PRESENTATION';return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.25:1.6));
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 renderer.shadowMap.enabled=innerWidth>700;renderer.shadowMap.type=T.PCFSoftShadowMap;
 host.append(renderer.domElement);host.classList.add('ready');renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new T.Scene();scene.fog=new T.FogExp2(0x09121b,.014);
 const camera=new T.PerspectiveCamera(40,1,.1,160);
 scene.add(new T.HemisphereLight(0xb9e7ff,0x142338,2.8));
 const key=new T.DirectionalLight(0xe2edff,3.5);key.position.set(10,18,10);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-18,right:18,top:18,bottom:-18,near:.5,far:65});key.shadow.bias=-.001;scene.add(key);
 const rim=new T.DirectionalLight(0x69d9ff,3);rim.position.set(-12,8,-10);scene.add(rim);
 const warm=new T.PointLight(0xffab66,45,30,2);warm.position.set(0,6,0);scene.add(warm);
 const root=new T.Group(),base=new T.Group(),walkways=new T.Group(),systems=new T.Group(),crown=new T.Group();scene.add(root);root.add(base,walkways,systems,crown);
 const metal=new T.MeshStandardMaterial({color:0x415367,metalness:.72,roughness:.32});
 const pale=new T.MeshStandardMaterial({color:0xb4c5c9,metalness:.5,roughness:.35});
 const dark=new T.MeshStandardMaterial({color:0x172937,metalness:.65,roughness:.46});
 const trim=new T.MeshStandardMaterial({color:0x78909c,metalness:.8,roughness:.26});
 const cyan=new T.MeshBasicMaterial({color:0x81edf3});
 const amber=new T.MeshBasicMaterial({color:0xffbb77});
 const glass=new T.MeshStandardMaterial({color:0x65d8e3,metalness:.2,roughness:.2,transparent:true,opacity:.045,side:T.DoubleSide,depthWrite:false});
 const materials=[metal,pale,dark,trim,glass];
 function mesh(geometry,material,parent,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=material!==cyan&&material!==amber&&material!==glass;m.receiveShadow=true;parent.add(m);return m;}
 function box(w,h,d,material,parent,x,y,z){return mesh(new T.BoxGeometry(w,h,d),material,parent,x,y,z);}
 function cylinder(r1,r2,h,material,parent,y,segments=64){return mesh(new T.CylinderGeometry(r1,r2,h,segments),material,parent,0,y,0);}
 function ring(r,t,material,parent,y){const m=mesh(new T.TorusGeometry(r,t,8,96),material,parent,0,y,0);m.rotation.x=Math.PI/2;return m;}
 cylinder(7.4,6.4,.8,dark,base,-1.2);cylinder(7.1,7.4,.25,trim,base,-.72);cylinder(6.8,6.8,.32,metal,base,-.42);
 ring(7.1,.035,cyan,base,-.58);ring(6.7,.045,cyan,base,-.21);ring(4.65,.035,amber,base,-.22);
 // Radial armor segments give the platform thickness and an engineered silhouette.
 const segmentGeo=new T.BoxGeometry(.75,.55,1.4),segments=new T.InstancedMesh(segmentGeo,metal,32),dummy=new T.Object3D();
 for(let i=0;i<32;i++){const a=i/32*Math.PI*2;dummy.position.set(Math.cos(a)*6.85,-1.05,Math.sin(a)*6.85);dummy.rotation.set(0,-a,0);dummy.updateMatrix();segments.setMatrixAt(i,dummy.matrix);}base.add(segments);
 // Four landing decks and bridges, positioned around a circular arena.
 for(let i=0;i<4;i++){
  const g=new T.Group();g.rotation.y=i*Math.PI/2;walkways.add(g);
  box(3.5,.45,4.8,metal,g,0,.1,8);box(3.15,.08,4.5,pale,g,0,.37,8);
  box(2.15,.25,3.3,dark,g,0,.08,4.4);box(.055,.04,6.6,cyan,g,-1.2,.46,6.6);box(.055,.04,6.6,cyan,g,1.2,.46,6.6);
  for(let j=0;j<5;j++){box(1.4,.025,.08,trim,g,0,.43,6.4+j*.65);}
  box(3.55,.08,.09,amber,g,0,.44,10.25);
  for(const side of [-1,1]){
    box(.28,.8,4.5,dark,g,side*1.65,.72,8);box(.05,.045,4.3,cyan,g,side*1.65,1.15,8);
    const tower=box(.65,2.2,.65,pale,g,side*1.45,1.5,9.6);box(.12,1.8,.08,amber,g,side*1.45,1.5,9.95);
  }
 }
 // Central reactor and articulated rings are actual 3D meshes, not textures.
 cylinder(2.9,3.2,.5,metal,systems,.35);cylinder(2.5,2.8,.3,pale,systems,.73);
 ring(2.48,.06,cyan,systems,.91);cylinder(1.7,1.9,.3,dark,systems,.96);ring(1.6,.055,amber,systems,1.14);
 const core=mesh(new T.IcosahedronGeometry(.95,1),new T.MeshStandardMaterial({color:0x76d8e8,metalness:.75,roughness:.12,emissive:0x20708d,emissiveIntensity:.6}),systems,0,2.5,0);
 const coreWire=mesh(new T.IcosahedronGeometry(1.04,1),new T.MeshBasicMaterial({color:0xbff9ff,wireframe:true,transparent:true,opacity:.5}),systems,0,2.5,0);
 const gyro1=new T.Group(),gyro2=new T.Group();gyro1.position.y=2.5;gyro2.position.y=2.5;systems.add(gyro1,gyro2);
 mesh(new T.TorusGeometry(1.7,.065,10,80),cyan,gyro1);mesh(new T.TorusGeometry(2.05,.1,10,80),trim,gyro2);mesh(new T.TorusGeometry(2.05,.025,6,80),amber,gyro2,0,0,.09);
 // Perimeter towers and a suspended architectural crown.
 for(let i=0;i<8;i++){
  const a=(i+.5)/8*Math.PI*2,x=Math.cos(a)*5.5,z=Math.sin(a)*5.5;
  const g=new T.Group();g.position.set(x,0,z);g.rotation.y=-a;systems.add(g);
  box(.8,3.3,1.15,metal,g,0,1.5,0);box(.86,.2,1.22,pale,g,0,3.2,0);box(.09,2.8,1.18,cyan,g,0,1.55,0);
  const fin=box(.16,3.2,.62,trim,crown,x,3.8,z);fin.rotation.y=-a;fin.rotation.z=.16*Math.cos(a);
 }
 ring(5.8,.16,metal,crown,5.5);ring(5.8,.035,cyan,crown,5.69);ring(5.45,.07,pale,crown,5.5);
 const canopy=cylinder(5.45,5.45,.04,glass,crown,5.48);canopy.castShadow=false;
 const glowCanvas=document.createElement('canvas');glowCanvas.width=128;glowCanvas.height=128;
 const glowContext=glowCanvas.getContext('2d'),gradient=glowContext.createRadialGradient(64,64,0,64,64,64);
 gradient.addColorStop(0,'rgba(100,235,255,0.45)');gradient.addColorStop(.22,'rgba(70,190,255,0.18)');gradient.addColorStop(1,'rgba(50,150,255,0)');glowContext.fillStyle=gradient;glowContext.fillRect(0,0,128,128);
 const glow=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(glowCanvas),transparent:true,depthWrite:false,blending:T.AdditiveBlending}));glow.scale.set(7,7,1);glow.position.y=2.5;systems.add(glow);
 const scan=ring(4.1,.014,new T.MeshBasicMaterial({color:0x8bffff,transparent:true,opacity:.25}),systems,1.4);
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2;const tile=box(.25,.07,.7,i%3===0?amber:trim,crown,Math.cos(a)*5.7,5.55,Math.sin(a)*5.7);tile.rotation.y=-a;}
 // Fine topological ground and sparse suspended particles frame the structure.
 const ground=mesh(new T.PlaneGeometry(150,150),new T.MeshStandardMaterial({color:0x0a1521,metalness:.3,roughness:.75}),scene,0,-2.1,0);ground.rotation.x=-Math.PI/2;
 const grid=new T.GridHelper(100,80,0x274453,0x152a38);grid.position.y=-2.06;grid.material.transparent=true;grid.material.opacity=.55;scene.add(grid);
 const particleGeo=new T.BufferGeometry(),positions=new Float32Array(140*3);
 for(let i=0;i<140;i++){positions[i*3]=Math.sin(i*94.37)*25;positions[i*3+1]=2+(i%19)*.55;positions[i*3+2]=Math.cos(i*35.17)*25;}
 particleGeo.setAttribute('position',new T.BufferAttribute(positions,3));const particles=new T.Points(particleGeo,new T.PointsMaterial({color:0x91daeb,size:.038,transparent:true,opacity:.55}));scene.add(particles);
 const controls=document.querySelector('.world-controls');controls.hidden=false;
 const pause=document.querySelector('#pause'),wire=document.querySelector('#wireframe');
 let paused=reduced.matches,mode='scroll',target=0,position=0,time=0,frame=0,last=0,visible=true,pointerX=0,pointerY=0;
 const clamp=v=>Math.max(0,Math.min(1,v));const smooth=v=>v*v*(3-2*v);
 function resize(){const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();measure();if(paused)draw(0);}
 function measure(){const r=story.getBoundingClientRect();target=clamp(-r.top/Math.max(1,story.offsetHeight-stage.offsetHeight));if(paused){position=target;draw(0);}else schedule();}
 function draw(dt){
  const smoothing=1-Math.exp(-dt/100);position+=(target-position)*smoothing;
  if(!paused)time+=dt*.001;
  let p=position,spread=mode==='layers'?1:mode==='orbit'?0:smooth(clamp((p-.1)/.35))*(1-smooth(clamp((p-.68)/.27)));
  base.position.y=-spread*1.6;walkways.position.y=spread*.5;systems.position.y=spread*2.4;crown.position.y=spread*4.4;
  const angle=mode==='orbit'?time*.12: -.15+p*.70;
  root.rotation.y=angle+(!paused?pointerX*.08:0);
  const mobile=innerWidth<700;
  const distance=mobile?32:29;
  camera.position.set(Math.sin(.63+p*.11)*distance,18+spread*4+(!paused?pointerY:0),Math.cos(.63+p*.11)*distance);
  camera.lookAt(0,1.3+spread*2,0);
  gyro1.rotation.set(time*.25,.4+time*.16,.5);gyro2.rotation.set(.8,time*.18,.3);core.rotation.y=time*.3;core.rotation.z=time*.12;coreWire.rotation.copy(core.rotation);
  core.position.y=2.5+Math.sin(time*.8)*.12;coreWire.position.y=core.position.y;particles.rotation.y=time*.018;
  scan.position.y=1.4+(Math.sin(time*.6)+1)*1.6;
  const chapter=mode==='scroll'?Math.min(2,Math.round(p*2)):0;
  document.querySelectorAll('[data-chapter]').forEach((el,i)=>{const active=i===chapter;el.classList.toggle('active',active);el.inert=!active;el.setAttribute('aria-hidden',String(!active));});
  document.querySelector('.chapter-counter').textContent=String(chapter+1).padStart(2,'0')+' — 03';document.querySelector('.story-progress i').style.transform=`scaleX(${p})`;
  renderer.render(scene,camera);
 }
 function tick(now){frame=0;if(!visible||document.hidden){last=0;return;}const dt=last?Math.min(now-last,40):16;last=now;draw(paused?0:dt);if(!paused)frame=requestAnimationFrame(tick);}
 function schedule(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
 function updatePause(){pause.textContent=paused?'Resume motion':'Pause motion';pause.setAttribute('aria-pressed',String(paused));document.body.classList.toggle('motion-paused',paused);if(frame){cancelAnimationFrame(frame);frame=0;}last=0;draw(0);if(!paused)schedule();}
 pause.addEventListener('click',()=>{paused=!paused;updatePause();});
 reduced.addEventListener('change',()=>{paused=reduced.matches;updatePause();});
 document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.view;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));draw(0);schedule();}));
 wire.addEventListener('click',()=>{const on=wire.getAttribute('aria-pressed')!=='true';wire.setAttribute('aria-pressed',String(on));materials.forEach(m=>m.wireframe=on);draw(0);schedule();});
 host.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const r=host.getBoundingClientRect();pointerX=(event.clientX-r.left)/r.width-.5;pointerY=(event.clientY-r.top)/r.height-.5;});
 host.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible&&frame){cancelAnimationFrame(frame);frame=0;last=0;}else schedule();},{rootMargin:'50px'}).observe(stage);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0;last=0;}else schedule();});
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();paused=true;updatePause();host.classList.remove('ready');document.querySelector('#render-status').textContent='3D PAUSED — RELOAD TO RESTORE';});
 new ResizeObserver(resize).observe(host);addEventListener('scroll',measure,{passive:true});
 document.body.classList.add('webgl-ready');document.querySelector('#render-status').textContent='LIVE 3D / RENDERED IN YOUR BROWSER';
 resize();updatePause();
})();
