# Supabase Email Template Setup Instructions

## Update Confirm Signup Email Template

Go to your Supabase dashboard: Authentication → Email Templates → Confirm signup

Replace the entire template content with this HTML:

```html
<h2>Имэйл хаягаа баталгаажуулна уу</h2>

<p>Сайн уу!</p>

<p>Hippo Study дээр бүртгүүлсэн танд баярлалаа. Доорх 6 оронтой кодыг сайт дээрээ оруулж бүртгэлээ дуусгана уу:</p>

<h1 style="font-size: 48px; font-weight: bold; letter-spacing: 8px; text-align: center; color: #4F46E5;">{{ .Token }}</h1>

<p>Энэ код 10 минутын дотор хүчинтэй.</p>

<p>Хэрэв та бүртгүүлээгүй бол энэ имэйлийг үл тоомсорлоно уу.</p>

<p>Баярлалаа,<br>Hippo Study баг 🦛</p>
```

## What This Template Does

- Uses Mongolian language for user-friendly messaging
- Displays the 6-digit OTP code prominently with large, centered styling
- Includes letter spacing for better readability
- Sets a 10-minute validity period
- Professional branding with Hippo Study mascot

## Important Notes

- The `{{ .Token }}` placeholder will be automatically replaced with the 6-digit code
- Make sure to save the template after updating
- Test the signup flow to ensure emails are being sent correctly
