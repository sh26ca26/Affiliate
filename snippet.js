/**
 * Affiliate SaaS Tracking Snippet
 * Simple tracking code for merchants
 * 
 * Usage:
 * <script src="https://cdn.affiliatesaas.com/snippet.js"></script>
 * <script>
 *   window.AffiliateTracker.init({
 *     apiKey: 'your-api-key',
 *     merchantId: 'your-merchant-id'
 *   });
 * </script>
 */

(function () {
  'use strict';

  const AffiliateTracker = {
    config: null,
    sessionId: null,
    apiUrl: 'https://api.affiliatesaas.com/v1',

    /**
     * Initialize tracker
     */
    init: function (config) {
      if (!config.apiKey || !config.merchantId) {
        console.error('[AffiliateTracker] API Key and Merchant ID are required');
        return;
      }

      this.config = config;
      this.apiUrl = config.apiUrl || this.apiUrl;
      this.sessionId = this.generateSessionId();

      // Get affiliate code from URL
      const affiliateCode = this.getAffiliateCodeFromURL();
      if (affiliateCode) {
        this.setAffiliateCode(affiliateCode);
        this.trackPageView(affiliateCode);
      }

      console.log('[AffiliateTracker] Initialized');
    },

    /**
     * Generate session ID
     */
    generateSessionId: function () {
      return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Get affiliate code from URL
     */
    getAffiliateCodeFromURL: function () {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('aff') || urlParams.get('affiliate');
    },

    /**
     * Set affiliate code in cookie
     */
    setAffiliateCode: function (code) {
      const date = new Date();
      date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
      document.cookie = 'affiliate_code=' + code + '; expires=' + date.toUTCString() + '; path=/';
    },

    /**
     * Get affiliate code from cookie
     */
    getAffiliateCode: function () {
      const name = 'affiliate_code=';
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length);
        }
      }
      return null;
    },

    /**
     * Track page view
     */
    trackPageView: function (affiliateCode) {
      this.sendRequest('/clicks', {
        affiliateCode: affiliateCode,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      });
    },

    /**
     * Track conversion
     */
    trackConversion: function (orderId, amount, currency) {
      const affiliateCode = this.getAffiliateCode();

      if (!affiliateCode) {
        console.warn('[AffiliateTracker] No affiliate code found');
        return;
      }

      this.sendRequest('/conversions', {
        orderId: orderId,
        amount: amount,
        currency: currency || 'USD',
        affiliateCode: affiliateCode,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    },

    /**
     * Track custom event
     */
    trackEvent: function (eventName, eventData) {
      const affiliateCode = this.getAffiliateCode();

      this.sendRequest('/events', {
        eventName: eventName,
        eventData: eventData || {},
        affiliateCode: affiliateCode,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    },

    /**
     * Send request to API
     */
    sendRequest: function (endpoint, data) {
      if (!this.config) {
        console.error('[AffiliateTracker] Not initialized');
        return;
      }

      const url = this.apiUrl + endpoint;
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
        'X-Merchant-ID': this.config.merchantId,
        'X-Session-ID': this.sessionId,
      };

      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      }).catch(function (error) {
        console.error('[AffiliateTracker] Request failed:', error);
      });
    },
  };

  // Expose globally
  window.AffiliateTracker = AffiliateTracker;
})();

