(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=(e,t,n)=>Math.min(n,Math.max(t,e)),t=(e,t,n)=>e+(t-e)*n,n=(t,n,r)=>{let i=e((r-t)/(n-t),0,1);return i*i*(3-2*i)};function r(e){for(;e>Math.PI;)e-=2*Math.PI;for(;e<-Math.PI;)e+=2*Math.PI;return e}function i(e,t){return e=(e%t+t)%t,e>=t/2?e-t:e}var a={gp:{id:`gp`,name:`GP`,vTop:88,accel:26,brake:34,latBase:30,down:.48,steer:.09,wear:1},speedway:{id:`speedway`,name:`Speedway`,vTop:97,accel:22,brake:29,latBase:24,down:.3,steer:.08,wear:.85}};function o(e,t=0){let n=t>e/2?t-e:t;return{L:e,progress:n,prevS:(t%e+e)%e,maxLaps:Math.max(0,Math.floor(n/e))}}function s(e,t){e.progress+=i(t-e.prevS,e.L),e.prevS=t;let n=Math.max(0,Math.floor(e.progress/e.L));return n>e.maxLaps&&(e.maxLaps=n,!0)}var c={asphalt:{grip:1,drag:0},pit:{grip:1,drag:0},kerb:{grip:.95,drag:.05},grass:{grip:.5,drag:.6},gravel:{grip:.35,drag:1.1}};function l(t,n){let r=e(n,0,1);return t===`wet`?.84+.12*r:1-.55*r}function u(t){return 1-.4*e(t,0,1)**1.3}function d({tire:e,wear:t=0,wetness:n=0,surface:r=`asphalt`}){let i=c[r]||c.asphalt;return l(e,n)*u(t)*i.grip}function f(t,n,r,i=1){return(.001+.005*e(Math.abs(n)/50,0,1))*(t===`wet`?1+1.5*(1-e(r,0,1)):1)*i}function p(e,t,n){let r=t/60;return e.latBase*(1+e.down*r*r)*n}function m(e,t,n=1){t=Math.abs(t);let r=e.latBase*n,i=t-r*e.down/3600;return i<=1e-6?e.vTop*1.2:Math.min(e.vTop*1.2,Math.sqrt(r/i))}var h=1.2,g=.42,_=(e,t,n)=>p(e,t,n)*h;function v(t,n,r){let i=e(n/60,0,1.5);return t.brake*(.45+.55*Math.min(1,r))*(1+.25*i*i)}function y(t){let n=e(t,0,1);return Math.max(g,Math.sqrt(1-n*n))}function b(e,t,n,r,i=0){let a=_(e,t,n)*y(i);return v(e,t,n)*r/Math.max(a,1)}function x(t,n,r,i,a=0,o={k:0,excess:0,frac:0}){let s=Math.abs(r),c=n*t.steer/(1+s/28*(s/28)),l=p(t,s,i*y(a))/Math.max(s*s,1),u=e(c,-l,l),d=Math.abs(c)/Math.max(l,1e-4);return o.k=u,o.excess=e(d-1,0,2),o.frac=d,o}var S={k:0,excess:0,frac:0};function C(e,t,n,r,i=0){return x(e,t,n,r,i,S).k}function w(t,n){if(t<0||t>30)return 0;let r=1-e(Math.abs(n)/2.6,0,1),i=1-t/30;return .45*i*i*r}function T(t,{fill:n=0,boosting:r=!1,dt:i}){return r&&t>0?Math.max(0,t-.28*i):e(t+n*i,0,1)}var E={fovDeg:35,pitchDeg:42,widthLandscape:140,widthPortrait:55,carScreenOffset:.55,carScreenOffsetPortrait:.225,blendAspect:[.8,1.2]},D=e=>e*Math.PI/180;function O({x:e,y:t,z:r,yaw:i,aspect:a,zoom:o=1}){let s=E.fovDeg,c=D(E.pitchDeg),l=2*Math.atan(Math.tan(D(s)/2)*a),u=n(E.blendAspect[0],E.blendAspect[1],a),d=E.widthPortrait+(E.widthLandscape-E.widthPortrait)*u,f=E.carScreenOffsetPortrait+(E.carScreenOffset-E.carScreenOffsetPortrait)*u,p=d/2/Math.tan(l/2)*o,m=p*Math.cos(c),h=p*Math.sin(c),g=c+f*D(s)/2,_=Math.max(0,m-h/Math.tan(g)),v=Math.sin(i),y=Math.cos(i),b=[e+v*_,t,r+y*_];return{pos:[b[0]-v*m,t+h,b[2]-y*m],target:b,fov:s,pitchDeg:E.pitchDeg,height:h,distance:p,lead:_}}function k(e,t,n,r,i){let a=e-n,o=(t+r*a)*i,s=Math.exp(-r*i);return[n+(a+o)*s,(t-r*o)*s]}function A(e,t,n,r,i){let a=k(e[t],e[t+`V`]||0,n,r,i);return e[t]=a[0],e[t+`V`]=a[1],e[t]}function j(e,t,n,i){return A(e,`yaw`,e.yaw+r(t-e.yaw),n,i)}function ee(e,t,n,r){let i=e.locate(t,n,r,void 0,60);return e.yAt(i.s)}function M(e,t,n,r=.8){return(n>=0?e.leftWall[t]:e.rightWall[t])-r}function N(e,t,n,r,i=.8,a=12){let o=Math.abs(e.locate(t.x,t.z,r,void 0,60).d),s=0;for(let c=1;c<=a;c++){let l=c/a,u=e.locate(t.x+(n.x-t.x)*l,t.z+(n.z-t.z)*l,r,void 0,60);if(Math.abs(u.d)>M(e,u.i,u.d,i)&&Math.abs(u.d)>o+.05)break;s=l}return s}var P=.26,F=.9,te=1.95,ne=4.3,re=3.2,ie=18*Math.PI/180,ae=21*Math.PI/180,oe=[0,.25,.5,.75,1],se={set(e,t,n){return this.x=e,this.y=t,this.z=n,this}};function ce(e,t,n,r){let i=1e9;for(let a=n;a<=r;a+=5){let n=e._idx(t+a)[0];i=Math.min(i,e.leftWall[n],e.rightWall[n])}return i}function le(t,i,a,o,s={}){let c=s.fovDeg??62,l=s.aspect??16/9,u=e(i.v/80,0,1),d=n(8,16,ce(a,i.s,-10,15+i.v*.8)),f=(8+u*2.4)*(.68+.32*d),p=12+u*8,m=a.yAt(i.s);t.init||(t.init=!0,t.yaw=i.theta,t.ox=-Math.sin(i.theta)*f,t.oz=-Math.cos(i.theta)*f,t.oy=F+P*f,t.ly=1,t.pull=1,t.swing=0,t.oxV=t.ozV=t.oyV=t.yawV=t.lyV=t.swingV=0);let h=a.thetaAt(i.s+2),g=h+e(r(i.theta-h),-.6,.6);a.at(i.s-f,(i.d??0)*.5,se);let _=r(Math.atan2(i.x-se.x,i.z-se.z)-g),v=1,y=-1;for(let e of oe){let t=g+_*e,n=N(a,i,{x:i.x-Math.sin(t)*f,z:i.z-Math.cos(t)*f},i.idx);if(n>y+1e-6&&(y=n,v=e),n>=1)break}A(t,`swing`,v,7,o),j(t,g+_*e(t.swing,0,1),4.5+4*e(t.swing,0,1),o);let b=Math.sin(t.yaw),x=Math.cos(t.yaw);A(t,`ox`,-b*f,6.5,o),A(t,`oz`,-x*f,6.5,o);let S=i.x+t.ox,C=i.z+t.oz,w=Math.hypot(t.ox,t.oz)||1,T=N(a,i,{x:S,z:C},i.idx);t.pull=T<t.pull?Math.max(T,t.pull-75*o/w):t.pull+(T-t.pull)*(1-Math.exp(-o*3));let E=Math.max(t.pull*w,Math.min(re,w)),D=E/w,O=i.x+t.ox*D,k=i.z+t.oz*D,M=ee(a,O,k,i.idx);A(t,`oy`,e(F+P*E+(M-m)*.5,te,ne),7,o);let le=Math.max(m+e(t.oy,te,ne),M+1.5);A(t,`ly`,1+(a.yAt(i.s+p)-m)*.5,6,o),a.at(i.s+p,(i.d??0)*.5,se);let ue=se.x-O,I=se.z-k,de=[i.x,i.y+.9,i.z],fe=Math.max(Math.hypot(ue,I),1),pe=i.x-O,me=i.z-k,he=Math.hypot(pe,me)||1,ge=c*Math.PI/360,_e=Math.atan(Math.tan(ge)*l),ve=Math.min(ge,_e)*.55,ye=Math.atan2(pe,me),be=ye+e(r(Math.atan2(ue,I)-ye),-ve,ve),xe=Math.atan2(le-de[1],he),Se=Math.atan2(le-(m+t.ly),fe),Ce=Math.min(e(Math.min(Se,ie),xe-ve,xe+ve),ae),L=[O+Math.sin(be)*fe,le-Math.tan(Ce)*fe,k+Math.cos(be)*fe];return{pos:[O,le,k],look:L,yaw:t.yaw}}function ue(e,t,n,{posOmega:r=7,yOmega:i=3,yawOmega:a=1.5,velOmega:o=18}={}){if(j(e,t.theta,a,n),e.lastX===void 0||n<=0||Math.hypot(t.x-e.lastX,t.z-e.lastZ)>3+200*n)e.vx=e.vy=e.vz=0;else{let r=1-Math.exp(-o*n);e.vx+=((t.x-e.lastX)/n-e.vx)*r,e.vy+=((t.y-e.lastY)/n-e.vy)*r,e.vz+=((t.z-e.lastZ)/n-e.vz)*r}return e.lastX=t.x,e.lastY=t.y,e.lastZ=t.z,A(e,`x`,t.x+e.vx*2/r,r,n),A(e,`z`,t.z+e.vz*2/r,r,n),A(e,`y`,t.y+e.vy*2/i,i,n),e}var I=1.9,de=-1.65;function fe(e,t,n={y:0,pitch:0,roll:0}){let r=e.yAt(t+I),i=e.yAt(t+de),a=(r-i)/3.55;return n.y=i+a*1.65,n.pitch=Math.atan(a),n.roll=-Math.atan(e.bankAt?e.bankAt(t):0),n}var pe=1e3,me=1001,he=1002,ge=1003,_e=1004,ve=1005,ye=1006,be=1007,xe=1008,Se=1009,Ce=1010,L=1011,we=1012,Te=1013,Ee=1014,R=1015,z=1016,De=1017,Oe=1018,ke=1020,Ae=35902,B=35899,je=1021,V=1022,H=1023,Me=1026,Ne=1027,Pe=1028,Fe=1029,Ie=1030,Le=1031,Re=1033,ze=33776,Be=33777,Ve=33778,He=33779,Ue=35840,We=35841,Ge=35842,Ke=35843,qe=36196,Je=37492,Ye=37496,Xe=37488,Ze=37489,Qe=37490,$e=37491,et=37808,tt=37809,nt=37810,rt=37811,it=37812,at=37813,ot=37814,st=37815,ct=37816,lt=37817,ut=37818,dt=37819,ft=37820,pt=37821,mt=36492,ht=36494,gt=36495,_t=36283,vt=36284,yt=36285,bt=36286,xt=2300,St=2301,Ct=2302,wt=2303,Tt=2400,Et=2401,Dt=2402,Ot=3200,kt=`srgb`,At=`srgb-linear`,jt=`linear`,Mt=`srgb`,Nt=7680,Pt=35044,Ft=35048,It=2e3;function Lt(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Rt(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function zt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Bt(){let e=zt(`canvas`);return e.style.display=`block`,e}var Vt={};function Ht(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Ut(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function U(...e){e=Ut(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function W(...e){e=Ut(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Wt(...e){let t=e.join(` `);t in Vt||(Vt[t]=!0,U(...e))}function Gt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Kt={0:0,2:6,4:4,3:5,1:1,6:2,7:7,5:3},qt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Jt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Yt=Math.PI/180,Xt=180/Math.PI;function Zt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Jt[e&255]+Jt[e>>8&255]+Jt[e>>16&255]+Jt[e>>24&255]+`-`+Jt[t&255]+Jt[t>>8&255]+`-`+Jt[t>>16&15|64]+Jt[t>>24&255]+`-`+Jt[n&63|128]+Jt[n>>8&255]+`-`+Jt[n>>16&255]+Jt[n>>24&255]+Jt[r&255]+Jt[r>>8&255]+Jt[r>>16&255]+Jt[r>>24&255]).toLowerCase()}function Qt(e,t,n){return Math.max(t,Math.min(n,e))}function $t(e,t){return(e%t+t)%t}function en(e,t,n){return(1-n)*e+n*t}function tn(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function nn(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function rn(e,t){if(t.constructor===Float32Array)return e;let n=nn(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.max(e/n,-1)}function an(e,t){if(t.constructor===Float32Array)return e;let n=nn(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.round(e*n)}var on=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Qt(this.x,e.x,t.x),this.y=Qt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Qt(this.x,e,t),this.y=Qt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},sn=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:U(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},G=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ln.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ln.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Qt(this.x,e.x,t.x),this.y=Qt(this.y,e.y,t.y),this.z=Qt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Qt(this.x,e,t),this.y=Qt(this.y,e,t),this.z=Qt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return cn.copy(this).projectOnVector(e),this.sub(cn)}reflect(e){return this.sub(cn.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},cn=new G,ln=new sn,K=class{static{this.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Wt(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(un.makeScale(e,t)),this}rotate(e){return Wt(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(un.makeRotation(-e)),this}translate(e,t){return Wt(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(un.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},un=new K,dn=new K().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fn=new K().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function pn(){let e={enabled:!0,workingColorSpace:At,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=hn(e.r),e.g=hn(e.g),e.b=hn(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=gn(e.r),e.g=gn(e.g),e.b=gn(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?jt:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[n].fromXYZ).multiply(this.spaces[t].toXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[At]:{primaries:t,whitePoint:r,transfer:jt,toXYZ:dn,fromXYZ:fn,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:kt},outputColorSpaceConfig:{drawingBufferColorSpace:kt}},[kt]:{primaries:t,whitePoint:r,transfer:Mt,toXYZ:dn,fromXYZ:fn,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:kt}}}),e}var mn=pn();function hn(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function gn(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var _n,vn=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{_n===void 0&&(_n=zt(`canvas`)),_n.width=e.width,_n.height=e.height;let t=_n.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=_n}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=zt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=hn(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(hn(t[e]/255)*255):t[e]=hn(t[e]);return{data:t,width:e.width,height:e.height}}return U(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},yn=0,bn=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:yn++}),this.uuid=Zt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width||0,t.height||0,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(xn(r[t].image)):e.push(xn(r[t]))}else e=xn(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function xn(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?vn.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(U(`Texture: Unable to serialize Texture.`),{})}var Sn=0,Cn=new G,wn=class e extends qt{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=me,i=me,a=ye,o=xe,s=H,c=Se,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Sn++}),this.uuid=Zt(),this.name=``,this.source=new bn(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new on(0,0),this.repeat=new on(1,1),this.center=new on(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new K,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Cn).x}get height(){return this.source.getSize(Cn).y}get depth(){return this.source.getSize(Cn).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){U(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?U(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case pe:e.x-=Math.floor(e.x);break;case me:e.x=e.x<0?0:1;break;case he:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case pe:e.y-=Math.floor(e.y);break;case me:e.y=e.y<0?0:1;break;case he:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};wn.DEFAULT_IMAGE=null,wn.DEFAULT_MAPPING=300,wn.DEFAULT_ANISOTROPY=1;var Tn=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Qt(this.x,e.x,t.x),this.y=Qt(this.y,e.y,t.y),this.z=Qt(this.z,e.z,t.z),this.w=Qt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Qt(this.x,e,t),this.y=Qt(this.y,e,t),this.z=Qt(this.z,e,t),this.w=Qt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},En=class extends qt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ye,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Tn(0,0,e,t),this.scissorTest=!1,this.viewport=new Tn(0,0,e,t),this.textures=[];let r=n.count;for(let i=0;i<r;i++)this.textures[i]=new wn({width:e,height:t,depth:n.depth}),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:ye,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new bn(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Dn=class extends En{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},On=class extends wn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=ge,this.minFilter=ge,this.wrapR=me,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},kn=class extends wn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=ge,this.minFilter=ge,this.wrapR=me,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},An=class e{static{this.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/jn.setFromMatrixColumn(e,0).length(),i=1/jn.setFromMatrixColumn(e,1).length(),a=1/jn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Nn,e,Pn)}lookAt(e,t,n){let r=this.elements;return Ln.subVectors(e,t),Ln.lengthSq()===0&&(Ln.z=1),Ln.normalize(),Fn.crossVectors(n,Ln),Fn.lengthSq()===0&&(Math.abs(n.z)===1?Ln.x+=1e-4:Ln.z+=1e-4,Ln.normalize(),Fn.crossVectors(n,Ln)),Fn.normalize(),In.crossVectors(Ln,Fn),r[0]=Fn.x,r[4]=In.x,r[8]=Ln.x,r[1]=Fn.y,r[5]=In.y,r[9]=Ln.y,r[2]=Fn.z,r[6]=In.z,r[10]=Ln.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],ee=r[14],M=r[3],N=r[7],P=r[11],F=r[15];return i[0]=a*x+o*T+s*k+c*M,i[4]=a*S+o*E+s*A+c*N,i[8]=a*C+o*D+s*j+c*P,i[12]=a*w+o*O+s*ee+c*F,i[1]=l*x+u*T+d*k+f*M,i[5]=l*S+u*E+d*A+f*N,i[9]=l*C+u*D+d*j+f*P,i[13]=l*w+u*O+d*ee+f*F,i[2]=p*x+m*T+h*k+g*M,i[6]=p*S+m*E+h*A+g*N,i[10]=p*C+m*D+h*j+g*P,i[14]=p*w+m*O+h*ee+g*F,i[3]=_*x+v*T+y*k+b*M,i[7]=_*S+v*E+y*A+b*N,i[11]=_*C+v*D+y*j+b*P,i[15]=_*w+v*O+y*ee+b*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=jn.set(r[0],r[1],r[2]).length(),o=jn.set(r[4],r[5],r[6]).length(),s=jn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Mn.copy(this);let c=1/a,l=1/o,u=1/s;return Mn.elements[0]*=c,Mn.elements[1]*=c,Mn.elements[2]*=c,Mn.elements[4]*=l,Mn.elements[5]*=l,Mn.elements[6]*=l,Mn.elements[8]*=u,Mn.elements[9]*=u,Mn.elements[10]*=u,t.setFromRotationMatrix(Mn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=It,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=It,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},jn=new G,Mn=new An,Nn=new G(0,0,0),Pn=new G(1,1,1),Fn=new G,In=new G,Ln=new G,Rn=new An,zn=new sn,Bn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(Qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-Qt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(Qt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-Qt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(Qt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-Qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:U(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Rn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Rn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return zn.setFromEuler(this),this.setFromQuaternion(zn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Bn.DEFAULT_ORDER=`XYZ`;var Vn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Hn=0,Un=new G,Wn=new sn,Gn=new An,Kn=new G,qn=new G,Jn=new G,Yn=new sn,Xn=new G(1,0,0),Zn=new G(0,1,0),Qn=new G(0,0,1),$n={type:`added`},er={type:`removed`},tr={type:`childadded`,child:null},nr={type:`childremoved`,child:null},rr=class e extends qt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hn++}),this.uuid=Zt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new G,n=new Bn,r=new sn,i=new G(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new An},normalMatrix:{value:new K}}),this.matrix=new An,this.matrixWorld=new An,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Wn.setFromAxisAngle(e,t),this.quaternion.multiply(Wn),this}rotateOnWorldAxis(e,t){return Wn.setFromAxisAngle(e,t),this.quaternion.premultiply(Wn),this}rotateX(e){return this.rotateOnAxis(Xn,e)}rotateY(e){return this.rotateOnAxis(Zn,e)}rotateZ(e){return this.rotateOnAxis(Qn,e)}translateOnAxis(e,t){return Un.copy(e).applyQuaternion(this.quaternion),this.position.add(Un.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Xn,e)}translateY(e){return this.translateOnAxis(Zn,e)}translateZ(e){return this.translateOnAxis(Qn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Gn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Kn.copy(e):Kn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),qn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Gn.lookAt(qn,Kn,this.up):Gn.lookAt(Kn,qn,this.up),this.quaternion.setFromRotationMatrix(Gn),r&&(Gn.extractRotation(r.matrixWorld),Wn.setFromRotationMatrix(Gn),this.quaternion.premultiply(Wn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(W(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent($n),tr.child=e,this.dispatchEvent(tr),tr.child=null):W(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(er),nr.child=e,this.dispatchEvent(nr),nr.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Gn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Gn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Gn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent($n),tr.child=e,this.dispatchEvent(tr),tr.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qn,e,Jn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qn,Yn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};rr.DEFAULT_UP=new G(0,1,0),rr.DEFAULT_MATRIX_AUTO_UPDATE=!0,rr.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ir=class extends rr{constructor(){super(),this.isGroup=!0,this.type=`Group`}},ar={type:`move`},or=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ir,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ir,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ir,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.quaternion,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ar)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ir;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},sr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},cr={h:0,s:0,l:0},lr={h:0,s:0,l:0};function ur(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var q=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,mn.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=mn.workingColorSpace){return this.r=e,this.g=t,this.b=n,mn.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=mn.workingColorSpace){if(e=$t(e,1),t=Qt(t,0,1),n=Qt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=ur(i,r,e+1/3),this.g=ur(i,r,e),this.b=ur(i,r,e-1/3)}return mn.colorSpaceToWorking(this,r),this}setStyle(e,t=kt){function n(t){t!==void 0&&parseFloat(t)<1&&U(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseFloat(i[1]))/100,Math.min(100,parseFloat(i[2]))/100,Math.min(100,parseFloat(i[3]))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:U(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);U(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=kt){let n=sr[e.toLowerCase()];return n===void 0?U(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=hn(e.r),this.g=hn(e.g),this.b=hn(e.b),this}copyLinearToSRGB(e){return this.r=gn(e.r),this.g=gn(e.g),this.b=gn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kt){return mn.workingToColorSpace(dr.copy(this),e),Math.round(Qt(dr.r*255,0,255))*65536+Math.round(Qt(dr.g*255,0,255))*256+Math.round(Qt(dr.b*255,0,255))}getHexString(e=kt){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=mn.workingColorSpace){mn.workingToColorSpace(dr.copy(this),t);let n=dr.r,r=dr.g,i=dr.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=mn.workingColorSpace){return mn.workingToColorSpace(dr.copy(this),t),e.r=dr.r,e.g=dr.g,e.b=dr.b,e}getStyle(e=kt){mn.workingToColorSpace(dr.copy(this),e);let t=dr.r,n=dr.g,r=dr.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(cr),this.setHSL(cr.h+e,cr.s+t,cr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(cr),e.getHSL(lr);let n=en(cr.h,lr.h,t),r=en(cr.s,lr.s,t),i=en(cr.l,lr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},dr=new q;q.NAMES=sr;var fr=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new q(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},pr=class extends rr{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Bn,this.environmentIntensity=1,this.environmentRotation=new Bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background===null?null:e.background.clone(),this.environment=e.environment===null?null:e.environment.clone(),this.fog=e.fog===null?null:e.fog.clone(),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial===null?null:e.overrideMaterial.clone(),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},mr=new G,hr=new G,gr=new G,_r=new G,vr=new G,yr=new G,br=new G,xr=new G,Sr=new G,Cr=new G,wr=new Tn,Tr=new Tn,Er=new Tn,Dr=class e{constructor(e=new G,t=new G,n=new G){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),mr.subVectors(e,t),r.cross(mr);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){mr.subVectors(r,t),hr.subVectors(n,t),gr.subVectors(e,t);let a=mr.dot(mr),o=mr.dot(hr),s=mr.dot(gr),c=hr.dot(hr),l=hr.dot(gr),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,_r)!==null&&_r.x>=0&&_r.y>=0&&_r.x+_r.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,_r)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,_r.x),s.addScaledVector(a,_r.y),s.addScaledVector(o,_r.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return wr.setScalar(0),Tr.setScalar(0),Er.setScalar(0),wr.fromBufferAttribute(e,t),Tr.fromBufferAttribute(e,n),Er.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(wr,i.x),a.addScaledVector(Tr,i.y),a.addScaledVector(Er,i.z),a}static isFrontFacing(e,t,n,r){return mr.subVectors(n,t),hr.subVectors(e,t),mr.cross(hr).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return mr.subVectors(this.c,this.b),hr.subVectors(this.a,this.b),mr.cross(hr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;vr.subVectors(r,n),yr.subVectors(i,n),xr.subVectors(e,n);let s=vr.dot(xr),c=yr.dot(xr);if(s<=0&&c<=0)return t.copy(n);Sr.subVectors(e,r);let l=vr.dot(Sr),u=yr.dot(Sr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0&&s-l>0)return a=s/(s-l),t.copy(n).addScaledVector(vr,a);Cr.subVectors(e,i);let f=vr.dot(Cr),p=yr.dot(Cr);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(yr,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return br.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(br,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(vr,a).addScaledVector(yr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Or=class{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ar.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ar.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Ar.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Ar):Ar.fromBufferAttribute(r,t),Ar.applyMatrix4(e.matrixWorld),this.expandByPoint(Ar);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),jr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),jr.copy(e.boundingBox)),jr.applyMatrix4(e.matrixWorld),this.union(jr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ar),Ar.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Rr),zr.subVectors(this.max,Rr),Mr.subVectors(e.a,Rr),Nr.subVectors(e.b,Rr),Pr.subVectors(e.c,Rr),Fr.subVectors(Nr,Mr),Ir.subVectors(Pr,Nr),Lr.subVectors(Mr,Pr);let t=[0,-Fr.z,Fr.y,0,-Ir.z,Ir.y,0,-Lr.z,Lr.y,Fr.z,0,-Fr.x,Ir.z,0,-Ir.x,Lr.z,0,-Lr.x,-Fr.y,Fr.x,0,-Ir.y,Ir.x,0,-Lr.y,Lr.x,0];return!Hr(t,Mr,Nr,Pr,zr)||(t=[1,0,0,0,1,0,0,0,1],!Hr(t,Mr,Nr,Pr,zr))?!1:(Br.crossVectors(Fr,Ir),t=[Br.x,Br.y,Br.z],Hr(t,Mr,Nr,Pr,zr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ar).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ar).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(kr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),kr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),kr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),kr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),kr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),kr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),kr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),kr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(kr)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},kr=[new G,new G,new G,new G,new G,new G,new G,new G],Ar=new G,jr=new Or,Mr=new G,Nr=new G,Pr=new G,Fr=new G,Ir=new G,Lr=new G,Rr=new G,zr=new G,Br=new G,Vr=new G;function Hr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Vr.fromArray(e,a);let o=i.x*Math.abs(Vr.x)+i.y*Math.abs(Vr.y)+i.z*Math.abs(Vr.z),s=t.dot(Vr),c=n.dot(Vr),l=r.dot(Vr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Ur=new G,Wr=new on,Gr=0,Kr=class extends qt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Gr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Pt,this.updateRanges=[],this.gpuType=R,this.version=0,this._normalizationScale=e===void 0?void 0:nn(e)}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Wr.fromBufferAttribute(this,t),Wr.applyMatrix3(e),this.setXY(t,Wr.x,Wr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ur.fromBufferAttribute(this,t),Ur.applyMatrix3(e),this.setXYZ(t,Ur.x,Ur.y,Ur.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ur.fromBufferAttribute(this,t),Ur.applyMatrix4(e),this.setXYZ(t,Ur.x,Ur.y,Ur.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ur.fromBufferAttribute(this,t),Ur.applyNormalMatrix(e),this.setXYZ(t,Ur.x,Ur.y,Ur.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ur.fromBufferAttribute(this,t),Ur.transformDirection(e),this.setXYZ(t,Ur.x,Ur.y,Ur.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}_denormalize(e){let t=this._normalizationScale;return t===void 0?rn(e,this.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?an(e,this.array):Math.round(e*t)}},qr=class extends Kr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Jr=class extends Kr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Yr=class extends Kr{constructor(e,t,n){super(new Float32Array(e),t,n)}},Xr=new Or,Zr=new G,Qr=new G,$r=class{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Xr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zr.subVectors(e,this.center);let t=Zr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Zr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Qr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zr.copy(e.center).add(Qr)),this.expandByPoint(Zr.copy(e.center).sub(Qr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ei=0,ti=new An,ni=new rr,ri=new G,ii=new Or,ai=new Or,oi=new G,si=class e extends qt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ei++}),this.uuid=Zt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Lt(e)?Jr:qr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new K().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ti.makeRotationFromQuaternion(e),this.applyMatrix4(ti),this}rotateX(e){return ti.makeRotationX(e),this.applyMatrix4(ti),this}rotateY(e){return ti.makeRotationY(e),this.applyMatrix4(ti),this}rotateZ(e){return ti.makeRotationZ(e),this.applyMatrix4(ti),this}translate(e,t,n){return ti.makeTranslation(e,t,n),this.applyMatrix4(ti),this}scale(e,t,n){return ti.makeScale(e,t,n),this.applyMatrix4(ti),this}lookAt(e){return ni.lookAt(e),ni.updateMatrix(),this.applyMatrix4(ni.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ri).negate(),this.translate(ri.x,ri.y,ri.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Yr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&U(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Or);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)W(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ii.setFromBufferAttribute(n),this.morphTargetsRelative?(oi.addVectors(this.boundingBox.min,ii.min),this.boundingBox.expandByPoint(oi),oi.addVectors(this.boundingBox.max,ii.max),this.boundingBox.expandByPoint(oi)):(this.boundingBox.expandByPoint(ii.min),this.boundingBox.expandByPoint(ii.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&W(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $r);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)W(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new G,1/0);else if(e){let n=this.boundingSphere.center;if(ii.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ai.setFromBufferAttribute(n),this.morphTargetsRelative?(oi.addVectors(ii.min,ai.min),ii.expandByPoint(oi),oi.addVectors(ii.max,ai.max),ii.expandByPoint(oi)):(ii.expandByPoint(ai.min),ii.expandByPoint(ai.max))}ii.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)oi.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(oi));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)oi.fromBufferAttribute(a,t),o&&(ri.fromBufferAttribute(e,t),oi.add(ri)),r=Math.max(r,n.distanceToSquared(oi))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&W(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){W(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Kr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[],c=new Uint8Array(n.count);for(let e=0;e<n.count;e++)o[e]=new G,s[e]=new G;let l=new G,u=new G,d=new G,f=new on,p=new on,m=new on,h=new G,g=new G;function _(e,t,r){c[e]=c[t]=c[r]=1,l.fromBufferAttribute(n,e),u.fromBufferAttribute(n,t),d.fromBufferAttribute(n,r),f.fromBufferAttribute(i,e),p.fromBufferAttribute(i,t),m.fromBufferAttribute(i,r),u.sub(l),d.sub(l),p.sub(f),m.sub(f);let a=1/(p.x*m.y-m.x*p.y);isFinite(a)&&(h.copy(u).multiplyScalar(m.y).addScaledVector(d,-p.y).multiplyScalar(a),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-m.x).multiplyScalar(a),o[e].add(h),o[t].add(h),o[r].add(h),s[e].add(g),s[t].add(g),s[r].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let t=0,n=v.length;t<n;++t){let n=v[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)_(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let y=new G,b=new G,x=new G,S=new G;function C(e){x.fromBufferAttribute(r,e),S.copy(x);let t=o[e];y.copy(t),y.sub(x.multiplyScalar(x.dot(t))).normalize(),b.crossVectors(S,t);let n=b.dot(s[e])<0?-1:1;a.setXYZW(e,y.x,y.y,y.z,n)}for(let e=0,t=n.count;e<t;++e)c[e]&&C(e);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Kr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new G,i=new G,a=new G,o=new G,s=new G,c=new G,l=new G,u=new G;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)oi.fromBufferAttribute(e,t),oi.normalize(),e.setXYZ(t,oi.x,oi.y,oi.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Kr(a,r,i)}if(this.index===null)return U(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},ci=new G,li=new G,ui=new K,di=class{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=ci.subVectors(n,t).cross(li.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(ci),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ui.getNormalMatrix(e),r=this.coplanarPoint(ci).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},fi=0,pi=class extends qt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:fi++}),this.uuid=Zt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new q(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Nt,this.stencilZFail=Nt,this.stencilZPass=Nt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){U(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?U(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new q().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new di().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new on().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new on().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},mi=new G,hi=new G,gi=new G,_i=new G,vi=class{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(mi.copy(this.origin).addScaledVector(this.direction,t),mi.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){hi.copy(e).add(t).multiplyScalar(.5),gi.copy(t).sub(e).normalize(),_i.copy(this.origin).sub(hi);let i=e.distanceTo(t)*.5,a=-this.direction.dot(gi),o=_i.dot(this.direction),s=-_i.dot(gi),c=_i.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(hi).addScaledVector(gi,d),f}intersectSphere(e,t){if(e.radius<0)return null;mi.subVectors(e.center,this.origin);let n=mi.dot(this.direction),r=mi.dot(mi)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,mi)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,ee,M;if(y>=b&&y>=x?(w=s,D=u,A=p,M=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,ee=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,ee=_)):b>=x?(w=c,D=d,A=m,M=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,ee=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,ee=v)):(w=l,D=f,A=h,M=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,ee=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,ee=g)),w===0)return null;let N=S/w,P=C/w,F=1/w,te=T-N*D,ne=E-P*D,re=O-N*A,ie=k-P*A,ae=j-N*M,oe=ee-P*M,se=ae*ie-oe*re,ce=te*oe-ne*ae,le=re*ne-ie*te;if(r){if(se<0||ce<0||le<0)return null}else if((se<0||ce<0||le<0)&&(se>0||ce>0||le>0))return null;let ue=se+ce+le;if(ue===0)return null;let I=F*(se*D+ce*A+le*M);return(ue>0?I<0:I>0)?null:this.at(I/ue,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},yi=class extends pi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},bi=new An,xi=new vi,Si=new $r,Ci=new G,wi=new G,Ti=new G,Ei=new G,Di=new G,Oi=new G,ki=new G,Ai=new G,ji=class extends rr{constructor(e=new si,t=new yi){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Oi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Di.fromBufferAttribute(s,e),a?Oi.addScaledVector(Di,r):Oi.addScaledVector(Di.sub(t),r))}t.add(Oi)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Si.copy(n.boundingSphere),Si.applyMatrix4(i),xi.copy(e.ray).recast(e.near),Si.containsPoint(xi.origin)===!1&&(xi.intersectSphere(Si,Ci)===null||xi.origin.distanceToSquared(Ci)>(e.far-e.near)**2)||(bi.copy(i).invert(),xi.copy(e.ray).applyMatrix4(bi),(n.boundingBox===null||xi.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,xi)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Ni(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Ni(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Ni(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Ni(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Mi(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Ai.copy(s),Ai.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Ai);return l<n.near||l>n.far?null:{distance:l,point:Ai.clone(),object:e}}function Ni(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,wi),e.getVertexPosition(c,Ti),e.getVertexPosition(l,Ei);let u=Mi(e,t,n,r,wi,Ti,Ei,ki);if(u){let e=new G;Dr.getBarycoord(ki,wi,Ti,Ei,e),i&&(u.uv=Dr.getInterpolatedAttribute(i,s,c,l,e,new on)),a&&(u.uv1=Dr.getInterpolatedAttribute(a,s,c,l,e,new on)),o&&(u.normal=Dr.getInterpolatedAttribute(o,s,c,l,e,new G),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new G,materialIndex:0};Dr.getNormal(wi,Ti,Ei,t.normal),u.face=t,u.barycoord=e}return u}var Pi=class extends wn{constructor(e=null,t=1,n=1,r,i,a,o,s,c=ge,l=ge,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Fi=class extends Kr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ii=new An,Li=new An,Ri=[],zi=new Or,Bi=new An,Vi=new ji,Hi=new $r,Ui=class extends ji{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Fi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Bi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Or),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ii),zi.copy(e.boundingBox).applyMatrix4(Ii),this.boundingBox.union(zi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new $r),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ii),Hi.copy(e.boundingSphere).applyMatrix4(Ii),this.boundingSphere.union(Hi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture===null?null:e.morphTexture.clone(),this.instanceColor=e.instanceColor===null?null:e.instanceColor.clone(),this.count=e.count,this.boundingBox=e.boundingBox===null?null:e.boundingBox.clone(),this.boundingSphere=e.boundingSphere===null?null:e.boundingSphere.clone(),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Vi.geometry=this.geometry,Vi.material=this.material,Vi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Hi.copy(this.boundingSphere),Hi.applyMatrix4(n),e.ray.intersectsSphere(Hi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Ii),Li.multiplyMatrices(n,Ii),Vi.matrixWorld=Li,Vi.raycast(e,Ri);for(let e=0,n=Ri.length;e<n;e++){let n=Ri[e];n.instanceId=i,n.object=this,t.push(n)}Ri.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Fi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Pi(new Float32Array(r*this.count),r,this.count,Pe,R));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Wi=new $r,Gi=new on(.5,.5),Ki=new G,qi=class{constructor(e=new di,t=new di,n=new di,r=new di,i=new di,a=new di){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=It,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Wi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Wi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Wi)}intersectsSprite(e){return Wi.center.set(0,0,0),Wi.radius=.7071067811865476+Gi.distanceTo(e.center),Wi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Wi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ki.x=r.normal.x>0?e.max.x:e.min.x,Ki.y=r.normal.y>0?e.max.y:e.min.y,Ki.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ki)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ji=new An,Yi=class e{constructor(){this.coordinateSystem=It,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];Ji.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new qi),n[e].setFromProjectionMatrix(Ji,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new qi),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}},Xi=class extends pi{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new q(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Zi=new An,Qi=new vi,$i=new $r,ea=new G,ta=class extends rr{constructor(e=new si,t=new Xi){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$i.copy(n.boundingSphere),$i.applyMatrix4(r),$i.radius+=i,e.ray.intersectsSphere($i)===!1)return;Zi.copy(r).invert(),Qi.copy(e.ray).applyMatrix4(Zi);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);ea.fromBufferAttribute(l,n),na(ea,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)ea.fromBufferAttribute(l,a),na(ea,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function na(e,t,n,r,i,a,o){let s=Qi.distanceSqToPoint(e);if(s<n){let n=new G;Qi.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var ra=class extends wn{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ia=class extends wn{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},aa=class extends wn{constructor(e,t,n=Ee,r,i,a,o=ge,s=ge,c,l=Me,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new bn(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},oa=class extends aa{constructor(e,t=Ee,n=301,r,i,a=ge,o=ge,s,c=Me){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},sa=class extends wn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ca=class e extends si{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Yr(c,3)),this.setAttribute(`normal`,new Yr(l,3)),this.setAttribute(`uv`,new Yr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new G;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},la=class e extends si{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new G,l=new on;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new Yr(a,3)),this.setAttribute(`normal`,new Yr(o,3)),this.setAttribute(`uv`,new Yr(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},ua=class e extends si{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Yr(u,3)),this.setAttribute(`normal`,new Yr(d,3)),this.setAttribute(`uv`,new Yr(f,2));function _(){let a=new G,_=new G,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new on,m=new G,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},da=class e extends ua{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},fa=class e extends si{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Yr(i,3)),this.setAttribute(`normal`,new Yr(i.slice(),3)),this.setAttribute(`uv`,new Yr(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new G,r=new G,i=new G;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new G;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new G;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new G,t=new G,n=new G,r=new G,o=new on,s=new on,c=new on;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},pa=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){U(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new on:new G);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new G,r=[],i=[],a=[],o=new G,s=new An;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new G)}i[0]=new G,a[0]=new G;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(Qt(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(Qt(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}};function ma(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var ha=new G,ga=new G,_a=new ma,va=new ma,ya=new ma,ba=class extends pa{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new G){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(ga.subVectors(r[0],r[1]).add(r[0]),c=ga);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(ha.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=ha),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),_a.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),va.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),ya.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(_a.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),va.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),ya.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(_a.calc(s),va.calc(s),ya.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new G().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}},xa=class e extends fa{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Sa=class e extends si{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Yr(p,3)),this.setAttribute(`normal`,new Yr(m,3)),this.setAttribute(`uv`,new Yr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Ca=class e extends si{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new G,p=new on;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new Yr(s,3)),this.setAttribute(`normal`,new Yr(c,3)),this.setAttribute(`uv`,new Yr(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},wa=class e extends si{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new G,d=new G,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Yr(p,3)),this.setAttribute(`normal`,new Yr(m,3)),this.setAttribute(`uv`,new Yr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function Ta(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Da(i))i.isRenderTargetTexture?(U(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Da(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Ea(e){let t={};for(let n=0;n<e.length;n++){let r=Ta(e[n]);for(let e in r)t[e]=r[e]}return t}function Da(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Oa(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function ka(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:mn.workingColorSpace}var Aa={clone:Ta,merge:Ea},ja=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ma=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Na=class extends pi{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ja,this.fragmentShader=Ma,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ta(e.uniforms),this.uniformsGroups=Oa(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new q().setHex(r.value);break;case`v2`:this.uniforms[n].value=new on().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new G().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Tn().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new K().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new An().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Pa=class extends Na{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Fa=class extends pi{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type=`MeshPhongMaterial`,this.color=new q(16777215),this.specular=new q(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new on(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ia=class extends pi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new on(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},La=class extends pi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Ot,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ra=class extends pi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function za(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Ba(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Va=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Ha=class extends Va{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Tt,endingEnd:Tt}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Et:i=e,o=2*t-n;break;case Dt:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Et:a=e,s=2*n-t;break;case Dt:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Ua=class extends Va{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Wa=class extends Va{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Ga=class extends Va{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Ja(n,t,g,y,r);i[p]=Ka(x,o,_,b,m)}return i}};function Ka(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function qa(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Ja(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Ka(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=qa(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Ya=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=za(t,this.TimeBufferType),this.values=za(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:za(e.times,Array),values:za(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Ba(e.settings)&&(n.settings={inTangents:za(e.settings.inTangents,Array),outTangents:za(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Wa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ua(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ha(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Ga(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case xt:t=this.InterpolantFactoryMethodDiscrete;break;case St:t=this.InterpolantFactoryMethodLinear;break;case Ct:t=this.InterpolantFactoryMethodSmooth;break;case wt:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return U(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return xt;case this.InterpolantFactoryMethodLinear:return St;case this.InterpolantFactoryMethodSmooth:return Ct;case this.InterpolantFactoryMethodBezier:return wt}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e;Ba(this.settings)&&(Xa(this.settings.inTangents,e),Xa(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Ba(this.settings)&&(Za(this.settings.inTangents,e),Za(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(W(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(W(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){W(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){W(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Rt(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){W(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ct,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Ba(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Xa(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]+=t}function Za(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Ya.prototype.ValueTypeName=``,Ya.prototype.TimeBufferType=Float32Array,Ya.prototype.ValueBufferType=Float32Array,Ya.prototype.DefaultInterpolation=St;var Qa=class extends Ya{constructor(e,t,n){super(e,t,n)}};Qa.prototype.ValueTypeName=`bool`,Qa.prototype.ValueBufferType=Array,Qa.prototype.DefaultInterpolation=xt,Qa.prototype.InterpolantFactoryMethodLinear=void 0,Qa.prototype.InterpolantFactoryMethodSmooth=void 0;var $a=class extends Ya{constructor(e,t,n,r){super(e,t,n,r)}};$a.prototype.ValueTypeName=`color`;var eo=class extends Ya{constructor(e,t,n,r){super(e,t,n,r)}};eo.prototype.ValueTypeName=`number`;var to=class extends Va{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)sn.slerpFlat(i,0,a,c-o,a,c,s);return i}},no=class extends Ya{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new to(this.times,this.values,this.getValueSize(),e)}};no.prototype.ValueTypeName=`quaternion`,no.prototype.InterpolantFactoryMethodSmooth=void 0;var ro=class extends Ya{constructor(e,t,n){super(e,t,n)}};ro.prototype.ValueTypeName=`string`,ro.prototype.ValueBufferType=Array,ro.prototype.DefaultInterpolation=xt,ro.prototype.InterpolantFactoryMethodLinear=void 0,ro.prototype.InterpolantFactoryMethodSmooth=void 0;var io=class extends Ya{constructor(e,t,n,r){super(e,t,n,r)}};io.prototype.ValueTypeName=`vector`;var ao=class extends rr{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new q(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},oo=class extends ao{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(rr.DEFAULT_UP),this.updateMatrix(),this.groundColor=new q(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},so=new An,co=new G,lo=new G,uo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new on(512,512),this.mapType=Se,this.map=null,this.mapPass=null,this.matrix=new An,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new qi,this._frameExtents=new on(1,1),this._viewportCount=1,this._viewports=[new Tn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;co.setFromMatrixPosition(e.matrixWorld),t.position.copy(co),lo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(lo),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){so.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(so,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(so)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},fo=new G,po=new sn,mo=new G,ho=class extends rr{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new An,this.projectionMatrix=new An,this.projectionMatrixInverse=new An,this.coordinateSystem=It,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(fo,po,mo),mo.x===1&&mo.y===1&&mo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fo,po,mo.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(fo,po,mo),mo.x===1&&mo.y===1&&mo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fo,po,mo.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},go=new G,_o=new on,vo=new on,yo=class extends ho{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Xt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Yt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Xt*2*Math.atan(Math.tan(Yt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){go.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(go.x,go.y).multiplyScalar(-e/go.z),go.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(go.x,go.y).multiplyScalar(-e/go.z)}getViewSize(e,t){return this.getViewBounds(e,_o,vo),t.subVectors(vo,_o)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Yt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},bo=class extends ho{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},xo=class extends uo{constructor(){super(new bo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},So=class extends ao{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(rr.DEFAULT_UP),this.updateMatrix(),this.target=new rr,this.shadow=new xo}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Co=-90,wo=1,To=class extends rr{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new yo(Co,wo,e,t);r.layers=this.layers,this.add(r);let i=new yo(Co,wo,e,t);i.layers=this.layers,this.add(i);let a=new yo(Co,wo,e,t);a.layers=this.layers,this.add(a);let o=new yo(Co,wo,e,t);o.layers=this.layers,this.add(o);let s=new yo(Co,wo,e,t);s.layers=this.layers,this.add(s);let c=new yo(Co,wo,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Eo=class extends yo{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},Do=`\\[\\]\\.:\\/`,Oo=RegExp(`[\\[\\]\\.:\\/]`,`g`),ko=`[^\\[\\]\\.:\\/]`,Ao=`[^`+Do.replace(`\\.`,``)+`]`,jo=`((?:WC+[\\/:])*)`.replace(`WC`,ko),Mo=`(WCOD+)?`.replace(`WCOD`,Ao),No=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,ko),Po=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,ko),Fo=RegExp(`^`+jo+Mo+No+Po+`$`),Io=[`material`,`materials`,`bones`,`map`],Lo=class{constructor(e,t,n){let r=n||Ro.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ro=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Oo,``)}static parseTrackName(e){let t=Fo.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Io.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){U(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){W(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){W(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){W(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){W(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){W(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){W(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){W(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;W(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){W(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){W(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ro.Composite=Lo,Ro.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Ro.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Ro.prototype.GetterByBindingType=[Ro.prototype._getValue_direct,Ro.prototype._getValue_array,Ro.prototype._getValue_arrayElement,Ro.prototype._getValue_toArray],Ro.prototype.SetterByBindingTypeAndVersioning=[[Ro.prototype._setValue_direct,Ro.prototype._setValue_direct_setNeedsUpdate,Ro.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ro.prototype._setValue_array,Ro.prototype._setValue_array_setNeedsUpdate,Ro.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ro.prototype._setValue_arrayElement,Ro.prototype._setValue_arrayElement_setNeedsUpdate,Ro.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ro.prototype._setValue_fromArray,Ro.prototype._setValue_fromArray_setNeedsUpdate,Ro.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class{static{this.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function zo(e,t,n,r){let i=Bo(r);switch(n){case je:return e*t;case Pe:return e*t/i.components*i.byteLength;case Fe:return e*t/i.components*i.byteLength;case Ie:return e*t*2/i.components*i.byteLength;case Le:return e*t*2/i.components*i.byteLength;case V:return e*t*3/i.components*i.byteLength;case H:return e*t*4/i.components*i.byteLength;case Re:return e*t*4/i.components*i.byteLength;case ze:case Be:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Ve:case He:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case We:case Ke:return Math.max(e,16)*Math.max(t,8)/4;case Ue:case Ge:return Math.max(e,8)*Math.max(t,8)/2;case qe:case Je:case Xe:case Ze:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Ye:case Qe:case $e:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case et:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case tt:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case nt:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case rt:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case it:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case at:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case ot:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case st:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case ct:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case lt:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case ut:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case dt:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case ft:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case pt:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case mt:case ht:case gt:return Math.ceil(e/4)*Math.ceil(t/4)*16;case _t:case vt:return Math.ceil(e/4)*Math.ceil(t/4)*8;case yt:case bt:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Bo(e){switch(e){case Se:case Ce:return{byteLength:1,components:1};case we:case L:case z:return{byteLength:2,components:1};case De:case Oe:return{byteLength:2,components:4};case Ee:case Te:case R:return{byteLength:4,components:1};case Ae:case B:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`187`}})),typeof window<`u`&&(window.__THREE__?U(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`187`);function Vo(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Ho(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Uo={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},J={common:{diffuse:{value:new q(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new K},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new K}},envmap:{envMap:{value:null},envMapRotation:{value:new K},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new K}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new K}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new K},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new K},normalScale:{value:new on(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new K},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new K}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new K}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new K}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new q(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new q(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0},uvTransform:{value:new K}},sprite:{diffuse:{value:new q(16777215)},opacity:{value:1},center:{value:new on(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new K},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0}}},Wo={basic:{uniforms:Ea([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.fog]),vertexShader:Uo.meshbasic_vert,fragmentShader:Uo.meshbasic_frag},lambert:{uniforms:Ea([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.fog,J.lights,{emissive:{value:new q(0)},envMapIntensity:{value:1}}]),vertexShader:Uo.meshlambert_vert,fragmentShader:Uo.meshlambert_frag},phong:{uniforms:Ea([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.fog,J.lights,{emissive:{value:new q(0)},specular:{value:new q(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Uo.meshphong_vert,fragmentShader:Uo.meshphong_frag},standard:{uniforms:Ea([J.common,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.roughnessmap,J.metalnessmap,J.fog,J.lights,{emissive:{value:new q(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Uo.meshphysical_vert,fragmentShader:Uo.meshphysical_frag},toon:{uniforms:Ea([J.common,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.gradientmap,J.fog,J.lights,{emissive:{value:new q(0)}}]),vertexShader:Uo.meshtoon_vert,fragmentShader:Uo.meshtoon_frag},matcap:{uniforms:Ea([J.common,J.bumpmap,J.normalmap,J.displacementmap,J.fog,{matcap:{value:null}}]),vertexShader:Uo.meshmatcap_vert,fragmentShader:Uo.meshmatcap_frag},points:{uniforms:Ea([J.points,J.fog]),vertexShader:Uo.points_vert,fragmentShader:Uo.points_frag},dashed:{uniforms:Ea([J.common,J.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Uo.linedashed_vert,fragmentShader:Uo.linedashed_frag},depth:{uniforms:Ea([J.common,J.displacementmap]),vertexShader:Uo.depth_vert,fragmentShader:Uo.depth_frag},normal:{uniforms:Ea([J.common,J.bumpmap,J.normalmap,J.displacementmap,{opacity:{value:1}}]),vertexShader:Uo.meshnormal_vert,fragmentShader:Uo.meshnormal_frag},sprite:{uniforms:Ea([J.sprite,J.fog]),vertexShader:Uo.sprite_vert,fragmentShader:Uo.sprite_frag},background:{uniforms:{uvTransform:{value:new K},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Uo.background_vert,fragmentShader:Uo.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new K}},vertexShader:Uo.backgroundCube_vert,fragmentShader:Uo.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Uo.cube_vert,fragmentShader:Uo.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Uo.equirect_vert,fragmentShader:Uo.equirect_frag},distance:{uniforms:Ea([J.common,J.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Uo.distance_vert,fragmentShader:Uo.distance_frag},shadow:{uniforms:Ea([J.lights,J.fog,{color:{value:new q(0)},opacity:{value:1}}]),vertexShader:Uo.shadow_vert,fragmentShader:Uo.shadow_frag}};Wo.physical={uniforms:Ea([Wo.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new K},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new K},clearcoatNormalScale:{value:new on(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new K},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new K},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new K},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new K},sheen:{value:0},sheenColor:{value:new q(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new K},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new K},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new K},transmissionSamplerSize:{value:new on},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new K},attenuationDistance:{value:0},attenuationColor:{value:new q(0)},specularColor:{value:new q(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new K},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new K},anisotropyVector:{value:new on},anisotropyMap:{value:null},anisotropyMapTransform:{value:new K}}]),vertexShader:Uo.meshphysical_vert,fragmentShader:Uo.meshphysical_frag};var Go={r:0,b:0,g:0},Ko=new An,qo=new K;qo.set(-1,0,0,0,1,0,0,0,1);function Jo(e,t,n,r,i,a){let o=new q(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&i.isCubeTexture?(l===void 0&&(l=new ji(new ca(1,1,1),new Na({name:`BackgroundCubeMaterial`,uniforms:Ta(Wo.backgroundCube.uniforms),vertexShader:Wo.backgroundCube.vertexShader,fragmentShader:Wo.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Ko.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(qo),l.material.toneMapped=mn.getTransfer(i.colorSpace)!==Mt,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new ji(new Sa(2,2),new Na({name:`BackgroundMaterial`,uniforms:Ta(Wo.background.uniforms),vertexShader:Wo.background.vertexShader,fragmentShader:Wo.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=mn.getTransfer(i.colorSpace)!==Mt,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Go,ka(e)),n.buffers.color.setClear(Go.r,Go.g,Go.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Yo(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.isInterleavedBuffer===!0?t.stride:t.itemSize,p=s.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Xo(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Zo(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(U(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),f=n.logarithmicDepthBuffer===!0&&d===!1;n.reversedDepthBuffer===!0&&d===!1&&U(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`),n.logarithmicDepthBuffer===!0&&d===!0&&U(`WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Qo(e){let t=this,n=null,r=0,i=!1,a=!1,o=new di,s=new K,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var $o=class extends Dn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new ra(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ca(5,5,5),i=new Na({name:`CubemapFromEquirect`,uniforms:Ta(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new ji(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=ye),new To(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},es=256,ts=3,ns=20,rs=256,is=16,as=3,os=new G,ss=new q,cs=class e{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new To(1,10,null),this._boxMesh=new ji(new ca(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=os}=i,s=this._renderer;this._setSize(a);let c=this._allocateTarget(),l=this._getSourceTarget(!0);t>0&&(l.texture.mipmapsAutoUpdate=!1);let u=s.autoClear,d=s.autoClearColor,f=s.autoClearDepth,p=s.autoClearStencil,m=e.background;s.autoClear=!0,s.autoClearColor=!0,s.autoClearDepth=!0,s.autoClearStencil=!0,m===null&&(e.background=s.getClearColor(ss));let h=new To(n,r,l);return h.position.copy(o),h.update(s,e),s.autoClear=u,s.autoClearColor=d,s.autoClearDepth=f,s.autoClearStencil=p,e.background=m,t>0&&(l.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hs(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ms(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(es,tn(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?es:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=ls(e,!1,!1),n=Math.log2(e)-ts;for(let r=0;r<=n;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name=`PMREM`,t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=ls(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let r=this._boxMesh,i=this._cubeCamera;r.material=n,i.renderTarget=e,i.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),i.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=hs()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=ms()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=ds(),this._integrationMaterial=fs());let n=this._cubeSize,r=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/is);for(let o=0;o<=r;o++){let s=e.lodToRoughness(o,r);if(o>r-as)a.roughness.value=s,this._renderCube(t,o,this._integrationMaterial);else{let e=s>0?Math.log2(n)+.5*Math.log2(6/(rs*s**4))+.5:0;i.roughness.value=s,i.lodBias.value=e,this._renderCube(t,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=ps());let n=this._blurMaterial,r=n.uniforms,i=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=i.texture,this._renderCube(e,0,n),r.envMap.value=e.texture,this._renderCube(i,0,n)}};function ls(e,t,n){return new $o(e,{minFilter:xe,generateMipmaps:t,type:z,colorSpace:At,depthBuffer:n})}function us(e,t,n){return new Na({name:e,uniforms:t,vertexShader:Uo.cube_vert,fragmentShader:n,side:1,blending:0,depthTest:!1,depthWrite:!1})}function ds(){return us(`PMREMGGXConvolution`,{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${rs}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function fs(){return us(`PMREMGGXIntegration`,{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:is}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function ps(){return us(`PMREMSphericalGaussianBlur`,{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${ns}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function ms(){return us(`PMREMEquirectangularToCubemap`,{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function hs(){return us(`PMREMCubemapToCubemap`,{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function gs(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new $o(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture&&t.isPMREMTexture!==!0){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new cs(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new cs(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function _s(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Wt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function vs(e,t,n,r){let i={},a=new WeakMap,o=new FinalizationRegistry(e=>delete i[e]);function s(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(let n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener(`dispose`,s),delete i[e.id],o.unregister(e);let c=a.get(e);c&&(t.remove(c),a.delete(e)),r.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function l(e,t){return i[t.id]===void 0&&(t.addEventListener(`dispose`,s),i[t.id]=new WeakRef(t),o.register(t,t.id,t),n.memory.geometries++),t}function u(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function d(e){let n=e.index,r=e.attributes.position,i=0;if(r===void 0)return;let o=n===null?r.array.length/3-1:n.array.length,s=new(r.count>=65535?Jr:qr)(Math.ceil(o/3)*6,1),c=s.array;if(n!==null){let e=n.array;i=n.version;for(let t=0,n=0;t<o;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];c[n++]=r,c[n++]=i,c[n++]=i,c[n++]=a,c[n++]=a,c[n++]=r}}else{i=r.version;for(let e=0,t=0;e<o;e+=3){let n=e+0,r=e+1,i=e+2;c[t++]=n,c[t++]=r,c[t++]=r,c[t++]=i,c[t++]=i,c[t++]=n}}s.version=i;let l=a.get(e);l&&t.remove(l),a.set(e,s)}function f(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&d(e)}else d(e);return a.get(e)}function p(){for(let e in i){let t=i[e].deref();t!==void 0&&c(t)}}return{get:l,update:u,getWireframeAttribute:f,dispose:p}}function ys(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function bs(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:W(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function xs(e,t,n){let r=new WeakMap,i=new Tn;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new On(h,p,m,u);g.type=R,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new on(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Ss(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Cs={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function ws(e,t,n,r,i,a){let o=new Dn(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=null,u=new si;u.setAttribute(`position`,new Yr([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new Yr([0,2,0,0,2,0],2));let d=new Pa({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new ji(u,d),p=new bo(-1,1,1,-1,0,1),m=null,h=null,g=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new Dn(t,n,{type:z,depthBuffer:!1,stencilBuffer:!1}),c=new Dn(t,n,{type:z,depthBuffer:!1,stencilBuffer:!1}));let r=i===!0&&y.some(e=>e.needsDepthTexture===!0);r!==(o.depthTexture!==null)&&(r===!0&&l===null&&(l=new aa(t,n),a===!0&&(l.format=Ne,l.type=ke)),o.dispose(),o.depthTexture=r?l:null,o.resolveDepthBuffer=r,o.storeMultisampledDepthBuffer=r);for(let e=0;e<y.length;e++){let i=y[e];i.setSize&&i.setSize(t,n),r&&i.needsDepthTexture===!0&&i.setDepthTexture&&i.setDepthTexture(l)}},this.begin=function(e,t){if(g||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,g=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(m!==e.outputColorSpace||h!==e.toneMapping){m=e.outputColorSpace,h=e.toneMapping,d.defines={},mn.getTransfer(m)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=Cs[h];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(f,p),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}var Ts=new wn,Es=new aa(1,1),Ds=new oa(1),Os=new On,ks=new kn,As=new ra,js=[],Ms=[],Ns=new Float32Array(16),Ps=new Float32Array(9),Fs=new Float32Array(4);function Is(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=js[i];if(a===void 0&&(a=new Float32Array(i),js[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Ls(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Rs(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function zs(e,t){let n=Ms[t];n===void 0&&(n=new Int32Array(t),Ms[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Bs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Vs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ls(n,t))return;e.uniform2fv(this.addr,t),Rs(n,t)}}function Hs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Ls(n,t))return;e.uniform3fv(this.addr,t),Rs(n,t)}}function Us(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ls(n,t))return;e.uniform4fv(this.addr,t),Rs(n,t)}}function Ws(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ls(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Rs(n,t)}else{if(Ls(n,r))return;Fs.set(r),e.uniformMatrix2fv(this.addr,!1,Fs),Rs(n,r)}}function Gs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ls(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Rs(n,t)}else{if(Ls(n,r))return;Ps.set(r),e.uniformMatrix3fv(this.addr,!1,Ps),Rs(n,r)}}function Ks(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ls(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Rs(n,t)}else{if(Ls(n,r))return;Ns.set(r),e.uniformMatrix4fv(this.addr,!1,Ns),Rs(n,r)}}function qs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Js(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ls(n,t))return;e.uniform2iv(this.addr,t),Rs(n,t)}}function Ys(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ls(n,t))return;e.uniform3iv(this.addr,t),Rs(n,t)}}function Xs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ls(n,t))return;e.uniform4iv(this.addr,t),Rs(n,t)}}function Zs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Qs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ls(n,t))return;e.uniform2uiv(this.addr,t),Rs(n,t)}}function $s(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ls(n,t))return;e.uniform3uiv(this.addr,t),Rs(n,t)}}function ec(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ls(n,t))return;e.uniform4uiv(this.addr,t),Rs(n,t)}}function tc(e){return e.version===0&&(e.compareFunction=519,e.needsUpdate=!0),e}function nc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_2D_SHADOW?tc(Es):Ts,n.setTexture2D(t||a,i)}function rc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||ks,i)}function ic(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_CUBE_SHADOW?tc(Ds):As,n.setTextureCube(t||a,i)}function ac(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Os,i)}function oc(e){switch(e){case 5126:return Bs;case 35664:return Vs;case 35665:return Hs;case 35666:return Us;case 35674:return Ws;case 35675:return Gs;case 35676:return Ks;case 5124:case 35670:return qs;case 35667:case 35671:return Js;case 35668:case 35672:return Ys;case 35669:case 35673:return Xs;case 5125:return Zs;case 36294:return Qs;case 36295:return $s;case 36296:return ec;case 35678:case 36198:case 36298:case 36306:case 35682:return nc;case 35679:case 36299:case 36307:return rc;case 35680:case 36300:case 36308:case 36293:return ic;case 36289:case 36303:case 36311:case 36292:return ac}}function sc(e,t){e.uniform1fv(this.addr,t)}function cc(e,t){let n=Is(t,this.size,2);e.uniform2fv(this.addr,n)}function lc(e,t){let n=Is(t,this.size,3);e.uniform3fv(this.addr,n)}function uc(e,t){let n=Is(t,this.size,4);e.uniform4fv(this.addr,n)}function dc(e,t){let n=Is(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function fc(e,t){let n=Is(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function pc(e,t){let n=Is(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function mc(e,t){e.uniform1iv(this.addr,t)}function hc(e,t){e.uniform2iv(this.addr,t)}function gc(e,t){e.uniform3iv(this.addr,t)}function _c(e,t){e.uniform4iv(this.addr,t)}function vc(e,t){e.uniform1uiv(this.addr,t)}function yc(e,t){e.uniform2uiv(this.addr,t)}function bc(e,t){e.uniform3uiv(this.addr,t)}function xc(e,t){e.uniform4uiv(this.addr,t)}function Sc(e,t,n){let r=this.cache,i=t.length,a=zs(n,i);Ls(r,a)||(e.uniform1iv(this.addr,a),Rs(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?tc(Es):Ts;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Cc(e,t,n){let r=this.cache,i=t.length,a=zs(n,i);Ls(r,a)||(e.uniform1iv(this.addr,a),Rs(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||ks,a[e])}function wc(e,t,n){let r=this.cache,i=t.length,a=zs(n,i);Ls(r,a)||(e.uniform1iv(this.addr,a),Rs(r,a));let o;o=this.type===e.SAMPLER_CUBE_SHADOW?tc(Ds):As;for(let e=0;e!==i;++e)n.setTextureCube(t[e]||o,a[e])}function Tc(e,t,n){let r=this.cache,i=t.length,a=zs(n,i);Ls(r,a)||(e.uniform1iv(this.addr,a),Rs(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Os,a[e])}function Ec(e){switch(e){case 5126:return sc;case 35664:return cc;case 35665:return lc;case 35666:return uc;case 35674:return dc;case 35675:return fc;case 35676:return pc;case 5124:case 35670:return mc;case 35667:case 35671:return hc;case 35668:case 35672:return gc;case 35669:case 35673:return _c;case 5125:return vc;case 36294:return yc;case 36295:return bc;case 36296:return xc;case 35678:case 36198:case 36298:case 36306:case 35682:return Sc;case 35679:case 36299:case 36307:return Cc;case 35680:case 36300:case 36308:case 36293:return wc;case 36289:case 36303:case 36311:case 36292:return Tc}}var Dc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=oc(t.type)}},Oc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ec(t.type)}},kc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Ac=/(\w+)(\])?(\[|\.)?/g;function jc(e,t){e.seq.push(t),e.map[t.id]=t}function Mc(e,t,n){let r=e.name,i=r.length;for(Ac.lastIndex=0;;){let a=Ac.exec(r),o=Ac.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){jc(n,l===void 0?new Dc(s,e,t):new Oc(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new kc(s),jc(n,e)),n=e}}}var Nc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Mc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Pc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Fc=37297,Ic=0;function Lc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Rc=new K;function zc(e){mn._getMatrix(Rc,mn.workingColorSpace,e);let t=`mat3( ${Rc.elements.map(e=>e.toFixed(4))} )`;switch(mn.getTransfer(e)){case jt:return[t,`LinearTransferOETF`];case Mt:return[t,`sRGBTransferOETF`];default:return U(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Bc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Lc(e.getShaderSource(t),r)}return i}function Vc(e,t){let n=zc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,`}`].join(`
`)}var Hc={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Uc(e,t){let n=Hc[t];return n===void 0?(U(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Wc=new G;function Gc(){return mn.getLuminanceCoefficients(Wc),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Wc.x.toFixed(4)}, ${Wc.y.toFixed(4)}, ${Wc.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Kc(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Yc).join(`
`)}function qc(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Jc(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Yc(e){return e!==``}function Xc(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Zc(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Qc=/^[ \t]*#include +<([\w\d./]+)>/gm;function $c(e){return e.replace(Qc,el)}function el(e,t){let n=Uo[t];if(n===void 0)throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`);return $c(n)}var tl=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nl(e){return e.replace(tl,rl)}function rl(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function il(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var al={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function ol(e){return al[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var sl={302:`ENVMAP_MODE_REFRACTION`};function cl(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:sl[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var ll={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function ul(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:ll[e.combine]||`ENVMAP_BLENDING_NONE`}function dl(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=ol(n),l=n.envMapPMREM===!0?`ENVMAP_TYPE_PMREM`:`ENVMAP_TYPE_CUBE`,u=cl(n),d=ul(n),f=Kc(n),p=qc(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(Yc).join(`
`),h.length>0&&(h+=`
`),g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(Yc).join(`
`),g.length>0&&(g+=`
`)):(h=[il(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.diffuseRoughnessMapUv?`#define DIFFUSE_ROUGHNESSMAP_UV `+n.diffuseRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Yc).join(`
`),g=[il(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.envMapPMREM?`#define ENVMAP_MAX_LOD `+n.envMapMaxLod+`.0`:``,n.envMapPMREM?`#define ENVMAP_SIZE `+n.envMapSize+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughness?`#define USE_DIFFUSE_ROUGHNESS`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Uo.tonemapping_pars_fragment,n.toneMapping===0?``:Uc(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Uo.colorspace_pars_fragment,Vc(`linearToOutputTexel`,n.outputColorSpace),Gc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Yc).join(`
`)),o=$c(o),o=Xc(o,n),o=Zc(o,n),s=$c(s),s=Xc(s,n),s=Zc(s,n),o=nl(o),s=nl(s),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,h=[f,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=Pc(i,i.VERTEX_SHADER,v),x=Pc(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,`position`):i.bindAttribLocation(m,0,n.index0AttributeName),i.linkProgram(m);function S(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(m)||``,r=i.getShaderInfoLog(b)||``,a=i.getShaderInfoLog(x)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,m,b,x);else{let e=Bc(i,b,`vertex`),n=Bc(i,x,`fragment`);W(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):U(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:h},fragmentShader:{log:c,prefix:g}})}i.deleteShader(b),i.deleteShader(x),C=new Nc(i,m),w=Jc(i,m)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,Fc)),T},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Ic++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}var fl=0,pl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new ml(e),t.set(e,n)),n}},ml=class{constructor(e){this.id=fl++,this.code=e,this.usedTimes=0}};function hl(e){return e===1030||e===37490||e===36285}function gl(e,t,n,r,i,a){let o=new Vn,s=new pl,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function p(e){return c.add(e),e===0?`uv`:`uv${e}`}function m(i,o,l,u,m,h){let g=u.fog,_=m.geometry,v=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,b=t.get(i.envMap||v,y),x=f[i.type],S=r.precision;i.precision!==null&&(S=r.getMaxPrecision(i.precision),S!==i.precision&&U(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,S,`instead.`));let C=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,w=C===void 0?0:C.length,T=0;_.morphAttributes.position!==void 0&&(T=1),_.morphAttributes.normal!==void 0&&(T=2),_.morphAttributes.color!==void 0&&(T=3);let E,D,O,k;if(x){let e=Wo[x];E=e.vertexShader,D=e.fragmentShader}else{E=i.vertexShader,D=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),ee=m.isInstancedMesh===!0,M=m.isBatchedMesh===!0,N=!!i.map,P=!!i.matcap,F=!!b,te=F&&b.isPMREMTexture===!0,ne=!!i.aoMap,re=!!i.lightMap,ie=!!i.bumpMap&&i.wireframe===!1,ae=!!i.normalMap,oe=!!i.displacementMap,se=!!i.emissiveMap,ce=!!i.metalnessMap,le=!!i.roughnessMap,ue=i.anisotropy>0,I=i.clearcoat>0,de=i.diffuseRoughness>0,fe=i.dispersion>0,pe=i.retroreflectivity>0,me=i.iridescence>0,he=i.sheen>0,ge=i.transmission>0,_e=ue&&!!i.anisotropyMap,ve=I&&!!i.clearcoatMap,ye=I&&!!i.clearcoatNormalMap,be=I&&!!i.clearcoatRoughnessMap,xe=de&&!!i.diffuseRoughnessMap,Se=me&&!!i.iridescenceMap,Ce=me&&!!i.iridescenceThicknessMap,L=he&&!!i.sheenColorMap,we=he&&!!i.sheenRoughnessMap,Te=!!i.specularMap,Ee=!!i.specularColorMap,R=!!i.specularIntensityMap,z=ge&&!!i.transmissionMap,De=ge&&!!i.thicknessMap,Oe=!!i.gradientMap,ke=!!i.alphaMap,Ae=i.alphaTest>0,B=!!i.alphaHash,je=!!i.extensions,V=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(V=e.toneMapping);let H=te?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,Me={shaderID:x,shaderType:i.type,shaderName:i.name,vertexShader:E,fragmentShader:D,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:S,batching:M,batchingColor:M&&m._colorsTexture!==null,instancing:ee,instancingColor:ee&&m.instanceColor!==null,instancingMorph:ee&&m.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:mn.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:N,matcap:P,envMap:F,envMapMode:F&&b.mapping,envMapPMREM:te,envMapMaxLod:te?H.length-1:null,envMapSize:te?H[0].width:null,aoMap:ne,lightMap:re,bumpMap:ie,normalMap:ae,displacementMap:oe,emissiveMap:se,normalMapObjectSpace:ae&&i.normalMapType===1,normalMapTangentSpace:ae&&i.normalMapType===0,packedNormalMap:ae&&i.normalMapType===0&&hl(i.normalMap.format),metalnessMap:ce,roughnessMap:le,anisotropy:ue,anisotropyMap:_e,clearcoat:I,clearcoatMap:ve,clearcoatNormalMap:ye,clearcoatRoughnessMap:be,diffuseRoughness:de,diffuseRoughnessMap:xe,dispersion:fe,retroreflection:pe,iridescence:me,iridescenceMap:Se,iridescenceThicknessMap:Ce,sheen:he,sheenColorMap:L,sheenRoughnessMap:we,specularMap:Te,specularColorMap:Ee,specularIntensityMap:R,transmission:ge,transmissionMap:z,thicknessMap:De,gradientMap:Oe,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:ke,alphaTest:Ae,alphaHash:B,combine:i.combine,mapUv:N&&p(i.map.channel),aoMapUv:ne&&p(i.aoMap.channel),lightMapUv:re&&p(i.lightMap.channel),bumpMapUv:ie&&p(i.bumpMap.channel),normalMapUv:ae&&p(i.normalMap.channel),displacementMapUv:oe&&p(i.displacementMap.channel),emissiveMapUv:se&&p(i.emissiveMap.channel),metalnessMapUv:ce&&p(i.metalnessMap.channel),roughnessMapUv:le&&p(i.roughnessMap.channel),anisotropyMapUv:_e&&p(i.anisotropyMap.channel),clearcoatMapUv:ve&&p(i.clearcoatMap.channel),clearcoatNormalMapUv:ye&&p(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&p(i.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:xe&&p(i.diffuseRoughnessMap.channel),iridescenceMapUv:Se&&p(i.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&p(i.iridescenceThicknessMap.channel),sheenColorMapUv:L&&p(i.sheenColorMap.channel),sheenRoughnessMapUv:we&&p(i.sheenRoughnessMap.channel),specularMapUv:Te&&p(i.specularMap.channel),specularColorMapUv:Ee&&p(i.specularColorMap.channel),specularIntensityMapUv:R&&p(i.specularIntensityMap.channel),transmissionMapUv:z&&p(i.transmissionMap.channel),thicknessMapUv:De&&p(i.thicknessMap.channel),alphaMapUv:ke&&p(i.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(ae||ue),vertexNormals:!!_.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!_.attributes.uv&&(N||ke),fog:!!g,useFog:i.fog===!0,fogExp2:!!g&&g.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||_.attributes.normal===void 0&&ae===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:_.attributes.position!==void 0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:w,morphTextureStride:T,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:h.filter(e=>e.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:V,decodeVideoTexture:N&&i.map.isVideoTexture===!0&&mn.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:se&&i.emissiveMap.isVideoTexture===!0&&mn.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:je&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(je&&i.extensions.multiDraw===!0||M)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Me.vertexUv1s=c.has(1),Me.vertexUv2s=c.has(2),Me.vertexUv3s=c.has(3),c.clear(),Me}function h(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),_(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function _(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.diffuseRoughness&&o.enable(25),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function v(e){let t=f[e.type],n;if(t){let e=Wo[t];n=Aa.clone(e.uniforms)}else n=e.uniforms;return n}function y(t,n){let r=u.get(n);return r===void 0?(r=new dl(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function b(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function x(e){s.remove(e)}function S(){s.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:y,releaseProgram:b,releaseShaderCache:x,programs:l,dispose:S}}function _l(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function vl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function yl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function bl(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||vl),r.length>1&&r.sort(t||yl),i.length>1&&i.sort(t||yl)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function xl(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new bl,e.set(t,[i])):n>=r.length?(i=new bl,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Sl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new G,color:new q};break;case`SpotLight`:n={position:new G,direction:new G,color:new q,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new G,color:new q,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new G,skyColor:new q,groundColor:new q};break;case`RectAreaLight`:n={color:new q,position:new G,halfWidth:new G,halfHeight:new G}}return e[t.id]=n,n}}}function Cl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new on};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new on};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new on,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var wl=0;function Tl(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function El(e){let t=new Sl,n=Cl(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new G);let i=new G,a=new An,o=new An;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Tl);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=J.LTC_FLOAT_1,r.rectAreaLTC2=J.LTC_FLOAT_2):(r.rectAreaLTC1=J.LTC_HALF_1,r.rectAreaLTC2=J.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=wl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Dl(e){let t=new El(e),n=[],r=[],i=[];function a(e){u.camera=e,n.length=0,r.length=0,i.length=0}function o(e){e.isLightProbeGrid?i.push(e):n.push(e)}function s(e){r.push(e)}function c(){t.setup(n),i.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function l(e){t.setupView(n,e)}let u={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function Ol(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Dl(e),t.set(n,[a])):r>=i.length?(a=new Dl(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var kl=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Al=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,jl=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],Ml=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],Nl=new An,Pl=new G,Fl=new G;function Il(e,t,n){let r=new qi,i=new on,a=new on,o=new Tn,s=new La,c=new Ra,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Na({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new on},radius:{value:4}},vertexShader:kl,fragmentShader:Al}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new si;m.setAttribute(`position`,new Kr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new ji(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(U(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){U(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){U(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Dn(i.x,i.y,{format:Ie,type:z,minFilter:ye,magFilter:ye,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new aa(i.x,i.y,R),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Me,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=ge,d.map.depthTexture.magFilter=ge}else l.isPointLight?(d.map=new $o(i.x),d.map.depthTexture=new oa(i.x,Ee)):(d.map=new Dn(i.x,i.y),d.map.depthTexture=new aa(i.x,i.y,Ee)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Me,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=ye,d.map.depthTexture.magFilter=ye):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=ge,d.map.depthTexture.magFilter=ge);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);let _=d.camera.layers.mask&4294967294?d.camera.layers:s.layers;for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Pl.setFromMatrixPosition(l.matrixWorld),e.position.copy(Pl),Fl.copy(e.position),Fl.add(jl[t]),e.up.copy(Ml[t]),e.lookAt(Fl),e.updateMatrixWorld(),n.makeTranslation(-Pl.x,-Pl.y,-Pl.z),Nl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Nl,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,_,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new Dn(i.x,i.y,{format:Ie,type:z}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s,c){if(n.visible===!1)return;if(n.layers.test(s)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),s=n.material;if(Array.isArray(s)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=s[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,c);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(s.visible){let t=y(n,s,o,c);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let l=n.children;for(let e=0,t=l.length;e<t;e++)b(l[e],i,a,o,s,c)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Ll(e,t){function n(){let t=!1,n=new Tn,r=null,i=new Tn(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ce(e.DEPTH_TEST):le(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Kt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ce(e.STENCIL_TEST):le(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c={},l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ee=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,N=0,P=e.getParameter(e.VERSION);P.indexOf(`WebGL`)===-1?P.indexOf(`OpenGL ES`)!==-1&&(N=parseFloat(/^OpenGL ES (\d)/.exec(P)[1]),M=N>=2):(N=parseFloat(/^WebGL (\d)/.exec(P)[1]),M=N>=1);let F=null,te={},ne=e.getParameter(e.SCISSOR_BOX),re=e.getParameter(e.VIEWPORT),ie=new Tn().fromArray(ne),ae=new Tn().fromArray(re);function oe(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let se={};se[e.TEXTURE_2D]=oe(e.TEXTURE_2D,e.TEXTURE_2D,1),se[e.TEXTURE_CUBE_MAP]=oe(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[e.TEXTURE_2D_ARRAY]=oe(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),se[e.TEXTURE_3D]=oe(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ce(e.DEPTH_TEST),o.setFunc(3),ge(!1),_e(1),ce(e.CULL_FACE),me(0);function ce(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function le(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ue(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function I(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function de(t){return h!==t&&(e.useProgram(t),h=t,!0)}let fe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};fe[103]=e.MIN,fe[104]=e.MAX;let pe={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function me(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(le(e.BLEND),g=!1);else if(g===!1&&(ce(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:W(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:W(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:W(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:W(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(fe[n],fe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(pe[r],pe[i],pe[o],pe[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function he(t,n){t.side===2?le(e.CULL_FACE):ce(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ge(r),t.blending===1&&t.transparent===!1?me(0):me(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ye(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ce(e.SAMPLE_ALPHA_TO_COVERAGE):le(e.SAMPLE_ALPHA_TO_COVERAGE)}function ge(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function _e(t){t===0?le(e.CULL_FACE):(ce(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ve(t){t!==k&&(M&&e.lineWidth(t),k=t)}function ye(t,n,r){t?(ce(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n,r=-r),e.polygonOffset(n,r))):le(e.POLYGON_OFFSET_FILL)}function be(t){t?ce(e.SCISSOR_TEST):le(e.SCISSOR_TEST)}function xe(t){t===void 0&&(t=e.TEXTURE0+ee-1),F!==t&&(e.activeTexture(t),F=t)}function Se(t,n,r){r===void 0&&(r=F===null?e.TEXTURE0+ee-1:F);let i=te[r];i===void 0&&(i={type:void 0,texture:void 0},te[r]=i),(i.type!==t||i.texture!==n)&&(F!==r&&(e.activeTexture(r),F=r),e.bindTexture(t,n||se[t]),i.type=t,i.texture=n)}function Ce(){let t=te[F];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function L(){try{e.compressedTexImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function we(){try{e.compressedTexImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Te(){try{e.texSubImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Ee(){try{e.texSubImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function R(){try{e.compressedTexSubImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function z(){try{e.compressedTexSubImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function De(){try{e.texStorage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Oe(){try{e.texStorage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function ke(){try{e.texImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Ae(){try{e.texImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function B(t){return d[t]===void 0?e.getParameter(t):d[t]}function je(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function V(t){ie.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ie.copy(t))}function H(t){ae.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ae.copy(t))}function Me(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,i,i),r.set(t,i))}function Ne(t,n,r){let i=l.get(n).get(t);c[i]!==r&&(e.bindBufferBase(e.UNIFORM_BUFFER,i,r),c[i]=r)}function Pe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},F=null,te={},f={},c={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ie.set(0,0,e.canvas.width,e.canvas.height),ae.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ce,disable:le,bindFramebuffer:ue,drawBuffers:I,useProgram:de,setBlending:me,setMaterial:he,setFlipSided:ge,setCullFace:_e,setLineWidth:ve,setPolygonOffset:ye,setScissorTest:be,activeTexture:xe,bindTexture:Se,unbindTexture:Ce,compressedTexImage2D:L,compressedTexImage3D:we,texImage2D:ke,texImage3D:Ae,pixelStorei:je,getParameter:B,updateUBOMapping:Me,uniformBlockBinding:Ne,texStorage2D:De,texStorage3D:Oe,texSubImage2D:Te,texSubImage3D:Ee,compressedTexSubImage2D:R,compressedTexSubImage3D:z,scissor:V,viewport:H,reset:Pe}}function Rl(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new on,u=new WeakMap,d=new Set,f,p=new WeakMap,m=new Set,h=new FinalizationRegistry(e=>m.delete(e)),g=!1;try{g=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function _(e,t){return g?new OffscreenCanvas(e,t):zt(`canvas`)}function v(e,t,n){let r=1,i=Pe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=_(n,a));let o=t?_(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),U(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&U(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function y(e){return e.generateMipmaps}function b(t){e.generateMipmap(t)}function x(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function S(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];U(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||U(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?jt:mn.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function C(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,U(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function w(e,t){return y(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function T(e){let t=new WeakRef(e);r.get(e).__ref=t,m.add(t),h.register(e,t,t)}function E(e){let t=r.get(e).__ref;t!==void 0&&(m.delete(t),h.unregister(t))}function D(e){k(e.target)}function O(e){A(e.target)}function k(e){e.removeEventListener(`dispose`,D),E(e),ee(e),e.isVideoTexture&&u.delete(e),e.isHTMLTexture&&d.delete(e)}function A(e){e.removeEventListener(`dispose`,O),E(e),N(e)}function j(){for(let e of m){let t=e.deref();t!==void 0&&(t.isRenderTarget===!0?A(t):k(t))}m.clear(),d.clear()}function ee(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&M(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function M(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function N(t){let n=r.get(t);n.__depthDisposeCallback&&n.__depthDisposeCallback();let i=t.depthTexture;if(i&&i.renderTarget===t&&k(i),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let a=t.textures;for(let t=0,n=a.length;t<n;t++){let n=r.get(a[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(a[t])}r.remove(t)}let P=0;function F(){P=0}function te(){return P}function ne(e){P=e}function re(){let e=P;return e>=i.maxTextures&&U(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),P+=1,e}function ie(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ae(t,i){let a=r.get(t);if(t.isVideoTexture&&H(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)U(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)U(`WebGLRenderer: Texture marked for update but image is incomplete`);else{L(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function oe(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?L(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function se(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?L(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ce(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?we(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let le={[pe]:e.REPEAT,[me]:e.CLAMP_TO_EDGE,[he]:e.MIRRORED_REPEAT},ue={[ge]:e.NEAREST,[_e]:e.NEAREST_MIPMAP_NEAREST,[ve]:e.NEAREST_MIPMAP_LINEAR,[ye]:e.LINEAR,[be]:e.LINEAR_MIPMAP_NEAREST,[xe]:e.LINEAR_MIPMAP_LINEAR},I={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function de(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&U(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,le[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,le[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,le[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ue[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ue[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,I[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function fe(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,D),T(n));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=ie(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&M(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function Se(e,t,n){return Math.floor(Math.floor(e/n)/t)}function Ce(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=Se(n.start,r.width,4),c=Se(t.start,r.width,4);n.start<=i+1&&a===c&&Se(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function L(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=fe(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=mn.getPrimaries(mn.workingColorSpace),r=o.colorSpace===``?null:mn.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=v(o.image,!1,i.maxTextureSize);t=Me(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=S(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);de(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,x=f.__version===void 0||l===!0,T=u.dataReady,E=w(o,t);if(o.isDepthTexture)m=C(o.format===Ne,o.type),x&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else _?(x&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&Ce(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(T){if(o.layerUpdates.size>0){let t=zo(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else U(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?U(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=zo(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)_?(x&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(x){if(_)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&x){let t=Pe(g[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(_){if(x){let r=Pe(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);y(o)&&o.mipmapsAutoUpdate===!0&&b(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function we(t,o,s){if(o.image.length!==6)return;let c=fe(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=mn.getPrimaries(mn.workingColorSpace),r=o.colorSpace===``?null:mn.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=v(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Me(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),x=S(o.internalFormat,g,_,o.normalized,o.colorSpace),T=o.isVideoTexture!==!0,E=u.__version===void 0||c===!0,D=l.dataReady,O=w(o,h);de(e.TEXTURE_CUBE_MAP,o);let k;if(o.isDepthTexture){if(x=C(o.format===Ne,o.type),E){if(T)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,x,h.width,h.height);else for(let t=0;t<6;t++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,h.width,h.height,0,g,_,null)}}else if(f){T&&E&&n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,h.width,h.height);for(let t=0;t<6;t++){k=m[t].mipmaps;for(let r=0;r<k.length;r++){let i=k[r];o.format===1023?T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,g,_,i.data):g===null?U(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):T?D&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,i.data)}}}else{if(k=o.mipmaps,T&&E){k.length>0&&O++;let t=Pe(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,t.width,t.height)}for(let t=0;t<6;t++)if(p){T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<k.length;r++){let i=k[r].image[t].image;T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,i.width,i.height,0,g,_,i.data)}}else{T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,g,_,m[t]);for(let r=0;r<k.length;r++){let i=k[r];T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,g,_,i.image[t])}}}y(o)&&o.mipmapsAutoUpdate===!0&&b(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function Te(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=S(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),V(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,je(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ee(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=C(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;V(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,je(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,je(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=S(o.internalFormat,c,l,o.normalized,o.colorSpace);V(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,je(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,je(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function R(t,i,a){let o=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=r.get(i.depthTexture);c.__renderTarget=i;let l=o?i.depthTexture.image[0]:i.depthTexture.image;c.__webglTexture&&l.width===i.width&&l.height===i.height||(l.width=i.width,l.height=i.height,i.depthTexture.needsUpdate=!0),o?ce(i.depthTexture,0):ae(i.depthTexture,0);let u=c.__webglTexture,d=je(i),f=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)V(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)V(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function z(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)R(i.__webglFramebuffer[e],t,e);else t.texture.mipmaps.length>0?R(i.__webglFramebuffer[0],t,0):R(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),Ee(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else if(t.texture.mipmaps.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),Ee(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function De(t,n,i){let a=r.get(t);n!==void 0&&Te(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&z(t)}function Oe(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,O),T(t);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&V(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=S(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=je(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),Ee(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),de(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)Te(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else Te(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);y(i)?b(e.TEXTURE_CUBE_MAP):i.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),de(c,a),Te(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),y(a)&&b(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),de(r,i),i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)Te(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else Te(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);y(i)?b(r):i.mipmaps.length>0&&e.texParameteri(r,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}t.depthBuffer&&z(t)}function ke(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(y(a)&&a.mipmapsAutoUpdate===!0){let t=x(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),b(t),n.unbindTexture()}}}let Ae=[];function B(t){if(t.samples>0){if(V(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.texture.mipmaps.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Ae.length=0,Ae.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&Ae.push(l),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ae))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function je(e){return Math.min(i.maxSamples,e.samples)}function V(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function H(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Me(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(mn.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&U(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):W(`WebGLTextures: Unsupported texture color space:`,n)),t}function Pe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=re,this.resetTextureUnits=F,this.getTextureUnits=te,this.setTextureUnits=ne,this.setTexture2D=ae,this.setTexture2DArray=oe,this.setTexture3D=se,this.setTextureCube=ce,this.rebindTextures=De,this.setupRenderTarget=Oe,this.updateRenderTargetMipmap=ke,this.updateMultisampleRenderTarget=B,this.setupDepthRenderbuffer=z,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=V,this.dispose=j}function zl(e,t){function n(n,r=``){let i,a=mn.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Bl=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Vl=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Hl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new sa(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Na({vertexShader:Bl,fragmentShader:Vl,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ji(new Sa(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ul=class extends qt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Hl,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new on,C=null,w=null,T=new yo;T.viewport=new Tn;let E=new yo;E.viewport=new Tn;let D=[T,E],O=new Eo,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new or,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new or,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new or,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ee(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,ee),r.removeEventListener(`inputsourceschange`,M);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,ne.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&U(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&U(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,ee),r.addEventListener(`inputsourceschange`,M),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?Ne:Me,a=_.stencil?ke:Ee);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Dn(d.textureWidth,d.textureHeight,{format:H,type:Se,depthTexture:new aa(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Dn(f.framebufferWidth,f.framebufferHeight,{format:H,type:Se,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ne.setContext(r),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function M(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}function N(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;N(O,i);for(let e=0;e<a.length;e++)N(a[e],i);O.projectionMatrix.copy(T.projectionMatrix),O.projectionMatrixInverse.copy(T.projectionMatrixInverse),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),P(e,O,i)};function P(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Xt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let F=null;function te(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new yo,o.layers.enable(n),o.viewport=new Tn,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new sa,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}F&&F(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let ne=new Vo;ne.setAnimationLoop(te),this.setAnimationLoop=function(e){F=e},this.dispose=function(){}}},Wl=new An,Gl=new K;Gl.set(-1,0,0,0,1,0,0,0,1);function Kl(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,ka(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Wl.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Gl),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function ql(e,t,n,r){let i={},a={};function o(e,t){let n=t.program;r.uniformBlockBinding(e,n,i[e.id])}function s(e,n){let o=i[e.id];o===void 0&&(m(e),o=c(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let u=t.render.frame;a[e.id]!==u&&(l(e),a[e.id]=u)}function c(t){let n=e.createBuffer(),r=t.__size,i=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,r,i),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function l(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)u(t[n],e,n,a);else u(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function u(t,n,r,i){if(f(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=h(i,!0);d(i,t.__data,e),e+=a.storage/Float32Array.BYTES_PER_ELEMENT}}else d(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function d(e,t,n){typeof e==`number`||typeof e==`boolean`?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,r){let i=e.value,a=t+`_`+n;if(Array.isArray(i)){r[a]===void 0&&(r[a]=[]);let e=r[a],t=!1;for(let n=0;n<i.length;n++)p(i[n],e,n)===!0&&(t=!0);return t}return p(i,r,a)}function p(e,t,n){if(t[n]===void 0)return t[n]=typeof e==`number`||typeof e==`boolean`?e:ArrayBuffer.isView(e)?e.slice():e.clone(),!0;{let r=t[n];if(typeof e==`number`||typeof e==`boolean`){if(r!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(r.equals(e)===!1)return r.copy(e),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let i=0,a=r.length;i<a;i++){let a=r[i],o=Array.isArray(a.value)?a.value:[a.value],s=Array.isArray(t[e])||Array.isArray(a.value),c=n;for(let e=0,t=o.length;e<t;e++){let t=o[e],r=h(t,s),i=n%16,a=i%r.boundary,l=i+a;n+=a,l!==0&&16-l<r.storage&&(n+=16-l),e===0&&(c=n),n+=r.storage}a.__data=new(a.type===`int`?Int32Array:a.type===`uint`?Uint32Array:Float32Array)((n-c)/Float32Array.BYTES_PER_ELEMENT),a.__offset=c}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e,t){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?U(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):U(`WebGLRenderer: Unsupported uniform value type.`,e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function g(t){let n=t.target;n.removeEventListener(`dispose`,g),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);i={},a={}}return{bind:o,update:s,dispose:_}}var Jl=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Yl=null;function Xl(){return Yl===null&&(Yl=new Pi(Jl,16,16,Ie,z),Yl.name=`DFG_LUT`,Yl.minFilter=ye,Yl.magFilter=ye,Yl.wrapS=me,Yl.wrapT=me,Yl.generateMipmaps=!1,Yl.needsUpdate=!0),Yl}var Zl=class{constructor(e={}){let{canvas:t=Bt(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Se}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([Re,Le,Fe]),g=new Set([Se,Ee,we,ke,De,Oe]),_=new Uint32Array(4),v=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=kt;let j=0,ee=0,M=null,N=-1,P=null,F=new Tn,te=new Tn,ne=null,re=new q(0),ie=0,ae=t.width,oe=t.height,se=1,ce=null,le=null,ue=new Tn(0,0,ae,oe),I=new Tn(0,0,ae,oe),de=!1,fe=new qi,pe=new Yi,me=!1,he=!1,ge=new An,_e=new G,ve=new Tn,ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},be=!1;function Ce(){return M===null?se:1}let L=n;function Te(e,n){return t.getContext(e,n)}let R,Ae,B,je,V,H,Me,Ne,Pe,Ie,ze,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r187`),t.addEventListener(`webglcontextlost`,et,!1),t.addEventListener(`webglcontextrestored`,tt,!1),t.addEventListener(`webglcontextcreationerror`,nt,!1),L===null){let t=`webgl2`;if(L=Te(t,e),L===null)throw Te(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Qe()}catch(e){throw t.removeEventListener(`webglcontextlost`,et,!1),t.removeEventListener(`webglcontextrestored`,tt,!1),t.removeEventListener(`webglcontextcreationerror`,nt,!1),W(`WebGLRenderer: `+e.message),e}function Qe(){R=new _s(L),R.init(),Ye=new zl(L,R),Ae=new Zo(L,R,e,Ye),B=new Ll(L,R),Ae.reversedDepthBuffer&&d&&B.buffers.depth.setReversed(!0),O=L.createFramebuffer(),k=L.createFramebuffer(),A=L.createFramebuffer(),je=new bs(L),V=new _l,H=new Rl(L,R,B,V,Ae,Ye,je),Me=new gs(T),Ne=new Ho(L),Xe=new Yo(L,Ne),Pe=new vs(L,Ne,je,Xe),Ie=new Ss(L,Pe,Ne,Xe,je),Ke=new xs(L,Ae,H),Ue=new Qo(V),ze=new gl(T,Me,R,Ae,Xe,Ue),Be=new Kl(T,V),Ve=new xl,He=new Ol(R),Ge=new Jo(T,Me,B,Ie,p,s),We=new Il(T,Ie,Ae),Ze=new ql(L,je,Ae,B),qe=new Xo(L,R,je),Je=new ys(L,R,je),je.programs=ze.programs,T.capabilities=Ae,T.extensions=R,T.properties=V,T.renderLists=Ve,T.shadowMap=We,T.state=B,T.info=je}m!==1009&&(w=new ws(m,t.width,t.height,o,r,i));let $e=new Ul(T,L);this.xr=$e,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let e=R.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=R.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(e){e!==void 0&&(se=e,this.setSize(ae,oe,!1))},this.getSize=function(e){return e.set(ae,oe)},this.setSize=function(e,n,r=!0){$e.isPresenting?U(`WebGLRenderer: Can't change size while VR device is presenting.`):(ae=e,oe=n,t.width=Math.floor(e*se),t.height=Math.floor(n*se),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(ae*se,oe*se).floor()},this.setDrawingBufferSize=function(e,n,r){ae=e,oe=n,se=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)W(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){U(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(F)},this.getViewport=function(e){return e.copy(ue)},this.setViewport=function(e,t,n,r){e.isVector4?ue.set(e.x,e.y,e.z,e.w):ue.set(e,t,n,r),B.viewport(F.copy(ue).multiplyScalar(Ce()).round())},this.getScissor=function(e){return e.copy(I)},this.setScissor=function(e,t,n,r){e.isVector4?I.set(e.x,e.y,e.z,e.w):I.set(e,t,n,r),B.scissor(te.copy(I).multiplyScalar(Ce()).round())},this.getScissorTest=function(){return de},this.setScissorTest=function(e){B.setScissorTest(de=e)},this.setOpaqueSort=function(e){ce=e},this.setTransparentSort=function(e){le=e},this.getClearColor=function(e){return e.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor(...arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(M!==null){let t=M.texture.format;e=h.has(t)}if(e){let e=M.texture.type,t=g.has(e),n=Ge.getClearColor(),r=Ge.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,L.clearBufferuiv(L.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,L.clearBufferiv(L.COLOR,0,v))}else r|=L.COLOR_BUFFER_BIT}t&&(r|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&L.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,et,!1),t.removeEventListener(`webglcontextrestored`,tt,!1),t.removeEventListener(`webglcontextcreationerror`,nt,!1),Ge.dispose(),Ve.dispose(),He.dispose(),H.dispose(),V.dispose(),Me.dispose(),Ie.dispose(),Pe.dispose(),Xe.dispose(),Ze.dispose(),ze.dispose(),$e.dispose(),$e.removeEventListener(`sessionstart`,lt),$e.removeEventListener(`sessionend`,ut),dt.stop()};function et(e){e.preventDefault(),Ht(`WebGLRenderer: Context Lost.`),E=!0}function tt(){Ht(`WebGLRenderer: Context Restored.`),E=!1;let e=je.autoReset,t=We.enabled,n=We.autoUpdate,r=We.needsUpdate,i=We.type;Qe(),je.autoReset=e,We.enabled=t,We.autoUpdate=n,We.needsUpdate=r,We.type=i}function nt(e){W(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function rt(e){let t=e.target;t.removeEventListener(`dispose`,rt),it(t)}function it(e){at(e),V.remove(e)}function at(e){let t=V.get(e).programs;t!==void 0&&(t.forEach(function(e){ze.releaseProgram(e)}),e.isShaderMaterial&&ze.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ye);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=St(e,t,n,r,i);B.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Pe.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Xe.setup(i,r,s,n,c);let h,g=qe;if(c!==null&&(h=Ne.get(c),g=Je,g.setIndex(h)),i.isMesh)r.wireframe===!0?(B.setLineWidth(r.wireframeLinewidth*Ce()),g.setMode(L.LINES)):g.setMode(L.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),B.setLineWidth(e*Ce()),i.isLineSegments?g.setMode(L.LINES):i.isLineLoop?g.setMode(L.LINE_LOOP):g.setMode(L.LINE_STRIP)}else i.isPoints?g.setMode(L.POINTS):i.isSprite&&g.setMode(L.TRIANGLES);if(i.isBatchedMesh){if(R.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ne.get(c).bytesPerElement:1,o=V.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(L,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ot(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),me===!0&&Ue.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,vt(e,t,r),e.side=0,e.needsUpdate=!0,vt(e,t,r),e.side=2):vt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=He.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),he=this.localClippingEnabled,me=Ue.init(this.clippingPlanes,he),me===!0&&Ue.setGlobalState(this.clippingPlanes,t),D!==null&&We.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];ot(o,n,t,e),r.add(o)}else ot(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=V.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}R.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let st=null;function ct(e){st&&st(e)}function lt(){dt.stop()}function ut(){dt.start()}let dt=new Vo;dt.setAnimationLoop(ct),typeof self<`u`&&dt.setContext(self),this.setAnimationLoop=function(e){st=e,$e.setAnimationLoop(e),e===null?dt.stop():dt.start()},$e.addEventListener(`sessionstart`,lt),$e.addEventListener(`sessionend`,ut),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){W(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=$e.enabled===!0&&$e.isPresenting===!0,r=w!==null&&(M===null||n)&&w.begin(T,M);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),$e.enabled===!0&&$e.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&($e.cameraAutoUpdate===!0&&$e.updateCamera(t),t=$e.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,M),x=He.get(e,C.length),x.init(t),x.state.textureUnits=H.getTextureUnits(),C.push(x),ge.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?pe.setFromArrayCamera(t):fe.setFromProjectionMatrix(ge,It,t.reversedDepth),he=this.localClippingEnabled,me=Ue.init(this.clippingPlanes,he),b=Ve.get(e,S.length),b.init(),S.push(b),this.info.render.frame++,$e.enabled===!0&&$e.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&ft(e,t,-1/0,T.sortObjects)}ft(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(ce,le),be=$e.enabled===!1||$e.isPresenting===!1||$e.hasDepthSensing()===!1,be&&Ge.addToRenderList(b,e),this.info.autoReset===!0&&this.info.reset(),me===!0&&Ue.beginShadows();let i=x.state.shadowsArray;if(We.render(i,e,t),me===!0&&Ue.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];mt(n,r,e,a)}be&&Ge.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];pt(b,e,n,n.viewport)}}else r.length>0&&mt(n,r,e,t),be&&Ge.render(e),pt(b,e,t)}M!==null&&ee===0&&(H.updateMultisampleRenderTarget(M),H.updateRenderTargetMipmap(M)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Xe.resetDefaultState(),N=-1,P=null,C.pop(),C.length>0?(x=C[C.length-1],H.setTextureUnits(x.state.textureUnits),me===!0&&Ue.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function ft(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){let i=t.isArrayCamera?pe:fe;if(!e.frustumCulled||e.intersectsFrustum(i)){r&&ve.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ge);let i=Ie.update(e),a=e.material;a.visible&&b.push(e,i,a,n,ve.z,null,t)}}else if(e.isMesh||e.isLine||e.isPoints){let i=t.isArrayCamera?pe:fe;if(!e.frustumCulled||e.intersectsFrustum(i)){let i=Ie.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),ve.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),ve.copy(e.boundingSphere.center)),ve.applyMatrix4(e.matrixWorld).applyMatrix4(ge)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,ve.z,s,t)}}else a.visible&&b.push(e,i,a,n,ve.z,null,t)}}}let i=e.children;for(let e=0,a=i.length;e<a;e++)ft(i[e],t,n,r)}function pt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),me===!0&&Ue.setGlobalState(T.clippingPlanes,n),r&&B.viewport(F.copy(r)),i.length>0&&ht(i,t,n),a.length>0&&ht(a,t,n),o.length>0&&ht(o,t,n),B.buffers.depth.setTest(!0),B.buffers.depth.setMask(!0),B.buffers.color.setMask(!0),B.setPolygonOffset(!1)}function mt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=R.has(`EXT_color_buffer_half_float`)||R.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new Dn(1,1,{generateMipmaps:!0,type:e?z:Se,minFilter:xe,samples:Math.max(4,Ae.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:mn.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||F;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(re),ie=T.getClearAlpha(),ie<1&&T.setClearColor(16777215,.5),T.clear(),be&&Ge.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),me===!0&&Ue.setGlobalState(T.clippingPlanes,r),ht(e,n,r),H.updateMultisampleRenderTarget(a),H.updateRenderTargetMipmap(a),R.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,gt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(H.updateMultisampleRenderTarget(a),H.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(re,ie),d!==void 0&&(r.viewport=d),T.toneMapping=u}function ht(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&gt(o,t,n,s,l,c)}}function gt(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function _t(e){let t=0;for(let n of e)n.texture!==null&&t++;return t}function vt(e,t,n){t.isScene!==!0&&(t=ye);let r=V.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=ze.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=ze.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Me.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,rt),l=new Map,r.programs=l,r.programVariants=new Map);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return xt(e,s),d}else s.uniforms=ze.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=ze.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ue.uniform),xt(e,s),r.needsLights=wt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.numLightProbeGrids=_t(x.state.lightProbeGridArray),r.currentProgram=d,r.uniformsList=null,d}function yt(e,t,n,r,i){let a=V.get(e),o=a.currentProgram.id+`,`+r+`,`+i,s=a.programVariants.get(o);return s===void 0?(s=vt(e,t,n),a.programVariants.set(o,s)):(a.currentProgram=s,a.uniformsList=null,a.outputColorSpace=r,a.toneMapping=i),s}function bt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Nc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function xt(e,t){let n=V.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function St(e,t,n,r,i){t.isScene!==!0&&(t=ye),H.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=M===null?T.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:mn.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Me.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=V.get(r),b=x.state.lights;if(me===!0&&(he===!0||e!==P)){let t=e===P&&r.id===N;Ue.setState(r,e,t)}let S=!1,C=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==b.state.version||i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?S=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ue.numPlanes||v.numIntersection!==Ue.numIntersection)?S=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.morphTargetsCount===_&&v.numLightProbeGrids===_t(x.state.lightProbeGridArray)?(v.outputColorSpace!==s||v.toneMapping!==h)&&(C=!0):S=!0:S=!0:(S=!0,v.__version=r.version);let w=v.currentProgram;(S===!0||C===!0)&&(w=C===!0?yt(r,t,i,s,h):vt(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,w,v));let E=!1,O=!1,k=!1,A=w.getUniforms(),j=v.uniforms;if(B.useProgram(w.program)&&(E=!0,O=!0,k=!0),r.id!==N&&(N=r.id,O=!0),E||P!==e){B.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),A.setValue(L,`projectionMatrix`,e.projectionMatrix),A.setValue(L,`viewMatrix`,e.matrixWorldInverse);let t=A.map.cameraPosition;t!==void 0&&t.setValue(L,_e.setFromMatrixPosition(e.matrixWorld)),Ae.logarithmicDepthBuffer&&A.setValue(L,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&A.setValue(L,`isOrthographic`,e.isOrthographicCamera===!0),P!==e&&(P=e,O=!0,k=!0)}if(v.needsLights&&(b.state.sunShadowMap.length>0&&A.setValue(L,`sunShadowMap`,b.state.sunShadowMap,H),b.state.directionalShadowMap.length>0&&A.setValue(L,`directionalShadowMap`,b.state.directionalShadowMap,H),b.state.spotShadowMap.length>0&&A.setValue(L,`spotShadowMap`,b.state.spotShadowMap,H),b.state.pointShadowMap.length>0&&A.setValue(L,`pointShadowMap`,b.state.pointShadowMap,H)),i.isSkinnedMesh){A.setOptional(L,i,`bindMatrix`),A.setOptional(L,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),A.setValue(L,`boneTexture`,e.boneTexture,H))}i.isBatchedMesh&&(A.setOptional(L,i,`batchingTexture`),A.setValue(L,`batchingTexture`,i._matricesTexture,H),A.setOptional(L,i,`batchingIdTexture`),A.setValue(L,`batchingIdTexture`,i._indirectTexture,H),A.setOptional(L,i,`batchingColorTexture`),i._colorsTexture!==null&&A.setValue(L,`batchingColorTexture`,i._colorsTexture,H));let ee=n.morphAttributes;if((ee.position!==void 0||ee.normal!==void 0||ee.color!==void 0)&&Ke.update(i,n,w),(O||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,A.setValue(L,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(j.envMapIntensity.value=t.environmentIntensity),j.dfgLUT!==void 0&&(j.dfgLUT.value=Xl()),O){if(A.setValue(L,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&Ct(j,k),a&&r.fog===!0&&Be.refreshFogUniforms(j,a),Be.refreshMaterialUniforms(j,r,se,oe,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.numLightProbeGrids>0){let e=y,t=0;for(let n of x.state.lightProbeGridArray)n.texture!==null&&(e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++);for(let n in e)e[n].length=t;j.probesSH.value=e.textures,j.probesMin.value=e.min,j.probesMax.value=e.max,j.probesResolution.value=e.resolution}Nc.upload(L,bt(v),j,H)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Nc.upload(L,bt(v),j,H),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&A.setValue(L,`center`,i.center),A.setValue(L,`modelViewMatrix`,i.modelViewMatrix),A.setValue(L,`normalMatrix`,i.normalMatrix),A.setValue(L,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ze.update(n,w),Ze.bind(n,w)}}return w}function Ct(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function wt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return ee},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(e,t,n){let r=V.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),V.get(e.texture).__webglTexture=t,V.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=V.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){M=e,j=t,ee=n;let r=null,i=!1,a=!1;if(e){let o=V.get(e);if(o.__useDefaultFramebuffer!==void 0){B.bindFramebuffer(L.FRAMEBUFFER,o.__webglFramebuffer),F.copy(e.viewport),te.copy(e.scissor),ne=e.scissorTest,B.viewport(F),B.scissor(te),B.setScissorTest(ne),N=-1;return}if(o.__webglFramebuffer===void 0)H.setupRenderTarget(e);else if(o.__hasExternalTextures)H.rebindTextures(e,V.get(e.texture).__webglTexture,V.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&V.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);H.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=V.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&H.useMultisampledRTT(e)===!1?V.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,F.copy(e.viewport),te.copy(e.scissor),ne=e.scissorTest}else F.copy(ue).multiplyScalar(se).floor(),te.copy(I).multiplyScalar(se).floor(),ne=de;if(n!==0&&(r=O),B.bindFramebuffer(L.FRAMEBUFFER,r)&&B.drawBuffers(e,r),B.viewport(F),B.scissor(te),B.setScissorTest(ne),i){let r=V.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=V.get(e.textures[t]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=V.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,t.__webglTexture,n)}N=-1};function Tt(e){let t=V.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ae.textureFormatReadable(e.format),t.__typeReadable=Ae.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){W(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){B.bindFramebuffer(L.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let u=Tt(o);if(u.__formatReadable===!1){W(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){W(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&L.readPixels(t,n,r,i,Ye.convert(c),Ye.convert(l),a)}finally{let e=M===null?null:V.get(M).__webglFramebuffer;B.bindFramebuffer(L.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){B.bindFramebuffer(L.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let d=Tt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.bufferData(L.PIXEL_PACK_BUFFER,a.byteLength,L.STREAM_READ),L.readPixels(t,n,r,i,Ye.convert(l),Ye.convert(u),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);let p=M===null?null:V.get(M).__webglFramebuffer;B.bindFramebuffer(L.FRAMEBUFFER,p);let m=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Gt(L,m,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,a),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(f),L.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;H.setTexture2D(e,0),L.copyTexSubImage2D(L.TEXTURE_2D,n,0,0,o,s,i,a),B.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ye.convert(t.format),_=Ye.convert(t.type),v;t.isData3DTexture?(H.setTexture3D(t,0),v=L.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(H.setTexture2DArray(t,0),v=L.TEXTURE_2D_ARRAY):(H.setTexture2D(t,0),v=L.TEXTURE_2D),B.activeTexture(L.TEXTURE0),B.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,t.flipY),B.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),B.pixelStorei(L.UNPACK_ALIGNMENT,t.unpackAlignment);let y=B.getParameter(L.UNPACK_ROW_LENGTH),b=B.getParameter(L.UNPACK_IMAGE_HEIGHT),x=B.getParameter(L.UNPACK_SKIP_PIXELS),S=B.getParameter(L.UNPACK_SKIP_ROWS),C=B.getParameter(L.UNPACK_SKIP_IMAGES);B.pixelStorei(L.UNPACK_ROW_LENGTH,h.width),B.pixelStorei(L.UNPACK_IMAGE_HEIGHT,h.height),B.pixelStorei(L.UNPACK_SKIP_PIXELS,l),B.pixelStorei(L.UNPACK_SKIP_ROWS,u),B.pixelStorei(L.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=V.get(e),r=V.get(t),h=V.get(n.__renderTarget),g=V.get(r.__renderTarget);B.bindFramebuffer(L.READ_FRAMEBUFFER,h.__webglFramebuffer),B.bindFramebuffer(L.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,V.get(e).__webglTexture,i,d+n),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,V.get(t).__webglTexture,a,m+n)),L.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,L.DEPTH_BUFFER_BIT,L.NEAREST);B.bindFramebuffer(L.READ_FRAMEBUFFER,null),B.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||V.has(e)){let n=V.get(e),r=V.get(t);B.bindFramebuffer(L.READ_FRAMEBUFFER,k),B.bindFramebuffer(L.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,n.__webglTexture,i),T?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,r.__webglTexture,a),i===0?T?L.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):L.copyTexSubImage2D(v,a,f,p,l,u,o,s):L.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,L.COLOR_BUFFER_BIT,L.NEAREST);B.bindFramebuffer(L.READ_FRAMEBUFFER,null),B.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?L.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h);B.pixelStorei(L.UNPACK_ROW_LENGTH,y),B.pixelStorei(L.UNPACK_IMAGE_HEIGHT,b),B.pixelStorei(L.UNPACK_SKIP_PIXELS,x),B.pixelStorei(L.UNPACK_SKIP_ROWS,S),B.pixelStorei(L.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps===!0&&t.mipmapsAutoUpdate===!0&&L.generateMipmap(v),B.unbindTexture()},this.initRenderTarget=function(e){V.get(e).__webglFramebuffer===void 0&&H.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?H.setTextureCube(e,0):e.isData3DTexture?H.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?H.setTexture2DArray(e,0):H.setTexture2D(e,0),B.unbindTexture()},this.resetState=function(){j=0,ee=0,M=null,B.reset(),Xe.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return It}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=mn._getDrawingBufferColorSpace(e),t.unpackColorSpace=mn._getUnpackColorSpace()}},Ql=1.7,$l=2.3,eu=new Map;function tu(t){let n=(t.id||``)+`:`+t.n+`:`+t.length.toFixed(3),i=eu.get(n);if(i)return i;let a=t.n,o=t.px,s=t.pz,c=t.nx,l=t.nz,u=t.ds,d=new Float64Array(a),f=new Float64Array(a),p=new Float64Array(a),m=new Float64Array(a);for(let e=0;e<a;e++)d[e]=Math.max(.5,t.half[e]-(t.squeeze[e]?$l:Ql)),p[e]=o[e],m[e]=s[e];for(let t=0;t<2400;t++)for(let t=0;t<a;t++){let n=(t+a-1)%a,r=(t+1)%a,i=(t+a-2)%a,u=(t+2)%a,h=(4*(p[n]+p[r])-(p[i]+p[u]))/6-o[t],g=(4*(m[n]+m[r])-(m[i]+m[u]))/6-s[t],_=h*c[t]+g*l[t],v=e(f[t]+1.7*(_-f[t]),-d[t],d[t]);f[t]=v,p[t]=o[t]+c[t]*v,m[t]=s[t]+l[t]*v}let h=new Float64Array(a),g=new Float64Array(a),_=new Float32Array(a);for(let e=0;e<a;e++){let t=(e+1)%a,n=p[t]-p[e],r=m[t]-m[e];h[e]=Math.atan2(n,r),g[e]=Math.hypot(n,r)||u}for(let e=0;e<a;e++){let t=(e+a-1)%a;_[e]=r(h[e]-h[t])/((g[e]+g[t])/2)}let v=nu(_,2),y={d:Float32Array.from(f),kappa:v,x:Float32Array.from(p),z:Float32Array.from(m)};return eu.set(n,y),y}function nu(e,t){let n=e.length,r=new Float32Array(n);for(let i=0;i<n;i++){let a=0;for(let r=-t;r<=t;r++)a+=e[(i+r+n)%n];r[i]=a/(2*t+1)}return r}var ru=.88,iu=.85,au=.8,ou=new Map;function su(t,n){let r=(t.id||``)+`:`+n.id+`:`+t.n+`:`+t.length.toFixed(3),i=ou.get(r);if(i)return i;let a=t.n,o=tu(t).kappa,s=new Float32Array(a),c=new Float32Array(a);for(let e=0;e<a;e++){let r=0;for(let t=-3;t<=3;t++)r=Math.max(r,Math.abs(o[(e+t+a)%a]));let i=28*Math.sqrt(Math.max(.04,.9*n.steer/Math.max(r,1e-4)-1));s[e]=Math.min(n.vTop*1.05,i,m(n,r,t.squeeze[e]?iu:ru)),c[e]=s[e]}for(let r=0;r<2*a;r++){let i=a-1-r%a,s=(i+1)%a,l=c[s],u=t.squeeze[s]?iu:ru,d=p(n,l,u),f=e(l*l*Math.abs(o[s])/Math.max(d,1),0,1),m=Math.max(g,Math.sqrt(1-f*f)),h=Math.min(v(n,l,u)*au,_(n,l,u)*.9*m),y=Math.sqrt(l*l+2*h*t.ds);y<c[i]&&(c[i]=y)}let l={v:c,corner:s};return ou.set(r,l),l}var cu={RED:.5,YELLOW:.12,MIN_YELLOW:2,BLEND:.35,MIN_DIST:4},lu=[.2,.95,.32],uu=[1,.84,.08],du=[1,.14,.1];function fu(e,t,n){return e<=t?0:(e*e-t*t)/(2*Math.max(n,cu.MIN_DIST))}function pu(e,t){return e>=cu.RED*t?2:+(e>=Math.max(cu.MIN_YELLOW,cu.YELLOW*t))}function mu(e,t,n,r=0){let i=Math.max(cu.MIN_YELLOW,cu.YELLOW*t),a=cu.RED*t,o=cu.BLEND,s=lu,c=lu,l=0;return e>=a?s=c=du:e>=a*(1-o*.5)?(s=uu,c=du,l=(e-a*(1-o*.5))/(a*o*.5)):e>=i?s=c=uu:e>=i*(1-o)&&(s=lu,c=uu,l=(e-i*(1-o))/(i*o)),n[r]=s[0]+(c[0]-s[0])*l,n[r+1]=s[1]+(c[1]-s[1])*l,n[r+2]=s[2]+(c[2]-s[2])*l,pu(e,t)}var hu=.75,gu=.07,_u=e=>Math.ceil(148/e.ds)+1;function vu(e,t,n,r,i,a,o,s=_u(e)){let c=e.n,l=e.ds,u=tu(e),d=su(e,t).v,f=Math.sqrt(Math.max(.25,i)),p=v(t,Math.max(r,8),Math.min(1,i)),m=Math.floor((n-8)/l),h=yu;for(let t=0;t<s;t++){let i=((m+t)%c+c)%c,s=(m+t)*l-n,g=d[i]*f;mu(s<0?0:fu(r,g,s),p,h);let _=u.d[i]+hu,v=u.d[i]-hu,y=e.py[i]+gu,b=t*6,x=t*8;a[b]=e.px[i]+e.nx[i]*_,a[b+1]=y,a[b+2]=e.pz[i]+e.nz[i]*_,a[b+3]=e.px[i]+e.nx[i]*v,a[b+4]=y,a[b+5]=e.pz[i]+e.nz[i]*v;let S=Math.min(1,Math.max(0,(s+8)/6))*Math.min(1,Math.max(0,(140-s)/30));o[x]=o[x+4]=h[0],o[x+1]=o[x+5]=h[1],o[x+2]=o[x+6]=h[2],o[x+3]=o[x+7]=.9*S}return s}var yu=[0,0,0];function bu(e,t){return e===`hard`?!1:t==null||!!t}var xu=[[0,0,0,9,15],[130,0,0,9,15],[260,0,0,9,15],[330,0,8,8.5,15],[385,1,50,8,15],[400,3,115,8,15],[397,8,170,7.5,15],[404,15,225,7.5,15],[394,22,280,7.5,15],[403,28,335,7.5,15],[396,32,385,7.5,15],[386,33,448,8,15],[326,33,474,8,15],[240,32,434,7,14],[190,26,407,7,14],[150,17,430,7,14],[105,9,405,7,14],[62,3,396,7.5,14],[20,1,376,7.5,12],[-25,0,345,6,1.3],[-45,0,300,6,1.3],[-95,0,285,6,1.3],[-110,0,240,6,1.3],[-165,0,225,6,1.3],[-180,0,180,6,1.3],[-235,0,165,6.5,2],[-290,0,120,8,15],[-340,0,70,9,15],[-310,0,12,9,15],[-250,0,0,9,15],[-130,0,0,9,15]],Su={id:`citadel`,name:`Citadel Circuit`,blurb:`Stone walls, a blind plunge and the tight squeeze.`,theme:`circuitDay`,seed:7,points:xu,sections:[{name:`Ironside Straight`,a:28.6,b:xu.length+2.4,kind:`straight`},{name:`Anvil Bend`,a:2.4,b:5.4},{name:`Thunder Climb`,a:5.4,b:10.6},{name:`Crown Hairpin`,a:10.6,b:12.8},{name:`The Plunge`,a:12.8,b:18.6},{name:`Citadel Squeeze`,a:18.6,b:25.6},{name:`Moat Sweep`,a:25.6,b:28.6}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},Cu=2.5,wu=[0,0,.5],Tu=class{constructor(e=Su){let a=e.points,o=a.length,s=e.sections;this.def=e,this.id=e.id,this.name=e.name,this.themeId=e.theme,this.seed=e.seed??1;let c=this.pit={boxStart:-60,boxStep:16,...e.pit,limit:e.pit.speed},l=new ba(a.map(e=>new G(e[0],e[1],e[2])),!0,`centripetal`),u=[];for(let e=0;e<o*80;e++){let t=e/(o*80),n=l.getPoint(t);u.push({x:n.x,y:n.y,z:n.z,f:t*o})}let d=[0];for(let e=1;e<=u.length;e++){let t=u[e-1],n=u[e%u.length];d.push(d[e-1]+Math.hypot(n.x-t.x,n.z-t.z))}let f=d[u.length],p=Math.max(16,Math.round(f/Cu/16)*16);this.n=p,this.length=f,this.ds=f/p;let m=this.px=new Float32Array(p),h=this.py=new Float32Array(p),g=this.pz=new Float32Array(p),_=new Float32Array(p),v=0;for(let e=0;e<p;e++){let n=e*this.ds;for(;d[v+1]<n;)v++;let r=(n-d[v])/(d[v+1]-d[v]),i=u[v],a=u[(v+1)%u.length];m[e]=t(i.x,a.x,r),h[e]=t(i.y,a.y,r),g[e]=t(i.z,a.z,r);let s=a.f;s<i.f&&(s+=o),_[e]=t(i.f,s,r)%o}let y=this.tx=new Float32Array(p),b=this.tz=new Float32Array(p),x=this.nx=new Float32Array(p),S=this.nz=new Float32Array(p),C=this.theta=new Float32Array(p);for(let e=0;e<p;e++){let t=(e+p-1)%p,n=(e+1)%p,r=m[n]-m[t],i=g[n]-g[t],a=Math.hypot(r,i);r/=a,i/=a,y[e]=r,b[e]=i,x[e]=i,S[e]=-r,C[e]=Math.atan2(r,i)}let w=new Float32Array(p);for(let e=0;e<p;e++)w[e]=r(C[(e+1)%p]-C[(e+p-1)%p])/(2*this.ds);this.kappa=w,this.kappaS=this._smooth(w,10),this.kappaN=this._smooth(w,3),this.half=new Float32Array(p),this.runoff=new Float32Array(p),this.section=new Uint8Array(p),this.squeeze=new Uint8Array(p);for(let e=0;e<p;e++){let r=_[e],i=Math.floor(r)%o,c=(i+1)%o,l=n(0,1,r-Math.floor(r));this.half[e]=t(a[i][3],a[c][3],l),this.runoff[e]=t(a[i][4],a[c][4],l),this.squeeze[e]=+(this.runoff[e]<5);let u=0;for(let e=0;e<s.length;e++){let t=s[e],n=t.b>o&&r<t.a?r+o:r;if(n>=t.a&&n<t.b){u=e;break}}this.section[e]=u}this.sections=s.map(e=>e.name),this.leftWall=new Float32Array(p),this.rightWall=new Float32Array(p),this.pitTaper=new Float32Array(p),this._computeRunoff();for(let e=0;e<p;e++){let r=i(e*this.ds,this.length),a=n(c.entry,c.laneStart,r)*(1-n(c.laneEnd,c.exit,r));this.pitTaper[e]=a,this.rightWall[e]=this.half[e]+this.runR[e],this.leftWall[e]=t(this.half[e]+this.runL[e],this.half[e]+19,a)}this.kerb=new Uint8Array(p),this.gravel=new Uint8Array(p);for(let e=0;e<p;e++){let t=!this.squeeze[e];this.kerb[e]=t&&Math.abs(this.kappaS[e])>.0035?1:0,this.gravel[e]=this.kerb[e]}this._computeLine(),this._loc={i:0,s:0,d:0}}_computeRunoff(){let t=this.n,n=2.2,r=.8,i=this._smooth(this.kappa,2),a=new Float32Array(t).fill(1e4),o=new Float32Array(t).fill(1e4);for(let e=0;e<t;e++)i[e]>1e-4?a[e]=1/i[e]:i[e]<-1e-4&&(o[e]=-1/i[e]);let s=e=>{let n=new Float32Array(t);for(let r=0;r<t;r++){let i=1e4;for(let n=-9;n<=9;n++)i=Math.min(i,e[(r+n+t)%t]);n[r]=i}return n},c=s(a),l=s(o),u=new Float32Array(t),d=new Float32Array(t);for(let i=0;i<t;i++)u[i]=e(Math.min(this.runoff[i],c[i]-n-this.half[i]),r,this.runoff[i]),d[i]=e(Math.min(this.runoff[i],l[i]-n-this.half[i]),r,this.runoff[i]);this.runL=this._smooth(u,5),this.runR=this._smooth(d,5);for(let e=0;e<t;e++)this.runL[e]=Math.min(this.runL[e],this.runoff[e]),this.runR[e]=Math.min(this.runR[e],this.runoff[e])}runAt(e,t){return t>=0?this.runL[e]:this.runR[e]}_smooth(e,t){let n=this.n,r=new Float32Array(n);for(let i=0;i<n;i++){let a=0;for(let r=-t;r<=t;r++)a+=e[(i+r+n)%n];r[i]=a/(2*t+1)}return r}_computeLine(){let e=tu(this);this.line=e.d,this.lineK=e.kappa}sectionName(e){return this.sections[this.section[e]]}locate(e,t,n,r=this._loc,i=40){let a=this.n,o=this.px,s=this.pz,c=0xde0b6b3a7640000,l=n,u=i<0?0:-i,d=i<0?a-1:i;for(let r=u;r<=d;r++){let i=(n+r+a)%a,u=e-o[i],d=t-s[i],f=u*u+d*d;f<c&&(c=f,l=i)}let f=e-o[l],p=t-s[l];return r.i=l,r.s=((l*this.ds+f*this.tx[l]+p*this.tz[l])%this.length+this.length)%this.length,r.d=f*this.nx[l]+p*this.nz[l],r}locateGlobal(e,t,n=this._loc){return this.locate(e,t,0,n,-1)}_idx(e){e=(e%this.length+this.length)%this.length;let t=e/this.ds,n=Math.floor(t)%this.n;return wu[0]=n,wu[1]=(n+1)%this.n,wu[2]=t-Math.floor(t),wu}_lerpAt(e,n){let r=this._idx(n);return t(e[r[0]],e[r[1]],r[2])}yAt(e){return this._lerpAt(this.py,e)}bankAt(e){return 0}slopeAt(e){return(this.yAt(e+3)-this.yAt(e-3))/6}halfAt(e){return this._lerpAt(this.half,e)}thetaAt(e){let t=this._idx(e),n=t[0],i=t[1],a=t[2];return this.theta[n]+r(this.theta[i]-this.theta[n])*a}lineAt(e){return this._lerpAt(this.line,e)}lineKappaAt(e){return this._lerpAt(this.lineK,e)}kappaAt(e){return this._lerpAt(this.kappa,e)}at(e,n=0,r=new G){let i=this._idx(e),a=i[0],o=i[1],s=i[2],c=t(this.nx[a],this.nx[o],s),l=t(this.nz[a],this.nz[o],s),u=Math.hypot(c,l)||1;return r.set(t(this.px[a],this.px[o],s)+c/u*n,t(this.py[a],this.py[o],s),t(this.pz[a],this.pz[o],s)+l/u*n),r}surfaceAt(e,t){let n=Math.abs(t),r=this.half[e],i=this.pitTaper[e];return t>0&&i>.02&&n<=r+16*i?n<=r?`asphalt`:`pit`:n<=r||this.squeeze[e]&&n<=r+this.runAt(e,t)+.05?`asphalt`:this.kerb[e]&&n<=r+1.4?`kerb`:this.gravel[e]&&n<=r+this.runAt(e,t)+.5?`gravel`:`grass`}clearance(e,t){let n=this.n,r=1e9;for(let i=0;i<n;i++){let n=e-this.px[i],a=t-this.pz[i],o=n*this.nx[i]+a*this.nz[i]>=0?this.leftWall[i]:this.rightWall[i],s=Math.hypot(n,a)-o;s<r&&(r=s)}return r}laneD(e){return this.half[e]+4.5}boxD(e){return this.half[e]+11.5}boxU(e){return this.pit.boxStart+e*this.pit.boxStep}},Eu=[[0,0,0,9.5,16],[130,0,0,9.5,16],[260,0,0,9.5,16],[345,0,12,8.5,15],[398,.5,50,8.5,15],[415,2,115,8,15],[410,7,190,8,15],[440,14,255,7.5,15],[432,22,325,7.5,15],[395,28,385,7.5,15],[330,31,425,8,15],[250,31,418,8,15],[170,30,430,8,15],[112,29,420,8,14],[95,28,380,8,14],[135,26,345,8,14],[200,21,340,7.5,14],[265,15,315,7.5,14],[300,11,270,7.5,14],[265,7,225,7.5,14],[275,4,175,7.5,14],[240,2,125,8,15],[170,1,100,8.5,15],[60,0,108,9,15],[-60,0,112,9,15],[-170,0,112,9,15],[-255,0,112,8.5,15],[-330,0,72,8.5,15],[-300,0,14,9,15],[-250,0,0,9.5,16],[-130,0,0,9.5,16]],Du={id:`desert`,name:`Sandglass Circuit`,blurb:`Night race across the dunes: a mesa climb and three hairpins.`,theme:`desertNight`,seed:31,points:Eu,sections:[{name:`Sidewinder Straight`,a:28.9,b:Eu.length+2.6,kind:`straight`},{name:`Cairn Turn`,a:2.6,b:5.2},{name:`Dune Rise`,a:5.2,b:9.4},{name:`Kiln Run`,a:9.4,b:12.6},{name:`Mesa Hairpin`,a:12.6,b:15.4},{name:`Scorpion Esses`,a:15.4,b:20.6},{name:`Oasis Sweep`,a:20.6,b:23},{name:`Mirage Run`,a:23,b:25.6,kind:`straight`},{name:`Sandglass Hairpin`,a:25.6,b:28.9}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},Ou=[[0,2,0,9.5,16],[130,2,0,9.5,16],[260,2,0,9.5,16],[335,2,6,8.5,15],[392,3,38,8.5,15],[425,5,92,8,15],[438,11,143,8,15],[429,19,194,8,15],[442,28,244,8,15],[438,36,294,8,15],[395,40,338,8,14],[320,41,356,8,14],[245,41,352,8,14],[200,41,355,8.5,13],[148,41,386,8.5,13],[178,40,428,8.5,13],[245,38,434,8,13],[305,34,453,7.5,13],[350,28,496,7.5,13],[300,22,536,7.5,13],[225,17,532,7.5,13],[150,11,518,7,8],[95,7,545,7,8],[38,5,516,7.5,12],[-60,3,519,8.5,15],[-150,2,525,8.5,15],[-250,2,525,8.5,15],[-330,4,489,8.5,15],[-345,8,431,8,15],[-326,11,374,8,15],[-342,9,316,8,15],[-331,6,258,8,15],[-343,4,201,8,15],[-330,3,136,8.5,15],[-310,2,70,9,15],[-285,2,15,9.5,16],[-250,2,0,9.5,16],[-130,2,0,9.5,16]],ku=[Su,Du,{id:`coastal`,name:`Saltspray Coast`,blurb:`Sea-cliff circuit in daylight: beach straight, a 40 m climb and harbour esses.`,theme:`coastal`,seed:53,points:Ou,sections:[{name:`Breaker Straight`,a:34.2,b:Ou.length+2.6,kind:`straight`},{name:`Gull Bend`,a:2.6,b:5.8},{name:`Cliffhanger Climb`,a:5.8,b:9.8},{name:`Lantern Run`,a:9.8,b:13},{name:`Lantern Hairpin`,a:13,b:16.6},{name:`Tidewall Esses`,a:16.6,b:20.4},{name:`Kelp Chicane`,a:20.4,b:23.6},{name:`Harbour Run`,a:23.6,b:26.4,kind:`straight`},{name:`Reef Curve`,a:26.4,b:33.2},{name:`Breaker Corner`,a:33.2,b:34.2}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}}],Au=ku.map(e=>e.id),ju=Su.id;function Mu(e){return ku.find(t=>t.id===e)||Su}function Nu(e,t=!0){if(!isFinite(e)||e==null)return`--:--.---`;let n=Math.floor(e/60);return`${n}:${(e-n*60).toFixed(t?3:1).padStart(t?6:4,`0`)}`}function Pu(e){return e==null||!isFinite(e)?``:(e<=0?`-`:`+`)+Math.abs(e).toFixed(3)}function Fu(e,t=3,n={}){return{L:e,n:t,seg:e/t,g:-1,prevProg:null,prevTime:0,lapStart:0,sectorStart:0,lapNo:0,cur:[],last:null,bestLap:n.bestLap??1/0,bestSectors:n.bestSectors?n.bestSectors.slice():Array(t).fill(1/0),refSectors:n.refSectors?n.refSectors.slice():[],laps:[]}}function Iu(e,t,n){let r=e.bestSectors[t],i=e.refSectors[t];return n>=r?i!==void 0&&n<i?`green`:`slow`:`purple`}function Lu(e,t,n){let r=[];if(e.prevProg===null)return e.prevProg=t,e.prevTime=n,e.g=Math.floor(t/e.seg),r;let i=Math.floor(t/e.seg);for(;e.g<i;){let i=++e.g,a=i*e.seg,o=t-e.prevProg,s=o>1e-9?(a-e.prevProg)/o:1,c=e.prevTime+Math.min(1,Math.max(0,s))*(n-e.prevTime);if(i===0){e.lapStart=e.sectorStart=c,e.cur=[],e.lapNo=0,r.push({type:`start`,time:c});continue}if(i<0)continue;let l=(i-1)%e.n,u=c-e.sectorStart;e.sectorStart=c;let d=e.refSectors[l],f=Iu(e,l,u);if(u<e.bestSectors[l]&&(e.bestSectors[l]=u),e.cur.push(u),r.push({type:`sector`,sector:l,time:u,delta:d===void 0?null:u-d,status:f,lap:Math.floor((i-1)/e.n)}),i%e.n===0){let t=c-e.lapStart,n=e.cur.slice(),i=t<e.bestLap,a=isFinite(e.bestLap)?t-e.bestLap:null;i&&(e.bestLap=t,e.refSectors=n.slice()),e.last={time:t,sectors:n,delta:a,isBest:i},e.laps.push(t),e.lapStart=c,e.cur=[],e.lapNo++,r.push({type:`lap`,lap:e.lapNo,time:t,sectors:n,delta:a,isBest:i})}}return e.prevProg=t,e.prevTime=n,r}function Ru(e,t){return e.g>=0?Math.max(0,t-e.lapStart):0}function zu(e){return e.g>=0?e.g%e.n:0}function Bu(e=10){return{hz:e,dt:1/e,next:0,samples:[]}}function Vu(e,t,n,r,i){for(;t>=e.next;)e.samples.push([Math.round(n*10)/10,Math.round(r*10)/10,Math.round(i*100)/100]),e.next+=e.dt}function Hu(e){e.next=0,e.samples=[]}function Uu(e,t){return{hz:e.hz,time:t,samples:e.samples.slice()}}function Wu(e,t,n={}){if(!e||t<0)return null;let r=t*e.hz,i=Math.floor(r);if(i>=e.samples.length-1)return null;let a=e.samples[i],o=e.samples[i+1],s=r-i;n.x=a[0]+(o[0]-a[0])*s,n.z=a[1]+(o[1]-a[1])*s;let c=o[2]-a[2];for(;c>Math.PI;)c-=2*Math.PI;for(;c<-Math.PI;)c+=2*Math.PI;return n.theta=a[2]+c*s,n}var Gu=`drive-save-v1`,Ku=`drive-ghost-v1`,qu={easy:{id:`easy`,name:`Easy`,skill:.89,spread:.04,mistakes:1.6,aggression:.35,goalPos:3,assist:1,guide:!0},normal:{id:`normal`,name:`Normal`,skill:.955,spread:.035,mistakes:1,aggression:.65,goalPos:3,assist:0,guide:!0},hard:{id:`hard`,name:`Hard`,skill:.99,spread:.025,mistakes:.5,aggression:1,goalPos:2,assist:0,guide:!1}},Ju={speedway:{name:`Speedway`,requires:`gp`,podium:3}};function Yu(){return{v:1,unlocked:{gp:!0},bests:{},podiums:0,races:0}}function Xu(e){let t=Yu();try{let n=e?.getItem(Gu);if(!n)return t;let r=JSON.parse(n);return!r||typeof r!=`object`?t:{...t,...r,unlocked:{...t.unlocked,...r.unlocked||{}},bests:{...r.bests||{}}}}catch{return t}}function Zu(e,t){try{return e?.setItem(Gu,JSON.stringify(t)),!0}catch{return!1}}function Qu(e,t){return!Ju[t]||!!e.unlocked[t]}function $u(e){let t=Ju[e];return t?`${t.name.toUpperCase()} LOCKED - finish on the podium (top ${t.podium}) in a ${t.requires.toUpperCase()} race to unlock`:``}var ed=(e,t)=>e.bests[t]||null;function td(e,t,n){let r=e.bests[t]||{bestLap:1/0,bestSectors:[],refSectors:[]},i=!1;return n.time<r.bestLap&&(r.bestLap=n.time,r.refSectors=n.sectors.slice(),i=!0),n.sectors.forEach((e,t)=>{let n=r.bestSectors[t];(n==null||e<n)&&(r.bestSectors[t]=e)}),e.bests[t]=r,i}function nd(e,t){let n=ed(e,t);return!n||!isFinite(n.bestLap??NaN)?{}:{bestLap:n.bestLap,bestSectors:n.bestSectors.map(e=>e??1/0),refSectors:n.refSectors}}function rd({mode:e,difficulty:t=`normal`,cls:n=`gp`},r){if(e===`tt`){let e=ed(r,n);return e&&isFinite(e.bestLap??NaN)?{kind:`lap`,target:e.bestLap,text:`Beat your best lap: ${Nu(e.bestLap)}`}:{kind:`lap`,target:1/0,text:`Set a lap time, then beat it`}}let i=(qu[t]||qu.normal).goalPos;return{kind:`pos`,target:i,text:i===1?`Win the race`:`Finish top ${i}`}}function id(e,t){if(e.kind===`pos`){let n=t.pos!=null&&t.pos<=e.target;return{met:n,text:n?`GOAL MET - P${t.pos}`:`GOAL MISSED - P${t.pos} (needed top ${e.target})`}}let n=t.bestLap;if(!isFinite(n??NaN))return{met:!1,text:`GOAL MISSED - no lap completed`};let r=n<e.target;return{met:r,text:r?`GOAL MET - ${Nu(n)}`:`GOAL MISSED - ${Nu(n)} vs ${Nu(e.target)}`}}function ad(e,{mode:t,cls:n,pos:r}){let i={unlocked:[],messages:[]};if(t!==`race`)return i;e.races=(e.races||0)+1;for(let[t,a]of Object.entries(Ju))e.unlocked[t]||n===a.requires&&r!=null&&r<=a.podium&&(e.unlocked[t]=!0,i.unlocked.push(t),i.messages.push(`${a.name.toUpperCase()} CLASS UNLOCKED!`));if(n===`gp`&&r!=null&&r<=3&&(e.podiums=(e.podiums||0)+1),!i.unlocked.length)for(let[t,n]of Object.entries(Ju))e.unlocked[t]||i.messages.push($u(t));return i}var od=[{name:`Ember Works`,tag:`EMB`,c1:15222570,c2:16765514},{name:`Tidewater Speed`,tag:`TDW`,c1:1937361,c2:16777215},{name:`Quartz Engineering`,tag:`QRZ`,c1:11036912,c2:2763328},{name:`Halcyon Motorsport`,tag:`HLC`,c1:15909424,c2:2236962},{name:`Nimbus Racing`,tag:`NMB`,c1:15263984,c2:3368652},{name:`Copperhead Works`,tag:`CPR`,c1:13201966,c2:1776411},{name:`Zephyr Dynamics`,tag:`ZPH`,c1:3720330,c2:15790320},{name:`Obsidian Racing`,tag:`OBS`,c1:2763318,c2:15747724},{name:`Lumen Speed Co.`,tag:`LMN`,c1:15755936,c2:16773792},{name:`Verdant Works`,tag:`VRD`,c1:3050301,c2:12576842}];function sd(e,t){return su(e,t).v}function cd(e,t,n){return e._lerpAt(t,n)}function ld(e,t,n,i,a,o){let s=t.s+a;e.at(s,i,o);let c=o.x-t.x,l=o.z-t.z,u=r(Math.atan2(c,l)-t.theta),d=2*Math.sin(u)/Math.max(Math.hypot(c,l),1),f=Math.max(Math.abs(C(n,1,Math.max(t.v,3),t.grip||1)),1e-4);return-d/f}function ud(t,n,r,i,a,o){return e(ld(t,n,r,i,a,o),-1,1)}function dd(t,n,r,i,a){let o=t.cls,s=v(o,Math.max(t.v,10),Math.min(1,t.grip||1)),c=cd(n,r,t.s+t.v*.25),l=cd(n,r,t.s+t.v*.25+15),u=Math.max(0,(c*c-l*l)/30)*t.skill,d=Math.max(0,t.v-i);return e(Math.max(a*.6,u/s*1.1+d/9),.2,.9)}function fd(t,n,r){let i=n-t.v;i>.5?(r.throttle=e(i/3,.35,1),r.brake=0):i<-1.5?(r.throttle=0,r.brake=e(-i/8,.25,1)):(r.throttle=e(.35+i*.2,0,.5),r.brake=0)}var pd=e=>e>=0?1:-1;function md(e,t,n){let r=t.track.length;n.ahead=null,n.behind=null,n.aGap=99,n.bGap=99;let a=t.cars;for(let t=0;t<a.length;t++){let o=a[t];if(o===e||o.pit.stage)continue;let s=i(o.s-e.s,r);s>0&&s<n.aGap&&s<40?(n.aGap=s,n.ahead=o):s<=0&&-s<n.bGap&&-s<28&&(n.bGap=-s,n.behind=o)}return n}var hd={ahead:null,behind:null,aGap:99,bGap:99};function gd(t,n,r,i){let a=n.track,o=t.cls,s=t.input,c=n.diff,l=t.ai,u=n.profiles[o.id];t.noiseT+=r,l.t-=r,l.defendT-=r;let d=Math.sin(t.noiseT*.35+t.noisePhase)*1.2+Math.sin(t.noiseT*.9+t.noisePhase*2)*.5,f=Math.max(Math.abs(a.lineKappaAt(t.s+4)),Math.abs(a.lineKappaAt(t.s+4+t.v*.35))),p=e(4.5+.3*t.v-1500*Math.max(0,f-.004),4.5,32),m=a.halfAt(t.s+p),h=Math.abs(a.kappaS[a._idx(t.s+p*2.5)[0]]),g=h<.003,_=!a.squeeze[t.idx],v=_?1:.25,y=1-e((f-.002)/.006,0,.7),b=a.lineAt(t.s+p),x=b+(t.lineBias+d*t.wander)*v*y;md(t,n,hd);let{ahead:S,behind:C}=hd,w=!1,T=!1;if(S&&!S.finished&&hd.aGap<28&&Math.abs(S.d-t.d)<4.5&&t.progress>0){if(l.t<=0&&l.mode!==`pass`){l.t=.8;let e=m-2;l.side=e-S.d>e+S.d?1:-1,Math.abs(S.d-t.d)>1.2&&(l.side=pd(t.d-S.d)),l.fight=n.rng()<.25+.75*c.aggression}l.fight&&(w=!0,hd.aGap>12||!_?g&&(x=S.d):(T=!0,l.mode=`pass`,l.passT=1.6,x=S.d+l.side*3.4))}l.mode===`pass`&&!T&&(l.passT-=r,l.passT>0&&S&&hd.aGap<18?(T=!0,x=S.d+l.side*3.4):l.mode=`free`),C&&!C.finished&&hd.bGap<14&&Math.abs(C.d-t.d)<5&&g&&!T?(l.defendT<-4&&n.rng()<.02+.06*c.aggression&&(l.defendT=1.3),l.defendT>0&&(x=t.d+e(C.d-t.d,-3,3),l.defending=!0)):l.defending=!1;let E=0;!T&&!l.defending&&S&&hd.aGap<22&&Math.abs(S.d-t.d)<2.8&&!(w&&g)&&(E=(S.d>=t.d?-1:1)*(_?3:1.2)*(1-hd.aGap/24),Math.abs(S.d-t.d)<.3&&(E=(a.lineAt(t.s)>0?-1:1)*(_?3:1.4))),t.avoid+=(E-t.avoid)*Math.min(1,r*2.5),x+=t.avoid,l.mistakeIn-=r/Math.max(.3,c.mistakes);let D=cd(a,u,t.s+70);if(l.mistake)l.mistake.t-=r,l.mistake.t<=0&&(l.mistake=null,l.mistakeIn=25+n.rng()*45);else if(l.mistakeIn<=0&&_&&t.progress>100&&!t.finished&&D<t.v-12&&!t.pit.stage){let e=n.rng();l.mistake=e<.5?{type:`late`,t:1.2}:e<.8?{type:`wide`,t:2.2}:{type:`lock`,t:.9},l.mistake.out=-pd(a.kappaS[a._idx(t.s+40)[0]])}let O=Math.min(cd(a,u,t.s+35),cd(a,u,t.s+80))*t.skill,k=Math.max(e((t.v-O-3)/14,0,1),e((f-.003)/.004,0,1));x=b+(x-b)*(1-.85*k),l.mistake?.type===`wide`&&(x+=l.mistake.out*2);let A=Math.max(m-(_?2:2.4)-.012*t.v,1.2);x=e(x,-A,A);let j=ld(a,t,o,x,p,i);s.steer=e(j,-1,1);let ee=e((Math.abs(j)-.85)/.6,0,1),M=Math.min(1,Math.sqrt(Math.max(.25,t.grip||1))),N=t.skill,P=cd(a,u,t.s+t.v*.25)*N*M;P*=1-.12*ee,P*=1-.4*e((Math.abs(t.d-a.lineAt(t.s))-1.5)/6,0,1)*e((f-.002)/.004,0,1),(t.surface===`grass`||t.surface===`gravel`)&&(P=Math.min(P,28)),T&&hd.aGap<14&&(P*=1.04),l.mistake?.type===`late`&&(P*=1.1),S&&!T&&hd.aGap<14&&Math.abs(S.d-t.d)<2.4&&(P=Math.min(P,Math.max(S.v+e((hd.aGap-6)*.8,-1.5,8),P*.6)));let F=n.order?.[0],te=n.order?.[1];F&&t.progress>0&&!t.finished&&(t===F?te&&(P*=1-.02*e((t.progress-te.progress-60)/150,0,1)):P*=1+.04*e((F.progress-t.progress-40)/180,0,1)),S&&hd.aGap<25&&g&&!T&&(P*=1+.012*(1-hd.aGap/25)*(.5+.5*c.aggression)),t.finished&&(P=Math.min(P,38)),fd(t,P,s),s.brake>0&&(s.brake=dd(t,a,u,P,s.brake)),l.forceLock=l.mistake?.type===`lock`&&t.v>35&&s.brake>0,l.forceLock&&(s.brake=1);let ne=S&&hd.aGap<25&&g;s.boost=t.boost>(ne?.15:.55)&&h<.0025&&t.v>40&&!t.finished}var _d=new G,vd=9.81,yd={k:0,excess:0},bd={tire:`dry`,wear:0,wetness:0,surface:`asphalt`},xd={fill:0,boosting:!1,dt:0},Sd=class{constructor(t,n={}){if(this.track=t,this.opts=n,this.rng=typeof n.rng==`function`?n.rng:Math.random,this.cls=a[n.cls]||a.gp,this.mode=n.mode===`tt`?`tt`:`race`,this.solo=this.mode===`tt`,this.diff=qu[n.difficulty]||qu.normal,this.laps=this.solo?1/0:e(n.laps||3,1,9),this.phase=`countdown`,this.timer=this.solo?1.6:0,this.time=0,this.goHold=this.solo?0:.2+this.rng()*1,this.lights=0,this.goFlash=0,this.rain=0,this.rainTarget=0,this.wetness=0,this.rainAt=n.weather===`rain`?.5:n.weather===`dry`||this.solo?1/0:n.rainAt??(this.rng()<.8?this.laps*42*(.3+this.rng()*.3):1/0),this.rainAnnounced=!1,this.events=[],this.profiles={[this.cls.id]:sd(t,this.cls)},this.cars=[],this.playerSlot=n.playerSlot??(this.solo?0:6),Array.isArray(n.grid)){let e=n.grid.findIndex(e=>e.isPlayer);e>=0&&(this.playerSlot=e)}this._createCars(),this.player=this.cars.find(e=>e.isPlayer),this.autopilot=!1,this.lapTimer=Fu(t.length,3,n.best||{}),this.ghostRec=Bu(10),this.order=this.cars.slice(),this.rank()}_blankCar(e,t,n,r,i,a={}){let s=this.track,c=s.length,l=this.rng,u=Math.floor(e/2),d=e%2,f=c-10-u*9-d*4.5,p=d?-3.2:3.2,m=s.at(f,p),h=s.thetaAt(f),g={id:e,slot:e,team:t,teamIndex:n,isPlayer:r,cls:a.cls||this.cls,driver:a.driver||null,driverId:a.driverId||null,x:m.x,z:m.z,y:m.y,theta:h,v:0,steer:0,s:f,d:0,idx:s.locateGlobal(m.x,m.z).i,lap:o(c,f),progress:-10,laps:0,finished:!1,finishTime:0,tire:`dry`,wear:0,wetness:0,grip:1,surface:`asphalt`,boost:0,boosting:!1,slip:0,input:{steer:0,throttle:0,brake:0,boost:!1},skill:i,lineBias:(l()-.5)*3.2,wander:.4+l()*.8,noiseT:l()*50,noisePhase:l()*6.28,avoid:0,lapStart:0,lapTimes:[],bestLap:1/0,hit:0,pitStops:0,brk:0,lockup:0,flat:0,wheelSlip:0,wheelspin:0,longAcc:0,latFrac:0,ai:{forceLock:!1,mode:`free`,side:0,t:0,mistake:null,mistakeIn:8+l()*30,defendT:0},pit:{stage:0,request:!1,timer:0,choice:null,d0:0},mesh:null};return g.d=s.locateGlobal(m.x,m.z).d,g.lap=o(c,f),g.progress=g.lap.progress,this.cars.push(g),g}_createCars(){if(Array.isArray(this.opts.grid)){this.opts.grid.forEach((e,t)=>{if(this.solo&&!e.isPlayer)return;let n=e.isPlayer?.985:e.skill==null?this.diff.skill:e.skill;this._blankCar(t,e.team,e.teamIndex,!!e.isPlayer,n,{cls:e.cls,driver:e.driver||null,driverId:e.id||null})});return}let e=od.map((e,t)=>t),t=this.rng;for(let n=e.length-1;n>1;n--){let r=1+Math.floor(t()*n);[e[n],e[r]]=[e[r],e[n]]}let n=e.slice(1);n.splice(this.playerSlot,0,0);let r=this.opts.playerTeam;n.forEach((e,n)=>{if(this.solo&&n!==this.playerSlot)return;let i=n===this.playerSlot,a=this.diff.skill+(t()-.5)*2*this.diff.spread,o=e===0&&r?r:od[e];this._blankCar(n,o,e,i,i?.985:a,{driver:i&&this.opts.driver||null,driverId:i?`player`:null})})}setRain(e){this.rainTarget=+!!e,this.rainAt=1/0,e&&(this.rain=1,this.wetness=Math.max(this.wetness,.7),this.rainAnnounced=!0)}requestPit(e=this.player,t=!0){e.pit.stage===0&&e.progress<(this.laps-.9)*this.track.length&&(e.pit.request=t)}choosePitTire(e,t=this.player){t.pit.choice=e}step(e){if(this.phase===`countdown`){this.timer+=e,this.lights=Math.min(5,Math.floor(this.timer)+1),this.timer>=4+this.goHold?(this.phase=`racing`,this.lights=0,this.goFlash=1.6,this.events.push({type:`go`})):Math.floor(this.timer)!==Math.floor(this.timer-e)&&this.timer<5&&this.events.push({type:`light`,n:this.lights}),this._interpolatePoseOnly(),this._weather(e);return}this.time+=e,this.goFlash=Math.max(0,this.goFlash-e),this._weather(e);let t=this.cars;for(let n=0;n<t.length;n++){let r=t[n];r.pit.stage?this._pitControl(r,e):(!r.isPlayer||this.autopilot||r.finished)&&(gd(r,this,e,_d),this._aiPitDecision(r)),this._stepCar(r,e)}this._interactions(e),this.rank(),this._timing(),this.player.finished&&this.phase!==`done`&&this.cars.every(e=>e.finished)&&(this.phase=`done`)}_interpolatePoseOnly(){}_timing(){let e=this.player,t=this.lapTimer;for(let n of Lu(t,e.progress,this.time)){let t={...n,type:n.type===`lap`?`laptime`:n.type===`sector`?`sector`:`startline`,car:e};n.type===`lap`?(e.lapTimes.length&&(e.lapTimes[e.lapTimes.length-1]=n.time,e.bestLap=Math.min(...e.lapTimes)),n.isBest&&(t.ghost=Uu(this.ghostRec,n.time)),Hu(this.ghostRec)):n.type===`start`&&Hu(this.ghostRec),this.events.push(t)}t.g>=0&&Vu(this.ghostRec,Ru(t,this.time),e.x,e.z,e.theta)}_weather(t){this.time>=this.rainAt&&(this.rainTarget=1,this.rainAt=1/0),this.rainTarget>0&&!this.rainAnnounced&&this.rain>.05&&(this.rainAnnounced=!0,this.events.push({type:`rain`})),this.rain+=e(this.rainTarget-this.rain,-.1*t,.12*t);let n=this.rain>this.wetness;this.wetness+=e(this.rain-this.wetness,-.012*t,(n?.07:.012)*t)}_aiPitDecision(e){if(e.isPlayer||e.pit.stage||e.pit.request||e.finished||e.progress>(this.laps-1)*this.track.length||e.progress<0)return;this.rain>.4&&this.rainHighTime===void 0&&(this.rainHighTime=this.time);let t=e.id*7%10*3,n=this.rainHighTime!==void 0&&e.tire===`dry`&&this.time-this.rainHighTime>t,r=this.rain<.05&&this.wetness<.12&&e.tire===`wet`;(n||r||e.wear>.8)&&(e.pit.request=!0,e.pit.aiChoice=this.rain>.3||this.wetness>.3?`wet`:`dry`)}_pitControl(e,r){let a=this.track,o=e.pit,s=e.input;e.ai.forceLock=!1;let c=i(e.s,a.length),l=e.idx,u=a.laneD(l),d=a.boxD(l),f=a.boxU(e.teamIndex),p=f-c,m=30,h=u;if(o.stage===1){let r=n(a.pit.entry,a.pit.laneStart,c);h=t(o.d0,u,r),m=c<a.pit.laneStart?Math.sqrt(a.pit.limit**2+56*Math.max(0,a.pit.laneStart-c)):a.pit.limit,p<30&&(h=t(u,d,n(30,10,p)),m=Math.min(m,Math.sqrt(10*Math.max(0,p-.6)))),p<3&&e.v<2.5?(o.stage=2,o.timer=0,e.isPlayer||(o.choice=o.aiChoice||`dry`)):c>f+8&&e.v>4&&(o.stage=3)}else o.stage===2?(m=0,h=d,o.timer+=r,e.isPlayer&&!o.choice&&o.timer>7&&(o.choice=this.wetness>.25?`wet`:`dry`),o.choice&&(o.serv=(o.serv||0)+r,o.serv>2.4&&(e.tire=o.choice,e.wear=0,o.stage=3,o.serv=0,o.choice=null,o.request=!1,e.pitStops++,this.events.push({type:`pit`,car:e})))):o.stage===3&&(h=t(d,u,n(f,f+14,c)),h=t(h,Cd(a,e),n(a.pit.laneEnd,a.pit.exit,c)),m=c<a.pit.laneEnd?a.pit.limit:30+(c-a.pit.laneEnd)*2,c>a.pit.exit&&(o.stage=0,o.request=!1));return s.steer=ud(a,e,e.cls,h,6+e.v*.25,_d),fd(e,m,s),o.stage===1&&p<30&&m<3&&(s.throttle=0,s.brake=e.v>m+.5?.8:.15),o.stage===2&&(s.throttle=0,s.brake=1),s.boost=!1,!0}_stepCar(t,n){let a=this.track,o=t.cls,l=t.input,u=i(t.s,a.length);t.pit.stage===0&&u>a.pit.entry-40&&u<a.pit.laneStart+20&&(t.pit.request||t.isPlayer&&t.d>a.half[t.idx]+3&&t.progress>0)&&(t.pit.stage=1,t.pit.d0=t.d,t.pit.request=!0,t.pit.serv=0),t.surface=a.surfaceAt(t.idx,t.d),bd.tire=t.tire,bd.wear=t.wear,bd.wetness=this.wetness,bd.surface=t.surface,t.grip=d(bd);let p=t.isPlayer&&!this.autopilot&&!t.pit.stage,m=e(t.v/o.vTop,0,1),h=l.steer,g=p?Math.abs(h)<Math.abs(t.steer)||h*t.steer<0?9:6.5-3*m:9;t.steer+=e(h-t.steer,-g*n,g*n),t.brk+=e(l.brake-t.brk,-10*n,(p?7:14)*n);let y=c[t.surface],S=!1;l.boost&&t.boost>.01&&(S=!0),t.boosting=S;let w=o.vTop*(S?1.07:1)*(1+.025*Math.min(1,t.slip/.3)),T=Math.max(Math.abs(t.v),2.5);t.grip*=1-.07*t.flat;let E=t.brk,D=x(o,t.steer,T,t.grip,0,yd),O=Math.min(1,D.frac);if(t.v>.4&&E>0&&(p?this.diff.assist:!t.ai.forceLock)){let e=b(o,T,t.grip,E,O);e>.9&&(E*=.9/e)}let k=t.v>.4?b(o,T,t.grip,E,O):0,A=k>1&&t.v>22?e(.45+(k-1)*3,0,1):0;t.lockup+=e(A-t.lockup,-3*n,9*n),t.lockup<.001&&(t.lockup=0),t.flat=e(t.flat+(t.lockup*.16-.018)*n,0,1);let j=t.v>.4?v(o,T,t.grip)*E*(1-.22*t.lockup):0,ee=Math.max(_(o,T,t.grip),1),M=Math.min(1,(j+.5*o.accel*l.throttle*Math.max(0,1-T/w))/ee),N=x(o,t.steer,T,t.grip*(1-.4*t.lockup),Math.min(1,M),yd);t.latFrac=N.frac;let P=o.accel*l.throttle*Math.max(0,1-(t.v/w)**2);S&&(P+=12*Math.max(0,1-t.v/w));let F=vd*1.5*(.35+.65*t.grip)+(S?8:0);t.wheelspin=P>F?Math.min(1,(P-F)/F):0,P=Math.min(P,F),P*=1-(this.diff.assist?.15:.3)*Math.min(1,N.excess),t.pit.stage&&t.v>a.pit.limit&&l.throttle>0&&(P=Math.min(P,0)),P-=y.drag*t.v+45e-5*t.v*t.v+.4,l.throttle<.05&&t.v>5&&(P-=1.1*(1-l.throttle/.05)),P-=vd*a.slopeAt(t.s)*.7,P-=Math.min(1,N.excess)*2.2*Math.min(1,t.v/30),j>0?P-=j:l.brake>0&&t.v<=.4&&!t.pit.stage&&(P-=8*t.brk),t.longAcc=P,t.wheelSlip=Math.max(t.lockup,t.wheelspin*.8,Math.min(1,N.excess)*.6),t.v+=P*n,t.v<0&&!(l.brake>0&&!t.pit.stage)&&(t.v=0),t.v=Math.max(t.v,-9);let te=Math.abs(t.v)<2.5&&l.throttle>0?Math.sign(t.v||1)*2.5:t.v,ne=C(o,t.steer,Math.abs(te),t.grip*(1-.4*t.lockup),Math.min(1,M));t.theta-=ne*te*n,t.latAcc=Math.abs(ne)*t.v*t.v,t.x+=Math.sin(t.theta)*t.v*n,t.z+=Math.cos(t.theta)*t.v*n,this.phase===`racing`&&(t.wear=Math.min(1,t.wear+f(t.tire,t.latAcc,this.wetness,o.wear)*n));let re=a.locate(t.x,t.z,t.idx,void 0,30);t.idx=re.i,t.d=re.d,t.s=re.s,s(t.lap,t.s)&&this._lapDone(t),t.progress=t.lap.progress,!t.started&&t.progress>=0&&(t.started=!0,t.lapStart=this.time),t.pose=fe(a,t.s,t.pose),t.y=t.pose.y;let ie=t.idx,ae=a.leftWall[ie]-1,oe=a.rightWall[ie]-1,se=0;if(t.d>ae?se=t.d-ae:t.d<-oe&&(se=t.d+oe),se){t.x-=a.nx[ie]*se,t.z-=a.nz[ie]*se,t.d-=se;let i=a.theta[ie],o=r(i-t.theta),s=Math.abs(Math.sin(o));t.theta+=e(o,-.5,.5)*Math.min(1,24*n),t.hit<=0?(t.v*=1-e(.12+.6*s,0,.6),t.hit=.4,this.events.push({type:`hit`,car:t,power:s})):t.v*=1-(4+18*s)*n,t.scrape=.15}t.hit=Math.max(0,t.hit-n),t.scrape=Math.max(0,(t.scrape||0)-n)}_lapDone(e){let t=e.lap.maxLaps,n=this.time;if(t>=1){let t=n-e.lapStart;e.lapStart=n,e.lapTimes.push(t),t<e.bestLap&&(e.bestLap=t)}e.laps=t,t>=this.laps&&!e.finished?(e.finished=!0,e.finishTime=n,e.pit.request=!1,this.events.push({type:`finish`,car:e})):(this.events.push({type:`lap`,car:e,lap:t}),this.solo||t!==this.laps-1||this.finalLapShown||this.cars.some(e=>e.laps>=this.laps)||(this.finalLapShown=!0,this.events.push({type:`finallap`,car:e})))}_interactions(t){let n=this.track,r=n.length,a=this.cars;for(let e=0;e<a.length;e++){let n=a[e];n.slipNow=0,n.cHit=Math.max(0,(n.cHit||0)-t)}for(let t=0;t<a.length;t++)for(let o=t+1;o<a.length;o++){let s=a[t],c=a[o],l=i(c.s-s.s,r),u=c.d-s.d;if(Math.abs(l)>36||Math.abs(u)>6)continue;let d=l>0?s:c,f=l>0?c:s,p=Math.abs(l)-4.6;if(d.finished||(d.slipNow=Math.max(d.slipNow,w(p,Math.abs(u)))),!(s.pit.stage||c.pit.stage)&&Math.abs(l)<4.6&&Math.abs(u)<2.1){let t=(2.1-Math.abs(u))*.5,r=u>=0?1:-1;if(c.x+=n.nx[c.idx]*t*r,c.z+=n.nz[c.idx]*t*r,s.x-=n.nx[s.idx]*t*r,s.z-=n.nz[s.idx]*t*r,(s.isPlayer||c.isPlayer)&&!((s.cHit||0)>0&&(c.cHit||0)>0)){let t=e(Math.abs(d.v-f.v)/25+(2.1-Math.abs(u))*.25,.05,1);s.cHit=c.cHit=.5,this.events.push({type:`hit`,car:s.isPlayer?s:c,power:t,kind:`car`})}Math.abs(l)>2.2&&(d.v=Math.min(d.v,f.v+1),f.v+=.08)}}for(let e=0;e<a.length;e++){let n=a[e];n.slip=n.slipNow,xd.fill=n.slipNow,xd.boosting=n.boosting,xd.dt=t,n.boost=T(n.boost,xd)}}gaps(e=this.player){let t=this.order.indexOf(e),n=this.track.length,r=t=>!t||t.progress<0||e.progress<0?null:Math.abs(t.progress-e.progress)/Math.max(30,e.v,t.v*.8);return{ahead:t>0&&!this.order[t-1].finished?r(this.order[t-1]):null,behind:t<this.order.length-1&&!this.order[t+1].finished?r(this.order[t+1]):null,L:n}}rank(){this.order=this.cars.slice().sort((e,t)=>e.finished&&t.finished?e.finishTime-t.finishTime:e.finished?-1:t.finished?1:t.progress-e.progress);let e=this.player?.pos;this.order.forEach((e,t)=>e.pos=t+1),this.player&&e&&e!==this.player.pos&&this.phase===`racing`&&this.player.progress>0&&!this.player.finished&&this.events.push({type:`poschange`,from:e,to:this.player.pos})}simulateToEnd(e=150){let t=0;for(;!this.cars.every(e=>e.finished)&&t<e;)this.step(1/30),t+=1/30;this.events.length=0}results(){let e=this.order[0];return this.order.map(t=>({pos:t.pos,name:t.driver?.name||t.team.name,tag:t.team.tag,team:t.team,isPlayer:t.isPlayer,id:t.driverId||null,finished:t.finished,time:t.finishTime,gap:t.finished?t.finishTime-e.finishTime:null,best:t.bestLap,stops:t.pitStops}))}};function Cd(e,t){return e.lineAt(t.s)*.9}function wd(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new si;c.morphTargetsRelative=s;let l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0,p=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let t in d.morphAttributes){if(!i.has(t))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;if(d.morphAttributes[t].length!==e[0].morphAttributes[t].length)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have the same number of morph targets for the "`+t+`" morph attribute.`),null;o[t]===void 0&&(o[t]=[]),o[t].push(d.morphAttributes[t]),p++}if(p!==i.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of morph attributes.`),null;if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=Td(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=Td(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function Td(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new Kr(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var Ed=[{id:`stripes`,name:`STRIPES`,style:`stripe`},{id:`chevrons`,name:`CHEVRONS`,style:`chevron`},{id:`split`,name:`SPLIT`,style:`twotone`},{id:`fade`,name:`FADE`,style:`fade`},{id:`flash`,name:`FLASH`,style:`flash`},{id:`hoops`,name:`HOOPS`,style:`hoop`},{id:`checker`,name:`CHECKER`,style:`checker`}],Dd=Ed.map(e=>e.id),Od=e=>(Ed.find(t=>t.id===e)||Ed[0]).style,kd=[15222570,16747039,15909424,12576842,3720330,2078422,1937361,3364300,11036912,15755936,15921908,2763318];function Ad(e,t){return typeof e!=`string`&&(e=e==null?``:String(e)),e=e.normalize(`NFC`).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g,``),e=e.replace(/<[^>]*>/g,``).replace(/[^\p{L}\p{N} \-._!#+]/gu,``),e=e.replace(/\s+/g,` `).trim(),[...e].slice(0,t).join(``).trim()}function jd(e,t=3,n=18){let r=Ad(e,n);return[...r].length>=t?r:null}function Md(e,t=``){let n=Ad(e,8).toUpperCase().replace(/[^A-Z0-9]/g,``).slice(0,3);return n.length>=2?n:Nd(t)}function Nd(e){let t=Ad(e,18).toUpperCase().normalize(`NFD`).replace(/[^A-Z0-9 ]/g,``).split(` `).filter(Boolean),n=t.length>=2?t.slice(0,3).map(e=>e[0]).join(``):``;if(n.length<3){let e=(t[0]||``).replace(/ /g,``),r=e.slice(1).replace(/[AEIOU]/g,``),i=e.slice(1).replace(/[^AEIOU]/g,``);n=t.length>=2?n+r+i+`XXX`:e.slice(0,1)+r+i+`XXX`}return n.slice(0,3)}function Pd(e,t=15222570){return typeof e==`number`&&Number.isInteger(e)&&e>=0&&e<=16777215?e:typeof e==`string`&&/^#?[0-9a-f]{6}$/i.test(e.trim())?parseInt(e.trim().replace(`#`,``),16):t}function Fd(e,t=1){let n=typeof e==`string`?parseInt(e,10):e;return Number.isInteger(n)&&n>=1&&n<=99?n:t}var Id=e=>`#`+(e>>>0).toString(16).padStart(6,`0`).slice(-6);function Ld(){return{pattern:`chevrons`,c1:15222570,c2:16765514,c3:1381658,number:1}}function Rd(e){let t=Ld(),n=e&&typeof e==`object`?e:{};return{pattern:Dd.includes(n.pattern)?n.pattern:t.pattern,c1:Pd(n.c1,t.c1),c2:Pd(n.c2,t.c2),c3:Pd(n.c3,t.c3),number:Fd(n.number,t.number)}}function zd(e,t=`Privateer Racing`){let n=e&&typeof e==`object`?e:{},r=jd(n.name)||t;return{name:r,tag:Md(n.tag,r),livery:Rd(n.livery)}}function Bd(e){let t=zd(e),n=t.livery;return{name:t.name,tag:t.tag,c1:n.c1,c2:n.c2,custom:!0,livery:{pattern:n.pattern,c3:n.c3,number:n.number}}}var Vd=`Casey Morrow`;function Hd(e){let t=e&&typeof e==`object`?e:{},n=t.team&&typeof t.team==`object`?t.team:null,r={...n?.livery||{},...t.livery||{}},i=Fd(t.number??r.number??(t.driver&&typeof t.driver==`object`?t.driver.number:void 0),Ld().number),a=zd({name:t.name??n?.name,tag:t.tag??n?.tag,livery:{pattern:t.pattern??r.pattern,c1:t.c1??r.c1,c2:t.c2??r.c2,c3:t.c3??r.c3,number:i}});return{driver:jd(typeof t.driver==`string`?t.driver:t.driver?.name??t.driverName??``)||Vd,name:a.name,tag:a.tag,pattern:a.livery.pattern,c1:a.livery.c1,c2:a.livery.c2,c3:a.livery.c3,number:a.livery.number}}function Ud(e,t={}){let n=Hd(e),r=t&&typeof t==`object`?t:{};return Hd({driver:r.driver===void 0?n.driver:jd(r.driver)||n.driver,name:r.name===void 0?n.name:jd(r.name)||n.name,tag:r.tag===void 0?r.name!==void 0&&jd(r.name)?``:n.tag:r.tag,pattern:r.pattern===void 0?n.pattern:Dd.includes(r.pattern)?r.pattern:n.pattern,c1:r.c1===void 0?n.c1:Pd(r.c1,n.c1),c2:r.c2===void 0?n.c2:Pd(r.c2,n.c2),c3:r.c3===void 0?n.c3:Pd(r.c3,n.c3),number:r.number===void 0?n.number:Fd(r.number,n.number)})}function Wd(e){let t=Hd(e);return Bd({name:t.name,tag:t.tag,livery:{pattern:t.pattern,c1:t.c1,c2:t.c2,c3:t.c3,number:t.number}})}var Gd=[1,7,12,21,28,35,42,56,63,88],Kd=e=>Gd[(e%Gd.length+Gd.length)%Gd.length],qd=[`stripe`,`twotone`,`chevron`,`flash`,`hoop`],Jd=e=>e===0?`chevron`:qd[(e%qd.length+qd.length)%qd.length],Yd=(e,t)=>e?.livery?.pattern?Od(e.livery.pattern):Jd(t),Xd=(e,t)=>e?.livery?.number??Kd(t),Zd={0:`111101101101111`,1:`010110010010111`,2:`111001111100111`,3:`111001111001111`,4:`101101111001001`,5:`111100111001111`,6:`111100111101111`,7:`111001001010010`,8:`111101111101111`,9:`111101111001111`},Qd=new q,$d=e=>(Qd.set(e),[Qd.r,Qd.g,Qd.b]),ef=(e,t,n)=>[e[0]+(t[0]-e[0])*n,e[1]+(t[1]-e[1])*n,e[2]+(t[2]-e[2])*n],tf=(e,t)=>[Math.min(1,e[0]*t),Math.min(1,e[1]*t),Math.min(1,e[2]*t)],nf=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],rf=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],af=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],of=(e,t,n)=>e<t?t:e>n?n:e,sf=e=>{let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]},cf=class{constructor(){this.pos=[],this.col=[]}tri(e,t,n,r,i){let a=rf(nf(t,e),nf(n,e));if(i&&af(a,nf(e,i))<0){let e=t;t=n,n=e}let o=sf(rf(nf(t,e),nf(n,e))),s=1+.16*Math.max(0,o[1])-.22*Math.max(0,-o[1])+.07*Math.max(0,o[2]),c=Math.sin((e[0]*12.9898+e[1]*78.233+e[2]*37.719)*43758.5453)*.5+.5;s*=.97+.06*(c-Math.floor(c));let l=o[1]>.6?.06:0,u=[Math.min(1,r[0]*s+l*.5),Math.min(1,r[1]*s+l*.6),Math.min(1,r[2]*s+l)];for(let r of[e,t,n])this.pos.push(r[0],r[1],r[2]),this.col.push(u[0],u[1],u[2])}quad(e,t,n,r,i,a){this.tri(e,t,n,i,a),this.tri(e,n,r,i,a)}flatQuad(e,t,n,r,i,a=[0,1,0]){for(let o of[[e,t,n],[e,n,r]]){let[e,t,n]=af(rf(nf(o[1],o[0]),nf(o[2],o[0])),a)<0?[o[0],o[2],o[1]]:o;for(let r of[e,t,n])this.pos.push(r[0],r[1],r[2]),this.col.push(i[0],i[1],i[2])}}box(e,t,n,r,i,a,o,s=0,c=null){let l=Math.sin(s),u=Math.cos(s),d=[];for(let[o,s,c]of[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]){let f=s*i/2,p=c*a/2;d.push([e+o*r/2,t+f*u-p*l,n+f*l+p*u])}let f=[e,t,n],p=c||o;this.quad(d[0],d[1],d[2],d[3],o,f),this.quad(d[4],d[5],d[6],d[7],o,f),this.quad(d[0],d[4],d[7],d[3],o,f),this.quad(d[1],d[5],d[6],d[2],o,f),this.quad(d[3],d[2],d[6],d[7],p,f),this.quad(d[0],d[1],d[5],d[4],tf(o,.7),f)}beam(e,t,n,r){let i=sf(nf(t,e)),a=sf(rf(i,Math.abs(i[1])>.9?[1,0,0]:[0,1,0])),o=sf(rf(i,a)),s=n/2,c=[];for(let n of[e,t])for(let[e,t]of[[-1,-1],[1,-1],[1,1],[-1,1]])c.push([n[0]+a[0]*e*s+o[0]*t*s,n[1]+a[1]*e*s+o[1]*t*s,n[2]+a[2]*e*s+o[2]*t*s]);let l=[(e[0]+t[0])/2,(e[1]+t[1])/2,(e[2]+t[2])/2];for(let e=0;e<4;e++){let t=(e+1)%4;this.quad(c[e],c[t],c[4+t],c[4+e],r,l)}this.quad(c[0],c[1],c[2],c[3],r,l),this.quad(c[4],c[5],c[6],c[7],r,l)}plate(e,t,n,r,i=null){let a=e.length,o=e.reduce((e,t)=>e+t[0],0)/a,s=e.reduce((e,t)=>e+t[1],0)/a,c=[(t+n)/2,s,o];for(let i=1;i<a-1;i++)this.tri([t,e[0][1],e[0][0]],[t,e[i][1],e[i][0]],[t,e[i+1][1],e[i+1][0]],r,c),this.tri([n,e[0][1],e[0][0]],[n,e[i][1],e[i][0]],[n,e[i+1][1],e[i+1][0]],r,c);for(let o=0;o<a;o++){let s=(o+1)%a;this.quad([t,e[o][1],e[o][0]],[n,e[o][1],e[o][0]],[n,e[s][1],e[s][0]],[t,e[s][1],e[s][0]],i&&o===0?i:r,c)}}loft(e,t,n=null){for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1],a=r.ring.length,o=0,s=0;for(let e=0;e<a;e++)o+=r.ring[e][0]+i.ring[e][0],s+=r.ring[e][1]+i.ring[e][1];let c=[o/(2*a),s/(2*a),(r.z+i.z)/2];for(let e=0;e<a;e++){let n=(e+1)%a,o=r.seg&&r.seg[e]||t;this.quad([r.ring[e][0],r.ring[e][1],r.z],[r.ring[n][0],r.ring[n][1],r.z],[i.ring[n][0],i.ring[n][1],i.z],[i.ring[e][0],i.ring[e][1],i.z],o,c)}}let r=(e,t,n)=>{let r=e.ring.length,i=0,a=0;for(let t of e.ring)i+=t[0],a+=t[1];let o=[i/r,a/r,e.z],s=[o[0],o[1],e.z+(n?1:-1)];for(let n=0;n<r;n++){let i=(n+1)%r;this.tri(o,[e.ring[n][0],e.ring[n][1],e.z],[e.ring[i][0],e.ring[i][1],e.z],t,s)}};r(e[0],n||t,!1),r(e[e.length-1],t,!0)}mirrored(e){let t=this.pos.length;e(1);let n=this.pos.length;for(let e=t;e<n;e+=9){let t=[0,1,2].map(t=>[-this.pos[e+t*3],this.pos[e+t*3+1],this.pos[e+t*3+2]]),n=this.col.slice(e,e+9);this.pos.push(t[0][0],t[0][1],t[0][2],t[2][0],t[2][1],t[2][2],t[1][0],t[1][1],t[1][2]),this.col.push(n[0],n[1],n[2],n[6],n[7],n[8],n[3],n[4],n[5])}}geometry(){let e=new si;return e.setAttribute(`position`,new Yr(this.pos,3)),e.setAttribute(`color`,new Yr(this.col,3)),e.computeVertexNormals(),e}},lf=$d(1381658),uf=$d(2369070);$d(9278366);var df=$d(15921908),ff=$d(1848656),pf=$d(5211832),mf={gp:.38,speedway:.42},hf={gp:.5,speedway:.55},gf=Math.PI*2/5,_f={gp:[[.95,1.9],[-.95,1.9],[1.05,-1.65],[-1.05,-1.65]],speedway:[[1,1.7],[-1,1.7],[1.1,-1.5],[-1.1,-1.5]]};function vf(e,t){if(t>=e[0].z)return e[0].yTop;for(let n=0;n<e.length-1;n++)if(t<=e[n].z&&t>=e[n+1].z){let r=(e[n].z-t)/(e[n].z-e[n+1].z);return e[n].yTop+(e[n+1].yTop-e[n].yTop)*r}return e[e.length-1].yTop}function yf(e,t,n,r,i,a,o,s){let c=t.length,l=(c*3+(c-1))*a,u=5*a,d=n-l/2,f=(e,t)=>[e,i(t)+.014,t],p=a*.6;e.flatQuad(f(d-p,r-p),f(d+l+p,r-p),f(d+l+p,r+u+p),f(d-p,r+u+p),o);let m=e=>n+l/2-e;for(let n=0;n<c;n++){let o=Zd[t[n]]||Zd[0];for(let t=0;t<5;t++)for(let c=0;c<3;c++)if(o[t*3+c]===`1`){let o=n*4*a+c*a,l=m(o+a),u=m(o),d=r+(4-t)*a,f=.02;e.flatQuad([l,i(d)+f,d],[u,i(d)+f,d],[u,i(d+a)+f,d+a],[l,i(d+a)+f,d+a],s)}}}function bf(e,t,n,r,i,a){return[[e,r],[t,i],[n,a],[-n,a],[-t,i],[-e,r]]}function xf(e,t){let n=e.c1,r=e.c2,i=new cf,a=Yd(e,t),o=String(Xd(e,t)),s=$d(n),c=$d(r),l=tf(s,.72),u=tf(s,1.12),d=e.livery?.c3==null?tf(c,.9):$d(e.livery.c3),f=a===`twotone`,p=f?c:l,m=[{z:3.36,wb:.05,wm:.06,wt:.05,y0:.2,ym:.26,y1:.31},{z:2.9,wb:.12,wm:.15,wt:.1,y0:.2,ym:.34,y1:.4},{z:2.3,wb:.2,wm:.27,wt:.17,y0:.2,ym:.42,y1:.5},{z:1.6,wb:.3,wm:.38,wt:.25,y0:.22,ym:.5,y1:.6},{z:.95,wb:.4,wm:.46,wt:.33,y0:.24,ym:.58,y1:.7},{z:.3,wb:.44,wm:.5,wt:.37,y0:.26,ym:.62,y1:.74},{z:-.35,wb:.42,wm:.46,wt:.3,y0:.28,ym:.68,y1:.84},{z:-.95,wb:.36,wm:.4,wt:.22,y0:.3,ym:.78,y1:1.02},{z:-1.55,wb:.28,wm:.3,wt:.14,y0:.32,ym:.62,y1:.8},{z:-2.05,wb:.22,wm:.24,wt:.1,y0:.34,ym:.5,y1:.62},{z:-2.4,wb:.2,wm:.2,wt:.1,y0:.34,ym:.46,y1:.56}],h=e=>a===`fade`?ef(u,c,of((1.6-e)/3.6,0,1)):a===`hoop`&&(e<-.4&&e>-1||e<-2)||f&&e<-.3?c:u,g=m.map(e=>({z:e.z,ring:bf(e.wb,e.wm,e.wt,e.y0,e.ym,e.y1),seg:[p,s,h(e.z),s,p,lf]}));i.loft(g,s,lf);let _=(()=>{let e=m.map(e=>({z:e.z,yTop:e.y1}));return t=>vf(e,t)})(),v=(()=>{let e=m.map(e=>({z:e.z,yTop:e.wt}));return t=>vf(e,t)})();i.box(0,.745,.05,.5,.05,.9,lf),i.box(0,.84,-.42,.34,.2,.18,uf);let y=new wa(.19,6,4).toNonIndexed().attributes.position,b=a===`twotone`?c:df;for(let e=0;e<y.count;e+=3)i.tri([y.getX(e),y.getY(e)+.95,y.getZ(e)+.08],[y.getX(e+1),y.getY(e+1)+.95,y.getZ(e+1)+.08],[y.getX(e+2),y.getY(e+2)+.95,y.getZ(e+2)+.08],b,[0,.95,.08]);i.box(0,.97,.245,.27,.085,.07,$d(727595)),i.box(0,1.01,.262,.2,.025,.04,$d(16764730));let x=(e,t,n,r,i,a)=>({z:e,ring:[t,n,r,i,a],seg:[lf,p,s,f?c:u,tf(s,.6)]}),S=[x(.85,[.5,.3],[.78,.36],[1,.52],[.9,.74],[.5,.74]),x(.1,[.5,.3],[.74,.37],[.97,.56],[.86,.78],[.5,.82]),x(-.9,[.42,.34],[.62,.4],[.82,.58],[.68,.72],[.4,.88]),x(-1.9,[.3,.36],[.42,.4],[.5,.5],[.42,.6],[.26,.64])];i.mirrored(()=>i.loft(S,s,lf)),i.plate([[-1.5,.9],[-1.6,1.12],[-1.75,1.12],[-2.35,.66],[-2.45,.58],[-1.5,.58]],-.02,.02,u,c),i.box(0,1.04,-.78,.3,.2,.3,u),i.box(0,1.07,-.62,.22,.13,.04,lf);let C=$d(3158588);i.beam([0,.78,.5],[0,1.1,.62],.06,C),i.beam([.02,1.1,.62],[.33,1.1,.12],.055,C),i.beam([-.02,1.1,.62],[-.33,1.1,.12],.055,C),i.beam([.33,1.1,.12],[.34,.82,-.18],.055,C),i.beam([-.33,1.1,.12],[-.34,.82,-.18],.055,C),i.box(0,1.125,.6,.07,.03,.12,c);let w=[[3.4,.13,.3,0,lf],[3.25,.19,.28,.17,c],[3.1,.26,.26,.34,u]];for(let[e,t,n,r,a]of w)i.box(0,t,e,2,.035,n,a,r);i.beam([.12,.3,2.7],[.1,.17,3.15],.05,uf),i.beam([-.12,.3,2.7],[-.1,.17,3.15],.05,uf),i.mirrored(()=>i.plate([[3.5,.08],[3.5,.28],[3.2,.42],[2.95,.4],[2.95,.1]],1,1.05,s,c)),i.box(0,1.12,-2.42,1.7,.045,.34,u,-.12),i.box(0,1.28,-2.46,1.7,.04,.3,c,-.3),i.box(0,.58,-2.5,1.1,.035,.26,lf,-.1),i.mirrored(()=>i.plate([[-2.1,.5],[-2.1,1.42],[-2.5,1.42],[-2.75,1.34],[-2.75,.55]],.86,.92,s,c)),i.beam([.1,.62,-2.15],[.1,1.1,-2.4],.055,uf),i.beam([-.1,.62,-2.15],[-.1,1.1,-2.4],.055,uf),i.box(0,.5,-2.1,.4,.28,.5,lf),i.box(0,.32,-2.55,.9,.08,.35,uf,.18),i.box(0,.12,-.15,1.3,.05,4.2,uf);let T=$d(4869464);for(let[e,t]of Sf){let n=Math.sign(e),r=[e-n*.25,.4,t],a=t>0?1:-1;i.beam([n*.4,.34,t+.35*a],r,.04,T),i.beam([n*.4,.34,t-.35*a],r,.04,T),i.beam([n*.36,.62,t+.25*a],[r[0],.5,t],.04,T),i.beam([n*.36,.62,t-.25*a],[r[0],.5,t],.04,T),i.beam([n*.2,.7,t],[r[0],.43,t],.035,c)}wf(i,a,s,c,_,v,S,d);let E=a===`twotone`?df:$d(15790322),D=e.livery&&Tf(d)<.45?d:lf;return yf(i,o,0,1.3,_,.06,E,D),yf(i,o,0,-1.42,_,.034,E,D),i}var Sf=[[.95,1.9],[-.95,1.9],[1.05,-1.65],[-1.05,-1.65]];function Cf(e,t,n){let r=0;for(;r<e.length-2&&t<e[r+1].z;)r++;let i=e[r],a=e[r+1],o=of((i.z-t)/(i.z-a.z),0,1),s=e=>[i.ring[e][0]+(a.ring[e][0]-i.ring[e][0])*o,i.ring[e][1]+(a.ring[e][1]-i.ring[e][1])*o],c=s(3),l=s(4);return[l[0]+(c[0]-l[0])*n,l[1]+(c[1]-l[1])*n]}function wf(e,t,n,r,i,a,o,s=tf(r,.9)){let c=.012,l=(e,t)=>of(e,-a(t)+.005,a(t)-.005),u=(e,t)=>[l(e,t),i(t)+c,t],d=(t,n,r,i,a)=>e.flatQuad(u(t,r),u(n,r),u(n,i),u(t,i),a);if(t===`stripe`||t===`chevron`)for(let e of[1,-1]){let t=e*.045,n=e*.1;d(t,n,3.3,1.7,r),d(t,n,-.4,-2.35,r)}if(t===`chevron`)for(let t=0;t<2;t++){let n=2.25-t*.5;for(let i of[1,-1])e.flatQuad(u(i*.02,n+.1),u(i*.2,n-.14),u(i*.2,n-.4),u(i*.02,n-.12),t?s:r)}if(t===`flash`){d(-.08,.08,3.36,2.7,r);for(let t of[1,-1]){let n=(e,n)=>{let r=Cf(o,e,n);return[t*r[0],r[1]+c,e]};e.flatQuad(n(-.6,.55),n(-.6,.15),n(-1.4,.15),n(-1.4,.65),r)}}if(t===`hoop`&&(d(-.3,.3,.9,.7,r),d(-.3,.3,-1.6,-1.75,r)),t===`twotone`&&d(-.08,.08,3.36,.4,r),t===`fade`)for(let e of[1,-1])d(e*.03,e*.06,3.2,1.8,s);if(t===`checker`){for(let[e,t]of[[2.05,2],[-1.95,2]])for(let n=0;n<t;n++)for(let t=-3;t<3;t++){let i=e-n*.1,a=.06;d(t*a,(t+1)*a,i,i-.1,n+t&1?r:s)}for(let e of[1,-1])d(e*.05,e*.08,1.7,.4,r)}}var Tf=e=>.3*e[0]+.59*e[1]+.11*e[2];function Ef(e,t){let n=e.c1,r=e.c2,i=new cf,a=Yd(e,t),o=String(Xd(e,t)),s=$d(n),c=$d(r),l=tf(s,1.12),u=a===`twotone`,d=u?c:tf(s,.72),f=e.livery?.c3==null?tf(c,.9):$d(e.livery.c3),p=[{z:3.3,wb:.2,wm:.24,wt:.2,y0:.2,ym:.3,y1:.36},{z:2.7,wb:.3,wm:.38,wt:.28,y0:.2,ym:.38,y1:.46},{z:2,wb:.42,wm:.5,wt:.38,y0:.22,ym:.5,y1:.6},{z:1.1,wb:.52,wm:.6,wt:.46,y0:.24,ym:.58,y1:.7},{z:.2,wb:.56,wm:.62,wt:.46,y0:.26,ym:.62,y1:.76},{z:-.7,wb:.54,wm:.58,wt:.38,y0:.28,ym:.7,y1:.9},{z:-1.5,wb:.44,wm:.46,wt:.2,y0:.3,ym:.78,y1:1.08},{z:-2.1,wb:.34,wm:.34,wt:.14,y0:.32,ym:.62,y1:.86},{z:-2.5,wb:.3,wm:.3,wt:.12,y0:.34,ym:.5,y1:.7}],m=p.map(e=>({z:e.z,ring:bf(e.wb,e.wm,e.wt,e.y0,e.ym,e.y1),seg:[d,s,a===`fade`?ef(l,c,of((1.6-e.z)/3.6,0,1)):u&&e.z<0||a===`hoop`&&e.z<-1.2&&e.z>-1.7?c:l,s,d,lf]}));i.loft(m,s,lf);let h=(()=>{let e=p.map(e=>({z:e.z,yTop:e.y1}));return t=>vf(e,t)})(),g=(()=>{let e=p.map(e=>({z:e.z,yTop:e.wt}));return t=>vf(e,t)})();i.box(0,.775,.45,.62,.05,1,lf);let _=new wa(.21,6,4).toNonIndexed().attributes.position,v=a===`twotone`?c:df;for(let e=0;e<_.count;e+=3)i.tri([_.getX(e),_.getY(e)+1,_.getZ(e)+.4],[_.getX(e+1),_.getY(e+1)+1,_.getZ(e+1)+.4],[_.getX(e+2),_.getY(e+2)+1,_.getZ(e+2)+.4],v,[0,1,.4]);i.box(0,1.02,.6,.3,.09,.08,$d(727595)),i.box(0,1.06,.62,.22,.026,.04,$d(4186367));let y=$d(3158588);i.quad([.4,.78,.95],[-.4,.78,.95],[-.3,1.18,.62],[.3,1.18,.62],ff,[0,.9,.4]),i.quad([.3,1.18,.62],[-.3,1.18,.62],[-.28,1.2,.5],[.28,1.2,.5],pf,[0,.9,.4]),i.beam([.4,.78,.95],[.3,1.18,.62],.06,y),i.beam([-.4,.78,.95],[-.3,1.18,.62],.06,y),i.beam([.3,1.18,.62],[.38,1,-.15],.055,y),i.beam([-.3,1.18,.62],[-.38,1,-.15],.055,y),i.box(0,1.2,.58,.62,.035,.1,c);let b=(e,t,n,r,i,a)=>({z:e,ring:[t,n,r,i,a],seg:[lf,d,s,u?c:l,tf(s,.6)]}),x=[b(1,[.6,.3],[.9,.36],[1.12,.54],[1.02,.78],[.6,.78]),b(-.1,[.6,.3],[.88,.37],[1.12,.58],[1,.86],[.58,.9]),b(-1.2,[.5,.34],[.78,.4],[1,.6],[.84,.82],[.5,.94]),b(-2.2,[.36,.36],[.5,.4],[.6,.52],[.5,.66],[.3,.72])];i.mirrored(()=>i.loft(x,s,lf)),i.plate([[-.9,1.04],[-1.2,1.5],[-1.34,1.5],[-1.7,1.06],[-2.5,.72],[-2.6,.64],[-1.4,.6]],-.03,.03,l,c),i.box(0,1.1,-.8,.36,.2,.4,l),i.box(0,1.13,-.58,.26,.14,.05,lf),i.box(0,.16,3.4,2.4,.04,.34,lf),i.box(0,.22,3.26,2.4,.04,.3,c,.16),i.box(0,.3,3.12,2.2,.04,.26,l,.32),i.beam([.2,.34,2.7],[.18,.2,3.3],.06,uf),i.beam([-.2,.34,2.7],[-.18,.2,3.3],.06,uf),i.mirrored(()=>i.plate([[3.55,.08],[3.55,.3],[3.25,.44],[3,.42],[3,.1]],1.2,1.26,s,c)),i.box(0,1.28,-2.5,2.1,.05,.42,l,-.1),i.box(0,1.5,-2.55,2.1,.045,.36,c,-.3),i.mirrored(()=>i.plate([[-2.2,.55],[-2.2,1.72],[-2.62,1.72],[-2.9,1.62],[-2.9,.6]],1.04,1.1,s,c)),i.beam([.14,.7,-2.2],[.14,1.26,-2.5],.06,uf),i.beam([-.14,.7,-2.2],[-.14,1.26,-2.5],.06,uf),i.box(0,.52,-2.3,.6,.3,.6,lf),i.box(0,.12,-.1,1.5,.05,4.4,uf);let S=$d(4869464);for(let[e,t]of _f.speedway){let n=Math.sign(e),r=[e-n*.27,.43,t],a=t>0?1:-1;i.beam([n*.5,.34,t+.35*a],r,.045,S),i.beam([n*.5,.34,t-.35*a],r,.045,S),i.beam([n*.46,.64,t+.25*a],[r[0],.54,t],.045,S),i.beam([n*.46,.64,t-.25*a],[r[0],.54,t],.045,S)}wf(i,a,s,c,h,g,x,f);let C=$d(15790322);return yf(i,o,0,1.45,h,.06,C,lf),yf(i,o,0,-1,h,.034,C,lf),i}function Df(e,t,n,r){let i=new cf,a=mf[e],o=hf[e]/2,s=$d(1710623),c=$d(2500140),l=$d(1842210),u=n,d=t,f=ef($d(1315866),d,.18),p=a*.78,m=a*.9,h=a*.62,g=h*.86,_=o+.02,v=(e,t,n)=>[n,Math.cos(t)*e,Math.sin(t)*e],y=.07;for(let e=0;e<10;e++){let t=e/10*Math.PI*2,n=(e+1)/10*Math.PI*2,b=[0,0,0],x=e===0&&r?$d(6972766):e&1?s:c;i.quad(v(a,t,-o+y),v(a,t,o-y),v(a,n,o-y),v(a,n,-o+y),x,b);for(let e of[1,-1])i.quad(v(a,t,e*(o-y)),v(a,t,e*o),v(a,n,e*o),v(a,n,e*(o-y)),u,b);i.quad(v(a,t,o),v(a*.92,t,o),v(a*.92,n,o),v(a,n,o),l,b),i.quad(v(a*.92,t,o),v(m,t,_),v(m,n,_),v(a*.92,n,o),l,b),i.quad(v(m,t,_),v(p,t,_),v(p,n,_),v(m,n,_),u,b),i.quad(v(p,t,_),v(h,t,_),v(h,n,_),v(p,n,_),l,b),i.quad(v(h,t,_),v(g,t,_),v(g,n,_),v(h,n,_),e&1?d:tf(d,.82),b),i.quad(v(g,t,_),v(1e-4,t,_),v(1e-4,n,_),v(g,n,_),f,b),i.quad(v(a*.92,n,-o),v(a*.55,n,-o),v(a*.55,t,-o),v(a*.92,t,-o),l,b)}for(let e=0;e<3;e++){let t=.35+e*.28,n=a*.915,r=a*.935;i.flatQuad(v(n,t,o+.012),v(r,t,o+.012),v(r,t+.16,o+.012),v(n,t+.16,o+.012),$d(13619158),[1,0,0])}let b=_+.012;for(let e=0;e<5;e++){let t=e/5*Math.PI*2,n=Math.cos(t),r=Math.sin(t),o=a*.1,s=[b,n*g*.98,r*g*.98],c=-r*o,l=n*o;i.flatQuad([b,c*.6,l*.6],[b,s[1]+c,s[2]+l],[b,s[1]-c,s[2]-l],[b,-c*.6,-l*.6],e===0?df:tf(d,1.2),[1,0,0])}let x=[];for(let e=0;e<5;e++){let t=e/5*Math.PI*2+Math.PI/5;x.push([Math.sin(t)*a*.15,Math.cos(t)*a*.15])}return i.plate(x,b-.005,b+.045,df),i}var Of=e=>(Qd.set(e),.3*Qd.r+.59*Qd.g+.11*Qd.b),kf=e=>Of(e.c2)>.28?e.c2:Of(e.c1)>.28?e.c1:15263984,Af={dry:15921910,wet:3117055},jf=3;function Mf(e){let t=e===`speedway`,n=t?-2.512:-2.412,r=t?.52:.5,i=new si,a=[],o=[[.15,r,n],[-.15,r,n],[0,r-.1,n]];for(let e=0;e<jf;e++){let[t,n,r]=o[e];for(let i of[1,2.4]){let o=(e===2?.07:.085)*i,s=(e===2?.05:.06)*i;a.push(t-o,n-s,r,t+o,n-s,r,t+o,n+s,r,t-o,n-s,r,t+o,n+s,r,t-o,n+s,r)}}return i.setAttribute(`position`,new Yr(a,3)),i.setAttribute(`color`,new Kr(new Float32Array(a.length/3*4),4)),i}var Nf=new Ia({vertexColors:!0,flatShading:!0}),Pf=new yi({color:0,transparent:!0,opacity:.5,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4}),Ff=new yi({color:16772659,fog:!1}),If=new yi({vertexColors:!0,transparent:!0,opacity:.38,depthWrite:!1}),Lf=new yi({vertexColors:!0,transparent:!0,depthWrite:!1,fog:!1,side:2}),Rf=new Sa(2.7,6.4).rotateX(-Math.PI/2),zf=new Map,Bf=new Map,Vf=new Map;function Hf(e,t,n=t.index??0){let r=t.livery,i=e+`:`+n+`:`+t.c1+`:`+t.c2+(r?`:`+r.pattern+`:`+r.c3+`:`+r.number:``),a=zf.get(i);return a||(a=(e===`speedway`?Ef:xf)(t,n).geometry(),a.name=`car-${e}-${n}`,zf.set(i,a)),a}function Uf(e,t,n=`dry`){let r=e+`:`+t.c2+`:`+n,i=Bf.get(r);if(!i){let a=kf(t),o=n===`dry`&&Of(a)>.78?16765471:Af[n]||Af.dry;i=Df(e,$d(a),$d(o),!0).geometry(),Bf.set(r,i)}return i}var Wf=e=>{let t=Vf.get(e);return t||(t=Mf(e),Vf.set(e,t)),t},Gf=new An,Kf=new sn,qf=new Bn,Jf=new G,Yf=new G(1,1,1);function Xf(e,t,n=!1,r=!1,i=t.index??0){let a=e===`speedway`?`speedway`:`gp`,o=new ji(Hf(a,t,i),r?If:Nf);o.castShadow=!r,o.receiveShadow=!r,o.name=`body`;let s=new ir,c=new ir;c.add(o);let l=new Ui(Uf(a,t,`dry`),r?If:Nf,4);{let e=_f[a],t=mf[a],n=(e[0][1]+e[2][1])/2,r=Math.max(...e.map(e=>Math.abs(e[0])))+hf[a]/2+.15;l.boundingSphere=new $r(new G(0,t,n),Math.hypot(r,(e[0][1]-e[2][1])/2+t+.15,t+.1))}l.castShadow=!1,l.receiveShadow=!1,l.name=`wheels`,c.add(l);let u=_f[a].map(([e,t],n)=>({i:n,x:e,z:t,y:mf[a],front:n<2,left:e>0,steer:0,spin:0,bump:0,visible:!0,mesh:l})),d=[u[0],u[1]],f=null,p={intensity:0,on:!1},m={intensity:0,on:!1};r||(f=new ji(Wf(a).clone(),Lf),f.renderOrder=3,c.add(f));let h=new ji(Rf,Pf);h.position.y=.06,h.name=`shadow`,r||s.add(h),s.add(c);let g=null;n&&(g=new ji(new da(1.5,2.8,4).rotateX(Math.PI),Ff),g.position.y=5,g.visible=!1,s.add(g));let _={group:s,pivot:c,body:o,wheels:u,frontPivots:d,wheelMesh:l,lamps:f,brakeLight:p,rainLight:m,mark:g,cls:a,ghost:r,shadow:h,team:t,teamIndex:i,number:Xd(t,i),tire:`dry`,anim:{pitch:0,roll:0,bob:0,kerbMix:0,steer:0,t:0,dist:0,rainPhase:0,bumpPhase:0,vib:0},setTire(e){e!==_.tire&&(_.tire=e,l.geometry=Uf(a,t,e))}};return Zf(_),_}function Zf(e){let t=mf[e.cls],n=e.wheels;for(let r=0;r<n.length;r++){let i=n[r];if(!i.visible){Gf.makeScale(0,0,0),e.wheelMesh.setMatrixAt(i.i,Gf);continue}let a=i.left?i.spin:-i.spin;qf.set(a,-i.steer+(i.left?0:Math.PI),0,`YXZ`),Kf.setFromEuler(qf),Jf.set(i.x,t+i.bump,i.z),e.wheelMesh.setMatrixAt(i.i,Gf.compose(Jf,Kf,Yf))}e.wheelMesh.instanceMatrix.needsUpdate=!0}var Qf=.42*gf,$f=.12*gf;Qf*60;function ep(e){let t=Math.abs(e);if(!(t>Qf))return e;let n=Math.floor(t/gf),r=t-n*gf;return Math.sign(e)*(n*gf+of(r,n?$f:0,Qf))}var tp=Math.PI*2*1024,np=Math.PI-Math.PI/10,rp=Math.PI+Math.PI/10;function ip(e,t,n){let r=e.anim,i=mf[e.cls],a=t.v;r.t+=n;let o=1-.85*(t.lockup||0),s=(a||0)/i*o*n,c=ep(s);r.steer+=((t.steer||0)*.42*of(1-Math.abs(a)/120,.3,1)-r.steer)*(1-Math.exp(-Math.min(n,.1)*24)),r.bumpPhase+=s;let l=e.wheels,u=t.flat>.02?.03*t.flat*of(Math.abs(a)/25,0,1):0;for(let e=0;e<l.length;e++){let t=l[e];t.spin+=c,(t.spin>tp||t.spin<-tp)&&(t.spin-=tp*Math.sign(t.spin)),t.steer=t.front?r.steer:0,t.bump=t.front&&u>0?u*Math.max(0,Math.cos(t.spin-(t.left?np:rp)))**3:0}let d=1-Math.exp(-Math.min(n,.1)*7),f=-of(Math.sign(t.steer||0)*(t.latAcc||0)*.0017,-.075,.075),p=of(-(t.longAcc||0)*.0011,-.055,.03);r.roll+=(f-r.roll)*d,r.pitch+=(p-r.pitch)*d,r.dist=t.s??r.dist+a*n;let m=+(t.surface===`kerb`),h=+(t.surface===`grass`||t.surface===`gravel`);r.kerbMix+=(Math.max(m,h)-r.kerbMix)*(1-Math.exp(-Math.min(n,.1)*14)),r.bob=r.kerbMix*of(Math.abs(a)/50,.25,1)*((m?.022:.034)*Math.sin(r.dist*4.4)+.009*Math.sin(r.dist*9.1+1));let g=(.0035*of(Math.abs(a)/90,0,1)+.012*(t.flat||0)*of(Math.abs(a)/40,0,1)+.01*(t.lockup||0))*Math.sin(r.t*83);e.pivot.rotation.x=-(t.pitch||0)+r.pitch+g*.6,e.pivot.rotation.z=(t.roll||0)+r.roll+g*.4,e.pivot.position.y=(t.lift||0)+r.bob+Math.abs(g)*.5,e.shadow.rotation.x=-(t.pitch||0),e.shadow.rotation.z=t.roll||0;let _=(t.brake||0)>.05||(t.longAcc||0)<-9;e.brakeLight.on=_,e.brakeLight.intensity=+!!_;let v=(t.rain||0)>.25;return r.rainPhase+=n,e.rainLight.on=v,e.rainLight.intensity=v?Math.sin(r.rainPhase*11)>0?1:.15:0,e.ghost||op(e),Zf(e),e}function ap(e,t,n,r,i,a,o){let s=t*12*4;for(let t=0;t<12;t++){let c=s+t*4;e[c]=n,e[c+1]=r,e[c+2]=i,e[c+3]=t>=6?o:a}}function op(e){let t=e.lamps.geometry.attributes.color,n=t.array,r=e.brakeLight.intensity,i=e.rainLight.intensity;for(let e=0;e<2;e++)ap(n,e,.35+.65*r,.03+.12*r,.03+.05*r,.9,.26*r);let a=i>.5?.5:0;ap(n,2,.4+.6*i,.04+a,.04+a,.9,.3*i),t.needsUpdate=!0}function sp(e){e.wheelMesh.dispose?.(),e.lamps?.geometry.dispose(),e.mark&&e.mark.geometry.dispose()}function cp(e,t){let n=(Math.imul(e|0,668265261)^Math.imul((t|0)+374761393,2246822507))>>>0;return n=Math.imul(n^n>>>15,739982445)>>>0,n^=n>>>12,(n>>>0)%65536/65536}var lp={grass:{r:.45,g:.36,b:.22,a:.5,rate:.35,life:.9,up:1.6,size:1},gravel:{r:.62,g:.5,b:.34,a:.55,rate:.5,life:1.1,up:2.2,size:1}},up=(e,t,n,r)=>e.x+t*r[0]+n*r[1],dp=(e,t,n,r)=>e.z-n*r[0]+t*r[1],fp=class{constructor(e=384,t=320){this.max=e,this.next=0,this.counter=0,this.px=new Float32Array(e*3),this.vel=new Float32Array(e*3),this.life=new Float32Array(e),this.life0=new Float32Array(e),this.a0=new Float32Array(e),this.col=new Float32Array(e*4);for(let t=0;t<e;t++)this.px[t*3+1]=-1e3;let n=new si;n.setAttribute(`position`,new Kr(this.px,3).setUsage(Ft)),n.setAttribute(`color`,new Kr(this.col,4).setUsage(Ft)),this.points=new ta(n,new Xi({size:1,vertexColors:!0,transparent:!0,depthWrite:!1,sizeAttenuation:!0,fog:!1})),this.points.frustumCulled=!1,this.points.renderOrder=4,this.points.name=`tyre-fx`,this.maxMarks=t,this.mnext=0,this.mCount=0,this.mpos=new Float32Array(t*4*3);let r=new si;r.setAttribute(`position`,new Kr(this.mpos,3).setUsage(Ft));let i=new Uint16Array(t*6);for(let e=0;e<t;e++)i.set([e*4,e*4+1,e*4+2,e*4,e*4+2,e*4+3],e*6);r.setIndex(new Kr(i,1)),this.marks=new ji(r,new yi({color:789518,transparent:!0,opacity:.55,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6,side:2,fog:!1})),this.marks.frustumCulled=!1,this.marks.renderOrder=1,this.marks.name=`skid-marks`,this.markDirty=!1}get group(){return this}addTo(e){e.add(this.marks),e.add(this.points)}removeFrom(e){e.remove(this.marks),e.remove(this.points)}emit(e,t,n,r,i,a,o,s,c,l,u){let d=this.next;this.next=(this.next+1)%this.max;let f=d*3;return this.px[f]=e,this.px[f+1]=t,this.px[f+2]=n,this.vel[f]=r,this.vel[f+1]=i,this.vel[f+2]=a,this.life[d]=o,this.life0[d]=o,this.a0[d]=u,this.col[d*4]=s,this.col[d*4+1]=c,this.col[d*4+2]=l,this.col[d*4+3]=u,d}update(e){let t=this.max,n=Math.exp(-2.2*e);for(let r=0;r<t;r++){let t=this.life[r];if(t<=0)continue;let i=r*3,a=t-e;if(a<=0){this.life[r]=0,this.px[i+1]=-1e3,this.col[r*4+3]=0;continue}this.life[r]=a,this.vel[i]*=n,this.vel[i+2]*=n,this.vel[i+1]=this.vel[i+1]*n+.7*e,this.px[i]+=this.vel[i]*e,this.px[i+1]+=this.vel[i+1]*e,this.px[i+2]+=this.vel[i+2]*e;let o=a/this.life0[r];this.col[r*4+3]=this.a0[r]*o*Math.min(1,(1-o)*8+.2)}let r=this.points.geometry;r.attributes.position.needsUpdate=!0,r.attributes.color.needsUpdate=!0,this.markDirty&&=(this.marks.geometry.attributes.position.needsUpdate=!0,!1)}alive(){let e=0;for(let t=0;t<this.max;t++)this.life[t]>0&&e++;return e}mark(e,t,n,r,i,a){let o=n-e,s=r-t,c=Math.hypot(o,s);if(c<1e-4)return;let l=-s/c*a,u=o/c*a,d=this.mnext*12,f=this.mpos;f[d]=e+l,f[d+1]=i,f[d+2]=t+u,f[d+3]=e-l,f[d+4]=i,f[d+5]=t-u,f[d+6]=n-l,f[d+7]=i,f[d+8]=r-u,f[d+9]=n+l,f[d+10]=i,f[d+11]=r+u,this.mnext=(this.mnext+1)%this.maxMarks,this.mCount=Math.min(this.maxMarks,this.mCount+1),this.markDirty=!0}clear(){this.life.fill(0),this.px.fill(0);for(let e=0;e<this.max;e++)this.px[e*3+1]=-1e3;this.col.fill(0),this.mpos.fill(0),this.mnext=0,this.mCount=0,this.markDirty=!0}emitCar(e,t,n,r,i=`gp`){if(r<=0||t.ghost)return;let a=t.anim,o=_f[i===`speedway`?`speedway`:`gp`],s=lp[e.surface],c=Math.abs(e.v),l=Math.sin(n.theta),u=Math.cos(n.theta);if(s&&c>5)for(a.fxDust=(a.fxDust||0)+r*s.rate*Math.min(60,c*1.2);a.fxDust>=1;){--a.fxDust,this.counter++;let t=2+(this.counter&1),r=cp(this.counter,e.id),i=cp(this.counter+17,e.id);this.emit(up(n,u,l,o[t])+(r-.5)*.4,n.y+.15,dp(n,u,l,o[t])+(i-.5)*.4,-l*c*.12+(r-.5)*2.5,s.up*(.5+i),-u*c*.12+(i-.5)*2.5,s.life*(.7+.6*r),s.r,s.g,s.b,s.a)}let d=e.lockup||0,f=Math.max(0,(e.wheelSlip||0)-.45)*+(c>20),p=Math.max(d,f*.5);if(p>.25&&!s)for(a.fxSmoke=(a.fxSmoke||0)+r*(8+40*p);a.fxSmoke>=1;){--a.fxSmoke,this.counter++;let t=this.counter&1,r=cp(this.counter,e.id+3),i=cp(this.counter+5,e.id+3);this.emit(up(n,u,l,o[t]),n.y+.2,dp(n,u,l,o[t]),-l*c*.06+(r-.5)*1.4,.5+i*1.4,-u*c*.06+(i-.5)*1.4,.35+.35*r,.45,.45,.47,.32*Math.min(1,.4+p))}if(d>.3&&e.surface!==`grass`&&e.surface!==`gravel`)for(let e=0;e<2;e++){let t=up(n,u,l,o[e]),r=dp(n,u,l,o[e]);a.lastMark&&a.lastMark[e*2]!==void 0&&Math.hypot(t-a.lastMark[e*2],r-a.lastMark[e*2+1])<4?Math.hypot(t-a.lastMark[e*2],r-a.lastMark[e*2+1])>.6&&(this.mark(a.lastMark[e*2],a.lastMark[e*2+1],t,r,n.y+.05,.13),a.lastMark[e*2]=t,a.lastMark[e*2+1]=r):((a.lastMark||=[void 0,void 0,void 0,void 0])[e*2]=t,a.lastMark[e*2+1]=r)}else a.lastMark&&(a.lastMark[0]=a.lastMark[2]=void 0)}};function pp(e,t){let n=_u(e),r=new Float32Array(n*6),i=new Float32Array(n*8),a=new Uint16Array((n-1)*6);for(let e=0;e<n-1;e++){let t=e*2;a.set([t,t+1,t+2,t+1,t+3,t+2],e*6)}let o=new si;o.setAttribute(`position`,new Kr(r,3).setUsage(Ft)),o.setAttribute(`color`,new Kr(i,4).setUsage(Ft)),o.setIndex(new Kr(a,1));let s=new ji(o,new yi({vertexColors:!0,transparent:!0,depthWrite:!1,side:2,fog:!1,polygonOffset:!0,polygonOffsetFactor:-8,polygonOffsetUnits:-8}));s.frustumCulled=!1,s.renderOrder=3,s.visible=!1,s.name=`line-guide`;let c={enabled:!1,level:0,reds:0,yellows:0,greens:0,v:0,s:0};return{mesh:s,status:c,n,ahead:140,back:8,update(a,l,u){if(!s.visible)return;vu(e,t,a,l,u,r,i,n),o.attributes.position.needsUpdate=!0,o.attributes.color.needsUpdate=!0;let d=0,f=0,p=0;for(let e=0;e<n;e++){let t=e*8;i[t+3]<.3||(i[t]>.9&&i[t+1]<.5?d++:i[t]>.9?f++:p++)}c.reds=d,c.yellows=f,c.greens=p,c.v=l,c.s=a,c.level=d>2?2:+(f>2)},setEnabled(e){c.enabled=!!e,s.visible=!!e}}}function mp(e,t){let n=e.n,r=e.length,i=su(e,t).v,a=e.lineK,o=[],s=t=>e.sectionName((t%n+n)%n);for(let s=0;s<n;s++){let c=!0;for(let e=-14;e<=14&&c;e++){let t=i[(s+e+n)%n];(t<i[s]||t===i[s]&&e<0)&&(c=!1)}if(!c||i[s]>t.vTop*.66)continue;let l=0;for(let t=0;t<Math.floor(200/e.ds);t++)l=Math.max(l,i[(s-t+n)%n]);if(l-i[s]<22)continue;let u=s;for(;(s-u)*e.ds<90&&Math.abs(a[(u-1+n)%n])>Math.abs(a[s])*.3;)u--;o.push({i:s,e:u,sApex:s*e.ds,sEntry:(u*e.ds%r+r)%r})}let c=[];return o.forEach((t,i)=>{let l=o[(i-1+o.length)%o.length];if(o.length>1&&(t.sApex-l.sApex+r)%r<220)return;let u=a[t.i]>0?-1:1;for(let i of[100,50]){let a=((t.sEntry-i)%r+r)%r,o=Math.floor(a/e.ds)%n,l=u>0?e.leftWall[o]:e.rightWall[o];c.push({s:a,metres:i,side:u,d:u*(l+2.2),corner:s(t.i),apex:t.sApex})}}),c.sort((e,t)=>e.s-t.s)}function hp(e,t){let n=mp(e,t),r=new cf,i=[1,.82,.12],a=[.06,.06,.08],o=[.7,.7,.74];for(let t of n){let n=e.at(t.s,t.d),s=e.thetaAt(t.s)+Math.PI,c=Math.sin(s),l=Math.cos(s),u=(e,t,r)=>[n.x+l*e+c*r,n.y+t,n.z-c*e+l*r],d=1.7,f=(e,t,n,i,a)=>{let o=[u(...e),u(...t),u(...n),u(...i)];r.flatQuad(o[0],o[1],o[2],o[3],a,[c,0,l])};for(let e of[-.6,.6])f([e-.05,0,0],[e+.05,0,0],[e+.05,2,0],[e-.05,2,0],o),f([e-.05,0,-.01],[e+.05,0,-.01],[e+.05,2,-.01],[e-.05,2,-.01],o);f([-1.7/2,2,.02],[d/2,2,.02],[d/2,3.2,.02],[-1.7/2,3.2,.02],i),f([-1.7/2-.06,1.94,.01],[.9099999999999999,1.94,.01],[.9099999999999999,3.2+.06,.01],[-1.7/2-.06,3.2+.06,.01],a);let p=String(t.metres),m=p.length===3?.13:.17,h=-((p.length*3+(p.length-1))*m)/2,g=2+(1.2-5*m)/2;for(let e=0;e<p.length;e++){let t=Zd[p[e]];for(let n=0;n<5;n++)for(let r=0;r<3;r++)if(t[n*3+r]===`1`){let t=h+e*4*m+r*m,i=g+(4-n)*m;f([t,i,.03],[t+m,i,.03],[t+m,i+m,.03],[t,i+m,.03],a)}}}let s=new ji(r.geometry(),new yi({vertexColors:!0,side:2}));return s.name=`brake-boards`,s.frustumCulled=!1,{mesh:s,plan:n}}var gp=e=>()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296},_p=new Map,vp=e=>{if(typeof e!=`number`)return e;let t=_p.get(e);return t||(t=new q(e),_p.set(e,t)),t},yp=class{constructor(){this.p=[],this.c=[]}tri(e,t,n,r){r=vp(r),this.p.push(e[0],e[1],e[2],t[0],t[1],t[2],n[0],n[1],n[2]);for(let e=0;e<3;e++)this.c.push(r.r,r.g,r.b)}quad(e,t,n,r,i){this.tri(e,t,n,i),this.tri(e,n,r,i)}box(e,t,n,r,i,a,o,s,c=0){let l=Math.cos(o),u=-Math.sin(o),d=Math.sin(o),f=Math.cos(o),p=(o,s,c)=>[e+l*o*r/2+d*c*a/2,t+s*i/2,n+u*o*r/2+f*c*a/2],m=[p(-1,-1,-1),p(1,-1,-1),p(1,1,-1),p(-1,1,-1),p(-1,-1,1),p(1,-1,1),p(1,1,1),p(-1,1,1)];[[4,5,6,7],[1,0,3,2],[5,1,2,6],[0,4,7,3],[3,7,6,2],[0,1,5,4]].forEach((e,t)=>{c&1<<t||this.quad(m[e[0]],m[e[1]],m[e[2]],m[e[3]],typeof s==`function`?s(t):s)})}geometry(){let e=new si;return e.setAttribute(`position`,new Yr(this.p,3)),e.setAttribute(`color`,new Yr(this.c,3)),e.computeVertexNormals(),e}},bp=new An,xp=new sn,Sp=new G,Cp=new G(1,1,1),wp=new Bn;function Tp(e,t,n,r,i,a=0,o=1,s=1,c=1){let l=e.index?e.toNonIndexed():e.clone();bp.compose(Sp.set(t,n,r),xp.setFromEuler(wp.set(0,a,0)),Cp.set(o,s,c)),l.applyMatrix4(bp);let u=vp(i),d=l.attributes.position.count,f=new Float32Array(d*3);for(let e=0;e<d;e++)f[e*3]=u.r,f[e*3+1]=u.g,f[e*3+2]=u.b;return l.setAttribute(`color`,new Kr(f,3)),l.deleteAttribute(`uv`),l}function Ep(e,t,n,r){let i=new G().subVectors(t,e),a=new ca(n,i.length(),n).toNonIndexed();xp.setFromUnitVectors(Sp.set(0,1,0),i.normalize()),bp.compose(e.clone().add(t).multiplyScalar(.5),xp,Cp.set(1,1,1)),a.applyMatrix4(bp);let o=vp(r),s=a.attributes.position.count,c=new Float32Array(s*3);for(let e=0;e<s;e++)c[e*3]=o.r,c[e*3+1]=o.g,c[e*3+2]=o.b;return a.setAttribute(`color`,new Kr(c,3)),a.deleteAttribute(`uv`),a}var Dp=new ca(1,1,1),Op=[[`VOLTRIX`,`#e8362b`,`#ffffff`],[`NOVAFUEL`,`#ffd21f`,`#1b1b2a`],[`KRYTON TIRES`,`#15151c`,`#ffd21f`],[`ZENTRA BANK`,`#1f5fd0`,`#ffffff`],[`BLAZEO`,`#ff8a1f`,`#ffffff`],[`MOCHAMAX`,`#6b3b20`,`#ffe9c4`],[`QUBITEL`,`#7a3fd0`,`#e8ffe0`],[`SKYPLUM AIR`,`#1fb6d6`,`#06223a`]];function kp(e){let[t,n,r]=Op[e%Op.length],i=document.createElement(`canvas`);i.width=256,i.height=80;let a=i.getContext(`2d`);a.fillStyle=n,a.fillRect(0,0,256,80),a.fillStyle=r,a.fillRect(0,0,256,6),a.fillRect(0,74,256,6);for(let e=0;e<6;e++)a.fillRect(8+e*12,14,7,7);a.font=`bold 40px "Courier New", monospace`,a.textAlign=`center`,a.textBaseline=`middle`;let o=40;for(a.font=`bold ${o}px "Courier New", monospace`;a.measureText(t).width>236&&o>14;)o-=2,a.font=`bold ${o}px "Courier New", monospace`;a.fillText(t,128,46);let s=new ia(i);return s.magFilter=ge,s.minFilter=ye,s.generateMipmaps=!1,s.colorSpace=kt,s}var Ap=(e,t,n,r=0)=>[e.px[t]+e.nx[t]*n,e.py[t]+r,e.pz[t]+e.nz[t]*n];function jp(e,t,n){let r=t.n;for(let i=0;i<r;i++){let a=(i+1)%r,o=n(i),s=n(a);if(!o||!s)continue;let c=o[3];e.tri(Ap(t,i,o[0],o[2]),Ap(t,a,s[0],s[2]),Ap(t,i,o[1],o[2]),c),e.tri(Ap(t,i,o[1],o[2]),Ap(t,a,s[0],s[2]),Ap(t,a,s[1],s[2]),c)}}function Mp(e,t,n){let r=t.n;for(let i=0;i<r;i++){let a=(i+1)%r,o=n(i),s=n(a);o&&s&&(e.quad(Ap(t,i,o.d,o.y0),Ap(t,a,s.d,s.y0),Ap(t,a,s.d,s.y1),Ap(t,i,o.d,o.y1),o.col),o.cap&&e.quad(Ap(t,i,o.d,o.y1),Ap(t,a,s.d,s.y1),Ap(t,a,s.d+o.cap,s.y1),Ap(t,i,o.d+o.cap,o.y1),o.capCol))}}var Np={name:`circuitDay`,sky:{top:3111120,bot:12903679,rainTop:6257302,rainBot:11123403,sunGlow:1},fog:[120,780],sun:{color:16773590,intensity:2.9,dir:[-.55,.75,.45],rainColor:11124184,rainIntensity:1.5},hemi:{sky:13625087,ground:5999173,intensity:.95},ground:{g1:7327804,g2:6012210,far:4168240,rock:10130556,amp:24,rockFrom:14},gravel:[14467978,13743995],trees:`temperate`,clouds:!0,night:!1,landmark:`ferris`,sea:null,fx:{sat:1,tint:[1,1,1]}},Pp=(e,t={})=>{let n={...e};for(let[r,i]of Object.entries(t))n[r]=i&&typeof i==`object`&&!Array.isArray(i)&&typeof i!=`function`&&e[r]&&typeof e[r]==`object`&&!Array.isArray(e[r])?{...e[r],...i}:i;return n};function Fp(r){let i=Pp(Np,r),a=new ir,o=[],s=null,c=null,l=null,u=null,d=null,f=null,p=[],m=null,h=null,g={rain:0,wet:0},_={},v={rain:0,sat:1,tint:[1,1,1],time:0,lift:0},y={fogNear:120,fogFar:780},b=2,x=2048,S=null,C=null,w=null,T=null,E=[],D=null,O=null,k=null,A=[],j=null,ee=null,M=null,N=null,P=[],F=[],te=(e,t,n=0)=>!F.some(r=>(r.x-e)**2+(r.z-t)**2<(r.r+n)**2),ne=(e,t,n)=>F.push({x:e,z:t,r:n}),re=[],ie=1.2,ae=(e,t,n,r,i,a=4)=>{let o=Math.cos(i),s=-Math.sin(i),c=Math.sin(i),l=Math.cos(i),u=[],d=Math.max(1,Math.ceil(n/a)),f=Math.max(1,Math.ceil(r/a));for(let i=0;i<=d;i++)for(let a=0;a<=f;a++){if(i>0&&i<d&&a>0&&a<f)continue;let p=(i/d-.5)*n,m=(a/f-.5)*r;u.push([e+o*p+c*m,t+s*p+l*m])}return u},oe={hi:0,lo:0},se=(e,t,n,r,i)=>{let a=n==null?[[e,t],[e+r,t],[e-r,t],[e,t+r],[e,t-r]]:ae(e,t,n,r,i).concat([[e,t]]),o=-1e9,s=1e9;for(let e of a){let t=_e(e[0],e[1]);t>o&&(o=t),t<s&&(s=t)}return{hi:o,lo:s}},ce=(e,t,n,r,i,a=0,o=0)=>{let s=r==null?c.clearance(t,n)>=i+ie+o:ae(t,n,r,i,a).every(e=>c.clearance(e[0],e[1])>=ie+o);return s&&(oe=se(t,n,r,i,a),re.push(r==null?{kind:e,x:t,z:n,r:i,y:oe.hi,lo:oe.lo}:{kind:e,x:t,z:n,w:r,l:i,yaw:a,y:oe.hi,lo:oe.lo})),s},le=(e,t,n,r,i,a,o)=>{let s=oe,c=s.hi-s.lo+.8;c>.9&&e.box(t,s.lo-.8+c/2,n,r,c,i,a,o)},ue=(e={})=>new Ia({vertexColors:!0,flatShading:!0,side:2,...e}),I=e=>(o.push(e),e),de=(e,t,n,r=!1,i=!0)=>{let o=new ji(I(e.geometry()),t);return o.name=n,o.matrixAutoUpdate=!1,o.updateMatrix(),o.castShadow=r,o.receiveShadow=i,a.add(o),o},fe=(e,t,n=0)=>{let r=c.at(e,t);return r.y+=n,[r.x,r.y,r.z]};function pe(t,n,r){let i=c,a=i.n,o=0xde0b6b3a7640000,s=0;for(let e=0;e<a;e+=3){let r=t-i.px[e],a=n-i.pz[e],c=r*r+a*a;c<o&&(o=c,s=e)}let l=s;for(let e=-3;e<=3;e++){let r=(l+e+a)%a,c=t-i.px[r],u=n-i.pz[r],d=c*c+u*u;d<o&&(o=d,s=r)}let u=t-i.px[s],d=n-i.pz[s],f=u*i.tx[s]+d*i.tz[s],p=(i.py[(s+1)%a]-i.py[(s-1+a)%a])/(2*i.ds);return r.i=s,r.y=i.py[s]+e(f,-i.ds,i.ds)*p,r.dist=Math.sqrt(o),r.d=u*i.nx[s]+d*i.nz[s],r.s=s*i.ds+f,r}let me={};function he(e,r,a=me){let o=c;pe(e,r,a);let s=a.dist-o.half[a.i];a.e=s;let l=i.ground.amp*n(110,340,s),u=(Math.sin(e*.011+1.3)*Math.cos(r*.013+.4)*.5+Math.sin(e*.027+r*.019)*.28+Math.sin(r*.045-e*.03)*.12+.3)*l+Math.sin(e*.09)*Math.cos(r*.08)*1.2*n(40,100,s),d=t(a.y-.15-.45*(1-n(10,26,s)),u,n(24,100,s));if(!i.sea)return d;let f=i.sea.mask(e,r)*n(28,70,s);return t(d,i.sea.level-7,f)}function ge(e,t){return c.clearance(e,t)}function _e(e,t){return he(e,t,{})}function ve(e,r){s=e,c=r;let o=r,v=o.n,y=o.length,j=gp(r.seed??7);m=s.fog,h=s.background,s.background=new q(i.sky.bot),s.fog=new fr(i.sky.bot,i.fog[0],i.fog[1]),f=new oo(i.hemi.sky,i.hemi.ground,i.hemi.intensity),d=new So(i.sun.color,i.sun.intensity),d.userData.dir=new G(...i.sun.dir).normalize(),d.position.copy(d.userData.dir).multiplyScalar(260),d.castShadow=!0,d.shadow.mapSize.set(x,x),Object.assign(d.shadow.camera,{near:20,far:640,left:-90,right:90,top:90,bottom:-90}),d.shadow.bias=-6e-4,d.shadow.normalBias=.35,a.add(f,d,d.target),_.asphalt=I(new Fa({vertexColors:!0,flatShading:!0,side:2,specular:0,shininess:55})),_.terrain=I(ue()),_.deco=I(ue()),_.pit=I(new Fa({vertexColors:!0,flatShading:!0,side:2,specular:0,shininess:55,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),_.decal=I(ue({polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),_.decal2=I(ue({polygonOffset:!0,polygonOffsetFactor:-5,polygonOffsetUnits:-5})),_.gravel=I(ue()),_.cloud=I(new yi({vertexColors:!0,fog:!1})),_.tire=I(new Ia({flatShading:!0})),_.ao=I(new yi({color:0,transparent:!0,opacity:.34,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6,side:2,forceSinglePass:!0})),_.aoInst=I(_.ao.clone()),_.foliage=I(new Ia({flatShading:!0})),_.trunk=I(new Ia({color:6964262,flatShading:!0}));let ee=new yp,M=(e,t,n,r,i,a,o=1.6)=>{let s=Math.cos(a),c=-Math.sin(a),l=Math.sin(a),u=Math.cos(a),d=r/2+o,f=i/2+o,p=(r,i)=>[e+s*r+l*i,t+.07,n+c*r+u*i];ee.quad(p(-d,-f),p(d,-f),p(d,f),p(-d,f),0)},N=I(new Na({side:1,depthWrite:!1,fog:!1,uniforms:{top:{value:new q(i.sky.top)},bot:{value:new q(i.sky.bot)},sunDir:{value:d.userData.dir.clone()},sunAmt:{value:i.sky.sunGlow}},vertexShader:`varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,fragmentShader:`uniform vec3 top; uniform vec3 bot; uniform vec3 sunDir; uniform float sunAmt; varying vec3 vD; void main(){ float h = clamp(vD.y*1.6+0.05,0.0,1.0); vec3 c = mix(bot, top, pow(h,0.7)); float s = max(dot(normalize(vD), sunDir),0.0); c += vec3(1.0,0.9,0.6)*(pow(s,600.0)*2.0 + pow(s,12.0)*0.25)*sunAmt; gl_FragColor = vec4(c,1.0); }`}));l=new ji(I(new wa(1e3,16,10)),N),l.renderOrder=-10,l.frustumCulled=!1,a.add(l);{let e=new Float32Array(115173),t=new Float32Array(115173),r={},o=vp(i.ground.g1),s=vp(i.ground.g2),c=vp(i.ground.far),l=vp(i.ground.rock),u=new q,d=i.sea?vp(i.sea.sand):null;for(let a=0;a<191;a++)for(let f=0;f<201;f++){let p=-760+f*8,m=-520+a*8,h=a*201+f,g=he(p,m,r),_=r.e;e[h*3]=p,e[h*3+1]=g,e[h*3+2]=m;let v=Math.floor(r.s/(y/(2*Math.round(y/36))))&1;u.copy(v?o:s).lerp(c,n(60,240,_)),u.lerp(l,n(i.ground.rockFrom,i.ground.rockFrom+22,g)*.8),d&&u.lerp(d,n(i.sea.level+3.5,i.sea.level+.5,g)*n(20,34,_)),t[h*3]=u.r,t[h*3+1]=u.g,t[h*3+2]=u.b}let f=[];for(let e=0;e<190;e++)for(let t=0;t<200;t++){let n=e*201+t,r=n+1,i=n+201,a=i+1;f.push(n,i,r,r,i,a)}let p=I(new si);p.setAttribute(`position`,new Kr(e,3)),p.setAttribute(`color`,new Kr(t,3)),p.setIndex(f),p.computeVertexNormals();let m=new ji(p,_.terrain);m.name=`terrain`,m.frustumCulled=!1,m.receiveShadow=!0,a.add(m)}let P=new yp,F=new yp,ae=new yp,se=new yp,pe=new yp,ve=new yp,ye=vp(2895670),be=vp(3290429),xe=vp(2303532);jp(P,o,e=>[-o.half[e],o.half[e],0,e>>3&1?ye:be]),jp(F,o,e=>o.pitTaper[e]>.02?[o.half[e],o.half[e]+16*o.pitTaper[e],0,xe]:null);let Se=vp(16448250),Ce=vp(16765471),L=vp(15083039);for(let e of[1,-1])jp(ae,o,t=>e>0&&o.pitTaper[t]>.5?null:e>0?[o.half[t]-.8,o.half[t]-.2,.045,Se]:[-o.half[t]+.2,-o.half[t]+.8,.045,Se]);jp(ae,o,e=>o.pitTaper[e]>.5?[o.half[e]+.1,o.half[e]+.7,.045,Se]:null),jp(ae,o,e=>o.pitTaper[e]>.5?[o.half[e]+.1+4.5+3.3,o.half[e]+.1+4.5+3.9,.045,Ce]:null);for(let e of[1,-1])jp(pe,o,t=>{if(!o.kerb[t]||e>0&&o.pitTaper[t]>.02)return null;let n=(t|0)&1?L:Se,r=o.half[t],i=Math.min(1.6,(e>0?o.runL[t]:o.runR[t])-.15);return i<.2?null:e>0?[r,r+i,.03,n]:[-r-i,-r,.03,n]}),jp(ve,o,t=>{if(!o.gravel[t]||e>0&&o.pitTaper[t]>.02)return null;let n=o.half[t]+1.6,r=o.half[t]+(e>0?o.runL[t]:o.runR[t]);if(r<n+.3)return null;let a=t>>2&1?vp(i.gravel[0]):vp(i.gravel[1]);return e>0?[n,r,-.03,a]:[-r,-n,-.03,a]});for(let e=0;e<2;e++)for(let t=-9;t<9;t++){let n=-.6+e*.6,r=t+e&1?1118481:16316664;se.quad(fe(n,t,.045),fe(n+.6,t,.045),fe(n+.6,t+1,.045),fe(n,t+1,.045),r)}for(let e=0;e<10;e++){let t=Math.floor(e/2),n=e%2,r=y-10-t*9-n*4.5,i=n?-3.2:3.2,a=r+3;ae.quad(fe(a,i-1.3,.05),fe(a+.6,i-1.3,.05),fe(a+.6,i+1.3,.05),fe(a,i+1.3,.05),Se);for(let e of[-1.3,1.3])ae.quad(fe(a-1.5,i+e-.25,.05),fe(a,i+e-.25,.05),fe(a,i+e+.25,.05),fe(a-1.5,i+e+.25,.05),Se)}for(let e=0;e<10;e++){let t=(o.boxU(e)%y+y)%y,n=o.halfAt(t);for(let e of[-6.5,6.5])ae.quad(fe(t+e-.3,n+8,.05),fe(t+e+.3,n+8,.05),fe(t+e+.3,n+16,.05),fe(t+e-.3,n+16,.05),Se);let r=od[e].c1;ae.quad(fe(t-5,n+10.2,.04),fe(t+5,n+10.2,.04),fe(t+5,n+12.8,.04),fe(t-5,n+12.8,.04),r)}de(P,_.asphalt,`asphalt`),de(F,_.pit,`pitlane`),de(ae,_.decal,`markings`),de(se,_.decal2,`startline`).renderOrder=1,de(pe,_.decal,`kerbs`),de(ve,_.gravel,`gravel`);let we=new yp,Te=[vp(15790316),vp(14474454)],Ee=[vp(9078397),vp(7828331),vp(9670276),vp(7104608)],R=vp(10657170);for(let e of[1,-1])Mp(we,o,r=>{if(e>0&&o.pitTaper[r]>.02)return null;let i=e>0?o.leftWall[r]:o.rightWall[r],a=o.runoff[r]<6,s=a?t(1.1,3.2,n(6,2,o.runoff[r])):1.1,c=a?Ee[((r>>1)+(Math.floor(s)&1)*2+r*7%3)%4]:Te[r>>2&1];return{d:e*i,y0:0,y1:s,col:c,cap:a?e*1:e*.4,capCol:a?R:vp(10132120)}}),jp(ee,o,t=>{if(e>0&&o.pitTaper[t]>.02)return null;let n=e>0?o.leftWall[t]:o.rightWall[t];return e>0?[n-1.8,n,.06,0]:[-n,-n+1.8,.06,0]});de(we,_.deco,`walls`,!0,!0);{let e=[];for(let n=0;n<v;n+=1){if(!o.kerb[n]||o.runoff[n]<8)continue;let r=o.kappaS[n]>0?-1:1;if(r>0&&o.pitTaper[n]>.02)continue;let i=r>0?o.leftWall[n]:o.rightWall[n];for(let a=0;a<2;a++){let s=(n+1)%v,c=a*.5,l=t(o.px[n]+o.nx[n]*r*(i-.6),o.px[s]+o.nx[s]*r*(i-.6),c),u=t(o.pz[n]+o.nz[n]*r*(i-.6),o.pz[s]+o.nz[s]*r*(i-.6),c);e.push([l,t(o.py[n],o.py[s],c),u,n*2+a])}}let n=new Ui(I(new ua(.58,.58,.5,8)),_.tire,e.length*3),r=new An,i=new q,s=[16119285,15083039,2763312,2763312];e.forEach(([e,t,a,o],c)=>{for(let l=0;l<3;l++)r.makeTranslation(e,t+.25+l*.5,a),n.setMatrixAt(c*3+l,r),n.setColorAt(c*3+l,i.setHex(s[(o+l)%4]))}),n.frustumCulled=!1,n.castShadow=!0,n.receiveShadow=!0,a.add(n)}let z=new yp,De=[15223370,3899350,15913034,16250871,4899450,10181078,16751164,2961210,16736162,3526864],Oe=[15845792,14262899,11038794,8014381],ke=[],Ae=[];{let e=o.halfAt(0),t=o.thetaAt(0),n=7173248;for(let r of[1,-1]){let i=o.at(0,r*(e+2.5));z.box(i.x,i.y+5,i.z,1.6,10,1.6,t,n)}let r=o.at(0,0);z.box(r.x,r.y+9.4,r.z,(e+2.5)*2+1.6,2.6,1.8,t,n),z.box(r.x,r.y+7.9,r.z,(e+2.5)*2,.5,1.2,t,15921906);for(let e=0;e<5;e++){let n=(e-2)*3,r=o.at(-1,n);z.box(r.x,r.y+9.6,r.z,2.6,2.2,.4,t,1842982);let i=I(new Sa(1.7,1.7)),s=I(new yi({color:3804170,fog:!1})),c=new ji(i,s);c.position.set(r.x,r.y+9.6,r.z),c.rotation.y=t+Math.PI;let l=new G(Math.sin(t),0,Math.cos(t));c.position.addScaledVector(l,-.22),a.add(c),p.push(s)}}function V(e,t,n,r,i){let a=1.15,s=o.at(e,t),c=o.thetaAt(e),l=Math.cos(c),u=-Math.sin(c),d=Math.sin(c),f=Math.cos(c),p=r*2;if(!ce(`stand`,s.x+l*(p/2+1)*i,s.z+u*(p/2+1)*i,p+5,n+3,c))return!1;s.y=oe.hi,le(z,s.x+l*(p/2+.5)*i,s.z+u*(p/2+.5)*i,p+5,n+3,c,9277593);let m=(e,t,n)=>[s.x+l*e*i+d*n,s.y+t,s.z+u*e*i+f*n];for(let e=0;e<r;e++){let t=e*2;z.box(s.x+l*(t+1)*i,s.y+(e+1)*a/2,s.z+u*(t+1)*i,2,(e+1)*a,n,c,e&1?12106434:10922160,48);for(let r=.5;r<n-.5;r+=1.05){if(j()<.07)continue;let i=m(t+1,(e+1)*a,r-n/2);ke.push([i[0],i[1],i[2],c,j()<.5?De[Math.floor(j()*De.length)]:De[(Math.floor(r/6)+e)%De.length],Oe[Math.floor(j()*Oe.length)]])}}let h=r*2,g=r*a+3.2,_=h*.4,v=h-_/2+1.2;z.box(s.x+l*v*i,s.y+g,s.z+u*v*i,_+2.6,.5,n+2,c,15658738),z.box(s.x+l*v*i,s.y+g+.4,s.z+u*v*i,_+2.6,.3,n+2.2,c,2912224,0);for(let e of[-n/2+1,0,n/2-1])z.box(s.x+l*(h+.5)*i+d*e,s.y+g/2,s.z+u*(h+.5)*i+f*e,.5,g,.5,c,5593702);for(let e=-n/2+4;e<n/2-4;e+=8){let t=od[Math.floor(j()*od.length)];z.box(s.x+l*-.3*i+d*e,s.y+1.6,s.z+u*-.3*i+f*e,.3,1.3,7,c,t.c1),z.box(s.x+l*-.35*i+d*e,s.y+1.6,s.z+u*-.35*i+f*e,.3,.4,7,c,t.c2)}let y=s.x+h/2*l*i,b=s.z+h/2*u*i;M(y,s.y,b,h+3,n+2,c,1.4),ne(y,b,n/2+h);for(let e=-n/2+3;e<n/2;e+=14)Ae.push([s.x+l*(h+1.2)*i+d*e,s.y+g+.5,s.z+u*(h+1.2)*i+f*e,c,j()]);return!0}V(-30,-(o.halfAt(0)+18),140,7,-1),V(60,-(o.halfAt(0)+18),70,5,-1);for(let[e,t,n]of[[600,1,60],[1470,-1,50]]){let r=Math.floor(e/o.ds)%v;for(let i of[14,20,28,40])if(V(e,t*((t>0?o.leftWall[r]:o.rightWall[r])+i),n,4,t))break}{let e=o.halfAt(0),t=e+19,n=o.at(-10,t+9),r=o.thetaAt(0);re.push({kind:`pitbuilding`,x:n.x,z:n.z,w:20,l:217,yaw:r,exempt:!0}),z.box(n.x,n.y+3,n.z,18,6,215,r,15790320),z.box(n.x,n.y+6.3,n.z,20,.6,217,r,3817808),M(n.x,n.y,n.z,20,217,r,2),ne(n.x,n.z,120);let i=o.at(-10,t+12);z.box(i.x,i.y+9.5,i.z,12,5,40,r,14541546),z.box(i.x,i.y+10,i.z,12.2,1.6,40.2,r,1911610),z.box(i.x,i.y+12.4,i.z,13,.5,42,r,4871528),z.box(i.x,i.y+12.8,i.z,13.2,.3,4,r,15083039),od.forEach((n,i)=>{let a=o.boxU(i),s=o.at(a,t-.15);z.box(s.x,s.y+1.9,s.z,.4,3.8,11.5,r,1316380),z.box(s.x,s.y+4.2,s.z,.5,.9,11.5,r,n.c1),z.box(s.x,s.y+4.9,s.z,.55,.3,11.5,r,n.c2);let c=o.at(a,e+12.5);z.box(c.x,c.y+.4,c.z,1.4,.8,1.4,r,n.c1);let l=o.at(a,t+9);z.box(l.x,l.y+7.2,l.z,3,1.4,4,r,12173e3),z.box(l.x,l.y+8.1,l.z,1.2,.4,1.2,r,n.c2),Ae.push([o.at(a,t-1).x,o.at(a,t-1).y+6.6,o.at(a,t-1).z,r,i/10])});for(let e=0;e<7;e++){let n=-80+e*38,i=o.at(n,t+32+e%2*8),a=od[e%od.length];ce(`tent`,i.x,i.z,10,15,r)&&(i.y=oe.hi,le(z,i.x,i.z,10,15,r,14343651),z.box(i.x,i.y+1.6,i.z,9,3.2,14,r,16053492),z.box(i.x,i.y+3.5,i.z,10,.8,15,r,a.c1),M(i.x,i.y,i.z,9,14,r,1.3))}let a=o.at(150,t+13);re.push({kind:`tower`,x:a.x,z:a.z,w:9,l:9,yaw:r,exempt:!0}),z.box(a.x,a.y+10,a.z,5,20,5,r,14343910),z.box(a.x,a.y+21,a.z,8,3.2,8,r,1911610),z.box(a.x,a.y+23,a.z,9,.7,9,r,15083039),M(a.x,a.y,a.z,8,8,r,1.4)}{let e=-1,t=0;for(let t=0;t<v;t++)if(o.sectionName(t)===`Citadel Squeeze`){e=t;break}if(e>=0){for(let n=e;n<v;n++)if(o.sectionName(n)!==`Citadel Squeeze`){t=n;break}let n=e*o.ds+18,r=o.thetaAt(n),i=o.halfAt(n)+1.1,a=i+2.5;for(let e of[1,-1])for(let t of[3.2,4.5,6,8,11]){let s=Math.max(e>0?o.leftWall[Math.floor(n/o.ds)%v]:o.rightWall[Math.floor(n/o.ds)%v],i)+t,c=o.at(n,e*s);if(ce(`gatehouse`,c.x,c.z,5,5,r)){a=Math.max(a,s),c.y=oe.hi,le(z,c.x,c.z,5,5,r,Ee[1]),z.box(c.x,c.y+6,c.z,5,12,5,r,Ee[0]);for(let e=-1;e<=1;e+=2)for(let t=-1;t<=1;t+=2)z.box(c.x+Math.cos(r)*e*1.9+Math.sin(r)*t*1.9,c.y+12.6,c.z-Math.sin(r)*e*1.9+Math.cos(r)*t*1.9,1.1,1.2,1.1,r,Ee[2]);break}}let s=o.at(n,0);z.box(s.x,s.y+10.6,s.z,a*2,2.4,4.4,r,Ee[1]),z.box(s.x,s.y+12.1,s.z,a*2,.7,4.8,r,Ee[3]);let c=Math.floor((e+t)/2),l=null;for(let e=-140;e<=140;e+=8)for(let t=-140;t<=140;t+=8){let n=o.px[c]+e,r=o.pz[c]+t,i=o.clearance(n,r),a=i-Math.hypot(e,t)*.08;i>=24&&(!l||a>l.score)&&(l={x:n,z:r,c:i,score:a})}if(l&&ce(`keep`,l.x,l.z,30,30,0)){let e={x:l.x,y:oe.hi,z:l.z};le(z,e.x,e.z,30,30,0,Ee[3]),z.box(e.x,e.y+8,e.z,22,16,22,0,Ee[0]),z.box(e.x,e.y+16.4,e.z,24,.8,24,0,Ee[2]),M(e.x,e.y,e.z,24,24,0,3),ne(e.x,e.z,36);for(let[t,n]of[[-1,-1],[-1,1],[1,-1],[1,1]]){let r=e.x+t*12,i=e.z+n*12;z.box(r,e.y+11,i,6,22,6,Math.PI/4,Ee[1]),z.box(r,e.y+22.5,i,7,1.2,7,Math.PI/4,Ee[3]),z.box(r,e.y+24.2,i,1.2,2.2,1.2,0,11550768),Ae.push([r,e.y+25.3,i,0,.05])}for(let t=-9;t<=9;t+=3)for(let n of[-1,1])z.box(e.x+n*11.6,e.y+17.4,e.z+t,1.4,1.4,1.4,0,Ee[3]),z.box(e.x+t,e.y+17.4,e.z+n*11.6,1.4,1.4,1.4,0,Ee[3]);for(let t=0;t<12;t++){let n=t/12*Math.PI*2,r=e.x+Math.cos(n)*26,i=e.z+Math.sin(n)*26,a=-n;if(!ce(`wallseg`,r,i,3,9,a))continue;let o=oe.hi,s=3+t%3*1.2,c=o-oe.lo+.8;z.box(r,o+s/2-c/2,i,3,s+c,9,a,Ee[t%4])}}}}for(let e=0;e<11;e++){let t=(e+.5)/11*y,n=Math.floor(t/o.ds)%v;if(o.pitTaper[n]>.02||t<330&&t>y-260)continue;let r=o.kappaS[n]>0?-1:1,i=(r>0?o.leftWall[n]:o.rightWall[n])+5.2;if(r>0&&o.pitTaper[n]>.02)continue;let a=o.at(t,r*i),s=o.thetaAt(t);ce(`marshal`,a.x,a.z,7,4,s)&&(a.y=oe.hi,le(z,a.x,a.z,7,4,s,14343651),z.box(a.x,a.y+1.1,a.z,2.4,2.2,2.2,s,16250871),z.box(a.x,a.y+2.35,a.z,3,.4,2.8,s,16742938),z.box(a.x-Math.cos(s)*r*2.2,a.y+.9,a.z+Math.sin(s)*r*2.2,.5,1.8,.5,s,16742938),z.box(a.x-Math.cos(s)*r*2.2,a.y+2.05,a.z+Math.sin(s)*r*2.2,.45,.45,.45,s,15845792),z.box(a.x-Math.cos(s)*r*2.9,a.y+1.7,a.z+Math.sin(s)*r*2.9,.3,.3,1.6,s,5593702),z.box(a.x-Math.cos(s)*r*2.9,a.y+2.3,a.z+Math.sin(s)*r*2.9,.3,.9,.9,s,16765471),M(a.x,a.y,a.z,2.4,2.2,s,.8),ne(a.x,a.z,5))}let H=[];{let e=0;for(let t=0;t<26&&e<16;t++){let n=(t+.3)*(y/26),r=Math.floor(n/o.ds)%v;if(o.pitTaper[r]>.02||o.runoff[r]<6)continue;let i=t&1?1:-1;if(i>0&&o.pitTaper[r]>.02)continue;let a=(i>0?o.leftWall[r]:o.rightWall[r])+5.5,s=o.at(n,i*a),c=o.thetaAt(n);if(!te(s.x,s.z,8))continue;let l=4.8,u=3.6;if(!ce(`billboard`,s.x,s.z,2,16,c))continue;s.y=oe.hi,le(z,s.x,s.z,2,16,c,5593702),z.box(s.x,s.y+u+l/2,s.z,.5,5.6,15.8,c,2106155);let d=[Math.sin(c),Math.cos(c)];for(let e of[-1,1])z.box(s.x+d[0]*e*(15/2-1.2),s.y+u/2,s.z+d[1]*e*(15/2-1.2),.6,u,.6,c,5593702);H.push({x:s.x,y:s.y+u+l/2,z:s.z,ry:c+(i>0?-Math.PI/2:Math.PI/2),w:15,h:l,id:e}),M(s.x,s.y,s.z,.6,15,c,.8),ne(s.x,s.z,10),e++}}de(z,_.deco,`props`,!0,!0);for(let e of H){let t=I(kp(e.id)),n=I(new Ia({map:t})),r=I(new Sa(e.w,e.h));for(let t of[0,1]){let i=new ji(r,n);i.position.set(e.x,e.y,e.z),i.rotation.y=e.ry+(t?Math.PI:0),i.translateZ(.3),i.castShadow=!1,i.receiveShadow=!0,a.add(i)}}{let e=new Ui(I(new ca(.62,.95,.5).translate(0,.47,0)),I(new Ia({flatShading:!0})),ke.length),t=new Ui(I(new ca(.4,.4,.4).translate(0,1.15,0)),I(new Ia({flatShading:!0})),ke.length),n=new An,r=new sn,i=new G(1,1,1),o=new G,s=new G(0,1,0),c=new q;ke.forEach(([a,l,u,d,f,p],m)=>{n.compose(o.set(a,l,u),r.setFromAxisAngle(s,d),i),e.setMatrixAt(m,n),t.setMatrixAt(m,n),e.setColorAt(m,c.setHex(f)),t.setColorAt(m,c.setHex(p))});for(let n of[e,t])n.frustumCulled=!1,n.castShadow=!0,n.receiveShadow=!0,a.add(n)}{for(let e=-90;e<150;e+=30){let t=o.at(e,-(o.halfAt(e)+o.runR[Math.floor((e%y+y)%y/o.ds)%v]+3.6));ce(`flag`,t.x,t.z,null,1.2)&&Ae.push([t.x,_e(t.x,t.z),t.z,o.thetaAt(e),j()])}let e=I(new ca(.4,9,.4).translate(0,4.5,0)),t=I(new ca(2.2,1.3,.25).translate(1.1,0,0)),n=new Ui(e,I(new Ia({color:14212066,flatShading:!0})),Ae.length);T=new Ui(t,I(new Ia({flatShading:!0,side:2})),Ae.length);let r=new An,i=new q,s=[15083039,16765471,2912224,16777215,3523690,16742938];E=Ae.map(([e,t,a,o,c],l)=>(n.setMatrixAt(l,r.makeTranslation(e,t,a)),T.setColorAt(l,i.setHex(s[Math.floor(c*997)%s.length])),{x:e,y:t+7.9,z:a,yaw:o+Math.PI/2,ph:c*6.28})),n.frustumCulled=!1,T.frustumCulled=!1,n.castShadow=!0,T.castShadow=!0,a.add(n,T)}let Me=(e,t)=>{if(t&&o.clearance(t[0],t[1])>=e+ie&&te(t[0],t[1],e))return t;let n=0,r=0;for(let e=0;e<v;e++)n+=o.px[e],r+=o.pz[e];n/=v,r/=v;let a=null;for(let t=-300;t<=300;t+=10)for(let s=-300;s<=300;s+=10){let c=n+t,l=r+s,u=o.clearance(c,l);if(u<e+ie+2||!te(c,l,e)||i.sea&&i.sea.mask(c,l)>.05)continue;let d=-Math.abs(u-e-12)-Math.hypot(t,s)*.05;(!a||d>a.sc)&&(a={x:c,z:l,sc:d})}return a&&[a.x,a.z]};if(i.landmark===`ferris`){let e=Me(35,[55,135])||[55,135],t=e[0],n=e[1],r=he(t,n,{}),i=r+27+6;ce(`ferris`,t,n,null,35),D=new ir,D.position.set(t,0,n),D.rotation.y=.55;let o=[],s=[],c=(e,t,n)=>new G(e,t,n);for(let e of[-1.4,1.4]){for(let t=0;t<24;t++){let n=t/24*Math.PI*2,r=(t+1)/24*Math.PI*2;o.push(Ep(c(Math.cos(n)*27,Math.sin(n)*27,e),c(Math.cos(r)*27,Math.sin(r)*27,e),.7,t&1?16250871:15083039)),o.push(Ep(c(Math.cos(n)*27*.55,Math.sin(n)*27*.55,e),c(Math.cos(r)*27*.55,Math.sin(r)*27*.55,e),.45,16765471))}for(let t=0;t<12;t++){let n=t/12*Math.PI*2;o.push(Ep(c(0,0,e),c(Math.cos(n)*27,Math.sin(n)*27,e),.4,16250871))}}o.push(Ep(c(0,0,-2.2),c(0,0,2.2),2.2,16765471));let l=new ji(I(wd(o)),I(new Ia({vertexColors:!0,flatShading:!0})));l.position.y=i,l.castShadow=!0,l.receiveShadow=!1,l.frustumCulled=!1,D.add(l),D.userData.wheel=l;for(let e of[-3.2,3.2])s.push(Ep(c(0,i,e*.7),c(-27*.55,r-.2,e*2.2),.9,2912224),Ep(c(0,i,e*.7),c(27*.55,r-.2,e*2.2),.9,2912224));s.push(Ep(c(-27*.55,r+.6,-7),c(-27*.55,r+.6,7),1,5593702),Ep(c(27*.55,r+.6,-7),c(27*.55,r+.6,7),1,5593702));let u=new ji(I(wd(s)),l.material);u.castShadow=!0,u.receiveShadow=!0,u.frustumCulled=!1,D.add(u);let d=wd([Tp(Dp,0,0,0,16777215,0,2.8,2,2.4),Tp(Dp,0,1.25,0,2238513,0,3.2,.5,2.8)]);O=new Ui(I(d),I(new Ia({flatShading:!0,vertexColors:!0})),16);let f=[15083039,16765471,2912224,3523690,16742938,16736162],p=new q;for(let e=0;e<16;e++)O.setColorAt(e,p.setHex(f[e%f.length]));O.userData={hubY:i,Rw:27,NG:16,rot:0},O.frustumCulled=!1,O.castShadow=!0,D.add(O),a.add(D),ne(t,n,45),M(t,r,n,3.8,18,.55+Math.PI/2,1.5),M(t,r,n,32,12,.55,2);let m=new yp;for(let e=0;e<5;e++){let r=t+Math.cos(e*1.3)*30+6,i=n+18+Math.sin(e*1.3)*10+e*3,a=he(r,i,{});ce(`stall`,r,i,null,3.5)&&(m.box(r,a+1.3,i,4,2.6,3,e,[15083039,16765471,2912224,3523690,16742938][e]),m.box(r,a+2.9,i,4.8,.5,3.8,e,16250871),M(r,a,i,4,3,e,.8))}de(m,_.deco,`stalls`,!0,!0)}if(i.landmark===`lighthouse`){let e=Me(12,i.lighthouseAt),t=new yp;if(e&&ce(`lighthouse`,e[0],e[1],null,12)){let[n,r]=e,o=oe.hi,s=[];for(let e=0;e<6;e++)s.push(Tp(new ua(3.4-e*.22,3.6-e*.22,34/6,10),n,o+(e+.5)*(34/6),r,e&1?15083039:16250871));s.push(Tp(new ua(3.4,3.4,.8,10),n,o+34+.4,r,2764086)),s.push(Tp(new ua(2.2,2.2,3,8),n,o+34+2.3,r,16773288)),s.push(Tp(new da(2.8,2.6,8),n,o+34+5.1,r,2764086));let c=new ji(I(wd(s)),I(new Ia({vertexColors:!0,flatShading:!0})));c.castShadow=!0,c.receiveShadow=!0,c.frustumCulled=!1,a.add(c),t.box(n+8,o+2,r+2,7,4,9,.3,15921126),t.box(n+8,o+4.6,r+2,8,1.2,10,.3,3824266),de(t,_.deco,`cottage`,!0,!0);let l=new ji(I(new da(4,60,6,1,!0).translate(0,-30,0).rotateZ(Math.PI/2)),I(new yi({color:16774336,transparent:!0,opacity:i.night?.22:.07,depthWrite:!1,side:2,fog:!1})));l.position.set(n,o+34+2.3,r),l.frustumCulled=!1,a.add(l),D=null,a.userData.beacon=l,M(n,o,r,8,8,0,2),ne(n,r,22)}}{let e=i.trees===`desert`?[[5212730,6134340,4160052,6987850],[9075258,10127944,7301684,11049560]]:i.trees===`coastal`?[[3119674,4175940,5820236,2326586],[5221962,7127642,3116868,9097322],[4171872,3119674,6275184,2064448]]:[[3119674,4175940,5820236,2326586],[4175940,8116554,13229626,3119674],[15911216,16243786,13229626,15247402],[15761450,14702122,16097850,15911216],[3119674,15911216,15761450,5820236]],t=[],n=(e,n,r,a)=>{if(e<-730||e>810||n<-490||n>970||!te(e,n,3)||ge(e,n)<7)return!1;let o=he(e,n,me);if(o>26||i.sea&&o<i.sea.level+1.2)return!1;let s=.8+j()*1.1;return ce(`tree`,e,n,null,2.6*s)?(t.push({x:e,y:o,z:n,s,kind:r,col:a[Math.floor(j()*a.length)],yaw:j()*6.28}),!0):!1},r=(t,r)=>{let a=e[Math.floor(j()*e.length)],o=i.trees===`desert`,s=(o?14:6)+j()*12,c=o?4+Math.floor(j()*7):14+Math.floor(j()*32),l=j()<.5,u=0;for(let e=0;e<c*2&&u<c;e++){let e=j()*6.28,i=Math.sqrt(j())*s;n(t+Math.cos(e)*i,r+Math.sin(e)*i,j()<(l?.8:.25)?0:1,a)&&u++}return u};for(let e=0,t=0;e<1500&&t<130;e++){let e=Math.floor(j()*v),n=j()<.5?1:-1,i=n*((n>0?o.leftWall[e]:o.rightWall[e])+11+j()*55),a=o.px[e]+o.nx[e]*i,s=o.pz[e]+o.nz[e]*i;!te(a,s,4)||ge(a,s)<9||r(a,s)&&t++}for(let e=0,t=0;e<900&&t<60;e++){let e=-710+j()*1500,n=-470+j()*1420;!te(e,n,4)||ge(e,n)<9||r(e,n)&&t++}let s=wd([Tp(new da(2.5,5,6),0,4.2,0,16777215),Tp(new da(1.9,4.2,6),0,7,0,16777215)]),c=wd([Tp(new xa(2.5,0),0,5.2,0,16777215,0,1,.9,1),Tp(new xa(1.7,0),1.3,4.2,.7,16777215)]),l=new ua(.35,.5,2.8,5).translate(0,1.4,0);if(i.trees===`desert`)s=wd([Tp(new ua(.75,.85,7,6),0,3.5,0,16777215),Tp(new ua(.5,.5,2.6,6),1.5,3.6,0,16777215),Tp(new ua(.45,.5,1.6,6),.9,2.5,0,16777215,0,1.8,.4,.9),Tp(new ua(.45,.45,2.2,6),-1.4,4.4,0,16777215),Tp(new ua(.4,.45,1.4,6),-.8,3.5,0,16777215,0,1.6,.4,.9)]),c=wd([Tp(new xa(1.6,0),0,.9,0,16777215,0,1.3,.6,1.2),Tp(new xa(1.1,0),1.2,.7,.6,16777215,0,1,.6,1)]),l=new ua(.01,.01,.01,3);else if(i.trees===`coastal`){let e=[];for(let t=0;t<6;t++){let n=t/6*Math.PI*2;e.push(Tp(Dp,Math.cos(n)*1.9,8.6,Math.sin(n)*1.9,16777215,-n,3.6,.25,1.1))}s=wd([...e,Tp(new xa(.9,0),0,9,0,16777215)]),l=wd([new ua(.28,.42,4.6,5).translate(0,2.3,0),new ua(.22,.3,4.4,5).translate(.35,6.7,0)].map(e=>(e.deleteAttribute(`uv`),e)))}let u=new la(2.8,8).rotateX(-Math.PI/2),d=[{g:s},{g:c}],f=new An,p=new sn,m=new G,h=new G,g=new G(0,1,0),y=new q;d.forEach((e,n)=>{let r=t.filter(e=>e.kind===n),i=new Ui(I(e.g),_.foliage,r.length||1),o=new Ui(I(l),_.trunk,r.length||1),s=new Ui(I(u),_.aoInst,r.length||1);r.forEach((e,t)=>{f.compose(m.set(e.x,e.y,e.z),p.setFromAxisAngle(g,e.yaw),h.set(e.s,e.s*(.9+t%5*.06),e.s)),i.setMatrixAt(t,f),o.setMatrixAt(t,f),i.setColorAt(t,y.setHex(e.col).offsetHSL(0,0,(j()-.5)*.06)),f.compose(m.set(e.x+.8*e.s,e.y+.18,e.z+.6*e.s),p.identity(),h.set(e.s,1,e.s)),s.setMatrixAt(t,f)}),i.count=o.count=s.count=r.length;for(let e of[i,o])e.frustumCulled=!1,e.castShadow=!0,e.receiveShadow=!0,a.add(e);s.frustumCulled=!1,s.renderOrder=1,a.add(s),e.meshes=[i,o],e.n=r.length}),a.userData.trees=d}if(de(ee,_.ao,`ao`,!1,!1).renderOrder=1,i.clouds){let e=new yp;for(let t=0;t<16;t++){let t=(j()-.5)*1200+50,n=(j()-.5)*1e3+220,r=230+j()*90;for(let i=0;i<4;i++)e.box(t+(j()-.5)*50,r+(j()-.5)*6,n+(j()-.5)*30,25+j()*30,7+j()*5,18+j()*12,j()*3,i===0?16777215:15791354)}u=new ji(I(e.geometry()),_.cloud),u.frustumCulled=!1,a.add(u)}if(i.sea&&(i.sea.color=new q(i.sea.water),S=new ji(I(new Sa(4e3,4e3).rotateX(-Math.PI/2)),I(new Fa({color:i.sea.color,specular:6719658,shininess:60,flatShading:!0}))),S.position.y=i.sea.level,S.receiveShadow=!0,S.frustumCulled=!1,S.name=`sea`,a.add(S)),i.night){let e=[],t=[];for(let n=0;n<700;n++){let n=j()*2-1,r=j()*Math.PI*2,i=Math.abs(n)*.9+.08,a=Math.sqrt(1-i*i);e.push(Math.cos(r)*a*900,i*900,Math.sin(r)*a*900);let o=.55+j()*.45;t.push(o,o,o*(.9+j()*.1))}let n=I(new si);n.setAttribute(`position`,new Yr(e,3)),n.setAttribute(`color`,new Yr(t,3)),C=new ta(n,I(new Xi({size:2,sizeAttenuation:!1,vertexColors:!0,fog:!1,depthWrite:!1}))),C.frustumCulled=!1,C.renderOrder=-9,a.add(C);let r=new yp,i=[];for(let e=0,t=0;e<60&&t<34;e++){let n=(e+.5)*(y/60),a=Math.floor(n/o.ds)%v,s=e&1?1:-1;if(s>0&&o.pitTaper[a]>.02)continue;let c=(s>0?o.leftWall[a]:o.rightWall[a])+4,l=o.at(n,s*c),u=o.thetaAt(n);if(!te(l.x,l.z,2)||!ce(`floodlight`,l.x,l.z,null,1.2))continue;let d=oe.hi;r.box(l.x,d+9,l.z,.6,18,.6,u,7173248),r.box(l.x-Math.cos(u)*s*.6,d+18,l.z+Math.sin(u)*s*.6,.7,1.6,4.2,u,2764086),i.push([l.x-Math.cos(u)*s*1,d+18,l.z+Math.sin(u)*s*1,u]),ne(l.x,l.z,3),t++}de(r,_.deco,`floodmasts`,!0,!0),w=new Ui(Dp,I(new yi({color:16774872,fog:!1})),Math.max(1,i.length));let s=new An;i.forEach(([e,t,n,r],i)=>w.setMatrixAt(i,s.compose(Sp.set(e,t,n),xp.setFromEuler(wp.set(0,r,0)),Cp.set(.3,1.2,3.8)))),w.count=i.length,w.frustumCulled=!1,a.add(w)}k=new Ui(I(new Ca(.45,1,4,1).rotateX(-Math.PI/2)),I(new yi({color:15135487,transparent:!0,opacity:.8,depthWrite:!1,fog:!1})),320),k.frustumCulled=!1,k.visible=!1,k.count=0,k.userData.max=320;for(let e=0;e<320;e++)A.push({x:0,y:-999,z:0,age:j(),life:.35+j()*.3,size:.3+j()*.4});a.add(k),s.add(a),B(g);let Ne=I(new La),Pe=I(new La);a.traverse(e=>{e.isInstancedMesh&&e.castShadow&&(e.customDepthMaterial=e.instanceColor?Pe:Ne)}),je(b)}function ye(e){for(let e of[M,j,ee])e&&(a.remove(e),e.geometry.dispose?.());P=e.filter(Boolean);let t=P.length,n=[],r=[],i=4.2;for(let e=0;e<5;e++){let t=e/5*22,a=(e+1)/5*22,o=.7+t/22*i,s=.7+a/22*i,c=(1-e/5)**1.5,l=(1-(e+1)/5)**1.5,u=[-o,0,t],d=[o,0,t],f=[s,0,a],p=[-s,0,a];for(let[e,t]of[[u,c],[d,c],[f,l],[u,c],[f,l],[p,l]])n.push(e[0],e[1],e[2]),r.push(t*.32,t*.3,t*.2)}let o=new si;o.setAttribute(`position`,new Yr(n,3)),o.setAttribute(`color`,new Yr(r,3)),M=new Ui(o,new yi({vertexColors:!0,transparent:!0,blending:2,depthWrite:!1,fog:!1,side:2,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6}),t),M.frustumCulled=!1,M.visible=!1,M.renderOrder=2,j=new Ui(Dp,new yi({color:16774336,fog:!1}),t*2),ee=new Ui(Dp,new yi({color:16722458,fog:!1}),t*2);for(let e of[j,ee])e.frustumCulled=!1,e.visible=!1;a.add(M,j,ee)}let be=new An,xe=new An;function Se(e,t){if(M.visible=j.visible=ee.visible=e,e){M.material.color.setScalar(.35+.65*t),P.forEach((e,t)=>{e.pivot.updateWorldMatrix(!0,!1);let n=e.pivot.matrixWorld;M.setMatrixAt(t,be.copy(n).multiply(xe.makeTranslation(0,.1-e.pivot.position.y,3.1)));for(let[e,r]of[[0,-.36],[1,.36]])j.setMatrixAt(t*2+e,be.copy(n).multiply(xe.compose(Sp.set(r,.62,1.15),xp.identity(),Cp.set(.2,.16,.12)))),ee.setMatrixAt(t*2+e,be.copy(n).multiply(xe.compose(Sp.set(r*.6,.55,-2.4),xp.identity(),Cp.set(.18,.14,.1))))});for(let e of[M,j,ee])e.instanceMatrix.needsUpdate=!0}}let Ce=null,L=null,we=null;function Te(){if(N)return;let e=wd([Tp(new da(2.2,3.4,4).rotateX(Math.PI),0,1.7,0,16769354),Tp(Dp,0,5,0,16769354,0,1.5,3.2,1.5)]);L=new ji(I(e),I(new yi({vertexColors:!0,fog:!1}))),L.visible=!1,L.frustumCulled=!1,L.renderOrder=5,a.add(L);let t=wd([Tp(Dp,0,0,5.3,16769354,0,11,.06,.6),Tp(Dp,0,0,-5.3,16769354,0,11,.06,.6),Tp(Dp,5.3,0,0,16769354,0,.6,.06,11),Tp(Dp,-5.3,0,0,16769354,0,.6,.06,11)]);we=new ji(I(t),I(new yi({vertexColors:!0,fog:!1}))),we.visible=!1,we.frustumCulled=!1,a.add(we);let n=(e,t)=>wd([Tp(Dp,0,.45,0,2237741,0,.55,.9,.35),Tp(Dp,0,1.15,0,e,0,.7,.8,.4),Tp(Dp,.45,1.2,0,t,0,.2,.7,.25),Tp(Dp,-.45,1.2,0,t,0,.2,.7,.25),Tp(Dp,0,1.85,0,16053492,0,.5,.45,.5)]),r=I(new Ia({vertexColors:!0,flatShading:!0})),i=od[0];N={group:new ir,people:[],tires:[],jacks:[],sign:null,teamMat:r,ready:!1};for(let e=0;e<7;e++){let e=new ji(I(n(i.c1,i.c2)),r);e.castShadow=!0,e.frustumCulled=!1,N.group.add(e),N.people.push(e)}for(let e=0;e<4;e++){let e=new ji(I(wd([Tp(new ua(.45,.45,.5,8).rotateZ(Math.PI/2),0,0,0,1710622),Tp(new ua(.47,.47,.12,8).rotateZ(Math.PI/2),0,0,0,16777215)])),I(new Ia({vertexColors:!0,flatShading:!0})));e.castShadow=!0,e.visible=!1,e.frustumCulled=!1,N.group.add(e),N.tires.push(e)}for(let e=0;e<2;e++){let e=new ji(I(wd([Tp(Dp,0,.25,0,16765471,0,.8,.5,.8),Tp(Dp,0,.9,0,5593702,0,.25,1,.25)])),I(new Ia({vertexColors:!0,flatShading:!0})));e.castShadow=!0,e.frustumCulled=!1,N.group.add(e),N.jacks.push(e)}let o=new ji(I(wd([Tp(Dp,0,1.4,0,5593702,0,.3,2.8,.3),Tp(Dp,0,2.9,0,16777215,0,1.3,1.3,.1)])),I(new yi({vertexColors:!0})));o.frustumCulled=!1,N.group.add(o),N.sign=o;let s=new ji(I(new ca(1,1,.14)),I(new yi({color:15083039})));s.position.set(0,2.9,.07),o.add(s),N.signLamp=s,N.group.visible=!1,a.add(N.group)}function Ee(e){Ce=e}let R=new G,z=(e,t,r)=>n(e,t,r);function De(e,n){Te();let r=Ce,i=c.length,a=!1,o=!1,s=0;if(r&&r.teamIndex!=null){let e=(c.boxU(r.teamIndex)%i+i)%i,l=Math.floor(e/c.ds)%c.n,u=c.boxD(l),d=c.at(e-.6,u),f=c.thetaAt(e-.6);a=r.request&&r.stage===0||r.stage===1||r.stage===2&&!r.choice;let p=r.car?Math.hypot(r.car.group.position.x-d.x,r.car.group.position.z-d.z):99;if(o=r.stage===1&&p<70||r.stage===2||r.stage===3&&p<16,we.visible=a||o,a){L.position.set(d.x,d.y+3.5+Math.sin(n*5)*.9,d.z),L.rotation.y=n*1.8,L.visible=!0;let e=1+.12*Math.sin(n*5);L.scale.setScalar(e)}else L.visible=!1;we.visible&&(we.position.set(d.x,d.y+.12,d.z),we.rotation.y=f,we.scale.setScalar(1+.04*Math.sin(n*6)));let m=d.x,h=d.y,g=d.z,_=f;r.car&&r.stage===2&&(m=r.car.group.position.x,h=r.car.group.position.y,g=r.car.group.position.z,_=r.car.group.rotation.y);let y=Math.cos(_),b=Math.sin(_),x=(e,t,n)=>n.set(m+y*e+b*t,h,g-b*e+y*t);if(N.group.visible=o,o){let e=r.choice&&r.serv||0,n=z(0,.35,e)*(1-z(2.05,2.4,e));s=.42*z(.25,.6,e)*(1-z(1.95,2.35,e));let i=r.stage!==2,a=r.colors||od[r.teamIndex%od.length],o=r.teamIndex+`:`+a.c1+`:`+a.c2;N.teamKey!==o&&(N.teamKey=o,N.people.forEach(e=>{e.geometry.dispose(),e.geometry=wd([Tp(Dp,0,.45,0,2237741,0,.55,.9,.35),Tp(Dp,0,1.15,0,a.c1,0,.7,.8,.4),Tp(Dp,.45,1.2,0,a.c2,0,.2,.7,.25),Tp(Dp,-.45,1.2,0,a.c2,0,.2,.7,.25),Tp(Dp,0,1.85,0,16053492,0,.5,.45,.5)])}));let c=[1.05,-1.05,1.15,-1.15],l=[1.9,1.9,-1.65,-1.65];for(let a=0;a<4;a++){let o=Math.sign(c[a]),s=[o*4.3,l[a]],u=[o*2.1,l[a]],d=t(s[0],u[0],n),f=t(s[1],u[1],n),p=N.people[a];x(d,f,R),p.position.copy(R),p.rotation.y=_+(o>0?-Math.PI/2:Math.PI/2),p.scale.y=1-.28*n+(n>.9?Math.sin(e*28+a)*.03:0);let m=N.tires[a],g=e<1.15?z(.6,1,e):1-z(1.2,1.7,e);m.visible=!i&&e>.6&&e<1.75,x(o*(1.1+g*1.7),l[a],R),m.position.copy(R).setY(h+.4+g*.35),m.rotation.y=_;let v=m.geometry.attributes.color,y=r.choice===`wet`?[.3,.65,1]:[1,.85,.2],b=e<1.15?[.6,.6,.6]:y;for(let e=v.count>>1;e<v.count;e++)v.setXYZ(e,b[0],b[1],b[2]);v.needsUpdate=!0}r.car&&r.car.wheels.forEach(t=>{t.visible=!(r.stage===2&&e>.65&&e<1.7)});let u=[4.7,-4.2];for(let e=0;e<2;e++){let r=N.people[4+e];x(0,t(u[e]*1.5,u[e],n)*1,R),r.position.copy(R),r.rotation.y=_+(e?0:Math.PI),r.scale.y=1-.18*n;let i=N.jacks[e];x(0,e?-2.3:3,R),i.position.copy(R),i.rotation.y=_,i.scale.y=.2+s*2.2,i.visible=s>.01}let d=N.people[6];x(-1.4,7.4,R),d.position.copy(R),d.rotation.y=_+Math.PI,d.scale.y=1,N.sign.position.copy(R).add(new G(0,.2,0)),N.sign.rotation.y=_,N.signLamp.material.color.setHex(e>2.1?3538784:15083039),N.sign.position.add(new G(Math.cos(_)*.9,0,-Math.sin(_)*.9)),v.signT=e}else r.car&&r.car.wheels.forEach(e=>{e.visible=!0})}else L.visible=!1,we.visible=!1,N.group.visible=!1;v.lift=s}let Oe=[new q(i.sky.top),new q(i.sky.rainTop)],ke=[new q(i.sky.bot),new q(i.sky.rainBot)],Ae=new q;function B(n){if(g.rain=e(n.rain??g.rain,0,1),g.wet=e(n.wetness??g.wet,0,1),!s)return;let r=g.rain,a=g.wet;l.material.uniforms.top.value.copy(Oe[0]).lerp(Oe[1],r),l.material.uniforms.bot.value.copy(ke[0]).lerp(ke[1],r),l.material.uniforms.sunAmt.value=i.sky.sunGlow*(1-r),s.fog.color.copy(l.material.uniforms.bot.value),s.background.copy(s.fog.color),y.fogNear=t(i.fog[0],i.fog[0]*.75,r),y.fogFar=t(i.fog[1],i.fog[1]*.77,r),d.intensity=t(i.sun.intensity,i.sun.rainIntensity,r),f.intensity=t(i.hemi.intensity,i.hemi.intensity*.84,r),d.color.setHex(i.sun.color).lerp(Ae.setHex(i.sun.rainColor),r),f.color.setHex(i.hemi.sky).lerp(Ae.setHex(9676480),r*(i.night?.3:1)),f.groundColor.setHex(i.hemi.ground).lerp(Ae.setHex(4151882),r*(i.night?.3:1)),_.asphalt.color.setRGB(1,1,1).lerp(Ae.setRGB(.75,.79,.86),a),_.asphalt.specular.setRGB(.55,.58,.65).multiplyScalar(a),_.pit.color.copy(_.asphalt.color),_.pit.specular.copy(_.asphalt.specular),_.terrain.color.setRGB(1,1,1).lerp(Ae.setRGB(.85,.9,.92),r),_.cloud.color.setRGB(1,1,1).lerp(Ae.setRGB(.75,.78,.82),r),_.gravel.color.setRGB(1,1,1).lerp(Ae.setRGB(.7,.7,.72),a),_.ao.opacity=_.aoInst.opacity=.34+.03*r;let o=i.fx.tint;v.rain=r,v.sat=i.fx.sat*(1-.3*r),v.tint=[o[0]*(1-.2*r),o[1]*(1-.13*r),o[2]*(1-.03*r)],k&&(k.visible=r>.03)}function je(t){if(b=e(Math.round(t),0,2),!s)return;let n=b>=2?2048:1024;d.castShadow=b>=1,n!==x&&(x=n,d.shadow.mapSize.set(n,n),d.shadow.map?.dispose(),d.shadow.map=null);let r=a.userData.trees||[];for(let e of r)for(let t of e.meshes)t.count=Math.floor(e.n*(b>=2?1:b===1?.7:.4));k&&(k.userData.cap=b>=2?k.userData.max:b===1?160:70)}let V=0,H=new G,Me=new G,Ne=new G,Pe=new G(0,1,0),Fe=new An,Ie=new G(1,1,1);function Le(t,r,o=null){if(!s)return;V+=t,v.time=V;let c=o||{x:r.position.x,y:0,z:r.position.z,half:90,dist:40};l.position.copy(r.position),u&&(u.rotation.y+=t*.004,u.visible=r.position.y<140),S&&(S.position.x=r.position.x,S.position.z=r.position.z,S.material.color.copy(i.sea.color).offsetHSL(0,0,Math.sin(V*.7)*.012)),C&&C.position.copy(r.position),a.userData.beacon&&(a.userData.beacon.rotation.y=V*.9),s.fog.near=y.fogNear+c.dist*.9,s.fog.far=y.fogFar+c.dist*1.6;{let e=c.half,t=e*2/x,n=d.userData.dir;Me.crossVectors(Pe,n).normalize(),Ne.crossVectors(n,Me);let r=Math.round((c.x*Me.x+c.y*Me.y+c.z*Me.z)/t)*t,i=Math.round((c.x*Ne.x+c.y*Ne.y+c.z*Ne.z)/t)*t,a=c.x*n.x+c.y*n.y+c.z*n.z;H.set(0,0,0).addScaledVector(Me,r).addScaledVector(Ne,i).addScaledVector(n,a),d.target.position.copy(H),d.position.copy(H).addScaledVector(n,300);let o=d.shadow.camera;o.right!==e&&(o.left=-e,o.right=e,o.top=e,o.bottom=-e,o.updateProjectionMatrix()),d.target.updateMatrixWorld()}for(let e=0;e<E.length;e++){let t=E[e];Fe.compose(Sp.set(t.x,t.y,t.z),xp.setFromEuler(wp.set(Math.sin(V*2.6+t.ph)*.12,t.yaw+Math.sin(V*2.1+t.ph)*.35,0)),Ie),T.setMatrixAt(e,Fe)}if(T.instanceMatrix.needsUpdate=!0,D){let e=O.userData;e.rot-=t*.045,D.userData.wheel.rotation.z=e.rot;for(let t=0;t<e.NG;t++){let n=e.rot+t/e.NG*Math.PI*2;O.setMatrixAt(t,Fe.makeTranslation(Math.cos(n)*e.Rw,e.hubY+Math.sin(n)*e.Rw-2,0))}O.instanceMatrix.needsUpdate=!0}if(k.visible){let r=Math.min(k.userData.cap??k.userData.max,Math.floor(k.userData.max*n(.03,.8,g.rain)));k.count=r;let i=e(c.dist*.55,22,90);for(let e=0;e<r;e++){let n=A[e];if(n.age+=t/n.life,n.age>=1){--n.age;let e=Math.random()*6.283,t=Math.sqrt(Math.random())*i;n.x=c.x+Math.cos(e)*t,n.z=c.z+Math.sin(e)*t*.8,n.y=he(n.x,n.z,me)+.14}let r=[.35,.65,.95,1.2][Math.min(3,Math.floor(n.age*4))]*n.size;Fe.compose(Sp.set(n.x,n.y,n.z),xp.identity(),Cp.set(r,1,r)),k.setMatrixAt(e,Fe)}k.instanceMatrix.needsUpdate=!0}M&&Se((i.night||g.rain>.05)&&P.length>0,i.night?1:n(.05,.4,g.rain)),De(t,V)}function Re(e,t=!1){p.forEach((n,r)=>n.color.setHex(t?3538784:r<e?16722458:3804170))}function ze(){s&&(s.remove(a),s.fog=m,s.background=h);for(let e of o)e.dispose?.();d?.shadow.map?.dispose(),a.clear(),p.length=0,o.length=0,re.length=0,s=null,N=null,E=[],A=[],F.length=0,S=C=w=u=D=O=T=k=M=j=ee=null,P=[],a.userData={}}return{name:i.name,style:i,group:a,placements:re,groundAt:_e,build:ve,dispose:ze,setWeather:B,update:Le,setStartLights:Re,setCars:ye,setPit:Ee,setQuality:je,fx:v,get quality(){return b}}}var Ip={name:`desertNight`,sky:{top:725555,bot:3812442,rainTop:1382956,rainBot:2894912,sunGlow:.25},fog:[150,860],sun:{color:11846399,intensity:1.7,dir:[.42,.78,-.32],rainColor:9082032,rainIntensity:1},hemi:{sky:9082064,ground:6965812,intensity:1.35},ground:{g1:13212250,g2:12751444,far:12027210,rock:10115642,amp:38,rockFrom:18},gravel:[14727288,13937516],trees:`desert`,clouds:!1,night:!0,landmark:`ferris`,fx:{sat:.95,tint:[.94,.96,1.08]}};function Lp(){return Fp(Ip)}var Rp={name:`coastal`,sky:{top:2787040,bot:13823231,rainTop:6257302,rainBot:11123403,sunGlow:1.1},fog:[140,900],sun:{color:16774366,intensity:3,dir:[.5,.78,.38]},hemi:{sky:14085375,ground:6986320,intensity:1},ground:{g1:8048712,g2:6864958,far:5217850,rock:11575424,amp:20,rockFrom:16},gravel:[15785130,15126682],trees:`coastal`,clouds:!0,landmark:`lighthouse`,lighthouseAt:[495,360],sea:{level:0,water:2789064,sand:15785130,mask:(e,t)=>Math.max(n(590,650,t),n(500,560,e))},fx:{sat:1.05,tint:[1,1,1]}};function zp(){return Fp(Rp)}var Bp={circuitDay:Fp,desertNight:Lp,coastal:zp};function Vp(e){return(Bp[e]||Fp)()}var Hp={radius:56,dead:.1,curve:1.4};function Up(e,t=Hp.radius,n=Hp.dead,r=Hp.curve){let i=Math.max(-1,Math.min(1,e/t)),a=Math.abs(i);return a<=n?0:Math.sign(i)*((a-n)/(1-n))**r}function Wp(e,t,n=Hp.radius){let r=Math.hypot(e,t);return r<=n?[e,t]:[e/r*n,t/r*n]}var Gp=class{constructor(e=document){this.keys=new Set,this.touch={gas:!1,brake:!1,boost:!1},this.actions=[],this.padPrev=[],this.out={steer:0,throttle:0,brake:0,boost:!1};let t=[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Space`],n=()=>{let e=document.activeElement;return!!e&&(e.tagName===`INPUT`||e.tagName===`TEXTAREA`||e.isContentEditable)};addEventListener(`keydown`,e=>{if(n()||e.repeat)return;this.keys.add(e.code),t.includes(e.code)&&e.preventDefault();let r={KeyC:`camera`,KeyT:`autopilot`,KeyM:`mute`,KeyP:`pit`,Digit1:`tire:dry`,Digit2:`tire:wet`,Escape:`pause`};r[e.code]&&this.actions.push(r[e.code])}),addEventListener(`keyup`,e=>this.keys.delete(e.code)),this.touch.steer=0,this.holds={},this.joyPointer=null;let r=()=>{this.keys.clear();for(let e in this.touch)this.touch[e]=e===`steer`&&0;for(let e in this.holds)this.holds[e].clear();e.querySelectorAll(`[data-hold].down`).forEach(e=>e.classList.remove(`down`)),this.joyPointer=null,this.joyHide?.()};this.releaseAll=r,addEventListener(`blur`,r),document.addEventListener(`visibilitychange`,()=>{document.hidden&&r()}),addEventListener(`pagehide`,r);let i=e=>e.preventDefault();for(let e of[`dblclick`,`gesturestart`,`gesturechange`,`gestureend`])document.addEventListener(e,i,{passive:!1});let a=0;document.addEventListener(`touchend`,e=>{let t=performance.now();t-a<350&&e.preventDefault(),a=t},{passive:!1}),document.addEventListener(`touchmove`,e=>{e.touches.length>1&&e.preventDefault()},{passive:!1}),document.addEventListener(`contextmenu`,e=>{e.target.closest?.(`#hud`)&&e.preventDefault()}),document.addEventListener(`click`,e=>{e.target.closest?.(`[data-tap]`)&&(e.detail!==0||performance.now()-this.lastTap<600)&&(e.preventDefault(),e.stopImmediatePropagation())},!0),this.lastTap=-1e9,e.querySelectorAll(`[data-hold]`).forEach(e=>{let t=e.dataset.hold,n=this.holds[t]=new Set,r=()=>{let r=n.size>0;this.touch[t]=r,e.classList.toggle(`down`,r)};e.addEventListener(`pointerdown`,t=>{t.preventDefault();try{e.setPointerCapture(t.pointerId)}catch{}n.add(t.pointerId),r()});for(let t of[`pointerup`,`pointercancel`,`lostpointercapture`])e.addEventListener(t,e=>{n.delete(e.pointerId),r()});e.addEventListener(`contextmenu`,e=>e.preventDefault())});let o=e.getElementById?.(`joyZone`)??e.querySelector(`#joyZone`),s=e.querySelector(`#joyBase`),c=e.querySelector(`#joyKnob`);if(o&&s&&c){let e=0,t=0;this.joyHide=()=>{s.classList.remove(`on`),c.style.transform=`translate(-50%,-50%)`,this.touch.steer=0};let n=n=>{let[r,i]=Wp(n.clientX-e,n.clientY-t,Hp.radius);c.style.transform=`translate(calc(-50% + ${r}px), calc(-50% + ${i}px))`,this.touch.steer=Up(n.clientX-e)};o.addEventListener(`pointerdown`,r=>{if(this.joyPointer!==null)return;r.preventDefault();try{o.setPointerCapture(r.pointerId)}catch{}this.joyPointer=r.pointerId;let i=o.getBoundingClientRect();e=Math.max(i.left+Hp.radius+6,Math.min(i.right-Hp.radius-6,r.clientX)),t=Math.max(Hp.radius+6,Math.min(innerHeight-Hp.radius-6,r.clientY)),s.style.left=e+`px`,s.style.top=t+`px`,s.classList.add(`on`),n(r)}),o.addEventListener(`pointermove`,e=>{e.pointerId===this.joyPointer&&n(e)});let r=e=>{e.pointerId===this.joyPointer&&(this.joyPointer=null,this.joyHide())};for(let e of[`pointerup`,`pointercancel`,`lostpointercapture`])o.addEventListener(e,r)}}onTap(e,t){if(!e)return;e.dataset.tap=`1`;let n=!1;e.addEventListener(`pointerdown`,e=>{n=!0,e.stopPropagation()}),e.addEventListener(`pointercancel`,()=>{n=!1}),e.addEventListener(`pointerleave`,()=>{n=!1}),e.addEventListener(`pointerup`,e=>{n&&(n=!1,e.preventDefault(),e.stopPropagation(),this.lastTap=performance.now(),t(e))}),e.addEventListener(`click`,e=>{e.detail===0&&performance.now()-this.lastTap>600&&t(e)})}poll(){let e=this.keys,t=this.touch,n=this.out,r=(e.has(`ArrowRight`)||e.has(`KeyD`)?1:0)-(e.has(`ArrowLeft`)||e.has(`KeyA`)?1:0);r+=t.steer||0;let i=e.has(`ArrowUp`)||e.has(`KeyW`)||t.gas?1:0,a=e.has(`ArrowDown`)||e.has(`KeyS`)||t.brake?1:0,o=e.has(`ShiftLeft`)||e.has(`ShiftRight`)||e.has(`KeyB`)||t.boost,s=navigator.getGamepads?navigator.getGamepads():[];for(let e of s){if(!e||!e.connected)continue;let t=e.axes[0]||0;Math.abs(t)>.12&&(r+=t),e.buttons[14]?.pressed&&--r,e.buttons[15]?.pressed&&(r+=1),i=Math.max(i,e.buttons[7]?.value||0,+!!e.buttons[0]?.pressed),a=Math.max(a,e.buttons[6]?.value||0,+!!e.buttons[1]?.pressed),o||=!!(e.buttons[5]?.pressed||e.buttons[2]?.pressed);let n=this.padPrev[e.index]||[],s=(t,r)=>{e.buttons[t]?.pressed&&!n[t]&&this.actions.push(r)};s(3,`camera`),s(4,`pit`),s(8,`autopilot`),s(9,`pause`),this.padPrev[e.index]=e.buttons.map(e=>e.pressed)}return n.steer=Math.max(-1,Math.min(1,r)),n.throttle=i,n.brake=a,n.boost=o,n}takeActions(){let e=this.actions;return this.actions=[],e}},Kp=e=>440*2**((e-69)/12),qp=[0,3,7,12,10,7,3,7,0,3,7,10,12,15,12,7],Jp=[0,0,-5,-5,-2,-2,-7,-7],Yp=e=>Math.max(0,Math.min(1,e));function Xp(e,t,n=0){let r=Yp(Math.max(0,e)/Math.max(1,t)),i=e=>((e+1)/7)**.85,a=0;for(;a<6&&r>=i(a);)a++;a<n&&r>i(n-1)-.06&&(a=n);let o=a?i(a-1):0,s=i(a),c=.3+.7*Yp((r-o)/(s-o));return{gear:a,rpm:a===0?.2+.8*Yp(r/s):c}}var Zp=class{constructor(){this.ctx=null,this.muted=localStorage.getItem(`racer-mute`)===`1`,this.step=0,this.music=!1}init(){if(this.ctx){this.ctx.resume?.();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=this.ctx=new e;this.master=t.createGain(),this.master.gain.value=this.muted?0:.5,this.master.connect(t.destination),this.eg=t.createGain(),this.eg.gain.value=0,this.ef=t.createBiquadFilter(),this.ef.type=`lowpass`,this.ef.frequency.value=900,this.o1=t.createOscillator(),this.o1.type=`sawtooth`,this.o2=t.createOscillator(),this.o2.type=`square`,this.o1.connect(this.ef),this.o2.connect(this.ef),this.ef.connect(this.eg),this.eg.connect(this.master),this.o1.start(),this.o2.start(),this._initFx(),this.mg=t.createGain(),this.mg.gain.value=.12,this.mg.connect(this.master),this.nextT=t.currentTime+.1,this.timer=setInterval(()=>this._music(),60)}setMuted(e){this.muted=e,localStorage.setItem(`racer-mute`,e?`1`:`0`),this.master&&this.master.gain.setTargetAtTime(e?0:.5,this.ctx.currentTime,.02)}_note(e,t,n,r,i){let a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type=r,a.frequency.value=e,o.gain.setValueAtTime(i,t),o.gain.exponentialRampToValueAtTime(1e-4,t+n),a.connect(o),o.connect(this.mg),a.start(t),a.stop(t+n+.02)}_music(){if(!this.ctx||!this.music){this.ctx&&(this.nextT=Math.max(this.nextT,this.ctx.currentTime));return}let e=60/150/2;for(;this.nextT<this.ctx.currentTime+.25;){let t=this.step++;this._note(Kp(69+qp[t%16]+(Math.floor(t/16)%2?5:0)),this.nextT,e*.9,`square`,.35),t%2==0&&this._note(Kp(45+Jp[t/2%8|0]),this.nextT,e*1.8,`triangle`,.9),this.nextT+=e}}_noise(){let e=this.ctx,t=e.createBuffer(1,e.sampleRate*2,e.sampleRate),n=t.getChannelData(0);for(let e=0;e<n.length;e++)n[e]=Math.random()*2-1;let r=e.createBufferSource();return r.buffer=t,r.loop=!0,r}_initFx(){let e=this.ctx;this.sq=e.createGain(),this.sq.gain.value=0,this.sqf=e.createBiquadFilter(),this.sqf.type=`bandpass`,this.sqf.frequency.value=2100,this.sqf.Q.value=6,this.nz1=this._noise(),this.nz1.connect(this.sqf),this.sqf.connect(this.sq),this.sq.connect(this.master),this.nz1.start(),this.kr=e.createGain(),this.kr.gain.value=0,this.krm=e.createGain(),this.krm.gain.value=.5,this.krl=e.createOscillator(),this.krl.type=`square`,this.krl.frequency.value=30;let t=e.createGain();t.gain.value=.5,this.krl.connect(t),t.connect(this.krm.gain);let n=e.createBiquadFilter();n.type=`lowpass`,n.frequency.value=260,this.nz2=this._noise(),this.nz2.connect(n),n.connect(this.krm),this.krm.connect(this.kr),this.kr.connect(this.master),this.nz2.start(),this.krl.start(),this.gear=0,this.shiftT=0,this.rpm=.2,this.lastRpm=.2}drive(e){if(!this.ctx)return;let t=this.ctx.currentTime,n=Math.max(.001,e.dt||1/60),r=Xp(e.v,e.vTop,this.gear);r.gear>this.gear&&(this.shiftT=.09,this.shiftBlip(r.gear)),this.gear=r.gear,this.shiftT=Math.max(0,this.shiftT-n);let i=Yp(r.rpm+(e.throttle>.1?.04:-.03));this.rpm=i;let a=38+i*150+(e.boosting?8:0);this.o1.frequency.setTargetAtTime(a,t,.03),this.o2.frequency.setTargetAtTime(a*.5,t,.03),this.ef.frequency.setTargetAtTime(450+i*1100+e.throttle*600,t,.06);let o=this.shiftT>0?.15:1;if(this.eg.gain.setTargetAtTime(e.on?(.08+e.throttle*.08+i*.03)*o:0,t,this.shiftT>0?.01:.08),!this.sq)return;let s=e.on?Math.min(1,Math.max(e.lat||0,(e.slip||0)*.7,(e.lock||0)*1.2)):0;this.sq.gain.setTargetAtTime(s*s*.07,t,.06),this.sqf.frequency.setTargetAtTime(1900+s*700+e.v*3,t,.1);let c=e.on&&e.kerb?Math.min(1,e.v/40):0;this.kr.gain.setTargetAtTime(c*.22,t,.04),this.krl.frequency.setTargetAtTime(14+e.v*.5,t,.1)}engine(e,t,n,r){this.drive({v:e,vTop:t,throttle:n,brake:0,lat:0,kerb:!1,on:r})}shiftBlip(){if(!this.ctx)return;let e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type=`square`,t.frequency.setValueAtTime(260,e),t.frequency.exponentialRampToValueAtTime(110,e+.07),n.gain.setValueAtTime(.05,e),n.gain.exponentialRampToValueAtTime(1e-4,e+.08),t.connect(n),n.connect(this.master),t.start(e),t.stop(e+.1)}beep(e=660,t=.15,n=`square`,r=.3){if(!this.ctx)return;let i=this.ctx.currentTime,a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type=n,a.frequency.value=e,o.gain.setValueAtTime(r,i),o.gain.exponentialRampToValueAtTime(1e-4,i+t),a.connect(o),o.connect(this.master),a.start(i),a.stop(i+t+.02)}thump(){if(!this.ctx)return;let e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type=`sawtooth`,t.frequency.setValueAtTime(140,e),t.frequency.exponentialRampToValueAtTime(40,e+.2),n.gain.setValueAtTime(.5,e),n.gain.exponentialRampToValueAtTime(1e-4,e+.25),t.connect(n),n.connect(this.master),t.start(e),t.stop(e+.3)}},Qp=[240,300,360],$p=e=>Qp[Math.max(0,Math.min(Qp.length-1,Math.round(e)))],em=e=>e>=1?4:0;function tm(e,t,n=1,r=240){let i=Math.max(1,Math.round(e*n)),a=Math.max(1,Math.round(t*n)),o=Math.max(1,Math.round(a/r)),s=Math.max(1,Math.floor(i/o)),c=Math.max(1,Math.floor(a/o)),l=s*o,u=c*o;return{W:i,H:a,k:o,lowW:s,lowH:c,vx:Math.floor((i-l)/2),vy:Math.floor((a-u)/2),vw:l,vh:u}}function nm(e,t,n){return 2*e*Math.tan(t*Math.PI/360)/n}function rm(e,t,n,r,i=[0,0,0]){if(!(r>0))return i[0]=e[0],i[1]=e[1],i[2]=e[2],i;let a=e[0]*t[0]+e[1]*t[1]+e[2]*t[2],o=e[0]*n[0]+e[1]*n[1]+e[2]*n[2],s=Math.round(a/r)*r-a,c=Math.round(o/r)*r-o;return i[0]=e[0]+t[0]*s+n[0]*c,i[1]=e[1]+t[1]*s+n[1]*c,i[2]=e[2]+t[2]*s+n[2]*c,i}var im=class{constructor(e=240){this.buf=new Float32Array(e),this.n=0,this.i=0,this.spikes=0,this.total=0,this.heapUp=0,this.heapFrames=0,this._heap=-1,this._sorted=new Float32Array(e)}add(e,t=-1){let n=this.n?this.mean():e;this.n>=30&&e>n*1.75&&e>20&&this.spikes++,this.buf[this.i]=e,this.i=(this.i+1)%this.buf.length,this.n<this.buf.length&&this.n++,this.total++,t>=0&&(this._heap>=0&&t>this._heap&&(this.heapUp+=t-this._heap),this._heap>=0&&this.heapFrames++,this._heap=t)}mean(){let e=0;for(let t=0;t<this.n;t++)e+=this.buf[t];return this.n?e/this.n:0}percentile(e){let t=this.n;if(!t)return 0;let n=this._sorted;for(let e=0;e<t;e++)n[e]=this.buf[e];return n.subarray(0,t).sort()[Math.min(t-1,Math.floor(e*t))]}reset(){this.n=0,this.i=0,this.spikes=0,this.total=0,this.heapUp=0,this.heapFrames=0,this._heap=-1}snapshot(){let e=this.mean();return{frames:this.n,avgMs:+e.toFixed(2),p95Ms:+this.percentile(.95).toFixed(2),maxMs:+this.percentile(1).toFixed(2),fps:e?+(1e3/e).toFixed(1):0,spikes:this.spikes,allocBytesPerFrame:this.heapFrames?Math.round(this.heapUp/this.heapFrames):-1}}},am=class{constructor(e=1/60,t=.0025){this.interval=e,this.slack=t,this.t=1/0}due(e){return this.t+=e,this.t>=this.interval-this.slack&&(this.t=Number.isFinite(this.t)?Math.min(this.t-this.interval,this.interval):0,!0)}force(){this.t=1/0}},om=1/60;function sm(e){let t=e._prev||={};return t.x=e.x,t.y=e.y,t.z=e.z,t.theta=e.theta,t.pitch=e.pose?e.pose.pitch:0,t.roll=e.pose?e.pose.roll:0,t.steer=e.steer||0,t.s=e.s||0,t.d=e.d||0,t}var cm=(e,t,n)=>e+(t-e)*n;function lm(e,t,n={},i=0){let a=e._prev;if(!a)return n.x=e.x,n.y=e.y,n.z=e.z,n.theta=e.theta,n.pitch=e.pose?e.pose.pitch:0,n.roll=e.pose?e.pose.roll:0,n.steer=e.steer||0,n.s=e.s||0,n.d=e.d||0,n;n.x=cm(a.x,e.x,t),n.y=cm(a.y,e.y,t),n.z=cm(a.z,e.z,t),n.theta=a.theta+r(e.theta-a.theta)*t;let o=e.pose?e.pose.pitch:0,s=e.pose?e.pose.roll:0;n.pitch=cm(a.pitch,o,t),n.roll=cm(a.roll,s,t),n.steer=cm(a.steer,e.steer||0,t);let c=(e.s||0)-a.s;return i>0&&(c-=Math.round(c/i)*i),n.s=a.s+c*t,n.d=cm(a.d,e.d||0,t),n}function um(e,t,n=om,r=5){e+=t;let i=0;for(;e>=n&&i<r;)e-=n,i++;return e>=n&&(e%=n),{n:i,acc:e}}var dm=class{constructor({level:e=2,min:t=0,max:n=2,lowFps:r=45,highFps:i=58,lowSecs:a=3,highSecs:o=10}={}){Object.assign(this,{level:e,min:t,max:n,lowFps:r,highFps:i,lowSecs:a,highSecs:o}),this.lowT=0,this.highT=0,this.fps=60}update(e,t){return this.fps=t,this.lowT=t<this.lowFps?this.lowT+e:0,this.highT=t>this.highFps?this.highT+e:0,this.lowT>=this.lowSecs&&this.level>this.min?(this.level--,this.lowT=this.highT=0,this.level):this.highT>=this.highSecs&&this.level<this.max?(this.level++,this.lowT=this.highT=0,this.level):(this.lowT>=this.lowSecs&&(this.lowT=0),this.highT>=this.highSecs&&(this.highT=0),null)}},fm=`drive-career-v1`,pm=`drive-garage-v1`,mm=[25,18,15,12,10,8,6,4,2,1],hm=e=>mm[e-1]||0,gm=[`engine`,`aero`,`brakes`,`tires`],_m=[4,6,8,10,12],vm={engine:{vTop:.008,accel:.01},aero:{down:.02},brakes:{brake:.015},tires:{wear:-.04}},ym={engine:`ENGINE`,aero:`AERO`,brakes:`BRAKES`,tires:`TIRES`},bm={engine:`Top speed and pull out of corners`,aero:`More grip through fast corners`,brakes:`Shorter stopping distance`,tires:`Tyres last longer`},xm=[8,7,6,5,5,4,4,3,3,2],Sm=`Casey Morrow`,Cm=(e,t,n,r)=>{let i=typeof e==`string`?parseInt(e,10):e;return Number.isFinite(i)?Math.min(n,Math.max(t,Math.round(i))):r};function wm(){return[[`quill`,`Mara Quill`,1,94],[`voss`,`Jonah Voss`,2,90],[`calder`,`Nia Calder`,3,86],[`hale`,`Soren Hale`,4,83],[`frost`,`Imani Frost`,5,80],[`bramble`,`Theo Bramble`,6,77],[`pell`,`Ren Pell`,7,74],[`march`,`Odette March`,8,71],[`lind`,`Casper Lind`,9,68]].map(([e,t,n,r])=>({id:e,name:t,number:Kd(n),teamIndex:n,rating:r}))}function Tm(){let e=od[0];return{driver:{name:Sm,number:1},team:zd({name:e.name,tag:e.tag,livery:{...Ld(),pattern:`chevrons`,c1:e.c1,c2:e.c2,number:1}})}}function Em(e){let t=Tm(),n=e&&typeof e==`object`?e:{},r=Fd(n.driver?.number??n.team?.livery?.number,t.driver.number),i=jd(n.driver?.name)||t.driver.name,a=zd({name:n.team?.name,tag:n.team?.tag,livery:{...n.team?.livery||{},number:r}},t.team.name);return{driver:{name:i,number:r},team:a}}function Dm(e){try{let t=e?.getItem(pm);return t?Em(JSON.parse(t)):Tm()}catch{return Tm()}}function Om(e,t){try{return e?.setItem(pm,JSON.stringify(Em(t))),!0}catch{return!1}}function km(e,t=`normal`){let n=qu[t]||qu.normal,r=(Cm(e,50,99,80)-80)/20,i=n.skill+r*n.spread;return Math.round(Math.min(1.02,Math.max(.8,i))*1e3)/1e3}function Am(e,t=`normal`){let n=xm[e-1]??0;return Math.round(n*(t===`hard`?1.25:t===`easy`?.75:1))}function jm(e,t){let n=e=>Cm(t?.[e],0,5,0),r=n(`engine`),i=n(`aero`),a=n(`brakes`),o=n(`tires`);return{...e,vTop:e.vTop*(1+vm.engine.vTop*r),accel:e.accel*(1+vm.engine.accel*r),down:e.down*(1+vm.aero.down*i),brake:e.brake*(1+vm.brakes.brake*a),wear:e.wear*(1+vm.tires.wear*o)}}function Mm(e){let t=gm.reduce((t,n)=>t+(e?.upgrades?.[n]||0),0);return Math.round((76+t*1.2)*10)/10}function Nm(e,t){if(!gm.includes(t))return null;let n=e.upgrades[t]||0;return n>=5?null:_m[n]}function Pm(e,t){if(!gm.includes(t))return{ok:!1,reason:`unknown`,level:0,cost:0,left:e?.upgradePoints||0};let n=e.upgrades[t]||0;if(n>=5)return{ok:!1,reason:`max`,level:n,cost:0,left:e.upgradePoints};let r=_m[n];return e.upgradePoints<r?{ok:!1,reason:`points`,level:n,cost:r,left:e.upgradePoints}:(e.upgradePoints-=r,e.upgrades[t]=n+1,{ok:!0,level:n+1,cost:r,left:e.upgradePoints})}function Fm(e,t){let n=e&&typeof e==`object`?e:{};return{id:String(n.id||t.id).toLowerCase().replace(/[^a-z0-9]/g,``).slice(0,16)||t.id,name:jd(n.name)||t.name,number:Fd(n.number,t.number),teamIndex:Cm(n.teamIndex,1,od.length-1,t.teamIndex),rating:Cm(n.rating,50,99,t.rating)}}function Im(e,t){if(!Array.isArray(e))return[];let n=[];for(let r of e){if(!r||typeof r!=`object`||!Au.includes(r.trackId))continue;let e={};if(r.places&&typeof r.places==`object`)for(let[n,i]of Object.entries(r.places)){if(n!==`player`&&!t.has(n))continue;let r=Cm(i,1,24,0);r&&(e[n]=r)}if(n.push({trackId:r.trackId,pos:Cm(r.pos,1,24,0)||null,points:Cm(r.points,0,25,0),upgrade:Cm(r.upgrade,0,99,0),places:e}),n.length>=64)break}return n}function Lm(e={},t=null){let n=Em(t||Tm()),r=Fd(e.number??e.driver?.number??n.driver.number,n.driver.number),i=jd(e.driverName??(typeof e.driver==`string`?e.driver:e.driver?.name)??n.driver.name)||n.driver.name,a=e.team||n.team,o=zd({...a,livery:{...a.livery||{},number:r}},n.team.name),s=qu[e.difficulty]?e.difficulty:`normal`,c=e.weather===`dry`||e.weather===`rain`?e.weather:`auto`;return{v:1,driver:{name:i,number:r},team:o,difficulty:s,laps:Cm(e.laps,3,5,4),weather:c,round:0,season:1,complete:!1,calendar:Au.slice(),points:{},upgradePoints:0,upgrades:{engine:0,aero:0,brakes:0,tires:0},rivals:wm(),history:[]}}function Rm(e){if(!e||typeof e!=`object`)return null;let t=Lm({driverName:e.driver?.name,number:e.driver?.number,team:e.team,difficulty:e.difficulty,laps:e.laps,weather:e.weather}),n=wm().map((t,n)=>Fm(Array.isArray(e.rivals)?e.rivals[n]:null,t)),r=new Set(n.map(e=>e.id)),i={};if(e.points&&typeof e.points==`object`)for(let[t,n]of Object.entries(e.points)){if(t!==`player`&&!r.has(t))continue;let e=Number(n);Number.isFinite(e)&&e>=0&&e<1e5&&(i[t]=Math.round(e))}let a={engine:0,aero:0,brakes:0,tires:0};for(let t of gm)a[t]=Cm(e.upgrades?.[t],0,5,0);let o=Array.isArray(e.calendar)?e.calendar.filter(e=>Au.includes(e)):[],s=o.length?o:Au.slice(),c=Cm(e.round,0,s.length,0);return{...t,round:c,season:Cm(e.season,1,99,1),complete:!!e.complete||c>=s.length,calendar:s,points:i,upgradePoints:Cm(e.upgradePoints,0,9999,0),upgrades:a,rivals:n,history:Im(e.history,r)}}function zm(e){try{let t=e?.getItem(fm);return t?Rm(JSON.parse(t)):null}catch{return null}}function Bm(e,t){try{let n=Rm(t);return n?(e?.setItem(fm,JSON.stringify(n)),!0):!1}catch{return!1}}function Vm(e){if(!e||e.complete||e.round>=e.calendar.length)return null;let t=e.calendar[e.round];return{index:e.round,count:e.calendar.length,id:t}}function Hm(e,t){let n=t?jm(t,e.upgrades):null,r=[{id:`player`,isPlayer:!0,rating:Mm(e),teamIndex:0,team:{...e.team,c1:e.team.livery.c1,c2:e.team.livery.c2,custom:!0,livery:{...e.team.livery}},driver:{name:e.driver.name,number:e.driver.number},skill:.985,cls:n||void 0},...e.rivals.map(t=>{let n=od[t.teamIndex];return{id:t.id,isPlayer:!1,rating:t.rating,teamIndex:t.teamIndex,team:{name:n.name,tag:n.tag,c1:n.c1,c2:n.c2},driver:{name:t.name,number:t.number},skill:km(t.rating,e.difficulty)}})];return r.sort((e,t)=>t.rating-e.rating||(e.driver.name<t.driver.name?-1:+(e.driver.name>t.driver.name))),r}function Um(e){let t={},n={};for(let r of e.history||[])for(let[e,i]of Object.entries(r.places||{}))i===1&&(t[e]=(t[e]||0)+1),i<=3&&(n[e]=(n[e]||0)+1);let r=e.team,i=[{id:`player`,player:!0,name:e.driver.name,number:e.driver.number,team:r.name,tag:r.tag,c1:r.livery.c1,c2:r.livery.c2,points:e.points.player||0,rating:null},...e.rivals.map(t=>{let n=od[t.teamIndex];return{id:t.id,player:!1,name:t.name,number:t.number,team:n.name,tag:n.tag,c1:n.c1,c2:n.c2,points:e.points[t.id]||0,rating:t.rating}})];return i.sort((e,r)=>r.points-e.points||(t[r.id]||0)-(t[e.id]||0)||(n[r.id]||0)-(n[e.id]||0)||(e.name<r.name?-1:+(e.name>r.name))),i.map((e,n)=>({...e,pos:n+1,wins:t[e.id]||0}))}function Wm(e,t){if(!e||e.complete||e.round>=e.calendar.length)return null;let n=e.calendar[e.round],r={},i=null,a=0;for(let n of t||[]){let t=n.isPlayer?`player`:n.id;if(!t)continue;let o=hm(n.pos);e.points[t]=(e.points[t]||0)+o,r[t]=n.pos,t===`player`&&(i=n.pos,a=o)}let o=i?Am(i,e.difficulty):0;return e.upgradePoints+=o,e.history.push({trackId:n,pos:i,points:a,upgrade:o,places:r}),e.round+=1,e.round>=e.calendar.length&&(e.complete=!0),{trackId:n,pos:i,points:a,upgrade:o,complete:e.complete,standings:Um(e)}}function Gm(e){return e.season=Cm(e.season,1,98,1)+1,e.round=0,e.complete=!1,e.points={},e.history=[],e.calendar=Au.slice(),e}var Y=e=>document.getElementById(e),Km=Y(`view`);(matchMedia(`(pointer:coarse)`).matches||`ontouchstart`in window)&&document.body.classList.add(`touch`);var qm=new Zl({canvas:Km,antialias:!1,powerPreference:`high-performance`});qm.setPixelRatio(1),qm.shadowMap.enabled=!0,qm.shadowMap.type=0,qm.shadowMap.autoUpdate=!1;var Jm=new Dn(320,180,{minFilter:ye,magFilter:ye,depthBuffer:!0,samples:em(2)}),Ym=new pr,Xm=new yo(58,16/9,.5,3200),Zm=new pr,Qm=new bo(-1,1,1,-1,0,1),$m=new Na({uniforms:{tex:{value:Jm.texture},res:{value:new on(320,180)},k:{value:3},rain:{value:0},time:{value:0},sat:{value:1},tint:{value:new G(1,1,1)},speed:{value:0}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }`,fragmentShader:`uniform sampler2D tex; uniform vec2 res; uniform float k; uniform float rain; uniform float time; uniform float sat; uniform vec3 tint; uniform float speed; varying vec2 vUv;
    float h11(float n){ return fract(sin(n*91.345)*47453.5453); }
    void main(){
      // sharp bilinear: flat inside a low-res texel, blended over ~1 device pixel across its edge (k device px per texel)
      vec2 u = vUv*res - .5, iu = floor(u), w = clamp((u - iu - .5)*k + .5, 0., 1.);
      vec3 c = texture2D(tex, (iu + .5 + w)/res).rgb; c = pow(clamp(c,0.,1.), vec3(1./2.2));
      float l = dot(c, vec3(.299,.587,.114)); c = mix(vec3(l), c, sat) * tint;
      vec2 p = floor(vUv*res);
      if (rain > 0.02) {
        // screen-space diagonal rain streaks, two layers, one low-res pixel wide
        float a = 0.;
        for (int k = 0; k < 2; k++) {
          float sp = k == 0 ? 3. : 5., spd = k == 0 ? 95. : 150., len = k == 0 ? 14. : 9.;
          float u = p.x - p.y*0.3, w = p.y + p.x*0.3 * 0. ;
          float col = floor(u / sp), r = h11(col + float(k)*17.3);
          if (mod(floor(u), sp) < 1. && r < rain*0.5) {
            float s = fract((w + time*spd*(0.8 + r*0.5)) / (len*(1.8 + r*2.)) + r*9.);
            a = max(a, s < 0.4 ? 1. - s/0.4 : 0.);
          }
        }
        c = mix(c, vec3(.85,.93,1.), a*0.35*rain);
        c *= 1. - 0.1*rain*length(vUv-.5);
      }
      if (speed > 0.02) {
        // speed lines: 1-px radial streaks in the outer ring only (centre stays clean)
        vec2 dc = (vUv - .5) * vec2(res.x/res.y, 1.);
        float rr = length(dc), ang = atan(dc.y, dc.x);
        float ray = floor(ang * 38.), rh = h11(ray + 3.1);
        float ph = fract(rr * 2.2 - time * (1.6 + rh * 1.4) + rh * 7.);
        float edge = smoothstep(.38, .62, rr);
        float on = step(1. - speed * .55, rh) * step(ph, .32) * edge;
        c = mix(c, vec3(1.), on * .55 * speed);
      }
      vec2 q = p;
      float b = mod(q.x,2.)*2.+mod(q.y,2.)*1.; b = (b-1.5)/ (4.*24.);
      c = floor((c+b)*24.+.5)/24.; gl_FragColor = vec4(c,1.); }`,depthTest:!1,depthWrite:!1});Zm.add(new ji(new Sa(2,2),$m));var eh={level:2,auto:!navigator.webdriver,fps:60,gov:new dm({level:2})},th=tm(innerWidth,innerHeight,1,$p(eh.level));function nh(){let e=Math.min(window.devicePixelRatio||1,4);th=tm(innerWidth,innerHeight,e,$p(eh.level)),qm.setPixelRatio(1),qm.setSize(th.W,th.H,!1),Jm.setSize(th.lowW,th.lowH),$m.uniforms.res.value.set(th.lowW,th.lowH),$m.uniforms.k.value=th.k,Xm.aspect=th.lowW/th.lowH,Xm.updateProjectionMatrix()}function rh(t,n,r){let i=Math.max(Xm.aspect,.2),a=2*Math.atan(Math.tan(n*Math.PI/360)/i)*180/Math.PI;return e(Math.max(t,a),t,r)}addEventListener(`resize`,nh),nh();var ih=new Gp,ah=new Zp,oh=(()=>{try{return localStorage.setItem(`_t`,`1`),localStorage.removeItem(`_t`),localStorage}catch{return null}})(),sh=Xu(oh),ch=Dm(oh),X=zm(oh);X&&(ch={driver:{...X.driver},team:X.team});var Z={mode:`race`,difficulty:`normal`,cls:`gp`,laps:3,weather:`auto`,track:ju,...sh.settings||{}};Z.track=Mu(Z.track).id;var Q=new Tu(Mu(Z.track)),lh=Vp(Q.themeId);lh.build(Ym,Q);var uh={};function dh(e){if(uh[e]!==void 0)return uh[e];try{uh[e]=JSON.parse(oh?.getItem(`drive-ghost-v1:`+e)||`null`)}catch{uh[e]=null}return uh[e]}var $=null,fh=[],ph=null,mh=null,hh=[`chase`,`overhead`,`full`],gh={chase:`CHASE`,overhead:`TOP`,full:`MAP`},_h=`chase`,vh={chase:1,overhead:0,full:0},yh=!1,bh=!1,xh=`menu`,Sh=!1,Ch=null,wh=`quick`,Th=!1,Eh=`menu`,Dh=null,Oh=`c1`,kh=new fp;kh.addTo(Ym);var Ah=null,jh=null,Mh={x:0,y:10,z:0,yaw:0,ly:0},Nh=0,Ph=!1,Fh=0,Ih=-1,Lh=0,Rh=-1,zh=-1,Bh=-1,Vh=null,Hh=0,Uh=0,Wh=-1,Gh=0,Kh=0,qh=0,Jh=0,Yh=null,Xh=[...document.querySelectorAll(`#secs span`)];function Zh(){for(let e of fh)Ym.remove(e.group),sp(e);fh=[],ph&&=(Ym.remove(ph.group),sp(ph),null),kh.clear()}var Qh=()=>bu(Z.difficulty,Z.lineGuide);function $h(){let e=Qh()&&!!Ah;Ah?.setEnabled(e&&!!$);for(let e of[`optLine`])Y(e)&&_g(e).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===`on`===Qh()));let t=Z.difficulty===`hard`;for(let e of[`rowLine`,`pLine`])Y(e)?.classList.toggle(`na`,t);Y(`pLine`)&&(Y(`pLine`).textContent=t?`LINE: NONE (HARD)`:`LINE: `+(Qh()?`ON`:`OFF`)),Y(`optLine`)&&_g(`optLine`).forEach(e=>e.disabled=t)}function eg(e){return Z.difficulty===`hard`?($h(),!1):(Z.lineGuide=!!e,tg(),$h(),Qh())}function tg(){oh&&(sh.settings={...sh.settings||{},mode:Z.mode,difficulty:Z.difficulty,cls:Z.cls,laps:Z.laps,weather:Z.weather,track:Z.track,lineGuide:Z.lineGuide},Zu(oh,sh))}function ng(){return X?{driver:X.driver,team:X.team}:ch}function rg(){let e=ng(),t=e.team.livery||{};return Wd(Hd({driver:e.driver.name,name:e.team.name,tag:e.team.tag,pattern:t.pattern,c1:t.c1,c2:t.c2,c3:t.c3,number:e.driver.number}))}var ig=[`menu`,`results`,`pause`,`career`,`standings`,`upgrades`,`editor`];function ag(){for(let e of ig)Y(e)?.classList.add(`hidden`)}function og(){Ah&&=(Ym.remove(Ah.mesh),Ah.mesh.geometry.dispose(),Ah.mesh.material.dispose(),null),jh&&=(Ym.remove(jh.mesh),jh.mesh.geometry.dispose(),jh.mesh.material.dispose(),null)}function sg(e){let t=Mu(e);if(Q&&Q.id===t.id&&lh&&lh.name===t.theme)return Z.track=t.id,Q;Zh(),og();let n=lh?lh.quality:eh.level;return lh?.dispose(),Q=new Tu(t),lh=Vp(t.theme),lh.build(Ym,Q),lh.setQuality(n),Gg(),d_(),Z.track=t.id,Q}function cg(e={}){let{grid:t,playerTeam:n,driver:r,keepCareer:i,restore:a,rng:o,...s}=e;wh=i?`career`:`quick`,Object.assign(Z,s),Z.mode!==`race`&&Z.mode!==`tt`&&(Z.mode=`race`),Qu(sh,Z.cls)||(Z.cls=`gp`),Q&&Q.id===Mu(Z.track).id||sg(Z.track),clearTimeout(Yh),Zh(),$=new Sd(Q,{mode:Z.mode,difficulty:Z.difficulty,cls:Z.cls,laps:Z.laps,weather:Z.weather,best:nd(sh,Z.cls),rng:o,grid:t,playerTeam:n||rg(),driver:r||null}),$.cars.forEach(e=>{let t=Xf(e.cls.id,e.team,e.isPlayer,!1,e.teamIndex);t.st={},t.setTire(e.tire),Ym.add(t.group),fh.push(t),e.mesh=t}),og(),Ah=pp(Q,$.cls),Ym.add(Ah.mesh),jh&&jh.cls===$.cls.id||(jh&&Ym.remove(jh.mesh),jh=hp(Q,$.cls),jh.cls=$.cls.id,Ym.add(jh.mesh)),$h(),lh.setCars(fh),mh=$.solo?dh(Z.cls):null,mh&&(ph=Xf(Z.cls,$.player.team,!1,!0,$.player.teamIndex),ph.group.visible=!1,Ym.add(ph.group)),Ch=wh===`career`?{kind:`pos`,target:10,text:Q.name}:rd(Z,sh),xh=`racing`,Sh=!1,Th=!1,Wh=-1,Ih=-1,Nh=0,Lh=0,Fh=0;for(let e of[`banner`,`flag`])Y(e).classList.remove(`on`);Y(`posPop`).classList.remove(`on`),ag(),Y(`hud`).classList.remove(`hidden`),Y(`goal`)&&(Y(`goal`).textContent=wh===`career`?`ROUND ${X.round+1}/${X.calendar.length}  ${Q.name.toUpperCase()}`:`GOAL: `+Ch.text),Y(`board`).classList.toggle(`hidden`,$.solo),Y(`bEnd`)?.classList.toggle(`hidden`,!$.solo),Y(`pos`).classList.toggle(`tt`,$.solo),mg(),new URLSearchParams(location.search).get(`rain`)===`1`&&$.setRain(!0),lh.setWeather({rain:$.rain,wetness:$.wetness}),lh.setStartLights(0,!1);let c=$.player;return Mh.init=!1,Mh.yaw=c.theta,Mh.x=c.x,Mh.z=c.z,Mh.y=c.y+6,Mh.ly=c.y,Object.assign(l_,{x:c.x,y:c.y,z:c.z,yaw:c.theta,xV:0,yV:0,zV:0,lastX:void 0}),I_.force(),q_(),U_=0,ah.init(),ah.music=!1,ug(!1),lg(($.solo,`GET READY`),3),a&&Object.assign(Z,a),tg(),$}function lg(e,t=2.5){Y(`msg`).textContent=e,Kh=t}function ug(e){$&&($.autopilot=e,Y(`bAuto`).classList.toggle(`on`,e))}function dg(e,t=!1){if(typeof e==`string`&&e===`top`&&(e=`overhead`),!hh.includes(e))return _h;if(_h=e,t){for(let t of hh)vh[t]=+(t===e);yh=!0}let n=Y(`bCam`);return n.classList.toggle(`on`,e!==`chase`),n.textContent=gh[e],_h}function fg(){return dg(hh[(hh.indexOf(_h)+1)%hh.length])}function pg(e){ah.setMuted(e),Y(`bMute`).classList.toggle(`on`,e),Y(`bMute`).textContent=e?`MUTE`:`SND`}pg(ah.muted);function mg(){Xh.forEach((e,t)=>{e.className=``,e.textContent=`S`+(t+1)}),Y(`split`).textContent=``}function hg(){clearTimeout(Yh),xh=`menu`,ag(),Y(`hud`).classList.add(`hidden`),Y(`menu`).classList.remove(`hidden`),Y(`again-btn`)?.classList.remove(`hidden`),Y(`menu-btn`)&&(Y(`menu-btn`).textContent=`MENU`),Z.track!==Q.id&&sg(Z.track),bg()}function gg(e){!$||xh!==`racing`&&xh!==`paused`||(xh=e?`paused`:`racing`,Y(`pause`).classList.toggle(`hidden`,!e),Y(`finish-btn`).classList.toggle(`hidden`,!$.solo))}var _g=e=>[...Y(e).querySelectorAll(`button`)],vg=e=>String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]);Y(`optTrack`).innerHTML=ku.map(e=>`<button data-v="${e.id}">${vg(e.name.split(` `)[0].toUpperCase())}</button>`).join(``);function yg(e,t){let n=Y(e);n&&(n.style.background=Id(t))}function bg(){let e=(e,t)=>_g(e).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===String(t)));e(`optMode`,Z.mode),e(`optDiff`,Z.difficulty),e(`optClass`,Z.cls),e(`optLaps`,Z.laps),e(`optWeather`,Z.weather),e(`optTrack`,Z.track);let t=Z.mode===`tt`,n=Z.mode===`career`;Y(`rowLaps`).classList.toggle(`hidden`,t||n),Y(`rowWeather`).classList.toggle(`hidden`,t),Y(`rowTrack`).classList.toggle(`hidden`,n);let r=!Qu(sh,`speedway`);Y(`clsSpeedway`).classList.toggle(`locked`,r),Y(`clsSpeedway`).textContent=r?`SPEEDWAY [LOCKED]`:`SPEEDWAY`;let i=rg();if(yg(`teamSwatch`,i.c1),Y(`teamLabel`).textContent=i.name,n){let e=X?Vm(X):null,t=X?`${X.driver.name} · ${X.team.name}`:`Create a driver and a team`,n=e?Mu(e.id).name:X?.complete?`Season complete`:`A season across every circuit`;Y(`goalBox`).innerHTML=`<b>CAREER</b> ${vg(t)}<br>${vg(n)}`,Y(`start-btn`).textContent=X?`CAREER`:`NEW CAREER`}else{let e=rd(Z,sh),t=ed(sh,Z.cls);Y(`goalBox`).innerHTML=`<b>GOAL</b> ${e.text}`+(t&&isFinite(t.bestLap??NaN)?`<br>Best lap (${Z.cls.toUpperCase()}): ${Nu(t.bestLap)}`:``),Y(`start-btn`).textContent=`START`}Y(`menuMsg`).textContent=!n&&r?$u(`speedway`):``,$h()}for(let[e,t]of[[`optMode`,`mode`],[`optDiff`,`difficulty`],[`optClass`,`cls`],[`optLaps`,`laps`],[`optWeather`,`weather`],[`optTrack`,`track`]])Y(e).addEventListener(`click`,e=>{let n=e.target.closest(`button`);n&&(t===`cls`&&!Qu(sh,n.dataset.v)?Y(`menuMsg`).textContent=$u(n.dataset.v):(Z[t]=t===`laps`?+n.dataset.v:n.dataset.v,t===`track`&&(sg(Z.track),tg()),bg()))});Y(`optLine`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&!t.disabled&&eg(t.dataset.v===`on`)}),Y(`pLine`).addEventListener(`click`,()=>eg(!Qh())),Y(`start-btn`).addEventListener(`click`,()=>{Z.mode===`career`?Cg():cg()}),Y(`team-btn`).addEventListener(`click`,()=>Ag(`menu`)),Y(`again-btn`).addEventListener(`click`,()=>cg()),Y(`restart-btn`).addEventListener(`click`,()=>cg()),Y(`resume-btn`).addEventListener(`click`,()=>gg(!1)),Y(`finish-btn`).addEventListener(`click`,()=>Zg()),Y(`menu-btn`).addEventListener(`click`,()=>{wh===`career`&&X?Og():hg()}),Y(`pmenu-btn`).addEventListener(`click`,hg);var xg=`career`;function Sg(e){ag(),Y(`hud`).classList.add(`hidden`),Y(e).classList.remove(`hidden`),xh=e}function Cg(){X?(X.difficulty=Z.difficulty,X.weather=Z.weather,Bm(oh,X),wg()):Ag(`season`)}function wg(){if(!X){Ag(`season`);return}let e=Um(X).find(e=>e.player),t=Vm(X);Y(`carTitle`).textContent=`SEASON ${X.season}`,Y(`carRound`).textContent=X.complete?`SEASON COMPLETE`:`ROUND ${t.index+1} OF ${t.count}  ·  ${Mu(t.id).name.toUpperCase()}`,Y(`carCal`).innerHTML=X.calendar.map((e,t)=>`<li class="${t<X.round||X.complete?`done`:t===X.round?`now`:``}">${t+1}. ${vg(Mu(e).name)}</li>`).join(``),yg(`carSwatch`,X.team.livery.c1),Y(`carWho`).textContent=`${X.driver.name}  #${X.driver.number}  ·  ${X.team.name}`,Y(`carMeta`).textContent=`P${e.pos}  ·  ${e.points} PTS  ·  RESEARCH ${X.upgradePoints}  ·  ${qu[X.difficulty].name.toUpperCase()}`,_g(`carLaps`).forEach(e=>e.classList.toggle(`sel`,+e.dataset.v===X.laps)),Y(`carRace`).classList.toggle(`hidden`,!!X.complete),Y(`carRace`).textContent=t?`RACE`:`STANDINGS`,Sg(`career`)}function Tg(){if(!X)return Cg();let e=Vm(X);if(!e){Eg();return}let t={mode:Z.mode,cls:Z.cls,laps:Z.laps,track:Z.track,difficulty:Z.difficulty};X.difficulty=Z.difficulty,X.weather=Z.weather,Bm(oh,X),cg({keepCareer:!0,restore:t,mode:`race`,difficulty:X.difficulty,cls:`gp`,laps:X.laps,weather:X.weather,track:e.id,grid:Hm(X,a.gp),driver:{name:X.driver.name,number:X.driver.number}})}function Eg(){if(!X)return hg();let e=Um(X),t=X.complete?e[0]:null;Y(`standHead`).textContent=t?t.player?`SEASON ${X.season} CHAMPION — YOU`:`SEASON ${X.season} CHAMPION — ${t.name}`:`SEASON ${X.season}  ·  ROUND ${Math.min(X.round+1,X.calendar.length)}/${X.calendar.length}`,Y(`standTable`).innerHTML=e.map(e=>`<tr class="${e.player?`me`:``}"><td>${e.pos}</td><td><i class="chip" style="background:${Id(e.c1)}"></i> ${vg(e.name)} <small>#${e.number}</small></td><td>${vg(e.team)}</td><td>${e.player?`YOU`:e.rating}</td><td>${e.points}</td></tr>`).join(``),Sg(`standings`)}function Dg(){if(!X)return hg();Y(`upPoints`).textContent=`RESEARCH POINTS  ${X.upgradePoints}`,Y(`upList`).innerHTML=gm.map(e=>{let t=X.upgrades[e]||0,n=Nm(X,e),r=n==null?`MAX`:X.upgradePoints>=n?`BUY ${n}`:`NEED ${n}`;return`<div class="uprow"><b style="width:5.2em">${ym[e]}</b><div class="bar"><i style="width:${t/5*100}%"></i></div><span>${t}/5</span><button class="btn" data-up="${e}" ${n==null||X.upgradePoints<n?`disabled`:``}>${r}</button></div><div class="meta" style="text-align:left">${vg(bm[e])}</div>`}).join(``),Sg(`upgrades`)}function Og(){xg=`results`,Dg()}function kg(e){ch={driver:{name:e.driver,number:e.number},team:{name:e.name,tag:e.tag,livery:{pattern:e.pattern,c1:e.c1,c2:e.c2,c3:e.c3,number:e.number}}},Om(oh,ch),ch=Dm(oh),X&&=(X.driver={...ch.driver},X.team=ch.team,Bm(oh,X),zm(oh))}function Ag(e){Eh=e;let t=ng(),n=t.team.livery||{};Dh=Hd({driver:t.driver.name,name:t.team.name,tag:t.team.tag,pattern:n.pattern,c1:n.c1,c2:n.c2,c3:n.c3,number:t.driver.number}),Y(`edTitle`).textContent=e===`season`?`NEW CAREER`:`YOUR TEAM`,Y(`edSave`).textContent=e===`season`?`START SEASON`:`DONE`,Y(`edDriver`).value=Dh.driver,Y(`edTeam`).value=Dh.name,Y(`edNumber`).value=String(Dh.number),Y(`edMsg`).textContent=``,jg(),Sg(`editor`),zg(Wd(Dh))}function jg(){Y(`edTag`).textContent=Dh.tag,_g(`edChannel`).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===Oh)),_g(`edPattern`).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===Dh.pattern));let e=Dh[Oh];for(let t of Y(`edSwatches`).querySelectorAll(`.swatch`))t.classList.toggle(`sel`,parseInt(t.dataset.c,16)===e);let t=Y(`edColor`);t&&(t.value=Id(e))}function Mg(e){Dh=Ud(Dh,e),jg(),zg(Wd(Dh))}Y(`edPattern`).innerHTML=Ed.map(e=>`<button data-v="${e.id}">${e.name}</button>`).join(``),Y(`edSwatches`).innerHTML=kd.map(e=>`<button class="swatch" data-c="${e.toString(16)}" style="background:${Id(e)}"></button>`).join(``)+`<input type="color" id="edColor" value="#e8472a" aria-label="Custom colour" />`,Y(`edChannel`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&(Oh=t.dataset.v,jg())}),Y(`edPattern`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&Mg({pattern:t.dataset.v})}),Y(`edSwatches`).addEventListener(`click`,e=>{let t=e.target.closest(`.swatch`);t&&Mg({[Oh]:parseInt(t.dataset.c,16)})}),Y(`edColor`).addEventListener(`input`,()=>Mg({[Oh]:Y(`edColor`).value})),Y(`edNumber`).addEventListener(`input`,()=>Mg({number:Y(`edNumber`).value}));function Ng(){let e=Y(`edTeam`).value,t=Y(`edDriver`).value;jd(e)?jd(t)?(Dh=Ud(Dh,{name:e,driver:t,number:Y(`edNumber`).value}),kg(Dh),Eh===`season`?(X=Lm({driverName:Dh.driver,number:Dh.number,team:ch.team,difficulty:Z.difficulty,weather:Z.weather,laps:X?.laps||Z.laps||4},ch),Bm(oh,X),wg()):Eh===`career`&&X?wg():hg()):Y(`edMsg`).textContent=`Driver name needs 3 to 18 characters`:Y(`edMsg`).textContent=`Team name needs 3 to 18 characters`}Y(`edSave`).addEventListener(`click`,Ng),Y(`edBack`).addEventListener(`click`,()=>{Eh===`career`&&X?wg():hg()}),Y(`carLaps`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&X&&(X.laps=+t.dataset.v,Bm(oh,X),wg())}),Y(`carRace`).addEventListener(`click`,Tg),Y(`carUp`).addEventListener(`click`,()=>{xg=`career`,Dg()}),Y(`carStand`).addEventListener(`click`,Eg),Y(`carTeam`).addEventListener(`click`,()=>Ag(`career`)),Y(`carMenu`).addEventListener(`click`,hg),Y(`carSeason`).addEventListener(`click`,()=>{if(!X)return;let e=Y(`carSeason`);e.dataset.arm===`1`?(e.dataset.arm=``,e.textContent=`NEW SEASON`,Gm(X),Bm(oh,X),wg()):(e.dataset.arm=`1`,e.textContent=`CONFIRM`)}),Y(`standBack`).addEventListener(`click`,()=>X?wg():hg()),Y(`standMenu`).addEventListener(`click`,hg),Y(`upList`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-up]`);t&&!t.disabled&&X&&(Pm(X,t.dataset.up).ok&&Bm(oh,X),Dg())}),Y(`upDone`).addEventListener(`click`,()=>{xg===`results`&&X?.complete?(xg=`career`,Eg()):(xg=`career`,X?wg():hg())});var Pg=null,Fg=null,Ig=null,Lg=null;function Rg(){if(Pg)return;Pg=new Zl({canvas:Y(`liveryCanvas`),antialias:!1,alpha:!1}),Pg.setPixelRatio(1),Fg=new pr,Fg.background=new q(1054752),Ig=new yo(32,1,.1,40),Fg.add(new oo(13625087,3820082,1.3));let e=new So(16773590,2.4);e.position.set(4,7,5),Fg.add(e);let t=new ji(new la(5,8),new Ia({color:1713200}));t.rotation.x=-Math.PI/2,Fg.add(t)}function zg(e){Rg(),Lg&&(Fg.remove(Lg.group),sp(Lg)),Lg=Xf(`gp`,e,!1,!1,0),Fg.add(Lg.group)}function Bg(){if(xh!==`editor`||!Lg)return;let e=Y(`liveryCanvas`),t=Math.max(2,e.clientWidth|0),n=Math.max(2,e.clientHeight|0);(Pg.domElement.width!==t||Pg.domElement.height!==n)&&(Pg.setSize(t,n,!1),Ig.aspect=t/n,Ig.updateProjectionMatrix());let r=performance.now()*.001;Lg.group.rotation.y=r*.7,Lg.wheels.forEach(e=>{e.spin=r*2}),Zf(Lg),Ig.position.set(Math.sin(r*.15)*7.2,2.5,Math.cos(r*.15)*7.2),Ig.lookAt(0,.55,0),Pg.render(Fg,Ig)}ih.onTap(Y(`bCam`),fg),ih.onTap(Y(`bAuto`),()=>$&&ug(!$.autopilot)),ih.onTap(Y(`bPit`),()=>Vg()),ih.onTap(Y(`bMute`),()=>pg(!ah.muted)),ih.onTap(Y(`bPause`),()=>gg(xh===`racing`)),ih.onTap(Y(`bEnd`),()=>Zg()),ih.onTap(Y(`bDry`),()=>$?.choosePitTire(`dry`)),ih.onTap(Y(`bWet`),()=>$?.choosePitTire(`wet`));function Vg(){if(!$||$.solo)return;let e=$.player;e.pit.stage||($.requestPit(e,!e.pit.request),lg(e.pit.request?`PIT NEXT LAP`:`PIT CANCELLED`))}var Hg=Y(`mm`),Ug=Hg.getContext(`2d`),Wg=null;function Gg(){let e=1e9,t=-1e9,n=1e9,r=-1e9;for(let i=0;i<Q.n;i++)e=Math.min(e,Q.px[i]),t=Math.max(t,Q.px[i]),n=Math.min(n,Q.pz[i]),r=Math.max(r,Q.pz[i]);let i=Hg.width,a=Math.min((i-20)/(t-e),(i-20)/(r-n)),o=(i-(t-e)*a)/2,s=(i-(r-n)*a)/2,c=t=>o+(t-e)*a,l=e=>i-(s+(e-n)*a),u=document.createElement(`canvas`);u.width=u.height=i;let d=u.getContext(`2d`);d.lineJoin=`round`,d.lineCap=`round`;let f=()=>{d.beginPath();for(let e=0;e<=Q.n;e+=2){let t=e%Q.n;e?d.lineTo(c(Q.px[t]),l(Q.pz[t])):d.moveTo(c(Q.px[t]),l(Q.pz[t]))}d.closePath()};d.strokeStyle=`#000`,d.lineWidth=7,f(),d.stroke(),d.strokeStyle=`#8fa3b8`,d.lineWidth=4,f(),d.stroke(),d.fillStyle=`#fff`,d.fillRect(c(Q.px[0])-5,l(Q.pz[0])-1.5,10,3),Wg={c:u,mapX:c,mapY:l}}Gg();function Kg(){Ug.clearRect(0,0,Hg.width,Hg.height),Ug.drawImage(Wg.c,0,0);for(let e=0;e<2;e++)for(let t of $.cars){if(e===1!==t.isPlayer)continue;let n=t._r||t,r=Wg.mapX(n.x),i=Wg.mapY(n.z);Ug.fillStyle=`#000`,Ug.beginPath(),Ug.arc(r,i,t.isPlayer?7.5:5.5,0,7),Ug.fill(),Ug.fillStyle=t.isPlayer?`#ffe14a`:t.team._hex||=qg(t.team.c1),Ug.beginPath(),Ug.arc(r,i,t.isPlayer?5.5:3.6,0,7),Ug.fill()}}var qg=e=>`#`+e.toString(16).padStart(6,`0`);function Jg(e,t){let n=Y(e);n._v!==t&&(n._v=t,n.textContent=t)}function Yg(e,t){let n=Y(e);n._v!==t&&(n._v=t,n.innerHTML=t)}function Xg(){let e=$.player,t=$.lapTimer;$.solo?(Yg(`pos`,`TIME TRIAL`),Jg(`lap`,`L${e.laps+1}`)):(Yg(`pos`,`P${e.pos}<small>/${$.cars.length}</small>`),Jg(`lap`,`LAP ${Math.min(e.laps+1,$.laps)}/${$.laps}`)),Jg(`laptime`,Nu(Ru(t,$.time))),Jg(`best`,`BEST `+Nu(t.bestLap)),Xh.forEach((e,n)=>e.classList.toggle(`cur`,t.g>=0&&n===zu(t))),Jg(`speed`,String(Math.round(Math.max(0,e.v)*3.6))),Jg(`tire`,e.tire===`wet`?`W`:`D`),Y(`tire`).classList.toggle(`wet`,e.tire===`wet`);let n=Y(`wearbar`).firstElementChild;n.style.width=(1-e.wear)*100+`%`,n.style.background=e.wear>.7?`#e8472a`:e.wear>.45?`#f2c230`:`#5de06a`,Y(`boostbar`).firstElementChild.style.width=e.boost*100+`%`,$.solo||Yg(`board`,$.order.slice(0,5).map((e,t)=>`<li class="${e.isPlayer?`me`:``}"><b>${t+1}</b><i style="background:${qg(e.team.c1)}"></i>${e.team.tag}</li>`).join(``)+(e.pos>5?`<li class="me"><b>${e.pos}</b><i style="background:${qg(e.team.c1)}"></i>${e.team.tag}</li>`:``));let r=Y(`gaps`);if(!$.solo&&$.phase===`racing`&&!e.finished){let t=$.gaps(e);r.classList.remove(`hidden`),Jg(`gAhead`,t.ahead==null?``:`▲ `+o_(t.ahead,`+`)),Jg(`gBehind`,t.behind==null?``:`▼ `+o_(t.behind,`-`))}else r.classList.add(`hidden`);Y(`bPit`).classList.toggle(`on`,e.pit.request||e.pit.stage>0),Y(`bPit`).classList.toggle(`hidden`,$.solo),Y(`bc`).classList.toggle(`hidden`,!e.pit.stage),e.pit.stage&&Jg(`pitmsg`,e.pit.stage===2?e.pit.choice?`SERVICE...`:`CHOOSE TIRES`:e.pit.stage===1?`PIT LANE - CHOOSE`:`PIT EXIT`),Y(`bDry`).classList.toggle(`on`,e.pit.choice===`dry`),Y(`bWet`).classList.toggle(`on`,e.pit.choice===`wet`);let i=Q.section[e.idx];i!==Wh&&(Wh=i,Y(`sect`).textContent=Q.sections[i].toUpperCase(),Y(`sect`).classList.add(`on`),Gh=3)}function Zg(){$&&xh!==`results`&&(clearTimeout(Yh),Qg())}function Qg(){let e=$.player,t,n,r=[];if($.solo){t=`TIME TRIAL`,Y(`resSum`).innerHTML=``;let i=Math.min(...e.lapTimes,1/0);n=e.lapTimes.map((e,t)=>`<tr class="${e===i?`me`:``}"><td>LAP ${t+1}</td><td>${Nu(e)}</td><td>${e===i?`BEST`:`+`+(e-i).toFixed(3)}</td></tr>`),n.length||(n=[`<tr><td>No completed laps</td></tr>`]),e.lapTimes.length&&$.lapTimer.laps.length&&$.lapTimer.bestLap===i&&e.recordSet&&r.push(`NEW PERSONAL BEST!`),Y(`resGoal`).textContent=``;let a=id(Ch,{bestLap:i});Y(`resGoal`).textContent=a.text,Y(`resGoal`).className=a.met?`ok`:`no`}else{let e=$.results(),i=e.find(e=>e.isPlayer);t=i.pos===1?`VICTORY!`:i.pos<=3?`PODIUM!`:`RACE RESULTS`;let a=$.player.team.c1;Y(`resSum`).innerHTML=`<span class="big">P${i.pos}</span><span class="chip" style="background:${qg(a)}"></span><span>${i.pos===1?Nu(i.time,!1):`+`+(i.gap??0).toFixed(1)+`s`}</span><span>BEST ${Nu(i.best,!1)}</span>`,n=e.map(e=>`<tr class="${e.isPlayer?`me`:``}"><td>${e.pos}</td><td><i class="chip" style="background:${qg(e.team?.c1??8947848)}"></i> ${e.name}</td><td>${e.pos===1?Nu(e.time,!1):`+`+(e.gap??0).toFixed(1)}</td><td>best ${Nu(e.best,!1)}</td><td>${e.stops?`pit×`+e.stops:``}</td></tr>`);let o=id(Ch,{pos:i.pos});Y(`resGoal`).textContent=o.text,Y(`resGoal`).className=o.met?`ok`:`no`;let s=ad(sh,{mode:`race`,cls:wh===`career`?`gp`:Z.cls,pos:i.pos});if(Zu(oh,sh),r.push(...s.messages),wh===`career`&&X&&!Th){Th=!0;let t=Wm(X,e.map(e=>({id:e.id,pos:e.pos,isPlayer:e.isPlayer})));if(Bm(oh,X),t){let e=t.standings.find(e=>e.player);r.push(`+${t.points} PTS`,`+${t.upgrade} RESEARCH`,`CHAMPIONSHIP P${e.pos} · ${e.points} PTS`),t.complete&&r.push(t.standings[0].player?`YOU ARE THE CHAMPION`:`CHAMPION ${t.standings[0].name}`),Y(`resGoal`).textContent=`${Q.name.toUpperCase()}  +${t.points} PTS`}}}Y(`resTitle`).textContent=t,Y(`restable`).innerHTML=n.join(``),Y(`resMsg`).innerHTML=r.join(`<br>`),Y(`again-btn`).textContent=$.solo?`RETRY`:`RESTART`,Y(`again-btn`).classList.toggle(`hidden`,wh===`career`),Y(`menu-btn`).textContent=wh===`career`?`CONTINUE`:`MENU`;for(let e of[`hud`,`pause`])Y(e).classList.add(`hidden`);Y(`results`).classList.remove(`hidden`),xh=`results`,bg()}function $g(e){let t=Y(`banner`);t.textContent=e,t.classList.remove(`on`),t.offsetWidth,t.classList.add(`on`)}function e_(){let e=Y(`flag`);e.classList.remove(`on`),e.offsetWidth,e.classList.add(`on`)}function t_(e,t){let n=Y(`posPop`),r=t<e;n.textContent=`P${t} ${r?`▲`:`▼`}`,n.className=`on `+(r?`up`:`down`),Fh=1.5}function n_(){let e=Y(`lights`),t=$.phase===`countdown`?$.lights:0,n=!$.solo&&($.phase===`countdown`||$.goFlash>0);e.classList.toggle(`hidden`,!n),document.body.classList.toggle(`lit`,n),e.classList.toggle(`go`,$.phase!==`countdown`&&$.goFlash>0),e.classList.toggle(`fade`,$.phase!==`countdown`&&$.goFlash<.8),t!==Ih&&(Ih=t,[...e.children].forEach((e,n)=>e.classList.toggle(`on`,n<t)))}var r_={},i_=0;function a_(t){let n=$.player,r=n.cls.vTop,i=$.phase===`racing`,a=i?+!!n.boosting+Math.min(1,(n.slip||0)/.3)*.5:0;Nh+=(Math.min(1,a)-Nh)*(1-Math.exp(-t*(a>Nh?6:2.5)));let o=i&&n.surface===`kerb`&&n.v>15;o&&(Uh=Math.max(Uh,.18*Math.min(1,n.v/60))),o&&!Ph&&ah.beep?.(90,.04,`square`,.05),Ph=o,i&&n.v>20&&(Uh=Math.max(Uh,.16*n.lockup,.07*n.flat*Math.min(1,n.v/50)));let s=i?e((n.v/r-.55)/.4,0,1)*.75+Nh*.35:0,c=.3+.7*vh.chase;Lh+=(Math.min(1,s)*c-Lh)*(1-Math.exp(-t*4));let l=e((Math.abs(n.steer||0)*n.v/40-.55)*1.6,0,1)*+(n.v>18);if(i_+=t,i_>=1/62){let e=r_;e.dt=i_,i_=0,e.v=Math.abs(n.v),e.vTop=r,e.throttle=n.input.throttle,e.brake=n.input.brake,e.lat=l,e.lock=n.lockup,e.slip=n.wheelSlip,e.kerb=o,e.on=i||$.phase===`countdown`,e.boosting=n.boosting,ah.drive(e)}Fh-=t,Fh<0&&Y(`posPop`).classList.remove(`on`)}function o_(e,t){return e==null?``:`${t}${e.toFixed(1)}`}function s_(){let e=$.player;for(let t of $.events)if(t.type===`light`)ah.beep(440,.12);else if(t.type===`go`)ah.beep(880,.4),ah.music=!0,lg(`GO!`,1.5);else if(t.type===`finallap`)$g(`FINAL LAP`);else if(t.type===`poschange`)t_(t.from,t.to);else if(t.type===`rain`)lg(`RAIN STARTING - WET TIRES?`,5);else if(t.type===`hit`&&t.car.isPlayer)Uh=Math.max(Uh,Math.min(1,.35+t.power*.65)),ah.thump();else if(t.type===`startline`)mg(),lg($.solo?`FLYING LAP`:`LAP 1`,1.5);else if(t.type===`sector`){let e=Xh[t.sector];t.sector===0&&mg(),e.className=t.status,e.textContent=Nu(t.time,!0).slice(2);let n=t.delta==null?`S`+(t.sector+1):`S${t.sector+1} ${Pu(t.delta)}`;Y(`split`).textContent=n,Y(`split`).className=t.status,qh=3,ah.beep(t.status===`purple`?1320:t.status===`green`?1100:760,.08)}else if(t.type===`laptime`){let n=`${Nu(t.time)}${t.delta==null?``:`  `+Pu(t.delta)}`;!$.solo&&e.finished||lg((t.isBest?`BEST LAP `:`LAP `)+n,3.5),ah.beep(990,.15);let r=td(sh,Z.cls,t);if(r&&(e.recordSet=!0),Zu(oh,sh),t.ghost&&r){uh[Z.cls]=t.ghost;try{oh?.setItem(Ku+`:`+Z.cls,JSON.stringify(t.ghost))}catch{}$.solo&&(mh=t.ghost)}}else t.type===`finish`&&t.car.isPlayer?(lg(`FINISH!`,3),ah.beep(1200,.5),e_()):t.type===`pit`&&t.car.isPlayer&&lg(`TIRES CHANGED`,2);$.events.length=0}function c_(){for(let e of ih.takeActions())if(e===`pause`)gg(xh===`racing`);else if(xh!==`racing`)continue;else e===`camera`?fg():e===`autopilot`?ug(!$.autopilot):e===`mute`?pg(!ah.muted):e===`pit`?Vg():e===`tire:dry`?$.choosePitTire(`dry`):e===`tire:wet`&&$.choosePitTire(`wet`)}var l_={x:0,y:0,z:0,yaw:0},u_=null;function d_(){let e=1e9,t=-1e9,n=1e9,r=-1e9;for(let i=0;i<Q.n;i++)e=Math.min(e,Q.px[i]),t=Math.max(t,Q.px[i]),n=Math.min(n,Q.pz[i]),r=Math.max(r,Q.pz[i]);u_={cx:(e+t)/2,cz:(n+r)/2,w:t-e+120,h:r-n+120}}d_();var f_=new G,p_=new G,m_=new G,h_=new G,g_=new G,__=new G,v_=new G,y_=new G,b_=new G,x_=new G,S_=[0,0,0],C_=[0,0,0],w_=[0,0,0],T_=new G,E_=new G,D_={x:0,y:0,z:0,half:90,dist:40},O_=e=>e*e*(3-2*e);function k_(t){yh&&=(t=8,!1);let n=K_||$.player;for(let e of hh){let n=+(e===_h);vh[e]+=(n-vh[e])*(1-Math.exp(-t*2.4)),Math.abs(n-vh[e])<.003&&(vh[e]=n)}let r=O_(vh.chase),i=O_(vh.overhead),a=O_(vh.full),o=r+i+a||1,s=r/o,c=i/o,l=a/o,u=e(n.v/80,0,1),d=+!!n.pit.stage;l_.pz=(l_.pz??0)+(d-(l_.pz??0))*(1-Math.exp(-t*2.5));let f=rh(58+u*8,62,92),p=le(Mh,n,Q,t,{fovDeg:f,aspect:Xm.aspect});m_.fromArray(p.pos),h_.fromArray(p.look);let m=Xm.aspect<1;ue(l_,n,t);let h=O({x:l_.x,y:l_.y,z:l_.z,yaw:l_.yaw,aspect:Xm.aspect,zoom:1-.35*l_.pz}),g=h.fov,_=h.distance;g_.fromArray(h.pos),__.fromArray(h.target);let v=rh(35,30,55),y=62*Math.PI/180,b=2*Math.atan(Math.tan(v*Math.PI/360)*Xm.aspect),x=Math.max(u_.w/2/Math.tan(b/2),u_.h*Math.sin(y)/(2*Math.tan(v*Math.PI/360)))*1.04;v_.set(u_.cx,0,u_.cz-Math.cos(y)*x).setY(Math.sin(y)*x),y_.set(u_.cx,0,u_.cz),f_.set(0,0,0).addScaledVector(m_,s).addScaledVector(g_,c).addScaledVector(v_,l),p_.set(0,0,0).addScaledVector(h_,s).addScaledVector(__,c).addScaledVector(y_,l);let S=s*12+c*_+l*x,C=(1-Math.max(s,c,l))*S*.35;if(f_.y+=C,Xm.position.copy(f_),Uh>0){let e=Uh*Uh*(s+(1-s)*.25);Xm.position.x+=(Math.random()-.5)*e*.9,Xm.position.y+=(Math.random()-.5)*e*.7,Xm.position.z+=(Math.random()-.5)*e*.5,Uh=Math.max(0,Uh-t*3.2)}Xm.lookAt(p_),Xm.fov=(f+Nh*9)*s+(g+Nh*2.5)*c+v*l,Xm.near=Math.max(.5,S*.12*(1-s)),Xm.far=1500+S*3,Xm.updateProjectionMatrix();{let e=nm(Xm.position.distanceTo(p_),Xm.fov,th.lowH);b_.set(1,0,0).applyQuaternion(Xm.quaternion),x_.set(0,1,0).applyQuaternion(Xm.quaternion),Xm.position.toArray(S_),b_.toArray(C_),x_.toArray(w_),Xm.position.fromArray(rm(S_,C_,w_,e,S_))}D_.x=p_.x,D_.y=p_.y,D_.z=p_.z,D_.dist=f_.distanceTo(p_),D_.half=e(s*70+c*(m?125:135)+l*130,60,140),Hg.classList.toggle(`off`,s<.6),A_=s>=.6}var A_=!0;function j_(){let e=K_||$?.player;if(!e)return{mode:_h};let t=Xm.getWorldDirection(T_);return{mode:_h,pitchDeg:+(Math.asin(-t.y)*180/Math.PI).toFixed(2),height:+(Xm.position.y-e.y).toFixed(2),distance:+Xm.position.distanceTo(E_.set(e.x,e.y,e.z)).toFixed(2),fov:+Xm.fov.toFixed(2),behind:+((e.x-Xm.position.x)*Math.sin(l_.yaw)+(e.z-Xm.position.z)*Math.cos(l_.yaw)).toFixed(2),aspect:+Xm.aspect.toFixed(3),carScreenPct:+((1-E_.set(e.x,e.y,e.z).project(Xm).y)*50).toFixed(1)}}var M_={i:0},N_={};function P_(){if(!Ah||!$)return;let e=$.player,t=Qh()&&xh!==`menu`&&!e.pit.stage&&$.phase!==`done`&&!e.finished;Ah.mesh.visible!==t&&Ah.setEnabled(t),t&&Ah.update(K_?K_.s:e.s,Math.abs(e.v),e.grip)}function F_(e,t=e){for(let n of $.cars){let r=n.mesh;if(!r)continue;let i=lm(n,W_,n._r||={},Q.length);r.group.position.set(i.x,i.y,i.z),r.group.rotation.y=i.theta,n.isPlayer&&K_&&(K_.x=i.x,K_.y=i.y,K_.z=i.z,K_.theta=i.theta,K_.s=i.s,K_.d=i.d);let a=r.st;a.v=n.v,a.steer=i.steer,a.longAcc=n.longAcc,a.latAcc=n.latAcc||0,a.surface=n.surface,a.lockup=n.lockup,a.flat=n.flat,a.brake=n.brk,a.rain=$.rain,a.roll=i.roll,a.pitch=i.pitch,a.s=i.s,a.lift=n.isPlayer?lh.fx.lift:0,r.tire!==n.tire&&r.setTire(n.tire),ip(r,a,t),kh.emitCar(n,r,i,e,n.cls.id),r.mark&&(r.mark.visible=vh.chase<.5,r.mark.scale.setScalar(1)),r.group.scale.setScalar(1+3*vh.full)}if(kh.update(e),ph){let e=$.phase===`racing`&&$.lapTimer.g>=0?Wu(mh,Ru($.lapTimer,$.time-(1-W_)*om),N_):null;if(ph.group.visible=!!e,e){let t=Q.locate(e.x,e.z,M_.i,void 0,30);M_.i=t.i;let n=fe(Q,t.s);ph.group.position.set(e.x,n.y,e.z),ph.group.rotation.y=e.theta,ph.pivot.rotation.x=-n.pitch,ph.pivot.rotation.z=n.roll}}}var I_=new am,L_=new im,R_=0,z_=0;function B_(t){let n=$p(eh.level),r=em(eh.level);eh.level=e(Math.round(t),0,2),eh.gov.level=eh.level,lh.setQuality(eh.level),em(eh.level)!==r&&(Jm.samples=em(eh.level),Jm.dispose()),$p(eh.level)!==n&&nh(),I_.force()}function V_(e){if(e<=0)return;let t=1/e;if(eh.fps+=(t-eh.fps)*(1-Math.exp(-e/.5)),!eh.auto||xh===`menu`||xh===`paused`||document.hidden)return;let n=eh.gov.update(e,eh.fps);n!==null&&B_(n)}var H_=performance.now(),U_=0,W_=1,G_=performance.memory||null,K_=null,q_=()=>{if($){for(let e of $.cars)sm(e);W_=1}};function J_(e){requestAnimationFrame(J_);let t=Math.max(0,(e-H_)/1e3),n=Math.min(.05,t);if(H_=e,t>0&&t<.5&&L_.add(t*1e3,G_?G_.usedJSHeapSize:-1),Jh-=n,$&&(xh===`racing`||xh===`paused`)&&c_(),$&&xh===`racing`){if(s_(),bh)U_=0,q_();else{let e=um(U_,Math.min(.1,t));U_=e.acc;for(let t=0;t<e.n;t++){for(let e of $.cars)sm(e);let e=$.player;if(!$.autopilot&&!e.finished&&!e.pit.stage){let t=ih.poll(),n=e.input;n.steer=t.steer,n.throttle=t.throttle,n.brake=t.brake,n.boost=t.boost}$.step(om)}W_=U_/om}($.rain!==Rh||$.wetness!==zh)&&(Rh=$.rain,zh=$.wetness,lh.setWeather({rain:Rh,wetness:zh}));let e=$.goFlash>0;($.lights!==Bh||e!==Vh)&&(Bh=$.lights,Vh=e,lh.setStartLights(Bh,Vh));let r=$.player;a_(n),n_(),r.finished&&!Sh&&(Sh=!0,Yh=setTimeout(()=>{$.simulateToEnd(),Qg()},2200)),Jh<=0&&(Xg(),Jh=.05),Gh-=n,Gh<0&&Y(`sect`).classList.remove(`on`),qh-=n,qh<0&&(Y(`split`).textContent=``),Kh-=n,Kh<0&&(Y(`msg`).textContent=$.phase===`countdown`?`GET READY`:``),Hh-=t,A_&&Hh<=0&&(Kg(),Hh=1/30)}else xh===`paused`&&ah.engine(0,1,0,!1);if(xh!==`racing`&&(Lh*=.8),xh===`menu`){let t=e/1e3*.08,n=Q.at(t*300%Q.length);Xm.position.set(n.x+40,n.y+30,n.z+40),Xm.lookAt(n.x,n.y,n.z),Xm.fov=58,Xm.near=.5,Xm.far=1500,Xm.updateProjectionMatrix(),Object.assign(D_,{x:n.x,y:n.y,z:n.z,half:70,dist:55}),lh.setPit(null)}else if($){K_?.__src!==$.player&&(K_=Object.create($.player),K_.__src=$.player),F_(xh===`racing`?n:0,xh===`racing`?Math.min(t,.1):0),P_(),k_(n);let e=$.player;lh.setPit(e.pit.stage||e.pit.request?{stage:e.pit.stage,request:e.pit.request,serv:e.pit.serv,choice:e.pit.choice,teamIndex:e.teamIndex,colors:{c1:e.team.c1,c2:e.team.c2},car:e.mesh}:null)}xh===`editor`&&Bg(),lh.update(n,Xm,D_);let r=lh.fx,i=$m.uniforms;i.speed.value=Lh,i.rain.value=r.rain,i.time.value=r.time,i.sat.value=r.sat,i.tint.value.set(r.tint[0],r.tint[1],r.tint[2]),V_(Math.min(.5,t)),(eh.level>0||I_.due(t))&&(qm.shadowMap.needsUpdate=!0),qm.setRenderTarget(Jm),qm.render(Ym,Xm),R_=qm.info.render.calls,z_=qm.info.render.triangles,qm.setRenderTarget(null),qm.setViewport(th.vx,th.vy,th.vw,th.vh),qm.render(Zm,Qm)}requestAnimationFrame(J_),bg();var Y_=new URLSearchParams(location.search);if(Y_.get(`touch`)===`1`&&document.body.classList.add(`touch`),Y_.get(`autostart`)===`1`){cg({...Y_.get(`mode`)?{mode:Y_.get(`mode`)}:{},...Y_.get(`diff`)?{difficulty:Y_.get(`diff`)}:{},...Y_.get(`cls`)?{cls:Y_.get(`cls`)}:{},...Y_.get(`laps`)?{laps:+Y_.get(`laps`)}:{},...Y_.get(`track`)?{track:Y_.get(`track`)}:{},weather:Y_.get(`weather`)||`dry`}),ug(!0);let e=Y_.get(`cam`);e&&dg(e,!0)}Y_.get(`camlog`)===`1`&&setInterval(()=>console.log(`camlog`,JSON.stringify(j_())),1e3),Y_.get(`q`)&&(eh.auto=!1,B_(+Y_.get(`q`))),window.__game={startLights:()=>$?{phase:$.phase,lights:$.lights,go:$.phase!==`countdown`&&$.goFlash>0}:null,showResults:()=>{$&&($.solo||$.simulateToEnd(),Qg())},feel:()=>({fovKick:Nh,fxSpeed:Lh,shake:Uh}),camDebug:j_,startRace:e=>cg(e),setRain:e=>{$?.setRain(e),$&&lh.setWeather({rain:$.rain,wetness:$.wetness})},enterPit:()=>{$&&$.requestPit($.player,!0)},fps:()=>eh.fps,setLineGuide:eg,lineGuide:()=>({enabled:!!Ah?.mesh.visible,allowed:Qh(),hard:Z.difficulty===`hard`,saved:Z.lineGuide,...Ah?.status||{}}),carFx:kh,boards:()=>jh?.plan||[],perfStats:(e=!1)=>{let t={...L_.snapshot(),quality:eh.level,lowRes:th.lowW+`x`+th.lowH,k:th.k,msaa:Jm.samples,drawCalls:R_,triangles:z_};return e&&L_.reset(),t},setAutopilot:ug,toggleCamera:fg,setCamera:dg,setQuality:B_,hold:(e=!0)=>{bh=!!e},pitService:(e=`dry`,t=1.2,n=!0)=>{let r=$.player,i=Q,a=i.boxU(r.teamIndex)-.6,o=(a%i.length+i.length)%i.length,s=i.at(a,i.boxD(Math.floor(o/i.ds)%i.n));return r.x=s.x,r.z=s.z,r.y=s.y,r.theta=i.thetaAt(a),r.s=o,r.idx=i.locateGlobal(s.x,s.z).i,r.v=0,r.steer=0,Object.assign(r.pit,{stage:2,request:!0,timer:0,serv:e?t:0,choice:e||null}),bh=n,Mh.init=!1,Mh.yaw=r.theta,l_.yaw=r.theta,l_.lastX=void 0,q_(),{s:o,x:s.x,z:s.z}},setMute:pg,setPaused:gg,finishSession:Zg,showMenu:hg,choosePitTire:e=>$?.choosePitTire(e),fastForward:e=>{for(let t=0;t<e;t+=1/60)$.step(1/60);s_(),q_()},finishNow:()=>{$.autopilot=!0},teleport:(e,t=0)=>{let n=$.player,r=Q.at(e,t);n.x=r.x,n.z=r.z,n.theta=Q.thetaAt(e),n.s=e,n.idx=Q.locateGlobal(r.x,r.z).i,Mh.init=!1,Mh.yaw=n.theta,q_()},save:sh,opts:Z,DIFFICULTY:qu,get race(){return $},get camMix(){return 1-vh.chase},get camMode(){return _h},get quality(){return eh.level},get track(){return Q},get theme(){return lh},get career(){return X},setTrack:e=>(sg(e),tg(),Q.id),showCareer:()=>{X||=Lm({difficulty:Z.difficulty,weather:Z.weather},ch),Bm(oh,X),wg()},showStandings:()=>Eg(),showUpgrades:()=>{xg=`career`,Dg()},showEditor:()=>Ag(`menu`),seedCareer:()=>{X=Lm({driverName:`Casey Morrow`,number:17,team:{name:`Northline Racing`,livery:{pattern:`chevrons`,c1:15222570,c2:16765514,c3:1381658,number:17}},difficulty:Z.difficulty||`normal`});let e=[{id:`player`,isPlayer:!0,pos:2},...X.rivals.map(e=>e.id).map((e,t)=>({id:e,pos:t===0?1:t+2}))];return Wm(X,e),X.upgradePoints=14,Bm(oh,X),ch={driver:{...X.driver},team:X.team},Om(oh,ch),X},state:()=>({state:xh,phase:$?.phase,pos:$?.player.pos,lap:$?.player.laps,rain:$?.rain,wet:$?.wetness,tire:$?.player.tire,wear:$?.player.wear,pit:$?.player.pit.stage,autopilot:$?.autopilot,camMix:1-vh.chase,cam:_h,quality:eh.level})};