/*!
 * jike2md bookmarklet —— 在 jike 作者主页一键导出全部动态为 Markdown。
 * 用法：在 web.okjike.com/u/<username> 页面点击本书签；token 取自本页 localStorage 的
 *       JK_ACCESS_TOKEN，请求只发往 jike 官方接口 api.ruguoapp.com，不经任何第三方。
 * 构建：node bookmarklet/build.mjs → 生成 bookmarklet/index.html（拖拽 / 复制安装页）。
 * 逻辑要点：loadMoreKey 游标原样回传、按 id 去重、250ms 礼貌间隔、转发原文深度扫描。
 */
(function () {
  'use strict';
  var m = location.pathname.match(/^\/u\/([^\/?#]+)/);
  if (!m) { alert('jike2md：请先打开某位作者的主页（web.okjike.com/u/…）再点此书签。'); return; }
  var USERNAME;
  try { USERNAME = decodeURIComponent(m[1]); } catch (e) { USERNAME = m[1]; }
  var TOKEN = localStorage.getItem('JK_ACCESS_TOKEN');
  if (!TOKEN) { alert('jike2md：未在本页 localStorage 找到 JK_ACCESS_TOKEN，请确认已登录 jike 网页版。'); return; }

  var box = document.createElement('div');
  box.style.cssText = 'position:fixed;top:16px;right:16px;z-index:2147483647;background:#202124;color:#e8eaed;'
    + 'padding:10px 14px;border-radius:8px;font:13px/1.6 Consolas,monospace;box-shadow:0 2px 12px rgba(0,0,0,.4);max-width:360px';
  document.body.appendChild(box);
  function say(s) { box.textContent = 'jike2md：' + s; }

  var API = 'https://api.ruguoapp.com/1.0/personalUpdate/single';
  var LIMIT = 20, DELAY = 250;
  var seen = Object.create(null), order = [], loadMoreKey, page = 0, authorName = USERNAME;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtLocal(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso || '').replace('T', ' ').slice(0, 16);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function postUrl(it) { return 'https://web.okjike.com/' + (it.type === 'REPOST' ? 'reposts' : 'originalPosts') + '/' + it.id; }
  function itemText(it) { return (it.content || it.rawContent || '').trim(); }

  // P1-5：转发（REPOST）条目的被转原文藏在某个嵌套对象里，且不同时期字段名可能不同。
  // 不认字段名，深度优先扫描（浅层优先）：命中「type 为 ORIGINAL_POST/REPOST、有正文、
  // 有 createdAt、id 异于顶层」的第一个嵌套对象即视为原文；要求带 type 可排除嵌套评论。
  function findOriginal(item) {
    var isPost = function (o) {
      return o && typeof o === 'object' && !Array.isArray(o) &&
        (o.type === 'ORIGINAL_POST' || o.type === 'REPOST') &&
        (o.content || o.rawContent) && o.createdAt && o.id && o.id !== item.id;
    };
    var visit = function (v) {
      if (!v || typeof v !== 'object') return null;
      if (Array.isArray(v)) {
        for (var i = 0; i < v.length; i++) {
          var h = visit(v[i]);
          if (h) return h;
        }
        return null;
      }
      if (isPost(v)) return v;
      var keys = Object.keys(v);
      for (var j = 0; j < keys.length; j++) {
        if (keys[j] === 'user' || keys[j] === 'pictures') continue;
        var hit = visit(v[keys[j]]);
        if (hit) return hit;
      }
      return null;
    };
    var ks = Object.keys(item);
    for (var n = 0; n < ks.length; n++) {
      if (ks[n] === 'user' || ks[n] === 'pictures') continue;
      var found = visit(item[ks[n]]);
      if (found) return found;
    }
    return null;
  }

  function toMarkdownItem(it) {
    var lines = ['## ' + fmtLocal(it.createdAt || it.actionTime), ''];
    var text = itemText(it);
    var orig = text ? null : findOriginal(it);
    if (orig) {
      // 转发且作者未写评论：以引用块输出被转原文（P1-5）
      lines.push('> 转自 @' + ((orig.user && orig.user.screenName) || '未知作者') + '：', '');
      lines.push(
        ((orig.content || orig.rawContent || '').trim() || '（原文亦无文字内容）')
          .split('\n').map(function (l) { return l ? '> ' + l : '>'; }).join('\n'),
        ''
      );
      ((orig.pictures) || []).forEach(function (p) { if (p.picUrl) lines.push('![](' + p.picUrl + ')', ''); });
      lines.push('原帖：' + postUrl(orig), '');
    } else {
      lines.push(text || '（无文字内容）', '');
    }
    ((it.pictures) || []).forEach(function (p) { if (p.picUrl) lines.push('![](' + p.picUrl + ')', ''); });
    lines.push('原文链接：' + postUrl(it), '', '---', '');
    return lines.join('\n');
  }

  (async function run() {
    try {
      for (;;) {
        page++;
        say('第 ' + page + ' 页抓取中…（累计 ' + order.length + ' 条）');
        var body = { limit: LIMIT, username: USERNAME };
        if (loadMoreKey) body.loadMoreKey = loadMoreKey;
        var res = await fetch(API, {
          method: 'POST',
          headers: {
            'accept': 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'platform': 'web',
            'x-jike-access-token': TOKEN,
          },
          body: JSON.stringify(body),
        });
        if (res.status === 401 || res.status === 403) throw new Error('token 无效或已过期（HTTP ' + res.status + '），请刷新页面或重新登录 jike 后重试。');
        if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + res.statusText);
        var json = await res.json();
        if (!json.success) throw new Error('接口 success=false：' + JSON.stringify(json).slice(0, 120));
        var items = json.data || [], added = 0;
        items.forEach(function (it) {
          if (it && it.id && !seen[it.id]) {
            seen[it.id] = 1; order.push(it); added++;
            if (it.user && it.user.screenName) authorName = it.user.screenName;
          }
        });
        var next = json.loadMoreKey;
        if (!next || items.length === 0 || added === 0) break;
        loadMoreKey = next;
        await new Promise(function (r) { setTimeout(r, DELAY); });
      }
      say('共 ' + order.length + ' 条，组装 Markdown…');
      var header = '---\nauthor: ' + authorName + '\nauthor_id: ' + USERNAME + '\nextracted_at: ' + new Date().toISOString()
        + '\npost_count: ' + order.length + '\n---\n\n# ' + authorName + ' 的即刻动态（共 ' + order.length + ' 条）\n\n';
      var md = header + order.map(toMarkdownItem).join('\n');
      var url = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
      var a = document.createElement('a');
      a.href = url;
      a.download = 'jike-' + authorName.replace(/[\\/:*?"<>|]/g, '_') + '-' + new Date().toISOString().slice(0, 10) + '.md';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
      say('完成：' + order.length + ' 条，已开始下载');
      setTimeout(function () { box.remove(); }, 5000);
    } catch (e) {
      say('出错：' + ((e && e.message) || e));
      box.style.background = '#7a1f1f';
      setTimeout(function () { box.remove(); }, 12000);
    }
  })();
})();
