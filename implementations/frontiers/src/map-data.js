export const REGIONS = {
  aurelian: { name: 'Aurelian Reach', bonus: 4, color: '#d9a441' },
  verdant: { name: 'Verdant Coil', bonus: 4, color: '#4fa56b' },
  ember: { name: 'Ember Marches', bonus: 5, color: '#cf624d' },
  nacre: { name: 'Nacre Isles', bonus: 3, color: '#5da6b8' },
  zephyr: { name: 'Zephyr Crown', bonus: 4, color: '#7a82d2' },
  umbral: { name: 'Umbral Expanse', bonus: 4, color: '#8c6ba8' }
};

const t = (id, name, region, points, neighbors) => ({ id, name, region, points, neighbors });

export const TERRITORIES = [
  t('solhaven','Solhaven','aurelian','70,105 150,75 195,120 165,178 88,172',['amberstep','kestrel-vale']),
  t('amberstep','Amberstep','aurelian','150,75 245,72 273,128 195,120',['solhaven','kestrel-vale','brightscar']),
  t('kestrel-vale','Kestrel Vale','aurelian','88,172 165,178 195,120 273,128 255,212 170,235 92,220',['solhaven','amberstep','brightscar','crownmere']),
  t('brightscar','Brightscar','aurelian','273,128 342,150 326,226 255,212',['amberstep','kestrel-vale','lumen-coast','red-basin']),
  t('lumen-coast','Lumen Coast','aurelian','170,235 255,212 326,226 309,296 220,315 153,286',['brightscar','crownmere','sylvan-gate']),
  t('crownmere','Crownmere','aurelian','92,220 170,235 153,286 92,305 55,256',['kestrel-vale','lumen-coast','elderbank','cinderfall','eclipse-gate']),
  t('mossward','Mossward','verdant','88,355 166,326 215,370 181,430 101,423',['greenveil','reedfen']),
  t('greenveil','Greenveil','verdant','166,326 255,330 278,386 215,370',['mossward','reedfen','elderbank']),
  t('reedfen','Reedfen','verdant','101,423 181,430 215,370 278,386 266,463 176,486 92,469',['mossward','greenveil','elderbank','thistle-run']),
  t('elderbank','Elderbank','verdant','278,386 354,404 337,478 266,463',['greenveil','reedfen','sylvan-gate','crownmere']),
  t('thistle-run','Thistle Run','verdant','92,469 176,486 266,463 251,542 155,566 79,531',['reedfen','sylvan-gate']),
  t('sylvan-gate','Sylvan Gate','verdant','266,463 337,478 365,535 318,586 251,542',['elderbank','thistle-run','lumen-coast','furnace-reach']),
  t('cinderfall','Cinderfall','ember','403,202 470,171 516,213 491,274 414,277',['ashridge','red-basin','crownmere']),
  t('ashridge','Ashridge','ember','470,171 559,167 600,218 516,213',['cinderfall','red-basin','pyrehold','galecrest','blackreach']),
  t('red-basin','Red Basin','ember','414,277 491,274 516,213 600,218 597,302 513,333 424,325',['cinderfall','ashridge','pyrehold','furnace-reach','brightscar']),
  t('pyrehold','Pyrehold','ember','600,218 655,246 651,327 597,302',['ashridge','red-basin','scoria-gate','cloudmere']),
  t('furnace-reach','Furnace Reach','ember','424,325 513,333 597,302 585,393 505,424 419,390',['red-basin','scoria-gate','sylvan-gate','shellspire']),
  t('scoria-gate','Scoria Gate','ember','597,302 651,327 663,399 585,393',['pyrehold','furnace-reach','tidecross']),
  t('pearlwatch','Pearlwatch','nacre','731,391 786,365 828,405 806,455 746,455',['driftkey','glassharbor']),
  t('driftkey','Driftkey','nacre','828,405 888,390 925,431 893,475 806,455',['pearlwatch','glassharbor','moonshoal']),
  t('glassharbor','Glassharbor','nacre','746,455 806,455 893,475 873,526 792,538 724,511',['pearlwatch','driftkey','moonshoal','tidecross']),
  t('moonshoal','Moonshoal','nacre','893,475 950,487 956,541 873,526',['driftkey','glassharbor','shellspire']),
  t('tidecross','Tidecross','nacre','724,511 792,538 873,526 855,586 773,606 705,568',['glassharbor','shellspire','scoria-gate','tempest-fold']),
  t('shellspire','Shellspire','nacre','873,526 956,541 948,603 855,586',['moonshoal','tidecross','furnace-reach']),
  t('galecrest','Galecrest','zephyr','703,105 775,76 820,117 799,175 718,171',['skyreach','cloudmere','ashridge']),
  t('skyreach','Skyreach','zephyr','775,76 862,74 896,126 820,117',['galecrest','cloudmere','windscar','shadowfen']),
  t('cloudmere','Cloudmere','zephyr','718,171 799,175 820,117 896,126 889,207 808,235 721,221',['galecrest','skyreach','windscar','high-aerie','pyrehold']),
  t('windscar','Windscar','zephyr','896,126 955,151 949,225 889,207',['skyreach','cloudmere','tempest-fold']),
  t('high-aerie','High Aerie','zephyr','721,221 808,235 889,207 875,286 789,307 707,279',['cloudmere','tempest-fold']),
  t('tempest-fold','Tempest Fold','zephyr','889,207 949,225 962,289 875,286',['windscar','high-aerie','tidecross']),
  t('duskmire','Duskmire','umbral','385,58 445,28 494,68 470,119 405,117',['nightglass','shadowfen']),
  t('nightglass','Nightglass','umbral','445,28 525,23 558,72 494,68',['duskmire','shadowfen','hollow-star']),
  t('shadowfen','Shadowfen','umbral','405,117 470,119 494,68 558,72 560,137 493,164 420,157',['duskmire','nightglass','hollow-star','eclipse-gate','skyreach']),
  t('hollow-star','Hollow Star','umbral','558,72 625,82 647,137 560,137',['nightglass','shadowfen','blackreach']),
  t('blackreach','Blackreach','umbral','560,137 647,137 668,185 611,205 550,178',['hollow-star','eclipse-gate','ashridge']),
  t('eclipse-gate','Eclipse Gate','umbral','420,157 493,164 550,178 511,198 445,190',['shadowfen','blackreach','crownmere'])
];

export const TERRITORY_BY_ID = Object.fromEntries(TERRITORIES.map(x => [x.id, x]));
export const ADJACENCY = Object.fromEntries(TERRITORIES.map(x => [x.id, [...x.neighbors]]));
export const REGION_TERRITORIES = Object.fromEntries(Object.keys(REGIONS).map(region => [region, TERRITORIES.filter(t => t.region === region).map(t => t.id)]));
