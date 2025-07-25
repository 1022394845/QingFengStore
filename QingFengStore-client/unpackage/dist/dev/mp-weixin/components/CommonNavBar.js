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
    },
    titleColor: {
      type: String,
      default: "#000000"
    }
  },
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "23e2b970": common_vendor.unref(utils_system.statusBarHeight_px),
      "5591a694": common_vendor.unref(utils_system.titleBarHeight_px),
      "103086c2": common_vendor.unref(utils_system.navBarHeight_px)
    }));
    const showBack = getCurrentPages().length > 1;
    const navBack = () => {
      common_vendor.index.navigateBack({
        fail: () => {
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showBack
      }, showBack ? {
        b: common_vendor.p({
          type: "back",
          size: "28",
          color: __props.titleColor
        }),
        c: common_vendor.o(navBack)
      } : {}, {
        d: common_vendor.t(__props.title),
        e: __props.titleColor,
        f: showBack ? "center" : "left",
        g: common_vendor.s(_ctx.__cssVars())
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9362ca18"]]);
wx.createComponent(Component);
