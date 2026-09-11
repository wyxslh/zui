# zui 中文汉化版（zh-cn）

在官方 [project-zot/zui](https://github.com/project-zot/zui) 基础上使用 **react-i18next** 进行简体中文汉化的分支，**只包裹文案、不改业务逻辑**。

- 默认语言：简体中文（`lng: 'zh'`）
- **key 就是英文原文**：组件里写 `t('Search')`，词条文件里 `"Search": "搜索"`
- 回退链：中文词条缺失 → 回退英文 → 英文也没有则**直接显示 key（即英文原文）**，所以上游更新后未翻译的地方只会显示英文，**不会白屏或报错**
- 翻译集中在 `src/i18n/locales/zh.json`，日常维护基本只改这一个文件

## 目录与原理

```
src/i18n/
├── index.js            # i18next 初始化（默认中文、回退英文）
└── locales/
    ├── en.json         # 英文词条（保持为空 {}，用英文原文当 key）
    └── zh.json         # 中文词条，所有翻译都在这里
```

组件中的标准用法：

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <Button>{t('Search')}</Button>;
}
```

带变量的文案（注意花括号里的变量名要一致）：

```jsx
{t('Delete {{name}}?', { name: repo })}
```
```json
"Delete {{name}}?": "删除 {{name}}？"
```

配套部署仓库：<https://github.com/wyxslh/zot-cn-deploy>

---

## 场景一：只改 / 补中文翻译（最常见）

界面上某句英文想翻译，或觉得现有译法要调整，**不用动组件**：

1. 打开 `src/i18n/locales/zh.json`
2. 按 `"英文原文": "中文"` 的形式新增或修改一行（注意每行逗号、JSON 不能有注释）
3. 本地预览确认：
   ```bash
   npm install        # 仅第一次
   npm run dev
   ```
4. 构建镜像并验证：
   ```bash
   docker build -t wyxslh/zui-cn:latest .
   ```
5. 提交推送代码（见文末"提交与发布"）。

> 小技巧：在页面上看到英文，那句英文**原样**就是要加的 key，复制到 zh.json 即可，不用去翻组件。

---

## 场景二：上游新组件出现"包都没包"的英文

大多数情况上游只是新增了 `t('...')` key（用场景一补词条即可）。但如果上游新增的组件**直接写死英文**（没经过 `t()`），光加词条不会生效，需要手动包裹：

1. 全局搜到那句英文所在的 `.jsx`：
   ```bash
   grep -rn "That English Text" src/
   ```
2. 确认文件顶部已引入（没有就加）：
   ```jsx
   import { useTranslation } from 'react-i18next';
   ```
3. 在组件函数内拿到 `t`：
   ```jsx
   const { t } = useTranslation();
   ```
4. 把英文文本替换成 `t('英文原文')`，例如：
   ```jsx
   // 改前
   <Typography>No data</Typography>
   // 改后
   <Typography>{t('No data')}</Typography>
   ```
5. 在 `zh.json` 补上对应中文，然后按场景一构建验证。

> 原则：**只把字符串包进 `t()`，不改标签结构、不改逻辑**，这样以后合并上游冲突最小。

---

## 场景三：跟随上游版本更新（重点）

本仓库的 remote 约定：

| remote | 地址 | 含义 |
|---|---|---|
| `origin` | github.com/project-zot/zui | 官方上游（只读参考） |
| `fork` | github.com/wyxslh/zui | 你自己的仓库（推送目标） |

汉化工作在 `zh-cn` 分支，`main` 与它保持一致作为对外默认分支。

### 更新步骤

```bash
# 1. 确保在汉化分支且工作区干净
git checkout zh-cn
git status

# 2. 拉取官方最新代码
git fetch origin

# 3. 看上游这次改了什么（可选）
git log --oneline HEAD..origin/main | head -30

# 4. 合并上游
git merge origin/main
```

### 处理冲突

冲突几乎只会出现在"我们包过 `t()`、上游又改了同一行"的地方：

```bash
git diff --name-only --diff-filter=U     # 列出冲突文件
```

解决原则：

- **保留 `t()` 包裹**；如果上游改了英文措辞，用**新英文**当 key，例如最终保留 `{t('New Search')}`；
- 不要因为冲突就退化成裸英文；
- 解决后：
  ```bash
  git add <冲突文件>
  git commit            # 保存合并（或 git merge --continue）
  ```

依赖有变化时安装一下：

```bash
npm install
```

### 补齐新增词条

```bash
npm run dev
```

逐页点一遍，把仍显示英文的地方按"场景一/二"补进 `zh.json`。上游新增但我们还没翻的英文都会正常显示，不影响使用。

补完用脚本自查是否还有遗漏：

```bash
node scripts/check-i18n.js     # “疑似未翻译”为 0 即覆盖完整
```

### 本地构建验证

```bash
npm run build          # 先确认能编译通过
docker build -t wyxslh/zui-cn:latest .
docker run --rm -p 8080:80 wyxslh/zui-cn:latest   # 打开 http://localhost:8080 抽查
```

---

## 提交与发布

### 1) 提交代码到自己的仓库

```bash
git add -A
git commit -m "feat(i18n): 补充/更新中文词条"

# 推送到 zh-cn 分支
git push fork zh-cn

# 让对外默认的 main 也指向最新（与 zh-cn 保持一致）
git push fork zh-cn:main
```

> `main` 与 `zh-cn` 内容保持一致即可；保留 `zh-cn` 分支名是为了语义清晰、方便以后合并上游。

### 2) 构建并推送 Docker 镜像到 Docker Hub

镜像 tag 建议跟随 zot 版本，如本次对应 zot v2.1.21，则用 `v2.1.21-cn`，并同时更新 `latest`：

```bash
docker login -u wyxslh

docker build -t wyxslh/zui-cn:v2.1.21-cn -t wyxslh/zui-cn:latest .
docker push wyxslh/zui-cn:v2.1.21-cn
docker push wyxslh/zui-cn:latest
```

> 只有在多架构需求（ARM 服务器）时才需要 buildx：
> ```bash
> docker buildx build --platform linux/amd64,linux/arm64 \
>   -t wyxslh/zui-cn:v2.1.21-cn -t wyxslh/zui-cn:latest --push .
> ```

### 3) 更新部署端

在部署机器（`zot-cn-deploy` 目录）上：

```bash
# 若用了新 tag，先改 docker-compose.yaml 里 zui 的 image tag
docker compose pull zui
docker compose up -d zui
```

浏览器强刷（Ctrl+F5）即可看到新界面。

---

## 常见问题

- **改了 zh.json 界面没变？** 浏览器缓存，Ctrl+F5 强刷；确认容器用的是新构建镜像（`docker compose up -d --build zui`）。
- **怎么快速核对哪些英文还没翻？** 运行自带的检查脚本，它会扫描所有 `t()` 的 key 并列出 zh.json 里缺失的项：
  ```bash
  node scripts/check-i18n.js
  ```
  输出示例：`疑似未翻译（显示英文）: 1`，并直接给出可粘贴进 zh.json 的 `"英文": ""` 行。逐页浏览点击仍是最可靠的终检方式。
- **JSON 改完报错/页面空白？** 多半是 zh.json 漏了逗号或多了逗号。校验：
  ```bash
  node -e "JSON.parse(require('fs').readFileSync('src/i18n/locales/zh.json','utf8')); console.log('JSON OK')"
  ```
- **合并上游后 `npm run build` 失败？** 先 `npm install`；仍失败看报错，通常是上游新增了依赖或调整了文件，按提示处理。
