"use strict";
const common_vendor = require("../common/vendor.js");
const utils_system = require("../utils/system.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  _easycom_uni_easyinput2();
}
const _easycom_uni_easyinput = () => "../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  _easycom_uni_easyinput();
}
const _sfc_main = {
  __name: "CommonSearch",
  props: {
    placeholder: {
      type: String,
      default: "请输入内容"
    }
  },
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "9c93c18c": common_vendor.unref(utils_system.navBarHeight_px)
    }));
    const search = common_vendor.ref("");
    const onSearch = () => {
      console.log(search.value);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(onSearch),
        b: common_vendor.o(onSearch),
        c: common_vendor.o(common_vendor.m(($event) => search.value = $event, {
          trim: true
        }, true)),
        d: common_vendor.p({
          suffixIcon: "search",
          placeholder: __props.placeholder,
          modelValue: search.value
        }),
        e: common_vendor.s(_ctx.__cssVars())
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-12fddf87"]]);
wx.createComponent(Component);
