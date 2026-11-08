// 构建 jike2md bookmarklet 安装页：读取 jike2md.src.js，编码为 javascript: URL，
// 生成 index.html —— 面向开源场景的三步引导式安装页（中英双语，可切换）。
// 品牌主色：即刻黄（呼应宿主平台），CTA 用黄底深字保证对比度。
// 用法：node build.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync(new URL('./jike2md.src.js', import.meta.url), 'utf8');
const bm = 'javascript:' + encodeURIComponent(src);
// encodeURIComponent 不会输出裸的 & " < >，此处仅作防御性转义
const attr = bm.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
// 源码透明区块用（HTML 转义）
const srcEsc = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- 中英文案（页面默认渲染中文；EN 随浏览器语言自动选择，可手动切换并记忆） ----------
const T = {
  zh: {
    title: 'jike2md · 一键导出即刻动态为 Markdown',
    h1: '即刻作者动态，<span class="acc">一键变 Markdown</span>',
    sub: '在作者主页点一下书签，TA 发过的每一条动态立刻成为一个 .md 文件 —— 留存、回顾、检索，或导入 NotebookLM 等任何工具，怎么用由你决定。',
    flow1: '打开作者主页', flow2: '点一下书签', flow3: 'markdown到手',
    f1t: '一次点击，全量导出', f1d: '自动翻页抓取该作者的全部动态，含图片链接、原文链接；转发的帖子会附上被转原文。',
    f2t: '零安装负担', f2d: '不上应用商店、不装扩展：往书签栏拖一次就能用。即刻若调整接口，重新拖一次即可。',
    f3t: '数据不出你的浏览器', f3d: 'token 取自你自己的登录态，请求只发往即刻官方接口，全程没有第三方服务器。',
    f4t: '单文件源码可审计', f4d: '全部逻辑就在一个源码文件里，本页可直接展开查看，安装前逐行检查。',
    h2: '三步安装（约 1 分钟，只需一次）',
    s1t: '显示书签栏',
    s1b: '在浏览器里按 <kbd id="shortcut">Ctrl + Shift + B</kbd>，让书签栏显示出来（已显示可跳过）。',
    s2t: '把黄色按钮拖进书签栏',
    s2b: '按住下面的按钮，拖到浏览器上方的书签栏里松手：',
    s2hint: '拖不动或不喜欢拖拽？用手动方式，效果完全一样。',
    clickTip: '这里需要拖拽而不是点击 —— 拖到书签栏即完成安装。',
    manualSum: '手动安装（复制代码建书签）',
    manualBody: '右键书签栏 → 「添加网页」，名称随意（如 <code>jike2md</code>），点下面的按钮复制书签代码，粘贴到网址栏：',
    copyBtn: '复制代码',
    prefixNote: '注意：部分浏览器往地址栏粘贴时会自动剥掉开头的 <code>javascript:</code> 前缀 —— 请在「添加网页」弹窗的网址栏里粘贴，并确认开头是 <code>javascript:</code>。',
    s3t: '打开一个即刻作者主页，点书签试一次',
    s3b1: '先在浏览器登录 <a href="https://web.okjike.com/" target="_blank" rel="noopener">web.okjike.com</a>，然后进入任意作者主页（地址形如 <code>web.okjike.com/u/…</code>）。',
    s3b2: '点书签栏上的「jike2md」→ 右上角出现进度浮层，逐页抓取 → 完成后浏览器自动下载 <code>jike-作者名-日期.md</code>。',
    s3link: '去即刻找个作者主页试试 →',
    tail: '以后每次使用：打开作者主页 → 点书签 → 拿文件。就这一步。',
    faqH: '常见问题',
    thQ: '现象', thA: '原因与解决',
    tblCap: '常见问题与解决方法',
    q1: '点了书签毫无反应',
    a1: '书签只能在 <code>web.okjike.com</code> 页面上工作；且需确认书签网址以 <code>javascript:</code> 开头（粘贴时前缀可能被浏览器剥掉，手动补上）。',
    q2: '浮层提示 token 无效 / 已过期',
    a2: '刷新 jike 页面（或退出重登）再点一次即可 —— token 取自你登录后的浏览器本地存储。',
    q3: '导出的条数比作者主页显示的少',
    a3: '确认停留在该作者的主页上再点击（脚本按当前页地址自动识别作者）；「转发且未写评论」的条目会以引用块附上原文，不会丢条。',
    q4: '我的数据安全吗？',
    a4: 'token 读自你自己浏览器的 localStorage，请求<b>只发往即刻官方接口</b> api.ruguoapp.com，不经任何第三方服务器；导出文件直接从浏览器下载。',
    q5: '导出到一半可以停吗？',
    a5: '不能中途停止 —— 关闭标签页会丢失已抓内容。动态较多的作者需要几十秒，等浮层提示完成即可。',
    srcH: '源码（透明可审计）',
    srcNote: '这就是书签里那段代码的可读形式 —— 和上面「复制代码」拿到的是同一段逻辑，一个可读、一个已压缩编码。也可以直接查看仓库里的 <code>jike2md.src.js</code>。',
    srcSum: '展开查看完整源码',
    footer: 'jike2md · 数据不出你的浏览器 · 单文件源码，可展开查看',
    mobile: '请在电脑浏览器的书签栏中使用 —— 手机浏览器不支持书签。',
    legalH: '使用边界',
    legal1: '本工具是个人开源项目，<b>与即刻官方无隶属关系</b>。',
    legal2: '请仅用于导出你自己的内容，或已获作者授权的内容。导出文件的著作权归原发帖作者，请勿公开传播或用于商业用途。使用本工具即表示你自行承担相关责任。',
    copied: '已复制，去书签栏右键 → 添加网页 → 粘贴',
    copyFail: '复制失败：请刷新页面重试，或改用拖拽方式安装',
  },
  en: {
    title: 'jike2md · Export Jike posts to Markdown in one click',
    h1: 'An author\'s entire Jike feed, <span class="acc">one click to Markdown</span>',
    sub: 'Click a bookmark on any author\'s profile and every post they\'ve made becomes a single .md file — keep it, revisit it, search it, or import it into NotebookLM or anything else. Your call.',
    flow1: 'Open the author\'s profile', flow2: 'Click the bookmark', flow3: 'Get the markdown',
    f1t: 'One click, full export', f1d: 'Auto-paginates through every post of that author, with image and source links; reposts include the original content.',
    f2t: 'Zero install burden', f2d: 'No app store, no extension: drag it onto your bookmarks bar once and it works. If Jike changes its API, drag it again.',
    f3t: 'Data never leaves your browser', f3d: 'The token comes from your own login; requests go only to Jike\'s official API. No third-party servers involved.',
    f4t: 'Single-file, auditable source', f4d: 'All logic lives in one source file — expand it right on this page and review it line by line before installing.',
    h2: 'Set up in 3 steps (about a minute, once only)',
    s1t: 'Show the bookmarks bar',
    s1b: 'In your browser, press <kbd id="shortcut">Ctrl + Shift + B</kbd> to show the bookmarks bar (skip if it\'s already visible).',
    s2t: 'Drag the yellow button onto the bar',
    s2b: 'Press and hold the button below, drag it onto the bookmarks bar at the top of the browser, and release:',
    s2hint: 'Can\'t drag, or prefer not to? The manual way below works exactly the same.',
    clickTip: 'This one takes a drag, not a click — drop it on the bookmarks bar to install.',
    manualSum: 'Manual install (copy code, create bookmark)',
    manualBody: 'Right-click the bookmarks bar → "Add page", name it anything (e.g. <code>jike2md</code>), then click the button below to copy the code and paste it into the URL field:',
    copyBtn: 'Copy code',
    prefixNote: 'Note: some browsers strip the leading <code>javascript:</code> prefix when you paste into the address bar — paste into the URL field of the "Add page" dialog and make sure it starts with <code>javascript:</code>.',
    s3t: 'Open a Jike author profile and try it once',
    s3b1: 'Sign in to <a href="https://web.okjike.com/" target="_blank" rel="noopener">web.okjike.com</a> in your browser first, then open any author\'s profile (a URL like <code>web.okjike.com/u/…</code>).',
    s3b2: 'Click "jike2md" on the bookmarks bar → a progress overlay appears at the top right, fetching page by page → the browser downloads <code>jike-&lt;author&gt;-&lt;date&gt;.md</code> when done.',
    s3link: 'Try it on a Jike author\'s profile →',
    tail: 'Every time after that: open a profile → click the bookmark → get the file. That\'s it.',
    faqH: 'FAQ',
    thQ: 'Symptom', thA: 'Cause & fix',
    tblCap: 'Frequently asked questions',
    q1: 'Nothing happens when I click the bookmark',
    a1: 'It only works on <code>web.okjike.com</code> pages; also make sure the bookmark URL starts with <code>javascript:</code> (the prefix may get stripped when pasting — add it back manually).',
    q2: 'The overlay says the token is invalid / expired',
    a2: 'Refresh the Jike page (or sign in again) and click once more — the token comes from your browser\'s local login state.',
    q3: 'Fewer posts than shown on the profile',
    a3: 'Make sure you\'re on that author\'s profile when you click (the author is read from the current URL); reposts without a comment include the quoted original, so no posts are lost.',
    q4: 'Is my data safe?',
    a4: 'The token is read from your own browser\'s localStorage and requests go <b>only to Jike\'s official API</b> (api.ruguoapp.com) — no third-party servers; the file downloads straight from the browser.',
    q5: 'Can I stop an export midway?',
    a5: 'No — closing the tab discards everything fetched so far. Prolific authors take under a minute; wait for the overlay to confirm it is done.',
    srcH: 'Source (transparent & auditable)',
    srcNote: 'This is the readable form of the code inside the bookmark — same logic as what the "Copy code" button above gives you, one readable and one URI-encoded. You can also read <code>jike2md.src.js</code> in the repo.',
    srcSum: 'Expand to view the full source',
    footer: 'jike2md · Your data never leaves your browser · Single-file source, view it right here',
    mobile: 'Use this from a desktop browser\'s bookmarks bar — mobile browsers do not support bookmarks.',
    legalH: 'Usage boundaries',
    legal1: 'This is a personal open-source project, <b>not affiliated with Jike in any way</b>.',
    legal2: 'Use it only to export your own content, or content you have permission to export. Copyright in exported posts belongs to their authors — please do not redistribute or use commercially. By using this tool you accept responsibility for how you use it.',
    copied: 'Copied — right-click the bookmarks bar → Add page → paste',
    copyFail: 'Copy failed — refresh the page and try again, or drag the button to your bookmarks bar instead',
  },
};
// 防御：文案若含 </script 会提前闭合内联脚本。JSON 里 < 与 \u003c 等价，转义后浏览器解析结果不变
const dictJson = JSON.stringify(T).replace(/</g, '\\u003c');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>jike2md · 一键导出即刻动态为 Markdown</title>
<meta name="description" content="jike2md：在即刻作者主页点一下书签，把 TA 的全部动态导出为一个 Markdown 文件。纯浏览器本地运行，token 与数据不经过任何第三方服务器。">
<meta name="theme-color" content="#151412">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%231e1c18'/%3E%3Cpath d='M36 26 H64 A6 6 0 0 1 70 32 V74 L50 60 L30 74 V32 A6 6 0 0 1 36 26 Z' fill='none' stroke='%23ffd23f' stroke-width='9' stroke-linejoin='round'/%3E%3C/svg%3E">
<meta property="og:type" content="website">
<meta property="og:url" content="https://jike2md.wozai.online/">
<meta property="og:title" content="jike2md · 一键导出即刻动态为 Markdown">
<meta property="og:description" content="在即刻作者主页点一下书签，把 TA 的全部动态导出为一个 Markdown 文件。纯浏览器本地运行，不经过任何第三方服务器。">
<meta name="twitter:card" content="summary">
<style>
  :root {
    color-scheme: dark;
    --bg: #151412; --panel: #1e1c18; --panel2: #262319; --line: #332f24;
    --text: #eceef1; --text-dim: #c9c6bd; --mut: #a09a8c;
    --acc: #ffd23f;         /* 即刻黄（品牌主色） */
    --acc-deep: #f0b429;    /* 按钮描边等深一档 */
    --acc-ink: #1a1405;     /* 黄底上的深色文字 */
    --line-soft: #454030;   /* kbd 与次按钮描边 */
    --line-hover: #4a4331;  /* 卡片 hover 描边 */
    --code-bg: #101010; --code-ink: #ffe08a;
    --glow: #332a12;        /* 首屏光晕 */
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 0 20px 90px;
    font: 15px/1.75 -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif;
    color: var(--text);
    background: radial-gradient(900px 420px at 50% -120px, var(--glow) 0%, var(--bg) 62%) fixed var(--bg);
  }
  .wrap { max-width: 780px; margin: 0 auto; }
  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
  }
  :focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }

  .langbtn { position: fixed; top: 14px; right: 16px; z-index: 50; display: inline-flex; align-items: center; justify-content: center; min-height: 44px; background: var(--panel2); border: 1px solid var(--line); color: var(--mut); border-radius: 999px; padding: 0 16px; font-size: 13px; cursor: pointer; }
  .langbtn:hover { border-color: var(--acc); color: var(--acc); }

  /* ---------- 首屏：品牌与价值主张 ---------- */
  header { text-align: center; padding: 60px 0 8px; }
  .logo {
    display: inline-flex; align-items: center; gap: 9px;
    background: rgba(255, 210, 63, .08);
    border: 1px solid var(--acc); border-radius: 999px; padding: 9px 24px;
    font-size: 19px; font-weight: 700; letter-spacing: 2px; color: var(--acc);
  }
  .logo svg { display: block; }
  h1 { font-size: 34px; line-height: 1.3; margin: 22px 0 12px; }
  h1 .acc { color: var(--acc); }
  .sub { color: var(--mut); font-size: 16px; max-width: 600px; margin: 0 auto; }
  .flow { display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap; margin: 28px 0 0; }
  .flow span { background: var(--panel2); border: 1px solid var(--line); border-radius: 10px; padding: 8px 18px; font-size: 14px; }
  .flow .arr { color: var(--acc); font-size: 16px; padding: 0; border: none; background: none; }

  /* ---------- 卖点四宫格：图标与标题同行 ---------- */
  .feats { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: 14px; margin: 40px 0 0; }
  .feat { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 18px 20px; }
  .feat b { display: flex; align-items: center; gap: 10px; margin: 0 0 4px; font-size: 15px; }
  .fi { display: inline-flex; width: 20px; height: 20px; color: var(--acc); flex: none; }
  .fi svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .feat p { margin: 0; color: var(--mut); font-size: 13px; }

  /* ---------- 步骤 ---------- */
  h2 { font-size: 20px; margin: 60px 0 4px; }
  .step { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 22px 26px; margin-top: 16px; }
  .step:hover { border-color: var(--line-hover); }
  .step h3 { margin: 0 0 10px; font-size: 16px; }
  .step h3 .no { display: inline-block; width: 26px; height: 26px; line-height: 26px; text-align: center; background: var(--acc); color: var(--acc-ink); border-radius: 50%; font-size: 14px; font-weight: 600; margin-right: 10px; }
  kbd { background: var(--panel2); border: 1px solid var(--line-soft); border-bottom-width: 2px; border-radius: 6px; padding: 1px 8px; font: 13px monospace; }

  /* ---------- 拖拽按钮：黄底深字，品牌记忆点 ---------- */
  #bm {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--acc); color: var(--acc-ink); padding: 14px 26px; border-radius: 12px;
    text-decoration: none; font-weight: 600; font-size: 17px; border: 1px solid var(--acc-deep);
  }
  #bm svg { display: block; pointer-events: none; }
  #bm:hover { filter: brightness(1.05); }
  .bmrow { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  details { margin-top: 14px; }
  summary { cursor: pointer; color: var(--acc); padding: 9px 0; }
  #srcview { background: var(--code-bg); border: 1px solid var(--line); border-radius: 8px; padding: 14px; font: 12px/1.6 monospace; color: var(--code-ink); overflow: auto; white-space: pre; }
  button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 16px; border-radius: 8px; border: 1px solid var(--line-soft); background: var(--panel2); color: var(--text); cursor: pointer; }
  button:hover { border-color: var(--acc); color: var(--acc); }
  #hint { color: var(--acc); font-size: 13px; margin-left: 10px; }
  a { color: var(--acc); }
  a:hover { text-decoration: underline; }
  code { background: var(--panel2); padding: 1px 6px; border-radius: 4px; font-size: 13px; }
  .note { color: var(--mut); font-size: 13px; }

  /* ---------- 使用边界 ---------- */
  .legal { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 18px 22px; margin-top: 12px; }
  .legal p { margin: 0 0 10px; color: var(--mut); font-size: 13px; line-height: 1.7; }
  .legal p:last-child { margin-bottom: 0; }
  .legal b { color: var(--text); }

  /* ---------- FAQ ---------- */
  table { border-collapse: collapse; width: 100%; margin-top: 12px; }
  th, td { border: 1px solid var(--line); padding: 10px 14px; text-align: left; font-size: 14px; vertical-align: top; }
  th { background: var(--panel2); white-space: nowrap; }
  td { color: var(--text-dim); }

  footer { margin-top: 64px; color: var(--mut); font-size: 13px; border-top: 1px solid var(--line); padding-top: 18px; }
</style>
</head>
<body>
<main class="wrap">

<button id="langbtn" class="langbtn" type="button" aria-label="切换界面语言 / Switch language">EN</button>

<header>
  <div class="logo"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><path d="M6 2.5h8a1.2 1.2 0 0 1 1.2 1.2v13.8l-5.2-3.4-5.2 3.4V3.7A1.2 1.2 0 0 1 6 2.5z" fill="currentColor"/></svg>jike2md</div>
  <h1 data-i18n="h1">即刻作者动态，<span class="acc">一键变 Markdown</span></h1>
  <p class="sub" data-i18n="sub">在作者主页点一下书签，TA 发过的每一条动态立刻成为一个 .md 文件 —— 留存、回顾、检索，或导入 NotebookLM 等任何工具，怎么用由你决定。</p>
  <div class="flow">
    <span data-i18n="flow1">打开作者主页</span><span class="arr">→</span>
    <span data-i18n="flow2">点一下书签</span><span class="arr">→</span>
    <span data-i18n="flow3">markdown到手</span>
  </div>
  <p class="note" style="margin-top:16px" data-i18n="mobile">请在电脑浏览器的书签栏中使用 —— 手机浏览器不支持书签。</p>
</header>

<section class="feats">
  <div class="feat">
    <b><span class="fi"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 2.8v9.2"/><path d="M6.4 8.6 10 12.2l3.6-3.6"/><path d="M4 15.4v1.1A1.5 1.5 0 0 0 5.5 18h9a1.5 1.5 0 0 0 1.5-1.5v-1.1"/></svg></span><span data-i18n="f1t">一次点击，全量导出</span></b>
    <p data-i18n="f1d">自动翻页抓取该作者的全部动态，含图片链接、原文链接；转发的帖子会附上被转原文。</p>
  </div>
  <div class="feat">
    <b><span class="fi"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M5.6 2.8h8.8a1 1 0 0 1 1 1v13.4l-5.4-3.6-5.4 3.6V3.8a1 1 0 0 1 1-1z"/></svg></span><span data-i18n="f2t">零安装负担</span></b>
    <p data-i18n="f2d">不上应用商店、不装扩展：往书签栏拖一次就能用。即刻若调整接口，重新拖一次即可。</p>
  </div>
  <div class="feat">
    <b><span class="fi"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><rect x="4.4" y="8.8" width="11.2" height="8.2" rx="1.6"/><path d="M7 8.8V6.4a3 3 0 0 1 6 0v2.4"/></svg></span><span data-i18n="f3t">数据不出你的浏览器</span></b>
    <p data-i18n="f3d">token 取自你自己的登录态，请求只发往即刻官方接口，全程没有第三方服务器。</p>
  </div>
  <div class="feat">
    <b><span class="fi"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6 2.8h5.6L15.4 6.6V16a1.2 1.2 0 0 1-1.2 1.2H6A1.2 1.2 0 0 1 4.8 16V4A1.2 1.2 0 0 1 6 2.8z"/><path d="M11.5 2.8v3.9h3.9"/><path d="M7.4 12.2l1.7 1.7 3.1-3.4"/></svg></span><span data-i18n="f4t">单文件源码可审计</span></b>
    <p data-i18n="f4d">全部逻辑就在一个源码文件里，本页可直接展开查看，安装前逐行检查。</p>
  </div>
</section>

<h2 data-i18n="h2">三步安装（约 1 分钟，只需一次）</h2>

<div class="step">
  <h3><span class="no">1</span><span data-i18n="s1t">显示书签栏</span></h3>
  <p data-i18n="s1b">在浏览器里按 <kbd id="shortcut">Ctrl + Shift + B</kbd>，让书签栏显示出来（已显示可跳过）。</p>
</div>

<div class="step">
  <h3><span class="no">2</span><span data-i18n="s2t">把黄色按钮拖进书签栏</span></h3>
  <p data-i18n="s2b">按住下面的按钮，拖到浏览器上方的书签栏里松手：</p>
  <p class="bmrow"><a id="bm" href="${attr}"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false"><path d="M6 2.5h8a1.2 1.2 0 0 1 1.2 1.2v13.8l-5.2-3.4-5.2 3.4V3.7A1.2 1.2 0 0 1 6 2.5z" fill="currentColor"/></svg>jike2md</a><span class="note" id="clickTip" role="status" style="color:var(--acc)" hidden></span></p>
  <p class="note" data-i18n="s2hint">拖不动或不喜欢拖拽？用手动方式，效果完全一样。</p>
  <details>
    <summary data-i18n="manualSum">手动安装（复制代码建书签）</summary>
    <p style="margin-bottom:6px" data-i18n="manualBody">右键书签栏 → 「添加网页」，名称随意（如 <code>jike2md</code>），点下面的按钮复制书签代码，粘贴到网址栏：</p>
    <p><button id="copy" data-i18n="copyBtn">复制代码</button><span id="hint" role="status"></span></p>
    <p class="note" data-i18n="prefixNote">注意：部分浏览器往地址栏粘贴时会自动剥掉开头的 <code>javascript:</code> 前缀 —— 请在「添加网页」弹窗的网址栏里粘贴，并确认开头是 <code>javascript:</code>。</p>
  </details>
</div>

<div class="step">
  <h3><span class="no">3</span><span data-i18n="s3t">打开一个即刻作者主页，点书签试一次</span></h3>
  <p data-i18n="s3b1">先在浏览器登录 <a href="https://web.okjike.com/" target="_blank" rel="noopener">web.okjike.com</a>，然后进入任意作者主页（地址形如 <code>web.okjike.com/u/…</code>）。</p>
  <p data-i18n="s3b2">点书签栏上的「jike2md」→ 右上角出现进度浮层，逐页抓取 → 完成后浏览器自动下载 <code>jike-作者名-日期.md</code>。</p>
  <p><a href="https://web.okjike.com/" target="_blank" rel="noopener" data-i18n="s3link">去即刻找个作者主页试试 →</a></p>
</div>

<p class="note" data-i18n="tail">以后每次使用：打开作者主页 → 点书签 → 拿文件。就这一步。</p>

<h2 data-i18n="faqH">常见问题</h2>
<table>
  <caption class="sr-only" data-i18n="tblCap">常见问题与解决方法</caption>
  <tr><th scope="col" data-i18n="thQ">现象</th><th scope="col" data-i18n="thA">原因与解决</th></tr>
  <tr><td data-i18n="q1">点了书签毫无反应</td><td data-i18n="a1">书签只能在 <code>web.okjike.com</code> 页面上工作；且需确认书签网址以 <code>javascript:</code> 开头（粘贴时前缀可能被浏览器剥掉，手动补上）。</td></tr>
  <tr><td data-i18n="q2">浮层提示 token 无效 / 已过期</td><td data-i18n="a2">刷新 jike 页面（或退出重登）再点一次即可 —— token 取自你登录后的浏览器本地存储。</td></tr>
  <tr><td data-i18n="q3">导出的条数比作者主页显示的少</td><td data-i18n="a3">确认停留在该作者的主页上再点击（脚本按当前页地址自动识别作者）；「转发且未写评论」的条目会以引用块附上原文，不会丢条。</td></tr>
  <tr><td data-i18n="q4">我的数据安全吗？</td><td data-i18n="a4">token 读自你自己浏览器的 localStorage，请求<b>只发往即刻官方接口</b> api.ruguoapp.com，不经任何第三方服务器；导出文件直接从浏览器下载。</td></tr>
  <tr><td data-i18n="q5">导出到一半可以停吗？</td><td data-i18n="a5">不能中途停止 —— 关闭标签页会丢失已抓内容。动态较多的作者需要几十秒，等浮层提示完成即可。</td></tr>
</table>

<h2 data-i18n="srcH">源码（透明可审计）</h2>
<p class="note" data-i18n="srcNote">这就是书签里那段代码的可读形式 —— 和上面「复制代码」拿到的是同一段逻辑，一个可读、一个已压缩编码。也可以直接查看仓库里的 <code>jike2md.src.js</code>。</p>
<details>
  <summary data-i18n="srcSum">展开查看完整源码</summary>
  <pre id="srcview">${srcEsc}</pre>
</details>

<h2 data-i18n="legalH">使用边界</h2>
<div class="legal">
  <p data-i18n="legal1">本工具是个人开源项目，<b>与即刻官方无隶属关系</b>。</p>
  <p data-i18n="legal2">请仅用于导出你自己的内容，或已获作者授权的内容。导出文件的著作权归原发帖作者，请勿公开传播或用于商业用途。使用本工具即表示你自行承担相关责任。</p>
</div>

<footer data-i18n="footer">jike2md · 数据不出你的浏览器 · 单文件源码，可展开查看</footer>

</main>
<script>
  var I18N = ${dictJson};

  (function () {
    var isMac = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
    var shortcutLabel = isMac ? 'Cmd(⌘) + Shift + B' : 'Ctrl + Shift + B';
    var cur;

    function apply(lang) {
      var d = I18N[lang];
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
      document.title = d.title;
      var els = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < els.length; i++) {
        var k = els[i].getAttribute('data-i18n');
        if (d[k] != null) els[i].innerHTML = d[k];
      }
      document.getElementById('shortcut').textContent = shortcutLabel;
      document.getElementById('langbtn').textContent = lang === 'zh' ? 'EN' : '中文';
      var ct = document.getElementById('clickTip');
      if (ct) { ct.hidden = true; ct.textContent = ''; }
      try { localStorage.setItem('jike2md_lang', lang); } catch (e) {}
      cur = lang;
    }

    try { cur = localStorage.getItem('jike2md_lang'); } catch (e) {}
    if (cur !== 'zh' && cur !== 'en') {
      cur = /^zh/i.test(navigator.language || 'zh') ? 'zh' : 'en';
    }
    apply(cur);

    document.getElementById('langbtn').addEventListener('click', function () {
      apply(cur === 'zh' ? 'en' : 'zh');
    });

    document.getElementById('bm').addEventListener('click', function (e) {
      e.preventDefault();
      var tip = document.getElementById('clickTip');
      tip.textContent = I18N[cur].clickTip;
      tip.hidden = false;
    });

    document.getElementById('copy').addEventListener('click', function () {
      var bmUrl = document.getElementById('bm').getAttribute('href');
      var d = I18N[cur];
      var hint = function (s) { document.getElementById('hint').textContent = s; };
      var fallback = function () {
        var ta = document.createElement('textarea');
        ta.value = bmUrl;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); hint(d.copied); }
        catch (e) { hint(d.copyFail); }
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(bmUrl).then(function () { hint(d.copied); }, fallback);
      } else { fallback(); }
    });
  })();
</script>
</body>
</html>
`;

writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('bookmarklet 长度:', bm.length, '字符 → 已生成 index.html（中英双语）');
