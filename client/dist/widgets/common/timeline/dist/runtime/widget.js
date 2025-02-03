System.register(["jimu-core","jimu-arcgis","jimu-ui","jimu-core/dnd","jimu-theme"],(function(e,t){var n={},a={},i={},o={},r={};return{setters:[function(e){n.AllDataSourceTypes=e.AllDataSourceTypes,n.AppMode=e.AppMode,n.BaseVersionManager=e.BaseVersionManager,n.DataSourceComponent=e.DataSourceComponent,n.DataSourceManager=e.DataSourceManager,n.DataSourceStatus=e.DataSourceStatus,n.DataSourceTypes=e.DataSourceTypes,n.Immutable=e.Immutable,n.React=e.React,n.ReactRedux=e.ReactRedux,n.ReactResizeDetector=e.ReactResizeDetector,n.TimezoneConfig=e.TimezoneConfig,n.classNames=e.classNames,n.css=e.css,n.dataSourceUtils=e.dataSourceUtils,n.dateUtils=e.dateUtils,n.defaultMessages=e.defaultMessages,n.getAppStore=e.getAppStore,n.hooks=e.hooks,n.jsx=e.jsx,n.lodash=e.lodash,n.polished=e.polished,n.useIntl=e.useIntl,n.utils=e.utils},function(e){a.ArcGISDataSourceTypes=e.ArcGISDataSourceTypes,a.JimuMapViewComponent=e.JimuMapViewComponent,a.MapViewManager=e.MapViewManager,a.loadArcGISJSAPIModules=e.loadArcGISJSAPIModules},function(e){i.Alert=e.Alert,i.Button=e.Button,i.Dropdown=e.Dropdown,i.DropdownButton=e.DropdownButton,i.DropdownItem=e.DropdownItem,i.DropdownMenu=e.DropdownMenu,i.Icon=e.Icon,i.Label=e.Label,i.Popper=e.Popper,i.Switch=e.Switch,i.Tooltip=e.Tooltip,i.WidgetPlaceholder=e.WidgetPlaceholder,i.defaultMessages=e.defaultMessages},function(e){o.interact=e.interact},function(e){r.getThemeColorValue=e.getThemeColorValue}],execute:function(){e((()=>{var e={10307:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#000" d="m9 6.809 3.276 1.638.448-.894L10 6.19V3H9z"></path><path fill="#000" fill-rule="evenodd" d="M10.293 11.943A5.501 5.501 0 0 0 9.5 1a5.5 5.5 0 0 0-.792 10.943L9.5 13zM14 6.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M12 16.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m-1 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" clip-rule="evenodd"></path><path fill="#000" d="M6 16H0v1h6zM13 16h6v1h-6z"></path></svg>'},44383:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 4 16"><path fill="#282828" fill-rule="evenodd" d="M.322.03A.504.504 0 0 1 .96.305L4 8 .96 15.695a.504.504 0 0 1-.638.275.464.464 0 0 1-.29-.606L2.94 8 .031.636A.464.464 0 0 1 .322.03" clip-rule="evenodd"></path></svg>'},75102:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M8 3c1.175 0 2.27.337 3.195.92l.9-.598A7 7 0 0 0 2.5 13.33h10.999A6.97 6.97 0 0 0 15 9a6.97 6.97 0 0 0-1.256-4.002l-.603.906C13.686 6.808 14 7.867 14 9a5.97 5.97 0 0 1-1.008 3.33H3.008A6 6 0 0 1 8 3m-.183 6.9a1.322 1.322 0 0 1-.43-2.158L13 4 9.258 9.612a1.32 1.32 0 0 1-1.441.287" clip-rule="evenodd"></path></svg>'},72259:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0m1 0A7 7 0 1 1 1 8a7 7 0 0 1 14 0M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" clip-rule="evenodd"></path></svg>'},62241:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M2 2.22V1l1 .7 8.128 5.69L12 8l-.872.61L3 14.3 2 15V2.22M10.256 8 3 13.08V2.92zM14 1h-1v14h1z" clip-rule="evenodd"></path></svg>'},40904:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M5 1H4v14h1zm7 0h-1v14h1z" clip-rule="evenodd"></path></svg>'},97408:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="m2 1 12 7-12 7zm9.983 6.999L3 2.723v10.553z" clip-rule="evenodd"></path></svg>'},64811:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0m1 0A7 7 0 1 1 1 8a7 7 0 0 1 14 0M7.5 4.5a.5.5 0 0 1 1 0v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3z" clip-rule="evenodd"></path></svg>'},12033:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M14 2.22V1l-1 .7-8.128 5.69L4 8l.872.61L13 14.3l1 .7V2.22M5.744 8 13 13.08V2.92zM2 1h1v14H2z" clip-rule="evenodd"></path></svg>'},45508:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6.5 7.5A.5.5 0 0 1 7 7h1.5v4.5h1a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h1V8H7a.5.5 0 0 1-.5-.5"></path><path fill="#000" fill-rule="evenodd" d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m0-1A7 7 0 1 0 8 1a7 7 0 0 0 0 14" clip-rule="evenodd"></path></svg>'},62686:e=>{"use strict";e.exports=a},79244:e=>{"use strict";e.exports=n},26245:e=>{"use strict";e.exports=o},1888:e=>{"use strict";e.exports=r},14321:e=>{"use strict";e.exports=i}},t={};function s(n){var a=t[n];if(void 0!==a)return a.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,s),i.exports}s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var n in t)s.o(t,n)&&!s.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.p="";var l={};return s.p=window.jimuConfig.baseUrl,(()=>{"use strict";s.r(l),s.d(l,{__set_webpack_public_path__:()=>Ye,default:()=>He});var e,t,n,a=s(79244),i=s(62686),o=s(14321);!function(e){e.Classic="CLASSIC",e.Modern="MODERN"}(e||(e={})),function(e){e.Slowest="SLOWEST",e.Slow="SLOW",e.Medium="MEDIUM",e.Fast="FAST",e.Fastest="FASTEST"}(t||(t={})),function(e){e.instant="INSTANT",e.current="CURRENT",e.cumulatively="CUMULATIVE"}(n||(n={}));const r=["year","month","day"],c=["hour","minute","second"],u=4,d=10,m=[...r,...c];var p;!function(e){e[e.year=31536e3]="year",e[e.month=2592e3]="month",e[e.day=86400]="day",e[e.hour=3600]="hour",e[e.minute=60]="minute",e[e.second=1]="second"}(p||(p={}));const h={slowest:5e3,slow:4e3,medium:3e3,fast:2e3,fastest:1e3};function g(e){let n;const a=1e3*Math.ceil(e/1e3);return Object.keys(h).some((e=>h[e]===a&&(n=e.toUpperCase(),!0))),n||(a>h.slowest?n=t.Slowest:a<h.fastest&&(n=t.Fastest)),n}function f(e,n,i=!1){const{startTime:o,endTime:r,layerList:s,accuracy:l,stepLength:c}=e||{};let u;const{startTime:m,endTime:h}=function(e,t,n,a){let i=v(n),o=v(a,!1),r=null,s=null;if(!i||!o){const n=b(e,t);n&&(e=n);if(Object.keys(e).filter((t=>null===e[t])).length===Object.keys(e).length)return{startTime:i,endTime:o};Object.keys(e).forEach((t=>{var n,a;const l=e[t];if(!l)return;const c=l.getTimeInfo();if(!i){const e=null===(n=null==c?void 0:c.timeExtent)||void 0===n?void 0:n[0];r=r?Math.min(r,e):e}if(!o){const e=null===(a=null==c?void 0:c.timeExtent)||void 0===a?void 0:a[1];s=s?Math.max(s,e):e}})),i=i||r,o=o||s}return w(i,o,!0)}(n,s,o,r);if(!m||!h)return null;const g=x(m,h),f=g[0],y=function(e,t,n){const a=(t-e)/1e3/p[n];return{val:a>15?d:a>10?5:1,unit:n}}(m,h,f);if(e){u=(0,a.Immutable)(e);const t=!g.includes(l);t&&(u=u.set("accuracy",f)),c&&(t||p[c.unit]>p[f]||1e3*p[c.unit]*c.val>h-m)&&(u=u.set("stepLength",y))}else u=(0,a.Immutable)(function(e,n){return{layerList:null,startTime:{value:a.dateUtils.VirtualDateType.Min},endTime:{value:a.dateUtils.VirtualDateType.Max},timeDisplayStrategy:"CURRENT",dividedCount:null,accuracy:e,stepLength:n,speed:t.Medium}}(f,y));return i?(u=u.set("startTime",{value:m}).set("endTime",{value:h}),u):(0,a.Immutable)({config:u,exactStartTime:m,exactEndTime:h,minAccuracy:f,accuracyList:g})}function v(e,t=!0){let n=null;if(e)if("number"==typeof e.value)n=e.value;else{const i=new Date;i.setMinutes(0),i.setSeconds(0),i.setMilliseconds(0),e.value===a.dateUtils.VirtualDateType.Today?(i.setHours(0),n=i.getTime()+y(e),n=t?n:n+1e3*p.day):e.value===a.dateUtils.VirtualDateType.Now&&(n=i.getTime()+y(e),n=t?n:n+1e3*p.hour)}return n}function y(e){return e.offset?e.offset.val*p[e.offset.unit]*1e3:0}function b(e,t){let n=null;const o=Object.keys(e).map((t=>e[t]))[0];if((null==o?void 0:o.type)===i.ArcGISDataSourceTypes.WebMap){const e=[];o.getAllChildDataSources().forEach((t=>{(t.type===a.DataSourceTypes.MapService||t.type===a.DataSourceTypes.SubtypeGroupLayer||t.type===a.DataSourceTypes.ImageryLayer||t.type===a.DataSourceTypes.ImageryTileLayer||t.type===a.DataSourceTypes.FeatureLayer&&null===a.dataSourceUtils.findMapServiceDataSource(t))&&t.supportTime()&&e.push(t)}));const i=(null==t?void 0:t.map((e=>e.dataSourceId)))||[];n={},e.forEach((e=>{(0===i.length||i.includes(e.id))&&(n[e.id]=e)}))}return n}function w(e,t,n=!1){let i;if(i=window.jimuConfig.isBuilder?(0,a.getAppStore)().getState().appStateInBuilder.appConfig.attributes.timezone:(0,a.getAppStore)().getState().appConfig.attributes.timezone,(null==i?void 0:i.type)===a.TimezoneConfig.Specific){const o=a.dataSourceUtils.getTimeZoneOffsetByName(i.value),r=a.dataSourceUtils.getLocalTimeOffset();n?(e=e-r+o,t=t-r+o):(e=e+r-o,t=t+r-o)}return{startTime:e,endTime:t}}function x(e,t){const n=[...r,...c],a=[],i=t-e;return n.forEach((e=>{i>=1e3*p[e]&&a.push(e)})),a}function S(e){return e===a.DataSourceTypes.FeatureLayer||e===a.DataSourceTypes.ImageryLayer||e===a.DataSourceTypes.ImageryTileLayer||e===a.DataSourceTypes.SubtypeGroupLayer}var j;function M(e){const{width:t,startTime:n,endTime:a,accuracy:i="hour"}=e,o=j[i],r={year:null,month:null,day:null,hour:null,minute:null,second:null},s=function(e,t,n){const a=n/u;let i,o;const r=(t.getTime()-e.getTime())/31536e6,s=a/r;s>=1?(i=1,o=s*u):(s>=.2?i=5:s>=.1&&s<.2?i=10:s>=.02&&s<.1?i=50:s<.02&&(i=100),o=n/(r/i));return{value:i,tickWidth:o/n}}(new Date(n),new Date(a),t);if(r.year={value:s.value,tickWidth:s.tickWidth},j.month<=o&&1===s.value){const e=function(e,t){const n=e*t/u;let a=null;n>=12?a=1:n>=4?a=3:n>=2&&(a=6);return{value:a,tickWidth:e/(12/a)}}(s.tickWidth,t);if(null!==e.value&&(r.month={value:e.value,tickWidth:e.tickWidth},j.day<=o&&1===e.value)){const e=function(e,t,n){const a=n/u;let i;const o=(t-e)/864e5,r=a/o;i=r>=1?1:r>=.5&&r<1?2:r>=1/7&&r<.5?7:r>=.1&&r<1/7?10:r>=1/15&&r<.1?15:null;return{value:i,tickWidth:1/(o/i)}}(n,a,t);if(null!==e.value&&(r.day={value:e.value,tickWidth:e.tickWidth},j.hour<=o&&1===e.value)){const n=function(e,t){const n=e*t/u;let a;n>=24?a=1:n>=12&&n<24?a=2:n>=4&&n<12?a=6:n>=3&&n<4?a=8:n>=2&&n<3?a=12:n<2&&(a=null);return{value:a,tickWidth:e/(24/a)}}(e.tickWidth,t);if(null!==n.value&&(r.hour={value:n.value,tickWidth:n.tickWidth},j.minute<=o&&1===n.value)){const e=k(n.tickWidth,t);if(null!==e.value&&(r.minute={value:e.value,tickWidth:e.tickWidth},j.second<=o)){const n=k(e.tickWidth,t);null!==n.value&&(r.second={value:n.value,tickWidth:n.tickWidth})}}}}}return r}function k(e,t){const n=e*t/u;let a;n>=60?a=1:n>=12&&n<60?a=5:n>=6&&n<12?a=10:n>=4&&n<6?a=15:n>=2&&n<4?a=30:n<2&&(a=null);return{value:a,tickWidth:e/(60/a)}}function D(e,t,n,a,i,o,r,s){const l=new Date(n),c=new Date(a),u=l.getFullYear(),d=c.getFullYear(),m=[],p=[],h={value:u,label:L(e,l,!0),position:0};_(i,o,0,r)&&(m.push(h),p.push(h));let g=function(e,t){let n=new Date(e).getFullYear(),a=null;for(;!a;)n%100%t==0&&(a=n),n++;return a}(n,e.year.value);g===u&&(g=u+e.year.value);for(let s=g;s<=d;s+=e.year.value){const l=new Date(s,0,1,0,0,0),c=(l.getTime()-n)/(a-n);if(!_(i,o,100*c,r))continue;let d=!1;const h=e.year.tickWidth*t/52;h>=1?d=!0:h<.03?d=s%50==0&&s-u>=49:h<.15?d=s%(10*e.year.value)==0&&s-u>=9:h<.3?d=s%(5*e.year.value)==0&&s-u>=4:h<1&&(d=s%2==0);const g=L(e,l);d=I(d,g,c,p,t);const f={value:s,label:d?g:null,position:100*c+"%"};d&&p.push(f),m.push(f)}return m}function T(e,t,n,a,i,o,r){if(!e.month||e.month.tickWidth>1&&new Date(a).getMonth()===new Date(n).getMonth())return[];const s=new Date(n),l=new Date(a),c=s.getMonth()+1,u=l.getMonth()+1,d=s.getFullYear(),m=12-c+12*(l.getFullYear()-d-1)+u+1,p=[],h=[];let g=function(e,t){const n=new Date(e);n.setDate(1),n.setHours(0),n.setMinutes(0),n.setSeconds(0),n.setMilliseconds(0),e>n.getTime()&&n.setMonth(n.getMonth()+1);let a=n.getMonth(),i=null;for(;!i;)a%t!=0&&11!==a||(i=a),a++;return i+1}(n,e.month.value);g===c&&(g=c+e.month.value);let f=!1;for(let s=g-c;s<=m-1;s+=e.month.value){const l=new Date(d,c+s-1,1,0,0,0),u=(l.getTime()-n)/(a-n);if(!_(i,o,100*u,r))continue;if(!f||0===l.getMonth()){const t=new Date(l.getFullYear(),l.getMonth()-1,1,0,0,0),i=t.getTime()-n,o=Math.max(i,0)/(a-n);if(h.unshift({value:t.getFullYear(),label:L(e,t,!f),position:100*o+"%"}),f=!0,0===l.getMonth())continue}let m=!1;const g=e.month.tickWidth*t;e.year.tickWidth*t>58&&(m=g>=28||(g>=15?l.getMonth()%3==0:(l.getMonth()+1)%12==7));const v=z(e,l);m=I(m,v,u,h,t);const y={value:l.getMonth()+1,label:m?v:null,position:100*u+"%"};m&&h.push(y),p.push(y)}return p}function R(e,t,n){let a=!1;const i=n.day.value;if(1!==i){const n=e.getMonth()+1;2===i?(2===n&&28===t||30===t)&&(a=!0):7===i?(2===n&&21===t||28===t)&&(a=!0):10===i?20===t&&(a=!0):15===i&&15===t&&(a=!0)}return a}function O(e,t,n,a,i,o,r){if(!e.day)return[];const s=new Date(n),l=s.getDate(),c=s.getFullYear(),u=s.getMonth(),d=Math.ceil((a-n)/864e5)+1,m=[],p=[],h={value:l,label:z(e,s),position:0};p.push(h);let g=function(e,t){let n=new Date(e).getDate(),a=null;for(;!a;)(n-1)%t==0&&1!==n&&(a=n),n++;return a}(n,e.day.value);g===l&&(g=l+e.day.value);for(let s=g-l;s<=d-1;s+=e.day.value){const d=new Date(c,u,l+s,0,0,0),h=d.getDate();if(1===h)continue;const g=(d.getTime()-n)/(a-n);if(!_(i,o,100*g,r))continue;let f=!1;const v=e.day.tickWidth*t;e.month.tickWidth*t>100&&(v>=30?f=!0:v>=15?f=h%2==0:v>=8?f=(h-1)%7==0:v>=3&&(f=11===h||21===h));const y=W(d,e);f=I(f,y,g,p,t);const b={value:h,label:f?y:"",position:100*g+"%"};if(f&&p.push(b),m.push(b),R(d,h,e)){const e=new Date(d.getTime());e.setDate(1),e.setMonth(e.getMonth()+1);s+=(e.getTime()-d.getTime())/864e5-1}}return m}function C(e,t,n,a,i,o,r){if(!e.hour)return[];const s=new Date(n),l=s.getHours(),c=s.getFullYear(),u=s.getMonth(),d=s.getDate(),m=Math.ceil((a-n)/36e5)+1,p=[],h=[],g={value:l,label:W(s,e),position:0};h.push(g);let f=function(e,t){let n=new Date(e).getHours(),a=null;for(;!a;)n%t==0&&(a=n),n++;return a}(n,e.hour.value);f===l&&(f=l+e.hour.value);for(let s=f-l;s<=m-1;s+=e.hour.value){const m=new Date(c,u,d,l+s,0,0),g=m.getHours();if(0===g)continue;if(m.getTime()>a)break;const f=(m.getTime()-n)/(a-n);if(!_(i,o,100*f,r))continue;let v=!1;const y=e.day.tickWidth*t,b=e.hour.tickWidth*t;y<60?v=!1:y<100?v=g%12==0:b>=40?v=!0:b>=20?v=g%2==0:b>=6.67?v=g%6==0:b>=5?v=g%8==0:b>=3.3&&(v=g%12==0);const w=A(m,e);v=I(v,w,f,h,t);const x={value:g,label:v?w:"",position:100*f+"%"};v&&h.push(x),p.push(x)}return p}function E(e,t,n,a,i,o,r){if(!e.minute)return[];const s=new Date(n),l=s.getMinutes(),c=s.getFullYear(),u=s.getMonth(),d=s.getDate(),m=s.getHours(),p=(a-n)/6e4+1,h=[],g=[],f={value:l,label:A(s,e),position:0};g.push(f);let v=function(e,t){let n=new Date(e).getMinutes(),a=null;for(;!a;)n%t==0&&(a=n),n++;return a}(n,e.minute.value);v===l&&(v=l+e.minute.value);for(let s=v-l;s<=p-1;s+=e.minute.value){const p=new Date(c,u,d,m,l+s,0),f=p.getMinutes();if(0===p.getMinutes())continue;const v=(p.getTime()-n)/(a-n);if(!_(i,o,100*v,r))continue;let y=!1;const b=e.hour.tickWidth*t,w=e.minute.tickWidth*t;b<60?y=!1:b<=160?y=f%30==0:b<300?y=f%15==0:w>28?y=!0:w>20?y=f%2==0:b>15?y=f%5==0:b>10&&(y=f%10==0);const x=P(p,e);y=I(y,x,v,g,t);const S={value:p.getMinutes(),label:y?x:"",position:100*v+"%"};y&&g.push(S),h.push(S)}return h}function N(e,t,n,a,i,o,r){if(!e.second)return[];const s=new Date(n),l=s.getSeconds(),c=s.getFullYear(),u=s.getMonth(),d=s.getDate(),m=s.getHours(),p=s.getMinutes(),h=(a-n)/1e3+1,g=[],f=[],v={value:l,label:P(s,e),position:0};f.push(v);let y=function(e,t){let n=new Date(e).getSeconds(),a=null;for(;!a;)n%t==0&&(a=n),n++;return a}(n,e.second.value);y===l&&(y=l+e.second.value);for(let s=y-l;s<=h-1;s+=e.second.value){const h=new Date(c,u,d,m,p,l+s),v=h.getSeconds();if(0===h.getSeconds())continue;const y=(h.getTime()-n)/(a-n);if(!_(i,o,100*y,r))continue;let b=!1;const w=e.minute.tickWidth*t,x=e.second.tickWidth*t;w<60?b=!1:w<=160?b=v%30==0:w<300?b=v%15==0:x>28?b=!0:x>20?b=v%2==0:w>15?b=v%5==0:w>10&&(b=v%10==0);const S=V(h,e);b=I(b,S,y,f,t);const j={value:h.getSeconds(),label:b?S:"",position:100*y+"%"};b&&f.push(j),g.push(j)}return g}function I(e,t,n,a,i){if(e){const o=a[a.length-1];if(!o)return!0;const r=$(o.label),s=$(t);r/(1===a.length?1:2)+s/2>(n-parseFloat(o.position)/100)*i&&(e=!1)}return e}function L(e,t,n=!1){let a="";return e.day?a=t.getFullYear():e.month?(a=t.getFullYear(),n&&(a+="/"+(t.getMonth()+1))):a=t.getFullYear(),a}function z(e,t){const n=t.getMonth()+1;let a="";return!e.day||e.hour&&1===e.hour.value?1!==n&&(a=n):a=n+"/"+t.getDate(),a}function W(e,t){let n=e.getDate();const a=e.getMonth()+1;return t.hour&&(n=a+"/"+n),n}function A(e,t){return e.getHours()+":00"}function P(e,t){let n=e.getMinutes();return t.second&&(n=e.getHours()+":"+(n<10?"0":"")+n),n}function V(e,t){return e.getSeconds()}!function(e){e[e.year=1]="year",e[e.month=2]="month",e[e.day=3]="day",e[e.hour=4]="hour",e[e.minute=5]="minute",e[e.second=6]="second"}(j||(j={}));const F={};function $(e,t,n){const a=window;if(void 0===a.measureCanvasCTX){const e=document.createElement("canvas");a.measureCanvasCTX=e.getContext("2d")}if(F[e])return F[e];const i=a.measureCanvasCTX.measureText(e).width+10;return F[e]=i,i}function B(e,t,n,a,i){let o,r,s,l,c,u,d=null;return e(t).draggable({inertia:!1,modifiers:[],autoScroll:!0,onstart:e=>{e.stopPropagation(),e.preventDefault(),r=n(),s=r.startValue,l=r.endValue,c=r.startValue,u=r.endValue,o=0},onmove:e=>{e.stopPropagation(),e.preventDefault();const{extent:t,width:n}=r;o=e.clientX-e.clientX0;const i=function(e,t,n){return(e[1]-e[0])/t*n}(t,n,o),m=function(e,t,n,a,i,o,r){const{extent:s,stepLength:l,dividedCount:c}=t;let u=n,d=a;if(l){const t=Math.round(e/p[l.unit]/l.val/1e3);0!==t&&(u=H(l.unit,new Date(u),t*l.val),d=H(l.unit,new Date(d),t*l.val))}else{const t=(s[1]-s[0])/c,n=Math.round(e/t);0!==n&&(u+=n*t,d+=n*t)}e>0?d>s[1]?l?u>=s[1]?(u=i,d=o):r=s[1]:(u=s[1]-(a-n),d=s[1]):r=null:(r=null,u<s[0]&&(u=s[0],d=u+(a-n)));return{newStart:u,newEnd:d,newTempEnd:r}}(i,r,s,l,c,u,d);a(m.newStart,m.newEnd),c=m.newStart,u=m.newEnd,d=m.newTempEnd},onend:e=>{e.stopPropagation(),i(c,u,d)}})}function U(e,t,n,a,i){let o,r;let s,l,c,u,d,m;return e(t).resizable({edges:{left:".resize-left",right:".resize-right"}}).on("resizestart",(e=>{e.stopPropagation(),s=n(),c=s.startValue,u=s.endValue,d=s.startValue,m=s.endValue,l=u-c,o=0;const a=t.getBoundingClientRect();r=a.width,t.style.minWidth="0px"})).on("resizemove",(e=>{const{extent:t}=s;e.stopPropagation();const n=e.deltaRect;o+=n.width;const i=l&&r+o,h=function(e,t,n,a,i,o){let r=e,s=t;const l=(n[1]-n[0])/a*i;o.edges.left?r=e-l:s=t+l;return{newStart:r,newEnd:s}}(d,m,t,i,o,e),g=function(e,t,n,a,i,o,r){const{width:s,extent:l,stepLength:c,accuracy:u,dividedCount:d}=n;let m=a,h=i;if(c){const n=Math.round((l[1]-l[0])*t/s/p[u]/1e3);e.edges.left?m=H(u,new Date(r),-n):h=H(u,new Date(o),n)}else{const n=(l[1]-l[0])/d,a=Math.round((l[1]-l[0])*t/s/n);e.edges.left?m=r-a*n:h=o+a*n}e.edges.left?(m=Math.min(m,h),m=Math.max(l[0],m),m=Math.min(l[1],m)):(h=Math.max(m,h),h=Math.min(l[1],h),h=Math.max(l[0],h));return{newStart:m,newEnd:h}}(e,i||o,s,c,u,h.newStart,h.newEnd);a(g.newStart,g.newEnd),d=g.newStart,m=g.newEnd})).on("resizeend",(e=>{e.stopPropagation(),i(d,m)}))}function H(e,t,n){switch(e){case"year":t.setFullYear(t.getFullYear()+n);break;case"month":t.setMonth(t.getMonth()+n);break;case"day":t.setDate(t.getDate()+n);break;case"hour":t.setHours(t.getHours()+n);break;case"minute":t.setMinutes(t.getMinutes()+n);break;case"second":t.setSeconds(t.getSeconds()+n)}return t.getTime()}function Y(e,t,n,a,i,o=!0){let r;const s=o?1:-1;if(i)r=n+1/i*(t-e)*s,r=Math.round(r),Math.abs(r-e)<1e4?r=e:Math.abs(r-t)<1e4&&(r=t);else{const e=new Date(n),t=a.val*s;switch(null==a?void 0:a.unit){case"year":e.setFullYear(e.getFullYear()+t);break;case"month":e.setMonth(e.getMonth()+t);break;case"day":e.setDate(e.getDate()+t);break;case"hour":e.setHours(e.getHours()+t);break;case"minute":e.setMinutes(e.getMinutes()+t);break;case"second":e.setSeconds(e.getSeconds()+t)}r=e.getTime()}return r}function _(e,t,n,a){let i=!1;const o=1/a/2*100;return n>=e-o&&n<=t+o&&(i=!0),i}function G(e,t,n){return(null==n?void 0:n.zoomLevel)===t&&0!==t?n.maxWidth/e:Math.pow(2,t)}function J(e,t,n){return e*G(e,t,n)}const X=30;var q=s(26245);const Q={_widgetLabel:"Timeline",overallTimeExtent:"Overall time extent",filteringApplied:"Timeline filtering applied",noTlFromHonoredMapWarning:"Oops! Seems like something went wrong with this map and we cannot get any valid time settings.",noSupportedLayersInMapWidget:"The map does not contain any time-aware data.",invalidTimeSpanWarning:"Please check the widget configurations to make sure the time span is valid.",timezoneWarning:"The Timeline widget is not available to use under the data time zone."};var Z=s(64811),K=s.n(Z),ee=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const te=e=>{const t=window.SVG,{className:n}=e,i=ee(e,["className"]),o=(0,a.classNames)("jimu-icon jimu-icon-component",n);return t?a.React.createElement(t,Object.assign({className:o,src:K()},i)):a.React.createElement("svg",Object.assign({className:o},i))};var ne=s(72259),ae=s.n(ne),ie=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const oe=e=>{const t=window.SVG,{className:n}=e,i=ie(e,["className"]),o=(0,a.classNames)("jimu-icon jimu-icon-component",n);return t?a.React.createElement(t,Object.assign({className:o,src:ae()},i)):a.React.createElement("svg",Object.assign({className:o},i))};var re=s(45508),se=s.n(re),le=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const ce=e=>{const t=window.SVG,{className:n}=e,i=le(e,["className"]),o=(0,a.classNames)("jimu-icon jimu-icon-component",n);return t?a.React.createElement(t,Object.assign({className:o,src:se()},i)):a.React.createElement("svg",Object.assign({className:o},i))};var ue=s(97408),de=s.n(ue),me=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const pe=e=>{const t=window.SVG,{className:n}=e,i=me(e,["className"]),o=(0,a.classNames)("jimu-icon jimu-icon-component",n);return t?a.React.createElement(t,Object.assign({className:o,src:de()},i)):a.React.createElement("svg",Object.assign({className:o},i))};var he=s(40904),ge=s.n(he),fe=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const ve=e=>{const t=window.SVG,{className:n}=e,i=fe(e,["className"]),o=(0,a.classNames)("jimu-icon jimu-icon-component",n);return t?a.React.createElement(t,Object.assign({className:o,src:ge()},i)):a.React.createElement("svg",Object.assign({className:o},i))};var ye=s(12033),be=s.n(ye),we=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const xe=e=>{const t=window.SVG,{className:n}=e,i=we(e,["className"]),o=(0,a.classNames)("jimu-icon jimu-icon-component",n);return t?a.React.createElement(t,Object.assign({className:o,src:be()},i)):a.React.createElement("svg",Object.assign({className:o},i))};var Se=s(62241),je=s.n(Se),Me=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const ke=e=>{const t=window.SVG,{className:n}=e,i=Me(e,["className"]),o=(0,a.classNames)("jimu-icon jimu-icon-component",n);return t?a.React.createElement(t,Object.assign({className:o,src:je()},i)):a.React.createElement("svg",Object.assign({className:o},i))};var De=s(75102),Te=s.n(De),Re=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const Oe=e=>{const t=window.SVG,{className:n}=e,i=Re(e,["className"]),o=(0,a.classNames)("jimu-icon jimu-icon-component",n);return t?a.React.createElement(t,Object.assign({className:o,src:Te()},i)):a.React.createElement("svg",Object.assign({className:o},i))};var Ce=s(1888);const Ee=s(44383),Ne=Object.assign({},Q,a.defaultMessages,o.defaultMessages);const Ie=()=>{const e=(0,a.useIntl)();return a.React.useCallback(((t,n)=>e.formatMessage({id:t,defaultMessage:Ne[t]},n)),[e])},Le=function(i){const{width:r,height:s,applied:l,timeStyle:c=e.Classic,foregroundColor:d,backgroundColor:m,sliderColor:g,theme:f,startTime:v,endTime:y,accuracy:b="year",stepLength:w,dividedCount:x,displayStrategy:S=n.current,enablePlayControl:j=!1,speed:k=t.Medium,autoPlay:R,dateTimePattern:I,updating:L=!1,onTimeChanged:z,onApplyStateChanged:W}=i,[A,P]=a.React.useState(r),[V,F]=a.React.useState(s);a.React.useEffect((()=>{P(r-(c===e.Classic?64:80)),F(c===e.Classic?52:80)}),[r,s,c]);const[$,_]=a.React.useState(0),[Q,Z]=a.React.useState(null),K=(0,a.useIntl)(),ee=Ie(),ne=a.React.useMemo((()=>[{value:t.Slowest,label:ee("slowest")},{value:t.Slow,label:ee("slow")},{value:t.Medium,label:ee("medium")},{value:t.Fast,label:ee("fast")},{value:t.Fastest,label:ee("fastest")}]),[]),[ae,ie]=a.React.useState(k);a.React.useEffect((()=>{ie(k)}),[k]);const[re,se]=a.React.useState(R||!1),le=a.React.useRef(null),ue=a.React.useRef(null),[de,me]=a.React.useState(null),[he,ge]=a.React.useState(0),[fe,ye]=a.React.useState(v),[be,we]=a.React.useState(null),[Se,je]=a.React.useState(null),[Me,De]=a.React.useState(null),[Te,Re]=a.React.useState(null),[Ne,Le]=a.React.useState(null),[ze,We]=a.React.useState(null),Ae=a.React.useRef(null),Pe=a.React.useRef(null),Ve=a.React.useRef(null),Fe=a.React.useRef(null),$e=a.React.useRef(null),Be=a.React.useRef(null),[Ue,He]=a.React.useState(!1),Ye=a.React.useRef(!1),_e=e=>{window.jimuConfig.isInBuilder&&Ye.current&&e.key.includes("Arrow")&&e.preventDefault()};a.React.useEffect((()=>{function e(e){Ye.current=!0}function t(e){Ye.current=!1}function n(e){e.edges={left:!0},Ge(e)}function a(e){e.edges={right:!0},Ge(e)}return le.current.addEventListener("mousedown",et),Pe.current?(Pe.current.addEventListener("keyup",n,!0),Pe.current.addEventListener("focus",e,!0),Pe.current.addEventListener("blur",t,!0)):(Ve.current.addEventListener("keyup",n,!0),Fe.current.addEventListener("keyup",a,!0),Ve.current.addEventListener("focus",e,!0),Ve.current.addEventListener("blur",t,!0),Fe.current.addEventListener("focus",e,!0),Fe.current.addEventListener("blur",t,!0)),document.body.addEventListener("keydown",_e,{passive:!1}),()=>{var i;null===(i=le.current)||void 0===i||i.removeEventListener("mousedown",et),null==Ne||Ne.unset(),null==ze||ze.unset(),Pe.current?(Pe.current.removeEventListener("keyup",n,!0),Pe.current.removeEventListener("focus",e,!0),Pe.current.removeEventListener("blur",t,!0)):Ve.current&&Fe.current&&(Ve.current.removeEventListener("keyup",n,!0),Fe.current.removeEventListener("keyup",a,!0),Ve.current.removeEventListener("focus",e,!0),Ve.current.removeEventListener("blur",t,!0),Fe.current.removeEventListener("focus",e,!0),Fe.current.removeEventListener("blur",t,!0)),document.body.removeEventListener("keydown",_e)}}),[]);const Ge=a.hooks.useEventCallback((e=>{if(e.key.includes("Arrow")){e.preventDefault();const t="ArrowLeft"===e.key||"ArrowTop"===e.key?-1:1,n=qe();let a=n.startValue,i=n.endValue;if(w)e.edges.left?a=H(w.unit,new Date(n.startValue),t*w.val):i=H(w.unit,new Date(n.endValue),t*w.val);else{const o=(n.extent[1]-n.extent[0])/x;e.edges.left?a+=t*o:i+=t*o}e.edges.left?(a=Math.max(n.extent[0],a),a=Math.min(a,i)):(i=Math.min(n.extent[1],i),i=Math.max(a,i)),rt(a,i)}}));a.React.useEffect((()=>{Ae.current&&(Le(U(q.interact,Ae.current,qe,rt,st)),We(B(q.interact,Ae.current,Qe,rt,st)))}),[c]),a.React.useEffect((()=>{ue.current={left:0,x:0},He(!1),ge(0),_(0),se(R),je(null),ye(v);const e=S===n.current?Y(v,y,v,w,x):v;we(e),z(v,e)}),[R,j,v,S,y,b,w,x]),a.React.useEffect((()=>{const e=M({width:J(A,$,Q),startTime:v,endTime:y,accuracy:b});me(e)}),[A,v,y,b,$,Q]),a.React.useEffect((()=>{const e=function(e,t,n,a){if(e<0)return;const i=(n-t)/p[a]/1e3,o=Math.max(e,8*u*i);let r=0;for(;J(e,r)<o||r===X;)r++;return{maxWidth:o,zoomLevel:r}}(A,v,y,b);Z(e)}),[A,v,y,b]);const Je=a.ReactRedux.useSelector((e=>{var t,n;return re?(null===(t=e.appRuntimeInfo)||void 0===t?void 0:t.appMode)===a.AppMode.Design||(null===(n=e.appRuntimeInfo)||void 0===n?void 0:n.isPrintPreview):null})),Xe=a.React.useRef(Je),qe=a.hooks.useEventCallback((()=>({startValue:Me||fe,endValue:Te||Se||be,extent:[v,y],width:J(A,$,Q),accuracy:b,stepLength:w,dividedCount:x}))),Qe=a.hooks.useEventCallback((()=>({startValue:Me||fe,endValue:Te||be,extent:[v,y],width:J(A,$,Q),accuracy:b,stepLength:w,dividedCount:x}))),Ze=a.hooks.useEventCallback((e=>{a.lodash.debounce((()=>{if(Me)return;const t=G(A,$,Q),n=e.clientX-ue.current.x;let a=ue.current.left-n/(t*A)*100;a=Math.min(a/100,(t-1)/t),a=a<0?0:a,ge(100*a)}),50)()})),Ke=a.hooks.useEventCallback((()=>{le.current.style.cursor="grab",le.current.style.removeProperty("user-select"),document.removeEventListener("mousemove",Ze),document.removeEventListener("mouseup",Ke)})),et=a.hooks.useEventCallback((e=>{0!==$&&"BUTTON"!==e.target.tagName&&(le.current.style.cursor="grabbing",le.current.style.userSelect="none",ue.current={left:he,x:e.clientX},document.addEventListener("mousemove",Ze),document.addEventListener("mouseup",Ke))})),tt=a.React.useCallback(((e=fe,t=be,n)=>{if(e<=v)return void ge(0);const a=y-v,i=a/G(A,$,Q),o=v+he/100*a,r=o+i;let s;if(n&&(t<=o||e>=r))s=Math.min(e,y-i);else{if(n||!(e>=r||t<=o))return;s=Math.max(v,t-i)}ge((s-v)/(y-v)*100)}),[$,v,y,he,fe,be,A,Q]),nt=a.React.useCallback((e=>{const t=$+(e?1:-1);if(0===t)return void ge(0);const n=y-v,a=G(A,$,Q),i=G(A,t,Q),o=n/a,r=v+he/100*n,s=r+o;let l=he;const c=Se||be;if(c===y&&c===s)l=(i-1)/i*100;else if(fe<r&&c>r&&c<s)l=(c-(c-r)/(i/a)-v)/(y-v)*100;else{if(fe>=s||be<=r&&fe!==be||fe<r&&be>s)l=(fe+(be-fe)/2-o*a/i/2-v)/(y-v)*100;else{const t=(fe-v)/(y-v)*100-he;l=e?he+t/2:he-t}}l=Math.max(0,l),l=Math.min(l,(i-1)/i*100),ge(l)}),[$,v,y,he,A,fe,be,Se,Q]),at=a.React.useCallback((e=>{const t=Y(v,y,be,w,x,e);let a=v,i=y;if(S===n.instant)e&&t>y||!e&&t<v?(a=v,i=v):(a=t,i=t),ye(a);else if(S===n.cumulatively){const n=e&&be>=y,a=!e&&v===be;if(e&&t>y)(Se||x)&&e?(i=v,je(null)):(i=t,je(y));else{if(a)return;i=n?v:t,je(null)}}else{const n=Y(v,y,fe,w,x,e),o=!e&&v===fe,r=!e&&n<v,s=e&&n>=y;if(n<y&&t>y)(Se||x)&&e?(a=v,i=v+be-fe,je(null)):(a=n,i=t,je(y));else{if(o)return;r||s?(a=v,i=v+be-fe):(a=n,i=t),je(null)}ye(a)}we(i),0!==$&&tt(a,i,e),z(a,i)}),[x,y,be,v,fe,w,S,z,tt]),it=a.React.useCallback((()=>{$e.current&&(clearInterval($e.current),$e.current=null)}),[]),ot=a.React.useCallback((()=>{it(),$e.current=setInterval((()=>{L||at(!0)}),h[ae.toLowerCase()])}),[ae,it,L,at]);a.React.useEffect((()=>{if(!$e.current){if(Je||!re||L)return void it();ot()}return()=>{it()}}),[re,L,Je,it,ot]),a.React.useEffect((()=>{if(Xe.current!==Je&&null!==Je){if(Xe.current=Je,Je)return void it();re&&!L&&ot()}}),[Je,ot,it,re,L]);const rt=(e,t)=>{De(e),Re(t)},st=(e,t,n)=>{rt(null,null),ye(e),we(t),je(n),z(e,n||t)},lt=a.React.useMemo((()=>{if(!de)return null;const e=J(A,$,Q),t=A/e*100+he,n=e/A,i=D(de,e,v,y,he,t,n),o=T(de,e,v,y,he,t,n),r=O(de,e,v,y,he,t,n),s=C(de,e,v,y,he,t,n),l=E(de,e,v,y,he,t,n),c=N(de,e,v,y,he,t,n),u=function(e,t,n,a,i,o,r){const s={labels:{},ticks:{}},l=[];t.length>1&&l.push("year"),n.length>1&&l.push("month"),a.length>1&&l.push("day"),i.length>1&&l.push("hour"),o.length>1&&l.push("minute"),r.length>1&&l.push("second");const c=l[l.length-1],u=Object.keys(e).filter((t=>e[t]));if(1===l.length)u.forEach((e=>{s.ticks[e]="medium",s.labels[e]="short"}));else{if(2===l.length)s.ticks[c]="medium",u.forEach((e=>{e!==c&&(s.ticks[e]="long")}));else{const e=l[l.length-2];s.ticks[c]="short",s.ticks[e]="medium",u.forEach((t=>{t!==c&&t!==e&&(s.ticks[t]="long")}))}s.labels=s.ticks}return s}(de,i,o,r,s,l,c),d=["year","month","day","hour","minute","second"];return(0,a.jsx)("div",{className:"timeline-ticks"},[i,o,r,s,l,c].map(((e,t)=>e.map(((e,n)=>{const i=e.position,o=d[t];return(0,a.jsx)("div",{key:`item-${t}-${n}`,className:"timeline-tick-container","data-unit":o,style:{left:i}},e.label&&(0,a.jsx)("div",{className:`timeline-tick_label ${u.labels[o]}-label ${"year"===o&&0===n&&0===he?"timeline-first_label":""}`},e.label),(0,a.jsx)("div",{key:n,className:(0,a.classNames)(`timeline-tick ${u.ticks[o]}-tick`,e.label?"has-label":"no-label")}))})))))}),[de,$,he]),ct=a.React.useMemo((()=>function(e,t,n,i,o){const r=(0,a.getAppStore)().getState().appContext.isRTL;return n=(0,Ce.getThemeColorValue)(n||e.ref.palette.black,e),i=i||e.ref.palette.white,o=(0,Ce.getThemeColorValue)(o||e.sys.color.primary.main,e),a.css`
    color: red;
    height: fit-content;
    color: ${n};

    // Common style
    .timeline-header, .timeline-footer {
      height: 16px;
      display: flex;
      flex-direction: ${r?"row-reverse":"row"};
      align-items: center;
      justify-content: space-between;
      .zoom-container {
        min-width: 36px;
        display: flex;
        flex-direction: ${r?"row-reverse":"row"};
      }
      .range-label {
        display: flex;
        align-items: center;
        font-size: ${a.polished.rem(12)};
        font-weight: 500;
        line-height: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .range-label-badge {
          width: 8px;
          height: 8px;
          min-width: 8px;
          border-radius: 4px;
          margin-right: 0.25rem;
        }
      }
    }
    .timeline-content {
      overflow-x: hidden;

      .timeline-whole {
        .timeline-ticks {
          position: relative;
          .timeline-tick-container {
            position: absolute;
            user-select: none;
            .timeline-tick {
              width: 1px;
              background: ${a.polished.rgba(n,.5)};
            }
            .timeline-tick_label {
              font-size: ${a.polished.rem(11)};
              font-weight: 400;
              line-height: 15px;
              width: max-content;
              transform: translate(${r?"50%":"-50%"});
              color: foregroundColor;
              &.long-label {
                font-weight: 600;
              }
              &.medium-label {
                font-weight: 500;
              }
              &.short-label {
                font-weight: 400;
              }
              &.timeline-first_label {
                /* transform: ${`translate(-${t}px)`}; */
                transform: translate(0);
              }
            }
          }
        }
      }

      .timeline-range-container {
        height: 8px;
        /* width: ${`calc(100% - ${2*t}px)`}; */
        width: 100%;
        border-radius: 4px;
        background-color: ${a.polished.rgba(n,.2)};
        .resize-handlers {
          height: 100%;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          background-color: ${o};

          .resize-handler {
            width: 8px;
            height: 8px;
            padding: 0;
            overflow: visible;
            border-radius: 8px;
            background: ${o};
            border: 2px solid ${o};
            &.resize-instant {
              background: ${i};
            }
          }

          &:hover {
            .resize-handler {
              background: ${i};
            }
          }
        }
      }
      .timeline-arrow {
        position: absolute;
        &.left-arrow{
          transform: scaleX(-1);
        }
      }
    }
    .jimu-btn {
        color: ${n};
        border-radius: 16px;
        &:hover:not(:disabled) {
          color: ${n};
          background-color: ${a.polished.rgba(n,.2)};
        }
        &.disabled {
          color: ${a.polished.rgba(n,.2)};
          &:hover {
            color: ${a.polished.rgba(n,.2)};
          }
        }
        .jimu-icon {
          margin: 0
        }

        .icon-btn-sizer {
          min-width: 0;
          min-height: 0;
        }
    }

    .jimu-dropdown-button {
      &:not(:disabled):not(.disabled):active,
      &[aria-expanded="true"]{
        border-color: transparent !important;
        color: unset !important;
      }
    }

    // Clasic style
    &.timeline-classic {
      padding: 1rem 1.5rem;
      .timeline-header .range-label {
        .range-label-badge {
          background-color: ${o};
        }
        .range-label-context {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .timeline-content {
        margin: 1rem 0.5rem;
        .timeline-whole {
          .timeline-ticks {
            padding-top: 0.75rem;
            .timeline-tick-container {
              .timeline-tick {
                &.long-tick {
                  height: 12px;
                  &.no-label {
                    margin-top: 19px;
                  }
                  &.has-label {
                    margin-top: 0;
                  }
                }
                &.medium-tick {
                  height: 8px;
                  &.no-label {
                    margin-top: 23px;
                  }
                  &.has-label {
                    margin-top: 8px;
                  }
                }
                &.short-tick {
                  height: 4px;
                  &.no-label {
                    margin-top: 27px;
                  }
                  &.has-label {
                    margin-top: 12px;
                  }
                }
              }
              .timeline-tick_label {
                margin-bottom: 4px;
              }
            }
          }
          .timeline-arrow {
            top: 78px;
            &.left-arrow{
              left: ${r?"unset":"20px"};
              right: ${r?"20px":"unset"};
            }
            &.right-arrow{
              left: ${r?"20px":"unset"};
              right: ${r?"unset":"20px"};
            }
          }
        }
        .timeline-range-container .resize-handlers .resize-handler {
          min-width: 8px;
          &:focus {
            background: ${i};
            outline-offset: 0;
          }
        }
      }
      .timeline-footer {
        flex-direction: ${r?"row-reverse":"row"};
        .play-container {
          min-width: 65px;
        }
      }
    }

    // Modern style
    &.timeline-modern {
      padding: 1rem 0.5rem;
      height: 156px;

      .timeline-header{
        padding-top: 0;
        padding-bottom: 0;
        padding: 0 36px;
        &.no-play-container {
          padding-left: ${r?"12px":"36px"};
          padding-right: ${r?"36px":"12px"};
        }
        .range-label {
          margin: 0 0.25rem;
          .range-label-badge {
            background-color: ${a.polished.rgba(o,.7)};
          }
        }
      }

      .timeline-content {
        display: flex;
        margin-top: 0.5rem;
          .timeline-left, .timeline-right {
            display: flex;
            height: 80px;
            .play-container {
              min-width: 17px; /* when play btn is hidden */
              display: flex;
              flex-direction: column;
              justify-content: center;
              .jimu-btn {
                margin: 0 0.5rem;
                &.next-btn {
                  margin-bottom: 0.5rem;
                }
                &.play-btn {
                  margin-top: 0.5rem;
                }
              }
            }
          }
        .timeline-middle {
          height: 115px;
          overflow-x: hidden;
          flex-grow: 1;
          .timeline-content-inside {
            border: 1px solid ${a.polished.rgba(n,.5)};
            border-radius: 8px;
            .timeline-whole {
              display: flex;
              flex-direction: column;
              .timeline-ticks {
                .timeline-tick-container {
                  display: flex;
                  flex-direction: column-reverse;
                  .timeline-tick {
                    &.long-tick {
                      height: 32px;
                    }
                    &.medium-tick {
                      height: 16px;
                      margin-top: 16px;
                    }
                    &.short-tick {
                      height: 8px;
                      margin-top: 24px;
                    }
                  }
                  .timeline-tick_label {
                    margin-top: 0.5rem;
                  }
                }
              }
              .timeline-range-container {
                z-index: 1;
                width: 100%;
                background: transparent;
                .resize-handlers {
                  background-color: ${a.polished.rgba(o,.7)};
                  .resize-handler {
                    min-width: 4px;
                    width: 4px;
                    height: calc(100% - 10px);
                    margin: 5px 0;
                    background: transparent;
                    border: none;
                    &.show-bg { /** When handlers.w = 0 */
                      background-color: ${a.polished.rgba(o,.7)};
                      height: 100%;
                      margin: 0;
                      &:hover {
                        background-color: ${a.polished.rgba(o,.9)};
                      }
                    }
                  }
                  &:hover {
                    .resize-handler {
                      background: ${a.polished.rgba(o,.7)};

                    }
                  }
                }
              }
            }
          }
          .timeline-arrow {
            z-index: 2;
            top: 68px;
            &.left-arrow{
              left: 50px;
              left: ${r?"unset":"50px"};
              right: ${r?"50px":"unset"};
            }
            &.right-arrow{
              right: 50px;
              left: ${r?"50px":"unset"};
              right: ${r?"unset":"50px"};
              &.no-play-container {
                left: ${r?"25px":"unset"};
                right: ${r?"unset":"25px"};
              }
            }
          }
        }
      }
    }
  `}(f,7,d,m,g)),[f,7,d,m,g]),ut=a.React.useMemo((()=>{const e=(0,a.jsx)(o.Button,{icon:!0,type:"tertiary",size:"sm",disabled:0===$,onClick:()=>{nt(!1),_(Math.max(0,$-1))}},(0,a.jsx)(oe,null)),t=(0,a.jsx)(o.Button,{icon:!0,type:"tertiary",size:"sm",disabled:$===(null==Q?void 0:Q.zoomLevel),onClick:()=>{nt(!0),_(Math.min(null==Q?void 0:Q.zoomLevel,$+1))}},(0,a.jsx)(te,null));return(0,a.jsx)("div",{className:"zoom-container"},0===$?e:(0,a.jsx)(o.Tooltip,{title:ee("zoomOut"),placement:"bottom"},e),$===(null==Q?void 0:Q.zoomLevel)?t:(0,a.jsx)(o.Tooltip,{title:ee("zoomIn"),placement:"bottom"},t))}),[$,ee,Q,nt]),dt=a.React.useMemo((()=>j?(0,a.jsx)(o.Tooltip,{title:ee(re?"pause":"play"),placement:"bottom"},(0,a.jsx)(o.Button,{icon:!0,type:"tertiary",size:"sm",className:"play-btn",onClick:()=>{se(!re)}},re?(0,a.jsx)(ve,null):(0,a.jsx)(pe,null))):null),[j,re,ee]),mt=a.React.useMemo((()=>(0,a.jsx)(o.Tooltip,{title:ee("previous"),placement:"bottom"},(0,a.jsx)(o.Button,{icon:!0,type:"tertiary",size:"sm",onClick:e=>{at(!1)}},(0,a.jsx)(xe,null)))),[ee,at]),pt=a.React.useMemo((()=>(0,a.jsx)(o.Tooltip,{title:ee("next"),placement:"bottom"},(0,a.jsx)(o.Button,{icon:!0,type:"tertiary",size:"sm",className:"next-btn",onClick:e=>{at(!0)}},(0,a.jsx)(ke,null)))),[ee,at]),ht=a.React.useMemo((()=>{const e=K.formatDate(v,I),t=K.formatDate(y,I);return(0,a.jsx)(a.React.Fragment,null,(0,a.jsx)(o.Button,{icon:!0,type:"tertiary",ref:e=>{Be.current=e},"aria-label":ee("moreInfo"),"aria-haspopup":"true","aria-expanded":Ue,onClick:e=>{He(!Ue)}},(0,a.jsx)(ce,null)),(0,a.jsx)(o.Popper,{open:Ue,keepMount:!0,showArrow:!0,reference:Be,toggle:e=>{He(!1),"Escape"===(null==e?void 0:e.key)&&a.lodash.defer((()=>{Be.current.focus()}))}},(0,a.jsx)("div",{className:"p-4"},(0,a.jsx)("h6",{className:"mb-2"},ee("overallTimeExtent")),(0,a.jsx)("div",{className:"mb-4"},`${e} - ${t}`),(0,a.jsx)(o.Label,{check:!0,className:"d-flex align-items-center"},(0,a.jsx)("h6",{className:"flex-grow-1 mb-0 mr-1"},ee("filteringApplied")),(0,a.jsx)(o.Switch,{checked:l,onChange:(e,t)=>{W(t)}})))))}),[ee,v,y,K,Ue,l,I,W]),gt=a.React.useMemo((()=>(0,a.jsx)(o.Dropdown,{menuRole:"listbox",activeIcon:!0,className:c===e.Classic?"":"justify-content-center"},(0,a.jsx)(o.Tooltip,{title:ee("speed"),placement:"bottom"},(0,a.jsx)(o.DropdownButton,{icon:!0,type:"tertiary",arrow:!1,"aria-label":ee("speed"),"a11y-description":ne.filter((e=>e.value===ae))[0].label},(0,a.jsx)(Oe,null))),(0,a.jsx)(o.DropdownMenu,null,ne.map((e=>(0,a.jsx)(o.DropdownItem,{key:e.value,value:e.value,active:e.value===ae,onClick:e=>{ie(e.target.value)}},e.label)))))),[ne,ae,c,ee]),ft=a.hooks.useEventCallback((e=>{const t=y-v,n=G(A,$,Q);let a=(v+he/100*t+(e?1:-1)*(t/n)-v)/(y-v)*100;a=Math.max(0,a),a=Math.min(a,(n-1)/n*100),ge(a)})),vt=G(A,$,Q),yt=(0,a.getAppStore)().getState().appContext.isRTL,bt=Me||fe,wt=Te||Se||be,{startPositionForStep:xt,widthForStep:St}=((t,n)=>{let a=(t-v)/(y-v),i=(n-v)/(y-v)-a;return t===y?(a=c===e.Classic?"calc(100% - 16px)":"calc(100% - 8px)",i=0):a=100*a+"%",{startPositionForStep:a,widthForStep:i}})(bt,wt),jt=K.formatDate(bt,I),Mt=K.formatDate(wt,I),kt=0!==he,Dt=100-he-1/vt*100>1e-11,Tt=S===n.instant,Rt=jt+(Tt?"":" - "+Mt);return(0,a.jsx)("div",{css:ct,dir:"ltr",className:(0,a.classNames)("timeline w-100",{"timeline-classic":c===e.Classic,"timeline-modern":c===e.Modern})},c===e.Classic?(0,a.jsx)(a.React.Fragment,null,(0,a.jsx)("div",{className:"timeline-header"},(0,a.jsx)("div",{className:"range-label",dir:yt?"rtl":"ltr"},(0,a.jsx)("div",{className:"range-label-badge"}),(0,a.jsx)("div",{className:"range-label-context"},Rt)),ut),(0,a.jsx)("div",{className:"timeline-content"},(0,a.jsx)("div",{className:"timeline-content-inside"},(0,a.jsx)("div",{className:"timeline-whole",ref:e=>{le.current=e},style:{width:100*vt+"%",height:V+"px",marginLeft:-he*vt+"%"}},lt,kt&&(0,a.jsx)(o.Tooltip,{title:ee("slideBackward"),placement:"bottom"},(0,a.jsx)(o.Button,{icon:!0,type:"tertiary",size:"sm",className:"timeline-arrow left-arrow",onClick:e=>ft(!1)},(0,a.jsx)(o.Icon,{width:4,height:16,icon:Ee}))),Dt&&(0,a.jsx)(o.Tooltip,{title:ee("slideForward"),placement:"bottom"},(0,a.jsx)(o.Button,{icon:!0,type:"tertiary",size:"sm",className:"timeline-arrow right-arrow",onClick:e=>ft(!0)},(0,a.jsx)(o.Icon,{width:4,height:16,icon:Ee})))),(0,a.jsx)("div",{className:"timeline-range-container",style:{width:100*vt+"%",marginLeft:-he*vt+"%"}},(0,a.jsx)("div",{className:"resize-handlers",ref:e=>{Ae.current=e},style:{marginLeft:xt,width:Tt?"fit-content":100*St+"%"}},Tt?(0,a.jsx)("button",{className:"resize-handler resize-instant",ref:e=>{Pe.current=e},title:jt}):(0,a.jsx)(a.React.Fragment,null,(0,a.jsx)("button",{className:"resize-handler resize-left",ref:e=>{Ve.current=e},title:jt}),(0,a.jsx)("button",{className:"resize-handler resize-right",ref:e=>{Fe.current=e},title:Mt})))))),(0,a.jsx)("div",{className:"timeline-footer"},ht,(0,a.jsx)("div",{className:"play-container"},mt,dt,pt),j?gt:(0,a.jsx)("div",null))):(0,a.jsx)(a.React.Fragment,null,(0,a.jsx)("div",{className:(0,a.classNames)("timeline-header",{"no-play-container":!j})},ht,(0,a.jsx)("div",{className:"range-label",dir:yt?"rtl":"ltr"},(0,a.jsx)("div",{className:"range-label-badge"}),Rt),ut),(0,a.jsx)("div",{className:"timeline-content"},(0,a.jsx)("div",{className:"timeline-left"},(0,a.jsx)("div",{className:"play-container"},pt,mt)),(0,a.jsx)("div",{className:"timeline-middle"},kt&&(0,a.jsx)(o.Tooltip,{title:ee("slideBackward"),placement:"bottom"},(0,a.jsx)(o.Button,{icon:!0,type:"tertiary",size:"sm",className:(0,a.classNames)("timeline-arrow left-arrow",{"no-play-container":!j}),onClick:e=>ft(!1)},(0,a.jsx)(o.Icon,{width:4,height:16,icon:Ee}))),(0,a.jsx)("div",{className:"timeline-content-inside"},(0,a.jsx)("div",{className:"timeline-whole",ref:e=>{le.current=e},style:{width:100*vt+"%",height:V+"px",marginLeft:-he*vt+"%"}},(0,a.jsx)("div",{style:{height:V-32+"px"}}),lt,(0,a.jsx)("div",{className:"timeline-range-container",style:{height:V+"px",marginTop:-(V-32)+"px"}},(0,a.jsx)("div",{className:"resize-handlers",ref:e=>{Ae.current=e},style:{marginLeft:xt,width:Tt?"fit-content":100*St+"%"}},Tt?(0,a.jsx)("button",{className:"resize-handler resize-instant",ref:e=>{Pe.current=e},title:jt}):(0,a.jsx)(a.React.Fragment,null,(0,a.jsx)("button",{className:"resize-handler resize-left "+(bt===wt?"show-bg":""),ref:e=>{Ve.current=e},title:jt}),(0,a.jsx)("button",{className:"resize-handler resize-right "+(bt===wt?"show-bg":""),ref:e=>{Fe.current=e},title:Mt})))))),Dt&&(0,a.jsx)(o.Tooltip,{title:ee("slideForward"),placement:"bottom"},(0,a.jsx)(o.Button,{icon:!0,type:"tertiary",size:"sm",className:(0,a.classNames)("timeline-arrow right-arrow",{"no-play-container":!j}),onClick:e=>ft(!0)},(0,a.jsx)(o.Icon,{width:4,height:16,icon:Ee})))),(0,a.jsx)("div",{className:"timeline-right"},(0,a.jsx)("div",{className:"play-container"},j&&gt,dt)))))};var ze=function(e,t,n,a){return new(n||(n=Promise))((function(i,o){function r(e){try{l(a.next(e))}catch(e){o(e)}}function s(e){try{l(a.throw(e))}catch(e){o(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,s)}l((a=a.apply(e,t||[])).next())}))};class We extends a.BaseVersionManager{constructor(){super(...arguments),this.versions=[{version:"1.11.0",description:"",upgrader:e=>ze(this,void 0,void 0,(function*(){let t=e;if(!t.honorTimeSettings)if(t.timeSettings){const{stepLength:e,dividedCount:n}=t.timeSettings;t=e?t.setIn(["timeSettings","stepLength","val"],Math.round(e.val)):t.setIn(["timeSettings","dividedCount"],Math.round(n))}else t=t.set("honorTimeSettings",!0);return t}))},{version:"1.12.0",description:"",upgrader:e=>ze(this,void 0,void 0,(function*(){let n=e;return n=n.without("speed"),!n.honorTimeSettings&&n.timeSettings&&(n=n.setIn(["timeSettings","speed"],t.Medium)),n}))}]}}const Ae=new We;class Pe extends a.React.PureComponent{constructor(){super(...arguments),this.onDataSourceCreated=e=>{this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId,e)},this.onCreateDataSourceFailed=()=>{this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId,null)},this.onDataSourceInfoChange=e=>{this.props.onIsDataSourceNotReady(this.props.useDataSource.dataSourceId,null==e?void 0:e.status)}}componentWillUnmount(){this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId,null,!0),this.props.onIsDataSourceNotReady(this.props.useDataSource.dataSourceId,a.DataSourceStatus.NotReady)}render(){const{useDataSource:e}=this.props;return(0,a.jsx)(a.DataSourceComponent,{useDataSource:e,onDataSourceCreated:this.onDataSourceCreated,onCreateDataSourceFailed:this.onCreateDataSourceFailed,onDataSourceInfoChange:this.onDataSourceInfoChange})}}var Ve=function(e,t,n,a){return new(n||(n=Promise))((function(i,o){function r(e){try{l(a.next(e))}catch(e){o(e)}}function s(e){try{l(a.throw(e))}catch(e){o(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,s)}l((a=a.apply(e,t||[])).next())}))};const Fe=Object.assign({},Q,a.defaultMessages,o.defaultMessages),$e=s(10307),Be="156px",Ue=e=>{var t,r,s,l,c,u;const{useMapWidgetIds:d,useDataSources:h,theme:v,id:y,config:j,intl:M,autoWidth:k,autoHeight:D,controllerWidgetId:T,offPanel:R}=e,{addSourceByData:O=!0,enablePlayControl:C,applyFilteringByDefault:E=!0,autoPlay:N,enableDisplayAccuracy:I=!1,displayAccuracy:L,timeSettings:z,honorTimeSettings:W,dataSourceType:A,timeStyle:P,foregroundColor:V,backgroundColor:F,sliderColor:$}=j,B=O?null:d,U=T&&R,{speed:H}=z||{},[Y,_]=a.React.useState(null),[G,J]=a.React.useState(E),[X,q]=a.React.useState(H),[Q,Z]=a.React.useState(null),K=a.React.useRef(null),[ee,te]=a.React.useState(!1),[ne,ae]=a.React.useState(null),[ie,oe]=a.React.useState(null),[re,se]=a.React.useState(null),[le,ce]=a.React.useState([]),[ue,de]=a.React.useState(!0),[me,pe]=a.React.useState(null),[he,ge]=a.React.useState(null),fe=a.React.useRef(null),ve=a.ReactRedux.useSelector((e=>{var t,n;return(null===(n=null===(t=e.appConfig.attributes)||void 0===t?void 0:t.timezone)||void 0===n?void 0:n.type)===a.TimezoneConfig.Data})),ye=a.React.useMemo((()=>i.MapViewManager.getInstance()),[]),be=a.React.useMemo((()=>a.DataSourceManager.getInstance()),[]),we=a.React.useMemo((()=>{if(le.length)return!1;const e=Object.keys(re||{}).sort();let t;if(null==B?void 0:B.length)t=!0;else{const n=(h||(0,a.Immutable)([])).map((e=>e.dataSourceId)).asMutable({deep:!0});t=a.utils.diffArrays(!0,e,n).isEqual}return t}),[B,re,h,le]);a.React.useEffect((()=>{var e;return pe(U?480:null===(e=fe.current)||void 0===e?void 0:e.clientWidth),(0,i.loadArcGISJSAPIModules)(["esri/core/reactiveUtils"]).then((e=>{oe(e[0])})),()=>{Se(null,null,!0)}}),[]),a.React.useEffect((()=>{se(null),ae(null),ge(null)}),[A]),a.React.useEffect((()=>{J(E)}),[E]),a.React.useEffect((()=>{if(S(A))te(!1),ae(h);else if((null==B?void 0:B.length)>0)if(K.current){const e={},t={dataSourceId:K.current,mainDataSourceId:K.current};be.createDataSourceByUseDataSource((0,a.Immutable)(t)).then((t=>Ve(void 0,void 0,void 0,(function*(){if(K.current&&Q){const n=[];Object.keys(Q).forEach((e=>{n.push(Q[e].createLayerDataSource())})),yield Promise.all(n),e[t.id]=t,se(e),te(0===Object.keys(Q).length)}}))))}else""===K.current?(te(!0),se(null)):(te(!1),se(null));else if((null==h?void 0:h.length)>0){te(!1);const e=[];h.forEach((t=>{e.push(be.createDataSourceByUseDataSource((0,a.Immutable)(t)).then((e=>e.isDataSourceSet()&&!e.areChildDataSourcesCreated()?e.childDataSourcesReady().then((()=>e)):e)))})),Promise.all(e).then((e=>{const t={};e.forEach((e=>{t[e.id]=e})),se(t)})).catch((e=>{}))}}),[B,K,Q,h,be,A,ae,se]),a.React.useEffect((()=>{if(re&&ie&&we)if(W){const e=function(e,t=!1){var a,o,r;let s=null;const l=e[Object.keys(e).filter((t=>e[t].type===i.ArcGISDataSourceTypes.WebMap))[0]],c=null===(r=null===(o=null===(a=null==l?void 0:l.getItemData())||void 0===a?void 0:a.widgets)||void 0===o?void 0:o.timeSlider)||void 0===r?void 0:r.properties;if(c){const{startTime:e,endTime:a,timeStopInterval:i,numberOfStops:o,thumbMovingRate:r,thumbCount:l}=c;let u=e,d=a;if(t){const t=w(e,a,!0);u=t.startTime,d=t.endTime}if(s={speed:g(r),layerList:null,startTime:{value:u},endTime:{value:d},timeDisplayStrategy:2===l?n.current:n.cumulatively},i){const e=function(e){switch(e){case"esriTimeUnitsMonths":return"month";case"esriTimeUnitsDays":return"day";case"esriTimeUnitsHours":return"hour";case"esriTimeUnitsMinutes":return"minute";default:return"year"}}(i.units);s.accuracy=e,s.stepLength={val:i.interval,unit:e}}else if(o){s.dividedCount=o;const e=x(u,d);s.accuracy=e[0];const t=(d-u)/o;e.some((e=>t>=1e3*p[e]&&(s.accuracy=e,!0)))}}return s}(re,!0);q(null==e?void 0:e.speed),ge(e)}else{const e=f(z,re,!0);q(H),ge(e)}}),[re,ie,W,H,z,we]);const xe=(e,t)=>{let n=null;return Object.keys(e.jimuLayerViews).forEach((a=>{e.jimuLayerViews[a].layerDataSourceId===t&&(n=e.jimuLayerViews[a])})),n},Se=a.hooks.useEventCallback(((e,t,n=!1)=>{var i;if(!re)return;const o={time:n?null:[e,t]};if(!n){const n=w(e,t);o.time=[n.startTime,n.endTime]}if(n||(()=>{let e=[],t=null;const n=[];if(null==B?void 0:B.length)Q&&Object.keys(Q).forEach((e=>{var t;(null===(t=Q[e])||void 0===t?void 0:t.view)&&n.push(ie.whenOnce((()=>!Q[e].view.updating)))}));else{const i=ye.getAllJimuMapViewIds();A===a.AllDataSourceTypes.WebMap?(t=re[Object.keys(re)[0]],e=t.getAllChildDataSources().map((e=>e.id))):e=Object.keys(re),e.forEach((e=>{var o;const r=t||(null===(o=re[e])||void 0===o?void 0:o.getRootDataSource());if((null==r?void 0:r.type)===a.AllDataSourceTypes.WebMap){const t=i.filter((e=>ye.getJimuMapViewById(e).dataSourceId===r.id));t.forEach((t=>{const a=ye.getJimuMapViewById(t),i=xe(a,e);(null==i?void 0:i.view)&&n.push(ie.whenOnce((()=>!i.view.updating)))}))}}))}Promise.all(n).then((e=>{de(!1)}))})(),A===a.AllDataSourceTypes.WebMap)if(null==B?void 0:B.length)Object.keys(Q).forEach((e=>{const t=Q[e].getLayerDataSource();je(t,o,e)}));else{const e=b(re,null===(i=j.timeSettings)||void 0===i?void 0:i.layerList);Object.keys(e).forEach((t=>{je(e[t],o,y)}))}else Object.keys(re).forEach((e=>{re[e]&&je(re[e],o,y)}))}));a.React.useEffect((()=>{Y&&Se(Y[0],Y[1],!G)}),[Y,G,Se]);const je=(e,t,n)=>{var i,o,r,s;e.type===a.DataSourceTypes.MapService?(null===(i=e.supportTime)||void 0===i?void 0:i.call(e))&&(t=Me(e,t),null===(o=e.changeTimeExtent)||void 0===o||o.call(e,t.time,n)):S(e.type)&&(null===(r=e.supportTime)||void 0===r?void 0:r.call(e))&&(t=Me(e,t),null===(s=e.updateQueryParams)||void 0===s||s.call(e,t,n))},Me=(e,t)=>{const n=e.getTimeInfo().exportOptions||{},{TimeOffset:a=0,timeOffsetUnits:i}=n;if((null==t?void 0:t.time)&&0!==a){let e=t.time[0],n=t.time[1];const o=new Date(e),r=new Date(n);switch(i){case"esriTimeUnitsCenturies":case"esriTimeUnitsDecades":case"esriTimeUnitsYears":const t="esriTimeUnitsCenturies"===i?100:"esriTimeUnitsDecades"===i?10:1;e=o.setFullYear(o.getFullYear()-a*t),n=r.setFullYear(r.getFullYear()-a*t);break;case"esriTimeUnitsMonths":e=o.setMonth(o.getMonth()-a),n=r.setMonth(r.getMonth()-a);break;case"esriTimeUnitsWeeks":case"esriTimeUnitsDays":const s="esriTimeUnitsWeeks"===i?7:1;e=o.setDate(o.getDate()-a*s),n=r.setDate(r.getDate()-a*s);break;case"esriTimeUnitsHours":e=o.setHours(o.getHours()-a),n=r.setHours(r.getHours()-a);break;case"esriTimeUnitsMinutes":e=o.setMinutes(o.getMinutes()-a),n=r.setMinutes(r.getMinutes()-a);break;case"esriTimeUnitsSeconds":e=o.setSeconds(o.getSeconds()-a),n=r.setSeconds(r.getSeconds()-a);break;case"esriTimeUnitsMilliseconds":e=o.setMilliseconds(o.getMilliseconds()-a),n=r.setMilliseconds(r.getMilliseconds()-a)}t.time=[e,n]}return t},ke=t=>{var n,i,o,r;if(k){const{layoutId:s,layoutItemId:l}=e,c=(0,a.getAppStore)().getState(),u=null===(r=null===(o=null===(i=null===(n=null==c?void 0:c.appConfig)||void 0===n?void 0:n.layouts)||void 0===i?void 0:i[s])||void 0===o?void 0:o.content)||void 0===r?void 0:r[l];if(!u)return;const d=u.bbox.width;if(d.includes("px"))t=d;else{const e=`div.layout[data-layoutid=${s}]`,n=document.querySelector(e),{clientWidth:a=480}=n||{};t=a*parseInt(d.split("%")[0])/100}}pe(t)},De=a.React.useMemo((()=>null!==re&&Object.keys(re).filter((e=>null===re[e])).length===Object.keys(re).length),[re]),Te=le.length>0,Re=(e,t)=>{S(A)&&re&&re[e]&&re[e].getDataSourceJson().isOutputFromWidget&&Ce(e,t)},Oe=(e,t,n=!1)=>{S(A)&&se((i=>{const o=t||(null==i?void 0:i[e]);if((null==o?void 0:o.getDataSourceJson().isOutputFromWidget)&&Ce(e,t?o.getInfo().status:a.DataSourceStatus.Unloaded),!i&&!t&&n)return i;const r=Object.assign({},i);return(null==i?void 0:i[e])&&!t?delete r[e]:r[e]=t,r}))},Ce=(e,t)=>{ce((n=>{let i=[];return i=t===a.DataSourceStatus.NotReady?n.includes(e)?n:n.concat(e):n.includes(e)?n.filter((t=>t!==e)):n,i}))},Ee=e=>{(null==e?void 0:e.view)&&e.dataSourceId?(K.current=e.dataSourceId,Ne(e.id).then((e=>{Z(e)}))):(K.current="",Z(null))},Ne=e=>Ve(void 0,void 0,void 0,(function*(){const t=i.MapViewManager.getInstance().getJimuMapViewById(e),n=yield t.whenAllJimuLayerViewLoaded(),a={};return Object.keys(n).forEach((e=>{"sublayer"!==n[e].layer.type&&n[e].supportTime()&&(a[e]=n[e])})),a})),Ie=e=>M.formatMessage({id:e,defaultMessage:Fe[e]}),ze=()=>(0,a.jsx)(o.WidgetPlaceholder,{className:"timeline-placeholder",icon:$e,widgetId:y,css:a.css`
          width: ${U?"480px":"inherit"};
          height: ${D||U?Be:"100%"};
        `,message:Ie("_widgetLabel")}),We=a.React.useMemo((()=>function(e){const t={second:"2-digit",minute:"2-digit",hour:"2-digit",day:"numeric",month:"numeric",year:"numeric"},n={};return m.some((a=>(n[a]=t[a],a===e))),n}(I?L:"second")),[I,L]),Ae=re&&A===a.AllDataSourceTypes.WebMap&&ie&&null===he,Ue=(null===(t=null==he?void 0:he.startTime)||void 0===t?void 0:t.value)>(null===(r=null==he?void 0:he.endTime)||void 0===r?void 0:r.value),He=De||Te||ee||Ae||Ue||ve;return!O&&0===(B||[]).length||O&&(!h||0===h.length)||!Te&&he&&(null===(s=null==he?void 0:he.startTime)||void 0===s?void 0:s.value)===(null===(l=null==he?void 0:he.endTime)||void 0===l?void 0:l.value)?ze():(0,a.jsx)(a.React.Fragment,null,(null==B?void 0:B.length)>0&&(0,a.jsx)(i.JimuMapViewComponent,{useMapWidgetId:B[0],onActiveViewChange:Ee}),(null==ne?void 0:ne.length)>0&&(null==ne?void 0:ne.map((e=>(0,a.jsx)(Pe,{key:e.dataSourceId,useDataSource:e,onIsDataSourceNotReady:Re,onCreateDataSourceCreatedOrFailed:Oe})))),He?(()=>{let e="";return e=De?"dataSourceCreateError":Te?"outputDatasAreNotGenerated":ee?"noSupportedLayersInMapWidget":Ae?"noTlFromHonoredMapWarning":ve?"timezoneWarning":"invalidTimeSpanWarning",(0,a.jsx)("div",{className:"placeholder-container w-100 h-100 position-relative"},ze(),(0,a.jsx)(o.Alert,{form:"tooltip",size:"small",type:"warning",withIcon:!0,className:"position-absolute",style:{bottom:10,right:10},text:Ie(e)}))})():O||null!==re?(0,a.jsx)("div",{className:"timeline-widget",css:a.css`
                    width: ${U||k?me+"px":"unset"};
                    height: ${U||D&&!re?Be:"unset"};
                    background: ${F||v.ref.palette.white};
                  `,ref:e=>{fe.current=e}},!U&&(0,a.jsx)(a.ReactResizeDetector,{handleWidth:!0,onResize:ke}),null!==re&&we?he&&me>=0&&(0,a.jsx)(Le,{theme:v,width:me,updating:!!re&&Object.keys(re).filter((e=>{var t;return(null===(t=re[e])||void 0===t?void 0:t.getInfo().status)===a.DataSourceStatus.Loading})).length>0||ue,startTime:null===(c=he.startTime)||void 0===c?void 0:c.value,endTime:null===(u=he.endTime)||void 0===u?void 0:u.value,accuracy:he.accuracy,stepLength:he.stepLength,dividedCount:he.dividedCount,displayStrategy:he.timeDisplayStrategy,timeStyle:P,foregroundColor:V,backgroundColor:F,sliderColor:$,enablePlayControl:C,speed:X,autoPlay:N,dateTimePattern:We,applied:G,onTimeChanged:(e,t)=>{_([e,t])},onApplyStateChanged:e=>{J(e)}}):(0,a.jsx)("div",{className:"jimu-secondary-loading",css:a.css`position: 'absolute';left: '50%';top: '50%';`})):ze())};Ue.versionManager=Ae;const He=Ue;function Ye(e){s.p=e}})(),l})())}}}));