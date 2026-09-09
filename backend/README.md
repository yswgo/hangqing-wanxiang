# 行情万象后端行情网关 V68

V68 在现有“按市场路由 + 边缘缓存 + 历史行情 + 交易日历”基础上，把报价结构正式升级为 **Quote Schema v2**。核心目标是统一不同数据供应商字段，避免前端继续把 `chg` 同时当“涨跌额”和“涨跌幅”使用。

## 接口

- `GET /health`：网关版本、Provider 能力、缓存 TTL、日历能力、Schema 版本。
- `GET /quotes?codes=NVDA,AAPL`：统一批量报价，单次最多 5 个代码。
- `GET /history?code=NVDA&period=1d|1w|1m`：统一历史行情。
- `GET /calendar?market=US`：统一交易节假日日历入口。

## Quote Schema v2

报价标准字段：

```json
{
  "schemaVersion": 2,
  "code": "NVDA",
  "name": "NVDA",
  "price": "123.45",
  "change": 1.52,
  "chgPct": 1.25,
  "chg": 1.25,
  "currency": "USD",
  "status": "按数据源",
  "provider": "alpha_vantage",
  "source": "alpha_vantage",
  "market": "US",
  "delayed": null,
  "delayMinutes": null,
  "isMock": false,
  "timestamp": 1780000000000
}
```

其中：

- `price`：最新可用价格。
- `change`：绝对涨跌额。
- `chgPct`：涨跌幅百分比。
- `chg`：兼容旧前端，值等于 `chgPct`，后续新代码不应再依赖它作为正式字段。
- `currency`：USD / CNY / HKD 等。
- `delayed`：`true` / `false` / `null`。`null` 表示网关无法仅凭接口判断授权属性。
- `delayMinutes`：已知延迟分钟数；未知为 `null`。
- `source`：真实上游来源或内部 Provider 标识。
- `timestamp`：该条报价的时间戳。

前端 V68 会自动兼容老 Provider：如果只返回 `chg`，会自动映射到 `chgPct`。

## 缓存策略

Cloudflare Worker 使用 `caches.default` 做边缘缓存：

- 报价：20 秒。
- 历史行情：6 小时。
- 交易日历：12 小时。

缓存仅减少上游请求压力，不代表“实时授权”。前端会分别展示缓存状态和 Provider 的延迟/实时属性。

## 交易日历

可通过 `CALENDAR_JSON` 或 `CALENDAR_URL` 提供：

```json
{
  "markets": {
    "US": ["2026-01-01", "2026-01-19"],
    "CN": ["2026-01-01", "2026-02-16"],
    "HK": ["2026-01-01"],
    "JP": [],
    "KR": [],
    "EU": []
  }
}
```

只有当日历来自可信交易所或数据供应商时，前端才应把它作为正式节假日判断依据。

## 环境变量

- `ALPHA_VANTAGE_API_KEY`：美股服务端 Secret。
- `ALLOW_ORIGIN`：建议正式环境设为 `https://yswgo.github.io`。
- `CN_PROVIDER_URL` / `CN_PROVIDER_TOKEN`：A股 Provider 预留。
- `HK_PROVIDER_URL` / `HK_PROVIDER_TOKEN`：港股 Provider 预留。
- `CALENDAR_URL`：可选，交易节假日 JSON 地址。
- `CALENDAR_JSON`：可选，静态节假日 JSON。

所有 Token/API Key 必须保存在 Worker Secret/环境变量中，不能放进网页源码或 localStorage。

## 当前能力

| 市场 | 报价 | 历史K线 | 日历 | Provider |
| --- | --- | --- | --- | --- |
| 美股 | 可接 | 日K / 周K / 月K | 可接 | Alpha Vantage + Calendar Feed |
| A股 | 路由已预留 | 待接 | 可接 | 外部 CN Provider |
| 港股 | 路由已预留 | 待接 | 可接 | 外部 HK Provider |
| 日本/韩国/欧洲 | 待接 | 待接 | 可接 | — |
| 指数/商品/外汇/债券 | 待接 | 待接 | — | — |

前端默认仍是 Mock。只有实际部署 Worker、设置 Secret，并在“数据 → 行情数据源”切换为 HTTP Proxy，才会尝试真实数据。
