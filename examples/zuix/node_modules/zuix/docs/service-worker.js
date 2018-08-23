/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "app/content/api/api_template.css",
    "revision": "61474ac5fc5b338a98f960811cd01194"
  },
  {
    "url": "app/content/api/api_template.html",
    "revision": "e969389732c602102897181a8496b1ad"
  },
  {
    "url": "app/content/api/api_template.js",
    "revision": "31ebcceb3611dbe0a5cb429831485e4c"
  },
  {
    "url": "app/content/api/data/ComponentCache.json",
    "revision": "32ae65562c7d0f14dd071833a5ea8194"
  },
  {
    "url": "app/content/api/data/ComponentContext.json",
    "revision": "d2a1249b1b49bc16f146f81a19cb6c2a"
  },
  {
    "url": "app/content/api/data/ContextController.json",
    "revision": "68eb64b0986d8f2684e59233ee70e8d0"
  },
  {
    "url": "app/content/api/data/Localizer.json",
    "revision": "64c7ececaa90db2712cafd081214023d"
  },
  {
    "url": "app/content/api/data/Zuix.json",
    "revision": "54c0f8f78b2f384a063d12da3b1e1f83"
  },
  {
    "url": "app/content/api/data/ZxQuery.json",
    "revision": "7fb3644d4d0e70b1b2a045be03bbbc1f"
  },
  {
    "url": "app/content/docs/examples/alice/ch_1.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/docs/examples/alice/ch_2.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/docs/examples/alice/ch_3.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/docs/examples/links.css",
    "revision": "300f68df4ae2415d93a52a566b256dbf"
  },
  {
    "url": "app/content/docs/examples/links.html",
    "revision": "b9d9dd3877f514fb4a90a4d14daef5fd"
  },
  {
    "url": "app/templates/mdl_card.css",
    "revision": "a64525215fefa93fb3c2fe40c48bea02"
  },
  {
    "url": "app/templates/mdl_card.html",
    "revision": "ecaa9aeb44f0e845c1f42a641f02b45c"
  },
  {
    "url": "blog/20180718.html",
    "revision": "9b35bb409b836f07b3821240d2908e97"
  },
  {
    "url": "blog/20180722.html",
    "revision": "460a706726acbaa34b53597951e42cc2"
  },
  {
    "url": "blog/20180726.html",
    "revision": "7f04856c21e6f20b291ce69cde4d5e1d"
  },
  {
    "url": "blog/20180728.html",
    "revision": "19d916bc5d396353f8ba714fbc56b4e2"
  },
  {
    "url": "blog/20180801.html",
    "revision": "ceef1b5f0db98461946adae41bef6b65"
  },
  {
    "url": "blog/README.html",
    "revision": "7912b20e19c6d4a1da66b495fa6a9433"
  },
  {
    "url": "config.js",
    "revision": "b3f927651bc0af878c86cbcb5e980b50"
  },
  {
    "url": "css/flex-layout-attribute.min.css",
    "revision": "c55488315343d9afb4d13ebf9cc8f97b"
  },
  {
    "url": "index.css",
    "revision": "588f075779ca17aa0b949aba18a12493"
  },
  {
    "url": "index.html",
    "revision": "bf3000c9fc30ae6ff37b64f51252f3d9"
  },
  {
    "url": "index.js",
    "revision": "5e92cab97bd1f881fd464e686025d3b1"
  },
  {
    "url": "js/animate-3.5.2.min.css",
    "revision": "178b651958ceff556cbc5f355e08bbf1"
  },
  {
    "url": "js/mdl/material.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/mdl/material.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/mdl/material.min.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/mdl/material.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/prism/clipboard.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/prism/prism.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/prism/prism.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/showdown.min.js",
    "revision": "6101622ce87d86b59560aebb6574105c"
  },
  {
    "url": "js/zuix-bundler.js",
    "revision": "049ef0a061acdc17668974f93a68c01f"
  },
  {
    "url": "js/zuix-bundler.min.js",
    "revision": "c4e4d35ef0ae605ed92ab28c1665656c"
  },
  {
    "url": "js/zuix.js",
    "revision": "46c1709514818ce94b7f8b48cb5e2ed3"
  },
  {
    "url": "js/zuix.min.js",
    "revision": "91d25db55cab906cb04eb37aa8e6f4be"
  },
  {
    "url": "js/zuix/zuix-bundler.js",
    "revision": "049ef0a061acdc17668974f93a68c01f"
  },
  {
    "url": "js/zuix/zuix-bundler.min.js",
    "revision": "c4e4d35ef0ae605ed92ab28c1665656c"
  },
  {
    "url": "js/zuix/zuix.js",
    "revision": "46c1709514818ce94b7f8b48cb5e2ed3"
  },
  {
    "url": "js/zuix/zuix.min.js",
    "revision": "91d25db55cab906cb04eb37aa8e6f4be"
  },
  {
    "url": "manifest.json",
    "revision": "fac3401654e32b3003f57571497bdbec"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_1_1.png",
    "revision": "f13e634f4f4767f426a791ddf85ba9b0"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_1_2.png",
    "revision": "a40e24033ce25edb5169d5f50a1783d7"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_1_3.png",
    "revision": "9325671498a60f3e05c6bfdcb6001bac"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_2_1.png",
    "revision": "ffd9b2ce17eb5cf4b6e0c2e88128e7bc"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_2_2.png",
    "revision": "c0aa4864727b53a82614fb098c286bca"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_2_3.png",
    "revision": "45b8f2b32fa463cbbf478693354bb676"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_2_4.png",
    "revision": "5175980071714ec946d815b4180b23bc"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_3_1.png",
    "revision": "0b58afb90669a0c00dd796f64872b141"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_3_2.png",
    "revision": "6f21a396f2c8b7f3a5a884dc9a8932c0"
  },
  {
    "url": "app/content/docs/examples/images/avatar_01.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/docs/examples/images/avatar_02.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/docs/examples/images/avatar_03.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/docs/examples/images/card_cover_2.jpg",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/docs/examples/images/card_cover.jpg",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/docs/examples/images/card_placeholder.jpg",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/docs/examples/images/cover_javascript.jpg",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/docs/examples/images/cover_recipes.jpg",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/api.png",
    "revision": "ba62975c85636fe9b08d5f842c2023f0"
  },
  {
    "url": "images/documentation.png",
    "revision": "d3ca9f4ad8b31f6f4141cb594e99ddc3"
  },
  {
    "url": "images/example_picture.jpg",
    "revision": "fe07f5b3ad3fea33162d35fe96e5ed6d"
  },
  {
    "url": "images/icons/desktop/android-chrome-192x192.png",
    "revision": "93d5e77e9ee1e9c6975f3c0bd1a21574"
  },
  {
    "url": "images/icons/desktop/android-chrome-512x512.png",
    "revision": "6df83c6c13be17a2ea70d29e340c5ddb"
  },
  {
    "url": "images/icons/desktop/apple-touch-icon.png",
    "revision": "2b78ed332644d19d9779c069c5842538"
  },
  {
    "url": "images/icons/desktop/favicon-16x16.png",
    "revision": "6c047cdbd3d5c4c962a3a692a5025d27"
  },
  {
    "url": "images/icons/desktop/favicon-32x32.png",
    "revision": "7413528d5e59c22af1ccf38187bc950b"
  },
  {
    "url": "images/icons/desktop/mstile-150x150.png",
    "revision": "540caa78f56655281b2d4b17ad52f2ce"
  },
  {
    "url": "images/icons/desktop/safari-pinned-tab.svg",
    "revision": "a0ab2c612c6a5019b3e4ae7c38043b98"
  },
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/image_place_holder.png",
    "revision": "587f8d42c812f26f176b2e3b45514614"
  },
  {
    "url": "images/wallpaper.jpg",
    "revision": "7885e42f532c3e40db3cfbff68e42c56"
  },
  {
    "url": "images/zuix_web_starter.png",
    "revision": "7d3fc094f12897efebda1109d55b9721"
  },
  {
    "url": "images/zuix-logo.svg",
    "revision": "cd8baa13270a24886c2f335322aa4814"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|svg)$/, workbox.strategies.cacheFirst({ cacheName: "images", plugins: [new workbox.expiration.Plugin({"maxEntries":50,"purgeOnQuotaError":false})] }), 'GET');
workbox.routing.registerRoute(/\.(?:html|json|js|css)$/, workbox.strategies.cacheFirst({ cacheName: "default", plugins: [new workbox.expiration.Plugin({"maxEntries":50,"purgeOnQuotaError":false})] }), 'GET');
