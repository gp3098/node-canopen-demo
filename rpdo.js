//引入socketcan包
const can = require('socketcan');
//初始化can0频道
const channel = can.createRawChannel('can0');

const { Device, ObjectType, AccessType, DataType } = require('canopen');

//初始化node节点0x01
const device_nodeId_0x01 = new Device({ id: 0x1 });

//初始化并开始节点
channel.addListener('onMessage', (message) => {
  //当在can0上收到消息的时候向节点0x01发送原始消息
  console.log('raw message on can0: ', message);
  device_nodeId_0x01.receive(message);
  return;
});

//初始化节点0x01上的发送消息，将所有节点0x01上发送的消息转换成原始消息后通过socketcan发送到can0上
device_nodeId_0x01.setTransmitFunction((message) => {
  console.log('raw message from device: ', message);
  return channel.send(message);
});

//初始化设备
device_nodeId_0x01.init();

//开始can0的收发
channel.start();

// cansend can0 181#00
const UNSIGNED8 = device_nodeId_0x01.eds.getEntry(DataType.UNSIGNED8); //自研1模组8进设置成这种
// cansend can0 181#00000000
const UNSIGNED32 = device_nodeId_0x01.eds.getEntry(DataType.UNSIGNED32); //零点32进设置成这种

device_nodeId_0x01.pdo.addTransmit(0x180, [UNSIGNED32], {
  //增加事件触发定时器，默认为0
  eventTime: 1000,
});

device_nodeId_0x01.pdo.addReceive(0x180, [UNSIGNED32], {
  //增加事件触发定时器，默认为0
  eventTime: 1000,
});

device_nodeId_0x01.on('pdo', (...args) => {
  const [val, ...rest] = args;
  const [pdo] = val;
  console.log('pdo:', pdo, pdo.value, rest);
});

setTimeout(() => {
  device_nodeId_0x01.pdo.stop();
  channel.stop();
}, 80000);
