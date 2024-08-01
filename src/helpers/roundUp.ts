function roundUp(value: number, decimalPlaces: number = 2) {
  const num = Math.round(parseFloat(value + 'e' + decimalPlaces))
  return Number(num + 'e-' + decimalPlaces)
}

export { roundUp }
