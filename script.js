(function(){
var $=function(s){return document.querySelector(s)};
var store={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* petals */
var pw=$('#petals'),started=false;
function petals(){if(started||reduce)return;started=true;
 for(var i=0;i<14;i++){var p=document.createElement('i');p.className='petal';
  p.style.left=Math.random()*100+'vw';p.style.setProperty('--dx',(Math.random()*120-60)+'px');
  p.style.animationDuration=(11+Math.random()*10)+'s';p.style.animationDelay=(-Math.random()*14)+'s';
  p.style.transform='scale('+(.6+Math.random()*.8)+')';pw.appendChild(p)}}

/* music: soft music-box loop with WebAudio, only after the toggle is tapped */
var ac,on=false,timer,step=0,out;
var notes=[392,494,587,659,587,494,440,523,659,784,659,523,392,494,587,494];
function tone(f,t,d,v){var o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);
 o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.05)}
function tick(){if(!on)return;var t=ac.currentTime+.05,n=notes[step%notes.length];
 tone(n,t,2.2,.09);tone(n/2,t,2.6,.04);if(step%4===0)tone(n/4,t,3,.05);step++}
var btn=$('#snd');
btn.addEventListener('click',function(){
 try{
  if(!on){ac=ac||new (window.AudioContext||window.webkitAudioContext)();
   if(!out){out=ac.createGain();out.gain.value=.8;out.connect(ac.destination)}
   ac.resume();on=true;tick();timer=setInterval(tick,700)}
  else{on=false;clearInterval(timer)}
 }catch(e){on=false}
 btn.textContent=on?'♪ Sound on':'♪ Sound off';btn.setAttribute('aria-pressed',on);
});

/* open envelope */
$('#open').addEventListener('click',function(){
 $('#env').classList.add('open');this.disabled=true;
 setTimeout(function(){$('#intro').classList.add('gone');document.body.classList.remove('lock');window.scrollTo(0,0);petals()},1900);
});

/* photos */
var ph=$('#photos'),rot=[-2,1.5,-1,2,-1.5,1];
for(var i=0;i<6;i++)(function(i){
 var d=document.createElement('div');d.className='ph';d.style.setProperty('--r',rot[i]+'deg');
 d.innerHTML='<label><span>Add a photo ♥</span><input type="file" accept="image/*"></label><div class="cap" contenteditable="true" data-p="Our date, our memory"></div>';
 var lab=d.querySelector('label'),inp=d.querySelector('input'),cap=d.querySelector('.cap');
 function show(src){var im=lab.querySelector('img')||lab.appendChild(document.createElement('img'));im.src=src;im.alt='Our memory'}
 var s=store.get('lw:ph'+i);if(s)show(s);var c=store.get('lw:cap'+i);if(c)cap.textContent=c;
 cap.addEventListener('input',function(){store.set('lw:cap'+i,cap.textContent)});
 inp.addEventListener('change',function(){var f=inp.files[0];if(!f)return;var r=new FileReader();
  r.onload=function(){var im=new Image();im.onload=function(){var m=700,k=Math.min(1,m/Math.max(im.width,im.height));
   var cv=document.createElement('canvas');cv.width=im.width*k;cv.height=im.height*k;cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);
   var u=cv.toDataURL('image/jpeg',.8);show(u);store.set('lw:ph'+i,u)};im.src=r.result};r.readAsDataURL(f)});
 ph.appendChild(d)})(i);

/* reasons */
var reasons=['You make me feel chosen, not just liked, but really chosen.','You try. Even on the days you’re tired, you still show up for me.','Your hugs. I could write a whole letter about your hugs.','You let me be silly, soft, loud, quiet: all of me.','The way you say my name changes how my day feels.','You make ordinary things, like a walk or a snack run, feel special.','You’re kind in ways you don’t even count.','I can be honest with you, and that is a rare, precious thing.','You make the future look warm and a little exciting.','Because being yours is my favourite thing I’ve ever been.'];
var cs=$('#cards');
reasons.forEach(function(t){var c=document.createElement('button');c.className='card';c.setAttribute('aria-pressed','false');
 c.innerHTML='<span class="face" aria-hidden="true">❦</span><span class="txt"></span>';c.querySelector('.txt').textContent=t;
 c.addEventListener('click',function(){var o=c.classList.toggle('open');c.setAttribute('aria-pressed',o)});cs.appendChild(c)});

/* secret + hard day letter */
$('#heartbtn').addEventListener('click',function(){$('#secret').classList.add('show')});
$('#hardbtn').addEventListener('click',function(){var h=$('#hard'),o=h.classList.toggle('show');this.setAttribute('aria-expanded',o);this.textContent=o?'Close for now':'Open when you need it'});

/* finale */
var fin=$('#finale');
if('IntersectionObserver' in window){new IntersectionObserver(function(e,ob){if(e[0].isIntersecting){fin.classList.add('in');ob.disconnect()}},{threshold:.35}).observe(fin)}else fin.classList.add('in');
$('#again').addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
})();