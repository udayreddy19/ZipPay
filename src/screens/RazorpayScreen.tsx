import React, { useState } from 'react';
import { Alert, Button, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

const BACKEND_URL = 'http://localhost:3000';

export default function RazorpayScreen() {
  const [loading, setLoading] = useState(false);

  const handlePayPress = async () => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const orderResponse = await fetch(`${BACKEND_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 5000, // 5000 paise = ₹50.00
                              currency: 'INR',
                              receipt: 'order_rcptid_11' }),
      });
      const orderData = await orderResponse.json();

      if (orderData.error) {
        Alert.alert('Order creation error', orderData.error);
        setLoading(false);
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        description: 'Money Transfer',
        image: 'https://yourdomain.com/logo.png',
        currency: orderData.currency,
        key: 'YOUR_RAZORPAY_KEY_ID', // replace with your Razorpay key ID
        amount: orderData.amount, // amount in paise
        name: 'ZipPay',
        order_id: orderData.orderId,
        prefill: {
          email: 'test@example.com',
          contact: '9999999999',
          name: 'Test User',
        },
        theme: { color: '#F37254' },
      };

      RazorpayCheckout.open(options)
        .then(async (paymentResult: any) => {
          // paymentResult contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
          const verifyResponse = await fetch(`${BACKEND_URL}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: paymentResult.razorpay_order_id,
              paymentId: paymentResult.razorpay_payment_id,
              signature: paymentResult.razorpay_signature,
            }),
          });
          const verifyData = await verifyResponse.json();
          if (verifyData.verified) {
            Alert.alert('Success', 'Payment verified and completed');
          } else {
            Alert.alert('Verification failed', 'Payment could not be verified');
          }
        })
        .catch((error: any) => {
          Alert.alert('Payment failed', error.description || 'An error occurred');
        });
    } catch (err) {
      Alert.alert('Error', (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pay via UPI / Card (Razorpay)</Text>
      {loading && <ActivityIndicator size="large" color="#F37254" />}
      <Button title="Pay ₹50" onPress={handlePayPress} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 20 },
});