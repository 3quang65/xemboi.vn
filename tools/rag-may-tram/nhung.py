"""Bước 5: embedding bge-m3 (dense 1024 chiều, chuẩn hóa L2) trên GPU, theo lô."""
from __future__ import annotations

import os
import time
from pathlib import Path

import numpy as np

MO_HINH = "BAAI/bge-m3"
HF_HOME_MAC_DINH = r"D:\VibeCode\Antigravity\may-tram\hf"


class BoNhung:
    def __init__(self, ten: str = MO_HINH, lo: int = 32, do_dai_toi_da: int = 1024):
        os.environ.setdefault("HF_HOME", HF_HOME_MAC_DINH)
        # transformers 5 nạp trọng số .bin bằng nhiều luồng: trên Python 3.15 + Windows bị access violation.
        os.environ.setdefault("HF_DEACTIVATE_ASYNC_LOAD", "1")
        import torch
        from huggingface_hub import snapshot_download
        from sentence_transformers import SentenceTransformer

        try:
            duong = snapshot_download(ten, local_files_only=True)
        except Exception:
            duong = snapshot_download(ten, allow_patterns=[
                "*.json", "*.txt", "*.model", "pytorch_model.bin", "model.safetensors", "1_Pooling/*"])
        self.commit = Path(duong).name
        self.ten = ten
        self.phien_ban = f"{ten}@{self.commit[:12]}"
        self.gpu = torch.cuda.is_available()
        self.thiet_bi = "cuda" if self.gpu else "cpu"
        self.ten_gpu = torch.cuda.get_device_name(0) if self.gpu else None
        self.model = SentenceTransformer(duong, device=self.thiet_bi)
        if self.gpu:
            self.model.half()
        self.model.max_seq_length = do_dai_toi_da
        self.lo = lo
        self.torch = torch

    def so_token(self, van_ban: list[str]) -> int:
        tok = self.model.tokenizer(van_ban, truncation=True, max_length=self.model.max_seq_length)
        return sum(len(x) for x in tok["input_ids"])

    def nhung(self, van_ban: list[str]) -> tuple[np.ndarray, float]:
        """Trả về (ma trận float32 đã chuẩn hóa L2, số giây chạy)."""
        if not van_ban:
            return np.zeros((0, 1024), dtype=np.float32), 0.0
        if self.gpu:
            self.torch.cuda.synchronize()
        t0 = time.perf_counter()
        v = self.model.encode(van_ban, batch_size=self.lo, normalize_embeddings=True,
                              convert_to_numpy=True, show_progress_bar=False)
        if self.gpu:
            self.torch.cuda.synchronize()
        giay = time.perf_counter() - t0
        v = v.astype(np.float32)
        # Chuẩn hóa lại ở float32 (mô hình chạy fp16).
        v /= np.linalg.norm(v, axis=1, keepdims=True).clip(min=1e-12)
        return v, giay
