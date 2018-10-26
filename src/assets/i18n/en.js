// 加**  | '([^@*].+)'| => |'$1'|
// 删除** | '\*\*(.*)\*\*'| => |'$1'|
export default {
  'topbar': {
    'about_us': 'About Us',
    'factory_price': 'Factory Price',
    'terms': 'Terms & Conditions',
    'privacy_policy': 'Privacy Policy',
    'contact_us': 'Contact Us',
    'shipping': 'Shipping',
    'return_policy': 'Return Policy',
    'payment_protection': 'Payment Protection',
    'faq': 'FAQ',
    'download': 'Download our APP',
    'help': 'Help',
    'search_guest_order': 'Search My Order',
    'call_customer_service': 'Call Customer Service',
    'account': {'login': 'Log in', 'logout': 'Log out', 'sign_up': 'Sign up'},
    'ship_to': 'Ship to',
    'language': 'Language',
    'country_language': 'Country & Language',
    'search_placeholder': 'What are you looking for?',
    'female': 'Female',
    'male': 'Male'
  },
  'club_info': {
    'factory_price': 'Factory Price',
    'easy_return': '{day} Days<br>Easy Returns',
    'payment_protection': '100%<br>Payment Protection',
    'poster_1': 'Global Sourcing, Factory Price.',
    'poster_2': 'The good life does NOT need to be expensive.',
    'see_more': 'See More',
    'see_less': 'See Less'
  },
  'cart': {
    'cart': 'Cart',
    'my_cart': 'My Cart',
    'check_out': 'Check Out',
    'check_out_guest': 'Check Out as a Guest',
    'add_to_cart': 'ADD TO CART',
    'sold_out': 'Sold Out',
    'recent_add': 'Recent Added',
    'empty': 'Your Cart is empty',
    'other_item': 'other items in your cart',
    'delete': 'Delete',
    'for_free_shipping': 'Add {symbol} {free_num} for FREE shipping',
    'select_all': 'Select all items',
    'buy_now': 'BUY NOW'
  },
  'product': {
    'item': 'Item NO. {item_num}',
    'name': 'name',
    'tax_included': 'Tax Included',
    'ratings': '{num} ratings',
    'off': 'off',
    'discount': '{percent}% off',
    'orders': 'orders',
    'color': 'Color',
    'quantity': 'Quantity',
    'delivery': 'DELIVERY',
    'description': 'DESCRIPTION',
    'rating_and_reviews': 'RATING AND REVIEWS',
    'people_also_view': 'PEOPLE ALSO VIEW',
    'free_shipping': 'Free shipping on orders over {symbol} {free_num}',
    'freeShipping': 'Free Shipping',
    'shipping_fee': 'Order under {symbol} {free_num} ship for {symbol} {shipping_fee}',
    'arrive_at': 'Arrive By {date}',
    'see_more': 'See More',
    'see_less': 'See Less'
  },
  'description': {},
  'delivery': {'delivery': 'DELIVERY', 'delivery_address': 'Delivery Address'},
  'order': {
    'order_number': 'Order Number',
    'order_detail': 'Order Details',
    'price_detail': 'Price Details',
    'price_total': 'total',
    'shipping_fee': 'Shipping Fee',
    'free': 'Free',
    'paid_total': 'Paid Total',
    'order_summary': 'Order Summary',
    'choose_payment': 'Choose Your Payment',
    'new_policy': 'New Policy',
    'payment': 'Payment',
    'payment_success': 'Success',
    'payment_fail': 'Something was wrong when we process your payment. Please try again!',
    'already_paid': 'Already Paid?',
    'buy_now': 'CONTINUE',
    'pay_now': 'PAY NOW',
    'delete_order': 'Delete Order',
    'tax': 'A {percent}% tax will be charged by the local customs according to the new policy.',
    'tariff': 'An extra amount of tariff will be added on orders over {symbol} {maxOrderMoney}.',
    'state': {
      'unpaid': {
        'title': 'Unpaid',
        'expire_after': 'Expires in ',
        'tip': 'Pay now before the products sold out!'
      },
      'failed': {
        'title': 'Unfinished',
        'expire_after': 'Expires in ',
        'tip': 'Payment failed before. Try Again!'
      },
      'pending': {
        'title': 'Unfinished',
        'expire_after': 'Expires in ',
        'tip': 'Payment failed before. Try Again!'
      },
      'expired': {'title': 'Expired'},
      'processing': {'title': 'Processing', 'tip': 'Estimated Delivery Date: '},
      'shipped': {'title': 'Shipped', 'tip': 'Estimated Delivery Date: '},
      'canceled': {'title': 'Canceled'}
    }
  },
  'alert': {
    'find_guest_order': {
      'title': 'Search My Order',
      'message': 'Find your guest order details by contacting customer service, which is under Support -> Order in our app.',
      'btn_confirm': 'Open / Download App'
    },
    'ocean_q_no_card': {'message': 'Please select a card for ocean_q payment'},
    'wait_complete': {
      'title': 'Payment Notification',
      'message': 'Please keep this window open until you paid for your order in your bank\'s payment page. Click on the button when you completed your payment. <br><br> *Please unblock the pop-up window if the payment page didn\'t open.',
      'btn_confirm': 'Fail Payment',
      'btn_cancel': 'Complete Payment'
    },
    'already_paid': {
      'title': 'Already Paid?',
      'message': 'SomeTimes it takes 24 hours to get your payment confirmed by your bank. Please contact the customer service if your order is still unpaid after 1 day.',
      'btn_cancel': 'OK'
    },
    'delete_order': {
      'title': 'Delete Order',
      'message': 'Are you sure to delete this order?',
      'btn_confirm': 'Delete it'
    }
  },
  'input': {
    'name': {'title': 'Name', 'placeholder': '', 'warning': 'Please input your name'},
    'email': {'title': 'Email', 'placeholder': '', 'warning': 'Invalid email address, please try again'},
    'address': {
      'title': 'Address',
      'placeholder': 'Street Name & No. Building Name,Apartment No(in English)',
      'warning': 'Please input your address correctly and below 100 letters'
    },
    'pincode': {'title': 'Pincode', 'placeholder': '', 'warning': 'Please input your pincode'},
    'country': {'title': 'Country'},
    'state': {'title': 'State', 'warning': 'Input Pincode to correct your State'},
    'city': {'title': 'City', 'placeholder': '', 'warning': 'Input Pincode to correct your City'},
    'zip_code': {'title': 'Zip Code', 'warning': ''},
    'address_1': {
      'title': 'Address 1',
      'placeholder': 'Flat/House No./Floor/Building',
      'warning': 'Please input your Flat/House No./Floor/Building'
    },
    'address_2': {
      'title': 'Address 2',
      'placeholder': 'Colony/Street/Locality',
      'warning': 'Please input your Colony/Street/Locality'
    },
    'landmark': {'title': 'Landmark', 'placeholder': 'Near/Behind...'},
    'phone': {'title': 'Phone Number', 'placeholder': ''}
  },
  'color': {'beige': 'Beige', 'black': 'Black'},
  'size': {
    'size': 'Size',
    'length': 'Length',
    'height': 'Height',
    'weight': 'Weight',
    'age': 'Age',
    'waist': 'Waist',
    'sleeve': 'Sleeve',
    'bust': 'Bust/Chest',
    'underbust': 'UnderBust',
    'shoulder': 'Shoulder',
    'hip': 'Hip',
    'foot': 'Foot',
    'heel_to_toe': 'Heel To Toe',
    'insole': 'Insole',
    'diameter': 'Diameter',
    'size_guide': 'Size Guide',
    'size_europe': 'Euro',
    'size_uk': 'UK',
    'size_us': 'USA',
    'title': {'men_clothing': 'Men Clothing Size', 'women_clothing': 'Women Clothing Size'}
  },
  'sort': {
    'sort_by': 'Sort By',
    'default': 'Default',
    'best_sellers': 'Best Sellers',
    'new_arrivals': 'New Arrivals'
  },
  'category': {
    'all': 'All',
    'home': {
      'home': 'Home',
      'cooking_tools': 'Cooking Tools',
      'housekeeping': 'Housekeeping',
      'bathroom': 'Bathroom',
      'kitchen': 'Kitchen',
      'dinnerware': 'Dinnerware',
      'home_textile': 'Home Textile',
      'curtain': 'Curtain',
      'table_sofa_linens': 'Table & Safa Linens',
      'drinkware': 'drinkware',
      'home_decoration': 'Home Decoration',
      'pet': 'Pet',
      'festive_party': 'Festive Party',
      'tools': 'Tools'
    },
    'jewelry': {
      'jewelry': 'Jewelry',
      'jewelry_making': 'Jewelry Making',
      'fine_jewelry': 'Fine jewelry',
      'earrings': 'Earrings',
      'necklaces': 'Necklaces',
      'bracelets': 'Bracelets',
      'rings': 'Rings',
      'hair_accessories': 'Hair Accessories',
      'wedding_sets': 'Wedding & Sets'
    },
    'gadget': {
      'gadgets': 'Gadgets',
      'mobile_accessories': 'Mobile Accessories',
      'phone_bags_cases': 'Phone Bags & Cases',
      'table_accessories': 'Table Accessories',
      'camera_photo': 'Camera Photo',
      'gadget_parts': 'Gadget Paths',
      'electronics': 'Electronics',
      'audio_video': 'audio & Video'
    },
    'watch': {
      'watches': 'Watches',
      'sports': 'Sports Watches',
      'electronic': 'Electronic Watches',
      'mechanical': 'Mechanical Watches',
      'quartz': 'Quartz Watches'
    },
    'beauty': {
      'beauty': 'Beauty',
      'makeup': 'Makeup',
      'hair_care': 'Hair Care & Styling',
      'nails_tools': 'Nails & Tools'
    },
    'kid': {
      'kids': 'kids',
      'activity_gear': 'Activity & Gear',
      'baby_care': 'Baby Care',
      'baby_shoes': 'Baby Shoes',
      'baby_feeding': 'Baby Feeding',
      'safety': 'Safety'
    },
    'clothing': {
      'women': 'Women\'s Clothing',
      'men': 'Men\'s Clothing',
      'girls': 'Girls Clothing',
      'boys': 'Boys Clothing',
      'baby_girls': 'Baby Girls Clothing',
      'baby_boys': 'Baby Boys Clothing',
      'dresses': 'Dresses',
      'blouse_shirt': 'Blouses & Shirts',
      'tops': 'Tops',
      'bottoms': 'Bottoms',
      'jackets': 'Jackets',
      'suits': 'Suits',
      'suits_sets': 'Suits & Sets',
      'jumpsuits': 'Jumpsuits',
      'accessories': 'Accessories',
      'swimwear': 'Swimwear',
      'sweaters': 'Sweaters',
      'hoodies': 'Hoodies',
      'sleep': 'Sleep',
      'socks_hosiery': 'Socks & Hosiery',
      'intimates': 'Intimates',
      'shirts': 'Shirts',
      'jeans': 'Jeans',
      'shorts': 'Shorts',
      'underwear': 'underwear'
    },
    'shoe': {
      'women': 'Women\'s Shoes',
      'men': 'Men\'s Shoes',
      'children': 'Children\'s SHoes',
      'pumps': 'Pumps',
      'boots': 'Boots',
      'sandals': 'Sandals',
      'flats': 'Flats',
      'casual': 'Casual',
      'slippers': 'Slippers',
      'loafers': 'Loafers',
      'oxfords': 'Oxfords'
    },
    'bag': {
      'women': 'Women\'s Bags',
      'men': 'Men\'s Bags',
      'shoulder': 'Shoulder Bags',
      'crossbody': 'Crossbody Bags',
      'top_handle': 'Top-handle Bags',
      'wallets': 'Wallets',
      'backpacks': 'Backpacks',
      'buckets': 'Buckets',
      'cosmetic': 'Cosmetic Bags',
      'evening': 'Evening Bags',
      'shell': 'Shell',
      'clutches': 'Clutches',
      'waist': 'Waist Bags',
      'totes': 'Totes',
      'briefcases': 'Briefcases',
      'travel': 'Travel Bags'
    }
  }
}
