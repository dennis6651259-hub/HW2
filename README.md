# 王鼎昌 · 7115064172 : HW2 · King County 房價預測與回歸分析
## 網站發布
https://dennis6651259-hub.github.io/HW2/
<img width="1068" height="894" alt="{B8EE1D51-788E-4E41-BD1C-A28007A55864}" src="https://github.com/user-attachments/assets/2937ce56-e107-4359-8426-3ee06f77d59e" />
![Uploading {126D23CF-7BDD-4C97-AC42-CD263CBA3915}.png…]()


## 內容與加分功能

- 原報告研究結果、模型比較、特徵選擇、95% CI/PI 圖及 CRISP-DM 六階段。
- `report.pdf` 為使用者上傳的原始 PDF，未修改模型數字或原 AI 對話標示。
- Problem 下拉選單：King County 房價／50 Startups 利潤。
- 自訂 CSV HTTPS 網址與本機檔案匯入；目標與特徵可自行選擇。
- 真正於瀏覽器訓練 OLS、訓練集標準化、類別 One-Hot、向後選取（p > 0.05）。
- 固定 seed 42、80/20 切分、測試 R²/RMSE/MAE、Student-t 95% CI/PI、覆蓋率與預測 CSV 匯出。
- 兩個內建 CSV 及 JS 套件均存於此儲存庫；正常使用不依賴 CDN。

## 資料來源

主作業：Kaggle [House Sales in King County, USA](https://www.kaggle.com/datasets/harlfoxem/housesalesprediction)，harlfoxem，CC0。21,613 筆、21 欄；扣除 price/id/date 為 18 個原始特徵，超過 13。

完整 CSV 鏡像：https://raw.githubusercontent.com/moderndive/moderndive/master/data-raw/kc_house_data.csv

NotebookLM 同主題參考：https://github.com/nadinezab/kc-house-prices-prediction

加分示範：https://raw.githubusercontent.com/Avik-Jain/100-Days-Of-ML-Code/master/datasets/50_Startups.csv

Startups 的 4 個原始特徵未達主作業 >13 的條件，僅用於第二種 problem。

## 可重現性與統計限制

原報告指標為轉錄結果，未取得原 main.py/joblib，不能保證完全重現。互動工具使用自己的 LCG 洗牌，不同於 scikit-learn，且不包含 Lasso/Ridge/交叉驗證。報告頁與互動結果明確分開。

房價範例提供 17 個報告最終特徵；價格取 log、面積取 log，屋齡以交易年計算，市中心設為 (47.6062, -122.3321)。為展示報告清理規則，先刪除 bedrooms ≥10 與全資料 log 價格 3×IQR 的 11 筆，留下 21,602 筆。此預清理有測試分布資訊進入清理規則的限制，正式泛化評估應改為先切分、再由訓練集估計規則，並考慮依 id 分組。

自訂資料不套用房價工程／異常篩選。缺失列移除後才隨機切分；編碼類別、標準化及向後選取只用訓練資料。常數特徵自動移除；完全共線、特徵過多、資料不足會顯示錯誤。類別欄位最多 25 類，編碼後最多 50 個特徵、30,000 筆、20 MB。

類別 dummy 目前逐欄選取，不做整組 F 檢定；未見測試類別以參考類別表示，會於頁面註明。逐步選取後的 p 值與 CI 屬探索性推論，不能當作校正過的顯著性證據。

CI/PI 由標準同方差 OLS 的 Student-t 公式計算。若取 log，exp(mu) 為原目標的中位數估計，exp(CI) 對應中位數 CI。異質變異、空間群聚、漂移與模型錯設會影響區間效度；未實作 HC3 或 conformal interval。

任意網址須為可讀取的 HTTPS CSV 並允許 CORS，否則使用本機檔案。所有分析在瀏覽器進行，無後端上傳。

## AI 協助與待補項目

GPT 輔助內容：本次要求檢查、資料來源補充、網站撰寫、OLS 工具、驗證與 GitHub 上傳。

NotebookLM：網站摘要整理自使用者報告第 9 章，超過 100 字；本次未額外操作 NotebookLM，未獨立驗證平台使用紀錄。

原報告第 8 章的 AI 對話為 Claude，不將其改稱 ChatGPT。完成本次對話後，仍需使用瀏覽器列印／pdfCrowd 匯出完整 ChatGPT 對話 PDF。原 PDF 缺少的 Kaggle 連結與 GPT 標示已補在網站，尚未回寫 PDF。

## 開發與驗證

無需 npm install。以一般靜態 HTTP server 開啟本目錄；請勿直接以 file:// 開啟，因 fetch 讀檔會受限制。

```bash
node --check engine.js
node --check app.js
node test.js
```

已使用瀏覽器驗證：完整房價載入 21,602 筆／訓練 17,281／測試 4,321；兩種 problem 訓練；Startups 原始 CSV 網址載入與訓練；實際值圖及 CI/PI 圖。

本次工具結果（非原報告結果）：房價 log 測試 R² 約 0.797；Startups 開啟向後選取測試 R² 約 0.924、RMSE 約 9,204.48、MAE 約 8,171.06，測試筆數僅 10，不能由 100% 覆蓋率宣稱已校準。

## 第三方套件

- Chart.js 4.4.1，MIT：https://github.com/chartjs/Chart.js
- Papa Parse 5.4.1，MIT：https://github.com/mholt/PapaParse
- jStat 1.9.6，MIT：https://github.com/jstat/jstat

上游授權文字保留於 `vendor/`。自訂程式碼見 `engine.js` 與 `app.js`。
