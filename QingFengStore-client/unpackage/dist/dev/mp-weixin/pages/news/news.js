"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  CommonNavBar();
}
const CommonNavBar = () => "../../components/CommonNavBar.js";
const _sfc_main = {
  __name: "news",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "资讯",
          titleColor: "#ffffff"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
