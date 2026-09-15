import { siteConfig } from "@/lib/site-config";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata = {
  title: `关于我 - ${siteConfig.title}`,
  description: "关于我和这个网站的介绍",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <article className="card-base card-padding">
          <h1 className="text-3xl font-bold mb-6">关于我</h1>

          <div className="prose max-w-none">
            <p>
              大家好！我是<strong>Kylin</strong>也可以叫我小麒，一个在数字世界中默默无闻的一片叶子。
            </p>

            <h2>关于本站</h2>
            <p>
              这个是我这个对于AI和编程爱好者做的第一个个人网站，从部署到上线全是AI辅助我完成，不得不说AI真是个好东西
            </p>
            <p>全程使用Claude + 各大AI大模型 完成</p>

            <h2>我喜欢的东西</h2>

            <h3>AI 开发</h3>
            <p>
              这是我现在最想深挖的方向。我喜欢看着一个想法从模糊变清晰，也喜欢借助 AI 帮助自己理解问题、整理思路、提高效率。
            </p>

            <h3>Counter-Strike</h3>
            <p>
              我喜欢 CS 这种很纯粹的竞技感。它有节奏、有配合、有博弈，既考验反应，也考验思路。
            </p>

            <h3>洛克王国</h3>
            <p>
              如果说 CS 是紧张刺激的那一面，那洛克王国就更像是轻松、熟悉又有点情怀的那一面。
            </p>

            <h2>我想把这里做成什么样</h2>
            <p>这个博客对我来说，不只是一个放文章的网站。我更希望它像是我的一个小空间：</p>
            <ul>
              <li>记录学习 AI 开发的过程</li>
              <li>分享自己折腾网站和代码时的想法</li>
              <li>放一些日常、游戏和兴趣相关的内容</li>
              <li>见证自己从小白一步步成长起来</li>
            </ul>

            <h2>最后</h2>
            <p>
              现在的我或许还不算厉害，但我愿意持续学习，也愿意认真把喜欢的东西坚持下去。
              欢迎来到我的小站，希望未来我能在这里留下越来越多真正属于自己的内容。
            </p>
            <p>感谢你的来访！希望在这里能找到对你有用的内容！</p>
          </div>
        </article>
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}
