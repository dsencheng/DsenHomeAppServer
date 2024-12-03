# 设置基础镜像
FROM node:latest

# 设置工作目录
WORKDIR /app

# 将项目的 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将代码复制到工作目录
COPY . .

# 暴露容器的端口
EXPOSE 3000

# 定义启动命令
CMD ["npm", "start"]
