import {desk} from "@shared/desk";
import {wrap,rect,type Frame} from "@shared/surface";
const seeds=[[0,3,6,10,12,15,17,22,27,30],[1,4,7,9,13,18,23,24,28],[0,2,5,8,11,14,19,25,31]];
const routes=[[3,8],[4,8],[3,9]];const creases=[1,2,3,4,5,6,7,1,2,3];
function fold(cells:number[],sel:number){const axis=sel>=7,k=creases[sel],o:number[]=[];
 for(const n of cells){let x=n%8,y=Math.floor(n/8);if(axis&&y>=k)y=2*k-y-1;else if(!axis&&x>=k)x=2*k-x-1;
 if(x<0||y<0)return cells.slice();const id=y*8+x;if(!o.includes(id))o.push(id);}return o.sort((a,b)=>a-b);}
type S={level:number;sel:number;hist:number[][];note:string};
function target(i:number){return routes[i].reduce((a,k)=>fold(a,k),seeds[i]);}
desk<S>({name:"Fold Echo",accent:"#6DA9E9",motion:{enabled:false},initial:()=>({level:0,sel:3,hist:[seeds[0]],note:"Choose a crease"}),render:s=>{
 const a=s.hist[s.hist.length-1],goal=target(s.level),art:Frame=[];for(const [j,set] of [a,goal].entries())for(const n of set)art.push(rect("p"+j+"-"+n,1+j*37+(n%8)*4,Math.floor(n/8)*4,3,3,j?"#80D3BDFF":"#F2A46AFF"));
 art.push(rect("crease",s.sel<7?creases[s.sel]*4:0,s.sel>=7?creases[s.sel]*4:0,s.sel<7?1:32,s.sel<7?16:1,"#DBE4D9FF"));return {art,title:"",value:"",lines:["Fold "+(s.level+1)+" / "+seeds.length,s.note,(s.sel>=7?"Horizontal ":"Vertical ")+creases[s.sel],"Left: sheet / right: target","Wheel: crease / click: fold","Start: undo / hold: reset"]};},
 action:(s,k)=>{if(k==="up"||k==="down")s.sel=wrap(s.sel+(k==="up"?1:-1),creases.length);
 if(k==="start"&&s.hist.length>1){s.hist.pop();s.note="Fold undone";}if(k==="hold-start"){s.hist=[seeds[s.level]];s.note="Choose a crease";}
 if(k==="ok"){if(s.note==="Matched"){s.level=wrap(s.level+1,seeds.length);s.hist=[seeds[s.level]];s.note="Choose a crease";return;}
 const old=s.hist[s.hist.length-1],next=fold(old,s.sel);if(next.join()===old.join()){s.note="Try another crease";return;}
 s.hist.push(next);s.note=next.join()===target(s.level).join()?"Matched":"Folded";}}});
