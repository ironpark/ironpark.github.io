import{_ as V}from"../chunks/preload-helper.0HuHagjb.js";import{s as B,f as F}from"../chunks/scheduler.V7bLW0bx.js";import{S as G,i as J,q as L,g as y,s as j,m as q,r as O,y as K,h as P,z as N,f as m,c as M,j as S,n as C,u as Q,k as d,x as u,a as R,v as x,o as z,t as A,b as W,d as D,w as U,p as X}from"../chunks/index.g4XJRx-4.js";const Y=(s,t)=>{const n=s[t];return n?typeof n=="function"?n():Promise.resolve(n):new Promise((c,o)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(o.bind(null,new Error("Unknown variable dynamic import: "+t)))})};async function Z({params:s}){const t=await Y(Object.assign({"../test.md":()=>V(()=>import("../chunks/test.Jnk9Vr6f.js"),__vite__mapDeps([0,1,2]),import.meta.url)}),`../${s.slug}.md`),{title:n,date:c}=t.metadata;return{content:t.default,title:n,date:c}}const st=Object.freeze(Object.defineProperty({__proto__:null,load:Z},Symbol.toStringTag,{value:"Module"}));function tt(s){let t,n="",c,o,r,h,v=s[0].title+"",b,k,_,w,g=s[0].date+"",$,E,e,f;var p=s[0].content;function H(a,i){return{}}return p&&(e=L(p,H())),{c(){t=y("script"),t.innerHTML=n,o=j(),r=y("article"),h=y("h1"),b=q(v),k=j(),_=y("p"),w=q("Published: "),$=q(g),E=j(),e&&O(e.$$.fragment),this.h()},l(a){const i=K("svelte-1gjher0",document.head);t=P(i,"SCRIPT",{src:!0,repo:!0,"issue-term":!0,label:!0,theme:!0,crossorigin:!0,"data-svelte-h":!0}),N(t)!=="svelte-rt9m3p"&&(t.innerHTML=n),i.forEach(m),o=M(a),r=P(a,"ARTICLE",{});var l=S(r);h=P(l,"H1",{});var I=S(h);b=C(I,v),I.forEach(m),k=M(l),_=P(l,"P",{});var T=S(_);w=C(T,"Published: "),$=C(T,g),T.forEach(m),E=M(l),e&&Q(e.$$.fragment,l),l.forEach(m),this.h()},h(){F(t.src,c="https://utteranc.es/client.js")||d(t,"src",c),d(t,"repo","ironpark/ironpark.github.io"),d(t,"issue-term","pathname"),d(t,"label","blog/comments"),d(t,"theme","github-dark"),d(t,"crossorigin","anonymous"),t.async=!0},m(a,i){u(document.head,t),R(a,o,i),R(a,r,i),u(r,h),u(h,b),u(r,k),u(r,_),u(_,w),u(_,$),u(r,E),e&&x(e,r,null),f=!0},p(a,[i]){if((!f||i&1)&&v!==(v=a[0].title+"")&&z(b,v),(!f||i&1)&&g!==(g=a[0].date+"")&&z($,g),i&1&&p!==(p=a[0].content)){if(e){X();const l=e;A(l.$$.fragment,1,0,()=>{U(l,1)}),W()}p?(e=L(p,H()),O(e.$$.fragment),D(e.$$.fragment,1),x(e,r,null)):e=null}},i(a){f||(e&&D(e.$$.fragment,a),f=!0)},o(a){e&&A(e.$$.fragment,a),f=!1},d(a){a&&(m(o),m(r)),m(t),e&&U(e)}}}function et(s,t,n){let{data:c}=t;return s.$$set=o=>{"data"in o&&n(0,c=o.data)},[c]}class ot extends G{constructor(t){super(),J(this,t,et,tt,B,{data:0})}}export{ot as component,st as universal};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["../chunks/test.Jnk9Vr6f.js","../chunks/scheduler.V7bLW0bx.js","../chunks/index.g4XJRx-4.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}