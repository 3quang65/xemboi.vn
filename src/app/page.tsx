import Script from 'next/script';
import { getHomeBodyHtml } from '@/lib/home-template';
import CouncilChatEmbed from '@/components/CouncilChatEmbed';

export default function HomePage() {
  const html = getHomeBodyHtml();
  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CouncilChatEmbed />
      <Script id="tuvi-opts-init" strategy="beforeInteractive">
        {`window.tuviDisplayOpts = { phuTinh: true, saoLuu: true, tamHop: false, phaiTuHoa: 'nam_phai' };`}
      </Script>
      <Script src="/lich.js?v=35" strategy="beforeInteractive" />
      <Script src="/tuvi.js?v=35" strategy="beforeInteractive" />
      <Script src="/thayba.js?v=35" strategy="beforeInteractive" />
      <Script src="/thuvien.js?v=35" strategy="beforeInteractive" />
      <Script src="/trondoi.js?v=35" strategy="beforeInteractive" />
      <Script src="/homnay.js?v=35" strategy="beforeInteractive" />
      <Script src="/app-main.js?v=35" strategy="afterInteractive" />
    </>
  );
}
