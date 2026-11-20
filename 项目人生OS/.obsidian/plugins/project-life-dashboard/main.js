var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ProjectLifeDashboard
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var VIEW_TYPE_DASHBOARD = "project-life-dashboard-view";
// ===== 项目人生 · 数据格式规范 v1.0 工具函数（见 00-后台/数据格式规范.md）=====
var PL_TASKS_HEADER = "---\n类型: 任务收件箱\n---\n# 我的任务\n\n";
var PL_IDEAS_HEADER = "---\n类型: 闪念收集箱\n---\n# 我的闪念\n\n";
var PL_HABITS_HEADER = "---\n类型: 习惯追踪\n---\n# 习惯追踪\n";
var PL_DEFAULT_PROJECT = "---\n类型: 项目\n目标:\n领域: 其他\n状态: 进行中\n开始时间: {{date}}\n截止时间:\ntags: [项目]\n---\n\n## 🎯 项目描述\n\n> 一句话写清楚：这个项目做成了是什么样子。\n\n## ✅ 任务\n\n## ❓ 问题\n\n## 📚 资源\n\n## 💡 灵感\n\n## 🏆 成就\n";
function plPad(n) { return String(n).padStart(2, "0"); }
function plToday() { var d = new Date(); return d.getFullYear() + "-" + plPad(d.getMonth() + 1) + "-" + plPad(d.getDate()); }
function plNow() { var d = new Date(); return plToday() + " " + plPad(d.getHours()) + ":" + plPad(d.getMinutes()); }
function plParseTaskFields(text) {
  text = text || "";
  var dates = {}, re = /(🛫|⏳|📅|✅)️?\s*(\d{4}-\d{2}-\d{2})/gu, m;
  while ((m = re.exec(text)) !== null) dates[m[1]] = m[2];
  var p = text.match(/[🔺⏫🔼🔽⏬]/u);
  return { dates: dates, priority: p ? p[0] : "" };
}
function plCleanTaskText(text) {
  return String(text || "")
    .replace(/(🛫|⏳|📅|✅|➕|❌)️?\s*\d{4}-\d{2}-\d{2}/gu, " ")
    .replace(/🔁️?\s*[^📅⏳🛫✅➕❌🔺⏫🔼🔽⏬#]*/gu, " ")
    .replace(/[🔺⏫🔼🔽⏬]️?/gu, " ")
    .replace(/(^|\s)#[^\s#]+/g, " ")
    .replace(/^\s*\d{1,2}:\d{2}(?:\s*-\s*\d{1,2}:\d{2})?(?=\s|$)/, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function plDisplayTitle(text) {
  return plCleanTaskText(text)
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function(_, a, b) { return b || a; })
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}
function plTagList(input) {
  return String(input || "").split(/[\s,，]+/).map(function(t) { return t.replace(/^#+/, "").trim(); }).filter(Boolean);
}
// 规范 §2.2：- [ ] 时间 内容 #标签 ⏳ 计划 📅 截止
function plNewTaskLine(o) {
  var parts = ["- [ ]"];
  if (o.time) parts.push(String(o.time).replace(/\s*-\s*/, "-").trim());
  parts.push(plCleanTaskText(o.content));
  plTagList(o.tags).forEach(function(t) { parts.push("#" + t); });
  if (o.priority) parts.push(o.priority);
  if (o.scheduled) parts.push("⏳ " + o.scheduled);
  if (o.due) parts.push("📅 " + o.due);
  return parts.join(" ");
}
function plSetTaskDone(line, done) {
  var m = line.match(/^(\s*- \[)([ xX/])\]\s*(.*)$/);
  if (!m) return line;
  var rest = m[3].replace(/\s*✅️?\s*\d{4}-\d{2}-\d{2}/gu, "").trim();
  if (done) rest += " ✅ " + plToday();
  return m[1] + (done ? "x" : " ") + "] " + rest;
}
// 解析一篇笔记里的任务（跳过代码块里的 Tasks 查询）
function plCollectTaskLines(text, path) {
  var out = [], lines = String(text || "").split("\n"), inFence = false;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (/^\s*(?:>\s*)*(```|~~~)/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    var m = line.match(/^\s*- \[([ xX/-])\]\s+(.*)$/);
    if (!m) continue;
    var f = plParseTaskFields(m[2]);
    var tm = m[2].match(/^(\d{1,2}:\d{2})(?:\s*-\s*(\d{1,2}:\d{2}))?(?=\s)/);
    out.push({ path: path, line: i, raw: line, done: m[1] === "x" || m[1] === "X", cancelled: m[1] === "-",
      title: plDisplayTitle(m[2]), time: tm ? tm[1] : void 0, endTime: tm && tm[2] ? tm[2] : void 0, scheduled: f.dates["⏳"], due: f.dates["📅"],
      start: f.dates["🛫"], doneDate: f.dates["✅"], priority: f.priority });
  }
  return out;
}
function plHabitName(heading) {
  var parts = String(heading).trim().split(/\s+/);
  if (parts.length > 1 && /\p{Extended_Pictographic}/u.test(parts[0])) parts.shift();
  return parts.join(" ");
}
// 规范 §4：在习惯小节里按日期升序插入/删除打卡行
function plToggleHabitInContent(content, habitName, date, checked) {
  var lines = content.split("\n"), start = -1, end = lines.length;
  for (var i = 0; i < lines.length; i++) {
    var hm = lines[i].match(/^##\s+(.+?)\s*$/);
    if (hm && !lines[i].startsWith("###")) {
      if (start >= 0) { end = i; break; }
      if (plHabitName(hm[1]) === habitName) start = i;
    }
  }
  if (start < 0) return content;
  var checks = [];
  for (var j = start + 1; j < end; j++) {
    var cm = lines[j].match(/^- \[[xX]\]\s*(\d{4}-\d{2}-\d{2})/);
    if (cm) checks.push({ i: j, d: cm[1] });
  }
  var hit = checks.find(function(c) { return c.d === date; });
  if (!checked) { if (hit) lines.splice(hit.i, 1); return lines.join("\n"); }
  if (hit) return content;
  var before = checks.filter(function(c) { return c.d < date; }).pop();
  if (before) lines.splice(before.i + 1, 0, "- [x] " + date);
  else if (checks.length) lines.splice(checks[0].i, 0, "- [x] " + date);
  else {
    lines.splice(start + 1, 0, "", "- [x] " + date);
    if (start + 3 < lines.length && lines[start + 3].trim() !== "") lines.splice(start + 3, 0, "");
  }
  return lines.join("\n");
}
function plFillTemplate(t, title, date) {
  return String(t)
    .replace(/\{\{title\}\}/gi, title)
    .replace(/\{\{date\}\}/gi, date)
    .replace(/\{\{date:([^}]+)\}\}/gi, function(_, fmt) { return (0, import_obsidian.moment)(date).format(fmt); })
    .replace(/\{\{time\}\}/gi, (0, import_obsidian.moment)().format("HH:mm"));
}
function plYamlValue(v) {
  v = String(v || "").trim();
  return /^[\[\]{}&*!|>'"%@`#,?-]|: |\s#/.test(v) ? JSON.stringify(v) : v;
}
function plSafeFileName(name) { return String(name || "").replace(/[\\/:*?"<>|#^\[\]]/g, " ").replace(/\s+/g, " ").trim(); }
async function plAppendLine(app, path, line, initialContent) {
  path = (0, import_obsidian.normalizePath)(path);
  var file = app.vault.getAbstractFileByPath(path);
  if (!(file instanceof import_obsidian.TFile)) {
    var dir = path.substring(0, path.lastIndexOf("/"));
    if (dir && !app.vault.getAbstractFileByPath(dir)) await app.vault.createFolder(dir);
    await app.vault.create(path, (initialContent || "") + line + "\n");
    return;
  }
  await app.vault.process(file, function(data) {
    if (data.length && !data.endsWith("\n")) data += "\n";
    return data + line + "\n";
  });
}

// ===== 主页 v3（One Club 风格）=====
var PL_MODULES = [
  ["focus", "今日头号要事", "页面最上方的黑色大字块，可以用 ← → 切换"],
  ["today", "今天", "今天剩下的任务"],
  ["timeline", "时间轴", "带时间的任务排成一条线"],
  ["review", "本周", "本周完成、逾期、完成率，以及复盘入口"],
  ["projects", "项目", "进度、剩余天数、下一步、搁置提醒"],
  ["rhythm", "节奏", "本周心情与习惯打卡"],
  ["inbox", "待整理", "未整理的闪念与收藏"],
  ["calendar", "任务日历", "月视图"],
  ["ai", "AI 悬浮球", "右下角悬浮球：一句话记录与 AI 对话，可拖动"],
  ["headerImage", "页眉图", "页面顶部的横幅图片"]
];
var PL_DEFAULT_MODULES = { focus: true, today: true, timeline: true, review: true, projects: true, rhythm: true, inbox: true, calendar: false, ai: true, headerImage: false };
var DEFAULT_SETTINGS = {
  projectFolder: "02-项目/1.进行项目",
  dailyNotesFolder: "03-行动/日记",
  taskFile: "01-捕获/我的任务.md",
  captureFolder: "01-捕获",
  habitsFile: "01-捕获/习惯追踪.md",
  bookmarksFile: "01-捕获/收藏夹.md",
  projectTemplate: "00-后台/模板/项目模板.md",
  reviewFolder: "04-复盘/周复盘",
  reviewTemplate: "00-后台/模板/复盘模板.md",
  attachmentFolder: "00-后台/附件",
  openOnStartup: true,
  headerImage: "",
  aiModel: "",
  fabPos: { side: "right", bottom: 28 },
  habitColors: {},
  welcomeDismissed: false,
  modules: Object.assign({}, PL_DEFAULT_MODULES)
};
var PL_EMO = {
  happy: ["开心", "开心的"], calm: ["平静", "平静的"], neutral: ["平常", "平平常常的"], excited: ["兴奋", "兴奋的"],
  grateful: ["感恩", "心怀感恩的"], tired: ["疲惫", "疲惫的"], anxious: ["焦虑", "焦虑的"], sad: ["低落", "低落的"],
  angry: ["烦躁", "烦躁的"], stressed: ["压力大", "有压力的"]
};
var PL_NEGATIVE = { anxious: 1, sad: 1, angry: 1, stressed: 1, tired: 1 };
var PL_PRIO_RANK = { "🔺": 0, "⏫": 1, "🔼": 2, "": 3, "🔽": 4, "⏬": 5 };
var PL_PRIO_NAME = { "🔺": "最高优先级", "⏫": "高优先级", "🔼": "中优先级", "🔽": "低优先级", "⏬": "最低优先级" };
var PL_WD = ["日", "一", "二", "三", "四", "五", "六"];
function plYmd(d) { return d.getFullYear() + "-" + plPad(d.getMonth() + 1) + "-" + plPad(d.getDate()); }
function plParseYmd(s) { var p = String(s).slice(0, 10).split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
function plAddDays(s, n) { var d = plParseYmd(s); d.setDate(d.getDate() + n); return plYmd(d); }
function plDaysBetween(a, b) { return Math.round((plParseYmd(b) - plParseYmd(a)) / 86400000); }
function plWeekDates(s) { var d = plParseYmd(s), off = (d.getDay() + 6) % 7, mon = plAddDays(s, -off), out = []; for (var i = 0; i < 7; i++) out.push(plAddDays(mon, i)); return out; }
function plIsoWeek(s) {
  var t = plParseYmd(s); t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7));
  var w1 = new Date(t.getFullYear(), 0, 4);
  var week = 1 + Math.round(((t - w1) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7);
  return { year: t.getFullYear(), week: week, id: t.getFullYear() + "-W" + plPad(week) };
}
function plCn(n) { return n >= 0 && n <= 10 ? "零一两三四五六七八九十"[n] : String(n); }
function plMin(hm) { var p = String(hm).split(":"); return (+p[0]) * 60 + (+p[1] || 0); }
function plStr(v) { return v === null || v === void 0 ? "" : String(Array.isArray(v) ? v.join(", ") : v).trim(); }
function plDateLabel(s) { var d = plParseYmd(s); return (d.getMonth() + 1) + "月" + d.getDate() + "日 星期" + PL_WD[d.getDay()]; }
function plParseHabits(content) {
  var habits = [], cur = null;
  String(content || "").split("\n").forEach(function(line) {
    var h = line.match(/^##\s+(.+?)\s*$/);
    if (h && !line.startsWith("###")) { cur = { name: plHabitName(h[1]), dates: [] }; habits.push(cur); return; }
    var c = line.match(/^- \[[xX]\]\s*(\d{4}-\d{2}-\d{2})/);
    if (c && cur) cur.dates.push(c[1]);
  });
  return habits;
}
function plParseEnv(text) {
  var env = {};
  String(text || "").split(/\r?\n/).forEach(function(raw) {
    var line = raw.trim();
    if (!line || line.charAt(0) === "#") return;
    if (line.indexOf("export ") === 0) line = line.slice(7).trim();
    var i = line.indexOf("=");
    if (i <= 0) return;
    var k = line.slice(0, i).trim(), v = line.slice(i + 1).trim();
    if (v.length > 1 && ((v[0] === '"' && v[v.length - 1] === '"') || (v[0] === "'" && v[v.length - 1] === "'"))) v = v.slice(1, -1);
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(k)) env[k] = v;
  });
  return env;
}
// 习惯颜色：降低饱和度，只出现在打卡方格里
var PL_HABIT_COLORS = [["蓝", "#3b5bdb"], ["绿", "#2b8a4b"], ["橙", "#c4561b"], ["紫", "#6741d9"], ["青", "#0c8599"], ["粉", "#b5306f"], ["琥珀", "#b07a12"], ["珊瑚红", "#c92a2a"]];
var PL_CN_WD = { "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "日": 7, "天": 7 };
function plValidYmd(y, m, d) {
  var dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? plYmd(dt) : "";
}
// 与 OpenClaw 的 pl.mjs parseDateWord 同一套规则（由 .release/tests 检查两边一致）
function plParseDateWord(w, today) {
  var s = String(w || "").trim().replace(/\s+/g, ""), m;
  if ((m = s.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})[日号]?$/))) return plValidYmd(+m[1], +m[2], +m[3]);
  if ((m = s.match(/^(\d{1,2})(?:月|\/|-)(\d{1,2})[日号]?$/))) {
    var y = plParseYmd(today).getFullYear(), d = plValidYmd(y, +m[1], +m[2]);
    if (d && d < plAddDays(today, -60)) d = plValidYmd(y + 1, +m[1], +m[2]);
    return d;
  }
  var rel = { "今天": 0, "今日": 0, "明天": 1, "明日": 1, "后天": 2, "大后天": 3, "昨天": -1, "前天": -2 };
  if (Object.prototype.hasOwnProperty.call(rel, s)) return plAddDays(today, rel[s]);
  if ((m = s.match(/^(\d+)天(?:以)?后$/))) return plAddDays(today, +m[1]);
  if ((m = s.match(/^(下下|下|本|这)?(?:周|星期|礼拜)([一二三四五六日天1-7])$/))) {
    var target = PL_CN_WD[m[2]] || +m[2], t = plParseYmd(today), idx = ((t.getDay() + 6) % 7) + 1, mon = plAddDays(today, 1 - idx);
    var off = m[1] === "下" ? 1 : m[1] === "下下" ? 2 : 0;
    if (!m[1] && target < idx) off = 1;
    return plAddDays(mon, off * 7 + target - 1);
  }
  return "";
}
var PL_TIME_WORD = /^(上午|早上|中午|下午|晚上)?(\d{1,2})(?::|：|点)(\d{2}|半)?分?(?:[-~到至](上午|早上|中午|下午|晚上)?(\d{1,2})(?::|：|点)(\d{2}|半)?分?)?$/;
function plParseTimeWord(text) {
  var m = String(text || "").replace(/\s+/g, "").match(PL_TIME_WORD);
  if (!m) return "";
  var hr = function(ap, h) { h = +h; if (ap && /下午|晚上/.test(ap) && h < 12) h += 12; if (ap === "中午" && h < 11) h += 12; return h; };
  var mn = function(x) { return x === "半" ? "30" : x || "00"; };
  var h1 = hr(m[1], m[2]);
  if (h1 > 23 || +mn(m[3]) > 59) return "";
  var a = plPad(h1) + ":" + mn(m[3]);
  if (m[5] === void 0) return a;
  var h2 = hr(m[4] || m[1], m[5]);
  if (h2 > 23 || +mn(m[6]) > 59) return a;
  var b = plPad(h2) + ":" + mn(m[6]);
  return b > a ? a + "-" + b : a;
}
var PL_DATE_RE = /(截止(?:到|于)?\s*)?(大后天|后天|明天|明日|今天|今日|昨天|前天|\d+天(?:以)?后|\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}[日号]?|\d{1,2}月\d{1,2}[日号]?|\d{1,2}\/\d{1,2}|(?:下下|下|本|这)?(?:周|星期|礼拜)[一二三四五六日天1-7])(之?前|以前)?/;
var PL_TIME_RE = /(上午|早上|中午|下午|晚上)?\s*(\d{1,2})(?::|：|点)(\d{2}|半)?分?(?:\s*[-~到至]\s*(上午|早上|中午|下午|晚上)?\s*(\d{1,2})(?::|：|点)(\d{2}|半)?分?)?/;
function plMatchProject(q, names) {
  q = String(q || "").trim();
  if (!q) return "";
  if (names.indexOf(q) >= 0) return q;
  var hits = names.filter(function(n) { return n.indexOf(q) === 0; });
  if (hits.length !== 1) hits = names.filter(function(n) { return n.indexOf(q) >= 0; });
  return hits.length === 1 ? hits[0] : "";
}
// 一句话任务：「明天 14:00 写周报 #工作 !! @产品」「周五前交方案」
function plParseQuickTask(text, today, projects) {
  var s = " " + String(text || "").replace(/\s+/g, " ").trim() + " ";
  var out = { scheduled: "", due: "", time: "", priority: "", tags: [], project: "", content: "", projectMiss: "" };
  s = s.replace(/\s#([^\s#]+)/g, function(_, t) { out.tags.push(t); return " "; });
  s = s.replace(/\s[@＠](\S+)/g, function(_, q) { var hit = plMatchProject(q, projects || []); if (hit) { out.project = hit; return " "; } out.projectMiss = q; return " "; });
  s = s.replace(/\s(!{1,3}|！{1,3})(?=\s)/g, function(_, b) { out.priority = b.length >= 3 ? "🔺" : b.length === 2 ? "⏫" : "🔼"; return " "; });
  var m = s.match(PL_DATE_RE);
  if (m) {
    var d = plParseDateWord(m[2], today);
    if (d) { if (m[1] || m[3]) out.due = d; else out.scheduled = d; s = s.replace(m[0], " "); }
  }
  var t = s.match(PL_TIME_RE);
  if (t) {
    var tw = plParseTimeWord(t[0]);
    if (tw) { out.time = tw; s = s.replace(t[0], " "); }
  }
  out.content = s.replace(/\s+/g, " ").trim();
  if (!out.scheduled && !out.due) out.scheduled = today;
  return out;
}
function plShortDate(s, today) {
  if (s === today) return "今天";
  if (s === plAddDays(today, 1)) return "明天";
  if (s === plAddDays(today, 2)) return "后天";
  var d = plParseYmd(s);
  return (d.getMonth() + 1) + "月" + d.getDate() + "日 周" + PL_WD[d.getDay()];
}
function plInsertUnderHeading(content, headingRe, headingText, line) {
  var lines = String(content).replace(/\n+$/, "").split("\n");
  var h = lines.findIndex(function(l) { return headingRe.test(l.trim()); });
  if (h < 0) return lines.join("\n") + "\n\n" + headingText + "\n\n" + line + "\n";
  var end = lines.length;
  for (var i = h + 1; i < lines.length; i++) if (/^#{1,6}\s/.test(lines[i])) { end = i; break; }
  var last = h;
  for (var j = h + 1; j < end; j++) if (lines[j].trim()) last = j;
  var ins = last === h ? ["", line] : [line];
  lines.splice.apply(lines, [last + 1, 0].concat(ins));
  var after = last + 1 + ins.length;
  if (after < lines.length && lines[after].trim() !== "") lines.splice(after, 0, "");
  return lines.join("\n") + "\n";
}
function plStreak(dates, today) {
  var set = new Set(dates), day = set.has(today) ? today : plAddDays(today, -1), n = 0;
  while (set.has(day)) { n++; day = plAddDays(day, -1); }
  return n;
}
var PL_FIELD_SEQ = ["🔁", "🛫", "⏳", "📅", "✅"];
function plInsertField(line, token, afterIdx) {
  var pos = -1;
  for (var k = afterIdx + 1; k < PL_FIELD_SEQ.length && pos < 0; k++) { var q = line.indexOf(PL_FIELD_SEQ[k]); if (q >= 0) pos = q; }
  if (pos < 0) return line.replace(/\s+$/, "") + " " + token;
  return line.slice(0, pos).replace(/\s+$/, "") + " " + token + " " + line.slice(pos);
}
function plSetTaskField(line, emoji, value) {
  line = line.replace(new RegExp("\\s*" + emoji + "\\uFE0F?\\s*\\d{4}-\\d{2}-\\d{2}", "gu"), "").replace(/\s+$/, "");
  return value ? plInsertField(line, emoji + " " + value, PL_FIELD_SEQ.indexOf(emoji)) : line;
}
function plSetTaskPriority(line, prio) {
  line = line.replace(/\s*[🔺⏫🔼🔽⏬]\uFE0F?/gu, "").replace(/\s+$/, "");
  return prio ? plInsertField(line, prio, -1) : line;
}
function plPostponeLine(line, today) {
  var tomorrow = plAddDays(today, 1), f = plParseTaskFields(line), out = line;
  if (f.dates["📅"] && f.dates["📅"] < tomorrow) out = plSetTaskField(out, "📅", tomorrow);
  if (f.dates["⏳"] || !f.dates["📅"]) out = plSetTaskField(out, "⏳", tomorrow);
  return out;
}
function plCancelLine(line) {
  return line.replace(/^(\s*- \[)[ xX/](\])/, "$1-$2").replace(/\s*✅\uFE0F?\s*\d{4}-\d{2}-\d{2}/gu, "");
}
var PL_SKILL_CMD = "node 00-后台/OpenClaw/project-life-os/scripts/pl.mjs";
function plAISystemPrompt() {
  var t = plToday(), w = plIsoWeek(t);
  return [
    "你是「项目人生 OS」主页底部指令栏里的助手。今天是 " + t + " 星期" + PL_WD[plParseYmd(t).getDay()] + "（第 " + w.week + " 周）。",
    "- 用中文回答，简短直接：一般不超过 6 行，不寒暄。",
    "- 你可以读取 vault 里的笔记。需要记录或修改时，只能这样调用（单独一条命令，原样使用这个相对路径，不要 cd，不要用 && 或管道）：",
    "  " + PL_SKILL_CMD + " <命令> <<'PL_EOF'",
    "  {JSON 参数}",
    "  PL_EOF",
    "  命令与参数见 00-后台/OpenClaw/project-life-os/SKILL.md，数据格式见 00-后台/数据格式规范.md。",
    "- 回答“今天 / 这周”类问题时，先运行 today 或 week 命令取数据。",
    "- 意图不明确、或要一次写入多条时，先说明打算怎么做，等用户确认。",
    "- 不要编辑、移动或删除其他文件。"
  ].join("\n");
}
function plDescribeTool(block) {
  var input = block && block.input || {};
  if (block.name === "Bash") {
    var m = String(input.command || "").match(/pl\.mjs\s+([a-z-]+)/);
    var names = { idea: "记下闪念", task: "写入任务", done: "勾选任务", habit: "打卡", mood: "记录心情", log: "写进日记", bookmark: "收藏链接",
      "project-new": "新建项目", "project-status": "更新项目状态", "project-list": "查看项目", today: "查看今天的数据", week: "查看本周数据", review: "写入周复盘" };
    return m ? "正在" + (names[m[1]] || "运行 " + m[1]) + "…" : "正在执行命令…";
  }
  if (block.name === "Read" || block.name === "Grep" || block.name === "Glob") return "正在翻阅笔记…";
  return "正在处理…";
}

// —— AI 引擎：借用 Claudian 的 Claude CLI 路径、环境变量与模型 ——
var PlAI = class {
  constructor(plugin) { this.plugin = plugin; this.app = plugin.app; this.sessionId = null; this.child = null; }
  claudian() { var p = this.app.plugins; return p && p.plugins ? p.plugins.claudian || null : null; }
  status() {
    if (!import_obsidian.Platform.isDesktopApp) return { ok: false, reason: "AI 对话只能在电脑上使用" };
    var c = this.claudian();
    if (!c) return { ok: false, reason: "没有启用 Claudian（设置 → 第三方插件）" };
    var cli = "";
    try { cli = c.getResolvedClaudeCliPath ? c.getResolvedClaudeCliPath() || "" : ""; } catch (e) { cli = ""; }
    if (!cli) return { ok: false, reason: "Claudian 没找到 Claude CLI，请先安装 Claude Code" };
    var model = this.plugin.settings.aiModel || c.settings && c.settings.model || "haiku";
    return { ok: true, cli: cli, model: model };
  }
  stop() { if (this.child) { try { this.child.kill(); } catch (e) {} } }
  reset() { this.stop(); this.sessionId = null; }
  ask(prompt, handlers) {
    var self = this, st = this.status(), h = handlers || {};
    if (!st.ok) return Promise.reject(new Error(st.reason));
    var cp = require("child_process"), pathMod = require("path"), os = require("os");
    var c = this.claudian(), envText = "";
    try { envText = c.getActiveEnvironmentVariables ? c.getActiveEnvironmentVariables() : ""; } catch (e) { envText = ""; }
    if (typeof envText !== "string") envText = c.settings && c.settings.environmentVariables || "";
    var custom = plParseEnv(envText), home = os.homedir();
    var PATH = [pathMod.dirname(st.cli), "/opt/homebrew/bin", "/usr/local/bin", home + "/.local/bin", home + "/.npm-global/bin",
      home + "/.bun/bin", home + "/.volta/bin", custom.PATH, process.env.PATH].filter(Boolean).join(pathMod.delimiter);
    var env = Object.assign({}, process.env, custom, { PATH: PATH });
    var adapter = this.app.vault.adapter;
    var cwd = adapter.getBasePath ? adapter.getBasePath() : process.cwd();
    var args = ["-p", "--output-format", "stream-json", "--verbose", "--model", st.model, "--append-system-prompt", plAISystemPrompt()];
    if (this.sessionId) args.push("--resume", this.sessionId);
    args.push("--disallowedTools", "Edit", "Write", "MultiEdit", "NotebookEdit", "WebFetch", "WebSearch");
    args.push("--allowedTools", "Read", "Glob", "Grep", "Bash(" + PL_SKILL_CMD + ":*)");
    var cmd = st.cli, cmdArgs = args;
    if (/\.(c|m)?js$/.test(st.cli)) { cmd = "node"; cmdArgs = [st.cli].concat(args); }
    return new Promise(function(resolve, reject) {
      var child;
      try { child = cp.spawn(cmd, cmdArgs, { cwd: cwd, env: env }); } catch (e) { reject(e); return; }
      self.child = child;
      var buf = "", stderr = "", texts = [], finalText = null, isErr = false, settled = false;
      var done = function(fn, v) { if (settled) return; settled = true; self.child = null; fn(v); };
      child.stdout.on("data", function(d) {
        buf += d.toString("utf8");
        var i;
        while ((i = buf.indexOf("\n")) >= 0) {
          var line = buf.slice(0, i).trim();
          buf = buf.slice(i + 1);
          if (!line) continue;
          var ev;
          try { ev = JSON.parse(line); } catch (e) { continue; }
          if (ev.session_id) self.sessionId = ev.session_id;
          if (ev.type === "assistant" && ev.message && Array.isArray(ev.message.content)) {
            ev.message.content.forEach(function(b) {
              if (b.type === "text" && b.text) { texts.push(b.text); if (h.onText) h.onText(texts.join("\n\n")); }
              if (b.type === "tool_use" && h.onTool) h.onTool(plDescribeTool(b));
            });
          }
          if (ev.type === "result") { finalText = typeof ev.result === "string" ? ev.result : null; isErr = !!ev.is_error; }
        }
      });
      child.stderr.on("data", function(d) { stderr = (stderr + d.toString("utf8")).slice(-4000); });
      child.on("error", function(e) { done(reject, new Error(e.code === "ENOENT" ? "找不到 Claude CLI：" + st.cli : e.message)); });
      child.on("close", function(code, signal) {
        if (finalText !== null && !isErr) return done(resolve, finalText);
        if (finalText !== null && isErr) return done(reject, new Error(finalText));
        if (signal) return done(reject, new Error("已停止"));
        if (texts.length) return done(resolve, texts.join("\n\n"));
        var tail = stderr.trim().split("\n").slice(-3).join(" ");
        done(reject, new Error(tail || "Claude 没有返回内容（退出码 " + code + "）"));
      });
      child.stdin.on("error", function() {});
      child.stdin.end(prompt);
    });
  }
};

var ProjectLifeDashboard = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.ai = new PlAI(this);
    this.registerView(VIEW_TYPE_DASHBOARD, (leaf) => new DashboardView(leaf, this));
    this.addRibbonIcon("layout-dashboard", "打开项目人生主页", () => this.activateView());
    this.addCommand({ id: "open-dashboard", name: "打开项目人生主页", callback: () => this.activateView() });
    this.addCommand({ id: "focus-command-bar", name: "聚焦底部指令栏（记一笔 / 问 AI）", callback: async () => {
      await this.activateView();
      const v = this.app.workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD)[0];
      if (v && v.view && v.view.plFocusInput) v.view.plFocusInput();
    } });
    this.addSettingTab(new ProjectLifeDashboardSettingTab(this.app, this));
    this.app.workspace.onLayoutReady(() => { if (this.settings.openOnStartup) this.activateView(); });
  }
  onunload() { if (this.ai) this.ai.stop(); }
  // 主页固定在中间区域的一个标签页（已固定的标签页不会被点开的笔记替换）
  async activateView() {
    const { workspace } = this.app;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD);
    let leaf = leaves.find((l) => l.getRoot() === workspace.rootSplit) || null;
    for (const l of leaves) if (l !== leaf) l.detach();
    if (!leaf) {
      const empty = workspace.getLeavesOfType("empty").find((l) => l.getRoot() === workspace.rootSplit);
      leaf = empty || workspace.getLeaf("tab");
      await leaf.setViewState({ type: VIEW_TYPE_DASHBOARD, active: true });
    }
    leaf.setPinned(true);
    workspace.setActiveLeaf(leaf, { focus: true });
    await workspace.revealLeaf(leaf);
  }
  async loadSettings() {
    const data = await this.loadData() || {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    this.settings.modules = Object.assign({}, PL_DEFAULT_MODULES, data.modules || {});
    delete this.settings.moduleOrder;
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.app.workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD).forEach((l) => { if (l.view && l.view.refresh) { l.view.renderAssistant(); l.view.refresh(); } });
  }
};

var DashboardView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.plSkip = new Set();
    this.plChat = [];
    this.plBusy = false;
    this.plCalOffset = 0;
  }
  getViewType() { return VIEW_TYPE_DASHBOARD; }
  getDisplayText() { return "项目人生主页"; }
  getIcon() { return "layout-dashboard"; }
  async onOpen() {
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("pl-dash");
    this.containerEl.addClass("pl-host");
    this.renderHeader(root);
    this.plContentEl = root.createDiv({ cls: "pl-content" });
    this.renderAssistant();
    this.registerDomEvent(this.containerEl, "keydown", (e) => { if (e.key === "Escape" && this.plPanelOpen) { if (this.plBusy) this.plugin.ai.stop(); else this.plTogglePanel(false); } });
    this.registerDomEvent(this.containerEl, "keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && String(e.key).toLowerCase() === "k" && this.plSearchInput) { e.preventDefault(); e.stopPropagation(); this.plSearchInput.focus(); this.plSearchInput.select(); }
    });
    this.registerDomEvent(root, "scroll", () => { if (this.plTopEl) this.plTopEl.toggleClass("is-compact", root.scrollTop > 40); });
    await this.refresh();
    this.registerInterval(window.setInterval(() => this.refresh(), 5 * 60 * 1e3));
    // 规范 §0.5：任务、习惯、项目、日记、捕获文件被外部（OpenClaw、AI、其他插件）改动时自动刷新
    const watched = (p) => {
      const st = this.plugin.settings;
      return !!p && (p === st.taskFile || p === st.habitsFile || p === st.bookmarksFile ||
        [st.projectFolder, st.dailyNotesFolder, st.captureFolder, st.reviewFolder].some((f) => f && p.startsWith(f + "/")));
    };
    const onChange = (file, oldPath) => { if (file && (watched(file.path) || watched(oldPath))) this.scheduleRefresh(); };
    this.registerEvent(this.app.metadataCache.on("changed", (f) => onChange(f)));
    this.registerEvent(this.app.vault.on("create", (f) => onChange(f)));
    this.registerEvent(this.app.vault.on("delete", (f) => onChange(f)));
    this.registerEvent(this.app.vault.on("rename", (f, oldPath) => onChange(f, oldPath)));
  }
  async onClose() {
    window.clearTimeout(this.plRefreshTimer);
    if (this.plFabEl) this.plFabEl.remove();
    if (this.plPanelEl) this.plPanelEl.remove();
  }
  scheduleRefresh() {
    window.clearTimeout(this.plRefreshTimer);
    this.plRefreshTimer = window.setTimeout(() => this.refresh(), 600);
  }
  // 只重绘内容区；底部指令栏（输入中的文字、对话记录）保持不动
  async refresh() {
    if (!this.plContentEl) return;
    if (this.plRefreshing) { this.plRefreshPending = true; return; }
    this.plRefreshing = true;
    try {
      const root = this.containerEl.children[1];
      const scrollTop = root.scrollTop;
      const fresh = document.createElement("div");
      await this.renderDashboard(fresh);
      const hadFocus = this.plRefocusQuick || (document.activeElement && document.activeElement.classList && document.activeElement.classList.contains("pl-quick-input"));
      this.plRefocusQuick = false;
      this.plContentEl.empty();
      while (fresh.firstChild) this.plContentEl.appendChild(fresh.firstChild);
      root.scrollTop = scrollTop;
      if (hadFocus) {
        const q = this.plContentEl.querySelector(".pl-quick-input");
        if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
      }
    } catch (e) {
      console.error("项目人生主页渲染失败", e);
    } finally {
      this.plRefreshing = false;
      if (this.plRefreshPending) { this.plRefreshPending = false; this.scheduleRefresh(); }
    }
  }

  // ───────── 数据 ─────────
  async plCollectAllTasks() {
    const st = this.plugin.settings, files = [];
    const tf = this.app.vault.getAbstractFileByPath(st.taskFile);
    if (tf instanceof import_obsidian.TFile) files.push(tf);
    // 日记越积越多：只读最近 90 天和未来日期的日记（文件名即日期，见规范 §1）
    const cutoff = plAddDays(plToday(), -90);
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (f.path === st.taskFile) continue;
      if (st.projectFolder && f.path.startsWith(st.projectFolder + "/")) { files.push(f); continue; }
      if (st.dailyNotesFolder && f.path.startsWith(st.dailyNotesFolder + "/")) {
        const m = f.basename.match(/^(\d{4}-\d{2}-\d{2})/);
        if (!m || m[1] >= cutoff) files.push(f);
      }
    }
    const tasks = [];
    for (const f of files) tasks.push(...plCollectTaskLines(await this.app.vault.cachedRead(f), f.path));
    return tasks;
  }
  async plRead(path) {
    const f = this.app.vault.getAbstractFileByPath(path);
    return f instanceof import_obsidian.TFile ? await this.app.vault.cachedRead(f) : null;
  }
  async plLoadData() {
    const s = this.plugin.settings, today = plToday(), vault = this.app.vault;
    const d = { today, week: plIsoWeek(today), weekDates: plWeekDates(today) };
    d.isWeekend = [0, 6].includes(plParseYmd(today).getDay());
    const pf = s.projectFolder + "/";
    const tasks = (await this.plCollectAllTasks()).filter((t) => !t.cancelled && t.title);
    tasks.forEach((t) => {
      t.project = t.path.startsWith(pf) ? t.path.slice(pf.length).replace(/\.md$/, "") : "";
      t.overdue = !t.done && !!((t.due && t.due < today) || (!t.due && t.scheduled && t.scheduled < today));
    });
    d.open = tasks.filter((t) => !t.done && ((t.scheduled && t.scheduled <= today) || (t.due && t.due <= today)));
    const key = (t) => [t.overdue ? 0 : 1, t.overdue ? (t.due || t.scheduled) : "", PL_PRIO_RANK[t.priority || ""] ?? 3, t.time || "99:99", t.title];
    d.open.sort((a, b) => { const x = key(a), y = key(b); for (let i = 0; i < x.length; i++) { if (x[i] < y[i]) return -1; if (x[i] > y[i]) return 1; } return 0; });
    d.hero = d.open.find((t) => !this.plSkip.has(t.raw)) || null;
    // 「我的任务」里没写任何日期的事：不进今天的清单，但单独列出来，方便挑一件排到今天
    d.undated = tasks.filter((t) => !t.done && t.path === s.taskFile && !t.scheduled && !t.due && !t.start);
    d.undated.sort((a, b) => ((PL_PRIO_RANK[a.priority || ""] ?? 3) - (PL_PRIO_RANK[b.priority || ""] ?? 3)) || a.line - b.line);
    d.doneToday = tasks.filter((t) => t.done && t.doneDate === today);
    d.taskFileOpen = tasks.filter((t) => !t.done && t.path === s.taskFile).length;
    d.weekDone = tasks.filter((t) => t.done && t.doneDate && t.doneDate >= d.weekDates[0] && t.doneDate <= d.weekDates[6]).length;
    const den = d.weekDone + d.open.length;
    d.rate = den ? Math.round((d.weekDone / den) * 100) : null;
    d.timed = tasks.filter((t) => t.time && (t.scheduled === today || t.due === today) && (!t.done || t.doneDate === today));
    // 项目
    d.projects = [];
    for (const f of vault.getMarkdownFiles().filter((f) => f.path.startsWith(pf))) {
      const fm = this.app.metadataCache.getFileCache(f)?.frontmatter || {};
      const status = plStr(fm["状态"]);
      if (status === "完成" || status === "放弃") continue;
      const pts = tasks.filter((t) => t.path === f.path);
      const doneN = pts.filter((t) => t.done).length;
      const next = pts.find((t) => !t.done);
      const due = plStr(fm["截止时间"]).slice(0, 10);
      const lastDone = pts.map((t) => t.doneDate).filter(Boolean).sort().pop();
      const start = plStr(fm["开始时间"]).slice(0, 10);
      // 「多久没进展」从最近一次完成、开始时间、文件创建时间里取最晚的一个算起：
      // 刚下载的示例项目、或刚补建的旧项目，不会一打开就显示「搁置 300 天」
      const ref = [lastDone, /^\d{4}-\d{2}-\d{2}$/.test(start) ? start : "", plYmd(new Date(f.stat.ctime))].filter(Boolean).sort().pop();
      const idle = plDaysBetween(ref, today);
      d.projects.push({ name: f.basename, path: f.path, total: pts.length, done: doneN, progress: pts.length ? Math.round((doneN / pts.length) * 100) : 0,
        next: next ? next.title : "", daysLeft: /^\d{4}-\d{2}-\d{2}$/.test(due) ? plDaysBetween(today, due) : null,
        paused: status === "暂停", stalled: status !== "暂停" && next && idle >= 7 ? idle : 0 });
    }
    d.projects.sort((a, b) => (a.paused - b.paused) || ((a.daysLeft ?? 9999) - (b.daysLeft ?? 9999)) || a.name.localeCompare(b.name, "zh"));
    // 习惯
    d.habits = plParseHabits(await this.plRead(s.habitsFile) || "");
    // 心情（本周日记）
    d.moods = [];
    for (const date of d.weekDates) {
      const text = date <= today ? await this.plRead(`${s.dailyNotesFolder}/${date}.md`) : null;
      const keys = [];
      if (text) {
        for (const m of text.matchAll(/\[情绪::\s*([^\]\s]+)\s*\]/g)) keys.push(m[1]);
        for (const m of text.matchAll(/<!--\s*emotion:(\w+)\s*-->/g)) keys.push(m[1]);
      }
      const cnt = {};
      keys.forEach((k) => { cnt[k] = (cnt[k] || 0) + 1; });
      const top = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a] || keys.lastIndexOf(b) - keys.lastIndexOf(a))[0] || "";
      d.moods.push({ date, key: top, hasDiary: text !== null });
    }
    const all = {};
    d.moods.forEach((m) => { if (m.key) all[m.key] = (all[m.key] || 0) + 1; });
    d.moodTop = Object.keys(all).sort((a, b) => all[b] - all[a])[0] || "";
    // 待整理：未整理的闪念（没有 → [[链接]]）、收藏夹「📥 待整理」里的链接
    d.ideasPath = `${s.captureFolder}/我的闪念.md`;
    d.ideasList = [];
    (await this.plRead(d.ideasPath) || "").split("\n").forEach((l) => {
      const m = l.match(/^- (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) (.*)$/);
      if (!m || /→ \[\[/.test(l)) return;
      d.ideasList.push({ when: m[1], text: m[2].replace(/(^|\s)#[^\s#]+/g, " ").replace(/\s+/g, " ").trim() || m[2] });
    });
    d.ideasOpen = d.ideasList.length;
    const bm = await this.plRead(s.bookmarksFile) || "";
    let inInbox = false;
    d.bookmarksList = [];
    bm.split("\n").forEach((l) => {
      if (/^##\s/.test(l)) { inInbox = /^##\s+📥\s*待整理\s*$/.test(l); return; }
      if (!inInbox || !/^- /.test(l)) return;
      const m = l.match(/\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/);
      const url = m ? m[2] : (l.match(/https?:\/\/\S+/) || [""])[0];
      const host = url ? url.replace(/^https?:\/\//, "").split(/[/?#]/)[0].replace(/^www\./, "") : "";
      d.bookmarksList.push({ title: (m && m[1].trim()) || url || l.slice(2).trim(), url, host });
    });
    d.bookmarksOpen = d.bookmarksList.length;
    // 复盘
    d.reviewPath = `${s.reviewFolder}/${d.week.id}.md`;
    d.reviewExists = !!vault.getAbstractFileByPath(d.reviewPath);
    d.tasks = tasks;
    return d;
  }

  // ───────── 渲染（Bento 分区：白色卡片排在浅灰底上，与「捕获便利贴」同一套样式）─────────
  async renderDashboard(el) {
    const M = this.plugin.settings.modules || PL_DEFAULT_MODULES;
    const d = await this.plLoadData();
    this.plData = d;
    this.plUpdateHeader(d);
    if (M.headerImage) await this.renderHeaderImage(el);
    this.renderOverview(el, d, M);
    if (!this.plugin.settings.welcomeDismissed) this.renderWelcome(el);
    // 今天在左；节奏、本周在右
    const left = [], right = [];
    if (M.today) left.push((c) => this.renderToday(c, d, M.timeline));
    if (M.rhythm) right.push((c) => this.renderRhythm(c, d));
    if (M.review) right.push((c) => this.renderWeek(c, d));
    this.plCols(el, left, right);
    if (M.projects) this.renderProjects(el, d);
    if (M.inbox) this.renderInbox(el, d);
    if (M.calendar) this.renderCalendar(el, d);
    el.createDiv({ cls: "pl-end" });
  }
  // 两列：每列的卡片上下排，最后一张拉长，两列底边对齐；只有一边有内容时平分成两列
  plCols(el, left, right) {
    if (!left.length || !right.length) {
      const all = left.concat(right);
      left = all.slice(0, Math.ceil(all.length / 2));
      right = all.slice(left.length);
    }
    if (!left.length) return;
    const row = el.createDiv({ cls: "pl-cols" + (right.length ? "" : " is-one") });
    [left, right].forEach((fns) => {
      if (!fns.length) return;
      const col = row.createDiv({ cls: "pl-col" });
      fns.forEach((fn) => fn(col));
    });
  }
  // 一张卡片：左上标题 + 灰色说明，右上小链接
  plTile(parent, key, title, sub, cls) {
    const tile = parent.createDiv({ cls: "pl-tile" + (cls ? " " + cls : "") });
    if (key) tile.setAttr("data-sec", key);
    const head = tile.createDiv({ cls: "pl-tk" });
    const l = head.createDiv({ cls: "pl-tk-l" });
    l.createEl("h2", { cls: "pl-tt", text: title });
    if (sub) l.createSpan({ cls: "pl-ts", text: sub });
    const r = head.createDiv({ cls: "pl-tk-r" });
    return { tile, r };
  }
  // 卡片右上角的小链接：[文字, 点击]
  plMini(parent, items) {
    items.forEach(([text, fn]) => {
      const a = parent.createEl("a", { cls: "pl-mini", text, href: "#" });
      a.addEventListener("click", (e) => { e.preventDefault(); fn(); });
    });
  }
  plMore(parent, items) {
    const row = parent.createDiv({ cls: "pl-more" });
    items.forEach(([text, fn]) => {
      const a = row.createEl("a", { text: text + " →", href: "#" });
      a.addEventListener("click", (e) => { e.preventDefault(); fn(); });
    });
  }
  plTaskSource(t) {
    if (t.project) return t.project;
    if (t.path === this.plugin.settings.taskFile) return "我的任务";
    return t.path.split("/").pop().replace(/\.md$/, "");
  }
  plOpenUrl(url) { if (url) window.open(url); }
  async plOpenDiary(date) {
    const path = `${this.plugin.settings.dailyNotesFolder}/${date}.md`;
    if (this.app.vault.getAbstractFileByPath(path)) { this.plOpen(path); return; }
    const c = this.app.commands;
    if (date === plToday() && c && c.commands && c.commands["daily-notes"]) { c.executeCommandById("daily-notes"); return; }
    new import_obsidian.Notice("这一天还没有日记");
  }
  plScrollTo(key) {
    const sec = this.plContentEl && this.plContentEl.querySelector(`[data-sec="${key}"]`);
    if (!sec) return;
    sec.scrollIntoView({ behavior: "smooth", block: "start" });
    sec.removeClass("is-flash");
    window.setTimeout(() => sec.addClass("is-flash"), 300);
    window.setTimeout(() => sec.removeClass("is-flash"), 1500);
  }

  // ───────── 页头（只建一次，刷新时不重建，搜索框里的字不会丢）─────────
  renderHeader(root) {
    const top = root.createDiv({ cls: "pl-top" });
    this.plTopEl = top;
    const row = top.createDiv({ cls: "pl-top-in" });
    const logo = row.createEl("a", { cls: "pl-logo", href: "#", attr: { "aria-label": "回到顶部并刷新" } });
    logo.appendText("项目人生");
    this.plDateEl = logo.createSpan({ cls: "pl-logo-d" });
    // 先刷新再滚动：刷新会恢复原来的滚动位置，顺序反了就回不到顶部
    logo.addEventListener("click", async (e) => { e.preventDefault(); await this.refresh(); root.scrollTo({ top: 0, behavior: "smooth" }); });
    this.renderSearch(row);
    const add = row.createEl("button", { cls: "pl-add", text: "+ 任务" });
    add.addEventListener("click", () => this.plFocusQuick());
    // 常用位置：页头下面一行，跟着页面滚走
    this.plLinksEl = root.createDiv({ cls: "pl-links" });
  }
  plUpdateHeader(d) {
    const s = this.plugin.settings;
    if (this.plDateEl) this.plDateEl.setText(`${plDateLabel(d.today)} · 第 ${d.week.week} 周`);
    const box = this.plLinksEl;
    if (!box) return;
    box.empty();
    const M = s.modules || PL_DEFAULT_MODULES;
    const items = [
      ["我的任务", d.taskFileOpen, () => this.plOpen(s.taskFile)],
      ["我的闪念", d.ideasOpen, () => this.plOpen(d.ideasPath)],
      ["习惯追踪", d.habits.length, () => this.plOpen(s.habitsFile)],
      ["收藏夹", d.bookmarksOpen, () => this.plOpen(s.bookmarksFile)],
      ["今天的日记", null, () => this.plOpenDiary(d.today)]
    ];
    if (M.projects) items.push(["项目", d.projects.length, () => this.plScrollTo("projects")]);
    items.push(["周复盘", null, () => this.plOpenReview(d)], ["从这里开始", null, () => this.plOpen("从这里开始.md")]);
    items.forEach(([text, n, fn]) => {
      const a = box.createEl("a", { href: "#" });
      a.appendText(text);
      if (n !== null && n !== void 0) a.createSpan({ text: String(n) });
      a.addEventListener("click", (e) => { e.preventDefault(); fn(); });
    });
  }
  // 搜索：任务、项目、笔记、闪念、收藏，按类型分组；↑↓ 选择，回车打开，⌘K / Ctrl+K 聚焦
  renderSearch(parent) {
    const wrap = parent.createDiv({ cls: "pl-search" });
    const box = wrap.createEl("label", { cls: "pl-search-box" });
    this.plIcon(box, "search");
    const input = box.createEl("input", { cls: "pl-q", attr: { type: "text", placeholder: "搜索", "aria-label": "搜索任务、项目、笔记、闪念、收藏", spellcheck: "false" } });
    box.createEl("kbd", { cls: "pl-kbd", text: import_obsidian.Platform.isMacOS ? "⌘K" : "Ctrl K" });
    const res = wrap.createDiv({ cls: "pl-results is-hidden" });
    this.plSearchInput = input;
    let rows = [], sel = 0;
    const close = () => res.addClass("is-hidden");
    const setSel = (i) => {
      if (!rows.length) return;
      sel = (i + rows.length) % rows.length;
      rows.forEach((r, j) => r.el.toggleClass("is-sel", j === sel));
      rows[sel].el.scrollIntoView({ block: "nearest" });
    };
    const pick = (it) => { close(); input.blur(); if (it.url) this.plOpenUrl(it.url); else this.plOpen(it.path); };
    const run = () => {
      const q = input.value.trim(), lq = q.toLowerCase();
      res.empty(); rows = []; sel = 0;
      if (!q) { close(); return; }
      const groups = {};
      this.plSearchIndex().forEach((it) => { if ((it.t + " " + (it.s || "")).toLowerCase().includes(lq)) (groups[it.g] = groups[it.g] || []).push(it); });
      ["任务", "项目", "笔记", "闪念", "收藏"].forEach((g) => {
        const list = (groups[g] || []).slice(0, 6);
        if (!list.length) return;
        res.createEl("h6", { text: g });
        list.forEach((it) => {
          const a = res.createEl("a", { cls: "pl-res", href: "#" });
          const t = a.createSpan({ cls: "pl-res-t" });
          const i = it.t.toLowerCase().indexOf(lq);
          if (i < 0) t.setText(it.t);
          else { t.appendText(it.t.slice(0, i)); t.createEl("mark", { text: it.t.slice(i, i + q.length) }); t.appendText(it.t.slice(i + q.length)); }
          if (it.s) a.createEl("small", { text: it.s });
          const idx = rows.length;
          rows.push({ el: a, it });
          a.addEventListener("mousedown", (e) => e.preventDefault());
          a.addEventListener("click", (e) => { e.preventDefault(); pick(it); });
          a.addEventListener("mousemove", () => { if (sel !== idx) setSel(idx); });
        });
      });
      if (!rows.length) res.createDiv({ cls: "pl-res-empty", text: `没有找到「${q}」` });
      else setSel(0);
      res.removeClass("is-hidden");
    };
    input.addEventListener("input", run);
    input.addEventListener("focus", () => { if (input.value.trim()) run(); });
    input.addEventListener("blur", () => window.setTimeout(close, 150));
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setSel(sel + (e.key === "ArrowDown" ? 1 : -1)); }
      else if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); if (rows[sel]) pick(rows[sel].it); }
      else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); input.value = ""; close(); input.blur(); }
    });
  }
  plSearchIndex() {
    const d = this.plData, s = this.plugin.settings, out = [];
    if (!d) return out;
    d.tasks.filter((t) => !t.done).forEach((t) => out.push({ g: "任务", t: t.title, s: this.plTaskSource(t), path: t.path }));
    d.projects.forEach((p) => out.push({ g: "项目", t: p.name, s: p.progress + "%", path: p.path }));
    const skip = [s.projectFolder, s.dailyNotesFolder, s.captureFolder, "00-后台"].filter(Boolean).map((f) => f + "/");
    this.app.vault.getMarkdownFiles().forEach((f) => {
      if (skip.some((p) => f.path.startsWith(p))) return;
      const dir = f.path.includes("/") ? f.path.slice(0, f.path.lastIndexOf("/")).split("/").pop() : "";
      out.push({ g: "笔记", t: f.basename, s: dir, path: f.path });
    });
    d.ideasList.forEach((x) => out.push({ g: "闪念", t: x.text, s: x.when.slice(5), path: d.ideasPath }));
    d.bookmarksList.forEach((b) => out.push({ g: "收藏", t: b.title, s: b.host, path: s.bookmarksFile, url: b.url }));
    return out;
  }

  // ───────── 第一块：头号要事（两格宽、两格高）+ 四个数字格 ─────────
  renderOverview(el, d, M) {
    const g = el.createDiv({ cls: "pl-bento pl-overview" });
    if (M.focus) this.renderHero(g, d);
    else {
      const t = g.createDiv({ cls: "pl-tile pl-hero" });
      t.createDiv({ cls: "pl-k" }).createSpan({ text: "今天" });
      const b = t.createDiv({ cls: "pl-hero-b" });
      b.createEl("h1", { cls: "pl-hero-t", text: plDateLabel(d.today) });
      b.createDiv({ cls: "pl-hero-facts" }).createSpan({ text: `第 ${d.week.week} 周` });
    }
    const od = d.open.filter((t) => t.overdue);
    const oldest = od.reduce((m, t) => Math.max(m, plDaysBetween(t.due || t.scheduled, d.today)), 0);
    const stat = (label, value, sub, key, warn) => {
      const b = g.createEl("button", { cls: "pl-tile pl-stat" + (warn ? " is-warn" : "") + (value ? "" : " is-zero") });
      b.createDiv({ cls: "pl-k", text: label });
      const v = b.createDiv({ cls: "pl-stat-v" });
      v.createEl("b", { text: String(value) });
      if (sub) v.createSpan({ text: sub });
      b.addEventListener("click", () => this.plScrollTo(key));
    };
    stat("今天待办", d.open.length, d.undated.length ? `另有 ${d.undated.length} 件没排日期` : "", "today");
    stat("逾期", od.length, od.length ? `最久 ${oldest} 天` : "没有拖欠", "today", od.length > 0);
    stat("今天完成", d.doneToday.length, `本周共 ${d.weekDone} 件`, "today");
    stat("待整理", d.ideasOpen + d.bookmarksOpen, `闪念 ${d.ideasOpen} · 收藏 ${d.bookmarksOpen}`, "inbox");
  }
  renderHero(g, d) {
    const hero = g.createDiv({ cls: "pl-tile pl-hero" });
    // 今天没有安排时，改为推荐「我的任务」里还没排日期的事
    const undated = !d.open.length;
    const list = undated ? d.undated : d.open;
    const allDone = d.doneToday.length > 0;
    const draw = () => {
      hero.empty();
      const k = hero.createDiv({ cls: "pl-k" });
      const b = hero.createDiv({ cls: "pl-hero-b" });
      if (!list.length) {
        k.createSpan({ text: "今天" });
        k.createSpan({ text: plDateLabel(d.today) });
        b.createEl("h1", { cls: "pl-hero-t", text: allDone ? "今天的事都做完了。" : "今天还没有安排。" });
        b.createDiv({ cls: "pl-hero-facts" }).createSpan({ text: allDone ? `完成了 ${d.doneToday.length} 件，休息一下吧。` : "在「今天」里写一句，例如「14:00 和导师开会」。" });
        return;
      }
      const n = list.length;
      this.plHeroIdx = (((this.plHeroIdx || 0) % n) + n) % n;
      const t = list[this.plHeroIdx];
      k.createSpan({ text: undated ? (allDone ? "今天的事做完了 · 还没排日期的事" : "今天还没有安排 · 先挑一件没排日期的事") : "今日头号要事" });
      if (n > 1) {
        const nav = k.createSpan({ cls: "pl-hero-nav" });
        this.plButton(nav, "‹", () => { this.plHeroIdx--; draw(); }).setAttr("aria-label", "上一件");
        nav.createSpan({ text: `${this.plHeroIdx + 1} / ${n}` });
        this.plButton(nav, "›", () => { this.plHeroIdx++; draw(); }).setAttr("aria-label", "下一件");
      }
      const h = b.createEl("h1", { cls: "pl-hero-t is-link", text: t.title });
      h.addEventListener("click", () => this.plOpen(t.path));
      h.addEventListener("contextmenu", (e) => { e.preventDefault(); this.plTaskMenu(e, t); });
      const facts = b.createDiv({ cls: "pl-hero-facts" });
      if (t.overdue) facts.createSpan({ cls: "is-red", text: `逾期 ${plDaysBetween(t.due || t.scheduled, d.today)} 天` });
      else if (t.due === d.today) facts.createSpan({ text: "今天截止" });
      if (t.time) facts.createSpan({ text: t.time + (t.endTime ? "–" + t.endTime : "") });
      facts.createSpan({ cls: "is-link", text: this.plTaskSource(t) }).addEventListener("click", () => this.plOpen(t.path));
      if (t.priority && PL_PRIO_NAME[t.priority]) facts.createSpan({ text: PL_PRIO_NAME[t.priority] });
      const acts = hero.createDiv({ cls: "pl-hero-acts" });
      if (undated) {
        this.plButton(acts, "今天做这件", () => this.plEditTask(t, (l) => plSetTaskField(l, "⏳", plToday()), `「${t.title}」排到了今天`), "pl-hero-p");
        this.plButton(acts, "完成它", () => this.plEditTask(t, (l) => plSetTaskDone(l, true), `已完成「${t.title}」`), "pl-hero-s");
      } else {
        this.plButton(acts, "完成它", () => this.plEditTask(t, (l) => plSetTaskDone(l, true), `已完成「${t.title}」`), "pl-hero-p");
        this.plButton(acts, "推到明天", () => this.plEditTask(t, (l) => plPostponeLine(l, plToday()), `「${t.title}」推到了明天`), "pl-hero-s");
      }
    };
    draw();
  }
  // 首次打开：欢迎 + 一键清除示例内容
  renderWelcome(el) {
    const { tile } = this.plTile(el, "welcome", "欢迎", "第一次打开？先看这里。", "pl-welcome");
    tile.createEl("p", { cls: "pl-welcome-text", text: "这是你每天打开的第一页。下面的任务、项目、收藏都是示例，看一眼就明白怎么用；熟悉之后可以一键清除，换成你自己的。" });
    const act = tile.createDiv({ cls: "pl-btns" });
    this.plButton(act, "阅读「从这里开始」", () => this.plOpen("从这里开始.md"), "pl-btn-p");
    this.plButton(act, "清除示例内容", () => this.plClearSamples(), "pl-btn-s");
    this.plButton(act, "知道了", async () => { this.plugin.settings.welcomeDismissed = true; await this.plugin.saveData(this.plugin.settings); this.refresh(); }, "pl-btn-t");
  }

  // ───────── 今天 ─────────
  renderToday(col, d, showTimeline) {
    const s = this.plugin.settings;
    const n = d.open.length, od = d.open.filter((t) => t.overdue).length;
    const sub = n ? `还有 ${n} 件${od ? ` · ${od} 件逾期` : ""}` : d.doneToday.length ? "都做完了" : d.undated.length ? "清单是空的，可以从「没排日期」里挑一件" : "清单是空的";
    const { tile, r } = this.plTile(col, "today", "今天", sub, "pl-today");
    this.plMini(r, [["全部任务", () => this.plOpen(s.taskFile)], ["日记", () => this.plOpenDiary(d.today)]]);
    this.renderQuickAdd(tile, d);
    const list = tile.createDiv({ cls: "pl-tasks" });
    d.open.slice(0, 8).forEach((t) => this.renderTaskRow(list, t, d));
    if (n > 8) list.createDiv({ cls: "pl-task-more", text: `还有 ${n - 8} 件，在「我的任务」和各项目里` });
    d.doneToday.slice(0, 3).forEach((t) => this.renderTaskRow(list, t, d));
    if (d.undated.length) {
      const und = tile.createDiv({ cls: "pl-undated" });
      const h = und.createDiv({ cls: "pl-sub-h" });
      h.appendText("没排日期");
      h.createSpan({ text: String(d.undated.length) });
      d.undated.slice(0, 3).forEach((t) => this.renderTaskRow(und, t, d, true));
      if (d.undated.length > 3) this.plMore(und, [[`其余 ${d.undated.length - 3} 件在「我的任务」里`, () => this.plOpen(s.taskFile)]]);
    }
    if (showTimeline) this.renderTimeline(tile, d);
  }
  // 内联添加任务：一句话写清日期、时间、优先级、标签、项目，回车保存
  renderQuickAdd(parent, d) {
    const qa = parent.createDiv({ cls: "pl-quick" });
    const row = qa.createEl("label", { cls: "pl-quick-row" });
    row.createSpan({ cls: "pl-quick-plus", text: "+" });
    const input = row.createEl("input", { cls: "pl-quick-input", attr: { type: "text", placeholder: "添加任务，回车保存　例：明天 14:00 写周报 #工作 !! @项目" } });
    const more = row.createEl("button", { cls: "pl-quick-more", text: "更多选项", attr: { "aria-label": "用表单添加任务" } });
    const hint = qa.createDiv({ cls: "pl-hint" });
    const names = d.projects.map((p) => p.name);
    const update = () => {
      hint.empty();
      const v = input.value.trim();
      if (!v) return;
      const p = plParseQuickTask(v, d.today, names);
      hint.appendText("将保存为：");
      const part = (text, red) => hint.createSpan({ cls: red ? "is-red" : void 0, text });
      if (p.due) part(`截止 ${plShortDate(p.due, d.today)}`, p.due <= d.today);
      if (p.scheduled) part(plShortDate(p.scheduled, d.today));
      if (p.time) part(p.time);
      if (p.priority) part(PL_PRIO_NAME[p.priority]);
      p.tags.forEach((t) => part("#" + t));
      if (p.project) part("放进「" + p.project + "」");
      if (p.projectMiss) part(`没找到项目「${p.projectMiss}」`, true);
      if (!p.content) part("还没写任务内容", true);
    };
    input.value = this.plQuickDraft || "";
    update();
    input.addEventListener("input", () => { this.plQuickDraft = input.value; update(); });
    input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); await this.plQuickAdd(input.value); }
      if (e.key === "Escape") { input.value = ""; this.plQuickDraft = ""; update(); }
    });
    more.addEventListener("click", (e) => {
      e.preventDefault();
      const v = input.value.trim();
      this.showAddTaskModal(v ? plParseQuickTask(v, d.today, names) : null);
    });
  }
  // 一行任务：圆形勾选框 + 标题 + 小字标签 + 右侧时间；「推到明天」「⋯」鼠标移上去才出现
  renderTaskRow(list, t, d, undated) {
    const row = list.createDiv({ cls: "pl-task" + (t.done ? " is-done" : "") + (undated ? " is-undated" : "") });
    const ck = row.createEl("button", { cls: "pl-ck" + (t.done ? " is-on" : ""), attr: { "aria-label": t.done ? `把「${t.title}」改回未完成` : `完成「${t.title}」` } });
    ck.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (row.classList.contains("is-going")) return;
      const go = () => this.plEditTask(t, (l) => plSetTaskDone(l, !t.done), t.done ? `「${t.title}」改回未完成` : `已完成「${t.title}」`);
      if (t.done) { go(); return; }
      // 先划掉、滑出去，再写文件
      row.addClass("is-going");
      window.setTimeout(go, 420);
    });
    const body = row.createDiv({ cls: "pl-task-b" });
    const h = body.createDiv({ cls: "pl-task-t", text: t.title });
    h.addEventListener("click", () => this.plOpen(t.path));
    const labs = [];
    if (t.overdue) labs.push([`逾期 ${plDaysBetween(t.due || t.scheduled, d.today)} 天`, true]);
    else if (!t.done && t.due === d.today) labs.push(["今天截止", false]);
    if (t.project) labs.push([t.project, false]);
    if (!t.done && t.priority && PL_PRIO_NAME[t.priority]) labs.push([PL_PRIO_NAME[t.priority], false]);
    if (labs.length) {
      const lab = body.createDiv({ cls: "pl-lab" });
      labs.forEach(([text, red]) => lab.createSpan({ cls: red ? "is-red" : void 0, text }));
    }
    if (t.time) row.createDiv({ cls: "pl-tm", text: t.time + (t.endTime ? "–" + t.endTime : "") });
    const act = row.createDiv({ cls: "pl-act" });
    if (undated) this.plButton(act, "排到今天", () => this.plEditTask(t, (l) => plSetTaskField(l, "⏳", plToday()), `「${t.title}」排到了今天`), "pl-act-today");
    else if (!t.done) this.plButton(act, "推到明天", () => this.plEditTask(t, (l) => plPostponeLine(l, plToday()), `「${t.title}」推到了明天`));
    const more = act.createEl("button", { cls: "pl-act-more", attr: { "aria-label": "更多操作" } });
    (0, import_obsidian.setIcon)(more, "more-horizontal");
    more.addEventListener("click", (e) => { e.stopPropagation(); this.plTaskMenu(e, t); });
    row.addEventListener("contextmenu", (e) => { e.preventDefault(); this.plTaskMenu(e, t); });
  }
  renderTimeline(parent, d) {
    const now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes();
    const starts = d.timed.map((t) => plMin(t.time));
    const from = Math.min(6 * 60, ...starts.map((m) => Math.floor(m / 60) * 60)), to = 24 * 60, span = to - from;
    const box = parent.createDiv({ cls: "pl-tl-box" });
    const tl = box.createDiv({ cls: "pl-tl", attr: { "aria-label": "今天的时间轴" } });
    d.timed.forEach((t) => {
      const a = plMin(t.time), b = t.endTime ? Math.max(plMin(t.endTime), a + 15) : a + 60;
      const blk = tl.createDiv({ cls: "pl-tl-b" + (t.done ? " is-done" : "") });
      blk.style.left = `${((a - from) / span) * 100}%`;
      blk.style.width = `${Math.max(((Math.min(b, to) - a) / span) * 100, 1)}%`;
      blk.setAttr("aria-label", `${t.time}${t.endTime ? "-" + t.endTime : ""} ${t.title}`);
    });
    if (nowMin >= from && nowMin <= to) tl.createDiv({ cls: "pl-tl-now" }).style.left = `${((nowMin - from) / span) * 100}%`;
    const lab = box.createDiv({ cls: "pl-tl-lab" });
    lab.createSpan({ text: plPad(Math.floor(from / 60)) + ":00" });
    lab.createSpan({ text: d.timed.length ? `现在 ${plPad(now.getHours())}:${plPad(now.getMinutes())}` : "给任务加上时间（如 14:00），会排到这条线上" });
    lab.createSpan({ text: "24:00" });
  }

  // ───────── 项目：一个项目一格 ─────────
  renderProjects(el, d) {
    const n = d.projects.length, paused = d.projects.filter((p) => p.paused).length, stalled = d.projects.filter((p) => p.stalled);
    let sub = "还没有进行中的项目";
    if (n) {
      sub = `${n - paused} 个进行中`;
      if (paused) sub += ` · ${paused} 个暂停`;
      if (stalled.length === 1) sub += ` · 1 个已经 ${stalled[0].stalled} 天没有进展`;
      else if (stalled.length > 1) sub += ` · ${stalled.length} 个超过一周没有进展`;
    }
    const head = el.createDiv({ cls: "pl-row-h" });
    head.setAttr("data-sec", "projects");
    head.createEl("h2", { cls: "pl-tt", text: "项目" });
    head.createSpan({ cls: "pl-ts", text: sub });
    const grid = el.createDiv({ cls: "pl-bento pl-pjs" });
    d.projects.slice(0, 8).forEach((p) => {
      const c = grid.createDiv({ cls: "pl-tile pl-pj" + (p.paused ? " is-paused" : "") });
      c.addEventListener("click", () => this.plOpen(p.path));
      let lab = "", red = false;
      if (p.paused) lab = "暂停中";
      else if (p.stalled) { lab = `搁置 ${p.stalled} 天`; red = true; }
      else if (p.daysLeft !== null && p.daysLeft < 0) { lab = `超期 ${-p.daysLeft} 天`; red = true; }
      else if (p.daysLeft !== null) lab = p.daysLeft === 0 ? "今天截止" : `还剩 ${p.daysLeft} 天`;
      else lab = "进行中";
      const k = c.createDiv({ cls: "pl-k" });
      k.createSpan({ cls: red ? "is-red" : void 0, text: lab });
      k.createSpan({ text: p.total ? `${p.done} / ${p.total}` : "" });
      c.createEl("h3", { cls: "pl-pj-t", text: p.name });
      const pr = c.createDiv({ cls: "pl-pj-p" });
      pr.createEl("b", { text: `${p.progress}%` });
      pr.createDiv({ cls: "pl-bar" + (red ? " is-red" : "") }).createDiv({ cls: "pl-bar-i" }).style.width = `${p.progress}%`;
      c.createDiv({ cls: "pl-pj-info", text: p.next ? `下一步：${p.next}` : p.total ? "任务都完成了" : "还没有任务" });
    });
    const add = grid.createEl("button", { cls: "pl-tile pl-pj-add", text: "+ 新建项目" });
    add.addEventListener("click", () => this.showAddProjectModal());
  }

  // ───────── 节奏：心情用文字，习惯用彩色方格 ─────────
  renderRhythm(col, d) {
    const top = d.moodTop && PL_EMO[d.moodTop];
    const sub = (top ? `这一周大多是${top[1]}` : "这一周还没记录心情") + (d.habits.length ? " · 点方格打卡" : "");
    const { tile, r } = this.plTile(col, "rhythm", "节奏", sub, "pl-rhythm");
    const links = [];
    const cmds = this.app.commands && this.app.commands.commands;
    if (cmds && cmds["emotion-tracker:open-moodflow"]) links.push(["记心情", () => this.app.commands.executeCommandById("emotion-tracker:open-moodflow")]);
    links.push(["加习惯", () => new AddHabitModal(this.app, this).open()]);
    this.plMini(r, links);
    const wrap = tile.createDiv({ cls: "pl-rh-wrap" });
    const table = wrap.createEl("table", { cls: "pl-rh" });
    const hr = table.createEl("thead").createEl("tr");
    hr.createEl("th");
    d.weekDates.forEach((date) => hr.createEl("th", { cls: date === d.today ? "is-today" : void 0, text: PL_WD[plParseYmd(date).getDay()] }));
    const tb = table.createEl("tbody");
    const mr = tb.createEl("tr");
    mr.createEl("td", { text: "心情" });
    d.moods.forEach((m) => {
      const td = mr.createEl("td", { cls: "pl-mood" });
      if (m.key) td.setText(PL_EMO[m.key] ? PL_EMO[m.key][0] : m.key);
      else if (m.date <= d.today) td.createSpan({ cls: "pl-mute", text: "·" });
      if (m.hasDiary) { td.addClass("is-link"); td.setAttr("aria-label", `打开 ${m.date} 的日记`); td.addEventListener("click", () => this.plOpen(`${this.plugin.settings.dailyNotesFolder}/${m.date}.md`)); }
    });
    const colors = this.plugin.settings.habitColors || {};
    d.habits.forEach((h, i) => {
      const color = colors[h.name] || PL_HABIT_COLORS[i % PL_HABIT_COLORS.length][1];
      const tr = tb.createEl("tr");
      const lab = tr.createEl("td").createEl("button", { cls: "pl-hb", attr: { "aria-label": `${h.name}：点一下换颜色` } });
      lab.createSpan({ cls: "pl-hb-n", text: h.name });
      const streak = plStreak(h.dates, d.today);
      if (streak > 1) lab.createEl("small", { text: `连续 ${streak} 天` });
      lab.addEventListener("click", (e) => { e.stopPropagation(); this.plShowSwatches(lab, h.name, color); });
      d.weekDates.forEach((date) => {
        const on = h.dates.includes(date), future = date > d.today;
        const sq = tr.createEl("td").createEl("button", { cls: "pl-sq" + (on ? " is-on" : "") + (date === d.today ? " is-today" : ""), attr: { "aria-label": `${h.name} ${date}${on ? " 已打卡" : ""}` } });
        sq.style.setProperty("--c", color);
        if (future) sq.disabled = true;
        else sq.addEventListener("click", async () => { await this.toggleHabit(h.name, date, !on); this.refresh(); });
      });
    });
    if (!d.habits.length) tile.createDiv({ cls: "pl-note", text: "还没有习惯。点右上角「加习惯」，每天在这里打卡。" });
    const neg = d.moods.filter((m) => m.key && PL_NEGATIVE[m.key] && m.key !== d.moodTop);
    if (neg.length) tile.createDiv({ cls: "pl-note", text: neg.map((m) => `周${PL_WD[plParseYmd(m.date).getDay()]}有些${PL_EMO[m.key][0]}`).join("，") + "。" });
  }
  plShowSwatches(anchor, name, current) {
    const box = anchor.closest(".pl-tile");
    if (!box) return;
    box.querySelectorAll(".pl-swatches").forEach((x) => x.remove());
    const pop = box.createDiv({ cls: "pl-swatches" });
    const a = anchor.getBoundingClientRect(), c = box.getBoundingClientRect();
    pop.style.top = `${a.bottom - c.top + 6}px`;
    pop.style.left = `${Math.max(a.left - c.left, 0)}px`;
    PL_HABIT_COLORS.forEach(([label, col]) => {
      const b = pop.createEl("button", { cls: "pl-swatch" + (col === current ? " is-active" : ""), attr: { "aria-label": label } });
      b.style.background = col;
      b.addEventListener("click", async (e) => {
        e.stopPropagation();
        this.plugin.settings.habitColors = Object.assign({}, this.plugin.settings.habitColors, { [name]: col });
        pop.remove();
        await this.plugin.saveData(this.plugin.settings);
        this.refresh();
      });
    });
    const close = (e) => { if (!pop.contains(e.target)) { pop.remove(); document.removeEventListener("click", close, true); } };
    setTimeout(() => document.addEventListener("click", close, true), 0);
  }

  // ───────── 待整理：闪念、收藏各一格 ─────────
  renderInbox(el, d) {
    const s = this.plugin.settings;
    const pair = el.createDiv({ cls: "pl-pair" });
    pair.setAttr("data-sec", "inbox");
    const tile = (title, n, items, more, fn, cls) => {
      const { tile: t } = this.plTile(pair, null, title, n ? `${n} 条待整理` : "都整理好了", cls);
      const ul = t.createEl("ul", { cls: "pl-feed" });
      if (!items.length) ul.createEl("li", { cls: "pl-feed-empty", text: "没有要整理的" });
      items.forEach(([text, small, open]) => {
        const li = ul.createEl("li");
        li.createSpan({ text });
        li.createEl("small", { text: small });
        li.addEventListener("click", open);
      });
      this.plMore(t, [[more, fn]]);
    };
    // 整理闪念交给便利贴墙（装了「捕获便利贴」时）；没装就打开「我的闪念」文件
    const cmds = this.app.commands && this.app.commands.commands, board = "capture-notes:open-capture-notes";
    const sortIdeas = cmds && cmds[board] ? () => this.app.commands.executeCommandById(board) : () => this.plOpen(d.ideasPath);
    tile("闪念", d.ideasOpen, d.ideasList.slice(-4).reverse().map((x) => [x.text, x.when.slice(5), () => this.plOpen(d.ideasPath)]), cmds && cmds[board] ? "到便利贴墙整理" : "整理闪念", sortIdeas, "pl-ideas");
    tile("收藏", d.bookmarksOpen, d.bookmarksList.slice(-4).reverse().map((b) => [b.title, b.host || "链接", () => (b.url ? this.plOpenUrl(b.url) : this.plOpen(s.bookmarksFile))]), "打开收藏夹", () => this.plOpen(s.bookmarksFile), "pl-marks");
  }

  // ───────── 本周：三个数字 + 复盘入口 ─────────
  renderWeek(col, d) {
    const a = plParseYmd(d.weekDates[0]), b = plParseYmd(d.weekDates[6]);
    const range = `${a.getMonth() + 1}月${a.getDate()}日至${b.getMonth() === a.getMonth() ? "" : b.getMonth() + 1 + "月"}${b.getDate()}日`;
    const { tile } = this.plTile(col, "week", "本周", `第 ${d.week.week} 周 · ${range}`, "pl-week");
    const nums = tile.createDiv({ cls: "pl-nums" });
    const num = (v, label) => { const x = nums.createDiv({ cls: "pl-num" }); x.createEl("b", { text: String(v) }); x.createSpan({ text: label }); };
    num(d.weekDone, "完成");
    num(d.rate !== null ? d.rate + "%" : "—", "完成率");
    const best = d.habits.map((h) => [h.name, plStreak(h.dates, d.today)]).sort((x, y) => y[1] - x[1])[0];
    if (best && best[1]) num(`${best[1]} 天`, `${best[0]}连续`);
    else num(d.open.filter((t) => t.overdue).length, "逾期");
    if (d.isWeekend) tile.createDiv({ cls: "pl-note", text: d.reviewExists ? "复盘已经开始了。" : "周末了，该复盘了。" });
    const btns = tile.createDiv({ cls: "pl-btns" });
    this.plButton(btns, d.reviewExists ? "打开复盘" : "开始复盘", () => this.plOpenReview(d), "pl-btn-p");
    if (this.plugin.settings.modules.ai && this.plugin.ai.status().ok) {
      this.plButton(btns, "让 AI 起草", () => {
        this.plTogglePanel(true);
        this.plSend("用 week 命令取近 7 天的数据，起草本周复盘：里程碑、做得好、待改进、下周聚焦各 1–3 条。先给我看，等我确认后再用 review 命令写入。", "起草本周复盘");
      }, "pl-btn-s");
    }
  }

  // ───────── 任务日历（可选模块）─────────
  renderCalendar(el, d) {
    const base = plParseYmd(d.today);
    const first = new Date(base.getFullYear(), base.getMonth() + this.plCalOffset, 1);
    const { tile, r } = this.plTile(el, "calendar", `${first.getFullYear()}年${first.getMonth() + 1}月`, "数字是当天未完成的任务数，红色表示已经过期", "pl-cal");
    const nav = r.createDiv({ cls: "pl-cal-nav" });
    this.plButton(nav, "‹", () => { this.plCalOffset--; this.refresh(); }).setAttr("aria-label", "上个月");
    if (this.plCalOffset) this.plButton(nav, "本月", () => { this.plCalOffset = 0; this.refresh(); });
    this.plButton(nav, "›", () => { this.plCalOffset++; this.refresh(); }).setAttr("aria-label", "下个月");
    const byDate = {};
    d.tasks.forEach((t) => { const k = t.scheduled || t.due; if (k) (byDate[k] = byDate[k] || []).push(t); });
    const grid = tile.createDiv({ cls: "pl-cal-grid" });
    ["一", "二", "三", "四", "五", "六", "日"].forEach((w) => grid.createSpan({ cls: "pl-cal-head", text: w }));
    const lead = (first.getDay() + 6) % 7;
    for (let i = 0; i < lead; i++) grid.createSpan();
    const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    for (let n = 1; n <= days; n++) {
      const date = plYmd(new Date(first.getFullYear(), first.getMonth(), n));
      const list = byDate[date] || [];
      const cell = grid.createDiv({ cls: "pl-cal-day" + (date === d.today ? " is-today" : "") });
      cell.createSpan({ text: String(n) });
      if (list.length) {
        const open = list.filter((t) => !t.done).length;
        cell.createSpan({ cls: "pl-cal-count" + (!open ? " is-done" : date < d.today ? " is-overdue" : ""), text: String(open || list.length) });
        cell.setAttr("aria-label", list.map((t) => (t.done ? "✓ " : "· ") + t.title).join("\n"));
      }
      const diary = `${this.plugin.settings.dailyNotesFolder}/${date}.md`;
      if (this.app.vault.getAbstractFileByPath(diary)) { cell.addClass("has-diary"); cell.addEventListener("click", () => this.plOpen(diary)); }
    }
    const tail = (7 - ((lead + days) % 7)) % 7;
    for (let i = 0; i < tail; i++) grid.createSpan();
  }
  plIcon(parent, name, cls) { const s = parent.createSpan({ cls: "pl-ico " + (cls || "") }); (0, import_obsidian.setIcon)(s, name); return s; }
  plButton(parent, text, onClick, cls) {
    const b = parent.createEl("button", { cls: "pl-btn " + (cls || ""), text });
    b.addEventListener("click", (e) => { e.preventDefault(); onClick(e); });
    return b;
  }
  plOpen(path) {
    if (!path) return;
    this.app.workspace.openLinkText(path, "", false);
  }
  async plOpenReview(d) {
    const s = this.plugin.settings;
    if (!d.reviewExists) {
      const tf = this.app.vault.getAbstractFileByPath(s.reviewTemplate);
      const tpl = tf instanceof import_obsidian.TFile ? await this.app.vault.read(tf) : "---\n类型: 周复盘\n日期: {{date}}\ntags: [复盘]\n---\n# {{title}} 周复盘\n";
      if (!this.app.vault.getAbstractFileByPath(s.reviewFolder)) await this.app.vault.createFolder(s.reviewFolder);
      await this.app.vault.create(d.reviewPath, plFillTemplate(tpl, d.week.id, d.today));
    }
    this.plOpen(d.reviewPath);
  }
  plFocusQuick() {
    const el = this.plContentEl && this.plContentEl.querySelector(".pl-quick-input");
    if (!el) { this.showAddTaskModal(); return; }
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.focus();
  }
  async plQuickAdd(text) {
    const today = plToday();
    const p = plParseQuickTask(text, today, ((this.plData && this.plData.projects) || []).map((x) => x.name));
    if (!p.content) { new import_obsidian.Notice("任务内容是空的"); return; }
    if (p.projectMiss) { new import_obsidian.Notice(`没找到项目「${p.projectMiss}」，已放进「我的任务」`); }
    await this.plAddTask(p);
    this.plQuickDraft = "";
    this.plRefocusQuick = true;
    const when = p.due ? `截止 ${plShortDate(p.due, today)}` : p.scheduled !== today ? plShortDate(p.scheduled, today) : "";
    if (when || p.project) new import_obsidian.Notice(`已添加：${p.content}${when ? "（" + when + "）" : ""}${p.project ? " → " + p.project : ""}`);
    await this.refresh();
  }
  async plAddTask(p) {
    const s = this.plugin.settings;
    const line = plNewTaskLine({ content: p.content, time: p.time, tags: p.tags, priority: p.priority, scheduled: p.scheduled, due: p.due });
    if (p.project) {
      const path = `${s.projectFolder}/${p.project}.md`;
      const f = this.app.vault.getAbstractFileByPath(path);
      if (f instanceof import_obsidian.TFile) {
        await this.app.vault.process(f, (data) => plInsertUnderHeading(data, /^##\s+.*任务\s*$/, "## ✅ 任务", line));
        return path;
      }
    }
    await plAppendLine(this.app, s.taskFile, line, PL_TASKS_HEADER);
    return s.taskFile;
  }
  // 7. 任务菜单：推到明天、改日期、改优先级、打开文件、取消任务
  plTaskMenu(e, t) {
    const menu = new import_obsidian.Menu();
    const item = (title, icon, fn, opts) => menu.addItem((it) => {
      it.setTitle(title).setIcon(icon).onClick(fn);
      if (opts && opts.checked && it.setChecked) it.setChecked(true);
      if (opts && opts.warning && it.setWarning) it.setWarning(true);
    });
    if (!t.done) {
      item("推到明天", "arrow-right", () => this.plEditTask(t, (l) => plPostponeLine(l, plToday()), `「${t.title}」推到了明天`));
      item("改日期…", "calendar", () => new PlDateModal(this.app, t, (date, kind) => this.plEditTask(t, (l) => plSetTaskField(l, kind, date), `「${t.title}」改到 ${plShortDate(date, plToday())}`)).open());
      menu.addSeparator();
      [["🔺", "最高优先级"], ["⏫", "高优先级"], ["🔼", "中优先级"], ["🔽", "低优先级"], ["", "无优先级"]].forEach(([pr, name]) => {
        item(name, "flag", () => this.plEditTask(t, (l) => plSetTaskPriority(l, pr), `「${t.title}」设为${name}`), { checked: (t.priority || "") === pr });
      });
      menu.addSeparator();
    }
    item("打开所在笔记", "file-text", () => this.plOpen(t.path));
    if (!t.done) item("取消这件事", "x-circle", () => this.plEditTask(t, (l) => plCancelLine(l), `已取消「${t.title}」`), { warning: true });
    if (e instanceof MouseEvent) menu.showAtMouseEvent(e);
  }
  // 8. 改动任务行并给出可撤销的提示条
  async plEditTask(t, transform, label) {
    const file = this.app.vault.getAbstractFileByPath(t.path);
    if (!(file instanceof import_obsidian.TFile)) return;
    let oldLine = null, newLine = null;
    await this.app.vault.process(file, (data) => {
      const lines = data.split("\n");
      let idx = t.line;
      if (lines[idx] !== t.raw) idx = lines.indexOf(t.raw);
      if (idx < 0) return data;
      oldLine = lines[idx];
      newLine = transform(oldLine);
      if (newLine === oldLine) return data;
      lines[idx] = newLine;
      return lines.join("\n");
    });
    if (oldLine !== null && newLine !== oldLine) this.plToast(label, { path: t.path, oldLine, newLine });
    else if (oldLine === null) new import_obsidian.Notice("这条任务刚被改过，请再试一次");
    await this.refresh();
  }
  plToast(text, undo) {
    if (this.plToastEl) this.plToastEl.remove();
    window.clearTimeout(this.plToastTimer);
    const el = this.containerEl.createDiv({ cls: "pl-toast" });
    this.plToastEl = el;
    el.createSpan({ cls: "pl-toast-text", text });
    if (undo) {
      const b = el.createEl("button", { cls: "pl-toast-undo", text: "撤销" });
      b.addEventListener("click", async () => {
        el.remove();
        const f = this.app.vault.getAbstractFileByPath(undo.path);
        if (!(f instanceof import_obsidian.TFile)) return;
        await this.app.vault.process(f, (data) => {
          const lines = data.split("\n"), i = lines.indexOf(undo.newLine);
          if (i < 0) return data;
          lines[i] = undo.oldLine;
          return lines.join("\n");
        });
        await this.refresh();
      });
    }
    this.plToastTimer = window.setTimeout(() => { el.addClass("is-leaving"); window.setTimeout(() => el.remove(), 200); }, 6000);
  }
  async plFindSamples() {
    const s = this.plugin.settings, notes = [], lineFiles = [];
    for (const f of this.app.vault.getMarkdownFiles()) {
      const tags = this.app.metadataCache.getFileCache(f)?.frontmatter?.tags;
      const list = Array.isArray(tags) ? tags : typeof tags === "string" ? tags.replace(/[\[\]]/g, " ").split(/[\s,，]+/) : [];
      if (list.map((x) => String(x).replace(/^#/, "")).includes("示例")) notes.push(f);
    }
    for (const path of [s.taskFile, `${s.captureFolder}/我的闪念.md`, s.bookmarksFile]) {
      const f = this.app.vault.getAbstractFileByPath(path);
      if (!(f instanceof import_obsidian.TFile) || notes.includes(f)) continue;
      const n = (await this.app.vault.cachedRead(f)).split("\n").filter((l) => /(^|\s)#示例(\s|$)/.test(l)).length;
      if (n) lineFiles.push({ file: f, count: n });
    }
    return { notes, lineFiles };
  }
  async plClearSamples() {
    const found = await this.plFindSamples();
    const lineCount = found.lineFiles.reduce((a, x) => a + x.count, 0);
    if (!found.notes.length && !lineCount) { new import_obsidian.Notice("没有找到示例内容"); return; }
    new PlConfirmModal(this.app, "清除示例内容", [
      found.notes.length ? `${found.notes.length} 篇示例笔记：${found.notes.map((f) => f.basename).join("、")}（移到 .trash 回收站）` : "",
      lineCount ? `${lineCount} 条带 #示例 标签的任务、闪念和收藏` : "",
      "你自己写的内容不受影响。"
    ].filter(Boolean), "清除", async () => {
      for (const f of found.notes) await this.app.vault.trash(f, false);
      for (const { file } of found.lineFiles) {
        await this.app.vault.process(file, (data) => {
          const lines = data.split("\n"), out = [];
          let skipping = false;
          for (const l of lines) {
            if (/(^|\s)#示例(\s|$)/.test(l) && /^\s*- /.test(l)) { skipping = true; continue; }
            if (skipping && /^(\t|\s{2,})\S/.test(l) && !/^\s*- \[/.test(l)) continue;
            skipping = false;
            out.push(l);
          }
          return out.join("\n");
        });
      }
      this.plugin.settings.welcomeDismissed = true;
      await this.plugin.saveData(this.plugin.settings);
      new import_obsidian.Notice("示例内容已清除，开始写你自己的吧");
      this.refresh();
    }).open();
  }
  async renderHeaderImage(el) {
    const path = this.plugin.settings.headerImage;
    const f = path ? this.app.vault.getAbstractFileByPath(path) : null;
    const wrap = el.createDiv({ cls: "pl-banner" + (f ? "" : " is-empty") });
    if (f instanceof import_obsidian.TFile) {
      wrap.createEl("img", { attr: { src: this.app.vault.getResourcePath(f), alt: "" } });
      const x = wrap.createEl("button", { cls: "pl-banner-remove", attr: { "aria-label": "移除页眉图" } });
      (0, import_obsidian.setIcon)(x, "x");
      x.addEventListener("click", async (e) => { e.stopPropagation(); this.plugin.settings.headerImage = ""; await this.plugin.saveSettings(); });
    } else {
      wrap.createSpan({ text: "点击上传页眉图" });
    }
    wrap.addEventListener("click", () => this.showImageUploadDialog());
  }
  showImageUploadDialog() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
        const folder = (0, import_obsidian.normalizePath)(this.plugin.settings.attachmentFolder || "00-后台/附件");
        if (!this.app.vault.getAbstractFileByPath(folder)) await this.app.vault.createFolder(folder);
        const path = (0, import_obsidian.normalizePath)(`${folder}/主页页眉.${ext}`);
        const existing = this.app.vault.getAbstractFileByPath(path);
        const buf = await file.arrayBuffer();
        if (existing instanceof import_obsidian.TFile) await this.app.vault.modifyBinary(existing, buf);
        else await this.app.vault.createBinary(path, buf);
        this.plugin.settings.headerImage = path;
        await this.plugin.saveSettings();
      } catch (err) {
        console.error(err);
        new import_obsidian.Notice("页眉图保存失败");
      }
    });
    input.click();
  }

  // ───────── AI 悬浮球 + 对话面板 ─────────
  renderAssistant() {
    if (this.plFabEl) { this.plFabEl.remove(); this.plFabEl = null; }
    if (this.plPanelEl) { this.plPanelEl.remove(); this.plPanelEl = null; }
    this.plChatEl = null; this.plInput = null; this.plSendBtn = null;
    if (!this.plugin.settings.modules.ai) return;
    const host = this.containerEl;
    const st = this.plugin.ai.status();
    const panel = host.createDiv({ cls: "pl-panel" + (this.plPanelOpen ? " is-open" : "") });
    this.plPanelEl = panel;
    const head = panel.createDiv({ cls: "pl-panel-head" });
    const ttl = head.createDiv({ cls: "pl-panel-title" });
    ttl.createSpan({ cls: "pl-panel-name", text: "项目人生 AI" });
    ttl.createSpan({ cls: "pl-mute", text: st.ok ? `Claude · ${st.model}` : "仅记录模式" });
    const tools = head.createDiv({ cls: "pl-chat-tools" });
    if (st.ok) {
      const go = tools.createEl("button", { cls: "pl-link-btn", text: "在 Claudian 中继续" });
      go.addEventListener("click", () => { const c = this.plugin.ai.claudian(); if (c && c.activateView) c.activateView(); });
    }
    const clear = tools.createEl("button", { cls: "pl-icon-btn", attr: { "aria-label": "清空对话" } });
    (0, import_obsidian.setIcon)(clear, "trash-2");
    clear.addEventListener("click", () => { this.plugin.ai.reset(); this.plChat = []; this.plBusy = false; this.plUpdateSendBtn(); this.renderChat(); });
    const close = tools.createEl("button", { cls: "pl-icon-btn", attr: { "aria-label": "收起" } });
    (0, import_obsidian.setIcon)(close, "chevron-down");
    close.addEventListener("click", () => this.plTogglePanel(false));
    this.plChatEl = panel.createDiv({ cls: "pl-chat-list" });
    const form = panel.createDiv({ cls: "pl-panel-input" });
    const input = form.createEl("textarea", { cls: "pl-panel-text", attr: { rows: "1", placeholder: st.ok ? "问点什么，或说「周五前交方案」…" : "「闪念：…」「任务：…」「跑步打卡」" } });
    this.plInput = input;
    const fit = () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; };
    input.addEventListener("input", fit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); this.plSend(input.value); }
    });
    const send = form.createEl("button", { cls: "pl-send", attr: { "aria-label": "发送" } });
    this.plSendBtn = send;
    send.addEventListener("click", () => { if (this.plBusy) this.plugin.ai.stop(); else this.plSend(input.value); });
    this.plUpdateSendBtn();
    this.renderChat();

    const fab = host.createEl("button", { cls: "pl-fab" + (this.plPanelOpen ? " is-open" : ""), attr: { "aria-label": "项目人生 AI（可拖动）" } });
    this.plFabEl = fab;
    (0, import_obsidian.setIcon)(fab, this.plPanelOpen ? "x" : "sparkles");
    this.plApplyFabPos();
    // 拖动：按住移动即可换位置，松手后贴到最近的左右两侧并记住；轻点则展开 / 收起面板
    let start = null, moved = false;
    fab.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      start = { x: e.clientX, y: e.clientY, rect: host.getBoundingClientRect() };
      moved = false;
      try { fab.setPointerCapture(e.pointerId); } catch (err) {}
    });
    fab.addEventListener("pointermove", (e) => {
      if (!start) return;
      if (!moved && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 5) return;
      moved = true;
      fab.addClass("is-dragging");
      const r = start.rect;
      const x = Math.min(Math.max(e.clientX - r.left, 28), r.width - 28);
      const y = Math.min(Math.max(e.clientY - r.top, 28), r.height - 28);
      fab.style.right = "auto";
      fab.style.left = `${x - 28}px`;
      fab.style.bottom = `${r.height - y - 28}px`;
    });
    const end = async (e) => {
      if (!start) return;
      const r = start.rect;
      start = null;
      fab.removeClass("is-dragging");
      if (!moved) { this.plTogglePanel(); return; }
      const side = e.clientX - r.left < r.width / 2 ? "left" : "right";
      const bottom = Math.round(Math.min(Math.max(r.bottom - e.clientY - 28, 16), r.height - 72));
      this.plugin.settings.fabPos = { side, bottom };
      this.plApplyFabPos();
      await this.plugin.saveData(this.plugin.settings);
    };
    fab.addEventListener("pointerup", end);
    fab.addEventListener("pointercancel", () => { start = null; fab.removeClass("is-dragging"); this.plApplyFabPos(); });
  }
  plApplyFabPos() {
    const pos = Object.assign({ side: "right", bottom: 28 }, this.plugin.settings.fabPos || {});
    const fab = this.plFabEl, panel = this.plPanelEl;
    if (!fab) return;
    const gap = 24;
    fab.style.left = pos.side === "left" ? `${gap}px` : "auto";
    fab.style.right = pos.side === "right" ? `${gap}px` : "auto";
    fab.style.bottom = `${pos.bottom}px`;
    if (panel) {
      panel.style.left = pos.side === "left" ? `${gap}px` : "auto";
      panel.style.right = pos.side === "right" ? `${gap}px` : "auto";
      panel.style.bottom = `${pos.bottom + 68}px`;
      panel.style.maxHeight = `min(640px, calc(100% - ${pos.bottom + 68 + 16}px))`;
    }
  }
  plTogglePanel(open) {
    this.plPanelOpen = open === void 0 ? !this.plPanelOpen : !!open;
    if (this.plPanelEl) this.plPanelEl.toggleClass("is-open", this.plPanelOpen);
    if (this.plFabEl) {
      this.plFabEl.toggleClass("is-open", this.plPanelOpen);
      this.plFabEl.empty();
      (0, import_obsidian.setIcon)(this.plFabEl, this.plPanelOpen ? "x" : "sparkles");
      if (this.plPanelOpen) this.plFabEl.removeClass("has-unread");
    }
    if (this.plPanelOpen && this.plInput) setTimeout(() => this.plInput && this.plInput.focus(), 30);
    if (this.plPanelOpen && this.plChatEl) this.plChatEl.scrollTop = this.plChatEl.scrollHeight;
  }
  plUpdateSendBtn() {
    if (this.plFabEl) this.plFabEl.toggleClass("is-busy", this.plBusy);
    if (!this.plSendBtn) return;
    this.plSendBtn.empty();
    (0, import_obsidian.setIcon)(this.plSendBtn, this.plBusy ? "square" : "arrow-up");
    this.plSendBtn.setAttr("aria-label", this.plBusy ? "停止" : "发送");
    this.plSendBtn.toggleClass("is-busy", this.plBusy);
  }
  plFocusInput() {
    if (!this.plPanelEl) return;
    this.plTogglePanel(true);
  }
  renderChat() {
    const list = this.plChatEl;
    if (!list) return;
    list.empty();
    const st = this.plugin.ai.status();
    if (!this.plChat.length) {
      const w = list.createDiv({ cls: "pl-chat-empty" });
      w.createDiv({ cls: "pl-chat-hello", text: st.ok ? "想记点什么，或者问点什么？" : "想记点什么？" });
      if (st.ok) {
        const sug = w.createDiv({ cls: "pl-chat-sugs" });
        [["今天先做什么", "今天该先做什么？结合逾期、今日任务和项目进展，给我最多 3 条建议，并说明理由。"],
         ["整理我的闪念", "看看我还没整理的闪念，归类后建议哪些值得转成任务、哪些值得写成笔记。先给建议，不要改文件。"],
         ["起草本周复盘", "用 week 命令取近 7 天的数据，起草本周复盘：里程碑、做得好、待改进、下周聚焦各 1–3 条。先给我看，等我确认后再用 review 命令写入。"]
        ].forEach(([label, prompt]) => {
          const b = sug.createEl("button", { cls: "pl-sug", text: label + " →" });
          b.addEventListener("click", () => this.plSend(prompt, label));
        });
      }
      w.createDiv({ cls: "pl-mute pl-chat-tip", text: st.ok ? "也可以直接记：「闪念：…」「跑步打卡」「周五前交方案」" : `直接记：「闪念：…」「任务：…」「跑步打卡」。AI 对话不可用：${st.reason}。` });
      return;
    }
    this.plChat.slice(-12).forEach((m) => {
      const item = list.createDiv({ cls: "pl-msg is-" + m.role });
      if (m.role === "assistant") { const R = import_obsidian.MarkdownRenderer; if (R.render) R.render(this.app, m.text, item, "", this); else R.renderMarkdown(m.text, item, "", this); }
      else item.setText(m.text);
    });
    list.scrollTop = list.scrollHeight;
  }
  async plSend(raw, display) {
    const text = String(raw || "").trim();
    if (!text || this.plBusy) return;
    const shown = display || text;
    if (this.plInput) { this.plInput.value = ""; this.plInput.style.height = "auto"; }
    const st = this.plugin.ai.status();
    const notify = () => { if (!this.plPanelOpen && this.plFabEl) this.plFabEl.addClass("has-unread"); };
    const quick = await this.plQuickCapture(text, st.ok);
    if (quick) {
      this.plChat.push({ role: "user", text: shown }, { role: "assistant", text: quick });
      this.renderChat(); notify();
      this.refresh();
      return;
    }
    if (!st.ok) {
      await this.saveCapture(text, "");
      this.plChat.push({ role: "user", text: shown }, { role: "assistant", text: `已记为闪念。\n\n（${st.reason}，所以没有交给 AI。）` });
      this.renderChat(); notify();
      return;
    }
    this.plChat.push({ role: "user", text: shown });
    const status = { role: "status", text: "思考中…" };
    this.plChat.push(status);
    this.plBusy = true;
    this.plUpdateSendBtn();
    this.renderChat();
    let draft = null;
    try {
      const answer = await this.plugin.ai.ask(text, {
        onText: (t) => { if (!draft) { draft = { role: "assistant", text: t }; this.plChat.splice(this.plChat.indexOf(status), 0, draft); } else draft.text = t; this.renderChat(); },
        onTool: (desc) => { status.text = desc; this.renderChat(); }
      });
      if (draft) draft.text = answer; else this.plChat.push({ role: "assistant", text: answer });
    } catch (e) {
      this.plChat.push({ role: "error", text: e && e.message ? e.message : String(e) });
    } finally {
      const i = this.plChat.indexOf(status);
      if (i >= 0) this.plChat.splice(i, 1);
      this.plBusy = false;
      this.plUpdateSendBtn();
      this.renderChat(); notify();
    }
  }
  // 一句话捕获：固定说法直接写入，不经过 AI（手机上也能用）
  async plQuickCapture(text, aiOk) {
    let m = text.match(/^(?:闪念|想法|灵感)\s*[:：]\s*([\s\S]+)$/);
    if (m) { await this.saveCapture(m[1].trim(), ""); return "💡 已记下闪念。"; }
    m = text.match(/^(?:任务|待办|todo)\s*[:：]\s*([\s\S]+)$/i);
    if (m && !aiOk) { await this.saveNewTask(m[1].trim(), "", "", ""); return "✅ 已加入「我的任务」。"; }
    m = text.match(/^(?:打卡\s*[:：]?\s*(.+)|(.+?)\s*打卡)$/);
    if (m) {
      const name = (m[1] || m[2] || "").replace(/^(今天|已经)/, "").trim();
      const habits = plParseHabits(await this.plRead(this.plugin.settings.habitsFile) || "");
      const hit = habits.find((h) => h.name === name) || (habits.filter((h) => h.name.includes(name) || name.includes(h.name)).length === 1 ? habits.find((h) => h.name.includes(name) || name.includes(h.name)) : null);
      if (hit) {
        await this.toggleHabit(hit.name, plToday(), true);
        const dates = new Set(hit.dates.concat([plToday()]));
        let n = 0, day = plToday();
        while (dates.has(day)) { n++; day = plAddDays(day, -1); }
        return `🔥 「${hit.name}」今天已打卡，连续 ${n} 天。`;
      }
    }
    return null;
  }

  // ───────── 写入（全部原子写入，见规范 §0.4）─────────
  async saveCapture(content, tags) {
    const path = `${this.plugin.settings.captureFolder}/我的闪念.md`;
    const tagStr = plTagList(tags).map((t) => "#" + t).join(" ");
    const body = String(content).trim().replace(/\r?\n/g, "\n\t");
    await plAppendLine(this.app, path, `- ${plNow()} ${body}${tagStr ? " " + tagStr : ""}`, PL_IDEAS_HEADER);
  }
  async saveNewTask(content, date, time, tags) {
    await plAppendLine(this.app, this.plugin.settings.taskFile, plNewTaskLine({ content, time, tags, scheduled: date || "" }), PL_TASKS_HEADER);
  }
  async toggleTask(path, lineIndex, done, raw) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof import_obsidian.TFile)) return;
    await this.app.vault.process(file, (data) => {
      const lines = data.split("\n");
      let idx = lineIndex;
      // 文件在主页渲染后被改过（如 OpenClaw 插入了新行）时，按原文重新定位，避免勾错任务
      if (raw !== void 0 && lines[idx] !== raw) idx = lines.indexOf(raw);
      if (idx < 0 || !/^\s*- \[[ xX/]\]/.test(lines[idx] || "")) return data;
      lines[idx] = plSetTaskDone(lines[idx], done);
      return lines.join("\n");
    });
  }
  async toggleHabit(habitName, date, checked) {
    const f = this.app.vault.getAbstractFileByPath(this.plugin.settings.habitsFile);
    if (!(f instanceof import_obsidian.TFile)) return;
    await this.app.vault.process(f, (data) => plToggleHabitInContent(data, habitName, date, checked));
  }
  async addNewHabit(name) {
    const heading = "## " + name;
    const path = this.plugin.settings.habitsFile;
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof import_obsidian.TFile)) {
      const dir = path.substring(0, path.lastIndexOf("/"));
      if (dir && !this.app.vault.getAbstractFileByPath(dir)) await this.app.vault.createFolder(dir);
      await this.app.vault.create(path, PL_HABITS_HEADER + "\n" + heading + "\n");
    } else {
      await this.app.vault.process(f, (data) => data.replace(/\s*$/, "") + "\n\n" + heading + "\n");
    }
  }
  showAddProjectModal() { new AddProjectModal(this.app, this.plugin, async () => { await this.refresh(); }).open(); }
  showAddTaskModal(prefill) { new AddTaskModal(this.app, this.plugin, async () => { await this.refresh(); }, this, prefill).open(); }
};

var PlDateModal = class extends import_obsidian.Modal {
  constructor(app, task, onPick) { super(app); this.task = task; this.onPick = onPick; }
  onOpen() {
    const { contentEl } = this, t = this.task;
    contentEl.addClass("pl-modal");
    contentEl.createEl("h2", { text: "改日期" });
    contentEl.createDiv({ cls: "setting-item-description", text: t.title });
    let date = t.scheduled || t.due || plAddDays(plToday(), 1), kind = t.due && !t.scheduled ? "📅" : "⏳";
    new import_obsidian.Setting(contentEl).setName("日期").addText((x) => { x.inputEl.type = "date"; x.setValue(date).onChange((v) => { date = v; }); })
      .addDropdown((dd) => dd.addOption("⏳", "打算这天做").addOption("📅", "最晚这天完成").setValue(kind).onChange((v) => { kind = v; }));
    new import_obsidian.Setting(contentEl).addButton((b) => b.setButtonText("取消").onClick(() => this.close()))
      .addButton((b) => b.setButtonText("确定").setCta().onClick(() => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { new import_obsidian.Notice("请选择日期"); return; }
        this.close(); this.onPick(date, kind);
      }));
  }
  onClose() { this.contentEl.empty(); }
};
var PlConfirmModal = class extends import_obsidian.Modal {
  constructor(app, title, lines, okText, onOk) { super(app); this.t = title; this.lines = lines; this.okText = okText; this.onOk = onOk; }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("pl-modal");
    contentEl.createEl("h2", { text: this.t });
    const ul = contentEl.createEl("ul");
    this.lines.forEach((l) => ul.createEl("li", { text: l }));
    new import_obsidian.Setting(contentEl).addButton((b) => b.setButtonText("取消").onClick(() => this.close()))
      .addButton((b) => b.setButtonText(this.okText).setWarning().onClick(async () => { this.close(); await this.onOk(); }));
  }
  onClose() { this.contentEl.empty(); }
};
var AddHabitModal = class extends import_obsidian.Modal {
  constructor(app, view) { super(app); this.view = view; }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("pl-modal");
    contentEl.createEl("h2", { text: "添加习惯" });
    let value = "";
    const submit = async () => {
      const name = value.trim().replace(/^#+\s*/, "");
      if (!name) { new import_obsidian.Notice("请输入习惯名称"); return; }
      await this.view.addNewHabit(name);
      this.close();
      this.view.refresh();
    };
    new import_obsidian.Setting(contentEl).setName("习惯名称").setDesc("可以在前面加一个表情，例如：🏃 运动").addText((t) => {
      t.setPlaceholder("🏃 运动").onChange((v) => { value = v; });
      t.inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing) submit(); });
      setTimeout(() => t.inputEl.focus(), 50);
    });
    new import_obsidian.Setting(contentEl).addButton((b) => b.setButtonText("添加").setCta().onClick(submit));
  }
  onClose() { this.contentEl.empty(); }
};

var ProjectLifeDashboardSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
  display() {
    const { containerEl } = this;
    const s = this.plugin.settings;
    containerEl.empty();
    containerEl.createEl("h2", { text: "项目人生系统设置" });
    new import_obsidian.Setting(containerEl).setName("启动时打开主页").setDesc("打开 Obsidian 时自动在中间打开主页，并固定为标签页").addToggle((t) => t.setValue(s.openOnStartup !== false).onChange(async (v) => { s.openOnStartup = v; await this.plugin.saveSettings(); }));

    new import_obsidian.Setting(containerEl).setName("欢迎栏").setDesc("重新显示首次打开时主页里的「欢迎」一栏（含「清除示例内容」）").addButton((b) => b.setButtonText("重新显示").onClick(async () => { s.welcomeDismissed = false; await this.plugin.saveSettings(); }));
    containerEl.createEl("h3", { text: "显示哪些模块" });
    PL_MODULES.forEach(([key, name, desc]) => {
      new import_obsidian.Setting(containerEl).setName(name).setDesc(desc).addToggle((t) => t.setValue(!!s.modules[key]).onChange(async (v) => { s.modules[key] = v; await this.plugin.saveSettings(); }));
    });

    containerEl.createEl("h3", { text: "AI 对话" });
    const st = this.plugin.ai.status();
    new import_obsidian.Setting(containerEl).setName("状态").setDesc(st.ok ? `可用：借用 Claudian 的 Claude CLI（${st.cli}），模型 ${st.model}` : `不可用：${st.reason}。不影响「闪念：」「跑步打卡」这类一句话记录。`);
    new import_obsidian.Setting(containerEl).setName("模型").setDesc("留空则跟随 Claudian 的模型设置；也可以填 haiku、sonnet、opus 或完整模型名").addText((t) => t.setPlaceholder("跟随 Claudian").setValue(s.aiModel || "").onChange(async (v) => { s.aiModel = v.trim(); await this.plugin.saveData(s); }));

    containerEl.createEl("h3", { text: "文件位置" });
    const path = (name, key, desc) => new import_obsidian.Setting(containerEl).setName(name).setDesc(desc).addText((t) => t.setValue(s[key] || "").onChange(async (v) => { s[key] = v.trim(); await this.plugin.saveData(s); }));
    path("项目文件夹", "projectFolder", "例如：02-项目/1.进行项目");
    path("日记文件夹", "dailyNotesFolder", "例如：03-行动/日记");
    path("任务文件", "taskFile", "例如：01-捕获/我的任务.md");
    path("捕获文件夹", "captureFolder", "「我的闪念.md」所在文件夹");
    path("习惯追踪文件", "habitsFile", "例如：01-捕获/习惯追踪.md");
    path("收藏夹文件", "bookmarksFile", "例如：01-捕获/收藏夹.md");
    path("项目模板", "projectTemplate", "例如：00-后台/模板/项目模板.md");
    path("周复盘文件夹", "reviewFolder", "例如：04-复盘/周复盘");
    path("周复盘模板", "reviewTemplate", "例如：00-后台/模板/复盘模板.md");
  }
};

var AddProjectModal = class extends import_obsidian.Modal {
  plugin;
  onSubmit;
  constructor(app, plugin, onSubmit) {
    super(app);
    this.plugin = plugin;
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("project-modal");
    contentEl.createEl("h2", { text: "新建项目" });
    new import_obsidian.Setting(contentEl).setName("项目名称").addText((text) => {
      text.inputEl.id = "project-name";
      text.setPlaceholder("输入项目名称");
    });
    new import_obsidian.Setting(contentEl).setName("项目目标").addText((text) => {
      text.inputEl.id = "project-goal";
      text.setPlaceholder("例如：5000粉丝");
    });
    new import_obsidian.Setting(contentEl).setName("项目领域").addDropdown((dropdown) => {
      dropdown.inputEl.id = "project-area";
      dropdown.addOption("财富", "财富");
      dropdown.addOption("健康", "健康");
      dropdown.addOption("关系", "关系");
      dropdown.addOption("成长", "成长");
      dropdown.addOption("其他", "其他");
    });
    new import_obsidian.Setting(contentEl).setName("项目描述").addTextArea((text) => {
      text.inputEl.id = "project-desc";
      text.setPlaceholder("写下你的项目描述或愿景");
      text.inputEl.rows = 4;
    });
    new import_obsidian.Setting(contentEl).addButton((btn) => btn.setButtonText("取消").onClick(() => {
      this.close();
    })).addButton((btn) => btn.setButtonText("创建").setCta().onClick(async () => {
      await this.createProject();
    }));
  }
  async createProject() {
    const nameEl = this.contentEl.querySelector("#project-name");
    const goalEl = this.contentEl.querySelector("#project-goal");
    const areaEl = this.contentEl.querySelector("#project-area");
    const descEl = this.contentEl.querySelector("#project-desc");
    const name = nameEl?.value.trim();
    const goal = goalEl?.value.trim();
    const area = areaEl?.value || "其他";
    const desc = descEl?.value.trim();
    if (!name) {
      new import_obsidian.Notice("请输入项目名称");
      return;
    }
    const safeName = plSafeFileName(name);
    if (!safeName) {
      new import_obsidian.Notice("项目名称无效");
      return;
    }
    const today = plToday();
    const projectPath = (0, import_obsidian.normalizePath)(`${this.plugin.settings.projectFolder}/${safeName}.md`);
    try {
      if (this.app.vault.getAbstractFileByPath(projectPath)) {
        new import_obsidian.Notice("项目已存在");
        return;
      }
      const tplFile = this.app.vault.getAbstractFileByPath(this.plugin.settings.projectTemplate || "00-后台/模板/项目模板.md");
      const tpl = tplFile instanceof import_obsidian.TFile ? await this.app.vault.read(tplFile) : PL_DEFAULT_PROJECT;
      let content = plFillTemplate(tpl || PL_DEFAULT_PROJECT, safeName, today);
      if (goal) content = content.replace(/^目标:.*$/m, "目标: " + plYamlValue(goal));
      content = content.replace(/^领域:.*$/m, "领域: " + plYamlValue(area));
      if (desc) {
        const quote = "> " + desc.replace(/\r?\n/g, "\n> ");
        content = /^> 一句话写清楚：.*$/m.test(content)
          ? content.replace(/^> 一句话写清楚：.*$/m, () => quote)
          : content.replace(/^## 🎯 项目描述\s*$/m, (h) => h + "\n\n" + quote);
      }
      const dir = projectPath.substring(0, projectPath.lastIndexOf("/"));
      if (dir && !this.app.vault.getAbstractFileByPath(dir)) await this.app.vault.createFolder(dir);
      await this.app.vault.create(projectPath, content);
      new import_obsidian.Notice(`项目 "${name}" 创建成功`);
      this.close();
      if (this.onSubmit) {
        await this.onSubmit();
      }
      this.app.workspace.openLinkText(projectPath, "", false);
    } catch (error) {
      console.error("Failed to create project:", error);
      new import_obsidian.Notice("创建项目失败");
    }
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};
var AddTaskModal = class extends import_obsidian.Modal {
  constructor(app, plugin, onSubmit, view, prefill) {
    super(app);
    this.plugin = plugin;
    this.onSubmit = onSubmit;
    this.view = view;
    const today = plToday();
    const p = prefill || {};
    this.v = { content: p.content || "", date: p.due || p.scheduled || today, noDate: false, kind: p.due ? "due" : "scheduled",
      time: p.time || "", priority: p.priority || "", project: p.project || "", tags: (p.tags || []).join(" ") };
  }
  onOpen() {
    const { contentEl } = this, v = this.v;
    contentEl.empty();
    contentEl.addClass("pl-modal");
    contentEl.createEl("h2", { text: "添加任务" });
    new import_obsidian.Setting(contentEl).setName("任务内容").addText((t) => {
      t.setPlaceholder("写周报").setValue(v.content).onChange((x) => { v.content = x; });
      t.inputEl.style.width = "100%";
      t.inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing) this.save(); });
      setTimeout(() => t.inputEl.focus(), 50);
    });
    const dateSet = new import_obsidian.Setting(contentEl).setName("日期").addText((t) => {
      t.inputEl.type = "date";
      t.setValue(v.date).onChange((x) => { v.date = x; });
    }).addDropdown((dd) => dd.addOption("scheduled", "打算这天做 ⏳").addOption("due", "最晚这天完成 📅").setValue(v.kind).onChange((x) => { v.kind = x; }));
    new import_obsidian.Setting(contentEl).setName("不设日期").setDesc("只放进清单，不出现在某一天").addToggle((t) => t.setValue(false).onChange((x) => { v.noDate = x; dateSet.settingEl.toggleClass("is-disabled", x); }));
    new import_obsidian.Setting(contentEl).setName("时间").setDesc("可选，例如 14:00 或 14:00-15:00").addText((t) => t.setPlaceholder("14:00-15:00").setValue(v.time).onChange((x) => { v.time = x; }));
    new import_obsidian.Setting(contentEl).setName("优先级").addDropdown((dd) => {
      dd.addOption("", "无").addOption("🔺", "最高 🔺").addOption("⏫", "高 ⏫").addOption("🔼", "中 🔼").addOption("🔽", "低 🔽");
      dd.setValue(v.priority).onChange((x) => { v.priority = x; });
    });
    const folder = this.plugin.settings.projectFolder + "/";
    const projects = this.app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(folder)).map((f) => f.basename).sort((a, b) => a.localeCompare(b, "zh"));
    new import_obsidian.Setting(contentEl).setName("放进项目").setDesc("不选则放进「我的任务」").addDropdown((dd) => {
      dd.addOption("", "不放进项目");
      projects.forEach((n) => dd.addOption(n, n));
      dd.setValue(projects.includes(v.project) ? v.project : "").onChange((x) => { v.project = x; });
    });
    new import_obsidian.Setting(contentEl).setName("标签").setDesc("空格分隔，可省略 #").addText((t) => t.setPlaceholder("工作 学习").setValue(v.tags).onChange((x) => { v.tags = x; }));
    new import_obsidian.Setting(contentEl)
      .addButton((b) => b.setButtonText("取消").onClick(() => this.close()))
      .addButton((b) => b.setButtonText("添加").setCta().onClick(() => this.save()));
  }
  async save() {
    const v = this.v;
    const content = String(v.content || "").trim();
    if (!content) { new import_obsidian.Notice("请输入任务内容"); return; }
    let time = String(v.time || "").trim();
    if (time) {
      const m = time.match(/^(\d{1,2})[:：](\d{2})(?:\s*-\s*(\d{1,2})[:：](\d{2}))?$/);
      if (!m) { new import_obsidian.Notice("时间格式应为 14:00 或 14:00-15:00"); return; }
      time = plPad(+m[1]) + ":" + m[2] + (m[3] ? "-" + plPad(+m[3]) + ":" + m[4] : "");
    }
    const date = v.noDate ? "" : /^\d{4}-\d{2}-\d{2}$/.test(v.date) ? v.date : "";
    const p = { content, time, priority: v.priority, project: v.project, tags: plTagList(v.tags),
      scheduled: date && v.kind === "scheduled" ? date : "", due: date && v.kind === "due" ? date : "" };
    try {
      if (this.view && this.view.plAddTask) await this.view.plAddTask(p);
      else await plAppendLine(this.app, this.plugin.settings.taskFile, plNewTaskLine(p), PL_TASKS_HEADER);
      this.close();
      if (this.onSubmit) await this.onSubmit();
    } catch (e) {
      console.error(e);
      new import_obsidian.Notice("添加任务失败");
    }
  }
  onClose() { this.contentEl.empty(); }
};
