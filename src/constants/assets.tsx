/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Hand-drawn irregular circle path for the ball
export const BALL_PATH = "M50,5 C65,6 78,12 88,25 C95,35 98,48 97,60 C96,75 88,88 75,94 C65,98 52,99 40,97 C25,95 12,85 6,70 C2,60 1,45 5,32 C10,18 22,8 35,6 C40,5 45,5 50,5 Z";

export interface Shape {
  id: string;
  name: string;
  path: string;
}

export const SHAPES: Shape[] = [
  { id: 'ball', name: 'Ball', path: BALL_PATH },
  { id: 'square', name: 'Square', path: "M12,12 C25,10 75,11 88,12 C90,25 89,75 88,88 C75,90 25,89 12,88 C10,75 11,25 12,12 Z" },
  { id: 'brick', name: 'Brick', path: "M28,8 C40,10 60,10 72,8 C75,25 75,75 72,92 C60,90 40,90 28,92 C25,75 25,25 28,8 Z" },
  { id: 'triangle', name: 'Triangle', path: "M50,8 C65,25 85,75 92,90 C75,88 25,88 8,90 C15,75 35,25 50,8 Z" },
];

export interface EyeSet {
  id: string;
  name: string;
  customUrl?: string;
  render: (color: string) => React.ReactNode;
}

export interface Accessory {
  id: string;
  name: string;
  render: () => React.ReactNode;
  position: { x: number; y: number; scale: number };
}

export const EYES: EyeSet[] = [
  {
    id: 'neutral',
    name: 'Neutral',
    render: (c) => (
      <g>
        <path d="M22,45 C22,32 38,32 38,45 C38,58 22,58 22,45" fill="white" stroke={c} strokeWidth="3.5" />
        <path d="M62,45 C62,32 78,32 78,45 C78,58 62,58 62,45" fill="white" stroke={c} strokeWidth="3.5" />
      </g>
    )
  },
  {
    id: 'happy',
    name: 'Happy',
    render: (c) => (
      <g>
        <path d="M20,50 Q30,30 40,50 Q30,45 20,50" fill="white" stroke={c} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M60,50 Q70,30 80,50 Q70,45 60,50" fill="white" stroke={c} strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    )
  },
  {
    id: 'angry',
    name: 'Angry',
    render: (c) => (
      <g>
        <path d="M15,40 L45,55 L42,65 Q30,70 15,60 Z" fill="white" stroke={c} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M85,40 L55,55 L58,65 Q70,70 85,60 Z" fill="white" stroke={c} strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    )
  },
  {
    id: 'wot',
    name: 'Wot',
    render: (c) => (
      <g>
        <ellipse cx="30" cy="48" rx="12" ry="9" fill="white" stroke={c} strokeWidth="3.5" />
        <ellipse cx="70" cy="48" rx="12" ry="9" fill="white" stroke={c} strokeWidth="3.5" />
      </g>
    )
  },
  {
    id: 'suspicious',
    name: 'Suspicious',
    render: (c) => (
      <g>
        <path d="M18,48 L42,52 L40,60 L20,56 Z" fill="white" stroke={c} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M82,48 L58,52 L60,60 L80,56 Z" fill="white" stroke={c} strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    )
  },
  {
    id: 'sad',
    name: 'Sad',
    render: (c) => (
      <g>
        <path d="M10,58 Q28,45 46,40 L46,55 Q28,60 10,73 Z" fill="white" stroke={c} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M90,58 Q72,45 54,40 L54,55 Q72,60 90,73 Z" fill="white" stroke={c} strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    )
  },
  {
    id: 'dead',
    name: 'Dead',
    render: (c) => (
      <g>
        <path d="M20,40 L40,60 M40,40 L20,60" stroke={c} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M60,40 L80,60 M80,40 L60,60" stroke={c} strokeWidth="4.5" strokeLinecap="round" />
      </g>
    )
  },
  {
    id: 'staring',
    name: 'Staring',
    render: (c) => (
      <g>
        <circle cx="30" cy="45" r="12" fill="white" stroke={c} strokeWidth="4" />
        <circle cx="70" cy="45" r="12" fill="white" stroke={c} strokeWidth="4" />
      </g>
    )
  },
  {
    id: 'closed',
    name: 'Closed',
    render: (c) => (
      <g>
        <path d="M20,50 Q30,60 40,50" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" />
        <path d="M60,50 Q70,60 80,50" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" />
      </g>
    )
  },
  {
    id: 'huh',
    name: 'Huh?',
    render: (c) => (
      <g>
        {/* Left: squashed ellipse, Right: full huge circle as per huh_second.png */}
        <ellipse cx="25" cy="50" rx="18" ry="7" fill="white" stroke={c} strokeWidth="4" />
        <circle cx="75" cy="42" r="20" fill="white" stroke={c} strokeWidth="4" />
      </g>
    )
  },
  {
    id: 'raagghh',
    name: 'RAAAGGHH',
    render: (c) => (
      <g>
        {/* More jagged/aggressive red eyes as per sketch */}
        <path d="M48,35 L10,15 L5,68 C20,80 40,75 48,60 Z" fill="#ef4444" stroke={c} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M52,35 L90,15 L95,68 C80,80 60,75 52,60 Z" fill="#ef4444" stroke={c} strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    )
  },
  {
    id: 'love',
    name: 'In Love',
    render: () => (
      <g>
        <path d="M30,38 Q30,30 22,35 Q18,40 30,52 Q42,40 38,35 Q30,30 30,38" fill="#ef4444" />
        <path d="M70,38 Q70,30 62,35 Q58,40 70,52 Q82,40 78,35 Q70,30 70,38" fill="#ef4444" />
      </g>
    )
  },
  {
    id: 'thinking',
    name: 'Thinking',
    render: (c) => (
      <g>
        <path d="M22,35 C22,25 38,25 38,35 C38,45 22,45 22,35" fill="white" stroke={c} strokeWidth="3" />
        <path d="M62,48 C62,38 78,38 78,48 C78,58 62,58 62,48" fill="white" stroke={c} strokeWidth="3" />
      </g>
    )
  }
];

export const ACCESSORIES: Accessory[] = [
  {
    id: 'none',
    name: 'None',
    render: () => <g />,
    position: { x: 0, y: 0, scale: 1 }
  },
  {
    id: 'top-hat',
    name: 'Top Hat',
    render: () => (
      <g>
        <rect x="25" y="0" width="50" height="30" fill="#1a1a1a" />
        <rect x="20" y="25" width="60" height="8" fill="#1a1a1a" rx="4" />
        <rect x="25" y="20" width="50" height="5" fill="#ef4444" />
      </g>
    ),
    position: { x: 0, y: -5, scale: 1 }
  },
  {
    id: 'ushanka',
    name: 'Ushanka',
    render: () => (
      <g>
        <rect x="20" y="5" width="60" height="25" rx="5" fill="#2d3436" />
        <rect x="20" y="15" width="15" height="25" rx="2" fill="#2d3436" />
        <rect x="65" y="15" width="15" height="25" rx="2" fill="#2d3436" />
        <circle cx="50" cy="18" r="5" fill="#ef4444" />
      </g>
    ),
    position: { x: 0, y: -5, scale: 1.1 }
  },
  {
    id: 'monocle',
    name: 'Monocle',
    render: () => (
      <g>
        <circle cx="70" cy="45" r="12" fill="none" stroke="#ffd700" strokeWidth="2" />
        <line x1="82" y1="45" x2="95" y2="60" stroke="#ffd700" strokeWidth="1" />
      </g>
    ),
    position: { x: 0, y: 0, scale: 1 }
  },
  {
    id: 'bowtie',
    name: 'Bowtie',
    render: () => (
      <g>
        <path d="M35,90 L48,95 L48,85 Z" fill="#ef4444" />
        <path d="M65,90 L52,95 L52,85 Z" fill="#ef4444" />
        <circle cx="50" cy="90" r="3" fill="#ef4444" />
      </g>
    ),
    position: { x: 0, y: 0, scale: 1 }
  },
  {
    id: 'mustache',
    name: 'Mustache',
    render: () => (
      <g>
        <path d="M35,65 Q50,60 65,65 Q50,75 35,65" fill="#1a1a1a" />
      </g>
    ),
    position: { x: 0, y: 0, scale: 1 }
  },
  {
    id: 'deal-with-it',
    name: 'Deal With It',
    render: () => (
      <g>
        <path d="M5,42 H45 V55 Q45,75 25,75 Q5,75 5,55 Z" fill="#000000" />
        <path d="M55,42 H95 V55 Q95,75 75,75 Q55,75 55,55 Z" fill="#000000" />
        <rect x="45" y="42" width="10" height="5" fill="#000000" />
        <path d="M30,44 L15,73 H22 L37,44 Z" fill="#ffffff" opacity="0.3" />
        <path d="M80,44 L65,73 H72 L87,44 Z" fill="#ffffff" opacity="0.3" />
      </g>
    ),
    position: { x: 0, y: 0, scale: 1 }
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    render: () => (
      <g>
        <path d="M15,40 Q35,40 40,55 L40,65 Q35,75 20,75 Q5,75 5,60 L5,50 Q10,40 15,40" fill="#1a1a1a" />
        <path d="M85,40 Q65,40 60,55 L60,65 Q65,75 80,75 Q95,75 95,60 L95,50 Q90,40 85,40" fill="#1a1a1a" />
        <line x1="40" y1="48" x2="60" y2="48" stroke="#1a1a1a" strokeWidth="4" />
      </g>
    ),
    position: { x: 0, y: 0, scale: 1 }
  },
  {
    id: 'glasses',
    name: 'Glasses',
    render: () => (
      <g>
        <circle cx="30" cy="50" r="16" fill="none" stroke="#1a1a1a" strokeWidth="4" />
        <circle cx="70" cy="50" r="16" fill="none" stroke="#1a1a1a" strokeWidth="4" />
        <path d="M46,50 Q50,45 54,50" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="14" y1="50" x2="5" y2="45" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="86" y1="50" x2="95" y2="45" stroke="#1a1a1a" strokeWidth="3" />
      </g>
    ),
    position: { x: 0, y: 0, scale: 1 }
  }
];

export interface Country {
  code: string;
  name: string;
  url?: string;
}

export const COUNTRIES: Country[] = [
  { code: 'us', name: 'USA' },
  { code: 'gb', name: 'UK' },
  { code: 'fr', name: 'France' },
  { code: 'de', name: 'Germany' },
  { code: 'it', name: 'Italy' },
  { code: 'jp', name: 'Japan' },
  { code: 'br', name: 'Brazil' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'pl', name: 'Poland' },
  { code: 'ru', name: 'Russia' },
  { code: 'cn', name: 'China' },
  { code: 'es', name: 'Spain' },
  { code: 'mx', name: 'Mexico' },
  { code: 'in', name: 'India' },
  { code: 'ar', name: 'Argentina' },
  { code: 'gr', name: 'Greece' },
  { code: 'tr', name: 'Turkey' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'se', name: 'Sweden' },
  { code: 'no', name: 'Norway' },
  { code: 'fi', name: 'Finland' },
  { code: 'dk', name: 'Denmark' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'be', name: 'Belgium' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'at', name: 'Austria' },
  { code: 'pt', name: 'Portugal' },
  { code: 'kr', name: 'South Korea' },
  { code: 'vn', name: 'Vietnam' },
  { code: 'th', name: 'Thailand' },
  { code: 'id', name: 'Indonesia' },
  { code: 'my', name: 'Malaysia' },
  { code: 'ph', name: 'Philippines' },
  { code: 'sg', name: 'Singapore' },
  { code: 'nz', name: 'New Zealand' },
  { code: 'ie', name: 'Ireland' },
  { code: 'is', name: 'Iceland' },
  { code: 'cz', name: 'Czechia' },
  { code: 'hu', name: 'Hungary' },
  { code: 'ro', name: 'Romania' },
  { code: 'bg', name: 'Bulgaria' },
  { code: 'hr', name: 'Croatia' },
  { code: 'rs', name: 'Serbia' },
  { code: 'sk', name: 'Slovakia' },
  { code: 'si', name: 'Slovenia' },
  { code: 'ee', name: 'Estonia' },
  { code: 'lv', name: 'Latvia' },
  { code: 'lt', name: 'Lithuania' },
  { code: 'cl', name: 'Chile' },
  { code: 'co', name: 'Colombia' },
  { code: 'pe', name: 'Peru' },
  { code: 've', name: 'Venezuela' },
  { code: 'uy', name: 'Uruguay' },
  { code: 'py', name: 'Paraguay' },
  { code: 'bo', name: 'Bolivia' },
  { code: 'ec', name: 'Ecuador' },
  { code: 'pk', name: 'Pakistan' },
  { code: 'bd', name: 'Bangladesh' },
  { code: 'lk', name: 'Sri Lanka' },
  { code: 'np', name: 'Nepal' },
  { code: 'ma', name: 'Morocco' },
  { code: 'dz', name: 'Algeria' },
  { code: 'tn', name: 'Tunisia' },
  { code: 'ke', name: 'Kenya' },
  { code: 'et', name: 'Ethiopia' },
  { code: 'gh', name: 'Ghana' },
  { code: 'sn', name: 'Senegal' },
  { code: 'tz', name: 'Tanzania' },
  { code: 'cu', name: 'Cuba' },
  { code: 'jm', name: 'Jamaica' },
  { code: 'cr', name: 'Costa Rica' },
  { code: 'pa', name: 'Panama' },
  { code: 'eg', name: 'Egypt' },
  { code: 'za', name: 'South Africa' },
  { code: 'ng', name: 'Nigeria' },
  { code: 'il', name: 'Israel' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'ae', name: 'UAE' },
  { code: 'af', name: 'Afghanistan' },
  { code: 'al', name: 'Albania' },
  { code: 'ad', name: 'Andorra' },
  { code: 'ao', name: 'Angola' },
  { code: 'am', name: 'Armenia' },
  { code: 'az', name: 'Azerbaijan' },
  { code: 'bs', name: 'Bahamas' },
  { code: 'bh', name: 'Bahrain' },
  { code: 'bb', name: 'Barbados' },
  { code: 'by', name: 'Belarus' },
  { code: 'bz', name: 'Belize' },
  { code: 'bj', name: 'Benin' },
  { code: 'bt', name: 'Bhutan' },
  { code: 'ba', name: 'Bosnia' },
  { code: 'bw', name: 'Botswana' },
  { code: 'bn', name: 'Brunei' },
  { code: 'bf', name: 'Burkina Faso' },
  { code: 'bi', name: 'Burundi' },
  { code: 'kh', name: 'Cambodia' },
  { code: 'cm', name: 'Cameroon' },
  { code: 'cv', name: 'Cape Verde' },
  { code: 'cf', name: 'Central African Republic' },
  { code: 'td', name: 'Chad' },
  { code: 'km', name: 'Comoros' },
  { code: 'cg', name: 'Congo' },
  { code: 'cd', name: 'DR Congo' },
  { code: 'cy', name: 'Cyprus' },
  { code: 'dj', name: 'Djibouti' },
  { code: 'dm', name: 'Dominica' },
  { code: 'do', name: 'Dominican Republic' },
  { code: 'sv', name: 'El Salvador' },
  { code: 'gq', name: 'Equatorial Guinea' },
  { code: 'er', name: 'Eritrea' },
  { code: 'sz', name: 'Eswatini' },
  { code: 'fj', name: 'Fiji' },
  { code: 'ga', name: 'Gabon' },
  { code: 'gm', name: 'Gambia' },
  { code: 'ge', name: 'Georgia' },
  { code: 'gn', name: 'Guinea' },
  { code: 'gw', name: 'Guinea-Bissau' },
  { code: 'gy', name: 'Guyana' },
  { code: 'ht', name: 'Haiti' },
  { code: 'hn', name: 'Honduras' },
  { code: 'ir', name: 'Iran' },
  { code: 'iq', name: 'Iraq' },
  { code: 'jo', name: 'Jordan' },
  { code: 'kz', name: 'Kazakhstan' },
  { code: 'ki', name: 'Kiribati' },
  { code: 'kw', name: 'Kuwait' },
  { code: 'kg', name: 'Kyrgyzstan' },
  { code: 'la', name: 'Laos' },
  { code: 'lb', name: 'Lebanon' },
  { code: 'ls', name: 'Lesotho' },
  { code: 'lr', name: 'Liberia' },
  { code: 'ly', name: 'Libya' },
  { code: 'li', name: 'Liechtenstein' },
  { code: 'lu', name: 'Luxembourg' },
  { code: 'mg', name: 'Madagascar' },
  { code: 'mw', name: 'Malawi' },
  { code: 'mv', name: 'Maldives' },
  { code: 'ml', name: 'Mali' },
  { code: 'mt', name: 'Malta' },
  { code: 'mh', name: 'Marshall Islands' },
  { code: 'mr', name: 'Mauritania' },
  { code: 'mu', name: 'Mauritius' },
  { code: 'fm', name: 'Micronesia' },
  { code: 'md', name: 'Moldova' },
  { code: 'mc', name: 'Monaco' },
  { code: 'mn', name: 'Mongolia' },
  { code: 'me', name: 'Montenegro' },
  { code: 'mz', name: 'Mozambique' },
  { code: 'mm', name: 'Myanmar' },
  { code: 'na', name: 'Namibia' },
  { code: 'nr', name: 'Nauru' },
  { code: 'ni', name: 'Nicaragua' },
  { code: 'ne', name: 'Niger' },
  { code: 'mk', name: 'North Macedonia' },
  { code: 'om', name: 'Oman' },
  { code: 'pw', name: 'Palau' },
  { code: 'ps', name: 'Palestine' },
  { code: 'pg', name: 'Papua New Guinea' },
  { code: 'qa', name: 'Qatar' },
  { code: 'rw', name: 'Rwanda' },
  { code: 'kn', name: 'Saint Kitts and Nevis' },
  { code: 'lc', name: 'Saint Lucia' },
  { code: 'vc', name: 'Saint Vincent' },
  { code: 'ws', name: 'Samoa' },
  { code: 'sm', name: 'San Marino' },
  { code: 'st', name: 'Sao Tome and Principe' },
  { code: 'sc', name: 'Seychelles' },
  { code: 'sl', name: 'Sierra Leone' },
  { code: 'sb', name: 'Solomon Islands' },
  { code: 'so', name: 'Somalia' },
  { code: 'ss', name: 'South Sudan' },
  { code: 'sd', name: 'Sudan' },
  { code: 'sr', name: 'Suriname' },
  { code: 'sy', name: 'Syria' },
  { code: 'tj', name: 'Tajikistan' },
  { code: 'tg', name: 'Togo' },
  { code: 'to', name: 'Tonga' },
  { code: 'tt', name: 'Trinidad and Tobago' },
  { code: 'tm', name: 'Turkmenistan' },
  { code: 'tv', name: 'Tuvalu' },
  { code: 'ug', name: 'Uganda' },
  { code: 'uz', name: 'Uzbekistan' },
  { code: 'vu', name: 'Vanuatu' },
  { code: 'va', name: 'Vatican City' },
  { code: 'ye', name: 'Yemen' },
  { code: 'zm', name: 'Zambia' },
  { code: 'zw', name: 'Zimbabwe' },
  { code: 'tw', name: 'Taiwan' },
  { code: 'hk', name: 'Hong Kong' },
  { code: 'mo', name: 'Macau' },
];

export const HISTORICAL_COUNTRIES: Country[] = [
  { 
    code: 'ussr', 
    name: 'Soviet Union', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Soviet_Union.svg&w=1280' 
  },
  { 
    code: 'german-empire', 
    name: 'German Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_German_Empire.svg&w=1280' 
  },
  { 
    code: 'qing', 
    name: 'Qing Dynasty', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Qing_Dynasty_%281889%E2%80%931912%29.svg&w=1280' 
  },
  { 
    code: 'russian-empire', 
    name: 'Russian Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Russia_%281858%E2%80%931896%29.svg&w=1280' 
  },
  { 
    code: 'austria-hungary', 
    name: 'Austria-Hungary', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Austria-Hungary_%281869-1918%29.svg&w=1280' 
  },
  { 
    code: 'spqr', 
    name: 'Roman Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Vexilloid_of_the_Roman_Empire.svg&w=1280' 
  },
  { 
    code: 'south-vietnam', 
    name: 'South Vietnam', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_South_Vietnam.svg&w=1280' 
  },
  { 
    code: 'yugoslavia', 
    name: 'Yugoslavia (SFR)', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_SFR_Yugoslavia.svg&w=1280' 
  },
  { 
    code: 'ottoman', 
    name: 'Ottoman Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Ottoman_Empire.svg&w=1280' 
  },
  { 
    code: 'holy-roman-empire', 
    name: 'Holy Roman Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Holy_Roman_Empire_with_halo.svg&w=1280' 
  },
  { 
    code: 'zaire', 
    name: 'Zaire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Zaire_%281971%E2%80%931997%29.svg&w=1280' 
  },
  { 
    code: 'rhodesia', 
    name: 'Rhodesia', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Rhodesia_%281968%E2%80%931979%29.svg&w=1280' 
  },
  { 
    code: 'venice', 
    name: 'Rep. of Venice', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Republic_of_Venice.svg&w=1280' 
  },
  { 
    code: 'manchukuo', 
    name: 'Manchukuo', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Manchukuo.svg&w=1280' 
  },
  { 
    code: 'republic-china', 
    name: 'Rep. of China (1912)', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Republic_of_China_%281912%E2%80%931928%29.svg&w=1280' 
  },
  { 
    code: 'confederate', 
    name: 'Confederate States', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Confederate_States_of_America_%281861%E2%80%931863%29.svg&w=1280' 
  },
  { 
    code: 'gran-colombia', 
    name: 'Gran Colombia', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Gran_Colombia_%281821-1831%29.svg&w=1280' 
  },
  { 
    code: 'two-sicilies', 
    name: 'Two Sicilies', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Kingdom_of_the_Two_Sicilies_%281816%29.svg&w=1280' 
  },
  { 
    code: 'prussia', 
    name: 'Prussia', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Kingdom_of_Prussia_%281892-1918%29.svg&w=1280' 
  },
  { 
    code: 'byzantine', 
    name: 'Byzantine Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Palaeologus_Emperors.svg&w=1280' 
  },
  { 
    code: 'napoleon', 
    name: 'French Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Imperial_Standard_of_Napoleon_I.svg&w=1280' 
  },
  { 
    code: 'cross-burgundy', 
    name: 'Spanish Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Spanish_Empire_(Cross_of_Burgundy).svg&w=1280' 
  },
  { 
    code: 'venezuela-1811', 
    name: 'Venezuela (1811)', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Venezuela_%281811%29.svg&w=1280' 
  },
  { 
    code: 'brazil-empire', 
    name: 'Empire of Brazil', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Empire_of_Brazil.svg&w=1280' 
  },
  { 
    code: 'portugal-kingdom', 
    name: 'Kingdom of Portugal', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Kingdom_of_Portugal_%281830-1910%29.svg&w=1280' 
  },
  { 
    code: 'mexico-empire', 
    name: 'Mexican Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Second_Mexican_Empire.svg&w=1280' 
  },
  { 
    code: 'ethiopia-empire', 
    name: 'Abyssinia', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Ethiopia_%281897%E2%80%931936%3B_1941%E2%80%931974%29.svg&w=1280' 
  },
  { 
    code: 'persia-qajar', 
    name: 'Qajar Persia', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Persia_%281906-1910%29.svg&w=1280' 
  },
  { 
    code: 'tokugawa', 
    name: 'Tokugawa Shogunate', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Tokugawa_family_crest.svg&w=1280' 
  },
  { 
    code: 'eic', 
    name: 'East India Co.', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_British_East_India_Company_%281801%29.svg&w=1280' 
  },
  { 
    code: 'tibet', 
    name: 'Tibet (1912-1959)', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Tibet.svg&w=1280' 
  },
  { 
    code: 'italy-kingdom', 
    name: 'Kingdom of Italy', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Italy_%281861%E2%80%931946%29.svg&w=1280' 
  },
  { 
    code: 'texas-rep', 
    name: 'Rep. of Texas', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Republic_of_Texas_%281839%E2%80%931845%29.svg&w=1280' 
  },
  { 
    code: 'greece-kingdom', 
    name: 'Kingdom of Greece', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Greece_%281822-1978%29.svg&w=1280' 
  },
  { 
    code: 'safavid', 
    name: 'Safavid Persia', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Safavid_Flag.svg&w=1280' 
  },
  { 
    code: 'mongol-empire', 
    name: 'Mongol Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Banner_of_the_Mongol_Empire.svg&w=1280' 
  },
  { 
    code: 'timurid', 
    name: 'Timurid Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Timurid_Empire.svg&w=1280' 
  },
  { 
    code: 'ryukyu', 
    name: 'Ryukyu Kingdom', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Ryukyu_Kingdom_flag.svg&w=1280' 
  },
  { 
    code: 'sikh-empire', 
    name: 'Sikh Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Nishan_Sahib_of_the_Sikh_Empire.svg&w=1280' 
  },
  { 
    code: 'maratha', 
    name: 'Maratha Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Maratha_Empire.svg&w=1280' 
  },
  { 
    code: 'bfa', 
    name: 'Upper Volta', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Upper_Volta.svg&w=1280' 
  },
  { 
    code: 'dahomey', 
    name: 'Dahomey', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_Dahomey.svg&w=1280' 
  },
  { 
    code: 'south-africa-1928', 
    name: 'South Africa (1928)', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_South_Africa_%281928%E2%80%931994%29.svg&w=1280' 
  },
  { 
    code: 'japan-empire', 
    name: 'Empire of Japan', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Imperial_Japanese_Navy.svg&w=1280' 
  },
  { 
    code: 'spain-rep', 
    name: 'Second Spanish Rep.', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Second_Spanish_Republic.svg&w=1280' 
  },
  { 
    code: 'finland-grand-duchy', 
    name: 'G.D. of Finland', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Grand_Duchy_of_Finland_%281917%E2%80%931918%29.svg&w=1280' 
  },
  { 
    code: 'mexico-first-empire', 
    name: 'First Mexican Empire', 
    url: 'https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_First_Mexican_Empire.svg&w=1280' 
  },
];
