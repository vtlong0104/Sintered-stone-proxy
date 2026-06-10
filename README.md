# Sintered Stone Upscale Proxy

Proxy server trung gian để kết nối Google Flow với Replicate API (Real-ESRGAN).

## Các endpoint

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/upscale` | POST | Gửi ảnh lên Replicate để upscale 4x |
| `/api/status` | GET | Kiểm tra trạng thái xử lý |
| `/api/video-preview` | POST | Tạo thumbnail preview cho video |

---

## Hướng dẫn deploy lên Vercel

### Bước 1 — Tạo tài khoản Vercel
Vào vercel.com → đăng ký miễn phí bằng GitHub

### Bước 2 — Upload code
1. Tạo repo GitHub mới (đặt tên: `sintered-stone-proxy`)
2. Upload toàn bộ các file trong thư mục này lên repo
3. Vào Vercel → New Project → Import repo vừa tạo → Deploy

### Bước 3 — Thêm API Token vào Vercel
1. Vào project vừa deploy trên Vercel
2. Chọn Settings → Environment Variables
3. Thêm biến:
   - **Name:** `REPLICATE_API_TOKEN`
   - **Value:** (dán token Replicate mới của bạn vào đây)
4. Nhấn Save → Redeploy

### Bước 4 — Lấy URL proxy
Sau khi deploy xong, Vercel cấp URL dạng:
`https://sintered-stone-proxy.vercel.app`

---

## Tích hợp vào Google Flow

### Prompt Bước 5 cho Google Flow:

Sau khi tạo ảnh xong, gọi proxy server để upscale:

**Gửi yêu cầu upscale:**
```
POST https://sintered-stone-proxy.vercel.app/api/upscale
Content-Type: application/json

{
  "image_url": "{{url_ảnh_vừa_tạo}}",
  "scale": 4
}
```

Nhận về `prediction_id`, sau đó polling mỗi 3 giây:

**Kiểm tra trạng thái:**
```
GET https://sintered-stone-proxy.vercel.app/api/status?id={{prediction_id}}
```

Khi `status == "succeeded"`, lấy `output` làm ảnh thành phẩm cuối cùng.

---

## Lưu ý quan trọng

- Replicate miễn phí **500 lần/tháng**
- Thời gian xử lý mỗi ảnh: **10–30 giây**
- Ảnh sau upscale tăng **4x** độ phân giải, chi tiết vân đá rõ nét hơn nhiều
- Token Replicate phải được lưu trong Vercel Environment Variables, **không bao giờ hardcode trong code**
