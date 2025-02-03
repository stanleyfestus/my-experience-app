System.register(["jimu-core","jimu-theme","jimu-ui","jimu-for-builder"],(function(e,t){var i={},s={},o={},n={};return{setters:[function(e){i.ReactRedux=e.ReactRedux,i.classNames=e.classNames,i.css=e.css,i.hooks=e.hooks,i.jsx=e.jsx,i.polished=e.polished},function(e){s.ThemeSwitchComponent=e.ThemeSwitchComponent,s.useTheme=e.useTheme,s.useTheme2=e.useTheme2,s.useUseTheme2=e.useUseTheme2},function(e){o.Link=e.Link,o.defaultMessages=e.defaultMessages},function(e){n.getAppConfigAction=e.getAppConfigAction}],execute:function(){e((()=>{"use strict";var e={79244:e=>{e.exports=i},4108:e=>{e.exports=n},1888:e=>{e.exports=s},14321:e=>{e.exports=o}},t={};function r(i){var s=t[i];if(void 0!==s)return s.exports;var o=t[i]={exports:{}};return e[i](o,o.exports,r),o.exports}r.d=(e,t)=>{for(var i in t)r.o(t,i)&&!r.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var u={};r.r(u),r.d(u,{default:()=>g});var l=r(79244),a=r(1888),d=r(14321),c=r(4108);const m=["default","primary","secondary","tertiary","danger","link"],p=(e,t)=>l.css`
    width: 360px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: ${e.sys.spacing[3]};
    padding: ${e.sys.spacing[5]};
    .button-item{
      width: 100%;
      font-size: ${l.polished.rem(13)};
    }
    .quick-style-item{
      padding: ${e.sys.spacing[2]};
      margin: 2px;
      &.quick-style-item-selected{
        outline: 2px solid ${t.sys.color.primary.light};
      }
      background-color: ${e.sys.color.surface.background};
        cursor: pointer;
    }
  `,g={QuickStyle:e=>{var t,i,s;const{widgetId:o}=e,n=l.ReactRedux.useSelector((e=>{var t;return null===(t=(e.appStateInBuilder?e.appStateInBuilder:e).appConfig.widgets[o])||void 0===t?void 0:t.config})),r=!(null===(t=null==n?void 0:n.styleConfig)||void 0===t?void 0:t.useCustom)&&(null===(s=null===(i=null==n?void 0:n.styleConfig)||void 0===i?void 0:i.themeStyle)||void 0===s?void 0:s.quickStyleType),u=(0,a.useTheme)(),g=(0,a.useTheme2)(),f=(0,a.useUseTheme2)(),y=window.jimuConfig.isBuilder!==f?g:u,h=window.jimuConfig.isBuilder!==f?u:g,v=l.hooks.useTranslation(d.defaultMessages);return(0,l.jsx)("div",{css:p(y,h)},(0,l.jsx)(a.ThemeSwitchComponent,{useTheme2:window.jimuConfig.isBuilder},m.map(((e,t)=>(0,l.jsx)("div",{key:t,className:(0,l.classNames)("quick-style-item",{"quick-style-item-selected":r===e}),onClick:()=>{(e=>{let t=n.setIn(["styleConfig","useCustom"],!1);t=t.setIn(["styleConfig","themeStyle","quickStyleType"],e),t=t.set("styleConfig",t.styleConfig.without("customStyle")),(0,c.getAppConfigAction)().editWidgetConfig(o,t).exec()})(e)}},(0,l.jsx)(d.Link,{title:v("variableButton"),role:"button",className:"button-item text-truncate",type:e},v("variableButton")))))))}};return u})())}}}));