"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  CommonNavBar();
}
const CommonNavBar = () => "../../components/CommonNavBar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "首页"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
