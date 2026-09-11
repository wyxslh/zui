#!/usr/bin/env node
/**
 * 汉化词条检查工具
 * 扫描 src 下所有 t('...') / t("...") 的 key，与 src/i18n/locales/zh.json 比对，
 * 列出“组件里用到、但中文词条里还没有”的 key（即界面上会显示英文的地方）。
 *
 * 用法：node scripts/check-i18n.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ZH = path.join(ROOT, 'src/i18n/locales/zh.json');

const zh = JSON.parse(fs.readFileSync(ZH, 'utf8'));
const usedKeys = new Set();

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      walk(file);
    } else if (/\.(jsx?|tsx?)$/.test(name)) {
      const content = fs.readFileSync(file, 'utf8');
      // 匹配 t('...') 或 t("...")；\b 避免把 format('...') 等误判为 t(
      const re = /\bt\(\s*(['"])((?:\\.|(?!\1)[\s\S])*)\1/g;
      let match;
      while ((match = re.exec(content)) !== null) {
        // 还原 JS 转义（如 \' -> '、\" -> "），得到运行时 t() 实际收到的字符串
        usedKeys.add(match[2].replace(/\\(.)/g, '$1'));
      }
    }
  }
}

walk(path.join(ROOT, 'src'));

const missing = [...usedKeys]
  .filter((k) => !(k in zh))
  // 纯动态 key（如 t(variable)）抓不到；含占位符的仍应翻译，这里不过滤
  .sort();

console.log(`组件中 t() key 总数 : ${usedKeys.size}`);
console.log(`zh.json 词条数      : ${Object.keys(zh).length}`);
console.log(`疑似未翻译（显示英文）: ${missing.length}`);
if (missing.length) {
  console.log('\n以下 key 缺失，请补入 src/i18n/locales/zh.json：\n');
  for (const key of missing) {
    console.log(`  "${key}": ""`);
  }
}
