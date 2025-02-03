System.register(["jimu-core"],(function(t,e){var o={};return{setters:[function(t){o.Immutable=t.Immutable,o.React=t.React,o.classNames=t.classNames,o.css=t.css,o.jsx=t.jsx}],execute:function(){t((()=>{var t={79244:t=>{"use strict";t.exports=o}},e={};function n(o){var r=e[o];if(void 0!==r)return r.exports;var i=e[o]={exports:{}};return t[o](i,i.exports,n),i.exports}n.d=(t,e)=>{for(var o in e)n.o(e,o)&&!n.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.p="";var r={};return n.p=window.jimuConfig.baseUrl,(()=>{"use strict";n.r(r),n.d(r,{Widget:()=>c,__set_webpack_public_path__:()=>h,default:()=>b});var t,e,o,i,s,a=n(79244);function l(t,e=1.5,o=null){if(!t)return"0px";const n=o?Number(o.split("px")[0]):0;let r=Number(t.split("px")[0]);return r=n>r?n:r,r*e<1?"1px":`${Math.round(r*e)}px`}!function(t){t.Regular="REGULAR",t.Hover="HOVER"}(t||(t={})),function(t){t.Horizontal="Horizontal",t.Vertical="Vertical"}(e||(e={})),function(t){t.Style0="Style0",t.Style1="Style1",t.Style2="Style2",t.Style3="Style3",t.Style4="Style4",t.Style5="Style5",t.Style6="Style6",t.Style7="Style7",t.Style8="Style8",t.Style9="Style9",t.Style10="Style10"}(o||(o={})),function(t){t.None="None",t.Point0="Point0",t.Point1="Point1",t.Point2="Point2",t.Point3="Point3",t.Point4="Point4",t.Point5="Point5",t.Point6="Point6",t.Point7="Point7",t.Point8="Point8"}(i||(i={})),function(t){t.None="None",t.Default="Default",t.Style1="Style1",t.Style2="Style2",t.Style3="Style3",t.Style4="Style4",t.Style5="Style5",t.Style6="Style6",t.Style7="Style7",t.Style8="Style8",t.Style9="Style9",t.Style10="Style10",t.Style11="Style11",t.Style12="Style12",t.Style13="Style13",t.Style14="Style14",t.Style15="Style15",t.Style16="Style16",t.Style17="Style17",t.Style18="Style18",t.Style19="Style19"}(s||(s={}));const d=t=>{const{direction:o}=t,{size:n,color:r,type:i}=t.strokeStyle;return function(t,o,n=e.Horizontal,r=!1){const i=n===e.Horizontal,s={},d={};return o=o||"transparent",s.Style0=a.css`
    & {
      border-bottom: ${t} solid ${o};
    }
  `,s.Style1=a.css`
    & {
      border-bottom: ${t} dashed ${o};
    }
  `,s.Style2=a.css`
    & {
      border-bottom: ${t} dotted ${o};
    }
  `,s.Style3=a.css`
    & {
      height: ${t};
      position: relative;
    }
    &:before {
      position: absolute;
      content: '';
      height: ${t};
      left: ${l(t,4)};
      right: 0;
      background-image: repeating-linear-gradient(
        to right,
        ${o} 0,
        ${o} ${l(t,1)},
        transparent 0,
        transparent ${l(t,6)}
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
        ${o} ${l(t,3)},
        transparent 0,
        transparent ${l(t,6)}
      );
    }
  `,s.Style6=a.css`
    & {
      height: ${t};
      background-image: repeating-linear-gradient(
        to right,
        ${o} 0,
        ${o} ${l(t,4)},
        transparent 0,
        transparent ${l(t,6)}
      );
    }
  `,s.Style7=a.css`
    & {
      border-color: ${o};
      border-bottom-style: double;
      border-bottom-width: ${r?"4px":t};
    }
  `,s.Style8=a.css`
    & {
      height: ${t};
      min-height: ${r?"6px":"unset"};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: ${l(t,.2,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${l(t,.4,"4px")};
      background: ${o};
    }
  `,s.Style9=a.css`
    & {
      height: ${t};
      min-height: ${r?"6px":"unset"};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: ${l(t,.4,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${l(t,.2,"4px")};
      background: ${o};
    }
  `,s.Style10=a.css`
    & {
      height: ${t};
      min-height: ${r?"8px":"unset"};
      position: relative;
      background-clip: content-box;
      border-top: ${l(t,.167)} solid ${o};
      border-bottom: ${l(t,.167)} solid ${o};
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: ${r?"2px":l(t,.3)};
      background: ${o};
      transform: translateY(-50%);
    }
  `,d.Style0=a.css`
    & {
      border-left: ${t} solid ${o};
    }
  `,d.Style1=a.css`
    & {
      border-left: ${t} dashed ${o};
    }
  `,d.Style2=a.css`
    & {
      border-left: ${t} dotted ${o};
    }
  `,d.Style3=a.css`
    & {
      width: ${t};
      position: relative;
    }
    &:before {
      position: absolute;
      content: '';
      width: ${t};
      top: ${l(t,3.8)};
      bottom: 0;
      background-image: repeating-linear-gradient(
        to bottom,
        ${o} 0,
        ${o} ${l(t,1)},
        transparent 0,
        transparent ${l(t,6)}
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
        ${o} ${l(t,2.5)},
        transparent 0,
        transparent ${l(t,6)}
      );
    }
  `,d.Style6=a.css`
    & {
      width: ${t};
      background-image: repeating-linear-gradient(
        to bottom,
        ${o} 0,
        ${o} ${l(t,4)},
        transparent 0,
        transparent ${l(t,6)}
      );
    }
  `,d.Style7=a.css`
    & {
      border-left: ${t} double ${o};
    }
  `,d.Style8=a.css`
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
      width: ${l(t,.2,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: ${l(t,.4,"4px")};
      background: ${o};
    }
  `,d.Style9=a.css`
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
      width: ${l(t,.4,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: ${l(t,.2,"4px")};
      background: ${o};
    }
  `,d.Style10=a.css`
    & {
      width: ${t};
      position: relative;
      background-clip: content-box;
      border-left: ${l(t,.167)} solid ${o};
      border-right: ${l(t,.167)} solid ${o};
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: ${r?"2px":l(t,.3)};
      background: ${o};
      transform: translateX(-50%);
    }
  `,i?s:d}(n,r,o)[i]},$=t=>{const{direction:o,pointEnd:n,pointStart:r,strokeStyle:s}=t,l=o===e.Horizontal,d=r.pointStyle,$=r.pointSize*u(null==s?void 0:s.size),p=n.pointStyle,c=n.pointSize*u(null==s?void 0:s.size);return function(t,e,o,n,r){const i=e?n/2+"px":0,s=e?n/2.5+"px":0,l=o?r/2+"px":0,d=o?r/2.5+"px":0,$=a.css`
    left: ${i};
    right: ${l};
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
      right: ${d};
    }
  `,p=a.css`
    top: ${i};
    bottom: ${l};
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
  `;return t?$:p}(l,d!==i.None,p!==i.None,$,c)},p=(t,o=!0)=>{const{pointEnd:n,pointStart:r,strokeStyle:i,direction:s}=t,d=Number(u(i.size)),$=(o?r.pointSize*d:n.pointSize*d)+"px",p=null==i?void 0:i.color,c=o?r.pointStyle:n.pointStyle,b=function(t,o,n=e.Horizontal,r=!0){const i=l(t,1),s=l(t,.5),d=l(t,.1),$=l(t,.3);o=o||"transparent";const p=n===e.Horizontal;let u={None:"None"},c={None:"None"};u.Point0=a.css`
    & {
      width: ${i};
      height: ${i};
      border-radius: 50%;
      background-color: ${o};
      left: ${r?0:"unset"};
      right: ${r?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,u.Point1=a.css`
    & {
      width: ${$};
      height: ${i};
      background-color: ${o};
      left: ${r?"4%":"unset"};
      right: ${r?"unset":"4%"};
      top: 50%;
      transform: translateY(-50%);
    }
  `,u.Point2=a.css`
    & {
      width: ${$};
      height: ${i};
      background-color: ${o};
      left: ${r?0:"unset"};
      right: ${r?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,u.Point3=a.css`
    & {
      width: ${i};
      height: ${i};
      background-color: ${o};
      left: ${r?0:"unset"};
      right: ${r?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,u.Point4=a.css`
    & {
      width: ${l(t,.71)};
      height: ${l(t,.71)};
      background-color: ${o};
      left: ${r?l(t,.2):"unset"};
      right: ${r?"unset":l(t,.2)};
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
  `;const b=a.css`
    .jimu-rtl & {
      border-color: transparent ${o} transparent transparent;
    }
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: transparent transparent transparent ${o};
      left: ${r?0:"unset"};
      right: ${r?"unset":`-${l(t,.5)}`};
      top: 50%;
      transform: translateY(-50%);
    }
  `,h=a.css`
    .jimu-rtl & {
      border-color: transparent transparent transparent ${o};
    }
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: transparent ${o} transparent transparent;
      left: ${r?`-${l(t,.5)}`:"unset"};
      right: ${r?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,g=a.css`
    .jimu-rtl & {
      border-top: ${$} solid ${o};
      border-left: ${$} solid ${o};
    }
    .jimu-ltr & {
      border-bottom: ${$} solid ${o};
      border-left: ${$} solid ${o};
    }
    & {
      width: ${l(t,.8)};
      height: ${l(t,.8)};
      left: ${r?`${l(t,.2)}`:"unset"};
      right: ${r?"unset":`-${l(t,.2)}`};
      top: 50%;
      border-radius: ${d};
      transform: translateY(-50%) rotate(45deg);
    }
  `,f=a.css`
    .jimu-rtl & {
      border-right: ${$} solid ${o};
      border-bottom: ${$} solid ${o};
    }
    .jimu-ltr & {
      border-top: ${$} solid ${o};
      border-right: ${$} solid ${o};
    }
    & {
      width: ${l(t,.8)};
      height: ${l(t,.8)};
      left: ${r?`-${l(t,.2)}`:"unset"};
      right: ${r?"unset":`${l(t,.2)}`};
      top: 50%;
      border-radius: ${d};
      transform: translateY(-50%) rotate(45deg);
    }
  `;c.Point0=a.css`
    & {
      width: ${i};
      height: ${i};
      border-radius: 50%;
      background-color: ${o};
      top: ${r?0:"unset"};
      bottom: ${r?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point1=a.css`
    & {
      width: ${i};
      height: ${$};
      background-color: ${o};
      top: ${r?"4%":"unset"};
      bottom: ${r?"unset":"4%"};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point2=a.css`
    & {
      width: ${i};
      height: ${$};
      background-color: ${o};
      top: ${r?0:"unset"};
      bottom: ${r?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point3=a.css`
    & {
      width: ${i};
      height: ${i};
      background-color: ${o};
      top: ${r?0:"unset"};
      bottom: ${r?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point4=a.css`
    & {
      width: ${l(t,.71)};
      height: ${l(t,.71)};
      background-color: ${o};
      top: ${r?l(t,.2):"unset"};
      bottom: ${r?"unset":l(t,.2)};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }
  `;const y=a.css`
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: transparent transparent ${o} transparent;
      top: ${r?`-${l(t,.5)}`:"unset"};
      bottom: ${r?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,m=a.css`
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: ${o} transparent transparent transparent;
      top: ${r?0:"unset"};
      bottom: ${r?"unset":`-${l(t,.5)}`};
      left: 50%;
      transform: translateX(-50%);
    }
  `,S=a.css`
    .jimu-rtl & {
      border-bottom: ${$} solid ${o};
      border-left: ${$} solid ${o};
    }
    .jimu-ltr & {
      border-bottom: ${$} solid ${o};
      border-right: ${$} solid ${o};
    }
    & {
      width: ${l(t,.8)};
      height: ${l(t,.8)};
      top: ${r?`-${l(t,.2)}`:"unset"};
      bottom: ${r?"unset":`${l(t,.2)}`};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-radius: ${d};
    }
  `,P=a.css`
    .jimu-rtl & {
      border-top: ${$} solid ${o};
      border-right: ${$} solid ${o};
    }
    .jimu-ltr & {
      border-top: ${$} solid ${o};
      border-left: ${$} solid ${o};
    }
    & {
      width: ${l(t,.8)};
      height: ${l(t,.8)};
      top: ${r?`${l(t,.2)}`:"unset"};
      bottom: ${r?"unset":`-${l(t,.2)}`};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-radius: ${d};
    }
  `;let w,v;return r?(w={Point5:b,Point6:h,Point7:g,Point8:f},v={Point5:m,Point6:y,Point7:P,Point8:S}):(w={Point5:h,Point6:b,Point7:f,Point8:g},v={Point5:y,Point6:m,Point7:S,Point8:P}),u=Object.assign(Object.assign({},u),w),c=Object.assign(Object.assign({},c),v),p?u:c}($,p,s,o);return b[c]},u=t=>{const e=t.split("px")[0];return Number(e)};class c extends a.React.PureComponent{constructor(){super(...arguments),this.editWidgetConfig=t=>{if(!window.jimuConfig.isInBuilder)return;this.props.builderSupportModules.jimuForBuilderLib.getAppConfigAction().editWidgetConfig(this.props.id,t).exec()},this.getStyle=()=>a.css`
      & {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
      }
      .divider-con {
        height: 100%;
        width: 100%;
      }
    `}render(){const{config:t,id:o}=this.props,{direction:n,pointEnd:r,pointStart:s}=t,l=(0,a.classNames)("jimu-widget","widget-divider","position-relative","divider-widget-"+o),u=n===e.Horizontal?"horizontal":"vertical",c=d(t),b=$(t),h=p(t,!0),g=p(t,!1),f=(0,a.classNames)("divider-line","position-absolute",u,`point-start-${s.pointStyle}`,`point-end-${r.pointStyle}`);return(0,a.jsx)("div",{className:l,css:this.getStyle(),ref:t=>{this.domNode=t}},(0,a.jsx)("div",{className:"position-relative divider-con"},(0,a.jsx)("div",{className:"point-con"},s.pointStyle!==i.None&&(0,a.jsx)("span",{"data-testid":"divider-point-start",className:"point-start position-absolute",css:h}),r.pointStyle!==i.None&&(0,a.jsx)("span",{"data-testid":"divider-point-end",className:"point-end position-absolute",css:g})),(0,a.jsx)("div",{"data-testid":"divider-line",className:f,css:[c,b]})))}}c.mapExtraStateProps=(t,e)=>{var o,n,r;let i=!1;const s=t.appRuntimeInfo.selection;if(s&&t.appConfig.layouts[s.layoutId]){const o=t.appConfig.layouts[s.layoutId].content[s.layoutItemId];i=o&&o.widgetId===e.id}const l=t.appContext.isInBuilder&&i,d=t.widgetsState[e.id]||(0,a.Immutable)({});return{appMode:s?null===(o=null==t?void 0:t.appRuntimeInfo)||void 0===o?void 0:o.appMode:null,browserSizeMode:null==t?void 0:t.browserSizeMode,active:l,hasEverMount:d.hasEverMount,uri:null===(r=null===(n=t.appConfig.widgets)||void 0===n?void 0:n[e.id])||void 0===r?void 0:r.uri}};const b=c;function h(t){n.p=t}})(),r})())}}}));