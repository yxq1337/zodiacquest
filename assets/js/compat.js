// ChineseZodiac compatibility layer
// Bridges ZodiacTools API to the ChineseZodiac interface used by page scripts

(function() {
  var ZT = window.ZodiacTools;
  if (!ZT) return;

  function buildFullZodiac(zodiacObj, year) {
    var element = ZT.getElementByYear(year);
    return {
      name: zodiacObj.name,
      emoji: zodiacObj.emoji,
      index: zodiacObj.index,
      traits: zodiacObj.traits,
      element: element,
      year: year,
      yinYang: year % 2 === 0 ? 'yang' : 'yin'
    };
  }

  function getZodiacByYear(year) {
    var idx = ((year % 12) + 12) % 12;
    var animals = ZT.ZODIAC_ANIMALS;
    var ratIndex = animals.findIndex(function(a) { return a.name === 'Rat'; });
    var targetIndex = (ratIndex + idx) % animals.length;
    return buildFullZodiac(animals[targetIndex], year);
  }

  function getZodiacByDate(dateObj) {
    var y = dateObj.getFullYear();
    var m = dateObj.getMonth() + 1;
    var d = dateObj.getDate();
    var result = ZT.getZodiacByBirthday(y, m, d);
    if (!result) return null;
    return buildFullZodiac(result, result.year || y);
  }

  function getCompatibility(z1, z2) {
    var base = ZT.getCompatibility(z1, z2);
    var score = base.score;
    // Build breakdown from score
    var breakdown = {
      love: Math.min(100, Math.max(0, score + Math.round(Math.random() * 10 - 5))),
      friendship: Math.min(100, Math.max(0, score + Math.round(Math.random() * 10 - 5))),
      career: Math.min(100, Math.max(0, score + Math.round(Math.random() * 10 - 5))),
      communication: Math.min(100, Math.max(0, score + Math.round(Math.random() * 10 - 5)))
    };
    return {
      score: score,
      level: base.level,
      description: base.description,
      breakdown: breakdown
    };
  }

  function getLunarAge(dateObj) {
    var now = new Date();
    var age = now.getFullYear() - dateObj.getFullYear() + 1;
    if (age < 1) age = 1;
    return age;
  }

  window.ChineseZodiac = {
    ZODIACS: ZT.ZODIAC_ANIMALS,
    getZodiacByYear: getZodiacByYear,
    getZodiacByDate: getZodiacByDate,
    getZodiacByBirthday: ZT.getZodiacByBirthday,
    getElementByYear: function(year) {
      var el = ZT.getElementByYear(year);
      el.key = el.name.toLowerCase();
      return el;
    },
    getCompatibility: getCompatibility,
    getCompatibilityScore: function(z1, z2) {
      return ZT.getCompatibility(z1, z2).score;
    },
    getChineseNewYear: function(year) {
      var str = ZT.getChineseNewYear(year);
      return str ? new Date(str + 'T00:00:00') : null;
    },
    getDaysUntilChineseNewYear: ZT.getDaysUntilChineseNewYear,
    getLunarAge: getLunarAge,
    getSpringFestivalDate: function(year) {
      var str = ZT.getChineseNewYear(year);
      return str ? new Date(str + 'T00:00:00') : null;
    }
  };
})();
