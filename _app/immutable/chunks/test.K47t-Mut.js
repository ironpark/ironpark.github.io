import{s as M,n as v}from"./scheduler.k-kUyWhY.js";import{S as P,i as T,g as c,s as g,H as B,h as r,z as h,c as _,j as S,B as z,f as a,k as w,a as e}from"./index.F7XBB1Gp.js";function E(b){let n,x='<a href="#my-first-markdown-blog">My First Markdown Blog</a>',u,l,y="Hello! 👋",m,p,C="아래처럼 코드 Syntax Highlight도 지원합니다.",k,o,f,j=`<code class="language-js"><span class="token keyword">function</span> <span class="token function">greet</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">name</span><span class="token operator">:</span> string</span><span class="token punctuation">)</span> <span class="token punctuation">&#123;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">&#96;</span><span class="token string">Hey </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">$&#123;</span>name<span class="token interpolation-punctuation punctuation">&#125;</span></span><span class="token string">!</span><span class="token template-punctuation string">&#96;</span></span><span class="token punctuation">)</span>
<span class="token punctuation">&#125;</span></code>`,d,i,H=`위와 같이 소스코드도 넣을 수 있습니다.
(역슬래쉬는 빼고 넣으셔야 합니다.)`;return{c(){n=c("h2"),n.innerHTML=x,u=g(),l=c("p"),l.textContent=y,m=g(),p=c("p"),p.textContent=C,k=g(),o=c("pre"),f=new B(!1),d=g(),i=c("p"),i.textContent=H,this.h()},l(t){n=r(t,"H2",{id:!0,"data-svelte-h":!0}),h(n)!=="svelte-tz69vr"&&(n.innerHTML=x),u=_(t),l=r(t,"P",{"data-svelte-h":!0}),h(l)!=="svelte-1j1t9x9"&&(l.textContent=y),m=_(t),p=r(t,"P",{"data-svelte-h":!0}),h(p)!=="svelte-1olipbw"&&(p.textContent=C),k=_(t),o=r(t,"PRE",{class:!0});var s=S(o);f=z(s,!1),s.forEach(a),d=_(t),i=r(t,"P",{"data-svelte-h":!0}),h(i)!=="svelte-gsdsnp"&&(i.textContent=H),this.h()},h(){w(n,"id","my-first-markdown-blog"),f.a=null,w(o,"class","language-js")},m(t,s){e(t,n,s),e(t,u,s),e(t,l,s),e(t,m,s),e(t,p,s),e(t,k,s),e(t,o,s),f.m(j,o),e(t,d,s),e(t,i,s)},p:v,i:v,o:v,d(t){t&&(a(n),a(u),a(l),a(m),a(p),a(k),a(o),a(d),a(i))}}}const q={title:"First post of my Blog",description:"this is my first post",date:"2023-7-29",categories:["sveltekit","svelte","first"],published:!0};class R extends P{constructor(n){super(),T(this,n,null,E,M,{})}}export{R as default,q as metadata};