# node-canopen-demo
## 增加RPDO和TPDO的demo代码

### 使用虚拟CAN测试
```
sudo modprobe vcan
sudo ip link add dev can0 type vcan
sudo ip link set can0 up
```

### 安装CAN相关工具
```
sudo apt update
sudo apt install can-utils
```

### 观察CAN信息
**有条件可以时候用wireshark抓包观察**
```
candump can0
```
