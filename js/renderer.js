function drawDimensionLines(ctx, toX, toY, scale) {
    const light = state.theme === 'light';
    ctx.save();
    ctx.strokeStyle = light ? '#2c3e4e' : '#8899aa';
    ctx.fillStyle = light ? '#1d2937' : '#ffffff';
    ctx.lineWidth = 1;
    ctx.font = 'bold 11px Helvetica';
    ctx.textAlign = 'center';

    const centerX = toX(0);
    const probeX = toX(state.probeWorldX);
    const entrySurfY = toY(getNominalSurfaceY(getEntrySurface()));
    const offsetY = isProbeBottom() ? 25 : -25;
    const dimY = entrySurfY + offsetY;

    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX, entrySurfY);
    ctx.lineTo(centerX, dimY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(probeX, entrySurfY);
    ctx.lineTo(probeX, dimY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(centerX, dimY);
    ctx.lineTo(probeX, dimY);
    ctx.stroke();

    const arrowSize = 6;
    const arrowDir = state.L > 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(centerX, dimY);
    ctx.lineTo(centerX + arrowSize * arrowDir, dimY - arrowSize / 2);
    ctx.lineTo(centerX + arrowSize * arrowDir, dimY + arrowSize / 2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(probeX, dimY);
    ctx.lineTo(probeX - arrowSize * arrowDir, dimY - arrowSize / 2);
    ctx.lineTo(probeX - arrowSize * arrowDir, dimY + arrowSize / 2);
    ctx.closePath();
    ctx.fill();

    const midX = (centerX + probeX) / 2;
    ctx.fillStyle = light ? '#ffffff' : '#0a0c10';
    ctx.fillRect(midX - 25, dimY - 10, 50, 16);
    ctx.fillStyle = light ? '#1d2937' : '#ffffff';
    ctx.fillText(`L = ${Math.abs(state.L).toFixed(1)}`, midX, dimY + 4);

    ctx.restore();
}

function drawDefectReflections(ctx, toX, toY, scale) {
    const segments = getBeamSegments();
    const phiRad = state.phi * Math.PI / 180;
    for (const seg of segments) {
        const dx = (seg.x2 - seg.x1) / seg.len, dy = (seg.y2 - seg.y1) / seg.len;
        for (let idx = 0; idx < state.defects.length; idx++) {
            const def = state.defects[idx];
            const vx = def.x - seg.x1, vy = def.y - seg.y1;
            const proj = vx * dx + vy * dy;
            if (proj <= 0.001 || proj >= seg.len - 0.001) continue;
            const hitX = seg.x1 + dx * proj, hitY = seg.y1 + dy * proj;
            let defectNormal;
            if (def.type === 'pore') defectNormal = Math.atan2(def.y - hitY, def.x - hitX);
            else defectNormal = def.angle * Math.PI / 180 + Math.PI / 2;
            const incidenceAngle = Math.atan2(dy, dx);
            const reflectionCoeff = getReflectionFactor(def, incidenceAngle, defectNormal);
            const isActive = (idx === state.activeDefectIndex);
            const baseAlpha = isActive ? 0.75 : 0.25;
            if (reflectionCoeff < 0.05) continue;
            const hue = Math.round(120 * reflectionCoeff);
            const sat = 80 + Math.round(20 * reflectionCoeff);
            const light = 50 + Math.round(10 * reflectionCoeff);
            const refAng = reflectAngle(incidenceAngle, defectNormal);
            const rDirX = Math.cos(refAng), rDirY = Math.sin(refAng);
            const reflectLen = Math.min(50, state.H * 1.2) * (0.3 + 0.7 * reflectionCoeff);
            const halfCone = phiRad * 0.6 * (1 - reflectionCoeff * 0.3);
            const steps = 12;
            ctx.save();
            for (let i = 1; i <= steps; i++) {
                const t = i / steps;
                const radius = t * reflectLen * Math.tan(halfCone);
                const cx = def.x + rDirX * t * reflectLen;
                const cy = def.y + rDirY * t * reflectLen;
                const alpha = baseAlpha * (1 - t * 0.7) * reflectionCoeff;
                if (i % 3 === 0 && radius > 0.5) {
                    ctx.beginPath();
                    ctx.arc(toX(cx), toY(cy), radius * scale, refAng - Math.PI / 2, refAng + Math.PI / 2);
                    ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 0.6})`;
                    ctx.lineWidth = isActive ? 1.2 : 0.6;
                    ctx.stroke();
                }
            }
            ctx.restore();
            const endX = def.x + rDirX * reflectLen, endY = def.y + rDirY * reflectLen;
            const perpX = -rDirY, perpY = rDirX;
            const spread = reflectLen * Math.tan(halfCone);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(toX(def.x + perpX * spread * 0.1), toY(def.y + perpY * spread * 0.1));
            ctx.lineTo(toX(endX + perpX * spread), toY(endY + perpY * spread));
            ctx.moveTo(toX(def.x - perpX * spread * 0.1), toY(def.y - perpY * spread * 0.1));
            ctx.lineTo(toX(endX - perpX * spread), toY(endY - perpY * spread));
            ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${baseAlpha * 0.4})`;
            ctx.lineWidth = isActive ? 1.0 : 0.5;
            ctx.setLineDash([3, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(toX(def.x), toY(def.y));
            ctx.lineTo(toX(endX), toY(endY));
            ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${baseAlpha})`;
            ctx.lineWidth = isActive ? 2.0 : 1.0;
            ctx.stroke();
            ctx.restore();
            if (isActive && PLANAR_DEFECTS.includes(def.type)) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(toX(def.x), toY(def.y));
                ctx.lineTo(toX(def.x + Math.cos(defectNormal) * def.size * 0.6), toY(def.y + Math.sin(defectNormal) * def.size * 0.6));
                ctx.strokeStyle = 'rgba(255,220,150,0.9)';
                ctx.lineWidth = 1.2;
                ctx.setLineDash([2, 2]);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();
            }
            if (isActive) {
                ctx.save();
                ctx.fillStyle = state.theme === 'light' ? '#1a2a3a' : 'rgba(255,255,255,0.9)';
                ctx.font = 'bold 10px Helvetica';
                ctx.textAlign = 'center';
                const labelX = toX(endX + rDirX * 4);
                const labelY = toY(endY + rDirY * 4);
                ctx.fillText(`R=${(reflectionCoeff * 100).toFixed(0)}%`, labelX, labelY);
                ctx.font = '9px Helvetica';
                ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, 0.9)`;
                ctx.fillText(`${(refAng * 180 / Math.PI).toFixed(0)}°`, labelX, labelY + 12);
                ctx.restore();
            }
        }
    }
}

function drawUzCanvas() {
    const canvas = uzCanvas, ctx = uzCtx;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    const bounds = getWorldBoundsExt();
    const pad = Math.max(12, Math.min(w, h) * 0.04);
    let scaleX = (w - 2 * pad) / (bounds.maxX - bounds.minX);
    let scaleY = (h - 2 * pad) / (bounds.maxY - bounds.minY);
    let baseScale = Math.min(scaleX, scaleY);
    const scale = baseScale * state.zoom;
    const offsetX = pad - bounds.minX * scale + (w - 2 * pad - (bounds.maxX - bounds.minX) * scale) / 2;
    const offsetY = pad - bounds.minY * scale + (h - 2 * pad - (bounds.maxY - bounds.minY) * scale) / 2;
    const toX = (x) => offsetX + x * scale;
    const toY = (y) => offsetY + y * scale;
    const light = state.theme === 'light';

    ctx.fillStyle = light ? '#dbe4ee' : '#1c1f26';
    ctx.fillRect(0, 0, w, h);
    if (!light) {
        ctx.strokeStyle = '#2a2d35';
        ctx.lineWidth = 0.5;
        for (let gx = -80; gx <= 80; gx += 10) { let cx = toX(gx); ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke(); }
        for (let gy = -20; gy <= state.H + 20; gy += 10) { let cy = toY(gy); ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke(); }
    }

    const plateHalf = getPlateHalfWidth();
    const plateTop = toY(0), plateBottom = toY(state.H);
    const groovePoints = getGroovePoints();
    const rootY = state.H;
    let firstRootIdx = -1, lastRootIdx = -1;
    for (let i = 0; i < groovePoints.length; i++) {
        if (Math.abs(groovePoints[i].y - rootY) < 0.01) {
            if (firstRootIdx < 0) firstRootIdx = i;
            lastRootIdx = i;
        }
    }
    let leftGP, rightGP;
    if (firstRootIdx >= 0 && lastRootIdx > firstRootIdx) {
        leftGP = groovePoints.slice(0, firstRootIdx + 1);
        rightGP = groovePoints.slice(lastRootIdx).reverse();
    } else {
        leftGP = groovePoints.filter(p => p.x < 0).sort((a, b) => a.y - b.y);
        rightGP = groovePoints.filter(p => p.x > 0).sort((a, b) => a.y - b.y);
    }

    ctx.fillStyle = light ? '#c0cbd8' : '#3a4658';

    if (leftGP.length < 2 && rightGP.length < 2) {
        ctx.fillRect(toX(-plateHalf), plateTop, toX(plateHalf) - toX(-plateHalf), plateBottom - plateTop);
        ctx.strokeStyle = light ? '#2c3e4e' : '#8899aa';
        ctx.beginPath(); ctx.moveTo(toX(-plateHalf), plateTop); ctx.lineTo(toX(plateHalf), plateTop); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(toX(-plateHalf), plateBottom); ctx.lineTo(toX(plateHalf), plateBottom); ctx.stroke();
    } else {
        function drawPlatePart(side) {
            const gp = side === 'left' ? leftGP : rightGP;
            if (gp.length < 2) return;
            const farX = side === 'left' ? -plateHalf : plateHalf;
            const first = gp[0], last = gp[gp.length - 1];
            ctx.beginPath();
            ctx.moveTo(toX(farX), toY(first.y));
            for (const p of gp) ctx.lineTo(toX(p.x), toY(p.y));
            ctx.lineTo(toX(farX), toY(last.y));
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = light ? '#2c3e4e' : '#8899aa';
            ctx.beginPath();
            ctx.moveTo(toX(farX), toY(first.y));
            for (const p of gp) ctx.lineTo(toX(p.x), toY(p.y));
            ctx.stroke();
        }
        drawPlatePart('left');
        drawPlatePart('right');
        if (leftGP.length >= 2 && rightGP.length >= 2) {
            ctx.fillStyle = light ? 'rgba(100,70,40,0.25)' : 'rgba(180,160,140,0.35)';
            ctx.beginPath();
            ctx.moveTo(toX(leftGP[0].x), toY(leftGP[0].y));
            for (const p of leftGP) ctx.lineTo(toX(p.x), toY(p.y));
            for (let i = rightGP.length - 1; i >= 0; i--) ctx.lineTo(toX(rightGP[i].x), toY(rightGP[i].y));
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = light ? '#2c3e4e' : '#8899aa';
            ctx.beginPath();
            ctx.moveTo(toX(leftGP[0].x), toY(leftGP[0].y));
            ctx.lineTo(toX(rightGP[0].x), toY(rightGP[0].y));
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(toX(leftGP[leftGP.length - 1].x), toY(leftGP[leftGP.length - 1].y));
            ctx.lineTo(toX(rightGP[rightGP.length - 1].x), toY(rightGP[rightGP.length - 1].y));
            ctx.stroke();
        }
    }
    ctx.font = `${Math.max(8, 10 * scale)}px Helvetica`;
    ctx.fillStyle = light ? '#1d2937' : '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(`H = ${state.H} мм`, toX(-plateHalf + 5), plateTop - 3);



    if (state.Gf > 0 && state.Wface >= 2) {
        const halfW = state.Wface / 2;
        let leftX = state.WfaceOffset - halfW;
        let rightX = state.WfaceOffset + halfW;
        if (leftGP.length && rightGP.length) {
            leftX = Math.max(leftX, leftGP[0].x);
            rightX = Math.min(rightX, rightGP[0].x);
        }
        const power = REINFORCEMENT_SHAPES[state.GfShape]?.power || 2;
        const steps = power > 10 ? 2 : 30;
        const leftPt0 = getReinforcementPoint('face', leftX) || { x: leftX, y: 0 };
        const rightPt0 = getReinforcementPoint('face', rightX) || { x: rightX, y: 0 };
        ctx.beginPath();
        ctx.moveTo(toX(leftPt0.x), toY(leftPt0.y));
        if (power > 10) {
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = leftX + (rightX - leftX) * t;
                const pt = getReinforcementPoint('face', x);
                if (pt) ctx.lineTo(toX(pt.x), toY(pt.y));
            }
        } else {
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = leftX + (rightX - leftX) * t;
                const pt = getReinforcementPoint('face', x);
                if (pt) ctx.lineTo(toX(pt.x), toY(pt.y));
            }
        }
        ctx.lineTo(toX(rightPt0.x), toY(rightPt0.y));
        ctx.closePath();
        ctx.fillStyle = light ? 'rgba(180,140,100,0.8)' : 'rgba(210,170,110,0.8)';
        ctx.fill();
        ctx.strokeStyle = light ? '#5a3a1a' : 'rgba(255,220,180,0.9)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
    }

    if (state.Gr > 0 && state.Wroot >= 2) {
        const halfW = state.Wroot / 2;
        let leftX = state.WrootOffset - halfW;
        let rightX = state.WrootOffset + halfW;
        if (leftGP.length && rightGP.length) {
            const li = leftGP.length - 1, ri = rightGP.length - 1;
            leftX = Math.max(leftX, leftGP[li].x);
            rightX = Math.min(rightX, rightGP[ri].x);
        }
        const power = REINFORCEMENT_SHAPES[state.GrShape]?.power || 2;
        const steps = power > 10 ? 2 : 30;
        const leftPt0 = getReinforcementPoint('root', leftX) || { x: leftX, y: state.H };
        const rightPt0 = getReinforcementPoint('root', rightX) || { x: rightX, y: state.H };
        ctx.beginPath();
        ctx.moveTo(toX(leftPt0.x), toY(leftPt0.y));
        if (power > 10) {
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = leftX + (rightX - leftX) * t;
                const pt = getReinforcementPoint('root', x);
                if (pt) ctx.lineTo(toX(pt.x), toY(pt.y));
            }
        } else {
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = leftX + (rightX - leftX) * t;
                const pt = getReinforcementPoint('root', x);
                if (pt) ctx.lineTo(toX(pt.x), toY(pt.y));
            }
        }
        ctx.lineTo(toX(rightPt0.x), toY(rightPt0.y));
        ctx.closePath();
        ctx.fillStyle = light ? 'rgba(180,140,100,0.8)' : 'rgba(210,170,110,0.8)';
        ctx.fill();
        ctx.strokeStyle = light ? '#5a3a1a' : 'rgba(255,220,180,0.9)';
        ctx.stroke();
    }

    for (let i = 0; i < state.defects.length; i++) {
        const d = state.defects[i];
        const dx = toX(d.x), dy = toY(d.y);
        const rPx = (d.size / 2) * scale;
        const active = i === state.activeDefectIndex;
        let fillColor, strokeColor;
        if (light) {
            if (d.type === 'pore') { fillColor = 'rgba(200,60,40,0.8)'; strokeColor = active ? '#a00' : '#a03325'; }
            else if (d.type === 'slag') { fillColor = 'rgba(130,90,30,0.7)'; strokeColor = active ? '#a00' : '#7a4a1a'; }
            else { fillColor = 'transparent'; strokeColor = active ? '#a00' : '#b34c2c'; }
        } else {
            if (d.type === 'pore') { fillColor = 'rgba(255,100,80,0.7)'; strokeColor = active ? '#f33' : 'rgba(255,150,130,0.8)'; }
            else if (d.type === 'slag') { fillColor = 'rgba(190,165,105,0.65)'; strokeColor = active ? '#f33' : 'rgba(230,200,145,0.9)'; }
            else { fillColor = 'transparent'; strokeColor = active ? '#f33' : '#ff7766'; }
        }
        if (d.type === 'pore') {
            ctx.beginPath(); ctx.arc(dx, dy, rPx, 0, 2 * Math.PI);
            ctx.fillStyle = fillColor; ctx.fill();
            ctx.strokeStyle = strokeColor; ctx.lineWidth = active ? 2.5 : 1.5; ctx.stroke();
        } else if (d.type === 'slag') {
            let pts = getSlagPoints(d);
            ctx.beginPath();
            pts.forEach((p, idx) => { let x = toX(p.x), y = toY(p.y); if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
            ctx.closePath(); ctx.fillStyle = fillColor; ctx.fill();
            ctx.strokeStyle = strokeColor; ctx.lineWidth = active ? 2.5 : 1.5; ctx.stroke();
        } else if (d.type === 'crack') {
            let pts = getCrackPoints(d);
            ctx.beginPath();
            pts.forEach((p, idx) => { let x = toX(p.x), y = toY(p.y); if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
            ctx.strokeStyle = strokeColor; ctx.lineWidth = active ? 3 : 2; ctx.stroke();
            if (active) {
                const angRad = d.angle * Math.PI / 180;
                ctx.beginPath(); ctx.moveTo(dx, dy);
                ctx.lineTo(dx + Math.cos(angRad) * rPx * 1.5, dy + Math.sin(angRad) * rPx * 1.5);
                ctx.strokeStyle = '#ffaa66'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.stroke(); ctx.setLineDash([]);
            }
        } else if (d.type === 'lof') {
            const ang = d.angle * Math.PI / 180, hl = d.size / 2;
            ctx.beginPath();
            ctx.moveTo(toX(d.x - hl * Math.cos(ang)), toY(d.y - hl * Math.sin(ang)));
            ctx.lineTo(toX(d.x + hl * Math.cos(ang)), toY(d.y + hl * Math.sin(ang)));
            ctx.strokeStyle = strokeColor; ctx.lineWidth = active ? 3 : 2;
            ctx.setLineDash([3 * scale, 2 * scale]); ctx.stroke(); ctx.setLineDash([]);
            if (active) {
                const normAng = ang + Math.PI / 2;
                ctx.beginPath(); ctx.moveTo(dx, dy);
                ctx.lineTo(dx + Math.cos(normAng) * rPx * 1.5, dy + Math.sin(normAng) * rPx * 1.5);
                ctx.strokeStyle = '#ffaa66'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.stroke(); ctx.setLineDash([]);
            }
        }
        if (active) {
            ctx.strokeStyle = '#f33'; ctx.lineWidth = 2; ctx.setLineDash([3, 2]);
            ctx.beginPath(); ctx.arc(dx, dy, rPx + 6, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.font = '9px Helvetica'; ctx.textAlign = 'center';
            ctx.fillText(`${DEFECT_NAMES[d.type]} #${d.id}`, dx, dy - rPx - 8);
        }
    }

    if (state.edgeOffset !== 0 || state.axisKink !== 0) {
        const { edgeOffset, axisKink } = state;
        const kinkRad = axisKink * Math.PI / 180;
        const cosA = Math.cos(kinkRad), sinA = Math.sin(kinkRad);
        const midY = state.H / 2;
        const rfY = -edgeOffset, rrY = state.H - edgeOffset;
        let stepYtop = rfY, stepYbot = rrY;
        if (kinkRad !== 0) {
            const rf = { x: 0 - (rfY - midY) * sinA, y: midY + (rfY - midY) * cosA };
            const rb = { x: 0 - (rrY - midY) * sinA, y: midY + (rrY - midY) * cosA };
            stepYtop = rf.y; stepYbot = rb.y;
        }
        ctx.save();
        ctx.strokeStyle = '#ff6644';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(toX(0), toY(0));
        ctx.lineTo(toX(0), toY(stepYtop));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(toX(0), toY(state.H));
        ctx.lineTo(toX(0), toY(stepYbot));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ff6644';
        ctx.font = 'bold 10px Helvetica';
        ctx.textAlign = 'center';
        ctx.fillText(state.edgeOffset !== 0 ? '⚠ Смещ.кромок' : '⚠ Перелом оси', toX(0), toY((state.H / 2) - 4));
        ctx.restore();
    }

    drawDefectReflections(ctx, toX, toY, scale);
    drawDimensionLines(ctx, toX, toY, scale);

    const pd = getProbeData(), sign = getProbeHorizontalSign(), probeX = state.probeWorldX;
    const totalArrow = Math.max(0, state.piezoArrow || pd.baseArrow);
    const frontX = probeX + sign * totalArrow, backX = frontX - sign * pd.height;
    const entryY = getSurfaceYAt(getEntrySurface(), probeX), outerY = entryY + (isProbeBottom() ? pd.width : -pd.width);
    ctx.fillStyle = light ? 'rgba(40,80,130,0.8)' : 'rgba(70,110,180,0.7)';
    ctx.strokeStyle = light ? '#1a2a4a' : 'rgba(150,190,255,0.9)';
    ctx.save();
    ctx.translate(toX(probeX), toY(entryY));
    if (state.axisKink !== 0 && probeX > 0) {
        const kinkRad = state.axisKink * Math.PI / 180;
        ctx.rotate(Math.atan(Math.sin(kinkRad)));
    }
    const lx = (Math.min(frontX, backX) - probeX) * scale;
    const ly = Math.min(0, (outerY - entryY)) * scale;
    const lw = Math.abs(frontX - backX) * scale;
    const lh = Math.abs(outerY - entryY) * scale;
    ctx.fillRect(lx, ly, lw, lh);
    ctx.strokeRect(lx, ly, lw, lh);
    ctx.beginPath(); ctx.moveTo((frontX - probeX) * scale, 0); ctx.lineTo((backX - probeX) * scale, 0); ctx.stroke();
    if (lw > 20 && lh > 15) {
        const txt = `α=${state.alpha.toFixed(0)}°  L=${state.L.toFixed(0)}мм`;
        let fz = Math.min(lh * 0.4, lw / (txt.length * 0.6), 14);
        fz = Math.max(6, fz);
        ctx.font = `${fz}px monospace`;
        ctx.fillStyle = light ? '#0c1522' : '#fff';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(txt, ((frontX - probeX) + (backX - probeX)) / 2 * scale, (outerY - entryY) / 2 * scale);
    }
    ctx.restore();

    const beamColor = state.mode === 'direct' ? (light ? '#1a6e4a' : '#66ff88') : (light ? '#6a3a9a' : '#cc88ff');
    const diagColor = light ? '#b85c0a' : 'rgba(255,153,68,0.7)';

    if (state.mode === 'realistic') {
        const mainPath = computeFullBeamPath(state.alpha);
        const atten = getAttenuationCoeff();
        let accPath = 0;
        for (let i = 0; i < mainPath.length - 1; i++) {
            const dx = mainPath[i + 1].x - mainPath[i].x;
            const dy = mainPath[i + 1].y - mainPath[i].y;
            const segLen = Math.hypot(dx, dy);
            accPath += segLen;
            const att = Math.exp(-atten * accPath * 0.5);
            const alpha = Math.max(0.4, att);
            ctx.beginPath();
            ctx.moveTo(toX(mainPath[i].x), toY(mainPath[i].y));
            ctx.lineTo(toX(mainPath[i + 1].x), toY(mainPath[i + 1].y));
            ctx.strokeStyle = light ? `rgba(106,58,154,${alpha})` : `rgba(204,136,255,${alpha})`;
            ctx.lineWidth = 3.5;
            ctx.stroke();
            if (i > 0) {
                ctx.beginPath();
                ctx.arc(toX(mainPath[i].x), toY(mainPath[i].y), 5, 0, 2 * Math.PI);
                ctx.fillStyle = light ? `rgba(255,100,50,${Math.min(1, alpha * 1.2)})` : `rgba(255,180,100,${Math.min(1, alpha * 1.2)})`;
                ctx.fill();
                ctx.strokeStyle = light ? 'rgba(200,50,0,0.8)' : 'rgba(255,220,150,0.8)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }
        const pathMinus = computeFullBeamPath(state.alpha - state.phi);
        const pathPlus = computeFullBeamPath(state.alpha + state.phi);
        [pathMinus, pathPlus].forEach((path) => {
            for (let i = 0; i < path.length - 1; i++) {
                ctx.beginPath();
                ctx.moveTo(toX(path[i].x), toY(path[i].y));
                ctx.lineTo(toX(path[i + 1].x), toY(path[i + 1].y));
                ctx.strokeStyle = diagColor;
                ctx.lineWidth = 1;
                ctx.setLineDash([3 * scale, 5 * scale]);
                ctx.stroke();
            }
        });
        ctx.setLineDash([]);
    } else {
        const paths = [computeFullBeamPath(state.alpha - state.phi), computeFullBeamPath(state.alpha), computeFullBeamPath(state.alpha + state.phi)];
        paths.forEach((path, idx) => {
            ctx.beginPath(); ctx.moveTo(toX(path[0].x), toY(path[0].y));
            for (let i = 1; i < path.length; i++) ctx.lineTo(toX(path[i].x), toY(path[i].y));
            if (idx === 1) { ctx.strokeStyle = beamColor; ctx.lineWidth = 2.5; ctx.setLineDash([]); }
            else { ctx.strokeStyle = diagColor; ctx.lineWidth = 1; ctx.setLineDash([3 * scale, 5 * scale]); }
            ctx.stroke();
        });
        ctx.setLineDash([]);
    }

    uzCanvas._scale = scale;
    uzCanvas._probeRect = { left: toX(Math.min(probeX, frontX, backX)), right: toX(Math.max(probeX, frontX, backX)), top: toY(Math.min(entryY, outerY)), bottom: toY(Math.max(entryY, outerY)) };
    uzCanvas._defectPos = state.defects.map(d => ({ x: toX(d.x), y: toY(d.y), r: (d.size / 2) * scale + 6 }));

    uzCanvas._reinforcements = [];
    if (state.Gf > 0 && state.Wface >= 2) {
        const halfW = state.Wface / 2;
        const leftX = state.WfaceOffset - halfW;
        const rightX = state.WfaceOffset + halfW;
        uzCanvas._reinforcements.push({
            type: 'face',
            left: toX(leftX), right: toX(rightX),
            top: toY(-state.Gf), bottom: toY(0),
            centerX: toX(state.WfaceOffset)
        });
    }
    if (state.Gr > 0 && state.Wroot >= 2) {
        const halfW = state.Wroot / 2;
        const leftX = state.WrootOffset - halfW;
        const rightX = state.WrootOffset + halfW;
        uzCanvas._reinforcements.push({
            type: 'root',
            left: toX(leftX), right: toX(rightX),
            top: toY(state.H), bottom: toY(state.H + state.Gr),
            centerX: toX(state.WrootOffset)
        });
    }
}

function drawDisplayCanvas() {
    const canvas = displayCanvas, ctx = displayCtx;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    const lightTheme = state.theme === 'light';
    ctx.fillStyle = lightTheme ? '#f0f4fa' : '#0a0c10';
    ctx.fillRect(0, 0, w, h);
    const ml = 45, mr = 15, mt = 15, mb = 32, pw = w - ml - mr, ph = h - mt - mb;
    const allSigs = calculateAllSignals().signals;
    const xAxisMode = state.ascanXAxis;
    let maxX, xLabel, getX;
    if (xAxisMode === 'depth') {
        maxX = state.sweepWidth;
        xLabel = 'Глубина залегания (Y), мм';
        getX = (sig) => sig.depth;
    } else {
        maxX = state.sweepWidth;
        xLabel = 'Акустический путь (S), мм';
        getX = (sig) => sig.pathLength;
    }

    const xPath = (val) => ml + pw * (clamp(val, 0, maxX) / maxX);
    const yDb = (db) => mt + ph * (1 - (clamp(db, DB_MIN, DB_MAX) - DB_MIN) / (DB_MAX - DB_MIN));

    ctx.strokeStyle = lightTheme ? '#b0c4de' : '#163522';
    ctx.lineWidth = 0.6;
    ctx.fillStyle = lightTheme ? '#2c3e4e' : '#9fb3c8';
    ctx.font = '9px Helvetica';
    ctx.textAlign = 'right';
    for (let db = DB_MIN; db <= DB_MAX; db += 10) {
        const y = yDb(db);
        if (y >= mt && y <= mt + ph) { ctx.beginPath(); ctx.moveTo(ml, y); ctx.lineTo(w - mr, y); ctx.stroke(); ctx.fillText(`${db}`, ml - 5, y); }
    }
    ctx.textAlign = 'center';
    const pathStep = Math.max(5, Math.ceil(maxX / 6 / 5) * 5);
    for (let p = 0; p <= maxX; p += pathStep) {
        const x = xPath(p);
        if (x >= ml && x <= w - mr) { ctx.beginPath(); ctx.moveTo(x, mt); ctx.lineTo(x, mt + ph); ctx.stroke(); ctx.fillText(`${p}`, x, mt + ph + 5); }
    }
    ctx.strokeStyle = lightTheme ? '#7f8c8d' : '#57708a';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ml, mt); ctx.lineTo(ml, mt + ph); ctx.lineTo(w - mr, mt + ph); ctx.stroke();
    ctx.fillStyle = lightTheme ? '#2c3e4e' : '#9fb3c8';
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, ml + pw / 2, mt + ph + 18);

    const gates = [
        { enabled: state.gate1Enabled, start: state.gate1Start, end: state.gate1End, color: state.gate1Color, level: state.gate1Level, num: 1 },
        { enabled: state.gate2Enabled, start: state.gate2Start, end: state.gate2End, color: state.gate2Color, level: state.gate2Level, num: 2 },
        { enabled: state.gate3Enabled, start: state.gate3Start, end: state.gate3End, color: state.gate3Color, level: state.gate3Level, num: 3 }
    ];
    gates.forEach(gate => {
        if (gate.enabled) {
            const x1 = xPath(gate.start);
            const x2 = xPath(gate.end);
            if (x2 > ml && x1 < w - mr) {
                const drawX1 = Math.max(x1, ml);
                const drawX2 = Math.min(x2, w - mr);
                const y = yDb(gate.level);
                const isActive = (gateDragState && gateDragState.gateNum === gate.num) ||
                    (gateHoverState && gateHoverState.gateNum === gate.num);
                const isHover = gateHoverState && gateHoverState.gateNum === gate.num && !gateDragState;
                ctx.strokeStyle = gate.color;
                ctx.lineWidth = isActive ? 5 : 3;
                ctx.setLineDash([]);
                ctx.globalAlpha = isActive ? 1.0 : 0.8;
                ctx.beginPath();
                ctx.moveTo(drawX1, y);
                ctx.lineTo(drawX2, y);
                ctx.stroke();
                ctx.globalAlpha = 1.0;
                ctx.lineWidth = isActive ? 3 : 2;
                const markerHeight = isActive ? 12 : 8;
                if (x1 >= ml && x1 <= w - mr) {
                    if (isHover && gateHoverState.edge === 'start') {
                        ctx.fillStyle = gate.color;
                        ctx.globalAlpha = 0.3;
                        ctx.fillRect(x1 - 8, y - markerHeight, 16, markerHeight * 2);
                        ctx.globalAlpha = 1.0;
                    }
                    ctx.beginPath();
                    ctx.moveTo(x1, y - markerHeight);
                    ctx.lineTo(x1, y + markerHeight);
                    ctx.stroke();
                }
                if (x2 >= ml && x2 <= w - mr) {
                    if (isHover && gateHoverState.edge === 'end') {
                        ctx.fillStyle = gate.color;
                        ctx.globalAlpha = 0.3;
                        ctx.fillRect(x2 - 8, y - markerHeight, 16, markerHeight * 2);
                        ctx.globalAlpha = 1.0;
                    }
                    ctx.beginPath();
                    ctx.moveTo(x2, y - markerHeight);
                    ctx.lineTo(x2, y + markerHeight);
                    ctx.stroke();
                }
                if (isHover && gateHoverState.edge === 'body') {
                    ctx.fillStyle = gate.color;
                    ctx.globalAlpha = 0.15;
                    ctx.fillRect(drawX1, y - 6, drawX2 - drawX1, 12);
                    ctx.globalAlpha = 1.0;
                }
                ctx.fillStyle = gate.color;
                ctx.font = isActive ? 'bold 12px Helvetica' : 'bold 11px Helvetica';
                ctx.textAlign = 'center';
                if (x1 >= ml && x1 <= w - mr) {
                    ctx.fillText(gate.num.toString(), x1, y - markerHeight - 3);
                }
                if (x2 >= ml && x2 <= w - mr) {
                    ctx.fillText(gate.num.toString(), x2, y - markerHeight - 3);
                }
                if (isActive) {
                    ctx.font = 'bold 10px Helvetica';
                    ctx.fillStyle = lightTheme ? '#0c1522' : '#fff';
                    const midX = (drawX1 + drawX2) / 2;
                    ctx.fillText(`${Math.round(gate.start)}-${Math.round(gate.end)} мм @ ${gate.level}dB`, midX, y + markerHeight + 12);
                }
            }
        }
    });

    [
        { db: state.gateReject, color: '#ff5f57', label: 'Брак.' },
        { db: state.gateControl, color: '#ffd166', label: 'Контр.' },
        { db: state.gateSearch, color: '#4cc9f0', label: 'Поиск.' }
    ].forEach(g => {
        const y = yDb(g.db);
        if (y >= mt && y <= mt + ph) {
            ctx.strokeStyle = g.color;
            ctx.setLineDash([6, 4]);
            ctx.beginPath(); ctx.moveTo(ml, y); ctx.lineTo(w - mr, y); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = g.color;
            ctx.font = '8px Helvetica';
            ctx.textAlign = 'left';
            ctx.fillText(`${g.label} ${g.db}dB`, ml + 4, y - 2);
        }
    });

    for (const s of allSigs) {
        const x = xPath(getX(s)), y = yDb(s.amplitudeDb ?? amplitudeToDb(s.amplitude)), baseY = yDb(DB_MIN);
        const ampDb = s.amplitudeDb ?? DB_MIN;
        let level = ampDb >= state.gateReject ? '#ff5f57' : ampDb >= state.gateControl ? '#ffd166' : ampDb >= state.gateSearch ? '#4cc9f0' : '#607087';
        ctx.strokeStyle = s.type === 'bottom' ? '#5cb878' : level;
        ctx.lineWidth = s.type === 'bottom' ? 1.5 : 2.2;
        if (x >= ml && x <= w - mr && y >= mt && y <= mt + ph) {
            ctx.beginPath(); ctx.moveTo(x, mt + ph); ctx.lineTo(x, y); ctx.stroke();
        }
        if (s.type !== 'bottom') {
            ctx.fillStyle = level;
            ctx.globalAlpha = 0.7;
            ctx.beginPath(); ctx.moveTo(x - 5, baseY); ctx.lineTo(x + 5, baseY); ctx.lineTo(x, y); ctx.fill();
            ctx.globalAlpha = 1;
        }
        ctx.fillStyle = lightTheme ? '#0c1522' : '#fff';
        ctx.font = '8px Helvetica';
        ctx.textAlign = 'center';
        let labelText = s.label + ' ' + Math.round(s.amplitudeDb ?? amplitudeToDb(s.amplitude)) + 'dB';
        if (x >= ml && x <= w - mr && y - 4 >= mt) ctx.fillText(labelText, x, y - 4);
    }
}
