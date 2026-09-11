# zui 中文汉化版（zh-cn）

在官方 [project-zot/zui](https://github.com/project-zot/zui) 基础上使用 **react-i18next** 进行中文汉化的分支，未改动业务逻辑。

- 默认语言：简体中文；未翻译词条自动回退英文（`fallbackLng: 'en'`），上游更新不会导致白屏
- 翻译文件集中在 `src/i18n/locales/zh.json`，日常维护只需改这一个文件
- 附带 `Dockerfile` + `nginx.conf`：构建为 nginx 静态镜像，并把 `/v2`、`/zot` 反代到名为 `zot` 的后端容器（同源，无 CORS 问题）

配套部署仓库见：<https://github.com/wyxslh/zot-cn-deploy>

## 本地开发

```bash
npm install
npm run dev
```

## 构建 Docker 镜像

```bash
docker build -t zui-cn:latest .
```

容器内 nginx 监听 80，要求 zot 后端容器与本容器在同一 Docker 网络，且后端容器名为 `zot`（见部署仓库的 docker-compose.yaml）。

## 更新中文词条

编辑 `src/i18n/locales/zh.json`：键为英文原文，值为中文译文，然后重新构建镜像：

```bash
docker build -t zui-cn:latest .
```

## 跟进官方更新

```bash
git fetch origin
git merge origin/main         # 在 zh-cn 分支合并上游
# 冲突原则：保留 t() 包裹，以新英文文案作为 key
npm install                   # 依赖变化时
docker build -t zui-cn:latest .
```

合并后界面上新出现的英文文本，把对应词条补入 `zh.json` 重新构建即可。
