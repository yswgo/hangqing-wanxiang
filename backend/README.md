# 行情万象后端行情网关 V62

当前模板面向 Cloudflare Worker。V62 把网关升级成“按市场路由”的统一入口：美股已提供可运行的 Alpha Vantage 报价和日K适配器；A股、港股已经预留独立服务端 Provider 路由，但在你配置对应后端前不会冒充真实数据。

## 接口

- `GET /health`：返回网关版本、各市场 Provider 是否配置、支持的能力和批量限制。
- `GET /quotes?codes=NVDA,AAPL,600519,0700.HK`：统一批量报价入口，单次最多 5 个代码。
- `GET /history?code=NVDA&period=1d`：历史日K统一入口。V62 当前真实实现范围为美股日K。

### 报价返回

```json
{
  "data": [
    {
      "code": "NVDA",
      "name": "NVDA",
      "price": "123.45",
      "chg": 1.25,
      "status": "按数据源",
      "provider": "alpha_vantage",
      "market": "US",
      "delay": "provider",
      "isMock": false,
      "timestamp": 1780000000000
    }
  ],
  "errors": [],
  "meta": {"gateway":"v62"}
}
```

### 历史K线返回

```json
{
  "code": "NVDA",
  "period": "1d",
  "market": "US",
  "provider": "alpha_vantage",
  "isMock": false,
  "points": [
    {"ts":1780000000000,"o":120.1,"h":124.2,"l":119.8,"c":123.45,"v":12345678}
  ]
}
```

## 环境变量

- `ALPHA_VANTAGE_API_KEY`：美股 Provider 的服务端 Secret，不能写进 GitHub Pages。
- `ALLOW_ORIGIN`：可选。正式环境建议设为 `https://yswgo.github.io`。
- `CN_PROVIDER_URL` / `CN_PROVIDER_TOKEN`：A股后端 Provider 预留。V62 约定其服务端实现 `GET /quote?code=600519`。
- `HK_PROVIDER_URL` / `HK_PROVIDER_TOKEN`：港股后端 Provider 预留。V62 约定其服务端实现 `GET /quote?code=0700.HK`。

Token 必须放在 Worker Secret/环境变量中，不能放进网页源码或 localStorage。

## 当前真实能力

| 市场 | 报价 | 历史K线 | 当前 Provider |
| --- | --- | --- | --- |
| 美股 | 可接 | 日K可接 | Alpha Vantage |
| A股 | 路由已预留 | 待接 | 外部 CN Provider |
| 港股 | 路由已预留 | 待接 | 外部 HK Provider |
| 日本/韩国/欧洲 | 待接 | 待接 | — |
| 指数/商品/外汇/债券 | 待接 | 待接 | — |

网关会把“Provider 未配置”和“代码不支持”作为明确错误返回，不会回传伪造行情。前端仍默认使用 Mock；只有实际部署 Worker、配置服务端 Secret，并在“数据 → 行情数据源”切换到 HTTP Proxy 后，才会尝试真实行情。
