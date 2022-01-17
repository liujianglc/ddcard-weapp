function str_repeat(i, m) {
  for (var o = []; m > 0; o[--m] = i)
    return o.join('')
}

export function sprintf() {
  var i = 0, a, f = arguments[i++], o = [], m, p, c, x, s = ''
  while (f) {
    if (m = /^[^\x25]+/.exec(f)) {
      o.push(m[0])
    }
    else if (m = /^\x25{2}/.exec(f)) {
      o.push('%')
    }
    else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
      if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
        throw('Too few arguments.')
      }
      if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
        throw('Expecting number but found ' + typeof(a))
      }
      switch (m[7]) {
        case 'b': a = a.toString(2); break
        case 'c': a = String.fromCharCode(a); break
        case 'd': a = parseInt(a); break
        case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break
        case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break
        case 'o': a = a.toString(8); break
        case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break
        case 'u': a = Math.abs(a); break
        case 'x': a = a.toString(16); break
        case 'X': a = a.toString(16).toUpperCase(); break
      }
      a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+'+ a : a)
      c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' '
      x = m[5] - String(a).length - s.length
      p = m[5] ? str_repeat(c, x) : ''
      o.push(s + (m[4] ? a + p : p + a))
    }
    else {
      throw('Huh ?!')
    }
    f = f.substring(m[0].length)
  }
  return o.join('')
}

export function wxuuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}
