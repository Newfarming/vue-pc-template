const genCountryInfo = (id, symbol, unit, name, code, language, phonePrefix, phoneLength) => {
  return {
    id: id,
    symbol: symbol,
    unit: unit,
    name: name,
    code: code,
    image: require(`assets/image/flags/${code}.jpg`),
    language: language,
    phonePrefix: phonePrefix,
    phoneLength: phoneLength
  }
}

const countries = [
  genCountryInfo(2, 'AED', 'AED', 'United Arab Emirates', 'ae', 'ar', 971, 9),
  genCountryInfo(14, 'AUD', 'AUD', 'Australia', 'au', 'en', 61, 9),
  genCountryInfo(20, 'BDT', 'BDT', 'Bangladesh', 'bd', 'en', 880, 10),
  genCountryInfo(24, 'BHD', 'BHD', 'Bahrain', 'bh', 'ar', 973, 8),
  genCountryInfo(32, 'BRL', 'BRL', 'Brazil', 'br', 'pt_BR', 55, 9),
  genCountryInfo(39, 'CAD', 'CAD', 'Canada', 'ca', 'en', 1, 10),
  genCountryInfo(66, 'EGP', 'EGP', 'Egypt', 'eg', 'ar', 20, 11),
  genCountryInfo(69, 'EUR', 'EUR', 'Spain', 'es', 'en', 34, 9),
  genCountryInfo(76, 'EUR', 'EUR', 'France', 'fr', 'en', 33, 10),
  genCountryInfo(101, 'IDR', 'IDR', 'Indonesia', 'id', 'id', 62, 11),
  genCountryInfo(103, 'ILS', 'ILS', 'Israel', 'il', 'en', 972, 9),
  genCountryInfo(105, '₹', 'INR', 'India', 'in', 'en', 91, 10),
  genCountryInfo(123, 'KWD', 'KWD', 'Kuwait', 'kw', 'ar', 965, 8),
  genCountryInfo(127, 'LBP', 'LBP', 'Lebanon', 'lb', 'ar', 961, 8),
  genCountryInfo(130, 'LKR', 'LKR', 'Sri Lanka', 'lk', 'en', 94, 9),
  genCountryInfo(157, 'MXN', 'MXN', 'Mexico', 'mx', 'es_MX', 52, 8),
  genCountryInfo(158, 'MYR', 'MYR', 'Malaysia', 'my', 'en', 60, 10),
  genCountryInfo(173, 'OMR', 'OMR', 'Oman', 'om', 'ar', 968, 8),
  genCountryInfo(178, 'PHP', 'PHP', 'Philippines', 'ph', 'en', 63, 10),
  genCountryInfo(188, 'QAR', 'QAR', 'Qatar', 'qa', 'ar', 974, 8),
  genCountryInfo(194, 'SAR', 'SAR', 'Saudi Arabia', 'sa', 'ar', 966, 9),
  genCountryInfo(199, 'SGD', 'SGD', 'Singapore', 'sg', 'en', 65, 8),
  genCountryInfo(219, 'THB', 'THB', 'Thailand', 'th', 'en', 66, 9),
  genCountryInfo(233, 'GBP', 'GBP', 'United Kingdom', 'gb', 'en', 44, 10),
  genCountryInfo(235, 'USD', 'USD', 'United States', 'us', 'en', 1, 10),
  genCountryInfo(243, 'VND', 'VND', 'Vietnam', 'vn', 'en', 84, 10)
  // genCountryInfo(192, 'RUB', 'RUB', 'Russian Federation', 'ru','en'),
].sort((a, b) => {
  return a.name > b.name ? 1 : -1
})

const countryCodeMap = (() => {
  let tmpCodeMap = {}
  countries.map(item => {
    tmpCodeMap[item.code] = item
  })
  return tmpCodeMap
})()

const countryIdMap = (() => {
  let tmpIdMap = {}
  countries.map(item => {
    tmpIdMap[item.id] = item
  })
  return tmpIdMap
})()

export {countries, countryCodeMap, countryIdMap}
