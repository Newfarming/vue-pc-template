let reg = {
  getZipCodeReg (countryId) {
    var commonReg = /^.{0,12}$/
    var errorSpecial = 'No Special Characters Like !@# Please!'
    var errorEmpty = 'No Zip Code!'
    var placeholder = 'Zip Code'
    var errorSuffix = ' Digits Please!'

    var common5zipcode = {
      'reg': /^\d{5}$/,
      'length': 5,
      'style': '*',
      'error': 5 + errorSuffix,
      'error-special': errorSpecial,
      'error-empty': errorEmpty,
      'placeholder': placeholder
    }

    var common4zipcode = {
      'reg': /^\d{4}$/,
      'length': 4,
      'style': '*',
      'error': 4 + errorSuffix,
      'error-special': errorSpecial,
      'error-empty': errorEmpty,
      'placeholder': placeholder
    }

    var common6zipcode = {
      'reg': /^\d{6}$/,
      'length': 6,
      'style': '*',
      'error': 6 + errorSuffix,
      'error-special': errorSpecial,
      'error-empty': errorEmpty,
      'placeholder': placeholder
    }

    var commonNoneZipcode = {
      'reg': commonReg,
      'length': -2,
      'style': -2,
      'error': '',
      'error-special': '',
      'error-empty': '',
      'placeholder': 'Zip Code (Optional)'
    }

    var COUNTY_ZIPCODE_MAPPING = {
      // us 美国 5位或9-10位，允许数字，‘-’和空格
      // '235': /(^\d{5}$)|(^\d{5}-\d{4}$)/,
      'us': {
        'reg': /(^[\d\- ]{5}$)|(^[\d\- ]{9,10}$)/,
        'length': -1,
        'style': -1,
        'error': '5 Or 9-10' + errorSuffix,
        'error-special': errorSpecial,
        'error-empty': errorEmpty,
        'placeholder': placeholder
      },
      // in 印度 6位数字
      'in': {
        'reg': /^\d{6}$/,
        'length': 6,
        'style': '*',
        'error': 6 + errorSuffix,
        'error-special': errorSpecial,
        'error-empty': 'No Pincode!',
        'placeholder': 'Pincode'
      },
      // mx 墨西哥，5位数字
      'mx': common5zipcode,
      // sa 沙特 无限制
      'sa': commonNoneZipcode,
      // qa 卡塔尔 无限制
      'qa': commonNoneZipcode,
      // ae 阿联酋,无限制
      'ae': commonNoneZipcode,
      // eg 埃及，无限制
      'eg': common5zipcode,
      // ph 菲律宾，4位数字
      'ph': common4zipcode,
      // kw 科威特，无限制
      'kw': common5zipcode,
      // lb 黎巴嫩，无限制
      'lb': {
        'reg': /(^[\d\- ]{4}$)|(^[\d\- ]{8,9}$)/,
        'length': -1,
        'style': -1,
        'error': '4 Or 8-9' + errorSuffix,
        'error-special': errorSpecial,
        'error-empty': errorEmpty,
        'placeholder': placeholder
      },
      // au 澳大利亚 4位数字
      'au': common4zipcode,
      // my 马来西亚 5位数字
      'my': common5zipcode,
      // Bangladesh 孟加拉国 4位数字
      'bd': common4zipcode,
      // Bahrain 巴林 无限制
      'bh': {
        'reg': /^\d{3,4}$/,
        'length': -1,
        'style': -1,
        'error': '3 Or 4' + errorSuffix,
        'error-special': errorSpecial,
        'error-empty': errorEmpty,
        'placeholder': placeholder
      },
      // Brazil 巴西 无限制
      'br': {
        'reg': /^[\d\- ]{8,9}$/,
        'length': -1,
        'style': -1,
        'error': '8-9' + errorSuffix,
        'error-special': errorSpecial,
        'error-empty': errorEmpty,
        'placeholder': placeholder
      },
      // Canada 加拿大 6-7位，可以为数字，字母和空格
      'ca': {
        'reg': /^[\d\w ]{6,7}$/,
        'length': -1,
        'style': -1,
        'error': '6-7' + errorSuffix,
        'error-special': errorSpecial,
        'error-empty': errorEmpty,
        'placeholder': placeholder
      },
      // china 中国 无限制
      // '49': commonReg,
      // Spain 西班牙 5位纯数字
      'es': common5zipcode,
      // fr 法国 5位数字
      'fr': common5zipcode,
      // Indonesia 印度尼西亚 5位数字
      'id': common5zipcode,
      // Israel 以色列 无限制
      'il': {
        'reg': /(^\d{5}$)|(^\d{7}$)/,
        'length': -1,
        'style': -1,
        'error': '5 Or 7' + errorSuffix,
        'error-special': errorSpecial,
        'error-empty': errorEmpty,
        'placeholder': placeholder
      },
      // Sri Lanka 斯里兰卡 5位数字
      'lk': common5zipcode,
      // Russian Federation 俄罗斯联邦 无限制
      'ru': common6zipcode,
      // Singapore 新加坡 6位数字
      'sg': common6zipcode,
      // Thailand 泰国 5位数字
      'th': common5zipcode,
      // United Kingdom 英联邦 5-8位，允许数字，字母和空格
      'gb': {
        'reg': /^[\d\w ]{5,8}$/,
        'length': -1,
        'style': -1,
        'error': '5-8' + errorSuffix,
        'error-special': errorSpecial,
        'error-empty': errorEmpty,
        'placeholder': placeholder
      },
      // Vietnam 越南 6位数字
      'vn': common6zipcode,
      // Oman 阿曼 无限制
      'om': {
        'reg': /^\d{3}$/,
        'length': 3,
        'style': '*',
        'error': 3 + errorSuffix,
        'error-special': errorSpecial,
        'error-empty': errorEmpty,
        'placeholder': placeholder
      }
    }

    return COUNTY_ZIPCODE_MAPPING[countryId]
  },
  getEmailReg () {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/
  }
}

export default reg
