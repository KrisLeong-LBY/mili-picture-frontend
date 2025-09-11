function toDouble(num: any) {
  return (String(num)[1] && String(num)) || '0' + num
}

export default function dateFormat(date = new Date(), format = 'YYYY-MM-DD hh:mm:ss') {
  date = new Date(date)
  let regMap = {
    Y: date.getFullYear(),
    M: toDouble(date.getMonth() + 1),
    D: toDouble(date.getDate()),
    h: toDouble(date.getHours()),
    m: toDouble(date.getMinutes()),
    s: toDouble(date.getSeconds()),
  }

  //逻辑(正则替换 对应位置替换对应值) 数据(日期验证字符 对应值) 分离
  return Object.entries(regMap).reduce((acc, [reg, value]) => {
    return acc.replace(new RegExp(`${reg}+`, 'g'), value as any)
  }, format)
}
