(this.webpackJsonpimg = this.webpackJsonpimg || []).push([
    [0], {
        18: function (e, n) {},
        19: function (e, n) {},
        20: function (e, n) {},
        22: function (e, n, t) {},
        27: function (e, n, t) {
            "use strict";
            t.r(n);
            var a = t(0),
                c = t.n(a),
                i = t(3),
                o = t.n(i),
                u = t(4),
                r = t.n(u),
                m = (t(21), t(22), t(23)),
                s = t(24),
                l = t(25),
                p = t(26),
                h = function (e) {
                    var n = e.getImg,
                        t = e.url,
                        i = e.size,
                        o = Object(a.useRef)(null),
                        u = {
                            loadImage: {
                                path: t,
                                name: "editor image"
                            },
                            theme: {
                                "menu.normalIcon.path": p,
                                "menu.activeIcon.path": s,
                                "menu.disabledIcon.path": m,
                                "menu.hoverIcon.path": l,
                                "submenu.normalIcon.path": p,
                                "submenu.activeIcon.path": s,
                                "header.display": "none"
                            },
                            menu: ["text", "crop", "draw", "shape", "icon"],
                            initMenu: "text",
                            uiSize: i
                        };
                    return c.a.createElement("div", {
                        className: "App"
                    }, c.a.createElement(r.a, {
                        ref: o,
                        includeUI: u,
                        usageStatistics: !1
                    }), c.a.createElement("button", {
                        className: "shareIcon edit--share--icon",
                        onClick: function () {
                            var e = o.current.getInstance().toDataURL();
                            n(e)
                        }
                    }, c.a.createElement('span', {
                        className: "lui-icon lui-icon--share"
                    })))
                };
            window.editImg = function (e, n, t, a) {
                o.a.render(c.a.createElement(h, {
                    getImg: a,
                    url: n,
                    size: t
                }), document.getElementById(e))
            }
        },
        5: function (e, n, t) {
            e.exports = t(27)
        }
    },
    [
        [5, 1, 2]
    ]
]);