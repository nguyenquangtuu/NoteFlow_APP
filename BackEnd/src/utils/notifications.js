const webpush = require('web-push');
const { query } = require('../config/db');

// Cấu hình web-push (lặp lại để chắc chắn, hoặc có thể làm tập trung)
webpush.setVapidDetails(
  'mailto:vextrovi@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Gửi thông báo đẩy cho một người dùng cụ thể
 * @param {string} userId - ID của người dùng
 * @param {object} payload - Nội dung thông báo { title, body, icon, data }
 */
async function sendPushNotification(userId, payload) {
  try {
    const subscriptions = await query(
      'SELECT subscription FROM push_subscriptions WHERE user_id = ?',
      [userId]
    );

    console.log(`[Push] Đang gửi thông báo cho user ${userId}. Tìm thấy ${subscriptions.length} thiết bị.`);

    if (subscriptions.length === 0) {
      console.log(`[Push] User ${userId} chưa đăng ký nhận thông báo trên thiết bị nào.`);
      return;
    }

    const notifications = subscriptions.map(row => {
      const sub = typeof row.subscription === 'string' 
        ? JSON.parse(row.subscription) 
        : row.subscription;
      
      return webpush.sendNotification(sub, JSON.stringify(payload))
        .catch(async (err) => {
          if (err.statusCode === 404 || err.statusCode === 410) {
            console.log('Subscription đã hết hạn, đang xóa...');
            await query('DELETE FROM push_subscriptions WHERE user_id = ? AND JSON_EXTRACT(subscription, "$.endpoint") = ?', 
              [userId, sub.endpoint]);
          } else {
            console.error('Lỗi khi gửi thông báo:', err);
          }
        });
    });

    await Promise.all(notifications);
    console.log(`[Push] Đã xử lý xong các yêu cầu gửi cho user ${userId}.`);
  } catch (error) {
    console.error('Lỗi trong sendPushNotification:', error);
  }
}

module.exports = { sendPushNotification };
