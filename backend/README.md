# 行情万象后端行情网关 V64

V64 在 V63 的“按市场路由”基础上增加了三类生产化能力：**边缘缓存、统一交易日历接口、上游请求控制**。美股仍由 Alpha Vantage 提供报价与日K/周K/月K；A股、港股仍通过独立服务端 Provider 预留，不会在未配置时伪装成真实数据。

## 接口

- `GET /health`：网关版本、Provider 能力、缓存 TTL、日历能力。
- `GET /quotes?codes=NVDA,AAPL`：统一批量报价，单次最多 5 个代码。
- `GET /history?code=NVDA&period=1d|1w|1m`：统一历史行情。
- `GET /calendar?market=US`：统一交易节假日日历入口。

## V64 缓存策略

Cloudflare Worker 使用 `caches.default` 做边缘缓存，减少上游 API 压力：

- 报价：20 秒。
- 历史行情：6 小时。
- 交易日历：12 小时。

缓存只用于降低上游请求频率，不改变数据授权属性。前端仍会根据 Provider 返回值标识“模拟 / 缓存 / 按数据源”。

## 交易日历格式

可通过 `CALENDAR_JSON` 或 `CALENDAR_URL` 提供日历。推荐 JSON：

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

也兼容顶层市场键，例如 `{ "US": [...] }`。`/calendar?market=US` 返回：

```json
{
  "market":"US",
  "dates":["2026-01-01"],
  "source":"external_url",
  "timestamp":1780000000000,
  "meta":{"count":1,"cacheTtlSeconds":43200}
}
```

注意：只有你把 `CALENDAR_URL` 指向可信交易所/数据供应商日历，前端才应把它视为可信节假日数据；模板本身不自带“官方日历”。

## 环境变量

- `ALPHA_VANTAGE_API_KEY`：美股服务端 Secret。
- `ALLOW_ORIGIN`：建议正式环境设为 `https://yswgo.github.io`。
- `CN_PROVIDER_URL` / `CN_PROVIDER_TOKEN`：A股 Provider 预留。
- `HK_PROVIDER_URL` / `HK_PROVIDER_TOKEN`：港股 Provider 预留。
- `CALENDAR_URL`：可选，返回交易节假日 JSON 的服务端地址。
- `CALENDAR_JSON`：可选，小规模静态节假日 JSON；和 `CALENDAR_URL` 二选一即可。

所有 Token/API Key 必须保存在 Worker Secret/环境变量中，不能放进网页源码或 localStorage。

## 当前真实能力

| 市场 | 报价 | 历史K线 | 日历 | Provider |
| --- | --- | --- | --- | --- |
| 美股 | 可接 | 日K / 周K / 月K | 可接 | Alpha Vantage + Calendar Feed |
| A股 | 路由已预留 | 待接 | 可接 | 外部 CN Provider |
| 港股 | 路由已预留 | 待接 | 可接 | 外部 HK Provider |
| 日本/韩国/欧洲 | 待接 | 待接 | 可接 | — |
| 指数/商品/外汇/债券 | 待接 | 待接 | — | — |

前端默认仍是 Mock。只有实际部署 Worker、设置 Secret，并在“数据 → 行情数据源”切换为 HTTP Proxy，才会尝试真实数据。
