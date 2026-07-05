import React, { useState, useContext } from 'react';
import { Alert, Button, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { AuthContext } from '../context/AuthContext';

const BACKEND_URL = 'http://localhost:3000';

export default function TransferScreen() {
  const { userToken } = useContext(AuthContext);
  const [amount, setAmount] = useState('5000'); // default amount in paise
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe');
  const { confirmPayment, loading } = useConfirmPayment();

  const handleStripePay = async () => {
    if (!userToken) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          amount: parseInt(amount, 10),
          currency: 'usd',
          destinationAccountId: 'acct_1XXXXXXXXXXXX',
        }),
      });
      const { clientSecret, error } = await response.json();
      if (error) {
        Alert.alert('Backend error', error);
        return;
      }
      const { error: confirmError } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });
      if (confirmError) {
        Alert.alert('Payment error', confirmError.message);
      } else {
        Alert.alert('Success', 'Payment completed');
      }
    } catch (e) {
      Alert.alert('Error', (e as any).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Money</Text>
      <TextInput
        placeholder="Amount (in paise)"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />
      <View style={styles.methodContainer}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentMethod === 'stripe' && styles.methodSelected,
          ]}
          onPress={() => setPaymentMethod('stripe')}
        >
          <Text>Stripe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentMethod === 'razorpay' && styles.methodSelected,
          ]}
          onPress={() => setPaymentMethod('razorpay')}
        >
          <Text>Razorpay</Text>
        </TouchableOpacity>
      </View>

      {paymentMethod === 'stripe' && (
        <>
          <CardField
            postalCodeEnabled={true}
            placeholders={{ number: '4242 4242 4242 4242' }}
            cardStyle={styles.card}
            style={styles.cardContainer}
          />
          <Button title="Pay with Stripe" onPress={handleStripePay} disabled={loading} />
        </>
      )}

      {paymentMethod === 'razorpay' && (
        <Button
          title="Pay with Razorpay"
          onPress={() => {
            // Navigate to RazorpayScreen with amount prop (handled via navigation)
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 12, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 4,
  },
  methodContainer: { flexDirection: 'row', marginBottom: 12, justifyContent: 'center' },
  methodButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#888',
    marginHorizontal: 5,
    borderRadius: 4,
  },
  methodSelected: { backgroundColor: '#ddd' },
  card: { backgroundColor: '#fff' },
  cardContainer: { height: 50, marginBottom: 12 },
});