"use strict";
const common_vendor = require("../common/vendor.js");
const SYSTEM_WINDOW_INFO = common_vendor.index.getWindowInfo();
const MENU_BUTTON_INFO = common_vendor.index.getMenuButtonBoundingClientRect ? common_vendor.index.getMenuButtonBoundingClientRect() : {};
const statusBarHeight = SYSTEM_WINDOW_INFO.statusBarHeight || 0;
const titleBarHeight = !MENU_BUTTON_INFO.height || !MENU_BUTTON_INFO.top ? 40 : MENU_BUTTON_INFO.height + (MENU_BUTTON_INFO.top - statusBarHeight) * 2;
const navBarHeight = statusBarHeight + titleBarHeight;
exports.navBarHeight = navBarHeight;
exports.statusBarHeight = statusBarHeight;
exports.titleBarHeight = titleBarHeight;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/system.js.map
