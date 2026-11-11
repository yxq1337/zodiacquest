/**
 * ZodiacQuest - Adsterra 广告统一配置
 * 站点: zodiacquest.pages.dev
 *
 * 架构参考 HexColorPro 已验证方案：
 * - 每个广告单元用独立的 atOptions 变量，避免多槽位互相覆盖
 * - 动态 createElement 注入脚本（确保执行，innerHTML 方式 script 不执行）
 * - 响应式：桌面/移动分别用不同尺寸
 *
 * 启用步骤：
 *   1. Adsterra 后台添加网站 zodiacquest.pages.dev，等待审核 (Approved)
 *   2. 创建至少 3 个 Banner 单元：728x90 / 320x50 / 300x250
 *   3. 把每个单元的 key 填入下方 units 对应字段
 *   4. 把 adsterra.enabled 改为 true
 *   5. 重新部署 wrangler pages deploy
 */

const AD_CONFIG = {
  adsterra: {
    enabled: true,   // 已激活（借用 hexcolorpro 单元临时验证，后续换 zodiacquest 专属 key）
    scriptBase: 'https://bauval.org/22/',
    units: {
      // 尺寸: { w, h, key } — key 从 Adsterra 后台复制
      '728x90':  { w: 728, h: 90,  key: '131835b8c969e0d2ec3c599d6e80e359' }, // 桌面顶部
      '320x50':  { w: 320, h: 50,  key: 'f8cef3d4340ad09befe293163fc95954' }, // 移动顶部
      '300x250': { w: 300, h: 250, key: '0a760729a913bb5684cf933fee299e42' }, // 底部矩形
      '160x600': { w: 160, h: 600, key: '799647663723d37d9385c04db486ccaf' }, // 侧边摩天楼
      '336x280': { w: 336, h: 280, key: 'cf04460b783c83a8ab8607e7e342c83b' }, // 大矩形
      '468x60':  { w: 468, h: 60,  key: 'f117eed8df5e5335837b80597fd7e9c3' }  // 小横幅
    }
  },

  // 页面 slot 名 → 响应式单元映射
  // HTML 中用 data-ad-slot="top_banner" / "bottom_banner"
  slotMap: {
    top_banner:    { desktop: '728x90',  mobile: '320x50'  },
    bottom_banner: { desktop: '300x250', mobile: '300x250' },
    sidebar:       { desktop: '160x600', mobile: '300x250' }
  }
};

// 存放每个单元的独立 atOptions，避免 GC 回收
const ADSTERRA_UNIT_STORE = {};

/**
 * 在指定容器加载一个 Adsterra 横幅广告
 * 每个单元用独立全局变量 + 独立脚本，杜绝互相覆盖
 */
function loadAdsterraBanner(container, unitName, unit) {
  if (!unit || !unit.key) return; // key 未配置则不加载

  container.innerHTML = '';
  container.classList.add('ad-live');
  container.classList.remove('ad-placeholder');

  // 1. 独立全局变量（根据 key 生成唯一名字）
  const varName = 'atOptions_' + unitName.replace(/[^a-zA-Z0-9]/g, '_');
  ADSTERRA_UNIT_STORE[varName] = {
    key: unit.key,
    format: 'iframe',
    height: unit.h,
    width: unit.w,
    params: {}
  };
  window[varName] = ADSTERRA_UNIT_STORE[varName];

  // 2. 配置脚本（把 Adsterra 读取的 atOptions 指向该单元独立变量）
  const cfg = document.createElement('script');
  cfg.text = 'var atOptions = window.' + varName + ';';
  container.appendChild(cfg);

  // 3. Adsterra 主脚本（读取当前 atOptions 后自行渲染 iframe）
  const s = document.createElement('script');
  s.src = AD_CONFIG.adsterra.scriptBase + unit.key;
  s.async = true;
  container.appendChild(s);
}

/**
 * 渲染页面上所有 [data-ad-slot] 槽位
 */
function renderAds() {
  const cfg = AD_CONFIG.adsterra;
  if (!cfg.enabled) return;

  const isMobile = window.matchMedia('(max-width: 760px)').matches;

  document.querySelectorAll('[data-ad-slot]').forEach(slot => {
    const slotName = slot.getAttribute('data-ad-slot');
    const map = AD_CONFIG.slotMap[slotName];
    if (!map) return;

    const unitName = isMobile ? map.mobile : map.desktop;
    const unit = cfg.units[unitName];
    if (!unit) return;

    loadAdsterraBanner(slot, unitName, unit);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderAds);
} else {
  renderAds();
}
