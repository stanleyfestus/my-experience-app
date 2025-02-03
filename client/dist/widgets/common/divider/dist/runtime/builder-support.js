System.register(["jimu-core","jimu-ui","jimu-theme","jimu-for-builder"],(function(t,e){var o={},i={},n={},r={};return{setters:[function(t){o.Immutable=t.Immutable,o.ReactRedux=t.ReactRedux,o.classNames=t.classNames,o.css=t.css,o.hooks=t.hooks,o.injectIntl=t.injectIntl,o.jsx=t.jsx,o.polished=t.polished},function(t){i.Button=t.Button},function(t){n.ThemeSwitchComponent=t.ThemeSwitchComponent,n.useTheme=t.useTheme,n.useTheme2=t.useTheme2,n.useUseTheme2=t.useUseTheme2},function(t){r.appBuilderSync=t.appBuilderSync,r.getAppConfigAction=t.getAppConfigAction}],execute:function(){t((()=>{"use strict";var t={79244:t=>{t.exports=o},4108:t=>{t.exports=r},1888:t=>{t.exports=n},14321:t=>{t.exports=i}},e={};function l(o){var i=e[o];if(void 0!==i)return i.exports;var n=e[o]={exports:{}};return t[o](n,n.exports,l),n.exports}l.d=(t,e)=>{for(var o in e)l.o(e,o)&&!l.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},l.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),l.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var s={};l.r(s),l.d(s,{default:()=>x});var p,a,y,S,d,c=l(79244);!function(t){t.Regular="REGULAR",t.Hover="HOVER"}(p||(p={})),function(t){t.Horizontal="Horizontal",t.Vertical="Vertical"}(a||(a={})),function(t){t.Style0="Style0",t.Style1="Style1",t.Style2="Style2",t.Style3="Style3",t.Style4="Style4",t.Style5="Style5",t.Style6="Style6",t.Style7="Style7",t.Style8="Style8",t.Style9="Style9",t.Style10="Style10"}(y||(y={})),function(t){t.None="None",t.Point0="Point0",t.Point1="Point1",t.Point2="Point2",t.Point3="Point3",t.Point4="Point4",t.Point5="Point5",t.Point6="Point6",t.Point7="Point7",t.Point8="Point8"}(S||(S={})),function(t){t.None="None",t.Default="Default",t.Style1="Style1",t.Style2="Style2",t.Style3="Style3",t.Style4="Style4",t.Style5="Style5",t.Style6="Style6",t.Style7="Style7",t.Style8="Style8",t.Style9="Style9",t.Style10="Style10",t.Style11="Style11",t.Style12="Style12",t.Style13="Style13",t.Style14="Style14",t.Style15="Style15",t.Style16="Style16",t.Style17="Style17",t.Style18="Style18",t.Style19="Style19"}(d||(d={}));var u=l(14321),$=l(1888);const h={_widgetLabel:"Divider",quickStyleItem:"Quick style {index}"};function b(t,e=1.5,o=null){if(!t)return"0px";const i=o?Number(o.split("px")[0]):0;let n=Number(t.split("px")[0]);return n=i>n?i:n,n*e<1?"1px":`${Math.round(n*e)}px`}const m=t=>{const{direction:e}=t,{size:o,color:i,type:n}=t.strokeStyle;return function(t,e,o=a.Horizontal,i=!1){const n=o===a.Horizontal,r={},l={};return e=e||"transparent",r.Style0=c.css`
    & {
      border-bottom: ${t} solid ${e};
    }
  `,r.Style1=c.css`
    & {
      border-bottom: ${t} dashed ${e};
    }
  `,r.Style2=c.css`
    & {
      border-bottom: ${t} dotted ${e};
    }
  `,r.Style3=c.css`
    & {
      height: ${t};
      position: relative;
    }
    &:before {
      position: absolute;
      content: '';
      height: ${t};
      left: ${b(t,4)};
      right: 0;
      background-image: repeating-linear-gradient(
        to right,
        ${e} 0,
        ${e} ${b(t,1)},
        transparent 0,
        transparent ${b(t,6)}
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
        ${e} 0,
        ${e} ${b(t,3)},
        transparent 0,
        transparent ${b(t,6)}
      );
    }
  `,r.Style6=c.css`
    & {
      height: ${t};
      background-image: repeating-linear-gradient(
        to right,
        ${e} 0,
        ${e} ${b(t,4)},
        transparent 0,
        transparent ${b(t,6)}
      );
    }
  `,r.Style7=c.css`
    & {
      border-color: ${e};
      border-bottom-style: double;
      border-bottom-width: ${i?"4px":t};
    }
  `,r.Style8=c.css`
    & {
      height: ${t};
      min-height: ${i?"6px":"unset"};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: ${b(t,.2,"4px")};
      background: ${e};
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${b(t,.4,"4px")};
      background: ${e};
    }
  `,r.Style9=c.css`
    & {
      height: ${t};
      min-height: ${i?"6px":"unset"};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: ${b(t,.4,"4px")};
      background: ${e};
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${b(t,.2,"4px")};
      background: ${e};
    }
  `,r.Style10=c.css`
    & {
      height: ${t};
      min-height: ${i?"8px":"unset"};
      position: relative;
      background-clip: content-box;
      border-top: ${b(t,.167)} solid ${e};
      border-bottom: ${b(t,.167)} solid ${e};
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: ${i?"2px":b(t,.3)};
      background: ${e};
      transform: translateY(-50%);
    }
  `,l.Style0=c.css`
    & {
      border-left: ${t} solid ${e};
    }
  `,l.Style1=c.css`
    & {
      border-left: ${t} dashed ${e};
    }
  `,l.Style2=c.css`
    & {
      border-left: ${t} dotted ${e};
    }
  `,l.Style3=c.css`
    & {
      width: ${t};
      position: relative;
    }
    &:before {
      position: absolute;
      content: '';
      width: ${t};
      top: ${b(t,3.8)};
      bottom: 0;
      background-image: repeating-linear-gradient(
        to bottom,
        ${e} 0,
        ${e} ${b(t,1)},
        transparent 0,
        transparent ${b(t,6)}
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
        ${e} 0,
        ${e} ${b(t,2.5)},
        transparent 0,
        transparent ${b(t,6)}
      );
    }
  `,l.Style6=c.css`
    & {
      width: ${t};
      background-image: repeating-linear-gradient(
        to bottom,
        ${e} 0,
        ${e} ${b(t,4)},
        transparent 0,
        transparent ${b(t,6)}
      );
    }
  `,l.Style7=c.css`
    & {
      border-left: ${t} double ${e};
    }
  `,l.Style8=c.css`
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
      width: ${b(t,.2,"4px")};
      background: ${e};
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: ${b(t,.4,"4px")};
      background: ${e};
    }
  `,l.Style9=c.css`
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
      width: ${b(t,.4,"4px")};
      background: ${e};
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: ${b(t,.2,"4px")};
      background: ${e};
    }
  `,l.Style10=c.css`
    & {
      width: ${t};
      position: relative;
      background-clip: content-box;
      border-left: ${b(t,.167)} solid ${e};
      border-right: ${b(t,.167)} solid ${e};
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: ${i?"2px":b(t,.3)};
      background: ${e};
      transform: translateX(-50%);
    }
  `,n?r:l}(o,i,e)[n]},g=t=>{const{direction:e,pointEnd:o,pointStart:i,strokeStyle:n}=t,r=e===a.Horizontal,l=i.pointStyle,s=i.pointSize*k(null==n?void 0:n.size),p=o.pointStyle,y=o.pointSize*k(null==n?void 0:n.size);return function(t,e,o,i,n){const r=e?i/2+"px":0,l=e?i/2.5+"px":0,s=o?n/2+"px":0,p=o?n/2.5+"px":0,a=c.css`
    left: ${r};
    right: ${s};
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
      left: ${l};
    }
    &.point-end-Point7 {
      right: ${p};
    }
  `,y=c.css`
    top: ${r};
    bottom: ${s};
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
  `;return t?a:y}(r,l!==S.None,p!==S.None,s,y)},f=(t,e=!0)=>{const{pointEnd:o,pointStart:i,strokeStyle:n,direction:r}=t,l=Number(k(n.size)),s=(e?i.pointSize*l:o.pointSize*l)+"px",p=null==n?void 0:n.color,y=e?i.pointStyle:o.pointStyle,S=function(t,e,o=a.Horizontal,i=!0){const n=b(t,1),r=b(t,.5),l=b(t,.1),s=b(t,.3);e=e||"transparent";const p=o===a.Horizontal;let y={None:"None"},S={None:"None"};y.Point0=c.css`
    & {
      width: ${n};
      height: ${n};
      border-radius: 50%;
      background-color: ${e};
      left: ${i?0:"unset"};
      right: ${i?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,y.Point1=c.css`
    & {
      width: ${s};
      height: ${n};
      background-color: ${e};
      left: ${i?"4%":"unset"};
      right: ${i?"unset":"4%"};
      top: 50%;
      transform: translateY(-50%);
    }
  `,y.Point2=c.css`
    & {
      width: ${s};
      height: ${n};
      background-color: ${e};
      left: ${i?0:"unset"};
      right: ${i?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,y.Point3=c.css`
    & {
      width: ${n};
      height: ${n};
      background-color: ${e};
      left: ${i?0:"unset"};
      right: ${i?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,y.Point4=c.css`
    & {
      width: ${b(t,.71)};
      height: ${b(t,.71)};
      background-color: ${e};
      left: ${i?b(t,.2):"unset"};
      right: ${i?"unset":b(t,.2)};
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
  `;const d=c.css`
    .jimu-rtl & {
      border-color: transparent ${e} transparent transparent;
    }
    & {
      width: 0;
      height: 0;
      border-width: ${r};
      border-style: solid;
      border-color: transparent transparent transparent ${e};
      left: ${i?0:"unset"};
      right: ${i?"unset":`-${b(t,.5)}`};
      top: 50%;
      transform: translateY(-50%);
    }
  `,u=c.css`
    .jimu-rtl & {
      border-color: transparent transparent transparent ${e};
    }
    & {
      width: 0;
      height: 0;
      border-width: ${r};
      border-style: solid;
      border-color: transparent ${e} transparent transparent;
      left: ${i?`-${b(t,.5)}`:"unset"};
      right: ${i?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,$=c.css`
    .jimu-rtl & {
      border-top: ${s} solid ${e};
      border-left: ${s} solid ${e};
    }
    .jimu-ltr & {
      border-bottom: ${s} solid ${e};
      border-left: ${s} solid ${e};
    }
    & {
      width: ${b(t,.8)};
      height: ${b(t,.8)};
      left: ${i?`${b(t,.2)}`:"unset"};
      right: ${i?"unset":`-${b(t,.2)}`};
      top: 50%;
      border-radius: ${l};
      transform: translateY(-50%) rotate(45deg);
    }
  `,h=c.css`
    .jimu-rtl & {
      border-right: ${s} solid ${e};
      border-bottom: ${s} solid ${e};
    }
    .jimu-ltr & {
      border-top: ${s} solid ${e};
      border-right: ${s} solid ${e};
    }
    & {
      width: ${b(t,.8)};
      height: ${b(t,.8)};
      left: ${i?`-${b(t,.2)}`:"unset"};
      right: ${i?"unset":`${b(t,.2)}`};
      top: 50%;
      border-radius: ${l};
      transform: translateY(-50%) rotate(45deg);
    }
  `;S.Point0=c.css`
    & {
      width: ${n};
      height: ${n};
      border-radius: 50%;
      background-color: ${e};
      top: ${i?0:"unset"};
      bottom: ${i?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,S.Point1=c.css`
    & {
      width: ${n};
      height: ${s};
      background-color: ${e};
      top: ${i?"4%":"unset"};
      bottom: ${i?"unset":"4%"};
      left: 50%;
      transform: translateX(-50%);
    }
  `,S.Point2=c.css`
    & {
      width: ${n};
      height: ${s};
      background-color: ${e};
      top: ${i?0:"unset"};
      bottom: ${i?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,S.Point3=c.css`
    & {
      width: ${n};
      height: ${n};
      background-color: ${e};
      top: ${i?0:"unset"};
      bottom: ${i?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,S.Point4=c.css`
    & {
      width: ${b(t,.71)};
      height: ${b(t,.71)};
      background-color: ${e};
      top: ${i?b(t,.2):"unset"};
      bottom: ${i?"unset":b(t,.2)};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }
  `;const m=c.css`
    & {
      width: 0;
      height: 0;
      border-width: ${r};
      border-style: solid;
      border-color: transparent transparent ${e} transparent;
      top: ${i?`-${b(t,.5)}`:"unset"};
      bottom: ${i?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,g=c.css`
    & {
      width: 0;
      height: 0;
      border-width: ${r};
      border-style: solid;
      border-color: ${e} transparent transparent transparent;
      top: ${i?0:"unset"};
      bottom: ${i?"unset":`-${b(t,.5)}`};
      left: 50%;
      transform: translateX(-50%);
    }
  `,f=c.css`
    .jimu-rtl & {
      border-bottom: ${s} solid ${e};
      border-left: ${s} solid ${e};
    }
    .jimu-ltr & {
      border-bottom: ${s} solid ${e};
      border-right: ${s} solid ${e};
    }
    & {
      width: ${b(t,.8)};
      height: ${b(t,.8)};
      top: ${i?`-${b(t,.2)}`:"unset"};
      bottom: ${i?"unset":`${b(t,.2)}`};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-radius: ${l};
    }
  `,k=c.css`
    .jimu-rtl & {
      border-top: ${s} solid ${e};
      border-right: ${s} solid ${e};
    }
    .jimu-ltr & {
      border-top: ${s} solid ${e};
      border-left: ${s} solid ${e};
    }
    & {
      width: ${b(t,.8)};
      height: ${b(t,.8)};
      top: ${i?`${b(t,.2)}`:"unset"};
      bottom: ${i?"unset":`-${b(t,.2)}`};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-radius: ${l};
    }
  `;let P,z;return i?(P={Point5:d,Point6:u,Point7:$,Point8:h},z={Point5:g,Point6:m,Point7:k,Point8:f}):(P={Point5:u,Point6:d,Point7:h,Point8:$},z={Point5:m,Point6:g,Point7:f,Point8:k}),y=Object.assign(Object.assign({},y),P),S=Object.assign(Object.assign({},S),z),p?y:S}(s,p,r,e);return S[y]},k=t=>{const e=t.split("px")[0];return Number(e)};var P=l(4108);const z=(0,c.injectIntl)((t=>{const{widgetId:e}=t,o=c.ReactRedux.useSelector((t=>{var o,i,n;const r=(null===(o=null==t?void 0:t.appStateInBuilder)||void 0===o?void 0:o.appConfig)||t.appConfig;return null===(n=null===(i=null==r?void 0:r.widgets)||void 0===i?void 0:i[e])||void 0===n?void 0:n.config})),i=c.hooks.useTranslation(h),n=(0,$.useTheme)(),r=(0,$.useTheme2)(),l=(0,$.useUseTheme2)(),s=window.jimuConfig.isBuilder!==l?r:n,p=window.jimuConfig.isBuilder!==l?n:r,b=c.hooks.useEventCallback((t=>{t.direction=o.direction||a.Horizontal,(0,P.getAppConfigAction)().editWidgetConfig(e,(0,c.Immutable)(t)).exec()}));return(0,c.jsx)("div",null,(0,c.jsx)("div",{css:c.css`
      width: ${c.polished.rem(360)};
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
          border: 2px solid ${p.sys.color.primary.light};
        }
        .quick-style-item-inner {
          background-color: ${s.ref.palette.neutral[300]};
          cursor: pointer;
        }
      }
    `},(0,c.jsx)("div",{className:"row no-gutters"},(0,c.jsx)($.ThemeSwitchComponent,{useTheme2:!1},(()=>{var t;const e=null===(t=null==o?void 0:o.themeStyle)||void 0===t?void 0:t.quickStyleType,n=[],r=function(t){const e="3px",o="6px",i=a.Horizontal;return{Default:{direction:i,strokeStyle:{type:y.Style0,color:t.ref.palette.neutral[1200],size:e},pointStart:{pointStyle:S.None,pointSize:4},pointEnd:{pointStyle:S.None,pointSize:4},themeStyle:{quickStyleType:d.Default}},Style1:{direction:i,strokeStyle:{type:y.Style2,color:t.sys.color.error.dark,size:e},pointStart:{pointStyle:S.None,pointSize:4},pointEnd:{pointStyle:S.None,pointSize:4},themeStyle:{quickStyleType:d.Style1}},Style2:{direction:i,strokeStyle:{type:y.Style3,color:t.sys.color.warning.dark,size:e},pointStart:{pointStyle:S.None,pointSize:4},pointEnd:{pointStyle:S.None,pointSize:4},themeStyle:{quickStyleType:d.Style2}},Style3:{direction:i,strokeStyle:{type:y.Style6,color:t.ref.palette.neutral[1100],size:e},pointStart:{pointStyle:S.None,pointSize:4},pointEnd:{pointStyle:S.None,pointSize:4},themeStyle:{quickStyleType:d.Style3}},Style4:{direction:i,strokeStyle:{type:y.Style1,color:t.ref.palette.neutral[1100],size:e},pointStart:{pointStyle:S.None,pointSize:4},pointEnd:{pointStyle:S.None,pointSize:4},themeStyle:{quickStyleType:d.Style4}},Style5:{direction:i,strokeStyle:{type:y.Style7,color:t.sys.color.info.main,size:o},pointStart:{pointStyle:S.None,pointSize:4},pointEnd:{pointStyle:S.None,pointSize:4},themeStyle:{quickStyleType:d.Style5}},Style6:{direction:i,strokeStyle:{type:y.Style8,color:t.sys.color.success.dark,size:o},pointStart:{pointStyle:S.None,pointSize:4},pointEnd:{pointStyle:S.None,pointSize:4},themeStyle:{quickStyleType:d.Style6}},Style7:{direction:i,strokeStyle:{type:y.Style9,color:t.ref.palette.neutral[1100],size:o},pointStart:{pointStyle:S.None,pointSize:4},pointEnd:{pointStyle:S.None,pointSize:4},themeStyle:{quickStyleType:d.Style7}},Style18:{direction:i,strokeStyle:{type:y.Style0,color:t.ref.palette.neutral[1100],size:e},pointStart:{pointStyle:S.None,pointSize:4},pointEnd:{pointStyle:S.Point7,pointSize:4},themeStyle:{quickStyleType:d.Style18}},Style19:{direction:i,strokeStyle:{type:y.Style0,color:t.sys.color.info.main,size:e},pointStart:{pointStyle:S.Point0,pointSize:2},pointEnd:{pointStyle:S.Point6,pointSize:4},themeStyle:{quickStyleType:d.Style19}},Style8:{direction:i,strokeStyle:{type:y.Style0,color:t.ref.palette.neutral[1100],size:e},pointStart:{pointStyle:S.Point3,pointSize:4},pointEnd:{pointStyle:S.Point3,pointSize:4},themeStyle:{quickStyleType:d.Style8}},Style9:{direction:i,strokeStyle:{type:y.Style0,color:t.sys.color.warning.dark,size:e},pointStart:{pointStyle:S.Point6,pointSize:4},pointEnd:{pointStyle:S.Point6,pointSize:4},themeStyle:{quickStyleType:d.Style9}},Style10:{direction:i,strokeStyle:{type:y.Style0,color:t.sys.color.error.dark,size:e},pointStart:{pointStyle:S.Point4,pointSize:4},pointEnd:{pointStyle:S.Point4,pointSize:4},themeStyle:{quickStyleType:d.Style10}},Style11:{direction:i,strokeStyle:{type:y.Style0,color:t.ref.palette.neutral[1100],size:e},pointStart:{pointStyle:S.Point5,pointSize:4},pointEnd:{pointStyle:S.Point5,pointSize:4},themeStyle:{quickStyleType:d.Style11}},Style12:{direction:i,strokeStyle:{type:y.Style0,color:t.ref.palette.neutral[1100],size:e},pointStart:{pointStyle:S.Point2,pointSize:4},pointEnd:{pointStyle:S.Point2,pointSize:4},themeStyle:{quickStyleType:d.Style12}},Style13:{direction:i,strokeStyle:{type:y.Style0,color:t.sys.color.success.dark,size:e},pointStart:{pointStyle:S.Point7,pointSize:4},pointEnd:{pointStyle:S.Point7,pointSize:4},themeStyle:{quickStyleType:d.Style13}},Style14:{direction:i,strokeStyle:{type:y.Style0,color:t.sys.color.info.main,size:e},pointStart:{pointStyle:S.Point0,pointSize:4},pointEnd:{pointStyle:S.Point0,pointSize:4},themeStyle:{quickStyleType:d.Style14}},Style15:{direction:i,strokeStyle:{type:y.Style0,color:t.ref.palette.neutral[1100],size:e},pointStart:{pointStyle:S.Point8,pointSize:4},pointEnd:{pointStyle:S.Point8,pointSize:4},themeStyle:{quickStyleType:d.Style15}},Style16:{direction:i,strokeStyle:{type:y.Style10,color:t.ref.palette.neutral[1100],size:"8px"},pointStart:{pointStyle:S.None,pointSize:4},pointEnd:{pointStyle:S.None,pointSize:4},themeStyle:{quickStyleType:d.Style16}},Style17:{direction:i,strokeStyle:{type:y.Style0,color:t.sys.color.error.dark,size:e},pointStart:{pointStyle:S.Point1,pointSize:4},pointEnd:{pointStyle:S.Point1,pointSize:4},themeStyle:{quickStyleType:d.Style17}}}}(s);let l=0;for(const t in r){l+=1;const o=r[t],{pointStart:s,pointEnd:p,themeStyle:a}=o,y=m(o),d=g(o),$=f(o,!0),h=f(o,!1),k=(0,c.classNames)("divider-line","position-absolute",`point-start-${s.pointStyle}`,`point-end-${p.pointStyle}`),P=(0,c.jsx)("div",{key:t,className:"col-6 quick-style-item-container"},(0,c.jsx)("div",{className:(0,c.classNames)("quick-style-item",{"quick-style-item-selected":e===a.quickStyleType})},(0,c.jsx)(u.Button,{className:"quick-style-item-inner p-2 w-100",onClick:()=>{b(o)},disableHoverEffect:!0,disableRipple:!0,type:"tertiary",title:i("quickStyleItem",{index:l})},(0,c.jsx)("div",{className:"quick-style-item-inner w-100 p-2 position-relative"},s.pointStyle!==S.None&&(0,c.jsx)("span",{className:"point-start position-absolute",css:$}),(0,c.jsx)("div",{className:k,css:[y,d]}),p.pointStyle!==S.None&&(0,c.jsx)("span",{className:"point-end position-absolute",css:h})))));n.push(P)}return n})()))))})),x={appBuilderSync:P.appBuilderSync,QuickStyle:z};return s})())}}}));