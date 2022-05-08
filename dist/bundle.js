(()=>{"use strict";var e;!function(e){e[e.NONE=-1]="NONE",e[e.ONE=1]="ONE",e[e.TWO=2]="TWO",e[e.THREE=3]="THREE",e[e.FOUR=4]="FOUR",e[e.FIVE=5]="FIVE",e[e.SIX=6]="SIX",e[e.SEVEN=7]="SEVEN",e[e.EIGHT=8]="EIGHT",e[e.NINE=9]="NINE"}(e||(e={}));const t=[e.ONE,e.TWO,e.THREE,e.FOUR,e.FIVE,e.SIX,e.SEVEN,e.EIGHT,e.NINE],l=t=>{switch(t){case"1":return e.ONE;case"2":return e.TWO;case"3":return e.THREE;case"4":return e.FOUR;case"5":return e.FIVE;case"6":return e.SIX;case"7":return e.SEVEN;case"8":return e.EIGHT;case"9":return e.NINE;default:return e.NONE}};class s{constructor(t,l){this.i=t,this.j=l,this._value=e.NONE,this._possibilities=s.allPossibilities}get isSolved(){return this._value!=e.NONE}get possibilities(){return this._possibilities}get value(){return this._value}set value(t){t!=e.NONE&&0!=this.isValueAPossibility(t)&&(this._value=t)}isValueAPossibility(e){return 0!=(this._possibilities&1<<e-1)}get speculatedList(){return this.isSolved?[]:t.filter((e=>this.isValueAPossibility(e)))}set speculatedValue(t){t!=e.NONE&&(this._possibilities|=1<<t-1)}set unspeculatedValue(t){t!=e.NONE&&(this._possibilities&=~(1<<t-1))}reset(){this._possibilities=s.allPossibilities,this._value=e.NONE}}s.allPossibilities=511;const i=(e,t)=>e>=0&&e<9&&t>=0&&t<9,o=(e,t)=>3*Math.floor(e/3)+Math.floor(t/3);class r extends class{constructor(){this._cells=[]}get cells(){return this._cells}addCellToGroup(e){this._cells.push(e)}}{validate(){let t=0;for(let l of this._cells)if(l.value!=e.NONE){let e=1<<l.value-1;if(0!=(e&t))return!1;t|=e}return!0}}const n=Error("invalid index provided"),a=e=>{let t=/s-([0-9])-([0-9])/g.exec(e);return null==t?null:{i:parseInt(t[1]),j:parseInt(t[2])}},d="sudoku-success",h="sudoku-failure",c="sudoku-editable",u="sudoku-edited",f="edit-options-btn",b="d-none";class p extends s{constructor(e,t,l){super(t,l),this.element=e,this.elementStyle=new Map,this.element.id=((e,t)=>`s-${e}-${t}`)(t,l),this.element.classList.add("sudoku-cell")}addClass(e){this.element.classList.add(e)}removeClass(e){this.element.classList.remove(e)}get style(){let e=[];for(let t of this.elementStyle.entries())e.push(`${t[0]}:${t[1]}`);return e.join(";")}resize(e,t){this.element.setAttribute("width",`${e}`),this.element.setAttribute("height",`${e}`),this.elementStyle.set("font-size",t),this.element.setAttribute("style",this.style)}set onClick(e){this.element.onclick=e}render(t){this.element.innerHTML=null==t?this.value==e.NONE?"":`${this.value}`:t}}class m{constructor(){this.timer=void 0,this.blinkCounter=0,this.currentBlinkingCell=null}reset(){null!=this.timer&&(clearInterval(this.timer),this.timer=void 0),this.blinkCounter=0,[d,h].forEach((e=>{var t;return null===(t=this.currentBlinkingCell)||void 0===t?void 0:t.removeClass(e)})),this.currentBlinkingCell=null}blink(e,t){null!=this.timer&&this.reset(),this.currentBlinkingCell=e;let l=t?d:h;this.timer=setInterval((()=>{6==this.blinkCounter?this.reset():(this.blinkCounter%2==0?e.addClass(l):e.removeClass(l),this.blinkCounter++)}),200)}blinkForSuccess(e){this.blink(e,!0)}blinkForFailure(e){this.blink(e,!1)}}class E extends class{constructor(e=((e,t)=>new s(e,t))){this.rowValidators=[],this.columnValidators=[],this.blockValidators=[],this.board=[];for(let e=0;e<9;e++)this.rowValidators.push(new r),this.columnValidators.push(new r),this.blockValidators.push(new r);for(let t=0;t<9;t++){let l=[];for(let s=0;s<9;s++){const i=e(t,s);l.push(i),this.rowValidators[t].addCellToGroup(i),this.columnValidators[s].addCellToGroup(i),this.blockValidators[o(t,s)].addCellToGroup(i)}this.board.push(l)}}validateCell(e,t){if(!i(e,t))throw n;return this.rowValidators[e].validate()&&this.columnValidators[t].validate()&&this.blockValidators[o(e,t)].validate()}validateBoard(){for(let e=0;e<9;e++)if(0==this.rowValidators[e].validate()||0==this.columnValidators[e].validate()||0==this.blockValidators[e].validate())return!1;return!0}setValueToCell(t,l,s){if(!i(t,l))throw n;let r=this.board[t][l].value;if(r==s)return!0;if(s==e.NONE)this.board[t][l].reset(),this.rowValidators[t].cells.forEach((e=>this.board[t][l].unspeculatedValue=e.value)),this.columnValidators[l].cells.forEach((e=>this.board[t][l].unspeculatedValue=e.value)),this.blockValidators[o(t,l)].cells.forEach((e=>this.board[t][l].unspeculatedValue=e.value));else{if(this.board[t][l].value=s,this.board[t][l].value!=s)return!1;this.rowValidators[t].cells.forEach((e=>e.unspeculatedValue=s)),this.columnValidators[l].cells.forEach((e=>e.unspeculatedValue=s)),this.blockValidators[o(t,l)].cells.forEach((e=>e.unspeculatedValue=s))}return this.rowValidators[t].cells.forEach((e=>e.speculatedValue=r)),this.columnValidators[l].cells.forEach((e=>e.speculatedValue=r)),this.blockValidators[o(t,l)].cells.forEach((e=>e.speculatedValue=r)),!0}getSpeculationsForCell(e,t){if(!i(e,t))throw n;return this.board[e][t].speculatedList}isCellSolved(e,t){if(!i(e,t))throw n;return this.board[e][t].isSolved}get isSolved(){for(let e=0;e<9;e++)for(let t=0;t<9;t++)if(!this.board[e][t].isSolved)return!1;return!0}basicSolver(){return console.log("Using basic solver"),class{static solve(t){for(let l=0;l<9;l++)for(let s=0;s<9;s++)if(t[l][s].value==e.NONE&&!(t[l][s].possibilities&t[l][s].possibilities-1))return{x:l,y:s,value:Math.log2(t[l][s].possibilities)+1};return null}}.solve(this.board)}advancedSolver(){return console.log("Using advanced solver : Crook's algorithm without Random guessing"),class{static solve(e,t,l){const s=e=>{let t=e.filter((e=>0==e.isSolved));for(let e=0;e<t.length;e++){let l=t[e].possibilities;for(let s=0;s<t.length&&(e==s||(l&=~t[s].possibilities,0!=l));s++);if(l>0&&!(l&l-1))return{x:t[e].i,y:t[e].j,value:Math.log2(l)+1}}return null};let i=null;for(let o=0;o<9;o++){if(i=s(e[o].cells),null!=i)return i;if(i=s(t[o].cells),null!=i)return i;if(i=s(l[o].cells),null!=i)return i}const o=e=>{let t=e.filter((e=>0==e.isSolved)),l=[];t.forEach(((e,t)=>l.push({cells:[e],mask:1<<t})));let s={};s[1]=l;for(let e=2;e<t.length;e++){s[e]=[];for(let t of s[e-1])for(let l of s[1])if((t.mask|l.mask)!=t.mask){let i=[...t.cells];i.push(l.cells[0]),s[e].push({cells:i,mask:t.mask|l.mask})}}let i=[];for(let e=2;e<t.length;e++)s[e].filter((e=>{let t=e.cells.reduce(((e,t)=>e|t.possibilities),0);return e.cells.length==(Number(t).toString(2).match(/1/g)||[]).length})).forEach((e=>i.push(e.cells)));return i};let r=[];for(let s=2;s<9;s++)o(e[s].cells).forEach((e=>r.push({cells:e,type:"row"}))),o(t[s].cells).forEach((e=>r.push({cells:e,type:"column"}))),o(l[s].cells).forEach((e=>r.push({cells:e,type:"block"})));for(let s of r){let i=[],o=s.cells[0].i,r=s.cells[0].j;"row"==s.type?i=e[o].cells.filter((e=>!s.cells.includes(e))):"column"==s.type?i=t[r].cells.filter((e=>!s.cells.includes(e))):"block"==s.type&&(i=l[3*Math.floor(o/3)+Math.floor(r/3)].cells.filter((e=>!s.cells.includes(e))));let n=s.cells.reduce(((e,t)=>e|t.possibilities),0),a=[];for(let e=0;e<9;e++)0!=(n&1<<e)&&a.push(e+1);i.forEach((e=>{a.forEach((t=>{e.unspeculatedValue=t}))}))}return null}}.solve(this.rowValidators,this.columnValidators,this.blockValidators)}reset(){for(let e=0;e<9;e++)for(let t=0;t<9;t++)this.board[e][t].reset()}}{constructor(e){let t=[];for(let l=0;l<9;l++){let l=document.createElement("tr");l.classList.add("sudoku-row"),e.appendChild(l),t.push(l)}super(((e,l)=>{let s=document.createElement("td");return t[e].appendChild(s),new p(s,e,l)})),this.element=e,this.colorBlinker=new m,this.elementStyle=new Map,this.element=e}get style(){let e=[];for(let t of this.elementStyle.entries())e.push(`${t[0]}:${t[1]}`);return e.join(";")}resize(e,t,l){this.element.setAttribute("width",`${e}px`),this.element.setAttribute("height",`${e}px`),this.elementStyle.set("top",`${t}px`),this.elementStyle.set("left",`${l}px`),this.element.setAttribute("style",this.style);let s=e/13+"px",i=e/40+"px";for(let e=0;e<9;e++)for(let t=0;t<9;t++)this.board[e][t].resize(s,i)}blinkCellForSuccess(e,t){this.colorBlinker.blinkForSuccess(this.board[e][t])}blinkCellForFailure(e,t){this.colorBlinker.blinkForFailure(this.board[e][t])}*cells(){for(let e=0;e<9;e++)for(let t=0;t<9;t++)yield this.board[e][t]}addClassToCell(e,t,l){if(!i(e,t))throw n;this.board[e][t].addClass(l)}removeClassFromCell(e,t,l){if(!i(e,t))throw n;this.board[e][t].removeClass(l)}render(){for(let e=0;e<9;e++)for(let t=0;t<9;t++)this.board[e][t].render()}}class v{constructor(e){this.element=e,this.elementStyle=new Map,e.onclick=()=>this.onClick()}get disabled(){return this.element.disabled}disable(e){this.element.disabled=e}get style(){let e=[];for(let t of this.elementStyle.entries())e.push(`${t[0]}:${t[1]}`);return e.join(";")}onClick(){this.disabled||this.functionality()}resize(e,t,l){this.elementStyle.set("top",`${t}px`),this.elementStyle.set("left",`${l}px`),this.elementStyle.set("width",`${e}px`),this.elementStyle.set("height",`${e}px`),this.element.setAttribute("style",this.style)}}class g extends v{constructor(l,s,i,o,r){super(l),this.board=s,this.editModeOnIcon=i,this.editModeOffIcon=o,this.afterSuccessfulCellEditing=r,this.editModeState="off",this.currentEditLocation=null,this.editOptsTableElement=document.createElement("table"),this.editOptsTableElement.id="edit-panel";let n=document.createElement("tr");this.editOptsTableElement.appendChild(n);let a=document.createElement("td"),d=document.createElement("button");d.innerHTML=" ",d.classList.add(f),d.onclick=()=>this.uponSelectionFromUser(e.NONE),a.appendChild(d),n.appendChild(a),t.forEach((e=>{let t=document.createElement("td"),l=document.createElement("button");l.classList.add(f),l.innerHTML=`${e}`,l.onclick=()=>this.uponSelectionFromUser(e),t.appendChild(l),n.appendChild(t)})),document.body.appendChild(this.editOptsTableElement),this.resetEditForLocation(),this.editModeOnIcon.classList.add(b)}changeMode(e){if(e!=this.editModeState)switch(this.editModeState=e,e){case"on":this.onEditModeOn();break;case"off":this.onEditModeOff()}}onEditModeOn(){for(let e of this.board.cells())e.addClass(c),e.onClick=e=>{let t=a(e.target.id);null!=t&&this.editForLocation(t)};this.editModeOnIcon.classList.remove(b),this.editModeOffIcon.classList.add(b)}onEditModeOff(){this.resetEditForLocation();for(let e of this.board.cells())e.removeClass(c),e.onClick=null;this.editModeOnIcon.classList.add(b),this.editModeOffIcon.classList.remove(b)}functionality(){"on"==this.editModeState?this.changeMode("off"):this.changeMode("on")}editForLocation(e){this.resetEditForLocation(),this.editOptsTableElement.classList.remove(b),this.currentEditLocation=e,this.board.addClassToCell(e.i,e.j,u)}uponSelectionFromUser(e){null!=this.currentEditLocation&&(this.board.setValueToCell(this.currentEditLocation.i,this.currentEditLocation.j,e)?(this.board.blinkCellForSuccess(this.currentEditLocation.i,this.currentEditLocation.j),this.board.render(),this.afterSuccessfulCellEditing()):this.board.blinkCellForFailure(this.currentEditLocation.i,this.currentEditLocation.j))}resetEditForLocation(){null!=this.currentEditLocation&&(this.board.removeClassFromCell(this.currentEditLocation.i,this.currentEditLocation.j,u),this.currentEditLocation=null),this.editOptsTableElement.classList.add(b)}specializedResize(e,t,l,s,i){var o;this.resize(e,t,l),null===(o=this.editOptsTableElement.firstChild)||void 0===o||o.childNodes.forEach((t=>{t.firstChild.setAttribute("style",`width:${e}px;height:${e}px;font-size:${e/2}px`)})),s-=e,this.editOptsTableElement.setAttribute("style",`top:${s}px;left:${i}px`)}}class S extends v{constructor(e,t,l,s){super(e),this.board=t,this.helperModeOnIcon=l,this.helperModeOffIcon=s,this.helperModeState="off",this.helperModeOnIcon.classList.add(b)}changeMode(e){if(e!=this.helperModeState)switch(this.helperModeState=e,e){case"on":this.onHelperModeOn();break;case"off":this.onHelperModeOff()}}onHelperModeOn(){this.helperModeOffIcon.classList.add(b),this.helperModeOnIcon.classList.remove(b),this.updateHelperText()}onHelperModeOff(){this.helperModeOffIcon.classList.remove(b),this.helperModeOnIcon.classList.add(b);for(let e of this.board.cells())e.render()}functionality(){"on"==this.helperModeState?this.changeMode("off"):this.changeMode("on")}updateHelperText(){if("off"!=this.helperModeState)for(let e of this.board.cells()){let t=e.speculatedList;0!=t.length?e.render(t.join(",")):e.render()}}}const C=[[302080105,7200060,508900047,80400302,30160058,10500670,20345001,26009,90526],[500020900,10680,190083e3,1040006,6070045,70050801,80032009,7045e5,200004e3],[500809,180400060,70010,500000070,649e6,2001e4,90032e3,10005600,700000480],[5700090,1080,300080006,205e5,3002e4,640000070,490000003,8009050,100],[395e5,800070,10904,100400003,0,7000860,6708200,10090005,1008]];class k extends v{constructor(e,t,l){super(e),this.board=t,this.beforeRandomLoad=l}functionality(){this.board.reset();let e=Math.floor(Math.random()*C.length);for(let[t,s]of C[e].entries()){let e=Number(s).toString().padStart(9,"0").match(/.{1,1}/g);null==e||e.forEach(((e,s)=>this.board.setValueToCell(t,s,l(e))))}this.board.render(),this.beforeRandomLoad()}}class M extends v{constructor(e,t,l){super(e),this.board=t,this.beforeReset=l,this.board=t}functionality(){this.beforeReset(),this.board.reset(),this.board.render()}}class y extends v{constructor(e,t,l,s){super(e),this.board=t,this.beforeSolveAttempt=l,this.afterSuccessfulSolve=s,this.board=t}functionality(){if(this.board.isSolved)return;this.beforeSolveAttempt();let e=this.board.basicSolver();null==e&&(e=this.board.advancedSolver(),null==e&&(e=this.board.basicSolver())),null!=e&&(this.board.setValueToCell(e.x,e.y,e.value),this.board.blinkCellForSuccess(e.x,e.y),this.board.render(),this.afterSuccessfulSolve())}}class O extends v{functionality(){throw new Error("Stupid buttons don't have any inherent functionality")}}document.addEventListener("DOMContentLoaded",(function(e){let l=null,s=null,i=null,o=null,r=null,n=null,a=null,d=document.getElementById("sudoku-board");if(null!=d){l=new E(d);for(let e=0;e<9;e++)for(let s=0;s<9;s++){let i=(s+e%3*3+Math.floor(e/3))%9;l.setValueToCell(e,s,t[i])}l.render()}let h=document.getElementById("github-btn");null!=h&&(s=new O(h));let c=document.getElementById("helper-btn"),u=document.getElementById("helper-btn-on"),f=document.getElementById("helper-btn-off");null!=c&&null!=u&&null!=f&&null!=l&&(i=new S(c,l,u,f));let b=document.getElementById("solve-btn");null!=b&&null!=l&&(o=new y(b,l,(()=>null==n?void 0:n.changeMode("off")),(()=>null==i?void 0:i.updateHelperText())));let p=document.getElementById("edit-btn"),m=document.getElementById("edit-btn-on"),v=document.getElementById("edit-btn-off");null!=p&&null!=m&&null!=v&&null!=l&&(n=new g(p,l,m,v,(()=>null==i?void 0:i.updateHelperText())));let C=document.getElementById("reset-btn");null!=C&&null!=l&&(r=new M(C,l,(()=>{null==i||i.changeMode("off"),null==n||n.changeMode("off")})));let V=document.getElementById("random-btn");null!=V&&null!=l&&(a=new k(V,l,(()=>{null==i||i.changeMode("off"),null==n||n.changeMode("off")})));const w=()=>{let e=Math.floor(.8*Math.min(window.innerHeight,window.innerWidth)),t=(window.innerHeight-e)/2,d=(window.innerWidth-e)/2,h=e/20,c=h/2,u=d-h-c,f=d+e+c,b=2*h;null==l||l.resize(e,t,d),null==s||s.resize(h,t,u),null==a||a.resize(h,t+b,u),null==r||r.resize(h,t+2*b,u),null==i||i.resize(h,t,f),null==o||o.resize(h,t+b,f),null==n||n.specializedResize(h,t+4*b,f,t-c,d)};w(),window.onresize=w}))})();