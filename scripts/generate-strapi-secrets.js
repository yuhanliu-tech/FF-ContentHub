#!/usr/bin/env node
/**
 * Generate random secrets for Strapi (production).
 * Run: node scripts/generate-strapi-secrets.js
 * Copy the output into Railway (or .env) – use different values per environment.
 */
const crypto = require('crypto');

function gen() {
  return crypto.randomBytes(32).toString('base64');
}

const key1 = gen();
const key2 = gen();
console.log('# Strapi secrets – copy these into Railway (or backend .env)');
console.log('');
console.log('APP_KEYS="' + key1 + ',' + key2 + '"');
console.log('API_TOKEN_SALT=' + gen());
console.log('ADMIN_JWT_SECRET=' + gen());
console.log('TRANSFER_TOKEN_SALT=' + gen());
console.log('JWT_SECRET=' + gen());
console.log('ENCRYPTION_KEY=' + gen());
