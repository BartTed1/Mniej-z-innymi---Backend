import { Injectable } from "@nestjs/common";
import admin from '../config/firebase.config';

/**
 * Service to handle Firebase Cloud Messaging (FCM) operations.
 * This service is responsible for sending notifications to users that have the same datetime, start and end station as the offer.
 */
@Injectable()
export class FcmService {
  constructor() {
    // Initialize Firebase Admin SDK here if needed
  }

  /**
   * Send notification to group of users.
   * @param {string[]} tokens - Array of device tokens to send the notification to.
   * @param {string} title - Title of the notification.
   * @param {string} body - Body of the notification.
   * @param {string} [offerId] - Optional offer ID to include in the notification data.
   * @returns {Promise<string>} - Returns a promise that resolves to the response from FCM.
  */
  async sendNotification(
    tokens: string[],
    title: string,
    body: string,
    offerId?: string,
  ): Promise<string> {
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        offerId: offerId || '',
      },
    };

    let successCount = 0;

    try {
      const batchSize = 500;
      
      for (let i = 0; i < tokens.length; i += batchSize) {
        const tokenBatch = tokens.slice(i, i + batchSize);
        
        const batchMessage = {
          ...message,
          tokens: tokenBatch,
        };
        
        const response = await admin.messaging().sendEachForMulticast(batchMessage);
        console.log(`Batch ${i/batchSize + 1}: sent ${response.successCount} messages successfully`);
        successCount += response.successCount;
      }
      
      return successCount.toString();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  
}