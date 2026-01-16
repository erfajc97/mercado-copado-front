/**
 * Detecta si el navegador es Safari
 */
export const detectSafari = (): boolean => {
  const ua = navigator.userAgent
  return (
    /Safari/.test(ua) &&
    !/Chrome/.test(ua) &&
    !/CriOS/.test(ua) &&
    !/FxiOS/.test(ua) &&
    !/EdgiOS/.test(ua)
  )
}
