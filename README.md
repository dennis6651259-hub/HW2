# 王鼎昌 · 7115064172 : HW2 · King County 房價預測與回歸分析
## 網站發布
https://dennis6651259-hub.github.io/HW2/
<img width="1068" height="894" alt="{B8EE1D51-788E-4E41-BD1C-A28007A55864}" src="https://github.com/user-attachments/assets/2937ce56-e107-4359-8426-3ee06f77d59e" />

## 內容

- 研究結果、模型比較、特徵選擇、95% CI/PI 圖及 CRISP-DM 六階段。
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


## AI 協助與待補項目

AI 輔助內容：本次要求檢查、資料來源補充、網站撰寫、OLS 工具、驗證與 GitHub 上傳。

NotebookLM：網站參考:https://github.com/nadinezab/kc-house-prices-prediction

## 開發與驗證
已使用瀏覽器驗證：完整房價載入 21,602 筆／訓練 17,281／測試 4,321；兩種 problem 訓練；Startups 原始 CSV 網址載入與訓練；實際值圖及 CI/PI 圖。



