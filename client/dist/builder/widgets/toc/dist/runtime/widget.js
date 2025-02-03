System.register(["jimu-core","jimu-core/dnd","jimu-for-builder","jimu-layouts/layout-runtime","jimu-theme","jimu-ui","jimu-ui/advanced/resource-selector","jimu-ui/advanced/setting-components"],(function(e,t){var i={},o={},s={},n={},a={},r={},l={},d={};return{setters:[function(e){i.APP_FRAME_NAME_IN_BUILDER=e.APP_FRAME_NAME_IN_BUILDER,i.AppMode=e.AppMode,i.ContainerType=e.ContainerType,i.DialogMode=e.DialogMode,i.GridItemType=e.GridItemType,i.Immutable=e.Immutable,i.LayoutItemType=e.LayoutItemType,i.LayoutType=e.LayoutType,i.LinkType=e.LinkType,i.LoadingType=e.LoadingType,i.PageMode=e.PageMode,i.PagePart=e.PagePart,i.PageType=e.PageType,i.React=e.React,i.ReactDOM=e.ReactDOM,i.ReactRedux=e.ReactRedux,i.appActions=e.appActions,i.appConfigUtils=e.appConfigUtils,i.classNames=e.classNames,i.css=e.css,i.defaultMessages=e.defaultMessages,i.getAppStore=e.getAppStore,i.isKeyboardMode=e.isKeyboardMode,i.jsx=e.jsx,i.lodash=e.lodash,i.polished=e.polished,i.urlUtils=e.urlUtils},function(e){o.interact=e.interact},function(e){s.LayoutServiceProvider=e.LayoutServiceProvider,s.appConfigUtils=e.appConfigUtils,s.builderAppSync=e.builderAppSync,s.getAppConfigAction=e.getAppConfigAction,s.utils=e.utils},function(e){n.defaultMessages=e.defaultMessages,n.searchUtils=e.searchUtils},function(e){a.withTheme=e.withTheme},function(e){r.Button=e.Button,r.Collapse=e.Collapse,r.Dropdown=e.Dropdown,r.DropdownButton=e.DropdownButton,r.DropdownItem=e.DropdownItem,r.DropdownMenu=e.DropdownMenu,r.DropdownSubMenuItem=e.DropdownSubMenuItem,r.Icon=e.Icon,r.ListGroupItem=e.ListGroupItem,r.Modal=e.Modal,r.ModalBody=e.ModalBody,r.ModalFooter=e.ModalFooter,r.ModalHeader=e.ModalHeader,r.Tab=e.Tab,r.Tabs=e.Tabs,r.TextInput=e.TextInput,r.Tooltip=e.Tooltip,r.defaultMessages=e.defaultMessages},function(e){l.IconPicker=e.IconPicker},function(e){d.LinkSelectorSidePopper=e.LinkSelectorSidePopper,d.OpenTypes=e.OpenTypes,d.PageTemplatePopper=e.PageTemplatePopper,d.WindowTemplatePopper=e.WindowTemplatePopper,d.changeCurrentDialog=e.changeCurrentDialog,d.changeCurrentPage=e.changeCurrentPage,d.handelDialogInfos=e.handelDialogInfos}],execute:function(){e((()=>{var e={8116:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M.5 6a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1z" clip-rule="evenodd"></path></svg>'},6572:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M15.29 6.208 8 1 .71 6.208a.5.5 0 1 0 .58.813L2 6.515V15h12V6.514l.71.507a.5.5 0 0 0 .58-.813M13 5.8 8 2.229 3 5.8V14h3v-4h4v4h3zM9 14H7v-3h2z" clip-rule="evenodd"></path></svg>'},4109:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M3.154 3.154a.527.527 0 0 1 .746 0l1.317 1.317A8.6 8.6 0 0 1 8 4c2.667 0 5.667 1.333 7 4-.696 1.393-1.847 2.422-3.168 3.087l1.014 1.013a.527.527 0 1 1-.746.746l-1.317-1.317A8.6 8.6 0 0 1 8 12c-2.667 0-5.667-1.333-7-4 .696-1.393 1.847-2.422 3.168-3.087L3.154 3.9a.527.527 0 0 1 0-.746m1.698 2.443C3.726 6.087 2.782 6.882 2 8c1.422 2.033 3.382 3 6 3a8.7 8.7 0 0 0 2.03-.225l-.675-.674A2.5 2.5 0 0 1 5.9 6.644zm6.296 4.805C12.275 9.913 13.218 9.119 14 8c-1.422-2.033-3.382-3-6-3q-1.088 0-2.03.225l.675.674a2.5 2.5 0 0 1 3.457 3.456zM6.5 8c0-.221.048-.431.134-.62l1.987 1.986A1.5 1.5 0 0 1 6.5 8m.88-1.366 1.986 1.987a1.5 1.5 0 0 0-1.987-1.987" clip-rule="evenodd"></path></svg>'},4651:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M2 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2m5 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0m6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0" clip-rule="evenodd"></path></svg>'},3600:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M8 2c3.314 0 6 2.574 6 5.75s-2.686 5.75-6 5.75c-.78 0-1.524-.142-2.207-.402Q5.2 12.873 2 14l.198-.52q.879-2.379.549-2.95A5.54 5.54 0 0 1 2 7.75C2 4.574 4.686 2 8 2m0 1C5.23 3 3 5.136 3 7.75c0 .809.212 1.587.613 2.28.282.49.294 1.153.068 2.09l-.08.304.155-.044c1.092-.306 1.81-.391 2.297-.248l.094.031A5.2 5.2 0 0 0 8 12.5c2.77 0 5-2.136 5-4.75S10.77 3 8 3M6 5H5v5h1V8h2v2h1V5H8v2H6zm4 2h1v3h-1zm1-2h-1v1h1z" clip-rule="evenodd"></path></svg>'},3529:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M8 12c-2.667 0-5.667-1.333-7-4 1.333-2.667 4.333-4 7-4s5.667 1.333 7 4c-1.333 2.667-4.333 4-7 4m0-7c-2.618 0-4.578.967-6 3 1.422 2.033 3.382 3 6 3s4.578-.967 6-3c-1.422-2.033-3.382-3-6-3m0 5.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0-1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" clip-rule="evenodd"></path></svg>'},5886:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12"><path fill="#000" fill-rule="evenodd" d="M10.167 0H1.833A.845.845 0 0 0 1 .857v10.286c0 .473.373.857.833.857h8.334c.46 0 .833-.384.833-.857V.857A.845.845 0 0 0 10.167 0M2 11V1h8v10zm1.6-8h4.8c.331 0 .6.224.6.5s-.269.5-.6.5H3.6c-.331 0-.6-.224-.6-.5s.269-.5.6-.5m4.8 3H3.6c-.331 0-.6.224-.6.5s.269.5.6.5h4.8c.331 0 .6-.224.6-.5S8.731 6 8.4 6" clip-rule="evenodd"></path></svg>'},655:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M2.146 4.653a.485.485 0 0 1 .708 0L8 10.24l5.146-5.587a.485.485 0 0 1 .708 0 .54.54 0 0 1 0 .738l-5.5 5.956a.485.485 0 0 1-.708 0l-5.5-5.956a.54.54 0 0 1 0-.738" clip-rule="evenodd"></path></svg>'},2943:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M4.653 13.854a.485.485 0 0 1 0-.708L10.24 8 4.653 2.854a.485.485 0 0 1 0-.708.54.54 0 0 1 .738 0l5.956 5.5a.485.485 0 0 1 0 .708l-5.956 5.5a.54.54 0 0 1-.738 0" clip-rule="evenodd"></path></svg>'},4064:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M13.854 11.347a.486.486 0 0 1-.708 0L8 5.76l-5.146 5.587a.485.485 0 0 1-.708 0 .54.54 0 0 1 0-.738l5.5-5.956a.485.485 0 0 1 .708 0l5.5 5.956a.54.54 0 0 1 0 .738" clip-rule="evenodd"></path></svg>'},3662:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M7.5 0a.5.5 0 0 0-.5.5V7H.5a.5.5 0 0 0 0 1H7v6.5a.5.5 0 0 0 1 0V8h6.5a.5.5 0 0 0 0-1H8V.5a.5.5 0 0 0-.5-.5"></path></svg>'},170:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0m-1.27 4.936a6.5 6.5 0 1 1 .707-.707l4.136 4.137a.5.5 0 1 1-.707.707z" clip-rule="evenodd"></path></svg>'},3839:e=>{e.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzU5NjZfNjY5KSI+DQo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNDcwNzkgNi4yODMwNEwwLjE2MTIzMyAyLjkyODk4Qy0wLjA1Mzc0NDQgMi43MTY0NiAtMC4wNTM3NDQ0IDIuMzcxOTEgMC4xNjEyMzMgMi4xNTkzOUMwLjM3NjIxMSAxLjk0Njg3IDAuNzI0NzU4IDEuOTQ2ODcgMC45Mzk3MzUgMi4xNTkzOUw0IDUuMjY3TDcuMDYwMjYgMi4xNTkzOUM3LjI3NTI0IDEuOTQ2ODcgNy42MjM3OSAxLjk0Njg3IDcuODM4NzcgMi4xNTkzOUM4LjA1Mzc0IDIuMzcxOTEgOC4wNTM3NCAyLjcxNjQ2IDcuODM4NzcgMi45Mjg5OEw0LjUyOTIxIDYuMjgzMDRDNC4yMzY1OCA2LjU3MjMyIDMuNzYzNDIgNi41NzIzMiAzLjQ3MDc5IDYuMjgzMDRaIiBmaWxsPSIjQzVDNUM1Ii8+DQo8L2c+DQo8ZGVmcz4NCjxjbGlwUGF0aCBpZD0iY2xpcDBfNTk2Nl82NjkiPg0KPHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0id2hpdGUiLz4NCjwvY2xpcFBhdGg+DQo8L2RlZnM+DQo8L3N2Zz4NCg=="},9244:e=>{"use strict";e.exports=i},6245:e=>{"use strict";e.exports=o},4108:e=>{"use strict";e.exports=s},1496:e=>{"use strict";e.exports=n},1888:e=>{"use strict";e.exports=a},4321:e=>{"use strict";e.exports=r},5809:e=>{"use strict";e.exports=l},9298:e=>{"use strict";e.exports=d}},t={};function c(i){var o=t[i];if(void 0!==o)return o.exports;var s=t[i]={exports:{}};return e[i](s,s.exports,c),s.exports}c.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return c.d(t,{a:t}),t},c.d=(e,t)=>{for(var i in t)c.o(t,i)&&!c.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},c.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),c.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.p="";var p={};return c.p=window.jimuConfig.baseUrl,(()=>{"use strict";c.r(p),c.d(p,{__set_webpack_public_path__:()=>Qe,default:()=>Xe});var e=c(9244),t=c(4108),i=c(4321),o=c(1496),s=c(9298),n=c(6245);const a={tocChooseTemplate:"Select a page template",newPage:"New page",addPage:"Add page",addLink:"Add link",addFolder:"Add folder",addLinkOrFolder:"Add links or folders",addDialog:"Add window",openedWithPages:"Opened with {pages}.",hideFromMenu:"Hide from menu",showFromMenu:"Show in menu",outline:"Outline",removePageTip:"There is(are) {subCount} subpage(s) in {label}, do you really want to remove it?",fullScreenApp:"Fullscreen app",fullScreenAppTip:"Best for creating a web app that takes the full area of the browser window.",scrollingPage:"Scrolling page",scrollingPageTip:"Best for creating a web page that scrolls in the browser window.",fixedModalWindow:"Fixed blocker",fixedNonModalWindow:"Fixed passthrough",anchoredWindow:"Anchored"},r="-toc-";class l extends e.React.Component{constructor(i){super(i),this.formatMessage=e=>this.props.intl.formatMessage({id:e,defaultMessage:a[e]}),this.handleArrowClick=e=>{const{onArrowClick:t,itemJson:i}=this.props;t&&t(i),e.stopPropagation()},this.handleClick=e=>{const{itemJson:t,editable:i}=this.props;t.allowEditable&&i&&e.stopPropagation()},this.handleRowOrColumnInGrid=(i,s,n)=>{const{itemJson:a}=this.props,r=o.searchUtils.findLayoutItem((0,t.getAppConfigAction)().appConfig,{layoutId:i,layoutItemId:s});if("layoutItem"===a.type&&r&&r.gridType!==e.GridItemType.Tab){const t=document.querySelector(`iframe[name="${e.APP_FRAME_NAME_IN_BUILDER}"]`),o=((null==t?void 0:t.contentDocument)||(null==t?void 0:t.contentWindow.document)).querySelector(`div.grid-layout[data-layoutid="${i}"]`).querySelector(`div[data-layoutid="${i}"][data-layoutitemid="${s}"]`);return n?o.classList.add("menu-active"):o.classList.remove("menu-active"),!0}return!1},this.handleMouseEnter=e=>{e.stopPropagation();const{itemJson:i}=this.props,o=i.id.split(r);o[0]&&o[1]&&(this.handleRowOrColumnInGrid(o[0],o[1],!0)||t.builderAppSync.publishTocHoverInfoToApp({layoutId:o[0],layoutItemId:o[1]},!0))},this.handleMouseLeave=e=>{e.stopPropagation();const{itemJson:i}=this.props,o=i.id.split(r);o[0]&&o[1]&&(this.handleRowOrColumnInGrid(o[0],o[1],!1)||t.builderAppSync.publishTocHoverInfoToApp({layoutId:o[0],layoutItemId:o[1]},!1))},this.handleDoubleClickItem=e=>{const{itemJson:t,onDoubleClick:i}=this.props;i&&i(t,e),e.stopPropagation()},this.renameItemClick=t=>{t&&t.stopPropagation(),this.editor&&e.lodash.defer((()=>{this.editor.focus(),this.editor.select()}))},this._checkLabel=(e,i,o)=>{if("view"===e&&o.includes(","))return{valid:!1,msg:this.formatMessage("noCommaInLabel")};const s=(0,t.getAppConfigAction)().appConfig;return t.appConfigUtils.isLabelDuplicated(s,e,i,o)?{valid:!1,msg:this.formatMessage("duplicatedLabel")}:{valid:!0}},this.onRenameAccept=t=>{e.lodash.defer((()=>{var e,i;null===(i=(e=this.props).renameItem)||void 0===i||i.call(e,this.props.itemJson,t)}))},this.editor=null}componentDidMount(){const{editable:e}=this.props;e&&this.renameItemClick()}componentDidUpdate(e){const{itemJson:t,editable:i}=this.props;t.label!==e.itemJson.label?this.setState({currentLabel:t.label}):t.icon!==e.itemJson.icon&&this.setState({currentIcon:t.icon}),t.allowEditable&&i!==e.editable&&i&&this.renameItemClick()}}var d=c(2943),h=c.n(d),g=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const u=t=>{const i=window.SVG,{className:o}=t,s=g(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:h()},s)):e.React.createElement("svg",Object.assign({className:n},s))};class m extends l{constructor(t){super(t),this.onDropHover=e=>{this.state.dropType!==e&&this.setState({dropType:e})},this.labelChanged=e=>{this.setState({currentLabel:e})},this.handleLabelBlur=(e,t)=>{var i,o;let s=""!==e.trim();s&&(s=this._checkLabel("page",t,e).valid),s||(e=this.props.itemJson.label,null===(o=(i=this.props).renameItem)||void 0===o||o.call(i,this.props.itemJson,e)),this.labelChanged(e)},this.handleLabelEnter=(e,t)=>{"Enter"===e.key&&""===this.state.currentLabel&&this.handleLabelBlur("",t)},this.getStyle=()=>{var t,i,o;const s=(0,e.getAppStore)().getState(),n=null===(t=null==s?void 0:s.appContext)||void 0===t?void 0:t.isRTL,{theme:a,editable:r,itemJson:l,isTocDragging:d}=this.props,{mustShowArrow:c,children:p,level:h,isActive:g,isExpand:u}=l,{isDragging:m,isHovering:f}=this.state;return e.css`
      min-height: ${30}px;
      width: auto;
      min-width: 100%;
      align-items: center;
      cursor: pointer;
      ${m?"z-index: 100;":""}

      &.drag-move-into {
        border: 1px solid ${a.sys.color.primary.dark};
      }

      .page-item-home-btn {
        display: ${l.showDefault&&(null===(i=null==l?void 0:l.data)||void 0===i?void 0:i.isDefault)&&!r?"inline-flex":"none"};
      }

      :hover {
        ${g||d?"":`background-color: ${a.ref.palette.neutral[500]};`}
        .dropDown {
          .btn {
            display: ${d||r?"none":"inline-flex"};
          }
          z-index: 2;
        }
        .page-item-visible-btn {
          display: ${d||r?"none":"inline-flex"};
          z-index: 2;
        }
        .page-item-home-btn {
          display: ${l.showDefault?d&&!(null===(o=null==l?void 0:l.data)||void 0===o?void 0:o.isDefault)||r?"none":"inline-flex":"none"};
          z-index: 2;
        }
      }

      &.active {
        ${d?"":`background-color: ${a.sys.color.primary.main};`}
        border: 0;
      }

      .toc-item-dropzone {
        touch-action: none;
        position: relative;

        .toc-item-drag:hover {
          cursor: pointer !important;
        }

        .toc-item-drag {
          pointer-events: ${f?"all":"none"};
          visibility: ${l.allowEditable&&r?"hidden":"visible"};
          z-index: 1;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background-color: ${m?e.polished.rgba(a.ref.palette.neutral[500],.6):"transparent"};
          box-shadow: ${m?a.sys.shadow.shadow3:"none"};
        }

        .toc-item {
          padding: 0;
          border: 0;
          position: relative;
          .toc-item-content {
            margin-left: ${10*h}px;
            position: relative;
            .toc-arrow {
              z-index: 2;
              padding-right: ${e.polished.rem(1)};
              visibility: ${c||p&&p.length>0?"visible":"hidden"};
              .toc-arrow-icon {
                fill: ${a.ref.palette.black};
                transform-origin: center;
                transform: ${`rotate(${u?90:n?180:0}deg)`};
                transition: transform .5s;
              }
            }

            .left-and-right {
              overflow-x: hidden;
              margin-left: -5px;
              .left-content {
                align-items: center;
                overflow-x: hidden;
                flex: auto;
                .editor {
                  overflow: hidden;
                  text-overflow: ${r?"clip":"ellipsis"};
                  white-space: nowrap;
                  font-size: ${.875}rem;
                  user-select: none;
                  flex: auto;
                  text-align: start;
                }
                [contenteditable="true"] {
                  user-select: text;
                  -webkit-user-select: text;
                  background-color: ${a.ref.palette.white};
                }
                .header-icon {
                  margin-right: 0.3rem;
                  flex: none;
                }
              }
            }
          }

          &.toc-drag-move-last {
            :after{
              content: '';
              position: absolute;
              left: 0;
              top: auto;
              bottom: 0;
              right: auto;
              height: 2px;
              width: 100%;
              background-color: ${a.sys.color.primary.dark};
            }
          }

          &.toc-drag-move-first {
            :before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: auto;
              right: auto;
              height: 2px;
              width: 100%;
              background-color: ${a.sys.color.primary.dark};
            }
          }

          .drag-move-out-order-bottom {
            :after{
              content: '';
              position: absolute;
              left: 0;
              top: auto;
              bottom: 0;
              right: auto;
              height: 2px;
              width: 100%;
              background-color: ${a.sys.color.primary.dark};
            }
          }

          .drag-move-out-order-top {
            :before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: auto;
              right: auto;
              height: 2px;
              width: 100%;
              background-color: ${a.sys.color.primary.dark};
            }
          }
        }
      }
    `},this.state={dropType:"none",isDragging:!1,isHovering:!1,currentLabel:this.props.itemJson.label},this.dropZoneRef=e.React.createRef(),this.dragRef=e.React.createRef()}componentWillUnmount(){this.dragInteractable&&(this.dragInteractable.unset(),this.dragInteractable=null),this.dropZoneInteractable&&(this.dropZoneInteractable.unset(),this.dropZoneInteractable=null)}componentDidMount(){super.componentDidMount();const{canDnd:e,canDragFunc:t,canDropFunc:i,onDidDrop:o,canOrderFunc:s,canDropIntoFunc:a,itemJson:r}=this.props,{index:l}=r;if(e&&this.dropZoneRef.current&&this.dragRef.current){let e=null;this.dropZoneInteractable=(0,n.interact)(this.dropZoneRef.current).dropzone({accept:".toc-item-drag",overlap:"pointer",ondropmove:e=>{const t=e.relatedTarget,o=e.target,n=JSON.parse(t.getAttribute("data-itemJson"));if(!i||!i(r.data,n.data))return;const d=o.getBoundingClientRect(),c=d.bottom-d.top,p=2*c/3,h=1*c/3,g=c/2,u=e.dragEvent.client.y-d.top;let m=this.state.dropType;m=s&&s(n.data,r.data)?a&&a(n.data,r.data)?u>p?"bottom":u<h?"top":"moveInto":0===l?u>g?"bottom":"top":"bottom":a&&a(n.data,r.data)?"moveInto":"none",this.onDropHover(m)},ondragleave:e=>{this.onDropHover("none")},ondropactivate:e=>{this.dragRef.current.setAttribute("data-itemJson",JSON.stringify(r))},ondrop:e=>{const t=this.state.dropType;if("none"===t)return;const i=e.relatedTarget,s=JSON.parse(i.getAttribute("data-itemJson"));o&&o(s,r,t),this.onDropHover("none")}}),t&&t(r.data)&&(this.dragInteractable=(0,n.interact)(this.dragRef.current).draggable({inertia:!1,modifiers:[],autoScroll:!0,onstart:e=>{this.setState({isDragging:!0});const{onTocDragStatusChange:t}=this.props;t&&t(!0)},onmove:t=>{const{clientX:i,clientY:o,clientX0:s,clientY0:n,target:a}=t,r=parseFloat(a.getAttribute("start-x"))||0,l=parseFloat(a.getAttribute("start-y"))||0;let d=i-s+r,c=o-n+l;const p=-a.clientWidth/2,h=a.clientWidth/2;d<p?d=p:d>h&&(d=h);const{parentBoundBottom:g,parentBoundTop:u}=this.props;if(g>-1&&u>-1){const e=u-n,t=g-n;c<=e?c=e:c>=t&&(c=t)}e&&cancelAnimationFrame(e),e=requestAnimationFrame((()=>{a.style.webkitTransform=a.style.transform="translate("+d+"px, "+c+"px)",e=null}))},onend:t=>{const{target:i}=t;e&&cancelAnimationFrame(e),i.style.webkitTransform=i.style.transform="translate(0px, 0px)",this.setState({isDragging:!1});const{onTocDragStatusChange:o}=this.props;o&&o(!1)}}))}}componentDidUpdate(e){super.componentDidUpdate(e)}render(){const{itemJson:t,renderRightContent:o,editable:s,canDnd:n,theme:a,formatMessage:r,isFirstItem:l,isLastItem:d,tocDraggingStatus:c,isTocDragging:p}=this.props,{icon:h}=t,{dropType:g,isDragging:m}=this.state;let f;f=h&&h.svg?h:{svg:h};const v="moveInto"===g?"drag-move-into":"",b="drag-move-out-order-"+g;let y="";return p&&"on"!==c&&("bottom"===c&&d?y="toc-drag-move-last":"top"===c&&l&&(y="toc-drag-move-first")),(0,e.jsx)("div",{className:`d-flex ${t.isActive?"active":""}   ${v}`,css:this.getStyle(),onMouseEnter:e=>{this.setState({isHovering:!0})},onMouseLeave:e=>{this.setState({isHovering:!1})}},(0,e.jsx)("div",{ref:this.dropZoneRef,className:"toc-item-dropzone h-100 w-100"},(0,e.jsx)("div",{className:"d-flex w-100 h-100",onDoubleClick:this.handleDoubleClickItem,onClick:this.handleClick},(0,e.jsx)("div",{className:`d-flex justify-content-between w-100 toc-item ${y}`},(0,e.jsx)("div",{className:`d-flex toc-item-content ${b} w-100`},(0,e.jsx)(i.Button,{className:"toc-arrow jimu-outline-inside",icon:!0,type:"tertiary",title:r(t.isExpand?"collapse":"expand"),"aria-label":r(t.isExpand?"collapse":"expand"),"aria-expanded":t.isExpand,onClick:this.handleArrowClick,onKeyUp:e=>{("Enter"===e.key||" "===e.key)&&this.handleArrowClick(e)}},(0,e.jsx)(u,{className:"toc-arrow-icon",size:"s"})),(0,e.jsx)("div",{className:"left-and-right d-flex justify-content-between w-100"},(0,e.jsx)("div",{className:"d-flex left-content "+(o?"pr-0":"pr-2")},h&&(0,e.jsx)(i.Icon,{autoFlip:t.needFlip,className:"header-icon",color:a.ref.palette.neutral[1e3],size:12,icon:f.svg,"aria-hidden":"true"}),(0,e.jsx)("div",{className:"item-label editor"},t.allowEditable&&s?(0,e.jsx)(i.TextInput,{size:"sm",ref:e=>{this.editor=e},value:this.state.currentLabel,onChange:e=>{this.labelChanged(e.target.value)},onAcceptValue:this.onRenameAccept,checkValidityOnChange:e=>this._checkLabel("page",t.id,e),checkValidityOnAccept:e=>this._checkLabel("page",t.id,e),onBlur:e=>{this.handleLabelBlur(e.target.value,t.id)},onKeyUp:e=>{this.handleLabelEnter(e,t.id)}}):(0,e.jsx)(e.React.Fragment,null,this.state.currentLabel))),o&&o(t)))),n&&(0,e.jsx)("div",{className:"toc-item-drag",ref:this.dragRef,title:this.state.currentLabel},m&&(0,e.jsx)("div",{className:"d-flex justify-content-between w-100 toc-item"},(0,e.jsx)("div",{className:"d-flex toc-item-content w-100"},(0,e.jsx)(i.Button,{icon:!0,type:"tertiary",className:"toc-arrow"},(0,e.jsx)(u,{className:"toc-arrow-icon",size:"s"})),(0,e.jsx)("div",{className:"left-and-right d-flex justify-content-between w-100"},(0,e.jsx)("div",{className:"d-flex left-content "+(o?"pr-0":"pr-2")},h&&(0,e.jsx)(i.Icon,{className:"header-icon",size:12,icon:f.svg,"aria-hidden":"true"}),(0,e.jsx)("div",{title:this.state.currentLabel,className:"item-label editor"},this.state.currentLabel)),o&&o(t))))))))}}var f=c(4651),v=c.n(f),b=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const y=t=>{const i=window.SVG,{className:o}=t,s=b(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:v()},s)):e.React.createElement("svg",Object.assign({className:n},s))},I=[0,8];class x extends e.React.PureComponent{constructor(t){super(t),this.onDropDownToggle=t=>{const{isOpen:i}=this.state;t.stopPropagation(),!this.dontDismiss&&this.setState({isOpen:!i}),this.dontDismiss=!1,i&&(0,e.isKeyboardMode)()&&(this.buttonRef.style.visibility="visible",this.buttonRef.style.display="block",setTimeout((()=>{this.buttonRef.style.display=null,this.buttonRef.style.visibility=null}),300))},this.onItemClick=(e,t)=>{t.autoHide||void 0===t.autoHide?this.setState({isOpen:!1}):this.dontDismiss=!0,t.event(e)},this.getInteractiveNodeStyle=t=>{var i,o;if("div"!==t)return e.css``;const s=null===(o=null===(i=this.props.theme)||void 0===i?void 0:i.components)||void 0===o?void 0:o.dropdown;return e.css`
        padding: 0 !important;
        .toc-dropdown-item {
          padding: 0.25rem 0.5rem;
          outline: none;
          border: none;

          &:hover, &:focus {
            outline: none;
            border: none;
            background-color: ${s.link.hoverBg};
          }
        }
    `},this.state={isOpen:!1}}render(){const{items:t,toggleContent:o,direction:s,disabled:n,title:a,icon:r,caret:l,insideOutline:d=!1,supportInsideNodesAccessible:c=!1,avoidNestedToggle:p,delayToggle:h}=this.props,g=this.props["aria-label"]||"",{isOpen:u}=this.state;return(0,e.jsx)("div",{className:"d-flex align-items-center"},(0,e.jsx)(i.Dropdown,{direction:s||"down",size:"sm",toggle:this.onDropDownToggle,isOpen:u,useKeyUpEvent:!0,supportInsideNodesAccessible:c},(0,e.jsx)(i.DropdownButton,{ref:e=>{this.buttonRef=e},title:a,"aria-label":g,arrow:l,icon:r||void 0===r,disabled:n,size:"sm",type:"tertiary",className:(0,e.classNames)("item-inside-button",{"jimu-outline-inside":d})},o||(0,e.jsx)(y,null)),(0,e.jsx)(i.DropdownMenu,{avoidNestedToggle:p,delayToggle:h,offset:I},t.map(((t,o)=>{var s;const{tag:n="button"}=t;return(t.visible||void 0===t.visible)&&(t.isBtn?(0,e.jsx)(e.React.Fragment,{key:o},t.label):(0,e.jsx)(i.DropdownItem,{tag:n,a11yFocusBack:t.a11yFocusBack,key:o,title:null!==(s=t.title)&&void 0!==s?s:"",className:"no-user-select",css:this.getInteractiveNodeStyle(n),onClick:e=>{this.onItemClick(e,t)},divider:t.divider},t.label))})))))}}x.defaultProps={caret:!1};class w extends e.React.PureComponent{constructor(e){super(e),this.onItemClick=(e,t)=>{t.event(e)},this.state={}}render(){const{items:t,toggleContent:o,direction:s,disabled:n,title:a,icon:r,caret:l}=this.props;return(0,e.jsx)(i.DropdownSubMenuItem,{direction:s,useKeyUpEvent:!0},(0,e.jsx)(i.DropdownButton,{title:a,arrow:l,icon:r||void 0===r,disabled:n,size:"sm",type:"tertiary"},o||(0,e.jsx)(y,null)),(0,e.jsx)(i.DropdownMenu,null,t.map(((t,o)=>{var s,n;const{settingPanel:a,settingPanelProps:r}=t,l=a;return l?(0,e.jsx)(l,Object.assign({key:o},r)):(t.visible||void 0===t.visible)&&(t.isBtn?(0,e.jsx)(i.DropdownSubMenuItem,{key:o,title:null!==(s=t.title)&&void 0!==s?s:"",onClick:e=>{this.onItemClick(e,t)}},t.label):(0,e.jsx)(i.DropdownItem,{key:o,title:null!==(n=t.title)&&void 0!==n?n:"",className:"no-user-select",onClick:e=>{this.onItemClick(e,t)}},t.label))}))))}}var S=c(1888);class C extends e.React.PureComponent{constructor(){super(...arguments),this.handleArrowClick=e=>{e.stopPropagation();const{handleExpand:t}=this.props;t&&t()},this.getStyle=()=>{const{theme:t,itemJson:i,level:o}=this.props,{mustShowArrow:s,children:n,isActive:a,isExpand:r}=i;return e.css`
      height: ${30}px;
      width: 100%;
      align-items: center;
      border: 0;
      cursor: pointer;

      &.active {
        background-color: ${t.sys.color.primary.light};
        border: 0;
      }

      :hover {
        ${a?"":`background-color: ${e.polished.rgba(t.ref.palette.neutral[500],.4)};`}
      }

      .tree-item-content {
        padding: 0;
        padding-left: ${30*o}px;
        border: 0;

        .tree-arrow {
          visibility: ${s||n&&n.length>0?"visible":"hidden"};
          height: 24px;
          padding-right: 5px;
          padding-left: 5px;
          width: auto;
          display: flex;
          align-self: center;
          align-items: center;
          justify-content: center;
          transform-origin: center;
          transform: ${`rotate(${r?90:0}deg)`};
          transition: transform .5s;
          .tree-arrow-icon {
            fill: ${t.ref.palette.black};
          }
        }

        .left-and-right {
          overflow-x: hidden;
          .left-content {
            align-items: center;
            overflow-x: hidden;
            flex: auto;
            .item-label{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: ${.875}rem;
              text-align: start;
            }
            .header-icon {
              margin-right: 0.5rem;
              fill: ${t.ref.palette.black};
            }
          }
        }
      }
    `}}render(){const{itemJson:t,renderRightContent:o,renderHeaderContent:s,arrowIcon:n}=this.props,{icon:a,isActive:r}=t;return(0,e.jsx)("div",{className:`d-flex ${r?"active":""} tree-item-common`,css:this.getStyle()},(0,e.jsx)("div",{className:"d-flex tree-item-content w-100"},(0,e.jsx)("div",{className:"tree-arrow",onClick:this.handleArrowClick},n?n(t):(0,e.jsx)(u,{className:"tree-arrow-icon",size:"s"})),(0,e.jsx)("div",{className:"left-and-right d-flex justify-content-between w-100"},s?s(t):(0,e.jsx)("div",{className:"d-flex left-content "+(o?"pr-0":"pr-2")},a&&(0,e.jsx)(i.Icon,{className:"header-icon",size:12,icon:a}),(0,e.jsx)("div",{title:t.label,className:"item-label"},t.label)),o&&o(t))))}}class D extends e.React.PureComponent{constructor(t){super(t),this.handleClickItem=(e,t=!1)=>{this.setState({isKeyboardMode:t});const{onClickItem:i,itemJson:o}=this.props;i&&i(o,e)},this.shouldHandleKeyEvent=e=>"INPUT"!==e.target.tagName&&("Enter"===e.key||" "===e.key),this.handleKeydownItem=e=>{this.shouldHandleKeyEvent(e)?e.preventDefault():"Tab"===e.key&&this.setState({isKeyboardMode:!0})},this.handleKeyUpItem=e=>{this.shouldHandleKeyEvent(e)&&(e.preventDefault(),this.handleClickItem(e,!0))},this.getStyle=t=>this.state.isKeyboardMode?e.css`
        &.jimu-tree-item{
          padding: 0;
          margin: 0;
          border: 0;
          &:focus,
          &:focus-within {
            .item-inside-button {
              display: inline-flex;

              &.page-item-home-btn {
                display: ${t===e.PageType.Normal?"inline-flex":"none"}
              }
            }

            .item-action-button {
              display: block;
              .dropDown .btn {
                visibility: visible;
              }
            }
          }
        }
      `:e.css`
        &.jimu-tree-item{
          padding: 0;
          margin: 0;
          border: 0;
        }
      `,this.state={isFocus:!1,isKeyboardMode:!1}}render(){var t;const{itemJson:o,theme:s,level:n,handleExpand:a}=this.props,{renderItem:r,renderHeaderContent:l,renderRightContent:d,arrowIcon:c,className:p}=o;return(0,e.jsx)(i.ListGroupItem,{css:this.getStyle(null===(t=null==o?void 0:o.data)||void 0===t?void 0:t.type),role:"option",tabIndex:0,"aria-checked":o.isActive,"aria-label":o.label,onClick:this.handleClickItem,onKeyDown:this.handleKeydownItem,onKeyUp:this.handleKeyUpItem,className:(0,e.classNames)("jimu-tree-item","d-flex","jimu-outline-inside",p||"")},(0,e.jsx)("div",{className:"w-100",ref:e=>{this.itemRef=e}},r?r(o):(0,e.jsx)(C,{itemJson:o,level:n,renderHeaderContent:l,renderRightContent:d,arrowIcon:c,theme:s,handleExpand:a})))}}class j extends e.React.PureComponent{constructor(t){var i;super(t),this.handleSingleClick=(e,t)=>{const{onClickItem:i}=this.props;i&&i(e,t)},this.handleExpand=()=>{const{handleExpand:e}=this.props;let{itemJson:t}=this.props;t=t.set("isExpand",!t.isExpand),e&&e(t)},this.renderSubItemsTimeout=void 0,this.SingleTreeItem=({itemJson:t,level:i})=>e.React.createElement(D,{key:t.id,itemJson:t,level:i,handleExpand:this.handleExpand,onClickItem:this.handleSingleClick,theme:this.props.theme}),this.state={renderSubItems:null===(i=t.itemJson)||void 0===i?void 0:i.isExpand}}componentDidUpdate(e){const{itemJson:t}=this.props,{itemJson:i}=e;(null==t?void 0:t.isExpand)!==(null==i?void 0:i.isExpand)&&(this.renderSubItemsTimeout&&(clearTimeout(this.renderSubItemsTimeout),this.renderSubItemsTimeout=void 0),(null==t?void 0:t.isExpand)?this.setState({renderSubItems:!0}):this.renderSubItemsTimeout=setTimeout((()=>{this.setState({renderSubItems:!1})}),1e3))}render(){const{itemJson:t,level:o}=this.props,{SingleTreeItem:s}=this,{renderSubItems:n}=this.state;return e.React.createElement(e.React.Fragment,null,e.React.createElement(s,{key:t.id,itemJson:t,level:o}),t.children&&t.children.length>0&&e.React.createElement("div",{className:"out-container"},e.React.createElement("div",{className:"in-container"},e.React.createElement(i.Collapse,{isOpen:t.isExpand,role:"group"},n&&this.props.children))))}}const P=(e,t)=>t.label.toLocaleLowerCase().includes(e.toLocaleLowerCase()),T=(e,t,i)=>i(t,e)||e.children&&e.children.length&&!!e.children.find((e=>T(e,t,i))),k=(t,i,o=P)=>{if(o(i,t)||!t.children)return t;const s=t.children.filter((e=>T(e,i,o))).map((e=>k(e,i,o)));return(0,e.Immutable)(Object.assign({},t,{children:s}))},O=(t,i,o=P)=>{let s=t.children;if(!s||0===s.length)return(0,e.Immutable)(Object.assign({},t,{isExpand:!1}));const n=s.filter((e=>T(e,i,o))),a=n.length>0;return a&&(s=n.map((e=>O(e,i,o)))),(0,e.Immutable)(Object.assign({},t,{children:s,isExpand:a}))},A=(e,t)=>{const i=e.children;i&&i.length>0&&i.forEach(((i,o)=>{e=e.setIn(["children",o],A(i,t))}));const o=t.includes(e.id);return e.set("isExpand",o)},M=(e,t)=>{const i=e.children;i&&i.length>0&&i.forEach(((i,o)=>{e=e.setIn(["children",o],M(i,t))}));const o=t.includes(e.id);return e.set("isActive",o)},R=(e,t)=>{if(!e)return null;let i=null==e?void 0:e.children;i&&i.length>0&&i.forEach(((i,o)=>{e=e.setIn(["children",o],R(i,t))})),i=null==e?void 0:e.children;const o=t.includes(null==e?void 0:e.id),s=(null==e?void 0:e.isExpand)||E(i);return e.set("isActive",o).set("isExpand",s)},N=e=>{if(!e)return[];const t=[],i=null==e?void 0:e.children;return i&&i.length>0&&i.forEach((e=>t.push(...N(e)))),(null==e?void 0:e.isExpand)&&t.push(null==e?void 0:e.id),t},E=e=>!!e&&!!e.find((e=>e.isActive||E(e.children)));class L extends e.React.PureComponent{constructor(t){super(t),this.handleSingleClick=(e,t)=>{const{onClickItem:i}=this.props;i&&i(e,t)},this.handleExpand=e=>{const{handleExpand:t}=this.props;t&&t(e)},this.renderItemJson=t=>e.React.createElement(j,{key:t.id,handleExpand:this.handleExpand,itemJson:t,onClickItem:this.handleSingleClick,theme:this.props.theme},t.children&&t.children.map((e=>this.renderItemJson(e)))),this.state={itemJsons:t.itemJsons}}render(){const{itemJson:t,className:i,hideRoot:o,forwardRef:s}=this.props;return e.React.createElement("div",{className:(0,e.classNames)("jimu-tree",i),ref:s,role:"listbox"},o?t&&t.children&&t.children.map((e=>this.renderItemJson(e))):this.renderItemJson(t))}}const B=(0,S.withTheme)(L);class J extends e.React.PureComponent{constructor(t){super(t),this.handleCloseBtn=()=>{this.isActionClick=!1,this.setState({isOpen:!1});const{toggle:e,isOpen:t}=this.props;void 0!==t&&e&&e()},this.handleActionClick=()=>{this.isActionClick=!0,this.setState({isOpen:!1});const{toggle:e,isOpen:t}=this.props;void 0!==t&&e&&e()},this.handleToggle=()=>{const{isOpen:e,tapBlankClose:t}=this.props;if(!t)return;this.setState({isOpen:!e});const{toggle:i,isOpen:o}=this.props;void 0!==o&&i&&i()},this.onModalClosed=()=>{const{onClosed:e}=this.props;e&&e(this.isActionClick),this.isActionClick=!1},this.getStyle=()=>{const t=this.props.theme;return e.css`
      .modal-header {
        .close {
          color: ${t.ref.palette.neutral[1e3]};
          opacity: 1;
          transition: color .15s ease-in-out;
          &:not(:disabled):not(.disabled):hover,
          &:not(:disabled):not(.disabled):focus {
            opacity: 1;
          }
        }
      }
      .modal-body{
        overflow-y: auto;
        max-height: 360px;
      }
      .modal-content{
        width: auto;
      }
      .modal-footer{
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
    `},this.state={isOpen:!!t.isOpen}}componentDidUpdate(e){const{isOpen:t}=e;void 0!==t&&void 0===this.props.isOpen&&this.setState({isOpen:t})}render(){let{isOpen:t}=this.props;const{isRemove:o}=this.props;return t=void 0===t?this.state.isOpen:t,(0,e.jsx)(i.Modal,{css:this.getStyle(),isOpen:t,onClosed:this.onModalClosed,toggle:this.handleToggle,centered:!0},(0,e.jsx)(i.ModalHeader,{tag:"h4",toggle:this.handleCloseBtn},this.props.title),(0,e.jsx)(i.ModalBody,null,(0,e.jsx)("div",{style:{marginLeft:"10px"}},this.props.children)),(0,e.jsx)(i.ModalFooter,null,(0,e.jsx)(i.Button,{type:o?"danger":"primary",onClick:this.handleActionClick},o?this.props.formatMessage("delete"):this.props.formatMessage("ok")),(0,e.jsx)(i.Button,{onClick:this.handleCloseBtn},this.props.formatMessage("cancel"))))}}var z=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const F=e.React.forwardRef(((t,o)=>{const{onKeyDown:s,onClick:n}=t,a=z(t,["onKeyDown","onClick"]);return e.React.createElement(i.Button,Object.assign({ref:o},a,{onClick:n,onKeyDown:e=>{!n||"Enter"!==e.key&&" "!==e.key||e.preventDefault()},onKeyUp:e=>{!n||"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),n(e))}}))}));var $=c(5809),U=c(6572),H=c.n(U),G=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const V=t=>{const i=window.SVG,{className:o}=t,s=G(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:H()},s)):e.React.createElement("svg",Object.assign({className:n},s))};var W=c(3529),Z=c.n(W),_=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const K=t=>{const i=window.SVG,{className:o}=t,s=_(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:Z()},s)):e.React.createElement("svg",Object.assign({className:n},s))};var q=c(4109),Y=c.n(q),X=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const Q=t=>{const i=window.SVG,{className:o}=t,s=X(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:Y()},s)):e.React.createElement("svg",Object.assign({className:n},s))};var ee=c(3662),te=c.n(ee),ie=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const oe=t=>{const i=window.SVG,{className:o}=t,s=ie(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:te()},s)):e.React.createElement("svg",Object.assign({className:n},s))},se={value:"",openType:s.OpenTypes.NewWindow,linkType:e.LinkType.WebAddress};let ne;const ae=[{name:"offset",options:{offset:[0,10]}}];class re extends e.React.PureComponent{constructor(o){super(o),this.linkSettingTrigger=e.React.createRef(),this.getTotalLines=()=>{const{itemJson:e}=this.state;let t=0;return e.children&&e.children.forEach((e=>{var i,o;t++,e.isExpand&&(t+=null!==(o=null===(i=e.children)||void 0===i?void 0:i.length)&&void 0!==o?o:0)})),t},this.getTreeContentHeight=()=>30*this.getTotalLines(),this.handleOnTocDragStatusChange=e=>{this.setState({isTocDragging:e,itemJson:this.getItemJsonByPages()})},this.handleOnTocDraggingStatusChange=e=>{this.setState({tocDraggingStatus:e,itemJson:this.getItemJsonByPages()})},this.handleChooseTemplate=e=>{this.setState({isTemplatePopoverOpen:!1}),this.props.addPageWithType("page",e)},this.handleToggleTemplatePopover=()=>{const{isTemplatePopoverOpen:e}=this.state;this.setState({isTemplatePopoverOpen:!e})},this.closeTemplatePopover=()=>{this.state.isTemplatePopoverOpen&&(this.templateBtn.focus(),this.setState({isTemplatePopoverOpen:!1}))},this.handleRemovePage=e=>{(0,t.getAppConfigAction)().appConfig.pageStructure.find((t=>t[e.id]&&t[e.id].length>0))?(this.setState({willRemovePage:e}),this.handleToggleRemovePopover()):(ne===e.id&&this.setState({isShowLinkSetting:!1}),this.props.removePage(e.id))},this.handleToggleRemovePopover=()=>{const{isRemovePopoverOpen:e}=this.state;this.setState({isRemovePopoverOpen:!e})},this.singleAndDoubleClickTimeout=void 0,this.handleClickItem=t=>{t.data.type!==e.PageType.Folder&&t.data.type!==e.PageType.Link&&(this.singleAndDoubleClickTimeout&&(clearTimeout(this.singleAndDoubleClickTimeout),this.singleAndDoubleClickTimeout=void 0),this.singleAndDoubleClickTimeout=setTimeout((()=>{this.setState({currentSelectedItemId:t.id,itemJson:R(this.state.itemJson,[t.id])},(()=>{this.props.onClickPage(t.data.id)}))}),200))},this.handleOnTocDoubleClick=(e,t)=>{this.singleAndDoubleClickTimeout&&(clearTimeout(this.singleAndDoubleClickTimeout),this.singleAndDoubleClickTimeout=void 0),this.props.changeEditablePageItemId(e.id),t.stopPropagation()},this.handleOnSetLinkClick=(e,t)=>{ne&&e.data.id===ne&&this.state.isShowLinkSetting||(ne=e.data.id,this.resetLinkParam(ne),this.state.isShowLinkSetting?this.setState({isShowLinkSetting:!1},(()=>{this.setState({isShowLinkSetting:!0})})):this.setState({isShowLinkSetting:!0}),t.stopPropagation())},this.handleExpand=e=>{if((!e.children||e.children.length<1)&&!e.mustShowArrow)return;const{expandIds:t}=this;e.isExpand?t.includes(e.id)&&t.splice(t.indexOf(e.id),1):t.includes(e.id)||t.push(e.id),this.setState({itemJson:A(this.state.itemJson,t)})},this.handleArrowClick=e=>{this.handleExpand(e)},this.handleSearchTextChange=e=>{this.setState({filterText:e},(()=>{this.setState({itemJson:this.getItemJsonByPages()})}))},this.handleSearchSubmit=e=>{this.setState({filterText:e},(()=>{this.setState({itemJson:this.getItemJsonByPages()})}))},this.handleSearchBtnClick=e=>{e.stopPropagation();const{showSearch:t}=this.state;t?this.handleSearchTextChange(""):this.searchInput&&(this.searchInput.focus(),this.searchInput.select()),this.setState({showSearch:!t})},this.handleSettingLinkConfirm=e=>{this.setState({isShowLinkSetting:!1}),this.changeUrl(e.value,e.openType)},this.changeUrl=(e,i)=>{const{pages:o}=this.props,s=o[ne];(0,t.getAppConfigAction)().editPageProperty(s.id,"linkUrl",e||"#").editPageProperty(s.id,"openTarget",i).exec(),se.value=e,se.openType=i},this.renamePage=(e,t)=>(this.props.changeEditablePageItemId(""),!!(null==t?void 0:t.trim())&&this.props.renamePage(e.data.id,t)),this.getFirstItemJson=()=>{const{itemJson:e}=this.state;return e.children[0]},this.getLastItemJson=()=>{const{itemJson:e}=this.state;let t=e.children[e.children.length-1];return t.isExpand&&t.children&&t.children.length>0&&(t=t.children[t.children.length-1]),t},this.getLastParentItemJson=()=>{const{itemJson:e}=this.state;return e.children[e.children.length-1]},this.onDidDrop=(t,i,o)=>{e.lodash.defer((()=>{if(this.treeRef.querySelectorAll(".toc-item-drag").forEach((e=>{e.setAttribute("data-itemJson",null)})),"moveInto"===o){this.props.movePageIntoPage(t.data.id,i.data.id);const{expandIds:e}=this;e.includes(i.id)||(e.push(i.id),this.setState({itemJson:A(this.state.itemJson,e)}))}else this.props.reOrderPage(t.data.id,i.data.id,o)}))},this.canDragFunc=e=>!0,this.canDropFunc=(e,t)=>e.id!==t.id,this.canDropIntoFunc=(i,o)=>{const s=(0,t.getAppConfigAction)().appConfig;return t.appConfigUtils.isFirstLevelPage(s,o.id)&&!t.appConfigUtils.isPageHasSubPage(s,i.id)&&i.type!==e.PageType.Folder},this.canOrderFunc=(i,o)=>{const s=(0,t.getAppConfigAction)().appConfig;return!(i.type===e.PageType.Folder&&!t.appConfigUtils.isFirstLevelPage(s,o.id))},this.getItemJsonByPageJson=(i,o,s)=>{const n=i.id,{expandIds:a}=this,{currentPageItemId:r,formatMessage:l}=this.props,d=a.includes(n),c={id:n,data:i,label:i.label,index:o,level:s,isActive:r===n,isExpand:d,mustShowArrow:i.type===e.PageType.Folder,showDefault:i.type===e.PageType.Normal,allowEditable:!0,renderItem:this.renderPageContent};return c.icon=i.icon,c.icon||(c.icon=t.utils.getDefaultTocPageIcon(i,l)),c},this.getItemJsonByPages=(i,o)=>{i||(i=this.props.pages),o||(o=this.props.pageStructure);const s={id:"ROOT",children:[],label:""};if(!i||!o)return(0,e.Immutable)(s);let n=o.map(((e,t)=>{const o=Object.keys(e)[0],s=i[o],n=this.getItemJsonByPageJson(s,t,0),a=e[o];return n.children=[],a.forEach(((e,t)=>{const o=i[e],s=this.getItemJsonByPageJson(o,t,1);n.children.push(s)})),n}));if(this.props.isPageTemplateLoading){const i=(0,t.getAppConfigAction)().appConfig,s={id:t.appConfigUtils.getUniqueId("page"),label:t.appConfigUtils.getUniqueLabel(i,"page",this.props.formatMessage("page")),type:e.PageType.Normal},a=this.getItemJsonByPageJson(s,o.length,0);a.children=[],n=n.asMutable({deep:!0}),n.push(a)}s.children=n;let a=(0,e.Immutable)(s);const{filterText:r}=this.state;if(r&&""!==r){const e=k(a,r.trim());a=O(e,r.trim())}return a},this.getMoreDropDownItems=i=>{const o=i.data,s=[],n=(0,e.Immutable)({a11yFocusBack:!1,label:this.props.formatMessage("rename"),event:e=>{this.handleOnTocDoubleClick(i,e)},visible:!0});s.push(n);const a=(0,e.Immutable)({a11yFocusBack:!1,label:this.props.formatMessage("setLink"),event:e=>{this.handleOnSetLinkClick(i,e)},visible:o.type===e.PageType.Link});s.push(a);const r="string"==typeof i.icon?{svg:i.icon}:i.icon,l=(0,e.Immutable)({label:(0,e.jsx)($.IconPicker,{icon:r,showIcon:!1,showLabel:!0,hideRemove:!0,customLabel:this.props.formatMessage("setIcon"),customIcons:[t.utils.getDefaultTocPageIcon({type:e.PageType.Normal},this.props.formatMessage)],configurableOption:"none",useKeyUpEvent:!0,buttonOptions:{type:"tertiary",variant:"text",size:"sm",className:"toc-dropdown-item text-left",style:{color:this.props.theme.ref.palette.black,minWidth:"110px"}},onChange:e=>{(0,t.getAppConfigAction)().editPageProperty(i.id,"icon",e).exec()}}),tag:"div",event:e=>{e.stopPropagation()},autoHide:!1,visible:!0});s.push(l);const d=(0,e.Immutable)({label:this.props.formatMessage("duplicate"),event:e=>{e.stopPropagation(),this.props.duplicatePage(o.id)},visible:!0});s.push(d);const c=(0,t.getAppConfigAction)().appConfig,p=(c?t.appConfigUtils.getRealPageCountExcludeOnePage(c,o.id):0)<1,h=(0,e.Immutable)({label:this.props.formatMessage("delete"),event:e=>{this.handleRemovePage(o),e.stopPropagation()},visible:!p});return s.push(h),s},this.getAddPageDropDownItems=()=>{const{addPageWithType:t}=this.props,i=[],o=(0,e.Immutable)({label:this.props.formatMessage("addLink"),a11yFocusBack:!1,event:e=>{ne=t("link").id,this.resetLinkParam(ne),this.setState({isShowLinkSetting:!0}),e.stopPropagation(),"Enter"!==e.key&&" "!==e.key||setTimeout((()=>{document.querySelector('div[role="dialog"] .jimu-btn').focus()}),100)},visible:!0});i.push(o);const s=(0,e.Immutable)({label:this.props.formatMessage("addFolder"),a11yFocusBack:!1,event:e=>{t("folder"),e.stopPropagation()},visible:!0});return i.push(s),i},this.renderPageItemRightContent=o=>{const{theme:s,onDefaultClick:n}=this.props,{data:a}=o,r=this.getMoreDropDownItems(o),l=e.css`
      margin-right: calc(16px - ${s.components.button.sizes.sm.paddingX});
      .page-item-visible-btn {
        display: ${a.isVisible?"none":"inline-flex"};
      }

      .page-item-home-btn {
        color: ${o.showDefault&&a.isDefault?s.ref.palette.black:s.ref.palette.neutral[1e3]};
        &:hover {
          color: ${s.ref.palette.black};
        }
      }

      .dropDown {
        display: inline-flex;
        .btn {
          display: none;
        }
      }

    `;return(0,e.jsx)("div",{className:"d-flex align-items-center",css:l},(0,e.jsx)(i.Tooltip,{placement:"bottom",title:this.props.formatMessage("makeHome")},(0,e.jsx)(F,{size:"sm",icon:!0,type:"tertiary",disableHoverEffect:!0,"aria-label":this.props.formatMessage("makeHome"),className:"page-item-home-btn page-item-icon item-inside-button jimu-outline-inside",onClick:e=>{e.stopPropagation(),a.isDefault||n(a.id)}},(0,e.jsx)(V,null))),(0,e.jsx)(i.Tooltip,{placement:"bottom",title:a.isVisible?this.props.formatMessage("hideFromMenu"):this.props.formatMessage("showFromMenu")},(0,e.jsx)(F,{size:"sm",type:"tertiary",icon:!0,disableHoverEffect:!0,"aria-label":a.isVisible?this.props.formatMessage("hideFromMenu"):this.props.formatMessage("showFromMenu"),className:"page-item-visible-btn page-item-icon item-inside-button jimu-outline-inside",onClick:e=>{e.stopPropagation(),(0,t.getAppConfigAction)().editPageProperty(a.id,"isVisible",!o.data.isVisible).exec()}},a.isVisible?(0,e.jsx)(K,null):(0,e.jsx)(Q,null))),(0,e.jsx)("div",{title:this.props.formatMessage("more"),className:"dropDown page-item-icon",ref:this.linkSettingTrigger},(0,e.jsx)(x,{modifiers:ae,direction:"down",theme:s,items:r,insideOutline:!0,supportInsideNodesAccessible:!0})))},this.renderPageContent=t=>{var i,o,s;const{intl:n,formatMessage:a,theme:r,editablePageItemId:l}=this.props,{isTocDragging:d,tocDraggingStatus:c}=this.state,p=null===(i=this.treeRef)||void 0===i?void 0:i.getBoundingClientRect();return(0,e.jsx)(m,{intl:n,itemJson:t,formatMessage:a,theme:r,canDnd:!0,isFirstItem:this.getFirstItemJson().id===t.id,editable:l===t.id,onArrowClick:this.handleArrowClick,isLastItem:this.getLastItemJson().id===t.id,isTocDragging:d,onTocDragStatusChange:this.handleOnTocDragStatusChange,tocDraggingStatus:c,parentBoundTop:null!==(o=null==p?void 0:p.top)&&void 0!==o?o:-1,renderRightContent:this.renderPageItemRightContent,renameItem:this.renamePage,parentBoundBottom:null!==(s=null==p?void 0:p.bottom)&&void 0!==s?s:-1,canDropIntoFunc:this.canDropIntoFunc,onDidDrop:this.onDidDrop,canDragFunc:this.canDragFunc,canDropFunc:this.canDropFunc,canOrderFunc:this.canOrderFunc,onDoubleClick:this.handleOnTocDoubleClick})},this.getLinkSettingPopup=(t,i,o)=>{var n,a,r,l,d,c;return t&&(null===(n=null==o?void 0:o.pages)||void 0===n?void 0:n[ne])&&!(null===(a=e.urlUtils.getAppIdPageIdFromUrl())||void 0===a?void 0:a.pageId)&&i?(0,e.jsx)(s.LinkSelectorSidePopper,{isOpen:t&&!(null===(r=e.urlUtils.getAppIdPageIdFromUrl())||void 0===r?void 0:r.pageId),isLinkPageSetting:!0,title:null===(d=null===(l=null==o?void 0:o.pages)||void 0===l?void 0:l[ne])||void 0===d?void 0:d.label,position:"left",linkParam:(0,e.Immutable)(se),onSettingCancel:()=>{this.setState({isShowLinkSetting:!1})},onSettingConfirm:this.handleSettingLinkConfirm,trigger:null===(c=this.linkSettingTrigger)||void 0===c?void 0:c.current}):(!i&&t&&setTimeout((()=>{this.setState({isShowLinkSetting:!1})})),null)},this.getWillRemovePageSubCount=()=>{const e=(0,t.getAppConfigAction)().appConfig,{willRemovePage:i}=this.state;if(!e||!i)return 0;const o=e.pageStructure.find((e=>Object.keys(e)[0]===i.id));return o?o[i.id].length:0},this.onExportClick=e=>{const{currentPageItemId:i}=this.props,o=(0,t.getAppConfigAction)().appConfig,s=[{layout:o.pages[i].layout,layouts:o.layouts,widgets:o.widgets,views:o.views,sections:o.sections,name:"Column layout",description:"Align widgets by columns",thumbnail:"./thumbnails/image2.png"}],n=s[0];n.layouts&&Object.keys(n.layouts).forEach((e=>{let t=n.layouts[e].without("id");t.content&&Object.keys(t.content).forEach((e=>{const i=t.content[e].without("id");t=t.setIn(["content",e],i)})),n.layouts=n.layouts.set(e,t)})),n.widgets&&Object.keys(n.widgets).forEach(((e,t)=>{const i=n.widgets[e];n.widgets=n.widgets.set(e,i.without("context","icon","label","manifest","_originManifest","version","useDataSources","useDataSourcesEnabled"))})),n.sections&&Object.keys(n.sections).forEach(((e,t)=>{const i=n.sections[e];n.sections=n.sections.set(e,i.without("id","label"))})),n.views&&Object.keys(n.views).forEach(((e,t)=>{const i=n.views[e];n.views=n.views.set(e,i.without("id","label"))})),console.log(JSON.stringify({pages:s}))},this.expandIds=[],this.state={currentSelectedItemId:o.currentPageItemId,filterText:"",itemJson:void 0,showSearch:!1,isTemplatePopoverOpen:!1,isTocDragging:!1,isRemovePopoverOpen:!1,willRemovePage:void 0,tocDraggingStatus:"on",isShowLinkSetting:!1},this.addPageDropdownItems=this.getAddPageDropDownItems()}componentWillUnmount(){this.dropZoneInteractable&&(this.dropZoneInteractable.unset(),this.dropZoneInteractable=null)}componentDidUpdate(e,t){const i=this.props;let o=!1,s={};const{pages:n,pageStructure:a,currentPageItemId:r,editablePageItemId:l,isPageTemplateLoading:d}=e;if(t.isShowLinkSetting&&!this.state.isShowLinkSetting&&setTimeout((()=>{document.querySelector("div.add-page-more-container .jimu-btn").focus()}),100),i.currentPageItemId!==r||i.pages!==n||i.pageStructure!==a||i.editablePageItemId!==l||i.isPageTemplateLoading!==d)if(o=!0,i.pages===n&&a===i.pageStructure&&i.editablePageItemId===l||i.currentPageItemId===r)if(i.currentPageItemId!==r){const e=R(this.state.itemJson,[i.currentPageItemId]);s={currentSelectedItemId:i.currentPageItemId,itemJson:R(this.state.itemJson,[i.currentPageItemId])},this.expandIds=N(e)}else s={itemJson:this.getItemJsonByPages(i.pages,i.pageStructure)};else{const e=R(this.getItemJsonByPages(i.pages,i.pageStructure),[i.currentPageItemId]);s={currentSelectedItemId:i.currentPageItemId,itemJson:e},this.expandIds=N(e)}o&&this.setState(s)}componentDidMount(){this.setState({itemJson:this.getItemJsonByPages()}),this.dropZoneRef&&(this.dropZoneInteractable=(0,n.interact)(this.dropZoneRef).dropzone({accept:".toc-item-drag",overlap:"pointer",ondragenter:e=>{const{itemJson:t}=this.state;if(t&&this.treeRef){const{relatedTarget:t,dragEvent:i}=e,o=this.treeRef.getBoundingClientRect().top,s=this.getTreeContentHeight(),n=JSON.parse(t.getAttribute("data-itemJson")),a=i.client;if(a.y<=o){this.getFirstItemJson().data.id!==n.data.id&&this.handleOnTocDraggingStatusChange("top")}else if(a.y<=s+o)this.handleOnTocDraggingStatusChange("on");else{this.getLastParentItemJson().data.id!==n.data.id&&this.handleOnTocDraggingStatusChange("bottom")}}},ondragleave:e=>{this.handleOnTocDraggingStatusChange("on")},ondrop:e=>{const t=this.state.tocDraggingStatus;if("on"===t)return;let i;if("bottom"===t){i=this.getLastParentItemJson()}else i=this.getFirstItemJson();const o=e.relatedTarget,s=JSON.parse(o.getAttribute("data-itemJson"));this.onDidDrop(s,i,t),this.handleOnTocDraggingStatusChange("on")}}))}resetLinkParam(e){const{pages:t}=this.props;se.value="",se.openType=s.OpenTypes.NewWindow;const i=t[e];i&&i.linkUrl&&"#"!==i.linkUrl&&(se.value=i.linkUrl),i&&i.openTarget&&(se.openType=i.openTarget)}render(){const{itemJson:o,willRemovePage:n,isShowLinkSetting:a}=this.state,{theme:r,isPageSectionNav:l}=this.props,d=(0,t.getAppConfigAction)().appConfig,p=e.css`
      height: 100%;
      position: relative;
      .toc-dropzone {
        position: absolute;
        pointer-events: none;
      }
      .text-data-600{
        color: ${r.ref.palette.neutral[1e3]};
      }
      .page-list-top {
        position: absolute;
        right: 15px;
        top: -46px;
        .page-top-buttons {
          margin-right: -${r.components.button.sizes.sm.paddingX};
          .my-dropdown {
            margin-left: -5px;
            margin-right: 5px;
          }
        }
      }
      .page-tree {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        .toc-item-dropzone {
          .toc-item {
            /* padding-left: ${e.polished.rem(4)}; */
          }
        }
      }
    `;return(0,e.jsx)("div",{css:p},(0,e.jsx)("div",{ref:e=>{this.dropZoneRef=e},className:"toc-dropzone h-100 w-100"}),(0,e.jsx)("div",{className:"page-list-top"},(0,e.jsx)("div",{className:"d-flex justify-content-between w-100 align-items-center"},(0,e.jsx)("div",{className:"d-flex page-top-buttons align-items-center"},(0,e.jsx)("div",{ref:e=>{this.addPageRef=e},css:e.css`z-index: 11;`},(0,e.jsx)(i.Tooltip,{placement:"bottom",title:this.props.formatMessage("addPage")},(0,e.jsx)(i.Button,{icon:!0,disabled:!o,type:"tertiary","aria-label":this.props.formatMessage("addPage"),ref:e=>{this.templateBtn=e},onClick:this.handleToggleTemplatePopover,size:"sm",className:"add-page-btn"},(0,e.jsx)(oe,{className:"add-page-icon"})))),this.state.isTemplatePopoverOpen&&(0,e.jsx)(s.PageTemplatePopper,{theme:r,referenceElement:this.addPageRef,formatMessage:this.props.formatMessage,onItemSelect:this.handleChooseTemplate,onClose:this.closeTemplatePopover}),(0,e.jsx)("div",{title:this.props.formatMessage("addLinkOrFolder"),className:"dropDown page-item-icon add-page-more-container"},(0,e.jsx)(x,{"aria-label":this.props.formatMessage("addLinkOrFolder"),items:this.addPageDropdownItems,theme:r,disabled:!o,direction:"down",toggleContent:(0,e.jsx)(i.Icon,{icon:c(3839),size:8})}))))),(0,e.jsx)(B,{forwardRef:e=>{this.treeRef=e},className:"page-tree mt-2",hideRoot:true,itemJson:o,onClickItem:this.handleClickItem,handleExpand:this.handleExpand}),n&&(0,e.jsx)(J,{formatMessage:this.props.formatMessage,isRemove:!0,theme:r,tapBlankClose:!1,toggle:this.handleToggleRemovePopover,onClosed:e=>{ne===n.id&&this.setState({isShowLinkSetting:!1}),e&&n&&this.props.removePage(n.id)},title:this.props.formatMessage("delete"),isOpen:this.state.isRemovePopoverOpen,intl:this.props.intl},this.props.formatMessage("removePageTip",{subCount:this.getWillRemovePageSubCount(),label:n.label})),this.getLinkSettingPopup(a,l,d))}}const le=e.ReactRedux.connect((e=>{var t,i,o;const s=e.appStateInBuilder&&e.appStateInBuilder.appConfig;return{pages:s&&s.pages,pageStructure:s&&s.pageStructure,isPageSectionNav:"page"===(null===(o=null===(i=null===(t=e.appRuntimeInfo)||void 0===t?void 0:t.sectionNavInfos)||void 0===i?void 0:i["opts-section"])||void 0===o?void 0:o.currentViewId)}}))(re);class de extends l{constructor(t){super(t),this.onDropHover=e=>{this.state.dropType!==e&&this.setState({dropType:e})},this.labelChanged=e=>{this.setState({currentLabel:e})},this.handleLabelBlur=(e,t)=>{var i,o;let s=""!==e.trim();s&&(s=this._checkLabel("dialog",t,e).valid),s||(e=this.props.itemJson.label,null===(o=(i=this.props).renameItem)||void 0===o||o.call(i,this.props.itemJson,e)),this.labelChanged(e)},this.getStyle=()=>{var t;const i=(0,e.getAppStore)().getState(),o=null===(t=null==i?void 0:i.appContext)||void 0===t?void 0:t.isRTL,{theme:s,editable:n,itemJson:a,isTocDragging:r}=this.props,{mustShowArrow:l,children:d,level:c,isActive:p,isExpand:h}=a,{isDragging:g,isHovering:u}=this.state;return e.css`
      min-height: ${30}px;
      width: auto;
      min-width: 100%;
      align-items: center;
      cursor: pointer;
      ${g?"z-index: 100;":""}

      &.drag-move-into {
        border: 1px solid ${s.sys.color.primary.dark};
      }

      .dialog-item-splash-btn {
        display: ${a.isSplash&&!n?"inline-flex":"none"};
      }

      :hover {
        ${p||r?"":`background-color: ${s.ref.palette.neutral[500]};`}
        .dialog-item-page-btn {
          display: ${n?"none":"inline-flex"};
          z-index: 2;
        }
        .dialog-item-splash-btn {
          display: ${n||!a.isSplash&&r?"none":"inline-flex"};
          z-index: 2;
        }
        .dropDown {
          .btn {
            display: ${r||n?"none":"inline-flex"};
          }
          z-index: 2;
        }
      }

      &.active {
        ${r?"":`background-color: ${s.sys.color.primary.main};`}
        border: 0;
      }

      .toc-dialog-dropzone {
        touch-action: none;
        position: relative;

        .toc-dialog-drag:hover {
          cursor: pointer !important;
        }

        .toc-dialog-drag {
          pointer-events: ${u?"all":"none"};
          visibility: ${a.allowEditable&&n?"hidden":"visible"};
          z-index: 1;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background-color: ${g?e.polished.rgba(s.ref.palette.neutral[500],.6):"transparent"};
          box-shadow: ${g?s.sys.shadow.shadow3:"none"};
        }

        .toc-item {
          padding: 0;
          border: 0;
          position: relative;
          .toc-item-content {
            margin-left: ${10*c}px;
            position: relative;
            .toc-arrow {
              z-index: 2;
              padding-right: ${e.polished.rem(1)};
              visibility: hidden;
               /* ${l||d&&d.length>0?"visible":"hidden"}; */

              .toc-arrow-icon {
                fill: ${s.ref.palette.black};
                transform-origin: center;
                transform: ${`rotate(${h?90:o?180:0}deg)`};
                transition: transform .5s;
              }
            }

            .left-and-right {
              overflow-x: hidden;
              margin-left: -5px;
              .left-content {
                align-items: center;
                overflow-x: hidden;
                flex: auto;
                .editor {
                  overflow: hidden;
                  text-overflow: ${n?"clip":"ellipsis"};
                  white-space: nowrap;
                  font-size: ${.875}rem;
                  user-select: none;
                  flex: auto;
                  text-align: start;
                }
                [contenteditable="true"] {
                  user-select: text;
                  -webkit-user-select: text;
                  background-color: ${s.ref.palette.white};
                }
                .header-icon {
                  margin-right: 0.3rem;
                  flex: none;
                }
              }
            }
          }

          &.toc-drag-move-last {
            :after{
              content: '';
              position: absolute;
              left: 0;
              top: auto;
              bottom: 0;
              right: auto;
              height: 2px;
              width: 100%;
              background-color: ${s.sys.color.primary.dark};
            }
          }

          &.toc-drag-move-first {
            :before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: auto;
              right: auto;
              height: 2px;
              width: 100%;
              background-color: red;
              /* ${s.sys.color.primary.dark}; */
            }
          }

          .drag-move-out-order-bottom {
            :after{
              content: '';
              position: absolute;
              left: 0;
              top: auto;
              bottom: 0;
              right: auto;
              height: 2px;
              width: 100%;
              background-color: ${s.sys.color.primary.dark};
            }
          }

          .drag-move-out-order-top {
            :before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: auto;
              right: auto;
              height: 2px;
              width: 100%;
              background-color: ${s.sys.color.primary.dark};
            }
          }
        }
      }
    `},this.state={dropType:"none",isDragging:!1,isHovering:!1,currentLabel:this.props.itemJson.label},this.dropZoneRef=e.React.createRef(),this.dragRef=e.React.createRef()}componentWillUnmount(){this.dragInteractable&&(this.dragInteractable.unset(),this.dragInteractable=null),this.dropZoneInteractable&&(this.dropZoneInteractable.unset(),this.dropZoneInteractable=null)}componentDidMount(){super.componentDidMount(),this.initDragEvent()}componentDidUpdate(e){super.componentDidUpdate(e)}initDragEvent(){var t;const{canDnd:i,canDropFunc:o,onDidDrop:s,itemJson:a}=this.props;if(i&&this.dropZoneRef.current&&this.dragRef.current){let i=null;this.dragRef.current.setAttribute("itemJson",JSON.stringify(a));const r=(null===(t=a.data)||void 0===t?void 0:t.mode)===e.DialogMode.Fixed?".toc-fixed-dialog-drag":".toc-anchored-dialog-drag";this.dropZoneInteractable=(0,n.interact)(this.dropZoneRef.current).dropzone({accept:r,overlap:"pointer",ondropmove:e=>{const t=e.relatedTarget,i=e.target,s=JSON.parse(t.getAttribute("itemJson"));if(!o||!o(a.data,s.data))return;const n=i.getBoundingClientRect(),r=n.bottom-n.top,l=2*r/3,d=1*r/3,c=e.dragEvent.client.y-n.top;let p=this.state.dropType;c>l?p="bottom":c<d&&(p="top"),this.onDropHover(p)},ondragleave:e=>{this.onDropHover("none")},ondrop:e=>{const t=this.state.dropType;if("none"===t)return;const i=e.relatedTarget,o=JSON.parse(i.getAttribute("itemJson"));s&&s(o,a,t),this.onDropHover("none")}}),this.dragInteractable=(0,n.interact)(this.dragRef.current).draggable({inertia:!1,modifiers:[],autoScroll:!0,onstart:e=>{this.setState({isDragging:!0});const{onTocDragStatusChange:t}=this.props;t&&t(!0)},onmove:e=>{const{clientX:t,clientY:o,clientX0:s,clientY0:n,target:a}=e,r=parseFloat(a.getAttribute("start-x"))||0,l=parseFloat(a.getAttribute("start-y"))||0;let d=t-s+r,c=o-n+l;const p=-a.clientWidth/2,h=a.clientWidth/2;d<p?d=p:d>h&&(d=h);const{parentBoundBottom:g,parentBoundTop:u}=this.props;if(g>-1&&u>-1){const e=u-n,t=g-n;c<=e?c=e:c>=t&&(c=t)}i&&cancelAnimationFrame(i),i=requestAnimationFrame((()=>{a.style.webkitTransform=a.style.transform="translate("+d+"px, "+c+"px)",i=null}))},onend:e=>{const{target:t}=e;i&&cancelAnimationFrame(i),t.style.webkitTransform=t.style.transform="translate(0px, 0px)",this.setState({isDragging:!1});const{onTocDragStatusChange:o}=this.props;o&&o(!1)}})}}render(){const{itemJson:t,renderRightContent:o,editable:s,canDnd:n,theme:a,isFirstItem:r,isLastItem:l,tocDraggingStatus:d,isTocDragging:c,tocDraggingMode:p}=this.props,{icon:h,isActive:g}=t,{dropType:m,isDragging:f}=this.state;let v;v=h&&h.svg?h:{svg:h};const b="moveInto"===m?"drag-move-into":"",y="drag-move-out-order-"+m;let I="";return c&&"on"!==d&&p===t.data.mode&&("bottom"===d&&l?I="toc-drag-move-last":"top"===d&&r&&(I="toc-drag-move-first")),(0,e.jsx)("div",{className:`d-flex ${g?"active":""}   ${b}`,css:this.getStyle(),onMouseEnter:e=>{this.setState({isHovering:!0})},onMouseLeave:e=>{this.setState({isHovering:!1})}},(0,e.jsx)("div",{ref:this.dropZoneRef,className:"toc-dialog-dropzone h-100 w-100"},(0,e.jsx)("div",{className:"d-flex w-100 h-100",onDoubleClick:this.handleDoubleClickItem,onClick:this.handleClick},(0,e.jsx)("div",{className:`d-flex justify-content-between w-100 toc-item ${I}`},(0,e.jsx)("div",{className:`d-flex toc-item-content ${y} w-100`},(0,e.jsx)(i.Button,{className:"toc-arrow",icon:!0,type:"tertiary",onClick:this.handleArrowClick},(0,e.jsx)(u,{className:"toc-arrow-icon",size:"s"})),(0,e.jsx)("div",{className:"left-and-right d-flex justify-content-between w-100"},(0,e.jsx)("div",{className:"d-flex left-content "+(o?"pr-0":"pr-2")},h&&(0,e.jsx)(i.Icon,{autoFlip:t.needFlip,className:"header-icon",color:a.ref.palette.neutral[1e3],size:12,icon:v.svg,"aria-hidden":"true"}),(0,e.jsx)("div",{className:"item-label editor"},t.allowEditable&&s?(0,e.jsx)(i.TextInput,{size:"sm",ref:e=>{this.editor=e},value:this.state.currentLabel,onChange:e=>{this.labelChanged(e.target.value)},onAcceptValue:this.onRenameAccept,checkValidityOnChange:e=>this._checkLabel("dialog",t.id,e),checkValidityOnAccept:e=>this._checkLabel("dialog",t.id,e),onBlur:e=>{this.handleLabelBlur(e.target.value,t.id)}}):(0,e.jsx)(e.React.Fragment,null,this.state.currentLabel))),o&&o(t)))),n&&(0,e.jsx)("div",{className:(0,e.classNames)("toc-dialog-drag",{"toc-fixed-dialog-drag":t.data.mode===e.DialogMode.Fixed,"toc-anchored-dialog-drag":t.data.mode===e.DialogMode.Anchored}),ref:this.dragRef,title:this.state.currentLabel},f&&(0,e.jsx)("div",{className:"d-flex justify-content-between w-100 toc-item"},(0,e.jsx)("div",{className:"d-flex toc-item-content w-100"},(0,e.jsx)(i.Button,{icon:!0,type:"tertiary",className:"toc-arrow"},(0,e.jsx)(u,{className:"toc-arrow-icon",size:"s"})),(0,e.jsx)("div",{className:"left-and-right d-flex justify-content-between w-100"},(0,e.jsx)("div",{className:"d-flex left-content "+(o?"pr-0":"pr-2")},h&&(0,e.jsx)(i.Icon,{className:"header-icon",size:12,icon:v.svg,"aria-hidden":"true"}),(0,e.jsx)("div",{title:this.state.currentLabel,className:"item-label editor"},this.state.currentLabel)),o&&o(t))))))))}}var ce=c(4064),pe=c.n(ce),he=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const ge=t=>{const i=window.SVG,{className:o}=t,s=he(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:pe()},s)):e.React.createElement("svg",Object.assign({className:n},s))};var ue=c(655),me=c.n(ue),fe=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const ve=t=>{const i=window.SVG,{className:o}=t,s=fe(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:me()},s)):e.React.createElement("svg",Object.assign({className:n},s))};var be=c(5886),ye=c.n(be),Ie=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const xe=t=>{const i=window.SVG,{className:o}=t,s=Ie(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:ye()},s)):e.React.createElement("svg",Object.assign({className:n},s))};var we=c(3600),Se=c.n(we),Ce=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const De=t=>{const i=window.SVG,{className:o}=t,s=Ce(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:Se()},s)):e.React.createElement("svg",Object.assign({className:n},s))},je=!0,Pe=[{name:"offset",options:{offset:[0,10]}}];class Te extends e.React.PureComponent{constructor(o){super(o),this.getTotalLines=()=>{const{itemJson:e}=this.state;let t=0;return e.children&&e.children.forEach((e=>{var i,o;t++,e.isExpand&&(t+=null!==(o=null===(i=e.children)||void 0===i?void 0:i.length)&&void 0!==o?o:0)})),t},this.getTreeContentHeight=()=>30*this.getTotalLines(),this.handleOnTocDragStatusChange=e=>{var t;const i=this.getItemJsonByDialogs();this.setState({isTocDragging:e,tocDraggingMode:null===(t=i.data)||void 0===t?void 0:t.mode,itemJson:i})},this.getFirstItemJson=e=>{const{itemJson:t}=this.state;return t.children.filter((t=>t.data.mode===e&&0===t.data.index))[0]},this.getLastItemJson=e=>{const{itemJson:t}=this.state,i=t.children.filter((t=>t.data.mode===e));return i.filter((e=>e.data.index===i.length-1))[0]},this.getLastParentItemJson=()=>{const{itemJson:e}=this.state;return e.children[e.children.length-1]},this.handleOnTocDraggingStatusChange=e=>{this.setState({tocDraggingStatus:e,itemJson:this.getItemJsonByDialogs()})},this.onDidDrop=(e,t,i)=>{"moveInto"!==i&&this.props.reOrderDialog(e.data.id,t.data.id,i)},this.canDropFunc=(e,t)=>e.id!==t.id,this.handleChooseTemplate=e=>{this.setState({isTemplatePopoverOpen:!1}),this.props.addDialog(e)},this.handleToggleTemplatePopover=()=>{const{isTemplatePopoverOpen:e}=this.state;this.setState({isTemplatePopoverOpen:!e})},this.closeTemplatePopover=()=>{this.state.isTemplatePopoverOpen&&(this.templateBtn.focus(),this.setState({isTemplatePopoverOpen:!1}))},this.singleAndDoubleClickTimeout=void 0,this.handleClickItem=e=>{this.singleAndDoubleClickTimeout&&(clearTimeout(this.singleAndDoubleClickTimeout),this.singleAndDoubleClickTimeout=void 0),this.singleAndDoubleClickTimeout=setTimeout((()=>{this.setState({currentSelectedItemId:e.id,itemJson:R(this.state.itemJson,[e.id])},(()=>{this.props.onClickDialog(e.data.id)}))}),200)},this.handleOnTocDoubleClick=(e,t)=>{this.singleAndDoubleClickTimeout&&(clearTimeout(this.singleAndDoubleClickTimeout),this.singleAndDoubleClickTimeout=void 0),this.props.changeEditableDialogItemId(e.id),t.stopPropagation()},this.renameDialog=(e,t)=>(this.props.changeEditableDialogItemId(""),!!(null==t?void 0:t.trim())&&this.props.renameDialog(e.data.id,t)),this.getItemJsonByDialogJson=e=>{const i=e.id,{currentDialogItemId:o}=this.props,s={id:i,isSplash:!!e.isSplash,data:e,label:e.label,index:e.index,level:0,isActive:o===i,allowEditable:!0,renderItem:this.renderDialogContent};return s.icon=e.icon,s.icon||(s.icon=t.utils.getDefaultTocDialogIcon()),s},this.getItemJsonByDialogs=t=>{t||(t=this.props.dialogs);const i={id:"ROOT",children:[],label:""};if(!t)return(0,e.Immutable)(i);const o=Object.keys(t).map(((e,i)=>{const o=this.getItemJsonByDialogJson(t[e]);return o.children=[],o}));i.children=o;return(0,e.Immutable)(i)},this.getMoreDropDownItems=t=>{const i=t.data,o=[],s=(0,e.Immutable)({a11yFocusBack:!1,label:this.props.formatMessage("rename"),event:e=>{this.handleOnTocDoubleClick(t,e)},visible:!0});o.push(s);const n=(0,e.Immutable)({label:this.props.formatMessage("duplicate"),event:e=>{e.stopPropagation(),this.props.duplicateDialog(i.id)},visible:!0});o.push(n);const a=(0,e.Immutable)({label:this.props.formatMessage("delete"),event:e=>{this.props.removeDialog(i.id),e.stopPropagation()},visible:!0});return o.push(a),o},this.renderDialogItemRightContent=o=>{const{theme:s,onSplashClick:n}=this.props,{data:a}=o,r=this.getMoreDropDownItems(o),l=e.css`
      margin-right: calc(16px - ${s.components.button.sizes.sm.paddingX});
      .dialog-item-splash-btn {
        color: ${o.isSplash?s.ref.palette.black:s.ref.palette.neutral[1e3]};
        &:hover {
          color: ${s.ref.palette.black};
        }
      }
      .dropDown {
        display: inline-flex;
        .btn {
          display: none;
        }
      }
    `;let d=null;if(a.mode===e.DialogMode.Fixed){const e=t.utils.getPageListByDialogId(this.props.pages,a.id);e.length&&(d=this.props.formatMessage("openedWithPages",{pages:e.map((e=>e.label)).join(", ")}))}return(0,e.jsx)("div",{className:"d-flex",css:l},d?(0,e.jsx)(i.Tooltip,{placement:"bottom",title:d},(0,e.jsx)(i.Button,{icon:!0,size:"sm",type:"tertiary",tag:"div",style:{cursor:"inherit"},className:"dialog-item-page-btn dialog-item-icon d-flex align-items-center"},(0,e.jsx)(xe,{size:12}))):a.mode===e.DialogMode.Fixed&&(0,e.jsx)(i.Tooltip,{placement:"bottom",title:this.props.formatMessage("makeSplash")},(0,e.jsx)(F,{size:"sm",icon:!0,type:"tertiary",disableHoverEffect:!0,"aria-label":this.props.formatMessage("makeSplash"),className:"dialog-item-splash-btn dialog-item-icon item-inside-button jimu-outline-inside",onClick:e=>{e.stopPropagation(),n(a.id)}},(0,e.jsx)(De,null))),(0,e.jsx)("div",{title:this.props.formatMessage("more"),className:"dropDown dialog-item-icon"},(0,e.jsx)(x,{modifiers:Pe,direction:"down",theme:s,items:r,insideOutline:!0})))},this.renderDialogContent=t=>{var i,o,s;const{intl:n,theme:a,editableDialogItemId:r}=this.props,{isTocDragging:l,tocDraggingStatus:d,tocDraggingMode:c}=this.state,p=null===(i=t.data.mode===e.DialogMode.Fixed?this.treeRefForFixed:this.treeRefForAnchored)||void 0===i?void 0:i.getBoundingClientRect();return(0,e.jsx)(de,{intl:n,itemJson:t,theme:a,canDnd:!0,tocDraggingMode:c,isFirstItem:0===t.data.index,isLastItem:this.getLastItemJson(t.data.mode).id===t.id,isTocDragging:l,onTocDragStatusChange:this.handleOnTocDragStatusChange,tocDraggingStatus:d,parentBoundTop:null!==(o=null==p?void 0:p.top)&&void 0!==o?o:-1,parentBoundBottom:null!==(s=null==p?void 0:p.bottom)&&void 0!==s?s:-1,editable:r===t.id,renderRightContent:this.renderDialogItemRightContent,onDidDrop:this.onDidDrop,canDropFunc:this.canDropFunc,renameItem:this.renameDialog,onDoubleClick:this.handleOnTocDoubleClick})},this.getItemJsonByMode=e=>{const{itemJson:t}=this.state,i=t?{id:t.id,isActive:t.isActive,isExpand:t.isExpand,label:"",children:[]}:null;if(i){const o={};t.children.forEach((t=>{var i;(null===(i=t.data)||void 0===i?void 0:i.mode)===e&&(o[t.index]=t)})),Object.keys(o).forEach((e=>{i.children.push(o[e])}))}return i},this.state={currentSelectedItemId:o.currentDialogItemId,itemJson:void 0,isTemplatePopoverOpen:!1,isFixedGroupShown:!0,isAnchoredGroupShown:!0,isTocDragging:!1,tocDraggingMode:null,tocDraggingStatus:"on"}}componentWillUnmount(){this.dropZoneInteractable&&(this.dropZoneInteractable.unset(),this.dropZoneInteractable=null)}componentDidUpdate(e){const t=this.props;let i=!1,o={};const{dialogs:s,currentDialogItemId:n,editableDialogItemId:a,forceRefresh:r}=e;if(t.forceRefresh&&!r||t.currentDialogItemId!==n||t.dialogs!==s||t.editableDialogItemId!==a)if(i=!0,t.dialogs===s&&t.editableDialogItemId===a||t.currentDialogItemId===n)o=t.currentDialogItemId!==n?{currentSelectedItemId:t.currentDialogItemId,itemJson:R(this.state.itemJson,[t.currentDialogItemId])}:{itemJson:this.getItemJsonByDialogs(t.dialogs)};else{const e=R(this.getItemJsonByDialogs(t.dialogs),[t.currentDialogItemId]);o={currentSelectedItemId:t.currentDialogItemId,itemJson:e}}i&&this.setState(o)}componentDidMount(){this.setState({itemJson:this.getItemJsonByDialogs()}),this.initDragEvent(e.DialogMode.Fixed),this.initDragEvent(e.DialogMode.Anchored)}initDragEvent(t){const i=t===e.DialogMode.Fixed?".toc-fixed-dialog-drag":".toc-anchored-dialog-drag",o=t===e.DialogMode.Fixed?this.dropZoneRefForFixed:this.dropZoneRefForAnchored,s=t===e.DialogMode.Fixed?this.treeRefForFixed:this.treeRefForAnchored;o&&(this.dropZoneInteractable=(0,n.interact)(o).dropzone({accept:i,overlap:"pointer",ondragenter:e=>{const{itemJson:i}=this.state;if(i&&s){const{relatedTarget:i,dragEvent:o}=e,n=s.getBoundingClientRect().top,a=this.getTreeContentHeight(),r=JSON.parse(i.getAttribute("itemJson")),l=o.client;if(l.y<=n){this.getFirstItemJson(t).data.id!==r.data.id&&this.handleOnTocDraggingStatusChange("top")}else l.y<=a+n&&this.handleOnTocDraggingStatusChange("on")}},ondragleave:e=>{this.handleOnTocDraggingStatusChange("on")},ondrop:e=>{const t=e.relatedTarget,i=JSON.parse(t.getAttribute("itemJson")),o=this.state.tocDraggingStatus;if("on"===o)return;const s="bottom"===o?this.getLastParentItemJson():this.getFirstItemJson(i.data.mode);this.onDidDrop(i,s,o),this.handleOnTocDraggingStatusChange("on")}}))}render(){const{itemJson:t}=this.state,{theme:o}=this.props,n=e.css`
      height: 100%;
      position: relative;
      .toc-dropzone {
        position: absolute;
        pointer-events: none;
      }
      .text-data-600{
        color: ${o.ref.palette.neutral[1e3]};
      }
      .dialog-list-top {
        position: absolute;
        right: 16px;
        top: -38px;
        .dialog-top-buttons {
          margin-right: -${o.components.button.sizes.sm.paddingX};
          .my-dropdown {
            margin-left: -5px;
            margin-right: 5px;
          }
        }
      }
      .dialog-list-content{
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;

        .dialog-group{
          display: flex;
          align-items: center;
          padding: 0.25rem 0.575rem 0.25rem 1rem;
          .dialog-group-title{
            font-size: 14px;
            color: ${o.ref.palette.neutral[1e3]};
            flex-grow: 1;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }

        .dialog-tree {
          overflow: hidden;
        }
      }
    `,a=this.getItemJsonByMode(e.DialogMode.Fixed),r=this.getItemJsonByMode(e.DialogMode.Anchored);return(0,e.jsx)("div",{css:n},(0,e.jsx)("div",{className:"dialog-list-top"},(0,e.jsx)("div",{className:"d-flex justify-content-between w-100 align-items-center"},(0,e.jsx)("div",{className:"d-flex dialog-top-buttons align-items-center"},(0,e.jsx)("div",{ref:e=>{this.addDialogRef=e},css:e.css`z-index: 11;`},(0,e.jsx)(i.Tooltip,{placement:"bottom",title:this.props.formatMessage("addDialog")},(0,e.jsx)(i.Button,{icon:!0,disabled:!t,type:"tertiary","aria-label":this.props.formatMessage("addDialog"),ref:e=>{this.templateBtn=e},onClick:this.handleToggleTemplatePopover,size:"sm",className:"add-dialog-btn"},(0,e.jsx)(oe,{className:"add-dialog-icon"})))),this.state.isTemplatePopoverOpen&&(0,e.jsx)(s.WindowTemplatePopper,{theme:this.props.theme,referenceElement:this.addDialogRef,formatMessage:this.props.formatMessage,onItemSelect:this.handleChooseTemplate,onClose:this.closeTemplatePopover})))),(0,e.jsx)("div",{className:"dialog-list-content"},(0,e.jsx)("div",null,(0,e.jsx)("div",{className:"dialog-group"},(0,e.jsx)("div",{className:"dialog-group-title"},this.props.formatMessage("fixedWindows")),(0,e.jsx)(i.Button,{icon:!0,size:"sm",type:"tertiary",disabled:!((null==a?void 0:a.children.length)>0),title:this.props.formatMessage(this.state.isFixedGroupShown?"collapse":"expand"),"aria-label":this.props.formatMessage(this.state.isFixedGroupShown?"collapse":"expand"),"aria-expanded":this.state.isFixedGroupShown,onClick:e=>{this.setState({isFixedGroupShown:!this.state.isFixedGroupShown})}},this.state.isFixedGroupShown&&(null==a?void 0:a.children.length)?(0,e.jsx)(ge,null):(0,e.jsx)(ve,null))),(0,e.jsx)(i.Collapse,{isOpen:this.state.isFixedGroupShown},(0,e.jsx)("div",{ref:e=>{this.dropZoneRefForFixed=e},className:"toc-dropzone toc-dialog-dropzone w-100",style:{height:30*(null==a?void 0:a.children.length)+"px"}}),(0,e.jsx)(B,{forwardRef:e=>{this.treeRefForFixed=e},className:"dialog-tree",hideRoot:je,itemJson:(0,e.Immutable)(a),onClickItem:this.handleClickItem})),(0,e.jsx)("div",{className:"dialog-group"},(0,e.jsx)("div",{className:"dialog-group-title"},this.props.formatMessage("anchoredWindows")),(0,e.jsx)(i.Button,{icon:!0,size:"sm",type:"tertiary",disabled:!((null==r?void 0:r.children.length)>0),title:this.props.formatMessage(this.state.isAnchoredGroupShown?"collapse":"expand"),"aria-label":this.props.formatMessage(this.state.isAnchoredGroupShown?"collapse":"expand"),"aria-expanded":this.state.isAnchoredGroupShown,onClick:e=>{this.setState({isAnchoredGroupShown:!this.state.isAnchoredGroupShown})}},this.state.isAnchoredGroupShown&&(null==r?void 0:r.children.length)?(0,e.jsx)(ge,null):(0,e.jsx)(ve,null))),(0,e.jsx)(i.Collapse,{isOpen:this.state.isAnchoredGroupShown},(0,e.jsx)("div",{ref:e=>{this.dropZoneRefForAnchored=e},className:"toc-dropzone toc-dialog-dropzone w-100",style:{height:30*(null==r?void 0:r.children.length)+"px"}}),(0,e.jsx)(B,{forwardRef:e=>{this.treeRefForAnchored=e},className:"dialog-tree",hideRoot:je,itemJson:(0,e.Immutable)(r),onClickItem:this.handleClickItem})))))}}const ke=e.ReactRedux.connect((e=>{const t=e.appStateInBuilder&&e.appStateInBuilder.appConfig;return{pages:t&&t.pages,dialogs:t&&t.dialogs}}))(Te);const Oe=e.ReactRedux.connect(((t,i)=>{var o,s,n,a,r;return{updateRightContentByAppMode:!!i.itemJson.isActive&&(null===(s=null===(o=null==t?void 0:t.appStateInBuilder)||void 0===o?void 0:o.appRuntimeInfo)||void 0===s?void 0:s.appMode)===e.AppMode.Run,updateRightContentByLockLayout:!!i.itemJson.isActive&&(null===(r=null===(a=null===(n=t.appStateInBuilder)||void 0===n?void 0:n.appConfig)||void 0===a?void 0:a.forBuilderAttributes)||void 0===r?void 0:r.lockLayout)}}))(class extends l{constructor(t){super(t),this.checkValidity=e=>{const{itemJson:t}=this.props;let i={valid:!0};if("view"===(null==t?void 0:t.type)){const o=t.id.split(r);i=this._checkLabel("view",o[o.length-1],e)}return i},this.labelChanged=e=>{this.setState({currentLabel:e})},this.handleLabelBlur=e=>{var t,i;const{itemJson:o}=this.props;let s=""!==e.trim();s&&"view"===(null==o?void 0:o.type)&&(s=this._checkLabel("view",o.id,e).valid),s||(e=this.props.itemJson.label,null===(i=(t=this.props).renameItem)||void 0===i||i.call(t,this.props.itemJson,e)),this.labelChanged(e)},this.getStyle=()=>{var t;const i=(0,e.getAppStore)().getState(),o=null===(t=null==i?void 0:i.appContext)||void 0===t?void 0:t.isRTL,{theme:s,editable:n,itemJson:a}=this.props,{mustShowArrow:r,children:l,level:d,isActive:c,isExpand:p}=a;return e.css`
      min-height: ${30}px;
      width: auto;
      min-width: 100%;
      align-items: center;
      cursor: pointer;
      .dropDown {
        display: inline-flex;
      }

      :hover {
        ${c?"":`background-color: ${s.ref.palette.neutral[500]};`}
        .dropDown {
          z-index: 2;
          .btn {
            visibility: visible;
          }
        }
        .editor {
          color: ${s.ref.palette.black};
        }
      }

      .item-action-button {
        display: none;
      }

      &.active {
        background-color: ${s.sys.color.primary.main};
        border: 0;
        .editor {
          color: ${s.ref.palette.black};
        }

        &:hover {
          .item-action-button {
            display: block;
          }
        }
      }

      &.insideActive {
        background-color: ${s.ref.palette.neutral[500]};
      }

      .toc-item {
        padding: 0;
        border: 0;
        .toc-item-content {
          margin-left: ${10*d}px;
          position: relative;
          .toc-arrow {
            z-index: 2;
            padding-right: ${e.polished.rem(1)};
            visibility: ${r||l&&l.length>0?"visible":"hidden"};
            .jimu-icon {
              fill: ${s.ref.palette.black};
              transform-origin: center;
              transform: ${`rotate(${p?90:o?180:0}deg)`};
              transition: transform .5s;
            }
          }

          .left-and-right {
            overflow-x: hidden;
            margin-left: -5px;
            /* margin-left: calc(8px - ${s.components.button.sizes.sm.paddingX} - 0.6875rem + ${e.polished.rem(4)}); */
            .left-content {
              align-items: center;
              overflow-x: hidden;
              flex: auto;
              .editor {
                overflow: hidden;
                text-overflow: ${n?"clip":"ellipsis"};
                white-space: nowrap;
                font-size: ${.875}rem;
                user-select: none;
                flex: auto;
                text-align: start;
              }
              [contenteditable="true"] {
                user-select: text;
                -webkit-user-select: text;
                background-color: ${s.ref.palette.white};
              }
              .header-icon {
                margin-right: 0.3rem;
                flex: none;
              }
            }
          }
        }
      }
    `},this.registerMouseEvent=e=>{e.addEventListener("mouseenter",(e=>{this.handleMouseEnter(e)})),e.addEventListener("mouseleave",(e=>{this.handleMouseLeave(e)}))},this.state={currentLabel:this.props.itemJson.label,currentIcon:this.props.itemJson.icon}}componentDidMount(){super.componentDidMount()}componentDidUpdate(e){super.componentDidUpdate(e)}render(){const{itemJson:t,renderRightContent:o,editable:s,theme:n,formatMessage:a,className:r}=this.props,{currentLabel:l,currentIcon:d}=this.state;let c;return c=d&&d.svg?d:{svg:d},(0,e.jsx)("div",{className:(0,e.classNames)("d-flex",r,{active:t.isActive}),css:this.getStyle()},(0,e.jsx)("div",{className:"d-flex w-100 h-100",onDoubleClick:this.handleDoubleClickItem,onClick:this.handleClick,ref:e=>{e&&this.registerMouseEvent(e)}},(0,e.jsx)("div",{className:"d-flex justify-content-between w-100 toc-item"},(0,e.jsx)("div",{className:"d-flex toc-item-content w-100"},(0,e.jsx)(F,{className:"toc-arrow jimu-outline-inside",icon:!0,type:"tertiary",disableHoverEffect:!0,disableRipple:!0,title:a(t.isExpand?"collapse":"expand"),"aria-label":a(t.isExpand?"collapse":"expand"),"aria-expanded":t.isExpand,onClick:this.handleArrowClick,onKeyUp:e=>{("Enter"===e.key||" "===e.key)&&this.handleArrowClick(e)}},(0,e.jsx)(u,{size:"s"})),(0,e.jsx)("div",{className:"left-and-right d-flex justify-content-between w-100"},(0,e.jsx)("div",{className:"d-flex left-content "+(o?"pr-0":"pr-2")},d&&(0,e.jsx)(i.Icon,{autoFlip:t.needFlip,className:"header-icon",color:n.ref.palette.neutral[1e3],size:12,icon:c.svg,"aria-hidden":"true"}),(0,e.jsx)("div",{title:l,className:"item-label editor"},t.allowEditable&&s?(0,e.jsx)(i.TextInput,{size:"sm",ref:e=>{this.editor=e},value:l,onChange:e=>{this.labelChanged(e.target.value)},onAcceptValue:this.onRenameAccept,checkValidityOnChange:this.checkValidity,checkValidityOnAccept:this.checkValidity,onBlur:e=>{this.handleLabelBlur(e.target.value)}}):(0,e.jsx)(e.React.Fragment,null,l))),o&&o(t))))))}});class Ae extends e.React.PureComponent{constructor(t){super(t),this.handleChange=e=>{const t=(null==e?void 0:e.target.value)||"";this.setState({searchText:t},(()=>{const{onSearchTextChange:e}=this.props;e&&e(t)}))},this.handleSubmit=e=>{const{onSubmit:t}=this.props;t&&t(e)},this.onKeyUp=e=>{e&&e.target&&"Enter"===e.key&&this.handleSubmit(e.target.value)},this.handleClear=e=>{this.setState({searchText:""}),e.stopPropagation()},this.getStyle=()=>e.css`
      position: relative;
      .toc-search-input {
        .search-close-icon {
          padding: 0.125rem;
        }
      }
    `,this.state={searchText:t.searchText||""}}componentDidUpdate(e){if(this.props.searchText!==e.searchText&&this.props.searchText!==this.state.searchText){const{searchText:e}=this.props;this.setState({searchText:e})}}render(){const{placeholder:t,className:o,inputRef:s,onFocus:n,onBlur:a}=this.props,{searchText:r}=this.state;return(0,e.jsx)("div",{css:this.getStyle(),className:o},(0,e.jsx)(i.TextInput,{className:"toc-search-input",ref:s,"aria-label":t,placeholder:t,allowClear:!0,onChange:this.handleChange,onBlur:a,onFocus:n,value:r,onKeyDown:e=>{this.onKeyUp(e)}}))}}function Me(e,t){let i=e.id;return"widget"===t||"layoutItem"===t?i=e.layoutId+r+e.layoutItemId+r+(e.id||t):"section"===t||"screenGroup"===t?i=e.layoutId+r+e.layoutItemId+r+e.id:"view"!==t&&"screen"!==t&&"layout"!==t||(i=e.layoutId+r+e.layoutItemId+r+e.sectionOrScreenGroupId+r+e.id),i}function Re(e){var t;return(null===(t=null==e?void 0:e.children)||void 0===t?void 0:t.length)>0}function Ne(t,i){const{theme:o}=t,{showSearch:s}=i;return e.css`
    height: 100%;
    padding-bottom: 10px;
    position: relative;
    .toc-dropzone {
      position: absolute;
      pointer-events: none;
    }
    .outline-list-top {
      height: ${s?82:44}px;
      padding: 10px ${16}px;
      padding-top: 0;
      .outline-title {
        user-select: none;
        color: ${o.ref.palette.neutral[1e3]};
        font-weight: ${o.ref.typeface.fontWeightBold};
      }
      .outline-top-buttons {
        margin-right: -${o.components.button.sizes.sm.paddingX};
        // .btn:hover {
        //   svg {
        //     color: ${o.ref.palette.black};
        //   }
        // }
      }
      .toc-search-input {
        margin-top: calc(12px - ${o.components.button.sizes.sm.paddingY});
      }
    }
    .outline-tree-container {
      color: ${o.ref.palette.neutral[1e3]};
      height: calc(100% - ${s?82:44}px);
      overflow-y: auto;
      .outline-tree {
        >div {
          overflow: hidden;
          >div {
            overflow-x: auto;
            >.collapse {
              min-width: fit-content;
            }
          }
        }
        .tree-item-common {
          padding-left: ${16}px;
          .tree-arrow {
            display: none;
          }
        }
        .outline-title-item {
          margin-top: ${e.polished.rem(6)};
          .tree-item-common {
            .left-content {
              font-weight: ${o.ref.typeface.fontWeightBold};
              color: ${o.ref.palette.neutral[1e3]};
            }
          }
          .tree-item-common:hover {
            background-color:${e.polished.rgba(o.ref.palette.neutral[500],.6)};
          }
        }
        .toc-item-dropzone {
          .toc-item {
            padding-left: ${e.polished.rem(4)};
          }
        }
      }
    }

  `}let Ee;function Le(e,t,i,o,s,n=0){return e.map(((e,a)=>{var r,l,d,c,p,h;let g=e;s&&(g=Object.assign({},e,{layoutId:s.layoutId,layoutItemId:s.layoutItemId,sectionOrScreenGroupId:s.id}));const u=Me(g,e.type),{currentSelectedItemId:m}=o,{expandIds:f,renderOutlineContent:v,renderTitleRightContent:b}=Ee,y=f.includes(u),I={id:u,label:e.label,icon:e.icon,index:a,level:n,data:e,allowEditable:Be(t,i),allowRename:!e.isLabelReadOnly,type:e.type,pagePart:t,mustShowArrow:(null===(r=e.children)||void 0===r?void 0:r.length)>0,isActive:m===u,isExpand:y,renderItem:v,renderRightContent:b,needFlip:"widget"===e.type&&(null===(p=null===(c=null===(d=null===(l=i.appConfig.widgets[e.id])||void 0===l?void 0:l.data)||void 0===d?void 0:d.manifest)||void 0===c?void 0:c.properties)||void 0===p?void 0:p.flipIcon)};if(e.children){const a=(null===(h=e.children[0])||void 0===h?void 0:h.layoutId)?null:e.layoutId?e:s;I.children=Le(e.children,t,i,o,a,n+1)}return I}))}function Be(t,i){let o;return o=t===e.PagePart.Header?i.allowEditableForHeader:t===e.PagePart.Footer?i.allowEditableForFooter:t===e.PagePart.Body?i.allowEditable:i.allowEditableForDialog,o}var Je=c(170),ze=c.n(Je),Fe=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const $e=t=>{const i=window.SVG,{className:o}=t,s=Fe(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:ze()},s)):e.React.createElement("svg",Object.assign({className:n},s))};var Ue=c(8116),He=c.n(Ue),Ge=function(e,t){var i={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(o=Object.getOwnPropertySymbols(e);s<o.length;s++)t.indexOf(o[s])<0&&Object.prototype.propertyIsEnumerable.call(e,o[s])&&(i[o[s]]=e[o[s]])}return i};const Ve=t=>{const i=window.SVG,{className:o}=t,s=Ge(t,["className"]),n=(0,e.classNames)("jimu-icon jimu-icon-component",o);return i?e.React.createElement(i,Object.assign({className:n,src:He()},s)):e.React.createElement("svg",Object.assign({className:n},s))},We=[{name:"offset",options:{offset:[0,10]}}];class Ze extends e.React.Component{constructor(s){var n,a;super(s),this.singleAndDoubleClickTimeout=void 0,this.isViewOrScreenSelected=e=>{const t=null==e?void 0:e.split(r);return t&&["view","screen"].includes(t[t.length-1].split("_")[0])},this.handleOnTocDoubleClick=(e,t)=>{e.allowRename&&(this.singleAndDoubleClickTimeout&&(clearTimeout(this.singleAndDoubleClickTimeout),this.singleAndDoubleClickTimeout=void 0),this.checkIfReadOnly(e)||this.setState({editableItemId:e.id}))},this.handleRename=(e,i)=>((null==i?void 0:i.trim())||(i=e.label),this.setState({editableItemId:""}),function(e,i){return!(!i||""===i||""===i.replace(/(\r\n|\n|\r)/g,"")||((0,t.getAppConfigAction)().editLabelOfTocNode(e.data,""!==i?i:void 0).exec(),0))}(e,i)),this.checkIfReadOnly=e=>{var t,i;const o=e.id.split(r);let s;return s="screenGroup"===e.type||"section"===e.type?o[0]===(null===(t=this.props.selection)||void 0===t?void 0:t.layoutId)&&o[1]===(null===(i=this.props.selection)||void 0===i?void 0:i.layoutItemId):this.state.currentSelectedItemId===e.id,!(s&&e.allowEditable&&e.pagePart===this.props.activePagePart)},this.handleClickItem=(e,t)=>{this.singleAndDoubleClickTimeout&&(clearTimeout(this.singleAndDoubleClickTimeout),this.singleAndDoubleClickTimeout=void 0),e.allowEditable&&(this.singleAndDoubleClickTimeout=setTimeout((()=>{if(!e.type||"layout"===e.type)return void this.handleExpand(e);const{currentSelectedItemId:t,itemJson:i}=this.state;t!==e.id?e.type&&"layout"!==e.type?(this.setState({currentSelectedItemId:e.id,itemJson:M(i,[e.id])}),this.props.onClickItem(e)):(this.setState({itemJson:Object.assign({},i)}),this.props.onClickItem(e)):this.handleExpand(e)}),200))},this.handleExpand=e=>{const{expandIds:t}=this;e.isExpand?t.includes(e.id)&&t.splice(t.indexOf(e.id),1):t.includes(e.id)||t.push(e.id),this.setState({itemJson:A(this.state.itemJson,t)})},this.handleExpandIdsByInsideLayouts=(e,t,i)=>{Re(e)&&(i?t[e.id]=!0:delete t[e.id],e.children.forEach((e=>{this.handleExpandIdsByInsideLayouts(e,t,i)})))},this.handleExpandOrCollapseAll=(e,t,i)=>{i.stopPropagation();const o={};this.expandIds.forEach((e=>{o[e]=!0})),this.handleExpandIdsByInsideLayouts(t,o,e),this.expandIds=Object.keys(o).map((e=>e)),this.setState({itemJson:A(this.state.itemJson,this.expandIds)})},this.handleArrowClick=e=>{this.handleExpand(e)},this.handleSearchTextChange=(e,t=!0)=>{this.setState({filterText:e},(()=>{this.setState({itemJson:this.getItemJsonByAppConfig(this.props,this.state,t)})}))},this.handleSearchSubmit=e=>{this.handleSearchTextChange(e,!1)},this.handleSearchBtnClick=e=>{null==e||e.stopPropagation();this.state.showSearch&&this.handleSearchTextChange(""),this.setState({showSearch:!this.state.showSearch})},this.handleSearchOpened=()=>{this.searchInput&&(this.searchInput.select(),this.searchInput.focus())},this.getItemJsonByAppConfig=(i,s,n=!1)=>function(i,s,n,a=!1){const r=[],{appConfig:l,currentPageId:d,currentDialogId:c,activePagePart:p}=i,{filterText:h,currentSelectedItemId:g}=s,u=[i.formatMessage("variableHeader"),i.formatMessage("variableFooter"),i.formatMessage("variableBody")],m=[e.PagePart.Header,e.PagePart.Footer,e.PagePart.Body];Ee=n;const{expandIds:f,renderTitleRightContent:v,lastPageId:b}=Ee,y={id:"ROOT",children:r,label:""};if(!l)return(0,e.Immutable)(y);if(c){const e=l.dialogs[c],n=e&&o.searchUtils.findLayoutId(e.layout,i.browserSizeMode,l.mainSizeMode),a=Le(t.LayoutServiceProvider.getInstance().getServiceByType(l.layouts[n].type).getTocStructure(l,n),null,i,s);y.children=a}else for(let n=0;n<3;n++){if(0===n&&!i.enableHeader||1===n&&!i.enableFooter)continue;const a=n+"-"+u[n],c=g===a;c&&(f.includes(a)||f.push(a));const y=f.includes(a),I={label:u[n],pagePart:m[n],id:a,index:n,level:0,mustShowArrow:!0,isActive:c,isExpand:y,className:"outline-title-item",allowEditable:!0,renderRightContent:v,arrowIcon:t=>e.React.createElement("div",null)};let x,w,S=!0;if(I.label===i.formatMessage("variableHeader")?(x=e.ContainerType.Header,w="header",i.enableHeader||(S=!1)):I.label===i.formatMessage("variableBody")?(x=e.ContainerType.Page,w=d,t.appConfigUtils.isRealPage(l,d)?Ee.lastPageId=d:w=b):(x=e.ContainerType.Footer,w="footer",i.enableFooter||(S=!1)),S){const n=x===e.ContainerType.Page?l.pages[w]:l[x],a=n&&o.searchUtils.findLayoutId(n.layout,i.browserSizeMode,l.mainSizeMode),r=l.layouts[a],d=Le(t.LayoutServiceProvider.getInstance().getServiceByType(r.type).getTocStructure(l,a),I.pagePart,i,s);I.children=d,(h&&""!==h||p===I.pagePart)&&I.children&&I.children.length>0&&(I.isExpand=!0,f.includes(I.id)||f.push(I.id))}r.push(I)}let I=(0,e.Immutable)(y);if(h&&""!==h){const e=k(I,h.trim());I=O(e,h.trim()),Ee.expandIds=N(I),a&&t.builderAppSync.publishChangeSelectionToApp(null)}return I}(null!=i?i:this.props,null!=s?s:this.state,this,n),this.isSupportDropDown=e=>"section"===e||"view"===e||"screenGroup"===e||"screen"===e||"widget"===e||"layoutItem"===e,this.showExpandCollapseItems=e=>Re(e),this.getDropdownItemsFromTools=(i,o,s,n,a)=>{const{theme:r}=this.props,l=t.LayoutServiceProvider.getInstance().getServiceByType(s.type).getToolItems(i,o,a),d=[];return l.forEach((t=>{if(Array.isArray(t)){if(this.isToolVisible(t[0],s,n)){const i=[];t.forEach(((e,t)=>{0!==t&&i.push({label:this.getToolTitle(e,n),event:t=>{e.onClick({layoutId:s.id,layoutItem:n},t)}})})),d.push({label:(0,e.jsx)(w,{toggleContent:this.getToolTitle(t[0],n),modifiers:We,direction:"right",theme:r,items:i,icon:!1}),isBtn:!0})}}else if(t.separator&&d.length>0)d.push({divider:!0});else if(this.isToolVisible(t,s,n)){const i=this.getToolTitle(t,n);t.settingPanel?d.push({label:(0,e.jsx)(w,{toggleContent:i,modifiers:We,direction:"right",theme:r,items:[{label:"",settingPanel:t.settingPanel,settingPanelProps:{layoutId:s.id,layoutItem:n}}],icon:!1}),isBtn:!0}):d.push({label:i,event:e=>{t.onClick({layoutId:s.id,layoutItem:n},e)}})}})),d},this.isToolVisible=(e,t,i)=>e.visible&&("boolean"==typeof e.visible?e.visible:e.visible({layoutItem:i,layoutId:t.id})),this.getToolTitle=(e,t)=>e.title&&("string"==typeof e.title?e.title:e.title({layoutItem:t,formatMessage:this.props.formatMessage})),this.getDropDownItems=e=>{const{appConfig:t,formatMessage:i}=this.props,s=[];if(!this.isSupportDropDown(e.type))return s;const n=function(e){var t;const i=null===(t=null==e?void 0:e.id)||void 0===t?void 0:t.split(r);return!i||i.length<2?null:{layoutId:i[0],layoutItemId:i[1]}}(e),a=t.layouts[n.layoutId],l=o.searchUtils.findLayoutItem(t,n);e.allowRename&&s.push({a11yFocusBack:!1,label:i("rename"),event:t=>{this.handleOnTocDoubleClick(e,t)}});const d=this.getDropdownItemsFromTools(t,n,a,l,e.type);return s.push(...d),this.showExpandCollapseItems(e)&&(s.length>0&&s.push({divider:!0}),s.push({label:this.props.formatMessage("expandAll"),event:t=>{this.handleExpandOrCollapseAll(!0,e,t)}}),s.push({label:this.props.formatMessage("collapseAll"),event:t=>{this.handleExpandOrCollapseAll(!1,e,t)}})),s},this.renderTitleRightContent=t=>{const o=function(t,i){const{theme:o}=i;return e.css`
    margin-right:calc(14px - ${o.components.button.sizes.sm.paddingX});
    .title-arrow .jimu-icon {
      transform-origin: center;
      transform: ${`rotate(${t.isExpand?180:0}deg)`};
      transition: transform .5s;
    }

  `}(t,this.props),s=this.props.formatMessage(t.isExpand?"collapse":"expand");return(0,e.jsx)("div",{css:o},(0,e.jsx)(i.Button,{icon:!0,type:"tertiary",size:"sm",className:"title-arrow jimu-outline-inside",title:s,"aria-label":s,"aria-expanded":t.isExpand},(0,e.jsx)(ve,null)))},this.renderCommonRightContent=t=>{const{theme:i,runMode:o}=this.props,s=this.getDropDownItems(t);if(s.length<1)return(0,e.jsx)("div",null);const n=function(t){const{theme:i}=t;return e.css`
    margin-right:calc(16px - ${i.components.button.sizes.sm.paddingX});
    .dropDown {
      visibility: visible;
      .btn {
        visibility: hidden;
        color: ${i.ref.palette.neutral[1e3]};
      }
      .btn:hover {
        color: ${i.ref.palette.black};
      }
    }
  `}(this.props);return(0,e.jsx)("div",{className:"d-flex item-action-button",css:n,onClick:e=>{e.stopPropagation()},onDoubleClick:e=>{e.stopPropagation()}},(0,e.jsx)("div",{title:this.props.formatMessage("more"),className:"dropDown"},(0,e.jsx)(x,{modifiers:We,direction:"down",theme:i,items:s,insideOutline:!0,avoidNestedToggle:o,delayToggle:o?0:150})))},this.renderOutlineContent=t=>{var i;const{intl:o,theme:s,formatMessage:n}=this.props,a=!this.checkIfReadOnly(t),{editableItemId:r}=this.state,{type:l}=t,d=["section","view","screenGroup","screen","widget","layout","layoutItem"];"layoutItem"===t.type&&d.push(l);const c=("section"===t.type||"screenGroup"===t.type)&&(null===(i=this.state.currentSelectedItemId)||void 0===i?void 0:i.includes(t.id));return(0,e.jsx)(Oe,{className:c?"insideActive":"",intl:o,formatMessage:n,itemJson:t,onArrowClick:this.handleArrowClick,editable:r===t.id,onDoubleClick:a&&this.handleOnTocDoubleClick,renderRightContent:a&&d.includes(l)&&this.renderCommonRightContent,renameItem:this.handleRename,theme:s})},this.state={editableItemId:s.editableItemId,currentSelectedItemId:s.currentSelectedItemId,filterText:"",itemJson:void 0,showSearch:!1,showAlign:!1,showArrange:!1},this.expandIds=[],this.isRTL=null===(a=null===(n=(0,e.getAppStore)().getState())||void 0===n?void 0:n.appContext)||void 0===a?void 0:a.isRTL,this.alignRef=e.React.createRef(),this.arrangeRef=e.React.createRef(),this.tocItemCss=function(t){const{theme:i}=t;return e.css`
    :hover {
      .dropDown {
        z-index: 2;
        .btn {
          display: inline-flex;
        }
      }
      .editor {
        color: ${i.ref.palette.black};
      }
    }
    &.active {
      .editor {
        color: ${i.ref.palette.black};
      }
    }
  `}(s)}componentDidMount(){this.setState({itemJson:this.getItemJsonByAppConfig()})}shouldComponentUpdate(t,i){var o,s,n,a,r,l;const{appConfig:d}=this.props;let c=!1;if(t&&Object.keys(t).some((e=>this.props?"appConfig"!==e&&t[e]!==this.props[e]?(c=!0,!0):void 0:(c=!0,!0))),c)return!0;if(i&&Object.keys(i).some((e=>this.state?i[e]!==this.state[e]?(c=!0,!0):void 0:(c=!0,!0))),c)return!0;if(t.appConfig&&d&&t.appConfig!==d){const i=null==d?void 0:d.layouts,c=null===(o=t.appConfig)||void 0===o?void 0:o.layouts;if(i&&c&&i!==c&&function(t,i){let o=!1;return Object.keys(t).length!==Object.keys(i).length?o=!0:t&&Object.keys(t).some((s=>{const n=t[s],a=i[s];if(n!==a){if(n&&!a||!n&&a)return o=!0,!0;const t=n.content,i=a.content,s=n.order,r=a.order;if(t!==i||s!==r){if(s!==r||t&&!i||Object.keys(t||{}).length!==Object.keys(i||{}).length)return o=!0,!0;if(a.type===e.LayoutType.GridLayout){const e=Object.keys(t).join(",")!==Object.keys(i).join(",");return o=e||Object.keys(i).some((e=>i[e].label!==t[e].label)),!0}}if(t&&Object.keys(t).some((e=>{var s,n;const a=t[e],r=i[e];if(a&&!r||(null===(s=null==a?void 0:a.setting)||void 0===s?void 0:s.lockLayout)!==(null===(n=null==r?void 0:r.setting)||void 0===n?void 0:n.lockLayout)||(null==a?void 0:a.isPending)!==(null==r?void 0:r.isPending))return o=!0,!0})),o)return!0}})),o}(i,c))return!0;const p=null==d?void 0:d.widgets,h=null===(s=t.appConfig)||void 0===s?void 0:s.widgets;if(p&&h&&p!==h&&function(e,t){let i=!1;return Object.keys(e).length!==Object.keys(t).length?i=!0:Object.keys(e).some((o=>{const s=e[o],n=t[o];return n?s.label!==n.label||s.icon!==n.icon?(i=!0,!0):void 0:(i=!0,!0)})),i}(p,h))return!0;const g=null==d?void 0:d.sections,u=null===(n=t.appConfig)||void 0===n?void 0:n.sections;if(g&&u&&g!==u&&function(e,t){let i=!1;return Object.keys(e).length!==Object.keys(t).length?i=!0:Object.keys(e).some((o=>{const s=e[o],n=t[o];return n?s.label!==n.label||s.icon!==n.icon||n.views!==s.views?(i=!0,!0):void 0:(i=!0,!0)})),i}(g,u))return!0;const m=null==d?void 0:d.views,f=null===(a=t.appConfig)||void 0===a?void 0:a.views;if(m&&f&&m!==f&&function(e,t){let i=!1;return Object.keys(e).length!==Object.keys(t).length?i=!0:Object.keys(e).some((o=>{const s=e[o],n=t[o];return n?s.label!==n.label||s.icon!==n.icon?(i=!0,!0):void 0:(i=!0,!0)})),i}(m,f))return!0;const v=null==d?void 0:d.screenGroups,b=null===(r=t.appConfig)||void 0===r?void 0:r.screenGroups;if(v&&b&&v!==b&&function(e,t){let i=!1;return Object.keys(e).length!==Object.keys(t).length?i=!0:Object.keys(e).some((o=>{const s=e[o],n=t[o];return n?s.label!==n.label||s.icon!==n.icon||n.screens!==s.screens?(i=!0,!0):void 0:(i=!0,!0)})),i}(v,b))return!0;const y=null==d?void 0:d.screens,I=null===(l=t.appConfig)||void 0===l?void 0:l.screens;if(y&&I&&y!==I&&function(e,t){let i=!1;return Object.keys(e).length!==Object.keys(t).length?i=!0:Object.keys(e).some((o=>{const s=e[o],n=t[o];return n?s.label!==n.label?(i=!0,!0):void 0:(i=!0,!0)})),i}(y,I))return!0}return!1}componentDidUpdate(e,t){const i=this.props,{itemJson:o,currentSelectedItemId:s,editableItemId:n}=this.state;let a,r=!1;if(i.currentSelectedItemId!==this.state.currentSelectedItemId||n!==t.editableItemId||i.enableFooter!==e.enableFooter||i.enableHeader!==e.enableHeader||i.appConfig!==e.appConfig||i.currentPageId!==e.currentPageId||i.currentDialogId!==e.currentDialogId||i.browserSizeMode!==e.browserSizeMode||e.runMode!==this.props.runMode){if(r=!0,i.appConfig===e.appConfig&&i.currentPageId===e.currentPageId&&i.currentDialogId===e.currentDialogId&&i.browserSizeMode===e.browserSizeMode||i.currentSelectedItemId===this.state.currentSelectedItemId)if(i.currentSelectedItemId!==s){const e=R(o,[i.currentSelectedItemId]);a={currentSelectedItemId:i.currentSelectedItemId,itemJson:e},this.expandIds=N(e)}else{if(void 0!==e.lockLayout&&this.props.lockLayout!==e.lockLayout&&!this.isViewOrScreenSelected(s))return;if(i.currentPageId!==e.currentPageId&&this.state.filterText)return void this.handleSearchBtnClick();if(e.runMode!==this.props.runMode&&!this.isViewOrScreenSelected(s))return;a={itemJson:this.getItemJsonByAppConfig(i)}}else{const t=R(this.getItemJsonByAppConfig(i),[i.currentSelectedItemId]);a={currentSelectedItemId:i.currentSelectedItemId,itemJson:t},i.currentPageId!==e.currentPageId&&this.state.showSearch&&this.handleSearchBtnClick(),this.expandIds=N(t)}r&&this.setState(a)}}render(){const{itemJson:t,showSearch:o}=this.state,{theme:s}=this.props;return(0,e.jsx)("div",{css:Ne(this.props,this.state)},(0,e.jsx)("div",{className:"outline-list-top"},(0,e.jsx)("div",{className:"w-100 d-flex justify-content-center"},(0,e.jsx)(Ve,{color:s.ref.palette.neutral[900],"aria-hidden":!0})),(0,e.jsx)("div",{className:"d-flex justify-content-between align-items-end"},(0,e.jsx)("div",{className:"outline-title mb-0 text-truncate"},this.props.formatMessage("outline")),(0,e.jsx)("div",{className:"d-flex outline-top-buttons"},(0,e.jsx)(i.Button,{icon:!0,size:"sm",type:"tertiary",title:this.props.formatMessage("search"),"aria-label":this.props.formatMessage("search"),"aria-pressed":o,className:"search-btn",onClick:this.handleSearchBtnClick},(0,e.jsx)($e,{className:"search-icon"})))),(0,e.jsx)(i.Collapse,{isOpen:o,onEntered:this.handleSearchOpened},(0,e.jsx)(Ae,{theme:s,placeholder:this.props.formatMessage("search"),searchText:this.state.filterText,onSearchTextChange:this.handleSearchTextChange,onSubmit:this.handleSearchSubmit,inputRef:e=>{this.searchInput=e}}))),(0,e.jsx)("div",{className:"w-100 outline-tree-container"},(0,e.jsx)(B,{hideRoot:true,className:"outline-tree",itemJson:t,onClickItem:this.handleClickItem,handleExpand:this.handleExpand})))}}const _e=e.ReactRedux.connect(((t,i)=>{var s,n,a,r,l,d,c,p,h,g,u,m,f,v,b,y,I,x,w,S,C,D,j,P,T,k,O,A,M,R,N,E,L,B,J;const z=i.currentPageId,F=t.appStateInBuilder&&t.appStateInBuilder.appRuntimeInfo&&t.appStateInBuilder.appRuntimeInfo.selection,$=t.appStateInBuilder&&t.appStateInBuilder.appConfig,U=F&&o.searchUtils.findLayoutItem($,F);let H,G,V;if(U)if(U.type===e.LayoutItemType.Section){const e=null===(a=null===(n=null===(s=t.appStateInBuilder)||void 0===s?void 0:s.appRuntimeInfo)||void 0===n?void 0:n.sectionNavInfos)||void 0===a?void 0:a[U.sectionId],i=null===(r=t.appStateInBuilder)||void 0===r?void 0:r.appConfig.sections[U.sectionId];G=null!==(l=null==e?void 0:e.currentViewId)&&void 0!==l?l:null==i?void 0:i.views[0],H=G?Me(Object.assign(Object.assign({},F),{id:G,sectionOrScreenGroupId:U.sectionId}),"view"):Me(Object.assign({id:U.sectionId},F),"section")}else if(U.type===e.LayoutItemType.ScreenGroup){const e=null===(p=null===(c=null===(d=t.appStateInBuilder)||void 0===d?void 0:d.appRuntimeInfo)||void 0===c?void 0:c.screenGroupNavInfos)||void 0===p?void 0:p[U.screenGroupId],i=t.appStateInBuilder.appConfig.screenGroups[U.screenGroupId].screens[null!==(h=null==e?void 0:e.activeIndex)&&void 0!==h?h:0],o=null===(g=t.appStateInBuilder)||void 0===g?void 0:g.appConfig.screens[i];V=null==o?void 0:o.id,H=V?Me(Object.assign(Object.assign({},F),{id:V,sectionOrScreenGroupId:U.screenGroupId}),"screen"):Me(Object.assign({id:U.screenGroupId},F),"screenGroup")}else void 0!==U.gridType?H=U.type===e.LayoutItemType.Widget?Me(Object.assign({id:U.widgetId||"placeholder"},F),"widget"):Me(Object.assign({id:null},F),"layoutItem"):U.type===e.LayoutItemType.Widget&&(H=Me(Object.assign({id:U.widgetId},F),"widget"));const W=!!(null===(m=null===(u=null==$?void 0:$.pages)||void 0===u?void 0:u[z])||void 0===m?void 0:m.header),Z=!!(null===(v=null===(f=null==$?void 0:$.pages)||void 0===f?void 0:f[z])||void 0===v?void 0:v.footer);return{currentSelectedItemId:H,selection:F,activePagePart:null===(y=null===(b=null==t?void 0:t.appStateInBuilder)||void 0===b?void 0:b.appRuntimeInfo)||void 0===y?void 0:y.activePagePart,allowEditableForDialog:!!(null===(S=null===(w=null===(x=null===(I=null==t?void 0:t.appStateInBuilder)||void 0===I?void 0:I.appConfig)||void 0===x?void 0:x.dialogs)||void 0===w?void 0:w[i.currentDialogId])||void 0===S?void 0:S.layout[i.browserSizeMode]),allowEditableForHeader:!(!W||!(null===(j=null===(D=null===(C=null==t?void 0:t.appStateInBuilder)||void 0===C?void 0:C.appConfig)||void 0===D?void 0:D.header)||void 0===j?void 0:j.layout[i.browserSizeMode])),allowEditableForFooter:!(!Z||!(null===(k=null===(T=null===(P=null==t?void 0:t.appStateInBuilder)||void 0===P?void 0:P.appConfig)||void 0===T?void 0:T.footer)||void 0===k?void 0:k.layout[i.browserSizeMode])),allowEditable:!!(null===(R=null===(M=null===(A=null===(O=null==t?void 0:t.appStateInBuilder)||void 0===O?void 0:O.appConfig)||void 0===A?void 0:A.pages)||void 0===M?void 0:M[z])||void 0===R?void 0:R.layout[i.browserSizeMode]),appConfig:$,lockLayout:null===(L=null===(E=null===(N=null==t?void 0:t.appStateInBuilder)||void 0===N?void 0:N.appConfig)||void 0===E?void 0:E.forBuilderAttributes)||void 0===L?void 0:L.lockLayout,enableHeader:W,enableFooter:Z,runMode:(null===(J=null===(B=null==t?void 0:t.appStateInBuilder)||void 0===B?void 0:B.appRuntimeInfo)||void 0===J?void 0:J.appMode)===e.AppMode.Run}}))(Ze);var Ke=function(e,t,i,o){return new(i||(i=Promise))((function(s,n){function a(e){try{l(o.next(e))}catch(e){n(e)}}function r(e){try{l(o.throw(e))}catch(e){n(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(a,r)}l((o=o.apply(e,t||[])).next())}))};const qe=Object.assign({},a,e.defaultMessages,o.defaultMessages,i.defaultMessages);class Ye extends e.React.PureComponent{constructor(o){super(o),this.lastResizeCall=null,this.emptyLayout={},this.handleOutlineItemClick=e=>{e.type&&("screenGroup"===e.type||"section"===e.type||"widget"===e.type?this.changeContent(e):"view"===e.type?this.changeView(e):"screen"===e.type?this.changeScreen(e):"layout"===e.type?this.changeLayout(e):"layoutItem"===e.type&&this.changeContent(e),e.pagePart&&t.builderAppSync.publishActivePagePartChangeToApp(e.pagePart))},this.changeCurrentPage=e=>{(0,s.changeCurrentPage)(e)},this.changeEditablePageId=e=>{e!==this.state.editablePageItemId&&this.setState({editablePageItemId:e})},this.movePageIntoPage=(i,o)=>{if(i===o)return;const s=(0,t.getAppConfigAction)().appConfig;(0,t.getAppConfigAction)().movePageIntoPage(i,o).exec();s.pages[i].type===e.PageType.Normal&&this.changeCurrentPage(i)},this.removePage=e=>{const i=(0,t.getAppConfigAction)().appConfig,o=i.pages[e];let s;if(i.pageStructure.some(((o,n)=>{const a=Object.keys(o)[0];return a!==e&&(t.appConfigUtils.isRealPage(i,a)?(s=a,!0):void 0)})),s||i.pageStructure.some(((o,n)=>{const a=Object.keys(o)[0];if(a===e)return!1;return!!o[a].some((o=>o!==e&&(t.appConfigUtils.isRealPage(i,o)?(s=o,!0):void 0)))})),!s)return;let n=o.isDefault;n||i.pageStructure.some(((t,o)=>{if(Object.keys(t)[0]===e){return i.pageStructure[o][e].some((e=>{if(i.pages[e].isDefault)return n=!0,!0})),!0}})),t.builderAppSync.publishPageChangeToApp(s),(0,t.getAppConfigAction)().removePage(e,n?s:null).exec()},this.setHomePage=e=>{(0,t.getAppConfigAction)().replaceHomePage(e).exec()},this.duplicatePage=i=>{const o=(0,t.getAppConfigAction)().appConfig,s=(0,t.getAppConfigAction)(),n=s.duplicatePage(i);s.exec();const a=o.pages[i];a.type!==e.PageType.Folder&&a.type!==e.PageType.Link&&this.changeCurrentPage(n.id)},this.duplicateDialog=e=>{const i=(0,t.getAppConfigAction)(),o=i.duplicateDialog(e);i.exec(),this.changeCurrentDialog(o.id)},this.renamePage=(e,i)=>!(!i||""===i)&&((0,t.getAppConfigAction)().editPageProperty(e,"label",i).exec(),this.changeEditablePageId(""),!0),this.orderPageBelowPage=(e,i,o)=>{(0,t.getAppConfigAction)().orderPageToPage(e,i,o).exec()},this.formatMessage=(e,t)=>this.props.intl.formatMessage({id:e,defaultMessage:qe[e]},t),this.addPageWithType=(i,o)=>{let s;const n=(0,t.getAppConfigAction)().appConfig;switch(i){case"page":e.ReactDOM.flushSync((()=>{this.setState({isPageTemplateLoading:!0})})),this.loadPageTemplate(o).then((i=>{e.ReactDOM.flushSync((()=>{this.setState({isPageTemplateLoading:!1})})),s=i,s&&(t.builderAppSync.publishChangeBrowserSizeModeToApp((0,t.getAppConfigAction)().appConfig.mainSizeMode),this.changeEditablePageId(s.id))}));break;case"link":s=(0,e.Immutable)({}).merge({id:e.appConfigUtils.getUniqueId("page"),type:e.PageType.Link,label:e.appConfigUtils.getUniqueLabel(n,"page",this.formatMessage("link")),linkUrl:"#",isVisible:!0}),(0,t.getAppConfigAction)().addPage(s).exec();break;case"folder":s=(0,e.Immutable)({}).merge({id:e.appConfigUtils.getUniqueId("page"),type:e.PageType.Folder,label:e.appConfigUtils.getUniqueLabel(n,"page",this.formatMessage("folder")),isVisible:!0}),(0,t.getAppConfigAction)().addPage(s).exec()}return s&&this.changeEditablePageId(s.id),s},this.changeCurrentDialog=(e,t=!1)=>{(0,s.changeCurrentDialog)(e,t)},this.changeEditableDialogId=e=>{e!==this.state.editableDialogItemId&&this.setState({editableDialogItemId:e})},this.removeDialog=i=>{let o=null;const n=(0,t.getAppConfigAction)().appConfig,a=n.dialogs,r=a[i],{currentDialogId:l}=this.props;if(i===l){let e=null;Object.keys(a).some(((t,i)=>{const s=a[t];if(s.mode===r.mode){if(s.index===r.index-1)return o=s.id,!0;s.index===r.index+1&&(e=s.id)}})),o||(o=e||Object.keys(a).filter((e=>a[e].mode===r.mode&&0===a[e].index&&a[e].id!==i))[0]||Object.keys(a).filter((e=>a[e].mode!==r.mode&&0===a[e].index))[0]);const n=(0,s.handelDialogInfos)(o);t.builderAppSync.publishDialogInfosChangeToApp(n),t.builderAppSync.publishDialogChangeToApp(o)}if((0,t.getAppConfigAction)().removeDialog(i).exec(),!r.isSplash&&r.mode===e.DialogMode.Fixed){t.utils.getPageListByDialogId(n.pages,i).map((e=>{(0,t.getAppConfigAction)().editPageProperty(e.id,"autoOpenDialogId","").exec()}))}},this.setSplashDialog=i=>{const o=(0,t.getAppConfigAction)().appConfig,s=Object.keys(o.dialogs).filter((e=>o.dialogs[e].isSplash))[0],n=(0,e.getAppStore)().getState().appStateInBuilder.appRuntimeInfo.currentDialogId;(0,t.getAppConfigAction)().replaceSplashDialog(i,s).exec(),s===i&&i===n&&this.changeCurrentDialog(i,!0)},this.renameDialog=(e,i)=>!(!i||""===i)&&((0,t.getAppConfigAction)().editDialogProperty(e,"label",i).exec(),this.changeEditableDialogId(""),!0),this.orderDialogBelowDialog=(e,i,o)=>{(0,t.getAppConfigAction)().orderDialogToDialog(e,i,o).exec()},this.addDialog=e=>{this.loadDialogTemplate(e),t.builderAppSync.publishChangeBrowserSizeModeToApp((0,t.getAppConfigAction)().appConfig.mainSizeMode)},this.getUniqueIds=(t,i,o)=>{const s=[];for(let n=0;n<o;n++){const o=e.appConfigUtils.getUniqueId(i);s.push(o),t=t.setIn([i+"s",o],{id:o})}return s},this.getUniqueLabels=(t,i,o)=>{const s=[];for(let n=0;n<o;n++){const o=e.appConfigUtils.getUniqueId(i),n=e.appConfigUtils.getUniqueLabel(t,i,i);s.push(n),t=t.setIn([i+"s",o],{id:o,label:n})}return s},this.changeSelection=e=>{t.builderAppSync.publishChangeSelectionToApp(e)},this.changeContent=e=>{const t=e.id.split(r);this.changeSelection({layoutId:t[0],layoutItemId:t[1],autoScroll:this.props.isScrollingPage})},this.changeView=e=>{const i=e.id.split(r);this.changeSelection({layoutId:i[0],layoutItemId:i[1],autoScroll:this.props.isScrollingPage}),t.builderAppSync.publishSectionNavInfoToApp(i[2],{currentViewId:i[3],useProgress:!1})},this.changeScreen=e=>{const i=e.id.split(r);this.changeSelection({layoutId:i[0],layoutItemId:i[1],autoScroll:this.props.isScrollingPage}),t.builderAppSync.publishScreenGroupNavInfoToApp(i[2],e.index)},this.changeLayout=e=>{},this.getCurrentPageId=()=>{let e;const i=(0,t.getAppConfigAction)().appConfig;return i.pageStructure.some(((o,s)=>{const n=Object.keys(o)[0];if(t.appConfigUtils.isRealPage(i,n))return e=n,!0})),e||i.pageStructure.some(((o,s)=>o[Object.keys(o)[0]].some((o=>{if(t.appConfigUtils.isRealPage(i,o))return e=o,!0})))),t.builderAppSync.publishPageChangeToApp(e),e},this.renderActionBtn=(t,o,s)=>(0,e.jsx)(i.Button,{title:t,size:"sm",className:" rounded-1 icon page-action-btn",onClick:s},(0,e.jsx)(i.Icon,{size:12,icon:o})),this.PageListWrapper=()=>(0,e.jsx)(le,{formatMessage:this.formatMessage,onDefaultClick:this.setHomePage,addPageWithType:this.addPageWithType,isPageTemplateLoading:this.state.isPageTemplateLoading,editablePageItemId:this.state.editablePageItemId,theme:this.props.theme,changeEditablePageItemId:this.changeEditablePageId,currentPageItemId:this.props.currentDialogId?null:this.props.currentPageId,removePage:this.removePage,intl:this.props.intl,duplicatePage:this.duplicatePage,renamePage:this.renamePage,reOrderPage:this.orderPageBelowPage,onClickPage:this.changeCurrentPage,movePageIntoPage:this.movePageIntoPage,browserSizeMode:this.props.browserSizeMode}),this.DialogListWrapper=()=>(0,e.jsx)(ke,{formatMessage:this.formatMessage,forceRefresh:"dialog"===this.state.selectedTabId,onSplashClick:this.setSplashDialog,theme:this.props.theme,intl:this.props.intl,currentDialogItemId:this.props.currentDialogId,addDialog:this.addDialog,removeDialog:this.removeDialog,duplicateDialog:this.duplicateDialog,renameDialog:this.renameDialog,editableDialogItemId:this.state.editableDialogItemId,changeEditableDialogItemId:this.changeEditableDialogId,reOrderDialog:this.orderDialogBelowDialog,onClickDialog:this.changeCurrentDialog}),this.getStyle=t=>{const{pageTocH:i}=this.state;return e.css`
      overflow: hidden;

      .page-toc {
        background-color: ${t.ref.palette.neutral[400]};
        height: ${i>0?`${i}px`:"33%"};

        .page-list,
        .dialog-list{
          height: calc(100% - 10px);
        }
      }

      .outline-toc {
        background-color: ${t.ref.palette.neutral[400]};
        border: 0;
        border-top: 2px solid ${t.ref.palette.neutral[700]};
        height: calc(100% - ${i>0?`${i}px`:"33%"});
      }

    `},this.onTabSelect=e=>{"page"===e&&(0,s.changeCurrentPage)(this.props.currentPageId),this.setState({selectedTabId:e})},this.state={editablePageItemId:"",editableDialogItemId:"",editableOutlineItemId:"",isTemplatePopoverOpen:!1,pageTocH:-1,selectedTabId:null,isPageTemplateLoading:!1},this.resizeRef=e.React.createRef(),this.pageTocRef=e.React.createRef(),this.popoverRef=e.React.createRef()}componentDidMount(){this.resizeRef&&this.resizeRef.current&&(this.interactable=(0,n.interact)(this.resizeRef.current).resizable({edges:{top:!0,left:!1,bottom:!1,right:!1},modifiers:[n.interact.modifiers.restrictEdges({outer:"parent",endOnly:!0}),n.interact.modifiers.restrictSize({min:{width:20,height:100}})],inertia:!1,onstart:e=>{e.stopPropagation()},onmove:e=>{e.stopPropagation(),this.lastResizeCall&&cancelAnimationFrame(this.lastResizeCall);const t=e.rect;let i=0;this.pageTocRef.current&&(i=this.pageTocRef.current.getBoundingClientRect().top);const o=t.top-i;o<100||(this.lastResizeCall=requestAnimationFrame((()=>{this.setState({pageTocH:o})})))},onend:e=>{e.stopPropagation(),this.lastResizeCall&&cancelAnimationFrame(this.lastResizeCall),this.lastResizeCall=requestAnimationFrame((()=>{const t=e.rect;let i=0;this.pageTocRef.current&&(i=this.pageTocRef.current.getBoundingClientRect().top),this.lastResizeCall=requestAnimationFrame((()=>{this.setState({pageTocH:t.top-i})}))}))}}))}componentWillUnmount(){this.lastResizeCall&&cancelAnimationFrame(this.lastResizeCall),this.interactable&&(this.interactable.unset(),this.interactable=null)}loadPageTemplate(e){return Ke(this,void 0,void 0,(function*(){const i=(0,t.getAppConfigAction)().appConfig;return yield this.parsePageTemplate(e,i)}))}parsePageTemplate(i,o){return Ke(this,void 0,void 0,(function*(){if(!i)return yield Promise.resolve(null);(0,e.getAppStore)().dispatch(e.appActions.setIsBusy(!0,e.LoadingType.Primary));let s=(0,t.getAppConfigAction)(o);try{const e=yield s.createPageFromTemplate(i),o=s.appConfig.pages[e];if(!o)return;const n=s.appConfig.set("pageStructure",s.appConfig.pageStructure.concat([{[o.id]:[]}]));return s=(0,t.getAppConfigAction)(n),s.exec(),this.changeCurrentPage(o.id),this.changeEditablePageId(o.id),o}finally{(0,e.getAppStore)().dispatch(e.appActions.setIsBusy(!1))}}))}loadDialogTemplate(e){const i=(0,t.getAppConfigAction)().appConfig;this.parseDialogTemplate(e,i)}parseDialogTemplate(i,o){return Ke(this,void 0,void 0,(function*(){if(i){(0,e.getAppStore)().dispatch(e.appActions.setIsBusy(!0,e.LoadingType.Secondary));try{const e=(0,t.getAppConfigAction)(o),s=yield e.createDialogFromTemplate(i),n=e.appConfig.dialogs[s];return e.exec(),this.changeCurrentDialog(n.id),this.changeEditableDialogId(n.id),n}finally{(0,e.getAppStore)().dispatch(e.appActions.setIsBusy(!1))}}}))}render(){const{PageListWrapper:t,DialogListWrapper:o}=this,{currentPageId:s,currentDialogId:n,browserSizeMode:a}=this.props;let r;return r=n||"dialog"===this.state.selectedTabId?"dialog":"page",(0,e.jsx)("div",{css:this.getStyle(this.props.theme),className:"jimu-widget widget-builder-toc bg-overlay w-100 h-100"},(0,e.jsx)("div",{className:"page-toc",ref:this.pageTocRef},(0,e.jsx)(i.Tabs,{value:r,type:"underline",css:e.css`
          height: 100%;
          .jimu-nav {
            border-bottom: none;
            padding: 12px 1px 5px 1px;
            width: calc(100% - 60px);
            overflow: hidden;
          }
          .tab-content{
            height: calc(100% - 56px);
            overflow-y: inherit !important;
            .tab-pane{
              width: 100%;
            }
          }
          .nav-item {
            margin: 0 1rem;
            &:last-of-type{
              margin-right: 0;
            }
            .nav-link{
              padding: 0.5rem 0.25rem;
            }
          }
        `,onChange:this.onTabSelect},(0,e.jsx)(i.Tab,{id:"page",title:this.formatMessage("page")},(0,e.jsx)("div",{className:"page-list"},(0,e.jsx)(t,null))),(0,e.jsx)(i.Tab,{id:"dialog",title:this.formatMessage("dialog")},(0,e.jsx)("div",{className:"dialog-list"},(0,e.jsx)(o,null))))),(0,e.jsx)("div",{className:"outline-toc",ref:this.resizeRef,role:"group","aria-label":this.formatMessage("outline")},(0,e.jsx)(_e,{formatMessage:this.formatMessage,currentPageId:s,currentDialogId:n,browserSizeMode:a,onClickItem:this.handleOutlineItemClick,editableOutlineItemId:this.state.editableOutlineItemId,theme:this.props.theme,intl:this.props.intl})))}}Ye.mapExtraStateProps=t=>{var i,o,s,n,a,r,l,d,c;const p=null===(o=null===(i=null==t?void 0:t.appStateInBuilder)||void 0===i?void 0:i.appRuntimeInfo)||void 0===o?void 0:o.currentPageId;return{isScrollingPage:(null===(n=null===(s=null==t?void 0:t.appStateInBuilder)||void 0===s?void 0:s.appConfig)||void 0===n?void 0:n.pages[p].mode)===e.PageMode.AutoScroll,currentPageId:p,currentDialogId:null===(r=null===(a=null==t?void 0:t.appStateInBuilder)||void 0===a?void 0:a.appRuntimeInfo)||void 0===r?void 0:r.currentDialogId,browserSizeMode:null===(l=null==t?void 0:t.appStateInBuilder)||void 0===l?void 0:l.browserSizeMode,dialogInfos:null===(c=null===(d=null==t?void 0:t.appStateInBuilder)||void 0===d?void 0:d.appRuntimeInfo)||void 0===c?void 0:c.dialogInfos}};const Xe=Ye;function Qe(e){c.p=e}})(),p})())}}}));