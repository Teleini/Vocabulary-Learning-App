# FunWords - 高考趣味背单词

基于React + TypeScript的魂斗罗像素风格单词学习游戏，专为高考备考学生设计。

## ✨ 特性

- 🎮 **像素风格** - 魂斗罗风格的8位像素界面和音效
- 📚 **高考词汇** - 包含高考3500词汇库
- 🎯 **多种题型** - 选择题、拼写题、听音选词
- ❤️ **游戏机制** - 生命值、连击奖励、特效反馈
- 💾 **离线存储** - 基于IndexedDB的本地数据存储
- 📱 **响应式** - 支持桌面端和移动端
- 🎵 **音效系统** - 像素风格的游戏音效

## 🎯 游戏规则

- **生命系统**: 3条生命，答错扣1条
- **连击奖励**: 连续答对3题获得像素特效，5题获得额外生命
- **提示系统**: 每轮2次提示机会
- **评分系统**: S/A/B/C等级评定

## 🛠 技术栈

- **前端**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS + shadcn/ui
- **数据存储**: IndexedDB
- **字体**: Press Start 2P (像素字体)
- **图标**: Lucide React

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── ui/             # UI基础组件
│   ├── HomePage.tsx    # 首页
│   ├── GameQuestion.tsx # 游戏题目界面
│   ├── GameEffects.tsx # 游戏特效
│   └── GameResultDialog.tsx # 结算界面
├── hooks/              # 自定义Hook
│   └── useGameState.ts # 游戏状态管理
├── lib/                # 工具库
│   ├── database.ts     # IndexedDB操作
│   ├── questionGenerator.ts # 题目生成
│   └── utils.ts        # 通用工具
├── data/               # 数据文件
│   └── words.json      # 单词数据
├── types/              # TypeScript类型定义
└── styles/             # 样式文件
    └── index.css       # 主样式文件
```

## 🎨 设计理念

### 像素风格
- 使用Press Start 2P字体营造复古游戏氛围
- 扫描线效果模拟CRT显示器
- 像素边框和按钮设计
- 8位风格的颜色搭配

### 用户体验
- 简洁直观的界面设计
- 流畅的动画和特效
- 即时的反馈机制
- 渐进式难度设计

## 📊 数据存储

使用IndexedDB实现客户端数据持久化：

- **words**: 单词库（只读）
- **progress**: 学习进度跟踪
- **meta**: 游戏设置和最高分

## 🔧 自定义配置

### 添加更多单词

编辑 `src/data/words.json` 文件，按照以下格式添加：

```json
{
  "id": 1,
  "headword": "word",
  "meaning": "词义",
  "example": "例句",
  "audioKey": "audio_key"
}
```

### 修改游戏参数

在 `src/hooks/useGameState.ts` 中调整：

- `INITIAL_GAME_STATE`: 初始游戏状态
- 生命数量、题目数量等参数

## 🎵 音效系统

基于Web Audio API实现的像素风音效：

- 答对：高音bling效果
- 答错：低音错误提示
- 连击：递进式音效
- 生命奖励：胜利音效

## 🌐 部署

### GitHub Pages

```bash
npm run build
# 将 dist/ 目录部署到 GitHub Pages
```

### Vercel

```bash
vercel --prod
```

### Netlify

```bash
npm run build
# 上传 dist/ 目录到 Netlify
```

## 📝 开发计划

- [ ] 增加更多题型（同义词、反义词等）
- [ ] 词汇分级系统
- [ ] 错词本功能
- [ ] 学习统计报表
- [ ] 社交分享功能
- [ ] PWA支持（离线使用）

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

---

**开始你的像素风单词冒险吧！** 🎮✨
