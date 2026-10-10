# YHCB 广告落地页设计文档

## 1. 项目目标

为 BuyGearPump 的 YHCB 产品建立一个独立、快速、适合广告投放的单页站点，部署在：

```text
https://yhcb.buygearpump.com/
```

页面的首要目标是获取有效询价，其次是让用户快速确认产品是否适合自己的介质、流量、压力和尺寸需求。

## 2. 产品范围

本项目对应一个具体的 YHCB 型号。该型号有多个尺寸或规格变体。

页面应把它表现为一个产品族：

```text
YHCB 产品介绍
├── 统一的产品卖点
├── 统一的产品图片和应用说明
├── 尺寸选择
├── 所选尺寸的参数
└── 带尺寸信息的询价表单
```

第一阶段不为每个尺寸创建独立页面。除非后续广告关键词、应用场景或产品结构明显不同，否则使用同一个根页面完成尺寸选择和询价。

## 3. 与主站的关系

主站：`D:\code\buygearpump`

主站负责：

- 完整产品目录
- 长篇技术说明
- 产品详情和维护信息
- 博客、FAQ 和自然搜索

YHCB 项目负责：

- 广告首屏
- 关键卖点
- 规格选择
- 应用场景
- 询价转化
- 广告来源追踪

广告页可以链接到主站的完整产品页面。链接应使用明确的主站绝对地址，避免在子域名下解析到错误路径。

## 4. 页面结构

### 4.1 Header

- 使用 BuyGearPump Logo。
- 只保留必要的电话、WhatsApp 或询价入口。
- 不展示主站完整产品导航。
- 移动端保持简洁。

### 4.2 Hero

首屏应立即说明：

- YHCB 型号名称
- 产品适用的核心场景
- 一个经过确认的核心优势
- 产品真实图片
- 主 CTA：`Get a Quote` 或等效文案

首屏不应堆叠未经确认的性能数字。

### 4.3 产品优势

使用三到五个简短优势卡片，例如：

- 适用介质
- 稳定输送
- 结构或密封特点
- 尺寸范围
- 维护或交付优势

每项优势都必须有产品资料支持。

### 4.4 尺寸选择和参数

页面需要提供尺寸选择控件。桌面端可以使用按钮或标签，移动端优先使用下拉框。

选择尺寸后更新参数表。建议字段包括：

- Model
- Flow rate
- Speed
- Pressure
- Inlet / outlet size
- Motor power
- Medium temperature
- Dimensions
- Weight

没有确认的数据应隐藏，而不是填入估计值或零值。

### 4.5 应用场景

说明产品适用的行业和工况。应用图必须是真实资料，或者明确标记为概念插图；不得把概念图当作设备实拍图。

### 4.6 工厂与交付能力

可展示：

- 工厂或生产图片
- 质量控制流程
- 包装和交付能力
- 出口经验
- 标准型号供货信息

交期、库存和认证信息必须经过确认后才能公开。

### 4.7 FAQ

优先回答广告用户的购买障碍：

- 如何选择尺寸
- 需要提供哪些介质参数
- 是否需要加热或保温
- 如何选择密封方式
- 是否支持国际运输
- 询价需要多长时间

### 4.8 询价表单

建议字段：

- Selected model
- Quantity
- Fluid / medium
- Viscosity
- Flow rate
- Pressure
- Temperature
- Name
- Company
- Email
- WhatsApp / phone
- Message

其中 `Selected model` 必须由当前尺寸选择自动带入。

### 4.9 Footer

只保留必要信息：

- 公司名称
- 邮箱、电话或 WhatsApp
- 隐私政策
- Terms & Conditions
- 主站完整资料链接

不建议复用主站带有完整联系表单的复杂页脚。

## 5. 数据模型

建议使用 `data/yhcb.yml` 维护产品和尺寸数据：

```yaml
product:
  name: "YHCB product name"
  short_name: "YHCB"
  description: "Verified product description"
  main_image: "images/yhcb/hero.jpg"

variants:
  - model: "YHCB-50"
    flow_rate: ""
    speed: ""
    pressure: ""
    inlet: ""
    outlet: ""
    motor_power: ""
    dimensions: ""
    weight: ""

tracking:
  campaign: "yhcb"
```

字段名可以在实现阶段调整，但要保持“一个产品、多个 variants”的结构。

## 6. 视觉方向

- 延续 BuyGearPump 的工业蓝色品牌风格。
- 使用清晰的系统无衬线字体。
- 采用高对比度 CTA。
- 首屏使用真实产品图或真实工厂图片。
- 保持大量留白，减少装饰性模块。
- 移动端优先检查首屏、规格表和表单。

页面不引入 Hargo 主题，不加载主站不需要的 Bootstrap、Slick、Snipcart 或评分组件。

## 7. 追踪和转化

需要支持并保留以下信息：

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `gclid`
- 产品型号
- 选择的尺寸

建议事件：

- `landing_view`
- `cta_click`
- `form_start`
- `lead_submit`
- `whatsapp_click`
- `phone_click`
- `email_click`

表单提交成功后才触发 `lead_submit`，不能仅在按钮点击时记录为有效询盘。

## 8. SEO 和域名

Hugo 配置中的 `baseURL` 必须是：

```toml
baseURL = "https://yhcb.buygearpump.com/"
```

这样可以保证 canonical、Open Graph、Twitter Card、结构化数据和绝对图片地址指向正确域名。

如果页面只服务付费广告，默认使用：

```html
<meta name="robots" content="noindex,follow">
```

如果未来要做自然搜索，则需要改写成独立内容，并使用自引用 canonical 和独立 sitemap。

## 9. 部署原则

- YHCB 项目独立构建。
- 输出目录与主站分开。
- `yhcb.buygearpump.com` 指向 YHCB 的部署产物。
- 部署平台负责 HTTPS 证书。
- 不依赖主站运行时资源。
- 部署前确认表单地址、统计 ID 和域名配置。

## 10. 验收标准

- 根地址打开后直接显示 YHCB 落地页。
- 首屏在移动端不出现横向滚动。
- 所有 CTA 都能到达询价区域或触发正确的联系动作。
- 切换尺寸后参数表和询价字段同步变化。
- 表单保留产品、尺寸和广告来源。
- 图片、Logo、字体和脚本都来自当前项目或明确允许的外部服务。
- 页面不展示虚构的技术数据。
- canonical 和 Open Graph 指向 `yhcb.buygearpump.com`。
- 不会修改主站内容或主站部署产物。

## 11. 待确认信息

在正式开发前需要补齐：

1. YHCB 的准确型号名称。
2. 全部尺寸和对应技术参数。
3. 主产品图、结构图和尺寸图。
4. 真实应用行业和介质范围。
5. 表单接收地址。
6. GA4、Google Ads 或其他广告平台的追踪要求。
7. 具体托管平台和 DNS 配置方式。
8. 是否需要发布隐私政策和条款的独立页面。
