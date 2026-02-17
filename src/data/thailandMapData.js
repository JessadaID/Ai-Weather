// Thailand provinces with coordinates and region grouping
// Used for weather data fetching and map display

export const PROVINCES = [
    // Bangkok Metropolitan
    { name: 'กรุงเทพมหานคร', nameEn: 'Bangkok', lat: 13.7563, lon: 100.5018, region: 'central' },
    // Central
    { name: 'นนทบุรี', nameEn: 'Nonthaburi', lat: 13.8621, lon: 100.5144, region: 'central' },
    { name: 'ปทุมธานี', nameEn: 'Pathum Thani', lat: 14.0208, lon: 100.5253, region: 'central' },
    { name: 'สมุทรปราการ', nameEn: 'Samut Prakan', lat: 13.5991, lon: 100.5998, region: 'central' },
    { name: 'นครปฐม', nameEn: 'Nakhon Pathom', lat: 13.8199, lon: 100.0648, region: 'central' },
    { name: 'อยุธยา', nameEn: 'Ayutthaya', lat: 14.3692, lon: 100.5877, region: 'central' },
    { name: 'สระบุรี', nameEn: 'Saraburi', lat: 14.5289, lon: 100.9103, region: 'central' },
    { name: 'ลพบุรี', nameEn: 'Lopburi', lat: 14.7995, lon: 100.6534, region: 'central' },
    { name: 'สิงห์บุรี', nameEn: 'Singburi', lat: 14.8914, lon: 100.3967, region: 'central' },
    { name: 'อ่างทอง', nameEn: 'Ang Thong', lat: 14.5896, lon: 100.4549, region: 'central' },
    { name: 'ชัยนาท', nameEn: 'Chainat', lat: 15.1851, lon: 100.1251, region: 'central' },
    { name: 'นครนายก', nameEn: 'Nakhon Nayok', lat: 14.2069, lon: 101.2133, region: 'central' },
    { name: 'สุพรรณบุรี', nameEn: 'Suphanburi', lat: 14.4744, lon: 100.1177, region: 'central' },
    { name: 'สมุทรสาคร', nameEn: 'Samut Sakhon', lat: 13.5475, lon: 100.2744, region: 'central' },
    { name: 'สมุทรสงคราม', nameEn: 'Samut Songkhram', lat: 13.4098, lon: 100.0025, region: 'central' },
    // Northern
    { name: 'เชียงใหม่', nameEn: 'Chiang Mai', lat: 18.7883, lon: 98.9853, region: 'north' },
    { name: 'เชียงราย', nameEn: 'Chiang Rai', lat: 19.9105, lon: 99.8406, region: 'north' },
    { name: 'ลำปาง', nameEn: 'Lampang', lat: 18.2888, lon: 99.4909, region: 'north' },
    { name: 'ลำพูน', nameEn: 'Lamphun', lat: 18.5744, lon: 99.0087, region: 'north' },
    { name: 'แม่ฮ่องสอน', nameEn: 'Mae Hong Son', lat: 19.3020, lon: 97.9654, region: 'north' },
    { name: 'น่าน', nameEn: 'Nan', lat: 18.7756, lon: 100.7730, region: 'north' },
    { name: 'พะเยา', nameEn: 'Phayao', lat: 19.1664, lon: 99.9019, region: 'north' },
    { name: 'แพร่', nameEn: 'Phrae', lat: 18.1445, lon: 100.1403, region: 'north' },
    { name: 'อุตรดิตถ์', nameEn: 'Uttaradit', lat: 17.6200, lon: 100.0993, region: 'north' },
    // Northeastern (Isan)
    { name: 'นครราชสีมา', nameEn: 'Nakhon Ratchasima', lat: 14.9799, lon: 102.0978, region: 'northeast' },
    { name: 'ขอนแก่น', nameEn: 'Khon Kaen', lat: 16.4419, lon: 102.8360, region: 'northeast' },
    { name: 'อุดรธานี', nameEn: 'Udon Thani', lat: 17.4138, lon: 102.7870, region: 'northeast' },
    { name: 'อุบลราชธานี', nameEn: 'Ubon Ratchathani', lat: 15.2287, lon: 104.8564, region: 'northeast' },
    { name: 'ร้อยเอ็ด', nameEn: 'Roi Et', lat: 16.0538, lon: 103.6520, region: 'northeast' },
    { name: 'มหาสารคาม', nameEn: 'Maha Sarakham', lat: 16.1851, lon: 103.3008, region: 'northeast' },
    { name: 'สุรินทร์', nameEn: 'Surin', lat: 14.8830, lon: 103.4937, region: 'northeast' },
    { name: 'บุรีรัมย์', nameEn: 'Buriram', lat: 14.9951, lon: 103.1032, region: 'northeast' },
    { name: 'ศรีสะเกษ', nameEn: 'Sisaket', lat: 15.1186, lon: 104.3220, region: 'northeast' },
    { name: 'ชัยภูมิ', nameEn: 'Chaiyaphum', lat: 15.8068, lon: 102.0316, region: 'northeast' },
    { name: 'หนองคาย', nameEn: 'Nong Khai', lat: 17.8783, lon: 102.7420, region: 'northeast' },
    { name: 'หนองบัวลำภู', nameEn: 'Nong Bua Lam Phu', lat: 17.2218, lon: 102.4260, region: 'northeast' },
    { name: 'เลย', nameEn: 'Loei', lat: 17.4860, lon: 101.7223, region: 'northeast' },
    { name: 'สกลนคร', nameEn: 'Sakon Nakhon', lat: 17.1545, lon: 104.1348, region: 'northeast' },
    { name: 'นครพนม', nameEn: 'Nakhon Phanom', lat: 17.3920, lon: 104.7695, region: 'northeast' },
    { name: 'มุกดาหาร', nameEn: 'Mukdahan', lat: 16.5425, lon: 104.7235, region: 'northeast' },
    { name: 'กาฬสินธุ์', nameEn: 'Kalasin', lat: 16.4314, lon: 103.5059, region: 'northeast' },
    { name: 'ยโสธร', nameEn: 'Yasothon', lat: 15.7944, lon: 104.1451, region: 'northeast' },
    { name: 'อำนาจเจริญ', nameEn: 'Amnat Charoen', lat: 15.8656, lon: 104.6258, region: 'northeast' },
    { name: 'บึงกาฬ', nameEn: 'Bueng Kan', lat: 18.3609, lon: 103.6466, region: 'northeast' },
    // Eastern
    { name: 'ชลบุรี', nameEn: 'Chonburi', lat: 13.3611, lon: 100.9847, region: 'east' },
    { name: 'ระยอง', nameEn: 'Rayong', lat: 12.6814, lon: 101.2816, region: 'east' },
    { name: 'จันทบุรี', nameEn: 'Chanthaburi', lat: 12.6113, lon: 102.1035, region: 'east' },
    { name: 'ตราด', nameEn: 'Trat', lat: 12.2439, lon: 102.5158, region: 'east' },
    { name: 'ฉะเชิงเทรา', nameEn: 'Chachoengsao', lat: 13.6904, lon: 101.0780, region: 'east' },
    { name: 'ปราจีนบุรี', nameEn: 'Prachinburi', lat: 14.0509, lon: 101.3715, region: 'east' },
    { name: 'สระแก้ว', nameEn: 'Sa Kaeo', lat: 13.8240, lon: 102.0645, region: 'east' },
    // Western
    { name: 'กาญจนบุรี', nameEn: 'Kanchanaburi', lat: 14.0227, lon: 99.5328, region: 'west' },
    { name: 'ราชบุรี', nameEn: 'Ratchaburi', lat: 13.5283, lon: 99.8134, region: 'west' },
    { name: 'เพชรบุรี', nameEn: 'Phetchaburi', lat: 13.1119, lon: 99.9392, region: 'west' },
    { name: 'ประจวบคีรีขันธ์', nameEn: 'Prachuap Khiri Khan', lat: 11.8126, lon: 99.7957, region: 'west' },
    { name: 'ตาก', nameEn: 'Tak', lat: 16.8840, lon: 99.1259, region: 'west' },
    // Lower Central
    { name: 'นครสวรรค์', nameEn: 'Nakhon Sawan', lat: 15.7030, lon: 100.1371, region: 'central' },
    { name: 'อุทัยธานี', nameEn: 'Uthai Thani', lat: 15.3835, lon: 100.0246, region: 'central' },
    { name: 'กำแพงเพชร', nameEn: 'Kamphaeng Phet', lat: 16.4827, lon: 99.5226, region: 'central' },
    { name: 'พิจิตร', nameEn: 'Phichit', lat: 16.4419, lon: 100.3488, region: 'central' },
    { name: 'พิษณุโลก', nameEn: 'Phitsanulok', lat: 16.8211, lon: 100.2659, region: 'central' },
    { name: 'เพชรบูรณ์', nameEn: 'Phetchabun', lat: 16.4189, lon: 101.1552, region: 'central' },
    { name: 'สุโขทัย', nameEn: 'Sukhothai', lat: 17.0070, lon: 99.8265, region: 'central' },
    // Southern
    { name: 'สุราษฎร์ธานี', nameEn: 'Surat Thani', lat: 9.1382, lon: 99.3217, region: 'south' },
    { name: 'นครศรีธรรมราช', nameEn: 'Nakhon Si Thammarat', lat: 8.4304, lon: 99.9631, region: 'south' },
    { name: 'สงขลา', nameEn: 'Songkhla', lat: 7.1897, lon: 100.5954, region: 'south' },
    { name: 'ภูเก็ต', nameEn: 'Phuket', lat: 7.8804, lon: 98.3923, region: 'south' },
    { name: 'กระบี่', nameEn: 'Krabi', lat: 8.0863, lon: 98.9063, region: 'south' },
    { name: 'พังงา', nameEn: 'Phang Nga', lat: 8.4511, lon: 98.5157, region: 'south' },
    { name: 'ชุมพร', nameEn: 'Chumphon', lat: 10.4930, lon: 99.1800, region: 'south' },
    { name: 'ระนอง', nameEn: 'Ranong', lat: 9.9658, lon: 98.6385, region: 'south' },
    { name: 'พัทลุง', nameEn: 'Phatthalung', lat: 7.6167, lon: 100.0740, region: 'south' },
    { name: 'ตรัง', nameEn: 'Trang', lat: 7.5563, lon: 99.6114, region: 'south' },
    { name: 'สตูล', nameEn: 'Satun', lat: 6.6238, lon: 100.0674, region: 'south' },
    { name: 'ปัตตานี', nameEn: 'Pattani', lat: 6.8686, lon: 101.2501, region: 'south' },
    { name: 'ยะลา', nameEn: 'Yala', lat: 6.5414, lon: 101.2803, region: 'south' },
    { name: 'นราธิวาส', nameEn: 'Narathiwat', lat: 6.4318, lon: 101.8231, region: 'south' },
];

// Key provinces for map weather display (major cities per region)
export const KEY_PROVINCES = [
    'Bangkok', 'Chiang Mai', 'Chiang Rai', 'Khon Kaen', 'Udon Thani',
    'Nakhon Ratchasima', 'Ubon Ratchathani', 'Chonburi', 'Surat Thani',
    'Songkhla', 'Phuket', 'Nakhon Si Thammarat', 'Lampang', 'Phitsanulok',
    'Tak', 'Kanchanaburi', 'Prachuap Khiri Khan',
];

// Region display names
export const REGION_NAMES = {
    north: 'ภาคเหนือ',
    northeast: 'ภาคตะวันออกเฉียงเหนือ',
    central: 'ภาคกลาง',
    east: 'ภาคตะวันออก',
    west: 'ภาคตะวันตก',
    south: 'ภาคใต้',
};

// Region colors (soft, muted tones)
export const REGION_COLORS = {
    north: '#e8f4f0',
    northeast: '#fef3e2',
    central: '#e8f0fe',
    east: '#fce8e8',
    west: '#f0e8f4',
    south: '#e8f8f0',
};

export const REGION_HOVER_COLORS = {
    north: '#c8e6dc',
    northeast: '#fde3b8',
    central: '#c8d8f8',
    east: '#f8c8c8',
    west: '#dcc8e8',
    south: '#c8f0dc',
};
