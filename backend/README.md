# 行情万象后端行情网关 V71

V71 的目标是把“可接真实行情”推进到“可部署、可验证、可长期运行”的状态。当前首批真实链路仍以 **美股 → Alpha Vantage → Cloudflare Worker → 行情万象前端** 为主，A股和港股继续保留独立 Provider 路由。

## 接口

- `GET /health`：网关版本、Schema、Provider 能力、缓存和日历状态。
- `GET /ready`：快速判断当前是否至少有一个真实 Provider 已配置。
- `GET /quotes?codes=NVDA,AAPL`：统一批量报价，单次最多 5 个代码。
- `GET /history?code=NVDA&period=1d|1w|1m`：日/周/月历史行情。
- `GET /calendar?market=US`：交易节假日日历。

## Quote Schema v2

正式字段：

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
  "provider": "alpha_vantage",
  "source": "alpha_vantage",
  "market": "US",
  "delayed": null,
  "delayMinutes": null,
  "quoteTime": null,
  "quoteDate": "2026-09-08",
  "fetchedAt": 1780000000000,
  "timestamp": 1780000000000,
  "isMock": false
}
```

`quoteTime` 只有上游真实提供时间时才填写；不会用 Worker 请求时间伪造成成交时间。`fetchedAt` 是网关抓取/生成响应的时间。`timestamp` 暂时保留用于前端兼容。Alpha Vantage `GLOBAL_QUOTE` 的实时/延迟属性取决于具体授权，因此 `delayed` 无法确认时返回 `null`，前端应显示“按数据源授权”，不要直接写“实时”。

## V71 修复

V71 修复了市场代码误分类：`.T`、`.KS`、`.DE`、`.AS`、`.PA` 会先识别为日本/韩国/欧洲，不再被后端误判为美股。美股符号允许普通代码以及类似 `BRK.B` 的单字符类股后缀。

## 缓存策略

Cloudflare Worker 使用 `caches.default`：报价 20 秒、历史行情 6 小时、交易日历 12 小时。缓存只用于减轻上游 API 压力，不改变数据授权和延迟属性。

## Cloudflare 部署

仓库已经包含 `backend/wrangler.toml` 和 `.github/workflows/deploy-worker.yml`。自动部署需要 GitHub Actions Secrets：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `ALPHA_VANTAGE_API_KEY`

部署工作流会先把 `ALPHA_VANTAGE_API_KEY` 写入 Worker Secret，再执行 `wrangler deploy`。API Key 不会进入 GitHub Pages 或浏览器 localStorage。

也可以本地部署：

```bash
cd backend
npm install -g wrangler@4
wrangler login
wrangler secret put ALPHA_VANTAGE_API_KEY
wrangler deploy
```

部署成功后，依次验证：

```text
https://<your-worker>.workers.dev/health
https://<your-worker>.workers.dev/ready
https://<your-worker>.workers.dev/quotes?codes=NVDA
https://<your-worker>.workers.dev/history?code=NVDA&period=1d
```

然后把 Worker 地址填入网页“数据 → 行情数据源”，检测 `/health`，测试 NVDA，再切换到 HTTP Proxy。

## 可选环境变量

- `ALLOW_ORIGIN`：正式环境建议 `https://yswgo.github.io`。
- `CN_PROVIDER_URL` / `CN_PROVIDER_TOKEN`：A股 Provider。
- `HK_PROVIDER_URL` / `HK_PROVIDER_TOKEN`：港股 Provider。
- `CALENDAR_URL` 或 `CALENDAR_JSON`：交易节假日数据。

## 当前真实能力

| 市场 | 报价 | 历史K线 | Provider |
| --- | --- | --- | --- |
| 美股 | 可部署 | 日K / 周K / 月K | Alpha Vantage |
| A股 | 路由已预留 | 待接 | 外部 CN Provider |
| 港股 | 路由已预留 | 待接 | 外部 HK Provider |
| 日本 / 韩国 / 欧洲 | 待接 | 待接 | — |
| 指数 / 商品 / 外汇 / 债券 | 待接 | 待接 | — |

默认前端仍使用 Mock。只有 Worker 实际部署、Secret 配置完成，并在前端切换到 HTTP Proxy 后，才会尝试真实 Provider 数据。
