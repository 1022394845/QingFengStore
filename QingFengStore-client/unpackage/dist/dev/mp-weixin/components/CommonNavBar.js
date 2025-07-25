"use strict";
const common_vendor = require("../common/vendor.js");
const utils_system = require("../utils/system.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "CommonNavBar",
  props: {
    title: {
      type: String,
      default: "清风商城"
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: `${common_vendor.unref(utils_system.statusBarHeight)}px`,
        b: common_vendor.p({
          type: "back",
          size: "30"
        }),
        c: common_vendor.t(__props.title),
        d: `${common_vendor.unref(utils_system.titleBarHeight)}px`,
        e: `${common_vendor.unref(utils_system.navBarHeight)}px`
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9362ca18"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/CommonNavBar.js.map
