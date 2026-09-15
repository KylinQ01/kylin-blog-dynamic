import { siteConfig } from "@/lib/site-config";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommentForm } from "@/components/CommentForm";
import Image from "next/image";

export const metadata = {
  title: `打赏支持 - ${siteConfig.title}`,
  description: "如果我的内容对你有帮助，欢迎通过以下方式打赏我，你的支持是我持续创作的动力！",
};

const sponsorMethods = [
  {
    name: "支付宝",
    description: "使用支付宝扫码打赏",
    qrCode: "/assets/images/sponsor/alipay.jpg",
  },
  {
    name: "微信",
    description: "使用微信扫码打赏",
    qrCode: "/assets/images/sponsor/wechat.png",
  },
];

export default function SponsorPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">打赏支持</h1>
          <p className="text-[var(--muted)]">
            如果我的内容对你有帮助，欢迎通过以下方式打赏我，你的支持是我持续创作的动力！
          </p>
          <p className="text-sm text-[var(--muted)] mt-2">
            您的打赏将用于服务器维护、内容创作和功能开发，帮助我持续提供优质内容。
          </p>
        </div>

        {/* Sponsor Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {sponsorMethods.map((method) => (
            <div key={method.name} className="card-base card-padding text-center">
              <h3 className="font-bold mb-2">{method.name}</h3>
              <p className="text-sm text-[var(--muted)] mb-4">{method.description}</p>
              <div className="w-40 h-40 mx-auto rounded-lg overflow-hidden bg-[var(--accent)] flex items-center justify-center relative">
                <Image
                  src={method.qrCode}
                  alt={`${method.name}收款码`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>

        <CommentForm page="sponsor" />
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}
