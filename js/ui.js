const uzCanvas = document.getElementById('uzCanvas'), uzCtx = uzCanvas.getContext('2d');
const displayCanvas = document.getElementById('displayCanvas'), displayCtx = displayCanvas.getContext('2d');
const canvasWrap = document.getElementById('canvasWrap');
const sliderH = document.getElementById('sliderH'), sliderAlpha = document.getElementById('sliderAlpha');
const sliderL = document.getElementById('sliderL'), selSide = document.getElementById('selSide');
const selMode = document.getElementById('selMode'), selProbe = document.getElementById('selProbe');
const sliderPhi = document.getElementById('sliderPhi'), sliderGain = document.getElementById('sliderGain'), sliderReflectionBoost = document.getElementById('sliderReflectionBoost');
const sliderHue = document.getElementById('sliderHue');
const selWeldType = document.getElementById('selWeldType');
const sliderB = document.getElementById('sliderB'), sliderBeta = document.getElementById('sliderBeta');
const sliderC = document.getElementById('sliderC');
const sliderWface = document.getElementById('sliderWface'), sliderWroot = document.getElementById('sliderWroot');
const sliderWfaceOffset = document.getElementById('sliderWfaceOffset'), sliderWrootOffset = document.getElementById('sliderWrootOffset');
const sliderGf = document.getElementById('sliderGf'), sliderGr = document.getElementById('sliderGr');
const selActiveDefect = document.getElementById('selActiveDefect');
const sliderDefSize = document.getElementById('sliderDefSize'), sliderDefAngle = document.getElementById('sliderDefAngle');
const sliderGateReject = document.getElementById('sliderGateReject'), sliderGateControl = document.getElementById('sliderGateControl'), sliderGateSearch = document.getElementById('sliderGateSearch');
const btnAddPore = document.getElementById('btnAddPore'), btnAddSlag = document.getElementById('btnAddSlag');
const btnAddCrack = document.getElementById('btnAddCrack'), btnAddLOF = document.getElementById('btnAddLOF'), btnDelDefect = document.getElementById('btnDelDefect');
const detectDot = document.getElementById('detectDot'), detectText = document.getElementById('detectText');
const valH = document.getElementById('valH'), valAlpha = document.getElementById('valAlpha'), valL = document.getElementById('valL');
const valPhi = document.getElementById('valPhi'), valGain = document.getElementById('valGain'), valReflectionBoost = document.getElementById('valReflectionBoost'), valHue = document.getElementById('valHue');
const valB = document.getElementById('valB'), valBeta = document.getElementById('valBeta'), valC = document.getElementById('valC');
const valWface = document.getElementById('valWface'), valWroot = document.getElementById('valWroot');
const valWfaceOffset = document.getElementById('valWfaceOffset'), valWrootOffset = document.getElementById('valWrootOffset');
const valGf = document.getElementById('valGf'), valGr = document.getElementById('valGr');
const valDefType = document.getElementById('valDefType'), valDefSize = document.getElementById('valDefSize'), valDefAngle = document.getElementById('valDefAngle');
const valGateReject = document.getElementById('valGateReject'), valGateControl = document.getElementById('valGateControl'), valGateSearch = document.getElementById('valGateSearch');
const fontScaleSlider = document.getElementById('fontScaleSlider'), fontScaleValue = document.getElementById('fontScaleValue'), defectSizeHint = document.getElementById('defectSizeHint');
const btnThemeDark = document.getElementById('btnThemeDark'), btnThemeLight = document.getElementById('btnThemeLight');
const valN = document.getElementById('valN');
const valFarZone = document.getElementById('valFarZone');
const valFirstDist = document.getElementById('valFirstDist');
const valDetected = document.getElementById('valDetected');
const valShadow = document.getElementById('valShadow');
const valDefX = document.getElementById('valDefX');
const valDefY = document.getElementById('valDefY');
const valDefZ = document.getElementById('valDefZ');
const valDefA = document.getElementById('valDefA');
const selRefLevel = document.getElementById('selRefLevel');
const selPiezoShape = document.getElementById('selPiezoShape');
const sliderPiezoDiam = document.getElementById('sliderPiezoDiam');
const sliderPiezoA = document.getElementById('sliderPiezoA');
const sliderPiezoB = document.getElementById('sliderPiezoB');
const sliderPiezoArrow = document.getElementById('sliderPiezoArrow');
const valPiezoDiam = document.getElementById('valPiezoDiam');
const valPiezoA = document.getElementById('valPiezoA');
const valPiezoB = document.getElementById('valPiezoB');
const valPiezoArrow = document.getElementById('valPiezoArrow');
const rowPiezoDiam = document.getElementById('rowPiezoDiam');
const rowPiezoA = document.getElementById('rowPiezoA');
const rowPiezoB = document.getElementById('rowPiezoB');
const sliderEdgeOffset = document.getElementById('sliderEdgeOffset');
const sliderAxisKink = document.getElementById('sliderAxisKink');
const valEdgeOffset = document.getElementById('valEdgeOffset');
const valAxisKink = document.getElementById('valAxisKink');
const sliderGfAngle = document.getElementById('sliderGfAngle');
const sliderGrAngle = document.getElementById('sliderGrAngle');
const valGfAngle = document.getElementById('valGfAngle');
const valGrAngle = document.getElementById('valGrAngle');
const selGfShape = document.getElementById('selGfShape');
const selGrShape = document.getElementById('selGrShape');
const selMaterial = document.getElementById('selMaterial');
const selFrequency = document.getElementById('selFrequency');
const selAscanXAxis = document.getElementById('selAscanXAxis');
const valMaterialName = document.getElementById('valMaterialName');
const valSpeedOfSound = document.getElementById('valSpeedOfSound');
const valFrequency = document.getElementById('valFrequency');
const valWavelength = document.getElementById('valWavelength');
const valAttenuation = document.getElementById('valAttenuation');
const ascanInfoX = document.getElementById('ascanInfoX');
const ascanInfoY = document.getElementById('ascanInfoY');
const ascanInfoS = document.getElementById('ascanInfoS');
const ascanInfoA = document.getElementById('ascanInfoA');
const chkGate1 = document.getElementById('chkGate1');
const sliderGate1Start = document.getElementById('sliderGate1Start');
const sliderGate1End = document.getElementById('sliderGate1End');
const valGate1Start = document.getElementById('valGate1Start');
const valGate1End = document.getElementById('valGate1End');
const colorGate1 = document.getElementById('colorGate1');
const chkGate2 = document.getElementById('chkGate2');
const sliderGate2Start = document.getElementById('sliderGate2Start');
const sliderGate2End = document.getElementById('sliderGate2End');
const valGate2Start = document.getElementById('valGate2Start');
const valGate2End = document.getElementById('valGate2End');
const colorGate2 = document.getElementById('colorGate2');
const chkGate3 = document.getElementById('chkGate3');
const sliderGate3Start = document.getElementById('sliderGate3Start');
const sliderGate3End = document.getElementById('sliderGate3End');
const valGate3Start = document.getElementById('valGate3Start');
const valGate3End = document.getElementById('valGate3End');
const colorGate3 = document.getElementById('colorGate3');
const sliderSweepWidth = document.getElementById('sliderSweepWidth');
const valSweepWidth = document.getElementById('valSweepWidth');

let state = {
    H: 20, alpha: 65, L: 28, side: 'top-left', mode: 'direct', probeModel: 'std', phi: 8, gain: 40, reflectionBoost: 0, theme: 'dark', accentHue: 28,
    gateReject: -8, gateControl: -14, gateSearch: -22, refLevel: 'search', weldType: 'V_single', b: 2, beta: 30, c: 1,
    Wface: 8, WfaceOffset: 0, Gf: 1.5, Wroot: 6, WrootOffset: 0, Gr: 1.5,
    edgeOffset: 0, axisKink: 0,
    GfAngle: 0, GrAngle: 0,
    GfShape: 'smooth', GrShape: 'smooth',
    piezoShape: 'round', piezoDiam: 12, piezoA: 10, piezoB: 10, piezoArrow: 10,
    material: 'st3', frequency: 2.5,
    ascanXAxis: 'path',
    sweepWidth: 150,
    gate1Enabled: true, gate1Start: 0, gate1End: 50, gate1Color: '#64c8ff', gate1Level: -22,
    gate2Enabled: false, gate2Start: 50, gate2End: 100, gate2Color: '#ffc864', gate2Level: -14,
    gate3Enabled: false, gate3Start: 100, gate3End: 150, gate3Color: '#c864ff', gate3Level: -8,
    defects: [
        { id: 0, type: 'pore', x: -3, y: 8, size: 2, angle: 0 },
        { id: 1, type: 'crack', x: 2, y: 14, size: 3.5, angle: 15 },
        { id: 2, type: 'slag', x: 0, y: 11, size: 2.8, angle: 45 }
    ],
    activeDefectIndex: 0, probeWorldX: 0, dragMode: null, dragDefectIndex: -1, dragStartMouse: null, dragStartValue: null, zoom: 1.0
};

let gateDragState = null;
let gateHoverState = null;

function recalcProbeWorldX() { state.probeWorldX = state.L; }

function updatePiezoShapeUI() {
    if (state.piezoShape === 'round') {
        rowPiezoDiam.style.display = '';
        rowPiezoA.style.display = 'none';
        rowPiezoB.style.display = 'none';
    } else {
        rowPiezoDiam.style.display = 'none';
        rowPiezoA.style.display = '';
        rowPiezoB.style.display = '';
    }
}

function applyLConstraints() {
    let minC = getMinAbsL();
    const maxAbs = getPlateHalfWidth();
    let newL = state.L;
    if (minC !== 0) {
        if (state.side.endsWith('left')) newL = Math.max(minC, Math.min(maxAbs, newL));
        else newL = Math.min(minC, Math.max(-maxAbs, newL));
    } else newL = Math.max(-maxAbs, Math.min(maxAbs, newL));
    if (newL !== state.L) { state.L = newL; sliderL.value = state.L; valL.textContent = state.L.toFixed(1); }
    sliderL.min = -maxAbs;
    sliderL.max = maxAbs;
}

function updateDefectSizeSlider() {
    if (state.activeDefectIndex >= 0) {
        const defect = state.defects[state.activeDefectIndex];
        const range = getDefectSizeRange(defect.type);
        sliderDefSize.min = range.min;
        sliderDefSize.max = range.max;
        sliderDefSize.step = defect.type === 'pore' ? 0.1 : 0.5;
        if (defect.size < range.min) defect.size = range.min;
        if (defect.size > range.max) defect.size = range.max;
        sliderDefSize.value = defect.size;
        valDefSize.textContent = defect.size.toFixed(1);
        updateDefectSizeHint();
    }
}

function updateDefectSizeHint() {
    if (state.activeDefectIndex >= 0) {
        const type = state.defects[state.activeDefectIndex].type;
        const planar = PLANAR_DEFECTS.includes(type);
        defectSizeHint.textContent = `${planar ? 'Планарный' : 'Объёмный'}: 0.5–${planar ? 'H' : '10'} мм`;
    } else defectSizeHint.textContent = 'Выберите дефект';
}

function updateUI() {
    applyAppearance();
    applyLConstraints();
    updatePiezoShapeUI();
    valH.textContent = state.H.toFixed(1);
    valAlpha.textContent = state.alpha.toFixed(1);
    valL.textContent = state.L.toFixed(1);
    valPhi.textContent = state.phi.toFixed(1);
    valGain.textContent = state.gain.toFixed(1);
    valReflectionBoost.textContent = state.reflectionBoost.toFixed(1);
    valB.textContent = state.b.toFixed(1);
    valBeta.textContent = state.beta.toFixed(1);
    valC.textContent = state.c.toFixed(1);
    valWface.textContent = state.Wface.toFixed(1);
    valWroot.textContent = state.Wroot.toFixed(1);
    valWfaceOffset.textContent = state.WfaceOffset.toFixed(1);
    valWrootOffset.textContent = state.WrootOffset.toFixed(1);
    valEdgeOffset.textContent = state.edgeOffset.toFixed(1);
    valAxisKink.textContent = state.axisKink.toFixed(1);
    valGfAngle.textContent = state.GfAngle.toFixed(0);
    valGrAngle.textContent = state.GrAngle.toFixed(0);
    valGf.textContent = state.Gf.toFixed(1);
    valGr.textContent = state.Gr.toFixed(1);
    valGateReject.textContent = state.gateReject;
    valGateControl.textContent = state.gateControl;
    valGateSearch.textContent = state.gateSearch;
    valPiezoDiam.textContent = state.piezoDiam.toFixed(1);
    valPiezoA.textContent = state.piezoA.toFixed(1);
    valPiezoB.textContent = state.piezoB.toFixed(1);
    valPiezoArrow.textContent = state.piezoArrow;
    sliderH.value = state.H;
    sliderAlpha.value = state.alpha;
    sliderL.value = state.L;
    sliderPhi.value = state.phi;
    sliderGain.value = state.gain;
    sliderReflectionBoost.value = state.reflectionBoost;
    sliderB.value = state.b;
    sliderBeta.value = state.beta;
    sliderC.value = state.c;
    sliderWface.value = state.Wface;
    sliderWroot.value = state.Wroot;
    sliderWfaceOffset.value = state.WfaceOffset;
    sliderWrootOffset.value = state.WrootOffset;
    sliderEdgeOffset.value = state.edgeOffset;
    sliderAxisKink.value = state.axisKink;
    sliderGfAngle.value = state.GfAngle;
    sliderGrAngle.value = state.GrAngle;
    sliderGf.value = state.Gf;
    sliderGr.value = state.Gr;
    sliderGateReject.value = state.gateReject;
    sliderGateControl.value = state.gateControl;
    sliderGateSearch.value = state.gateSearch;
    sliderPiezoDiam.value = state.piezoDiam;
    sliderPiezoA.value = state.piezoA;
    sliderPiezoB.value = state.piezoB;
    sliderPiezoArrow.value = state.piezoArrow;
    selSide.value = state.side;
    selMode.value = state.mode;
    selProbe.value = state.probeModel;
    selWeldType.value = state.weldType;
    selPiezoShape.value = state.piezoShape;
    selGfShape.value = state.GfShape;
    selGrShape.value = state.GrShape;
    selMaterial.value = state.material;
    selFrequency.value = state.frequency;
    selAscanXAxis.value = state.ascanXAxis;
    chkGate1.checked = state.gate1Enabled;
    sliderGate1Start.value = state.gate1Start;
    valGate1Start.textContent = state.gate1Start;
    sliderGate1End.value = state.gate1End;
    valGate1End.textContent = state.gate1End;
    chkGate2.checked = state.gate2Enabled;
    sliderGate2Start.value = state.gate2Start;
    valGate2Start.textContent = state.gate2Start;
    sliderGate2End.value = state.gate2End;
    valGate2End.textContent = state.gate2End;
    chkGate3.checked = state.gate3Enabled;
    sliderGate3Start.value = state.gate3Start;
    valGate3Start.textContent = state.gate3Start;
    sliderGate3End.value = state.gate3End;
    valGate3End.textContent = state.gate3End;
    sliderSweepWidth.value = state.sweepWidth;
    valSweepWidth.textContent = state.sweepWidth;

    selActiveDefect.innerHTML = '<option value="-1">Нет активного</option>';
    state.defects.forEach((d, i) => {
        let opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${DEFECT_NAMES[d.type]} #${d.id} (${d.size.toFixed(1)}мм)`;
        selActiveDefect.appendChild(opt);
    });
    if (state.activeDefectIndex >= 0 && state.activeDefectIndex < state.defects.length) {
        selActiveDefect.value = state.activeDefectIndex;
        let ad = state.defects[state.activeDefectIndex];
        valDefType.textContent = DEFECT_NAMES[ad.type];
        valDefSize.textContent = ad.size.toFixed(1);
        valDefAngle.textContent = ad.angle.toFixed(0);
        sliderDefSize.value = ad.size;
        sliderDefAngle.value = ad.angle;
        sliderDefSize.disabled = false;
        sliderDefAngle.disabled = false;
        updateDefectSizeSlider();
    } else {
        valDefType.textContent = '—';
        valDefSize.textContent = '—';
        valDefAngle.textContent = '—';
        sliderDefSize.disabled = true;
        sliderDefAngle.disabled = true;
        updateDefectSizeHint();
    }

    valN.textContent = getNearZone().toFixed(1) + ' мм';
    valFarZone.textContent = '> ' + getFarZoneStart().toFixed(1) + ' мм';

    const mat = getMaterial();
    valMaterialName.textContent = mat.name;
    valSpeedOfSound.textContent = getSpeedOfSound().toFixed(2) + ' мм/мкс';
    valFrequency.textContent = state.frequency.toFixed(1) + ' МГц';
    valWavelength.textContent = getWavelength().toFixed(2) + ' мм';
    valAttenuation.textContent = (getMaterial().attenuation).toFixed(2) + ' dB/см';

    const allSigs = calculateAllSignals().signals;
    const defectSigs = allSigs.filter(s => s.type === 'defect');
    const stepSigs = allSigs.filter(s => s.type === 'step');
    const echoSigs = allSigs.filter(s => s.type !== 'bottom' && s.type !== 'boundary');
    valDetected.textContent = defectSigs.length + (stepSigs.length ? ` (+ступенька)` : '');

    const refLevelMap = { search: state.gateSearch, control: state.gateControl, reject: state.gateReject };
    const refDb = refLevelMap[state.refLevel] ?? state.gateSearch;

    if (state.activeDefectIndex >= 0 && state.activeDefectIndex < state.defects.length) {
        const ad = state.defects[state.activeDefectIndex];
        const origin = getBeamOrigin();
        const entrySurfY = getNominalSurfaceY(getEntrySurface());
        const xDist = ad.x - origin.x;
        const yDepth = Math.abs(ad.y - entrySurfY);
        const defSig = defectSigs.find(s => s.defectIndex === state.activeDefectIndex);
        const zPath = defSig ? defSig.pathLength : null;
        const ampDb = defSig ? (defSig.amplitudeDb ?? amplitudeToDb(defSig.amplitude)) : null;
        const deltaA = ampDb !== null ? (ampDb - refDb) : null;
        valDefX.textContent = xDist.toFixed(1) + ' мм';
        valDefY.textContent = yDepth.toFixed(1) + ' мм';
        valDefZ.textContent = zPath !== null ? zPath.toFixed(1) + ' мм' : '—';
        valDefA.textContent = deltaA !== null ? (deltaA >= 0 ? '+' : '') + deltaA.toFixed(1) + ' dB' : '—';
        ascanInfoX.textContent = xDist.toFixed(1) + ' мм';
        ascanInfoY.textContent = yDepth.toFixed(1) + ' мм';
        ascanInfoS.textContent = zPath !== null ? zPath.toFixed(1) + ' мм' : '—';
        ascanInfoA.textContent = deltaA !== null ? (deltaA >= 0 ? '+' : '') + deltaA.toFixed(1) + ' dB' : '—';
    } else {
        valDefX.textContent = '—';
        valDefY.textContent = '—';
        valDefZ.textContent = '—';
        valDefA.textContent = '—';
        ascanInfoX.textContent = '—';
        ascanInfoY.textContent = '—';
        ascanInfoS.textContent = '—';
        ascanInfoA.textContent = '—';
    }

    if (defectSigs.length) {
        valFirstDist.textContent = defectSigs[0].pathLength.toFixed(1) + ' мм';
        const sh = defectSigs.find(s => s.defectIndex === state.activeDefectIndex)?.shadowT;
        valShadow.textContent = sh !== undefined ? `${Math.round((1 - sh) * 100)}%` : '—';
        detectDot.classList.add('detected');
        detectText.textContent = `Обнаружено ${defectSigs.length} дефект(ов)`;
    } else if (echoSigs.length) {
        valFirstDist.textContent = echoSigs[0].pathLength.toFixed(1) + ' мм';
        valShadow.textContent = '—';
        detectDot.classList.add('detected');
        detectText.textContent = stepSigs.length ? `Обнаружена ступенька` : `Обнаружен сигнал`;
    } else {
        valFirstDist.textContent = '—';
        valShadow.textContent = '—';
        detectDot.classList.remove('detected');
        detectText.textContent = 'Нет сигнала';
    }
}

function applyAppearance() {
    document.body.dataset.theme = state.theme;
    document.documentElement.style.setProperty('--accent-h', state.accentHue);
    document.documentElement.style.setProperty('--accent', `hsl(${state.accentHue},88%,59%)`);
}

function fullRedraw() { recalcProbeWorldX(); drawUzCanvas(); drawDisplayCanvas(); updateUI(); }

function onParamChange() {
    state.refLevel = selRefLevel.value;
    state.H = +sliderH.value;
    state.alpha = +sliderAlpha.value;
    state.L = +sliderL.value;
    state.side = selSide.value;
    state.mode = selMode.value;
    const prevProbe = state.probeModel;
    state.probeModel = selProbe.value;
    if (state.probeModel !== prevProbe) {
        state.piezoArrow = PROBE_MODELS[state.probeModel].baseArrow;
        sliderPiezoArrow.value = state.piezoArrow;
    }
    state.phi = +sliderPhi.value;
    state.gain = +sliderGain.value;
    state.reflectionBoost = +sliderReflectionBoost.value;
    state.gateReject = +sliderGateReject.value;
    state.gateControl = +sliderGateControl.value;
    state.gateSearch = +sliderGateSearch.value;
    state.weldType = selWeldType.value;
    state.b = +sliderB.value;
    state.beta = +sliderBeta.value;
    state.c = +sliderC.value;
    state.Gf = +sliderGf.value;
    state.Gr = +sliderGr.value;
    state.Wface = +sliderWface.value;
    state.Wroot = +sliderWroot.value;
    state.WfaceOffset = +sliderWfaceOffset.value;
    state.WrootOffset = +sliderWrootOffset.value;
    state.edgeOffset = +sliderEdgeOffset.value;
    state.axisKink = +sliderAxisKink.value;
    state.GfAngle = +sliderGfAngle.value;
    state.GrAngle = +sliderGrAngle.value;
    state.GfShape = selGfShape.value;
    state.GrShape = selGrShape.value;
    state.piezoShape = selPiezoShape.value;
    state.piezoDiam = +sliderPiezoDiam.value;
    state.piezoA = +sliderPiezoA.value;
    state.piezoB = +sliderPiezoB.value;
    state.piezoArrow = +sliderPiezoArrow.value;
    state.material = selMaterial.value;
    state.frequency = +selFrequency.value;
    state.ascanXAxis = selAscanXAxis.value;
    state.gate1Enabled = chkGate1.checked;
    state.gate1Start = +sliderGate1Start.value;
    state.gate1End = +sliderGate1End.value;
    state.gate2Enabled = chkGate2.checked;
    state.gate2Start = +sliderGate2Start.value;
    state.gate2End = +sliderGate2End.value;
    state.gate3Enabled = chkGate3.checked;
    state.gate3Start = +sliderGate3Start.value;
    state.gate3End = +sliderGate3End.value;
    state.sweepWidth = +sliderSweepWidth.value;
    if (state.activeDefectIndex >= 0 && PLANAR_DEFECTS.includes(state.defects[state.activeDefectIndex].type)) updateDefectSizeSlider();
    selRefLevel.value = state.refLevel;
    fullRedraw();
}

function onAppearanceChange() { state.accentHue = +sliderHue.value; applyAppearance(); fullRedraw(); }

function setTheme(themeName) { state.theme = themeName; applyAppearance(); fullRedraw(); }

function onActiveDefectSelect() {
    let val = selActiveDefect.value;
    state.activeDefectIndex = val === '-1' ? -1 : +val;
    if (state.activeDefectIndex >= 0) {
        let ad = state.defects[state.activeDefectIndex];
        sliderDefSize.value = ad.size;
        sliderDefAngle.value = ad.angle;
        updateDefectSizeSlider();
    }
    fullRedraw();
}

function onDefectParamChange() {
    if (state.activeDefectIndex >= 0) {
        const defect = state.defects[state.activeDefectIndex];
        const range = getDefectSizeRange(defect.type);
        let newSize = +sliderDefSize.value;
        defect.size = Math.max(range.min, Math.min(range.max, newSize));
        defect.angle = +sliderDefAngle.value;
        fullRedraw();
    }
}

function addDefect(type) {
    let newId = state.defects.length ? Math.max(...state.defects.map(d => d.id)) + 1 : 0;
    state.defects.push({
        id: newId, type,
        x: (Math.random() - 0.5) * 6,
        y: state.H * (0.2 + Math.random() * 0.6),
        size: 2,
        angle: PLANAR_DEFECTS.includes(type) ? 30 : 0
    });
    state.activeDefectIndex = state.defects.length - 1;
    updateDefectSizeSlider();
    fullRedraw();
}

function deleteActiveDefect() {
    if (state.activeDefectIndex >= 0) {
        state.defects.splice(state.activeDefectIndex, 1);
        state.activeDefectIndex = state.defects.length ? Math.min(state.activeDefectIndex, state.defects.length - 1) : -1;
        updateDefectSizeSlider();
        fullRedraw();
    }
}

function setZoom(delta) {
    let newZoom = state.zoom * (1 + delta * 0.1);
    newZoom = Math.max(0.3, Math.min(3, newZoom));
    if (newZoom !== state.zoom) { state.zoom = newZoom; fullRedraw(); }
}

function resetZoom() { state.zoom = 1.0; fullRedraw(); }

function updateFontScale() {
    let scaleVal = fontScaleSlider.value / 100;
    document.documentElement.style.setProperty('--font-scale', scaleVal);
    fontScaleValue.textContent = fontScaleSlider.value + '%';
}

function getEventPos(e) {
    const rect = uzCanvas.getBoundingClientRect();
    let cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    let cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x: cx, y: cy };
}

function findHitTarget(cx, cy) {
    let sc = uzCanvas._scale;
    if (!sc) return null;
    let r = uzCanvas._probeRect;
    if (r && cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) return { type: 'probe' };
    let reinf = uzCanvas._reinforcements || [];
    for (let i = 0; i < reinf.length; i++) {
        let rf = reinf[i];
        if (cx >= rf.left && cx <= rf.right && cy >= rf.top && cy <= rf.bottom) {
            return { type: 'reinforcement', reinforcementType: rf.type };
        }
    }
    let defs = uzCanvas._defectPos || [];
    for (let i = 0; i < defs.length; i++) {
        let d = defs[i], dx = cx - d.x, dy = cy - d.y;
        if (Math.hypot(dx, dy) <= d.r) return { type: 'defect', index: i };
    }
    return null;
}

// Gate drag & drop helpers
function getGateHitTest(canvasX, canvasY) {
    const rect = displayCanvas.getBoundingClientRect();
    const w = displayCanvas.width, h = displayCanvas.height;
    const ml = 45, mr = 15, mt = 15, mb = 32;
    const pw = w - ml - mr, ph = h - mt - mb;
    const maxX = state.sweepWidth;
    const xPath = (p) => ml + (p / maxX) * pw;
    const yDb = (db) => mt + ph * (1 - (clamp(db, DB_MIN, DB_MAX) - DB_MIN) / (DB_MAX - DB_MIN));

    const hitRadius = 15;
    const gates = [
        { num: 1, enabled: state.gate1Enabled, start: state.gate1Start, end: state.gate1End, level: state.gate1Level },
        { num: 2, enabled: state.gate2Enabled, start: state.gate2Start, end: state.gate2End, level: state.gate2Level },
        { num: 3, enabled: state.gate3Enabled, start: state.gate3Start, end: state.gate3End, level: state.gate3Level }
    ];

    for (const gate of gates) {
        if (!gate.enabled) continue;
        const x1 = xPath(gate.start);
        const x2 = xPath(gate.end);
        const y = yDb(gate.level);
        if (Math.abs(canvasY - y) > 15) continue;
        if (Math.abs(canvasX - x1) <= hitRadius) return { gateNum: gate.num, edge: 'start' };
        if (Math.abs(canvasX - x2) <= hitRadius) return { gateNum: gate.num, edge: 'end' };
    }

    for (const gate of gates) {
        if (!gate.enabled) continue;
        const x1 = xPath(gate.start);
        const x2 = xPath(gate.end);
        const y = yDb(gate.level);
        if (canvasX >= x1 && canvasX <= x2 && Math.abs(canvasY - y) <= 15) {
            return { gateNum: gate.num, edge: 'body' };
        }
    }
    return null;
}

function canvasXToPath(canvasX) {
    const w = displayCanvas.width;
    const ml = 45, mr = 15;
    const pw = w - ml - mr;
    const maxX = state.sweepWidth;
    const relX = (canvasX - ml) / pw;
    return Math.max(0, Math.min(maxX, relX * maxX));
}

function canvasYToDb(canvasY) {
    const h = displayCanvas.height;
    const mt = 15, mb = 32;
    const ph = h - mt - mb;
    const relY = (canvasY - mt) / ph;
    const db = DB_MAX - relY * (DB_MAX - DB_MIN);
    return Math.max(DB_MIN, Math.min(DB_MAX, db));
}

// Initialize event listeners
fontScaleSlider.addEventListener('input', updateFontScale);
updateFontScale();

document.querySelectorAll('.section h3').forEach(header => {
    const content = header.parentElement.querySelector('.section-content');
    const icon = header.querySelector('.toggle-icon');
    header.addEventListener('click', (e) => {
        e.stopPropagation();
        content.classList.toggle('collapsed');
        icon.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
    });
});

const sandwichBtn = document.getElementById('sandwichBtn'), sandwichDropdown = document.getElementById('sandwichDropdown');
sandwichBtn.addEventListener('click', (e) => { e.stopPropagation(); sandwichDropdown.classList.toggle('show'); });
document.addEventListener('click', (e) => { if (!sandwichBtn.contains(e.target)) sandwichDropdown.classList.remove('show'); });

[
    sliderH, sliderAlpha, sliderL, sliderPhi, sliderGain, sliderReflectionBoost, sliderB, sliderBeta, sliderC,
    sliderWface, sliderWroot, sliderWfaceOffset, sliderWrootOffset, sliderGf, sliderGr,
    sliderGateReject, sliderGateControl, sliderGateSearch, sliderPiezoDiam, sliderPiezoA,
    sliderPiezoB, sliderPiezoArrow, sliderEdgeOffset, sliderAxisKink, sliderGfAngle, sliderGrAngle, sliderGate1Start, sliderGate1End, sliderGate2Start,
    sliderGate2End, sliderGate3Start, sliderGate3End
].forEach(s => s.addEventListener('input', onParamChange));

[
    selSide, selMode, selProbe, selWeldType, selRefLevel, selPiezoShape, selGfShape, selGrShape,
    selMaterial, selFrequency, selAscanXAxis, chkGate1, chkGate2, chkGate3
].forEach(s => s.addEventListener('change', onParamChange));

sliderHue.addEventListener('input', onAppearanceChange);
sliderSweepWidth.addEventListener('input', onParamChange);
selActiveDefect.addEventListener('change', onActiveDefectSelect);
sliderDefSize.addEventListener('input', onDefectParamChange);
sliderDefAngle.addEventListener('input', onDefectParamChange);
btnAddPore.onclick = () => addDefect('pore');
btnAddSlag.onclick = () => addDefect('slag');
btnAddCrack.onclick = () => addDefect('crack');
btnAddLOF.onclick = () => addDefect('lof');
btnDelDefect.onclick = deleteActiveDefect;
document.getElementById('zoomInBtn').onclick = () => setZoom(1);
document.getElementById('zoomOutBtn').onclick = () => setZoom(-1);
document.getElementById('zoomResetBtn').onclick = resetZoom;

canvasWrap.addEventListener('wheel', (e) => { e.preventDefault(); setZoom(e.deltaY > 0 ? -0.1 : 0.1); }, { passive: false });

canvasWrap.addEventListener('pointerdown', (e) => {
    let pos = getEventPos(e);
    let target = findHitTarget(pos.x, pos.y);
    if (target?.type === 'probe') {
        state.dragMode = 'probe';
        state.dragStartMouse = pos.x;
        state.dragStartValue = state.L;
        canvasWrap.classList.add('dragging-probe');
        canvasWrap.setPointerCapture(e.pointerId);
        e.preventDefault();
    } else if (target?.type === 'reinforcement') {
        state.dragMode = 'reinforcement';
        state.dragReinforcementType = target.reinforcementType;
        state.dragStartMouse = pos.x;
        state.dragStartValue = target.reinforcementType === 'face' ? state.WfaceOffset : state.WrootOffset;
        canvasWrap.classList.add('dragging-reinforcement');
        canvasWrap.setPointerCapture(e.pointerId);
        e.preventDefault();
    } else if (target?.type === 'defect') {
        state.dragMode = 'defect';
        state.dragDefectIndex = target.index;
        state.activeDefectIndex = target.index;
        state.dragStartMouse = { x: pos.x, y: pos.y };
        state.dragStartValue = { x: state.defects[target.index].x, y: state.defects[target.index].y };
        canvasWrap.classList.add('dragging-defect');
        canvasWrap.setPointerCapture(e.pointerId);
        fullRedraw();
        e.preventDefault();
    } else if (state.activeDefectIndex >= 0) {
        state.activeDefectIndex = -1;
        fullRedraw();
    }
});

canvasWrap.addEventListener('pointermove', (e) => {
    if (!state.dragMode) return;
    let pos = getEventPos(e);
    let scale = uzCanvas._scale;
    if (!scale) return;
    if (state.dragMode === 'probe') {
        let dx = (pos.x - state.dragStartMouse) / scale;
        let newL = state.dragStartValue + dx;
        let maxAbs = getPlateHalfWidth();
        let minC = getMinAbsL();
        if (minC !== 0) {
            if (state.side.endsWith('left')) newL = Math.max(minC, Math.min(maxAbs, newL));
            else newL = Math.min(minC, Math.max(-maxAbs, newL));
        } else newL = Math.max(-maxAbs, Math.min(maxAbs, newL));
        state.L = newL;
        sliderL.value = state.L;
        fullRedraw();
    } else if (state.dragMode === 'reinforcement') {
        let dx = (pos.x - state.dragStartMouse) / scale;
        let newOffset = state.dragStartValue + dx;
        let maxAbs = getPlateHalfWidth();
        newOffset = Math.max(-maxAbs, Math.min(maxAbs, newOffset));
        if (state.dragReinforcementType === 'face') {
            state.WfaceOffset = newOffset;
            sliderWfaceOffset.value = state.WfaceOffset;
        } else {
            state.WrootOffset = newOffset;
            sliderWrootOffset.value = state.WrootOffset;
        }
        fullRedraw();
    } else if (state.dragMode === 'defect' && state.dragDefectIndex >= 0) {
        let dx = (pos.x - state.dragStartMouse.x) / scale;
        let dy = (pos.y - state.dragStartMouse.y) / scale;
        let def = state.defects[state.dragDefectIndex];
        def.x = Math.max(-getPlateHalfWidth(), Math.min(getPlateHalfWidth(), state.dragStartValue.x + dx));
        def.y = Math.max(0.5, Math.min(state.H - 0.5, state.dragStartValue.y + dy));
        fullRedraw();
    }
});

canvasWrap.addEventListener('pointerup', () => {
    if (state.dragMode) {
        canvasWrap.classList.remove('dragging-probe', 'dragging-defect', 'dragging-reinforcement');
        state.dragMode = null;
        fullRedraw();
    }
});

canvasWrap.addEventListener('pointerleave', () => {
    if (state.dragMode) {
        canvasWrap.classList.remove('dragging-probe', 'dragging-defect', 'dragging-reinforcement');
        state.dragMode = null;
        fullRedraw();
    }
});

window.addEventListener('resize', () => { setTimeout(fullRedraw, 50); });
window.addEventListener('keydown', (e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement === document.body) { deleteActiveDefect(); e.preventDefault(); }
    if (e.key === 'Escape') { state.activeDefectIndex = -1; fullRedraw(); }
});

btnThemeDark.addEventListener('click', () => setTheme('dark'));
btnThemeLight.addEventListener('click', () => setTheme('light'));

// Resizers
const resizerLeft = document.getElementById('resizerLeft');
const resizerCanvas = document.getElementById('resizerCanvas');
const leftColumn = document.querySelector('.left-column');
const canvasWrapEl = document.getElementById('canvasWrap');
const aScanContainer = document.querySelector('.a-scan-container');
let resizing = null;

resizerLeft.addEventListener('pointerdown', (e) => {
    resizing = 'left';
    resizerLeft.classList.add('resizing');
    resizerLeft.setPointerCapture(e.pointerId);
    e.preventDefault();
});

resizerCanvas.addEventListener('pointerdown', (e) => {
    resizing = 'canvas';
    resizerCanvas.classList.add('resizing');
    resizerCanvas.setPointerCapture(e.pointerId);
    e.preventDefault();
});

document.addEventListener('pointermove', (e) => {
    if (resizing === 'left') {
        const workspace = document.querySelector('.workspace');
        const rect = workspace.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;
        const minW = 200, maxW = rect.width - 250;
        if (newWidth >= minW && newWidth <= maxW) {
            leftColumn.style.flex = '0 0 ' + newWidth + 'px';
            setTimeout(fullRedraw, 0);
        }
    } else if (resizing === 'canvas') {
        const rect = leftColumn.getBoundingClientRect();
        const newHeight = e.clientY - rect.top;
        const minH = 180, maxH = rect.height - 200;
        if (newHeight >= minH && newHeight <= maxH) {
            canvasWrapEl.style.height = newHeight + 'px';
            const remainingH = rect.height - newHeight - document.querySelector('.zoom-bar').offsetHeight;
            aScanContainer.style.height = remainingH + 'px';
            setTimeout(fullRedraw, 0);
        }
    }
});

document.addEventListener('pointerup', () => {
    if (resizing) {
        resizerLeft.classList.remove('resizing');
        resizerCanvas.classList.remove('resizing');
        resizing = null;
    }
});

// Gate drag & drop on A-scan
displayCanvas.addEventListener('pointerdown', (e) => {
    const rect = displayCanvas.getBoundingClientRect();
    const scaleX = displayCanvas.width / rect.width;
    const scaleY = displayCanvas.height / rect.height;
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    const hit = getGateHitTest(canvasX, canvasY);
    if (hit) {
        const currentStart = hit.gateNum === 1 ? state.gate1Start : hit.gateNum === 2 ? state.gate2Start : state.gate3Start;
        const currentEnd = hit.gateNum === 1 ? state.gate1End : hit.gateNum === 2 ? state.gate2End : state.gate3End;
        const currentLevel = hit.gateNum === 1 ? state.gate1Level : hit.gateNum === 2 ? state.gate2Level : state.gate3Level;

        gateDragState = {
            gateNum: hit.gateNum,
            edge: hit.edge,
            startMousePath: canvasXToPath(canvasX),
            startMouseDb: canvasYToDb(canvasY),
            startGateStart: currentStart,
            startGateEnd: currentEnd,
            startGateLevel: currentLevel
        };
        displayCanvas.style.cursor = hit.edge === 'body' ? 'move' : 'ew-resize';
        displayCanvas.setPointerCapture(e.pointerId);
        gateHoverState = null;
        fullRedraw();
        e.preventDefault();
    }
});

displayCanvas.addEventListener('pointermove', (e) => {
    const rect = displayCanvas.getBoundingClientRect();
    const scaleX = displayCanvas.width / rect.width;
    const scaleY = displayCanvas.height / rect.height;
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    if (gateDragState) {
        const currentMousePath = canvasXToPath(canvasX);
        const currentMouseDb = canvasYToDb(canvasY);
        const deltaPath = currentMousePath - gateDragState.startMousePath;
        const deltaDb = currentMouseDb - gateDragState.startMouseDb;
        const gateNum = gateDragState.gateNum;

        const maxSliderValue = gateNum === 1 ? parseFloat(sliderGate1End.max) : gateNum === 2 ? parseFloat(sliderGate2End.max) : parseFloat(sliderGate3End.max);

        if (gateDragState.edge === 'start') {
            const endValue = gateNum === 1 ? state.gate1End : gateNum === 2 ? state.gate2End : state.gate3End;
            const newStart = Math.max(0, Math.min(gateDragState.startGateStart + deltaPath, endValue - 5));
            if (gateNum === 1) { state.gate1Start = newStart; sliderGate1Start.value = newStart; valGate1Start.textContent = Math.round(newStart); }
            else if (gateNum === 2) { state.gate2Start = newStart; sliderGate2Start.value = newStart; valGate2Start.textContent = Math.round(newStart); }
            else { state.gate3Start = newStart; sliderGate3Start.value = newStart; valGate3Start.textContent = Math.round(newStart); }
        } else if (gateDragState.edge === 'end') {
            const startValue = gateNum === 1 ? state.gate1Start : gateNum === 2 ? state.gate2Start : state.gate3Start;
            const newEnd = Math.max(startValue + 5, Math.min(gateDragState.startGateEnd + deltaPath, maxSliderValue));
            if (gateNum === 1) { state.gate1End = newEnd; sliderGate1End.value = newEnd; valGate1End.textContent = Math.round(newEnd); }
            else if (gateNum === 2) { state.gate2End = newEnd; sliderGate2End.value = newEnd; valGate2End.textContent = Math.round(newEnd); }
            else { state.gate3End = newEnd; sliderGate3End.value = newEnd; valGate3End.textContent = Math.round(newEnd); }
        } else if (gateDragState.edge === 'body') {
            const gateWidth = gateDragState.startGateEnd - gateDragState.startGateStart;
            let newStart = gateDragState.startGateStart + deltaPath;
            let newEnd = gateDragState.startGateEnd + deltaPath;
            let newLevel = Math.round(gateDragState.startGateLevel + deltaDb);
            if (newStart < 0) { newStart = 0; newEnd = gateWidth; }
            if (newEnd > maxSliderValue) { newEnd = maxSliderValue; newStart = maxSliderValue - gateWidth; }
            newLevel = Math.max(DB_MIN, Math.min(DB_MAX, newLevel));
            const setGate = (s, e, l) => {
                if (gateNum === 1) { state.gate1Start = s; state.gate1End = e; state.gate1Level = l; sliderGate1Start.value = s; sliderGate1End.value = e; valGate1Start.textContent = Math.round(s); valGate1End.textContent = Math.round(e); }
                else if (gateNum === 2) { state.gate2Start = s; state.gate2End = e; state.gate2Level = l; sliderGate2Start.value = s; sliderGate2End.value = e; valGate2Start.textContent = Math.round(s); valGate2End.textContent = Math.round(e); }
                else { state.gate3Start = s; state.gate3End = e; state.gate3Level = l; sliderGate3Start.value = s; sliderGate3End.value = e; valGate3Start.textContent = Math.round(s); valGate3End.textContent = Math.round(e); }
            };
            setGate(newStart, newEnd, newLevel);
        }
        fullRedraw();
        e.preventDefault();
    } else {
        const hit = getGateHitTest(canvasX, canvasY);
        if (hit) {
            displayCanvas.style.cursor = hit.edge === 'body' ? 'move' : 'ew-resize';
            if (!gateHoverState || gateHoverState.gateNum !== hit.gateNum || gateHoverState.edge !== hit.edge) {
                gateHoverState = hit;
                fullRedraw();
            }
        } else {
            displayCanvas.style.cursor = 'default';
            if (gateHoverState) { gateHoverState = null; fullRedraw(); }
        }
    }
});

displayCanvas.addEventListener('pointerup', () => {
    if (gateDragState) { gateDragState = null; displayCanvas.style.cursor = 'default'; fullRedraw(); }
});

displayCanvas.addEventListener('pointerleave', () => {
    if (!gateDragState) displayCanvas.style.cursor = 'default';
    if (gateHoverState) { gateHoverState = null; fullRedraw(); }
});

// Tooltips
document.querySelectorAll('.tooltip-wrapper').forEach(wrapper => {
    const trigger = wrapper.querySelector('.tooltip-trigger');
    const content = wrapper.querySelector('.tooltip-content');
    if (trigger && content) {
        trigger.addEventListener('mouseenter', () => { content.style.visibility = 'visible'; content.style.opacity = '1'; });
        trigger.addEventListener('mouseleave', () => { content.style.visibility = 'hidden'; content.style.opacity = '0'; });
    }
});

function init() {
    document.body.dataset.theme = state.theme;
    document.documentElement.style.setProperty('--accent-h', state.accentHue);
    recalcProbeWorldX();
    fullRedraw();
}

init();
