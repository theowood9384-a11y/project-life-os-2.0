#!/usr/bin/env node
// 项目人生 OS · OpenClaw 写入工具
// 严格按《00-后台/数据格式规范.md》v1.0 读写 vault。只依赖 Node 内置模块。
//
// 用法：node pl.mjs <命令> [--vault 路径] <<'PL_EOF'
//       { ...JSON 参数... }
//       PL_EOF
// 输出：一行 JSON。ok=true 时 message 是可直接回复给用户的中文；ok=false 时 error 说明原因。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ───────────────────────── 路径（规范 §1）─────────────────────────
const SPEC_FILE = "00-后台/数据格式规范.md";
const P = {
  tasks: "01-捕获/我的任务.md",
  ideas: "01-捕获/我的闪念.md",
  habits: "01-捕获/习惯追踪.md",
  bookmarks: "01-捕获/收藏夹.md",
  projects: "02-项目/1.进行项目",
  archive: "02-项目/2.归档项目",
  diary: "03-行动/日记",
  review: "04-复盘/周复盘",
  templates: "00-后台/模板",
};
// 规范 §10：外部程序只允许写这些位置
const WRITABLE = ["01-捕获/", "02-项目/1.进行项目/", "02-项目/2.归档项目/", "03-行动/日记/", "04-复盘/周复盘/"];
const HEADERS = {
  tasks: "---\n类型: 任务收件箱\n---\n# 我的任务\n\n",
  ideas: "---\n类型: 闪念收集箱\n---\n# 我的闪念\n\n",
  habits: "---\n类型: 习惯追踪\n---\n# 习惯追踪\n",
  bookmarks: "---\n类型: 收藏夹\n---\n# 收藏夹\n\n## 📥 待整理\n",
};
const AREAS = ["财富", "健康", "关系", "成长", "其他"];
const STATUSES = ["进行中", "暂停", "完成", "放弃"];
const PRIORITY = { 最高: "🔺", highest: "🔺", 高: "⏫", high: "⏫", 中: "🔼", medium: "🔼", 低: "🔽", low: "🔽" };
// 规范 §6.1 情绪表
const EMOTIONS = {
  happy: ["开心", "😊"], sad: ["悲伤", "😢"], angry: ["愤怒", "😠"], anxious: ["焦虑", "😰"], calm: ["平静", "😌"],
  neutral: ["平常", "😐"], excited: ["兴奋", "🤩"], tired: ["疲惫", "😴"], grateful: ["感恩", "🙏"], stressed: ["压力", "😫"],
};
const EMOTION_ALIASES = { 高兴: "happy", 快乐: "happy", 难过: "sad", 伤心: "sad", 生气: "angry", 紧张: "anxious", 担心: "anxious",
  放松: "calm", 一般: "neutral", 还行: "neutral", 激动: "excited", 累: "tired", 困: "tired", 感激: "grateful", 烦: "stressed", 压力大: "stressed" };

// ───────────────────────── 基础工具 ─────────────────────────
class UserError extends Error {}
const fail = (msg) => { throw new UserError(msg); };
const pad = (n) => String(n).padStart(2, "0");
const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const parseYmd = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const NOW = process.env.PL_NOW ? new Date(process.env.PL_NOW) : new Date(); // PL_NOW 仅供测试
const TODAY = ymd(NOW);

// 自然日期 → YYYY-MM-DD。与主页插件的 plParseDateWord 是同一套规则，由 .release/tests 检查两边一致：
// 今天/今日/明天/明日/后天/大后天/昨天/前天、3天后、周五、下周三、下下周一、11月20日、11/20、2026-11-20
const CN_WD = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 日: 7, 天: 7 };
function validYmd(y, m, d) {
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? ymd(dt) : "";
}
function parseDateWord(w, base) {
  const s = String(w || "").trim().replace(/\s+/g, "");
  let m;
  if ((m = s.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})[日号]?$/))) return validYmd(+m[1], +m[2], +m[3]);
  if ((m = s.match(/^(\d{1,2})(?:月|\/|-)(\d{1,2})[日号]?$/))) {
    const y = base.getFullYear();
    let d = validYmd(y, +m[1], +m[2]);
    if (d && d < ymd(addDays(base, -60))) d = validYmd(y + 1, +m[1], +m[2]); // 12 月里说「1月5日」= 明年
    return d;
  }
  const rel = { 今天: 0, 今日: 0, 明天: 1, 明日: 1, 后天: 2, 大后天: 3, 昨天: -1, 前天: -2 };
  if (s in rel) return ymd(addDays(base, rel[s]));
  if ((m = s.match(/^(\d+)天(?:以)?后$/))) return ymd(addDays(base, +m[1]));
  if ((m = s.match(/^(下下|下|本|这)?(?:周|星期|礼拜)([一二三四五六日天1-7])$/))) {
    const target = CN_WD[m[2]] || +m[2];
    const todayIdx = ((base.getDay() + 6) % 7) + 1; // 周一=1 … 周日=7
    const monday = addDays(base, 1 - todayIdx);
    let weekOffset = m[1] === "下" ? 1 : m[1] === "下下" ? 2 : 0;
    if (!m[1] && target < todayIdx) weekOffset = 1; // 说「周一」而今天已过周一 → 下周一
    return ymd(addDays(monday, weekOffset * 7 + target - 1));
  }
  return "";
}
function parseDate(input, base = NOW) {
  if (input === undefined || input === null || input === "") return "";
  const d = parseDateWord(input, base);
  if (!d) fail(`看不懂日期「${input}」，请用 2026-11-20、11月20日、明天、周五、下周三 这类说法`);
  return d;
}
// 时间：14:00、14:00-15:00、下午3点、3点半、晚上8点到9点（与主页插件 plParseTimeWord 同一套规则）
const TIME_RE = /^(上午|早上|中午|下午|晚上)?(\d{1,2})(?::|：|点)(\d{2}|半)?分?(?:[-~到至](上午|早上|中午|下午|晚上)?(\d{1,2})(?::|：|点)(\d{2}|半)?分?)?$/;
function parseTimeWord(text) {
  const m = String(text || "").replace(/\s+/g, "").match(TIME_RE);
  if (!m) return "";
  const hr = (ap, h) => { h = +h; if (ap && /下午|晚上/.test(ap) && h < 12) h += 12; if (ap === "中午" && h < 11) h += 12; return h; };
  const mn = (x) => (x === "半" ? "30" : x || "00");
  const h1 = hr(m[1], m[2]);
  if (h1 > 23 || +mn(m[3]) > 59) return "";
  const a = `${pad(h1)}:${mn(m[3])}`;
  if (m[5] === undefined) return a;
  const h2 = hr(m[4] || m[1], m[5]);
  if (h2 > 23 || +mn(m[6]) > 59) return a;
  const b = `${pad(h2)}:${mn(m[6])}`;
  return b > a ? `${a}-${b}` : a;
}
function parseTime(input) {
  if (!input) return "";
  const t = parseTimeWord(input);
  if (!t) fail(`看不懂时间「${input}」，请用 14:00、14:00-15:00 或 下午3点`);
  return t;
}
function isoWeek(d) {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7));
  const w1 = new Date(t.getFullYear(), 0, 4);
  const week = 1 + Math.round(((t - w1) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7);
  return `${t.getFullYear()}-W${pad(week)}`;
}
// 一行文字：去掉换行与会被误认为 Tasks 字段的符号
const oneLine = (s) => String(s || "").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
const stripFields = (s) => oneLine(s).replace(/[🛫⏳📅✅➕❌🔁🔺⏫🔼🔽⏬]/gu, "").replace(/\s+/g, " ").trim();
const tagList = (t) => (Array.isArray(t) ? t : String(t || "").split(/[\s,，]+/))
  .map((x) => String(x).replace(/^#+/, "").trim()).filter((x) => x && !/\s/.test(x));
const tagStr = (t) => tagList(t).map((x) => "#" + x).join(" ");
const cleanTask = (text) => String(text || "")
  .replace(/(🛫|⏳|📅|✅|➕|❌)️?\s*\d{4}-\d{2}-\d{2}/gu, " ")
  .replace(/🔁️?\s*[^📅⏳🛫✅➕❌🔺⏫🔼🔽⏬#]*/gu, " ")
  .replace(/[🔺⏫🔼🔽⏬]️?/gu, " ")
  .replace(/(^|\s)#[^\s#]+/g, " ")
  .replace(/^\s*\d{1,2}:\d{2}(?:\s*-\s*\d{1,2}:\d{2})?(?=\s|$)/, " ")
  .replace(/\s+/g, " ").trim();

// ───────────────────────── vault 读写 ─────────────────────────
function findVault(argVault) {
  const cand = argVault || process.env.PROJECT_LIFE_VAULT;
  if (cand) {
    const v = path.resolve(cand.replace(/^~(?=\/)/, process.env.HOME || "~"));
    if (!fs.existsSync(path.join(v, SPEC_FILE))) fail(`「${v}」不是项目人生 vault（找不到 ${SPEC_FILE}）`);
    return v;
  }
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, SPEC_FILE))) return dir;
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  fail("找不到项目人生 vault：请设置环境变量 PROJECT_LIFE_VAULT 为 vault 文件夹路径");
}
let VAULT = "";
const abs = (rel) => path.join(VAULT, rel);
const exists = (rel) => fs.existsSync(abs(rel));
const read = (rel) => (exists(rel) ? fs.readFileSync(abs(rel), "utf8") : "");
function assertWritable(rel) {
  const norm = path.posix.normalize(rel.split(path.sep).join("/"));
  if (norm.startsWith("..") || path.isAbsolute(norm) || !WRITABLE.some((p) => norm.startsWith(p)) || !norm.endsWith(".md")) {
    fail(`拒绝写入「${rel}」：不在规范允许的范围内`);
  }
  return norm;
}
// 原子写入：先写临时文件再改名，避免 Obsidian 读到半截内容
function write(rel, content) {
  rel = assertWritable(rel);
  const file = abs(rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!content.endsWith("\n")) content += "\n";
  const tmp = `${file}.pl-${process.pid}.tmp`;
  fs.writeFileSync(tmp, content, "utf8");
  fs.renameSync(tmp, file);
}
const appendLine = (rel, line, header) => {
  let s = read(rel) || header || "";
  if (s && !s.endsWith("\n")) s += "\n";
  write(rel, s + line + "\n");
};
function fillTemplate(tpl, title, date) {
  const d = parseYmd(date);
  const fmt = (f) => f.replace(/YYYY|MM|M|DD|D|dddd|HH|mm/g, (t) => ({ YYYY: d.getFullYear(), MM: pad(d.getMonth() + 1), M: d.getMonth() + 1,
    DD: pad(d.getDate()), D: d.getDate(), dddd: WEEKDAYS[d.getDay()], HH: pad(NOW.getHours()), mm: pad(NOW.getMinutes()) }[t]));
  return tpl.replace(/\{\{title\}\}/gi, title).replace(/\{\{date:([^}]+)\}\}/gi, (_, f) => fmt(f))
    .replace(/\{\{date\}\}/gi, date).replace(/\{\{time\}\}/gi, hm(NOW));
}
function template(name, fallback) {
  const t = read(`${P.templates}/${name}.md`);
  return t || fallback;
}
// 在某个标题小节末尾插入若干行；标题不存在则在文末新建
function insertUnderHeading(content, headingRe, headingText, newLines) {
  const lines = content.replace(/\n+$/, "").split("\n");
  const h = lines.findIndex((l) => headingRe.test(l.trim()));
  if (h < 0) return lines.join("\n") + "\n\n" + headingText + "\n\n" + newLines.join("\n") + "\n";
  let end = lines.length;
  for (let i = h + 1; i < lines.length; i++) if (/^#{1,6}\s/.test(lines[i])) { end = i; break; }
  let last = h;
  for (let j = h + 1; j < end; j++) if (lines[j].trim()) last = j;
  const ins = last === h ? ["", ...newLines] : newLines;
  lines.splice(last + 1, 0, ...ins);
  const after = last + 1 + ins.length;
  if (after < lines.length && lines[after].trim() !== "") lines.splice(after, 0, "");
  return lines.join("\n") + "\n";
}
function diaryPath(date) { return `${P.diary}/${date}.md`; }
function ensureDiary(date) {
  const rel = diaryPath(date);
  if (!exists(rel)) {
    const fallback = `---\n类型: 日记\n日期: {{title}}\ntags: [日记]\n---\n# {{date:YYYY年M月D日 dddd}}\n\n## 📢 今日任务\n\n## 📝 记录\n\n## 😊 今日情绪\n\n## 🛑 复盘\n`;
    write(rel, fillTemplate(template("日记模板", fallback), date, date));
  }
  return rel;
}

// ───────────────────────── 任务解析 ─────────────────────────
function parseTasks(text, rel) {
  const out = []; const lines = text.split("\n"); let fence = false;
  lines.forEach((line, i) => {
    if (/^\s*(?:>\s*)*(```|~~~)/.test(line)) { fence = !fence; return; }
    if (fence) return;
    const m = line.match(/^\s*- \[([ xX/-])\]\s+(.*)$/);
    if (!m) return;
    const f = {}; let r; const re = /(🛫|⏳|📅|✅)️?\s*(\d{4}-\d{2}-\d{2})/gu;
    while ((r = re.exec(m[2]))) f[r[1]] = r[2];
    out.push({ file: rel, line: i, raw: line, status: m[1], done: /[xX]/.test(m[1]), cancelled: m[1] === "-",
      title: cleanTask(m[2]), scheduled: f["⏳"], due: f["📅"], doneDate: f["✅"] });
  });
  return out;
}
function listMd(dir) {
  const d = abs(dir);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith(".md") && !f.startsWith(".")).map((f) => `${dir}/${f}`);
}
function allTasks() {
  const files = [P.tasks, ...listMd(P.projects), ...listMd(P.archive), ...listMd(P.diary)];
  return files.flatMap((rel) => (exists(rel) ? parseTasks(read(rel), rel) : []));
}
const srcName = (rel) => rel === P.tasks ? "我的任务" : rel.startsWith(P.projects) ? "项目·" + path.basename(rel, ".md") : "日记·" + path.basename(rel, ".md");

// ───────────────────────── 项目 ─────────────────────────
function findProject(name, { includeArchive = false } = {}) {
  const q = oneLine(name);
  if (!q) fail("请说明是哪个项目");
  const files = [...listMd(P.projects), ...(includeArchive ? listMd(P.archive) : [])];
  const names = files.map((f) => [f, path.basename(f, ".md")]);
  const exact = names.filter(([, n]) => n === q);
  if (exact.length === 1) return exact[0][0];
  const fuzzy = names.filter(([, n]) => n.includes(q) || q.includes(n));
  if (fuzzy.length === 1) return fuzzy[0][0];
  if (!fuzzy.length) fail(`没找到项目「${q}」。现有项目：${names.map(([, n]) => n).join("、") || "（无）"}`);
  fail(`「${q}」对应多个项目：${fuzzy.map(([, n]) => n).join("、")}，请说完整名称`);
}
const fmValue = (content, key) => { const m = content.match(/^---\n([\s\S]*?)\n---/); if (!m) return ""; const r = m[1].match(new RegExp(`^${key}:[ \\t]*(.*)$`, "m")); return r ? r[1].trim().replace(/^"(.*)"$/, "$1") : ""; };
const yamlVal = (v) => { v = oneLine(v); return /^[\[\]{}&*!|>'"%@`#,?-]|: |\s#/.test(v) ? JSON.stringify(v) : v; };
function setFm(content, key, value) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return `---\n${key}: ${value}\n---\n` + content;
  const body = new RegExp(`^${key}:.*$`, "m").test(m[1]) ? m[1].replace(new RegExp(`^${key}:.*$`, "m"), `${key}: ${value}`) : m[1] + `\n${key}: ${value}`;
  return content.replace(m[0], `---\n${body}\n---`);
}
const safeName = (n) => oneLine(n).replace(/[\\/:*?"<>|#^\[\]]/g, " ").replace(/\s+/g, " ").trim().replace(/^[.\s]+/, "");

// ───────────────────────── 习惯 ─────────────────────────
const habitName = (h) => { const p = h.trim().split(/\s+/); if (p.length > 1 && /\p{Extended_Pictographic}/u.test(p[0])) p.shift(); return p.join(" "); };
function parseHabits(content) {
  const habits = []; let cur = null;
  for (const line of content.split("\n")) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h && !line.startsWith("###")) { cur = { name: habitName(h[1]), heading: h[1], dates: [] }; habits.push(cur); continue; }
    const c = line.match(/^- \[[xX]\]\s*(\d{4}-\d{2}-\d{2})/);
    if (c && cur) cur.dates.push(c[1]);
  }
  return habits;
}
function streak(dates, today) {
  const set = new Set(dates); let d = parseYmd(today); if (!set.has(today)) d = addDays(d, -1);
  let n = 0; while (set.has(ymd(d))) { n++; d = addDays(d, -1); }
  return n;
}
function toggleHabit(content, name, date, checked) {
  const lines = content.split("\n"); let start = -1, end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    const hm2 = lines[i].match(/^##\s+(.+?)\s*$/);
    if (hm2 && !lines[i].startsWith("###")) { if (start >= 0) { end = i; break; } if (habitName(hm2[1]) === name) start = i; }
  }
  if (start < 0) return null;
  const checks = [];
  for (let j = start + 1; j < end; j++) { const c = lines[j].match(/^- \[[xX]\]\s*(\d{4}-\d{2}-\d{2})/); if (c) checks.push({ i: j, d: c[1] }); }
  const hit = checks.find((c) => c.d === date);
  if (!checked) { if (hit) lines.splice(hit.i, 1); return lines.join("\n"); }
  if (hit) return content;
  const before = checks.filter((c) => c.d < date).pop();
  if (before) lines.splice(before.i + 1, 0, `- [x] ${date}`);
  else if (checks.length) lines.splice(checks[0].i, 0, `- [x] ${date}`);
  else { lines.splice(start + 1, 0, "", `- [x] ${date}`); if (start + 3 < lines.length && lines[start + 3].trim()) lines.splice(start + 3, 0, ""); }
  return lines.join("\n");
}

// ───────────────────────── 命令 ─────────────────────────
const commands = {
  // 闪念 §3
  idea(a) {
    const text = String(a.text || "").trim();
    if (!text) fail("闪念内容为空");
    const body = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).join("\n\t");
    const tags = tagStr(a.tags);
    appendLine(P.ideas, `- ${TODAY} ${hm(NOW)} ${body}${tags ? " " + tags : ""}`, HEADERS.ideas);
    return { message: `💡 已记下闪念${tags ? "（" + tags + "）" : ""}` };
  },

  // 任务 §2
  task(a) {
    const text = stripFields(a.text);
    if (!text) fail("任务内容为空");
    const time = parseTime(a.time);
    const scheduled = parseDate(a.scheduled);
    const due = parseDate(a.due);
    const prio = a.priority ? PRIORITY[String(a.priority).toLowerCase()] || PRIORITY[a.priority] : "";
    if (a.priority && !prio) fail("优先级只能是 最高/高/中/低");
    const parts = ["- [ ]"];
    if (time) parts.push(time);
    parts.push(text);
    const tags = tagStr(a.tags); if (tags) parts.push(tags);
    if (prio) parts.push(prio);
    if (a.repeat) parts.push("🔁 " + stripFields(a.repeat));
    if (scheduled) parts.push("⏳ " + scheduled);
    if (due) parts.push("📅 " + due);
    const line = parts.join(" ");
    let where = "我的任务";
    if (a.project) {
      const rel = findProject(a.project);
      write(rel, insertUnderHeading(read(rel), /^##\s+.*任务\s*$/, "## ✅ 任务", [line]));
      where = "项目「" + path.basename(rel, ".md") + "」";
    } else {
      appendLine(P.tasks, line, HEADERS.tasks);
    }
    const when = [scheduled && `计划 ${scheduled}`, due && `截止 ${due}`].filter(Boolean).join("，");
    return { message: `✅ 已加入${where}：${text}${when ? "（" + when + "）" : ""}`, line };
  },

  // 完成/取消完成任务 §2.3
  done(a) {
    const undo = a.undo === true;
    let target;
    const tasks = allTasks().filter((t) => !t.cancelled);
    if (a.id) {
      const [file, ln] = String(a.id).split("#");
      target = tasks.find((t) => t.file === file && t.line === +ln);
      if (!target) fail("这条任务已经变了，请重新查找");
    } else {
      const q = cleanTask(a.query || "");
      if (!q) fail("请说明要勾选哪条任务");
      const pool = tasks.filter((t) => (undo ? t.done : !t.done));
      let hits = pool.filter((t) => t.title === q);
      if (!hits.length) hits = pool.filter((t) => t.title.includes(q) || (q.length >= 2 && q.includes(t.title)));
      if (!hits.length) fail(`没找到${undo ? "已完成" : "未完成"}的任务「${q}」`);
      if (hits.length > 1) {
        return { ok: false, needChoice: true, error: `有 ${hits.length} 条任务匹配「${q}」，请选一条`,
          candidates: hits.slice(0, 10).map((t) => ({ id: `${t.file}#${t.line}`, title: t.title, from: srcName(t.file), due: t.due || t.scheduled || "" })) };
      }
      target = hits[0];
    }
    const content = read(target.file).split("\n");
    if (content[target.line] !== target.raw) fail("文件刚被改过，请重试");
    const m = target.raw.match(/^(\s*- \[)([ xX/])\]\s*(.*)$/);
    let rest = m[3].replace(/\s*✅️?\s*\d{4}-\d{2}-\d{2}/gu, "").trim();
    if (!undo) rest += ` ✅ ${TODAY}`;
    content[target.line] = `${m[1]}${undo ? " " : "x"}] ${rest}`;
    write(target.file, content.join("\n"));
    return { message: `${undo ? "↩️ 已改回未完成" : "🎉 已完成"}：${target.title}（${srcName(target.file)}）` };
  },

  // 习惯打卡 §4
  habit(a) {
    const date = parseDate(a.date) || TODAY;
    const q = oneLine(a.name);
    if (!q) fail("请说明是哪个习惯");
    let content = read(P.habits) || HEADERS.habits;
    const habits = parseHabits(content);
    let h = habits.find((x) => x.name === q) || null;
    if (!h) { const f = habits.filter((x) => x.name.includes(q) || q.includes(x.name)); if (f.length === 1) h = f[0]; else if (f.length > 1) fail(`「${q}」对应多个习惯：${f.map((x) => x.name).join("、")}`); }
    if (!h) {
      if (!a.create) fail(`还没有习惯「${q}」。现有习惯：${habits.map((x) => x.name).join("、") || "（无）"}。要新建请加 "create": true`);
      content = content.replace(/\s*$/, "") + `\n\n## ${a.icon ? oneLine(a.icon) + " " : ""}${q}\n`;
      h = { name: q, dates: [] };
    }
    const next = toggleHabit(content, h.name, date, a.undo !== true);
    write(P.habits, next);
    const dates = parseHabits(next).find((x) => x.name === h.name).dates;
    return { message: a.undo === true ? `↩️ 已取消 ${date} 的「${h.name}」打卡` : `🔥 「${h.name}」${date === TODAY ? "今天" : date}已打卡，连续 ${streak(dates, TODAY)} 天` };
  },

  // 情绪 §6.1
  mood(a) {
    const raw = oneLine(a.emotion);
    let key = EMOTIONS[raw] ? raw : Object.keys(EMOTIONS).find((k) => EMOTIONS[k][0] === raw || EMOTIONS[k][1] === raw) || EMOTION_ALIASES[raw];
    if (!key) fail(`不认识情绪「${raw}」，可用：${Object.values(EMOTIONS).map((e) => e[0]).join("、")}`);
    const n = a.intensity === undefined || a.intensity === "" ? null : Math.round(Number(a.intensity));
    if (n !== null && !(n >= 1 && n <= 10)) fail("情绪强度要在 1–10 之间");
    const date = parseDate(a.date) || TODAY;
    const time = a.time ? parseTime(a.time).slice(0, 5) : hm(NOW);
    const text = String(a.text || "").trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean).join("\n\t");
    const [name, emoji] = EMOTIONS[key];
    const line = `- ${time} ${emoji} ${name} [情绪:: ${key}]${n ? ` [强度:: ${n}]` : ""}${text ? " " + text : ""}`;
    const rel = ensureDiary(date);
    write(rel, insertUnderHeading(read(rel), /^##\s+.*今日情绪\s*$/, "## 😊 今日情绪", line.split("\n")));
    return { message: `${emoji} 已记录${date === TODAY ? "" : date + " 的"}心情：${name}${n ? ` ${n}/10` : ""}` };
  },

  // 日记记录 §6
  log(a) {
    const text = String(a.text || "").trim();
    if (!text) fail("记录内容为空");
    const date = parseDate(a.date) || TODAY;
    const time = a.time ? parseTime(a.time).slice(0, 5) : hm(NOW);
    const body = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).join("\n\t");
    const rel = ensureDiary(date);
    write(rel, insertUnderHeading(read(rel), /^##\s+.*记录\s*$/, "## 📝 记录", `- ${time} ${body}`.split("\n")));
    return { message: `📝 已写进${date === TODAY ? "今天" : date}的日记` };
  },

  // 收藏 §7
  bookmark(a) {
    const url = oneLine(a.url);
    if (!/^https?:\/\/\S+$/.test(url)) fail("请给出以 http:// 或 https:// 开头的网址");
    let content = read(P.bookmarks) || HEADERS.bookmarks;
    if (content.includes(`](${url})`) || new RegExp(`^\\s*- ${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "m").test(content)) {
      return { message: "🔖 这个链接已经收藏过了", duplicate: true };
    }
    const title = oneLine(a.title || "").replace(/[\[\]]/g, "") || url;
    const tags = tagStr(a.tags);
    const lines = [`- [${title}](${url})${tags ? " " + tags : ""}`];
    const desc = oneLine(a.desc || "");
    if (desc) lines.push("\t" + desc);
    if (!/^##\s+📥 待整理\s*$/m.test(content)) {
      // 待整理放在第一个分类之前
      const idx = content.search(/^##\s/m);
      content = idx < 0 ? content.replace(/\s*$/, "") + "\n\n## 📥 待整理\n" : content.slice(0, idx) + "## 📥 待整理\n\n" + content.slice(idx);
    }
    write(P.bookmarks, insertUnderHeading(content, /^##\s+📥 待整理\s*$/, "## 📥 待整理", lines));
    return { message: `🔖 已收藏到「📥 待整理」：${title}` };
  },

  // 新建项目 §5
  "project-new"(a) {
    const name = safeName(a.name);
    if (!name) fail("项目名称为空");
    const rel = `${P.projects}/${name}.md`;
    if (exists(rel) || exists(`${P.archive}/${name}.md`)) fail(`项目「${name}」已存在`);
    const fallback = "---\n类型: 项目\n目标:\n领域: 其他\n状态: 进行中\n开始时间: {{date}}\n截止时间:\ntags: [项目]\n---\n\n## 🎯 项目描述\n\n> 一句话写清楚：这个项目做成了是什么样子。\n\n## ✅ 任务\n\n## ❓ 问题\n\n## 📚 资源\n\n## 💡 灵感\n\n## 🏆 成就\n";
    let c = fillTemplate(template("项目模板", fallback), name, TODAY);
    const area = AREAS.includes(oneLine(a.area)) ? oneLine(a.area) : "其他";
    c = setFm(c, "领域", area);
    if (a.goal) c = setFm(c, "目标", yamlVal(a.goal));
    if (a.due) c = setFm(c, "截止时间", parseDate(a.due));
    if (a.desc) {
      const q = "> " + oneLine(a.desc);
      c = /^> 一句话写清楚：.*$/m.test(c) ? c.replace(/^> 一句话写清楚：.*$/m, () => q) : insertUnderHeading(c, /^##\s+.*项目描述\s*$/, "## 🎯 项目描述", [q]);
    }
    write(rel, c);
    return { message: `🎯 已新建项目「${name}」（领域：${area}${a.due ? "，截止 " + parseDate(a.due) : ""}）` };
  },

  // 项目状态 §5.1：完成/放弃 → 移入归档；进行中/暂停 → 移回进行中
  "project-status"(a) {
    const status = oneLine(a.status);
    if (!STATUSES.includes(status)) fail(`状态只能是：${STATUSES.join("、")}`);
    const rel = findProject(a.name, { includeArchive: true });
    const name = path.basename(rel, ".md");
    const archived = ["完成", "放弃"].includes(status);
    const dest = `${archived ? P.archive : P.projects}/${name}.md`;
    if (dest !== rel && exists(dest)) fail(`目标位置已有同名项目「${name}」`);
    write(rel, setFm(read(rel), "状态", status));
    if (dest !== rel) { // 移动而不是删除：原地改好状态后整体改名过去
      assertWritable(dest);
      fs.mkdirSync(path.dirname(abs(dest)), { recursive: true });
      fs.renameSync(abs(rel), abs(dest));
    }
    return { message: `📌 项目「${name}」状态改为「${status}」${dest !== rel ? (archived ? "，已移入归档" : "，已移回进行中") : ""}` };
  },

  "project-list"() {
    const items = listMd(P.projects).map((rel) => {
      const c = read(rel); const ts = parseTasks(c, rel).filter((t) => !t.cancelled);
      const done = ts.filter((t) => t.done).length;
      return { name: path.basename(rel, ".md"), status: fmValue(c, "状态"), area: fmValue(c, "领域"), due: fmValue(c, "截止时间"),
        progress: ts.length ? Math.round((done / ts.length) * 100) : 0, tasks: `${done}/${ts.length}` };
    });
    const text = items.length ? items.map((p) => `• ${p.name}［${p.status || "—"}］${p.progress}%${p.due ? " 截止 " + p.due : ""}`).join("\n") : "暂无进行中的项目";
    return { message: "🎯 进行中的项目\n" + text, projects: items };
  },

  // 今日概览
  today(a) {
    const date = parseDate(a.date) || TODAY;
    const tasks = allTasks().filter((t) => !t.cancelled);
    const overdue = tasks.filter((t) => !t.done && ((t.due && t.due < date) || (!t.due && t.scheduled && t.scheduled < date)));
    const todays = tasks.filter((t) => !t.done && !overdue.includes(t) && (t.scheduled === date || t.due === date));
    const doneToday = tasks.filter((t) => t.done && t.doneDate === date);
    const habits = parseHabits(read(P.habits)).map((h) => ({ name: h.name, done: h.dates.includes(date), streak: streak(h.dates, date) }));
    const moods = [];
    const diary = read(diaryPath(date));
    for (const m of diary.matchAll(/^\s*- (\d{1,2}:\d{2}) .*?\[情绪::\s*([^\]\s]+)\s*\](?:\s*\[强度::\s*(\d+)\s*\])?/gm)) moods.push({ time: m[1], emotion: EMOTIONS[m[2]]?.[0] || m[2], intensity: m[3] ? +m[3] : undefined });
    const fmt = (t) => `• ${t.title}${t.due ? "（截止 " + t.due + "）" : ""}［${srcName(t.file)}］`;
    const d = parseYmd(date);
    const lines = [`📅 ${date} ${WEEKDAYS[d.getDay()]}`];
    if (overdue.length) lines.push(`\n⚠️ 逾期 ${overdue.length} 条`, ...overdue.map(fmt));
    lines.push(`\n📢 今日待办 ${todays.length} 条`, ...(todays.length ? todays.map(fmt) : ["• 没有安排"]));
    if (doneToday.length) lines.push(`\n✅ 已完成 ${doneToday.length} 条`, ...doneToday.map((t) => `• ${t.title}`));
    if (habits.length) lines.push(`\n🔥 习惯`, ...habits.map((h) => `• ${h.done ? "✔" : "○"} ${h.name}（连续 ${h.streak} 天）`));
    if (moods.length) lines.push(`\n😊 心情`, ...moods.map((m) => `• ${m.time} ${m.emotion}${m.intensity ? " " + m.intensity + "/10" : ""}`));
    return { message: lines.join("\n"), date, overdue, today: todays, doneToday, habits, moods };
  },

  // 近 7 天数据，供周复盘
  week(a) {
    const end = parseDate(a.date) || TODAY;
    const start = ymd(addDays(parseYmd(end), -6));
    const inRange = (d) => d && d >= start && d <= end;
    const tasks = allTasks().filter((t) => !t.cancelled);
    const done = tasks.filter((t) => t.done && inRange(t.doneDate));
    const open = tasks.filter((t) => !t.done && (t.due || t.scheduled) && (t.due || t.scheduled) <= end);
    const habits = parseHabits(read(P.habits)).map((h) => ({ name: h.name, days: h.dates.filter(inRange).length }));
    const moods = [];
    for (const rel of listMd(P.diary)) {
      const dd = path.basename(rel, ".md"); if (!inRange(dd)) continue;
      for (const m of read(rel).matchAll(/\[情绪::\s*([^\]\s]+)\s*\](?:\s*\[强度::\s*(\d+)\s*\])?/g)) moods.push({ date: dd, emotion: EMOTIONS[m[1]]?.[0] || m[1], intensity: m[2] ? +m[2] : undefined });
    }
    const ideas = (read(P.ideas).match(/^- (\d{4}-\d{2}-\d{2}) /gm) || []).filter((l) => inRange(l.slice(2, 12))).length;
    const moodCount = moods.reduce((o, m) => ((o[m.emotion] = (o[m.emotion] || 0) + 1), o), {});
    const lines = [`📊 ${start} ~ ${end}`, `✅ 完成任务 ${done.length} 条`, ...done.slice(0, 15).map((t) => `• ${t.title}［${srcName(t.file)}］`),
      `⏳ 未完成且已到期 ${open.length} 条`, ...open.slice(0, 10).map((t) => `• ${t.title}`),
      `🔥 习惯：${habits.map((h) => `${h.name} ${h.days}/7`).join("，") || "无"}`,
      `😊 心情：${Object.entries(moodCount).map(([k, v]) => `${k}×${v}`).join("，") || "无记录"}`, `💡 新闪念 ${ideas} 条`];
    return { message: lines.join("\n"), start, end, done, open, habits, moods, ideas };
  },

  // 写周复盘 §9
  review(a) {
    const date = parseDate(a.date) || TODAY;
    const week = isoWeek(parseYmd(date));
    const rel = `${P.review}/${week}.md`;
    if (!exists(rel)) {
      const fallback = "---\n类型: 周复盘\n日期: {{date}}\ntags: [复盘]\n---\n# {{title}} 周复盘\n\n## 🎖️ 里程碑\n\n## 👀 行动回顾\n\n## ❌ 未完成任务\n\n## 🧭 下周聚焦\n";
      write(rel, fillTemplate(template("复盘模板", fallback), week, date));
    }
    let c = read(rel);
    const items = (v) => (Array.isArray(v) ? v : v ? [v] : []).map(oneLine).filter(Boolean);
    const sub = (labelRe, list) => {
      if (!list.length) return;
      const lines = c.split("\n"); const i = lines.findIndex((l) => labelRe.test(l));
      if (i < 0) return;
      let j = i + 1; while (j < lines.length && /^\t- /.test(lines[j])) j++;
      lines.splice(j, 0, ...list.map((x) => "\t- " + x)); c = lines.join("\n");
    };
    if (items(a.milestones).length) c = insertUnderHeading(c, /^##\s+.*里程碑\s*$/, "## 🎖️ 里程碑", items(a.milestones).map((x) => "- " + x));
    sub(/^- 做得好：/, items(a.good));
    sub(/^- 待改进：/, items(a.improve));
    if (items(a.next).length) c = insertUnderHeading(c, /^##\s+.*下周聚焦\s*$/, "## 🧭 下周聚焦", items(a.next).map((x) => "- " + x));
    write(rel, c);
    return { message: `🧭 已写入周复盘「${week}」`, file: rel };
  },
};

// ───────────────────────── 入口 ─────────────────────────
function main() {
  const argv = process.argv.slice(2);
  const vi = argv.indexOf("--vault");
  const argVault = vi >= 0 ? argv.splice(vi, 2)[1] : "";
  const cmd = argv[0];
  if (!cmd || cmd === "help" || !commands[cmd]) {
    return { ok: !cmd || cmd === "help", message: "可用命令：" + Object.keys(commands).join(" "), ...(cmd && cmd !== "help" ? { error: `未知命令：${cmd}` } : {}) };
  }
  VAULT = findVault(argVault);
  let input = "";
  try { if (!process.stdin.isTTY) input = fs.readFileSync(0, "utf8").trim(); } catch { input = ""; }
  let args = {};
  if (input) { try { args = JSON.parse(input); } catch { fail("参数必须是 JSON"); } }
  if (typeof args !== "object" || Array.isArray(args) || args === null) fail("参数必须是 JSON 对象");
  const res = commands[cmd](args);
  return { ok: true, ...res };
}
export { parseDateWord, parseTimeWord, cleanTask };
const IS_MAIN = !!process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  try {
    const out = main();
    process.stdout.write(JSON.stringify(out) + "\n");
    process.exitCode = out.ok === false ? 2 : 0;
  } catch (e) {
    process.stdout.write(JSON.stringify({ ok: false, error: e instanceof UserError ? e.message : "内部错误：" + e.message }) + "\n");
    process.exitCode = 1;
  }
}
