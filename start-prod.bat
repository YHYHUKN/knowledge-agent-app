@echo off
title AI 知识资产问答工作台 (生产模式)
cd /d "%~dp0"
echo.
echo  ================================
echo   AI 知识资产问答工作台 (生产模式)
echo  ================================
echo.
echo  正在安装依赖（首次运行）...
call npm install
if errorlevel 1 (
    echo.
    echo  [错误] npm install 失败，请检查网络连接
    pause
    exit /b 1
)

echo.
echo  正在构建项目（仅首次或代码变更后）...
call npm run build
if errorlevel 1 (
    echo.
    echo  [错误] 构建失败，请检查代码错误
    pause
    exit /b 1
)

echo.
echo  构建完成，启动生产服务器...
echo  启动成功后请访问: http://localhost:3000
echo  按 Ctrl+C 可停止服务器
echo.
npm start
