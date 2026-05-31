const SPEED_OF_SOUND = 3.23;
const DB_MIN = -40;
const DB_MAX = 0;
const BOUNDARY_REFLECTION = 0.999;

const MATERIALS = {
    'st3': { name: 'Ст3 (конструкционная)', speed: 3.23, density: 7.85, attenuation: 0.5 },
    'st20': { name: 'Ст20 (углеродистая)', speed: 3.25, density: 7.85, attenuation: 0.45 },
    '10hsnd': { name: '10ХСНД (низколегированная)', speed: 3.24, density: 7.86, attenuation: 0.55 },
    '09g2s': { name: '09Г2С (низколегированная)', speed: 3.26, density: 7.85, attenuation: 0.52 },
    '12x18n10t': { name: '12Х18Н10Т (нержавеющая)', speed: 3.10, density: 7.90, attenuation: 0.85 },
    'aluminum': { name: 'Алюминий АМг6', speed: 3.10, density: 2.70, attenuation: 0.25 },
    'titanium': { name: 'Титан ВТ1-0', speed: 3.15, density: 4.50, attenuation: 0.65 }
};

const FREQUENCIES = [
    { value: 1.8, label: '1.8 МГц' },
    { value: 2.5, label: '2.5 МГц' },
    { value: 5.0, label: '5.0 МГц' },
    { value: 10.0, label: '10.0 МГц' }
];

const PROBE_MODELS = {
    std: { name: 'Стандартный', freq: 2.5, baseArrow: 10, width: 21, height: 30, diam: 18, att_dB: 0.5, shape: 'round' },
    mini: { name: 'Малогабаритный', freq: 5.0, baseArrow: 8, width: 16.5, height: 22, diam: 14, att_dB: 1.2, shape: 'round' }
};

const REINFORCEMENT_SHAPES = {
    smooth: { name: 'Плавная', power: 2 },
    medium: { name: 'Средняя', power: 4 },
    sharp: { name: 'Острая', power: 8 },
    rectangular: { name: 'Прямоугольная', power: 100 }
};

const DEFECT_NAMES = { pore: 'Пора', slag: 'Шлак', crack: 'Трещина', lof: 'Несплавление' };
const DEFECT_AMP_MOD = { pore: 1.2, slag: 1.4, crack: 1.8, lof: 1.6 };
const PLANAR_DEFECTS = ['crack', 'lof'];
