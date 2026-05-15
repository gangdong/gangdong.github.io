# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

David Dong's 个人博客（董刚的博客），基于 Jekyll 构建，部署在 GitHub Pages。使用自研 `rawposts` Jekyll 主题。

## 构建与运行

```bash
# 本地构建并预览（访问 http://127.0.0.1:4000/blog/index.html）
bundle exec jekyll serve

# 仅构建（输出到 _site/）
bundle exec jekyll build

# 本地构建并监听文件变化（含草稿）
bundle exec jekyll serve --drafts

# 清理缓存
bundle exec jekyll clean
```

## 发布流程

```bash
# 切换到 dev 分支
git switch dev

# 推送触发自动部署
git push origin dev
```

- 开发在 `dev` 分支进行
- CI 通过 GitHub Actions (`.github/workflows/ci.yml`) 自动构建
- 构建产物 `_site/` 被推送到 `gh-pages` 分支
- 通过 CNAME 绑定自定义域名 `dqdongg.com`
- CDN: `cdn.jsdelivr.net/gh/gangdong/gangdong.github.io@dev`

## 项目结构

```
├── _config.yml          # Jekyll 主配置（主题参数、插件、社交链接）
├── Gemfile              # Ruby 依赖
├── rawposts.gemspec     # rawposts 主题 gem 规范
├── .travis.yml          # 旧版 CI（Travis CI），已迁移到 GitHub Actions
├── .github/workflows/   # GitHub Actions CI 配置
├──
├── _posts/              # 博客文章（Markdown，命名格式：YYYY-MM-DD-title.markdown）
├── _layouts/            # 页面模板（default, post, page, home, extension）
├── _includes/           # 可复用组件（menu, footer, comments, pagination, search 等）
├── _sass/               # SCSS 样式（plain.scss, dark.scss, search.scss 等）
├── assets/              # 静态资源（图片、CSS、JS、字体）
├── blog/                # 博客列表页（含分页）
│   ├── index.html
│   ├── chinese/         # 中文博客索引
│   └── english/         # 英文博客索引
├── category/            # 分类归档页
├── Archive/             # 归档页
├── about/               # 关于页
└── scripts/             # 部署脚本（旧版）
```

## 技术栈

- **框架**: Jekyll（Ruby）
- **主题**: `rawposts`（自定义 gem 主题）
- **部署**: GitHub Pages + GitHub Actions
- **插件**: jekyll-seo-tag, jemoji, jekyll-toc, jekyll-tagging, jekyll-paginate
- **语法高亮**: Rouge
- **评论**: Gitalk（GitHub Issue 驱动的评论系统）
- **搜索**: Simple-Jekyll-Search（客户端搜索）
- **分析**: Google Analytics（G-3MXGF3FQ8N）
- **Ruby 版本**: 2.6.6

## 博客文章规范

- 文章放在 `_posts/` 目录
- 文件名格式：`YYYY-MM-DD-title.markdown`
- 支持中英文双语内容
- 支持 categories 标签分类
- 置顶文章通过添加 `Pinned` 标签实现
- 支持 TOC 目录、阅读时间统计

## 关键配置项

`_config.yml` 中 `rawposts` 命名空间下的配置控制主题行为：
- `dark_mode`: 暗色模式切换
- `search`: 搜索功能
- `gittalk`: 评论系统
- `reading_time`: 阅读时间
- `pagination`: 分页（每页 12 篇）
- `categories`: 分类页面
- `archives`: 归档页面
- `analytics_id`: Google Analytics ID
