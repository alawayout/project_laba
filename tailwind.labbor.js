/**
 * LABBOR Design Code — Tailwind v3 theme
 * Зуботехническая STUDIO · SaaS CMS · dark-first · lime accent · Montserrat
 *
 * Usage (v3): import into tailwind.config.js → theme.extend
 *   const labbor = require('./design-system/tailwind.labbor');
 *   module.exports = { theme: { extend: labbor }, ... }
 *
 * For Tailwind v4, use theme.css (@theme) instead.
 */
module.exports = {
  colors: {
    bg: '#000000',
    surface: {
      1: '#141414', 2: '#171717', 3: '#1c1c1c',
      4: '#212121', 5: '#292929', 6: '#333333',
    },
    line: '#2a2a2a',
    accent: { DEFAULT: '#bdff67', press: '#a8eb52', soft: '#28391a' },
    brand:  { red: '#d22934', 'red-alt': '#da2525' },
    fg: {
      DEFAULT: '#ffffff',
      secondary: '#c5c5c5',
      tertiary: '#b9b9b9',
      muted: '#7e7e7e',
    },
    // status pairs — use as bg-status-done / text-status-done-fg
    'status-done':   { DEFAULT: '#33491f', fg: '#bdff67' },
    'status-work':   { DEFAULT: '#4a3d12', fg: '#f4cf57' },
    'status-wait':   { DEFAULT: '#2f2f2f', fg: '#b9b9b9' },
    'status-dead':   { DEFAULT: '#4a3434', fg: '#ff9699' },
    'status-lab':    { DEFAULT: '#33336e', fg: '#aeb0ff' },
    'status-clinic': { DEFAULT: '#1d4a63', fg: '#79c7f0' },
  },
  fontFamily: {
    sans: ['Montserrat', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    micro:   '13px',
    caption: '15px',
    sm:      '17px',
    base:    '18px',
    md:      '20px',
    lg:      '21px',
    xl:      '23px',
    '2xl':   '28px',
    '3xl':   '34px',
    '4xl':   '40px',
    stat:    '64px',
  },
  borderRadius: {
    field: '15px',
    image: '14px',
    card:  '26px',
    modal: '26px',
    panel: '30px',
    pill:  '999px',
  },
  spacing: {
    1: '6px', 2: '10px', 3: '14px', 4: '18px',
    5: '22px', 6: '26px', 7: '30px', 8: '46px',
    rail: '108px', control: '64px', avatar: '60px', 'icon-btn': '42px',
  },
  boxShadow: {
    modal: '0 18px 40px rgba(0,0,0,.5)',
    toast: '0 16px 40px rgba(0,0,0,.5)',
  },
  transitionTimingFunction: {
    smooth: 'cubic-bezier(.2,.8,.2,1)',
  },
};
