System.register(["jimu-core","jimu-for-builder","jimu-theme","jimu-ui","jimu-ui/advanced/resource-selector","jimu-ui/advanced/setting-components","jimu-ui/advanced/style-setting-components","jimu-ui/basic/color-picker"],(function(e,t){var a={},l={},n={},o={},s={},r={},c={},i={};return{setters:[function(e){a.CONSTANTS=e.CONSTANTS,a.Immutable=e.Immutable,a.React=e.React,a.ReactRedux=e.ReactRedux,a.ThemeThemeAlertColorKeys=e.ThemeThemeAlertColorKeys,a.ThemeThemeColorKeys=e.ThemeThemeColorKeys,a.classNames=e.classNames,a.css=e.css,a.hooks=e.hooks,a.i18n=e.i18n,a.injectIntl=e.injectIntl,a.jsx=e.jsx,a.polished=e.polished,a.urlUtils=e.urlUtils,a.useIntl=e.useIntl,a.utils=e.utils},function(e){l.getAppConfigAction=e.getAppConfigAction,l.helpUtils=e.helpUtils},function(e){n.colorUtils=e.colorUtils,n.createReferencePaletteColor=e.createReferencePaletteColor,n.defaultFonts=e.defaultFonts,n.getSchemeColor=e.getSchemeColor,n.getTheme2Module=e.getTheme2Module,n.mapping=e.mapping,n.styled=e.styled,n.useTheme=e.useTheme,n.useTheme2=e.useTheme2,n.utils=e.utils},function(e){o.Button=e.Button,o.Checkbox=e.Checkbox,o.CollapsablePanel=e.CollapsablePanel,o.Dropdown=e.Dropdown,o.DropdownButton=e.DropdownButton,o.DropdownItem=e.DropdownItem,o.DropdownMenu=e.DropdownMenu,o.Label=e.Label,o.PanelHeader=e.PanelHeader,o.Popper=e.Popper,o.Select=e.Select,o.Slider=e.Slider,o.Switch=e.Switch,o.Tab=e.Tab,o.Tabs=e.Tabs,o.Tooltip=e.Tooltip,o.Typography=e.Typography,o.defaultMessages=e.defaultMessages,o.hooks=e.hooks,o.useTrapFocusByBoundaryNodes=e.useTrapFocusByBoundaryNodes},function(e){s.ImageSelector=e.ImageSelector},function(e){r.SettingRow=e.SettingRow,r.SettingSection=e.SettingSection},function(e){c.FontFamilySelector=e.FontFamilySelector,c.InputUnit=e.InputUnit},function(e){i.ColorPicker=e.ColorPicker,i.PickerBlock=e.PickerBlock}],execute:function(){e((()=>{var e={7213:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M16 2.443 5.851 14 0 8.115l1.45-1.538 4.31 4.334L14.463 1z" clip-rule="evenodd"></path></svg>'},1594:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="m2.556 4.75.297 9.75c0 .398.164.78.455 1.06.292.282.688.44 1.1.44h7.184c.412 0 .808-.158 1.1-.44.291-.28.455-.662.455-1.06l.297-9.75zm4.333 8.222a.778.778 0 1 1-1.556 0V7.778a.778.778 0 1 1 1.556 0zm3.667 0a.778.778 0 1 1-1.556 0V7.778a.778.778 0 1 1 1.556 0zM12.058 2.5a1 1 0 0 1-.766-.357l-.659-.786A1 1 0 0 0 9.867 1H6.133a1 1 0 0 0-.766.357l-.659.786a1 1 0 0 1-.766.357H2a1 1 0 0 0-1 1V4h14v-.5a1 1 0 0 0-1-1z"></path></svg>'},6300:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M15 7.5a.52.52 0 0 1-.516.527H2.976L6.473 11.6a.535.535 0 0 1 0 .746.51.51 0 0 1-.73 0L1 7.5l4.743-4.846a.51.51 0 0 1 .73 0 .535.535 0 0 1 0 .746L2.976 6.973h11.508c.285 0 .516.236.516.527"></path></svg>'},655:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M2.146 4.653a.485.485 0 0 1 .708 0L8 10.24l5.146-5.587a.485.485 0 0 1 .708 0 .54.54 0 0 1 0 .738l-5.5 5.956a.485.485 0 0 1-.708 0l-5.5-5.956a.54.54 0 0 1 0-.738" clip-rule="evenodd"></path></svg>'},2943:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M4.653 13.854a.485.485 0 0 1 0-.708L10.24 8 4.653 2.854a.485.485 0 0 1 0-.708.54.54 0 0 1 .738 0l5.956 5.5a.485.485 0 0 1 0 .708l-5.956 5.5a.54.54 0 0 1-.738 0" clip-rule="evenodd"></path></svg>'},2046:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M11.227 1.312c-.404-.404-1.045-.417-1.432-.03L2.49 8.587l-.48 2.674a.637.637 0 0 0 .73.73l2.673-.48 7.305-7.306c.387-.387.374-1.028-.03-1.431zm-8.114 9.575.32-1.781 4.991-4.992 1.462 1.462-4.992 4.991zm7.473-6.012 1.402-1.4-1.462-1.463-1.401 1.402z" clip-rule="evenodd"></path><path fill="#000" d="M1.5 14a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1z"></path></svg>'},4811:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0m1 0A7 7 0 1 1 1 8a7 7 0 0 1 14 0M7.5 4.5a.5.5 0 0 1 1 0v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3z" clip-rule="evenodd"></path></svg>'},6745:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m1 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.676 2.228H7.34c-.213-1.138.621-2.13 1.375-3.025C9.28 6.532 9.8 5.914 9.8 5.328 9.8 4.5 9.2 3.9 7.976 3.9c-.816 0-1.572.36-2.268 1.092l-.648-.6C5.852 3.552 6.788 3 8.096 3c1.692 0 2.772.864 2.772 2.244 0 .864-.652 1.628-1.3 2.387-.71.831-1.413 1.655-1.244 2.597m.3 2.172c0 .48-.348.792-.768.792-.432 0-.78-.312-.78-.792s.348-.804.78-.804c.42 0 .768.324.768.804" clip-rule="evenodd"></path></svg>'},9244:e=>{"use strict";e.exports=a},4108:e=>{"use strict";e.exports=l},1888:e=>{"use strict";e.exports=n},4321:e=>{"use strict";e.exports=o},5809:e=>{"use strict";e.exports=s},9298:e=>{"use strict";e.exports=r},5562:e=>{"use strict";e.exports=c},4337:e=>{"use strict";e.exports=i}},t={};function m(a){var l=t[a];if(void 0!==l)return l.exports;var n=t[a]={exports:{}};return e[a](n,n.exports,m),n.exports}m.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return m.d(t,{a:t}),t},m.d=(e,t)=>{for(var a in t)m.o(t,a)&&!m.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},m.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),m.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},m.p="";var u={};return m.p=window.jimuConfig.baseUrl,(()=>{"use strict";m.r(u),m.d(u,{__set_webpack_public_path__:()=>dt,default:()=>ut});var e=m(9244),t=m(4108),a=m(1888);const l=a.styled.div`
  height: 100%;
  flex: 1;
  overflow: auto;
`,n=t=>{const{active:a,children:n}=t;return e.React.createElement(l,{className:(0,e.classNames)("stepper",{"d-none":!a})},a&&n)};var o=m(4321),s=m(7213),r=m.n(s),c=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const i=t=>{const a=window.SVG,{className:l}=t,n=c(t,["className"]),o=(0,e.classNames)("jimu-icon jimu-icon-component",l);return a?e.React.createElement(a,Object.assign({className:o,src:r()},n)):e.React.createElement("svg",Object.assign({className:o},n))},d=t=>{var a,l;const{className:n,themeInfo:s,selectedTheme:r,onSelect:c}=t,m=s.uri===r,u=null!==(l=null===(a=s.i18nLabel)||void 0===a?void 0:a[window.locale])&&void 0!==l?l:s.label,d=s.font,p=((t,a)=>e.React.useMemo((()=>{var l,n,o;return e.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    > .btn {
      width: 100%;
      height:auto;
      background: var(--ref-palette-neutral-300);
      border: 2px solid transparent;
      &:hover {
        border: 2px solid transparent;
      }
      &:not(:disabled):not(.disabled):active,
      &:not(:disabled):not(.disabled).active {
        background: var(--ref-palette-neutral-300);
        border: 2px solid var(--sys-color-primary-light);
      }
      > .theme-preview {
        width: 100%;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: url(${t}) no-repeat center;
        background-size: cover;
        .theme-preview--inner {
          font-size: small;
          text-align: center;
          line-height: 1;
          > img {
            width: 100%;
          }
          label {
            margin-bottom: 0;
            line-height: 1.25;
            font-size: 1.25rem;
            font-family: ${null!==(l=null==a?void 0:a.fontFamily)&&void 0!==l?l:"inherit"};
            font-weight: ${null!==(n=null==a?void 0:a.fontWeight)&&void 0!==n?n:"inherit"};
            color: ${null!==(o=null==a?void 0:a.color)&&void 0!==o?o:"inherit"};
          }
        }
        > label {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 100%;
          margin-top: .5rem;
          margin-bottom: 1rem;
        }
      }
    }
    > label {
      margin-bottom: 0;
      margin-top: 0.25rem;
    }
    + .theme-card {
      margin-left: 1rem;
    }
    &.active {
      position: relative;
      .check-ribbon {
        position: absolute;
        padding: .25rem;
        background: var(--sys-color-primary-light);
        inline-size: inherit;
        line-height: 1;
        z-index: 1;
        right: 0px;
        top: 0px;
        color: var(--ref-palette-white);
      }
    }
  `}),[a,t]))(`../${s.uri}thumbnail.png`,d),h=(0,e.classNames)("theme-selector-card",n,{active:m});return(0,e.jsx)("div",{className:h,css:p},m&&(0,e.jsx)("span",{className:"check-ribbon"},(0,e.jsx)(i,{"aria-hidden":"true"})),(0,e.jsx)(o.Button,{className:"p-0",onClick:()=>{null==c||c(s.uri)},active:m,"aria-label":u,"aria-selected":m},(0,e.jsx)("div",{className:"theme-preview",title:u},(0,e.jsx)("div",{className:"theme-preview--inner text-break"},(0,e.jsx)(o.Label,{className:"mx-4"},u)))))},p={chooseTheme:"Theme",customTheme:"Customize",resetTheme:"Reset",backToMainThemePanel:"Back",customPaletteTitle:"Customize palette colors",customFontsetTitle:"Customize font set",customAppElementsTitle:"App elements"};var h=m(6745),f=m.n(h),g=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const b=t=>{const a=window.SVG,{className:l}=t,n=g(t,["className"]),o=(0,e.classNames)("jimu-icon jimu-icon-component",l);return a?e.React.createElement(a,Object.assign({className:o,src:f()},n)):e.React.createElement("svg",Object.assign({className:o},n))},v=a.styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  .themes-pane {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    flex: 1 1 0%;
    > .themes-selectors {
      display: flex;
      flex-direction: column;
      > .theme-selector-card + .theme-selector-card {
        margin-top: 1rem;
      }
    }
  }
  > .btn-container {
    display: flex;
    > button {
      font-size: 1rem;
    }
  }
  .theme-help-link {
    color: var(--ref-palette-neutral-1000);
  }
  .theme-help-link:hover {
    color: var(--ref-palette-black);
  }
`,y=e.React.forwardRef(((a,l)=>{const n=e.hooks.useTranslation(p,o.defaultMessages),s=(0,e.useIntl)(),r=n("chooseTheme"),c=n("help"),[i,m]=e.React.useState("#");return e.React.useEffect((()=>{t.helpUtils.getBuildAppsHelpLink("change-app-theme").then((e=>{m(e)}))}),[]),e.React.createElement("div",{className:"d-flex justify-content-between align-items-center w-100"},e.React.createElement("div",{className:"title text-truncate mr-2",title:r},r),e.React.createElement(o.Button,{ref:l,size:"sm",variant:"text",icon:!0,title:c,"aria-label":c,href:i,target:"_blank",disableRipple:!0,disableHoverEffect:!0,className:(0,e.classNames)("theme-help-link p-0")},e.React.createElement(b,{autoFlip:!e.i18n.isSameLanguage(null==s?void 0:s.locale,"he")})))})),R=t=>{const{className:a,themeListInfo:l,disabled:n,selectedTheme:s,onChange:r,onCustomize:c}=t,i=o.hooks.useNewThemeFeatures(!1),m=(0,e.classNames)("theme-selector",a),u=e.hooks.useTranslation(p,o.defaultMessages),h=e.React.useMemo((()=>l.filter((e=>!e.isNewTheme))),[l]),f=e.React.useMemo((()=>l.filter((e=>e.isNewTheme))),[l]),g=e.React.useMemo((()=>i?h.concat(f):h),[i,h,f]);return e.React.createElement(v,{className:m},e.React.createElement(o.PanelHeader,{className:"px-4 pt-4",title:e.React.createElement(y,null),showClose:!1}),g&&e.React.createElement("div",{className:"themes-pane px-4 mt-4"},e.React.createElement("div",{className:"themes-selectors",role:"group","aria-label":u("chooseTheme")},g.map((t=>e.React.createElement(d,{key:t.name,selectedTheme:s,themeInfo:t,onSelect:r}))))),g&&e.React.createElement("div",{className:"btn-container w-100 p-4"},e.React.createElement(o.Button,{type:"primary",className:"flex-fill theme-setting--customize-btn text-truncate",onClick:()=>{null==c||c(s)},disabled:n,"aria-label":u("customTheme")},u("customTheme"))),!g&&e.React.createElement("div",{className:"loading"},u("loading")))};var w=m(9298),N=m(2046),E=m.n(N),x=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const C=t=>{const a=window.SVG,{className:l}=t,n=x(t,["className"]),o=(0,e.classNames)("jimu-icon jimu-icon-component",l);return a?e.React.createElement(a,Object.assign({className:o,src:E()},n)):e.React.createElement("svg",Object.assign({className:o},n))};var O=m(4337),k=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const j=(0,a.styled)(O.ColorPicker)((e=>{var t;return`\n    width: 3rem;\n    height: 3rem;\n    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.15);\n    transition: box-shadow 0.15s ease-out;\n    border-radius: 100%;\n    outline: 0;\n    color: white;\n    background-color: ${null!==(t=e.color)&&void 0!==t?t:"var(--light-500)"};\n    &:hover {\n      box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);\n    }\n  `})),S=t=>{const{className:a}=t,l=k(t,["className"]),n=(0,e.classNames)(a,"primary-color-picker");return e.React.createElement(j,Object.assign({className:n,icon:e.React.createElement(C,null),type:"icon-only"},l))},T=t=>{const{className:a,label:l,value:n,onChange:o}=t,s=(0,e.classNames)("single-color-configurator",a,"d-flex flex-column");return e.React.createElement("div",{className:s},e.React.createElement("div",{className:"jumbo-color-picker"},e.React.createElement(S,{className:"mx-auto mb-2",color:n,onChange:o})),e.React.createElement("label",null,l))};var P=m(5562);const I=a.styled.div((({theme:e})=>{var t,a,l,n,o,s,r;return`\n    position: relative;\n    padding-bottom: 1.5rem;\n    > i {\n      font-style: normal;\n      min-width: 1.25rem;\n      text-align: center;\n    }\n    .slider-rules {\n      position: absolute;\n      bottom: 0;\n      left: 2.25rem;\n      right: 2.25rem;\n      font-size: ${null===(a=null===(t=null==e?void 0:e.typography)||void 0===t?void 0:t.sizes)||void 0===a?void 0:a.body2};\n      color: ${null===(n=null===(l=null==e?void 0:e.colors)||void 0===l?void 0:l.palette)||void 0===n?void 0:n.dark[400]};\n      > span {\n        display: inline-block;\n        transform: translateX(-50%);\n        position: absolute;\n        bottom: 0;\n        &.active {\n          color: ${null===(o=null==e?void 0:e.body)||void 0===o?void 0:o.color};\n          font-size: ${null===(r=null===(s=null==e?void 0:e.typography)||void 0===s?void 0:s.sizes)||void 0===r?void 0:r.body1};\n          margin-bottom: -1px;\n        }\n      }\n    }\n  `}));class z extends e.React.PureComponent{constructor(){super(...arguments),this.onFontSizeChange=e=>{const t=e.currentTarget.value,a=this.props.options[t-1];this.props&&this.props.onChange&&this.props.onChange(a)},this.i18n=e=>{const t=this.props.intl;return t?t.formatMessage({id:e,defaultMessage:o.defaultMessages[e]}):e}}render(){const{fontSize:t,options:a,className:l}=this.props,n=(0,e.classNames)("setting--fontsize-selector",l,"d-flex align-items-center"),s=null===window||void 0===window?void 0:window._appState.appContext.isRTL,r=a?a.length:1,c=a.length>1?100/(a.length-1):0;let i=1;return a&&a.some(((e,a)=>e===t&&(i=a+1,!0))),e.React.createElement(I,{className:n},(null==a?void 0:a.length)>0?e.React.createElement(e.React.Fragment,null,e.React.createElement("i",{style:{fontSize:"12px"}},"A"),e.React.createElement(o.Slider,{title:this.i18n("variableFontSizeBase"),"aria-label":this.i18n("variableFontSizeBase"),min:1,max:r,value:i,className:"mx-4",onChange:this.onFontSizeChange}),e.React.createElement("div",{className:"slider-rules"},a.map(((t,a)=>e.React.createElement("span",{key:a,className:i===a+1?"active":void 0,style:{[s?"right":"left"]:a*c+"%"}},e.utils.formatPercentageNumber(t))))),e.React.createElement("i",{style:{fontSize:"18px"}},"A")):null)}}z.defaultProps={options:["87.5%","100%","125%"]};const M=(0,e.injectIntl)(z),F=["75%","87.5%","100%","125%"];class B extends e.React.PureComponent{constructor(){super(...arguments),this.onFontChange=e=>{this.props.onChange({typography:{fontFamilyBase:e}})},this.onFontSizeChange=e=>{this.props.onChange({typography:{fontSizeRoot:e}})},this.i18n=e=>{const t=this.props.intl;return t?t.formatMessage({id:e,defaultMessage:o.defaultMessages[e]}):e}}render(){var t,a;const{className:l,themeVariables:n}=this.props,o=(0,e.classNames)("jimu-builder-theme-fontset-configurator",l,"w-100");let s=null===(t=null==n?void 0:n.typography)||void 0===t?void 0:t.fontFamilyBase;return"string"==typeof s&&(s=s.split(",")[0].replace(/['"]+/g,"")),e.React.createElement("div",{className:o},e.React.createElement(w.SettingRow,null,e.React.createElement(P.FontFamilySelector,{font:s,"aria-label":this.i18n("themeSettingThemeFont"),onChange:e=>{this.onFontChange(e)}})),e.React.createElement(w.SettingRow,null,e.React.createElement(M,{className:"w-100",fontSize:null===(a=null==n?void 0:n.typography)||void 0===a?void 0:a.fontSizeRoot,options:F,onChange:e=>{this.onFontSizeChange(e)}})))}}const A=(0,e.injectIntl)(B);var L=m(2943),$=m.n(L),V=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const D=t=>{const a=window.SVG,{className:l}=t,n=V(t,["className"]),o=(0,e.classNames)("jimu-icon jimu-icon-component",l);return a?e.React.createElement(a,Object.assign({className:o,src:$()},n)):e.React.createElement("svg",Object.assign({className:o},n))};var _=m(6300),U=m.n(_),H=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const K=t=>{const a=window.SVG,{className:l}=t,n=H(t,["className"]),o=(0,e.classNames)("jimu-icon jimu-icon-component",l);return a?e.React.createElement(a,Object.assign({className:o,src:U()},n)):e.React.createElement("svg",Object.assign({className:o},n))},G=a.styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  .theme-quick-style {
    height: 100%;
    flex: 1 1 0%;
    overflow: auto;
  }
  .back-main-btn {
    font-size: 1rem;
    font-weight: 500;
    > svg {
      position: relative;
      top: -2px;
    }
  }
`,q=t=>{var a;const{className:l,theme:n,onChange:s,onReset:r,onBack:c,onAdvance:i}=t,m=e.hooks.useTranslation(p,o.defaultMessages),u=(0,e.classNames)("jimu-builder-theme-quickstyler",l),d=e.React.useRef(null),h=e.React.useRef(null);e.React.useEffect((()=>{d.current.focus()}),[]),(0,o.useTrapFocusByBoundaryNodes)(d,h);return e.React.createElement(G,{className:u},e.React.createElement("div",{className:"jimu-widget-setting--header px-1 pb-0"},e.React.createElement(o.Button,{ref:d,className:"back-main-btn",type:"tertiary",onClick:c,"aria-label":m("backToMainThemePanel")},e.React.createElement(K,{className:"mr-1",autoFlip:!0}),m("backToMainThemePanel"))),n&&e.React.createElement(e.React.Fragment,null,e.React.createElement("div",{className:"theme-quick-style"},e.React.createElement(w.SettingSection,{title:m("themeSettingThemeColors"),role:"group","aria-label":m("themeSettingThemeColors")},e.React.createElement(w.SettingRow,{flow:"wrap",className:"justify-content-center"},e.React.createElement(T,{label:m("variableColorPrimary"),"aria-label":m("variableColorPrimary"),value:null===(a=null==n?void 0:n.colors)||void 0===a?void 0:a.primary,className:"m-auto",onChange:e=>{((e,t)=>{null==s||s({colors:{[e]:t}})})("primary",e)}})),e.React.createElement(w.SettingRow,null,e.React.createElement(o.Button,{type:"tertiary",className:"w-100 p-0 d-flex justify-content-between align-items-center",onClick:i,"aria-label":m("themeSettingThemeColorAdvanced")},m("themeSettingThemeColorAdvanced"),e.React.createElement(D,{className:"m-0",autoFlip:!0})))),e.React.createElement(w.SettingSection,{title:m("themeSettingThemeFont")},e.React.createElement(w.SettingRow,null,e.React.createElement(A,{themeVariables:n,onChange:s})))),e.React.createElement(w.SettingSection,{className:"d-flex"},e.React.createElement(o.Button,{ref:h,className:"flex-fill",type:"secondary",onClick:r,"aria-label":m("resetTheme")},m("resetTheme")))))};var W=m(655),X=m.n(W),Y=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const J=t=>{const a=window.SVG,{className:l}=t,n=Y(t,["className"]),o=(0,e.classNames)("jimu-icon jimu-icon-component",l);return a?e.React.createElement(a,Object.assign({className:o,src:X()},n)):e.React.createElement("svg",Object.assign({className:o},n))},Q=a.styled.div((({color:e})=>`\n    width: 2rem;\n    height: 1.25rem;\n    background: ${e};\n    margin-left: -1px;\n  `)),Z=t=>{const{colors:a,hideAlertColors:l,darkTheme:n}=t,o=e.React.useMemo((()=>{const t=[];let o,s;return Object.keys(e.ThemeThemeColorKeys).forEach(((n,r)=>{const c=Object.keys(e.ThemeThemeAlertColorKeys);l&&c.includes(n)||("Dark"===n?o=r:"Light"===n&&(s=r),t.push(e.React.createElement(Q,{key:n,className:"color-palette-block border border-light-800",color:a[e.ThemeThemeColorKeys[n]]})))})),n&&o>-1&&s>-1&&([t[o],t[s]]=[t[s],t[o]]),t}),[a,n,l]);return e.React.createElement(e.React.Fragment,null,a?e.React.createElement("div",{className:"color-palette d-flex flex-fill"},o):e.React.createElement("span",null,"---"))};class ee extends e.React.PureComponent{constructor(t){super(t),this._optionsToKeep=(0,e.Immutable)([]),this.getColorPaletteOptions=t=>{const a=[];let l=!1;const n=this.props.isDarkTheme;if(n&&(t=t.merge({light:t.dark,dark:t.light})),this._optionsToKeep.concat(te).forEach(((s,r)=>{const c=t.merge(s);let i=!1;l||(l=this.arePalettesEqual(t,c),l&&(i=!0)),a.push(e.React.createElement(o.DropdownItem,{className:"py-2",onClick:()=>{this.onPaletteClick(c)},key:r+1,active:i,"aria-label":`${this.i18n("customColors")} ${r+1}`},e.React.createElement(Z,{colors:c,hideAlertColors:!1,darkTheme:n})))})),!l){const l=e.React.createElement(o.DropdownItem,{className:"py-2",onClick:()=>{this.onPaletteClick(t)},key:0,active:!0},e.React.createElement(Z,{colors:t,hideAlertColors:!1,darkTheme:n}));a.splice(0,0,l),this._optionsToKeep=(0,e.Immutable)([t])}return a},this.i18n=e=>{const t=this.props.intl;return t?t.formatMessage({id:e,defaultMessage:o.defaultMessages[e]}):e},this.state={menuOpened:!1}}onPaletteClick(e){this.props&&this.props.onChange&&this.props.onChange(e)}arePalettesEqual(e,t){if(!e||!t)return!1;return!Object.keys(e).some((a=>e[a].toLowerCase()!==t[a].toLowerCase()))}render(){const{colors:t,className:a,style:l}=this.props,n=(0,e.classNames)("setting--palette-selector",a);return e.React.createElement(o.Dropdown,{style:l,direction:"right",isOpen:this.state.menuOpened,toggle:e=>{this.setState({menuOpened:!this.state.menuOpened})},className:n,activeIcon:!0,menuItemCheckMode:"singleCheck"},e.React.createElement(o.DropdownButton,{type:"tertiary",className:"p-0","aria-label":this.i18n("variableCustomPalette"),arrow:e.React.createElement(J,null)}),e.React.createElement(o.DropdownMenu,null,this.getColorPaletteOptions(t)))}}const te=(0,e.Immutable)([{primary:"#0a77c6",secondary:"#ecf1f8",info:"#4aa0e2",success:"#7ed321",warning:"#f8e71c",danger:"#f6143a",light:"#f8f8f8",dark:"#080808"},{primary:"#ff7121",secondary:"#2d1754",info:"#09acf8",success:"#00cca5",warning:"#ffab21",danger:"#f6146f",light:"#fff",dark:"#333"},{primary:"#21cfca",secondary:"#242933",info:"#00b7ff",success:"#07ea58",warning:"#f8e71c",danger:"#d0021b",light:"#fff",dark:"#000"},{primary:"#f74d61",secondary:"#153054",info:"#00b7ff",success:"#07ea58",warning:"#f8e71c",danger:"#ff001f",light:"#fff",dark:"#111"},{primary:"#4ccded",secondary:"#1b476d",info:"#00b7ff",success:"#07ea58",warning:"#f8e71c",danger:"#d0021b",light:"#fff",dark:"#111"},{primary:"#442b57",secondary:"#ffd11c",info:"#09acf8",success:"#00cca5",warning:"#ffab21",danger:"#f6146f",light:"#fff",dark:"#2d3235"}]),ae=(0,e.injectIntl)(ee);var le=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const ne=(0,a.styled)("div",{shouldForwardProp:e=>"color"!==e})((t=>e.css`
    width: 20px;
    height: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    color: ${t.color};
    .color-picker-block {
      width: unset;
      height: unset;
      padding: 0px;
      border-radius: 100%;
      .color-block {
        border-radius: 100%;
        width: unset;
        height: unset;
        .color-presenter {
          outline: 1px solid rgba(255,255,255, 0.15);
          transition: outline .15s ease-out;
          border-radius: 100%;
          margin: -2px;
          width: 20px;
          height: 20px;
          border-width: 0;
          &:hover {
            outline: 3px solid rgba(255,255,255,.5);
          }
        }
      }
    }
    .cert {
      display: block;
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-top-color: currentColor;
      border-bottom-width: 0;
    }
  `)),oe=e.React.forwardRef(((t,a)=>{const{className:l,color:n}=t,o=le(t,["className","color"]);return e.React.createElement(ne,{className:(0,e.classNames)("custom-color-picker",l),color:n},e.React.createElement(O.ColorPicker,Object.assign({color:n},o,{ref:a})),e.React.createElement("span",{className:"cert"}))})),se=a.styled.div`
  display: flex;
  justify-content: space-between;
  .custom-color-picker {
    margin-right: 6px;
    margin-bottom: 10px;
  }
  .theme-color-configurator--shades {
    width: 1.25rem;
    border: 1px solid var(--light-500);
    > span {
      display: block;
      width: 100%;
      height: 1.25rem;
      background: currentColor;
      &.main-color-shade {
        &::after {
          content: ' ';
          display: block;
          width: 0;
          height: 0;
          border: 4px solid transparent;
          border-left-color: var(--dark-500);
          position: relative;
          left: -5px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
`,re=t=>{const{colors:a,onChange:l}=t,n=null==a?void 0:a.palette,s=e.React.useMemo((()=>{let t=(0,e.Immutable)({});return Object.keys(e.ThemeThemeColorKeys).forEach((l=>{t=t.set(e.ThemeThemeColorKeys[l],a[e.ThemeThemeColorKeys[l]])})),t}),[a]),r=e.hooks.useTranslation(o.defaultMessages);return e.React.createElement(se,null,Object.keys(s).map((t=>{const a=r(`variableColor${t.charAt(0).toUpperCase()+t.slice(1)}`),c="light"===t?"100":"dark"===t?"900":"500",i="string"==typeof t?r(`variableColor${t.charAt(0).toUpperCase()+t.slice(1)}`):"";return e.React.createElement("div",{className:"theme-color-configurator--column",key:t},e.React.createElement(o.Tooltip,{showArrow:!0,placement:"top",title:i},e.React.createElement(oe,{style:{color:s[t]},id:`colorConfigurator_colorPicker_${t}`,color:s[t],"aria-label":i,onChange:e=>{l(t,e)}})),e.React.createElement("div",{className:"theme-color-configurator--shades"},n&&Object.keys(n[t]).map((l=>e.React.createElement("span",{title:`${a}-${l}${l===c?` (${a})`:""}: ${n[t][l]}`,className:l===c?"main-color-shade":void 0,key:`${t}-${l}`,style:{color:n[t][l]}})))))})))},ce=a.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  .back-main-btn {
    font-size: 1rem;
    font-weight: 500;
    > svg {
      position: relative;
      top: -2px;
    }
  }
  .palette-selector {
    display: flex;
  }
  .setting--palette-selector {
    margin-top: -2px;
  }
`,ie=t=>{const{className:a,theme:l,onChange:n,onBack:s,onReset:r}=t,c=e.React.useId(),i=e.hooks.useTranslation(p,o.defaultMessages),m=e.React.useRef(null),u=e.React.useRef(null);e.React.useEffect((()=>{m.current.focus()}),[]),(0,o.useTrapFocusByBoundaryNodes)(m,u);const d=e.React.useMemo((()=>{let t=(0,e.Immutable)({});return Object.keys(e.ThemeThemeColorKeys).forEach((a=>{t=t.set(e.ThemeThemeColorKeys[a],null==l?void 0:l.colors[e.ThemeThemeColorKeys[a]])})),t}),[null==l?void 0:l.colors]),h=(0,e.classNames)("theme-color-configurator",a);return e.React.createElement(ce,{className:h},e.React.createElement("div",{className:"jimu-widget-setting--header px-1 pb-0"},e.React.createElement(o.Button,{ref:m,className:"back-main-btn",type:"tertiary",onClick:s,"aria-label":i("backToMainThemePanel")},e.React.createElement(K,{className:"mr-1",autoFlip:!0}),i("backToMainThemePanel"))),e.React.createElement(w.SettingSection,{title:i("themeSettingThemeColors"),role:"group","aria-label":i("themeSettingThemeColors"),"aria-describedby":c,className:"widget-builder-themes--pane flex-fill"},e.React.createElement("p",{id:c,className:"text-dark-400 text-break"},i("themeSettingThemeColorsDescription")),e.React.createElement("div",{className:"palette-selector"},e.React.createElement(re,{colors:null==l?void 0:l.colors,onChange:(e,t)=>{null==n||n({colors:{[e]:t}})}}),e.React.createElement(ae,{className:"d-block",colors:d,isDarkTheme:l.darkTheme,onChange:e=>{null==n||n({colors:e})}}))),e.React.createElement(w.SettingSection,{className:"d-flex"},e.React.createElement(o.Button,{ref:u,className:"flex-fill",type:"secondary",onClick:r,"aria-label":i("resetTheme")},i("resetTheme"))))};var me=m(5809);const ue=t=>{const{className:a,disabled:l=!1,label:n="Mode",mode:s,onChange:r}=t;return e.React.createElement("div",{className:(0,e.classNames)("d-flex justify-content-between align-items-center",a)},e.React.createElement(o.Label,{check:!0},n),e.React.createElement(o.Switch,{disabled:l,checked:"dark"===s,onChange:(e,t)=>{r(t?"dark":"light")}}))},de=(0,a.styled)("div")((({styleState:e})=>({display:"flex",justifyContent:e.label?"space-between":"center",alignItems:e.label?"start":"center",flexDirection:e.label?"column":"row",".header":{width:"100%",display:"flex",justifyContent:"space-between"},".content":{width:"100%",flexGrow:e.label?1:0}}))),pe=t=>{const{className:a,label:l,restable:n=!0,restDisabled:s,onReset:r,children:c}=t;return e.React.createElement(de,{styleState:t,className:a},l&&e.React.createElement("div",{className:"header"},e.React.createElement(o.Typography,{className:"px-1 pt-1",variant:"label2"},l),n&&e.React.createElement(o.Button,{size:"sm",className:"ml-2 pr-0 align-self-start",type:"tertiary",icon:!0,disabled:s,onClick:r},s?"Auto":"Reset")),e.React.createElement("div",{className:"content mt-2"},c),!l&&n&&e.React.createElement(o.Button,{size:"sm",className:"mt-2 ml-2 pr-0 align-self-start",type:"tertiary",icon:!0,disabled:s,onClick:r},s?"Auto":"Reset"))},he=a.styled.div`
  width: 100%;
  .ref-color-strip {
    display: flex;
    &.neutral {
      .ref-color-item {
        flex-basis: 7.69%;
      }
    }
    &.single {
      .ref-color-item {
        flex-basis: 100%;
      }
    }
    .ref-color-item {
      flex-basis: 11%;
      height: 50px;
    }
  }
`,fe=({className:t,name:a,value:l})=>e.React.createElement(he,{className:(0,e.classNames)("ref-color-strip",t)},e.React.createElement("span",null,a),e.React.createElement("div",{className:(0,e.classNames)("ref-color-strip",{neutral:"neutral"===a,single:"white"===a||"black"===a})},"string"!=typeof l&&Object.entries(l).map((([t,a])=>e.React.createElement("div",{key:t,className:"ref-color-item",style:{background:a}}))),"string"==typeof l&&e.React.createElement("div",{className:"ref-color-item",style:{background:l}}))),ge=({palette:t})=>e.React.createElement("div",{className:"ref-palette-preview w-100"},Object.entries(t).map((([t,a])=>{if("white"!==t&&"black"!==t)return e.React.createElement(fe,{key:t,className:"mb-2",name:t,value:a})})));var be=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const ve=a.styled.div`
  position: relative;
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`,ye=e.React.forwardRef(((t,a)=>{const{disabled:l}=t,n=be(t,["disabled"]);return e.React.createElement(ve,{ref:a},l&&e.React.createElement("div",{className:"mask"}),e.React.createElement(O.PickerBlock,Object.assign({},n)))}));var Re=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const we=a.styled.div`
  position: relative;
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`,Ne=e.React.forwardRef(((t,a)=>{const{disabled:l}=t,n=Re(t,["disabled"]);return e.React.createElement(we,{ref:a},l&&e.React.createElement("div",{className:"mask"}),e.React.createElement(O.ColorPicker,Object.assign({},n)))}));var Ee=m(4811),xe=m.n(Ee),Ce=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const Oe=t=>{const a=window.SVG,{className:l}=t,n=Ce(t,["className"]),o=(0,e.classNames)("jimu-icon jimu-icon-component",l);return a?e.React.createElement(a,Object.assign({className:o,src:xe()},n)):e.React.createElement("svg",Object.assign({className:o},n))},ke=()=>{let e=Math.floor(16777215*Math.random()).toString(16);for(;e.length<6;)e="0"+e;return"#"+e};var je=m(1594),Se=m.n(je),Te=function(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(l=Object.getOwnPropertySymbols(e);n<l.length;n++)t.indexOf(l[n])<0&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(a[l[n]]=e[l[n]])}return a};const Pe=t=>{const a=window.SVG,{className:l}=t,n=Te(t,["className"]),o=(0,e.classNames)("jimu-icon jimu-icon-component",l);return a?e.React.createElement(a,Object.assign({className:o,src:Se()},n)):e.React.createElement("svg",Object.assign({className:o},n))},Ie=(0,a.styled)("div")((()=>({display:"flex",justifyContent:"space-between",alignItems:"center",".content":{display:"flex",alignItems:"center",minWidth:"110px"}}))),ze=t=>{var a;const{className:l,value:n,label:s,harmonizable:r=!1,resetable:c=!0,deletable:i=!1,disabled:m,displayValue:u,onChange:d,onReset:p,onDelete:h}=t,f=e.React.useMemo((()=>u),[]),g=m||!n||n===f,b=!i&&(m||!n),v=e=>{null==d||d(Object.assign(Object.assign({},n),{harmonize:e}))};return e.React.createElement(Ie,{styleState:t,className:l},e.React.createElement("div",{className:"content"},e.React.createElement(O.ColorPicker,{className:"mr-2",color:null==u?void 0:u.color,disabled:m,onChange:e=>{null==d||d(Object.assign(Object.assign({},n),{color:e}))}}),e.React.createElement("span",null,s)),c&&e.React.createElement(o.Button,{size:"sm",className:"ml-2 align-self-start",type:"tertiary",disabled:g,onClick:p},g?"Auto":"Reset"),i&&e.React.createElement(o.Button,{size:"sm",className:"ml-2 align-self-start",type:"tertiary",onClick:h},e.React.createElement(Pe,null)),r&&e.React.createElement(o.Checkbox,{disabled:b,checked:null!==(a=null==u?void 0:u.harmonize)&&void 0!==a&&a,onChange:(e,t)=>{null==v||v(t)}}))},Me=(0,e.Immutable)({}),Fe=t=>{const{className:l,source:n,sourceOptions:s=Me,onChange:r,onReset:c,onDelete:i}=t,{custom1:m,custom2:u,custom3:d,custom4:p,custom5:h}=s,f=e.React.useMemo((()=>{const e={};return m&&(e.custom1=m),u&&(e.custom2=u),d&&(e.custom3=d),p&&(e.custom4=p),h&&(e.custom5=h),e}),[m,u,d,p,h]);return e.React.createElement("div",{className:(0,e.classNames)("theme-source-options",l)},["primary","secondary","neutral"].map((t=>e.React.createElement(ze,{key:t,className:"mt-2",harmonizable:!0,resetable:!0,deletable:!1,label:a.utils.uppercaseFirstLetter(t),value:null==s?void 0:s[t],disabled:!1,displayValue:n[t],onChange:e=>{r(t,e)},onReset:()=>{c(t)}}))),Object.entries(f).map((([t,l])=>e.React.createElement(ze,{key:t,className:"mt-2",resetable:!1,deletable:!0,harmonizable:!0,label:a.utils.uppercaseFirstLetter(t),value:l,disabled:!1,displayValue:l,onChange:e=>{r(t,e)},onReset:()=>{c(t)},onDelete:()=>{i(t)}}))),Object.keys(f).length<5&&e.React.createElement("div",{className:"add-color-row"},e.React.createElement(o.Button,{type:"tertiary",icon:!0,onClick:()=>{const e=ke(),t=(a=s).custom1?a.custom2?a.custom3?a.custom4?"custom5":"custom4":"custom3":"custom2":"custom1";var a;r(t,{color:e,harmonize:!1})}},e.React.createElement(Oe,null)),e.React.createElement("span",null,"Add a color")))};var Be=function(e,t,a,l){return new(a||(a=Promise))((function(n,o){function s(e){try{c(l.next(e))}catch(e){o(e)}}function r(e){try{c(l.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?n(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(s,r)}c((l=l.apply(e,t||[])).next())}))};const Ae=t=>{const{className:l,onChange:n}=t,[s,r]=e.React.useState(null),c=e.hooks.useTranslation(),i=(0,a.useTheme2)(),m=i.src,u=i.ref.palette,d=e.ReactRedux.useSelector((e=>{var t;return null===(t=e.appStateInBuilder.appConfig.customThemeOptions)||void 0===t?void 0:t.src})),p=(t,a)=>{let l=null!=d?d:(0,e.Immutable)({});l=l.set(t,a),"primary"===t&&a.color&&(l=l.without("secondary").without("neutral")),l.primary||(l=l.set("primary",m.primary)),l.primary.color||(l=l.set("primary",Object.assign(Object.assign({},a),{color:m.primary.color}))),n(l.asMutable({deep:!0}))};return e.React.createElement("div",{className:(0,e.classNames)("theme-source-setting",l)},e.React.createElement(o.Tabs,{defaultValue:"color",type:"underline",fill:!0},e.React.createElement(o.Tab,{id:"color",title:"Color"},e.React.createElement(Fe,{source:m,sourceOptions:d,onChange:p,onReset:e=>{let t=d;t=t.without(e),0!==Object.keys(t).length&&"primary"!==e||(t=void 0),n(t)},onDelete:e=>{let t=d;t=t.without(e),n(t)}})),e.React.createElement(o.Tab,{id:"image",title:"image"},e.React.createElement("div",{className:"border",style:{minHeight:90}},e.React.createElement(me.ImageSelector,{widgetId:"theme-setting",buttonSize:"sm",position:"left",buttonLabel:c("browse"),onChange:e=>{r(e)}}),s&&e.React.createElement("img",{className:"w-100",src:s.url,alt:(null==s?void 0:s.originalName)||(null==s?void 0:s.fileName),style:{objectFit:"cover",height:132},onLoad:e=>Be(void 0,void 0,void 0,(function*(){const t=e.target,l=yield a.colorUtils.sourceColorFromImage(t),n=a.colorUtils.hexFromArgb(l);p("primary",{color:n})}))})))),e.React.createElement(ge,{palette:u}))},Le=t=>{var l,n;const{value:s=a.defaultFonts[0],onChange:r,style:c,className:i}=t,m=(null==s?void 0:s.includes(","))?s.split(",")[0].replace(/\"/gm,""):null==s?void 0:s.replace(/\"/gm,""),u=(0,a.useTheme)(),d=null===(n=null===(l=null==u?void 0:u.sys)||void 0===l?void 0:l.typography)||void 0===n?void 0:n.customFonts,p=e.React.useMemo((()=>{var e;return[...null!==(e=null==d?void 0:d.map((e=>e.name)))&&void 0!==e?e:[],...a.defaultFonts]}),[d]);return e.React.createElement(o.Select,{"data-testid":"font-family",size:"sm",title:m,"aria-label":t["aria-label"],className:(0,e.classNames)(i,"font-family"),style:c,value:m,onChange:e=>{const t=e.target.value;r(t)}},p.map(((t,a)=>e.React.createElement("option",{key:a,"aria-selected":t===m,value:t,label:t},t))))},$e=a.styled.div`
  width: 100%;
  .jimu-widget-setting--section {
    padding: 8px !important;
  }
`,Ve=(0,e.Immutable)({}),De=(0,e.Immutable)({}),_e=t=>{var l;const{className:n,onChange:o}=t,s=(0,a.useTheme2)().ref.typeface,r=e.ReactRedux.useSelector((e=>{var t,a;return null!==(a=null===(t=e.appStateInBuilder.appConfig.customThemeOptions)||void 0===t?void 0:t.ref)&&void 0!==a?a:Ve})),c=null!==(l=r.typeface)&&void 0!==l?l:De,i=(e,t)=>{if(!e||!t)return;let a=c.asMutable({deep:!0});a=Object.assign(Object.assign({},a),{[e]:t});const l=r.set("typeface",a);o(l)},m=e=>{const t=c.without(e).asMutable({deep:!0}),a=r.set("typeface",t);o(a)};return e.React.createElement($e,{className:(0,e.classNames)("theme-typeface-setting",n)},e.React.createElement(pe,{className:"mt-2",label:"Font family",restDisabled:!c.fontFamily,onReset:()=>{m("fontFamily")}},e.React.createElement(Le,{className:"px-1",value:null==s?void 0:s.fontFamily,onChange:e=>{i("fontFamily",e)}})),e.React.createElement(pe,{className:"mt-2",label:"HTML font size",restDisabled:!c.htmlFontSize,onReset:()=>{m("htmlFontSize")}},e.React.createElement(P.InputUnit,{className:"px-1",min:100,max:125,value:null==s?void 0:s.htmlFontSize,onChange:e=>{i("htmlFontSize",`${e.distance}${e.unit}`)}})),e.React.createElement(pe,{className:"mt-2",label:"Font size",restDisabled:!c.fontSize,onReset:()=>{m("fontSize")}},e.React.createElement(P.InputUnit,{className:"px-1",min:8,max:99,value:(null==s?void 0:s.fontSize)?`${s.fontSize}`:"",onChange:e=>{i("fontSize",e.distance)}})))},Ue=a.styled.button`
  position: relative;
  width: 36px;
  height: 26px;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  outline: inherit;
  cursor: pointer;
  &.active {
    ::after {
      content: '✔';
      position: absolute;
      top: 0px;
      left: calc(50% - 10px);
      font-size: 20px;
      color: #10de10;
    }
  }
  &.active.secondary {
    ::after {
      content: '-';
      color: #3a743a;
    }
  }
  &:disabled {
    cursor: default;
    ::after {
      content: 'x';
      position: absolute;
      top: 0px;
      left: calc(50% - 10px);
      font-size: 20px;
      color: #de101a;
    }
  }
`,He=t=>{const{label:a,color:l,active:n,disabled:o,onClick:s}=t;return e.React.createElement(Ue,{role:"button",title:`${a}-${l}`,disabled:o,className:(0,e.classNames)({active:n}),style:{background:l,color:e.polished.readableColor(l,"#000","#fff")},onClick:s},a)},Ke=a.styled.div`
  display: flex;
  width: 100%;
`,Ge=(e,t,a,l)=>"main"===e?a<2||a>8:"light"===e?a>=t||0===a||10===a:"dark"===e?a<=t||0===a||10===a:a>2&&a<8,qe=t=>{const{mode:a,level:l,value:n,palette:o,onChange:s}=t,r=e.React.useMemo((()=>{if(o&&n)return Object.values(o).findIndex((e=>e===n.main))}),[o,n]),c=(t,a)=>{if("main"===l){const l=Number(t),n=o[""+(l-100)],r=o[`${l+100}`];let c=e.polished.readableColor(a,o[0],o[900]);c="#fff"===c?"#ffffff":c,c="#000"===c?"#000000":c;null==s||s({light:n,main:a,dark:r,text:c})}else{const e=Object.assign(Object.assign({},n),{[l]:a});null==s||s(e)}};return e.React.createElement(Ke,null,Object.entries(o).map((([t,a],o)=>e.React.createElement("div",{key:t},e.React.createElement(He,{label:t,secondary:a!==n.main,disabled:Ge(l,r,o),active:a===(null==n?void 0:n[l]),color:a,onClick:()=>{null==c||c(t,a)}})))))},We=t=>{const{mode:a,source:l,onSourceChange:n,level:o,value:s,onChange:r,palette:c}=t;return e.React.createElement("div",{className:"d-flex p-2"},c&&e.React.createElement(qe,{mode:a,level:o,palette:c,value:s,onChange:r}),e.React.createElement(O.ColorPicker,{color:"main"===o?l:null==s?void 0:s[o],onChange:e=>{if("main"===o)null==n||n(e);else{const t=Object.assign(Object.assign({},s),{[o]:e});null==r||r(t)}}}))},Xe=t=>{const{className:a,value:l,mode:n,level:s,disabled:r,onChange:c,source:i,palette:m,onSourceChange:u}=t,d=e.React.useRef(null),[p,h]=e.React.useState(!1);return e.React.createElement("div",null,e.React.createElement(ye,{className:a,ref:d,disabled:r,title:null==l?void 0:l[s],color:null==l?void 0:l[s],onClick:()=>{h(!p)}}),d.current&&e.React.createElement(o.Popper,{reference:d.current,open:p,toggle:()=>{h(!1)}},e.React.createElement(We,{mode:n,source:i,onSourceChange:u,value:l,level:s,palette:m,onChange:e=>{h(!1),null==c||c(e)}})))},Ye=(0,a.styled)("div")((()=>({display:"flex",justifyContent:"space-between",alignItems:"center",".content":{display:"flex",alignItems:"center",minWidth:"110px"}}))),Je=t=>{const{mode:a="light",level:l="main",className:n,source:s,value:r,palette:c,label:i,disabled:m,displayValue:u,onChange:d,onSourceChange:p,onReset:h}=t,f=e.React.useMemo((()=>null==u?void 0:u[l]),[]),g=m||!(null==r?void 0:r[l])||r[l]===f;return e.React.createElement(Ye,{styleState:t,className:n},e.React.createElement("div",{className:"content"},e.React.createElement(Xe,{className:"mr-2",value:u,mode:a,level:l,disabled:m,onChange:d,source:s,onSourceChange:p,palette:c}),e.React.createElement("span",null,i)),"main"===l&&e.React.createElement(o.Button,{size:"sm",className:"ml-2 align-self-start",type:"tertiary",disabled:g,onClick:h},g?"Auto":"Reset"))},Qe=["main","light","dark","text"],Ze={},et=t=>{const{mode:l,className:n,value:o=Ze,displayValue:s,onChange:r}=t,[c,i]=e.React.useState(ke()),[m,u]=e.React.useState((0,a.createReferencePaletteColor)(c)),d=e=>{i(e);const t=(0,a.createReferencePaletteColor)(e);null==u||u(t);const n=(0,a.getSchemeColor)(t,l);null==r||r(n)};return e.React.createElement("div",{className:(0,e.classNames)("theme-color-setting w-100",n)},Qe.map((t=>e.React.createElement(Je,{key:t,className:"mt-2",label:a.utils.uppercaseFirstLetter(t),mode:l,level:t,value:o,disabled:"main"!==t&&!(null==o?void 0:o.main),displayValue:s,onChange:r,source:c,onSourceChange:d,palette:m,onReset:()=>{(e=>{let t=Object.assign({},o);delete t[e],0!==Object.keys(t).length&&"main"!==e||(t=null),r(t)})(t)}}))))},tt=(0,a.styled)("div")((()=>({display:"flex",justifyContent:"space-between",alignItems:"center",".content":{display:"flex",alignItems:"center",minWidth:"110px"}}))),at=t=>{const{className:a,value:l,label:n,disabled:s,displayValue:r,onChange:c,onReset:i}=t,m=e.React.useMemo((()=>r),[]),u=s||!l||l===m;return e.React.createElement(tt,{styleState:t,className:a},e.React.createElement("div",{className:"content"},e.React.createElement(Ne,{className:"mr-2",color:r,disabled:s,onChange:c}),e.React.createElement("span",null,n)),e.React.createElement(o.Button,{size:"sm",className:"ml-2 align-self-start",type:"tertiary",disabled:u,onClick:i},u?"Auto":"Reset"))},lt=t=>{const{className:l,elements:n=[],value:s,displayValue:r,onChange:c}=t,i=(t,a,l)=>{let n=null!=s?s:(0,e.Immutable)({});n=a?n.setIn([t,a],l):n.set(t,l),c(n)},m=(t,a,l)=>{var n;let o=null!=s?s:(0,e.Immutable)({}),r=null!==(n=o[t])&&void 0!==n?n:(0,e.Immutable)({});a?(r=r.without(a),o=0===Object.keys(r).length||l?o.without(t):o.set(t,r)):o=o.without(t),0===Object.keys(o).length&&(o=null),c(o)};return e.React.createElement("div",{className:(0,e.classNames)("element-color-setting w-100",l)},n.map((t=>{if("string"==typeof t)return e.React.createElement(at,{key:t,className:"mt-2",label:a.utils.uppercaseFirstLetter(t),value:null==s?void 0:s[t],displayValue:r[t],onChange:e=>{i(t,null,e)},onReset:()=>{m(t,null,!1)}});if(Array.isArray(t)){const l=t[0],n=t.slice(1);return e.React.createElement(o.CollapsablePanel,{key:l,type:"primary",level:1,className:"mt-1 pl-1",defaultIsOpen:!1,bottomLine:!1,label:a.utils.uppercaseFirstLetter(l)},n.map((t=>{var o,c;return e.React.createElement(at,{key:t,className:"mt-2",label:a.utils.uppercaseFirstLetter(t),value:null===(o=null==s?void 0:s[l])||void 0===o?void 0:o[t],displayValue:null===(c=null==r?void 0:r[l])||void 0===c?void 0:c[t],onChange:e=>{i(l,t,e)},onReset:()=>{m(l,t,t===n[0])}})})))}return null})))},nt=["background","backgroundText","backgroundHint","paper","paperText","paperHint","overlay","overlayText","overlayHint"],ot=["primary","secondary","tertiary","input"],st=["default","hover","pressed","text",["disabled","default","text"],"focus",["selected","default","hover","text"],["link","default","hover","visited"]],rt=t=>{const{className:l,onChange:n}=t,s=e.ReactRedux.useSelector((e=>e.appStateInBuilder.appConfig.theme)),r=(0,a.useTheme2)(),c=e.React.useMemo((()=>(0,a.getTheme2Module)(!1)),[s]),i=r.sys,m=e.ReactRedux.useSelector((e=>{var t,a;return null===(a=null===(t=e.appStateInBuilder.appConfig.customThemeOptions)||void 0===t?void 0:t.sys)||void 0===a?void 0:a.color})),u=i.color.mode,d=null==m?void 0:m[u],p=(t,a)=>{let l=null!=m?m:(0,e.Immutable)({});l=l.set("mode",u),l=a?l.setIn([u,t],a):l.setIn([u,t],void 0);const o={color:l.asMutable({deep:!0})};n(o)};return e.React.createElement("div",{className:(0,e.classNames)("theme-palette-setting",l)},e.React.createElement(ue,{disabled:!a.mapping.whetherIsNewTheme(c),className:"mt-2",mode:u,onChange:t=>{let a=null!=m?m:(0,e.Immutable)({});a=a.set("mode",t);const l={color:a.asMutable({deep:!0})};n(l)}}),e.React.createElement(o.CollapsablePanel,{className:"mt-2",defaultIsOpen:!0,bottomLine:!0,label:"Primary"},e.React.createElement(et,{className:"mt-2",mode:u,value:null==d?void 0:d.primary,displayValue:i.color.primary,onChange:e=>{p("primary",e)}})),e.React.createElement(o.CollapsablePanel,{className:"mt-2",defaultIsOpen:!1,bottomLine:!0,label:"Secondary"},e.React.createElement(et,{className:"mt-2",mode:u,value:null==d?void 0:d.secondary,displayValue:i.color.secondary,onChange:e=>{p("secondary",e)}})),e.React.createElement(o.CollapsablePanel,{className:"mt-2",defaultIsOpen:!1,bottomLine:!0,label:"Surface"},e.React.createElement(lt,{className:"mt-2",elements:nt,value:null==d?void 0:d.surface,displayValue:i.color.surface,onChange:e=>{p("surface",e)}})),e.React.createElement(o.CollapsablePanel,{className:"mt-2",defaultIsOpen:!1,bottomLine:!0,label:"Divider"},e.React.createElement(lt,{className:"mt-2",elements:ot,value:null==d?void 0:d.divider,displayValue:i.color.divider,onChange:e=>{p("divider",e)}})),e.React.createElement(o.CollapsablePanel,{className:"mt-2",defaultIsOpen:!1,bottomLine:!1,label:"Action"},e.React.createElement(lt,{className:"mt-2",elements:st,value:null==d?void 0:d.action,displayValue:i.color.action,onChange:e=>{p("action",e)}})))},ct=a.styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  .back-main-btn {
    width: fit-content;
    font-size: 1rem;
    font-weight: 500;
    > svg {
      position: relative;
      top: -2px;
    }
  }
  .theme-system-setting {
    height: 100%;
    flex: 1 1 0%;
    overflow: auto;
    .color-picker-block {
      margin: 3px;
    }
  }
`,it=l=>{const{className:n,onBack:s}=l,r=e.hooks.useTranslation(p,o.defaultMessages),c=(0,e.classNames)("jimu-builder-theme-color-shade py-3",n),i=e.React.useRef(null),m=e.React.useRef(null);e.React.useEffect((()=>{i.current.focus()}),[]),(0,o.useTrapFocusByBoundaryNodes)(i,m);const u=e.ReactRedux.useSelector((e=>{var t;return null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appConfig})),d=(0,a.useTheme2)(),h=e=>{(0,t.getAppConfigAction)(u).editCustomThemeOption(e).exec()};return e.React.createElement(ct,{className:c},e.React.createElement(o.Button,{ref:i,className:"back-main-btn",type:"tertiary",onClick:s,"aria-label":r("backToMainThemePanel")},e.React.createElement(K,{className:"mr-1",autoFlip:!0}),r("backToMainThemePanel")),d&&e.React.createElement(e.React.Fragment,null,e.React.createElement("div",{className:"theme-system-setting"},e.React.createElement(o.Tabs,{className:"mt-2",defaultValue:"palette",fill:!0,type:"underline"},e.React.createElement(o.Tab,{id:"palette",title:"Palette"},e.React.createElement(Ae,{className:"mt-2 px-3",onChange:e=>{h({src:e})}})),e.React.createElement(o.Tab,{id:"system",title:"System"},e.React.createElement(rt,{className:"mt-2 px-3",onChange:e=>{h({sys:e})}})),e.React.createElement(o.Tab,{id:"typography",title:"Typeface"},e.React.createElement(_e,{className:"mt-2 px-3",onChange:e=>{h({ref:e})}}))))))};var mt=function(e,t,a,l){return new(a||(a=Promise))((function(n,o){function s(e){try{c(l.next(e))}catch(e){o(e)}}function r(e){try{c(l.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?n(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(s,r)}c((l=l.apply(e,t||[])).next())}))};const ut=l=>{const o=e.ReactRedux.useSelector((e=>{var t;return null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appConfig})),s=(0,a.useTheme2)(),[r,c]=e.React.useState(0),[i,m]=e.React.useState(null),u=(null==o?void 0:o.theme)&&s;e.React.useEffect((()=>{mt(void 0,void 0,void 0,(function*(){const t=yield fetch(`${e.urlUtils.getAbsoluteRootUrl()}themes/themes-info.json`);return yield Promise.resolve((0,e.Immutable)(yield t.json()))})).then((e=>{m(e),c(1)}))}),[]);const d=a=>{var l;if(!a)return;let n=null!==(l=o.customTheme)&&void 0!==l?l:(0,e.Immutable)({});n=n.merge(a,{deep:!0}),(0,t.getAppConfigAction)(o).editCustomTheme(n).exec()},p=()=>{(0,t.getAppConfigAction)(o).editCustomTheme((0,e.Immutable)({})).exec()};return e.React.createElement("div",{className:"jimu-widget widget-builder-themes d-flex flex-column bg-light-300 w-100 h-100"},u&&e.React.createElement(e.React.Fragment,null,e.React.createElement(n,{active:1===r},e.React.createElement(R,{themeListInfo:i,selectedTheme:null==o?void 0:o.theme,onChange:a=>{if(!a)return;const l=(0,e.Immutable)({});(0,t.getAppConfigAction)(o).editTheme(a).editCustomTheme(l).exec()},disabled:(null==o?void 0:o.theme)===e.CONSTANTS.SHARED_THEME,onCustomize:()=>{const e=(0,a.getTheme2Module)(!1);a.mapping.whetherIsNewTheme(e)?c(2):c(3)}})),e.React.createElement(n,{active:2===r},e.React.createElement(it,{onChange:d,onBack:()=>{c(1)},onAdvance:()=>{c(4)}})),e.React.createElement(n,{active:3===r},e.React.createElement(q,{theme:s,onChange:d,onReset:p,onBack:()=>{c(1)},onAdvance:()=>{c(4)}})),e.React.createElement(n,{active:4===r},e.React.createElement(ie,{theme:s,onChange:d,onReset:p,onBack:()=>{c(3)}}))))};function dt(e){m.p=e}})(),u})())}}}));