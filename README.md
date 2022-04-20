<img src="./doc/file/KnowSearch.png"/>

KnowSearch：一站式 Elasticsearch 集群指标监控与运维管控平台。阅读本README文档，您可以了解到滴滴KnowSearch的产品定位、体验地图、快速安装，并可以在线进行产品体验。

# 1.产品简介

## 1.1 产品发展历程

KnowSearch 是基于滴滴内部开发的的一套 ES 搜索平台(内部代号 Arius )优化开源而来，它是滴滴搜索团队的一整套 ES 搜索服务和治理体系化思考的全面展现。

目前滴滴内部 ES 集群的规模在60+ 集群，2500+ 节点，10PB 的数据，1500w 写入 TPS， 10w+ 查询 QPS。在滴滴内部大量使用 ES 来作为日志检索、Mysql 实时数据快照、分布式文档数据库、搜索引擎服务等业务场景的基础搜索服务，并在开源 Elasticsearch 基础上提供企业级权限管控、离线索引快速导入、跨集群复制、索引模板服务、DSL审核与分析等功能。

## 1.2 产品能力

KnowSearch针对ES集群运维管控、索引资源管理以及指标监控体系建设等核心场景提供了一套完善的解决方案。通过内部沉淀的一些最佳实践经验，形成了以索引模板为核心的各类模板服务，以DSL查询模板为核心的异常语句的专家分析，以指标监控为核心的集群健康状态指标化展示，并结合工单系统形成完整的产品闭环。

# 2.产品体验

## 2.1 快速体验地址

KnowSearch 提供了一套体验环境，地址如下：

- 体验地址： http://116.85.24.226/
- 账号密码： admin/admin

## 2.2 体验地图

为避免用户在使用过程中，因为超级管理员视角而产生一些操作误区，KnowSearch提供多场景、多视角的产品体验地图，分别是用户体验地图、运维体验地图。

### 2.2.1 用户体验地图

- 集群资源申请：根据自身业务需求及保障级别的需要，可以灵活选择共享集群资源、独享集群资源、独立集群资源。
- 索引模板管理：为应用申请索引模板，支持模板清理、模板下线等能力，同时提供编辑Mapping、索引预创建、过期删除等索引模板服务。
- 检索查询：内嵌Kibana原生查询能力支持，同步提供了DSL/SQL查询能力；将查询需求在产品上闭环，提供查询模板的统计、慢查与异常分析能力。
- 指标大盘：查看集群运行状态，针对集群、节点、索引从多角度进行100+指标聚合展示，提供分位值、Top统计等多维度指标查看与诊断分析能力。

### 2.2.2 运维体验地图

- 集群运维：根据用户需求，合理分配集群资源，结合工单系统，将集群、索引模板、索引的运维操作平台化。
- 索引模板运维：索引动态升版本、索引主从切换、索引批量迁移、索引冷热分离、索引容量规划等服务。
- 集群监控：根据多视角多维度的指标监控体系，建立起集群健康度机制，将集群运维指标化，通过异常指标的筛选准确地定位问题。

# 3.产品核心优势

KnowSearch 是在滴滴搜索团队多年沉淀的基础上全面优化而来，它从平台、运维、引擎建设三个方面来配合解决大规模 ES 集群使用和运维的各种问题，因此它具有以下优点：

- 平台侧服务易用性提升：提供功能强大和易用的用户控制台，提供索引、集群、mapping 等常用操作，降低用户使用 ElasticSearch 的成本。

- 管控侧运维成本降低：提供功能强大和易用的管控平台，开发和运维可以方便的操作集群管控、索引管控、权限管控，降低服务运维成本；提供全面和丰富的监控指标，方便开发和运维快速掌握集群的运行时状态。
- 引擎侧引擎能力提升：深入引擎定制开发跨集群数据复制、FastIndex 离线索引创建等特性，提升 ElasticSearch 集群稳定性和性能。

# 4.滴滴LogiEM架构图

KnowSearch由一个前端服务(Arius Web Console)和两个后端服务(Arius Admin、Arius GateWay)组成，架构图如下所示：

<img src="http://116.85.24.226/images/4001.png" alt="4001" style="zoom:50%;" />

KnowSearch提供平台、运维、引擎等多维度的能力：

- 开源特性：用户只用把自己运维的集群接入到 KnowSearch，在开源 KnowSearch 上就直接可以使用的能力，如：集群的指标采集和监控、集群索引的监控和管理等、接入 Gateway 后还可以获取到全量的查询写入指标。

- 开源滴滴特性：用户把自己运维的集群接入到 KnowSearch 后，按照 KnowSearch 的规则创建好索引模板，就可以使用的其能力，这一块主要和滴滴开发的索引模板服务相关，如：模板的升级、查询写入限流等。

- 商业特性：用户把自己运维的集群接入到 KnowSearch 后，需要商业付费后才可以使用的能力，这一块主要包括集群管控和 didi-es 引擎开发的一些能力，如：ES 集群运维操作能力、滴滴 ES 引擎的性能优化等。

- 规划特性：KnowSearch 开源之后，后续规划的一些能力，重点关注的能力有：DSL 流量回放、索引重建、索引备份、引擎级日志 trace 诊断。

本次开源的 KnowSearch 0.1 版本，主要是提供开源特性和开源滴滴特性的能力供开源社区用户使用，如果用户对 KnowSearch  的商业特性有需求可以联系我们。

# 5.QuickStart

KnowSearch自动化安装

## 5.1 环境要求及说明

1. 建议操作系统是初始化状态，且版本为Centos7.X
2. 服务器可用内存配置要求大于8G
3. 部署KnowSearch环境会重新安装Mysql和修改Nginx配置
4. 使用root用户安装，安装目录为/root/

## 5.2 脚本使用说明

1. 需要服务器可以访问外网：将脚本下载到服务器后，执行方式：sh install_LogiEM.sh ip [下载地址](https://logi-em.s3.didiyunapi.com/install_LogiEM.sh)
   ，其中ip指安装服务器的IP地址。
2. 如不能访问外网，可以将软件包从本地上传至服务器并注释脚本Down_Package函数中的wget命令[下载地址](https://logi-em.s3.didiyunapi.com/LogiEM_pack.tar.gz)。
3. 如安装过程中断，请查看断点原因。

## 5.3 各个模块版本和使用的端口

| 模块          | 版本 | 端口 |
| ------------- | ---- | ---- |
| Elasticsearch | 7.6  | 8060 |
| Kibana        | 7.6  | 8601 |
| Mysql         | 5.7  | 3306 |
| Nginx         | 1.8  | 80   |
| EM_Admin      | 0.1  | 8015 |
| EM_Gateway    | 1.0  | 8200 |

# 6.相关文档

- [KnowSearch用户指南](doc/KnowSearch用户指南.md)
- [KnowSearch安装部署文档](doc/KnowSearch安装部署文档.md)
- [KnowSearch设计说明](doc/KnowSearch设计说明.md)
- [KnowSearch源码编译运行文档](doc/KnowSearch源码编译运行文档.md)
- [KnowSearch最佳实践](doc/KnowSearch最佳实践.md)
- [常见FAQ](./doc/常见FAQ.md)

# 7.开源用户交流群

<img src="http://116.85.24.226/images/4002.png" alt="4001" />

微信加群：关注公众号“云原生可观测性”，回复 "Logi加群"

# 8.项目成员

## 8.1 内部核心成员

zhangliangmike、zhaoqingrong、superhua、linyunan、houxiufeng、caijiamin、wangpengkai、joysunchao、wzhoupeng、fengkun、guoxusheng

## 8.2 外部贡献者

...