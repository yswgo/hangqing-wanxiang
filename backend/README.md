# 行情万象后端行情网关（第一阶段）

当前模板面向 Cloudflare Worker，先打通 **美股股票** 的真实行情 Provider。前端仍默认使用 Mock，不会因为仓库新增此模板而自动切成真实数据。

## 接口

- `GET /health`：网关健康状态与当前能力范围。
- `GET /quotes?codes=NVDA,AAPL`：返回统一行情结构。

返回示例：

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
      "isMock": false,
      "timestamp": 1780000000000
    }
  ],
  "errors": [],
  "meta": {
    "provider": "alpha_vantage",
    "scope": "US stocks first"
  }
}
```

## 环境变量

- `ALPHA_VANTAGE_API_KEY`：必须放在 Worker 的 Secret/环境变量中，不能写进 GitHub Pages。
- `ALLOW_ORIGIN`：可选。正式使用建议设为 `https://yswgo.github.io`，测试阶段可保持默认 `*`。

## 当前范围和限制

第一阶段只处理类似 `NVDA`、`AAPL`、`MSFT` 的美股代码。A股、港股、日本、韩国、欧洲股票，以及指数、商品、外汇和债券需要后续增加独立适配器。为了避免免费接口限频，单次请求最多取 5 个代码。

前端 V61 会通过 `/health` 检查网关能力，并通过 `/quotes` 请求报价。只有你实际部署 Worker、配置 Key，并在“数据 → 行情数据源”里填入 Worker 地址后，页面才会开始尝试真实数据。
