# 行情万象后端行情网关 V77

当前架构：GitHub Pages → Cloudflare Worker → 多 Provider。Webull Sandbox 已用 AAPL 验证完整链路；Sandbox 只用于开发测试，不代表正式行情权限。

## 已验证

- `GET /ready`：Gateway 健康与能力。
- `GET /test/webull`：Webull Sandbox AAPL 测试。
- `GET /quotes?codes=...`：Quote Schema v2 批量报价。
- 美股：Webull Sandbox(AAPL 测试) → Twelve Data（可选）→ Alpha Vantage → 最近真实缓存 → 暂不可用。
- 前端严格区分正式行情、时效未声明、延迟、缓存、Sandbox、Mock、暂不可用。

## Webull 正式行情接入方向

Webull OpenAPI Market Data API 官方支持美股、港股，以及沪深港通范围内的中国 A 股。HTTP Data API 可查询 snapshot、历史 K 线、逐笔和盘口；正式 API Base URL 为 `https://api.webull.hk`。股票类别分别为：

- `US_STOCK`：美股
- `HK_STOCK`：港股，例如腾讯应使用 Webull API 对应的港股 symbol 格式。
- `CN_STOCK`：A 股（Stock Connect），例如 `600519`。

正式 Provider 不在浏览器保存密钥。部署工作流已经预留以下 GitHub Actions Secrets，并在存在时安全写入 Cloudflare Worker Secret：

- `WEBULL_APP_KEY`
- `WEBULL_APP_SECRET`
- `WEBULL_ACCESS_TOKEN`（需要时）

**不要把这些值写入仓库、网页、截图或聊天。**

Webull OpenAPI 行情订阅与 Webull App/桌面端行情权限相互独立。正式使用前必须确认 OpenAPI 对应市场的数据权限和公开展示/再分发许可。

## 权限注意

根据 Webull OpenAPI 官方说明：

- 港股股票/ETF LV1 可用；LV2 需单独订阅。
- A 股通过 Stock Connect 提供 LV1；中国大陆以外地区为 15 分钟延迟，中国大陆地区目前不支持该 A 股 OpenAPI 行情能力。
- 美股 OpenAPI 行情需要相应 OpenAPI 市场数据权限。
- App/QT 已购买的行情不自动继承到 OpenAPI。

因此网关必须保留 `delayed` / `delayMinutes` / `isSandbox` 等字段，不能把“接口返回成功”等同于“实时行情”。

## Quote Schema v2

```json
{
  "schemaVersion": 2,
  "code": "AAPL",
  "price": "123.45",
  "change": 1.52,
  "chgPct": 1.25,
  "currency": "USD",
  "provider": "webull",
  "source": "webull",
  "market": "US",
  "delayed": null,
  "delayMinutes": null,
  "isMock": false,
  "isSandbox": false,
  "quoteTime": "2026-09-08T20:00:00.000Z",
  "quoteDate": "2026-09-08",
  "fetchedAt": 1780000000000,
  "timestamp": 1780000000000
}
```

`quoteTime` 是上游行情时间；`fetchedAt` 是网关获取时间，两者不能混用。

## Cloudflare 部署

必需 GitHub Actions Secrets：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `ALPHA_VANTAGE_API_KEY`

可选：

- `TWELVE_DATA_API_KEY`
- `WEBULL_APP_KEY`
- `WEBULL_APP_SECRET`
- `WEBULL_ACCESS_TOKEN`

工作流不会把这些 Secret 写进 GitHub Pages。

## 下一阶段 Provider 路由

```text
US: Webull production(配置后) → Twelve Data → Alpha Vantage → real cache → unavailable
HK: Webull production(配置后) → HK external provider(可选) → real cache → unavailable
CN: Webull production/适用区域(配置后) → CN external provider(可选) → real cache → unavailable
```

在 Webull 正式凭证尚未配置前，HK/CN 不允许静默回退成未标记 Mock。


## Tushare A股 Provider

配置 `TUSHARE_TOKEN` 后，Gateway 会优先使用 Tushare 的 `rt_k` 实时日线接口；A股代码会自动补全为 `.SH/.SZ/.BJ`。历史行情 `/history?code=600519&period=1d|1w|1m` 使用 Tushare 对应的 daily/weekly/monthly 接口。该 Provider 需要 Tushare 账户及相应数据权限，未配置或权限不足时会返回明确错误，不会生成 Mock 行情。
