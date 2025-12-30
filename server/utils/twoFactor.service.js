import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const generateSecret = (username) => {
  return speakeasy.generateSecret({
    name: `Q-Amchain (${username})`,
    issuer: 'Q-Amchain'
  });
};

export const verifyToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2
  });
};

export const generateQRCode = async (otpauthUrl) => {
  try {
    return await QRCode.toDataURL(otpauthUrl);
  } catch (error) {
    console.error('QR Code generation error:', error);
    return null;
  }
};

