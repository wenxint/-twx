# TCP握手挥手机制

> TCP（Transmission Control Protocol）是一种面向连接的、可靠的传输层协议。理解TCP的连接建立（三次握手）和连接释放（四次挥手）机制对于前端工程师来说至关重要，特别是在网络优化、WebSocket通信和HTTP协议理解方面。

## 概念介绍

TCP是一种可靠的、面向连接的传输层协议，它通过复杂的握手机制确保数据传输的可靠性。TCP连接是全双工的，这意味着数据可以在两个方向上同时传输。

### TCP连接的生命周期

TCP连接经历以下几个阶段：
1. **连接建立**：三次握手过程
2. **数据传输**：双向可靠数据传输
3. **连接释放**：四次挥手过程

### TCP报文段结构

```javascript
/**
 * @description TCP报文段结构模拟
 */
class TCPSegment {
  constructor(options = {}) {
    // TCP头部字段
    this.sourcePort = options.sourcePort || 0;      // 源端口（16位）
    this.destPort = options.destPort || 0;          // 目标端口（16位）
    this.sequenceNumber = options.sequenceNumber || 0; // 序列号（32位）
    this.ackNumber = options.ackNumber || 0;        // 确认号（32位）
    this.headerLength = options.headerLength || 20; // 头部长度（4位）
    this.reserved = 0;                              // 保留位（6位）

    // 控制位标志（各1位）
    this.flags = {
      URG: options.URG || 0,  // 紧急指针有效
      ACK: options.ACK || 0,  // 确认号有效
      PSH: options.PSH || 0,  // 推送标志
      RST: options.RST || 0,  // 重置连接
      SYN: options.SYN || 0,  // 同步序列号
      FIN: options.FIN || 0   // 结束连接
    };

    this.windowSize = options.windowSize || 65535;   // 窗口大小（16位）
    this.checksum = options.checksum || 0;           // 校验和（16位）
    this.urgentPointer = options.urgentPointer || 0; // 紧急指针（16位）
    this.data = options.data || '';                  // 数据部分
  }

  /**
   * 获取标志位字符串表示
   */
  getFlagsString() {
    const activeFlags = [];
    Object.entries(this.flags).forEach(([flag, value]) => {
      if (value) activeFlags.push(flag);
    });
    return activeFlags.join(',') || 'NONE';
  }

  /**
   * 转换为字符串表示
   */
  toString() {
    return `TCP[${this.sourcePort}→${this.destPort}] ` +
           `SEQ=${this.sequenceNumber} ACK=${this.ackNumber} ` +
           `FLAGS=[${this.getFlagsString()}] WIN=${this.windowSize}`;
  }
}

// 使用示例
const synSegment = new TCPSegment({
  sourcePort: 12345,
  destPort: 80,
  sequenceNumber: 1000,
  SYN: 1
});

console.log(synSegment.toString());
// 输出: TCP[12345→80] SEQ=1000 ACK=0 FLAGS=[SYN] WIN=65535
```

## 三次握手机制

三次握手是TCP建立连接的过程，确保双方都具备发送和接收数据的能力。

### 三次握手的详细过程

```javascript
/**
 * @description TCP三次握手模拟器
 */
class TCPHandshakeSimulator {
  constructor() {
    this.connectionState = 'CLOSED';
    this.clientSequence = Math.floor(Math.random() * 1000000);
    this.serverSequence = Math.floor(Math.random() * 1000000);
    this.steps = [];
  }

  /**
   * 模拟完整的三次握手过程
   */
  simulateHandshake() {
    console.log('=== TCP三次握手开始 ===\n');

    // 第一次握手：客户端发送SYN
    this.firstHandshake();

    // 第二次握手：服务器发送SYN+ACK
    this.secondHandshake();

    // 第三次握手：客户端发送ACK
    this.thirdHandshake();

    console.log('=== TCP三次握手完成 ===\n');
    console.log('连接状态:', this.connectionState);

    return this.steps;
  }

  /**
   * 第一次握手：客户端 → 服务器 (SYN)
   */
  firstHandshake() {
    const segment = new TCPSegment({
      sourcePort: 12345,
      destPort: 80,
      sequenceNumber: this.clientSequence,
      SYN: 1
    });

    const step = {
      step: 1,
      direction: '客户端 → 服务器',
      description: '客户端发送连接请求',
      segment: segment,
      clientState: 'SYN_SENT',
      serverState: 'LISTEN',
      explanation: `客户端发送SYN包，序列号为${this.clientSequence}，请求建立连接`
    };

    this.steps.push(step);
    this.logStep(step);
  }

  /**
   * 第二次握手：服务器 → 客户端 (SYN+ACK)
   */
  secondHandshake() {
    const segment = new TCPSegment({
      sourcePort: 80,
      destPort: 12345,
      sequenceNumber: this.serverSequence,
      ackNumber: this.clientSequence + 1,
      SYN: 1,
      ACK: 1
    });

    const step = {
      step: 2,
      direction: '服务器 → 客户端',
      description: '服务器确认连接并发送自己的连接请求',
      segment: segment,
      clientState: 'SYN_SENT',
      serverState: 'SYN_RCVD',
      explanation: `服务器发送SYN+ACK包，确认客户端序列号${this.clientSequence}，` +
                  `发送自己的序列号${this.serverSequence}`
    };

    this.steps.push(step);
    this.logStep(step);
  }

  /**
   * 第三次握手：客户端 → 服务器 (ACK)
   */
  thirdHandshake() {
    const segment = new TCPSegment({
      sourcePort: 12345,
      destPort: 80,
      sequenceNumber: this.clientSequence + 1,
      ackNumber: this.serverSequence + 1,
      ACK: 1
    });

    const step = {
      step: 3,
      direction: '客户端 → 服务器',
      description: '客户端确认服务器的连接请求',
      segment: segment,
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      explanation: `客户端发送ACK包，确认服务器序列号${this.serverSequence}，连接建立成功`
    };

    this.steps.push(step);
    this.logStep(step);
    this.connectionState = 'ESTABLISHED';
  }

  /**
   * 记录握手步骤
   */
  logStep(step) {
    console.log(`第${step.step}次握手 (${step.direction}):`);
    console.log(`  描述: ${step.description}`);
    console.log(`  报文: ${step.segment.toString()}`);
    console.log(`  客户端状态: ${step.clientState}`);
    console.log(`  服务器状态: ${step.serverState}`);
    console.log(`  说明: ${step.explanation}\n`);
  }

  /**
   * 获取握手过程总结
   */
  getSummary() {
    return {
      totalSteps: this.steps.length,
      initialClientSeq: this.clientSequence,
      initialServerSeq: this.serverSequence,
      finalState: this.connectionState,
      timeComplexity: 'O(1)',
      messageComplexity: '3个报文段'
    };
  }
}

// 执行三次握手模拟
const handshakeSimulator = new TCPHandshakeSimulator();
const handshakeSteps = handshakeSimulator.simulateHandshake();

console.log('握手过程总结:', handshakeSimulator.getSummary());

// 执行结果示例：
// === TCP三次握手开始 ===
//
// 第1次握手 (客户端 → 服务器):
//   描述: 客户端发送连接请求
//   报文: TCP[12345→80] SEQ=123456 ACK=0 FLAGS=[SYN] WIN=65535
//   客户端状态: SYN_SENT
//   服务器状态: LISTEN
//   说明: 客户端发送SYN包，序列号为123456，请求建立连接
//
// 第2次握手 (服务器 → 客户端):
//   描述: 服务器确认连接并发送自己的连接请求
//   报文: TCP[80→12345] SEQ=789012 ACK=123457 FLAGS=[SYN,ACK] WIN=65535
//   客户端状态: SYN_SENT
//   服务器状态: SYN_RCVD
//   说明: 服务器发送SYN+ACK包，确认客户端序列号123456，发送自己的序列号789012
//
// 第3次握手 (客户端 → 服务器):
//   描述: 客户端确认服务器的连接请求
//   报文: TCP[12345→80] SEQ=123457 ACK=789013 FLAGS=[ACK] WIN=65535
//   客户端状态: ESTABLISHED
//   服务器状态: ESTABLISHED
//   说明: 客户端发送ACK包，确认服务器序列号789012，连接建立成功
//
// === TCP三次握手完成 ===
```

### 三次握手的关键要点

```javascript
/**
 * @description 三次握手关键要点分析
 */
class HandshakeAnalyzer {
  /**
   * 分析三次握手的必要性
   */
  static analyzeNecessity() {
    return {
      whyNotTwoWay: {
        problem: "两次握手无法确认客户端接收能力",
        scenario: "服务器发送SYN+ACK后，如果客户端未收到，服务器会误认为连接已建立",
        result: "可能导致资源浪费和数据丢失"
      },
      whyNotFourWay: {
        problem: "四次握手增加不必要的开销",
        scenario: "第二次握手可以将SYN和ACK合并发送",
        result: "三次握手是最优解"
      },
      securityBenefit: {
        防止重复连接: "通过序列号防止旧连接的延迟报文干扰",
        防止资源浪费: "确保双方都准备好通信",
        状态同步: "确保双方状态机同步"
      }
    };
  }

  /**
   * 分析序列号的作用
   */
  static analyzeSequenceNumbers() {
    return {
      randomization: {
        purpose: "防止序列号预测攻击",
        range: "32位随机数（0-4294967295）",
        security: "增加TCP劫持的难度"
      },
      synchronization: {
        client: "ISN_C (Initial Sequence Number Client)",
        server: "ISN_S (Initial Sequence Number Server)",
        acknowledgment: "ACK = SEQ + 1（SYN包消耗一个序列号）"
      },
      dataIntegrity: {
        ordering: "保证数据包的正确顺序",
        duplication: "检测重复数据包",
        loss: "检测丢失的数据包"
      }
    };
  }
}

console.log('三次握手必要性分析:', HandshakeAnalyzer.analyzeNecessity());
console.log('序列号作用分析:', HandshakeAnalyzer.analyzeSequenceNumbers());
```

## 四次挥手机制

四次挥手是TCP释放连接的过程，由于TCP是全双工连接，需要分别关闭两个方向的数据传输。

### 四次挥手的详细过程

```javascript
/**
 * @description TCP四次挥手模拟器
 */
class TCPDisconnectSimulator {
  constructor(clientSeq = 1000, serverSeq = 2000) {
    this.connectionState = 'ESTABLISHED';
    this.clientSequence = clientSeq;
    this.serverSequence = serverSeq;
    this.steps = [];
  }

  /**
   * 模拟完整的四次挥手过程
   */
  simulateDisconnect() {
    console.log('=== TCP四次挥手开始 ===\n');
    console.log('初始状态: 连接已建立 (ESTABLISHED)\n');

    // 第一次挥手：客户端发送FIN
    this.firstWave();

    // 第二次挥手：服务器发送ACK
    this.secondWave();

    // 第三次挥手：服务器发送FIN
    this.thirdWave();

    // 第四次挥手：客户端发送ACK
    this.fourthWave();

    console.log('=== TCP四次挥手完成 ===\n');
    console.log('最终状态:', this.connectionState);

    return this.steps;
  }

  /**
   * 第一次挥手：客户端 → 服务器 (FIN)
   */
  firstWave() {
    const segment = new TCPSegment({
      sourcePort: 12345,
      destPort: 80,
      sequenceNumber: this.clientSequence,
      FIN: 1,
      ACK: 1,
      ackNumber: this.serverSequence
    });

    const step = {
      step: 1,
      direction: '客户端 → 服务器',
      description: '客户端请求关闭连接',
      segment: segment,
      clientState: 'FIN_WAIT_1',
      serverState: 'ESTABLISHED',
      explanation: `客户端发送FIN包，序列号${this.clientSequence}，请求关闭从客户端到服务器的连接`
    };

    this.steps.push(step);
    this.logStep(step);
  }

  /**
   * 第二次挥手：服务器 → 客户端 (ACK)
   */
  secondWave() {
    const segment = new TCPSegment({
      sourcePort: 80,
      destPort: 12345,
      sequenceNumber: this.serverSequence,
      ackNumber: this.clientSequence + 1,
      ACK: 1
    });

    const step = {
      step: 2,
      direction: '服务器 → 客户端',
      description: '服务器确认客户端的关闭请求',
      segment: segment,
      clientState: 'FIN_WAIT_2',
      serverState: 'CLOSE_WAIT',
      explanation: `服务器发送ACK包，确认收到客户端的FIN，从客户端到服务器的连接关闭`
    };

    this.steps.push(step);
    this.logStep(step);
  }

  /**
   * 第三次挥手：服务器 → 客户端 (FIN)
   */
  thirdWave() {
    const segment = new TCPSegment({
      sourcePort: 80,
      destPort: 12345,
      sequenceNumber: this.serverSequence,
      ackNumber: this.clientSequence + 1,
      FIN: 1,
      ACK: 1
    });

    const step = {
      step: 3,
      direction: '服务器 → 客户端',
      description: '服务器请求关闭连接',
      segment: segment,
      clientState: 'FIN_WAIT_2',
      serverState: 'LAST_ACK',
      explanation: `服务器发送FIN包，请求关闭从服务器到客户端的连接`
    };

    this.steps.push(step);
    this.logStep(step);
  }

  /**
   * 第四次挥手：客户端 → 服务器 (ACK)
   */
  fourthWave() {
    const segment = new TCPSegment({
      sourcePort: 12345,
      destPort: 80,
      sequenceNumber: this.clientSequence + 1,
      ackNumber: this.serverSequence + 1,
      ACK: 1
    });

    const step = {
      step: 4,
      direction: '客户端 → 服务器',
      description: '客户端确认服务器的关闭请求',
      segment: segment,
      clientState: 'TIME_WAIT',
      serverState: 'CLOSED',
      explanation: `客户端发送ACK包，确认服务器的FIN，进入TIME_WAIT状态等待2MSL`
    };

    this.steps.push(step);
    this.logStep(step);

    // 模拟TIME_WAIT超时
    setTimeout(() => {
      this.connectionState = 'CLOSED';
      console.log('TIME_WAIT超时，客户端状态变为CLOSED，连接完全关闭');
    }, 1000);
  }

  /**
   * 记录挥手步骤
   */
  logStep(step) {
    console.log(`第${step.step}次挥手 (${step.direction}):`);
    console.log(`  描述: ${step.description}`);
    console.log(`  报文: ${step.segment.toString()}`);
    console.log(`  客户端状态: ${step.clientState}`);
    console.log(`  服务器状态: ${step.serverState}`);
    console.log(`  说明: ${step.explanation}\n`);
  }

  /**
   * 分析TIME_WAIT状态
   */
  analyzeTimeWait() {
    return {
      duration: '2MSL (Maximum Segment Lifetime)',
      purpose: [
        '确保最后的ACK能够到达服务器',
        '等待网络中延迟的报文消失',
        '防止新连接收到旧连接的数据'
      ],
      typicalValue: '2分钟（Linux默认60秒 × 2）',
      impact: {
        positive: '保证连接的可靠关闭',
        negative: '占用端口资源，可能导致端口耗尽'
      }
    };
  }
}

// 执行四次挥手模拟
const disconnectSimulator = new TCPDisconnectSimulator(1000, 2000);
const disconnectSteps = disconnectSimulator.simulateDisconnect();

console.log('TIME_WAIT状态分析:', disconnectSimulator.analyzeTimeWait());

// 执行结果示例：
// === TCP四次挥手开始 ===
//
// 初始状态: 连接已建立 (ESTABLISHED)
//
// 第1次挥手 (客户端 → 服务器):
//   描述: 客户端请求关闭连接
//   报文: TCP[12345→80] SEQ=1000 ACK=2000 FLAGS=[FIN,ACK] WIN=65535
//   客户端状态: FIN_WAIT_1
//   服务器状态: ESTABLISHED
//   说明: 客户端发送FIN包，序列号1000，请求关闭从客户端到服务器的连接
//
// 第2次挥手 (服务器 → 客户端):
//   描述: 服务器确认客户端的关闭请求
//   报文: TCP[80→12345] SEQ=2000 ACK=1001 FLAGS=[ACK] WIN=65535
//   客户端状态: FIN_WAIT_2
//   服务器状态: CLOSE_WAIT
//   说明: 服务器发送ACK包，确认收到客户端的FIN，从客户端到服务器的连接关闭
```

### 为什么需要四次挥手？

```javascript
/**
 * @description 四次挥手必要性分析
 */
class DisconnectAnalyzer {
  /**
   * 分析四次挥手的原因
   */
  static analyzeFourWayNecessity() {
    return {
      fullDuplexNature: {
        description: "TCP是全双工连接",
        implication: "需要分别关闭两个方向的数据传输",
        directions: [
          "客户端到服务器方向",
          "服务器到客户端方向"
        ]
      },
      asymmetricClosure: {
        scenario: "应用层关闭时机不同",
        example: "客户端可能已完成发送但仍需接收服务器数据",
        benefit: "允许半关闭状态，提高效率"
      },
      separatedAckAndFin: {
        reason: "ACK和FIN可能无法合并",
        explanation: "服务器收到FIN后，可能还有数据要发送",
        steps: [
          "先发送ACK确认收到FIN",
          "处理完剩余数据后再发送FIN"
        ]
      }
    };
  }

  /**
   * 对比三次握手和四次挥手
   */
  static compareHandshakeAndDisconnect() {
    return {
      handshake: {
        steps: 3,
        reason: "建立连接时，SYN和ACK可以合并",
        efficiency: "最小的消息数量",
        state: "从无到连接建立"
      },
      disconnect: {
        steps: 4,
        reason: "关闭连接时，ACK和FIN通常不能合并",
        efficiency: "确保数据完整传输",
        state: "从连接到完全关闭"
      },
      keyDifference: {
        handshake: "双方同时准备接收数据",
        disconnect: "可能存在数据传输的时间差"
      }
    };
  }
}

console.log('四次挥手必要性:', DisconnectAnalyzer.analyzeFourWayNecessity());
console.log('握手与挥手对比:', DisconnectAnalyzer.compareHandshakeAndDisconnect());
```