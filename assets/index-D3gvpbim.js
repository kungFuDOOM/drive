(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=(e,t,n)=>Math.min(n,Math.max(t,e)),t=(e,t,n)=>e+(t-e)*n,n=(t,n,r)=>{let i=e((r-t)/(n-t),0,1);return i*i*(3-2*i)};function r(e){for(;e>Math.PI;)e-=2*Math.PI;for(;e<-Math.PI;)e+=2*Math.PI;return e}function i(e,t){return e=(e%t+t)%t,e>=t/2?e-t:e}var a={gp:{id:`gp`,name:`GP`,vTop:88,accel:26,brake:34,latBase:30,down:.48,steer:.09,wear:1},speedway:{id:`speedway`,name:`Speedway`,vTop:97,accel:22,brake:29,latBase:24,down:.3,steer:.08,wear:.85}};function o(e,t=0){let n=t>e/2?t-e:t;return{L:e,progress:n,prevS:(t%e+e)%e,maxLaps:Math.max(0,Math.floor(n/e))}}function s(e,t){e.progress+=i(t-e.prevS,e.L),e.prevS=t;let n=Math.max(0,Math.floor(e.progress/e.L));return n>e.maxLaps&&(e.maxLaps=n,!0)}var c={asphalt:{grip:1,drag:0},pit:{grip:1,drag:0},kerb:{grip:.95,drag:.05},grass:{grip:.5,drag:.6},gravel:{grip:.35,drag:1.1}};function l(t,n){let r=e(n,0,1);return t===`wet`?.84+.12*r:1-.55*r}function u(t){return 1-.4*e(t,0,1)**1.3}function d({tire:e,wear:t=0,wetness:n=0,surface:r=`asphalt`}){let i=c[r]||c.asphalt;return l(e,n)*u(t)*i.grip}function f(t,n,r,i=1){return(.001+.005*e(Math.abs(n)/50,0,1))*(t===`wet`?1+1.5*(1-e(r,0,1)):1)*i}function p(e,t,n){let r=t/60;return e.latBase*(1+e.down*r*r)*n}function m(e,t,n=1){t=Math.abs(t);let r=e.latBase*n,i=t-r*e.down/3600;return i<=1e-6?e.vTop*1.2:Math.min(e.vTop*1.2,Math.sqrt(r/i))}var h=1.2,g=.42,_=(e,t,n)=>p(e,t,n)*h;function v(t,n,r){let i=e(n/60,0,1.5);return t.brake*(.45+.55*Math.min(1,r))*(1+.25*i*i)}function y(t){let n=e(t,0,1);return Math.max(g,Math.sqrt(1-n*n))}function b(e,t,n,r,i=0){let a=_(e,t,n)*y(i);return v(e,t,n)*r/Math.max(a,1)}function x(t,n,r,i,a=0,o={k:0,excess:0,frac:0}){let s=Math.abs(r),c=n*t.steer/(1+s/28*(s/28)),l=p(t,s,i*y(a))/Math.max(s*s,1),u=e(c,-l,l),d=Math.abs(c)/Math.max(l,1e-4);return o.k=u,o.excess=e(d-1,0,2),o.frac=d,o}var S={k:0,excess:0,frac:0};function C(e,t,n,r,i=0){return x(e,t,n,r,i,S).k}function w(t,n){if(t<0||t>30)return 0;let r=1-e(Math.abs(n)/2.6,0,1),i=1-t/30;return .45*i*i*r}function T(t,{fill:n=0,boosting:r=!1,dt:i}){return r&&t>0?Math.max(0,t-.28*i):e(t+n*i,0,1)}var E={fovDeg:35,pitchDeg:42,widthLandscape:140,widthPortrait:55,carScreenOffset:.55,carScreenOffsetPortrait:.225,blendAspect:[.8,1.2]},D=e=>e*Math.PI/180;function O({x:e,y:t,z:r,yaw:i,aspect:a,zoom:o=1}){let s=E.fovDeg,c=D(E.pitchDeg),l=2*Math.atan(Math.tan(D(s)/2)*a),u=n(E.blendAspect[0],E.blendAspect[1],a),d=E.widthPortrait+(E.widthLandscape-E.widthPortrait)*u,f=E.carScreenOffsetPortrait+(E.carScreenOffset-E.carScreenOffsetPortrait)*u,p=d/2/Math.tan(l/2)*o,m=p*Math.cos(c),h=p*Math.sin(c),g=c+f*D(s)/2,_=Math.max(0,m-h/Math.tan(g)),v=Math.sin(i),y=Math.cos(i),b=[e+v*_,t,r+y*_];return{pos:[b[0]-v*m,t+h,b[2]-y*m],target:b,fov:s,pitchDeg:E.pitchDeg,height:h,distance:p,lead:_}}function k(e,t,n,r,i){let a=e-n,o=(t+r*a)*i,s=Math.exp(-r*i);return[n+(a+o)*s,(t-r*o)*s]}function A(e,t,n,r,i){let a=k(e[t],e[t+`V`]||0,n,r,i);return e[t]=a[0],e[t+`V`]=a[1],e[t]}function j(e,t,n,i){return A(e,`yaw`,e.yaw+r(t-e.yaw),n,i)}function M(e,t,n,r){let i=e.locate(t,n,r,void 0,60);return e.yAt(i.s)}function N(e,t,n,r=.8){return(n>=0?e.leftWall[t]:e.rightWall[t])-r}function ee(e,t,n,r,i=.8,a=12){let o=Math.abs(e.locate(t.x,t.z,r,void 0,60).d),s=0;for(let c=1;c<=a;c++){let l=c/a,u=e.locate(t.x+(n.x-t.x)*l,t.z+(n.z-t.z)*l,r,void 0,60);if(Math.abs(u.d)>N(e,u.i,u.d,i)&&Math.abs(u.d)>o+.05)break;s=l}return s}var P=.26,F=.9,I=1.95,te=4.3,ne=3.2,re=18*Math.PI/180,ie=21*Math.PI/180,ae=[0,.25,.5,.75,1],oe={set(e,t,n){return this.x=e,this.y=t,this.z=n,this}};function se(e,t,n,r){let i=1e9;for(let a=n;a<=r;a+=5){let n=e._idx(t+a)[0];i=Math.min(i,e.leftWall[n],e.rightWall[n])}return i}function L(t,i,a,o,s={}){let c=s.fovDeg??62,l=s.aspect??16/9,u=e(i.v/80,0,1),d=n(8,16,se(a,i.s,-10,15+i.v*.8)),f=(8+u*2.4)*(.68+.32*d),p=12+u*8,m=a.yAt(i.s);t.init||(t.init=!0,t.yaw=i.theta,t.ox=-Math.sin(i.theta)*f,t.oz=-Math.cos(i.theta)*f,t.oy=F+P*f,t.ly=1,t.pull=1,t.swing=0,t.oxV=t.ozV=t.oyV=t.yawV=t.lyV=t.swingV=0);let h=a.thetaAt(i.s+2),g=h+e(r(i.theta-h),-.6,.6)+e(s.motionLag||0,-.085,.085);a.at(i.s-f,(i.d??0)*.5,oe);let _=r(Math.atan2(i.x-oe.x,i.z-oe.z)-g),v=1,y=-1;for(let e of ae){let t=g+_*e,n=ee(a,i,{x:i.x-Math.sin(t)*f,z:i.z-Math.cos(t)*f},i.idx);if(n>y+1e-6&&(y=n,v=e),n>=1)break}A(t,`swing`,v,7,o),j(t,g+_*e(t.swing,0,1),4.5+4*e(t.swing,0,1),o);let b=Math.sin(t.yaw),x=Math.cos(t.yaw);A(t,`ox`,-b*f,6.5,o),A(t,`oz`,-x*f,6.5,o);let S=i.x+t.ox,C=i.z+t.oz,w=Math.hypot(t.ox,t.oz)||1,T=ee(a,i,{x:S,z:C},i.idx);t.pull=T<t.pull?Math.max(T,t.pull-75*o/w):t.pull+(T-t.pull)*(1-Math.exp(-o*3));let E=Math.max(t.pull*w,Math.min(ne,w)),D=E/w,O=i.x+t.ox*D,k=i.z+t.oz*D,N=M(a,O,k,i.idx);A(t,`oy`,e(F+P*E+(N-m)*.5,I,te),7,o);let L=Math.max(m+e(t.oy,I,te),N+1.5);A(t,`ly`,1+(a.yAt(i.s+p)-m)*.5,6,o),a.at(i.s+p,(i.d??0)*.5,oe);let ce=oe.x-O,le=oe.z-k,ue=[i.x,i.y+.9,i.z],de=Math.max(Math.hypot(ce,le),1),R=i.x-O,fe=i.z-k,pe=Math.hypot(R,fe)||1,me=c*Math.PI/360,he=Math.atan(Math.tan(me)*l),ge=Math.min(me,he)*.55,_e=Math.atan2(R,fe),ve=_e+e(r(Math.atan2(ce,le)-_e),-ge,ge),ye=Math.atan2(L-ue[1],pe),z=Math.atan2(L-(m+t.ly),de),be=Math.min(e(Math.min(z,re),ye-ge,ye+ge),ie),xe=[O+Math.sin(ve)*de,L-Math.tan(be)*de,k+Math.cos(ve)*de];return{pos:[O,L,k],look:xe,yaw:t.yaw}}function ce(e,t,n,{posOmega:r=7,yOmega:i=3,yawOmega:a=1.5,velOmega:o=18}={}){if(j(e,t.theta,a,n),e.lastX===void 0||n<=0||Math.hypot(t.x-e.lastX,t.z-e.lastZ)>3+200*n)e.vx=e.vy=e.vz=0;else{let r=1-Math.exp(-o*n);e.vx+=((t.x-e.lastX)/n-e.vx)*r,e.vy+=((t.y-e.lastY)/n-e.vy)*r,e.vz+=((t.z-e.lastZ)/n-e.vz)*r}return e.lastX=t.x,e.lastY=t.y,e.lastZ=t.z,A(e,`x`,t.x+e.vx*2/r,r,n),A(e,`z`,t.z+e.vz*2/r,r,n),A(e,`y`,t.y+e.vy*2/i,i,n),e}function le(t){let n=e(t,-1,1);return Math.sign(n)*Math.abs(n)**1.3}function ue(e,t=.075){let n=Math.abs(e);return n<=t?0:Math.sign(e)*le((n-t)/(1-t))}function de(t,n,r,i){let a=n*t<0,o=Math.abs(n)<Math.abs(t)||a?8.5:6.5-3*e(r,0,1);return t+e(n-t,-o*i,o*i)}function R(t,r,i,a,o=!0){let s=-t*r,c=n(.8,1.03,a)*n(22,58,Math.abs(r));return{yawRate:s,slipAngle:e(o?-s*.023*c*e(i,0,1):0,-.022,.022)}}function fe(t,n,r,i=1,a=!0){let o=a?n.slipAngle*e(i,.35,1):0;return t.slipAngle+=(o-t.slipAngle)*(1-Math.exp(-r/.09)),t.slideRate=(t.slipAngle-(t.prevSlipAngle||0))/r,t.prevSlipAngle=t.slipAngle,n.yawRate}function pe(t,r=0,i=0){let a=n(.68,1.03,t)*.58,o=n(.009,.075,Math.abs(r))*.82;return e(Math.max(a,o,e(i,0,1)),0,1)}function me(e=!1,t=0,n=0){return n<12?0:t>.62?9:e&&n>18?7:0}var he=1.9,ge=-1.65;function _e(e,t,n={y:0,pitch:0,roll:0}){let r=e.yAt(t+he),i=e.yAt(t+ge),a=(r-i)/3.55;return n.y=i+a*1.65,n.pitch=Math.atan(a),n.roll=-Math.atan(e.bankAt?e.bankAt(t):0),n}var ve=1e3,ye=1001,z=1002,be=1003,xe=1004,Se=1005,B=1006,Ce=1007,we=1008,Te=1009,V=1010,H=1011,U=1012,Ee=1013,De=1014,Oe=1015,ke=1016,Ae=1017,je=1018,Me=1020,Ne=35902,Pe=35899,Fe=1021,Ie=1022,Le=1023,Re=1026,ze=1027,Be=1028,Ve=1029,He=1030,Ue=1031,We=1033,Ge=33776,Ke=33777,qe=33778,Je=33779,Ye=35840,Xe=35841,Ze=35842,Qe=35843,$e=36196,et=37492,tt=37496,nt=37488,rt=37489,it=37490,at=37491,ot=37808,st=37809,ct=37810,lt=37811,ut=37812,dt=37813,ft=37814,pt=37815,mt=37816,ht=37817,gt=37818,_t=37819,vt=37820,yt=37821,bt=36492,xt=36494,St=36495,Ct=36283,wt=36284,Tt=36285,Et=36286,Dt=2300,Ot=2301,kt=2302,At=2303,jt=2400,Mt=2401,Nt=2402,Pt=3200,Ft=`srgb`,It=`srgb-linear`,Lt=`linear`,Rt=`srgb`,zt=7680,Bt=35044,Vt=35048,Ht=2e3;function Ut(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Wt(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Gt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Kt(){let e=Gt(`canvas`);return e.style.display=`block`,e}var qt={};function Jt(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Yt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function W(...e){e=Yt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function G(...e){e=Yt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Xt(...e){let t=e.join(` `);t in qt||(qt[t]=!0,W(...e))}function Zt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Qt={0:0,2:6,4:4,3:5,1:1,6:2,7:7,5:3},$t=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},en=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),tn=Math.PI/180,nn=180/Math.PI;function rn(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(en[e&255]+en[e>>8&255]+en[e>>16&255]+en[e>>24&255]+`-`+en[t&255]+en[t>>8&255]+`-`+en[t>>16&15|64]+en[t>>24&255]+`-`+en[n&63|128]+en[n>>8&255]+`-`+en[n>>16&255]+en[n>>24&255]+en[r&255]+en[r>>8&255]+en[r>>16&255]+en[r>>24&255]).toLowerCase()}function an(e,t,n){return Math.max(t,Math.min(n,e))}function on(e,t){return(e%t+t)%t}function sn(e,t,n){return(1-n)*e+n*t}function cn(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function ln(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function un(e,t){if(t.constructor===Float32Array)return e;let n=ln(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.max(e/n,-1)}function dn(e,t){if(t.constructor===Float32Array)return e;let n=ln(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.round(e*n)}var fn=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=an(this.x,e.x,t.x),this.y=an(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=an(this.x,e,t),this.y=an(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(an(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(an(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},pn=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:W(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(an(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},K=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(hn.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(hn.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=an(this.x,e.x,t.x),this.y=an(this.y,e.y,t.y),this.z=an(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=an(this.x,e,t),this.y=an(this.y,e,t),this.z=an(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(an(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return mn.copy(this).projectOnVector(e),this.sub(mn)}reflect(e){return this.sub(mn.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(an(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},mn=new K,hn=new pn,gn=class{static{this.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Xt(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(_n.makeScale(e,t)),this}rotate(e){return Xt(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(_n.makeRotation(-e)),this}translate(e,t){return Xt(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(_n.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},_n=new gn,vn=new gn().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yn=new gn().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function bn(){let e={enabled:!0,workingColorSpace:It,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Sn(e.r),e.g=Sn(e.g),e.b=Sn(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Cn(e.r),e.g=Cn(e.g),e.b=Cn(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Lt:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[n].fromXYZ).multiply(this.spaces[t].toXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[It]:{primaries:t,whitePoint:r,transfer:Lt,toXYZ:vn,fromXYZ:yn,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ft},outputColorSpaceConfig:{drawingBufferColorSpace:Ft}},[Ft]:{primaries:t,whitePoint:r,transfer:Rt,toXYZ:vn,fromXYZ:yn,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ft}}}),e}var xn=bn();function Sn(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Cn(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var wn,Tn=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{wn===void 0&&(wn=Gt(`canvas`)),wn.width=e.width,wn.height=e.height;let t=wn.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=wn}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Gt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Sn(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Sn(t[e]/255)*255):t[e]=Sn(t[e]);return{data:t,width:e.width,height:e.height}}return W(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},En=0,Dn=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:En++}),this.uuid=rn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width||0,t.height||0,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(On(r[t].image)):e.push(On(r[t]))}else e=On(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function On(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Tn.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(W(`Texture: Unable to serialize Texture.`),{})}var kn=0,An=new K,jn=class e extends $t{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=ye,i=ye,a=B,o=we,s=Le,c=Te,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:kn++}),this.uuid=rn(),this.name=``,this.source=new Dn(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new fn(0,0),this.repeat=new fn(1,1),this.center=new fn(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new gn,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(An).x}get height(){return this.source.getSize(An).y}get depth(){return this.source.getSize(An).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){W(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?W(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ve:e.x-=Math.floor(e.x);break;case ye:e.x=e.x<0?0:1;break;case z:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case ve:e.y-=Math.floor(e.y);break;case ye:e.y=e.y<0?0:1;break;case z:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};jn.DEFAULT_IMAGE=null,jn.DEFAULT_MAPPING=300,jn.DEFAULT_ANISOTROPY=1;var Mn=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=an(this.x,e.x,t.x),this.y=an(this.y,e.y,t.y),this.z=an(this.z,e.z,t.z),this.w=an(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=an(this.x,e,t),this.y=an(this.y,e,t),this.z=an(this.z,e,t),this.w=an(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(an(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Nn=class extends $t{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:B,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Mn(0,0,e,t),this.scissorTest=!1,this.viewport=new Mn(0,0,e,t),this.textures=[];let r=n.count;for(let i=0;i<r;i++)this.textures[i]=new jn({width:e,height:t,depth:n.depth}),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:B,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Dn(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Pn=class extends Nn{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Fn=class extends jn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=be,this.minFilter=be,this.wrapR=ye,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},In=class extends jn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=be,this.minFilter=be,this.wrapR=ye,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Ln=class e{static{this.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Rn.setFromMatrixColumn(e,0).length(),i=1/Rn.setFromMatrixColumn(e,1).length(),a=1/Rn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Bn,e,Vn)}lookAt(e,t,n){let r=this.elements;return Wn.subVectors(e,t),Wn.lengthSq()===0&&(Wn.z=1),Wn.normalize(),Hn.crossVectors(n,Wn),Hn.lengthSq()===0&&(Math.abs(n.z)===1?Wn.x+=1e-4:Wn.z+=1e-4,Wn.normalize(),Hn.crossVectors(n,Wn)),Hn.normalize(),Un.crossVectors(Wn,Hn),r[0]=Hn.x,r[4]=Un.x,r[8]=Wn.x,r[1]=Hn.y,r[5]=Un.y,r[9]=Wn.y,r[2]=Hn.z,r[6]=Un.z,r[10]=Wn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],ee=r[7],P=r[11],F=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*ee,i[8]=a*C+o*D+s*j+c*P,i[12]=a*w+o*O+s*M+c*F,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*ee,i[9]=l*C+u*D+d*j+f*P,i[13]=l*w+u*O+d*M+f*F,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*ee,i[10]=p*C+m*D+h*j+g*P,i[14]=p*w+m*O+h*M+g*F,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*ee,i[11]=_*C+v*D+y*j+b*P,i[15]=_*w+v*O+y*M+b*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Rn.set(r[0],r[1],r[2]).length(),o=Rn.set(r[4],r[5],r[6]).length(),s=Rn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),zn.copy(this);let c=1/a,l=1/o,u=1/s;return zn.elements[0]*=c,zn.elements[1]*=c,zn.elements[2]*=c,zn.elements[4]*=l,zn.elements[5]*=l,zn.elements[6]*=l,zn.elements[8]*=u,zn.elements[9]*=u,zn.elements[10]*=u,t.setFromRotationMatrix(zn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Ht,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Ht,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Rn=new K,zn=new Ln,Bn=new K(0,0,0),Vn=new K(1,1,1),Hn=new K,Un=new K,Wn=new K,Gn=new Ln,Kn=new pn,qn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(an(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-an(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(an(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-an(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(an(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-an(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:W(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Gn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Gn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Kn.setFromEuler(this),this.setFromQuaternion(Kn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};qn.DEFAULT_ORDER=`XYZ`;var Jn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Yn=0,Xn=new K,Zn=new pn,Qn=new Ln,$n=new K,er=new K,tr=new K,nr=new pn,rr=new K(1,0,0),ir=new K(0,1,0),ar=new K(0,0,1),or={type:`added`},sr={type:`removed`},cr={type:`childadded`,child:null},lr={type:`childremoved`,child:null},ur=class e extends $t{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yn++}),this.uuid=rn(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new K,n=new qn,r=new pn,i=new K(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ln},normalMatrix:{value:new gn}}),this.matrix=new Ln,this.matrixWorld=new Ln,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Jn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Zn.setFromAxisAngle(e,t),this.quaternion.multiply(Zn),this}rotateOnWorldAxis(e,t){return Zn.setFromAxisAngle(e,t),this.quaternion.premultiply(Zn),this}rotateX(e){return this.rotateOnAxis(rr,e)}rotateY(e){return this.rotateOnAxis(ir,e)}rotateZ(e){return this.rotateOnAxis(ar,e)}translateOnAxis(e,t){return Xn.copy(e).applyQuaternion(this.quaternion),this.position.add(Xn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(rr,e)}translateY(e){return this.translateOnAxis(ir,e)}translateZ(e){return this.translateOnAxis(ar,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Qn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?$n.copy(e):$n.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),er.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Qn.lookAt(er,$n,this.up):Qn.lookAt($n,er,this.up),this.quaternion.setFromRotationMatrix(Qn),r&&(Qn.extractRotation(r.matrixWorld),Zn.setFromRotationMatrix(Qn),this.quaternion.premultiply(Zn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(G(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(or),cr.child=e,this.dispatchEvent(cr),cr.child=null):G(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(sr),lr.child=e,this.dispatchEvent(lr),lr.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Qn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Qn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Qn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(or),cr.child=e,this.dispatchEvent(cr),cr.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,e,tr),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,nr,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};ur.DEFAULT_UP=new K(0,1,0),ur.DEFAULT_MATRIX_AUTO_UPDATE=!0,ur.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var dr=class extends ur{constructor(){super(),this.isGroup=!0,this.type=`Group`}},fr={type:`move`},pr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new dr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new dr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new K,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new K),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new dr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new K,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new K,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.quaternion,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(fr)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new dr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},mr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hr={h:0,s:0,l:0},gr={h:0,s:0,l:0};function _r(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var q=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ft){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,xn.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=xn.workingColorSpace){return this.r=e,this.g=t,this.b=n,xn.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=xn.workingColorSpace){if(e=on(e,1),t=an(t,0,1),n=an(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=_r(i,r,e+1/3),this.g=_r(i,r,e),this.b=_r(i,r,e-1/3)}return xn.colorSpaceToWorking(this,r),this}setStyle(e,t=Ft){function n(t){t!==void 0&&parseFloat(t)<1&&W(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseFloat(i[1]))/100,Math.min(100,parseFloat(i[2]))/100,Math.min(100,parseFloat(i[3]))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:W(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);W(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ft){let n=mr[e.toLowerCase()];return n===void 0?W(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Sn(e.r),this.g=Sn(e.g),this.b=Sn(e.b),this}copyLinearToSRGB(e){return this.r=Cn(e.r),this.g=Cn(e.g),this.b=Cn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ft){return xn.workingToColorSpace(vr.copy(this),e),Math.round(an(vr.r*255,0,255))*65536+Math.round(an(vr.g*255,0,255))*256+Math.round(an(vr.b*255,0,255))}getHexString(e=Ft){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=xn.workingColorSpace){xn.workingToColorSpace(vr.copy(this),t);let n=vr.r,r=vr.g,i=vr.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=xn.workingColorSpace){return xn.workingToColorSpace(vr.copy(this),t),e.r=vr.r,e.g=vr.g,e.b=vr.b,e}getStyle(e=Ft){xn.workingToColorSpace(vr.copy(this),e);let t=vr.r,n=vr.g,r=vr.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(hr),this.setHSL(hr.h+e,hr.s+t,hr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(hr),e.getHSL(gr);let n=sn(hr.h,gr.h,t),r=sn(hr.s,gr.s,t),i=sn(hr.l,gr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},vr=new q;q.NAMES=mr;var yr=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new q(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},br=class extends ur{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new qn,this.environmentIntensity=1,this.environmentRotation=new qn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background===null?null:e.background.clone(),this.environment=e.environment===null?null:e.environment.clone(),this.fog=e.fog===null?null:e.fog.clone(),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial===null?null:e.overrideMaterial.clone(),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},xr=new K,Sr=new K,Cr=new K,wr=new K,Tr=new K,Er=new K,Dr=new K,Or=new K,kr=new K,Ar=new K,jr=new Mn,Mr=new Mn,Nr=new Mn,Pr=class e{constructor(e=new K,t=new K,n=new K){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),xr.subVectors(e,t),r.cross(xr);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){xr.subVectors(r,t),Sr.subVectors(n,t),Cr.subVectors(e,t);let a=xr.dot(xr),o=xr.dot(Sr),s=xr.dot(Cr),c=Sr.dot(Sr),l=Sr.dot(Cr),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,wr)!==null&&wr.x>=0&&wr.y>=0&&wr.x+wr.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,wr)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,wr.x),s.addScaledVector(a,wr.y),s.addScaledVector(o,wr.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return jr.setScalar(0),Mr.setScalar(0),Nr.setScalar(0),jr.fromBufferAttribute(e,t),Mr.fromBufferAttribute(e,n),Nr.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(jr,i.x),a.addScaledVector(Mr,i.y),a.addScaledVector(Nr,i.z),a}static isFrontFacing(e,t,n,r){return xr.subVectors(n,t),Sr.subVectors(e,t),xr.cross(Sr).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return xr.subVectors(this.c,this.b),Sr.subVectors(this.a,this.b),xr.cross(Sr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Tr.subVectors(r,n),Er.subVectors(i,n),Or.subVectors(e,n);let s=Tr.dot(Or),c=Er.dot(Or);if(s<=0&&c<=0)return t.copy(n);kr.subVectors(e,r);let l=Tr.dot(kr),u=Er.dot(kr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0&&s-l>0)return a=s/(s-l),t.copy(n).addScaledVector(Tr,a);Ar.subVectors(e,i);let f=Tr.dot(Ar),p=Er.dot(Ar);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Er,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Dr.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Dr,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Tr,a).addScaledVector(Er,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Fr=class{constructor(e=new K(1/0,1/0,1/0),t=new K(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Lr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Lr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Lr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Lr):Lr.fromBufferAttribute(r,t),Lr.applyMatrix4(e.matrixWorld),this.expandByPoint(Lr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Rr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Rr.copy(e.boundingBox)),Rr.applyMatrix4(e.matrixWorld),this.union(Rr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Lr),Lr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Gr),Kr.subVectors(this.max,Gr),zr.subVectors(e.a,Gr),Br.subVectors(e.b,Gr),Vr.subVectors(e.c,Gr),Hr.subVectors(Br,zr),Ur.subVectors(Vr,Br),Wr.subVectors(zr,Vr);let t=[0,-Hr.z,Hr.y,0,-Ur.z,Ur.y,0,-Wr.z,Wr.y,Hr.z,0,-Hr.x,Ur.z,0,-Ur.x,Wr.z,0,-Wr.x,-Hr.y,Hr.x,0,-Ur.y,Ur.x,0,-Wr.y,Wr.x,0];return!Yr(t,zr,Br,Vr,Kr)||(t=[1,0,0,0,1,0,0,0,1],!Yr(t,zr,Br,Vr,Kr))?!1:(qr.crossVectors(Hr,Ur),t=[qr.x,qr.y,qr.z],Yr(t,zr,Br,Vr,Kr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Lr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Lr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Ir[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ir[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ir[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ir[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ir[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ir[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ir[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ir[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ir)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Ir=[new K,new K,new K,new K,new K,new K,new K,new K],Lr=new K,Rr=new Fr,zr=new K,Br=new K,Vr=new K,Hr=new K,Ur=new K,Wr=new K,Gr=new K,Kr=new K,qr=new K,Jr=new K;function Yr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Jr.fromArray(e,a);let o=i.x*Math.abs(Jr.x)+i.y*Math.abs(Jr.y)+i.z*Math.abs(Jr.z),s=t.dot(Jr),c=n.dot(Jr),l=r.dot(Jr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Xr=new K,Zr=new fn,Qr=0,$r=class extends $t{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Qr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Bt,this.updateRanges=[],this.gpuType=Oe,this.version=0,this._normalizationScale=e===void 0?void 0:ln(e)}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Zr.fromBufferAttribute(this,t),Zr.applyMatrix3(e),this.setXY(t,Zr.x,Zr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Xr.fromBufferAttribute(this,t),Xr.applyMatrix3(e),this.setXYZ(t,Xr.x,Xr.y,Xr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Xr.fromBufferAttribute(this,t),Xr.applyMatrix4(e),this.setXYZ(t,Xr.x,Xr.y,Xr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Xr.fromBufferAttribute(this,t),Xr.applyNormalMatrix(e),this.setXYZ(t,Xr.x,Xr.y,Xr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Xr.fromBufferAttribute(this,t),Xr.transformDirection(e),this.setXYZ(t,Xr.x,Xr.y,Xr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}_denormalize(e){let t=this._normalizationScale;return t===void 0?un(e,this.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?dn(e,this.array):Math.round(e*t)}},ei=class extends $r{constructor(e,t,n){super(new Uint16Array(e),t,n)}},ti=class extends $r{constructor(e,t,n){super(new Uint32Array(e),t,n)}},ni=class extends $r{constructor(e,t,n){super(new Float32Array(e),t,n)}},ri=new Fr,ii=new K,ai=new K,oi=class{constructor(e=new K,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?ri.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ii.subVectors(e,this.center);let t=ii.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(ii,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ai.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ii.copy(e.center).add(ai)),this.expandByPoint(ii.copy(e.center).sub(ai))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},si=0,ci=new Ln,li=new ur,ui=new K,di=new Fr,fi=new Fr,pi=new K,mi=class e extends $t{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:si++}),this.uuid=rn(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Ut(e)?ti:ei)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new gn().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ci.makeRotationFromQuaternion(e),this.applyMatrix4(ci),this}rotateX(e){return ci.makeRotationX(e),this.applyMatrix4(ci),this}rotateY(e){return ci.makeRotationY(e),this.applyMatrix4(ci),this}rotateZ(e){return ci.makeRotationZ(e),this.applyMatrix4(ci),this}translate(e,t,n){return ci.makeTranslation(e,t,n),this.applyMatrix4(ci),this}scale(e,t,n){return ci.makeScale(e,t,n),this.applyMatrix4(ci),this}lookAt(e){return li.lookAt(e),li.updateMatrix(),this.applyMatrix4(li.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ui).negate(),this.translate(ui.x,ui.y,ui.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new ni(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&W(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)G(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new K(-1/0,-1/0,-1/0),new K(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];di.setFromBufferAttribute(n),this.morphTargetsRelative?(pi.addVectors(this.boundingBox.min,di.min),this.boundingBox.expandByPoint(pi),pi.addVectors(this.boundingBox.max,di.max),this.boundingBox.expandByPoint(pi)):(this.boundingBox.expandByPoint(di.min),this.boundingBox.expandByPoint(di.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&G(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new oi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)G(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new K,1/0);else if(e){let n=this.boundingSphere.center;if(di.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];fi.setFromBufferAttribute(n),this.morphTargetsRelative?(pi.addVectors(di.min,fi.min),di.expandByPoint(pi),pi.addVectors(di.max,fi.max),di.expandByPoint(pi)):(di.expandByPoint(fi.min),di.expandByPoint(fi.max))}di.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)pi.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(pi));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)pi.fromBufferAttribute(a,t),o&&(ui.fromBufferAttribute(e,t),pi.add(ui)),r=Math.max(r,n.distanceToSquared(pi))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&G(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){G(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new $r(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[],c=new Uint8Array(n.count);for(let e=0;e<n.count;e++)o[e]=new K,s[e]=new K;let l=new K,u=new K,d=new K,f=new fn,p=new fn,m=new fn,h=new K,g=new K;function _(e,t,r){c[e]=c[t]=c[r]=1,l.fromBufferAttribute(n,e),u.fromBufferAttribute(n,t),d.fromBufferAttribute(n,r),f.fromBufferAttribute(i,e),p.fromBufferAttribute(i,t),m.fromBufferAttribute(i,r),u.sub(l),d.sub(l),p.sub(f),m.sub(f);let a=1/(p.x*m.y-m.x*p.y);isFinite(a)&&(h.copy(u).multiplyScalar(m.y).addScaledVector(d,-p.y).multiplyScalar(a),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-m.x).multiplyScalar(a),o[e].add(h),o[t].add(h),o[r].add(h),s[e].add(g),s[t].add(g),s[r].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let t=0,n=v.length;t<n;++t){let n=v[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)_(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let y=new K,b=new K,x=new K,S=new K;function C(e){x.fromBufferAttribute(r,e),S.copy(x);let t=o[e];y.copy(t),y.sub(x.multiplyScalar(x.dot(t))).normalize(),b.crossVectors(S,t);let n=b.dot(s[e])<0?-1:1;a.setXYZW(e,y.x,y.y,y.z,n)}for(let e=0,t=n.count;e<t;++e)c[e]&&C(e);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new $r(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new K,i=new K,a=new K,o=new K,s=new K,c=new K,l=new K,u=new K;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)pi.fromBufferAttribute(e,t),pi.normalize(),e.setXYZ(t,pi.x,pi.y,pi.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new $r(a,r,i)}if(this.index===null)return W(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},hi=new K,gi=new K,_i=new gn,vi=class{constructor(e=new K(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=hi.subVectors(n,t).cross(gi.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(hi),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||_i.getNormalMatrix(e),r=this.coplanarPoint(hi).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},yi=0,bi=class extends $t{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:yi++}),this.uuid=rn(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new q(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=zt,this.stencilZFail=zt,this.stencilZPass=zt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){W(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?W(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new q().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new vi().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new fn().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new fn().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},xi=new K,Si=new K,Ci=new K,wi=new K,Ti=class{constructor(e=new K,t=new K(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,xi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=xi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(xi.copy(this.origin).addScaledVector(this.direction,t),xi.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Si.copy(e).add(t).multiplyScalar(.5),Ci.copy(t).sub(e).normalize(),wi.copy(this.origin).sub(Si);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Ci),o=wi.dot(this.direction),s=-wi.dot(Ci),c=wi.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Si).addScaledVector(Ci,d),f}intersectSphere(e,t){if(e.radius<0)return null;xi.subVectors(e.center,this.origin);let n=xi.dot(this.direction),r=xi.dot(xi)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,xi)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let ee=S/w,P=C/w,F=1/w,I=T-ee*D,te=E-P*D,ne=O-ee*A,re=k-P*A,ie=j-ee*N,ae=M-P*N,oe=ie*re-ae*ne,se=I*ae-te*ie,L=ne*te-re*I;if(r){if(oe<0||se<0||L<0)return null}else if((oe<0||se<0||L<0)&&(oe>0||se>0||L>0))return null;let ce=oe+se+L;if(ce===0)return null;let le=F*(oe*D+se*A+L*N);return(ce>0?le<0:le>0)?null:this.at(le/ce,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ei=class extends bi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Di=new Ln,Oi=new Ti,ki=new oi,Ai=new K,ji=new K,Mi=new K,Ni=new K,Pi=new K,Fi=new K,Ii=new K,Li=new K,Ri=class extends ur{constructor(e=new mi,t=new Ei){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Fi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Pi.fromBufferAttribute(s,e),a?Fi.addScaledVector(Pi,r):Fi.addScaledVector(Pi.sub(t),r))}t.add(Fi)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ki.copy(n.boundingSphere),ki.applyMatrix4(i),Oi.copy(e.ray).recast(e.near),ki.containsPoint(Oi.origin)===!1&&(Oi.intersectSphere(ki,Ai)===null||Oi.origin.distanceToSquared(Ai)>(e.far-e.near)**2)||(Di.copy(i).invert(),Oi.copy(e.ray).applyMatrix4(Di),(n.boundingBox===null||Oi.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Oi)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Bi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Bi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Bi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Bi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function zi(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Li.copy(s),Li.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Li);return l<n.near||l>n.far?null:{distance:l,point:Li.clone(),object:e}}function Bi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,ji),e.getVertexPosition(c,Mi),e.getVertexPosition(l,Ni);let u=zi(e,t,n,r,ji,Mi,Ni,Ii);if(u){let e=new K;Pr.getBarycoord(Ii,ji,Mi,Ni,e),i&&(u.uv=Pr.getInterpolatedAttribute(i,s,c,l,e,new fn)),a&&(u.uv1=Pr.getInterpolatedAttribute(a,s,c,l,e,new fn)),o&&(u.normal=Pr.getInterpolatedAttribute(o,s,c,l,e,new K),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new K,materialIndex:0};Pr.getNormal(ji,Mi,Ni,t.normal),u.face=t,u.barycoord=e}return u}var Vi=class extends jn{constructor(e=null,t=1,n=1,r,i,a,o,s,c=be,l=be,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Hi=class extends $r{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ui=new Ln,Wi=new Ln,Gi=[],Ki=new Fr,qi=new Ln,Ji=new Ri,Yi=new oi,Xi=class extends Ri{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Hi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,qi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Fr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ui),Ki.copy(e.boundingBox).applyMatrix4(Ui),this.boundingBox.union(Ki)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new oi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ui),Yi.copy(e.boundingSphere).applyMatrix4(Ui),this.boundingSphere.union(Yi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture===null?null:e.morphTexture.clone(),this.instanceColor=e.instanceColor===null?null:e.instanceColor.clone(),this.count=e.count,this.boundingBox=e.boundingBox===null?null:e.boundingBox.clone(),this.boundingSphere=e.boundingSphere===null?null:e.boundingSphere.clone(),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Ji.geometry=this.geometry,Ji.material=this.material,Ji.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Yi.copy(this.boundingSphere),Yi.applyMatrix4(n),e.ray.intersectsSphere(Yi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Ui),Wi.multiplyMatrices(n,Ui),Ji.matrixWorld=Wi,Ji.raycast(e,Gi);for(let e=0,n=Gi.length;e<n;e++){let n=Gi[e];n.instanceId=i,n.object=this,t.push(n)}Gi.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Hi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Vi(new Float32Array(r*this.count),r,this.count,Be,Oe));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Zi=new oi,Qi=new fn(.5,.5),$i=new K,ea=class{constructor(e=new vi,t=new vi,n=new vi,r=new vi,i=new vi,a=new vi){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ht,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zi)}intersectsSprite(e){return Zi.center.set(0,0,0),Zi.radius=.7071067811865476+Qi.distanceTo(e.center),Zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if($i.x=r.normal.x>0?e.max.x:e.min.x,$i.y=r.normal.y>0?e.max.y:e.min.y,$i.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint($i)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},ta=new Ln,na=class e{constructor(){this.coordinateSystem=Ht,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];ta.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new ea),n[e].setFromProjectionMatrix(ta,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new ea),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}},ra=class extends bi{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new q(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ia=new Ln,aa=new Ti,oa=new oi,sa=new K,ca=class extends ur{constructor(e=new mi,t=new ra){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),oa.copy(n.boundingSphere),oa.applyMatrix4(r),oa.radius+=i,e.ray.intersectsSphere(oa)===!1)return;ia.copy(r).invert(),aa.copy(e.ray).applyMatrix4(ia);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);sa.fromBufferAttribute(l,n),la(sa,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)sa.fromBufferAttribute(l,a),la(sa,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function la(e,t,n,r,i,a,o){let s=aa.distanceSqToPoint(e);if(s<n){let n=new K;aa.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var ua=class extends jn{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},da=class extends jn{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},fa=class extends jn{constructor(e,t,n=De,r,i,a,o=be,s=be,c,l=Re,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Dn(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},pa=class extends fa{constructor(e,t=De,n=301,r,i,a=be,o=be,s,c=Re){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ma=class extends jn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ha=class e extends mi{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new ni(c,3)),this.setAttribute(`normal`,new ni(l,3)),this.setAttribute(`uv`,new ni(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new K;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},ga=class e extends mi{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new K,l=new fn;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new ni(a,3)),this.setAttribute(`normal`,new ni(o,3)),this.setAttribute(`uv`,new ni(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},_a=class e extends mi{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new ni(u,3)),this.setAttribute(`normal`,new ni(d,3)),this.setAttribute(`uv`,new ni(f,2));function _(){let a=new K,_=new K,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new fn,m=new K,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},va=class e extends _a{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ya=class e extends mi{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new ni(i,3)),this.setAttribute(`normal`,new ni(i.slice(),3)),this.setAttribute(`uv`,new ni(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new K,r=new K,i=new K;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new K;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new K;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new K,t=new K,n=new K,r=new K,o=new fn,s=new fn,c=new fn;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},ba=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){W(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new fn:new K);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new K,r=[],i=[],a=[],o=new K,s=new Ln;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new K)}i[0]=new K,a[0]=new K;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(an(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(an(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}};function xa(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Sa=new K,Ca=new K,wa=new xa,Ta=new xa,Ea=new xa,Da=class extends ba{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new K){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Ca.subVectors(r[0],r[1]).add(r[0]),c=Ca);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Sa.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Sa),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),wa.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Ta.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Ea.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(wa.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Ta.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Ea.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(wa.calc(s),Ta.calc(s),Ea.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new K().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}},Oa=class e extends ya{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},ka=class e extends mi{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new ni(p,3)),this.setAttribute(`normal`,new ni(m,3)),this.setAttribute(`uv`,new ni(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Aa=class e extends mi{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new K,p=new fn;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new ni(s,3)),this.setAttribute(`normal`,new ni(c,3)),this.setAttribute(`uv`,new ni(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},ja=class e extends mi{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new K,d=new K,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new ni(p,3)),this.setAttribute(`normal`,new ni(m,3)),this.setAttribute(`uv`,new ni(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function Ma(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Pa(i))i.isRenderTargetTexture?(W(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Pa(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Na(e){let t={};for(let n=0;n<e.length;n++){let r=Ma(e[n]);for(let e in r)t[e]=r[e]}return t}function Pa(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Fa(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Ia(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:xn.workingColorSpace}var La={clone:Ma,merge:Na},Ra=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,za=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ba=class extends bi{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ra,this.fragmentShader=za,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ma(e.uniforms),this.uniformsGroups=Fa(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new q().setHex(r.value);break;case`v2`:this.uniforms[n].value=new fn().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new K().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Mn().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new gn().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Ln().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Va=class extends Ba{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Ha=class extends bi{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type=`MeshPhongMaterial`,this.color=new q(16777215),this.specular=new q(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new fn(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ua=class extends bi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new fn(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Wa=class extends bi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Pt,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ga=class extends bi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ka(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function qa(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Ja=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Ya=class extends Ja{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:jt,endingEnd:jt}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Mt:i=e,o=2*t-n;break;case Nt:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Mt:a=e,s=2*n-t;break;case Nt:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Xa=class extends Ja{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Za=class extends Ja{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Qa=class extends Ja{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=to(n,t,g,y,r);i[p]=$a(x,o,_,b,m)}return i}};function $a(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function eo(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function to(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=$a(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=eo(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var no=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Ka(t,this.TimeBufferType),this.values=Ka(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ka(e.times,Array),values:Ka(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),qa(e.settings)&&(n.settings={inTangents:Ka(e.settings.inTangents,Array),outTangents:Ka(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Za(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Xa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ya(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Qa(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Dt:t=this.InterpolantFactoryMethodDiscrete;break;case Ot:t=this.InterpolantFactoryMethodLinear;break;case kt:t=this.InterpolantFactoryMethodSmooth;break;case At:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return W(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Dt;case this.InterpolantFactoryMethodLinear:return Ot;case this.InterpolantFactoryMethodSmooth:return kt;case this.InterpolantFactoryMethodBezier:return At}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e;qa(this.settings)&&(ro(this.settings.inTangents,e),ro(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;qa(this.settings)&&(io(this.settings.inTangents,e),io(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(G(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(G(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){G(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){G(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Wt(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){G(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===kt,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,qa(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function ro(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]+=t}function io(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}no.prototype.ValueTypeName=``,no.prototype.TimeBufferType=Float32Array,no.prototype.ValueBufferType=Float32Array,no.prototype.DefaultInterpolation=Ot;var ao=class extends no{constructor(e,t,n){super(e,t,n)}};ao.prototype.ValueTypeName=`bool`,ao.prototype.ValueBufferType=Array,ao.prototype.DefaultInterpolation=Dt,ao.prototype.InterpolantFactoryMethodLinear=void 0,ao.prototype.InterpolantFactoryMethodSmooth=void 0;var oo=class extends no{constructor(e,t,n,r){super(e,t,n,r)}};oo.prototype.ValueTypeName=`color`;var so=class extends no{constructor(e,t,n,r){super(e,t,n,r)}};so.prototype.ValueTypeName=`number`;var co=class extends Ja{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)pn.slerpFlat(i,0,a,c-o,a,c,s);return i}},lo=class extends no{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new co(this.times,this.values,this.getValueSize(),e)}};lo.prototype.ValueTypeName=`quaternion`,lo.prototype.InterpolantFactoryMethodSmooth=void 0;var uo=class extends no{constructor(e,t,n){super(e,t,n)}};uo.prototype.ValueTypeName=`string`,uo.prototype.ValueBufferType=Array,uo.prototype.DefaultInterpolation=Dt,uo.prototype.InterpolantFactoryMethodLinear=void 0,uo.prototype.InterpolantFactoryMethodSmooth=void 0;var fo=class extends no{constructor(e,t,n,r){super(e,t,n,r)}};fo.prototype.ValueTypeName=`vector`;var po=class extends ur{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new q(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},mo=class extends po{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(ur.DEFAULT_UP),this.updateMatrix(),this.groundColor=new q(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},ho=new Ln,go=new K,_o=new K,vo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fn(512,512),this.mapType=Te,this.map=null,this.mapPass=null,this.matrix=new Ln,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ea,this._frameExtents=new fn(1,1),this._viewportCount=1,this._viewports=[new Mn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;go.setFromMatrixPosition(e.matrixWorld),t.position.copy(go),_o.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(_o),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){ho.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(ho,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(ho)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},yo=new K,bo=new pn,xo=new K,So=class extends ur{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Ln,this.projectionMatrix=new Ln,this.projectionMatrixInverse=new Ln,this.coordinateSystem=Ht,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(yo,bo,xo),xo.x===1&&xo.y===1&&xo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(yo,bo,xo.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(yo,bo,xo),xo.x===1&&xo.y===1&&xo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(yo,bo,xo.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Co=new K,wo=new fn,To=new fn,Eo=class extends So{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=nn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(tn*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return nn*2*Math.atan(Math.tan(tn*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Co.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Co.x,Co.y).multiplyScalar(-e/Co.z),Co.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Co.x,Co.y).multiplyScalar(-e/Co.z)}getViewSize(e,t){return this.getViewBounds(e,wo,To),t.subVectors(To,wo)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(tn*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Do=class extends So{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Oo=class extends vo{constructor(){super(new Do(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ko=class extends po{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(ur.DEFAULT_UP),this.updateMatrix(),this.target=new ur,this.shadow=new Oo}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Ao=-90,jo=1,Mo=class extends ur{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Eo(Ao,jo,e,t);r.layers=this.layers,this.add(r);let i=new Eo(Ao,jo,e,t);i.layers=this.layers,this.add(i);let a=new Eo(Ao,jo,e,t);a.layers=this.layers,this.add(a);let o=new Eo(Ao,jo,e,t);o.layers=this.layers,this.add(o);let s=new Eo(Ao,jo,e,t);s.layers=this.layers,this.add(s);let c=new Eo(Ao,jo,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},No=class extends Eo{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},Po=`\\[\\]\\.:\\/`,Fo=RegExp(`[\\[\\]\\.:\\/]`,`g`),Io=`[^\\[\\]\\.:\\/]`,Lo=`[^`+Po.replace(`\\.`,``)+`]`,Ro=`((?:WC+[\\/:])*)`.replace(`WC`,Io),zo=`(WCOD+)?`.replace(`WCOD`,Lo),Bo=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Io),Vo=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Io),Ho=RegExp(`^`+Ro+zo+Bo+Vo+`$`),Uo=[`material`,`materials`,`bones`,`map`],Wo=class{constructor(e,t,n){let r=n||Go.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Go=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Fo,``)}static parseTrackName(e){let t=Ho.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Uo.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){W(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){G(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){G(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){G(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){G(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){G(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){G(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){G(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;G(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){G(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){G(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Go.Composite=Wo,Go.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Go.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Go.prototype.GetterByBindingType=[Go.prototype._getValue_direct,Go.prototype._getValue_array,Go.prototype._getValue_arrayElement,Go.prototype._getValue_toArray],Go.prototype.SetterByBindingTypeAndVersioning=[[Go.prototype._setValue_direct,Go.prototype._setValue_direct_setNeedsUpdate,Go.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Go.prototype._setValue_array,Go.prototype._setValue_array_setNeedsUpdate,Go.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Go.prototype._setValue_arrayElement,Go.prototype._setValue_arrayElement_setNeedsUpdate,Go.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Go.prototype._setValue_fromArray,Go.prototype._setValue_fromArray_setNeedsUpdate,Go.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class{static{this.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function Ko(e,t,n,r){let i=qo(r);switch(n){case Fe:return e*t;case Be:return e*t/i.components*i.byteLength;case Ve:return e*t/i.components*i.byteLength;case He:return e*t*2/i.components*i.byteLength;case Ue:return e*t*2/i.components*i.byteLength;case Ie:return e*t*3/i.components*i.byteLength;case Le:return e*t*4/i.components*i.byteLength;case We:return e*t*4/i.components*i.byteLength;case Ge:case Ke:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case qe:case Je:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Xe:case Qe:return Math.max(e,16)*Math.max(t,8)/4;case Ye:case Ze:return Math.max(e,8)*Math.max(t,8)/2;case $e:case et:case nt:case rt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case tt:case it:case at:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ot:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case st:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case ct:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case lt:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case ut:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case dt:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case ft:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case pt:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case mt:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case ht:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case gt:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case _t:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case vt:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case yt:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case bt:case xt:case St:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Ct:case wt:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Tt:case Et:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function qo(e){switch(e){case Te:case V:return{byteLength:1,components:1};case U:case H:case ke:return{byteLength:2,components:1};case Ae:case je:return{byteLength:2,components:4};case De:case Ee:case Oe:return{byteLength:4,components:1};case Ne:case Pe:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`187`}})),typeof window<`u`&&(window.__THREE__?W(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`187`);function Jo(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Yo(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Xo={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
}`},J={common:{diffuse:{value:new q(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new gn},alphaMap:{value:null},alphaMapTransform:{value:new gn},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new gn}},envmap:{envMap:{value:null},envMapRotation:{value:new gn},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new gn}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new gn}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new gn},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new gn},normalScale:{value:new fn(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new gn},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new gn}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new gn}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new gn}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new q(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new q(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new gn},alphaTest:{value:0},uvTransform:{value:new gn}},sprite:{diffuse:{value:new q(16777215)},opacity:{value:1},center:{value:new fn(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new gn},alphaMap:{value:null},alphaMapTransform:{value:new gn},alphaTest:{value:0}}},Zo={basic:{uniforms:Na([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.fog]),vertexShader:Xo.meshbasic_vert,fragmentShader:Xo.meshbasic_frag},lambert:{uniforms:Na([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.fog,J.lights,{emissive:{value:new q(0)},envMapIntensity:{value:1}}]),vertexShader:Xo.meshlambert_vert,fragmentShader:Xo.meshlambert_frag},phong:{uniforms:Na([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.fog,J.lights,{emissive:{value:new q(0)},specular:{value:new q(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Xo.meshphong_vert,fragmentShader:Xo.meshphong_frag},standard:{uniforms:Na([J.common,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.roughnessmap,J.metalnessmap,J.fog,J.lights,{emissive:{value:new q(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xo.meshphysical_vert,fragmentShader:Xo.meshphysical_frag},toon:{uniforms:Na([J.common,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.gradientmap,J.fog,J.lights,{emissive:{value:new q(0)}}]),vertexShader:Xo.meshtoon_vert,fragmentShader:Xo.meshtoon_frag},matcap:{uniforms:Na([J.common,J.bumpmap,J.normalmap,J.displacementmap,J.fog,{matcap:{value:null}}]),vertexShader:Xo.meshmatcap_vert,fragmentShader:Xo.meshmatcap_frag},points:{uniforms:Na([J.points,J.fog]),vertexShader:Xo.points_vert,fragmentShader:Xo.points_frag},dashed:{uniforms:Na([J.common,J.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xo.linedashed_vert,fragmentShader:Xo.linedashed_frag},depth:{uniforms:Na([J.common,J.displacementmap]),vertexShader:Xo.depth_vert,fragmentShader:Xo.depth_frag},normal:{uniforms:Na([J.common,J.bumpmap,J.normalmap,J.displacementmap,{opacity:{value:1}}]),vertexShader:Xo.meshnormal_vert,fragmentShader:Xo.meshnormal_frag},sprite:{uniforms:Na([J.sprite,J.fog]),vertexShader:Xo.sprite_vert,fragmentShader:Xo.sprite_frag},background:{uniforms:{uvTransform:{value:new gn},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xo.background_vert,fragmentShader:Xo.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new gn}},vertexShader:Xo.backgroundCube_vert,fragmentShader:Xo.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xo.cube_vert,fragmentShader:Xo.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xo.equirect_vert,fragmentShader:Xo.equirect_frag},distance:{uniforms:Na([J.common,J.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xo.distance_vert,fragmentShader:Xo.distance_frag},shadow:{uniforms:Na([J.lights,J.fog,{color:{value:new q(0)},opacity:{value:1}}]),vertexShader:Xo.shadow_vert,fragmentShader:Xo.shadow_frag}};Zo.physical={uniforms:Na([Zo.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new gn},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new gn},clearcoatNormalScale:{value:new fn(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new gn},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new gn},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new gn},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new gn},sheen:{value:0},sheenColor:{value:new q(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new gn},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new gn},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new gn},transmissionSamplerSize:{value:new fn},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new gn},attenuationDistance:{value:0},attenuationColor:{value:new q(0)},specularColor:{value:new q(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new gn},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new gn},anisotropyVector:{value:new fn},anisotropyMap:{value:null},anisotropyMapTransform:{value:new gn}}]),vertexShader:Xo.meshphysical_vert,fragmentShader:Xo.meshphysical_frag};var Qo={r:0,b:0,g:0},$o=new Ln,es=new gn;es.set(-1,0,0,0,1,0,0,0,1);function ts(e,t,n,r,i,a){let o=new q(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&i.isCubeTexture?(l===void 0&&(l=new Ri(new ha(1,1,1),new Ba({name:`BackgroundCubeMaterial`,uniforms:Ma(Zo.backgroundCube.uniforms),vertexShader:Zo.backgroundCube.vertexShader,fragmentShader:Zo.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4($o.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(es),l.material.toneMapped=xn.getTransfer(i.colorSpace)!==Rt,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Ri(new ka(2,2),new Ba({name:`BackgroundMaterial`,uniforms:Ma(Zo.background.uniforms),vertexShader:Zo.background.vertexShader,fragmentShader:Zo.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=xn.getTransfer(i.colorSpace)!==Rt,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Qo,Ia(e)),n.buffers.color.setClear(Qo.r,Qo.g,Qo.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function ns(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.isInterleavedBuffer===!0?t.stride:t.itemSize,p=s.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function rs(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function is(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(W(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),f=n.logarithmicDepthBuffer===!0&&d===!1;n.reversedDepthBuffer===!0&&d===!1&&W(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`),n.logarithmicDepthBuffer===!0&&d===!0&&W(`WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function as(e){let t=this,n=null,r=0,i=!1,a=!1,o=new vi,s=new gn,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var os=class extends Pn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new ua(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ha(5,5,5),i=new Ba({name:`CubemapFromEquirect`,uniforms:Ma(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Ri(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=B),new Mo(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},ss=256,cs=3,ls=20,us=256,ds=16,fs=3,ps=new K,ms=new q,hs=class e{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Mo(1,10,null),this._boxMesh=new Ri(new ha(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=ps}=i,s=this._renderer;this._setSize(a);let c=this._allocateTarget(),l=this._getSourceTarget(!0);t>0&&(l.texture.mipmapsAutoUpdate=!1);let u=s.autoClear,d=s.autoClearColor,f=s.autoClearDepth,p=s.autoClearStencil,m=e.background;s.autoClear=!0,s.autoClearColor=!0,s.autoClearDepth=!0,s.autoClearStencil=!0,m===null&&(e.background=s.getClearColor(ms));let h=new Mo(n,r,l);return h.position.copy(o),h.update(s,e),s.autoClear=u,s.autoClearColor=d,s.autoClearDepth=f,s.autoClearStencil=p,e.background=m,t>0&&(l.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ss(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xs(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(ss,cn(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?ss:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=gs(e,!1,!1),n=Math.log2(e)-cs;for(let r=0;r<=n;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name=`PMREM`,t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=gs(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let r=this._boxMesh,i=this._cubeCamera;r.material=n,i.renderTarget=e,i.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),i.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ss()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=xs()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=vs(),this._integrationMaterial=ys());let n=this._cubeSize,r=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/ds);for(let o=0;o<=r;o++){let s=e.lodToRoughness(o,r);if(o>r-fs)a.roughness.value=s,this._renderCube(t,o,this._integrationMaterial);else{let e=s>0?Math.log2(n)+.5*Math.log2(6/(us*s**4))+.5:0;i.roughness.value=s,i.lodBias.value=e,this._renderCube(t,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=bs());let n=this._blurMaterial,r=n.uniforms,i=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=i.texture,this._renderCube(e,0,n),r.envMap.value=e.texture,this._renderCube(i,0,n)}};function gs(e,t,n){return new os(e,{minFilter:we,generateMipmaps:t,type:ke,colorSpace:It,depthBuffer:n})}function _s(e,t,n){return new Ba({name:e,uniforms:t,vertexShader:Xo.cube_vert,fragmentShader:n,side:1,blending:0,depthTest:!1,depthWrite:!1})}function vs(){return _s(`PMREMGGXConvolution`,{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${us}u

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
	`)}function ys(){return _s(`PMREMGGXIntegration`,{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:ds}},`

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
	`)}function bs(){return _s(`PMREMSphericalGaussianBlur`,{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${ls}
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
	`)}function xs(){return _s(`PMREMEquirectangularToCubemap`,{envMap:{value:null}},`

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
	`)}function Ss(){return _s(`PMREMCubemapToCubemap`,{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Cs(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new os(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture&&t.isPMREMTexture!==!0){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new hs(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new hs(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function ws(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Xt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Ts(e,t,n,r){let i={},a=new WeakMap,o=new FinalizationRegistry(e=>delete i[e]);function s(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(let n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener(`dispose`,s),delete i[e.id],o.unregister(e);let c=a.get(e);c&&(t.remove(c),a.delete(e)),r.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function l(e,t){return i[t.id]===void 0&&(t.addEventListener(`dispose`,s),i[t.id]=new WeakRef(t),o.register(t,t.id,t),n.memory.geometries++),t}function u(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function d(e){let n=e.index,r=e.attributes.position,i=0;if(r===void 0)return;let o=n===null?r.array.length/3-1:n.array.length,s=new(r.count>=65535?ti:ei)(Math.ceil(o/3)*6,1),c=s.array;if(n!==null){let e=n.array;i=n.version;for(let t=0,n=0;t<o;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];c[n++]=r,c[n++]=i,c[n++]=i,c[n++]=a,c[n++]=a,c[n++]=r}}else{i=r.version;for(let e=0,t=0;e<o;e+=3){let n=e+0,r=e+1,i=e+2;c[t++]=n,c[t++]=r,c[t++]=r,c[t++]=i,c[t++]=i,c[t++]=n}}s.version=i;let l=a.get(e);l&&t.remove(l),a.set(e,s)}function f(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&d(e)}else d(e);return a.get(e)}function p(){for(let e in i){let t=i[e].deref();t!==void 0&&c(t)}}return{get:l,update:u,getWireframeAttribute:f,dispose:p}}function Es(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Ds(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:G(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Os(e,t,n){let r=new WeakMap,i=new Mn;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Fn(h,p,m,u);g.type=Oe,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new fn(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function ks(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var As={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function js(e,t,n,r,i,a){let o=new Pn(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=null,u=new mi;u.setAttribute(`position`,new ni([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new ni([0,2,0,0,2,0],2));let d=new Va({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new Ri(u,d),p=new Do(-1,1,1,-1,0,1),m=null,h=null,g=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new Pn(t,n,{type:ke,depthBuffer:!1,stencilBuffer:!1}),c=new Pn(t,n,{type:ke,depthBuffer:!1,stencilBuffer:!1}));let r=i===!0&&y.some(e=>e.needsDepthTexture===!0);r!==(o.depthTexture!==null)&&(r===!0&&l===null&&(l=new fa(t,n),a===!0&&(l.format=ze,l.type=Me)),o.dispose(),o.depthTexture=r?l:null,o.resolveDepthBuffer=r,o.storeMultisampledDepthBuffer=r);for(let e=0;e<y.length;e++){let i=y[e];i.setSize&&i.setSize(t,n),r&&i.needsDepthTexture===!0&&i.setDepthTexture&&i.setDepthTexture(l)}},this.begin=function(e,t){if(g||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,g=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(m!==e.outputColorSpace||h!==e.toneMapping){m=e.outputColorSpace,h=e.toneMapping,d.defines={},xn.getTransfer(m)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=As[h];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(f,p),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}var Ms=new jn,Ns=new fa(1,1),Ps=new pa(1),Fs=new Fn,Is=new In,Ls=new ua,Rs=[],zs=[],Bs=new Float32Array(16),Vs=new Float32Array(9),Hs=new Float32Array(4);function Us(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Rs[i];if(a===void 0&&(a=new Float32Array(i),Rs[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Ws(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Gs(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Ks(e,t){let n=zs[t];n===void 0&&(n=new Int32Array(t),zs[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function qs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Js(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ws(n,t))return;e.uniform2fv(this.addr,t),Gs(n,t)}}function Ys(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Ws(n,t))return;e.uniform3fv(this.addr,t),Gs(n,t)}}function Xs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ws(n,t))return;e.uniform4fv(this.addr,t),Gs(n,t)}}function Zs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ws(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Gs(n,t)}else{if(Ws(n,r))return;Hs.set(r),e.uniformMatrix2fv(this.addr,!1,Hs),Gs(n,r)}}function Qs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ws(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Gs(n,t)}else{if(Ws(n,r))return;Vs.set(r),e.uniformMatrix3fv(this.addr,!1,Vs),Gs(n,r)}}function $s(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ws(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Gs(n,t)}else{if(Ws(n,r))return;Bs.set(r),e.uniformMatrix4fv(this.addr,!1,Bs),Gs(n,r)}}function ec(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function tc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ws(n,t))return;e.uniform2iv(this.addr,t),Gs(n,t)}}function nc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ws(n,t))return;e.uniform3iv(this.addr,t),Gs(n,t)}}function rc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ws(n,t))return;e.uniform4iv(this.addr,t),Gs(n,t)}}function ic(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function ac(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ws(n,t))return;e.uniform2uiv(this.addr,t),Gs(n,t)}}function oc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ws(n,t))return;e.uniform3uiv(this.addr,t),Gs(n,t)}}function sc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ws(n,t))return;e.uniform4uiv(this.addr,t),Gs(n,t)}}function cc(e){return e.version===0&&(e.compareFunction=519,e.needsUpdate=!0),e}function lc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_2D_SHADOW?cc(Ns):Ms,n.setTexture2D(t||a,i)}function uc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Is,i)}function dc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_CUBE_SHADOW?cc(Ps):Ls,n.setTextureCube(t||a,i)}function fc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Fs,i)}function pc(e){switch(e){case 5126:return qs;case 35664:return Js;case 35665:return Ys;case 35666:return Xs;case 35674:return Zs;case 35675:return Qs;case 35676:return $s;case 5124:case 35670:return ec;case 35667:case 35671:return tc;case 35668:case 35672:return nc;case 35669:case 35673:return rc;case 5125:return ic;case 36294:return ac;case 36295:return oc;case 36296:return sc;case 35678:case 36198:case 36298:case 36306:case 35682:return lc;case 35679:case 36299:case 36307:return uc;case 35680:case 36300:case 36308:case 36293:return dc;case 36289:case 36303:case 36311:case 36292:return fc}}function mc(e,t){e.uniform1fv(this.addr,t)}function hc(e,t){let n=Us(t,this.size,2);e.uniform2fv(this.addr,n)}function gc(e,t){let n=Us(t,this.size,3);e.uniform3fv(this.addr,n)}function _c(e,t){let n=Us(t,this.size,4);e.uniform4fv(this.addr,n)}function vc(e,t){let n=Us(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function yc(e,t){let n=Us(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function bc(e,t){let n=Us(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function xc(e,t){e.uniform1iv(this.addr,t)}function Sc(e,t){e.uniform2iv(this.addr,t)}function Cc(e,t){e.uniform3iv(this.addr,t)}function wc(e,t){e.uniform4iv(this.addr,t)}function Tc(e,t){e.uniform1uiv(this.addr,t)}function Ec(e,t){e.uniform2uiv(this.addr,t)}function Dc(e,t){e.uniform3uiv(this.addr,t)}function Oc(e,t){e.uniform4uiv(this.addr,t)}function kc(e,t,n){let r=this.cache,i=t.length,a=Ks(n,i);Ws(r,a)||(e.uniform1iv(this.addr,a),Gs(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?cc(Ns):Ms;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Ac(e,t,n){let r=this.cache,i=t.length,a=Ks(n,i);Ws(r,a)||(e.uniform1iv(this.addr,a),Gs(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Is,a[e])}function jc(e,t,n){let r=this.cache,i=t.length,a=Ks(n,i);Ws(r,a)||(e.uniform1iv(this.addr,a),Gs(r,a));let o;o=this.type===e.SAMPLER_CUBE_SHADOW?cc(Ps):Ls;for(let e=0;e!==i;++e)n.setTextureCube(t[e]||o,a[e])}function Mc(e,t,n){let r=this.cache,i=t.length,a=Ks(n,i);Ws(r,a)||(e.uniform1iv(this.addr,a),Gs(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Fs,a[e])}function Nc(e){switch(e){case 5126:return mc;case 35664:return hc;case 35665:return gc;case 35666:return _c;case 35674:return vc;case 35675:return yc;case 35676:return bc;case 5124:case 35670:return xc;case 35667:case 35671:return Sc;case 35668:case 35672:return Cc;case 35669:case 35673:return wc;case 5125:return Tc;case 36294:return Ec;case 36295:return Dc;case 36296:return Oc;case 35678:case 36198:case 36298:case 36306:case 35682:return kc;case 35679:case 36299:case 36307:return Ac;case 35680:case 36300:case 36308:case 36293:return jc;case 36289:case 36303:case 36311:case 36292:return Mc}}var Pc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=pc(t.type)}},Fc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Nc(t.type)}},Ic=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Lc=/(\w+)(\])?(\[|\.)?/g;function Rc(e,t){e.seq.push(t),e.map[t.id]=t}function zc(e,t,n){let r=e.name,i=r.length;for(Lc.lastIndex=0;;){let a=Lc.exec(r),o=Lc.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Rc(n,l===void 0?new Pc(s,e,t):new Fc(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Ic(s),Rc(n,e)),n=e}}}var Bc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);zc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Vc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Hc=37297,Uc=0;function Wc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Gc=new gn;function Kc(e){xn._getMatrix(Gc,xn.workingColorSpace,e);let t=`mat3( ${Gc.elements.map(e=>e.toFixed(4))} )`;switch(xn.getTransfer(e)){case Lt:return[t,`LinearTransferOETF`];case Rt:return[t,`sRGBTransferOETF`];default:return W(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function qc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Wc(e.getShaderSource(t),r)}return i}function Jc(e,t){let n=Kc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,`}`].join(`
`)}var Yc={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Xc(e,t){let n=Yc[t];return n===void 0?(W(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Zc=new K;function Qc(){return xn.getLuminanceCoefficients(Zc),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Zc.x.toFixed(4)}, ${Zc.y.toFixed(4)}, ${Zc.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function $c(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(nl).join(`
`)}function el(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function tl(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function nl(e){return e!==``}function rl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function il(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var al=/^[ \t]*#include +<([\w\d./]+)>/gm;function ol(e){return e.replace(al,sl)}function sl(e,t){let n=Xo[t];if(n===void 0)throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`);return ol(n)}var cl=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ll(e){return e.replace(cl,ul)}function ul(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function dl(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}var fl={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function pl(e){return fl[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var ml={302:`ENVMAP_MODE_REFRACTION`};function hl(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:ml[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var gl={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function _l(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:gl[e.combine]||`ENVMAP_BLENDING_NONE`}function vl(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=pl(n),l=n.envMapPMREM===!0?`ENVMAP_TYPE_PMREM`:`ENVMAP_TYPE_CUBE`,u=hl(n),d=_l(n),f=$c(n),p=el(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(nl).join(`
`),h.length>0&&(h+=`
`),g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(nl).join(`
`),g.length>0&&(g+=`
`)):(h=[dl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.diffuseRoughnessMapUv?`#define DIFFUSE_ROUGHNESSMAP_UV `+n.diffuseRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(nl).join(`
`),g=[dl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.envMapPMREM?`#define ENVMAP_MAX_LOD `+n.envMapMaxLod+`.0`:``,n.envMapPMREM?`#define ENVMAP_SIZE `+n.envMapSize+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughness?`#define USE_DIFFUSE_ROUGHNESS`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Xo.tonemapping_pars_fragment,n.toneMapping===0?``:Xc(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Xo.colorspace_pars_fragment,Jc(`linearToOutputTexel`,n.outputColorSpace),Qc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(nl).join(`
`)),o=ol(o),o=rl(o,n),o=il(o,n),s=ol(s),s=rl(s,n),s=il(s,n),o=ll(o),s=ll(s),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,h=[f,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=Vc(i,i.VERTEX_SHADER,v),x=Vc(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,`position`):i.bindAttribLocation(m,0,n.index0AttributeName),i.linkProgram(m);function S(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(m)||``,r=i.getShaderInfoLog(b)||``,a=i.getShaderInfoLog(x)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,m,b,x);else{let e=qc(i,b,`vertex`),n=qc(i,x,`fragment`);G(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):W(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:h},fragmentShader:{log:c,prefix:g}})}i.deleteShader(b),i.deleteShader(x),C=new Bc(i,m),w=tl(i,m)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,Hc)),T},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Uc++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}var yl=0,bl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new xl(e),t.set(e,n)),n}},xl=class{constructor(e){this.id=yl++,this.code=e,this.usedTimes=0}};function Sl(e){return e===1030||e===37490||e===36285}function Cl(e,t,n,r,i,a){let o=new Jn,s=new bl,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function p(e){return c.add(e),e===0?`uv`:`uv${e}`}function m(i,o,l,u,m,h){let g=u.fog,_=m.geometry,v=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,b=t.get(i.envMap||v,y),x=f[i.type],S=r.precision;i.precision!==null&&(S=r.getMaxPrecision(i.precision),S!==i.precision&&W(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,S,`instead.`));let C=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,w=C===void 0?0:C.length,T=0;_.morphAttributes.position!==void 0&&(T=1),_.morphAttributes.normal!==void 0&&(T=2),_.morphAttributes.color!==void 0&&(T=3);let E,D,O,k;if(x){let e=Zo[x];E=e.vertexShader,D=e.fragmentShader}else{E=i.vertexShader,D=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),M=m.isInstancedMesh===!0,N=m.isBatchedMesh===!0,ee=!!i.map,P=!!i.matcap,F=!!b,I=F&&b.isPMREMTexture===!0,te=!!i.aoMap,ne=!!i.lightMap,re=!!i.bumpMap&&i.wireframe===!1,ie=!!i.normalMap,ae=!!i.displacementMap,oe=!!i.emissiveMap,se=!!i.metalnessMap,L=!!i.roughnessMap,ce=i.anisotropy>0,le=i.clearcoat>0,ue=i.diffuseRoughness>0,de=i.dispersion>0,R=i.retroreflectivity>0,fe=i.iridescence>0,pe=i.sheen>0,me=i.transmission>0,he=ce&&!!i.anisotropyMap,ge=le&&!!i.clearcoatMap,_e=le&&!!i.clearcoatNormalMap,ve=le&&!!i.clearcoatRoughnessMap,ye=ue&&!!i.diffuseRoughnessMap,z=fe&&!!i.iridescenceMap,be=fe&&!!i.iridescenceThicknessMap,xe=pe&&!!i.sheenColorMap,Se=pe&&!!i.sheenRoughnessMap,B=!!i.specularMap,Ce=!!i.specularColorMap,we=!!i.specularIntensityMap,Te=me&&!!i.transmissionMap,V=me&&!!i.thicknessMap,H=!!i.gradientMap,U=!!i.alphaMap,Ee=i.alphaTest>0,De=!!i.alphaHash,Oe=!!i.extensions,ke=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(ke=e.toneMapping);let Ae=I?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,je={shaderID:x,shaderType:i.type,shaderName:i.name,vertexShader:E,fragmentShader:D,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:S,batching:N,batchingColor:N&&m._colorsTexture!==null,instancing:M,instancingColor:M&&m.instanceColor!==null,instancingMorph:M&&m.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:xn.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ee,matcap:P,envMap:F,envMapMode:F&&b.mapping,envMapPMREM:I,envMapMaxLod:I?Ae.length-1:null,envMapSize:I?Ae[0].width:null,aoMap:te,lightMap:ne,bumpMap:re,normalMap:ie,displacementMap:ae,emissiveMap:oe,normalMapObjectSpace:ie&&i.normalMapType===1,normalMapTangentSpace:ie&&i.normalMapType===0,packedNormalMap:ie&&i.normalMapType===0&&Sl(i.normalMap.format),metalnessMap:se,roughnessMap:L,anisotropy:ce,anisotropyMap:he,clearcoat:le,clearcoatMap:ge,clearcoatNormalMap:_e,clearcoatRoughnessMap:ve,diffuseRoughness:ue,diffuseRoughnessMap:ye,dispersion:de,retroreflection:R,iridescence:fe,iridescenceMap:z,iridescenceThicknessMap:be,sheen:pe,sheenColorMap:xe,sheenRoughnessMap:Se,specularMap:B,specularColorMap:Ce,specularIntensityMap:we,transmission:me,transmissionMap:Te,thicknessMap:V,gradientMap:H,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:U,alphaTest:Ee,alphaHash:De,combine:i.combine,mapUv:ee&&p(i.map.channel),aoMapUv:te&&p(i.aoMap.channel),lightMapUv:ne&&p(i.lightMap.channel),bumpMapUv:re&&p(i.bumpMap.channel),normalMapUv:ie&&p(i.normalMap.channel),displacementMapUv:ae&&p(i.displacementMap.channel),emissiveMapUv:oe&&p(i.emissiveMap.channel),metalnessMapUv:se&&p(i.metalnessMap.channel),roughnessMapUv:L&&p(i.roughnessMap.channel),anisotropyMapUv:he&&p(i.anisotropyMap.channel),clearcoatMapUv:ge&&p(i.clearcoatMap.channel),clearcoatNormalMapUv:_e&&p(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ve&&p(i.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ye&&p(i.diffuseRoughnessMap.channel),iridescenceMapUv:z&&p(i.iridescenceMap.channel),iridescenceThicknessMapUv:be&&p(i.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&p(i.sheenColorMap.channel),sheenRoughnessMapUv:Se&&p(i.sheenRoughnessMap.channel),specularMapUv:B&&p(i.specularMap.channel),specularColorMapUv:Ce&&p(i.specularColorMap.channel),specularIntensityMapUv:we&&p(i.specularIntensityMap.channel),transmissionMapUv:Te&&p(i.transmissionMap.channel),thicknessMapUv:V&&p(i.thicknessMap.channel),alphaMapUv:U&&p(i.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(ie||ce),vertexNormals:!!_.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!_.attributes.uv&&(ee||U),fog:!!g,useFog:i.fog===!0,fogExp2:!!g&&g.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||_.attributes.normal===void 0&&ie===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:_.attributes.position!==void 0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:w,morphTextureStride:T,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:h.filter(e=>e.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:ke,decodeVideoTexture:ee&&i.map.isVideoTexture===!0&&xn.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:oe&&i.emissiveMap.isVideoTexture===!0&&xn.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Oe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Oe&&i.extensions.multiDraw===!0||N)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return je.vertexUv1s=c.has(1),je.vertexUv2s=c.has(2),je.vertexUv3s=c.has(3),c.clear(),je}function h(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),_(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function _(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.diffuseRoughness&&o.enable(25),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function v(e){let t=f[e.type],n;if(t){let e=Zo[t];n=La.clone(e.uniforms)}else n=e.uniforms;return n}function y(t,n){let r=u.get(n);return r===void 0?(r=new vl(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function b(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function x(e){s.remove(e)}function S(){s.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:y,releaseProgram:b,releaseShaderCache:x,programs:l,dispose:S}}function wl(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Tl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function El(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Dl(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Tl),r.length>1&&r.sort(t||El),i.length>1&&i.sort(t||El)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Ol(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Dl,e.set(t,[i])):n>=r.length?(i=new Dl,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function kl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new K,color:new q};break;case`SpotLight`:n={position:new K,direction:new K,color:new q,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new K,color:new q,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new K,skyColor:new q,groundColor:new q};break;case`RectAreaLight`:n={color:new q,position:new K,halfWidth:new K,halfHeight:new K}}return e[t.id]=n,n}}}function Al(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fn};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fn};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fn,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var jl=0;function Ml(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Nl(e){let t=new kl,n=Al(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new K);let i=new K,a=new Ln,o=new Ln;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Ml);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=J.LTC_FLOAT_1,r.rectAreaLTC2=J.LTC_FLOAT_2):(r.rectAreaLTC1=J.LTC_HALF_1,r.rectAreaLTC2=J.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=jl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Pl(e){let t=new Nl(e),n=[],r=[],i=[];function a(e){u.camera=e,n.length=0,r.length=0,i.length=0}function o(e){e.isLightProbeGrid?i.push(e):n.push(e)}function s(e){r.push(e)}function c(){t.setup(n),i.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function l(e){t.setupView(n,e)}let u={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function Fl(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Pl(e),t.set(n,[a])):r>=i.length?(a=new Pl(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Il=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ll=`uniform sampler2D shadow_pass;
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
}`,Rl=[new K(1,0,0),new K(-1,0,0),new K(0,1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1)],zl=[new K(0,-1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1),new K(0,-1,0),new K(0,-1,0)],Bl=new Ln,Vl=new K,Hl=new K;function Ul(e,t,n){let r=new ea,i=new fn,a=new fn,o=new Mn,s=new Wa,c=new Ga,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Ba({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fn},radius:{value:4}},vertexShader:Il,fragmentShader:Ll}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new mi;m.setAttribute(`position`,new $r(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new Ri(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(W(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){W(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){W(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Pn(i.x,i.y,{format:He,type:ke,minFilter:B,magFilter:B,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new fa(i.x,i.y,Oe),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Re,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=be,d.map.depthTexture.magFilter=be}else l.isPointLight?(d.map=new os(i.x),d.map.depthTexture=new pa(i.x,De)):(d.map=new Pn(i.x,i.y),d.map.depthTexture=new fa(i.x,i.y,De)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Re,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=B,d.map.depthTexture.magFilter=B):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=be,d.map.depthTexture.magFilter=be);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);let _=d.camera.layers.mask&4294967294?d.camera.layers:s.layers;for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Vl.setFromMatrixPosition(l.matrixWorld),e.position.copy(Vl),Hl.copy(e.position),Hl.add(Rl[t]),e.up.copy(zl[t]),e.lookAt(Hl),e.updateMatrixWorld(),n.makeTranslation(-Vl.x,-Vl.y,-Vl.z),Bl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Bl,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,_,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new Pn(i.x,i.y,{format:He,type:ke}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s,c){if(n.visible===!1)return;if(n.layers.test(s)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),s=n.material;if(Array.isArray(s)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=s[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,c);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(s.visible){let t=y(n,s,o,c);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let l=n.children;for(let e=0,t=l.length;e<t;e++)b(l[e],i,a,o,s,c)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Wl(e,t){function n(){let t=!1,n=new Mn,r=null,i=new Mn(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?se(e.DEPTH_TEST):L(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Qt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?se(e.STENCIL_TEST):L(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c={},l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,ee=0,P=e.getParameter(e.VERSION);P.indexOf(`WebGL`)===-1?P.indexOf(`OpenGL ES`)!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(P)[1]),N=ee>=2):(ee=parseFloat(/^WebGL (\d)/.exec(P)[1]),N=ee>=1);let F=null,I={},te=e.getParameter(e.SCISSOR_BOX),ne=e.getParameter(e.VIEWPORT),re=new Mn().fromArray(te),ie=new Mn().fromArray(ne);function ae(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let oe={};oe[e.TEXTURE_2D]=ae(e.TEXTURE_2D,e.TEXTURE_2D,1),oe[e.TEXTURE_CUBE_MAP]=ae(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[e.TEXTURE_2D_ARRAY]=ae(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),oe[e.TEXTURE_3D]=ae(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),se(e.DEPTH_TEST),o.setFunc(3),me(!1),he(1),se(e.CULL_FACE),fe(0);function se(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function L(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ce(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function le(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function ue(t){return h!==t&&(e.useProgram(t),h=t,!0)}let de={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};de[103]=e.MIN,de[104]=e.MAX;let R={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function fe(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(L(e.BLEND),g=!1);else if(g===!1&&(se(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:G(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:G(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:G(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:G(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(de[n],de[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(R[r],R[i],R[o],R[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function pe(t,n){t.side===2?L(e.CULL_FACE):se(e.CULL_FACE);let r=t.side===1;n&&(r=!r),me(r),t.blending===1&&t.transparent===!1?fe(0):fe(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),_e(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?se(e.SAMPLE_ALPHA_TO_COVERAGE):L(e.SAMPLE_ALPHA_TO_COVERAGE)}function me(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function he(t){t===0?L(e.CULL_FACE):(se(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ge(t){t!==k&&(N&&e.lineWidth(t),k=t)}function _e(t,n,r){t?(se(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n,r=-r),e.polygonOffset(n,r))):L(e.POLYGON_OFFSET_FILL)}function ve(t){t?se(e.SCISSOR_TEST):L(e.SCISSOR_TEST)}function ye(t){t===void 0&&(t=e.TEXTURE0+M-1),F!==t&&(e.activeTexture(t),F=t)}function z(t,n,r){r===void 0&&(r=F===null?e.TEXTURE0+M-1:F);let i=I[r];i===void 0&&(i={type:void 0,texture:void 0},I[r]=i),(i.type!==t||i.texture!==n)&&(F!==r&&(e.activeTexture(r),F=r),e.bindTexture(t,n||oe[t]),i.type=t,i.texture=n)}function be(){let t=I[F];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function xe(){try{e.compressedTexImage2D(...arguments)}catch(e){G(`WebGLState:`,e)}}function Se(){try{e.compressedTexImage3D(...arguments)}catch(e){G(`WebGLState:`,e)}}function B(){try{e.texSubImage2D(...arguments)}catch(e){G(`WebGLState:`,e)}}function Ce(){try{e.texSubImage3D(...arguments)}catch(e){G(`WebGLState:`,e)}}function we(){try{e.compressedTexSubImage2D(...arguments)}catch(e){G(`WebGLState:`,e)}}function Te(){try{e.compressedTexSubImage3D(...arguments)}catch(e){G(`WebGLState:`,e)}}function V(){try{e.texStorage2D(...arguments)}catch(e){G(`WebGLState:`,e)}}function H(){try{e.texStorage3D(...arguments)}catch(e){G(`WebGLState:`,e)}}function U(){try{e.texImage2D(...arguments)}catch(e){G(`WebGLState:`,e)}}function Ee(){try{e.texImage3D(...arguments)}catch(e){G(`WebGLState:`,e)}}function De(t){return d[t]===void 0?e.getParameter(t):d[t]}function Oe(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function ke(t){re.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),re.copy(t))}function Ae(t){ie.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ie.copy(t))}function je(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,i,i),r.set(t,i))}function Me(t,n,r){let i=l.get(n).get(t);c[i]!==r&&(e.bindBufferBase(e.UNIFORM_BUFFER,i,r),c[i]=r)}function Ne(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},F=null,I={},f={},c={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,re.set(0,0,e.canvas.width,e.canvas.height),ie.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:se,disable:L,bindFramebuffer:ce,drawBuffers:le,useProgram:ue,setBlending:fe,setMaterial:pe,setFlipSided:me,setCullFace:he,setLineWidth:ge,setPolygonOffset:_e,setScissorTest:ve,activeTexture:ye,bindTexture:z,unbindTexture:be,compressedTexImage2D:xe,compressedTexImage3D:Se,texImage2D:U,texImage3D:Ee,pixelStorei:Oe,getParameter:De,updateUBOMapping:je,uniformBlockBinding:Me,texStorage2D:V,texStorage3D:H,texSubImage2D:B,texSubImage3D:Ce,compressedTexSubImage2D:we,compressedTexSubImage3D:Te,scissor:ke,viewport:Ae,reset:Ne}}function Gl(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new fn,u=new WeakMap,d=new Set,f,p=new WeakMap,m=new Set,h=new FinalizationRegistry(e=>m.delete(e)),g=!1;try{g=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function _(e,t){return g?new OffscreenCanvas(e,t):Gt(`canvas`)}function v(e,t,n){let r=1,i=Me(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=_(n,a));let o=t?_(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),W(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&W(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function y(e){return e.generateMipmaps}function b(t){e.generateMipmap(t)}function x(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function S(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];W(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||W(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Lt:xn.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function C(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,W(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function w(e,t){return y(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function T(e){let t=new WeakRef(e);r.get(e).__ref=t,m.add(t),h.register(e,t,t)}function E(e){let t=r.get(e).__ref;t!==void 0&&(m.delete(t),h.unregister(t))}function D(e){k(e.target)}function O(e){A(e.target)}function k(e){e.removeEventListener(`dispose`,D),E(e),M(e),e.isVideoTexture&&u.delete(e),e.isHTMLTexture&&d.delete(e)}function A(e){e.removeEventListener(`dispose`,O),E(e),ee(e)}function j(){for(let e of m){let t=e.deref();t!==void 0&&(t.isRenderTarget===!0?A(t):k(t))}m.clear(),d.clear()}function M(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&N(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function N(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function ee(t){let n=r.get(t);n.__depthDisposeCallback&&n.__depthDisposeCallback();let i=t.depthTexture;if(i&&i.renderTarget===t&&k(i),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let a=t.textures;for(let t=0,n=a.length;t<n;t++){let n=r.get(a[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(a[t])}r.remove(t)}let P=0;function F(){P=0}function I(){return P}function te(e){P=e}function ne(){let e=P;return e>=i.maxTextures&&W(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),P+=1,e}function re(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ie(t,i){let a=r.get(t);if(t.isVideoTexture&&Ae(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)W(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)W(`WebGLRenderer: Texture marked for update but image is incomplete`);else{pe(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ae(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?pe(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function oe(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?pe(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function se(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?me(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let L={[ve]:e.REPEAT,[ye]:e.CLAMP_TO_EDGE,[z]:e.MIRRORED_REPEAT},ce={[be]:e.NEAREST,[xe]:e.NEAREST_MIPMAP_NEAREST,[Se]:e.NEAREST_MIPMAP_LINEAR,[B]:e.LINEAR,[Ce]:e.LINEAR_MIPMAP_NEAREST,[we]:e.LINEAR_MIPMAP_LINEAR},le={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function ue(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&W(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,L[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,L[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,L[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ce[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ce[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,le[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function de(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,D),T(n));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=re(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&N(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function R(e,t,n){return Math.floor(Math.floor(e/n)/t)}function fe(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=R(n.start,r.width,4),c=R(t.start,r.width,4);n.start<=i+1&&a===c&&R(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function pe(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=de(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=xn.getPrimaries(xn.workingColorSpace),r=o.colorSpace===``?null:xn.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=v(o.image,!1,i.maxTextureSize);t=je(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=S(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);ue(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,x=f.__version===void 0||l===!0,T=u.dataReady,E=w(o,t);if(o.isDepthTexture)m=C(o.format===ze,o.type),x&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else _?(x&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&fe(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(T){if(o.layerUpdates.size>0){let t=Ko(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=Ko(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)_?(x&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(x){if(_)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&x){let t=Me(g[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(_){if(x){let r=Me(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);y(o)&&o.mipmapsAutoUpdate===!0&&b(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function me(t,o,s){if(o.image.length!==6)return;let c=de(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=xn.getPrimaries(xn.workingColorSpace),r=o.colorSpace===``?null:xn.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=v(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=je(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),x=S(o.internalFormat,g,_,o.normalized,o.colorSpace),T=o.isVideoTexture!==!0,E=u.__version===void 0||c===!0,D=l.dataReady,O=w(o,h);ue(e.TEXTURE_CUBE_MAP,o);let k;if(o.isDepthTexture){if(x=C(o.format===ze,o.type),E){if(T)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,x,h.width,h.height);else for(let t=0;t<6;t++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,h.width,h.height,0,g,_,null)}}else if(f){T&&E&&n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,h.width,h.height);for(let t=0;t<6;t++){k=m[t].mipmaps;for(let r=0;r<k.length;r++){let i=k[r];o.format===1023?T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,g,_,i.data):g===null?W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):T?D&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,i.data)}}}else{if(k=o.mipmaps,T&&E){k.length>0&&O++;let t=Me(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,t.width,t.height)}for(let t=0;t<6;t++)if(p){T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<k.length;r++){let i=k[r].image[t].image;T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,i.width,i.height,0,g,_,i.data)}}else{T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,g,_,m[t]);for(let r=0;r<k.length;r++){let i=k[r];T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,g,_,i.image[t])}}}y(o)&&o.mipmapsAutoUpdate===!0&&b(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function he(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=S(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),ke(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Oe(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ge(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=C(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;ke(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Oe(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Oe(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=S(o.internalFormat,c,l,o.normalized,o.colorSpace);ke(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Oe(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Oe(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function _e(t,i,a){let o=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=r.get(i.depthTexture);c.__renderTarget=i;let l=o?i.depthTexture.image[0]:i.depthTexture.image;c.__webglTexture&&l.width===i.width&&l.height===i.height||(l.width=i.width,l.height=i.height,i.depthTexture.needsUpdate=!0),o?se(i.depthTexture,0):ie(i.depthTexture,0);let u=c.__webglTexture,d=Oe(i),f=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)ke(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)ke(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Te(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)_e(i.__webglFramebuffer[e],t,e);else t.texture.mipmaps.length>0?_e(i.__webglFramebuffer[0],t,0):_e(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),ge(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else if(t.texture.mipmaps.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),ge(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function V(t,n,i){let a=r.get(t);n!==void 0&&he(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&Te(t)}function H(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,O),T(t);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&ke(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=S(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Oe(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),ge(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),ue(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)he(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else he(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);y(i)?b(e.TEXTURE_CUBE_MAP):i.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),ue(c,a),he(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),y(a)&&b(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),ue(r,i),i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)he(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else he(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);y(i)?b(r):i.mipmaps.length>0&&e.texParameteri(r,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}t.depthBuffer&&Te(t)}function U(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(y(a)&&a.mipmapsAutoUpdate===!0){let t=x(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),b(t),n.unbindTexture()}}}let Ee=[];function De(t){if(t.samples>0){if(ke(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.texture.mipmaps.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Ee.length=0,Ee.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&Ee.push(l),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ee))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Oe(e){return Math.min(i.maxSamples,e.samples)}function ke(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function Ae(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function je(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(xn.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&W(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):G(`WebGLTextures: Unsupported texture color space:`,n)),t}function Me(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ne,this.resetTextureUnits=F,this.getTextureUnits=I,this.setTextureUnits=te,this.setTexture2D=ie,this.setTexture2DArray=ae,this.setTexture3D=oe,this.setTextureCube=se,this.rebindTextures=V,this.setupRenderTarget=H,this.updateRenderTargetMipmap=U,this.updateMultisampleRenderTarget=De,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=he,this.useMultisampledRTT=ke,this.dispose=j}function Kl(e,t){function n(n,r=``){let i,a=xn.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var ql=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Jl=`
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

}`,Yl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ma(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ba({vertexShader:ql,fragmentShader:Jl,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ri(new ka(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Xl=class extends $t{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Yl,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new fn,C=null,w=null,T=new Eo;T.viewport=new Mn;let E=new Eo;E.viewport=new Mn;let D=[T,E],O=new No,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new pr,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new pr,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new pr,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function M(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,M),r.removeEventListener(`inputsourceschange`,N);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,te.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&W(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&W(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,M),r.addEventListener(`inputsourceschange`,N),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?ze:Re,a=_.stencil?Me:De);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Pn(d.textureWidth,d.textureHeight,{format:Le,type:Te,depthTexture:new fa(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Pn(f.framebufferWidth,f.framebufferHeight,{format:Le,type:Te,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),te.setContext(r),te.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function N(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}function ee(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;ee(O,i);for(let e=0;e<a.length;e++)ee(a[e],i);O.projectionMatrix.copy(T.projectionMatrix),O.projectionMatrixInverse.copy(T.projectionMatrixInverse),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),P(e,O,i)};function P(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=nn*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let F=null;function I(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new Eo,o.layers.enable(n),o.viewport=new Mn,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new ma,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}F&&F(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let te=new Jo;te.setAnimationLoop(I),this.setAnimationLoop=function(e){F=e},this.dispose=function(){}}},Zl=new Ln,Ql=new gn;Ql.set(-1,0,0,0,1,0,0,0,1);function $l(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Ia(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Zl.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Ql),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function eu(e,t,n,r){let i={},a={};function o(e,t){let n=t.program;r.uniformBlockBinding(e,n,i[e.id])}function s(e,n){let o=i[e.id];o===void 0&&(m(e),o=c(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let u=t.render.frame;a[e.id]!==u&&(l(e),a[e.id]=u)}function c(t){let n=e.createBuffer(),r=t.__size,i=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,r,i),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function l(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)u(t[n],e,n,a);else u(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function u(t,n,r,i){if(f(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=h(i,!0);d(i,t.__data,e),e+=a.storage/Float32Array.BYTES_PER_ELEMENT}}else d(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function d(e,t,n){typeof e==`number`||typeof e==`boolean`?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,r){let i=e.value,a=t+`_`+n;if(Array.isArray(i)){r[a]===void 0&&(r[a]=[]);let e=r[a],t=!1;for(let n=0;n<i.length;n++)p(i[n],e,n)===!0&&(t=!0);return t}return p(i,r,a)}function p(e,t,n){if(t[n]===void 0)return t[n]=typeof e==`number`||typeof e==`boolean`?e:ArrayBuffer.isView(e)?e.slice():e.clone(),!0;{let r=t[n];if(typeof e==`number`||typeof e==`boolean`){if(r!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(r.equals(e)===!1)return r.copy(e),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let i=0,a=r.length;i<a;i++){let a=r[i],o=Array.isArray(a.value)?a.value:[a.value],s=Array.isArray(t[e])||Array.isArray(a.value),c=n;for(let e=0,t=o.length;e<t;e++){let t=o[e],r=h(t,s),i=n%16,a=i%r.boundary,l=i+a;n+=a,l!==0&&16-l<r.storage&&(n+=16-l),e===0&&(c=n),n+=r.storage}a.__data=new(a.type===`int`?Int32Array:a.type===`uint`?Uint32Array:Float32Array)((n-c)/Float32Array.BYTES_PER_ELEMENT),a.__offset=c}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e,t){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?W(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):W(`WebGLRenderer: Unsupported uniform value type.`,e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function g(t){let n=t.target;n.removeEventListener(`dispose`,g),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);i={},a={}}return{bind:o,update:s,dispose:_}}var tu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),nu=null;function ru(){return nu===null&&(nu=new Vi(tu,16,16,He,ke),nu.name=`DFG_LUT`,nu.minFilter=B,nu.magFilter=B,nu.wrapS=ye,nu.wrapT=ye,nu.generateMipmaps=!1,nu.needsUpdate=!0),nu}var iu=class{constructor(e={}){let{canvas:t=Kt(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Te}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([We,Ue,Ve]),g=new Set([Te,De,U,Me,Ae,je]),_=new Uint32Array(4),v=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=Ft;let j=0,M=0,N=null,ee=-1,P=null,F=new Mn,I=new Mn,te=null,ne=new q(0),re=0,ie=t.width,ae=t.height,oe=1,se=null,L=null,ce=new Mn(0,0,ie,ae),le=new Mn(0,0,ie,ae),ue=!1,de=new ea,R=new na,fe=!1,pe=!1,me=new Ln,he=new K,ge=new Mn,_e={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ve=!1;function ye(){return N===null?oe:1}let z=n;function be(e,n){return t.getContext(e,n)}let xe,Se,B,Ce,V,H,Ee,Oe,Ne,Pe,Fe,Ie,Le,Re,ze,Be,He,Ge,Ke,qe,Je,Ye,Xe;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r187`),t.addEventListener(`webglcontextlost`,$e,!1),t.addEventListener(`webglcontextrestored`,et,!1),t.addEventListener(`webglcontextcreationerror`,tt,!1),z===null){let t=`webgl2`;if(z=be(t,e),z===null)throw be(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Ze()}catch(e){throw t.removeEventListener(`webglcontextlost`,$e,!1),t.removeEventListener(`webglcontextrestored`,et,!1),t.removeEventListener(`webglcontextcreationerror`,tt,!1),G(`WebGLRenderer: `+e.message),e}function Ze(){xe=new ws(z),xe.init(),Je=new Kl(z,xe),Se=new is(z,xe,e,Je),B=new Wl(z,xe),Se.reversedDepthBuffer&&d&&B.buffers.depth.setReversed(!0),O=z.createFramebuffer(),k=z.createFramebuffer(),A=z.createFramebuffer(),Ce=new Ds(z),V=new wl,H=new Gl(z,xe,B,V,Se,Je,Ce),Ee=new Cs(T),Oe=new Yo(z),Ye=new ns(z,Oe),Ne=new Ts(z,Oe,Ce,Ye),Pe=new ks(z,Ne,Oe,Ye,Ce),Ge=new Os(z,Se,H),ze=new as(V),Fe=new Cl(T,Ee,xe,Se,Ye,ze),Ie=new $l(T,V),Le=new Ol,Re=new Fl(xe),He=new ts(T,Ee,B,Pe,p,s),Be=new Ul(T,Pe,Se),Xe=new eu(z,Ce,Se,B),Ke=new rs(z,xe,Ce),qe=new Es(z,xe,Ce),Ce.programs=Fe.programs,T.capabilities=Se,T.extensions=xe,T.properties=V,T.renderLists=Le,T.shadowMap=Be,T.state=B,T.info=Ce}m!==1009&&(w=new js(m,t.width,t.height,o,r,i));let Qe=new Xl(T,z);this.xr=Qe,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let e=xe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=xe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return oe},this.setPixelRatio=function(e){e!==void 0&&(oe=e,this.setSize(ie,ae,!1))},this.getSize=function(e){return e.set(ie,ae)},this.setSize=function(e,n,r=!0){Qe.isPresenting?W(`WebGLRenderer: Can't change size while VR device is presenting.`):(ie=e,ae=n,t.width=Math.floor(e*oe),t.height=Math.floor(n*oe),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(ie*oe,ae*oe).floor()},this.setDrawingBufferSize=function(e,n,r){ie=e,ae=n,oe=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)G(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){W(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(F)},this.getViewport=function(e){return e.copy(ce)},this.setViewport=function(e,t,n,r){e.isVector4?ce.set(e.x,e.y,e.z,e.w):ce.set(e,t,n,r),B.viewport(F.copy(ce).multiplyScalar(ye()).round())},this.getScissor=function(e){return e.copy(le)},this.setScissor=function(e,t,n,r){e.isVector4?le.set(e.x,e.y,e.z,e.w):le.set(e,t,n,r),B.scissor(I.copy(le).multiplyScalar(ye()).round())},this.getScissorTest=function(){return ue},this.setScissorTest=function(e){B.setScissorTest(ue=e)},this.setOpaqueSort=function(e){se=e},this.setTransparentSort=function(e){L=e},this.getClearColor=function(e){return e.copy(He.getClearColor())},this.setClearColor=function(){He.setClearColor(...arguments)},this.getClearAlpha=function(){return He.getClearAlpha()},this.setClearAlpha=function(){He.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=He.getClearColor(),r=He.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,z.clearBufferuiv(z.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,z.clearBufferiv(z.COLOR,0,v))}else r|=z.COLOR_BUFFER_BIT}t&&(r|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&z.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,$e,!1),t.removeEventListener(`webglcontextrestored`,et,!1),t.removeEventListener(`webglcontextcreationerror`,tt,!1),He.dispose(),Le.dispose(),Re.dispose(),H.dispose(),V.dispose(),Ee.dispose(),Pe.dispose(),Ne.dispose(),Ye.dispose(),Xe.dispose(),Fe.dispose(),Qe.dispose(),Qe.removeEventListener(`sessionstart`,ct),Qe.removeEventListener(`sessionend`,lt),ut.stop()};function $e(e){e.preventDefault(),Jt(`WebGLRenderer: Context Lost.`),E=!0}function et(){Jt(`WebGLRenderer: Context Restored.`),E=!1;let e=Ce.autoReset,t=Be.enabled,n=Be.autoUpdate,r=Be.needsUpdate,i=Be.type;Ze(),Ce.autoReset=e,Be.enabled=t,Be.autoUpdate=n,Be.needsUpdate=r,Be.type=i}function tt(e){G(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function nt(e){let t=e.target;t.removeEventListener(`dispose`,nt),rt(t)}function rt(e){it(e),V.remove(e)}function it(e){let t=V.get(e).programs;t!==void 0&&(t.forEach(function(e){Fe.releaseProgram(e)}),e.isShaderMaterial&&Fe.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=_e);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=xt(e,t,n,r,i);B.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ne.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ye.setup(i,r,s,n,c);let h,g=Ke;if(c!==null&&(h=Oe.get(c),g=qe,g.setIndex(h)),i.isMesh)r.wireframe===!0?(B.setLineWidth(r.wireframeLinewidth*ye()),g.setMode(z.LINES)):g.setMode(z.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),B.setLineWidth(e*ye()),i.isLineSegments?g.setMode(z.LINES):i.isLineLoop?g.setMode(z.LINE_LOOP):g.setMode(z.LINE_STRIP)}else i.isPoints?g.setMode(z.POINTS):i.isSprite&&g.setMode(z.TRIANGLES);if(i.isBatchedMesh){if(xe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Oe.get(c).bytesPerElement:1,o=V.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(z,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function at(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),fe===!0&&ze.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,_t(e,t,r),e.side=0,e.needsUpdate=!0,_t(e,t,r),e.side=2):_t(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Re.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),pe=this.localClippingEnabled,fe=ze.init(this.clippingPlanes,pe),fe===!0&&ze.setGlobalState(this.clippingPlanes,t),D!==null&&Be.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];at(o,n,t,e),r.add(o)}else at(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=V.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}xe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let ot=null;function st(e){ot&&ot(e)}function ct(){ut.stop()}function lt(){ut.start()}let ut=new Jo;ut.setAnimationLoop(st),typeof self<`u`&&ut.setContext(self),this.setAnimationLoop=function(e){ot=e,Qe.setAnimationLoop(e),e===null?ut.stop():ut.start()},Qe.addEventListener(`sessionstart`,ct),Qe.addEventListener(`sessionend`,lt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){G(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Qe.enabled===!0&&Qe.isPresenting===!0,r=w!==null&&(N===null||n)&&w.begin(T,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Qe.enabled===!0&&Qe.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Qe.cameraAutoUpdate===!0&&Qe.updateCamera(t),t=Qe.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,N),x=Re.get(e,C.length),x.init(t),x.state.textureUnits=H.getTextureUnits(),C.push(x),me.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?R.setFromArrayCamera(t):de.setFromProjectionMatrix(me,Ht,t.reversedDepth),pe=this.localClippingEnabled,fe=ze.init(this.clippingPlanes,pe),b=Le.get(e,S.length),b.init(),S.push(b),this.info.render.frame++,Qe.enabled===!0&&Qe.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&dt(e,t,-1/0,T.sortObjects)}dt(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(se,L),ve=Qe.enabled===!1||Qe.isPresenting===!1||Qe.hasDepthSensing()===!1,ve&&He.addToRenderList(b,e),this.info.autoReset===!0&&this.info.reset(),fe===!0&&ze.beginShadows();let i=x.state.shadowsArray;if(Be.render(i,e,t),fe===!0&&ze.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];pt(n,r,e,a)}ve&&He.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];ft(b,e,n,n.viewport)}}else r.length>0&&pt(n,r,e,t),ve&&He.render(e),ft(b,e,t)}N!==null&&M===0&&(H.updateMultisampleRenderTarget(N),H.updateRenderTargetMipmap(N)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Ye.resetDefaultState(),ee=-1,P=null,C.pop(),C.length>0?(x=C[C.length-1],H.setTextureUnits(x.state.textureUnits),fe===!0&&ze.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function dt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){let i=t.isArrayCamera?R:de;if(!e.frustumCulled||e.intersectsFrustum(i)){r&&ge.setFromMatrixPosition(e.matrixWorld).applyMatrix4(me);let i=Pe.update(e),a=e.material;a.visible&&b.push(e,i,a,n,ge.z,null,t)}}else if(e.isMesh||e.isLine||e.isPoints){let i=t.isArrayCamera?R:de;if(!e.frustumCulled||e.intersectsFrustum(i)){let i=Pe.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),ge.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),ge.copy(e.boundingSphere.center)),ge.applyMatrix4(e.matrixWorld).applyMatrix4(me)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,ge.z,s,t)}}else a.visible&&b.push(e,i,a,n,ge.z,null,t)}}}let i=e.children;for(let e=0,a=i.length;e<a;e++)dt(i[e],t,n,r)}function ft(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),fe===!0&&ze.setGlobalState(T.clippingPlanes,n),r&&B.viewport(F.copy(r)),i.length>0&&mt(i,t,n),a.length>0&&mt(a,t,n),o.length>0&&mt(o,t,n),B.buffers.depth.setTest(!0),B.buffers.depth.setMask(!0),B.buffers.color.setMask(!0),B.setPolygonOffset(!1)}function pt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=xe.has(`EXT_color_buffer_half_float`)||xe.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new Pn(1,1,{generateMipmaps:!0,type:e?ke:Te,minFilter:we,samples:Math.max(4,Se.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:xn.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||F;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(ne),re=T.getClearAlpha(),re<1&&T.setClearColor(16777215,.5),T.clear(),ve&&He.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),fe===!0&&ze.setGlobalState(T.clippingPlanes,r),mt(e,n,r),H.updateMultisampleRenderTarget(a),H.updateRenderTargetMipmap(a),xe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,ht(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(H.updateMultisampleRenderTarget(a),H.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(ne,re),d!==void 0&&(r.viewport=d),T.toneMapping=u}function mt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&ht(o,t,n,s,l,c)}}function ht(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function gt(e){let t=0;for(let n of e)n.texture!==null&&t++;return t}function _t(e,t,n){t.isScene!==!0&&(t=_e);let r=V.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Fe.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Fe.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ee.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,nt),l=new Map,r.programs=l,r.programVariants=new Map);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return bt(e,s),d}else s.uniforms=Fe.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Fe.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=ze.uniform),bt(e,s),r.needsLights=Ct(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.numLightProbeGrids=gt(x.state.lightProbeGridArray),r.currentProgram=d,r.uniformsList=null,d}function vt(e,t,n,r,i){let a=V.get(e),o=a.currentProgram.id+`,`+r+`,`+i,s=a.programVariants.get(o);return s===void 0?(s=_t(e,t,n),a.programVariants.set(o,s)):(a.currentProgram=s,a.uniformsList=null,a.outputColorSpace=r,a.toneMapping=i),s}function yt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Bc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function bt(e,t){let n=V.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function xt(e,t,n,r,i){t.isScene!==!0&&(t=_e),H.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?T.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:xn.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ee.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=V.get(r),b=x.state.lights;if(fe===!0&&(pe===!0||e!==P)){let t=e===P&&r.id===ee;ze.setState(r,e,t)}let S=!1,C=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==b.state.version||i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?S=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==ze.numPlanes||v.numIntersection!==ze.numIntersection)?S=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.morphTargetsCount===_&&v.numLightProbeGrids===gt(x.state.lightProbeGridArray)?(v.outputColorSpace!==s||v.toneMapping!==h)&&(C=!0):S=!0:S=!0:(S=!0,v.__version=r.version);let w=v.currentProgram;(S===!0||C===!0)&&(w=C===!0?vt(r,t,i,s,h):_t(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,w,v));let E=!1,O=!1,k=!1,A=w.getUniforms(),j=v.uniforms;if(B.useProgram(w.program)&&(E=!0,O=!0,k=!0),r.id!==ee&&(ee=r.id,O=!0),E||P!==e){B.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),A.setValue(z,`projectionMatrix`,e.projectionMatrix),A.setValue(z,`viewMatrix`,e.matrixWorldInverse);let t=A.map.cameraPosition;t!==void 0&&t.setValue(z,he.setFromMatrixPosition(e.matrixWorld)),Se.logarithmicDepthBuffer&&A.setValue(z,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&A.setValue(z,`isOrthographic`,e.isOrthographicCamera===!0),P!==e&&(P=e,O=!0,k=!0)}if(v.needsLights&&(b.state.sunShadowMap.length>0&&A.setValue(z,`sunShadowMap`,b.state.sunShadowMap,H),b.state.directionalShadowMap.length>0&&A.setValue(z,`directionalShadowMap`,b.state.directionalShadowMap,H),b.state.spotShadowMap.length>0&&A.setValue(z,`spotShadowMap`,b.state.spotShadowMap,H),b.state.pointShadowMap.length>0&&A.setValue(z,`pointShadowMap`,b.state.pointShadowMap,H)),i.isSkinnedMesh){A.setOptional(z,i,`bindMatrix`),A.setOptional(z,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),A.setValue(z,`boneTexture`,e.boneTexture,H))}i.isBatchedMesh&&(A.setOptional(z,i,`batchingTexture`),A.setValue(z,`batchingTexture`,i._matricesTexture,H),A.setOptional(z,i,`batchingIdTexture`),A.setValue(z,`batchingIdTexture`,i._indirectTexture,H),A.setOptional(z,i,`batchingColorTexture`),i._colorsTexture!==null&&A.setValue(z,`batchingColorTexture`,i._colorsTexture,H));let M=n.morphAttributes;if((M.position!==void 0||M.normal!==void 0||M.color!==void 0)&&Ge.update(i,n,w),(O||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,A.setValue(z,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(j.envMapIntensity.value=t.environmentIntensity),j.dfgLUT!==void 0&&(j.dfgLUT.value=ru()),O){if(A.setValue(z,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&St(j,k),a&&r.fog===!0&&Ie.refreshFogUniforms(j,a),Ie.refreshMaterialUniforms(j,r,oe,ae,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.numLightProbeGrids>0){let e=y,t=0;for(let n of x.state.lightProbeGridArray)n.texture!==null&&(e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++);for(let n in e)e[n].length=t;j.probesSH.value=e.textures,j.probesMin.value=e.min,j.probesMax.value=e.max,j.probesResolution.value=e.resolution}Bc.upload(z,yt(v),j,H)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Bc.upload(z,yt(v),j,H),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&A.setValue(z,`center`,i.center),A.setValue(z,`modelViewMatrix`,i.modelViewMatrix),A.setValue(z,`normalMatrix`,i.normalMatrix),A.setValue(z,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Xe.update(n,w),Xe.bind(n,w)}}return w}function St(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Ct(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=V.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),V.get(e.texture).__webglTexture=t,V.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=V.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,j=t,M=n;let r=null,i=!1,a=!1;if(e){let o=V.get(e);if(o.__useDefaultFramebuffer!==void 0){B.bindFramebuffer(z.FRAMEBUFFER,o.__webglFramebuffer),F.copy(e.viewport),I.copy(e.scissor),te=e.scissorTest,B.viewport(F),B.scissor(I),B.setScissorTest(te),ee=-1;return}if(o.__webglFramebuffer===void 0)H.setupRenderTarget(e);else if(o.__hasExternalTextures)H.rebindTextures(e,V.get(e.texture).__webglTexture,V.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&V.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);H.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=V.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&H.useMultisampledRTT(e)===!1?V.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,F.copy(e.viewport),I.copy(e.scissor),te=e.scissorTest}else F.copy(ce).multiplyScalar(oe).floor(),I.copy(le).multiplyScalar(oe).floor(),te=ue;if(n!==0&&(r=O),B.bindFramebuffer(z.FRAMEBUFFER,r)&&B.drawBuffers(e,r),B.viewport(F),B.scissor(I),B.setScissorTest(te),i){let r=V.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=V.get(e.textures[t]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=V.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,t.__webglTexture,n)}ee=-1};function wt(e){let t=V.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Se.textureFormatReadable(e.format),t.__typeReadable=Se.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){G(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){B.bindFramebuffer(z.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s);let u=wt(o);if(u.__formatReadable===!1){G(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){G(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&z.readPixels(t,n,r,i,Je.convert(c),Je.convert(l),a)}finally{let e=N===null?null:V.get(N).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){B.bindFramebuffer(z.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s);let d=wt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,f),z.bufferData(z.PIXEL_PACK_BUFFER,a.byteLength,z.STREAM_READ),z.readPixels(t,n,r,i,Je.convert(l),Je.convert(u),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let p=N===null?null:V.get(N).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,p);let m=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Zt(z,m,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,f),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,a),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(f),z.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;H.setTexture2D(e,0),z.copyTexSubImage2D(z.TEXTURE_2D,n,0,0,o,s,i,a),B.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Je.convert(t.format),_=Je.convert(t.type),v;t.isData3DTexture?(H.setTexture3D(t,0),v=z.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(H.setTexture2DArray(t,0),v=z.TEXTURE_2D_ARRAY):(H.setTexture2D(t,0),v=z.TEXTURE_2D),B.activeTexture(z.TEXTURE0),B.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,t.flipY),B.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),B.pixelStorei(z.UNPACK_ALIGNMENT,t.unpackAlignment);let y=B.getParameter(z.UNPACK_ROW_LENGTH),b=B.getParameter(z.UNPACK_IMAGE_HEIGHT),x=B.getParameter(z.UNPACK_SKIP_PIXELS),S=B.getParameter(z.UNPACK_SKIP_ROWS),C=B.getParameter(z.UNPACK_SKIP_IMAGES);B.pixelStorei(z.UNPACK_ROW_LENGTH,h.width),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,h.height),B.pixelStorei(z.UNPACK_SKIP_PIXELS,l),B.pixelStorei(z.UNPACK_SKIP_ROWS,u),B.pixelStorei(z.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=V.get(e),r=V.get(t),h=V.get(n.__renderTarget),g=V.get(r.__renderTarget);B.bindFramebuffer(z.READ_FRAMEBUFFER,h.__webglFramebuffer),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,V.get(e).__webglTexture,i,d+n),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,V.get(t).__webglTexture,a,m+n)),z.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,z.DEPTH_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||V.has(e)){let n=V.get(e),r=V.get(t);B.bindFramebuffer(z.READ_FRAMEBUFFER,k),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,n.__webglTexture,i),T?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,r.__webglTexture,a),i===0?T?z.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):z.copyTexSubImage2D(v,a,f,p,l,u,o,s):z.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,z.COLOR_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?z.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h);B.pixelStorei(z.UNPACK_ROW_LENGTH,y),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,b),B.pixelStorei(z.UNPACK_SKIP_PIXELS,x),B.pixelStorei(z.UNPACK_SKIP_ROWS,S),B.pixelStorei(z.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps===!0&&t.mipmapsAutoUpdate===!0&&z.generateMipmap(v),B.unbindTexture()},this.initRenderTarget=function(e){V.get(e).__webglFramebuffer===void 0&&H.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?H.setTextureCube(e,0):e.isData3DTexture?H.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?H.setTexture2DArray(e,0):H.setTexture2D(e,0),B.unbindTexture()},this.resetState=function(){j=0,M=0,N=null,B.reset(),Ye.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ht}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=xn._getDrawingBufferColorSpace(e),t.unpackColorSpace=xn._getUnpackColorSpace()}},au=1.7,ou=2.3,su=new Map;function cu(t){let n=(t.id||``)+`:`+t.n+`:`+t.length.toFixed(3),i=su.get(n);if(i)return i;let a=t.n,o=t.px,s=t.pz,c=t.nx,l=t.nz,u=t.ds,d=new Float64Array(a),f=new Float64Array(a),p=new Float64Array(a),m=new Float64Array(a);for(let e=0;e<a;e++)d[e]=Math.max(.5,t.half[e]-(t.squeeze[e]?ou:au)),p[e]=o[e],m[e]=s[e];for(let t=0;t<2400;t++)for(let t=0;t<a;t++){let n=(t+a-1)%a,r=(t+1)%a,i=(t+a-2)%a,u=(t+2)%a,h=(4*(p[n]+p[r])-(p[i]+p[u]))/6-o[t],g=(4*(m[n]+m[r])-(m[i]+m[u]))/6-s[t],_=h*c[t]+g*l[t],v=e(f[t]+1.7*(_-f[t]),-d[t],d[t]);f[t]=v,p[t]=o[t]+c[t]*v,m[t]=s[t]+l[t]*v}let h=new Float64Array(a),g=new Float64Array(a),_=new Float32Array(a);for(let e=0;e<a;e++){let t=(e+1)%a,n=p[t]-p[e],r=m[t]-m[e];h[e]=Math.atan2(n,r),g[e]=Math.hypot(n,r)||u}for(let e=0;e<a;e++){let t=(e+a-1)%a;_[e]=r(h[e]-h[t])/((g[e]+g[t])/2)}let v=lu(_,2),y={d:Float32Array.from(f),kappa:v,x:Float32Array.from(p),z:Float32Array.from(m)};return su.set(n,y),y}function lu(e,t){let n=e.length,r=new Float32Array(n);for(let i=0;i<n;i++){let a=0;for(let r=-t;r<=t;r++)a+=e[(i+r+n)%n];r[i]=a/(2*t+1)}return r}var uu=.88,du=.85,fu=.8,pu=new Map;function mu(t,n){let r=(t.id||``)+`:`+n.id+`:`+t.n+`:`+t.length.toFixed(3),i=pu.get(r);if(i)return i;let a=t.n,o=cu(t).kappa,s=new Float32Array(a),c=new Float32Array(a);for(let e=0;e<a;e++){let r=0;for(let t=-3;t<=3;t++)r=Math.max(r,Math.abs(o[(e+t+a)%a]));let i=28*Math.sqrt(Math.max(.04,.9*n.steer/Math.max(r,1e-4)-1));s[e]=Math.min(n.vTop*1.05,i,m(n,r,t.squeeze[e]?du:uu)),c[e]=s[e]}for(let r=0;r<2*a;r++){let i=a-1-r%a,s=(i+1)%a,l=c[s],u=t.squeeze[s]?du:uu,d=p(n,l,u),f=e(l*l*Math.abs(o[s])/Math.max(d,1),0,1),m=Math.max(g,Math.sqrt(1-f*f)),h=Math.min(v(n,l,u)*fu,_(n,l,u)*.9*m),y=Math.sqrt(l*l+2*h*t.ds);y<c[i]&&(c[i]=y)}let l={v:c,corner:s};return pu.set(r,l),l}var hu={RED:.5,YELLOW:.12,MIN_YELLOW:2,BLEND:.35,MIN_DIST:4},gu=[.2,.95,.32],_u=[1,.84,.08],vu=[1,.14,.1];function yu(e,t,n){return e<=t?0:(e*e-t*t)/(2*Math.max(n,hu.MIN_DIST))}function bu(e,t){return e>=hu.RED*t?2:+(e>=Math.max(hu.MIN_YELLOW,hu.YELLOW*t))}function xu(e,t,n,r=0){let i=Math.max(hu.MIN_YELLOW,hu.YELLOW*t),a=hu.RED*t,o=hu.BLEND,s=gu,c=gu,l=0;return e>=a?s=c=vu:e>=a*(1-o*.5)?(s=_u,c=vu,l=(e-a*(1-o*.5))/(a*o*.5)):e>=i?s=c=_u:e>=i*(1-o)&&(s=gu,c=_u,l=(e-i*(1-o))/(i*o)),n[r]=s[0]+(c[0]-s[0])*l,n[r+1]=s[1]+(c[1]-s[1])*l,n[r+2]=s[2]+(c[2]-s[2])*l,bu(e,t)}var Su=.75,Cu=.07,wu=e=>Math.ceil(148/e.ds)+1;function Tu(e,t,n,r,i,a,o,s=wu(e)){let c=e.n,l=e.ds,u=cu(e),d=mu(e,t).v,f=Math.sqrt(Math.max(.25,i)),p=v(t,Math.max(r,8),Math.min(1,i)),m=Math.floor((n-8)/l),h=Eu;for(let t=0;t<s;t++){let i=((m+t)%c+c)%c,s=(m+t)*l-n,g=d[i]*f;xu(s<0?0:yu(r,g,s),p,h);let _=u.d[i]+Su,v=u.d[i]-Su,y=e.py[i]+Cu,b=t*6,x=t*8;a[b]=e.px[i]+e.nx[i]*_,a[b+1]=y,a[b+2]=e.pz[i]+e.nz[i]*_,a[b+3]=e.px[i]+e.nx[i]*v,a[b+4]=y,a[b+5]=e.pz[i]+e.nz[i]*v;let S=Math.min(1,Math.max(0,(s+8)/6))*Math.min(1,Math.max(0,(140-s)/30));o[x]=o[x+4]=h[0],o[x+1]=o[x+5]=h[1],o[x+2]=o[x+6]=h[2],o[x+3]=o[x+7]=.9*S}return s}var Eu=[0,0,0];function Du(e,t){return e===`hard`?!1:t==null||!!t}var Ou=[[0,0,0,9,15],[130,0,0,9,15],[260,0,0,9,15],[330,0,8,8.5,15],[385,1,50,8,15],[400,3,115,8,15],[397,8,170,7.5,15],[404,15,225,7.5,15],[394,22,280,7.5,15],[403,28,335,7.5,15],[396,32,385,7.5,15],[386,33,448,8,15],[326,33,474,8,15],[240,32,434,7,14],[190,26,407,7,14],[150,17,430,7,14],[105,9,405,7,14],[62,3,396,7.5,14],[20,1,376,7.5,12],[-25,0,345,6,1.3],[-45,0,300,6,1.3],[-95,0,285,6,1.3],[-110,0,240,6,1.3],[-165,0,225,6,1.3],[-180,0,180,6,1.3],[-235,0,165,6.5,2],[-290,0,120,8,15],[-340,0,70,9,15],[-310,0,12,9,15],[-250,0,0,9,15],[-130,0,0,9,15]],ku={id:`citadel`,name:`Citadel Circuit`,blurb:`Stone walls, a blind plunge and the tight squeeze.`,theme:`circuitDay`,seed:7,points:Ou,sections:[{name:`Ironside Straight`,a:28.6,b:Ou.length+2.4,kind:`straight`},{name:`Anvil Bend`,a:2.4,b:5.4},{name:`Thunder Climb`,a:5.4,b:10.6},{name:`Crown Hairpin`,a:10.6,b:12.8},{name:`The Plunge`,a:12.8,b:18.6},{name:`Citadel Squeeze`,a:18.6,b:25.6},{name:`Moat Sweep`,a:25.6,b:28.6}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},Au=2.5,ju=[0,0,.5],Mu=class{constructor(e=ku){let a=e.points,o=a.length,s=e.sections;this.def=e,this.id=e.id,this.name=e.name,this.themeId=e.theme,this.seed=e.seed??1;let c=this.pit={boxStart:-60,boxStep:16,...e.pit,limit:e.pit.speed},l=new Da(a.map(e=>new K(e[0],e[1],e[2])),!0,`centripetal`),u=[];for(let e=0;e<o*80;e++){let t=e/(o*80),n=l.getPoint(t);u.push({x:n.x,y:n.y,z:n.z,f:t*o})}let d=[0];for(let e=1;e<=u.length;e++){let t=u[e-1],n=u[e%u.length];d.push(d[e-1]+Math.hypot(n.x-t.x,n.z-t.z))}let f=d[u.length],p=Math.max(16,Math.round(f/Au/16)*16);this.n=p,this.length=f,this.ds=f/p;let m=this.px=new Float32Array(p),h=this.py=new Float32Array(p),g=this.pz=new Float32Array(p),_=new Float32Array(p),v=0;for(let e=0;e<p;e++){let n=e*this.ds;for(;d[v+1]<n;)v++;let r=(n-d[v])/(d[v+1]-d[v]),i=u[v],a=u[(v+1)%u.length];m[e]=t(i.x,a.x,r),h[e]=t(i.y,a.y,r),g[e]=t(i.z,a.z,r);let s=a.f;s<i.f&&(s+=o),_[e]=t(i.f,s,r)%o}let y=this.tx=new Float32Array(p),b=this.tz=new Float32Array(p),x=this.nx=new Float32Array(p),S=this.nz=new Float32Array(p),C=this.theta=new Float32Array(p);for(let e=0;e<p;e++){let t=(e+p-1)%p,n=(e+1)%p,r=m[n]-m[t],i=g[n]-g[t],a=Math.hypot(r,i);r/=a,i/=a,y[e]=r,b[e]=i,x[e]=i,S[e]=-r,C[e]=Math.atan2(r,i)}let w=new Float32Array(p);for(let e=0;e<p;e++)w[e]=r(C[(e+1)%p]-C[(e+p-1)%p])/(2*this.ds);this.kappa=w,this.kappaS=this._smooth(w,10),this.kappaN=this._smooth(w,3),this.half=new Float32Array(p),this.runoff=new Float32Array(p),this.section=new Uint8Array(p),this.squeeze=new Uint8Array(p);for(let e=0;e<p;e++){let r=_[e],i=Math.floor(r)%o,c=(i+1)%o,l=n(0,1,r-Math.floor(r));this.half[e]=t(a[i][3],a[c][3],l),this.runoff[e]=t(a[i][4],a[c][4],l),this.squeeze[e]=+(this.runoff[e]<5);let u=0;for(let e=0;e<s.length;e++){let t=s[e],n=t.b>o&&r<t.a?r+o:r;if(n>=t.a&&n<t.b){u=e;break}}this.section[e]=u}this.sections=s.map(e=>e.name),this.leftWall=new Float32Array(p),this.rightWall=new Float32Array(p),this.pitTaper=new Float32Array(p),this._computeRunoff();for(let e=0;e<p;e++){let r=i(e*this.ds,this.length),a=n(c.entry,c.laneStart,r)*(1-n(c.laneEnd,c.exit,r));this.pitTaper[e]=a,this.rightWall[e]=this.half[e]+this.runR[e],this.leftWall[e]=t(this.half[e]+this.runL[e],this.half[e]+19,a)}this.kerb=new Uint8Array(p),this.gravel=new Uint8Array(p);for(let e=0;e<p;e++){let t=!this.squeeze[e];this.kerb[e]=t&&Math.abs(this.kappaS[e])>.0035?1:0,this.gravel[e]=this.kerb[e]}this._computeLine(),this._loc={i:0,s:0,d:0}}_computeRunoff(){let t=this.n,n=2.2,r=.8,i=this._smooth(this.kappa,2),a=new Float32Array(t).fill(1e4),o=new Float32Array(t).fill(1e4);for(let e=0;e<t;e++)i[e]>1e-4?a[e]=1/i[e]:i[e]<-1e-4&&(o[e]=-1/i[e]);let s=e=>{let n=new Float32Array(t);for(let r=0;r<t;r++){let i=1e4;for(let n=-9;n<=9;n++)i=Math.min(i,e[(r+n+t)%t]);n[r]=i}return n},c=s(a),l=s(o),u=new Float32Array(t),d=new Float32Array(t);for(let i=0;i<t;i++)u[i]=e(Math.min(this.runoff[i],c[i]-n-this.half[i]),r,this.runoff[i]),d[i]=e(Math.min(this.runoff[i],l[i]-n-this.half[i]),r,this.runoff[i]);this.runL=this._smooth(u,5),this.runR=this._smooth(d,5);for(let e=0;e<t;e++)this.runL[e]=Math.min(this.runL[e],this.runoff[e]),this.runR[e]=Math.min(this.runR[e],this.runoff[e])}runAt(e,t){return t>=0?this.runL[e]:this.runR[e]}_smooth(e,t){let n=this.n,r=new Float32Array(n);for(let i=0;i<n;i++){let a=0;for(let r=-t;r<=t;r++)a+=e[(i+r+n)%n];r[i]=a/(2*t+1)}return r}_computeLine(){let e=cu(this);this.line=e.d,this.lineK=e.kappa}sectionName(e){return this.sections[this.section[e]]}locate(e,t,n,r=this._loc,i=40){let a=this.n,o=this.px,s=this.pz,c=0xde0b6b3a7640000,l=n,u=i<0?0:-i,d=i<0?a-1:i;for(let r=u;r<=d;r++){let i=(n+r+a)%a,u=e-o[i],d=t-s[i],f=u*u+d*d;f<c&&(c=f,l=i)}let f=e-o[l],p=t-s[l];return r.i=l,r.s=((l*this.ds+f*this.tx[l]+p*this.tz[l])%this.length+this.length)%this.length,r.d=f*this.nx[l]+p*this.nz[l],r}locateGlobal(e,t,n=this._loc){return this.locate(e,t,0,n,-1)}_idx(e){e=(e%this.length+this.length)%this.length;let t=e/this.ds,n=Math.floor(t)%this.n;return ju[0]=n,ju[1]=(n+1)%this.n,ju[2]=t-Math.floor(t),ju}_lerpAt(e,n){let r=this._idx(n);return t(e[r[0]],e[r[1]],r[2])}yAt(e){return this._lerpAt(this.py,e)}bankAt(e){return 0}slopeAt(e){return(this.yAt(e+3)-this.yAt(e-3))/6}halfAt(e){return this._lerpAt(this.half,e)}thetaAt(e){let t=this._idx(e),n=t[0],i=t[1],a=t[2];return this.theta[n]+r(this.theta[i]-this.theta[n])*a}lineAt(e){return this._lerpAt(this.line,e)}lineKappaAt(e){return this._lerpAt(this.lineK,e)}kappaAt(e){return this._lerpAt(this.kappa,e)}at(e,n=0,r=new K){let i=this._idx(e),a=i[0],o=i[1],s=i[2],c=t(this.nx[a],this.nx[o],s),l=t(this.nz[a],this.nz[o],s),u=Math.hypot(c,l)||1;return r.set(t(this.px[a],this.px[o],s)+c/u*n,t(this.py[a],this.py[o],s),t(this.pz[a],this.pz[o],s)+l/u*n),r}surfaceAt(e,t){let n=Math.abs(t),r=this.half[e],i=this.pitTaper[e];return t>0&&i>.02&&n<=r+16*i?n<=r?`asphalt`:`pit`:n<=r||this.squeeze[e]&&n<=r+this.runAt(e,t)+.05?`asphalt`:this.kerb[e]&&n<=r+1.4?`kerb`:this.gravel[e]&&n<=r+this.runAt(e,t)+.5?`gravel`:`grass`}clearance(e,t){let n=this.n,r=1e9;for(let i=0;i<n;i++){let n=e-this.px[i],a=t-this.pz[i],o=n*this.nx[i]+a*this.nz[i]>=0?this.leftWall[i]:this.rightWall[i],s=Math.hypot(n,a)-o;s<r&&(r=s)}return r}laneD(e){return this.half[e]+4.5}boxD(e){return this.half[e]+11.5}boxU(e){return this.pit.boxStart+e*this.pit.boxStep}},Nu=[[0,8,0,9.5,16],[130,8,0,9.5,16],[260,8,0,9.5,16],[340,10,18,8.5,14],[400,14,72,8,14],[428,20,142,8,14],[400,28,210,7.5,13],[330,36,258,7.5,13],[255,42,236,7.5,12],[195,48,286,7.5,12],[155,52,345,8,12],[112,54,398,8.5,13],[52,54,374,8.5,13],[74,52,314,8,13],[132,46,272,8,14],[88,40,220,8,14],[18,32,188,7.5,13],[-52,24,168,7.5,13],[-122,16,142,8,14],[-192,12,112,8.5,14],[-252,9,86,9,15],[-318,8,60,9,15],[-348,8,28,9,15],[-300,8,10,9.5,16],[-250,8,0,9.5,16],[-130,8,0,9.5,16]],Pu={id:`highpine`,name:`Highpine Ring`,blurb:`Snowbanks, pines and a climb to the summit hairpin.`,theme:`alpine`,seed:17,points:Nu,sections:[{name:`Fir Straight`,a:23.3,b:Nu.length+2.4,kind:`straight`},{name:`Larch Bend`,a:2.4,b:5.6},{name:`Switchback Climb`,a:5.6,b:10.6},{name:`Summit Hairpin`,a:10.6,b:13.5},{name:`Ridge Run`,a:13.5,b:15.5},{name:`Avalanche Drop`,a:15.5,b:20.6},{name:`Lodge Sweep`,a:20.6,b:23.3}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},Fu=[[0,2,0,9.5,16],[130,2,0,9.5,16],[260,2,0,9.5,16],[340,3,24,8.5,15],[412,5,88,8,14],[448,8,158,8,14],[452,11,232,8,14],[410,14,302,8,14],[340,16,350,8,14],[265,17,378,8,14],[190,16,400,8.5,13],[125,15,388,8.5,13],[108,14,348,8,13],[150,12,310,8,13],[215,10,268,8,14],[255,8,208,8,14],[188,6,162,8,14],[98,4,152,8.5,15],[8,3,158,8.5,15],[-92,2.5,142,9,15],[-182,2,112,9,15],[-255,2,76,9,15],[-325,2,38,9,15],[-292,2,10,9.5,16],[-250,2,0,9.5,16],[-130,2,0,9.5,16]],Iu={id:`dripwood`,name:`Dripwood Vale`,blurb:`Wet forest: rain, puddles and a climb under the canopy.`,theme:`forest`,seed:23,points:Fu,sections:[{name:`Moss Straight`,a:23.2,b:Fu.length+2.4,kind:`straight`},{name:`Fern Bend`,a:2.4,b:5.6},{name:`Canopy Climb`,a:5.6,b:9.5},{name:`Root Hairpin`,a:9.5,b:13.4},{name:`Puddle Esses`,a:13.4,b:16.5},{name:`Creek Run`,a:16.5,b:20.5,kind:`straight`},{name:`Owl Sweep`,a:20.5,b:23.2}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},Lu=[[0,0,0,9.5,16],[130,0,0,9.5,16],[260,0,0,9.5,16],[345,0,12,8.5,15],[398,.5,50,8.5,15],[415,2,115,8,15],[410,7,190,8,15],[440,14,255,7.5,15],[432,22,325,7.5,15],[395,28,385,7.5,15],[330,31,425,8,15],[250,31,418,8,15],[170,30,430,8,15],[112,29,420,8,14],[95,28,380,8,14],[135,26,345,8,14],[200,21,340,7.5,14],[265,15,315,7.5,14],[300,11,270,7.5,14],[265,7,225,7.5,14],[275,4,175,7.5,14],[240,2,125,8,15],[170,1,100,8.5,15],[60,0,108,9,15],[-60,0,112,9,15],[-170,0,112,9,15],[-255,0,112,8.5,15],[-330,0,72,8.5,15],[-300,0,14,9,15],[-250,0,0,9.5,16],[-130,0,0,9.5,16]],Ru={id:`desert`,name:`Sandglass Circuit`,blurb:`Night race across the dunes: a mesa climb and three hairpins.`,theme:`desertNight`,seed:31,points:Lu,sections:[{name:`Sidewinder Straight`,a:28.9,b:Lu.length+2.6,kind:`straight`},{name:`Cairn Turn`,a:2.6,b:5.2},{name:`Dune Rise`,a:5.2,b:9.4},{name:`Kiln Run`,a:9.4,b:12.6},{name:`Mesa Hairpin`,a:12.6,b:15.4},{name:`Scorpion Esses`,a:15.4,b:20.6},{name:`Oasis Sweep`,a:20.6,b:23},{name:`Mirage Run`,a:23,b:25.6,kind:`straight`},{name:`Sandglass Hairpin`,a:25.6,b:28.9}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},zu=[[0,0,0,9,16],[130,0,0,9,16],[250,0,0,9,16],[322,1,16,8,6.6],[368,2.5,68,7.5,6.2],[378,4,128,7.5,6.2],[338,6,182,7.2,6.2],[276,8,214,7.2,6.2],[214,9,176,7.2,6.2],[168,8,222,7.2,6.2],[112,7,258,7.6,6.5],[48,6,228,7.6,6.5],[78,5,168,7.5,6.3],[22,3,142,7.6,6.3],[-58,2,158,8,6.3],[-148,1,136,8,6.3],[-220,.4,86,8,6.5],[-268,0,28,8.5,8],[-246,0,8,9,14],[-170,0,0,9,16],[-80,0,0,9,16]],Bu={id:`lampwick`,name:`Lampwick Mile`,blurb:`Night streets: neon, a city hill and walls close to the track.`,theme:`neonStreet`,seed:41,points:zu,sections:[{name:`Lamp Straight`,a:18.2,b:zu.length+2.4,kind:`straight`},{name:`Marquee Bend`,a:2.4,b:5.5},{name:`Arcade Esses`,a:5.5,b:9.5},{name:`Hotel Hairpin`,a:9.5,b:12.6},{name:`Quay Run`,a:12.6,b:17.3},{name:`Clock Corner`,a:17.3,b:18.2}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},Vu=[[0,2,0,9.5,16],[130,2,0,9.5,16],[260,2,0,9.5,16],[335,2,6,8.5,15],[392,3,38,8.5,15],[425,5,92,8,15],[438,11,143,8,15],[429,19,194,8,15],[442,28,244,8,15],[438,36,294,8,15],[395,40,338,8,14],[320,41,356,8,14],[245,41,352,8,14],[200,41,355,8.5,13],[148,41,386,8.5,13],[178,40,428,8.5,13],[245,38,434,8,13],[305,34,453,7.5,13],[350,28,496,7.5,13],[300,22,536,7.5,13],[225,17,532,7.5,13],[150,11,518,7,8],[95,7,545,7,8],[38,5,516,7.5,12],[-60,3,519,8.5,15],[-150,2,525,8.5,15],[-250,2,525,8.5,15],[-330,4,489,8.5,15],[-345,8,431,8,15],[-326,11,374,8,15],[-342,9,316,8,15],[-331,6,258,8,15],[-343,4,201,8,15],[-330,3,136,8.5,15],[-310,2,70,9,15],[-285,2,15,9.5,16],[-250,2,0,9.5,16],[-130,2,0,9.5,16]],Hu=[ku,Pu,Iu,Ru,Bu,{id:`coastal`,name:`Saltspray Coast`,blurb:`Sea-cliff circuit in daylight: beach straight, a 40 m climb and harbour esses.`,theme:`coastal`,seed:53,points:Vu,sections:[{name:`Breaker Straight`,a:34.2,b:Vu.length+2.6,kind:`straight`},{name:`Gull Bend`,a:2.6,b:5.8},{name:`Cliffhanger Climb`,a:5.8,b:9.8},{name:`Lantern Run`,a:9.8,b:13},{name:`Lantern Hairpin`,a:13,b:16.6},{name:`Tidewall Esses`,a:16.6,b:20.4},{name:`Kelp Chicane`,a:20.4,b:23.6},{name:`Harbour Run`,a:23.6,b:26.4,kind:`straight`},{name:`Reef Curve`,a:26.4,b:33.2},{name:`Breaker Corner`,a:33.2,b:34.2}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}}],Uu=Hu.map(e=>e.id),Wu=ku.id;function Gu(e){return Hu.find(t=>t.id===e)||ku}function Ku(e,t=!0){if(!isFinite(e)||e==null)return`--:--.---`;let n=Math.floor(e/60);return`${n}:${(e-n*60).toFixed(t?3:1).padStart(t?6:4,`0`)}`}function qu(e){return e==null||!isFinite(e)?``:(e<=0?`-`:`+`)+Math.abs(e).toFixed(3)}function Ju(e,t=3,n={}){return{L:e,n:t,seg:e/t,g:-1,prevProg:null,prevTime:0,lapStart:0,sectorStart:0,lapNo:0,cur:[],last:null,bestLap:n.bestLap??1/0,bestSectors:n.bestSectors?n.bestSectors.slice():Array(t).fill(1/0),refSectors:n.refSectors?n.refSectors.slice():[],laps:[]}}function Yu(e,t,n){let r=e.bestSectors[t],i=e.refSectors[t];return n>=r?i!==void 0&&n<i?`green`:`slow`:`purple`}function Xu(e,t,n){let r=[];if(e.prevProg===null)return e.prevProg=t,e.prevTime=n,e.g=Math.floor(t/e.seg),r;let i=Math.floor(t/e.seg);for(;e.g<i;){let i=++e.g,a=i*e.seg,o=t-e.prevProg,s=o>1e-9?(a-e.prevProg)/o:1,c=e.prevTime+Math.min(1,Math.max(0,s))*(n-e.prevTime);if(i===0){e.lapStart=e.sectorStart=c,e.cur=[],e.lapNo=0,r.push({type:`start`,time:c});continue}if(i<0)continue;let l=(i-1)%e.n,u=c-e.sectorStart;e.sectorStart=c;let d=e.refSectors[l],f=Yu(e,l,u);if(u<e.bestSectors[l]&&(e.bestSectors[l]=u),e.cur.push(u),r.push({type:`sector`,sector:l,time:u,delta:d===void 0?null:u-d,status:f,lap:Math.floor((i-1)/e.n)}),i%e.n===0){let t=c-e.lapStart,n=e.cur.slice(),i=t<e.bestLap,a=isFinite(e.bestLap)?t-e.bestLap:null;i&&(e.bestLap=t,e.refSectors=n.slice()),e.last={time:t,sectors:n,delta:a,isBest:i},e.laps.push(t),e.lapStart=c,e.cur=[],e.lapNo++,r.push({type:`lap`,lap:e.lapNo,time:t,sectors:n,delta:a,isBest:i})}}return e.prevProg=t,e.prevTime=n,r}function Zu(e,t){return e.g>=0?Math.max(0,t-e.lapStart):0}function Qu(e){return e.g>=0?e.g%e.n:0}function $u(e=10){return{hz:e,dt:1/e,next:0,samples:[]}}function ed(e,t,n,r,i){for(;t>=e.next;)e.samples.push([Math.round(n*10)/10,Math.round(r*10)/10,Math.round(i*100)/100]),e.next+=e.dt}function td(e){e.next=0,e.samples=[]}function nd(e,t){return{hz:e.hz,time:t,samples:e.samples.slice()}}function rd(e,t,n={}){if(!e||t<0)return null;let r=t*e.hz,i=Math.floor(r);if(i>=e.samples.length-1)return null;let a=e.samples[i],o=e.samples[i+1],s=r-i;n.x=a[0]+(o[0]-a[0])*s,n.z=a[1]+(o[1]-a[1])*s;let c=o[2]-a[2];for(;c>Math.PI;)c-=2*Math.PI;for(;c<-Math.PI;)c+=2*Math.PI;return n.theta=a[2]+c*s,n}var id=`drive-save-v1`,ad=`drive-ghost-v1`,od={easy:{id:`easy`,name:`Easy`,skill:.89,spread:.04,mistakes:1.6,aggression:.35,goalPos:3,assist:1,guide:!0},normal:{id:`normal`,name:`Normal`,skill:.955,spread:.035,mistakes:1,aggression:.65,goalPos:3,assist:0,guide:!0},hard:{id:`hard`,name:`Hard`,skill:.99,spread:.025,mistakes:.5,aggression:1,goalPos:2,assist:0,guide:!1}},sd={speedway:{name:`Speedway`,requires:`gp`,podium:3}};function cd(){return{v:1,unlocked:{gp:!0},bests:{},trackBests:{},podiums:0,races:0}}function ld(e){let t=cd();try{let n=e?.getItem(id);if(!n)return t;let r=JSON.parse(n);return!r||typeof r!=`object`?t:{...t,...r,unlocked:{...t.unlocked,...r.unlocked||{}},bests:{...r.bests||{}},trackBests:{...r.trackBests||{}}}}catch{return t}}function ud(e,t){try{return e?.setItem(id,JSON.stringify(t)),!0}catch{return!1}}function dd(e,t){return!sd[t]||!!e.unlocked[t]}function fd(e){let t=sd[e];return t?`${t.name.toUpperCase()} LOCKED - finish on the podium (top ${t.podium}) in a ${t.requires.toUpperCase()} race to unlock`:``}var pd=(e,t)=>e.bests[t]||null;function md(e,t,n){let r=e.bests[t]||{bestLap:1/0,bestSectors:[],refSectors:[]},i=!1;return n.time<r.bestLap&&(r.bestLap=n.time,r.refSectors=n.sectors.slice(),i=!0),n.sectors.forEach((e,t)=>{let n=r.bestSectors[t];(n==null||e<n)&&(r.bestSectors[t]=e)}),e.bests[t]=r,i}var hd=(e,t)=>e+`:`+t;function gd(e,t,n){let r=e?.trackBests?.[hd(t,n)];return!r||typeof r.bestLap!=`number`||!isFinite(r.bestLap)?null:r}function _d(e,t,n,r){let i=r?.time;if(!t||!n||typeof i!=`number`||!isFinite(i))return!1;e.trackBests&&typeof e.trackBests==`object`||(e.trackBests={});let a=hd(t,n),o=e.trackBests[a]||{bestLap:1/0};return i<o.bestLap?(o.bestLap=i,e.trackBests[a]=o,!0):(e.trackBests[a]=o,!1)}function vd(e,t){let n=pd(e,t);return!n||!isFinite(n.bestLap??NaN)?{}:{bestLap:n.bestLap,bestSectors:n.bestSectors.map(e=>e??1/0),refSectors:n.refSectors}}function yd({mode:e,difficulty:t=`normal`,cls:n=`gp`},r){if(e===`tt`){let e=pd(r,n);return e&&isFinite(e.bestLap??NaN)?{kind:`lap`,target:e.bestLap,text:`Beat your best lap: ${Ku(e.bestLap)}`}:{kind:`lap`,target:1/0,text:`Set a lap time, then beat it`}}let i=(od[t]||od.normal).goalPos;return{kind:`pos`,target:i,text:i===1?`Win the race`:`Finish top ${i}`}}function bd(e,t){if(e.kind===`pos`){let n=t.pos!=null&&t.pos<=e.target;return{met:n,text:n?`GOAL MET - P${t.pos}`:`GOAL MISSED - P${t.pos} (needed top ${e.target})`}}let n=t.bestLap;if(!isFinite(n??NaN))return{met:!1,text:`GOAL MISSED - no lap completed`};let r=n<e.target;return{met:r,text:r?`GOAL MET - ${Ku(n)}`:`GOAL MISSED - ${Ku(n)} vs ${Ku(e.target)}`}}function xd(e,{mode:t,cls:n,pos:r}){let i={unlocked:[],messages:[]};if(t!==`race`)return i;e.races=(e.races||0)+1;for(let[t,a]of Object.entries(sd))e.unlocked[t]||n===a.requires&&r!=null&&r<=a.podium&&(e.unlocked[t]=!0,i.unlocked.push(t),i.messages.push(`${a.name.toUpperCase()} CLASS UNLOCKED!`));if(n===`gp`&&r!=null&&r<=3&&(e.podiums=(e.podiums||0)+1),!i.unlocked.length)for(let[t,n]of Object.entries(sd))e.unlocked[t]||i.messages.push(fd(t));return i}function Sd(e,t){return!e||!t||!sd[t]&&t!==`gp`||e.unlocked?.[t]?!1:(e.unlocked&&typeof e.unlocked==`object`||(e.unlocked={gp:!0}),e.unlocked[t]=!0,!0)}var Cd=[{name:`Ember Works`,tag:`EMB`,c1:15222570,c2:16765514},{name:`Tidewater Speed`,tag:`TDW`,c1:1937361,c2:16777215},{name:`Quartz Engineering`,tag:`QRZ`,c1:11036912,c2:2763328},{name:`Halcyon Motorsport`,tag:`HLC`,c1:15909424,c2:2236962},{name:`Nimbus Racing`,tag:`NMB`,c1:15263984,c2:3368652},{name:`Copperhead Works`,tag:`CPR`,c1:13201966,c2:1776411},{name:`Zephyr Dynamics`,tag:`ZPH`,c1:3720330,c2:15790320},{name:`Obsidian Racing`,tag:`OBS`,c1:2763318,c2:15747724},{name:`Lumen Speed Co.`,tag:`LMN`,c1:15755936,c2:16773792},{name:`Verdant Works`,tag:`VRD`,c1:3050301,c2:12576842}];function wd(e,t){return mu(e,t).v}function Td(e,t,n){return e._lerpAt(t,n)}function Ed(e,t,n,i,a,o){let s=t.s+a;e.at(s,i,o);let c=o.x-t.x,l=o.z-t.z,u=r(Math.atan2(c,l)-t.theta),d=2*Math.sin(u)/Math.max(Math.hypot(c,l),1),f=Math.max(Math.abs(C(n,1,Math.max(t.v,3),t.grip||1)),1e-4);return-d/f}function Dd(t,n,r,i,a,o){return e(Ed(t,n,r,i,a,o),-1,1)}function Od(t,n,r,i,a){let o=t.cls,s=v(o,Math.max(t.v,10),Math.min(1,t.grip||1)),c=Td(n,r,t.s+t.v*.25),l=Td(n,r,t.s+t.v*.25+15),u=Math.max(0,(c*c-l*l)/30)*t.skill,d=Math.max(0,t.v-i);return e(Math.max(a*.6,u/s*1.1+d/9),.2,.9)}function kd(t,n,r){let i=n-t.v;i>.5?(r.throttle=e(i/3,.35,1),r.brake=0):i<-1.5?(r.throttle=0,r.brake=e(-i/8,.25,1)):(r.throttle=e(.35+i*.2,0,.5),r.brake=0)}var Ad=e=>e>=0?1:-1;function jd(e,t,n){let r=t.track.length;n.ahead=null,n.behind=null,n.aGap=99,n.bGap=99;let a=t.cars;for(let t=0;t<a.length;t++){let o=a[t];if(o===e||o.pit.stage)continue;let s=i(o.s-e.s,r);s>0&&s<n.aGap&&s<40?(n.aGap=s,n.ahead=o):s<=0&&-s<n.bGap&&-s<28&&(n.bGap=-s,n.behind=o)}return n}var Md={ahead:null,behind:null,aGap:99,bGap:99};function Nd(t,n,r,i){let a=n.track,o=t.cls,s=t.input,c=n.diff,l=t.ai,u=n.profiles[o.id];t.noiseT+=r,l.t-=r,l.defendT-=r;let d=Math.sin(t.noiseT*.35+t.noisePhase)*1.2+Math.sin(t.noiseT*.9+t.noisePhase*2)*.5,f=Math.max(Math.abs(a.lineKappaAt(t.s+4)),Math.abs(a.lineKappaAt(t.s+4+t.v*.35))),p=e(4.5+.3*t.v-1500*Math.max(0,f-.004),4.5,32),m=a.halfAt(t.s+p),h=Math.abs(a.kappaS[a._idx(t.s+p*2.5)[0]]),g=h<.003,_=!a.squeeze[t.idx],v=_?1:.25,y=1-e((f-.002)/.006,0,.7),b=a.lineAt(t.s+p),x=b+(t.lineBias+d*t.wander)*v*y;jd(t,n,Md);let{ahead:S,behind:C}=Md,w=!1,T=!1;if(S&&!S.finished&&Md.aGap<28&&Math.abs(S.d-t.d)<4.5&&t.progress>0){if(l.t<=0&&l.mode!==`pass`){l.t=.8;let e=m-2;l.side=e-S.d>e+S.d?1:-1,Math.abs(S.d-t.d)>1.2&&(l.side=Ad(t.d-S.d)),l.fight=n.rng()<.25+.75*c.aggression}l.fight&&(w=!0,Md.aGap>12||!_?g&&(x=S.d):(T=!0,l.mode=`pass`,l.passT=1.6,x=S.d+l.side*3.4))}l.mode===`pass`&&!T&&(l.passT-=r,l.passT>0&&S&&Md.aGap<18?(T=!0,x=S.d+l.side*3.4):l.mode=`free`),C&&!C.finished&&Md.bGap<14&&Math.abs(C.d-t.d)<5&&g&&!T?(l.defendT<-4&&n.rng()<.02+.06*c.aggression&&(l.defendT=1.3),l.defendT>0&&(x=t.d+e(C.d-t.d,-3,3),l.defending=!0)):l.defending=!1;let E=0;!T&&!l.defending&&S&&Md.aGap<22&&Math.abs(S.d-t.d)<2.8&&!(w&&g)&&(E=(S.d>=t.d?-1:1)*(_?3:1.2)*(1-Md.aGap/24),Math.abs(S.d-t.d)<.3&&(E=(a.lineAt(t.s)>0?-1:1)*(_?3:1.4))),t.avoid+=(E-t.avoid)*Math.min(1,r*2.5),x+=t.avoid,l.mistakeIn-=r/Math.max(.3,c.mistakes);let D=Td(a,u,t.s+70);if(l.mistake)l.mistake.t-=r,l.mistake.t<=0&&(l.mistake=null,l.mistakeIn=25+n.rng()*45);else if(l.mistakeIn<=0&&_&&t.progress>100&&!t.finished&&D<t.v-12&&!t.pit.stage){let e=n.rng();l.mistake=e<.5?{type:`late`,t:1.2}:e<.8?{type:`wide`,t:2.2}:{type:`lock`,t:.9},l.mistake.out=-Ad(a.kappaS[a._idx(t.s+40)[0]])}let O=Math.min(Td(a,u,t.s+35),Td(a,u,t.s+80))*t.skill,k=Math.max(e((t.v-O-3)/14,0,1),e((f-.003)/.004,0,1));x=b+(x-b)*(1-.85*k),l.mistake?.type===`wide`&&(x+=l.mistake.out*2);let A=Math.max(m-(_?2:2.4)-.012*t.v,1.2);x=e(x,-A,A);let j=Ed(a,t,o,x,p,i);s.steer=e(j,-1,1);let M=e((Math.abs(j)-.85)/.6,0,1),N=Math.min(1,Math.sqrt(Math.max(.25,t.grip||1))),ee=t.skill,P=Td(a,u,t.s+t.v*.25)*ee*N;P*=1-.12*M,P*=1-.4*e((Math.abs(t.d-a.lineAt(t.s))-1.5)/6,0,1)*e((f-.002)/.004,0,1),(t.surface===`grass`||t.surface===`gravel`)&&(P=Math.min(P,28)),T&&Md.aGap<14&&(P*=1.04),l.mistake?.type===`late`&&(P*=1.1),S&&!T&&Md.aGap<14&&Math.abs(S.d-t.d)<2.4&&(P=Math.min(P,Math.max(S.v+e((Md.aGap-6)*.8,-1.5,8),P*.6)));let F=n.order?.[0],I=n.order?.[1];F&&t.progress>0&&!t.finished&&(t===F?I&&(P*=1-.02*e((t.progress-I.progress-60)/150,0,1)):P*=1+.04*e((F.progress-t.progress-40)/180,0,1)),S&&Md.aGap<25&&g&&!T&&(P*=1+.012*(1-Md.aGap/25)*(.5+.5*c.aggression)),t.finished&&(P=Math.min(P,38)),kd(t,P,s),s.brake>0&&(s.brake=Od(t,a,u,P,s.brake)),l.forceLock=l.mistake?.type===`lock`&&t.v>35&&s.brake>0,l.forceLock&&(s.brake=1);let te=S&&Md.aGap<25&&g;s.boost=t.boost>(te?.15:.55)&&h<.0025&&t.v>40&&!t.finished}var Pd=new K,Fd=9.81,Id={k:0,excess:0},Ld={tire:`dry`,wear:0,wetness:0,surface:`asphalt`},Rd={fill:0,boosting:!1,dt:0};function zd(e,t){if(t.pit.stage)return!1;let n=e,r=i(t.s,n.length),a=n.pit;return r>a.entry-40&&r<a.laneStart+20?t.pit.request?!0:!t.isPlayer||!(t.progress>0)?!1:Bd(n,t,r):!1}function Bd(e,t,n=i(t.s,e.length)){let a=e.pit;if(n<a.entry||n>a.laneStart+8)return!1;let o=t.idx,s=e.laneD(o);return!(t.d<s-.8||e.surfaceAt(o,t.d)!==`pit`||Math.abs(r(t.theta-e.thetaAt(t.s)))>.6)}var Vd=class{constructor(t,n={}){if(this.track=t,this.opts=n,this.rng=typeof n.rng==`function`?n.rng:Math.random,this.cls=a[n.cls]||a.gp,this.mode=n.mode===`tt`?`tt`:`race`,this.solo=this.mode===`tt`,this.diff=od[n.difficulty]||od.normal,this.laps=this.solo?1/0:e(n.laps||3,1,9),this.phase=`countdown`,this.timer=this.solo?1.6:0,this.time=0,this.goHold=this.solo?0:.2+this.rng()*1,this.lights=0,this.goFlash=0,this.rain=0,this.rainTarget=0,this.wetness=0,this.rainAt=n.weather===`rain`?.5:n.weather===`dry`||this.solo?1/0:n.rainAt??(this.rng()<.8?this.laps*42*(.3+this.rng()*.3):1/0),this.rainAnnounced=!1,this.events=[],this.profiles={[this.cls.id]:wd(t,this.cls)},this.cars=[],this.playerSlot=n.playerSlot??(this.solo?0:6),Array.isArray(n.grid)){let e=n.grid.findIndex(e=>e.isPlayer);e>=0&&(this.playerSlot=e)}this._createCars(),this.player=this.cars.find(e=>e.isPlayer),this.autopilot=!1,this.lapTimer=Ju(t.length,3,n.best||{}),this.ghostRec=$u(10),this.order=this.cars.slice(),this.rank()}_blankCar(e,t,n,r,i,a={}){let s=this.track,c=s.length,l=this.rng,u=Math.floor(e/2),d=e%2,f=c-10-u*9-d*4.5,p=d?-3.2:3.2,m=s.at(f,p),h=s.thetaAt(f),g={id:e,slot:e,team:t,teamIndex:n,isPlayer:r,cls:a.cls||this.cls,driver:a.driver||null,driverId:a.driverId||null,x:m.x,z:m.z,y:m.y,theta:h,v:0,steer:0,s:f,d:0,idx:s.locateGlobal(m.x,m.z).i,lap:o(c,f),progress:-10,laps:0,finished:!1,finishTime:0,tire:`dry`,wear:0,wetness:0,grip:1,surface:`asphalt`,boost:0,boosting:!1,slip:0,input:{steer:0,throttle:0,brake:0,boost:!1},skill:i,lineBias:(l()-.5)*3.2,wander:.4+l()*.8,noiseT:l()*50,noisePhase:l()*6.28,avoid:0,lapStart:0,lapTimes:[],bestLap:1/0,hit:0,pitStops:0,brk:0,lockup:0,flat:0,wheelSlip:0,wheelspin:0,longAcc:0,latAcc:0,signedLatAcc:0,yawRate:0,slipAngle:0,prevSlipAngle:0,slideRate:0,latFrac:0,ai:{forceLock:!1,mode:`free`,side:0,t:0,mistake:null,mistakeIn:8+l()*30,defendT:0},pit:{stage:0,request:!1,timer:0,choice:null,d0:0},mesh:null};return g.d=s.locateGlobal(m.x,m.z).d,g.lap=o(c,f),g.progress=g.lap.progress,this.cars.push(g),g}_createCars(){if(Array.isArray(this.opts.grid)){this.opts.grid.forEach((e,t)=>{if(this.solo&&!e.isPlayer)return;let n=e.isPlayer?.985:e.skill==null?this.diff.skill:e.skill;this._blankCar(t,e.team,e.teamIndex,!!e.isPlayer,n,{cls:e.cls,driver:e.driver||null,driverId:e.id||null})});return}let e=Cd.map((e,t)=>t),t=this.rng;for(let n=e.length-1;n>1;n--){let r=1+Math.floor(t()*n);[e[n],e[r]]=[e[r],e[n]]}let n=e.slice(1);n.splice(this.playerSlot,0,0);let r=this.opts.playerTeam;n.forEach((e,n)=>{if(this.solo&&n!==this.playerSlot)return;let i=n===this.playerSlot,a=this.diff.skill+(t()-.5)*2*this.diff.spread,o=e===0&&r?r:Cd[e];this._blankCar(n,o,e,i,i?.985:a,{driver:i&&this.opts.driver||null,driverId:i?`player`:null})})}setRain(e){this.rainTarget=+!!e,this.rainAt=1/0,e&&(this.rain=1,this.wetness=Math.max(this.wetness,.7),this.rainAnnounced=!0)}requestPit(e=this.player,t=!0){e.pit.stage===0&&e.progress<(this.laps-.9)*this.track.length&&(e.pit.request=t)}choosePitTire(e,t=this.player){t.pit.choice=e}step(e){if(this.phase===`countdown`){this.timer+=e,this.lights=Math.min(5,Math.floor(this.timer)+1),this.timer>=4+this.goHold?(this.phase=`racing`,this.lights=0,this.goFlash=1.6,this.events.push({type:`go`})):Math.floor(this.timer)!==Math.floor(this.timer-e)&&this.timer<5&&this.events.push({type:`light`,n:this.lights}),this._interpolatePoseOnly(),this._weather(e);return}this.time+=e,this.goFlash=Math.max(0,this.goFlash-e),this._weather(e);let t=this.cars;for(let n=0;n<t.length;n++){let r=t[n];r.pit.stage?this._pitControl(r,e):(!r.isPlayer||this.autopilot||r.finished)&&(Nd(r,this,e,Pd),this._aiPitDecision(r)),this._stepCar(r,e)}this._interactions(e),this.rank(),this._timing(),this.player.finished&&this.phase!==`done`&&this.cars.every(e=>e.finished)&&(this.phase=`done`)}_interpolatePoseOnly(){}_timing(){let e=this.player,t=this.lapTimer;for(let n of Xu(t,e.progress,this.time)){let t={...n,type:n.type===`lap`?`laptime`:n.type===`sector`?`sector`:`startline`,car:e};n.type===`lap`?(e.lapTimes.length&&(e.lapTimes[e.lapTimes.length-1]=n.time,e.bestLap=Math.min(...e.lapTimes)),n.isBest&&(t.ghost=nd(this.ghostRec,n.time)),td(this.ghostRec)):n.type===`start`&&td(this.ghostRec),this.events.push(t)}t.g>=0&&ed(this.ghostRec,Zu(t,this.time),e.x,e.z,e.theta)}_weather(t){this.time>=this.rainAt&&(this.rainTarget=1,this.rainAt=1/0),this.rainTarget>0&&!this.rainAnnounced&&this.rain>.05&&(this.rainAnnounced=!0,this.events.push({type:`rain`})),this.rain+=e(this.rainTarget-this.rain,-.1*t,.12*t);let n=this.rain>this.wetness;this.wetness+=e(this.rain-this.wetness,-.012*t,(n?.07:.012)*t)}_aiPitDecision(e){if(e.isPlayer||e.pit.stage||e.pit.request||e.finished||e.progress>(this.laps-1)*this.track.length||e.progress<0)return;this.rain>.4&&this.rainHighTime===void 0&&(this.rainHighTime=this.time);let t=e.id*7%10*3,n=this.rainHighTime!==void 0&&e.tire===`dry`&&this.time-this.rainHighTime>t,r=this.rain<.05&&this.wetness<.12&&e.tire===`wet`;(n||r||e.wear>.8)&&(e.pit.request=!0,e.pit.aiChoice=this.rain>.3||this.wetness>.3?`wet`:`dry`)}_pitControl(e,r){let a=this.track,o=e.pit,s=e.input;e.ai.forceLock=!1;let c=i(e.s,a.length),l=e.idx,u=a.laneD(l),d=a.boxD(l),f=a.boxU(e.teamIndex),p=f-c,m=30,h=u;if(o.stage===1){let r=n(a.pit.entry,a.pit.laneStart,c);h=t(o.d0,u,r),m=c<a.pit.laneStart?Math.sqrt(a.pit.limit**2+56*Math.max(0,a.pit.laneStart-c)):a.pit.limit,p<30&&(h=t(u,d,n(30,10,p)),m=Math.min(m,Math.sqrt(10*Math.max(0,p-.6)))),p<3&&e.v<2.5?(o.stage=2,o.timer=0,e.isPlayer||(o.choice=o.aiChoice||`dry`)):c>f+8&&e.v>4&&(o.stage=3)}else o.stage===2?(m=0,h=d,o.timer+=r,e.isPlayer&&!o.choice&&o.timer>7&&(o.choice=this.wetness>.25?`wet`:`dry`),o.choice&&(o.serv=(o.serv||0)+r,o.serv>2.4&&(e.tire=o.choice,e.wear=0,o.stage=3,o.serv=0,o.choice=null,o.request=!1,e.pitStops++,this.events.push({type:`pit`,car:e})))):o.stage===3&&(h=t(d,u,n(f,f+14,c)),h=t(h,Hd(a,e),n(a.pit.laneEnd,a.pit.exit,c)),m=c<a.pit.laneEnd?a.pit.limit:30+(c-a.pit.laneEnd)*2,c>a.pit.exit&&(o.stage=0,o.request=!1));return s.steer=Dd(a,e,e.cls,h,6+e.v*.25,Pd),kd(e,m,s),o.stage===1&&p<30&&m<3&&(s.throttle=0,s.brake=e.v>m+.5?.8:.15),o.stage===2&&(s.throttle=0,s.brake=1),s.boost=!1,!0}_stepCar(t,n){let i=this.track,a=t.cls,o=t.input;zd(i,t)&&(t.pit.stage=1,t.pit.d0=t.d,t.pit.request=!0,t.pit.serv=0),t.surface=i.surfaceAt(t.idx,t.d),Ld.tire=t.tire,Ld.wear=t.wear,Ld.wetness=this.wetness,Ld.surface=t.surface,t.grip=d(Ld);let l=t.isPlayer&&!this.autopilot&&!t.pit.stage,u=e(t.v/a.vTop,0,1),p=o.steer;t.steer=l?de(t.steer,p,u,n):t.steer+e(p-t.steer,-n*9,n*9),t.brk+=e(o.brake-t.brk,-10*n,(l?7:14)*n);let m=c[t.surface],h=!1;o.boost&&t.boost>.01&&(h=!0),t.boosting=h;let g=a.vTop*(h?1.07:1)*(1+.025*Math.min(1,t.slip/.3)),y=Math.max(Math.abs(t.v),2.5);t.grip*=1-.07*t.flat;let S=t.brk,w=x(a,t.steer,y,t.grip,0,Id),T=Math.min(1,w.frac);if(t.v>.4&&S>0&&(l?this.diff.assist:!t.ai.forceLock)){let e=b(a,y,t.grip,S,T);e>.9&&(S*=.9/e)}let E=t.v>.4?b(a,y,t.grip,S,T):0,D=E>1&&t.v>22?e(.45+(E-1)*3,0,1):0;t.lockup+=e(D-t.lockup,-3*n,9*n),t.lockup<.001&&(t.lockup=0),t.flat=e(t.flat+(t.lockup*.16-.018)*n,0,1);let O=t.v>.4?v(a,y,t.grip)*S*(1-.22*t.lockup):0,k=Math.max(_(a,y,t.grip),1),A=Math.min(1,(O+.5*a.accel*o.throttle*Math.max(0,1-y/g))/k),j=x(a,t.steer,y,t.grip*(1-.4*t.lockup),Math.min(1,A),Id);t.latFrac=j.frac;let M=a.accel*o.throttle*Math.max(0,1-(t.v/g)**2);h&&(M+=12*Math.max(0,1-t.v/g));let N=Fd*1.5*(.35+.65*t.grip)+(h?8:0);t.wheelspin=M>N?Math.min(1,(M-N)/N):0,M=Math.min(M,N),M*=1-(this.diff.assist?.15:.3)*Math.min(1,j.excess),t.pit.stage&&t.v>i.pit.limit&&o.throttle>0&&(M=Math.min(M,0)),M-=m.drag*t.v+45e-5*t.v*t.v+.4,o.throttle<.05&&t.v>5&&(M-=1.1*(1-o.throttle/.05)),M-=Fd*i.slopeAt(t.s)*.7,M-=Math.min(1,j.excess)*2.2*Math.min(1,t.v/30),O>0?M-=O:o.brake>0&&t.v<=.4&&!t.pit.stage&&(M-=8*t.brk),t.longAcc=M,t.wheelSlip=Math.max(t.lockup,t.wheelspin*.8,Math.min(1,j.excess)*.6),t.v+=M*n,t.v<0&&!(o.brake>0&&!t.pit.stage)&&(t.v=0),t.v=Math.max(t.v,-9);let ee=Math.abs(t.v)<2.5&&o.throttle>0?Math.sign(t.v||1)*2.5:t.v,P=fe(t,R(C(a,t.steer,Math.abs(ee),t.grip*(1-.4*t.lockup),Math.min(1,A)),ee,o.throttle*Math.max(0,1-t.brk),Math.min(1,j.frac),l),n,t.grip*(1-.25*t.lockup),l);t.theta+=P*n,t.yawRate=P,t.signedLatAcc=-P*t.v,t.latAcc=Math.abs(t.signedLatAcc),t.slipAngle=e(t.slipAngle,-.022,.022);let F=t.theta+(l?t.slipAngle:0);t.x+=Math.sin(F)*t.v*n,t.z+=Math.cos(F)*t.v*n,this.phase===`racing`&&(t.wear=Math.min(1,t.wear+f(t.tire,t.latAcc,this.wetness,a.wear)*n));let I=i.locate(t.x,t.z,t.idx,void 0,30);t.idx=I.i,t.d=I.d,t.s=I.s,s(t.lap,t.s)&&this._lapDone(t),t.progress=t.lap.progress,!t.started&&t.progress>=0&&(t.started=!0,t.lapStart=this.time),t.pose=_e(i,t.s,t.pose),t.y=t.pose.y;let te=t.idx,ne=i.leftWall[te]-1,re=i.rightWall[te]-1,ie=0;if(t.d>ne?ie=t.d-ne:t.d<-re&&(ie=t.d+re),ie){t.x-=i.nx[te]*ie,t.z-=i.nz[te]*ie,t.d-=ie;let a=i.theta[te],o=r(a-t.theta),s=Math.abs(Math.sin(o));t.theta+=e(o,-.5,.5)*Math.min(1,24*n),t.hit<=0?(t.v*=1-e(.12+.6*s,0,.6),t.hit=.4,this.events.push({type:`hit`,car:t,power:s})):t.v*=1-(4+18*s)*n,t.scrape=.15}t.hit=Math.max(0,t.hit-n),t.scrape=Math.max(0,(t.scrape||0)-n)}_lapDone(e){let t=e.lap.maxLaps,n=this.time;if(t>=1){let t=n-e.lapStart;e.lapStart=n,e.lapTimes.push(t),t<e.bestLap&&(e.bestLap=t)}e.laps=t,t>=this.laps&&!e.finished?(e.finished=!0,e.finishTime=n,e.pit.request=!1,this.events.push({type:`finish`,car:e})):(this.events.push({type:`lap`,car:e,lap:t}),this.solo||t!==this.laps-1||this.finalLapShown||this.cars.some(e=>e.laps>=this.laps)||(this.finalLapShown=!0,this.events.push({type:`finallap`,car:e})))}_interactions(t){let n=this.track,r=n.length,a=this.cars;for(let e=0;e<a.length;e++){let n=a[e];n.slipNow=0,n.cHit=Math.max(0,(n.cHit||0)-t)}for(let t=0;t<a.length;t++)for(let o=t+1;o<a.length;o++){let s=a[t],c=a[o],l=i(c.s-s.s,r),u=c.d-s.d;if(Math.abs(l)>36||Math.abs(u)>6)continue;let d=l>0?s:c,f=l>0?c:s,p=Math.abs(l)-4.6;if(d.finished||(d.slipNow=Math.max(d.slipNow,w(p,Math.abs(u)))),!(s.pit.stage||c.pit.stage)&&Math.abs(l)<4.6&&Math.abs(u)<2.1){let t=(2.1-Math.abs(u))*.5,r=u>=0?1:-1;if(c.x+=n.nx[c.idx]*t*r,c.z+=n.nz[c.idx]*t*r,s.x-=n.nx[s.idx]*t*r,s.z-=n.nz[s.idx]*t*r,(s.isPlayer||c.isPlayer)&&!((s.cHit||0)>0&&(c.cHit||0)>0)){let t=e(Math.abs(d.v-f.v)/25+(2.1-Math.abs(u))*.25,.05,1);s.cHit=c.cHit=.5,this.events.push({type:`hit`,car:s.isPlayer?s:c,power:t,kind:`car`})}Math.abs(l)>2.2&&(d.v=Math.min(d.v,f.v+1),f.v+=.08)}}for(let e=0;e<a.length;e++){let n=a[e];n.slip=n.slipNow,Rd.fill=n.slipNow,Rd.boosting=n.boosting,Rd.dt=t,n.boost=T(n.boost,Rd)}}gaps(e=this.player){let t=this.order.indexOf(e),n=this.track.length,r=t=>!t||t.progress<0||e.progress<0?null:Math.abs(t.progress-e.progress)/Math.max(30,e.v,t.v*.8);return{ahead:t>0&&!this.order[t-1].finished?r(this.order[t-1]):null,behind:t<this.order.length-1&&!this.order[t+1].finished?r(this.order[t+1]):null,L:n}}rank(){this.order=this.cars.slice().sort((e,t)=>e.finished&&t.finished?e.finishTime-t.finishTime:e.finished?-1:t.finished?1:t.progress-e.progress);let e=this.player?.pos;this.order.forEach((e,t)=>e.pos=t+1),this.player&&e&&e!==this.player.pos&&this.phase===`racing`&&this.player.progress>0&&!this.player.finished&&this.events.push({type:`poschange`,from:e,to:this.player.pos})}simulateToEnd(e=150){let t=0;for(;!this.cars.every(e=>e.finished)&&t<e;)this.step(1/30),t+=1/30;this.events.length=0}results(){let e=this.order[0];return this.order.map(t=>({pos:t.pos,name:t.driver?.name||t.team.name,tag:t.team.tag,team:t.team,isPlayer:t.isPlayer,id:t.driverId||null,finished:t.finished,time:t.finishTime,gap:t.finished?t.finishTime-e.finishTime:null,best:t.bestLap,stops:t.pitStops}))}};function Hd(e,t){return e.lineAt(t.s)*.9}function Ud(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new mi;c.morphTargetsRelative=s;let l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0,p=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let t in d.morphAttributes){if(!i.has(t))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;if(d.morphAttributes[t].length!==e[0].morphAttributes[t].length)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have the same number of morph targets for the "`+t+`" morph attribute.`),null;o[t]===void 0&&(o[t]=[]),o[t].push(d.morphAttributes[t]),p++}if(p!==i.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of morph attributes.`),null;if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=Wd(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=Wd(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function Wd(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new $r(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var Gd=[`nigger`,`nigga`,`niggar`,`niggur`,`niggr`,`faggot`,`faggit`,`faggott`,`kike`,`kyke`,`chink`,`gook`,`tranny`,`troon`,`retard`,`retarded`,`molest`,`pedophile`,`paedophile`,`pedophile`,`childfucker`,`hitler`,`heilhitler`],Kd=`fuck.fucker.fucking.fucked.motherfucker.motherfuck.mfucker.fck.fuk.fcuk.fuc.fux.phuck.shit.shitty.bullshit.shithead.sht.shiit.cunt.cunts.rape.rapist.raping.asshole.assholes.asshat.asswipe.ashole.aashole.bitch.bitches.bitchy.bastard.bastards.damn.damned.goddamn.goddamnit.piss.pissed.pissoff.dick.dicks.dickhead.dickface.cock.cocks.cockhead.cocksucker.pussy.pussies.whore.whores.slut.sluts.slutty.wank.wanker.wanking.twat.twats.bollocks.bugger.arsehole.tit.tits.titty.porn.porno.xxx.sex.sexy.sexual.anal.anus.fag.fags.dyke.dykes.spic.spick.homo.queer.nazi.nazis.kkk.cum.cumshot.jizz.penis.vagina.boob.boobs.boobies.hoe.hoes.stfu.gtfo.lmfao`.split(`.`),qd=`class.classic.classify.classroom.assassin.assassins.assassination.scunthorpe.grape.grapes.grapefruit.therapist.therapy.dickson.dickinson.hancock.cockburn.penistone.shitake.shiitake.pass.passion.compass.bass.glass.grass.cassette.assume.assumption.cocker.cockpit.cocktail.hitchcock.weathercock.subaru.suzuki.spicy.spice`.split(`.`),Jd={0:`o`,1:`i`,3:`e`,4:`a`,5:`s`,7:`t`,"@":`a`,$:`s`,"|":`l`,"+":`t`},Yd=Gd.map(ef),Xd=new Set(Kd.map(ef)),Zd=new Set(qd.map(ef));function Qd(e){let t=``;for(let n of e)t+=Jd[n]||n;return t}function $d(e,{collapse:t=!1}={}){if(e==null)return``;let n=String(e).toLowerCase().normalize(`NFKD`).replace(/\p{M}/gu,``);return n=n.replace(/^[^a-z0-9@$]+|[^a-z0-9@$]+$/g,``),n=Qd(n),n=n.replace(/[^a-z]/g,``),t&&(n=n.replace(/(.)\1+/g,`$1`)),n}function ef(e){return $d(e,{collapse:!0})}function tf(e){return String(e||``).toLowerCase().normalize(`NFKD`).replace(/\p{M}/gu,``).split(/[^a-z0-9@$!|+]+/i).filter(Boolean).map(e=>$d(e,{collapse:!1})).filter(Boolean)}function nf(e){if(e==null)return!1;let t=String(e);if(!t.trim())return!1;let n=$d(t,{collapse:!1}),r=$d(t,{collapse:!0});if(!n&&!r||Zd.has(n)||Zd.has(r))return!1;for(let e of Yd)if(e&&(n.includes(e)||r.includes(e)))return!0;if(Xd.has(n)||Xd.has(r))return!0;for(let e of tf(t)){let t=e.replace(/(.)\1+/g,`$1`);if(!(Zd.has(e)||Zd.has(t))){if(Xd.has(e)||Xd.has(t))return!0;for(let n of Yd)if(n.length>=4&&(e.includes(n)||t.includes(n)))return!0}}return!1}var rf=`That name isn't allowed`,af=[{id:`stripes`,name:`STRIPES`,style:`stripe`},{id:`chevrons`,name:`CHEVRONS`,style:`chevron`},{id:`split`,name:`SPLIT`,style:`twotone`},{id:`fade`,name:`FADE`,style:`fade`},{id:`flash`,name:`FLASH`,style:`flash`},{id:`hoops`,name:`HOOPS`,style:`hoop`},{id:`checker`,name:`CHECKER`,style:`checker`}],of=af.map(e=>e.id),sf=e=>(af.find(t=>t.id===e)||af[0]).style,cf=[15222570,16747039,15909424,12576842,3720330,2078422,1937361,3364300,11036912,15755936,15921908,2763318];function lf(e,t){return typeof e!=`string`&&(e=e==null?``:String(e)),e=e.normalize(`NFC`).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g,``),e=e.replace(/<[^>]*>/g,``).replace(/[^\p{L}\p{N} \-._!#+]/gu,``),e=e.replace(/\s+/g,` `).trim(),[...e].slice(0,t).join(``).trim()}function uf(e,t=3,n=18){let r=lf(e,n);return[...r].length<t?`short`:nf(r)?`blocked`:null}function df(e,t=3,n=18){return uf(e,t,n)?null:lf(e,n)}function ff(e,t=``){let n=lf(e,8).toUpperCase().replace(/[^A-Z0-9]/g,``).slice(0,3);if(n.length>=2&&!nf(n))return n;let r=pf(t);return nf(r)?`TM`:r}function pf(e){let t=lf(e,18).toUpperCase().normalize(`NFD`).replace(/[^A-Z0-9 ]/g,``).split(` `).filter(Boolean),n=t.length>=2?t.slice(0,3).map(e=>e[0]).join(``):``;if(n.length<3){let e=(t[0]||``).replace(/ /g,``),r=e.slice(1).replace(/[AEIOU]/g,``),i=e.slice(1).replace(/[^AEIOU]/g,``);n=t.length>=2?n+r+i+`XXX`:e.slice(0,1)+r+i+`XXX`}return n.slice(0,3)}function mf(e,t=15222570){return typeof e==`number`&&Number.isInteger(e)&&e>=0&&e<=16777215?e:typeof e==`string`&&/^#?[0-9a-f]{6}$/i.test(e.trim())?parseInt(e.trim().replace(`#`,``),16):t}function hf(e,t=1){let n=typeof e==`string`?parseInt(e,10):e;return Number.isInteger(n)&&n>=1&&n<=99?n:t}var gf=e=>`#`+(e>>>0).toString(16).padStart(6,`0`).slice(-6);function _f(){return{pattern:`chevrons`,c1:15222570,c2:16765514,c3:1381658,number:1}}function vf(e){let t=_f(),n=e&&typeof e==`object`?e:{};return{pattern:of.includes(n.pattern)?n.pattern:t.pattern,c1:mf(n.c1,t.c1),c2:mf(n.c2,t.c2),c3:mf(n.c3,t.c3),number:hf(n.number,t.number)}}function yf(e,t=`Privateer Racing`){let n=e&&typeof e==`object`?e:{},r=df(n.name)||t;return{name:r,tag:ff(n.tag,r),livery:vf(n.livery)}}function bf(e){let t=yf(e),n=t.livery;return{name:t.name,tag:t.tag,c1:n.c1,c2:n.c2,custom:!0,livery:{pattern:n.pattern,c3:n.c3,number:n.number}}}var xf=`Casey Morrow`;function Sf(e){let t=e&&typeof e==`object`?e:{},n=t.team&&typeof t.team==`object`?t.team:null,r={...n?.livery||{},...t.livery||{}},i=hf(t.number??r.number??(t.driver&&typeof t.driver==`object`?t.driver.number:void 0),_f().number),a=yf({name:t.name??n?.name,tag:t.tag??n?.tag,livery:{pattern:t.pattern??r.pattern,c1:t.c1??r.c1,c2:t.c2??r.c2,c3:t.c3??r.c3,number:i}});return{driver:df(typeof t.driver==`string`?t.driver:t.driver?.name??t.driverName??``)||xf,name:a.name,tag:a.tag,pattern:a.livery.pattern,c1:a.livery.c1,c2:a.livery.c2,c3:a.livery.c3,number:a.livery.number}}function Cf(e,t={}){let n=Sf(e),r=t&&typeof t==`object`?t:{};return Sf({driver:r.driver===void 0?n.driver:df(r.driver)||n.driver,name:r.name===void 0?n.name:df(r.name)||n.name,tag:r.tag===void 0?r.name!==void 0&&df(r.name)?``:n.tag:r.tag,pattern:r.pattern===void 0?n.pattern:of.includes(r.pattern)?r.pattern:n.pattern,c1:r.c1===void 0?n.c1:mf(r.c1,n.c1),c2:r.c2===void 0?n.c2:mf(r.c2,n.c2),c3:r.c3===void 0?n.c3:mf(r.c3,n.c3),number:r.number===void 0?n.number:hf(r.number,n.number)})}function wf(e){let t=Sf(e);return bf({name:t.name,tag:t.tag,livery:{pattern:t.pattern,c1:t.c1,c2:t.c2,c3:t.c3,number:t.number}})}var Tf=[1,7,12,21,28,35,42,56,63,88],Ef=e=>Tf[(e%Tf.length+Tf.length)%Tf.length],Df=[`stripe`,`twotone`,`chevron`,`flash`,`hoop`],Of=e=>e===0?`chevron`:Df[(e%Df.length+Df.length)%Df.length],kf=(e,t)=>e?.livery?.pattern?sf(e.livery.pattern):Of(t),Af=(e,t)=>e?.livery?.number??Ef(t),jf={0:`111101101101111`,1:`010110010010111`,2:`111001111100111`,3:`111001111001111`,4:`101101111001001`,5:`111100111001111`,6:`111100111101111`,7:`111001001010010`,8:`111101111101111`,9:`111101111001111`},Mf=new q,Nf=e=>(Mf.set(e),[Mf.r,Mf.g,Mf.b]),Pf=(e,t,n)=>[e[0]+(t[0]-e[0])*n,e[1]+(t[1]-e[1])*n,e[2]+(t[2]-e[2])*n],Ff=(e,t)=>[Math.min(1,e[0]*t),Math.min(1,e[1]*t),Math.min(1,e[2]*t)],If=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],Lf=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Rf=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],zf=(e,t,n)=>e<t?t:e>n?n:e,Bf=e=>{let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]},Vf=class{constructor(){this.pos=[],this.col=[]}tri(e,t,n,r,i){let a=Lf(If(t,e),If(n,e));if(i&&Rf(a,If(e,i))<0){let e=t;t=n,n=e}let o=Bf(Lf(If(t,e),If(n,e))),s=1+.16*Math.max(0,o[1])-.22*Math.max(0,-o[1])+.07*Math.max(0,o[2]),c=Math.sin((e[0]*12.9898+e[1]*78.233+e[2]*37.719)*43758.5453)*.5+.5;s*=.97+.06*(c-Math.floor(c));let l=o[1]>.6?.06:0,u=[Math.min(1,r[0]*s+l*.5),Math.min(1,r[1]*s+l*.6),Math.min(1,r[2]*s+l)];for(let r of[e,t,n])this.pos.push(r[0],r[1],r[2]),this.col.push(u[0],u[1],u[2])}quad(e,t,n,r,i,a){this.tri(e,t,n,i,a),this.tri(e,n,r,i,a)}flatQuad(e,t,n,r,i,a=[0,1,0]){for(let o of[[e,t,n],[e,n,r]]){let[e,t,n]=Rf(Lf(If(o[1],o[0]),If(o[2],o[0])),a)<0?[o[0],o[2],o[1]]:o;for(let r of[e,t,n])this.pos.push(r[0],r[1],r[2]),this.col.push(i[0],i[1],i[2])}}box(e,t,n,r,i,a,o,s=0,c=null){let l=Math.sin(s),u=Math.cos(s),d=[];for(let[o,s,c]of[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]){let f=s*i/2,p=c*a/2;d.push([e+o*r/2,t+f*u-p*l,n+f*l+p*u])}let f=[e,t,n],p=c||o;this.quad(d[0],d[1],d[2],d[3],o,f),this.quad(d[4],d[5],d[6],d[7],o,f),this.quad(d[0],d[4],d[7],d[3],o,f),this.quad(d[1],d[5],d[6],d[2],o,f),this.quad(d[3],d[2],d[6],d[7],p,f),this.quad(d[0],d[1],d[5],d[4],Ff(o,.7),f)}beam(e,t,n,r){let i=Bf(If(t,e)),a=Bf(Lf(i,Math.abs(i[1])>.9?[1,0,0]:[0,1,0])),o=Bf(Lf(i,a)),s=n/2,c=[];for(let n of[e,t])for(let[e,t]of[[-1,-1],[1,-1],[1,1],[-1,1]])c.push([n[0]+a[0]*e*s+o[0]*t*s,n[1]+a[1]*e*s+o[1]*t*s,n[2]+a[2]*e*s+o[2]*t*s]);let l=[(e[0]+t[0])/2,(e[1]+t[1])/2,(e[2]+t[2])/2];for(let e=0;e<4;e++){let t=(e+1)%4;this.quad(c[e],c[t],c[4+t],c[4+e],r,l)}this.quad(c[0],c[1],c[2],c[3],r,l),this.quad(c[4],c[5],c[6],c[7],r,l)}plate(e,t,n,r,i=null){let a=e.length,o=e.reduce((e,t)=>e+t[0],0)/a,s=e.reduce((e,t)=>e+t[1],0)/a,c=[(t+n)/2,s,o];for(let i=1;i<a-1;i++)this.tri([t,e[0][1],e[0][0]],[t,e[i][1],e[i][0]],[t,e[i+1][1],e[i+1][0]],r,c),this.tri([n,e[0][1],e[0][0]],[n,e[i][1],e[i][0]],[n,e[i+1][1],e[i+1][0]],r,c);for(let o=0;o<a;o++){let s=(o+1)%a;this.quad([t,e[o][1],e[o][0]],[n,e[o][1],e[o][0]],[n,e[s][1],e[s][0]],[t,e[s][1],e[s][0]],i&&o===0?i:r,c)}}loft(e,t,n=null){for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1],a=r.ring.length,o=0,s=0;for(let e=0;e<a;e++)o+=r.ring[e][0]+i.ring[e][0],s+=r.ring[e][1]+i.ring[e][1];let c=[o/(2*a),s/(2*a),(r.z+i.z)/2];for(let e=0;e<a;e++){let n=(e+1)%a,o=r.seg&&r.seg[e]||t;this.quad([r.ring[e][0],r.ring[e][1],r.z],[r.ring[n][0],r.ring[n][1],r.z],[i.ring[n][0],i.ring[n][1],i.z],[i.ring[e][0],i.ring[e][1],i.z],o,c)}}let r=(e,t,n)=>{let r=e.ring.length,i=0,a=0;for(let t of e.ring)i+=t[0],a+=t[1];let o=[i/r,a/r,e.z],s=[o[0],o[1],e.z+(n?1:-1)];for(let n=0;n<r;n++){let i=(n+1)%r;this.tri(o,[e.ring[n][0],e.ring[n][1],e.z],[e.ring[i][0],e.ring[i][1],e.z],t,s)}};r(e[0],n||t,!1),r(e[e.length-1],t,!0)}mirrored(e){let t=this.pos.length;e(1);let n=this.pos.length;for(let e=t;e<n;e+=9){let t=[0,1,2].map(t=>[-this.pos[e+t*3],this.pos[e+t*3+1],this.pos[e+t*3+2]]),n=this.col.slice(e,e+9);this.pos.push(t[0][0],t[0][1],t[0][2],t[2][0],t[2][1],t[2][2],t[1][0],t[1][1],t[1][2]),this.col.push(n[0],n[1],n[2],n[6],n[7],n[8],n[3],n[4],n[5])}}geometry(){let e=new mi;return e.setAttribute(`position`,new ni(this.pos,3)),e.setAttribute(`color`,new ni(this.col,3)),e.computeVertexNormals(),e}},Hf=Nf(1381658),Uf=Nf(2369070);Nf(9278366);var Wf=Nf(15921908),Gf=Nf(1848656),Kf=Nf(5211832),qf={gp:.38,speedway:.42},Jf={gp:.5,speedway:.55},Yf=Math.PI*2/5,Xf={gp:[[.95,1.9],[-.95,1.9],[1.05,-1.65],[-1.05,-1.65]],speedway:[[1,1.7],[-1,1.7],[1.1,-1.5],[-1.1,-1.5]]};function Zf(e,t){if(t>=e[0].z)return e[0].yTop;for(let n=0;n<e.length-1;n++)if(t<=e[n].z&&t>=e[n+1].z){let r=(e[n].z-t)/(e[n].z-e[n+1].z);return e[n].yTop+(e[n+1].yTop-e[n].yTop)*r}return e[e.length-1].yTop}function Qf(e,t,n,r,i,a,o,s){let c=t.length,l=(c*3+(c-1))*a,u=5*a,d=n-l/2,f=(e,t)=>[e,i(t)+.014,t],p=a*.6;e.flatQuad(f(d-p,r-p),f(d+l+p,r-p),f(d+l+p,r+u+p),f(d-p,r+u+p),o);let m=e=>n+l/2-e;for(let n=0;n<c;n++){let o=jf[t[n]]||jf[0];for(let t=0;t<5;t++)for(let c=0;c<3;c++)if(o[t*3+c]===`1`){let o=n*4*a+c*a,l=m(o+a),u=m(o),d=r+(4-t)*a,f=.02;e.flatQuad([l,i(d)+f,d],[u,i(d)+f,d],[u,i(d+a)+f,d+a],[l,i(d+a)+f,d+a],s)}}}function $f(e,t,n,r,i,a){return[[e,r],[t,i],[n,a],[-n,a],[-t,i],[-e,r]]}function ep(e,t){let n=e.c1,r=e.c2,i=new Vf,a=kf(e,t),o=String(Af(e,t)),s=Nf(n),c=Nf(r),l=Ff(s,.72),u=Ff(s,1.12),d=e.livery?.c3==null?Ff(c,.9):Nf(e.livery.c3),f=a===`twotone`,p=f?c:l,m=[{z:3.36,wb:.05,wm:.06,wt:.05,y0:.2,ym:.26,y1:.31},{z:2.9,wb:.12,wm:.15,wt:.1,y0:.2,ym:.34,y1:.4},{z:2.3,wb:.2,wm:.27,wt:.17,y0:.2,ym:.42,y1:.5},{z:1.6,wb:.3,wm:.38,wt:.25,y0:.22,ym:.5,y1:.6},{z:.95,wb:.4,wm:.46,wt:.33,y0:.24,ym:.58,y1:.7},{z:.3,wb:.44,wm:.5,wt:.37,y0:.26,ym:.62,y1:.74},{z:-.35,wb:.42,wm:.46,wt:.3,y0:.28,ym:.68,y1:.84},{z:-.95,wb:.36,wm:.4,wt:.22,y0:.3,ym:.78,y1:1.02},{z:-1.55,wb:.28,wm:.3,wt:.14,y0:.32,ym:.62,y1:.8},{z:-2.05,wb:.22,wm:.24,wt:.1,y0:.34,ym:.5,y1:.62},{z:-2.4,wb:.2,wm:.2,wt:.1,y0:.34,ym:.46,y1:.56}],h=e=>a===`fade`?Pf(u,c,zf((1.6-e)/3.6,0,1)):a===`hoop`&&(e<-.4&&e>-1||e<-2)||f&&e<-.3?c:u,g=m.map(e=>({z:e.z,ring:$f(e.wb,e.wm,e.wt,e.y0,e.ym,e.y1),seg:[p,s,h(e.z),s,p,Hf]}));i.loft(g,s,Hf);let _=(()=>{let e=m.map(e=>({z:e.z,yTop:e.y1}));return t=>Zf(e,t)})(),v=(()=>{let e=m.map(e=>({z:e.z,yTop:e.wt}));return t=>Zf(e,t)})();i.box(0,.745,.05,.5,.05,.9,Hf),i.box(0,.84,-.42,.34,.2,.18,Uf);let y=new ja(.19,6,4).toNonIndexed().attributes.position,b=a===`twotone`?c:Wf;for(let e=0;e<y.count;e+=3)i.tri([y.getX(e),y.getY(e)+.95,y.getZ(e)+.08],[y.getX(e+1),y.getY(e+1)+.95,y.getZ(e+1)+.08],[y.getX(e+2),y.getY(e+2)+.95,y.getZ(e+2)+.08],b,[0,.95,.08]);i.box(0,.97,.245,.27,.085,.07,Nf(727595)),i.box(0,1.01,.262,.2,.025,.04,Nf(16764730));let x=(e,t,n,r,i,a)=>({z:e,ring:[t,n,r,i,a],seg:[Hf,p,s,f?c:u,Ff(s,.6)]}),S=[x(.85,[.5,.3],[.78,.36],[1,.52],[.9,.74],[.5,.74]),x(.1,[.5,.3],[.74,.37],[.97,.56],[.86,.78],[.5,.82]),x(-.9,[.42,.34],[.62,.4],[.82,.58],[.68,.72],[.4,.88]),x(-1.9,[.3,.36],[.42,.4],[.5,.5],[.42,.6],[.26,.64])];i.mirrored(()=>i.loft(S,s,Hf)),i.plate([[-1.5,.9],[-1.6,1.12],[-1.75,1.12],[-2.35,.66],[-2.45,.58],[-1.5,.58]],-.02,.02,u,c),i.box(0,1.04,-.78,.3,.2,.3,u),i.box(0,1.07,-.62,.22,.13,.04,Hf);let C=Nf(3158588);i.beam([0,.78,.5],[0,1.1,.62],.06,C),i.beam([.02,1.1,.62],[.33,1.1,.12],.055,C),i.beam([-.02,1.1,.62],[-.33,1.1,.12],.055,C),i.beam([.33,1.1,.12],[.34,.82,-.18],.055,C),i.beam([-.33,1.1,.12],[-.34,.82,-.18],.055,C),i.box(0,1.125,.6,.07,.03,.12,c);let w=[[3.4,.13,.3,0,Hf],[3.25,.19,.28,.17,c],[3.1,.26,.26,.34,u]];for(let[e,t,n,r,a]of w)i.box(0,t,e,2,.035,n,a,r);i.beam([.12,.3,2.7],[.1,.17,3.15],.05,Uf),i.beam([-.12,.3,2.7],[-.1,.17,3.15],.05,Uf),i.mirrored(()=>i.plate([[3.5,.08],[3.5,.28],[3.2,.42],[2.95,.4],[2.95,.1]],1,1.05,s,c)),i.box(0,1.12,-2.42,1.7,.045,.34,u,-.12),i.box(0,1.28,-2.46,1.7,.04,.3,c,-.3),i.box(0,.58,-2.5,1.1,.035,.26,Hf,-.1),i.mirrored(()=>i.plate([[-2.1,.5],[-2.1,1.42],[-2.5,1.42],[-2.75,1.34],[-2.75,.55]],.86,.92,s,c)),i.beam([.1,.62,-2.15],[.1,1.1,-2.4],.055,Uf),i.beam([-.1,.62,-2.15],[-.1,1.1,-2.4],.055,Uf),i.box(0,.5,-2.1,.4,.28,.5,Hf),i.box(0,.32,-2.55,.9,.08,.35,Uf,.18),i.box(0,.12,-.15,1.3,.05,4.2,Uf);let T=Nf(4869464);for(let[e,t]of tp){let n=Math.sign(e),r=[e-n*.25,.4,t],a=t>0?1:-1;i.beam([n*.4,.34,t+.35*a],r,.04,T),i.beam([n*.4,.34,t-.35*a],r,.04,T),i.beam([n*.36,.62,t+.25*a],[r[0],.5,t],.04,T),i.beam([n*.36,.62,t-.25*a],[r[0],.5,t],.04,T),i.beam([n*.2,.7,t],[r[0],.43,t],.035,c)}rp(i,a,s,c,_,v,S,d);let E=a===`twotone`?Wf:Nf(15790322),D=e.livery&&ip(d)<.45?d:Hf;return Qf(i,o,0,1.3,_,.06,E,D),Qf(i,o,0,-1.42,_,.034,E,D),i}var tp=[[.95,1.9],[-.95,1.9],[1.05,-1.65],[-1.05,-1.65]];function np(e,t,n){let r=0;for(;r<e.length-2&&t<e[r+1].z;)r++;let i=e[r],a=e[r+1],o=zf((i.z-t)/(i.z-a.z),0,1),s=e=>[i.ring[e][0]+(a.ring[e][0]-i.ring[e][0])*o,i.ring[e][1]+(a.ring[e][1]-i.ring[e][1])*o],c=s(3),l=s(4);return[l[0]+(c[0]-l[0])*n,l[1]+(c[1]-l[1])*n]}function rp(e,t,n,r,i,a,o,s=Ff(r,.9)){let c=.012,l=(e,t)=>zf(e,-a(t)+.005,a(t)-.005),u=(e,t)=>[l(e,t),i(t)+c,t],d=(t,n,r,i,a)=>e.flatQuad(u(t,r),u(n,r),u(n,i),u(t,i),a);if(t===`stripe`||t===`chevron`)for(let e of[1,-1]){let t=e*.045,n=e*.1;d(t,n,3.3,1.7,r),d(t,n,-.4,-2.35,r)}if(t===`chevron`)for(let t=0;t<2;t++){let n=2.25-t*.5;for(let i of[1,-1])e.flatQuad(u(i*.02,n+.1),u(i*.2,n-.14),u(i*.2,n-.4),u(i*.02,n-.12),t?s:r)}if(t===`flash`){d(-.08,.08,3.36,2.7,r);for(let t of[1,-1]){let n=(e,n)=>{let r=np(o,e,n);return[t*r[0],r[1]+c,e]};e.flatQuad(n(-.6,.55),n(-.6,.15),n(-1.4,.15),n(-1.4,.65),r)}}if(t===`hoop`&&(d(-.3,.3,.9,.7,r),d(-.3,.3,-1.6,-1.75,r)),t===`twotone`&&d(-.08,.08,3.36,.4,r),t===`fade`)for(let e of[1,-1])d(e*.03,e*.06,3.2,1.8,s);if(t===`checker`){for(let[e,t]of[[2.05,2],[-1.95,2]])for(let n=0;n<t;n++)for(let t=-3;t<3;t++){let i=e-n*.1,a=.06;d(t*a,(t+1)*a,i,i-.1,n+t&1?r:s)}for(let e of[1,-1])d(e*.05,e*.08,1.7,.4,r)}}var ip=e=>.3*e[0]+.59*e[1]+.11*e[2];function ap(e,t){let n=e.c1,r=e.c2,i=new Vf,a=kf(e,t),o=String(Af(e,t)),s=Nf(n),c=Nf(r),l=Ff(s,1.12),u=a===`twotone`,d=u?c:Ff(s,.72),f=e.livery?.c3==null?Ff(c,.9):Nf(e.livery.c3),p=[{z:3.3,wb:.2,wm:.24,wt:.2,y0:.2,ym:.3,y1:.36},{z:2.7,wb:.3,wm:.38,wt:.28,y0:.2,ym:.38,y1:.46},{z:2,wb:.42,wm:.5,wt:.38,y0:.22,ym:.5,y1:.6},{z:1.1,wb:.52,wm:.6,wt:.46,y0:.24,ym:.58,y1:.7},{z:.2,wb:.56,wm:.62,wt:.46,y0:.26,ym:.62,y1:.76},{z:-.7,wb:.54,wm:.58,wt:.38,y0:.28,ym:.7,y1:.9},{z:-1.5,wb:.44,wm:.46,wt:.2,y0:.3,ym:.78,y1:1.08},{z:-2.1,wb:.34,wm:.34,wt:.14,y0:.32,ym:.62,y1:.86},{z:-2.5,wb:.3,wm:.3,wt:.12,y0:.34,ym:.5,y1:.7}],m=p.map(e=>({z:e.z,ring:$f(e.wb,e.wm,e.wt,e.y0,e.ym,e.y1),seg:[d,s,a===`fade`?Pf(l,c,zf((1.6-e.z)/3.6,0,1)):u&&e.z<0||a===`hoop`&&e.z<-1.2&&e.z>-1.7?c:l,s,d,Hf]}));i.loft(m,s,Hf);let h=(()=>{let e=p.map(e=>({z:e.z,yTop:e.y1}));return t=>Zf(e,t)})(),g=(()=>{let e=p.map(e=>({z:e.z,yTop:e.wt}));return t=>Zf(e,t)})();i.box(0,.775,.45,.62,.05,1,Hf);let _=new ja(.21,6,4).toNonIndexed().attributes.position,v=a===`twotone`?c:Wf;for(let e=0;e<_.count;e+=3)i.tri([_.getX(e),_.getY(e)+1,_.getZ(e)+.4],[_.getX(e+1),_.getY(e+1)+1,_.getZ(e+1)+.4],[_.getX(e+2),_.getY(e+2)+1,_.getZ(e+2)+.4],v,[0,1,.4]);i.box(0,1.02,.6,.3,.09,.08,Nf(727595)),i.box(0,1.06,.62,.22,.026,.04,Nf(4186367));let y=Nf(3158588);i.quad([.4,.78,.95],[-.4,.78,.95],[-.3,1.18,.62],[.3,1.18,.62],Gf,[0,.9,.4]),i.quad([.3,1.18,.62],[-.3,1.18,.62],[-.28,1.2,.5],[.28,1.2,.5],Kf,[0,.9,.4]),i.beam([.4,.78,.95],[.3,1.18,.62],.06,y),i.beam([-.4,.78,.95],[-.3,1.18,.62],.06,y),i.beam([.3,1.18,.62],[.38,1,-.15],.055,y),i.beam([-.3,1.18,.62],[-.38,1,-.15],.055,y),i.box(0,1.2,.58,.62,.035,.1,c);let b=(e,t,n,r,i,a)=>({z:e,ring:[t,n,r,i,a],seg:[Hf,d,s,u?c:l,Ff(s,.6)]}),x=[b(1,[.6,.3],[.9,.36],[1.12,.54],[1.02,.78],[.6,.78]),b(-.1,[.6,.3],[.88,.37],[1.12,.58],[1,.86],[.58,.9]),b(-1.2,[.5,.34],[.78,.4],[1,.6],[.84,.82],[.5,.94]),b(-2.2,[.36,.36],[.5,.4],[.6,.52],[.5,.66],[.3,.72])];i.mirrored(()=>i.loft(x,s,Hf)),i.plate([[-.9,1.04],[-1.2,1.5],[-1.34,1.5],[-1.7,1.06],[-2.5,.72],[-2.6,.64],[-1.4,.6]],-.03,.03,l,c),i.box(0,1.1,-.8,.36,.2,.4,l),i.box(0,1.13,-.58,.26,.14,.05,Hf),i.box(0,.16,3.4,2.4,.04,.34,Hf),i.box(0,.22,3.26,2.4,.04,.3,c,.16),i.box(0,.3,3.12,2.2,.04,.26,l,.32),i.beam([.2,.34,2.7],[.18,.2,3.3],.06,Uf),i.beam([-.2,.34,2.7],[-.18,.2,3.3],.06,Uf),i.mirrored(()=>i.plate([[3.55,.08],[3.55,.3],[3.25,.44],[3,.42],[3,.1]],1.2,1.26,s,c)),i.box(0,1.28,-2.5,2.1,.05,.42,l,-.1),i.box(0,1.5,-2.55,2.1,.045,.36,c,-.3),i.mirrored(()=>i.plate([[-2.2,.55],[-2.2,1.72],[-2.62,1.72],[-2.9,1.62],[-2.9,.6]],1.04,1.1,s,c)),i.beam([.14,.7,-2.2],[.14,1.26,-2.5],.06,Uf),i.beam([-.14,.7,-2.2],[-.14,1.26,-2.5],.06,Uf),i.box(0,.52,-2.3,.6,.3,.6,Hf),i.box(0,.12,-.1,1.5,.05,4.4,Uf);let S=Nf(4869464);for(let[e,t]of Xf.speedway){let n=Math.sign(e),r=[e-n*.27,.43,t],a=t>0?1:-1;i.beam([n*.5,.34,t+.35*a],r,.045,S),i.beam([n*.5,.34,t-.35*a],r,.045,S),i.beam([n*.46,.64,t+.25*a],[r[0],.54,t],.045,S),i.beam([n*.46,.64,t-.25*a],[r[0],.54,t],.045,S)}rp(i,a,s,c,h,g,x,f);let C=Nf(15790322);return Qf(i,o,0,1.45,h,.06,C,Hf),Qf(i,o,0,-1,h,.034,C,Hf),i}function op(e,t,n,r){let i=new Vf,a=qf[e],o=Jf[e]/2,s=Nf(1710623),c=Nf(2500140),l=Nf(1842210),u=n,d=t,f=Pf(Nf(1315866),d,.18),p=a*.78,m=a*.9,h=a*.62,g=h*.86,_=o+.02,v=(e,t,n)=>[n,Math.cos(t)*e,Math.sin(t)*e],y=.07;for(let e=0;e<10;e++){let t=e/10*Math.PI*2,n=(e+1)/10*Math.PI*2,b=[0,0,0],x=e===0&&r?Nf(6972766):e&1?s:c;i.quad(v(a,t,-o+y),v(a,t,o-y),v(a,n,o-y),v(a,n,-o+y),x,b);for(let e of[1,-1])i.quad(v(a,t,e*(o-y)),v(a,t,e*o),v(a,n,e*o),v(a,n,e*(o-y)),u,b);i.quad(v(a,t,o),v(a*.92,t,o),v(a*.92,n,o),v(a,n,o),l,b),i.quad(v(a*.92,t,o),v(m,t,_),v(m,n,_),v(a*.92,n,o),l,b),i.quad(v(m,t,_),v(p,t,_),v(p,n,_),v(m,n,_),u,b),i.quad(v(p,t,_),v(h,t,_),v(h,n,_),v(p,n,_),l,b),i.quad(v(h,t,_),v(g,t,_),v(g,n,_),v(h,n,_),e&1?d:Ff(d,.82),b),i.quad(v(g,t,_),v(1e-4,t,_),v(1e-4,n,_),v(g,n,_),f,b),i.quad(v(a*.92,n,-o),v(a*.55,n,-o),v(a*.55,t,-o),v(a*.92,t,-o),l,b)}for(let e=0;e<3;e++){let t=.35+e*.28,n=a*.915,r=a*.935;i.flatQuad(v(n,t,o+.012),v(r,t,o+.012),v(r,t+.16,o+.012),v(n,t+.16,o+.012),Nf(13619158),[1,0,0])}let b=_+.012;for(let e=0;e<5;e++){let t=e/5*Math.PI*2,n=Math.cos(t),r=Math.sin(t),o=a*.1,s=[b,n*g*.98,r*g*.98],c=-r*o,l=n*o;i.flatQuad([b,c*.6,l*.6],[b,s[1]+c,s[2]+l],[b,s[1]-c,s[2]-l],[b,-c*.6,-l*.6],e===0?Wf:Ff(d,1.2),[1,0,0])}let x=[];for(let e=0;e<5;e++){let t=e/5*Math.PI*2+Math.PI/5;x.push([Math.sin(t)*a*.15,Math.cos(t)*a*.15])}return i.plate(x,b-.005,b+.045,Wf),i}var sp=e=>(Mf.set(e),.3*Mf.r+.59*Mf.g+.11*Mf.b),cp=e=>sp(e.c2)>.28?e.c2:sp(e.c1)>.28?e.c1:15263984,lp={dry:15921910,wet:3117055},up=3;function dp(e){let t=e===`speedway`,n=t?-2.512:-2.412,r=t?.52:.5,i=new mi,a=[],o=[[.15,r,n],[-.15,r,n],[0,r-.1,n]];for(let e=0;e<up;e++){let[t,n,r]=o[e];for(let i of[1,2.4]){let o=(e===2?.07:.085)*i,s=(e===2?.05:.06)*i;a.push(t-o,n-s,r,t+o,n-s,r,t+o,n+s,r,t-o,n-s,r,t+o,n+s,r,t-o,n+s,r)}}return i.setAttribute(`position`,new ni(a,3)),i.setAttribute(`color`,new $r(new Float32Array(a.length/3*4),4)),i}var fp=new Ua({vertexColors:!0,flatShading:!0}),pp=new Ei({color:0,transparent:!0,opacity:.5,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4}),mp=new Ei({color:16772659,fog:!1}),hp=new Ei({vertexColors:!0,transparent:!0,opacity:.38,depthWrite:!1}),gp=new Ei({vertexColors:!0,transparent:!0,depthWrite:!1,fog:!1,side:2}),_p=new ka(2.7,6.4).rotateX(-Math.PI/2),vp=new Map,yp=new Map,bp=new Map;function xp(e,t,n=t.index??0){let r=t.livery,i=e+`:`+n+`:`+t.c1+`:`+t.c2+(r?`:`+r.pattern+`:`+r.c3+`:`+r.number:``),a=vp.get(i);return a||(a=(e===`speedway`?ap:ep)(t,n).geometry(),a.name=`car-${e}-${n}`,vp.set(i,a)),a}function Sp(e,t,n=`dry`){let r=e+`:`+t.c2+`:`+n,i=yp.get(r);if(!i){let a=cp(t),o=n===`dry`&&sp(a)>.78?16765471:lp[n]||lp.dry;i=op(e,Nf(a),Nf(o),!0).geometry(),yp.set(r,i)}return i}var Cp=e=>{let t=bp.get(e);return t||(t=dp(e),bp.set(e,t)),t},wp=new Ln,Tp=new pn,Ep=new qn,Dp=new K,Op=new K(1,1,1);function kp(e,t,n=!1,r=!1,i=t.index??0){let a=e===`speedway`?`speedway`:`gp`,o=new Ri(xp(a,t,i),r?hp:fp);o.castShadow=!r,o.receiveShadow=!r,o.name=`body`;let s=new dr,c=new dr;c.add(o);let l=new Xi(Sp(a,t,`dry`),r?hp:fp,4);{let e=Xf[a],t=qf[a],n=(e[0][1]+e[2][1])/2,r=Math.max(...e.map(e=>Math.abs(e[0])))+Jf[a]/2+.15;l.boundingSphere=new oi(new K(0,t,n),Math.hypot(r,(e[0][1]-e[2][1])/2+t+.15,t+.1))}l.castShadow=!1,l.receiveShadow=!1,l.name=`wheels`,c.add(l);let u=Xf[a].map(([e,t],n)=>({i:n,x:e,z:t,y:qf[a],front:n<2,left:e>0,steer:0,spin:0,bump:0,visible:!0,mesh:l})),d=[u[0],u[1]],f=null,p={intensity:0,on:!1},m={intensity:0,on:!1};r||(f=new Ri(Cp(a).clone(),gp),f.renderOrder=3,c.add(f));let h=new Ri(_p,pp);h.position.y=.06,h.name=`shadow`,r||s.add(h),s.add(c);let g=null;n&&(g=new Ri(new va(1.5,2.8,4).rotateX(Math.PI),mp),g.position.y=5,g.visible=!1,s.add(g));let _={group:s,pivot:c,body:o,wheels:u,frontPivots:d,wheelMesh:l,lamps:f,brakeLight:p,rainLight:m,mark:g,cls:a,ghost:r,shadow:h,team:t,teamIndex:i,number:Af(t,i),tire:`dry`,anim:{pitch:0,roll:0,bob:0,kerbMix:0,steer:0,t:0,dist:0,rainPhase:0,bumpPhase:0,vib:0},setTire(e){e!==_.tire&&(_.tire=e,l.geometry=Sp(a,t,e))}};return Ap(_),_}function Ap(e){let t=qf[e.cls],n=e.wheels;for(let r=0;r<n.length;r++){let i=n[r];if(!i.visible){wp.makeScale(0,0,0),e.wheelMesh.setMatrixAt(i.i,wp);continue}let a=i.left?i.spin:-i.spin;Ep.set(a,-i.steer+(i.left?0:Math.PI),0,`YXZ`),Tp.setFromEuler(Ep),Dp.set(i.x,t+i.bump,i.z),e.wheelMesh.setMatrixAt(i.i,wp.compose(Dp,Tp,Op))}e.wheelMesh.instanceMatrix.needsUpdate=!0}var jp=.42*Yf,Mp=.12*Yf;jp*60;function Np(e){let t=Math.abs(e);if(!(t>jp))return e;let n=Math.floor(t/Yf),r=t-n*Yf;return Math.sign(e)*(n*Yf+zf(r,n?Mp:0,jp))}var Pp=Math.PI*2*1024,Fp=Math.PI-Math.PI/10,Ip=Math.PI+Math.PI/10;function Lp(e,t,n){let r=e.anim,i=qf[e.cls],a=t.v;r.t+=n;let o=1-.85*(t.lockup||0),s=(a||0)/i*o*n,c=Np(s);r.steer+=((t.steer||0)*.42*zf(1-Math.abs(a)/120,.3,1)-r.steer)*(1-Math.exp(-Math.min(n,.1)*24)),r.bumpPhase+=s;let l=e.wheels,u=t.flat>.02?.03*t.flat*zf(Math.abs(a)/25,0,1):0;for(let e=0;e<l.length;e++){let t=l[e];t.spin+=c,(t.spin>Pp||t.spin<-Pp)&&(t.spin-=Pp*Math.sign(t.spin)),t.steer=t.front?r.steer:0,t.bump=t.front&&u>0?u*Math.max(0,Math.cos(t.spin-(t.left?Fp:Ip)))**3:0}let d=1-Math.exp(-Math.min(n,.1)*7),f=-zf((t.signedLatAcc??Math.sign(t.steer||0)*(t.latAcc||0))*.0019,-.078,.078),p=zf(-(t.longAcc||0)*.00135,-.06,.062);r.roll+=(f-r.roll)*d,r.pitch+=(p-r.pitch)*d,r.dist=t.s??r.dist+a*n;let m=+(t.surface===`kerb`),h=+(t.surface===`grass`||t.surface===`gravel`);r.kerbMix+=(Math.max(m,h)-r.kerbMix)*(1-Math.exp(-Math.min(n,.1)*14)),r.bob=r.kerbMix*zf(Math.abs(a)/50,.25,1)*((m?.022:.034)*Math.sin(r.dist*4.4)+.009*Math.sin(r.dist*9.1+1));let g=(.0035*zf(Math.abs(a)/90,0,1)+.012*(t.flat||0)*zf(Math.abs(a)/40,0,1)+.01*(t.lockup||0))*Math.sin(r.t*83);e.pivot.rotation.x=-(t.pitch||0)+r.pitch+g*.6,e.pivot.rotation.z=(t.roll||0)+r.roll+g*.4,e.pivot.position.y=(t.lift||0)+r.bob+Math.abs(g)*.5,e.shadow.rotation.x=-(t.pitch||0),e.shadow.rotation.z=t.roll||0;let _=(t.brake||0)>.05||(t.longAcc||0)<-9;e.brakeLight.on=_,e.brakeLight.intensity=+!!_;let v=(t.rain||0)>.25;return r.rainPhase+=n,e.rainLight.on=v,e.rainLight.intensity=v?Math.sin(r.rainPhase*11)>0?1:.15:0,e.ghost||zp(e),Ap(e),e}function Rp(e,t,n,r,i,a,o){let s=t*12*4;for(let t=0;t<12;t++){let c=s+t*4;e[c]=n,e[c+1]=r,e[c+2]=i,e[c+3]=t>=6?o:a}}function zp(e){let t=e.lamps.geometry.attributes.color,n=t.array,r=e.brakeLight.intensity,i=e.rainLight.intensity;for(let e=0;e<2;e++)Rp(n,e,.35+.65*r,.03+.12*r,.03+.05*r,.9,.26*r);let a=i>.5?.5:0;Rp(n,2,.4+.6*i,.04+a,.04+a,.9,.3*i),t.needsUpdate=!0}function Bp(e){e.wheelMesh.dispose?.(),e.lamps?.geometry.dispose(),e.mark&&e.mark.geometry.dispose()}function Vp(e,t){let n=(Math.imul(e|0,668265261)^Math.imul((t|0)+374761393,2246822507))>>>0;return n=Math.imul(n^n>>>15,739982445)>>>0,n^=n>>>12,(n>>>0)%65536/65536}var Hp={grass:{r:.45,g:.36,b:.22,a:.5,rate:.35,life:.9,up:1.6,size:1},gravel:{r:.62,g:.5,b:.34,a:.55,rate:.5,life:1.1,up:2.2,size:1}},Up=(e,t,n,r)=>e.x+t*r[0]+n*r[1],Wp=(e,t,n,r)=>e.z-n*r[0]+t*r[1],Gp=class{constructor(e=384,t=320){this.max=e,this.next=0,this.counter=0,this.px=new Float32Array(e*3),this.vel=new Float32Array(e*3),this.life=new Float32Array(e),this.life0=new Float32Array(e),this.a0=new Float32Array(e),this.col=new Float32Array(e*4);for(let t=0;t<e;t++)this.px[t*3+1]=-1e3;let n=new mi;n.setAttribute(`position`,new $r(this.px,3).setUsage(Vt)),n.setAttribute(`color`,new $r(this.col,4).setUsage(Vt)),this.points=new ca(n,new ra({size:1,vertexColors:!0,transparent:!0,depthWrite:!1,sizeAttenuation:!0,fog:!1})),this.points.frustumCulled=!1,this.points.renderOrder=4,this.points.name=`tyre-fx`,this.maxMarks=t,this.mnext=0,this.mCount=0,this.mpos=new Float32Array(t*4*3);let r=new mi;r.setAttribute(`position`,new $r(this.mpos,3).setUsage(Vt));let i=new Uint16Array(t*6);for(let e=0;e<t;e++)i.set([e*4,e*4+1,e*4+2,e*4,e*4+2,e*4+3],e*6);r.setIndex(new $r(i,1)),this.marks=new Ri(r,new Ei({color:789518,transparent:!0,opacity:.55,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6,side:2,fog:!1})),this.marks.frustumCulled=!1,this.marks.renderOrder=1,this.marks.name=`skid-marks`,this.markDirty=!1}get group(){return this}addTo(e){e.add(this.marks),e.add(this.points)}removeFrom(e){e.remove(this.marks),e.remove(this.points)}emit(e,t,n,r,i,a,o,s,c,l,u){let d=this.next;this.next=(this.next+1)%this.max;let f=d*3;return this.px[f]=e,this.px[f+1]=t,this.px[f+2]=n,this.vel[f]=r,this.vel[f+1]=i,this.vel[f+2]=a,this.life[d]=o,this.life0[d]=o,this.a0[d]=u,this.col[d*4]=s,this.col[d*4+1]=c,this.col[d*4+2]=l,this.col[d*4+3]=u,d}update(e){let t=this.max,n=Math.exp(-2.2*e);for(let r=0;r<t;r++){let t=this.life[r];if(t<=0)continue;let i=r*3,a=t-e;if(a<=0){this.life[r]=0,this.px[i+1]=-1e3,this.col[r*4+3]=0;continue}this.life[r]=a,this.vel[i]*=n,this.vel[i+2]*=n,this.vel[i+1]=this.vel[i+1]*n+.7*e,this.px[i]+=this.vel[i]*e,this.px[i+1]+=this.vel[i+1]*e,this.px[i+2]+=this.vel[i+2]*e;let o=a/this.life0[r];this.col[r*4+3]=this.a0[r]*o*Math.min(1,(1-o)*8+.2)}let r=this.points.geometry;r.attributes.position.needsUpdate=!0,r.attributes.color.needsUpdate=!0,this.markDirty&&=(this.marks.geometry.attributes.position.needsUpdate=!0,!1)}alive(){let e=0;for(let t=0;t<this.max;t++)this.life[t]>0&&e++;return e}mark(e,t,n,r,i,a){let o=n-e,s=r-t,c=Math.hypot(o,s);if(c<1e-4)return;let l=-s/c*a,u=o/c*a,d=this.mnext*12,f=this.mpos;f[d]=e+l,f[d+1]=i,f[d+2]=t+u,f[d+3]=e-l,f[d+4]=i,f[d+5]=t-u,f[d+6]=n-l,f[d+7]=i,f[d+8]=r-u,f[d+9]=n+l,f[d+10]=i,f[d+11]=r+u,this.mnext=(this.mnext+1)%this.maxMarks,this.mCount=Math.min(this.maxMarks,this.mCount+1),this.markDirty=!0}clear(){this.life.fill(0),this.px.fill(0);for(let e=0;e<this.max;e++)this.px[e*3+1]=-1e3;this.col.fill(0),this.mpos.fill(0),this.mnext=0,this.mCount=0,this.markDirty=!0}emitCar(e,t,n,r,i=`gp`){if(r<=0||t.ghost)return;let a=t.anim,o=Xf[i===`speedway`?`speedway`:`gp`],s=Hp[e.surface],c=Math.abs(e.v),l=Math.sin(n.theta),u=Math.cos(n.theta);if(s&&c>5)for(a.fxDust=(a.fxDust||0)+r*s.rate*Math.min(60,c*1.2);a.fxDust>=1;){--a.fxDust,this.counter++;let t=2+(this.counter&1),r=Vp(this.counter,e.id),i=Vp(this.counter+17,e.id);this.emit(Up(n,u,l,o[t])+(r-.5)*.4,n.y+.15,Wp(n,u,l,o[t])+(i-.5)*.4,-l*c*.12+(r-.5)*2.5,s.up*(.5+i),-u*c*.12+(i-.5)*2.5,s.life*(.7+.6*r),s.r,s.g,s.b,s.a)}let d=e.lockup||0,f=Math.max(0,(e.wheelSlip||0)-.45)*+(c>20),p=Math.max(d,f*.5);if(p>.25&&!s)for(a.fxSmoke=(a.fxSmoke||0)+r*(8+40*p);a.fxSmoke>=1;){--a.fxSmoke,this.counter++;let t=this.counter&1,r=Vp(this.counter,e.id+3),i=Vp(this.counter+5,e.id+3);this.emit(Up(n,u,l,o[t]),n.y+.2,Wp(n,u,l,o[t]),-l*c*.06+(r-.5)*1.4,.5+i*1.4,-u*c*.06+(i-.5)*1.4,.35+.35*r,.45,.45,.47,.32*Math.min(1,.4+p))}if(d>.3&&e.surface!==`grass`&&e.surface!==`gravel`)for(let e=0;e<2;e++){let t=Up(n,u,l,o[e]),r=Wp(n,u,l,o[e]);a.lastMark&&a.lastMark[e*2]!==void 0&&Math.hypot(t-a.lastMark[e*2],r-a.lastMark[e*2+1])<4?Math.hypot(t-a.lastMark[e*2],r-a.lastMark[e*2+1])>.6&&(this.mark(a.lastMark[e*2],a.lastMark[e*2+1],t,r,n.y+.05,.13),a.lastMark[e*2]=t,a.lastMark[e*2+1]=r):((a.lastMark||=[void 0,void 0,void 0,void 0])[e*2]=t,a.lastMark[e*2+1]=r)}else a.lastMark&&(a.lastMark[0]=a.lastMark[2]=void 0)}};function Kp(e,t){let n=wu(e),r=new Float32Array(n*6),i=new Float32Array(n*8),a=new Uint16Array((n-1)*6);for(let e=0;e<n-1;e++){let t=e*2;a.set([t,t+1,t+2,t+1,t+3,t+2],e*6)}let o=new mi;o.setAttribute(`position`,new $r(r,3).setUsage(Vt)),o.setAttribute(`color`,new $r(i,4).setUsage(Vt)),o.setIndex(new $r(a,1));let s=new Ri(o,new Ei({vertexColors:!0,transparent:!0,depthWrite:!1,side:2,fog:!1,polygonOffset:!0,polygonOffsetFactor:-8,polygonOffsetUnits:-8}));s.frustumCulled=!1,s.renderOrder=3,s.visible=!1,s.name=`line-guide`;let c={enabled:!1,level:0,reds:0,yellows:0,greens:0,v:0,s:0};return{mesh:s,status:c,n,ahead:140,back:8,update(a,l,u){if(!s.visible)return;Tu(e,t,a,l,u,r,i,n),o.attributes.position.needsUpdate=!0,o.attributes.color.needsUpdate=!0;let d=0,f=0,p=0;for(let e=0;e<n;e++){let t=e*8;i[t+3]<.3||(i[t]>.9&&i[t+1]<.5?d++:i[t]>.9?f++:p++)}c.reds=d,c.yellows=f,c.greens=p,c.v=l,c.s=a,c.level=d>2?2:+(f>2)},setEnabled(e){c.enabled=!!e,s.visible=!!e}}}function qp(e,t){let n=e.n,r=e.length,i=mu(e,t).v,a=e.lineK,o=[],s=t=>e.sectionName((t%n+n)%n);for(let s=0;s<n;s++){let c=!0;for(let e=-14;e<=14&&c;e++){let t=i[(s+e+n)%n];(t<i[s]||t===i[s]&&e<0)&&(c=!1)}if(!c||i[s]>t.vTop*.66)continue;let l=0;for(let t=0;t<Math.floor(200/e.ds);t++)l=Math.max(l,i[(s-t+n)%n]);if(l-i[s]<22)continue;let u=s;for(;(s-u)*e.ds<90&&Math.abs(a[(u-1+n)%n])>Math.abs(a[s])*.3;)u--;o.push({i:s,e:u,sApex:s*e.ds,sEntry:(u*e.ds%r+r)%r})}let c=[];return o.forEach((t,i)=>{let l=o[(i-1+o.length)%o.length];if(o.length>1&&(t.sApex-l.sApex+r)%r<220)return;let u=a[t.i]>0?-1:1;for(let i of[100,50]){let a=((t.sEntry-i)%r+r)%r,o=Math.floor(a/e.ds)%n,l=u>0?e.leftWall[o]:e.rightWall[o];c.push({s:a,metres:i,side:u,d:u*(l+2.2),corner:s(t.i),apex:t.sApex})}}),c.sort((e,t)=>e.s-t.s)}function Jp(e,t){let n=qp(e,t),r=new Vf,i=[1,.82,.12],a=[.06,.06,.08],o=[.7,.7,.74];for(let t of n){let n=e.at(t.s,t.d),s=e.thetaAt(t.s)+Math.PI,c=Math.sin(s),l=Math.cos(s),u=(e,t,r)=>[n.x+l*e+c*r,n.y+t,n.z-c*e+l*r],d=1.7,f=(e,t,n,i,a)=>{let o=[u(...e),u(...t),u(...n),u(...i)];r.flatQuad(o[0],o[1],o[2],o[3],a,[c,0,l])};for(let e of[-.6,.6])f([e-.05,0,0],[e+.05,0,0],[e+.05,2,0],[e-.05,2,0],o),f([e-.05,0,-.01],[e+.05,0,-.01],[e+.05,2,-.01],[e-.05,2,-.01],o);f([-1.7/2,2,.02],[d/2,2,.02],[d/2,3.2,.02],[-1.7/2,3.2,.02],i),f([-1.7/2-.06,1.94,.01],[.9099999999999999,1.94,.01],[.9099999999999999,3.2+.06,.01],[-1.7/2-.06,3.2+.06,.01],a);let p=String(t.metres),m=p.length===3?.13:.17,h=-((p.length*3+(p.length-1))*m)/2,g=2+(1.2-5*m)/2;for(let e=0;e<p.length;e++){let t=jf[p[e]];for(let n=0;n<5;n++)for(let r=0;r<3;r++)if(t[n*3+r]===`1`){let t=h+e*4*m+r*m,i=g+(4-n)*m;f([t,i,.03],[t+m,i,.03],[t+m,i+m,.03],[t,i+m,.03],a)}}}let s=new Ri(r.geometry(),new Ei({vertexColors:!0,side:2}));return s.name=`brake-boards`,s.frustumCulled=!1,{mesh:s,plan:n}}var Yp=e=>()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296},Xp=new Map,Zp=e=>{if(typeof e!=`number`)return e;let t=Xp.get(e);return t||(t=new q(e),Xp.set(e,t)),t},Qp=class{constructor(){this.p=[],this.c=[]}tri(e,t,n,r){r=Zp(r),this.p.push(e[0],e[1],e[2],t[0],t[1],t[2],n[0],n[1],n[2]);for(let e=0;e<3;e++)this.c.push(r.r,r.g,r.b)}quad(e,t,n,r,i){this.tri(e,t,n,i),this.tri(e,n,r,i)}box(e,t,n,r,i,a,o,s,c=0){let l=Math.cos(o),u=-Math.sin(o),d=Math.sin(o),f=Math.cos(o),p=(o,s,c)=>[e+l*o*r/2+d*c*a/2,t+s*i/2,n+u*o*r/2+f*c*a/2],m=[p(-1,-1,-1),p(1,-1,-1),p(1,1,-1),p(-1,1,-1),p(-1,-1,1),p(1,-1,1),p(1,1,1),p(-1,1,1)];[[4,5,6,7],[1,0,3,2],[5,1,2,6],[0,4,7,3],[3,7,6,2],[0,1,5,4]].forEach((e,t)=>{c&1<<t||this.quad(m[e[0]],m[e[1]],m[e[2]],m[e[3]],typeof s==`function`?s(t):s)})}geometry(){let e=new mi;return e.setAttribute(`position`,new ni(this.p,3)),e.setAttribute(`color`,new ni(this.c,3)),e.computeVertexNormals(),e}},$p=new Ln,em=new pn,tm=new K,nm=new K(1,1,1),rm=new qn;function im(e,t,n,r,i,a=0,o=1,s=1,c=1){let l=e.index?e.toNonIndexed():e.clone();$p.compose(tm.set(t,n,r),em.setFromEuler(rm.set(0,a,0)),nm.set(o,s,c)),l.applyMatrix4($p);let u=Zp(i),d=l.attributes.position.count,f=new Float32Array(d*3);for(let e=0;e<d;e++)f[e*3]=u.r,f[e*3+1]=u.g,f[e*3+2]=u.b;return l.setAttribute(`color`,new $r(f,3)),l.deleteAttribute(`uv`),l}function am(e,t,n,r){let i=new K().subVectors(t,e),a=new ha(n,i.length(),n).toNonIndexed();em.setFromUnitVectors(tm.set(0,1,0),i.normalize()),$p.compose(e.clone().add(t).multiplyScalar(.5),em,nm.set(1,1,1)),a.applyMatrix4($p);let o=Zp(r),s=a.attributes.position.count,c=new Float32Array(s*3);for(let e=0;e<s;e++)c[e*3]=o.r,c[e*3+1]=o.g,c[e*3+2]=o.b;return a.setAttribute(`color`,new $r(c,3)),a.deleteAttribute(`uv`),a}var om=new ha(1,1,1),sm=[[`VOLTRIX`,`#e8362b`,`#ffffff`],[`NOVAFUEL`,`#ffd21f`,`#1b1b2a`],[`KRYTON TIRES`,`#15151c`,`#ffd21f`],[`ZENTRA BANK`,`#1f5fd0`,`#ffffff`],[`BLAZEO`,`#ff8a1f`,`#ffffff`],[`MOCHAMAX`,`#6b3b20`,`#ffe9c4`],[`QUBITEL`,`#7a3fd0`,`#e8ffe0`],[`SKYPLUM AIR`,`#1fb6d6`,`#06223a`]];function cm(e){let[t,n,r]=sm[e%sm.length],i=document.createElement(`canvas`);i.width=256,i.height=80;let a=i.getContext(`2d`);a.fillStyle=n,a.fillRect(0,0,256,80),a.fillStyle=r,a.fillRect(0,0,256,6),a.fillRect(0,74,256,6);for(let e=0;e<6;e++)a.fillRect(8+e*12,14,7,7);a.font=`bold 40px "Courier New", monospace`,a.textAlign=`center`,a.textBaseline=`middle`;let o=40;for(a.font=`bold ${o}px "Courier New", monospace`;a.measureText(t).width>236&&o>14;)o-=2,a.font=`bold ${o}px "Courier New", monospace`;a.fillText(t,128,46);let s=new da(i);return s.magFilter=be,s.minFilter=B,s.generateMipmaps=!1,s.colorSpace=Ft,s}var lm=(e,t,n,r=0)=>[e.px[t]+e.nx[t]*n,e.py[t]+r,e.pz[t]+e.nz[t]*n];function um(e,t,n){let r=t.n;for(let i=0;i<r;i++){let a=(i+1)%r,o=n(i),s=n(a);if(!o||!s)continue;let c=o[3];e.tri(lm(t,i,o[0],o[2]),lm(t,a,s[0],s[2]),lm(t,i,o[1],o[2]),c),e.tri(lm(t,i,o[1],o[2]),lm(t,a,s[0],s[2]),lm(t,a,s[1],s[2]),c)}}function dm(e,t,n){let r=t.n;for(let i=0;i<r;i++){let a=(i+1)%r,o=n(i),s=n(a);o&&s&&(e.quad(lm(t,i,o.d,o.y0),lm(t,a,s.d,s.y0),lm(t,a,s.d,s.y1),lm(t,i,o.d,o.y1),o.col),o.cap&&e.quad(lm(t,i,o.d,o.y1),lm(t,a,s.d,s.y1),lm(t,a,s.d+o.cap,s.y1),lm(t,i,o.d+o.cap,o.y1),o.capCol))}}var fm={name:`circuitDay`,sky:{top:3111120,bot:12903679,rainTop:6257302,rainBot:11123403,sunGlow:1},fog:[120,780],sun:{color:16773590,intensity:2.9,dir:[-.55,.75,.45],rainColor:11124184,rainIntensity:1.5},hemi:{sky:13625087,ground:5999173,intensity:.95},ground:{g1:7327804,g2:6012210,far:4168240,rock:10130556,amp:24,rockFrom:14},gravel:[14467978,13743995],trees:`temperate`,treeNear:130,treeFar:60,treeMaxH:26,treeScale:1,snowbanks:!1,puddles:!1,ambientRain:0,ambientWet:0,rainParticles:!1,buildings:null,neon:!1,wall:null,clouds:!0,night:!1,landmark:`ferris`,sea:null,fx:{sat:1,tint:[1,1,1]}},pm=(e,t={})=>{let n={...e};for(let[r,i]of Object.entries(t))n[r]=i&&typeof i==`object`&&!Array.isArray(i)&&typeof i!=`function`&&e[r]&&typeof e[r]==`object`&&!Array.isArray(e[r])?{...e[r],...i}:i;return n};function mm(r){let i=pm(fm,r),a=new dr,o=[],s=null,c=null,l=null,u=null,d=null,f=null,p=[],m=null,h=null,g={rain:0,wet:0},_={},v={rain:0,sat:1,tint:[1,1,1],time:0,lift:0},y={fogNear:120,fogFar:780},b=2,x=2048,S=null,C=null,w=null,T=null,E=[],D=0,O=null,k=[],A=null,j=null,M=null,N=[],ee=null,P=null,F=null,I=null,te=[],ne=[],re=(e,t,n=0)=>!ne.some(r=>(r.x-e)**2+(r.z-t)**2<(r.r+n)**2),ie=(e,t,n)=>ne.push({x:e,z:t,r:n}),ae=[],oe=1.2,se=(e,t,n,r,i,a=4)=>{let o=Math.cos(i),s=-Math.sin(i),c=Math.sin(i),l=Math.cos(i),u=[],d=Math.max(1,Math.ceil(n/a)),f=Math.max(1,Math.ceil(r/a));for(let i=0;i<=d;i++)for(let a=0;a<=f;a++){if(i>0&&i<d&&a>0&&a<f)continue;let p=(i/d-.5)*n,m=(a/f-.5)*r;u.push([e+o*p+c*m,t+s*p+l*m])}return u},L={hi:0,lo:0},ce=(e,t,n,r,i)=>{let a=n==null?[[e,t],[e+r,t],[e-r,t],[e,t+r],[e,t-r]]:se(e,t,n,r,i).concat([[e,t]]),o=-1e9,s=1e9;for(let e of a){let t=ve(e[0],e[1]);t>o&&(o=t),t<s&&(s=t)}return{hi:o,lo:s}},le=(e,t,n,r,i,a=0,o=0)=>{let s=r==null?c.clearance(t,n)>=i+oe+o:se(t,n,r,i,a).every(e=>c.clearance(e[0],e[1])>=oe+o);return s&&(L=ce(t,n,r,i,a),ae.push(r==null?{kind:e,x:t,z:n,r:i,y:L.hi,lo:L.lo}:{kind:e,x:t,z:n,w:r,l:i,yaw:a,y:L.hi,lo:L.lo})),s},ue=(e,t,n,r,i,a,o)=>{let s=L,c=s.hi-s.lo+.8;c>.9&&e.box(t,s.lo-.8+c/2,n,r,c,i,a,o)},de=(e={})=>new Ua({vertexColors:!0,flatShading:!0,side:2,...e}),R=e=>(o.push(e),e),fe=(e,t,n,r=!1,i=!0)=>{let o=new Ri(R(e.geometry()),t);return o.name=n,o.matrixAutoUpdate=!1,o.updateMatrix(),o.castShadow=r,o.receiveShadow=i,a.add(o),o},pe=(e,t,n=0)=>{let r=c.at(e,t);return r.y+=n,[r.x,r.y,r.z]};function me(t,n,r){let i=c,a=i.n,o=0xde0b6b3a7640000,s=0;for(let e=0;e<a;e+=3){let r=t-i.px[e],a=n-i.pz[e],c=r*r+a*a;c<o&&(o=c,s=e)}let l=s;for(let e=-3;e<=3;e++){let r=(l+e+a)%a,c=t-i.px[r],u=n-i.pz[r],d=c*c+u*u;d<o&&(o=d,s=r)}let u=t-i.px[s],d=n-i.pz[s],f=u*i.tx[s]+d*i.tz[s],p=(i.py[(s+1)%a]-i.py[(s-1+a)%a])/(2*i.ds);return r.i=s,r.y=i.py[s]+e(f,-i.ds,i.ds)*p,r.dist=Math.sqrt(o),r.d=u*i.nx[s]+d*i.nz[s],r.s=s*i.ds+f,r}let he={};function ge(e,r,a=he){let o=c;me(e,r,a);let s=a.dist-o.half[a.i];a.e=s;let l=i.ground.amp*n(110,340,s),u=(Math.sin(e*.011+1.3)*Math.cos(r*.013+.4)*.5+Math.sin(e*.027+r*.019)*.28+Math.sin(r*.045-e*.03)*.12+.3)*l+Math.sin(e*.09)*Math.cos(r*.08)*1.2*n(40,100,s),d=t(a.y-.15-.45*(1-n(10,26,s)),u,n(24,100,s));if(!i.sea)return d;let f=i.sea.mask(e,r)*n(28,70,s);return t(d,i.sea.level-7,f)}function _e(e,t){return c.clearance(e,t)}function ve(e,t){return ge(e,t,{})}function ye(e,r){s=e,c=r;let o=r,v=o.n,y=o.length,D=Yp(r.seed??7);m=s.fog,h=s.background,s.background=new q(i.sky.bot),s.fog=new yr(i.sky.bot,i.fog[0],i.fog[1]),f=new mo(i.hemi.sky,i.hemi.ground,i.hemi.intensity),d=new ko(i.sun.color,i.sun.intensity),d.userData.dir=new K(...i.sun.dir).normalize(),d.position.copy(d.userData.dir).multiplyScalar(260),d.castShadow=!0,d.shadow.mapSize.set(x,x),Object.assign(d.shadow.camera,{near:20,far:640,left:-90,right:90,top:90,bottom:-90}),d.shadow.bias=-6e-4,d.shadow.normalBias=.35,a.add(f,d,d.target),_.asphalt=R(new Ha({vertexColors:!0,flatShading:!0,side:2,specular:0,shininess:55})),_.terrain=R(de()),_.deco=R(de()),_.pit=R(new Ha({vertexColors:!0,flatShading:!0,side:2,specular:0,shininess:55,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),_.decal=R(de({polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),_.decal2=R(de({polygonOffset:!0,polygonOffsetFactor:-5,polygonOffsetUnits:-5})),_.gravel=R(de()),_.cloud=R(new Ei({vertexColors:!0,fog:!1})),_.tire=R(new Ua({flatShading:!0})),_.ao=R(new Ei({color:0,transparent:!0,opacity:.34,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6,side:2,forceSinglePass:!0})),_.aoInst=R(_.ao.clone()),_.foliage=R(new Ua({flatShading:!0})),_.trunk=R(new Ua({color:6964262,flatShading:!0}));let ee=new Qp,P=(e,t,n,r,i,a,o=1.6)=>{let s=Math.cos(a),c=-Math.sin(a),l=Math.sin(a),u=Math.cos(a),d=r/2+o,f=i/2+o,p=(r,i)=>[e+s*r+l*i,t+.07,n+c*r+u*i];ee.quad(p(-d,-f),p(d,-f),p(d,f),p(-d,f),0)},F=R(new Ba({side:1,depthWrite:!1,fog:!1,uniforms:{top:{value:new q(i.sky.top)},bot:{value:new q(i.sky.bot)},sunDir:{value:d.userData.dir.clone()},sunAmt:{value:i.sky.sunGlow}},vertexShader:`varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,fragmentShader:`uniform vec3 top; uniform vec3 bot; uniform vec3 sunDir; uniform float sunAmt; varying vec3 vD; void main(){ float h = clamp(vD.y*1.6+0.05,0.0,1.0); vec3 c = mix(bot, top, pow(h,0.7)); float s = max(dot(normalize(vD), sunDir),0.0); c += vec3(1.0,0.9,0.6)*(pow(s,600.0)*2.0 + pow(s,12.0)*0.25)*sunAmt; gl_FragColor = vec4(c,1.0); }`}));l=new Ri(R(new ja(1e3,16,10)),F),l.renderOrder=-10,l.frustumCulled=!1,a.add(l);{let e=new Float32Array(115173),t=new Float32Array(115173),r={},o=Zp(i.ground.g1),s=Zp(i.ground.g2),c=Zp(i.ground.far),l=Zp(i.ground.rock),u=new q,d=i.sea?Zp(i.sea.sand):null;for(let a=0;a<191;a++)for(let f=0;f<201;f++){let p=-760+f*8,m=-520+a*8,h=a*201+f,g=ge(p,m,r),_=r.e;e[h*3]=p,e[h*3+1]=g,e[h*3+2]=m;let v=Math.floor(r.s/(y/(2*Math.round(y/36))))&1;u.copy(v?o:s).lerp(c,n(60,240,_)),u.lerp(l,n(i.ground.rockFrom,i.ground.rockFrom+22,g)*.8),d&&u.lerp(d,n(i.sea.level+3.5,i.sea.level+.5,g)*n(20,34,_)),t[h*3]=u.r,t[h*3+1]=u.g,t[h*3+2]=u.b}let f=[];for(let e=0;e<190;e++)for(let t=0;t<200;t++){let n=e*201+t,r=n+1,i=n+201,a=i+1;f.push(n,i,r,r,i,a)}let p=R(new mi);p.setAttribute(`position`,new $r(e,3)),p.setAttribute(`color`,new $r(t,3)),p.setIndex(f),p.computeVertexNormals();let m=new Ri(p,_.terrain);m.name=`terrain`,m.frustumCulled=!1,m.receiveShadow=!0,a.add(m)}let I=new Qp,te=new Qp,ne=new Qp,se=new Qp,ce=new Qp,me=new Qp,ye=Zp(2895670),z=Zp(3290429),be=Zp(2303532);um(I,o,e=>[-o.half[e],o.half[e],0,e>>3&1?ye:z]),um(te,o,e=>o.pitTaper[e]>.02?[o.half[e],o.half[e]+16*o.pitTaper[e],0,be]:null);let xe=Zp(16448250),Se=Zp(16765471),B=Zp(15083039);for(let e of[1,-1])um(ne,o,t=>e>0&&o.pitTaper[t]>.5?null:e>0?[o.half[t]-.8,o.half[t]-.2,.045,xe]:[-o.half[t]+.2,-o.half[t]+.8,.045,xe]);um(ne,o,e=>o.pitTaper[e]>.5?[o.half[e]+.1,o.half[e]+.7,.045,xe]:null),um(ne,o,e=>o.pitTaper[e]>.5?[o.half[e]+.1+4.5+3.3,o.half[e]+.1+4.5+3.9,.045,Se]:null);{let e=(o.pit.entry%y+y)%y,t=o.halfAt(e);for(let n=0;n<3;n++){let r=e+n*.55,i=n&1?Se:xe;ne.quad(pe(r,t+.4,.05),pe(r+.5,t+.4,.05),pe(r+.5,t+8.5,.05),pe(r,t+8.5,.05),i)}}for(let e of[1,-1])um(ce,o,t=>{if(!o.kerb[t]||e>0&&o.pitTaper[t]>.02)return null;let n=(t|0)&1?B:xe,r=o.half[t],i=Math.min(1.6,(e>0?o.runL[t]:o.runR[t])-.15);return i<.2?null:e>0?[r,r+i,.03,n]:[-r-i,-r,.03,n]}),um(me,o,t=>{if(!o.gravel[t]||e>0&&o.pitTaper[t]>.02)return null;let n=o.half[t]+1.6,r=o.half[t]+(e>0?o.runL[t]:o.runR[t]);if(r<n+.3)return null;let a=t>>2&1?Zp(i.gravel[0]):Zp(i.gravel[1]);return e>0?[n,r,-.03,a]:[-r,-n,-.03,a]});for(let e=0;e<2;e++)for(let t=-9;t<9;t++){let n=-.6+e*.6,r=t+e&1?1118481:16316664;se.quad(pe(n,t,.045),pe(n+.6,t,.045),pe(n+.6,t+1,.045),pe(n,t+1,.045),r)}for(let e=0;e<10;e++){let t=Math.floor(e/2),n=e%2,r=y-10-t*9-n*4.5,i=n?-3.2:3.2,a=r+3;ne.quad(pe(a,i-1.3,.05),pe(a+.6,i-1.3,.05),pe(a+.6,i+1.3,.05),pe(a,i+1.3,.05),xe);for(let e of[-1.3,1.3])ne.quad(pe(a-1.5,i+e-.25,.05),pe(a,i+e-.25,.05),pe(a,i+e+.25,.05),pe(a-1.5,i+e+.25,.05),xe)}for(let e=0;e<10;e++){let t=(o.boxU(e)%y+y)%y,n=o.halfAt(t);for(let e of[-6.5,6.5])ne.quad(pe(t+e-.3,n+8,.05),pe(t+e+.3,n+8,.05),pe(t+e+.3,n+16,.05),pe(t+e-.3,n+16,.05),xe);let r=Cd[e].c1;ne.quad(pe(t-5,n+10.2,.04),pe(t+5,n+10.2,.04),pe(t+5,n+12.8,.04),pe(t-5,n+12.8,.04),r)}if(fe(I,_.asphalt,`asphalt`),fe(te,_.pit,`pitlane`),fe(ne,_.decal,`markings`),fe(se,_.decal2,`startline`).renderOrder=1,fe(ce,_.decal,`kerbs`),fe(me,_.gravel,`gravel`),i.puddles){let e=new Qp,t=[Zp(1454148),Zp(1982548),Zp(1189944)];for(let n=4;n<v;n+=6){let r=(n&2?1:-1)*o.half[n]*.42,i=1.5+n%5*.28,a=2.8+n%4*.45,s=n*o.ds;e.quad(pe(s,r-i,.055),pe(s+a,r-i*.8,.055),pe(s+a,r+i*.85,.055),pe(s,r+i,.055),t[n%3])}fe(e,_.decal2,`puddles`)}let Ce=new Qp,we=[Zp(15790316),Zp(14474454)],Te=[Zp(9078397),Zp(7828331),Zp(9670276),Zp(7104608)],V=Zp(10657170),H=[Zp(2765124),Zp(3423310),Zp(2370106)];for(let e of[1,-1])dm(Ce,o,r=>{if(e>0&&o.pitTaper[r]>.02)return null;let a=e>0?o.leftWall[r]:o.rightWall[r],s=i.wall===`city`&&o.runoff[r]<12,c=!s&&o.runoff[r]<6,l=s?t(2.6,4.6,n(12,5.2,o.runoff[r])):c?t(1.1,3.2,n(6,2,o.runoff[r])):1.1,u=s?H[(r>>2)%3]:c?Te[((r>>1)+(Math.floor(l)&1)*2+r*7%3)%4]:we[r>>2&1],d=s&&r>>3&1;return{d:e*a,y0:0,y1:l,col:u,cap:s?e*.55:c?e*1:e*.4,capCol:d?Zp(16722902):s?Zp(1316896):c?V:Zp(10132120)}}),um(ee,o,t=>{if(e>0&&o.pitTaper[t]>.02)return null;let n=e>0?o.leftWall[t]:o.rightWall[t];return e>0?[n-1.8,n,.06,0]:[-n,-n+1.8,.06,0]});if(fe(Ce,_.deco,`walls`,!0,!0),i.snowbanks){let e=new Qp,t=[Zp(16251903),Zp(14149366),Zp(15660283)];for(let n of[1,-1])for(let r=0;r<v;r++){let i=(r+1)%v;if(n>0&&(o.pitTaper[r]>.02||o.pitTaper[i]>.02))continue;let a=n>0?o.leftWall[r]:o.rightWall[r],s=n>0?o.leftWall[i]:o.rightWall[i],c=n*(a+.2),l=n*(a+5.2),u=n*(s+.2),d=n*(s+5.2),f=t[(r>>2)%3];e.quad(lm(o,r,c,1.55),lm(o,i,u,1.55),lm(o,i,d,.05),lm(o,r,l,.05),f),e.quad(lm(o,r,c,.02),lm(o,r,c,1.55),lm(o,i,u,1.55),lm(o,i,u,.02),t[0])}fe(e,_.deco,`snowbanks`,!0,!0)}{let e=[];for(let n=0;n<v;n+=1){if(!o.kerb[n]||o.runoff[n]<8)continue;let r=o.kappaS[n]>0?-1:1;if(r>0&&o.pitTaper[n]>.02)continue;let i=r>0?o.leftWall[n]:o.rightWall[n];for(let a=0;a<2;a++){let s=(n+1)%v,c=a*.5,l=t(o.px[n]+o.nx[n]*r*(i-.6),o.px[s]+o.nx[s]*r*(i-.6),c),u=t(o.pz[n]+o.nz[n]*r*(i-.6),o.pz[s]+o.nz[s]*r*(i-.6),c);e.push([l,t(o.py[n],o.py[s],c),u,n*2+a])}}let n=new Xi(R(new _a(.58,.58,.5,8)),_.tire,e.length*3),r=new Ln,i=new q,s=[16119285,15083039,2763312,2763312];e.forEach(([e,t,a,o],c)=>{for(let l=0;l<3;l++)r.makeTranslation(e,t+.25+l*.5,a),n.setMatrixAt(c*3+l,r),n.setColorAt(c*3+l,i.setHex(s[(o+l)%4]))}),n.frustumCulled=!1,n.castShadow=!0,n.receiveShadow=!0,a.add(n)}let U=new Qp,Ee=[15223370,3899350,15913034,16250871,4899450,10181078,16751164,2961210,16736162,3526864],De=[15845792,14262899,11038794,8014381],Oe=[],ke=[];{let e=o.halfAt(0),t=o.thetaAt(0),n=7173248;for(let r of[1,-1]){let i=o.at(0,r*(e+2.5));U.box(i.x,i.y+5,i.z,1.6,10,1.6,t,n)}let r=o.at(0,0);U.box(r.x,r.y+9.4,r.z,(e+2.5)*2+1.6,2.6,1.8,t,n),U.box(r.x,r.y+7.9,r.z,(e+2.5)*2,.5,1.2,t,15921906);for(let e=0;e<5;e++){let n=(e-2)*3,r=o.at(-1,n);U.box(r.x,r.y+9.6,r.z,2.6,2.2,.4,t,1842982);let i=R(new ka(1.7,1.7)),s=R(new Ei({color:3804170,fog:!1})),c=new Ri(i,s);c.position.set(r.x,r.y+9.6,r.z),c.rotation.y=t+Math.PI;let l=new K(Math.sin(t),0,Math.cos(t));c.position.addScaledVector(l,-.22),a.add(c),p.push(s)}}function Me(e,t,n,r,i){let a=1.15,s=o.at(e,t),c=o.thetaAt(e),l=Math.cos(c),u=-Math.sin(c),d=Math.sin(c),f=Math.cos(c),p=r*2;if(!le(`stand`,s.x+l*(p/2+1)*i,s.z+u*(p/2+1)*i,p+5,n+3,c))return!1;s.y=L.hi,ue(U,s.x+l*(p/2+.5)*i,s.z+u*(p/2+.5)*i,p+5,n+3,c,9277593);let m=(e,t,n)=>[s.x+l*e*i+d*n,s.y+t,s.z+u*e*i+f*n];for(let e=0;e<r;e++){let t=e*2;U.box(s.x+l*(t+1)*i,s.y+(e+1)*a/2,s.z+u*(t+1)*i,2,(e+1)*a,n,c,e&1?12106434:10922160,48);for(let r=.5;r<n-.5;r+=1.05){if(D()<.07)continue;let i=m(t+1,(e+1)*a,r-n/2);Oe.push([i[0],i[1],i[2],c,D()<.5?Ee[Math.floor(D()*Ee.length)]:Ee[(Math.floor(r/6)+e)%Ee.length],De[Math.floor(D()*De.length)]])}}let h=r*2,g=r*a+3.2,_=h*.4,v=h-_/2+1.2;U.box(s.x+l*v*i,s.y+g,s.z+u*v*i,_+2.6,.5,n+2,c,15658738),U.box(s.x+l*v*i,s.y+g+.4,s.z+u*v*i,_+2.6,.3,n+2.2,c,2912224,0);for(let e of[-n/2+1,0,n/2-1])U.box(s.x+l*(h+.5)*i+d*e,s.y+g/2,s.z+u*(h+.5)*i+f*e,.5,g,.5,c,5593702);for(let e=-n/2+4;e<n/2-4;e+=8){let t=Cd[Math.floor(D()*Cd.length)];U.box(s.x+l*-.3*i+d*e,s.y+1.6,s.z+u*-.3*i+f*e,.3,1.3,7,c,t.c1),U.box(s.x+l*-.35*i+d*e,s.y+1.6,s.z+u*-.35*i+f*e,.3,.4,7,c,t.c2)}let y=s.x+h/2*l*i,b=s.z+h/2*u*i;P(y,s.y,b,h+3,n+2,c,1.4),ie(y,b,n/2+h);for(let e=-n/2+3;e<n/2;e+=14)ke.push([s.x+l*(h+1.2)*i+d*e,s.y+g+.5,s.z+u*(h+1.2)*i+f*e,c,D()]);return!0}Me(-30,-(o.halfAt(0)+18),140,7,-1),Me(60,-(o.halfAt(0)+18),70,5,-1);for(let[e,t,n]of[[600,1,60],[1470,-1,50]]){let r=Math.floor(e/o.ds)%v;for(let i of[14,20,28,40])if(Me(e,t*((t>0?o.leftWall[r]:o.rightWall[r])+i),n,4,t))break}{let e=o.halfAt(0),t=e+19,n=o.at(-10,t+9),r=o.thetaAt(0);ae.push({kind:`pitbuilding`,x:n.x,z:n.z,w:20,l:217,yaw:r,exempt:!0}),U.box(n.x,n.y+3,n.z,18,6,215,r,15790320),U.box(n.x,n.y+6.3,n.z,20,.6,217,r,3817808),P(n.x,n.y,n.z,20,217,r,2),ie(n.x,n.z,120);let i=o.at(-10,t+12);U.box(i.x,i.y+9.5,i.z,12,5,40,r,14541546),U.box(i.x,i.y+10,i.z,12.2,1.6,40.2,r,1911610),U.box(i.x,i.y+12.4,i.z,13,.5,42,r,4871528),U.box(i.x,i.y+12.8,i.z,13.2,.3,4,r,15083039),Cd.forEach((n,i)=>{let a=o.boxU(i),s=o.at(a,t-.15);U.box(s.x,s.y+1.9,s.z,.4,3.8,11.5,r,1316380),U.box(s.x,s.y+4.2,s.z,.5,.9,11.5,r,n.c1),U.box(s.x,s.y+4.9,s.z,.55,.3,11.5,r,n.c2);let c=o.at(a,e+12.5);U.box(c.x,c.y+.4,c.z,1.4,.8,1.4,r,n.c1);let l=o.at(a,t+9);U.box(l.x,l.y+7.2,l.z,3,1.4,4,r,12173e3),U.box(l.x,l.y+8.1,l.z,1.2,.4,1.2,r,n.c2),ke.push([o.at(a,t-1).x,o.at(a,t-1).y+6.6,o.at(a,t-1).z,r,i/10])});for(let e=0;e<7;e++){let n=-80+e*38,i=o.at(n,t+32+e%2*8),a=Cd[e%Cd.length];le(`tent`,i.x,i.z,10,15,r)&&(i.y=L.hi,ue(U,i.x,i.z,10,15,r,14343651),U.box(i.x,i.y+1.6,i.z,9,3.2,14,r,16053492),U.box(i.x,i.y+3.5,i.z,10,.8,15,r,a.c1),P(i.x,i.y,i.z,9,14,r,1.3))}let a=o.at(150,t+13);ae.push({kind:`tower`,x:a.x,z:a.z,w:9,l:9,yaw:r,exempt:!0}),U.box(a.x,a.y+10,a.z,5,20,5,r,14343910),U.box(a.x,a.y+21,a.z,8,3.2,8,r,1911610),U.box(a.x,a.y+23,a.z,9,.7,9,r,15083039),P(a.x,a.y,a.z,8,8,r,1.4)}{let e=-1,t=0;for(let t=0;t<v;t++)if(o.sectionName(t)===`Citadel Squeeze`){e=t;break}if(e>=0){for(let n=e;n<v;n++)if(o.sectionName(n)!==`Citadel Squeeze`){t=n;break}let n=e*o.ds+18,r=o.thetaAt(n),i=o.halfAt(n)+1.1,a=i+2.5;for(let e of[1,-1])for(let t of[3.2,4.5,6,8,11]){let s=Math.max(e>0?o.leftWall[Math.floor(n/o.ds)%v]:o.rightWall[Math.floor(n/o.ds)%v],i)+t,c=o.at(n,e*s);if(le(`gatehouse`,c.x,c.z,5,5,r)){a=Math.max(a,s),c.y=L.hi,ue(U,c.x,c.z,5,5,r,Te[1]),U.box(c.x,c.y+6,c.z,5,12,5,r,Te[0]);for(let e=-1;e<=1;e+=2)for(let t=-1;t<=1;t+=2)U.box(c.x+Math.cos(r)*e*1.9+Math.sin(r)*t*1.9,c.y+12.6,c.z-Math.sin(r)*e*1.9+Math.cos(r)*t*1.9,1.1,1.2,1.1,r,Te[2]);break}}let s=o.at(n,0);U.box(s.x,s.y+10.6,s.z,a*2,2.4,4.4,r,Te[1]),U.box(s.x,s.y+12.1,s.z,a*2,.7,4.8,r,Te[3]);let c=Math.floor((e+t)/2),l=null;for(let e=-140;e<=140;e+=8)for(let t=-140;t<=140;t+=8){let n=o.px[c]+e,r=o.pz[c]+t,i=o.clearance(n,r),a=i-Math.hypot(e,t)*.08;i>=24&&(!l||a>l.score)&&(l={x:n,z:r,c:i,score:a})}if(l&&le(`keep`,l.x,l.z,30,30,0)){let e={x:l.x,y:L.hi,z:l.z};ue(U,e.x,e.z,30,30,0,Te[3]),U.box(e.x,e.y+8,e.z,22,16,22,0,Te[0]),U.box(e.x,e.y+16.4,e.z,24,.8,24,0,Te[2]),P(e.x,e.y,e.z,24,24,0,3),ie(e.x,e.z,36);for(let[t,n]of[[-1,-1],[-1,1],[1,-1],[1,1]]){let r=e.x+t*12,i=e.z+n*12;U.box(r,e.y+11,i,6,22,6,Math.PI/4,Te[1]),U.box(r,e.y+22.5,i,7,1.2,7,Math.PI/4,Te[3]),U.box(r,e.y+24.2,i,1.2,2.2,1.2,0,11550768),ke.push([r,e.y+25.3,i,0,.05])}for(let t=-9;t<=9;t+=3)for(let n of[-1,1])U.box(e.x+n*11.6,e.y+17.4,e.z+t,1.4,1.4,1.4,0,Te[3]),U.box(e.x+t,e.y+17.4,e.z+n*11.6,1.4,1.4,1.4,0,Te[3]);for(let t=0;t<12;t++){let n=t/12*Math.PI*2,r=e.x+Math.cos(n)*26,i=e.z+Math.sin(n)*26,a=-n;if(!le(`wallseg`,r,i,3,9,a))continue;let o=L.hi,s=3+t%3*1.2,c=o-L.lo+.8;U.box(r,o+s/2-c/2,i,3,s+c,9,a,Te[t%4])}}}}for(let e=0;e<11;e++){let t=(e+.5)/11*y,n=Math.floor(t/o.ds)%v;if(o.pitTaper[n]>.02||t<330&&t>y-260)continue;let r=o.kappaS[n]>0?-1:1,i=(r>0?o.leftWall[n]:o.rightWall[n])+5.2;if(r>0&&o.pitTaper[n]>.02)continue;let a=o.at(t,r*i),s=o.thetaAt(t);le(`marshal`,a.x,a.z,7,4,s)&&(a.y=L.hi,ue(U,a.x,a.z,7,4,s,14343651),U.box(a.x,a.y+1.1,a.z,2.4,2.2,2.2,s,16250871),U.box(a.x,a.y+2.35,a.z,3,.4,2.8,s,16742938),U.box(a.x-Math.cos(s)*r*2.2,a.y+.9,a.z+Math.sin(s)*r*2.2,.5,1.8,.5,s,16742938),U.box(a.x-Math.cos(s)*r*2.2,a.y+2.05,a.z+Math.sin(s)*r*2.2,.45,.45,.45,s,15845792),U.box(a.x-Math.cos(s)*r*2.9,a.y+1.7,a.z+Math.sin(s)*r*2.9,.3,.3,1.6,s,5593702),U.box(a.x-Math.cos(s)*r*2.9,a.y+2.3,a.z+Math.sin(s)*r*2.9,.3,.9,.9,s,16765471),P(a.x,a.y,a.z,2.4,2.2,s,.8),ie(a.x,a.z,5))}let Ne=[];{let e=0;for(let t=0;t<26&&e<16;t++){let n=(t+.3)*(y/26),r=Math.floor(n/o.ds)%v;if(o.pitTaper[r]>.02||o.runoff[r]<6)continue;let i=t&1?1:-1;if(i>0&&o.pitTaper[r]>.02)continue;let a=(i>0?o.leftWall[r]:o.rightWall[r])+5.5,s=o.at(n,i*a),c=o.thetaAt(n);if(!re(s.x,s.z,8))continue;let l=4.8,u=3.6;if(!le(`billboard`,s.x,s.z,2,16,c))continue;s.y=L.hi,ue(U,s.x,s.z,2,16,c,5593702),U.box(s.x,s.y+u+l/2,s.z,.5,5.6,15.8,c,2106155);let d=[Math.sin(c),Math.cos(c)];for(let e of[-1,1])U.box(s.x+d[0]*e*(15/2-1.2),s.y+u/2,s.z+d[1]*e*(15/2-1.2),.6,u,.6,c,5593702);Ne.push({x:s.x,y:s.y+u+l/2,z:s.z,ry:c+(i>0?-Math.PI/2:Math.PI/2),w:15,h:l,id:e}),P(s.x,s.y,s.z,.6,15,c,.8),ie(s.x,s.z,10),e++}}let Pe=[];if(i.buildings===`block`){let e=[2765124,1844278,3420234,2371652,3811904],t=[16722902,2617599,11992892,16769354,16734780];for(let n=0,r=0;n<56&&r<18;n++){let i=(n+.37)*(y/56)%y,a=Math.floor(i/o.ds)%v;if(o.pitTaper[a]>.04||o.runoff[a]>11)continue;let s=n%3==0?1:-1;if(s>0&&o.pitTaper[a]>.02)continue;let c=(s>0?o.leftWall[a]:o.rightWall[a])+7.5,l=o.at(i,s*c),u=o.thetaAt(i),d=11+n%4*3,f=7+n%5*2.4;re(l.x,l.z,6)&&le(`block`,l.x,l.z,10,d+1,u)&&(l.y=L.hi,ue(U,l.x,l.z,9,d,u,1711656),U.box(l.x,l.y+f/2,l.z,9,f,d,u,e[n%e.length]),U.box(l.x,l.y+f+.35,l.z,9.5,.7,d+.5,u,1185052),P(l.x,l.y,l.z,9,d,u,1.1),ie(l.x,l.z,Math.max(d,9)*.55),Pe.push([l.x,l.y+f*.72,l.z,u,9.35,.42,d*.82,t[n%t.length]]),Pe.push([l.x,l.y+1.5,l.z,u,9.25,.32,d*.66,t[(n+2)%t.length]]),r++)}}if(fe(U,_.deco,`props`,!0,!0),Pe.length){let e=new Xi(om,R(new Ei({toneMapped:!1})),Pe.length),t=new q;Pe.forEach(([n,r,i,a,o,s,c,l],u)=>{e.setMatrixAt(u,$p.compose(tm.set(n,r,i),em.setFromEuler(rm.set(0,a,0)),nm.set(o,s,c))),e.setColorAt(u,t.setHex(l))}),e.frustumCulled=!1,e.name=`neon`,a.add(e)}for(let e of Ne){let t=R(cm(e.id)),n=R(i.neon?new Ei({map:t,toneMapped:!1}):new Ua({map:t})),r=R(new ka(e.w,e.h));for(let t of[0,1]){let i=new Ri(r,n);i.position.set(e.x,e.y,e.z),i.rotation.y=e.ry+(t?Math.PI:0),i.translateZ(.3),i.castShadow=!1,i.receiveShadow=!0,a.add(i)}}{let e=new Xi(R(new ha(.62,.95,.5).translate(0,.47,0)),R(new Ua({flatShading:!0})),Oe.length),t=new Xi(R(new ha(.4,.4,.4).translate(0,1.15,0)),R(new Ua({flatShading:!0})),Oe.length),n=new Ln,r=new pn,i=new K(1,1,1),o=new K,s=new K(0,1,0),c=new q;Oe.forEach(([a,l,u,d,f,p],m)=>{n.compose(o.set(a,l,u),r.setFromAxisAngle(s,d),i),e.setMatrixAt(m,n),t.setMatrixAt(m,n),e.setColorAt(m,c.setHex(f)),t.setColorAt(m,c.setHex(p))});for(let n of[e,t])n.frustumCulled=!1,n.castShadow=!0,n.receiveShadow=!0,a.add(n)}{for(let e=-90;e<150;e+=30){let t=o.at(e,-(o.halfAt(e)+o.runR[Math.floor((e%y+y)%y/o.ds)%v]+3.6));le(`flag`,t.x,t.z,null,1.2)&&ke.push([t.x,ve(t.x,t.z),t.z,o.thetaAt(e),D()])}let e=R(new ha(.4,9,.4).translate(0,4.5,0)),t=R(new ha(2.2,1.3,.25).translate(1.1,0,0)),n=new Xi(e,R(new Ua({color:14212066,flatShading:!0})),ke.length);O=new Xi(t,R(new Ua({flatShading:!0,side:2})),ke.length);let r=new Ln,i=new q,s=[15083039,16765471,2912224,16777215,3523690,16742938];k=ke.map(([e,t,a,o,c],l)=>(n.setMatrixAt(l,r.makeTranslation(e,t,a)),O.setColorAt(l,i.setHex(s[Math.floor(c*997)%s.length])),{x:e,y:t+7.9,z:a,yaw:o+Math.PI/2,ph:c*6.28})),n.frustumCulled=!1,O.frustumCulled=!1,n.castShadow=!0,O.castShadow=!0,a.add(n,O)}let Fe=(e,t)=>{if(t&&o.clearance(t[0],t[1])>=e+oe&&re(t[0],t[1],e))return t;let n=0,r=0;for(let e=0;e<v;e++)n+=o.px[e],r+=o.pz[e];n/=v,r/=v;let a=null;for(let t=-300;t<=300;t+=10)for(let s=-300;s<=300;s+=10){let c=n+t,l=r+s,u=o.clearance(c,l);if(u<e+oe+2||!re(c,l,e)||i.sea&&i.sea.mask(c,l)>.05)continue;let d=-Math.abs(u-e-12)-Math.hypot(t,s)*.05;(!a||d>a.sc)&&(a={x:c,z:l,sc:d})}return a&&[a.x,a.z]};if(i.landmark===`ferris`){let e=Fe(35,[55,135])||[55,135],t=e[0],n=e[1],r=ge(t,n,{}),i=r+27+6;le(`ferris`,t,n,null,35),A=new dr,A.position.set(t,0,n),A.rotation.y=.55;let o=[],s=[],c=(e,t,n)=>new K(e,t,n);for(let e of[-1.4,1.4]){for(let t=0;t<24;t++){let n=t/24*Math.PI*2,r=(t+1)/24*Math.PI*2;o.push(am(c(Math.cos(n)*27,Math.sin(n)*27,e),c(Math.cos(r)*27,Math.sin(r)*27,e),.7,t&1?16250871:15083039)),o.push(am(c(Math.cos(n)*27*.55,Math.sin(n)*27*.55,e),c(Math.cos(r)*27*.55,Math.sin(r)*27*.55,e),.45,16765471))}for(let t=0;t<12;t++){let n=t/12*Math.PI*2;o.push(am(c(0,0,e),c(Math.cos(n)*27,Math.sin(n)*27,e),.4,16250871))}}o.push(am(c(0,0,-2.2),c(0,0,2.2),2.2,16765471));let l=new Ri(R(Ud(o)),R(new Ua({vertexColors:!0,flatShading:!0})));l.position.y=i,l.castShadow=!0,l.receiveShadow=!1,l.frustumCulled=!1,A.add(l),A.userData.wheel=l;for(let e of[-3.2,3.2])s.push(am(c(0,i,e*.7),c(-27*.55,r-.2,e*2.2),.9,2912224),am(c(0,i,e*.7),c(27*.55,r-.2,e*2.2),.9,2912224));s.push(am(c(-27*.55,r+.6,-7),c(-27*.55,r+.6,7),1,5593702),am(c(27*.55,r+.6,-7),c(27*.55,r+.6,7),1,5593702));let u=new Ri(R(Ud(s)),l.material);u.castShadow=!0,u.receiveShadow=!0,u.frustumCulled=!1,A.add(u);let d=Ud([im(om,0,0,0,16777215,0,2.8,2,2.4),im(om,0,1.25,0,2238513,0,3.2,.5,2.8)]);j=new Xi(R(d),R(new Ua({flatShading:!0,vertexColors:!0})),16);let f=[15083039,16765471,2912224,3523690,16742938,16736162],p=new q;for(let e=0;e<16;e++)j.setColorAt(e,p.setHex(f[e%f.length]));j.userData={hubY:i,Rw:27,NG:16,rot:0},j.frustumCulled=!1,j.castShadow=!0,A.add(j),a.add(A),ie(t,n,45),P(t,r,n,3.8,18,.55+Math.PI/2,1.5),P(t,r,n,32,12,.55,2);let m=new Qp;for(let e=0;e<5;e++){let r=t+Math.cos(e*1.3)*30+6,i=n+18+Math.sin(e*1.3)*10+e*3,a=ge(r,i,{});le(`stall`,r,i,null,3.5)&&(m.box(r,a+1.3,i,4,2.6,3,e,[15083039,16765471,2912224,3523690,16742938][e]),m.box(r,a+2.9,i,4.8,.5,3.8,e,16250871),P(r,a,i,4,3,e,.8))}fe(m,_.deco,`stalls`,!0,!0)}if(i.landmark===`lighthouse`){let e=Fe(12,i.lighthouseAt),t=new Qp;if(e&&le(`lighthouse`,e[0],e[1],null,12)){let[n,r]=e,o=L.hi,s=[];for(let e=0;e<6;e++)s.push(im(new _a(3.4-e*.22,3.6-e*.22,34/6,10),n,o+(e+.5)*(34/6),r,e&1?15083039:16250871));s.push(im(new _a(3.4,3.4,.8,10),n,o+34+.4,r,2764086)),s.push(im(new _a(2.2,2.2,3,8),n,o+34+2.3,r,16773288)),s.push(im(new va(2.8,2.6,8),n,o+34+5.1,r,2764086));let c=new Ri(R(Ud(s)),R(new Ua({vertexColors:!0,flatShading:!0})));c.castShadow=!0,c.receiveShadow=!0,c.frustumCulled=!1,a.add(c),t.box(n+8,o+2,r+2,7,4,9,.3,15921126),t.box(n+8,o+4.6,r+2,8,1.2,10,.3,3824266),fe(t,_.deco,`cottage`,!0,!0);let l=new Ri(R(new va(4,60,6,1,!0).translate(0,-30,0).rotateZ(Math.PI/2)),R(new Ei({color:16774336,transparent:!0,opacity:i.night?.22:.07,depthWrite:!1,side:2,fog:!1})));l.position.set(n,o+34+2.3,r),l.frustumCulled=!1,a.add(l),A=null,a.userData.beacon=l,P(n,o,r,8,8,0,2),ie(n,r,22)}}if(i.landmark===`lodge`){let e=Fe(14,i.lodgeAt);if(e&&le(`lodge`,e[0],e[1],16,22,.4)){let[t,n]=e,r=L.hi,i=new Qp;i.box(t,r+2.2,n,14,4.4,18,.4,7027236),i.box(t,r+5.1,n,16.4,1.5,20.4,.4,16054267),i.box(t,r+5.9,n,15,.35,19,.4,14017264),i.box(t+5,r+7.4,n-3,2.1,3.6,2.1,.4,4860444),i.box(t+5,r+9.5,n-3,2.6,.55,2.6,.4,2763310),i.box(t-2.2,r+3.1,n+9.1,2.4,1.8,.35,.4,16765562),i.box(t+2.4,r+3.1,n+9.1,2.4,1.8,.35,.4,16765562),fe(i,_.deco,`lodge`,!0,!0),P(t,r,n,16,20,.4,2),ie(t,n,18)}}if(i.landmark===`tower`){let e=Fe(8,i.towerAt);if(e&&le(`tower`,e[0],e[1],null,7)){let[t,n]=e,r=L.hi,i=new Qp;for(let e=0;e<4;e++)i.box(t+(e<2?-1:1)*1.3,r+7,n+(e%2?-1:1)*1.3,.45,14,.45,0,4863012);i.box(t,r+14.6,n,5.6,.45,5.6,.2,3811872),i.box(t,r+16.4,n,4.4,2.8,4.4,.2,6964786),i.box(t,r+18.4,n,6.2,.55,6.2,.2,1454626),i.box(t,r+15.2,n+2.3,1.1,1.3,.2,.2,13164704),fe(i,_.deco,`tower`,!0,!0),P(t,r,n,6,6,0,1.2),ie(t,n,10)}}if(i.landmark===`arch`){let e=Fe(12,i.archAt),t=.3;if(e&&le(`arch`,e[0],e[1],8,22,t)){let[n,r]=e,i=L.hi,o=new Qp,s=Math.sin(t),c=Math.cos(t);for(let e of[-1,1]){let a=n+s*e*8,l=r+c*e*8;o.box(a,i+8,l,2.2,16,2.2,t,1447970),o.box(a,i+16.5,l,2.8,1.1,2.8,t,16722902)}o.box(n,i+15.2,r,1.6,1.3,18.2,t,1184796),fe(o,_.deco,`arch`,!0,!0);let l=new Ri(R(new ha(1.1,.55,16)),R(new Ei({color:2617599,toneMapped:!1})));l.position.set(n,i+15.2,r),l.rotation.y=t,l.frustumCulled=!1,l.name=`archglow`,a.add(l),P(n,i,r,6,16,t,1.4),ie(n,r,14)}}{let e=i.trees===`desert`?[[5212730,6134340,4160052,6987850],[9075258,10127944,7301684,11049560]]:i.trees===`coastal`?[[3119674,4175940,5820236,2326586],[5221962,7127642,3116868,9097322],[4171872,3119674,6275184,2064448]]:i.trees===`alpine`?[[1862456,3050054,1332012,3971669],[2383412,1723948,3111488,1457958]]:i.trees===`forest`?[[1326626,1858096,995352,2386744],[1722920,1193500,2779704,796692],[1987120,1459240,2910272,1058840]]:i.trees===`street`?[[3115588,3844696,2058804,4636776]]:[[3119674,4175940,5820236,2326586],[4175940,8116554,13229626,3119674],[15911216,16243786,13229626,15247402],[15761450,14702122,16097850,15911216],[3119674,15911216,15761450,5820236]],t=[],n=(e,n,r,a)=>{if(e<-730||e>810||n<-490||n>970||!re(e,n,3)||_e(e,n)<7)return!1;let o=ge(e,n,he);if(o>(i.treeMaxH??26)||i.sea&&o<i.sea.level+1.2)return!1;let s=(.8+D()*1.1)*(i.treeScale||1);return le(`tree`,e,n,null,2.6*s)?(t.push({x:e,y:o,z:n,s,kind:r,col:a[Math.floor(D()*a.length)],yaw:D()*6.28}),!0):!1},r=(t,r)=>{let a=e[Math.floor(D()*e.length)],o=i.trees===`desert`||i.trees===`street`,s=(o?14:6)+D()*12,c=o?4+Math.floor(D()*7):14+Math.floor(D()*(i.trees===`forest`?26:32)),l=D()<(i.trees===`alpine`||i.trees===`forest`?.84:i.trees===`street`?.12:.5),u=0;for(let e=0;e<c*2&&u<c;e++){let e=D()*6.28,i=Math.sqrt(D())*s;n(t+Math.cos(e)*i,r+Math.sin(e)*i,D()<(l?.8:.25)?0:1,a)&&u++}return u},s=i.treeNear??130,c=i.treeFar??60;for(let e=0,t=0;e<1500&&t<s;e++){let e=Math.floor(D()*v),n=D()<.5?1:-1,i=n*((n>0?o.leftWall[e]:o.rightWall[e])+11+D()*55),a=o.px[e]+o.nx[e]*i,s=o.pz[e]+o.nz[e]*i;!re(a,s,4)||_e(a,s)<9||r(a,s)&&t++}for(let e=0,t=0;e<900&&t<c;e++){let e=-710+D()*1500,n=-470+D()*1420;!re(e,n,4)||_e(e,n)<9||r(e,n)&&t++}let l=Ud([im(new va(2.5,5,6),0,4.2,0,16777215),im(new va(1.9,4.2,6),0,7,0,16777215)]),u=Ud([im(new Oa(2.5,0),0,5.2,0,16777215,0,1,.9,1),im(new Oa(1.7,0),1.3,4.2,.7,16777215)]),d=new _a(.35,.5,2.8,5).translate(0,1.4,0),f=d,p=null,m=e=>(e.deleteAttribute(`uv`),e);if(i.trees===`desert`)l=Ud([im(new _a(.75,.85,7,6),0,3.5,0,16777215),im(new _a(.5,.5,2.6,6),1.5,3.6,0,16777215),im(new _a(.45,.5,1.6,6),.9,2.5,0,16777215,0,1.8,.4,.9),im(new _a(.45,.45,2.2,6),-1.4,4.4,0,16777215),im(new _a(.4,.45,1.4,6),-.8,3.5,0,16777215,0,1.6,.4,.9)]),u=Ud([im(new Oa(1.6,0),0,.9,0,16777215,0,1.3,.6,1.2),im(new Oa(1.1,0),1.2,.7,.6,16777215,0,1,.6,1)]),d=f=new _a(.01,.01,.01,3);else if(i.trees===`coastal`){let e=[];for(let t=0;t<4;t++){let n=t/4*Math.PI*2+.4;e.push(im(om,Math.cos(n)*1.8,8.4,Math.sin(n)*1.8,16777215,-n,3.6,.3,1.1))}l=Ud([...e,im(new va(.7,1.25,5),0,8.9,0,16777215)]),d=Ud([m(new _a(.26,.42,5,4).translate(0,2.5,0)),m(new _a(.2,.28,3.2,4).translate(.38,6.3,0))]),f=m(new _a(.22,.36,1.4,4).translate(0,.7,0))}else i.trees===`alpine`&&(p=im(new va(1.15,1.55,5),0,8.55,0,16777215));let h=new ga(2.8,8).rotateX(-Math.PI/2),g=[{g:l,trunk:d},{g:u,trunk:f}],y=new Ln,b=new pn,x=new K,S=new K,C=new K(0,1,0),w=new q;if(g.forEach((e,n)=>{let r=t.filter(e=>e.kind===n),i=new Xi(R(e.g),_.foliage,r.length||1),o=new Xi(R(e.trunk),_.trunk,r.length||1),s=new Xi(R(h),_.aoInst,r.length||1);r.forEach((e,t)=>{y.compose(x.set(e.x,e.y,e.z),b.setFromAxisAngle(C,e.yaw),S.set(e.s,e.s*(.9+t%5*.06),e.s)),i.setMatrixAt(t,y),o.setMatrixAt(t,y),i.setColorAt(t,w.setHex(e.col).offsetHSL(0,0,(D()-.5)*.06)),y.compose(x.set(e.x+.8*e.s,e.y+.18,e.z+.6*e.s),b.identity(),S.set(e.s,1,e.s)),s.setMatrixAt(t,y)}),i.count=o.count=s.count=r.length;for(let e of[i,o])e.frustumCulled=!1,e.castShadow=!0,e.receiveShadow=!0,a.add(e);s.frustumCulled=!1,s.renderOrder=1,a.add(s),e.meshes=[i,o],e.n=r.length}),p){let e=t.filter(e=>e.kind===0),n=new Xi(R(p),R(new Ua({color:16054524,flatShading:!0})),e.length||1);e.forEach((e,t)=>{y.compose(x.set(e.x,e.y,e.z),b.setFromAxisAngle(C,e.yaw),S.set(e.s,e.s,e.s)),n.setMatrixAt(t,y)}),n.count=e.length,n.frustumCulled=!1,n.castShadow=!0,n.receiveShadow=!0,a.add(n)}a.userData.trees=g}if(fe(ee,_.ao,`ao`,!1,!1).renderOrder=1,i.clouds){let e=new Qp;for(let t=0;t<16;t++){let t=(D()-.5)*1200+50,n=(D()-.5)*1e3+220,r=230+D()*90;for(let i=0;i<4;i++)e.box(t+(D()-.5)*50,r+(D()-.5)*6,n+(D()-.5)*30,25+D()*30,7+D()*5,18+D()*12,D()*3,i===0?16777215:15791354)}u=new Ri(R(e.geometry()),_.cloud),u.frustumCulled=!1,a.add(u)}if(i.sea&&(i.sea.color=new q(i.sea.water),S=new Ri(R(new ka(4e3,4e3).rotateX(-Math.PI/2)),R(new Ha({color:i.sea.color,specular:6719658,shininess:60,flatShading:!0}))),S.position.y=i.sea.level,S.receiveShadow=!0,S.frustumCulled=!1,S.name=`sea`,a.add(S)),i.night){let e=[],t=[];for(let n=0;n<700;n++){let n=D()*2-1,r=D()*Math.PI*2,i=Math.abs(n)*.9+.08,a=Math.sqrt(1-i*i);e.push(Math.cos(r)*a*900,i*900,Math.sin(r)*a*900);let o=.55+D()*.45;t.push(o,o,o*(.9+D()*.1))}let n=R(new mi);n.setAttribute(`position`,new ni(e,3)),n.setAttribute(`color`,new ni(t,3)),C=new ca(n,R(new ra({size:2,sizeAttenuation:!1,vertexColors:!0,fog:!1,depthWrite:!1}))),C.frustumCulled=!1,C.renderOrder=-9,a.add(C);let r=new Qp,i=[];for(let e=0,t=0;e<60&&t<34;e++){let n=(e+.5)*(y/60),a=Math.floor(n/o.ds)%v,s=e&1?1:-1;if(s>0&&o.pitTaper[a]>.02)continue;let c=(s>0?o.leftWall[a]:o.rightWall[a])+4,l=o.at(n,s*c),u=o.thetaAt(n);if(!re(l.x,l.z,2)||!le(`floodlight`,l.x,l.z,null,1.2))continue;let d=L.hi;r.box(l.x,d+9,l.z,.6,18,.6,u,7173248),r.box(l.x-Math.cos(u)*s*.6,d+18,l.z+Math.sin(u)*s*.6,.7,1.6,4.2,u,2764086),i.push([l.x-Math.cos(u)*s*1,d+18,l.z+Math.sin(u)*s*1,u]),ie(l.x,l.z,3),t++}fe(r,_.deco,`floodmasts`,!0,!0),w=new Xi(om,R(new Ei({color:16774872,fog:!1})),Math.max(1,i.length));let s=new Ln;i.forEach(([e,t,n,r],i)=>w.setMatrixAt(i,s.compose(tm.set(e,t,n),em.setFromEuler(rm.set(0,r,0)),nm.set(.3,1.2,3.8)))),w.count=i.length,w.frustumCulled=!1,a.add(w)}M=new Xi(R(new Aa(.45,1,4,1).rotateX(-Math.PI/2)),R(new Ei({color:15135487,transparent:!0,opacity:.8,depthWrite:!1,fog:!1})),320),M.frustumCulled=!1,M.visible=!1,M.count=0,M.userData.max=320;for(let e=0;e<320;e++)N.push({x:0,y:-999,z:0,age:D(),life:.35+D()*.3,size:.3+D()*.4});if(a.add(M),i.rainParticles){T=new Xi(R(new ha(.07,1.5,.07)),R(new Ei({color:14018294,transparent:!0,opacity:.5,depthWrite:!1})),180),T.frustumCulled=!1,T.count=180,T.name=`rainbits`;for(let e=0;e<180;e++)E.push({x:0,y:-999,z:0,v:16+D()*14,age:1});a.add(T)}s.add(a),Ae(g);let Ie=R(new Wa),Le=R(new Wa);a.traverse(e=>{e.isInstancedMesh&&e.castShadow&&(e.customDepthMaterial=e.instanceColor?Le:Ie)}),je(b)}function z(e){for(let e of[F,ee,P])e&&(a.remove(e),e.geometry.dispose?.());te=e.filter(Boolean);let t=te.length,n=[],r=[],i=4.2;for(let e=0;e<5;e++){let t=e/5*22,a=(e+1)/5*22,o=.7+t/22*i,s=.7+a/22*i,c=(1-e/5)**1.5,l=(1-(e+1)/5)**1.5,u=[-o,0,t],d=[o,0,t],f=[s,0,a],p=[-s,0,a];for(let[e,t]of[[u,c],[d,c],[f,l],[u,c],[f,l],[p,l]])n.push(e[0],e[1],e[2]),r.push(t*.32,t*.3,t*.2)}let o=new mi;o.setAttribute(`position`,new ni(n,3)),o.setAttribute(`color`,new ni(r,3)),F=new Xi(o,new Ei({vertexColors:!0,transparent:!0,blending:2,depthWrite:!1,fog:!1,side:2,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6}),t),F.frustumCulled=!1,F.visible=!1,F.renderOrder=2,ee=new Xi(om,new Ei({color:16774336,fog:!1}),t*2),P=new Xi(om,new Ei({color:16722458,fog:!1}),t*2);for(let e of[ee,P])e.frustumCulled=!1,e.visible=!1;a.add(F,ee,P)}let be=new Ln,xe=new Ln;function Se(e,t){if(F.visible=ee.visible=P.visible=e,e){F.material.color.setScalar(.35+.65*t),te.forEach((e,t)=>{e.pivot.updateWorldMatrix(!0,!1);let n=e.pivot.matrixWorld;F.setMatrixAt(t,be.copy(n).multiply(xe.makeTranslation(0,.1-e.pivot.position.y,3.1)));for(let[e,r]of[[0,-.36],[1,.36]])ee.setMatrixAt(t*2+e,be.copy(n).multiply(xe.compose(tm.set(r,.62,1.15),em.identity(),nm.set(.2,.16,.12)))),P.setMatrixAt(t*2+e,be.copy(n).multiply(xe.compose(tm.set(r*.6,.55,-2.4),em.identity(),nm.set(.18,.14,.1))))});for(let e of[F,ee,P])e.instanceMatrix.needsUpdate=!0}}let B=null,Ce=null,we=null;function Te(){if(I)return;let e=Ud([im(new va(2.2,3.4,4).rotateX(Math.PI),0,1.7,0,16769354),im(om,0,5,0,16769354,0,1.5,3.2,1.5)]);Ce=new Ri(R(e),R(new Ei({vertexColors:!0,fog:!1}))),Ce.visible=!1,Ce.frustumCulled=!1,Ce.renderOrder=5,a.add(Ce);let t=Ud([im(om,0,0,5.3,16769354,0,11,.06,.6),im(om,0,0,-5.3,16769354,0,11,.06,.6),im(om,5.3,0,0,16769354,0,.6,.06,11),im(om,-5.3,0,0,16769354,0,.6,.06,11)]);we=new Ri(R(t),R(new Ei({vertexColors:!0,fog:!1}))),we.visible=!1,we.frustumCulled=!1,a.add(we);let n=(e,t)=>Ud([im(om,0,.45,0,2237741,0,.55,.9,.35),im(om,0,1.15,0,e,0,.7,.8,.4),im(om,.45,1.2,0,t,0,.2,.7,.25),im(om,-.45,1.2,0,t,0,.2,.7,.25),im(om,0,1.85,0,16053492,0,.5,.45,.5)]),r=R(new Ua({vertexColors:!0,flatShading:!0})),i=Cd[0];I={group:new dr,people:[],tires:[],jacks:[],sign:null,teamMat:r,ready:!1};for(let e=0;e<7;e++){let e=new Ri(R(n(i.c1,i.c2)),r);e.castShadow=!0,e.frustumCulled=!1,I.group.add(e),I.people.push(e)}for(let e=0;e<4;e++){let e=new Ri(R(Ud([im(new _a(.45,.45,.5,8).rotateZ(Math.PI/2),0,0,0,1710622),im(new _a(.47,.47,.12,8).rotateZ(Math.PI/2),0,0,0,16777215)])),R(new Ua({vertexColors:!0,flatShading:!0})));e.castShadow=!0,e.visible=!1,e.frustumCulled=!1,I.group.add(e),I.tires.push(e)}for(let e=0;e<2;e++){let e=new Ri(R(Ud([im(om,0,.25,0,16765471,0,.8,.5,.8),im(om,0,.9,0,5593702,0,.25,1,.25)])),R(new Ua({vertexColors:!0,flatShading:!0})));e.castShadow=!0,e.frustumCulled=!1,I.group.add(e),I.jacks.push(e)}let o=new Ri(R(Ud([im(om,0,1.4,0,5593702,0,.3,2.8,.3),im(om,0,2.9,0,16777215,0,1.3,1.3,.1)])),R(new Ei({vertexColors:!0})));o.frustumCulled=!1,I.group.add(o),I.sign=o;let s=new Ri(R(new ha(1,1,.14)),R(new Ei({color:15083039})));s.position.set(0,2.9,.07),o.add(s),I.signLamp=s,I.group.visible=!1,a.add(I.group)}function V(e){B=e}let H=new K,U=(e,t,r)=>n(e,t,r);function Ee(e,n){Te();let r=B,i=c.length,a=!1,o=!1,s=0;if(r&&r.teamIndex!=null){let e=(c.boxU(r.teamIndex)%i+i)%i,l=Math.floor(e/c.ds)%c.n,u=c.boxD(l),d=c.at(e-.6,u),f=c.thetaAt(e-.6);a=r.request&&r.stage===0||r.stage===1||r.stage===2&&!r.choice;let p=r.car?Math.hypot(r.car.group.position.x-d.x,r.car.group.position.z-d.z):99;if(o=r.stage===1&&p<70||r.stage===2||r.stage===3&&p<16,we.visible=a||o,a){Ce.position.set(d.x,d.y+3.5+Math.sin(n*5)*.9,d.z),Ce.rotation.y=n*1.8,Ce.visible=!0;let e=1+.12*Math.sin(n*5);Ce.scale.setScalar(e)}else Ce.visible=!1;we.visible&&(we.position.set(d.x,d.y+.12,d.z),we.rotation.y=f,we.scale.setScalar(1+.04*Math.sin(n*6)));let m=d.x,h=d.y,g=d.z,_=f;r.car&&r.stage===2&&(m=r.car.group.position.x,h=r.car.group.position.y,g=r.car.group.position.z,_=r.car.group.rotation.y);let y=Math.cos(_),b=Math.sin(_),x=(e,t,n)=>n.set(m+y*e+b*t,h,g-b*e+y*t);if(I.group.visible=o,o){let e=r.choice&&r.serv||0,n=U(0,.35,e)*(1-U(2.05,2.4,e));s=.42*U(.25,.6,e)*(1-U(1.95,2.35,e));let i=r.stage!==2,a=r.colors||Cd[r.teamIndex%Cd.length],o=r.teamIndex+`:`+a.c1+`:`+a.c2;I.teamKey!==o&&(I.teamKey=o,I.people.forEach(e=>{e.geometry.dispose(),e.geometry=Ud([im(om,0,.45,0,2237741,0,.55,.9,.35),im(om,0,1.15,0,a.c1,0,.7,.8,.4),im(om,.45,1.2,0,a.c2,0,.2,.7,.25),im(om,-.45,1.2,0,a.c2,0,.2,.7,.25),im(om,0,1.85,0,16053492,0,.5,.45,.5)])}));let c=[1.05,-1.05,1.15,-1.15],l=[1.9,1.9,-1.65,-1.65];for(let a=0;a<4;a++){let o=Math.sign(c[a]),s=[o*4.3,l[a]],u=[o*2.1,l[a]],d=t(s[0],u[0],n),f=t(s[1],u[1],n),p=I.people[a];x(d,f,H),p.position.copy(H),p.rotation.y=_+(o>0?-Math.PI/2:Math.PI/2),p.scale.y=1-.28*n+(n>.9?Math.sin(e*28+a)*.03:0);let m=I.tires[a],g=e<1.15?U(.6,1,e):1-U(1.2,1.7,e);m.visible=!i&&e>.6&&e<1.75,x(o*(1.1+g*1.7),l[a],H),m.position.copy(H).setY(h+.4+g*.35),m.rotation.y=_;let v=m.geometry.attributes.color,y=r.choice===`wet`?[.3,.65,1]:[1,.85,.2],b=e<1.15?[.6,.6,.6]:y;for(let e=v.count>>1;e<v.count;e++)v.setXYZ(e,b[0],b[1],b[2]);v.needsUpdate=!0}r.car&&r.car.wheels.forEach(t=>{t.visible=!(r.stage===2&&e>.65&&e<1.7)});let u=[4.7,-4.2];for(let e=0;e<2;e++){let r=I.people[4+e];x(0,t(u[e]*1.5,u[e],n)*1,H),r.position.copy(H),r.rotation.y=_+(e?0:Math.PI),r.scale.y=1-.18*n;let i=I.jacks[e];x(0,e?-2.3:3,H),i.position.copy(H),i.rotation.y=_,i.scale.y=.2+s*2.2,i.visible=s>.01}let d=I.people[6];x(-1.4,7.4,H),d.position.copy(H),d.rotation.y=_+Math.PI,d.scale.y=1,I.sign.position.copy(H).add(new K(0,.2,0)),I.sign.rotation.y=_,I.signLamp.material.color.setHex(e>2.1?3538784:15083039),I.sign.position.add(new K(Math.cos(_)*.9,0,-Math.sin(_)*.9)),v.signT=e}else r.car&&r.car.wheels.forEach(e=>{e.visible=!0})}else Ce.visible=!1,we.visible=!1,I.group.visible=!1;v.lift=s}let De=[new q(i.sky.top),new q(i.sky.rainTop)],Oe=[new q(i.sky.bot),new q(i.sky.rainBot)],ke=new q;function Ae(n){if(g.rain=e(n.rain??g.rain,0,1),g.wet=e(n.wetness??g.wet,0,1),!s)return;let r=Math.max(g.rain,i.ambientRain||0),a=Math.max(g.wet,i.ambientWet||0);D=r,l.material.uniforms.top.value.copy(De[0]).lerp(De[1],r),l.material.uniforms.bot.value.copy(Oe[0]).lerp(Oe[1],r),l.material.uniforms.sunAmt.value=i.sky.sunGlow*(1-r),s.fog.color.copy(l.material.uniforms.bot.value),s.background.copy(s.fog.color),y.fogNear=t(i.fog[0],i.fog[0]*.75,r),y.fogFar=t(i.fog[1],i.fog[1]*.77,r),d.intensity=t(i.sun.intensity,i.sun.rainIntensity,r),f.intensity=t(i.hemi.intensity,i.hemi.intensity*.84,r),d.color.setHex(i.sun.color).lerp(ke.setHex(i.sun.rainColor),r),f.color.setHex(i.hemi.sky).lerp(ke.setHex(9676480),r*(i.night?.3:1)),f.groundColor.setHex(i.hemi.ground).lerp(ke.setHex(4151882),r*(i.night?.3:1)),_.asphalt.color.setRGB(1,1,1).lerp(ke.setRGB(.75,.79,.86),a),_.asphalt.specular.setRGB(.55,.58,.65).multiplyScalar(a),_.pit.color.copy(_.asphalt.color),_.pit.specular.copy(_.asphalt.specular),_.terrain.color.setRGB(1,1,1).lerp(ke.setRGB(.85,.9,.92),r),_.cloud.color.setRGB(1,1,1).lerp(ke.setRGB(.75,.78,.82),r),_.gravel.color.setRGB(1,1,1).lerp(ke.setRGB(.7,.7,.72),a),_.ao.opacity=_.aoInst.opacity=.34+.03*r;let o=i.fx.tint;v.rain=r,v.sat=i.fx.sat*(1-.3*r),v.tint=[o[0]*(1-.2*r),o[1]*(1-.13*r),o[2]*(1-.03*r)],M&&(M.visible=r>.03)}function je(t){if(b=e(Math.round(t),0,2),!s)return;let n=b>=2?2048:1024;d.castShadow=b>=1,n!==x&&(x=n,d.shadow.mapSize.set(n,n),d.shadow.map?.dispose(),d.shadow.map=null);let r=a.userData.trees||[];for(let e of r)for(let t of e.meshes)t.count=Math.floor(e.n*(b>=2?1:b===1?.7:.4));M&&(M.userData.cap=b>=2?M.userData.max:b===1?160:70)}let Me=0,Ne=new K,Pe=new K,Fe=new K,Ie=new K(0,1,0),Le=new Ln,Re=new K(1,1,1);function ze(t,r,o=null){if(!s)return;Me+=t,v.time=Me;let c=o||{x:r.position.x,y:0,z:r.position.z,half:90,dist:40};l.position.copy(r.position),u&&(u.rotation.y+=t*.004,u.visible=r.position.y<140),S&&(S.position.x=r.position.x,S.position.z=r.position.z,S.material.color.copy(i.sea.color).offsetHSL(0,0,Math.sin(Me*.7)*.012)),C&&C.position.copy(r.position),a.userData.beacon&&(a.userData.beacon.rotation.y=Me*.9),s.fog.near=y.fogNear+c.dist*.9,s.fog.far=y.fogFar+c.dist*1.6;{let e=c.half,t=e*2/x,n=d.userData.dir;Pe.crossVectors(Ie,n).normalize(),Fe.crossVectors(n,Pe);let r=Math.round((c.x*Pe.x+c.y*Pe.y+c.z*Pe.z)/t)*t,i=Math.round((c.x*Fe.x+c.y*Fe.y+c.z*Fe.z)/t)*t,a=c.x*n.x+c.y*n.y+c.z*n.z;Ne.set(0,0,0).addScaledVector(Pe,r).addScaledVector(Fe,i).addScaledVector(n,a),d.target.position.copy(Ne),d.position.copy(Ne).addScaledVector(n,300);let o=d.shadow.camera;o.right!==e&&(o.left=-e,o.right=e,o.top=e,o.bottom=-e,o.updateProjectionMatrix()),d.target.updateMatrixWorld()}for(let e=0;e<k.length;e++){let t=k[e];Le.compose(tm.set(t.x,t.y,t.z),em.setFromEuler(rm.set(Math.sin(Me*2.6+t.ph)*.12,t.yaw+Math.sin(Me*2.1+t.ph)*.35,0)),Re),O.setMatrixAt(e,Le)}if(O.instanceMatrix.needsUpdate=!0,A){let e=j.userData;e.rot-=t*.045,A.userData.wheel.rotation.z=e.rot;for(let t=0;t<e.NG;t++){let n=e.rot+t/e.NG*Math.PI*2;j.setMatrixAt(t,Le.makeTranslation(Math.cos(n)*e.Rw,e.hubY+Math.sin(n)*e.Rw-2,0))}j.instanceMatrix.needsUpdate=!0}if(M.visible){let r=Math.min(M.userData.cap??M.userData.max,Math.floor(M.userData.max*n(.03,.8,D)));M.count=r;let i=e(c.dist*.55,22,90);for(let e=0;e<r;e++){let n=N[e];if(n.age+=t/n.life,n.age>=1){--n.age;let e=Math.random()*6.283,t=Math.sqrt(Math.random())*i;n.x=c.x+Math.cos(e)*t,n.z=c.z+Math.sin(e)*t*.8,n.y=ge(n.x,n.z,he)+.14}let r=[.35,.65,.95,1.2][Math.min(3,Math.floor(n.age*4))]*n.size;Le.compose(tm.set(n.x,n.y,n.z),em.identity(),nm.set(r,1,r)),M.setMatrixAt(e,Le)}M.instanceMatrix.needsUpdate=!0}if(T){let n=D>.04;if(T.visible=n,n){let n=e((o?o.dist:40)*.65,16,64),i=o||{x:r.position.x,y:r.position.y,z:r.position.z};for(let e=0;e<E.length;e++){let r=E[e];if(r.y-=r.v*t,r.age+=t,r.y<i.y-4){let e=Math.random()*6.283,t=Math.sqrt(Math.random())*n;r.x=i.x+Math.cos(e)*t,r.z=i.z+Math.sin(e)*t,r.y=i.y+6+Math.random()*18,r.age=0}Le.makeTranslation(r.x,r.y,r.z),T.setMatrixAt(e,Le)}T.instanceMatrix.needsUpdate=!0}}F&&Se((i.night||g.rain>.05)&&te.length>0,i.night?1:n(.05,.4,g.rain)),Ee(t,Me)}function Be(e,t=!1){p.forEach((n,r)=>n.color.setHex(t?3538784:r<e?16722458:3804170))}function Ve(){s&&(s.remove(a),s.fog=m,s.background=h);for(let e of o)e.dispose?.();d?.shadow.map?.dispose(),a.clear(),p.length=0,o.length=0,ae.length=0,s=null,I=null,k=[],N=[],ne.length=0,S=C=w=u=A=j=O=M=T=F=ee=P=null,E=[],D=0,te=[],a.userData={}}return{name:i.name,style:i,group:a,placements:ae,groundAt:ve,build:ye,dispose:Ve,setWeather:Ae,update:ze,setStartLights:Be,setCars:z,setPit:V,setQuality:je,fx:v,get quality(){return b}}}var hm={name:`desertNight`,sky:{top:725555,bot:3812442,rainTop:1382956,rainBot:2894912,sunGlow:.25},fog:[150,860],sun:{color:11846399,intensity:1.7,dir:[.42,.78,-.32],rainColor:9082032,rainIntensity:1},hemi:{sky:9082064,ground:6965812,intensity:1.35},ground:{g1:13212250,g2:12751444,far:12027210,rock:10115642,amp:38,rockFrom:18},gravel:[14727288,13937516],trees:`desert`,clouds:!1,night:!0,landmark:`ferris`,fx:{sat:.95,tint:[.94,.96,1.08]}};function gm(){return mm(hm)}var _m={name:`coastal`,sky:{top:2787040,bot:13823231,rainTop:6257302,rainBot:11123403,sunGlow:1.1},fog:[140,900],sun:{color:16774366,intensity:3,dir:[.5,.78,.38]},hemi:{sky:14085375,ground:6986320,intensity:1},ground:{g1:8048712,g2:6864958,far:5217850,rock:11575424,amp:20,rockFrom:16},gravel:[15785130,15126682],trees:`coastal`,treeNear:130,treeFar:16,clouds:!0,landmark:`lighthouse`,lighthouseAt:[495,360],sea:{level:0,water:2789064,sand:15785130,mask:(e,t)=>Math.max(n(590,650,t),n(500,560,e))},fx:{sat:1.05,tint:[1,1,1]}};function vm(){return mm(_m)}var ym={name:`alpine`,sky:{top:9356528,bot:15332347,rainTop:9085112,rainBot:14016746,sunGlow:.85},fog:[150,980],sun:{color:16774890,intensity:2.7,dir:[.25,.74,.48]},hemi:{sky:15201023,ground:12965094,intensity:1.05},ground:{g1:16054524,g2:15003382,far:13689070,rock:9077884,amp:46,rockFrom:34},gravel:[16251903,14017780],trees:`alpine`,treeNear:120,treeFar:48,treeMaxH:78,snowbanks:!0,clouds:!0,landmark:`lodge`,fx:{sat:1.02,tint:[.96,.98,1.04]}};function bm(){return mm(ym)}var xm={name:`forest`,sky:{top:6126742,bot:12043986,rainTop:3953510,rainBot:9149355,sunGlow:.35},fog:[55,420],sun:{color:14015976,intensity:2.1,dir:[-.35,.8,.3],rainColor:10136508,rainIntensity:1.35},hemi:{sky:12043988,ground:2771506,intensity:.9},ground:{g1:1858608,g2:1460262,far:930588,rock:4871752,amp:16,rockFrom:28},gravel:[6968374,5785134],trees:`forest`,treeNear:150,treeFar:64,treeMaxH:36,treeScale:1.12,puddles:!0,ambientRain:.72,ambientWet:.66,rainParticles:!0,clouds:!0,landmark:`tower`,fx:{sat:.92,tint:[.9,.96,1]}};function Sm(){return mm(xm)}var Cm={name:`neonStreet`,sky:{top:1181212,bot:3806296,rainTop:787988,rainBot:2363448,sunGlow:.08},fog:[90,620],sun:{color:13153535,intensity:1.35,dir:[.35,.82,-.25],rainColor:9075370,rainIntensity:.9},hemi:{sky:6965400,ground:1712176,intensity:1.25},ground:{g1:2896188,g2:2501428,far:1711656,rock:3817548,amp:8,rockFrom:40},gravel:[3817548,3028030],trees:`street`,treeNear:28,treeFar:8,treeMaxH:20,treeScale:.85,night:!0,neon:!0,wall:`city`,buildings:`block`,clouds:!1,landmark:`arch`,fx:{sat:1.12,tint:[1.04,.94,1.1]}};function wm(){return mm(Cm)}var Tm={circuitDay:mm,desertNight:gm,coastal:vm,alpine:bm,forest:Sm,neonStreet:wm};function Em(e){return(Tm[e]||mm)()}var Dm={radius:56,dead:0,curve:1.3};function Om(e,t=Dm.radius,n=Dm.dead,r=Dm.curve){let i=Math.max(-1,Math.min(1,e/t)),a=Math.abs(i);return a<=n?0:Math.sign(i)*((a-n)/(1-n))**r}function km(e,t,n=Dm.radius){let r=Math.hypot(e,t);return r<=n?[e,t]:[e/r*n,t/r*n]}var Am=class{constructor(e=document){this.keys=new Set,this.touch={gas:!1,brake:!1,boost:!1},this.actions=[],this.padPrev=[],this.out={steer:0,throttle:0,brake:0,boost:!1};let t=[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Space`],n=()=>{let e=document.activeElement;return!!e&&(e.tagName===`INPUT`||e.tagName===`TEXTAREA`||e.isContentEditable)};addEventListener(`keydown`,e=>{if(n()||e.repeat)return;this.keys.add(e.code),t.includes(e.code)&&e.preventDefault();let r={KeyC:`camera`,KeyT:`autopilot`,KeyM:`mute`,KeyP:`pit`,Digit1:`tire:dry`,Digit2:`tire:wet`,Escape:`pause`};r[e.code]&&this.actions.push(r[e.code])}),addEventListener(`keyup`,e=>this.keys.delete(e.code)),this.touch.steer=0,this.holds={},this.joyPointer=null;let r=()=>{this.keys.clear();for(let e in this.touch)this.touch[e]=e===`steer`&&0;for(let e in this.holds)this.holds[e].clear();e.querySelectorAll(`[data-hold].down`).forEach(e=>e.classList.remove(`down`)),this.joyPointer=null,this.joyHide?.()};this.releaseAll=r,addEventListener(`blur`,r),document.addEventListener(`visibilitychange`,()=>{document.hidden&&r()}),addEventListener(`pagehide`,r);let i=e=>e.preventDefault();for(let e of[`dblclick`,`gesturestart`,`gesturechange`,`gestureend`])document.addEventListener(e,i,{passive:!1});let a=0;document.addEventListener(`touchend`,e=>{let t=performance.now();t-a<350&&e.preventDefault(),a=t},{passive:!1}),document.addEventListener(`touchmove`,e=>{e.touches.length>1&&e.preventDefault()},{passive:!1}),document.addEventListener(`contextmenu`,e=>{e.target.closest?.(`#hud`)&&e.preventDefault()}),document.addEventListener(`click`,e=>{e.target.closest?.(`[data-tap]`)&&(e.detail!==0||performance.now()-this.lastTap<600)&&(e.preventDefault(),e.stopImmediatePropagation())},!0),this.lastTap=-1e9,e.querySelectorAll(`[data-hold]`).forEach(e=>{let t=e.dataset.hold,n=this.holds[t]=new Set,r=()=>{let r=n.size>0;this.touch[t]=r,e.classList.toggle(`down`,r)};e.addEventListener(`pointerdown`,t=>{t.preventDefault();try{e.setPointerCapture(t.pointerId)}catch{}n.add(t.pointerId),r()});for(let t of[`pointerup`,`pointercancel`,`lostpointercapture`])e.addEventListener(t,e=>{n.delete(e.pointerId),r()});e.addEventListener(`contextmenu`,e=>e.preventDefault())});let o=e.getElementById?.(`joyZone`)??e.querySelector(`#joyZone`),s=e.querySelector(`#joyBase`),c=e.querySelector(`#joyKnob`);if(o&&s&&c){let e=0,t=0;this.joyHide=()=>{s.classList.remove(`on`),c.style.transform=`translate(-50%,-50%)`,this.touch.steer=0};let n=n=>{let[r,i]=km(n.clientX-e,n.clientY-t,Dm.radius);c.style.transform=`translate(calc(-50% + ${r}px), calc(-50% + ${i}px))`,this.touch.steer=Om(n.clientX-e)};o.addEventListener(`pointerdown`,r=>{if(this.joyPointer!==null)return;r.preventDefault();try{o.setPointerCapture(r.pointerId)}catch{}this.joyPointer=r.pointerId;let i=o.getBoundingClientRect();e=Math.max(i.left+Dm.radius+6,Math.min(i.right-Dm.radius-6,r.clientX)),t=Math.max(Dm.radius+6,Math.min(innerHeight-Dm.radius-6,r.clientY)),s.style.left=e+`px`,s.style.top=t+`px`,s.classList.add(`on`),n(r)}),o.addEventListener(`pointermove`,e=>{e.pointerId===this.joyPointer&&n(e)});let r=e=>{e.pointerId===this.joyPointer&&(this.joyPointer=null,this.joyHide())};for(let e of[`pointerup`,`pointercancel`,`lostpointercapture`])o.addEventListener(e,r)}}onTap(e,t){if(!e)return;e.dataset.tap=`1`;let n=!1;e.addEventListener(`pointerdown`,e=>{n=!0,e.stopPropagation()}),e.addEventListener(`pointercancel`,()=>{n=!1}),e.addEventListener(`pointerleave`,()=>{n=!1}),e.addEventListener(`pointerup`,e=>{n&&(n=!1,e.preventDefault(),e.stopPropagation(),this.lastTap=performance.now(),t(e))}),e.addEventListener(`click`,e=>{e.detail===0&&performance.now()-this.lastTap>600&&t(e)})}poll(){let e=this.keys,t=this.touch,n=this.out,r=(e.has(`ArrowRight`)||e.has(`KeyD`)?1:0)-(e.has(`ArrowLeft`)||e.has(`KeyA`)?1:0);r+=t.steer||0;let i=e.has(`ArrowUp`)||e.has(`KeyW`)||t.gas?1:0,a=e.has(`ArrowDown`)||e.has(`KeyS`)||t.brake?1:0,o=e.has(`ShiftLeft`)||e.has(`ShiftRight`)||e.has(`KeyB`)||t.boost,s=navigator.getGamepads?navigator.getGamepads():[];for(let e of s){if(!e||!e.connected)continue;let t=e.axes[0]||0;r+=ue(t),e.buttons[14]?.pressed&&--r,e.buttons[15]?.pressed&&(r+=1),i=Math.max(i,e.buttons[7]?.value||0,+!!e.buttons[0]?.pressed),a=Math.max(a,e.buttons[6]?.value||0,+!!e.buttons[1]?.pressed),o||=!!(e.buttons[5]?.pressed||e.buttons[2]?.pressed);let n=this.padPrev[e.index]||[],s=(t,r)=>{e.buttons[t]?.pressed&&!n[t]&&this.actions.push(r)};s(3,`camera`),s(4,`pit`),s(8,`autopilot`),s(9,`pause`),this.padPrev[e.index]=e.buttons.map(e=>e.pressed)}return n.steer=Math.max(-1,Math.min(1,r)),n.throttle=i,n.brake=a,n.boost=o,n}takeActions(){let e=this.actions;return this.actions=[],e}},jm=e=>440*2**((e-69)/12),Mm=[0,3,7,12,10,7,3,7,0,3,7,10,12,15,12,7],Nm=[0,0,-5,-5,-2,-2,-7,-7],Pm=e=>Math.max(0,Math.min(1,e));function Fm(e,t,n=0){let r=Pm(Math.max(0,e)/Math.max(1,t)),i=e=>((e+1)/7)**.85,a=0;for(;a<6&&r>=i(a);)a++;a<n&&r>i(n-1)-.06&&(a=n);let o=a?i(a-1):0,s=i(a),c=.3+.7*Pm((r-o)/(s-o));return{gear:a,rpm:a===0?.2+.8*Pm(r/s):c}}var Im=class{constructor(){this.ctx=null,this.muted=localStorage.getItem(`racer-mute`)===`1`,this.step=0,this.music=!1}init(){if(this.ctx){this.ctx.resume?.();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=this.ctx=new e;this.master=t.createGain(),this.master.gain.value=this.muted?0:.5,this.master.connect(t.destination),this.eg=t.createGain(),this.eg.gain.value=0,this.ef=t.createBiquadFilter(),this.ef.type=`lowpass`,this.ef.frequency.value=900,this.o1=t.createOscillator(),this.o1.type=`sawtooth`,this.o2=t.createOscillator(),this.o2.type=`square`,this.o1.connect(this.ef),this.o2.connect(this.ef),this.ef.connect(this.eg),this.eg.connect(this.master),this.o1.start(),this.o2.start(),this._initFx(),this.mg=t.createGain(),this.mg.gain.value=.12,this.mg.connect(this.master),this.nextT=t.currentTime+.1,this.timer=setInterval(()=>this._music(),60)}setMuted(e){this.muted=e,localStorage.setItem(`racer-mute`,e?`1`:`0`),this.master&&this.master.gain.setTargetAtTime(e?0:.5,this.ctx.currentTime,.02)}_note(e,t,n,r,i){let a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type=r,a.frequency.value=e,o.gain.setValueAtTime(i,t),o.gain.exponentialRampToValueAtTime(1e-4,t+n),a.connect(o),o.connect(this.mg),a.start(t),a.stop(t+n+.02)}_music(){if(!this.ctx||!this.music){this.ctx&&(this.nextT=Math.max(this.nextT,this.ctx.currentTime));return}let e=60/150/2;for(;this.nextT<this.ctx.currentTime+.25;){let t=this.step++;this._note(jm(69+Mm[t%16]+(Math.floor(t/16)%2?5:0)),this.nextT,e*.9,`square`,.35),t%2==0&&this._note(jm(45+Nm[t/2%8|0]),this.nextT,e*1.8,`triangle`,.9),this.nextT+=e}}_noise(){let e=this.ctx,t=e.createBuffer(1,e.sampleRate*2,e.sampleRate),n=t.getChannelData(0);for(let e=0;e<n.length;e++)n[e]=Math.random()*2-1;let r=e.createBufferSource();return r.buffer=t,r.loop=!0,r}_initFx(){let e=this.ctx;this.sq=e.createGain(),this.sq.gain.value=0,this.sqf=e.createBiquadFilter(),this.sqf.type=`bandpass`,this.sqf.frequency.value=2100,this.sqf.Q.value=6,this.nz1=this._noise(),this.nz1.connect(this.sqf),this.sqf.connect(this.sq),this.sq.connect(this.master),this.nz1.start(),this.kr=e.createGain(),this.kr.gain.value=0,this.krm=e.createGain(),this.krm.gain.value=.5,this.krl=e.createOscillator(),this.krl.type=`square`,this.krl.frequency.value=30;let t=e.createGain();t.gain.value=.5,this.krl.connect(t),t.connect(this.krm.gain);let n=e.createBiquadFilter();n.type=`lowpass`,n.frequency.value=260,this.nz2=this._noise(),this.nz2.connect(n),n.connect(this.krm),this.krm.connect(this.kr),this.kr.connect(this.master),this.nz2.start(),this.krl.start(),this.gear=0,this.shiftT=0,this.rpm=.2,this.lastRpm=.2,this.audioSmooth=0,this.scrub=0}drive(e){if(!this.ctx)return;let t=this.ctx.currentTime,n=Math.max(.001,e.dt||1/60),r=Fm(e.v,e.vTop,this.gear);r.gear>this.gear&&(this.shiftT=.09,this.shiftBlip(r.gear)),this.gear=r.gear,this.shiftT=Math.max(0,this.shiftT-n);let i=Pm(r.rpm+(e.throttle>.1?.04:-.03));this.audioSmooth=Math.min(.25,(this.audioSmooth||0)+n);let a=this.rpm+(i-this.rpm)*(1-Math.exp(-this.audioSmooth/.055));this.audioSmooth=0,this.rpm=a;let o=42+a*168+(e.boosting?8:0);this.o1.frequency.setTargetAtTime(o,t,.03),this.o2.frequency.setTargetAtTime(o*.5,t,.03),this.ef.frequency.setTargetAtTime(450+a*1100+e.throttle*600,t,.06);let s=this.shiftT>0?.15:1;if(this.eg.gain.setTargetAtTime(e.on?(.08+e.throttle*.08+a*.03)*s*(this.voiceDuck?1-this.voiceDuck*.55:1):0,t,this.shiftT>0?.01:.08),!this.sq)return;let c=e.on?pe(e.lat||0,e.slipAngle||0,Math.max(e.lock||0,(e.slip||0)*.85)):0;this.scrub+=(c-this.scrub)*(1-Math.exp(-n/.055));let l=this.scrub;this.sq.gain.setTargetAtTime(l*l*.07,t,.06),this.sqf.frequency.setTargetAtTime(1900+l*700+e.v*3,t,.1);let u=e.on&&e.kerb?Math.min(1,e.v/40):0;this.kr.gain.setTargetAtTime(u*.22,t,.04),this.krl.frequency.setTargetAtTime(14+e.v*.5,t,.1)}engine(e,t,n,r){this.drive({v:e,vTop:t,throttle:n,brake:0,lat:0,kerb:!1,on:r})}shiftBlip(){if(!this.ctx)return;let e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type=`square`,t.frequency.setValueAtTime(260,e),t.frequency.exponentialRampToValueAtTime(110,e+.07),n.gain.setValueAtTime(.05,e),n.gain.exponentialRampToValueAtTime(1e-4,e+.08),t.connect(n),n.connect(this.master),t.start(e),t.stop(e+.1)}beep(e=660,t=.15,n=`square`,r=.3){if(!this.ctx)return;let i=this.ctx.currentTime,a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type=n,a.frequency.value=e,o.gain.setValueAtTime(r,i),o.gain.exponentialRampToValueAtTime(1e-4,i+t),a.connect(o),o.connect(this.master),a.start(i),a.stop(i+t+.02)}thump(){if(!this.ctx)return;let e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type=`sawtooth`,t.frequency.setValueAtTime(140,e),t.frequency.exponentialRampToValueAtTime(40,e+.2),n.gain.setValueAtTime(.5,e),n.gain.exponentialRampToValueAtTime(1e-4,e+.25),t.connect(n),n.connect(this.master),t.start(e),t.stop(e+.3)}},Lm=[240,300,360],Rm=e=>Lm[Math.max(0,Math.min(Lm.length-1,Math.round(e)))],zm=e=>e>=1?4:0;function Bm(e,t,n=1,r=240){let i=Math.max(1,Math.round(e*n)),a=Math.max(1,Math.round(t*n)),o=Math.max(1,Math.round(a/r)),s=Math.max(1,Math.floor(i/o)),c=Math.max(1,Math.floor(a/o)),l=s*o,u=c*o;return{W:i,H:a,k:o,lowW:s,lowH:c,vx:Math.floor((i-l)/2),vy:Math.floor((a-u)/2),vw:l,vh:u}}function Vm(e,t,n){return 2*e*Math.tan(t*Math.PI/360)/n}function Hm(e,t,n,r,i=[0,0,0]){if(!(r>0))return i[0]=e[0],i[1]=e[1],i[2]=e[2],i;let a=e[0]*t[0]+e[1]*t[1]+e[2]*t[2],o=e[0]*n[0]+e[1]*n[1]+e[2]*n[2],s=Math.round(a/r)*r-a,c=Math.round(o/r)*r-o;return i[0]=e[0]+t[0]*s+n[0]*c,i[1]=e[1]+t[1]*s+n[1]*c,i[2]=e[2]+t[2]*s+n[2]*c,i}var Um=class{constructor(e=240){this.buf=new Float32Array(e),this.n=0,this.i=0,this.spikes=0,this.total=0,this.heapUp=0,this.heapFrames=0,this._heap=-1,this._sorted=new Float32Array(e)}add(e,t=-1){let n=this.n?this.mean():e;this.n>=30&&e>n*1.75&&e>20&&this.spikes++,this.buf[this.i]=e,this.i=(this.i+1)%this.buf.length,this.n<this.buf.length&&this.n++,this.total++,t>=0&&(this._heap>=0&&t>this._heap&&(this.heapUp+=t-this._heap),this._heap>=0&&this.heapFrames++,this._heap=t)}mean(){let e=0;for(let t=0;t<this.n;t++)e+=this.buf[t];return this.n?e/this.n:0}percentile(e){let t=this.n;if(!t)return 0;let n=this._sorted;for(let e=0;e<t;e++)n[e]=this.buf[e];return n.subarray(0,t).sort()[Math.min(t-1,Math.floor(e*t))]}reset(){this.n=0,this.i=0,this.spikes=0,this.total=0,this.heapUp=0,this.heapFrames=0,this._heap=-1}snapshot(){let e=this.mean();return{frames:this.n,avgMs:+e.toFixed(2),p95Ms:+this.percentile(.95).toFixed(2),maxMs:+this.percentile(1).toFixed(2),fps:e?+(1e3/e).toFixed(1):0,spikes:this.spikes,allocBytesPerFrame:this.heapFrames?Math.round(this.heapUp/this.heapFrames):-1}}},Wm=class{constructor(e=1/60,t=.0025){this.interval=e,this.slack=t,this.t=1/0}due(e){return this.t+=e,this.t>=this.interval-this.slack&&(this.t=Number.isFinite(this.t)?Math.min(this.t-this.interval,this.interval):0,!0)}force(){this.t=1/0}},Gm=1/60;function Km(e){let t=e._prev||={};return t.x=e.x,t.y=e.y,t.z=e.z,t.theta=e.theta,t.pitch=e.pose?e.pose.pitch:0,t.roll=e.pose?e.pose.roll:0,t.steer=e.steer||0,t.s=e.s||0,t.d=e.d||0,t}var qm=(e,t,n)=>e+(t-e)*n;function Jm(e,t,n={},i=0){let a=e._prev;if(!a)return n.x=e.x,n.y=e.y,n.z=e.z,n.theta=e.theta,n.pitch=e.pose?e.pose.pitch:0,n.roll=e.pose?e.pose.roll:0,n.steer=e.steer||0,n.s=e.s||0,n.d=e.d||0,n;n.x=qm(a.x,e.x,t),n.y=qm(a.y,e.y,t),n.z=qm(a.z,e.z,t),n.theta=a.theta+r(e.theta-a.theta)*t;let o=e.pose?e.pose.pitch:0,s=e.pose?e.pose.roll:0;n.pitch=qm(a.pitch,o,t),n.roll=qm(a.roll,s,t),n.steer=qm(a.steer,e.steer||0,t);let c=(e.s||0)-a.s;return i>0&&(c-=Math.round(c/i)*i),n.s=a.s+c*t,n.d=qm(a.d,e.d||0,t),n}function Ym(e,t,n=Gm,r=5){e+=t;let i=0;for(;e>=n&&i<r;)e-=n,i++;return e>=n&&(e%=n),{n:i,acc:e}}var Xm=class{constructor({level:e=2,min:t=0,max:n=2,lowFps:r=45,highFps:i=58,lowSecs:a=3,highSecs:o=10}={}){Object.assign(this,{level:e,min:t,max:n,lowFps:r,highFps:i,lowSecs:a,highSecs:o}),this.lowT=0,this.highT=0,this.fps=60}update(e,t){return this.fps=t,this.lowT=t<this.lowFps?this.lowT+e:0,this.highT=t>this.highFps?this.highT+e:0,this.lowT>=this.lowSecs&&this.level>this.min?(this.level--,this.lowT=this.highT=0,this.level):this.highT>=this.highSecs&&this.level<this.max?(this.level++,this.lowT=this.highT=0,this.level):(this.lowT>=this.lowSecs&&(this.lowT=0),this.highT>=this.highSecs&&(this.highT=0),null)}};function Zm(e){return String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}function Qm(e,t){return`${ad}:${e}:${t}`}function $m(e,t){return`${e}:${t}`}function eh(e,t,n,r){let i=$m(n,r);if(t[i]!==void 0)return t[i];try{let a=e?.getItem(Qm(n,r));t[i]=a?JSON.parse(a):null}catch{t[i]=null}return t[i]}function th(e,t,n,r,i){let a=$m(n,r);t[a]=i;try{return e?.setItem(Qm(n,r),JSON.stringify(i)),!0}catch{return!1}}function nh(e){return`#`+(e>>>0&16777215).toString(16).padStart(6,`0`)}function rh(e,t){let n=e.length,r=Math.max(1,Math.min(t|0,n||1)),i=(e,t)=>({pos:t+1,tag:e.team?.tag??``,color:e.team?.c1??8947848,me:!!e.isPlayer});if(r<=7)return e.slice(0,r).map(i);let a=e.slice(0,5).map(i);a.push({divider:!0});let o=r-2,s=r-1,c=r;return o>=5&&o<n&&a.push(i(e[o],o)),s>=0&&s<n&&a.push(i(e[s],s)),c<n&&c>=5&&a.push(i(e[c],c)),a}function ih(e,t){return rh(e,t).map(e=>e.divider?`<li class="gap" aria-hidden="true">···</li>`:`<li class="${e.me?`me`:``}"><b>${e.pos}</b><i style="background:${nh(e.color)}"></i>${Zm(e.tag)}</li>`).join(``)}function ah(e,t){return e.map(e=>{let n=e.pos===1?t(e.time,!1):`+`+(e.gap??0).toFixed(1);return`<tr class="${e.isPlayer?`me`:``}"><td>${e.pos}</td><td><i class="chip" style="background:${nh(e.team?.c1??8947848)}"></i> ${Zm(e.name)}</td><td>${n}</td><td>best ${t(e.best,!1)}</td><td>${e.stops?`pit×`+e.stops:``}</td></tr>`})}function oh(e){return e?e.player?`YOU ARE THE CHAMPION`:`CHAMPION ${Zm(e.name)}`:``}var sh=`drive-career-v1`,ch=`drive-garage-v1`,lh=[25,18,15,12,10,8,6,4,2,1],uh=e=>lh[e-1]||0,dh={name:`Ashlane Speed Co.`,tag:`ASH`,livery:{pattern:`flash`,c1:16738816,c2:1710626,c3:16765514,number:1}},fh=[`engine`,`aero`,`brakes`,`tires`],ph=[4,6,8,10,12],mh={engine:{vTop:.008,accel:.01},aero:{down:.02},brakes:{brake:.015},tires:{wear:-.04}},hh={engine:`ENGINE`,aero:`AERO`,brakes:`BRAKES`,tires:`TIRES`},gh={engine:`Top speed and pull out of corners`,aero:`More grip through fast corners`,brakes:`Shorter stopping distance`,tires:`Tyres last longer`},_h=[8,7,6,5,5,4,4,3,3,2],vh=`Casey Morrow`,yh=(e,t,n,r)=>{let i=typeof e==`string`?parseInt(e,10):e;return Number.isFinite(i)?Math.min(n,Math.max(t,Math.round(i))):r};function bh(){return[[`quill`,`Mara Quill`,1,94],[`voss`,`Jonah Voss`,2,90],[`calder`,`Nia Calder`,3,86],[`hale`,`Soren Hale`,4,83],[`frost`,`Imani Frost`,5,80],[`bramble`,`Theo Bramble`,6,77],[`pell`,`Ren Pell`,7,74],[`march`,`Odette March`,8,71],[`lind`,`Casper Lind`,9,68]].map(([e,t,n,r])=>({id:e,name:t,number:Ef(n),teamIndex:n,rating:r}))}function xh(){let e=Cd[0];return{driver:{name:vh,number:1},team:yf({name:e.name,tag:e.tag,livery:{..._f(),pattern:`chevrons`,c1:e.c1,c2:e.c2,number:1}})}}function Sh(e){let t=xh(),n=e&&typeof e==`object`?e:{},r=hf(n.driver?.number??n.team?.livery?.number,t.driver.number),i=df(n.driver?.name)||t.driver.name,a=yf({name:n.team?.name,tag:n.team?.tag,livery:{...n.team?.livery||{},number:r}},t.team.name);return{driver:{name:i,number:r},team:a}}function Ch(e){try{let t=e?.getItem(ch);return t?Sh(JSON.parse(t)):xh()}catch{return xh()}}function wh(e,t){try{return e?.setItem(ch,JSON.stringify(Sh(t))),!0}catch{return!1}}function Th(e,t=`normal`){let n=od[t]||od.normal,r=(yh(e,50,99,80)-80)/20,i=n.skill+r*n.spread;return Math.round(Math.min(1.02,Math.max(.8,i))*1e3)/1e3}function Eh(e,t=`normal`){let n=_h[e-1]??0;return Math.round(n*(t===`hard`?1.25:t===`easy`?.75:1))}function Dh(e,t){let n=e=>yh(t?.[e],0,5,0),r=n(`engine`),i=n(`aero`),a=n(`brakes`),o=n(`tires`);return{...e,vTop:e.vTop*(1+mh.engine.vTop*r),accel:e.accel*(1+mh.engine.accel*r),down:e.down*(1+mh.aero.down*i),brake:e.brake*(1+mh.brakes.brake*a),wear:e.wear*(1+mh.tires.wear*o)}}function Oh(e){let t=fh.reduce((t,n)=>t+(e?.upgrades?.[n]||0),0);return Math.round((76+t*1.2)*10)/10}function kh(e,t){if(!fh.includes(t))return null;let n=e.upgrades[t]||0;return n>=5?null:ph[n]}function Ah(e,t){if(!fh.includes(t))return{ok:!1,reason:`unknown`,level:0,cost:0,left:e?.upgradePoints||0};let n=e.upgrades[t]||0;if(n>=5)return{ok:!1,reason:`max`,level:n,cost:0,left:e.upgradePoints};let r=ph[n];return e.upgradePoints<r?{ok:!1,reason:`points`,level:n,cost:r,left:e.upgradePoints}:(e.upgradePoints-=r,e.upgrades[t]=n+1,{ok:!0,level:n+1,cost:r,left:e.upgradePoints})}function jh(e,t){let n=e&&typeof e==`object`?e:{};return{id:String(n.id||t.id).toLowerCase().replace(/[^a-z0-9]/g,``).slice(0,16)||t.id,name:df(n.name)||t.name,number:hf(n.number,t.number),teamIndex:yh(n.teamIndex,1,Cd.length-1,t.teamIndex),rating:yh(n.rating,50,99,t.rating)}}function Mh(e,t){if(!Array.isArray(e))return[];let n=[];for(let r of e){if(!r||typeof r!=`object`||!Uu.includes(r.trackId))continue;let e={};if(r.places&&typeof r.places==`object`)for(let[n,i]of Object.entries(r.places)){if(n!==`player`&&!t.has(n))continue;let r=yh(i,1,24,0);r&&(e[n]=r)}if(n.push({trackId:r.trackId,pos:yh(r.pos,1,24,0)||null,points:yh(r.points,0,25,0),upgrade:yh(r.upgrade,0,99,0),places:e}),n.length>=64)break}return n}function Nh(e){return e?.cls===`speedway`?`speedway`:`gp`}function Ph(e){return yh(e?.points?.player,0,1e5,0)}function Fh(e){return Nh(e)===`gp`?Math.max(0,90-Ph(e)):0}function Ih(e){return!e||!e.complete||Nh(e)!==`gp`?!1:Ph(e)>=90}function Lh(e){return`Speedway scouts wanted 90 pts — you scored ${Ph(e)}`}function Rh(e){return Ih(e)?(e.upgrades={engine:0,aero:0,brakes:0,tires:0},Yh(e),e.cls=`speedway`,e.speedwayOffer=null,{ok:!0,unlocked:!0}):{ok:!1,reason:`ineligible`}}function zh(e){return Ih(e)?(Yh(e),e.cls=`gp`,e.speedwayOffer=null,{ok:!0}):{ok:!1,reason:`ineligible`}}function Bh(e={},t=null){let n=Sh(t||xh()),r=hf(e.number??e.driver?.number??n.driver.number,n.driver.number),i=df(e.driverName??(typeof e.driver==`string`?e.driver:e.driver?.name)??n.driver.name)||n.driver.name,a=e.team||n.team,o=yf({...a,livery:{...a.livery||{},number:r}},n.team.name),s=od[e.difficulty]?e.difficulty:`normal`,c=e.weather===`dry`||e.weather===`rain`?e.weather:`auto`;return{v:1,driver:{name:i,number:r},team:o,difficulty:s,laps:yh(e.laps,3,5,4),weather:c,cls:`gp`,speedwayOffer:null,round:0,season:1,complete:!1,calendar:Uu.slice(),points:{},upgradePoints:0,upgrades:{engine:0,aero:0,brakes:0,tires:0},rivals:bh(),history:[]}}function Vh(e){if(!e||typeof e!=`object`)return null;let t=Bh({driverName:e.driver?.name,number:e.driver?.number,team:e.team,difficulty:e.difficulty,laps:e.laps,weather:e.weather}),n=bh().map((t,n)=>jh(Array.isArray(e.rivals)?e.rivals[n]:null,t)),r=new Set(n.map(e=>e.id)),i={};if(e.points&&typeof e.points==`object`)for(let[t,n]of Object.entries(e.points)){if(t!==`player`&&!r.has(t))continue;let e=Number(n);Number.isFinite(e)&&e>=0&&e<1e5&&(i[t]=Math.round(e))}let a={engine:0,aero:0,brakes:0,tires:0};for(let t of fh)a[t]=yh(e.upgrades?.[t],0,5,0);let o=Array.isArray(e.calendar)?e.calendar.filter(e=>Uu.includes(e)):[],s=o.length?o:Uu.slice(),c=yh(e.round,0,s.length,0),l=e.cls===`speedway`?`speedway`:`gp`,u=e.speedwayOffer,d=u===`accepted`||u===`declined`||u===`pending`?u:null;return{...t,cls:l,speedwayOffer:d,round:c,season:yh(e.season,1,99,1),complete:!!e.complete||c>=s.length,calendar:s,points:i,upgradePoints:yh(e.upgradePoints,0,9999,0),upgrades:a,rivals:n,history:Mh(e.history,r)}}function Hh(e){try{let t=e?.getItem(sh);return t?Vh(JSON.parse(t)):null}catch{return null}}function Uh(e,t){try{let n=Vh(t);return n?(e?.setItem(sh,JSON.stringify(n)),!0):!1}catch{return!1}}function Wh(e){if(!e||e.complete||e.round>=e.calendar.length)return null;let t=e.calendar[e.round];return{index:e.round,count:e.calendar.length,id:t}}function Gh(e){let t=Wh(e);return t?t.id:e?.calendar?.length?e.calendar[0]:null}function Kh(e,t){let n=t?Dh(t,e.upgrades):null,r=[{id:`player`,isPlayer:!0,rating:Oh(e),teamIndex:0,team:{...e.team,c1:e.team.livery.c1,c2:e.team.livery.c2,custom:!0,livery:{...e.team.livery}},driver:{name:e.driver.name,number:e.driver.number},skill:.985,cls:n||void 0},...e.rivals.map(n=>{let r=Cd[n.teamIndex];return{id:n.id,isPlayer:!1,rating:n.rating,teamIndex:n.teamIndex,team:{name:r.name,tag:r.tag,c1:r.c1,c2:r.c2},driver:{name:n.name,number:n.number},skill:Th(n.rating,e.difficulty),cls:t||void 0}})];return r.sort((e,t)=>t.rating-e.rating||(e.driver.name<t.driver.name?-1:+(e.driver.name>t.driver.name))),r}function qh(e){let t={},n={};for(let r of e.history||[])for(let[e,i]of Object.entries(r.places||{}))i===1&&(t[e]=(t[e]||0)+1),i<=3&&(n[e]=(n[e]||0)+1);let r=e.team,i=[{id:`player`,player:!0,name:e.driver.name,number:e.driver.number,team:r.name,tag:r.tag,c1:r.livery.c1,c2:r.livery.c2,points:e.points.player||0,rating:null},...e.rivals.map(t=>{let n=Cd[t.teamIndex];return{id:t.id,player:!1,name:t.name,number:t.number,team:n.name,tag:n.tag,c1:n.c1,c2:n.c2,points:e.points[t.id]||0,rating:t.rating}})];return i.sort((e,r)=>r.points-e.points||(t[r.id]||0)-(t[e.id]||0)||(n[r.id]||0)-(n[e.id]||0)||(e.name<r.name?-1:+(e.name>r.name))),i.map((e,n)=>({...e,pos:n+1,wins:t[e.id]||0}))}function Jh(e,t){if(!e||e.complete||e.round>=e.calendar.length)return null;let n=e.calendar[e.round],r={},i=null,a=0;for(let n of t||[]){let t=n.isPlayer?`player`:n.id;if(!t)continue;let o=uh(n.pos);e.points[t]=(e.points[t]||0)+o,r[t]=n.pos,t===`player`&&(i=n.pos,a=o)}let o=i?Eh(i,e.difficulty):0;return e.upgradePoints+=o,e.history.push({trackId:n,pos:i,points:a,upgrade:o,places:r}),e.round+=1,e.round>=e.calendar.length&&(e.complete=!0),{trackId:n,pos:i,points:a,upgrade:o,complete:e.complete,standings:qh(e)}}function Yh(e){return e.season=yh(e.season,1,98,1)+1,e.round=0,e.complete=!1,e.points={},e.history=[],e.calendar=Uu.slice(),(e.speedwayOffer===`accepted`||e.speedwayOffer===`declined`)&&(e.speedwayOffer=null),e}var Xh={circuitDay:{id:`day`,label:`DAY`,road:`#c8c2b2`,ink:`#ffe14a`},alpine:{id:`snow`,label:`SNOW`,road:`#e7f3ff`,ink:`#2a5f93`},forest:{id:`rain`,label:`RAIN`,road:`#7ea88a`,ink:`#e7ffe8`},desertNight:{id:`desert-night`,label:`DESERT NIGHT`,road:`#e0b15a`,ink:`#1a1208`},neonStreet:{id:`neon`,label:`NEON`,road:`#ff5ad4`,ink:`#7af6ff`},coastal:{id:`coast`,label:`COAST`,road:`#ecd7a4`,ink:`#1d6a78`}};function Zh(e){return Xh[e]||Xh.circuitDay}function Qh(e,t=160){let n=new Da(e.map(e=>new K(e[0],e[1],e[2])),!0,`centripetal`),r=Array(t);for(let e=0;e<t;e++){let i=n.getPoint(e/t);r[e]=[i.x,i.y,i.z]}return r}function $h(e){let t=0;for(let n=0;n<e.length;n++){let r=e[n],i=e[(n+1)%e.length];t+=Math.hypot(i[0]-r[0],i[2]-r[2])}return t}function eg(e){return isFinite(e)?(e/1e3).toFixed(2)+` km`:`-- km`}function tg(e,t,n,r=8){let i=1/0,a=-1/0,o=1/0,s=-1/0;for(let t of e){let e=t[0],n=t[2];e<i&&(i=e),e>a&&(a=e),n<o&&(o=n),n>s&&(s=n)}let c=Math.max(1,a-i),l=Math.max(1,s-o),u=Math.min((t-r*2)/c,(n-r*2)/l),d=(t-c*u)/2,f=(n-l*u)/2;return e.map(e=>({x:d+(e[0]-i)*u,y:n-(f+(e[2]-o)*u)}))}var ng=new Map;function rg(e){let t=ng.get(e.id);if(t)return t;let n=Qh(e.points,160);return t={id:e.id,name:e.name,samples:n,length:$h(n),tag:Zh(e.theme)},ng.set(e.id,t),t}function ig(e,t,n,r){e.beginPath();for(let n=0;n<t.length;n++){let r=t[n].x|0,i=t[n].y|0;n?e.lineTo(r,i):e.moveTo(r,i)}e.closePath(),e.strokeStyle=n,e.lineWidth=r,e.lineJoin=`miter`,e.lineCap=`square`,e.stroke()}function ag(e,t,n){let r=e?.getContext?.(`2d`);if(!r)return;let i=e.width,a=e.height;r.imageSmoothingEnabled=!1,r.fillStyle=`#070b10`,r.fillRect(0,0,i,a);let o=tg(t,i,a,12);ig(r,o,`#000`,12),ig(r,o,n?.road||`#8fa3b8`,7),ig(r,o,n?.ink||`#ffe14a`,2);let s=o[0],c=o[Math.min(o.length-1,4)];r.fillStyle=`#fff`,r.fillRect((s.x|0)-5,(s.y|0)-2,10,4),r.fillStyle=n?.ink||`#ffe14a`,r.fillRect((c.x|0)-2,(c.y|0)-2,4,4)}function og(e,t,n){if(!e?.length)return-1;let r=t>=0&&t<e.length?t:0,i=e[r],a=i.x+i.w/2,o=i.y+i.h/2,s=n===`left`||n===`right`,c=n===`left`||n===`up`?-1:1,l=-1,u=1/0;for(let t=0;t<e.length;t++){if(t===r)continue;let n=e[t],i=n.x+n.w/2-a,d=n.y+n.h/2-o,f=s?i:d,p=s?d:i;if(f*c<=1||Math.abs(p)>Math.abs(f)*2.2+8)continue;let m=Math.abs(f)+Math.abs(p)*2.4;m<u&&(u=m,l=t)}return l<0?r:l}function sg(e,t=.5){let n=e?.axes?.[0]||0,r=e?.axes?.[1]||0,i=t=>!!e?.buttons?.[t]?.pressed;return{left:i(14)||n<-t,right:i(15)||n>t,up:i(12)||r<-t,down:i(13)||r>t,a:i(0),b:i(1)}}var cg=[`up`,`down`,`left`,`right`,`a`,`b`];function lg(e,t){let n=[];for(let r of cg)t?.[r]&&!e?.[r]&&n.push(r);return n}var ug={announcer_intro:{voice:`announcer`,text:`Welcome to the grid. The track is set, the cars are ready, and the wait is almost over!`},announcer_intro_time_trial:{voice:`announcer`,text:`One car, one clear track. Time to chase the perfect lap!`},announcer_start:{voice:`announcer`,text:`Lights out, and away we go!`},announcer_lead_change:{voice:`announcer`,text:`We have a new race leader!`},announcer_player_overtake:{voice:`announcer`,text:`Great move! You have made the pass!`},announcer_player_overtaken:{voice:`announcer`,text:`A rival slips through. Time to fight back!`},announcer_fastest_lap:{voice:`announcer`,text:`That is the fastest lap of the race!`},announcer_off_track:{voice:`announcer`,text:`A trip off the track. Keep it tidy!`},announcer_last_lap:{voice:`announcer`,text:`The final lap. Everything to play for!`},announcer_chequered_flag:{voice:`announcer`,text:`The chequered flag is waving!`},announcer_winner:{voice:`announcer`,text:`The winner takes the flag! What a drive!`},announcer_finish_p1:{voice:`announcer`,text:`You win! A brilliant drive from start to finish!`},announcer_finish_p2:{voice:`announcer`,text:`Second place! A fantastic podium finish!`},announcer_finish_p3:{voice:`announcer`,text:`Third place! You are on the podium!`},announcer_finish_points:{voice:`announcer`,text:`A strong race. Points in the bag!`},announcer_finish:{voice:`announcer`,text:`That is the flag. Great effort out there!`},radio_start:{voice:`engineer`,text:`Radio check. Nice and clean into turn one.`},radio_gap_ahead:{voice:`engineer`,text:`Gap ahead is`},radio_gap_behind:{voice:`engineer`,text:`Gap behind is`},radio_box_box:{voice:`engineer`,text:`Box box. Pit this lap. Your tyres need changing.`},radio_tyre_warning:{voice:`engineer`,text:`Tyre wear is climbing. Be smooth with the steering.`},radio_tyre_critical:{voice:`engineer`,text:`Tyres are critical. We need to box soon.`},radio_wet_weather:{voice:`engineer`,text:`Rain is here. We should switch to wet tyres.`},radio_dry_weather:{voice:`engineer`,text:`The track is drying. Dry tyres are the call.`},radio_push:{voice:`engineer`,text:`You have a gap. Push now, but keep it clean.`},radio_bring_home:{voice:`engineer`,text:`Last lap. Bring it home.`},radio_position:{voice:`engineer`,text:`Current position is`},radio_pit_confirmed:{voice:`engineer`,text:`Pit confirmed. Entry is on your left.`},radio_pit_complete:{voice:`engineer`,text:`Fresh tyres on. Good stop. push when you are ready.`}},dg=Object.freeze({cutscenes:!0,voiceVolume:.75,voiceMuted:!1});Object.freeze({announcer:4,engineer:6,position:12,offTrack:20,tyres:30,gaps:32,push:45,pitDecision:35});var fg={announcer:`RACE CONTROL`,engineer:`PIT WALL`},pg=e=>Math.max(0,Math.min(1,e)),mg=e=>Number.isFinite(+e)?+e:0;function hg(e={}){return!e||typeof e!=`object`?{...dg}:{cutscenes:typeof e.cutscenes!=`boolean`||e.cutscenes,voiceVolume:Number.isFinite(e.voiceVolume)?pg(e.voiceVolume):.75,voiceMuted:typeof e.voiceMuted==`boolean`&&e.voiceMuted}}function gg(e,t={}){return!t||typeof t!=`object`?hg(e):(Object.keys(t).length===1&&`voiceVolume`in t&&(t={...t,voiceMuted:!1}),hg({...hg(e),...t}))}function _g(e,t){return hg(t).cutscenes?e===`tt`?2.8:8.6:0}function vg(e,t={}){return!e||e.finished||e.pit?.stage>0||e.pit?.request||Number.isFinite(t.laps)&&mg(e.laps)>=t.laps-1?!1:mg(e.wear)>=.74||e.tire===`dry`&&(mg(t.rain)>=.45||mg(t.wetness)>=.32)||e.tire===`wet`&&mg(t.rain)<.05&&mg(t.wetness)<.14}function yg(e){return mg(e?.wear)>=.68?`critical`:mg(e?.wear)>=.48?`warning`:`ok`}function bg(e={}){let t=[];return Number.isFinite(e.ahead)&&t.push(Sg(`radio_gap_ahead`,`GAP AHEAD  +${e.ahead.toFixed(1)}s`,35)),Number.isFinite(e.behind)&&t.push(Sg(`radio_gap_behind`,`GAP BEHIND  -${e.behind.toFixed(1)}s`,35)),t}function xg(e){return e===1?`announcer_finish_p1`:e===2?`announcer_finish_p2`:e===3?`announcer_finish_p3`:e<=8?`announcer_finish_points`:`announcer_finish`}function Sg(e,t,n=30){return ug[e]?{id:e,channel:ug[e].voice,speaker:fg[ug[e].voice],caption:t||ug[e].text.toUpperCase(),priority:n}:null}function Cg(e,t={}){let n=t.solo??t.mode===`tt`,r=t.position||t.player?.pos||0;switch(e?.type){case`intro`:return[Sg(n?`announcer_intro_time_trial`:`announcer_intro`,null,100)];case`go`:return n?[]:[Sg(`announcer_start`,null,100),Sg(`radio_start`,`RADIO CHECK  ·  NICE AND CLEAN INTO TURN ONE`,100)];case`leadchange`:return n?[]:[Sg(`announcer_lead_change`)];case`winner`:return n||e.car?.isPlayer?[]:[Sg(`announcer_winner`,null,90)];case`poschange`:{if(n)return[];let t=e.to<e.from;return[Sg(t?`announcer_player_overtake`:`announcer_player_overtaken`,t?`GREAT MOVE  P${e.to}`:`RIVAL THROUGH  P${e.to}`,60),Sg(`radio_position`,`POSITION  P${e.to}  ${t?`››`:`‹‹`}`,60)]}case`laptime`:return!n&&e.isBest?[Sg(`announcer_fastest_lap`,`FASTEST LAP  ${(+e.time||0).toFixed(3)}s`,55)]:[];case`offtrack`:return n?[]:[Sg(`announcer_off_track`)];case`finallap`:return n?[]:[Sg(`announcer_last_lap`,null,100),Sg(`radio_bring_home`,null,100)];case`finish`:return n||!e.car?.isPlayer?[]:[Sg(`announcer_chequered_flag`,null,100),Sg(xg(r),`CHEQUERED FLAG  YOU FINISH P${r}`,100)];case`pit`:return e.car?.isPlayer?[Sg(`radio_pit_complete`,null,100)]:[];default:return[]}}function wg(e={}){let t=e.player||{};if(e.solo||e.phase!==`racing`||t.finished)return[];let n=[];vg(t,e)&&n.push(Sg(`radio_box_box`,`BOX BOX  PIT THIS LAP  ·  TYRES ${Math.round(mg(t.wear)*100)}% WORN`,100));let r=yg(t);return r!==`ok`&&n.push(Sg(r===`critical`?`radio_tyre_critical`:`radio_tyre_warning`,`${r===`critical`?`TYRES CRITICAL`:`TYRE WEAR`}  ${Math.round(mg(t.wear)*100)}% WORN`,r===`critical`?75:45)),t.tire===`dry`&&mg(e.rain)>=.45&&n.push(Sg(`radio_wet_weather`,`RAIN  ·  WET TYRES ADVISED`,80)),t.tire===`wet`&&mg(e.rain)<.05&&mg(e.wetness)<.14&&n.push(Sg(`radio_dry_weather`,`TRACK DRYING  ·  DRY TYRES ADVISED`,75)),e.reportGaps&&n.push(...bg(e.gaps)),e.time>=50&&mg(e.gaps?.behind)>=2.2&&n.push(Sg(`radio_push`,`PUSH NOW  ·  GAP BEHIND +${e.gaps.behind.toFixed(1)}s`,40)),e.finalLap&&n.push(Sg(`radio_bring_home`,null,100)),n}var Tg=class{constructor({solo:e=!1}={}){this.solo=e,this.pending={announcer:null,engineer:null},this.next={announcer:0,engineer:0},this.lastPlayed={},this.history={},this.lastLeader=null,this.wasOff=!1,this.gapSide=`ahead`,this.nextGap=50,this.gapDeadline=0,this.lastGaps=null,this.winnerAnnounced=!1}accept(e,t=0){if(!e||this.solo&&e.channel===`engineer`||!this.readyFor(e,t))return!1;let n=this.pending[e.channel];return!n||e.priority>=n.priority?(this.pending[e.channel]=e,!0):!1}readyFor(e,t){let n=e.id;return e.id.startsWith(`announcer_player_`)?n=`overtake`:e.id.startsWith(`radio_gap_`)?n=`gap`:{announcer_off_track:20,announcer_lead_change:16,radio_box_box:35,radio_tyre_warning:30,radio_tyre_critical:25,radio_position:12,radio_push:45,radio_gap_ahead:32,radio_gap_behind:32}[e.id],t+1e-6>=(this.history[n]??-1e9)}event(e,t={},n=0){if(!(e.type===`winner`&&this.winnerAnnounced)){e.type===`winner`&&(this.winnerAnnounced=!0);for(let r of Cg(e,t))this.accept(r,n)}}telemetry(e,t=0){if(this.solo||e.phase!==`racing`||e.player?.finished)return;let n=e.player||{};e.leaderId!==this.lastLeader&&(this.lastLeader!==null&&this.event({type:`leadchange`},e,t),this.lastLeader=e.leaderId);let r=n.v>12&&[`grass`,`gravel`].includes(n.surface);r&&!this.wasOff&&this.event({type:`offtrack`},e,t),this.wasOff=r,this.lastGaps=e.gaps;for(let n of wg({...e,solo:!1,reportGaps:!1}))this.accept(n,t);if((this.pending.engineer?.priority??0)<=45&&t>=this.nextGap&&t>=this.gapDeadline&&t>=this.next.engineer){let n=this.gapSide,r=e.gaps?.[n];Number.isFinite(r)&&this.accept(bg({[n]:r})[0],t)}}tick(e,t={}){let n=[];for(let r of[`announcer`,`engineer`]){let i=this.pending[r];if(!(!i||e<this.next[r]||t[r])){if(this.pending[r]=null,this.lastPlayed[r]=e,i.id.startsWith(`radio_gap_`)){this.history.gap=e+32;let t=i.id.endsWith(`ahead`)?`ahead`:`behind`;this.gapSide=t===`ahead`?`behind`:`ahead`,this.gapDeadline=e+7,this.nextGap=e+32}else{let t={announcer_lead_change:16,announcer_off_track:20,radio_box_box:35,radio_tyre_warning:30,radio_tyre_critical:25,radio_position:12,radio_push:45,radio_pit_confirmed:25},n=i.id;i.id.startsWith(`announcer_player_`)&&(n=`overtake`),this.history[n]=e+(t[i.id]||(n===`overtake`?4:2))}this.next[r]=e+(r===`announcer`?3:3.7),n.push(i)}}return n}release(e,t){this.next[e]=t+.8}stop(){this.pending.announcer=this.pending.engineer=null}},Eg=class{constructor(e,{fetchClip:t=(...e)=>fetch(...e),baseUrl:n=`/drive/`}={}){this.engine=e,this.locationHost=typeof location<`u`?location.host:``,this.baseUrl=n||(this.locationHost.startsWith(`127.0.0.1:4177`)?`/`:`/drive/`),this.fetchClip=t,this.volume=.75,this.muted=!1,this.cache=new Map,this.pending=new Map,this.channelPending={announcer:0,engineer:0},this.active={announcer:null,engineer:null},this.generation={announcer:0,engineer:0},this.reserved={announcer:!1,engineer:!1},this.degraded=!1,this.enabled=!0}init(){this.engine.init();let e=this.engine.ctx;return e?this.ctx===e?(e.resume?.(),this.setSettings({voiceVolume:this.volume,voiceMuted:this.muted}),!0):(this.ctx=e,this.mix=e.createGain(),this.mix.gain.value=this.muted?0:this.volume*.95,this.mix.connect(this.engine.master),this.setSettings({voiceVolume:this.volume,voiceMuted:this.muted}),this.radio=e.createBiquadFilter(),this.radio.type=`bandpass`,this.radio.frequency.value=1450,this.radio.Q.value=.55,this.radioTrim=e.createGain(),this.radioTrim.gain.value=1.35,this.radio.connect(this.radioTrim),this.radioTrim.connect(this.mix),!0):!1}unlock(){if(!this.init())return Promise.resolve(!1);try{let e=this.ctx.createBuffer(1,1,this.ctx.sampleRate),t=this.ctx.createBufferSource();t.buffer=e,t.connect(this.mix),t.start(0)}catch{}return this.ctx.resume?.()||Promise.resolve()}setSettings({voiceVolume:e=.75,voiceMuted:t=!1}={}){this.volume=Math.max(0,Math.min(1,Number(e)||0)),this.muted=!!t,this.mix&&this.ctx&&this.mix.gain.setTargetAtTime(this.muted?0:this.volume*.95,this.ctx.currentTime,.025)}url(e){let t=this.baseUrl;return`${t.endsWith(`/`)?t:t+`/`}audio/vo/${e}.mp3`}async load(e){if(this.cache.has(e))return this.cache.get(e);if(this.pending.has(e))return this.pending.get(e);let t=(async()=>{let t=await this.fetchClip(this.url(e));if(!t.ok&&this.baseUrl!==`/`&&typeof window<`u`){let n=`${location.protocol}//${location.host}/audio/vo/${e}.mp3`;t=await this.fetchClip(n)}if(!t.ok)throw Error(`Clip unavailable`);let n=await t.arrayBuffer(),r=await this.ctx.decodeAudioData(n);return this.cache.set(e,r),r})().finally(()=>this.pending.delete(e));return this.pending.set(e,t),t}async play(e,{onStart:t,onEnd:n}={}){if(!this.enabled)return n?.(e,!1),!1;if(!this.init())return this.degraded=!0,n?.(e,!1),!1;let r=e.channel;this.stop(r);let i=this.generation[r];this.reserved[r]=!0,this.channelPending[r]++;try{let a=await this.load(e.id);if(i!==this.generation[r])return!1;let o=this.ctx.createBufferSource();o.buffer=a,r===`engineer`?(o.connect(this.radio),o.playbackRate.value=1.01,this.squelch()):o.connect(this.mix);let s={generation:i,source:o,onEnd:n,cue:e,stopped:!1};return this.active[r]=s,this.engine.voiceDuck=.45,o.onended=()=>this.finish(r,s,!0),o.start(),this.degraded=!1,t?.(e,a.duration),!0}catch{return i===this.generation[r]&&(this.reserved[r]=!1,this.onCancel?.(r),this.degraded=!0,n?.(e,!1)),!1}}squelch(){let e=this.ctx,t=e.createBuffer(1,Math.ceil(e.sampleRate*.065),e.sampleRate),n=t.getChannelData(0);for(let e=0;e<n.length;e++)n[e]=(Math.random()*2-1)*Math.exp(-e/n.length*9)*.055;let r=e.createBufferSource(),i=e.createGain();r.buffer=t,r.connect(this.radio),r.connect(i),i.gain.value=.45,i.connect(this.mix),r.start()}finish(e,t,n){if(!(this.active[e]!==t||t.stopped)){this.active[e]=null,this.channelPending[e]=0,this.reserved[e]=!1,!this.active.announcer&&!this.active.engineer&&(this.engine.voiceDuck=0);try{t.source.disconnect()}catch{}t.onEnd?.(t.cue,n)}}stop(e){this.generation[e]++;let t=this.active[e];if(t){t.stopped=!0,this.active[e]=null,this.channelPending[e]=0,this.reserved[e]=!1,!this.active.announcer&&!this.active.engineer&&(this.engine.voiceDuck=0);try{t.source.onended=null,t.source.stop(),t.source.disconnect()}catch{}t.onEnd?.(t.cue,!1)}else this.channelPending[e]=0,this.reserved[e]=!1,this.onCancel?.(e)}stopAll(){this.stop(`announcer`),this.stop(`engineer`)}isPlaying(e){return!!(this.reserved[e]||this.channelPending[e])}};function Dg(e,t,n){let r=t?.rain>.35||t?.wetness>.25?`WET CONDITIONS`:t?.opts?.weather===`dry`?`DRY CONDITIONS`:e?.night?`NIGHT SESSION`:`DAY SESSION`;return`${n?`ROUND ${n.index+1} / ${n.count}  ·  `:``}${String(e?.name||`CIRCUIT`).replace(/([a-z])([A-Z])/g,`$1 $2`).toUpperCase()}  ·  ${r}`}function Og(r,i,a,o=`race`,s){let c=_g(o,s),l=e(a,0,Math.max(c,.001)),u=c?l/c:1,d=(e,t=0,n=0)=>{let i=r.at(e,t);return[i.x,i.y+n,i.z]},f,p,m=54,h;if(o===`tt`){let e=n(0,1,u),r=d(i.s,i.d,.65);f=d(i.s-t(14,9,e),t(12,5,e),t(5,2.5,e)),p=r,h=`reveal`}else if(u<.38){let e=n(0,.38,u),a=i.s+r.length*t(.6,.19,e);d(a,0,1),f=d(a-t(35,16,e),t(72,25,e),t(98,34,e)),p=d(a+22,0,0),m=t(60,53,e),h=`flyover`}else{let e=n(.38,1,u),r=i.s;f=d(r-t(25,9,e),t(17,5.2,e),t(8,2.6,e));let a=d(r+t(36,0,e),0,t(0,.75,e)),o=d(r,i.d,.7);p=[t(a[0],o[0],e),t(a[1],o[1],e),t(a[2],o[2],e)],h=e<.62?`grid`:`reveal`}return{position:f,target:p,fov:m,phase:h,progress:u,reveal:o===`tt`?u>=.12:u>=.4,duration:c}}var kg=class{constructor(e,t){this.duration=_g(e,t),this.elapsed=0,this.active=this.duration>0,this.skipped=!1}advance(e){return this.active&&(this.elapsed=Math.min(this.duration,this.elapsed+Math.max(0,e)),this.elapsed>=this.duration&&(this.active=!1)),!this.active}skip(){return this.active?(this.active=!1,this.skipped=!0,this.elapsed=this.duration,!0):!1}},Y=e=>document.getElementById(e),Ag=Y(`view`),jg=matchMedia(`(pointer:coarse)`).matches||`ontouchstart`in window;jg&&document.body.classList.add(`touch`);var Mg=new iu({canvas:Ag,antialias:!1,powerPreference:`high-performance`});Mg.setPixelRatio(1),Mg.shadowMap.enabled=!0,Mg.shadowMap.type=0,Mg.shadowMap.autoUpdate=!1;var Ng=new Pn(320,180,{minFilter:B,magFilter:B,depthBuffer:!0,samples:zm(2)}),Pg=new br,Fg=new Eo(58,16/9,.5,3200),Ig=new br,Lg=new Do(-1,1,1,-1,0,1),Rg=new Ba({uniforms:{tex:{value:Ng.texture},res:{value:new fn(320,180)},k:{value:3},rain:{value:0},time:{value:0},sat:{value:1},tint:{value:new K(1,1,1)},speed:{value:0}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }`,fragmentShader:`uniform sampler2D tex; uniform vec2 res; uniform float k; uniform float rain; uniform float time; uniform float sat; uniform vec3 tint; uniform float speed; varying vec2 vUv;
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
      c = floor((c+b)*24.+.5)/24.; gl_FragColor = vec4(c,1.); }`,depthTest:!1,depthWrite:!1});Ig.add(new Ri(new ka(2,2),Rg));var zg={level:2,auto:!navigator.webdriver,fps:60,gov:new Xm({level:2})},Bg=Bm(innerWidth,innerHeight,1,Rm(zg.level));function Vg(){let e=Math.min(window.devicePixelRatio||1,jg?2:3);Bg=Bm(innerWidth,innerHeight,e,Rm(zg.level)),Mg.setPixelRatio(1),Mg.setSize(Bg.W,Bg.H,!1),Ng.setSize(Bg.lowW,Bg.lowH),Rg.uniforms.res.value.set(Bg.lowW,Bg.lowH),Rg.uniforms.k.value=Bg.k,Fg.aspect=Bg.lowW/Bg.lowH,Fg.updateProjectionMatrix()}function Hg(t,n,r){let i=Math.max(Fg.aspect,.2),a=2*Math.atan(Math.tan(n*Math.PI/360)/i)*180/Math.PI;return e(Math.max(t,a),t,r)}function Ug(){Vg(),Ev()}addEventListener(`resize`,Ug),Ug();var Wg=new Am,Gg=new Im,Kg=new Eg(Gg),qg=new Tg,Jg=null,Yg=0,Xg=0,Zg=null;function Qg(){return{announcer:Kg.isPlaying(`announcer`),engineer:Kg.isPlaying(`engineer`)}}Kg.onCancel=e=>qg.release(e,Yg);var $g=(()=>{try{return localStorage.setItem(`_t`,`1`),localStorage.removeItem(`_t`),localStorage}catch{return null}})(),e_=ld($g),t_=Ch($g),X=Hh($g);X&&(t_={driver:{...X.driver},team:X.team});var Z={...hg(),mode:`race`,difficulty:`normal`,cls:`gp`,laps:3,weather:`auto`,track:Wu,vibration:!1,...e_.settings||{}};Z.vibration=!!Z.vibration,Object.assign(Z,hg(Z)),Kg.setSettings(Z),Z.track=Gu(Z.track).id;var Q=new Mu(Gu(Z.track)),n_=Em(Q.themeId);n_.build(Pg,Q);var r_={},$=null,i_=[],a_=null,o_=null,s_=[`chase`,`overhead`,`full`],c_={chase:`CHASE`,overhead:`TOP`,full:`MAP`},l_=`chase`,u_={chase:1,overhead:0,full:0},d_=!1,f_=!1,p_=`menu`,m_=!1,h_=null,g_=`quick`,__=!1,v_=`menu`,y_=null,b_=`c1`,x_=new Gp;x_.addTo(Pg);var S_=null,C_=null,w_={x:0,y:10,z:0,yaw:0,ly:0},T_=0,E_=!1,D_=0,O_=-1,k_=0,A_=-1,j_=-1,M_=-1,N_=null,P_=0,F_=0,I_=-1,L_=0,R_=0,z_=0,B_=0,V_=null,H_=[...document.querySelectorAll(`#secs span`)];function U_(){for(let e of i_)Pg.remove(e.group),Bp(e);i_=[],a_&&=(Pg.remove(a_.group),Bp(a_),null),x_.clear()}var W_=()=>Du(Z.difficulty,Z.lineGuide);function G_(){let e=W_()&&!!S_;S_?.setEnabled(e&&!!$);for(let e of[`optLine`])Y(e)&&Cv(e).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===`on`===W_()));let t=Z.difficulty===`hard`;for(let e of[`rowLine`,`pLine`])Y(e)?.classList.toggle(`na`,t);Y(`pLine`)&&(Y(`pLine`).textContent=t?`LINE: NONE (HARD)`:`LINE: `+(W_()?`ON`:`OFF`)),Y(`optLine`)&&Cv(`optLine`).forEach(e=>e.disabled=t)}function K_(e){return Z.difficulty===`hard`?(G_(),!1):(Z.lineGuide=!!e,q_(),G_(),W_())}function q_(){$g&&(e_.settings={...e_.settings||{},mode:Z.mode,difficulty:Z.difficulty,cls:Z.cls,laps:Z.laps,weather:Z.weather,track:Z.track,lineGuide:Z.lineGuide,vibration:!!Z.vibration,...hg(Z)},ud($g,e_))}function J_(){return X?{driver:X.driver,team:X.team}:t_}function Y_(){let e=J_(),t=e.team.livery||{};return wf(Sf({driver:e.driver.name,name:e.team.name,tag:e.team.tag,pattern:t.pattern,c1:t.c1,c2:t.c2,c3:t.c3,number:e.driver.number}))}var X_=[`menu`,`results`,`pause`,`career`,`standings`,`upgrades`,`editor`,`recruit`];function Z_(){for(let e of X_)Y(e)?.classList.add(`hidden`);Nv()}function Q_(){S_&&=(Pg.remove(S_.mesh),S_.mesh.geometry.dispose(),S_.mesh.material.dispose(),null),C_&&=(Pg.remove(C_.mesh),C_.mesh.geometry.dispose(),C_.mesh.material.dispose(),null)}function $_(e,t=!0){let n=Gu(e);if(Q&&Q.id===n.id&&n_&&n_.name===n.theme)return t&&(Z.track=n.id),Q;U_(),Q_();let r=n_?n_.quality:zg.level;return n_?.dispose(),Q=new Mu(n),n_=Em(n.theme),n_.build(Pg,Q),n_.setQuality(r),vy(),zy(),t&&(Z.track=n.id),Q}function ev(){if(!X)return;let e=Gh(X);e&&$_(e,!1)}function tv(e={}){Kg.stopAll(),qg.stop(),mv();let{grid:t,playerTeam:n,driver:r,keepCareer:i,restore:a,rng:o,...s}=e;g_=i?`career`:`quick`,Object.assign(Z,s),Z.mode!==`race`&&Z.mode!==`tt`&&(Z.mode=`race`),dd(e_,Z.cls)||(Z.cls=`gp`),Q&&Q.id===Gu(Z.track).id||$_(Z.track),clearTimeout(V_),U_(),$=new Vd(Q,{mode:Z.mode,difficulty:Z.difficulty,cls:Z.cls,laps:Z.laps,weather:Z.weather,best:vd(e_,Z.cls),rng:o,grid:t,playerTeam:n||Y_(),driver:r||null}),$.cars.forEach(e=>{let t=kp(e.cls.id,e.team,e.isPlayer,!1,e.teamIndex);t.st={},t.setTire(e.tire),Pg.add(t.group),i_.push(t),e.mesh=t}),Q_(),S_=Kp(Q,$.cls),Pg.add(S_.mesh),C_&&C_.cls===$.cls.id||(C_&&Pg.remove(C_.mesh),C_=Jp(Q,$.cls),C_.cls=$.cls.id,Pg.add(C_.mesh)),G_(),n_.setCars(i_),o_=$.solo?eh($g,r_,Q.id,Z.cls):null,o_&&(a_=kp(Z.cls,$.player.team,!1,!0,$.player.teamIndex),a_.group.visible=!1,Pg.add(a_.group)),h_=g_===`career`?{kind:`pos`,target:10,text:Q.name}:yd(Z,e_),p_=`racing`,m_=!1,__=!1,I_=-1,O_=-1,T_=0,k_=0,D_=0;for(let e of[`banner`,`flag`])Y(e).classList.remove(`on`);Y(`posPop`).classList.remove(`on`),Z_(),Y(`hud`).classList.remove(`hidden`),Y(`goal`)&&(Y(`goal`).textContent=g_===`career`?`ROUND ${X.round+1}/${X.calendar.length}  ${Q.name.toUpperCase()}`:`GOAL: `+h_.text),Y(`board`).classList.toggle(`hidden`,$.solo),Y(`bEnd`)?.classList.toggle(`hidden`,!$.solo),Y(`pos`).classList.toggle(`tt`,$.solo),dv(),new URLSearchParams(location.search).get(`rain`)===`1`&&$.setRain(!0),n_.setWeather({rain:$.rain,wetness:$.wetness}),n_.setStartLights(0,!1),qg=new Tg({solo:$.solo}),Yg=0,Xg=0,Zg=null,yv();let c=$.player;return w_.init=!1,w_.yaw=c.theta,w_.x=c.x,w_.z=c.z,w_.y=c.y+6,w_.ly=c.y,Object.assign(Ly,{x:c.x,y:c.y,z:c.z,yaw:c.theta,xV:0,yV:0,zV:0,lastX:void 0}),ub.force(),xb(),_b=0,Gg.init(),Gg.music=!1,rv(!1),nv(($.solo,`GET READY`),3),_g(Z.mode,Z)>0&&pv(),Kg.setSettings(Z),sv(),a&&Object.assign(Z,a),q_(),$}function nv(e,t=2.5){Y(`msg`).textContent=e,R_=t}function rv(e){$&&($.autopilot=e,Y(`bAuto`).classList.toggle(`on`,e))}function iv(e,t=!1){if(typeof e==`string`&&e===`top`&&(e=`overhead`),!s_.includes(e))return l_;if(l_=e,t){for(let t of s_)u_[t]=+(t===e);d_=!0}let n=Y(`bCam`);return n.classList.toggle(`on`,e!==`chase`),n.textContent=c_[e],l_}function av(){return iv(s_[(s_.indexOf(l_)+1)%s_.length])}function ov(e){Gg.setMuted(e),Y(`bMute`).classList.toggle(`on`,e),Y(`bMute`).textContent=e?`MUTE`:`SND`,sv()}function sv(){if(!Y(`optCutscene`))return;Y(`optCutscene`).textContent=Z.cutscenes?`INTRO ON`:`INTRO OFF`,Y(`optCutscene`).classList.toggle(`sel`,Z.cutscenes),Y(`optCutscene`).setAttribute(`aria-pressed`,String(Z.cutscenes));let e=Z.voiceMuted||Z.voiceVolume===0;Y(`optVoiceMute`).textContent=Z.voiceMuted?`VOICE OFF`:`VOICE ON`,Y(`optVoiceMute`).classList.toggle(`sel`,!Z.voiceMuted),Y(`optVoiceMute`).setAttribute(`aria-pressed`,String(!Z.voiceMuted)),Y(`voiceLevel`).value=String(Math.round(Z.voiceVolume*100)),Y(`voiceLevel`).setAttribute(`aria-valuetext`,Math.round(Z.voiceVolume*100)+` percent`),Y(`voiceLevelValue`).textContent=e?`MUTED`:Math.round(Z.voiceVolume*100)+`%`,Kg.setSettings(Z)}function cv(){let e=!!Z.vibration;Y(`optVibe`)&&Cv(`optVibe`).forEach(t=>t.classList.toggle(`sel`,t.dataset.v===`on`===e))}function lv(e){return Z.vibration=!!e,q_(),cv(),Z.vibration}function uv(e){Object.assign(Z,gg(Z,e)),q_(),sv()}Y(`optCutscene`).addEventListener(`click`,()=>uv({cutscenes:!Z.cutscenes})),Y(`optVoiceMute`).addEventListener(`click`,()=>uv({voiceMuted:!Z.voiceMuted})),Y(`voiceLevel`).addEventListener(`input`,e=>{Gg.init(),Kg.unlock().catch(()=>!1),uv({voiceVolume:e.target.value/100})}),ov(Gg.muted);function dv(){H_.forEach((e,t)=>{e.className=``,e.textContent=`S`+(t+1)}),Y(`split`).textContent=``}function fv(){mv(!0),Kg.stopAll(),qg.stop(),yv(),clearTimeout(V_),p_=`menu`,Z_(),Y(`hud`).classList.add(`hidden`),Y(`menu`).classList.remove(`hidden`),Y(`again-btn`)?.classList.remove(`hidden`),Y(`menu-btn`)&&(Y(`menu-btn`).textContent=`MENU`),Z.track!==Q.id&&$_(Z.track),Ov(),Lv()}function pv(){if($.autopilot=!1,Jg=new kg(Z.mode,Z),!Jg.active)return;p_=`cinematic`;let e=g_===`career`&&X?Wh(X):null;Y(`introLocation`).textContent=Q.name.toUpperCase(),Y(`introDetails`).textContent=Dg(n_,$,e),Y(`introShot`).textContent=$.solo?`TIME TRIAL  ·  YOUR CAR`:`GRID ${$.cars.length}  ·  YOUR START P${$.player.pos}`,Y(`introEyebrow`).textContent=$.solo?`DRIVE  ·  THE PERFECT LAP`:`DRIVE  ·  RACE DAY`,Y(`introTitleCard`).hidden=!1,Y(`broadcastIntro`).classList.remove(`hidden`),document.body.classList.add(`intro-active`),bv();let t=Cg({type:`intro`},{solo:$.solo,intro:!0})[0];t.caption=`${Q.name.toUpperCase()}  /  ${$.solo?`ONE CAR. ONE CLEAR TRACK.`:`THE GRID IS READY.`}`,qg.pending.announcer=t,xv(0)}function mv(e=!1){Jg&&(Jg=null,Y(`broadcastIntro`).classList.add(`hidden`),document.body.classList.remove(`intro-active`),document.body.classList.remove(`intro-has-caption`),e||yv())}function hv(e=!1){Jg&&(e&&Jg.skip(),mv(),$&&(p_=`racing`,_b=0,gb=performance.now(),R_=e?3:1.5,yv(),xb(),d_=!0,Gg.music=!1,$.solo||nv(e?`GET READY`:`LIGHTS NEXT`,2),new URLSearchParams(location.search).get(`holdvideo`)===`1`&&(f_=!0)))}function gv(){return!Jg||!Jg.active?!1:(Kg.unlock().catch(()=>!1),Kg.stopAll(),qg.stop(),Wg.keys.clear(),Wg.takeActions(),hv(!0),!0)}function _v(e){vv(e),Kg.play(e,{onStart:(t,n)=>qg.release(e.channel,Yg+n)})}function vv(e,t=4.8){let n=Y(`voiceCaption`);n.classList.remove(`hidden`),n.dataset.channel=e.channel,n.dataset.muted=String(Gg.muted||Z.voiceMuted||Z.voiceVolume===0),n.querySelector(`.voice-speaker`).textContent=e.speaker||(e.channel===`engineer`?`PIT WALL`:`RACE CONTROL`),n.querySelector(`.voice-text`).textContent=e.caption.toUpperCase(),n.querySelector(`.voice-sr`).textContent=`${e.speaker||`RACE CONTROL`}: ${e.caption}`,Zg=e.channel,Xg=Yg+t,bv()}function yv(e){e&&Zg!==e||(Y(`voiceCaption`).classList.add(`hidden`),Y(`voiceCaption`).dataset.channel=``,Zg=null,Xg=0,bv())}function bv(){let e=Y(`voiceCaption`);Jg&&!e.classList.contains(`hidden`)?Y(`broadcastIntro`).appendChild(e):e.parentElement!==Y(`app`)&&Y(`app`).appendChild(e)}function xv(e){if(Yg+=e,p_===`racing`&&!$.solo&&$.phase!==`countdown`){let e=$.player;qg.telemetry({phase:$.phase,player:e,rain:$.rain,wetness:$.wetness,gaps:$.phase===`racing`?$.gaps(e):{},leaderId:$.order[0]?.id,time:Yg},Yg)}for(let e of qg.tick(Yg,Qg()))_v(e);Zg&&Yg>Xg&&!Kg.isPlaying(Zg)&&yv()}addEventListener(`pointerdown`,()=>{Gg.init(),Kg.unlock().catch(()=>!1)},{capture:!0}),addEventListener(`keydown`,()=>{Gg.init(),Kg.unlock().catch(()=>!1)},{capture:!0}),addEventListener(`keydown`,e=>{p_!==`cinematic`||e.repeat||(e.preventDefault(),e.stopImmediatePropagation(),gv())},{capture:!0}),document.addEventListener(`pointerdown`,e=>{p_===`cinematic`&&(e.preventDefault(),e.stopImmediatePropagation(),gv())},{capture:!0});function Sv(e){e&&p_===`cinematic`&&gv(),!$||p_!==`racing`&&p_!==`paused`||(e&&Kg.stopAll(),p_=e?`paused`:`racing`,Y(`pause`).classList.toggle(`hidden`,!e),Y(`finish-btn`).classList.toggle(`hidden`,!$.solo))}var Cv=e=>[...Y(e).querySelectorAll(`button`)];function wv(e,t,n){let r=Y(e);if(!r)return;let i=gf(t);r.style.background=n==null?i:`linear-gradient(135deg, ${i} 58%, ${gf(n)} 58%)`}function Tv(){let e=Y(`optTrack`);e.innerHTML=Hu.map(e=>{let t=rg(e);return`<button type="button" class="tcard nav" data-v="${e.id}" data-tag="${t.tag.id}"><canvas class="thumb" width="168" height="112" aria-hidden="true"></canvas><span class="tmeta"><b>${Zm(e.name.toUpperCase())}</b><span class="tag">${Zm(t.tag.label)}</span><span class="len">${Zm(eg(t.length))}</span><span class="tbest" data-best></span></span></button>`}).join(``);for(let t of e.querySelectorAll(`.tcard`)){let e=rg(Gu(t.dataset.v));ag(t.querySelector(`canvas`),e.samples,e.tag)}}Tv();function Ev(){let e=Y(`optTrack`);if(!e)return;let t=[...e.querySelectorAll(`.tcard`)];if(!t.length)return;let n=Math.max(0,t.findIndex(e=>e.dataset.v===Z.track)),r=t.length;t.forEach((e,t)=>{let i=t-n;i>r/2&&(i-=r),i<-r/2&&(i+=r);let a=Math.abs(i)<=0;e.classList.toggle(`ghost`,a&&i!==0),e.classList.toggle(`away`,!a),e.tabIndex=a?0:-1,e.style.setProperty(`--d`,String(i))})}function Dv(){for(let e of Y(`optTrack`).querySelectorAll(`.tcard`)){let t=gd(e_,e.dataset.v,Z.cls),n=e.querySelector(`[data-best]`);n&&(n.textContent=`BEST `+(t?Ku(t.bestLap):`--:--.---`))}}function Ov(){let e=(e,t)=>Cv(e).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===String(t)));e(`optMode`,Z.mode),e(`optDiff`,Z.difficulty),e(`optClass`,Z.cls),e(`optLaps`,Z.laps),e(`optWeather`,Z.weather),e(`optTrack`,Z.track),Cv(`optMode`).forEach(e=>e.setAttribute(`aria-selected`,e.classList.contains(`sel`)?`true`:`false`));let t=Z.mode===`tt`,n=Z.mode===`career`;Y(`rowLaps`).classList.toggle(`hidden`,t||n),Y(`rowWeather`).classList.toggle(`hidden`,t),Y(`rowTrack`).classList.toggle(`hidden`,n),Y(`rowClass`).classList.toggle(`hidden`,n);let r=!dd(e_,`speedway`);Y(`clsSpeedway`).classList.toggle(`locked`,r),Y(`clsSpeedway`).textContent=r?`SPEEDWAY [LOCKED]`:`SPEEDWAY`;let i=Y_();if(wv(`teamSwatch`,i.c1,i.c2),Y(`teamLabel`).textContent=i.name,n){let e=X?Wh(X):null,t=X?`${X.driver.name} · ${X.team.name}`:`Create a driver and a team`,n=e?Gu(e.id).name:X?.complete?`Season complete`:`A season across every circuit`;Y(`goalBox`).innerHTML=`<b>CAREER</b> ${Zm(t)}<br>${Zm(n)}`,Y(`start-btn`).textContent=X?`CAREER`:`NEW CAREER`}else{let e=yd(Z,e_),t=pd(e_,Z.cls);Y(`goalBox`).innerHTML=`<b>GOAL</b> ${e.text}`+(t&&isFinite(t.bestLap??NaN)?`<br>Best lap (${Z.cls.toUpperCase()}): ${Ku(t.bestLap)}`:``),Y(`start-btn`).textContent=`START`}Y(`menuMsg`).textContent=!n&&r?fd(`speedway`):``,Dv(),Ev(),G_(),sv()}function kv(e){Z.mode!==`career`&&(Z.track=Hu[(Math.max(0,Hu.findIndex(e=>e.id===Z.track))+e+Hu.length)%Hu.length].id,$_(Z.track),q_(),Ov())}for(let[e,t]of[[`optMode`,`mode`],[`optDiff`,`difficulty`],[`optClass`,`cls`],[`optLaps`,`laps`],[`optWeather`,`weather`],[`optTrack`,`track`]])Y(e).addEventListener(`click`,e=>{let n=e.target.closest(`button`);n&&(t===`cls`&&!dd(e_,n.dataset.v)?Y(`menuMsg`).textContent=fd(n.dataset.v):(Z[t]=t===`laps`?+n.dataset.v:n.dataset.v,t===`track`&&($_(Z.track),q_()),Ov()))});Y(`optLine`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&!t.disabled&&K_(t.dataset.v===`on`)}),Y(`optVibe`)?.addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&lv(t.dataset.v===`on`)}),cv(),Y(`pLine`).addEventListener(`click`,()=>K_(!W_())),Y(`start-btn`).addEventListener(`click`,()=>{Z.mode===`career`?Kv():tv()}),Y(`team-btn`).addEventListener(`click`,()=>$v(`menu`)),Y(`trackPrev`).addEventListener(`click`,()=>kv(-1)),Y(`trackNext`).addEventListener(`click`,()=>kv(1));var Av=new Set([`menu`,`career`,`standings`,`recruit`]),jv=!1;function Mv(){return!Y(`controls`)?.classList.contains(`hidden`)}function Nv(){let e=Y(`controls`);e&&!e.classList.contains(`hidden`)&&(e.classList.add(`hidden`),document.querySelectorAll(`[data-help]`).forEach(e=>e.setAttribute(`aria-expanded`,`false`)))}function Pv(){Y(`controls`).classList.remove(`hidden`),document.querySelectorAll(`[data-help]`).forEach(e=>e.setAttribute(`aria-expanded`,`true`)),Iv(Y(`help-close`),!0)}function Fv(){let e=Mv()?Y(`controls`):Y(p_);return e?[...e.querySelectorAll(`.nav`)].filter(e=>{if(e.disabled||e.tabIndex<0||e.closest(`.hidden`))return!1;let t=e.getBoundingClientRect();return t.width>=1&&t.height>=1}):[]}function Iv(e,t){if(document.querySelectorAll(`.is-focus`).forEach(e=>e.classList.remove(`is-focus`)),e){t&&e.classList.add(`is-focus`);try{e.focus({preventScroll:!0})}catch{}}}function Lv(){if(!Av.has(p_)||Mv())return;let e=Fv();Iv([`carRace`,`standBack`,`start-btn`].map(e=>Y(e)).find(t=>t&&e.includes(t))||e[0],!1)}function Rv(e){let t=Fv();if(!t.length)return;let n=t.indexOf(document.activeElement);n<0&&(n=t.findIndex(e=>e.classList.contains(`is-focus`))),n<0&&(n=0);let r=og(t.map(e=>{let t=e.getBoundingClientRect();return{x:t.left,y:t.top,w:t.width,h:t.height}}),n,e);Iv(t[r<0?n:r],!0)}function zv(){Mv()?(Nv(),Iv(Y(`help-btn`),jv)):p_===`standings`?X?qv():fv():p_!==`recruit`&&p_===`career`&&fv()}function Bv(e){if(e===`a`){let e=Fv();(e.find(e=>e===document.activeElement)||e.find(e=>e.classList.contains(`is-focus`))||e.find(e=>e.classList.contains(`big`))||e[0])?.click()}else e===`b`?zv():(e===`left`||e===`right`||e===`up`||e===`down`)&&(jv=!0,Rv(e))}addEventListener(`keydown`,e=>{if(!Av.has(p_))return;let t=document.activeElement;if(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))return;let n={ArrowLeft:`left`,ArrowRight:`right`,ArrowUp:`up`,ArrowDown:`down`}[e.code];n?(e.preventDefault(),jv=!0,Rv(n)):e.code===`Escape`&&(e.preventDefault(),zv())}),document.addEventListener(`pointerdown`,e=>{(e.pointerType===`mouse`||e.pointerType===`touch`)&&document.querySelectorAll(`.is-focus`).forEach(e=>e.classList.remove(`is-focus`))}),document.addEventListener(`click`,e=>{e.target.closest?.(`[data-help]`)?Pv():Mv()&&e.target.id===`controls`&&Nv()}),Y(`help-close`).addEventListener(`click`,Nv);var Vv={up:!1,down:!1,left:!1,right:!1,a:!1,b:!1},Hv=0;function Uv(e){if(!Av.has(p_)){Vv={up:!1,down:!1,left:!1,right:!1,a:!1,b:!1};return}let t=navigator.getGamepads?navigator.getGamepads():[],n={up:!1,down:!1,left:!1,right:!1,a:!1,b:!1};for(let e of t){if(!e||!e.connected)continue;let t=sg(e);for(let e in n)n[e]=n[e]||t[e]}let r=lg(Vv,n),i=n.left?`left`:n.right?`right`:n.up?`up`:n.down?`down`:``,a=r.some(e=>e===`left`||e===`right`||e===`up`||e===`down`);i&&!a&&e-Hv>220?(r.push(i),Hv=e):a&&(Hv=e),Vv=n;for(let e of r)Bv(e)}Y(`again-btn`).addEventListener(`click`,()=>tv()),Y(`restart-btn`).addEventListener(`click`,()=>tv()),Y(`resume-btn`).addEventListener(`click`,()=>Sv(!1)),Y(`finish-btn`).addEventListener(`click`,()=>wy()),Y(`menu-btn`).addEventListener(`click`,()=>{g_===`career`&&X?Zv():fv()}),Y(`pmenu-btn`).addEventListener(`click`,fv);var Wv=`career`;function Gv(e){Z_(),Y(`hud`).classList.add(`hidden`),Y(e).classList.remove(`hidden`),p_=e}function Kv(){X?(X.difficulty=Z.difficulty,X.weather=Z.weather,Uh($g,X),qv()):$v(`season`)}function qv(){if(!X){$v(`season`);return}if(Ih(X)){ry();return}let e=qh(X).find(e=>e.player),t=Wh(X),n=Nh(X);Y(`carTitle`).textContent=`SEASON ${X.season}`,Y(`carRound`).textContent=X.complete?`SEASON COMPLETE`:`ROUND ${t.index+1} OF ${t.count}  ·  ${Gu(t.id).name.toUpperCase()}`,Y(`carCal`).innerHTML=X.calendar.map((e,t)=>{let n=t<X.round||X.complete?`done`:t===X.round?`now`:``,r=Gu(e).name;return`<li class="${n}" title="${Zm(r)}"><b>${t+1}</b> ${Zm(r)}</li>`}).join(``),wv(`carSwatch`,X.team.livery.c1,X.team.livery.c2),Y(`carWho`).textContent=`${X.driver.name}  #${X.driver.number}  ·  ${X.team.name}`,Y(`carMeta`).textContent=`P${e.pos}  ·  ${e.points} PTS  ·  RESEARCH ${X.upgradePoints}  ·  ${od[X.difficulty].name.toUpperCase()}`,Y(`carClass`).textContent=`CLASS  ${n.toUpperCase()}`;let r=Y(`carScout`);if(n===`gp`&&!X.complete){let e=Fh(X);r.textContent=e>0?`Speedway scouts watching: ${e} pts needed`:`Speedway scouts watching: threshold met (90 pts)`,r.classList.remove(`hidden`)}else n===`gp`&&X.complete&&!Ih(X)?(r.textContent=Lh(X),r.classList.remove(`hidden`)):(r.textContent=``,r.classList.add(`hidden`));Cv(`carLaps`).forEach(e=>e.classList.toggle(`sel`,+e.dataset.v===X.laps)),Y(`carRace`).classList.toggle(`hidden`,!!X.complete),Y(`carRace`).textContent=t?`RACE`:`STANDINGS`,ev(),Gv(`career`),Lv()}function Jv(){if(!X)return Kv();let e=Wh(X);if(!e){Yv();return}let t={mode:Z.mode,cls:Z.cls,laps:Z.laps,track:Z.track,difficulty:Z.difficulty};X.difficulty=Z.difficulty,X.weather=Z.weather,Uh($g,X);let n=Nh(X),r=a[n]||a.gp;tv({keepCareer:!0,restore:t,mode:`race`,difficulty:X.difficulty,cls:n,laps:X.laps,weather:X.weather,track:e.id,grid:Kh(X,r),driver:{name:X.driver.name,number:X.driver.number}})}function Yv(){if(!X)return fv();let e=qh(X),t=X.complete?e[0]:null;Y(`standHead`).textContent=t?t.player?`SEASON ${X.season} CHAMPION — YOU`:`SEASON ${X.season} CHAMPION — ${t.name}`:`SEASON ${X.season}  ·  ROUND ${Math.min(X.round+1,X.calendar.length)}/${X.calendar.length}`;let n=e.map(e=>`<tr class="${e.player?`me`:``}"><td>${e.pos}</td><td><i class="chip" style="background:${gf(e.c1)}"></i> ${Zm(e.name)} <small>#${e.number}</small></td><td>${Zm(e.team)}</td><td>${e.player?`YOU`:e.rating}</td><td>${e.points}</td></tr>`).join(``);Y(`standTable`).innerHTML=`<thead><tr><th>P</th><th>DRIVER</th><th>TEAM</th><th>RTG</th><th>PTS</th></tr></thead><tbody>${n}</tbody>`,ev(),Gv(`standings`),Lv()}function Xv(){if(!X)return fv();Y(`upPoints`).textContent=`RESEARCH POINTS  ${X.upgradePoints}`,Y(`upList`).innerHTML=fh.map(e=>{let t=X.upgrades[e]||0,n=kh(X,e),r=n==null?`MAX`:X.upgradePoints>=n?`BUY ${n}`:`NEED ${n}`;return`<div class="uprow"><b style="width:5.2em">${hh[e]}</b><div class="bar"><i style="width:${t/5*100}%"></i></div><span>${t}/5</span><button class="btn" data-up="${e}" ${n==null||X.upgradePoints<n?`disabled`:``}>${r}</button></div><div class="meta" style="text-align:left">${Zm(gh[e])}</div>`}).join(``),Gv(`upgrades`)}function Zv(){Wv=`results`,Xv()}function Qv(e){t_={driver:{name:e.driver,number:e.number},team:{name:e.name,tag:e.tag,livery:{pattern:e.pattern,c1:e.c1,c2:e.c2,c3:e.c3,number:e.number}}},wh($g,t_),t_=Ch($g),X&&=(X.driver={...t_.driver},X.team=t_.team,Uh($g,X),Hh($g))}function $v(e){v_=e;let t=J_(),n=t.team.livery||{};y_=Sf({driver:t.driver.name,name:t.team.name,tag:t.team.tag,pattern:n.pattern,c1:n.c1,c2:n.c2,c3:n.c3,number:t.driver.number}),Y(`edTitle`).textContent=e===`season`?`NEW CAREER`:`YOUR TEAM`,Y(`edSave`).textContent=e===`season`?`START SEASON`:`DONE`,Y(`edDriver`).value=y_.driver,Y(`edTeam`).value=y_.name,Y(`edNumber`).value=String(y_.number),Y(`edMsg`).textContent=``,ey(),Gv(`editor`),dy(wf(y_))}function ey(){Y(`edTag`).textContent=y_.tag,Cv(`edChannel`).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===b_)),Cv(`edPattern`).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===y_.pattern));let e=y_[b_];for(let t of Y(`edSwatches`).querySelectorAll(`.swatch`))t.classList.toggle(`sel`,parseInt(t.dataset.c,16)===e);let t=Y(`edColor`);t&&(t.value=gf(e))}function ty(e){y_=Cf(y_,e),ey(),dy(wf(y_))}Y(`edPattern`).innerHTML=af.map(e=>`<button data-v="${e.id}">${e.name}</button>`).join(``),Y(`edSwatches`).innerHTML=cf.map(e=>`<button class="swatch" data-c="${e.toString(16)}" style="background:${gf(e)}"></button>`).join(``)+`<input type="color" id="edColor" value="#e8472a" aria-label="Custom colour" />`,Y(`edChannel`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&(b_=t.dataset.v,ey())}),Y(`edPattern`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&ty({pattern:t.dataset.v})}),Y(`edSwatches`).addEventListener(`click`,e=>{let t=e.target.closest(`.swatch`);t&&ty({[b_]:parseInt(t.dataset.c,16)})}),Y(`edColor`).addEventListener(`input`,()=>ty({[b_]:Y(`edColor`).value})),Y(`edNumber`).addEventListener(`input`,()=>ty({number:Y(`edNumber`).value}));function ny(){let e=Y(`edTeam`).value,t=Y(`edDriver`).value,n=uf(e),r=uf(t);n===`blocked`||r===`blocked`?Y(`edMsg`).textContent=rf:n===`short`?Y(`edMsg`).textContent=`Team name needs 3 to 18 characters`:r===`short`?Y(`edMsg`).textContent=`Driver name needs 3 to 18 characters`:(y_=Cf(y_,{name:e,driver:t,number:Y(`edNumber`).value}),Qv(y_),v_===`season`?(X=Bh({driverName:y_.driver,number:y_.number,team:t_.team,difficulty:Z.difficulty,weather:Z.weather,laps:X?.laps||Z.laps||4},t_),Uh($g,X),qv()):v_===`career`&&X?qv():fv())}Y(`edSave`).addEventListener(`click`,ny),Y(`edBack`).addEventListener(`click`,()=>{v_===`career`&&X?qv():fv()}),Y(`carLaps`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&X&&(X.laps=+t.dataset.v,Uh($g,X),qv())}),Y(`carRace`).addEventListener(`click`,Jv),Y(`carUp`).addEventListener(`click`,()=>{Wv=`career`,Xv()}),Y(`carStand`).addEventListener(`click`,Yv),Y(`carTeam`).addEventListener(`click`,()=>$v(`career`)),Y(`carMenu`).addEventListener(`click`,fv),Y(`carSeason`).addEventListener(`click`,()=>{if(!X)return;if(Ih(X)){ry();return}let e=Y(`carSeason`);e.dataset.arm===`1`?(e.dataset.arm=``,e.textContent=`NEW SEASON`,Yh(X),Uh($g,X),qv()):(e.dataset.arm=`1`,e.textContent=`CONFIRM`)}),Y(`standBack`).addEventListener(`click`,()=>X?qv():fv()),Y(`standMenu`).addEventListener(`click`,fv),Y(`upList`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-up]`);t&&!t.disabled&&X&&(Ah(X,t.dataset.up).ok&&Uh($g,X),Xv())}),Y(`upDone`).addEventListener(`click`,()=>{if(Wv===`results`&&X?.complete){if(Wv=`career`,Ih(X)){ry();return}Yv()}else Wv=`career`,X?qv():fv()});function ry(){if(!X||!Ih(X))return qv();let e=dh,t=X.points.player||0;wv(`recruitSwatch`,e.livery.c1,e.livery.c2),Y(`recruitWho`).textContent=`${e.name}  ·  ${e.tag}`,Y(`recruitHead`).textContent=`SPEEDWAY SEAT OFFERED`,Y(`recruitBlurb`).textContent=`${e.name} wants you for next season after a ${t}-point GP campaign. Keep your driver, team name and livery. Upgrades reset for the new class. Accept to race Speedway, or decline and stay in GP.`,Gv(`recruit`),Lv()}function iy(){if(!X)return fv();let e=Rh(X);e.ok&&e.unlocked&&Sd(e_,`speedway`)&&ud($g,e_),Uh($g,X),qv()}function ay(){if(!X)return fv();zh(X),Uh($g,X),qv()}Y(`recruitAccept`).addEventListener(`click`,iy),Y(`recruitDecline`).addEventListener(`click`,ay);var oy=null,sy=null,cy=null,ly=null;function uy(){if(oy)return;oy=new iu({canvas:Y(`liveryCanvas`),antialias:!1,alpha:!1}),oy.setPixelRatio(1),sy=new br,sy.background=new q(1054752),cy=new Eo(32,1,.1,40),sy.add(new mo(13625087,3820082,1.3));let e=new ko(16773590,2.4);e.position.set(4,7,5),sy.add(e);let t=new Ri(new ga(5,8),new Ua({color:1713200}));t.rotation.x=-Math.PI/2,sy.add(t)}function dy(e){uy(),ly&&(sy.remove(ly.group),Bp(ly)),ly=kp(`gp`,e,!1,!1,0),sy.add(ly.group)}function fy(){if(p_!==`editor`||!ly)return;let e=Y(`liveryCanvas`),t=Math.max(2,e.clientWidth|0),n=Math.max(2,e.clientHeight|0);(oy.domElement.width!==t||oy.domElement.height!==n)&&(oy.setSize(t,n,!1),cy.aspect=t/n,cy.updateProjectionMatrix());let r=performance.now()*.001;ly.group.rotation.y=r*.7,ly.wheels.forEach(e=>{e.spin=r*2}),Ap(ly),cy.position.set(Math.sin(r*.15)*7.2,2.5,Math.cos(r*.15)*7.2),cy.lookAt(0,.55,0),oy.render(sy,cy)}Wg.onTap(Y(`bCam`),av),Wg.onTap(Y(`bAuto`),()=>$&&rv(!$.autopilot)),Wg.onTap(Y(`bPit`),()=>my()),Wg.onTap(Y(`bMute`),()=>ov(!Gg.muted)),Wg.onTap(Y(`bPause`),()=>Sv(p_===`racing`)),Wg.onTap(Y(`bEnd`),()=>wy()),Wg.onTap(Y(`bDry`),()=>$?.choosePitTire(`dry`)),Wg.onTap(Y(`bWet`),()=>$?.choosePitTire(`wet`));function py(){Cg({type:`pitrequest`},{solo:$?.solo})[0]&&(qg.pending.engineer={id:`radio_pit_confirmed`,channel:`engineer`,speaker:`PIT WALL`,caption:`PIT CONFIRMED  ·  ENTRY ON YOUR LEFT`,priority:100},xv(0))}function my(){if(!$||$.solo)return;let e=$.player;e.pit.stage||($.requestPit(e,!e.pit.request),e.pit.request&&py(),nv(e.pit.request?`PIT NEXT LAP`:`PIT CANCELLED`))}var hy=Y(`mm`),gy=hy.getContext(`2d`),_y=null;function vy(){let e=1e9,t=-1e9,n=1e9,r=-1e9;for(let i=0;i<Q.n;i++)e=Math.min(e,Q.px[i]),t=Math.max(t,Q.px[i]),n=Math.min(n,Q.pz[i]),r=Math.max(r,Q.pz[i]);let i=hy.width,a=Math.min((i-20)/(t-e),(i-20)/(r-n)),o=(i-(t-e)*a)/2,s=(i-(r-n)*a)/2,c=t=>o+(t-e)*a,l=e=>i-(s+(e-n)*a),u=document.createElement(`canvas`);u.width=u.height=i;let d=u.getContext(`2d`);d.lineJoin=`round`,d.lineCap=`round`;let f=()=>{d.beginPath();for(let e=0;e<=Q.n;e+=2){let t=e%Q.n;e?d.lineTo(c(Q.px[t]),l(Q.pz[t])):d.moveTo(c(Q.px[t]),l(Q.pz[t]))}d.closePath()};d.strokeStyle=`#000`,d.lineWidth=7,f(),d.stroke(),d.strokeStyle=`#8fa3b8`,d.lineWidth=4,f(),d.stroke(),d.fillStyle=`#fff`,d.fillRect(c(Q.px[0])-5,l(Q.pz[0])-1.5,10,3),_y={c:u,mapX:c,mapY:l}}vy();function yy(){gy.clearRect(0,0,hy.width,hy.height),gy.drawImage(_y.c,0,0);for(let e=0;e<2;e++)for(let t of $.cars){if(e===1!==t.isPlayer)continue;let n=t._r||t,r=_y.mapX(n.x),i=_y.mapY(n.z);gy.fillStyle=`#000`,gy.beginPath(),gy.arc(r,i,t.isPlayer?7.5:5.5,0,7),gy.fill(),gy.fillStyle=t.isPlayer?`#ffe14a`:t.team._hex||=by(t.team.c1),gy.beginPath(),gy.arc(r,i,t.isPlayer?5.5:3.6,0,7),gy.fill()}}var by=e=>`#`+e.toString(16).padStart(6,`0`);function xy(e,t){let n=Y(e);n._v!==t&&(n._v=t,n.textContent=t)}function Sy(e,t){let n=Y(e);n._v!==t&&(n._v=t,n.innerHTML=t)}function Cy(){let e=$.player,t=$.lapTimer;$.solo?(Sy(`pos`,`TIME TRIAL`),xy(`lap`,`L${e.laps+1}`)):(Sy(`pos`,`P${e.pos}<small>/${$.cars.length}</small>`),xy(`lap`,`LAP ${Math.min(e.laps+1,$.laps)}/${$.laps}`)),xy(`laptime`,Ku(Zu(t,$.time))),xy(`best`,`BEST `+Ku(t.bestLap)),H_.forEach((e,n)=>e.classList.toggle(`cur`,t.g>=0&&n===Qu(t))),xy(`speed`,String(Math.round(Math.max(0,e.v)*3.6))),xy(`tire`,e.tire===`wet`?`W`:`D`),Y(`tire`).classList.toggle(`wet`,e.tire===`wet`);let n=Y(`wearbar`).firstElementChild;n.style.width=(1-e.wear)*100+`%`,n.style.background=e.wear>.7?`#e8472a`:e.wear>.45?`#f2c230`:`#5de06a`,Y(`boostbar`).firstElementChild.style.width=e.boost*100+`%`,$.solo||Sy(`board`,ih($.order,e.pos));let r=Y(`gaps`);if(!$.solo&&$.phase===`racing`&&!e.finished){let t=$.gaps(e);r.classList.remove(`hidden`),xy(`gAhead`,t.ahead==null?``:`▲ `+Py(t.ahead,`+`)),xy(`gBehind`,t.behind==null?``:`▼ `+Py(t.behind,`-`))}else r.classList.add(`hidden`);Y(`bPit`).classList.toggle(`on`,e.pit.request||e.pit.stage>0),Y(`bPit`).classList.toggle(`hidden`,$.solo),Y(`bc`).classList.toggle(`hidden`,!e.pit.stage),e.pit.stage&&xy(`pitmsg`,e.pit.stage===2?e.pit.choice?`SERVICE...`:`CHOOSE TIRES`:e.pit.stage===1?`PIT LANE - CHOOSE`:`PIT EXIT`),Y(`bDry`).classList.toggle(`on`,e.pit.choice===`dry`),Y(`bWet`).classList.toggle(`on`,e.pit.choice===`wet`);let i=Q.section[e.idx];i!==I_&&(I_=i,Y(`sect`).textContent=Q.sections[i].toUpperCase(),Y(`sect`).classList.add(`on`),L_=3)}function wy(){$&&p_!==`results`&&(clearTimeout(V_),Ty())}function Ty(){let e=$.player,t,n,r=[];if($.solo){t=`TIME TRIAL`,Y(`resSum`).innerHTML=``;let i=Math.min(...e.lapTimes,1/0);n=e.lapTimes.map((e,t)=>`<tr class="${e===i?`me`:``}"><td>LAP ${t+1}</td><td>${Ku(e)}</td><td>${e===i?`BEST`:`+`+(e-i).toFixed(3)}</td></tr>`),n.length||(n=[`<tr><td>No completed laps</td></tr>`]),e.lapTimes.length&&$.lapTimer.laps.length&&$.lapTimer.bestLap===i&&e.recordSet&&r.push(`NEW PERSONAL BEST!`),Y(`resGoal`).textContent=``;let a=bd(h_,{bestLap:i});Y(`resGoal`).textContent=a.text,Y(`resGoal`).className=a.met?`ok`:`no`}else{let e=$.results(),i=e.find(e=>e.isPlayer);t=i.pos===1?`VICTORY!`:i.pos<=3?`PODIUM!`:`RACE RESULTS`;let a=$.player.team.c1;Y(`resSum`).innerHTML=`<span class="big">P${i.pos}</span><span class="chip" style="background:${by(a)}"></span><span>${i.pos===1?Ku(i.time,!1):`+`+(i.gap??0).toFixed(1)+`s`}</span><span>BEST ${Ku(i.best,!1)}</span>`,n=ah(e,Ku);let o=bd(h_,{pos:i.pos});Y(`resGoal`).textContent=o.text,Y(`resGoal`).className=o.met?`ok`:`no`;let s=xd(e_,{mode:`race`,cls:g_===`career`?Nh(X):Z.cls,pos:i.pos});if(ud($g,e_),r.push(...s.messages),g_===`career`&&X&&!__){__=!0;let t=Jh(X,e.map(e=>({id:e.id,pos:e.pos,isPlayer:e.isPlayer})));if(Uh($g,X),t){let e=t.standings.find(e=>e.player);r.push(`+${t.points} PTS`,`+${t.upgrade} RESEARCH`,`CHAMPIONSHIP P${e.pos} · ${e.points} PTS`),t.complete&&r.push(oh(t.standings[0])),Y(`resGoal`).textContent=`${Q.name.toUpperCase()}  +${t.points} PTS`}}}mv(),Y(`resTitle`).textContent=t,Y(`restable`).innerHTML=n.join(``),Y(`resMsg`).innerHTML=r.join(`<br>`),Y(`again-btn`).textContent=$.solo?`RETRY`:`RESTART`,Y(`again-btn`).classList.toggle(`hidden`,g_===`career`),Y(`menu-btn`).textContent=g_===`career`?`CONTINUE`:`MENU`;for(let e of[`hud`,`pause`])Y(e).classList.add(`hidden`);Y(`results`).classList.remove(`hidden`),p_=`results`,Ov()}function Ey(e){let t=Y(`banner`);t.textContent=e,t.classList.remove(`on`),t.offsetWidth,t.classList.add(`on`)}function Dy(){let e=Y(`flag`);e.classList.remove(`on`),e.offsetWidth,e.classList.add(`on`)}function Oy(e,t){let n=Y(`posPop`),r=t<e;n.textContent=`P${t} ${r?`▲`:`▼`}`,n.className=`on `+(r?`up`:`down`),D_=1.5}function ky(){let e=Y(`lights`),t=$.phase===`countdown`?$.lights:0,n=!$.solo&&($.phase===`countdown`||$.goFlash>0);e.classList.toggle(`hidden`,!n),document.body.classList.toggle(`lit`,n),e.classList.toggle(`go`,$.phase!==`countdown`&&$.goFlash>0),e.classList.toggle(`fade`,$.phase!==`countdown`&&$.goFlash<.8),t!==O_&&(O_=t,[...e.children].forEach((e,n)=>e.classList.toggle(`on`,n<t)))}var Ay={},jy=0,My=0;function Ny(t){let n=$.player,r=n.cls.vTop,i=$.phase===`racing`,a=i?+!!n.boosting+Math.min(1,(n.slip||0)/.3)*.5:0;T_+=(Math.min(1,a)-T_)*(1-Math.exp(-t*(a>T_?6:2.5)));let o=i&&n.surface===`kerb`&&n.v>15;if(o&&(F_=Math.max(F_,.1*Math.min(1,n.v/60))),o&&!E_&&Gg.beep?.(90,.04,`square`,.05),E_=o,i&&n.v>20&&(F_=Math.max(F_,.105*n.lockup,.055*n.flat*Math.min(1,n.v/50))),i&&n.v>65&&(F_=Math.max(F_,.013*e((n.v-65)/25,0,1))),i&&Z.vibration&&typeof navigator.vibrate==`function`){let e=me(o,n.lockup,n.v),t=performance.now();e&&t-My>150&&(navigator.vibrate(e),My=t)}let s=i?e((n.v/r-.55)/.4,0,1)*.75+T_*.35:0,c=.3+.7*u_.chase;k_+=(Math.min(1,s)*c-k_)*(1-Math.exp(-t*4));let l=e(n.latFrac||0,0,1.25);if(jy+=t,jy>=1/62){let e=Ay;e.dt=jy,jy=0,e.v=Math.abs(n.v),e.vTop=r,e.throttle=n.input.throttle,e.brake=n.input.brake,e.lat=l,e.lock=n.lockup,e.slip=n.wheelSlip,e.slipAngle=n.slipAngle,e.kerb=o,e.on=i||$.phase===`countdown`,e.boosting=n.boosting,Gg.drive(e)}D_-=t,D_<0&&Y(`posPop`).classList.remove(`on`)}function Py(e,t){return e==null?``:`${t}${e.toFixed(1)}`}function Fy(){let e=$.player;for(let t of $.events)if(t.type===`finish`&&!t.car.isPlayer&&qg.event({type:`winner`,car:t.car},{player:e,solo:$.solo,position:e.pos},Yg),qg.event(t,{player:e,solo:$.solo,position:e.pos,mode:Z.mode},Yg),t.type===`light`)Gg.beep(440,.12);else if(t.type===`go`)Gg.beep(880,.4),Gg.music=!0,nv(`GO!`,1.5);else if(t.type===`finallap`)Ey(`FINAL LAP`);else if(t.type===`poschange`)Oy(t.from,t.to);else if(t.type===`rain`)nv(`RAIN STARTING - WET TIRES?`,5);else if(t.type===`hit`&&t.car.isPlayer)F_=Math.max(F_,Math.min(1,.35+t.power*.65)),Gg.thump();else if(t.type===`startline`)dv(),nv($.solo?`FLYING LAP`:`LAP 1`,1.5);else if(t.type===`sector`){let e=H_[t.sector];t.sector===0&&dv(),e.className=t.status,e.textContent=Ku(t.time,!0).slice(2);let n=t.delta==null?`S`+(t.sector+1):`S${t.sector+1} ${qu(t.delta)}`;Y(`split`).textContent=n,Y(`split`).className=t.status,z_=3,Gg.beep(t.status===`purple`?1320:t.status===`green`?1100:760,.08)}else if(t.type===`laptime`){let n=`${Ku(t.time)}${t.delta==null?``:`  `+qu(t.delta)}`;!$.solo&&e.finished||nv((t.isBest?`BEST LAP `:`LAP `)+n,3.5),Gg.beep(990,.15);let r=md(e_,Z.cls,t);_d(e_,Q.id,$.cls?.id||Z.cls,t),r&&(e.recordSet=!0),ud($g,e_),t.ghost&&r&&(th($g,r_,Q.id,Z.cls,t.ghost),$.solo&&(o_=t.ghost))}else t.type===`winner`||(t.type===`finish`&&t.car.isPlayer?(nv(`FINISH!`,3),Gg.beep(1200,.5),Dy()):t.type===`pit`&&t.car.isPlayer&&nv(`TIRES CHANGED`,2));$.events.length=0}function Iy(){for(let e of Wg.takeActions())if(e===`pause`)Sv(p_===`racing`);else if(p_!==`racing`)continue;else e===`camera`?av():e===`autopilot`?rv(!$.autopilot):e===`mute`?ov(!Gg.muted):e===`pit`?my():e===`tire:dry`?$.choosePitTire(`dry`):e===`tire:wet`&&$.choosePitTire(`wet`)}var Ly={x:0,y:0,z:0,yaw:0},Ry=null;function zy(){let e=1e9,t=-1e9,n=1e9,r=-1e9;for(let i=0;i<Q.n;i++)e=Math.min(e,Q.px[i]),t=Math.max(t,Q.px[i]),n=Math.min(n,Q.pz[i]),r=Math.max(r,Q.pz[i]);Ry={cx:(e+t)/2,cz:(n+r)/2,w:t-e+120,h:r-n+120}}zy();var By=new K,Vy=new K,Hy=new K,Uy=new K,Wy=new K,Gy=new K,Ky=new K,qy=new K,Jy=new K,Yy=new K,Xy=[0,0,0],Zy=[0,0,0],Qy=[0,0,0],$y=new K,eb=new K,tb={x:0,y:0,z:0,half:90,dist:40},nb=e=>e*e*(3-2*e);function rb(t){d_&&=(t=8,!1);let n=bb||$.player;for(let e of s_){let n=+(e===l_);u_[e]+=(n-u_[e])*(1-Math.exp(-t*2.4)),Math.abs(n-u_[e])<.003&&(u_[e]=n)}let r=nb(u_.chase),i=nb(u_.overhead),a=nb(u_.full),o=r+i+a||1,s=r/o,c=i/o,l=a/o,u=e(n.v/80,0,1);A(w_,`motionLag`,(n.yawRate||0)*.035,5,t);let d=+!!n.pit.stage;Ly.pz=(Ly.pz??0)+(d-(Ly.pz??0))*(1-Math.exp(-t*2.5));let f=Hg(58+u*6,62,92),p=L(w_,n,Q,t,{fovDeg:f,aspect:Fg.aspect,motionLag:w_.motionLag});Hy.fromArray(p.pos),Uy.fromArray(p.look);let m=Fg.aspect<1;ce(Ly,n,t);let h=O({x:Ly.x,y:Ly.y,z:Ly.z,yaw:Ly.yaw,aspect:Fg.aspect,zoom:1-.35*Ly.pz}),g=h.fov,_=h.distance;Wy.fromArray(h.pos),Gy.fromArray(h.target);let v=Hg(35,30,55),y=62*Math.PI/180,b=2*Math.atan(Math.tan(v*Math.PI/360)*Fg.aspect),x=Math.max(Ry.w/2/Math.tan(b/2),Ry.h*Math.sin(y)/(2*Math.tan(v*Math.PI/360)))*1.04;Ky.set(Ry.cx,0,Ry.cz-Math.cos(y)*x).setY(Math.sin(y)*x),qy.set(Ry.cx,0,Ry.cz),By.set(0,0,0).addScaledVector(Hy,s).addScaledVector(Wy,c).addScaledVector(Ky,l),Vy.set(0,0,0).addScaledVector(Uy,s).addScaledVector(Gy,c).addScaledVector(qy,l);let S=s*12+c*_+l*x,C=(1-Math.max(s,c,l))*S*.35;if(By.y+=C,Fg.position.copy(By),F_>0){let e=F_*F_*(s+(1-s)*.25),r=$.time*Math.max(12,Math.abs(n.v));Fg.position.y+=Math.sin(r*1.7)*e*.22,Fg.position.x+=Math.sin(r*.63+.4)*e*.08,F_=Math.max(0,F_-t*5.5)}Fg.lookAt(Vy),Fg.rotateZ(e((n.signedLatAcc||0)*32e-5+(n.slipAngle||0)*.16,-.022,.022)*s),Fg.fov=(f+T_*6)*s+(g+T_*2.5)*c+v*l,Fg.near=Math.max(.5,S*.12*(1-s)),Fg.far=1500+S*3,Fg.updateProjectionMatrix();{let e=Vm(Fg.position.distanceTo(Vy),Fg.fov,Bg.lowH);Jy.set(1,0,0).applyQuaternion(Fg.quaternion),Yy.set(0,1,0).applyQuaternion(Fg.quaternion),Fg.position.toArray(Xy),Jy.toArray(Zy),Yy.toArray(Qy),Fg.position.fromArray(Hm(Xy,Zy,Qy,e,Xy))}tb.x=Vy.x,tb.y=Vy.y,tb.z=Vy.z,tb.dist=By.distanceTo(Vy),tb.half=e(s*70+c*(m?125:135)+l*130,60,140),hy.classList.toggle(`off`,s<.6),ib=s>=.6}var ib=!0;function ab(){let e=bb||$?.player;if(!e)return{mode:l_};let t=Fg.getWorldDirection($y);return{mode:l_,pitchDeg:+(Math.asin(-t.y)*180/Math.PI).toFixed(2),height:+(Fg.position.y-e.y).toFixed(2),distance:+Fg.position.distanceTo(eb.set(e.x,e.y,e.z)).toFixed(2),fov:+Fg.fov.toFixed(2),behind:+((e.x-Fg.position.x)*Math.sin(Ly.yaw)+(e.z-Fg.position.z)*Math.cos(Ly.yaw)).toFixed(2),aspect:+Fg.aspect.toFixed(3),carScreenPct:+((1-eb.set(e.x,e.y,e.z).project(Fg).y)*50).toFixed(1)}}var ob={i:0},sb={};function cb(){if(!S_||!$)return;let e=$.player,t=W_()&&p_!==`menu`&&!e.pit.stage&&$.phase!==`done`&&!e.finished;S_.mesh.visible!==t&&S_.setEnabled(t),t&&S_.update(bb?bb.s:e.s,Math.abs(e.v),e.grip)}function lb(e,t=e){for(let n of $.cars){let r=n.mesh;if(!r)continue;let i=Jm(n,vb,n._r||={},Q.length);r.group.position.set(i.x,i.y,i.z),r.group.rotation.y=i.theta,n.isPlayer&&bb&&(bb.x=i.x,bb.y=i.y,bb.z=i.z,bb.theta=i.theta,bb.s=i.s,bb.d=i.d);let a=r.st;a.v=n.v,a.steer=i.steer,a.longAcc=n.longAcc,a.latAcc=n.latAcc||0,a.surface=n.surface,a.lockup=n.lockup,a.flat=n.flat,a.brake=n.brk,a.rain=$.rain,a.roll=i.roll,a.pitch=i.pitch,a.s=i.s,a.lift=n.isPlayer?n_.fx.lift:0,r.tire!==n.tire&&r.setTire(n.tire),Lp(r,a,t),x_.emitCar(n,r,i,e,n.cls.id),r.mark&&(r.mark.visible=u_.chase<.5,r.mark.scale.setScalar(1)),r.group.scale.setScalar(1+3*u_.full)}if(x_.update(e),a_){let e=$.phase===`racing`&&$.lapTimer.g>=0?rd(o_,Zu($.lapTimer,$.time-(1-vb)*Gm),sb):null;if(a_.group.visible=!!e,e){let t=Q.locate(e.x,e.z,ob.i,void 0,30);ob.i=t.i;let n=_e(Q,t.s);a_.group.position.set(e.x,n.y,e.z),a_.group.rotation.y=e.theta,a_.pivot.rotation.x=-n.pitch,a_.pivot.rotation.z=n.roll}}}var ub=new Wm,db=new Um,fb=0,pb=0;function mb(t){let n=Rm(zg.level),r=zm(zg.level);zg.level=e(Math.round(t),0,2),zg.gov.level=zg.level,n_.setQuality(zg.level),zm(zg.level)!==r&&(Ng.samples=zm(zg.level),Ng.dispose()),Rm(zg.level)!==n&&Vg(),ub.force()}function hb(e){if(e<=0)return;let t=1/e;if(zg.fps+=(t-zg.fps)*(1-Math.exp(-e/.5)),!zg.auto||p_===`menu`||p_===`paused`||document.hidden)return;let n=zg.gov.update(e,zg.fps);n!==null&&mb(n)}var gb=performance.now(),_b=0,vb=1,yb=performance.memory||null,bb=null,xb=()=>{if($){for(let e of $.cars)Km(e);vb=1}};function Sb(e){Uv(e),requestAnimationFrame(Sb);let t=Math.max(0,(e-gb)/1e3),n=Math.min(.05,t);if(gb=e,t>0&&t<5&&db.add(t*1e3,yb?yb.usedJSHeapSize:-1),B_-=n,$&&(p_===`racing`||p_===`paused`)&&Iy(),$&&p_===`cinematic`){if(f_||Jg?.advance(Math.min(t,8.5))&&hv(),Jg){let e=Og(Q,$.player,Jg.elapsed,Z.mode,Z);Fg.position.fromArray(e.position),Fg.lookAt(...e.target),Fg.fov=e.fov,Fg.near=.3,Fg.far=2200,Fg.updateProjectionMatrix(),Y(`introShot`).textContent=e.phase===`flyover`?`TRACK FLYOVER`:e.phase===`grid`?`ON THE GRID`:$.solo?`YOUR CHALLENGE`:`YOUR CAR  ·  START P${$.player.pos}`,Y(`introTitleCard`).hidden=!e.reveal}Ny(n)}else if($&&p_===`racing`){if(Fy(),f_)_b=0,xb();else{let e=Ym(_b,Math.min(.1,t));_b=e.acc;for(let t=0;t<e.n;t++){for(let e of $.cars)Km(e);let e=$.player;if(!$.autopilot&&!e.finished&&!e.pit.stage){let t=Wg.poll(),n=e.input;n.steer=t.steer,n.throttle=t.throttle,n.brake=t.brake,n.boost=t.boost}$.step(Gm)}vb=_b/Gm}($.rain!==A_||$.wetness!==j_)&&(A_=$.rain,j_=$.wetness,n_.setWeather({rain:A_,wetness:j_}));let e=$.goFlash>0;($.lights!==M_||e!==N_)&&(M_=$.lights,N_=e,n_.setStartLights(M_,N_));let r=$.player;Ny(n),ky(),r.finished&&!m_&&(m_=!0,V_=setTimeout(()=>{$.simulateToEnd(),Ty()},2200)),B_<=0&&(Cy(),B_=.05),L_-=n,L_<0&&Y(`sect`).classList.remove(`on`),z_-=n,z_<0&&(Y(`split`).textContent=``),R_-=n,R_<0&&(Y(`msg`).textContent=$.phase===`countdown`?`GET READY`:``),P_-=t,ib&&P_<=0&&(yy(),P_=1/30)}if(xv(p_===`paused`||$&&!$.solo&&!Jg&&$.phase===`countdown`?0:Math.min(t,2)),p_===`paused`&&Gg.engine(0,1,0,!1),p_!==`racing`&&(k_*=.8),p_===`menu`||p_===`career`||p_===`standings`){let t=e/1e3*.08,n=Q.at(t*300%Q.length);Fg.position.set(n.x+40,n.y+30,n.z+40),Fg.lookAt(n.x,n.y,n.z),Fg.fov=58,Fg.near=.5,Fg.far=1500,Fg.updateProjectionMatrix(),Object.assign(tb,{x:n.x,y:n.y,z:n.z,half:70,dist:55}),n_.setPit(null)}else if($&&p_!==`cinematic`){bb?.__src!==$.player&&(bb=Object.create($.player),bb.__src=$.player),lb(p_===`racing`?n:0,p_===`racing`?Math.min(t,.1):0),cb(),rb(n);let e=$.player,r=!$.solo&&$.phase===`racing`&&!e.pit.stage&&(e.wear>=.68||e.tire===`dry`&&$.wetness>=.32||e.tire===`wet`&&$.wetness<.14);document.body.classList.toggle(`broadcast-has-pit`,r),n_.setPit(e.pit.stage||e.pit.request?{stage:e.pit.stage,request:e.pit.request,serv:e.pit.serv,choice:e.pit.choice,teamIndex:e.teamIndex,colors:{c1:e.team.c1,c2:e.team.c2},car:e.mesh}:null)}p_===`editor`&&fy(),n_.update(n,Fg,tb);let r=n_.fx,i=Rg.uniforms;i.speed.value=k_,i.rain.value=r.rain,i.time.value=r.time,i.sat.value=r.sat,i.tint.value.set(r.tint[0],r.tint[1],r.tint[2]),hb(Math.min(.5,t)),(zg.level>0||ub.due(t))&&(Mg.shadowMap.needsUpdate=!0),Mg.setRenderTarget(Ng),Mg.render(Pg,Fg),fb=Mg.info.render.calls,pb=Mg.info.render.triangles,Mg.setRenderTarget(null),Mg.setViewport(Bg.vx,Bg.vy,Bg.vw,Bg.vh),Mg.render(Ig,Lg)}requestAnimationFrame(Sb),Ov(),Lv();var Cb=new URLSearchParams(location.search);if(Cb.get(`touch`)===`1`&&document.body.classList.add(`touch`),Cb.get(`autostart`)===`1`){tv({...Cb.get(`mode`)?{mode:Cb.get(`mode`)}:{},...Cb.get(`diff`)?{difficulty:Cb.get(`diff`)}:{},...Cb.get(`cls`)?{cls:Cb.get(`cls`)}:{},...Cb.get(`laps`)?{laps:+Cb.get(`laps`)}:{},...Cb.get(`track`)?{track:Cb.get(`track`)}:{},weather:Cb.get(`weather`)||`dry`}),rv(!0);let e=Cb.get(`cam`);e&&iv(e,!0)}Cb.get(`camlog`)===`1`&&setInterval(()=>console.log(`camlog`,JSON.stringify(ab())),1e3),Cb.get(`q`)&&(zg.auto=!1,mb(+Cb.get(`q`))),window.__game={startLights:()=>$?{phase:$.phase,lights:$.lights,go:$.phase!==`countdown`&&$.goFlash>0}:null,showResults:()=>{$&&($.solo||$.simulateToEnd(),Ty())},broadcast:()=>({mode:Z.mode,time:Yg,volume:Z.voiceVolume,muted:Z.voiceMuted,masterMuted:Gg.muted,cutscenes:Z.cutscenes,introActive:!!Jg,introTime:Jg?.elapsed||0,introSkipped:!!Jg?.skipped,pending:{...qg.pending},caption:document.querySelector(`#voiceCaption .voice-text`)?.textContent||``,channel:Zg,played:{...qg.lastPlayed},degraded:Kg.degraded}),feel:()=>({fovKick:T_,fxSpeed:k_,shake:F_}),camDebug:ab,startRace:e=>tv(e),skipIntro:gv,finishIntro:hv,setBroadcastOption:uv,setRain:e=>{$?.setRain(e),$&&n_.setWeather({rain:$.rain,wetness:$.wetness})},enterPit:()=>{$&&$.requestPit($.player,!0)},fps:()=>zg.fps,setLineGuide:K_,lineGuide:()=>({enabled:!!S_?.mesh.visible,allowed:W_(),hard:Z.difficulty===`hard`,saved:Z.lineGuide,...S_?.status||{}}),setVibration:lv,vibration:()=>!!Z.vibration,carFx:x_,boards:()=>C_?.plan||[],perfStats:(e=!1)=>{let t={...db.snapshot(),quality:zg.level,lowRes:Bg.lowW+`x`+Bg.lowH,k:Bg.k,msaa:Ng.samples,drawCalls:fb,triangles:pb};return e&&db.reset(),t},setAutopilot:rv,toggleCamera:av,setCamera:iv,setQuality:mb,hold:(e=!0)=>{f_=!!e},pitService:(e=`dry`,t=1.2,n=!0)=>{let r=$.player,i=Q,a=i.boxU(r.teamIndex)-.6,o=(a%i.length+i.length)%i.length,s=i.at(a,i.boxD(Math.floor(o/i.ds)%i.n));return r.x=s.x,r.z=s.z,r.y=s.y,r.theta=i.thetaAt(a),r.s=o,r.idx=i.locateGlobal(s.x,s.z).i,r.v=0,r.steer=0,Object.assign(r.pit,{stage:2,request:!0,timer:0,serv:e?t:0,choice:e||null}),f_=n,w_.init=!1,w_.yaw=r.theta,Ly.yaw=r.theta,Ly.lastX=void 0,xb(),{s:o,x:s.x,z:s.z}},setMute:ov,setPaused:Sv,finishSession:wy,showMenu:fv,choosePitTire:e=>$?.choosePitTire(e),fastForward:e=>{for(let t=0;t<e;t+=1/60)$.step(1/60);Fy(),xb()},finishNow:()=>{$.autopilot=!0},teleport:(e,t=0)=>{let n=$.player,r=Q.at(e,t);n.x=r.x,n.z=r.z,n.theta=Q.thetaAt(e),n.s=e,n.idx=Q.locateGlobal(r.x,r.z).i,w_.init=!1,w_.yaw=n.theta,xb()},save:e_,opts:Z,DIFFICULTY:od,get race(){return $},get camMix(){return 1-u_.chase},get camMode(){return l_},get quality(){return zg.level},get track(){return Q},get theme(){return n_},get career(){return X},setTrack:e=>($_(e),q_(),Q.id),showCareer:()=>{X||=Bh({difficulty:Z.difficulty,weather:Z.weather},t_),Uh($g,X),qv()},showStandings:()=>Yv(),showUpgrades:()=>{Wv=`career`,Xv()},showEditor:()=>$v(`menu`),seedCareer:()=>{X=Bh({driverName:`Casey Morrow`,number:17,team:{name:`Northline Racing`,livery:{pattern:`chevrons`,c1:15222570,c2:16765514,c3:1381658,number:17}},difficulty:Z.difficulty||`normal`});let e=[{id:`player`,isPlayer:!0,pos:2},...X.rivals.map(e=>e.id).map((e,t)=>({id:e,pos:t===0?1:t+2}))];return Jh(X,e),X.upgradePoints=14,Uh($g,X),t_={driver:{...X.driver},team:X.team},wh($g,t_),X},seedCareerScout:()=>{X=Bh({driverName:`Casey Morrow`,number:17,team:{name:`Northline Racing`,livery:{pattern:`chevrons`,c1:15222570,c2:16765514,c3:1381658,number:17}},difficulty:`normal`});let e=X.rivals.map(e=>e.id),t=t=>{let n=[{id:`player`,isPlayer:!0,pos:t}],r=0;for(let i=1;i<=10;i++)i!==t&&n.push({id:e[r++],pos:i});Jh(X,n)};return t(2),t(3),t(1),X.upgradePoints=20,Uh($g,X),t_={driver:{...X.driver},team:X.team},wh($g,t_),X},seedCareerOffer:()=>{X=Bh({driverName:`Casey Morrow`,number:17,team:{name:`Northline Racing`,livery:{pattern:`chevrons`,c1:15222570,c2:16765514,c3:1381658,number:17}},difficulty:`normal`});let e=X.rivals.map(e=>e.id),t=t=>{let n=[{id:`player`,isPlayer:!0,pos:t}],r=0;for(let i=1;i<=10;i++)i!==t&&n.push({id:e[r++],pos:i});Jh(X,n)};for(let e=0;e<6;e++)t(2);return Uh($g,X),t_={driver:{...X.driver},team:X.team},wh($g,t_),X},showRecruit:()=>ry(),state:()=>({state:p_,phase:$?.phase,pos:$?.player.pos,lap:$?.player.laps,rain:$?.rain,wet:$?.wetness,tire:$?.player.tire,wear:$?.player.wear,pit:$?.player.pit.stage,autopilot:$?.autopilot,camMix:1-u_.chase,cam:l_,quality:zg.level})};