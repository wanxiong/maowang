const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const trim = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

const regPhone = (str) => {
  var reg = /^1[3456789]\d{9}$/;
  return reg.test(str)
}

const regPassword = (str) => {
  var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
  return reg.test(str)
}

const params = (url, name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = url.match(reg);
  if (r != null) return decodeURI(r[2]); return null;
}

const accMul = (arg1, arg2) => {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
} 

module.exports = {
  formatTime: formatTime,
  trim,
  regPhone,
  regPassword,
  params,
  accMul
}
