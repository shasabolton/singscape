// put intervals on blocks

var version = 1;

//----------------------------------------------------------------------------------
var log = document.getElementById("log");
var ground = [
  {start: -1, semitones: 1, horiz: 5},
  {start: -1, semitones: 1, horiz: 1, text: {0:"Under Construction"}},
  {start: -1, semitones: 1, horiz: 10}
];

//modern
//var terrainKey = ["sienna","yellowgreen","yellowgreen","yellowgreen","yellowgreen","darkgrey","whitesmoke","whitesmoke","whitesmoke","whitesmoke","whitesmoke","whitesmoke"];

//calm
var terrainKey = ["#56444f", "#ad676e", "#ad676e","#ad676e","#ad676e","#6c536d", "#f6d4c8", "#f6d4c8", "#f6d4c8", "#f6d4c8", "#f6d4c8", "#f6d4c8"];

var levels;
var levelIndex = 0;
var rootKey = 28//40 = C4, 28 = c3;
var groundHeight = 3;
var width = window.innerWidth;
var height = window.innerHeight;
var range = 18; //pitch range in semitones
var stepSize = Math.floor(window.innerHeight/range);
var widthBlocks = Math.floor(width/stepSize);
var distance = 0;
//var speed = 1000/(4*stepSize);//millis per pixel
var speed = 1;//Math.ceil(stepSize/4);
let start;
var noteDiv = document.getElementById("noteDiv");
var speech = document.getElementById("speech");
speech.style.display = "none";
var wordsDiv = document.getElementById("wordsDiv");
var words = document.getElementById("words");
var helpStage = "pitch";
var okButton = document.getElementById("okButton");
var pointerContainer = document.getElementById("pointerContainer");
var paused = true;
var midGame = false;
var mainCanvas = document.getElementById("mainCanvas");
var mainCanvasCtx = mainCanvas.getContext("2d");
mainCanvas.width = width;
mainCanvas.height = height;
var lastMainCanvasDraw = Date.now();
var animations = [];

var agent = document.getElementById("agent");
var agentStartHeight = "50vh";
const agentSprite = new Image();
var monkUrl = "https://lh3.googleusercontent.com/pw/ACtC-3cDpWMu5SU725m1_laqpQe961sZu5eFERDT7D20WaoaBrKYRz51L81mGiugfL2E8Tfamw3pVzhsW2GhAkokyvlTOhJbt3DuruES2g938BWjcGNvZ5Ed9wUlXOFE3GdJpr4c0gCQ_KE2OmMLXY66J5GO=w833-h500-no?authuser=0";

//var agentSpriteWidth = 400; //400;
//var agentSpriteHeight = 160;//160;
//var agentFrameWidth = agentSpriteWidth/10;
//var agentFrameHeight = agentSpriteHeight/2;
var agentHeight = 2*stepSize;//stepSize/agentFrameWidth*agentFrameHeight;
var agentWidth = stepSize;
agent.height = agentHeight;
agent.width = agentWidth;
agent.style.right = widthBlocks/2*stepSize + "px";
var agentRight = parseInt(agent.style.right,10);
var agentCtx = agent.getContext("2d");
//var agentAnimFrame = 0;
//var lastAgentDraw = Date.now();
var notes = JSON.parse(
			`{"A0":{"freq":27.5,"key":1},"A#0/Bb0":{"freq":29.14,"key":2},"B0":{"freq":30.87,"key":3},"C1":{"freq":32.7,"key":4},"C#1/Db1":{"freq":34.65,"key":5},"D1":{"freq":36.71,"key":6},"D#1/Eb1":{"freq":38.89,"key":7},"E1":{"freq":41.2,"key":8},"F1":{"freq":43.65,"key":9},"F#1/Gb1":{"freq":46.25,"key":10},"G1":{"freq":49,"key":11},"G#1/Ab1":{"freq":51.91,"key":12},"A1":{"freq":55,"key":13},"A#1/Bb1":{"freq":58.27,"key":14},"B1":{"freq":61.74,"key":15},"C2":{"freq":65.41,"key":16},"C#2/Db2":{"freq":69.3,"key":17},"D2":{"freq":73.42,"key":18},"D#2/Eb2":{"freq":77.78,"key":19},"E2":{"freq":82.41,"key":20},"F2":{"freq":87.31,"key":21},"F#2/Gb2":{"freq":92.5,"key":22},"G2":{"freq":98,"key":23},"G#2/Ab2":{"freq":103.83,"key":24},"A2":{"freq":110,"key":25},"A#2/Bb2":{"freq":116.54,"key":26},"B2":{"freq":123.47,"key":27},"C3":{"freq":130.81,"key":28},"C#3/Db3":{"freq":138.59,"key":29},"D3":{"freq":146.83,"key":30},"D#3/Eb3":{"freq":155.56,"key":31},"E3":{"freq":164.81,"key":32},"F3":{"freq":174.61,"key":33},"F#3/Gb3":{"freq":185,"key":34},"G3":{"freq":196,"key":35},"G#3/Ab3":{"freq":207.65,"key":36},"A3":{"freq":220,"key":37},"A#3/Bb3":{"freq":233.08,"key":38},"B3":{"freq":246.94,"key":39},"C4":{"freq":261.63,"key":40},"C#4/Db4":{"freq":277.18,"key":41},"D4":{"freq":293.66,"key":42},"D#4/Eb4":{"freq":311.13,"key":43},"E4":{"freq":329.63,"key":44},"F4":{"freq":349.23,"key":45},"F#4/Gb4":{"freq":369.99,"key":46},"G4":{"freq":392,"key":47},"G#4/Ab4":{"freq":415.3,"key":48},"A4":{"freq":440,"key":49},"A#4/Bb4":{"freq":466.16,"key":50},"B4":{"freq":493.88,"key":51},"C5":{"freq":523.25,"key":52},"C#5/Db5":{"freq":554.37,"key":53},"D5":{"freq":587.33,"key":54},"D#5/Eb5":{"freq":622.25,"key":55},"E5":{"freq":659.25,"key":56},"F5":{"freq":698.46,"key":57},"F#5/Gb5":{"freq":739.99,"key":58},"G5":{"freq":783.99,"key":59},"G#5/Ab5":{"freq":830.61,"key":60},"A5":{"freq":880,"key":61},"A#5/Bb5":{"freq":932.33,"key":62},"B5":{"freq":987.77,"key":63},"C6":{"freq":1046.5,"key":64},"C#6/Db6":{"freq":1108.73,"key":65},"D6":{"freq":1174.66,"key":66},"D#6/Eb6":{"freq":1244.51,"key":67},"E6":{"freq":1318.51,"key":68},"F6":{"freq":1396.91,"key":69},"F#6/Gb6":{"freq":1479.98,"key":70},"G6":{"freq":1567.98,"key":71},"G#6/Ab6":{"freq":1661.22,"key":72},"A6":{"freq":1760,"key":73},"A#6/Bb6":{"freq":1864.66,"key":74},"B6":{"freq":1975.53,"key":75},"C7":{"freq":2093,"key":76},"C#7/Db7":{"freq":2217.46,"key":77},"D7":{"freq":2349.32,"key":78},"D#7/Eb7":{"freq":2489.02,"key":79},"E7":{"freq":2637.02,"key":80},"F7":{"freq":2793.83,"key":81},"F#7/Gb7":{"freq":2959.96,"key":82},"G7":{"freq":3135.96,"key":83},"G#7/Ab7":{"freq":3322.44,"key":84},"A7":{"freq":3520,"key":85},"A#7/Bb7":{"freq":3729.31,"key":86},"B7":{"freq":3951.07,"key":87},"C8":{"freq":4186.01,"key":88},"C#8/Db8":{"freq":4434.92,"key":89},"D8":{"freq":4698.63,"key":90},"D#8/Eb8":{"freq":4978.03,"key":91},"E8":{"freq":5274.04,"key":92},"F8":{"freq":5587.65,"key":93},"F#8/Gb8":{"freq":5919.91,"key":94},"G8":{"freq":6271.93,"key":95},"G#8/Ab8":{"freq":6644.88,"key":96},"A8":{"freq":7040,"key":97},"A#8/Bb8":{"freq":7458.62,"key":98},"B8":{"freq":7902.13,"key":99}}`
		);
var keyDisplay = document.getElementById("keyDisplay");
keyDisplay.innerHTML = getNoteName(rootKey);
var message = document.getElementById("message");
message.style.bottom = stepSize * (range -1) + "px";
message.style.fontSize = stepSize - 2 + "px";


var happyFaceSprite = "https://lh3.googleusercontent.com/pw/ACtC-3fPxmz8K7fVVnT6rD_bYsAX8mqXcjgbpUU2_t6ejD38n8LbemgFijrggRtbTF8YY2PXpwj2hl2MyMGAh0Swz8exYlLdJCAQw0KtpFSYmHao0mi_pWuWm6XkBQcHK4z5NYDWLt8r-ghSNiMEkDalSo9I=w778-h195-no?authuser=0";//"https://cdn.glitch.com/cca01433-e413-4727-a205-3577841cfc4c%2Fhappy%20face.png?v=1613283555106"

var brideSprite = "https://lh3.googleusercontent.com/pw/ACtC-3fPEZOGtHedAA77Q7_rktnJzgSWYChF_4xqNLBbGXIPkS9lAIeBAs9VMF05J4okgRNJDTpgwVpmziCcVmwftplZeNHk_ofl4kCyv0d9haO3xULhRDDVMPlq4T97M_dozc_pE82FIYI3IJ5yKmRv3Qth=w35-h71-no?authuser=0";


var sharkSprite = "https://lh3.googleusercontent.com/pw/ACtC-3eu0HM8iDWqr8_-tyxzmkzt3wLPlNYljxiIyxL8xdAo2E7uOPtflViU3GZKnQ_miEKvo9IkqsKtPCFOGUW_3kUOAlojH1qKzWaLawa9a2JIJ6eOLqgHBlsyv10BVV0ohWV_u__npeBzt8F46xmOw1y0=w480-h40-no?authuser=0";

var babySprite = "https://lh3.googleusercontent.com/pw/ACtC-3fQtj2rMlHyVBFhYnhu93P6KIP-4-jo9KdRJeDXEDRyqMtln8j0L3poYdEKttDlLYgot_CNko1IdO05819_iMkpLYpXs-vGYBGSsfqkd7ckId7WUD-AosaFLjqjyU4XEkZk51V0OaYntWrkzApzZ0A2=w321-h161-no?authuser=0";

var cloudsSprite = "https://lh3.googleusercontent.com/pw/ACtC-3c3DBPPn7VOyIhiG7x6D25K3D8TxJztFnpOsZyJTMUaty8Uk6yb4BMpF75iqUQHW5EvLqPDNYOS1T2mG8H1FnxF9fbdQ1kK768lcbzkczkMLm2uLlV0nI0AN7I5ayEOj1cdIN9ArZXEyEQgvmsHtdw5=w334-h500-no?authuser=0";//"https://lh3.googleusercontent.com/pw/ACtC-3e0hEsEEKrR8FKu8GqRJvxLs9Rz2k9DJvDIzprZSSNJXEeBoJlSpRQyyu38l2lVLL8bvVdX6zjgacPzqRjuDvJxi_fSoXpXcxGEDHI9649HTLindI_tDtaeG5uu0zvkra6xcwdKRT66oM1Vanv2SyI9=w334-h500-no?authuser=0";

var happyFace = new AnimatedSprite(happyFaceSprite,//scr
                         [4],//frameLengths
                         stepSize*4, //printedWidth
                         stepSize*4,// printedHeight
                         100, //drawPeriod
                         "self", //ctx
                         "none", //followElement, 
                         "static",//animType
                         stepSize*-1.8, //x
                         stepSize*-2, //y          
                         0, //speedX 
                         0, //speedY
                         3,//startFrameX
                         0,//startFrameY 
                         1,//animDirection          
                         (animation)=>{
                            if(parseInt(animation.followElement.style.right,10) + stepSize > agentRight && parseInt(animation.followElement.style.right,10) - stepSize < agentRight){
                              animation.animType = "backAndForth"; 
                            } 
                            else{animation.animType = "static";}
                          }          
                        )

var bride = new AnimatedSprite(brideSprite,//scr
                         [1],//frameLengths
                         stepSize, //printedWidth
                         stepSize*2,// printedHeight
                         100, //drawPeriod
                         "self", //ctx
                         "none", //followElement, 
                         "static",//animType
                         stepSize*0, //x
                         stepSize*-2, //y          
                         0, //speedX 
                         0, //speedY
                         0,//startFrameX
                         0,//startFrameY 
                         1,//animDirection          
                         (animation)=>{
                            if(parseInt(animation.followElement.style.right,10) + 2*stepSize > agentRight){
                              animation.canvas.classList.add("brideAnim");//animation.animType = "backAndForth"; 
                            } 
                            else{animation.animType = "static";}
                          }          
                        )

var shark = new AnimatedSprite(sharkSprite,//scr
                         [4],//frameLengths
                         stepSize*3, //printedWidth
                         stepSize*1,// printedHeight
                         100, //drawPeriod
                         "self", //ctx
                         "none", //followElement, 
                         "backAndForth",//animType
                         stepSize*0, //x
                         stepSize*1, //y          
                         0, //speedX 
                         0, //speedY
                         3,//startFrameX
                         0,//startFrameY 
                         1,//animDirection          
                         (animation)=>{
                            if(parseInt(animation.followElement.style.right,10) + 3*stepSize > agentRight){
                              animation.canvas.classList.add("sharkAnim"); 
                            } 
                            //else{animation.animType = "static";}
                          }          
                        );      

var baby = new AnimatedSprite(babySprite,//scr
                         [4,4],//frameLengths
                         stepSize*1, //printedWidth
                         stepSize*1,// printedHeight
                         100, //drawPeriod
                         "self", //ctx
                         "none", //followElement, 
                         "backAndForth",//animType
                         stepSize*0, //x
                         stepSize*-1, //y          
                         0, //speedX 
                         0, //speedY
                         0,//startFrameX
                         1,//startFrameY 
                         1,//animDirection          
                         (animation)=>{
                            if(parseInt(animation.followElement.style.right,10) > agentRight - stepSize){
                              animation.animFrameY = 0; 
                            } 
                            //else{animation.animType = "static";}
                          }          
                        );                    
                        

var monk = new AnimatedSprite(monkUrl,//scr
                         [7,10,6],//frameLengths
                         stepSize*1, //printedWidth
                         stepSize*2,// printedHeight
                         100, //drawPeriod
                         agentCtx, //ctx
                         "none", //followElement, 
                         "backAndForth",//animType
                         stepSize*0, //x
                         stepSize*0, //y          
                         0, //speedX 
                         0, //speedY
                         0,//startFrameX
                         2,//startFrameY 
                         1,//animDirection          
                         (animation)=>{
                            /*if(parseInt(animation.followElement.style.right,10) + 3*stepSize > agentRight){
                              animation.canvas.classList.add("sharkAnim"); 
                            } */
                            //else{animation.animType = "static";}
                          }          
                        );

  
  

function Cloud(index){
  this.init = function(){
    this.index = index;
    this.image = new Image;
    this.image.src = cloudsSprite;
    this.numFramesX = 1;
    this.printedWidth = 12*stepSize;
    this.numFramesY = 3;
    this.printedHeight = 6*stepSize;
    var that = this;
    this.image.onload = function(){
      makeCanvas(that);
      }  
  }

  var makeCanvas = function(cloud){
    cloud.fileWidth = cloud.image.naturalWidth; 
    cloud.fileHeight = cloud.image.naturalHeight; 
    cloud.frameWidth = Math.floor(cloud.fileWidth/cloud.numFramesX);
    cloud.frameHeight = Math.floor(cloud.fileHeight/cloud.numFramesY);
    cloud.canvas = document.createElement("canvas");
    cloud.ctx = cloud.canvas.getContext("2d");
    cloud.canvas.width = cloud.printedWidth;
    cloud.canvas.height = cloud.printedHeight;
    container.append(cloud.canvas);
    cloud.canvas.classList.add("cloud");
    cloud.canvas.style.top = Math.round((Math.random()/6+0.05)*100) + "%";
    cloud.ctx.drawImage(cloud.image,0,cloud.index*cloud.frameHeight,cloud.frameWidth , cloud.frameHeight, 0, 0, cloud.printedWidth, cloud.printedHeight);
    setTimeout(() => {
       cloud.canvas.remove();
       cloud = null;
}, 120000);
  }
  this.init();
}
  
var check = 0;
//animations.push(happyFace);

function AnimatedSprite(src, frameLengths, printedWidth, printedHeight, drawPeriod, ctx, followElement, animType, x, y, speedX, speedY, startFrameX, startFrameY, animDirection, customFunction){

  var getSize = function(animation){
    animation.fileWidth = animation.image.naturalWidth;// || 400;
    animation.fileHeight = animation.image.naturalHeight;// || 160;
    animation.frameWidth = Math.floor(animation.fileWidth/animation.maxWidth);
    animation.frameHeight = Math.floor(animation.fileHeight/animation.maxHeight);

  }
  this.init = function(){
    this.image = new Image;
    this.image.src = src;  
    this.minX = 0;
    this.frameLengths = frameLengths;
    this.maxWidth =Math.max.apply(null,frameLengths);
    this.maxHeight = frameLengths.length;
    this.printedWidth = printedWidth;
    this.printedHeight = printedHeight;
    this.startFrameX = startFrameX;
    this.animFrameX = startFrameX;
    this.animDirectionX = animDirection;
    this.startFrameY = startFrameY;
    this.animFrameY = startFrameY;
    this.animDirectionY = 0;
    this.lastDraw = Date.now();
    this.drawPeriod = drawPeriod;
    this.animType = animType;
    this.customFunction = customFunction;
    this.followElement = followElement;
    this.speedX = speedX;
    this.speedY = speedY;
    this.redundant = false;
    if (ctx === "self"){
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.printedWidth;
      this.canvas.height = this.printedHeight;
      this.ctx = "self";
      this.canvas.classList.add("animatedSprite");
      this.canvas.style.left = x + "px";
      this.canvas.style.top = y + "px";
      this.x = 0;
      this.y = 0;
    }
    else{
      this.ctx = ctx;
      this.x = x;
      this.y = y;
    }
    var that = this;
    this.image.onload = function(){getSize(that);}
  }
  this.init();
  
  this.setFollowElement = function(inputFollowElement){
    this.init();
    this.followElement = inputFollowElement;
    if(this.ctx === "self"){
      this.ctx = this.canvas.getContext("2d");
      inputFollowElement.append(this.canvas);
    }
  }

  this.animate = function(){
    if(this.customFunction){
      this.customFunction(this);
    }
    if(Date.now() - this.lastDraw > this.drawPeriod){
      //console.log("id: ", this.maxWidth, "// animFRame: ", this.animFrameX);
      this.ctx.clearRect(this.x,this.y,this.printedWidth,this.printedHeight); 
      this.x += this.speedX;
        this.y += this.speedY; 
      
      this.ctx.drawImage(this.image,this.animFrameX*this.frameWidth,this.animFrameY*this.frameHeight,this.frameWidth , this.frameHeight, this.x, this.y, this.printedWidth, this.printedHeight);
      //console.log("animFrameX: ", this.animFrameX);
      switch(this.animType){

         case "backAndForth": 
         // if(this.animFrameX === this.frameLengths[this.animFrameY]-1 || this.animFrameX === this.minX){this.animDirectionX = this.animDirectionX*-1;}
         if(this.animFrameX >= this.frameLengths[this.animFrameY]-1){this.animDirectionX = -1;}
         else if(this.animFrameX <= this.minX){this.animDirectionX = 1;}
          this.animFrameX = this.animFrameX + this.animDirectionX;
          break;

         case "static": 
          this.animFrameX = this.startFrameX;
          break;

         case "cycle":
          if(this.animFrameX >= this.frameLengths[this.animFrameY]-1 || this.animFrameX < 0){
            this.animFrameX = 0;
            this.animDirectionX = 1;
          }
          else{this.animFrameX = this.animFrameX + this.animDirectionX;}
          break;
      }  
      
      this.lastDraw = Date.now();
      if(this.x + this.printedWidth < 0){
        this.redundant = true;
      }
      if(this.redundant === true){
        this.ctx.clearRect(this.x,this.y,this.printedWidth,this.printedHeight); 
        this.canvas.remove();
        console.log("canvas removed");
      }
    }
  }
  this.delete = function(){
    this.ctx.clearRect(this.x,this.y,this.printedWidth,this.printedHeight); 
  }
}



//init these variables at start of level
var obstacleIndex = 0;
var obstacleLengthCount = 0;
var pixTraverse = 0;
var targetIndex = "none";
var targetHeight = groundHeight*stepSize;
var prevTargetHeight = targetHeight;
var lastAnim = Date.now();
var activeObstacles = [];
var startPos = false;
var obstacles; 
var agentMoving = true;
var levelStartTime;
var mistakes = 0;
var agentBottom;
var prevAgentBottom;
var timeLeft = 0;
var mistakeStartTime = 0;
var mistakeTime = 0;
var mistakeActive = false;
var lastMistakeHeight = "none";
var prevTargetIndex = "none";
var lastCloud = Date.now();

var container = document.querySelector("#container");

var levelSelector = document.createElement("select");
levelSelector.classList.add("levelSelector");
levelSelector.style.bottom = stepSize * (range -1) + "px";
//levelSelector.style.height = stepSize + "px";
levelSelector.style.fontSize = stepSize - 2 + "px";
container.append(levelSelector);

startScreen();

function startScreen(){
  clickedHelp();
}

function help(){
  pointerContainer.style.display = "none";
  okButton.innerHTML = "OK";
  noteDiv.style.display = "none";
 /* if(helpStage === "start"){
    words.innerText = "Sing the correct pitch to get your character onto the landscape";
    helpStage = "pitch";
  }*/
  if(helpStage === "pitch"){
    agent.style.zIndex = "10";
    words.innerHTML = '<h1>Hello, I am OM the ear training monk</h1><span>Control my height with the pitch of your voice. When my feet touch the ground I can continue my journey towards harmonic enlightenment</span><br><span class = "footnote">This game is not yet finished but in the play testing stage. (Sorry, it may also not work correctly on a cell phone)</span>';
    helpStage = "keyChange";
  }
  else if(helpStage === "keyChange"){
    words.innerText = "If the default key is uncomfortable to sing, you can change it on the left";
    helpStage = "levelChange";
    pointerContainer.style.display = "block";
    pointerContainer.classList.add("pointToKey");
  }
  else if(helpStage === "levelChange"){
    words.innerText = "Choose landscapes at the top right";
    helpStage = "are you ready";
    pointerContainer.style.display = "block";
    pointerContainer.classList.add("pointToLevels");
    pointerContainer.classList.remove("pointToKey");
  }
  else if(helpStage === "tryAgain"){
    words.innerText = "Sorry To many mistakes! Try Again";
    helpStage = "play";
    okButton.innerHTML = "play";
  }
  else if(helpStage === "newLevel"){
    agent.style.zIndex = "256";
    if(levelIndex < levels.length-1){//game not clocked
      levels[levelIndex + 1].unlocked = true;
      setLevel(levelIndex + 1); 
      words.innerText = "Well Done! You have unlocked the next level";
      helpStage = "are you ready";
      okButton.innerHTML = "play";
    }
    else{
      setLevel(0); 
      words.innerText = "Well Done! You have finished the game.";
      helpStage = "are you ready";
      okButton.innerHTML = "play again";
    }    
  }
  else if(helpStage === "are you ready"){
    agent.style.zIndex = "10";
    if(midGame === false){
      if(levelIndex > 1){showNextAdd();}//set When adds start
      words.innerText = levels[levelIndex].info;//"Are you ready to play?";
      okButton.innerHTML = "play";
      helpStage = "play";
      pointerContainer.classList.remove("pointToLevels");
      pointerContainer.style.display = "none";
    }
    else if(midGame === true){
      words.innerText = "Continue playing?";
      okButton.innerHTML = "Continue playing";
      helpStage = "continuePlaying";
      pointerContainer.classList.remove("pointToLevels");
      pointerContainer.style.display = "none";
    }
  }
  else if(helpStage === "play"){
    helpStage = "are you ready";
    paused = false;
    startLevel();
  }
  else if(helpStage === "continuePlaying"){
    helpStage = "are you ready";
    paused = false;
    animate();
    wordsDiv.style.display = "none";
  }
}


function clickedHelp(){
  paused = true;
  wordsDiv.style.display = "block";
  helpStage = "pitch";
  help();
}

animations.push(monk);


function startLevel(){
  //visitorAlert();only in apps script
  startTarget.style.display = "block";
  monk.animType = "backAndForth";
  monk.animFrameY = 2;
  monk.animFrameX = 0;
  monk.animDirectionX = 1;
  for(var i = 1; i< animations.length; i++){
    animations[i].redundant = true;
  }
  //animations.push(monk);
  midGame = true;
  paused = false;
  pointerContainer.style.display = "none";
  agent.style.bottom = agentStartHeight;
  agentBottom = parseInt(agent.style.bottom);
  targetHeight = groundHeight*stepSize;
  prevTargetHeight = targetHeight;
  noteDiv.style.display = "none";
  wordsDiv.style.display = "none";
  levelSelector.classList.add("largeToSmall");
  setTimeout(()=>{
    noteDiv.style.display = "block";
    noteDiv.classList.add("blink");
    levelSelector.classList.remove("largeToSmall");
  },2500);
  setTimeout(()=>{
    noteDiv.classList.remove("blink");
  },3000)
  timeLeft = levels[levelIndex].passTime;
  mistakeStartTime = 0;
  for(var i = 0; i<activeObstacles.length; i++){activeObstacles[i].div.remove()}
  
  prevAgentBottom = agentBottom;
  agentMoving = true;
  obstacleIndex = 0;
  obstacleLengthCount = 0;
  pixTraverse = 0;
  targetIndex = "none";
  
  lastAnim = Date.now();
  activeObstacles = [];
  startPos = false;
  obstacles = levels[levelIndex].obstacles; 
  while(startPos === false){traverse();}
  levelStartTime = Date.now();
  mistakes = 0;
  mistakeTime = 0;
  mistakeActive = false;
  lastMistakeHeight = "none";
  animate();
  if(Date.now() - lastCloud > 5000 || levelIndex === 0){
    new Cloud(Math.round(Math.random()*2));
  lastCloud = Date.now();
  } 
}

function getNoteName(keyNumber){
  for(const noteName in notes){
    //console.log(notes[noteName]);
    if(notes[noteName].key === keyNumber){
      return noteName;
      break
    }
  }
}


function rootKeyPlus(){
  rootKey ++;
  keyDisplay.innerHTML = getNoteName(rootKey);
  playRootNote();
}

function rootKeyMinus(){
  rootKey --;
  keyDisplay.innerHTML = getNoteName(rootKey);
  playRootNote();
}

function playRootNote(){
  var noteName = getNoteName(rootKey);
  var freq = notes[noteName].freq;//[freq];
  //keyDisplay.innerHTML = freq;
  console.log("freq: ", freq);
  playNote(freq);
}

var pianoWave = {"real":[0,0,-0.203569,0.5,-0.401676,0.137128,-0.104117,0.115965,-0.004413,0.067884,-0.00888,0.0793,-0.038756,0.011882,-0.030883,0.027608,-0.013429,0.00393,-0.014029,0.00972,-0.007653,0.007866,-0.032029,0.046127,-0.024155,0.023095,-0.005522,0.004511,-0.003593,0.011248,-0.004919,0.008505,-0.00292,0.00152,-0.005641,0.002615,-0.001866,0.001316,-0.00032,0.0008,-0.000957,0.001989,-0.001172,0.001682,-0.00262,0.000544,-0.000734,0.000186,-0.000363,0.000243,-0.000142,0.000437,-0.00086,0.000117,-0.00035,0.00011,-0.000253,0.000218,-0.000061,0.000015,-0.000038,0.000017,-0.000025,0.000007,-0.000081,0.000017,-0.000064,0.000166,-0.000009,0.000013,-0.000024,0.000001,-0.000032,0.000013,-0.000018,0.000007,-0.000013,0.00001,-0.000023,0.000008,-0.000025,0.000046,-0.000035,0.000006,-0.000012,0.000012,-0.000024,0.000023,-0.000024,0.000027,-0.00001,0.000022,-0.000011,0.000021,-0.000007,0.000011,-0.000006,0.000021,-0.000014,0.000026,-0.000013,0.000003,-0.000032,0.000033,-0.000036,0.000025,-0.00002,0.000026,-0.00005,0.000028,-0.000013,0.000008,-0.000018,0.00002,-0.000086,0.00012,-0.000005,0.000012,-0.000016,0.000028,-0.000012,0.000006,-0.000015,0.000012,-0.000022,0.000012,-0.000023,0.000024,-0.000011,0.000022,-0.000009,0.000018,-0.000019,0.000013,-0.000042,0.000015,-0.000019,0.000014,-0.000019,0.000007,-0.000008,0.00003,-0.000011,0.000011,-0.000012,0.000022,-0.000007,0.000018,-0.000028,0.000025,-0.00002,0.000008,-0.000032,0.000022,-0.00001,0.000013,-0.000026,0.000013,-0.000024,0.000009,-0.000107,0.000109,-0.000007,0.000014,-0.000015,0.000007,-0.000029,0.000045,-0.000023,0.000039,-0.00001,0.000029,-0.000008,0.000036,-0.000018,0.000007,-0.000007,0.000007,-0.000025,0.00001,-0.000006,0.000022,-0.000021,0.000007,-0.000018,0.000011,-0.000011,0.00001,-0.000015,0.00002,-0.000012,0.000004,-0.000005,0.000007,-0.000007,0.000003,-0.000001,0.000006,-0.000007,0.000018,-0.000002,0.000005,-0.000008,0.000006,-0.00001,0.000016,-0.00001,0.000021,-0.000011,0.000013,-0.000011,0.000005,-0.000006,0.000016,-0.000014,0.000014,-0.000009,0.000009,-0.000004,0.000013,-0.000015,0.000004,-0.000007,0.000007,-0.000004,0.000004,-0.000009,0.00001,-0.000008,0.000013,-0.000012,0.000001,-0.000003,0.000012,-0.000004,0.000004,-0.000007,0.000008,-0.00001,0.000013,-0.000015,0.000013,-0.00001,0.000012,-0.000008,0.000011,-0.000024,0.000008,-0.000013,0.000013,-0.000018,0.000005,-0.000022,0.000037,-0.000019,0.000027,-0.000022,0.000026,-0.000029,0.000029,-0.000029,0.000031,-0.000034,0.000032,-0.000031,0.000037,-0.000033,0.000038,-0.000038,0.000039,-0.000036,0.000035,-0.000038,0.000035,-0.000034,0.000033,-0.00003,0.000029,-0.000028,0.000025,-0.000023,0.000022,-0.00002,0.000018,-0.000017,0.000015,-0.000014,0.000013,-0.000012,0.000011,-0.000011,0.00001,-0.000009,0.000009,-0.000009,0.000008,-0.000008,0.000008,-0.000008,0.000007,-0.000007,0.000007,-0.000007,0.000006,-0.000006,0.000006,-0.000006,0.000006,-0.000005,0.000006,-0.000006,0.000005,-0.000005,0.000005,-0.000005,0.000005,-0.000005,0.000005,-0.000005,0.000004,-0.000004,0.000004,-0.000005,0.000004,-0.000004,0.000004,-0.000004,0.000004,-0.000004,0.000004,-0.000004,0.000004,-0.000003,0.000004,-0.000004,0.000003,-0.000003,0.000003,-0.000004,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000002,0.000003,-0.000003,0.000003,-0.000002,0.000003,-0.000003,0.000002,-0.000002,0.000002,-0.000003,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000001,0.000002,-0.000002,0.000002,-0.000001,0.000002,-0.000002,0.000002,-0.000001,0.000002,-0.000002,0.000001,-0.000001,0.000002,-0.000002,0.000001,-0.000001,0.000001,-0.000002,0.000001,-0.000001,0.000001,-0.000002,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0,0,0.000001,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"imag":[0,0.147621,-0.000001,0.000007,-0.00001,0.000005,-0.000006,0.000009,0,0.000008,-0.000001,0.000014,-0.000008,0.000003,-0.000009,0.000009,-0.000005,0.000002,-0.000007,0.000005,-0.000005,0.000005,-0.000023,0.000037,-0.000021,0.000022,-0.000006,0.000005,-0.000004,0.000014,-0.000007,0.000012,-0.000004,0.000002,-0.00001,0.000005,-0.000004,0.000003,-0.000001,0.000002,-0.000002,0.000005,-0.000003,0.000005,-0.000008,0.000002,-0.000002,0.000001,-0.000001,0.000001,-0.000001,0.000002,-0.000003,0,-0.000002,0,-0.000001,0.000001,0,0,0,0,0,0,0,0,0,0.000001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.000001,-0.000001,0,0,0,-0.000001,0,0,0,0,0,-0.000002,0.000002,0,0,0,0.000001,0,0,0,0,0,0,-0.000001,0.000001,0,0.000001,0,0,-0.000001,0,-0.000001,0,-0.000001,0,-0.000001,0,0,0.000001,0,0,0,0.000001,0,0.000001,-0.000001,0.000001,-0.000001,0,-0.000001,0.000001,0,0,-0.000001,0,-0.000001,0,-0.000004,0.000004,0,0.000001,-0.000001,0,-0.000001,0.000002,-0.000001,0.000002,0,0.000001,0,0.000002,-0.000001,0,0,0,-0.000001,0,0,0.000001,-0.000001,0,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0,0,0,0,0,0,0,0,0.000001,0,0,0,0,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0,0,0.000001,-0.000001,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0,-0.000001,0,0,0,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0,0,0.000001,0,0,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000002,0.000001,-0.000001,0.000001,-0.000002,0,-0.000002,0.000004,-0.000002,0.000003,-0.000002,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000004,-0.000004,0.000004,-0.000004,0.000004,-0.000004,0.000004,-0.000004,0.000004,-0.000004,0.000004,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000003,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0.000001,0,0.000001,-0.000001,0,0,0.000001,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
var hornWave = {"real":[0,0.4,0.4,1,1,1,0.3,0.7,0.6,0.5,0.9,0.8]};
var ethnicWave = {"real":[0,-0.867611,0.328068,0.139449,0.063681,-0.180347,-0.107318,0.02568,-0.195668,-0.162557,-0.17598,0.121916,0.024771,-0.097123,0.062144,-0.005063,-0.151144,-0.358389,-0.016781,-0.028287,0.014708,0.066692,-0.005924,-0.024762,0.007058,-0.021288,-0.015686,-0.0104,0.002762,0.006183,-0.004794,0.00689,0.006268,-0.015178,-0.015342,-0.072055,0.035109,0.00109,0.010667,-0.001808,-0.002684,-0.006622,0.013941,0.011645,-0.005769,-0.003513,-0.015747,-0.004779,0.008298,0.000533,-0.002409,-0.002894,0.003932,0.04675,-0.016478,0.003333,-0.004184,-0.000497,0.003726,0.002107,-0.007549,0.003077,-0.006366,-0.00022,-0.002142,0.00021,-0.003421,-0.004822,-0.001397,-0.00046,0.002735,-0.002267,-0.00142,-0.001985,-0.011486,-0.002439,-0.001589,0.024558,0.001752,-0.001668,-0.000005,0.001741,0.00131,0.000778,-0.001206,0.002049,0.000503,-0.001847,0.003654,-0.000961,0.006906,0.000515,-0.00021,-0.000792,-0.000095,-0.0021,0.000327,-0.000608,0.003331,-0.000441,-0.000576,0.001806,0.000094,0.000112,-0.000114,0.000368,0.00035,-0.000563,-0.000773,0.002585,-0.000974,0.000508,0.000779,-0.000553,0.000914,-0.001332,0.000314,0.000624,-0.000659,-0.000096,0.00083,-0.000233,-0.000603,0.000491,0.000011,-0.000979,-0.000926,0.000202,0.000639,0.000108,-0.000108,-0.000706,0.000346,-0.000127,-0.000335,0.000294,-0.000149,0.000022,-0.000158,0.000208,-0.000403,0.000272,0.000302,0.000454,-0.000678,-0.000637,0.000087,-0.000065,0.000065,0.000015,-0.000081,0.000089,0.000132,0.000023,-0.000005,-0.000019,0.000102,-0.000059,0.00009,0.000098,0.000064,-0.000091,-0.000024,0.000182,0.000091,-0.000137,-0.000021,-0.000177,0.000501,0.000633,-0.00037,-0.000246,-0.000409,0.000465,0.000281,0.000314,-0.000022,0.000063,-0.000269,0.000096,0.000148,-0.000145,0.000412,0.000271,0.000037,-0.000383,-0.000325,0.00024,0.000458,0.000262,0.000062,0.000096,0.000072,-0.000157,0.000119,0.00042,-0.000315,-0.000194,0.000142,-0.0002,0.000103,-0.000173,-0.000146,0.000473,-0.000524,0.000095,-0.000011,-0.000211,-0.00018,-0.00011,-0.00001,0.000096,-0.000415,0.000133,0.000059,-0.000607,0.000038,-0.000013,0.000528,-0.000041,0.000077,-0.000129,-0.000129,-0.001255,-0.000036,-0.000448,0.000186,-0.00005,-0.000227,0.000304,0.000013,0.000031,-0.00015,-0.000039,0.000266,0.000264,-0.002439,-0.000403,0.000043,0.000553,0.00034,0.000281,0.000199,-0.000229,-0.000106,0.00034,0.000287,0.000334,-0.000132,-0.000013,-0.000034,0.000253,-0.000918,0.000816,-0.000477,-0.001332,-0.000369,0.000314,-0.000629,0.001364,-0.001412,-0.001414,-0.000947,0.001043,0.00069,-0.00145,0.001128,0.001508,0.000425,0.000497,-0.001362,-0.000767,0.000968,0.000892,0.000883,-0.001317,0.001587,-0.001788,0.00213,0.00108,0.002059,0.001364,-0.002122,-0.001687,0.001852,0.002171,0.002003,-0.000353,0.00201,0.00269,0.002175,0.002046,-0.00005,0.001711,0.001021,-0.001577,0.002725,0.002176,0.002361,-0.002857,0.002776,0.000838,-0.002115,0.002408,0.002769,0.000293,0.002835,-0.001176,0.001161,0.001226,-0.001721,-0.001767,-0.001729,-0.002033,-0.003013,-0.002362,-0.002609,-0.002523,-0.002859,-0.00271,-0.002879,-0.002929,-0.002871,-0.002907,-0.002991,-0.003175,-0.003095,-0.0031,-0.003163,-0.003156,-0.003057,-0.003047,-0.003127,-0.003127,-0.003016,-0.003001,-0.003095,-0.003104,-0.00298,-0.002959,-0.003066,-0.003083,-0.002946,-0.003105,-0.003231,-0.003257,-0.0031,-0.003064,-0.003207,-0.003238,-0.00307,-0.00303,-0.003182,-0.003222,-0.003037,-0.002994,-0.003259,-0.003304,-0.003108,-0.003054,-0.003237,-0.003288,-0.003079,-0.003023,-0.00322,-0.003272,-0.003055,-0.002989,-0.003197,-0.003257,-0.003029,-0.002966,-0.003178,-0.003242,-0.003198,-0.003122,-0.00336,-0.003434,-0.003175,-0.003094,-0.003343,-0.003419,-0.003151,-0.003072,-0.003324,-0.003406,-0.003133,-0.003044,-0.003311,-0.003396,-0.003114,-0.00302,-0.003292,-0.003381,-0.003088,-0.003,-0.003275,-0.003366,-0.003072,-0.00298,-0.003261,-0.003354,-0.003148,-0.003052,-0.003346,-0.003448,-0.003122,-0.003026,-0.003331,-0.003434,-0.003116,-0.003012,-0.003317,-0.00342,-0.003091,-0.002992,-0.003302,-0.003409,-0.003077,-0.002969,-0.003292,-0.003397,-0.003059,-0.002952,-0.003271,-0.003384,-0.003046,-0.002936,-0.003262,-0.003373,-0.003036,-0.002915,-0.003248,-0.003362,-0.003018,-0.002899,-0.003237,-0.003349,-0.003009,-0.002798,-0.003126,-0.003239,-0.002904,-0.002782,-0.003113,-0.003226,-0.002888,-0.002769,-0.003102,-0.003217,-0.002878,-0.002754,-0.002996,-0.003107,-0.002776,-0.002658,-0.002988,-0.003098,-0.002767,-0.002643,-0.002976,-0.003087,-0.002754,-0.002629,-0.002967,-0.003078,-0.002745,-0.002622,-0.002954,-0.003065,-0.002734,-0.002613,-0.002943,-0.003056,-0.002723,-0.0026,-0.002933,-0.003047,-0.002714,-0.002585,-0.002922,-0.003036,-0.002706,-0.002575,-0.002914,-0.003025,-0.002697,-0.002565,-0.002905,-0.003016,-0.002683,-0.002552,-0.002897,-0.003006,-0.002674,-0.002547,-0.002884,-0.002996,-0.002662,-0.002536,-0.002873,-0.002985,-0.002651,-0.002526,-0.002867,-0.002977,-0.002667,-0.002511,-0.002857,-0.002966,-0.002643,-0.002507,-0.002845,-0.002958,-0.002627,-0.002494,-0.002841,-0.002949,-0.002633,-0.002486,-0.002831,-0.002937,-0.002619,-0.002477,-0.00282,-0.002928,-0.002612,-0.002467,-0.002812,-0.00292,-0.002599,-0.00246,-0.002803,-0.002912,-0.002589,-0.002453,-0.002792,-0.002902,-0.002585,-0.002444,-0.002786,-0.002892,-0.002575,-0.002434,-0.002775,-0.002883,-0.002574,-0.002421,-0.002771,-0.002873,-0.002564,-0.002418,-0.002756,-0.002864,-0.002553,-0.002408,-0.00275,-0.002855,-0.002551,-0.002399,-0.002742,-0.002847,-0.002548,-0.002389,-0.002738,-0.002836,-0.002537,-0.002385,-0.002726,-0.002827,-0.002531,-0.002378,-0.00272,-0.002819,-0.002517,-0.002373,-0.002628,-0.002726,-0.002439,-0.002287,-0.002621,-0.002717,-0.002429,-0.002286,-0.002614,-0.002709,-0.002427,-0.002274,-0.002608,-0.002701,-0.002417,-0.002272,-0.002601,-0.002691,-0.002416,-0.002263,-0.002593,-0.002683,-0.002418,-0.00227,-0.002583,-0.002675,-0.002403,-0.002256,-0.002572,-0.002668,-0.002394,-0.002246,-0.002567,-0.002658,-0.002403,-0.002241,-0.002558,-0.002651,-0.002379,-0.002239,-0.002555,-0.002643,-0.002392,-0.002234,-0.002549,-0.002634,-0.002374,-0.002226,-0.002548,-0.002627,-0.002375,-0.002214,-0.00254,-0.002619,-0.002359,-0.002217,-0.002525,-0.002612,-0.002356,-0.002213,-0.002522,-0.002604,-0.002348,-0.002193,-0.002504,-0.002596,-0.002352,-0.002193,-0.002509,-0.002587,-0.002342,-0.002187,-0.002496,-0.002582,-0.002339,-0.002182,-0.00249,-0.002572,-0.002359,-0.002179,-0.002492,-0.002566,-0.002329,-0.002175,-0.00249,-0.002558,-0.002402,-0.002145,-0.002496,-0.00255,-0.002331,-0.002077,-0.002522,-0.002543,-0.002289,-0.002133,-0.002467,-0.002536,-0.002309,-0.002171,-0.002461,-0.002528,-0.002412,-0.002071,-0.002442,-0.002521,-0.002419,-0.0022,-0.002458,-0.002514,-0.002298,-0.002139,-0.002434,-0.002507,-0.002131,-0.002135,-0.002436,-0.002499,-0.002288,-0.002131,-0.002427,-0.002492,-0.002303,-0.002122,-0.002422,-0.002485,-0.002281,-0.002105,-0.002415,-0.002478,-0.002278,-0.002106,-0.002407,-0.002471,-0.002263,-0.002118,-0.002403,-0.002464,-0.002268,-0.002102,-0.002395,-0.002457,-0.002257,-0.002082,-0.002385,-0.00245,-0.00224,-0.002097,-0.002383,-0.002443,-0.002198,-0.002099,-0.002375,-0.002437,-0.00224,-0.002077,-0.002371,-0.00243,-0.002237,-0.00208,-0.002361,-0.002422,-0.002238,-0.002061,-0.00236,-0.002416,-0.002234,-0.002063,-0.002353,-0.00241,-0.002224,-0.002057,-0.002353,-0.002403,-0.002212,-0.002073,-0.002345,-0.002397,-0.002205,-0.00205,-0.002337,-0.002391,-0.00221,-0.002055,-0.002332,-0.002385,-0.002221,-0.002038,-0.002327,-0.002378,-0.002218,-0.002042,-0.002321,-0.002372,-0.00221,-0.002029,-0.002317,-0.002365,-0.002202,-0.002047,-0.002313,-0.002357,-0.002186,-0.002024,-0.002305,-0.002353,-0.002178,-0.002041,-0.002298,-0.002345,-0.002187,-0.002022,-0.002298,-0.002341,-0.002193,-0.002012,-0.00229,-0.002334,-0.002193,-0.002015,-0.002284,-0.002327,-0.002152,-0.002008,-0.002278,-0.002321,-0.002168,-0.002001,-0.002277,-0.002316,-0.002165,-0.002002,-0.002271,-0.00231,-0.002161,-0.002002,-0.002268,-0.002303,-0.002156,-0.001992,-0.002261,-0.002298,-0.002153,-0.002003,-0.002254,-0.002294,-0.002163,-0.001985,-0.00225,-0.002286,-0.002158,-0.001987,-0.002244,-0.002281,-0.002139,-0.001968,-0.00224,-0.002274,-0.00214,-0.001969,-0.002234,-0.002267,-0.002136,-0.001968,-0.002227,-0.002263,-0.002129,-0.001962,-0.002226,-0.002257,-0.002135,-0.001963,-0.002221,-0.002251,-0.002128,-0.001957,-0.002215,-0.002247,-0.002125,-0.001956,-0.002211,-0.002242,-0.002113,-0.00195,-0.002206,-0.002234,-0.002113,-0.00195,-0.002202,-0.00223,-0.002112,-0.001951,-0.002196,-0.002223,-0.002111,-0.001945,-0.002193,-0.002219,-0.002102,-0.001922,-0.00219,-0.002212,-0.002097,-0.001932,-0.002183,-0.002208,-0.002091,-0.001928,-0.002178,-0.002202,-0.002093,-0.001922,-0.002175,-0.002199,-0.002082,-0.001911,-0.002168,-0.002192,-0.002085,-0.001917,-0.002167,-0.002186,-0.002074,-0.00193,-0.00216,-0.002182,-0.002075,-0.001908,-0.002156,-0.002177,-0.002072,-0.001914,-0.002151,-0.002174,-0.002076,-0.001902,-0.002148,-0.002169,-0.002066,-0.001901,-0.002144,-0.002162,-0.002071,-0.001886,-0.002139,-0.002156,-0.002061,-0.00191,-0.002137,-0.002151,-0.002054,-0.001895,-0.00213,-0.002148,-0.002043,-0.00189,-0.002129,-0.00214,-0.002042,-0.00189,-0.002123,-0.002136,-0.002049,-0.001883,-0.002122,-0.002132,-0.002045,-0.001879,-0.002115,-0.002127,-0.002054,-0.001882,-0.002111,-0.00212,-0.002048,-0.001875,-0.002104,-0.002117,-0.002047,-0.001873,-0.002101,-0.002113,-0.002036,-0.001882,-0.002096,-0.002108,-0.002035,-0.001868,-0.002095,-0.002101,-0.002026,-0.001863,-0.002092,-0.002099,-0.002018,-0.001863,-0.00209,-0.002094,-0.002016,-0.001862,-0.002081,-0.002086,-0.002016,-0.001849,-0.00208,-0.002084,-0.002009,-0.001857,-0.002076,-0.002079,-0.002011,-0.001837,-0.00207,-0.002072,-0.002009,-0.001852,-0.002065,-0.00207,-0.002011,-0.001844,-0.002064,-0.002067,-0.002003,-0.00184,-0.00206,-0.002064,-0.002003,-0.001813,-0.002055,-0.002054,-0.00199,-0.001822,-0.002048,-0.002053,-0.00199,-0.001821,-0.002047,-0.002043,-0.002,-0.001838,-0.002045,-0.002046,-0.001966,-0.001802,-0.002038,-0.002036,-0.001961,-0.001819,-0.002037,-0.002038,-0.001994,-0.001818,-0.002032,-0.002031,-0.002024,-0.001815,-0.002026,-0.002022,-0.001968,-0.001814,-0.002024,-0.002029,-0.001975,-0.001811,-0.002023,-0.002021,-0.001963,-0.001807,-0.002019,-0.002012,-0.001954,-0.001798,-0.001952,-0.001947,-0.001901,-0.001742,-0.00195,-0.001949,-0.001901,-0.001744,-0.001947,-0.001939,-0.001896,-0.001727,-0.001942,-0.001934,-0.001897,-0.001743,-0.001936,-0.001934,-0.001896,-0.001723,-0.001936,-0.001929,-0.001875,-0.001741,-0.001934,-0.001921,-0.001892,-0.001724,-0.001929,-0.001919,-0.001892,-0.001737,-0.001927,-0.001919,-0.001876,-0.001727,-0.001921,-0.001909,-0.001872,-0.00172,-0.001918,-0.001907,-0.001869,-0.001715,-0.001915,-0.001905,-0.001865,-0.001713,-0.001913,-0.001901,-0.001865,-0.001718,-0.00191,-0.001896,-0.001863,-0.001715,-0.001906,-0.001894,-0.001854,-0.001719,-0.001903,-0.001894,-0.001857,-0.001706,-0.001901,-0.001889,-0.001865,-0.001694,-0.001895,-0.001883,-0.001858,-0.001693,-0.001891,-0.001875,-0.001852,-0.001696,-0.001891,-0.001872,-0.001842,-0.001697,-0.001887,-0.001871,-0.001849,-0.00169,-0.001885,-0.001868,-0.001836,-0.001698,-0.001879,-0.001864,-0.001845,-0.001699,-0.001878,-0.001859,-0.001839,-0.001696,-0.001874,-0.001858,-0.001839,-0.00168,-0.001873,-0.001854,-0.001833,-0.00169,-0.001867,-0.001846,-0.001835,-0.001684,-0.001866,-0.001845,-0.001831,-0.00168,-0.001861,-0.001841,-0.001819,-0.001675,-0.00186,-0.001841,-0.001824,-0.001664,-0.001857,-0.00183,-0.00182,-0.001676,-0.001855,-0.001833,-0.001822,-0.001677,-0.001849,-0.001826,-0.001809,-0.00168,-0.001845,-0.001824,-0.001811,-0.001663,-0.001843,-0.00182,-0.001811,-0.001646,-0.001842,-0.001818,-0.001816,-0.001654,-0.001838,-0.001811,-0.001802,-0.001649,-0.001835,-0.001806,-0.001802,-0.001664,-0.001834,-0.001805,-0.001796,-0.00146,-0.001618,-0.001595,-0.001579,-0.001457,-0.001614,-0.001596,-0.001586,-0.001461,-0.001614,-0.001589,-0.001592,-0.001464,-0.001609,-0.001586,-0.001588,-0.001448,-0.001608,-0.00159,-0.001584,-0.001467,-0.001608,-0.001576,-0.001582,-0.001463,-0.001602,-0.00158,-0.001581,-0.001451,-0.001599,-0.001577,-0.00158,-0.001448,-0.001594,-0.001571,-0.001576,-0.001458,-0.001596,-0.001567,-0.001571,-0.001438,-0.001593,-0.001563,-0.001561,-0.001441,-0.001591,-0.00156,-0.001571,-0.001441,-0.00159,-0.001562,-0.001557,-0.001443,-0.001588,-0.001558,-0.00155,-0.001435,-0.001585,-0.001557,-0.001545,-0.001444,-0.001582,-0.00156,-0.001553,-0.001445,-0.001579,-0.001545,-0.001561,-0.001435,-0.00158,-0.001551,-0.001528,-0.00142,-0.001573,-0.001546,-0.001551,-0.001429,-0.001571,-0.001538,-0.001527,-0.001434,-0.001568,-0.001529,-0.001553,-0.001422,-0.001568,-0.001525,-0.001543,-0.001409,-0.001567,-0.001536,-0.00152,-0.001417,-0.001563,-0.001533,-0.001549,-0.00142,-0.00156,-0.001537,-0.001551,-0.001416,-0.001554,-0.00153,-0.001531,-0.001413,-0.001556,-0.001531,-0.001527,-0.001422,-0.001552,-0.001518,-0.001533,-0.001399,-0.001552,-0.001516,-0.001526,-0.001407,-0.001546,-0.001507,-0.001523,-0.001409,-0.001547,-0.001509,-0.00153,-0.001414,-0.001545,-0.001528,-0.001534,-0.001401,-0.001544,-0.001507,-0.001531,-0.001445,-0.00154,-0.001463,-0.001524,-0.001392,-0.001519,-0.001441,-0.00151,-0.001389,-0.00153,-0.001503,-0.001535,-0.001403,-0.001535,-0.001497,-0.001523,-0.001445,-0.00152,-0.001505,-0.001525,-0.001448,-0.001532,-0.001455,-0.001508,-0.001422,-0.001523,-0.001496,-0.001501,-0.001305,-0.001526,-0.001484,-0.001505,-0.001405,-0.001524,-0.00149,-0.001517,-0.001388,-0.001522,-0.001487,-0.001499,-0.001397,-0.001517,-0.001478,-0.001499,-0.001367,-0.001516,-0.00148,-0.001491,-0.0014,-0.001513,-0.001476,-0.001491,-0.001383,-0.001513,-0.001476,-0.001487,-0.001388,-0.001511,-0.001479,-0.001489,-0.00135,-0.001508,-0.001463,-0.001504,-0.001298,-0.001502,-0.00146,-0.001504,-0.001369,-0.001502,-0.001472,-0.001488,-0.001367,-0.0015,-0.001481,-0.001499,-0.001357,-0.001501,-0.001467,-0.001466,-0.001358,-0.001498,-0.001439,-0.001486,-0.001355,-0.001495,-0.00146,-0.001477,-0.00137,-0.001492,-0.001455,-0.001477,-0.001367,-0.001492,-0.001461,-0.001485,-0.001355,-0.001486,-0.001446,-0.00148,-0.001354,-0.001487,-0.001444,-0.001475,-0.001357,-0.001484,-0.001439,-0.00147,-0.001327,-0.001485,-0.001432,-0.001477,-0.00136,-0.00148,-0.001434,-0.001453,-0.001354,-0.001478,-0.001439,-0.001469,-0.001335,-0.00148,-0.001436,-0.001468,-0.001341,-0.001476,-0.001438,-0.001447,-0.001353,-0.001473,-0.001436,-0.001456,-0.001337,-0.001472,-0.001428,-0.001462,-0.001339,-0.001469,-0.001431,-0.001457,-0.00134,-0.001468,-0.001424,-0.001457,-0.00134,-0.001465,-0.001427,-0.001462,-0.001336,-0.001464,-0.001421,-0.001442,-0.001345,-0.00146,-0.001423,-0.001455,-0.001343,-0.001461,-0.001405,-0.001449,-0.001341,-0.001458,-0.001405,-0.001453,-0.001335,-0.001455,-0.00141,-0.001444,-0.001331,-0.001454,-0.00141,-0.001448,-0.001335,-0.001453,-0.001406,-0.001433,-0.001333,-0.001448,-0.001396,-0.001435,-0.001331,-0.001447,-0.001413,-0.001439,-0.001343,-0.001448,-0.001405,-0.00144,-0.001327,-0.001446,-0.001396,-0.001438,-0.001339,-0.001445,-0.001398,-0.001437,-0.001335,-0.001442,-0.001385,-0.001436,-0.001324,-0.001439,-0.001398,-0.001432,-0.001318,-0.001436,-0.001384,-0.001429,-0.001338,-0.001436,-0.001394,-0.001431,-0.0013,-0.001433,-0.001393,-0.001424,-0.00132,-0.00143,-0.001402,-0.001426,-0.001322,-0.00143,-0.001389,-0.001425,-0.001314,-0.001427,-0.001371,-0.00142,-0.00131,-0.001428,-0.001382,-0.001421,-0.001315,-0.001425,-0.001361,-0.00141,-0.001314,-0.001423,-0.001363,-0.001417,-0.001319,-0.001421,-0.001368,-0.001406,-0.001322,-0.00142,-0.00137,-0.001415,-0.001308,-0.001417,-0.001362,-0.001413,-0.0013,-0.001417,-0.001375,-0.001408,-0.001313,-0.001415,-0.00136,-0.001401,-0.001301,-0.001414,-0.001368,-0.00141,-0.001299,-0.001411,-0.00136,-0.001409,-0.001301,-0.001409,-0.001365,-0.001399,-0.001305,-0.001407,-0.001354,-0.001396,-0.001285,-0.001405,-0.001347,-0.00139,-0.001295,-0.001405,-0.00136,-0.001399,-0.001301,-0.001404,-0.001352,-0.001392,-0.00129,-0.001402,-0.001352,-0.001388,-0.001308,-0.001399,-0.001343,-0.001393,-0.001305,-0.001397,-0.001337,-0.001393,-0.001294,-0.001395,-0.001344,-0.001389,-0.001292,-0.001394,-0.001338,-0.001389,-0.001284,-0.001393,-0.001336,-0.001387,-0.001286,-0.00139,-0.001332,-0.001384,-0.001131,-0.001229,-0.001175,-0.001224,-0.001146,-0.001227,-0.001179,-0.001226,-0.001128,-0.001226,-0.001171,-0.001224,-0.001122,-0.001224,-0.001174,-0.001222,-0.001133,-0.001222,-0.001201,-0.001223,-0.001125,-0.00122,-0.001183,-0.001217,-0.001099,-0.001219,-0.001201,-0.001217,-0.001123,-0.001216,-0.001181,-0.001218,-0.001108,-0.001217,-0.001161,-0.001203,-0.001096,-0.001205,-0.001185,-0.001194,-0.001149,-0.0012,-0.001187,-0.001204,-0.001124,-0.001213,-0.001122,-0.001192,-0.001125,-0.001208,-0.00119,-0.001208,-0.001146,-0.001211,-0.001196,-0.001182,-0.001171,-0.001209,-0.001119,-0.001196,-0.001091,-0.001207,-0.001104,-0.001157,-0.001068,-0.001203,-0.001169,-0.001194,-0.001119,-0.001205,-0.001149,-0.001172,-0.001117,-0.001204,-0.001161,-0.001203,-0.001085,-0.001201,-0.001125,-0.001188,-0.00111,-0.001201,-0.001152,-0.001195,-0.001082,-0.001199,-0.001165,-0.001193,-0.001134,-0.001194,-0.00114,-0.001191,-0.001139,-0.001197,-0.001195,-0.001189,-0.001071,-0.001106,-0.00113,-0.001189,-0.001103,-0.001194,-0.00113,-0.001193,-0.001133,-0.001193,-0.001144,-0.001174,-0.001141,-0.001191,-0.00104,-0.001187,-0.00109,-0.001189,-0.00116,-0.001189,-0.001124,-0.001187,-0.001079,-0.001179,-0.001127,-0.001187,-0.001131,-0.001185,-0.001083,-0.001186,-0.001123,-0.00117,-0.001102,-0.001183,-0.001141,-0.001183,-0.001111,-0.001183,-0.001098,-0.001126,-0.001118,-0.001182,-0.001137,-0.001182,-0.001105,-0.001179,-0.001147,-0.001177,-0.001113,-0.001176,-0.001136,-0.001165,-0.001086,-0.001177,-0.001121,-0.001176,-0.001056,-0.001176,-0.001165,-0.001176,-0.001105,-0.001173,-0.001138,-0.00117,-0.001104,-0.001174,-0.001095,-0.001164,-0.00109,-0.001171,-0.001146,-0.001158,-0.001097,-0.001151,-0.001119,-0.00117,-0.0011,-0.00117,-0.001065,-0.001165,-0.001104,-0.001168,-0.00115,-0.001162,-0.001116,-0.001167,-0.001149,-0.001167,-0.001107,-0.001167,-0.001091,-0.001161,-0.001106,-0.001165,-0.001088,-0.001116,-0.001048,-0.001164,-0.001084,-0.001161,-0.00107,-0.001161,-0.001083,-0.001132,-0.001073,-0.00109,-0.00107,-0.001149,-0.001057,-0.001158,-0.001109,-0.001149,-0.001086,-0.001158,-0.001097,-0.00115,-0.001035,-0.001158,-0.001099,-0.001155,-0.0011,-0.001155,-0.00112,-0.001155,-0.001108,-0.001154,-0.001155,-0.001154,-0.001082,-0.001123,-0.00109,-0.001144,-0.001068,-0.001151,-0.001078,-0.001141,-0.001094,-0.001149,-0.001114,-0.001147,-0.001081,-0.001151,-0.000999,-0.00113,-0.001032,-0.001144,-0.001129,-0.001145,-0.001076,-0.001147,-0.001053,-0.00114,-0.001107,-0.001147,-0.001076,-0.001146,-0.00106,-0.001144,-0.001097,-0.00114,-0.001084,-0.001144,-0.001093,-0.000957,-0.001133,-0.001142,-0.001059,-0.001117,-0.001049,-0.00114,-0.001051,-0.001139,-0.001089,-0.001138,-0.0011,-0.00111,-0.001087,-0.001139,-0.0011,-0.001139,-0.001057,-0.001136,-0.001061,-0.001034,-0.000961,-0.001137,-0.001124,-0.001131,-0.001084,-0.001134,-0.001062,-0.001047,-0.001055,-0.001132,-0.001105,-0.001134,-0.001085,-0.001134,-0.001076,-0.001133,-0.001064,-0.001131,-0.000883,-0.001132,-0.001114,-0.00113,-0.001066,-0.001131,-0.001059,-0.00113,-0.001078,-0.001128,-0.00103,-0.001095,-0.001017,-0.001094,-0.001082,-0.001094,-0.001053,-0.001093,-0.001033,-0.001093,-0.001053,-0.00109,-0.001044,-0.001091,-0.001002,-0.001082,-0.00105,-0.001091,-0.00103,-0.00109,-0.001,-0.001086,-0.001011,-0.001088,-0.001025,-0.001088,-0.001037,-0.001088,-0.001,-0.001084,-0.000995,-0.001072,-0.00101,-0.001086,-0.001025,-0.001086,-0.000986,-0.001085,-0.001046,-0.001085,-0.00102,-0.00108,-0.000948,-0.001083,-0.001068,-0.001083,-0.001083,-0.001082,-0.001016,-0.001081,-0.000994,-0.001061,-0.001026,-0.001081,-0.001063,-0.001073,-0.001007,-0.001079,-0.001035,-0.001076,-0.000861,-0.001072,-0.00104,-0.001077,-0.000987,-0.001062,-0.001063,-0.001067,-0.001059,-0.001069,-0.000976,-0.001074,-0.001031,-0.001075,-0.001036,-0.001073,-0.001066,-0.001057,-0.000995,-0.000724,-0.001048,-0.001051,-0.000994,-0.001073,-0.001045,-0.001069,-0.001013,-0.001072,-0.001025],"imag":[0,-0.497243,0.018673,-0.020198,-0.017604,-0.430734,0.488347,-0.157997,-0.023562,0.260166,0.076547,0.124548,0.01569,0.070011,0.057046,-0.01783,-0.032054,0.083384,-0.011498,-0.047527,-0.003573,0.110977,-0.006572,0.006369,0.00763,0.001274,0.004114,-0.009236,0.000347,0.00093,0.004793,-0.003242,0.015217,0.037997,-0.00386,0.015361,0.014582,0.001194,0.005652,0.000463,-0.007904,-0.000293,0.00921,-0.013974,-0.006174,-0.006603,0.014409,0.003326,-0.004958,0.004583,0.00883,-0.009965,-0.002324,-0.037972,0.013709,0.005383,-0.005886,-0.002452,-0.000305,-0.002838,0.000542,-0.000667,0.002558,-0.000528,-0.003103,0.000582,0.001331,0.001201,0.005073,-0.002067,-0.000744,-0.002453,0.004466,0.008069,-0.009327,-0.001561,-0.006064,-0.002048,0.000781,-0.000858,-0.001096,0.000545,0.000719,0.000675,0.001862,0.00112,-0.00112,-0.00195,0.000839,-0.000938,-0.002301,-0.00161,-0.001311,-0.000934,-0.002205,0.001769,0.001188,-0.000577,-0.00041,-0.001239,0.001265,-0.001105,0.000534,0.000084,-0.001053,-0.000357,-0.000989,-0.001426,-0.000273,0.000981,0.000951,-0.000112,-0.000047,-0.000612,0.000828,-0.001537,0.000381,-0.000968,0.00064,0.000567,0.000455,-0.000374,-0.000633,0.00105,0.001184,-0.000106,-0.000103,-0.000525,-0.000327,-0.000055,0.000708,0.000173,-0.000066,0.000259,-0.000115,-0.00009,0.000234,-0.000299,0.000142,0.000701,0.000784,-0.00052,0.000193,-0.00052,0.00029,0.000448,-0.000103,-0.000102,-0.000335,0.000021,0.000142,0.000055,-0.000044,0.000113,0.000146,0.000098,0.000058,-0.000026,0.00001,0.000109,0.000077,0.000051,0.000039,0.000156,0.000058,-0.000233,-0.00017,-0.000126,-0.000047,-0.000045,-0.000231,0.000226,-0.000321,0.000305,0.000487,0.00006,-0.00032,0,-0.000052,-0.000099,0.000117,0.000026,-0.000122,0.000228,-0.000024,-0.000004,-0.000123,-0.000248,-0.000399,0.000292,0.000486,-0.000293,-0.000254,0.000197,0.000148,0.000095,-0.000256,0.000184,-0.000635,0.00038,-0.00015,0.000129,0.000024,0.000075,0.000548,0.000029,-0.000315,-0.000201,0.000002,-0.000206,0.000047,0.00015,-0.000116,0.000309,-0.000154,0.000334,-0.000049,0.000184,0.00023,-0.000446,-0.000186,-0.000176,-0.000149,0.000213,0.000029,0.000493,-0.00022,-0.000142,0.000205,0.00022,0.000266,0.000121,0.000077,-0.000119,-0.000065,0.000332,0.00124,-0.000203,-0.000139,-0.001462,0.000301,0.000314,-0.000219,-0.000098,-0.000252,0.000218,-0.000047,-0.000133,-0.000012,-0.000323,-0.000052,-0.000091,-0.000042,-0.000419,-0.000781,0.000569,-0.001397,-0.001408,0.001295,0.000453,-0.00025,0.000224,-0.00107,0.000972,0.001245,0.00057,-0.00107,0.000366,-0.00149,-0.001621,-0.001005,0.001505,-0.001444,-0.001488,-0.00149,0.001283,0.000922,0.001287,-0.000545,-0.001911,0.000747,0.00171,-0.000511,-0.001379,-0.001142,-0.000048,-0.00083,0.002135,0.000791,-0.001165,-0.001958,-0.002085,0.002916,0.002356,-0.002721,-0.002436,-0.000982,-0.001905,-0.001661,0.000379,0.000759,-0.002748,0.001937,-0.00155,-0.000709,-0.002839,-0.000282,-0.00259,-0.002592,-0.002557,-0.002248,-0.002205,-0.00223,-0.002452,-0.001017,-0.002122,-0.001801,-0.001912,-0.001346,-0.001617,-0.001279,-0.001147,-0.001273,-0.001177,-0.000927,-0.000984,-0.001199,-0.001172,-0.000972,-0.000978,-0.001241,-0.001251,-0.001019,-0.001005,-0.001287,-0.00131,-0.001055,-0.001013,-0.001321,-0.001356,-0.001078,-0.001015,-0.001352,-0.001484,-0.001168,-0.001078,-0.00146,-0.001522,-0.001178,-0.001073,-0.001477,-0.001546,-0.001189,-0.001062,-0.0015,-0.001575,-0.00123,-0.001086,-0.001551,-0.001645,-0.001233,-0.001075,-0.001565,-0.001662,-0.001223,-0.001063,-0.001572,-0.001684,-0.001233,-0.001049,-0.001581,-0.001688,-0.00123,-0.001033,-0.001683,-0.00181,-0.001304,-0.001079,-0.001686,-0.00182,-0.001296,-0.001065,-0.00169,-0.001822,-0.001293,-0.001043,-0.001686,-0.001831,-0.001277,-0.001011,-0.001681,-0.001836,-0.001274,-0.001001,-0.001692,-0.001835,-0.00127,-0.000987,-0.001684,-0.001835,-0.001257,-0.000967,-0.001736,-0.001891,-0.001289,-0.000969,-0.001746,-0.001899,-0.001281,-0.000955,-0.00172,-0.001889,-0.001269,-0.000939,-0.00173,-0.001889,-0.001258,-0.000917,-0.001721,-0.001894,-0.001239,-0.000897,-0.001718,-0.001889,-0.001246,-0.000882,-0.001708,-0.001884,-0.001225,-0.000859,-0.001693,-0.001886,-0.001216,-0.000834,-0.001692,-0.001882,-0.0012,-0.000822,-0.001676,-0.001818,-0.001154,-0.000767,-0.00162,-0.001815,-0.001147,-0.00076,-0.001617,-0.001807,-0.001135,-0.000731,-0.001605,-0.001803,-0.001092,-0.000704,-0.001555,-0.001743,-0.001072,-0.00068,-0.001543,-0.001741,-0.001065,-0.000664,-0.001538,-0.001736,-0.001051,-0.00064,-0.001526,-0.001722,-0.001047,-0.00064,-0.001518,-0.001713,-0.001039,-0.000614,-0.001511,-0.001709,-0.001027,-0.000595,-0.0015,-0.001708,-0.00102,-0.000581,-0.001488,-0.001699,-0.001004,-0.000572,-0.001478,-0.001691,-0.00099,-0.000553,-0.001478,-0.001689,-0.000976,-0.000538,-0.001469,-0.001674,-0.000977,-0.000526,-0.001466,-0.001669,-0.000969,-0.000519,-0.00146,-0.001661,-0.00095,-0.00049,-0.001405,-0.001663,-0.000943,-0.000485,-0.001425,-0.001647,-0.000943,-0.000461,-0.001429,-0.001646,-0.000916,-0.000446,-0.001395,-0.001637,-0.000911,-0.000446,-0.001396,-0.00163,-0.000908,-0.000429,-0.001386,-0.001626,-0.000897,-0.000412,-0.001386,-0.001615,-0.000889,-0.000382,-0.001381,-0.001605,-0.000887,-0.000375,-0.001367,-0.001601,-0.000869,-0.00037,-0.001362,-0.001596,-0.000867,-0.000361,-0.001342,-0.001596,-0.000846,-0.000356,-0.001337,-0.001581,-0.00086,-0.000336,-0.001335,-0.001578,-0.000843,-0.000324,-0.001318,-0.001573,-0.000833,-0.000302,-0.001301,-0.001569,-0.000811,-0.000312,-0.001301,-0.001557,-0.000816,-0.000307,-0.001291,-0.00155,-0.000803,-0.00029,-0.001296,-0.00154,-0.000778,-0.000255,-0.001239,-0.001497,-0.000769,-0.000249,-0.001238,-0.001482,-0.000758,-0.000234,-0.001221,-0.001483,-0.000746,-0.000226,-0.001221,-0.001469,-0.000736,-0.000236,-0.001203,-0.001467,-0.000731,-0.000221,-0.001179,-0.001439,-0.000736,-0.000213,-0.001188,-0.001444,-0.000741,-0.000186,-0.001188,-0.001444,-0.000726,-0.000201,-0.001148,-0.001435,-0.000726,-0.000173,-0.001178,-0.001422,-0.000704,-0.000168,-0.001131,-0.001415,-0.000696,-0.000176,-0.00115,-0.001412,-0.000666,-0.000158,-0.001127,-0.001415,-0.000663,-0.000151,-0.001143,-0.001394,-0.000688,-0.000128,-0.00113,-0.001384,-0.000668,-0.000123,-0.001127,-0.001402,-0.000703,-0.000108,-0.0011,-0.001387,-0.000651,-0.000131,-0.001103,-0.001381,-0.00067,-0.00006,-0.00109,-0.001374,-0.000661,-0.000103,-0.001025,-0.001363,-0.000623,-0.000063,-0.001075,-0.001356,-0.000598,-0.000078,-0.000877,-0.001389,-0.000535,-0.000065,-0.001032,-0.001474,-0.000342,-0.000065,-0.001105,-0.001379,-0.000598,0.000035,-0.001045,-0.001303,-0.00059,-0.000055,-0.000754,-0.001445,-0.000633,-0.00005,-0.000703,-0.001223,-0.000535,-0.000005,-0.001015,-0.001313,-0.000605,0.000008,-0.001316,-0.001306,-0.000568,-0.000028,-0.001002,-0.001299,-0.000573,-0.000018,-0.000947,-0.001301,-0.000565,0.000018,-0.000982,-0.001314,-0.000565,-0.000018,-0.000972,-0.001299,-0.000568,0.000005,-0.000987,-0.001266,-0.000552,0.000015,-0.000959,-0.001279,-0.000557,0.000025,-0.000967,-0.001299,-0.00057,0.000013,-0.000989,-0.001261,-0.00055,0.000062,-0.001065,-0.001244,-0.000554,0.000034,-0.000956,-0.001269,-0.000542,0.000049,-0.000945,-0.001251,-0.000554,0.000083,-0.000927,-0.001269,-0.000529,0.00007,-0.000919,-0.001254,-0.000534,0.000057,-0.000927,-0.001251,-0.000503,0.000075,-0.000938,-0.001212,-0.000508,0.000083,-0.000938,-0.001239,-0.000518,0.000073,-0.00091,-0.001217,-0.00051,0.00006,-0.000866,-0.001233,-0.000502,0.000073,-0.000858,-0.001215,-0.0005,0.000073,-0.00086,-0.001225,-0.000489,0.000093,-0.000863,-0.001182,-0.000482,0.00014,-0.000888,-0.00121,-0.000489,0.000104,-0.000891,-0.001168,-0.000492,0.000142,-0.000852,-0.00119,-0.000464,0.000101,-0.000822,-0.001194,-0.000472,0.000117,-0.000803,-0.001178,-0.000471,0.000145,-0.000893,-0.001179,-0.000474,0.000145,-0.000837,-0.001178,-0.000451,0.000127,-0.000829,-0.001166,-0.000451,0.000137,-0.000824,-0.001155,-0.000438,0.000153,-0.000821,-0.00116,-0.000443,0.000137,-0.000811,-0.00113,-0.000448,0.000124,-0.000769,-0.00115,-0.00044,0.000155,-0.000767,-0.001135,-0.00044,0.000145,-0.000803,-0.001157,-0.000435,0.000166,-0.000785,-0.001145,-0.000435,0.000184,-0.000779,-0.001137,-0.000445,0.000176,-0.000782,-0.001135,-0.000422,0.000184,-0.000751,-0.001124,-0.00042,0.000187,-0.000753,-0.001123,-0.000422,0.000174,-0.000746,-0.001114,-0.000417,0.000174,-0.000764,-0.001114,-0.000414,0.000205,-0.000748,-0.001103,-0.000409,0.000184,-0.000736,-0.001091,-0.000409,0.00021,-0.000723,-0.001091,-0.000396,0.000199,-0.000733,-0.001122,-0.000389,0.000215,-0.000733,-0.001093,-0.000396,0.00021,-0.000736,-0.001091,-0.000396,0.000212,-0.000712,-0.001091,-0.000383,0.000197,-0.00073,-0.0011,-0.000399,0.000218,-0.000707,-0.001079,-0.000372,0.000228,-0.000722,-0.001047,-0.000388,0.000218,-0.000707,-0.001076,-0.000379,0.000218,-0.0007,-0.001056,-0.000379,0.000205,-0.000672,-0.001067,-0.000372,0.000199,-0.000688,-0.00106,-0.000366,0.000228,-0.000658,-0.001076,-0.000369,0.000234,-0.000671,-0.001024,-0.000353,0.000241,-0.000677,-0.001041,-0.000366,0.000228,-0.000697,-0.00104,-0.00034,0.000257,-0.000684,-0.001032,-0.00035,0.000247,-0.000649,-0.001033,-0.000331,0.000247,-0.000648,-0.001031,-0.00034,0.000251,-0.000603,-0.001018,-0.000341,0.00027,-0.000607,-0.001021,-0.000356,0.000257,-0.000594,-0.001015,-0.000347,0.000254,-0.000616,-0.000989,-0.000347,0.000257,-0.000603,-0.001005,-0.000328,0.000276,-0.000617,-0.001005,-0.000315,0.00026,-0.00063,-0.000996,-0.000302,0.000267,-0.00062,-0.000989,-0.000331,0.000289,-0.000607,-0.001005,-0.000311,0.000276,-0.000613,-0.00098,-0.000308,0.00028,-0.000594,-0.001008,-0.000321,0.000302,-0.000584,-0.000972,-0.000324,0.000279,-0.000562,-0.000977,-0.000305,0.000273,-0.000575,-0.000976,-0.000302,0.000266,-0.000562,-0.001017,-0.000305,0.000308,-0.000591,-0.000991,-0.000327,0.000286,-0.000575,-0.000986,-0.000302,0.000324,-0.000523,-0.000945,-0.000289,0.000273,-0.000626,-0.001002,-0.000308,0.000318,-0.000629,-0.000964,-0.000289,0.000273,-0.000498,-0.000957,-0.000295,0.000299,-0.000337,-0.000954,-0.000308,0.000331,-0.000565,-0.000947,-0.000299,0.000254,-0.000527,-0.000944,-0.000276,0.000279,-0.000553,-0.000944,-0.000273,0.000318,-0.000571,-0.000953,-0.000283,0.000308,-0.00052,-0.000919,-0.000271,0.000274,-0.000505,-0.000906,-0.000268,0.000314,-0.000508,-0.000932,-0.000274,0.000321,-0.000492,-0.000893,-0.000286,0.000296,-0.000479,-0.000922,-0.000265,0.000302,-0.000542,-0.000881,-0.000249,0.00033,-0.000467,-0.000906,-0.000258,0.000321,-0.000452,-0.000872,-0.000252,0.000299,-0.000499,-0.000884,-0.000265,0.000339,-0.000501,-0.000891,-0.000265,0.000327,-0.000498,-0.000893,-0.000258,0.000318,-0.000498,-0.000888,-0.000243,0.000324,-0.000486,-0.000871,-0.000243,0.00033,-0.00048,-0.000869,-0.000246,0.000321,-0.000498,-0.000853,-0.00024,0.000297,-0.000476,-0.000872,-0.000232,0.00031,-0.000428,-0.000887,-0.000249,0.000323,-0.000441,-0.000882,-0.000253,0.000349,-0.000454,-0.00087,-0.000231,0.000349,-0.00048,-0.000859,-0.000232,0.000336,-0.000436,-0.000865,-0.000223,0.000332,-0.000475,-0.000842,-0.000245,0.000336,-0.000423,-0.000834,-0.000227,0.000345,-0.000437,-0.000833,-0.000231,0.000331,-0.000419,-0.000855,-0.000214,0.000336,-0.000432,-0.00083,-0.000231,0.000358,-0.000411,-0.000833,-0.000218,0.000349,-0.00041,-0.000834,-0.000227,0.000353,-0.000449,-0.000837,-0.00021,0.000336,-0.000414,-0.000852,-0.000205,0.000376,-0.000415,-0.000821,-0.000201,0.000345,-0.000393,-0.000812,-0.000222,0.000363,-0.000437,-0.000798,-0.000227,0.000354,-0.000415,-0.000825,-0.000218,0.000362,-0.000401,-0.000852,-0.000205,0.000354,-0.000358,-0.000829,-0.000205,0.000375,-0.00041,-0.000833,-0.00021,0.00038,-0.000397,-0.000795,-0.000183,0.000371,-0.000411,-0.000722,-0.000181,0.000321,-0.00039,-0.000722,-0.000189,0.000301,-0.000347,-0.000707,-0.000166,0.000324,-0.000305,-0.000695,-0.000185,0.000328,-0.000313,-0.000722,-0.000174,0.000293,-0.000321,-0.000676,-0.000151,0.000348,-0.000316,-0.000679,-0.000178,0.000317,-0.000309,-0.000698,-0.000182,0.000317,-0.000301,-0.000699,-0.000201,0.000332,-0.000305,-0.000671,-0.000166,0.00034,-0.000317,-0.000707,-0.00017,0.000347,-0.000352,-0.000695,-0.000158,0.000348,-0.000293,-0.000688,-0.000139,0.000328,-0.000348,-0.000679,-0.000143,0.000332,-0.000367,-0.00069,-0.000143,0.000328,-0.000375,-0.000664,-0.00015,0.000297,-0.000332,-0.000657,-0.000158,0.000359,-0.000274,-0.000671,-0.000108,0.00032,-0.000413,-0.000698,-0.000162,0.000328,-0.000305,-0.000672,-0.000162,0.000355,-0.000398,-0.000657,-0.000162,0.000382,-0.000263,-0.000676,-0.000143,0.000386,-0.000305,-0.000699,-0.000116,0.000332,-0.000394,-0.000676,-0.000139,0.000332,-0.000243,-0.000664,-0.000151,0.000301,-0.000216,-0.000667,-0.000181,0.000325,-0.000316,-0.000668,-0.000143,0.000305,-0.000324,-0.000641,-0.000153,0.000353,-0.00028,-0.000686,-0.000126,0.000354,-0.000305,-0.000664,-0.00017,0.00038,-0.00031,-0.000654,-0.000131,0.000362,-0.000258,-0.000637,-0.000131,0.000258,-0.000214,-0.000659,-0.000113,0.00035,-0.000222,-0.00055,-0.000127,0.000498,-0.000249,-0.000668,-0.000275,0.00055,-0.000314,-0.000668,-0.000184,0.000336,-0.000126,-0.000634,-0.000113,0.000354,-0.00021,-0.000524,-0.000227,0.000305,-0.000175,-0.00051,-0.000087,0.000485,-0.000275,-0.000571,-0.000162,0.000327,-0.000301,-0.000799,-0.000105,0.000371,-0.000266,-0.000602,-0.000109,0.000332,-0.00017,-0.000633,-0.0001,0.000336,-0.000275,-0.000607,-0.00014,0.000366,-0.000262,-0.000668,-0.000127,0.000349,-0.000296,-0.000589,-0.000131,0.000354,-0.000283,-0.000624,-0.000109,0.000345,-0.000292,-0.000607,-0.000105,0.000323,-0.000271,-0.000682,-0.000109,0.00038,-0.000144,-0.000773,-0.000157,0.000385,-0.000122,-0.000632,-0.000135,0.000323,-0.00024,-0.000633,-0.000135,0.000267,-0.000127,-0.00065,-0.000092,0.000327,-0.000331,-0.000642,-0.000105,0.000427,-0.000205,-0.000643,-0.000109,0.00034,-0.000253,-0.000606,-0.000122,0.00035,-0.00024,-0.000607,-0.0001,0.000314,-0.000162,-0.000628,-0.000149,0.000371,-0.000188,-0.000625,-0.000113,0.000371,-0.000214,-0.000615,-0.000118,0.000379,-0.000231,-0.000672,-0.000083,0.000397,-0.000162,-0.000597,-0.000122,0.000385,-0.000301,-0.000607,-0.000118,0.000357,-0.000196,-0.000641,-0.000052,0.000358,-0.000188,-0.000625,-0.000096,0.000341,-0.000302,-0.000593,-0.000105,0.000341,-0.00024,-0.000625,-0.000096,0.000367,-0.000183,-0.000615,-0.000109,0.000345,-0.000209,-0.000607,-0.000092,0.000367,-0.000192,-0.000602,-0.0001,0.000345,-0.000135,-0.000607,-0.000092,0.000363,-0.000262,-0.000581,-0.000113,0.000345,-0.000157,-0.00058,-0.000083,0.000406,-0.000196,-0.000581,-0.000087,0.000397,-0.00014,-0.000589,-0.000105,0.000371,-0.000205,-0.000594,-0.000087,0.000367,-0.000157,-0.00058,-0.000083,0.000371,-0.000245,-0.000581,-0.000122,0.000401,-0.000222,-0.00058,-0.000109,0.000327,-0.000179,-0.000545,-0.000074,0.000353,-0.000153,-0.00058,-0.000074,0.00038,-0.000157,-0.000545,-0.000057,0.000367,-0.000144,-0.00055,-0.000079,0.000406,-0.000144,-0.000572,-0.000087,0.00035,-0.000157,-0.000581,-0.0001,0.000397,-0.000166,-0.000529,-0.00007,0.00035,-0.000135,-0.000611,-0.000092,0.000349,-0.000183,-0.000564,-0.000109,0.000301,-0.000148,-0.000554,-0.000083,0.000349,-0.000136,-0.000567,-0.000105,0.000406,-0.00017,-0.000572,-0.000057,0.000362,-0.00014,-0.000555,-0.000079,0.000428,-0.000214,-0.000554,-0.000083,0.000415,-0.000148,-0.000537,-0.000092,0.000393,-0.000218,-0.000524,-0.000066,0.000379,-0.000127,-0.000554,-0.000087,0.0004,-0.000125,-0.000567,-0.00006,0.000344,-0.000158,-0.000533,-0.00007,0.000394,-0.000204,-0.000557,-0.000046,0.000357,-0.000107,-0.000557,-0.00007,0.000381,-0.000098,-0.000548,-0.00007,0.000357,-0.000177,-0.000534,-0.000079,0.000389,-0.00019,-0.000575,-0.000093,0.000409,-0.000213,-0.000548,-0.000056,0.000353,-0.00013,-0.00053,-0.000005,0.000376,-0.000181,-0.000552,-0.000046,0.000372,-0.000195,-0.000501,-0.00006,0.000395,-0.000139,-0.000506,-0.000074,0.000409,-0.000116,-0.000529,-0.000079,0.00038,-0.000139,-0.00053,-0.000074,0.000395,-0.00013,-0.000543,-0.000042,0.000394,-0.00013,-0.000534,-0.00007,0.000404,-0.000139,-0.000484,-0.000049,0.000362,-0.000111,-0.000444,-0.000053,0.000345,-0.000066,-0.000484,-0.000041,0.000366,-0.00007,-0.000493,-0.000058,0.000349,-0.000074,-0.000464,-0.00007,0.000234,-0.000033,-0.00048,-0.000074,0.000308,-0.000107,-0.000533,-0.00007,0.000217,-0.000086,-0.000476,-0.000094,0.000303,-0.000035,-0.000506,-0.000044,0.000367,-0.000187,-0.000528,-0.00017,0.000275,-0.000232,-0.000397,0.000192,0.000258,-0.000157,-0.000459,-0.000031,0.000463,-0.000227,-0.000453,-0.000105,0.000231,-0.0001,-0.000394,-0.000031,0.000188,-0.000262,-0.000306,-0.000026,0.000459,-0.000175,-0.000519,-0.000057,0.000489,-0.000345,-0.000562,-0.000092,0.000297,-0.000171,-0.00045,0.000017,0.000363,-0.00028,-0.00045,-0.000031,0.000319,0.000026,-0.000519,-0.000057,0.000423,-0.000179,-0.000459,-0.000017,0.00034,-0.000118,-0.000519,-0.000044,0.000284,-0.000118,-0.000388,-0.0001,0.000367,-0.000131,-0.000371,0.000017,-0.00007,-0.000131,-0.000531,0.000455,0.000388,-0.000118,-0.000458,-0.000017,0.000384,0.000048,-0.000375,0.000017,0.000336,-0.000209,-0.000345,-0.000031,0.000581,-0.000096,-0.000479,-0.000057,0.000266,-0.000022,-0.000388,-0.000061,0.000498,-0.000148,-0.000376,-0.000028,0.000362,-0.000073,-0.000486,-0.000039,0.00038,-0.000189,-0.000436,0.000061,0.000317,-0.000061,-0.000408,-0.000045,0.00044,-0.000362,-0.000386,-0.000022,0.000323,0.000006,-0.000418,-0.000061,0.00028,0.000089,-0.000392,-0.000095,0.000317,-0.000184,-0.000457,-0.00005,0.000362,-0.000067,-0.00052,-0.000039,0.000167,-0.000039,-0.000402,-0.000073,0.000296,0.000106,-0.000401,-0.000022,0.000424,-0.00015,-0.000436,-0.000067,0.000251,-0.000185,-0.000412,0.000218,0.000345,-0.000061,-0.000402,0.000028,0.000485,-0.000111,-0.000385,-0.000045,0.000212,-0.000128,-0.000346,0.00005,0.000206,-0.000011,-0.000369,-0.000017,0.000414,-0.000106,-0.000369,0.000017,0.000418,-0.000335,-0.000507,-0.000022,0.000425,-0.000084,-0.000457,0.000061,0.000424,-0.000262,-0.000447,-0.000402,0.000451,0.000167,-0.000481,-0.000072,0.00034,-0.000162,-0.000407,0.000062,0.000373,-0.00014,-0.00052,0.000011,0.000363,0.000067,-0.000358,-0.000061,0.00029,-0.000061,-0.00033,0.00005,0.000022,0.000045,-0.000402,0.000268,0.00038,-0.000151,-0.000436,-0.000061,0.000408,0.000162,-0.000363,0.000084,0.00029,-0.0001,-0.000396,-0.000006,0.00057,-0.000212,-0.000507,-0.000112,0.000212,-0.000089,-0.000401,-0.000056,0.000457,-0.000134,-0.000302,0.000022,0.000396,0.000006,-0.000435,-0.000056,0.000329,-0.000112,-0.000369,-0.000039,0.00034,-0.000627,-0.000156,0.000056,0.000429,-0.00024,-0.000452,0.000078,0.000447,0.000078,-0.000341,-0.000084,0.000302,0.000262,-0.000345,-0.000039,0.000296,0,-0.000425,-0.000084,0.000413,0.000475,-0.000609,-0.000017,0.000173,0.000117,-0.000341,-0.000078,0.000403,0.00044,-0.000419,-0.000089,0.000257,0.000017,-0.00033,-0.000034,0.000357,-0.000045,-0.00039,0.000061,0.00071,0,-0.000201,0.000067,0.000379,-0.000006,-0.000396,0.000028,0.000341,-0.000073,-0.000374,0.000038,0.000406,-0.000022,-0.000162,-0.000005,0.000297,-0.000038,-0.000357,0,0.000292,0.000076,-0.000319,0.000054,0.000433,0.000141,-0.000298,0.000011,0.000358,0,-0.000433,-0.000086,0.000406,0.00006,-0.000369,-0.000027,0.00033,-0.000022,-0.000427,0.000087,0.000438,-0.000179,-0.0004,0.000043,0.000358,-0.000016,-0.000455,0.000016,0.000287,-0.000011,-0.000367,0.000092,0.000526,0.000032,-0.000184,-0.000022,0.000011,-0.000038,-0.000373,-0.000038,0.000427,0.000211,-0.000342,0.000016,0.000195,0.000125,-0.00039,-0.000038,0.000309,-0.000087,-0.00065,-0.000124,0.000287,-0.000049,-0.000434,0.000184,0.000179,-0.000152,-0.000195,0.00013,0.000455,-0.000076,-0.000309,0.000043,0.000288,-0.000076,-0.000141,-0.000195,0.000406,-0.000794,-0.000232,0.000217,0.000405,0,-0.000244,0.000092,0.000352,-0.000011,-0.000314]};
var ahWave = {"real":[0,0.246738,0.08389,0.095378,0.087885,0.165621,0.287369,-0.328845,-0.099613,-0.198535,0.260484,0.012771,0.013351,0.006221,0.003106,0.000629,-0.003591,-0.002876,-0.003527,-0.002975,-0.002648,-0.006996,-0.004165,-0.004266,-0.000731,0.003727,0.018167,0.012018,-0.017044,-0.004816,-0.001255,-0.002032,0.000272,-0.001849,0.004334,0.000773,-0.00069,-0.000207,0.000136,-0.000108,0.000508,-0.000701,-0.000958,-0.004677,0.002005,-0.001925,-0.00145,-0.002212,-0.001163,-0.000227,0.000182,-0.000448,0.000152,-0.000316,-0.000054,-0.000193,-0.00017,-0.000138,-0.000179,0.000059,0.000017,0.000008,0.000252,0.000382,-0.000319,0.00002,-0.000087,0.00002,-0.000024,-0.000002,0.000044,-0.000131,0.000145,-0.000581,-0.000182,-0.001087,-0.000746,-0.002759,-0.001195,-0.002868,-0.000729,-0.002915,0.000325,-0.001489,0.000419,-0.000322,0.000054,-0.0002,0.000032,0.000071,0.000196,-0.000127,0.000355,-0.000328,0.000518,-0.00028,0.00062,-0.00036,0.000553,-0.000153,0.000088,0.000227,0.000454,-0.000071,0.0002,-0.000214,0.000326,-0.00043,0.000123,-0.000226,0.000094,-0.000102,-0.000003,-0.000096,0.000084,0.000037,-0.000107,-0.000201,0.000152,-0.0003,-0.000197,-0.000083,0.000063,-0.000092,0.000009,-0.000076,-0.000057,0.000094,0.000096,-0.000071,-0.000529,-0.000336,-0.000661,-0.000637,-0.001247,-0.000167,-0.001025,-0.001483,0.000107,-0.000321,-0.000251,0.000186,0.000315,-0.000163,-0.000102,-0.001242,-0.001912,-0.000113,0.000724,0.00079,0.000078,-0.000061,0.000077,-0.000069,0.00005,0.000002,-0.000077,-0.000168,0.000073,0.000044,0.000047,0.000093,-0.000101,-0.000012,-0.000048,-0.000033,0.000034,-0.000304,-0.000188,-0.000116,-0.000167,-0.000096,-0.000298,-0.000044,-0.000107,-0.000036,-0.000012,0.000043,0.000191,-0.000126,-0.000011,0.0001,0.000098,-0.000021,-0.000129,-0.000016,-0.000182,-0.000203,-0.000249,-0.000452,-0.000216,-0.000162,0.000092,0.000246,-0.000028,-0.000214,0.000035,0.000038,-0.000032,-0.000037,-0.000015,-0.00001,-0.000011,-0.00004,-0.000014,-0.00002,-0.000031,-0.000023,-0.000012,0,0,0.000004,0.000008,0.000014,0.000015,0.000016,0.000018,0.000019,0.000019,0.000017,0.000016,0.000015,0.000014,0.000012,0.000011,0.00001,0.00001,0.000009,0.000008,0.000008,0.000008,0.000007,0.000006,0.000007,0.000007,0.000006,0.000005,0.000006,0.000006,0.000005,0.000005,0.000005,0.000005,0.000004,0.000004,0.000004,0.000005,0.000004,0.000004,0.000004,0.000004,0.000004,0.000003,0.000004,0.000004,0.000003,0.000003,0.000003,0.000004,0.000003,0.000003,0.000003,0.000003,0.000003,0.000003,0.000003,0.000003,0.000003,0.000002,0.000003,0.000003,0.000003,0.000002,0.000003,0.000003,0.000002,0.000002,0.000002,0.000003,0.000002,0.000002,0.000002,0.000003,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000002,0.000001,0.000002,0.000002,0.000002,0.000001,0.000002,0.000002,0.000002,0.000001,0.000002,0.000002,0.000002,0.000001,0.000002,0.000002,0.000001,0.000001,0.000001,0.000002,0.000001,0.000001,0.000001,0.000002,0.000001,0.000001,0.000001,0.000002,0.000001,0.000001,0.000001,0.000002,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0,0,0.000001,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"imag":[0,-0.011959,0.106385,0.027196,0.04077,0.010807,-0.17632,-0.376644,0.052966,0.242678,0.322558,-0.029071,-0.017862,-0.018765,-0.010794,-0.010157,-0.004212,-0.001923,-0.002589,-0.000607,-0.001983,-0.000421,-0.001835,0.003069,0.005389,0.012023,0.003422,-0.013914,-0.008548,0.007815,0.002234,0.003867,0.000488,0.000824,-0.002685,-0.000085,-0.002967,-0.000125,-0.000831,-0.000192,-0.000222,-0.003892,0.000474,-0.002069,0.001899,0.001648,-0.00049,0.001615,-0.000309,-0.000211,-0.000327,-0.000702,0.000325,-0.000152,0.000048,0.000011,0.000152,-0.000106,-0.000003,-0.000063,0.000026,-0.000104,-0.000479,-0.000528,-0.000551,-0.000202,-0.00024,-0.000079,-0.000078,0.000053,-0.000058,0.000163,0.000573,-0.000025,0.000171,-0.001189,0.000385,-0.000574,-0.000608,-0.000859,-0.00066,-0.000638,-0.002096,-0.000233,-0.002119,0.000081,-0.001687,-0.000175,-0.00059,0.000237,0.000237,0.000232,0.000473,0.000578,0.00056,0.000534,0.000858,0.001336,0.000692,0.001099,0.000203,-0.000084,-0.000032,-0.000114,-0.000094,-0.000085,-0.000034,-0.000303,0.000267,0.000139,-0.000143,0.000062,-0.000023,-0.000049,-0.000084,-0.000129,-0.000141,-0.000123,0.000102,0.000171,-0.000007,0.000123,0.000116,0.00012,0.000003,0.000098,0.000055,-0.000044,-0.000258,-0.000552,-0.000945,-0.00028,-0.000222,-0.000038,-0.000132,-0.000249,0.00088,0.000518,0.001033,0.000874,0.000496,0.000873,0.000276,-0.000206,-0.000785,-0.000948,-0.000148,0.001179,0.000101,-0.000833,-0.000357,-0.000168,-0.000115,-0.000072,-0.000116,-0.000215,-0.000148,-0.000118,0.000104,0.000058,-0.000093,-0.000217,-0.000153,-0.000159,-0.000116,-0.000134,-0.000078,-0.000215,-0.000206,0.000099,-0.000054,-0.000095,0.000029,-0.000054,0.000009,-0.000064,-0.000038,-0.000046,-0.000145,-0.000362,-0.00014,-0.000172,-0.000209,-0.000191,-0.000257,-0.000252,-0.000234,-0.000525,-0.00026,-0.000337,0.000005,0.000083,0.000142,-0.000229,-0.000192,0.000069,0.000069,0.000006,-0.000001,-0.000011,0.000027,0.000008,0.000009,0.000003,0.000004,0.000022,0.000025,0.00004,0.000038,0.000034,0.000036,0.000037,0.000033,0.000028,0.000026,0.000023,0.00002,0.000016,0.000012,0.000009,0.000008,0.000006,0.000005,0.000003,0.000004,0.000003,0.000003,0.000002,0.000003,0.000003,0.000002,0.000002,0.000002,0.000003,0.000002,0.000002,0.000002,0.000002,0.000002,0.000001,0.000002,0.000002,0.000002,0.000001,0.000002,0.000002,0.000001,0.000001,0.000001,0.000002,0.000001,0.000001,0.000001,0.000002,0.000001,0.000001,0.000001,0.000002,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0.000001,0,0.000001,0.000001,0,0,0.000001,0.000001,0,0,0.000001,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0.000001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};
var oohWave = {"real":[0,-0.370874,0.288281,-0.454893,0.061559,0.049432,-0.012918,0.129553,-0.041687,-0.012594,-0.006316,0.00813,0.000601,-0.000181,-0.005799,0.000374,-0.000806,0.000236,-0.001341,0.000891,0.000361,0.000822,-0.000374,0.0006,0.000703,-0.002483,0.002295,-0.000217,0.00045,-0.00019,0.000034,-0.000237,0.000719,-0.000872,0.000771,-0.000461,0.000487,-0.000296,-0.000324,0.000094,-0.000297,0.000801,-0.000836,0.000114,0.000064,0.000199,-0.000033,-0.000051,-0.000107,-0.000221,-0.000052,0.000198,-0.000028,-0.000199,0.000055,-0.000105,-0.000255,-0.00014,0.000114,-0.000041,-0.000117,0.000085,-0.000033,-0.000004,0.000011,-0.000273,-0.000059,-0.000038,-0.000255,0.000055,-0.000013,0.000089,-0.000059,0.000164,0.000091,0.000001,0.00007,-0.000004,0.000151,-0.000148,0.000486,-0.000242,0.000123,-0.00005,-0.00015,0.000053,-0.000109,0.000183,-0.000181,0.000331,-0.000187,0.000227,-0.000157,0.000145,0.000079,-0.000158,-0.000039,-0.000118,0.000027,-0.000315,0.000324,-0.000773,0.000717,-0.000255,-0.000114,-0.000174,-0.000084,-0.000107,0.00003,-0.000092,-0.000038,-0.00001,-0.000173,0.000146,-0.000033,-0.000415,0.000811,-0.000489,0.000142,-0.00009,0.000044,-0.000171,0.000034,-0.000026,-0.000217,-0.000042,-0.000131,0.000229,-0.000262,0.000534,-0.001005,0.000352,0.000284,-0.000795,0.000905,-0.000018,-0.000307,0.000268,-0.000369,0.00047,-0.00035,0.000241,-0.000347,0.000472,-0.000438,0.000056,0.000835,-0.00025,0.000228,-0.000023,-0.000927,0.000283,-0.000599,0.00017,-0.000008,0.00022,-0.000072,0.000262,-0.000139,0.000048,-0.000117,0.00016,-0.000168,0.000174,-0.000239,0.000141,-0.000023,-0.000095,0.000147,-0.000017,-0.000049,0.000112,0.000071,-0.000373,0.000062,0.00012,-0.000049,0.000005,-0.000099,0.00001,-0.000004,-0.000051,0.000254,-0.000079,-0.000125,0.000128,-0.000043,-0.000037,-0.000002,0.000015,-0.000069,0.000221,-0.000129,0.00002,0.000037,-0.000071,0.000027,-0.000023,-0.000007,-0.000008,0.000021,-0.000001,0.000006,0.000011,0.000011,0.000001,-0.000005,0.000003,-0.000004,0.000001,0.000001,-0.000007,-0.000006,-0.000007,-0.000007,-0.000007,-0.000007,-0.000007,-0.000007,-0.000006,-0.000005,-0.000005,-0.000005,-0.000004,-0.000003,-0.000004,-0.000004,-0.000003,-0.000003,-0.000003,-0.000003,-0.000003,-0.000002,-0.000003,-0.000003,-0.000002,-0.000002,-0.000002,-0.000003,-0.000002,-0.000002,-0.000002,-0.000002,-0.000002,-0.000001,-0.000002,-0.000002,-0.000002,-0.000001,-0.000002,-0.000002,-0.000002,-0.000001,-0.000002,-0.000002,-0.000001,-0.000001,-0.000001,-0.000002,-0.000001,-0.000001,-0.000001,-0.000002,-0.000001,-0.000001,-0.000001,-0.000002,-0.000001,-0.000001,-0.000001,-0.000002,-0.000001,-0.000001,-0.000001,-0.000002,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,-0.000001,0,-0.000001,-0.000001,0,0,-0.000001,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.000001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"imag":[0,0.046536,0.256926,0.019372,-0.496196,0.016047,-0.063615,0.021345,-0.007871,-0.020463,0.009909,0.003165,-0.000942,-0.002837,0.002435,-0.003583,0.001061,-0.002121,-0.00013,0.000233,-0.00032,0.000087,0.00095,-0.001264,0.002961,-0.000701,0.000715,0.000451,-0.000291,0.000048,0.000166,-0.000528,0.000677,-0.000218,-0.000003,-0.00028,-0.000135,0.000574,-0.000348,0.000214,-0.00044,0.000625,0.001131,-0.000147,0.000135,-0.000206,-0.000013,-0.000018,-0.000061,-0.000043,0.00012,0.000051,-0.000039,0.000039,0.000068,-0.000041,-0.000088,-0.00007,0.000099,-0.000165,0.000194,-0.000161,-0.000109,-0.000013,-0.000071,0.000097,-0.000165,-0.000033,0.000068,0.000003,0.000068,-0.000104,0.000159,-0.000107,0.000065,0.000007,0.000123,-0.000005,-0.000101,-0.000075,0.000024,0.000528,-0.000422,0.000479,-0.000171,-0.000048,-0.00015,0.00035,-0.000185,-0.000023,0.000163,0.000053,-0.000016,0.000018,-0.000264,0.000025,-0.000246,-0.000067,-0.000231,0.000039,-0.000093,0.000095,0.000045,0.00045,-0.000697,0.00017,0.000055,-0.00016,0.00012,0.000118,-0.00007,0.000054,0.000057,-0.000246,0.000253,-0.000389,0.000138,-0.000053,0.000014,-0.000032,-0.000162,0.000048,-0.000089,-0.000145,-0.000163,0.000127,0.000215,-0.000009,-0.000012,0.000117,0.000425,-0.000036,0.000827,-0.001058,-0.000607,0.000224,0.000075,-0.000086,-0.00014,0.000358,-0.000212,0.000479,-0.000007,-0.000196,0.000109,0.000138,0.000173,0.000108,-0.000153,0.000167,-0.000805,0.000246,-0.00006,-0.000009,0.000113,-0.000008,0.000042,-0.000097,-0.00003,0.000144,-0.00013,0.000154,0.000024,0.000062,-0.000026,-0.000145,0.000156,-0.000205,0.000047,0.000042,-0.000049,-0.00007,0.000232,-0.000152,-0.000228,0.00021,-0.000025,0.000046,-0.000051,0.000131,-0.000038,-0.000125,0.000053,0.000214,-0.000195,0.000066,0.000045,-0.000026,0.000015,0.000001,-0.000146,0.000059,0.000115,-0.000094,0.000138,0,0.000007,-0.000025,0.000013,0.000011,0.000002,0.000016,-0.000017,-0.000014,-0.000017,-0.000005,-0.000008,-0.000006,-0.000008,-0.000018,-0.000007,-0.000008,-0.00001,-0.000009,-0.000006,-0.000004,-0.000004,-0.000003,-0.000002,-0.000001,-0.000001,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,-0.000001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};

function playNote(freq) {
  var real = new Float32Array(oohWave.real);//pianoWave.real);
  var imag = new Float32Array(real.length);

  
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  var o = context.createOscillator();
  var wave = context.createPeriodicWave(real, imag);// ,{disableNormalization: true}

  o.setPeriodicWave(wave);

  //o.type = "square";
 // var frequency = 261.6;
  o.frequency.value = freq;
  var g = context.createGain();
  g.gain.value = 1;
  o.connect(g);
  g.connect(context.destination);
  o.start(0);
  //o.stop(context.currentTime + 3);
  setTimeout(function(){ g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 5); }, 0);
}

var defaultPlayer = {
  version: version,
  name: "visitor",
  highestLevel: 0
}

var player;
try{
  player = JSON.parse(localStorage.player);
}
catch{
  player = defaultPlayer;
}

if(player === null || player === undefined ||player.hasOwnProperty('version')===false){
    player = defaultPlayer;
    console.log("Default Player: ",player);
    loadPlayer();
   }
   else if(player.version!=version){
    player = defaultPlayer;
    console.log("Default Player: ",player);
    loadPlayer();
   }
else{console.log("StoredPlayer: ",player);loadPlayer();}

function loadPlayer(){
  makeLevels();
  for(var i = 0; i<=player.highestLevel; i++){
    try {levels[i].unlocked = true;}
    catch{};
  }
}

   

//underground
var underground = document.createElement("div");
  underground.classList.add("underground");
  underground.style.bottom = "0px";
  underground.style.height =  stepSize*groundHeight + "px";
  container.append(underground);

//sky
var sky = document.createElement("div");
  sky.classList.add("sky");
  sky.style.bottom = stepSize*groundHeight + "px";
  sky.style.height =  stepSize*(range - groundHeight) + "px";
  container.append(sky);
 /* var skyImage = new Image(); If I want sky and water as an image rather than css
  skyImage.src = "https://images.pond5.com/orange-pink-peaceful-sky-fluffy-footage-088026629_prevstill.jpeg";
  skyImage.onload = function(){
   mainCanvasCtx.drawImage(skyImage,0,0, width,height-groundHeight*stepSize );
  }
  var waterImage = new Image();
  waterImage.src = "https://www.wuwm.com/sites/wuwm/files/styles/x_large/public/201907/AdobeStock_143932362.jpeg";
  waterImage.onload = function(){
   mainCanvasCtx.drawImage(waterImage,0,height-groundHeight*stepSize, width,groundHeight*stepSize );
  }*/
 

//make horizontal lines
for (var i = groundHeight; i< range; i++){
  var line = document.createElement("div");
  line.classList.add("line");
  line.style.bottom = i*stepSize + "px";
  container.append(line);
  if (i=== groundHeight){
    line.classList.add("cLine");
  }
}

var startTarget = document.getElementById("startTarget");
//startTarget.style.width = stepSize + "px";
startTarget.style.bottom = groundHeight*stepSize + "px";


//possible tracks

function makeArpegio(degree, type){
  var majorScaleSteps = [0,2,4,5,7,9,11,12];
  var startSemis = majorScaleSteps[degree-1]-1;
  var array = [];
  switch(type){ 
    case "major":
      array.push({start: startSemis, semitones: 1, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 5, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 8, horiz: 1, color: terrainKey, text:{0:"Maj"}});
      array.push({start: startSemis, semitones: 5, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 1, horiz: 1, color: terrainKey});
      break
      
      case "minor":
      array.push({start: startSemis, semitones: 1, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 4, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 8, horiz: 1, color: terrainKey, text:{0:"Min"}});
      array.push({start: startSemis, semitones: 4, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 1, horiz: 1, color: terrainKey});
      break
      
      case "major7":
      array.push({start: startSemis, semitones: 1, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 5, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 8, horiz: 1, color: terrainKey, text:{0:"Maj7"}});
      array.push({start: startSemis, semitones: 12, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 1, horiz: 1, color: terrainKey});
      break
      
      case "dom7":
      array.push({start: startSemis, semitones: 1, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 5, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 8, horiz: 1, color: terrainKey, text:{0:"Dom7"}});
      array.push({start: startSemis, semitones: 11, horiz: 1, color: terrainKey});
      array.push({start: startSemis, semitones: 1, horiz: 1, color: terrainKey});
      break
  }
  return array;
}




function Level(){
  this.name;
  this.info = "Lets Sing"
  this.obstacles = ground;
  this.passTime = 3000;
  this.passed = false;
  this.unclocked = false;
  this.allowedMistakes = 1;
  this.calcPassTime = function(){
    for(var i = 0; i < this.obstacles.length; i++){
      this.passTime += 2000 * this.obstacles[i].horiz;
    }
  }
}

function makeLevels(){
  
  var majorScaleUp = [
    {start: -1, semitones: 1, horiz: 1},
    {start: 0, semitones: 2, horiz: 1},
    {start: 2, semitones: 2, horiz: 1},
    {start: 4, semitones: 1, horiz: 1},
    {start: 5, semitones: 2, horiz: 1},
    {start: 7, semitones: 2, horiz: 1},
    {start: 9, semitones: 2, horiz: 1},
    {start: 11, semitones: 1, horiz: 1},
  ];

  var majorScaleMountain = [
    {start: -1, semitones: 1, horiz: 1},
    {start: -1, semitones: 3, horiz: 1},
    {start: -1, semitones: 5, horiz: 1},
    {start: -1, semitones: 6, horiz: 1},
    {start: -1,semitones: 8, horiz: 1},
    {start: -1, semitones: 10, horiz: 1},
    {start: -1, semitones: 12, horiz: 1},
    {start: -1, semitones: 13, horiz: 1, text: {0:"Major Scale"}, animation: {7: happyFace}},
    {start: -1, semitones: 12, horiz: 1},
    {start: -1, semitones: 10, horiz: 1},
    {start: -1,semitones: 8, horiz: 1},
    {start: -1, semitones: 6, horiz: 1},
    {start: -1, semitones: 5, horiz: 1},
    {start: -1, semitones: 3, horiz: 1},
    {start: -1, semitones: 1, horiz: 1},
  ];
  
  var minorScaleMountain = [
    {start: -1, semitones: 1, horiz: 1},
    {start: -1, semitones: 3, horiz: 1},
    {start: -1, semitones: 4, horiz: 1},
    {start: -1, semitones: 6, horiz: 1},
    {start: -1,semitones: 8, horiz: 1},
    {start: -1, semitones: 9, horiz: 1},
    {start: -1, semitones: 11, horiz: 1},
    {start: -1, semitones: 13, horiz: 1, text: {0:"Minor Scale"}},
    {start: -1, semitones: 11, horiz: 1},
    {start: -1, semitones: 9, horiz: 1},
    {start: -1,semitones: 8, horiz: 1},
    {start: -1, semitones: 6, horiz: 1},
    {start: -1, semitones: 4, horiz: 1},
    {start: -1, semitones: 3, horiz: 1},
    {start: -1, semitones: 1, horiz: 1},
  ]

  var octave = [
    {start: -1, semitones: 1, horiz: 3},
    {start: -1, semitones: 13, horiz: 3},
    {start: -1, semitones: 1, horiz: 3},
  ]
  
  
  var min2nd = [
    {start: -1, semitones: 1, horiz:1, animation: {0: shark}},
    {start: -1, semitones: 2, horiz:1},
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 2, horiz:1},
    {start: -1, semitones: 1, horiz:1, text: {0:"min 2nd (Jaws)"}},
    {start: -1, semitones: 2, horiz:1},
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 2, horiz:1},
    {start: -1, semitones: 1, horiz:1}
   /* {start: -1, semitones: 1, horiz:1, text: {0:"min"}},
    {start: -1, semitones: 2, horiz:1, text: {0:"2nd"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"Da"}},
    {start: -1, semitones: 2, horiz:1, text: {0:"Dm"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"Da"}},
    {start: -1, semitones: 2, horiz:1, text: {0:"Dm"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"Da"}},
    {start: -1, semitones: 2, horiz:1, text: {0:"Dm"}}*/
  ]
  
  var maj2nd = [
    {start: -1, semitones: 1, horiz:1, text: {0:"maj"}},
    {start: -1, semitones: 3, horiz:1, text: {0:"2nd"}},
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 1, horiz:1, text: {0:"Ha"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"py"}},
    {start: -1, semitones: 3, horiz:1, text: {0:"birth"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"day"}},
        {start: -1, semitones: 1, horiz:1, text: {0:"Ha"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"py"}},
    {start: -1, semitones: 3, horiz:1, text: {0:"birth"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"day"}},
  ]
  
  var fourth = [
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 6, horiz:1},
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 6, horiz:1},
    {start: -1, semitones: 1, horiz:1, text: {0:"4th (Here comes the bride)"}},
    {start: -1, semitones: 6, horiz:1},
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 6, horiz:1},
    {start: -1, semitones: 1, horiz:1, animation: {0: bride}}
    
    /*{start: -1, semitones: 1, horiz:1, text: {0:"per"}},
    {start: -1, semitones: 6, horiz:1, text: {0:"er"}},
    {start: -1, semitones: 6, horiz:1, text: {0:"fect"}},
    {start: -1, semitones: 6, horiz:1, text: {0:"4th"}},
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 1, horiz:1, text: {0:"here"}},
    {start: -1, semitones: 6, horiz:1, text: {0:"comes"}},
    {start: -1, semitones: 6, horiz:1, text: {0:"the"}},
    {start: -1, semitones: 6, horiz:1, text: {0:"bride"}},*/
    
    
  ]
  
  
  var maj6th = [
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 10, horiz:1},
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 10, horiz:1},
    {start: -1, semitones: 1, horiz:1, text: {0:"6th (Hush little baby)"}},
    {start: -1, semitones: 10, horiz:1},
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 10, horiz:1, animation: {9: baby}},
    {start: -1, semitones: 1, horiz:1},
    ]
  
  var intervals = [
    {start: -1, semitones: 1, horiz:1, text: {0:"min"}},
    {start: -1, semitones: 2, horiz:1, text: {0:"2nd"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"Da"}},
    {start: -1, semitones: 2, horiz:1, text: {0:"Dm"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"Da"}},
    {start: -1, semitones: 2, horiz:1, text: {0:"Dm"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"Da"}},
    {start: -1, semitones: 2, horiz:1, text: {0:"Dm"}},
    
    {start: -1, semitones: 1, horiz:3, color: ["dodgerblue"]},
    
    {start: -1, semitones: 1, horiz:1, text: {0:"maj"}},
    {start: -1, semitones: 3, horiz:1, text: {0:"2nd"}},
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 1, horiz:1, text: {0:"Ha"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"py"}},
    {start: -1, semitones: 3, horiz:1, text: {0:"birth"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"day"}},
        {start: -1, semitones: 1, horiz:1, text: {0:"Ha"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"py"}},
    {start: -1, semitones: 3, horiz:1, text: {0:"birth"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"day"}},
    
     {start: -1, semitones: 1, horiz:3, color: ["dodgerblue"]},
    
    {start: -1, semitones: 1, horiz:1, text: {0:"min"}},
    {start: -1, semitones: 3, horiz:1, text: {0:"3rd"}},
    {start: -1, semitones: 1, horiz:1},
    {start: -1, semitones: 1, horiz:1, text: {0:"Ha"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"py"}},
    {start: -1, semitones: 3, horiz:1, text: {0:"birth"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"day"}},
        {start: -1, semitones: 1, horiz:1, text: {0:"Ha"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"py"}},
    {start: -1, semitones: 3, horiz:1, text: {0:"birth"}},
    {start: -1, semitones: 1, horiz:1, text: {0:"day"}},

  ]

  var IMajor = makeArpegio(1,"major");
  var IMinor = makeArpegio(1,"minor");
  var IIMinor = makeArpegio(2,"minor");
  var IMaj7 = makeArpegio(1, "major7");
  var IDom7 = makeArpegio(1, "dom7");
  
  var majorMinorIsland = majorScaleMountain.concat(IMajor).concat(IMinor).concat(IMajor).concat(IMinor);
  var majorMinorHurdles = IMajor.concat(IMinor).concat(IMajor).concat(IMinor).concat(IMajor).concat(IMinor);
  var majorMinorMountains = majorScaleMountain.concat(minorScaleMountain);
  var seventhChords = IDom7.concat(IMaj7).concat(IDom7).concat(IMaj7).concat(IDom7).concat(IMaj7);
  
  var testLevel = new Level();
  testLevel.name = "Test Level";
  testLevel.obstacles = octave;
  testLevel.allowedMistakes = 3;
  testLevel.unlocked = true;
  testLevel.info = "This first level is to help you find a comforatable key for your voice. Change the key on the left until you can pass this level easily";
  
  var happyMountain = new Level();
  happyMountain.name = "Happy Mountain";
  happyMountain.obstacles = majorScaleMountain;
  happyMountain.allowedMistakes = 4;
  //level1.calcPassTime();
  happyMountain.unlocked = true;
  happyMountain.info = "This level will help you sing a major scale";

  var levelMajMinHurdles = new Level();
  levelMajMinHurdles.name = "Major Minor Hurdles";
  levelMajMinHurdles.obstacles = majorMinorHurdles;
  levelMajMinHurdles.info = "This level will help you to sing major and minor triads";
  levelMajMinHurdles.allowedMistakes = 3;

  var sadMountain = new Level();
  sadMountain.name = "Sad Mountain";
  sadMountain.obstacles = minorScaleMountain;
  sadMountain.info = "This level will help you to sing a minor scale";
  sadMountain.allowedMistakes = 3;
  
   var seventhHeaven = new Level();
  seventhHeaven.name = "Seventh Heaven";
  seventhHeaven.obstacles = seventhChords;
  seventhHeaven.info = "This level will help you to sing seventh chords";
  seventhHeaven.allowedMistakes = 3;
  
  
  var intervalIslands = new Level();
  intervalIslands.name = "Interval Islands";
  intervalIslands.obstacles  = min2nd.concat([{start: -1, semitones: 1, horiz:3, color: ["none"]},])
  .concat(fourth).concat([{start: -1, semitones: 1, horiz:3, color: ["none"]},])
  .concat(maj6th);
  intervalIslands.info = "This level will help you to sing musical intervals";
  intervalIslands.allowedMistakes = 3;

  var popIsland = new Level();
  popIsland.name = "Pop Island";
  popIsland.info = "Sing pop style chord progressions";
  
  var blueIsland = new Level();
  blueIsland.name = "Blues Island";
  blueIsland.info = "Sing blues style chord progressions and scales";

  var jazzIsland = new Level();
  jazzIsland.name = "Jazz Island";
  jazzIsland.info = "Sing jazz style chord progressions and scales";


  levels = [testLevel, happyMountain, intervalIslands, levelMajMinHurdles, seventhHeaven, sadMountain, popIsland, blueIsland, jazzIsland];
 // levels = [testLevel,jazzIsland];
}




function setLevel(newLevelIndex){
  if(levels[newLevelIndex].unlocked === true){
    levelIndex = newLevelIndex;
    if(player.highestLevel < levelIndex){
      player.highestLevel = levelIndex;
      localStorage.player = JSON.stringify(player);
    }
  }
  else{
    alert("Unlock this level by completing the ones before it");
  }
  levelSelector.selectedIndex = levelIndex;
  //init();
}


//startScreen();



function makeLevelSelector(){
  for(var i = 0; i<levels.length; i++){
    var levelOption = document.createElement("option");
    levelOption.text = levels[i].name;
    levelSelector.add(levelOption);
  }
  
  levelSelector.addEventListener("change", function(){setLevel(levelSelector.selectedIndex); startLevel()})
}

makeLevelSelector();

function levelEnd(){
  midGame = false;
  speech.innerHTML = "";
  helpStage = 3;
  noteDiv.style.display = "none";
  wordsDiv.style.display = "block";
  message.innerHTML = "mistakes " + mistakes;
  agentMoving = false;
  if(mistakes <= levels[levelIndex].allowedMistakes){
    monk.animFrameY = 0;
    monk.animFrameX = 0;
    monk.animType = "backAndForth";
    helpStage = "newLevel"; 
    help();
  }  
  else{
    helpStage = "tryAgain";
    help();
  }
 /* if(timeLeft > 0){
    levels[levelIndex + 1].unlocked = true;
    setLevel(levelIndex + 1); 
  }*/
  //setTimeout(startLevel,3000);
  //init();
}




/*makeObstacle(obstacles[0]);
obstacleIndex = 1;

while(parseInt(activeObstacles[0].div.style.right,10) < width/2 - stepSize*2){
  traverse();
}
startPos = true;*/


function makeSemitone(numSemis, color, text, animation){
  var semitoneBlock = document.createElement("div");
  container.append(semitoneBlock);
  semitoneBlock.classList.add("semitoneBlock");
  semitoneBlock.style.height = stepSize + "px";
  semitoneBlock.style.width = stepSize + "px";
  semitoneBlock.style.bottom = (numSemis+groundHeight)*stepSize + "px";
  semitoneBlock.style.right = -stepSize + "px";
  if(color) {
    if(color!="none"){
      semitoneBlock.style.backgroundColor = color;
    }
  }
  else{
    semitoneBlock.style.backgroundColor = terrainKey[(numSemis + 1)%12];
  }
  if(text){
    semitoneBlock.innerHTML = "<span>" + text + "<span>";
    semitoneBlock.style.fontSize = Math.floor(stepSize/2) + "px";
  }
  if(animation){
    animation.setFollowElement(semitoneBlock);
    animations.push(animation);
  }
  //semitoneBlock.style.backgroundImage = "url(http://www.transparenttextures.com/patterns/white-sand.png)";
  activeObstacles.push({div: semitoneBlock});
}

//makeSemitone(0);
//makeSemitone(2);

function makeObstacle(obstacle){
  var color;
  var text;
  var animation;
    for(var vert = 0; vert < obstacle.semitones; vert++){
      try{color = obstacle.color[vert]}
      catch{};
      try{text = obstacle.text[vert]}
      catch{};
      try{animation = obstacle.animation[vert]}
      catch{};
      makeSemitone(obstacle.start + vert, color, text, animation);
    }   
}

//makeObstacle(obstacles[obstacleIndex]);
//obstacleLengthCount++;


function animate(){ 
  //console.log("checking animate");
   if (Date.now() - lastCloud > 5000){
      lastCloud = Date.now();
      if(Math.random()<0.1){
        new Cloud(Math.round(Math.random()*2));       
      }
    }
  if(paused === false){
    if(mistakeActive === true){
      mistakeTime = Date.now() - mistakeStartTime;
    }
    if(mistakeTime > 2000){
      mistakes++;
      mistakeTime = 0;
      mistakeActive = false;
      lastMistakeHeight = agentBottom;
    }
    var timeElapsed = (Date.now() - levelStartTime);
    timeLeft = levels[levelIndex].passTime - timeElapsed;
    if(Date.now() - lastAnim > 10){
      //console.log("animating");
      if(agentMoving === true){
        traverse();
      }
      //drawAgent();
      lastAnim = Date.now();
    }
    //drawMainCanvas();
    for(var i = animations.length - 1; i>= 0; i--){
      animations[i].animate();
      log.innerHTML = check; check++;
      if (animations[i].redundant === true){
        animations.splice(i,1);
      }
    }
   
    requestAnimationFrame(animate);
  }
}

//animate();

function traverse(){
  speech.innerText ="";
  message.innerHTML = "mistakes: "+ mistakes;
  if(startPos === false){//has not reached start yet
    try{     
       var firstObstacleRight = parseInt(activeObstacles[0].div.style.right,10);
       if(firstObstacleRight >= (widthBlocks/2-2)*stepSize){
         startPos = true;
         monk.animType = "backAndForth";
         monk.animFrameY = 2;} //make meditate
    }
    catch{}
  }
  try{
     var checkTargetHeight = parseInt(activeObstacles[targetIndex].div.style.bottom)+ stepSize;
   }
  catch{
    var checkTargetHeight = groundHeight*stepSize;
  }
  if(checkTargetHeight != targetHeight){//reccord previous target height only if taget height is being changed
    prevTargetHeight = targetHeight;
    targetHeight = checkTargetHeight;
  }
  //var targetRight = parseInt(activeObstacles[targetIndex].div.style.right,10);
  //message.innerHTML = "target right: " + targetRight + "agent right : " + agentRight + " targetIndex: " + targetIndex;
    //message.innerHTML =  "first obstacle pos: " + parseInt(activeObstacles[0].div.style.right,10);    
  //prevAgentBottom = agentBottom;
  agentBottom = parseInt(agent.style.bottom);
  if(targetIndex === "none" || targetIndex === 0){
    if(agentBottom > targetHeight){speech.innerHTML = "lower";}//if you are above target
    else if(agentBottom < targetHeight){speech.innerHTML = "higher";}//if you are bellow target
  }
    if( targetHeight === agentBottom || startPos === false ){
      monk.animType = "cycle";
      monk.animFrameY = 1;
      mistakeActive = false;
      mistakeTime = 0;
        if(pixTraverse % stepSize === 0 && pixTraverse != 0){//add new block to sceen if we have traversed another step along
          if(obstacleIndex < obstacles.length){//if track is not finished
            makeObstacle(obstacles[obstacleIndex]);
            obstacleLengthCount++;
            if(obstacleLengthCount === obstacles[obstacleIndex].horiz){//if horizontal blocks have all been laid then do next ostacle next time
              obstacleLengthCount = 0;
              obstacleIndex++;
            }
          }
        }
      //move blocks across and see which one is under agent and set it to target
      targetIndex = "none";
        for(var i = 0; i<activeObstacles.length; i++){
          var pos = parseInt(activeObstacles[i].div.style.right,10);
          //message.innerHTML = "tagret left: " + targetLeftX + "agent right : " + agent.style.right;
          if(pos=== width){//remove obstacel if reached left of screen
            activeObstacles[i].div.remove();
            console.log("removed div")
            activeObstacles.shift();
          }
          else{activeObstacles[i].div.style.right = pos + speed  + "px";}
          if(pos >= agentRight - stepSize - speed && pos < agentRight){
            var checkTargetIndex = i;
            if(checkTargetIndex != targetIndex){
              prevTargetIndex = targetIndex;
              targetIndex = i; 
              if(targetIndex === 0){startTarget.style.display = "none";}//hide start arrow if reached start
              activeObstacles[targetIndex].div.classList.add("borderTop");              
              try{activeObstacles[prevTargetIndex].div.classList.remove("borderTop");}
              catch{};
              
            }
             if(targetIndex === activeObstacles.length - 1 && pos + speed >= agentRight){//end of track
               agentMoving = false;
               levelEnd();
             }
          }
          
          
        }
        pixTraverse ++;
      
    }
  else if(prevTargetHeight != agentBottom  && targetIndex != "none"){//if your not still on last target
      monk.animType = "backAndForth";
      monk.animFrameY = 2 //make meditate;
    if(agentBottom != lastMistakeHeight){//don't recount last mistake
      if(mistakeActive === false){//if mistake timer has started
        mistakeActive = true;
        mistakeStartTime = Date.now();
      }
    } 
  }
  else if(prevTargetHeight === agentBottom){
    mistakeActive = false;
    mistakeTime = 0;
  }
}

var addsArray = document.querySelectorAll("div.advert");
var addsIndex = 0;
function showNextAdd(){
  addsArray[addsIndex].style.display = "block";
if(addsIndex < addsArray.length - 1){addsIndex++}
else{addsIndex = 0};
}

function hideAdd(add){
  add.parentElement.style.display = "none";
}

function showDonateDiv(){
  document.getElementById("donateDiv").style.display = "block";
}

function showFeedbackForm(){
  document.getElementById("feedbackFormDiv").style.display = "block";
}

function hideFeedbackForm(){
  document.getElementById("feedbackFormDiv").style.display = "none";
}


/*function visitorAlert(){
 google.script.run.withSuccessHandler(function(response){
  console.log(response);
 })
 .withFailureHandler(function(err){
  console.log(err)
 })
 .visitorAlert(); 
 console.log("visitorAlert sent");
 
}*/

let PitchFinder = {};
(function(pf) {
	pf.AMDF = function(config) {
		config = config || {};

		var AMDF = {};

		var DEFAULT_MIN_FREQUENCY = 82,
			DEFAULT_MAX_FREQUENCY = 1000,
			DEFAULT_RATIO = 5,
			DEFAULT_SENSITIVITY = 0.1,
			DEFAULT_SAMPLE_RATE = 44100,
			sampleRate = config.sampleRate || DEFAULT_SAMPLE_RATE,
			minFrequency = config.minFrequency || DEFAULT_MIN_FREQUENCY,
			maxFrequency = config.maxFrequency || DEFAULT_MAX_FREQUENCY,
			sensitivity = config.sensitivity || DEFAULT_SENSITIVITY,
			ratio = config.ratio || DEFAULT_RATIO,
			amd = [],
			maxPeriod = Math.round(sampleRate / minFrequency + 0.5),
			minPeriod = Math.round(sampleRate / maxFrequency + 0.5),
			result = {};

		return function(float32AudioBuffer) {
			var t,
				minval = Infinity,
				maxval = -Infinity,
				frames1,
				frames2,
				calcSub,
				maxShift = float32AudioBuffer.length;

			// Find the average magnitude difference for each possible period offset.
			for (var i = 0; i < maxShift; i++) {
				if (minPeriod <= i && i <= maxPeriod) {
					t = 0;
					frames1 = []; // The magnitudes from the start of the buffer.
					frames2 = []; // The magnitudes from the start of the buffer plus the offset.
					for (
						var aux1 = 0, aux2 = i, t = 0;
						aux1 < maxShift - i;
						t++, aux2++, aux1++
					) {
						frames1[t] = float32AudioBuffer[aux1];
						frames2[t] = float32AudioBuffer[aux2];
					}

					// Take the difference between these frames.
					var frameLength = frames1.length;
					calcSub = [];
					for (var u = 0; u < frameLength; u++) {
						calcSub[u] = frames1[u] - frames2[u];
					}

					// Sum the differences.
					var summation = 0;
					for (var l = 0; l < frameLength; l++) {
						summation += Math.abs(calcSub[l]);
					}
					amd[i] = summation;
				}
			}

			for (var j = minPeriod; j < maxPeriod; j++) {
				if (amd[j] < minval) minval = amd[j];
				if (amd[j] > maxval) maxval = amd[j];
			}

			var cutoff = Math.round(sensitivity * (maxval - minval) + minval);
			for (j = minPeriod; j <= maxPeriod && amd[j] > cutoff; j++);

			var search_length = minPeriod / 2;
			minval = amd[j];
			var minpos = j;
			for (i = j - 1; i < j + search_length && i <= maxPeriod; i++) {
				if (amd[i] < minval) {
					minval = amd[i];
					minpos = i;
				}
			}

			if (Math.round(amd[minpos] * ratio) < maxval) {
				return { freq: sampleRate / minpos };
			} else {
				return { freq: -1 };
			}
		};
	};

	// Constructor function for the YIN pitch detector, using the FFT optimization.
	// NOTE: Make sure to include FFT.js
	pf.FastYIN = function(config) {
		config = config || {};

		if (!window.FFT) throw "No FFT provided.";

		var DEFAULT_THRESHOLD = 0.1,
			DEFAULT_BUFFER_SIZE = 2048,
			DEFAULT_SAMPLE_RATE = 44100,
			threshold = config.threshold || DEFAULT_THRESHOLD,
			sampleRate = config.sampleRate || DEFAULT_SAMPLE_RATE,
			bufferSize = config.bufferSize || DEFAULT_BUFFER_SIZE,
			yinBuffer = new Float32Array(bufferSize / 2),
			yinBufferLength = bufferSize / 2,
			audioBufferFFT = new Float32Array(2 * bufferSize),
			kernel = new Float32Array(2 * bufferSize),
			yinStyleACF = new Float32Array(2 * bufferSize),
			FFT = window.FFT,
			result = {};

		// Implements the difference function using an FFT.
		var difference = function(float32AudioBuffer) {
			// Power term calculation.
			var powerTerms = new Float32Array(bufferSize / 2);
			// First term.
			for (var j = 0; j < bufferSize / 2; j++) {
				powerTerms[0] += float32AudioBuffer[j] * float32AudioBuffer[j];
			}
			// Iteratively calculate later terms.
			for (var tau = 1; tau < bufferSize / 2; tau++) {
				powerTerms[tau] =
					powerTerms[tau - 1] -
					float32AudioBuffer[tau - 1] * float32AudioBuffer[tau - 1] +
					float32AudioBuffer[tau + bufferSize / 2] *
						float32AudioBuffer[tau + bufferSize / 2];
			}

			// YIN-style autocorrelation via FFT
			// 1. data
			FFT.complex(audioBufferFFT, float32AudioBuffer, false);

			// 2. half of the data, disguised as a convolution kernel
			var halfData = new Float32Array(yinBufferLength);
			for (var j = 0; j < yinBufferLength; j++) {
				halfData[j] = float32AudioBuffer[yinBufferLength - 1 - j];
			}
			FFT.complex(kernel, halfData, false);

			// 3. Convolution via complex multiplication
		};

		return function() {};
	};

	// Constructor function for the YIN pitch dectector.
	pf.YIN = function(config) {
		config = config || {};

		var YIN = {};

		var DEFAULT_THRESHOLD = 0.1,
			DEFAULT_BUFFER_SIZE = 2048,
			DEFAULT_SAMPLE_RATE = 44100,
			threshold = config.threshold || DEFAULT_THRESHOLD,
			sampleRate = config.sampleRate || DEFAULT_SAMPLE_RATE,
			bufferSize = config.bufferSize || DEFAULT_BUFFER_SIZE,
			yinBuffer = new Float32Array(bufferSize / 2),
			yinBufferLength = bufferSize / 2,
			result = {};

		// Implements the difference function as described in step 2 of the YIN paper.
		var difference = function(float32AudioBuffer) {
			var index, delta;
			for (var tau = 0; tau < yinBufferLength; tau++) {
				yinBuffer[tau] = 0;
			}
			for (tau = 1; tau < yinBufferLength; tau++) {
				for (index = 0; index < yinBufferLength; index++) {
					delta = float32AudioBuffer[index] - float32AudioBuffer[index + tau];
					yinBuffer[tau] += delta * delta;
				}
			}
		};

		// Implements the cumulative mean normalized difference as described in step 3 of the paper.
		var cumulativeMeanNormalizedDifference = function() {
			yinBuffer[0] = 1;
			yinBuffer[1] = 1;
			var runningSum = 0;
			for (var tau = 1; tau < yinBufferLength; tau++) {
				runningSum += yinBuffer[tau];
				yinBuffer[tau] *= tau / runningSum;
			}
		};

		var absoluteThreshold = function() {
			// Since the first two positions in the array are 1,
			// we can start at the third position.
			for (var tau = 2; tau < yinBufferLength; tau++) {
				if (yinBuffer[tau] < threshold) {
					while (tau + 1 < yinBufferLength && yinBuffer[tau + 1] < yinBuffer[tau]) {
						tau++;
					}
					// found tau, exit loop and return
					// store the probability
					// From the YIN paper: The threshold determines the list of
					// candidates admitted to the set, and can be interpreted as the
					// proportion of aperiodic power tolerated
					// within a periodic signal.
					//
					// Since we want the periodicity and and not aperiodicity:
					// periodicity = 1 - aperiodicity
					result.probability = 1 - yinBuffer[tau];
					break;
				}
			}

			// if no pitch found, set tau to -1
			if (tau == yinBufferLength || yinBuffer[tau] >= threshold) {
				tau = -1;
				result.probability = 0;
				result.foundPitch = false;
			} else {
				result.foundPitch = true;
			}

			return tau;
		};

		/**
		 * Implements step 5 of the AUBIO_YIN paper. It refines the estimated tau
		 * value using parabolic interpolation. This is needed to detect higher
		 * frequencies more precisely. See http://fizyka.umk.pl/nrbook/c10-2.pdf and
		 * for more background
		 * http://fedc.wiwi.hu-berlin.de/xplore/tutorials/xegbohtmlnode62.html
		 */

		var parabolicInterpolation = function(tauEstimate) {
			var betterTau, x0, x2;

			if (tauEstimate < 1) {
				x0 = tauEstimate;
			} else {
				x0 = tauEstimate - 1;
			}
			if (tauEstimate + 1 < yinBufferLength) {
				x2 = tauEstimate + 1;
			} else {
				x2 = tauEstimate;
			}
			if (x0 === tauEstimate) {
				if (yinBuffer[tauEstimate] <= yinBuffer[x2]) {
					betterTau = tauEstimate;
				} else {
					betterTau = x2;
				}
			} else if (x2 === tauEstimate) {
				if (yinBuffer[tauEstimate] <= yinBuffer[x0]) {
					betterTau = tauEstimate;
				} else {
					betterTau = x0;
				}
			} else {
				var s0, s1, s2;
				s0 = yinBuffer[x0];
				s1 = yinBuffer[tauEstimate];
				s2 = yinBuffer[x2];
				// fixed AUBIO implementation, thanks to Karl Helgason:
				// (2.0f * s1 - s2 - s0) was incorrectly multiplied with -1
				betterTau = tauEstimate + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
			}
			return betterTau;
		};

		// Return the pitch of a given signal, or -1 if none is detected.
		return function(float32AudioBuffer) {
			// Step 2
			difference(float32AudioBuffer);

			// Step 3
			cumulativeMeanNormalizedDifference();

			// Step 4
			var tauEstimate = absoluteThreshold();

			// Step 5
			if (tauEstimate !== -1) {
				var betterTau = parabolicInterpolation(tauEstimate);

				// TODO: optimization!

				result.freq = sampleRate / betterTau;
			} else {
				result.freq = -1;
			}

			// Good luck!
			return result;
		};
	};

	// Construtor function for Dynamic Wavelet detector
	pf.DW = function(config) {
		config = config || {};

		var maxFLWTlevels = 6,
			maxF = 3000,
			differenceLevelsN = 3,
			maximaThresholdRatio = 0.75,
			sampleRate = config.sampleRate || 44100,
			bufferLength = config.bufferSize || 1024,
			distances = [],
			mins = [],
			maxs = [],
			result = {};

		return function(float32AudioBuffer) {
			var pitchF = -1,
				curSamNb = float32AudioBuffer.length,
				nbMins,
				nbMaxs,
				amplitudeThreshold,
				theDC = 0,
				minValue = 0,
				maxValue = 0;

			// Compute max amplitude, amplitude threshold, and the DC.
			for (var i = 0; i < bufferLength; i++) {
				var sample = float32AudioBuffer[i];
				theDC = theDC + sample;
				maxValue = Math.max(maxValue, sample);
				minValue = Math.min(minValue, sample);
			}

			theDC = theDC / bufferLength;
			minValue -= theDC;
			maxValue -= theDC;
			var amplitudeMax = maxValue > -1 * minValue ? maxValue : -1 * minValue;

			amplitudeThreshold = amplitudeMax * maximaThresholdRatio;

			// levels, start without downsampling...
			var curLevel = 0,
				curModeDistance = -1,
				delta;

			// Search:
			while (true) {
				delta = ~~(sampleRate / (Math.pow(2, curLevel) * maxF));
				if (curSamNb < 2) break;

				var dv,
					previousDV = -1000,
					lastMinIndex = -1000000,
					lastMaxIndex = -1000000,
					findMax = false,
					findMin = false;

				nbMins = 0;
				nbMaxs = 0;

				for (var i = 2; i < curSamNb; i++) {
					var si = float32AudioBuffer[i] - theDC,
						si1 = float32AudioBuffer[i - 1] - theDC;

					if (si1 <= 0 && si > 0) findMax = true;
					if (si1 >= 0 && si < 0) findMin = true;

					// min or max ?
					dv = si - si1;

					if (previousDV > -1000) {
						if (findMin && previousDV < 0 && dv >= 0) {
							// minimum
							if (Math.abs(si) >= amplitudeThreshold) {
								if (i > lastMinIndex + delta) {
									mins[nbMins++] = i;
									lastMinIndex = i;
									findMin = false;
								}
							}
						}

						if (findMax && previousDV > 0 && dv <= 0) {
							// maximum
							if (Math.abs(si) >= amplitudeThreshold) {
								if (i > lastMinIndex + delta) {
									maxs[nbMaxs++] = i;
									lastMaxIndex = i;
									findMax = false;
								}
							}
						}
					}
					previousDV = dv;
				}

				if (nbMins === 0 && nbMaxs === 0) {
					// No best distance found!
					break;
				}

				var d,
					distances = [];

				for (var i = 0; i < nbMins; i++) {
					for (var j = 1; j < differenceLevelsN; j++) {
						if (i + j < nbMins) {
							d = Math.abs(mins[i] - mins[i + j]);
							distances[d] = distances[d] + 1;
						}
					}
				}

				var bestDistance = -1,
					bestValue = -1;

				for (var i = 0; i < curSamNb; i++) {
					var summed = 0;
					for (var j = -delta; j <= delta; j++) {
						if (i + j >= 0 && i + j < curSamNb) {
							summed += distances[i + j];
						}
					}

					if (summed === bestValue) {
						if (i === 2 * bestDistance) {
							bestDistance = i;
						}
					} else if (summed > bestValue) {
						bestValue = summed;
						bestDistance = i;
					}
				}

				// averaging
				var distAvg = 0,
					nbDists = 0;
				for (var j = -delta; j <= delta; j++) {
					if (bestDistance + j >= 0 && bestDistance + j < bufferLength) {
						var nbDist = distances[bestDistance + j];
						if (nbDist > 0) {
							nbDists += nbDist;
							distAvg += (bestDistance + j) * nbDist;
						}
					}
				}

				// This is our mode distance.
				distAvg /= nbDists;

				// Continue the levels?
				if (curModeDistance > -1) {
					var similarity = Math.abs(distAvg * 2 - curModeDistance);
					if (similarity <= 2 * delta) {
						// two consecutive similar mode distances : ok !
						pitchF = sampleRate / (Math.pow(2, curLevel - 1) * curModeDistance);
						break;
					}
				}

				// not similar, continue next level;
				curModeDistance = distAvg;

				curLevel++;
				if (curLevel >= maxFLWTlevels || curSamNb < 2) {
					break;
				}

				//do not modify original audio buffer, make a copy buffer, if
				//downsampling is needed (only once).
				var newFloat32AudioBuffer = float32AudioBuffer.subarray(0);
				if (curSamNb === distances.length) {
					newFloat32AudioBuffer = new Float32Array(curSamNb / 2);
				}
				for (var i = 0; i < curSamNb / 2; i++) {
					newFloat32AudioBuffer[i] =
						(float32AudioBuffer[2 * i] + float32AudioBuffer[2 * i + 1]) / 2;
				}
				float32AudioBuffer = newFloat32AudioBuffer;
				curSamNb /= 2;
			}

			result.freq = pitchF;

			return result;
		};
	};

	// Constructor function for McLeod Pitch Method detector.
	// Note: Quite slow..
	pf.MPM = function(config) {
		config = config || {};

		/**
		 * The expected size of an audio buffer (in samples).
		 */
		var DEFAULT_BUFFER_SIZE = 1024,
			/**
			 * Defines the relative size the chosen peak (pitch) has. 0.93 means: choose
			 * the first peak that is higher than 93% of the highest peak detected. 93%
			 * is the default value used in the Tartini user interface.
			 */
			DEFAULT_CUTOFF = 0.97,
			DEFAULT_SAMPLE_RATE = 44100,
			/**
			 * For performance reasons, peaks below this cutoff are not even considered.
			 */
			SMALL_CUTOFF = 0.5,
			/**
			 * Pitch annotations below this threshold are considered invalid, they are
			 * ignored.
			 */
			LOWER_PITCH_CUTOFF = 88,
			/**
			 * Defines the relative size the chosen peak (pitch) has.
			 */
			cutoff = config.cutoff || DEFAULT_CUTOFF,
			/**
			 * The audio sample rate. Most audio has a sample rate of 44.1kHz.
			 */
			sampleRate = config.sampleRate || DEFAULT_SAMPLE_RATE,
			/**
			 * Size of the input buffer.
			 */
			bufferSize = config.bufferSize || DEFAULT_BUFFER_SIZE,
			/**
			 * Contains a normalized square difference function value for each delay
			 * (tau).
			 */
			nsdf = new Float32Array(bufferSize),
			/**
			 * The x and y coordinate of the top of the curve (nsdf).
			 */
			turningPointX,
			turningPointY,
			/**
			 * A list with minimum and maximum values of the nsdf curve.
			 */
			maxPositions = [],
			/**
			 * A list of estimates of the period of the signal (in samples).
			 */
			periodEstimates = [],
			/**
			 * A list of estimates of the amplitudes corresponding with the period
			 * estimates.
			 */
			ampEstimates = [],
			/**
			 * The result of the pitch detection iteration.
			 */
			result = {};

		/**
		 * Implements the normalized square difference function. See section 4 (and
		 * the explanation before) in the MPM article. This calculation can be
		 * optimized by using an FFT. The results should remain the same.
		 */
		var normalizedSquareDifference = function(float32AudioBuffer) {
			for (var tau = 0; tau < float32AudioBuffer.length; tau++) {
				var acf = 0,
					divisorM = 0;
				for (var i = 0; i < float32AudioBuffer.length - tau; i++) {
					acf += float32AudioBuffer[i] * float32AudioBuffer[i + tau];
					divisorM +=
						float32AudioBuffer[i] * float32AudioBuffer[i] +
						float32AudioBuffer[i + tau] * float32AudioBuffer[i + tau];
				}
				nsdf[tau] = 2 * acf / divisorM;
			}
		};

		/**
		 * Finds the x value corresponding with the peak of a parabola.
		 * Interpolates between three consecutive points centered on tau.
		 */
		var parabolicInterpolation = function(tau) {
			var nsdfa = nsdf[tau - 1],
				nsdfb = nsdf[tau],
				nsdfc = nsdf[tau + 1],
				bValue = tau,
				bottom = nsdfc + nsdfa - 0.5 * nsdfb;
			if (bottom == 0) {
				turningPointX = bValue;
				turningPointY = nsdfb;
			} else {
				var delta = nsdfa - nsdfc;
				turningPointX = bValue + delta / (2 * bottom);
				turningPointY = nsdfb - delta * delta / (8 * bottom);
			}
		};

		// Finds the highest value between each pair of positive zero crossings.
		var peakPicking = function() {
			var pos = 0,
				curMaxPos = 0;

			// find the first negative zero crossing.
			while (pos < (nsdf.length - 1) / 3 && nsdf[pos] > 0) {
				pos++;
			}

			// loop over all the values below zero.
			while (pos < nsdf.length - 1 && nsdf[pos] <= 0) {
				pos++;
			}

			// can happen if output[0] is NAN
			if (pos == 0) {
				pos = 1;
			}

			while (pos < nsdf.length - 1) {
				if (nsdf[pos] > nsdf[pos - 1] && nsdf[pos] >= nsdf[pos + 1]) {
					if (curMaxPos == 0) {
						// the first max (between zero crossings)
						curMaxPos = pos;
					} else if (nsdf[pos] > nsdf[curMaxPos]) {
						// a higher max (between the zero crossings)
						curMaxPos = pos;
					}
				}
				pos++;
				// a negative zero crossing
				if (pos < nsdf.length - 1 && nsdf[pos] <= 0) {
					// if there was a maximum add it to the list of maxima
					if (curMaxPos > 0) {
						maxPositions.push(curMaxPos);
						curMaxPos = 0; // clear the maximum position, so we start
						// looking for a new ones
					}
					while (pos < nsdf.length - 1 && nsdf[pos] <= 0) {
						pos++; // loop over all the values below zero
					}
				}
			}
			if (curMaxPos > 0) {
				maxPositions.push(curMaxPos);
			}
		};

		return function(float32AudioBuffer) {
			// 0. Clear old results.
			var pitch;
			maxPositions = [];
			periodEstimates = [];
			ampEstimates = [];

			// 1. Calculute the normalized square difference for each Tau value.
			normalizedSquareDifference(float32AudioBuffer);
			// 2. Peak picking time: time to pick some peaks.
			peakPicking();

			var highestAmplitude = -100;

			console.log("step1 (" + maxPositions.length);
			for (var i = 0; i < maxPositions.length; i++) {
				var tau = maxPositions[i];
				// make sure every annotation has a probability attached
				highestAmplitude =
					highestAmplitude < nsdf[tau] ? nsdf[tau] : highestAmplitude;

				if (nsdf[tau] > SMALL_CUTOFF) {
					// calculates turningPointX and Y
					parabolicInterpolation(tau);
					// store the turning points
					ampEstimates.push(turningPointY);
					periodEstimates.push(turningPointX);
					// remember the highest amplitude

					highestAmplitude =
						highestAmplitude < turningPointY ? turningPointY : highestAmplitude;
				}
			}

			if (periodEstimates.length) {
				// use the overall maximum to calculate a cutoff.
				// The cutoff value is based on the highest value and a relative
				// threshold.
				var actualCutoff = cutoff * highestAmplitude,
					periodIndex = 0;

				console.log("actualCutoff" + actualCutoff);
				console.log("cutoff" + cutoff);
				console.log("highestAmplitude" + highestAmplitude);

				for (var i = 0; i < ampEstimates.length; i++) {
					if (ampEstimates[i] >= actualCutoff) {
						periodIndex = i;
						break;
					}
				}

				var period = periodEstimates[periodIndex],
					pitchEstimate = sampleRate / period;

				console.log("periodIndex" + periodIndex);
				console.log("ampEstimates.length" + ampEstimates.length);
				console.log("period" + period);
				console.log("sampleRate" + sampleRate);
				console.log("pitchEstimate" + pitchEstimate);

				if (pitchEstimate > LOWER_PITCH_CUTOFF) {
					pitch = pitchEstimate;
				} else {
					pitch = -1;
				}
			} else {
				// no pitch detected.
				pitch = -1;
			}

			result.probability = highestAmplitude;
			result.freq = pitch;
			return result;
		};
	};
})(PitchFinder);

class Tuner {
	constructor() {
		this.timer = 0;
		this.notfound = 0;
		this.hasplayed = 0;
		this.prev_note = "";
		this.past_values = [];
		this.YIN = PitchFinder.AMDF({sampleRate: 48000});
		this.elements = {
      agent: document.querySelector("#agent"),
			arrow: document.querySelector("#arrow"),
			note: document.querySelector("#note"),
			container: document.querySelector("#container"),
			canv: document.querySelector("#canv")
		};
		this.ctx = this.elements.canv.getContext("2d");
		
		this.elements.canv.width = this.ctx.width = window.innerWidth;
		this.elements.canv.height = this.ctx.height = window.innerHeight;
		this.ctx.strokeStyle = "#f3f3f3";
		this.ctx.lineWidth = "2";

		this.pitch_data = {
			arr: new Float32Array(2048),
			estimate: null,
			o: "",
			dist: 255
		};

		this.audio = {
			context: null,
			source_node: null,
			gain_node: null,
			analyser: null
		};
		
		// http://pages.mtu.edu/~suits/notefreqs.html
		this.notes = JSON.parse(
			`{"A0":{"freq":27.5,"key":1},"A#0/Bb0":{"freq":29.14,"key":2},"B0":{"freq":30.87,"key":3},"C1":{"freq":32.7,"key":4},"C#1/Db1":{"freq":34.65,"key":5},"D1":{"freq":36.71,"key":6},"D#1/Eb1":{"freq":38.89,"key":7},"E1":{"freq":41.2,"key":8},"F1":{"freq":43.65,"key":9},"F#1/Gb1":{"freq":46.25,"key":10},"G1":{"freq":49,"key":11},"G#1/Ab1":{"freq":51.91,"key":12},"A1":{"freq":55,"key":13},"A#1/Bb1":{"freq":58.27,"key":14},"B1":{"freq":61.74,"key":15},"C2":{"freq":65.41,"key":16},"C#2/Db2":{"freq":69.3,"key":17},"D2":{"freq":73.42,"key":18},"D#2/Eb2":{"freq":77.78,"key":19},"E2":{"freq":82.41,"key":20},"F2":{"freq":87.31,"key":21},"F#2/Gb2":{"freq":92.5,"key":22},"G2":{"freq":98,"key":23},"G#2/Ab2":{"freq":103.83,"key":24},"A2":{"freq":110,"key":25},"A#2/Bb2":{"freq":116.54,"key":26},"B2":{"freq":123.47,"key":27},"C3":{"freq":130.81,"key":28},"C#3/Db3":{"freq":138.59,"key":29},"D3":{"freq":146.83,"key":30},"D#3/Eb3":{"freq":155.56,"key":31},"E3":{"freq":164.81,"key":32},"F3":{"freq":174.61,"key":33},"F#3/Gb3":{"freq":185,"key":34},"G3":{"freq":196,"key":35},"G#3/Ab3":{"freq":207.65,"key":36},"A3":{"freq":220,"key":37},"A#3/Bb3":{"freq":233.08,"key":38},"B3":{"freq":246.94,"key":39},"C4":{"freq":261.63,"key":40},"C#4/Db4":{"freq":277.18,"key":41},"D4":{"freq":293.66,"key":42},"D#4/Eb4":{"freq":311.13,"key":43},"E4":{"freq":329.63,"key":44},"F4":{"freq":349.23,"key":45},"F#4/Gb4":{"freq":369.99,"key":46},"G4":{"freq":392,"key":47},"G#4/Ab4":{"freq":415.3,"key":48},"A4":{"freq":440,"key":49},"A#4/Bb4":{"freq":466.16,"key":50},"B4":{"freq":493.88,"key":51},"C5":{"freq":523.25,"key":52},"C#5/Db5":{"freq":554.37,"key":53},"D5":{"freq":587.33,"key":54},"D#5/Eb5":{"freq":622.25,"key":55},"E5":{"freq":659.25,"key":56},"F5":{"freq":698.46,"key":57},"F#5/Gb5":{"freq":739.99,"key":58},"G5":{"freq":783.99,"key":59},"G#5/Ab5":{"freq":830.61,"key":60},"A5":{"freq":880,"key":61},"A#5/Bb5":{"freq":932.33,"key":62},"B5":{"freq":987.77,"key":63},"C6":{"freq":1046.5,"key":64},"C#6/Db6":{"freq":1108.73,"key":65},"D6":{"freq":1174.66,"key":66},"D#6/Eb6":{"freq":1244.51,"key":67},"E6":{"freq":1318.51,"key":68},"F6":{"freq":1396.91,"key":69},"F#6/Gb6":{"freq":1479.98,"key":70},"G6":{"freq":1567.98,"key":71},"G#6/Ab6":{"freq":1661.22,"key":72},"A6":{"freq":1760,"key":73},"A#6/Bb6":{"freq":1864.66,"key":74},"B6":{"freq":1975.53,"key":75},"C7":{"freq":2093,"key":76},"C#7/Db7":{"freq":2217.46,"key":77},"D7":{"freq":2349.32,"key":78},"D#7/Eb7":{"freq":2489.02,"key":79},"E7":{"freq":2637.02,"key":80},"F7":{"freq":2793.83,"key":81},"F#7/Gb7":{"freq":2959.96,"key":82},"G7":{"freq":3135.96,"key":83},"G#7/Ab7":{"freq":3322.44,"key":84},"A7":{"freq":3520,"key":85},"A#7/Bb7":{"freq":3729.31,"key":86},"B7":{"freq":3951.07,"key":87},"C8":{"freq":4186.01,"key":88},"C#8/Db8":{"freq":4434.92,"key":89},"D8":{"freq":4698.63,"key":90},"D#8/Eb8":{"freq":4978.03,"key":91},"E8":{"freq":5274.04,"key":92},"F8":{"freq":5587.65,"key":93},"F#8/Gb8":{"freq":5919.91,"key":94},"G8":{"freq":6271.93,"key":95},"G#8/Ab8":{"freq":6644.88,"key":96},"A8":{"freq":7040,"key":97},"A#8/Bb8":{"freq":7458.62,"key":98},"B8":{"freq":7902.13,"key":99}}`
		);
	}
	prepare_audio() {
		this.audio.gain_node.onaudioprocess = (audio_processing_event) => {
			let inp = audio_processing_event.inputBuffer;
			let out = audio_processing_event.outputBuffer;

			for(let channel = 0; channel < 2; channel++) {
				let i = inp.getChannelData(channel);
				let o = out.getChannelData(channel);

				for(let n = 0; n < inp.length; n++) {
					o[n] = i[n];
					o[n] *= 2.5;
				}
			}
		};
		this.audio.source_node.connect(this.audio.gain_node);

		this.audio.gain_node.connect(this.audio.analyser);
		//this.audio.analyser.connect(this.audio.context.destination);
	}
	init() {
		navigator.getUserMedia(
			{audio: true},
			(stream) => {
				this.audio.context = new AudioContext();
				this.audio.source_node = this.audio.context.createMediaStreamSource(stream);
				this.audio.gain_node = this.audio.context.createScriptProcessor(256, 2, 2);
				this.audio.analyser = this.audio.context.createAnalyser();
				
				this.prepare_audio();
				this.get_pitch(this);
			},
			(err) => {
				this.elements.note.innerText = "Microphone access disallowed.";
				this.elements.container.classList.add("out");
			}
		);
	}
	get_pitch(self) {
		if(self.timer == 0) {
			self.audio.analyser.getFloatTimeDomainData(self.pitch_data.arr);
			self.pitch_data.estimate = self.YIN(self.pitch_data.arr);
			
			this.pitch_data.dist = 255;

			for(let key in self.notes) {
				if(
					Math.abs(self.notes[key].freq - self.pitch_data.estimate.freq) <
					self.pitch_data.dist
				) {
					self.pitch_data.dist = Math.abs(
						self.notes[key].freq - self.pitch_data.estimate.freq
					);
					self.pitch_data.o = key;
				}
			}

			self.draw();
		}

		self.timer++;
		if(self.timer > 10) {
			self.timer = 0;
		}
		requestAnimationFrame(()=>{self.get_pitch(self)});
	}
	calculate_position(){
		return Math.floor(
			(
				((window.innerWidth / 2) - 25) // Center of screen (25px = half of arrow's width)
				- ((this.notes[this.pitch_data.o].freq - this.pitch_data.estimate.freq)*15) // Distance from correct pitch, amplified to make more apparent
			)
		);
	}
  calculateAgentPosition(){
    //var stepSize = window.innerHeight/range;
    		var pos = Math.floor(
			(
				((stepSize * groundHeight)) // Center of screen
				+ (this.notes[this.pitch_data.o].key-rootKey)*stepSize // Distance from C4 or selected root key
			)
		);
    console.log(this.notes[this.pitch_data.o].key);
    return pos;
  }
	draw(){
		if(this.pitch_data.o !== undefined &&
			 this.pitch_data.dist < 255 &&
			 (this.notes[this.pitch_data.o].freq > 100 &&
				this.pitch_data.estimate.freq < 10000 &&
				this.pitch_data.estimate.freq > 100)
			){
			this.elements.arrow.style.left = this.calculate_position() + 'px';
			this.elements.arrow.style.top = '0px';
      this.elements.agent.style.bottom = this.calculateAgentPosition() + 'px';
			this.elements.note.innerHTML = `${this.pitch_data.o}`;//<br>(${this.pitch_data.estimate.freq.toFixed(1)}hz)`;
      speech.style.display = "block";
					
			if(Math.abs(this.notes[this.pitch_data.o].freq - this.pitch_data.estimate.freq)*15 > 50){
				this.elements.container.classList.add('out');
			} else {
				this.elements.container.classList.remove('out');
			}
						
			if(this.prev_note !== this.pitch_data.o){
				this.past_values = [];
			}
			this.prev_note = this.pitch_data.o;
			this.past_values.push(this.calculate_position()+25);
						
			this.draw_values();
				
			this.hasplayed = 1;
      //traverse();
		} else {
      speech.style.display = "none";
			this.notfound += 1;
			if(this.notfound >= 10 && this.hasplayed){
				this.elements.arrow.style.top = '-100px';
				this.elements.note.innerText = 'Sing OM!';
				this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
				this.notfound = 0;
			}
		}
	}
	draw_values(){
		this.past_values.reverse();
		this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		this.ctx.beginPath();
		this.ctx.moveTo(this.past_values[0], 52);
		this.past_values.forEach((e, i) => {
			this.ctx.lineTo(e, (i * 25) + 52);
		});
		this.ctx.stroke();
		this.past_values.reverse();
	}
}

let t = new Tuner();
t.init();

window.onresize = () => {
	t.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	t.past_values = [];
};


