(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=(e,t,n)=>Math.min(n,Math.max(t,e)),t=(e,t,n)=>e+(t-e)*n,n=(t,n,r)=>{let i=e((r-t)/(n-t),0,1);return i*i*(3-2*i)};function r(e){for(;e>Math.PI;)e-=2*Math.PI;for(;e<-Math.PI;)e+=2*Math.PI;return e}function i(e,t){return e=(e%t+t)%t,e>=t/2?e-t:e}var a={gp:{id:`gp`,name:`GP`,vTop:88,accel:26,brake:34,latBase:30,down:.48,steer:.09,wear:1},speedway:{id:`speedway`,name:`Speedway`,vTop:97,accel:22,brake:29,latBase:24,down:.3,steer:.08,wear:.85}};function o(e,t=0){let n=t>e/2?t-e:t;return{L:e,progress:n,prevS:(t%e+e)%e,maxLaps:Math.max(0,Math.floor(n/e))}}function s(e,t){e.progress+=i(t-e.prevS,e.L),e.prevS=t;let n=Math.max(0,Math.floor(e.progress/e.L));return n>e.maxLaps&&(e.maxLaps=n,!0)}var c={asphalt:{grip:1,drag:0},pit:{grip:1,drag:0},kerb:{grip:.95,drag:.05},grass:{grip:.5,drag:.6},gravel:{grip:.35,drag:1.1}};function l(t,n){let r=e(n,0,1);return t===`wet`?.84+.12*r:1-.55*r}function u(t){return 1-.4*e(t,0,1)**1.3}function d({tire:e,wear:t=0,wetness:n=0,surface:r=`asphalt`}){let i=c[r]||c.asphalt;return l(e,n)*u(t)*i.grip}function f(t,n,r,i=1){return(.001+.005*e(Math.abs(n)/50,0,1))*(t===`wet`?1+1.5*(1-e(r,0,1)):1)*i}function p(e,t,n){let r=t/60;return e.latBase*(1+e.down*r*r)*n}function m(e,t,n=1){t=Math.abs(t);let r=e.latBase*n,i=t-r*e.down/3600;return i<=1e-6?e.vTop*1.2:Math.min(e.vTop*1.2,Math.sqrt(r/i))}var h=1.2,g=.42,_=(e,t,n)=>p(e,t,n)*h;function v(t,n,r){let i=e(n/60,0,1.5);return t.brake*(.45+.55*Math.min(1,r))*(1+.25*i*i)}function y(t){let n=e(t,0,1);return Math.max(g,Math.sqrt(1-n*n))}function b(e,t,n,r,i=0){let a=_(e,t,n)*y(i);return v(e,t,n)*r/Math.max(a,1)}function x(t,n,r,i,a=0,o={k:0,excess:0,frac:0}){let s=Math.abs(r),c=n*t.steer/(1+s/28*(s/28)),l=p(t,s,i*y(a))/Math.max(s*s,1),u=e(c,-l,l),d=Math.abs(c)/Math.max(l,1e-4);return o.k=u,o.excess=e(d-1,0,2),o.frac=d,o}var S={k:0,excess:0,frac:0};function C(e,t,n,r,i=0){return x(e,t,n,r,i,S).k}function w(t,n){if(t<0||t>30)return 0;let r=1-e(Math.abs(n)/2.6,0,1),i=1-t/30;return .45*i*i*r}function T(t,{fill:n=0,boosting:r=!1,dt:i}){return r&&t>0?Math.max(0,t-.28*i):e(t+n*i,0,1)}var E={fovDeg:35,pitchDeg:42,widthLandscape:140,widthPortrait:55,carScreenOffset:.55,carScreenOffsetPortrait:.225,blendAspect:[.8,1.2]},D=e=>e*Math.PI/180;function O({x:e,y:t,z:r,yaw:i,aspect:a,zoom:o=1}){let s=E.fovDeg,c=D(E.pitchDeg),l=2*Math.atan(Math.tan(D(s)/2)*a),u=n(E.blendAspect[0],E.blendAspect[1],a),d=E.widthPortrait+(E.widthLandscape-E.widthPortrait)*u,f=E.carScreenOffsetPortrait+(E.carScreenOffset-E.carScreenOffsetPortrait)*u,p=d/2/Math.tan(l/2)*o,m=p*Math.cos(c),h=p*Math.sin(c),g=c+f*D(s)/2,_=Math.max(0,m-h/Math.tan(g)),v=Math.sin(i),y=Math.cos(i),b=[e+v*_,t,r+y*_];return{pos:[b[0]-v*m,t+h,b[2]-y*m],target:b,fov:s,pitchDeg:E.pitchDeg,height:h,distance:p,lead:_}}function k(e,t,n,r,i){let a=e-n,o=(t+r*a)*i,s=Math.exp(-r*i);return[n+(a+o)*s,(t-r*o)*s]}function A(e,t,n,r,i){let a=k(e[t],e[t+`V`]||0,n,r,i);return e[t]=a[0],e[t+`V`]=a[1],e[t]}function j(e,t,n,i){return A(e,`yaw`,e.yaw+r(t-e.yaw),n,i)}function M(e,t,n,r){let i=e.locate(t,n,r,void 0,60);return e.yAt(i.s)}function N(e,t,n,r=.8){return(n>=0?e.leftWall[t]:e.rightWall[t])-r}function ee(e,t,n,r,i=.8,a=12){let o=Math.abs(e.locate(t.x,t.z,r,void 0,60).d),s=0;for(let c=1;c<=a;c++){let l=c/a,u=e.locate(t.x+(n.x-t.x)*l,t.z+(n.z-t.z)*l,r,void 0,60);if(Math.abs(u.d)>N(e,u.i,u.d,i)&&Math.abs(u.d)>o+.05)break;s=l}return s}var P=.26,F=.9,te=1.95,I=4.3,ne=3.2,re=18*Math.PI/180,ie=21*Math.PI/180,ae=[0,.25,.5,.75,1],oe={set(e,t,n){return this.x=e,this.y=t,this.z=n,this}};function se(e,t,n,r){let i=1e9;for(let a=n;a<=r;a+=5){let n=e._idx(t+a)[0];i=Math.min(i,e.leftWall[n],e.rightWall[n])}return i}function ce(t,i,a,o,s={}){let c=s.fovDeg??62,l=s.aspect??16/9,u=e(i.v/80,0,1),d=n(8,16,se(a,i.s,-10,15+i.v*.8)),f=(8+u*2.4)*(.68+.32*d),p=12+u*8,m=a.yAt(i.s);t.init||(t.init=!0,t.yaw=i.theta,t.ox=-Math.sin(i.theta)*f,t.oz=-Math.cos(i.theta)*f,t.oy=F+P*f,t.ly=1,t.pull=1,t.swing=0,t.oxV=t.ozV=t.oyV=t.yawV=t.lyV=t.swingV=0);let h=a.thetaAt(i.s+2),g=h+e(r(i.theta-h),-.6,.6)+e(s.motionLag||0,-.085,.085);a.at(i.s-f,(i.d??0)*.5,oe);let _=r(Math.atan2(i.x-oe.x,i.z-oe.z)-g),v=1,y=-1;for(let e of ae){let t=g+_*e,n=ee(a,i,{x:i.x-Math.sin(t)*f,z:i.z-Math.cos(t)*f},i.idx);if(n>y+1e-6&&(y=n,v=e),n>=1)break}A(t,`swing`,v,7,o),j(t,g+_*e(t.swing,0,1),4.5+4*e(t.swing,0,1),o);let b=Math.sin(t.yaw),x=Math.cos(t.yaw);A(t,`ox`,-b*f,6.5,o),A(t,`oz`,-x*f,6.5,o);let S=i.x+t.ox,C=i.z+t.oz,w=Math.hypot(t.ox,t.oz)||1,T=ee(a,i,{x:S,z:C},i.idx);t.pull=T<t.pull?Math.max(T,t.pull-75*o/w):t.pull+(T-t.pull)*(1-Math.exp(-o*3));let E=Math.max(t.pull*w,Math.min(ne,w)),D=E/w,O=i.x+t.ox*D,k=i.z+t.oz*D,N=M(a,O,k,i.idx);A(t,`oy`,e(F+P*E+(N-m)*.5,te,I),7,o);let ce=Math.max(m+e(t.oy,te,I),N+1.5);A(t,`ly`,1+(a.yAt(i.s+p)-m)*.5,6,o),a.at(i.s+p,(i.d??0)*.5,oe);let le=oe.x-O,ue=oe.z-k,de=[i.x,i.y+.9,i.z],fe=Math.max(Math.hypot(le,ue),1),pe=i.x-O,me=i.z-k,he=Math.hypot(pe,me)||1,L=c*Math.PI/360,ge=Math.atan(Math.tan(L)*l),_e=Math.min(L,ge)*.55,ve=Math.atan2(pe,me),ye=ve+e(r(Math.atan2(le,ue)-ve),-_e,_e),be=Math.atan2(ce-de[1],he),R=Math.atan2(ce-(m+t.ly),fe),xe=Math.min(e(Math.min(R,re),be-_e,be+_e),ie),Se=[O+Math.sin(ye)*fe,ce-Math.tan(xe)*fe,k+Math.cos(ye)*fe];return{pos:[O,ce,k],look:Se,yaw:t.yaw}}function le(e,t,n,{posOmega:r=7,yOmega:i=3,yawOmega:a=1.5,velOmega:o=18}={}){if(j(e,t.theta,a,n),e.lastX===void 0||n<=0||Math.hypot(t.x-e.lastX,t.z-e.lastZ)>3+200*n)e.vx=e.vy=e.vz=0;else{let r=1-Math.exp(-o*n);e.vx+=((t.x-e.lastX)/n-e.vx)*r,e.vy+=((t.y-e.lastY)/n-e.vy)*r,e.vz+=((t.z-e.lastZ)/n-e.vz)*r}return e.lastX=t.x,e.lastY=t.y,e.lastZ=t.z,A(e,`x`,t.x+e.vx*2/r,r,n),A(e,`z`,t.z+e.vz*2/r,r,n),A(e,`y`,t.y+e.vy*2/i,i,n),e}function ue(t){let n=e(t,-1,1);return Math.sign(n)*Math.abs(n)**1.3}function de(e,t=.075){let n=Math.abs(e);return n<=t?0:Math.sign(e)*ue((n-t)/(1-t))}function fe(t,n,r,i){let a=n*t<0,o=Math.abs(n)<Math.abs(t)||a?8.5:6.5-3*e(r,0,1);return t+e(n-t,-o*i,o*i)}function pe(t,r,i,a,o=!0){let s=-t*r,c=n(.8,1.03,a)*n(22,58,Math.abs(r));return{yawRate:s,slipAngle:e(o?-s*.023*c*e(i,0,1):0,-.022,.022)}}function me(t,n,r,i=1,a=!0){let o=a?n.slipAngle*e(i,.35,1):0;return t.slipAngle+=(o-t.slipAngle)*(1-Math.exp(-r/.09)),t.slideRate=(t.slipAngle-(t.prevSlipAngle||0))/r,t.prevSlipAngle=t.slipAngle,n.yawRate}function he(t,r=0,i=0){let a=n(.68,1.03,t)*.58,o=n(.009,.075,Math.abs(r))*.82;return e(Math.max(a,o,e(i,0,1)),0,1)}function L(e=!1,t=0,n=0){return n<12?0:t>.62?9:e&&n>18?7:0}var ge=1.9,_e=-1.65;function ve(e,t,n={y:0,pitch:0,roll:0}){let r=e.yAt(t+ge),i=e.yAt(t+_e),a=(r-i)/3.55;return n.y=i+a*1.65,n.pitch=Math.atan(a),n.roll=-Math.atan(e.bankAt?e.bankAt(t):0),n}var ye=1e3,be=1001,R=1002,xe=1003,Se=1004,Ce=1005,z=1006,we=1007,Te=1008,Ee=1009,B=1010,De=1011,Oe=1012,ke=1013,Ae=1014,je=1015,Me=1016,Ne=1017,Pe=1018,Fe=1020,Ie=35902,Le=35899,Re=1021,ze=1022,Be=1023,Ve=1026,He=1027,Ue=1028,We=1029,Ge=1030,Ke=1031,qe=1033,Je=33776,Ye=33777,Xe=33778,Ze=33779,V=35840,H=35841,Qe=35842,$e=35843,et=36196,tt=37492,nt=37496,rt=37488,it=37489,at=37490,ot=37491,st=37808,ct=37809,lt=37810,ut=37811,dt=37812,ft=37813,pt=37814,mt=37815,ht=37816,gt=37817,_t=37818,vt=37819,yt=37820,bt=37821,xt=36492,St=36494,Ct=36495,wt=36283,Tt=36284,Et=36285,Dt=36286,Ot=2300,kt=2301,At=2302,jt=2303,Mt=2400,Nt=2401,Pt=2402,Ft=3200,It=`srgb`,Lt=`srgb-linear`,Rt=`linear`,zt=`srgb`,Bt=7680,Vt=35044,Ht=35048,Ut=2e3;function Wt(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Gt(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Kt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function qt(){let e=Kt(`canvas`);return e.style.display=`block`,e}var Jt={};function Yt(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Xt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function Zt(...e){e=Xt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function Qt(...e){e=Xt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function $t(...e){let t=e.join(` `);t in Jt||(Jt[t]=!0,Zt(...e))}function en(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var tn={0:0,2:6,4:4,3:5,1:1,6:2,7:7,5:3},nn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},rn=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),an=Math.PI/180,on=180/Math.PI;function sn(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(rn[e&255]+rn[e>>8&255]+rn[e>>16&255]+rn[e>>24&255]+`-`+rn[t&255]+rn[t>>8&255]+`-`+rn[t>>16&15|64]+rn[t>>24&255]+`-`+rn[n&63|128]+rn[n>>8&255]+`-`+rn[n>>16&255]+rn[n>>24&255]+rn[r&255]+rn[r>>8&255]+rn[r>>16&255]+rn[r>>24&255]).toLowerCase()}function cn(e,t,n){return Math.max(t,Math.min(n,e))}function ln(e,t){return(e%t+t)%t}function un(e,t,n){return(1-n)*e+n*t}function dn(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function fn(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function pn(e,t){if(t.constructor===Float32Array)return e;let n=fn(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.max(e/n,-1)}function mn(e,t){if(t.constructor===Float32Array)return e;let n=fn(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.round(e*n)}var U=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=cn(this.x,e.x,t.x),this.y=cn(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=cn(this.x,e,t),this.y=cn(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(cn(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(cn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},hn=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:Zt(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(cn(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},W=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(_n.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(_n.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=cn(this.x,e.x,t.x),this.y=cn(this.y,e.y,t.y),this.z=cn(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=cn(this.x,e,t),this.y=cn(this.y,e,t),this.z=cn(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(cn(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return gn.copy(this).projectOnVector(e),this.sub(gn)}reflect(e){return this.sub(gn.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(cn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},gn=new W,_n=new hn,vn=class{static{this.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return $t(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(yn.makeScale(e,t)),this}rotate(e){return $t(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(yn.makeRotation(-e)),this}translate(e,t){return $t(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(yn.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},yn=new vn,bn=new vn().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xn=new vn().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Sn(){let e={enabled:!0,workingColorSpace:Lt,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=wn(e.r),e.g=wn(e.g),e.b=wn(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Tn(e.r),e.g=Tn(e.g),e.b=Tn(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Rt:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[n].fromXYZ).multiply(this.spaces[t].toXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Lt]:{primaries:t,whitePoint:r,transfer:Rt,toXYZ:bn,fromXYZ:xn,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:It},outputColorSpaceConfig:{drawingBufferColorSpace:It}},[It]:{primaries:t,whitePoint:r,transfer:zt,toXYZ:bn,fromXYZ:xn,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:It}}}),e}var Cn=Sn();function wn(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Tn(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var En,Dn=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{En===void 0&&(En=Kt(`canvas`)),En.width=e.width,En.height=e.height;let t=En.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=En}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Kt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=wn(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(wn(t[e]/255)*255):t[e]=wn(t[e]);return{data:t,width:e.width,height:e.height}}return Zt(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},On=0,kn=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:On++}),this.uuid=sn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width||0,t.height||0,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(An(r[t].image)):e.push(An(r[t]))}else e=An(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function An(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Dn.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Zt(`Texture: Unable to serialize Texture.`),{})}var jn=0,Mn=new W,Nn=class e extends nn{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=be,i=be,a=z,o=Te,s=Be,c=Ee,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jn++}),this.uuid=sn(),this.name=``,this.source=new kn(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new U(0,0),this.repeat=new U(1,1),this.center=new U(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new vn,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Mn).x}get height(){return this.source.getSize(Mn).y}get depth(){return this.source.getSize(Mn).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Zt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?Zt(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ye:e.x-=Math.floor(e.x);break;case be:e.x=e.x<0?0:1;break;case R:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case ye:e.y-=Math.floor(e.y);break;case be:e.y=e.y<0?0:1;break;case R:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Nn.DEFAULT_IMAGE=null,Nn.DEFAULT_MAPPING=300,Nn.DEFAULT_ANISOTROPY=1;var Pn=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=cn(this.x,e.x,t.x),this.y=cn(this.y,e.y,t.y),this.z=cn(this.z,e.z,t.z),this.w=cn(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=cn(this.x,e,t),this.y=cn(this.y,e,t),this.z=cn(this.z,e,t),this.w=cn(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(cn(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Fn=class extends nn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:z,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Pn(0,0,e,t),this.scissorTest=!1,this.viewport=new Pn(0,0,e,t),this.textures=[];let r=n.count;for(let i=0;i<r;i++)this.textures[i]=new Nn({width:e,height:t,depth:n.depth}),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:z,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new kn(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},In=class extends Fn{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ln=class extends Nn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=xe,this.minFilter=xe,this.wrapR=be,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Rn=class extends Nn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=xe,this.minFilter=xe,this.wrapR=be,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},zn=class e{static{this.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Bn.setFromMatrixColumn(e,0).length(),i=1/Bn.setFromMatrixColumn(e,1).length(),a=1/Bn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Hn,e,Un)}lookAt(e,t,n){let r=this.elements;return Kn.subVectors(e,t),Kn.lengthSq()===0&&(Kn.z=1),Kn.normalize(),Wn.crossVectors(n,Kn),Wn.lengthSq()===0&&(Math.abs(n.z)===1?Kn.x+=1e-4:Kn.z+=1e-4,Kn.normalize(),Wn.crossVectors(n,Kn)),Wn.normalize(),Gn.crossVectors(Kn,Wn),r[0]=Wn.x,r[4]=Gn.x,r[8]=Kn.x,r[1]=Wn.y,r[5]=Gn.y,r[9]=Kn.y,r[2]=Wn.z,r[6]=Gn.z,r[10]=Kn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],ee=r[7],P=r[11],F=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*ee,i[8]=a*C+o*D+s*j+c*P,i[12]=a*w+o*O+s*M+c*F,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*ee,i[9]=l*C+u*D+d*j+f*P,i[13]=l*w+u*O+d*M+f*F,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*ee,i[10]=p*C+m*D+h*j+g*P,i[14]=p*w+m*O+h*M+g*F,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*ee,i[11]=_*C+v*D+y*j+b*P,i[15]=_*w+v*O+y*M+b*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Bn.set(r[0],r[1],r[2]).length(),o=Bn.set(r[4],r[5],r[6]).length(),s=Bn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Vn.copy(this);let c=1/a,l=1/o,u=1/s;return Vn.elements[0]*=c,Vn.elements[1]*=c,Vn.elements[2]*=c,Vn.elements[4]*=l,Vn.elements[5]*=l,Vn.elements[6]*=l,Vn.elements[8]*=u,Vn.elements[9]*=u,Vn.elements[10]*=u,t.setFromRotationMatrix(Vn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Ut,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Ut,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Bn=new W,Vn=new zn,Hn=new W(0,0,0),Un=new W(1,1,1),Wn=new W,Gn=new W,Kn=new W,qn=new zn,Jn=new hn,Yn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(cn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-cn(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(cn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-cn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(cn(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-cn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:Zt(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return qn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(qn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Jn.setFromEuler(this),this.setFromQuaternion(Jn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Yn.DEFAULT_ORDER=`XYZ`;var Xn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Zn=0,Qn=new W,$n=new hn,er=new zn,tr=new W,nr=new W,rr=new W,ir=new hn,ar=new W(1,0,0),or=new W(0,1,0),sr=new W(0,0,1),cr={type:`added`},lr={type:`removed`},ur={type:`childadded`,child:null},dr={type:`childremoved`,child:null},fr=class e extends nn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zn++}),this.uuid=sn(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new W,n=new Yn,r=new hn,i=new W(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new zn},normalMatrix:{value:new vn}}),this.matrix=new zn,this.matrixWorld=new zn,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Xn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return $n.setFromAxisAngle(e,t),this.quaternion.multiply($n),this}rotateOnWorldAxis(e,t){return $n.setFromAxisAngle(e,t),this.quaternion.premultiply($n),this}rotateX(e){return this.rotateOnAxis(ar,e)}rotateY(e){return this.rotateOnAxis(or,e)}rotateZ(e){return this.rotateOnAxis(sr,e)}translateOnAxis(e,t){return Qn.copy(e).applyQuaternion(this.quaternion),this.position.add(Qn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ar,e)}translateY(e){return this.translateOnAxis(or,e)}translateZ(e){return this.translateOnAxis(sr,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(er.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?tr.copy(e):tr.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),nr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?er.lookAt(nr,tr,this.up):er.lookAt(tr,nr,this.up),this.quaternion.setFromRotationMatrix(er),r&&(er.extractRotation(r.matrixWorld),$n.setFromRotationMatrix(er),this.quaternion.premultiply($n.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(Qt(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(cr),ur.child=e,this.dispatchEvent(ur),ur.child=null):Qt(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(lr),dr.child=e,this.dispatchEvent(dr),dr.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),er.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),er.multiply(e.parent.matrixWorld)),e.applyMatrix4(er),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(cr),ur.child=e,this.dispatchEvent(ur),ur.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,e,rr),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,ir,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};fr.DEFAULT_UP=new W(0,1,0),fr.DEFAULT_MATRIX_AUTO_UPDATE=!0,fr.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var pr=class extends fr{constructor(){super(),this.isGroup=!0,this.type=`Group`}},mr={type:`move`},hr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new pr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new pr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new pr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.quaternion,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(mr)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new pr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},gr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_r={h:0,s:0,l:0},vr={h:0,s:0,l:0};function yr(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var G=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=It){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Cn.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Cn.workingColorSpace){return this.r=e,this.g=t,this.b=n,Cn.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Cn.workingColorSpace){if(e=ln(e,1),t=cn(t,0,1),n=cn(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=yr(i,r,e+1/3),this.g=yr(i,r,e),this.b=yr(i,r,e-1/3)}return Cn.colorSpaceToWorking(this,r),this}setStyle(e,t=It){function n(t){t!==void 0&&parseFloat(t)<1&&Zt(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseFloat(i[1]))/100,Math.min(100,parseFloat(i[2]))/100,Math.min(100,parseFloat(i[3]))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:Zt(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);Zt(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=It){let n=gr[e.toLowerCase()];return n===void 0?Zt(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=wn(e.r),this.g=wn(e.g),this.b=wn(e.b),this}copyLinearToSRGB(e){return this.r=Tn(e.r),this.g=Tn(e.g),this.b=Tn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=It){return Cn.workingToColorSpace(br.copy(this),e),Math.round(cn(br.r*255,0,255))*65536+Math.round(cn(br.g*255,0,255))*256+Math.round(cn(br.b*255,0,255))}getHexString(e=It){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Cn.workingColorSpace){Cn.workingToColorSpace(br.copy(this),t);let n=br.r,r=br.g,i=br.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Cn.workingColorSpace){return Cn.workingToColorSpace(br.copy(this),t),e.r=br.r,e.g=br.g,e.b=br.b,e}getStyle(e=It){Cn.workingToColorSpace(br.copy(this),e);let t=br.r,n=br.g,r=br.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(_r),this.setHSL(_r.h+e,_r.s+t,_r.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(_r),e.getHSL(vr);let n=un(_r.h,vr.h,t),r=un(_r.s,vr.s,t),i=un(_r.l,vr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},br=new G;G.NAMES=gr;var xr=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new G(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Sr=class extends fr{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yn,this.environmentIntensity=1,this.environmentRotation=new Yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background===null?null:e.background.clone(),this.environment=e.environment===null?null:e.environment.clone(),this.fog=e.fog===null?null:e.fog.clone(),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial===null?null:e.overrideMaterial.clone(),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Cr=new W,wr=new W,Tr=new W,Er=new W,Dr=new W,Or=new W,kr=new W,Ar=new W,jr=new W,Mr=new W,Nr=new Pn,Pr=new Pn,Fr=new Pn,Ir=class e{constructor(e=new W,t=new W,n=new W){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Cr.subVectors(e,t),r.cross(Cr);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Cr.subVectors(r,t),wr.subVectors(n,t),Tr.subVectors(e,t);let a=Cr.dot(Cr),o=Cr.dot(wr),s=Cr.dot(Tr),c=wr.dot(wr),l=wr.dot(Tr),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Er)!==null&&Er.x>=0&&Er.y>=0&&Er.x+Er.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Er)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Er.x),s.addScaledVector(a,Er.y),s.addScaledVector(o,Er.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Nr.setScalar(0),Pr.setScalar(0),Fr.setScalar(0),Nr.fromBufferAttribute(e,t),Pr.fromBufferAttribute(e,n),Fr.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Nr,i.x),a.addScaledVector(Pr,i.y),a.addScaledVector(Fr,i.z),a}static isFrontFacing(e,t,n,r){return Cr.subVectors(n,t),wr.subVectors(e,t),Cr.cross(wr).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Cr.subVectors(this.c,this.b),wr.subVectors(this.a,this.b),Cr.cross(wr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Dr.subVectors(r,n),Or.subVectors(i,n),Ar.subVectors(e,n);let s=Dr.dot(Ar),c=Or.dot(Ar);if(s<=0&&c<=0)return t.copy(n);jr.subVectors(e,r);let l=Dr.dot(jr),u=Or.dot(jr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0&&s-l>0)return a=s/(s-l),t.copy(n).addScaledVector(Dr,a);Mr.subVectors(e,i);let f=Dr.dot(Mr),p=Or.dot(Mr);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Or,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return kr.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(kr,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Dr,a).addScaledVector(Or,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Lr=class{constructor(e=new W(1/0,1/0,1/0),t=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(zr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(zr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=zr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,zr):zr.fromBufferAttribute(r,t),zr.applyMatrix4(e.matrixWorld),this.expandByPoint(zr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Br.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Br.copy(e.boundingBox)),Br.applyMatrix4(e.matrixWorld),this.union(Br)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,zr),zr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qr),Jr.subVectors(this.max,qr),Vr.subVectors(e.a,qr),Hr.subVectors(e.b,qr),Ur.subVectors(e.c,qr),Wr.subVectors(Hr,Vr),Gr.subVectors(Ur,Hr),Kr.subVectors(Vr,Ur);let t=[0,-Wr.z,Wr.y,0,-Gr.z,Gr.y,0,-Kr.z,Kr.y,Wr.z,0,-Wr.x,Gr.z,0,-Gr.x,Kr.z,0,-Kr.x,-Wr.y,Wr.x,0,-Gr.y,Gr.x,0,-Kr.y,Kr.x,0];return!Zr(t,Vr,Hr,Ur,Jr)||(t=[1,0,0,0,1,0,0,0,1],!Zr(t,Vr,Hr,Ur,Jr))?!1:(Yr.crossVectors(Wr,Gr),t=[Yr.x,Yr.y,Yr.z],Zr(t,Vr,Hr,Ur,Jr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,zr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(zr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Rr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Rr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Rr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Rr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Rr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Rr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Rr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Rr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Rr)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Rr=[new W,new W,new W,new W,new W,new W,new W,new W],zr=new W,Br=new Lr,Vr=new W,Hr=new W,Ur=new W,Wr=new W,Gr=new W,Kr=new W,qr=new W,Jr=new W,Yr=new W,Xr=new W;function Zr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Xr.fromArray(e,a);let o=i.x*Math.abs(Xr.x)+i.y*Math.abs(Xr.y)+i.z*Math.abs(Xr.z),s=t.dot(Xr),c=n.dot(Xr),l=r.dot(Xr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Qr=new W,$r=new U,ei=0,ti=class extends nn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ei++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Vt,this.updateRanges=[],this.gpuType=je,this.version=0,this._normalizationScale=e===void 0?void 0:fn(e)}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)$r.fromBufferAttribute(this,t),$r.applyMatrix3(e),this.setXY(t,$r.x,$r.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Qr.fromBufferAttribute(this,t),Qr.applyMatrix3(e),this.setXYZ(t,Qr.x,Qr.y,Qr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Qr.fromBufferAttribute(this,t),Qr.applyMatrix4(e),this.setXYZ(t,Qr.x,Qr.y,Qr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Qr.fromBufferAttribute(this,t),Qr.applyNormalMatrix(e),this.setXYZ(t,Qr.x,Qr.y,Qr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Qr.fromBufferAttribute(this,t),Qr.transformDirection(e),this.setXYZ(t,Qr.x,Qr.y,Qr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}_denormalize(e){let t=this._normalizationScale;return t===void 0?pn(e,this.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?mn(e,this.array):Math.round(e*t)}},ni=class extends ti{constructor(e,t,n){super(new Uint16Array(e),t,n)}},ri=class extends ti{constructor(e,t,n){super(new Uint32Array(e),t,n)}},K=class extends ti{constructor(e,t,n){super(new Float32Array(e),t,n)}},ii=new Lr,ai=new W,oi=new W,si=class{constructor(e=new W,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?ii.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ai.subVectors(e,this.center);let t=ai.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(ai,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(oi.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ai.copy(e.center).add(oi)),this.expandByPoint(ai.copy(e.center).sub(oi))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ci=0,li=new zn,ui=new fr,di=new W,fi=new Lr,pi=new Lr,mi=new W,hi=class e extends nn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ci++}),this.uuid=sn(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Wt(e)?ri:ni)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new vn().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return li.makeRotationFromQuaternion(e),this.applyMatrix4(li),this}rotateX(e){return li.makeRotationX(e),this.applyMatrix4(li),this}rotateY(e){return li.makeRotationY(e),this.applyMatrix4(li),this}rotateZ(e){return li.makeRotationZ(e),this.applyMatrix4(li),this}translate(e,t,n){return li.makeTranslation(e,t,n),this.applyMatrix4(li),this}scale(e,t,n){return li.makeScale(e,t,n),this.applyMatrix4(li),this}lookAt(e){return ui.lookAt(e),ui.updateMatrix(),this.applyMatrix4(ui.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(di).negate(),this.translate(di.x,di.y,di.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new K(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&Zt(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Lr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)Qt(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];fi.setFromBufferAttribute(n),this.morphTargetsRelative?(mi.addVectors(this.boundingBox.min,fi.min),this.boundingBox.expandByPoint(mi),mi.addVectors(this.boundingBox.max,fi.max),this.boundingBox.expandByPoint(mi)):(this.boundingBox.expandByPoint(fi.min),this.boundingBox.expandByPoint(fi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Qt(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new si);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)Qt(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new W,1/0);else if(e){let n=this.boundingSphere.center;if(fi.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];pi.setFromBufferAttribute(n),this.morphTargetsRelative?(mi.addVectors(fi.min,pi.min),fi.expandByPoint(mi),mi.addVectors(fi.max,pi.max),fi.expandByPoint(mi)):(fi.expandByPoint(pi.min),fi.expandByPoint(pi.max))}fi.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)mi.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(mi));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)mi.fromBufferAttribute(a,t),o&&(di.fromBufferAttribute(e,t),mi.add(di)),r=Math.max(r,n.distanceToSquared(mi))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Qt(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Qt(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new ti(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[],c=new Uint8Array(n.count);for(let e=0;e<n.count;e++)o[e]=new W,s[e]=new W;let l=new W,u=new W,d=new W,f=new U,p=new U,m=new U,h=new W,g=new W;function _(e,t,r){c[e]=c[t]=c[r]=1,l.fromBufferAttribute(n,e),u.fromBufferAttribute(n,t),d.fromBufferAttribute(n,r),f.fromBufferAttribute(i,e),p.fromBufferAttribute(i,t),m.fromBufferAttribute(i,r),u.sub(l),d.sub(l),p.sub(f),m.sub(f);let a=1/(p.x*m.y-m.x*p.y);isFinite(a)&&(h.copy(u).multiplyScalar(m.y).addScaledVector(d,-p.y).multiplyScalar(a),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-m.x).multiplyScalar(a),o[e].add(h),o[t].add(h),o[r].add(h),s[e].add(g),s[t].add(g),s[r].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let t=0,n=v.length;t<n;++t){let n=v[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)_(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let y=new W,b=new W,x=new W,S=new W;function C(e){x.fromBufferAttribute(r,e),S.copy(x);let t=o[e];y.copy(t),y.sub(x.multiplyScalar(x.dot(t))).normalize(),b.crossVectors(S,t);let n=b.dot(s[e])<0?-1:1;a.setXYZW(e,y.x,y.y,y.z,n)}for(let e=0,t=n.count;e<t;++e)c[e]&&C(e);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new ti(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new W,i=new W,a=new W,o=new W,s=new W,c=new W,l=new W,u=new W;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)mi.fromBufferAttribute(e,t),mi.normalize(),e.setXYZ(t,mi.x,mi.y,mi.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new ti(a,r,i)}if(this.index===null)return Zt(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},gi=new W,_i=new W,vi=new vn,yi=class{constructor(e=new W(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=gi.subVectors(n,t).cross(_i.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(gi),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||vi.getNormalMatrix(e),r=this.coplanarPoint(gi).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},bi=0,xi=class extends nn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:bi++}),this.uuid=sn(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new G(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Bt,this.stencilZFail=Bt,this.stencilZPass=Bt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Zt(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?Zt(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new G().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new yi().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new U().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new U().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Si=new W,Ci=new W,wi=new W,Ti=new W,Ei=class{constructor(e=new W,t=new W(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Si)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Si.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Si.copy(this.origin).addScaledVector(this.direction,t),Si.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Ci.copy(e).add(t).multiplyScalar(.5),wi.copy(t).sub(e).normalize(),Ti.copy(this.origin).sub(Ci);let i=e.distanceTo(t)*.5,a=-this.direction.dot(wi),o=Ti.dot(this.direction),s=-Ti.dot(wi),c=Ti.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Ci).addScaledVector(wi,d),f}intersectSphere(e,t){if(e.radius<0)return null;Si.subVectors(e.center,this.origin);let n=Si.dot(this.direction),r=Si.dot(Si)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Si)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let ee=S/w,P=C/w,F=1/w,te=T-ee*D,I=E-P*D,ne=O-ee*A,re=k-P*A,ie=j-ee*N,ae=M-P*N,oe=ie*re-ae*ne,se=te*ae-I*ie,ce=ne*I-re*te;if(r){if(oe<0||se<0||ce<0)return null}else if((oe<0||se<0||ce<0)&&(oe>0||se>0||ce>0))return null;let le=oe+se+ce;if(le===0)return null;let ue=F*(oe*D+se*A+ce*N);return(le>0?ue<0:ue>0)?null:this.at(ue/le,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Di=class extends xi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new G(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Oi=new zn,ki=new Ei,Ai=new si,ji=new W,Mi=new W,Ni=new W,Pi=new W,Fi=new W,Ii=new W,Li=new W,Ri=new W,zi=class extends fr{constructor(e=new hi,t=new Di){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Ii.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Fi.fromBufferAttribute(s,e),a?Ii.addScaledVector(Fi,r):Ii.addScaledVector(Fi.sub(t),r))}t.add(Ii)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ai.copy(n.boundingSphere),Ai.applyMatrix4(i),ki.copy(e.ray).recast(e.near),Ai.containsPoint(ki.origin)===!1&&(ki.intersectSphere(Ai,ji)===null||ki.origin.distanceToSquared(ji)>(e.far-e.near)**2)||(Oi.copy(i).invert(),ki.copy(e.ray).applyMatrix4(Oi),(n.boundingBox===null||ki.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,ki)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Vi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Vi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Vi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Vi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Bi(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Ri.copy(s),Ri.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Ri);return l<n.near||l>n.far?null:{distance:l,point:Ri.clone(),object:e}}function Vi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Mi),e.getVertexPosition(c,Ni),e.getVertexPosition(l,Pi);let u=Bi(e,t,n,r,Mi,Ni,Pi,Li);if(u){let e=new W;Ir.getBarycoord(Li,Mi,Ni,Pi,e),i&&(u.uv=Ir.getInterpolatedAttribute(i,s,c,l,e,new U)),a&&(u.uv1=Ir.getInterpolatedAttribute(a,s,c,l,e,new U)),o&&(u.normal=Ir.getInterpolatedAttribute(o,s,c,l,e,new W),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new W,materialIndex:0};Ir.getNormal(Mi,Ni,Pi,t.normal),u.face=t,u.barycoord=e}return u}var Hi=class extends Nn{constructor(e=null,t=1,n=1,r,i,a,o,s,c=xe,l=xe,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ui=class extends ti{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Wi=new zn,Gi=new zn,Ki=[],qi=new Lr,Ji=new zn,Yi=new zi,Xi=new si,Zi=class extends zi{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ui(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Ji)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Lr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Wi),qi.copy(e.boundingBox).applyMatrix4(Wi),this.boundingBox.union(qi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new si),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Wi),Xi.copy(e.boundingSphere).applyMatrix4(Wi),this.boundingSphere.union(Xi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture===null?null:e.morphTexture.clone(),this.instanceColor=e.instanceColor===null?null:e.instanceColor.clone(),this.count=e.count,this.boundingBox=e.boundingBox===null?null:e.boundingBox.clone(),this.boundingSphere=e.boundingSphere===null?null:e.boundingSphere.clone(),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Yi.geometry=this.geometry,Yi.material=this.material,Yi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Xi.copy(this.boundingSphere),Xi.applyMatrix4(n),e.ray.intersectsSphere(Xi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Wi),Gi.multiplyMatrices(n,Wi),Yi.matrixWorld=Gi,Yi.raycast(e,Ki);for(let e=0,n=Ki.length;e<n;e++){let n=Ki[e];n.instanceId=i,n.object=this,t.push(n)}Ki.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ui(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Hi(new Float32Array(r*this.count),r,this.count,Ue,je));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Qi=new si,$i=new U(.5,.5),ea=new W,ta=class{constructor(e=new yi,t=new yi,n=new yi,r=new yi,i=new yi,a=new yi){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ut,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Qi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Qi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Qi)}intersectsSprite(e){return Qi.center.set(0,0,0),Qi.radius=.7071067811865476+$i.distanceTo(e.center),Qi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Qi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(ea.x=r.normal.x>0?e.max.x:e.min.x,ea.y=r.normal.y>0?e.max.y:e.min.y,ea.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ea)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},na=new zn,ra=class e{constructor(){this.coordinateSystem=Ut,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];na.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new ta),n[e].setFromProjectionMatrix(na,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new ta),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}},ia=class extends xi{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new G(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},aa=new zn,oa=new Ei,sa=new si,ca=new W,la=class extends fr{constructor(e=new hi,t=new ia){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),sa.copy(n.boundingSphere),sa.applyMatrix4(r),sa.radius+=i,e.ray.intersectsSphere(sa)===!1)return;aa.copy(r).invert(),oa.copy(e.ray).applyMatrix4(aa);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);ca.fromBufferAttribute(l,n),ua(ca,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)ca.fromBufferAttribute(l,a),ua(ca,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function ua(e,t,n,r,i,a,o){let s=oa.distanceSqToPoint(e);if(s<n){let n=new W;oa.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var da=class extends Nn{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},fa=class extends Nn{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},pa=class extends Nn{constructor(e,t,n=Ae,r,i,a,o=xe,s=xe,c,l=Ve,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new kn(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},ma=class extends pa{constructor(e,t=Ae,n=301,r,i,a=xe,o=xe,s,c=Ve){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ha=class extends Nn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ga=class e extends hi{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new K(c,3)),this.setAttribute(`normal`,new K(l,3)),this.setAttribute(`uv`,new K(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new W;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},_a=class e extends hi{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new W,l=new U;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new K(a,3)),this.setAttribute(`normal`,new K(o,3)),this.setAttribute(`uv`,new K(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},va=class e extends hi{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new K(u,3)),this.setAttribute(`normal`,new K(d,3)),this.setAttribute(`uv`,new K(f,2));function _(){let a=new W,_=new W,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new U,m=new W,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ya=class e extends va{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ba=class e extends hi{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new K(i,3)),this.setAttribute(`normal`,new K(i.slice(),3)),this.setAttribute(`uv`,new K(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new W,r=new W,i=new W;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new W;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new W;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new W,t=new W,n=new W,r=new W,o=new U,s=new U,c=new U;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},xa=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Zt(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new U:new W);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new W,r=[],i=[],a=[],o=new W,s=new zn;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new W)}i[0]=new W,a[0]=new W;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(cn(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(cn(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}};function Sa(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Ca=new W,wa=new W,Ta=new Sa,Ea=new Sa,Da=new Sa,Oa=class extends xa{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new W){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(wa.subVectors(r[0],r[1]).add(r[0]),c=wa);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Ca.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Ca),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Ta.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Ea.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Da.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Ta.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Ea.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Da.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Ta.calc(s),Ea.calc(s),Da.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new W().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}},ka=class e extends ba{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Aa=class e extends hi{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new K(p,3)),this.setAttribute(`normal`,new K(m,3)),this.setAttribute(`uv`,new K(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},ja=class e extends hi{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new W,p=new U;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new K(s,3)),this.setAttribute(`normal`,new K(c,3)),this.setAttribute(`uv`,new K(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Ma=class e extends hi{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new W,d=new W,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new K(p,3)),this.setAttribute(`normal`,new K(m,3)),this.setAttribute(`uv`,new K(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Na=class e extends hi{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new W,f=new W,p=new W;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new K(c,3)),this.setAttribute(`normal`,new K(l,3)),this.setAttribute(`uv`,new K(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function Pa(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Ia(i))i.isRenderTargetTexture?(Zt(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Ia(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Fa(e){let t={};for(let n=0;n<e.length;n++){let r=Pa(e[n]);for(let e in r)t[e]=r[e]}return t}function Ia(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function La(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Ra(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Cn.workingColorSpace}var za={clone:Pa,merge:Fa},Ba=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Va=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ha=class extends xi{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ba,this.fragmentShader=Va,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Pa(e.uniforms),this.uniformsGroups=La(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new G().setHex(r.value);break;case`v2`:this.uniforms[n].value=new U().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new W().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Pn().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new vn().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new zn().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Ua=class extends Ha{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Wa=class extends xi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new G(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new G(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new U(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ga=class extends Wa{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new U(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return cn(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new G(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new G(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new G(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return $t(`MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".`),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){$t(`MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".`),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},Ka=class extends xi{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type=`MeshNormalMaterial`,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new U(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},qa=class extends xi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new G(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new G(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new U(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ja=class extends xi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Ft,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ya=class extends xi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Xa(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Za(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Qa=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},$a=class extends Qa{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Mt,endingEnd:Mt}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Nt:i=e,o=2*t-n;break;case Pt:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Nt:a=e,s=2*n-t;break;case Pt:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},eo=class extends Qa{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},to=class extends Qa{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},no=class extends Qa{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=ao(n,t,g,y,r);i[p]=ro(x,o,_,b,m)}return i}};function ro(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function io(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function ao(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=ro(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=io(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var oo=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Xa(t,this.TimeBufferType),this.values=Xa(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Xa(e.times,Array),values:Xa(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Za(e.settings)&&(n.settings={inTangents:Xa(e.settings.inTangents,Array),outTangents:Xa(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new to(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new eo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new $a(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new no(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ot:t=this.InterpolantFactoryMethodDiscrete;break;case kt:t=this.InterpolantFactoryMethodLinear;break;case At:t=this.InterpolantFactoryMethodSmooth;break;case jt:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return Zt(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ot;case this.InterpolantFactoryMethodLinear:return kt;case this.InterpolantFactoryMethodSmooth:return At;case this.InterpolantFactoryMethodBezier:return jt}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e;Za(this.settings)&&(so(this.settings.inTangents,e),so(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Za(this.settings)&&(co(this.settings.inTangents,e),co(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Qt(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(Qt(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){Qt(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){Qt(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Gt(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){Qt(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===At,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Za(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function so(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]+=t}function co(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}oo.prototype.ValueTypeName=``,oo.prototype.TimeBufferType=Float32Array,oo.prototype.ValueBufferType=Float32Array,oo.prototype.DefaultInterpolation=kt;var lo=class extends oo{constructor(e,t,n){super(e,t,n)}};lo.prototype.ValueTypeName=`bool`,lo.prototype.ValueBufferType=Array,lo.prototype.DefaultInterpolation=Ot,lo.prototype.InterpolantFactoryMethodLinear=void 0,lo.prototype.InterpolantFactoryMethodSmooth=void 0;var uo=class extends oo{constructor(e,t,n,r){super(e,t,n,r)}};uo.prototype.ValueTypeName=`color`;var fo=class extends oo{constructor(e,t,n,r){super(e,t,n,r)}};fo.prototype.ValueTypeName=`number`;var po=class extends Qa{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)hn.slerpFlat(i,0,a,c-o,a,c,s);return i}},mo=class extends oo{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new po(this.times,this.values,this.getValueSize(),e)}};mo.prototype.ValueTypeName=`quaternion`,mo.prototype.InterpolantFactoryMethodSmooth=void 0;var ho=class extends oo{constructor(e,t,n){super(e,t,n)}};ho.prototype.ValueTypeName=`string`,ho.prototype.ValueBufferType=Array,ho.prototype.DefaultInterpolation=Ot,ho.prototype.InterpolantFactoryMethodLinear=void 0,ho.prototype.InterpolantFactoryMethodSmooth=void 0;var go=class extends oo{constructor(e,t,n,r){super(e,t,n,r)}};go.prototype.ValueTypeName=`vector`;var _o=class extends fr{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new G(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},vo=class extends _o{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(fr.DEFAULT_UP),this.updateMatrix(),this.groundColor=new G(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},yo=new zn,bo=new W,xo=new W,So=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new U(512,512),this.mapType=Ee,this.map=null,this.mapPass=null,this.matrix=new zn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ta,this._frameExtents=new U(1,1),this._viewportCount=1,this._viewports=[new Pn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;bo.setFromMatrixPosition(e.matrixWorld),t.position.copy(bo),xo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(xo),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){yo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(yo,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(yo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Co=new W,wo=new hn,To=new W,Eo=class extends fr{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new zn,this.projectionMatrix=new zn,this.projectionMatrixInverse=new zn,this.coordinateSystem=Ut,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Co,wo,To),To.x===1&&To.y===1&&To.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Co,wo,To.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Co,wo,To),To.x===1&&To.y===1&&To.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Co,wo,To.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Do=new W,Oo=new U,ko=new U,Ao=class extends Eo{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=on*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(an*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return on*2*Math.atan(Math.tan(an*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Do.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Do.x,Do.y).multiplyScalar(-e/Do.z),Do.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Do.x,Do.y).multiplyScalar(-e/Do.z)}getViewSize(e,t){return this.getViewBounds(e,Oo,ko),t.subVectors(ko,Oo)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(an*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},jo=class extends So{constructor(){super(new Ao(90,1,.5,500)),this.isPointLightShadow=!0}},Mo=class extends _o{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new jo}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},No=class extends Eo{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Po=class extends So{constructor(){super(new No(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Fo=class extends _o{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(fr.DEFAULT_UP),this.updateMatrix(),this.target=new fr,this.shadow=new Po}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Io=-90,Lo=1,Ro=class extends fr{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Ao(Io,Lo,e,t);r.layers=this.layers,this.add(r);let i=new Ao(Io,Lo,e,t);i.layers=this.layers,this.add(i);let a=new Ao(Io,Lo,e,t);a.layers=this.layers,this.add(a);let o=new Ao(Io,Lo,e,t);o.layers=this.layers,this.add(o);let s=new Ao(Io,Lo,e,t);s.layers=this.layers,this.add(s);let c=new Ao(Io,Lo,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},zo=class extends Ao{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},Bo=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Vo.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Vo(){this._document.hidden===!1&&this.reset()}var Ho=`\\[\\]\\.:\\/`,Uo=RegExp(`[\\[\\]\\.:\\/]`,`g`),Wo=`[^\\[\\]\\.:\\/]`,Go=`[^`+Ho.replace(`\\.`,``)+`]`,Ko=`((?:WC+[\\/:])*)`.replace(`WC`,Wo),qo=`(WCOD+)?`.replace(`WCOD`,Go),Jo=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Wo),Yo=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Wo),Xo=RegExp(`^`+Ko+qo+Jo+Yo+`$`),Zo=[`material`,`materials`,`bones`,`map`],Qo=class{constructor(e,t,n){let r=n||$o.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},$o=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Uo,``)}static parseTrackName(e){let t=Xo.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Zo.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Zt(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){Qt(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){Qt(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){Qt(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){Qt(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){Qt(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){Qt(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){Qt(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;Qt(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){Qt(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){Qt(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};$o.Composite=Qo,$o.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},$o.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},$o.prototype.GetterByBindingType=[$o.prototype._getValue_direct,$o.prototype._getValue_array,$o.prototype._getValue_arrayElement,$o.prototype._getValue_toArray],$o.prototype.SetterByBindingTypeAndVersioning=[[$o.prototype._setValue_direct,$o.prototype._setValue_direct_setNeedsUpdate,$o.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[$o.prototype._setValue_array,$o.prototype._setValue_array_setNeedsUpdate,$o.prototype._setValue_array_setMatrixWorldNeedsUpdate],[$o.prototype._setValue_arrayElement,$o.prototype._setValue_arrayElement_setNeedsUpdate,$o.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[$o.prototype._setValue_fromArray,$o.prototype._setValue_fromArray_setNeedsUpdate,$o.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class{static{this.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function es(e,t,n,r){let i=ts(r);switch(n){case Re:return e*t;case Ue:return e*t/i.components*i.byteLength;case We:return e*t/i.components*i.byteLength;case Ge:return e*t*2/i.components*i.byteLength;case Ke:return e*t*2/i.components*i.byteLength;case ze:return e*t*3/i.components*i.byteLength;case Be:return e*t*4/i.components*i.byteLength;case qe:return e*t*4/i.components*i.byteLength;case Je:case Ye:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Xe:case Ze:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case H:case $e:return Math.max(e,16)*Math.max(t,8)/4;case V:case Qe:return Math.max(e,8)*Math.max(t,8)/2;case et:case tt:case rt:case it:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case nt:case at:case ot:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case st:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ct:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case lt:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ut:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case dt:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ft:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case pt:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case mt:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case ht:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case gt:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case _t:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case vt:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case yt:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case bt:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case xt:case St:case Ct:return Math.ceil(e/4)*Math.ceil(t/4)*16;case wt:case Tt:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Et:case Dt:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function ts(e){switch(e){case Ee:case B:return{byteLength:1,components:1};case Oe:case De:case Me:return{byteLength:2,components:1};case Ne:case Pe:return{byteLength:2,components:4};case Ae:case ke:case je:return{byteLength:4,components:1};case Ie:case Le:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`187`}})),typeof window<`u`&&(window.__THREE__?Zt(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`187`);function ns(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function rs(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var is={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
}`},q={common:{diffuse:{value:new G(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new vn},alphaMap:{value:null},alphaMapTransform:{value:new vn},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new vn}},envmap:{envMap:{value:null},envMapRotation:{value:new vn},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new vn}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new vn}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new vn},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new vn},normalScale:{value:new U(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new vn},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new vn}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new vn}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new vn}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new G(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new G(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new vn},alphaTest:{value:0},uvTransform:{value:new vn}},sprite:{diffuse:{value:new G(16777215)},opacity:{value:1},center:{value:new U(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new vn},alphaMap:{value:null},alphaMapTransform:{value:new vn},alphaTest:{value:0}}},as={basic:{uniforms:Fa([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.fog]),vertexShader:is.meshbasic_vert,fragmentShader:is.meshbasic_frag},lambert:{uniforms:Fa([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new G(0)},envMapIntensity:{value:1}}]),vertexShader:is.meshlambert_vert,fragmentShader:is.meshlambert_frag},phong:{uniforms:Fa([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new G(0)},specular:{value:new G(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:is.meshphong_vert,fragmentShader:is.meshphong_frag},standard:{uniforms:Fa([q.common,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.roughnessmap,q.metalnessmap,q.fog,q.lights,{emissive:{value:new G(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:is.meshphysical_vert,fragmentShader:is.meshphysical_frag},toon:{uniforms:Fa([q.common,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.gradientmap,q.fog,q.lights,{emissive:{value:new G(0)}}]),vertexShader:is.meshtoon_vert,fragmentShader:is.meshtoon_frag},matcap:{uniforms:Fa([q.common,q.bumpmap,q.normalmap,q.displacementmap,q.fog,{matcap:{value:null}}]),vertexShader:is.meshmatcap_vert,fragmentShader:is.meshmatcap_frag},points:{uniforms:Fa([q.points,q.fog]),vertexShader:is.points_vert,fragmentShader:is.points_frag},dashed:{uniforms:Fa([q.common,q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:is.linedashed_vert,fragmentShader:is.linedashed_frag},depth:{uniforms:Fa([q.common,q.displacementmap]),vertexShader:is.depth_vert,fragmentShader:is.depth_frag},normal:{uniforms:Fa([q.common,q.bumpmap,q.normalmap,q.displacementmap,{opacity:{value:1}}]),vertexShader:is.meshnormal_vert,fragmentShader:is.meshnormal_frag},sprite:{uniforms:Fa([q.sprite,q.fog]),vertexShader:is.sprite_vert,fragmentShader:is.sprite_frag},background:{uniforms:{uvTransform:{value:new vn},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:is.background_vert,fragmentShader:is.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new vn}},vertexShader:is.backgroundCube_vert,fragmentShader:is.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:is.cube_vert,fragmentShader:is.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:is.equirect_vert,fragmentShader:is.equirect_frag},distance:{uniforms:Fa([q.common,q.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:is.distance_vert,fragmentShader:is.distance_frag},shadow:{uniforms:Fa([q.lights,q.fog,{color:{value:new G(0)},opacity:{value:1}}]),vertexShader:is.shadow_vert,fragmentShader:is.shadow_frag}};as.physical={uniforms:Fa([as.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new vn},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new vn},clearcoatNormalScale:{value:new U(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new vn},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new vn},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new vn},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new vn},sheen:{value:0},sheenColor:{value:new G(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new vn},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new vn},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new vn},transmissionSamplerSize:{value:new U},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new vn},attenuationDistance:{value:0},attenuationColor:{value:new G(0)},specularColor:{value:new G(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new vn},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new vn},anisotropyVector:{value:new U},anisotropyMap:{value:null},anisotropyMapTransform:{value:new vn}}]),vertexShader:is.meshphysical_vert,fragmentShader:is.meshphysical_frag};var os={r:0,b:0,g:0},ss=new zn,cs=new vn;cs.set(-1,0,0,0,1,0,0,0,1);function ls(e,t,n,r,i,a){let o=new G(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&i.isCubeTexture?(l===void 0&&(l=new zi(new ga(1,1,1),new Ha({name:`BackgroundCubeMaterial`,uniforms:Pa(as.backgroundCube.uniforms),vertexShader:as.backgroundCube.vertexShader,fragmentShader:as.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(ss.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(cs),l.material.toneMapped=Cn.getTransfer(i.colorSpace)!==zt,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new zi(new Aa(2,2),new Ha({name:`BackgroundMaterial`,uniforms:Pa(as.background.uniforms),vertexShader:as.background.vertexShader,fragmentShader:as.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Cn.getTransfer(i.colorSpace)!==zt,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(os,Ra(e)),n.buffers.color.setClear(os.r,os.g,os.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function us(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.isInterleavedBuffer===!0?t.stride:t.itemSize,p=s.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function ds(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function fs(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(Zt(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),f=n.logarithmicDepthBuffer===!0&&d===!1;n.reversedDepthBuffer===!0&&d===!1&&Zt(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`),n.logarithmicDepthBuffer===!0&&d===!0&&Zt(`WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function ps(e){let t=this,n=null,r=0,i=!1,a=!1,o=new yi,s=new vn,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var ms=class extends In{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new da(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ga(5,5,5),i=new Ha({name:`CubemapFromEquirect`,uniforms:Pa(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new zi(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=z),new Ro(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},hs=256,gs=3,_s=20,vs=256,ys=16,bs=3,xs=new W,Ss=new G,Cs=class e{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Ro(1,10,null),this._boxMesh=new zi(new ga(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=xs}=i,s=this._renderer;this._setSize(a);let c=this._allocateTarget(),l=this._getSourceTarget(!0);t>0&&(l.texture.mipmapsAutoUpdate=!1);let u=s.autoClear,d=s.autoClearColor,f=s.autoClearDepth,p=s.autoClearStencil,m=e.background;s.autoClear=!0,s.autoClearColor=!0,s.autoClearDepth=!0,s.autoClearStencil=!0,m===null&&(e.background=s.getClearColor(Ss));let h=new Ro(n,r,l);return h.position.copy(o),h.update(s,e),s.autoClear=u,s.autoClearColor=d,s.autoClearDepth=f,s.autoClearStencil=p,e.background=m,t>0&&(l.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=As(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ks(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(hs,dn(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?hs:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=ws(e,!1,!1),n=Math.log2(e)-gs;for(let r=0;r<=n;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name=`PMREM`,t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=ws(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let r=this._boxMesh,i=this._cubeCamera;r.material=n,i.renderTarget=e,i.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),i.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=As()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=ks()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Es(),this._integrationMaterial=Ds());let n=this._cubeSize,r=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/ys);for(let o=0;o<=r;o++){let s=e.lodToRoughness(o,r);if(o>r-bs)a.roughness.value=s,this._renderCube(t,o,this._integrationMaterial);else{let e=s>0?Math.log2(n)+.5*Math.log2(6/(vs*s**4))+.5:0;i.roughness.value=s,i.lodBias.value=e,this._renderCube(t,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=Os());let n=this._blurMaterial,r=n.uniforms,i=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=i.texture,this._renderCube(e,0,n),r.envMap.value=e.texture,this._renderCube(i,0,n)}};function ws(e,t,n){return new ms(e,{minFilter:Te,generateMipmaps:t,type:Me,colorSpace:Lt,depthBuffer:n})}function Ts(e,t,n){return new Ha({name:e,uniforms:t,vertexShader:is.cube_vert,fragmentShader:n,side:1,blending:0,depthTest:!1,depthWrite:!1})}function Es(){return Ts(`PMREMGGXConvolution`,{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${vs}u

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
	`)}function Ds(){return Ts(`PMREMGGXIntegration`,{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:ys}},`

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
	`)}function Os(){return Ts(`PMREMSphericalGaussianBlur`,{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${_s}
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
	`)}function ks(){return Ts(`PMREMEquirectangularToCubemap`,{envMap:{value:null}},`

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
	`)}function As(){return Ts(`PMREMCubemapToCubemap`,{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function js(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new ms(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture&&t.isPMREMTexture!==!0){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Cs(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Cs(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Ms(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&$t(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Ns(e,t,n,r){let i={},a=new WeakMap,o=new FinalizationRegistry(e=>delete i[e]);function s(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(let n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener(`dispose`,s),delete i[e.id],o.unregister(e);let c=a.get(e);c&&(t.remove(c),a.delete(e)),r.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function l(e,t){return i[t.id]===void 0&&(t.addEventListener(`dispose`,s),i[t.id]=new WeakRef(t),o.register(t,t.id,t),n.memory.geometries++),t}function u(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function d(e){let n=e.index,r=e.attributes.position,i=0;if(r===void 0)return;let o=n===null?r.array.length/3-1:n.array.length,s=new(r.count>=65535?ri:ni)(Math.ceil(o/3)*6,1),c=s.array;if(n!==null){let e=n.array;i=n.version;for(let t=0,n=0;t<o;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];c[n++]=r,c[n++]=i,c[n++]=i,c[n++]=a,c[n++]=a,c[n++]=r}}else{i=r.version;for(let e=0,t=0;e<o;e+=3){let n=e+0,r=e+1,i=e+2;c[t++]=n,c[t++]=r,c[t++]=r,c[t++]=i,c[t++]=i,c[t++]=n}}s.version=i;let l=a.get(e);l&&t.remove(l),a.set(e,s)}function f(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&d(e)}else d(e);return a.get(e)}function p(){for(let e in i){let t=i[e].deref();t!==void 0&&c(t)}}return{get:l,update:u,getWireframeAttribute:f,dispose:p}}function Ps(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Fs(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:Qt(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Is(e,t,n){let r=new WeakMap,i=new Pn;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Ln(h,p,m,u);g.type=je,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new U(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Ls(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Rs={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function zs(e,t,n,r,i,a){let o=new In(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=null,u=new hi;u.setAttribute(`position`,new K([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new K([0,2,0,0,2,0],2));let d=new Ua({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new zi(u,d),p=new No(-1,1,1,-1,0,1),m=null,h=null,g=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new In(t,n,{type:Me,depthBuffer:!1,stencilBuffer:!1}),c=new In(t,n,{type:Me,depthBuffer:!1,stencilBuffer:!1}));let r=i===!0&&y.some(e=>e.needsDepthTexture===!0);r!==(o.depthTexture!==null)&&(r===!0&&l===null&&(l=new pa(t,n),a===!0&&(l.format=He,l.type=Fe)),o.dispose(),o.depthTexture=r?l:null,o.resolveDepthBuffer=r,o.storeMultisampledDepthBuffer=r);for(let e=0;e<y.length;e++){let i=y[e];i.setSize&&i.setSize(t,n),r&&i.needsDepthTexture===!0&&i.setDepthTexture&&i.setDepthTexture(l)}},this.begin=function(e,t){if(g||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,g=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(m!==e.outputColorSpace||h!==e.toneMapping){m=e.outputColorSpace,h=e.toneMapping,d.defines={},Cn.getTransfer(m)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=Rs[h];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(f,p),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}var Bs=new Nn,Vs=new pa(1,1),Hs=new ma(1),Us=new Ln,Ws=new Rn,Gs=new da,Ks=[],qs=[],Js=new Float32Array(16),Ys=new Float32Array(9),Xs=new Float32Array(4);function Zs(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Ks[i];if(a===void 0&&(a=new Float32Array(i),Ks[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Qs(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function $s(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function ec(e,t){let n=qs[t];n===void 0&&(n=new Int32Array(t),qs[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function tc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function nc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Qs(n,t))return;e.uniform2fv(this.addr,t),$s(n,t)}}function rc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Qs(n,t))return;e.uniform3fv(this.addr,t),$s(n,t)}}function ic(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Qs(n,t))return;e.uniform4fv(this.addr,t),$s(n,t)}}function ac(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Qs(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),$s(n,t)}else{if(Qs(n,r))return;Xs.set(r),e.uniformMatrix2fv(this.addr,!1,Xs),$s(n,r)}}function oc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Qs(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),$s(n,t)}else{if(Qs(n,r))return;Ys.set(r),e.uniformMatrix3fv(this.addr,!1,Ys),$s(n,r)}}function sc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Qs(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),$s(n,t)}else{if(Qs(n,r))return;Js.set(r),e.uniformMatrix4fv(this.addr,!1,Js),$s(n,r)}}function cc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function lc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Qs(n,t))return;e.uniform2iv(this.addr,t),$s(n,t)}}function uc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Qs(n,t))return;e.uniform3iv(this.addr,t),$s(n,t)}}function dc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Qs(n,t))return;e.uniform4iv(this.addr,t),$s(n,t)}}function fc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function pc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Qs(n,t))return;e.uniform2uiv(this.addr,t),$s(n,t)}}function mc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Qs(n,t))return;e.uniform3uiv(this.addr,t),$s(n,t)}}function hc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Qs(n,t))return;e.uniform4uiv(this.addr,t),$s(n,t)}}function gc(e){return e.version===0&&(e.compareFunction=519,e.needsUpdate=!0),e}function _c(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_2D_SHADOW?gc(Vs):Bs,n.setTexture2D(t||a,i)}function vc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Ws,i)}function yc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_CUBE_SHADOW?gc(Hs):Gs,n.setTextureCube(t||a,i)}function bc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Us,i)}function xc(e){switch(e){case 5126:return tc;case 35664:return nc;case 35665:return rc;case 35666:return ic;case 35674:return ac;case 35675:return oc;case 35676:return sc;case 5124:case 35670:return cc;case 35667:case 35671:return lc;case 35668:case 35672:return uc;case 35669:case 35673:return dc;case 5125:return fc;case 36294:return pc;case 36295:return mc;case 36296:return hc;case 35678:case 36198:case 36298:case 36306:case 35682:return _c;case 35679:case 36299:case 36307:return vc;case 35680:case 36300:case 36308:case 36293:return yc;case 36289:case 36303:case 36311:case 36292:return bc}}function Sc(e,t){e.uniform1fv(this.addr,t)}function Cc(e,t){let n=Zs(t,this.size,2);e.uniform2fv(this.addr,n)}function wc(e,t){let n=Zs(t,this.size,3);e.uniform3fv(this.addr,n)}function Tc(e,t){let n=Zs(t,this.size,4);e.uniform4fv(this.addr,n)}function Ec(e,t){let n=Zs(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Dc(e,t){let n=Zs(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Oc(e,t){let n=Zs(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function kc(e,t){e.uniform1iv(this.addr,t)}function Ac(e,t){e.uniform2iv(this.addr,t)}function jc(e,t){e.uniform3iv(this.addr,t)}function Mc(e,t){e.uniform4iv(this.addr,t)}function Nc(e,t){e.uniform1uiv(this.addr,t)}function Pc(e,t){e.uniform2uiv(this.addr,t)}function Fc(e,t){e.uniform3uiv(this.addr,t)}function Ic(e,t){e.uniform4uiv(this.addr,t)}function Lc(e,t,n){let r=this.cache,i=t.length,a=ec(n,i);Qs(r,a)||(e.uniform1iv(this.addr,a),$s(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?gc(Vs):Bs;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Rc(e,t,n){let r=this.cache,i=t.length,a=ec(n,i);Qs(r,a)||(e.uniform1iv(this.addr,a),$s(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Ws,a[e])}function zc(e,t,n){let r=this.cache,i=t.length,a=ec(n,i);Qs(r,a)||(e.uniform1iv(this.addr,a),$s(r,a));let o;o=this.type===e.SAMPLER_CUBE_SHADOW?gc(Hs):Gs;for(let e=0;e!==i;++e)n.setTextureCube(t[e]||o,a[e])}function Bc(e,t,n){let r=this.cache,i=t.length,a=ec(n,i);Qs(r,a)||(e.uniform1iv(this.addr,a),$s(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Us,a[e])}function Vc(e){switch(e){case 5126:return Sc;case 35664:return Cc;case 35665:return wc;case 35666:return Tc;case 35674:return Ec;case 35675:return Dc;case 35676:return Oc;case 5124:case 35670:return kc;case 35667:case 35671:return Ac;case 35668:case 35672:return jc;case 35669:case 35673:return Mc;case 5125:return Nc;case 36294:return Pc;case 36295:return Fc;case 36296:return Ic;case 35678:case 36198:case 36298:case 36306:case 35682:return Lc;case 35679:case 36299:case 36307:return Rc;case 35680:case 36300:case 36308:case 36293:return zc;case 36289:case 36303:case 36311:case 36292:return Bc}}var Hc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=xc(t.type)}},Uc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Vc(t.type)}},Wc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Gc=/(\w+)(\])?(\[|\.)?/g;function Kc(e,t){e.seq.push(t),e.map[t.id]=t}function qc(e,t,n){let r=e.name,i=r.length;for(Gc.lastIndex=0;;){let a=Gc.exec(r),o=Gc.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Kc(n,l===void 0?new Hc(s,e,t):new Uc(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Wc(s),Kc(n,e)),n=e}}}var Jc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);qc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Yc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Xc=37297,Zc=0;function Qc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var $c=new vn;function el(e){Cn._getMatrix($c,Cn.workingColorSpace,e);let t=`mat3( ${$c.elements.map(e=>e.toFixed(4))} )`;switch(Cn.getTransfer(e)){case Rt:return[t,`LinearTransferOETF`];case zt:return[t,`sRGBTransferOETF`];default:return Zt(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function tl(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Qc(e.getShaderSource(t),r)}return i}function nl(e,t){let n=el(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,`}`].join(`
`)}var rl={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function il(e,t){let n=rl[t];return n===void 0?(Zt(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var al=new W;function ol(){return Cn.getLuminanceCoefficients(al),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${al.x.toFixed(4)}, ${al.y.toFixed(4)}, ${al.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function sl(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(ul).join(`
`)}function cl(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function ll(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function ul(e){return e!==``}function dl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function fl(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var pl=/^[ \t]*#include +<([\w\d./]+)>/gm;function ml(e){return e.replace(pl,hl)}function hl(e,t){let n=is[t];if(n===void 0)throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`);return ml(n)}var gl=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _l(e){return e.replace(gl,vl)}function vl(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function yl(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}var bl={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function xl(e){return bl[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Sl={302:`ENVMAP_MODE_REFRACTION`};function Cl(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Sl[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var wl={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Tl(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:wl[e.combine]||`ENVMAP_BLENDING_NONE`}function El(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=xl(n),l=n.envMapPMREM===!0?`ENVMAP_TYPE_PMREM`:`ENVMAP_TYPE_CUBE`,u=Cl(n),d=Tl(n),f=sl(n),p=cl(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(ul).join(`
`),h.length>0&&(h+=`
`),g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(ul).join(`
`),g.length>0&&(g+=`
`)):(h=[yl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.diffuseRoughnessMapUv?`#define DIFFUSE_ROUGHNESSMAP_UV `+n.diffuseRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(ul).join(`
`),g=[yl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.envMapPMREM?`#define ENVMAP_MAX_LOD `+n.envMapMaxLod+`.0`:``,n.envMapPMREM?`#define ENVMAP_SIZE `+n.envMapSize+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughness?`#define USE_DIFFUSE_ROUGHNESS`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:is.tonemapping_pars_fragment,n.toneMapping===0?``:il(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,is.colorspace_pars_fragment,nl(`linearToOutputTexel`,n.outputColorSpace),ol(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(ul).join(`
`)),o=ml(o),o=dl(o,n),o=fl(o,n),s=ml(s),s=dl(s,n),s=fl(s,n),o=_l(o),s=_l(s),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,h=[f,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=Yc(i,i.VERTEX_SHADER,v),x=Yc(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,`position`):i.bindAttribLocation(m,0,n.index0AttributeName),i.linkProgram(m);function S(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(m)||``,r=i.getShaderInfoLog(b)||``,a=i.getShaderInfoLog(x)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,m,b,x);else{let e=tl(i,b,`vertex`),n=tl(i,x,`fragment`);Qt(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):Zt(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:h},fragmentShader:{log:c,prefix:g}})}i.deleteShader(b),i.deleteShader(x),C=new Jc(i,m),w=ll(i,m)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,Xc)),T},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Zc++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}var Dl=0,Ol=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new kl(e),t.set(e,n)),n}},kl=class{constructor(e){this.id=Dl++,this.code=e,this.usedTimes=0}};function Al(e){return e===1030||e===37490||e===36285}function jl(e,t,n,r,i,a){let o=new Xn,s=new Ol,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function p(e){return c.add(e),e===0?`uv`:`uv${e}`}function m(i,o,l,u,m,h){let g=u.fog,_=m.geometry,v=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,b=t.get(i.envMap||v,y),x=f[i.type],S=r.precision;i.precision!==null&&(S=r.getMaxPrecision(i.precision),S!==i.precision&&Zt(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,S,`instead.`));let C=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,w=C===void 0?0:C.length,T=0;_.morphAttributes.position!==void 0&&(T=1),_.morphAttributes.normal!==void 0&&(T=2),_.morphAttributes.color!==void 0&&(T=3);let E,D,O,k;if(x){let e=as[x];E=e.vertexShader,D=e.fragmentShader}else{E=i.vertexShader,D=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),M=m.isInstancedMesh===!0,N=m.isBatchedMesh===!0,ee=!!i.map,P=!!i.matcap,F=!!b,te=F&&b.isPMREMTexture===!0,I=!!i.aoMap,ne=!!i.lightMap,re=!!i.bumpMap&&i.wireframe===!1,ie=!!i.normalMap,ae=!!i.displacementMap,oe=!!i.emissiveMap,se=!!i.metalnessMap,ce=!!i.roughnessMap,le=i.anisotropy>0,ue=i.clearcoat>0,de=i.diffuseRoughness>0,fe=i.dispersion>0,pe=i.retroreflectivity>0,me=i.iridescence>0,he=i.sheen>0,L=i.transmission>0,ge=le&&!!i.anisotropyMap,_e=ue&&!!i.clearcoatMap,ve=ue&&!!i.clearcoatNormalMap,ye=ue&&!!i.clearcoatRoughnessMap,be=de&&!!i.diffuseRoughnessMap,R=me&&!!i.iridescenceMap,xe=me&&!!i.iridescenceThicknessMap,Se=he&&!!i.sheenColorMap,Ce=he&&!!i.sheenRoughnessMap,z=!!i.specularMap,we=!!i.specularColorMap,Te=!!i.specularIntensityMap,Ee=L&&!!i.transmissionMap,B=L&&!!i.thicknessMap,De=!!i.gradientMap,Oe=!!i.alphaMap,ke=i.alphaTest>0,Ae=!!i.alphaHash,je=!!i.extensions,Me=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Me=e.toneMapping);let Ne=te?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,Pe={shaderID:x,shaderType:i.type,shaderName:i.name,vertexShader:E,fragmentShader:D,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:S,batching:N,batchingColor:N&&m._colorsTexture!==null,instancing:M,instancingColor:M&&m.instanceColor!==null,instancingMorph:M&&m.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Cn.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ee,matcap:P,envMap:F,envMapMode:F&&b.mapping,envMapPMREM:te,envMapMaxLod:te?Ne.length-1:null,envMapSize:te?Ne[0].width:null,aoMap:I,lightMap:ne,bumpMap:re,normalMap:ie,displacementMap:ae,emissiveMap:oe,normalMapObjectSpace:ie&&i.normalMapType===1,normalMapTangentSpace:ie&&i.normalMapType===0,packedNormalMap:ie&&i.normalMapType===0&&Al(i.normalMap.format),metalnessMap:se,roughnessMap:ce,anisotropy:le,anisotropyMap:ge,clearcoat:ue,clearcoatMap:_e,clearcoatNormalMap:ve,clearcoatRoughnessMap:ye,diffuseRoughness:de,diffuseRoughnessMap:be,dispersion:fe,retroreflection:pe,iridescence:me,iridescenceMap:R,iridescenceThicknessMap:xe,sheen:he,sheenColorMap:Se,sheenRoughnessMap:Ce,specularMap:z,specularColorMap:we,specularIntensityMap:Te,transmission:L,transmissionMap:Ee,thicknessMap:B,gradientMap:De,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Oe,alphaTest:ke,alphaHash:Ae,combine:i.combine,mapUv:ee&&p(i.map.channel),aoMapUv:I&&p(i.aoMap.channel),lightMapUv:ne&&p(i.lightMap.channel),bumpMapUv:re&&p(i.bumpMap.channel),normalMapUv:ie&&p(i.normalMap.channel),displacementMapUv:ae&&p(i.displacementMap.channel),emissiveMapUv:oe&&p(i.emissiveMap.channel),metalnessMapUv:se&&p(i.metalnessMap.channel),roughnessMapUv:ce&&p(i.roughnessMap.channel),anisotropyMapUv:ge&&p(i.anisotropyMap.channel),clearcoatMapUv:_e&&p(i.clearcoatMap.channel),clearcoatNormalMapUv:ve&&p(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&p(i.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:be&&p(i.diffuseRoughnessMap.channel),iridescenceMapUv:R&&p(i.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&p(i.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&p(i.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&p(i.sheenRoughnessMap.channel),specularMapUv:z&&p(i.specularMap.channel),specularColorMapUv:we&&p(i.specularColorMap.channel),specularIntensityMapUv:Te&&p(i.specularIntensityMap.channel),transmissionMapUv:Ee&&p(i.transmissionMap.channel),thicknessMapUv:B&&p(i.thicknessMap.channel),alphaMapUv:Oe&&p(i.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(ie||le),vertexNormals:!!_.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!_.attributes.uv&&(ee||Oe),fog:!!g,useFog:i.fog===!0,fogExp2:!!g&&g.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||_.attributes.normal===void 0&&ie===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:_.attributes.position!==void 0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:w,morphTextureStride:T,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:h.filter(e=>e.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Me,decodeVideoTexture:ee&&i.map.isVideoTexture===!0&&Cn.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:oe&&i.emissiveMap.isVideoTexture===!0&&Cn.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:je&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(je&&i.extensions.multiDraw===!0||N)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Pe.vertexUv1s=c.has(1),Pe.vertexUv2s=c.has(2),Pe.vertexUv3s=c.has(3),c.clear(),Pe}function h(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),_(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function _(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.diffuseRoughness&&o.enable(25),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function v(e){let t=f[e.type],n;if(t){let e=as[t];n=za.clone(e.uniforms)}else n=e.uniforms;return n}function y(t,n){let r=u.get(n);return r===void 0?(r=new El(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function b(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function x(e){s.remove(e)}function S(){s.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:y,releaseProgram:b,releaseShaderCache:x,programs:l,dispose:S}}function Ml(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Nl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Pl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Fl(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Nl),r.length>1&&r.sort(t||Pl),i.length>1&&i.sort(t||Pl)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Il(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Fl,e.set(t,[i])):n>=r.length?(i=new Fl,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Ll(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new W,color:new G};break;case`SpotLight`:n={position:new W,direction:new W,color:new G,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new W,color:new G,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new W,skyColor:new G,groundColor:new G};break;case`RectAreaLight`:n={color:new G,position:new W,halfWidth:new W,halfHeight:new W}}return e[t.id]=n,n}}}function Rl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var zl=0;function Bl(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Vl(e){let t=new Ll,n=Rl(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new W);let i=new W,a=new zn,o=new zn;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Bl);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=q.LTC_FLOAT_1,r.rectAreaLTC2=q.LTC_FLOAT_2):(r.rectAreaLTC1=q.LTC_HALF_1,r.rectAreaLTC2=q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=zl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Hl(e){let t=new Vl(e),n=[],r=[],i=[];function a(e){u.camera=e,n.length=0,r.length=0,i.length=0}function o(e){e.isLightProbeGrid?i.push(e):n.push(e)}function s(e){r.push(e)}function c(){t.setup(n),i.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function l(e){t.setupView(n,e)}let u={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function Ul(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Hl(e),t.set(n,[a])):r>=i.length?(a=new Hl(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Wl=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gl=`uniform sampler2D shadow_pass;
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
}`,Kl=[new W(1,0,0),new W(-1,0,0),new W(0,1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1)],ql=[new W(0,-1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1),new W(0,-1,0),new W(0,-1,0)],Jl=new zn,Yl=new W,Xl=new W;function Zl(e,t,n){let r=new ta,i=new U,a=new U,o=new Pn,s=new Ja,c=new Ya,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Ha({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new U},radius:{value:4}},vertexShader:Wl,fragmentShader:Gl}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new hi;m.setAttribute(`position`,new ti(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new zi(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(Zt(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){Zt(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){Zt(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new In(i.x,i.y,{format:Ge,type:Me,minFilter:z,magFilter:z,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new pa(i.x,i.y,je),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Ve,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=xe,d.map.depthTexture.magFilter=xe}else l.isPointLight?(d.map=new ms(i.x),d.map.depthTexture=new ma(i.x,Ae)):(d.map=new In(i.x,i.y),d.map.depthTexture=new pa(i.x,i.y,Ae)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Ve,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=z,d.map.depthTexture.magFilter=z):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=xe,d.map.depthTexture.magFilter=xe);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);let _=d.camera.layers.mask&4294967294?d.camera.layers:s.layers;for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Yl.setFromMatrixPosition(l.matrixWorld),e.position.copy(Yl),Xl.copy(e.position),Xl.add(Kl[t]),e.up.copy(ql[t]),e.lookAt(Xl),e.updateMatrixWorld(),n.makeTranslation(-Yl.x,-Yl.y,-Yl.z),Jl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Jl,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,_,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new In(i.x,i.y,{format:Ge,type:Me}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s,c){if(n.visible===!1)return;if(n.layers.test(s)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),s=n.material;if(Array.isArray(s)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=s[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,c);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(s.visible){let t=y(n,s,o,c);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let l=n.children;for(let e=0,t=l.length;e<t;e++)b(l[e],i,a,o,s,c)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Ql(e,t){function n(){let t=!1,n=new Pn,r=null,i=new Pn(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?se(e.DEPTH_TEST):ce(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=tn[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?se(e.STENCIL_TEST):ce(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c={},l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new G(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,ee=0,P=e.getParameter(e.VERSION);P.indexOf(`WebGL`)===-1?P.indexOf(`OpenGL ES`)!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(P)[1]),N=ee>=2):(ee=parseFloat(/^WebGL (\d)/.exec(P)[1]),N=ee>=1);let F=null,te={},I=e.getParameter(e.SCISSOR_BOX),ne=e.getParameter(e.VIEWPORT),re=new Pn().fromArray(I),ie=new Pn().fromArray(ne);function ae(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let oe={};oe[e.TEXTURE_2D]=ae(e.TEXTURE_2D,e.TEXTURE_2D,1),oe[e.TEXTURE_CUBE_MAP]=ae(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[e.TEXTURE_2D_ARRAY]=ae(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),oe[e.TEXTURE_3D]=ae(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),se(e.DEPTH_TEST),o.setFunc(3),L(!1),ge(1),se(e.CULL_FACE),me(0);function se(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ce(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function le(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ue(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function de(t){return h!==t&&(e.useProgram(t),h=t,!0)}let fe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};fe[103]=e.MIN,fe[104]=e.MAX;let pe={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function me(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(ce(e.BLEND),g=!1);else if(g===!1&&(se(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Qt(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:Qt(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:Qt(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:Qt(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(fe[n],fe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(pe[r],pe[i],pe[o],pe[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function he(t,n){t.side===2?ce(e.CULL_FACE):se(e.CULL_FACE);let r=t.side===1;n&&(r=!r),L(r),t.blending===1&&t.transparent===!1?me(0):me(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ve(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?se(e.SAMPLE_ALPHA_TO_COVERAGE):ce(e.SAMPLE_ALPHA_TO_COVERAGE)}function L(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ge(t){t===0?ce(e.CULL_FACE):(se(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function _e(t){t!==k&&(N&&e.lineWidth(t),k=t)}function ve(t,n,r){t?(se(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n,r=-r),e.polygonOffset(n,r))):ce(e.POLYGON_OFFSET_FILL)}function ye(t){t?se(e.SCISSOR_TEST):ce(e.SCISSOR_TEST)}function be(t){t===void 0&&(t=e.TEXTURE0+M-1),F!==t&&(e.activeTexture(t),F=t)}function R(t,n,r){r===void 0&&(r=F===null?e.TEXTURE0+M-1:F);let i=te[r];i===void 0&&(i={type:void 0,texture:void 0},te[r]=i),(i.type!==t||i.texture!==n)&&(F!==r&&(e.activeTexture(r),F=r),e.bindTexture(t,n||oe[t]),i.type=t,i.texture=n)}function xe(){let t=te[F];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Se(){try{e.compressedTexImage2D(...arguments)}catch(e){Qt(`WebGLState:`,e)}}function Ce(){try{e.compressedTexImage3D(...arguments)}catch(e){Qt(`WebGLState:`,e)}}function z(){try{e.texSubImage2D(...arguments)}catch(e){Qt(`WebGLState:`,e)}}function we(){try{e.texSubImage3D(...arguments)}catch(e){Qt(`WebGLState:`,e)}}function Te(){try{e.compressedTexSubImage2D(...arguments)}catch(e){Qt(`WebGLState:`,e)}}function Ee(){try{e.compressedTexSubImage3D(...arguments)}catch(e){Qt(`WebGLState:`,e)}}function B(){try{e.texStorage2D(...arguments)}catch(e){Qt(`WebGLState:`,e)}}function De(){try{e.texStorage3D(...arguments)}catch(e){Qt(`WebGLState:`,e)}}function Oe(){try{e.texImage2D(...arguments)}catch(e){Qt(`WebGLState:`,e)}}function ke(){try{e.texImage3D(...arguments)}catch(e){Qt(`WebGLState:`,e)}}function Ae(t){return d[t]===void 0?e.getParameter(t):d[t]}function je(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Me(t){re.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),re.copy(t))}function Ne(t){ie.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ie.copy(t))}function Pe(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,i,i),r.set(t,i))}function Fe(t,n,r){let i=l.get(n).get(t);c[i]!==r&&(e.bindBufferBase(e.UNIFORM_BUFFER,i,r),c[i]=r)}function Ie(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},F=null,te={},f={},c={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new G(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,re.set(0,0,e.canvas.width,e.canvas.height),ie.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:se,disable:ce,bindFramebuffer:le,drawBuffers:ue,useProgram:de,setBlending:me,setMaterial:he,setFlipSided:L,setCullFace:ge,setLineWidth:_e,setPolygonOffset:ve,setScissorTest:ye,activeTexture:be,bindTexture:R,unbindTexture:xe,compressedTexImage2D:Se,compressedTexImage3D:Ce,texImage2D:Oe,texImage3D:ke,pixelStorei:je,getParameter:Ae,updateUBOMapping:Pe,uniformBlockBinding:Fe,texStorage2D:B,texStorage3D:De,texSubImage2D:z,texSubImage3D:we,compressedTexSubImage2D:Te,compressedTexSubImage3D:Ee,scissor:Me,viewport:Ne,reset:Ie}}function $l(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new U,u=new WeakMap,d=new Set,f,p=new WeakMap,m=new Set,h=new FinalizationRegistry(e=>m.delete(e)),g=!1;try{g=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function _(e,t){return g?new OffscreenCanvas(e,t):Kt(`canvas`)}function v(e,t,n){let r=1,i=Fe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=_(n,a));let o=t?_(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),Zt(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&Zt(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function y(e){return e.generateMipmaps}function b(t){e.generateMipmap(t)}function x(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function S(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];Zt(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||Zt(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Rt:Cn.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function C(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,Zt(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function w(e,t){return y(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function T(e){let t=new WeakRef(e);r.get(e).__ref=t,m.add(t),h.register(e,t,t)}function E(e){let t=r.get(e).__ref;t!==void 0&&(m.delete(t),h.unregister(t))}function D(e){k(e.target)}function O(e){A(e.target)}function k(e){e.removeEventListener(`dispose`,D),E(e),M(e),e.isVideoTexture&&u.delete(e),e.isHTMLTexture&&d.delete(e)}function A(e){e.removeEventListener(`dispose`,O),E(e),ee(e)}function j(){for(let e of m){let t=e.deref();t!==void 0&&(t.isRenderTarget===!0?A(t):k(t))}m.clear(),d.clear()}function M(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&N(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function N(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function ee(t){let n=r.get(t);n.__depthDisposeCallback&&n.__depthDisposeCallback();let i=t.depthTexture;if(i&&i.renderTarget===t&&k(i),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let a=t.textures;for(let t=0,n=a.length;t<n;t++){let n=r.get(a[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(a[t])}r.remove(t)}let P=0;function F(){P=0}function te(){return P}function I(e){P=e}function ne(){let e=P;return e>=i.maxTextures&&Zt(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),P+=1,e}function re(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ie(t,i){let a=r.get(t);if(t.isVideoTexture&&Ne(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)Zt(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)Zt(`WebGLRenderer: Texture marked for update but image is incomplete`);else{he(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ae(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?he(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function oe(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?he(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function se(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?L(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ce={[ye]:e.REPEAT,[be]:e.CLAMP_TO_EDGE,[R]:e.MIRRORED_REPEAT},le={[xe]:e.NEAREST,[Se]:e.NEAREST_MIPMAP_NEAREST,[Ce]:e.NEAREST_MIPMAP_LINEAR,[z]:e.LINEAR,[we]:e.LINEAR_MIPMAP_NEAREST,[Te]:e.LINEAR_MIPMAP_LINEAR},ue={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function de(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&Zt(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ce[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ce[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ce[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,le[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,le[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,ue[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function fe(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,D),T(n));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=re(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&N(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function pe(e,t,n){return Math.floor(Math.floor(e/n)/t)}function me(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=pe(n.start,r.width,4),c=pe(t.start,r.width,4);n.start<=i+1&&a===c&&pe(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function he(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=fe(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Cn.getPrimaries(Cn.workingColorSpace),r=o.colorSpace===``?null:Cn.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=v(o.image,!1,i.maxTextureSize);t=Pe(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=S(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);de(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,x=f.__version===void 0||l===!0,T=u.dataReady,E=w(o,t);if(o.isDepthTexture)m=C(o.format===He,o.type),x&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else _?(x&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&me(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(T){if(o.layerUpdates.size>0){let t=es(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else Zt(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?Zt(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=es(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)_?(x&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(x){if(_)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&x){let t=Fe(g[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(_){if(x){let r=Fe(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);y(o)&&o.mipmapsAutoUpdate===!0&&b(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function L(t,o,s){if(o.image.length!==6)return;let c=fe(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Cn.getPrimaries(Cn.workingColorSpace),r=o.colorSpace===``?null:Cn.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=v(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Pe(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),x=S(o.internalFormat,g,_,o.normalized,o.colorSpace),T=o.isVideoTexture!==!0,E=u.__version===void 0||c===!0,D=l.dataReady,O=w(o,h);de(e.TEXTURE_CUBE_MAP,o);let k;if(o.isDepthTexture){if(x=C(o.format===He,o.type),E){if(T)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,x,h.width,h.height);else for(let t=0;t<6;t++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,h.width,h.height,0,g,_,null)}}else if(f){T&&E&&n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,h.width,h.height);for(let t=0;t<6;t++){k=m[t].mipmaps;for(let r=0;r<k.length;r++){let i=k[r];o.format===1023?T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,g,_,i.data):g===null?Zt(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):T?D&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,i.data)}}}else{if(k=o.mipmaps,T&&E){k.length>0&&O++;let t=Fe(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,t.width,t.height)}for(let t=0;t<6;t++)if(p){T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<k.length;r++){let i=k[r].image[t].image;T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,i.width,i.height,0,g,_,i.data)}}else{T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,g,_,m[t]);for(let r=0;r<k.length;r++){let i=k[r];T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,g,_,i.image[t])}}}y(o)&&o.mipmapsAutoUpdate===!0&&b(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ge(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=S(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Me(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,je(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function _e(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=C(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Me(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,je(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,je(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=S(o.internalFormat,c,l,o.normalized,o.colorSpace);Me(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,je(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,je(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ve(t,i,a){let o=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=r.get(i.depthTexture);c.__renderTarget=i;let l=o?i.depthTexture.image[0]:i.depthTexture.image;c.__webglTexture&&l.width===i.width&&l.height===i.height||(l.width=i.width,l.height=i.height,i.depthTexture.needsUpdate=!0),o?se(i.depthTexture,0):ie(i.depthTexture,0);let u=c.__webglTexture,d=je(i),f=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Me(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Me(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Ee(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)ve(i.__webglFramebuffer[e],t,e);else t.texture.mipmaps.length>0?ve(i.__webglFramebuffer[0],t,0):ve(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),_e(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else if(t.texture.mipmaps.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),_e(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function B(t,n,i){let a=r.get(t);n!==void 0&&ge(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&Ee(t)}function De(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,O),T(t);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Me(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=S(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=je(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),_e(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),de(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)ge(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else ge(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);y(i)?b(e.TEXTURE_CUBE_MAP):i.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),de(c,a),ge(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),y(a)&&b(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),de(r,i),i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)ge(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else ge(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);y(i)?b(r):i.mipmaps.length>0&&e.texParameteri(r,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}t.depthBuffer&&Ee(t)}function Oe(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(y(a)&&a.mipmapsAutoUpdate===!0){let t=x(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),b(t),n.unbindTexture()}}}let ke=[];function Ae(t){if(t.samples>0){if(Me(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.texture.mipmaps.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(ke.length=0,ke.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&ke.push(l),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,ke))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function je(e){return Math.min(i.maxSamples,e.samples)}function Me(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function Ne(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Pe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Cn.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&Zt(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):Qt(`WebGLTextures: Unsupported texture color space:`,n)),t}function Fe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ne,this.resetTextureUnits=F,this.getTextureUnits=te,this.setTextureUnits=I,this.setTexture2D=ie,this.setTexture2DArray=ae,this.setTexture3D=oe,this.setTextureCube=se,this.rebindTextures=B,this.setupRenderTarget=De,this.updateRenderTargetMipmap=Oe,this.updateMultisampleRenderTarget=Ae,this.setupDepthRenderbuffer=Ee,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=Me,this.dispose=j}function eu(e,t){function n(n,r=``){let i,a=Cn.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var tu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,nu=`
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

}`,ru=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ha(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ha({vertexShader:tu,fragmentShader:nu,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new zi(new Aa(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},iu=class extends nn{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new ru,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new U,C=null,w=null,T=new Ao;T.viewport=new Pn;let E=new Ao;E.viewport=new Pn;let D=[T,E],O=new zo,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new hr,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new hr,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new hr,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function M(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,M),r.removeEventListener(`inputsourceschange`,N);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,I.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&Zt(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&Zt(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,M),r.addEventListener(`inputsourceschange`,N),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?He:Ve,a=_.stencil?Fe:Ae);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new In(d.textureWidth,d.textureHeight,{format:Be,type:Ee,depthTexture:new pa(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new In(f.framebufferWidth,f.framebufferHeight,{format:Be,type:Ee,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),I.setContext(r),I.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function N(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}function ee(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;ee(O,i);for(let e=0;e<a.length;e++)ee(a[e],i);O.projectionMatrix.copy(T.projectionMatrix),O.projectionMatrixInverse.copy(T.projectionMatrixInverse),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),P(e,O,i)};function P(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=on*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let F=null;function te(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new Ao,o.layers.enable(n),o.viewport=new Pn,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new ha,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}F&&F(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let I=new ns;I.setAnimationLoop(te),this.setAnimationLoop=function(e){F=e},this.dispose=function(){}}},au=new zn,ou=new vn;ou.set(-1,0,0,0,1,0,0,0,1);function su(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Ra(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(au.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(ou),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function cu(e,t,n,r){let i={},a={};function o(e,t){let n=t.program;r.uniformBlockBinding(e,n,i[e.id])}function s(e,n){let o=i[e.id];o===void 0&&(m(e),o=c(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let u=t.render.frame;a[e.id]!==u&&(l(e),a[e.id]=u)}function c(t){let n=e.createBuffer(),r=t.__size,i=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,r,i),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function l(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)u(t[n],e,n,a);else u(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function u(t,n,r,i){if(f(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=h(i,!0);d(i,t.__data,e),e+=a.storage/Float32Array.BYTES_PER_ELEMENT}}else d(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function d(e,t,n){typeof e==`number`||typeof e==`boolean`?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,r){let i=e.value,a=t+`_`+n;if(Array.isArray(i)){r[a]===void 0&&(r[a]=[]);let e=r[a],t=!1;for(let n=0;n<i.length;n++)p(i[n],e,n)===!0&&(t=!0);return t}return p(i,r,a)}function p(e,t,n){if(t[n]===void 0)return t[n]=typeof e==`number`||typeof e==`boolean`?e:ArrayBuffer.isView(e)?e.slice():e.clone(),!0;{let r=t[n];if(typeof e==`number`||typeof e==`boolean`){if(r!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(r.equals(e)===!1)return r.copy(e),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let i=0,a=r.length;i<a;i++){let a=r[i],o=Array.isArray(a.value)?a.value:[a.value],s=Array.isArray(t[e])||Array.isArray(a.value),c=n;for(let e=0,t=o.length;e<t;e++){let t=o[e],r=h(t,s),i=n%16,a=i%r.boundary,l=i+a;n+=a,l!==0&&16-l<r.storage&&(n+=16-l),e===0&&(c=n),n+=r.storage}a.__data=new(a.type===`int`?Int32Array:a.type===`uint`?Uint32Array:Float32Array)((n-c)/Float32Array.BYTES_PER_ELEMENT),a.__offset=c}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e,t){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?Zt(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):Zt(`WebGLRenderer: Unsupported uniform value type.`,e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function g(t){let n=t.target;n.removeEventListener(`dispose`,g),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);i={},a={}}return{bind:o,update:s,dispose:_}}var lu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),uu=null;function du(){return uu===null&&(uu=new Hi(lu,16,16,Ge,Me),uu.name=`DFG_LUT`,uu.minFilter=z,uu.magFilter=z,uu.wrapS=be,uu.wrapT=be,uu.generateMipmaps=!1,uu.needsUpdate=!0),uu}var fu=class{constructor(e={}){let{canvas:t=qt(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Ee}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([qe,Ke,We]),g=new Set([Ee,Ae,Oe,Fe,Ne,Pe]),_=new Uint32Array(4),v=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=It;let j=0,M=0,N=null,ee=-1,P=null,F=new Pn,te=new Pn,I=null,ne=new G(0),re=0,ie=t.width,ae=t.height,oe=1,se=null,ce=null,le=new Pn(0,0,ie,ae),ue=new Pn(0,0,ie,ae),de=!1,fe=new ta,pe=new ra,me=!1,he=!1,L=new zn,ge=new W,_e=new Pn,ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ye=!1;function be(){return N===null?oe:1}let R=n;function xe(e,n){return t.getContext(e,n)}let Se,Ce,z,we,B,De,ke,je,Ie,Le,Re,ze,Be,Ve,He,Ue,Ge,Je,Ye,Xe,Ze,V,H;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r187`),t.addEventListener(`webglcontextlost`,et,!1),t.addEventListener(`webglcontextrestored`,tt,!1),t.addEventListener(`webglcontextcreationerror`,nt,!1),R===null){let t=`webgl2`;if(R=xe(t,e),R===null)throw xe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Qe()}catch(e){throw t.removeEventListener(`webglcontextlost`,et,!1),t.removeEventListener(`webglcontextrestored`,tt,!1),t.removeEventListener(`webglcontextcreationerror`,nt,!1),Qt(`WebGLRenderer: `+e.message),e}function Qe(){Se=new Ms(R),Se.init(),Ze=new eu(R,Se),Ce=new fs(R,Se,e,Ze),z=new Ql(R,Se),Ce.reversedDepthBuffer&&d&&z.buffers.depth.setReversed(!0),O=R.createFramebuffer(),k=R.createFramebuffer(),A=R.createFramebuffer(),we=new Fs(R),B=new Ml,De=new $l(R,Se,z,B,Ce,Ze,we),ke=new js(T),je=new rs(R),V=new us(R,je),Ie=new Ns(R,je,we,V),Le=new Ls(R,Ie,je,V,we),Je=new Is(R,Ce,De),He=new ps(B),Re=new jl(T,ke,Se,Ce,V,He),ze=new su(T,B),Be=new Il,Ve=new Ul(Se),Ge=new ls(T,ke,z,Le,p,s),Ue=new Zl(T,Le,Ce),H=new cu(R,we,Ce,z),Ye=new ds(R,Se,we),Xe=new Ps(R,Se,we),we.programs=Re.programs,T.capabilities=Ce,T.extensions=Se,T.properties=B,T.renderLists=Be,T.shadowMap=Ue,T.state=z,T.info=we}m!==1009&&(w=new zs(m,t.width,t.height,o,r,i));let $e=new iu(T,R);this.xr=$e,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let e=Se.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Se.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return oe},this.setPixelRatio=function(e){e!==void 0&&(oe=e,this.setSize(ie,ae,!1))},this.getSize=function(e){return e.set(ie,ae)},this.setSize=function(e,n,r=!0){$e.isPresenting?Zt(`WebGLRenderer: Can't change size while VR device is presenting.`):(ie=e,ae=n,t.width=Math.floor(e*oe),t.height=Math.floor(n*oe),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(ie*oe,ae*oe).floor()},this.setDrawingBufferSize=function(e,n,r){ie=e,ae=n,oe=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)Qt(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){Zt(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(F)},this.getViewport=function(e){return e.copy(le)},this.setViewport=function(e,t,n,r){e.isVector4?le.set(e.x,e.y,e.z,e.w):le.set(e,t,n,r),z.viewport(F.copy(le).multiplyScalar(be()).round())},this.getScissor=function(e){return e.copy(ue)},this.setScissor=function(e,t,n,r){e.isVector4?ue.set(e.x,e.y,e.z,e.w):ue.set(e,t,n,r),z.scissor(te.copy(ue).multiplyScalar(be()).round())},this.getScissorTest=function(){return de},this.setScissorTest=function(e){z.setScissorTest(de=e)},this.setOpaqueSort=function(e){se=e},this.setTransparentSort=function(e){ce=e},this.getClearColor=function(e){return e.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor(...arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=Ge.getClearColor(),r=Ge.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,R.clearBufferuiv(R.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,R.clearBufferiv(R.COLOR,0,v))}else r|=R.COLOR_BUFFER_BIT}t&&(r|=R.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&R.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,et,!1),t.removeEventListener(`webglcontextrestored`,tt,!1),t.removeEventListener(`webglcontextcreationerror`,nt,!1),Ge.dispose(),Be.dispose(),Ve.dispose(),De.dispose(),B.dispose(),ke.dispose(),Le.dispose(),Ie.dispose(),V.dispose(),H.dispose(),Re.dispose(),$e.dispose(),$e.removeEventListener(`sessionstart`,lt),$e.removeEventListener(`sessionend`,ut),dt.stop()};function et(e){e.preventDefault(),Yt(`WebGLRenderer: Context Lost.`),E=!0}function tt(){Yt(`WebGLRenderer: Context Restored.`),E=!1;let e=we.autoReset,t=Ue.enabled,n=Ue.autoUpdate,r=Ue.needsUpdate,i=Ue.type;Qe(),we.autoReset=e,Ue.enabled=t,Ue.autoUpdate=n,Ue.needsUpdate=r,Ue.type=i}function nt(e){Qt(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function rt(e){let t=e.target;t.removeEventListener(`dispose`,rt),it(t)}function it(e){at(e),B.remove(e)}function at(e){let t=B.get(e).programs;t!==void 0&&(t.forEach(function(e){Re.releaseProgram(e)}),e.isShaderMaterial&&Re.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ve);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=St(e,t,n,r,i);z.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ie.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;V.setup(i,r,s,n,c);let h,g=Ye;if(c!==null&&(h=je.get(c),g=Xe,g.setIndex(h)),i.isMesh)r.wireframe===!0?(z.setLineWidth(r.wireframeLinewidth*be()),g.setMode(R.LINES)):g.setMode(R.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),z.setLineWidth(e*be()),i.isLineSegments?g.setMode(R.LINES):i.isLineLoop?g.setMode(R.LINE_LOOP):g.setMode(R.LINE_STRIP)}else i.isPoints?g.setMode(R.POINTS):i.isSprite&&g.setMode(R.TRIANGLES);if(i.isBatchedMesh){if(Se.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?je.get(c).bytesPerElement:1,o=B.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(R,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ot(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),me===!0&&He.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,vt(e,t,r),e.side=0,e.needsUpdate=!0,vt(e,t,r),e.side=2):vt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Ve.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),he=this.localClippingEnabled,me=He.init(this.clippingPlanes,he),me===!0&&He.setGlobalState(this.clippingPlanes,t),D!==null&&Ue.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];ot(o,n,t,e),r.add(o)}else ot(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=B.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Se.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let st=null;function ct(e){st&&st(e)}function lt(){dt.stop()}function ut(){dt.start()}let dt=new ns;dt.setAnimationLoop(ct),typeof self<`u`&&dt.setContext(self),this.setAnimationLoop=function(e){st=e,$e.setAnimationLoop(e),e===null?dt.stop():dt.start()},$e.addEventListener(`sessionstart`,lt),$e.addEventListener(`sessionend`,ut),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){Qt(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=$e.enabled===!0&&$e.isPresenting===!0,r=w!==null&&(N===null||n)&&w.begin(T,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),$e.enabled===!0&&$e.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&($e.cameraAutoUpdate===!0&&$e.updateCamera(t),t=$e.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,N),x=Ve.get(e,C.length),x.init(t),x.state.textureUnits=De.getTextureUnits(),C.push(x),L.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?pe.setFromArrayCamera(t):fe.setFromProjectionMatrix(L,Ut,t.reversedDepth),he=this.localClippingEnabled,me=He.init(this.clippingPlanes,he),b=Be.get(e,S.length),b.init(),S.push(b),this.info.render.frame++,$e.enabled===!0&&$e.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&ft(e,t,-1/0,T.sortObjects)}ft(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(se,ce),ye=$e.enabled===!1||$e.isPresenting===!1||$e.hasDepthSensing()===!1,ye&&Ge.addToRenderList(b,e),this.info.autoReset===!0&&this.info.reset(),me===!0&&He.beginShadows();let i=x.state.shadowsArray;if(Ue.render(i,e,t),me===!0&&He.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];mt(n,r,e,a)}ye&&Ge.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];pt(b,e,n,n.viewport)}}else r.length>0&&mt(n,r,e,t),ye&&Ge.render(e),pt(b,e,t)}N!==null&&M===0&&(De.updateMultisampleRenderTarget(N),De.updateRenderTargetMipmap(N)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),V.resetDefaultState(),ee=-1,P=null,C.pop(),C.length>0?(x=C[C.length-1],De.setTextureUnits(x.state.textureUnits),me===!0&&He.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function ft(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){let i=t.isArrayCamera?pe:fe;if(!e.frustumCulled||e.intersectsFrustum(i)){r&&_e.setFromMatrixPosition(e.matrixWorld).applyMatrix4(L);let i=Le.update(e),a=e.material;a.visible&&b.push(e,i,a,n,_e.z,null,t)}}else if(e.isMesh||e.isLine||e.isPoints){let i=t.isArrayCamera?pe:fe;if(!e.frustumCulled||e.intersectsFrustum(i)){let i=Le.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),_e.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),_e.copy(e.boundingSphere.center)),_e.applyMatrix4(e.matrixWorld).applyMatrix4(L)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,_e.z,s,t)}}else a.visible&&b.push(e,i,a,n,_e.z,null,t)}}}let i=e.children;for(let e=0,a=i.length;e<a;e++)ft(i[e],t,n,r)}function pt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),me===!0&&He.setGlobalState(T.clippingPlanes,n),r&&z.viewport(F.copy(r)),i.length>0&&ht(i,t,n),a.length>0&&ht(a,t,n),o.length>0&&ht(o,t,n),z.buffers.depth.setTest(!0),z.buffers.depth.setMask(!0),z.buffers.color.setMask(!0),z.setPolygonOffset(!1)}function mt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Se.has(`EXT_color_buffer_half_float`)||Se.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new In(1,1,{generateMipmaps:!0,type:e?Me:Ee,minFilter:Te,samples:Math.max(4,Ce.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Cn.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||F;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(ne),re=T.getClearAlpha(),re<1&&T.setClearColor(16777215,.5),T.clear(),ye&&Ge.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),me===!0&&He.setGlobalState(T.clippingPlanes,r),ht(e,n,r),De.updateMultisampleRenderTarget(a),De.updateRenderTargetMipmap(a),Se.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,gt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(De.updateMultisampleRenderTarget(a),De.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(ne,re),d!==void 0&&(r.viewport=d),T.toneMapping=u}function ht(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&gt(o,t,n,s,l,c)}}function gt(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function _t(e){let t=0;for(let n of e)n.texture!==null&&t++;return t}function vt(e,t,n){t.isScene!==!0&&(t=ve);let r=B.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Re.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Re.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=ke.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,rt),l=new Map,r.programs=l,r.programVariants=new Map);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return xt(e,s),d}else s.uniforms=Re.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Re.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=He.uniform),xt(e,s),r.needsLights=wt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.numLightProbeGrids=_t(x.state.lightProbeGridArray),r.currentProgram=d,r.uniformsList=null,d}function yt(e,t,n,r,i){let a=B.get(e),o=a.currentProgram.id+`,`+r+`,`+i,s=a.programVariants.get(o);return s===void 0?(s=vt(e,t,n),a.programVariants.set(o,s)):(a.currentProgram=s,a.uniformsList=null,a.outputColorSpace=r,a.toneMapping=i),s}function bt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Jc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function xt(e,t){let n=B.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function St(e,t,n,r,i){t.isScene!==!0&&(t=ve),De.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?T.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Cn.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=ke.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=B.get(r),b=x.state.lights;if(me===!0&&(he===!0||e!==P)){let t=e===P&&r.id===ee;He.setState(r,e,t)}let S=!1,C=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==b.state.version||i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?S=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==He.numPlanes||v.numIntersection!==He.numIntersection)?S=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.morphTargetsCount===_&&v.numLightProbeGrids===_t(x.state.lightProbeGridArray)?(v.outputColorSpace!==s||v.toneMapping!==h)&&(C=!0):S=!0:S=!0:(S=!0,v.__version=r.version);let w=v.currentProgram;(S===!0||C===!0)&&(w=C===!0?yt(r,t,i,s,h):vt(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,w,v));let E=!1,O=!1,k=!1,A=w.getUniforms(),j=v.uniforms;if(z.useProgram(w.program)&&(E=!0,O=!0,k=!0),r.id!==ee&&(ee=r.id,O=!0),E||P!==e){z.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),A.setValue(R,`projectionMatrix`,e.projectionMatrix),A.setValue(R,`viewMatrix`,e.matrixWorldInverse);let t=A.map.cameraPosition;t!==void 0&&t.setValue(R,ge.setFromMatrixPosition(e.matrixWorld)),Ce.logarithmicDepthBuffer&&A.setValue(R,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&A.setValue(R,`isOrthographic`,e.isOrthographicCamera===!0),P!==e&&(P=e,O=!0,k=!0)}if(v.needsLights&&(b.state.sunShadowMap.length>0&&A.setValue(R,`sunShadowMap`,b.state.sunShadowMap,De),b.state.directionalShadowMap.length>0&&A.setValue(R,`directionalShadowMap`,b.state.directionalShadowMap,De),b.state.spotShadowMap.length>0&&A.setValue(R,`spotShadowMap`,b.state.spotShadowMap,De),b.state.pointShadowMap.length>0&&A.setValue(R,`pointShadowMap`,b.state.pointShadowMap,De)),i.isSkinnedMesh){A.setOptional(R,i,`bindMatrix`),A.setOptional(R,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),A.setValue(R,`boneTexture`,e.boneTexture,De))}i.isBatchedMesh&&(A.setOptional(R,i,`batchingTexture`),A.setValue(R,`batchingTexture`,i._matricesTexture,De),A.setOptional(R,i,`batchingIdTexture`),A.setValue(R,`batchingIdTexture`,i._indirectTexture,De),A.setOptional(R,i,`batchingColorTexture`),i._colorsTexture!==null&&A.setValue(R,`batchingColorTexture`,i._colorsTexture,De));let M=n.morphAttributes;if((M.position!==void 0||M.normal!==void 0||M.color!==void 0)&&Je.update(i,n,w),(O||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,A.setValue(R,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(j.envMapIntensity.value=t.environmentIntensity),j.dfgLUT!==void 0&&(j.dfgLUT.value=du()),O){if(A.setValue(R,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&Ct(j,k),a&&r.fog===!0&&ze.refreshFogUniforms(j,a),ze.refreshMaterialUniforms(j,r,oe,ae,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.numLightProbeGrids>0){let e=y,t=0;for(let n of x.state.lightProbeGridArray)n.texture!==null&&(e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++);for(let n in e)e[n].length=t;j.probesSH.value=e.textures,j.probesMin.value=e.min,j.probesMax.value=e.max,j.probesResolution.value=e.resolution}Jc.upload(R,bt(v),j,De)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Jc.upload(R,bt(v),j,De),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&A.setValue(R,`center`,i.center),A.setValue(R,`modelViewMatrix`,i.modelViewMatrix),A.setValue(R,`normalMatrix`,i.normalMatrix),A.setValue(R,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];H.update(n,w),H.bind(n,w)}}return w}function Ct(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function wt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=B.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),B.get(e.texture).__webglTexture=t,B.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=B.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,j=t,M=n;let r=null,i=!1,a=!1;if(e){let o=B.get(e);if(o.__useDefaultFramebuffer!==void 0){z.bindFramebuffer(R.FRAMEBUFFER,o.__webglFramebuffer),F.copy(e.viewport),te.copy(e.scissor),I=e.scissorTest,z.viewport(F),z.scissor(te),z.setScissorTest(I),ee=-1;return}if(o.__webglFramebuffer===void 0)De.setupRenderTarget(e);else if(o.__hasExternalTextures)De.rebindTextures(e,B.get(e.texture).__webglTexture,B.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&B.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);De.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=B.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&De.useMultisampledRTT(e)===!1?B.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,F.copy(e.viewport),te.copy(e.scissor),I=e.scissorTest}else F.copy(le).multiplyScalar(oe).floor(),te.copy(ue).multiplyScalar(oe).floor(),I=de;if(n!==0&&(r=O),z.bindFramebuffer(R.FRAMEBUFFER,r)&&z.drawBuffers(e,r),z.viewport(F),z.scissor(te),z.setScissorTest(I),i){let r=B.get(e.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=B.get(e.textures[t]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=B.get(e.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,t.__webglTexture,n)}ee=-1};function Tt(e){let t=B.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ce.textureFormatReadable(e.format),t.__typeReadable=Ce.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){Qt(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=B.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){z.bindFramebuffer(R.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+s);let u=Tt(o);if(u.__formatReadable===!1){Qt(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){Qt(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&R.readPixels(t,n,r,i,Ze.convert(c),Ze.convert(l),a)}finally{let e=N===null?null:B.get(N).__webglFramebuffer;z.bindFramebuffer(R.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=B.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){z.bindFramebuffer(R.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+s);let d=Tt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,f),R.bufferData(R.PIXEL_PACK_BUFFER,a.byteLength,R.STREAM_READ),R.readPixels(t,n,r,i,Ze.convert(l),Ze.convert(u),0),R.bindBuffer(R.PIXEL_PACK_BUFFER,null);let p=N===null?null:B.get(N).__webglFramebuffer;z.bindFramebuffer(R.FRAMEBUFFER,p);let m=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await en(R,m,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,f),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,a),R.bindBuffer(R.PIXEL_PACK_BUFFER,null),R.deleteBuffer(f),R.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;De.setTexture2D(e,0),R.copyTexSubImage2D(R.TEXTURE_2D,n,0,0,o,s,i,a),z.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ze.convert(t.format),_=Ze.convert(t.type),v;t.isData3DTexture?(De.setTexture3D(t,0),v=R.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(De.setTexture2DArray(t,0),v=R.TEXTURE_2D_ARRAY):(De.setTexture2D(t,0),v=R.TEXTURE_2D),z.activeTexture(R.TEXTURE0),z.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,t.flipY),z.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),z.pixelStorei(R.UNPACK_ALIGNMENT,t.unpackAlignment);let y=z.getParameter(R.UNPACK_ROW_LENGTH),b=z.getParameter(R.UNPACK_IMAGE_HEIGHT),x=z.getParameter(R.UNPACK_SKIP_PIXELS),S=z.getParameter(R.UNPACK_SKIP_ROWS),C=z.getParameter(R.UNPACK_SKIP_IMAGES);z.pixelStorei(R.UNPACK_ROW_LENGTH,h.width),z.pixelStorei(R.UNPACK_IMAGE_HEIGHT,h.height),z.pixelStorei(R.UNPACK_SKIP_PIXELS,l),z.pixelStorei(R.UNPACK_SKIP_ROWS,u),z.pixelStorei(R.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=B.get(e),r=B.get(t),h=B.get(n.__renderTarget),g=B.get(r.__renderTarget);z.bindFramebuffer(R.READ_FRAMEBUFFER,h.__webglFramebuffer),z.bindFramebuffer(R.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,B.get(e).__webglTexture,i,d+n),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,B.get(t).__webglTexture,a,m+n)),R.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,R.DEPTH_BUFFER_BIT,R.NEAREST);z.bindFramebuffer(R.READ_FRAMEBUFFER,null),z.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||B.has(e)){let n=B.get(e),r=B.get(t);z.bindFramebuffer(R.READ_FRAMEBUFFER,k),z.bindFramebuffer(R.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,n.__webglTexture,i),T?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,r.__webglTexture,a),i===0?T?R.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):R.copyTexSubImage2D(v,a,f,p,l,u,o,s):R.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,R.COLOR_BUFFER_BIT,R.NEAREST);z.bindFramebuffer(R.READ_FRAMEBUFFER,null),z.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?R.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?R.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):R.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):R.texSubImage2D(R.TEXTURE_2D,a,f,p,o,s,g,_,h);z.pixelStorei(R.UNPACK_ROW_LENGTH,y),z.pixelStorei(R.UNPACK_IMAGE_HEIGHT,b),z.pixelStorei(R.UNPACK_SKIP_PIXELS,x),z.pixelStorei(R.UNPACK_SKIP_ROWS,S),z.pixelStorei(R.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps===!0&&t.mipmapsAutoUpdate===!0&&R.generateMipmap(v),z.unbindTexture()},this.initRenderTarget=function(e){B.get(e).__webglFramebuffer===void 0&&De.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?De.setTextureCube(e,0):e.isData3DTexture?De.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?De.setTexture2DArray(e,0):De.setTexture2D(e,0),z.unbindTexture()},this.resetState=function(){j=0,M=0,N=null,z.reset(),V.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ut}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Cn._getDrawingBufferColorSpace(e),t.unpackColorSpace=Cn._getUnpackColorSpace()}},pu=1.7,mu=2.3,hu=new Map;function gu(t){let n=(t.id||``)+`:`+t.n+`:`+t.length.toFixed(3),i=hu.get(n);if(i)return i;let a=t.n,o=t.px,s=t.pz,c=t.nx,l=t.nz,u=t.ds,d=new Float64Array(a),f=new Float64Array(a),p=new Float64Array(a),m=new Float64Array(a);for(let e=0;e<a;e++)d[e]=Math.max(.5,t.half[e]-(t.squeeze[e]?mu:pu)),p[e]=o[e],m[e]=s[e];for(let t=0;t<2400;t++)for(let t=0;t<a;t++){let n=(t+a-1)%a,r=(t+1)%a,i=(t+a-2)%a,u=(t+2)%a,h=(4*(p[n]+p[r])-(p[i]+p[u]))/6-o[t],g=(4*(m[n]+m[r])-(m[i]+m[u]))/6-s[t],_=h*c[t]+g*l[t],v=e(f[t]+1.7*(_-f[t]),-d[t],d[t]);f[t]=v,p[t]=o[t]+c[t]*v,m[t]=s[t]+l[t]*v}let h=new Float64Array(a),g=new Float64Array(a),_=new Float32Array(a);for(let e=0;e<a;e++){let t=(e+1)%a,n=p[t]-p[e],r=m[t]-m[e];h[e]=Math.atan2(n,r),g[e]=Math.hypot(n,r)||u}for(let e=0;e<a;e++){let t=(e+a-1)%a;_[e]=r(h[e]-h[t])/((g[e]+g[t])/2)}let v=_u(_,2),y={d:Float32Array.from(f),kappa:v,x:Float32Array.from(p),z:Float32Array.from(m)};return hu.set(n,y),y}function _u(e,t){let n=e.length,r=new Float32Array(n);for(let i=0;i<n;i++){let a=0;for(let r=-t;r<=t;r++)a+=e[(i+r+n)%n];r[i]=a/(2*t+1)}return r}var vu=.88,yu=.85,bu=.8,xu=new Map;function Su(t,n){let r=(t.id||``)+`:`+n.id+`:`+t.n+`:`+t.length.toFixed(3),i=xu.get(r);if(i)return i;let a=t.n,o=gu(t).kappa,s=new Float32Array(a),c=new Float32Array(a);for(let e=0;e<a;e++){let r=0;for(let t=-3;t<=3;t++)r=Math.max(r,Math.abs(o[(e+t+a)%a]));let i=28*Math.sqrt(Math.max(.04,.9*n.steer/Math.max(r,1e-4)-1));s[e]=Math.min(n.vTop*1.05,i,m(n,r,t.squeeze[e]?yu:vu)),c[e]=s[e]}for(let r=0;r<2*a;r++){let i=a-1-r%a,s=(i+1)%a,l=c[s],u=t.squeeze[s]?yu:vu,d=p(n,l,u),f=e(l*l*Math.abs(o[s])/Math.max(d,1),0,1),m=Math.max(g,Math.sqrt(1-f*f)),h=Math.min(v(n,l,u)*bu,_(n,l,u)*.9*m),y=Math.sqrt(l*l+2*h*t.ds);y<c[i]&&(c[i]=y)}let l={v:c,corner:s};return xu.set(r,l),l}var Cu={RED:.5,YELLOW:.12,MIN_YELLOW:2,BLEND:.35,MIN_DIST:4},wu=[.2,.95,.32],Tu=[1,.84,.08],Eu=[1,.14,.1];function Du(e,t,n){return e<=t?0:(e*e-t*t)/(2*Math.max(n,Cu.MIN_DIST))}function Ou(e,t){return e>=Cu.RED*t?2:+(e>=Math.max(Cu.MIN_YELLOW,Cu.YELLOW*t))}function ku(e,t,n,r=0){let i=Math.max(Cu.MIN_YELLOW,Cu.YELLOW*t),a=Cu.RED*t,o=Cu.BLEND,s=wu,c=wu,l=0;return e>=a?s=c=Eu:e>=a*(1-o*.5)?(s=Tu,c=Eu,l=(e-a*(1-o*.5))/(a*o*.5)):e>=i?s=c=Tu:e>=i*(1-o)&&(s=wu,c=Tu,l=(e-i*(1-o))/(i*o)),n[r]=s[0]+(c[0]-s[0])*l,n[r+1]=s[1]+(c[1]-s[1])*l,n[r+2]=s[2]+(c[2]-s[2])*l,Ou(e,t)}var Au=.75,ju=.07,Mu=e=>Math.ceil(148/e.ds)+1;function Nu(e,t,n,r,i,a,o,s=Mu(e)){let c=e.n,l=e.ds,u=gu(e),d=Su(e,t).v,f=Math.sqrt(Math.max(.25,i)),p=v(t,Math.max(r,8),Math.min(1,i)),m=Math.floor((n-8)/l),h=Pu;for(let t=0;t<s;t++){let i=((m+t)%c+c)%c,s=(m+t)*l-n,g=d[i]*f;ku(s<0?0:Du(r,g,s),p,h);let _=u.d[i]+Au,v=u.d[i]-Au,y=e.py[i]+ju,b=t*6,x=t*8;a[b]=e.px[i]+e.nx[i]*_,a[b+1]=y,a[b+2]=e.pz[i]+e.nz[i]*_,a[b+3]=e.px[i]+e.nx[i]*v,a[b+4]=y,a[b+5]=e.pz[i]+e.nz[i]*v;let S=Math.min(1,Math.max(0,(s+8)/6))*Math.min(1,Math.max(0,(140-s)/30));o[x]=o[x+4]=h[0],o[x+1]=o[x+5]=h[1],o[x+2]=o[x+6]=h[2],o[x+3]=o[x+7]=.9*S}return s}var Pu=[0,0,0];function Fu(e,t){return e===`hard`?!1:t==null||!!t}var Iu=[[0,0,0,9,15],[130,0,0,9,15],[260,0,0,9,15],[330,0,8,8.5,15],[385,1,50,8,15],[400,3,115,8,15],[397,8,170,7.5,15],[404,15,225,7.5,15],[394,22,280,7.5,15],[403,28,335,7.5,15],[396,32,385,7.5,15],[386,33,448,8,15],[326,33,474,8,15],[240,32,434,7,14],[190,26,407,7,14],[150,17,430,7,14],[105,9,405,7,14],[62,3,396,7.5,14],[20,1,376,7.5,12],[-25,0,345,6,1.3],[-45,0,300,6,1.3],[-95,0,285,6,1.3],[-110,0,240,6,1.3],[-165,0,225,6,1.3],[-180,0,180,6,1.3],[-235,0,165,6.5,2],[-290,0,120,8,15],[-340,0,70,9,15],[-310,0,12,9,15],[-250,0,0,9,15],[-130,0,0,9,15]],Lu={id:`citadel`,name:`Citadel Circuit`,blurb:`Stone walls, a blind plunge and the tight squeeze.`,theme:`circuitDay`,seed:7,points:Iu,sections:[{name:`Ironside Straight`,a:28.6,b:Iu.length+2.4,kind:`straight`},{name:`Anvil Bend`,a:2.4,b:5.4},{name:`Thunder Climb`,a:5.4,b:10.6},{name:`Crown Hairpin`,a:10.6,b:12.8},{name:`The Plunge`,a:12.8,b:18.6},{name:`Citadel Squeeze`,a:18.6,b:25.6},{name:`Moat Sweep`,a:25.6,b:28.6}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},Ru=2.5,zu=[0,0,.5],Bu=class{constructor(e=Lu){let a=e.points,o=a.length,s=e.sections;this.def=e,this.id=e.id,this.name=e.name,this.themeId=e.theme,this.seed=e.seed??1;let c=this.pit={boxStart:-60,boxStep:16,...e.pit,limit:e.pit.speed},l=new Oa(a.map(e=>new W(e[0],e[1],e[2])),!0,`centripetal`),u=[];for(let e=0;e<o*80;e++){let t=e/(o*80),n=l.getPoint(t);u.push({x:n.x,y:n.y,z:n.z,f:t*o})}let d=[0];for(let e=1;e<=u.length;e++){let t=u[e-1],n=u[e%u.length];d.push(d[e-1]+Math.hypot(n.x-t.x,n.z-t.z))}let f=d[u.length],p=Math.max(16,Math.round(f/Ru/16)*16);this.n=p,this.length=f,this.ds=f/p;let m=this.px=new Float32Array(p),h=this.py=new Float32Array(p),g=this.pz=new Float32Array(p),_=new Float32Array(p),v=0;for(let e=0;e<p;e++){let n=e*this.ds;for(;d[v+1]<n;)v++;let r=(n-d[v])/(d[v+1]-d[v]),i=u[v],a=u[(v+1)%u.length];m[e]=t(i.x,a.x,r),h[e]=t(i.y,a.y,r),g[e]=t(i.z,a.z,r);let s=a.f;s<i.f&&(s+=o),_[e]=t(i.f,s,r)%o}let y=this.tx=new Float32Array(p),b=this.tz=new Float32Array(p),x=this.nx=new Float32Array(p),S=this.nz=new Float32Array(p),C=this.theta=new Float32Array(p);for(let e=0;e<p;e++){let t=(e+p-1)%p,n=(e+1)%p,r=m[n]-m[t],i=g[n]-g[t],a=Math.hypot(r,i);r/=a,i/=a,y[e]=r,b[e]=i,x[e]=i,S[e]=-r,C[e]=Math.atan2(r,i)}let w=new Float32Array(p);for(let e=0;e<p;e++)w[e]=r(C[(e+1)%p]-C[(e+p-1)%p])/(2*this.ds);this.kappa=w,this.kappaS=this._smooth(w,10),this.kappaN=this._smooth(w,3),this.half=new Float32Array(p),this.runoff=new Float32Array(p),this.section=new Uint8Array(p),this.squeeze=new Uint8Array(p);for(let e=0;e<p;e++){let r=_[e],i=Math.floor(r)%o,c=(i+1)%o,l=n(0,1,r-Math.floor(r));this.half[e]=t(a[i][3],a[c][3],l),this.runoff[e]=t(a[i][4],a[c][4],l),this.squeeze[e]=+(this.runoff[e]<5);let u=0;for(let e=0;e<s.length;e++){let t=s[e],n=t.b>o&&r<t.a?r+o:r;if(n>=t.a&&n<t.b){u=e;break}}this.section[e]=u}this.sections=s.map(e=>e.name),this.leftWall=new Float32Array(p),this.rightWall=new Float32Array(p),this.pitTaper=new Float32Array(p),this._computeRunoff();for(let e=0;e<p;e++){let r=i(e*this.ds,this.length),a=n(c.entry,c.laneStart,r)*(1-n(c.laneEnd,c.exit,r));this.pitTaper[e]=a,this.rightWall[e]=this.half[e]+this.runR[e],this.leftWall[e]=t(this.half[e]+this.runL[e],this.half[e]+19,a)}this.kerb=new Uint8Array(p),this.gravel=new Uint8Array(p);for(let e=0;e<p;e++){let t=!this.squeeze[e];this.kerb[e]=t&&Math.abs(this.kappaS[e])>.0035?1:0,this.gravel[e]=this.kerb[e]}this._computeLine(),this._loc={i:0,s:0,d:0}}_computeRunoff(){let t=this.n,n=2.2,r=.8,i=this._smooth(this.kappa,2),a=new Float32Array(t).fill(1e4),o=new Float32Array(t).fill(1e4);for(let e=0;e<t;e++)i[e]>1e-4?a[e]=1/i[e]:i[e]<-1e-4&&(o[e]=-1/i[e]);let s=e=>{let n=new Float32Array(t);for(let r=0;r<t;r++){let i=1e4;for(let n=-9;n<=9;n++)i=Math.min(i,e[(r+n+t)%t]);n[r]=i}return n},c=s(a),l=s(o),u=new Float32Array(t),d=new Float32Array(t);for(let i=0;i<t;i++)u[i]=e(Math.min(this.runoff[i],c[i]-n-this.half[i]),r,this.runoff[i]),d[i]=e(Math.min(this.runoff[i],l[i]-n-this.half[i]),r,this.runoff[i]);this.runL=this._smooth(u,5),this.runR=this._smooth(d,5);for(let e=0;e<t;e++)this.runL[e]=Math.min(this.runL[e],this.runoff[e]),this.runR[e]=Math.min(this.runR[e],this.runoff[e])}runAt(e,t){return t>=0?this.runL[e]:this.runR[e]}_smooth(e,t){let n=this.n,r=new Float32Array(n);for(let i=0;i<n;i++){let a=0;for(let r=-t;r<=t;r++)a+=e[(i+r+n)%n];r[i]=a/(2*t+1)}return r}_computeLine(){let e=gu(this);this.line=e.d,this.lineK=e.kappa}sectionName(e){return this.sections[this.section[e]]}locate(e,t,n,r=this._loc,i=40){let a=this.n,o=this.px,s=this.pz,c=0xde0b6b3a7640000,l=n,u=i<0?0:-i,d=i<0?a-1:i;for(let r=u;r<=d;r++){let i=(n+r+a)%a,u=e-o[i],d=t-s[i],f=u*u+d*d;f<c&&(c=f,l=i)}let f=e-o[l],p=t-s[l];return r.i=l,r.s=((l*this.ds+f*this.tx[l]+p*this.tz[l])%this.length+this.length)%this.length,r.d=f*this.nx[l]+p*this.nz[l],r}locateGlobal(e,t,n=this._loc){return this.locate(e,t,0,n,-1)}_idx(e){e=(e%this.length+this.length)%this.length;let t=e/this.ds,n=Math.floor(t)%this.n;return zu[0]=n,zu[1]=(n+1)%this.n,zu[2]=t-Math.floor(t),zu}_lerpAt(e,n){let r=this._idx(n);return t(e[r[0]],e[r[1]],r[2])}yAt(e){return this._lerpAt(this.py,e)}bankAt(e){return 0}slopeAt(e){return(this.yAt(e+3)-this.yAt(e-3))/6}halfAt(e){return this._lerpAt(this.half,e)}thetaAt(e){let t=this._idx(e),n=t[0],i=t[1],a=t[2];return this.theta[n]+r(this.theta[i]-this.theta[n])*a}lineAt(e){return this._lerpAt(this.line,e)}lineKappaAt(e){return this._lerpAt(this.lineK,e)}kappaAt(e){return this._lerpAt(this.kappa,e)}at(e,n=0,r=new W){let i=this._idx(e),a=i[0],o=i[1],s=i[2],c=t(this.nx[a],this.nx[o],s),l=t(this.nz[a],this.nz[o],s),u=Math.hypot(c,l)||1;return r.set(t(this.px[a],this.px[o],s)+c/u*n,t(this.py[a],this.py[o],s),t(this.pz[a],this.pz[o],s)+l/u*n),r}surfaceAt(e,t){let n=Math.abs(t),r=this.half[e],i=this.pitTaper[e];return t>0&&i>.02&&n<=r+16*i?n<=r?`asphalt`:`pit`:n<=r||this.squeeze[e]&&n<=r+this.runAt(e,t)+.05?`asphalt`:this.kerb[e]&&n<=r+1.4?`kerb`:this.gravel[e]&&n<=r+this.runAt(e,t)+.5?`gravel`:`grass`}clearance(e,t){let n=this.n,r=1e9;for(let i=0;i<n;i++){let n=e-this.px[i],a=t-this.pz[i],o=n*this.nx[i]+a*this.nz[i]>=0?this.leftWall[i]:this.rightWall[i],s=Math.hypot(n,a)-o;s<r&&(r=s)}return r}laneD(e){return this.half[e]+4.5}boxD(e){return this.half[e]+11.5}boxU(e){return this.pit.boxStart+e*this.pit.boxStep}},Vu=[[0,8,0,9.5,16],[130,8,0,9.5,16],[260,8,0,9.5,16],[340,10,18,8.5,14],[400,14,72,8,14],[428,20,142,8,14],[400,28,210,7.5,13],[330,36,258,7.5,13],[255,42,236,7.5,12],[195,48,286,7.5,12],[155,52,345,8,12],[112,54,398,8.5,13],[52,54,374,8.5,13],[74,52,314,8,13],[132,46,272,8,14],[88,40,220,8,14],[18,32,188,7.5,13],[-52,24,168,7.5,13],[-122,16,142,8,14],[-192,12,112,8.5,14],[-252,9,86,9,15],[-318,8,60,9,15],[-348,8,28,9,15],[-300,8,10,9.5,16],[-250,8,0,9.5,16],[-130,8,0,9.5,16]],Hu={id:`highpine`,name:`Highpine Ring`,blurb:`Snowbanks, pines and a climb to the summit hairpin.`,theme:`alpine`,seed:17,points:Vu,sections:[{name:`Fir Straight`,a:23.3,b:Vu.length+2.4,kind:`straight`},{name:`Larch Bend`,a:2.4,b:5.6},{name:`Switchback Climb`,a:5.6,b:10.6},{name:`Summit Hairpin`,a:10.6,b:13.5},{name:`Ridge Run`,a:13.5,b:15.5},{name:`Avalanche Drop`,a:15.5,b:20.6},{name:`Lodge Sweep`,a:20.6,b:23.3}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},Uu=[[0,2,0,9.5,16],[130,2,0,9.5,16],[260,2,0,9.5,16],[340,3,24,8.5,15],[412,5,88,8,14],[448,8,158,8,14],[452,11,232,8,14],[410,14,302,8,14],[340,16,350,8,14],[265,17,378,8,14],[190,16,400,8.5,13],[125,15,388,8.5,13],[108,14,348,8,13],[150,12,310,8,13],[215,10,268,8,14],[255,8,208,8,14],[188,6,162,8,14],[98,4,152,8.5,15],[8,3,158,8.5,15],[-92,2.5,142,9,15],[-182,2,112,9,15],[-255,2,76,9,15],[-325,2,38,9,15],[-292,2,10,9.5,16],[-250,2,0,9.5,16],[-130,2,0,9.5,16]],Wu={id:`dripwood`,name:`Dripwood Vale`,blurb:`Wet forest: rain, puddles and a climb under the canopy.`,theme:`forest`,seed:23,points:Uu,sections:[{name:`Moss Straight`,a:23.2,b:Uu.length+2.4,kind:`straight`},{name:`Fern Bend`,a:2.4,b:5.6},{name:`Canopy Climb`,a:5.6,b:9.5},{name:`Root Hairpin`,a:9.5,b:13.4},{name:`Puddle Esses`,a:13.4,b:16.5},{name:`Creek Run`,a:16.5,b:20.5,kind:`straight`},{name:`Owl Sweep`,a:20.5,b:23.2}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},Gu=[[0,0,0,9.5,16],[130,0,0,9.5,16],[260,0,0,9.5,16],[345,0,12,8.5,15],[398,.5,50,8.5,15],[415,2,115,8,15],[410,7,190,8,15],[440,14,255,7.5,15],[432,22,325,7.5,15],[395,28,385,7.5,15],[330,31,425,8,15],[250,31,418,8,15],[170,30,430,8,15],[112,29,420,8,14],[95,28,380,8,14],[135,26,345,8,14],[200,21,340,7.5,14],[265,15,315,7.5,14],[300,11,270,7.5,14],[265,7,225,7.5,14],[275,4,175,7.5,14],[240,2,125,8,15],[170,1,100,8.5,15],[60,0,108,9,15],[-60,0,112,9,15],[-170,0,112,9,15],[-255,0,112,8.5,15],[-330,0,72,8.5,15],[-300,0,14,9,15],[-250,0,0,9.5,16],[-130,0,0,9.5,16]],Ku={id:`desert`,name:`Sandglass Circuit`,blurb:`Night race across the dunes: a mesa climb and three hairpins.`,theme:`desertNight`,seed:31,points:Gu,sections:[{name:`Sidewinder Straight`,a:28.9,b:Gu.length+2.6,kind:`straight`},{name:`Cairn Turn`,a:2.6,b:5.2},{name:`Dune Rise`,a:5.2,b:9.4},{name:`Kiln Run`,a:9.4,b:12.6},{name:`Mesa Hairpin`,a:12.6,b:15.4},{name:`Scorpion Esses`,a:15.4,b:20.6},{name:`Oasis Sweep`,a:20.6,b:23},{name:`Mirage Run`,a:23,b:25.6,kind:`straight`},{name:`Sandglass Hairpin`,a:25.6,b:28.9}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},qu=[[0,0,0,9,16],[130,0,0,9,16],[250,0,0,9,16],[322,1,16,8,6.6],[368,2.5,68,7.5,6.2],[378,4,128,7.5,6.2],[338,6,182,7.2,6.2],[276,8,214,7.2,6.2],[214,9,176,7.2,6.2],[168,8,222,7.2,6.2],[112,7,258,7.6,6.5],[48,6,228,7.6,6.5],[78,5,168,7.5,6.3],[22,3,142,7.6,6.3],[-58,2,158,8,6.3],[-148,1,136,8,6.3],[-220,.4,86,8,6.5],[-268,0,28,8.5,8],[-246,0,8,9,14],[-170,0,0,9,16],[-80,0,0,9,16]],Ju={id:`lampwick`,name:`Lampwick Mile`,blurb:`Night streets: neon, a city hill and walls close to the track.`,theme:`neonStreet`,seed:41,points:qu,sections:[{name:`Lamp Straight`,a:18.2,b:qu.length+2.4,kind:`straight`},{name:`Marquee Bend`,a:2.4,b:5.5},{name:`Arcade Esses`,a:5.5,b:9.5},{name:`Hotel Hairpin`,a:9.5,b:12.6},{name:`Quay Run`,a:12.6,b:17.3},{name:`Clock Corner`,a:17.3,b:18.2}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}},Yu=[[0,2,0,9.5,16],[130,2,0,9.5,16],[260,2,0,9.5,16],[335,2,6,8.5,15],[392,3,38,8.5,15],[425,5,92,8,15],[438,11,143,8,15],[429,19,194,8,15],[442,28,244,8,15],[438,36,294,8,15],[395,40,338,8,14],[320,41,356,8,14],[245,41,352,8,14],[200,41,355,8.5,13],[148,41,386,8.5,13],[178,40,428,8.5,13],[245,38,434,8,13],[305,34,453,7.5,13],[350,28,496,7.5,13],[300,22,536,7.5,13],[225,17,532,7.5,13],[150,11,518,7,8],[95,7,545,7,8],[38,5,516,7.5,12],[-60,3,519,8.5,15],[-150,2,525,8.5,15],[-250,2,525,8.5,15],[-330,4,489,8.5,15],[-345,8,431,8,15],[-326,11,374,8,15],[-342,9,316,8,15],[-331,6,258,8,15],[-343,4,201,8,15],[-330,3,136,8.5,15],[-310,2,70,9,15],[-285,2,15,9.5,16],[-250,2,0,9.5,16],[-130,2,0,9.5,16]],Xu=[Lu,Hu,Wu,Ku,Ju,{id:`coastal`,name:`Saltspray Coast`,blurb:`Sea-cliff circuit in daylight: beach straight, a 40 m climb and harbour esses.`,theme:`coastal`,seed:53,points:Yu,sections:[{name:`Breaker Straight`,a:34.2,b:Yu.length+2.6,kind:`straight`},{name:`Gull Bend`,a:2.6,b:5.8},{name:`Cliffhanger Climb`,a:5.8,b:9.8},{name:`Lantern Run`,a:9.8,b:13},{name:`Lantern Hairpin`,a:13,b:16.6},{name:`Tidewall Esses`,a:16.6,b:20.4},{name:`Kelp Chicane`,a:20.4,b:23.6},{name:`Harbour Run`,a:23.6,b:26.4,kind:`straight`},{name:`Reef Curve`,a:26.4,b:33.2},{name:`Breaker Corner`,a:33.2,b:34.2}],pit:{entry:-215,laneStart:-175,laneEnd:140,exit:190,speed:22}}],Zu=Xu.map(e=>e.id),Qu=Lu.id;function $u(e){return Xu.find(t=>t.id===e)||Lu}function ed(e,t=!0){if(!isFinite(e)||e==null)return`--:--.---`;let n=Math.floor(e/60);return`${n}:${(e-n*60).toFixed(t?3:1).padStart(t?6:4,`0`)}`}function td(e){return e==null||!isFinite(e)?``:(e<=0?`-`:`+`)+Math.abs(e).toFixed(3)}function nd(e,t=3,n={}){return{L:e,n:t,seg:e/t,g:-1,prevProg:null,prevTime:0,lapStart:0,sectorStart:0,lapNo:0,cur:[],last:null,bestLap:n.bestLap??1/0,bestSectors:n.bestSectors?n.bestSectors.slice():Array(t).fill(1/0),refSectors:n.refSectors?n.refSectors.slice():[],laps:[]}}function rd(e,t,n){let r=e.bestSectors[t],i=e.refSectors[t];return n>=r?i!==void 0&&n<i?`green`:`slow`:`purple`}function id(e,t,n){let r=[];if(e.prevProg===null)return e.prevProg=t,e.prevTime=n,e.g=Math.floor(t/e.seg),r;let i=Math.floor(t/e.seg);for(;e.g<i;){let i=++e.g,a=i*e.seg,o=t-e.prevProg,s=o>1e-9?(a-e.prevProg)/o:1,c=e.prevTime+Math.min(1,Math.max(0,s))*(n-e.prevTime);if(i===0){e.lapStart=e.sectorStart=c,e.cur=[],e.lapNo=0,r.push({type:`start`,time:c});continue}if(i<0)continue;let l=(i-1)%e.n,u=c-e.sectorStart;e.sectorStart=c;let d=e.refSectors[l],f=rd(e,l,u);if(u<e.bestSectors[l]&&(e.bestSectors[l]=u),e.cur.push(u),r.push({type:`sector`,sector:l,time:u,delta:d===void 0?null:u-d,status:f,lap:Math.floor((i-1)/e.n)}),i%e.n===0){let t=c-e.lapStart,n=e.cur.slice(),i=t<e.bestLap,a=isFinite(e.bestLap)?t-e.bestLap:null;i&&(e.bestLap=t,e.refSectors=n.slice()),e.last={time:t,sectors:n,delta:a,isBest:i},e.laps.push(t),e.lapStart=c,e.cur=[],e.lapNo++,r.push({type:`lap`,lap:e.lapNo,time:t,sectors:n,delta:a,isBest:i})}}return e.prevProg=t,e.prevTime=n,r}function ad(e,t){return e.g>=0?Math.max(0,t-e.lapStart):0}function od(e){return e.g>=0?e.g%e.n:0}function sd(e=10){return{hz:e,dt:1/e,next:0,samples:[]}}function cd(e,t,n,r,i){for(;t>=e.next;)e.samples.push([Math.round(n*10)/10,Math.round(r*10)/10,Math.round(i*100)/100]),e.next+=e.dt}function ld(e){e.next=0,e.samples=[]}function ud(e,t){return{hz:e.hz,time:t,samples:e.samples.slice()}}function dd(e,t,n={}){if(!e||t<0)return null;let r=t*e.hz,i=Math.floor(r);if(i>=e.samples.length-1)return null;let a=e.samples[i],o=e.samples[i+1],s=r-i;n.x=a[0]+(o[0]-a[0])*s,n.z=a[1]+(o[1]-a[1])*s;let c=o[2]-a[2];for(;c>Math.PI;)c-=2*Math.PI;for(;c<-Math.PI;)c+=2*Math.PI;return n.theta=a[2]+c*s,n}var fd=`drive-save-v1`,pd=`drive-ghost-v1`,md={easy:{id:`easy`,name:`Easy`,skill:.89,spread:.04,mistakes:1.6,aggression:.35,goalPos:3,assist:1,guide:!0},normal:{id:`normal`,name:`Normal`,skill:.955,spread:.035,mistakes:1,aggression:.65,goalPos:3,assist:0,guide:!0},hard:{id:`hard`,name:`Hard`,skill:.99,spread:.025,mistakes:.5,aggression:1,goalPos:2,assist:0,guide:!1}},hd={speedway:{name:`Speedway`,requires:`gp`,podium:3}};function gd(){return{v:1,unlocked:{gp:!0},bests:{},trackBests:{},podiums:0,races:0}}function _d(e){let t=gd();try{let n=e?.getItem(fd);if(!n)return t;let r=JSON.parse(n);return!r||typeof r!=`object`?t:{...t,...r,unlocked:{...t.unlocked,...r.unlocked||{}},bests:{...r.bests||{}},trackBests:{...r.trackBests||{}}}}catch{return t}}function vd(e,t){try{return e?.setItem(fd,JSON.stringify(t)),!0}catch{return!1}}function yd(e,t){return!hd[t]||!!e.unlocked[t]}function bd(e){let t=hd[e];return t?`${t.name.toUpperCase()} LOCKED - finish on the podium (top ${t.podium}) in a ${t.requires.toUpperCase()} race to unlock`:``}var xd=(e,t)=>e.bests[t]||null;function Sd(e,t,n){let r=e.bests[t]||{bestLap:1/0,bestSectors:[],refSectors:[]},i=!1;return n.time<r.bestLap&&(r.bestLap=n.time,r.refSectors=n.sectors.slice(),i=!0),n.sectors.forEach((e,t)=>{let n=r.bestSectors[t];(n==null||e<n)&&(r.bestSectors[t]=e)}),e.bests[t]=r,i}var Cd=(e,t)=>e+`:`+t;function wd(e,t,n){let r=e?.trackBests?.[Cd(t,n)];return!r||typeof r.bestLap!=`number`||!isFinite(r.bestLap)?null:r}function Td(e,t,n,r){let i=r?.time;if(!t||!n||typeof i!=`number`||!isFinite(i))return!1;e.trackBests&&typeof e.trackBests==`object`||(e.trackBests={});let a=Cd(t,n),o=e.trackBests[a]||{bestLap:1/0};return i<o.bestLap?(o.bestLap=i,e.trackBests[a]=o,!0):(e.trackBests[a]=o,!1)}function Ed(e,t){let n=xd(e,t);return!n||!isFinite(n.bestLap??NaN)?{}:{bestLap:n.bestLap,bestSectors:n.bestSectors.map(e=>e??1/0),refSectors:n.refSectors}}function Dd({mode:e,difficulty:t=`normal`,cls:n=`gp`},r){if(e===`tt`){let e=xd(r,n);return e&&isFinite(e.bestLap??NaN)?{kind:`lap`,target:e.bestLap,text:`Beat your best lap: ${ed(e.bestLap)}`}:{kind:`lap`,target:1/0,text:`Set a lap time, then beat it`}}let i=(md[t]||md.normal).goalPos;return{kind:`pos`,target:i,text:i===1?`Win the race`:`Finish top ${i}`}}function Od(e,t){if(e.kind===`pos`){let n=t.pos!=null&&t.pos<=e.target;return{met:n,text:n?`GOAL MET - P${t.pos}`:`GOAL MISSED - P${t.pos} (needed top ${e.target})`}}let n=t.bestLap;if(!isFinite(n??NaN))return{met:!1,text:`GOAL MISSED - no lap completed`};let r=n<e.target;return{met:r,text:r?`GOAL MET - ${ed(n)}`:`GOAL MISSED - ${ed(n)} vs ${ed(e.target)}`}}function kd(e,{mode:t,cls:n,pos:r}){let i={unlocked:[],messages:[]};if(t!==`race`)return i;e.races=(e.races||0)+1;for(let[t,a]of Object.entries(hd))e.unlocked[t]||n===a.requires&&r!=null&&r<=a.podium&&(e.unlocked[t]=!0,i.unlocked.push(t),i.messages.push(`${a.name.toUpperCase()} CLASS UNLOCKED!`));if(n===`gp`&&r!=null&&r<=3&&(e.podiums=(e.podiums||0)+1),!i.unlocked.length)for(let[t,n]of Object.entries(hd))e.unlocked[t]||i.messages.push(bd(t));return i}function Ad(e,t){return!e||!t||!hd[t]&&t!==`gp`||e.unlocked?.[t]?!1:(e.unlocked&&typeof e.unlocked==`object`||(e.unlocked={gp:!0}),e.unlocked[t]=!0,!0)}var jd=[{name:`Ember Works`,tag:`EMB`,c1:15222570,c2:16765514},{name:`Tidewater Speed`,tag:`TDW`,c1:1937361,c2:16777215},{name:`Quartz Engineering`,tag:`QRZ`,c1:11036912,c2:2763328},{name:`Halcyon Motorsport`,tag:`HLC`,c1:15909424,c2:2236962},{name:`Nimbus Racing`,tag:`NMB`,c1:15263984,c2:3368652},{name:`Copperhead Works`,tag:`CPR`,c1:13201966,c2:1776411},{name:`Zephyr Dynamics`,tag:`ZPH`,c1:3720330,c2:15790320},{name:`Obsidian Racing`,tag:`OBS`,c1:2763318,c2:15747724},{name:`Lumen Speed Co.`,tag:`LMN`,c1:15755936,c2:16773792},{name:`Verdant Works`,tag:`VRD`,c1:3050301,c2:12576842}];function Md(e,t){return Su(e,t).v}function Nd(e,t,n){return e._lerpAt(t,n)}function Pd(e,t,n,i,a,o){let s=t.s+a;e.at(s,i,o);let c=o.x-t.x,l=o.z-t.z,u=r(Math.atan2(c,l)-t.theta),d=2*Math.sin(u)/Math.max(Math.hypot(c,l),1),f=Math.max(Math.abs(C(n,1,Math.max(t.v,3),t.grip||1)),1e-4);return-d/f}function Fd(t,n,r,i,a,o){return e(Pd(t,n,r,i,a,o),-1,1)}function Id(t,n,r,i,a){let o=t.cls,s=v(o,Math.max(t.v,10),Math.min(1,t.grip||1)),c=Nd(n,r,t.s+t.v*.25),l=Nd(n,r,t.s+t.v*.25+15),u=Math.max(0,(c*c-l*l)/30)*t.skill,d=Math.max(0,t.v-i);return e(Math.max(a*.6,u/s*1.1+d/9),.2,.9)}function Ld(t,n,r){let i=n-t.v;i>.5?(r.throttle=e(i/3,.35,1),r.brake=0):i<-1.5?(r.throttle=0,r.brake=e(-i/8,.25,1)):(r.throttle=e(.35+i*.2,0,.5),r.brake=0)}var Rd=e=>e>=0?1:-1;function zd(e,t,n){let r=t.track.length;n.ahead=null,n.behind=null,n.aGap=99,n.bGap=99;let a=t.cars;for(let t=0;t<a.length;t++){let o=a[t];if(o===e||o.pit.stage)continue;let s=i(o.s-e.s,r);s>0&&s<n.aGap&&s<40?(n.aGap=s,n.ahead=o):s<=0&&-s<n.bGap&&-s<28&&(n.bGap=-s,n.behind=o)}return n}var Bd={ahead:null,behind:null,aGap:99,bGap:99};function Vd(t,n,r,i){let a=n.track,o=t.cls,s=t.input,c=n.diff,l=t.ai,u=n.profiles[o.id];t.noiseT+=r,l.t-=r,l.defendT-=r;let d=Math.sin(t.noiseT*.35+t.noisePhase)*1.2+Math.sin(t.noiseT*.9+t.noisePhase*2)*.5,f=Math.max(Math.abs(a.lineKappaAt(t.s+4)),Math.abs(a.lineKappaAt(t.s+4+t.v*.35))),p=e(4.5+.3*t.v-1500*Math.max(0,f-.004),4.5,32),m=a.halfAt(t.s+p),h=Math.abs(a.kappaS[a._idx(t.s+p*2.5)[0]]),g=h<.003,_=!a.squeeze[t.idx],v=_?1:.25,y=1-e((f-.002)/.006,0,.7),b=a.lineAt(t.s+p),x=b+(t.lineBias+d*t.wander)*v*y;zd(t,n,Bd);let{ahead:S,behind:C}=Bd,w=!1,T=!1;if(S&&!S.finished&&Bd.aGap<28&&Math.abs(S.d-t.d)<4.5&&t.progress>0){if(l.t<=0&&l.mode!==`pass`){l.t=.8;let e=m-2;l.side=e-S.d>e+S.d?1:-1,Math.abs(S.d-t.d)>1.2&&(l.side=Rd(t.d-S.d)),l.fight=n.rng()<.25+.75*c.aggression}l.fight&&(w=!0,Bd.aGap>12||!_?g&&(x=S.d):(T=!0,l.mode=`pass`,l.passT=1.6,x=S.d+l.side*3.4))}l.mode===`pass`&&!T&&(l.passT-=r,l.passT>0&&S&&Bd.aGap<18?(T=!0,x=S.d+l.side*3.4):l.mode=`free`),C&&!C.finished&&Bd.bGap<14&&Math.abs(C.d-t.d)<5&&g&&!T?(l.defendT<-4&&n.rng()<.02+.06*c.aggression&&(l.defendT=1.3),l.defendT>0&&(x=t.d+e(C.d-t.d,-3,3),l.defending=!0)):l.defending=!1;let E=0;!T&&!l.defending&&S&&Bd.aGap<22&&Math.abs(S.d-t.d)<2.8&&!(w&&g)&&(E=(S.d>=t.d?-1:1)*(_?3:1.2)*(1-Bd.aGap/24),Math.abs(S.d-t.d)<.3&&(E=(a.lineAt(t.s)>0?-1:1)*(_?3:1.4))),t.avoid+=(E-t.avoid)*Math.min(1,r*2.5),x+=t.avoid,l.mistakeIn-=r/Math.max(.3,c.mistakes);let D=Nd(a,u,t.s+70);if(l.mistake)l.mistake.t-=r,l.mistake.t<=0&&(l.mistake=null,l.mistakeIn=25+n.rng()*45);else if(l.mistakeIn<=0&&_&&t.progress>100&&!t.finished&&D<t.v-12&&!t.pit.stage){let e=n.rng();l.mistake=e<.5?{type:`late`,t:1.2}:e<.8?{type:`wide`,t:2.2}:{type:`lock`,t:.9},l.mistake.out=-Rd(a.kappaS[a._idx(t.s+40)[0]])}let O=Math.min(Nd(a,u,t.s+35),Nd(a,u,t.s+80))*t.skill,k=Math.max(e((t.v-O-3)/14,0,1),e((f-.003)/.004,0,1));x=b+(x-b)*(1-.85*k),l.mistake?.type===`wide`&&(x+=l.mistake.out*2);let A=Math.max(m-(_?2:2.4)-.012*t.v,1.2);x=e(x,-A,A);let j=Pd(a,t,o,x,p,i);s.steer=e(j,-1,1);let M=e((Math.abs(j)-.85)/.6,0,1),N=Math.min(1,Math.sqrt(Math.max(.25,t.grip||1))),ee=t.skill,P=Nd(a,u,t.s+t.v*.25)*ee*N;P*=1-.12*M,P*=1-.4*e((Math.abs(t.d-a.lineAt(t.s))-1.5)/6,0,1)*e((f-.002)/.004,0,1),(t.surface===`grass`||t.surface===`gravel`)&&(P=Math.min(P,28)),T&&Bd.aGap<14&&(P*=1.04),l.mistake?.type===`late`&&(P*=1.1),S&&!T&&Bd.aGap<14&&Math.abs(S.d-t.d)<2.4&&(P=Math.min(P,Math.max(S.v+e((Bd.aGap-6)*.8,-1.5,8),P*.6)));let F=n.order?.[0],te=n.order?.[1];F&&t.progress>0&&!t.finished&&(t===F?te&&(P*=1-.02*e((t.progress-te.progress-60)/150,0,1)):P*=1+.04*e((F.progress-t.progress-40)/180,0,1)),S&&Bd.aGap<25&&g&&!T&&(P*=1+.012*(1-Bd.aGap/25)*(.5+.5*c.aggression)),t.finished&&(P=Math.min(P,38)),Ld(t,P,s),s.brake>0&&(s.brake=Id(t,a,u,P,s.brake)),l.forceLock=l.mistake?.type===`lock`&&t.v>35&&s.brake>0,l.forceLock&&(s.brake=1);let I=S&&Bd.aGap<25&&g;s.boost=t.boost>(I?.15:.55)&&h<.0025&&t.v>40&&!t.finished}var Hd=new W,Ud=9.81,Wd={k:0,excess:0},Gd={tire:`dry`,wear:0,wetness:0,surface:`asphalt`},Kd={fill:0,boosting:!1,dt:0};function qd(e,t){if(t.pit.stage)return!1;let n=e,r=i(t.s,n.length),a=n.pit;return r>a.entry-40&&r<a.laneStart+20?t.pit.request?!0:!t.isPlayer||!(t.progress>0)?!1:Jd(n,t,r):!1}function Jd(e,t,n=i(t.s,e.length)){let a=e.pit;if(n<a.entry||n>a.laneStart+8)return!1;let o=t.idx,s=e.laneD(o);return!(t.d<s-.8||e.surfaceAt(o,t.d)!==`pit`||Math.abs(r(t.theta-e.thetaAt(t.s)))>.6)}var Yd=class{constructor(t,n={}){if(this.track=t,this.opts=n,this.rng=typeof n.rng==`function`?n.rng:Math.random,this.cls=a[n.cls]||a.gp,this.mode=n.mode===`tt`?`tt`:`race`,this.solo=this.mode===`tt`,this.diff=md[n.difficulty]||md.normal,this.laps=this.solo?1/0:e(n.laps||3,1,9),this.phase=`countdown`,this.timer=this.solo?1.6:0,this.time=0,this.goHold=this.solo?0:.2+this.rng()*1,this.lights=0,this.goFlash=0,this.rain=0,this.rainTarget=0,this.wetness=0,this.rainAt=n.weather===`rain`?.5:n.weather===`dry`||this.solo?1/0:n.rainAt??(this.rng()<.8?this.laps*42*(.3+this.rng()*.3):1/0),this.rainAnnounced=!1,this.events=[],this.profiles={[this.cls.id]:Md(t,this.cls)},this.cars=[],this.playerSlot=n.playerSlot??(this.solo?0:6),Array.isArray(n.grid)){let e=n.grid.findIndex(e=>e.isPlayer);e>=0&&(this.playerSlot=e)}this._createCars(),this.player=this.cars.find(e=>e.isPlayer),this.autopilot=!1,this.lapTimer=nd(t.length,3,n.best||{}),this.ghostRec=sd(10),this.order=this.cars.slice(),this.rank()}_blankCar(e,t,n,r,i,a={}){let s=this.track,c=s.length,l=this.rng,u=Math.floor(e/2),d=e%2,f=c-10-u*9-d*4.5,p=d?-3.2:3.2,m=s.at(f,p),h=s.thetaAt(f),g={id:e,slot:e,team:t,teamIndex:n,isPlayer:r,cls:a.cls||this.cls,driver:a.driver||null,driverId:a.driverId||null,x:m.x,z:m.z,y:m.y,theta:h,v:0,steer:0,s:f,d:0,idx:s.locateGlobal(m.x,m.z).i,lap:o(c,f),progress:-10,laps:0,finished:!1,finishTime:0,tire:`dry`,wear:0,wetness:0,grip:1,surface:`asphalt`,boost:0,boosting:!1,slip:0,input:{steer:0,throttle:0,brake:0,boost:!1},skill:i,lineBias:(l()-.5)*3.2,wander:.4+l()*.8,noiseT:l()*50,noisePhase:l()*6.28,avoid:0,lapStart:0,lapTimes:[],bestLap:1/0,hit:0,pitStops:0,brk:0,lockup:0,flat:0,wheelSlip:0,wheelspin:0,longAcc:0,latAcc:0,signedLatAcc:0,yawRate:0,slipAngle:0,prevSlipAngle:0,slideRate:0,latFrac:0,ai:{forceLock:!1,mode:`free`,side:0,t:0,mistake:null,mistakeIn:8+l()*30,defendT:0},pit:{stage:0,request:!1,timer:0,choice:null,d0:0},mesh:null};return g.d=s.locateGlobal(m.x,m.z).d,g.lap=o(c,f),g.progress=g.lap.progress,this.cars.push(g),g}_createCars(){if(Array.isArray(this.opts.grid)){this.opts.grid.forEach((e,t)=>{if(this.solo&&!e.isPlayer)return;let n=e.isPlayer?.985:e.skill==null?this.diff.skill:e.skill;this._blankCar(t,e.team,e.teamIndex,!!e.isPlayer,n,{cls:e.cls,driver:e.driver||null,driverId:e.id||null})});return}let e=jd.map((e,t)=>t),t=this.rng;for(let n=e.length-1;n>1;n--){let r=1+Math.floor(t()*n);[e[n],e[r]]=[e[r],e[n]]}let n=e.slice(1);n.splice(this.playerSlot,0,0);let r=this.opts.playerTeam;n.forEach((e,n)=>{if(this.solo&&n!==this.playerSlot)return;let i=n===this.playerSlot,a=this.diff.skill+(t()-.5)*2*this.diff.spread,o=e===0&&r?r:jd[e];this._blankCar(n,o,e,i,i?.985:a,{driver:i&&this.opts.driver||null,driverId:i?`player`:null})})}setRain(e){this.rainTarget=+!!e,this.rainAt=1/0,e&&(this.rain=1,this.wetness=Math.max(this.wetness,.7),this.rainAnnounced=!0)}requestPit(e=this.player,t=!0){e.pit.stage===0&&e.progress<(this.laps-.9)*this.track.length&&(e.pit.request=t)}choosePitTire(e,t=this.player){t.pit.choice=e}step(e){if(this.phase===`countdown`){this.timer+=e,this.lights=Math.min(5,Math.floor(this.timer)+1),this.timer>=4+this.goHold?(this.phase=`racing`,this.lights=0,this.goFlash=1.6,this.events.push({type:`go`})):Math.floor(this.timer)!==Math.floor(this.timer-e)&&this.timer<5&&this.events.push({type:`light`,n:this.lights}),this._interpolatePoseOnly(),this._weather(e);return}this.time+=e,this.goFlash=Math.max(0,this.goFlash-e),this._weather(e);let t=this.cars;for(let n=0;n<t.length;n++){let r=t[n];r.pit.stage?this._pitControl(r,e):(!r.isPlayer||this.autopilot||r.finished)&&(Vd(r,this,e,Hd),this._aiPitDecision(r)),this._stepCar(r,e)}this._interactions(e),this.rank(),this._timing(),this.player.finished&&this.phase!==`done`&&this.cars.every(e=>e.finished)&&(this.phase=`done`)}_interpolatePoseOnly(){}_timing(){let e=this.player,t=this.lapTimer;for(let n of id(t,e.progress,this.time)){let t={...n,type:n.type===`lap`?`laptime`:n.type===`sector`?`sector`:`startline`,car:e};n.type===`lap`?(e.lapTimes.length&&(e.lapTimes[e.lapTimes.length-1]=n.time,e.bestLap=Math.min(...e.lapTimes)),n.isBest&&(t.ghost=ud(this.ghostRec,n.time)),ld(this.ghostRec)):n.type===`start`&&ld(this.ghostRec),this.events.push(t)}t.g>=0&&cd(this.ghostRec,ad(t,this.time),e.x,e.z,e.theta)}_weather(t){this.time>=this.rainAt&&(this.rainTarget=1,this.rainAt=1/0),this.rainTarget>0&&!this.rainAnnounced&&this.rain>.05&&(this.rainAnnounced=!0,this.events.push({type:`rain`})),this.rain+=e(this.rainTarget-this.rain,-.1*t,.12*t);let n=this.rain>this.wetness;this.wetness+=e(this.rain-this.wetness,-.012*t,(n?.07:.012)*t)}_aiPitDecision(e){if(e.isPlayer||e.pit.stage||e.pit.request||e.finished||e.progress>(this.laps-1)*this.track.length||e.progress<0)return;this.rain>.4&&this.rainHighTime===void 0&&(this.rainHighTime=this.time);let t=e.id*7%10*3,n=this.rainHighTime!==void 0&&e.tire===`dry`&&this.time-this.rainHighTime>t,r=this.rain<.05&&this.wetness<.12&&e.tire===`wet`;(n||r||e.wear>.8)&&(e.pit.request=!0,e.pit.aiChoice=this.rain>.3||this.wetness>.3?`wet`:`dry`)}_pitControl(e,r){let a=this.track,o=e.pit,s=e.input;e.ai.forceLock=!1;let c=i(e.s,a.length),l=e.idx,u=a.laneD(l),d=a.boxD(l),f=a.boxU(e.teamIndex),p=f-c,m=30,h=u;if(o.stage===1){let r=n(a.pit.entry,a.pit.laneStart,c);h=t(o.d0,u,r),m=c<a.pit.laneStart?Math.sqrt(a.pit.limit**2+56*Math.max(0,a.pit.laneStart-c)):a.pit.limit,p<30&&(h=t(u,d,n(30,10,p)),m=Math.min(m,Math.sqrt(10*Math.max(0,p-.6)))),p<3&&e.v<2.5?(o.stage=2,o.timer=0,e.isPlayer||(o.choice=o.aiChoice||`dry`)):c>f+8&&e.v>4&&(o.stage=3)}else o.stage===2?(m=0,h=d,o.timer+=r,e.isPlayer&&!o.choice&&o.timer>7&&(o.choice=this.wetness>.25?`wet`:`dry`),o.choice&&(o.serv=(o.serv||0)+r,o.serv>2.4&&(e.tire=o.choice,e.wear=0,o.stage=3,o.serv=0,o.choice=null,o.request=!1,e.pitStops++,this.events.push({type:`pit`,car:e})))):o.stage===3&&(h=t(d,u,n(f,f+14,c)),h=t(h,Xd(a,e),n(a.pit.laneEnd,a.pit.exit,c)),m=c<a.pit.laneEnd?a.pit.limit:30+(c-a.pit.laneEnd)*2,c>a.pit.exit&&(o.stage=0,o.request=!1));return s.steer=Fd(a,e,e.cls,h,6+e.v*.25,Hd),Ld(e,m,s),o.stage===1&&p<30&&m<3&&(s.throttle=0,s.brake=e.v>m+.5?.8:.15),o.stage===2&&(s.throttle=0,s.brake=1),s.boost=!1,!0}_stepCar(t,n){let i=this.track,a=t.cls,o=t.input;qd(i,t)&&(t.pit.stage=1,t.pit.d0=t.d,t.pit.request=!0,t.pit.serv=0),t.surface=i.surfaceAt(t.idx,t.d),Gd.tire=t.tire,Gd.wear=t.wear,Gd.wetness=this.wetness,Gd.surface=t.surface,t.grip=d(Gd);let l=t.isPlayer&&!this.autopilot&&!t.pit.stage,u=e(t.v/a.vTop,0,1),p=o.steer;t.steer=l?fe(t.steer,p,u,n):t.steer+e(p-t.steer,-n*9,n*9),t.brk+=e(o.brake-t.brk,-10*n,(l?7:14)*n);let m=c[t.surface],h=!1;o.boost&&t.boost>.01&&(h=!0),t.boosting=h;let g=a.vTop*(h?1.07:1)*(1+.025*Math.min(1,t.slip/.3)),y=Math.max(Math.abs(t.v),2.5);t.grip*=1-.07*t.flat;let S=t.brk,w=x(a,t.steer,y,t.grip,0,Wd),T=Math.min(1,w.frac);if(t.v>.4&&S>0&&(l?this.diff.assist:!t.ai.forceLock)){let e=b(a,y,t.grip,S,T);e>.9&&(S*=.9/e)}let E=t.v>.4?b(a,y,t.grip,S,T):0,D=E>1&&t.v>22?e(.45+(E-1)*3,0,1):0;t.lockup+=e(D-t.lockup,-3*n,9*n),t.lockup<.001&&(t.lockup=0),t.flat=e(t.flat+(t.lockup*.16-.018)*n,0,1);let O=t.v>.4?v(a,y,t.grip)*S*(1-.22*t.lockup):0,k=Math.max(_(a,y,t.grip),1),A=Math.min(1,(O+.5*a.accel*o.throttle*Math.max(0,1-y/g))/k),j=x(a,t.steer,y,t.grip*(1-.4*t.lockup),Math.min(1,A),Wd);t.latFrac=j.frac;let M=a.accel*o.throttle*Math.max(0,1-(t.v/g)**2);h&&(M+=12*Math.max(0,1-t.v/g));let N=Ud*1.5*(.35+.65*t.grip)+(h?8:0);t.wheelspin=M>N?Math.min(1,(M-N)/N):0,M=Math.min(M,N),M*=1-(this.diff.assist?.15:.3)*Math.min(1,j.excess),t.pit.stage&&t.v>i.pit.limit&&o.throttle>0&&(M=Math.min(M,0)),M-=m.drag*t.v+45e-5*t.v*t.v+.4,o.throttle<.05&&t.v>5&&(M-=1.1*(1-o.throttle/.05)),M-=Ud*i.slopeAt(t.s)*.7,M-=Math.min(1,j.excess)*2.2*Math.min(1,t.v/30),O>0?M-=O:o.brake>0&&t.v<=.4&&!t.pit.stage&&(M-=8*t.brk),t.longAcc=M,t.wheelSlip=Math.max(t.lockup,t.wheelspin*.8,Math.min(1,j.excess)*.6),t.v+=M*n,t.v<0&&!(o.brake>0&&!t.pit.stage)&&(t.v=0),t.v=Math.max(t.v,-9);let ee=Math.abs(t.v)<2.5&&o.throttle>0?Math.sign(t.v||1)*2.5:t.v,P=me(t,pe(C(a,t.steer,Math.abs(ee),t.grip*(1-.4*t.lockup),Math.min(1,A)),ee,o.throttle*Math.max(0,1-t.brk),Math.min(1,j.frac),l),n,t.grip*(1-.25*t.lockup),l);t.theta+=P*n,t.yawRate=P,t.signedLatAcc=-P*t.v,t.latAcc=Math.abs(t.signedLatAcc),t.slipAngle=e(t.slipAngle,-.022,.022);let F=t.theta+(l?t.slipAngle:0);t.x+=Math.sin(F)*t.v*n,t.z+=Math.cos(F)*t.v*n,this.phase===`racing`&&(t.wear=Math.min(1,t.wear+f(t.tire,t.latAcc,this.wetness,a.wear)*n));let te=i.locate(t.x,t.z,t.idx,void 0,30);t.idx=te.i,t.d=te.d,t.s=te.s,s(t.lap,t.s)&&this._lapDone(t),t.progress=t.lap.progress,!t.started&&t.progress>=0&&(t.started=!0,t.lapStart=this.time),t.pose=ve(i,t.s,t.pose),t.y=t.pose.y;let I=t.idx,ne=i.leftWall[I]-1,re=i.rightWall[I]-1,ie=0;if(t.d>ne?ie=t.d-ne:t.d<-re&&(ie=t.d+re),ie){t.x-=i.nx[I]*ie,t.z-=i.nz[I]*ie,t.d-=ie;let a=i.theta[I],o=r(a-t.theta),s=Math.abs(Math.sin(o));t.theta+=e(o,-.5,.5)*Math.min(1,24*n),t.hit<=0?(t.v*=1-e(.12+.6*s,0,.6),t.hit=.4,this.events.push({type:`hit`,car:t,power:s})):t.v*=1-(4+18*s)*n,t.scrape=.15}t.hit=Math.max(0,t.hit-n),t.scrape=Math.max(0,(t.scrape||0)-n)}_lapDone(e){let t=e.lap.maxLaps,n=this.time;if(t>=1){let t=n-e.lapStart;e.lapStart=n,e.lapTimes.push(t),t<e.bestLap&&(e.bestLap=t)}e.laps=t,t>=this.laps&&!e.finished?(e.finished=!0,e.finishTime=n,e.pit.request=!1,this.events.push({type:`finish`,car:e})):(this.events.push({type:`lap`,car:e,lap:t}),this.solo||t!==this.laps-1||this.finalLapShown||this.cars.some(e=>e.laps>=this.laps)||(this.finalLapShown=!0,this.events.push({type:`finallap`,car:e})))}_interactions(t){let n=this.track,r=n.length,a=this.cars;for(let e=0;e<a.length;e++){let n=a[e];n.slipNow=0,n.cHit=Math.max(0,(n.cHit||0)-t)}for(let t=0;t<a.length;t++)for(let o=t+1;o<a.length;o++){let s=a[t],c=a[o],l=i(c.s-s.s,r),u=c.d-s.d;if(Math.abs(l)>36||Math.abs(u)>6)continue;let d=l>0?s:c,f=l>0?c:s,p=Math.abs(l)-4.6;if(d.finished||(d.slipNow=Math.max(d.slipNow,w(p,Math.abs(u)))),!(s.pit.stage||c.pit.stage)&&Math.abs(l)<4.6&&Math.abs(u)<2.1){let t=(2.1-Math.abs(u))*.5,r=u>=0?1:-1;if(c.x+=n.nx[c.idx]*t*r,c.z+=n.nz[c.idx]*t*r,s.x-=n.nx[s.idx]*t*r,s.z-=n.nz[s.idx]*t*r,(s.isPlayer||c.isPlayer)&&!((s.cHit||0)>0&&(c.cHit||0)>0)){let t=e(Math.abs(d.v-f.v)/25+(2.1-Math.abs(u))*.25,.05,1);s.cHit=c.cHit=.5,this.events.push({type:`hit`,car:s.isPlayer?s:c,power:t,kind:`car`})}Math.abs(l)>2.2&&(d.v=Math.min(d.v,f.v+1),f.v+=.08)}}for(let e=0;e<a.length;e++){let n=a[e];n.slip=n.slipNow,Kd.fill=n.slipNow,Kd.boosting=n.boosting,Kd.dt=t,n.boost=T(n.boost,Kd)}}gaps(e=this.player){let t=this.order.indexOf(e),n=this.track.length,r=t=>!t||t.progress<0||e.progress<0?null:Math.abs(t.progress-e.progress)/Math.max(30,e.v,t.v*.8);return{ahead:t>0&&!this.order[t-1].finished?r(this.order[t-1]):null,behind:t<this.order.length-1&&!this.order[t+1].finished?r(this.order[t+1]):null,L:n}}rank(){this.order=this.cars.slice().sort((e,t)=>e.finished&&t.finished?e.finishTime-t.finishTime:e.finished?-1:t.finished?1:t.progress-e.progress);let e=this.player?.pos;this.order.forEach((e,t)=>e.pos=t+1),this.player&&e&&e!==this.player.pos&&this.phase===`racing`&&this.player.progress>0&&!this.player.finished&&this.events.push({type:`poschange`,from:e,to:this.player.pos})}simulateToEnd(e=150){let t=0;for(;!this.cars.every(e=>e.finished)&&t<e;)this.step(1/30),t+=1/30;this.events.length=0}results(){let e=this.order[0];return this.order.map(t=>({pos:t.pos,name:t.driver?.name||t.team.name,tag:t.team.tag,team:t.team,isPlayer:t.isPlayer,id:t.driverId||null,finished:t.finished,time:t.finishTime,gap:t.finished?t.finishTime-e.finishTime:null,best:t.bestLap,stops:t.pitStops}))}};function Xd(e,t){return e.lineAt(t.s)*.9}function Zd(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new hi;c.morphTargetsRelative=s;let l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0,p=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let t in d.morphAttributes){if(!i.has(t))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;if(d.morphAttributes[t].length!==e[0].morphAttributes[t].length)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have the same number of morph targets for the "`+t+`" morph attribute.`),null;o[t]===void 0&&(o[t]=[]),o[t].push(d.morphAttributes[t]),p++}if(p!==i.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of morph attributes.`),null;if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=Qd(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=Qd(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function Qd(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new ti(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}function $d(e,t=1e-4){t=Math.max(t,2**-52);let n={},r=e.getIndex(),i=e.getAttribute(`position`),a=r?r.count:i.count,o=0,s=Object.keys(e.attributes),c=[],l=new Map,u=[],d=[`getX`,`getY`,`getZ`,`getW`],f=t*.5,p=10**Math.log10(1/t),m=f*p;for(let t=0;t<a;t++){let i=r?r.getX(t):t,a=``;for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),o=r.itemSize;for(let e=0;e<o;e++)a+=`${Math.trunc(r[d[e]](i)*p+m)},`}a in n?u.push(n[a]):(c.push(i),n[a]=o,u.push(o),o++)}let h=e.clone();for(let t in e.attributes)h.setAttribute(t,tf(e.attributes[t],c,l));for(let t in e.morphAttributes)h.morphAttributes[t]=e.morphAttributes[t].map(e=>tf(e,c,l));return h.setIndex(u),h}function ef(e,t=Math.PI/3){let n=e.index?e.toNonIndexed():e,r=n.attributes.position,i=r.count,a;if(r.isBufferAttribute===!0&&r.itemSize===3&&r.normalized===!1)a=r.array;else{a=new Float64Array(i*3);for(let e=0;e<i;e++)a[3*e+0]=r.getX(e),a[3*e+1]=r.getY(e),a[3*e+2]=r.getZ(e)}let o=Math.cos(t),s=(1+1e-10)*100,c=i/3,l=new Float64Array(c*3);for(let e=0;e<c;e++){let t=9*e,n=a[t+0],r=a[t+1],i=a[t+2],o=a[t+3],s=a[t+4],c=a[t+5],u=a[t+6],d=a[t+7],f=a[t+8],p=u-o,m=d-s,h=f-c,g=n-o,_=r-s,v=i-c,y=m*v-h*_,b=h*g-p*v,x=p*_-m*g,S=1/(Math.sqrt(y*y+b*b+x*x)||1);l[3*e+0]=y*S,l[3*e+1]=b*S,l[3*e+2]=x*S}let u=new Int32Array(i),d=new Float64Array(i*3),f=1;for(;f<i*2;)f<<=1;let p=f-1,m=new Int32Array(f),h=0;for(let e=0;e<i;e++){let t=3*e,n=Math.trunc(a[t+0]*s),r=Math.trunc(a[t+1]*s),i=Math.trunc(a[t+2]*s),o=(Math.imul(n,73856093)^Math.imul(r,19349663)^Math.imul(i,83492791))&p;for(;;){let t=m[o];if(t===0){let t=3*h;d[t+0]=n,d[t+1]=r,d[t+2]=i,m[o]=h+1,u[e]=h++;break}let a=3*(t-1);if(d[a+0]===n&&d[a+1]===r&&d[a+2]===i){u[e]=t-1;break}o=o+1&p}}let g=new Int32Array(h+1);for(let e=0;e<i;e++)g[u[e]+1]++;for(let e=0;e<h;e++)g[e+1]+=g[e];let _=new Int32Array(i),v=g.slice(0,h);for(let e=0;e<c;e++){let t=3*e;_[v[u[t+0]]++]=e,_[v[u[t+1]]++]=e,_[v[u[t+2]]++]=e}let y=new Float32Array(i*3);for(let e=0;e<c;e++){let t=3*e,n=l[t+0],r=l[t+1],i=l[t+2];for(let e=0;e<3;e++){let a=t+e,s=u[a],c=0,d=0,f=0;for(let e=g[s],t=g[s+1];e<t;e++){let t=3*_[e],a=l[t+0],s=l[t+1],u=l[t+2];n*a+r*s+i*u>o&&(c+=a,d+=s,f+=u)}let p=1/(Math.sqrt(c*c+d*d+f*f)||1);y[3*a+0]=c*p,y[3*a+1]=d*p,y[3*a+2]=f*p}}return n.setAttribute(`normal`,new ti(y,3,!1)),n}function tf(e,t,n=new Map){let r=e.isInterleavedBufferAttribute,i=r?e.data:e,a=r?i.stride:e.itemSize,o=r?n.get(i):void 0;if(o===void 0){let s=new i.array.constructor(t.length*a);for(let e=0;e<t.length;e++)for(let n=0;n<a;n++)s[e*a+n]=i.array[t[e]*a+n];o=r?new i.constructor(s,a,i.meshPerAttribute):new e.constructor(s,e.itemSize,e.normalized,e.meshPerAttribute),o.setUsage(i.usage),r&&n.set(i,o)}let s=r?new e.constructor(o,e.itemSize,e.offset,e.normalized):o;return s.name=e.name,r||(s.gpuType=e.gpuType),s}var nf=[`nigger`,`nigga`,`niggar`,`niggur`,`niggr`,`faggot`,`faggit`,`faggott`,`kike`,`kyke`,`chink`,`gook`,`tranny`,`troon`,`retard`,`retarded`,`molest`,`pedophile`,`paedophile`,`pedophile`,`childfucker`,`hitler`,`heilhitler`],rf=`fuck.fucker.fucking.fucked.motherfucker.motherfuck.mfucker.fck.fuk.fcuk.fuc.fux.phuck.shit.shitty.bullshit.shithead.sht.shiit.cunt.cunts.rape.rapist.raping.asshole.assholes.asshat.asswipe.ashole.aashole.bitch.bitches.bitchy.bastard.bastards.damn.damned.goddamn.goddamnit.piss.pissed.pissoff.dick.dicks.dickhead.dickface.cock.cocks.cockhead.cocksucker.pussy.pussies.whore.whores.slut.sluts.slutty.wank.wanker.wanking.twat.twats.bollocks.bugger.arsehole.tit.tits.titty.porn.porno.xxx.sex.sexy.sexual.anal.anus.fag.fags.dyke.dykes.spic.spick.homo.queer.nazi.nazis.kkk.cum.cumshot.jizz.penis.vagina.boob.boobs.boobies.hoe.hoes.stfu.gtfo.lmfao`.split(`.`),af=`class.classic.classify.classroom.assassin.assassins.assassination.scunthorpe.grape.grapes.grapefruit.therapist.therapy.dickson.dickinson.hancock.cockburn.penistone.shitake.shiitake.pass.passion.compass.bass.glass.grass.cassette.assume.assumption.cocker.cockpit.cocktail.hitchcock.weathercock.subaru.suzuki.spicy.spice`.split(`.`),of={0:`o`,1:`i`,3:`e`,4:`a`,5:`s`,7:`t`,"@":`a`,$:`s`,"|":`l`,"+":`t`},sf=nf.map(ff),cf=new Set(rf.map(ff)),lf=new Set(af.map(ff));function uf(e){let t=``;for(let n of e)t+=of[n]||n;return t}function df(e,{collapse:t=!1}={}){if(e==null)return``;let n=String(e).toLowerCase().normalize(`NFKD`).replace(/\p{M}/gu,``);return n=n.replace(/^[^a-z0-9@$]+|[^a-z0-9@$]+$/g,``),n=uf(n),n=n.replace(/[^a-z]/g,``),t&&(n=n.replace(/(.)\1+/g,`$1`)),n}function ff(e){return df(e,{collapse:!0})}function pf(e){return String(e||``).toLowerCase().normalize(`NFKD`).replace(/\p{M}/gu,``).split(/[^a-z0-9@$!|+]+/i).filter(Boolean).map(e=>df(e,{collapse:!1})).filter(Boolean)}function mf(e){if(e==null)return!1;let t=String(e);if(!t.trim())return!1;let n=df(t,{collapse:!1}),r=df(t,{collapse:!0});if(!n&&!r||lf.has(n)||lf.has(r))return!1;for(let e of sf)if(e&&(n.includes(e)||r.includes(e)))return!0;if(cf.has(n)||cf.has(r))return!0;for(let e of pf(t)){let t=e.replace(/(.)\1+/g,`$1`);if(!(lf.has(e)||lf.has(t))){if(cf.has(e)||cf.has(t))return!0;for(let n of sf)if(n.length>=4&&(e.includes(n)||t.includes(n)))return!0}}return!1}var hf=`That name isn't allowed`,gf=[{id:`stripes`,name:`STRIPES`,style:`stripe`},{id:`chevrons`,name:`CHEVRONS`,style:`chevron`},{id:`split`,name:`SPLIT`,style:`twotone`},{id:`fade`,name:`FADE`,style:`fade`},{id:`flash`,name:`FLASH`,style:`flash`},{id:`hoops`,name:`HOOPS`,style:`hoop`},{id:`checker`,name:`CHECKER`,style:`checker`}],_f=gf.map(e=>e.id),vf=e=>(gf.find(t=>t.id===e)||gf[0]).style,yf=[15222570,16747039,15909424,12576842,3720330,2078422,1937361,3364300,11036912,15755936,15921908,2763318];function bf(e,t){return typeof e!=`string`&&(e=e==null?``:String(e)),e=e.normalize(`NFC`).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g,``),e=e.replace(/<[^>]*>/g,``).replace(/[^\p{L}\p{N} \-._!#+]/gu,``),e=e.replace(/\s+/g,` `).trim(),[...e].slice(0,t).join(``).trim()}function xf(e,t=3,n=18){let r=bf(e,n);return[...r].length<t?`short`:mf(r)?`blocked`:null}function Sf(e,t=3,n=18){return xf(e,t,n)?null:bf(e,n)}function Cf(e,t=``){let n=bf(e,8).toUpperCase().replace(/[^A-Z0-9]/g,``).slice(0,3);if(n.length>=2&&!mf(n))return n;let r=wf(t);return mf(r)?`TM`:r}function wf(e){let t=bf(e,18).toUpperCase().normalize(`NFD`).replace(/[^A-Z0-9 ]/g,``).split(` `).filter(Boolean),n=t.length>=2?t.slice(0,3).map(e=>e[0]).join(``):``;if(n.length<3){let e=(t[0]||``).replace(/ /g,``),r=e.slice(1).replace(/[AEIOU]/g,``),i=e.slice(1).replace(/[^AEIOU]/g,``);n=t.length>=2?n+r+i+`XXX`:e.slice(0,1)+r+i+`XXX`}return n.slice(0,3)}function Tf(e,t=15222570){return typeof e==`number`&&Number.isInteger(e)&&e>=0&&e<=16777215?e:typeof e==`string`&&/^#?[0-9a-f]{6}$/i.test(e.trim())?parseInt(e.trim().replace(`#`,``),16):t}function Ef(e,t=1){let n=typeof e==`string`?parseInt(e,10):e;return Number.isInteger(n)&&n>=1&&n<=99?n:t}var Df=e=>`#`+(e>>>0).toString(16).padStart(6,`0`).slice(-6);function Of(){return{pattern:`chevrons`,c1:15222570,c2:16765514,c3:1381658,number:1}}function kf(e){let t=Of(),n=e&&typeof e==`object`?e:{};return{pattern:_f.includes(n.pattern)?n.pattern:t.pattern,c1:Tf(n.c1,t.c1),c2:Tf(n.c2,t.c2),c3:Tf(n.c3,t.c3),number:Ef(n.number,t.number)}}function Af(e,t=`Privateer Racing`){let n=e&&typeof e==`object`?e:{},r=Sf(n.name)||t;return{name:r,tag:Cf(n.tag,r),livery:kf(n.livery)}}function jf(e){let t=Af(e),n=t.livery;return{name:t.name,tag:t.tag,c1:n.c1,c2:n.c2,custom:!0,livery:{pattern:n.pattern,c3:n.c3,number:n.number}}}var Mf=`Casey Morrow`;function Nf(e){let t=e&&typeof e==`object`?e:{},n=t.team&&typeof t.team==`object`?t.team:null,r={...n?.livery||{},...t.livery||{}},i=Ef(t.number??r.number??(t.driver&&typeof t.driver==`object`?t.driver.number:void 0),Of().number),a=Af({name:t.name??n?.name,tag:t.tag??n?.tag,livery:{pattern:t.pattern??r.pattern,c1:t.c1??r.c1,c2:t.c2??r.c2,c3:t.c3??r.c3,number:i}});return{driver:Sf(typeof t.driver==`string`?t.driver:t.driver?.name??t.driverName??``)||Mf,name:a.name,tag:a.tag,pattern:a.livery.pattern,c1:a.livery.c1,c2:a.livery.c2,c3:a.livery.c3,number:a.livery.number}}function Pf(e,t={}){let n=Nf(e),r=t&&typeof t==`object`?t:{};return Nf({driver:r.driver===void 0?n.driver:Sf(r.driver)||n.driver,name:r.name===void 0?n.name:Sf(r.name)||n.name,tag:r.tag===void 0?r.name!==void 0&&Sf(r.name)?``:n.tag:r.tag,pattern:r.pattern===void 0?n.pattern:_f.includes(r.pattern)?r.pattern:n.pattern,c1:r.c1===void 0?n.c1:Tf(r.c1,n.c1),c2:r.c2===void 0?n.c2:Tf(r.c2,n.c2),c3:r.c3===void 0?n.c3:Tf(r.c3,n.c3),number:r.number===void 0?n.number:Ef(r.number,n.number)})}function Ff(e){let t=Nf(e);return jf({name:t.name,tag:t.tag,livery:{pattern:t.pattern,c1:t.c1,c2:t.c2,c3:t.c3,number:t.number}})}var If=[1,7,12,21,28,35,42,56,63,88],Lf=e=>If[(e%If.length+If.length)%If.length],Rf=[`stripe`,`twotone`,`chevron`,`flash`,`hoop`],zf=e=>e===0?`chevron`:Rf[(e%Rf.length+Rf.length)%Rf.length],Bf=(e,t)=>e?.livery?.pattern?vf(e.livery.pattern):zf(t),Vf=(e,t)=>e?.livery?.number??Lf(t),Hf={0:`111101101101111`,1:`010110010010111`,2:`111001111100111`,3:`111001111001111`,4:`101101111001001`,5:`111100111001111`,6:`111100111101111`,7:`111001001010010`,8:`111101111101111`,9:`111101111001111`},Uf=new G,Wf=e=>(Uf.set(e),[Uf.r,Uf.g,Uf.b]),Gf=(e,t,n)=>[e[0]+(t[0]-e[0])*n,e[1]+(t[1]-e[1])*n,e[2]+(t[2]-e[2])*n],Kf=(e,t)=>[Math.min(1,e[0]*t),Math.min(1,e[1]*t),Math.min(1,e[2]*t)],qf=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],Jf=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Yf=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],Xf=(e,t,n)=>e<t?t:e>n?n:e,Zf=e=>{let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]},Qf=class{constructor(){this.pos=[],this.col=[]}tri(e,t,n,r,i){let a=Jf(qf(t,e),qf(n,e));if(i&&Yf(a,qf(e,i))<0){let e=t;t=n,n=e}let o=Zf(Jf(qf(t,e),qf(n,e))),s=1+.16*Math.max(0,o[1])-.22*Math.max(0,-o[1])+.07*Math.max(0,o[2]),c=Math.sin((e[0]*12.9898+e[1]*78.233+e[2]*37.719)*43758.5453)*.5+.5;s*=.97+.06*(c-Math.floor(c));let l=o[1]>.6?.015:0,u=[Math.min(1,r[0]*s+l*.5),Math.min(1,r[1]*s+l*.6),Math.min(1,r[2]*s+l)];for(let r of[e,t,n])this.pos.push(r[0],r[1],r[2]),this.col.push(u[0],u[1],u[2])}quad(e,t,n,r,i,a){this.tri(e,t,n,i,a),this.tri(e,n,r,i,a)}flatQuad(e,t,n,r,i,a=[0,1,0]){for(let o of[[e,t,n],[e,n,r]]){let[e,t,n]=Yf(Jf(qf(o[1],o[0]),qf(o[2],o[0])),a)<0?[o[0],o[2],o[1]]:o;for(let r of[e,t,n])this.pos.push(r[0],r[1],r[2]),this.col.push(i[0],i[1],i[2])}}box(e,t,n,r,i,a,o,s=0,c=null){let l=Math.sin(s),u=Math.cos(s),d=[];for(let[o,s,c]of[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]){let f=s*i/2,p=c*a/2;d.push([e+o*r/2,t+f*u-p*l,n+f*l+p*u])}let f=[e,t,n],p=c||o;this.quad(d[0],d[1],d[2],d[3],o,f),this.quad(d[4],d[5],d[6],d[7],o,f),this.quad(d[0],d[4],d[7],d[3],o,f),this.quad(d[1],d[5],d[6],d[2],o,f),this.quad(d[3],d[2],d[6],d[7],p,f),this.quad(d[0],d[1],d[5],d[4],Kf(o,.7),f)}beam(e,t,n,r){let i=Zf(qf(t,e)),a=Zf(Jf(i,Math.abs(i[1])>.9?[1,0,0]:[0,1,0])),o=Zf(Jf(i,a)),s=n/2,c=[];for(let n of[e,t])for(let[e,t]of[[-1,-1],[1,-1],[1,1],[-1,1]])c.push([n[0]+a[0]*e*s+o[0]*t*s,n[1]+a[1]*e*s+o[1]*t*s,n[2]+a[2]*e*s+o[2]*t*s]);let l=[(e[0]+t[0])/2,(e[1]+t[1])/2,(e[2]+t[2])/2];for(let e=0;e<4;e++){let t=(e+1)%4;this.quad(c[e],c[t],c[4+t],c[4+e],r,l)}this.quad(c[0],c[1],c[2],c[3],r,l),this.quad(c[4],c[5],c[6],c[7],r,l)}tube(e,t,n,r=6){let i=e.map((n,i)=>{let a=e[Math.max(0,i-1)],o=e[Math.min(e.length-1,i+1)],s=Zf(qf(o,a)),c=Zf(Jf(s,Math.abs(s[1])>.9?[1,0,0]:[0,1,0])),l=Zf(Jf(s,c));return Array.from({length:r},(e,i)=>{let a=i/r*Math.PI*2,o=Math.cos(a)*t,s=Math.sin(a)*t;return[n[0]+c[0]*o+l[0]*s,n[1]+c[1]*o+l[1]*s,n[2]+c[2]*o+l[2]*s]})});for(let t=0;t<i.length-1;t++)for(let a=0;a<r;a++){let o=(a+1)%r;this.quad(i[t][a],i[t][o],i[t+1][o],i[t+1][a],n,[(e[t][0]+e[t+1][0])/2,(e[t][1]+e[t+1][1])/2,(e[t][2]+e[t+1][2])/2])}}slab(e,t,n,r,i=null){let a=e.length,o=e.reduce((e,t)=>e+t[0],0)/a,s=e.reduce((e,t)=>e+t[1],0)/a,c=[o,(t+n)/2,s];for(let i=1;i<a-1;i++)this.tri([e[0][0],n,e[0][1]],[e[i][0],n,e[i][1]],[e[i+1][0],n,e[i+1][1]],r,c),this.tri([e[0][0],t,e[0][1]],[e[i][0],t,e[i][1]],[e[i+1][0],t,e[i+1][1]],Kf(r,.7),c);for(let o=0;o<a;o++){let s=(o+1)%a;this.quad([e[o][0],t,e[o][1]],[e[s][0],t,e[s][1]],[e[s][0],n,e[s][1]],[e[o][0],n,e[o][1]],i||r,c)}}plate(e,t,n,r,i=null){let a=e.length,o=e.reduce((e,t)=>e+t[0],0)/a,s=e.reduce((e,t)=>e+t[1],0)/a,c=[(t+n)/2,s,o];for(let i=1;i<a-1;i++)this.tri([t,e[0][1],e[0][0]],[t,e[i][1],e[i][0]],[t,e[i+1][1],e[i+1][0]],r,c),this.tri([n,e[0][1],e[0][0]],[n,e[i][1],e[i][0]],[n,e[i+1][1],e[i+1][0]],r,c);for(let o=0;o<a;o++){let s=(o+1)%a;this.quad([t,e[o][1],e[o][0]],[n,e[o][1],e[o][0]],[n,e[s][1],e[s][0]],[t,e[s][1],e[s][0]],i&&o===0?i:r,c)}}loft(e,t,n=null){for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1],a=r.ring.length,o=0,s=0;for(let e=0;e<a;e++)o+=r.ring[e][0]+i.ring[e][0],s+=r.ring[e][1]+i.ring[e][1];let c=[o/(2*a),s/(2*a),(r.z+i.z)/2];for(let e=0;e<a;e++){let n=(e+1)%a,o=r.seg&&r.seg[e]||t;this.quad([r.ring[e][0],r.ring[e][1],r.z],[r.ring[n][0],r.ring[n][1],r.z],[i.ring[n][0],i.ring[n][1],i.z],[i.ring[e][0],i.ring[e][1],i.z],o,c)}}let r=(e,t,n)=>{let r=e.ring.length,i=0,a=0;for(let t of e.ring)i+=t[0],a+=t[1];let o=[i/r,a/r,e.z],s=[o[0],o[1],e.z+(n?1:-1)];for(let n=0;n<r;n++){let i=(n+1)%r;this.tri(o,[e.ring[n][0],e.ring[n][1],e.z],[e.ring[i][0],e.ring[i][1],e.z],t,s)}};r(e[0],n||t,!1),r(e[e.length-1],t,!0)}spanLoft(e,t){let n=(e,n)=>{let r=e.pts.length,i=0,a=0;for(let t of e.pts)i+=t[0],a+=t[1];let o=[e.x,i/r,a/r],s=[e.x+n,o[1],o[2]];for(let n=0;n<r;n++){let i=(n+1)%r;this.tri(o,[e.x,e.pts[n][0],e.pts[n][1]],[e.x,e.pts[i][0],e.pts[i][1]],t,s)}};for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1],a=r.pts.length,o=0,s=0;for(let e=0;e<a;e++)o+=r.pts[e][0]+i.pts[e][0],s+=r.pts[e][1]+i.pts[e][1];let c=[(r.x+i.x)/2,o/(2*a),s/(2*a)];for(let e=0;e<a;e++){let n=(e+1)%a;this.quad([r.x,r.pts[e][0],r.pts[e][1]],[i.x,i.pts[e][0],i.pts[e][1]],[i.x,i.pts[n][0],i.pts[n][1]],[r.x,r.pts[n][0],r.pts[n][1]],t,c)}}n(e[0],-1),n(e[e.length-1],1)}mirrored(e){let t=this.pos.length;e(1);let n=this.pos.length;for(let e=t;e<n;e+=9){let t=[0,1,2].map(t=>[-this.pos[e+t*3],this.pos[e+t*3+1],this.pos[e+t*3+2]]),n=this.col.slice(e,e+9);this.pos.push(t[0][0],t[0][1],t[0][2],t[2][0],t[2][1],t[2][2],t[1][0],t[1][1],t[1][2]),this.col.push(n[0],n[1],n[2],n[6],n[7],n[8],n[3],n[4],n[5])}}geometry(){let e=new hi;return e.setAttribute(`position`,new K(this.pos,3)),e.setAttribute(`color`,new K(this.col,3)),ef(e,$f)}},$f=1.15,ep=Wf(1381658),tp=Wf(2369070);Wf(9278366);var np=Wf(15921908),rp=Wf(1848656),ip=Wf(5211832),ap={gp:.38,speedway:.42},op={gp:.5,speedway:.55},sp=Math.PI*2/5,cp={gp:[[.95,1.9],[-.95,1.9],[1.05,-1.65],[-1.05,-1.65]],speedway:[[1,1.7],[-1,1.7],[1.1,-1.5],[-1.1,-1.5]]};function lp(e,t){if(t>=e[0].z)return e[0].yTop;for(let n=0;n<e.length-1;n++)if(t<=e[n].z&&t>=e[n+1].z){let r=(e[n].z-t)/(e[n].z-e[n+1].z);return e[n].yTop+(e[n+1].yTop-e[n].yTop)*r}return e[e.length-1].yTop}function up(e,t,n,r,i,a,o,s){let c=t.length,l=(c*3+(c-1))*a,u=5*a,d=n-l/2,f=(e,t)=>[e,i(t)+.014,t],p=a*.6;e.flatQuad(f(d-p,r-p),f(d+l+p,r-p),f(d+l+p,r+u+p),f(d-p,r+u+p),o);let m=e=>n+l/2-e;for(let n=0;n<c;n++){let o=Hf[t[n]]||Hf[0];for(let t=0;t<5;t++)for(let c=0;c<3;c++)if(o[t*3+c]===`1`){let o=n*4*a+c*a,l=m(o+a),u=m(o),d=r+(4-t)*a,f=.02;e.flatQuad([l,i(d)+f,d],[u,i(d)+f,d],[u,i(d+a)+f,d+a],[l,i(d+a)+f,d+a],s)}}}function dp(e,t,n,r,i,a){let o=r+(i-r)*.4,s=i+(a-i)*.5,c=e+(t-e)*.82,l=n+(t-n)*.55,u=[[e,r],[c,o],[t,i],[l,s],[n,a]],d=u.slice();for(let e=u.length-2;e>=0;e--)d.push([-u[e][0],u[e][1]]);return d}function fp(e,t,n,r,i,a){let o=[];for(let s=0;s<e.length;s++){let c=e[s],l=e[(s+1)%e.length];if(Math.abs(c[1]-t)<1e-4&&Math.abs(l[1]-t)<1e-4){o.push(a);continue}let u=(c[1]+l[1])*.5;o.push(u<t+(e[2][1]-t)*.55?n:u<e[2][1]+.02?r:i)}return o}function pp(e,t,n,r,i){let a=Math.sin(i),o=Math.cos(i);return[[0,r*.12],[.32,r],[1,r*.06],[.42,-r*.2]].map(([r,i])=>{let s=-r*n,c=i;return[e+c*o-s*a,t+c*a+s*o]})}function mp(e,t,n,r,i,a,o,s,c=.05,l=.06){let u=[],d=(e,s)=>{let d=n+c*e*e,f=r-l*e,p=i*(1-.12*e);u.push({x:s*t*e,pts:pp(d,f,p,a*(1-.2*e),o+.05*e)})};d(1,-1),d(.55,-1),d(0,1),d(.55,1),d(1,1),e.spanLoft(u,s)}function hp(e,t){let n=e.c1,r=e.c2,i=new Qf,a=Bf(e,t),o=String(Vf(e,t)),s=Wf(n),c=Wf(r),l=Kf(s,.72),u=Kf(s,1.12),d=e.livery?.c3==null?Kf(c,.9):Wf(e.livery.c3),f=a===`twotone`,p=f?c:l,m=[{z:3.36,wb:.05,wm:.06,wt:.05,y0:.2,ym:.26,y1:.31},{z:2.9,wb:.12,wm:.15,wt:.1,y0:.2,ym:.34,y1:.4},{z:2.3,wb:.2,wm:.27,wt:.17,y0:.2,ym:.42,y1:.5},{z:1.6,wb:.3,wm:.38,wt:.25,y0:.22,ym:.5,y1:.6},{z:.95,wb:.4,wm:.46,wt:.33,y0:.24,ym:.58,y1:.7},{z:.3,wb:.44,wm:.5,wt:.37,y0:.26,ym:.62,y1:.74},{z:-.35,wb:.42,wm:.46,wt:.3,y0:.28,ym:.68,y1:.84},{z:-.95,wb:.36,wm:.4,wt:.22,y0:.3,ym:.78,y1:1.02},{z:-1.55,wb:.28,wm:.3,wt:.14,y0:.32,ym:.62,y1:.8},{z:-2.05,wb:.22,wm:.24,wt:.1,y0:.34,ym:.5,y1:.62},{z:-2.4,wb:.2,wm:.2,wt:.1,y0:.34,ym:.46,y1:.56}],h=e=>a===`fade`?Gf(u,c,Xf((1.6-e)/3.6,0,1)):a===`hoop`&&(e<-.4&&e>-1||e<-2)||f&&e<-.3?c:u,g=m.map(e=>{let t=dp(e.wb,e.wm,e.wt,e.y0,e.ym,e.y1);return{z:e.z,ring:t,seg:fp(t,e.y0,p,s,h(e.z),ep)}});i.loft(g,s,ep);let _=(()=>{let e=m.map(e=>({z:e.z,yTop:e.y1}));return t=>lp(e,t)})(),v=(()=>{let e=m.map(e=>({z:e.z,yTop:e.wt}));return t=>lp(e,t)})();i.box(0,.745,.05,.5,.05,.9,ep),i.box(0,.84,-.42,.34,.2,.18,tp);let y=new Ma(.19,6,4).toNonIndexed().attributes.position,b=a===`twotone`?c:np;for(let e=0;e<y.count;e+=3)i.tri([y.getX(e),y.getY(e)+.95,y.getZ(e)+.08],[y.getX(e+1),y.getY(e+1)+.95,y.getZ(e+1)+.08],[y.getX(e+2),y.getY(e+2)+.95,y.getZ(e+2)+.08],b,[0,.95,.08]);i.box(0,.97,.245,.27,.085,.07,Wf(727595)),i.box(0,1.01,.262,.2,.025,.04,Wf(16764730));let x=(e,t,n,r,i,a)=>({z:e,ring:[t,n,r,i,a],seg:[ep,p,s,f?c:u,Kf(s,.6)]}),S=[x(.85,[.5,.3],[.78,.36],[1,.52],[.9,.74],[.5,.74]),x(.1,[.5,.3],[.74,.37],[.97,.56],[.86,.78],[.5,.82]),x(-.9,[.42,.34],[.62,.4],[.82,.58],[.68,.72],[.4,.88]),x(-1.9,[.3,.36],[.42,.4],[.5,.5],[.42,.6],[.26,.64])];i.mirrored(()=>i.loft(S,s,ep)),i.plate([[-1.5,.9],[-1.6,1.12],[-1.75,1.12],[-2.35,.66],[-2.45,.58],[-1.5,.58]],-.02,.02,u,c),i.box(0,1.04,-.78,.3,.2,.3,u),i.box(0,1.07,-.62,.22,.13,.04,ep);let C=Wf(3158588);i.tube([[0,.76,.52],[0,.95,.6],[0,1.08,.6]],.04,C,6);let w=e=>[[0,1.09,.6],[e*.16,1.1,.55],[e*.28,1.1,.42],[e*.34,1.08,.24],[e*.35,1,.04],[e*.35,.84,-.16]];i.tube(w(1),.036,C,6),i.tube(w(-1),.036,C,6),i.box(0,1.13,.58,.08,.03,.12,c);for(let e of[1,-1])i.tube([[e*.46,.8,.62],[e*.56,.9,.66]],.016,tp,4),i.box(e*.6,.92,.66,.16,.07,.06,u),i.flatQuad([e*.53,.895,.627],[e*.67,.895,.627],[e*.67,.945,.627],[e*.53,.945,.627],Wf(10467020),[0,0,-1]);i.box(0,1.15,-.72,.14,.05,.08,c),mp(i,.96,.16,3.42,.28,.045,.02,ep,.07,.1),mp(i,.96,.22,3.28,.24,.04,.16,c,.09,.12),mp(i,.92,.3,3.14,.2,.032,.28,u,.1,.12),i.beam([.12,.3,2.7],[.1,.17,3.15],.05,tp),i.beam([-.12,.3,2.7],[-.1,.17,3.15],.05,tp),i.mirrored(()=>i.plate([[3.5,.08],[3.5,.28],[3.2,.42],[2.95,.4],[2.95,.1]],1,1.05,s,c)),mp(i,.82,.96,-2.22,.3,.05,-.06,u,.03,.04),mp(i,.8,1.32,-2.4,.2,.034,-.2,c,.03,.03),mp(i,.52,.56,-2.42,.24,.03,-.06,ep,.02,.03),i.mirrored(()=>i.plate([[-2.1,.5],[-2.1,1.42],[-2.5,1.42],[-2.75,1.34],[-2.75,.55]],.86,.92,s,c)),i.beam([.1,.62,-2.15],[.1,1.1,-2.4],.055,tp),i.beam([-.1,.62,-2.15],[-.1,1.1,-2.4],.055,tp),i.box(0,.5,-2.1,.4,.28,.5,ep),i.box(0,.32,-2.55,.9,.08,.35,tp,.18),i.slab([[.32,2.3],[.62,1.25],[.84,.95],[.86,-.7],[.62,-1.2],[.5,-2.35],[-.5,-2.35],[-.62,-1.2],[-.86,-.7],[-.84,.95],[-.62,1.25],[-.32,2.3]],.095,.14,tp,ep);let T=Wf(4869464);for(let[e,t]of gp){let n=Math.sign(e),r=[e-n*.25,.4,t],a=t>0?1:-1;i.beam([n*.4,.34,t+.35*a],r,.04,T),i.beam([n*.4,.34,t-.35*a],r,.04,T),i.beam([n*.36,.62,t+.25*a],[r[0],.5,t],.04,T),i.beam([n*.36,.62,t-.25*a],[r[0],.5,t],.04,T),i.beam([n*.2,.7,t],[r[0],.43,t],.035,c)}vp(i,a,s,c,_,v,S,d);let E=a===`twotone`?np:Wf(15790322),D=e.livery&&yp(d)<.45?d:ep;return up(i,o,0,1.3,_,.06,E,D),up(i,o,0,-1.42,_,.034,E,D),i}var gp=[[.95,1.9],[-.95,1.9],[1.05,-1.65],[-1.05,-1.65]];function _p(e,t,n){let r=0;for(;r<e.length-2&&t<e[r+1].z;)r++;let i=e[r],a=e[r+1],o=Xf((i.z-t)/(i.z-a.z),0,1),s=e=>[i.ring[e][0]+(a.ring[e][0]-i.ring[e][0])*o,i.ring[e][1]+(a.ring[e][1]-i.ring[e][1])*o],c=s(3),l=s(4);return[l[0]+(c[0]-l[0])*n,l[1]+(c[1]-l[1])*n]}function vp(e,t,n,r,i,a,o,s=Kf(r,.9)){let c=.012,l=(e,t)=>Xf(e,-a(t)+.005,a(t)-.005),u=(e,t)=>[l(e,t),i(t)+c,t],d=(t,n,r,i,a)=>e.flatQuad(u(t,r),u(n,r),u(n,i),u(t,i),a);if(t===`stripe`||t===`chevron`)for(let e of[1,-1]){let t=e*.045,n=e*.1;d(t,n,3.3,1.7,r),d(t,n,-.4,-2.35,r)}if(t===`chevron`)for(let t=0;t<2;t++){let n=2.25-t*.5;for(let i of[1,-1])e.flatQuad(u(i*.02,n+.1),u(i*.2,n-.14),u(i*.2,n-.4),u(i*.02,n-.12),t?s:r)}if(t===`flash`){d(-.08,.08,3.36,2.7,r);for(let t of[1,-1]){let n=(e,n)=>{let r=_p(o,e,n);return[t*r[0],r[1]+c,e]};e.flatQuad(n(-.6,.55),n(-.6,.15),n(-1.4,.15),n(-1.4,.65),r)}}if(t===`hoop`&&(d(-.3,.3,.9,.7,r),d(-.3,.3,-1.6,-1.75,r)),t===`twotone`&&d(-.08,.08,3.36,.4,r),t===`fade`)for(let e of[1,-1])d(e*.03,e*.06,3.2,1.8,s);if(t===`checker`){for(let[e,t]of[[2.05,2],[-1.95,2]])for(let n=0;n<t;n++)for(let t=-3;t<3;t++){let i=e-n*.1,a=.06;d(t*a,(t+1)*a,i,i-.1,n+t&1?r:s)}for(let e of[1,-1])d(e*.05,e*.08,1.7,.4,r)}}var yp=e=>.3*e[0]+.59*e[1]+.11*e[2];function bp(e,t){let n=e.c1,r=e.c2,i=new Qf,a=Bf(e,t),o=String(Vf(e,t)),s=Wf(n),c=Wf(r),l=Kf(s,1.12),u=a===`twotone`,d=u?c:Kf(s,.72),f=e.livery?.c3==null?Kf(c,.9):Wf(e.livery.c3),p=[{z:3.3,wb:.2,wm:.24,wt:.2,y0:.2,ym:.3,y1:.36},{z:2.7,wb:.3,wm:.38,wt:.28,y0:.2,ym:.38,y1:.46},{z:2,wb:.42,wm:.5,wt:.38,y0:.22,ym:.5,y1:.6},{z:1.1,wb:.52,wm:.6,wt:.46,y0:.24,ym:.58,y1:.7},{z:.2,wb:.56,wm:.62,wt:.46,y0:.26,ym:.62,y1:.76},{z:-.7,wb:.54,wm:.58,wt:.38,y0:.28,ym:.7,y1:.9},{z:-1.5,wb:.44,wm:.46,wt:.2,y0:.3,ym:.78,y1:1.08},{z:-2.1,wb:.34,wm:.34,wt:.14,y0:.32,ym:.62,y1:.86},{z:-2.5,wb:.3,wm:.3,wt:.12,y0:.34,ym:.5,y1:.7}],m=p.map(e=>{let t=a===`fade`?Gf(l,c,Xf((1.6-e.z)/3.6,0,1)):u&&e.z<0||a===`hoop`&&e.z<-1.2&&e.z>-1.7?c:l,n=dp(e.wb,e.wm,e.wt,e.y0,e.ym,e.y1);return{z:e.z,ring:n,seg:fp(n,e.y0,d,s,t,ep)}});i.loft(m,s,ep);let h=(()=>{let e=p.map(e=>({z:e.z,yTop:e.y1}));return t=>lp(e,t)})(),g=(()=>{let e=p.map(e=>({z:e.z,yTop:e.wt}));return t=>lp(e,t)})();i.box(0,.775,.45,.62,.05,1,ep);let _=new Ma(.21,6,4).toNonIndexed().attributes.position,v=a===`twotone`?c:np;for(let e=0;e<_.count;e+=3)i.tri([_.getX(e),_.getY(e)+1,_.getZ(e)+.4],[_.getX(e+1),_.getY(e+1)+1,_.getZ(e+1)+.4],[_.getX(e+2),_.getY(e+2)+1,_.getZ(e+2)+.4],v,[0,1,.4]);i.box(0,1.02,.6,.3,.09,.08,Wf(727595)),i.box(0,1.06,.62,.22,.026,.04,Wf(4186367));let y=Wf(3158588);i.quad([.4,.78,.95],[-.4,.78,.95],[-.3,1.18,.62],[.3,1.18,.62],rp,[0,.9,.4]),i.quad([.3,1.18,.62],[-.3,1.18,.62],[-.28,1.2,.5],[.28,1.2,.5],ip,[0,.9,.4]),i.beam([.4,.78,.95],[.3,1.18,.62],.06,y),i.beam([-.4,.78,.95],[-.3,1.18,.62],.06,y),i.beam([.3,1.18,.62],[.38,1,-.15],.055,y),i.beam([-.3,1.18,.62],[-.38,1,-.15],.055,y),i.box(0,1.2,.58,.62,.035,.1,c);let b=(e,t,n,r,i,a)=>({z:e,ring:[t,n,r,i,a],seg:[ep,d,s,u?c:l,Kf(s,.6)]}),x=[b(1,[.6,.3],[.9,.36],[1.12,.54],[1.02,.78],[.6,.78]),b(-.1,[.6,.3],[.88,.37],[1.12,.58],[1,.86],[.58,.9]),b(-1.2,[.5,.34],[.78,.4],[1,.6],[.84,.82],[.5,.94]),b(-2.2,[.36,.36],[.5,.4],[.6,.52],[.5,.66],[.3,.72])];i.mirrored(()=>i.loft(x,s,ep)),i.plate([[-.9,1.04],[-1.2,1.5],[-1.34,1.5],[-1.7,1.06],[-2.5,.72],[-2.6,.64],[-1.4,.6]],-.03,.03,l,c),i.box(0,1.1,-.8,.36,.2,.4,l),i.box(0,1.13,-.58,.26,.14,.05,ep),mp(i,1.12,.18,3.42,.32,.05,.04,ep,.06,.08),mp(i,1.12,.24,3.28,.26,.04,.14,c,.07,.08),mp(i,1.05,.32,3.14,.22,.034,.26,l,.08,.08),i.beam([.2,.34,2.7],[.18,.2,3.3],.06,tp),i.beam([-.2,.34,2.7],[-.18,.2,3.3],.06,tp),i.mirrored(()=>i.plate([[3.55,.08],[3.55,.3],[3.25,.44],[3,.42],[3,.1]],1.2,1.26,s,c)),mp(i,1,1.22,-2.36,.38,.06,-.08,l,.03,.04),mp(i,.98,1.46,-2.46,.28,.045,-.22,c,.035,.04),i.mirrored(()=>i.plate([[-2.2,.55],[-2.2,1.72],[-2.62,1.72],[-2.9,1.62],[-2.9,.6]],1.04,1.1,s,c)),i.beam([.14,.7,-2.2],[.14,1.26,-2.5],.06,tp),i.beam([-.14,.7,-2.2],[-.14,1.26,-2.5],.06,tp),i.box(0,.52,-2.3,.6,.3,.6,ep),i.box(0,.12,-.1,1.5,.05,4.4,tp);let S=Wf(4869464);for(let[e,t]of cp.speedway){let n=Math.sign(e),r=[e-n*.27,.43,t],a=t>0?1:-1;i.beam([n*.5,.34,t+.35*a],r,.045,S),i.beam([n*.5,.34,t-.35*a],r,.045,S),i.beam([n*.46,.64,t+.25*a],[r[0],.54,t],.045,S),i.beam([n*.46,.64,t-.25*a],[r[0],.54,t],.045,S)}vp(i,a,s,c,h,g,x,f);let C=Wf(15790322);return up(i,o,0,1.45,h,.06,C,ep),up(i,o,0,-1,h,.034,C,ep),i}function xp(e,t,n,r){let i=new Qf,a=ap[e],o=op[e]/2,s=a*.965,c=Wf(1710623),l=Wf(2500140),u=Wf(1842210),d=n,f=t,p=Gf(Wf(1315866),f,.18),m=a*.78,h=a*.9,g=a*.62,_=g*.86,v=o+.02,y=(e,t,n)=>[n,Math.cos(t)*e,Math.sin(t)*e],b=.07;for(let e=0;e<20;e++){let t=e/20*Math.PI*2,n=(e+1)/20*Math.PI*2,x=[0,0,0],S=e<2&&r?Wf(6972766):e>>1&1?c:l;i.quad(y(a,t,-o+b),y(a,t,o-b),y(a,n,o-b),y(a,n,-o+b),S,x);for(let e of[1,-1])i.quad(y(a,t,e*(o-b)),y(s,t,e*o),y(s,n,e*o),y(a,n,e*(o-b)),d,x);i.quad(y(s,t,o),y(a*.92,t,o),y(a*.92,n,o),y(s,n,o),u,x),i.quad(y(a*.92,t,o),y(h,t,v),y(h,n,v),y(a*.92,n,o),u,x),i.quad(y(h,t,v),y(m,t,v),y(m,n,v),y(h,n,v),d,x),i.quad(y(m,t,v),y(g,t,v),y(g,n,v),y(m,n,v),u,x),i.quad(y(g,t,v),y(_,t,v),y(_,n,v),y(g,n,v),e>>1&1?f:Kf(f,.82),x);let C=a*.36;i.quad(y(_,t,v),y(C,t,v+.012),y(C,n,v+.012),y(_,n,v),p,x),i.quad(y(s,n,-o),y(a*.55,n,-o),y(a*.55,t,-o),y(s,t,-o),u,x)}for(let e=0;e<3;e++){let t=.35+e*.28,n=a*.915,r=a*.935;i.flatQuad(y(n,t,o+.012),y(r,t,o+.012),y(r,t+.16,o+.012),y(n,t+.16,o+.012),Wf(13619158),[1,0,0])}let x=v+.012;for(let e=0;e<5;e++){let t=e/5*Math.PI*2,n=Math.cos(t),r=Math.sin(t),o=a*.1,s=[x,n*_*.98,r*_*.98],c=-r*o,l=n*o;i.flatQuad([x,c*.6,l*.6],[x,s[1]+c,s[2]+l],[x,s[1]-c,s[2]-l],[x,-c*.6,-l*.6],e===0?np:Kf(f,1.2),[1,0,0])}let S=v-.075,C=a*.5,w=Wf(3948876),T=Wf(2764342);for(let e=0;e<20;e++){let t=e/20*Math.PI*2,n=(e+1)/20*Math.PI*2;i.tri([S,0,0],y(C,t,S),y(C,n,S),e%3==0?T:w,[S-1,0,0])}let E=[];for(let e=0;e<5;e++){let t=e/5*Math.PI*2+Math.PI/5;E.push([Math.sin(t)*a*.15,Math.cos(t)*a*.15])}return i.plate(E,x-.005,x+.045,np),i}var Sp=e=>(Uf.set(e),.3*Uf.r+.59*Uf.g+.11*Uf.b),Cp=e=>Sp(e.c2)>.28?e.c2:Sp(e.c1)>.28?e.c1:15263984,wp={dry:15921910,wet:3117055},Tp=3;function Ep(e){let t=e===`speedway`,n=t?-2.512:-2.412,r=t?.52:.5,i=new hi,a=[],o=[[.15,r,n],[-.15,r,n],[0,r-.1,n]];for(let e=0;e<Tp;e++){let[t,n,r]=o[e];for(let i of[1,2.4]){let o=(e===2?.07:.085)*i,s=(e===2?.05:.06)*i;a.push(t-o,n-s,r,t+o,n-s,r,t+o,n+s,r,t-o,n-s,r,t+o,n+s,r,t-o,n+s,r)}}return i.setAttribute(`position`,new K(a,3)),i.setAttribute(`color`,new ti(new Float32Array(a.length/3*4),4)),i}function Dp(){if(typeof document>`u`)return null;let e=document.createElement(`canvas`);e.width=64,e.height=128;let t=e.getContext?.(`2d`),n=t?.createImageData?.(64,128);if(!n)return null;for(let e=0;e<128;e++)for(let t=0;t<64;t++){let r=Math.abs((t+.5)/32-1),i=Math.abs((e+.5)/64-1),a=(r**4+i**4)**.25,o=Math.max(0,Math.min(1,(1-a)/.45)),s=(e*64+t)*4;n.data[s]=n.data[s+1]=n.data[s+2]=255,n.data[s+3]=Math.round(255*o*o*(3-2*o))}return t.putImageData(n,0,0),new fa(e)}var Op=new Ga({vertexColors:!0,roughness:.34,metalness:.04,clearcoat:.62,clearcoatRoughness:.24,envMapIntensity:.4}),kp=new Wa({vertexColors:!0,roughness:.6,metalness:.3,envMapIntensity:.7}),Ap=new Di({color:0,transparent:!0,opacity:.62,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4,map:Dp()}),jp=new Di({color:16772659,fog:!1}),Mp=new Di({vertexColors:!0,transparent:!0,opacity:.38,depthWrite:!1}),Np=new Di({vertexColors:!0,color:new G(2.6,2.6,2.6),transparent:!0,depthWrite:!1,fog:!1,side:2}),Pp=new Aa(2.9,6.6).rotateX(-Math.PI/2),Fp=new Map,Ip=new Map,Lp=new Map;function Rp(e,t,n=t.index??0){let r=t.livery,i=e+`:`+n+`:`+t.c1+`:`+t.c2+(r?`:`+r.pattern+`:`+r.c3+`:`+r.number:``),a=Fp.get(i);return a||(a=(e===`speedway`?bp:hp)(t,n).geometry(),a.name=`car-${e}-${n}`,Fp.set(i,a)),a}function zp(e,t,n=`dry`){let r=e+`:`+t.c2+`:`+n,i=Ip.get(r);if(!i){let a=Cp(t),o=n===`dry`&&Sp(a)>.78?16765471:wp[n]||wp.dry;i=xp(e,Wf(a),Wf(o),!0).geometry(),Ip.set(r,i)}return i}var Bp=e=>{let t=Lp.get(e);return t||(t=Ep(e),Lp.set(e,t)),t},Vp=new zn,Hp=new hn,Up=new Yn,Wp=new W,Gp=new W(1,1,1);function Kp(e,t,n=!1,r=!1,i=t.index??0){let a=e===`speedway`?`speedway`:`gp`,o=new zi(Rp(a,t,i),r?Mp:Op);o.castShadow=!r,o.receiveShadow=!r,o.name=`body`;let s=new pr,c=new pr;c.add(o);let l=new Zi(zp(a,t,`dry`),r?Mp:kp,4);{let e=cp[a],t=ap[a],n=(e[0][1]+e[2][1])/2,r=Math.max(...e.map(e=>Math.abs(e[0])))+op[a]/2+.15;l.boundingSphere=new si(new W(0,t,n),Math.hypot(r,(e[0][1]-e[2][1])/2+t+.15,t+.1))}l.castShadow=!1,l.receiveShadow=!1,l.name=`wheels`,c.add(l);let u=cp[a].map(([e,t],n)=>({i:n,x:e,z:t,y:ap[a],front:n<2,left:e>0,steer:0,spin:0,bump:0,visible:!0,mesh:l})),d=[u[0],u[1]],f=null,p={intensity:0,on:!1},m={intensity:0,on:!1};r||(f=new zi(Bp(a).clone(),Np),f.renderOrder=3,c.add(f));let h=new zi(Pp,Ap);h.position.y=.06,h.name=`shadow`,r||s.add(h),s.add(c);let g=null;n&&(g=new zi(new ya(1.5,2.8,4).rotateX(Math.PI),jp),g.position.y=5,g.visible=!1,s.add(g));let _={group:s,pivot:c,body:o,wheels:u,frontPivots:d,wheelMesh:l,lamps:f,brakeLight:p,rainLight:m,mark:g,cls:a,ghost:r,shadow:h,team:t,teamIndex:i,number:Vf(t,i),tire:`dry`,anim:{pitch:0,roll:0,bob:0,kerbMix:0,steer:0,t:0,dist:0,rainPhase:0,bumpPhase:0,vib:0},setTire(e){e!==_.tire&&(_.tire=e,l.geometry=zp(a,t,e))}};return qp(_),_}function qp(e){let t=ap[e.cls],n=e.wheels;for(let r=0;r<n.length;r++){let i=n[r];if(!i.visible){Vp.makeScale(0,0,0),e.wheelMesh.setMatrixAt(i.i,Vp);continue}let a=i.left?i.spin:-i.spin;Up.set(a,-i.steer+(i.left?0:Math.PI),0,`YXZ`),Hp.setFromEuler(Up),Wp.set(i.x,t+i.bump,i.z),e.wheelMesh.setMatrixAt(i.i,Vp.compose(Wp,Hp,Gp))}e.wheelMesh.instanceMatrix.needsUpdate=!0}var Jp=.42*sp,Yp=.12*sp;Jp*60;function Xp(e){let t=Math.abs(e);if(!(t>Jp))return e;let n=Math.floor(t/sp),r=t-n*sp;return Math.sign(e)*(n*sp+Xf(r,n?Yp:0,Jp))}var Zp=Math.PI*2*1024,Qp=Math.PI-Math.PI/10,$p=Math.PI+Math.PI/10;function em(e,t,n){let r=e.anim,i=ap[e.cls],a=t.v;r.t+=n;let o=1-.85*(t.lockup||0),s=(a||0)/i*o*n,c=Xp(s);r.steer+=((t.steer||0)*.42*Xf(1-Math.abs(a)/120,.3,1)-r.steer)*(1-Math.exp(-Math.min(n,.1)*24)),r.bumpPhase+=s;let l=e.wheels,u=t.flat>.02?.03*t.flat*Xf(Math.abs(a)/25,0,1):0;for(let e=0;e<l.length;e++){let t=l[e];t.spin+=c,(t.spin>Zp||t.spin<-Zp)&&(t.spin-=Zp*Math.sign(t.spin)),t.steer=t.front?r.steer:0,t.bump=t.front&&u>0?u*Math.max(0,Math.cos(t.spin-(t.left?Qp:$p)))**3:0}let d=1-Math.exp(-Math.min(n,.1)*7),f=-Xf((t.signedLatAcc??Math.sign(t.steer||0)*(t.latAcc||0))*.0019,-.078,.078),p=Xf(-(t.longAcc||0)*.00135,-.06,.062);r.roll+=(f-r.roll)*d,r.pitch+=(p-r.pitch)*d,r.dist=t.s??r.dist+a*n;let m=+(t.surface===`kerb`),h=+(t.surface===`grass`||t.surface===`gravel`);r.kerbMix+=(Math.max(m,h)-r.kerbMix)*(1-Math.exp(-Math.min(n,.1)*14)),r.bob=r.kerbMix*Xf(Math.abs(a)/50,.25,1)*((m?.022:.034)*Math.sin(r.dist*4.4)+.009*Math.sin(r.dist*9.1+1));let g=(.0035*Xf(Math.abs(a)/90,0,1)+.012*(t.flat||0)*Xf(Math.abs(a)/40,0,1)+.01*(t.lockup||0))*Math.sin(r.t*83);e.pivot.rotation.x=-(t.pitch||0)+r.pitch+g*.6,e.pivot.rotation.z=(t.roll||0)+r.roll+g*.4,e.pivot.position.y=(t.lift||0)+r.bob+Math.abs(g)*.5,e.shadow.rotation.x=-(t.pitch||0),e.shadow.rotation.z=t.roll||0;let _=(t.brake||0)>.05||(t.longAcc||0)<-9;e.brakeLight.on=_,e.brakeLight.intensity=+!!_;let v=(t.rain||0)>.25;return r.rainPhase+=n,e.rainLight.on=v,e.rainLight.intensity=v?Math.sin(r.rainPhase*11)>0?1:.15:0,e.ghost||nm(e),qp(e),e}function tm(e,t,n,r,i,a,o){let s=t*12*4;for(let t=0;t<12;t++){let c=s+t*4;e[c]=n,e[c+1]=r,e[c+2]=i,e[c+3]=t>=6?o:a}}function nm(e){let t=e.lamps.geometry.attributes.color,n=t.array,r=e.brakeLight.intensity,i=e.rainLight.intensity;for(let e=0;e<2;e++)tm(n,e,.35+.65*r,.03+.12*r,.03+.05*r,.9,.26*r);let a=i>.5?.5:0;tm(n,2,.4+.6*i,.04+a,.04+a,.9,.3*i),t.needsUpdate=!0}function rm(e){e.wheelMesh.dispose?.(),e.lamps?.geometry.dispose(),e.mark&&e.mark.geometry.dispose()}function im(){if(typeof document>`u`)return null;let e=document.createElement(`canvas`);e.width=e.height=32;let t=e.getContext?.(`2d`);if(!t?.createRadialGradient)return null;let n=t.createRadialGradient(16,16,1,16,16,16);return n.addColorStop(0,`rgba(255,255,255,0.9)`),n.addColorStop(.4,`rgba(255,255,255,0.35)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,32,32),new fa(e)}function am(e,t){let n=(Math.imul(e|0,668265261)^Math.imul((t|0)+374761393,2246822507))>>>0;return n=Math.imul(n^n>>>15,739982445)>>>0,n^=n>>>12,(n>>>0)%65536/65536}var om={grass:{r:.45,g:.36,b:.22,a:.5,rate:.35,life:.9,up:1.6,size:1},gravel:{r:.62,g:.5,b:.34,a:.55,rate:.5,life:1.1,up:2.2,size:1}},sm=(e,t,n,r)=>e.x+t*r[0]+n*r[1],cm=(e,t,n,r)=>e.z-n*r[0]+t*r[1],lm=class{constructor(e=384,t=320){this.max=e,this.next=0,this.counter=0,this.px=new Float32Array(e*3),this.vel=new Float32Array(e*3),this.life=new Float32Array(e),this.life0=new Float32Array(e),this.a0=new Float32Array(e),this.col=new Float32Array(e*4);for(let t=0;t<e;t++)this.px[t*3+1]=-1e3;let n=new hi;n.setAttribute(`position`,new ti(this.px,3).setUsage(Ht)),n.setAttribute(`color`,new ti(this.col,4).setUsage(Ht)),this.points=new la(n,new ia({size:1.15,vertexColors:!0,transparent:!0,depthWrite:!1,sizeAttenuation:!0,fog:!1,map:im()})),this.points.frustumCulled=!1,this.points.renderOrder=4,this.points.name=`tyre-fx`,this.maxMarks=t,this.mnext=0,this.mCount=0,this.mpos=new Float32Array(t*4*3);let r=new hi;r.setAttribute(`position`,new ti(this.mpos,3).setUsage(Ht));let i=new Uint16Array(t*6);for(let e=0;e<t;e++)i.set([e*4,e*4+1,e*4+2,e*4,e*4+2,e*4+3],e*6);r.setIndex(new ti(i,1)),this.marks=new zi(r,new Di({color:789518,transparent:!0,opacity:.55,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6,side:2,fog:!1})),this.marks.frustumCulled=!1,this.marks.renderOrder=1,this.marks.name=`skid-marks`,this.markDirty=!1}get group(){return this}addTo(e){e.add(this.marks),e.add(this.points)}removeFrom(e){e.remove(this.marks),e.remove(this.points)}emit(e,t,n,r,i,a,o,s,c,l,u){let d=this.next;this.next=(this.next+1)%this.max;let f=d*3;return this.px[f]=e,this.px[f+1]=t,this.px[f+2]=n,this.vel[f]=r,this.vel[f+1]=i,this.vel[f+2]=a,this.life[d]=o,this.life0[d]=o,this.a0[d]=u,this.col[d*4]=s,this.col[d*4+1]=c,this.col[d*4+2]=l,this.col[d*4+3]=u,d}update(e){let t=this.max,n=Math.exp(-2.2*e);for(let r=0;r<t;r++){let t=this.life[r];if(t<=0)continue;let i=r*3,a=t-e;if(a<=0){this.life[r]=0,this.px[i+1]=-1e3,this.col[r*4+3]=0;continue}this.life[r]=a,this.vel[i]*=n,this.vel[i+2]*=n,this.vel[i+1]=this.vel[i+1]*n+.7*e,this.px[i]+=this.vel[i]*e,this.px[i+1]+=this.vel[i+1]*e,this.px[i+2]+=this.vel[i+2]*e;let o=a/this.life0[r];this.col[r*4+3]=this.a0[r]*o*Math.min(1,(1-o)*8+.2)}let r=this.points.geometry;r.attributes.position.needsUpdate=!0,r.attributes.color.needsUpdate=!0,this.markDirty&&=(this.marks.geometry.attributes.position.needsUpdate=!0,!1)}alive(){let e=0;for(let t=0;t<this.max;t++)this.life[t]>0&&e++;return e}mark(e,t,n,r,i,a){let o=n-e,s=r-t,c=Math.hypot(o,s);if(c<1e-4)return;let l=-s/c*a,u=o/c*a,d=this.mnext*12,f=this.mpos;f[d]=e+l,f[d+1]=i,f[d+2]=t+u,f[d+3]=e-l,f[d+4]=i,f[d+5]=t-u,f[d+6]=n-l,f[d+7]=i,f[d+8]=r-u,f[d+9]=n+l,f[d+10]=i,f[d+11]=r+u,this.mnext=(this.mnext+1)%this.maxMarks,this.mCount=Math.min(this.maxMarks,this.mCount+1),this.markDirty=!0}clear(){this.life.fill(0),this.px.fill(0);for(let e=0;e<this.max;e++)this.px[e*3+1]=-1e3;this.col.fill(0),this.mpos.fill(0),this.mnext=0,this.mCount=0,this.markDirty=!0}emitCar(e,t,n,r,i=`gp`){if(r<=0||t.ghost)return;let a=t.anim,o=cp[i===`speedway`?`speedway`:`gp`],s=om[e.surface],c=Math.abs(e.v),l=Math.sin(n.theta),u=Math.cos(n.theta);if(s&&c>5)for(a.fxDust=(a.fxDust||0)+r*s.rate*Math.min(60,c*1.2);a.fxDust>=1;){--a.fxDust,this.counter++;let t=2+(this.counter&1),r=am(this.counter,e.id),i=am(this.counter+17,e.id);this.emit(sm(n,u,l,o[t])+(r-.5)*.4,n.y+.15,cm(n,u,l,o[t])+(i-.5)*.4,-l*c*.12+(r-.5)*2.5,s.up*(.5+i),-u*c*.12+(i-.5)*2.5,s.life*(.7+.6*r),s.r,s.g,s.b,s.a)}let d=e.lockup||0,f=Math.max(0,(e.wheelSlip||0)-.45)*+(c>20),p=Math.max(d,f*.5);if(p>.25&&!s)for(a.fxSmoke=(a.fxSmoke||0)+r*(8+40*p);a.fxSmoke>=1;){--a.fxSmoke,this.counter++;let t=this.counter&1,r=am(this.counter,e.id+3),i=am(this.counter+5,e.id+3);this.emit(sm(n,u,l,o[t]),n.y+.2,cm(n,u,l,o[t]),-l*c*.06+(r-.5)*1.4,.5+i*1.4,-u*c*.06+(i-.5)*1.4,.35+.35*r,.45,.45,.47,.32*Math.min(1,.4+p))}if(d>.3&&e.surface!==`grass`&&e.surface!==`gravel`)for(let e=0;e<2;e++){let t=sm(n,u,l,o[e]),r=cm(n,u,l,o[e]);a.lastMark&&a.lastMark[e*2]!==void 0&&Math.hypot(t-a.lastMark[e*2],r-a.lastMark[e*2+1])<4?Math.hypot(t-a.lastMark[e*2],r-a.lastMark[e*2+1])>.6&&(this.mark(a.lastMark[e*2],a.lastMark[e*2+1],t,r,n.y+.05,.13),a.lastMark[e*2]=t,a.lastMark[e*2+1]=r):((a.lastMark||=[void 0,void 0,void 0,void 0])[e*2]=t,a.lastMark[e*2+1]=r)}else a.lastMark&&(a.lastMark[0]=a.lastMark[2]=void 0)}};function um(e,t){let n=Mu(e),r=new Float32Array(n*6),i=new Float32Array(n*8),a=new Uint16Array((n-1)*6);for(let e=0;e<n-1;e++){let t=e*2;a.set([t,t+1,t+2,t+1,t+3,t+2],e*6)}let o=new hi;o.setAttribute(`position`,new ti(r,3).setUsage(Ht)),o.setAttribute(`color`,new ti(i,4).setUsage(Ht)),o.setIndex(new ti(a,1));let s=new zi(o,new Di({vertexColors:!0,transparent:!0,opacity:.58,depthWrite:!1,side:2,fog:!1,polygonOffset:!0,polygonOffsetFactor:-8,polygonOffsetUnits:-8}));s.frustumCulled=!1,s.renderOrder=3,s.visible=!1,s.name=`line-guide`;let c={enabled:!1,level:0,reds:0,yellows:0,greens:0,v:0,s:0};return{mesh:s,status:c,n,ahead:140,back:8,update(a,l,u){if(!s.visible)return;Nu(e,t,a,l,u,r,i,n),o.attributes.position.needsUpdate=!0,o.attributes.color.needsUpdate=!0;let d=0,f=0,p=0;for(let e=0;e<n;e++){let t=e*8;i[t+3]<.3||(i[t]>.9&&i[t+1]<.5?d++:i[t]>.9?f++:p++)}c.reds=d,c.yellows=f,c.greens=p,c.v=l,c.s=a,c.level=d>2?2:+(f>2)},setEnabled(e){c.enabled=!!e,s.visible=!!e}}}function dm(e,t){let n=e.n,r=e.length,i=Su(e,t).v,a=e.lineK,o=[],s=t=>e.sectionName((t%n+n)%n);for(let s=0;s<n;s++){let c=!0;for(let e=-14;e<=14&&c;e++){let t=i[(s+e+n)%n];(t<i[s]||t===i[s]&&e<0)&&(c=!1)}if(!c||i[s]>t.vTop*.66)continue;let l=0;for(let t=0;t<Math.floor(200/e.ds);t++)l=Math.max(l,i[(s-t+n)%n]);if(l-i[s]<22)continue;let u=s;for(;(s-u)*e.ds<90&&Math.abs(a[(u-1+n)%n])>Math.abs(a[s])*.3;)u--;o.push({i:s,e:u,sApex:s*e.ds,sEntry:(u*e.ds%r+r)%r})}let c=[];return o.forEach((t,i)=>{let l=o[(i-1+o.length)%o.length];if(o.length>1&&(t.sApex-l.sApex+r)%r<220)return;let u=a[t.i]>0?-1:1;for(let i of[100,50]){let a=((t.sEntry-i)%r+r)%r,o=Math.floor(a/e.ds)%n,l=u>0?e.leftWall[o]:e.rightWall[o];c.push({s:a,metres:i,side:u,d:u*(l+2.2),corner:s(t.i),apex:t.sApex})}}),c.sort((e,t)=>e.s-t.s)}function fm(e,t){let n=dm(e,t),r=new Qf,i=[1,.82,.12],a=[.06,.06,.08],o=[.7,.7,.74];for(let t of n){let n=e.at(t.s,t.d),s=e.thetaAt(t.s)+Math.PI,c=Math.sin(s),l=Math.cos(s),u=(e,t,r)=>[n.x+l*e+c*r,n.y+t,n.z-c*e+l*r],d=1.7,f=(e,t,n,i,a)=>{let o=[u(...e),u(...t),u(...n),u(...i)];r.flatQuad(o[0],o[1],o[2],o[3],a,[c,0,l])};for(let e of[-.6,.6])f([e-.05,0,0],[e+.05,0,0],[e+.05,2,0],[e-.05,2,0],o),f([e-.05,0,-.01],[e+.05,0,-.01],[e+.05,2,-.01],[e-.05,2,-.01],o);f([-1.7/2,2,.02],[d/2,2,.02],[d/2,3.2,.02],[-1.7/2,3.2,.02],i),f([-1.7/2-.06,1.94,.01],[.9099999999999999,1.94,.01],[.9099999999999999,3.2+.06,.01],[-1.7/2-.06,3.2+.06,.01],a);let p=String(t.metres),m=p.length===3?.13:.17,h=-((p.length*3+(p.length-1))*m)/2,g=2+(1.2-5*m)/2;for(let e=0;e<p.length;e++){let t=Hf[p[e]];for(let n=0;n<5;n++)for(let r=0;r<3;r++)if(t[n*3+r]===`1`){let t=h+e*4*m+r*m,i=g+(4-n)*m;f([t,i,.03],[t+m,i,.03],[t+m,i+m,.03],[t,i+m,.03],a)}}}let s=new zi(r.geometry(),new Di({vertexColors:!0,side:2}));return s.name=`brake-boards`,s.frustumCulled=!1,{mesh:s,plan:n}}var pm=e=>()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296},mm=new Map,hm=e=>{if(typeof e!=`number`)return e;let t=mm.get(e);return t||(t=new G(e),mm.set(e,t)),t},gm=class{constructor(){this.p=[],this.c=[]}tri(e,t,n,r){r=hm(r),this.p.push(e[0],e[1],e[2],t[0],t[1],t[2],n[0],n[1],n[2]);for(let e=0;e<3;e++)this.c.push(r.r,r.g,r.b)}quad(e,t,n,r,i){this.tri(e,t,n,i),this.tri(e,n,r,i)}tri3(e,t,n,r,i,a){this.p.push(e[0],e[1],e[2],t[0],t[1],t[2],n[0],n[1],n[2]);for(let e of[hm(r),hm(i),hm(a)])this.c.push(e.r,e.g,e.b)}box(e,t,n,r,i,a,o,s,c=0){let l=Math.cos(o),u=-Math.sin(o),d=Math.sin(o),f=Math.cos(o),p=(o,s,c)=>[e+l*o*r/2+d*c*a/2,t+s*i/2,n+u*o*r/2+f*c*a/2],m=[p(-1,-1,-1),p(1,-1,-1),p(1,1,-1),p(-1,1,-1),p(-1,-1,1),p(1,-1,1),p(1,1,1),p(-1,1,1)];[[4,5,6,7],[1,0,3,2],[5,1,2,6],[0,4,7,3],[3,7,6,2],[0,1,5,4]].forEach((e,t)=>{c&1<<t||this.quad(m[e[0]],m[e[1]],m[e[2]],m[e[3]],typeof s==`function`?s(t):s)})}geometry(){let e=new hi;return e.setAttribute(`position`,new K(this.p,3)),e.setAttribute(`color`,new K(this.c,3)),e.computeVertexNormals(),e}},_m=new zn,vm=new hn,ym=new W,bm=new W(1,1,1),xm=new Yn;function Sm(e,t,n,r,i,a=0,o=1,s=1,c=1){let l=e.index?e.toNonIndexed():e.clone();_m.compose(ym.set(t,n,r),vm.setFromEuler(xm.set(0,a,0)),bm.set(o,s,c)),l.applyMatrix4(_m);let u=hm(i),d=l.attributes.position.count,f=new Float32Array(d*3);for(let e=0;e<d;e++)f[e*3]=u.r,f[e*3+1]=u.g,f[e*3+2]=u.b;return l.setAttribute(`color`,new ti(f,3)),l.deleteAttribute(`uv`),l}function Cm(e,t,n,r){let i=new W().subVectors(t,e),a=new ga(n,i.length(),n).toNonIndexed();vm.setFromUnitVectors(ym.set(0,1,0),i.normalize()),_m.compose(e.clone().add(t).multiplyScalar(.5),vm,bm.set(1,1,1)),a.applyMatrix4(_m);let o=hm(r),s=a.attributes.position.count,c=new Float32Array(s*3);for(let e=0;e<s;e++)c[e*3]=o.r,c[e*3+1]=o.g,c[e*3+2]=o.b;return a.setAttribute(`color`,new ti(c,3)),a.deleteAttribute(`uv`),a}var wm=new ga(1,1,1),Tm=[[`VOLTRIX`,`#e8362b`,`#ffffff`],[`NOVAFUEL`,`#ffd21f`,`#1b1b2a`],[`KRYTON TIRES`,`#15151c`,`#ffd21f`],[`ZENTRA BANK`,`#1f5fd0`,`#ffffff`],[`BLAZEO`,`#ff8a1f`,`#ffffff`],[`MOCHAMAX`,`#6b3b20`,`#ffe9c4`],[`QUBITEL`,`#7a3fd0`,`#e8ffe0`],[`SKYPLUM AIR`,`#1fb6d6`,`#06223a`]];function Em(e){let[t,n,r]=Tm[e%Tm.length],i=document.createElement(`canvas`);i.width=256,i.height=80;let a=i.getContext(`2d`);a.fillStyle=n,a.fillRect(0,0,256,80),a.fillStyle=r,a.fillRect(0,0,256,6),a.fillRect(0,74,256,6);for(let e=0;e<6;e++)a.fillRect(8+e*12,14,7,7);a.font=`bold 40px "Courier New", monospace`,a.textAlign=`center`,a.textBaseline=`middle`;let o=40;for(a.font=`bold ${o}px "Courier New", monospace`;a.measureText(t).width>236&&o>14;)o-=2,a.font=`bold ${o}px "Courier New", monospace`;a.fillText(t,128,46);let s=new fa(i);return s.magFilter=xe,s.minFilter=z,s.generateMipmaps=!1,s.colorSpace=It,s}var J=(e,t,n,r=0)=>[e.px[t]+e.nx[t]*n,e.py[t]+r,e.pz[t]+e.nz[t]*n];function Dm(e,t,n){let r=t.n;for(let i=0;i<r;i++){let a=(i+1)%r,o=n(i),s=n(a);if(!o||!s)continue;let c=o[3];e.tri(J(t,i,o[0],o[2]),J(t,a,s[0],s[2]),J(t,i,o[1],o[2]),c),e.tri(J(t,i,o[1],o[2]),J(t,a,s[0],s[2]),J(t,a,s[1],s[2]),c)}}var Om=`#include <project_vertex>
  #ifdef USE_INSTANCING
    vWDet = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
  #else
    vWDet = (modelMatrix * vec4(transformed, 1.0)).xyz;
  #endif`,km=null;function Am(){if(km)return km;let e=new Uint8Array(262144),t=pm(1337),n=e=>{let n=new Float32Array(e*e);for(let e=0;e<n.length;e++)n[e]=t();return n},r=(e,t,n,r)=>{let i=n/256*t,a=r/256*t,o=Math.floor(i),s=Math.floor(a),c=i-o,l=a-s,u=(n,r)=>e[(r%t+t)%t*t+(n%t+t)%t],d=c*c*(3-2*c),f=l*l*(3-2*l);return(u(o,s)*(1-d)+u(o+1,s)*d)*(1-f)+(u(o,s+1)*(1-d)+u(o+1,s+1)*d)*f},i=[[64,.55],[128,.3],[256,.15]].map(([e,t])=>[n(e),e,t]),a=[[8,.6],[16,.25],[32,.15]].map(([e,t])=>[n(e),e,t]),o=[[4,.7],[8,.3]].map(([e,t])=>[n(e),e,t]),s=(e,t,n)=>Math.min(1,Math.max(0,(e.reduce((e,[i,a,o])=>e+r(i,a,t,n)*o,0)-.5)*2.1+.5));for(let t=0;t<256;t++)for(let n=0;n<256;n++){let r=(t*256+n)*4;e[r]=Math.round(s(i,n,t)*255),e[r+1]=Math.round(s(a,n,t)*255),e[r+2]=Math.round(s(o,n,t)*255),e[r+3]=255}return km=new Hi(e,256,256),km.wrapS=km.wrapT=ye,km.magFilter=z,km.minFilter=Te,km.generateMipmaps=!0,km.anisotropy=4,km.needsUpdate=!0,km}function jm(e,{fine:t=.2,fineScale:n=.6,mid:r=.12,midScale:i=9,coarse:a=.1,coarseScale:o=70,rough:s=0,bump:c=0,patch:l=null,patchAmt:u=0,patch2:d=null,patch2Amt:f=0,vertical:p=!1,slope:m=null,strata:h=null,grid:g=null,courses:_=null}={}){let v=e=>{let t=Array.isArray(e)?{r:e[0],g:e[1],b:e[2]}:hm(e);return`vec3(${t.r.toFixed(4)}, ${t.g.toFixed(4)}, ${t.b.toFixed(4)})`},y=Am();return e.onBeforeCompile=e=>{e.uniforms.tDetail={value:y},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vWDet;`+(m?` varying float vWSlope;`:``)).replace(`#include <project_vertex>`,Om+(m?`
  #ifdef USE_INSTANCING
    vWSlope = 1.0;
  #else
    vWSlope = normalize(mat3(modelMatrix) * objectNormal).y;
  #endif`:``)),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vWDet; uniform sampler2D tDetail;`+(m?` varying float vWSlope;`:``)).replace(`#include <color_fragment>`,`#include <color_fragment>
        vec2 wq = ${p?`vWDet.xz + vWDet.y * vec2(0.37, 0.61)`:`vWDet.xz`};
        float dF = texture2D(tDetail, wq / ${n.toFixed(3)}).r, dM = texture2D(tDetail, wq / ${i.toFixed(3)}).g, dC = texture2D(tDetail, wq / ${o.toFixed(3)}).b;
        diffuseColor.rgb *= (1.0 + (dF - 0.5) * ${(t*2).toFixed(3)}) * (1.0 + (dM - 0.5) * ${(r*2).toFixed(3)}) * (1.0 + (dC - 0.5) * ${(a*2).toFixed(3)});
        ${l?`diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * ${v(l)} * 2.0, smoothstep(0.5, 0.68, dC * 0.6 + dM * 0.4) * ${u.toFixed(3)});`:``}
        ${d?`diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * ${v(d)} * 2.0, smoothstep(0.5, 0.34, dC * 0.5 + dM * 0.5) * ${f.toFixed(3)});`:``}
        ${m?`{
          // per-pixel steepness: broken rock on steep faces only, with horizontal bedding bands (strata)
          float rk = smoothstep(${m.from.toFixed(3)}, ${m.to.toFixed(3)}, 1.0 - vWSlope + (dM - 0.5) * 0.18);
          vec3 rockC = ${v(m.color)} * (0.75 + 0.5 * dF);
          ${h?`rockC *= 1.0 + (texture2D(tDetail, vec2((vWDet.y + (dM - 0.5) * ${(h.scale*.8).toFixed(3)}) / ${h.scale.toFixed(3)}, 0.37)).g - 0.5) * ${h.amt.toFixed(3)};`:``}
          diffuseColor.rgb = mix(diffuseColor.rgb, rockC, rk * ${m.amt.toFixed(3)});
        }`:``}
        ${g?`{
          // paving slab joints in world x/z, faded with distance so they never shimmer
          vec2 gq = abs(fract(vWDet.xz / ${g.size.toFixed(3)} + 0.5) - 0.5) * ${g.size.toFixed(3)};
          float jn = 1.0 - smoothstep(0.02, 0.04, min(gq.x, gq.y));
          diffuseColor.rgb *= 1.0 - jn * ${g.amt.toFixed(3)} * (1.0 - smoothstep(60.0, 160.0, length(vViewPosition)));
        }`:``}
        ${_?`{
          // masonry / cladding courses: bed joints every h in world y, head joints offset half a unit on alternate rows; fade out far away
          float cy = vWDet.y / ${_.h.toFixed(3)}, cRow = floor(cy), cf = fract(cy);
          float bedJ = 1.0 - smoothstep(0.0, 0.06, min(cf, 1.0 - cf));
          float cx = fract((vWDet.x + vWDet.z) / ${(_.h*2.5).toFixed(3)} + mod(cRow, 2.0) * 0.5);
          float headJ = 1.0 - smoothstep(0.0, 0.024, min(cx, 1.0 - cx));
          diffuseColor.rgb *= 1.0 - max(bedJ, headJ) * ${_.amt.toFixed(3)} * (1.0 - smoothstep(40.0, 120.0, length(vViewPosition)));
        }`:``}`),s&&(e.fragmentShader=e.fragmentShader.replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>\n roughnessFactor = clamp(roughnessFactor + (dM - 0.5) * ${(s*2).toFixed(3)}, 0.04, 1.0);`)),c&&(e.fragmentShader=e.fragmentShader.replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
      {
        vec2 wqN = vWDet.xz; float sc = ${n.toFixed(3)};
        float bL = texture2D(tDetail, (wqN + vec2(-0.22, 0.0)) / sc).r;
        float bR = texture2D(tDetail, (wqN + vec2(0.22, 0.0)) / sc).r;
        float bD = texture2D(tDetail, (wqN + vec2(0.0, -0.22)) / sc).r;
        float bU = texture2D(tDetail, (wqN + vec2(0.0, 0.22)) / sc).r;
        normal = normalize(normal + (viewMatrix * vec4((bL - bR), 0.0, (bD - bU), 0.0)).xyz * ${c.toFixed(3)});
      }`))},e.customProgramCacheKey=()=>`wd${t}${n}${r}${i}${a}${o}${s}${c}${l}${u}${d}${f}${p}${m?JSON.stringify(m):``}${h?JSON.stringify(h):``}${g?JSON.stringify(g):``}${_?JSON.stringify(_):``}`,e}function Mm(e,{rubber:t=1,dust:n=[.5,.46,.4],dustAmt:r=.3,bump:i=.5}={}){let a=Am();return e.onBeforeCompile=e=>{e.uniforms.tDetail={value:a},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vWDet; attribute vec4 aRoad; attribute vec2 aRoad2; varying vec4 vRoad; varying vec2 vRoad2;`).replace(`#include <project_vertex>`,Om+`
vRoad = aRoad; vRoad2 = aRoad2;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vWDet; varying vec4 vRoad; varying vec2 vRoad2; uniform sampler2D tDetail;`).replace(`#include <color_fragment>`,`#include <color_fragment>
        vec2 wq = vWDet.xz;
        float rd = vRoad.x, rs = vRoad.y, rHalf = vRoad2.x, rLoad = vRoad2.y, rBrake = vRoad.w;
        float dF = texture2D(tDetail, wq / 2.3).r, dM = texture2D(tDetail, wq / 6.3).g, dC = texture2D(tDetail, wq / 53.0).b;
        float stF = texture2D(tDetail, vec2(rd / 11.0, rs / 380.0)).r;   // ~0.2 m wide, metres long: tyre streaks
        float stW = texture2D(tDetail, vec2(rd / 17.0 + 0.37, rs / 260.0)).g; // lane-wide wear bands
        // resurfaced sections: each stretch of tarmac was laid on a different day
        float sec = floor(rs / 83.0), secH = fract(sin(sec * 91.7 + 3.1) * 43758.5453);
        float tone = (1.0 + (dF - 0.5) * 0.3) * (1.0 + (dM - 0.5) * 0.3) * (1.0 + (dC - 0.5) * 0.3) * (0.86 + secH * 0.28) * (0.9 + stW * 0.2);
        float seam = (1.0 - smoothstep(0.0, 0.16, abs(fract(rs / 83.0) * 83.0 - 0.3))) * 0.22 + (1.0 - smoothstep(0.03, 0.14, abs(rd))) * 0.1;
        vec3 road = diffuseColor.rgb * tone * (1.0 - seam);
        // dusty, sun-bleached edges where nobody drives
        float edge = smoothstep(rHalf - 2.6, rHalf - 0.1, abs(rd)) * (0.55 + 0.9 * dM);
        road = mix(road, road * 1.25 + vec3(${n.map(e=>(e*.05).toFixed(4)).join(`, `)}), edge * ${r.toFixed(3)});
        // rubbered groove on the racing line: twin wheel tracks, heavier where the tyres are loaded
        float off = rd - vRoad.z;
        float lane = exp(-off * off / 3.4);
        float groove = lane * (0.62 - 0.26 * cos(off * 3.9)) * (0.3 + 0.7 * max(rLoad, rBrake)) * (0.55 + 0.9 * stF);
        // braking zones: individual dark streaks laid down by locked / loaded tyres, plus the odd stray mark off line
        float skid = smoothstep(0.56, 0.7, stF) * exp(-off * off / 9.0) * rBrake * 0.85;
        skid += smoothstep(0.69, 0.76, stF) * smoothstep(0.6, 0.75, dC) * 0.35;
        float rub = clamp((groove * 0.85 + skid) * ${t.toFixed(3)}, 0.0, 0.88);
        diffuseColor.rgb = mix(road, vec3(0.016, 0.016, 0.018) * (0.8 + 0.4 * dF), rub);`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor + (dM - 0.5) * 0.2 - rub * 0.22 + edge * 0.05, 0.04, 1.0);`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
        #ifdef ROAD_BUMP
        {
          float bR = texture2D(tDetail, (wq + vec2(0.025, 0.0)) / 2.3).r, bU = texture2D(tDetail, (wq + vec2(0.0, 0.025)) / 2.3).r;
          normal = normalize(normal + (viewMatrix * vec4((dF - bR), 0.0, (dF - bU), 0.0)).xyz * ${i.toFixed(3)} * (1.0 - rub * 0.6));
        }
        #endif`)},e.customProgramCacheKey=()=>`road${t}${n}${r}${i}`,e.defines={...e.defines||{},ROAD_BUMP:``},e.userData.setRoadBump=t=>{t!==`ROAD_BUMP`in e.defines&&(t?e.defines.ROAD_BUMP=``:delete e.defines.ROAD_BUMP,e.needsUpdate=!0)},e}var Nm=null;function Pm(){if(Nm)return Nm;let e=new Uint8Array(16384);for(let t=0;t<64;t++)for(let n=0;n<64;n++){let r=(n+t)%16,i=(n-t+64)%16,a=r<2||i<2,o=t%32<2,s=(t*64+n)*4;e[s]=e[s+1]=e[s+2]=o?150:120,e[s+3]=o?235:a?190:0}return Nm=new Hi(e,64,64),Nm.wrapS=Nm.wrapT=ye,Nm.magFilter=z,Nm.minFilter=Te,Nm.generateMipmaps=!0,Nm.anisotropy=4,Nm.colorSpace=It,Nm.needsUpdate=!0,Nm}var Fm=(e,t)=>{let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)},Im=(e,t)=>{let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,o=i*i*(3-2*i),s=a*a*(3-2*a),c=Fm(n,r),l=Fm(n+1,r),u=Fm(n,r+1),d=Fm(n+1,r+1);return c+(l-c)*o+(u+(d-u)*o-(c+(l-c)*o))*s},Lm=(e,t)=>Im(e,t)*.62+Im(e*2.07+7.1,t*2.07-3.3)*.38,Rm=256,zm=128,Bm=3,Vm=(e,t)=>[(e*zm+Bm)/Rm,(t*zm+Bm)/Rm,((e+1)*zm-Bm)/Rm,((t+1)*zm-Bm)/Rm],Hm={LEAF:Vm(0,0),BOUGH:Vm(1,0),FROND:Vm(0,1),TUFT:Vm(1,1)},Um=null;function Wm(){let e=new Float32Array(Rm*Rm).fill(.72),t=new Float32Array(Rm*Rm),n=(e,t)=>({ox:e*zm,oy:t*zm}),r=(n,r,i,a,o)=>{if(r<Bm||i<Bm||r>=125||i>=125||a<=0)return;let s=(n.oy+i)*Rm+n.ox+r;a>=t[s]?e[s]=o:e[s]=e[s]+(o-e[s])*a,t[s]=Math.max(t[s],a)},i=(e,t,n,i,a,o,s)=>{let c=t*zm,l=n*zm,u=i*zm,d=a*zm,f=Math.max(u,d)+1.5,p=Math.cos(o),m=Math.sin(o);for(let t=Math.floor(l-f);t<=Math.ceil(l+f);t++)for(let n=Math.floor(c-f);n<=Math.ceil(c+f);n++){let i=n+.5-c,a=t+.5-l,o=(i*p+a*m)/u,f=(-i*m+a*p)/d,h=(Math.sqrt(o*o+f*f)-1)*Math.min(u,d);r(e,n,t,Math.min(1,Math.max(0,.5-h)),s)}},a=(e,t,n,i,a,o,s,c)=>{let l=t*zm,u=n*zm,d=i*zm,f=a*zm,p=Math.max(o,s)*zm/2+1.5,m=d-l,h=f-u,g=Math.max(1e-6,m*m+h*h);for(let t=Math.floor(Math.min(u,f)-p);t<=Math.ceil(Math.max(u,f)+p);t++)for(let n=Math.floor(Math.min(l,d)-p);n<=Math.ceil(Math.max(l,d)+p);n++){let i=n+.5-l,a=t+.5-u,d=Math.min(1,Math.max(0,(i*m+a*h)/g)),f=i-m*d,p=a-h*d,_=(o+(s-o)*d)*zm/2;r(e,n,t,Math.min(1,Math.max(0,_+.5-Math.sqrt(f*f+p*p))),c)}},o=pm(4242);{let e=n(0,0);for(let t=0;t<205;t++){let n=o()*Math.PI*2,r=.42*o()**.7,a=t/205;i(e,.5+Math.cos(n)*r,.5+Math.sin(n)*r,.072,.04,o()*Math.PI,.58+.4*a*(.8+.2*o()))}}{let e=n(1,0),t=55*Math.PI/180,r=(n,r,i,s,c,l,u,d,f)=>{for(let p=l;p<=u;p+=d){let d=n+Math.cos(i)*p,m=r+Math.sin(i)*p,h=(p-l)/Math.max(1e-6,u-l),g=s+(c-s)*h;for(let n of[-1,1]){let r=i+n*t;a(e,d,m,d+Math.cos(r)*g,m+Math.sin(r)*g,.026,.012,f+.25*o()+.1*h)}}};for(let t=0;t<6;t++){let n=.1+t*.13,i=t%2?1:-1,s=Math.PI/2+i*(.75+.15*o()),c=.36*(1-n)+.1,l=.5+Math.cos(s)*c,u=.03+n+Math.sin(s)*c;r(.5,.03+n,s,.24*(1-n)+.07,.04,.03,c,.02,.55),a(e,.5,.03+n,l,u,.016,.008,.45)}r(.5,.03,Math.PI/2,.52,.05,0,.92,.014,.62),a(e,.5,.03,.5,.95,.03,.012,.45)}{let e=n(0,1),t=65*Math.PI/180;for(let n=.04;n<.97;n+=.03){let r=.5*Math.sin(Math.PI*n)+.02;for(let a of[-1,1]){let s=Math.PI/2+a*t,c=r*(.85+.15*o());i(e,.5+Math.cos(s)*c/2,n+Math.sin(s)*c/2,c/2,.016,s,.6+.35*o())}}a(e,.5,.02,.5,.98,.028,.008,.55)}{let e=n(1,1);for(let t=0;t<14;t++){let n=Math.PI/2+(t/13*2-1)*(35*Math.PI/180)+(o()-.5)*.1,r=.6+.4*o(),i=(n-Math.PI/2)*.35,s=.5+Math.cos(n)*r*.5,c=.03+Math.sin(n)*r*.5,l=.5+Math.cos(n+i)*r,u=.03+Math.sin(n+i)*r,d=.6+.35*o();a(e,.5+(o()-.5)*.12,.03,s,c,.12,.078,d),a(e,s,c,l,u,.078,.006,d+.05)}}return{shade:e,alpha:t,size:Rm,cell:zm,margin:Bm}}function Gm(){if(Um)return Um;let{shade:e,alpha:t}=Wm(),n=new Uint8Array(Rm*Rm*4);for(let r=0;r<Rm*Rm;r++){let i=Math.round(Math.min(1,Math.max(0,e[r]))*255);n[r*4]=i,n[r*4+1]=i,n[r*4+2]=i,n[r*4+3]=Math.round(t[r]*255)}return Um=new Hi(n,Rm,Rm),Um.colorSpace=It,Um.generateMipmaps=!0,Um.minFilter=Te,Um.magFilter=z,Um.anisotropy=4,Um.wrapS=Um.wrapT=be,Um.needsUpdate=!0,Um}var Km=W,qm=new Km(0,1,0),Jm=()=>({p:[],n:[],uv:[],c:[]}),Ym=(e,t)=>new Km().subVectors(e,t).add(new Km(0,.3,0)).normalize();function Xm(e,t,n,r,i,a,o,s,c){let l=Array.isArray(c)?c[0]:c,u=Array.isArray(c)?c[1]:c,d=n.x*i/2,f=n.y*i/2,p=n.z*i/2,m=r.x*a/2,h=r.y*a/2,g=r.z*a/2,_=[[t.x-d-m,t.y-f-h,t.z-p-g,o[0],o[1],l],[t.x+d-m,t.y+f-h,t.z+p-g,o[2],o[1],l],[t.x+d+m,t.y+f+h,t.z+p+g,o[2],o[3],u],[t.x-d+m,t.y-f+h,t.z-p+g,o[0],o[3],u]];for(let t of[[0,1,2,0,2,3],[0,2,1,0,3,2]])for(let n of t){let t=_[n];e.p.push(t[0],t[1],t[2]),e.n.push(s.x,s.y,s.z),e.uv.push(t[3],t[4]),e.c.push(t[5],t[5],t[5])}}function Zm(e,t,n,r,i,a,o,s,c){let l=[[t,i],[n,a],[r,o]];for(let t of[[0,1,2],[0,2,1]])for(let n of t){let[t,r]=l[n];e.p.push(t.x,t.y,t.z),e.n.push(s.x,s.y,s.z),e.uv.push(r[0],r[1]),e.c.push(c,c,c)}}function Qm(e,t=!0){let n=new hi;return n.setAttribute(`position`,new K(e.p,3)),n.setAttribute(`normal`,new K(e.n,3)),t&&n.setAttribute(`uv`,new K(e.uv,2)),n.setAttribute(`color`,new K(e.c,3)),n}function $m(e=!0){let t=Jm();for(let e=0;e<3;e++)t.p.push(0,.01,0),t.n.push(0,1,0),t.uv.push(.25,.25),t.c.push(1,1,1);return Qm(t,e)}function eh(e,t){let n=e.index?e.toNonIndexed():e;n.attributes.uv&&n.deleteAttribute(`uv`);let r=n.attributes.position,i=new Float32Array(r.count*3);for(let e=0;e<r.count;e++){let n=t(r.getX(e),r.getY(e),r.getZ(e),e);i[e*3]=n,i[e*3+1]=n,i[e*3+2]=n}return n.setAttribute(`color`,new ti(i,3)),n}function th(e,t,n=()=>1,r=()=>1){let i=[],a=[],o=[];e.forEach((e,o)=>{for(let s=0;s<=t;s++){let c=s/t*Math.PI*2;i.push((e.x||0)+Math.cos(c)*e.r,e.y,(e.z||0)+Math.sin(c)*e.r);let l=n(o)*r(s%t);a.push(l,l,l)}});let s=t+1;for(let n=0;n<e.length-1;n++)for(let r=0;r<t;r++){let t=n*s+r,i=t+1,a=t+s,c=a+1;e[n+1].r===0?o.push(t,a,i):o.push(t,a,i,i,a,c)}let c=new hi;return c.setAttribute(`position`,new K(i,3)),c.setAttribute(`color`,new K(a,3)),c.setIndex(o),c.computeVertexNormals(),c.toNonIndexed()}function nh(e,t,n,r,i,a){let o=th([{r:n,y:0},{r,y:1}],i,e=>e?a[1]:a[0]),s=new Km().subVectors(t,e),c=s.length();return o.scale(1,c,1),o.applyQuaternion(new hn().setFromUnitVectors(qm,s.normalize())),o.translate(e.x,e.y,e.z),o}var rh=e=>Zd(e);function ih(e,t){let n=Math.abs(e.y)>.95?new Km(1,0,0):qm,r=new Km().crossVectors(n,e).normalize(),i=new Km().crossVectors(e,r).normalize(),a=Math.cos(t),o=Math.sin(t);return[r.clone().multiplyScalar(a).addScaledVector(i,o),i.clone().multiplyScalar(a).addScaledVector(r,-o)]}var ah=(e,t=0)=>{let n=e.attributes.position;for(let e=0;e<n.count;e++)n.getY(e)<t&&n.setY(e,t);return e},oh=(e,t)=>{let n=1-2*(e+.5)/t,r=Math.sqrt(1-n*n),i=e*2.399963;return new Km(Math.cos(i)*r,n,Math.sin(i)*r)};function sh(e,{h:t=7.4,r:n=2.5,squash:r=.85,shade:i=1,cards:a=26}={}){let o=pm(e*7919+13),s=n*r,c=t-s,l=new Km(0,c,0),u=t*.45,d=.16+n*.06,f=[th([{r:d*1.35,y:0},{r:d,y:u*.5},{r:d*.7,y:u}],6,e=>.8+e*.1)],p=2+Math.floor(o()*2);for(let e=0;e<p;e++){let t=o()*Math.PI*2+e*2.1,r=u*(.75+.2*o());f.push(nh(new Km(0,r,0),new Km(Math.cos(t)*n*.55,r+s*(.7+.3*o()),Math.sin(t)*n*.55),d*.55,d*.25,4,[.85,.95]))}let m=rh(f),h=(e,t,n,i,a,o)=>{let s=new ka(1,a),c=s.attributes.position,l=new Float32Array(c.count*3);for(let a=0;a<c.count;a++){let s=c.getX(a),u=c.getY(a),d=c.getZ(a),f=.8+.4*Im(s*1.7+o,d*1.7+u*1.3+o*.7);l[a*3]=s,l[a*3+1]=u,l[a*3+2]=d,c.setXYZ(a,t+s*f*e,n+u*f*e*r,i+d*f*e)}return s.setAttribute(`normal`,new ti(l,3)),s},g=o()*Math.PI*2,_=eh(rh([h(n*.7,0,c,0,1,e),h(n*.45,Math.cos(g)*n*.45,c-s*.15,Math.sin(g)*n*.45,0,e+3)]),(e,t)=>.45*i*(.85+.25*Math.min(1,Math.max(0,(t-c+s)/(2*s))))),v=Jm(),y=Math.round(a/.8),b=0;for(let e=0;e<y&&b<a;e++){let t=oh(e,y);if(t.y<-.6)continue;b++;let r=new Km((o()-.5)*.15,(o()-.5)*.15,(o()-.5)*.15),a=new Km(t.x*n*.85,c+t.y*s*.85,t.z*n*.85).add(r.multiplyScalar(n)),[u,d]=ih(t.clone().add(new Km(o()-.5,o()-.5,o()-.5).multiplyScalar(Math.tan(35*Math.PI/180)*1.2)).normalize(),o()*Math.PI*2),f=n*(.75+.35*o()),p=i*(.72+.33*((t.y+1)/2))*(.92+.16*o());Xm(v,a,u,d,f,f,Hm.LEAF,Ym(a,l),p)}for(let e=0;e<4;e++){let t=e*Math.PI/4+o()*.3,[a,u]=ih(new Km(Math.cos(t),(o()-.5)*.6,Math.sin(t)).normalize(),o()*Math.PI),d=new Km((o()-.5)*n*.3,c+(o()-.3)*s*.4,(o()-.5)*n*.3);Xm(v,d,a,u,n*1.3,n*1.3*r,Hm.LEAF,Ym(d,l).lerp(qm,.3).normalize(),i*.8)}return{cards:ah(Qm(v),.02),core:_,trunk:m,snow:null,species:`broadleaf`}}function ch(e,{h:t=7.6,r:n=2.2,droop:r=.35,shade:i=1,snow:a=!1}={}){let o=pm(e*104729+7),s=new Km(0,t*.45,0),c=th([{r:.32,y:0},{r:.22,y:t*.3}],5,e=>.8+e*.15),l=n*.55,u=t*.15,d=eh(th([{r:.001,y:u},{r:l,y:u+.05},{r:0,y:t*.97}],6),(e,n)=>.5*i*(.85+.3*(n-u)/(t-u))),f=Jm(),p=Jm();for(let e=0;e<6;e++){let c=e/5,l=u+.35+(t*.86-u-.35)*c**.92,d=n*(1-.8*c)*(.92+.16*o()),m=e%2*(36*Math.PI/180)+o()*.2;for(let t=0;t<5;t++){let n=m+Math.PI*2/5*t+(o()-.5)*.25,u=r*(.8+.4*o()),h=new Km(Math.cos(n)*Math.cos(u),-Math.sin(u),Math.sin(n)*Math.cos(u)),g=new Km(-Math.sin(n),0,Math.cos(n)),_=new Km().crossVectors(g,h).normalize(),v=(t%2?1:-1)*(.8+.3*o()),y=g.clone().multiplyScalar(Math.cos(v)).addScaledVector(_,Math.sin(v)).normalize(),b=d*1.22,x=b*1.05,S=new Km(0,l,0).addScaledVector(h,b*.5),C=Ym(S,s),w=i*(.8+.3*c)*(.92+.16*o());if(Xm(f,S,y,h,x,b,Hm.BOUGH,C,[w*.85,w*1.05]),a&&e>=2){let e=new Km().crossVectors(y,h).normalize();e.y<0&&e.negate(),Xm(p,S.clone().addScaledVector(e,.06).addScaledVector(h,-b*.04),y,h,x*.8,b*.85,Hm.BOUGH,C.clone().lerp(qm,.5).normalize(),1)}}}let m=t*.2,h=n*.45,g=o()*Math.PI;for(let e=0;e<2;e++){let n=g+e*Math.PI/2,r=new Km(Math.cos(n),0,Math.sin(n));Xm(f,new Km(0,t-m/2-.05,0),r,qm,h,m,Hm.BOUGH,new Km(0,1,0),[i*.95,i*1.05])}return{cards:ah(Qm(f),.02),core:d,trunk:c,snow:a?ah(Qm(p),.02):null,species:`conifer`}}function lh(e,{h:t=8,bend:n=.9,fronds:r=10}={}){let i=pm(e*6007+3),a=i()*Math.PI*2,o=Math.cos(a)*n,s=Math.sin(a)*n,c=[];for(let e=0;e<=6;e++){let n=e/6;c.push({r:.4-.18*n,y:n*t,x:o*n*n,z:s*n*n})}let l=th(c,6,e=>e%2?.82:1.02),u=new Km(o,t,s),d=rh([l,eh(th([{r:.3,y:t-.2,x:o,z:s},{r:.42,y:t+.15,x:o,z:s},{r:0,y:t+.55,x:o,z:s}],6),()=>.7)]),f=Jm(),[p,m,h,g]=Hm.FROND,_=(m+g)/2;for(let e=0;e<r;e++){let t=e/r*Math.PI*2+(i()-.5)*.4,n=.35-i()*.5,a=1.7+i()*.5,o=1.1+i()*.3,s=new Km(Math.cos(t),0,Math.sin(t)),c=new Km(-Math.sin(t),0,Math.cos(t)),l=s.clone().multiplyScalar(Math.cos(n)).setY(Math.sin(n)),d=s.clone().multiplyScalar(Math.cos(n-.6)).setY(Math.sin(n-.6)),v=u.clone().add(new Km(0,.2,0)),y=v.clone().addScaledVector(l,a/2),b=v.clone().addScaledVector(l,a).clone().addScaledVector(d,a/2),x=(i()-.5)*.5,S=c.clone().applyAxisAngle(s,x),C=.85+.2*i();Xm(f,y,S,l,o,a,[p,m,h,_],Ym(y,u),[C*.85,C]),Xm(f,b,S,d,o,a,[p,_,h,g],Ym(b,u),[C,C*1.05])}return{cards:ah(Qm(f),.02),core:null,trunk:d,snow:null,species:`palm`}}function uh(e,{r:t=1.8,h:n=1.6,tuftMix:r=0,shade:i=1}={}){let a=pm(e*3571+11),o=n*.5,s=new Km(0,o,0),c=new ka(1,0),l=c.attributes.position;for(let e=0;e<l.count;e++)l.setXYZ(e,l.getX(e)*t*.65,o+l.getY(e)*n*.42,l.getZ(e)*t*.65);c.computeVertexNormals();let u=eh(c,(e,t)=>.45*i*(.85+.3*t/n)),d=Jm();for(let e=0;e<8;e++){let c=e/8*Math.PI*2+a()*.5,l=a()<r,u=new Km(Math.cos(c),.15+a()*.5,Math.sin(c)).normalize(),f=new Km(u.x*t*.55,o+u.y*n*.3,u.z*t*.55),p=i*(.8+.25*a());if(l){let e=new Km(-Math.sin(c),0,Math.cos(c)),r=n*(.8+.4*a());Xm(d,new Km(f.x,r/2,f.z),e,qm,t*1.1,r,Hm.TUFT,Ym(f,s),[p*.8,p*1.05])}else{let[e,r]=ih(u,a()*Math.PI*2),i=t*(.9+.3*a());Xm(d,f,e,r,i,n/t*i*1.1,Hm.LEAF,Ym(f,s),p)}}return{cards:ah(Qm(d),.02),core:u,trunk:$m(!1),snow:null,species:`shrub`}}function dh(e,{h:t=0}={}){let n=pm(e*2741+5),r=t||4.5+n()*2.5,i=.38+n()*.08,a=e=>e%2?.9:1.04,o=[th([{r:i*1.05,y:0},{r:i,y:r*.5},{r:i*.95,y:r-i},{r:i*.67,y:r-i*.32},{r:0,y:r}],10,e=>.82+.06*Math.min(e,3),a)],s=1+Math.floor(n()*3),c=n()*Math.PI*2;for(let e=0;e<s;e++){let t=c+Math.PI*2/s*e+(n()-.5)*.6,l=r*(.3+.25*n()),u=i*(2+n()*.8),d=i*(.62+.12*n()),f=Math.cos(t)*u,p=Math.sin(t)*u,m=Math.min(r-.3,l+r*(.25+.2*n()));o.push(nh(new Km(Math.cos(t)*i*.4,l,Math.sin(t)*i*.4),new Km(f,l+d*1.2,p),d,d,10,[.85,.92])),o.push(th([{r:d,y:l+d*.6,x:f,z:p},{r:d*.95,y:m,x:f,z:p},{r:d*.67,y:m+d*.68,x:f,z:p},{r:0,y:m+d*.95,x:f,z:p}],10,e=>.88+.05*e,a))}return{cards:$m(!0),core:null,trunk:rh(o),snow:null,species:`cactus`}}function fh(e,{h:t=.6,w:n=.9}={}){let r=pm(e*811+1),i=Jm(),a=r()*Math.PI;for(let e=0;e<3;e++){let r=a+e*Math.PI/3,o=new Km(Math.cos(r),0,Math.sin(r)),s=new Km(-Math.sin(r),0,Math.cos(r));Xm(i,new Km(0,t/2,0),o,qm,n,t,Hm.TUFT,s.multiplyScalar(.3).add(qm).normalize(),[.75,1.05])}return{cards:Qm(i),core:null,trunk:null,snow:null}}function ph(e,{h:t=7.4,r:n=2.4}={}){let r=Jm();if(e===`conifer`){let[e,i,a,o]=Hm.BOUGH,s=(e+a)/2;for(let c=0;c<2;c++){let l=c*Math.PI/2,u=new Km(Math.cos(l),0,Math.sin(l)),d=new Km(-Math.sin(l),.3,Math.cos(l)).normalize();Zm(r,new Km(-u.x*n,t*.12,-u.z*n),new Km(u.x*n,t*.12,u.z*n),new Km(0,t,0),[e,i],[a,i],[s,o],d,.85)}for(let e=0;e<4;e++){let i=e/3,a=t*(.25+.5*i),o=n*(1-.7*i),s=e*.8,c=new Km(Math.cos(s),-.35,Math.sin(s)).normalize(),l=new Km(-Math.sin(s),0,Math.cos(s));Xm(r,new Km(0,a,0),l,c,o*1.6,o*2,Hm.BOUGH,new Km(0,1,0),.8+.2*i)}}else{let e=t-n*.85,i=new Km(0,e,0);for(let t=0;t<8;t++){let a=Math.PI*2/8*t*1.618,o=(t%3-1)*.5,s=new Km(Math.cos(a)*Math.cos(o),Math.sin(o),Math.sin(a)*Math.cos(o)),[c,l]=ih(s,t*.9),u=new Km(s.x*n*.35,e+s.y*n*.3,s.z*n*.35);Xm(r,u,c,l,n*1.7,n*1.5,Hm.LEAF,Ym(u,i),.8+t%3*.1)}}return{cards:ah(Qm(r),.02),core:null,trunk:null,snow:null}}var mh={name:`circuitDay`,sky:{top:2056136,bot:9421294,rainTop:5664908,rainBot:10136509,sunGlow:1},fog:[320,1500],sun:{color:16773336,intensity:3.3,dir:[-.55,.75,.45],rainColor:11124184,rainIntensity:1.6},hemi:{sky:11982079,ground:4876858,intensity:.7},ground:{g1:5932092,g2:5208118,far:4746294,rock:9077872,amp:24,rockFrom:34,patch:[.6,.55,.34],patchAmt:.5,patch2:[.4,.47,.36],patch2Amt:.55,hills:{n:12,h:[14,30],r:[70,130]},slope:{color:9077872,from:.1,to:.24,amt:.9},strata:{scale:2.6,amt:.25},grid:null},gravel:[14205324,13481600],road:{color:4935251,rubber:1,dust:[.5,.46,.4],dustAmt:.3,bump:.5},barrier:`mixed`,houses:`farm`,facade:{h:.32,amt:.14},trees:`temperate`,treeNear:130,treeFar:60,treeMaxH:60,treeScale:1,snowbanks:!1,puddles:!1,ambientRain:0,ambientWet:0,rainParticles:!1,buildings:null,neon:!1,wall:null,clouds:!0,night:!1,landmark:`ferris`,sea:null,fx:{sat:1,tint:[1,1,1]},mood:{exposure:.9,bloom:.5,env:.35,envKind:`sky`,asphalt:.86,asphaltEnv:.25,ao:.6,contrast:1.14,sat:1.12,vignette:.2}},hh=(e,t={})=>{let n={...e};for(let[r,i]of Object.entries(t))n[r]=i&&typeof i==`object`&&!Array.isArray(i)&&typeof i!=`function`&&e[r]&&typeof e[r]==`object`&&!Array.isArray(e[r])?{...e[r],...i}:i;return n};function gh(e){if(typeof document>`u`)return new Hi(new Uint8Array([255,255,255,128]),1,1);let t=document.createElement(`canvas`);t.width=t.height=512;let n=t.getContext(`2d`);if(!n?.createRadialGradient?.(0,0,0,0,0,1))return new Hi(new Uint8Array([255,255,255,128]),1,1);for(let t=0;t<4;t++){let r=t%2*256,i=(1-Math.floor(t/2))*256;n.save(),n.beginPath(),n.rect(r,i,256,256),n.clip();let a=14+Math.floor(e()*7),o=Math.round(a*.4),s=Math.round(a*.35);for(let t=0;t<a;t++){let c=t<o?0:t<o+s?1:2,l=c===0?o:c===1?s:a-o-s,u=((c===0?t:c===1?t-o:t-o-s)+.5)/l,d=[.76,.56,.38][c],f=r+256*(.5+(u-.5)*d+(e()-.5)*.06),p=256*([.12,.1,.075][c]+.05*Math.sin(Math.PI*u)+e()*.03),m=i+256*([.72,.58,.45][c]+(e()-.5)*.05),h=n.createRadialGradient(f,m-p*.3,p*.1,f,m,p),g=[.7,.85,.97][c];h.addColorStop(0,`rgba(255,255,255,${g})`),h.addColorStop(.55,`rgba(244,247,252,${g*.75})`),h.addColorStop(1,`rgba(225,232,242,0)`),n.fillStyle=h,n.beginPath(),n.arc(f,m,p,0,Math.PI*2),n.fill()}let c=n.createLinearGradient(0,i+115.2,0,i+215.04);c.addColorStop(0,`rgba(170,184,206,0)`),c.addColorStop(1,`rgba(150,166,192,0.5)`),n.globalCompositeOperation=`source-atop`,n.fillStyle=c,n.fillRect(r,i,256,256),n.globalCompositeOperation=`source-over`,n.restore()}let r=new fa(t);return r.colorSpace=It,r.anisotropy=2,r}function _h(){let e=typeof document<`u`?document.createElement(`canvas`):null,t=e?.getContext?.(`2d`);if(!t?.fillRect)return new Hi(new Uint8Array([120,120,140,255]),1,1);e.width=e.height=256;let n=pm(5);t.fillStyle=`#161a2e`,t.fillRect(0,0,256,256);for(let e=4;e<256;e+=10)for(let r=3;r<256;r+=8){let i=n();t.fillStyle=i<.68?`#22263c`:i<.85?`#e8c27a`:i<.94?`#9fd0ee`:`#e889c4`,t.fillRect(r,e,5,6)}let r=new fa(e);return r.wrapS=r.wrapT=ye,r.colorSpace=It,r.anisotropy=4,r}function vh(r){let a=hh(mh,r),o=new pr,s=[],c=null,l=null,u=null,d=null,f=null,p=null,m=[],h=null,g=null,_={rain:0,wet:0},v={},y={rain:0,sat:1,tint:[1,1,1],time:0,lift:0},b={fogNear:120,fogFar:780},x=2,S=2048,C=null,w=null,T=null,E=null,D=[],O=0,k=null,A=[],j=null,M=null,N=null,ee=[],P=null,F=null,te=null,I=null,ne=[],re=[],ie=[],ae=(e,t,n=0)=>!ie.some(r=>(r.x-e)**2+(r.z-t)**2<(r.r+n)**2),oe=(e,t,n)=>ie.push({x:e,z:t,r:n}),se=[],ce=1.2,le=(e,t,n,r,i,a=4)=>{let o=Math.cos(i),s=-Math.sin(i),c=Math.sin(i),l=Math.cos(i),u=[],d=Math.max(1,Math.ceil(n/a)),f=Math.max(1,Math.ceil(r/a));for(let i=0;i<=d;i++)for(let a=0;a<=f;a++){if(i>0&&i<d&&a>0&&a<f)continue;let p=(i/d-.5)*n,m=(a/f-.5)*r;u.push([e+o*p+c*m,t+s*p+l*m])}return u},ue={hi:0,lo:0},de=(e,t,n,r,i)=>{let a;if(n==null)a=[[e,t],[e+r,t],[e-r,t],[e,t+r],[e,t-r]];else{a=le(e,t,n,r,i);let o=Math.cos(i),s=-Math.sin(i),c=Math.sin(i),l=Math.cos(i),u=Math.max(2,Math.ceil(r/4));for(let i=0;i<=4;i++)for(let d=0;d<=u;d++){let f=(i/4-.5)*n,p=(d/u-.5)*r;a.push([e+o*f+c*p,t+s*f+l*p])}}let o=-1e9,s=1e9;for(let e of a){let t=xe(e[0],e[1]);t>o&&(o=t),t<s&&(s=t)}return{hi:o,lo:s}},fe=(e,t,n,r,i,a=0,o=0)=>{let s=r==null?l.clearance(t,n)>=i+ce+o:le(t,n,r,i,a).every(e=>l.clearance(e[0],e[1])>=ce+o);return s&&(ue=de(t,n,r,i,a),se.push(r==null?{kind:e,x:t,z:n,r:i,y:ue.hi,lo:ue.lo}:{kind:e,x:t,z:n,w:r,l:i,yaw:a,y:ue.hi,lo:ue.lo})),s},pe=(e,t,n,r,i,a,o)=>{let s=ue,c=s.hi-s.lo+.8;c>.9&&e.box(t,s.lo-.8+c/2,n,r,c,i,a,o)},me=(e={})=>new Wa({roughness:.9,metalness:0,...e}),he=(e={})=>me({vertexColors:!0,side:2,...e}),L=e=>(s.push(e),e),ge=(e,t,n,r=!1,i=!0)=>{let a=new zi(L(e.geometry()),t);return a.name=n,a.matrixAutoUpdate=!1,a.updateMatrix(),a.castShadow=r,a.receiveShadow=i,o.add(a),a},_e=(e,t,n=0)=>{let r=l.at(e,t);return r.y+=n,[r.x,r.y,r.z]};function ve(t,n,r){let i=l,a=i.n,o=0xde0b6b3a7640000,s=0;for(let e=0;e<a;e+=3){let r=t-i.px[e],a=n-i.pz[e],c=r*r+a*a;c<o&&(o=c,s=e)}let c=s;for(let e=-3;e<=3;e++){let r=(c+e+a)%a,l=t-i.px[r],u=n-i.pz[r],d=l*l+u*u;d<o&&(o=d,s=r)}let u=t-i.px[s],d=n-i.pz[s],f=u*i.tx[s]+d*i.tz[s],p=(i.py[(s+1)%a]-i.py[(s-1+a)%a])/(2*i.ds);return r.i=s,r.y=i.py[s]+e(f,-i.ds,i.ds)*p,r.dist=Math.sqrt(o),r.d=u*i.nx[s]+d*i.nz[s],r.s=s*i.ds+f,r}let ye={};function be(e,r,i=ye){let o=l;ve(e,r,i);let s=i.dist-o.half[i.i];i.e=s;let c=a.ground.amp*n(110,340,s),u=(Math.sin(e*.011+1.3)*Math.cos(r*.013+.4)*.5+Math.sin(e*.027+r*.019)*.28+Math.sin(r*.045-e*.03)*.12+.3+(Lm(e/150+3.7,r/150-1.9)-.5)*.7)*c+(Math.sin(e*.09)*Math.cos(r*.08)*1.2+(Im(e/34+9.1,r/34+4.3)-.5)*2.4)*n(40,100,s);for(let t=0;t<re.length;t++){let i=re[t],a=e-i.x,o=r-i.z,c=a*a+o*o;if(c>=i.r2)continue;let l=Math.sqrt(c)/i.r*(.82+.36*Im(e/47+i.ph,r/47-i.ph)),d=1-Math.min(1,l*l);u+=i.flat?i.h*n(.05,.3,d)+(d>0?.06*i.h*Im(e/23,r/23)*n(.05,.3,d):0):i.h*d*d+i.h*d*.22*(1-Math.abs(2*Im(e/31+i.ph,r/31)-1))*n(40,120,s)}let d=t(i.y-.15-.45*(1-n(10,26,s)),u,n(24,100,s));if(!a.sea)return d;let f=a.sea.mask(e,r)*n(28,70,s);return t(d,a.sea.level-7,f)}function R(e,t){return l.clearance(e,t)}function xe(e,t){return be(e,t,{})}function Se(r,s){c=r,l=s;let y=s,b=y.n,O=y.length,P=pm(s.seed??7),F=a.ground.hills;if(h=c.fog,g=c.background,c.background=new G(a.sky.bot),c.fog=new xr(a.sky.bot,a.fog[0],a.fog[1]),F&&F.n){let e=pm((s.seed??7)*13+5),n=0,r=0;for(let e=0;e<b;e++)n+=y.px[e],r+=y.pz[e];n/=b,r/=b;let i=y.at(0,y.halfAt(0)+60);for(let o=0;o<400&&re.length<F.n;o++){let o=e()*Math.PI*2,s=60+e()*520,c=n+Math.cos(o)*s,l=r+Math.sin(o)*s,u=t(F.r[0],F.r[1],e()),d=t(F.h[0],F.h[1],e()*e())*(.6+.4*u/F.r[1]);y.clearance(c,l)<u*.3+26||Math.hypot(c-i.x,l-i.z)<u+150||a.sea&&a.sea.mask(c,l)>.02||re.some(e=>Math.hypot(e.x-c,e.z-l)<(e.r+u)*.42)||re.push({x:c,z:l,r:u,r2:u*u,h:d,ph:e()*20,flat:!!F.flat})}}p=new vo(a.hemi.sky,a.hemi.ground,a.hemi.intensity),f=new Fo(a.sun.color,a.sun.intensity),f.userData.dir=new W(...a.sun.dir).normalize(),f.position.copy(f.userData.dir).multiplyScalar(260),f.castShadow=!0,f.shadow.mapSize.set(S,S),Object.assign(f.shadow.camera,{near:20,far:640,left:-90,right:90,top:90,bottom:-90}),f.shadow.bias=-4e-4,f.shadow.normalBias=.25,f.shadow.radius=1.6,f.shadow.blurSamples=8,f.shadow.intensity=.92,o.add(p,f,f.target),v.asphalt=L(Mm(me({vertexColors:!0,side:2,roughness:a.mood.asphalt}),a.road));let te=a.ground;v.terrain=L(jm(he(),{fine:.2,fineScale:5.3,mid:.2,midScale:13,coarse:.16,coarseScale:83,bump:.3,patch:te.patch,patchAmt:te.patchAmt??0,patch2:te.patch2,patch2Amt:te.patch2Amt??0,slope:te.slope||null,strata:te.strata||null,grid:te.grid||null})),v.deco=L(jm(he(),{fine:.07,fineScale:3.1,mid:.1,midScale:7.3,coarse:.07,coarseScale:31,vertical:!0})),v.facade=L(jm(he(),{fine:.07,fineScale:3.1,mid:.1,midScale:7.3,coarse:.07,coarseScale:31,vertical:!0,courses:a.facade})),v.glass=L(me({color:1844784,roughness:.12,metalness:.2,envMapIntensity:1.2})),a.night&&(v.glow=L(new Di({vertexColors:!0}))),v.fence=L(me({map:Pm(),transparent:!0,depthWrite:!1,side:2,roughness:.55,metalness:.5,color:a.night?12106952:10133672})),v.pit=L(jm(me({vertexColors:!0,side:2,roughness:a.mood.asphalt,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),{fine:.16,fineScale:2.3,mid:.14,midScale:5.7,coarse:.12,coarseScale:41,rough:.08,patch:[.38,.38,.39],patchAmt:.5})),v.decal=L(jm(he({polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3}),{fine:.12,fineScale:2.1,mid:.12,midScale:4,coarse:0,coarseScale:50})),v.decal2=L(he({polygonOffset:!0,polygonOffsetFactor:-5,polygonOffsetUnits:-5})),v.gravel=L(jm(he({polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),{fine:.3,fineScale:2.9,mid:.14,midScale:6.1,coarse:.1,coarseScale:23,bump:.4})),v.cloud=L(new Di({vertexColors:!0,fog:!1})),v.tire=L(me()),v.ao=L(new Di({color:0,transparent:!0,opacity:.26,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6,side:2,forceSinglePass:!0})),v.aoInst=L(v.ao.clone()),v.foliage=L(jm(me({vertexColors:!0,roughness:.82}),{fine:.22,fineScale:4.7,mid:.2,midScale:9.1,coarse:.1,coarseScale:37,vertical:!0})),v.trunk=L(jm(me({color:6964262,vertexColors:!0}),{fine:.25,fineScale:.9,mid:.15,midScale:3,coarse:0,vertical:!0})),v.leaf=L(jm(me({vertexColors:!0,map:Gm(),alphaTest:.38,roughness:.8}),{fine:.18,fineScale:4.7,mid:.2,midScale:9.1,coarse:.12,coarseScale:37,vertical:!0})),a.trees===`alpine`&&(v.leafSnow=L(me({color:15922939,map:Gm(),alphaTest:.38,roughness:.85})));let I=new gm,ne=(e,t,n,r,i,a,o=1.6)=>{let s=Math.cos(a),c=-Math.sin(a),l=Math.sin(a),u=Math.cos(a),d=r/2+o,f=i/2+o,p=(r,i)=>[e+s*r+l*i,t+.07,n+c*r+u*i];I.quad(p(-d,-f),p(d,-f),p(d,f),p(-d,f),0)},ie=L(new Ha({side:1,depthWrite:!1,fog:!1,uniforms:{top:{value:new G(a.sky.top)},bot:{value:new G(a.sky.bot)},sunDir:{value:f.userData.dir.clone()},sunAmt:{value:a.sky.sunGlow}},vertexShader:`varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,fragmentShader:`uniform vec3 top; uniform vec3 bot; uniform vec3 sunDir; uniform float sunAmt; varying vec3 vD;
        void main(){
          vec3 d = normalize(vD); float y = d.y;
          vec3 zenith = top * vec3(0.72, 0.82, 1.05);
          vec3 c = mix(bot, zenith, pow(smoothstep(-0.02, 0.72, y), 0.5));
          c = mix(c, bot * vec3(1.05, 1.02, 0.98) + vec3(0.02), exp(-abs(y) * 22.0) * 0.55);
          c = mix(c, bot * 0.82, smoothstep(0.0, -0.25, y));
          float s = max(dot(d, sunDir), 0.0);
          c += vec3(1.0, 0.9, 0.7) * (smoothstep(0.9993, 0.9997, s) * 6.0 + pow(s, 220.0) * 0.5 + pow(s, 9.0) * 0.12) * sunAmt;
          gl_FragColor = vec4(c, 1.0);
        }`}));u=new zi(L(new Ma(1e3,16,10)),ie),u.renderOrder=-10,u.frustumCulled=!1,o.add(u);let le=-760,de=-520;{let e=new Float32Array(115173),t=new Float32Array(115173),r=new Float32Array(38391),i={},s=hm(a.ground.g1),c=hm(a.ground.g2),l=hm(a.ground.far),u=hm(a.ground.rock),d=new G,f=a.sea?hm(a.sea.sand):null;for(let t=0;t<191;t++)for(let n=0;n<201;n++){let a=le+n*8,o=de+t*8,s=t*201+n;e[s*3]=a,e[s*3+1]=be(a,o,i),e[s*3+2]=o,r[s]=i.e}let p=a.trees===`alpine`||a.night;for(let i=0;i<191;i++)for(let o=0;o<201;o++){let m=le+o*8,h=de+i*8,g=i*201+o,_=e[g*3+1],v=r[g],y=e[(i*201+Math.min(200,o+1))*3+1]-e[(i*201+Math.max(0,o-1))*3+1],b=e[(Math.min(190,i+1)*201+o)*3+1]-e[(Math.max(0,i-1)*201+o)*3+1],x=Math.hypot(y,b)/16;d.copy(s).lerp(c,n(.3,.7,Lm(m/61+2.3,h/61-5.1))).lerp(l,n(60,240,v)*(.75+.25*Im(m/130,h/130)));let S=Math.max(n(a.ground.rockFrom,a.ground.rockFrom+22,_)*.8,n(.36,.62,x+(Im(m/19,h/19)-.5)*.16)*.35);d.lerp(u,S),f&&d.lerp(f,n(a.sea.level+3.5,a.sea.level+.5,_)*n(20,34,v)),d.offsetHSL(0,0,(Im(m/27+1.7,h/27+8.2)-.5)*(p?.04:.07)),t[g*3]=d.r,t[g*3+1]=d.g,t[g*3+2]=d.b}let m=[];for(let e=0;e<190;e++)for(let t=0;t<200;t++){let n=e*201+t,r=n+1,i=n+201,a=i+1;m.push(n,i,r,r,i,a)}let h=L(new hi);h.setAttribute(`position`,new ti(e,3)),h.setAttribute(`color`,new ti(t,3)),h.setIndex(m),h.computeVertexNormals();let g=new zi(h,v.terrain);g.name=`terrain`,g.frustumCulled=!1,g.receiveShadow=!0,o.add(g)}let ve=new gm,Se=new gm,Ce=new gm,z=new gm,we=new gm,Te=new gm,Ee=hm(4540493);{let t=new Float32Array(b),n=new Float32Array(b),r=new Float32Array(b);for(let e=0;e<b;e++)t[e]=Math.min(88,Math.sqrt(24/Math.max(1e-4,Math.abs(y.lineK[e]))));let i=Float32Array.from(t);for(let e=0;e<2;e++)for(let e=b-1;e>=0;e--)i[e]=Math.min(i[e],Math.sqrt(i[(e+1)%b]**2+52*y.ds));for(let t=0;t<b;t++){let a=(t+1)%b;n[t]=e((i[t]*i[t]-i[a]*i[a])/(2*y.ds*26),0,1),r[t]=e(Math.abs(y.lineK[t])*i[t]*i[t]/24,0,1)}for(let e=O-64;e<O+30;e+=y.ds){let t=Math.floor((e%O+O)%O/y.ds)%b;n[t]=Math.max(n[t],.45)}let s=y._smooth(n,3),c=y._smooth(r,4),l=[],u=[],d=[],f=[],p=hm(a.road.color),m=(e,t,n)=>{l.push(y.px[e]+y.nx[e]*t,y.py[e],y.pz[e]+y.nz[e]*t),u.push(p.r,p.g,p.b),d.push(t,n,y.line[e],s[e]),f.push(y.half[e],c[e])};for(let e=0;e<b;e++){let t=(e+1)%b,n=e*y.ds,r=(e+1)*y.ds,i=y.half[e],a=y.half[t];m(e,-i,n),m(t,a,r),m(e,i,n),m(e,-i,n),m(t,-a,r),m(t,a,r)}let h=L(new hi);h.setAttribute(`position`,new K(l,3)),h.setAttribute(`color`,new K(u,3)),h.setAttribute(`aRoad`,new K(d,4)),h.setAttribute(`aRoad2`,new K(f,2)),h.computeVertexNormals();let g=new zi(h,v.asphalt);g.name=`asphalt`,g.matrixAutoUpdate=!1,g.updateMatrix(),g.receiveShadow=!0,o.add(g)}Dm(ve,y,e=>y.pitTaper[e]>.02?[y.half[e],y.half[e]+16*y.pitTaper[e],0,Ee]:null);let B=hm(14474454),De=hm(15120924),Oe=hm(12854814);for(let e of[1,-1])Dm(Se,y,t=>e>0&&y.pitTaper[t]>.5?null:e>0?[y.half[t]-.62,y.half[t]-.3,.045,B]:[-y.half[t]+.3,-y.half[t]+.62,.045,B]);Dm(Se,y,e=>y.pitTaper[e]>.5?[y.half[e]+.1,y.half[e]+.5,.045,B]:null),Dm(Se,y,e=>y.pitTaper[e]>.5?[y.half[e]+.1+4.5+3.3,y.half[e]+.1+4.5+3.7,.045,De]:null);{let e=(y.pit.entry%O+O)%O,t=y.halfAt(e);for(let n=0;n<3;n++){let r=e+n*.55,i=n&1?De:B;Se.quad(_e(r,t+.4,.05),_e(r+.5,t+.4,.05),_e(r+.5,t+8.5,.05),_e(r,t+8.5,.05),i)}}let ke=new G,Ae=(e,t,n,r=1)=>(ke.copy(hm(e)).lerp(hm(t),n).multiplyScalar(r),ke.clone()),je=hm(a.ground.g1),Me=hm(a.ground.g2),Ne=hm(a.gravel[0]),Pe=hm(a.gravel[1]),Fe=a.night?.8:.74,Re=(e,t)=>{if(!y.kerb[e]||t>0&&y.pitTaper[e]>.02)return 0;let n=Math.min(1.35,(t>0?y.runL[e]:y.runR[e])-.2);return n<.25?0:n};for(let e of[1,-1]){let n=t=>{let n=e>0?y.pitTaper[t]:0,r=e>0?y.leftWall[t]:y.rightWall[t],i=y.half[t]+16*n,a=Math.max(.3,r-i),o=.5+.5*Math.sin(t*y.ds/7.5),s=.55+.45*Im(t*.21,e*3.3),c=Ae(je,Me,o*.6),l=n>.02||y.squeeze[t],u=l?Ae(5593180,4671821,s):Ae(c,Pe,.62*s,Fe),d=l?Ae(6053731,5264215,s):Ae(c,Pe,.2*s,.93),f=l?Ae(4869200,4211270,s):Ae(c,2765600,.26,.9);return{d:[i,i+Math.min(.7,a*.3),i+Math.min(3.2,a*.62),r,r+4.5],y:[-.004,-.06,-.06,-.06,-.85],c:[u,d,l?d:c,f,l?f:c]}},r=n(0);for(let t=0;t<b;t++){let i=(t+1)%b,a=n(i);for(let n=0;n<4;n++){let o=J(y,t,e*r.d[n],r.y[n]),s=J(y,i,e*a.d[n],a.y[n]),c=J(y,i,e*a.d[n+1],a.y[n+1]),l=J(y,t,e*r.d[n+1],r.y[n+1]);Te.tri3(o,s,c,r.c[n],a.c[n],a.c[n+1]),Te.tri3(o,c,l,r.c[n],a.c[n+1],r.c[n+1])}r=a}for(let t=0;t<b;t++){let n=(t+1)%b,r=Re(t,e),i=Re(n,e);if(!r||!i)continue;let a=((t|0)&1)==1?Oe:B,o=Ae(a,1842206,.42),s=Ae(a,3815992,.5),c=.085,l=(t,n,r,i,a)=>J(y,t,e*(n+r*i),a),u=y.half[t],d=y.half[n],f=l(t,u,r,0,.012),p=l(n,d,i,0,.012),m=l(t,u,r,.2,c),h=l(n,d,i,.2,c),g=l(t,u,r,1,c*.45),_=l(n,d,i,1,c*.45),v=l(t,u,r,1,-.06),x=l(n,d,i,1,-.06);z.tri3(f,p,h,o,o,a),z.tri3(f,h,m,o,a,a),z.quad(m,h,_,g,a),z.quad(g,_,x,v,s)}for(let n=0;n<b;n++){let r=(n+1)%b,i=t=>{if(!y.gravel[t]||e>0&&y.pitTaper[t]>.02)return null;let n=y.half[t]+1.6,r=y.half[t]+(e>0?y.runL[t]:y.runR[t]);return r<n+.3?null:[n,r]},a=i(n),o=i(r);if(!a||!o)continue;let s=.94+.12*Im(n*.37,e*5.1),c=Ae(Ne,Pe,.5,s*1.04),l=Ae(Pe,6971992,.3,s*.86),u=t(a[0],a[1],.6),d=t(o[0],o[1],.6),f=J(y,n,e*a[0],-.03),p=J(y,r,e*o[0],-.03),m=J(y,r,e*d,-.03),h=J(y,n,e*u,-.03),g=J(y,r,e*o[1],-.03),_=J(y,n,e*a[1],-.03);we.quad(f,p,m,h,c),we.tri3(h,m,g,c,c,l),we.tri3(h,g,_,c,l,l)}}for(let e=0;e<2;e++)for(let t=-9;t<9;t++){let n=-.6+e*.6,r=t+e&1?1118481:16316664;Ce.quad(_e(n,t,.045),_e(n+.6,t,.045),_e(n+.6,t+1,.045),_e(n,t+1,.045),r)}for(let e=0;e<10;e++){let t=Math.floor(e/2),n=e%2,r=O-10-t*9-n*4.5,i=n?-3.2:3.2,a=r+3;Se.quad(_e(a,i-1.3,.05),_e(a+.6,i-1.3,.05),_e(a+.6,i+1.3,.05),_e(a,i+1.3,.05),B);for(let e of[-1.3,1.3])Se.quad(_e(a-1.5,i+e-.25,.05),_e(a,i+e-.25,.05),_e(a,i+e+.25,.05),_e(a-1.5,i+e+.25,.05),B)}for(let e=0;e<10;e++){let t=(y.boxU(e)%O+O)%O,n=y.halfAt(t);for(let e of[-6.5,6.5])Se.quad(_e(t+e-.3,n+8,.05),_e(t+e+.3,n+8,.05),_e(t+e+.3,n+16,.05),_e(t+e-.3,n+16,.05),B);let r=jd[e].c1;Se.quad(_e(t-5,n+10.2,.04),_e(t+5,n+10.2,.04),_e(t+5,n+12.8,.04),_e(t-5,n+12.8,.04),r)}if(ge(Te,v.terrain,`verge`),ge(ve,v.pit,`pitlane`),ge(Se,v.decal,`markings`),ge(Ce,v.decal2,`startline`).renderOrder=1,ge(z,v.decal,`kerbs`),ge(we,v.gravel,`gravel`),a.puddles){let e=new gm,t=[hm(1454148),hm(1982548),hm(1189944)];for(let n=4;n<b;n+=6){let r=(n&2?1:-1)*y.half[n]*.42,i=1.5+n%5*.28,a=2.8+n%4*.45,o=n*y.ds;e.quad(_e(o,r-i,.055),_e(o+a,r-i*.8,.055),_e(o+a,r+i*.85,.055),_e(o,r+i,.055),t[n%3])}ge(e,v.decal2,`puddles`)}let ze=new gm,Be=[hm(12566715),hm(11711406)],Ve=[hm(9078397),hm(7828331),hm(9670276),hm(7104608)],He=hm(10657170),Ue=[hm(2765124),hm(3423310),hm(2370106)],We=[12726306,2052788,14464032,1776934,14211284,2463410,13922844,6437040,2919496].map(hm),Ge=.6,Ke=[hm(11844288),hm(9344155),hm(7106936)],qe=[],Je=[],Ye=e=>{let t=Math.sin(e*91.7+(s.seed??7)*3.1)*43758.5453;return t-Math.floor(t)},Xe=e=>Math.abs(i(e*y.ds,O))<260,Ze=(e,t)=>a.wall===`city`&&y.runoff[e]<12?`city`:y.runoff[e]<6?`stone`:a.barrier!==`mixed`||y.runoff[e]<13||Xe(e)||Ye(Math.floor(e/28)*2+ +(t>0))<.42?`conc`:`armco`;for(let e of[1,-1]){let r=t=>e>0?y.leftWall[t]:y.rightWall[t],i=(e,t,n,r,i,a,o,s=o)=>{let c=J(y,e,n,i),l=J(y,t,r,i),u=J(y,t,r,a),d=J(y,e,n,a);ze.tri3(c,l,u,o,o,s),ze.tri3(c,u,d,o,s,s)},a=(e,t,n,r,i,a,o,s)=>ze.quad(J(y,e,n,o),J(y,t,r,o),J(y,t,a,o),J(y,e,i,o),s);for(let o=0;o<b;o++){let s=(o+1)%b;if(e>0&&(y.pitTaper[o]>.02||y.pitTaper[s]>.02))continue;let c=Ze(o,e),l=r(o),u=r(s);if(c===`armco`){for(let[t,n]of[[.3,.6],[.68,.98]]){let r=(t+n)/2;ze.quad(J(y,o,e*l,t),J(y,s,e*u,t),J(y,s,e*(u-.07),r),J(y,o,e*(l-.07),r),Ke[1]),ze.quad(J(y,o,e*(l-.07),r),J(y,s,e*(u-.07),r),J(y,s,e*u,n),J(y,o,e*l,n),Ke[0])}if(!(o&1)){let t=J(y,o,e*(l+.09),0);ze.box(t[0],t[1]+.45,t[2],.16,1.15,.12,y.theta[o],Ke[2],32)}continue}let d=c===`city`,f=c===`stone`,p=e=>d?t(2.6,4.6,n(12,5.2,y.runoff[e])):f?t(1.1,3.2,n(6,2,y.runoff[e])):1.1,m=p(o),h=c===Ze(s,e)?p(s):m,g=d?Ue[(o>>2)%3]:f?Ve[((o>>1)+(Math.floor(m)&1)*2+o*7%3)%4]:Be[o>>2&1],_=Ae(g,d?790036:4867646,.55),v=d?.55:f?1:.45,x=Ae(g,2105894,.3);if(d||i(o,s,e*l,e*u,-.1,.22,_,g),c===`conc`){i(o,s,e*l,e*u,.22,Ge,g);let t=Math.floor(o/12)+(e>0?3:0),n=o%12==0?hm(1711138):We[t*7%We.length];i(o,s,e*l,e*u,Ge,1.1,n),a(o,s,e*l,e*u,e*(l+v),e*(u+v),1.1,hm(9342860)),i(o,s,e*(l+v),e*(u+v),-.9,1.1,x,g);let r=e*(l+.3),c=e*(u+.3),d=o*y.ds/1.3,f=(o+1)*y.ds/1.3,p=3.5,m=J(y,o,r,1.1),h=J(y,s,c,1.1),_=J(y,s,c,p),b=J(y,o,r,p),S=J(y,s,e*(u-.4),4.1),C=J(y,o,e*(l-.4),4.1);qe.push(...m,...h,..._,...m,..._,...b,...b,..._,...S,...b,...S,...C),Je.push(d,0,f,0,f,2.4/1.3,d,0,f,2.4/1.3,d,2.4/1.3,d,0,f,0,f,.7,d,0,f,.7,d,.7),o&1||(ze.box(m[0],m[1]+2.4/2,m[2],.1,2.4,.1,y.theta[o],Ke[2],32),ze.quad(J(y,o,r+e*.05,p),J(y,o,r-e*.05,p),J(y,o,e*(l-.45),4.12),J(y,o,e*(l-.35),4.16),Ke[2]))}else{if(d){let t=Ae(Ue[(o>>2)%3],9080992,.4);if(i(o,s,e*l,e*u,-.1,1,_,t),!(o&3)){let t=J(y,o,e*(l-.02),.22),n=J(y,s,e*(u-.02),.22),r=.12;ze.quad(t,[t[0]+(n[0]-t[0])*r,t[1],t[2]+(n[2]-t[2])*r],[t[0]+(n[0]-t[0])*r,1+t[1]-.22,t[2]+(n[2]-t[2])*r],[t[0],1+t[1]-.22,t[2]],1711656)}let n=Math.floor(o/12)+(e>0?5:0),r=o%12==0;if(i(o,s,e*l,e*u,1,m-.12,r?hm(1316380):Ae(We[n*7%We.length],0,.25)),i(o,s,e*l,e*u,m-.12,m,hm(11844294)),m>=3.5){let t=e*(l+.27),n=e*(u+.27),r=o*y.ds/1.3,i=(o+1)*y.ds/1.3,a=1.6,c=a/1.3,d=J(y,o,t,m),f=J(y,s,n,h),p=J(y,s,n,h+a),g=J(y,o,t,m+a);qe.push(...d,...f,...p,...d,...p,...g),Je.push(r,0,i,0,i,c,r,0,i,c,r,c),o&1||ze.box(d[0],d[1]+a/2,d[2],.1,a,.1,y.theta[o],Ke[2],32)}}else i(o,s,e*l,e*u,.22,m,g,(Ze(s,e),g));Math.abs(h-m)>.01&&ze.tri3(J(y,o,e*l,m),J(y,s,e*u,m),J(y,s,e*u,h),g,g,g);let t=d&&o>>3&1?hm(16722902):d?hm(1316896):He;ze.quad(J(y,o,e*l,m),J(y,s,e*u,h),J(y,s,e*(u+v),h),J(y,o,e*(l+v),m),t);let n=J(y,o,e*(l+v),-.9),r=J(y,s,e*(u+v),-.9);ze.quad(n,r,J(y,s,e*(u+v),h),J(y,o,e*(l+v),m),x)}}Dm(I,y,t=>{if(e>0&&y.pitTaper[t]>.02)return null;let n=e>0?y.leftWall[t]:y.rightWall[t];return e>0?[n-1.8,n,.06,0]:[-n,-n+1.8,.06,0]})}if(ge(ze,v.deco,`walls`,!0,!0),qe.length){let e=L(new hi);e.setAttribute(`position`,new K(qe,3)),e.setAttribute(`uv`,new K(Je,2)),e.computeVertexNormals();let t=new zi(e,v.fence);t.name=`fence`,t.matrixAutoUpdate=!1,t.updateMatrix(),t.renderOrder=2,o.add(t)}if(a.snowbanks){let e=new gm,t=[hm(16251903),hm(14149366),hm(15660283)];for(let n of[1,-1])for(let r=0;r<b;r++){let i=(r+1)%b;if(n>0&&(y.pitTaper[r]>.02||y.pitTaper[i]>.02))continue;let a=n>0?y.leftWall[r]:y.rightWall[r],o=n>0?y.leftWall[i]:y.rightWall[i],s=n*(a+.5),c=n*(a+5.4),l=n*(o+.5),u=n*(o+5.4),d=t[(r>>2)%3];e.quad(J(y,r,s,1.55),J(y,i,l,1.55),J(y,i,u,.05),J(y,r,c,.05),d),e.quad(J(y,r,s,.02),J(y,r,s,1.55),J(y,i,l,1.55),J(y,i,l,.02),t[0])}ge(e,v.deco,`snowbanks`,!0,!0)}{let e=[];for(let n=0;n<b;n+=1){if(!y.kerb[n]||y.runoff[n]<8)continue;let r=y.kappaS[n]>0?-1:1;if(r>0&&y.pitTaper[n]>.02)continue;let i=r>0?y.leftWall[n]:y.rightWall[n];for(let a=0;a<2;a++){let o=(n+1)%b,s=a*.5,c=t(y.px[n]+y.nx[n]*r*(i-.6),y.px[o]+y.nx[o]*r*(i-.6),s),l=t(y.pz[n]+y.nz[n]*r*(i-.6),y.pz[o]+y.nz[o]*r*(i-.6),s);e.push([c,t(y.py[n],y.py[o],s),l,n*2+a])}}let n=new Zi(L(new va(.58,.58,.5,8)),v.tire,e.length*3),r=new zn,i=new G,a=[16119285,15083039,2763312,2763312];e.forEach(([e,t,o,s],c)=>{for(let l=0;l<3;l++)r.makeTranslation(e,t+.25+l*.5,o),n.setMatrixAt(c*3+l,r),n.setColorAt(c*3+l,i.setHex(a[(s+l)%4]))}),n.frustumCulled=!1,n.castShadow=!0,n.receiveShadow=!0,o.add(n)}let V=new gm,H=new gm,Qe=new gm,$e=a.night?new gm:null,et=new gm,tt=new gm,nt=a.night?new gm:null,rt=pm((s.seed??7)*23+11),it=()=>{let e=rt();return e<.35?1711658:e<.85?15251552:10473710},at=(e,t,n,r,i,a,o,s=!1)=>{$e?(s?nt:$e).box(e,t,n,r,i,a,o,it(),48):(s?tt:Qe).box(e,t,n,r,i,a,o,16777215,48)};function ot(e,t,n,r,i,a,o,s,c,l,u=!0,d=15262938,f=!1){let p=r<0?-1:1;for(let m=0;m<l;m++){let h=i+(m+.5)/l*(a-i),g=(t,i)=>n===`a`?e(r+p*t,i,h):e(h,i,r+p*t),_=(e,t,r)=>n===`a`?[e,t,r]:[r,t,e],v=g(.08,o);if(at(v[0],v[1],v[2],..._(.04,c,s),t,f),!u)continue;let y=g(.04,o);et.box(y[0],y[1],y[2],..._(.08,c+.16,s+.16),t,d,32);let b=g(.1,o-c/2-.1);et.box(b[0],b[1],b[2],..._(.2,.12,s+.34),t,d)}}let st=[15223370,3899350,15913034,16250871,4899450,10181078,16751164,2961210,16736162,3526864],ct=[15845792,14262899,11038794,8014381],lt=[],ut=[];{let e=y.halfAt(0),t=y.thetaAt(0),n=7173248;for(let r of[1,-1]){let i=y.at(0,r*(e+2.5));V.box(i.x,i.y+5,i.z,1.6,10,1.6,t,n)}let r=y.at(0,0);V.box(r.x,r.y+9.4,r.z,(e+2.5)*2+1.6,2.6,1.8,t,n),V.box(r.x,r.y+7.9,r.z,(e+2.5)*2,.5,1.2,t,15921906);for(let e=0;e<5;e++){let n=(e-2)*3,r=y.at(-1,n);V.box(r.x,r.y+9.6,r.z,2.6,2.2,.4,t,1842982);let i=L(new Aa(1.7,1.7)),a=L(new Di({color:3804170,fog:!1})),s=new zi(i,a);s.position.set(r.x,r.y+9.6,r.z),s.rotation.y=t+Math.PI;let c=new W(Math.sin(t),0,Math.cos(t));s.position.addScaledVector(c,-.22),o.add(s),m.push(a)}}function dt(e,t,n,r,i){let a=1.15,o=y.at(e,t),s=y.thetaAt(e),c=Math.cos(s),l=-Math.sin(s),u=Math.sin(s),d=Math.cos(s),f=r*2;if(!fe(`stand`,o.x+c*(f/2+1)*i,o.z+l*(f/2+1)*i,f+5,n+3,s))return!1;o.y=ue.hi,pe(V,o.x+c*(f/2+.5)*i,o.z+l*(f/2+.5)*i,f+5,n+3,s,9277593);let p=(e,t,n)=>[o.x+c*e*i+u*n,o.y+t,o.z+l*e*i+d*n];for(let e=0;e<r;e++){let t=e*2;V.box(o.x+c*(t+1)*i,o.y+(e+1)*a/2,o.z+l*(t+1)*i,2,(e+1)*a,n,s,t=>t===4?e&1?12764362:11843262:e&1?4872824:4082792,32);for(let r=.5;r<n-.5;r+=1.05){if(Math.abs((r+6)%12-6)<.9){r%12<1.05&&V.box(o.x+c*(t+1)*i+u*(r-n/2),o.y+(e+1)*a+.03,o.z+l*(t+1)*i+d*(r-n/2),2,.06,1.3,s,7238268,32);continue}if(P()<.07)continue;let f=p(t+1,(e+1)*a,r-n/2);lt.push([f[0],f[1],f[2],s,P()<.5?st[Math.floor(P()*st.length)]:st[(Math.floor(r/6)+e)%st.length],ct[Math.floor(P()*ct.length)]])}}let m=r*2,h=r*a+3.6;V.box(o.x+c*(m+.35)*i,o.y+(h-.4)/2,o.z+l*(m+.35)*i,.5,h-.4,n+.6,s,8225420);for(let e of[-1,1]){let t=e*(n/2+.15),i=r*a+1.1;V.quad(p(0,0,t),p(m+.3,0,t),p(m+.3,i,t),p(0,1.1,t),9080472)}let g=m+1.4,_=m*.18,v=h,b=h+1.5;V.quad(p(g,v,-n/2-1),p(g,v,n/2+1),p(_,b,n/2+1),p(_,b,-n/2-1),14277600),V.quad(p(g,v+.3,-n/2-1),p(g,v+.3,n/2+1),p(_,b+.3,n/2+1),p(_,b+.3,-n/2-1),12896464),V.quad(p(_,b-.35,-n/2-1),p(_,b-.35,n/2+1),p(_,b+.45,n/2+1),p(_,b+.45,-n/2-1),2777016),V.quad(p(g,v-.6,-n/2-1),p(g,v-.6,n/2+1),p(g,v+.3,n/2+1),p(g,v+.3,-n/2-1),10330538);let x=Math.max(2,Math.round(n/10));for(let e=0;e<=x;e++){let t=-n/2+e/x*n;if(V.box(o.x+c*(m+.5)*i+u*t,o.y+h/2,o.z+l*(m+.5)*i+d*t,.45,h,.45,s,5593702),V.quad(p(m+.5,v-2.4,t),p(m+.5,v-.05,t),p(_+.6,b-.1,t),p(_+.6,b-.45,t),4869978),e<x){let r=-n/2+(e+1)/x*n,i=m+.78;V.quad(p(i,.4,t),p(i,.75,t),p(i,h-.6,r),p(i,h-.95,r),5922666)}}for(let e=-n/2+12;e<n/2-4;e+=24)V.quad(p(m+.08,r*a,e-1),p(m+.08,r*a,e+1),p(m+.08,r*a+2.2,e+1),p(m+.08,r*a+2.2,e-1),1447966),V.quad(p(m+.62,0,e-1),p(m+.62,0,e+1),p(m+.62,2.4,e+1),p(m+.62,2.4,e-1),1447966);V.box(o.x+c*-.75*i,o.y+1.25,o.z+l*-.75*i,.08,.08,n,s,10133672);for(let e=-n/2;e<=n/2+.01;e+=n/Math.max(2,Math.round(n/6)))V.box(o.x+c*-.75*i+u*e,o.y+.65,o.z+l*-.75*i+d*e,.08,1.3,.08,s,10133672,32);for(let e=-n/2+4;e<n/2-4;e+=8){let t=jd[Math.floor(P()*jd.length)];V.box(o.x+c*-.3*i+u*e,o.y+1.6,o.z+l*-.3*i+d*e,.3,1.3,7,s,t.c1),V.box(o.x+c*-.35*i+u*e,o.y+1.6,o.z+l*-.35*i+d*e,.3,.4,7,s,t.c2)}let S=o.x+m/2*c*i,C=o.z+m/2*l*i;ne(S,o.y,C,m+3,n+2,s,1.4),oe(S,C,n/2+m);for(let e=-n/2+3;e<n/2;e+=14)ut.push([o.x+c*(m+1.2)*i+u*e,o.y+h+.3,o.z+l*(m+1.2)*i+d*e,s,P()]);return!0}dt(-30,-(y.halfAt(0)+18),140,7,-1),dt(60,-(y.halfAt(0)+18),70,5,-1);for(let[e,t,n]of[[600,1,60],[1470,-1,50]]){let r=Math.floor(e/y.ds)%b;for(let i of[14,20,28,40])if(dt(e,t*((t>0?y.leftWall[r]:y.rightWall[r])+i),n,4,t))break}{let e=y.halfAt(0),t=e+19,n=y.at(-10,t+9),r=y.thetaAt(0);se.push({kind:`pitbuilding`,x:n.x,z:n.z,w:20,l:217,yaw:r,exempt:!0});let i=y.at(-10,t),a=Math.hypot(i.x-n.x,i.z-n.z)||1,o=(i.x-n.x)/a,s=(i.z-n.z)/a,c=Math.sin(r),l=Math.cos(r),u=(e,t,r)=>[n.x+o*e+c*r,n.y+t,n.z+s*e+l*r],d=(e,t,n,i,a,o,s,c,l)=>{let d=u(t,n,i);e.box(d[0],d[1],d[2],a,o,s,r,c,l)},f=e=>{let r=y.at(e,t);return(r.x-n.x)*c+(r.z-n.z)*l};d(H,0,3,0,18,6,215,14080220),d(H,0,.3,0,18.3,.6,215.3,10133158),V.box(n.x,n.y+6.3,n.z,20,.6,217,r,3817808);let p=jd.map((e,t)=>f(y.boxU(t))).sort((e,t)=>e-t),m=[-107.2,107.2];for(let e=0;e+1<p.length;e++)m.push((p[e]+p[e+1])/2);for(let e of m)d(H,9.2,3,e,.5,6,.6,12896204,32);if(d(H,0,8.1,0,12,3,211,14869736),$e)for(let e=-102;e<=102.1;e+=3){let t=u(6.04,8.1,e);at(t[0],t[1],t[2],.06,1.9,2.84,r)}else d(Qe,6.04,8.1,0,.06,1.9,209,16777215,48);for(let e=-103.5;e<=103.6;e+=3)d(et,6.08,8.1,e,.12,2,.16,5264991,48);d(H,.6,9.75,0,14.4,.3,213.4,3817808),d(H,7.75,9.65,0,.3,.6,213.4,2303790),d(H,8.8,7.65,0,.08,.08,213,11844288);for(let e=-106;e<=106.1;e+=4)d(et,8.8,7.12,e,.08,1.05,.08,11844288,48);for(let e of[-1,1])d(H,6.2,1.15,e*107.55,1.3,2.3,.1,3817288),d(H,6.2,2.4,e*107.6,1.7,.16,.2,15262938),ot(u,r,`f`,e*107.5,-7,3.5,3.4,1.5,1.3,3),d(H,-7.6,3,e*107.53,1,6,.06,9409950),ot(u,r,`f`,e*105.5,-4.5,4.5,8.1,1.6,1.4,2);ot(u,r,`a`,-9,-100,100,4.6,1.4,1,24);for(let e of[-80,-40,0,40,80])d(H,-9.05,1.8,e,.1,3.6,5,8291468),d(H,-9.1,3.75,e,.2,.3,5.4,5264991);ne(n.x,n.y,n.z,20,217,r,2),oe(n.x,n.z,120);let h=y.at(-10,t+12),g=(h.x-n.x)*c+(h.z-n.z)*l;if(d(H,3,9.5,g,12,5,40,14541546),$e)for(let e=-17.5;e<=17.6;e+=2.5){let t=u(9.04,9.9,g+e);at(t[0],t[1],t[2],.06,3.4,2.34,r)}else d(Qe,9.04,9.9,g,.06,3.4,39.2,16777215,48);for(let e=-18.75;e<=18.8;e+=2.5)d(et,9.08,9.9,g+e,.12,3.5,.16,5264991,48);d(H,3.6,12.2,g,14.4,.4,42,4871528),d(H,3.6,12.55,g,14.6,.3,4,15083039);for(let e of[-1,1])d(H,0,14.6,g+e*15,.16,4.4,.16,10133672),d(H,0,16.9,g+e*15,.3,.2,.3,15083039);jd.forEach((n,i)=>{let a=y.boxU(i),o=y.at(a,t-.15);V.box(o.x,o.y+1.9,o.z,.4,3.8,11.5,r,1316380),V.box(o.x,o.y+4.2,o.z,.5,.9,11.5,r,n.c1),V.box(o.x,o.y+4.9,o.z,.55,.3,11.5,r,n.c2);let s=y.at(a,e+12.5);V.box(s.x,s.y+.4,s.z,1.4,.8,1.4,r,n.c1);let c=y.at(a,t+9);V.box(c.x,c.y+10.6,c.z,3,1.4,4,r,12173e3),V.box(c.x,c.y+11.5,c.z,1.2,.4,1.2,r,n.c2),ut.push([y.at(a,t-1).x,y.at(a,t-1).y+6.6,y.at(a,t-1).z,r,i/10])});for(let e=0;e<7;e++){let n=-80+e*38,i=y.at(n,t+32+e%2*8),a=jd[e%jd.length];fe(`tent`,i.x,i.z,10,15,r)&&(i.y=ue.hi,pe(V,i.x,i.z,10,15,r,14343651),V.box(i.x,i.y+1.6,i.z,9,3.2,14,r,16053492),V.box(i.x,i.y+3.5,i.z,10,.8,15,r,a.c1),ne(i.x,i.y,i.z,9,14,r,1.3))}let _=y.at(150,t+13);se.push({kind:`tower`,x:_.x,z:_.z,w:9,l:9,yaw:r,exempt:!0});{let e=Math.cos(r),t=-Math.sin(r),n=(n,r,i)=>[_.x+e*n+c*i,_.y+r,_.z+t*n+l*i],i=(e,t,i,a,o,s,c,l,u)=>{let d=n(t,i,a);e.box(d[0],d[1],d[2],o,s,c,r,l,u)};i(H,0,.75,0,5.8,1.5,5.8,10133158),i(H,0,10.5,0,5,18,5,14343910);for(let[e,t]of[[-1,-1],[-1,1],[1,-1],[1,1]])i(H,e*2.45,10.5,t*2.45,.6,18,.6,12896204,32);for(let e of[-1,1])i(Qe,e*2.52,11,0,.06,14,.8,16777215,48),i(Qe,0,11,e*2.52,.8,14,.06,16777215,48);i(H,0,19.7,0,8.4,.4,8.4,5264991),i($e||Qe,0,21.4,0,7.4,3,7.4,$e?9071684:16777215,32);for(let[e,t]of[[-1,-1],[-1,1],[1,-1],[1,1]])i(H,e*3.65,21.4,t*3.65,.3,3,.3,2764600);i(et,0,20.15,0,7.5,.5,7.5,2764600);for(let e of[-1.85,0,1.85])for(let t of[-1,1])i(et,t*3.67,21.4,e,.12,3,.12,2764600,32),i(et,e,21.4,t*3.67,.12,3,.12,2764600,32);i(H,0,23.2,0,8.6,.6,8.6,15083039);for(let e of[-1,1])i(H,e*4.1,20.95,0,.07,.07,8.3,11844288),i(H,0,20.95,e*4.1,8.3,.07,.07,11844288);for(let[e,t]of[[-1,-1],[-1,1],[1,-1],[1,1]])i(H,e*4.1,20.45,t*4.1,.07,1,.07,11844288);i(H,1.5,25.1,1.5,.15,3.2,.15,10133672),i(H,1.5,26.85,1.5,.35,.35,.35,15083039)}ne(_.x,_.y,_.z,8,8,r,1.4)}{let e=-1,t=0;for(let t=0;t<b;t++)if(y.sectionName(t)===`Citadel Squeeze`){e=t;break}if(e>=0){for(let n=e;n<b;n++)if(y.sectionName(n)!==`Citadel Squeeze`){t=n;break}let n=e*y.ds+18,r=y.thetaAt(n),i=y.halfAt(n)+1.1,a=i+2.5;for(let e of[1,-1])for(let t of[3.2,4.5,6,8,11]){let o=Math.max(e>0?y.leftWall[Math.floor(n/y.ds)%b]:y.rightWall[Math.floor(n/y.ds)%b],i)+t,s=y.at(n,e*o);if(fe(`gatehouse`,s.x,s.z,5,5,r)){a=Math.max(a,o),s.y=ue.hi,pe(V,s.x,s.z,5,5,r,Ve[1]),V.box(s.x,s.y+6,s.z,5,12,5,r,Ve[0]);for(let e=-1;e<=1;e+=2)for(let t=-1;t<=1;t+=2)V.box(s.x+Math.cos(r)*e*1.9+Math.sin(r)*t*1.9,s.y+12.6,s.z-Math.sin(r)*e*1.9+Math.cos(r)*t*1.9,1.1,1.2,1.1,r,Ve[2]);break}}let o=y.at(n,0);V.box(o.x,o.y+10.6,o.z,a*2,2.4,4.4,r,Ve[1]),V.box(o.x,o.y+12.1,o.z,a*2,.7,4.8,r,Ve[3]);let s=Math.floor((e+t)/2),c=null;for(let e=-140;e<=140;e+=8)for(let t=-140;t<=140;t+=8){let n=y.px[s]+e,r=y.pz[s]+t,i=y.clearance(n,r),a=i-Math.hypot(e,t)*.08;i>=24&&(!c||a>c.score)&&(c={x:n,z:r,c:i,score:a})}if(c&&fe(`keep`,c.x,c.z,30,30,0)){let e={x:c.x,y:ue.hi,z:c.z};pe(V,e.x,e.z,30,30,0,Ve[3]),V.box(e.x,e.y+8,e.z,22,16,22,0,Ve[0]),V.box(e.x,e.y+16.4,e.z,24,.8,24,0,Ve[2]);for(let t of[-1,1])for(let n of[-6,0,6])for(let r of[6.5,12])H.box(e.x+t*11.03,e.y+r,e.z+n,.08,1.7,.35,0,1381914),H.box(e.x+n,e.y+r,e.z+t*11.03,.35,1.7,.08,0,1381914);H.box(e.x,e.y+2.1,e.z+11.04,3,4.2,.1,0,1841688),H.box(e.x,e.y+4.5,e.z+11.15,3.8,.6,.3,0,Ve[3]),ne(e.x,e.y,e.z,24,24,0,3),oe(e.x,e.z,36);for(let[t,n]of[[-1,-1],[-1,1],[1,-1],[1,1]]){let r=e.x+t*12,i=e.z+n*12;V.box(r,e.y+11,i,6,22,6,Math.PI/4,Ve[1]),V.box(r,e.y+22.5,i,7,1.2,7,Math.PI/4,Ve[3]),V.box(r,e.y+24.2,i,1.2,2.2,1.2,0,11550768),ut.push([r,e.y+25.3,i,0,.05])}for(let t=-9;t<=9;t+=3)for(let n of[-1,1]){let r=t/3&1?2:1.4;V.box(e.x+n*11.6,e.y+16.7+r/2,e.z+t,1.4,r,1.4,0,Ve[3]),V.box(e.x+t,e.y+16.7+r/2,e.z+n*11.6,1.4,r,1.4,0,Ve[3])}for(let t=0;t<12;t++){let n=t/12*Math.PI*2,r=e.x+Math.cos(n)*26,i=e.z+Math.sin(n)*26,a=-n;if(!fe(`wallseg`,r,i,3,9,a))continue;let o=ue.hi,s=3+t%3*1.2,c=o-ue.lo+.8;V.box(r,o+s/2-c/2,i,3,s+c,9,a,Ve[t%4])}}}}for(let e=0;e<11;e++){let t=(e+.5)/11*O,n=Math.floor(t/y.ds)%b;if(y.pitTaper[n]>.02||t<330&&t>O-260)continue;let r=y.kappaS[n]>0?-1:1,i=(r>0?y.leftWall[n]:y.rightWall[n])+5.2;if(r>0&&y.pitTaper[n]>.02)continue;let a=y.at(t,r*i),o=y.thetaAt(t);fe(`marshal`,a.x,a.z,7,4,o)&&(a.y=ue.hi,pe(V,a.x,a.z,7,4,o,14343651),V.box(a.x,a.y+1.1,a.z,2.4,2.2,2.2,o,16250871),V.box(a.x,a.y+2.35,a.z,3,.4,2.8,o,16742938),V.box(a.x-Math.cos(o)*r*2.2,a.y+.9,a.z+Math.sin(o)*r*2.2,.5,1.8,.5,o,16742938),V.box(a.x-Math.cos(o)*r*2.2,a.y+2.05,a.z+Math.sin(o)*r*2.2,.45,.45,.45,o,15845792),V.box(a.x-Math.cos(o)*r*2.9,a.y+1.7,a.z+Math.sin(o)*r*2.9,.3,.3,1.6,o,5593702),V.box(a.x-Math.cos(o)*r*2.9,a.y+2.3,a.z+Math.sin(o)*r*2.9,.3,.9,.9,o,16765471),ne(a.x,a.y,a.z,2.4,2.2,o,.8),oe(a.x,a.z,5))}let ft=[];{let e=0;for(let t=0;t<26&&e<16;t++){let n=(t+.3)*(O/26),r=Math.floor(n/y.ds)%b;if(y.pitTaper[r]>.02||y.runoff[r]<6)continue;let i=t&1?1:-1;if(i>0&&y.pitTaper[r]>.02)continue;let a=(i>0?y.leftWall[r]:y.rightWall[r])+5.5,o=y.at(n,i*a),s=y.thetaAt(n);if(!ae(o.x,o.z,8))continue;let c=4.8,l=3.6;if(!fe(`billboard`,o.x,o.z,2,16,s))continue;o.y=ue.hi,pe(V,o.x,o.z,2,16,s,5593702),V.box(o.x,o.y+l+c/2,o.z,.5,5.6,15.8,s,2106155);let u=[Math.sin(s),Math.cos(s)];for(let e of[-1,1])V.box(o.x+u[0]*e*(15/2-1.2),o.y+l/2,o.z+u[1]*e*(15/2-1.2),.6,l,.6,s,5593702);ft.push({x:o.x,y:o.y+l+c/2,z:o.z,ry:s+(i>0?-Math.PI/2:Math.PI/2),w:15,h:c,id:e}),ne(o.x,o.y,o.z,.6,15,s,.8),oe(o.x,o.z,10),e++}}if(a.houses){let e=pm((s.seed??7)*7+31),t={farm:{wall:[14209732,11028538,13221800,9071178],roof:[6961710,4869718,8014390],trim:15789282},chalet:{wall:[7029288,8015408,5912610],roof:[15265524,14542574],trim:15260872},villa:{wall:[15920352,15392712,16184042],roof:[12083258,11031866,12873800],trim:3828378},adobe:{wall:[12094048,11041362,12884592],roof:[6965814,8018500],trim:3811872,flat:!0},cabin:{wall:[4863526,5915184,4075042],roof:[2767408,3422778],trim:13156512}}[a.houses]||null;for(let n=0,r=0;t&&n<160&&r<12;n++){let n=Math.floor(e()*b),i=e()<.5?1:-1,o=i*((i>0?y.leftWall[n]:y.rightWall[n])+16+e()*80),s=y.px[n]+y.nx[n]*o,c=y.pz[n]+y.nz[n]*o,l=6+e()*3,u=9+e()*6,d=3.1+e()*1.6,f=y.theta[n]+(e()-.5)*.9+(e()<.4?Math.PI/2:0);if(s<-720||s>800||c<-480||c>960||!ae(s,c,10)||a.sea&&a.sea.mask(s,c)>.02||!fe(`house`,s,c,l+1,u+1,f,2))continue;if(ue.hi-ue.lo>2.6){se.pop();continue}let p=ue.hi;pe(V,s,c,l+.6,u+.6,f,9077880);let m=t.wall[Math.floor(e()*t.wall.length)],h=t.roof[Math.floor(e()*t.roof.length)],g=Math.cos(f),_=-Math.sin(f),v=Math.sin(f),x=Math.cos(f),S=(e,t,n)=>[s+g*e+v*n,p+t,c+_*e+x*n],C=a.houses,w=C===`farm`&&rt()<.3,T=w?d*1.8:d,E=(e,t,n,r,i,a,o,s,c)=>{let l=S(t,n,r);e.box(l[0],l[1],l[2],i,a,o,f,s,c)};E(H,0,T/2,0,l,T,u,m,32),(C===`farm`||C===`cabin`||C===`chalet`)&&E(H,0,.25,0,l+.16,.5,u+.16,9077880,32);let D=0;if(t.flat){H.box(s,p+T+.2,c,l+.5,.4,u+.5,f,h);for(let e of[-1,1])E(H,e*(l/2+.1),T+.7,0,.3,.6,u+.5,m),E(H,0,T+.7,e*(u/2+.1),l+.2,.6,.3,m);for(let e=0;e<6;e++){let t=(e+.5)/6*u-u/2;E(H,l/2+.45,T-.3,t,.9,.22,.22,5914154)}if(rt()<.5){let e=rt()<.5?-1:1;E(H,0,.8,e*(u/2+2.6),l,1.6,.35,m);for(let t of[-1,1])E(H,t*(l/2-.17),.8,e*(u/2+1.3),.35,1.6,2.6,m)}}else if(C===`villa`){D=l*(.3+e()*.1),e();let t=.6,n=l/2+t,r=u/2+t,i=Math.max(0,r-n);H.quad(S(-n,T-.15,-r),S(-n,T-.15,r),S(0,T+D,i),S(0,T+D,-i),h),H.quad(S(n,T-.15,r),S(n,T-.15,-r),S(0,T+D,-i),S(0,T+D,i),h);for(let e of[-1,1])H.tri(S(-n,T-.15,e*r),S(n,T-.15,e*r),S(0,T+D,e*i),Ae(h,0,.12));if(rt()<.5){let e=rt()<.5?-1:1,t=l/2+2.4;for(let n of[-u*.3,u*.3])E(H,e*t,1.2,n,.18,2.4,.18,15261904,32);E(H,e*t,2.45,0,.2,.18,u*.66,15261904);for(let t=0;t<5;t++)E(H,e*(l/2+1.25),2.6,(t/4-.5)*u*.6,2.7,.12,.14,14208180)}}else{D=l*(.34+e()*.14);let t=C===`chalet`?1.1:.55,n=l/2+t,r=u/2+t;H.quad(S(-n,T-.15,-r),S(-n,T-.15,r),S(0,T+D,r),S(0,T+D,-r),h),H.quad(S(n,T-.15,r),S(n,T-.15,-r),S(0,T+D,-r),S(0,T+D,r),h);for(let e of[-1,1])H.tri(S(-l/2,T,e*u/2),S(l/2,T,e*u/2),S(0,T+l/2*D/n,e*u/2),m);if(e()<.7&&C!==`cabin`&&V.box(...S(l*.22,T+D*.75,u*.2),.9,D*.9+.8,.9,f,5917248),C===`chalet`){for(let e of[-1,1])E(H,e*(n-.1),T-.05,0,.3,.25,2*r,16054524);let e=rt()<.5?-1:1,t=e*(u/2+.6);E(H,0,T-.6,t,l*.8,.16,1.2,5912610),E(H,0,T+.35,e*(u/2+1.15),l*.8,.1,.08,5912610);for(let t=0;t<=6;t++)E(H,(t/6-.5)*l*.78,T-.1,e*(u/2+1.15),.08,.9,.08,5912610,48)}if(C===`farm`&&rt()<.4){let e=rt()<.5?-1:1,t=T*.55,n=u*.5;E(H,e*(l/2+1.1),t/2,0,2.2,t,n,Ae(m,0,.1),32),H.quad(S(l/2*e,t+.9,-n/2-.2),S(l/2*e,t+.9,n/2+.2),S(e*(l/2+2.5),t-.1,n/2+.2),S(e*(l/2+2.5),t-.1,-n/2-.2),h)}if(C===`cabin`){let e=rt()<.5?-1:1;E(H,l*.2,(T+D+1.2)/2,e*(u/2+.55),1.2,T+D+1.2,1.1,7762538),H.quad(S(l/2,T-.3,-u*.4),S(l/2,T-.3,u*.4),S(l/2+2.2,T-.9,u*.4),S(l/2+2.2,T-.9,-u*.4),h);for(let e of[-u*.38,0,u*.38])E(H,l/2+2.05,(T-.9)/2,e,.2,T-.9,.2,4863526,32)}}for(let e of[-1,1]){let n=Math.max(2,Math.round(u/3.2));for(let r=0;r<n;r++){let i=(r+.5)/n*u-u/2;if(e>0&&r===Math.floor(n/2))E(H,e*(l/2+.04),1.05,i,.1,2.1,1.1,t.trim,48);else for(let n of w?[1.75,1.75+d*.8]:[1.75])if(ot(S,f,`a`,e*l/2,i-.5,i+.5,n,1.1,1.15,1,!0,C===`villa`||C===`adobe`?15789282:t.trim),C===`villa`)for(let r of[-1,1])E(H,e*(l/2+.05),n,i+r*.85,.06,1.3,.45,t.trim,48)}}ne(s,p,c,l,u,f,1.2),oe(s,c,Math.max(l,u)*.75),r++}}let pt=[];if(a.buildings===`block`){let e=[2765124,1844278,3420234,2371652,3811904],t=[16722902,2617599,11992892,16769354,16734780];for(let n=0,r=0;n<56&&r<18;n++){let i=(n+.37)*(O/56)%O,a=Math.floor(i/y.ds)%b;if(y.pitTaper[a]>.04||y.runoff[a]>11)continue;let o=n%3==0?1:-1;if(o>0&&y.pitTaper[a]>.02)continue;let s=(o>0?y.leftWall[a]:y.rightWall[a])+7.5,c=y.at(i,o*s),l=y.thetaAt(i),u=11+n%4*3,d=7+n%5*2.4;if(!ae(c.x,c.z,6)||!fe(`block`,c.x,c.z,10,u+1,l))continue;c.y=ue.hi,pe(V,c.x,c.z,9,u,l,1711656);let f=e[n%e.length],p=y.at(i,o*(s+1)),m=Math.hypot(p.x-c.x,p.z-c.z)||1,h=(p.x-c.x)/m,g=(p.z-c.z)/m,_=Math.sin(l),v=Math.cos(l),x=(e,t,n)=>[c.x+h*e+_*n,c.y+t,c.z+g*e+v*n],S=(e,t,n,r,i,a,o,s,c)=>{let u=x(t,n,r);e.box(u[0],u[1],u[2],i,a,o,l,s,c)};S(H,0,d/2,0,9,d,u,f,32),V.box(c.x,c.y+d+.35,c.z,9.5,.7,u+.5,l,1185052);let C=d*(.4+.5*rt()),w=9*.15,T=6.3,E=u*.7;S(H,w,d+C/2,0,T,C,E,Ae(f,16777215,.06),32),S(H,w,d+C+.3,0,6.6,.6,E+.3,1185052);let D=-9/2,k=Math.max(2,Math.round(u/2.5));ot(x,l,`a`,D,-u*.46,u*.46,1.8,u*.92/k-.2,2.8,k,!1);for(let e=0;e<=k;e++)S(et,-4.58,1.8,(e/k-.5)*u*.92,.14,2.8,.18,1053208,48);S(H,-5.1,3.4,0,1.2,.25,u*.92,Ae(f,0,.1));let A=Math.max(1,Math.floor(u/2.6));for(let e=5.2;e<d-.9;e+=3.2){ot(x,l,`a`,D,-A*1.3,A*1.3,e,1.3,1.6,A,!1);for(let t of[-1,1])ot(x,l,`f`,t*u/2,-3*1.3,3*1.3,e,1.3,1.6,3,!1,0,!0)}let j=Math.max(1,Math.floor(E/2.6));for(let e=d+1.8;e<d+C-.9;e+=3.2)ot(x,l,`a`,w-T/2,-j*1.3,j*1.3,e,1.3,1.6,j,!1,0,!0);for(let e=0;e<1+(n&1);e++)S(et,-3,d+.7+.45,(e-.5*(n&1))*3.2,1.4,.9,1.8,6975610);if(n%3==0){if(n%2){S(et,w,d+C+2,0,2.2,2.4,2.2,4864560);for(let[e,t]of[[-1,-1],[-1,1],[1,-1],[1,1]])S(et,w+e*.9,d+C+.6+.2,t*.9,.14,.8,.14,2764084)}else{S(et,w,d+C+2.4,0,.2,2.8,E*.7,2764084);for(let e of[-1,1])S(et,w,d+C+1,e*E*.33,.16,2,.16,2764084)}}ne(c.x,c.y,c.z,9,u,l,1.1),oe(c.x,c.z,Math.max(u,9)*.55),pt.push([c.x,c.y+d*.72,c.z,l,9.35,.42,u*.82,t[n%t.length]]),pt.push([c.x,c.y+1.5,c.z,l,9.25,.32,u*.66,t[(n+2)%t.length]]),r++}}if(ge(V,v.deco,`props`,!0,!0),pt.length){let e=new Zi(wm,L(new Di({color:new G(3.2,3.2,3.2)})),pt.length),t=new G;pt.forEach(([n,r,i,a,o,s,c,l],u)=>{e.setMatrixAt(u,_m.compose(ym.set(n,r,i),vm.setFromEuler(xm.set(0,a,0)),bm.set(o,s,c))),e.setColorAt(u,t.setHex(l))}),e.frustumCulled=!1,e.name=`neon`,o.add(e)}for(let e of ft){let t=L(Em(e.id)),n=L(a.neon?new Di({map:t,color:new G(1.15,1.15,1.15)}):me({map:t})),r=L(new Aa(e.w,e.h));for(let t of[0,1]){let i=new zi(r,n);i.position.set(e.x,e.y,e.z),i.rotation.y=e.ry+(t?Math.PI:0),i.translateZ(.3),i.castShadow=!1,i.receiveShadow=!0,o.add(i)}}{let e=new Zi(L(new ga(.62,.95,.5).translate(0,.47,0)),L(me()),lt.length),t=new Zi(L(new ga(.4,.4,.4).translate(0,1.15,0)),L(me()),lt.length),n=new zn,r=new hn,i=new W(1,1,1),a=new W,s=new W(0,1,0),c=new G;lt.forEach(([o,l,u,d,f,p],m)=>{n.compose(a.set(o,l,u),r.setFromAxisAngle(s,d),i),e.setMatrixAt(m,n),t.setMatrixAt(m,n),e.setColorAt(m,c.setHex(f)),t.setColorAt(m,c.setHex(p))});for(let n of[e,t])n.frustumCulled=!1,n.castShadow=!0,n.receiveShadow=!0,o.add(n)}{for(let e=-90;e<150;e+=30){let t=y.at(e,-(y.halfAt(e)+y.runR[Math.floor((e%O+O)%O/y.ds)%b]+3.6));fe(`flag`,t.x,t.z,null,1.2)&&ut.push([t.x,xe(t.x,t.z),t.z,y.thetaAt(e),P()])}let e=L(new ga(.4,9,.4).translate(0,4.5,0)),t=L(new ga(2.2,1.3,.25).translate(1.1,0,0)),n=new Zi(e,L(me({color:14212066})),ut.length);k=new Zi(t,L(me({side:2})),ut.length);let r=new zn,i=new G,a=[15083039,16765471,2912224,16777215,3523690,16742938];A=ut.map(([e,t,o,s,c],l)=>(n.setMatrixAt(l,r.makeTranslation(e,t,o)),k.setColorAt(l,i.setHex(a[Math.floor(c*997)%a.length])),{x:e,y:t+7.9,z:o,yaw:s+Math.PI/2,ph:c*6.28})),n.frustumCulled=!1,k.frustumCulled=!1,n.castShadow=!0,k.castShadow=!0,o.add(n,k)}let mt=(e,t)=>{if(t&&y.clearance(t[0],t[1])>=e+ce&&ae(t[0],t[1],e))return t;let n=0,r=0;for(let e=0;e<b;e++)n+=y.px[e],r+=y.pz[e];n/=b,r/=b;let i=null;for(let t=-300;t<=300;t+=10)for(let o=-300;o<=300;o+=10){let s=n+t,c=r+o,l=y.clearance(s,c);if(l<e+ce+2||!ae(s,c,e)||a.sea&&a.sea.mask(s,c)>.05)continue;let u=-Math.abs(l-e-12)-Math.hypot(t,o)*.05;(!i||u>i.sc)&&(i={x:s,z:c,sc:u})}return i&&[i.x,i.z]};if(a.landmark===`ferris`){let e=mt(35,[55,135])||[55,135],t=e[0],n=e[1],r=be(t,n,{}),i=r+27+6;fe(`ferris`,t,n,null,35),j=new pr,j.position.set(t,0,n),j.rotation.y=.55;let a=[],s=[],c=(e,t,n)=>new W(e,t,n);for(let e of[-1.4,1.4]){for(let t=0;t<24;t++){let n=t/24*Math.PI*2,r=(t+1)/24*Math.PI*2;a.push(Cm(c(Math.cos(n)*27,Math.sin(n)*27,e),c(Math.cos(r)*27,Math.sin(r)*27,e),.7,t&1?16250871:15083039)),a.push(Cm(c(Math.cos(n)*27*.55,Math.sin(n)*27*.55,e),c(Math.cos(r)*27*.55,Math.sin(r)*27*.55,e),.45,16765471))}for(let t=0;t<12;t++){let n=t/12*Math.PI*2;a.push(Cm(c(0,0,e),c(Math.cos(n)*27,Math.sin(n)*27,e),.4,16250871))}}a.push(Cm(c(0,0,-2.2),c(0,0,2.2),2.2,16765471));let l=new zi(L(Zd(a)),L(me({vertexColors:!0})));l.position.y=i,l.castShadow=!0,l.receiveShadow=!1,l.frustumCulled=!1,j.add(l),j.userData.wheel=l;for(let e of[-3.2,3.2])s.push(Cm(c(0,i,e*.7),c(-27*.55,r-.2,e*2.2),.9,2912224),Cm(c(0,i,e*.7),c(27*.55,r-.2,e*2.2),.9,2912224));s.push(Cm(c(-27*.55,r+.6,-7),c(-27*.55,r+.6,7),1,5593702),Cm(c(27*.55,r+.6,-7),c(27*.55,r+.6,7),1,5593702));let u=new zi(L(Zd(s)),l.material);u.castShadow=!0,u.receiveShadow=!0,u.frustumCulled=!1,j.add(u);let d=Zd([Sm(wm,0,0,0,16777215,0,2.8,2,2.4),Sm(wm,0,1.25,0,2238513,0,3.2,.5,2.8)]);M=new Zi(L(d),L(me({vertexColors:!0})),16);let f=[15083039,16765471,2912224,3523690,16742938,16736162],p=new G;for(let e=0;e<16;e++)M.setColorAt(e,p.setHex(f[e%f.length]));M.userData={hubY:i,Rw:27,NG:16,rot:0},M.frustumCulled=!1,M.castShadow=!0,j.add(M),o.add(j),oe(t,n,45),ne(t,r,n,3.8,18,.55+Math.PI/2,1.5),ne(t,r,n,32,12,.55,2);let m=new gm;for(let e=0;e<5;e++){let r=t+Math.cos(e*1.3)*30+6,i=n+18+Math.sin(e*1.3)*10+e*3,a=be(r,i,{});fe(`stall`,r,i,null,3.5)&&(m.box(r,a+1.3,i,4,2.6,3,e,[15083039,16765471,2912224,3523690,16742938][e]),m.box(r,a+2.9,i,4.8,.5,3.8,e,16250871),ne(r,a,i,4,3,e,.8))}ge(m,v.deco,`stalls`,!0,!0)}if(a.landmark===`lighthouse`){let e=mt(12,a.lighthouseAt),t=new gm;if(e&&fe(`lighthouse`,e[0],e[1],null,12)){let[n,r]=e,i=ue.hi,s=[];for(let e=0;e<6;e++)s.push(Sm(new va(3.4-e*.22,3.6-e*.22,34/6,10),n,i+(e+.5)*(34/6),r,e&1?15083039:16250871));s.push(Sm(new va(3.4,3.4,.8,10),n,i+34+.4,r,2764086)),s.push(Sm(new va(2.2,2.2,3,8),n,i+34+2.3,r,16773288)),s.push(Sm(new ya(2.8,2.6,8),n,i+34+5.1,r,2764086)),s.push(Sm(new Na(3.3,.06,4,24).rotateX(Math.PI/2),n,i+34+1.8,r,2764086));for(let e=0;e<12;e++){let a=e/12*Math.PI*2;t.box(n+Math.cos(a)*3.3,i+34+1.3,r+Math.sin(a)*3.3,.08,1,.08,0,2764086,48)}t.box(n+3.62,i+1.2,r,.14,2.4,1.3,0,3811872),t.box(n+3.7,i+2.55,r,.3,.25,1.7,0,16250871);let c=new zi(L(Zd(s)),L(me({vertexColors:!0})));c.castShadow=!0,c.receiveShadow=!0,c.frustumCulled=!1,o.add(c),t.box(n+8,i+2,r+2,7,4,9,.3,15921126),t.box(n+8,i+4.6,r+2,8,1.2,10,.3,3824266),ge(t,v.deco,`cottage`,!0,!0);let l=new zi(L(new ya(4,60,6,1,!0).translate(0,-30,0).rotateZ(Math.PI/2)),L(new Di({color:16774336,transparent:!0,opacity:a.night?.22:.07,depthWrite:!1,side:2,fog:!1})));l.position.set(n,i+34+2.3,r),l.frustumCulled=!1,o.add(l),j=null,o.userData.beacon=l,ne(n,i,r,8,8,0,2),oe(n,r,22)}}if(a.landmark===`lodge`){let e=mt(14,a.lodgeAt);if(e&&fe(`lodge`,e[0],e[1],16,22,.4)){let[t,n]=e,r=ue.hi,i=new gm;H.box(t,r+2.2,n,14,4.4,18,.4,7027236,32),i.box(t,r+5.1,n,17.2,1.5,21.2,.4,16054267);{let e=Math.cos(.4),a=-Math.sin(.4),o=Math.sin(.4),s=Math.cos(.4),c=(i,c,l)=>[t+e*i+o*l,r+c,n+a*i+s*l];for(let e of[-1,1])ot(c,.4,`a`,e*7,-7.5,7.5,2.6,1.3,1.4,5,!0,15260872);let l=c(0,3.6,10.2);i.box(l[0],l[1],l[2],7,.25,2.6,.4,4860444);for(let e of[-1,1]){let t=c(e*3.2,1.75,11.2);i.box(t[0],t[1],t[2],.25,3.5,.25,.4,4860444,32)}}i.box(t,r+5.9,n,15,.35,19,.4,14017264),i.box(t+5,r+7.4,n-3,2.1,3.6,2.1,.4,4860444),i.box(t+5,r+9.5,n-3,2.6,.55,2.6,.4,2763310),i.box(t-2.2,r+3.1,n+9.1,2.4,1.8,.35,.4,16765562),i.box(t+2.4,r+3.1,n+9.1,2.4,1.8,.35,.4,16765562),ge(i,v.deco,`lodge`,!0,!0),ne(t,r,n,16,20,.4,2),oe(t,n,18)}}if(a.landmark===`tower`){let e=mt(8,a.towerAt);if(e&&fe(`tower`,e[0],e[1],null,7)){let[t,n]=e,r=ue.hi,i=new gm;for(let e=0;e<4;e++)i.box(t+(e<2?-1:1)*1.3,r+7,n+(e%2?-1:1)*1.3,.45,14,.45,0,4863012);i.box(t,r+14.6,n,5.6,.45,5.6,.2,3811872);let a=4074526;for(let[e,o]of[[1,7],[7,13.5]])for(let s of[-1,1])i.quad([t+s*1.32,r+e,n-1.3],[t+s*1.32,r+e+.25,n-1.3],[t+s*1.32,r+o+.25,n+1.3],[t+s*1.32,r+o,n+1.3],a),i.quad([t+s*1.32,r+e,n+1.3],[t+s*1.32,r+e+.25,n+1.3],[t+s*1.32,r+o+.25,n-1.3],[t+s*1.32,r+o,n-1.3],a),i.quad([t-1.3,r+e,n+s*1.32],[t-1.3,r+e+.25,n+s*1.32],[t+1.3,r+o+.25,n+s*1.32],[t+1.3,r+o,n+s*1.32],a),i.quad([t+1.3,r+e,n+s*1.32],[t+1.3,r+e+.25,n+s*1.32],[t-1.3,r+o+.25,n+s*1.32],[t-1.3,r+o,n+s*1.32],a);for(let e of[-1,1])i.box(t+e*.3,r+7.2,n+1.75,.08,14.4,.08,0,5917242);for(let e=.4;e<14.4;e+=.45)i.quad([t-.3,r+e,n+1.75],[t+.3,r+e,n+1.75],[t+.3,r+e+.06,n+1.75],[t-.3,r+e+.06,n+1.75],5917242);let o=(e,r)=>[t+Math.cos(.2)*e+Math.sin(.2)*r,n-Math.sin(.2)*e+Math.cos(.2)*r];for(let e of[-1,1]){let t=o(e*2.7,0);i.box(t[0],r+15.8,t[1],.08,.08,5.4,.2,3811872),t=o(0,e*2.7),i.box(t[0],r+15.8,t[1],5.4,.08,.08,.2,3811872)}for(let[e,t]of[[-1,-1],[-1,1],[1,-1],[1,1]]){let n=o(e*2.7,t*2.7);i.box(n[0],r+15.3,n[1],.1,1,.1,.2,3811872)}i.box(t,r+16.4,n,4.4,2.8,4.4,.2,6964786),i.box(t,r+18.4,n,6.2,.55,6.2,.2,1454626),i.box(t,r+15.2,n+2.3,1.1,1.3,.2,.2,13164704),ge(i,v.deco,`tower`,!0,!0),ne(t,r,n,6,6,0,1.2),oe(t,n,10)}}if(a.landmark===`arch`){let e=mt(12,a.archAt),t=.3;if(e&&fe(`arch`,e[0],e[1],8,22,t)){let[n,r]=e,i=ue.hi,a=new gm,s=Math.sin(t),c=Math.cos(t);for(let e of[-1,1]){let o=n+s*e*8,l=r+c*e*8;a.box(o,i+8,l,2.2,16,2.2,t,1447970),a.box(o,i+16.5,l,2.8,1.1,2.8,t,16722902)}a.box(n,i+15.2,r,1.6,1.3,18.2,t,1184796),ge(a,v.deco,`arch`,!0,!0);let l=new zi(L(new ga(1.1,.55,16)),L(new Di({color:new G(2617599).multiplyScalar(3)})));l.position.set(n,i+15.2,r),l.rotation.y=t,l.frustumCulled=!1,l.name=`archglow`,o.add(l),ne(n,i,r,6,16,t,1.4),oe(n,r,14)}}ge(H,v.facade,`facades`,!0,!0),ge(Qe,v.glass,`glass`,!1,!0),$e&&ge($e,v.glow,`glow`,!1,!1),o.userData.hiDetail=[[et,v.facade,`facadesHi`,!0],[tt,v.glass,`glassHi`,!1],[nt,v.glow,`glowHi`,!1]].filter(([e])=>e&&e.p.length).map(([e,t,n,r])=>ge(e,t,n,r,!0));{let e=a.trees===`desert`?[[6060626,6718554,5271628,7309920],[8222288,9076824,7105098,9866340]]:a.trees===`coastal`?[[3508794,4496448,5679688,2782778],[5020230,6465618,3440450,8041568],[4166232,3508794,5809766,2519612]]:a.trees===`alpine`?[[1862456,3050054,1332012,3971669],[2383412,1723948,3111488,1457958]]:a.trees===`forest`?[[1326626,1858096,995352,2386744],[1722920,1193500,2779704,796692],[1987120,1459240,2910272,1058840]]:a.trees===`street`?[[3500860,4160070,2906676,4884048]]:[[3832368,4885560,5937726,3041836],[4490287,6067766,7774778,3501868],[3106352,4028982,2644524,4885052],[12884532,13807172,10134074,12092974],[12084266,10767910,13138992,12884532],[3832368,12884532,12084266,5937726]],t=[],n=(e,n,r,i)=>{if(e<-730||e>810||n<-490||n>970||!ae(e,n,3)||R(e,n)<7)return!1;let o=be(e,n,ye),s=ye.e;if(o>(a.treeMaxH??26)||a.sea&&o<a.sea.level+1.2)return!1;let c=a.trees===`desert`?r===0?.7+P()*.45:.6+P()*.7:(.8+P()*1.1)*(a.treeScale||1);return fe(`tree`,e,n,null,2.6*c)?(t.push({x:e,y:o,z:n,s:c,kind:r,col:i[Math.floor(P()*i.length)],yaw:P()*6.28,variant:Math.floor(P()*3),far:s>110}),!0):!1},r=(t,r)=>{let i=e[Math.floor(P()*e.length)],o=a.trees===`desert`||a.trees===`street`,s=(o?14:6)+P()*12,c=o?4+Math.floor(P()*7):14+Math.floor(P()*(a.trees===`forest`?26:32)),l=P()<(a.trees===`alpine`?.46:a.trees===`forest`?.62:a.trees===`street`?.12:.38),u=0;for(let e=0;e<c*2&&u<c;e++){let e=P()*6.28,a=Math.sqrt(P())*s;n(t+Math.cos(e)*a,r+Math.sin(e)*a,P()<(l?.8:.25)?0:1,i)&&u++}return u},i=a.treeNear??130,c=a.treeFar??60;for(let e=0,t=0;e<1500&&t<i;e++){let e=Math.floor(P()*b),n=P()<.5?1:-1,i=n*((n>0?y.leftWall[e]:y.rightWall[e])+11+P()*55),a=y.px[e]+y.nx[e]*i,o=y.pz[e]+y.nz[e]*i;!ae(a,o,4)||R(a,o)<9||r(a,o)&&t++}for(let e=0,t=0;e<900&&t<c;e++){let e=-710+P()*1500,n=-470+P()*1420;!ae(e,n,4)||R(e,n)<9||r(e,n)&&t++}let l=pm((s.seed??7)*31+17),u=()=>Math.floor(l()*1e6),d={temperate:[[ch(u(),{h:8.2,r:1.8,droop:.32}),ch(u(),{h:7.4,r:2.3,droop:.38}),ch(u(),{h:5.6,r:1.7,droop:.28})],[sh(u(),{h:7.4,r:2.6,squash:.85}),sh(u(),{h:8.2,r:2.1,squash:1.2}),sh(u(),{h:6.8,r:3,squash:.7})]],alpine:[[ch(u(),{h:8.4,r:1.9,droop:.4,snow:!0}),ch(u(),{h:7.4,r:2.3,droop:.45,snow:!0}),ch(u(),{h:6.4,r:2,droop:.36,snow:!0})],[ch(u(),{h:5.4,r:2.1,droop:.42,snow:!0}),ch(u(),{h:4.8,r:2.2,droop:.48,snow:!0}),sh(u(),{h:6.6,r:2.2,squash:.95,shade:.8,cards:18})]],forest:[[ch(u(),{h:9.4,r:2,droop:.45}),ch(u(),{h:8.6,r:2.4,droop:.5}),ch(u(),{h:7.2,r:1.9,droop:.42})],[sh(u(),{h:7.8,r:2.7,squash:.95,shade:.88}),sh(u(),{h:8.4,r:2.3,squash:1.15,shade:.85}),sh(u(),{h:7,r:2.9,squash:.8,shade:.9})]],coastal:[[lh(u(),{h:8.2,bend:1.1}),lh(u(),{h:7.2,bend:.6}),lh(u(),{h:8.8,bend:1.5})],[uh(u(),{r:2.2,h:2.4}),uh(u(),{r:1.8,h:1.9}),sh(u(),{h:3.6,r:1.8,squash:.8,cards:18})]],desert:[[dh(u()),dh(u()),dh(u())],[uh(u(),{r:2,h:1.2,tuftMix:.5}),uh(u(),{r:2.4,h:1,tuftMix:.4}),uh(u(),{r:1.7,h:1.3,tuftMix:.6})]],street:[[sh(u(),{h:6.8,r:2.2,squash:.95}),sh(u(),{h:7.4,r:2,squash:1.1})],[sh(u(),{h:6.4,r:2.4,squash:.85}),sh(u(),{h:7,r:2.1,squash:1})]]}[a.trees]||null,f=a.trees===`temperate`||a.trees===`alpine`||a.trees===`forest`?{conifer:ph(`conifer`),broadleaf:ph(`broadleaf`)}:null,p=[],m=new zn,h=new hn,g=new W,_=new W,x=new W(0,1,0),S=new G,C=(e,t,n,r)=>{let i=new Zi(L(e),t,Math.max(1,n));return i.frustumCulled=!1,i.castShadow=!!r.cast,i.receiveShadow=!0,r.noAO&&(i.userData.noAO=!0),o.add(i),i},w=(e,t,n)=>{e.forEach((e,r)=>{m.compose(g.set(e.x,e.y,e.z),h.setFromAxisAngle(x,e.yaw),_.set(e.s,e.s*(.9+r%5*.06),e.s)),S.setHex(e.col).offsetHSL(0,0,(e.yaw*977%1-.5)*.06);for(let e of t)e.setMatrixAt(r,m),n.includes(e)&&e.setColorAt(r,S)});for(let n of t)n.count=e.length,n.instanceColor&&(n.instanceColor.needsUpdate=!0)},T=e=>d[e.kind][e.variant%d[e.kind].length];if(d&&d.forEach((e,n)=>e.forEach((r,i)=>{let o=t.filter(t=>t.kind===n&&t.variant%e.length===i&&!(f&&t.far)),s=e=>e&&e.attributes.position.count>3,c=[],l=[];if(s(r.cards)){let e=C(r.cards,v.leaf,o.length,{noAO:!0});c.push(e),l.push(e)}if(r.core){let e=C(r.core,v.foliage,o.length,{cast:!0});c.push(e),l.push(e)}if(s(r.trunk)){let e=a.trees===`desert`&&n===0,t=C(r.trunk,e?v.foliage:v.trunk,o.length,{cast:!0});c.push(t),e&&l.push(t)}r.snow&&c.push(C(r.snow,v.leafSnow,o.length,{noAO:!0})),w(o,c,l),p.push({meshes:c,n:o.length})})),f)for(let[e,n]of Object.entries(f)){let r=t.filter(t=>t.far&&T(t).species===e),i=C(n.cards,v.leaf,r.length,{noAO:!0});w(r,[i],[i]),p.push({meshes:[i],n:r.length})}{let e=new Zi(L(new _a(2.8,8).rotateX(-Math.PI/2)),v.aoInst,Math.max(1,t.length));t.forEach((t,n)=>{m.compose(g.set(t.x+.8*t.s,t.y+.18,t.z+.6*t.s),h.identity(),_.set(t.s,1,t.s)),e.setMatrixAt(n,m)}),e.count=t.length,e.frustumCulled=!1,e.renderOrder=1,e.userData.noAO=!0,o.add(e)}o.userData.trees=p}{let e={temperate:2600,coastal:2e3,forest:2600,alpine:700,desert:900,street:0}[a.trees]??0;if(e){v.grass=L(jm(me({vertexColors:!0,map:Gm(),alphaTest:.4,roughness:.9}),{fine:.18,fineScale:4.7,mid:.2,midScale:9.1,coarse:.12,coarseScale:37,vertical:!0}));let t=new Zi(L(fh((s.seed??7)*5+1).cards),v.grass,e),n=new zn,r=new hn,i=new W,c=new W,l=new W(0,1,0),u=new G,d=hm(a.ground.g1),f=hm(a.ground.g2),p=a.ground.patch,m=a.trees===`alpine`?hm(9077864):a.trees===`desert`?hm(9405016):null,h=p?new G(d.r*p[0]*2,d.g*p[1]*2,d.b*p[2]*2):d,g=0;for(let o=0;o<e*4&&g<e;o++){let e=Math.floor(P()*b),o=P()<.5?1:-1,s=o>0?y.leftWall[e]:y.rightWall[e];if(o>0&&y.pitTaper[e]>.02)continue;let p=o*(s+.8+33*P()*P()),_=y.px[e]+y.nx[e]*p,v=y.pz[e]+y.nz[e]*p;if(!ae(_,v,1)||R(_,v)<.6)continue;let x=be(_,v,{});if(a.sea&&x<a.sea.level+.6)continue;let S=.7+P()*1.1;n.compose(i.set(_,x-.03,v),r.setFromAxisAngle(l,P()*6.28),c.set(S,S*(.8+P()*.4),S)),t.setMatrixAt(g,n),m?u.copy(m).offsetHSL(0,0,(P()-.5)*.08):g%5==4?u.copy(h).multiplyScalar(1.1+P()*.15):u.copy(d).lerp(f,P()).multiplyScalar(1.1+P()*.15),t.setColorAt(g,u),g++}t.count=g,t.frustumCulled=!1,t.castShadow=!1,t.receiveShadow=!0,t.userData.noAO=!0,t.name=`tufts`,t.instanceColor&&(t.instanceColor.needsUpdate=!0),o.add(t),o.userData.tufts={mesh:t,n:g}}}{let e=[],t=a.trees===`street`?24:a.trees===`desert`?70:110;for(let n=0;n<500&&0<t;n++){let t=Math.floor(P()*b),n=P()<.5?1:-1,r=n*((n>0?y.leftWall[t]:y.rightWall[t])+5+P()*48),i=y.px[t]+y.nx[t]*r,a=y.pz[t]+y.nz[t]*r,o=.5+P()*1.1;i<-740||i>820||a<-500||a>980||fe(`rock`,i,a,null,1.3*o)&&e.push({x:i,y:ue.hi-.3*o,z:a,s:o,yaw:P()*6.28,tilt:(P()-.5)*.5,slab:P()<.4,tint:P()})}let n=(e,t)=>{let n=new ka(1,1);n.deleteAttribute(`normal`),n.deleteAttribute(`uv`),n=$d(n);let r=n.attributes.position,i=new Float32Array(r.count*3);for(let n=0;n<r.count;n++){let o=r.getX(n),s=r.getY(n),c=r.getZ(n),l=.75+.5*(Im(o*1.3+e,c*1.3+s*.9)*.7+Im(o*3.1-e,s*3.1+c*.7)*.3),u=s*l;u<-.33&&(u=-.33+(u+.33)*.2),r.setXYZ(n,o*l,u*t,c*l);let d=.7+.35*((s+1)/2)+(a.snowbanks&&s>.45?.35:0);i[n*3]=i[n*3+1]=i[n*3+2]=d}return n.setAttribute(`color`,new ti(i,3)),n.computeVertexNormals(),n},r=L(jm(me({vertexColors:!0,roughness:.95}),{fine:.3,fineScale:1.3,mid:.25,midScale:4.1,coarse:.1,coarseScale:19,bump:.5,vertical:!0})),i=new zn,s=new hn,c=new W,l=new W,u=new Yn,d=new G,f=a.trees===`desert`?11830106:a.trees===`alpine`?9275008:a.night?6968132:8222060,p=[],m=[];[[!1,n(3.7,1)],[!0,n(8.1,.45)]].forEach(([t,n])=>{let a=e.filter(e=>e.slab===t),h=new Zi(L(n),r,a.length||1);a.forEach((e,n)=>{i.compose(c.set(e.x,e.y,e.z),s.setFromEuler(u.set(e.tilt,e.yaw,0,`YXZ`)),l.set(e.s*(t?1.3:1),e.s,e.s*(.8+n%4*.08)*(t?1.2:1))),h.setMatrixAt(n,i),h.setColorAt(n,d.setHex(f).offsetHSL(0,0,(e.tint-.5)*.18))}),h.count=a.length,h.frustumCulled=!1,h.castShadow=!0,h.receiveShadow=!0,h.name=`rocks`,o.add(h),p.push(h),m.push(a.length)}),o.userData.rocks={meshes:p,n:m}}if(ge(I,v.ao,`ao`,!1,!1).renderOrder=1,a.clouds){let e=pm((s.seed??7)*17+3),t=L(gh(e));v.cloud.dispose(),v.cloud=L(new Di({map:t,transparent:!0,depthWrite:!1,fog:!1,color:new G(a.cloudTint??.92,a.cloudTint??.92,a.cloudTint??.92)}));let n=0,r=0;for(let e=0;e<b;e++)n+=y.px[e],r+=y.pz[e];n/=b,r/=b;let i=[],c=[],l=[];for(let t=0;t<22;t++){let t=e()*Math.PI*2,a=700+e()*260,o=n+Math.cos(t)*a,s=r+Math.sin(t)*a,u=110+e()*130,d=220+e()*260,f=d*(.26+e()*.1),p=Math.floor(e()*4),m=Math.atan2(n-o,r-s);for(let e=0;e<1;e++){let t=m+e*1.05,n=Math.cos(t),r=-Math.sin(t),a=d*(e===0?1:.72),h=f*(e===0?1:.8),g=u,_=i.length/3;for(let[e,t]of[[-1,0],[1,0],[1,1],[-1,1]])i.push(o+n*e*a/2,g+t*h,s+r*e*a/2),c.push(p%2*.5+(e>0?.5:0),Math.floor(p/2)*.5+t*.5);l.push(_,_+1,_+2,_,_+2,_+3)}}let u=L(new hi);u.setAttribute(`position`,new K(i,3)),u.setAttribute(`uv`,new K(c,2)),u.setIndex(l),d=new zi(u,v.cloud),d.frustumCulled=!1,d.renderOrder=-8,d.name=`clouds`,o.add(d)}{let e=a.horizon||(a.trees===`alpine`?`peaks`:a.neon?`city`:a.trees===`desert`?`mesa`:`hills`),r=0,i=0;for(let e=0;e<b;e++)r+=y.px[e],i+=y.pz[e];r/=b,i/=b;let c=hm(a.sky.bot),l=new G,u=[],d=[],p=[],m=(e,t,n,r,i=0,a=0)=>{u.push(e,t,n),d.push(r[0],r[1],r[2]),p.push(i,a)},h=(e,t)=>a.sea&&a.sea.mask(e,t)>.25;if(e===`city`){let e=pm(91),n=hm(a.sky.bot),o=(e,r,i,a,o,s,c,l)=>{let u=[t(o[0],n.r,.5),t(o[1],n.g,.5),t(o[2],n.b,.5)],d=[o[0]*.35,o[1]*.35,o[2]*.35],f=i+a;m(e[0],i,e[1],u,s,0),m(r[0],i,r[1],u,s+c,0),m(r[0],f,r[1],o,s+c,l),m(e[0],i,e[1],u,s,0),m(r[0],f,r[1],o,s+c,l),m(e[0],f,e[1],o,s,l),m(e[0],f,e[1],d,.004,.004),m(r[0],f,r[1],d,.004,.004),m(r[0],f+2.2,r[1],d,.004,.004),m(e[0],f,e[1],d,.004,.004),m(r[0],f+2.2,r[1],d,.004,.004),m(e[0],f+2.2,e[1],d,.004,.004)};for(let t=0;t<150;t++){let n=t/150*Math.PI*2+e()*.02,a=760+e()*220,s=r+Math.cos(n)*a,c=i+Math.sin(n)*a,l=34+e()*50,u=50+e()*e()*190,d=-Math.sin(n),f=Math.cos(n),p=.8-(a-760)/220*.3,m=[p*[.9,1,.85][t%3],p*.9,p],h=e(),g=l/120,_=u/120;o([s-d*l/2,c-f*l/2],[s+d*l/2,c+f*l/2],-30,u,m,h,g,_)}for(let t=0;t<90;t++){let n=t/90*Math.PI*2+e()*.03,a=560+e()*140,s=r+Math.cos(n)*a,c=i+Math.sin(n)*a,l=26+e()*36,u=30+e()*80,d=-Math.sin(n),f=Math.cos(n),p=e();if(y.clearance(s,c)<l/2+60)continue;let m=.55,h=[m*[.9,1,.85][t%3],m*.9,m];o([s-d*l/2,c-f*l/2],[s+d*l/2,c+f*l/2],-20,u,h,p,l/120,u/120)}}else{let t=[[1010,.62,1],[900,.42,.72],[800,.24,.5]],o=e===`peaks`?3951198:e===`mesa`?a.night?1183522:10510394:a.trees===`forest`?1849898:4155962,u=e===`peaks`?15265526:e===`mesa`?a.night?5915750:12615760:a.trees===`forest`?2771508:5933642,d=e===`peaks`?5399162:u,p=e===`peaks`?1977386:e===`hills`?a.trees===`forest`?1190430:2904112:o,g=f.userData.dir,_=Math.hypot(g.x,g.z)||1,v=g.x/_,y=g.z/_,b=(e,t,n,r)=>(l.setHex(e).multiplyScalar(n),r&&(l.b=Math.min(1,l.b*1.08),l.r*=.94),l.lerp(c,t),[l.r,l.g,l.b]),S=x===0?180:360;t.forEach(([t,a,c],l)=>{let f=l*2.1+(s.seed??7)*.37,g=e=>{let t=0,n=Math.cos(e),r=Math.sin(e);for(let[e,i]of[[3,.5],[7,.25],[15,.15],[31,.1]])t+=i*(1-Math.abs(2*Im(n*e+f,r*e+f+l*7.3)-1));return t},_=t=>{let r=g(t);if(e===`peaks`)return 40+260*c*r**1.6;if(e===`mesa`){let e=n(.42,.55,r);return 10+100*c*e+e*5*Im(Math.cos(t)*60+f,Math.sin(t)*60)}return 18+85*c*r},x=e=>120+60*Im(Math.cos(e)*20+f*3,Math.sin(e)*20+l),C=2*Math.PI/S,w=e=>(_(e+3*C)-_(e-3*C))*(-Math.sin(e)*v+Math.cos(e)*y),T=e=>Math.max(-1,Math.min(1,-w(e)/12)),E=e===`hills`&&l===2;for(let n=0;n<S;n++){let s=n/S*Math.PI*2,c=(n+1)/S*Math.PI*2,f=(s+c)/2,g=[r+Math.cos(s)*t,i+Math.sin(s)*t],v=[r+Math.cos(c)*t,i+Math.sin(c)*t],y=_(s),C=_(c),w=h(g[0],g[1]),D=h(v[0],v[1]);w&&(y=-12),D&&(C=-12);let O=(t,n,r)=>{let i=T(r),s=.99+.13*i,c=i<-.3;if(t===0)return b(p,Math.min(1,a+.3),1,!1);if(t===1)return b(e===`peaks`&&l>0||e===`hills`?p:o,Math.min(1,a+.1),e===`hills`?1.1:1,!1);let f=t===2?n*.7:n,m=e===`peaks`?f>x(r)?u:d:t===3?u:e===`hills`?p:d;return b(m,t===3?a*.8:a,s*(e===`hills`&&t===2?1.2:1),c)},k=[-45,y*.35,y*.7,y],A=[-45,C*.35,C*.7,C],j=[0,1,2,3].map(e=>O(e,y,s)),M=[0,1,2,3].map(e=>O(e,C,c)),N=E?2:3;for(let e=0;e<N;e++)m(g[0],k[e],g[1],j[e]),m(v[0],A[e],v[1],M[e]),m(v[0],A[e+1],v[1],M[e+1]),m(g[0],k[e],g[1],j[e]),m(v[0],A[e+1],v[1],M[e+1]),m(g[0],k[e+1],g[1],j[e+1]);if(E){let e=[r+Math.cos(f)*t,i+Math.sin(f)*t],n=w||D?Math.min(y,C):_(f),a=O(2,n,f),o=O(3,n,f),s=y+(w?0:3),c=n-(w||D?0:3),l=C+(D?0:3),u=(e,t,n,r,i,a,o,s,c,l)=>{m(e[0],t,e[1],r),m(a[0],o,a[1],c),m(a[0],s,a[1],l),m(e[0],t,e[1],r),m(a[0],s,a[1],l),m(e[0],n,e[1],i)};u(g,k[2],s,j[2],j[3],e,n*.7,c,a,o),u(e,n*.7,c,a,o,v,A[2],l,M[2],M[3])}}})}let g=L(new hi);g.setAttribute(`position`,new K(u,3)),g.setAttribute(`color`,new K(d,3)),g.setAttribute(`uv`,new K(p,2));let _=new zi(g,L(new Di({vertexColors:!0,fog:!1,side:2,map:e===`city`?L(_h()):null})));_.name=`horizon`,_.frustumCulled=!1,_.renderOrder=-9,o.add(_)}if(a.sea&&(a.sea.color=new G(a.sea.water),C=new zi(L(new Aa(4e3,4e3).rotateX(-Math.PI/2)),L(me({color:a.sea.color,roughness:.18,metalness:.1,envMapIntensity:1.4}))),C.position.y=a.sea.level,C.receiveShadow=!0,C.frustumCulled=!1,C.name=`sea`,o.add(C)),a.night){let e=[],t=[];for(let n=0;n<700;n++){let n=P()*2-1,r=P()*Math.PI*2,i=Math.abs(n)*.9+.08,a=Math.sqrt(1-i*i);e.push(Math.cos(r)*a*900,i*900,Math.sin(r)*a*900);let o=.55+P()*.45;t.push(o,o,o*(.9+P()*.1))}let n=L(new hi);n.setAttribute(`position`,new K(e,3)),n.setAttribute(`color`,new K(t,3)),w=new la(n,L(new ia({size:2,sizeAttenuation:!1,vertexColors:!0,fog:!1,depthWrite:!1}))),w.frustumCulled=!1,w.renderOrder=-9,o.add(w);let r=new gm,i=[],s=[];for(let e=0,t=0;e<60&&t<34;e++){let n=(e+.5)*(O/60),a=Math.floor(n/y.ds)%b,o=e&1?1:-1;if(o>0&&y.pitTaper[a]>.02)continue;let c=(o>0?y.leftWall[a]:y.rightWall[a])+4,l=y.at(n,o*c),u=y.thetaAt(n);if(!ae(l.x,l.z,2)||!fe(`floodlight`,l.x,l.z,null,1.2))continue;let d=ue.hi;r.box(l.x,d+9,l.z,.6,18,.6,u,7173248),r.box(l.x-Math.cos(u)*o*.6,d+18,l.z+Math.sin(u)*o*.6,.7,1.6,4.2,u,2764086),i.push([l.x-Math.cos(u)*o*1,d+18,l.z+Math.sin(u)*o*1,u]);{let e=y.at(n,o*Math.max(0,c-9));s.push([e.x,e.y+.09,e.z])}oe(l.x,l.z,3),t++}ge(r,v.deco,`floodmasts`,!0,!0),T=new Zi(wm,L(new Di({color:new G(16774872).multiplyScalar(3),fog:!1})),Math.max(1,i.length));let c=new zn;i.forEach(([e,t,n,r],i)=>T.setMatrixAt(i,c.compose(ym.set(e,t,n),vm.setFromEuler(xm.set(0,r,0)),bm.set(.3,1.2,3.8)))),T.count=i.length,T.frustumCulled=!1,o.add(T);let l=L(new _a(1,24).rotateX(-Math.PI/2)),u=new Float32Array(l.attributes.position.count*3);for(let e=0;e<l.attributes.position.count;e++){let t=l.attributes.position.getX(e),n=l.attributes.position.getZ(e),r=Math.max(0,1-Math.hypot(t,n));u.set([r,r*.95,r*.82],e*3)}l.setAttribute(`color`,new ti(u,3));let d=new Zi(l,L(new Di({vertexColors:!0,color:new G(a.neon?.11:.15,a.neon?.1:.14,(a.neon,.12)),transparent:!0,blending:2,depthWrite:!1,fog:!1,polygonOffset:!0,polygonOffsetFactor:-7,polygonOffsetUnits:-7})),Math.max(1,s.length));s.forEach(([e,t,n],r)=>d.setMatrixAt(r,c.compose(ym.set(e,t,n),vm.identity(),bm.set(16,1,16)))),d.count=s.length,d.frustumCulled=!1,d.renderOrder=2,d.name=`floodpools`,o.add(d)}N=new Zi(L(new ja(.45,1,4,1).rotateX(-Math.PI/2)),L(new Di({color:15135487,transparent:!0,opacity:.8,depthWrite:!1,fog:!1})),320),N.frustumCulled=!1,N.visible=!1,N.count=0,N.userData.max=320;for(let e=0;e<320;e++)ee.push({x:0,y:-999,z:0,age:P(),life:.35+P()*.3,size:.3+P()*.4});if(o.add(N),a.rainParticles){E=new Zi(L(new ga(.07,1.5,.07)),L(new Di({color:14018294,transparent:!0,opacity:.5,depthWrite:!1})),180),E.frustumCulled=!1,E.count=180,E.name=`rainbits`;for(let e=0;e<180;e++)D.push({x:0,y:-999,z:0,v:16+P()*14,age:1});o.add(E)}c.add(o),Ie(_);let ht=L(new Ja),gt=L(new Ja);o.traverse(e=>{e.isInstancedMesh&&e.castShadow&&(e.customDepthMaterial=e.instanceColor?gt:ht)}),Le(x)}function Ce(e){for(let e of[te,P,F])e&&(o.remove(e),e.geometry.dispose?.());ne=e.filter(Boolean);let t=ne.length,n=[],r=[],i=4.2;for(let e=0;e<5;e++){let t=e/5*22,a=(e+1)/5*22,o=.7+t/22*i,s=.7+a/22*i,c=(1-e/5)**1.5,l=(1-(e+1)/5)**1.5,u=[-o,0,t],d=[o,0,t],f=[s,0,a],p=[-s,0,a];for(let[e,t]of[[u,c],[d,c],[f,l],[u,c],[f,l],[p,l]])n.push(e[0],e[1],e[2]),r.push(t*.13,t*.12,t*.085)}let a=new hi;a.setAttribute(`position`,new K(n,3)),a.setAttribute(`color`,new K(r,3)),te=new Zi(a,new Di({vertexColors:!0,transparent:!0,blending:2,depthWrite:!1,fog:!1,side:2,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6}),t),te.frustumCulled=!1,te.visible=!1,te.renderOrder=2,P=new Zi(wm,new Di({color:new G(16774336).multiplyScalar(2.4),fog:!1}),t*2),F=new Zi(wm,new Di({color:new G(16722458).multiplyScalar(3),fog:!1}),t*2);for(let e of[P,F])e.frustumCulled=!1,e.visible=!1;o.add(te,P,F)}let z=new zn,we=new zn;function Te(e,t){if(te.visible=P.visible=F.visible=e,e){te.material.color.setScalar(.35+.65*t),ne.forEach((e,t)=>{e.pivot.updateWorldMatrix(!0,!1);let n=e.pivot.matrixWorld;te.setMatrixAt(t,z.copy(n).multiply(we.makeTranslation(0,.1-e.pivot.position.y,3.1)));for(let[e,r]of[[0,-.36],[1,.36]])P.setMatrixAt(t*2+e,z.copy(n).multiply(we.compose(ym.set(r,.62,1.15),vm.identity(),bm.set(.2,.16,.12)))),F.setMatrixAt(t*2+e,z.copy(n).multiply(we.compose(ym.set(r*.6,.55,-2.4),vm.identity(),bm.set(.18,.14,.1))))});for(let e of[te,P,F])e.instanceMatrix.needsUpdate=!0}}let Ee=null,B=null,De=null;function Oe(){if(I)return;let e=Zd([Sm(new ya(2.2,3.4,4).rotateX(Math.PI),0,1.7,0,16769354),Sm(wm,0,5,0,16769354,0,1.5,3.2,1.5)]);B=new zi(L(e),L(new Di({vertexColors:!0,fog:!1}))),B.visible=!1,B.frustumCulled=!1,B.renderOrder=5,o.add(B);let t=Zd([Sm(wm,0,0,5.3,16769354,0,11,.06,.6),Sm(wm,0,0,-5.3,16769354,0,11,.06,.6),Sm(wm,5.3,0,0,16769354,0,.6,.06,11),Sm(wm,-5.3,0,0,16769354,0,.6,.06,11)]);De=new zi(L(t),L(new Di({vertexColors:!0,fog:!1}))),De.visible=!1,De.frustumCulled=!1,o.add(De);let n=(e,t)=>Zd([Sm(wm,0,.45,0,2237741,0,.55,.9,.35),Sm(wm,0,1.15,0,e,0,.7,.8,.4),Sm(wm,.45,1.2,0,t,0,.2,.7,.25),Sm(wm,-.45,1.2,0,t,0,.2,.7,.25),Sm(wm,0,1.85,0,16053492,0,.5,.45,.5)]),r=L(me({vertexColors:!0})),i=jd[0];I={group:new pr,people:[],tires:[],jacks:[],sign:null,teamMat:r,ready:!1};for(let e=0;e<7;e++){let e=new zi(L(n(i.c1,i.c2)),r);e.castShadow=!0,e.frustumCulled=!1,I.group.add(e),I.people.push(e)}for(let e=0;e<4;e++){let e=new zi(L(Zd([Sm(new va(.45,.45,.5,8).rotateZ(Math.PI/2),0,0,0,1710622),Sm(new va(.47,.47,.12,8).rotateZ(Math.PI/2),0,0,0,16777215)])),L(me({vertexColors:!0})));e.castShadow=!0,e.visible=!1,e.frustumCulled=!1,I.group.add(e),I.tires.push(e)}for(let e=0;e<2;e++){let e=new zi(L(Zd([Sm(wm,0,.25,0,16765471,0,.8,.5,.8),Sm(wm,0,.9,0,5593702,0,.25,1,.25)])),L(me({vertexColors:!0})));e.castShadow=!0,e.frustumCulled=!1,I.group.add(e),I.jacks.push(e)}let a=new zi(L(Zd([Sm(wm,0,1.4,0,5593702,0,.3,2.8,.3),Sm(wm,0,2.9,0,16777215,0,1.3,1.3,.1)])),L(new Di({vertexColors:!0})));a.frustumCulled=!1,I.group.add(a),I.sign=a;let s=new zi(L(new ga(1,1,.14)),L(new Di({color:15083039})));s.position.set(0,2.9,.07),a.add(s),I.signLamp=s,I.group.visible=!1,o.add(I.group)}function ke(e){Ee=e}let Ae=new W,je=(e,t,r)=>n(e,t,r);function Me(e,n){Oe();let r=Ee,i=l.length,a=!1,o=!1,s=0;if(r&&r.teamIndex!=null){let e=(l.boxU(r.teamIndex)%i+i)%i,c=Math.floor(e/l.ds)%l.n,u=l.boxD(c),d=l.at(e-.6,u),f=l.thetaAt(e-.6);a=r.request&&r.stage===0||r.stage===1||r.stage===2&&!r.choice;let p=r.car?Math.hypot(r.car.group.position.x-d.x,r.car.group.position.z-d.z):99;if(o=r.stage===1&&p<70||r.stage===2||r.stage===3&&p<16,De.visible=a||o,a){B.position.set(d.x,d.y+3.5+Math.sin(n*5)*.9,d.z),B.rotation.y=n*1.8,B.visible=!0;let e=1+.12*Math.sin(n*5);B.scale.setScalar(e)}else B.visible=!1;De.visible&&(De.position.set(d.x,d.y+.12,d.z),De.rotation.y=f,De.scale.setScalar(1+.04*Math.sin(n*6)));let m=d.x,h=d.y,g=d.z,_=f;r.car&&r.stage===2&&(m=r.car.group.position.x,h=r.car.group.position.y,g=r.car.group.position.z,_=r.car.group.rotation.y);let v=Math.cos(_),b=Math.sin(_),x=(e,t,n)=>n.set(m+v*e+b*t,h,g-b*e+v*t);if(I.group.visible=o,o){let e=r.choice&&r.serv||0,n=je(0,.35,e)*(1-je(2.05,2.4,e));s=.42*je(.25,.6,e)*(1-je(1.95,2.35,e));let i=r.stage!==2,a=r.colors||jd[r.teamIndex%jd.length],o=r.teamIndex+`:`+a.c1+`:`+a.c2;I.teamKey!==o&&(I.teamKey=o,I.people.forEach(e=>{e.geometry.dispose(),e.geometry=Zd([Sm(wm,0,.45,0,2237741,0,.55,.9,.35),Sm(wm,0,1.15,0,a.c1,0,.7,.8,.4),Sm(wm,.45,1.2,0,a.c2,0,.2,.7,.25),Sm(wm,-.45,1.2,0,a.c2,0,.2,.7,.25),Sm(wm,0,1.85,0,16053492,0,.5,.45,.5)])}));let c=[1.05,-1.05,1.15,-1.15],l=[1.9,1.9,-1.65,-1.65];for(let a=0;a<4;a++){let o=Math.sign(c[a]),s=[o*4.3,l[a]],u=[o*2.1,l[a]],d=t(s[0],u[0],n),f=t(s[1],u[1],n),p=I.people[a];x(d,f,Ae),p.position.copy(Ae),p.rotation.y=_+(o>0?-Math.PI/2:Math.PI/2),p.scale.y=1-.28*n+(n>.9?Math.sin(e*28+a)*.03:0);let m=I.tires[a],g=e<1.15?je(.6,1,e):1-je(1.2,1.7,e);m.visible=!i&&e>.6&&e<1.75,x(o*(1.1+g*1.7),l[a],Ae),m.position.copy(Ae).setY(h+.4+g*.35),m.rotation.y=_;let v=m.geometry.attributes.color,y=r.choice===`wet`?[.3,.65,1]:[1,.85,.2],b=e<1.15?[.6,.6,.6]:y;for(let e=v.count>>1;e<v.count;e++)v.setXYZ(e,b[0],b[1],b[2]);v.needsUpdate=!0}r.car&&r.car.wheels.forEach(t=>{t.visible=!(r.stage===2&&e>.65&&e<1.7)});let u=[4.7,-4.2];for(let e=0;e<2;e++){let r=I.people[4+e];x(0,t(u[e]*1.5,u[e],n)*1,Ae),r.position.copy(Ae),r.rotation.y=_+(e?0:Math.PI),r.scale.y=1-.18*n;let i=I.jacks[e];x(0,e?-2.3:3,Ae),i.position.copy(Ae),i.rotation.y=_,i.scale.y=.2+s*2.2,i.visible=s>.01}let d=I.people[6];x(-1.4,7.4,Ae),d.position.copy(Ae),d.rotation.y=_+Math.PI,d.scale.y=1,I.sign.position.copy(Ae).add(new W(0,.2,0)),I.sign.rotation.y=_,I.signLamp.material.color.setHex(e>2.1?3538784:15083039),I.sign.position.add(new W(Math.cos(_)*.9,0,-Math.sin(_)*.9)),y.signT=e}else r.car&&r.car.wheels.forEach(e=>{e.visible=!0})}else B.visible=!1,De.visible=!1,I.group.visible=!1;y.lift=s}let Ne=[new G(a.sky.top),new G(a.sky.rainTop)],Pe=[new G(a.sky.bot),new G(a.sky.rainBot)],Fe=new G;function Ie(n){if(_.rain=e(n.rain??_.rain,0,1),_.wet=e(n.wetness??_.wet,0,1),!c)return;let r=Math.max(_.rain,a.ambientRain||0),i=Math.max(_.wet,a.ambientWet||0);O=r,u.material.uniforms.top.value.copy(Ne[0]).lerp(Ne[1],r),u.material.uniforms.bot.value.copy(Pe[0]).lerp(Pe[1],r),u.material.uniforms.sunAmt.value=a.sky.sunGlow*(1-r),c.fog.color.copy(u.material.uniforms.bot.value),c.background.copy(c.fog.color),b.fogNear=t(a.fog[0],a.fog[0]*.75,r),b.fogFar=t(a.fog[1],a.fog[1]*.77,r),f.intensity=t(a.sun.intensity,a.sun.rainIntensity,r),p.intensity=t(a.hemi.intensity,a.hemi.intensity*.84,r),f.color.setHex(a.sun.color).lerp(Fe.setHex(a.sun.rainColor),r),p.color.setHex(a.hemi.sky).lerp(Fe.setHex(9676480),r*(a.night?.3:1)),p.groundColor.setHex(a.hemi.ground).lerp(Fe.setHex(4151882),r*(a.night?.3:1)),v.asphalt.color.setRGB(1,1,1).lerp(Fe.setRGB(.56,.6,.67),i),v.asphalt.roughness=v.pit.roughness=t(a.mood.asphalt,Math.min(a.mood.asphalt,.3),i),v.asphalt.envMapIntensity=v.pit.envMapIntensity=t(a.mood.asphaltEnv,a.mood.asphaltEnv+1.1,i),v.pit.color.copy(v.asphalt.color),v.terrain.color.setRGB(1,1,1).lerp(Fe.setRGB(.85,.9,.92),r),v.cloud.color.setScalar(a.cloudTint??.92).lerp(Fe.setRGB(.62,.66,.72),r),v.gravel.color.setRGB(1,1,1).lerp(Fe.setRGB(.7,.7,.72),i),v.ao.opacity=v.aoInst.opacity=.26+.03*r;let o=a.fx.tint;y.rain=r,y.sat=a.fx.sat*(1-.3*r),y.tint=[o[0]*(1-.2*r),o[1]*(1-.13*r),o[2]*(1-.03*r)],N&&(N.visible=r>.03)}function Le(t,n=x>=2?2048:1024){if(x=e(Math.round(t),0,2),!c)return;f.castShadow=!0,n!==S&&(S=n,f.shadow.mapSize.set(n,n),f.shadow.map?.dispose(),f.shadow.map=null);let r=o.userData.trees||[];for(let e of r)for(let t of e.meshes)t.count=Math.floor(e.n*(x>=2?1:x===1?.7:.4));if(o.userData.rocks){let e=o.userData.rocks;e.meshes.forEach((t,n)=>{t.count=Math.floor(e.n[n]*(x>=2?1:x===1?.6:.3))})}if(o.userData.hiDetail)for(let e of o.userData.hiDetail)e.visible=x>=1;if(o.userData.tufts){let e=o.userData.tufts;e.mesh.count=x>=2?e.n:x===1?Math.floor(e.n/2):0,e.mesh.visible=x>=1}N&&(N.userData.cap=x>=2?N.userData.max:x===1?160:70),v.asphalt?.userData.setRoadBump?.(x>=1)}let Re=0,ze=new W,Be=new W,Ve=new W,He=new W(0,1,0),Ue=new zn,We=new W(1,1,1);function Ge(t,r,i=null){if(!c)return;Re+=t,y.time=Re;let s=i||{x:r.position.x,y:0,z:r.position.z,half:90,dist:40};u.position.copy(r.position),d&&(d.visible=r.position.y<260),C&&(C.position.x=r.position.x,C.position.z=r.position.z,C.material.color.copy(a.sea.color).offsetHSL(0,0,Math.sin(Re*.7)*.012)),w&&w.position.copy(r.position),o.userData.beacon&&(o.userData.beacon.rotation.y=Re*.9),c.fog.near=b.fogNear+s.dist*.9,c.fog.far=b.fogFar+s.dist*1.6;{let e=s.half,t=e*2/S,n=f.userData.dir;Be.crossVectors(He,n).normalize(),Ve.crossVectors(n,Be);let r=Math.round((s.x*Be.x+s.y*Be.y+s.z*Be.z)/t)*t,i=Math.round((s.x*Ve.x+s.y*Ve.y+s.z*Ve.z)/t)*t,a=s.x*n.x+s.y*n.y+s.z*n.z;ze.set(0,0,0).addScaledVector(Be,r).addScaledVector(Ve,i).addScaledVector(n,a),f.target.position.copy(ze),f.position.copy(ze).addScaledVector(n,300);let o=f.shadow.camera;o.right!==e&&(o.left=-e,o.right=e,o.top=e,o.bottom=-e,o.updateProjectionMatrix()),f.target.updateMatrixWorld()}for(let e=0;e<A.length;e++){let t=A[e];Ue.compose(ym.set(t.x,t.y,t.z),vm.setFromEuler(xm.set(Math.sin(Re*2.6+t.ph)*.12,t.yaw+Math.sin(Re*2.1+t.ph)*.35,0)),We),k.setMatrixAt(e,Ue)}if(k.instanceMatrix.needsUpdate=!0,j){let e=M.userData;e.rot-=t*.045,j.userData.wheel.rotation.z=e.rot;for(let t=0;t<e.NG;t++){let n=e.rot+t/e.NG*Math.PI*2;M.setMatrixAt(t,Ue.makeTranslation(Math.cos(n)*e.Rw,e.hubY+Math.sin(n)*e.Rw-2,0))}M.instanceMatrix.needsUpdate=!0}if(N.visible){let r=Math.min(N.userData.cap??N.userData.max,Math.floor(N.userData.max*n(.03,.8,O)));N.count=r;let i=e(s.dist*.55,22,90);for(let e=0;e<r;e++){let n=ee[e];if(n.age+=t/n.life,n.age>=1){--n.age;let e=Math.random()*6.283,t=Math.sqrt(Math.random())*i;n.x=s.x+Math.cos(e)*t,n.z=s.z+Math.sin(e)*t*.8,n.y=be(n.x,n.z,ye)+.14}let r=[.35,.65,.95,1.2][Math.min(3,Math.floor(n.age*4))]*n.size;Ue.compose(ym.set(n.x,n.y,n.z),vm.identity(),bm.set(r,1,r)),N.setMatrixAt(e,Ue)}N.instanceMatrix.needsUpdate=!0}if(E){let n=O>.04;if(E.visible=n,n){let n=e((i?i.dist:40)*.65,16,64),a=i||{x:r.position.x,y:r.position.y,z:r.position.z};for(let e=0;e<D.length;e++){let r=D[e];if(r.y-=r.v*t,r.age+=t,r.y<a.y-4){let e=Math.random()*6.283,t=Math.sqrt(Math.random())*n;r.x=a.x+Math.cos(e)*t,r.z=a.z+Math.sin(e)*t,r.y=a.y+6+Math.random()*18,r.age=0}Ue.makeTranslation(r.x,r.y,r.z),E.setMatrixAt(e,Ue)}E.instanceMatrix.needsUpdate=!0}}te&&Te((a.night||_.rain>.05)&&ne.length>0,a.night?1:n(.05,.4,_.rain)),Me(t,Re)}function Ke(e){if(!c||!e)return;let t=a.mood;e.setMood({exposure:t.exposure,bloom:t.bloom,aoBlend:t.ao,contrast:t.contrast,sat:t.sat,vignette:t.vignette}),c.environment=e.env(t.envKind),c.environmentIntensity=t.env}function qe(e,t=!1){m.forEach((n,r)=>n.color.setHex(t?3538784:r<e?16722458:3804170))}function Je(){c&&(c.remove(o),c.fog=h,c.background=g);for(let e of s)e.dispose?.();f?.shadow.map?.dispose(),o.clear(),m.length=0,s.length=0,se.length=0,re.length=0,c=null,I=null,A=[],ee=[],ie.length=0,C=w=T=d=j=M=k=N=E=te=P=F=null,D=[],O=0,ne=[],o.userData={}}return{name:a.name,style:a,group:o,placements:se,groundAt:xe,build:Se,dispose:Je,setWeather:Ie,update:Ge,setStartLights:qe,setCars:Ce,setPit:ke,setQuality:Le,applyMood:Ke,fx:y,get quality(){return x}}}var yh={name:`desertNight`,sky:{top:395810,bot:2893138,rainTop:1053738,rainBot:2500156,sunGlow:.2},fog:[280,1300],sun:{color:11122943,intensity:1.9,dir:[.42,.78,-.32],rainColor:9082032,rainIntensity:1.1},hemi:{sky:7108800,ground:5914154,intensity:1},ground:{g1:13212250,g2:12554322,far:12027210,rock:10115642,amp:38,rockFrom:30,patch:[.42,.4,.38],patchAmt:.5,patch2:[.56,.54,.48],patch2Amt:.45,hills:{n:10,h:[18,40],r:[80,150],flat:!0},slope:{color:10115642,from:.09,to:.22,amt:.95},strata:{scale:1.8,amt:.5}},road:{color:4672082,rubber:1,dust:[.9,.72,.45],dustAmt:.6,bump:.5},houses:`adobe`,facade:{h:.45,amt:.08},gravel:[14727288,13937516],trees:`desert`,clouds:!1,night:!0,landmark:`ferris`,fx:{sat:1,tint:[.97,.98,1.04]},cloudTint:.3,mood:{exposure:1.15,bloom:.95,env:.3,envKind:`night`,asphalt:.75,asphaltEnv:.35,ao:.65,contrast:1.1,sat:1.1,vignette:.24}};function bh(){return vh(yh)}var xh={name:`coastal`,sky:{top:1337556,bot:9226994,rainTop:5664908,rainBot:10136509,sunGlow:1.1},fog:[340,1600],sun:{color:16773850,intensity:3.4,dir:[.5,.78,.38]},hemi:{sky:12115199,ground:5933636,intensity:.7},ground:{g1:6523970,g2:5799740,far:5075514,rock:11049080,amp:20,rockFrom:30,patch:[.66,.6,.36],patchAmt:.6,patch2:[.42,.48,.36],patch2Amt:.4,hills:{n:9,h:[10,24],r:[70,120]},slope:{color:11575168,from:.1,to:.24,amt:.9},strata:{scale:2.2,amt:.3}},road:{color:5264216,rubber:.95,dust:[.85,.75,.55],dustAmt:.5,bump:.5},houses:`villa`,facade:{h:.6,amt:.05},gravel:[14863512,14073994],trees:`coastal`,treeNear:130,treeFar:16,clouds:!0,landmark:`lighthouse`,lighthouseAt:[495,360],sea:{level:0,water:1734840,sand:15127198,mask:(e,t)=>Math.max(n(590,650,t),n(500,560,e))},fx:{sat:1.05,tint:[1,1,1]},mood:{exposure:.9,bloom:.5,env:.38,contrast:1.14,sat:1.14}};function Sh(){return vh(xh)}var Ch={name:`alpine`,sky:{top:2254540,bot:10274540,rainTop:7375010,rainBot:12175574,sunGlow:.9},fog:[320,1500],sun:{color:16774372,intensity:2.9,dir:[.25,.74,.48]},hemi:{sky:12375282,ground:8228516,intensity:.62},ground:{g1:14936818,g2:14279662,far:13030370,rock:7828076,amp:46,rockFrom:58,patch:[.44,.47,.53],patchAmt:.55,patch2:[.47,.45,.42],patch2Amt:.35,hills:{n:13,h:[30,80],r:[90,170]},slope:{color:7236198,from:.16,to:.34,amt:1},strata:{scale:3.4,amt:.16}},road:{color:5527388,rubber:.85,dust:[.9,.93,1],dustAmt:.5,bump:.5},houses:`chalet`,facade:{h:.22,amt:.2},gravel:[14673904,13227748],trees:`alpine`,treeNear:120,treeFar:48,treeMaxH:96,snowbanks:!0,clouds:!0,landmark:`lodge`,fx:{sat:1.02,tint:[.98,.99,1.02]},mood:{exposure:.74,bloom:.4,env:.3,ao:.6,contrast:1.16,sat:1.1}};function wh(){return vh(Ch)}var Th={name:`forest`,sky:{top:4744318,bot:9413556,rainTop:3821668,rainBot:8360611,sunGlow:.3},fog:[170,900],sun:{color:14673390,intensity:2.5,dir:[-.35,.8,.3],rainColor:10925510,rainIntensity:2},hemi:{sky:11123917,ground:2771506,intensity:.75},ground:{g1:2054704,g2:1591848,far:1062430,rock:4871752,amp:16,rockFrom:40,patch:[.56,.47,.32],patchAmt:.6,patch2:[.4,.52,.34],patch2Amt:.5,hills:{n:12,h:[12,28],r:[70,130]},slope:{color:4871752,from:.14,to:.3,amt:.7},strata:{scale:2.6,amt:.2}},road:{color:4145735,rubber:.8,dust:[.36,.34,.24],dustAmt:.45,bump:.6},houses:`cabin`,facade:{h:.24,amt:.22},gravel:[6968374,5785134],trees:`forest`,treeNear:150,treeFar:64,treeMaxH:36,treeScale:1.12,puddles:!0,ambientRain:.72,ambientWet:.66,rainParticles:!0,clouds:!0,landmark:`tower`,fx:{sat:1.12,tint:[.97,1,1]},cloudTint:.7,mood:{exposure:1.05,bloom:.5,env:.35,asphalt:.85,ao:.65,contrast:1.12,sat:1.06}};function Eh(){return vh(Th)}var Dh={name:`neonStreet`,sky:{top:459540,bot:2232384,rainTop:656658,rainBot:1969200,sunGlow:.08},fog:[220,1100],sun:{color:12108031,intensity:1.1,dir:[.35,.82,-.25],rainColor:9075370,rainIntensity:.9},hemi:{sky:3423320,ground:1316382,intensity:.8},ground:{g1:2896188,g2:2567221,far:1711656,rock:3817548,amp:8,rockFrom:40,patch:[.6,.6,.62],patchAmt:.35,patch2:[.38,.38,.4],patch2Amt:.5,hills:null,slope:null,strata:null,grid:{size:3,amt:.3}},road:{color:4211532,rubber:.75,dust:[.5,.5,.56],dustAmt:.22,bump:.6},barrier:`concrete`,houses:null,facade:{h:.9,amt:.1},gravel:[3817548,3028030],trees:`street`,treeNear:28,treeFar:8,treeMaxH:20,treeScale:.85,night:!0,neon:!0,wall:`city`,buildings:`block`,clouds:!1,landmark:`arch`,fx:{sat:1.05,tint:[1.02,.97,1.04]},mood:{exposure:1.1,bloom:1.1,env:.45,envKind:`neon`,asphalt:.55,asphaltEnv:.18,ao:.65,contrast:1.1,sat:1.1,vignette:.24}};function Oh(){return vh(Dh)}var kh={circuitDay:vh,desertNight:bh,coastal:Sh,alpine:wh,forest:Eh,neonStreet:Oh};function Ah(e){return(kh[e]||vh)()}var jh={radius:56,dead:0,curve:1.3};function Mh(e,t=jh.radius,n=jh.dead,r=jh.curve){let i=Math.max(-1,Math.min(1,e/t)),a=Math.abs(i);return a<=n?0:Math.sign(i)*((a-n)/(1-n))**r}function Nh(e,t,n=jh.radius){let r=Math.hypot(e,t);return r<=n?[e,t]:[e/r*n,t/r*n]}var Ph=class{constructor(e=document){this.keys=new Set,this.touch={gas:!1,brake:!1,boost:!1},this.actions=[],this.padPrev=[],this.out={steer:0,throttle:0,brake:0,boost:!1};let t=[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Space`],n=()=>{let e=document.activeElement;return!!e&&(e.tagName===`INPUT`||e.tagName===`TEXTAREA`||e.isContentEditable)};addEventListener(`keydown`,e=>{if(n()||e.repeat)return;this.keys.add(e.code),t.includes(e.code)&&e.preventDefault();let r={KeyC:`camera`,KeyT:`autopilot`,KeyM:`mute`,KeyP:`pit`,Digit1:`tire:dry`,Digit2:`tire:wet`,Escape:`pause`};r[e.code]&&this.actions.push(r[e.code])}),addEventListener(`keyup`,e=>this.keys.delete(e.code)),this.touch.steer=0,this.holds={},this.joyPointer=null;let r=()=>{this.keys.clear();for(let e in this.touch)this.touch[e]=e===`steer`&&0;for(let e in this.holds)this.holds[e].clear();e.querySelectorAll(`[data-hold].down`).forEach(e=>e.classList.remove(`down`)),this.joyPointer=null,this.joyHide?.()};this.releaseAll=r,addEventListener(`blur`,r),document.addEventListener(`visibilitychange`,()=>{document.hidden&&r()}),addEventListener(`pagehide`,r);let i=e=>e.preventDefault();for(let e of[`dblclick`,`gesturestart`,`gesturechange`,`gestureend`])document.addEventListener(e,i,{passive:!1});let a=0;document.addEventListener(`touchend`,e=>{let t=performance.now();t-a<350&&e.preventDefault(),a=t},{passive:!1}),document.addEventListener(`touchmove`,e=>{e.touches.length>1&&e.preventDefault()},{passive:!1}),document.addEventListener(`contextmenu`,e=>{e.target.closest?.(`#hud`)&&e.preventDefault()}),document.addEventListener(`click`,e=>{e.target.closest?.(`[data-tap]`)&&(e.detail!==0||performance.now()-this.lastTap<600)&&(e.preventDefault(),e.stopImmediatePropagation())},!0),this.lastTap=-1e9,e.querySelectorAll(`[data-hold]`).forEach(e=>{let t=e.dataset.hold,n=this.holds[t]=new Set,r=()=>{let r=n.size>0;this.touch[t]=r,e.classList.toggle(`down`,r)};e.addEventListener(`pointerdown`,t=>{t.preventDefault();try{e.setPointerCapture(t.pointerId)}catch{}n.add(t.pointerId),r()});for(let t of[`pointerup`,`pointercancel`,`lostpointercapture`])e.addEventListener(t,e=>{n.delete(e.pointerId),r()});e.addEventListener(`contextmenu`,e=>e.preventDefault())});let o=e.getElementById?.(`joyZone`)??e.querySelector(`#joyZone`),s=e.querySelector(`#joyBase`),c=e.querySelector(`#joyKnob`);if(o&&s&&c){let e=0,t=0;this.joyHide=()=>{s.classList.remove(`on`),c.style.transform=`translate(-50%,-50%)`,this.touch.steer=0};let n=n=>{let[r,i]=Nh(n.clientX-e,n.clientY-t,jh.radius);c.style.transform=`translate(calc(-50% + ${r}px), calc(-50% + ${i}px))`,this.touch.steer=Mh(n.clientX-e)};o.addEventListener(`pointerdown`,r=>{if(this.joyPointer!==null)return;r.preventDefault();try{o.setPointerCapture(r.pointerId)}catch{}this.joyPointer=r.pointerId;let i=o.getBoundingClientRect();e=Math.max(i.left+jh.radius+6,Math.min(i.right-jh.radius-6,r.clientX)),t=Math.max(jh.radius+6,Math.min(innerHeight-jh.radius-6,r.clientY)),s.style.left=e+`px`,s.style.top=t+`px`,s.classList.add(`on`),n(r)}),o.addEventListener(`pointermove`,e=>{e.pointerId===this.joyPointer&&n(e)});let r=e=>{e.pointerId===this.joyPointer&&(this.joyPointer=null,this.joyHide())};for(let e of[`pointerup`,`pointercancel`,`lostpointercapture`])o.addEventListener(e,r)}}onTap(e,t){if(!e)return;e.dataset.tap=`1`;let n=!1;e.addEventListener(`pointerdown`,e=>{n=!0,e.stopPropagation()}),e.addEventListener(`pointercancel`,()=>{n=!1}),e.addEventListener(`pointerleave`,()=>{n=!1}),e.addEventListener(`pointerup`,e=>{n&&(n=!1,e.preventDefault(),e.stopPropagation(),this.lastTap=performance.now(),t(e))}),e.addEventListener(`click`,e=>{e.detail===0&&performance.now()-this.lastTap>600&&t(e)})}poll(){let e=this.keys,t=this.touch,n=this.out,r=(e.has(`ArrowRight`)||e.has(`KeyD`)?1:0)-(e.has(`ArrowLeft`)||e.has(`KeyA`)?1:0);r+=t.steer||0;let i=e.has(`ArrowUp`)||e.has(`KeyW`)||t.gas?1:0,a=e.has(`ArrowDown`)||e.has(`KeyS`)||t.brake?1:0,o=e.has(`ShiftLeft`)||e.has(`ShiftRight`)||e.has(`KeyB`)||t.boost,s=navigator.getGamepads?navigator.getGamepads():[];for(let e of s){if(!e||!e.connected)continue;let t=e.axes[0]||0;r+=de(t),e.buttons[14]?.pressed&&--r,e.buttons[15]?.pressed&&(r+=1),i=Math.max(i,e.buttons[7]?.value||0,+!!e.buttons[0]?.pressed),a=Math.max(a,e.buttons[6]?.value||0,+!!e.buttons[1]?.pressed),o||=!!(e.buttons[5]?.pressed||e.buttons[2]?.pressed);let n=this.padPrev[e.index]||[],s=(t,r)=>{e.buttons[t]?.pressed&&!n[t]&&this.actions.push(r)};s(3,`camera`),s(4,`pit`),s(8,`autopilot`),s(9,`pause`),this.padPrev[e.index]=e.buttons.map(e=>e.pressed)}return n.steer=Math.max(-1,Math.min(1,r)),n.throttle=i,n.brake=a,n.boost=o,n}takeActions(){let e=this.actions;return this.actions=[],e}},Fh=e=>440*2**((e-69)/12),Ih=[0,3,7,12,10,7,3,7,0,3,7,10,12,15,12,7],Lh=[0,0,-5,-5,-2,-2,-7,-7],Rh=e=>Math.max(0,Math.min(1,e));function zh(e,t,n=0){let r=Rh(Math.max(0,e)/Math.max(1,t)),i=e=>((e+1)/7)**.85,a=0;for(;a<6&&r>=i(a);)a++;a<n&&r>i(n-1)-.06&&(a=n);let o=a?i(a-1):0,s=i(a),c=.3+.7*Rh((r-o)/(s-o));return{gear:a,rpm:a===0?.2+.8*Rh(r/s):c}}var Bh=class{constructor(){this.ctx=null,this.muted=localStorage.getItem(`racer-mute`)===`1`,this.step=0,this.music=!1}init(){if(this.ctx){this.ctx.resume?.();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=this.ctx=new e;this.master=t.createGain(),this.master.gain.value=this.muted?0:.5,this.master.connect(t.destination),this.eg=t.createGain(),this.eg.gain.value=0,this.ef=t.createBiquadFilter(),this.ef.type=`lowpass`,this.ef.frequency.value=900,this.o1=t.createOscillator(),this.o1.type=`sawtooth`,this.o2=t.createOscillator(),this.o2.type=`square`,this.o1.connect(this.ef),this.o2.connect(this.ef),this.ef.connect(this.eg),this.eg.connect(this.master),this.o1.start(),this.o2.start(),this._initFx(),this.mg=t.createGain(),this.mg.gain.value=.12,this.mg.connect(this.master),this.nextT=t.currentTime+.1,this.timer=setInterval(()=>this._music(),60)}setMuted(e){this.muted=e,localStorage.setItem(`racer-mute`,e?`1`:`0`),this.master&&this.master.gain.setTargetAtTime(e?0:.5,this.ctx.currentTime,.02)}_note(e,t,n,r,i){let a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type=r,a.frequency.value=e,o.gain.setValueAtTime(i,t),o.gain.exponentialRampToValueAtTime(1e-4,t+n),a.connect(o),o.connect(this.mg),a.start(t),a.stop(t+n+.02)}_music(){if(!this.ctx||!this.music){this.ctx&&(this.nextT=Math.max(this.nextT,this.ctx.currentTime));return}let e=60/150/2;for(;this.nextT<this.ctx.currentTime+.25;){let t=this.step++;this._note(Fh(69+Ih[t%16]+(Math.floor(t/16)%2?5:0)),this.nextT,e*.9,`square`,.35),t%2==0&&this._note(Fh(45+Lh[t/2%8|0]),this.nextT,e*1.8,`triangle`,.9),this.nextT+=e}}_noise(){let e=this.ctx,t=e.createBuffer(1,e.sampleRate*2,e.sampleRate),n=t.getChannelData(0);for(let e=0;e<n.length;e++)n[e]=Math.random()*2-1;let r=e.createBufferSource();return r.buffer=t,r.loop=!0,r}_initFx(){let e=this.ctx;this.sq=e.createGain(),this.sq.gain.value=0,this.sqf=e.createBiquadFilter(),this.sqf.type=`bandpass`,this.sqf.frequency.value=2100,this.sqf.Q.value=6,this.nz1=this._noise(),this.nz1.connect(this.sqf),this.sqf.connect(this.sq),this.sq.connect(this.master),this.nz1.start(),this.kr=e.createGain(),this.kr.gain.value=0,this.krm=e.createGain(),this.krm.gain.value=.5,this.krl=e.createOscillator(),this.krl.type=`square`,this.krl.frequency.value=30;let t=e.createGain();t.gain.value=.5,this.krl.connect(t),t.connect(this.krm.gain);let n=e.createBiquadFilter();n.type=`lowpass`,n.frequency.value=260,this.nz2=this._noise(),this.nz2.connect(n),n.connect(this.krm),this.krm.connect(this.kr),this.kr.connect(this.master),this.nz2.start(),this.krl.start(),this.gear=0,this.shiftT=0,this.rpm=.2,this.lastRpm=.2,this.audioSmooth=0,this.scrub=0}drive(e){if(!this.ctx)return;let t=this.ctx.currentTime,n=Math.max(.001,e.dt||1/60),r=zh(e.v,e.vTop,this.gear);r.gear>this.gear&&(this.shiftT=.09,this.shiftBlip(r.gear)),this.gear=r.gear,this.shiftT=Math.max(0,this.shiftT-n);let i=Rh(r.rpm+(e.throttle>.1?.04:-.03));this.audioSmooth=Math.min(.25,(this.audioSmooth||0)+n);let a=this.rpm+(i-this.rpm)*(1-Math.exp(-this.audioSmooth/.055));this.audioSmooth=0,this.rpm=a;let o=42+a*168+(e.boosting?8:0);this.o1.frequency.setTargetAtTime(o,t,.03),this.o2.frequency.setTargetAtTime(o*.5,t,.03),this.ef.frequency.setTargetAtTime(450+a*1100+e.throttle*600,t,.06);let s=this.shiftT>0?.15:1;if(this.eg.gain.setTargetAtTime(e.on?(.08+e.throttle*.08+a*.03)*s*(this.voiceDuck?1-this.voiceDuck*.55:1):0,t,this.shiftT>0?.01:.08),!this.sq)return;let c=e.on?he(e.lat||0,e.slipAngle||0,Math.max(e.lock||0,(e.slip||0)*.85)):0;this.scrub+=(c-this.scrub)*(1-Math.exp(-n/.055));let l=this.scrub;this.sq.gain.setTargetAtTime(l*l*.07,t,.06),this.sqf.frequency.setTargetAtTime(1900+l*700+e.v*3,t,.1);let u=e.on&&e.kerb?Math.min(1,e.v/40):0;this.kr.gain.setTargetAtTime(u*.22,t,.04),this.krl.frequency.setTargetAtTime(14+e.v*.5,t,.1)}engine(e,t,n,r){this.drive({v:e,vTop:t,throttle:n,brake:0,lat:0,kerb:!1,on:r})}shiftBlip(){if(!this.ctx)return;let e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type=`square`,t.frequency.setValueAtTime(260,e),t.frequency.exponentialRampToValueAtTime(110,e+.07),n.gain.setValueAtTime(.05,e),n.gain.exponentialRampToValueAtTime(1e-4,e+.08),t.connect(n),n.connect(this.master),t.start(e),t.stop(e+.1)}beep(e=660,t=.15,n=`square`,r=.3){if(!this.ctx)return;let i=this.ctx.currentTime,a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type=n,a.frequency.value=e,o.gain.setValueAtTime(r,i),o.gain.exponentialRampToValueAtTime(1e-4,i+t),a.connect(o),o.connect(this.master),a.start(i),a.stop(i+t+.02)}thump(){if(!this.ctx)return;let e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type=`sawtooth`,t.frequency.setValueAtTime(140,e),t.frequency.exponentialRampToValueAtTime(40,e+.2),n.gain.setValueAtTime(.5,e),n.gain.exponentialRampToValueAtTime(1e-4,e+.25),t.connect(n),n.connect(this.master),t.start(e),t.stop(e+.3)}},Vh={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},Hh=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},Uh=new No(-1,1,1,-1,0,1),Wh=new class extends hi{constructor(){super(),this.setAttribute(`position`,new K([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new K([0,2,0,0,2,0],2))}},Gh=class{constructor(e){this._mesh=new zi(Wh,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Uh)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Kh=class extends Hh{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Ha?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=za.clone(e.uniforms),this.material=new Ha({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Gh(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},qh=class extends Hh{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},Jh=class extends Hh{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},Yh=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new U);this._width=n.width,this._height=n.height,t=new In(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Me}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Kh(Vh),this.copyPass.material.blending=0,this.timer=new Bo}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}qh!==void 0&&(r instanceof qh?n=!0:r instanceof Jh&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new U);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Xh=class extends Hh{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new G}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},Zh={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new G(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Qh=class e extends Hh{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new U(256,256):new U(e.x,e.y),this.clearColor=new G(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new In(i,a,{type:Me,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new In(i,a,{type:Me,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new In(i,a,{type:Me,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Zh;this.highPassUniforms=za.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ha({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new U(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=za.clone(Vh.uniforms),this.blendMaterial=new Ha({uniforms:this.copyUniforms,vertexShader:Vh.vertexShader,fragmentShader:Vh.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new G,this._oldClearAlpha=1,this._basic=new Di,this._fsQuad=new Gh(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new U(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new Ha({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new U(.5,.5)},direction:{value:new U(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Ha({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Qh.BlurDirectionX=new U(1,0),Qh.BlurDirectionY=new U(0,1);var $h={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

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

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},eg=class extends Hh{constructor(){super(),this.isOutputPass=!0,this.uniforms=za.clone($h.uniforms),this.material=new Ua({name:$h.name,uniforms:this.uniforms,vertexShader:$h.vertexShader,fragmentShader:$h.fragmentShader}),this._fsQuad=new Gh(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Cn.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},tg={name:`SMAAEdgesShader`,defines:{SMAA_THRESHOLD:`0.1`},uniforms:{tDiffuse:{value:null},resolution:{value:new U(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		void SMAAEdgeDetectionVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAAEdgeDetectionVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {
			vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );

			// Calculate color deltas:
			vec4 delta;
			vec3 C = texture2D( colorTex, texcoord ).rgb;

			vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;
			vec3 t = abs( C - Cleft );
			delta.x = max( max( t.r, t.g ), t.b );

			vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;
			t = abs( C - Ctop );
			delta.y = max( max( t.r, t.g ), t.b );

			// We do the usual threshold:
			vec2 edges = step( threshold, delta.xy );

			// Then discard if there is no edge:
			if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )
				discard;

			// Calculate right and bottom deltas:
			vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;
			t = abs( C - Cright );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;
			t = abs( C - Cbottom );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the maximum delta in the direct neighborhood:
			float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );

			// Calculate left-left and top-top deltas:
			vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;
			t = abs( C - Cleftleft );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;
			t = abs( C - Ctoptop );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the final maximum delta:
			maxDelta = max( max( maxDelta, delta.z ), delta.w );

			// Local contrast adaptation in action:
			edges.xy *= step( 0.5 * maxDelta, delta.xy );

			return vec4( edges, 0.0, 0.0 );
		}

		void main() {

			gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );

		}`},ng={name:`SMAAWeightsShader`,defines:{SMAA_MAX_SEARCH_STEPS:`8`,SMAA_AREATEX_MAX_DISTANCE:`16`,SMAA_AREATEX_PIXEL_SIZE:`( 1.0 / vec2( 160.0, 560.0 ) )`,SMAA_AREATEX_SUBTEX_SIZE:`( 1.0 / 7.0 )`},uniforms:{tDiffuse:{value:null},tArea:{value:null},tSearch:{value:null},resolution:{value:new U(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];
		varying vec2 vPixcoord;

		void SMAABlendingWeightCalculationVS( vec2 texcoord ) {
			vPixcoord = texcoord / resolution;

			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components

			// And these for the searches, they indicate the ends of the loops:
			vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );

		}

		void main() {

			vUv = uv;

			SMAABlendingWeightCalculationVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )

		uniform sampler2D tDiffuse;
		uniform sampler2D tArea;
		uniform sampler2D tSearch;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[3];
		varying vec2 vPixcoord;

		#if __VERSION__ == 100
		vec2 round( vec2 x ) {
			return sign( x ) * floor( abs( x ) + 0.5 );
		}
		#endif

		float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {
			// Not required if searchTex accesses are set to point:
			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
			e.r = bias + e.r * scale;
			return 255.0 * texture2D( searchTex, e, 0.0 ).r;
		}

		float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			/**
				* @PSEUDO_GATHER4
				* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
				* sample between edge, thus fetching four edges in a row.
				* Sampling with different offsets in each direction allows to disambiguate
				* which edges are active from the four fetched ones.
				*/
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			// We correct the previous (-0.25, -0.125) offset we applied:
			texcoord.x += 0.25 * resolution.x;

			// The searches are bias by 1, so adjust the coords accordingly:
			texcoord.x += resolution.x;

			// Disambiguate the length added by the last step:
			texcoord.x += 2.0 * resolution.x; // Undo last step
			texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

			return texcoord.x;
		}

		float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			texcoord.x -= 0.25 * resolution.x;
			texcoord.x -= resolution.x;
			texcoord.x -= 2.0 * resolution.x;
			texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );

			return texcoord.x;
		}

		float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y; // WebGL port note: Changed sign
			texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y; // WebGL port note: Changed sign
			texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {
			// Rounding prevents precision errors of bilinear filtering:
			vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;

			// We do a scale and bias for mapping to texel space:
			texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );

			// Move to proper place, according to the subpixel offset:
			texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;

			return texture2D( areaTex, texcoord, 0.0 ).rg;
		}

		vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {
			vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );

			vec2 e = texture2D( edgesTex, texcoord ).rg;

			if ( e.g > 0.0 ) { // Edge at north
				vec2 d;

				// Find the distance to the left:
				vec2 coords;
				coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );
				coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
				d.x = coords.x;

				// Now fetch the left crossing edges, two at a time using bilinear
				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
				// discern what value each edge has:
				float e1 = texture2D( edgesTex, coords, 0.0 ).r;

				// Find the distance to the right:
				coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );
				d.y = coords.x;

				// We want the distances to be in pixel units (doing this here allow to
				// better interleave arithmetic and memory accesses):
				d = d / resolution.x - pixcoord.x;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the right crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;

				// Ok, we know how this pattern looks like, now it is time for getting
				// the actual area:
				weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );
			}

			if ( e.r > 0.0 ) { // Edge at west
				vec2 d;

				// Find the distance to the top:
				vec2 coords;

				coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );
				coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;
				d.x = coords.y;

				// Fetch the top crossing edges:
				float e1 = texture2D( edgesTex, coords, 0.0 ).g;

				// Find the distance to the bottom:
				coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );
				d.y = coords.y;

				// We want the distances to be in pixel units:
				d = d / resolution.y - pixcoord.y;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the bottom crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;

				// Get the area for this direction:
				weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );
			}

			return weights;
		}

		void main() {

			gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );

		}`},rg={name:`SMAABlendShader`,uniforms:{tDiffuse:{value:null},tColor:{value:null},resolution:{value:new U(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		void SMAANeighborhoodBlendingVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAANeighborhoodBlendingVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform sampler2D tColor;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {
			// Fetch the blending weights for current pixel:
			vec4 a;
			a.xz = texture2D( blendTex, texcoord ).xz;
			a.y = texture2D( blendTex, offset[ 1 ].zw ).g;
			a.w = texture2D( blendTex, offset[ 1 ].xy ).a;

			// Is there any blending weight with a value greater than 0.0?
			if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {
				return texture2D( colorTex, texcoord, 0.0 );
			} else {
				// Up to 4 lines can be crossing a pixel (one through each edge). We
				// favor blending by choosing the line with the maximum weight for each
				// direction:
				vec2 offset;
				offset.x = a.a > a.b ? a.a : -a.b; // left vs. right
				offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs

				// Then we go in the direction that has the maximum weight:
				if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical
					offset.y = 0.0;
				} else {
					offset.x = 0.0;
				}

				// Fetch the opposite color and lerp by hand:
				vec4 C = texture2D( colorTex, texcoord, 0.0 );
				texcoord += sign( offset ) * resolution;
				vec4 Cop = texture2D( colorTex, texcoord, 0.0 );
				float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );

				// WebGL port note: Added gamma correction
				C.xyz = pow(C.xyz, vec3(2.2));
				Cop.xyz = pow(Cop.xyz, vec3(2.2));
				vec4 mixed = mix(C, Cop, s);
				mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));

				return mixed;
			}
		}

		void main() {

			gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );

		}`},ig=class extends Hh{constructor(){super(),this._edgesRT=new In(1,1,{depthBuffer:!1,type:Me}),this._edgesRT.texture.name=`SMAAPass.edges`,this._weightsRT=new In(1,1,{depthBuffer:!1,type:Me}),this._weightsRT.texture.name=`SMAAPass.weights`;let e=this,t=new Image;t.src=this._getAreaTexture(),t.onload=function(){e._areaTexture.needsUpdate=!0},this._areaTexture=new Nn,this._areaTexture.name=`SMAAPass.area`,this._areaTexture.image=t,this._areaTexture.minFilter=z,this._areaTexture.generateMipmaps=!1,this._areaTexture.flipY=!1;let n=new Image;n.src=this._getSearchTexture(),n.onload=function(){e._searchTexture.needsUpdate=!0},this._searchTexture=new Nn,this._searchTexture.name=`SMAAPass.search`,this._searchTexture.image=n,this._searchTexture.magFilter=xe,this._searchTexture.minFilter=xe,this._searchTexture.generateMipmaps=!1,this._searchTexture.flipY=!1,this._uniformsEdges=za.clone(tg.uniforms),this._materialEdges=new Ha({defines:Object.assign({},tg.defines),uniforms:this._uniformsEdges,vertexShader:tg.vertexShader,fragmentShader:tg.fragmentShader}),this._uniformsWeights=za.clone(ng.uniforms),this._uniformsWeights.tDiffuse.value=this._edgesRT.texture,this._uniformsWeights.tArea.value=this._areaTexture,this._uniformsWeights.tSearch.value=this._searchTexture,this._materialWeights=new Ha({defines:Object.assign({},ng.defines),uniforms:this._uniformsWeights,vertexShader:ng.vertexShader,fragmentShader:ng.fragmentShader}),this._uniformsBlend=za.clone(rg.uniforms),this._uniformsBlend.tDiffuse.value=this._weightsRT.texture,this._materialBlend=new Ha({uniforms:this._uniformsBlend,vertexShader:rg.vertexShader,fragmentShader:rg.fragmentShader}),this._fsQuad=new Gh(null)}render(e,t,n){this._uniformsEdges.tDiffuse.value=n.texture,this._fsQuad.material=this._materialEdges,e.setRenderTarget(this._edgesRT),this.clear&&e.clear(),this._fsQuad.render(e),this._fsQuad.material=this._materialWeights,e.setRenderTarget(this._weightsRT),this.clear&&e.clear(),this._fsQuad.render(e),this._uniformsBlend.tColor.value=n.texture,this._fsQuad.material=this._materialBlend,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this._fsQuad.render(e))}setSize(e,t){this._edgesRT.setSize(e,t),this._weightsRT.setSize(e,t),this._materialEdges.uniforms.resolution.value.set(1/e,1/t),this._materialWeights.uniforms.resolution.value.set(1/e,1/t),this._materialBlend.uniforms.resolution.value.set(1/e,1/t)}dispose(){this._edgesRT.dispose(),this._weightsRT.dispose(),this._areaTexture.dispose(),this._searchTexture.dispose(),this._materialEdges.dispose(),this._materialWeights.dispose(),this._materialBlend.dispose(),this._fsQuad.dispose()}_getAreaTexture(){return`data:image/png;base64,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`}_getSearchTexture(){return`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII=`}},ag={name:`FXAAShader`,uniforms:{tDiffuse:{value:null},resolution:{value:new U(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`},og=class extends Kh{constructor(){super(ag)}setSize(e,t){this.material.uniforms.resolution.value.set(1/e,1/t)}},sg={name:`GTAOShader`,defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new U},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new zn},cameraProjectionMatrixInverse:{value:new zn},cameraWorldMatrix:{value:new zn},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new W(-1,-1,-1)},sceneBoxMax:{value:new W(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).r;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).r;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				#if PERSPECTIVE_CAMERA == 1
					vec3 viewDir = normalize(-viewPos.xyz);
				#else
					vec3 viewDir = vec3(0., 0., 1.);
				#endif
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},cg={name:`GTAODepthShader`,defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},lg={name:`GTAOBlendShader`,uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function ug(e=5){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=dg(t),r=n.length,i=new Uint8Array(r*4);for(let e=0;e<r;++e){let t=n[e],a=2*Math.PI*t/r,o=new W(Math.cos(a),Math.sin(a),0).normalize();i[e*4]=(o.x*.5+.5)*255,i[e*4+1]=(o.y*.5+.5)*255,i[e*4+2]=127,i[e*4+3]=255}let a=new Hi(i,t,t);return a.wrapS=ye,a.wrapT=ye,a.needsUpdate=!0,a}function dg(e){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=t*t,r=Array(n).fill(0),i=Math.floor(t/2),a=t-1;for(let e=1;e<=n;)i===-1&&a===t?(a=t-2,i=0):(a===t&&(a=0),i<0&&(i=t-1)),r[i*t+a]===0?(r[i*t+a]=e++,a++,i--):(a-=2,i++);return r}var fg={name:`PoissonDenoiseShader`,defines:{SAMPLES:16,SAMPLE_VECTORS:pg(16,2,1),NORMAL_VECTOR_TYPE:1},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new U},cameraProjectionMatrixInverse:{value:new zn},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).r;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).r;
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function pg(e,t,n){let r=mg(e,t,n),i=`vec3[SAMPLES](`;for(let t=0;t<e;t++){let n=r[t];i+=`vec3(${n.x}, ${n.y}, ${n.z})${t<e-1?`,`:`)`}`}return i}function mg(e,t,n){let r=[];for(let i=0;i<e;i++){let a=2*Math.PI*t*i/e,o=(i/(e-1))**n;r.push(new W(Math.cos(a),Math.sin(a),o))}return r}var hg=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,r,i,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,s=Math.floor(e+o),c=Math.floor(t+o),l=(3-Math.sqrt(3))/6,u=(s+c)*l,d=s-u,f=c-u,p=e-d,m=t-f,h,g;p>m?(h=1,g=0):(h=0,g=1);let _=p-h+l,v=m-g+l,y=p-1+2*l,b=m-1+2*l,x=s&255,S=c&255,C=this.perm[x+this.perm[S]]%12,w=this.perm[x+h+this.perm[S+g]]%12,T=this.perm[x+1+this.perm[S+1]]%12,E=.5-p*p-m*m;E<0?n=0:(E*=E,n=E*E*this._dot(this.grad3[C],p,m));let D=.5-_*_-v*v;D<0?r=0:(D*=D,r=D*D*this._dot(this.grad3[w],_,v));let O=.5-y*y-b*b;return O<0?i=0:(O*=O,i=O*O*this._dot(this.grad3[T],y,b)),70*(n+r+i)}noise3d(e,t,n){let r,i,a,o,s=(e+t+n)*(1/3),c=Math.floor(e+s),l=Math.floor(t+s),u=Math.floor(n+s),d=1/6,f=(c+l+u)*d,p=c-f,m=l-f,h=u-f,g=e-p,_=t-m,v=n-h,y,b,x,S,C,w;g>=_?_>=v?(y=1,b=0,x=0,S=1,C=1,w=0):g>=v?(y=1,b=0,x=0,S=1,C=0,w=1):(y=0,b=0,x=1,S=1,C=0,w=1):_<v?(y=0,b=0,x=1,S=0,C=1,w=1):g<v?(y=0,b=1,x=0,S=0,C=1,w=1):(y=0,b=1,x=0,S=1,C=1,w=0);let T=g-y+d,E=_-b+d,D=v-x+d,O=g-S+2*d,k=_-C+2*d,A=v-w+2*d,j=g-1+3*d,M=_-1+3*d,N=v-1+3*d,ee=c&255,P=l&255,F=u&255,te=this.perm[ee+this.perm[P+this.perm[F]]]%12,I=this.perm[ee+y+this.perm[P+b+this.perm[F+x]]]%12,ne=this.perm[ee+S+this.perm[P+C+this.perm[F+w]]]%12,re=this.perm[ee+1+this.perm[P+1+this.perm[F+1]]]%12,ie=.6-g*g-_*_-v*v;ie<0?r=0:(ie*=ie,r=ie*ie*this._dot3(this.grad3[te],g,_,v));let ae=.6-T*T-E*E-D*D;ae<0?i=0:(ae*=ae,i=ae*ae*this._dot3(this.grad3[I],T,E,D));let oe=.6-O*O-k*k-A*A;oe<0?a=0:(oe*=oe,a=oe*oe*this._dot3(this.grad3[ne],O,k,A));let se=.6-j*j-M*M-N*N;return se<0?o=0:(se*=se,o=se*se*this._dot3(this.grad3[re],j,M,N)),32*(r+i+a+o)}noise4d(e,t,n,r){let i=this.grad4,a=this.simplex,o=this.perm,s=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,l,u,d,f,p,m=(e+t+n+r)*s,h=Math.floor(e+m),g=Math.floor(t+m),_=Math.floor(n+m),v=Math.floor(r+m),y=(h+g+_+v)*c,b=h-y,x=g-y,S=_-y,C=v-y,w=e-b,T=t-x,E=n-S,D=r-C,O=w>T?32:0,k=w>E?16:0,A=T>E?8:0,j=w>D?4:0,M=T>D?2:0,N=+(E>D),ee=O+k+A+j+M+N,P=+(a[ee][0]>=3),F=+(a[ee][1]>=3),te=+(a[ee][2]>=3),I=+(a[ee][3]>=3),ne=+(a[ee][0]>=2),re=+(a[ee][1]>=2),ie=+(a[ee][2]>=2),ae=+(a[ee][3]>=2),oe=+(a[ee][0]>=1),se=+(a[ee][1]>=1),ce=+(a[ee][2]>=1),le=+(a[ee][3]>=1),ue=w-P+c,de=T-F+c,fe=E-te+c,pe=D-I+c,me=w-ne+2*c,he=T-re+2*c,L=E-ie+2*c,ge=D-ae+2*c,_e=w-oe+3*c,ve=T-se+3*c,ye=E-ce+3*c,be=D-le+3*c,R=w-1+4*c,xe=T-1+4*c,Se=E-1+4*c,Ce=D-1+4*c,z=h&255,we=g&255,Te=_&255,Ee=v&255,B=o[z+o[we+o[Te+o[Ee]]]]%32,De=o[z+P+o[we+F+o[Te+te+o[Ee+I]]]]%32,Oe=o[z+ne+o[we+re+o[Te+ie+o[Ee+ae]]]]%32,ke=o[z+oe+o[we+se+o[Te+ce+o[Ee+le]]]]%32,Ae=o[z+1+o[we+1+o[Te+1+o[Ee+1]]]]%32,je=.6-w*w-T*T-E*E-D*D;je<0?l=0:(je*=je,l=je*je*this._dot4(i[B],w,T,E,D));let Me=.6-ue*ue-de*de-fe*fe-pe*pe;Me<0?u=0:(Me*=Me,u=Me*Me*this._dot4(i[De],ue,de,fe,pe));let Ne=.6-me*me-he*he-L*L-ge*ge;Ne<0?d=0:(Ne*=Ne,d=Ne*Ne*this._dot4(i[Oe],me,he,L,ge));let Pe=.6-_e*_e-ve*ve-ye*ye-be*be;Pe<0?f=0:(Pe*=Pe,f=Pe*Pe*this._dot4(i[ke],_e,ve,ye,be));let Fe=.6-R*R-xe*xe-Se*Se-Ce*Ce;return Fe<0?p=0:(Fe*=Fe,p=Fe*Fe*this._dot4(i[Ae],R,xe,Se,Ce)),27*(l+u+d+f+p)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,r){return e[0]*t+e[1]*n+e[2]*r}_dot4(e,t,n,r,i){return e[0]*t+e[1]*n+e[2]*r+e[3]*i}},gg=class e extends Hh{constructor(e,t,n=512,r=512,i,a,o){super(),this.width=n,this.height=r,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=ug(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new In(this.width,this.height,{type:Me,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new Ha({defines:Object.assign({},sg.defines),uniforms:za.clone(sg.uniforms),vertexShader:sg.vertexShader,fragmentShader:sg.fragmentShader,blending:0,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=+!!this.camera.isPerspectiveCamera,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new Ka,this.normalMaterial.blending=0,this.pdMaterial=new Ha({defines:Object.assign({},fg.defines),uniforms:za.clone(fg.uniforms),vertexShader:fg.vertexShader,fragmentShader:fg.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new Ha({defines:Object.assign({},cg.defines),uniforms:za.clone(cg.uniforms),vertexShader:cg.vertexShader,fragmentShader:cg.fragmentShader,blending:0}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Ha({uniforms:za.clone(Vh.uniforms),vertexShader:Vh.vertexShader,fragmentShader:Vh.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this.blendMaterial=new Ha({uniforms:za.clone(lg.uniforms),vertexShader:lg.vertexShader,fragmentShader:lg.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:5,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this._fsQuad=new Gh(null),this._originalClearColor=new G,this.setGBuffer(i?i.depthTexture:void 0,i?i.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget&&this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget&&this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){if(e!==void 0)this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1;else{if(this.normalRenderTarget===void 0){let e=new pa;e.format=He,e.type=Fe,this.normalRenderTarget=new In(this.width,this.height,{minFilter:xe,magFilter:xe,type:Me,depthTexture:e})}this.depthTexture=this.normalRenderTarget.depthTexture,this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0}let n=+!!this.normalTexture;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.needsUpdate=!0,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.needsUpdate=!0,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&+!!e.screenSpaceRadius!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=+!!e.screenSpaceRadius,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=pg(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,n,r){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case e.OUTPUT.Off:break;case e.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalTexture||null,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:n);break;default:console.warn(`THREE.GTAOPass: Unknown output type.`)}}_renderPass(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r=t.clearColor||r,i=t.clearAlpha||i,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){(e.isPoints||e.isLine||e.isLine2)&&e.visible&&(e.visible=!1,t.push(e))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new hg,n=e*e*4,r=new Uint8Array(n);for(let n=0;n<e;n++)for(let i=0;i<e;i++){let a=n,o=i;r[(n*e+i)*4]=(t.noise(a,o)*.5+.5)*255,r[(n*e+i)*4+1]=(t.noise(a+e,o)*.5+.5)*255,r[(n*e+i)*4+2]=(t.noise(a,o+e)*.5+.5)*255,r[(n*e+i)*4+3]=(t.noise(a+e,o+e)*.5+.5)*255}let i=new Hi(r,e,e,Be,Ee);return i.wrapS=ye,i.wrapT=ye,i.needsUpdate=!0,i}};gg.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var _g=class extends Sr{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new ga;e.deleteAttribute(`uv`);let t=new Wa({side:1}),n=new Wa,r=new Mo(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new zi(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new Zi(e,n,6),o=new fr;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new zi(e,vg(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new zi(e,vg(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new zi(e,vg(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new zi(e,vg(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new zi(e,vg(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new zi(e,vg(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function vg(e){return new qa({color:0,emissive:16777215,emissiveIntensity:e})}var yg=[`low`,`medium`,`high`],bg={low:{dprCap:1,shadow:1024,ao:`none`,aoScale:0,bloom:{strength:.32,radius:.2,threshold:1,scale:.5},aa:`fxaa`,props:0},medium:{dprCap:1.5,shadow:1536,ao:`gtao`,aoScale:.5,bloom:{strength:.36,radius:.28,threshold:1,scale:.5},aa:`smaa`,props:1},high:{dprCap:2,shadow:2048,ao:`gtao`,aoScale:1,bloom:{strength:.4,radius:.32,threshold:1,scale:1},aa:`smaa`,props:2}},xg=e=>yg.includes(e)?e:null,Sg=e=>Math.max(0,yg.indexOf(e));function Cg({touch:e=!1,width:t=1280,height:n=720}={}){return e?Math.min(t,n)<=520||Math.max(t,n)<=960?`low`:`medium`:`high`}var wg=(e,t)=>Math.max(1,Math.min(e||1,bg[t]?.dprCap??1)),Tg={uniforms:{tDiffuse:{value:null},res:{value:new U(1280,720)},rain:{value:0},time:{value:0},sat:{value:1},contrast:{value:1},vignette:{value:.18},tint:{value:new W(1,1,1)},speed:{value:0}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`uniform sampler2D tDiffuse; uniform vec2 res; uniform float rain, time, sat, speed, contrast, vignette; uniform vec3 tint; varying vec2 vUv;
    float h11(float n){ return fract(sin(n*91.345)*47453.5453); }
    void main(){
      vec4 s = texture2D(tDiffuse, vUv); vec3 c = s.rgb;
      float l = dot(c, vec3(.2126,.7152,.0722));
      c = max(mix(vec3(l), c, sat), 0.) * tint;
      // S-curve around mid grey: deeper shadows, brighter mids, highlights roll off instead of clipping
      vec3 sc = c * c * (3. - 2. * c);
      c = mix(c, sc, clamp(contrast - 1., 0., 1.));
      vec2 dv = (vUv - .5) * vec2(res.x / res.y, 1.);
      c *= 1. - vignette * smoothstep(.35, 1.05, length(dv));
      float unit = res.y / 360.; // streak geometry scales with the frame height, not with pixels
      if (rain > 0.02) {
        vec2 p = vUv * res / unit; float a = 0.;
        for (int k = 0; k < 2; k++) {
          float sp = k == 0 ? 3. : 5., spd = k == 0 ? 95. : 150., len = k == 0 ? 14. : 9.;
          float u = p.x - p.y*0.25, w = p.y;
          float col = floor(u / sp), r = h11(col + float(k)*17.3);
          float edge = abs(fract(u / sp) - .5) * sp;
          if (edge < .35 && r < rain*0.4) {
            float q = fract((w + time*spd*(0.8 + r*0.5)) / (len*(1.8 + r*2.)) + r*9.);
            a = max(a, q < 0.35 ? 1. - q/0.35 : 0.);
          }
        }
        c = mix(c, vec3(.78,.84,.92), a*0.22*rain);
      }
      if (speed > 0.02) {
        float rr = length(dv), ang = atan(dv.y, dv.x);
        float ray = floor(ang * 64.), rh = h11(ray + 3.1);
        float ph = fract(rr * 2.2 - time * (1.6 + rh * 1.4) + rh * 7.);
        float edge = smoothstep(.5, .85, rr);
        float on = step(1. - speed * .45, rh) * step(ph, .22) * edge;
        c = mix(c, vec3(1.), on * .16 * speed);
      }
      gl_FragColor = vec4(c, s.a);
    }`},Eg=class extends gg{_overrideVisibility(){let e=this._visibilityCache;this.scene.traverse(t=>{if(!t.visible)return;let n=t.material;(t.isPoints||t.isLine||n&&!Array.isArray(n)&&(n.transparent||n.isShaderMaterial||n.isMeshBasicMaterial)||t.userData.noAO)&&(t.visible=!1,e.push(t))})}};function Dg(e,t=`room`){if(t===`neon`){let t=new Sr;t.background=new G(459790);let n=(e,n,r,i,a,o)=>{let s=new zi(new Aa(a,o),new Di({color:new G(e).multiplyScalar(4),side:2}));s.position.set(n,r,i),s.lookAt(0,0,0),t.add(s)};n(16722902,12,4,-6,6,5),n(2617599,-12,5,-4,7,4),n(16753183,2,6,13,8,3),n(4877311,-6,3,-13,8,5),n(16730730,13,7,8,4,6);let r=new zi(new Aa(40,40),new Di({color:2758216,side:2}));return r.position.y=14,r.rotation.x=Math.PI/2,t.add(r),e.fromScene(t,.03).texture}if(t===`night`){let t=new Sr;t.background=new G(329487);for(let e=0;e<6;e++){let n=e/6*Math.PI*2,r=new zi(new Aa(5,2.5),new Di({color:new G(3,2.8,2.4),side:2}));r.position.set(Math.cos(n)*14,7,Math.sin(n)*14),r.lookAt(0,0,0),t.add(r)}let n=new zi(new Aa(40,40),new Di({color:1317946,side:2}));return n.position.y=14,n.rotation.x=Math.PI/2,t.add(n),e.fromScene(t,.03).texture}if(t===`sky`){let t=new Sr,n=new zi(new Ma(20,24,12),new Ha({side:1,uniforms:{},vertexShader:`varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,fragmentShader:`varying vec3 vP; void main(){ float y = vP.y; vec3 sky = mix(vec3(.55,.68,.85), vec3(.18,.36,.78), smoothstep(0.,.8,y)); vec3 gnd = mix(vec3(.10,.10,.11), vec3(.22,.24,.2), smoothstep(-.5,0.,y)); vec3 c = y > 0. ? sky : gnd; c += vec3(1.,.95,.85) * 1.6 * smoothstep(.99,.997, dot(vP, normalize(vec3(-.5,.7,.45)))); gl_FragColor = vec4(c,1.); }`}));t.add(n);for(let[e,n,r]of[[0,14,0],[10,6,-8]]){let i=new zi(new Aa(14,3),new Di({color:new G(.85,.85,.85),side:2}));i.position.set(e,n,r),i.lookAt(0,0,0),t.add(i)}return e.fromScene(t,.02).texture}return e.fromScene(new _g,.04).texture}var Og=class{constructor(e,t,n){this.renderer=e,this.scene=t,this.camera=n,this.preset=null,this.gfx=null,this.w=1,this.h=1,this.dpr=1,this.fx={rain:0,time:0,sat:1,tint:[1,1,1],speed:0},this.mood={exposure:1,bloom:1,aoBlend:.6,contrast:1.12,sat:1.1,vignette:.18,threshold:1},this.pmrem=new Cs(e),this.envs={}}env(e=`room`){return this.envs[e]||(this.envs[e]=Dg(this.pmrem,e)),this.envs[e]}setGfx(e){if(e===this.gfx&&this.composer)return;this.gfx=e,this.preset=bg[e],this.dispose();let t=this.preset,n=this.renderer,r=new In(this.w,this.h,{type:Me});this.composer=new Yh(n,r),this.composer.setPixelRatio(this.dpr),this.composer.addPass(new Xh(this.scene,this.camera)),this.ao=null,t.ao===`gtao`&&(this.ao=new Eg(this.scene,this.camera,this.w,this.h),this.ao.updateGtaoMaterial({radius:.7,distanceExponent:1.6,thickness:1,scale:1,samples:12,distanceFallOff:.5,screenSpaceRadius:!1}),this.ao.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:4,rings:2,samples:12}),this.ao.blendIntensity=this.mood.aoBlend,this.composer.addPass(this.ao)),this.bloom=new Qh(new U(this.w*t.bloom.scale,this.h*t.bloom.scale),t.bloom.strength,t.bloom.radius,t.bloom.threshold),this.composer.addPass(this.bloom),this.composer.addPass(new eg),this.grade=new Kh(Tg),this.composer.addPass(this.grade),this.aaPass=t.aa===`smaa`?new ig:new og,this.composer.addPass(this.aaPass),this.applySize(),this.setMood(this.mood)}setSize(e,t,n){this.w=Math.max(1,e),this.h=Math.max(1,t),this.dpr=n,this.composer&&(this.composer.setPixelRatio(n),this.applySize())}applySize(){if(this.composer.setSize(this.w,this.h),this.ao&&this.preset.aoScale<1){let e=this.preset.aoScale,t=Math.round(this.w*this.dpr*e),n=Math.round(this.h*this.dpr*e);this.ao.setSize(t,n),this.ao.gtaoRenderTarget.setSize(t,n),this.ao.pdRenderTarget.setSize(t,n),this.ao.normalRenderTarget.setSize(t,n)}this.grade.uniforms.res.value.set(this.w*this.dpr,this.h*this.dpr)}setMood(e={}){let t=this.mood={...this.mood,...e};if(this.renderer.toneMappingExposure=t.exposure,this.bloom&&(this.bloom.strength=this.preset.bloom.strength*t.bloom,this.bloom.threshold=this.preset.bloom.threshold*(t.threshold??1)/Math.max(.05,t.exposure)),this.ao&&(this.ao.blendIntensity=t.aoBlend),this.grade){let e=this.grade.uniforms;e.contrast.value=t.contrast,e.vignette.value=t.vignette}}render(e){let t=this.grade.uniforms,n=this.fx;t.rain.value=n.rain,t.time.value=n.time,t.sat.value=n.sat*this.mood.sat,t.tint.value.set(n.tint[0],n.tint[1],n.tint[2]),t.speed.value=n.speed,this.composer.render(e)}dispose(){if(this.composer){for(let e of this.composer.passes)e.dispose?.();this.composer.renderTarget1.dispose(),this.composer.renderTarget2.dispose(),this.composer=null}}},kg=class{constructor(e=240){this.buf=new Float32Array(e),this.n=0,this.i=0,this.spikes=0,this.total=0,this.heapUp=0,this.heapFrames=0,this._heap=-1,this._sorted=new Float32Array(e)}add(e,t=-1){let n=this.n?this.mean():e;this.n>=30&&e>n*1.75&&e>20&&this.spikes++,this.buf[this.i]=e,this.i=(this.i+1)%this.buf.length,this.n<this.buf.length&&this.n++,this.total++,t>=0&&(this._heap>=0&&t>this._heap&&(this.heapUp+=t-this._heap),this._heap>=0&&this.heapFrames++,this._heap=t)}mean(){let e=0;for(let t=0;t<this.n;t++)e+=this.buf[t];return this.n?e/this.n:0}percentile(e){let t=this.n;if(!t)return 0;let n=this._sorted;for(let e=0;e<t;e++)n[e]=this.buf[e];return n.subarray(0,t).sort()[Math.min(t-1,Math.floor(e*t))]}reset(){this.n=0,this.i=0,this.spikes=0,this.total=0,this.heapUp=0,this.heapFrames=0,this._heap=-1}snapshot(){let e=this.mean();return{frames:this.n,avgMs:+e.toFixed(2),p95Ms:+this.percentile(.95).toFixed(2),maxMs:+this.percentile(1).toFixed(2),fps:e?+(1e3/e).toFixed(1):0,spikes:this.spikes,allocBytesPerFrame:this.heapFrames?Math.round(this.heapUp/this.heapFrames):-1}}},Ag=class{constructor(e=1/60,t=.0025){this.interval=e,this.slack=t,this.t=1/0}due(e){return this.t+=e,this.t>=this.interval-this.slack&&(this.t=Number.isFinite(this.t)?Math.min(this.t-this.interval,this.interval):0,!0)}force(){this.t=1/0}},jg=1/60;function Mg(e){let t=e._prev||={};return t.x=e.x,t.y=e.y,t.z=e.z,t.theta=e.theta,t.pitch=e.pose?e.pose.pitch:0,t.roll=e.pose?e.pose.roll:0,t.steer=e.steer||0,t.s=e.s||0,t.d=e.d||0,t}var Ng=(e,t,n)=>e+(t-e)*n;function Pg(e,t,n={},i=0){let a=e._prev;if(!a)return n.x=e.x,n.y=e.y,n.z=e.z,n.theta=e.theta,n.pitch=e.pose?e.pose.pitch:0,n.roll=e.pose?e.pose.roll:0,n.steer=e.steer||0,n.s=e.s||0,n.d=e.d||0,n;n.x=Ng(a.x,e.x,t),n.y=Ng(a.y,e.y,t),n.z=Ng(a.z,e.z,t),n.theta=a.theta+r(e.theta-a.theta)*t;let o=e.pose?e.pose.pitch:0,s=e.pose?e.pose.roll:0;n.pitch=Ng(a.pitch,o,t),n.roll=Ng(a.roll,s,t),n.steer=Ng(a.steer,e.steer||0,t);let c=(e.s||0)-a.s;return i>0&&(c-=Math.round(c/i)*i),n.s=a.s+c*t,n.d=Ng(a.d,e.d||0,t),n}function Fg(e,t,n=jg,r=5){e+=t;let i=0;for(;e>=n&&i<r;)e-=n,i++;return e>=n&&(e%=n),{n:i,acc:e}}var Ig=class{constructor({level:e=2,min:t=0,max:n=2,lowFps:r=45,highFps:i=58,lowSecs:a=3,highSecs:o=10}={}){Object.assign(this,{level:e,min:t,max:n,lowFps:r,highFps:i,lowSecs:a,highSecs:o}),this.lowT=0,this.highT=0,this.fps=60}update(e,t){return this.fps=t,this.lowT=t<this.lowFps?this.lowT+e:0,this.highT=t>this.highFps?this.highT+e:0,this.lowT>=this.lowSecs&&this.level>this.min?(this.level--,this.lowT=this.highT=0,this.level):this.highT>=this.highSecs&&this.level<this.max?(this.level++,this.lowT=this.highT=0,this.level):(this.lowT>=this.lowSecs&&(this.lowT=0),this.highT>=this.highSecs&&(this.highT=0),null)}};function Lg(e){return String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}function Rg(e,t){return`${pd}:${e}:${t}`}function zg(e,t){return`${e}:${t}`}function Bg(e,t,n,r){let i=zg(n,r);if(t[i]!==void 0)return t[i];try{let a=e?.getItem(Rg(n,r));t[i]=a?JSON.parse(a):null}catch{t[i]=null}return t[i]}function Vg(e,t,n,r,i){let a=zg(n,r);t[a]=i;try{return e?.setItem(Rg(n,r),JSON.stringify(i)),!0}catch{return!1}}function Hg(e){return`#`+(e>>>0&16777215).toString(16).padStart(6,`0`)}function Ug(e,t){let n=e.length,r=Math.max(1,Math.min(t|0,n||1)),i=(e,t)=>({pos:t+1,tag:e.team?.tag??``,color:e.team?.c1??8947848,me:!!e.isPlayer});if(r<=7)return e.slice(0,r).map(i);let a=e.slice(0,5).map(i);a.push({divider:!0});let o=r-2,s=r-1,c=r;return o>=5&&o<n&&a.push(i(e[o],o)),s>=0&&s<n&&a.push(i(e[s],s)),c<n&&c>=5&&a.push(i(e[c],c)),a}function Wg(e,t){return Ug(e,t).map(e=>e.divider?`<li class="gap" aria-hidden="true">···</li>`:`<li class="${e.me?`me`:``}"><b>${e.pos}</b><i style="background:${Hg(e.color)}"></i>${Lg(e.tag)}</li>`).join(``)}function Gg(e,t){return e.map(e=>{let n=e.pos===1?t(e.time,!1):`+`+(e.gap??0).toFixed(1);return`<tr class="${e.isPlayer?`me`:``}"><td>${e.pos}</td><td><i class="chip" style="background:${Hg(e.team?.c1??8947848)}"></i> ${Lg(e.name)}</td><td>${n}</td><td>best ${t(e.best,!1)}</td><td>${e.stops?`pit×`+e.stops:``}</td></tr>`})}function Kg(e){return e?e.player?`YOU ARE THE CHAMPION`:`CHAMPION ${Lg(e.name)}`:``}var qg=`drive-career-v1`,Jg=`drive-garage-v1`,Yg=[25,18,15,12,10,8,6,4,2,1],Xg=e=>Yg[e-1]||0,Zg={name:`Ashlane Speed Co.`,tag:`ASH`,livery:{pattern:`flash`,c1:16738816,c2:1710626,c3:16765514,number:1}},Qg=[`engine`,`aero`,`brakes`,`tires`],$g=[4,6,8,10,12],e_={engine:{vTop:.008,accel:.01},aero:{down:.02},brakes:{brake:.015},tires:{wear:-.04}},t_={engine:`ENGINE`,aero:`AERO`,brakes:`BRAKES`,tires:`TIRES`},n_={engine:`Top speed and pull out of corners`,aero:`More grip through fast corners`,brakes:`Shorter stopping distance`,tires:`Tyres last longer`},r_=[8,7,6,5,5,4,4,3,3,2],i_=`Casey Morrow`,a_=(e,t,n,r)=>{let i=typeof e==`string`?parseInt(e,10):e;return Number.isFinite(i)?Math.min(n,Math.max(t,Math.round(i))):r};function o_(){return[[`quill`,`Mara Quill`,1,94],[`voss`,`Jonah Voss`,2,90],[`calder`,`Nia Calder`,3,86],[`hale`,`Soren Hale`,4,83],[`frost`,`Imani Frost`,5,80],[`bramble`,`Theo Bramble`,6,77],[`pell`,`Ren Pell`,7,74],[`march`,`Odette March`,8,71],[`lind`,`Casper Lind`,9,68]].map(([e,t,n,r])=>({id:e,name:t,number:Lf(n),teamIndex:n,rating:r}))}function s_(){let e=jd[0];return{driver:{name:i_,number:1},team:Af({name:e.name,tag:e.tag,livery:{...Of(),pattern:`chevrons`,c1:e.c1,c2:e.c2,number:1}})}}function c_(e){let t=s_(),n=e&&typeof e==`object`?e:{},r=Ef(n.driver?.number??n.team?.livery?.number,t.driver.number),i=Sf(n.driver?.name)||t.driver.name,a=Af({name:n.team?.name,tag:n.team?.tag,livery:{...n.team?.livery||{},number:r}},t.team.name);return{driver:{name:i,number:r},team:a}}function l_(e){try{let t=e?.getItem(Jg);return t?c_(JSON.parse(t)):s_()}catch{return s_()}}function u_(e,t){try{return e?.setItem(Jg,JSON.stringify(c_(t))),!0}catch{return!1}}function d_(e,t=`normal`){let n=md[t]||md.normal,r=(a_(e,50,99,80)-80)/20,i=n.skill+r*n.spread;return Math.round(Math.min(1.02,Math.max(.8,i))*1e3)/1e3}function f_(e,t=`normal`){let n=r_[e-1]??0;return Math.round(n*(t===`hard`?1.25:t===`easy`?.75:1))}function p_(e,t){let n=e=>a_(t?.[e],0,5,0),r=n(`engine`),i=n(`aero`),a=n(`brakes`),o=n(`tires`);return{...e,vTop:e.vTop*(1+e_.engine.vTop*r),accel:e.accel*(1+e_.engine.accel*r),down:e.down*(1+e_.aero.down*i),brake:e.brake*(1+e_.brakes.brake*a),wear:e.wear*(1+e_.tires.wear*o)}}function m_(e){let t=Qg.reduce((t,n)=>t+(e?.upgrades?.[n]||0),0);return Math.round((76+t*1.2)*10)/10}function h_(e,t){if(!Qg.includes(t))return null;let n=e.upgrades[t]||0;return n>=5?null:$g[n]}function g_(e,t){if(!Qg.includes(t))return{ok:!1,reason:`unknown`,level:0,cost:0,left:e?.upgradePoints||0};let n=e.upgrades[t]||0;if(n>=5)return{ok:!1,reason:`max`,level:n,cost:0,left:e.upgradePoints};let r=$g[n];return e.upgradePoints<r?{ok:!1,reason:`points`,level:n,cost:r,left:e.upgradePoints}:(e.upgradePoints-=r,e.upgrades[t]=n+1,{ok:!0,level:n+1,cost:r,left:e.upgradePoints})}function __(e,t){let n=e&&typeof e==`object`?e:{};return{id:String(n.id||t.id).toLowerCase().replace(/[^a-z0-9]/g,``).slice(0,16)||t.id,name:Sf(n.name)||t.name,number:Ef(n.number,t.number),teamIndex:a_(n.teamIndex,1,jd.length-1,t.teamIndex),rating:a_(n.rating,50,99,t.rating)}}function v_(e,t){if(!Array.isArray(e))return[];let n=[];for(let r of e){if(!r||typeof r!=`object`||!Zu.includes(r.trackId))continue;let e={};if(r.places&&typeof r.places==`object`)for(let[n,i]of Object.entries(r.places)){if(n!==`player`&&!t.has(n))continue;let r=a_(i,1,24,0);r&&(e[n]=r)}if(n.push({trackId:r.trackId,pos:a_(r.pos,1,24,0)||null,points:a_(r.points,0,25,0),upgrade:a_(r.upgrade,0,99,0),places:e}),n.length>=64)break}return n}function y_(e){return e?.cls===`speedway`?`speedway`:`gp`}function b_(e){return a_(e?.points?.player,0,1e5,0)}function x_(e){return y_(e)===`gp`?Math.max(0,90-b_(e)):0}function S_(e){return!e||!e.complete||y_(e)!==`gp`?!1:b_(e)>=90}function C_(e){return`Speedway scouts wanted 90 pts — you scored ${b_(e)}`}function w_(e){return S_(e)?(e.upgrades={engine:0,aero:0,brakes:0,tires:0},F_(e),e.cls=`speedway`,e.speedwayOffer=null,{ok:!0,unlocked:!0}):{ok:!1,reason:`ineligible`}}function T_(e){return S_(e)?(F_(e),e.cls=`gp`,e.speedwayOffer=null,{ok:!0}):{ok:!1,reason:`ineligible`}}function E_(e={},t=null){let n=c_(t||s_()),r=Ef(e.number??e.driver?.number??n.driver.number,n.driver.number),i=Sf(e.driverName??(typeof e.driver==`string`?e.driver:e.driver?.name)??n.driver.name)||n.driver.name,a=e.team||n.team,o=Af({...a,livery:{...a.livery||{},number:r}},n.team.name),s=md[e.difficulty]?e.difficulty:`normal`,c=e.weather===`dry`||e.weather===`rain`?e.weather:`auto`;return{v:1,driver:{name:i,number:r},team:o,difficulty:s,laps:a_(e.laps,3,5,4),weather:c,cls:`gp`,speedwayOffer:null,round:0,season:1,complete:!1,calendar:Zu.slice(),points:{},upgradePoints:0,upgrades:{engine:0,aero:0,brakes:0,tires:0},rivals:o_(),history:[]}}function D_(e){if(!e||typeof e!=`object`)return null;let t=E_({driverName:e.driver?.name,number:e.driver?.number,team:e.team,difficulty:e.difficulty,laps:e.laps,weather:e.weather}),n=o_().map((t,n)=>__(Array.isArray(e.rivals)?e.rivals[n]:null,t)),r=new Set(n.map(e=>e.id)),i={};if(e.points&&typeof e.points==`object`)for(let[t,n]of Object.entries(e.points)){if(t!==`player`&&!r.has(t))continue;let e=Number(n);Number.isFinite(e)&&e>=0&&e<1e5&&(i[t]=Math.round(e))}let a={engine:0,aero:0,brakes:0,tires:0};for(let t of Qg)a[t]=a_(e.upgrades?.[t],0,5,0);let o=Array.isArray(e.calendar)?e.calendar.filter(e=>Zu.includes(e)):[],s=o.length?o:Zu.slice(),c=a_(e.round,0,s.length,0),l=e.cls===`speedway`?`speedway`:`gp`,u=e.speedwayOffer,d=u===`accepted`||u===`declined`||u===`pending`?u:null;return{...t,cls:l,speedwayOffer:d,round:c,season:a_(e.season,1,99,1),complete:!!e.complete||c>=s.length,calendar:s,points:i,upgradePoints:a_(e.upgradePoints,0,9999,0),upgrades:a,rivals:n,history:v_(e.history,r)}}function O_(e){try{let t=e?.getItem(qg);return t?D_(JSON.parse(t)):null}catch{return null}}function k_(e,t){try{let n=D_(t);return n?(e?.setItem(qg,JSON.stringify(n)),!0):!1}catch{return!1}}function A_(e){if(!e||e.complete||e.round>=e.calendar.length)return null;let t=e.calendar[e.round];return{index:e.round,count:e.calendar.length,id:t}}function j_(e){let t=A_(e);return t?t.id:e?.calendar?.length?e.calendar[0]:null}function M_(e,t){let n=t?p_(t,e.upgrades):null,r=[{id:`player`,isPlayer:!0,rating:m_(e),teamIndex:0,team:{...e.team,c1:e.team.livery.c1,c2:e.team.livery.c2,custom:!0,livery:{...e.team.livery}},driver:{name:e.driver.name,number:e.driver.number},skill:.985,cls:n||void 0},...e.rivals.map(n=>{let r=jd[n.teamIndex];return{id:n.id,isPlayer:!1,rating:n.rating,teamIndex:n.teamIndex,team:{name:r.name,tag:r.tag,c1:r.c1,c2:r.c2},driver:{name:n.name,number:n.number},skill:d_(n.rating,e.difficulty),cls:t||void 0}})];return r.sort((e,t)=>t.rating-e.rating||(e.driver.name<t.driver.name?-1:+(e.driver.name>t.driver.name))),r}function N_(e){let t={},n={};for(let r of e.history||[])for(let[e,i]of Object.entries(r.places||{}))i===1&&(t[e]=(t[e]||0)+1),i<=3&&(n[e]=(n[e]||0)+1);let r=e.team,i=[{id:`player`,player:!0,name:e.driver.name,number:e.driver.number,team:r.name,tag:r.tag,c1:r.livery.c1,c2:r.livery.c2,points:e.points.player||0,rating:null},...e.rivals.map(t=>{let n=jd[t.teamIndex];return{id:t.id,player:!1,name:t.name,number:t.number,team:n.name,tag:n.tag,c1:n.c1,c2:n.c2,points:e.points[t.id]||0,rating:t.rating}})];return i.sort((e,r)=>r.points-e.points||(t[r.id]||0)-(t[e.id]||0)||(n[r.id]||0)-(n[e.id]||0)||(e.name<r.name?-1:+(e.name>r.name))),i.map((e,n)=>({...e,pos:n+1,wins:t[e.id]||0}))}function P_(e,t){if(!e||e.complete||e.round>=e.calendar.length)return null;let n=e.calendar[e.round],r={},i=null,a=0;for(let n of t||[]){let t=n.isPlayer?`player`:n.id;if(!t)continue;let o=Xg(n.pos);e.points[t]=(e.points[t]||0)+o,r[t]=n.pos,t===`player`&&(i=n.pos,a=o)}let o=i?f_(i,e.difficulty):0;return e.upgradePoints+=o,e.history.push({trackId:n,pos:i,points:a,upgrade:o,places:r}),e.round+=1,e.round>=e.calendar.length&&(e.complete=!0),{trackId:n,pos:i,points:a,upgrade:o,complete:e.complete,standings:N_(e)}}function F_(e){return e.season=a_(e.season,1,98,1)+1,e.round=0,e.complete=!1,e.points={},e.history=[],e.calendar=Zu.slice(),(e.speedwayOffer===`accepted`||e.speedwayOffer===`declined`)&&(e.speedwayOffer=null),e}var I_={circuitDay:{id:`day`,label:`DAY`,road:`#c8c2b2`,ink:`#ffe14a`},alpine:{id:`snow`,label:`SNOW`,road:`#e7f3ff`,ink:`#2a5f93`},forest:{id:`rain`,label:`RAIN`,road:`#7ea88a`,ink:`#e7ffe8`},desertNight:{id:`desert-night`,label:`DESERT NIGHT`,road:`#e0b15a`,ink:`#1a1208`},neonStreet:{id:`neon`,label:`NEON`,road:`#ff5ad4`,ink:`#7af6ff`},coastal:{id:`coast`,label:`COAST`,road:`#ecd7a4`,ink:`#1d6a78`}};function L_(e){return I_[e]||I_.circuitDay}function R_(e,t=160){let n=new Oa(e.map(e=>new W(e[0],e[1],e[2])),!0,`centripetal`),r=Array(t);for(let e=0;e<t;e++){let i=n.getPoint(e/t);r[e]=[i.x,i.y,i.z]}return r}function z_(e){let t=0;for(let n=0;n<e.length;n++){let r=e[n],i=e[(n+1)%e.length];t+=Math.hypot(i[0]-r[0],i[2]-r[2])}return t}function B_(e){return isFinite(e)?(e/1e3).toFixed(2)+` km`:`-- km`}function V_(e,t,n,r=8){let i=1/0,a=-1/0,o=1/0,s=-1/0;for(let t of e){let e=t[0],n=t[2];e<i&&(i=e),e>a&&(a=e),n<o&&(o=n),n>s&&(s=n)}let c=Math.max(1,a-i),l=Math.max(1,s-o),u=Math.min((t-r*2)/c,(n-r*2)/l),d=(t-c*u)/2,f=(n-l*u)/2;return e.map(e=>({x:d+(e[0]-i)*u,y:n-(f+(e[2]-o)*u)}))}var H_=new Map;function U_(e){let t=H_.get(e.id);if(t)return t;let n=R_(e.points,160);return t={id:e.id,name:e.name,samples:n,length:z_(n),tag:L_(e.theme)},H_.set(e.id,t),t}function W_(e,t,n,r){e.beginPath();for(let n=0;n<t.length;n++){let r=t[n].x|0,i=t[n].y|0;n?e.lineTo(r,i):e.moveTo(r,i)}e.closePath(),e.strokeStyle=n,e.lineWidth=r,e.lineJoin=`miter`,e.lineCap=`square`,e.stroke()}function G_(e,t,n){let r=e?.getContext?.(`2d`);if(!r)return;let i=e.width,a=e.height;r.imageSmoothingEnabled=!1,r.fillStyle=`#070b10`,r.fillRect(0,0,i,a);let o=V_(t,i,a,12);W_(r,o,`#000`,12),W_(r,o,n?.road||`#8fa3b8`,7),W_(r,o,n?.ink||`#ffe14a`,2);let s=o[0],c=o[Math.min(o.length-1,4)];r.fillStyle=`#fff`,r.fillRect((s.x|0)-5,(s.y|0)-2,10,4),r.fillStyle=n?.ink||`#ffe14a`,r.fillRect((c.x|0)-2,(c.y|0)-2,4,4)}function K_(e,t,n){if(!e?.length)return-1;let r=t>=0&&t<e.length?t:0,i=e[r],a=i.x+i.w/2,o=i.y+i.h/2,s=n===`left`||n===`right`,c=n===`left`||n===`up`?-1:1,l=-1,u=1/0;for(let t=0;t<e.length;t++){if(t===r)continue;let n=e[t],i=n.x+n.w/2-a,d=n.y+n.h/2-o,f=s?i:d,p=s?d:i;if(f*c<=1||Math.abs(p)>Math.abs(f)*2.2+8)continue;let m=Math.abs(f)+Math.abs(p)*2.4;m<u&&(u=m,l=t)}return l<0?r:l}function q_(e,t=.5){let n=e?.axes?.[0]||0,r=e?.axes?.[1]||0,i=t=>!!e?.buttons?.[t]?.pressed;return{left:i(14)||n<-t,right:i(15)||n>t,up:i(12)||r<-t,down:i(13)||r>t,a:i(0),b:i(1)}}var J_=[`up`,`down`,`left`,`right`,`a`,`b`];function Y_(e,t){let n=[];for(let r of J_)t?.[r]&&!e?.[r]&&n.push(r);return n}var X_={announcer_intro:{voice:`announcer`,text:`Welcome to the grid. The track is set, the cars are ready, and the wait is almost over!`},announcer_intro_time_trial:{voice:`announcer`,text:`One car, one clear track. Time to chase the perfect lap!`},announcer_start:{voice:`announcer`,text:`Lights out, and away we go!`},announcer_lead_change:{voice:`announcer`,text:`We have a new race leader!`},announcer_player_overtake:{voice:`announcer`,text:`Great move! You have made the pass!`},announcer_player_overtaken:{voice:`announcer`,text:`A rival slips through. Time to fight back!`},announcer_fastest_lap:{voice:`announcer`,text:`That is the fastest lap of the race!`},announcer_off_track:{voice:`announcer`,text:`A trip off the track. Keep it tidy!`},announcer_last_lap:{voice:`announcer`,text:`The final lap. Everything to play for!`},announcer_chequered_flag:{voice:`announcer`,text:`The chequered flag is waving!`},announcer_winner:{voice:`announcer`,text:`The winner takes the flag! What a drive!`},announcer_finish_p1:{voice:`announcer`,text:`You win! A brilliant drive from start to finish!`},announcer_finish_p2:{voice:`announcer`,text:`Second place! A fantastic podium finish!`},announcer_finish_p3:{voice:`announcer`,text:`Third place! You are on the podium!`},announcer_finish_points:{voice:`announcer`,text:`A strong race. Points in the bag!`},announcer_finish:{voice:`announcer`,text:`That is the flag. Great effort out there!`},radio_start:{voice:`engineer`,text:`Radio check. Nice and clean into turn one.`},radio_gap_ahead:{voice:`engineer`,text:`Gap ahead is`},radio_gap_behind:{voice:`engineer`,text:`Gap behind is`},radio_box_box:{voice:`engineer`,text:`Box box. Pit this lap. Your tyres need changing.`},radio_tyre_warning:{voice:`engineer`,text:`Tyre wear is climbing. Be smooth with the steering.`},radio_tyre_critical:{voice:`engineer`,text:`Tyres are critical. We need to box soon.`},radio_wet_weather:{voice:`engineer`,text:`Rain is here. We should switch to wet tyres.`},radio_dry_weather:{voice:`engineer`,text:`The track is drying. Dry tyres are the call.`},radio_push:{voice:`engineer`,text:`You have a gap. Push now, but keep it clean.`},radio_bring_home:{voice:`engineer`,text:`Last lap. Bring it home.`},radio_position:{voice:`engineer`,text:`Current position is`},radio_pit_confirmed:{voice:`engineer`,text:`Pit confirmed. Entry is on your left.`},radio_pit_complete:{voice:`engineer`,text:`Fresh tyres on. Good stop. push when you are ready.`}},Z_=Object.freeze({cutscenes:!0,voiceVolume:.75,voiceMuted:!1});Object.freeze({announcer:4,engineer:6,position:12,offTrack:20,tyres:30,gaps:32,push:45,pitDecision:35});var Q_={announcer:`RACE CONTROL`,engineer:`PIT WALL`},$_=e=>Math.max(0,Math.min(1,e)),ev=e=>Number.isFinite(+e)?+e:0;function tv(e={}){return!e||typeof e!=`object`?{...Z_}:{cutscenes:typeof e.cutscenes!=`boolean`||e.cutscenes,voiceVolume:Number.isFinite(e.voiceVolume)?$_(e.voiceVolume):.75,voiceMuted:typeof e.voiceMuted==`boolean`&&e.voiceMuted}}function nv(e,t={}){return!t||typeof t!=`object`?tv(e):(Object.keys(t).length===1&&`voiceVolume`in t&&(t={...t,voiceMuted:!1}),tv({...tv(e),...t}))}function rv(e,t){return tv(t).cutscenes?e===`tt`?2.8:8.6:0}function iv(e,t={}){return!e||e.finished||e.pit?.stage>0||e.pit?.request||Number.isFinite(t.laps)&&ev(e.laps)>=t.laps-1?!1:ev(e.wear)>=.74||e.tire===`dry`&&(ev(t.rain)>=.45||ev(t.wetness)>=.32)||e.tire===`wet`&&ev(t.rain)<.05&&ev(t.wetness)<.14}function av(e){return ev(e?.wear)>=.68?`critical`:ev(e?.wear)>=.48?`warning`:`ok`}function ov(e={}){let t=[];return Number.isFinite(e.ahead)&&t.push(cv(`radio_gap_ahead`,`GAP AHEAD  +${e.ahead.toFixed(1)}s`,35)),Number.isFinite(e.behind)&&t.push(cv(`radio_gap_behind`,`GAP BEHIND  -${e.behind.toFixed(1)}s`,35)),t}function sv(e){return e===1?`announcer_finish_p1`:e===2?`announcer_finish_p2`:e===3?`announcer_finish_p3`:e<=8?`announcer_finish_points`:`announcer_finish`}function cv(e,t,n=30){return X_[e]?{id:e,channel:X_[e].voice,speaker:Q_[X_[e].voice],caption:t||X_[e].text.toUpperCase(),priority:n}:null}function lv(e,t={}){let n=t.solo??t.mode===`tt`,r=t.position||t.player?.pos||0;switch(e?.type){case`intro`:return[cv(n?`announcer_intro_time_trial`:`announcer_intro`,null,100)];case`go`:return n?[]:[cv(`announcer_start`,null,100),cv(`radio_start`,`RADIO CHECK  ·  NICE AND CLEAN INTO TURN ONE`,100)];case`leadchange`:return n?[]:[cv(`announcer_lead_change`)];case`winner`:return n||e.car?.isPlayer?[]:[cv(`announcer_winner`,null,90)];case`poschange`:{if(n)return[];let t=e.to<e.from;return[cv(t?`announcer_player_overtake`:`announcer_player_overtaken`,t?`GREAT MOVE  P${e.to}`:`RIVAL THROUGH  P${e.to}`,60),cv(`radio_position`,`POSITION  P${e.to}  ${t?`››`:`‹‹`}`,60)]}case`laptime`:return!n&&e.isBest?[cv(`announcer_fastest_lap`,`FASTEST LAP  ${(+e.time||0).toFixed(3)}s`,55)]:[];case`offtrack`:return n?[]:[cv(`announcer_off_track`)];case`finallap`:return n?[]:[cv(`announcer_last_lap`,null,100),cv(`radio_bring_home`,null,100)];case`finish`:return n||!e.car?.isPlayer?[]:[cv(`announcer_chequered_flag`,null,100),cv(sv(r),`CHEQUERED FLAG  YOU FINISH P${r}`,100)];case`pit`:return e.car?.isPlayer?[cv(`radio_pit_complete`,null,100)]:[];default:return[]}}function uv(e={}){let t=e.player||{};if(e.solo||e.phase!==`racing`||t.finished)return[];let n=[];iv(t,e)&&n.push(cv(`radio_box_box`,`BOX BOX  PIT THIS LAP  ·  TYRES ${Math.round(ev(t.wear)*100)}% WORN`,100));let r=av(t);return r!==`ok`&&n.push(cv(r===`critical`?`radio_tyre_critical`:`radio_tyre_warning`,`${r===`critical`?`TYRES CRITICAL`:`TYRE WEAR`}  ${Math.round(ev(t.wear)*100)}% WORN`,r===`critical`?75:45)),t.tire===`dry`&&ev(e.rain)>=.45&&n.push(cv(`radio_wet_weather`,`RAIN  ·  WET TYRES ADVISED`,80)),t.tire===`wet`&&ev(e.rain)<.05&&ev(e.wetness)<.14&&n.push(cv(`radio_dry_weather`,`TRACK DRYING  ·  DRY TYRES ADVISED`,75)),e.reportGaps&&n.push(...ov(e.gaps)),e.time>=50&&ev(e.gaps?.behind)>=2.2&&n.push(cv(`radio_push`,`PUSH NOW  ·  GAP BEHIND +${e.gaps.behind.toFixed(1)}s`,40)),e.finalLap&&n.push(cv(`radio_bring_home`,null,100)),n}var dv=class{constructor({solo:e=!1}={}){this.solo=e,this.pending={announcer:null,engineer:null},this.next={announcer:0,engineer:0},this.lastPlayed={},this.history={},this.lastLeader=null,this.wasOff=!1,this.gapSide=`ahead`,this.nextGap=50,this.gapDeadline=0,this.lastGaps=null,this.winnerAnnounced=!1}accept(e,t=0){if(!e||this.solo&&e.channel===`engineer`||!this.readyFor(e,t))return!1;let n=this.pending[e.channel];return!n||e.priority>=n.priority?(this.pending[e.channel]=e,!0):!1}readyFor(e,t){let n=e.id;return e.id.startsWith(`announcer_player_`)?n=`overtake`:e.id.startsWith(`radio_gap_`)?n=`gap`:{announcer_off_track:20,announcer_lead_change:16,radio_box_box:35,radio_tyre_warning:30,radio_tyre_critical:25,radio_position:12,radio_push:45,radio_gap_ahead:32,radio_gap_behind:32}[e.id],t+1e-6>=(this.history[n]??-1e9)}event(e,t={},n=0){if(!(e.type===`winner`&&this.winnerAnnounced)){e.type===`winner`&&(this.winnerAnnounced=!0);for(let r of lv(e,t))this.accept(r,n)}}telemetry(e,t=0){if(this.solo||e.phase!==`racing`||e.player?.finished)return;let n=e.player||{};e.leaderId!==this.lastLeader&&(this.lastLeader!==null&&this.event({type:`leadchange`},e,t),this.lastLeader=e.leaderId);let r=n.v>12&&[`grass`,`gravel`].includes(n.surface);r&&!this.wasOff&&this.event({type:`offtrack`},e,t),this.wasOff=r,this.lastGaps=e.gaps;for(let n of uv({...e,solo:!1,reportGaps:!1}))this.accept(n,t);if((this.pending.engineer?.priority??0)<=45&&t>=this.nextGap&&t>=this.gapDeadline&&t>=this.next.engineer){let n=this.gapSide,r=e.gaps?.[n];Number.isFinite(r)&&this.accept(ov({[n]:r})[0],t)}}tick(e,t={}){let n=[];for(let r of[`announcer`,`engineer`]){let i=this.pending[r];if(!(!i||e<this.next[r]||t[r])){if(this.pending[r]=null,this.lastPlayed[r]=e,i.id.startsWith(`radio_gap_`)){this.history.gap=e+32;let t=i.id.endsWith(`ahead`)?`ahead`:`behind`;this.gapSide=t===`ahead`?`behind`:`ahead`,this.gapDeadline=e+7,this.nextGap=e+32}else{let t={announcer_lead_change:16,announcer_off_track:20,radio_box_box:35,radio_tyre_warning:30,radio_tyre_critical:25,radio_position:12,radio_push:45,radio_pit_confirmed:25},n=i.id;i.id.startsWith(`announcer_player_`)&&(n=`overtake`),this.history[n]=e+(t[i.id]||(n===`overtake`?4:2))}this.next[r]=e+(r===`announcer`?3:3.7),n.push(i)}}return n}release(e,t){this.next[e]=t+.8}stop(){this.pending.announcer=this.pending.engineer=null}},fv=class{constructor(e,{fetchClip:t=(...e)=>fetch(...e),baseUrl:n=`/drive/`}={}){this.engine=e,this.locationHost=typeof location<`u`?location.host:``,this.baseUrl=n||(this.locationHost.startsWith(`127.0.0.1:4177`)?`/`:`/drive/`),this.fetchClip=t,this.volume=.75,this.muted=!1,this.cache=new Map,this.pending=new Map,this.channelPending={announcer:0,engineer:0},this.active={announcer:null,engineer:null},this.generation={announcer:0,engineer:0},this.reserved={announcer:!1,engineer:!1},this.degraded=!1,this.enabled=!0}init(){this.engine.init();let e=this.engine.ctx;return e?this.ctx===e?(e.resume?.(),this.setSettings({voiceVolume:this.volume,voiceMuted:this.muted}),!0):(this.ctx=e,this.mix=e.createGain(),this.mix.gain.value=this.muted?0:this.volume*.95,this.mix.connect(this.engine.master),this.setSettings({voiceVolume:this.volume,voiceMuted:this.muted}),this.radio=e.createBiquadFilter(),this.radio.type=`bandpass`,this.radio.frequency.value=1450,this.radio.Q.value=.55,this.radioTrim=e.createGain(),this.radioTrim.gain.value=1.35,this.radio.connect(this.radioTrim),this.radioTrim.connect(this.mix),!0):!1}unlock(){if(!this.init())return Promise.resolve(!1);try{let e=this.ctx.createBuffer(1,1,this.ctx.sampleRate),t=this.ctx.createBufferSource();t.buffer=e,t.connect(this.mix),t.start(0)}catch{}return this.ctx.resume?.()||Promise.resolve()}setSettings({voiceVolume:e=.75,voiceMuted:t=!1}={}){this.volume=Math.max(0,Math.min(1,Number(e)||0)),this.muted=!!t,this.mix&&this.ctx&&this.mix.gain.setTargetAtTime(this.muted?0:this.volume*.95,this.ctx.currentTime,.025)}url(e){let t=this.baseUrl;return`${t.endsWith(`/`)?t:t+`/`}audio/vo/${e}.mp3`}async load(e){if(this.cache.has(e))return this.cache.get(e);if(this.pending.has(e))return this.pending.get(e);let t=(async()=>{let t=await this.fetchClip(this.url(e));if(!t.ok&&this.baseUrl!==`/`&&typeof window<`u`){let n=`${location.protocol}//${location.host}/audio/vo/${e}.mp3`;t=await this.fetchClip(n)}if(!t.ok)throw Error(`Clip unavailable`);let n=await t.arrayBuffer(),r=await this.ctx.decodeAudioData(n);return this.cache.set(e,r),r})().finally(()=>this.pending.delete(e));return this.pending.set(e,t),t}async play(e,{onStart:t,onEnd:n}={}){if(!this.enabled)return n?.(e,!1),!1;if(!this.init())return this.degraded=!0,n?.(e,!1),!1;let r=e.channel;this.stop(r);let i=this.generation[r];this.reserved[r]=!0,this.channelPending[r]++;try{let a=await this.load(e.id);if(i!==this.generation[r])return!1;let o=this.ctx.createBufferSource();o.buffer=a,r===`engineer`?(o.connect(this.radio),o.playbackRate.value=1.01,this.squelch()):o.connect(this.mix);let s={generation:i,source:o,onEnd:n,cue:e,stopped:!1};return this.active[r]=s,this.engine.voiceDuck=.45,o.onended=()=>this.finish(r,s,!0),o.start(),this.degraded=!1,t?.(e,a.duration),!0}catch{return i===this.generation[r]&&(this.reserved[r]=!1,this.onCancel?.(r),this.degraded=!0,n?.(e,!1)),!1}}squelch(){let e=this.ctx,t=e.createBuffer(1,Math.ceil(e.sampleRate*.065),e.sampleRate),n=t.getChannelData(0);for(let e=0;e<n.length;e++)n[e]=(Math.random()*2-1)*Math.exp(-e/n.length*9)*.055;let r=e.createBufferSource(),i=e.createGain();r.buffer=t,r.connect(this.radio),r.connect(i),i.gain.value=.45,i.connect(this.mix),r.start()}finish(e,t,n){if(!(this.active[e]!==t||t.stopped)){this.active[e]=null,this.channelPending[e]=0,this.reserved[e]=!1,!this.active.announcer&&!this.active.engineer&&(this.engine.voiceDuck=0);try{t.source.disconnect()}catch{}t.onEnd?.(t.cue,n)}}stop(e){this.generation[e]++;let t=this.active[e];if(t){t.stopped=!0,this.active[e]=null,this.channelPending[e]=0,this.reserved[e]=!1,!this.active.announcer&&!this.active.engineer&&(this.engine.voiceDuck=0);try{t.source.onended=null,t.source.stop(),t.source.disconnect()}catch{}t.onEnd?.(t.cue,!1)}else this.channelPending[e]=0,this.reserved[e]=!1,this.onCancel?.(e)}stopAll(){this.stop(`announcer`),this.stop(`engineer`)}isPlaying(e){return!!(this.reserved[e]||this.channelPending[e])}};function pv(e,t,n){let r=t?.rain>.35||t?.wetness>.25?`WET CONDITIONS`:t?.opts?.weather===`dry`?`DRY CONDITIONS`:e?.night?`NIGHT SESSION`:`DAY SESSION`;return`${n?`ROUND ${n.index+1} / ${n.count}  ·  `:``}${String(e?.name||`CIRCUIT`).replace(/([a-z])([A-Z])/g,`$1 $2`).toUpperCase()}  ·  ${r}`}function mv(r,i,a,o=`race`,s){let c=rv(o,s),l=e(a,0,Math.max(c,.001)),u=c?l/c:1,d=(e,t=0,n=0)=>{let i=r.at(e,t);return[i.x,i.y+n,i.z]},f,p,m=54,h;if(o===`tt`){let e=n(0,1,u),r=d(i.s,i.d,.65);f=d(i.s-t(14,9,e),t(12,5,e),t(5,2.5,e)),p=r,h=`reveal`}else if(u<.38){let e=n(0,.38,u),a=i.s+r.length*t(.6,.19,e);d(a,0,1),f=d(a-t(35,16,e),t(72,25,e),t(98,34,e)),p=d(a+22,0,0),m=t(60,53,e),h=`flyover`}else{let e=n(.38,1,u),r=i.s;f=d(r-t(25,9,e),t(17,5.2,e),t(8,2.6,e));let a=d(r+t(36,0,e),0,t(0,.75,e)),o=d(r,i.d,.7);p=[t(a[0],o[0],e),t(a[1],o[1],e),t(a[2],o[2],e)],h=e<.62?`grid`:`reveal`}return{position:f,target:p,fov:m,phase:h,progress:u,reveal:o===`tt`?u>=.12:u>=.4,duration:c}}var hv=class{constructor(e,t){this.duration=rv(e,t),this.elapsed=0,this.active=this.duration>0,this.skipped=!1}advance(e){return this.active&&(this.elapsed=Math.min(this.duration,this.elapsed+Math.max(0,e)),this.elapsed>=this.duration&&(this.active=!1)),!this.active}skip(){return this.active?(this.active=!1,this.skipped=!0,this.elapsed=this.duration,!0):!1}},Y=e=>document.getElementById(e),gv=Y(`view`),_v=matchMedia(`(pointer:coarse)`).matches||`ontouchstart`in window;_v&&document.body.classList.add(`touch`);var vv=new fu({canvas:gv,antialias:!1,powerPreference:`high-performance`});vv.outputColorSpace=It,vv.toneMapping=4,vv.toneMappingExposure=1,vv.shadowMap.enabled=!0,vv.shadowMap.type=1,vv.shadowMap.autoUpdate=!1;var yv=new Sr,bv=new Ao(58,16/9,.5,3200),xv=new Og(vv,yv,bv);yv.environment=xv.env(`room`);var Sv=Cg({touch:_v,width:innerWidth,height:innerHeight});xv.setGfx(Sv);var Cv={level:2,auto:!navigator.webdriver,fps:60,gov:new Ig({level:2})},wv=new Ag,Tv=innerWidth,Ev=innerHeight,Dv=1;function Ov(){Tv=innerWidth,Ev=innerHeight,Dv=wg(window.devicePixelRatio||1,Sv),vv.setPixelRatio(Dv),vv.setSize(Tv,Ev,!1),xv.setSize(Tv,Ev,Dv),bv.aspect=Tv/Ev,bv.updateProjectionMatrix()}function kv(t,n,r){let i=Math.max(bv.aspect,.2),a=2*Math.atan(Math.tan(n*Math.PI/360)/i)*180/Math.PI;return e(Math.max(t,a),t,r)}function Av(){Ov(),pb()}addEventListener(`resize`,Av),Av();var jv=new Ph,Mv=new Bh,Nv=new fv(Mv),Pv=new dv,Fv=null,Iv=0,Lv=0,Rv=null;function zv(){return{announcer:Nv.isPlaying(`announcer`),engineer:Nv.isPlaying(`engineer`)}}Nv.onCancel=e=>Pv.release(e,Iv);var Bv=(()=>{try{return localStorage.setItem(`_t`,`1`),localStorage.removeItem(`_t`),localStorage}catch{return null}})(),Vv=_d(Bv),Hv=l_(Bv),X=O_(Bv);X&&(Hv={driver:{...X.driver},team:X.team});var Z={...tv(),mode:`race`,difficulty:`normal`,cls:`gp`,laps:3,weather:`auto`,track:Qu,vibration:!1,...Vv.settings||{}};Z.vibration=!!Z.vibration,Object.assign(Z,tv(Z)),Nv.setSettings(Z),Z.track=$u(Z.track).id;var Q=new Bu($u(Z.track)),Uv=Ah(Q.themeId);Uv.build(yv,Q);var Wv={},$=null,Gv=[],Kv=null,qv=null,Jv=[`chase`,`overhead`,`full`],Yv={chase:`CHASE`,overhead:`TOP`,full:`MAP`},Xv=`chase`,Zv={chase:1,overhead:0,full:0},Qv=!1,$v=!1,ey=`menu`,ty=!1,ny=null,ry=`quick`,iy=!1,ay=`menu`,oy=null,sy=`c1`,cy=new lm;cy.addTo(yv);var ly=null,uy=null,dy={x:0,y:10,z:0,yaw:0,ly:0},fy=0,py=!1,my=0,hy=-1,gy=0,_y=-1,vy=-1,yy=-1,by=null,xy=0,Sy=0,Cy=-1,wy=0,Ty=0,Ey=0,Dy=0,Oy=null,ky=[...document.querySelectorAll(`#secs span`)];function Ay(){for(let e of Gv)yv.remove(e.group),rm(e);Gv=[],Kv&&=(yv.remove(Kv.group),rm(Kv),null),cy.clear()}var jy=()=>Fu(Z.difficulty,Z.lineGuide);function My(){let e=jy()&&!!ly;ly?.setEnabled(e&&!!$);for(let e of[`optLine`])Y(e)&&ub(e).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===`on`===jy()));let t=Z.difficulty===`hard`;for(let e of[`rowLine`,`pLine`])Y(e)?.classList.toggle(`na`,t);Y(`pLine`)&&(Y(`pLine`).textContent=t?`LINE: NONE (HARD)`:`LINE: `+(jy()?`ON`:`OFF`)),Y(`optLine`)&&ub(`optLine`).forEach(e=>e.disabled=t)}function Ny(e){return Z.difficulty===`hard`?(My(),!1):(Z.lineGuide=!!e,Py(),My(),jy())}function Py(){Bv&&(Vv.settings={...Vv.settings||{},mode:Z.mode,difficulty:Z.difficulty,cls:Z.cls,laps:Z.laps,weather:Z.weather,track:Z.track,lineGuide:Z.lineGuide,vibration:!!Z.vibration,gfx:Z.gfx,...tv(Z)},vd(Bv,Vv))}function Fy(){return X?{driver:X.driver,team:X.team}:Hv}function Iy(){let e=Fy(),t=e.team.livery||{};return Ff(Nf({driver:e.driver.name,name:e.team.name,tag:e.team.tag,pattern:t.pattern,c1:t.c1,c2:t.c2,c3:t.c3,number:e.driver.number}))}var Ly=[`menu`,`results`,`pause`,`career`,`standings`,`upgrades`,`editor`,`recruit`];function Ry(){for(let e of Ly)Y(e)?.classList.add(`hidden`);bb()}function zy(){ly&&=(yv.remove(ly.mesh),ly.mesh.geometry.dispose(),ly.mesh.material.dispose(),null),uy&&=(yv.remove(uy.mesh),uy.mesh.geometry.dispose(),uy.mesh.material.dispose(),null)}function By(e,t=!0){let n=$u(e);if(Q&&Q.id===n.id&&Uv&&Uv.name===n.theme)return t&&(Z.track=n.id),Q;Ay(),zy();let r=Cv.level;return Uv?.dispose(),Q=new Bu(n),Uv=Ah(n.theme),Uv.build(yv,Q),Uv.setQuality(r,bg[Sv].shadow),Uv.applyMood?.(xv),ax(),Dx(),t&&(Z.track=n.id),Q}function Vy(){if(!X)return;let e=j_(X);e&&By(e,!1)}function Hy(e={}){Nv.stopAll(),Pv.stop(),tb();let{grid:t,playerTeam:n,driver:r,keepCareer:i,restore:a,rng:o,...s}=e;ry=i?`career`:`quick`,Object.assign(Z,s),Z.mode!==`race`&&Z.mode!==`tt`&&(Z.mode=`race`),yd(Vv,Z.cls)||(Z.cls=`gp`),Q&&Q.id===$u(Z.track).id||By(Z.track),clearTimeout(Oy),Ay(),$=new Yd(Q,{mode:Z.mode,difficulty:Z.difficulty,cls:Z.cls,laps:Z.laps,weather:Z.weather,best:Ed(Vv,Z.cls),rng:o,grid:t,playerTeam:n||Iy(),driver:r||null}),$.cars.forEach(e=>{let t=Kp(e.cls.id,e.team,e.isPlayer,!1,e.teamIndex);t.st={},t.setTire(e.tire),yv.add(t.group),Gv.push(t),e.mesh=t}),zy(),ly=um(Q,$.cls),yv.add(ly.mesh),uy&&uy.cls===$.cls.id||(uy&&yv.remove(uy.mesh),uy=fm(Q,$.cls),uy.cls=$.cls.id,yv.add(uy.mesh)),My(),Uv.setCars(Gv),qv=$.solo?Bg(Bv,Wv,Q.id,Z.cls):null,qv&&(Kv=Kp(Z.cls,$.player.team,!1,!0,$.player.teamIndex),Kv.group.visible=!1,yv.add(Kv.group)),ny=ry===`career`?{kind:`pos`,target:10,text:Q.name}:Dd(Z,Vv),ey=`racing`,ty=!1,iy=!1,Cy=-1,hy=-1,fy=0,gy=0,my=0;for(let e of[`banner`,`flag`])Y(e).classList.remove(`on`);Y(`posPop`).classList.remove(`on`),Ry(),Y(`hud`).classList.remove(`hidden`),Y(`goal`)&&(Y(`goal`).textContent=ry===`career`?`ROUND ${X.round+1}/${X.calendar.length}  ${Q.name.toUpperCase()}`:`GOAL: `+ny.text),Y(`board`).classList.toggle(`hidden`,$.solo),Y(`bEnd`)?.classList.toggle(`hidden`,!$.solo),Y(`pos`).classList.toggle(`tt`,$.solo),Qy(),new URLSearchParams(location.search).get(`rain`)===`1`&&$.setRain(!0),Uv.setWeather({rain:$.rain,wetness:$.wetness}),Uv.setStartLights(0,!1),Pv=new dv({solo:$.solo}),Iv=0,Lv=0,Rv=null,ob();let c=$.player;return dy.init=!1,dy.yaw=c.theta,dy.x=c.x,dy.z=c.z,dy.y=c.y+6,dy.ly=c.y,Object.assign(Tx,{x:c.x,y:c.y,z:c.z,yaw:c.theta,xV:0,yV:0,zV:0,lastX:void 0}),wv.force(),iS(),eS=0,sx(),Mv.init(),Mv.music=!1,Wy(!1),Uy(($.solo,`GET READY`),3),rv(Z.mode,Z)>0&&eb(),Nv.setSettings(Z),Jy(),a&&Object.assign(Z,a),Py(),$}function Uy(e,t=2.5){Y(`msg`).textContent=e,Ty=t}function Wy(e){$&&($.autopilot=e,Y(`bAuto`).classList.toggle(`on`,e))}function Gy(e,t=!1){if(typeof e==`string`&&e===`top`&&(e=`overhead`),!Jv.includes(e))return Xv;if(Xv=e,t){for(let t of Jv)Zv[t]=+(t===e);Qv=!0}let n=Y(`bCam`);return n.classList.toggle(`on`,e!==`chase`),n.textContent=Yv[e],Xv}function Ky(){return Gy(Jv[(Jv.indexOf(Xv)+1)%Jv.length])}function qy(e){Mv.setMuted(e),Y(`bMute`).classList.toggle(`on`,e),Y(`bMute`).textContent=e?`MUTE`:`SND`,Jy()}function Jy(){if(!Y(`optCutscene`))return;Y(`optCutscene`).textContent=Z.cutscenes?`INTRO ON`:`INTRO OFF`,Y(`optCutscene`).classList.toggle(`sel`,Z.cutscenes),Y(`optCutscene`).setAttribute(`aria-pressed`,String(Z.cutscenes));let e=Z.voiceMuted||Z.voiceVolume===0;Y(`optVoiceMute`).textContent=Z.voiceMuted?`VOICE OFF`:`VOICE ON`,Y(`optVoiceMute`).classList.toggle(`sel`,!Z.voiceMuted),Y(`optVoiceMute`).setAttribute(`aria-pressed`,String(!Z.voiceMuted)),Y(`voiceLevel`).value=String(Math.round(Z.voiceVolume*100)),Y(`voiceLevel`).setAttribute(`aria-valuetext`,Math.round(Z.voiceVolume*100)+` percent`),Y(`voiceLevelValue`).textContent=e?`MUTED`:Math.round(Z.voiceVolume*100)+`%`,Nv.setSettings(Z)}function Yy(){let e=!!Z.vibration;Y(`optVibe`)&&ub(`optVibe`).forEach(t=>t.classList.toggle(`sel`,t.dataset.v===`on`===e))}function Xy(e){return Z.vibration=!!e,Py(),Yy(),Z.vibration}function Zy(e){Object.assign(Z,nv(Z,e)),Py(),Jy()}Y(`optCutscene`).addEventListener(`click`,()=>Zy({cutscenes:!Z.cutscenes})),Y(`optVoiceMute`).addEventListener(`click`,()=>Zy({voiceMuted:!Z.voiceMuted})),Y(`voiceLevel`).addEventListener(`input`,e=>{Mv.init(),Nv.unlock().catch(()=>!1),Zy({voiceVolume:e.target.value/100})}),qy(Mv.muted);function Qy(){ky.forEach((e,t)=>{e.className=``,e.textContent=`S`+(t+1)}),Y(`split`).textContent=``}function $y(){tb(!0),Nv.stopAll(),Pv.stop(),ob(),clearTimeout(Oy),ey=`menu`,Ry(),Y(`hud`).classList.add(`hidden`),Y(`menu`).classList.remove(`hidden`),Y(`again-btn`)?.classList.remove(`hidden`),Y(`menu-btn`)&&(Y(`menu-btn`).textContent=`MENU`),Z.track!==Q.id&&By(Z.track),hb(),wb()}function eb(){if($.autopilot=!1,Fv=new hv(Z.mode,Z),!Fv.active)return;ey=`cinematic`;let e=ry===`career`&&X?A_(X):null;Y(`introLocation`).textContent=Q.name.toUpperCase(),Y(`introDetails`).textContent=pv(Uv,$,e),Y(`introShot`).textContent=$.solo?`TIME TRIAL  ·  YOUR CAR`:`GRID ${$.cars.length}  ·  YOUR START P${$.player.pos}`,Y(`introEyebrow`).textContent=$.solo?`DRIVE  ·  THE PERFECT LAP`:`DRIVE  ·  RACE DAY`,Y(`introTitleCard`).hidden=!1,Y(`broadcastIntro`).classList.remove(`hidden`),document.body.classList.add(`intro-active`),sb();let t=lv({type:`intro`},{solo:$.solo,intro:!0})[0];t.caption=`${Q.name.toUpperCase()}  /  ${$.solo?`ONE CAR. ONE CLEAR TRACK.`:`THE GRID IS READY.`}`,Pv.pending.announcer=t,cb(0)}function tb(e=!1){Fv&&(Fv=null,Y(`broadcastIntro`).classList.add(`hidden`),document.body.classList.remove(`intro-active`),document.body.classList.remove(`intro-has-caption`),e||ob())}function nb(e=!1){Fv&&(e&&Fv.skip(),tb(),$&&(ey=`racing`,eS=0,$x=performance.now(),Ty=e?3:1.5,ob(),iS(),Qv=!0,sx(),Mv.music=!1,$.solo||Uy(e?`GET READY`:`LIGHTS NEXT`,2),new URLSearchParams(location.search).get(`holdvideo`)===`1`&&($v=!0)))}function rb(){return!Fv||!Fv.active?!1:(Nv.unlock().catch(()=>!1),Nv.stopAll(),Pv.stop(),jv.keys.clear(),jv.takeActions(),nb(!0),!0)}function ib(e){ab(e),Nv.play(e,{onStart:(t,n)=>Pv.release(e.channel,Iv+n)})}function ab(e,t=4.8){let n=Y(`voiceCaption`);n.classList.remove(`hidden`),n.dataset.channel=e.channel,n.dataset.muted=String(Mv.muted||Z.voiceMuted||Z.voiceVolume===0),n.querySelector(`.voice-speaker`).textContent=e.speaker||(e.channel===`engineer`?`PIT WALL`:`RACE CONTROL`),n.querySelector(`.voice-text`).textContent=e.caption.toUpperCase(),n.querySelector(`.voice-sr`).textContent=`${e.speaker||`RACE CONTROL`}: ${e.caption}`,Rv=e.channel,Lv=Iv+t,sb()}function ob(e){e&&Rv!==e||(Y(`voiceCaption`).classList.add(`hidden`),Y(`voiceCaption`).dataset.channel=``,Rv=null,Lv=0,sb())}function sb(){let e=Y(`voiceCaption`);Fv&&!e.classList.contains(`hidden`)?Y(`broadcastIntro`).appendChild(e):e.parentElement!==Y(`app`)&&Y(`app`).appendChild(e)}function cb(e){if(Iv+=e,ey===`racing`&&!$.solo&&$.phase!==`countdown`){let e=$.player;Pv.telemetry({phase:$.phase,player:e,rain:$.rain,wetness:$.wetness,gaps:$.phase===`racing`?$.gaps(e):{},leaderId:$.order[0]?.id,time:Iv},Iv)}for(let e of Pv.tick(Iv,zv()))ib(e);Rv&&Iv>Lv&&!Nv.isPlaying(Rv)&&ob()}addEventListener(`pointerdown`,()=>{Mv.init(),Nv.unlock().catch(()=>!1)},{capture:!0}),addEventListener(`keydown`,()=>{Mv.init(),Nv.unlock().catch(()=>!1)},{capture:!0}),addEventListener(`keydown`,e=>{ey!==`cinematic`||e.repeat||(e.preventDefault(),e.stopImmediatePropagation(),rb())},{capture:!0}),document.addEventListener(`pointerdown`,e=>{ey===`cinematic`&&(e.preventDefault(),e.stopImmediatePropagation(),rb())},{capture:!0});function lb(e){e&&ey===`cinematic`&&rb(),!$||ey!==`racing`&&ey!==`paused`||(e&&Nv.stopAll(),ey=e?`paused`:`racing`,Y(`pause`).classList.toggle(`hidden`,!e),Y(`finish-btn`).classList.toggle(`hidden`,!$.solo))}var ub=e=>[...Y(e).querySelectorAll(`button`)];function db(e,t,n){let r=Y(e);if(!r)return;let i=Df(t);r.style.background=n==null?i:`linear-gradient(135deg, ${i} 58%, ${Df(n)} 58%)`}function fb(){let e=Y(`optTrack`);e.innerHTML=Xu.map(e=>{let t=U_(e);return`<button type="button" class="tcard nav" data-v="${e.id}" data-tag="${t.tag.id}"><canvas class="thumb" width="168" height="112" aria-hidden="true"></canvas><span class="tmeta"><b>${Lg(e.name.toUpperCase())}</b><span class="tag">${Lg(t.tag.label)}</span><span class="len">${Lg(B_(t.length))}</span><span class="tbest" data-best></span></span></button>`}).join(``);for(let t of e.querySelectorAll(`.tcard`)){let e=U_($u(t.dataset.v));G_(t.querySelector(`canvas`),e.samples,e.tag)}}fb();function pb(){let e=Y(`optTrack`);if(!e)return;let t=[...e.querySelectorAll(`.tcard`)];if(!t.length)return;let n=Math.max(0,t.findIndex(e=>e.dataset.v===Z.track)),r=t.length;t.forEach((e,t)=>{let i=t-n;i>r/2&&(i-=r),i<-r/2&&(i+=r);let a=Math.abs(i)<=0;e.classList.toggle(`ghost`,a&&i!==0),e.classList.toggle(`away`,!a),e.tabIndex=a?0:-1,e.style.setProperty(`--d`,String(i))})}function mb(){for(let e of Y(`optTrack`).querySelectorAll(`.tcard`)){let t=wd(Vv,e.dataset.v,Z.cls),n=e.querySelector(`[data-best]`);n&&(n.textContent=`BEST `+(t?ed(t.bestLap):`--:--.---`))}}function hb(){let e=(e,t)=>ub(e).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===String(t)));e(`optMode`,Z.mode),e(`optDiff`,Z.difficulty),e(`optClass`,Z.cls),e(`optLaps`,Z.laps),e(`optWeather`,Z.weather),e(`optTrack`,Z.track),ub(`optMode`).forEach(e=>e.setAttribute(`aria-selected`,e.classList.contains(`sel`)?`true`:`false`));let t=Z.mode===`tt`,n=Z.mode===`career`;Y(`rowLaps`).classList.toggle(`hidden`,t||n),Y(`rowWeather`).classList.toggle(`hidden`,t),Y(`rowTrack`).classList.toggle(`hidden`,n),Y(`rowClass`).classList.toggle(`hidden`,n);let r=!yd(Vv,`speedway`);Y(`clsSpeedway`).classList.toggle(`locked`,r),Y(`clsSpeedway`).textContent=r?`SPEEDWAY [LOCKED]`:`SPEEDWAY`;let i=Iy();if(db(`teamSwatch`,i.c1,i.c2),Y(`teamLabel`).textContent=i.name,n){let e=X?A_(X):null,t=X?`${X.driver.name} · ${X.team.name}`:`Create a driver and a team`,n=e?$u(e.id).name:X?.complete?`Season complete`:`A season across every circuit`;Y(`goalBox`).innerHTML=`<b>CAREER</b> ${Lg(t)}<br>${Lg(n)}`,Y(`start-btn`).textContent=X?`CAREER`:`NEW CAREER`}else{let e=Dd(Z,Vv),t=xd(Vv,Z.cls);Y(`goalBox`).innerHTML=`<b>GOAL</b> ${e.text}`+(t&&isFinite(t.bestLap??NaN)?`<br>Best lap (${Z.cls.toUpperCase()}): ${ed(t.bestLap)}`:``),Y(`start-btn`).textContent=`START`}Y(`menuMsg`).textContent=!n&&r?bd(`speedway`):``,mb(),pb(),My(),Jy()}function gb(e){Z.mode!==`career`&&(Z.track=Xu[(Math.max(0,Xu.findIndex(e=>e.id===Z.track))+e+Xu.length)%Xu.length].id,By(Z.track),Py(),hb())}for(let[e,t]of[[`optMode`,`mode`],[`optDiff`,`difficulty`],[`optClass`,`cls`],[`optLaps`,`laps`],[`optWeather`,`weather`],[`optTrack`,`track`]])Y(e).addEventListener(`click`,e=>{let n=e.target.closest(`button`);n&&(t===`cls`&&!yd(Vv,n.dataset.v)?Y(`menuMsg`).textContent=bd(n.dataset.v):(Z[t]=t===`laps`?+n.dataset.v:n.dataset.v,t===`track`&&(By(Z.track),Py()),hb()))});Y(`optLine`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&!t.disabled&&Ny(t.dataset.v===`on`)}),Y(`optGfx`)?.addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&Zx(t.dataset.v)}),Y(`optVibe`)?.addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&Xy(t.dataset.v===`on`)}),Yy(),Zx(xg(Vv.settings?.gfx)||Sv,!1),Y(`pLine`).addEventListener(`click`,()=>Ny(!jy())),Y(`start-btn`).addEventListener(`click`,()=>{Z.mode===`career`?Nb():Hy()}),Y(`team-btn`).addEventListener(`click`,()=>Bb(`menu`)),Y(`trackPrev`).addEventListener(`click`,()=>gb(-1)),Y(`trackNext`).addEventListener(`click`,()=>gb(1));var _b=new Set([`menu`,`career`,`standings`,`recruit`]),vb=!1;function yb(){return!Y(`controls`)?.classList.contains(`hidden`)}function bb(){let e=Y(`controls`);e&&!e.classList.contains(`hidden`)&&(e.classList.add(`hidden`),document.querySelectorAll(`[data-help]`).forEach(e=>e.setAttribute(`aria-expanded`,`false`)))}function xb(){Y(`controls`).classList.remove(`hidden`),document.querySelectorAll(`[data-help]`).forEach(e=>e.setAttribute(`aria-expanded`,`true`)),Cb(Y(`help-close`),!0)}function Sb(){let e=yb()?Y(`controls`):Y(ey);return e?[...e.querySelectorAll(`.nav`)].filter(e=>{if(e.disabled||e.tabIndex<0||e.closest(`.hidden`))return!1;let t=e.getBoundingClientRect();return t.width>=1&&t.height>=1}):[]}function Cb(e,t){if(document.querySelectorAll(`.is-focus`).forEach(e=>e.classList.remove(`is-focus`)),e){t&&e.classList.add(`is-focus`);try{e.focus({preventScroll:!0})}catch{}}}function wb(){if(!_b.has(ey)||yb())return;let e=Sb();Cb([`carRace`,`standBack`,`start-btn`].map(e=>Y(e)).find(t=>t&&e.includes(t))||e[0],!1)}function Tb(e){let t=Sb();if(!t.length)return;let n=t.indexOf(document.activeElement);n<0&&(n=t.findIndex(e=>e.classList.contains(`is-focus`))),n<0&&(n=0);let r=K_(t.map(e=>{let t=e.getBoundingClientRect();return{x:t.left,y:t.top,w:t.width,h:t.height}}),n,e);Cb(t[r<0?n:r],!0)}function Eb(){yb()?(bb(),Cb(Y(`help-btn`),vb)):ey===`standings`?X?Pb():$y():ey!==`recruit`&&ey===`career`&&$y()}function Db(e){if(e===`a`){let e=Sb();(e.find(e=>e===document.activeElement)||e.find(e=>e.classList.contains(`is-focus`))||e.find(e=>e.classList.contains(`big`))||e[0])?.click()}else e===`b`?Eb():(e===`left`||e===`right`||e===`up`||e===`down`)&&(vb=!0,Tb(e))}addEventListener(`keydown`,e=>{if(!_b.has(ey))return;let t=document.activeElement;if(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))return;let n={ArrowLeft:`left`,ArrowRight:`right`,ArrowUp:`up`,ArrowDown:`down`}[e.code];n?(e.preventDefault(),vb=!0,Tb(n)):e.code===`Escape`&&(e.preventDefault(),Eb())}),document.addEventListener(`pointerdown`,e=>{(e.pointerType===`mouse`||e.pointerType===`touch`)&&document.querySelectorAll(`.is-focus`).forEach(e=>e.classList.remove(`is-focus`))}),document.addEventListener(`click`,e=>{e.target.closest?.(`[data-help]`)?xb():yb()&&e.target.id===`controls`&&bb()}),Y(`help-close`).addEventListener(`click`,bb);var Ob={up:!1,down:!1,left:!1,right:!1,a:!1,b:!1},kb=0;function Ab(e){if(!_b.has(ey)){Ob={up:!1,down:!1,left:!1,right:!1,a:!1,b:!1};return}let t=navigator.getGamepads?navigator.getGamepads():[],n={up:!1,down:!1,left:!1,right:!1,a:!1,b:!1};for(let e of t){if(!e||!e.connected)continue;let t=q_(e);for(let e in n)n[e]=n[e]||t[e]}let r=Y_(Ob,n),i=n.left?`left`:n.right?`right`:n.up?`up`:n.down?`down`:``,a=r.some(e=>e===`left`||e===`right`||e===`up`||e===`down`);i&&!a&&e-kb>220?(r.push(i),kb=e):a&&(kb=e),Ob=n;for(let e of r)Db(e)}Y(`again-btn`).addEventListener(`click`,()=>Hy()),Y(`restart-btn`).addEventListener(`click`,()=>Hy()),Y(`resume-btn`).addEventListener(`click`,()=>lb(!1)),Y(`finish-btn`).addEventListener(`click`,()=>fx()),Y(`menu-btn`).addEventListener(`click`,()=>{ry===`career`&&X?Rb():$y()}),Y(`pmenu-btn`).addEventListener(`click`,$y);var jb=`career`;function Mb(e){Ry(),Y(`hud`).classList.add(`hidden`),Y(e).classList.remove(`hidden`),ey=e}function Nb(){X?(X.difficulty=Z.difficulty,X.weather=Z.weather,k_(Bv,X),Pb()):Bb(`season`)}function Pb(){if(!X){Bb(`season`);return}if(S_(X)){Wb();return}let e=N_(X).find(e=>e.player),t=A_(X),n=y_(X);Y(`carTitle`).textContent=`SEASON ${X.season}`,Y(`carRound`).textContent=X.complete?`SEASON COMPLETE`:`ROUND ${t.index+1} OF ${t.count}  ·  ${$u(t.id).name.toUpperCase()}`,Y(`carCal`).innerHTML=X.calendar.map((e,t)=>{let n=t<X.round||X.complete?`done`:t===X.round?`now`:``,r=$u(e).name;return`<li class="${n}" title="${Lg(r)}"><b>${t+1}</b> ${Lg(r)}</li>`}).join(``),db(`carSwatch`,X.team.livery.c1,X.team.livery.c2),Y(`carWho`).textContent=`${X.driver.name}  #${X.driver.number}  ·  ${X.team.name}`,Y(`carMeta`).textContent=`P${e.pos}  ·  ${e.points} PTS  ·  RESEARCH ${X.upgradePoints}  ·  ${md[X.difficulty].name.toUpperCase()}`,Y(`carClass`).textContent=`CLASS  ${n.toUpperCase()}`;let r=Y(`carScout`);if(n===`gp`&&!X.complete){let e=x_(X);r.textContent=e>0?`Speedway scouts watching: ${e} pts needed`:`Speedway scouts watching: threshold met (90 pts)`,r.classList.remove(`hidden`)}else n===`gp`&&X.complete&&!S_(X)?(r.textContent=C_(X),r.classList.remove(`hidden`)):(r.textContent=``,r.classList.add(`hidden`));ub(`carLaps`).forEach(e=>e.classList.toggle(`sel`,+e.dataset.v===X.laps)),Y(`carRace`).classList.toggle(`hidden`,!!X.complete),Y(`carRace`).textContent=t?`RACE`:`STANDINGS`,Vy(),Mb(`career`),wb()}function Fb(){if(!X)return Nb();let e=A_(X);if(!e){Ib();return}let t={mode:Z.mode,cls:Z.cls,laps:Z.laps,track:Z.track,difficulty:Z.difficulty};X.difficulty=Z.difficulty,X.weather=Z.weather,k_(Bv,X);let n=y_(X),r=a[n]||a.gp;Hy({keepCareer:!0,restore:t,mode:`race`,difficulty:X.difficulty,cls:n,laps:X.laps,weather:X.weather,track:e.id,grid:M_(X,r),driver:{name:X.driver.name,number:X.driver.number}})}function Ib(){if(!X)return $y();let e=N_(X),t=X.complete?e[0]:null;Y(`standHead`).textContent=t?t.player?`SEASON ${X.season} CHAMPION — YOU`:`SEASON ${X.season} CHAMPION — ${t.name}`:`SEASON ${X.season}  ·  ROUND ${Math.min(X.round+1,X.calendar.length)}/${X.calendar.length}`;let n=e.map(e=>`<tr class="${e.player?`me`:``}"><td>${e.pos}</td><td><i class="chip" style="background:${Df(e.c1)}"></i> ${Lg(e.name)} <small>#${e.number}</small></td><td>${Lg(e.team)}</td><td>${e.player?`YOU`:e.rating}</td><td>${e.points}</td></tr>`).join(``);Y(`standTable`).innerHTML=`<thead><tr><th>P</th><th>DRIVER</th><th>TEAM</th><th>RTG</th><th>PTS</th></tr></thead><tbody>${n}</tbody>`,Vy(),Mb(`standings`),wb()}function Lb(){if(!X)return $y();Y(`upPoints`).textContent=`RESEARCH POINTS  ${X.upgradePoints}`,Y(`upList`).innerHTML=Qg.map(e=>{let t=X.upgrades[e]||0,n=h_(X,e),r=n==null?`MAX`:X.upgradePoints>=n?`BUY ${n}`:`NEED ${n}`;return`<div class="uprow"><b style="width:5.2em">${t_[e]}</b><div class="bar"><i style="width:${t/5*100}%"></i></div><span>${t}/5</span><button class="btn" data-up="${e}" ${n==null||X.upgradePoints<n?`disabled`:``}>${r}</button></div><div class="meta" style="text-align:left">${Lg(n_[e])}</div>`}).join(``),Mb(`upgrades`)}function Rb(){jb=`results`,Lb()}function zb(e){Hv={driver:{name:e.driver,number:e.number},team:{name:e.name,tag:e.tag,livery:{pattern:e.pattern,c1:e.c1,c2:e.c2,c3:e.c3,number:e.number}}},u_(Bv,Hv),Hv=l_(Bv),X&&=(X.driver={...Hv.driver},X.team=Hv.team,k_(Bv,X),O_(Bv))}function Bb(e){ay=e;let t=Fy(),n=t.team.livery||{};oy=Nf({driver:t.driver.name,name:t.team.name,tag:t.team.tag,pattern:n.pattern,c1:n.c1,c2:n.c2,c3:n.c3,number:t.driver.number}),Y(`edTitle`).textContent=e===`season`?`NEW CAREER`:`YOUR TEAM`,Y(`edSave`).textContent=e===`season`?`START SEASON`:`DONE`,Y(`edDriver`).value=oy.driver,Y(`edTeam`).value=oy.name,Y(`edNumber`).value=String(oy.number),Y(`edMsg`).textContent=``,Vb(),Mb(`editor`),Qb(Ff(oy))}function Vb(){Y(`edTag`).textContent=oy.tag,ub(`edChannel`).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===sy)),ub(`edPattern`).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===oy.pattern));let e=oy[sy];for(let t of Y(`edSwatches`).querySelectorAll(`.swatch`))t.classList.toggle(`sel`,parseInt(t.dataset.c,16)===e);let t=Y(`edColor`);t&&(t.value=Df(e))}function Hb(e){oy=Pf(oy,e),Vb(),Qb(Ff(oy))}Y(`edPattern`).innerHTML=gf.map(e=>`<button data-v="${e.id}">${e.name}</button>`).join(``),Y(`edSwatches`).innerHTML=yf.map(e=>`<button class="swatch" data-c="${e.toString(16)}" style="background:${Df(e)}"></button>`).join(``)+`<input type="color" id="edColor" value="#e8472a" aria-label="Custom colour" />`,Y(`edChannel`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&(sy=t.dataset.v,Vb())}),Y(`edPattern`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&Hb({pattern:t.dataset.v})}),Y(`edSwatches`).addEventListener(`click`,e=>{let t=e.target.closest(`.swatch`);t&&Hb({[sy]:parseInt(t.dataset.c,16)})}),Y(`edColor`).addEventListener(`input`,()=>Hb({[sy]:Y(`edColor`).value})),Y(`edNumber`).addEventListener(`input`,()=>Hb({number:Y(`edNumber`).value}));function Ub(){let e=Y(`edTeam`).value,t=Y(`edDriver`).value,n=xf(e),r=xf(t);n===`blocked`||r===`blocked`?Y(`edMsg`).textContent=hf:n===`short`?Y(`edMsg`).textContent=`Team name needs 3 to 18 characters`:r===`short`?Y(`edMsg`).textContent=`Driver name needs 3 to 18 characters`:(oy=Pf(oy,{name:e,driver:t,number:Y(`edNumber`).value}),zb(oy),ay===`season`?(X=E_({driverName:oy.driver,number:oy.number,team:Hv.team,difficulty:Z.difficulty,weather:Z.weather,laps:X?.laps||Z.laps||4},Hv),k_(Bv,X),Pb()):ay===`career`&&X?Pb():$y())}Y(`edSave`).addEventListener(`click`,Ub),Y(`edBack`).addEventListener(`click`,()=>{ay===`career`&&X?Pb():$y()}),Y(`carLaps`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);t&&X&&(X.laps=+t.dataset.v,k_(Bv,X),Pb())}),Y(`carRace`).addEventListener(`click`,Fb),Y(`carUp`).addEventListener(`click`,()=>{jb=`career`,Lb()}),Y(`carStand`).addEventListener(`click`,Ib),Y(`carTeam`).addEventListener(`click`,()=>Bb(`career`)),Y(`carMenu`).addEventListener(`click`,$y),Y(`carSeason`).addEventListener(`click`,()=>{if(!X)return;if(S_(X)){Wb();return}let e=Y(`carSeason`);e.dataset.arm===`1`?(e.dataset.arm=``,e.textContent=`NEW SEASON`,F_(X),k_(Bv,X),Pb()):(e.dataset.arm=`1`,e.textContent=`CONFIRM`)}),Y(`standBack`).addEventListener(`click`,()=>X?Pb():$y()),Y(`standMenu`).addEventListener(`click`,$y),Y(`upList`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-up]`);t&&!t.disabled&&X&&(g_(X,t.dataset.up).ok&&k_(Bv,X),Lb())}),Y(`upDone`).addEventListener(`click`,()=>{if(jb===`results`&&X?.complete){if(jb=`career`,S_(X)){Wb();return}Ib()}else jb=`career`,X?Pb():$y()});function Wb(){if(!X||!S_(X))return Pb();let e=Zg,t=X.points.player||0;db(`recruitSwatch`,e.livery.c1,e.livery.c2),Y(`recruitWho`).textContent=`${e.name}  ·  ${e.tag}`,Y(`recruitHead`).textContent=`SPEEDWAY SEAT OFFERED`,Y(`recruitBlurb`).textContent=`${e.name} wants you for next season after a ${t}-point GP campaign. Keep your driver, team name and livery. Upgrades reset for the new class. Accept to race Speedway, or decline and stay in GP.`,Mb(`recruit`),wb()}function Gb(){if(!X)return $y();let e=w_(X);e.ok&&e.unlocked&&Ad(Vv,`speedway`)&&vd(Bv,Vv),k_(Bv,X),Pb()}function Kb(){if(!X)return $y();T_(X),k_(Bv,X),Pb()}Y(`recruitAccept`).addEventListener(`click`,Gb),Y(`recruitDecline`).addEventListener(`click`,Kb);var qb=null,Jb=null,Yb=null,Xb=null;function Zb(){if(qb)return;qb=new fu({canvas:Y(`liveryCanvas`),antialias:!0,alpha:!1}),qb.setPixelRatio(Math.min(window.devicePixelRatio||1,bg[Sv].dprCap)),qb.toneMapping=4,qb.toneMappingExposure=.95,qb.outputColorSpace=It,qb.shadowMap.enabled=!0,qb.shadowMap.type=1,Jb=new Sr,Jb.background=new G(791072),Jb.fog=new xr(791072,9,18);let e=new Cs(qb);Jb.environment=Dg(e,`sky`),Jb.environmentIntensity=.55,Yb=new Ao(30,1,.1,40),Jb.add(new vo(13623551,2107443,.6));let t=new Fo(16773590,3.2);t.position.set(4,7,5),t.castShadow=!0,t.shadow.mapSize.set(1024,1024),Object.assign(t.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:1,far:20}),t.shadow.radius=3,t.shadow.bias=-5e-4,Jb.add(t);let n=new Fo(10470655,1.6);n.position.set(-5,3,-6),Jb.add(n);let r=new zi(new _a(7,48),new Wa({color:1844531,roughness:.55,metalness:0}));r.rotation.x=-Math.PI/2,r.receiveShadow=!0,Jb.add(r)}function Qb(e){Zb(),Xb&&(Jb.remove(Xb.group),rm(Xb)),Xb=Kp(`gp`,e,!1,!1,0),Xb.body.castShadow=!0,Jb.add(Xb.group)}function $b(){if(ey!==`editor`||!Xb)return;let e=Y(`liveryCanvas`),t=Math.max(2,e.clientWidth|0),n=Math.max(2,e.clientHeight|0);(qb.domElement.width!==t||qb.domElement.height!==n)&&(qb.setSize(t,n,!1),Yb.aspect=t/n,Yb.updateProjectionMatrix());let r=performance.now()*.001;Xb.group.rotation.y=r*.7,Xb.wheels.forEach(e=>{e.spin=r*2}),qp(Xb);let i=9.2/Math.min(1.25,Math.max(.6,Yb.aspect));Yb.position.set(Math.sin(r*.15)*i,2.6,Math.cos(r*.15)*i),Yb.lookAt(0,.45,0),qb.render(Jb,Yb)}jv.onTap(Y(`bCam`),Ky),jv.onTap(Y(`bAuto`),()=>$&&Wy(!$.autopilot)),jv.onTap(Y(`bPit`),()=>tx()),jv.onTap(Y(`bMute`),()=>qy(!Mv.muted)),jv.onTap(Y(`bPause`),()=>lb(ey===`racing`)),jv.onTap(Y(`bEnd`),()=>fx()),jv.onTap(Y(`bDry`),()=>$?.choosePitTire(`dry`)),jv.onTap(Y(`bWet`),()=>$?.choosePitTire(`wet`));function ex(){lv({type:`pitrequest`},{solo:$?.solo})[0]&&(Pv.pending.engineer={id:`radio_pit_confirmed`,channel:`engineer`,speaker:`PIT WALL`,caption:`PIT CONFIRMED  ·  ENTRY ON YOUR LEFT`,priority:100},cb(0))}function tx(){if(!$||$.solo)return;let e=$.player;e.pit.stage||($.requestPit(e,!e.pit.request),e.pit.request&&ex(),Uy(e.pit.request?`PIT NEXT LAP`:`PIT CANCELLED`))}var nx=Y(`mm`),rx=nx.getContext(`2d`),ix=null;function ax(){let e=1e9,t=-1e9,n=1e9,r=-1e9;for(let i=0;i<Q.n;i++)e=Math.min(e,Q.px[i]),t=Math.max(t,Q.px[i]),n=Math.min(n,Q.pz[i]),r=Math.max(r,Q.pz[i]);let i=Math.max(1,t-e),a=Math.max(1,r-n),o=nx.width,s=Math.min((o-20)/i,(o-20)/a),c=(o-i*s)/2,l=(o-a*s)/2,u=t=>c+(t-e)*s,d=e=>o-(l+(e-n)*s),f=document.createElement(`canvas`);f.width=f.height=o;let p=f.getContext(`2d`);p.fillStyle=`#0c1218`,p.fillRect(0,0,o,o),p.lineJoin=`round`,p.lineCap=`round`;let m=Q.themeId===`desertNight`?`#e0b15a`:Q.themeId===`neonStreet`?`#ff7ad4`:Q.themeId===`coastal`?`#f0d7a4`:`#d5deea`,h=()=>{p.beginPath();for(let e=0;e<=Q.n;e+=2){let t=e%Q.n;e?p.lineTo(u(Q.px[t]),d(Q.pz[t])):p.moveTo(u(Q.px[t]),d(Q.pz[t]))}p.closePath()};p.strokeStyle=`#07090c`,p.lineWidth=11,h(),p.stroke(),p.strokeStyle=m,p.lineWidth=7,h(),p.stroke(),p.fillStyle=`#fff`,p.fillRect(u(Q.px[0])-5,d(Q.pz[0])-1.5,10,3),ix={c:f,mapX:u,mapY:d}}ax();function ox(){rx.clearRect(0,0,nx.width,nx.height),rx.drawImage(ix.c,0,0);for(let e=0;e<2;e++)for(let t of $.cars){if(e===1!==t.isPlayer)continue;let n=t._r||t,r=ix.mapX(n.x),i=ix.mapY(n.z);rx.fillStyle=`#000`,rx.beginPath(),rx.arc(r,i,t.isPlayer?7.5:5.5,0,7),rx.fill(),rx.fillStyle=t.isPlayer?`#ffe14a`:t.team._hex||=cx(t.team.c1),rx.beginPath(),rx.arc(r,i,t.isPlayer?5.5:3.6,0,7),rx.fill()}}function sx(){$&&(dx(),Dy=.05,ox(),xy=1/30)}var cx=e=>`#`+e.toString(16).padStart(6,`0`);function lx(e,t){let n=Y(e);n._v!==t&&(n._v=t,n.textContent=t)}function ux(e,t){let n=Y(e);n._v!==t&&(n._v=t,n.innerHTML=t)}function dx(){let e=$.player,t=$.lapTimer;$.solo?(ux(`pos`,`TIME TRIAL`),lx(`lap`,`L${e.laps+1}`)):(ux(`pos`,`P${e.pos}<small>/${$.cars.length}</small>`),lx(`lap`,`LAP ${Math.min(e.laps+1,$.laps)}/${$.laps}`)),lx(`laptime`,ed(ad(t,$.time))),lx(`best`,`BEST `+ed(t.bestLap)),ky.forEach((e,n)=>e.classList.toggle(`cur`,t.g>=0&&n===od(t))),lx(`speed`,String(Math.round(Math.max(0,e.v)*3.6))),lx(`tire`,e.tire===`wet`?`W`:`D`),Y(`tire`).classList.toggle(`wet`,e.tire===`wet`);let n=Y(`wearbar`).firstElementChild;n.style.width=(1-e.wear)*100+`%`,n.style.background=e.wear>.7?`#e8472a`:e.wear>.45?`#f2c230`:`#5de06a`,Y(`boostbar`).firstElementChild.style.width=e.boost*100+`%`,$.solo||ux(`board`,Wg($.order,e.pos));let r=Y(`gaps`);if(!$.solo&&$.phase===`racing`&&!e.finished){let t=$.gaps(e);r.classList.remove(`hidden`),lx(`gAhead`,t.ahead==null?``:`▲ `+Sx(t.ahead,`+`)),lx(`gBehind`,t.behind==null?``:`▼ `+Sx(t.behind,`-`))}else r.classList.add(`hidden`);Y(`bPit`).classList.toggle(`on`,e.pit.request||e.pit.stage>0),Y(`bPit`).classList.toggle(`hidden`,$.solo),Y(`bc`).classList.toggle(`hidden`,!e.pit.stage),e.pit.stage&&lx(`pitmsg`,e.pit.stage===2?e.pit.choice?`SERVICE...`:`CHOOSE TIRES`:e.pit.stage===1?`PIT LANE - CHOOSE`:`PIT EXIT`),Y(`bDry`).classList.toggle(`on`,e.pit.choice===`dry`),Y(`bWet`).classList.toggle(`on`,e.pit.choice===`wet`);let i=Q.section[e.idx];i!==Cy&&(Cy=i,Y(`sect`).textContent=Q.sections[i].toUpperCase(),Y(`sect`).classList.add(`on`),wy=3)}function fx(){$&&ey!==`results`&&(clearTimeout(Oy),px())}function px(){let e=$.player,t,n,r=[];if($.solo){t=`TIME TRIAL`,Y(`resSum`).innerHTML=``;let i=Math.min(...e.lapTimes,1/0);n=e.lapTimes.map((e,t)=>`<tr class="${e===i?`me`:``}"><td>LAP ${t+1}</td><td>${ed(e)}</td><td>${e===i?`BEST`:`+`+(e-i).toFixed(3)}</td></tr>`),n.length||(n=[`<tr><td>No completed laps</td></tr>`]),e.lapTimes.length&&$.lapTimer.laps.length&&$.lapTimer.bestLap===i&&e.recordSet&&r.push(`NEW PERSONAL BEST!`),Y(`resGoal`).textContent=``;let a=Od(ny,{bestLap:i});Y(`resGoal`).textContent=a.text,Y(`resGoal`).className=a.met?`ok`:`no`}else{let e=$.results(),i=e.find(e=>e.isPlayer);t=i.pos===1?`VICTORY!`:i.pos<=3?`PODIUM!`:`RACE RESULTS`;let a=$.player.team.c1;Y(`resSum`).innerHTML=`<span class="big">P${i.pos}</span><span class="chip" style="background:${cx(a)}"></span><span>${i.pos===1?ed(i.time,!1):`+`+(i.gap??0).toFixed(1)+`s`}</span><span>BEST ${ed(i.best,!1)}</span>`,n=Gg(e,ed);let o=Od(ny,{pos:i.pos});Y(`resGoal`).textContent=o.text,Y(`resGoal`).className=o.met?`ok`:`no`;let s=kd(Vv,{mode:`race`,cls:ry===`career`?y_(X):Z.cls,pos:i.pos});if(vd(Bv,Vv),r.push(...s.messages),ry===`career`&&X&&!iy){iy=!0;let t=P_(X,e.map(e=>({id:e.id,pos:e.pos,isPlayer:e.isPlayer})));if(k_(Bv,X),t){let e=t.standings.find(e=>e.player);r.push(`+${t.points} PTS`,`+${t.upgrade} RESEARCH`,`CHAMPIONSHIP P${e.pos} · ${e.points} PTS`),t.complete&&r.push(Kg(t.standings[0])),Y(`resGoal`).textContent=`${Q.name.toUpperCase()}  +${t.points} PTS`}}}tb(),Y(`resTitle`).textContent=t,Y(`restable`).innerHTML=n.join(``),Y(`resMsg`).innerHTML=r.join(`<br>`),Y(`again-btn`).textContent=$.solo?`RETRY`:`RESTART`,Y(`again-btn`).classList.toggle(`hidden`,ry===`career`),Y(`menu-btn`).textContent=ry===`career`?`CONTINUE`:`MENU`;for(let e of[`hud`,`pause`])Y(e).classList.add(`hidden`);Y(`results`).classList.remove(`hidden`),ey=`results`,hb()}function mx(e){let t=Y(`banner`);t.textContent=e,t.classList.remove(`on`),t.offsetWidth,t.classList.add(`on`)}function hx(){let e=Y(`flag`);e.classList.remove(`on`),e.offsetWidth,e.classList.add(`on`)}function gx(e,t){let n=Y(`posPop`),r=t<e;n.textContent=`P${t} ${r?`▲`:`▼`}`,n.className=`on `+(r?`up`:`down`),my=1.5}function _x(){let e=Y(`lights`),t=$.phase===`countdown`?$.lights:0,n=!$.solo&&($.phase===`countdown`||$.goFlash>0);e.classList.toggle(`hidden`,!n),document.body.classList.toggle(`lit`,n),e.classList.toggle(`go`,$.phase!==`countdown`&&$.goFlash>0),e.classList.toggle(`fade`,$.phase!==`countdown`&&$.goFlash<.8),t!==hy&&(hy=t,[...e.children].forEach((e,n)=>e.classList.toggle(`on`,n<t)))}var vx={},yx=0,bx=0;function xx(t){let n=$.player,r=n.cls.vTop,i=$.phase===`racing`,a=i?+!!n.boosting+Math.min(1,(n.slip||0)/.3)*.5:0;fy+=(Math.min(1,a)-fy)*(1-Math.exp(-t*(a>fy?6:2.5)));let o=i&&n.surface===`kerb`&&n.v>15;if(o&&(Sy=Math.max(Sy,.1*Math.min(1,n.v/60))),o&&!py&&Mv.beep?.(90,.04,`square`,.05),py=o,i&&n.v>20&&(Sy=Math.max(Sy,.105*n.lockup,.055*n.flat*Math.min(1,n.v/50))),i&&n.v>65&&(Sy=Math.max(Sy,.013*e((n.v-65)/25,0,1))),i&&Z.vibration&&typeof navigator.vibrate==`function`){let e=L(o,n.lockup,n.v),t=performance.now();e&&t-bx>150&&(navigator.vibrate(e),bx=t)}let s=i?e((n.v/r-.55)/.4,0,1)*.75+fy*.35:0,c=.3+.7*Zv.chase;gy+=(Math.min(1,s)*c-gy)*(1-Math.exp(-t*4));let l=e(n.latFrac||0,0,1.25);if(yx+=t,yx>=1/62){let e=vx;e.dt=yx,yx=0,e.v=Math.abs(n.v),e.vTop=r,e.throttle=n.input.throttle,e.brake=n.input.brake,e.lat=l,e.lock=n.lockup,e.slip=n.wheelSlip,e.slipAngle=n.slipAngle,e.kerb=o,e.on=i||$.phase===`countdown`,e.boosting=n.boosting,Mv.drive(e)}my-=t,my<0&&Y(`posPop`).classList.remove(`on`)}function Sx(e,t){return e==null?``:`${t}${e.toFixed(1)}`}function Cx(){let e=$.player;for(let t of $.events)if(t.type===`finish`&&!t.car.isPlayer&&Pv.event({type:`winner`,car:t.car},{player:e,solo:$.solo,position:e.pos},Iv),Pv.event(t,{player:e,solo:$.solo,position:e.pos,mode:Z.mode},Iv),t.type===`light`)Mv.beep(440,.12);else if(t.type===`go`)Mv.beep(880,.4),Mv.music=!0,Uy(`GO!`,1.5);else if(t.type===`finallap`)mx(`FINAL LAP`);else if(t.type===`poschange`)gx(t.from,t.to);else if(t.type===`rain`)Uy(`RAIN STARTING - WET TIRES?`,5);else if(t.type===`hit`&&t.car.isPlayer)Sy=Math.max(Sy,Math.min(1,.35+t.power*.65)),Mv.thump();else if(t.type===`startline`)Qy(),Uy($.solo?`FLYING LAP`:`LAP 1`,1.5);else if(t.type===`sector`){let e=ky[t.sector];t.sector===0&&Qy(),e.className=t.status,e.textContent=ed(t.time,!0).slice(2);let n=t.delta==null?`S`+(t.sector+1):`S${t.sector+1} ${td(t.delta)}`;Y(`split`).textContent=n,Y(`split`).className=t.status,Ey=3,Mv.beep(t.status===`purple`?1320:t.status===`green`?1100:760,.08)}else if(t.type===`laptime`){let n=`${ed(t.time)}${t.delta==null?``:`  `+td(t.delta)}`;!$.solo&&e.finished||Uy((t.isBest?`BEST LAP `:`LAP `)+n,3.5),Mv.beep(990,.15);let r=Sd(Vv,Z.cls,t);Td(Vv,Q.id,$.cls?.id||Z.cls,t),r&&(e.recordSet=!0),vd(Bv,Vv),t.ghost&&r&&(Vg(Bv,Wv,Q.id,Z.cls,t.ghost),$.solo&&(qv=t.ghost))}else t.type===`winner`||(t.type===`finish`&&t.car.isPlayer?(Uy(`FINISH!`,3),Mv.beep(1200,.5),hx()):t.type===`pit`&&t.car.isPlayer&&Uy(`TIRES CHANGED`,2));$.events.length=0}function wx(){for(let e of jv.takeActions())if(e===`pause`)lb(ey===`racing`);else if(ey!==`racing`)continue;else e===`camera`?Ky():e===`autopilot`?Wy(!$.autopilot):e===`mute`?qy(!Mv.muted):e===`pit`?tx():e===`tire:dry`?$.choosePitTire(`dry`):e===`tire:wet`&&$.choosePitTire(`wet`)}var Tx={x:0,y:0,z:0,yaw:0},Ex=null;function Dx(){let e=1e9,t=-1e9,n=1e9,r=-1e9;for(let i=0;i<Q.n;i++)e=Math.min(e,Q.px[i]),t=Math.max(t,Q.px[i]),n=Math.min(n,Q.pz[i]),r=Math.max(r,Q.pz[i]);Ex={cx:(e+t)/2,cz:(n+r)/2,w:t-e+120,h:r-n+120}}Dx();var Ox=new W,kx=new W,Ax=new W,jx=new W,Mx=new W,Nx=new W,Px=new W,Fx=new W;new W,new W;var Ix=new W,Lx=new W,Rx={x:0,y:0,z:0,half:90,dist:40},zx=e=>e*e*(3-2*e);function Bx(t){Qv&&=(t=8,!1);let n=rS||$.player;for(let e of Jv){let n=+(e===Xv);Zv[e]+=(n-Zv[e])*(1-Math.exp(-t*2.4)),Math.abs(n-Zv[e])<.003&&(Zv[e]=n)}let r=zx(Zv.chase),i=zx(Zv.overhead),a=zx(Zv.full),o=r+i+a||1,s=r/o,c=i/o,l=a/o,u=e(n.v/80,0,1);A(dy,`motionLag`,(n.yawRate||0)*.035,5,t);let d=+!!n.pit.stage;Tx.pz=(Tx.pz??0)+(d-(Tx.pz??0))*(1-Math.exp(-t*2.5));let f=kv(58+u*6,62,92),p=ce(dy,n,Q,t,{fovDeg:f,aspect:bv.aspect,motionLag:dy.motionLag});Ax.fromArray(p.pos),jx.fromArray(p.look);let m=bv.aspect<1;le(Tx,n,t);let h=O({x:Tx.x,y:Tx.y,z:Tx.z,yaw:Tx.yaw,aspect:bv.aspect,zoom:1-.35*Tx.pz}),g=h.fov,_=h.distance;Mx.fromArray(h.pos),Nx.fromArray(h.target);let v=kv(35,30,55),y=62*Math.PI/180,b=2*Math.atan(Math.tan(v*Math.PI/360)*bv.aspect),x=Math.max(Ex.w/2/Math.tan(b/2),Ex.h*Math.sin(y)/(2*Math.tan(v*Math.PI/360)))*1.04;Px.set(Ex.cx,0,Ex.cz-Math.cos(y)*x).setY(Math.sin(y)*x),Fx.set(Ex.cx,0,Ex.cz),Ox.set(0,0,0).addScaledVector(Ax,s).addScaledVector(Mx,c).addScaledVector(Px,l),kx.set(0,0,0).addScaledVector(jx,s).addScaledVector(Nx,c).addScaledVector(Fx,l);let S=s*12+c*_+l*x,C=(1-Math.max(s,c,l))*S*.35;if(Ox.y+=C,bv.position.copy(Ox),Sy>0){let e=Sy*Sy*(s+(1-s)*.25),r=$.time*Math.max(12,Math.abs(n.v));bv.position.y+=Math.sin(r*1.7)*e*.22,bv.position.x+=Math.sin(r*.63+.4)*e*.08,Sy=Math.max(0,Sy-t*5.5)}bv.lookAt(kx),bv.rotateZ(e((n.signedLatAcc||0)*32e-5+(n.slipAngle||0)*.16,-.022,.022)*s),bv.fov=(f+fy*6)*s+(g+fy*2.5)*c+v*l,bv.near=Math.max(.5,S*.12*(1-s)),bv.far=1500+S*3,bv.updateProjectionMatrix(),Rx.x=kx.x,Rx.y=kx.y,Rx.z=kx.z,Rx.dist=Ox.distanceTo(kx),Rx.half=e(s*70+c*(m?125:135)+l*130,60,140),nx.classList.toggle(`off`,s<.6),Vx=s>=.6}var Vx=!0;function Hx(){let e=rS||$?.player;if(!e)return{mode:Xv};let t=bv.getWorldDirection(Ix);return{mode:Xv,pitchDeg:+(Math.asin(-t.y)*180/Math.PI).toFixed(2),height:+(bv.position.y-e.y).toFixed(2),distance:+bv.position.distanceTo(Lx.set(e.x,e.y,e.z)).toFixed(2),fov:+bv.fov.toFixed(2),behind:+((e.x-bv.position.x)*Math.sin(Tx.yaw)+(e.z-bv.position.z)*Math.cos(Tx.yaw)).toFixed(2),aspect:+bv.aspect.toFixed(3),carScreenPct:+((1-Lx.set(e.x,e.y,e.z).project(bv).y)*50).toFixed(1)}}var Ux={i:0},Wx={};function Gx(){if(!ly||!$)return;let e=$.player,t=jy()&&ey!==`menu`&&!e.pit.stage&&$.phase!==`done`&&!e.finished;ly.mesh.visible!==t&&ly.setEnabled(t),t&&ly.update(rS?rS.s:e.s,Math.abs(e.v),e.grip)}function Kx(e,t=e){for(let n of $.cars){let r=n.mesh;if(!r)continue;let i=Pg(n,tS,n._r||={},Q.length);r.group.position.set(i.x,i.y,i.z),r.group.rotation.y=i.theta,n.isPlayer&&rS&&(rS.x=i.x,rS.y=i.y,rS.z=i.z,rS.theta=i.theta,rS.s=i.s,rS.d=i.d);let a=r.st;a.v=n.v,a.steer=i.steer,a.longAcc=n.longAcc,a.latAcc=n.latAcc||0,a.surface=n.surface,a.lockup=n.lockup,a.flat=n.flat,a.brake=n.brk,a.rain=$.rain,a.roll=i.roll,a.pitch=i.pitch,a.s=i.s,a.lift=n.isPlayer?Uv.fx.lift:0,r.tire!==n.tire&&r.setTire(n.tire),em(r,a,t),cy.emitCar(n,r,i,e,n.cls.id),r.mark&&(r.mark.visible=Zv.chase<.5,r.mark.scale.setScalar(1)),r.group.scale.setScalar(1+3*Zv.full)}if(cy.update(e),Kv){let e=$.phase===`racing`&&$.lapTimer.g>=0?dd(qv,ad($.lapTimer,$.time-(1-tS)*jg),Wx):null;if(Kv.group.visible=!!e,e){let t=Q.locate(e.x,e.z,Ux.i,void 0,30);Ux.i=t.i;let n=ve(Q,t.s);Kv.group.position.set(e.x,n.y,e.z),Kv.group.rotation.y=e.theta,Kv.pivot.rotation.x=-n.pitch,Kv.pivot.rotation.z=n.roll}}}var qx=new kg,Jx=0,Yx=0;function Xx(t){Cv.level=e(Math.round(t),0,Sg(Sv)),Cv.gov.level=Cv.level,Uv.setQuality(Cv.level,bg[Sv].shadow),wv.force()}function Zx(e,t=!0){return Sv=xg(e)||Sv,Z.gfx=Sv,xv.setGfx(Sv),Ov(),Cv.gov.max=Sg(Sv),Xx(Sg(Sv)),Uv.applyMood?.(xv),Y(`optGfx`)&&ub(`optGfx`).forEach(e=>e.classList.toggle(`sel`,e.dataset.v===Sv)),t&&Py(),Sv}function Qx(e){if(e<=0)return;let t=1/e;if(Cv.fps+=(t-Cv.fps)*(1-Math.exp(-e/.5)),!Cv.auto||ey===`menu`||ey===`paused`||document.hidden)return;let n=Cv.gov.update(e,Cv.fps);n!==null&&Xx(n)}var $x=performance.now(),eS=0,tS=1,nS=performance.memory||null,rS=null,iS=()=>{if($){for(let e of $.cars)Mg(e);tS=1}};function aS(e){Ab(e),requestAnimationFrame(aS);let t=Math.max(0,(e-$x)/1e3),n=Math.min(.05,t);if($x=e,t>0&&t<5&&qx.add(t*1e3,nS?nS.usedJSHeapSize:-1),Dy-=n,$&&(ey===`racing`||ey===`paused`)&&wx(),$&&ey===`cinematic`){if($v||Fv?.advance(Math.min(t,8.5))&&nb(),Fv){let e=mv(Q,$.player,Fv.elapsed,Z.mode,Z);bv.position.fromArray(e.position),bv.lookAt(...e.target),bv.fov=e.fov,bv.near=.3,bv.far=2200,bv.updateProjectionMatrix(),Y(`introShot`).textContent=e.phase===`flyover`?`TRACK FLYOVER`:e.phase===`grid`?`ON THE GRID`:$.solo?`YOUR CHALLENGE`:`YOUR CAR  ·  START P${$.player.pos}`,Y(`introTitleCard`).hidden=!e.reveal}xx(n)}else if($&&ey===`racing`){if(Cx(),$v)eS=0,iS();else{let e=Fg(eS,Math.min(.1,t));eS=e.acc;for(let t=0;t<e.n;t++){for(let e of $.cars)Mg(e);let e=$.player;if(!$.autopilot&&!e.finished&&!e.pit.stage){let t=jv.poll(),n=e.input;n.steer=t.steer,n.throttle=t.throttle,n.brake=t.brake,n.boost=t.boost}$.step(jg)}tS=eS/jg}($.rain!==_y||$.wetness!==vy)&&(_y=$.rain,vy=$.wetness,Uv.setWeather({rain:_y,wetness:vy}));let e=$.goFlash>0;($.lights!==yy||e!==by)&&(yy=$.lights,by=e,Uv.setStartLights(yy,by));let r=$.player;xx(n),_x(),r.finished&&!ty&&(ty=!0,Oy=setTimeout(()=>{$.simulateToEnd(),px()},2200)),Dy<=0&&(dx(),Dy=.05),wy-=n,wy<0&&Y(`sect`).classList.remove(`on`),Ey-=n,Ey<0&&(Y(`split`).textContent=``),Ty-=n,Ty<0&&(Y(`msg`).textContent=$.phase===`countdown`?`GET READY`:``),xy-=t,Vx&&xy<=0&&(ox(),xy=1/30)}if(cb(ey===`paused`||$&&!$.solo&&!Fv&&$.phase===`countdown`?0:Math.min(t,2)),ey===`paused`&&Mv.engine(0,1,0,!1),ey!==`racing`&&(gy*=.8),ey===`menu`||ey===`career`||ey===`standings`){let t=e/1e3*.08,n=Q.at(t*300%Q.length);bv.position.set(n.x+40,n.y+30,n.z+40),bv.lookAt(n.x,n.y,n.z),bv.fov=58,bv.near=.5,bv.far=1500,bv.updateProjectionMatrix(),Object.assign(Rx,{x:n.x,y:n.y,z:n.z,half:70,dist:55}),Uv.setPit(null)}else if($&&ey!==`cinematic`){rS?.__src!==$.player&&(rS=Object.create($.player),rS.__src=$.player),Kx(ey===`racing`?n:0,ey===`racing`?Math.min(t,.1):0),Gx(),Bx(n);let e=$.player,r=!$.solo&&$.phase===`racing`&&!e.pit.stage&&(e.wear>=.68||e.tire===`dry`&&$.wetness>=.32||e.tire===`wet`&&$.wetness<.14);document.body.classList.toggle(`broadcast-has-pit`,r),Uv.setPit(e.pit.stage||e.pit.request?{stage:e.pit.stage,request:e.pit.request,serv:e.pit.serv,choice:e.pit.choice,teamIndex:e.teamIndex,colors:{c1:e.team.c1,c2:e.team.c2},car:e.mesh}:null)}ey===`editor`&&$b(),Uv.update(n,bv,Rx);{let e=Uv.fx,t=xv.fx;t.speed=gy,t.rain=e.rain,t.time=e.time,t.sat=e.sat,t.tint=e.tint}Qx(Math.min(.5,t)),(Cv.level>0||wv.due(t))&&(vv.shadowMap.needsUpdate=!0),vv.info.autoReset=!1,vv.info.reset(),xv.render(t),Jx=vv.info.render.calls,Yx=vv.info.render.triangles}requestAnimationFrame(aS),hb(),wb();var oS=new URLSearchParams(location.search);if(oS.get(`touch`)===`1`&&document.body.classList.add(`touch`),oS.get(`autostart`)===`1`){Hy({...oS.get(`mode`)?{mode:oS.get(`mode`)}:{},...oS.get(`diff`)?{difficulty:oS.get(`diff`)}:{},...oS.get(`cls`)?{cls:oS.get(`cls`)}:{},...oS.get(`laps`)?{laps:+oS.get(`laps`)}:{},...oS.get(`track`)?{track:oS.get(`track`)}:{},weather:oS.get(`weather`)||`dry`}),Wy(!0);let e=oS.get(`cam`);e&&Gy(e,!0)}oS.get(`camlog`)===`1`&&setInterval(()=>console.log(`camlog`,JSON.stringify(Hx())),1e3),oS.get(`q`)&&(Cv.auto=!1,Xx(+oS.get(`q`))),oS.get(`gfx`)&&(Cv.auto=!1,Zx(oS.get(`gfx`),!1)),window.__game={startLights:()=>$?{phase:$.phase,lights:$.lights,go:$.phase!==`countdown`&&$.goFlash>0}:null,showResults:()=>{$&&($.solo||$.simulateToEnd(),px())},broadcast:()=>({mode:Z.mode,time:Iv,volume:Z.voiceVolume,muted:Z.voiceMuted,masterMuted:Mv.muted,cutscenes:Z.cutscenes,introActive:!!Fv,introTime:Fv?.elapsed||0,introSkipped:!!Fv?.skipped,pending:{...Pv.pending},caption:document.querySelector(`#voiceCaption .voice-text`)?.textContent||``,channel:Rv,played:{...Pv.lastPlayed},degraded:Nv.degraded}),feel:()=>({fovKick:fy,fxSpeed:gy,shake:Sy}),camDebug:Hx,startRace:e=>Hy(e),skipIntro:rb,finishIntro:nb,setBroadcastOption:Zy,setRain:e=>{$?.setRain(e),$&&Uv.setWeather({rain:$.rain,wetness:$.wetness})},enterPit:()=>{$&&$.requestPit($.player,!0)},fps:()=>Cv.fps,setLineGuide:Ny,lineGuide:()=>({enabled:!!ly?.mesh.visible,allowed:jy(),hard:Z.difficulty===`hard`,saved:Z.lineGuide,...ly?.status||{}}),setVibration:Xy,setGfx:Zx,gfx:()=>Sv,vibration:()=>!!Z.vibration,carFx:cy,boards:()=>uy?.plan||[],perfStats:(e=!1)=>{let t={...qx.snapshot(),quality:Cv.level,gfx:Sv,dpr:Dv,canvas:vv.domElement.width+`x`+vv.domElement.height,drawCalls:Jx,triangles:Yx};return e&&qx.reset(),t},setAutopilot:Wy,toggleCamera:Ky,setCamera:Gy,setQuality:Xx,hold:(e=!0)=>{$v=!!e},pitService:(e=`dry`,t=1.2,n=!0)=>{let r=$.player,i=Q,a=i.boxU(r.teamIndex)-.6,o=(a%i.length+i.length)%i.length,s=i.at(a,i.boxD(Math.floor(o/i.ds)%i.n));return r.x=s.x,r.z=s.z,r.y=s.y,r.theta=i.thetaAt(a),r.s=o,r.idx=i.locateGlobal(s.x,s.z).i,r.v=0,r.steer=0,Object.assign(r.pit,{stage:2,request:!0,timer:0,serv:e?t:0,choice:e||null}),$v=n,dy.init=!1,dy.yaw=r.theta,Tx.yaw=r.theta,Tx.lastX=void 0,iS(),{s:o,x:s.x,z:s.z}},setMute:qy,setPaused:lb,finishSession:fx,showMenu:$y,choosePitTire:e=>$?.choosePitTire(e),fastForward:e=>{for(let t=0;t<e;t+=1/60)$.step(1/60);Cx(),iS()},finishNow:()=>{$.autopilot=!0},teleport:(e,t=0)=>{let n=$.player,r=Q.at(e,t);n.x=r.x,n.z=r.z,n.theta=Q.thetaAt(e),n.s=e,n.idx=Q.locateGlobal(r.x,r.z).i,dy.init=!1,dy.yaw=n.theta,iS()},save:Vv,opts:Z,DIFFICULTY:md,get race(){return $},get camMix(){return 1-Zv.chase},get camMode(){return Xv},get quality(){return Cv.level},get track(){return Q},get theme(){return Uv},get career(){return X},setTrack:e=>(By(e),Py(),Q.id),showCareer:()=>{X||=E_({difficulty:Z.difficulty,weather:Z.weather},Hv),k_(Bv,X),Pb()},showStandings:()=>Ib(),showUpgrades:()=>{jb=`career`,Lb()},showEditor:()=>Bb(`menu`),seedCareer:()=>{X=E_({driverName:`Casey Morrow`,number:17,team:{name:`Northline Racing`,livery:{pattern:`chevrons`,c1:15222570,c2:16765514,c3:1381658,number:17}},difficulty:Z.difficulty||`normal`});let e=[{id:`player`,isPlayer:!0,pos:2},...X.rivals.map(e=>e.id).map((e,t)=>({id:e,pos:t===0?1:t+2}))];return P_(X,e),X.upgradePoints=14,k_(Bv,X),Hv={driver:{...X.driver},team:X.team},u_(Bv,Hv),X},seedCareerScout:()=>{X=E_({driverName:`Casey Morrow`,number:17,team:{name:`Northline Racing`,livery:{pattern:`chevrons`,c1:15222570,c2:16765514,c3:1381658,number:17}},difficulty:`normal`});let e=X.rivals.map(e=>e.id),t=t=>{let n=[{id:`player`,isPlayer:!0,pos:t}],r=0;for(let i=1;i<=10;i++)i!==t&&n.push({id:e[r++],pos:i});P_(X,n)};return t(2),t(3),t(1),X.upgradePoints=20,k_(Bv,X),Hv={driver:{...X.driver},team:X.team},u_(Bv,Hv),X},seedCareerOffer:()=>{X=E_({driverName:`Casey Morrow`,number:17,team:{name:`Northline Racing`,livery:{pattern:`chevrons`,c1:15222570,c2:16765514,c3:1381658,number:17}},difficulty:`normal`});let e=X.rivals.map(e=>e.id),t=t=>{let n=[{id:`player`,isPlayer:!0,pos:t}],r=0;for(let i=1;i<=10;i++)i!==t&&n.push({id:e[r++],pos:i});P_(X,n)};for(let e=0;e<6;e++)t(2);return k_(Bv,X),Hv={driver:{...X.driver},team:X.team},u_(Bv,Hv),X},showRecruit:()=>Wb(),state:()=>({state:ey,phase:$?.phase,pos:$?.player.pos,lap:$?.player.laps,rain:$?.rain,wet:$?.wetness,tire:$?.player.tire,wear:$?.player.wear,pit:$?.player.pit.stage,autopilot:$?.autopilot,camMix:1-Zv.chase,cam:Xv,quality:Cv.level})};