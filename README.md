自用的一个简单音视频服务端

构建镜像
docker image build -t my-express .

运行容器
docker container run -p 3000:3000 my-express