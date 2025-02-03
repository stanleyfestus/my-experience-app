System.register(["jimu-core","jimu-ui/advanced/setting-components","jimu-ui","jimu-arcgis","jimu-for-builder","jimu-ui/advanced/map"],(function(e,t){var a={},s={},i={},n={},o={},l={};return{setters:[function(e){a.React=e.React,a.classNames=e.classNames,a.css=e.css,a.jsx=e.jsx,a.polished=e.polished,a.useIntl=e.useIntl},function(e){s.MapWidgetSelector=e.MapWidgetSelector,s.SettingCollapse=e.SettingCollapse,s.SettingRow=e.SettingRow,s.SettingSection=e.SettingSection},function(e){i.Button=e.Button,i.Checkbox=e.Checkbox,i.Icon=e.Icon,i.Label=e.Label,i.NumericInput=e.NumericInput,i.Radio=e.Radio,i.Switch=e.Switch,i.Tab=e.Tab,i.Tabs=e.Tabs,i.defaultMessages=e.defaultMessages},function(e){n.JimuMapViewComponent=e.JimuMapViewComponent},function(e){o.getAppConfigAction=e.getAppConfigAction},function(e){l.DrawingElevationMode3D=e.DrawingElevationMode3D,l.JimuSymbolType=e.JimuSymbolType,l.useMeasurementsUnitsInfos=e.useMeasurementsUnitsInfos}],execute:function(){e((()=>{var e={31027:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M12 6.5c0 .527-.074 1.036-.212 1.518l.912.438a6.5 6.5 0 1 0-6.586 4.533l-.077-1.008A5.5 5.5 0 1 1 12 6.5m-9 0a3.5 3.5 0 0 0 2.88 3.445L5.8 8.901a2.501 2.501 0 1 1 3.194-2.224l.949.456A3.5 3.5 0 1 0 3 6.5M15.5 11l-5 1-3 4-1-9.5zm-5.57.094-1.702 2.269-.542-5.152 4.76 2.38z" clip-rule="evenodd"></path></svg>'},24974:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#000" d="M6 5a1 1 0 0 0-1 1v1.5a.5.5 0 0 0 1 0V6h3.5v8h-1a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-1V6H14v1.5a.5.5 0 0 0 1 0V6a1 1 0 0 0-1-1z"></path><path fill="#000" fill-rule="evenodd" d="M18 0a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1H2a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" clip-rule="evenodd"></path></svg>'},60846:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m1 0a7 7 0 0 0 7 7 7.01 7.01 0 0 0 7-7A7 7 0 1 0 1 8" clip-rule="evenodd"></path></svg>'},74919:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M7 2h2a2 2 0 0 1 2 2v7.817l-3 2.812-3-2.812V4a2 2 0 0 1 2-2m5 2v8.25L8 16l-4-3.75V4a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3M9 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m1 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0" clip-rule="evenodd"></path></svg>'},42588:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M1 4.429V15h14V1L6.833 7.857zM14 3v11H2V6.114l4.182 2.51a1.2 1.2 0 0 0 1.398-.118z" clip-rule="evenodd"></path></svg>'},86058:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M14.582 5 11 10.949V12H9v-1.274L5.316 7h-.515L2 12.383V14H0v-2h1.073L4 6.374V5h2v1.27L9.688 10h.716L14 4.029V3h2v2z"></path></svg>'},2985:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M2.002 1H14A1 1 0 0 1 15 2.002v11.997A1 1 0 0 1 14 15H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1.002-1M2 14h12V2H2z" clip-rule="evenodd"></path></svg>'},91108:e=>{e.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4IiBoZWlnaHQ9IjcyIiB2aWV3Qm94PSIwIDAgMTA4IDcyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjkyIiBoZWlnaHQ9IjU2IiBmaWxsPSIjMjgyODI4Ii8+DQo8cmVjdCB4PSIxMyIgeT0iNDAiIHdpZHRoPSI1MyIgaGVpZ2h0PSI2IiBmaWxsPSIjNkE2QTZBIi8+DQo8cmVjdCB4PSIxMyIgeT0iMzIiIHdpZHRoPSI4MSIgaGVpZ2h0PSIxIiBmaWxsPSIjNDQ0NDQ0Ii8+DQo8cmVjdCB4PSIxMyIgeT0iNTIiIHdpZHRoPSI4MSIgaGVpZ2h0PSI2IiBmaWxsPSIjNkE2QTZBIi8+DQo8cmVjdCB4PSIxMyIgeT0iMTQiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgcng9IjIiIGZpbGw9IiM2QTZBNkEiLz4NCjxyZWN0IHg9IjI5IiB5PSIxNCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiByeD0iMiIgZmlsbD0iIzZBNkE2QSIvPg0KPHJlY3QgeD0iNDUiIHk9IjE0IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjNkE2QTZBIi8+DQo8cmVjdCB4PSI2MSIgeT0iMTQiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgcng9IjIiIGZpbGw9IiM2QTZBNkEiLz4NCjxyZWN0IHg9Ijc3IiB5PSIxNCIgd2lkdGg9IjEiIGhlaWdodD0iMTIiIGZpbGw9IiM0NDQ0NDQiLz4NCjxyZWN0IHg9IjgyIiB5PSIxNCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiByeD0iMiIgZmlsbD0iIzZBNkE2QSIvPg0KPC9zdmc+DQo="},69125:e=>{e.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4IiBoZWlnaHQ9IjcyIiB2aWV3Qm94PSIwIDAgMTA4IDcyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPHJlY3QgeD0iOCIgeT0iMjYiIHdpZHRoPSI5MiIgaGVpZ2h0PSIyMCIgZmlsbD0iIzI4MjgyOCIvPg0KPHJlY3QgeD0iMTQiIHk9IjMwIiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjNkE2QTZBIi8+DQo8cmVjdCB4PSIzMCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgcng9IjIiIGZpbGw9IiM2QTZBNkEiLz4NCjxyZWN0IHg9IjQ2IiB5PSIzMCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiByeD0iMiIgZmlsbD0iIzZBNkE2QSIvPg0KPHJlY3QgeD0iNjIiIHk9IjMwIiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjNkE2QTZBIi8+DQo8cmVjdCB4PSI3OCIgeT0iMzAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEyIiBmaWxsPSIjNDQ0NDQ0Ii8+DQo8cmVjdCB4PSI4MyIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgcng9IjIiIGZpbGw9IiM2QTZBNkEiLz4NCjwvc3ZnPg0K"},62686:e=>{"use strict";e.exports=n},79244:e=>{"use strict";e.exports=a},4108:e=>{"use strict";e.exports=o},14321:e=>{"use strict";e.exports=i},48993:e=>{"use strict";e.exports=l},79298:e=>{"use strict";e.exports=s}},t={};function r(a){var s=t[a];if(void 0!==s)return s.exports;var i=t[a]={exports:{}};return e[a](i,i.exports,r),i.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var a in t)r.o(t,a)&&!r.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.p="";var c={};return r.p=window.jimuConfig.baseUrl,(()=>{"use strict";r.r(c),r.d(c,{__set_webpack_public_path__:()=>ae,default:()=>te});var e,t,a,s,i=r(79244),n=r(79298),o=r(14321),l=r(62686),d=r(4108);!function(e){e.Panel="Panel",e.Toolbar="Toolbar"}(e||(e={})),function(e){e.Continuous="continuous",e.Update="update"}(t||(t={})),function(e){e.Point="point",e.Polyline="polyline",e.Polygon="polygon",e.Rectangle="rectangle",e.Circle="circle",e.Text="text"}(a||(a={})),function(e){e.Show="show",e.Hide="hide"}(s||(s={}));var g=r(74919),p=r.n(g),m=function(e,t){var a={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(s=Object.getOwnPropertySymbols(e);i<s.length;i++)t.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(e,s[i])&&(a[s[i]]=e[s[i]])}return a};const u=e=>{const t=window.SVG,{className:a}=e,s=m(e,["className"]),n=(0,i.classNames)("jimu-icon jimu-icon-component",a);return t?i.React.createElement(t,Object.assign({className:n,src:p()},s)):i.React.createElement("svg",Object.assign({className:n},s))};var h=r(86058),f=r.n(h),I=function(e,t){var a={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(s=Object.getOwnPropertySymbols(e);i<s.length;i++)t.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(e,s[i])&&(a[s[i]]=e[s[i]])}return a};const w=e=>{const t=window.SVG,{className:a}=e,s=I(e,["className"]),n=(0,i.classNames)("jimu-icon jimu-icon-component",a);return t?i.React.createElement(t,Object.assign({className:n,src:f()},s)):i.React.createElement("svg",Object.assign({className:n},s))};var b=r(42588),x=r.n(b),M=function(e,t){var a={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(s=Object.getOwnPropertySymbols(e);i<s.length;i++)t.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(e,s[i])&&(a[s[i]]=e[s[i]])}return a};const j=e=>{const t=window.SVG,{className:a}=e,s=M(e,["className"]),n=(0,i.classNames)("jimu-icon jimu-icon-component",a);return t?i.React.createElement(t,Object.assign({className:n,src:x()},s)):i.React.createElement("svg",Object.assign({className:n},s))};var v=r(2985),y=r.n(v),S=function(e,t){var a={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(s=Object.getOwnPropertySymbols(e);i<s.length;i++)t.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(e,s[i])&&(a[s[i]]=e[s[i]])}return a};const N=e=>{const t=window.SVG,{className:a}=e,s=S(e,["className"]),n=(0,i.classNames)("jimu-icon jimu-icon-component",a);return t?i.React.createElement(t,Object.assign({className:n,src:y()},s)):i.React.createElement("svg",Object.assign({className:n},s))};var P=r(60846),C=r.n(P),O=function(e,t){var a={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(s=Object.getOwnPropertySymbols(e);i<s.length;i++)t.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(e,s[i])&&(a[s[i]]=e[s[i]])}return a};const D=e=>{const t=window.SVG,{className:a}=e,s=O(e,["className"]),n=(0,i.classNames)("jimu-icon jimu-icon-component",a);return t?i.React.createElement(t,Object.assign({className:n,src:C()},s)):i.React.createElement("svg",Object.assign({className:n},s))};var T=r(24974),R=r.n(T),E=function(e,t){var a={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(s=Object.getOwnPropertySymbols(e);i<s.length;i++)t.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(e,s[i])&&(a[s[i]]=e[s[i]])}return a};const B=e=>{const t=window.SVG,{className:a}=e,s=E(e,["className"]),n=(0,i.classNames)("jimu-icon jimu-icon-component",a);return t?i.React.createElement(t,Object.assign({className:n,src:R()},s)):i.React.createElement("svg",Object.assign({className:n},s))},k=i.React.memo((e=>{const t=i.React.useRef(null),s=[{id:a.Point,icon:u,des:e.intl.formatMessage({id:"drawModePoint",defaultMessage:o.defaultMessages.drawModePoint})},{id:a.Polyline,icon:w,des:e.intl.formatMessage({id:"drawModeLine",defaultMessage:o.defaultMessages.drawModeLine})},{id:a.Polygon,icon:j,des:e.intl.formatMessage({id:"drawModePolygon",defaultMessage:o.defaultMessages.drawModePolygon})},{id:a.Rectangle,icon:N,des:e.intl.formatMessage({id:"drawModeRectangle",defaultMessage:o.defaultMessages.drawModeRectangle})},{id:a.Circle,icon:D,des:e.intl.formatMessage({id:"drawModeCircle",defaultMessage:o.defaultMessages.drawModeCircle})},{id:a.Text,icon:B,des:e.intl.formatMessage({id:"text",defaultMessage:o.defaultMessages.text})}],n=t=>{if(!e.items||!e.items.length)return!1;for(let a=0,s=e.items.length;a<s;a++){if(t===e.items[a])return!0}return!1},l=()=>{r()},r=()=>{const a=[],s=t.current.querySelectorAll("input");for(let e=0,t=s.length;e<t;e++){const t=s[e];t.checked&&a.push(t.getAttribute("data-itemid"))}e.onDrawingToolsChange(a)};return(0,i.jsx)("div",{ref:t,css:(()=>{const t=e.theme;return i.css`
      font-size: 13px;
      font-weight: lighter;
      color: ${t.ref.palette.neutral[1100]};

      .items-option{
        padding: 0;
        margin: 0;
        list-style: none;
        list-style-type: none;
        /*background: ${t.ref.palette.neutral[300]};*/

        .item{
          margin: 6px 0;

          .icon{
            color: ${t.ref.palette.neutral[1e3]};
          }

          .item-label{
            margin: 0;
          }
        }
      }
    `})()},(0,i.jsx)("ul",{className:"items-option",role:"group","aria-label":e.title},(()=>{const e=[];for(let t=0,a=s.length;t<a;t++){const a=s[t],r=n(a.id);e.push((0,i.jsx)("li",{className:"d-flex item",key:"key-"+t},(0,i.jsx)(a.icon,{className:"icon mr-2"}),(0,i.jsx)(o.Label,{className:"d-flex item-label justify-content-between flex-grow-1 text-break","aria-label":a.des},a.des,(0,i.jsx)(o.Switch,{className:"d-flex","data-itemid":a.id,checked:r,onChange:l,"aria-label":a.des}))))}return e})()))}));var H=r(48993);const Z=i.React.memo((e=>{const t=i.React.useRef(null),a=(0,H.useMeasurementsUnitsInfos)(),[s,l]=i.React.useState((()=>{const t=[];return a.forEach((a=>{const s=a.value;let i=Object.assign({},a);const n=e.measurementsUnitsInfos.find((e=>e.value===s));n&&(i=Object.assign(Object.assign({},i),n)),t.push(i)})),t})),r=e=>{const t=[],a=(e=>{let t=0;return s.filter((t=>t.type===e)).forEach((e=>{e.activated&&t++})),t})(e);return s.filter((t=>t.type===e)).forEach(((e,n)=>{const l=(e=>{const t=s.find((t=>t.value===e));return t&&t.activated})(e.value),r=1===a&&l,d=e.note;t.push((0,i.jsx)("li",{className:"d-flex item",key:"key-"+n},(0,i.jsx)(o.Checkbox,{className:"d-flex mr-2","data-itemid":e.value,checked:l,disabled:r,onChange:()=>{c(e.value)},"aria-label":d}),(0,i.jsx)("div",{className:"d-flex mr-4 item-note-wrapper dot-dot-dot"},(0,i.jsx)(o.Label,{className:"item-note dot-dot-dot",title:d,"aria-label":d},d))))})),t},c=t=>{const a=s.map((e=>(t===e.value&&(e.activated=!e.activated),e)));l(a),e.onUnitsSettingChange(a)},d=e.intl.formatMessage({id:"drawUnits",defaultMessage:o.defaultMessages.drawUnits}),g=(0,i.useIntl)().formatMessage({id:"drawModePoint",defaultMessage:o.defaultMessages.drawModePoint}),p=(0,i.useIntl)().formatMessage({id:"drawModeLine",defaultMessage:o.defaultMessages.drawModeLine}),m=(0,i.useIntl)().formatMessage({id:"drawToolAreaTip",defaultMessage:o.defaultMessages.drawToolAreaTip}),[u,h]=i.React.useState();return(0,i.jsx)(n.SettingRow,null,(0,i.jsx)("div",{className:"d-block w-100",role:"group","aria-label":d},(0,i.jsx)(n.SettingRow,{label:d,className:"w-100 mb-2 bold-font-label"}),(0,i.jsx)("div",{ref:t,className:"w-100 mb-2",css:(()=>{const t=e.theme;return i.css`
      font-size: 13px;
      font-weight: lighter;
      width: 100%;
      height: 154px;
      overflow-y: scroll;
      background: ${t.ref.palette.neutral[300]};

      .dot-dot-dot{
        text-align: left;
        justify-content: start;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .util-items{
        list-style: none;
        list-style-type: none;
        /*background: ${t.ref.palette.neutral[300]};*/

        .item{
          margin: 10px 0;
          align-items: center;

          .item-note-wrapper{
            /*width: 80px;*/
            .item-note{
              display: inline-block;
              width: 100%;
            }
          }

          .item-label{
            width: 105px;
          }
        }
      }
    `})()},(0,i.jsx)(o.Tabs,{fill:!0,type:"underline",value:u,onChange:e=>{h(e)}},(0,i.jsx)(o.Tab,{id:H.JimuSymbolType.Point,title:g},(0,i.jsx)("ul",{className:"util-items p-0 mx-2 mb-0",role:"group","aria-label":d},r(H.JimuSymbolType.Point))),(0,i.jsx)(o.Tab,{id:H.JimuSymbolType.Polyline,title:p},(0,i.jsx)("ul",{className:"util-items p-0 mx-2 mb-0",role:"group","aria-label":d},r(H.JimuSymbolType.Polyline))),(0,i.jsx)(o.Tab,{id:H.JimuSymbolType.Polygon,title:m},(0,i.jsx)("ul",{className:"util-items p-0 mx-2 mb-0",role:"group","aria-label":d},r(H.JimuSymbolType.Polygon)))))))})),V=i.React.memo((e=>{const t=(t,a)=>{let s;switch(a){case"point":s=Object.assign(Object.assign({},e.decimalPlaces),{point:t});break;case"line":s=Object.assign(Object.assign({},e.decimalPlaces),{line:t});break;case"area":s=Object.assign(Object.assign({},e.decimalPlaces),{area:t});break;default:throw new Error}e.onDecimalPlacesChange(s)},a=(0,i.useIntl)().formatMessage({id:"decimalPlaces",defaultMessage:o.defaultMessages.decimalPlaces}),s=(0,i.useIntl)().formatMessage({id:"drawModePoint",defaultMessage:o.defaultMessages.drawModePoint}),l=(0,i.useIntl)().formatMessage({id:"drawModeLine",defaultMessage:o.defaultMessages.drawModeLine}),r=(0,i.useIntl)().formatMessage({id:"drawToolAreaTip",defaultMessage:o.defaultMessages.drawToolAreaTip});return(0,i.jsx)("div",{css:i.css`
      .decimal-title {
        .jimu-widget-setting--row-label{
          max-width: 100%;
        }
      }

      .inputs {
        .jimu-widget-setting--row-label{
          width: auto !important;
          margin-bottom: 0;
        }
        .numeric-input {
          width: 56px;
        }
      }
    `,className:"d-block w-100",role:"group","aria-label":a},(0,i.jsx)(n.SettingRow,{label:a,className:"w-100 mb-2 mt-2 decimal-title bold-font-label"}),(0,i.jsx)("div",{className:"inputs"},(0,i.jsx)(n.SettingRow,{flow:"wrap",label:s,className:"w-100"},(0,i.jsx)(o.NumericInput,{size:"sm",className:"numeric-input","aria-label":s,precision:0,min:0,max:10,value:e.decimalPlaces.point,onChange:e=>{t(e,"point")}})),(0,i.jsx)(n.SettingRow,{flow:"wrap",label:l,className:"w-100 mt-2"},(0,i.jsx)(o.NumericInput,{size:"sm",className:"numeric-input","aria-label":l,precision:0,min:0,max:10,value:e.decimalPlaces.line,onChange:e=>{t(e,"line")}})),(0,i.jsx)(n.SettingRow,{flow:"wrap",label:r,className:"w-100 mt-2"},(0,i.jsx)(o.NumericInput,{size:"sm",className:"numeric-input","aria-label":r,precision:0,min:0,max:10,value:e.decimalPlaces.area,onChange:e=>{t(e,"area")}}))))})),W="Arrangement",Q="Panel",A="Toolbar",G="Drawing tools",L="Enable measurement",z="Display drawings in the map layers",J="3D drawing effect",U="Relative to ground",$="Relative to scene",_="On the ground",K=i.React.memo((e=>{const t=(0,i.useIntl)().formatMessage({id:"drawingElevationMode3DTips",defaultMessage:J}),a=(0,i.useIntl)().formatMessage({id:"relativeToGroundTips",defaultMessage:U}),s=(0,i.useIntl)().formatMessage({id:"relativeToSceneTips",defaultMessage:$}),l=(0,i.useIntl)().formatMessage({id:"onTheGroundTips",defaultMessage:_});return(0,i.jsx)(n.SettingSection,{title:t,className:"px-0",role:"group","aria-label":t},(0,i.jsx)(n.SettingRow,{flow:"wrap"},(0,i.jsx)("div",{role:"radiogroup",className:"mb-4"},(0,i.jsx)(o.Label,{className:"d-flex align-items-center",style:{cursor:"pointer"},title:a},(0,i.jsx)(o.Radio,{style:{cursor:"pointer"},className:"m-0 mr-2",title:a,name:"drawingElevationMode3D",onChange:()=>{e.handleDrawingElevationMode3DChange(H.DrawingElevationMode3D.RelativeToGround)},checked:e.drawingElevationMode3D===H.DrawingElevationMode3D.RelativeToGround}),a),(0,i.jsx)(o.Label,{className:"d-flex align-items-center",style:{cursor:"pointer"},title:s},(0,i.jsx)(o.Radio,{style:{cursor:"pointer"},className:"m-0 mr-2",title:s,name:"drawingElevationMode3D",onChange:()=>{e.handleDrawingElevationMode3DChange(H.DrawingElevationMode3D.RelativeToScene)},checked:e.drawingElevationMode3D===H.DrawingElevationMode3D.RelativeToScene}),s),(0,i.jsx)(o.Label,{className:"d-flex align-items-center",style:{cursor:"pointer"},title:l},(0,i.jsx)(o.Radio,{style:{cursor:"pointer"},className:"m-0 mr-2",title:l,name:"drawingElevationMode3D",onChange:()=>{e.handleDrawingElevationMode3DChange(H.DrawingElevationMode3D.OnTheGround)},checked:e.drawingElevationMode3D===H.DrawingElevationMode3D.OnTheGround}),l))))}));function Y(e,t){const a=e.ref.palette.neutral[300],s=e.ref.palette.neutral[1e3];return i.css`
      font-size: 13px;
      font-weight: lighter;

      .jimu-widget-setting--section {
        padding: 18px 16px;
      }

      .ui-mode-setting {
        display: flex;
      }

      /* ui-mode */
      .ui-mode-card-chooser{
        display: flex;
        align-items: start;

        .ui-mode-card-wrapper {
          width: calc((100% - ${10}px - ${8}px) / 2);
        }

        .ui-mode-card-separator {
          width: ${10}px
        }
        .ui-mode-card {
          flex: 1;
          width: 100%;
          background: ${a};
          border: ${2}px solid ${a};
          margin: 0 0 0.5rem 0;

          .jimu-icon {
            margin: 0
          }
        }
        .ui-mode-card.active {
          border: ${2}px solid #00D8ED;
          background-color: ${a} !important;
        }
        .ui-mode-label {
          overflow: hidden;
          text-align: center;
        }
      }

      .placeholder-container{
        height: calc(100% - 180px);

        .placeholder{
          flex-direction: column;

          .icon{
            color: var(--ref-palette-neutral-800);
          }
          .hint{
            font-size: ${t.rem(14)};
            font-weight: 500;
            color: var(--ref-palette-neutral-1000);
            max-width: ${t.rem(160)};
          }
        }

      }

      /* UI for #13051 */
      .bold-font-label {
        .jimu-widget-setting--row-label,
        .setting-row-text-level-1 {
          font-weight: 600 !important;
          color: ${s} !important;
        }
      }

  `}var q=r(31027),F=r.n(q),X=function(e,t){var a={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(s=Object.getOwnPropertySymbols(e);i<s.length;i++)t.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(e,s[i])&&(a[s[i]]=e[s[i]])}return a};const ee=e=>{const t=window.SVG,{className:a}=e,s=X(e,["className"]),n=(0,i.classNames)("jimu-icon jimu-icon-component",a);return t?i.React.createElement(t,Object.assign({className:n,src:F()},s)):i.React.createElement("svg",Object.assign({className:n},s))};class te extends i.React.PureComponent{constructor(t){var a;super(t),this.handleMapWidgetChange=e=>{const t=!!(null==e?void 0:e[0]);this.setState({isSelectedMap:t}),this.props.onSettingChange({id:this.props.id,useMapWidgetIds:e})},this.handleViewsCreate=e=>{let t=0;t=Object.keys(e).findIndex((t=>"3d"===e[t].view.type));const a=t>-1;a!==this.state.have3dViews&&this.setState({have3dViews:a})},this.handleIsDisplayCanvasLayerChange=()=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("isDisplayCanvasLayer",!this.props.config.isDisplayCanvasLayer)})},this.handleArrangementChange=t=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("arrangement",t)}),t===e.Toolbar?(0,d.getAppConfigAction)().editWidgetProperty(this.props.id,"offPanel",!0).exec():(0,d.getAppConfigAction)().editWidgetProperty(this.props.id,"offPanel",!1).exec()},this.handleShowOptionsSettingClick=()=>{this.setState({isShowOptionsSetting:!this.state.isShowOptionsSetting})},this.handleShowAdvancedSettingClick=()=>{this.setState({isShowAdvancedSetting:!this.state.isShowAdvancedSetting})},this.handleDrawToolsChange=e=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("drawingTools",e)})},this.handleIsEnableMeasurementChange=()=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.setIn(["measurementsInfo","enableMeasurements"],!this.props.config.measurementsInfo.enableMeasurements)})},this.handleMeasurementUnitsInfoChange=e=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("measurementsUnitsInfos",e)})},this.handleMDecimalChange=e=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.setIn(["measurementsInfo","decimalPlaces"],e)})},this.handleDrawingElevationMode3DChange=e=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("drawingElevationMode3D",e)})},this.handleIsLayerListModeChange=e=>{const t=e.target.checked?s.Show:s.Hide;this.props.onSettingChange({id:this.props.id,config:this.props.config.setIn(["layerListMode"],t)})},this.state={isSelectedMap:!!(null===(a=this.props.useMapWidgetIds)||void 0===a?void 0:a[0]),isShowOptionsSetting:!0,isShowAdvancedSetting:!1,have3dViews:!1}}render(){var t,a,c;const d=this.props.id+"-ui-mode-description",g=this.props.id+"-ui-mode-0",p=this.props.id+"-ui-mode-1",m=this.props.intl.formatMessage({id:"selectMapWidget",defaultMessage:o.defaultMessages.selectMapWidget}),u=this.props.intl.formatMessage({id:"selectMapHint",defaultMessage:o.defaultMessages.selectMapHint}),h=this.props.intl.formatMessage({id:"arrangementTips",defaultMessage:W}),f=this.props.intl.formatMessage({id:"panelTips",defaultMessage:Q}),I=this.props.intl.formatMessage({id:"toolbarTips",defaultMessage:A}),w=this.props.intl.formatMessage({id:"options",defaultMessage:o.defaultMessages.options}),b=this.props.intl.formatMessage({id:"drawingToolsTips",defaultMessage:G}),x=this.props.intl.formatMessage({id:"isEnableMeasurementsTips",defaultMessage:L}),M=this.props.intl.formatMessage({id:"advance",defaultMessage:o.defaultMessages.advance}),j=this.props.intl.formatMessage({id:"displayDrawings",defaultMessage:z});return(0,i.jsx)("div",{css:Y(this.props.theme,i.polished),className:"widget-setting-menu jimu-widget-setting"},(0,i.jsx)(n.SettingSection,{title:m,className:(0,i.classNames)("map-selector-section",{"border-0":!this.state.isSelectedMap})},(0,i.jsx)(n.SettingRow,null,(0,i.jsx)(n.MapWidgetSelector,{onSelect:this.handleMapWidgetChange,useMapWidgetIds:this.props.useMapWidgetIds})),(0,i.jsx)("div",{className:"jimu-map-view"},(0,i.jsx)(l.JimuMapViewComponent,{useMapWidgetId:null===(t=this.props.useMapWidgetIds)||void 0===t?void 0:t[0],onViewsCreate:this.handleViewsCreate}))),!this.state.isSelectedMap&&(0,i.jsx)("div",{className:"d-flex placeholder-container justify-content-center align-items-center"},(0,i.jsx)("div",{className:"d-flex text-center placeholder justify-content-center align-items-center "},(0,i.jsx)(ee,{size:48,className:"d-flex icon mb-2"}),(0,i.jsx)("p",{className:"hint"},u))),this.state.isSelectedMap&&(0,i.jsx)(i.React.Fragment,null,(0,i.jsx)(n.SettingSection,{title:h},(0,i.jsx)(n.SettingRow,{role:"group","aria-label":h},(0,i.jsx)("div",{className:"ui-mode-card-chooser"},(0,i.jsx)(o.Label,{className:"d-flex flex-column ui-mode-card-wrapper"},(0,i.jsx)(o.Button,{type:"tertiary",icon:!0,className:(0,i.classNames)("ui-mode-card",{active:this.props.config.arrangement===e.Panel}),onClick:()=>{this.handleArrangementChange(e.Panel)},"aria-labelledby":g,"aria-describedby":d,disableHoverEffect:!0,disableRipple:!0,title:f},(0,i.jsx)(o.Icon,{width:100,height:72,icon:r(91108),autoFlip:!0})),(0,i.jsx)("div",{id:g,className:"mx-1 text-break ui-mode-label"},f)),(0,i.jsx)("div",{className:"ui-mode-card-separator"}),(0,i.jsx)(o.Label,{className:"d-flex flex-column ui-mode-card-wrapper"},(0,i.jsx)(o.Button,{type:"tertiary",icon:!0,className:(0,i.classNames)("ui-mode-card",{active:this.props.config.arrangement===e.Toolbar}),onClick:()=>{this.handleArrangementChange(e.Toolbar)},"aria-labelledby":p,"aria-describedby":d,disableHoverEffect:!0,disableRipple:!0,title:I},(0,i.jsx)(o.Icon,{width:100,height:72,icon:r(69125),autoFlip:!0})),(0,i.jsx)("div",{id:p,className:"mx-1 text-break ui-mode-label"},I))))),(0,i.jsx)(n.SettingSection,null,(0,i.jsx)(n.SettingCollapse,{label:w,isOpen:this.state.isShowOptionsSetting,onRequestOpen:this.handleShowOptionsSettingClick,onRequestClose:this.handleShowOptionsSettingClick},(0,i.jsx)(i.React.Fragment,null,(0,i.jsx)(n.SettingSection,{title:b,className:"px-0 bold-font-label",role:"group","aria-label":b},(0,i.jsx)(k,{theme:this.props.theme,intl:this.props.intl,title:b,items:this.props.config.drawingTools.asMutable(),onDrawingToolsChange:this.handleDrawToolsChange})),(0,i.jsx)(n.SettingSection,{className:"px-0 pb-0"},(0,i.jsx)(n.SettingRow,{label:x,className:"bold-font-label"},(0,i.jsx)(o.Switch,{checked:this.props.config.measurementsInfo.enableMeasurements,onChange:this.handleIsEnableMeasurementChange,"aria-label":x})),this.props.config.measurementsInfo.enableMeasurements&&(0,i.jsx)(Z,{theme:this.props.theme,intl:this.props.intl,measurementsUnitsInfos:null===(a=this.props.config.measurementsUnitsInfos)||void 0===a?void 0:a.asMutable(),onUnitsSettingChange:this.handleMeasurementUnitsInfoChange}),this.props.config.measurementsInfo.enableMeasurements&&(0,i.jsx)(V,{decimalPlaces:this.props.config.measurementsInfo.decimalPlaces,onDecimalPlacesChange:this.handleMDecimalChange}))))),(0,i.jsx)(n.SettingSection,null,(0,i.jsx)(n.SettingCollapse,{label:M,isOpen:this.state.isShowAdvancedSetting,onRequestOpen:this.handleShowAdvancedSettingClick,onRequestClose:this.handleShowAdvancedSettingClick},(0,i.jsx)(i.React.Fragment,null,(0,i.jsx)(n.SettingSection,{className:"px-0"},(0,i.jsx)(n.SettingRow,{label:j,className:"bold-font-label"},(0,i.jsx)(o.Switch,{checked:(null!==(c=this.props.config.layerListMode)&&void 0!==c?c:s.Hide)===s.Show,onChange:this.handleIsLayerListModeChange,"aria-label":j}))),this.state.have3dViews&&(0,i.jsx)(K,{drawingElevationMode3D:this.props.config.drawingElevationMode3D,handleDrawingElevationMode3DChange:this.handleDrawingElevationMode3DChange}))))))}}function ae(e){r.p=e}})(),c})())}}}));