System.register(["jimu-core","jimu-for-builder","jimu-for-builder/templates","jimu-layouts/layout-builder","jimu-layouts/layout-runtime","jimu-theme","jimu-ui","jimu-ui/advanced/data-source-selector","jimu-ui/advanced/rich-text-editor","jimu-ui/advanced/setting-components"],(function(e,t){var o={},i={},s={},a={},n={},r={},l={},d={},c={},u={};return Object.defineProperty(s,"__esModule",{value:!0}),{setters:[function(e){o.APP_FRAME_NAME_IN_BUILDER=e.APP_FRAME_NAME_IN_BUILDER,o.AppMode=e.AppMode,o.BrowserSizeMode=e.BrowserSizeMode,o.IntlProvider=e.IntlProvider,o.LayoutItemType=e.LayoutItemType,o.LayoutParentType=e.LayoutParentType,o.LayoutType=e.LayoutType,o.PageMode=e.PageMode,o.React=e.React,o.ReactDOM=e.ReactDOM,o.ReactRedux=e.ReactRedux,o.WidgetType=e.WidgetType,o.classNames=e.classNames,o.css=e.css,o.getAppStore=e.getAppStore,o.hooks=e.hooks,o.jsx=e.jsx,o.lodash=e.lodash,o.moduleLoader=e.moduleLoader,o.polished=e.polished,o.queryString=e.queryString,o.urlUtils=e.urlUtils,o.utils=e.utils},function(e){i.AppResourceManager=e.AppResourceManager,i.LayoutServiceProvider=e.LayoutServiceProvider,i.ToBuilderMessage=e.ToBuilderMessage,i.WidgetSettingManager=e.WidgetSettingManager,i.appStateActions=e.appStateActions,i.builderActions=e.builderActions,i.builderAppSync=e.builderAppSync,i.getAppConfigAction=e.getAppConfigAction},function(e){Object.keys(e).forEach((function(t){s[t]=e[t]}))},function(e){a.ColumnLayoutService=e.ColumnLayoutService,a.FixedLayoutService=e.FixedLayoutService,a.FlowLayoutService=e.FlowLayoutService,a.GridLayoutService=e.GridLayoutService,a.RowLayoutService=e.RowLayoutService},function(e){n.searchUtils=e.searchUtils,n.utils=e.utils},function(e){r.ThemeSwitchComponent=e.ThemeSwitchComponent,r.styled=e.styled},function(e){l.Button=e.Button,l.Checkbox=e.Checkbox,l.Label=e.Label,l.Loading=e.Loading,l.LoadingType=e.LoadingType,l.Modal=e.Modal,l.ModalBody=e.ModalBody,l.ModalFooter=e.ModalFooter,l.PanelHeader=e.PanelHeader,l.defaultMessages=e.defaultMessages,l.styleUtils=e.styleUtils},function(e){d.DataSourceRemoveWaringReason=e.DataSourceRemoveWaringReason,d.DataSourceRemoveWarningPopup=e.DataSourceRemoveWarningPopup,d.dataComponentsUtils=e.dataComponentsUtils},function(e){c.RichExpressionBuilder=e.RichExpressionBuilder},function(e){u.TemplateList=e.TemplateList,u.WidgetList=e.WidgetList}],execute:function(){e((()=>{var e={8996:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M8 2.125 14.334 14H1.667zm-.882-.47a1 1 0 0 1 1.765 0l6.333 11.874A1 1 0 0 1 14.334 15H1.667a1 1 0 0 1-.882-1.47zM8 4.874a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0L8.9 5.87a.905.905 0 0 0-.9-.995m1 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0" clip-rule="evenodd"></path></svg>'},9244:e=>{"use strict";e.exports=o},4108:e=>{"use strict";e.exports=i},6884:e=>{"use strict";e.exports=s},6055:e=>{"use strict";e.exports=a},1496:e=>{"use strict";e.exports=n},1888:e=>{"use strict";e.exports=r},4321:e=>{"use strict";e.exports=l},3089:e=>{"use strict";e.exports=d},3949:e=>{"use strict";e.exports=c},9298:e=>{"use strict";e.exports=u}},t={};function p(o){var i=t[o];if(void 0!==i)return i.exports;var s=t[o]={exports:{}};return e[o](s,s.exports,p),s.exports}p.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return p.d(t,{a:t}),t},p.d=(e,t)=>{for(var o in t)p.o(t,o)&&!p.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},p.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),p.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},p.p="";var g={};return p.p=window.jimuConfig.baseUrl,(()=>{"use strict";p.r(g),p.d(g,{__set_webpack_public_path__:()=>W,default:()=>N});var e=p(9244),t=p(4108),o=p(4321);const i=e.css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;function s(t,o,s){return e.css`
    ${t?i:""};
    overflow: auto;

    .content-section {
      height: 100%;
      width: 100%;
      overflow: auto;
    }

    .content {
      padding: 1.5rem;
      margin: 0 auto;
    }

    .top-section {
      margin-top: 5px;
    }

    .page-name {
      color: ${s.ref.palette.neutral[800]};
    }

    .body-section {
      width: 100%;
      display: flex;
      margin-top: 5px;
      overflow: visible;
      position: relative;
      align-items: center;
      // box-shadow: 0 2px 5px 1px rgba(0,0,0,0.15);

      .device-frame {
        position: relative;
        overflow: hidden;
        height: ${o>0?`${o}px`:"auto"};
        flex-grow: 0;
        flex-shrink: 0;

        &.center-origin {
          transform-origin: top center;
          align-self: center;
        }
        &.left-origin {
          transform-origin: top left;
          align-self: flex-start;
        }

        iframe {
          width: 100%;
          // height: 100%;
          border: none;
          position: relative;
          overflow: visible;
        }
      }
    }
  `}var a=p(8996),n=p.n(a),r=function(e,t){var o={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(o[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(i=Object.getOwnPropertySymbols(e);s<i.length;s++)t.indexOf(i[s])<0&&Object.prototype.propertyIsEnumerable.call(e,i[s])&&(o[i[s]]=e[i[s]])}return o};const l=t=>{const o=window.SVG,{className:i}=t,s=r(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return o?e.React.createElement(o,Object.assign({className:a,src:n()},s)):e.React.createElement("svg",Object.assign({className:a},s))};class d extends e.React.PureComponent{constructor(t){super(t),this.handleCloseBtn=()=>{this.isOkClick=!1,this.setState({isOpen:!1});const{toggle:e,isOpen:t}=this.props;void 0!==t&&e&&e()},this.handleOkClick=()=>{this.isOkClick=!0,this.setState({isOpen:!1});const{toggle:e,isOpen:t}=this.props;void 0!==t&&e&&e()},this.handleToggle=()=>{this.setState({isOpen:!this.state.isOpen});const{toggle:e,isOpen:t}=this.props;void 0!==t&&e&&e()},this.onModalClosed=()=>{const{onClosed:e}=this.props;e&&e(this.isOkClick),this.isOkClick=!1},this.formatMessage=e=>this.props.formatMessage(e),this.getStyle=()=>e.css`
      .modal-body{
        overflow-y: auto;
        max-height: 360px;
        padding: 0;
      }
      .modal-content{
        width: auto;
        background: var(--ref-palette-neutral-400);
        padding: 30px;
        border: none;
      }
      .modal-footer{
        padding: 0;
        margin-top: 30px;
        .btn {
          min-width: 80px;
          + .btn {
            margin-left: 10px;
          }
        }
      }
      &.modal-dialog{
        width: auto;
      }
      .choose-template-description{
        width: 100%;
        font-size: ${14/17}rem;
        user-select:none;
      }

      .title-icon {
        padding: 0 6px;
      }
      .title-label {
        font-size: 1rem;
        color: var(--ref-palette-black);
      }

      .message {
        color: var(--ref-palette-neutral-1100);
        margin-left: 36px;
        margin-top: 1rem;
        font-weight: 400;
        font-size: 0.8125rem;
        line-height: normal;
      }
    `,this.state={isOpen:!!t.isOpen}}render(){let{isOpen:t}=this.props;return t=void 0===t?this.state.isOpen:t,(0,e.jsx)(o.Modal,{css:this.getStyle(),modalClassName:"toc-add-page-modal",backdropClassName:"toc-add-page-modal",isOpen:t,onClosed:this.onModalClosed,toggle:this.handleToggle,centered:!0},(0,e.jsx)(o.ModalBody,null,(0,e.jsx)("div",{className:"d-flex align-items-center"},(0,e.jsx)("div",{className:"title-icon"},(0,e.jsx)(l,{size:24,color:"var(--warning-600)"})),(0,e.jsx)("div",{className:"title-label"},this.props.title)),(0,e.jsx)("div",{className:"message text-paper"},this.props.children)),(0,e.jsx)(o.ModalFooter,null,(0,e.jsx)(o.Button,{type:"primary",onClick:this.handleOkClick},this.formatMessage("certainly")),(0,e.jsx)(o.Button,{onClick:this.handleCloseBtn},this.formatMessage("cancel"))))}}var c=function(e,t,o,i){return new(o||(o=Promise))((function(s,a){function n(e){try{l(i.next(e))}catch(e){a(e)}}function r(e){try{l(i.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(n,r)}l((i=i.apply(e,t||[])).next())}))};class u extends e.React.PureComponent{constructor(o){super(o),this.formatMessage=(e,t)=>this.props.formatMessage(e,t),this.toggleLayoutMode=()=>{const{isAuto:e}=this.props;e?this.handleToggleCustomConfirm():this.handleToggleAutoConfirm()},this.handleToggleAutoConfirm=()=>{this.setState({showAutoConfirm:!this.state.showAutoConfirm})},this.autoConfirmClosed=e=>{e&&(this.props.isHeader?this.resetHeader():this.props.isFooter?this.resetFooter():this.props.isDialog?this.resetDialog():this.resetPageBody())},this.handleToggleCustomConfirm=()=>{this.setState({showCustomConfirm:!this.state.showCustomConfirm})},this.customConfirmClosed=e=>{e&&(this.props.isHeader?this.unLockHeaderLayout():this.props.isFooter?this.unLockFooterLayout():this.props.isDialog?this.unLockDialogLayout():this.unLockPageBodyLayout())},this.unLockFooterLayout=()=>{const{browserSizeMode:o,mainSizeMode:i}=this.props,s=(0,t.getAppConfigAction)(),a=s.appConfig.footer.layout,n=s.createLayoutForSizeMode(o,i,a,e.LayoutParentType.Footer,"footer");n&&s.editFooterProperty("layout",n).exec()},this.unLockHeaderLayout=()=>{const{browserSizeMode:o,mainSizeMode:i}=this.props,s=(0,t.getAppConfigAction)(),a=s.appConfig.header.layout,n=s.createLayoutForSizeMode(o,i,a,e.LayoutParentType.Header,"header");n&&s.editHeaderProperty("layout",n).exec()},this.unLockPageBodyLayout=()=>c(this,void 0,void 0,(function*(){const{browserSizeMode:o,mainSizeMode:i,pageId:s}=this.props,a=(0,t.getAppConfigAction)(),n=a.appConfig.pages[s],r=a.createLayoutForSizeMode(o,i,n.layout,e.LayoutParentType.Page,s);r&&a.editPageProperty(s,"layout",r).exec()})),this.unLockDialogLayout=()=>{var o;const{browserSizeMode:i,mainSizeMode:s,dialogId:a}=this.props,n=(0,t.getAppConfigAction)(),r=n.appConfig.dialogs[a],l=n.createLayoutForSizeMode(i,s,r.layout,e.LayoutParentType.Dialog,a);l&&(n.editDialogProperty(a,"layout",l),(null===(o=r.sizeMode)||void 0===o?void 0:o.LARGE)&&n.editDialogProperty(a,"sizeMode",r.sizeMode.set(i,r.sizeMode.LARGE)),n.exec())},this.resetHeader=()=>{const{browserSizeMode:e}=this.props,o=(0,t.getAppConfigAction)(),i=o.appConfig.header.layout;o.removeSizeModeLayout(i[e],e).editHeaderProperty("layout",i.without(e)).exec()},this.resetFooter=()=>{const{browserSizeMode:e}=this.props,o=(0,t.getAppConfigAction)(),i=o.appConfig.footer.layout;o.removeSizeModeLayout(i[e],e).editFooterProperty("layout",i.without(e)).exec()},this.resetPageBody=()=>{const{browserSizeMode:e,pageId:o}=this.props,i=(0,t.getAppConfigAction)(),s=i.appConfig.pages[o].layout;i.removeSizeModeLayout(s[e],e).editPageProperty(o,"layout",s.without(e)).exec()},this.resetDialog=()=>{var e;const{browserSizeMode:o,dialogId:i}=this.props,s=(0,t.getAppConfigAction)(),a=s.appConfig.dialogs[i],n=a.layout;s.removeSizeModeLayout(n[o],o).editDialogProperty(i,"layout",n.without(o)),(null===(e=a.sizeMode)||void 0===e?void 0:e[o])&&s.editDialogProperty(i,"sizeMode",a.sizeMode.without(o)),s.exec()},this.state={showAutoConfirm:!1,showCustomConfirm:!1}}getStyle(){const{isAuto:t,isHeader:o,isFooter:i}=this.props;let s;return i?s=e.css`position: absolute;`:o||i||(s=e.css`
        position: sticky;
        transform: translateZ(1px);
      `),e.css`
      ${s};
      .state-toggle-btn{
        cursor: pointer;
        position: relative;
        padding: 0 1rem;
        overflow: hidden;
        background: var(--ref-palette-neutral-500);
        border-radius: 2px;
      }
      .toggle-part {
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
      }
      .toggle-highlight {
        position: absolute;
        height: 30px;
        left: 0;
        right: 0;
        background-color: var(--sys-color-primary-main);
        transition: 0.2s;
        top: ${t?0:30}px;
      }
    `}getSizeModeNls(t){switch(t){case e.BrowserSizeMode.Small:return this.formatMessage("smallScreen");case e.BrowserSizeMode.Medium:return this.formatMessage("mediumScreen");default:return this.formatMessage("largeScreen")}}render(){const{isAuto:t,theme:o,mainSizeMode:i}=this.props,s=this.getSizeModeNls(i);return(0,e.jsx)("div",{style:this.props.style,css:this.getStyle()},(0,e.jsx)("div",{className:"d-flex flex-column state-toggle-btn",onClick:this.toggleLayoutMode,title:t?`${this.formatMessage("autoEnabledTip",{label:s})} ${this.formatMessage("customDisabledTip")}`:`${this.formatMessage("customEnabledTip")} ${this.formatMessage("autoDisabledTip")}`},(0,e.jsx)("div",{className:"toggle-part text-nowrap"},this.formatMessage("auto")),(0,e.jsx)("div",{className:"toggle-part text-nowrap"},this.formatMessage("custom")),(0,e.jsx)("div",{className:"toggle-highlight"})),(0,e.jsx)(d,{theme:o,toggle:this.handleToggleAutoConfirm,onClosed:this.autoConfirmClosed,title:this.formatMessage("enableConfirm"),isOpen:this.state.showAutoConfirm,formatMessage:this.props.formatMessage},(0,e.jsx)("div",null,(0,e.jsx)("div",null,this.formatMessage("autoConfirmMsg",{label:s,auto:this.formatMessage("auto").toLocaleLowerCase()})))),(0,e.jsx)(d,{theme:o,toggle:this.handleToggleCustomConfirm,onClosed:this.customConfirmClosed,title:this.formatMessage("enableConfirm"),isOpen:this.state.showCustomConfirm,formatMessage:this.props.formatMessage},(0,e.jsx)("div",null,(0,e.jsx)("div",null,this.formatMessage("customConfirmMsg1",{custom:this.formatMessage("custom").toLocaleLowerCase()})),(0,e.jsx)("div",{css:e.css`margin-top: 1rem;`},this.formatMessage("customConfirmMsg2")))))}}const h={certainly:"OK",autoEnabledTip:"Auto layout is enabled. Widgets are synced with those on the {label} and arranged automatically.",autoDisabledTip:"Click to enable auto layout.",customEnabledTip:"Custom layout is enabled. Widgets added in other device modes will not be automatically added here. Alternatively, you can manually add them from the pending list on the Insert panel.",customDisabledTip:"Click to enable custom layout.",confirm:"Confirm",enableConfirm:"Are you sure you want to enable it?",autoConfirmMsg:"By enabling {auto}, the widgets will be synced with those on the {label} and arranged automatically.",customConfirmMsg1:"By enabling {custom}, you can manually arrange widgets for this device mode.",customConfirmMsg2:"However, widgets added in other device modes will not be automatically added here. Alternatively, you can manually add them from the pending list on the Insert panel.",dragToResize:"Drag to resize",largeScreen:"Large screen device",mediumScreen:"Medium screen device",smallScreen:"Small screen device",deleteWarning:'Deleting a widget will remove it from all device views. Linked widgets in other states of the same list or card will also be deleted. Use "Move to the pending list" button to remove it from current device view and state and preserve it in the others.',confirmDelete:"Are you sure you want to delete this widget from all devices and states?",quickStyleItem:"Quick style {index}",chooseWidget:"Choose widget"};var m=p(1496);const f="confirm-delete-widget";function v(){return`${e.utils.getLocalStorageAppKey()}-${f}`}function y(){return"false"!==e.utils.readLocalStorage(v())}function x(o){return!(!o||window.isExpressBuilder)&&(!!y()&&(!!function(o){var i;if(!o)return!1;const s=(0,t.getAppConfigAction)().appConfig,{layoutId:a,layoutItemId:n}=o,r=s.layouts[a].content[n];if(!r)return!1;if(r.type===e.LayoutItemType.Section||r.type===e.LayoutItemType.ScreenGroup)return!0;if(r.type===e.LayoutItemType.Widget&&r.widgetId)return(null===(i=s.widgets[r.widgetId].manifest)||void 0===i?void 0:i.widgetType)!==e.WidgetType.Layout;return!1}(o)&&function(o){const{layoutId:i,layoutItemId:s}=o,a=(0,t.getAppConfigAction)().appConfig,n=a.layouts[i].content[s],r=n.type,l=m.utils.getCurrentSizeMode();if(r===e.LayoutItemType.Widget){const e=n.widgetId,t=a.widgets[e];let o=!1;return Object.keys(t.parent).length>1&&(o=w(a,l,t.parent)),o||t.parent[l].length>1}if(r===e.LayoutItemType.Section){const e=n.sectionId,t=a.sections[e];let o=!1;return Object.keys(t.parent).length>1&&(o=w(a,l,t.parent)),o||t.parent[l].length>1}return!1}(o)))}function w(e,t,o){let i=!1;return Object.keys(o).length>1&&(i=Object.keys(o).some((i=>i!==t&&(o[i].length>0&&o[i].some((t=>!m.searchUtils.findLayoutItem(e,t).isPending)))))),i}function b(t){const{formatMessage:i,onConfirmDelete:s,onCancelDelete:a}=t,[n,r]=e.React.useState(!1),d=e.ReactRedux.useSelector((e=>{var t;return null===(t=e.builder)||void 0===t?void 0:t.contentToDelete}),e.ReactRedux.shallowEqual),c=e.React.useMemo((()=>x(d)),[d]),u=e.React.useCallback((()=>{s(d)}),[d,s]);e.React.useEffect((()=>{d&&!c&&u()}),[d,c,u]);const p=e.React.useCallback((()=>{r(!n)}),[n]),g=e.React.useCallback((()=>{r(!1),a()}),[a]),h=e.React.useCallback((()=>{var t;t=!n,e.utils.setLocalStorage(v(),`${t}`),u(),r(!1)}),[n,u]);return c?(0,e.jsx)(o.Modal,{isOpen:!0,centered:!0,css:e.css`
    .modal-body{
      overflow-y: auto;
      max-height: 360px;
      padding: 0;
      line-height: normal;
    }
    .modal-content{
      width: auto;
      background: var(--ref-palette-neutral-400);
      padding: 30px;
      border: none;
    }
    .modal-footer{
      padding: 0;
      margin-top: 30px;
      .btn {
        min-width: 80px;
        + .btn {
          margin-left: 10px;
        }
      }
    }
    &.modal-dialog{
      width: auto;
    }

    .title-icon {
      padding: 0 6px;
    }
    .title-label {
      font-size: 1rem;
      color: var(--ref-palette-black);
    }

    .message {
      margin-left: 36px;
      margin-top: 1rem;
      font-weight: 400;
      font-size: 0.8125rem;
      line-height: normal;
    }
  `},(0,e.jsx)(o.ModalBody,null,(0,e.jsx)("div",{className:"d-flex align-items-start"},(0,e.jsx)("div",{className:"title-icon"},(0,e.jsx)(l,{size:24,color:"var(--danger)"})),(0,e.jsx)("div",{className:"title-label"},i("confirmDelete"))),(0,e.jsx)("div",{className:"message"},(0,e.jsx)("div",{"data-testid":"confirmDeleteMessage",className:"text-paper",css:e.css`
            color: var(--ref-palette-neutral-1100);
          `},i("deleteWarning")),(0,e.jsx)("div",{css:e.css`margin-top: 1.5rem;`},(0,e.jsx)(o.Label,{check:!0,centric:!0,css:e.css`
              color: var(--ref-palette-black);
            `},(0,e.jsx)(o.Checkbox,{"data-testid":"dontShowAgain",style:{cursor:"pointer"},className:"mr-2",checked:n,onChange:p}),i("dialogPreventDisplayAgainDefaultText"))))),(0,e.jsx)(o.ModalFooter,null,(0,e.jsx)(o.Button,{"data-testid":"deleteBtn",type:"danger",onClick:h},i("delete")),(0,e.jsx)(o.Button,{"data-testid":"cancelBtn",onClick:g},i("cancel")))):null}var S=p(3089);function M(o){var i,s,a;const n=e.ReactRedux.useSelector((e=>{var t;return null===(t=e.builder)||void 0===t?void 0:t.contentToDelete}),e.ReactRedux.shallowEqual),r=e.React.useMemo((()=>function(o){var i,s,a,n,r;if(!o||window.isExpressBuilder)return!1;let l=!1;const{layoutId:d,layoutItemId:c}=o,u=(0,t.getAppConfigAction)().appConfig,p=null===(a=null===(s=null===(i=u.layouts)||void 0===i?void 0:i[d])||void 0===s?void 0:s.content)||void 0===a?void 0:a[c];if((null==p?void 0:p.type)===e.LayoutItemType.Widget&&p.widgetId){const e=null===(n=u.widgets)||void 0===n?void 0:n[p.widgetId];(null===(r=null==e?void 0:e.outputDataSources)||void 0===r?void 0:r.length)>0&&(l=e.outputDataSources.some((e=>S.dataComponentsUtils.getWidgetsUsingDsOrItsDescendantDss(e,u.widgets).length>0)))}return l}(n)),[n]),l=e.React.useCallback((()=>{o.onConfirmDelete(n)}),[n]);e.React.useEffect((()=>{n&&!r&&l()}),[n,r]);const d=e.React.useCallback((()=>{o.onCancelDelete()}),[]);if(!r)return null;const c=(0,t.getAppConfigAction)().appConfig,u=null===(a=null===(s=null===(i=null==c?void 0:c.layouts)||void 0===i?void 0:i[null==n?void 0:n.layoutId])||void 0===s?void 0:s.content)||void 0===a?void 0:a[null==n?void 0:n.layoutItemId];return(0,e.jsx)(S.DataSourceRemoveWarningPopup,{isOpen:!0,toggle:d,widgetId:null==u?void 0:u.widgetId,reason:S.DataSourceRemoveWaringReason.SourceWidgetRemoved,afterRemove:l})}var C=p(6055),I=p(9298),j=p(6884);function k(t){const{data:o}=t,{templateMethod:i,onSelect:s}=null!=o?o:{},a=e.hooks.useEventCallback((e=>{s(e)}));return null==o?null:(0,e.jsx)(I.TemplateList,{templates:j[i](!1),onItemSelect:a})}function L(t){const{data:o}=t,{isPlaceholder:i,isItemAccepted:s,onSelect:a}=null!=o?o:{},n=e.hooks.useEventCallback((e=>{a(e)}));return null==o?null:(0,e.jsx)(I.WidgetList,{isPlaceholder:i,isAccepted:s,onSelect:n})}var A=p(1888),R=p(3949),P=function(e,t,o,i){return new(o||(o=Promise))((function(s,a){function n(e){try{l(i.next(e))}catch(e){a(e)}}function r(e){try{l(i.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(n,r)}l((i=i.apply(e,t||[])).next())}))};const{useState:z,useRef:D,useEffect:O}=e.React,T=(0,A.styled)(R.RichExpressionBuilder)((({theme:t})=>{var o,i;const s=t.ref.palette.neutral[400],a=null===(i=null===(o=null==t?void 0:t.ref.palette)||void 0===o?void 0:o.neutral)||void 0===i?void 0:i[1e3],n=t.ref.palette.black;return e.css`
    > * {
      user-select: none;
    }
    width: 285px;
    height: 500px;
    color: ${n};
    background: ${s};
    .panel-header {
      background: ${s};
      color: ${a};
    }
    .expression-body {
      height: 100%;
    }
  `}));function B(i){const{theme:s,intl:a,locale:n,isFullScreenPage:r}=i,l=e.hooks.useTranslation(o.defaultMessages),[d,c]=z(null),[u,p]=z({}),[g,h]=z({}),m=e.ReactRedux.useSelector((e=>{var t,o,i,s;const a=null==e?void 0:e.appStateInBuilder,n=null===(t=null==a?void 0:a.appConfig)||void 0===t?void 0:t.layouts,r=null===(o=null==a?void 0:a.appRuntimeInfo)||void 0===o?void 0:o.selection,l=n[null==r?void 0:r.layoutId];return null===(s=null===(i=null==l?void 0:l.content)||void 0===i?void 0:i[null==r?void 0:r.layoutItemId])||void 0===s?void 0:s.widgetId})),f=e.ReactRedux.useSelector((e=>{var t;const o=null==e?void 0:e.appStateInBuilder;return null===(t=null==o?void 0:o.appRuntimeInfo)||void 0===t?void 0:t.currentPageId})),v=D(null),y=D(null),x=D(null),w=D(null),b=D(null),S=D(null),M=e.hooks.usePrevious(m),C=e.hooks.usePrevious(f);let I;O((()=>{const o=t=>P(this,void 0,void 0,(function*(){if(!g[t]&&t){const o=`${t}dist/runtime/builder-support`;e.moduleLoader.loadModule(o).then((e=>{switch(h(Object.assign(Object.assign({},g),{[t]:!0})),t){case"widgets/common/button/":v.current=e.default.QuickStyle;break;case"widgets/common/divider/":y.current=e.default.QuickStyle;break;case"widgets/common/navigator/":x.current=e.default.NavQuickStyle,w.current=e.default.ManageViews;case"widgets/common/controller/":b.current=e.default.ManageWidgetsComponent;case"widgets/layout/accordion/":S.current=e.default.QuickStyle}}))}yield Promise.resolve()}));window._builderPubsub.subscribe(`to_builder.${t.ToBuilderMessage.SetSidePanel}`,((e,t)=>{const i=e=>{var o;null===(o=null==t?void 0:t.onSelect)||void 0===o||o.call(t,e),!(null==t?void 0:t.keepPanel)&&p((e=>{const t=Object.assign({},e);return Object.keys(t).forEach((e=>{t[e]=!1})),t}))};o(null==t?void 0:t.uri).then((()=>{!1!==(null==t?void 0:t.active)&&c(Object.assign(Object.assign({},t),{onSelect:i}));const e=void 0===(null==t?void 0:t.active)||(null==t?void 0:t.active);p(e?o=>{const i=Object.assign({},o);return Object.keys(i).forEach((e=>{i[e]=!1})),i[(null==t?void 0:t.widgetId)||"other"]=e,i}:o=>{const i=Object.assign({},o);return i[(null==t?void 0:t.widgetId)||"other"]=e,i})}))}));((null==d?void 0:d.widgetId)!==m&&M!==m||C!==f)&&p((e=>{const t=Object.assign({},e);return Object.keys(t).forEach((e=>{t[e]=!1})),t}))}),[g,d,M,m,C,f]),I="template"===(null==d?void 0:d.type)||"templateBlock"===(null==d?void 0:d.type)?l("selectTemplate"):"widget"===(null==d?void 0:d.type)?l("addWidget"):"manageWidgets"===(null==d?void 0:d.type)?l("manageWidgets"):"textExpression"===(null==d?void 0:d.type)?l("dynamicContent"):"navigatorManageViews"===(null==d?void 0:d.type)?l("manageViews"):l("quickStyle");const j=e.hooks.useEventCallback((()=>{p((e=>{const t=Object.assign({},e);return Object.keys(t).forEach((e=>{t[e]=!1})),t})),"function"==typeof(null==d?void 0:d.onClose)&&d.onClose()})),R=Object.keys(u).some((e=>u[e])),B=a.messages,E=["buttonQuickStyle","dividerQuickStyle","navigatorQuickStyle"].includes(null==d?void 0:d.type);return(0,e.jsx)(e.IntlProvider,{locale:n,defaultLocale:n,messages:B},R&&(0,e.jsx)("div",{className:"mobile-tool-container",css:((t,o)=>{const i="dark"===t.sys.color.mode;let s=360;switch(o){case"template":s=370;break;case"templateBlock":s=450;break;case"widget":s=380;break;case"manageWidgets":case"navigatorManageViews":s=300;break;case"buttonQuickStyle":case"dividerQuickStyle":s=360;break;case"textExpression":case"navigatorQuickStyle":s=260;break;case"accordionQuickStyle":s=310}return e.css`
      width: ${e.polished.rem(s)};
      ${r?"max-height: 100%;":`max-height: ${e.polished.rem(640)};`}
      ${"textExpression"===o&&"height: 640px;"}
      background-color: ${i?t.ref.palette.neutral[400]:t.ref.palette.neutral[1100]};
      border: 1px solid ${i?t.ref.palette.neutral[500]:t.ref.palette.neutral[1e3]};
      box-shadow: 0 4px 20px 4px ${e.polished.rgba(i?t.ref.palette.white:t.ref.palette.black,.5)};
      position: sticky;
      top: 20px;
      .panel-header{
        color: ${i?t.ref.palette.neutral[1e3]:t.ref.palette.neutral[500]} !important;
        .action-btn{
          color: ${i?t.ref.palette.neutral[1e3]:t.ref.palette.neutral[500]} !important;
          &:hover{
            color: ${i?t.ref.palette.neutral[1200]:t.ref.palette.neutral[300]} !important;
          }
        }
      }
      .mobile-tool-board{
        height: calc(100% - 40px);
        ${"widget"!==o?"overflow-y: auto;":"overflow-y: hidden;"}
        overflow-x: hidden;
        .content{
          height: 100%;
          margin: 0 auto;
          padding: 0px;
        }
        .fixed-at-bottom{
          position: absolute !important;
        }
        .list-container{
          height: calc(100% - 100px);
        }
      }
      .quick-style-item-container{
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 8px;
      }
      .quick-style-item{
        border: 2px solid transparent;
        &.quick-style-item-selected{
          border: 2px solid ${t.sys.color.primary.main};
        }
        ${"buttonQuickStyle"===o&&`.quick-style-item-inner{\n          background-color: ${i?t.ref.palette.neutral[500]:t.ref.palette.neutral[1e3]};\n        }`}
      }
    `})(s,null==d?void 0:d.type),onClick:e=>{e.stopPropagation()}},(0,e.jsx)(o.PanelHeader,{showClose:!0,onClose:j,title:I}),(0,e.jsx)(A.ThemeSwitchComponent,{useTheme2:E},(0,e.jsx)("div",{className:"mobile-tool-board"},(t=>{if(!t||!d)return;let o;switch(t){case"template":case"templateBlock":o=(0,e.jsx)(k,{data:d});break;case"widget":o=(0,e.jsx)(L,{data:d});break;case"manageWidgets":const t=b.current;o=t?(0,e.jsx)(t,{widgetId:d.widgetId}):null;break;case"buttonQuickStyle":const i=v.current;o=i?(0,e.jsx)(i,{widgetId:d.widgetId}):null;break;case"textExpression":o=(0,e.jsx)(T,{widgetId:d.widgetId,useDataSources:d.useDataSources,editor:d.editor,formats:d.formats,selection:d.selection});break;case"dividerQuickStyle":const s=y.current;o=s?(0,e.jsx)(s,{widgetId:d.widgetId}):null;break;case"navigatorQuickStyle":const a=x.current;o=a?(0,e.jsx)(a,{widgetId:d.widgetId}):null;break;case"navigatorManageViews":const n=w.current;o=n?(0,e.jsx)(n,{widgetId:d.widgetId}):null;break;case"accordionQuickStyle":const r=S.current;o=r?(0,e.jsx)(r,{widgetId:d.widgetId}):null}return o})(null==d?void 0:d.type)))))}t.LayoutServiceProvider.getInstance().registerService(e.LayoutType.RowLayout,new C.RowLayoutService),t.LayoutServiceProvider.getInstance().registerService(e.LayoutType.GridLayout,new C.GridLayoutService),t.LayoutServiceProvider.getInstance().registerService(e.LayoutType.FixedLayout,new C.FixedLayoutService),t.LayoutServiceProvider.getInstance().registerService(e.LayoutType.FlowLayout,new C.FlowLayoutService),t.LayoutServiceProvider.getInstance().registerService(e.LayoutType.ColumnLayout,new C.ColumnLayoutService);class E extends e.React.PureComponent{constructor(o){super(o),this.resizeIframe=()=>{const{viewportSize:t,pageMode:o,appMode:i,currentDialogId:s,isCookieBannerOpenByPrivacyPanel:a}=this.props;if(i!==e.AppMode.Design||s||a)return void(this.deviceRef.current.style.height=`${t.height}px`);if(o!==e.PageMode.AutoScroll)return;const n=this.appIframe.contentWindow.document.documentElement.querySelector("div#app > div.page-renderer");if(n){const e=n.getBoundingClientRect(),o=Math.round(Math.max(e.height,t.height));this.deviceRef.current.style.height=`${o}px`}},this.formatMessage=(e,t)=>this.props.intl.formatMessage({id:e,defaultMessage:h[e]},t),this.mobileToolsHandler=()=>{var t,o;const{theme2:i,intl:s,locale:a,appMode:n,pageMode:r,viewportSize:l}=this.props;if(n===e.AppMode.Run)return null;const d=r===e.PageMode.FitWindow;let c;return c=(null===(o=null===(t=this.deviceRef)||void 0===t?void 0:t.current)||void 0===o?void 0:o.classList.contains("center-origin"))?`calc(50% + ${l.width/2+10}px)`:`${l.width+10}px`,(0,e.jsx)("div",{css:e.css`
          position: absolute;
          top: 0;
          bottom: 0;
          left: ${c};
        `,className:"d-flex flex-column"},(0,e.jsx)(B,{locale:a,intl:s,theme:i,isFullScreenPage:d}))},this.clearSelectionInApp=()=>{t.builderAppSync.publishChangeSelectionToApp(null)},this.showConfirmDeleteDsDialog=()=>{this.setState({shouldShowDeleteDsDialog:!0})},this.hideConfirmDeleteDsDialog=()=>{this.setState({shouldShowDeleteDsDialog:!1})},this.removeLayoutItem=o=>{this.resetConfirmDeleteContent();const i=(0,t.getAppConfigAction)();i.removeLayoutItem(o,!0,!0),i.exec(),window.isExpressBuilder||e.lodash.defer((()=>{const e=m.searchUtils.findParentLayoutInfo(o,i.appConfig,m.utils.getCurrentSizeMode());t.builderAppSync.publishChangeSelectionToApp(e)}))},this.resetConfirmDeleteContent=()=>{this.hideConfirmDeleteDsDialog(),(0,e.getAppStore)().dispatch(t.builderActions.confirmDeleteContentChanged(null))},this.state={appUrl:null,isPortrait:!0,shouldShowDeleteDsDialog:!1},this.resizeRef=e.React.createRef(),this.deviceRef=e.React.createRef(),this.contentRef=e.React.createRef(),this.debounceResizeIframe=e.lodash.debounce(this.resizeIframe,200)}componentDidMount(){this.setAppUrl(),e.lodash.defer((()=>{this.resizeIframe()}))}componentDidUpdate(t){this.setAppUrl();const{viewportSize:o,zoomScale:i,appMode:s}=this.props;this.viewportWidth===o.width&&Math.round(10*this.zoomScale)===Math.round(10*i)||(this.viewportWidth=o.width,this.zoomScale=i,this.applyZoomScale(this.props.zoomScale)),s!==t.appMode&&s===e.AppMode.Run&&this.contentRef.current&&(this.contentRef.current.scrollTop=0),this.debounceResizeIframe()}setAppUrl(){const o=e.urlUtils.getAppIdPageIdFromUrl().pageId;if(o&&"default"!==o)return;let i=`${window.jimuConfig.mountPath}experience/`;const s=this.props.queryObject;let a,n={draft:"true"};s.id?(a=s.id,a.startsWith("/")&&(a=a.substring(1)),a.endsWith("/")&&(a=a.substring(0,a.length-1)),window.jimuConfig.useStructuralUrl?i+=this.props.queryObject.id+"/":n.id=this.props.queryObject.id):s.app_config&&(a=s.app_config,n.config=s.app_config),n=Object.assign(n,s.without("id","config","views","theme")),i+="?"+e.queryString.stringify(n);const r=this.props.urlHashObject;if(i+="#"+e.queryString.stringify(r),this.state.appUrl!==i){if(this.props.currentAppId!==a){const e=t.AppResourceManager.getInstance();e.clearResources(this.props.currentAppId),e.clearResources(a),t.WidgetSettingManager.getInstance().destroyAllWidgetSettingClasses()}this.setState({appUrl:i})}this.props.currentAppId!==a&&this.props.dispatch(t.appStateActions.inAppAppStateChanged(null))}calAvailableWidth(){const e=this.contentRef.current.getBoundingClientRect();let t=parseFloat(o.styleUtils.remToPixel("3rem"));return isNaN(t)&&(t=48),e.width-t}applyZoomScale(e,t){const{viewportSize:o}=this.props;(null!=t?t:this.calAvailableWidth())<o.width?(this.deviceRef.current.classList.add("left-origin"),this.deviceRef.current.classList.remove("center-origin")):(this.deviceRef.current.classList.add("center-origin"),this.deviceRef.current.classList.remove("left-origin")),this.deviceRef.current.style.transform=`scale(${e})`}getButtonGroupStyle(){return e.css`
      position: absolute !important;
      right: 20px;
      top: 15px;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
      button {
        background: white !important;
        border: none !important;
      }

      button:focus {
        box-shadow: none !important;
      }

      button.active {
        background: #00a6b6 !important;
      }
    `}syncLayoutHandler(){var t,o;const{appConfig:i,appMode:s,currentPageId:a,browserSizeMode:n,currentDialogId:r,isRTL:l,isCookieBannerOpenByPrivacyPanel:d}=this.props;if(!i||s!==e.AppMode.Design)return null;const c=i.mainSizeMode;if(n===c)return null;if(d)return null;const p=null===(t=i.pages)||void 0===t?void 0:t[a],g=null===(o=i.dialogs)||void 0===o?void 0:o[r],h=i.header&&p.header&&(i.header.height[n]||i.header.height[c])||0,m=l?{left:"calc( 100% + 12px )"}:{right:"calc( 100% + 12px )"},f=Object.assign({top:"calc( 50% - 30px)",position:"fixed"},m);return(0,e.jsx)("div",{css:e.css`
          position: absolute;
          top: 0;
          bottom: 0;
          right: calc(100% + 12px);
        `,className:"d-flex flex-column sync-layout-handler"},p.header&&!r&&(0,e.jsx)(u,{isAuto:!i.header.layout[n],formatMessage:this.formatMessage,theme:this.props.theme,pageId:a,browserSizeMode:n,mainSizeMode:i.mainSizeMode,isHeader:!0}),!r&&(0,e.jsx)(u,{isAuto:!p.layout[n],formatMessage:this.formatMessage,theme:this.props.theme,browserSizeMode:n,mainSizeMode:i.mainSizeMode,pageId:a,style:{marginTop:`${Math.max(+h-60,20)}px`,top:20}}),p.footer&&!r&&(0,e.jsx)(u,{isAuto:!i.footer.layout[n],formatMessage:this.formatMessage,theme:this.props.theme,browserSizeMode:n,mainSizeMode:i.mainSizeMode,pageId:a,isFooter:!0,style:{bottom:30}}),r&&(0,e.jsx)(u,{isAuto:!g.layout[n],formatMessage:this.formatMessage,theme:this.props.theme,browserSizeMode:n,mainSizeMode:i.mainSizeMode,dialogId:r,isDialog:!0,style:f}))}render(){var t;const{appConfig:i,theme:a,pageMode:n,viewportSize:r,loadAppConfigError:l,browserSizeMode:d}=this.props,c=n===e.PageMode.FitWindow,u=this.getScaledViewportSize(),p=null!==(t=null==r?void 0:r.height)&&void 0!==t?t:0,g=i||l;return(0,e.jsx)("div",{css:s(c,p,a),onClick:this.clearSelectionInApp,className:"jimu-widget widget-builder-app-loader"},!g&&e.ReactDOM.createPortal((0,e.jsx)(o.Loading,{type:o.LoadingType.Primary}),document.body),(0,e.jsx)("div",{className:"content-section",ref:this.contentRef},(0,e.jsx)("div",{className:"content",style:{minHeight:c?u.height+100:null,minWidth:"100%",width:`calc(${u.width}px + 3rem)`}},(0,e.jsx)("div",{ref:this.resizeRef,className:(0,e.classNames)("body-section d-flex flex-column justify-content-start")},(0,e.jsx)("div",{ref:this.deviceRef,className:(0,e.classNames)("device-frame shadow d-flex flex-grow-1",{invisible:!g}),style:Object.assign(Object.assign({},this.getDeviceSize()),{overflow:"visible"})},(0,e.jsx)("iframe",{allowFullScreen:!0,name:e.APP_FRAME_NAME_IN_BUILDER,src:this.state.appUrl,className:"config-preview",ref:e=>{this.appIframe=e}}),this.syncLayoutHandler(),d===e.BrowserSizeMode.Small&&this.mobileToolsHandler())))),(0,e.jsx)(b,{formatMessage:this.formatMessage,onConfirmDelete:this.showConfirmDeleteDsDialog,onCancelDelete:this.resetConfirmDeleteContent}),this.state.shouldShowDeleteDsDialog&&(0,e.jsx)(M,{onConfirmDelete:this.removeLayoutItem,onCancelDelete:this.resetConfirmDeleteContent}))}getDeviceSize(){const{pageMode:t,viewportSize:o,appMode:i,currentDialogId:s,isCookieBannerOpenByPrivacyPanel:a}=this.props;return t===e.PageMode.FitWindow||i!==e.AppMode.Design||t===e.PageMode.AutoScroll&&s||t===e.PageMode.AutoScroll&&a?o:{width:o.width}}getScaledViewportSize(){const{viewportSize:e}=this.props,{zoomScale:t}=this.props;return{width:e.width*t,height:e.height*t}}}E.mapExtraStateProps=(t,o)=>{var i,s,a,n,r,l,d,c,u,p,g,h,m,f,v,y,x,w,b,S,M,C;const I=null===(s=null===(i=t.appStateInBuilder)||void 0===i?void 0:i.appRuntimeInfo)||void 0===s?void 0:s.currentPageId,j=(null===(a=t.appStateInBuilder)||void 0===a?void 0:a.browserSizeMode)||e.BrowserSizeMode.Large;let k;I&&(k=null===(d=null===(l=null===(r=null===(n=t.appStateInBuilder)||void 0===n?void 0:n.appConfig)||void 0===r?void 0:r.pages)||void 0===l?void 0:l[I])||void 0===d?void 0:d.mode);const L=e.utils.findViewportSize(null===(c=t.appStateInBuilder)||void 0===c?void 0:c.appConfig,j);return{currentDialogId:null===(p=null===(u=t.appStateInBuilder)||void 0===u?void 0:u.appRuntimeInfo)||void 0===p?void 0:p.currentDialogId,isCookieBannerOpenByPrivacyPanel:null===(m=null===(h=null===(g=t.appStateInBuilder)||void 0===g?void 0:g.appRuntimeInfo)||void 0===h?void 0:h.cookieBanner)||void 0===m?void 0:m.isCookieBannerOpenByPrivacyPanel,currentPageId:I,pageMode:k,viewportSize:L,appConfig:null===(f=t.appStateInBuilder)||void 0===f?void 0:f.appConfig,loadAppConfigError:null===(v=t.appStateInBuilder)||void 0===v?void 0:v.loadAppConfigError,currentAppId:t.builder.currentAppId,browserSizeMode:j,appMode:null===(x=null===(y=t.appStateInBuilder)||void 0===y?void 0:y.appRuntimeInfo)||void 0===x?void 0:x.appMode,zoomScale:null!==(S=null===(b=null===(w=t.appStateInBuilder)||void 0===w?void 0:w.appRuntimeInfo)||void 0===b?void 0:b.zoomScale)&&void 0!==S?S:1,widgetsRuntimeInfo:null===(M=t.appStateInBuilder)||void 0===M?void 0:M.widgetsRuntimeInfo,isRTL:null===(C=t.appContext)||void 0===C?void 0:C.isRTL,queryObject:t.queryObject,urlHashObject:t.urlHashObject,locale:t.appContext.locale,defaultLocale:t.appContext.locale}};const N=E;function W(e){p.p=e}})(),g})())}}}));