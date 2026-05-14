const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { query } = require('../config/db');
const webpush = require('web-push');

const router = express.Router();

// Cấu hình web-push
webpush.setVapidDetails(
  'mailto:vextrovi@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

router.use(authMiddleware);

// Lưu subscription
router.post('/subscribe', async (req, res) => {
  const subscription = req.body;
  const userId = req.user.id;

  try {
    // Kiểm tra xem subscription đã tồn tại chưa bằng cách tìm kiếm endpoint
    const existing = await query(
      'SELECT id FROM push_subscriptions WHERE user_id = ? AND subscription LIKE ?',
      [userId, `%${subscription.endpoint}%`]
    );

    if (existing.length === 0) {
      await query(
        'INSERT INTO push_subscriptions (user_id, subscription) VALUES (?, ?)',
        [userId, JSON.stringify(subscription)]
      );
    }

    res.status(201).json({ message: 'Đã đăng ký nhận thông báo thành công.' });
  } catch (error) {
    console.error('Lỗi khi lưu subscription:', error);
    res.status(500).json({ message: 'Lỗi server khi lưu đăng ký thông báo.' });
  }
});

// Hủy đăng ký
router.post('/unsubscribe', async (req, res) => {
  const { endpoint } = req.body;
  const userId = req.user.id;

  try {
    await query(
      'DELETE FROM push_subscriptions WHERE user_id = ? AND JSON_EXTRACT(subscription, "$.endpoint") = ?',
      [userId, endpoint]
    );
    res.json({ message: 'Đã hủy đăng ký nhận thông báo.' });
  } catch (error) {
    console.error('Lỗi khi hủy subscription:', error);
    res.status(500).json({ message: 'Lỗi server khi hủy đăng ký thông báo.' });
  }
});

// Gửi thông báo thử nghiệm
router.post('/test-push', async (req, res) => {
  const userId = req.user.id;
  const { sendPushNotification } = require('../utils/notifications');

  try {
    await sendPushNotification(userId, {
      title: 'Thông báo thử nghiệm!',
      body: 'Nếu bạn thấy dòng này, Push Notifications đang hoạt động tốt.',
      icon: '/icon-192x192.png',
      data: {
        url: '/'
      }
    });
    res.json({ message: 'Đã gửi thông báo thử nghiệm.' });
  } catch (error) {
    console.error('Lỗi khi gửi thông báo thử:', error);
    res.status(500).json({ message: 'Lỗi server khi gửi thông báo thử.' });
  }
});

module.exports = router;
