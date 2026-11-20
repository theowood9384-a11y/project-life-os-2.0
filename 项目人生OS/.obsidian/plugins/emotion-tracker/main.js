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
  default: () => EmotionTrackerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var emotions = {
  happy: { color: "#FFD93D", glow: "rgba(255,217,61,.6)", name: "\u5F00\u5FC3", icon: "happy", emoji: "\u{1F60A}", gradient: "linear-gradient(135deg,#FFD93D,#FFB347)" },
  sad: { color: "#6C9BCF", glow: "rgba(108,155,207,.6)", name: "\u60B2\u4F24", icon: "sad", emoji: "\u{1F622}", gradient: "linear-gradient(135deg,#6C9BCF,#4A7FB0)" },
  angry: { color: "#FF6B6B", glow: "rgba(255,107,107,.6)", name: "\u6124\u6012", icon: "angry", emoji: "\u{1F620}", gradient: "linear-gradient(135deg,#FF6B6B,#EE5A5A)" },
  anxious: { color: "#C9B1FF", glow: "rgba(201,177,255,.6)", name: "\u7126\u8651", icon: "anxious", emoji: "\u{1F630}", gradient: "linear-gradient(135deg,#C9B1FF,#A990FF)" },
  calm: { color: "#95E1D3", glow: "rgba(149,225,211,.6)", name: "\u5E73\u9759", icon: "calm", emoji: "\u{1F60C}", gradient: "linear-gradient(135deg,#95E1D3,#7FCFBE)" },
  neutral: { color: "#B8C4CE", glow: "rgba(184,196,206,.5)", name: "\u5E73\u5E38", icon: "neutral", emoji: "\u{1F610}", gradient: "linear-gradient(135deg,#B8C4CE,#9AABB8)" }
};
// 图标对应的emoji映射（用于自定义情绪的Markdown保存）
var iconEmojiMap = {
  happy: "\u{1F60A}", sad: "\u{1F622}", angry: "\u{1F620}", anxious: "\u{1F630}", calm: "\u{1F60C}", neutral: "\u{1F610}",
  excited: "\u{1F929}", tired: "\u{1F634}", love: "\u{1F970}", grateful: "\u{1F64F}", confused: "\u{1F615}",
  hopeful: "\u{1F31F}", lonely: "\u{1F614}", peaceful: "\u{1F339}", stressed: "\u{1F62B}", bored: "\u{1F611}", inspired: "\u{1F4A1}"
};
// 现代美学SVG图标库
var emotionIcons = {
  happy: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 14v.5"/><path d="M22 14v.5"/><path d="M11 20c1.5 2 3 3 5 3s3.5-1 5-3"/></svg>`,
  sad: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 13v1"/><path d="M22 13v1"/><path d="M11 22c1.5-2 3-3 5-3s3.5 1 5 3"/><path d="M10 17l2-1"/></svg>`,
  angry: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 15v.5"/><path d="M22 15v.5"/><path d="M8 11l5 2"/><path d="M24 11l-5 2"/><path d="M12 22h8"/></svg>`,
  anxious: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><circle cx="11" cy="14" r="1.5"/><circle cx="21" cy="14" r="1.5"/><ellipse cx="16" cy="22" rx="3" ry="2"/><path d="M9 9l3 2"/><path d="M23 9l-3 2"/></svg>`,
  calm: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M9 14c1 0 2-.5 2.5-1"/><path d="M23 14c-1 0-2-.5-2.5-1"/><path d="M12 20c1 1 2.5 1.5 4 1.5s3-.5 4-1.5"/></svg>`,
  neutral: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 14v.5"/><path d="M22 14v.5"/><path d="M11 20h10"/></svg>`,
  // 更多可选图标用于自定义情绪
  excited: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M9 12l4 2"/><path d="M23 12l-4 2"/><path d="M10 19c2 3 4 4 6 4s4-1 6-4"/></svg>`,
  tired: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M9 15c1-.5 2-.5 3 0"/><path d="M20 15c1-.5 2-.5 3 0"/><path d="M13 21h6"/></svg>`,
  love: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 13c0-1.5 1-2.5 2-2.5s2 1.5 2 2.5c0 2-2 3-2 3s-2-1-2-3z"/><path d="M18 13c0-1.5 1-2.5 2-2.5s2 1.5 2 2.5c0 2-2 3-2 3s-2-1-2-3z"/><path d="M12 21c1.5 1 2.5 1.5 4 1.5s2.5-.5 4-1.5"/></svg>`,
  grateful: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 14v.5"/><path d="M22 14v.5"/><path d="M11 19c1.5 2.5 3 3.5 5 3.5s3.5-1 5-3.5"/><path d="M16 6v2"/><path d="M12 7l1 2"/><path d="M20 7l-1 2"/></svg>`,
  confused: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 14v.5"/><path d="M22 12v.5"/><path d="M12 21c2 0 3-1 5-1s2 1 4 0"/><path d="M20 7c1 1 2 2 2 3"/></svg>`,
  hopeful: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 15v.5"/><path d="M22 15v.5"/><path d="M11 20c1.5 1.5 3 2 5 2s3.5-.5 5-2"/><path d="M16 5l1 3h3l-2.5 2 1 3-2.5-2-2.5 2 1-3L11 8h3l1-3z"/></svg>`,
  lonely: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 14v.5"/><path d="M22 14v.5"/><path d="M12 21c1-1 2.5-1.5 4-1.5s3 .5 4 1.5"/><path d="M23 8c2 1 3 2 3 4"/></svg>`,
  peaceful: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M9 14c1.5 0 2.5-1 3-1.5"/><path d="M23 14c-1.5 0-2.5-1-3-1.5"/><path d="M12 20c1.5 1 2.5 1.5 4 1.5s2.5-.5 4-1.5"/></svg>`,
  stressed: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 15v.5"/><path d="M22 15v.5"/><path d="M8 10l5 3"/><path d="M24 10l-5 3"/><path d="M12 22c1-1 2.5-1 4-1s3 0 4 1"/><path d="M14 7l1 2"/><path d="M18 7l-1 2"/></svg>`,
  bored: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 14h2"/><path d="M20 14h2"/><path d="M12 21h8"/></svg>`,
  inspired: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><path d="M10 14v.5"/><path d="M22 14v.5"/><path d="M11 19c1.5 2 3 3 5 3s3.5-1 5-3"/><circle cx="16" cy="6" r="2"/><path d="M16 8v2"/></svg>`
};
// 获取图标HTML的辅助函数
function getEmotionIcon(iconKey, color) {
  const svg = emotionIcons[iconKey] || emotionIcons.neutral;
  return `<div class="mf-icon" style="color:${color || 'currentColor'}">${svg}</div>`;
}
var gentleWords = {
  happy: ["\u7F8E\u597D\u503C\u5F97\u88AB\u8BB0\u4F4F", "\u8FD9\u4EFD\u559C\u60A6\uFF0C\u771F\u597D", "\u613F\u8FD9\u4EFD\u5149\u4EAE\u6301\u7EED\u66F4\u4E45"],
  sad: ["\u5141\u8BB8\u81EA\u5DF1\u96BE\u8FC7\u4E00\u4F1A\u513F", "\u8FD9\u4F1A\u8FC7\u53BB\u7684", "\u4F60\u6BD4\u60F3\u8C61\u4E2D\u66F4\u575A\u5F3A"],
  angry: ["\u6DF1\u547C\u5438", "\u60C5\u7EEA\u9700\u8981\u51FA\u53E3", "\u5141\u8BB8\u81EA\u5DF1\u4E0D\u5B8C\u7F8E"],
  anxious: ["\u6B64\u523B\uFF0C\u4F60\u662F\u5B89\u5168\u7684", "\u4E00\u6B65\u4E00\u6B65\u6765", "\u4F60\u5DF2\u7ECF\u505A\u5F97\u5F88\u597D\u4E86"],
  calm: ["\u4EAB\u53D7\u8FD9\u4EFD\u5B81\u9759", "\u5E73\u9759\u662F\u4E00\u79CD\u529B\u91CF", "\u6B64\u523B\u521A\u521A\u597D"],
  neutral: ["\u8BB0\u5F55\u672C\u8EAB\u5C31\u662F\u610F\u4E49", "\u6BCF\u4E00\u523B\u90FD\u503C\u5F97\u88AB\u770B\u89C1", "\u4F60\u5728\u8FD9\u91CC\uFF0C\u5F88\u597D"]
};
var themes = {
  midnight: { bg1: "#0a0c10", bg2: "#050508", accent: "#6366f1", name: "\u5348\u591C" },
  forest: { bg1: "#0a100d", bg2: "#050807", accent: "#22c55e", name: "\u68EE\u6797" },
  ocean: { bg1: "#0a0d10", bg2: "#050608", accent: "#0ea5e9", name: "\u6D77\u6D0B" },
  sunset: { bg1: "#100a0a", bg2: "#080505", accent: "#f97316", name: "\u65E5\u843D" },
  aurora: { bg1: "#0d0a10", bg2: "#060508", accent: "#a855f7", name: "\u6781\u5149" }
};
// ===== 项目人生 · 数据格式规范 v1.0（§6 §6.1）=====
var PL_MOOD_HEADING = "## 😊 今日情绪";
var PL_MOOD_HEADING_RE = /^##\s+.*今日情绪\s*$/;
// 把一行插到某个标题所在小节的末尾；标题不存在时在文末新建该标题
function plInsertUnderHeading(content, line, headingRe, headingText) {
  headingRe = headingRe || PL_MOOD_HEADING_RE;
  headingText = headingText || PL_MOOD_HEADING;
  var lines = content.split("\n");
  var h = lines.findIndex(function(l) { return headingRe.test(l.trim()); });
  if (h < 0) return content.replace(/\s*$/, "") + "\n\n" + headingText + "\n\n" + line + "\n";
  var end = lines.length;
  for (var i = h + 1; i < lines.length; i++) if (/^#{1,6}\s/.test(lines[i])) { end = i; break; }
  var last = h;
  for (var j = h + 1; j < end; j++) if (lines[j].trim()) last = j;
  var insert = last === h ? ["", line] : [line];
  lines.splice.apply(lines, [last + 1, 0].concat(insert));
  var after = last + 1 + insert.length;
  if (after < lines.length && lines[after].trim() !== "") lines.splice(after, 0, "");
  if (after >= lines.length) lines.push("");
  return lines.join("\n");
}
// 解析规范格式的情绪行：- HH:mm 表情 中文名 [情绪:: 键] [强度:: n] 内容（续行用 Tab 缩进）
function plParseMoodLines(content, baseDate) {
  var out = [], lines = content.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var m = lines[i].match(/^\s*- (\d{1,2}):(\d{2})\b.*?\[情绪::\s*([^\]\s]+)\s*\](?:\s*\[强度::\s*(\d{1,2})\s*\])?\s*(.*)$/);
    if (!m) continue;
    var text = m[5].trim();
    while (i + 1 < lines.length && /^\t+\S/.test(lines[i + 1]) && !/^\s*- \[/.test(lines[i + 1])) { text += "\n" + lines[++i].trim(); }
    var time = m[1].padStart(2, "0") + ":" + m[2];
    out.push({ id: new Date(baseDate + " " + time).getTime() + i, emotion: m[3], intensity: m[4] ? Number(m[4]) : undefined,
      timestamp: baseDate + "T" + time + ":00", text: text });
  }
  return out;
}

var DEFAULT_SETTINGS = { savePath: "Emotions", dateFormat: "YYYY-MM-DD", includeTime: true, theme: "midnight", saveMode: "diary", diaryPath: "03-行动/日记", diaryFormat: "YYYY-MM-DD", diaryTemplatePath: "00-后台/模板/日记模板.md", customImageData: null, particleParams: null, customEmotions: {}, musicEnabled: true, musicVolume: 0.25, customMusicData: null, useCustomMusic: false, emotionOrder: null, uiStyle: "orb", elevenApiKey: "", elevenKeyName: "", elevenAgentId: "", elevenAgentHash: "", elevenToolId: "", elevenToolHash: "", elevenVoiceId: "", elevenLlm: "claude-sonnet-5-5", voiceMaxMinutes: 10, voiceHalfDuplex: true };
// ===== 界面风格与语音对话（1.2.0）=====
// 四种风格：光球（原版）、手帐、电台、色谱。记录、统计、主题页靠 --mf-ink 等颜色变量换装；首页、语音对话、记下这条三屏每种风格各画一套
var MF_STYLES = [
  ["orb", "呼吸光球", "深夜里会呼吸的光球，原来的样子"],
  ["journal", "手帐", "方格本、表情贴纸、手写字"],
  ["radio", "深夜电台", "情绪是频道，强度是音量旋钮"],
  ["spectrum", "情绪色谱", "像色卡一样记录，一天是一条色带"]
];
function mfStyle(settings) { var v = settings && settings.uiStyle; return MF_STYLES.some(function(x) { return x[0] === v; }) ? v : "orb"; }
var MF_FONTS = { hand: { family: "CNP Hand", file: "hand.woff2" }, mono: { family: "CNP Mono", file: "mono.woff2", desc: { weight: "400" } }, monoBold: { family: "CNP Mono", file: "mono-bold.woff2", desc: { weight: "700" } } };
var MF_STYLE_FONTS = { orb: [], journal: ["hand", "mono"], radio: ["mono", "monoBold"], spectrum: ["mono", "monoBold"] };
var MF_WD = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
var MF_WD_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
function mfEsc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function mfPad(n) { return String(n).padStart(2, "0"); }
function mfClampInt(v, lo, hi, dflt) { var n = Math.round(Number(v)); return isFinite(n) ? Math.max(lo, Math.min(hi, n)) : dflt; }
function mfHash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }

// —— 音频小工具（纯函数，测试里直接用）——
// 把任意采样率的浮点样本线性插值到目标采样率
function mfResample(f32, from, to) {
  if (!f32 || !f32.length) return new Float32Array(0);
  if (from === to) return Float32Array.from(f32);
  var n = Math.max(1, Math.round(f32.length * to / from)), out = new Float32Array(n), r = from / to;
  for (var i = 0; i < n; i++) { var x = i * r, k = Math.floor(x), t = x - k, a = f32[Math.min(k, f32.length - 1)], b = f32[Math.min(k + 1, f32.length - 1)]; out[i] = a + (b - a) * t; }
  return out;
}
function mfToInt16(f32) { var out = new Int16Array(f32.length); for (var i = 0; i < f32.length; i++) { var v = Math.max(-1, Math.min(1, f32[i])); out[i] = v < 0 ? v * 32768 : v * 32767; } return out; }
function mfB64FromBytes(u8) { var s = "", step = 0x8000; for (var i = 0; i < u8.length; i += step) s += String.fromCharCode.apply(null, u8.subarray(i, i + step)); return btoa(s); }
function mfBytesFromB64(b64) { var s = atob(b64), u8 = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i); return u8; }
function mfInt16ToB64(i16) { return mfB64FromBytes(new Uint8Array(i16.buffer, i16.byteOffset, i16.byteLength)); }
// 解码收到的音频：pcm_xxxx 是 16 位小端，ulaw_8000 是 μ 律
function mfDecodeAudio(b64, format) {
  var u8 = mfBytesFromB64(b64), out;
  if (/^ulaw/.test(format || "")) {
    out = new Float32Array(u8.length);
    for (var i = 0; i < u8.length; i++) { var u = ~u8[i] & 0xff, sign = u & 0x80, exp = (u >> 4) & 7, man = u & 0x0f, mag = ((man << 3) + 0x84) << exp; mag -= 0x84; out[i] = (sign ? -mag : mag) / 32768; }
    return out;
  }
  var n = u8.length >> 1, dv = new DataView(u8.buffer, u8.byteOffset, n * 2);
  out = new Float32Array(n);
  for (var j = 0; j < n; j++) out[j] = dv.getInt16(j * 2, true) / 32768;
  return out;
}
function mfRateOf(format) { var m = String(format || "").match(/(\d{4,5})$/); return m ? +m[1] : 16000; }

// —— 对话角色（ElevenLabs Agent）的配置 ——
var MF_EL = "https://api.elevenlabs.io";
var MF_LLMS = [["claude-sonnet-5-5", "Claude Sonnet 5.5（推荐）"], ["claude-haiku-5-5", "Claude Haiku 5.5（更快、更省）"]];
function mfEmotionList(plugin) {
  var all = plugin.getAllEmotions();
  return Object.keys(all).map(function(k) { return { key: k, name: all[k].name }; });
}
function mfToolBody(plugin) {
  var list = mfEmotionList(plugin);
  return {
    tool_config: {
      type: "client", name: "record_mood", expects_response: true, response_timeout_secs: 20,
      description: "用户同意记录后调用：把这次聊天整理成一条情绪记录，交给用户在屏幕上确认。",
      parameters: {
        type: "object",
        properties: {
          emotion: { type: "string", description: "最接近的情绪：" + list.map(function(e) { return e.key + "=" + e.name; }).join("，"), enum: list.map(function(e) { return e.key; }) },
          intensity: { type: "integer", description: "此刻的强度，1 到 10" },
          note: { type: "string", description: "用用户自己的口吻写一两句话，不超过 60 个字，不要出现“用户”二字" }
        },
        required: ["emotion", "intensity", "note"]
      }
    }
  };
}
function mfPrompt(plugin) {
  var list = mfEmotionList(plugin).map(function(e) { return e.name + "（" + e.key + "）"; }).join("、");
  return [
    "你是「项目人生」里的情绪陪伴者，用温和、简短、口语化的中文陪用户聊聊此刻的心情。",
    "- 每次只说一两句。多倾听，多复述对方的感受，少讲道理，不说教，不急着给建议。",
    "- 你不是心理咨询师，不做诊断，不给医疗或用药建议。",
    "- 如果对方提到想伤害自己或别人、觉得活不下去，先认真表达关心，请对方马上联系身边信任的人，并告诉对方可以拨打全国心理援助热线 12356；遇到紧急危险请拨打 110 或 120。",
    "- 当对方的情绪比较清楚了（通常三到六轮），用一句话复述，并问一句「要不要帮你记下来」。对方同意后调用 record_mood：emotion 从这些里选最接近的一个：" + list + "；intensity 是此刻的强度 1–10；note 用对方的口吻写一两句话。调用后告诉对方：记录卡已经放在屏幕上，确认后会写进今天的日记。",
    "- 对方想结束时，温和地道别。",
    "今天是 {{today}}。今天已经记下的情绪：{{today_moods}}。"
  ].join("\n");
}
function mfAgentBody(plugin, toolId) {
  var s = plugin.settings, tts = { model_id: "eleven_flash_v2_5", agent_output_audio_format: "pcm_16000" };
  if (String(s.elevenVoiceId || "").trim()) tts.voice_id = String(s.elevenVoiceId).trim();
  return {
    name: "项目人生 · 情绪陪伴",
    conversation_config: {
      agent: { first_message: "嗨，我在。今天过得怎么样？", language: "zh", prompt: { prompt: mfPrompt(plugin), llm: s.elevenLlm || MF_LLMS[0][0], tool_ids: toolId ? [toolId] : [] } },
      tts: tts,
      asr: { user_input_audio_format: "pcm_16000" },
      conversation: { max_duration_seconds: mfClampInt(s.voiceMaxMinutes, 3, 30, 10) * 60 }
    }
  };
}
// 工具参数整理：情绪认不出时退回「平常」，强度夹在 1–10，记录去掉换行和多余空白
function mfNormalizeRecord(plugin, p) {
  var all = plugin.getAllEmotions(), e = String((p && p.emotion) || "").trim();
  if (!all[e]) { var byName = Object.keys(all).find(function(k) { return all[k].name === e; }); e = byName || "neutral"; }
  var note = String((p && p.note) || "").replace(/\s+/g, " ").trim().slice(0, 200);
  return { emotion: e, intensity: mfClampInt(p && p.intensity, 1, 10, 5), note: note };
}
// 告诉 AI 今天已经记下了什么
function mfTodayMoods(plugin, entries) {
  var all = plugin.getAllEmotions(), today = (0, import_obsidian.moment)().format("YYYY-MM-DD");
  var list = (entries || []).filter(function(x) { return String(x.timestamp || "").slice(0, 10) === today; })
    .sort(function(a, b) { return String(a.timestamp).localeCompare(String(b.timestamp)); })
    .map(function(x) { var n = (all[x.emotion] || { name: x.emotion }).name; return String(x.timestamp).slice(11, 16) + " " + n + (x.intensity ? "（" + x.intensity + "）" : ""); });
  return list.length ? list.join("；") : "还没有";
}
// 统一的网络请求：带 Key、不抛异常，按状态码给出中文错误
async function mfRequest(opts) {
  var r;
  try { r = await (0, import_obsidian.requestUrl)(Object.assign({ throw: false }, opts)); }
  catch (e) { throw new Error("连不上 ElevenLabs，检查网络后再试"); }
  if (r.status === 401 || r.status === 403) throw new Error("ElevenLabs 拒绝了这个 API Key：检查 Key 是否正确、是否开通了对话功能");
  if (r.status === 429) throw new Error("ElevenLabs 额度用完或请求太频繁，稍后再试");
  if (r.status >= 400) { var msg = ""; try { var j = r.json; msg = (j && (j.detail && (j.detail.message || j.detail) || j.message)) || ""; } catch (e) {} throw new Error("ElevenLabs 返回错误 " + r.status + (msg ? "：" + (typeof msg === "string" ? msg : JSON.stringify(msg)).slice(0, 120) : "")); }
  return r;
}

// —— 一次语音对话 ——
// h: { onPhase(phase), onYou(text), onAi(text), onRecord(rec), onEnd(reason, error) }
var MfVoiceSession = class {
  constructor(plugin, h) {
    this.plugin = plugin; this.h = h; this.ws = null; this.ctx = null; this.stream = null;
    this.sources = []; this.playHead = 0; this.outFormat = "pcm_16000"; this.inRate = 16000;
    this.buf = []; this.bufLen = 0; this.muted = false; this.closed = false; this.phase = "connecting";
    this.halfDuplex = plugin.settings.voiceHalfDuplex !== false;
  }
  setPhase(p) { if (this.phase === p || this.closed) return; this.phase = p; this.h.onPhase(p); }
  send(obj) { if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify(obj)); }
  async start(dynamicVariables) {
    var key = await this.plugin.mfElevenKey();
    if (!key) throw new Error("还没有填 ElevenLabs API Key：设置 → 情绪追踪器 → 语音对话");
    var agentId = await this.plugin.mfEnsureAgent(key);
    if (this.closed) return;
    var r = await mfRequest({ url: MF_EL + "/v1/convai/conversation/get-signed-url?agent_id=" + encodeURIComponent(agentId), headers: { "xi-api-key": key } });
    var url = r.json && r.json.signed_url;
    if (!url) throw new Error("没有拿到连接地址，稍后再试");
    try { this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } }); }
    catch (e) { throw new Error("麦克风没有权限：在系统设置 → 隐私与安全性 → 麦克风里允许 Obsidian"); }
    if (this.closed) { this.releaseMic(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    try { await this.ctx.resume(); } catch (e) {}
    this.src = this.ctx.createMediaStreamSource(this.stream);
    this.inAn = this.ctx.createAnalyser(); this.inAn.fftSize = 512; this.src.connect(this.inAn);
    this.outGain = this.ctx.createGain(); this.outAn = this.ctx.createAnalyser(); this.outAn.fftSize = 512;
    this.outGain.connect(this.outAn); this.outAn.connect(this.ctx.destination);
    await this.setupCapture();
    var self = this;
    this.ws = new WebSocket(url);
    this.ws.onopen = function() { self.send({ type: "conversation_initiation_client_data", dynamic_variables: dynamicVariables || {} }); };
    this.ws.onmessage = function(e) { self.onMessage(e.data); };
    this.ws.onerror = function() {};
    this.ws.onclose = function(e) { if (!self.closed) { self.stop(); self.h.onEnd("closed", e && e.code !== 1000 && e.code !== 1005 ? "对话断开了（" + e.code + (e.reason ? "：" + e.reason : "") + "）" : null); } };
  }
  // 采集：AudioWorklet 拿到原始样本，攒够约 100ms 发一次；AI 说话时如果开了防回声，就发静音
  async setupCapture() {
    var self = this, rate = this.ctx.sampleRate;
    var onFrames = function(f32) {
      var pcm = mfResample(f32, rate, self.inRate);
      self.buf.push(pcm); self.bufLen += pcm.length;
      if (self.bufLen < self.inRate / 10) return;
      var all = new Float32Array(self.bufLen), o = 0;
      self.buf.forEach(function(b) { all.set(b, o); o += b.length; });
      self.buf = []; self.bufLen = 0;
      if (self.muted || (self.halfDuplex && self.phase === "speaking")) all.fill(0);
      self.send({ user_audio_chunk: mfInt16ToB64(mfToInt16(all)) });
    };
    var sink = this.ctx.createGain(); sink.gain.value = 0; sink.connect(this.ctx.destination);
    try {
      var code = "class P extends AudioWorkletProcessor{process(i){var c=i[0]&&i[0][0];if(c)this.port.postMessage(c.slice(0));return true}}registerProcessor('mf-cap',P);";
      var url = URL.createObjectURL(new Blob([code], { type: "application/javascript" }));
      await this.ctx.audioWorklet.addModule(url); URL.revokeObjectURL(url);
      this.node = new AudioWorkletNode(this.ctx, "mf-cap");
      this.node.port.onmessage = function(ev) { onFrames(ev.data); };
    } catch (e) {
      this.node = this.ctx.createScriptProcessor(2048, 1, 1);
      this.node.onaudioprocess = function(ev) { onFrames(ev.inputBuffer.getChannelData(0)); };
    }
    this.src.connect(this.node); this.node.connect(sink);
  }
  onMessage(raw) {
    var m; try { m = JSON.parse(raw); } catch (e) { return; }
    var self = this;
    if (m.type === "conversation_initiation_metadata") {
      var ev = m.conversation_initiation_metadata_event || {};
      this.outFormat = ev.agent_output_audio_format || "pcm_16000";
      this.inRate = mfRateOf(ev.user_input_audio_format || "pcm_16000");
      this.conversationId = ev.conversation_id || "";
      this.setPhase("listening");
    } else if (m.type === "audio") {
      var a = m.audio_event || {}; if (a.audio_base_64) this.play(a.audio_base_64);
    } else if (m.type === "agent_response") {
      var t = (m.agent_response_event || {}).agent_response; if (t) this.h.onAi(t);
    } else if (m.type === "agent_response_correction") {
      var c = m.agent_response_correction_event || {}; if (c.corrected_agent_response) this.h.onAi(c.corrected_agent_response);
    } else if (m.type === "user_transcript") {
      var u = (m.user_transcription_event || {}).user_transcript; if (u) { this.h.onYou(u); if (!this.sources.length) this.setPhase("thinking"); }
    } else if (m.type === "interruption") {
      this.flush(); this.setPhase("listening");
    } else if (m.type === "ping") {
      var p = m.ping_event || {}; setTimeout(function() { self.send({ type: "pong", event_id: p.event_id }); }, p.ping_ms || 0);
    } else if (m.type === "client_tool_call") {
      var call = m.client_tool_call || {}, ok = call.tool_name === "record_mood";
      if (ok) this.h.onRecord(mfNormalizeRecord(this.plugin, call.parameters || {}));
      if (call.expects_response !== false) this.send({ type: "client_tool_result", tool_call_id: call.tool_call_id, result: ok ? "记录卡已经显示在用户屏幕上，等用户确认" : "不认识这个工具", is_error: !ok });
    }
  }
  play(b64) {
    if (!this.ctx || this.closed) return;
    var f32 = mfDecodeAudio(b64, this.outFormat); if (!f32.length) return;
    var buf = this.ctx.createBuffer(1, f32.length, mfRateOf(this.outFormat)); buf.copyToChannel(f32, 0);
    var src = this.ctx.createBufferSource(), self = this; src.buffer = buf; src.connect(this.outGain);
    var at = Math.max(this.ctx.currentTime + 0.04, this.playHead); src.start(at); this.playHead = at + buf.duration;
    this.sources.push(src);
    src.onended = function() { self.sources = self.sources.filter(function(x) { return x !== src; }); if (!self.sources.length && self.phase === "speaking") self.setPhase("listening"); };
    this.setPhase("speaking");
  }
  flush() { this.sources.forEach(function(s) { try { s.stop(); } catch (e) {} }); this.sources = []; this.playHead = 0; }
  // 自己点「打断」：本地停掉 AI 的声音，并告诉服务器用户在说话
  interrupt() { this.flush(); this.send({ type: "user_activity" }); this.setPhase("listening"); }
  setMuted(v) { this.muted = !!v; }
  level(which) {
    var an = which === "out" ? this.outAn : this.inAn; if (!an) return 0;
    var d = this.levelBuf || (this.levelBuf = new Uint8Array(an.fftSize)); an.getByteTimeDomainData(d);
    var sum = 0; for (var i = 0; i < d.length; i++) { var v = (d[i] - 128) / 128; sum += v * v; }
    return Math.min(1, Math.sqrt(sum / d.length) * 4);
  }
  releaseMic() { if (this.stream) this.stream.getTracks().forEach(function(t) { t.stop(); }); this.stream = null; }
  stop() {
    if (this.closed) return; this.closed = true;
    try { if (this.ws) this.ws.close(1000); } catch (e) {}
    this.flush(); this.releaseMic();
    try { if (this.node) { this.node.disconnect(); if (this.node.port) this.node.port.onmessage = null; } } catch (e) {}
    try { if (this.ctx) this.ctx.close(); } catch (e) {}
  }
};

// 音乐播放器 - 支持生成音乐和自定义音乐
var AmbientMusic = class {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.nodes = [];
    this.intervals = [];
    this.volume = 0.25;
    // 自定义音乐
    this.customAudio = null;
    this.customMusicData = null;
    this.useCustomMusic = false;
  }

  async init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.audioContext.destination);
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  setVolume(vol) {
    this.volume = vol;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(vol, this.audioContext.currentTime, 0.1);
    }
    if (this.customAudio) {
      this.customAudio.volume = vol;
    }
  }

  stop() {
    this.isPlaying = false;
    // 停止生成的音乐
    this.nodes.forEach(node => {
      try { 
        if (node.stop) node.stop(); 
        if (node.disconnect) node.disconnect();
      } catch(e) {}
    });
    this.nodes = [];
    this.intervals.forEach(i => clearInterval(i));
    this.intervals = [];
    // 停止自定义音乐
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.currentTime = 0;
    }
  }

  async start() {
    await this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    
    if (this.useCustomMusic && this.customMusicData) {
      this.playCustomMusic();
    } else {
      this.playDreamscape();
    }
  }

  // 加载自定义音乐
  async loadCustomMusic(base64Data) {
    this.customMusicData = base64Data;
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    this.customAudio = new Audio(base64Data);
    this.customAudio.loop = true;
    this.customAudio.volume = this.volume;
  }

  // 播放自定义音乐
  playCustomMusic() {
    if (!this.customAudio || !this.customMusicData) return;
    this.customAudio.volume = this.volume;
    this.customAudio.play().catch(e => console.log('Audio play failed:', e));
  }

  // 切换音乐模式
  setUseCustomMusic(use) {
    this.useCustomMusic = use;
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  // 清除自定义音乐
  clearCustomMusic() {
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    this.customMusicData = null;
    this.useCustomMusic = false;
  }

  // 播放柔和的音色
  playBell(freq, duration, vol = 0.1, delay = 0) {
    if (!this.isPlaying || this.useCustomMusic) return;
    
    const now = this.audioContext.currentTime + delay;
    
    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = freq;
    
    const osc2 = this.audioContext.createOscillator();
    const gain2 = this.audioContext.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    
    const osc3 = this.audioContext.createOscillator();
    const gain3 = this.audioContext.createGain();
    osc3.type = 'sine';
    osc3.frequency.value = freq * 1.5;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    
    [gain1, gain2, gain3].forEach((g, i) => {
      const v = vol * (i === 0 ? 1 : i === 1 ? 0.3 : 0.15);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(v, now + 0.8);
      g.gain.setValueAtTime(v, now + duration * 0.4);
      g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    });
    
    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);
    gain1.connect(filter);
    gain2.connect(filter);
    gain3.connect(filter);
    filter.connect(this.masterGain);
    
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc1.stop(now + duration + 0.5);
    osc2.stop(now + duration + 0.5);
    osc3.stop(now + duration + 0.5);
    
    this.nodes.push(osc1, osc2, osc3, gain1, gain2, gain3, filter);
  }

  createDrone(freq, vol = 0.03) {
    if (!this.isPlaying || this.useCustomMusic) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.audioContext.currentTime + 4);
    
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = vol * 0.3;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    
    this.nodes.push(osc, gain, filter, lfo, lfoGain);
  }

  playDreamscape() {
    const notes = {
      C2: 65.41, G2: 98.00, C3: 130.81, E3: 164.81, G3: 196.00,
      C4: 261.63, E4: 329.63, G4: 392.00, A4: 440.00, C5: 523.25, E5: 659.25, G5: 783.99
    };
    
    this.createDrone(notes.C2, 0.04);
    this.createDrone(notes.G2, 0.025);
    this.createDrone(notes.C3, 0.02);
    
    const highNotes = [notes.E4, notes.G4, notes.C5, notes.E5, notes.G5];
    const midNotes = [notes.C4, notes.E4, notes.G4];
    
    const playSparkle = () => {
      if (!this.isPlaying || this.useCustomMusic) return;
      if (Math.random() > 0.4) return;
      const note = highNotes[Math.floor(Math.random() * highNotes.length)];
      this.playBell(note, 6 + Math.random() * 4, 0.04 + Math.random() * 0.02, Math.random() * 2);
    };
    
    let noteIndex = 0;
    const melodyPattern = [0, 2, 1, 2, 0, 1];
    const playMelody = () => {
      if (!this.isPlaying || this.useCustomMusic) return;
      if (Math.random() > 0.5) return;
      const note = midNotes[melodyPattern[noteIndex % melodyPattern.length]];
      this.playBell(note, 8 + Math.random() * 4, 0.06, 0);
      noteIndex++;
    };
    
    const sparkleInterval = setInterval(() => { if (this.isPlaying && !this.useCustomMusic) playSparkle(); }, 4000 + Math.random() * 3000);
    const melodyInterval = setInterval(() => { if (this.isPlaying && !this.useCustomMusic) playMelody(); }, 6000 + Math.random() * 4000);
    this.intervals.push(sparkleInterval, melodyInterval);
    
    setTimeout(() => { if (this.isPlaying && !this.useCustomMusic) playMelody(); }, 1000);
    setTimeout(() => { if (this.isPlaying && !this.useCustomMusic) playSparkle(); }, 3000);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
};
var EmotionTrackerPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addRibbonIcon("heart", "情绪追踪器", () => new MoodflowModal(this.app, this).open());
    this.addCommand({ id: "open-moodflow", name: "打开情绪追踪器", callback: () => new MoodflowModal(this.app, this).open() });
    this.addSettingTab(new MoodflowSettingTab(this.app, this));
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  onunload() { Object.keys(this.mfFonts || {}).forEach((k) => { var f = this.mfFonts[k]; if (f && typeof f === "object") document.fonts.delete(f); }); }
  // 手帐、电台、色谱的字体借用「捕获便利贴」随插件带的开源字体；找不到就用系统字体
  mfLoadFonts(style) {
    var self = this, need = MF_STYLE_FONTS[style] || [];
    this.mfFonts = this.mfFonts || {};
    var dir = String((this.manifest && this.manifest.dir) || ".obsidian/plugins/emotion-tracker").replace(/[^/]+$/, "capture-notes") + "/fonts/";
    need.forEach(function(k) {
      if (self.mfFonts[k] || typeof FontFace === "undefined") return;
      var def = MF_FONTS[k]; self.mfFonts[k] = "loading";
      self.app.vault.adapter.readBinary(dir + def.file).then(function(buf) {
        var face = new FontFace(def.family, buf, def.desc || {});
        return face.load().then(function() { document.fonts.add(face); self.mfFonts[k] = face; });
      }).catch(function() { self.mfFonts[k] = "failed"; });
    });
  }
  // API Key：优先读 Obsidian 的加密存储（1.11.4 起），没有再读插件设置里的
  async mfElevenKey() {
    var s = this.settings, ss = this.app.secretStorage;
    if (s.elevenKeyName && ss && typeof ss.getSecret === "function") { try { var v = await ss.getSecret(s.elevenKeyName); if (v) return String(v).trim(); } catch (e) {} }
    return String(s.elevenApiKey || "").trim();
  }
  // 对话角色：第一次用时自动建好；情绪列表、音色、模型变了就更新
  async mfEnsureAgent(key) {
    var s = this.settings, headers = { "xi-api-key": key, "Content-Type": "application/json" };
    var toolBody = mfToolBody(this), toolHash = mfHash(JSON.stringify(toolBody));
    if (!s.elevenToolId || s.elevenToolHash !== toolHash) {
      var t = await mfRequest({ url: MF_EL + "/v1/convai/tools", method: "POST", headers: headers, body: JSON.stringify(toolBody) });
      if (!t.json || !t.json.id) throw new Error("建「记下情绪」工具失败，稍后再试");
      s.elevenToolId = t.json.id; s.elevenToolHash = toolHash; s.elevenAgentHash = "";
      await this.saveSettings();
    }
    var body = mfAgentBody(this, s.elevenToolId), hash = mfHash(JSON.stringify(body));
    if (s.elevenAgentId && s.elevenAgentHash === hash) return s.elevenAgentId;
    var id = "";
    if (s.elevenAgentId) { try { await mfRequest({ url: MF_EL + "/v1/convai/agents/" + encodeURIComponent(s.elevenAgentId), method: "PATCH", headers: headers, body: JSON.stringify(body) }); id = s.elevenAgentId; } catch (e) { id = ""; } }
    if (!id) {
      var a = await mfRequest({ url: MF_EL + "/v1/convai/agents/create", method: "POST", headers: headers, body: JSON.stringify(body) });
      id = a.json && a.json.agent_id;
      if (!id) throw new Error("建对话角色失败，稍后再试");
    }
    s.elevenAgentId = id; s.elevenAgentHash = hash; await this.saveSettings();
    return id;
  }
  // 获取所有情绪（内置+自定义）
  getAllEmotions() {
    return { ...emotions, ...(this.settings.customEmotions || {}) };
  }
  // 获取情绪的温馨话语
  getGentleWords(emotionKey) {
    if (gentleWords[emotionKey]) return gentleWords[emotionKey];
    // 自定义情绪使用通用温馨话语
    return ["\u8BB0\u5F55\u672C\u8EAB\u5C31\u662F\u610F\u4E49", "\u6BCF\u4E00\u523B\u90FD\u503C\u5F97\u88AB\u770B\u89C1", "\u4F60\u5728\u8FD9\u91CC\uFF0C\u5F88\u597D", "\u6B64\u523B\u7684\u611F\u53D7\u5F88\u91CD\u8981", "\u8BA4\u771F\u5BF9\u5F85\u81EA\u5DF1\u7684\u60C5\u7EEA"];
  }
  detectEmotion(text) {
    const t = text.toLowerCase();
    const p = {
      happy: ["\u5F00\u5FC3", "\u5FEB\u4E50", "\u9AD8\u5174", "\u5E78\u798F", "\u68D2", "\u7231", "\u559C\u6B22", "happy", "joy", "great", "love", "\u5174\u594B", "\u6EE1\u8DB3", "\u54C8\u54C8", "\u592A\u597D\u4E86", "\u8036", "\u563B\u563B", "\u7F8E\u597D", "\u611F\u52A8", "\u6B23\u6170", "nice", "\u8D5E", "\u5F88\u597D", "\u4E0D\u9519", "\u611F\u8C22", "\u8C22\u8C22"],
      sad: ["\u96BE\u8FC7", "\u4F24\u5FC3", "\u60B2\u4F24", "\u54ED", "\u5931\u843D", "\u5B64\u72EC", "sad", "cry", "lonely", "\u60F3\u5FF5", "\u9057\u61BE", "\u5931\u671B", "\u90C1\u95F7", "\u6CAE\u4E27", "\u5FC3\u75DB", "\u96BE\u53D7", "\u5509", "\u7CDF\u7CD5", "\u4E0D\u597D", "\u7D2F", "\u75B2\u60EB", "\u5FC3\u7D2F"],
      angry: ["\u751F\u6C14", "\u6124\u6012", "\u70E6", "\u8BA8\u538C", "angry", "hate", "\u607C\u706B", "\u6C14\u6124", "\u4E0D\u723D", "\u706B\u5927", "\u53EF\u6076", "\u70E6\u8E81", "\u70E6\u6B7B", "\u6C14\u6B7B", "\u53D7\u591F"],
      anxious: ["\u7126\u8651", "\u62C5\u5FC3", "\u7D27\u5F20", "\u5BB3\u6015", "anxious", "worried", "nervous", "\u4E0D\u5B89", "\u538B\u529B", "\u614C", "\u5FD0\u5FD1", "\u8FF7\u832B", "\u5D29\u6E83", "\u70E6\u607C", "\u7EA0\u7ED3"],
      calm: ["\u5E73\u9759", "\u653E\u677E", "\u5B89\u5FC3", "\u8212\u9002", "calm", "peaceful", "relaxed", "\u5B81\u9759", "\u6DE1\u5B9A", "\u60A0\u95F2", "\u60EC\u610F", "\u8212\u670D"]
    };
    for (const [e, w] of Object.entries(p))
      if (w.some((x) => t.includes(x)))
        return e;
    // 没有匹配到关键词时返回null，保持当前情绪不变
    return null;
  }
  async ensureFolder(path) {
    if (!this.app.vault.getAbstractFileByPath(path))
      await this.app.vault.createFolder(path);
  }
  // 自定义背景的粒子数据存在插件目录的独立文件里，data.json 只放设置（规范 §0.1）
  plBackgroundPath() { return `${this.manifest.dir}/custom-background.json`; }
  async plLoadBackground() {
    const legacy = this.settings.customImageData;
    if (Array.isArray(legacy) && legacy.length) { await this.plSaveBackground(legacy); return legacy; }
    try {
      const p = this.plBackgroundPath();
      if (await this.app.vault.adapter.exists(p)) return JSON.parse(await this.app.vault.adapter.read(p));
    } catch (e) { console.error("读取自定义背景失败", e); }
    return null;
  }
  async plSaveBackground(data) {
    await this.app.vault.adapter.write(this.plBackgroundPath(), JSON.stringify(data));
    this.settings.customImageData = null;
    await this.saveSettings();
  }
  async plClearBackground() {
    try { const p = this.plBackgroundPath(); if (await this.app.vault.adapter.exists(p)) await this.app.vault.adapter.remove(p); } catch (e) {}
    this.settings.customImageData = null;
  }
  // 规范 §6.1 的一行情绪记录
  plEmotionLine(entry, d, info, emoji) {
    var text = String(entry.text || "").trim().replace(/\r?\n/g, "\n\t");
    return "- " + d.format("HH:mm") + " " + emoji + " " + info.name + " [情绪:: " + entry.emotion + "]" +
      (entry.intensity ? " [强度:: " + entry.intensity + "]" : "") + (text ? " " + text : "");
  }
  // 日记不存在时用日记模板创建（规范 §6、§9.5 占位符）
  async plDiaryTemplate(d) {
    var fill = (t) => t
      .replace(/\{\{date\}\}/gi, d.format("YYYY-MM-DD"))
      .replace(/\{\{date:([^}]+)\}\}/gi, (_, fmt) => d.format(fmt))
      .replace(/\{\{time\}\}/gi, d.format("HH:mm"))
      .replace(/\{\{title\}\}/gi, d.format(this.settings.diaryFormat || "YYYY-MM-DD"));
    var candidates = [];
    if (this.settings.diaryTemplatePath) candidates.push(this.settings.diaryTemplatePath);
    try {
      var dn = this.app.internalPlugins?.getPluginById?.("daily-notes");
      if (dn?.enabled && dn?.instance?.options?.template) candidates.push(dn.instance.options.template);
    } catch (e) {}
    for (var p of candidates) {
      var tf = this.app.vault.getAbstractFileByPath(p) || this.app.vault.getAbstractFileByPath(p + ".md");
      if (tf instanceof import_obsidian.TFile) return fill(await this.app.vault.read(tf));
    }
    return "---\n类型: 日记\n日期: " + d.format("YYYY-MM-DD") + "\ntags: [日记]\n---\n# " + d.format("YYYY年M月D日 dddd") + "\n\n" + PL_MOOD_HEADING + "\n";
  }
  async saveEntry(entry) {
    const d = (0, import_obsidian.moment)(entry.timestamp);
    const allEmotions = this.getAllEmotions();
    const info = allEmotions[entry.emotion] || emotions.neutral;
    const time = this.settings.includeTime ? d.format("HH:mm") : "";
    const displayName = info.name;
    // 获取emoji：优先使用info.emoji，否则从iconEmojiMap获取
    const emoji = info.emoji || iconEmojiMap[info.icon] || "\u{1F4DD}";
    const color = info.color;
    
    const saveMode = "diary"; // 规范 §6：情绪统一写进当天日记「😊 今日情绪」
    
    if (saveMode === "single") {
      // 所有记录保存到同一个文件
      await this.ensureFolder(this.settings.savePath);
      const fn = `${this.settings.savePath}/心情日记.md`;
      const file = this.app.vault.getAbstractFileByPath(fn);
      const entryContent = `
> [!note|${color}] ${emoji} ${displayName}
> **${d.format("YYYY-MM-DD")}** · ${time}
> <!-- emotion:${entry.emotion} -->
> 
> ${entry.text.split('\n').join('\n> ')}

`;
      if (file instanceof import_obsidian.TFile) {
        const old = await this.app.vault.read(file);
        await this.app.vault.modify(file, old + entryContent);
      } else {
        await this.app.vault.create(fn, `---
tags:
  - mood
  - journal
cssclasses:
  - moodflow
---

# ${emoji} 心情日记

<div style="text-align:center;color:rgba(136,136,136,.8);font-size:0.9em;margin-bottom:2em">记录每一刻的心情</div>

${entryContent}`);
      }
    } else if (saveMode === "diary") {
      // 规范 §6.1：写入当天日记「## 😊 今日情绪」小节，一条一行，原子写入
      const fn = (0, import_obsidian.normalizePath)(`${this.settings.diaryPath}/${d.format(this.settings.diaryFormat || "YYYY-MM-DD")}.md`);
      let file = this.app.vault.getAbstractFileByPath(fn);
      if (!(file instanceof import_obsidian.TFile)) {
        const dir = fn.substring(0, fn.lastIndexOf("/"));
        if (dir) await this.ensureFolder(dir);
        file = await this.app.vault.create(fn, await this.plDiaryTemplate(d));
      }
      const line = this.plEmotionLine(entry, d, info, emoji);
      await this.app.vault.process(file, (data) => plInsertUnderHeading(data, line));
    } else {
      // daily模式：每天一个心情文件（默认）
      await this.ensureFolder(this.settings.savePath);
      const fn = `${this.settings.savePath}/${d.format(this.settings.dateFormat)}-mood.md`;
      const file = this.app.vault.getAbstractFileByPath(fn);
      const entryContent = `

<div style="background:linear-gradient(135deg,${color}15,${color}05);border-left:3px solid ${color};border-radius:0 12px 12px 0;padding:16px 20px;margin:1em 0">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
    <span style="font-size:1.5em">${emoji}</span>
    <span style="font-weight:600;color:${color}">${displayName}</span>
    <span style="color:rgba(136,136,136,.6);font-size:0.85em;margin-left:auto">${time}</span>
  </div>
  <!-- emotion:${entry.emotion} -->
  
  ${entry.text}
</div>

`;
      if (file instanceof import_obsidian.TFile) {
        const old = await this.app.vault.read(file);
        await this.app.vault.modify(file, old + entryContent);
      } else {
        await this.app.vault.create(fn, `---
tags:
  - mood
  - ${entry.emotion}
date: ${d.format("YYYY-MM-DD")}
mood: ${entry.emotion}
cssclasses:
  - moodflow
---

# ${emoji} ${d.format("YYYY年MM月DD日")} 心情日记

<div style="text-align:center;color:rgba(136,136,136,.8);font-size:0.9em;margin-bottom:2em">✨ 记录此刻的感受</div>
${entryContent}`);
      }
    }
    new import_obsidian.Notice(`${emoji} ${displayName} \u5DF2\u8BB0\u5F55`);
  }
  async saveEntryToFile(entry, file, heading) {
    const d = (0, import_obsidian.moment)(entry.timestamp);
    const info = this.getAllEmotions()[entry.emotion] || emotions.neutral;
    const emoji = info.emoji || iconEmojiMap[info.icon] || "\u{1F4DD}";
    const line = this.plEmotionLine(entry, d, info, emoji);
    await this.app.vault.process(file, (data) => {
      if (heading) {
        const esc = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`^#{1,6}\\s+${esc}\\s*$`, "i");
        if (data.split("\n").some((l) => re.test(l.trim()))) return plInsertUnderHeading(data, line, re, heading);
      }
      return data.replace(/\s*$/, "") + "\n" + line + "\n";
    });
    new import_obsidian.Notice(`${emoji} ${info.name} 已保存到 ${file.name}`);
  }
  async getEntries() {
    const entries = [];
    const allEmotions = this.getAllEmotions();
    // 修复：diary 模式的记录写在日记目录，统计也必须读日记目录
    const folderPaths = [this.settings.savePath];
    if (this.settings.diaryPath) folderPaths.push(this.settings.diaryPath); // 旧版 savePath 里的记录也继续读取
    const seen = new Set();
    for (const folderPath of folderPaths) {
    const folder = this.app.vault.getAbstractFileByPath((0, import_obsidian.normalizePath)(folderPath || ""));
    const isDiaryFolder = folderPath === this.settings.diaryPath && folderPath !== this.settings.savePath;
    if (folder instanceof import_obsidian.TFolder) {
      for (const f of folder.children) {
        if (f instanceof import_obsidian.TFile && f.extension === "md" && !seen.has(f.path)) {
          seen.add(f.path);
          const c = await this.app.vault.cachedRead(f);
          const dateM = c.match(/(?:^|\n)(?:date|日期):\s*(\d{4}-\d{2}-\d{2})/) || f.basename.match(/(\d{4}-\d{2}-\d{2})/);
          const baseDate = dateM ? dateM[1] : (0, import_obsidian.moment)().format("YYYY-MM-DD");

          // 规范 §6.1 一行格式
          const specEntries = plParseMoodLines(c, baseDate);
          entries.push(...specEntries); // 同一篇里新旧格式可能并存，两种都读
          // 查找所有情绪记录（通过emotion注释）
          const emotionMatches = [...c.matchAll(/<!--\s*emotion:(\w+)\s*-->/g)];
          
          emotionMatches.forEach((match, idx) => {
            const emotionKey = match[1];
            const matchStart = match.index;
            
            // 查找时间：向前搜索时间格式 HH:mm
            const textBefore = c.substring(Math.max(0, matchStart - 500), matchStart);
            const timeMatch = textBefore.match(/(\d{2}:\d{2})(?!.*\d{2}:\d{2})/);
            const time = timeMatch ? timeMatch[1] : "12:00";
            
            // 查找内容：从emotion注释之后到下一个记录或文件结尾
            const nextMatchStart = emotionMatches[idx + 1] ? emotionMatches[idx + 1].index : c.length;
            let textAfter = c.substring(match.index + match[0].length, nextMatchStart);
            
            // 清理内容：移除HTML标签、分隔线等
            textAfter = textAfter
              .replace(/<[^>]+>/g, '') // 移除HTML标签
              .replace(/^[\s\n>]+/, '') // 移除开头的空白和引用符号
              .replace(/\n---\s*$/, '') // 移除末尾分隔线
              .replace(/\n>[\s]*/g, '\n') // 移除引用符号
              .replace(/<\/div>\s*$/g, '') // 移除结尾的div标签
              .trim();
            
            // 如果是callout格式，处理引用内容
            if (textAfter.startsWith('>')) {
              textAfter = textAfter.replace(/^>\s*/gm, '').trim();
            }
            
            if (textAfter && textAfter.length > 0) {
              entries.push({ 
                id: new Date(`${baseDate} ${time}`).getTime() + idx, 
                emotion: emotionKey, 
                timestamp: `${baseDate}T${time}:00`, 
                text: textAfter.substring(0, 500) // 限制长度
              });
            }
          });
          
          // 兼容旧格式：按 ## 分割（日记里的 ## 是正文小节，不参与）
          if (emotionMatches.length === 0 && !isDiaryFolder && !specEntries.length) {
            const sections = c.split(/^## /m);
            sections.forEach((s) => {
              if (!s.trim()) return;
              const headerMatch = s.match(/^(\d{2}:\d{2})?\s*(.+?)(?:\s*心情记录)?\s*\n/);
              const emotionKeyMatch = s.match(/<!--\s*emotion:(\w+)\s*-->/);
              
              if (headerMatch) {
                const time = headerMatch[1] || "12:00";
                let emotionKey = "neutral";
                
                if (emotionKeyMatch) {
                  emotionKey = emotionKeyMatch[1];
                } else {
                  const emotionName = headerMatch[2].replace(/<[^>]+>/g, '').trim();
                  const found = Object.entries(allEmotions).find(([_, v]) => v.name === emotionName);
                  if (found) emotionKey = found[0];
                }
                
                let text = s.replace(/^.*\n/, "").replace(/<!--\s*emotion:\w+\s*-->\s*\n?/, "").trim();
                text = text.replace(/\n---\s*$/, "").trim();
                
                if (text) {
                  entries.push({ 
                    id: new Date(`${baseDate} ${time}`).getTime(), 
                    emotion: emotionKey, 
                    timestamp: `${baseDate}T${time}:00`, 
                    text 
                  });
                }
              }
            });
          }
        }
      }
    }
    }
    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};
var MoodflowModal = class extends import_obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.state = "orb";
    this.emotion = "happy";
    this.text = "";
    this.entries = [];
    this.gentleWord = "";
    this.plugin = plugin;
    this.ambientMusic = new AmbientMusic();
    this.musicPlaying = false;
    this.intensity = 5; this.vt = null; this.voice = null; this.pending = null;
  }
  get theme() {
    return themes[this.plugin.settings.theme] || themes.midnight;
  }
  async onOpen() {
    // 从设置加载保存的图片数据和粒子参数（快速操作）
    const plBg = await this.plugin.plLoadBackground();
    if (plBg) this.customImageData = plBg;
    if (this.plugin.settings.particleParams) {
      this.particleParams = this.plugin.settings.particleParams;
    }
    // 加载音乐音量设置
    if (this.plugin.settings.musicVolume !== undefined) {
      this.ambientMusic.setVolume(this.plugin.settings.musicVolume);
    }
    // 加载自定义音乐
    if (this.plugin.settings.customMusicData) {
      await this.ambientMusic.loadCustomMusic(this.plugin.settings.customMusicData);
      this.ambientMusic.useCustomMusic = this.plugin.settings.useCustomMusic || false;
    }
    // 自动播放轻音乐（如果设置启用）
    if (this.plugin.settings.musicEnabled !== false) {
      this.ambientMusic.start();
      this.musicPlaying = true;
    }
    this.pickGentleWord();
    this.modalEl.addClass("mf-root");
    this.injectStyles();

    // 立即渲染界面（空状态）
    this.render();

    // 后台异步加载历史记录（不阻塞UI）
    this.plugin.getEntries().then(entries => {
      this.entries = entries;
      this.render(); // 数据加载完成后刷新界面
    }).catch(err => {
      console.error('Failed to load entries:', err);
      this.entries = [];
    });
  }
  pickGentleWord() {
    const words = this.plugin.getGentleWords(this.emotion);
    this.gentleWord = words[Math.floor(Math.random() * words.length)];
  }
  render() {
    const { contentEl } = this;
    if (this.state !== "voice" && this.voice) this.mfStopVoice();
    if (this.cleanupDrag) { this.cleanupDrag(); this.cleanupDrag = null; }
    contentEl.empty();
    contentEl.addClass("mf-modal");
    const style = mfStyle(this.plugin.settings);
    MF_STYLES.forEach((s) => contentEl.classList.toggle("mf-s-" + s[0], s[0] === style));
    // 光球用「主题」里选的配色；其他风格的底色写在样式表里
    if (style === "orb") {
      contentEl.style.setProperty("--theme-bg1", this.theme.bg1);
      contentEl.style.setProperty("--theme-bg2", this.theme.bg2);
      contentEl.style.setProperty("--theme-accent", this.theme.accent);
    } else ["--theme-bg1", "--theme-bg2", "--theme-accent"].forEach((p) => contentEl.style.removeProperty(p));
    this.plugin.mfLoadFonts(style);
    const main = contentEl.createDiv({ cls: "mf-main" });
    if (this.state === "orb") {
      if (style === "orb") { this.renderOrb(main); this.mfOrbPanel(main); }
      else this.mfHome(main, style);
    }
    else if (this.state === "voice")
      this.mfVoiceScreen(main, style);
    else if (this.state === "confirm")
      this.mfConfirmScreen(main, style);
    else if (this.state === "input")
      this.renderInput(main);
    else if (this.state === "history")
      this.renderHistory(main);
    else if (this.state === "stats")
      this.renderStats(main);
    else if (this.state === "settings")
      this.renderSettings(main);
    if (this.state !== "voice" && this.state !== "confirm") this.renderNav(contentEl);
    this.mfBind(main);
  }
  renderNav(el) {
    const nav = el.createDiv({ cls: "mf-nav" });
    this.navBtn(nav, "orb", "\u9996\u9875", '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>', this.state === "orb" || this.state === "input");
    this.navBtn(nav, "history", "\u8BB0\u5F55", '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', this.state === "history");
    this.navBtn(nav, "stats", "\u7EDF\u8BA1", '<path d="M18 20V10M12 20V4M6 20v-6"/>', this.state === "stats");
    this.navBtn(nav, "settings", "\u4E3B\u9898", '<circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>', this.state === "settings");
  }
  navBtn(nav, action, label, svg, isActive = false) {
    const btn = nav.createDiv({ cls: `mf-nb ${isActive ? "active" : ""}` });
    btn.innerHTML = `<div class="mf-ni"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${svg}</svg></div><span>${label}</span>`;
    btn.onclick = async () => {
      if (action === "orb") {
        this.state = "orb";
        this.text = "";
        this.emotion = "happy";
        this.render();
      } else {
        this.state = action;
        this.render();
      }
    };
  }
  renderOrb(el) {
    const allEmotions = this.plugin.getAllEmotions();
    const c = allEmotions[this.emotion] || emotions.neutral;
    const wrap = el.createDiv({ cls: "mf-orb-wrap" });
    wrap.createDiv({ cls: "mf-bg" });
    const stars = wrap.createDiv({ cls: "mf-stars" });
    for (let i = 0; i < 50; i++) {
      const s = stars.createDiv({ cls: "mf-star" });
      s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${Math.random() * 3}s;opacity:${0.2 + Math.random() * 0.5}`;
    }

    // 检查是否有自定义图片
    if (this.customImageData && this.customImageData.length > 0) {
      // 渲染自定义图片粒子球体
      this.renderCustomParticleOrb(wrap, c);
    } else {
      // 默认球体
      const ps = wrap.createDiv({ cls: "mf-ps" });
      for (let i = 0; i < 12; i++) {
        const p = ps.createDiv({ cls: "mf-op inner" });
        p.style.cssText = `--a:${i * 30}deg;--d:${i * 0.2}s;background:${c.color}`;
      }
      for (let i = 0; i < 18; i++) {
        const p = ps.createDiv({ cls: "mf-op mid" });
        p.style.cssText = `--a:${i * 20}deg;--d:${i * 0.15}s;background:${c.color}`;
      }
      for (let i = 0; i < 24; i++) {
        const p = ps.createDiv({ cls: "mf-op out" });
        p.style.cssText = `--a:${i * 15}deg;--d:${i * 0.1}s;background:${c.color}`;
      }
      const fp = wrap.createDiv({ cls: "mf-fp" });
      for (let i = 0; i < 30; i++) {
        const p = fp.createDiv({ cls: "mf-fpp" });
        p.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--dur:${8 + Math.random() * 12}s;--del:${Math.random() * 5}s;background:${c.color};width:${2 + Math.random() * 4}px;height:${2 + Math.random() * 4}px`;
      }
      const g1 = wrap.createDiv({ cls: "mf-glow g1" });
      g1.style.background = `radial-gradient(circle,${c.glow} 0%,transparent 60%)`;
      const g2 = wrap.createDiv({ cls: "mf-glow g2" });
      g2.style.background = `radial-gradient(circle,${c.color}40 0%,transparent 50%)`;
      const orb = wrap.createDiv({ cls: "mf-orb" });
      orb.style.background = c.gradient;
      orb.style.boxShadow = `0 0 80px ${c.glow},0 0 160px ${c.glow},0 0 240px ${c.color}30,inset 0 0 60px rgba(255,255,255,.15),inset -20px -20px 60px ${this.darken(c.color, 40)}50`;
      orb.createDiv({ cls: "mf-orb-inner" });
      orb.createDiv({ cls: "mf-orb-hl" });
      orb.createDiv({ cls: "mf-orb-ref" });
      this.setupOrbDrag(wrap, orb, null, null, null);
    }

    // 上传图片按钮
    const uploadBtn = wrap.createDiv({ cls: "mf-upload-btn" });
    uploadBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`;
    uploadBtn.setAttribute("title", "上传图片生成粒子球体");
    
    const fileInput = wrap.createEl("input", { type: "file", cls: "mf-file-input" });
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    
    uploadBtn.onclick = () => fileInput.click();
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await this.processImage(file);
        this.render();
      }
    };

    // 清除图片按钮（仅当有自定义图片时显示）
    if (this.customImageData && this.customImageData.length > 0) {
      const clearBtn = wrap.createDiv({ cls: "mf-clear-btn" });
      clearBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 18L18 6M6 6l12 12"/></svg>`;
      clearBtn.setAttribute("title", "清除自定义图片");
      clearBtn.onclick = async () => {
        this.customImageData = null;
        this.particleParams = null;
        // 清除设置中的数据
        await this.plugin.plClearBackground();
        this.plugin.settings.particleParams = null;
        await this.plugin.saveSettings();
        this.render();
      };
    }

    // 音乐播放按钮
    const musicBtn = wrap.createDiv({ cls: `mf-music-btn ${this.musicPlaying ? 'playing' : ''}` });
    musicBtn.innerHTML = this.musicPlaying 
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;
    musicBtn.setAttribute("title", this.musicPlaying ? "音乐设置" : "播放轻音乐");

    // 音乐控制面板（始终创建，通过CSS控制显示隐藏）
    const musicPanel = wrap.createDiv({ cls: "mf-music-panel" });
    
    // 辅助函数：收起面板
    const closePanel = () => {
      musicPanel.classList.remove("open");
    };
    
    // 音量控制
    const volumeRow = musicPanel.createDiv({ cls: "mf-music-row" });
    volumeRow.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
    const volumeSlider = volumeRow.createEl("input", { type: "range", cls: "mf-music-slider" });
    volumeSlider.min = "0";
    volumeSlider.max = "100";
    volumeSlider.value = String(this.ambientMusic.volume * 100);
    volumeSlider.oninput = (e) => {
      const vol = parseFloat(e.target.value) / 100;
      this.ambientMusic.setVolume(vol);
      this.plugin.settings.musicVolume = vol;
      this.plugin.saveSettings();
    };

    // 音乐来源切换
    const hasCustomMusic = !!this.ambientMusic.customMusicData;
    const sourceRow = musicPanel.createDiv({ cls: "mf-music-row mf-music-source" });
    
    // 默认音乐选项
    const defaultOpt = sourceRow.createDiv({ cls: `mf-source-opt ${!this.ambientMusic.useCustomMusic ? 'active' : ''}` });
    defaultOpt.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>冥想</span>`;
    defaultOpt.onclick = async () => {
      this.ambientMusic.setUseCustomMusic(false);
      this.plugin.settings.useCustomMusic = false;
      await this.plugin.saveSettings();
      closePanel();
      this.render();
    };

    // 自定义音乐选项
    const customOpt = sourceRow.createDiv({ cls: `mf-source-opt ${this.ambientMusic.useCustomMusic && hasCustomMusic ? 'active' : ''} ${!hasCustomMusic ? 'disabled' : ''}` });
    customOpt.innerHTML = hasCustomMusic 
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg><span>自定义</span>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><span>上传</span>`;
    
    if (hasCustomMusic) {
      customOpt.onclick = async () => {
        this.ambientMusic.setUseCustomMusic(true);
        this.plugin.settings.useCustomMusic = true;
        await this.plugin.saveSettings();
        closePanel();
        this.render();
      };
    } else {
      // 上传功能
      const fileInput = wrap.createEl("input", { type: "file", cls: "mf-file-input" });
      fileInput.accept = "audio/*";
      fileInput.style.display = "none";
      customOpt.onclick = () => fileInput.click();
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          await this.loadMusicFile(file);
          closePanel();
        }
      };
    }

    // 如果有自定义音乐，显示清除按钮
    if (hasCustomMusic) {
      const clearRow = musicPanel.createDiv({ cls: "mf-music-row mf-music-clear" });
      const clearBtn = clearRow.createDiv({ cls: "mf-clear-music-btn" });
      clearBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg><span>清除自定义音乐</span>`;
      clearBtn.onclick = async () => {
        this.ambientMusic.clearCustomMusic();
        this.plugin.settings.customMusicData = null;
        this.plugin.settings.useCustomMusic = false;
        await this.plugin.saveSettings();
        if (this.musicPlaying) {
          this.ambientMusic.stop();
          this.ambientMusic.start();
        }
        closePanel();
        this.render();
      };
    }

    // 音乐按钮点击逻辑
    musicBtn.onclick = () => {
      if (!this.musicPlaying) {
        // 如果音乐未播放，点击开始播放
        this.musicPlaying = this.ambientMusic.toggle();
        this.plugin.settings.musicEnabled = this.musicPlaying;
        this.plugin.saveSettings();
        this.render();
      } else {
        // 如果音乐正在播放，点击切换面板显示/隐藏
        musicPanel.classList.toggle("open");
      }
    };

    // 点击面板外部关闭面板
    const handleOutsideClick = (e) => {
      if (!musicPanel.contains(e.target) && !musicBtn.contains(e.target)) {
        closePanel();
      }
    };
    wrap.addEventListener("click", handleOutsideClick);

    const hint = wrap.createDiv({ cls: "mf-hint" });
    hint.innerHTML = '<span class="mf-h1">\u8F7B\u89E6\u7403\u4F53</span><span class="mf-h2">\u8BB0\u5F55\u6B64\u523B\u7684\u5FC3\u5883</span>';
  }

  // 渲染自定义图片粒子球体 - 3D增强版
  renderCustomParticleOrb(wrap, c) {
    const allEmotions = this.plugin.getAllEmotions();
    const container = wrap.createDiv({ cls: "mf-particle-container" });
    const canvas = container.createEl("canvas", { cls: "mf-particle-canvas" });
    const canvasWidth = 380;
    const canvasHeight = 480;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    // 3D粒子参数
    if (!this.particleParams) {
      this.particleParams = {
        dispersion: 1.0,
        particleSize: 2.0,
        contrast: 1.2,
        flowSpeed: 0.4,
        flowAmplitude: 0.2,
        depthStrength: 50,
        mouseRadius: 100,
        colorShiftSpeed: 0,
        // 3D参数
        rotationSpeed: 0.15,    // 自动旋转速度
        perspective: 400,       // 透视强度（越小3D感越强）
        depthRange: 120,        // Z轴深度范围
        tiltX: 0.15,            // X轴倾斜
        tiltY: 0,               // Y轴倾斜
        sphereWrap: 0.3,        // 球形包裹程度
        depthOfField: 0.6,      // 景深模糊强度
        ambientLight: 0.3,      // 环境光
        lightZ: 150             // 光源Z位置
      };
    }
    const params = this.particleParams;

    const particles = this.customImageData;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // 3D状态
    let animationId;
    let time = 0;
    let rotationY = 0;      // Y轴旋转角度
    let rotationX = 0;      // X轴旋转角度
    let targetRotationY = 0;
    let targetRotationX = 0;
    let mouseX = centerX;
    let mouseY = centerY;
    let isMouseOver = false;
    let isDragging = false;
    let hasDragged = false;
    let dragStartX = 0, dragStartY = 0;
    let lastDragX = 0, lastDragY = 0;
    let velocityRotY = 0, velocityRotX = 0;

    // 为每个粒子初始化3D状态
    const particleStates = particles.map((p, i) => {
      // 根据位置计算初始Z坐标（形成球面）
      const distFromCenter = Math.sqrt(p.x * p.x + p.y * p.y);
      const maxDist = 160;
      const normalizedDist = Math.min(distFromCenter / maxDist, 1);
      // 球形映射：边缘的粒子Z值更小（更远）
      const sphereZ = Math.cos(normalizedDist * Math.PI * 0.5) * params.depthRange * params.sphereWrap;
      // 添加随机Z偏移增加层次感
      const randomZ = (Math.random() - 0.5) * params.depthRange * (1 - params.sphereWrap);
      
      return {
        ...p,
        homeX: p.x,
        homeY: p.y,
        homeZ: sphereZ + randomZ,
        currentX: p.x,
        currentY: p.y,
        currentZ: sphereZ + randomZ,
        phase: Math.random() * Math.PI * 2,
        pulsePhase: Math.random() * Math.PI * 2
      };
    });

    // 3D旋转变换
    const rotate3D = (x, y, z, rotY, rotX) => {
      // 绕Y轴旋转
      let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
      let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
      // 绕X轴旋转
      let y1 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
      let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
      return { x: x1, y: y1, z: z2 };
    };

    // 透视投影
    const project = (x, y, z) => {
      const scale = params.perspective / (params.perspective + z);
      return {
        x: centerX + x * scale,
        y: centerY + y * scale,
        scale: scale
      };
    };

    // 简单噪声
    const noise = (x, y, t) => {
      return Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t * 0.7) * 
             Math.sin((x + y) * 0.03 + t * 0.5);
    };

    const animate = () => {
      // 清除画布 - 使用渐变背景增强深度感
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300);
      gradient.addColorStop(0, "rgba(5, 5, 10, 0.3)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.35)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      time += 0.016 * params.flowSpeed;

      // 自动旋转
      if (!isDragging) {
        targetRotationY += params.rotationSpeed * 0.016;
        // 添加轻微的上下摆动
        targetRotationX = Math.sin(time * 0.3) * params.tiltX;
      }

      // 旋转惯性
      velocityRotY *= 0.95;
      velocityRotX *= 0.95;
      targetRotationY += velocityRotY;
      targetRotationX += velocityRotX;

      // 平滑旋转
      rotationY += (targetRotationY - rotationY) * 0.1;
      rotationX += (targetRotationX - rotationX) * 0.1;

      // 收集所有粒子数据用于排序（Z-sorting）
      const renderData = [];

      particleStates.forEach((p, i) => {
        // 呼吸效果 - Z轴脉动
        const breathe = Math.sin(time * 0.8 + p.pulsePhase) * 8;
        
        // 流动效果
        const flowX = Math.sin(time * 0.5 + p.phase) * params.flowAmplitude * 5;
        const flowY = Math.cos(time * 0.3 + p.phase * 1.5) * params.flowAmplitude * 5;
        const flowZ = Math.sin(time * 0.4 + p.phase * 0.8) * params.flowAmplitude * 10;

        // 3D位置
        let x3d = p.homeX * params.dispersion + flowX;
        let y3d = p.homeY * params.dispersion + flowY;
        let z3d = p.homeZ + flowZ + breathe;

        // 鼠标交互 - 3D推开效果
        if (isMouseOver) {
          // 先计算投影位置
          const tempRot = rotate3D(x3d, y3d, z3d, rotationY, rotationX);
          const tempProj = project(tempRot.x, tempRot.y, tempRot.z);
          
          const dx = tempProj.x - mouseX;
          const dy = tempProj.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = params.mouseRadius;
          
          if (dist < radius && dist > 0) {
            const t = dist / radius;
            const force = Math.pow(1 - t, 2) * params.depthStrength;
            
            // 向外推开 + Z轴推出
            const angle = Math.atan2(dy, dx);
            x3d += Math.cos(angle) * force * 0.3;
            y3d += Math.sin(angle) * force * 0.3;
            z3d += force * 1.5; // 向前推出
            
            // 添加涟漪
            const ripple = Math.sin(dist * 0.1 - time * 4) * (1 - t) * 10;
            z3d += ripple;
          }
        }

        // 平滑过渡
        p.currentX += (x3d - p.currentX) * 0.15;
        p.currentY += (y3d - p.currentY) * 0.15;
        p.currentZ += (z3d - p.currentZ) * 0.15;

        // 3D旋转变换
        const rotated = rotate3D(p.currentX, p.currentY, p.currentZ, rotationY, rotationX);
        
        // 透视投影
        const projected = project(rotated.x, rotated.y, rotated.z);

        // 计算光照（基于Z位置）
        const lightFactor = (rotated.z + params.depthRange) / (params.depthRange * 2);
        const lighting = params.ambientLight + (1 - params.ambientLight) * Math.max(0, Math.min(1, lightFactor));

        // 计算景深模糊（基于Z位置）
        const depthBlur = Math.abs(rotated.z) / params.depthRange * params.depthOfField;

        // 计算大小
        const brightness = (p.r + p.g + p.b) / 3 / 255;
        const baseSize = params.particleSize * (0.6 + brightness * params.contrast * 0.8);
        const size = baseSize * projected.scale * (1 + depthBlur * 0.5);

        // 计算透明度（远处更透明）
        const depthAlpha = Math.max(0.2, 1 - Math.abs(rotated.z) / params.depthRange * 0.6);
        const alpha = (0.7 + brightness * 0.3) * depthAlpha * lighting;

        renderData.push({
          x: projected.x,
          y: projected.y,
          z: rotated.z,
          size: size,
          alpha: alpha,
          r: p.r,
          g: p.g,
          b: p.b,
          brightness: brightness,
          lighting: lighting,
          blur: depthBlur,
          scale: projected.scale
        });
      });

      // Z-sorting：从远到近排序
      renderData.sort((a, b) => a.z - b.z);

      // 渲染粒子
      renderData.forEach((p, i) => {
        let { r, g, b } = p;
        
        // 颜色偏移
        if (params.colorShiftSpeed > 0) {
          const hueShift = (time * params.colorShiftSpeed * 50 + i * 0.5) % 360;
          const shifted = this.shiftHue(r, g, b, hueShift);
          r = shifted.r; g = shifted.g; b = shifted.b;
        }

        // 应用光照到颜色
        r = Math.round(r * p.lighting);
        g = Math.round(g * p.lighting);
        b = Math.round(b * p.lighting);

        // 景深效果 - 远处粒子更模糊（通过多层绘制模拟）
        if (p.blur > 0.3) {
          // 模糊光晕
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + p.blur), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.3})`;
          ctx.fill();
        }

        // 主粒子
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fill();

        // 高亮发光 - 近处亮色粒子
        if (p.brightness > 0.5 && p.z > 0) {
          const glowSize = p.size * (1.5 + p.scale * 0.5);
          const glowAlpha = p.alpha * 0.2 * (p.z / params.depthRange + 0.5);
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}, ${glowAlpha})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // 鼠标/触摸事件 - 3D旋转控制
    const getEventPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      return {
        x: (clientX - rect.left) * (canvasWidth / rect.width),
        y: (clientY - rect.top) * (canvasHeight / rect.height)
      };
    };

    canvas.addEventListener("mouseenter", () => { isMouseOver = true; });
    canvas.addEventListener("mouseleave", () => { isMouseOver = false; });
    
    canvas.addEventListener("mousemove", (e) => {
      const pos = getEventPos(e);
      
      if (isDragging) {
        const dx = pos.x - lastDragX;
        const dy = pos.y - lastDragY;
        
        // 3D旋转 - 水平拖拽控制Y轴旋转，垂直拖拽控制X轴旋转
        velocityRotY = dx * 0.008;
        velocityRotX = -dy * 0.005;
        
        if (Math.abs(pos.x - dragStartX) > 8 || Math.abs(pos.y - dragStartY) > 8) {
          hasDragged = true;
        }
        
        lastDragX = pos.x;
        lastDragY = pos.y;
      }
      
      mouseX = pos.x;
      mouseY = pos.y;
    });

    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      hasDragged = false;
      const pos = getEventPos(e);
      dragStartX = pos.x;
      dragStartY = pos.y;
      lastDragX = pos.x;
      lastDragY = pos.y;
      canvas.style.cursor = "grabbing";
    });

    canvas.addEventListener("mouseup", () => {
      if (!hasDragged) {
        // 点击进入输入界面
        this.state = "input";
        this.pickGentleWord();
        cancelAnimationFrame(animationId);
        this.render();
      }
      isDragging = false;
      canvas.style.cursor = "grab";
    });

    canvas.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        canvas.style.cursor = "grab";
      }
    });

    // 触摸事件
    canvas.addEventListener("touchstart", (e) => {
      isMouseOver = true;
      isDragging = true;
      hasDragged = false;
      const pos = getEventPos(e);
      dragStartX = pos.x;
      dragStartY = pos.y;
      lastDragX = pos.x;
      lastDragY = pos.y;
      mouseX = pos.x;
      mouseY = pos.y;
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener("touchmove", (e) => {
      const pos = getEventPos(e);
      
      if (isDragging) {
        const dx = pos.x - lastDragX;
        const dy = pos.y - lastDragY;
        
        // 3D旋转
        velocityRotY = dx * 0.008;
        velocityRotX = -dy * 0.005;
        
        if (Math.abs(pos.x - dragStartX) > 8 || Math.abs(pos.y - dragStartY) > 8) {
          hasDragged = true;
        }
        
        lastDragX = pos.x;
        lastDragY = pos.y;
      }
      
      mouseX = pos.x;
      mouseY = pos.y;
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener("touchend", () => {
      isMouseOver = false;
      if (!hasDragged) {
        // 点击进入输入界面
        this.state = "input";
        this.pickGentleWord();
        cancelAnimationFrame(animationId);
        this.render();
      }
      isDragging = false;
    });

    canvas.style.cursor = "grab";

    this.cleanupDrag = () => {
      cancelAnimationFrame(animationId);
    };

    // 创建参数调节面板
    this.createParticleSettingsPanel(wrap);
  }

  // 创建参数调节面板
  createParticleSettingsPanel(wrap) {
    // 设置按钮
    const settingsBtn = wrap.createDiv({ cls: "mf-settings-btn" });
    settingsBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`;
    
    // 面板
    const panel = wrap.createDiv({ cls: "mf-particle-panel" });
    const panelHeader = panel.createDiv({ cls: "mf-panel-header" });
    panelHeader.innerHTML = `<span>粒子参数</span><div class="mf-panel-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></div>`;

    const panelContent = panel.createDiv({ cls: "mf-panel-content" });

    const params = this.particleParams;
    const sliders = [
      { key: "particleSize", label: "PARTICLE SIZE", min: 0.5, max: 5, step: 0.1, desc: "粒子大小" },
      { key: "dispersion", label: "DISPERSION", min: 0.5, max: 2, step: 0.1, desc: "分散度" },
      { key: "contrast", label: "CONTRAST", min: 0.5, max: 2, step: 0.1, desc: "对比度" },
      { key: "rotationSpeed", label: "ROTATION", min: 0, max: 1, step: 0.05, desc: "旋转速度" },
      { key: "perspective", label: "PERSPECTIVE", min: 200, max: 800, step: 20, desc: "透视强度" },
      { key: "depthRange", label: "DEPTH RANGE", min: 50, max: 200, step: 10, desc: "深度范围" },
      { key: "sphereWrap", label: "SPHERE WRAP", min: 0, max: 1, step: 0.1, desc: "球形程度" },
      { key: "depthOfField", label: "DEPTH OF FIELD", min: 0, max: 1, step: 0.1, desc: "景深模糊" },
      { key: "flowSpeed", label: "FLOW SPEED", min: 0, max: 2, step: 0.1, desc: "流动速度" },
      { key: "mouseRadius", label: "MOUSE RADIUS", min: 20, max: 200, step: 10, desc: "鼠标半径" },
      { key: "depthStrength", label: "PUSH STRENGTH", min: 0, max: 100, step: 5, desc: "推开强度" },
      { key: "colorShiftSpeed", label: "COLOR SHIFT", min: 0, max: 2, step: 0.1, desc: "颜色偏移" }
    ];

    sliders.forEach(s => {
      const row = panelContent.createDiv({ cls: "mf-slider-row" });
      const label = row.createDiv({ cls: "mf-slider-label" });
      label.innerHTML = `<span>${s.label}</span><span class="mf-slider-value">${params[s.key].toFixed(1)}</span>`;
      
      const sliderWrap = row.createDiv({ cls: "mf-slider-wrap" });
      const slider = sliderWrap.createEl("input", { 
        type: "range", 
        cls: "mf-slider",
        attr: { min: s.min, max: s.max, step: s.step }
      });
      slider.value = params[s.key];
      
      let saveTimeout;
      slider.addEventListener("input", (e) => {
        params[s.key] = parseFloat(e.target.value);
        label.querySelector(".mf-slider-value").textContent = params[s.key].toFixed(1);
        // 防抖保存参数
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
          this.plugin.settings.particleParams = this.particleParams;
          await this.plugin.saveSettings();
        }, 500);
      });
    });

    // 重置按钮
    const resetBtn = panelContent.createDiv({ cls: "mf-reset-btn" });
    resetBtn.textContent = "重置参数";
    resetBtn.onclick = async () => {
      this.particleParams = {
        dispersion: 1.0,
        particleSize: 2.0,
        contrast: 1.2,
        flowSpeed: 0.4,
        flowAmplitude: 0.2,
        depthStrength: 50,
        mouseRadius: 100,
        colorShiftSpeed: 0,
        rotationSpeed: 0.15,
        perspective: 400,
        depthRange: 120,
        tiltX: 0.15,
        tiltY: 0,
        sphereWrap: 0.3,
        depthOfField: 0.6,
        ambientLight: 0.3,
        lightZ: 150
      };
      this.plugin.settings.particleParams = this.particleParams;
      await this.plugin.saveSettings();
      this.render();
    };

    // 开关面板
    let panelOpen = false;
    settingsBtn.onclick = () => {
      panelOpen = !panelOpen;
      panel.classList.toggle("open", panelOpen);
      settingsBtn.classList.toggle("active", panelOpen);
    };

    panelHeader.querySelector(".mf-panel-close").onclick = () => {
      panelOpen = false;
      panel.classList.remove("open");
      settingsBtn.classList.remove("active");
    };
  }

  // HSL颜色偏移
  shiftHue(r, g, b, degrees) {
    // RGB to HSL
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    // Shift hue
    h = (h + degrees / 360) % 1;
    if (h < 0) h += 1;

    // HSL to RGB
    let r1, g1, b1;
    if (s === 0) {
      r1 = g1 = b1 = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r1 = hue2rgb(p, q, h + 1/3);
      g1 = hue2rgb(p, q, h);
      b1 = hue2rgb(p, q, h - 1/3);
    }

    return { r: Math.round(r1 * 255), g: Math.round(g1 * 255), b: Math.round(b1 * 255) };
  }

  // 设置默认球体的拖拽
  setupOrbDrag(wrap, orb, g1, g2, ps) {
    let isDragging = false;
    let hasDragged = false;
    let startX = 0, startY = 0;
    let offsetX = 0, offsetY = 0;
    let currentX = 0, currentY = 0;
    
    const g1El = wrap.querySelector(".mf-glow.g1");
    const g2El = wrap.querySelector(".mf-glow.g2");
    const psEl = wrap.querySelector(".mf-ps");
    
    const onMouseDown = (e) => {
      isDragging = true;
      hasDragged = false;
      startX = e.clientX || (e.touches && e.touches[0].clientX);
      startY = e.clientY || (e.touches && e.touches[0].clientY);
      orb.style.animation = 'none';
      orb.style.cursor = 'grabbing';
      e.preventDefault();
    };
    
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const dx = clientX - startX;
      const dy = clientY - startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasDragged = true;
      }
      currentX = offsetX + dx;
      currentY = offsetY + dy;
      const maxX = 100, maxY = 150;
      currentX = Math.max(-maxX, Math.min(maxX, currentX));
      currentY = Math.max(-maxY, Math.min(maxY, currentY));
      orb.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.05)`;
      if (g1El) g1El.style.transform = `translate(${currentX * 0.8}px, ${currentY * 0.8}px)`;
      if (g2El) g2El.style.transform = `translate(${currentX * 0.6}px, ${currentY * 0.6}px)`;
      if (psEl) psEl.style.transform = `translate(${currentX * 0.5}px, ${currentY * 0.5}px)`;
    };
    
    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      offsetX = currentX;
      offsetY = currentY;
      orb.style.cursor = 'grab';
      // 点击即可进入
      this.state = "input";
      this.pickGentleWord();
      this.render();
    };
    
    orb.style.cursor = 'grab';
    orb.addEventListener('mousedown', onMouseDown);
    orb.addEventListener('touchstart', onMouseDown, { passive: false });
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove, { passive: false });
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
    
    this.cleanupDrag = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
    };
  }

  // 处理上传的图片
  async processImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const size = 128; // 增大采样大小
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");

          // 保持纵横比绘制
          const scale = Math.min(size / img.width, size / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const x = (size - w) / 2;
          const y = (size - h) / 2;

          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, x, y, w, h);
          
          const imageData = ctx.getImageData(0, 0, size, size);
          const data = imageData.data;

          const particles = [];
          const step = 1; // 更密集的采样

          for (let py = 0; py < size; py += step) {
            for (let px = 0; px < size; px += step) {
              const i = (py * size + px) * 4;
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const a = data[i + 3];

              // 跳过透明或太暗的像素
              if (a < 50) continue;
              const brightness = (r + g + b) / 3;
              if (brightness < 15) continue;

              // 将坐标映射到画布中心
              const mappedX = (px - size / 2) * 2.5;
              const mappedY = (py - size / 2) * 2.5;

              particles.push({
                r, g, b,
                x: mappedX,
                y: mappedY,
                size: 0.5 + (brightness / 255) * 1.5
              });
            }
          }

          // 如果粒子太多，随机采样
          if (particles.length > 15000) {
            const sampled = [];
            const ratio = 15000 / particles.length;
            particles.forEach(p => {
              if (Math.random() < ratio) sampled.push(p);
            });
            this.customImageData = sampled;
          } else {
            this.customImageData = particles;
          }

          // 保存粒子数据到独立文件
          await this.plugin.plSaveBackground(this.customImageData);

          resolve();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  renderInput(el) {
    const allEmotions = this.plugin.getAllEmotions();
    const c = allEmotions[this.emotion] || emotions.neutral;
    const wrap = el.createDiv({ cls: "mf-in-wrap" });
    wrap.createDiv({ cls: "mf-in-bg" });
    const back = wrap.createDiv({ cls: "mf-back" });
    back.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;
    back.onclick = () => {
      this.state = "orb";
      this.text = "";
      this.emotion = "neutral";
      this.render();
    };
    
    // 顶部区域：标题和小球
    const topArea = wrap.createDiv({ cls: "mf-in-top" });
    const q = topArea.createDiv({ cls: "mf-q" });
    q.textContent = "\u4F60\u6B64\u523B\u7684\u5FC3\u60C5\u662F\uFF1F";
    const mo = topArea.createDiv({ cls: "mf-mo-wrap" });
    const mg = mo.createDiv({ cls: "mf-mo-glow" });
    mg.style.background = `radial-gradient(circle,${c.glow} 0%,transparent 70%)`;
    const morb = mo.createDiv({ cls: "mf-mo" });
    morb.style.background = c.gradient;
    morb.style.boxShadow = `0 0 40px ${c.glow},0 0 80px ${c.color}40`;
    const gw = topArea.createDiv({ cls: "mf-gw" });
    gw.textContent = this.gentleWord;
    gw.style.color = `${c.color}99`;

    // 底部区域：输入框和情绪按钮
    const bottomArea = wrap.createDiv({ cls: "mf-in-bottom" });
    
    const eb = bottomArea.createDiv({ cls: "mf-eb" });
    eb.createDiv({ cls: "mf-eb-lbl", text: "\u9009\u62E9\u60C5\u7EEA" });
    const btns = eb.createDiv({ cls: "mf-eb-btns" });
    
    // 内置6个情绪（不包括neutral）
    const builtInKeys = ["happy", "sad", "angry", "anxious", "calm"];
    // 自定义情绪
    const customKeys = Object.keys(this.plugin.settings.customEmotions || {});
    // 获取保存的顺序，如果没有则使用默认顺序
    let orderedKeys;
    const savedOrder = this.plugin.settings.emotionOrder;
    if (savedOrder && Array.isArray(savedOrder)) {
      // 过滤掉已删除的情绪，并添加新情绪
      const existingKeys = [...builtInKeys, ...customKeys];
      orderedKeys = savedOrder.filter(k => existingKeys.includes(k));
      // 添加新增的情绪（不在保存顺序中的）
      existingKeys.forEach(k => {
        if (!orderedKeys.includes(k)) orderedKeys.push(k);
      });
    } else {
      orderedKeys = [...builtInKeys, ...customKeys];
    }
    
    // 前5个显示 + 第6个位置留给"更多"或"添加"
    const visibleCount = 5;
    const hasMore = orderedKeys.length > visibleCount;
    
    // 拖拽相关状态
    let isDragging = false;
    let draggedEl = null;
    let draggedKey = null;
    let ghostEl = null;
    let startX = 0, startY = 0;
    let offsetX = 0, offsetY = 0;
    let hasMoved = false;
    let longPressTimer = null;
    const LONG_PRESS_DELAY = 300;
    const DRAG_THRESHOLD = 8;
    
    // 创建幽灵元素
    const createGhost = (sourceEl, color, name) => {
      const ghost = document.createElement('div');
      ghost.className = 'mf-drag-ghost';
      ghost.innerHTML = sourceEl.innerHTML;
      ghost.style.setProperty('--ec', color);
      document.body.appendChild(ghost);
      return ghost;
    };
    
    // 更新幽灵元素位置
    const updateGhostPosition = (x, y) => {
      if (ghostEl) {
        ghostEl.style.left = x - offsetX + 'px';
        ghostEl.style.top = y - offsetY + 'px';
      }
    };
    
    // 查找目标按钮
    const findTargetBtn = (x, y) => {
      const elements = document.elementsFromPoint(x, y);
      for (const el of elements) {
        const btn = el.closest('.mf-eb-btn[data-e]');
        if (btn && btn !== draggedEl && btn.getAttribute('data-e')) {
          return btn;
        }
      }
      return null;
    };
    
    // 清理拖拽状态
    const cleanupDrag = () => {
      if (ghostEl) {
        ghostEl.remove();
        ghostEl = null;
      }
      if (draggedEl) {
        draggedEl.classList.remove('dragging');
      }
      document.querySelectorAll('.mf-eb-btn').forEach(el => el.classList.remove('drag-over'));
      isDragging = false;
      draggedEl = null;
      draggedKey = null;
      clearTimeout(longPressTimer);
    };
    
    // 执行排序
    const performReorder = async (targetKey) => {
      if (!draggedKey || draggedKey === targetKey) return;
      
      const fromIdx = orderedKeys.indexOf(draggedKey);
      const toIdx = orderedKeys.indexOf(targetKey);
      
      if (fromIdx !== -1 && toIdx !== -1) {
        orderedKeys.splice(fromIdx, 1);
        orderedKeys.splice(toIdx, 0, draggedKey);
        this.plugin.settings.emotionOrder = [...orderedKeys];
        await this.plugin.saveSettings();
        cleanupDrag();
        this.render();
      }
    };
    
    // 创建情绪按钮的辅助函数
    const createEmotionBtn = (k, container, isExpanded = false) => {
      const v = allEmotions[k];
      if (!v) return null;
      const b = container.createDiv({ cls: `mf-eb-btn ${this.emotion === k ? "on" : ""}`, attr: { "data-e": k } });
      b.style.setProperty("--ec", v.color);
      const iconSvg = emotionIcons[v.icon] || emotionIcons.neutral;
      b.innerHTML = `<span class="mf-eb-icon" style="color:${v.color}">${iconSvg}</span><span class="mf-eb-nm">${v.name}</span>`;
      
      // 鼠标/触摸开始
      const handleStart = (clientX, clientY, e) => {
        startX = clientX;
        startY = clientY;
        hasMoved = false;
        
        // 计算偏移量
        const rect = b.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        
        // 长按触发拖拽
        longPressTimer = setTimeout(() => {
          isDragging = true;
          draggedEl = b;
          draggedKey = k;
          b.classList.add('dragging');
          ghostEl = createGhost(b, v.color, v.name);
          updateGhostPosition(clientX, clientY);
        }, LONG_PRESS_DELAY);
      };
      
      // 鼠标/触摸移动
      const handleMove = (clientX, clientY, e) => {
        const dx = Math.abs(clientX - startX);
        const dy = Math.abs(clientY - startY);
        
        // 如果移动超过阈值，取消长按
        if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
          hasMoved = true;
          if (!isDragging) {
            clearTimeout(longPressTimer);
          }
        }
        
        if (isDragging && ghostEl) {
          e.preventDefault();
          updateGhostPosition(clientX, clientY);
          
          // 查找目标按钮并高亮
          document.querySelectorAll('.mf-eb-btn').forEach(el => el.classList.remove('drag-over'));
          const targetBtn = findTargetBtn(clientX, clientY);
          if (targetBtn) {
            targetBtn.classList.add('drag-over');
          }
        }
      };
      
      // 鼠标/触摸结束
      const handleEnd = async (clientX, clientY) => {
        clearTimeout(longPressTimer);
        
        if (isDragging) {
          const targetBtn = findTargetBtn(clientX, clientY);
          if (targetBtn) {
            const targetKey = targetBtn.getAttribute('data-e');
            await performReorder(targetKey);
          } else {
            cleanupDrag();
          }
        } else if (!hasMoved) {
          // 点击选择
          this.emotion = k;
          this.pickGentleWord();
          this.updateInputUI();
        }
        
        if (!isDragging) {
          cleanupDrag();
        }
      };
      
      // 鼠标事件
      b.onmousedown = (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        handleStart(e.clientX, e.clientY, e);
        
        const onMouseMove = (e) => handleMove(e.clientX, e.clientY, e);
        const onMouseUp = (e) => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          handleEnd(e.clientX, e.clientY);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };
      
      // 触摸事件
      b.ontouchstart = (e) => {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY, e);
      };
      
      b.ontouchmove = (e) => {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY, e);
      };
      
      b.ontouchend = (e) => {
        const touch = e.changedTouches[0];
        handleEnd(touch.clientX, touch.clientY);
      };
      
      b.ontouchcancel = () => {
        cleanupDrag();
      };
      
      return b;
    };
    
    // 显示前5个情绪
    orderedKeys.slice(0, visibleCount).forEach((k) => {
      createEmotionBtn(k, btns);
    });
    
    // 如果有更多情绪，显示"更多"按钮
    if (hasMore) {
      const moreBtn = btns.createDiv({ cls: "mf-eb-btn mf-eb-more" });
      moreBtn.innerHTML = `<span class="mf-eb-icon"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="16" r="2"/><circle cx="16" cy="16" r="2"/><circle cx="24" cy="16" r="2"/></svg></span><span class="mf-eb-nm">\u66F4\u591A</span>`;
      
      // 折叠区域
      const expandArea = eb.createDiv({ cls: "mf-eb-expand" });
      const expandBtns = expandArea.createDiv({ cls: "mf-eb-btns" });
      
      // 显示剩余的情绪
      orderedKeys.slice(visibleCount).forEach((k) => {
        createEmotionBtn(k, expandBtns, true);
      });
      
      // 添加自定义情绪按钮（在折叠区域内）
      const addBtn = expandBtns.createDiv({ cls: "mf-eb-btn mf-eb-add" });
      addBtn.innerHTML = `<span class="mf-eb-icon"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M16 10v12M10 16h12"/><circle cx="16" cy="16" r="12"/></svg></span><span class="mf-eb-nm">\u6DFB\u52A0</span>`;
      addBtn.onclick = () => {
        new CustomEmotionModal(this.app, this.plugin, null, null, () => this.render()).open();
      };
      
      // 切换展开/收起
      moreBtn.onclick = () => {
        const isExpanded = expandArea.classList.contains("open");
        expandArea.classList.toggle("open");
        moreBtn.classList.toggle("on");
        moreBtn.querySelector(".mf-eb-nm").textContent = isExpanded ? "\u66F4\u591A" : "\u6536\u8D77";
      };
    } else {
      // 没有更多情绪时，直接显示添加按钮
      const addBtn = btns.createDiv({ cls: "mf-eb-btn mf-eb-add" });
      addBtn.innerHTML = `<span class="mf-eb-icon"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M16 10v12M10 16h12"/><circle cx="16" cy="16" r="12"/></svg></span><span class="mf-eb-nm">\u6DFB\u52A0</span>`;
      addBtn.onclick = () => {
        new CustomEmotionModal(this.app, this.plugin, null, null, () => this.render()).open();
      };
    }
    
    const ir = bottomArea.createDiv({ cls: "mf-int-row" });
    ir.createSpan({ text: "强度" });
    for (let n = 1; n <= 10; n++) {
      const d = ir.createEl("button", { text: String(n), cls: n === mfClampInt(this.intensity, 1, 10, 5) ? "on" : "", attr: { type: "button", "aria-label": "强度 " + n } });
      d.onclick = () => { this.intensity = n; ir.querySelectorAll("button").forEach((x, i) => x.classList.toggle("on", i + 1 === n)); };
    }
    const ib = bottomArea.createDiv({ cls: "mf-ib" });
    ib.style.setProperty("--bc", c.color);
    const ta = ib.createEl("textarea", { placeholder: "\u5199\u4E0B\u4F60\u7684\u611F\u53D7...", cls: "mf-ta" });
    ta.value = this.text;
    let t;
    ta.addEventListener("input", (e) => {
      this.text = e.target.value;
      clearTimeout(t);
      t = setTimeout(() => {
        const ne = this.plugin.detectEmotion(this.text);
        // 只有检测到匹配的情绪才切换，否则保持当前选择
        if (ne && ne !== this.emotion) {
          this.emotion = ne;
          this.pickGentleWord();
          this.updateInputUI();
        }
      }, 100);
      this.updateSaveBtn();
    });
    setTimeout(() => ta.focus(), 100);
    const sb = ib.createDiv({ cls: "mf-sb" });
    sb.style.background = c.gradient;
    sb.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    sb.onclick = async () => {
      if (!this.text.trim())
        return;
      sb.classList.add("saving");

      // 直接保存到配置的位置
      const entry = {
        id: Date.now(),
        text: this.text.trim(),
        emotion: this.emotion,
        intensity: mfClampInt(this.intensity, 1, 10, 5),
        timestamp: new Date().toISOString()
      };
      this.intensity = 5;

      if (this.plugin.settings.customSaveFile) {
        // 保存到自定义文件
        const file = this.app.vault.getAbstractFileByPath(this.plugin.settings.customSaveFile);
        if (file instanceof import_obsidian.TFile) {
          await this.plugin.saveEntryToFile(entry, file, this.plugin.settings.customSaveHeading);
        }
      } else {
        // 使用默认保存模式
        await this.plugin.saveEntry(entry);
      }

      this.entries = await this.plugin.getEntries();

      // 检查是否是负面情绪
      const negativeEmotions = ['sad', 'angry', 'anxious'];
      if (negativeEmotions.includes(this.emotion)) {
        // 弹出圣多纳释放询问
        this.showSedonaPrompt();
      } else {
        // 正面情绪，直接返回主界面
        this.text = "";
        this.emotion = "happy";
        this.state = "orb";
        this.render();
      }
    };
    if (this.text.trim())
      sb.classList.add("vis");
  }
  updateInputUI() {
    const allEmotions = this.plugin.getAllEmotions();
    const c = allEmotions[this.emotion] || emotions.neutral;
    const mo = this.contentEl.querySelector(".mf-mo");
    const mg = this.contentEl.querySelector(".mf-mo-glow");
    const ib = this.contentEl.querySelector(".mf-ib");
    const sb = this.contentEl.querySelector(".mf-sb");
    const gw = this.contentEl.querySelector(".mf-gw");
    if (mo) {
      mo.style.background = c.gradient;
      mo.style.boxShadow = `0 0 40px ${c.glow},0 0 80px ${c.color}40`;
    }
    if (mg)
      mg.style.background = `radial-gradient(circle,${c.glow} 0%,transparent 70%)`;
    if (ib)
      ib.style.setProperty("--bc", c.color);
    if (sb)
      sb.style.background = c.gradient;
    if (gw) {
      gw.textContent = this.gentleWord;
      gw.style.color = `${c.color}99`;
    }
    this.contentEl.querySelectorAll(".mf-eb-btn").forEach((b) => b.classList.toggle("on", b.getAttribute("data-e") === this.emotion));
  }
  updateSaveBtn() {
    var _a;
    (_a = this.contentEl.querySelector(".mf-sb")) == null ? void 0 : _a.classList.toggle("vis", !!this.text.trim());
  }
  showSedonaPrompt() {
    const allEmotions = this.plugin.getAllEmotions();
    const emotionInfo = allEmotions[this.emotion] || emotions.neutral;

    // 创建询问对话框
    const overlay = this.contentEl.createDiv({ cls: "sedona-prompt-overlay" });
    const dialog = overlay.createDiv({ cls: "sedona-prompt-dialog" });

    dialog.createEl("h3", { text: "情绪释放", cls: "sedona-prompt-title" });
    dialog.createEl("p", {
      text: `我注意到你现在感到${emotionInfo.name}，要不要试试圣多纳释放法，帮助你释放这个情绪？`,
      cls: "sedona-prompt-text"
    });

    const btnGroup = dialog.createDiv({ cls: "sedona-prompt-buttons" });

    const yesBtn = btnGroup.createEl("button", { text: "好的，试试看", cls: "sedona-btn sedona-btn-yes" });
    yesBtn.onclick = () => {
      overlay.remove();
      this.startSedonaRelease();
    };

    const noBtn = btnGroup.createEl("button", { text: "不用了", cls: "sedona-btn sedona-btn-no" });
    noBtn.onclick = () => {
      overlay.remove();
      this.text = "";
      this.emotion = "happy";
      this.state = "orb";
      this.render();
    };
  }
  startSedonaRelease() {
    const allEmotions = this.plugin.getAllEmotions();
    const emotionInfo = allEmotions[this.emotion] || emotions.neutral;

    // 圣多纳释放的步骤
    const steps = [
      {
        question: `你现在能感受到这个${emotionInfo.name}的情绪吗？`,
        subtitle: "第一步：识别情绪",
        options: ["是的，我能感受到", "让我再感受一下"]
      },
      {
        question: `你能允许这个${emotionInfo.name}的感受存在吗？`,
        subtitle: "第二步：接纳情绪",
        options: ["是的，我允许", "我试着接纳"]
      },
      {
        question: `你愿意释放这个${emotionInfo.name}的感受吗？`,
        subtitle: "第三步：释放意愿",
        options: ["是的，我愿意", "我想试试"]
      },
      {
        question: `你愿意现在就释放它吗？`,
        subtitle: "第四步：释放时机",
        options: ["是的，现在释放", "让我准备一下"]
      }
    ];

    let currentStep = 0;

    const showStep = () => {
      const { contentEl } = this;
      contentEl.empty();

      const container = contentEl.createDiv({ cls: "sedona-release-container" });

      // 进度指示器
      const progress = container.createDiv({ cls: "sedona-progress" });
      for (let i = 0; i < steps.length; i++) {
        const dot = progress.createDiv({ cls: `sedona-progress-dot ${i <= currentStep ? 'active' : ''}` });
      }

      // 步骤内容
      const step = steps[currentStep];
      const content = container.createDiv({ cls: "sedona-content" });

      content.createEl("div", { text: step.subtitle, cls: "sedona-subtitle" });
      content.createEl("h2", { text: step.question, cls: "sedona-question" });

      // 呼吸提示
      const breathHint = content.createDiv({ cls: "sedona-breath-hint" });
      breathHint.innerHTML = `<div class="breath-circle"></div><p>深呼吸，感受当下</p>`;

      // 选项按钮
      const options = content.createDiv({ cls: "sedona-options" });

      step.options.forEach((optionText) => {
        const btn = options.createEl("button", { text: optionText, cls: "sedona-option-btn" });
        btn.onclick = () => {
          if (currentStep < steps.length - 1) {
            currentStep++;
            showStep();
          } else {
            // 完成释放
            showCompletion();
          }
        };
      });

      // 退出按钮
      const exitBtn = container.createEl("button", { text: "退出", cls: "sedona-exit-btn" });
      exitBtn.onclick = () => {
        this.text = "";
        this.emotion = "happy";
        this.state = "orb";
        this.render();
      };
    };

    const showCompletion = () => {
      const { contentEl } = this;
      contentEl.empty();

      const container = contentEl.createDiv({ cls: "sedona-completion-container" });

      container.innerHTML = `
        <div class="sedona-completion-icon">✨</div>
        <h2 class="sedona-completion-title">释放完成</h2>
        <p class="sedona-completion-text">很好！你已经完成了情绪释放。</p>
        <p class="sedona-completion-text">现在感受一下，你的情绪有什么变化吗？</p>
      `;

      const btnGroup = container.createDiv({ cls: "sedona-completion-buttons" });

      const againBtn = btnGroup.createEl("button", { text: "再释放一次", cls: "sedona-btn sedona-btn-again" });
      againBtn.onclick = () => {
        currentStep = 0;
        showStep();
      };

      const doneBtn = btnGroup.createEl("button", { text: "完成", cls: "sedona-btn sedona-btn-done" });
      doneBtn.onclick = () => {
        this.text = "";
        this.emotion = "happy";
        this.state = "orb";
        this.render();
      };
    };

    showStep();
  }
  renderHistory(el) {
    const allEmotions = this.plugin.getAllEmotions();
    const wrap = el.createDiv({ cls: "mf-pg mf-history-page" });
    wrap.createDiv({ cls: "mf-pg-bg" });
    const hd = wrap.createDiv({ cls: "mf-hd" });
    hd.createDiv({ cls: "mf-hd-t", text: "\u5FC3\u60C5\u8BB0\u5F55" });
    
    // 头部按钮组
    const hdBtns = hd.createDiv({ cls: "mf-hd-btns" });
    
    // 筛选按钮
    const filterBtn = hdBtns.createDiv({ cls: `mf-filter-btn ${this.showFilters ? "active" : ""}` });
    filterBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`;
    filterBtn.title = "筛选";
    filterBtn.onclick = () => {
      this.showFilters = !this.showFilters;
      this.render();
    };
    
    // 分享按钮
    if (this.entries.length) {
      const shareBtn = hdBtns.createDiv({ cls: "mf-share-today-btn" });
      shareBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg><span>分享</span>`;
      shareBtn.onclick = () => this.openShareModal();
    }
    
    const sc = wrap.createDiv({ cls: "mf-sc" });
    
    // 初始化筛选状态
    if (this.filterState === undefined) {
      this.filterState = {
        searchText: "",
        dateRange: "all", // all, today, week, month, custom
        customDateStart: null,
        customDateEnd: null,
        emotions: [], // 选中的情绪类型，空表示全部
        intensity: "all" // all, positive, negative, neutral
      };
    }
    
    // 筛选面板
    if (this.showFilters) {
      const filterPanel = sc.createDiv({ cls: "mf-filter-panel" });
      
      // 搜索框
      const searchRow = filterPanel.createDiv({ cls: "mf-filter-row" });
      searchRow.createDiv({ cls: "mf-filter-label", text: "🔍 搜索内容" });
      const searchInput = searchRow.createEl("input", { 
        cls: "mf-search-input", 
        type: "text",
        placeholder: "输入关键词搜索..." 
      });
      searchInput.value = this.filterState.searchText;
      searchInput.oninput = (e) => {
        this.filterState.searchText = e.target.value;
        this.renderFilteredEntries(sc, allEmotions);
      };
      
      // 日期范围
      const dateRow = filterPanel.createDiv({ cls: "mf-filter-row" });
      dateRow.createDiv({ cls: "mf-filter-label", text: "📅 日期范围" });
      const dateGrid = dateRow.createDiv({ cls: "mf-date-grid" });
      
      const dateOptions = [
        { id: "all", label: "全部" },
        { id: "today", label: "今天" },
        { id: "week", label: "本周" },
        { id: "month", label: "本月" },
        { id: "custom", label: "自定义" }
      ];
      
      dateOptions.forEach(opt => {
        const btn = dateGrid.createDiv({ cls: `mf-date-btn ${this.filterState.dateRange === opt.id ? "active" : ""}` });
        btn.textContent = opt.label;
        btn.onclick = () => {
          this.filterState.dateRange = opt.id;
          this.render();
        };
      });
      
      // 自定义日期选择器
      if (this.filterState.dateRange === "custom") {
        const customDateRow = filterPanel.createDiv({ cls: "mf-filter-row mf-custom-date-row" });
        const startInput = customDateRow.createEl("input", { type: "date", cls: "mf-date-input" });
        startInput.value = this.filterState.customDateStart || "";
        startInput.onchange = (e) => {
          this.filterState.customDateStart = e.target.value;
          this.renderFilteredEntries(sc, allEmotions);
        };
        customDateRow.createSpan({ text: "至" });
        const endInput = customDateRow.createEl("input", { type: "date", cls: "mf-date-input" });
        endInput.value = this.filterState.customDateEnd || "";
        endInput.onchange = (e) => {
          this.filterState.customDateEnd = e.target.value;
          this.renderFilteredEntries(sc, allEmotions);
        };
      }
      
      // 情绪类型筛选
      const emotionRow = filterPanel.createDiv({ cls: "mf-filter-row" });
      emotionRow.createDiv({ cls: "mf-filter-label", text: "😊 情绪类型" });
      const emotionGrid = emotionRow.createDiv({ cls: "mf-emotion-filter-grid" });
      
      // 全部按钮
      const allEmotionBtn = emotionGrid.createDiv({ cls: `mf-emotion-filter-btn ${this.filterState.emotions.length === 0 ? "active" : ""}` });
      allEmotionBtn.textContent = "全部";
      allEmotionBtn.onclick = () => {
        this.filterState.emotions = [];
        this.render();
      };
      
      // 各情绪按钮
      Object.entries(allEmotions).forEach(([key, info]) => {
        const btn = emotionGrid.createDiv({ cls: `mf-emotion-filter-btn ${this.filterState.emotions.includes(key) ? "active" : ""}` });
        btn.innerHTML = `<span style="color:${info.color}">${info.emoji || "😊"}</span>`;
        btn.title = info.name;
        btn.onclick = () => {
          const idx = this.filterState.emotions.indexOf(key);
          if (idx === -1) {
            this.filterState.emotions.push(key);
          } else {
            this.filterState.emotions.splice(idx, 1);
          }
          this.render();
        };
      });
      
      // 情绪强度筛选
      const intensityRow = filterPanel.createDiv({ cls: "mf-filter-row" });
      intensityRow.createDiv({ cls: "mf-filter-label", text: "💪 情绪强度" });
      const intensityGrid = intensityRow.createDiv({ cls: "mf-intensity-grid" });
      
      const intensityOptions = [
        { id: "all", label: "全部", icon: "🔄" },
        { id: "positive", label: "正面", icon: "😊", desc: "开心、平静、感恩..." },
        { id: "negative", label: "负面", icon: "😢", desc: "悲伤、焦虑、愤怒..." },
        { id: "neutral", label: "中性", icon: "😐", desc: "平常、无聊..." }
      ];
      
      intensityOptions.forEach(opt => {
        const btn = intensityGrid.createDiv({ cls: `mf-intensity-btn ${this.filterState.intensity === opt.id ? "active" : ""}` });
        btn.innerHTML = `<span class="mf-intensity-icon">${opt.icon}</span><span>${opt.label}</span>`;
        btn.title = opt.desc || "";
        btn.onclick = () => {
          this.filterState.intensity = opt.id;
          this.render();
        };
      });
      
      // 清除筛选按钮
      const clearRow = filterPanel.createDiv({ cls: "mf-filter-row mf-filter-clear-row" });
      const clearBtn = clearRow.createDiv({ cls: "mf-clear-filter-btn" });
      clearBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg><span>清除所有筛选</span>`;
      clearBtn.onclick = () => {
        this.filterState = {
          searchText: "",
          dateRange: "all",
          customDateStart: null,
          customDateEnd: null,
          emotions: [],
          intensity: "all"
        };
        this.render();
      };
      
      // 显示筛选结果统计
      const filteredCount = this.getFilteredEntries(allEmotions).length;
      const statsDiv = clearRow.createDiv({ cls: "mf-filter-stats" });
      statsDiv.textContent = `找到 ${filteredCount} 条记录`;
    }
    
    // 渲染筛选后的记录列表
    this.renderFilteredEntries(sc, allEmotions);
  }
  
  // 获取筛选后的记录
  getFilteredEntries(allEmotions) {
    if (!this.entries.length) return [];
    
    const positiveEmotions = ["happy", "calm", "excited", "love", "grateful", "hopeful", "peaceful", "inspired"];
    const negativeEmotions = ["sad", "angry", "anxious", "stressed", "lonely", "tired"];
    const neutralEmotions = ["neutral", "bored", "confused"];
    
    return this.entries.filter(e => {
      // 日期范围筛选
      const entryDate = (0, import_obsidian.moment)(e.timestamp);
      const now = (0, import_obsidian.moment)();
      
      if (this.filterState.dateRange === "today") {
        if (!entryDate.isSame(now, "day")) return false;
      } else if (this.filterState.dateRange === "week") {
        if (!entryDate.isSame(now, "week")) return false;
      } else if (this.filterState.dateRange === "month") {
        if (!entryDate.isSame(now, "month")) return false;
      } else if (this.filterState.dateRange === "custom") {
        if (this.filterState.customDateStart) {
          if (entryDate.isBefore(this.filterState.customDateStart, "day")) return false;
        }
        if (this.filterState.customDateEnd) {
          if (entryDate.isAfter(this.filterState.customDateEnd, "day")) return false;
        }
      }
      
      // 情绪类型筛选
      if (this.filterState.emotions.length > 0) {
        if (!this.filterState.emotions.includes(e.emotion)) return false;
      }
      
      // 情绪强度筛选
      if (this.filterState.intensity !== "all") {
        if (this.filterState.intensity === "positive" && !positiveEmotions.includes(e.emotion)) return false;
        if (this.filterState.intensity === "negative" && !negativeEmotions.includes(e.emotion)) return false;
        if (this.filterState.intensity === "neutral" && !neutralEmotions.includes(e.emotion)) return false;
      }
      
      // 全文搜索
      if (this.filterState.searchText.trim()) {
        const searchLower = this.filterState.searchText.toLowerCase();
        const textMatch = e.text && e.text.toLowerCase().includes(searchLower);
        const emotionInfo = allEmotions[e.emotion];
        const emotionMatch = emotionInfo && emotionInfo.name.toLowerCase().includes(searchLower);
        if (!textMatch && !emotionMatch) return false;
      }
      
      return true;
    });
  }
  
  // 渲染筛选后的记录列表
  renderFilteredEntries(sc, allEmotions) {
    // 移除旧的记录列表（保留筛选面板）
    const oldList = sc.querySelector(".mf-entries-list");
    if (oldList) oldList.remove();
    
    const entriesList = sc.createDiv({ cls: "mf-entries-list" });
    const filteredEntries = this.getFilteredEntries(allEmotions);
    
    if (!this.entries.length) {
      entriesList.innerHTML = `<div class="mf-ey"><div class="mf-ey-o"></div><div class="mf-ey-t">\u8FD8\u6CA1\u6709\u8BB0\u5F55</div><div class="mf-ey-h">\u8F7B\u89E6\u7403\u4F53\uFF0C\u5F00\u59CB\u8BB0\u5F55\u5FC3\u60C5</div></div>`;
      return;
    }
    
    if (!filteredEntries.length) {
      entriesList.innerHTML = `<div class="mf-ey"><div class="mf-ey-o"></div><div class="mf-ey-t">没有找到匹配的记录</div><div class="mf-ey-h">试试调整筛选条件</div></div>`;
      return;
    }
    
    // 今日摘要（仅在无筛选时显示）
    const hasFilters = this.filterState.searchText || 
                       this.filterState.dateRange !== "all" || 
                       this.filterState.emotions.length > 0 || 
                       this.filterState.intensity !== "all";
    
    if (!hasFilters) {
      const today = (0, import_obsidian.moment)().format("YYYY-MM-DD");
      const todayE = filteredEntries.filter((e) => (0, import_obsidian.moment)(e.timestamp).format("YYYY-MM-DD") === today);
      if (todayE.length) {
        const ts = entriesList.createDiv({ cls: "mf-ts" });
        ts.createDiv({ cls: "mf-ts-l", text: "\u4ECA\u5929" });
        const tm = ts.createDiv({ cls: "mf-ts-m" });
        todayE.forEach((e) => {
          const info = allEmotions[e.emotion] || emotions.neutral;
          const iconSvg = emotionIcons[info.icon] || emotionIcons.neutral;
          const it = tm.createDiv({ cls: "mf-ts-i" });
          it.style.setProperty("--tc", info.color);
          it.innerHTML = `<span class="mf-ts-icon" style="color:${info.color}">${iconSvg}</span><span class="mf-ts-t">${(0, import_obsidian.moment)(e.timestamp).format("HH:mm")}</span>`;
        });
      }
    }
    
    // 按日期分组
    const grouped = /* @__PURE__ */ new Map();
    filteredEntries.forEach((e) => {
      const d = (0, import_obsidian.moment)(e.timestamp).format("MM\u6708DD\u65E5 dddd");
      if (!grouped.has(d))
        grouped.set(d, []);
      grouped.get(d).push(e);
    });
    
    grouped.forEach((items, date) => {
      const ds = entriesList.createDiv({ cls: "mf-ds" });
      ds.createDiv({ cls: "mf-ds-d", text: date });
      items.forEach((e) => {
        const info = allEmotions[e.emotion] || emotions.neutral;
        const iconSvg = emotionIcons[info.icon] || emotionIcons.neutral;
        const cd = ds.createDiv({ cls: "mf-cd" });
        cd.style.setProperty("--cc", info.color);
        
        // 高亮搜索词
        let displayText = e.text;
        if (this.filterState.searchText.trim()) {
          const regex = new RegExp(`(${this.filterState.searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          displayText = displayText.replace(regex, '<mark class="mf-highlight">$1</mark>');
        }
        
        cd.innerHTML = `
          <div class="mf-cd-icon" style="color:${info.color}">${iconSvg}</div>
          <div class="mf-cd-b">
            <div class="mf-cd-tp">
              <span class="mf-cd-n">${info.name}</span>
              <span class="mf-cd-tm">${(0, import_obsidian.moment)(e.timestamp).format("HH:mm")}</span>
            </div>
            <div class="mf-cd-tx">${displayText}</div>
          </div>
          <div class="mf-cd-share" title="分享这条记录">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </div>
        `;
        // 为单条记录添加分享点击事件
        cd.querySelector(".mf-cd-share").onclick = (evt) => {
          evt.stopPropagation();
          this.openShareModal(e);
        };
      });
    });
  }
  
  // 打开分享弹窗
  openShareModal(singleEntry = null) {
    new ShareCardModal(this.app, this.plugin, this.entries, singleEntry, this.theme).open();
  }
  renderStats(el) {
    const allEmotions = this.plugin.getAllEmotions();
    const wrap = el.createDiv({ cls: "mf-pg mf-stats-page" });
    wrap.createDiv({ cls: "mf-pg-bg" });
    const hd = wrap.createDiv({ cls: "mf-hd" });
    hd.createDiv({ cls: "mf-hd-t", text: "\u5FC3\u60C5\u7EDF\u8BA1" });
    
    // 时间范围选择器
    if (!this.statsRange) this.statsRange = "week";
    const rangeSel = hd.createDiv({ cls: "mf-range-sel" });
    ["week", "month", "all"].forEach(r => {
      const btn = rangeSel.createDiv({ cls: `mf-range-btn ${this.statsRange === r ? "active" : ""}` });
      btn.textContent = r === "week" ? "本周" : r === "month" ? "本月" : "全部";
      btn.onclick = () => {
        this.statsRange = r;
        this.render();
      };
    });
    
    const sc = wrap.createDiv({ cls: "mf-sc" });
    
    if (!this.entries.length) {
      sc.innerHTML = `<div class="mf-ey"><div class="mf-ey-o"></div><div class="mf-ey-t">\u6682\u65E0\u6570\u636E</div><div class="mf-ey-h">\u8BB0\u5F55\u66F4\u591A\u5FC3\u60C5\u540E\u67E5\u770B\u7EDF\u8BA1</div></div>`;
      return;
    }
    
    // 根据时间范围筛选数据
    const now = (0, import_obsidian.moment)();
    let filteredEntries = this.entries;
    let rangeLabel = "全部时间";
    
    if (this.statsRange === "week") {
      const weekStart = now.clone().startOf("week");
      filteredEntries = this.entries.filter(e => (0, import_obsidian.moment)(e.timestamp).isSameOrAfter(weekStart));
      rangeLabel = "本周";
    } else if (this.statsRange === "month") {
      const monthStart = now.clone().startOf("month");
      filteredEntries = this.entries.filter(e => (0, import_obsidian.moment)(e.timestamp).isSameOrAfter(monthStart));
      rangeLabel = "本月";
    }
    
    if (!filteredEntries.length) {
      sc.innerHTML = `<div class="mf-ey"><div class="mf-ey-o"></div><div class="mf-ey-t">${rangeLabel}暂无记录</div><div class="mf-ey-h">试试查看其他时间范围</div></div>`;
      return;
    }
    
    // 基础统计数据
    const counts = {};
    filteredEntries.forEach((e) => counts[e.emotion] = (counts[e.emotion] || 0) + 1);
    const total = filteredEntries.length;
    const days = new Set(filteredEntries.map((e) => (0, import_obsidian.moment)(e.timestamp).format("YYYY-MM-DD"))).size;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const topInfo = allEmotions[top[0]] || emotions.neutral;
    const topIconSvg = emotionIcons[topInfo.icon] || emotionIcons.neutral;
    
    // 计算连续记录天数
    const streak = this.calculateStreak();
    
    // 计算情绪波动指数 (0-100)
    const volatility = this.calculateVolatility(filteredEntries, allEmotions);
    
    // 计算正面/负面情绪比例
    const positiveEmotions = ["happy", "calm", "excited", "love", "grateful", "hopeful", "peaceful", "inspired"];
    const negativeEmotions = ["sad", "angry", "anxious", "stressed", "lonely", "tired"];
    let positiveCount = 0, negativeCount = 0;
    filteredEntries.forEach(e => {
      if (positiveEmotions.includes(e.emotion)) positiveCount++;
      else if (negativeEmotions.includes(e.emotion)) negativeCount++;
    });
    const positiveRatio = total > 0 ? Math.round(positiveCount / total * 100) : 0;
    
    // 主要情绪卡片
    const mc = sc.createDiv({ cls: "mf-mc" });
    mc.style.setProperty("--mc", topInfo.color);
    mc.style.setProperty("--mg", topInfo.gradient);
    mc.innerHTML = `<div class="mf-mc-icon" style="color:${topInfo.color}">${topIconSvg}</div><div class="mf-mc-i"><div class="mf-mc-l">\u6700\u5E38\u89C1\u7684\u60C5\u7EEA</div><div class="mf-mc-n">${topInfo.name}</div><div class="mf-mc-p">${Math.round(top[1] / total * 100)}%</div></div>`;
    
    // 数字统计 - 增强版
    const nums = sc.createDiv({ cls: "mf-nums mf-nums-4" });
    nums.innerHTML = `
      <div class="mf-num"><div class="mf-num-v">${total}</div><div class="mf-num-l">总记录</div></div>
      <div class="mf-num"><div class="mf-num-v">${days}</div><div class="mf-num-l">天数</div></div>
      <div class="mf-num"><div class="mf-num-v">${streak}</div><div class="mf-num-l">🔥 连续</div></div>
      <div class="mf-num"><div class="mf-num-v">${(total / Math.max(days, 1)).toFixed(1)}</div><div class="mf-num-l">日均</div></div>
    `;
    
    // 情绪健康指标
    const health = sc.createDiv({ cls: "mf-health" });
    health.createDiv({ cls: "mf-st", text: "情绪健康指标" });
    const healthGrid = health.createDiv({ cls: "mf-health-grid" });
    
    // 正面情绪比例
    const positiveCard = healthGrid.createDiv({ cls: "mf-health-card" });
    positiveCard.innerHTML = `
      <div class="mf-health-ring" style="--progress:${positiveRatio};--color:#22c55e">
        <svg viewBox="0 0 36 36">
          <path class="mf-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          <path class="mf-ring-fill" stroke-dasharray="${positiveRatio}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
        </svg>
        <div class="mf-ring-text">${positiveRatio}%</div>
      </div>
      <div class="mf-health-label">正面情绪</div>
    `;
    
    // 情绪波动指数
    const volatilityCard = healthGrid.createDiv({ cls: "mf-health-card" });
    const volColor = volatility < 30 ? "#22c55e" : volatility < 60 ? "#f59e0b" : "#ef4444";
    const volLabel = volatility < 30 ? "稳定" : volatility < 60 ? "适中" : "波动";
    volatilityCard.innerHTML = `
      <div class="mf-health-ring" style="--progress:${volatility};--color:${volColor}">
        <svg viewBox="0 0 36 36">
          <path class="mf-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          <path class="mf-ring-fill" stroke-dasharray="${volatility}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
        </svg>
        <div class="mf-ring-text">${volLabel}</div>
      </div>
      <div class="mf-health-label">波动指数</div>
    `;
    
    // 情绪趋势图
    const trend = sc.createDiv({ cls: "mf-trend" });
    trend.createDiv({ cls: "mf-st", text: "情绪趋势" });
    this.renderTrendChart(trend, filteredEntries, allEmotions);
    
    // 时段分析
    const timeAnalysis = sc.createDiv({ cls: "mf-time-analysis" });
    timeAnalysis.createDiv({ cls: "mf-st", text: "时段分析" });
    this.renderTimeAnalysis(timeAnalysis, filteredEntries, allEmotions);
    
    // 情绪分布
    const dist = sc.createDiv({ cls: "mf-dist" });
    dist.createDiv({ cls: "mf-st", text: "\u60C5\u7EEA\u5206\u5E03" });
    Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([e, cnt]) => {
      const info = allEmotions[e] || emotions.neutral, pct = Math.round(cnt / total * 100);
      const iconSvg = emotionIcons[info.icon] || emotionIcons.neutral;
      const row = dist.createDiv({ cls: "mf-dr" });
      row.innerHTML = `<div class="mf-dr-i"><span class="mf-dr-icon" style="color:${info.color}">${iconSvg}</span><span>${info.name}</span></div><div class="mf-dr-bw"><div class="mf-dr-b" style="width:${pct}%;background:${info.gradient}"></div></div><div class="mf-dr-p">${pct}%</div>`;
    });
    
    // 最近7天柱状图
    const wk = sc.createDiv({ cls: "mf-wk" });
    wk.createDiv({ cls: "mf-st", text: "\u6700\u8FD1 7 \u5929" });
    const ch = wk.createDiv({ cls: "mf-ch" });
    const l7 = Array.from({ length: 7 }, (_, i) => (0, import_obsidian.moment)().subtract(6 - i, "days"));
    const mx = Math.max(...l7.map((d) => this.entries.filter((e) => (0, import_obsidian.moment)(e.timestamp).format("YYYY-MM-DD") === d.format("YYYY-MM-DD")).length), 1);
    l7.forEach((day) => {
      var _a;
      const de = this.entries.filter((e) => (0, import_obsidian.moment)(e.timestamp).format("YYYY-MM-DD") === day.format("YYYY-MM-DD"));
      const col = ch.createDiv({ cls: "mf-ch-c" });
      const bw = col.createDiv({ cls: "mf-ch-bw" });
      if (de.length) {
        const bar = bw.createDiv({ cls: "mf-ch-b" });
        bar.style.height = `${de.length / mx * 100}%`;
        bar.style.background = ((_a = allEmotions[de[de.length - 1].emotion]) == null ? void 0 : _a.gradient) || "#888";
      }
      col.createDiv({ cls: `mf-ch-l ${day.format("YYYY-MM-DD") === (0, import_obsidian.moment)().format("YYYY-MM-DD") ? "td" : ""}`, text: day.format("dd") });
    });
    
    // 热力图/日历视图
    const heatmap = sc.createDiv({ cls: "mf-heatmap" });
    heatmap.createDiv({ cls: "mf-st", text: "月度热力图" });
    this.renderHeatmap(heatmap, allEmotions);
    
    // 洞察与建议
    const insights = sc.createDiv({ cls: "mf-insights" });
    insights.createDiv({ cls: "mf-st", text: "💡 情绪洞察" });
    this.renderInsights(insights, filteredEntries, allEmotions, positiveRatio, volatility);
  }
  
  // 计算连续记录天数
  calculateStreak() {
    if (!this.entries.length) return 0;
    const dates = [...new Set(this.entries.map(e => (0, import_obsidian.moment)(e.timestamp).format("YYYY-MM-DD")))].sort().reverse();
    let streak = 0;
    let currentDate = (0, import_obsidian.moment)();
    
    // 检查今天是否有记录
    if (dates[0] !== currentDate.format("YYYY-MM-DD")) {
      // 如果今天没有记录，检查昨天
      currentDate = currentDate.subtract(1, "day");
      if (dates[0] !== currentDate.format("YYYY-MM-DD")) {
        return 0;
      }
    }
    
    for (const date of dates) {
      if (date === currentDate.format("YYYY-MM-DD")) {
        streak++;
        currentDate = currentDate.subtract(1, "day");
      } else {
        break;
      }
    }
    return streak;
  }
  
  // 计算情绪波动指数
  calculateVolatility(entries, allEmotions) {
    if (entries.length < 2) return 0;
    
    // 将情绪映射到数值 (正面=1, 中性=0, 负面=-1)
    const emotionValues = {
      happy: 1, calm: 0.8, excited: 1, love: 1, grateful: 1, hopeful: 0.8, peaceful: 0.8, inspired: 0.9,
      neutral: 0, bored: -0.2, confused: -0.3,
      sad: -0.8, angry: -0.9, anxious: -0.7, stressed: -0.8, lonely: -0.7, tired: -0.5
    };
    
    const values = entries.map(e => emotionValues[e.emotion] ?? 0);
    
    // 计算变化量
    let totalChange = 0;
    for (let i = 1; i < values.length; i++) {
      totalChange += Math.abs(values[i] - values[i-1]);
    }
    
    // 标准化到0-100
    const avgChange = totalChange / (values.length - 1);
    return Math.min(100, Math.round(avgChange * 50));
  }
  
  // 渲染情绪趋势图
  renderTrendChart(container, entries, allEmotions) {
    const chartWrap = container.createDiv({ cls: "mf-trend-chart" });
    
    // 按天聚合情绪分数
    const dailyScores = {};
    const emotionScores = {
      happy: 5, excited: 5, love: 5, grateful: 5, hopeful: 4, peaceful: 4, inspired: 4, calm: 4,
      neutral: 3, bored: 2, confused: 2,
      tired: 2, anxious: 2, sad: 1, stressed: 1, angry: 1, lonely: 1
    };
    
    entries.forEach(e => {
      const day = (0, import_obsidian.moment)(e.timestamp).format("MM-DD");
      if (!dailyScores[day]) dailyScores[day] = [];
      dailyScores[day].push(emotionScores[e.emotion] ?? 3);
    });
    
    // 获取最近14天的数据
    const days = [];
    for (let i = 13; i >= 0; i--) {
      days.push((0, import_obsidian.moment)().subtract(i, "days").format("MM-DD"));
    }
    
    const scores = days.map(d => {
      const dayScores = dailyScores[d];
      return dayScores ? dayScores.reduce((a,b) => a+b, 0) / dayScores.length : null;
    });
    
    // 创建SVG折线图
    const validScores = scores.filter(s => s !== null);
    if (validScores.length < 2) {
      chartWrap.innerHTML = `<div class="mf-trend-empty">需要更多数据来显示趋势</div>`;
      return;
    }
    
    const width = 340;
    const height = 120;
    const padding = { top: 20, right: 10, bottom: 25, left: 30 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    
    let pathD = "";
    let dots = "";
    const validPoints = [];
    
    scores.forEach((score, i) => {
      if (score !== null) {
        const x = padding.left + (i / (scores.length - 1)) * chartW;
        const y = padding.top + chartH - ((score - 1) / 4) * chartH;
        validPoints.push({ x, y, score, day: days[i] });
      }
    });
    
    validPoints.forEach((p, i) => {
      if (i === 0) pathD += `M ${p.x} ${p.y}`;
      else pathD += ` L ${p.x} ${p.y}`;
      
      const color = p.score >= 4 ? "#22c55e" : p.score >= 3 ? "#f59e0b" : "#ef4444";
      dots += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${color}" class="mf-trend-dot"/>`;
    });
    
    // Y轴刻度
    const yLabels = ["😢", "😐", "😊"];
    let yAxisLabels = "";
    yLabels.forEach((label, i) => {
      const y = padding.top + chartH - (i / 2) * chartH;
      yAxisLabels += `<text x="${padding.left - 8}" y="${y + 4}" class="mf-trend-ylabel">${label}</text>`;
    });
    
    // X轴刻度 (只显示部分)
    let xAxisLabels = "";
    [0, 6, 13].forEach(i => {
      const x = padding.left + (i / (scores.length - 1)) * chartW;
      xAxisLabels += `<text x="${x}" y="${height - 5}" class="mf-trend-xlabel">${days[i]}</text>`;
    });
    
    chartWrap.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="mf-trend-svg">
        <defs>
          <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:var(--theme-accent);stop-opacity:0.3"/>
            <stop offset="100%" style="stop-color:var(--theme-accent);stop-opacity:0"/>
          </linearGradient>
        </defs>
        <path d="${pathD} L ${validPoints[validPoints.length-1].x} ${padding.top + chartH} L ${validPoints[0].x} ${padding.top + chartH} Z" fill="url(#trendGradient)"/>
        <path d="${pathD}" fill="none" stroke="var(--theme-accent)" stroke-width="2" class="mf-trend-line"/>
        ${dots}
        ${yAxisLabels}
        ${xAxisLabels}
      </svg>
    `;
  }
  
  // 渲染时段分析
  renderTimeAnalysis(container, entries, allEmotions) {
    const timeSlots = {
      morning: { label: "早晨", range: "6-12点", entries: [], icon: "🌅" },
      afternoon: { label: "下午", range: "12-18点", entries: [], icon: "☀️" },
      evening: { label: "晚上", range: "18-24点", entries: [], icon: "🌙" },
      night: { label: "深夜", range: "0-6点", entries: [], icon: "🌃" }
    };
    
    entries.forEach(e => {
      const hour = (0, import_obsidian.moment)(e.timestamp).hour();
      if (hour >= 6 && hour < 12) timeSlots.morning.entries.push(e);
      else if (hour >= 12 && hour < 18) timeSlots.afternoon.entries.push(e);
      else if (hour >= 18 && hour < 24) timeSlots.evening.entries.push(e);
      else timeSlots.night.entries.push(e);
    });
    
    const grid = container.createDiv({ cls: "mf-time-grid" });
    
    const emotionScores = {
      happy: 5, excited: 5, love: 5, grateful: 5, hopeful: 4, peaceful: 4, inspired: 4, calm: 4,
      neutral: 3, bored: 2, confused: 2,
      tired: 2, anxious: 2, sad: 1, stressed: 1, angry: 1, lonely: 1
    };
    
    Object.entries(timeSlots).forEach(([key, slot]) => {
      const card = grid.createDiv({ cls: "mf-time-card" });
      const count = slot.entries.length;
      
      let avgScore = 0;
      let dominantEmotion = null;
      
      if (count > 0) {
        avgScore = slot.entries.reduce((sum, e) => sum + (emotionScores[e.emotion] ?? 3), 0) / count;
        const emotionCounts = {};
        slot.entries.forEach(e => emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1);
        dominantEmotion = Object.entries(emotionCounts).sort((a,b) => b[1] - a[1])[0][0];
      }
      
      const moodColor = avgScore >= 4 ? "#22c55e" : avgScore >= 3 ? "#f59e0b" : avgScore > 0 ? "#ef4444" : "rgba(var(--mf-ink),0.2)";
      const dominantInfo = dominantEmotion ? allEmotions[dominantEmotion] : null;
      
      card.innerHTML = `
        <div class="mf-time-icon">${slot.icon}</div>
        <div class="mf-time-label">${slot.label}</div>
        <div class="mf-time-range">${slot.range}</div>
        <div class="mf-time-mood" style="background:${moodColor}">${count > 0 ? (dominantInfo ? dominantInfo.name : "") : "无记录"}</div>
        <div class="mf-time-count">${count} 条</div>
      `;
    });
  }
  
  // 渲染热力图
  renderHeatmap(container, allEmotions) {
    const heatmapWrap = container.createDiv({ cls: "mf-heatmap-wrap" });
    
    const now = (0, import_obsidian.moment)();
    const startOfMonth = now.clone().startOf("month");
    const endOfMonth = now.clone().endOf("month");
    const daysInMonth = endOfMonth.date();
    
    // 创建日期到情绪的映射
    const dateEmotions = {};
    this.entries.forEach(e => {
      const date = (0, import_obsidian.moment)(e.timestamp).format("YYYY-MM-DD");
      if (!dateEmotions[date]) dateEmotions[date] = [];
      dateEmotions[date].push(e.emotion);
    });
    
    // 月份标题
    const monthTitle = heatmapWrap.createDiv({ cls: "mf-heatmap-title" });
    monthTitle.textContent = now.format("YYYY年MM月");
    
    // 星期标签
    const weekLabels = heatmapWrap.createDiv({ cls: "mf-heatmap-weeks" });
    ["日", "一", "二", "三", "四", "五", "六"].forEach(d => {
      weekLabels.createDiv({ cls: "mf-heatmap-week", text: d });
    });
    
    // 日历网格
    const grid = heatmapWrap.createDiv({ cls: "mf-heatmap-grid" });
    
    // 填充月初前的空白
    const firstDayOfWeek = startOfMonth.day();
    for (let i = 0; i < firstDayOfWeek; i++) {
      grid.createDiv({ cls: "mf-heatmap-day empty" });
    }
    
    // 填充每一天
    for (let day = 1; day <= daysInMonth; day++) {
      const date = startOfMonth.clone().date(day);
      const dateStr = date.format("YYYY-MM-DD");
      const dayEmotions = dateEmotions[dateStr] || [];
      
      const cell = grid.createDiv({ cls: "mf-heatmap-day" });
      cell.createDiv({ cls: "mf-heatmap-date", text: String(day) });
      
      if (dayEmotions.length > 0) {
        // 计算平均情绪分数决定颜色
        const emotionScores = {
          happy: 5, excited: 5, love: 5, grateful: 5, hopeful: 4, peaceful: 4, inspired: 4, calm: 4,
          neutral: 3, bored: 2, confused: 2,
          tired: 2, anxious: 2, sad: 1, stressed: 1, angry: 1, lonely: 1
        };
        const avgScore = dayEmotions.reduce((sum, e) => sum + (emotionScores[e] ?? 3), 0) / dayEmotions.length;
        
        let bgColor;
        if (avgScore >= 4.5) bgColor = "rgba(34, 197, 94, 0.8)";
        else if (avgScore >= 3.5) bgColor = "rgba(34, 197, 94, 0.5)";
        else if (avgScore >= 2.5) bgColor = "rgba(245, 158, 11, 0.5)";
        else if (avgScore >= 1.5) bgColor = "rgba(239, 68, 68, 0.5)";
        else bgColor = "rgba(239, 68, 68, 0.8)";
        
        cell.style.background = bgColor;
        cell.setAttribute("title", `${dayEmotions.length}条记录`);
      }
      
      if (dateStr === now.format("YYYY-MM-DD")) {
        cell.classList.add("today");
      }
    }
    
    // 图例
    const legend = heatmapWrap.createDiv({ cls: "mf-heatmap-legend" });
    legend.innerHTML = `
      <span>😢</span>
      <div class="mf-legend-bar"></div>
      <span>😊</span>
    `;
  }
  
  // 渲染情绪洞察
  renderInsights(container, entries, allEmotions, positiveRatio, volatility) {
    const insightsList = container.createDiv({ cls: "mf-insights-list" });
    const insights = [];
    
    // 基于正面情绪比例
    if (positiveRatio >= 70) {
      insights.push({ icon: "🌟", text: "你的情绪状态非常棒！继续保持积极的心态。" });
    } else if (positiveRatio >= 50) {
      insights.push({ icon: "💪", text: "情绪整体平衡，适当关注让自己开心的事情。" });
    } else if (positiveRatio >= 30) {
      insights.push({ icon: "🤗", text: "最近可能有些压力，记得给自己一些放松的时间。" });
    } else {
      insights.push({ icon: "💝", text: "看起来最近比较辛苦，试着和朋友聊聊或做些喜欢的事。" });
    }
    
    // 基于波动指数
    if (volatility < 30) {
      insights.push({ icon: "🧘", text: "情绪非常稳定，这是很好的心理状态。" });
    } else if (volatility >= 60) {
      insights.push({ icon: "🌊", text: "情绪波动较大，可以尝试冥想或深呼吸练习。" });
    }
    
    // 基于记录频率
    const streak = this.calculateStreak();
    if (streak >= 7) {
      insights.push({ icon: "🔥", text: `已连续${streak}天记录心情，坚持得很好！` });
    } else if (streak >= 3) {
      insights.push({ icon: "📝", text: `已连续${streak}天记录，继续保持这个好习惯！` });
    }
    
    // 时间段分析
    const hourCounts = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    entries.forEach(e => {
      const hour = (0, import_obsidian.moment)(e.timestamp).hour();
      if (hour >= 6 && hour < 12) hourCounts.morning++;
      else if (hour >= 12 && hour < 18) hourCounts.afternoon++;
      else if (hour >= 18 && hour < 24) hourCounts.evening++;
      else hourCounts.night++;
    });
    
    const maxTime = Object.entries(hourCounts).sort((a,b) => b[1] - a[1])[0];
    const timeLabels = { morning: "早晨", afternoon: "下午", evening: "晚上", night: "深夜" };
    if (maxTime[1] > 0) {
      insights.push({ icon: "⏰", text: `你最常在${timeLabels[maxTime[0]]}记录心情。` });
    }
    
    // 渲染洞察卡片
    insights.forEach(insight => {
      const card = insightsList.createDiv({ cls: "mf-insight-card" });
      card.innerHTML = `<span class="mf-insight-icon">${insight.icon}</span><span class="mf-insight-text">${insight.text}</span>`;
    });
  }
  renderSettings(el) {
    const wrap = el.createDiv({ cls: "mf-pg" });
    wrap.createDiv({ cls: "mf-pg-bg" });
    const hd = wrap.createDiv({ cls: "mf-hd" });
    hd.createDiv({ cls: "mf-hd-t", text: "\u4E3B\u9898\u8BBE\u7F6E" });
    const sc = wrap.createDiv({ cls: "mf-sc" });
    sc.createDiv({ cls: "mf-set-l mt mf-theme-l", text: "光球配色" });
    const tg = sc.createDiv({ cls: "mf-tg" });
    Object.entries(themes).forEach(([k, v]) => {
      const tb = tg.createDiv({ cls: `mf-tb ${this.plugin.settings.theme === k ? "on" : ""}` });
      tb.style.setProperty("--tb1", v.bg1);
      tb.style.setProperty("--tb2", v.bg2);
      tb.style.setProperty("--ta", v.accent);
      tb.innerHTML = `<div class="mf-tb-pre"><div class="mf-tb-orb"></div></div><div class="mf-tb-n">${v.name}</div>`;
      tb.onclick = async () => {
        this.plugin.settings.theme = k;
        await this.plugin.saveSettings();
        this.render();
      };
    });

    this.mfStylePicker(sc);
    // 自定义情绪管理部分
    sc.createDiv({ cls: "mf-set-l mt", text: "\u81EA\u5B9A\u4E49\u60C5\u7EEA" });
    
    const customEmotions = this.plugin.settings.customEmotions || {};
    const emotionList = sc.createDiv({ cls: "mf-custom-list" });
    
    // 显示已有的自定义情绪
    Object.entries(customEmotions).forEach(([key, emotion]) => {
      const item = emotionList.createDiv({ cls: "mf-custom-item" });
      item.style.setProperty("--ec", emotion.color);
      const iconSvg = emotionIcons[emotion.icon] || emotionIcons.neutral;
      item.innerHTML = `
        <div class="mf-custom-icon" style="color:${emotion.color}">${iconSvg}</div>
        <span class="mf-custom-name">${emotion.name}</span>
        <div class="mf-custom-actions">
          <div class="mf-custom-btn edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
          <div class="mf-custom-btn delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></div>
        </div>
      `;
      item.querySelector(".edit").onclick = () => {
        new CustomEmotionModal(this.app, this.plugin, key, emotion, () => this.render()).open();
      };
      item.querySelector(".delete").onclick = async () => {
        delete this.plugin.settings.customEmotions[key];
        await this.plugin.saveSettings();
        this.render();
      };
    });

    // 添加新情绪按钮
    const addBtn = sc.createDiv({ cls: "mf-add-emotion-btn" });
    addBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg><span>\u6DFB\u52A0\u65B0\u60C5\u7EEA</span>`;
    addBtn.onclick = () => {
      new CustomEmotionModal(this.app, this.plugin, null, null, () => this.render()).open();
    };
  }
  // 加载音乐文件
  async loadMusicFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;
        await this.ambientMusic.loadCustomMusic(base64Data);
        this.ambientMusic.setUseCustomMusic(true);
        // 保存到设置
        this.plugin.settings.customMusicData = base64Data;
        this.plugin.settings.useCustomMusic = true;
        await this.plugin.saveSettings();
        // 如果正在播放，切换到自定义音乐
        if (this.musicPlaying) {
          this.ambientMusic.stop();
          this.ambientMusic.start();
        }
        this.render();
        resolve();
      };
      reader.readAsDataURL(file);
    });
  }
  darken(hex, amt) {
    const n = parseInt(hex.replace("#", ""), 16);
    return `#${[n >> 16, n >> 8 & 255, n & 255].map((c) => Math.max(0, c - amt).toString(16).padStart(2, "0")).join("")}`;
  }
  injectStyles() {
    if (document.getElementById("mf-css"))
      return;
    const s = document.createElement("style");
    s.id = "mf-css";
    s.textContent = `
@import url('https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css');
:root{--mf-ink:255,255,255;--mf-deep:#000}

.mf-root,.mf-root .modal-content,.mf-root .modal-bg{background:transparent!important;border:none!important;box-shadow:none!important}
.mf-root .modal-content{padding:0;width:420px;max-width:95vw;height:640px;max-height:92vh;overflow:hidden;border-radius:32px}
.mf-modal{--theme-bg1:#0a0c10;--theme-bg2:#050508;--theme-accent:#6366f1;color:rgb(var(--mf-ink));font-family:'LXGW WenKai',-apple-system,BlinkMacSystemFont,sans-serif;height:100%;display:flex;flex-direction:column;background:var(--theme-bg2);border-radius:32px;overflow:hidden;font-weight:400;letter-spacing:0.02em}

.mf-main{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative}

.mf-orb-wrap{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden}
.mf-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,var(--theme-bg1) 0%,var(--theme-bg2) 50%,var(--mf-deep) 100%)}
.mf-stars{position:absolute;inset:0;pointer-events:none}
.mf-star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:twk 3s ease-in-out infinite}
@keyframes twk{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:.8;transform:scale(1.5)}}

.mf-ps{position:absolute;width:320px;height:320px;display:flex;align-items:center;justify-content:center;transition:transform 0.08s ease-out}
.mf-op{position:absolute;width:6px;height:6px;border-radius:50%;opacity:.7;filter:blur(1px)}
.mf-op.inner{animation:oi 8s linear infinite;animation-delay:var(--d)}
.mf-op.mid{animation:om 15s linear infinite;animation-delay:var(--d);width:4px;height:4px;opacity:.5}
.mf-op.out{animation:oo 25s linear infinite;animation-delay:var(--d);width:3px;height:3px;opacity:.3}
@keyframes oi{from{transform:rotate(var(--a)) translateX(90px)}to{transform:rotate(calc(var(--a)+360deg)) translateX(90px)}}
@keyframes om{from{transform:rotate(var(--a)) translateX(130px)}to{transform:rotate(calc(var(--a)+360deg)) translateX(130px)}}
@keyframes oo{from{transform:rotate(var(--a)) translateX(170px)}to{transform:rotate(calc(var(--a)+360deg)) translateX(170px)}}

.mf-fp{position:absolute;inset:0;pointer-events:none}
.mf-fpp{position:absolute;border-radius:50%;opacity:.4;animation:fp var(--dur) ease-in-out infinite;animation-delay:var(--del)}
@keyframes fp{0%,100%{transform:translateY(0) translateX(0) scale(1);opacity:.4}25%{transform:translateY(-40px) translateX(20px) scale(1.2);opacity:.2}50%{transform:translateY(-20px) translateX(-30px) scale(.8);opacity:.5}75%{transform:translateY(30px) translateX(10px) scale(1.1);opacity:.3}}

.mf-glow{position:absolute;border-radius:50%;pointer-events:none;transition:background 1.5s,transform 0.08s ease-out}
.mf-glow.g1{width:400px;height:400px;filter:blur(80px);opacity:.5;animation:gp 6s ease-in-out infinite}
.mf-glow.g2{width:300px;height:300px;filter:blur(60px);opacity:.4;animation:gp 6s ease-in-out infinite .5s}
@keyframes gp{0%,100%{opacity:.5}50%{opacity:.35}}

.mf-orb{width:150px;height:150px;border-radius:50%;cursor:grab;position:relative;transition:box-shadow 1s cubic-bezier(.4,0,.2,1),background 1s;animation:br 5s ease-in-out infinite;z-index:10;user-select:none;-webkit-user-select:none;touch-action:none}
.mf-orb:hover{filter:brightness(1.1)}
.mf-orb:active{cursor:grabbing}
@keyframes br{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
.mf-orb-inner{position:absolute;inset:10%;border-radius:50%;background:radial-gradient(circle,rgba(var(--mf-ink),.1),transparent);animation:ip 3s ease-in-out infinite}
@keyframes ip{0%,100%{opacity:.5;transform:scale(.9)}50%{opacity:.8;transform:scale(1.1)}}
.mf-orb-hl{position:absolute;top:15%;left:15%;width:35%;height:35%;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(var(--mf-ink),.6),rgba(var(--mf-ink),.1) 50%,transparent);filter:blur(8px)}
.mf-orb-ref{position:absolute;bottom:10%;right:15%;width:20%;height:10%;border-radius:50%;background:rgba(var(--mf-ink),.1);filter:blur(6px)}

.mf-hint{position:absolute;bottom:40px;text-align:center;animation:fu 1.5s ease .5s both}
.mf-h1{display:block;font-size:15px;color:rgba(var(--mf-ink),.55);letter-spacing:3px;margin-bottom:8px;font-weight:300}
.mf-h2{font-size:12px;color:rgba(var(--mf-ink),.3);letter-spacing:2px;font-weight:300}
@keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

.mf-particle-container{position:relative;z-index:10}
.mf-particle-canvas{cursor:pointer;border-radius:8px}

.mf-upload-btn{position:absolute;bottom:100px;right:20px;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,rgba(var(--mf-ink),.08),rgba(var(--mf-ink),.03));border:1px solid rgba(var(--mf-ink),.1);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s ease;z-index:20;backdrop-filter:blur(10px)}
.mf-upload-btn:hover{background:linear-gradient(135deg,rgba(var(--mf-ink),.15),rgba(var(--mf-ink),.08));border-color:var(--theme-accent);transform:scale(1.1);box-shadow:0 0 20px color-mix(in srgb,var(--theme-accent) 30%,transparent)}
.mf-upload-btn svg{width:20px;height:20px;color:rgba(var(--mf-ink),.6);transition:color .3s}
.mf-upload-btn:hover svg{color:var(--theme-accent)}

.mf-clear-btn{position:absolute;bottom:100px;left:20px;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,rgba(255,100,100,.1),rgba(255,100,100,.03));border:1px solid rgba(255,100,100,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s ease;z-index:20;backdrop-filter:blur(10px)}
.mf-clear-btn:hover{background:linear-gradient(135deg,rgba(255,100,100,.2),rgba(255,100,100,.1));border-color:rgba(255,100,100,.5);transform:scale(1.1);box-shadow:0 0 20px rgba(255,100,100,.2)}
.mf-clear-btn svg{width:18px;height:18px;color:rgba(255,100,100,.6);transition:color .3s}
.mf-clear-btn:hover svg{color:rgba(255,100,100,.9)}

.mf-settings-btn{position:absolute;top:20px;right:20px;width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,rgba(var(--mf-ink),.08),rgba(var(--mf-ink),.03));border:1px solid rgba(var(--mf-ink),.1);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s ease;z-index:30;backdrop-filter:blur(10px)}
.mf-settings-btn:hover,.mf-settings-btn.active{background:linear-gradient(135deg,rgba(var(--mf-ink),.15),rgba(var(--mf-ink),.08));border-color:var(--theme-accent);box-shadow:0 0 15px color-mix(in srgb,var(--theme-accent) 30%,transparent)}
.mf-settings-btn svg{width:18px;height:18px;color:rgba(var(--mf-ink),.6);transition:color .3s}
.mf-settings-btn:hover svg,.mf-settings-btn.active svg{color:var(--theme-accent)}

.mf-particle-panel{position:absolute;top:0;right:-220px;width:200px;height:100%;background:linear-gradient(180deg,rgba(10,12,16,.95),rgba(5,5,8,.98));border-left:1px solid rgba(var(--mf-ink),.08);backdrop-filter:blur(20px);z-index:25;transition:right .3s ease;overflow:hidden;display:flex;flex-direction:column}
.mf-particle-panel.open{right:0}

.mf-panel-header{display:flex;justify-content:space-between;align-items:center;padding:16px;border-bottom:1px solid rgba(var(--mf-ink),.06)}
.mf-panel-header span{font-size:13px;color:rgba(var(--mf-ink),.7);letter-spacing:1px;font-weight:500}
.mf-panel-close{width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:6px;transition:all .2s}
.mf-panel-close:hover{background:rgba(var(--mf-ink),.1)}
.mf-panel-close svg{width:14px;height:14px;color:rgba(var(--mf-ink),.4)}

.mf-panel-content{flex:1;overflow-y:auto;padding:12px}
.mf-panel-content::-webkit-scrollbar{width:3px}
.mf-panel-content::-webkit-scrollbar-thumb{background:rgba(var(--mf-ink),.1);border-radius:2px}

.mf-slider-row{margin-bottom:16px}
.mf-slider-label{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.mf-slider-label span:first-child{font-size:9px;color:rgba(var(--mf-ink),.4);letter-spacing:1px;text-transform:uppercase}
.mf-slider-value{font-size:11px;color:var(--theme-accent);font-weight:500}

.mf-slider-wrap{position:relative}
.mf-slider{width:100%;height:4px;-webkit-appearance:none;appearance:none;background:rgba(var(--mf-ink),.08);border-radius:2px;outline:none;cursor:pointer}
.mf-slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--theme-accent);cursor:pointer;box-shadow:0 0 10px color-mix(in srgb,var(--theme-accent) 50%,transparent)}
.mf-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--theme-accent);cursor:pointer;border:none}

.mf-reset-btn{margin-top:12px;padding:10px;text-align:center;font-size:11px;color:rgba(var(--mf-ink),.5);background:rgba(var(--mf-ink),.04);border:1px solid rgba(var(--mf-ink),.08);border-radius:8px;cursor:pointer;transition:all .2s;letter-spacing:1px}
.mf-reset-btn:hover{background:rgba(var(--mf-ink),.08);color:rgba(var(--mf-ink),.8);border-color:rgba(var(--mf-ink),.15)}

.mf-nav{display:flex;justify-content:space-around;padding:16px 20px 20px;background:linear-gradient(to top,var(--theme-bg2),transparent);position:relative;z-index:100}
.mf-nb{display:flex;flex-direction:column;align-items:center;gap:6px;color:rgba(var(--mf-ink),.3);cursor:pointer;transition:all .3s;padding:8px 14px;border-radius:14px}
.mf-nb:hover{color:rgba(var(--mf-ink),.6)}
.mf-nb.active{color:var(--theme-accent)}
.mf-nb.on{color:var(--theme-accent)}
.mf-ni{width:24px;height:24px;display:flex;align-items:center;justify-content:center}
.mf-ni svg{width:20px;height:20px}
.mf-nb span{font-size:10px;letter-spacing:1px;font-weight:400}

.mf-in-wrap{flex:1;display:flex;flex-direction:column;padding:24px;position:relative;overflow:auto}
.mf-in-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,var(--theme-bg1) 0%,var(--theme-bg2) 100%)}
.mf-back{position:absolute;top:20px;left:20px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(var(--mf-ink),.04);color:rgba(var(--mf-ink),.5);cursor:pointer;transition:all .3s;z-index:10;backdrop-filter:blur(10px)}
.mf-back:hover{background:rgba(var(--mf-ink),.08);color:rgb(var(--mf-ink));transform:scale(1.05)}
.mf-back svg{width:20px;height:20px}

.mf-in-top{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;padding-top:30px}
.mf-in-bottom{flex:1;display:flex;flex-direction:column;justify-content:flex-end;position:relative;z-index:5;padding-bottom:10px}

.mf-q{text-align:center;font-size:18px;font-weight:300;color:rgba(var(--mf-ink),.75);letter-spacing:2px;margin-top:30px;margin-bottom:16px;position:relative;z-index:5}

.mf-mo-wrap{position:relative;width:70px;height:70px;margin:0 auto 24px;display:flex;align-items:center;justify-content:center}
.mf-mo-glow{position:absolute;width:110px;height:110px;border-radius:50%;filter:blur(30px);opacity:.6;transition:background 1s}
.mf-mo{width:50px;height:50px;border-radius:50%;transition:all .8s cubic-bezier(.4,0,.2,1);animation:mp 4s ease-in-out infinite}
@keyframes mp{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}

.mf-ib{position:relative;background:linear-gradient(165deg,color-mix(in srgb,var(--bc) 8%,rgba(15,17,22,.96)),color-mix(in srgb,var(--bc) 3%,rgba(10,12,16,.98)));border:none!important;border-radius:24px;transition:all .5s cubic-bezier(.4,0,.2,1);backdrop-filter:blur(20px);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--bc) 20%,transparent),inset 0 -1px 0 color-mix(in srgb,var(--bc) 15%,transparent),0 4px 24px rgba(0,0,0,.3),0 0 0 1px color-mix(in srgb,var(--bc) 12%,transparent);overflow:visible}
.mf-ib::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 0%,color-mix(in srgb,var(--bc) 12%,transparent),transparent 60%);pointer-events:none;opacity:.8;transition:opacity .5s;z-index:0;border-radius:24px}
.mf-ib::after{content:'';position:absolute;bottom:0;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--bc) 35%,transparent),transparent);pointer-events:none;z-index:0}
.mf-ib:focus-within{box-shadow:inset 0 1px 0 color-mix(in srgb,var(--bc) 30%,transparent),inset 0 -1px 0 color-mix(in srgb,var(--bc) 25%,transparent),0 8px 32px color-mix(in srgb,var(--bc) 15%,transparent),0 0 0 1px color-mix(in srgb,var(--bc) 25%,transparent),0 0 40px color-mix(in srgb,var(--bc) 10%,transparent)}
.mf-ib:focus-within::before{opacity:1}
.mf-ib:focus-within::after{background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--bc) 50%,transparent),transparent)}
.mf-ta,.mf-ib textarea,.mf-ib textarea:focus,.mf-ib textarea:active,.mf-ib textarea:hover{width:100%;height:110px;padding:20px 22px;padding-right:64px;background:transparent!important;border:none!important;border-width:0!important;border-style:none!important;border-color:transparent!important;color:rgb(var(--mf-ink))!important;font-family:inherit;font-size:15px;line-height:1.9;resize:none;outline:none!important;outline-width:0!important;font-weight:400;letter-spacing:0.03em;-webkit-text-fill-color:rgb(var(--mf-ink))!important;position:relative;z-index:1;box-shadow:none!important;-webkit-appearance:none;-moz-appearance:none;appearance:none;caret-color:var(--bc)}
.mf-ta::placeholder,.mf-ib textarea::placeholder{color:color-mix(in srgb,var(--bc) 50%,rgba(var(--mf-ink),.3))!important;font-style:normal;-webkit-text-fill-color:color-mix(in srgb,var(--bc) 50%,rgba(var(--mf-ink),.3))!important;transition:color .5s}

.mf-sb{position:absolute;right:14px;bottom:14px;width:44px;height:44px;border-radius:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transform:scale(.7);transition:all .4s cubic-bezier(.4,0,.2,1);pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.3);z-index:10}
.mf-sb.vis{opacity:1;transform:scale(1);pointer-events:auto!important;cursor:pointer}
.mf-sb:hover{filter:brightness(1.15);transform:scale(1.1)!important;box-shadow:0 6px 24px rgba(0,0,0,.4)}
.mf-sb.saving{animation:sv .6s ease}
@keyframes sv{0%{transform:scale(1)}50%{transform:scale(.8)}100%{transform:scale(1)}}
.mf-sb svg{width:22px;height:22px;color:#000;pointer-events:none}

.mf-gw{text-align:center;font-size:14px;margin-top:16px;letter-spacing:1.5px;opacity:.9;transition:color .5s;font-weight:400}

.mf-eb{margin-bottom:16px}
.mf-eb-lbl{display:block;font-size:12px;color:rgba(var(--mf-ink),.3);margin-bottom:12px;text-align:center;letter-spacing:2px;font-weight:400}
.mf-eb-btns{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;position:relative}
.mf-eb-btn{display:flex;align-items:center;gap:8px;padding:12px 16px;border-radius:16px;background:linear-gradient(145deg,rgba(var(--mf-ink),.03),rgba(var(--mf-ink),.01));border:1.5px solid rgba(var(--mf-ink),.06);cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);user-select:none;-webkit-user-select:none;position:relative}
.mf-eb-btn:hover{background:rgba(var(--mf-ink),.06);border-color:color-mix(in srgb,var(--ec) 45%,transparent);transform:translateY(-2px)}
.mf-eb-btn.on{background:color-mix(in srgb,var(--ec) 12%,transparent);border-color:color-mix(in srgb,var(--ec) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--ec) 10%,transparent),0 6px 24px color-mix(in srgb,var(--ec) 25%,transparent)}
.mf-eb-btn.dragging{opacity:0.4;transform:scale(0.95)}
.mf-eb-btn.drag-over{border-color:var(--theme-accent);border-style:dashed;background:rgba(99,102,241,.08)}
.mf-eb-btn.drag-over::before{content:'';position:absolute;inset:-4px;border:2px solid var(--theme-accent);border-radius:20px;animation:drag-pulse 1s ease-in-out infinite}
@keyframes drag-pulse{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.6;transform:scale(1.02)}}
.mf-drag-ghost{position:fixed;z-index:9999;pointer-events:none;display:flex;align-items:center;gap:8px;padding:12px 16px;border-radius:16px;background:linear-gradient(145deg,rgba(30,32,40,.98),rgba(20,22,28,.98));border:1.5px solid var(--theme-accent);box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 30px color-mix(in srgb,var(--theme-accent) 30%,transparent);backdrop-filter:blur(20px);transform:scale(1.08) rotate(2deg);transition:transform .15s ease,box-shadow .15s ease}
.mf-drag-ghost .mf-eb-icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center}
.mf-drag-ghost .mf-eb-icon svg{width:100%;height:100%}
.mf-drag-ghost .mf-eb-nm{font-size:13px;color:rgba(var(--mf-ink),.9);font-weight:500}
.mf-eb-em{font-size:20px}
.mf-eb-nm{font-size:13px;color:rgba(var(--mf-ink),.45);font-weight:400}
.mf-eb-btn.on .mf-eb-nm{color:rgba(var(--mf-ink),.95)}
.mf-eb-icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center;transition:transform .2s}
.mf-eb-icon svg{width:100%;height:100%}
.mf-eb-btn:hover .mf-eb-icon{transform:scale(1.1)}
.mf-eb-btn.on .mf-eb-icon{transform:scale(1.15)}
.mf-eb-add{border-style:dashed;border-color:rgba(var(--mf-ink),.15)}
.mf-eb-add .mf-eb-icon{color:rgba(var(--mf-ink),.3)}
.mf-eb-add:hover{border-color:var(--theme-accent);background:rgba(99,102,241,.08)}
.mf-eb-add:hover .mf-eb-icon{color:var(--theme-accent)}
.mf-eb-add:hover .mf-eb-nm{color:var(--theme-accent)}

.mf-eb-more{border-style:dashed;border-color:rgba(var(--mf-ink),.12)}
.mf-eb-more .mf-eb-icon{color:rgba(var(--mf-ink),.4)}
.mf-eb-more:hover{border-color:var(--theme-accent);background:rgba(99,102,241,.08)}
.mf-eb-more:hover .mf-eb-icon{color:var(--theme-accent)}
.mf-eb-more:hover .mf-eb-nm{color:var(--theme-accent)}
.mf-eb-more.on{border-color:var(--theme-accent);background:rgba(99,102,241,.12)}
.mf-eb-more.on .mf-eb-icon{color:var(--theme-accent)}
.mf-eb-more.on .mf-eb-nm{color:var(--theme-accent)}

.mf-eb-expand{max-height:0;overflow:hidden;transition:all .35s cubic-bezier(.4,0,.2,1);opacity:0;margin-top:0}
.mf-eb-expand.open{max-height:200px;opacity:1;margin-top:10px}
.mf-eb-expand .mf-eb-btns{padding-top:10px;border-top:1px solid rgba(var(--mf-ink),.06)}

.mf-pg{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative}
.mf-pg-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,var(--theme-bg1) 0%,var(--theme-bg2) 100%)}
.mf-hd{display:flex;align-items:center;justify-content:center;padding:22px 20px;position:relative;z-index:10}
.mf-hd-t{font-size:16px;font-weight:500;letter-spacing:2px}
.mf-sc{flex:1;overflow-y:auto;padding:0 20px 20px;position:relative;z-index:5}

.mf-ey{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:40px}
.mf-ey-o{width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,rgba(var(--mf-ink),.05),rgba(var(--mf-ink),.02));margin-bottom:24px;animation:eo 3s ease-in-out infinite}
@keyframes eo{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.1);opacity:.7}}
.mf-ey-t{font-size:15px;color:rgba(var(--mf-ink),.5);margin-bottom:8px;font-weight:400}
.mf-ey-h{font-size:13px;color:rgba(var(--mf-ink),.25);font-weight:300}

.mf-ts{background:rgba(var(--mf-ink),.02);border-radius:18px;padding:16px;margin-bottom:20px;border:1px solid rgba(var(--mf-ink),.03)}
.mf-ts-l{font-size:12px;color:rgba(var(--mf-ink),.35);margin-bottom:12px;font-weight:500;letter-spacing:1px}
.mf-ts-m{display:flex;gap:8px;flex-wrap:wrap}
.mf-ts-i{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 10px;border-radius:12px;background:color-mix(in srgb,var(--tc) 8%,transparent);min-width:50px}
.mf-ts-icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center}
.mf-ts-icon svg{width:100%;height:100%}
.mf-ts-t{font-size:10px;color:rgba(var(--mf-ink),.3);font-weight:400}

.mf-ds{margin-bottom:24px}
.mf-ds-d{font-size:12px;color:rgba(var(--mf-ink),.25);margin-bottom:12px;font-weight:500;letter-spacing:1px}
.mf-cd{display:flex;gap:12px;padding:14px;background:rgba(var(--mf-ink),.02);border-radius:16px;margin-bottom:10px;border:1px solid rgba(var(--mf-ink),.03);transition:all .3s}
.mf-cd:hover{background:rgba(var(--mf-ink),.04);transform:translateX(4px)}
.mf-cd-icon{width:44px;height:44px;border-radius:12px;background:color-mix(in srgb,var(--cc) 10%,transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.mf-cd-icon svg{width:26px;height:26px}
.mf-cd-b{flex:1;min-width:0}
.mf-cd-tp{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.mf-cd-n{font-size:13px;font-weight:500;color:var(--cc)}
.mf-cd-tm{font-size:11px;color:rgba(var(--mf-ink),.25);font-weight:400}
.mf-cd-tx{font-size:13px;line-height:1.6;color:rgba(var(--mf-ink),.5);font-weight:300}

.mf-mc{display:flex;align-items:center;gap:18px;padding:22px;background:linear-gradient(135deg,color-mix(in srgb,var(--mc) 10%,transparent),color-mix(in srgb,var(--mc) 3%,transparent));border:1px solid color-mix(in srgb,var(--mc) 15%,transparent);border-radius:22px;margin-bottom:20px}
.mf-mc-icon{width:56px;height:56px;display:flex;align-items:center;justify-content:center}
.mf-mc-icon svg{width:100%;height:100%}
.mf-mc-i{flex:1}
.mf-mc-l{font-size:11px;color:rgba(var(--mf-ink),.35);margin-bottom:4px;letter-spacing:1px;font-weight:400}
.mf-mc-n{font-size:20px;font-weight:500;margin-bottom:2px}
.mf-mc-p{font-size:28px;font-weight:600;background:var(--mg);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

.mf-nums{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px}
.mf-num{background:rgba(var(--mf-ink),.02);border-radius:16px;padding:16px;text-align:center;border:1px solid rgba(var(--mf-ink),.03)}
.mf-num-v{font-size:24px;font-weight:500;margin-bottom:4px}
.mf-num-l{font-size:11px;color:rgba(var(--mf-ink),.25);letter-spacing:1px;font-weight:400}

.mf-st{font-size:13px;font-weight:500;margin-bottom:16px;color:rgba(var(--mf-ink),.4);letter-spacing:1px}
.mf-dist{margin-bottom:24px}
.mf-dr{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.mf-dr-i{width:80px;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:400}
.mf-dr-icon{width:18px;height:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.mf-dr-icon svg{width:100%;height:100%}
.mf-dr-bw{flex:1;height:8px;background:rgba(var(--mf-ink),.03);border-radius:4px;overflow:hidden}
.mf-dr-b{height:100%;border-radius:4px;transition:width .8s cubic-bezier(.4,0,.2,1)}
.mf-dr-p{width:36px;font-size:12px;color:rgba(var(--mf-ink),.3);text-align:right;font-weight:400}

.mf-ch{display:flex;justify-content:space-between;height:100px;gap:8px}
.mf-ch-c{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px}
.mf-ch-bw{flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center}
.mf-ch-b{width:100%;max-width:24px;min-height:4px;border-radius:6px 6px 0 0;transition:height .6s cubic-bezier(.4,0,.2,1)}
.mf-ch-l{font-size:10px;color:rgba(var(--mf-ink),.2);letter-spacing:.5px;font-weight:400}
.mf-ch-l.td{color:rgb(var(--mf-ink));font-weight:500}

.mf-set-l{font-size:12px;color:rgba(var(--mf-ink),.4);margin-bottom:14px;letter-spacing:1px;font-weight:500}
.mf-set-l.mt{margin-top:28px}
.mf-tg{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.mf-tb{padding:14px;border-radius:16px;background:rgba(var(--mf-ink),.02);border:1px solid rgba(var(--mf-ink),.04);cursor:pointer;transition:all .3s}
.mf-tb:hover{background:rgba(var(--mf-ink),.04)}
.mf-tb.on{border-color:var(--ta);box-shadow:0 0 20px color-mix(in srgb,var(--ta) 20%,transparent)}
.mf-tb-pre{width:100%;height:60px;border-radius:10px;background:linear-gradient(135deg,var(--tb1),var(--tb2));display:flex;align-items:center;justify-content:center;margin-bottom:10px;overflow:hidden}
.mf-tb-orb{width:28px;height:28px;border-radius:50%;background:var(--ta);box-shadow:0 0 20px var(--ta);animation:tbo 3s ease-in-out infinite}
@keyframes tbo{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
.mf-tb-n{font-size:13px;text-align:center;color:rgba(var(--mf-ink),.6);font-weight:400}
.mf-tb.on .mf-tb-n{color:rgb(var(--mf-ink))}

.mf-custom-list{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
.mf-custom-item{display:flex;align-items:center;gap:12px;padding:12px 14px;background:rgba(var(--mf-ink),.02);border-radius:14px;border:1px solid rgba(var(--mf-ink),.04);transition:all .3s}
.mf-custom-item:hover{background:rgba(var(--mf-ink),.04)}
.mf-custom-icon{width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.mf-custom-icon svg{width:100%;height:100%}
.mf-custom-name{flex:1;font-size:14px;color:rgba(var(--mf-ink),.8);font-weight:400}
.mf-custom-actions{display:flex;gap:8px}
.mf-custom-btn{width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(var(--mf-ink),.04);color:rgba(var(--mf-ink),.4);cursor:pointer;transition:all .2s}
.mf-custom-btn:hover{background:rgba(var(--mf-ink),.08);color:rgba(var(--mf-ink),.8)}
.mf-custom-btn.delete:hover{background:rgba(255,100,100,.15);color:#ff6b6b}
.mf-custom-btn svg{width:16px;height:16px}

.mf-add-emotion-btn{display:flex;align-items:center;justify-content:center;gap:10px;padding:16px;background:linear-gradient(145deg,rgba(var(--mf-ink),.03),rgba(var(--mf-ink),.01));border:1.5px dashed rgba(var(--mf-ink),.1);border-radius:16px;color:rgba(var(--mf-ink),.5);font-size:14px;cursor:pointer;transition:all .3s}
.mf-add-emotion-btn:hover{background:rgba(var(--mf-ink),.05);border-color:var(--theme-accent);color:var(--theme-accent)}
.mf-add-emotion-btn svg{width:20px;height:20px}

.mf-opts{display:flex;flex-direction:column;gap:12px}
.mf-opt{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:rgba(var(--mf-ink),.02);border-radius:14px;border:1px solid rgba(var(--mf-ink),.03)}
.mf-opt-t{font-size:14px;margin-bottom:2px;font-weight:400}
.mf-opt-d{font-size:11px;color:rgba(var(--mf-ink),.3);font-weight:300}
.mf-tgl{width:44px;height:26px;border-radius:13px;background:rgba(var(--mf-ink),.1);cursor:pointer;position:relative;transition:all .3s}
.mf-tgl::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:all .3s}
.mf-tgl.on{background:var(--theme-accent)}
.mf-tgl.on::after{left:21px}

.mf-sc::-webkit-scrollbar{width:3px}
.mf-sc::-webkit-scrollbar-track{background:transparent}
.mf-sc::-webkit-scrollbar-thumb{background:rgba(var(--mf-ink),.06);border-radius:2px}

.mf-music-btn{position:absolute;bottom:100px;left:70px;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,rgba(120,200,255,.15),rgba(120,200,255,.05));border:1px solid rgba(120,200,255,.25);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s ease;z-index:21;backdrop-filter:blur(10px)}
.mf-music-btn:hover{background:linear-gradient(135deg,rgba(120,200,255,.25),rgba(120,200,255,.15));border-color:rgba(120,200,255,.5);transform:scale(1.1);box-shadow:0 0 25px rgba(120,200,255,.3)}
.mf-music-btn svg{width:20px;height:20px;color:rgba(120,200,255,.7);transition:all .3s}
.mf-music-btn:hover svg{color:rgba(120,200,255,1)}
.mf-music-btn.playing{background:linear-gradient(135deg,rgba(120,200,255,.3),rgba(80,180,255,.2));border-color:rgba(120,200,255,.6);box-shadow:0 0 20px rgba(120,200,255,.25);animation:music-pulse 2s ease-in-out infinite}
.mf-music-btn.playing svg{color:rgba(120,200,255,1)}
@keyframes music-pulse{0%,100%{box-shadow:0 0 20px rgba(120,200,255,.25)}50%{box-shadow:0 0 30px rgba(120,200,255,.4)}}

.mf-music-panel{position:absolute;bottom:78px;left:124px;display:flex;flex-direction:column;gap:10px;padding:14px 16px;background:linear-gradient(135deg,rgba(15,17,22,.95),rgba(10,12,16,.98));border:1px solid rgba(var(--mf-ink),.08);border-radius:18px;backdrop-filter:blur(20px);z-index:20;min-width:200px;opacity:0;visibility:hidden;transform:translateX(-10px);transition:all .3s ease}
.mf-music-panel.open{opacity:1;visibility:visible;transform:translateX(0)}

.mf-music-row{display:flex;align-items:center;gap:12px}
.mf-music-row svg{width:16px;height:16px;color:rgba(120,200,255,.6);flex-shrink:0}
.mf-music-slider{flex:1;height:3px;-webkit-appearance:none;appearance:none;background:rgba(var(--mf-ink),.1);border-radius:2px;outline:none;cursor:pointer}
.mf-music-slider::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:rgba(120,200,255,.9);cursor:pointer;box-shadow:0 0 8px rgba(120,200,255,.4)}
.mf-music-slider::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:rgba(120,200,255,.9);cursor:pointer;border:none}

.mf-music-source{justify-content:center;gap:8px;margin-top:4px}
.mf-source-opt{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:12px;background:rgba(var(--mf-ink),.03);border:1px solid rgba(var(--mf-ink),.06);cursor:pointer;transition:all .25s;font-size:12px;color:rgba(var(--mf-ink),.5)}
.mf-source-opt:hover{background:rgba(var(--mf-ink),.06);color:rgba(var(--mf-ink),.8)}
.mf-source-opt.active{background:rgba(120,200,255,.15);border-color:rgba(120,200,255,.4);color:rgba(120,200,255,1)}
.mf-source-opt.active svg{color:rgba(120,200,255,1)}
.mf-source-opt.disabled{opacity:.5}
.mf-source-opt svg{width:14px;height:14px}

.mf-music-clear{justify-content:center;margin-top:4px;padding-top:8px;border-top:1px solid rgba(var(--mf-ink),.05)}
.mf-clear-music-btn{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;background:rgba(255,100,100,.08);border:1px solid rgba(255,100,100,.15);cursor:pointer;transition:all .25s;font-size:11px;color:rgba(255,100,100,.7)}
.mf-clear-music-btn:hover{background:rgba(255,100,100,.15);border-color:rgba(255,100,100,.3);color:rgba(255,100,100,1)}
.mf-clear-music-btn svg{width:12px;height:12px}

/* 增强统计页面样式 */
.mf-stats-page .mf-hd{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.mf-range-sel{display:flex;gap:6px}
.mf-range-btn{padding:6px 14px;border-radius:20px;font-size:12px;color:rgba(var(--mf-ink),.5);background:rgba(var(--mf-ink),.04);border:1px solid rgba(var(--mf-ink),.06);cursor:pointer;transition:all .25s}
.mf-range-btn:hover{background:rgba(var(--mf-ink),.08);color:rgba(var(--mf-ink),.8)}
.mf-range-btn.active{background:var(--theme-accent);color:rgb(var(--mf-ink));border-color:var(--theme-accent)}

.mf-nums-4{grid-template-columns:repeat(4,1fr)}

/* 情绪健康指标 */
.mf-health{margin-bottom:24px}
.mf-health-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.mf-health-card{display:flex;flex-direction:column;align-items:center;padding:20px 16px;background:rgba(var(--mf-ink),.02);border-radius:20px;border:1px solid rgba(var(--mf-ink),.04)}
.mf-health-ring{position:relative;width:80px;height:80px;margin-bottom:12px}
.mf-health-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.mf-ring-bg{fill:none;stroke:rgba(var(--mf-ink),.08);stroke-width:3}
.mf-ring-fill{fill:none;stroke:var(--color);stroke-width:3;stroke-linecap:round;transition:stroke-dasharray .8s ease}
.mf-ring-text{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;color:rgba(var(--mf-ink),.9)}
.mf-health-label{font-size:12px;color:rgba(var(--mf-ink),.4);letter-spacing:1px}

/* 情绪趋势图 */
.mf-trend{margin-bottom:24px}
.mf-trend-chart{background:rgba(var(--mf-ink),.02);border-radius:16px;padding:16px;border:1px solid rgba(var(--mf-ink),.04)}
.mf-trend-svg{width:100%;height:auto}
.mf-trend-line{stroke-linecap:round;stroke-linejoin:round}
.mf-trend-dot{transition:r .2s}
.mf-trend-dot:hover{r:6}
.mf-trend-ylabel{font-size:14px;fill:rgba(var(--mf-ink),.4);text-anchor:middle}
.mf-trend-xlabel{font-size:9px;fill:rgba(var(--mf-ink),.3);text-anchor:middle}
.mf-trend-empty{padding:40px;text-align:center;color:rgba(var(--mf-ink),.3);font-size:13px}

/* 时段分析 */
.mf-time-analysis{margin-bottom:24px}
.mf-time-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.mf-time-card{display:flex;flex-direction:column;align-items:center;padding:14px 8px;background:rgba(var(--mf-ink),.02);border-radius:14px;border:1px solid rgba(var(--mf-ink),.04);transition:all .3s}
.mf-time-card:hover{background:rgba(var(--mf-ink),.04)}
.mf-time-icon{font-size:20px;margin-bottom:6px}
.mf-time-label{font-size:12px;font-weight:500;color:rgba(var(--mf-ink),.8);margin-bottom:2px}
.mf-time-range{font-size:9px;color:rgba(var(--mf-ink),.3);margin-bottom:8px}
.mf-time-mood{padding:4px 10px;border-radius:10px;font-size:10px;color:rgb(var(--mf-ink));margin-bottom:6px;min-width:50px;text-align:center}
.mf-time-count{font-size:10px;color:rgba(var(--mf-ink),.4)}

/* 热力图 */
.mf-heatmap{margin-bottom:24px}
.mf-heatmap-wrap{background:rgba(var(--mf-ink),.02);border-radius:16px;padding:16px;border:1px solid rgba(var(--mf-ink),.04)}
.mf-heatmap-title{text-align:center;font-size:14px;font-weight:500;color:rgba(var(--mf-ink),.7);margin-bottom:12px}
.mf-heatmap-weeks{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px}
.mf-heatmap-week{text-align:center;font-size:10px;color:rgba(var(--mf-ink),.3)}
.mf-heatmap-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.mf-heatmap-day{aspect-ratio:1;border-radius:6px;background:rgba(var(--mf-ink),.03);display:flex;align-items:center;justify-content:center;position:relative;transition:all .2s}
.mf-heatmap-day.empty{background:transparent}
.mf-heatmap-day.today{box-shadow:0 0 0 2px var(--theme-accent)}
.mf-heatmap-day:hover:not(.empty){transform:scale(1.1);z-index:1}
.mf-heatmap-date{font-size:10px;color:rgba(var(--mf-ink),.6)}
.mf-heatmap-legend{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;font-size:14px}
.mf-legend-bar{width:100px;height:8px;border-radius:4px;background:linear-gradient(90deg,rgba(239,68,68,.8),rgba(245,158,11,.6),rgba(34,197,94,.8))}

/* 情绪洞察 */
.mf-insights{margin-bottom:24px}
.mf-insights-list{display:flex;flex-direction:column;gap:10px}
.mf-insight-card{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:linear-gradient(135deg,rgba(var(--mf-ink),.03),rgba(var(--mf-ink),.01));border-radius:14px;border:1px solid rgba(var(--mf-ink),.05)}
.mf-insight-icon{font-size:18px;flex-shrink:0}
.mf-insight-text{font-size:13px;color:rgba(var(--mf-ink),.7);line-height:1.5}

/* 分享按钮样式 */
.mf-share-today-btn{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:20px;background:linear-gradient(135deg,var(--theme-accent),color-mix(in srgb,var(--theme-accent) 70%,#000));color:rgb(var(--mf-ink));font-size:12px;cursor:pointer;transition:all .3s;border:none}
.mf-share-today-btn:hover{transform:scale(1.05);box-shadow:0 4px 20px color-mix(in srgb,var(--theme-accent) 40%,transparent)}
.mf-share-today-btn svg{width:14px;height:14px}

.mf-cd{position:relative}
.mf-cd-share{position:absolute;right:12px;top:50%;transform:translateY(-50%);width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(var(--mf-ink),.05);color:rgba(var(--mf-ink),.3);cursor:pointer;transition:all .25s;opacity:0}
.mf-cd:hover .mf-cd-share{opacity:1}
.mf-cd-share:hover{background:var(--theme-accent);color:rgb(var(--mf-ink));transform:translateY(-50%) scale(1.1)}
.mf-cd-share svg{width:16px;height:16px}

/* 分享弹窗样式 */
.mf-share-root .modal-content{background:transparent!important;border:none!important;box-shadow:none!important}
.mf-share-modal{background:linear-gradient(180deg,#0f1115,#080a0d);border-radius:24px;padding:24px;width:420px;max-width:95vw;max-height:85vh;overflow-y:auto;color:rgb(var(--mf-ink));font-family:'LXGW WenKai',-apple-system,sans-serif}
.mf-share-modal::-webkit-scrollbar{width:4px}
.mf-share-modal::-webkit-scrollbar-thumb{background:rgba(var(--mf-ink),.1);border-radius:2px}

.mf-share-header{text-align:center;margin-bottom:24px}
.mf-share-title{font-size:20px;font-weight:600}
.mf-share-empty{text-align:center;padding:60px 20px;color:rgba(var(--mf-ink),.4)}

.mf-share-section{margin-bottom:20px}
.mf-share-label{font-size:12px;color:rgba(var(--mf-ink),.4);margin-bottom:12px;letter-spacing:1px}

.mf-style-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.mf-style-btn{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;border-radius:14px;background:rgba(var(--mf-ink),.03);border:1px solid rgba(var(--mf-ink),.06);cursor:pointer;transition:all .25s;font-size:11px;color:rgba(var(--mf-ink),.6)}
.mf-style-btn:hover{background:rgba(var(--mf-ink),.06);color:rgba(var(--mf-ink),.9)}
.mf-style-btn.active{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.5);color:rgb(var(--mf-ink))}
.mf-style-icon{font-size:22px}

.mf-opt-grid{display:flex;gap:16px;flex-wrap:wrap}
.mf-opt-item{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(var(--mf-ink),.7)}
.mf-mini-tgl{width:36px;height:20px;border-radius:10px;background:rgba(var(--mf-ink),.1);cursor:pointer;position:relative;transition:all .25s}
.mf-mini-tgl::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:all .25s}
.mf-mini-tgl.on{background:var(--theme-accent,#6366f1)}
.mf-mini-tgl.on::after{left:18px}

.mf-preview-section{margin-bottom:0}
.mf-preview-container{display:flex;justify-content:center;padding:20px;background:rgba(0,0,0,.3);border-radius:16px;min-height:200px}

/* 卡片样式 */
.mf-card{width:320px;padding:28px 24px;border-radius:20px;font-family:'LXGW WenKai',-apple-system,sans-serif;color:rgb(var(--mf-ink));position:relative;overflow:hidden}
.mf-card-gradient{background:linear-gradient(135deg,rgba(99,102,241,.3),#0a0c10,#050508)}
.mf-card-minimal{background:#fff;color:#1a1a1a;box-shadow:0 4px 20px rgba(0,0,0,.1)}
.mf-card-polaroid{background:#fafafa;color:#1a1a1a;box-shadow:0 4px 20px rgba(0,0,0,.15);padding:20px 20px 40px}
.mf-card-neon{background:linear-gradient(135deg,#0a0a0a,#1a0a2e);border:2px solid rgba(168,85,247,.5);box-shadow:0 0 30px rgba(168,85,247,.3),inset 0 0 60px rgba(168,85,247,.05)}

.mf-card-date{text-align:center;font-size:13px;color:rgba(var(--mf-ink),.5);margin-bottom:24px;letter-spacing:1px}
.mf-card-minimal .mf-card-date,.mf-card-polaroid .mf-card-date{color:rgba(0,0,0,.4)}

.mf-card-content{display:flex;flex-direction:column;gap:16px}
.mf-card-item{padding-bottom:16px;border-bottom:1px solid rgba(var(--mf-ink),.06)}
.mf-card-item:last-child{border-bottom:none;padding-bottom:0}
.mf-card-minimal .mf-card-item,.mf-card-polaroid .mf-card-item{border-bottom-color:rgba(0,0,0,.06)}

.mf-card-emotion{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.mf-card-emoji{font-size:28px}
.mf-card-name{font-size:18px;font-weight:600}
.mf-card-time{font-size:12px;color:rgba(var(--mf-ink),.4);margin-left:auto}
.mf-card-minimal .mf-card-time,.mf-card-polaroid .mf-card-time{color:rgba(0,0,0,.35)}

.mf-card-text{font-size:14px;line-height:1.7;color:rgba(var(--mf-ink),.85)}
.mf-card-minimal .mf-card-text,.mf-card-polaroid .mf-card-text{color:rgba(0,0,0,.7)}

.mf-card-more{text-align:center;font-size:12px;color:rgba(var(--mf-ink),.35);padding-top:12px}

.mf-card-watermark{display:flex;align-items:center;justify-content:center;gap:8px;font-size:11px;color:rgba(var(--mf-ink),.25);margin-top:24px;padding-top:16px;border-top:1px solid rgba(var(--mf-ink),.05)}
.mf-card-minimal .mf-card-watermark,.mf-card-polaroid .mf-card-watermark{color:rgba(0,0,0,.2);border-top-color:rgba(0,0,0,.05)}

.mf-share-actions{display:flex;gap:12px;margin-top:24px}
.mf-share-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 20px;border-radius:14px;background:rgba(var(--mf-ink),.05);border:1px solid rgba(var(--mf-ink),.08);color:rgba(var(--mf-ink),.8);font-size:14px;cursor:pointer;transition:all .25s}
.mf-share-btn:hover{background:rgba(var(--mf-ink),.1);color:rgb(var(--mf-ink))}
.mf-share-btn.primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;color:rgb(var(--mf-ink))}
.mf-share-btn.primary:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(99,102,241,.4)}
.mf-share-btn svg{width:18px;height:18px}

/* 搜索筛选功能样式 */
.mf-history-page .mf-hd{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.mf-hd-btns{display:flex;align-items:center;gap:10px}

.mf-filter-btn{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(var(--mf-ink),.04);border:1px solid rgba(var(--mf-ink),.06);color:rgba(var(--mf-ink),.5);cursor:pointer;transition:all .25s}
.mf-filter-btn:hover{background:rgba(var(--mf-ink),.08);color:rgba(var(--mf-ink),.8)}
.mf-filter-btn.active{background:var(--theme-accent);color:rgb(var(--mf-ink));border-color:var(--theme-accent)}
.mf-filter-btn svg{width:18px;height:18px}

/* 筛选面板 */
.mf-filter-panel{background:linear-gradient(135deg,rgba(var(--mf-ink),.03),rgba(var(--mf-ink),.01));border:1px solid rgba(var(--mf-ink),.06);border-radius:18px;padding:18px;margin-bottom:20px;animation:slideDown .3s ease}
@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}

.mf-filter-row{margin-bottom:16px}
.mf-filter-row:last-child{margin-bottom:0}
.mf-filter-label{font-size:12px;color:rgba(var(--mf-ink),.5);margin-bottom:10px;letter-spacing:0.5px}

/* 搜索框 */
.mf-search-input{width:100%;padding:12px 16px;border-radius:12px;background:rgba(0,0,0,.3);border:1px solid rgba(var(--mf-ink),.08);color:rgb(var(--mf-ink));font-size:14px;font-family:inherit;outline:none;transition:all .25s}
.mf-search-input::placeholder{color:rgba(var(--mf-ink),.3)}
.mf-search-input:focus{border-color:var(--theme-accent);box-shadow:0 0 0 3px rgba(99,102,241,.15)}

/* 日期范围按钮 */
.mf-date-grid{display:flex;gap:8px;flex-wrap:wrap}
.mf-date-btn{padding:8px 14px;border-radius:10px;background:rgba(var(--mf-ink),.04);border:1px solid rgba(var(--mf-ink),.06);color:rgba(var(--mf-ink),.6);font-size:12px;cursor:pointer;transition:all .2s}
.mf-date-btn:hover{background:rgba(var(--mf-ink),.08);color:rgba(var(--mf-ink),.9)}
.mf-date-btn.active{background:var(--theme-accent);color:rgb(var(--mf-ink));border-color:var(--theme-accent)}

/* 自定义日期选择 */
.mf-custom-date-row{display:flex;align-items:center;gap:12px;margin-top:12px}
.mf-date-input{padding:10px 14px;border-radius:10px;background:rgba(0,0,0,.3);border:1px solid rgba(var(--mf-ink),.08);color:rgb(var(--mf-ink));font-size:13px;font-family:inherit;outline:none;cursor:pointer}
.mf-date-input:focus{border-color:var(--theme-accent)}
.mf-date-input::-webkit-calendar-picker-indicator{filter:invert(1);opacity:.5;cursor:pointer}
.mf-custom-date-row span{color:rgba(var(--mf-ink),.4);font-size:13px}

/* 情绪类型筛选 */
.mf-emotion-filter-grid{display:flex;gap:8px;flex-wrap:wrap}
.mf-emotion-filter-btn{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(var(--mf-ink),.04);border:1px solid rgba(var(--mf-ink),.06);color:rgba(var(--mf-ink),.6);font-size:12px;cursor:pointer;transition:all .2s}
.mf-emotion-filter-btn:hover{background:rgba(var(--mf-ink),.08);transform:scale(1.05)}
.mf-emotion-filter-btn.active{background:rgba(99,102,241,.2);border-color:var(--theme-accent);box-shadow:0 0 10px rgba(99,102,241,.3)}
.mf-emotion-filter-btn span{font-size:18px}

/* 情绪强度筛选 */
.mf-intensity-grid{display:flex;gap:8px;flex-wrap:wrap}
.mf-intensity-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;background:rgba(var(--mf-ink),.04);border:1px solid rgba(var(--mf-ink),.06);color:rgba(var(--mf-ink),.6);font-size:12px;cursor:pointer;transition:all .2s}
.mf-intensity-btn:hover{background:rgba(var(--mf-ink),.08);color:rgba(var(--mf-ink),.9)}
.mf-intensity-btn.active{background:var(--theme-accent);color:rgb(var(--mf-ink));border-color:var(--theme-accent)}
.mf-intensity-icon{font-size:16px}

/* 清除筛选 */
.mf-filter-clear-row{display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid rgba(var(--mf-ink),.06);margin-top:16px}
.mf-clear-filter-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;background:rgba(255,100,100,.08);border:1px solid rgba(255,100,100,.15);color:rgba(255,100,100,.8);font-size:12px;cursor:pointer;transition:all .2s}
.mf-clear-filter-btn:hover{background:rgba(255,100,100,.15);color:#ff6b6b}
.mf-clear-filter-btn svg{width:14px;height:14px}
.mf-filter-stats{font-size:12px;color:rgba(var(--mf-ink),.4)}

/* 搜索高亮 */
.mf-highlight{background:rgba(255,217,61,.3);color:#FFD93D;padding:1px 3px;border-radius:3px}

/* 记录列表容器 */
.mf-entries-list{animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}

`;
    document.head.appendChild(s);
  }
  onClose() {
    if (this.mfStopVoice) this.mfStopVoice(true);
    if (this.cleanupDrag) {
      this.cleanupDrag();
    }
    if (this.ambientMusic) {
      this.ambientMusic.stop();
      this.musicPlaying = false;
    }
    this.contentEl.empty();
  }
};
// ===== 弹窗里的新三屏：首页（手帐 / 电台 / 色谱；光球保留原首页再加一块控制区）、语音对话、记下这条 =====
var MF_MIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
var MF_STOP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>';
var MF_KEYS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/></svg>';
var MF_NOTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
var MF_PHASE = { connecting: "正在连接…", listening: "正在听", thinking: "在想…", speaking: "在说", error: "没连上" };
var MF_DEFAULT_ORDER = ["happy", "calm", "neutral", "anxious", "sad", "angry"];

var MF_MODAL = {
  mfEmo(k) { var all = this.plugin.getAllEmotions(); return all[k] || all.neutral || emotions.neutral; },
  // 首页上摆出来的情绪：按用户排过的顺序，内置 + 自定义，取前六个，当前选中的一定在里面
  mfKeys() {
    var all = this.plugin.getAllEmotions(), keys = Object.keys(all), saved = this.plugin.settings.emotionOrder;
    var order = Array.isArray(saved) ? saved.filter(function(k) { return all[k]; }) : [];
    MF_DEFAULT_ORDER.concat(keys).forEach(function(k) { if (all[k] && order.indexOf(k) < 0) order.push(k); });
    var top = order.slice(0, 6);
    if (top.indexOf(this.emotion) < 0 && all[this.emotion]) top[5] = this.emotion;
    return top;
  },
  mfToday() {
    var t = (0, import_obsidian.moment)().format("YYYY-MM-DD");
    return (this.entries || []).filter(function(e) { return String(e.timestamp || "").slice(0, 10) === t; })
      .sort(function(a, b) { return String(a.timestamp).localeCompare(String(b.timestamp)); });
  },
  mfTodayLines(n) {
    var self = this, list = this.mfToday().slice(-n);
    if (!list.length) return "";
    return list.map(function(e) { var i = self.mfEmo(e.emotion); return { time: String(e.timestamp).slice(11, 16), name: i.name, color: i.color, n: e.intensity, text: String(e.text || "").split("\n")[0].slice(0, 24) }; });
  },
  mfIcon(k) { var i = this.mfEmo(k); return emotionIcons[i.icon] || emotionIcons.neutral; },
  mfLvl() { return mfClampInt(this.intensity, 1, 10, 5); },

  // —— 光球：保留原来的球，下面加名字、情绪、强度、说话按钮 ——
  mfOrbPanel(main) {
    var wrap = main.querySelector(".mf-orb-wrap"); if (!wrap) return;
    var self = this, c = this.mfEmo(this.emotion), lvl = this.mfLvl();
    var p = wrap.createDiv({ cls: "mf-a-panel" });
    p.innerHTML = '<div class="mf-a-name">' + mfEsc(c.name) + '</div><div class="mf-a-word">' + mfEsc(this.gentleWord || "") + "</div>" +
      '<div class="mf-a-chips">' + this.mfKeys().map(function(k) { var e = self.mfEmo(k); return '<button type="button" data-act="emo" data-k="' + mfEsc(k) + '" class="' + (k === self.emotion ? "on" : "") + '" style="--c:' + e.color + '"><i></i>' + mfEsc(e.name) + "</button>"; }).join("") + "</div>" +
      '<label class="mf-a-lvl">强度<input type="range" min="1" max="10" step="1" value="' + lvl + '" data-input="lvl" style="--p:' + ((lvl - 1) / 9 * 100) + '%"><b>' + lvl + "</b></label>" +
      '<div class="mf-a-acts"><button type="button" class="mf-a-mic" data-act="voice"><span>' + MF_MIC + '</span>说说看</button><button type="button" class="mf-a-write" data-act="write">或者写一句</button></div>';
  },

  // —— 手帐 / 电台 / 色谱的首页 ——
  mfHome(main, style) {
    var self = this, c = this.mfEmo(this.emotion), lvl = this.mfLvl(), now = (0, import_obsidian.moment)(), keys = this.mfKeys(), today = this.mfTodayLines(3);
    var root = main.createDiv({ cls: "mf-home mf-home-" + style });
    root.style.setProperty("--emo", c.color);
    var music = '<button type="button" class="mf-music-mini' + (this.musicPlaying ? " on" : "") + '" data-act="music" aria-label="轻音乐">' + MF_NOTE + "</button>";
    if (style === "journal") {
      root.innerHTML = '<i class="mf-j-tape"></i><div class="mf-j-head"><h4>此刻的心情</h4>' + music + '<div class="mf-j-stamp">' + now.format("YYYY.MM.DD") + "<small>" + MF_WD_EN[now.day()] + "</small></div></div>" +
        '<div class="mf-j-stk">' + keys.map(function(k) { var e = self.mfEmo(k); return '<button type="button" data-act="emo" data-k="' + mfEsc(k) + '" class="' + (k === self.emotion ? "on" : "") + '" style="--c:' + e.color + '"><span>' + self.mfIcon(k) + "</span>" + mfEsc(e.name) + "</button>"; }).join("") + "</div>" +
        '<div class="mf-j-scale"><em>强度</em>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(n) { return '<button type="button" data-act="lvl" data-n="' + n + '" class="' + (n === lvl ? "on" : "") + '">' + n + "</button>"; }).join("") + "</div>" +
        '<button type="button" class="mf-j-write" data-act="write">' + (this.text ? mfEsc(this.text.slice(0, 40)) : "写一句，或者直接说……") + "</button>" +
        '<button type="button" class="mf-j-rec" data-act="voice"><span>' + MF_MIC + "</span>说给本子听</button>" +
        '<div class="mf-j-today">' + (today ? today.map(function(t) { return '<div><i style="--c:' + t.color + '"></i>' + t.time + " " + mfEsc(t.name) + (t.n ? " " + t.n : "") + (t.text ? " · " + mfEsc(t.text) : "") + "</div>"; }).join("") : "<div>今天还没记过</div>") + "</div>";
    } else if (style === "radio") {
      var fm = function(i) { return (88 + i * 3.9).toFixed(1); }, idx = Math.max(0, keys.indexOf(this.emotion)), last = today && today[today.length - 1];
      root.innerHTML = '<div class="mf-r-top"><b>MOOD FM</b><span class="mf-r-onair">ON AIR</span><span class="mf-r-clock">' + now.format("HH:mm") + "</span>" + music + "</div>" +
        '<div class="mf-r-lcd"><div class="fm"><b>' + fm(idx) + "</b><span>" + mfEsc(c.name) + '</span></div><div class="tick">今天已播 ' + this.mfToday().length + " 段" + (last ? " · 最近 " + last.time + " " + mfEsc(last.name) : "") + " · " + mfEsc(this.gentleWord || "") + "</div></div>" +
        '<div class="mf-r-dial"><div class="ticks"></div><div class="needle" style="left:' + (8 + idx * 16.8) + '%"></div>' + keys.map(function(k, i) { var e = self.mfEmo(k); return '<button type="button" class="st" data-act="emo" data-k="' + mfEsc(k) + '" style="left:' + (8 + i * 16.8) + '%"><b>' + fm(i) + "</b>" + mfEsc(e.name) + "</button>"; }).join("") + "</div>" +
        '<div class="mf-r-row"><div class="mf-r-knob"><button type="button" data-act="lvlDown" aria-label="减小强度">−</button><div class="k" style="--v:' + lvl + '"><i></i></div><button type="button" data-act="lvlUp" aria-label="加大强度">+</button><div class="lab">音量<b>' + lvl + "</b>强度</div></div>" +
        '<button type="button" class="mf-r-mic" data-act="voice">' + MF_MIC + "开麦</button></div>" +
        '<div class="mf-r-list">' + (today ? today.map(function(t) { return "<span><i>" + t.time + "</i>" + mfEsc(t.name) + (t.n ? " · " + t.n : "") + "</span>"; }).join("") : "<span>今天还没开播</span>") + "</div>" +
        '<button type="button" class="mf-r-type" data-act="write">TYPE · 写一句 ›</button>';
    } else {
      var code = "PL-" + mfPad(Math.max(0, keys.indexOf(this.emotion)) + 1);
      var band = this.mfToday().map(function(e) { var m = (0, import_obsidian.moment)(e.timestamp), x = (m.hours() * 60 + m.minutes()) / 1440 * 100; return '<i style="left:' + x.toFixed(2) + "%;background:" + self.mfEmo(e.emotion).color + '"></i>'; }).join("");
      var nowX = ((now.hours() * 60 + now.minutes()) / 1440 * 100).toFixed(2);
      root.innerHTML = '<div class="mf-p-top"><span>MOOD SPECTRUM</span><span>' + now.format("MM.DD") + " " + MF_WD_EN[now.day()] + " " + now.format("HH:mm") + "</span>" + music + "</div>" +
        '<div class="mf-p-chip"><span class="code">' + code + " · 此刻</span><b>" + mfEsc(c.name) + '</b><div class="sub"><span>强度 ' + lvl + ' / 10</span><span class="sq">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(n) { return '<button type="button" data-act="lvl" data-n="' + n + '" class="' + (n <= lvl ? "f" : "") + '" aria-label="强度 ' + n + '"></button>'; }).join("") + "</span></div></div>" +
        '<div class="mf-p-band"><div class="bar">' + band + '<i class="now" style="left:' + nowX + '%"></i></div><div class="lab"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div></div>' +
        '<div class="mf-p-sw">' + keys.map(function(k) { var e = self.mfEmo(k); return '<button type="button" data-act="emo" data-k="' + mfEsc(k) + '" class="' + (k === self.emotion ? "on" : "") + '" style="--c:' + e.color + '"><i></i><span>' + mfEsc(e.name) + "</span></button>"; }).join("") + "</div>" +
        '<div class="mf-p-acts"><button type="button" class="say" data-act="voice">说出来<svg viewBox="0 0 34 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 7h6l2-5 3 10 3-8 3 6 2-3h15"/></svg></button><button type="button" class="write" data-act="write">写一句</button></div>';
    }
  },

  // —— 语音对话 ——
  mfVoiceScreen(main, style) {
    var vt = this.vt || {}, root = main.createDiv({ cls: "mf-v mf-v-" + style });
    var ctl = function(mute, end, type) { return '<div class="mf-v-ctl"><button type="button" data-act="mute" class="mute">' + mute + '</button><button type="button" data-act="end" class="end">' + end + '</button><button type="button" data-act="type" class="type">' + type + "</button></div>"; };
    var err = '<div class="mf-v-err" data-v="err"></div>';
    var rec = '<div class="mf-v-rec" data-v="rec"></div>';
    if (style === "orb") {
      root.innerHTML = '<div class="mf-v-top"><span class="pill" data-v="status"></span><time data-v="timer">00:00</time></div>' +
        '<div class="mf-v-viz" data-act="interrupt"><canvas data-v="viz" width="600" height="600"></canvas></div>' +
        '<div class="mf-v-caps"><div class="you" data-v="you"></div><div class="ai" data-v="ai"></div></div>' + err + rec +
        ctl(MF_MIC, MF_STOP, MF_KEYS) + '<div class="mf-v-meta" data-v="meta">ElevenLabs · 对话内容不保存</div>';
    } else if (style === "journal") {
      root.innerHTML = '<div class="mf-j-head"><h4>我们聊聊</h4><div class="mf-j-stamp">' + (0, import_obsidian.moment)().format("HH:mm") + "<small>LIVE</small></div></div>" +
        '<svg class="mf-v-pen" data-act="interrupt" viewBox="0 0 360 46" preserveAspectRatio="none"><path data-v="pen" d="M0 23 L360 23"/></svg>' +
        '<span class="mf-v-tag"><span data-v="status"></span><time data-v="timer">00:00</time></span>' +
        '<div class="mf-v-talk" data-v="talk"></div>' + err + rec +
        ctl("<span>" + MF_MIC + "</span>静音", "<span>" + MF_STOP + "</span>聊完了", "<span>" + MF_KEYS + "</span>改写字") + '<div class="mf-v-meta" data-v="meta">ElevenLabs · 对话内容不保存</div>';
    } else if (style === "radio") {
      root.innerHTML = '<div class="mf-r-top"><b>MOOD FM</b><span class="mf-r-onair live">ON AIR</span><span class="mf-r-clock">ElevenLabs</span></div>' +
        '<div class="mf-v-vus" data-act="interrupt"><div class="vu"><div class="scale"></div><i class="ndl" data-v="vuYou"></i><b>YOU</b></div><div class="vu"><div class="scale"></div><i class="ndl" data-v="vuAi"></i><b>HOST</b></div></div>' +
        '<div class="mf-v-lcd"><div class="st"><span data-v="status"></span><span data-v="timer">00:00</span></div><div class="you" data-v="you"></div><div class="ai" data-v="ai"></div></div>' + err + rec +
        ctl(MF_MIC + "MUTE", MF_STOP + "OFF AIR", MF_KEYS + "TYPE") + '<div class="mf-v-meta" data-v="meta">对话内容不保存</div>';
    } else {
      root.innerHTML = '<div class="mf-v-top"><span data-v="status"></span><span><span data-v="timer">00:00</span> · ELEVENLABS</span></div>' +
        '<div class="mf-v-wave" data-act="interrupt"><canvas data-v="viz" width="840" height="300"></canvas></div>' +
        '<div class="mf-v-qa"><p class="ai"><span class="who">它 —</span><span data-v="ai"></span></p><p class="you"><span class="who">你 —</span><span data-v="you"></span></p></div>' + err + rec +
        '<div class="mf-v-ctl"><button type="button" data-act="mute" class="mute">静音</button><button type="button" data-act="type" class="type">打字</button><button type="button" data-act="end" class="end">结束</button></div><div class="mf-v-meta" data-v="meta">对话内容不保存</div>';
    }
    this.mfVoiceUpdate();
  },
  // 只改变化的文字，不重画整屏
  mfVoiceUpdate() {
    var vt = this.vt; if (!vt || this.state !== "voice") return;
    var el = this.contentEl, set = function(sel, html) { el.querySelectorAll(sel).forEach(function(x) { if (x.__h !== html) { x.__h = html; x.innerHTML = html; } }); };
    var root = el.querySelector(".mf-v"); if (root) root.setAttribute("data-ph", vt.err ? "error" : vt.phase);
    set('[data-v="status"]', mfEsc(vt.err ? MF_PHASE.error : MF_PHASE[vt.phase] || ""));
    set('[data-v="you"]', mfEsc(vt.you || ""));
    set('[data-v="ai"]', mfEsc(vt.ai || ""));
    set('[data-v="talk"]', (vt.lines || []).slice(-4).map(function(l) { return '<p class="' + l.who + '">' + mfEsc(l.text) + "</p>"; }).join("") || '<p class="ai">' + mfEsc(vt.phase === "connecting" ? "正在接通……" : "") + "</p>");
    set('[data-v="err"]', vt.err ? mfEsc(vt.err) + '<div><button type="button" data-act="retry">再试一次</button><button type="button" data-act="back">返回</button></div>' : "");
    set('[data-v="rec"]', vt.rec ? "记录卡已备好：" + mfEsc(this.mfEmo(vt.rec.emotion).name) + " · " + vt.rec.intensity + "　聊完点结束去确认" : "");
    set('[data-v="meta"]', vt.phase === "speaking" && this.voice && this.voice.halfDuplex ? "外放防回声已开：点" + (mfStyle(this.plugin.settings) === "radio" ? "表盘" : "画面") + "可以打断" : (mfStyle(this.plugin.settings) === "orb" || mfStyle(this.plugin.settings) === "journal" ? "ElevenLabs · " : "") + "对话内容不保存");
    el.querySelectorAll('[data-act="mute"]').forEach(function(b) { b.classList.toggle("on", !!vt.muted); });
  },
  mfStartVoice() {
    var self = this;
    this.mfStopVoice(true);
    this.state = "voice";
    this.vt = { phase: "connecting", lines: [], you: "", ai: "", err: "", rec: null, muted: false, t0: Date.now() };
    this.mfMusicWas = this.musicPlaying;
    if (this.musicPlaying) { this.ambientMusic.stop(); this.musicPlaying = false; }
    this.render();
    var sess = new MfVoiceSession(this.plugin, {
      onPhase: function(p) { if (self.voice !== sess) return; self.vt.phase = p; self.mfVoiceUpdate(); },
      onYou: function(t) { if (self.voice !== sess) return; self.vt.you = t; self.vt.lines.push({ who: "you", text: t }); self.mfVoiceUpdate(); },
      onAi: function(t) { if (self.voice !== sess) return; self.vt.ai = t; self.vt.lines.push({ who: "ai", text: t }); self.mfVoiceUpdate(); },
      onRecord: function(r) { if (self.voice !== sess) return; self.vt.rec = r; self.mfVoiceUpdate(); },
      onEnd: function(reason, err) { if (self.voice !== sess) return; if (err && !self.vt.rec) { self.vt.err = err; self.mfVoiceUpdate(); } else self.mfFinishVoice(); }
    });
    this.voice = sess;
    var now = (0, import_obsidian.moment)();
    sess.start({ today: now.format("YYYY-MM-DD") + " " + MF_WD[now.day()], today_moods: mfTodayMoods(this.plugin, this.entries) })
      .catch(function(e) { if (self.voice !== sess) return; sess.stop(); self.vt.err = (e && e.message) || "没连上"; self.mfVoiceUpdate(); });
    this.mfVizLoop();
  },
  mfStopVoice(keepMusic) {
    if (this.voice) { this.voice.stop(); this.voice = null; }
    if (this.mfRaf) { cancelAnimationFrame(this.mfRaf); this.mfRaf = 0; }
    if (!keepMusic && this.mfMusicWas && !this.musicPlaying && this.ambientMusic) { this.ambientMusic.start(); this.musicPlaying = true; }
    if (!keepMusic) this.mfMusicWas = false;
  },
  // 聊完：有记录卡就去确认，没有就回首页
  mfFinishVoice() {
    var vt = this.vt || {}, secs = Math.round((Date.now() - (vt.t0 || Date.now())) / 1000);
    this.mfStopVoice();
    if (vt.rec) { this.pending = Object.assign({ secs: secs }, vt.rec); this.state = "confirm"; }
    else { this.state = "orb"; new import_obsidian.Notice(vt.lines && vt.lines.length ? "这次没有整理出记录，想记的话可以写一句" : "对话结束了"); }
    this.render();
  },
  // 动画：光球 / 笔迹 / 表针 / 细线，跟着麦克风和 AI 的音量动
  mfVizLoop() {
    var self = this, hist = new Array(90).fill(0), smooth = 0;
    var tick = function(ms) {
      if (self.state !== "voice") { self.mfRaf = 0; return; }
      var vt = self.vt || {}, v = self.voice, ph = vt.err ? "error" : vt.phase;
      var you = v ? v.level("in") : 0, ai = v ? v.level("out") : 0, speak = ph === "speaking";
      var amp = speak ? ai : you; smooth += (amp - smooth) * 0.3;
      var timer = self.contentEl.querySelectorAll('[data-v="timer"]'), secs = Math.floor((Date.now() - (vt.t0 || Date.now())) / 1000);
      timer.forEach(function(t) { var s = mfPad(Math.floor(secs / 60)) + ":" + mfPad(secs % 60); if (t.textContent !== s) t.textContent = s; });
      var style = mfStyle(self.plugin.settings), c = self.mfEmo(self.emotion).color;
      var cv = self.contentEl.querySelector('canvas[data-v="viz"]');
      if (cv && style === "orb") mfDrawOrb(cv, ph, smooth, ms, speak ? "#9fd8ff" : c);
      if (cv && style === "spectrum") mfDrawLine(cv, ph, smooth, ms, speak ? c : "#111111");
      if (style === "journal") {
        hist.push(ph === "listening" || speak ? smooth : 0.02); hist.shift();
        var pen = self.contentEl.querySelector('[data-v="pen"]');
        if (pen) pen.setAttribute("d", hist.map(function(x, i) { return (i ? "L" : "M") + (i * 4).toFixed(1) + " " + (23 + Math.sin(i * 1.9 + ms / 90) * Math.min(1, x * 1.6) * 20).toFixed(1); }).join(" "));
      }
      if (style === "radio") {
        var ny = self.contentEl.querySelector('[data-v="vuYou"]'), na = self.contentEl.querySelector('[data-v="vuAi"]');
        if (ny) ny.style.rotate = (-50 + Math.min(1, you * 1.4) * 95) + "deg";
        if (na) na.style.rotate = (-50 + Math.min(1, ai * 1.4) * 95) + "deg";
      }
      self.mfRaf = requestAnimationFrame(tick);
    };
    if (this.mfRaf) cancelAnimationFrame(this.mfRaf);
    this.mfRaf = requestAnimationFrame(tick);
  },

  // —— 记下这条 ——
  mfConfirmScreen(main, style) {
    var self = this, p = this.pending || { emotion: this.emotion, intensity: 5, note: "" }, c = this.mfEmo(p.emotion), d = (0, import_obsidian.moment)();
    var lvlRow = function(cls) { return '<div class="' + cls + '">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(n) { return '<button type="button" data-act="plvl" data-n="' + n + '" class="' + (n <= p.intensity ? "f" : "") + (n === p.intensity ? " cur" : "") + '" aria-label="强度 ' + n + '">' + (cls === "mf-c-scale" ? n : "") + "</button>"; }).join("") + "</div>"; };
    var note = '<textarea class="mf-c-note" data-input="note" rows="4" placeholder="写一句这一刻的感受">' + mfEsc(p.note) + "</textarea>";
    var emoji = c.emoji || iconEmojiMap[c.icon] || "📝";
    var line = this.plugin.plEmotionLine({ emotion: p.emotion, intensity: p.intensity, text: p.note }, d, c, emoji);
    var dest = '<div class="mf-c-dest">会写进 ' + d.format("MM-DD") + " 日记 ·「今日情绪」<br>" + mfEsc(line.length > 46 ? line.slice(0, 46) + "…" : line) + "</div>";
    var dur = p.secs ? "这次聊了 " + Math.floor(p.secs / 60) + " 分 " + (p.secs % 60) + " 秒" : "";
    var root = main.createDiv({ cls: "mf-c mf-c-" + style });
    root.style.setProperty("--emo", c.color);
    if (style === "orb") {
      root.innerHTML = '<div class="mf-c-sorb"></div><div class="mf-c-ttl">我帮你记下这一刻</div><div class="mf-c-glass"><div class="mf-c-row"><b>' + mfEsc(c.name) + "</b></div>" + lvlRow("mf-c-dots") + '<div class="mf-c-lab">强度 ' + p.intensity + " / 10</div>" + note + "</div>" + dest +
        '<div class="mf-c-acts"><button type="button" class="pri" data-act="save">记下</button><button type="button" class="sec" data-act="edit">改一改</button></div><button type="button" class="mf-c-skip" data-act="skip">这次不记</button><div class="mf-c-meta">' + dur + "</div>";
    } else if (style === "journal") {
      root.innerHTML = '<div class="mf-j-head"><h4>贴上这一页</h4><div class="mf-j-stamp">' + d.format("HH:mm") + "<small>" + MF_WD_EN[d.day()] + "</small></div></div>" +
        '<div class="mf-c-stk"><i class="tp"></i><div class="disc"><span>' + this.mfIcon(p.emotion) + "</span><b>" + mfEsc(c.name) + "</b><small>强度 " + p.intensity + '</small></div><div class="ok">记下了</div></div>' +
        lvlRow("mf-c-scale") + note + dest +
        '<div class="mf-c-acts"><button type="button" class="pri" data-act="save">贴上去</button><button type="button" class="sec" data-act="edit">改一改</button><button type="button" class="sec" data-act="skip">不贴了</button></div><div class="mf-c-meta">' + dur + "</div>";
    } else if (style === "radio") {
      var keys = this.mfKeys(), i = Math.max(0, keys.indexOf(p.emotion));
      root.innerHTML = '<div class="mf-r-top"><b>MOOD FM</b><span class="mf-r-onair">ON AIR</span><span class="mf-r-clock">' + (p.secs ? Math.floor(p.secs / 60) + ":" + mfPad(p.secs % 60) : "") + "</span></div>" +
        '<div class="mf-c-jcard"><div class="stripe"></div><div class="in"><div class="h"><span>SIDE A · ' + d.format("MM.DD") + "</span><span>" + d.format("HH:mm") + '</span></div><div class="t"><b>' + mfEsc(c.name) + "</b><span>FM " + (88 + i * 3.9).toFixed(1) + " · VOL " + p.intensity + "</span></div>" + lvlRow("mf-c-vol") + note + "</div></div>" + dest +
        '<div class="mf-c-acts"><button type="button" class="pri" data-act="save">收进节目单</button><button type="button" class="sec" data-act="edit">改一改</button></div><button type="button" class="mf-c-skip" data-act="skip">这段不录</button>';
    } else {
      var code = "PL-" + mfPad(Math.max(0, this.mfKeys().indexOf(p.emotion)) + 1) + " · " + d.format("MMDD") + " · " + d.format("HHmm");
      root.innerHTML = '<div class="mf-p-top"><span>NEW SWATCH</span><span>' + (p.secs ? "聊了 " + Math.floor(p.secs / 60) + ":" + mfPad(p.secs % 60) : "") + "</span></div>" +
        '<div class="mf-c-pcard"><div class="blk"><b>' + mfEsc(c.name) + '</b></div><div class="inf"><div class="t"><span>' + code + "</span><span>" + p.intensity + " / 10</span></div>" + lvlRow("mf-c-sq") + note + "</div></div>" + dest +
        '<div class="mf-c-acts"><button type="button" class="pri" data-act="save">收进色谱</button><button type="button" class="sec" data-act="edit">改一改</button></div><button type="button" class="mf-c-skip" data-act="skip">这次不记</button>';
    }
  },
  async mfSavePending() {
    var p = this.pending; if (!p) return;
    var entry = { id: Date.now(), text: String(p.note || "").trim(), emotion: p.emotion, intensity: p.intensity, timestamp: new Date().toISOString() };
    if (this.plugin.settings.customSaveFile) {
      var file = this.app.vault.getAbstractFileByPath(this.plugin.settings.customSaveFile);
      if (file instanceof import_obsidian.TFile) await this.plugin.saveEntryToFile(entry, file, this.plugin.settings.customSaveHeading);
      else await this.plugin.saveEntry(entry);
    } else await this.plugin.saveEntry(entry);
    this.pending = null;
    this.entries = await this.plugin.getEntries();
    this.emotion = entry.emotion;
    if (["sad", "angry", "anxious"].indexOf(entry.emotion) >= 0) { this.state = "orb"; this.render(); this.showSedonaPrompt(); }
    else { this.state = "orb"; this.text = ""; this.render(); }
  },

  // —— 点击统一处理 ——
  mfBind(main) {
    var self = this;
    main.addEventListener("click", function(e) {
      var b = e.target.closest("[data-act]"); if (!b || !main.contains(b)) return;
      var a = b.getAttribute("data-act"), k = b.getAttribute("data-k"), n = +b.getAttribute("data-n");
      if (a === "emo") { self.emotion = k; self.pickGentleWord(); self.render(); }
      else if (a === "lvl") { self.intensity = n; self.render(); }
      else if (a === "lvlUp" || a === "lvlDown") { self.intensity = mfClampInt(self.mfLvl() + (a === "lvlUp" ? 1 : -1), 1, 10, 5); self.render(); }
      else if (a === "write") { self.state = "input"; self.pickGentleWord(); self.render(); }
      else if (a === "voice" || a === "retry") self.mfStartVoice();
      else if (a === "music") { self.musicPlaying = self.ambientMusic.toggle(); self.plugin.settings.musicEnabled = self.musicPlaying; self.plugin.saveSettings(); self.render(); }
      else if (a === "end") { if (self.vt && self.vt.err) { self.mfStopVoice(); self.state = "orb"; self.render(); } else self.mfFinishVoice(); }
      else if (a === "back") { self.mfStopVoice(); self.state = "orb"; self.render(); }
      else if (a === "mute") { if (self.voice) { self.vt.muted = !self.vt.muted; self.voice.setMuted(self.vt.muted); self.mfVoiceUpdate(); } }
      else if (a === "interrupt") { if (self.voice && self.vt && self.vt.phase === "speaking") self.voice.interrupt(); }
      else if (a === "type") {
        var vt = self.vt || {}, lastYou = (vt.lines || []).filter(function(l) { return l.who === "you"; }).pop();
        self.mfStopVoice();
        self.text = vt.rec ? vt.rec.note : lastYou ? lastYou.text : "";
        if (vt.rec) { self.emotion = vt.rec.emotion; self.intensity = vt.rec.intensity; }
        self.state = "input"; self.render();
      }
      else if (a === "plvl") { if (self.pending) { self.pending.intensity = n; self.render(); } }
      else if (a === "save") { b.setAttribute("disabled", ""); self.mfSavePending(); }
      else if (a === "edit") { var p = self.pending || {}; self.text = p.note || ""; self.emotion = p.emotion || self.emotion; self.intensity = p.intensity || 5; self.pending = null; self.state = "input"; self.render(); }
      else if (a === "skip") { self.pending = null; self.state = "orb"; self.render(); }
    });
    main.addEventListener("input", function(e) {
      var k = e.target.getAttribute && e.target.getAttribute("data-input");
      if (k === "lvl") { self.intensity = +e.target.value; var w = e.target.parentElement.querySelector("b"); if (w) w.textContent = e.target.value; e.target.style.setProperty("--p", ((e.target.value - 1) / 9 * 100) + "%"); }
      if (k === "note" && self.pending) self.pending.note = e.target.value;
    });
  },

  // 「主题」页上方：选界面风格；语音是否已设置
  mfStylePicker(sc) {
    var self = this, cur = mfStyle(this.plugin.settings);
    var box = document.createElement("div");
    box.innerHTML = '<div class="mf-set-l">界面风格</div><div class="mf-sp-grid">' + MF_STYLES.map(function(st) { return '<button type="button" class="mf-sp' + (st[0] === cur ? " on" : "") + '" data-style="' + st[0] + '"><i class="mf-sp-pre mf-sp-' + st[0] + '"></i><b>' + st[1] + "</b><small>" + st[2] + "</small></button>"; }).join("") + "</div>" +
      '<div class="mf-set-l mt">语音对话</div><div class="mf-voice-row"><span data-v="vkey">检查中…</span><button type="button" data-open-settings>去设置</button></div>';
    sc.insertBefore(box, sc.firstChild);
    box.querySelectorAll("[data-style]").forEach(function(b) { b.onclick = async function() { self.plugin.settings.uiStyle = b.getAttribute("data-style"); await self.plugin.saveSettings(); self.render(); }; });
    box.querySelector("[data-open-settings]").onclick = function() { try { self.app.setting.open(); self.app.setting.openTabById(self.plugin.manifest.id); } catch (e) {} };
    this.plugin.mfElevenKey().then(function(k) { var el = box.querySelector('[data-v="vkey"]'); if (el) el.textContent = k ? "已填好 ElevenLabs API Key，首页点麦克风就能聊" : "还没填 ElevenLabs API Key"; });
  }
};
Object.assign(MoodflowModal.prototype, MF_MODAL);

// 颜色统一成 #rrggbb，画布渐变要在后面拼透明度
function mfHex(c) { c = String(c || ""); if (/^#[0-9a-f]{6}$/i.test(c)) return c; if (/^#[0-9a-f]{3}$/i.test(c)) return "#" + c.slice(1).split("").map(function(x) { return x + x; }).join(""); return "#95E1D3"; }
// 光球：极坐标下随声音变形的光斑
function mfDrawOrb(cv, ph, amp, ms, color) {
  color = mfHex(color);
  var g = cv.getContext("2d"), W = cv.width, H = cv.height, cx = W / 2, cy = H / 2, s = ms / 1000, base = W * 0.2;
  var ai = ph === "speaking" ? amp : 0, you = ph === "listening" ? amp : 0;
  var R = base * (1 + Math.sin(s * 1.25) * 0.04 + ai * 0.45 - you * 0.08);
  g.clearRect(0, 0, W, H);
  var HR = Math.min(R * 2.3, W * 0.49), halo = g.createRadialGradient(cx, cy, R * 0.4, cx, cy, HR); halo.addColorStop(0, color + "88"); halo.addColorStop(1, color + "00");
  g.fillStyle = halo; g.beginPath(); g.arc(cx, cy, HR, 0, Math.PI * 2); g.fill();
  g.beginPath();
  for (var a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 90) {
    var r = R * (1 + Math.sin(a * 3 + s * 1.7) * 0.05 + Math.sin(a * 5 - s * 2.3) * 0.04 * (0.4 + ai * 2.5) + Math.sin(a * 7 + s * 4.1) * 0.03 * you * 2.5);
    var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; if (a === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  var body = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R * 1.1);
  body.addColorStop(0, "#ffffff"); body.addColorStop(0.35, color); body.addColorStop(1, color + "33");
  g.fillStyle = body; g.fill();
  if (ph === "listening") for (var k = 0; k < 3; k++) { var p = (s * 0.9 + k / 3) % 1; g.strokeStyle = "rgba(255,255,255," + ((1 - p) * (0.12 + Math.min(1, you * 2) * 0.6)).toFixed(3) + ")"; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R * (0.3 + p * 0.65), 0, Math.PI * 2); g.stroke(); }
  if (ph === "thinking" || ph === "connecting") { g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2.5; g.lineCap = "round"; g.beginPath(); g.arc(cx, cy, R * 1.25, s * 3, s * 3 + 1.2); g.stroke(); }
}
// 色谱：一根细线波形
function mfDrawLine(cv, ph, amp, ms, color) {
  color = mfHex(color);
  var g = cv.getContext("2d"), W = cv.width, H = cv.height, mid = H / 2, s = ms / 1000;
  g.clearRect(0, 0, W, H); g.lineWidth = 3; g.strokeStyle = color; g.beginPath();
  for (var x = 0; x <= W; x += 4) {
    var u = x / W, env = Math.sin(u * Math.PI);
    var y = mid + env * Math.min(1, amp * 1.5) * H * 0.36 * (Math.sin(u * 22 + s * 9) * 0.6 + Math.sin(u * 47 - s * 13) * 0.4) + (ph === "thinking" || ph === "connecting" ? Math.sin(u * 8 + s * 4) * 4 : 0);
    if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.stroke();
}
var MoodflowSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  async display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "情绪追踪器设置" });
    
    new import_obsidian.Setting(containerEl).setName("\u4FDD\u5B58\u6A21\u5F0F").setDesc("\u9009\u62E9\u5FC3\u60C5\u8BB0\u5F55\u7684\u4FDD\u5B58\u65B9\u5F0F").addDropdown((d) => {
      d.addOption("diary", "添加到当日日记");
      d.setValue("diary").onChange(async (v) => {
        this.plugin.settings.saveMode = v;
        await this.plugin.saveSettings();
        await this.display();
      });
    });
    
    const saveMode = "diary";
    
    if (saveMode === "daily" || saveMode === "single") {
      new import_obsidian.Setting(containerEl).setName("\u5FC3\u60C5\u7B14\u8BB0\u76EE\u5F55").setDesc("\u5FC3\u60C5\u8BB0\u5F55\u7684\u5B58\u50A8\u4F4D\u7F6E").addText((t) => t.setValue(this.plugin.settings.savePath).onChange(async (v) => {
        this.plugin.settings.savePath = v || "Emotions";
        await this.plugin.saveSettings();
      }));
    }
    
    if (saveMode === "daily") {
      new import_obsidian.Setting(containerEl).setName("\u65E5\u671F\u683C\u5F0F").setDesc("\u6587\u4EF6\u540D\u65E5\u671F\u683C\u5F0F").addText((t) => t.setValue(this.plugin.settings.dateFormat).onChange(async (v) => {
        this.plugin.settings.dateFormat = v || "YYYY-MM-DD";
        await this.plugin.saveSettings();
      }));
    }
    
    if (saveMode === "diary") {
      new import_obsidian.Setting(containerEl).setName("\u65E5\u8BB0\u76EE\u5F55").setDesc("\u65E5\u8BB0\u6587\u4EF6\u7684\u5B58\u50A8\u4F4D\u7F6E").addText((t) => t.setValue(this.plugin.settings.diaryPath).onChange(async (v) => {
        this.plugin.settings.diaryPath = v || "Daily";
        await this.plugin.saveSettings();
      }));
      new import_obsidian.Setting(containerEl).setName("\u65E5\u8BB0\u6587\u4EF6\u540D\u683C\u5F0F").setDesc("\u65E5\u8BB0\u6587\u4EF6\u540D\u7684\u65E5\u671F\u683C\u5F0F").addText((t) => t.setValue(this.plugin.settings.diaryFormat).onChange(async (v) => {
        this.plugin.settings.diaryFormat = v || "YYYY-MM-DD";
        await this.plugin.saveSettings();
      }));
      new import_obsidian.Setting(containerEl).setName("\u65E5\u8BB0\u6A21\u677F\u8DEF\u5F84").setDesc("\u65E5\u8BB0\u6A21\u677F\u6587\u4EF6\u8DEF\u5F84\uFF08\u7559\u7A7A\u5219\u81EA\u52A8\u8BFB\u53D6 Obsidian \u6838\u5FC3\u65E5\u8BB0\u63D2\u4EF6\u7684\u6A21\u677F\uFF09").addText((t) => t.setPlaceholder("Templates/Daily.md").setValue(this.plugin.settings.diaryTemplatePath || "").onChange(async (v) => {
        this.plugin.settings.diaryTemplatePath = v;
        await this.plugin.saveSettings();
      }));
    }
    
    new import_obsidian.Setting(containerEl).setName("\u8BB0\u5F55\u65F6\u95F4").setDesc("\u5728\u8BB0\u5F55\u4E2D\u663E\u793A\u65F6\u95F4").addToggle((t) => t.setValue(this.plugin.settings.includeTime).onChange(async (v) => {
      this.plugin.settings.includeTime = v;
      await this.plugin.saveSettings();
    }));

    // 自定义保存位置
    containerEl.createEl("h3", { text: "\u81EA\u5B9A\u4E49\u4FDD\u5B58\u4F4D\u7F6E" });
    containerEl.createEl("p", { text: "\u53EF\u4EE5\u9009\u62E9\u4E00\u4E2A\u7279\u5B9A\u7684\u6587\u4EF6\u4F5C\u4E3A\u4FDD\u5B58\u4F4D\u7F6E\uFF08\u53EF\u9009\uFF09", cls: "setting-item-description" });

    new import_obsidian.Setting(containerEl)
      .setName("\u4FDD\u5B58\u6587\u4EF6")
      .setDesc("\u9009\u62E9\u4E00\u4E2A Markdown \u6587\u4EF6\u4F5C\u4E3A\u4FDD\u5B58\u4F4D\u7F6E")
      .addText((t) => {
        t.setPlaceholder("\u4F8B\u5982: \u60C5\u611F\u8BB0\u5F55.md")
          .setValue(this.plugin.settings.customSaveFile || "")
          .onChange(async (v) => {
            this.plugin.settings.customSaveFile = v;
            await this.plugin.saveSettings();
            await this.display();
          });
      });

    if (this.plugin.settings.customSaveFile) {
      const filePath = this.plugin.settings.customSaveFile;
      const file = this.app.vault.getAbstractFileByPath(filePath);

      if (file instanceof import_obsidian.TFile) {
        // 读取文件中的标题
        const content = await this.app.vault.read(file);
        const headings = [];
        const lines = content.split("\n");
        lines.forEach(line => {
          const match = line.match(/^(#{1,6})\s+(.+)$/);
          if (match) {
            headings.push({
              level: match[1].length,
              text: match[2].trim()
            });
          }
        });

        if (headings.length > 0) {
          new import_obsidian.Setting(containerEl)
            .setName("\u4FDD\u5B58\u4F4D\u7F6E\uFF08\u6807\u9898\uFF09")
            .setDesc("\u9009\u62E9\u5728\u6587\u4EF6\u4E2D\u7684\u54EA\u4E2A\u6807\u9898\u4E0B\u4FDD\u5B58")
            .addDropdown((d) => {
              d.addOption("", "\u6587\u4EF6\u672B\u5C3E");
              headings.forEach(heading => {
                d.addOption(heading.text, `${"#".repeat(heading.level)} ${heading.text}`);
              });
              d.setValue(this.plugin.settings.customSaveHeading || "")
                .onChange(async (v) => {
                  this.plugin.settings.customSaveHeading = v;
                  await this.plugin.saveSettings();
                });
            });
        }
      }
    }

    new import_obsidian.Setting(containerEl).setName("\u4E3B\u9898").setDesc("\u9009\u62E9\u4E3B\u9898\u914D\u8272").addDropdown((d) => {
      Object.entries(themes).forEach(([k, v]) => d.addOption(k, v.name));
      d.setValue(this.plugin.settings.theme).onChange(async (v) => {
        this.plugin.settings.theme = v;
        await this.plugin.saveSettings();
      });
    });

    // 自定义情绪管理
    containerEl.createEl("h3", { text: "\u81EA\u5B9A\u4E49\u60C5\u7EEA" });
    containerEl.createEl("p", { text: "\u6DFB\u52A0\u5C5E\u4E8E\u4F60\u81EA\u5DF1\u7684\u60C5\u7EEA\u6807\u7B7E", cls: "setting-item-description" });

    // 显示已有的自定义情绪
    const customEmotions = this.plugin.settings.customEmotions || {};
    Object.entries(customEmotions).forEach(([key, emotion]) => {
      const setting = new import_obsidian.Setting(containerEl)
        .setName(emotion.name)
        .setDesc(`\u56FE\u6807: ${emotion.icon || 'neutral'} | \u989C\u8272: ${emotion.color}`)
        .addButton((btn) => btn.setIcon("pencil").setTooltip("\u7F16\u8F91").onClick(() => {
          new CustomEmotionModal(this.app, this.plugin, key, emotion, async () => await this.display()).open();
        }))
        .addButton((btn) => btn.setIcon("trash").setTooltip("\u5220\u9664").onClick(async () => {
          delete this.plugin.settings.customEmotions[key];
          await this.plugin.saveSettings();
          await this.display();
        }));
      // 添加图标预览
      const iconPreview = setting.nameEl.createSpan({ cls: "mf-setting-icon-preview" });
      iconPreview.innerHTML = emotionIcons[emotion.icon] || emotionIcons.neutral;
      iconPreview.style.cssText = `display: inline-flex; width: 20px; height: 20px; margin-right: 8px; color: ${emotion.color}; vertical-align: middle;`;
      iconPreview.querySelector("svg").style.cssText = "width: 100%; height: 100%;";
      setting.nameEl.prepend(iconPreview);
    });

    // 添加新情绪按钮
    new import_obsidian.Setting(containerEl)
      .setName("\u6DFB\u52A0\u65B0\u60C5\u7EEA")
      .setDesc("\u521B\u5EFA\u4E00\u4E2A\u65B0\u7684\u81EA\u5B9A\u4E49\u60C5\u7EEA\u6807\u7B7E")
      .addButton((btn) => btn.setButtonText("\u6DFB\u52A0").setCta().onClick(() => {
        new CustomEmotionModal(this.app, this.plugin, null, null, async () => await this.display()).open();
      }));
    this.mfVoiceSettings(containerEl);
  }
  // 语音对话（ElevenLabs）：Key 优先放进 Obsidian 的加密存储
  mfVoiceSettings(containerEl) {
    var self = this, s = this.plugin.settings;
    containerEl.createEl("h3", { text: "语音对话（ElevenLabs）" });
    containerEl.createEl("p", { cls: "setting-item-description", text: "填好 ElevenLabs 的 API Key，首页点麦克风就能和 AI 实时聊心情，聊完它会整理成一条情绪记录，你确认后才写进日记。声音和对话会发给 ElevenLabs 和所选模型；对话全文不保存。需要能访问 ElevenLabs 的网络。" });
    var resetAgent = async function() { s.elevenAgentId = ""; s.elevenAgentHash = ""; s.elevenToolId = ""; s.elevenToolHash = ""; await self.plugin.saveSettings(); };
    var keySetting = new import_obsidian.Setting(containerEl).setName("API Key");
    if (import_obsidian.SecretComponent && this.app.secretStorage && typeof keySetting.addComponent === "function") {
      keySetting.setDesc("存在 Obsidian 的加密钥匙串里，不写进插件设置文件。选一个已有的，或新建一个名字填入 Key。");
      keySetting.addComponent(function(el) { return new import_obsidian.SecretComponent(self.app, el).setValue(s.elevenKeyName || "").onChange(async function(v) { s.elevenKeyName = v; await resetAgent(); }); });
    } else {
      keySetting.setDesc("在 elevenlabs.io → Developers → API Keys 里创建。Obsidian 升级到 1.11.4 以上会改存进加密钥匙串。");
      keySetting.addText(function(t) { t.inputEl.type = "password"; t.setPlaceholder("sk_…").setValue(s.elevenApiKey || "").onChange(async function(v) { s.elevenApiKey = v.trim(); await resetAgent(); }); });
    }
    new import_obsidian.Setting(containerEl).setName("模型").setDesc("AI 用哪个模型来理解和回答").addDropdown(function(d) { MF_LLMS.forEach(function(m) { d.addOption(m[0], m[1]); }); d.setValue(s.elevenLlm || MF_LLMS[0][0]).onChange(async function(v) { s.elevenLlm = v; await self.plugin.saveSettings(); }); });
    new import_obsidian.Setting(containerEl).setName("声音").setDesc("ElevenLabs 声音库里的 Voice ID，留空用默认声音").addText(function(t) { t.setPlaceholder("留空 = 默认").setValue(s.elevenVoiceId || "").onChange(async function(v) { s.elevenVoiceId = v.trim(); await self.plugin.saveSettings(); }); });
    new import_obsidian.Setting(containerEl).setName("单次最长").setDesc("到时间会自动结束，避免忘了挂断").addDropdown(function(d) { [5, 10, 15, 20].forEach(function(m) { d.addOption(String(m), m + " 分钟"); }); d.setValue(String(s.voiceMaxMinutes || 10)).onChange(async function(v) { s.voiceMaxMinutes = +v; await self.plugin.saveSettings(); }); });
    new import_obsidian.Setting(containerEl).setName("外放防回声").setDesc("开着时 AI 说话期间暂停收音，点画面可以打断它；戴耳机可以关掉，直接开口就能打断").addToggle(function(t) { t.setValue(s.voiceHalfDuplex !== false).onChange(async function(v) { s.voiceHalfDuplex = v; await self.plugin.saveSettings(); }); });
    new import_obsidian.Setting(containerEl).setName("测试连接").setDesc("检查 Key、建好对话角色").addButton(function(b) { b.setButtonText("测试").onClick(async function() {
      b.setDisabled(true);
      try { var key = await self.plugin.mfElevenKey(); if (!key) throw new Error("还没有填 API Key"); await self.plugin.mfEnsureAgent(key); new import_obsidian.Notice("✅ ElevenLabs 已连通，对话角色已就绪"); }
      catch (e) { new import_obsidian.Notice("❌ " + ((e && e.message) || e), 8000); }
      b.setDisabled(false);
    }); });
  }
};

// 分享卡片弹窗
var ShareCardModal = class extends import_obsidian.Modal {
  constructor(app, plugin, entries, singleEntry, theme) {
    super(app);
    this.plugin = plugin;
    this.entries = entries;
    this.singleEntry = singleEntry;
    this.theme = theme;
    this.cardStyle = "gradient"; // gradient, minimal, polaroid, neon
    this.showDate = true;
    this.showTime = true;
    this.showWatermark = true;
  }
  
  onOpen() {
    this.modalEl.addClass("mf-share-root");
    this.render();
  }
  
  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("mf-share-modal");
    
    const allEmotions = this.plugin.getAllEmotions();
    
    // 获取要分享的记录
    let entriesToShare = [];
    if (this.singleEntry) {
      entriesToShare = [this.singleEntry];
    } else {
      // 默认分享今天的记录
      const today = (0, import_obsidian.moment)().format("YYYY-MM-DD");
      entriesToShare = this.entries.filter(e => (0, import_obsidian.moment)(e.timestamp).format("YYYY-MM-DD") === today);
      if (!entriesToShare.length && this.entries.length) {
        entriesToShare = [this.entries[0]]; // 如果今天没有记录，取最新一条
      }
    }
    
    if (!entriesToShare.length) {
      contentEl.innerHTML = `<div class="mf-share-empty">暂无可分享的记录</div>`;
      return;
    }
    
    // 标题
    const header = contentEl.createDiv({ cls: "mf-share-header" });
    header.createDiv({ cls: "mf-share-title", text: "✨ 生成分享卡片" });
    
    // 样式选择
    const styleSection = contentEl.createDiv({ cls: "mf-share-section" });
    styleSection.createDiv({ cls: "mf-share-label", text: "卡片样式" });
    const styleGrid = styleSection.createDiv({ cls: "mf-style-grid" });
    
    const styles = [
      { id: "gradient", name: "渐变", icon: "🌈" },
      { id: "minimal", name: "简约", icon: "⬜" },
      { id: "polaroid", name: "拍立得", icon: "📷" },
      { id: "neon", name: "霓虹", icon: "💜" }
    ];
    
    styles.forEach(style => {
      const btn = styleGrid.createDiv({ cls: `mf-style-btn ${this.cardStyle === style.id ? "active" : ""}` });
      btn.innerHTML = `<span class="mf-style-icon">${style.icon}</span><span>${style.name}</span>`;
      btn.onclick = () => {
        this.cardStyle = style.id;
        this.render();
      };
    });
    
    // 选项
    const optSection = contentEl.createDiv({ cls: "mf-share-section" });
    optSection.createDiv({ cls: "mf-share-label", text: "显示选项" });
    const optGrid = optSection.createDiv({ cls: "mf-opt-grid" });
    
    this.createToggle(optGrid, "日期", this.showDate, (v) => { this.showDate = v; this.renderPreview(); });
    this.createToggle(optGrid, "时间", this.showTime, (v) => { this.showTime = v; this.renderPreview(); });
    this.createToggle(optGrid, "水印", this.showWatermark, (v) => { this.showWatermark = v; this.renderPreview(); });
    
    // 预览区域
    const previewSection = contentEl.createDiv({ cls: "mf-share-section mf-preview-section" });
    previewSection.createDiv({ cls: "mf-share-label", text: "预览" });
    this.previewContainer = previewSection.createDiv({ cls: "mf-preview-container" });
    
    // 渲染预览
    this.renderPreview();
    
    // 操作按钮
    const actions = contentEl.createDiv({ cls: "mf-share-actions" });
    
    const downloadBtn = actions.createDiv({ cls: "mf-share-btn primary" });
    downloadBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span>保存图片</span>`;
    downloadBtn.onclick = () => this.downloadCard();
    
    const copyBtn = actions.createDiv({ cls: "mf-share-btn" });
    copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg><span>复制到剪贴板</span>`;
    copyBtn.onclick = () => this.copyToClipboard();
  }
  
  createToggle(container, label, value, onChange) {
    const item = container.createDiv({ cls: "mf-opt-item" });
    item.createSpan({ text: label });
    const toggle = item.createDiv({ cls: `mf-mini-tgl ${value ? "on" : ""}` });
    toggle.onclick = () => {
      toggle.classList.toggle("on");
      onChange(toggle.classList.contains("on"));
    };
  }
  
  renderPreview() {
    if (!this.previewContainer) return;
    this.previewContainer.empty();
    
    const allEmotions = this.plugin.getAllEmotions();
    let entriesToShare = [];
    
    if (this.singleEntry) {
      entriesToShare = [this.singleEntry];
    } else {
      const today = (0, import_obsidian.moment)().format("YYYY-MM-DD");
      entriesToShare = this.entries.filter(e => (0, import_obsidian.moment)(e.timestamp).format("YYYY-MM-DD") === today);
      if (!entriesToShare.length && this.entries.length) {
        entriesToShare = [this.entries[0]];
      }
    }
    
    // 创建卡片容器
    const card = this.previewContainer.createDiv({ cls: `mf-card mf-card-${this.cardStyle}` });
    
    // 根据样式设置背景
    const mainEntry = entriesToShare[0];
    const mainInfo = allEmotions[mainEntry.emotion] || emotions.neutral;
    
    if (this.cardStyle === "gradient") {
      card.style.background = `linear-gradient(135deg, ${mainInfo.color}40, ${this.theme.bg1}, ${this.theme.bg2})`;
    } else if (this.cardStyle === "minimal") {
      card.style.background = "#ffffff";
      card.style.color = "#1a1a1a";
    } else if (this.cardStyle === "polaroid") {
      card.style.background = "#fafafa";
      card.style.color = "#1a1a1a";
    } else if (this.cardStyle === "neon") {
      card.style.background = `linear-gradient(135deg, #0a0a0a, #1a0a2e)`;
      card.style.boxShadow = `0 0 30px ${mainInfo.color}40, inset 0 0 60px ${mainInfo.color}10`;
    }
    
    // 日期头部
    if (this.showDate) {
      const dateHeader = card.createDiv({ cls: "mf-card-date" });
      const entryDate = (0, import_obsidian.moment)(mainEntry.timestamp);
      dateHeader.textContent = entryDate.format("YYYY年MM月DD日 dddd");
    }
    
    // 情绪内容
    const content = card.createDiv({ cls: "mf-card-content" });
    
    entriesToShare.slice(0, 3).forEach((entry, idx) => {
      const info = allEmotions[entry.emotion] || emotions.neutral;
      const emoji = info.emoji || "😊";
      
      const item = content.createDiv({ cls: "mf-card-item" });
      
      // 情绪图标和名称
      const emotionRow = item.createDiv({ cls: "mf-card-emotion" });
      emotionRow.innerHTML = `<span class="mf-card-emoji">${emoji}</span><span class="mf-card-name" style="color:${this.cardStyle === 'minimal' || this.cardStyle === 'polaroid' ? info.color : info.color}">${info.name}</span>`;
      
      if (this.showTime) {
        emotionRow.innerHTML += `<span class="mf-card-time">${(0, import_obsidian.moment)(entry.timestamp).format("HH:mm")}</span>`;
      }
      
      // 记录文字
      if (entry.text && entry.text.trim()) {
        const text = item.createDiv({ cls: "mf-card-text" });
        text.textContent = entry.text.length > 100 ? entry.text.substring(0, 100) + "..." : entry.text;
      }
    });
    
    // 如果有更多记录
    if (entriesToShare.length > 3) {
      const more = content.createDiv({ cls: "mf-card-more" });
      more.textContent = `还有 ${entriesToShare.length - 3} 条记录...`;
    }
    
    // 水印
    if (this.showWatermark) {
      const watermark = card.createDiv({ cls: "mf-card-watermark" });
      watermark.innerHTML = `<span>情绪追踪器</span><span>·</span><span>记录每一刻心情</span>`;
    }
  }
  
  async generateCardCanvas() {
    const allEmotions = this.plugin.getAllEmotions();
    let entriesToShare = [];
    
    if (this.singleEntry) {
      entriesToShare = [this.singleEntry];
    } else {
      const today = (0, import_obsidian.moment)().format("YYYY-MM-DD");
      entriesToShare = this.entries.filter(e => (0, import_obsidian.moment)(e.timestamp).format("YYYY-MM-DD") === today);
      if (!entriesToShare.length && this.entries.length) {
        entriesToShare = [this.entries[0]];
      }
    }
    
    const mainEntry = entriesToShare[0];
    const mainInfo = allEmotions[mainEntry.emotion] || emotions.neutral;
    
    // 创建Canvas
    const canvas = document.createElement("canvas");
    const scale = 2; // 高清
    const width = 400;
    const height = Math.min(500, 200 + entriesToShare.slice(0, 3).length * 100);
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    
    // 绘制背景
    if (this.cardStyle === "gradient") {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, this.hexToRgba(mainInfo.color, 0.3));
      gradient.addColorStop(0.5, this.theme.bg1);
      gradient.addColorStop(1, this.theme.bg2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (this.cardStyle === "minimal") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    } else if (this.cardStyle === "polaroid") {
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, width, height);
      // 绘制边框效果
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 1;
      ctx.strokeRect(15, 15, width - 30, height - 30);
    } else if (this.cardStyle === "neon") {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0a0a0a");
      gradient.addColorStop(1, "#1a0a2e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      // 霓虹边框
      ctx.shadowColor = mainInfo.color;
      ctx.shadowBlur = 20;
      ctx.strokeStyle = mainInfo.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, width - 40, height - 40);
      ctx.shadowBlur = 0;
    }
    
    const isLight = this.cardStyle === "minimal" || this.cardStyle === "polaroid";
    const textColor = isLight ? "#1a1a1a" : "#ffffff";
    const subTextColor = isLight ? "#666666" : "rgba(255,255,255,0.6)";
    
    let y = 40;
    
    // 日期
    if (this.showDate) {
      ctx.font = "14px 'LXGW WenKai', sans-serif";
      ctx.fillStyle = subTextColor;
      ctx.textAlign = "center";
      const dateText = (0, import_obsidian.moment)(mainEntry.timestamp).format("YYYY年MM月DD日 dddd");
      ctx.fillText(dateText, width / 2, y);
      y += 35;
    }
    
    // 绘制每条记录
    entriesToShare.slice(0, 3).forEach((entry, idx) => {
      const info = allEmotions[entry.emotion] || emotions.neutral;
      const emoji = info.emoji || "😊";
      
      // Emoji和情绪名称
      ctx.font = "28px Arial";
      ctx.textAlign = "left";
      ctx.fillText(emoji, 30, y + 8);
      
      ctx.font = "bold 18px 'LXGW WenKai', sans-serif";
      ctx.fillStyle = info.color;
      ctx.fillText(info.name, 70, y + 5);
      
      // 时间
      if (this.showTime) {
        ctx.font = "12px 'LXGW WenKai', sans-serif";
        ctx.fillStyle = subTextColor;
        ctx.textAlign = "right";
        ctx.fillText((0, import_obsidian.moment)(entry.timestamp).format("HH:mm"), width - 30, y + 5);
      }
      
      y += 30;
      
      // 文字内容
      if (entry.text && entry.text.trim()) {
        ctx.font = "14px 'LXGW WenKai', sans-serif";
        ctx.fillStyle = textColor;
        ctx.textAlign = "left";
        
        const text = entry.text.length > 60 ? entry.text.substring(0, 60) + "..." : entry.text;
        const lines = this.wrapText(ctx, text, width - 60);
        lines.forEach(line => {
          ctx.fillText(line, 30, y + 5);
          y += 22;
        });
      }
      
      y += 20;
    });
    
    // 水印
    if (this.showWatermark) {
      ctx.font = "11px 'LXGW WenKai', sans-serif";
      ctx.fillStyle = subTextColor;
      ctx.textAlign = "center";
      ctx.fillText("情绪追踪器 · 记录每一刻心情", width / 2, height - 20);
    }
    
    return canvas;
  }
  
  wrapText(ctx, text, maxWidth) {
    const lines = [];
    let currentLine = "";
    
    for (const char of text) {
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.slice(0, 3); // 最多3行
  }
  
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  
  async downloadCard() {
    try {
      const canvas = await this.generateCardCanvas();
      const link = document.createElement("a");
      link.download = `moodflow-${(0, import_obsidian.moment)().format("YYYY-MM-DD-HHmm")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      new import_obsidian.Notice("✅ 卡片已保存");
    } catch (e) {
      new import_obsidian.Notice("❌ 保存失败: " + e.message);
    }
  }
  
  async copyToClipboard() {
    try {
      const canvas = await this.generateCardCanvas();
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          new import_obsidian.Notice("✅ 已复制到剪贴板");
        } catch (e) {
          // 如果剪贴板API不支持，尝试下载
          new import_obsidian.Notice("⚠️ 剪贴板不支持，请使用保存功能");
        }
      }, "image/png");
    } catch (e) {
      new import_obsidian.Notice("❌ 复制失败: " + e.message);
    }
  }
  
  onClose() {
    this.contentEl.empty();
  }
};

// 自定义情绪编辑弹窗
var CustomEmotionModal = class extends import_obsidian.Modal {
  constructor(app, plugin, key, emotion, onSave) {
    super(app);
    this.plugin = plugin;
    this.editKey = key;
    this.onSave = onSave;
    this.emotionData = emotion ? { ...emotion } : {
      name: "",
      icon: "happy",
      emoji: "\u{1F60A}",
      color: "#FF9500",
      glow: "rgba(255,149,0,.6)",
      gradient: "linear-gradient(135deg,#FF9500,#FF6B00)"
    };
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("mf-custom-emotion-modal");

    // 添加样式
    const style = contentEl.createEl("style");
    style.textContent = `
      .mf-custom-emotion-modal { padding: 20px; }
      .mf-custom-emotion-modal h2 { margin-bottom: 20px; }
      .mf-icon-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin: 12px 0; }
      .mf-icon-option { width: 44px; height: 44px; border-radius: 10px; border: 2px solid transparent; background: var(--background-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
      .mf-icon-option:hover { background: var(--background-modifier-hover); transform: scale(1.05); }
      .mf-icon-option.selected { border-color: var(--interactive-accent); background: var(--interactive-accent-hover); }
      .mf-icon-option svg { width: 24px; height: 24px; }
      .mf-emoji-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 6px; margin: 12px 0; }
      .mf-emoji-option { width: 36px; height: 36px; border-radius: 8px; border: 2px solid transparent; background: var(--background-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 20px; }
      .mf-emoji-option:hover { background: var(--background-modifier-hover); transform: scale(1.1); }
      .mf-emoji-option.selected { border-color: var(--interactive-accent); background: var(--interactive-accent-hover); }
      .mf-emotion-preview { margin: 16px 0; padding: 16px; background: var(--background-secondary); border-radius: 12px; }
      .mf-preview-item { display: inline-flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 14px; margin-top: 8px; }
      .mf-preview-item svg { width: 32px; height: 32px; }
      .mf-preview-emoji { font-size: 28px; }
    `;

    contentEl.createEl("h2", { text: this.editKey ? "\u7F16\u8F91\u60C5\u7EEA" : "\u6DFB\u52A0\u65B0\u60C5\u7EEA" });

    // 名称
    new import_obsidian.Setting(contentEl)
      .setName("\u60C5\u7EEA\u540D\u79F0")
      .setDesc("\u4F8B\u5982\uFF1A\u5174\u594B\u3001\u65E0\u804A\u3001\u611F\u6069...")
      .addText((t) => t.setValue(this.emotionData.name).setPlaceholder("\u8F93\u5165\u60C5\u7EEA\u540D\u79F0").onChange((v) => {
        this.emotionData.name = v;
        this.updatePreview();
      }));

    // Emoji选择
    const emojiSetting = new import_obsidian.Setting(contentEl)
      .setName("\u9009\u62E9 Emoji")
      .setDesc("\u7528\u4E8E\u4FDD\u5B58\u5230 Obsidian \u65F6\u663E\u793A");
    
    const emojiGrid = emojiSetting.settingEl.createDiv({ cls: "mf-emoji-grid" });
    const availableEmojis = ["\u{1F60A}", "\u{1F622}", "\u{1F620}", "\u{1F630}", "\u{1F60C}", "\u{1F610}", "\u{1F929}", "\u{1F634}", "\u{1F970}", "\u{1F64F}", "\u{1F914}", "\u{1F31F}", "\u{1F614}", "\u{1F339}", "\u{1F4AA}", "\u{1F60E}", "\u{1F917}", "\u{1F62D}", "\u{1F621}", "\u{1F628}", "\u{1F60D}", "\u{1F642}", "\u{1F973}", "\u{1F62A}"];
    
    availableEmojis.forEach(emoji => {
      const emojiOption = emojiGrid.createDiv({ cls: `mf-emoji-option ${this.emotionData.emoji === emoji ? "selected" : ""}` });
      emojiOption.textContent = emoji;
      emojiOption.onclick = () => {
        this.emotionData.emoji = emoji;
        emojiGrid.querySelectorAll(".mf-emoji-option").forEach(el => el.classList.remove("selected"));
        emojiOption.classList.add("selected");
        this.updatePreview();
      };
    });

    // 图标选择
    const iconSetting = new import_obsidian.Setting(contentEl)
      .setName("\u9009\u62E9\u754C\u9762\u56FE\u6807")
      .setDesc("\u7528\u4E8E\u63D2\u4EF6\u754C\u9762\u663E\u793A");
    
    const iconGrid = iconSetting.settingEl.createDiv({ cls: "mf-icon-grid" });
    const availableIcons = ["happy", "sad", "angry", "anxious", "calm", "neutral", "excited", "tired", "love", "grateful", "confused", "hopeful", "lonely", "peaceful", "stressed", "bored", "inspired"];
    
    availableIcons.forEach(iconKey => {
      const iconOption = iconGrid.createDiv({ cls: `mf-icon-option ${this.emotionData.icon === iconKey ? "selected" : ""}` });
      iconOption.innerHTML = emotionIcons[iconKey];
      iconOption.onclick = () => {
        this.emotionData.icon = iconKey;
        iconGrid.querySelectorAll(".mf-icon-option").forEach(el => el.classList.remove("selected"));
        iconOption.classList.add("selected");
        this.updatePreview();
      };
    });

    // 颜色
    new import_obsidian.Setting(contentEl)
      .setName("\u4E3B\u9898\u8272")
      .setDesc("\u9009\u62E9\u60C5\u7EEA\u7684\u4EE3\u8868\u8272")
      .addColorPicker((cp) => cp.setValue(this.emotionData.color).onChange((v) => {
        this.emotionData.color = v;
        this.emotionData.glow = this.hexToRgba(v, 0.6);
        this.emotionData.gradient = `linear-gradient(135deg,${v},${this.darkenColor(v, 20)})`;
        this.updatePreview();
      }));

    // 预览
    const previewContainer = contentEl.createDiv({ cls: "mf-emotion-preview" });
    previewContainer.createEl("span", { text: "\u9884\u89C8\uFF1A" });
    this.previewEl = previewContainer.createDiv({ cls: "mf-preview-item" });
    this.updatePreview();

    // 保存按钮
    new import_obsidian.Setting(contentEl)
      .addButton((btn) => btn.setButtonText("\u53D6\u6D88").onClick(() => this.close()))
      .addButton((btn) => btn.setButtonText("\u4FDD\u5B58").setCta().onClick(async () => {
        if (!this.emotionData.name.trim()) {
          new import_obsidian.Notice("\u8BF7\u8F93\u5165\u60C5\u7EEA\u540D\u79F0");
          return;
        }
        // 生成key
        const key = this.editKey || `custom_${Date.now()}`;
        if (!this.plugin.settings.customEmotions) {
          this.plugin.settings.customEmotions = {};
        }
        this.plugin.settings.customEmotions[key] = this.emotionData;
        await this.plugin.saveSettings();
        this.close();
        if (this.onSave) this.onSave();
        new import_obsidian.Notice(`\u60C5\u7EEA "${this.emotionData.name}" \u5DF2\u4FDD\u5B58`);
      }));
  }

  updatePreview() {
    if (!this.previewEl) return;
    this.previewEl.empty();
    this.previewEl.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      border-radius: 14px;
      background: ${this.emotionData.color}20;
      border: 1px solid ${this.emotionData.color}40;
    `;
    // Emoji
    const emojiSpan = this.previewEl.createSpan({ cls: "mf-preview-emoji" });
    emojiSpan.textContent = this.emotionData.emoji || "\u{1F60A}";
    // 图标
    const iconDiv = this.previewEl.createDiv();
    iconDiv.innerHTML = emotionIcons[this.emotionData.icon] || emotionIcons.neutral;
    iconDiv.style.cssText = `color: ${this.emotionData.color}; width: 32px; height: 32px;`;
    iconDiv.querySelector("svg").style.cssText = "width: 100%; height: 100%;";
    // 名称
    this.previewEl.createSpan({ text: this.emotionData.name || "\u672A\u547D\u540D", cls: "preview-name" });
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  darkenColor(hex, percent) {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - percent);
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - percent);
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - percent);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  onClose() {
    this.contentEl.empty();
  }
};
