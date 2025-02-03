System.register(["jimu-core","jimu-for-builder","jimu-ui","jimu-layouts/layout-runtime","jimu-theme","jimu-ui/basic/list-tree"],(function(e,t){var o={},n={},i={},l={},r={},a={};return{setters:[function(e){o.AppMode=e.AppMode,o.Immutable=e.Immutable,o.LayoutType=e.LayoutType,o.React=e.React,o.ReactRedux=e.ReactRedux,o.classNames=e.classNames,o.css=e.css,o.getAppStore=e.getAppStore,o.hooks=e.hooks,o.jsx=e.jsx,o.lodash=e.lodash,o.polished=e.polished},function(e){n.getAppConfigAction=e.getAppConfigAction},function(e){i.Button=e.Button,i.NavButtonGroup=e.NavButtonGroup,i.Navigation=e.Navigation,i.PageNumber=e.PageNumber,i.Slider=e.Slider,i.TextAlignValue=e.TextAlignValue,i.Tooltip=e.Tooltip,i.defaultMessages=e.defaultMessages,i.utils=e.utils},function(e){l.LayoutItemSizeModes=e.LayoutItemSizeModes},function(e){r.ThemeSwitchComponent=e.ThemeSwitchComponent,r.getBoxStyles=e.getBoxStyles,r.useTheme=e.useTheme,r.useTheme2=e.useTheme2,r.useUseTheme2=e.useUseTheme2},function(e){a.List=e.List}],execute:function(){e((()=>{var e={82606:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#000" fill-rule="evenodd" d="M1.25 2.5h17.5v11.25H1.25zM0 2.5c0-.69.56-1.25 1.25-1.25h17.5c.69 0 1.25.56 1.25 1.25v11.25c0 .69-.56 1.25-1.25 1.25H1.25C.56 15 0 14.44 0 13.75zm3.75 16.25h2.5V17.5h-2.5zm7.5 0h-2.5V17.5h2.5zm2.5 0h2.5V17.5h-2.5z" clip-rule="evenodd"></path></svg>'},37568:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M11.347 2.146a.485.485 0 0 1 0 .708L5.76 8l5.587 5.146a.486.486 0 0 1 0 .708.54.54 0 0 1-.738 0l-5.956-5.5a.485.485 0 0 1 0-.708l5.956-5.5a.54.54 0 0 1 .738 0" clip-rule="evenodd"></path></svg>'},52943:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M4.653 13.854a.485.485 0 0 1 0-.708L10.24 8 4.653 2.854a.485.485 0 0 1 0-.708.54.54 0 0 1 .738 0l5.956 5.5a.485.485 0 0 1 0 .708l-5.956 5.5a.54.54 0 0 1-.738 0" clip-rule="evenodd"></path></svg>'},62838:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="m8.745 8 6.1 6.1a.527.527 0 1 1-.745.746L8 8.746l-6.1 6.1a.527.527 0 1 1-.746-.746l6.1-6.1-6.1-6.1a.527.527 0 0 1 .746-.746l6.1 6.1 6.1-6.1a.527.527 0 0 1 .746.746z"></path></svg>'},12907:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6"><circle cx="1104" cy="1049" r="3" fill="#000" fill-rule="nonzero" transform="translate(-1101 -1046)"></circle></svg>'},79244:e=>{"use strict";e.exports=o},4108:e=>{"use strict";e.exports=n},41496:e=>{"use strict";e.exports=l},1888:e=>{"use strict";e.exports=r},14321:e=>{"use strict";e.exports=i},98640:e=>{"use strict";e.exports=a}},t={};function s(o){var n=t[o];if(void 0!==n)return n.exports;var i=t[o]={exports:{}};return e[o](i,i.exports,s),i.exports}s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var o in t)s.o(t,o)&&!s.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var d={};return(()=>{"use strict";s.r(d),s.d(d,{default:()=>V});var e,t=s(79244),o=s(4108);!function(e){e.Auto="AUTO",e.Custom="CUSTOM"}(e||(e={}));var n=s(14321);const i={_widgetLabel:"Views Navigation",widgetPlaceholder:"Please add a Section to use this widget.",tabDefault:"Tab default",tabUnderline:"Tab underline",tabPills:"Tab pills",arrow1:"Arrow 1",arrow2:"Arrow 2",arrow3:"Arrow 3"};var l=s(41496);s(82606);const r=e=>{var t,o;return"nav"===(null==e?void 0:e.type)&&!(null===(t=null==e?void 0:e.standard)||void 0===t?void 0:t.alternateIcon)&&!(null===(o=null==e?void 0:e.standard)||void 0===o?void 0:o.activedIcon)};var a=s(1888);const{useEffect:u,useMemo:c,useCallback:v}=t.React,{useSelector:p,useDispatch:m}=t.ReactRedux,g=s(12907),b=s(37568),h=s(52943),x=e=>{if(!(null==e?void 0:e.value))return"";const t=e.value.split(",");return(null==t?void 0:t.length)?t[1]:""},f=e=>{var o,n,i,l;const{borderTop:r,borderBottom:a,borderLeft:s,borderRight:d}=e;return t.css`
    ${r&&`\n      border-top-width: ${r.width};\n      ${r.width&&`border-top-style: ${null!==(o=null==r?void 0:r.type)&&void 0!==o?o:"solid"};`}\n      border-top-color: ${r.color};\n    `}
    ${a&&`\n      border-bottom-width: ${a.width};\n      ${a.width&&`border-bottom-style: ${null!==(n=null==a?void 0:a.type)&&void 0!==n?n:"solid"};`}\n      border-bottom-color: ${a.color};\n    `}
    ${s&&`\n      border-left-width: ${s.width};\n      ${s.width&&`border-left-style: ${null!==(i=null==s?void 0:s.type)&&void 0!==i?i:"solid"};`}\n      border-left-color: ${s.color};\n    `}
    ${d&&`\n      border-right-width: ${d.width};\n      ${d.width&&`border-right-style: ${null!==(l=null==d?void 0:d.type)&&void 0!==l?l:"solid"};`}\n      border-right-color: ${d.color};\n    `}
  `},y=(e,o)=>{var n,i;const l=o?".jimu-nav-link-wrapper":"&.direction-button";return`\n    font-size: ${(null==e?void 0:e.size)?`${t.polished.rem(e.size)}!important`:""};\n    ${e.icon&&`${l} > .jimu-icon, .jimu-icon-img {\n      ${(null===(n=null==e?void 0:e.icon)||void 0===n?void 0:n.size)&&`\n        width: ${t.polished.rem(e.icon.size)};\n        height: ${t.polished.rem(e.icon.size)};\n      `};\n      ${(null===(i=null==e?void 0:e.icon)||void 0===i?void 0:i.color)&&`color: ${e.icon.color}`};\n    }`}\n `},w=(e,o)=>{var n,i,l,r,a,s;const d=null===(n=null==e?void 0:e.item)||void 0===n?void 0:n.default,u=(null==d?void 0:d.merge((null===(i=null==e?void 0:e.item)||void 0===i?void 0:i.hover)||{},{deep:!0}))||(null===(l=null==e?void 0:e.item)||void 0===l?void 0:l.hover),c=(null==d?void 0:d.merge((null===(r=null==e?void 0:e.item)||void 0===r?void 0:r.active)||{},{deep:!0}))||(null===(a=null==e?void 0:e.item)||void 0===a?void 0:a.active),v=null===(s=null==e?void 0:e.item)||void 0===s?void 0:s.disabled;return t.css`
    .jimu-btn {
      ${d&&`&:not(:hover):not(.active):not(:disabled):not(.disabled) {\n        ${y(d,o)}\n      }`}
      ${u&&`&:not(:disabled):not(.disabled):hover {\n        ${y(u,o)}\n      }`}
      ${c&&`\n        &:not(:disabled):not(.disabled).active,\n        &[aria-expanded="true"] {\n          ${y(c,o)}\n        }\n        &:not(:disabled):not(.disabled) {\n          cursor: pointer;\n        }\n      `}
      ${v&&`\n        &.disabled,\n        &:disabled {\n          ${y(v,o)}\n        }\n      `}
    }
  `},$=(e,o,n)=>{var i,l;return t.css`
    .jimu-nav{
      ${(null===(i=null==o?void 0:o.root)||void 0===i?void 0:i.bg)&&`background-color: ${o.root.bg};`}
      border-radius: ${(null===(l=null==o?void 0:o.root)||void 0===l?void 0:l.borderRadius)||"0px"};
      ${(e=>{if(!(null==e?void 0:e.item))return null;const{default:o,hover:n,active:i}=e.item,l=(null==o?void 0:o.merge(n||{},{deep:!0}))||n,r=(null==o?void 0:o.merge(i||{},{deep:!0}))||i;return t.css`
    .nav-item>.nav-link {
      ${o&&t.css`
        &:not(:hover):not(.active):not(:disabled):not(.disabled) {
          ${(0,a.getBoxStyles)(o)}
          ${f(o)}
        }
      `};
      ${l&&t.css`
        &:hover:not(.active),
        &[aria-expanded="true"] {
          ${(0,a.getBoxStyles)(l)};
          ${f(l)}
        }
      `}
      ${r&&t.css`
        &:not(:disabled):not(.disabled).active {
          ${(0,a.getBoxStyles)(r)}
          ${f(r)}
        }
      `}
    }
  `})(o)}
      ${((e,o)=>{const n=o?"right":"bottom",i=["top","bottom","left","right"].map((e=>n===e?"":`border-${e}-width: 0 !important;`)).join("");return t.css`
    ${"underline"===e&&`\n      &.nav-underline {\n        ${i}\n        .nav-link {\n          ${i}\n        }\n        ${o&&`\n          .nav-item {\n            margin-right: -1px;\n          }\n          .nav-link {\n            ${i}\n          }\n        `}\n    `}
  `})(e,n)}
      ${w(o,!0)}
    }
`},S=e=>{var o;return t.css`
    .nav-button-group {
      ${(null===(o=null==e?void 0:e.root)||void 0===o?void 0:o.bg)&&`background-color: ${e.root.bg};`}
      .jimu-btn {
        &.previous,
        &.next {
          ${(null==e?void 0:e.item)&&(e=>{if(!(null==e?void 0:e.item))return null;const{default:o,hover:n,disabled:i}=e.item,l=(null==o?void 0:o.merge(n||{},{deep:!0}))||n;return t.css`
    ${o&&t.css`
      &:not(:hover):not(:disabled):not(.disabled) {
        ${(0,a.getBoxStyles)(o)}
        ${f(o)}
      }
    `};
    ${l&&t.css`
      &:hover:not(:disabled):not(.disabled),
      &[aria-expanded="true"] {
        ${(0,a.getBoxStyles)(l)};
        ${f(l)}
      }
    `}
    ${i&&t.css`
      &.disabled,
      &:disabled {
        &,
        &:hover {
          ${(0,a.getBoxStyles)(i)}
          ${f(i)}
        }
      }`}
  `})(e)}
        }
      }
      ${w(e,!1)}
    }
 `},T=(e,o,n)=>{var i,l,r,a,s;const{track:d,thumb:u,progress:c}=e,v=(null==d?void 0:d.bg)||"var(--ref-palette-neutral-600)",p=(null===(i=null==u?void 0:u.default)||void 0===i?void 0:i.bg)||"var(--ref-palette-white)",m=(null===(r=null===(l=null==u?void 0:u.default)||void 0===l?void 0:l.border)||void 0===r?void 0:r.color)||"var(--sys-color-primary-main)",g=(null===(a=null==c?void 0:c.default)||void 0===a?void 0:a.bg)||"var(--sys-color-primary-main)",b=`\n    visibility: ${o?"hidden":"visible"};\n    background-color: ${p};\n    border-width: 2px;\n    border-style: solid;\n    border-color: ${m};\n    box-sizing: border-box;\n    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out; /* $btn-transition */\n    &:hover {\n      border-color: ${g};\n    }\n  `;return t.css`
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
      ${(null===(s=null==e?void 0:e.root)||void 0===s?void 0:s.bg)&&`background-color: ${e.root.bg};`}

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
        background: linear-gradient(to ${n?"left":"right"}, ${g}, ${g}) ${v} no-repeat left;
        background-size: 50% 100%, 100% 100%;
      }
      /* track - moz */
      &::-moz-range-track {
        border-radius: 50rem;
        background-color: ${v};
      }
      /* track - ms */
      &::-ms-track {
        border-radius: 50rem;
        background-color: ${v};
      }
      /* fill - moz */
      &::-moz-range-progress {
        border-radius: 50rem;
        background-color: ${g};
      }
      /* fill - ms */
      &::-ms-fill-lower {
        border-radius: 50rem;
        background-color: ${g};
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
 `},I=e=>{var t,o;const{type:n,navStyle:i}=e||{},{showIcon:l,showText:r,alternateIcon:a,showPageNumber:s}=null!==(t=null==e?void 0:e.standard)&&void 0!==t?t:{};if("nav"===n){const{filename:e}=null!==(o=null==a?void 0:a.properties)&&void 0!==o?o:{};return`${n}-${i}-${l?"showIcon":"hideIcon"}-${r?"showText":"hideText"}-icon-${e}`}if("navButtonGroup"===n)return`${n}-${i}-${s?"showPageNumber":""}`};var j=function(e,t){var o={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(o[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(o[n[i]]=e[n[i]])}return o};const k=t.css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  .nav-button-group .jimu-page-number .page-span.current-page {
    color: inherit !important;
  }
`,C=e=>{const{className:o,data:i,progress:l=0,type:a,navStyle:s,vertical:d,advanced:u,variant:v,onChange:p,activeView:m,standard:g,paginationFontColor:b}=e,h=j(e,["className","data","progress","type","navStyle","vertical","advanced","variant","onChange","activeView","standard","paginationFontColor"]),{current:f,totalPage:y,showPageNumber:w,scrollable:I,disablePrevious:C,disableNext:N,previousText:A,previousIcon:B,nextText:P,nextIcon:R,showIcon:z,gap:O,alternateIcon:M,activedIcon:L,showText:E,showTitle:V,iconPosition:G,textAlign:_,hideThumb:D}=g||{},U=t.React.useRef((()=>0));t.React.useEffect((()=>(U.current=t.lodash.throttle((e=>{let t=+e.target.value;t=Number((t/100).toFixed(2)),null==p||p("slider",t)}),100),()=>{U.current.cancel()})),[p]);const F=t.React.useCallback((e=>m===x(e)),[m]),J=((e,o,n,i,l,r)=>c((()=>{var a,s,d;if(!n||!i)return null;const u=null===(d=null===(s=null===(a=(0,t.getAppStore)())||void 0===a?void 0:a.getState())||void 0===s?void 0:s.appContext)||void 0===d?void 0:d.isRTL;return"nav"===e?$(o,i,l):"navButtonGroup"===e?S(i):"slider"===e?T(i,r,u):null}),[n,e,o,i,l,r]))(a,s,u,v,d,D),K=(e=>c((()=>t.css`
      ${"slider"===e&&"padding: 0.625rem 0.25rem;"}
      .nav-button-group >.direction-button {
        &:focus,
        &:focus-visible {
          outline-offset: -2px;
        }
      }
    `),[e]))(a);return(0,t.jsx)("div",Object.assign({className:(0,t.classNames)("navigation",o),css:[k,J,K]},h),"nav"===a&&(0,t.jsx)(n.Navigation,{keepPaddingWhenOnlyIcon:r(e),onLinkClick:e=>{const t=x(e);null==p||p("nav",t)},role:"tablist",vertical:d,isActive:F,scrollable:I,data:i,gap:O,type:s,showIcon:z,alternateIcon:M,activedIcon:L,showText:E,showTitle:V||E||r(e)&&!E&&z,isUseNativeTitle:!0,iconPosition:G,textAlign:_}),"slider"===a&&(0,t.jsx)(n.Slider,{className:"h-100",value:100*l,hideThumb:D,onChange:e=>{var t;null===(t=e.persist)||void 0===t||t.call(e),U.current(e)}}),"navButtonGroup"===a&&(0,t.jsx)(n.NavButtonGroup,{variant:"tertiary"===s?"text":"outlined",previousText:A,previousIcon:B,nextText:P,nextIcon:R,vertical:d,disablePrevious:C,disableNext:N,onChange:e=>{null==p||p("navButtonGroup",e)}},w&&(0,t.jsx)(n.PageNumber,{current:f,totalPage:y,css:b?t.css`color: ${b}`:t.css``})))},N=e=>{const{title:o,children:n,selected:i,onClick:l}=e,r=(()=>{const e=(0,a.useTheme)(),o=(0,a.useTheme2)(),n=(0,a.useUseTheme2)(),i=window.jimuConfig.isBuilder!==n?o:e,l=(window.jimuConfig.isBuilder!==n?e:o).sys.color.primary.light,r=null==i?void 0:i.ref.palette.neutral[300];return t.React.useMemo((()=>t.css`
      width: 100%;
      height:  ${t.polished.rem(50)};
      padding: ${t.polished.rem(8)}  ${t.polished.rem(12)};
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${r};
      position: relative;
      &.selected {
        outline: 3px solid ${l};
      }
      >.overlay {
        z-index: 1;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
  `),[l,r])})();return(0,t.jsx)("div",{css:r,title:o,className:(0,t.classNames)("quick-style-item",{selected:i}),onClick:l},(0,t.jsx)("div",{className:"overlay"}),(0,t.jsx)(a.ThemeSwitchComponent,{useTheme2:window.jimuConfig.isBuilder},n))},A=(0,t.Immutable)([{name:"v1",value:"p1,v1"},{name:"v2"},{name:"v3"},{name:"v4"}]),B=t.css`
  &.body {
    display: flex;
    padding: var(--sys-spacing-5);
    width: 260px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .quick-style-item:not(:last-of-type) {
      margin-bottom: 10px;
    }
  }
`,P=a=>{const{widgetId:s}=a,d=t.ReactRedux.useSelector((e=>{var t;return null===(t=(e.appStateInBuilder?e.appStateInBuilder:e).appConfig.widgets[s])||void 0===t?void 0:t.config})),u=(()=>{const e=t.hooks.useTranslation(n.defaultMessages,i),o=n.utils.toIconResult(b,e("arrowLeft"),16);o.properties.originalName="outlined/directional/left.svg";const l=n.utils.toIconResult(h,e("arrowRight"),16);l.properties.originalName="outlined/directional/right.svg";const r=n.utils.toIconResult(g,e("drawToolDot"),8);return c((()=>[{label:e("tabDefault"),type:"nav",navStyle:"default",standard:{gap:"0px",scrollable:!0,showIcon:!1,showText:!0,iconPosition:"start",textAlign:n.TextAlignValue.CENTER}},{label:e("tabUnderline"),type:"nav",navStyle:"underline",standard:{gap:"0px",scrollable:!0,showIcon:!1,showText:!0,iconPosition:"start",textAlign:n.TextAlignValue.CENTER}},{label:e("tabPills"),type:"nav",navStyle:"pills",standard:{gap:"0px",scrollable:!0,showIcon:!1,showText:!0,iconPosition:"start",textAlign:n.TextAlignValue.CENTER}},{label:e("symbol"),type:"nav",navStyle:"default",standard:{scrollable:!1,gap:"10px",showIcon:!0,alternateIcon:r,activedIcon:r,showText:!1,iconPosition:"start",textAlign:n.TextAlignValue.CENTER}},{label:e("slider"),type:"slider",navStyle:"default"},{label:e("arrow1"),type:"navButtonGroup",navStyle:"default",standard:{showPageNumber:!0,previousText:"",previousIcon:o,nextText:"",nextIcon:l}},{label:e("arrow2"),type:"navButtonGroup",navStyle:"tertiary",standard:{previousText:e("prev"),previousIcon:o,nextText:e("next"),nextIcon:l}},{label:e("arrow3"),type:"navButtonGroup",navStyle:"tertiary",standard:{showPageNumber:!0,previousText:"",previousIcon:o,nextText:"",nextIcon:l}}]),[e,r,o,l])})(),v=null==d?void 0:d.display,p=t.ReactRedux.useSelector((e=>e.appRuntimeInfo.appMode)),m=n=>{const i=(0,t.Immutable)(n).set("vertical",p===t.AppMode.Express).set("advanced",!1).without("variant");(0,o.getAppConfigAction)().editWidgetProperty(s,"config",d.setIn(["data","type"],e.Auto).set("display",i)).exec(),((e,o)=>{var n,i;if(!o)return;let a;const s=(0,t.getAppStore)().getState();a=window.jimuConfig.isBuilder?null==s?void 0:s.appStateInBuilder:s;const d=null===(n=null==a?void 0:a.appRuntimeInfo)||void 0===n?void 0:n.selection,u=null===(i=a.appConfig.layouts)||void 0===i?void 0:i[null==d?void 0:d.layoutId];if(u&&(null==u?void 0:u.type)===t.LayoutType.FixedLayout){const t=r(e),n=null==e?void 0:e.vertical;o().editLayoutItemSize(d,n?60:380,n?380:60).exec(),o().editLayoutItemProperty(d,"setting.autoProps",{width:t||n?l.LayoutItemSizeModes.Auto:l.LayoutItemSizeModes.Custom,height:t||!n?l.LayoutItemSizeModes.Auto:l.LayoutItemSizeModes.Custom}).exec()}})(n,o.getAppConfigAction)};return(0,t.jsx)("div",{className:"body",css:B},u.map(((e,o)=>{const n=Object.assign({},e),i=n.label;delete n.label;const l="navButtonGroup"===e.type?{current:1,totalPage:4,disablePrevious:!0,disableNext:!1}:{},r="nav"===e.type?{scrollable:!1}:{},a=t.lodash.assign({},n.standard,l,r);return(0,t.jsx)(N,{key:o,title:i,selected:!(null==v?void 0:v.advanced)&&I(n)===I(v),onClick:()=>{m(n)}},(0,t.jsx)(C,{type:n.type,data:A,navStyle:n.navStyle,activeView:"v1",standard:a}))})))};var R=s(98640),z=s(62838),O=s.n(z),M=function(e,t){var o={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(o[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(o[n[i]]=e[n[i]])}return o};const L=e=>{const o=window.SVG,{className:n}=e,i=M(e,["className"]),l=(0,t.classNames)("jimu-icon jimu-icon-component",n);return o?t.React.createElement(o,Object.assign({className:l,src:O()},i)):t.React.createElement("svg",Object.assign({className:l},i))},E=e=>t.css`
  width: 300px;
  height: 350px;
  overflow-y: auto;
  .jimu-tree-main {
    padding: 4px;
  }
  .jimu-tree-item__main-line {
    height: 32px;
    background-color: ${e.ref.palette.neutral[500]};
    &:hover {
      background-color: ${e.ref.palette.neutral[600]};
    }
    color: ${e.ref.palette.neutral[1100]};
  }
  .jimu-tree-item__body {
    border: none !important;
  }
`,V={NavQuickStyle:P,ManageViews:i=>{const{widgetId:l}=i,r=t.hooks.useTranslation(n.defaultMessages),s=(0,a.useTheme)(),d=t.ReactRedux.useSelector((e=>{var t;return null===(t=(e.appStateInBuilder?e.appStateInBuilder:e).appConfig.widgets[l])||void 0===t?void 0:t.config})),u=null==d?void 0:d.data,c=((o,n,i)=>{const l=p((e=>{var t,n,i,l,r,a,s;return(null==e?void 0:e.appStateInBuilder)?null===(l=null===(i=null===(n=null===(t=null==e?void 0:e.appStateInBuilder)||void 0===t?void 0:t.appConfig)||void 0===n?void 0:n.sections)||void 0===i?void 0:i[o])||void 0===l?void 0:l.views:null===(s=null===(a=null===(r=null==e?void 0:e.appConfig)||void 0===r?void 0:r.sections)||void 0===a?void 0:a[o])||void 0===s?void 0:s.views}));return t.React.useMemo((()=>{const o=((i===e.Custom?n:l)||(0,t.Immutable)([])).asMutable();return o.sort(((e,t)=>(null==l?void 0:l.indexOf(e))-(null==l?void 0:l.indexOf(t)))),(0,t.Immutable)(o)}),[n,l,i])})(null==u?void 0:u.section,null==u?void 0:u.views,null==u?void 0:u.type),v=(e=>{const o=p((e=>{var t,o,n;return(null==e?void 0:e.appStateInBuilder)?null===(o=null===(t=null==e?void 0:e.appStateInBuilder)||void 0===t?void 0:t.appConfig)||void 0===o?void 0:o.views:null===(n=null==e?void 0:e.appConfig)||void 0===n?void 0:n.views}));return t.React.useMemo((()=>e.asMutable({deep:!0}).map((e=>{var t;return{id:e,label:null===(t=o[e])||void 0===t?void 0:t.label}}))),[e,o])})(c),m=(null==u?void 0:u.type)===e.Auto;return(0,t.jsx)("div",{className:"p-3",css:E(s)},(0,t.jsx)(R.List,{size:"default",itemsJson:v.map((e=>({itemKey:e.id,itemStateTitle:e.label,itemStateDisabled:1===(null==v?void 0:v.length)}))),dndEnabled:m,isMultiSelection:!1,renderOverrideItemCommands:(e,i)=>{const l=i.props.itemJsons[0];return!(null==l?void 0:l.itemStateDisabled)?(0,t.jsx)(n.Tooltip,{title:r("deleteOption")},(0,t.jsx)(n.Button,{className:"p-0",onClick:()=>{(e=>{(0,o.getAppConfigAction)().removeView(e.itemKey,null==u?void 0:u.section).exec()})(l)},type:"tertiary",icon:!0},(0,t.jsx)(L,{size:"s"}))):null},onDidDrop:(e,t)=>{const{itemJsons:n}=t.props,[,i]=n,l=i.map((e=>e.itemKey));var r;l.join(",")!==c.join(",")&&(r=l,(0,o.getAppConfigAction)().editSectionProperty(null==u?void 0:u.section,"views",r).exec())}}))}}})(),d})())}}}));