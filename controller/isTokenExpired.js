const isTokenExpired = async (expires_at) => {
  const expiryDate =
    expires_at instanceof Date ? expires_at : new Date(expires_at);
  const oneHourBeforeExpiry = new Date(expiryDate.getTime() - 60 * 60 * 1000); // Subtracts one hour from the expiry date

  return new Date() > oneHourBeforeExpiry;
};

module.exports = isTokenExpired;
