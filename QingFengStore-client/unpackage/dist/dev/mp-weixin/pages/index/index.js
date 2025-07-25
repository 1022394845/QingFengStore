"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (CommonNavBar + CommonSearch)();
}
const CommonNavBar = () => "../../components/CommonNavBar.js";
const CommonSearch = () => "../../components/CommonSearch.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "首页",
          titleColor: "#ffffff"
        }),
        b: common_vendor.p({
          placeholder: "请输入商品名称"
        }),
        c: common_vendor.f(50, (item, k0, i0) => {
          return {
            a: common_vendor.t(item)
          };
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
