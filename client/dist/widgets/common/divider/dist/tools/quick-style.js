System.register(["jimu-core","jimu-for-builder","jimu-ui","jimu-theme"],(function(t,e){var o={},i={},n={},r={};return{setters:[function(t){o.BrowserSizeMode=t.BrowserSizeMode,o.Immutable=t.Immutable,o.ReactRedux=t.ReactRedux,o.appActions=t.appActions,o.classNames=t.classNames,o.css=t.css,o.getAppStore=t.getAppStore,o.hooks=t.hooks,o.i18n=t.i18n,o.injectIntl=t.injectIntl,o.jsx=t.jsx,o.polished=t.polished},function(t){i.appBuilderSync=t.appBuilderSync,i.builderAppSync=t.builderAppSync,i.getAppConfigAction=t.getAppConfigAction},function(t){n.Button=t.Button,n.defaultMessages=t.defaultMessages},function(t){r.ThemeSwitchComponent=t.ThemeSwitchComponent,r.useTheme=t.useTheme,r.useTheme2=t.useTheme2,r.useUseTheme2=t.useUseTheme2}],execute:function(){t((()=>{var t={63655:t=>{t.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#000" fill-rule="nonzero" d="m6.732 9.4 1.43 1.215a2.794 2.794 0 0 1-.507 4.602q-3.315 1.73-7.26-.362l-.293-.16a.2.2 0 0 1 .087-.374q2.77-.165 2.771-2.334c0-1.063.299-1.96 1.18-2.59.88-.631 1.832-.457 2.592.003m-1.945.761c-.56.472-.825 1.055-.825 1.826 0 1.22-1.19 2.713-1.987 2.713 1.3.517 3.745.799 5.212-.368.174-.139.383-.251.531-.425a1.793 1.793 0 0 0-.205-2.53l-1.43-1.214a1 1 0 0 0-1.296-.002M15.55.251c.45.355.58.988.307 1.495L11.696 9.49a1.967 1.967 0 0 1-2.958.622l-.996-.788a2.018 2.018 0 0 1-.12-3.054l6.42-5.959a1.16 1.16 0 0 1 1.509-.06m-.84.798-6.42 5.96a1.01 1.01 0 0 0 .06 1.527l.997.787a.984.984 0 0 0 1.479-.31l4.162-7.745a.18.18 0 0 0-.047-.229.18.18 0 0 0-.23.01"></path></svg>'},79244:t=>{"use strict";t.exports=o},4108:t=>{"use strict";t.exports=i},1888:t=>{"use strict";t.exports=r},14321:t=>{"use strict";t.exports=n}},e={};function l(o){var i=e[o];if(void 0!==i)return i.exports;var n=e[o]={exports:{}};return t[o](n,n.exports,l),n.exports}l.d=(t,e)=>{for(var o in e)l.o(e,o)&&!l.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},l.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),l.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var s={};return(()=>{"use strict";l.r(s),l.d(s,{default:()=>b});var t,e,o,i,n,r=l(79244),p=l(4108),a=l(14321);!function(t){t.Regular="REGULAR",t.Hover="HOVER"}(t||(t={})),function(t){t.Horizontal="Horizontal",t.Vertical="Vertical"}(e||(e={})),function(t){t.Style0="Style0",t.Style1="Style1",t.Style2="Style2",t.Style3="Style3",t.Style4="Style4",t.Style5="Style5",t.Style6="Style6",t.Style7="Style7",t.Style8="Style8",t.Style9="Style9",t.Style10="Style10"}(o||(o={})),function(t){t.None="None",t.Point0="Point0",t.Point1="Point1",t.Point2="Point2",t.Point3="Point3",t.Point4="Point4",t.Point5="Point5",t.Point6="Point6",t.Point7="Point7",t.Point8="Point8"}(i||(i={})),function(t){t.None="None",t.Default="Default",t.Style1="Style1",t.Style2="Style2",t.Style3="Style3",t.Style4="Style4",t.Style5="Style5",t.Style6="Style6",t.Style7="Style7",t.Style8="Style8",t.Style9="Style9",t.Style10="Style10",t.Style11="Style11",t.Style12="Style12",t.Style13="Style13",t.Style14="Style14",t.Style15="Style15",t.Style16="Style16",t.Style17="Style17",t.Style18="Style18",t.Style19="Style19"}(n||(n={}));var S=l(1888);const d={_widgetLabel:"Divider",quickStyleItem:"Quick style {index}"};function y(t,e=1.5,o=null){if(!t)return"0px";const i=o?Number(o.split("px")[0]):0;let n=Number(t.split("px")[0]);return n=i>n?i:n,n*e<1?"1px":`${Math.round(n*e)}px`}const c=t=>{const{direction:o}=t,{size:i,color:n,type:l}=t.strokeStyle;return function(t,o,i=e.Horizontal,n=!1){const l=i===e.Horizontal,s={},p={};return o=o||"transparent",s.Style0=r.css`
    & {
      border-bottom: ${t} solid ${o};
    }
  `,s.Style1=r.css`
    & {
      border-bottom: ${t} dashed ${o};
    }
  `,s.Style2=r.css`
    & {
      border-bottom: ${t} dotted ${o};
    }
  `,s.Style3=r.css`
    & {
      height: ${t};
      position: relative;
    }
    &:before {
      position: absolute;
      content: '';
      height: ${t};
      left: ${y(t,4)};
      right: 0;
      background-image: repeating-linear-gradient(
        to right,
        ${o} 0,
        ${o} ${y(t,1)},
        transparent 0,
        transparent ${y(t,6)}
      );
    }
    &:after {
      position: absolute;
      content: '';
      height: ${t};
      left: 0;
      right: 0;
      background-image: repeating-linear-gradient(
        to right,
        ${o} 0,
        ${o} ${y(t,3)},
        transparent 0,
        transparent ${y(t,6)}
      );
    }
  `,s.Style6=r.css`
    & {
      height: ${t};
      background-image: repeating-linear-gradient(
        to right,
        ${o} 0,
        ${o} ${y(t,4)},
        transparent 0,
        transparent ${y(t,6)}
      );
    }
  `,s.Style7=r.css`
    & {
      border-color: ${o};
      border-bottom-style: double;
      border-bottom-width: ${n?"4px":t};
    }
  `,s.Style8=r.css`
    & {
      height: ${t};
      min-height: ${n?"6px":"unset"};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: ${y(t,.2,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${y(t,.4,"4px")};
      background: ${o};
    }
  `,s.Style9=r.css`
    & {
      height: ${t};
      min-height: ${n?"6px":"unset"};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: ${y(t,.4,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${y(t,.2,"4px")};
      background: ${o};
    }
  `,s.Style10=r.css`
    & {
      height: ${t};
      min-height: ${n?"8px":"unset"};
      position: relative;
      background-clip: content-box;
      border-top: ${y(t,.167)} solid ${o};
      border-bottom: ${y(t,.167)} solid ${o};
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: ${n?"2px":y(t,.3)};
      background: ${o};
      transform: translateY(-50%);
    }
  `,p.Style0=r.css`
    & {
      border-left: ${t} solid ${o};
    }
  `,p.Style1=r.css`
    & {
      border-left: ${t} dashed ${o};
    }
  `,p.Style2=r.css`
    & {
      border-left: ${t} dotted ${o};
    }
  `,p.Style3=r.css`
    & {
      width: ${t};
      position: relative;
    }
    &:before {
      position: absolute;
      content: '';
      width: ${t};
      top: ${y(t,3.8)};
      bottom: 0;
      background-image: repeating-linear-gradient(
        to bottom,
        ${o} 0,
        ${o} ${y(t,1)},
        transparent 0,
        transparent ${y(t,6)}
      );
    }
    &:after {
      position: absolute;
      content: '';
      width: ${t};
      top: 0;
      bottom: 0;
      background-image: repeating-linear-gradient(
        to bottom,
        ${o} 0,
        ${o} ${y(t,2.5)},
        transparent 0,
        transparent ${y(t,6)}
      );
    }
  `,p.Style6=r.css`
    & {
      width: ${t};
      background-image: repeating-linear-gradient(
        to bottom,
        ${o} 0,
        ${o} ${y(t,4)},
        transparent 0,
        transparent ${y(t,6)}
      );
    }
  `,p.Style7=r.css`
    & {
      border-left: ${t} double ${o};
    }
  `,p.Style8=r.css`
    & {
      width: ${t};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: ${y(t,.2,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: ${y(t,.4,"4px")};
      background: ${o};
    }
  `,p.Style9=r.css`
    & {
      width: ${t};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: ${y(t,.4,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: ${y(t,.2,"4px")};
      background: ${o};
    }
  `,p.Style10=r.css`
    & {
      width: ${t};
      position: relative;
      background-clip: content-box;
      border-left: ${y(t,.167)} solid ${o};
      border-right: ${y(t,.167)} solid ${o};
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: ${n?"2px":y(t,.3)};
      background: ${o};
      transform: translateX(-50%);
    }
  `,l?s:p}(i,n,o)[l]},u=t=>{const{direction:o,pointEnd:n,pointStart:l,strokeStyle:s}=t,p=o===e.Horizontal,a=l.pointStyle,S=l.pointSize*h(null==s?void 0:s.size),d=n.pointStyle,y=n.pointSize*h(null==s?void 0:s.size);return function(t,e,o,i,n){const l=e?i/2+"px":0,s=e?i/2.5+"px":0,p=o?n/2+"px":0,a=o?n/2.5+"px":0,S=r.css`
    left: ${l};
    right: ${p};
    top: 50%;
    transform: translateY(-50%);
    &.point-start-Point1,
    &.point-start-Point2,
    &.point-start-Point5 {
      left: 0;
    }
    &.point-end-Point1,
    &.point-end-Point2,
    &.point-end-Point5 {
      right: 0;
    }
    &.point-start-Point7 {
      left: ${s};
    }
    &.point-end-Point7 {
      right: ${a};
    }
  `,d=r.css`
    top: ${l};
    bottom: ${p};
    left: 50%;
    transform: translateX(-50%);
    &.point-start-Point1,
    &.point-start-Point2,
    &.point-start-Point5 {
      top: 0;
    }
    &.point-end-Point1,
    &.point-end-Point2,
    &.point-end-Point5 {
      bottom: 0;
    }
  `;return t?S:d}(p,a!==i.None,d!==i.None,S,y)},$=(t,o=!0)=>{const{pointEnd:i,pointStart:n,strokeStyle:l,direction:s}=t,p=Number(h(l.size)),a=(o?n.pointSize*p:i.pointSize*p)+"px",S=null==l?void 0:l.color,d=o?n.pointStyle:i.pointStyle,c=function(t,o,i=e.Horizontal,n=!0){const l=y(t,1),s=y(t,.5),p=y(t,.1),a=y(t,.3);o=o||"transparent";const S=i===e.Horizontal;let d={None:"None"},c={None:"None"};d.Point0=r.css`
    & {
      width: ${l};
      height: ${l};
      border-radius: 50%;
      background-color: ${o};
      left: ${n?0:"unset"};
      right: ${n?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,d.Point1=r.css`
    & {
      width: ${a};
      height: ${l};
      background-color: ${o};
      left: ${n?"4%":"unset"};
      right: ${n?"unset":"4%"};
      top: 50%;
      transform: translateY(-50%);
    }
  `,d.Point2=r.css`
    & {
      width: ${a};
      height: ${l};
      background-color: ${o};
      left: ${n?0:"unset"};
      right: ${n?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,d.Point3=r.css`
    & {
      width: ${l};
      height: ${l};
      background-color: ${o};
      left: ${n?0:"unset"};
      right: ${n?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,d.Point4=r.css`
    & {
      width: ${y(t,.71)};
      height: ${y(t,.71)};
      background-color: ${o};
      left: ${n?y(t,.2):"unset"};
      right: ${n?"unset":y(t,.2)};
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
  `;const u=r.css`
    .jimu-rtl & {
      border-color: transparent ${o} transparent transparent;
    }
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: transparent transparent transparent ${o};
      left: ${n?0:"unset"};
      right: ${n?"unset":`-${y(t,.5)}`};
      top: 50%;
      transform: translateY(-50%);
    }
  `,$=r.css`
    .jimu-rtl & {
      border-color: transparent transparent transparent ${o};
    }
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: transparent ${o} transparent transparent;
      left: ${n?`-${y(t,.5)}`:"unset"};
      right: ${n?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,h=r.css`
    .jimu-rtl & {
      border-top: ${a} solid ${o};
      border-left: ${a} solid ${o};
    }
    .jimu-ltr & {
      border-bottom: ${a} solid ${o};
      border-left: ${a} solid ${o};
    }
    & {
      width: ${y(t,.8)};
      height: ${y(t,.8)};
      left: ${n?`${y(t,.2)}`:"unset"};
      right: ${n?"unset":`-${y(t,.2)}`};
      top: 50%;
      border-radius: ${p};
      transform: translateY(-50%) rotate(45deg);
    }
  `,g=r.css`
    .jimu-rtl & {
      border-right: ${a} solid ${o};
      border-bottom: ${a} solid ${o};
    }
    .jimu-ltr & {
      border-top: ${a} solid ${o};
      border-right: ${a} solid ${o};
    }
    & {
      width: ${y(t,.8)};
      height: ${y(t,.8)};
      left: ${n?`-${y(t,.2)}`:"unset"};
      right: ${n?"unset":`${y(t,.2)}`};
      top: 50%;
      border-radius: ${p};
      transform: translateY(-50%) rotate(45deg);
    }
  `;c.Point0=r.css`
    & {
      width: ${l};
      height: ${l};
      border-radius: 50%;
      background-color: ${o};
      top: ${n?0:"unset"};
      bottom: ${n?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point1=r.css`
    & {
      width: ${l};
      height: ${a};
      background-color: ${o};
      top: ${n?"4%":"unset"};
      bottom: ${n?"unset":"4%"};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point2=r.css`
    & {
      width: ${l};
      height: ${a};
      background-color: ${o};
      top: ${n?0:"unset"};
      bottom: ${n?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point3=r.css`
    & {
      width: ${l};
      height: ${l};
      background-color: ${o};
      top: ${n?0:"unset"};
      bottom: ${n?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point4=r.css`
    & {
      width: ${y(t,.71)};
      height: ${y(t,.71)};
      background-color: ${o};
      top: ${n?y(t,.2):"unset"};
      bottom: ${n?"unset":y(t,.2)};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }
  `;const b=r.css`
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: transparent transparent ${o} transparent;
      top: ${n?`-${y(t,.5)}`:"unset"};
      bottom: ${n?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,m=r.css`
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: ${o} transparent transparent transparent;
      top: ${n?0:"unset"};
      bottom: ${n?"unset":`-${y(t,.5)}`};
      left: 50%;
      transform: translateX(-50%);
    }
  `,f=r.css`
    .jimu-rtl & {
      border-bottom: ${a} solid ${o};
      border-left: ${a} solid ${o};
    }
    .jimu-ltr & {
      border-bottom: ${a} solid ${o};
      border-right: ${a} solid ${o};
    }
    & {
      width: ${y(t,.8)};
      height: ${y(t,.8)};
      top: ${n?`-${y(t,.2)}`:"unset"};
      bottom: ${n?"unset":`${y(t,.2)}`};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-radius: ${p};
    }
  `,k=r.css`
    .jimu-rtl & {
      border-top: ${a} solid ${o};
      border-right: ${a} solid ${o};
    }
    .jimu-ltr & {
      border-top: ${a} solid ${o};
      border-left: ${a} solid ${o};
    }
    & {
      width: ${y(t,.8)};
      height: ${y(t,.8)};
      top: ${n?`${y(t,.2)}`:"unset"};
      bottom: ${n?"unset":`-${y(t,.2)}`};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-radius: ${p};
    }
  `;let P,z;return n?(P={Point5:u,Point6:$,Point7:h,Point8:g},z={Point5:m,Point6:b,Point7:k,Point8:f}):(P={Point5:$,Point6:u,Point7:g,Point8:h},z={Point5:b,Point6:m,Point7:f,Point8:k}),d=Object.assign(Object.assign({},d),P),c=Object.assign(Object.assign({},c),z),S?d:c}(a,S,s,o);return c[d]},h=t=>{const e=t.split("px")[0];return Number(e)},g=(0,r.injectIntl)((t=>{const{widgetId:l}=t,s=r.ReactRedux.useSelector((t=>{var e,o,i;const n=(null===(e=null==t?void 0:t.appStateInBuilder)||void 0===e?void 0:e.appConfig)||t.appConfig;return null===(i=null===(o=null==n?void 0:n.widgets)||void 0===o?void 0:o[l])||void 0===i?void 0:i.config})),y=r.hooks.useTranslation(d),h=(0,S.useTheme)(),g=(0,S.useTheme2)(),b=(0,S.useUseTheme2)(),m=window.jimuConfig.isBuilder!==b?g:h,f=window.jimuConfig.isBuilder!==b?h:g,k=r.hooks.useEventCallback((t=>{t.direction=s.direction||e.Horizontal,(0,p.getAppConfigAction)().editWidgetConfig(l,(0,r.Immutable)(t)).exec()}));return(0,r.jsx)("div",null,(0,r.jsx)("div",{css:r.css`
      width: ${r.polished.rem(360)};
      padding: 16px 12px 8px 12px;
      z-index: 1001 !important;
      button {
        border-radius: 0;
      }
      .quick-style-item-container {
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 8px;
      }
      .quick-style-item {
        border: 2px solid transparent;
        &.quick-style-item-selected {
          border: 2px solid ${f.sys.color.primary.light};
        }
        .quick-style-item-inner {
          background-color: ${m.ref.palette.neutral[300]};
          cursor: pointer;
        }
      }
    `},(0,r.jsx)("div",{className:"row no-gutters"},(0,r.jsx)(S.ThemeSwitchComponent,{useTheme2:!1},(()=>{var t;const l=null===(t=null==s?void 0:s.themeStyle)||void 0===t?void 0:t.quickStyleType,p=[],S=function(t){const r="3px",l="6px",s=e.Horizontal;return{Default:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1200],size:r},pointStart:{pointStyle:i.None,pointSize:4},pointEnd:{pointStyle:i.None,pointSize:4},themeStyle:{quickStyleType:n.Default}},Style1:{direction:s,strokeStyle:{type:o.Style2,color:t.sys.color.error.dark,size:r},pointStart:{pointStyle:i.None,pointSize:4},pointEnd:{pointStyle:i.None,pointSize:4},themeStyle:{quickStyleType:n.Style1}},Style2:{direction:s,strokeStyle:{type:o.Style3,color:t.sys.color.warning.dark,size:r},pointStart:{pointStyle:i.None,pointSize:4},pointEnd:{pointStyle:i.None,pointSize:4},themeStyle:{quickStyleType:n.Style2}},Style3:{direction:s,strokeStyle:{type:o.Style6,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:i.None,pointSize:4},pointEnd:{pointStyle:i.None,pointSize:4},themeStyle:{quickStyleType:n.Style3}},Style4:{direction:s,strokeStyle:{type:o.Style1,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:i.None,pointSize:4},pointEnd:{pointStyle:i.None,pointSize:4},themeStyle:{quickStyleType:n.Style4}},Style5:{direction:s,strokeStyle:{type:o.Style7,color:t.sys.color.info.main,size:l},pointStart:{pointStyle:i.None,pointSize:4},pointEnd:{pointStyle:i.None,pointSize:4},themeStyle:{quickStyleType:n.Style5}},Style6:{direction:s,strokeStyle:{type:o.Style8,color:t.sys.color.success.dark,size:l},pointStart:{pointStyle:i.None,pointSize:4},pointEnd:{pointStyle:i.None,pointSize:4},themeStyle:{quickStyleType:n.Style6}},Style7:{direction:s,strokeStyle:{type:o.Style9,color:t.ref.palette.neutral[1100],size:l},pointStart:{pointStyle:i.None,pointSize:4},pointEnd:{pointStyle:i.None,pointSize:4},themeStyle:{quickStyleType:n.Style7}},Style18:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:i.None,pointSize:4},pointEnd:{pointStyle:i.Point7,pointSize:4},themeStyle:{quickStyleType:n.Style18}},Style19:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.info.main,size:r},pointStart:{pointStyle:i.Point0,pointSize:2},pointEnd:{pointStyle:i.Point6,pointSize:4},themeStyle:{quickStyleType:n.Style19}},Style8:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:i.Point3,pointSize:4},pointEnd:{pointStyle:i.Point3,pointSize:4},themeStyle:{quickStyleType:n.Style8}},Style9:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.warning.dark,size:r},pointStart:{pointStyle:i.Point6,pointSize:4},pointEnd:{pointStyle:i.Point6,pointSize:4},themeStyle:{quickStyleType:n.Style9}},Style10:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.error.dark,size:r},pointStart:{pointStyle:i.Point4,pointSize:4},pointEnd:{pointStyle:i.Point4,pointSize:4},themeStyle:{quickStyleType:n.Style10}},Style11:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:i.Point5,pointSize:4},pointEnd:{pointStyle:i.Point5,pointSize:4},themeStyle:{quickStyleType:n.Style11}},Style12:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:i.Point2,pointSize:4},pointEnd:{pointStyle:i.Point2,pointSize:4},themeStyle:{quickStyleType:n.Style12}},Style13:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.success.dark,size:r},pointStart:{pointStyle:i.Point7,pointSize:4},pointEnd:{pointStyle:i.Point7,pointSize:4},themeStyle:{quickStyleType:n.Style13}},Style14:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.info.main,size:r},pointStart:{pointStyle:i.Point0,pointSize:4},pointEnd:{pointStyle:i.Point0,pointSize:4},themeStyle:{quickStyleType:n.Style14}},Style15:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:i.Point8,pointSize:4},pointEnd:{pointStyle:i.Point8,pointSize:4},themeStyle:{quickStyleType:n.Style15}},Style16:{direction:s,strokeStyle:{type:o.Style10,color:t.ref.palette.neutral[1100],size:"8px"},pointStart:{pointStyle:i.None,pointSize:4},pointEnd:{pointStyle:i.None,pointSize:4},themeStyle:{quickStyleType:n.Style16}},Style17:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.error.dark,size:r},pointStart:{pointStyle:i.Point1,pointSize:4},pointEnd:{pointStyle:i.Point1,pointSize:4},themeStyle:{quickStyleType:n.Style17}}}}(m);let d=0;for(const t in S){d+=1;const e=S[t],{pointStart:o,pointEnd:n,themeStyle:s}=e,h=c(e),g=u(e),b=$(e,!0),m=$(e,!1),f=(0,r.classNames)("divider-line","position-absolute",`point-start-${o.pointStyle}`,`point-end-${n.pointStyle}`),P=(0,r.jsx)("div",{key:t,className:"col-6 quick-style-item-container"},(0,r.jsx)("div",{className:(0,r.classNames)("quick-style-item",{"quick-style-item-selected":l===s.quickStyleType})},(0,r.jsx)(a.Button,{className:"quick-style-item-inner p-2 w-100",onClick:()=>{k(e)},disableHoverEffect:!0,disableRipple:!0,type:"tertiary",title:y("quickStyleItem",{index:d})},(0,r.jsx)("div",{className:"quick-style-item-inner w-100 p-2 position-relative"},o.pointStyle!==i.None&&(0,r.jsx)("span",{className:"point-start position-absolute",css:b}),(0,r.jsx)("div",{className:f,css:[h,g]}),n.pointStyle!==i.None&&(0,r.jsx)("span",{className:"point-end position-absolute",css:m})))));p.push(P)}return p})()))))}));class b{constructor(){this.index=2,this.id="button-quick-style",this.openWhenAdded=!0}visible(t){return!0}getAppState(){const t=(0,r.getAppStore)().getState();return t.appStateInBuilder?t.appStateInBuilder:t}getGroupId(){return null}getTitle(){const t=r.i18n.getIntl("_jimu");return t?t.formatMessage({id:"quickStyle",defaultMessage:a.defaultMessages.quickStyle}):"Quick style"}getIcon(){return l(63655)}checked(){if(this.getAppState().browserSizeMode===r.BrowserSizeMode.Small)return this.isOpenInSidePanel}widgetToolbarStateChange(t){window.jimuConfig.isBuilder?p.builderAppSync.publishWidgetToolbarStateChangeToApp(t,["button-quick-style"]):(0,r.getAppStore)().dispatch(r.appActions.widgetToolbarStateChange(t,["button-quick-style"]))}onClick(t){const e=t.layoutItem.widgetId;if(this.getAppState().browserSizeMode===r.BrowserSizeMode.Small){this.isOpenInSidePanel=!this.isOpenInSidePanel;const t=()=>{this.isOpenInSidePanel=!1,this.widgetToolbarStateChange(e)};p.appBuilderSync.publishSidePanelToApp({type:"dividerQuickStyle",widgetId:e,uri:"widgets/common/divider/",onClose:t,active:this.isOpenInSidePanel})}}getSettingPanel(t){return this.getAppState().browserSizeMode===r.BrowserSizeMode.Small?null:g}}})(),s})())}}}));