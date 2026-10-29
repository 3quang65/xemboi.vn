import React from 'react';
import Link from 'next/link';

interface SubpageFooterProps {
  currentPath?: string;
}

export const FOOTER_NAV_ITEMS = [
  {
    href: '/',
    label: 'Lập Lá Số Tử Vi',
    icon: '🔮',
    desc: 'Bản đồ 12 cung Nam Phái chuẩn xác',
  },
  {
    href: '/tu-vi-hom-nay',
    label: 'Tử Vi Hôm Nay',
    icon: '📅',
    desc: '12 con giáp vận trình mỗi ngày',
  },
  {
    href: '/tu-vi-ngay-mai',
    label: 'Tử Vi Ngày Mai',
    icon: '🌅',
    desc: 'Đón trước cát hung ngày tới',
  },
  {
    href: '/tu-vi-tron-doi',
    label: 'Tử Vi Trọn Đời',
    icon: '📜',
    desc: '60 Hoa Giáp tiền bần hậu phú',
  },
  {
    href: '/tu-tru',
    label: 'Lập Lá Số Tứ Trụ',
    icon: '⚖️',
    desc: 'Bát Tự tìm Dụng Thần ngũ hành',
  },
  {
    href: '/boi-dich',
    label: 'Gieo Quẻ Kinh Dịch',
    icon: '☯️',
    desc: '64 quẻ Thể Dụng Mai Hoa dự trắc',
  },
  {
    href: '/kien-thuc',
    label: 'Kiến Thức & Phong Thủy',
    icon: '📚',
    desc: 'Kho tàng cổ thư & huyền học',
  },
];

export default function SubpageFooter({ currentPath }: SubpageFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="xb-footer">
      <div className="wrap">
        <div className="xb-footer-hub">
          <div className="xb-footer-title">
            <span>CHUYÊN MỤC TỬ VI &amp; HUYỀN HỌC</span>
          </div>

          <nav className="xb-footer-nav" aria-label="Chuyên mục XemBoi.vn">
            {FOOTER_NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`xb-nav-card ${isActive ? 'active' : ''}`}
                >
                  <span className="xb-nav-icon">{item.icon}</span>
                  <span className="xb-nav-text">
                    <strong>{item.label}</strong>
                    <small>{item.desc}</small>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="xb-footer-bottom">
          <p className="xb-footer-brand">
            © {currentYear} <strong>XemBoi.vn</strong> — Nền Tảng Tử Vi &amp; Bát Đại Danh Sư
          </p>
          <p className="xb-footer-note">
            XemBoi.vn mang tính chiêm nghiệm và tham khảo văn hóa truyền thống Á Đông.
            <br />
            Lịch âm tính theo múi giờ Việt Nam (GMT+7). Triết lý cổ nhân: <em>&ldquo;Đức năng thắng số&rdquo;</em>.
          </p>
        </div>
      </div>
    </footer>
  );
}
