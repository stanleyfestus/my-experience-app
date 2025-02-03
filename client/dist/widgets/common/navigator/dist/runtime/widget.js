System.register(["jimu-core","jimu-ui","jimu-layouts/layout-runtime","jimu-theme"],(function(e,o){var t={},n={},i={},l={};return{setters:[function(e){t.AppMode=e.AppMode,t.BaseVersionManager=e.BaseVersionManager,t.BrowserSizeMode=e.BrowserSizeMode,t.ButtonClickMessage=e.ButtonClickMessage,t.Immutable=e.Immutable,t.LayoutItemType=e.LayoutItemType,t.LinkType=e.LinkType,t.MessageManager=e.MessageManager,t.React=e.React,t.ReactRedux=e.ReactRedux,t.ViewChangeMessage=e.ViewChangeMessage,t.appActions=e.appActions,t.classNames=e.classNames,t.css=e.css,t.getAppStore=e.getAppStore,t.getIndexFromProgress=e.getIndexFromProgress,t.hooks=e.hooks,t.jimuHistory=e.jimuHistory,t.jsx=e.jsx,t.lodash=e.lodash,t.polished=e.polished},function(e){n.NavButtonGroup=e.NavButtonGroup,n.Navigation=e.Navigation,n.PageNumber=e.PageNumber,n.Slider=e.Slider,n.WidgetPlaceholder=e.WidgetPlaceholder,n.utils=e.utils},function(e){i.searchUtils=e.searchUtils},function(e){l.getBoxStyles=e.getBoxStyles}],execute:function(){e((()=>{var e={82606:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#000" fill-rule="evenodd" d="M1.25 2.5h17.5v11.25H1.25zM0 2.5c0-.69.56-1.25 1.25-1.25h17.5c.69 0 1.25.56 1.25 1.25v11.25c0 .69-.56 1.25-1.25 1.25H1.25C.56 15 0 14.44 0 13.75zm3.75 16.25h2.5V17.5h-2.5zm7.5 0h-2.5V17.5h2.5zm2.5 0h2.5V17.5h-2.5z" clip-rule="evenodd"></path></svg>'},37568:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M11.347 2.146a.485.485 0 0 1 0 .708L5.76 8l5.587 5.146a.486.486 0 0 1 0 .708.54.54 0 0 1-.738 0l-5.956-5.5a.485.485 0 0 1 0-.708l5.956-5.5a.54.54 0 0 1 .738 0" clip-rule="evenodd"></path></svg>'},52943:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M4.653 13.854a.485.485 0 0 1 0-.708L10.24 8 4.653 2.854a.485.485 0 0 1 0-.708.54.54 0 0 1 .738 0l5.956 5.5a.485.485 0 0 1 0 .708l-5.956 5.5a.54.54 0 0 1-.738 0" clip-rule="evenodd"></path></svg>'},12907:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6"><circle cx="1104" cy="1049" r="3" fill="#000" fill-rule="nonzero" transform="translate(-1101 -1046)"></circle></svg>'},89768:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="nonzero" d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm0-1h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m6 12.9a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6M3.16 7l1.7 1.686a.474.474 0 0 1 0 .674.483.483 0 0 1-.68 0L2.14 7.337a.474.474 0 0 1 0-.674L4.18 4.64a.483.483 0 0 1 .68 0 .474.474 0 0 1 0 .674zm9.68 0-1.7-1.686a.474.474 0 0 1 0-.674.483.483 0 0 1 .68 0l2.04 2.023a.474.474 0 0 1 0 .674L11.82 9.36a.483.483 0 0 1-.68 0 .474.474 0 0 1 0-.674zM5.4 12.9a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6m5.2 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6"></path></svg>'},79244:e=>{"use strict";e.exports=t},41496:e=>{"use strict";e.exports=i},1888:e=>{"use strict";e.exports=l},14321:e=>{"use strict";e.exports=n}},o={};function r(t){var n=o[t];if(void 0!==n)return n.exports;var i=o[t]={exports:{}};return e[t](i,i.exports,r),i.exports}r.n=e=>{var o=e&&e.__esModule?()=>e.default:()=>e;return r.d(o,{a:o}),o},r.d=(e,o)=>{for(var t in o)r.o(o,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:o[t]})},r.o=(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.p="";var a={};return r.p=window.jimuConfig.baseUrl,(()=>{"use strict";r.r(a),r.d(a,{__set_webpack_public_path__:()=>U,default:()=>E});var e=r(79244),o=r(14321);const t={_widgetLabel:"Views Navigation",widgetPlaceholder:"Please add a Section to use this widget.",tabDefault:"Tab default",tabUnderline:"Tab underline",tabPills:"Tab pills",arrow1:"Arrow 1",arrow2:"Arrow 2",arrow3:"Arrow 3"},n=r(89768),i=i=>{const{widgetId:l,show:r}=i,a=e.hooks.useTranslation(t);return r?e.React.createElement(o.WidgetPlaceholder,{icon:n,widgetId:l,message:a("widgetPlaceholder")}):null};var l;!function(e){e.Auto="AUTO",e.Custom="CUSTOM"}(l||(l={}));var d=r(41496),s=r(82606),u=r.n(s);const v=e=>{var o,t;return"nav"===(null==e?void 0:e.type)&&!(null===(o=null==e?void 0:e.standard)||void 0===o?void 0:o.alternateIcon)&&!(null===(t=null==e?void 0:e.standard)||void 0===t?void 0:t.activedIcon)},c=e=>{var o,t;return!("nav"!==(null==e?void 0:e.type)||!(null===(o=null==e?void 0:e.standard)||void 0===o?void 0:o.alternateIcon)||!(null===(t=null==e?void 0:e.standard)||void 0===t?void 0:t.activedIcon))};var p=r(1888);const{useEffect:g,useMemo:m,useCallback:b}=e.React,{useSelector:h,useDispatch:f}=e.ReactRedux,w=(r(12907),r(37568),r(52943),(e,o)=>(100*e+100*o)/100),y=e=>{if(!(null==e?void 0:e.value))return"";const o=e.value.split(",");return(null==o?void 0:o.length)?o[1]:""},x=(o,t)=>{const n=(o=>{const t=e.ReactRedux.useSelector((e=>{var o;return null===(o=null==e?void 0:e.appConfig)||void 0===o?void 0:o.layouts})),n=e.ReactRedux.useSelector((e=>{var o;return null===(o=null==e?void 0:e.appConfig)||void 0===o?void 0:o.sections})),i=e.ReactRedux.useSelector((e=>null==e?void 0:e.browserSizeMode)),l=e.ReactRedux.useSelector((e=>null==e?void 0:e.appConfig.mainSizeMode));return e.React.useMemo((()=>{const t=(0,e.getAppStore)().getState().appConfig,n=d.searchUtils.getContentsInTheSameContainer(t,o,e.LayoutItemType.Widget,e.LayoutItemType.Section,i);return n&&n.length>0?n:d.searchUtils.getContentsInTheSameContainer(t,o,e.LayoutItemType.Widget,e.LayoutItemType.Section,l)||[]}),[o,i,n,t])})(o),i=e.hooks.useLatest(t),{current:l}=e.React.useRef((0,e.getAppStore)().getState().appContext.isInBuilder);g((()=>{var e;l&&(null===(e=i.current)||void 0===e||e.call(i,n))}),[n,l,i])},$=o=>{const t=f();return b(((n,i)=>{var l,r,a,d,s,u,v,c,p,g,m,b,h;const f=null===(l=(0,e.getAppStore)())||void 0===l?void 0:l.getState(),y=null===(a=null===(r=f.appConfig.sections)||void 0===r?void 0:r[o])||void 0===a?void 0:a.views,x=null===(s=null===(d=null==f?void 0:f.appRuntimeInfo)||void 0===d?void 0:d.sectionNavInfos)||void 0===s?void 0:s[o],$=(null==x?void 0:x.currentViewId)||y[0],S=(null==x?void 0:x.visibleViews)||y,M=null!==(u=null==x?void 0:x.progress)&&void 0!==u?u:0;let k=null;if((null===(p=null===(c=null===(v=f.appConfig)||void 0===v?void 0:v.sections)||void 0===c?void 0:c[o])||void 0===p?void 0:p.transition)&&"None"!==(null===(h=null===(b=null===(m=null===(g=f.appConfig)||void 0===g?void 0:g.sections)||void 0===m?void 0:m[o])||void 0===b?void 0:b.transition)||void 0===h?void 0:h.type)||(i=Math.ceil(i)),1===i)k=((o,t,n,i=(0,e.Immutable)([]))=>{let l=i.indexOf(t);l=-1===l?0:l;const r=i[o?Math.max(0,l-1):Math.min(i.length-1,l+1)];return(0,e.Immutable)({visibleViews:n}).set("previousViewId",t).set("currentViewId",r).set("useProgress",!1).set("progress",i.indexOf(r)/(i.length-1))})(n,$,y,S);else{const e=n?Math.max(w(M,-i/(y.length-1)),0):Math.min(w(M,i/(y.length-1)),1);k=I(e,y,S)}return t(e.appActions.sectionNavInfoChanged(o,k)),e.jimuHistory.changeViewBySectionNavInfo(o,k),k}),[t,o])},I=(o,t,n=(0,e.Immutable)([]))=>{const i=(0,e.getIndexFromProgress)(o,n.length);return(0,e.Immutable)({visibleViews:t}).set("previousViewId",n[i.previousIndex]).set("currentViewId",n[i.currentIndex]).set("useProgress",!0).set("progress",o)},S=o=>{var t,n,i,l;const{borderTop:r,borderBottom:a,borderLeft:d,borderRight:s}=o;return e.css`
    ${r&&`\n      border-top-width: ${r.width};\n      ${r.width&&`border-top-style: ${null!==(t=null==r?void 0:r.type)&&void 0!==t?t:"solid"};`}\n      border-top-color: ${r.color};\n    `}
    ${a&&`\n      border-bottom-width: ${a.width};\n      ${a.width&&`border-bottom-style: ${null!==(n=null==a?void 0:a.type)&&void 0!==n?n:"solid"};`}\n      border-bottom-color: ${a.color};\n    `}
    ${d&&`\n      border-left-width: ${d.width};\n      ${d.width&&`border-left-style: ${null!==(i=null==d?void 0:d.type)&&void 0!==i?i:"solid"};`}\n      border-left-color: ${d.color};\n    `}
    ${s&&`\n      border-right-width: ${s.width};\n      ${s.width&&`border-right-style: ${null!==(l=null==s?void 0:s.type)&&void 0!==l?l:"solid"};`}\n      border-right-color: ${s.color};\n    `}
  `},M=(o,t)=>{var n,i;const l=t?".jimu-nav-link-wrapper":"&.direction-button";return`\n    font-size: ${(null==o?void 0:o.size)?`${e.polished.rem(o.size)}!important`:""};\n    ${o.icon&&`${l} > .jimu-icon, .jimu-icon-img {\n      ${(null===(n=null==o?void 0:o.icon)||void 0===n?void 0:n.size)&&`\n        width: ${e.polished.rem(o.icon.size)};\n        height: ${e.polished.rem(o.icon.size)};\n      `};\n      ${(null===(i=null==o?void 0:o.icon)||void 0===i?void 0:i.color)&&`color: ${o.icon.color}`};\n    }`}\n `},k=(o,t)=>{var n,i,l,r,a,d;const s=null===(n=null==o?void 0:o.item)||void 0===n?void 0:n.default,u=(null==s?void 0:s.merge((null===(i=null==o?void 0:o.item)||void 0===i?void 0:i.hover)||{},{deep:!0}))||(null===(l=null==o?void 0:o.item)||void 0===l?void 0:l.hover),v=(null==s?void 0:s.merge((null===(r=null==o?void 0:o.item)||void 0===r?void 0:r.active)||{},{deep:!0}))||(null===(a=null==o?void 0:o.item)||void 0===a?void 0:a.active),c=null===(d=null==o?void 0:o.item)||void 0===d?void 0:d.disabled;return e.css`
    .jimu-btn {
      ${s&&`&:not(:hover):not(.active):not(:disabled):not(.disabled) {\n        ${M(s,t)}\n      }`}
      ${u&&`&:not(:disabled):not(.disabled):hover {\n        ${M(u,t)}\n      }`}
      ${v&&`\n        &:not(:disabled):not(.disabled).active,\n        &[aria-expanded="true"] {\n          ${M(v,t)}\n        }\n        &:not(:disabled):not(.disabled) {\n          cursor: pointer;\n        }\n      `}
      ${c&&`\n        &.disabled,\n        &:disabled {\n          ${M(c,t)}\n        }\n      `}
    }
  `},C=(o,t,n)=>{var i,l;return e.css`
    .jimu-nav{
      ${(null===(i=null==t?void 0:t.root)||void 0===i?void 0:i.bg)&&`background-color: ${t.root.bg};`}
      border-radius: ${(null===(l=null==t?void 0:t.root)||void 0===l?void 0:l.borderRadius)||"0px"};
      ${(o=>{if(!(null==o?void 0:o.item))return null;const{default:t,hover:n,active:i}=o.item,l=(null==t?void 0:t.merge(n||{},{deep:!0}))||n,r=(null==t?void 0:t.merge(i||{},{deep:!0}))||i;return e.css`
    .nav-item>.nav-link {
      ${t&&e.css`
        &:not(:hover):not(.active):not(:disabled):not(.disabled) {
          ${(0,p.getBoxStyles)(t)}
          ${S(t)}
        }
      `};
      ${l&&e.css`
        &:hover:not(.active),
        &[aria-expanded="true"] {
          ${(0,p.getBoxStyles)(l)};
          ${S(l)}
        }
      `}
      ${r&&e.css`
        &:not(:disabled):not(.disabled).active {
          ${(0,p.getBoxStyles)(r)}
          ${S(r)}
        }
      `}
    }
  `})(t)}
      ${((o,t)=>{const n=t?"right":"bottom",i=["top","bottom","left","right"].map((e=>n===e?"":`border-${e}-width: 0 !important;`)).join("");return e.css`
    ${"underline"===o&&`\n      &.nav-underline {\n        ${i}\n        .nav-link {\n          ${i}\n        }\n        ${t&&`\n          .nav-item {\n            margin-right: -1px;\n          }\n          .nav-link {\n            ${i}\n          }\n        `}\n    `}
  `})(o,n)}
      ${k(t,!0)}
    }
`},R=o=>{var t;return e.css`
    .nav-button-group {
      ${(null===(t=null==o?void 0:o.root)||void 0===t?void 0:t.bg)&&`background-color: ${o.root.bg};`}
      .jimu-btn {
        &.previous,
        &.next {
          ${(null==o?void 0:o.item)&&(o=>{if(!(null==o?void 0:o.item))return null;const{default:t,hover:n,disabled:i}=o.item,l=(null==t?void 0:t.merge(n||{},{deep:!0}))||n;return e.css`
    ${t&&e.css`
      &:not(:hover):not(:disabled):not(.disabled) {
        ${(0,p.getBoxStyles)(t)}
        ${S(t)}
      }
    `};
    ${l&&e.css`
      &:hover:not(:disabled):not(.disabled),
      &[aria-expanded="true"] {
        ${(0,p.getBoxStyles)(l)};
        ${S(l)}
      }
    `}
    ${i&&e.css`
      &.disabled,
      &:disabled {
        &,
        &:hover {
          ${(0,p.getBoxStyles)(i)}
          ${S(i)}
        }
      }`}
  `})(o)}
        }
      }
      ${k(o,!1)}
    }
 `},j=(o,t,n)=>{var i,l,r,a,d;const{track:s,thumb:u,progress:v}=o,c=(null==s?void 0:s.bg)||"var(--ref-palette-neutral-600)",p=(null===(i=null==u?void 0:u.default)||void 0===i?void 0:i.bg)||"var(--ref-palette-white)",g=(null===(r=null===(l=null==u?void 0:u.default)||void 0===l?void 0:l.border)||void 0===r?void 0:r.color)||"var(--sys-color-primary-main)",m=(null===(a=null==v?void 0:v.default)||void 0===a?void 0:a.bg)||"var(--sys-color-primary-main)",b=`\n    visibility: ${t?"hidden":"visible"};\n    background-color: ${p};\n    border-width: 2px;\n    border-style: solid;\n    border-color: ${g};\n    box-sizing: border-box;\n    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out; /* $btn-transition */\n    &:hover {\n      border-color: ${m};\n    }\n  `;return e.css`
    > .jimu-slider {
      display: block;
      width: 100%;
      -webkit-appearance: none;
      -moz-appearance: none;
      &:focus,
      &:active {
        outline: none;
      }
      &::-moz-focus-outer {
        border: none;
        outline: none;
      }
      padding: 0;
      cursor: pointer;
      &.rtl {
        transform: rotate(180deg);
      }
      ${(null===(d=null==o?void 0:o.root)||void 0===d?void 0:d.bg)&&`background-color: ${o.root.bg};`}

      &[type="range"] {
      /* thumb - webkit */
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        ${b}
      }
      /* thumb - moz */
      &::-moz-range-thumb {
        -moz-appearance: none;
        ${b}
      }
      /* thumb - ms */
      &::-ms-thumb {
        margin-top: 0;
        ${b}
      }
      /* track - webkit */
      &::-webkit-slider-runnable-track {
        border-radius: 50rem;
        background: linear-gradient(to ${n?"left":"right"}, ${m}, ${m}) ${c} no-repeat left;
        background-size: 50% 100%, 100% 100%;
      }
      /* track - moz */
      &::-moz-range-track {
        border-radius: 50rem;
        background-color: ${c};
      }
      /* track - ms */
      &::-ms-track {
        border-radius: 50rem;
        background-color: ${c};
      }
      /* fill - moz */
      &::-moz-range-progress {
        border-radius: 50rem;
        background-color: ${m};
      }
      /* fill - ms */
      &::-ms-fill-lower {
        border-radius: 50rem;
        background-color: ${m};
      }
      &::-ms-fill-upper {
        display: none;
      }
      /* tooltip - ms */
      &::-ms-tooltip {
        display: none;
      }
      &:focus {
        &::-webkit-slider-thumb {
          box-shadow: 0 0 0 2px var(--ref-palette-white), 0 0 0 3px var(--ref-palette-black);
        }
        &::-moz-range-thumb {
          box-shadow: 0 0 0 2px var(--ref-palette-white), 0 0 0 3px var(--ref-palette-black);
        }
      }
    }
  }
 `},P=(t,n)=>{const i=h((e=>e.appConfig.views)),l=h((e=>{const o=e.appConfig.pages,t=Object.keys(o).find((e=>{var t;return null===(t=null==o?void 0:o[e])||void 0===t?void 0:t.isDefault}));return e.appRuntimeInfo.currentPageId||t}));return e.React.useMemo((()=>{var r;return null!==(r=null==t?void 0:t.map((t=>{var r,a,d;const s=null===(r=null==i?void 0:i[t])||void 0===r?void 0:r.label,v=(null===(a=null==i?void 0:i[t])||void 0===a?void 0:a.icon)||o.utils.toIconResult(u(),"",16);return{name:s,linkType:e.LinkType.View,value:`${l},${t}`,icon:c(n)?void 0:v,navLinkAriaControls:`${null===(d=null==i?void 0:i[t])||void 0===d?void 0:d.parent}_${t}`}})))&&void 0!==r?r:(0,e.Immutable)([])}),[n,l,i,t])};var T=function(e,o){var t={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&o.indexOf(n)<0&&(t[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(e);i<n.length;i++)o.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(t[n[i]]=e[n[i]])}return t};const B=e.css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  .nav-button-group .jimu-page-number .page-span.current-page {
    color: inherit !important;
  }
`,z=t=>{const{className:n,data:i,progress:l=0,type:r,navStyle:a,vertical:d,advanced:s,variant:u,onChange:c,activeView:p,standard:g,paginationFontColor:b}=t,h=T(t,["className","data","progress","type","navStyle","vertical","advanced","variant","onChange","activeView","standard","paginationFontColor"]),{current:f,totalPage:w,showPageNumber:x,scrollable:$,disablePrevious:I,disableNext:S,previousText:M,previousIcon:k,nextText:P,nextIcon:z,showIcon:A,gap:V,alternateIcon:N,activedIcon:O,showText:L,showTitle:_,iconPosition:E,textAlign:U,hideThumb:W}=g||{},F=e.React.useRef((()=>0));e.React.useEffect((()=>(F.current=e.lodash.throttle((e=>{let o=+e.target.value;o=Number((o/100).toFixed(2)),null==c||c("slider",o)}),100),()=>{F.current.cancel()})),[c]);const G=e.React.useCallback((e=>p===y(e)),[p]),H=((o,t,n,i,l,r)=>m((()=>{var a,d,s;if(!n||!i)return null;const u=null===(s=null===(d=null===(a=(0,e.getAppStore)())||void 0===a?void 0:a.getState())||void 0===d?void 0:d.appContext)||void 0===s?void 0:s.isRTL;return"nav"===o?C(t,i,l):"navButtonGroup"===o?R(i):"slider"===o?j(i,r,u):null}),[n,o,t,i,l,r]))(r,a,s,u,d,W),D=(o=>m((()=>e.css`
      ${"slider"===o&&"padding: 0.625rem 0.25rem;"}
      .nav-button-group >.direction-button {
        &:focus,
        &:focus-visible {
          outline-offset: -2px;
        }
      }
    `),[o]))(r);return(0,e.jsx)("div",Object.assign({className:(0,e.classNames)("navigation",n),css:[B,H,D]},h),"nav"===r&&(0,e.jsx)(o.Navigation,{keepPaddingWhenOnlyIcon:v(t),onLinkClick:e=>{const o=y(e);null==c||c("nav",o)},role:"tablist",vertical:d,isActive:G,scrollable:$,data:i,gap:V,type:a,showIcon:A,alternateIcon:N,activedIcon:O,showText:L,showTitle:_||L||v(t)&&!L&&A,isUseNativeTitle:!0,iconPosition:E,textAlign:U}),"slider"===r&&(0,e.jsx)(o.Slider,{className:"h-100",value:100*l,hideThumb:W,onChange:e=>{var o;null===(o=e.persist)||void 0===o||o.call(e),F.current(e)}}),"navButtonGroup"===r&&(0,e.jsx)(o.NavButtonGroup,{variant:"tertiary"===a?"text":"outlined",previousText:M,previousIcon:k,nextText:P,nextIcon:z,vertical:d,disablePrevious:I,disableNext:S,onChange:e=>{null==c||c("navButtonGroup",e)}},x&&(0,e.jsx)(o.PageNumber,{current:f,totalPage:w,css:b?e.css`color: ${b}`:e.css``})))},A={data:{type:"AUTO",section:"",views:[]},display:{advanced:!1,vertical:!1,navType:"default",alignment:"center",showText:!0,showIcon:!1,iconPosition:"start"}};class V extends e.BaseVersionManager{constructor(){super(...arguments),this.versions=[{version:"1.0.0",description:"Version manager for release 1.0.0",upgrader:e=>{var o;if(!e)return A;let t=e;return(null===(o=null==e?void 0:e.display)||void 0===o?void 0:o.variants)&&(t=t.setIn(["display","advanced"],!0)),t}},{version:"1.1.0",description:"Version manager for release 1.1.0",upgrader:o=>(o=>{const t=o;if(!o)return;const n=t.display;if(!n)return o;let i=(0,e.Immutable)({});const l=((e,o)=>{if(!e)return;const t=null==e?void 0:e[o];if(!t)return;let n=t;return t.bg&&(n=n.setIn(["root","bg"],t.bg),n=n.without("bg")),n})(n.variants,n.navType);return i=i.set("type","nav").set("vertical",n.vertical).set("advanced",n.advanced).set("navStyle",n.navType).set("standard",{scrollable:!0,textAlign:n.alignment,showText:n.showText,showIcon:n.showIcon,iconPosition:n.iconPosition}).set("variant",l),t.set("display",i)})(o||A)},{version:"1.13.0",description:"Change borderRadius from 50rem to 6.25rem in pills style",upgrader:e=>{var o,t,n,i;if("pills"!==(null===(o=null==e?void 0:e.display)||void 0===o?void 0:o.navStyle)||!(null===(t=null==e?void 0:e.display)||void 0===t?void 0:t.advanced))return e;let l=e;return Object.keys((null===(i=null===(n=null==l?void 0:l.display)||void 0===n?void 0:n.variant)||void 0===i?void 0:i.item)||{}).forEach((e=>{var o,t,n,i;"50rem"===(null===(i=null===(n=null===(t=null===(o=null==l?void 0:l.display)||void 0===o?void 0:o.variant)||void 0===t?void 0:t.item)||void 0===n?void 0:n[e])||void 0===i?void 0:i.borderRadius)&&(l=l.setIn(["display","variant","item",e,"borderRadius"],"6.25rem"))})),l}}]}}const N=new V,{useRef:O}=e.React,{useSelector:L}=e.ReactRedux,_=o=>{var t,n,r;const{id:a,config:d,builderSupportModules:s}=o,u=null===(t=null==s?void 0:s.jimuForBuilderLib)||void 0===t?void 0:t.getAppConfigAction,v=O(null),c=null==d?void 0:d.display,p=null==d?void 0:d.data,w=null==c?void 0:c.standard,y=null==p?void 0:p.type,S=null==p?void 0:p.section,M=null!==(n=null==w?void 0:w.step)&&void 0!==n?n:1,k=L((e=>{var o,t,n,i;return null===(i=null===(n=null===(t=null===(o=null==e?void 0:e.appConfig)||void 0===o?void 0:o.sections)||void 0===t?void 0:t[S])||void 0===n?void 0:n.views)||void 0===i?void 0:i[0]})),C=L((e=>{var o,t;return null===(t=null===(o=null==e?void 0:e.appRuntimeInfo)||void 0===o?void 0:o.sectionNavInfos)||void 0===t?void 0:t[S]})),R=((o,t,n)=>{const i=h((e=>{var t,n,i,l,r,a,d;return(null==e?void 0:e.appStateInBuilder)?null===(l=null===(i=null===(n=null===(t=null==e?void 0:e.appStateInBuilder)||void 0===t?void 0:t.appConfig)||void 0===n?void 0:n.sections)||void 0===i?void 0:i[o])||void 0===l?void 0:l.views:null===(d=null===(a=null===(r=null==e?void 0:e.appConfig)||void 0===r?void 0:r.sections)||void 0===a?void 0:a[o])||void 0===d?void 0:d.views}));return e.React.useMemo((()=>{const o=((n===l.Custom?t:i)||(0,e.Immutable)([])).asMutable();return o.sort(((e,o)=>(null==i?void 0:i.indexOf(e))-(null==i?void 0:i.indexOf(o)))),(0,e.Immutable)(o)}),[t,i,n])})(S,null==p?void 0:p.views,y),j=P(R,c),T=null==C?void 0:C.progress,B=null==C?void 0:C.useProgress,A=null!==(r=null==C?void 0:C.currentViewId)&&void 0!==r?r:k,V=(N=null==c?void 0:c.vertical,m((()=>e.css`
      overflow: hidden;
      min-height: ${N?e.polished.rem(16):"unset"};
      min-width: ${N?"unset":e.polished.rem(16)};
      max-width: 100vw;
      max-height: 100vh;
    `),[N]));var N;const _=e.React.useMemo((()=>{const o=((e,o,t,n)=>{var i,l;let r,a;const d=null!==(i=null==n?void 0:n.length)&&void 0!==i?i:0;let s=(null==n?void 0:n.includes(e))?null==n?void 0:n.indexOf(e):0;if(s+=1,t){let e=0;const t=null!==(l=null==n?void 0:n.length)&&void 0!==l?l:0;if(t>1){e=o*(t-1);const n=e%1;e=Math.floor(e),r=0===e&&0===n,a=e===d-1&&0===n}}else r=s<=1,a=s===d;return{current:s,totalPage:d,disableNext:a,disablePrevious:r}})(A,T,B,R);return(w||(0,e.Immutable)({})).merge(o).asMutable({deep:!0})}),[A,T,w,B,R]),E=((o,t)=>b((n=>{var i;const l=(0,e.getAppStore)().getState().appConfig.widgets[o].config,r=null===(i=null==l?void 0:l.data)||void 0===i?void 0:i.section;if(!(null==n?void 0:n.includes(r))){if(!r&&!(null==n?void 0:n[0]))return;t().editWidgetProperty(o,"config",l.setIn(["data","section"],null==n?void 0:n[0])).exec(!1)}}),[t,o]))(a,u);x(a,E);const U=((o,t)=>b((n=>{var i,r,a,d,s,u;const v=(0,e.getAppStore)().getState().appConfig.widgets[o].config;if((null===(i=null==v?void 0:v.data)||void 0===i?void 0:i.type)===l.Auto)return;const c=null===(a=null===(r=null==v?void 0:v.data)||void 0===r?void 0:r.views)||void 0===a?void 0:a.filter((e=>null==n?void 0:n.includes(e)));((null==c?void 0:c.length)||(null===(s=null===(d=null==v?void 0:v.data)||void 0===d?void 0:d.views)||void 0===s?void 0:s.length))&&(e.lodash.isDeepEqual(c,null===(u=null==v?void 0:v.data)||void 0===u?void 0:u.views)||t().editWidgetProperty(o,"config",v.setIn(["data","views"],c)).exec(!1))}),[t,o]))(a,u);((o,t)=>{const n=h((e=>{var t,n,i;return null===(i=null===(n=null===(t=null==e?void 0:e.appConfig)||void 0===t?void 0:t.sections)||void 0===n?void 0:n[o])||void 0===i?void 0:i.views})),{current:i}=e.React.useRef((0,e.getAppStore)().getState().appContext.isInBuilder),l=e.hooks.useLatest(t);g((()=>{var e;i&&(null===(e=l.current)||void 0===e||e.call(l,n))}),[n,l,i])})(S,U);const W=$(S),F=(o=>{const t=f();return b((n=>{var i,l,r,a,d,s;const u=null===(i=(0,e.getAppStore)())||void 0===i?void 0:i.getState(),v=null===(r=null===(l=u.appConfig.sections)||void 0===l?void 0:l[o])||void 0===r?void 0:r.views,c=null===(s=null===(d=null===(a=u.appRuntimeInfo)||void 0===a?void 0:a.sectionNavInfos)||void 0===d?void 0:d[o])||void 0===s?void 0:s.visibleViews,p=I(n,v,c);return t(e.appActions.sectionNavInfoChanged(o,p)),p}),[t,o])})(S),G=e.hooks.useEventCallback(((o,t)=>{let n;"navButtonGroup"===o?n=W(t,M):"slider"===o&&(n=F(t));const i=A,l=n?n.currentViewId:t;((o,t)=>{if(o===t)return;const n=new e.ViewChangeMessage(a,o,t);e.MessageManager.getInstance().publishMessage(n)})(l,i),"nav"===o&&((o,t)=>{if(o===t){const o=new e.ButtonClickMessage(a);e.MessageManager.getInstance().publishMessage(o)}})(l,i)}));return((o,t)=>{const n=h((e=>{var o;return null===(o=null==e?void 0:e.appConfig)||void 0===o?void 0:o.layouts})),i=h((e=>{var t,n,i;return null===(i=null===(n=null===(t=null==e?void 0:e.appConfig)||void 0===t?void 0:t.sections)||void 0===n?void 0:n[o])||void 0===i?void 0:i.views})),l=h((e=>{var o;return null===(o=null==e?void 0:e.appConfig)||void 0===o?void 0:o.views})),r=e.ReactRedux.useSelector((o=>o.appRuntimeInfo.appMode===e.AppMode.Express)),a=e.React.useMemo((()=>r?i.map((e=>l[e])).filter((o=>{const{layout:t}=o,[i,l,r]=[e.BrowserSizeMode.Large,e.BrowserSizeMode.Medium,e.BrowserSizeMode.Small].map((o=>{var i;const l=Object.values((null===(i=n[t[o]])||void 0===i?void 0:i.content)||{});return!!l.length&&l.every((o=>o.type===e.LayoutItemType.Widget&&o.widgetId))}));return!(!(i&&l&&r)||o.icon)})):[]),[l,r,n,i]);e.React.useEffect((()=>{if(!a.length)return;const o=t();let i=!1;a.forEach((t=>{var l,r,a,d,s,u,v;const{layout:c,id:p}=t,g=null===(l=n[c[Object.keys(c)[0]]])||void 0===l?void 0:l.content;if(g){const t=null===(a=null===(r=Object.values(g))||void 0===r?void 0:r[0])||void 0===a?void 0:a.id,l=null===(u=null===(s=null===(d=n[c[Object.keys(c)[0]]])||void 0===d?void 0:d.content)||void 0===s?void 0:s[t])||void 0===u?void 0:u.widgetId,{label:m,icon:b}=(null===(v=(0,e.getAppStore)().getState().appConfig.widgets)||void 0===v?void 0:v[l])||{};i=!0,o.editViewProperty(p,"icon",{svg:b,properties:{filename:m}}).editViewProperty(p,"label",m)}})),i&&o.exec()}),[a])})(S,u),(0,e.jsx)("div",{className:"widget-view-navigation jimu-widget",css:V,ref:v},(0,e.jsx)(i,{widgetId:a,show:!j.length}),(0,e.jsx)(z,Object.assign({data:j,activeView:A,progress:T,onChange:G},c,{standard:_})))};_.versionManager=N;const E=_;function U(e){r.p=e}})(),a})())}}}));