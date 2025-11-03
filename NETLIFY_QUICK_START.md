# Quick Start: Deploy to Netlify in 5 Minutes

## Fastest Way to Deploy

### Option 1: GitHub Auto-Deploy (Recommended ⭐)

**1. Push to GitHub**
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

**2. Connect on Netlify**
- Go to [netlify.com](https://netlify.com)
- Click "New site from Git"
- Choose GitHub
- Select your ICCT26-frontend repository
- Click Deploy!

**That's it!** ✅ Your site is live.

**Bonus:** Every push to `main` auto-deploys!

---

### Option 2: Netlify CLI (2 Minutes)

**1. Install CLI**
```bash
npm install -g netlify-cli
```

**2. Build & Deploy**
```bash
cd d:\ICCT26
npm run build
netlify deploy --prod --dir=dist
```

**Done!** 🚀 Check your terminal for live URL.

---

### Option 3: Drag & Drop (1 Minute)

1. Build locally: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag `dist` folder to the browser
4. Your site is live instantly!

---

## After Deployment

### Get Your URL
- Default: `your-site.netlify.app`
- Custom domain coming soon!

### Test Your Site
- Visit your Netlify URL
- All pages should work
- Click around to verify

### Monitor Deploys
- Go to Netlify Dashboard
- Click "Deploys" tab
- See deployment history and logs

### Add Custom Domain
1. Go to "Domain settings"
2. Add your domain
3. Follow DNS setup instructions
4. SSL certificate auto-added!

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check `npm run build` works locally first |
| Pages show 404 | `netlify.toml` redirect rule needed |
| Assets missing | Use `/image.png` instead of `./image.png` |
| Slow performance | Check Netlify Analytics tab |

---

## Your Site is Live! 🎉

**Next steps:**
- [ ] Share the URL with your team
- [ ] Set up custom domain
- [ ] Enable analytics
- [ ] Configure environment variables (if needed)

**Questions?** Check `NETLIFY_DEPLOYMENT.md` for detailed guide.

---

## Environment Variables (If Needed)

In Netlify Dashboard:
1. Site Settings → Environment
2. Add variables:
   - `VITE_API_URL` = your API URL
   - `VITE_APP_NAME` = ICCT26

Then redeploy: `netlify deploy --prod`

---

## Redeploy & Updates

Every time you push to GitHub, Netlify auto-deploys!

```bash
# Make changes
git add .
git commit -m "Your message"
git push origin main

# Netlify automatically deploys! No extra steps needed.
```

Check status: Netlify Dashboard → Deploys tab

---

Happy deploying! 🚀
