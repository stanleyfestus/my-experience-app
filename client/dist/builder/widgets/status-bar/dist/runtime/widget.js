System.register(["jimu-core","jimu-for-builder","jimu-layouts/layout-builder","jimu-ui","jimu-ui/advanced/setting-components"],(function(e,t){var a={},o={},r={},n={},i={};return{setters:[function(e){a.BrowserSizeMode=e.BrowserSizeMode,a.DialogMode=e.DialogMode,a.ErrorBoundary=e.ErrorBoundary,a.GridItemType=e.GridItemType,a.LayoutItemType=e.LayoutItemType,a.LayoutParentType=e.LayoutParentType,a.LayoutType=e.LayoutType,a.PagePart=e.PagePart,a.PageType=e.PageType,a.React=e.React,a.ReactRedux=e.ReactRedux,a.appActions=e.appActions,a.classNames=e.classNames,a.css=e.css,a.getAppStore=e.getAppStore,a.hooks=e.hooks,a.jsx=e.jsx,a.utils=e.utils},function(e){o.builderAppSync=e.builderAppSync,o.getAppConfigAction=e.getAppConfigAction},function(e){r.getLabelOfGridTab=e.getLabelOfGridTab},function(e){n.Button=e.Button,n.Dropdown=e.Dropdown,n.DropdownButton=e.DropdownButton,n.DropdownItem=e.DropdownItem,n.DropdownMenu=e.DropdownMenu,n.Icon=e.Icon,n.Popper=e.Popper,n.Switch=e.Switch,n.Tooltip=e.Tooltip,n.defaultMessages=e.defaultMessages,n.styleUtils=e.styleUtils},function(e){i.changeCurrentDialog=e.changeCurrentDialog,i.changeCurrentPage=e.changeCurrentPage}],execute:function(){e((()=>{var e={2221:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M14 1H8v3H7V1H1v6h3v1H1v6h6v-3h1v3h6V8h-3V7h3zM1 0a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg>'},4072:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M14 1v13H1V7.46l2.138 2.348a.508.508 0 0 0 .752-.684L2.867 8H6V7H2.794l1.023-1.124a.508.508 0 0 0-.752-.685L1 7.46V1zm0-1a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1zm-1.867 7L11.11 5.876a.508.508 0 1 1 .752-.684L14 7.54l-2.065 2.268a.508.508 0 0 1-.751-.684L12.206 8H9V7z" clip-rule="evenodd"></path></svg>'},2943:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M4.653 13.854a.485.485 0 0 1 0-.708L10.24 8 4.653 2.854a.485.485 0 0 1 0-.708.54.54 0 0 1 .738 0l5.956 5.5a.485.485 0 0 1 0 .708l-5.956 5.5a.54.54 0 0 1-.738 0" clip-rule="evenodd"></path></svg>'},4502:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M0 7.5A.5.5 0 0 1 .5 7h14a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5"></path></svg>'},3662:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M7.5 0a.5.5 0 0 0-.5.5V7H.5a.5.5 0 0 0 0 1H7v6.5a.5.5 0 0 0 1 0V8h6.5a.5.5 0 0 0 0-1H8V.5a.5.5 0 0 0-.5-.5"></path></svg>'},5508:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6.5 7.5A.5.5 0 0 1 7 7h1.5v4.5h1a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h1V8H7a.5.5 0 0 1-.5-.5"></path><path fill="#000" fill-rule="evenodd" d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m0-1A7 7 0 1 0 8 1a7 7 0 0 0 0 14" clip-rule="evenodd"></path></svg>'},9244:e=>{"use strict";e.exports=a},4108:e=>{"use strict";e.exports=o},6055:e=>{"use strict";e.exports=r},4321:e=>{"use strict";e.exports=n},9298:e=>{"use strict";e.exports=i}},t={};function l(a){var o=t[a];if(void 0!==o)return o.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,l),r.exports}l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},l.d=(e,t)=>{for(var a in t)l.o(t,a)&&!l.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.p="";var s={};return l.p=window.jimuConfig.baseUrl,(()=>{"use strict";l.r(s),l.d(s,{__set_webpack_public_path__:()=>Z,default:()=>_});var e=l(9244),t=l(4321),a=l(4108);var o=l(9298);function r(a){const{pageId:o,label:r,isInFolder:n,isFolder:i,isActive:l,hasSubPage:s,onSelect:p}=a,c=e.React.useCallback((()=>{p(o)}),[o,p]);return(0,e.jsx)(t.DropdownItem,{className:(0,e.classNames)({"page-item":!i||s,"in-folder":n,folder:i&&!s,"has-subpage":s,active:l}),active:l,header:i&&!s,onClick:c},(0,e.jsx)("div",{className:"text-truncate w-100",title:r},r))}function n(e){(0,o.changeCurrentPage)(e)}function i(t){const o=e.ReactRedux.useSelector((e=>{var t,a;return null===(a=null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appConfig)||void 0===a?void 0:a.pageStructure})),i=[];if(o){const t=(0,a.getAppConfigAction)().appConfig.pages;o.forEach((a=>{var o,r;const n=Object.keys(a)[0],l=t[n];if(l.type===e.PageType.Normal)if((null===(o=a[n])||void 0===o?void 0:o.length)>0){const o=[];a[n].forEach((a=>{const r=t[a];r.type===e.PageType.Normal&&o.push({pageId:a,label:r.label,isInFolder:!0})})),o.length>0?(i.push({pageId:n,label:l.label,isFolder:!0,hasSubPage:!0}),i.push(...o)):i.push({pageId:n,label:l.label})}else i.push({pageId:n,label:l.label});else if(l.type===e.PageType.Folder){const o=[];(null===(r=a[n])||void 0===r?void 0:r.length)>0&&a[n].forEach((a=>{const r=t[a];r.type===e.PageType.Normal&&o.push({pageId:a,label:r.label,isInFolder:!0})})),o.length>0&&(i.push({pageId:n,label:l.label,isFolder:!0}),i.push(...o))}}))}return(0,e.jsx)(e.React.Fragment,null,i.map((a=>(0,e.jsx)(r,Object.assign({key:a.pageId,onSelect:n,isActive:a.pageId===t.currentPageId},a)))))}function p(e){(0,o.changeCurrentDialog)(e)}function c(a){const o=e.ReactRedux.useSelector((e=>{var t,a;return null===(a=null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appConfig)||void 0===a?void 0:a.dialogs}));if(!o||0===Object.keys(o).length)return null;const r=[],n=[];return Object.keys(o).forEach((t=>{var a,i;const l=o[t];l.mode===e.DialogMode.Fixed?r.push({id:t,label:l.label,index:null!==(a=l.index)&&void 0!==a?a:0}):l.mode===e.DialogMode.Anchored&&n.push({id:t,label:l.label,index:null!==(i=l.index)&&void 0!==i?i:0})})),r.sort(((e,t)=>e.index-t.index)),n.sort(((e,t)=>e.index-t.index)),(0,e.jsx)(e.React.Fragment,null,(0,e.jsx)(t.DropdownItem,{header:!0,className:"page-header"},a.formatMessage("dialog")),(0,e.jsx)(t.DropdownItem,{className:"folder",header:!0},a.formatMessage("fixedWindows")),r.map((o=>(0,e.jsx)(t.DropdownItem,{key:o.id,className:(0,e.classNames)("page-item in-folder",{active:a.currentDialogId===o.id}),active:a.currentDialogId===o.id,onClick:()=>{p(o.id)}},(0,e.jsx)("div",{className:"text-truncate w-100",title:o.label},o.label)))),(0,e.jsx)(t.DropdownItem,{className:"folder",header:!0},a.formatMessage("anchoredWindows")),n.map((o=>(0,e.jsx)(t.DropdownItem,{key:o.id,className:(0,e.classNames)("page-item in-folder",{active:a.currentDialogId===o.id}),active:a.currentDialogId===o.id,onClick:()=>{p(o.id)}},(0,e.jsx)("div",{className:"text-truncate w-100",title:o.label},o.label)))))}var u=l(4502),d=l.n(u),g=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const m=t=>{const a=window.SVG,{className:o}=t,r=g(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:n,src:d()},r)):e.React.createElement("svg",Object.assign({className:n},r))};var h=l(3662),f=l.n(h),v=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const y=t=>{const a=window.SVG,{className:o}=t,r=v(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:n,src:f()},r)):e.React.createElement("svg",Object.assign({className:n},r))};var x=l(4072),b=l.n(x),w=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const j=t=>{const a=window.SVG,{className:o}=t,r=w(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:n,src:b()},r)):e.React.createElement("svg",Object.assign({className:n},r))};var I=l(2221),S=l.n(I),P=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const O=t=>{const a=window.SVG,{className:o}=t,r=P(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:n,src:S()},r)):e.React.createElement("svg",Object.assign({className:n},r))};var N=l(5508),k=l.n(N),T=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const C=t=>{const a=window.SVG,{className:o}=t,r=T(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:n,src:k()},r)):e.React.createElement("svg",Object.assign({className:n},r))},R={fixedLayoutTip:"Auto-calculate element tab orders in fixed layouts",fixedLayoutDesc:"For widgets in full-screen pages or fixed layouts (e.g., Fixed Panel, Card, List, etc.), turning on this option will automatically calculate their tab orders based on positions so that they sync up with the visual order for a better experience when it comes to accessibility support. This option will affect the overlay of widgets, so you may want to move certain elements forward or backward for desired results."};function M(o){const{open:r,reference:n,onToggle:i}=o,l=e.hooks.useTranslation(R),s=e.ReactRedux.useSelector((e=>{var t,a;return null===(a=null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appConfig)||void 0===a?void 0:a.useAutoSortInFixedLayout})),p=e.React.useCallback((e=>{(0,a.getAppConfigAction)().setUseAutoSortInFixedLayout(e.target.checked).exec()}),[]);return(0,e.jsx)(t.Popper,{open:r,reference:n,placement:"top-end",offset:[0,10],toggle:i,css:e.css`
        width: 300px;
        padding: 16px;
        background-color: var(--ref-palette-neutral-500);
        color: var(--ref-palette-neutral-1100);
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        border: 1px solid var(--ref-palette-neutral-600);;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
        border-radius: 3px;
      `},(0,e.jsx)("div",{className:"builder-setting-content d-flex align-items-center"},(0,e.jsx)("label",{className:"flex-grow-1",htmlFor:"fixed-tab-order-tip"},l("fixedLayoutTip")),(0,e.jsx)("div",{className:"d-flex align-items-center ml-auto"},(0,e.jsx)(t.Tooltip,{title:l("fixedLayoutDesc")},(0,e.jsx)(t.Button,{icon:!0,disableRipple:!0,disableHoverEffect:!0,type:"tertiary"},(0,e.jsx)(C,null))),(0,e.jsx)(t.Switch,{checked:s,onChange:p,id:"fixed-tab-order-tip"}))))}var z=l(6055),B=l(2943),L=l.n(B),D=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const A=t=>{const a=window.SVG,{className:o}=t,r=D(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:n,src:L()},r)):e.React.createElement("svg",Object.assign({className:n},r))};function E(o){const{layoutId:r,layoutItemId:n}=o,i=e.hooks.useTranslation(t.defaultMessages),l=e.ReactRedux.useSelector((t=>function(t,a,o,r){const n=t.layouts[a].content[o];switch(n.type){case e.LayoutItemType.Widget:{const e=n.widgetId;return e?t.widgets[e].label:r("placeholder")}case e.LayoutItemType.Section:const a=n.sectionId;return t.sections[a].label;case e.LayoutItemType.ScreenGroup:const o=n.screenGroupId;return t.screenGroups[o].label}const i=t.layouts[a];if(i.type===e.LayoutType.GridLayout){const a=n,l=i.content[n.parent];return(null==l?void 0:l.gridType)!==e.GridItemType.Tab||a.gridType!==e.GridItemType.Column&&a.gridType!==e.GridItemType.Row?a.gridType===e.GridItemType.Column?r("gridCol"):a.gridType===e.GridItemType.Row?r("gridRow"):r("tab"):(0,z.getLabelOfGridTab)(t,{layoutId:i.id,layoutItemId:o},r)}return r("none")}(t.appStateInBuilder.appConfig,r,n,i)),e.ReactRedux.shallowEqual),s=e.React.useCallback((()=>{a.builderAppSync.publishChangeSelectionToApp({layoutId:r,layoutItemId:n})}),[r,n]);return(0,e.jsx)(t.Button,{type:"tertiary",className:"h-100 bread-node text-truncate",onClick:s},(0,e.jsx)("span",{className:"sep"},(0,e.jsx)(A,{size:"s",autoFlip:!0})),(0,e.jsx)("span",{className:"bread-label"},l))}function G(){const t=e.ReactRedux.useSelector((e=>{var t,a;return null===(a=null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appRuntimeInfo)||void 0===a?void 0:a.selection}),e.ReactRedux.shallowEqual),o=e.ReactRedux.useSelector((a=>{var o;if(t){const{layoutId:r}=t,n=null===(o=a.appStateInBuilder)||void 0===o?void 0:o.appConfig.layouts[r];return n.type===e.LayoutType.GridLayout?n:null}return null}),e.ReactRedux.shallowEqual),r=e.ReactRedux.useSelector((e=>{var t;return null===(t=e.appStateInBuilder)||void 0===t?void 0:t.browserSizeMode})),n=e.React.useCallback(((t,a)=>{var o,i,l;if(!a.parent)return null;const{type:s,id:p}=a.parent,{mainSizeMode:c}=t;switch(s){case e.LayoutParentType.View:{const e=t.views[p],a=t.sections[e.parent],i=null!==(o=a.parent[r])&&void 0!==o?o:a.parent[c];if(1===i.length)return i[0];const l=i[0].layoutId,s=t.layouts[l];return n(t,s)}case e.LayoutParentType.Screen:{const e=t.screens[p],a=t.screenGroups[e.parent];return null!==(i=a.parent[r])&&void 0!==i?i:a.parent[c]}case e.LayoutParentType.Widget:{const e=t.widgets[p],a=null!==(l=e.parent[r])&&void 0!==l?l:e.parent[c];if(1===a.length)return a[0];const o=a[0].layoutId,i=t.layouts[o];return n(t,i)}default:return null}}),[r]),i=e.React.useCallback(((t,a)=>{const o=[];let r=t.content[a].parent;for(;null!=r;){const a=t.content[r];a.gridType===e.GridItemType.Row||(a.gridType,e.GridItemType.Column),o.push({layoutId:t.id,layoutItemId:r}),r=a.parent}return o}),[]),l=e.React.useCallback(((t,o)=>{const{layoutId:r,layoutItemId:l}=t,s=(0,a.getAppConfigAction)().appConfig,p=[];let c=s.layouts[r];if(p.push(t),c.type===e.LayoutType.GridLayout){const e=i(c,l);e.length>0&&p.push(...e)}let u=n(s,c);for(;null!=u;){if(c=s.layouts[u.layoutId],p.push(u),c.type===e.LayoutType.GridLayout){const e=i(c,u.layoutItemId);e.length>0&&p.push(...e)}u=n(s,c)}return p.reverse().map(((t,a)=>(0,e.jsx)(E,{key:a,layoutId:t.layoutId,layoutItemId:t.layoutItemId})))}),[n,i]),s=e.css`
    margin-left: 32px;
    max-width: calc(100% - 550px);

    .nav {
      display: flex;
      white-space: nowrap;
      overflow: hidden;
    }

    .bread-node {
      flex: 0 auto;
      flex-shrink: 1000;
      display: inline-block;
      line-height: 16px;

      &:hover {
        flex: 1 0 auto;
        .sep svg {
          transform: translatex(4px);
          transition: transform ease-in-out .3s;
        }
      }

      &:first-of-type {
        flex: 0 0 auto;
        flex-shrink: 0.5;
        .sep {
          display: none;
        }
      }

      &:last-of-type {
        flex: 1 0 auto !important;
        &:hover {
          flex: 1 0 auto !important;
        }
      }

      .bread-label {
        font-size: 13px;
        flex: 0 1 auto;
      }

      .sep {
        padding-left: 4px;
        padding-right: 4px;
      }
    }
  `;return null==(null==t?void 0:t.layoutId)||null==t.layoutItemId?null:(0,e.jsx)("div",{className:"breadcrumb d-flex",css:s},(0,e.jsx)("nav",{className:"nav"},(0,e.jsx)(e.ErrorBoundary,null,l(t,o))))}const F="right-sidebar",V=.5,H=100;class $ extends e.React.PureComponent{constructor(o){super(o),this.formatMessage=(e,t)=>this.props.intl.formatMessage({id:e},t),this.onPreviewScaleChange=e=>{e.stopPropagation();const t=this.fromRangeToZoomScale(Number(e.currentTarget.value));this.updateScale(t)},this.zoomOut=e=>{e.stopPropagation();const{zoomScale:t}=this.props,a=Math.round(100*t),o=10*Math.floor(a/10);let r;r=a===o?t-.1:o/100,r=Math.round(10*r)/10,r=Math.max(V,r),this.updateScale(r)},this.zoomIn=e=>{e.stopPropagation();const{zoomScale:t}=this.props,a=Math.round(100*t),o=10*Math.ceil(a/10);let r;r=a===o?t+.1:o/100,r=Math.round(10*r)/10,r=Math.min(2,r),this.updateScale(r)},this.zoomToFit=e=>{e.stopPropagation();const{viewportSize:t}=this.props;let a=this.calAvailableWidth()/t.width;a=Math.floor(100*a)/100,a=Math.max(.5,Math.min(2,a)),this.updateScale(a)},this.zoomToNormal=e=>{e.stopPropagation(),this.updateScale(1)},this.stopPropagation=e=>{e.stopPropagation()},this.toggleSettingPanel=()=>{(0,e.getAppStore)().dispatch(e.appActions.widgetStatePropChange(F,"collapse",!this.props.settingPanelVisible))},this.toggleTabConfigPopper=()=>{this.setState({isTabConfigPopperOpen:!this.state.isTabConfigPopperOpen})},this.onDropDownToggle=e=>{const{isPageListOpen:t}=this.state;this.setState({isPageListOpen:!t}),e.stopPropagation()},this.handlePageListItemClick=(e,t)=>{e.stopPropagation();const{currentPageId:o}=this.props;t!==o&&(a.builderAppSync.publishChangeSelectionToApp(null),a.builderAppSync.publishPageChangeToApp(t))},this.getDropdownStyle=()=>e.css`
      padding: unset;
      max-width: 240px;

      .page-header {
        height: 2rem;
        background-color: var(--ref-palette-neutral-600);
        color: var(--ref-palette-neutral-1100) !important;
        font-size: 14px;
        line-height: 2rem;
        display: flex !important;
        align-items: center;
      }

      .page-item {
        font-size: 13px;
        color: var(--ref-palette-black) !important;
        padding: 0 24px !important;
        height: 2rem;

        &:not(.active):hover {
          background: var(--ref-palette-neutral-600) !important;
        }

        &.active {
          background: var(--sys-color-primary-main);
        }
      }

      .folder {
        font-size: 13px;
        color: var(--ref-palette-neutral-1000) !important;
        padding: 0 !important;
        margin: 0 24px;
        height: 2rem;
        line-height: 2rem;
      }

      .page-header,
      .folder {
        &:focus {
          outline: none;
        }
      }

      .in-folder {
        padding-left: 2.25rem !important;
      }
    `,this.renderPageList=()=>{var a;const{isPageListOpen:o}=this.state,{pages:r,currentPageId:n,currentDialogId:l,currentDialogLabel:s}=this.props,p=l?s:null===(a=null==r?void 0:r[n])||void 0===a?void 0:a.label;return(0,e.jsx)("div",{className:"d-flex page-list align-items-center ml-4"},(0,e.jsx)("div",{className:"page-label"},l?this.formatMessage("dialog"):this.formatMessage("page"),":"),(0,e.jsx)(t.Dropdown,{direction:"up",size:"sm",toggle:this.onDropDownToggle,isOpen:o,menuItemCheckMode:"singleCheck"},(0,e.jsx)(t.DropdownButton,{className:"text-truncate",title:p,css:e.css`max-width: 240px; font-size: 12px;`,size:"sm",type:"tertiary"},p),(0,e.jsx)(t.DropdownMenu,{css:this.getDropdownStyle()},(0,e.jsx)(t.DropdownItem,{header:!0,className:"page-header"},this.formatMessage("page")),(0,e.jsx)(i,{currentPageId:l?null:n}),(0,e.jsx)(c,{currentDialogId:l,formatMessage:this.formatMessage}))))},this.state={isPageListOpen:!1,isTabConfigPopperOpen:!1}}calAvailableWidth(){const e=document.querySelector('div[data-widgetid="app-loader"]').getBoundingClientRect();let a=parseFloat(t.styleUtils.remToPixel("3rem"));isNaN(a)&&(a=48);return e.width-a-10}updateScale(e){a.builderAppSync.publishChangeZoomScaleToApp(e)}percentageZoomScale(){const{zoomScale:t}=this.props;return e.utils.formatPercentageNumber(`${Math.round(100*t)}%`)}mapStep(){return.1}fromZoomScaleToRange(e){return e<1?50*(e-V)/.5+0:e>1?50*(e-1)/1+50:50}fromRangeToZoomScale(e){return e<50?.5*(e-0)/50+V:e>50?1*(e-50)/50+1:1}calBackground(){const t=100*(this.fromZoomScaleToRange(this.props.zoomScale)-0)/100+"%",a=`linear-gradient(to right, var(--ref-palette-neutral-1000) 0%, var(--ref-palette-neutral-1000) ${t}, var(--ref-palette-neutral-700) ${t}, var(--ref-palette-neutral-600))`;return e.css`
      &::-webkit-slider-runnable-track {
        background: ${a} !important;
      }
      &::-moz-range-track {
        background: ${a} !important;
      }
      &::-ms-track {
        background: ${a} !important;
      }
    `}render(){const{zoomScale:a,settingPanelVisible:o,useAutoSortInFixedLayout:r,activePagePart:n}=this.props;return(0,e.jsx)("div",{css:(i=this.props.theme,e.css`
    overflow: hidden;
    height: 100%;
    background-color: var(--sys-color-secondary-main);
    border-top: 1px solid var(--ref-palette-neutral-700);

    .zoom-section {
      .percentage-label {
        width: 4rem;
        color: var(--ref-palette-neutral-1100);
      }
      .form-control-range {
        margin: 0 8px 1px;
      }
    }

    .a11y-btn {
      font-size: 12px;
      height: 16px;
      line-height: 16px;
      &.active {
        background-color: var(--sys-color-primary-main) !important;
      }
    }

    .btn {
      padding: 0 0 2px;
      display: inline-block;

      .jimu-icon {
        margin-right: 0;
        margin-left: 0;
      }
    }
    .jimu-dropdown-button {
      line-height: 16px;
      height: 18px;
    }

    .setting-panel-visible {
      background-color: var(--ref-palette-neutral-600);
      .btn {
        color: var(--ref-palette-black);
      }
    }

    .jimu-dropdown .jimu-icon {
      transform: rotate(180deg);
    }

    .page-list {
      .page-label {
        color: var(--ref-palette-neutral-1100);
        font-size: 12px;
        margin-right: 8px;
      }
      .icon-btn {
        color: var(--ref-palette-neutral-1100);
        &:hover {
          color: var(--ref-palette-black);
        }
        .jimu-icon {
          margin-left: 6px;
        }
      }
    }

    input[type='range'] {
      -webkit-appearance: none;
      background: transparent;
    }
    input[type='range']:focus {
      outline: none;
    }
    input[type='range']::-webkit-slider-runnable-track {
      width: 100%;
      height: 2px;
      cursor: pointer;
      background: var(--ref-palette-neutral-700);
      border-radius: 2px;
    }
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 12px;
      width: 12px;
      border-radius: 6px;
      cursor: pointer;
      background: var(--ref-palette-neutral-400);
      border: 2px solid var(--ref-palette-neutral-1000);
      margin-top: -5px;

      &:hover {
        border-color: var(--ref-palette-black);
      }
    }
    input[type='range']:focus::-webkit-slider-runnable-track {
      background: var(--ref-palette-neutral-700);
    }
    input[type='range']::-moz-range-track {
      width: 100%;
      height: 2px;
      cursor: pointer;
      background: var(--ref-palette-neutral-700);
      border-radius: 2px;
    }
    input[type='range']::-moz-range-thumb {
      height: 10px;
      width: 10px;
      border-radius: 8px;
      cursor: pointer;
      background: var(--ref-palette-neutral-400);
      border: 2px solid var(--ref-palette-neutral-1000);
      margin-top: -5px;
      &:hover {
        border-color: var(--ref-palette-black);
      }
    }
    input[type='range']::-ms-track {
      width: 100%;
      height: 2px;
      cursor: pointer;
      background: ${null===(l=null==i?void 0:i.ref.palette)||void 0===l?void 0:l.neutral[700]};
      border-radius: 2px;
    }
    input[type='range']::-ms-thumb {
      height: 10px;
      width: 10px;
      border-radius: 8px;
      cursor: pointer;
      background: ${null===(s=null==i?void 0:i.ref.palette)||void 0===s?void 0:s.neutral[400]};
      border: 2px solid ${null===(p=null==i?void 0:i.ref.palette)||void 0===p?void 0:p.neutral[1e3]};
      margin-top: 0px;
      &:hover {
        border-color: ${null===(c=null==i?void 0:i.ref.palette)||void 0===c?void 0:c.black};
      }
    }
  `),className:"jimu-widget widget-status-bar d-flex"},!window.isExpressBuilder&&n===e.PagePart.Body&&this.renderPageList(),!window.isExpressBuilder&&(0,e.jsx)(G,null),(0,e.jsx)("div",{className:"zoom-section flex-grow-1 d-flex justify-content-end align-items-center"},!window.isExpressBuilder&&(0,e.jsx)(e.React.Fragment,null,(0,e.jsx)(t.Button,{type:"tertiary",onClick:this.toggleTabConfigPopper,className:(0,e.classNames)("a11y-btn mr-2 px-1",{active:r}),ref:e=>{this.a11yBtn=e}},"A11Y"),(0,e.jsx)(M,{open:this.state.isTabConfigPopperOpen,reference:this.a11yBtn,onToggle:this.toggleTabConfigPopper})),(0,e.jsx)(t.Button,{type:"tertiary",disabled:a<=V,title:this.formatMessage("zoomOut"),onClick:this.zoomOut},(0,e.jsx)(m,{size:"s"})),(0,e.jsx)("input",{css:this.calBackground(),type:"range",className:"form-control-range",min:0,max:H,step:this.mapStep(),value:this.fromZoomScaleToRange(a),onClick:this.stopPropagation,onChange:this.onPreviewScaleChange}),(0,e.jsx)(t.Button,{type:"tertiary",disabled:a>=2,title:this.formatMessage("zoomIn"),onClick:this.zoomIn},(0,e.jsx)(y,{size:"s"})),(0,e.jsx)(t.Dropdown,{direction:"up",size:"sm",className:"ml-2"},(0,e.jsx)(t.DropdownButton,{size:"sm",type:"tertiary"},this.percentageZoomScale()),(0,e.jsx)(t.DropdownMenu,{css:e.css`min-width: 5rem;`},[200,175,150,125,100,75,50].map((a=>(0,e.jsx)(t.DropdownItem,{className:"justify-content-center",key:a,onClick:()=>{this.updateScale(a/100)}},e.utils.formatPercentageNumber(`${a}%`)))))),(0,e.jsx)(t.Button,{type:"tertiary",className:"ml-2",onClick:this.zoomToNormal,title:this.formatMessage("zoomToNormal")},(0,e.jsx)(O,{size:"s",className:"m-0"})),(0,e.jsx)(t.Button,{type:"tertiary",className:"ml-2",onClick:this.zoomToFit,title:this.formatMessage("zoomToFit")},(0,e.jsx)(j,{size:"s",className:"m-0"}))),(0,e.jsx)("div",{className:(0,e.classNames)("setting-panel-section d-flex justify-content-center align-items-center ml-5 mr-2",{"setting-panel-visible":o})},(0,e.jsx)(t.Button,{type:"tertiary",title:o?this.formatMessage("closeSettingPanel"):this.formatMessage("openSettingPanel"),className:"px-2",onClick:this.toggleSettingPanel},(0,e.jsx)(t.Icon,{icon:"./widgets/status-bar/dist/runtime/assets/setting-panel.svg",width:12,height:12,className:"m-0",autoFlip:!0}))));var i,l,s,p,c}}$.mapExtraStateProps=(t,a)=>{var o,r,n,i,l,s,p,c,u,d,g,m,h,f,v,y,x,b,w,j,I,S,P;const O=null!==(n=null===(r=null===(o=t.appStateInBuilder)||void 0===o?void 0:o.appRuntimeInfo)||void 0===r?void 0:r.zoomScale)&&void 0!==n?n:1,N=null!==(l=null===(i=t.appStateInBuilder)||void 0===i?void 0:i.browserSizeMode)&&void 0!==l?l:e.BrowserSizeMode.Large,k=e.utils.findViewportSize(null===(s=t.appStateInBuilder)||void 0===s?void 0:s.appConfig,N),T=null===(c=null===(p=null==t?void 0:t.appStateInBuilder)||void 0===p?void 0:p.appConfig)||void 0===c?void 0:c.pages,C=null===(d=null===(u=null==t?void 0:t.appStateInBuilder)||void 0===u?void 0:u.appConfig)||void 0===d?void 0:d.useAutoSortInFixedLayout,R=null===(m=null===(g=null==t?void 0:t.appStateInBuilder)||void 0===g?void 0:g.appConfig)||void 0===m?void 0:m.pageStructure,M=null===(f=null===(h=null==t?void 0:t.appStateInBuilder)||void 0===h?void 0:h.appRuntimeInfo)||void 0===f?void 0:f.currentPageId,z=null===(y=null===(v=null==t?void 0:t.appStateInBuilder)||void 0===v?void 0:v.appRuntimeInfo)||void 0===y?void 0:y.currentDialogId,B=z?null===(x=null==t?void 0:t.appStateInBuilder)||void 0===x?void 0:x.appConfig.dialogs[z].label:null,L=null!==(w=null===(b=null==t?void 0:t.appStateInBuilder)||void 0===b?void 0:b.appRuntimeInfo.activePagePart)&&void 0!==w?w:e.PagePart.Body;return{zoomScale:O,viewportSize:k,settingPanelVisible:null===(S=null===(I=null===(j=t.widgetsState)||void 0===j?void 0:j[F])||void 0===I?void 0:I.collapse)||void 0===S||S,pages:T,pageStructure:R,currentPageId:M,currentDialogId:z,currentDialogLabel:B,activePagePart:L,useAutoSortInFixedLayout:C,locale:null===(P=null==t?void 0:t.appContext)||void 0===P?void 0:P.locale}};const _=$;function Z(e){l.p=e}})(),s})())}}}));