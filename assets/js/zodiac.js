/**
 * 生肖 & 五行 & 农历基础工具
 * 纯前端，零依赖
 */

// 十二生肖（按正月初一换年）
const ZODIAC_ANIMALS = [
  { name: 'Rat', emoji: '🐀', element: 'Water', traits: ['Quick-witted', 'Resourceful', 'Versatile', 'Kind'] },
  { name: 'Ox', emoji: '🐂', element: 'Earth', traits: ['Diligent', 'Reliable', 'Strong', 'Determined'] },
  { name: 'Tiger', emoji: '🐅', element: 'Wood', traits: ['Brave', 'Confident', 'Competitive', 'Charming'] },
  { name: 'Rabbit', emoji: '🐇', element: 'Wood', traits: ['Gentle', 'Elegant', 'Kind-hearted', 'Cautious'] },
  { name: 'Dragon', emoji: '🐉', element: 'Earth', traits: ['Confident', 'Intelligent', 'Enthusiastic', 'Noble'] },
  { name: 'Snake', emoji: '🐍', element: 'Fire', traits: ['Intelligent', 'Mysterious', 'Wise', 'Elegant'] },
  { name: 'Horse', emoji: '🐎', element: 'Fire', traits: ['Energetic', 'Independent', 'Impatient', 'Hardworking'] },
  { name: 'Goat', emoji: '🐐', element: 'Earth', traits: ['Gentle', 'Sympathetic', 'Artistic', 'Reserved'] },
  { name: 'Monkey', emoji: '🐒', element: 'Metal', traits: ['Clever', 'Curious', 'Mischievous', 'Witty'] },
  { name: 'Rooster', emoji: '🐓', element: 'Metal', traits: ['Hardworking', 'Honest', 'Confident', 'Observant'] },
  { name: 'Dog', emoji: '🐕', element: 'Earth', traits: ['Loyal', 'Honest', 'Brave', 'Reliable'] },
  { name: 'Pig', emoji: '🐖', element: 'Water', traits: ['Generous', 'Gentle', 'Sincere', 'Compassionate'] }
];

// 五行
const FIVE_ELEMENTS = {
  Metal: { color: 'white', emoji: '⚔️', direction: 'West', season: 'Autumn' },
  Wood: { color: 'green', emoji: '🌿', direction: 'East', season: 'Spring' },
  Water: { color: 'black/blue', emoji: '💧', direction: 'North', season: 'Winter' },
  Fire: { color: 'red', emoji: '🔥', direction: 'South', season: 'Summer' },
  Earth: { color: 'yellow/brown', emoji: '🏔️', direction: 'Center', season: 'Late Summer' }
};

// 生肖配对表（兼容性评分 0-100）
// 基于传统生肖三合、六合、六冲等
const COMPATIBILITY = {
  'Rat':      { Rat: 70, Ox: 95, Tiger: 65, Rabbit: 75, Dragon: 80, Snake: 55, Horse: 50, Goat: 60, Monkey: 85, Rooster: 60, Dog: 55, Pig: 90 },
  'Ox':       { Rat: 95, Ox: 70, Tiger: 55, Rabbit: 65, Dragon: 70, Snake: 85, Horse: 60, Goat: 80, Monkey: 55, Rooster: 75, Dog: 70, Pig: 65 },
  'Tiger':    { Rat: 65, Ox: 55, Tiger: 75, Rabbit: 90, Dragon: 70, Snake: 60, Horse: 85, Goat: 65, Monkey: 50, Rooster: 55, Dog: 80, Pig: 60 },
  'Rabbit':   { Rat: 75, Ox: 65, Tiger: 90, Rabbit: 70, Dragon: 60, Snake: 75, Horse: 65, Goat: 85, Monkey: 70, Rooster: 50, Dog: 90, Pig: 75 },
  'Dragon':   { Rat: 80, Ox: 70, Tiger: 70, Rabbit: 60, Dragon: 75, Snake: 95, Horse: 75, Goat: 55, Monkey: 80, Rooster: 65, Dog: 50, Pig: 65 },
  'Snake':    { Rat: 55, Ox: 85, Tiger: 60, Rabbit: 75, Dragon: 95, Snake: 70, Horse: 65, Goat: 70, Monkey: 60, Rooster: 80, Dog: 55, Pig: 50 },
  'Horse':    { Rat: 50, Ox: 60, Tiger: 85, Rabbit: 65, Dragon: 75, Snake: 65, Horse: 70, Goat: 90, Monkey: 65, Rooster: 75, Dog: 60, Pig: 55 },
  'Goat':     { Rat: 60, Ox: 80, Tiger: 65, Rabbit: 85, Dragon: 55, Snake: 70, Horse: 90, Goat: 70, Monkey: 55, Rooster: 65, Dog: 75, Pig: 80 },
  'Monkey':   { Rat: 85, Ox: 55, Tiger: 50, Rabbit: 70, Dragon: 80, Snake: 60, Horse: 65, Goat: 55, Monkey: 75, Rooster: 90, Dog: 65, Pig: 70 },
  'Rooster':  { Rat: 60, Ox: 75, Tiger: 55, Rabbit: 50, Dragon: 65, Snake: 80, Horse: 75, Goat: 65, Monkey: 90, Rooster: 70, Dog: 60, Pig: 55 },
  'Dog':      { Rat: 55, Ox: 70, Tiger: 80, Rabbit: 90, Dragon: 50, Snake: 55, Horse: 60, Goat: 75, Monkey: 65, Rooster: 60, Dog: 70, Pig: 85 },
  'Pig':      { Rat: 90, Ox: 65, Tiger: 60, Rabbit: 75, Dragon: 65, Snake: 50, Horse: 55, Goat: 80, Monkey: 70, Rooster: 55, Dog: 85, Pig: 75 }
};

/**
 * 根据公历年获取生肖
 * 注意：严格来说应按农历正月初一换年，但为简化，先用公历计算
 * （对于大多数用户而言足够准确，后续可以加农历库）
 */
function getZodiacByYear(year) {
  // 生肖以立春/春节为界，这里用一个近似算法
  // 2020年是鼠年 (index 0)
  const index = ((year - 4) % 12 + 12) % 12;
  return { ...ZODIAC_ANIMALS[index], index };
}

/**
 * 根据生日（年-月-日）获取生肖
 * 简单版：使用农历近似（2月4日立春换生肖，或春节）
 * 这里用2月4日作为近似分界（立春附近）
 */
function getZodiacByBirthday(year, month, day) {
  let zodiacYear = year;
  // 如果生日在1月1日-2月3日之间，算作上一年的生肖
  if (month < 2 || (month === 2 && day < 4)) {
    zodiacYear = year - 1;
  }
  return getZodiacByYear(zodiacYear);
}

/**
 * 根据年份获取五行（天干五行）
 * 用天干：甲乙木、丙丁火、戊己土、庚辛金、壬癸水
 */
function getElementByYear(year) {
  const heavenlyStem = (year - 4) % 10;
  const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
  return { name: elements[heavenlyStem], ...FIVE_ELEMENTS[elements[heavenlyStem]] };
}

/**
 * 两个生肖的兼容性评分
 */
function getCompatibility(zodiac1, zodiac2) {
  const score = COMPATIBILITY[zodiac1]?.[zodiac2] ?? 50;
  let level, description;
  
  if (score >= 90) {
    level = 'Perfect Match';
    description = 'You two are a match made in heaven. Your relationship flows naturally and brings out the best in each other.';
  } else if (score >= 75) {
    level = 'Great Match';
    description = 'You share strong chemistry and understand each other well. With a little effort, this can be a lasting bond.';
  } else if (score >= 60) {
    level = 'Good Match';
    description = 'You have your differences, but the foundation is solid. Communication and compromise are key.';
  } else if (score >= 45) {
    level = 'Challenging';
    description = 'You may face hurdles and misunderstandings. Patience and understanding from both sides are needed.';
  } else {
    level = 'Needs Work';
    description = 'This pairing faces significant challenges. Extra effort and mutual respect are required to make it work.';
  }
  
  return { score, level, description };
}

/**
 * 获取指定年份的春节日期（简化版，用预定义数据）
 * 1900-2100 年春节公历日期表（精简版，提供常用年份）
 */
const CHINESE_NEW_YEAR_DATES = {
  2020: '01-25', 2021: '02-12', 2022: '02-01', 2023: '01-22',
  2024: '02-10', 2025: '01-29', 2026: '02-17', 2027: '02-06',
  2028: '01-26', 2029: '02-13', 2030: '02-03', 2031: '01-23',
  2032: '02-11', 2033: '01-31', 2034: '02-19', 2035: '02-08',
  2036: '01-28', 2037: '02-15', 2038: '02-04', 2039: '01-24',
  2040: '02-12', 2041: '02-01', 2042: '01-22', 2043: '02-10',
  2044: '01-30', 2045: '02-17', 2046: '02-06', 2047: '01-26',
  2048: '02-14', 2049: '02-02', 2050: '01-23'
};

function getChineseNewYear(year) {
  if (CHINESE_NEW_YEAR_DATES[year]) {
    return `${year}-${CHINESE_NEW_YEAR_DATES[year]}`;
  }
  // 近似算法（不精确，仅作 fallback）
  return `${year}-02-05`;
}

function getDaysUntilChineseNewYear() {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  let cnyDate = new Date(getChineseNewYear(currentYear));
  if (now > cnyDate) {
    cnyDate = new Date(getChineseNewYear(currentYear + 1));
  }
  
  const diff = Math.ceil((cnyDate - now) / (1000 * 60 * 60 * 24));
  const zodiac = getZodiacByYear(cnyDate.getFullYear());
  
  return {
    days: diff,
    date: cnyDate,
    year: cnyDate.getFullYear(),
    zodiac: zodiac
  };
}

// 导出到全局
window.ZodiacTools = {
  ZODIAC_ANIMALS,
  FIVE_ELEMENTS,
  getZodiacByYear,
  getZodiacByBirthday,
  getElementByYear,
  getCompatibility,
  getChineseNewYear,
  getDaysUntilChineseNewYear
};

// ChineseZodiac compatibility alias for page scripts
window.ChineseZodiac = {
  ZODIACS: ZODIAC_ANIMALS,
  getZodiacByYear: function(year) {
    const z = getZodiacByYear(year);
    const el = getElementByYear(year);
    return {
      ...z,
      element: el,
      year: year,
      yinYang: year % 2 === 0 ? 'yang' : 'yin'
    };
  },
  getZodiacByDate: function(dateObj) {
    const z = getZodiacByBirthday(dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate());
    const el = getElementByYear(z.year || dateObj.getFullYear());
    return {
      ...z,
      element: el,
      year: z.year || dateObj.getFullYear(),
      yinYang: (z.year || dateObj.getFullYear()) % 2 === 0 ? 'yang' : 'yin'
    };
  },
  getZodiacByBirthday: getZodiacByBirthday,
  getElementByYear: getElementByYear,
  getCompatibility: getCompatibility,
  getCompatibilityScore: function(z1, z2) {
    return getCompatibility(z1, z2).score;
  },
  getChineseNewYear: getChineseNewYear,
  getSpringFestivalDate: function(year) {
    const str = getChineseNewYear(year);
    return str ? new Date(str + 'T00:00:00') : null;
  },
  getDaysUntilChineseNewYear: getDaysUntilChineseNewYear,
  getLunarAge: function(dateObj) {
    const now = new Date();
    let age = now.getFullYear() - dateObj.getFullYear() + 1;
    if (age < 1) age = 1;
    return age;
  }
};
