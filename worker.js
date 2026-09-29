// ==========================================
// ⚡ MEHDI.DEV — Worker with Admin Panel
// ==========================================

// Admin password (change this!)
const ADMIN_PASSWORD = "1234Mm@56789";

// Default site content
const DEFAULT_CONTENT = {
  site_name: "مهدی دات",
  hero_title_1: "مدرن",
  hero_title_2: "حرفه‌ای",
  hero_desc: "یک تجربه‌ی وب سریع، امن و زیبا — ساخته‌شده با جدیدترین فناوری‌ها و زیرساخت Cloudflare",
  feature_1_title: "سرعت بالا",
  feature_1_desc: "با زیرساخت Cloudflare و CDN جهانی، سایت شما در سراسر دنیا سریع بارگذاری می‌شود.",
  feature_2_title: "امنیت",
  feature_2_desc: "محافظت پیشرفته در برابر تهدیدها با WAF، DDoS Protection و SSL/TLS خودکار.",
  feature_3_title: "ریسپانسیو",
  feature_3_desc: "طراحی کاملاً واکنش‌گرا برای موبایل، تبلت و دسکتاپ با تجربه‌ای یکپارچه.",
  feature_4_title: "حالت تاریک",
  feature_4_desc: "رابط کاربری مدرن با حالت تاریک پیش‌فرض برای راحتی چشم در هر شرایطی.",
  feature_5_title: "پشتیبانی RTL",
  feature_5_desc: "پشتیبانی کامل از زبان فارسی و راست‌چین با فونت Vazirmatn و طراحی RTL.",
  feature_6_title: "آماده برای AI",
  feature_6_desc: "معماری ما طوری طراحی شده که در آینده بتوانید قابلیت‌های هوش مصنوعی اضافه کنید.",
  footer_text: "ساخته‌شده با ❤️ روی Cloudflare Workers",
  logo_url: ""
};

// --- Helpers ---
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

// --- Get content from KV ---
async function getContent(env) {
  if (!env.KV) return DEFAULT_CONTENT;
  const data = await env.KV.get("site_content");
  return data ? JSON.parse(data) : DEFAULT_CONTENT;
}

// --- Save content to KV ---
async function saveContent(env, content) {
  if (!env.KV) return;
  await env.KV.put("site_content", JSON.stringify(content));
}

// --- Get messages from KV ---
async function getMessages(env) {
  if (!env.KV) return [];
  const data = await env.KV.get("messages");
  return data ? JSON.parse(data) : [];
}

// --- Save message to KV ---
async function addMessage(env, message) {
  if (!env.KV) return;
  const messages = await getMessages(env);
  messages.unshift(message);
  await env.KV.put("messages", JSON.stringify(messages));
}

// --- Build public site HTML ---
function buildSiteHTML(c) {
  const logoHtml = c.logo_url
    ? '<img src="' + c.logo_url + '" alt="logo" style="height:40px;vertical-align:middle"/>'
    : '<span class="logo-icon">⚡</span>';

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
    ':root{--bg:#0a0a0f;--bg-alt:#0f0f17;--surface:rgba(255,255,255,0.04);--surface-hover:rgba(255,255,255,0.08);--border:rgba(255,255,255,0.08);--text:#e8e8f0;--muted:#8888a0;--primary:#6c5ce7;--primary-hover:#7f70f0;--accent:#00d2ff;--radius:16px;--transition:0.3s cubic-bezier(0.4,0,0.2,1);--shadow:0 8px 32px rgba(0,0,0,0.3)}',
    'html{scroll-behavior:smooth}',
    'body{font-family:Vazirmatn,sans-serif;background:var(--bg);color:var(--text);line-height:1.7;overflow-x:hidden}',
    '.container{max-width:1140px;margin:0 auto;padding:0 24px}',
    '.glass{background:var(--surface);backdrop-filter:blur(12px);border:1px solid var(--border);border-radius:var(--radius)}',
    '.header{position:fixed;top:0;left:0;right:0;z-index:1000;transition:var(--transition);padding:16px 0}',
    '.header.scrolled{background:rgba(10,10,15,0.85);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:10px 0}',
    '.nav{display:flex;align-items:center;justify-content:space-between}',
    '.logo{display:flex;align-items:center;gap:8px;font-size:1.3rem;font-weight:700;color:var(--text);text-decoration:none}',
    '.logo-icon{font-size:1.5rem}',
    '.nav-links{display:flex;list-style:none;gap:28px}',
    '.nav-links a{color:var(--muted);text-decoration:none;font-size:0.95rem;font-weight:500;transition:var(--transition)}',
    '.nav-links a:hover{color:var(--text)}',
    '.menu-toggle{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}',
    '.menu-toggle span{width:24px;height:2px;background:var(--text);border-radius:2px;transition:var(--transition)}',
    '.menu-toggle.active span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}',
    '.menu-toggle.active span:nth-child(2){opacity:0}',
    '.menu-toggle.active span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}',
    '.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;position:relative;overflow:hidden;padding:80px 0 60px}',
    '.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 30%,rgba(108,92,231,0.15),transparent 50%),radial-gradient(ellipse at 80% 70%,rgba(0,210,255,0.1),transparent 50%);z-index:-1}',
    '.hero-content{position:relative;z-index:1;animation:fadeInUp 0.8s ease}',
    '.hero-badge{display:inline-block;padding:8px 18px;border-radius:50px;font-size:0.85rem;color:var(--accent);margin-bottom:24px}',
    '.hero-title{font-size:clamp(2.5rem,6vw,4.5rem);font-weight:800;line-height:1.2;margin-bottom:20px}',
    '.gradient{background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}',
    '.hero-desc{font-size:clamp(1rem,2vw,1.25rem);color:var(--muted);max-width:600px;margin:0 auto 36px}',
    '.hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}',
    '.btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 32px;border-radius:50px;font-size:1rem;font-weight:600;text-decoration:none;cursor:pointer;border:none;transition:var(--transition);font-family:inherit}',
    '.btn-primary{background:linear-gradient(135deg,var(--primary),var(--primary-hover));color:#fff;box-shadow:0 4px 20px rgba(108,92,231,0.3)}',
    '.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(108,92,231,0.45)}',
    '.btn-secondary{background:var(--surface);color:var(--text);border:1px solid var(--border)}',
    '.btn-secondary:hover{background:var(--surface-hover);transform:translateY(-2px)}',
    '.btn-full{width:100%}',
    '.section{padding:100px 0;position:relative}',
    '.section-alt{background:var(--bg-alt)}',
    '.section-title{text-align:center;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;margin-bottom:12px}',
    '.section-subtitle{text-align:center;color:var(--muted);font-size:1.1rem;margin-bottom:50px}',
    '.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}',
    '.card{padding:32px;transition:var(--transition)}',
    '.card:hover{transform:translateY(-6px);background:var(--surface-hover);box-shadow:var(--shadow)}',
    '.card-icon{font-size:2.5rem;margin-bottom:16px}',
    '.card h3{font-size:1.3rem;margin-bottom:10px}',
    '.card p{color:var(--muted);font-size:0.95rem}',
    '.contact-wrapper{display:grid;grid-template-columns:1.2fr 0.8fr;gap:24px;max-width:1140px;margin:0 auto}',
    '.contact-card{padding:36px}',
    '.contact-form{display:flex;flex-direction:column;gap:18px}',
    '.form-group{display:flex;flex-direction:column;gap:6px}',
    '.form-group label{font-size:0.9rem;font-weight:500}',
    '.form-group input,.form-group textarea{padding:12px 16px;border-radius:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border);color:var(--text);font-family:inherit;font-size:0.95rem;transition:var(--transition);resize:vertical}',
    '.form-group input:focus,.form-group textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(108,92,231,0.15)}',
    '.form-message{text-align:center;font-size:0.9rem;min-height:20px}',
    '.form-message.success{color:#4ade80}',
    '.form-message.error{color:#ff6b6b}',
    '.contact-info{padding:36px;display:flex;flex-direction:column;gap:24px}',
    '.contact-info h3{font-size:1.3rem;margin-bottom:8px}',
    '.contact-item{display:flex;align-items:flex-start;gap:14px}',
    '.contact-icon{font-size:1.5rem}',
    '.contact-item strong{display:block;font-size:0.95rem;margin-bottom:2px}',
    '.contact-item p{color:var(--muted);font-size:0.9rem}',
    '.footer{background:var(--bg-alt);padding:50px 0 30px;border-top:1px solid var(--border)}',
    '.footer-content{text-align:center;display:flex;flex-direction:column;align-items:center;gap:16px}',
    '.footer-brand{display:flex;align-items:center;gap:8px;font-size:1.2rem;font-weight:700}',
    '.footer-text{color:var(--muted);font-size:0.9rem}',
    '.footer-links{display:flex;gap:24px;flex-wrap:wrap;justify-content:center}',
    '.footer-links a{color:var(--muted);text-decoration:none;font-size:0.9rem;transition:var(--transition)}',
    '.footer-links a:hover{color:var(--text)}',
    '.footer-copy{color:var(--muted);font-size:0.85rem;margin-top:8px}',
    '.admin-link{position:fixed;bottom:20px;left:20px;width:40px;height:40px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.2rem;color:var(--muted);transition:var(--transition);z-index:100;backdrop-filter:blur(12px)}',
    '.admin-link:hover{color:var(--text);background:var(--surface-hover)}',
    '@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}',
    '.reveal{opacity:0;transform:translateY(30px);transition:opacity 0.6s ease,transform 0.6s ease}',
    '.reveal.visible{opacity:1;transform:translateY(0)}',
    '@media(max-width:768px){.nav-links{position:fixed;top:64px;right:-100%;flex-direction:column;background:rgba(10,10,15,0.95);backdrop-filter:blur(20px);width:100%;padding:24px;gap:20px;transition:var(--transition);border-bottom:1px solid var(--border)}.nav-links.active{right:0}.menu-toggle{display:flex}.contact-wrapper{grid-template-columns:1fr}.section{padding:70px 0}.hero-buttons{flex-direction:column;align-items:center}.btn{width:100%;max-width:280px}}',
    '@media(max-width:480px){.container{padding:0 16px}.features-grid{grid-template-columns:1fr}}',
    '</style>',
    '</head>',
    '<body>',
    '<header id="header" class="header">',
    '<nav class="nav container">',
    '<a href="#" class="logo">' + logoHtml + '<span>' + c.site_name + '</span></a>',
    '<ul class="nav-links" id="navLinks">',
    '<li><a href="#hero">خانه</a></li>',
    '<li><a href="#features">امکانات</a></li>',
    '<li><a href="#contact">تماس</a></li>',
    '</ul>',
    '<button class="menu-toggle" id="menuToggle"><span></span><span></span><span></span></button>',
    '</nav>',
    '</header>',
    '<section id="hero" class="hero">',
    '<div class="container hero-content">',
    '<div class="hero-badge glass">🚀 نسخه جدید منتشر شد</div>',
    '<h1 class="hero-title">وب‌سایت <span class="gradient">' + c.hero_title_1 + '</span> و <span class="gradient">' + c.hero_title_2 + '</span></h1>',
    '<p class="hero-desc">' + c.hero_desc + '</p>',
    '<div class="hero-buttons">',
    '<a href="#features" class="btn btn-primary">مشاهده امکانات</a>',
    '<a href="#contact" class="btn btn-secondary">تماس با ما</a>',
    '</div>',
    '</div>',
    '<div class="hero-bg"></div>',
    '</section>',
    '<section id="features" class="section">',
    '<div class="container">',
    '<h2 class="section-title">معرفی امکانات</h2>',
    '<p class="section-subtitle">همه‌چیز که برای یک وب مدرن نیاز دارید</p>',
    '<div class="features-grid">',
    '<div class="card glass reveal"><div class="card-icon">⚡</div><h3>' + c.feature_1_title + '</h3><p>' + c.feature_1_desc + '</p></div>',
    '<div class="card glass reveal"><div class="card-icon">🔒</div><h3>' + c.feature_2_title + '</h3><p>' + c.feature_2_desc + '</p></div>',
    '<div class="card glass reveal"><div class="card-icon">📱</div><h3>' + c.feature_3_title + '</h3><p>' + c.feature_3_desc + '</p></div>',
    '<div class="card glass reveal"><div class="card-icon">🌙</div><h3>' + c.feature_4_title + '</h3><p>' + c.feature_4_desc + '</p></div>',
    '<div class="card glass reveal"><div class="card-icon">🌐</div><h3>' + c.feature_5_title + '</h3><p>' + c.feature_5_desc + '</p></div>',
    '<div class="card glass reveal"><div class="card-icon">🤖</div><h3>' + c.feature_6_title + '</h3><p>' + c.feature_6_desc + '</p></div>',
    '</div>',
    '</div>',
    '</section>',
    '<section id="contact" class="section section-alt">',
    '<div class="container">',
    '<h2 class="section-title">تماس با ما</h2>',
    '<p class="section-subtitle">در ارتباط باشیم</p>',
    '<div class="contact-wrapper">',
    '<div class="contact-card glass">',
    '<form id="contactForm" class="contact-form">',
    '<div class="form-group"><label for="name">نام</label><input type="text" id="name" name="name" placeholder="نام شما" required/></div>',
    '<div class="form-group"><label for="email">ایمیل</label><input type="email" id="email" name="email" placeholder="email@example.com" required/></div>',
    '<div class="form-group"><label for="message">پیام</label><textarea id="message" name="message" rows="4" placeholder="پیام شما..." required></textarea></div>',
    '<button type="submit" class="btn btn-primary btn-full">ارسال پیام</button>',
    '<div id="formMessage" class="form-message"></div>',
    '</form>',
    '</div>',
    '<div class="contact-info glass">',
    '<h3>راه‌های ارتباطی</h3>',
    '<div class="contact-item"><span class="contact-icon">📧</span><div><strong>ایمیل</strong><p>contact@mehdi.dev</p></div></div>',
    '<div class="contact-item"><span class="contact-icon">🌐</span><div><strong>وب‌سایت</strong><p>mehdi.dev</p></div></div>',
    '<div class="contact-item"><span class="contact-icon">📍</span><div><strong>موقعیت</strong><p>سراسر دنیا 🌍</p></div></div>',
    '</div>',
    '</div>',
    '</div>',
    '</section>',
    '<footer class="footer">',
    '<div class="container footer-content">',
    '<div class="footer-brand">' + logoHtml + '<span>' + c.site_name + '</span></div>',
    '<p class="footer-text">' + c.footer_text + '</p>',
    '<div class="footer-links">',
    '<a href="#hero">خانه</a><a href="#features">امکانات</a><a href="#contact">تماس</a>',
    '</div>',
    '<p class="footer-copy">© 2026 ' + c.site_name + ' — تمام حقوق محفوظ است</p>',
    '</div>',
    '</footer>',
    '<a href="/admin" class="admin-link" title="پنل مدیریت">⚙️</a>',
    '<script>',
    'var header=document.getElementById("header");',
    'window.addEventListener("scroll",function(){if(window.scrollY>20)header.classList.add("scrolled");else header.classList.remove("scrolled")});',
    'var menuToggle=document.getElementById("menuToggle");var navLinks=document.getElementById("navLinks");',
    'menuToggle.addEventListener("click",function(){menuToggle.classList.toggle("active");navLinks.classList.toggle("active")});',
    'document.querySelectorAll(".nav-links a").forEach(function(a){a.addEventListener("click",function(){menuToggle.classList.remove("active");navLinks.classList.remove("active")})});',
    'var revealElements=document.querySelectorAll(".card,.contact-card,.contact-info");',
    'revealElements.forEach(function(a){a.classList.add("reveal")});',
    'var observer=new IntersectionObserver(function(e){e.forEach(function(a){if(a.isIntersecting)a.target.classList.add("visible")})},{threshold:0.1});',
    'revealElements.forEach(function(a){observer.observe(a)});',
    'var contactForm=document.getElementById("contactForm");var formMessage=document.getElementById("formMessage");',
    'contactForm.addEventListener("submit",async function(e){',
    'e.preventDefault();',
    'var formData=new FormData(contactForm);',
    'var data={name:formData.get("name"),email:formData.get("email"),message:formData.get("message")};',
    'formMessage.textContent="در حال ارسال...";',
    'formMessage.className="form-message";',
    'try{',
    'var response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});',
    'var result=await response.json();',
    'if(result.success){formMessage.textContent="✅ پیام شما با موفقیت ارسال شد!";formMessage.classList.add("success");contactForm.reset()}',
    'else{formMessage.textContent="❌ "+result.error;formMessage.classList.add("error")}',
    '}catch(err){formMessage.textContent="❌ خطا در ارسال";formMessage.classList.add("error")}',
    '});',
    '</script>',
    '</body>',
    '</html>'
  ].join('\n');
}

// --- Build admin panel HTML ---
function buildAdminHTML() {
  return [
    '<!DOCTYPE html>',
    '<html lang="fa" dir="rtl">',
    '<head>',
    '<meta charset="UTF-8"/>',
    '<meta name="viewport" content="width=device-width,initial-scale=1.0"/>',
    '<title>پنل مدیریت — مهدی دات</title>',
    '<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet"/>',
    '<style>',
    '*{margin:0;padding:0;box-sizing:border-box}',
    ':root{--bg:#0a0a0f;--surface:rgba(255,255,255,0.04);--surface-hover:rgba(255,255,255,0.08);--border:rgba(255,255,255,0.08);--text:#e8e8f0;--muted:#8888a0;--primary:#6c5ce7;--accent:#00d2ff;--danger:#ff6b6b;--success:#4ade80}',
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
    '.upload-area{padding:40px;border:2px dashed var(--border);border-radius:16px;text-align:center;cursor:pointer;transition:0.3s;display:block}',
    '.upload-area:hover{border-color:var(--primary);background:var(--surface)}',
    '.upload-area input{display:none}',
    '.upload-result{margin-top:12px;font-size:0.9rem}',
    '.upload-result.success{color:var(--success)}',
    '.upload-result.error{color:var(--danger)}',
    '.image-preview{max-width:200px;margin:12px auto;border-radius:12px;display:none}',
    '@media(max-width:600px){.admin-container{padding:16px}.tabs{flex-direction:column}}',
    '</style>',
    '</head>',
    '<body>',
    '<div id="loginScreen" class="login-box">',
    '<h1>⚙️ پنل مدیریت</h1>',
    '<input type="password" id="passwordInput" placeholder="رمز عبور"/>',
    '<button onclick="doLogin()">ورود</button>',
    '<div id="loginError" class="login-error"></div>',
    '</div>',
    '<div id="adminPanel" style="display:none">',
    '<div class="admin-container">',
    '<div class="admin-header">',
    '<h1>⚙️ پنل مدیریت</h1>',
    '<a href="/">→ بازگشت به سایت</a>',
    '</div>',
    '<div class="tabs">',
    '<button class="tab active" onclick="switchTab(event,\'content\')">📝 ویرایش محتوا</button>',
    '<button class="tab" onclick="switchTab(event,\'messages\')">📧 پیام‌ها</button>',
    '<button class="tab" onclick="switchTab(event,\'upload\')">🖼️ آپلود عکس</button>',
    '</div>',
    '<div id="tab-content" class="tab-content active">',
    '<div class="form-row"><label>نام سایت</label><input type="text" id="site_name"/></div>',
    '<div class="form-row"><label>عنوان اول Hero</label><input type="text" id="hero_title_1"/></div>',
    '<div class="form-row"><label>عنوان دوم Hero</label><input type="text" id="hero_title_2"/></div>',
    '<div class="form-row"><label>توضیحات Hero</label><textarea id="hero_desc" rows="3"></textarea></div>',
    '<div class="form-row"><label>آیکون لوگو (URL عکس یا خالی برای ⚡)</label><input type="text" id="logo_url" placeholder="/logo.png یا خالی"/></div>',
    '<h3 style="margin:24px 0 12px;color:var(--muted)">امکانات</h3>',
    '<div class="form-row"><label>عنوان ۱</label><input type="text" id="feature_1_title"/></div>',
    '<div class="form-row"><label>توضیح ۱</label><textarea id="feature_1_desc" rows="2"></textarea></div>',
    '<div class="form-row"><label>عنوان ۲</label><input type="text" id="feature_2_title"/></div>',
    '<div class="form-row"><label>توضیح ۲</label><textarea id="feature_2_desc" rows="2"></textarea></div>',
    '<div class="form-row"><label>عنوان ۳</label><input type="text" id="feature_3_title"/></div>',
    '<div class="form-row"><label>توضیح ۳</label><textarea id="feature_3_desc" rows="2"></textarea></div>',
    '<div class="form-row"><label>عنوان ۴</label><input type="text" id="feature_4_title"/></div>',
    '<div class="form-row"><label>توضیح ۴</label><textarea id="feature_4_desc" rows="2"></textarea></div>',
    '<div class="form-row"><label>عنوان ۵</label><input type="text" id="feature_5_title"/></div>',
    '<div class="form-row"><label>توضیح ۵</label><textarea id="feature_5_desc" rows="2"></textarea></div>',
    '<div class="form-row"><label>عنوان ۶</label><input type="text" id="feature_6_title"/></div>',
    '<div class="form-row"><label>توضیح ۶</label><textarea id="feature_6_desc" rows="2"></textarea></div>',
    '<div class="form-row"><label>متن فوتر</label><input type="text" id="footer_text"/></div>',
    '<button class="save-btn" onclick="saveContent()">💾 ذخیره تغییرات</button>',
    '<div id="saveMsg" class="save-msg"></div>',
    '</div>',
    '<div id="tab-messages" class="tab-content">',
    '<div id="messagesList"></div>',
    '</div>',
    '<div id="tab-upload" class="tab-content">',
    '<label class="upload-area">',
    '<input type="file" accept="image/*" onchange="uploadImage(event)"/>',
    '<div style="font-size:3rem">📁</div>',
    '<p>برای آپلود عکس کلیک کنید</p>',
    '<p style="font-size:0.8rem;color:var(--muted)">PNG, JPG, GIF, SVG — حداکثر ۵ مگابایت</p>',
    '</label>',
    '<img id="imagePreview" class="image-preview"/>',
    '<div id="uploadResult" class="upload-result"></div>',
    '</div>',
    '</div>',
    '</div>',
    '<script>',
    'function doLogin(){',
    'var pw=document.getElementById("passwordInput").value;',
    'fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw})})',
    '.then(function(r){return r.json()}).then(function(data){',
    'if(data.success){',
    'document.getElementById("loginScreen").style.display="none";',
    'document.getElementById("adminPanel").style.display="block";',
    'loadContent();loadMessages();',
    '}else{document.getElementById("loginError").textContent="❌ رمز عبور اشتباه است"}',
    '}).catch(function(){document.getElementById("loginError").textContent="❌ خطا در ارتباط"})',
    '}',
    'function switchTab(e,tab){',
    'document.querySelectorAll(".tab").forEach(function(t){t.classList.remove("active")});',
    'document.querySelectorAll(".tab-content").forEach(function(t){t.classList.remove("active")});',
    'e.target.classList.add("active");',
    'document.getElementById("tab-"+tab).classList.add("active");',
    'if(tab==="messages")loadMessages();',
    '}',
    'function loadContent(){',
    'fetch("/api/admin/content").then(function(r){return r.json()}).then(function(data){',
    'if(data.success){var c=data.content;',
    'Object.keys(c).forEach(function(key){var el=document.getElementById(key);if(el)el.value=c[key]})',
    '}})',
    '}',
    'function saveContent(){',
    'var fields=["site_name","hero_title_1","hero_title_2","hero_desc","logo_url",',
    '"feature_1_title","feature_1_desc","feature_2_title","feature_2_desc",',
    '"feature_3_title","feature_3_desc","feature_4_title","feature_4_desc",',
    '"feature_5_title","feature_5_desc","feature_6_title","feature_6_desc","footer_text"];',
    'var content={};',
    'fields.forEach(function(f){var el=document.getElementById(f);if(el)content[f]=el.value});',
    'fetch("/api/admin/content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(content)})',
    '.then(function(r){return r.json()}).then(function(data){',
    'var msg=document.getElementById("saveMsg");',
    'if(data.success){msg.textContent="✅ تغییرات ذخیره شد!";msg.className="save-msg success"}',
    'else{msg.textContent="❌ "+data.error;msg.className="save-msg error"}',
    '})',
    '}',
    'function loadMessages(){',
    'fetch("/api/admin/messages").then(function(r){return r.json()}).then(function(data){',
    'if(data.success){',
    'var list=document.getElementById("messagesList");',
    'if(data.messages.length===0){list.innerHTML=\'<div class="no-msgs">📭 پیامی وجود ندارد</div>\';return}',
    'list.innerHTML=data.messages.map(function(m,i){return ',
    '\'<div class="msg-card"><div class="msg-name">\'+m.name+\'</div><div class="msg-email">\'+m.email+\'</div><div class="msg-text">\'+m.message+\'</div><div class="msg-date">\'+m.created_at+\'</div><button class="msg-delete" onclick="deleteMessage(\'+i+\')">🗑️ حذف</button></div>\'',
    '}).join("")',
    '}})',
    '}',
    'function deleteMessage(index){',
    'fetch("/api/admin/messages",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({index:index})})',
    '.then(function(r){return r.json()}).then(function(data){if(data.success)loadMessages()})',
    '}',
    'function uploadImage(event){',
    'var file=event.target.files[0];',
    'if(!file)return;',
    'if(file.size>5*1024*1024){document.getElementById("uploadResult").textContent="❌ حجم بیش از ۵ مگابایت";return}',
    'var reader=new FileReader();',
    'reader.onload=function(e){document.getElementById("imagePreview").src=e.target.result;document.getElementById("imagePreview").style.display="block"};',
    'reader.readAsDataURL(file);',
    'var formData=new FormData();',
    'formData.append("file",file);',
    'fetch("/api/admin/upload",{method:"POST",body:formData})',
    '.then(function(r){return r.json()}).then(function(data){',
    'var result=document.getElementById("uploadResult");',
    'if(data.success){result.textContent="✅ عکس آپلود شد: "+data.url;result.className="upload-result success"}',
    'else{result.textContent="❌ "+data.error;result.className="upload-result error"}',
    '})',
    '}',
    '</script>',
    '</body>',
    '</html>'
  ].join('\n');
}

// --- Main Handler ---
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

    if (path === "/api/admin/upload" && method === "POST") {
      try {
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) return jsonResponse({ success: false, error: "فایلی انتخاب نشده" }, 400);
        if (file.size > 5 * 1024 * 1024) return jsonResponse({ success: false, error: "حجم بیش از ۵ مگابایت" }, 400);
        const arrayBuffer = await file.arrayBuffer();
        const key = "images/" + crypto.randomUUID() + "_" + file.name;
        if (env.KV) {
          await env.KV.put(key, arrayBuffer, { metadata: { type: file.type } });
        }
        return jsonResponse({ success: true, url: "/" + key });
      } catch (e) {
        return jsonResponse({ success: false, error: "خطا در آپلود" }, 500);
      }
    }

    if (path.startsWith("/images/") && method === "GET") {
      if (env.KV) {
        const data = await env.KV.get(path.slice(1), "arrayBuffer");
        if (data) {
          return new Response(data, { headers: { "Content-Type": "image/*" } });
        }
      }
      return new Response("Not Found", { status: 404 });
    }

    if (path === "/admin") {
      return htmlResponse(buildAdminHTML());
    }

    const content = await getContent(env);
    return htmlResponse(buildSiteHTML(content));
  },
};
