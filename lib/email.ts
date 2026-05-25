import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "rosyadz123@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Islametra <noreply@islametra.com>";

export async function sendNewUserNotification(user: {
  name: string | null;
  email: string;
  clerkId: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Pengguna baru bergabung — ${user.name ?? user.email}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 18px;">👤 Pengguna Baru Islametra</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 100px;">Nama</td>
            <td style="padding: 8px 0; color: #111827; font-size: 13px; font-weight: 600;">${user.name ?? "—"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td>
            <td style="padding: 8px 0; color: #111827; font-size: 13px;">${user.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Clerk ID</td>
            <td style="padding: 8px 0; color: #6b7280; font-size: 11px; font-family: monospace;">${user.clerkId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Waktu</td>
            <td style="padding: 8px 0; color: #111827; font-size: 13px;">${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "full", timeStyle: "short" })}</td>
          </tr>
        </table>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <a href="https://www.islametra.com/admin/analytics" style="display: inline-block; padding: 10px 20px; background: #059669; color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600;">
          Lihat di Admin Panel
        </a>
      </div>
    `,
  });
}
