@echo off
title 停止服务器
echo.
echo  正在停止 Next.js 开发服务器...
taskkill /f /im node.exe 2>nul
echo  已停止所有 Node 进程
echo.
pause
