import sgMail from '@sendgrid/mail'

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const brand = (content) => `
<div style="background:#060910;color:#e8f4f8;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #1e2d3d;">
  <div style="background:linear-gradient(135deg,#0d1117,#111820);padding:30px;text-align:center;border-bottom:2px solid #00d4ff;">
    <h1 style="font-family:monospace;font-size:28px;color:#00d4ff;margin:0;letter-spacing:3px;">Diamond⚡ZoneBD</h1>
    <p style="color:#6b8899;font-size:12px;margin:5px 0 0;">Bangladesh's #1 Gaming Top-Up Platform</p>
  </div>
  <div style="padding:32px;line-height:1.6;">${content}</div>
  <div style="padding:20px;border-top:1px solid #1e2d3d;text-align:center;background:#0d1117;">
    <p style="color:#6b8899;font-size:12px;margin:5px 0;">DiamondZoneBD · Dhaka, Bangladesh · support@diamondzone.com.bd</p>
    <p style="color:#6b8899;font-size:12px;margin:5px 0;">WhatsApp: +880XXXXXXXXXX</p>
  </div>
</div>`

export async function sendOrderCompleted(order, user) {
  if (!process.env.SENDGRID_API_KEY) { console.log('Email skipped (no SendGrid key)'); return }
  try {
    await sgMail.send({
      to: order.email,
      from: { email: process.env.SENDGRID_FROM_EMAIL, name: 'DiamondZoneBD' },
      subject: `✅ Recharge Successful — ${order.order_id}`,
      html: brand(`
        <h2 style="color:#00ff88;font-size:22px;">✅ Recharge Delivered!</h2>
        <p>Hi ${user?.name || 'Gamer'},</p>
        <p>Your <strong style="color:#00d4ff;">${order.package_amount} ${order.game_name}</strong> top-up has been successfully delivered!</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#0d1117;border:1px solid #1e2d3d;border-radius:8px;">
          <tr><td style="padding:12px 15px;border-bottom:1px solid #1e2d3d;color:#6b8899;">Order ID</td><td style="padding:12px 15px;border-bottom:1px solid #1e2d3d;color:#00d4ff;font-weight:bold;">${order.order_id}</td></tr>
          <tr><td style="padding:12px 15px;border-bottom:1px solid #1e2d3d;color:#6b8899;">Game</td><td style="padding:12px 15px;border-bottom:1px solid #1e2d3d;">${order.game_name}</td></tr>
          <tr><td style="padding:12px 15px;border-bottom:1px solid #1e2d3d;color:#6b8899;">Package</td><td style="padding:12px 15px;border-bottom:1px solid #1e2d3d;">${order.package_name}</td></tr>
          <tr><td style="padding:12px 15px;border-bottom:1px solid #1e2d3d;color:#6b8899;">Player ID</td><td style="padding:12px 15px;border-bottom:1px solid #1e2d3d;">${order.player_id}</td></tr>
          <tr><td style="padding:12px 15px;color:#6b8899;">Amount Paid</td><td style="padding:12px 15px;color:#00ff88;font-size:18px;font-weight:bold;">৳${order.amount_paid}</td></tr>
        </table>
        <div style="text-align:center;margin-top:30px;">
          <a href="${process.env.NEXT_PUBLIC_URL}/track?order_id=${order.order_id}" 
             style="display:inline-block;background:linear-gradient(135deg,#ff6b35,#cc4400);color:#fff;padding:14px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(255,107,53,0.3);">
            Track Status Signal
          </a>
        </div>
      `)
    })
  } catch (error) {
    console.error('SendGrid Error (Order Completed):', error)
  }
}

export async function sendOrderFailed(order, user) {
  if (!process.env.SENDGRID_API_KEY) return
  try {
    await sgMail.send({
      to: order.email,
      from: { email: process.env.SENDGRID_FROM_EMAIL, name: 'DiamondZoneBD' },
      subject: `❌ Order Failed — Refund Processed — ${order.order_id}`,
      html: brand(`
        <h2 style="color:#ff4757;font-size:22px;">❌ Order Processing Failed</h2>
        <p>Hi ${user?.name || 'Gamer'},</p>
        <p>Unfortunately, we were unable to process your top-up for order <strong style="color:#ff4757;">${order.order_id}</strong>.</p>
        <div style="background:#111820;padding:20px;border-radius:8px;border-left:4px solid #ff4757;margin:20px 0;">
          <p style="margin:0;">A full refund of <strong style="color:#00ff88;">৳${order.amount_paid}</strong> has been added to your DiamondZoneBD wallet.</p>
        </div>
        <p style="color:#6b8899;">You can use your wallet balance for your next order, or contact our support team via WhatsApp for immediate assistance.</p>
        <div style="text-align:center;margin-top:30px;">
          <a href="https://wa.me/880XXXXXXXXXX?text=Aborted order: ${order.order_id}" 
             style="display:inline-block;background:#25d366;color:#fff;padding:14px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
            Emergency WhatsApp Support
          </a>
        </div>
      `)
    })
  } catch (error) {
    console.error('SendGrid Error (Order Failed):', error)
  }
}

export async function sendWelcomeEmail(user) {
  if (!process.env.SENDGRID_API_KEY) return
  try {
    await sgMail.send({
      to: user.email,
      from: { email: process.env.SENDGRID_FROM_EMAIL, name: 'DiamondZoneBD' },
      subject: '🎮 Welcome to DiamondZoneBD — Access Granted!',
      html: brand(`
        <h2 style="color:#00d4ff;font-size:24px;">Welcome to the Zone, ${user.name}! 🎮</h2>
        <p>Your clearance has been verified. You're now part of Bangladesh's #1 gaming top-up platform.</p>
        <div style="background:#111820;padding:25px;border-radius:12px;border:1px dashed #ffd700;margin:25px 0;text-align:center;">
          <p style="color:#6b8899;font-size:12px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;">Your Referral Frequency</p>
          <strong style="color:#ffd700;font-size:24px;letter-spacing:2px;font-family:monospace;">${user.referral_code}</strong>
          <p style="color:#6b8899;font-size:12px;margin-top:10px;">Share this code to earn <span style="color:#00ff88;font-weight:bold;">2% commission</span> on every successful mission your recruits complete!</p>
        </div>
        <div style="text-align:center;margin-top:30px;">
          <a href="${process.env.NEXT_PUBLIC_URL}/games" 
             style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#0066cc);color:#060910;padding:16px 45px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;text-transform:uppercase;letter-spacing:1px;">
            Start Gaming →
          </a>
        </div>
      `)
    })
  } catch (error) {
    console.error('SendGrid Error (Welcome):', error)
  }
}

export async function sendWalletDeposit(user, amount) {
  if (!process.env.SENDGRID_API_KEY) return
  try {
    await sgMail.send({
      to: user.email,
      from: { email: process.env.SENDGRID_FROM_EMAIL, name: 'DiamondZoneBD' },
      subject: `💰 Wallet Reserve Injected — ৳${amount}`,
      html: brand(`
        <h2 style="color:#00ff88;font-size:22px;">💰 Wallet Deposit Successful!</h2>
        <p>Hi ${user?.name || 'Operative'},</p>
        <p>A fresh payload of <strong style="color:#00ff88;">৳${amount}</strong> has been successfully injected into your DiamondZoneBD wallet reserve.</p>
        <div style="background:#0d1117;padding:20px;border-radius:8px;border:1px solid #1e2d3d;margin:20px 0;text-align:center;">
          <p style="color:#6b8899;margin:0;">Current Available Balance</p>
          <h1 style="color:#fff;font-size:32px;margin:10px 0;">৳${user.wallet_balance?.toFixed(1)}</h1>
        </div>
        <p style="color:#6b8899;font-size:12px;">Your credits are ready for immediate mission deployment.</p>
      `)
    })
  } catch (error) {
    console.error('SendGrid Error (Wallet Deposit):', error)
  }
}

export async function sendOTP(user, otp) {
  if (!process.env.SENDGRID_API_KEY) return
  try {
    await sgMail.send({
      to: user.email,
      from: { email: process.env.SENDGRID_FROM_EMAIL, name: 'DiamondZoneBD' },
      subject: `🔐 Security Alert: Your OTP Code is ${otp}`,
      html: brand(`
        <h2 style="color:#00d4ff;font-size:22px;">🔐 Security Verification</h2>
        <p>Hi ${user?.name || 'Operative'},</p>
        <p>A verification request has been initiated for your DiamondZoneBD account.</p>
        <div style="background:#111820;padding:25px;border-radius:12px;border:1px dashed #00d4ff;margin:25px 0;text-align:center;">
          <p style="color:#6b8899;font-size:12px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;">One-Time Verification Code</p>
          <strong style="color:#fff;font-size:36px;letter-spacing:8px;font-family:monospace;">${otp}</strong>
          <p style="color:#6b8899;font-size:12px;margin-top:10px;">Valid for 5 minutes. Do not share this signal with anyone.</p>
        </div>
        <p style="color:#6b8899;font-size:10px;text-align:center;">If you did not request this signal, please secure your terminal immediately.</p>
      `)
    })
  } catch (error) {
    console.error('SendGrid Error (OTP):', error)
  }
}