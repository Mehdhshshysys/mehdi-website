export default {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>مهدی دات</title>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0f;--surface:rgba(255,255,255,0.04);--border:rgba(255,255,255,0.08);--text:#e8e8f0;--muted:#8888a0;--primary:#6c5ce7;--accent:#00d2ff}
body{font-family:'Vazirmatn',sans-serif;background:var(--bg);color:var(--text);line-height:1.7}
.container{max-width:1140px;margin:0 auto;padding:0 24px}
.glass{background:var(--surface);backdrop-filter:blur(12px);border:1px solid var(--border);border-radius:16px}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 0}
.hero-title{font-size:clamp(2.5rem,6vw,4.5rem);font-weight:800;margin-bottom:20px}
.gradient{background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hero-desc{color:var(--muted);max-width:600px;margin:0 auto 36px;font-size:1.2rem}
.btn{display:inline-flex;padding:12px 32px;border-radius:50px;font-weight:600;text-decoration:none;transition:0.3s;border:none;cursor:pointer;font-family:inherit}
.btn-primary{background:linear-gradient(135deg,var(--primary),#7f70f0);color:#fff}
.btn-secondary{background:var(--surface);color:var(--text);border:1px solid var(--border)}
.section{padding:100px 0;text-align:center}
.section-title{font-size:2.5rem;font-weight:700;margin-bottom:12px}
.section-sub{color:var(--muted);margin-bottom:50px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-top:30px}
.card{padding:32px;text-align:right;transition:0.3s}
.card:hover{transform:translateY(-6px)}
.card-icon{font-size:2.5rem;margin-bottom:16px}
.card h3{font-size:1.3rem;margin-bottom:10px}
.card p{color:var(--muted)}
</style>
</head>
<body>
<section class="hero">
<div class="container">
<h1 class="hero-title">وب‌سایت <span class="gradient">مدرن</span> و <span class="gradient">حرفه‌ای</span></h1>
<p class="hero-desc">یک تجربه‌ی وب سریع، امن و زیبا — ساخته‌شده با Cloudflare</p>
<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
<a href="#features" class="btn btn-primary">مشاهده امکانات</a>
<a href="#contact" class="btn btn-secondary">تماس با ما</a>
</div>
</div>
</section>
<section id="features" class="section">
<div class="container">
<h2 class="section-title">امکانات</h2>
<p class="section-sub">همه‌چیز که برای یک وب مدرن نیاز دارید</p>
<div class="grid">
<div class="card glass"><div class="card-icon">⚡</div><h3>سرعت بالا</h3><p>با CDN جهانی Cloudflare</p></div>
<div class="card glass"><div class="card-icon">🔒</div><h3>امنیت</h3><p>WAF و DDoS Protection</p></div>
<div class="card glass"><div class="card-icon">📱</div><h3>ریسپانسیو</h3><p>موبایل، تبلت، دسکتاپ</p></div>
<div class="card glass"><div class="card-icon">🌙</div><h3>حالت تاریک</h3><p>طراحی مدرن و راحت</p></div>
<div class="card glass"><div class="card-icon">🌐</div><h3>RTL</h3><p>پشتیبانی کامل فارسی</p></div>
<div class="card glass"><div class="card-icon">🤖</div><h3>آماده AI</h3><p>قابل توسعه با Workers AI</p></div>
</div>
</div>
</section>
<footer style="text-align:center;padding:50px 0;color:var(--muted);font-size:0.9rem;border-top:1px solid var(--border)">
© 2026 مهدی دات — ساخته‌شده با ❤️ روی Cloudflare Workers
</footer>
</body>
</html>\`;

    const path = new URL(request.url).pathname;

    if (path === '/api/health') {
      return new Response(JSON.stringify({status:'ok'}),{headers:{'Content-Type':'application/json'}});
    }

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  },
  
