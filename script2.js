console.log('🎵 Плеер + Мини-игра (клик/тап, дистанции 250–350, финал фуллскрин, drag прогресса)');

/* ================= ПЛЕЕР ================= */
class MusicPlayer {
  constructor() {
    this.audio = document.getElementById('music');
    this.playPauseBtn = document.getElementById('playPauseBtn');
    this.restartBtn = document.getElementById('restartBtn');
    this.lyricsText = document.getElementById('lyricsText');
    this.currentLineEl = document.getElementById('currentLine');
    this.progressFill = document.getElementById('progressFill');
    this.currentTimeEl = document.getElementById('currentTime');
    this.totalTimeEl = document.getElementById('totalTime');
    this.progressContainer = document.getElementById('progressContainer');
    this.playerCard = document.getElementById('playerCard');
    this.volumeSlider = document.getElementById('volumeSlider');
    this.volumeToggle = document.getElementById('volumeToggle');

    // drag state
    this.isScrubbing = false;
    this.wasPlaying = false;

    this.lyrics = [
      { time: 0, text: "))))))))))))...", speed: 12 },
      { time: 17.2, text: "Я принадлежу только тебе одной", speed: 11 },
      { time: 21.6, text: "Ты только моя, а я только твой", speed: 11 },
      { time: 26, text: "Я хочу спасти нашу с тобой весну", speed: 11 },
      { time: 30, text: "Я хочу любить только тебя одну", speed: 11 },
      { time: 34, text: "Я принадлежу только тебе одной", speed: 11 },
      { time: 38.9, text: "Ты только моя, а я только твой", speed: 11 },
      { time: 43.1, text: "Я хочу спасти нашу с тобой весну", speed: 11 },
      { time: 47.5, text: "Я хочу любить только тебя одну", speed: 11 },
      { time: 52.4, text: "Я не хочу забывать, я не хочу тебе врать", speed: 14 },
      { time: 55.6, text: "Я помню каждый мой сон о тебе:", speed: 14 },
      { time: 57.8, text: "любое слово, любую деталь", speed: 14 },
      { time: 60, text: "Это надолго, возможно до гроба,", speed: 14 },
      { time: 62.2, text: "если мы разделим его на двоих", speed: 15 },
      { time: 64.4, text: "Ты навсегда будешь только моей,", speed: 14 },
      { time: 66.6, text: "я навсегда буду только твоим", speed: 14 },
      { time: 68.8, text: "До конца времени нам отведённого", speed: 15 },
      { time: 70.9, text: "я отдаю тебе себя всего", speed: 14 },
      { time: 72.9, text: "Я точно узнаю твой голос ещё раз", speed: 15 },
      { time: 74.9, text: "из томного гула чужих голосов", speed: 15 },
      { time: 77.3, text: "Ты для меня что-то больше, чем свет,", speed: 15 },
      { time: 79.7, text: "я для тебя что-то хуже, чем яд", speed: 15 },
      { time: 81.8, text: "Но без друг друга мы явно не сможем,", speed: 16 },
      { time: 83.8, text: "ведь наши тела друг без друга болят", speed: 16 },
      { time: 86, text: "Я прочитал тебя до середины,", speed: 15 },
      { time: 87.6, text: "но точно уверен — ты именно та", speed: 15 },
      { time: 90.4, text: "Никаких тайн и скрытых мотивов,", speed: 15 },
      { time: 92.6, text: "ты в этой грязи предельно чиста", speed: 16 },
      { time: 94.6, text: "Благодарю тебя тысячу раз", speed: 15 },
      { time: 96.8, text: "и возвышаю тебя до Луны", speed: 15 },
      { time: 98.6, text: "Не оставляй меня тут одного,", speed: 15 },
      { time: 100.8, text: "ведь мне очень дороги все эти сны", speed: 15 },
      { time: 103.9, text: "Я принадлежу только тебе одной", speed: 11 },
      { time: 108.1, text: "Ты только моя, а я только твой", speed: 11 },
      { time: 112.3, text: "Я хочу спасти нашу с тобой весну", speed: 11 },
      { time: 116.5, text: "Я хочу любить....", speed: 11 },
      { time: 121.2, text: "Я принадлежу только тебе одной", speed: 11 },
      { time: 125.4, text: "Ты только моя, а я только твой", speed: 11 },
      { time: 129.6, text: "Я хочу спасти нашу с тобой весну", speed: 11 },
      { time: 133.8, text: "Я хочу любить только тебя одну", speed: 11 },
      { time: 138, text: "Я принадлежу только тебе одной", speed: 11 },
      { time: 142.2, text: "Ты только моя, а я только твой", speed: 11 },
      { time: 146.4, text: "Я хочу спасти нашу с тобой весну", speed: 11 },
      { time: 150.6, text: "Я хочу любить только тебя одну", speed: 11 },
      { time: 158.3, text: "С днем рождения, малыш, я тебя очень сильно люблю!", speed: 12 },
      { time: 164.3, text: "Ты лучшее что случалось в моей жизни, я очень сильно тобой горжусь.", speed: 14 }
    ];

    this.currentLyricIndex = -1;
    this.isPlaying = false;
    this.typewriterInterval = null;
    this.isMuted = false;
    this.previousVolume = 50;

    this.init();
  }

  init(){
    setTimeout(()=>this.playerCard.classList.add('visible'),300);
    this.playPauseBtn.addEventListener('click',()=>this.togglePlayPause());
    this.restartBtn.addEventListener('click',()=>this.restartMusic());
    this.volumeSlider.addEventListener('input',e=>this.setVolume(+e.target.value));
    this.volumeToggle.addEventListener('click',()=>this.toggleMute());
    // доступность: mute по Enter/Space
    this.volumeToggle.addEventListener('keydown',(e)=>{
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); this.toggleMute(); }
    });

    // клик по прогрессу
    this.progressContainer.addEventListener('click',e=>{
      if (this.isScrubbing) return;
      const r=this.progressContainer.getBoundingClientRect();
      const ratio=(e.clientX-r.left)/r.width;
      if (this.audio.duration && isFinite(this.audio.duration))
        this.audio.currentTime=Math.max(0,Math.min(1,ratio))*this.audio.duration;
    });

    // перетаскивание прогресса (mouse/touch unified)
    this.progressContainer.addEventListener('pointerdown', e => this.startScrub(e));
    document.addEventListener('pointermove', e => this.onScrub(e), {passive:false});
    document.addEventListener('pointerup',   () => this.endScrub());

    this.audio.addEventListener('loadedmetadata',()=>{
      if (this.audio.duration && isFinite(this.audio.duration))
        this.totalTimeEl.textContent=this.formatTime(this.audio.duration);
    });
    this.audio.addEventListener('timeupdate',()=>{
      if (!this.isScrubbing) this.updateProgress();
      this.updateLyrics();
    });
    this.audio.addEventListener('ended',()=>this.songEnded());

    this.setVolume(50);
    this.showInitialText();
  }

  /* drag helpers */
  startScrub(e){
    if (!this.audio.duration || !isFinite(this.audio.duration)) return;
    this.isScrubbing = true;
    this.wasPlaying = this.isPlaying;
    if (this.isPlaying) this.pauseMusic();
    this.progressContainer.setPointerCapture?.(e.pointerId);
    this.onScrub(e);
  }
  onScrub(e){
    if (!this.isScrubbing) return;
    const r = this.progressContainer.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, (e.clientX ?? 0) - r.left));
    const ratio = x / r.width;
    const dur = this.audio.duration || 0;
    const t = ratio * dur;
    this.progressFill.style.width = `${ratio*100}%`;
    this.currentTimeEl.textContent = this.formatTime(t);
    this.audio.currentTime = t;
    // сразу подтянуть лирику при скрабе
    this.updateLyrics();
  }
  endScrub(){
    if (!this.isScrubbing) return;
    this.isScrubbing = false;
    if (this.wasPlaying) this.playMusic();
  }

  showInitialText(){
    this.currentLineEl.textContent=`0 / ${this.lyrics.length}`;
    this.lyricsText.innerHTML=`<div class="lyric-line" style="animation:flicker 3s infinite;">Нажмите кнопку для начала музыки...</div>`;
  }
  togglePlayPause(){ this.isPlaying?this.pauseMusic():this.playMusic(); this.updateButtonClasses(); }
  updateButtonClasses(){ this.playPauseBtn.classList.toggle('play',!this.isPlaying); this.playPauseBtn.classList.toggle('pause',this.isPlaying); }
  async playMusic(){ try{ await this.audio.play(); this.isPlaying=true; this.updateLyrics(); }catch{} }
  pauseMusic(){ this.audio.pause(); this.isPlaying=false; if (this.typewriterInterval) clearInterval(this.typewriterInterval); }
  restartMusic(){ this.audio.currentTime=0; this.currentLyricIndex=-1; this.showInitialText(); this.playMusic(); }
  setVolume(v){ const vol=Math.max(0,Math.min(100,Number(v)||0)); this.audio.volume=vol/100; this.volumeSlider.value=String(vol); this.updateVolumeIcon(this.audio.volume); if(this.isMuted && vol>0) this.isMuted=false; if(vol>0) this.previousVolume=vol; }
  toggleMute(){ if(this.isMuted||this.audio.volume===0){ const restore=this.previousVolume||50; this.setVolume(restore); this.isMuted=false; } else { this.previousVolume=this.volumeSlider.valueAsNumber||50; this.setVolume(0); this.isMuted=true; } }
  updateVolumeIcon(vol){ this.volumeToggle.className='volume-icon'; if(vol===0||this.isMuted) this.volumeToggle.classList.add('muted'); else if(vol<0.5) this.volumeToggle.classList.add('low'); else this.volumeToggle.classList.add('high'); }
  updateProgress(){
    const ct=this.audio.currentTime, dur=this.audio.duration||0;
    this.progressFill.style.width=`${dur? (ct/dur*100):0}%`;
    this.currentTimeEl.textContent=this.formatTime(ct);
    if (dur && isFinite(dur)) this.totalTimeEl.textContent=this.formatTime(dur);
  }
  updateLyrics(){
    const t=this.audio.currentTime||0; let idx=-1;
    for(let i=this.lyrics.length-1;i>=0;i--){ if(t+0.03>=this.lyrics[i].time){ idx=i; break; } }
    if(idx!==this.currentLyricIndex && idx>=0){ this.currentLyricIndex=idx; this.showLyric(idx); }
  }
  showLyric(i){
    const l=this.lyrics[i]; this.currentLineEl.textContent=`${i+1} / ${this.lyrics.length}`;
    if(this.typewriterInterval) clearInterval(this.typewriterInterval);
    const el=document.createElement('div'); el.className='lyric-line'; el.style.cssText='font-size:1.3em; font-style:italic; min-height:50px; display:flex; align-items:center; justify-content:center; text-align:center;';
    this.lyricsText.innerHTML=''; this.lyricsText.appendChild(el);
    const cursor=document.createElement('span'); cursor.className='typewriter-cursor'; cursor.textContent='|'; el.appendChild(cursor);
    let k=0, speed=Math.max(1,Number(l.speed)||12);
    this.typewriterInterval=setInterval(()=>{ if(k<l.text.length){ el.textContent=l.text.substring(0,k+1); el.appendChild(cursor); k++; } else { clearInterval(this.typewriterInterval); this.typewriterInterval=null; el.style.animation='flicker 3s infinite'; } }, 1000/speed);
  }
  songEnded(){ this.isPlaying=false; this.updateButtonClasses(); if(this.typewriterInterval) clearInterval(this.typewriterInterval); }
  formatTime(s){ if(!s||isNaN(s)||!isFinite(s)) return '0:00'; const m=Math.floor(s/60), ss=Math.floor(s%60); return `${m}:${ss<10?'0':''}${ss}`; }
}

/* ============== Мини-игра (бывш. Level1) ============== */
class GameRunner {
  constructor(){
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.msg = document.getElementById('gameMsg');
    this.btnStart = document.getElementById('gameStart');
    this.btnReset = document.getElementById('gameReset');
    this.finalScene = document.getElementById('finalScene');

    // Параметры
    this.gravity = 1600;
    this.jumpVel = -520;
    this.speed = 240;
    this.groundY = this.canvas.height - 40;

    // Игрок
    this.player = { x: 84, y: this.groundY-42, w: 46, h: 42, vy:0, onGround:true, alive:true };

    // Спрайт девушки (опционально)
    this.girlImg = new Image();
    this.girlImg.src = 'girl.png'; // положи рядом с index.html
    this.girlLoaded = false;
    this.girlImg.onload = () => this.girlLoaded = true;

    this.obstacles = [];
    this.totalToFinish = 20;
    this.passed = 0;

    this.running=false;
    this.lastT=0;

    this.bind();
    window.addEventListener('resize', ()=>this.resizeCanvasToDisplaySize());
    this.reset();
  }

  bind(){
    this.btnStart.addEventListener('click', ()=> this.start());
    this.btnReset.addEventListener('click', ()=> this.reset());
    this.canvas.addEventListener('pointerdown', ()=>{ if(this.running) this.jump(); });

    // закрытие финальной сцены по клику и ESC
    this.finalScene.addEventListener('click', (e)=>{
      const isCloseBtn = e.target.closest('.final-close');
      const isOutside  = e.target === this.finalScene;
      if (isCloseBtn || isOutside) this.closeFinal();
    });

    // доступность: пробел/стрелка вверх — прыжок; Esc — закрыть оверлей
    window.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape' && this.finalScene.classList.contains('show')) {
        this.closeFinal();
      }
      if (!this.running) return;
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); this.jump(); }
    });
  }

  reset(){
    this.closeFinal();

    this.player.y = this.groundY - this.player.h;
    this.player.vy = 0; this.player.onGround = true; this.player.alive = true;

    this.obstacles = [];
    let x = 380;
    for(let i=0;i<this.totalToFinish;i++){
      const w = 16 + Math.floor(Math.random()*8);   // 16–24
      const h = 16 + Math.floor(Math.random()*8);   // 16–24
      this.obstacles.push({ x, y:this.groundY-h, w, h, counted:false });
      // расстояние между препятствиями: 250–350
      x += 250 + Math.floor(Math.random()*100);
    }
    this.finishX = x + 120;
    this.passed = 0;
    this.showMsg('ЛКМ/тап — прыжок. Перепрыгни 20 простых препятствий.');
  }

  start(){
    if (this.running) return; // защита от повторных запусков
    this.running = true;
    this.hideMsg();
    this.resizeCanvasToDisplaySize();
    this.lastT = performance.now();
    requestAnimationFrame((t)=>this.loop(t));
  }

  // ретина-скейл: рисуем в CSS-координатах, но с чётким bitmap
  resizeCanvasToDisplaySize(){
    const ratio = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const rect  = this.canvas.getBoundingClientRect();
    const needW = Math.floor(rect.width  * ratio);
    const needH = Math.floor(rect.height * ratio);
    if (this.canvas.width !== needW || this.canvas.height !== needH) {
      this.canvas.width  = needW;
      this.canvas.height = needH;
    }
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  jump(){
    if(this.player.onGround){
      this.player.vy = this.jumpVel;
      this.player.onGround = false;
    }
  }

  loop(t){
    if(!this.running) return;
    const dt = Math.min(0.033, (t - this.lastT)/1000);
    this.lastT = t;
    this.update(dt);
    this.draw();
    requestAnimationFrame((tt)=>this.loop(tt));
  }

  update(dt){
    const dx = this.speed * dt;
    for(const o of this.obstacles){ o.x -= dx; }
    this.finishX -= dx;

    this.player.vy += this.gravity * dt;
    this.player.y += this.player.vy * dt;
    if(this.player.y + this.player.h >= this.groundY){
      this.player.y = this.groundY - this.player.h;
      this.player.vy = 0; this.player.onGround = true;
    }

    for(const o of this.obstacles){
      if(!o.counted && this.player.x > o.x + o.w){ o.counted = true; this.passed++; }
      if(this.intersect(this.player, o)){ this.gameOver(); return; }
    }

    if(this.passed >= this.totalToFinish && this.player.x > this.finishX){
      this.win();
    }
  }

  intersect(a,b){ return !(a.x+a.w < b.x || a.x > b.x+b.w || a.y+a.h < b.y || a.y > b.y+b.h); }

  draw(){
    const c = this.ctx;

    // очистка bitmap целиком
    c.setTransform(1,0,0,1,0,0);
    c.clearRect(0,0,this.canvas.width,this.canvas.height);

    // восстановить рисование в CSS-координатах
    const ratio = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    c.setTransform(ratio,0,0,ratio,0,0);

    const W = this.canvas.width / ratio;
    const H = this.canvas.height / ratio;

    c.fillStyle='#0a0a0a'; c.fillRect(0,0,W,H);
    c.fillStyle='#0c0c0c'; for(let i=0;i<H;i+=6){ c.fillRect(0,i,W,1); }

    c.fillStyle='#151515'; c.fillRect(0,this.groundY+1,W,2);
    c.fillStyle='#1d1d1d'; c.fillRect(0,this.groundY+3,W,3);

    for(const o of this.obstacles){
      c.fillStyle='#3b0b0b'; c.fillRect(o.x,o.y,o.w,o.h);
      c.fillStyle='#5a1010'; c.fillRect(o.x+1,o.y+1,o.w-2,o.h-2);
    }

    if(this.passed >= this.totalToFinish){
      const flagW=8;
      for(let y=0;y<this.groundY; y+=10){
        c.fillStyle=(Math.floor(y/10)%2===0)?'#7a0000':'#2a0000';
        c.fillRect(this.finishX, y, flagW, 10);
      }
      c.fillStyle='rgba(255,255,255,.08)';
      c.font='bold 28px Times New Roman';
      c.fillText('ТАНАИС', this.finishX-36, this.groundY-52);
    }

    this.drawGirlImage(c, this.player);

    c.fillStyle='rgba(170,0,0,.85)'; c.font='16px Times New Roman';
    c.fillText(`Осталось: ${Math.max(0, this.totalToFinish - this.passed)}`, 14, 22);
  }

  drawGirlImage(c, pl){
    c.fillStyle='rgba(0,0,0,.35)';
    c.beginPath(); c.ellipse(pl.x + pl.w*0.5, pl.y + pl.h + 3, pl.w*0.6, 3, 0, 0, Math.PI*2); c.fill();

    if(this.girlLoaded){
      const pad = 2;
      c.drawImage(this.girlImg, pl.x - pad, pl.y - pad, pl.w + pad*2, pl.h + pad*2);
    } else {
      c.fillStyle='#0b0b0b';
      c.fillRect(pl.x+pl.w*0.45, pl.y+pl.h*0.15, pl.w*0.10, pl.h*0.55);
      c.beginPath(); c.ellipse(pl.x+pl.w*0.5, pl.y, 6.5, 7.2, 0, 0, Math.PI*2); c.fill();
    }
  }

  gameOver(){ this.running = false; this.showMsg('Промах! Нажми «Сброс», чтобы попробовать снова.'); }

  win(){
    this.running=false;
    this.showMsg('вы добрались до Танаиса)');
    setTimeout(()=>{
      this.hideMsg();
      this.finalScene.classList.add('show'); // плавное проявление
      document.body.classList.add('modal-open');
      // фокус на кнопку закрытия
      const closeBtn = this.finalScene.querySelector('.final-close');
      closeBtn?.focus();
    }, 900);
  }

  closeFinal(){
    this.finalScene.classList.remove('show');
    document.body.classList.remove('modal-open');
  }

  showMsg(text){ this.msg.textContent = text; this.msg.classList.add('show'); }
  hideMsg(){ this.msg.classList.remove('show'); }
}

// ЕДИНСТВЕННЫЙ запуск (убран дубль MusicPlayer)
window.addEventListener('load', ()=>{
  window.musicPlayer = new MusicPlayer();
  window.gameRunner  = new GameRunner();
});
