# 行情万象后端行情网关 V63

V63 继续沿用“按市场路由”的统一网关。美股 Provider 现在支持 Alpha Vantage 报价，以及日K、周K、月K；A股、港股仍保留独立服务端 Provider 路由，未配置时不会伪装成真实行情。

## 接口

- `GET /health`：返回网关版本、各市场 Provider 是否配置、支持的能力和批量限制。
- `GET /quotes?codes=NVDA,AAPL,600519,0700.HK`：统一批量报价入口，单次最多 5 个代码。
- `GET /history?code=NVDA&period=1d`：日K。
- `GET /history?code=NVDA&period=1w`：周K。
- `GET /history?code=NVDA&period=1m`：月K。

历史行情统一返回：

```json
{
  "code": "NVDA",
  "period": "1w",
  "market": "US",
  "provider": "alpha_vantage",
  "isMock": false,
  "points": [
    {"ts":1780000000000,"o":120.1,"h":124.2,"l":119.8,"c":123.45,"v":12345678}
  ]
}
```

`/health` 中美股能力示例：

```json
{
  "version":"63",
  "providers":{
    "US":{
      "configured":true,
      "provider":"alpha_vantage",
      "quotes":true,
      "history":["1d","1w","1m"]
    }
  }
}
```

## 环境变量

- `ALPHA_VANTAGE_API_KEY`：美股 Provider 的服务端 Secret，不能写进 GitHub Pages。
- `ALLOW_ORIGIN`：可选。正式环境建议设为 `https://yswgo.github.io`。
- `CN_PROVIDER_URL` / `CN_PROVIDER_TOKEN`：A股后端 Provider 预留，约定其服务端实现 `GET /quote?code=600519`。
- `HK_PROVIDER_URL` / `HK_PROVIDER_TOKEN`：港股后端 Provider 预留，约定其服务端实现 `GET /quote?code=0700.HK`。

Token 必须放在 Worker Secret/环境变量中，不能放进网页源码或 localStorage。

## 当前真实能力

| 市场 | 报价 | 历史K线 | 当前 Provider |
| --- | --- | --- | --- |
| 美股 | 可接 | 日K / 周K / 月K | Alpha Vantage |
| A股 | 路由已预留 | 待接 | 外部 CN Provider |
| 港股 | 路由已预留 | 待接 | 外部 HK Provider |
| 日本/韩国/欧洲 | 待接 | 待接 | — |
| 指数/商品/外汇/债券 | 待接 | 待接 | — |

网关会把“Provider 未配置”和“代码不支持”作为明确错误返回。前端仍默认使用 Mock；只有实际部署 Worker、配置服务端 Secret，并在“数据 → 行情数据源”切换到 HTTP Proxy 后，才会尝试真实行情。
