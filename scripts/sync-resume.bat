@echo off
chcp 65001 >nul
echo 📄 开始同步简历数据...
node scripts/sync-resume.js
if %errorlevel% neq 0 (
    echo ❌ 同步失败
    exit /b %errorlevel%
)
echo.
echo ✅ 同步完成！
echo 💡 提示：现在只需编辑 resume-data.json 文件，运行此脚本即可同步到网页
pause