const{toRaw:toRaw}=Vue,serverURL="/";function $(t){return document.querySelectorAll(t)}wordsList=new Set,mpWordCard=null;let wcoc="#fddc02";const mediaQuery=window.matchMedia("(prefers-color-scheme: dark)");mediaQuery.matches&&(wcoc="#8875FF");const app=Vue.createApp({data:()=>({started:null,paused:!1,pausePress:!1,pauseScroll:!1,startBtn:null,tutBtn:null,lost:null,tutorialOn:!0,data:null,input:"",finalWord:"",t:10,wordCard:{word:null,type:null,defs:null,syllablesOther:null,syllablesCustom:null},foundClosest:!1,closest:null,alpha:"abcdefghijklmnopqrstuvwxyz".split(""),alphaX:0,currentLetter:"",isRandomOrder:!1,randomCounter:0,rounds:1,score:0,cookieScore:0,cookieHighScore:0,newHighScore:null,strikes:0,wordPlayed:!1,vWordsList:null,vWordsScrolled:[],vWordsOBJList:[],customScore:tpScore=null,input:null,time:null,tries:0,wordMsg:"",mode:"",order:"",classicModeOn:!1,multiPlayer:!1,mpClassicTut:!1,mpSpeedTut:!1,mpWarTut:!1,mpCTisHidden:!0,mpSTisHidden:!0,mpWTisHidden:!0,webSocket:null,isWaiting:!1,countingDown:!1,countdown:3,mpLost:null,mpTie:null,mpLostReason:null,mpFinalScore:null,autoSent:!1,opponentScore:0}),methods:{isInViewport(){const t=this.$refs.input.getBoundingClientRect();return t.top>=-30&&t.left>=0&&t.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&t.right<=(window.innerWidth||document.documentElement.clientWidth)?(this.pauseScroll=!1,1==this.pausePress||(this.paused=!1),!0):!!this.multiPlayer||(this.pauseScroll=!0,this.paused=!0,!1)},setData(t){this.data=t,this.wordCard.syllablesOther=t.tps},pause(){0==this.pausePress?(this.pausePress=!0,1==this.paused||(this.paused=!0),this.$refs.input.disabled=!0):(this.pausePress=!1,1==this.pauseScroll?this.$refs.input.disabled=!1:(this.paused=!1,this.$refs.input.disabled=!1,this.$refs.input.focus()))},timer(){1==this.isInViewport()&&0==this.paused&&1==this.started&&(this.t>0&&(this.t--,this.$refs.input.disabled=!1),0==this.t&&3!=this.strikes?(this.$refs.input.disabled=!0,this.autoSent=!0,this.callServerDictionary()):0==this.t&&3==this.strikes&&this.stopTimerAndGame())},startTimer(){3==this.strikes?(this.started=!1,this.resetStats(),this.newGame()):(this.resetStats(),this.newGame())},resetTimer(){clearInterval(this.time),this.paused=!1,this.pausePress=!1,1==this.started&&(this.$refs.input.disabled=!1,this.$refs.input.focus()),this.$refs.input.focus(),this.t=10,this.time=setInterval(this.timer,1e3)},mpStopTimer(){clearInterval(this.time),this.paused=!0,this.$refs.input.disabled=!0},mpResetTimer(){this.$refs.input.disabled=!1,this.paused=!1,this.$refs.input.focus(),this.t=10,this.time=setInterval(this.timer,1e3)},stopTimerAndGame(){clearInterval(this.time),this.t=10,this.started=!1},resetStats(){this.paused=!1,this.lost=null,this.currentLetter="",this.finalWord="",this.randomCounter=0,wordsList.clear(),this.vWordsList=null,this.vWordsScrolled=[],this.vWordsOBJList=[],this.score=0,this.newHighScore=!1,this.strikes=0,this.wordPlayed=!1,this.customScore,this.tpScore=null,this.wordCard.word=null,this.wordCard.type=null,this.wordCard.defs=null,this.wordCard.syllablesOther=null,this.wordCard.syllablesCustom=null,this.foundClosest=!1,this.closest=null,this.$refs.input.style.outlineColor=wcoc,clearInterval(this.time),this.time=null,this.mpLost=null,this.mpTie=null,this.mpLostReason=null,this.mpFinalScore=null,this.autoSent=!1},newGame(){this.tutorialOn=!1,this.started=!0,1==this.isRandomOrder||(this.alphaX=0),this.currentLetter=this.alpha[this.alphaX],this.resetTimer()},mpClassicNewGame(){this.tutorialOn=!1,this.started=!0,1==this.isRandomOrder||(this.alphaX=0),this.currentLetter=this.alpha[this.alphaX]},tutorialToggle(){1==this.tutorialOn?this.tutorialOn=!1:this.tutorialOn=!0},async callServerDictionary(t){t&&t.preventDefault(),(""==this.input||null==this.input||0==this.input.replace(/[^A-Za-z]/g,"").length)&&this.t>0||(null!=t||null!=t)&&this.t<=1||(""!=this.input&&null!=this.input||0!=this.t?(0!=this.t?this.autoSent=!1:this.autoSent=!0,this.paused=!0,fetch("/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({input:this.input.replace(/[^A-Za-z]/g,"")})}).then((t=>t.json())).then((t=>{this.input=this.input.replace(/[^A-Za-z]/g,"").toLowerCase(),0==this.input.replace(/[^A-Za-z]/g,"").length?(this.autoSent=!1,this.strike(),this.foundClosest=!1,this.wordCard.word="Invalid Input"):(this.setData(t),this.enterWord(),this.input="",this.$refs.input.focus(),this.$refs.input.click())})).then((()=>{this.multiPlayer?(this.mpStopTimer(),this.$refs.input.style.textAlign="center",this.$refs.input.placeholder="waiting..."):this.resetTimer()})).catch((t=>{alert("Sorry, there was a problem communicating with our server.")}))):(this.autoSent=!1,this.strike(),this.foundClosest=!1,this.wordCard.word="Ran Out of Time"))},enterWord(){this.tries++,gsap.to(window,{scrollTo:{y:this.$refs.appWrap.offsetTop,autokill:!0},duration:.5});try{""==this.input||(null==this.data.data[0]||null==toRaw(this.data.data[0].hwi)?(null!=typeof toRaw(this.data.data[0])?(this.foundClosest=!0,this.closest=toRaw(this.data.data[0])):this.foundClosest=!1,this.strike(),this.wordCard.word="Not a Word"):toRaw(this.data.data[0].meta.id).includes("-")||toRaw(this.data.data[0].meta.id).includes(" ")?(this.strike(),this.wordCard.word="No Two-Part Words",this.wordCard.defs=null,this.foundClosest=!1):this.isCurrentLetter()?this.isOffensive()?(this.strike(),this.foundClosest=!1,this.wordCard.word="Offensive"):this.hasBeenUsed()?(this.strike(),this.foundClosest=!1,this.wordCard.word="Already Used"):(this.foundClosest=!1,this.syllableCountCustom(this.input,toRaw(this.data.data)),this.wordCardUpdate(this.input,toRaw(this.data.data)),this.syllableLengthCheck()?null!=this.webSocket?this.wordPlayed&&this.tpScore?this.webSocket.send(JSON.stringify({score:this.wordCard.syllablesOther,time:Date.now(),word:this.wordCard,strikes:this.strikes,autoSent:this.autoSent})):this.wordPlayed&&this.customScore&&this.webSocket.send(JSON.stringify({score:this.wordCard.syllablesCustom,time:Date.now(),word:this.wordCard,strikes:this.strikes,autoSent:this.autoSent})):(this.scoreKeeper(),this.nextLetter(),this.$refs.input.style.outlineColor="green",this.scroll()):(this.notLongEnough(),this.wordCard.word="Too Short")):(this.strike(),this.foundClosest=!1,this.wordCard.word="Wrong Starting Letter"))}catch(t){this.strike(),this.foundClosest=!1,this.wordCard.word="Not a Word"}},strike(){this.strikes++,this.$refs.input.style.outlineColor="red",this.cycleWordMessage(0),null!=this.webSocket&&this.webSocket.send(JSON.stringify({score:0,time:Date.now(),word:null,strikes:this.strikes,autoSent:this.autoSent})),3==this.strikes?(this.finalWord=this.$refs.input.value,this.lost=!0,this.wordCard.word=null,this.wordCard.type=null,this.wordCard.defs=null,this.stopTimerAndGame(),localStorage.setItem("lastScore",`${this.score}`),this.score>this.cookieHighScore?(this.newHighScore=!0,localStorage.setItem("highScore",`${this.score}`)):this.newHighScore=!1,null!=this.webSocket&&(this.mpLost=!0)):(this.multiPlayer?(this.mpStopTimer(),this.classicModeOn||this.mpResetTimer()):this.resetTimer(),this.wordCard.word=null,this.wordCard.type=null,this.wordCard.defs=null)},isOffensive(){return toRaw(this.data.data[0].meta.offensive)},isCurrentLetter(){return this.currentLetter=this.alpha[this.alphaX],this.input.split("")[0].toLowerCase()==this.alpha[this.alphaX].toLowerCase()},hasBeenUsed(){if(wordsList.has(this.input)||wordsList.has(this.input.charAt(0).toUpperCase()+this.input.slice(1))){for(let t=0;t<this.$refs.wl.children.length;t++)(this.$refs.wl.children[t].innerHTML.includes(this.input)||this.$refs.wl.children[t].innerHTML.includes(this.input.charAt(0).toUpperCase()+this.input.slice(1)))&&(gsap.to(this.$refs.wl,{scrollTo:{y:0,x:this.$refs.wl.children[t].offsetLeft-this.$refs.wl.clientWidth/2+this.$refs.wl.children[t].clientWidth/2,autokill:!0},duration:.5}),this.$refs.wl.children[t].children[0].classList.toggle("btn-highlight"),setTimeout((()=>{this.$refs.wl.children[t].children[0].classList.toggle("btn-highlight2")}),2500));return!0}return!1},notLongEnough(){this.strike()},wordCardUpdate(t,s){for(let e=0;e<s[0].meta.stems.length;e++)t==s[0].meta.stems[e].toLowerCase()&&(this.wordCard.word=s[0].meta.stems[e],this.wordCard.type=s[0].fl,this.wordCard.defs=s[0].shortdef);null!=this.wordCard.defs&&this.vWordsOBJList.push(Object.values(toRaw(this.wordCard)))},syllableCountCustom(t,s){let e=[];for(let i=0;i<s[0].meta.stems.length;i++)if(t==s[0].meta.stems[i])if(null!=s[0].hwi){if(e.push(s[0].hwi.hw.split("*")),null!=s[0].uros)for(let t in s[0].uros)e.push(s[0].uros[t].ure.split("*"));for(let s in e)e[s].join("")==t&&(this.wordCard.syllablesCustom=e[s].length)}else if(null!=s[0].uros)for(let i in s[0].uros)e.push(s[0].uros[i].ure.split("*")),e[i].join("")==t&&(this.wordCard.syllablesCustom=e[i].length)},syllableLengthCheck(){return toRaw(this.wordCard.syllablesCustom)<3&&toRaw(this.wordCard.syllablesOther)<3?(this.cycleWordMessage(this.wordCard.syllablesOther),this.wordPlayed=!1):null==toRaw(this.wordCard.syllablesCustom)&&null!=toRaw(this.wordCard.syllablesOther)&&toRaw(this.wordCard.syllablesOther)>=3||toRaw(this.wordCard.syllablesCustom)<3&&toRaw(this.wordCard.syllablesOther)>=3?(this.wordListUpdate(),this.tpScore=!0,this.wordPlayed=!0):toRaw(this.wordCard.syllablesCustom)>=3&&toRaw(this.wordCard.syllablesOther)<3?this.wordCard.syllablesCustom-this.wordCard.syllablesOther>1?this.wordPlayed=!1:(this.wordListUpdate(),this.customScore=!0,this.wordPlayed=!0):toRaw(this.wordCard.syllablesCustom)>=3&&toRaw(this.wordCard.syllablesOther)>=3&&toRaw(this.wordCard.syllablesOther)>toRaw(this.wordCard.syllablesCustom)?(this.wordListUpdate(),this.tpScore=!0,this.wordPlayed=!0):toRaw(this.wordCard.syllablesCustom)>=3&&toRaw(this.wordCard.syllablesOther)>=3&&toRaw(this.wordCard.syllablesOther)<toRaw(this.wordCard.syllablesCustom)?(this.wordListUpdate(),this.customScore=!0,this.wordPlayed=!0):toRaw(this.wordCard.syllablesCustom)>=3&&toRaw(this.wordCard.syllablesOther)>=3&&toRaw(this.wordCard.syllablesCustom)==toRaw(this.wordCard.syllablesOther)?(this.wordListUpdate(),this.tpScore=!0,this.wordPlayed=!0):void 0},wordListUpdate(){this.multiPlayer||(this.wordPlayed=!0,wordsList.add(toRaw(this.wordCard.word)),this.vWordsList=wordsList)},mpWordListUpdate(){this.wordPlayed=!0,wordsList.add(toRaw(this.wordCard.word)),this.vWordsList=wordsList,null!=this.wordCard.defs&&this.vWordsOBJList.push(Object.values(toRaw(this.wordCard)))},cycleWordMessage(t){switch(t){case 0:this.wordMsg="oops!";break;case 1:this.wordMsg="not quite...";break;case 2:this.wordMsg="hmm...";break;case 3:this.wordMsg="nice!";break;case 4:this.wordMsg="great!!";break;case 5:this.wordMsg="wonderful!!!"}t>=6&&(this.wordMsg="incredible!!!!"),this.animateWordMsg()},mpWordMessage(t){switch(t){case"speed":this.wordMsg="too slow!";break;case"war":this.wordMsg="too small!";break;case"tie":this.wordMsg="tie!"}this.animateWordMsg()},animateWordMsg(){wm=gsap.timeline().fromTo(this.$refs.wordMsg,{y:"100%",opacity:0},{y:"0%",opacity:1,duration:.5}).to(this.$refs.wordMsg,{y:"100%",opacity:0,duration:.5},"<+=2")},scoreKeeper(){this.wordPlayed&&this.tpScore?(this.cycleWordMessage(this.wordCard.syllablesOther),this.score+=this.wordCard.syllablesOther,this.cookieScore=this.score,localStorage.setItem("lastScore",`${this.score}`)):this.wordPlayed&&this.customScore&&(this.cycleWordMessage(this.wordCard.syllablesCustom),this.score+=this.wordCard.syllablesCustom,this.cookieScore=this.score,localStorage.setItem("lastScore",`${this.score}`)),this.score>this.cookieHighScore&&(this.newHighScore=!0,this.cookieScore=this.score,localStorage.setItem("highScore",`${this.score}`))},mpScoreFinal(t){localStorage.setItem("lastScore",`${t}`),t>this.cookieHighScore&&(this.newHighScore=!0,localStorage.setItem("highScore",`${t}`))},nextLetter(){1==this.isRandomOrder?26==this.randomCounter?(this.rounds++,this.randomCounter=0,this.alphaX=Math.floor(26*Math.random()),this.currentLetter=this.alpha[this.alphaX]):(this.randomCounter++,this.alphaX=Math.floor(26*Math.random()),this.currentLetter=this.alpha[this.alphaX]):25==this.alphaX?(this.alphaX=0,this.currentLetter=this.alpha[this.alphaX],this.rounds++):(this.alphaX++,this.currentLetter=this.alpha[this.alphaX]),this.tpScore,this.customScore=!1,this.wordPlayed=!1,this.$refs.input.focus()},mpNextLetter(t,s){this.alphaX=s,this.currentLetter=null==t||null==t?this.alpha[s]:t,this.tpScore,this.customScore=!1,this.wordPlayed=!1,this.$refs.input.focus()},scroll(){setTimeout((()=>{null==this.$refs.wl.children[this.$refs.wl.children.length-1]||(this.vWordsScrolled.push(this.$refs.wl.children[this.$refs.wl.children.length-1].scrollWidth),gsap.to(this.$refs.wl,{scrollTo:{y:0,x:this.$refs.wl.scrollWidth,autokill:!0},duration:.5}))}),100),gsap.fromTo(".def-pop",{opacity:0},{opacity:1,duration:1}),gsap.to(".def-pop",{opacity:0,delay:3})},replaceWordCard(t){this.finalWord="";for(let s=0;s<this.vWordsOBJList.length;s++)t.target.innerHTML==this.vWordsOBJList[s][0]&&(this.wordCard.word=this.vWordsOBJList[s][0],this.wordCard.type=this.vWordsOBJList[s][1],this.wordCard.defs=this.vWordsOBJList[s][2]);gsap.to(this.$refs.wl,{scrollTo:{y:0,x:t.target.offsetLeft-this.$refs.wl.clientWidth/2+t.target.clientWidth/2,autokill:!0},duration:.5}),gsap.to(this.$refs.wcScroller,{scrollTo:0,duration:.5})},randomOrder(t,s){0==s?(this.isRandomOrder=!1,this.alphaX=0,this.currentLetter=this.alpha[this.alphaX]):(this.isRandomOrder=!0,this.multiPlayer||(this.alphaX=Math.floor(26*Math.random()),this.currentLetter=this.alpha[this.alphaX]))},twoPlayer(){1==this.multiPlayer?this.multiPlayer=!1:this.multiPlayer=!0},mpCTHide(){0==this.mpCTisHidden?this.mpCTisHidden=!0:this.mpCTisHidden=!1},mpSTHide(){0==this.mpSTisHidden?this.mpSTisHidden=!0:this.mpSTisHidden=!1},mpWTHide(){0==this.mpWTisHidden?this.mpWTisHidden=!0:this.mpWTisHidden=!1},classicTutToggle(){0==this.mpClassicTut?this.mpClassicTut=!0:this.mpClassicTut=!1},speedTutToggle(){0==this.mpSpeedTut?this.mpSpeedTut=!0:this.mpSpeedTut=!1},warTutToggle(){0==this.mpWarTut?this.mpWarTut=!0:this.mpWarTut=!1},backToMulti(){this.mpClassicTut=!1,this.classicModeOn=!1,this.mpSpeedTut=!1,this.mpWarTut=!1,this.multiPlayer=!0,this.lost=!1},backToSolo(){this.mpClassicTut=!1,this.classicModeOn=!1,this.mpSpeedTut=!1,this.mpWarTut=!1,this.multiPlayer=!1,this.lost=!1},quit(){this.started=!1,this.tutorialOn=!1,this.backToSolo(),restart=gsap.timeline().to(".logo",{height:"80px",duration:.5}).to(".logo-holster",{height:"90px",margin:"0 0 2rem",duration:.5},"<"),this.score>this.cookieHighScore&&(this.newHighScore=!0,this.cookieScore=this.score,localStorage.setItem("highScore",`${this.score}`)),this.cookieScore=localStorage.getItem("lastScore"),null==this.cookieScore&&(this.cookieScore=0),this.cookieHighScore=localStorage.getItem("highScore"),null!=this.cookieHighScore&&""!=this.cookieHighScore||(this.cookieHighScore=0),this.resetStats()},startWebSocket(){this.mpClassicTut?this.mode="classic":this.mpSpeedTut?this.mode="speed":this.mpWarTut&&(this.mode="war"),this.isRandomOrder?this.order="random":this.order="default",this.webSocket=new WebSocket(`wss://${window.location.hostname}:${window.location.port}`),this.webSocket.addEventListener("open",(t=>{this.webSocket.send(JSON.stringify({mode:this.mode,order:this.order}))})),this.webSocket.addEventListener("message",(t=>{if(rep=JSON.parse(t.data),1==rep.waiting?this.isWaiting=!0:0==rep.waiting&&1==rep.inGame&&(1==rep.isClassic&&(this.classicModeOn=!0),this.countingDown=!0,mpCountdown=setInterval((()=>{this.countdown--,0==this.countdown&&(clearInterval(mpCountdown),this.countdown=3,this.countingDown=!1,this.classicModeOn?(this.resetStats(),this.mpClassicNewGame()):(this.resetStats(),this.newGame()),this.mpNextLetter(rep.letter,rep.letterIndex))}),1e3)),1==rep.opponentForfeit&&(this.stopTimerAndGame(),this.lost=!0,this.mpLost=!1,this.mpLostReason="Opponent quit or disconnected",this.mpScoreFinal(this.score)),null!=this.wordCard||null!=this.wordCard){if(this.$refs.input.style.textAlign="left",this.$refs.input.placeholder="",1==rep.winner){if(mpWordCard=rep.winningWord,toRaw(this.wordCard).word=rep.winningWord.word,toRaw(this.wordCard).type=rep.winningWord.type,toRaw(this.wordCard).defs=rep.winningWord.defs,toRaw(this.wordCard).syllablesOther=rep.winningWord.syllablesOther,toRaw(this.wordCard).syllablesCustom=rep.winningWord.syllablesCustom,null==this.$refs.wl.children[0]){const t=document.createElement("li");t.innerHTML='<button class="btn font2"></button>',t.addEventListener("click",(()=>{this.replaceWordCard()})),t.addEventListener("keydown",(t=>{32===t.keyCode&&this.replaceWordCard(),13===t.keyCode&&this.replaceWordCard()})),wordsList.add(toRaw(this.wordCard.word)),this.vWordsList=wordsList}this.mpWordListUpdate(),this.$forceUpdate(),this.$refs.input.style.outlineColor="green",gsap.to(this.$refs.wordCardDisplay,{outline:`0px solid ${wcoc}`,duration:.5}),this.scoreKeeper(),this.mpNextLetter(rep.letter,rep.letterIndex),this.scroll(),this.classicModeOn||(this.mpStopTimer(),this.mpResetTimer())}else if(0==rep.winner){if(mpWordCard=rep.winningWord,toRaw(this.wordCard).word=rep.winningWord.word,toRaw(this.wordCard).type=rep.winningWord.type,toRaw(this.wordCard).defs=rep.winningWord.defs,toRaw(this.wordCard).syllablesOther=rep.winningWord.syllablesOther,toRaw(this.wordCard).syllablesCustom=rep.winningWord.syllablesCustom,null==this.$refs.wl.children[0]){const t=document.createElement("li");t.innerHTML='<button class="btn font2"></button>',t.addEventListener("click",(()=>{this.replaceWordCard()})),t.addEventListener("keydown",(t=>{32===t.keyCode&&this.replaceWordCard(),13===t.keyCode&&this.replaceWordCard()})),wordsList.add(toRaw(this.wordCard.word)),this.vWordsList=wordsList}this.mpWordListUpdate(),this.$forceUpdate(),0==rep.score?this.$refs.input.style.outlineColor="red":this.$refs.input.style.outlineColor=wcoc,wcOutline=gsap.timeline().to(this.$refs.wordCardDisplay,{outline:`9px solid ${wcoc}`,duration:.5}).to(this.$refs.wordCardDisplay,{outline:`0px solid ${wcoc}`,duration:.5},"<+=2"),0==rep.score||this.classicModeOn||0==this.wordPlayed||this.mpWordMessage(this.mode),this.mpNextLetter(rep.letter,rep.letterIndex);try{this.scroll()}catch(t){}this.classicModeOn||(this.mpStopTimer(),this.mpResetTimer())}else"tie"==rep.winner&&(this.$forceUpdate(),0==rep.score?this.$refs.input.style.outlineColor="red":this.$refs.input.style.outlineColor=wcoc,0==rep.score||this.classicModeOn||0==this.wordPlayed||this.mpWordMessage("tie"),this.mpNextLetter(rep.letter,rep.letterIndex),this.classicModeOn||(this.mpStopTimer(),this.mpResetTimer()));1==this.classicModeOn&&(0==rep.isYourTurn&&(this.mpStopTimer(),this.$refs.input.style.textAlign="center",this.$refs.input.placeholder="waiting..."),1==rep.isYourTurn&&(this.mpResetTimer(),this.$refs.input.style.textAlign="left",this.$refs.input.placeholder=""))}1==rep.lost?(this.mpLost=!0,this.mpLostReason=rep.reason,this.lost=!0,this.isWaiting=!1,this.mpScoreFinal(rep.totalScore),this.opponentScore=rep.otherScore,this.stopTimerAndGame(),this.webSocket.close(),this.mpClassicTut,this.mpSpeedTut,this.mpWarTut=!1,this.classicModeOn=!1,this.mode=""):1==rep.won?(this.mpLost=!1,this.mpLostReason=rep.reason,this.lost=!0,this.isWaiting=!1,this.mpScoreFinal(rep.totalScore),this.opponentScore=rep.otherScore,this.stopTimerAndGame(),this.webSocket.close(),this.mpClassicTut,this.mpSpeedTut,this.mpWarTut=!1,this.classicModeOn=!1,this.mode=""):1==rep.tie&&(this.mpLost=!1,this.mpTie=!0,this.mpLostReason=rep.reason,this.lost=!0,this.isWaiting=!1,this.mpScoreFinal(rep.totalScore),this.opponentScore=rep.otherScore,this.stopTimerAndGame(),this.webSocket.close(),this.mpClassicTut,this.mpSpeedTut,this.mpWarTut=!1,this.classicModeOn=!1,this.mode="")})),this.webSocket.addEventListener("close",(t=>{this.isWaiting=!1,this.webSocket=null}))},closeWebSocket(){null==this.webSocket&&null==this.webSocket||(this.webSocket.close(),this.isWaiting=!1,this.webSocket=null,this.started=!1,this.backToMulti(),this.resetStats(),restart=gsap.timeline().to(".logo",{height:"80px",duration:.5}).to(".logo-holster",{height:"90px",margin:"0 0 2rem",duration:.5},"<"),this.score>this.cookieHighScore&&(this.newHighScore=!0,this.cookieScore=this.score,localStorage.setItem("highScore",`${this.score}`)),this.cookieScore=localStorage.getItem("lastScore"),this.cookieHighScore=localStorage.getItem("highScore"))}},beforeCreate(){},beforeMount(){},mounted:function(){$("#form")[0].addEventListener("submit",this.callServerDictionary),window.addEventListener("beforeunload",(t=>{null==this.webSocket||this.webSocket.close(),localStorage.setItem("lastScore",`${this.score}`),this.score>this.cookieHighScore&&(this.newHighScore=!0,localStorage.setItem("highScore",`${this.score}`))})),null==localStorage.getItem("lastScore")||null==localStorage.getItem("highScore")?(localStorage.setItem("lastScore","0"),localStorage.setItem("highScore","0")):(this.cookieScore=localStorage.getItem("lastScore"),this.cookieHighScore=localStorage.getItem("highScore"),null!=this.cookieHighScore&&""!=this.cookieHighScore||(this.cookieHighScore=0)),document.addEventListener("DOMContentLoaded",(()=>{gsap.registerPlugin(ScrollToPlugin),introTL=gsap.timeline().to(".logo",{height:"80px",width:"120px",duration:.75,delay:.35,margin:0,ease:"power3.inOut"}).to(".logo-holster",{height:"90px",duration:1,ease:"power4.inOut"},"<+=0.0125").to("#app",{height:"auto",duration:.15,opacity:1,ease:"power4.inOut"},"<").set("#app",{display:"flex"}).fromTo(".card",{opacity:0},{opacity:1,duration:.5,ease:"power4.out"},"<+=.1").call((function(){$("body")[0].classList.add("overflow")}))})),this.$refs.input.addEventListener("keydown",(()=>{this.$refs.input.style.outlineColor=wcoc})),this.$refs.input.addEventListener("keydown",(t=>{32===t.keyCode&&t.preventDefault()})),this.$refs.input.addEventListener("paste",(t=>(t.preventDefault(),!1)))},updated:function(){this.$refs.wl.children.length>3&&(this.$refs.wl.style.justifyContent="initial"),this.started?($("html")[0].style.height="auto",$("html")[0].style.overflow="scroll",gsap.to([".logo",".logo-holster"],{height:0,margin:0,duration:.5}),10==this.t&&setTimeout((()=>{this.$refs.input.focus()}),500)):(1==this.lost&&(restart=gsap.timeline().to(".logo",{height:"80px",duration:.5}).to(".logo-holster",{height:"90px",margin:"0 0 2rem",duration:.5},"<"),this.cookieScore=localStorage.getItem("lastScore"),this.cookieHighScore=localStorage.getItem("highScore")),$("html")[0].style.height="100%")}}).mount("#app");