@echo off
title AI 知识资产问答工作台
cd /d "%~dp0"
echo.
echo  ================================
echo   AI 知识资产问答工作台 启动中
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
echo  依赖安装完成，正在启动开发服务器...
echo  启动成功后请访问: http://localhost:3000
echo  按 Ctrl+C 可停止服务器
echo.
npm run dev
