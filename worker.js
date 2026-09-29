// ==========================================
// 🎮 MEHDI GAME HUB — Worker with Admin + AI
// ==========================================

const ADMIN_PASSWORD = "1234Mm@56789";

const AI_SYSTEM_PROMPT = "تو دستیار فارسی‌زبان سایت MEHDI GAME HUB هستی، یک مرکز گیمینگ با معرفی بازی، اخبار گیم، ابزارهای گیمرها و پروژه‌های گیمینگ. کوتاه و با انرژی جواب بده.";

const DEFAULT_CONTENT = {
  site_name: "MEHDI GAME HUB",
  hero_title: "مرکز گیمینگ نسل جدید",
  hero_desc: "معرفی بازی‌ها، آخرین اخبار گیم، ابزارهای کاربردی گیمرها و پروژه‌های گیمینگ — همه در یکجا",
  news_title_1: "عرضه GTA VI به ۲۰۲۶ موکول شد",
  news_desc_1: "راکستار رسماً اعلام کرد که عرضه GTA VI به سال ۲۰۲۶ موکول شده است.",
  news_title_2: "بروزرسانی بزرگ Call of Duty",
  news_desc_2: "نقشه‌های جدید، سلاح‌ها و حالت‌های بازی جدید اضافه شد.",
  news_title_3: "کنسول PlayStation 5 Pro معرفی شد",
  news_desc_3: "سونی نسخه پرو پلی‌استیشن ۵ را با قدرت بالاتر معرفی کرد.",
  tool_1_title: "محاسبه‌گر FPS",
  tool_1_desc: "نرخ فریم محبوب‌ترین بازی‌ها را چک کن.",
  tool_2_title: "راهنمای تنظیمات",
  tool_2_desc: "بهترین تنظیمات گرافیکی برای هر بازی.",
  tool_3_title: "تقویم عرضه بازی‌ها",
  tool_3_desc: "تاریخ عرضه بازی‌های جدید را دنبال کن.",
  tool_4_title: "ریویو و امتیاز بازی‌ها",
  tool_4_desc: "امتیاز و نقد بازی‌ها را بخوان.",
  project_1_title: "پروژه مپ‌میکینگ",
  project_1_desc: "ساخت نقشه‌های سفارشی برای بازی‌های مولتی‌پلیر.",
  project_2_title: "پروژه آنتی‌چیت",
  project_2_desc: "سیستم تشخیص تقلب برای سرورهای MTA.",
  project_3_title: "پروژه سایت گیمینگ",
  project_3_desc: "ساخت و توسعه MEHDI GAME HUB.",
  footer_text: "ساخته‌شده با ❤️ توسط گیمرها برای گیمرها"
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function htmlResponse(html) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
}

async function getContent(env) {
  if (!env.KV) return DEFAULT_CONTENT;
  const data = await env.KV.get("site_content");
  return data ? JSON.parse(data) : DEFAULT_CONTENT;
}

async function saveContent(env, content) {
  if (!env.KV) return;
  await env.KV.put("site_content", JSON.stringify(content));
}

async function getMessages(env) {
  if (!env.KV) return [];
  const data = await env.KV.get("messages");
  return data ? JSON.parse(data) : [];
}

async function addMessage(env, message) {
  if (!env.KV) return;
  const messages = await getMessages(env);
  messages.unshift(message);
  await env.KV.put("messages", JSON.stringify(messages));
}

const GAMES = [
  { name: "GTA VI", genre: "اکشن-ماجراجویی", platform: "PS5, Xbox, PC", img: "🎮", color: "#ff6b6b" },
  { name: "Call of Duty", genre: "شوتر اول‌شخص", platform: "PC, Console", img: "🔫", color: "#6c5ce7" },
  { name: "FIFA 26", genre: "ورزشی", platform: "PC, Console", img: "⚽", color: "#00d2ff" },
  { name: "Cyberpunk 2077", genre: "نقش‌آفرینی", platform: "PC, PS5, Xbox", img: "🌃", color: "#feca57" },
  { name: "Valorant", genre: "شوتر تاکتیکی", platform: "PC", img: "🎯", color: "#ff6b6b" },
  { name: "Minecraft", genre: "سندباکس", platform: "همه پلتفرم‌ها", img: "⛏️", color: "#4ade80" },
  { name: "MTA", genre: "مولتی‌پلیر", platform: "PC", img: "🚗", color: "#6c5ce7" },
  { name: "Forza Horizon", genre: "مسابقه‌ای", platform: "PC, Xbox", img: "🏎️", color: "#00d2ff" }
];

function buildSiteHTML(c) {
  const gamesCards = GAMES.map((g, i) => [
    '<div class="game-card glass reveal" style="animation-delay:' + (i * 0.1) + 's">',
    '<div class="game-img" style="background:linear-gradient(135deg,' + g.color + '33,' + g.color + '11)">' + g.img + '</div>',
    '<div class="game-info">',
    '<h3>' + g.name + '</h3>',
    '<span class="game-genre">' + g.genre + '</span>',
    '<span class="game-platform">' + g.platform + '</span>',
    '</div></div>'
  ].join('')).join('');

  return [
'<!DOCTYPE html>',
'<html lang="fa" dir="rtl">',
'<head>',
'<meta charset="UTF-8"/>',
'<meta name="viewport" content="width=device-width,initial-scale=1.0"/>',
'<title>' + c.site_name + '</title>',
'<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet"/>',
'<style>',
'*{margin:0;padding:0;box-sizing:border-box}',
':root{--bg:#0a0a12;--bg-alt:#0f0f1a;--surface:rgba(255,255,255,0.04);--surface-hover:rgba(255,255,255,0.08);--border:rgba(255,255,255,0.08);--text:#e8e8f0;--muted:#8888a0;--primary:#6c5ce7;--primary-hover:#7f70f0;--accent:#00d2ff;--neon:#ff6b6b;--radius:16px;--transition:0.3s cubic-bezier(0.4,0,0.2,1);--shadow:0 8px 32px rgba(0,0,0,0.3)}',
'html{scroll-behavior:smooth}',
'body{font-family:Vazirmatn,sans-serif;background:var(--bg);color:var(--text);line-height:1.7;overflow-x:hidden}',
'.container{max-width:1200px;margin:0 auto;padding:0 24px}',
'.glass{background:var(--surface);backdrop-filter:blur(12px);border:1px solid var(--border);border-radius:var(--radius)}',
'.header{position:fixed;top:0;left:0;right:0;z-index:1000;transition:var(--transition);padding:16px 0}',
'.header.scrolled{background:rgba(10,10,18,0.9);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:10px 0}',
'.nav{display:flex;align-items:center;justify-content:space-between}',
'.logo{display:flex;align-items:center;gap:8px;font-size:1.2rem;font-weight:800;color:var(--text);text-decoration:none;letter-spacing:-0.5px}',
'.logo-icon{font-size:1.6rem}',
'.logo span{background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}',
'.nav-links{display:flex;list-style:none;gap:24px;align-items:center}',
'.nav-links a{color:var(--muted);text-decoration:none;font-size:0.9rem;font-weight:600;transition:var(--transition)}',
'.nav-links a:hover{color:var(--accent)}',
'.nav-search{display:flex;align-items:center;gap:8px}',
'.nav-search input{padding:8px 14px;border-radius:50px;background:rgba(0,0,0,0.3);border:1px solid var(--border);color:var(--text);font-family:inherit;font-size:0.85rem;outline:none;width:160px;transition:var(--transition)}',
'.nav-search input:focus{border-color:var(--primary);width:200px}',
'.menu-toggle{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}',
'.menu-toggle span{width:24px;height:2px;background:var(--text);border-radius:2px;transition:var(--transition)}',
'.menu-toggle.active span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}',
'.menu-toggle.active span:nth-child(2){opacity:0}',
'.menu-toggle.active span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}',
'.hero{min-height:90vh;display:flex;align-items:center;justify-content:center;text-align:center;position:relative;overflow:hidden;padding:100px 0 60px}',
'.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 30%,rgba(108,92,231,0.2),transparent 50%),radial-gradient(ellipse at 80% 70%,rgba(0,210,255,0.15),transparent 50%),radial-gradient(ellipse at 50% 50%,rgba(255,107,107,0.08),transparent 60%);z-index:-1}',
'.hero-bg::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(108,92,231,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(108,92,231,0.03) 1px,transparent 1px);background-size:50px 50px;animation:gridMove 4s linear infinite}',
'@keyframes gridMove{from{background-position:0 0}to{background-position:0 50px}}',
'.hero-content{position:relative;z-index:1;animation:fadeInUp 0.8s ease}',
'.hero-badge{display:inline-block;padding:8px 20px;border-radius:50px;font-size:0.85rem;color:var(--accent);margin-bottom:24px;border:1px solid rgba(0,210,255,0.2)}',
'.hero-title{font-size:clamp(2rem,6vw,4.5rem);font-weight:900;line-height:1.2;margin-bottom:20px;background:linear-gradient(135deg,#fff,var(--accent),var(--primary));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}',
'.hero-desc{font-size:clamp(1rem,2vw,1.25rem);color:var(--muted);max-width:600px;margin:0 auto 36px}',
'.hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}',
'.btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 32px;border-radius:50px;font-size:1rem;font-weight:700;text-decoration:none;cursor:pointer;border:none;transition:var(--transition);font-family:inherit}',
'.btn-primary{background:linear-gradient(135deg,var(--primary),var(--primary-hover));color:#fff;box-shadow:0 4px 20px rgba(108,92,231,0.4)}',
'.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 30px rgba(108,92,231,0.6)}',
'.btn-secondary{background:var(--surface);color:var(--text);border:1px solid var(--border)}',
'.btn-secondary:hover{background:var(--surface-hover);transform:translateY(-2px);border-color:var(--accent)}',
'.btn-full{width:100%}',
'.section{padding:80px 0;position:relative}',
'.section-alt{background:var(--bg-alt)}',
'.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;flex-wrap:wrap;gap:12px}',
'.section-title{font-size:clamp(1.6rem,4vw,2.5rem);font-weight:800;display:flex;align-items:center;gap:10px}',
'.section-title .icon{font-size:2rem}',
'.section-link{color:var(--accent);text-decoration:none;font-size:0.9rem;font-weight:600;transition:var(--transition)}',
'.section-link:hover{color:var(--primary)}',
'.games-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px}',
'.game-card{overflow:hidden;transition:var(--transition);cursor:pointer}',
'.game-card:hover{transform:translateY(-6px);border-color:var(--primary);box-shadow:0 12px 40px rgba(108,92,231,0.2)}',
'.game-img{height:140px;display:flex;align-items:center;justify-content:center;font-size:3.5rem;border-bottom:1px solid var(--border);transition:var(--transition)}',
'.game-card:hover .game-img{font-size:4rem}',
'.game-info{padding:16px}',
'.game-info h3{font-size:1.1rem;margin-bottom:6px}',
'.game-genre{display:inline-block;padding:3px 10px;border-radius:50px;background:rgba(108,92,231,0.15);color:var(--primary);font-size:0.75rem;font-weight:600;margin-bottom:6px}',
'.game-platform{display:block;color:var(--muted);font-size:0.8rem}',
'.news-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}',
'.news-card{padding:24px;transition:var(--transition)}',
'.news-card:hover{transform:translateY(-4px);background:var(--surface-hover)}',
'.news-card .news-badge{display:inline-block;padding:4px 12px;border-radius:50px;background:rgba(255,107,107,0.15);color:var(--neon);font-size:0.75rem;font-weight:700;margin-bottom:12px}',
'.news-card h3{font-size:1.1rem;margin-bottom:8px}',
'.news-card p{color:var(--muted);font-size:0.9rem}',
'.news-card .news-date{color:#555;font-size:0.8rem;margin-top:10px}',
'.tools-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}',
'.tool-card{padding:28px;text-align:center;transition:var(--transition)}',
'.tool-card:hover{transform:translateY(-4px);border-color:var(--accent);background:var(--surface-hover)}',
'.tool-icon{font-size:2.5rem;margin-bottom:14px}',
'.tool-card h3{font-size:1.1rem;margin-bottom:8px}',
'.tool-card p{color:var(--muted);font-size:0.9rem}',
'.projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}',
'.project-card{padding:28px;transition:var(--transition);border-left:3px solid var(--primary)}',
'.project-card:hover{transform:translateY(-4px);border-left-color:var(--accent)}',
'.project-card h3{font-size:1.1rem;margin-bottom:8px}',
'.project-card p{color:var(--muted);font-size:0.9rem}',
'.project-tag{display:inline-block;padding:3px 10px;border-radius:50px;background:rgba(0,210,255,0.1);color:var(--accent);font-size:0.75rem;margin-top:10px}',
'.footer{background:var(--bg-alt);padding:50px 0 30px;border-top:1px solid var(--border)}',
'.footer-content{text-align:center;display:flex;flex-direction:column;align-items:center;gap:16px}',
'.footer-brand{display:flex;align-items:center;gap:8px;font-size:1.3rem;font-weight:800}',
'.footer-brand span{background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}',
'.footer-text{color:var(--muted);font-size:0.9rem}',
'.footer-links{display:flex;gap:24px;flex-wrap:wrap;justify-content:center}',
'.footer-links a{color:var(--muted);text-decoration:none;font-size:0.9rem;transition:var(--transition)}',
'.footer-links a:hover{color:var(--accent)}',
'.footer-copy{color:#555;font-size:0.85rem;margin-top:8px}',
'.admin-link{position:fixed;bottom:20px;left:20px;width:40px;height:40px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.2rem;color:var(--muted);transition:var(--transition);z-index:100;backdrop-filter:blur(12px)}',
'.admin-link:hover{color:var(--text);background:var(--surface-hover)}',
'.chat-toggle{position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-size:1.5rem;cursor:pointer;border:none;z-index:100;box-shadow:0 4px 20px rgba(108,92,231,0.4);transition:var(--transition)}',
'.chat-toggle:hover{transform:scale(1.1)}',
'.chat-box{position:fixed;bottom:90px;right:20px;width:360px;max-width:calc(100vw - 40px);height:480px;max-height:calc(100vh - 120px);background:var(--bg-alt);border:1px solid var(--border);border-radius:20px;display:none;flex-direction:column;z-index:101;box-shadow:0 20px 60px rgba(0,0,0,0.5);overflow:hidden}',
'.chat-box.active{display:flex}',
'.chat-header{padding:16px 20px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}',
'.chat-header h3{font-size:1rem;display:flex;align-items:center;gap:8px}',
'.chat-close{background:none;border:none;color:var(--muted);font-size:1.5rem;cursor:pointer;transition:var(--transition)}',
'.chat-close:hover{color:var(--text)}',
'.chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}',
'.chat-msg{max-width:80%;padding:10px 16px;border-radius:16px;font-size:0.9rem;line-height:1.5}',
'.chat-msg.user{align-self:flex-start;background:var(--primary);color:#fff;border-bottom-left-radius:4px}',
'.chat-msg.bot{align-self:flex-end;background:var(--surface);border:1px solid var(--border);border-bottom-right-radius:4px}',
'.chat-msg.typing{color:var(--muted);font-style:italic}',
'.chat-input-area{padding:12px 16px;border-top:1px solid var(--border);display:flex;gap:8px}',
'.chat-input{flex:1;padding:10px 16px;border-radius:50px;background:rgba(0,0,0,0.3);border:1px solid var(--border);color:var(--text);font-family:inherit;font-size:0.9rem;outline:none}',
'.chat-input:focus{border-color:var(--primary)}',
'.chat-send{width:40px;height:40px;border-radius:50%;background:var(--primary);color:#fff;border:none;cursor:pointer;font-size:1.1rem;transition:var(--transition);flex-shrink:0}',
'.chat-send:hover{transform:scale(1.1)}',
'.search-results{margin-bottom:30px;display:none}',
'.search-results.active{display:block}',
'.search-results h3{margin-bottom:16px;color:var(--accent)}',
'@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}',
'.reveal{opacity:0;transform:translateY(30px);transition:opacity 0.6s ease,transform 0.6s ease}',
'.reveal.visible{opacity:1;transform:translateY(0)}',
'@media(max-width:768px){.nav-links{position:fixed;top:64px;right:-100%;flex-direction:column;background:rgba(10,10,18,0.97);backdrop-filter:blur(20px);width:100%;padding:24px;gap:16px;transition:var(--transition);border-bottom:1px solid var(--border)}.nav-links.active{right:0}.menu-toggle{display:flex}.nav-search input{width:120px}.section{padding:60px 0}.hero-buttons{flex-direction:column;align-items:center}.btn{width:100%;max-width:280px}.games-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}}',
'@media(max-width:480px){.container{padding:0 16px}.games-grid{grid-template-columns:1fr 1fr}.news-grid{grid-template-columns:1fr}.tools-grid{grid-template-columns:1fr}}',
'</style>',
'</head>',
'<body>',
'<header id="header" class="header">',
'<nav class="nav container">',
'<a href="#" class="logo"><span class="logo-icon">🎮</span><span>' + c.site_name + '</span></a>',
'<ul class="nav-links" id="navLinks">',
'<li><a href="#hero">خانه</a></li>',
'<li><a href="#games">بازی‌ها</a></li>',
'<li><a href="#news">اخبار</a></li>',
'<li><a href="#tools">ابزارها</a></li>',
'<li><a href="#projects">پروژه‌ها</a></li>',
'</ul>',
'<div class="nav-search"><input type="text" id="searchInput" placeholder="🔍 جستجوی بازی..." oninput="searchGames()"/></div>',
'<button class="menu-toggle" id="menuToggle"><span></span><span></span><span></span></button>',
'</nav>',
'</header>',
'<section id="hero" class="hero">',
'<div class="container hero-content">',
'<div class="hero-badge glass">🎮 مرکز گیمینگ حرفه‌ای</div>',
'<h1 class="hero-title">' + c.hero_title + '</h1>',
'<p class="hero-desc">' + c.hero_desc + '</p>',
'<div class="hero-buttons">',
'<a href="#games" class="btn btn-primary">🎮 بازی‌های محبوب</a>',
'<a href="#news" class="btn btn-secondary">📰 آخرین اخبار</a>',
'</div>',
'</div>',
'<div class="hero-bg"></div>',
'</section>',
'<div class="search-results container" id="searchResults"></div>',
'<section id="games" class="section">',
'<div class="container">',
'<div class="section-header"><h2 class="section-title"><span class="icon">🎮</span> بازی‌های محبوب</h2><a href="#" class="section-link">همه بازی‌ها ←</a></div>',
'<div class="games-grid" id="gamesGrid">' + gamesCards + '</div>',
'</div>',
'</section>',
'<section id="news" class="section section-alt">',
'<div class="container">',
'<div class="section-header"><h2 class="section-title"><span class="icon">📰</span> آخرین اخبار گیم</h2><a href="#" class="section-link">همه اخبار ←</a></div>',
'<div class="news-grid">',
'<div class="news-card glass reveal"><span class="news-badge">داغ 🔥</span><h3>' + c.news_title_1 + '</h3><p>' + c.news_desc_1 + '</p><div class="news-date">۲۸ سپتامبر ۲۰۲۶</div></div>',
'<div class="news-card glass reveal"><span class="news-badge">جدید</span><h3>' + c.news_title_2 + '</h3><p>' + c.news_desc_2 + '</p><div class="news-date">۲۷ سپتامبر ۲۰۲۶</div></div>',
'<div class="news-card glass reveal"><span class="news-badge">آپدیت</span><h3>' + c.news_title_3 + '</h3><p>' + c.news_desc_3 + '</p><div class="news-date">۲۶ سپتامبر ۲۰۲۶</div></div>',
'</div>',
'</div>',
'</section>',
'<section id="tools" class="section">',
'<div class="container">',
'<div class="section-header"><h2 class="section-title"><span class="icon">🛠️</span> ابزارهای گیمرها</h2></div>',
'<div class="tools-grid">',
'<div class="tool-card glass reveal"><div class="tool-icon">📊</div><h3>' + c.tool_1_title + '</h3><p>' + c.tool_1_desc + '</p></div>',
'<div class="tool-card glass reveal"><div class="tool-icon">⚙️</div><h3>' + c.tool_2_title + '</h3><p>' + c.tool_2_desc + '</p></div>',
'<div class="tool-card glass reveal"><div class="tool-icon">📅</div><h3>' + c.tool_3_title + '</h3><p>' + c.tool_3_desc + '</p></div>',
'<div class="tool-card glass reveal"><div class="tool-icon">⭐</div><h3>' + c.tool_4_title + '</h3><p>' + c.tool_4_desc + '</p></div>',
'</div>',
'</div>',
'</section>',
'<section id="projects" class="section">',
'<div class="container">',
'<div class="section-header"><h2 class="section-title"><span class="icon">💻</span> پروژه‌های گیمینگ</h2></div>',
'<div class="projects-grid">',
'<div class="project-card glass reveal"><h3>' + c.project_1_title + '</h3><p>' + c.project_1_desc + '</p><span class="project-tag">MTA</span></div>',
'<div class="project-card glass reveal"><h3>' + c.project_2_title + '</h3><p>' + c.project_2_desc + '</p><span class="project-tag">امنیت</span></div>',
'<div class="project-card glass reveal"><h3>' + c.project_3_title + '</h3><p>' + c.project_3_desc + '</p><span class="project-tag">وب</span></div>',
'</div>',
'</div>',
'</section>',
'<footer class="footer">',
'<div class="container footer-content">',
'<div class="footer-brand"><span class="logo-icon">🎮</span><span>' + c.site_name + '</span></div>',
'<p class="footer-text">' + c.footer_text + '</p>',
'<div class="footer-links">',
'<a href="#games">بازی‌ها</a><a href="#news">اخبار</a><a href="#tools">ابزارها</a><a href="#projects">پروژه‌ها</a>',
'</div>',
'<p class="footer-copy">© 2026 ' + c.site_name + ' — تمام حقوق محفوظ است</p>',
'</div>',
'</footer>',
'<a href="/admin" class="admin-link" title="پنل مدیریت">⚙️</a>',
'<button class="chat-toggle" onclick="toggleChat()">🤖</button>',
'<div class="chat-box" id="chatBox">',
'<div class="chat-header"><h3>🤖 دستیار گیمینگ</h3><button class="chat-close" onclick="toggleChat()">×</button></div>',
'<div class="chat-messages" id="chatMessages"></div>',
'<div class="chat-input-area"><input type="text" class="chat-input" id="chatInput" placeholder="سوالت رو بپرس..." onkeypress="if(event.key===\'Enter\')sendChat()"/><button class="chat-send" onclick="sendChat()">➤</button></div>',
'</div>',
'<script>',
'const header=document.getElementById("header");',
'window.addEventListener("scroll",()=>{if(window.scrollY>20)header.classList.add("scrolled");else header.classList.remove("scrolled")});',
'const menuToggle=document.getElementById("menuToggle");const navLinks=document.getElementById("navLinks");',
'menuToggle.addEventListener("click",()=>{menuToggle.classList.toggle("active");navLinks.classList.toggle("active")});',
'document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>{menuToggle.classList.remove("active");navLinks.classList.remove("active")}));',
'const revealElements=document.querySelectorAll(".game-card,.news-card,.tool-card,.project-card");',
'revealElements.forEach(a=>a.classList.add("reveal"));',
'const observer=new IntersectionObserver(e=>{e.forEach(a=>{if(a.isIntersecting)a.target.classList.add("visible")})},{threshold:0.1});',
'revealElements.forEach(a=>observer.observe(a));',
'function searchGames(){var q=document.getElementById("searchInput").value.trim().toLowerCase();var results=document.getElementById("searchResults");if(!q){results.classList.remove("active");return}var games=document.querySelectorAll(".game-card");var found=[];games.forEach(g=>{var name=g.querySelector("h3").textContent.toLowerCase();var genre=g.querySelector(".game-genre").textContent.toLowerCase();if(name.includes(q)||genre.includes(q)){found.push(g.outerHTML)}});results.classList.add("active");if(found.length>0){results.innerHTML="<h3>🔍 نتایج جستجو ("+found.length+")</h3><div class=\'games-grid\'>"+found.join("")+"</div>"}else{results.innerHTML="<h3>❌ بازی پیدا نشد</h3>"}}',
'function toggleChat(){var box=document.getElementById("chatBox");box.classList.toggle("active")}',
'function addChatMsg(text,sender){var div=document.createElement("div");div.className="chat-msg "+sender;div.textContent=text;document.getElementById("chatMessages").appendChild(div);document.getElementById("chatMessages").scrollTop=document.getElementById("chatMessages").scrollHeight}',
'async function sendChat(){var input=document.getElementById("chatInput");var text=input.value.trim();if(!text)return;input.value="";addChatMsg(text,"user");addChatMsg("در حال تایپ...","typing");try{var res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text})});var data=await res.json();document.getElementById("chatMessages").lastChild.remove();if(data.success){addChatMsg(data.reply,"bot")}else{addChatMsg("متأسفم، الان جواب نمی‌تونم بدم.","bot")}}catch(e){document.getElementById("chatMessages").lastChild.remove();addChatMsg("خطا در ارتباط.","bot")}}',
'</script>',
'</body>',
'</html>'
  ].join('\n');
}

function buildAdminHTML() {
  return [
'<!DOCTYPE html>',
'<html lang="fa" dir="rtl">',
'<head>',
'<meta charset="UTF-8"/>',
'<meta name="viewport" content="width=device-width,initial-scale=1.0"/>',
'<title>پنل مدیریت — MEHDI GAME HUB</title>',
'<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet"/>',
'<style>',
'*{margin:0;padding:0;box-sizing:border-box}',
':root{--bg:#0a0a12;--surface:rgba(255,255,255,0.04);--surface-hover:rgba(255,255,255,0.08);--border:rgba(255,255,255,0.08);--text:#e8e8f0;--muted:#8888a0;--primary:#6c5ce7;--accent:#00d2ff;--danger:#ff6b6b;--success:#4ade80}',
'body{font-family:Vazirmatn,sans-serif;background:var(--bg);color:var(--text);line-height:1.7;min-height:100vh}',
'.login-box{max-width:400px;margin:100px auto;padding:40px;background:var(--surface);border:1px solid var(--border);border-radius:20px;backdrop-filter:blur(12px)}',
'.login-box h1{text-align:center;margin-bottom:24px;font-size:1.5rem}',
'.login-box input{width:100%;padding:12px 16px;border-radius:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border);color:var(--text);font-family:inherit;font-size:1rem;margin-bottom:16px}',
'.login-box input:focus{outline:none;border-color:var(--primary)}',
'.login-box button{width:100%;padding:12px;border-radius:10px;background:linear-gradient(135deg,var(--primary),#7f70f0);color:#fff;border:none;font-family:inherit;font-size:1rem;font-weight:600;cursor:pointer;transition:0.3s}',
'.login-box button:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(108,92,231,0.3)}',
'.login-error{text-align:center;color:var(--danger);margin-top:12px;font-size:0.9rem;min-height:20px}',
'.admin-container{max-width:900px;margin:0 auto;padding:24px}',
'.admin-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid var(--border)}',
'.admin-header h1{font-size:1.5rem}',
'.admin-header a{color:var(--muted);text-decoration:none;font-size:0.9rem;transition:0.3s}',
'.admin-header a:hover{color:var(--text)}',
'.tabs{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}',
'.tab{padding:10px 20px;border-radius:10px;background:var(--surface);border:1px solid var(--border);color:var(--muted);cursor:pointer;transition:0.3s;font-family:inherit;font-size:0.9rem}',
'.tab.active{background:var(--primary);color:#fff;border-color:var(--primary)}',
'.tab:hover:not(.active){background:var(--surface-hover);color:var(--text)}',
'.tab-content{display:none}',
'.tab-content.active{display:block}',
'.form-row{margin-bottom:20px}',
'.form-row label{display:block;margin-bottom:6px;font-size:0.9rem;font-weight:500;color:var(--muted)}',
'.form-row input,.form-row textarea{width:100%;padding:12px 16px;border-radius:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border);color:var(--text);font-family:inherit;font-size:0.95rem;transition:0.3s;resize:vertical}',
'.form-row input:focus,.form-row textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(108,92,231,0.15)}',
'.save-btn{padding:12px 32px;border-radius:10px;background:linear-gradient(135deg,var(--primary),#7f70f0);color:#fff;border:none;font-family:inherit;font-size:1rem;font-weight:600;cursor:pointer;transition:0.3s}',
'.save-btn:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(108,92,231,0.3)}',
'.save-msg{margin-top:12px;font-size:0.9rem;min-height:20px}',
'.save-msg.success{color:var(--success)}',
'.save-msg.error{color:var(--danger)}',
'.msg-card{padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:12px}',
'.msg-card .msg-name{font-weight:700;margin-bottom:4px}',
'.msg-card .msg-email{color:var(--accent);font-size:0.85rem;margin-bottom:8px}',
'.msg-card .msg-text{color:var(--muted);font-size:0.95rem}',
'.msg-card .msg-date{color:#555;font-size:0.8rem;margin-top:8px}',
'.msg-card .msg-delete{margin-top:12px;padding:6px 16px;border-radius:8px;background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.3);color:var(--danger);cursor:pointer;font-family:inherit;font-size:0.85rem;transition:0.3s}',
'.msg-card .msg-delete:hover{background:rgba(255,107,107,0.2)}',
'.no-msgs{text-align:center;color:var(--muted);padding:40px}',
'.section-divider{margin:24px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--border);color:var(--accent);font-size:1rem;font-weight:700}',
'@media(max-width:600px){.admin-container{padding:16px}.tabs{flex-direction:column}}',
'</style>',
'</head>',
'<body>',
'<div id="loginScreen" class="login-box">',
'<h1>🎮 پنل مدیریت</h1>',
'<input type="password" id="passwordInput" placeholder="رمز عبور"/>',
'<button onclick="doLogin()">ورود</button>',
'<div id="loginError" class="login-error"></div>',
'</div>',
'<div id="adminPanel" style="display:none">',
'<div class="admin-container">',
'<div class="admin-header">',
'<h1>🎮 پنل مدیریت</h1>',
'<a href="/">→ بازگشت به سایت</a>',
'</div>',
'<div class="tabs">',
'<button class="tab active" onclick="switchTab(event,\'content\')">📝 ویرایش محتوا</button>',
'<button class="tab" onclick="switchTab(event,\'messages\')">📧 پیام‌ها</button>',
'</div>',
'<div id="tab-content" class="tab-content active">',
'<div class="section-divider">🏠 صفحه اصلی</div>',
'<div class="form-row"><label>نام سایت</label><input type="text" id="site_name"/></div>',
'<div class="form-row"><label>عنوان Hero</label><input type="text" id="hero_title"/></div>',
'<div class="form-row"><label>توضیحات Hero</label><textarea id="hero_desc" rows="3"></textarea></div>',
'<div class="section-divider">📰 اخبار گیم</div>',
'<div class="form-row"><label>عنوان خبر ۱</label><input type="text" id="news_title_1"/></div>',
'<div class="form-row"><label>توضیح خبر ۱</label><textarea id="news_desc_1" rows="2"></textarea></div>',
'<div class="form-row"><label>عنوان خبر ۲</label><input type="text" id="news_title_2"/></div>',
'<div class="form-row"><label>توضیح خبر ۲</label><textarea id="news_desc_2" rows="2"></textarea></div>',
'<div class="form-row"><label>عنوان خبر ۳</label><input type="text" id="news_title_3"/></div>',
'<div class="form-row"><label>توضیح خبر ۳</label><textarea id="news_desc_3" rows="2"></textarea></div>',
'<div class="section-divider">🛠️ ابزارهای گیمرها</div>',
'<div class="form-row"><label>عنوان ابزار ۱</label><input type="text" id="tool_1_title"/></div>',
'<div class="form-row"><label>توضیح ابزار ۱</label><textarea id="tool_1_desc" rows="2"></textarea></div>',
'<div class="form-row"><label>عنوان ابزار ۲</label><input type="text" id="tool_2_title"/></div>',
'<div class="form-row"><label>توضیح ابزار ۲</label><textarea id="tool_2_desc" rows="2"></textarea></div>',
'<div class="form-row"><label>عنوان ابزار ۳</label><input type="text" id="tool_3_title"/></div>',
'<div class="form-row"><label>توضیح ابزار ۳</label><textarea id="tool_3_desc" rows="2"></textarea></div>',
'<div class="form-row"><label>عنوان ابزار ۴</label><input type="text" id="tool_4_title"/></div>',
'<div class="form-row"><label>توضیح ابزار ۴</label><textarea id="tool_4_desc" rows="2"></textarea></div>',
'<div class="section-divider">💻 پروژه‌ها</div>',
'<div class="form-row"><label>عنوان پروژه ۱</label><input type="text" id="project_1_title"/></div>',
'<div class="form-row"><label>توضیح پروژه ۱</label><textarea id="project_1_desc" rows="2"></textarea></div>',
'<div class="form-row"><label>عنوان پروژه ۲</label><input type="text" id="project_2_title"/></div>',
'<div class="form-row"><label>توضیح پروژه ۲</label><textarea id="project_2_desc" rows="2"></textarea></div>',
'<div class="form-row"><label>عنوان پروژه ۳</label><input type="text" id="project_3_title"/></div>',
'<div class="form-row"><label>توضیح پروژه ۳</label><textarea id="project_3_desc" rows="2"></textarea></div>',
'<div class="section-divider">📝 فوتر</div>',
'<div class="form-row"><label>متن فوتر</label><input type="text" id="footer_text"/></div>',
'<button class="save-btn" onclick="saveContent()">💾 ذخیره تغییرات</button>',
'<div id="saveMsg" class="save-msg"></div>',
'</div>',
'<div id="tab-messages" class="tab-content">',
'<div id="messagesList"></div>',
'</div>',
'</div>',
'</div>',
'<script>',
'function doLogin(){var pw=document.getElementById("passwordInput").value;fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw})}).then(function(r){return r.json()}).then(function(data){if(data.success){document.getElementById("loginScreen").style.display="none";document.getElementById("adminPanel").style.display="block";loadContent();loadMessages()}else{document.getElementById("loginError").textContent="❌ رمز عبور اشتباه است"}}).catch(function(){document.getElementById("loginError").textContent="❌ خطا در ارتباط"})}',
'function switchTab(e,tab){document.querySelectorAll(".tab").forEach(function(t){t.classList.remove("active")});document.querySelectorAll(".tab-content").forEach(function(t){t.classList.remove("active")});e.target.classList.add("active");document.getElementById("tab-"+tab).classList.add("active");if(tab==="messages")loadMessages()}',
'function loadContent(){fetch("/api/admin/content").then(function(r){return r.json()}).then(function(data){if(data.success){var c=data.content;Object.keys(c).forEach(function(key){var el=document.getElementById(key);if(el)el.value=c[key]})}})}',
'function saveContent(){var fields=["site_name","hero_title","hero_desc","news_title_1","news_desc_1","news_title_2","news_desc_2","news_title_3","news_desc_3","tool_1_title","tool_1_desc","tool_2_title","tool_2_desc","tool_3_title","tool_3_desc","tool_4_title","tool_4_desc","project_1_title","project_1_desc","project_2_title","project_2_desc","project_3_title","project_3_desc","footer_text"];var content={};fields.forEach(function(f){var el=document.getElementById(f);if(el)content[f]=el.value});fetch("/api/admin/content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(content)}).then(function(r){return r.json()}).then(function(data){var msg=document.getElementById("saveMsg");if(data.success){msg.textContent="✅ تغییرات ذخیره شد!";msg.className="save-msg success"}else{msg.textContent="❌ "+data.error;msg.className="save-msg error"}})}',
'function loadMessages(){fetch("/api/admin/messages").then(function(r){return r.json()}).then(function(data){if(data.success){var list=document.getElementById("messagesList");if(data.messages.length===0){list.innerHTML=\'<div class="no-msgs">📭 پیامی وجود ندارد</div>\';return}list.innerHTML=data.messages.map(function(m,i){return \'<div class="msg-card"><div class="msg-name">\'+m.name+\'</div><div class="msg-email">\'+m.email+\'</div><div class="msg-text">\'+m.message+\'</div><div class="msg-date">\'+m.created_at+\'</div><button class="msg-delete" onclick="deleteMessage(\'+i+\')">🗑️ حذف</button></div>\'}).join("")}})}',
'function deleteMessage(index){fetch("/api/admin/messages",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({index:index})}).then(function(r){return r.json()}).then(function(data){if(data.success)loadMessages()})}',
'</script>',
'</body>',
'</html>'
  ].join('\n');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (path === "/api/contact" && method === "POST") {
      try {
        const data = await request.json();
        if (!data.name || !data.email || !data.message) {
          return jsonResponse({ success: false, error: "اطلاعات ناقص است" }, 400);
        }
        await addMessage(env, {
          id: crypto.randomUUID(),
          name: data.name.trim(),
          email: data.email.trim(),
          message: data.message.trim(),
          created_at: new Date().toISOString(),
        });
        return jsonResponse({ success: true, message: "پیام دریافت شد" });
      } catch {
        return jsonResponse({ success: false, error: "خطای سرور" }, 500);
      }
    }

    if (path === "/api/health" && method === "GET") {
      return jsonResponse({ status: "ok", timestamp: new Date().toISOString() });
    }

    if (path === "/api/chat" && method === "POST") {
      try {
        const data = await request.json();
        if (!data.message || typeof data.message !== "string") {
          return jsonResponse({ success: false, error: "پیام خالی است" }, 400);
        }
        if (!env.AI) {
          return jsonResponse({ success: false, error: "هوش مصنوعی فعال نیست" }, 503);
        }
        const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages: [
            { role: "system", content: AI_SYSTEM_PROMPT },
            { role: "user", content: data.message },
          ],
        });
        const reply = aiResponse.response || "متأسفم، جواب مناسب پیدا نکردم.";
        return jsonResponse({ success: true, reply });
      } catch (e) {
        return jsonResponse({ success: false, error: "خطا در پردازش" }, 500);
      }
    }

    if (path === "/api/admin/login" && method === "POST") {
      try {
        const data = await request.json();
        if (data.password === ADMIN_PASSWORD) {
          return jsonResponse({ success: true });
        }
        return jsonResponse({ success: false, error: "رمز اشتباه" }, 401);
      } catch {
        return jsonResponse({ success: false, error: "خطا" }, 500);
      }
    }

    if (path === "/api/admin/content" && method === "GET") {
      const content = await getContent(env);
      return jsonResponse({ success: true, content });
    }

    if (path === "/api/admin/content" && method === "POST") {
      try {
        const data = await request.json();
        const current = await getContent(env);
        const updated = { ...current, ...data };
        await saveContent(env, updated);
        return jsonResponse({ success: true });
      } catch {
        return jsonResponse({ success: false, error: "خطا در ذخیره" }, 500);
      }
    }

    if (path === "/api/admin/messages" && method === "GET") {
      const messages = await getMessages(env);
      return jsonResponse({ success: true, messages });
    }

    if (path === "/api/admin/messages" && method === "DELETE") {
      try {
        const data = await request.json();
        const messages = await getMessages(env);
        messages.splice(data.index, 1);
        if (env.KV) await env.KV.put("messages", JSON.stringify(messages));
        return jsonResponse({ success: true });
      } catch {
        return jsonResponse({ success: false, error: "خطا" }, 500);
      }
    }

    if (path === "/admin") {
      return htmlResponse(buildAdminHTML());
    }

    const content = await getContent(env);
    return htmlResponse(buildSiteHTML(content));
  },
};
