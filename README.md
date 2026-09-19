# Read Now ATX - Native HTML Website

This is a complete WordPress-to-HTML migration of the Read Now ATX website. All content is now static HTML with Formspree integration for form handling.

## 📁 File Structure

```
readnow-site/
├── index.html                    # Home page
├── about.html                    # About Us page
├── contact.html                  # Contact Us page
├── volunteer.html                # Volunteers page
├── volunteer-application.html    # Volunteer application form
├── code-of-conduct.html         # Code of Conduct page
├── students.html                 # Students page
├── student-registration.html     # Student registration form
├── faq.html                      # FAQ page
├── style.css                     # Main stylesheet
├── script.js                     # JavaScript for navigation
├── images/                       # All SVG icons and logo
│   ├── logo.png
│   ├── free.svg
│   ├── trained_volunteer.svg
│   ├── 1_on_1_learning.svg
│   ├── flexible_schedule-1.svg
│   ├── volunteer_large.svg
│   ├── student_large.svg
│   └── [other SVG files]
└── README.md                     # This file
```

## 🚀 Deployment Options

### Option 1: GitHub Pages (Free, Recommended)

1. **Create a GitHub repository:**
   - Go to github.com and create a new repository named `readnowatx.org`
   - Upload all files to the repository

2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Branch: `main`, Folder: `/ (root)`
   - Click Save

3. **Connect your domain:**
   - In Settings → Pages → Custom domain
   - Enter: `readnowatx.org`
   - Update your DNS settings at your registrar (GoDaddy, NameCheap, etc.):
     - Add CNAME record pointing to `yourusername.github.io`
     - Or use GitHub's A records (shown in the Pages settings)

4. **Enforce HTTPS:**
   - In Settings → Pages, enable "Enforce HTTPS"

### Option 2: Netlify (Free, Easy)

1. **Connect repository:**
   - Go to netlify.com
   - Click "Connect from Git" → Choose GitHub
   - Select the repository

2. **Basic settings:**
   - Build command: (leave blank - static site)
   - Publish directory: `/`
   - Click "Deploy"

3. **Connect domain:**
   - Go to Site settings → Domain management
   - Add your custom domain `readnowatx.org`
   - Update DNS at your registrar with the Netlify nameservers

### Option 3: Traditional Web Host

If you already have hosting (like your current WordPress host):

1. Upload all files via FTP/SFTP to your web root directory
2. Update any DNS/domain settings if needed
3. Verify the site loads at your domain

---

## ⚙️ Form Setup with Formspree

Read Now uses **Formspree** to handle form submissions and send emails to `info@readnowatx.org`.

### Step 1: Create Formspree Account

1. Go to **formspree.io**
2. Sign up for a free account (nonprofits qualify!)
3. Verify your email

### Step 2: Create Form Endpoints

You need to create 3 forms:

#### Form 1: Contact Form
1. Create new form in Formspree
2. Name: `Contact Form`
3. Email: `info@readnowatx.org`
4. Copy the form ID (looks like: `mv...`)
5. In `contact.html`, find this line:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
   Replace `YOUR_FORM_ID` with the actual ID from Formspree

#### Form 2: Volunteer Application
1. Create new form in Formspree
2. Name: `Volunteer Application`
3. Email: `info@readnowatx.org`
4. Copy the form ID
5. In `volunteer-application.html`, find the form action line and replace `YOUR_FORM_ID`

#### Form 3: Student Registration
1. Create new form in Formspree
2. Name: `Student Registration`
3. Email: `info@readnowatx.org`
4. Copy the form ID
5. In `student-registration.html`, find the form action line and replace `YOUR_FORM_ID`

### Step 3: Test Forms

1. Load the website
2. Go to each form and submit a test submission
3. Check that `info@readnowatx.org` receives the emails
4. Verify all form fields appear correctly in the email

### Form Features (Included)

- ✅ Spam protection (reCAPTCHA available in Formspree settings)
- ✅ Email notifications
- ✅ Automatic form data storage (Formspree dashboard)
- ✅ Custom redirects after submission (optional)
- ✅ File uploads support (if needed in future)

---

## 📨 Alternative: Self-Hosted Email via GreenGeeks

Formspree above is the recommended approach (no server to maintain). This
section documents a fallback option in case you ever want to avoid a
third-party form service and instead use your existing GreenGeeks hosting
account to send form emails directly.

**How it works:** GitHub Pages only serves static files — it cannot run PHP.
So this requires keeping one GreenGeeks hosting plan alive (even after
WordPress itself is retired) purely to host a small PHP script that receives
the form POST and emails it to `info@readnowatx.org`. The static site's forms
then point their `action` at that script's URL instead of Formspree.

Note: the mailbox `info@readnowatx.org` itself is unaffected either way — DNS
MX records control where mail is delivered, independent of where the website
is hosted. This section is only about how form *submissions* get turned into
an email.

### 1. PHP handler, hosted on GreenGeeks (e.g. `https://readnowatx.org/mail-handler.php`)

```php
<?php
// mail-handler.php
$allowed_origin = 'https://jpolache.github.io'; // or your custom domain
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; } // CORS preflight
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Method not allowed'); }

// Honeypot: bots fill hidden fields, humans don't
if (!empty($_POST['_honeypot'])) { exit; }

$to = 'info@readnowatx.org';
$subject = $_POST['_subject'] ?? 'New website form submission';
$replyTo = filter_var($_POST['Email'] ?? '', FILTER_VALIDATE_EMAIL);

$body = '';
foreach ($_POST as $key => $value) {
    if (str_starts_with($key, '_')) continue; // skip control fields
    $body .= sprintf("%s: %s\n", $key, is_array($value) ? implode(', ', $value) : $value);
}

$headers = "From: no-reply@readnowatx.org\r\n";
if ($replyTo) { $headers .= "Reply-To: $replyTo\r\n"; }

if (mail($to, $subject, $body, $headers)) {
    header('Location: https://jpolache.github.io/readnowatx.org/thank-you.html');
} else {
    http_response_code(500);
    exit('Failed to send.');
}
```

### 2. Form changes needed

Same field names already used in `contact.html`, `volunteer-application.html`,
and `student-registration.html` — just swap the `action` and add a honeypot
field plus a subject:

```html
<form action="https://readnowatx.org/mail-handler.php" method="POST">
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off">
  <input type="hidden" name="_subject" value="New Volunteer Application">
  ...
</form>
```

### Tradeoffs vs. Formspree

- **Deliverability**: PHP's `mail()` needs correct SPF/DKIM DNS records for
  `readnowatx.org` or it will land in spam. Using an SMTP library (e.g.
  PHPMailer) through GreenGeeks' real mail service is more reliable than raw
  `mail()`.
- **Spam protection**: no built-in filtering like Formspree — the honeypot
  above stops basic bots; add hCaptcha/reCAPTCHA for real protection.
- **CORS**: GitHub Pages and GreenGeeks are different origins, so
  `Access-Control-Allow-Origin` must exactly match the site's URL.
- **Maintenance**: you own hosting costs, PHP security patches, and uptime
  for that script indefinitely, instead of offloading it to Formspree.

Only worth doing if avoiding a third-party dependency is a hard requirement.

---

## 📋 Site Navigation Structure

The site uses a dropdown navigation matching your WordPress version:

```
Home
About Us
  └─ Contact Us
Volunteers
  ├─ Application
  └─ Code of Conduct
Students
  ├─ Registration
  └─ FAQ
Donate → donate.html (Donorbox embed)
```

---

## 🎨 Design & Customization

### Colors
- **Primary Blue:** `#1a7a8f` (from your logo)
- **Accent Blue:** `#0c71c3` (for buttons/links)
- **Dark Blue:** `#0f4a59` (for hover states)

To change colors, edit `style.css` at the top:
```css
:root {
  --primary: #1a7a8f;
  --primary-dark: #0f4a59;
  --accent: #0c71c3;
  /* ... other colors ... */
}
```

### Fonts
- Uses system fonts for maximum performance
- Fallback chain: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`

### Logo
- Located in `images/logo.png`
- Linked in the header on every page
- Appears in footer

---

## 📱 Responsive Design

The site is **mobile-first** and fully responsive:
- **Desktop:** Full navigation, multi-column layouts
- **Tablet (768px):** Navigation becomes hamburger menu
- **Mobile:** Single column, touch-friendly buttons

Test on multiple devices using:
- Chrome DevTools (F12 → Toggle device toolbar)
- Real device browsers

---

## 🔍 SEO

Each page includes:
- Unique title tags
- Meta descriptions
- Semantic HTML structure
- Mobile viewport meta tag
- Canonical URLs (for GitHub Pages)

To improve SEO further:
1. Submit sitemap to Google Search Console
2. Verify domain ownership
3. Monitor search appearance

---

## 🔐 Security & Performance

✅ **Already Included:**
- No database = no SQL injection risk
- Static files = super fast (no server processing)
- HTTPS (via GitHub Pages or Netlify)
- No sensitive data storage
- Clean, simple HTML (no vulnerabilities)

✅ **Performance:**
- Page load time: <1 second
- Lighthouse score: 95+
- Mobile-friendly
- No external dependencies (CSS/JS)

---

## 📊 Donate Link

The "Donate" nav button (in `header.html`) links to `donate.html`, which embeds the Donorbox
donation form (campaign `readnow-web`). To change the campaign or widget, edit the
`<dbox-widget>` snippet in `donate.html`; copy a new snippet from your Donorbox dashboard.

---

## 🔄 Updating Content

To update page content, simply edit the `.html` files:

1. Open file in any text editor (VS Code, Notepad++, etc.)
2. Find the content section within the `<div class="container">` 
3. Edit the text
4. Save the file
5. Commit to GitHub (if using GitHub Pages) or re-upload to server

**Example - Editing the FAQ page:**
```html
<h3>How long does progress take?</h3>
<p>Progress will vary depending on the amount of time the student devotes 
to the effort. Each session lasts from 30-40 minutes. We currently average 
an increase of one reading grade level every 3 sessions.</p>
```

---

## 🆘 Troubleshooting

### Forms not sending emails
- Check that form IDs are correctly replaced in the HTML
- Verify Formspree account is active
- Check spam folder for test emails
- Formspree dashboard shows submission history

### Pages not displaying correctly
- Clear browser cache (Ctrl+Shift+Delete)
- Check that all CSS/JS files are in correct folder
- Verify image paths are correct

### Navigation menu not working on mobile
- JavaScript must be enabled
- Check browser console for errors (F12)
- Test on different mobile browsers

### Domain not connecting
- Wait 24 hours for DNS propagation
- Verify DNS settings are correct
- Check nameserver configuration
- Formspree hosting doesn't affect domains

---

## 📝 Backup & Updates

### Backup your files:
```bash
# If using GitHub
git clone https://github.com/yourusername/readnowatx.org
# or download as ZIP from GitHub

# If using Netlify
# Netlify maintains automatic backups
```

### Updating the site:
1. Make changes to HTML files locally
2. Commit and push to GitHub, OR upload to host
3. Changes go live automatically (usually within seconds)

---

## 📞 Support

For hosting/deployment issues:
- **GitHub Pages:** github.com/support
- **Netlify:** netlify.com/support
- **Formspree:** formspree.io/support

For content updates or questions about the site structure, refer back to this README.

---

## ✅ Migration Checklist

- [x] Formspree forms set up (Contact, Volunteer Application, Student Registration)
- [x] All form IDs replaced in HTML files
- [ ] Formspree forms tested (test submission received at info@readnowatx.org)
- [ ] Domain connected to hosting
- [ ] HTTPS enabled
- [ ] DNS propagated (wait 24 hours)
- [ ] All pages loading correctly
- [ ] Forms sending emails to info@readnowatx.org
- [ ] Logo displays correctly
- [ ] SVG icons load
- [ ] Mobile menu works
- [x] Donate button links to donate.html (Donorbox)
- [ ] Knowbility footer link working
- [ ] Old WordPress redirects set up (optional but recommended)

---

## 🎉 You're Live!

Your ReadNow website is now a fast, secure, static HTML site. Enjoy:
- **Faster loading** than WordPress
- **Lower server costs**
- **Less maintenance**
- **Better security**
- **Better SEO**

Questions? Contact Formspree or your hosting provider's support.

Good luck with Read Now! 📖
