import Payment from '../models/payment.model.js';
import axios from 'axios';

// Get all payments
export const getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    
    const query = userId ? { userId } : {};
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check payment status with Konnect API
    const response = await axios.get(`https://api.konnect.network/api/v2/payments/${payment.konnectPaymentId}/status`, {
      headers: {
        'x-api-key': process.env.KONNECT_API_KEY
      }
    });

    // Update payment status if changed
    if (payment.status !== response.data.state) {
      payment.status = response.data.state === 'COMPLETED' ? 'completed' : 'failed';
      await payment.save();
    }

    res.status(200).json({
      paymentId: payment._id,
      status: payment.status,
      amount: payment.amount,
      createdAt: payment.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { userId, courseId, amount } = req.body;

    // Create payment request with Konnect
    const response = await axios.post('https://api.konnect.network/api/v2/payments/init-payment', {
      receiver: process.env.KONNECT_RECEIVER_ID,
      amount: amount,
      orderId: `${userId}-${courseId}-${Date.now()}`,
      successUrl: `${process.env.FRONTEND_URL}/payment/success`,
      failUrl: `${process.env.FRONTEND_URL}/payment/fail`,
      receiverName: "Your Company Name",
      acceptedPaymentMethods: ["bank_card", "d17"]
    }, {
      headers: {
        'x-api-key': process.env.KONNECT_API_KEY
      }
    });

    // Create payment record
    const payment = new Payment({
      userId,
      courseId,
      amount,
      konnectPaymentId: response.data.paymentId
    });
    await payment.save();

    res.status(201).json({
      paymentUrl: response.data.payUrl,
      paymentId: payment._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const { paymentId, state } = req.body;

    // Verify webhook signature
    // Add your webhook signature verification here

    const payment = await Payment.findOne({ konnectPaymentId: paymentId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = state === 'COMPLETED' ? 'completed' : 'failed';
    await payment.save();

    if (state === 'COMPLETED') {
      // Notify course service for enrollment
      await axios.post(`${process.env.COURSE_SERVICE_URL}/api/courses/enroll`, {
        userId: payment.userId,
        courseId: payment.courseId
      });

      // Send success notification
      await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`, {
        type: 'PAYMENT',
        title: 'Payment Successful',
        message: `Your payment of ${payment.amount} TND was successful`,
        targetUsers: [payment.userId]
      });
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};