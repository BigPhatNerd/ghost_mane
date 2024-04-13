const isTokenExpired = async (expires_at) => {
  const expiryDate =
    expires_at instanceof Date ? expires_at : new Date(expires_at);

  return new Date() > expiryDate;
};

module.exports = isTokenExpired;
