# Đánh giá tìm kiếm RAG: 100 câu hỏi chuẩn

> Sinh tự động bởi `scripts/rag-danh-gia.ts` lúc 2026-11-22T06:34:48.191Z. Kho: mọi đoạn đã có vector bge-m3.
> Chỉ số: **recall@10** = tỷ lệ đoạn đúng lọt top 10 (chia cho min(số đoạn đúng, 10)); **hit@10** = câu có ít nhất một đoạn đúng trong top 10; **MRR** trên top 100; **đúng nguồn** = đoạn đứng đầu thuộc đúng sách.

## Tổng

| Mô hình | Cấu hình | recall@10 (%) | hit@10 (%) | MRR | Đúng nguồn (%) |
|:--|:--|--:|--:|--:|--:|
| khong | từ khóa, không mở rộng | 0.8 | 7.0 | 0.046 | 9.0 |
| khong | từ khóa + mở rộng thuật ngữ | 14.1 | 31.0 | 0.187 | 52.0 |
| khong | từ khóa + mở rộng + qwen3.6-35b-nvfp4 | 46.5 | 72.0 | 0.497 | 69.0 |
| khong | từ khóa + mở rộng + qwen3.6-35b-nvfp4 + câu mẫu | 51.2 | 80.0 | 0.585 | 73.0 |
| khong | từ khóa + mở rộng + qwen3.8-flash-next | 44.6 | 70.0 | 0.479 | 69.0 |
| khong | từ khóa + mở rộng + qwen3.8-flash-next + câu mẫu | 47.6 | 72.0 | 0.556 | 71.0 |
| khong | từ khóa + mở rộng + DeepSeek-V4.1-Flash-1017 | 53.3 | 75.0 | 0.591 | 76.0 |
| khong | từ khóa + mở rộng + DeepSeek-V4.1-Flash-1017 + câu mẫu | 57.8 | 81.0 | 0.672 | 80.0 |
| bge-m3 | vector | 17.5 | 35.0 | 0.206 | 24.0 |
| bge-m3 | vector + mở rộng | 30.6 | 58.0 | 0.441 | 55.0 |
| bge-m3 | lai (vector + từ khóa mở rộng) | 26.9 | 56.0 | 0.297 | 55.0 |
| bge-m3 | lai + mở rộng cả hai nhánh | 31.1 | 63.0 | 0.343 | 57.0 |
| bge-m3 | vector + mở rộng + qwen3.6-35b-nvfp4 (câu mẫu) | 41.8 | 73.0 | 0.592 | 67.0 |
| bge-m3 | vector + mở rộng + qwen3.8-flash-next (câu mẫu) | 39.6 | 69.0 | 0.564 | 66.0 |
| bge-m3 | vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu) | 51.5 | 84.0 | 0.628 | 76.0 |
| qwen3-0.6b | vector | 18.6 | 39.0 | 0.206 | 30.0 |
| qwen3-0.6b | vector + mở rộng | 39.7 | 70.0 | 0.456 | 63.0 |
| qwen3-0.6b | lai (vector + từ khóa mở rộng) | 26.6 | 54.0 | 0.308 | 54.0 |
| qwen3-0.6b | lai + mở rộng cả hai nhánh | 36.9 | 64.0 | 0.371 | 58.0 |
| qwen3-0.6b | vector + mở rộng + qwen3.6-35b-nvfp4 (câu mẫu) | 54.8 | 83.0 | 0.630 | 76.0 |
| qwen3-0.6b | vector + mở rộng + qwen3.8-flash-next (câu mẫu) | 53.4 | 82.0 | 0.635 | 75.0 |
| qwen3-0.6b | vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu) | 59.6 | 87.0 | 0.700 | 86.0 |
| aiteamvn | vector | 10.5 | 26.0 | 0.178 | 33.0 |
| aiteamvn | vector + mở rộng | 26.6 | 54.0 | 0.360 | 49.0 |
| aiteamvn | lai (vector + từ khóa mở rộng) | 21.4 | 47.0 | 0.295 | 51.0 |
| aiteamvn | lai + mở rộng cả hai nhánh | 31.1 | 59.0 | 0.324 | 55.0 |
| aiteamvn | vector + mở rộng + qwen3.6-35b-nvfp4 (câu mẫu) | 43.1 | 71.0 | 0.517 | 63.0 |
| aiteamvn | vector + mở rộng + qwen3.8-flash-next (câu mẫu) | 38.6 | 64.0 | 0.521 | 65.0 |
| aiteamvn | vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu) | 47.4 | 78.0 | 0.575 | 76.0 |

Tốt nhất theo hit@10: **qwen3-0.6b · vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu)**.

Viết lại bằng `gx/qwen3.6-35b-nvfp4`: 100/100 câu thành công, trung bình 2889 ms/câu.
Viết lại bằng `gx/qwen3.8-flash-next`: 100/100 câu thành công, trung bình 3509 ms/câu.
Viết lại bằng `gx/deepseek-ai/DeepSeek-V4.1-Flash-1017`: 96/100 câu thành công, trung bình 11800 ms/câu.

Thời gian: nhánh từ khóa trung bình 97 ms/câu trên CSDL máy trạm; nhúng câu hỏi trên GPU bge-m3 2.3 ms, qwen3-0.6b 5.3 ms, aiteamvn 2.3 ms (theo lô).

## Theo mảng

| Cấu hình | bat-tu (15) | chon-ngay (7) | kinh-dich (25) | ngu-hanh (3) | phong-thuy (5) | tu-vi (45) |
|:--|--:|--:|--:|--:|--:|--:|
| khong · từ khóa, không mở rộng | 0.0 | 0.0 | 28.0 | 0.0 | 0.0 | 0.0 |
| khong · từ khóa + mở rộng thuật ngữ | 6.7 | 14.3 | 44.0 | 0.0 | 60.0 | 33.3 |
| khong · từ khóa + mở rộng + qwen3.6-35b-nvfp4 | 73.3 | 85.7 | 80.0 | 66.7 | 80.0 | 64.4 |
| khong · từ khóa + mở rộng + qwen3.6-35b-nvfp4 + câu mẫu | 93.3 | 100.0 | 92.0 | 66.7 | 100.0 | 64.4 |
| khong · từ khóa + mở rộng + qwen3.8-flash-next | 93.3 | 85.7 | 84.0 | 66.7 | 40.0 | 55.6 |
| khong · từ khóa + mở rộng + qwen3.8-flash-next + câu mẫu | 86.7 | 85.7 | 88.0 | 66.7 | 40.0 | 60.0 |
| khong · từ khóa + mở rộng + DeepSeek-V4.1-Flash-1017 | 73.3 | 100.0 | 88.0 | 33.3 | 100.0 | 64.4 |
| khong · từ khóa + mở rộng + DeepSeek-V4.1-Flash-1017 + câu mẫu | 93.3 | 100.0 | 88.0 | 33.3 | 100.0 | 71.1 |
| bge-m3 · vector | 20.0 | 71.4 | 52.0 | 33.3 | 60.0 | 22.2 |
| bge-m3 · vector + mở rộng | 46.7 | 100.0 | 80.0 | 33.3 | 80.0 | 42.2 |
| bge-m3 · lai (vector + từ khóa mở rộng) | 33.3 | 100.0 | 72.0 | 33.3 | 80.0 | 46.7 |
| bge-m3 · lai + mở rộng cả hai nhánh | 40.0 | 85.7 | 80.0 | 33.3 | 100.0 | 55.6 |
| bge-m3 · vector + mở rộng + qwen3.6-35b-nvfp4 (câu mẫu) | 93.3 | 100.0 | 92.0 | 66.7 | 100.0 | 48.9 |
| bge-m3 · vector + mở rộng + qwen3.8-flash-next (câu mẫu) | 80.0 | 100.0 | 92.0 | 66.7 | 60.0 | 48.9 |
| bge-m3 · vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu) | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 64.4 |
| qwen3-0.6b · vector | 33.3 | 57.1 | 56.0 | 33.3 | 60.0 | 26.7 |
| qwen3-0.6b · vector + mở rộng | 60.0 | 85.7 | 80.0 | 33.3 | 100.0 | 64.4 |
| qwen3-0.6b · lai (vector + từ khóa mở rộng) | 40.0 | 71.4 | 64.0 | 33.3 | 60.0 | 51.1 |
| qwen3-0.6b · lai + mở rộng cả hai nhánh | 33.3 | 71.4 | 80.0 | 33.3 | 100.0 | 62.2 |
| qwen3-0.6b · vector + mở rộng + qwen3.6-35b-nvfp4 (câu mẫu) | 93.3 | 100.0 | 88.0 | 66.7 | 100.0 | 73.3 |
| qwen3-0.6b · vector + mở rộng + qwen3.8-flash-next (câu mẫu) | 93.3 | 100.0 | 84.0 | 66.7 | 80.0 | 75.6 |
| qwen3-0.6b · vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu) | 93.3 | 100.0 | 96.0 | 100.0 | 100.0 | 75.6 |
| aiteamvn · vector | 6.7 | 57.1 | 48.0 | 0.0 | 60.0 | 13.3 |
| aiteamvn · vector + mở rộng | 40.0 | 71.4 | 80.0 | 0.0 | 100.0 | 40.0 |
| aiteamvn · lai (vector + từ khóa mở rộng) | 20.0 | 57.1 | 72.0 | 0.0 | 80.0 | 40.0 |
| aiteamvn · lai + mở rộng cả hai nhánh | 33.3 | 57.1 | 80.0 | 0.0 | 100.0 | 55.6 |
| aiteamvn · vector + mở rộng + qwen3.6-35b-nvfp4 (câu mẫu) | 73.3 | 100.0 | 92.0 | 33.3 | 100.0 | 53.3 |
| aiteamvn · vector + mở rộng + qwen3.8-flash-next (câu mẫu) | 53.3 | 100.0 | 84.0 | 33.3 | 80.0 | 51.1 |
| aiteamvn · vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu) | 86.7 | 100.0 | 96.0 | 33.3 | 100.0 | 62.2 |

_Theo mảng: hit@10 (%)._

## Theo độ khó

| Cấu hình | de (37) | kho (28) | vua (35) |
|:--|--:|--:|--:|
| khong · từ khóa, không mở rộng | 8.1 | 7.1 | 5.7 |
| khong · từ khóa + mở rộng thuật ngữ | 27.0 | 21.4 | 42.9 |
| khong · từ khóa + mở rộng + qwen3.6-35b-nvfp4 | 70.3 | 64.3 | 80.0 |
| khong · từ khóa + mở rộng + qwen3.6-35b-nvfp4 + câu mẫu | 83.8 | 71.4 | 82.9 |
| khong · từ khóa + mở rộng + qwen3.8-flash-next | 70.3 | 57.1 | 80.0 |
| khong · từ khóa + mở rộng + qwen3.8-flash-next + câu mẫu | 67.6 | 60.7 | 85.7 |
| khong · từ khóa + mở rộng + DeepSeek-V4.1-Flash-1017 | 83.8 | 67.9 | 71.4 |
| khong · từ khóa + mở rộng + DeepSeek-V4.1-Flash-1017 + câu mẫu | 83.8 | 78.6 | 80.0 |
| bge-m3 · vector | 27.0 | 35.7 | 42.9 |
| bge-m3 · vector + mở rộng | 59.5 | 50.0 | 62.9 |
| bge-m3 · lai (vector + từ khóa mở rộng) | 46.0 | 53.6 | 68.6 |
| bge-m3 · lai + mở rộng cả hai nhánh | 67.6 | 46.4 | 71.4 |
| bge-m3 · vector + mở rộng + qwen3.6-35b-nvfp4 (câu mẫu) | 75.7 | 67.9 | 74.3 |
| bge-m3 · vector + mở rộng + qwen3.8-flash-next (câu mẫu) | 70.3 | 60.7 | 74.3 |
| bge-m3 · vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu) | 89.2 | 82.1 | 80.0 |
| qwen3-0.6b · vector | 32.4 | 32.1 | 51.4 |
| qwen3-0.6b · vector + mở rộng | 75.7 | 53.6 | 77.1 |
| qwen3-0.6b · lai (vector + từ khóa mở rộng) | 54.0 | 32.1 | 71.4 |
| qwen3-0.6b · lai + mở rộng cả hai nhánh | 64.9 | 42.9 | 80.0 |
| qwen3-0.6b · vector + mở rộng + qwen3.6-35b-nvfp4 (câu mẫu) | 89.2 | 60.7 | 94.3 |
| qwen3-0.6b · vector + mở rộng + qwen3.8-flash-next (câu mẫu) | 83.8 | 64.3 | 94.3 |
| qwen3-0.6b · vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu) | 86.5 | 78.6 | 94.3 |
| aiteamvn · vector | 21.6 | 28.6 | 28.6 |
| aiteamvn · vector + mở rộng | 56.8 | 50.0 | 54.3 |
| aiteamvn · lai (vector + từ khóa mở rộng) | 37.8 | 46.4 | 57.1 |
| aiteamvn · lai + mở rộng cả hai nhánh | 56.8 | 50.0 | 68.6 |
| aiteamvn · vector + mở rộng + qwen3.6-35b-nvfp4 (câu mẫu) | 70.3 | 75.0 | 68.6 |
| aiteamvn · vector + mở rộng + qwen3.8-flash-next (câu mẫu) | 59.5 | 67.9 | 65.7 |
| aiteamvn · vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu) | 78.4 | 85.7 | 71.4 |

_Theo độ khó: hit@10 (%)._

## Phiên bản mô hình

- bge-m3: `BAAI/bge-m3@5617a9f61b02`
- qwen3-0.6b: `Qwen/Qwen3-Embedding-0.6B@97b0c614be4d`
- aiteamvn: `AITeamVN/Vietnamese_Embedding@dea33aa1ab33`
