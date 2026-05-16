# 服务器首次设置

> 面向 `8.156.68.107` 服务器的初始化配置。只需做一次。

## 1. 安装 Node.js

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
source ~/.bashrc

# 安装 Node.js 22
nvm install 22
nvm alias default 22
```

## 2. 安装 PM2

```bash
npm install -g pm2
pm2 startup  # 设置开机自启
```

## 3. 创建目录结构

```bash
mkdir -p /www/wwwroot/hao430/{server,logs}
```

## 4. 配置环境变量

```bash
cat > /www/wwwroot/hao430/server/.env << 'EOF'
DATABASE_URL=postgres://user:password@localhost:5432/resume
PORT=3000
NODE_ENV=production
EOF

chmod 600 /www/wwwroot/hao430/server/.env
```

## 5. 配置 Nginx 反代

后端 API 需要通过 Nginx 暴露出去。在 Nginx 配置中添加：

```nginx
server {
    listen 80;
    server_name hao430.cn;

    # 前端由 ESA 托管，此处仅处理 API 反代
    # 如果后端和前端不同域名，用下面这个 block

    # 如果前端也通过这台服务器提供，则添加：
    # root /www/wwwroot/hao430/client/dist;
    # index index.html;
    # location / { try_files $uri $uri/ /index.html; }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 6. 配置 GitHub Secrets

在 GitHub 仓库 `Settings → Secrets and variables → Actions` 中添加：

| Secret 名称 | 值 |
|------------|-----|
| `SERVER_SSH_KEY` | SSH 私钥内容（见下方） |
| `SERVER_USER` | SSH 登录用户名 |

### SSH 密钥生成

```bash
ssh-keygen -t ed25519 -f ~/.ssh/deploy-key -N ""
cat ~/.ssh/deploy-key.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/deploy-key   # 复制内容到 GitHub Secret: SERVER_SSH_KEY
```

## 7. 数据库

确保 PostgreSQL 已安装并运行：

```bash
# 安装 PostgreSQL
sudo apt install postgresql

# 创建数据库和用户
sudo -u postgres psql -c "CREATE USER resume WITH PASSWORD 'your-password';"
sudo -u postgres psql -c "CREATE DATABASE resume OWNER resume;"

# 建表
psql -U resume -d resume -f /www/wwwroot/hao430/server/src/db/schema.sql
```

## 部署验证

一切就绪后，推送 `main` 分支到 GitHub，观察 Actions 运行状态：

```
quality-check → build-frontend + deploy-backend (并行)
                                     ↓
                              deploy-frontend → notify
```

成功后访问：
- 前端：`https://hao430.cn`
- 后端健康检查：`https://hao430.cn/api/health`
