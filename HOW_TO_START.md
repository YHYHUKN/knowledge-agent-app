# 启动方式

## 双击运行（推荐）

直接双击项目根目录下的 `start-dev.bat`，自动完成依赖安装并启动开发服务器。

- 启动后访问：**http://localhost:3000**
- 停止服务器：双击 `stop.bat`

## 命令行运行

```bash
npm install
npm run dev       # 开发模式
npm run build && npm start  # 生产模式
```

> **数据重置**：如需恢复默认 3 条种子数据，请在浏览器中按 F12 → Application → localStorage → 删除 `knowledge_assets_v1` 键，刷新页面即可。

## 注意事项

- 首次启动会自动安装依赖（`npm install`），需要联网
- 依赖安装完成后，后续启动只需 `npm run dev` 或双击 `start-dev.bat`
- 生产模式（`npm start`）需先执行 `npm run build` 构建产物
- 启动后默认端口 3000，如端口被占用 Next.js 会自动尝试 3001
