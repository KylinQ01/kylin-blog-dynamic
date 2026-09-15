#!/bin/bash
# 下载 GitHub 仓库中的所有图片到 public 目录

REPO="KylinQ01/New-KY"
BRANCH="main"
BASE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}"

# 创建目录
mkdir -p public/assets/images/sponsor
mkdir -p public/assets/images/effects
mkdir -p public/assets/images/ad
mkdir -p public/assets/music/cover
mkdir -p public/gallery/luoke
mkdir -p public/gallery/gugugaga
mkdir -p public/favicon
mkdir -p public/_astro

cd public

# 下载函数
download() {
  local url="$1"
  local output="$2"
  echo "Downloading: $output"
  curl -sL "$url" -o "$output" 2>/dev/null
}

# 静态资源图片
echo "=== 下载 assets 目录 ==="
download "${BASE_URL}/assets/images/sponsor/alipay.jpg" "assets/images/sponsor/alipay.jpg"
download "${BASE_URL}/assets/images/sponsor/alipay.png" "assets/images/sponsor/alipay.png"
download "${BASE_URL}/assets/images/sponsor/wechat.png" "assets/images/sponsor/wechat.png"
download "${BASE_URL}/assets/images/effects/sakura.png" "assets/images/effects/sakura.png"
download "${BASE_URL}/assets/images/ad/ad1.webp" "assets/images/ad/ad1.webp"
download "${BASE_URL}/assets/music/cover/109951169585655912.webp" "assets/music/cover/109951169585655912.webp"

# Favicon
echo "=== 下载 favicon 目录 ==="
download "${BASE_URL}/favicon/favicon.ico" "favicon/favicon.ico"
download "${BASE_URL}/favicon/favicon-dark-32.png" "favicon/favicon-dark-32.png"
download "${BASE_URL}/favicon/favicon-dark-128.png" "favicon/favicon-dark-128.png"
download "${BASE_URL}/favicon/favicon-dark-180.png" "favicon/favicon-dark-180.png"
download "${BASE_URL}/favicon/favicon-dark-192.png" "favicon/favicon-dark-192.png"
download "${BASE_URL}/favicon/favicon-light-32.png" "favicon/favicon-light-32.png"
download "${BASE_URL}/favicon/favicon-light-128.png" "favicon/favicon-light-128.png"
download "${BASE_URL}/favicon/favicon-light-180.png" "favicon/favicon-light-180.png"
download "${BASE_URL}/favicon/favicon-light-192.png" "favicon/favicon-light-192.png"

# 相册图片 - gugugaga (4张)
echo "=== 下载 gugugaga 相册 ==="
for i in "107_2" "108_2" "109_2" "110_2"; do
  ext="jpg"
  download "${BASE_URL}/gallery/gugugaga/微信图片_20260624194440_${i}.${ext}" "gallery/gugugaga/微信图片_20260624194440_${i}.${ext}"
done

# 相册图片 - luoke (前20张，避免太多)
echo "=== 下载 luoke 相册 (前20张) ==="
luoke_files=(
  "193819_20_2.png"
  "193828_21_2.png"
  "193831_22_2.jpg"
  "193834_23_2.jpg"
  "193834_24_2.jpg"
  "193835_25_2.jpg"
  "193836_26_2.jpg"
  "193840_27_2.jpg"
  "193841_28_2.jpg"
  "193844_29_2.jpg"
  "193844_30_2.jpg"
  "193845_31_2.jpg"
  "193846_32_2.jpg"
  "193847_33_2.jpg"
  "193851_34_2.jpg"
  "193856_35_2.jpg"
  "193857_36_2.jpg"
  "193858_37_2.jpg"
  "193859_38_2.jpg"
  "193906_39_2.png"
)

for f in "${luoke_files[@]}"; do
  download "${BASE_URL}/gallery/luoke/微信图片_20260624${f}" "gallery/luoke/微信图片_20260624${f}"
done

# Astro 构建的图片 (logo, avatar, cover 等)
echo "=== 下载 _astro 图片 ==="
download "${BASE_URL}/_astro/logo.xagRvpht_1bcJrT.webp" "_astro/logo.webp"
download "${BASE_URL}/_astro/avatar.BcAu2wMi.avif" "_astro/avatar.avif"
download "${BASE_URL}/_astro/cover.LVH5wcXY.avif" "_astro/cover.avif"
download "${BASE_URL}/_astro/firefly.EzH7fIYR.png" "_astro/firefly.png"

# 壁纸图片 (前4张)
echo "=== 下载壁纸图片 ==="
for i in "107_2" "108_2" "109_2" "110_2"; do
  download "${BASE_URL}/_astro/微信图片_20260624194440_${i}.Bft3BNWA_1pGdwU.webp" "_astro/wallpaper_${i}.webp"
done

echo ""
echo "=== 下载完成！ ==="
echo "文件数量: $(find . -type f | wc -l)"
echo "总大小: $(du -sh . | cut -f1)"
