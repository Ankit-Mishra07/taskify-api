const formatCookiesData = (data) => {
  let cookies = {};
  if(!data) return cookies;
  const cookiesArray = data.split(";");

  cookiesArray.forEach((cookie) => {
    const [key, value] = cookie.trim().split("=");
    cookies[key] = value;
  });
  return cookies;
};

module.exports = {formatCookiesData};