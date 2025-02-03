System.register(["jimu-core","jimu-ui","jimu-theme","jimu-core/react"],(function(e,t){var n={},o={},r={},i={};return{setters:[function(e){n.BaseVersionManager=e.BaseVersionManager,n.BrowserSizeMode=e.BrowserSizeMode,n.Immutable=e.Immutable,n.LinkType=e.LinkType,n.PageType=e.PageType,n.React=e.React,n.ReactRedux=e.ReactRedux,n.css=e.css,n.hooks=e.hooks,n.jsx=e.jsx,n.polished=e.polished},function(e){o.Button=e.Button,o.Drawer=e.Drawer,o.Icon=e.Icon,o.Navigation=e.Navigation,o.PanelHeader=e.PanelHeader,o.defaultMessages=e.defaultMessages,o.utils=e.utils},function(e){r.getBoxStyles=e.getBoxStyles},function(e){i.default=e.default}],execute:function(){e((()=>{var e={37222:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path fill="#000" fill-rule="nonzero" d="M1 0h3a1 1 0 0 1 1 1v1h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1m0 1v10h10V3H4V1zm0 3.5h10v1H1z"></path></svg>'},49846:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path fill-rule="nonzero" d="M7.42 8.839a.5.5 0 0 1 0 .71L6 10.966a3.5 3.5 0 0 1-4.967 0 3.5 3.5 0 0 1 0-4.966l1.416-1.422a.504.504 0 0 1 .713.712L1.746 6.713a2.497 2.497 0 0 0-.003 3.545c.983.983 2.56.98 3.544-.003l1.42-1.42a.504.504 0 0 1 .712.004m1.415-2.132 1.422-1.416a2.5 2.5 0 0 0 0-3.547 2.5 2.5 0 0 0-3.547 0L5.29 3.163a.504.504 0 0 1-.713-.712l1.42-1.42a3.506 3.506 0 0 1 4.97.003 3.5 3.5 0 0 1 0 4.967L9.547 7.42a.504.504 0 0 1-.713-.712m-4.967.71 3.548-3.548a.504.504 0 0 1 .713.713L4.58 8.129a.504.504 0 0 1-.713-.712"></path></svg>'},73635:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 12"><path fill="#000" fill-rule="nonzero" d="M1 0h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1m0 1v10h8V1zm2 2h4a.5.5 0 0 1 0 1H3a.5.5 0 0 1 0-1m0 2.5h4a.5.5 0 0 1 0 1H3a.5.5 0 0 1 0-1"></path></svg>'},79244:e=>{"use strict";e.exports=n},68972:e=>{"use strict";e.exports=i},1888:e=>{"use strict";e.exports=r},14321:e=>{"use strict";e.exports=o}},t={};function a(n){var o=t[n];if(void 0!==o)return o.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,a),r.exports}a.d=(e,t)=>{for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.p="";var l={};return a.p=window.jimuConfig.baseUrl,(()=>{"use strict";a.r(l),a.d(l,{__set_webpack_public_path__:()=>A,default:()=>N});var e,t=a(79244),n=a(14321);!function(e){e.Icon="ICON",e.Vertical="VERTICAL",e.Horizontal="HORIZONTAL"}(e||(e={}));const o={type:"HORIZONTAL",subOpenMode:"FOLDABLE",main:{alignment:"center",space:{distance:0,unit:"px"},showText:!0,showIcon:!1,iconPosition:"start"},navType:"default",advanced:!1},r=n=>{var o,r,i,a,l,s,d;if(!n)return;const u=n,c=(0,t.Immutable)({}),v=u.type===e.Icon?"drawer":"nav",p=u.navType,m=u.type!==e.Horizontal,g=null==u?void 0:u.icon,h=null==u?void 0:u.drawerDirection,b=(f=u.type,y=u.subOpenMode,f===e.Horizontal?"dropdown":"EXPAND"===y?"static":"foldable");var f,y;const w=null===(o=null==u?void 0:u.main)||void 0===o?void 0:o.alignment,x=null===(r=null==u?void 0:u.main)||void 0===r?void 0:r.showText,$=null===(i=null==u?void 0:u.main)||void 0===i?void 0:i.showIcon,j=null===(a=null==u?void 0:u.main)||void 0===a?void 0:a.iconPosition,O=null!==(s=null===(l=null==u?void 0:u.main)||void 0===l?void 0:l.space)&&void 0!==s?s:{distance:0,unit:"px"},T={icon:g,anchor:h,submenuMode:b,textAlign:w,showIcon:$,showText:x,iconPosition:j,gap:`${null==O?void 0:O.distance}${null==O?void 0:O.unit}`},S=u.advanced,z=u.paper,M=((e,t)=>{if(!e)return;const n=null==e?void 0:e[t];if(!n)return;let o=n;return n.bg&&(o=o.setIn(["root","bg"],n.bg),o=o.without("bg")),o})(null===(d=null==u?void 0:u.main)||void 0===d?void 0:d.variants,u.navType);return c.set("type",v).set("menuStyle",p).set("vertical",m).set("standard",T).set("advanced",S).set("paper",z).set("variant",M)};class i extends t.BaseVersionManager{constructor(){super(...arguments),this.versions=[{version:"1.0.0",description:"The first release.",upgrader:e=>{var t;if(!e)return o;let n=e;return(null===(t=null==e?void 0:e.main)||void 0===t?void 0:t.variants)&&(n=n.set("advanced",!0)),n}},{version:"1.1.0",description:"Version manager for release 1.1",upgrader:e=>r(e||o)},{version:"1.13.0",description:"Change borderRadius from 50rem to 6.25rem in pills style",upgrader:e=>{var t;if("pills"!==(null==e?void 0:e.menuStyle)||!(null==e?void 0:e.advanced))return e;let n=e;return Object.keys((null===(t=null==n?void 0:n.variant)||void 0===t?void 0:t.item)||{}).forEach((e=>{var t;"50rem"===(null===(t=n.variant.item[e])||void 0===t?void 0:t.borderRadius)&&(n=n.setIn(["variant","item",e,"borderRadius"],"6.25rem"))})),n}}]}}const s=new i;var d=a(1888);const{useState:u,useEffect:c,useMemo:v}=t.React,{useSelector:p}=t.ReactRedux,m=a(73635),g=a(49846),h=a(37222),b={[t.PageType.Normal]:m,[t.PageType.Link]:g,[t.PageType.Folder]:h},f=(e,t)=>(e=((e,t)=>(e=e.filter((e=>{const n=Object.keys(e)[0];return(null==t?void 0:t[n]).isVisible}))).map((e=>{const n=Object.entries(e)[0],o=n[0];let r=n[1];return r=r.filter((e=>(null==t?void 0:t[e]).isVisible)),e.set(o,r)})))(e,t),e.map((e=>{const n=Object.entries(e)[0],o=n[0],r=n[1],i=t[o],a=y(i),l=r.map((e=>{const n=t[e];return y(n)}));return a.set("subs",l)}))),y=e=>{const o=w(e),r=x(e),i=e.icon||b[e.type];return(0,t.Immutable)({linkType:o,value:r,icon:"[object Object]"===Object.prototype.toString.call(i)?i:n.utils.toIconResult(i,e.type,16),target:e.openTarget,name:e.label})},w=e=>e.type===t.PageType.Link?t.LinkType.WebAddress:e.type===t.PageType.Normal?t.LinkType.Page:e.type===t.PageType.Folder?t.LinkType.None:void 0,x=e=>e.type===t.PageType.Link?e.linkUrl:e.type===t.PageType.Normal?e.id:e.type===t.PageType.Folder?"#":void 0,$=e=>{var n,o,r,i;const{borderTop:a,borderBottom:l,borderLeft:s,borderRight:d}=e;return t.css`
    ${a&&`\n      border-top-width: ${a.width};\n      ${a.width&&`border-top-style: ${null!==(n=null==a?void 0:a.type)&&void 0!==n?n:"solid"};`}\n      border-top-color: ${a.color};\n    `}
    ${l&&`\n      border-bottom-width: ${l.width};\n      ${l.width&&`border-bottom-style: ${null!==(o=null==l?void 0:l.type)&&void 0!==o?o:"solid"};`}\n      border-bottom-color: ${l.color};\n    `}
    ${s&&`\n      border-left-width: ${s.width};\n      ${s.width&&`border-left-style: ${null!==(r=null==s?void 0:s.type)&&void 0!==r?r:"solid"};`}\n      border-left-color: ${s.color};\n    `}
    ${d&&`\n      border-right-width: ${d.width};\n      ${d.width&&`border-right-style: ${null!==(i=null==d?void 0:d.type)&&void 0!==i?i:"solid"};`}\n      border-right-color: ${d.color};\n    `}
  `},j=e=>{var n,o;return t.css`
    font-size: ${(null==e?void 0:e.size)?`${t.polished.rem(e.size)}!important`:""};
    ${e.icon&&`.jimu-nav-link-wrapper > .jimu-icon, .jimu-icon-img {\n      ${(null===(n=null==e?void 0:e.icon)||void 0===n?void 0:n.size)&&`\n        width: ${t.polished.rem(e.icon.size)};\n        height: ${t.polished.rem(e.icon.size)};\n      `};\n      ${(null===(o=null==e?void 0:e.icon)||void 0===o?void 0:o.color)&&`color: ${e.icon.color}`};\n    }`}
 `},O=(e,n,o,r)=>v((()=>{var i,a;return e?t.css`
      &.menu-navigation {
        .jimu-nav,
        &.jimu-nav {
          ${(null===(i=null==o?void 0:o.root)||void 0===i?void 0:i.bg)&&`background-color: ${o.root.bg};`}
          border-radius: ${(null===(a=null==o?void 0:o.root)||void 0===a?void 0:a.borderRadius)||"0px"};
          ${(e=>{if(!(null==e?void 0:e.item))return null;const{default:n,hover:o,active:r}=e.item,i=(null==n?void 0:n.merge(o||{},{deep:!0}))||o,a=(null==n?void 0:n.merge(r||{},{deep:!0}))||r;return t.css`
    .nav-item>.nav-link {
      ${n&&t.css`
        &:not(:hover):not(.active) {
          ${(0,d.getBoxStyles)(n)}
          ${$(n)}
          ${j(n)}
        }
      `}
      ${i&&t.css`
        &:hover:not(.active) {
          ${(0,d.getBoxStyles)(i)}
          ${$(i)}
          ${j(i)}
        }
      `}
      ${a&&t.css`
        &:not(:disabled):not(.disabled).active {
          ${(0,d.getBoxStyles)(a)}
          ${$(a)}
          ${j(a)}
        }
      `}
    }
  `})(o)}
          ${((e,n)=>{const o=n?"left":"bottom",r=["top","bottom","left","right"].map((e=>o===e?"":`border-${e}-width: 0 !important;`)).join("");return"underline"===e&&t.css`
    &.nav-underline {
      ${r}
      .nav-link {
        ${r}
      }
      ${n&&"\n        .nav-item {\n          margin-left: -1px;\n        }\n      "}
  `})(n,r)}
        }
      }
    `:null}),[e,n,o,r]),T={_widgetLabel:"Menu"};var S=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};const z=e=>{var o,r;const[i,a]=t.React.useState(!1),{icon:l,anchor:s,advanced:d,type:u,variant:c,paper:p,vertical:m}=e,g=S(e,["icon","anchor","advanced","type","variant","paper","vertical"]),h=()=>{a((e=>!e))},b=((e,n,o)=>{var r,i;const a=null==o?void 0:o.bg,l=null===(i=null===(r=null==n?void 0:n.item)||void 0===r?void 0:r.default)||void 0===i?void 0:i.color;return v((()=>e?t.css`
      .jimu-drawer-paper {
        background: ${a};
        .header {
          color: ${l};
          padding: ${t.polished.rem(8)};
        }
      }
    `:t.css`
      .jimu-drawer-paper {
        .header {
          padding: ${t.polished.rem(8)};
        }
      }
    `),[e,a,l])})(d,c,p),f=O(d,u,c,!0),y=t.hooks.useCheckSmallBrowserSizeMode(),w=(e=>v((()=>{const n=t.css`
      .jimu-nav-link-wrapper {
        text-overflow: ellipsis !important;
        overflow: hidden !important;
        white-space: nowrap;
      }
      .nav-link {
        text-decoration: none;
        &:hover {
          text-decoration: none;
        }
      }
    `;return e?n:t.css`
        &{
          min-width: ${t.polished.rem(240)};
          max-width: ${t.polished.rem(320)};
        }
        ${n}
      `}),[e]))(y),x=t.ReactRedux.useSelector((e=>e.appRuntimeInfo.currentPageId));t.React.useEffect((()=>{a(!1)}),[x]);const $=t.hooks.useTranslation(T);return(0,t.jsx)(t.React.Fragment,null,(0,t.jsx)("div",{className:"button-container w-100 h-100 d-flex align-items-center justify-content-center"},(0,t.jsx)(n.Button,{className:"jimu-outline-inside",icon:!0,type:"tertiary",onClick:h,"aria-label":$("_widgetLabel"),"aria-haspopup":"menu"},(0,t.jsx)(n.Icon,{className:"caret-icon",icon:null==l?void 0:l.svg,color:null===(o=null==l?void 0:l.properties)||void 0===o?void 0:o.color,size:null===(r=null==l?void 0:l.properties)||void 0===r?void 0:r.size}))),(0,t.jsx)(n.Drawer,{anchor:s,open:i,toggle:h,autoFlip:!1,css:b,"aria-label":$("_widgetLabel")},(0,t.jsx)(n.PanelHeader,{className:"header",title:"",onClose:h}),(0,t.jsx)(n.Navigation,Object.assign({role:"menu",className:y?"w-100":"menu-navigation",vertical:m,css:[w,f],type:u,showTitle:!0,isUseNativeTitle:!0,right:!0},g))))};var M=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};const{useMemo:I}=t.React,P=e=>{const{type:o,menuStyle:r,vertical:i,standard:a,advanced:l,paper:s,variant:d}=e,v=(()=>{const[e,t]=u([]),n=p((e=>{var t;return null===(t=null==e?void 0:e.appConfig)||void 0===t?void 0:t.pages})),o=p((e=>{var t;return null===(t=null==e?void 0:e.appConfig)||void 0===t?void 0:t.pageStructure}));return c((()=>{const e=f(o,n);t(e)}),[n,o]),e})(),m=(()=>{const e=p((e=>{var t;return null===(t=null==e?void 0:e.appRuntimeInfo)||void 0===t?void 0:t.currentPageId}));return t.React.useCallback((t=>(e=>{if(!(null==e?void 0:e.value))return"";const t=e.value.split(",");return(null==t?void 0:t.length)?t[0]:""})(t)===e),[e])})(),g=a.asMutable({deep:!0}),{icon:h,anchor:b}=g,y=M(g,["icon","anchor"]),w=(e=>p((n=>(null==n?void 0:n.browserSizeMode)===t.BrowserSizeMode.Small?"full":e)))(b),x=(e=>I((()=>t.css`
      width: 100%;
      height: 100%;
      max-width: 100vw;
      max-height: 100vh;
      .nav-item {
        ${!e&&'\n          .nav-link:hover {\n            position: relative;\n            &::before {\n              content: "";\n              position: absolute;\n              left: 0;\n              right: 0;\n              top: -1000px;\n              bottom: 100%;\n            }\n            &::after {\n              content: "";\n              position: absolute;\n              left: 0;\n              right: 0;\n              top: 100%;\n              bottom: -1000px;\n            }\n          }\n        '}
      }
    `),[e]))(i),$=O(l,r,d,i);return(0,t.jsx)("div",{className:"menu-navigation",css:[x,$]},"nav"===o&&(0,t.jsx)(n.Navigation,Object.assign({role:"menu",data:v,vertical:i,isActive:m,showTitle:!0,isUseNativeTitle:!0,scrollable:!0,right:!0},y,{type:r})),"drawer"===o&&(0,t.jsx)(z,Object.assign({data:v,advanced:l,variant:d,paper:s,type:r,vertical:i,isActive:m,scrollable:!1,icon:h,anchor:w},y)))};var k=a(68972);function R(e){return{svg:'<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="css-1i7frhi jimu-icon"><path d="M2 1a1 1 0 100 2h12a1 1 0 100-2H2zm0-1h12a2 2 0 010 4H2a2 2 0 010-4zm0 7a1 1 0 100 2h12a1 1 0 100-2H2zm0-1h12a2 2 0 010 4H2a2 2 0 010-4zm0 7a1 1 0 100 2h12a1 1 0 100-2H2zm0-1h12a2 2 0 010 4H2a2 2 0 010-4z" fill="currentColor" fill-rule="nonzero"></path></svg>',properties:{color:"var(--dark-800)",size:20,inlineSvg:!0,filename:e("menu")}}}function H(e){switch(e){case"anchor":return"left";case"textAlign":return"center";case"showIcon":return!1;case"gap":return"0px";case"submenuMode":return"foldable"}}const L=(n,o,r)=>k.default.useMemo((()=>function(n=e.Horizontal,o){switch(n){case e.Horizontal:return(0,t.Immutable)({type:"nav",menuStyle:"default",vertical:!1,advanced:!1,standard:{gap:H("gap"),textAlign:H("textAlign")}});case e.Vertical:return(0,t.Immutable)({type:"nav",menuStyle:"default",vertical:!0,advanced:!1,standard:{submenuMode:H("submenuMode"),gap:H("gap"),textAlign:H("textAlign")}});case e.Icon:return(0,t.Immutable)({type:"drawer",menuStyle:"default",vertical:!0,advanced:!1,standard:{anchor:H("anchor"),submenuMode:H("submenuMode"),icon:R(o),gap:H("gap"),textAlign:H("textAlign")}})}}(o,r).merge(n,{deep:!0})),[n,o,r]),B=o=>{const{config:r}=o,i=t.hooks.useTranslation(n.defaultMessages),a=(t=>k.default.useMemo((()=>"drawer"===t.type?e.Icon:t.vertical?e.Vertical:e.Horizontal),[t.type,t.vertical]))(r),l=L(r,a,i);return t.React.createElement("div",{className:"widget-menu jimu-widget"},t.React.createElement(P,Object.assign({},l.asMutable())))};B.versionManager=s;const N=B;function A(e){a.p=e}})(),l})())}}}));