function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function getMaterial() { return MATERIALS[state.material]; }
function getSpeedOfSound() { return getMaterial().speed; }
function getWavelength() { return getSpeedOfSound() / state.frequency; }
function getAttenuationCoeff() { return getMaterial().attenuation / 8.686; }

function getProbeData() { return PROBE_MODELS[state.probeModel]; }

function getNearZone() {
    const lambda = getWavelength();
    if (state.piezoShape === 'round') {
        const D = state.piezoDiam;
        return (D * D) / (4 * lambda);
    }
    const a = state.piezoA, b = state.piezoB;
    const D_eq = Math.sqrt(4 * a * b / Math.PI);
    return (D_eq * D_eq) / (4 * lambda);
}
function getFarZoneStart() { return getNearZone(); }

function getProbeHorizontalSign() { return state.side.endsWith('left') ? -1 : 1; }
function isProbeBottom() { return state.side.startsWith('bottom'); }
function getEntrySurface() { return isProbeBottom() ? 'root' : 'face'; }
function getOppositeSurface(surface) { return surface === 'root' ? 'face' : 'root'; }
function getNominalSurfaceY(surface) { return surface === 'root' ? state.H : 0; }
function getPlateHalfWidth() { return 150; }

function amplitudeToDb(amplitude) {
    return clamp(20 * Math.log10(Math.max(amplitude, 0.1) / 100), DB_MIN, DB_MAX);
}

function reflectAngle(inAng, normalAng) {
    let dx = Math.cos(inAng), dy = Math.sin(inAng), nx = Math.cos(normalAng), ny = Math.sin(normalAng);
    if (dx * nx + dy * ny > 0) { nx = -nx; ny = -ny; }
    const dot = dx * nx + dy * ny;
    return Math.atan2(dy - 2 * dot * ny, dx - 2 * dot * nx);
}

function getSlagPoints(def) {
    const n = 8, base = def.size / 2, rot = def.angle * Math.PI / 180;
    let pts = [];
    for (let i = 0; i < n; i++) {
        const a = rot + i * Math.PI * 2 / n;
        const k = 0.76 + 0.18 * Math.sin((def.id + 1) * 1.71 + i * 2.37) + 0.08 * Math.cos(i * 3.11);
        pts.push({ x: def.x + base * k * Math.cos(a), y: def.y + base * k * Math.sin(a) });
    }
    return pts;
}

function getCrackPoints(def) {
    const segCount = 4, segLen = def.size / segCount;
    let dir = def.angle * Math.PI / 180;
    let pts = [{ x: 0, y: 0 }];
    for (let i = 0; i < segCount; i++) {
        const turnDeg = 10 + ((def.id * 17 + i * 11) % 36);
        if (i > 0) dir += (i % 2 ? 1 : -1) * turnDeg * Math.PI / 180;
        const last = pts[pts.length - 1];
        pts.push({ x: last.x + segLen * Math.cos(dir), y: last.y + segLen * Math.sin(dir) });
    }
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    return pts.map(p => ({ x: def.x + p.x - cx, y: def.y + p.y - cy }));
}

function getLinearDefectSegments(def) {
    if (def.type === 'crack') {
        const pts = getCrackPoints(def);
        return pts.slice(0, -1).map((p, i) => ({ x1: p.x, y1: p.y, x2: pts[i + 1].x, y2: pts[i + 1].y }));
    }
    const angRad = def.angle * Math.PI / 180, hl = def.size / 2;
    return [{ x1: def.x - hl * Math.cos(angRad), y1: def.y - hl * Math.sin(angRad), x2: def.x + hl * Math.cos(angRad), y2: def.y + hl * Math.sin(angRad) }];
}

function applyAssemblyDefects(points) {
    const { edgeOffset, axisKink } = state;
    if (edgeOffset === 0 && axisKink === 0) return points;
    const kinkRad = axisKink * Math.PI / 180;
    const midY = state.H / 2;
    return points.map(p => {
        if (p.x <= 0) return { x: p.x, y: p.y };
        let x = p.x, y = p.y;
        y -= edgeOffset;
        if (kinkRad !== 0) {
            const dx = x, dy = y - midY;
            const cosA = Math.cos(kinkRad), sinA = Math.sin(kinkRad);
            x = dx * cosA - dy * sinA;
            y = midY + dx * sinA + dy * cosA;
        }
        return { x, y };
    });
}

function getGroovePoints() {
    const { H, weldType, b, beta, c } = state;
    const halfB = b / 2;
    const betaRad = beta * Math.PI / 180;
    const tanHalf = Math.tan(betaRad / 2);
    const land = Math.min(Math.max(c, 0), H * 0.35);
    const points = [];
    if (weldType === 'V_single') {
        const leftTopX = halfB + (H - land) * tanHalf;
        points.push({ x: -leftTopX, y: 0 }, { x: -halfB, y: H - land }, { x: -halfB, y: H }, { x: halfB, y: H }, { x: halfB, y: 0 });
    } else if (weldType === 'V_double') {
        const leftTopX = halfB + (H - land) * tanHalf;
        points.push({ x: -leftTopX, y: 0 }, { x: -halfB, y: H - land }, { x: -halfB, y: H }, { x: halfB, y: H }, { x: halfB, y: H - land }, { x: leftTopX, y: 0 });
    } else if (weldType === 'X_single') {
        const yMid = H / 2, midThick = Math.max(0, (H - land) / 2);
        const sideX = halfB + midThick * tanHalf;
        points.push({ x: -sideX, y: 0 }, { x: -halfB, y: yMid - land / 2 }, { x: -halfB, y: yMid + land / 2 }, { x: -sideX, y: H }, { x: halfB, y: H }, { x: halfB, y: 0 });
    } else if (weldType === 'X_double') {
        const yMid = H / 2, midThick = Math.max(0, (H - land) / 2);
        const sideX = halfB + midThick * tanHalf;
        points.push({ x: -sideX, y: 0 }, { x: -halfB, y: yMid - land / 2 }, { x: -halfB, y: yMid + land / 2 }, { x: -sideX, y: H }, { x: sideX, y: H }, { x: halfB, y: yMid + land / 2 }, { x: halfB, y: yMid - land / 2 }, { x: sideX, y: 0 });
    }
    return applyAssemblyDefects(points);
}

function getMinAbsL() {
    const surface = getEntrySurface();
    const halfWidth = (surface === 'face') ? state.Wface / 2 : state.Wroot / 2;
    const gVal = (surface === 'face') ? state.Gf : state.Gr;
    if (gVal <= 0) return 0;
    const totalArrow = Math.max(0, state.piezoArrow || getProbeData().baseArrow);
    return state.side.endsWith('left') ? halfWidth + totalArrow : -(halfWidth + totalArrow);
}

function getBeamOrigin() {
    const x = state.probeWorldX;
    return {
        x,
        y: getSurfaceYAt(getEntrySurface(), x)
    };
}

function getReinforcementPoint(surface, x) {
    const half = (surface === 'root' ? state.Wroot : state.Wface) / 2;
    const offset = (surface === 'root' ? state.WrootOffset : state.WfaceOffset);
    const xRel = x - offset;
    if (half <= 0 || Math.abs(xRel) > half) return null;
    const n = xRel / half;
    const g = surface === 'root' ? Math.max(0, state.Gr) : Math.max(0, state.Gf);
    const shapeName = surface === 'root' ? state.GrShape : state.GfShape;
    const power = REINFORCEMENT_SHAPES[shapeName]?.power || 2;
    const crown = g * (1 - Math.pow(Math.abs(n), power));
    const baseY = getNominalSurfaceY(surface);
    let pt = surface === 'root' ? { x, y: baseY + crown } : { x, y: baseY - crown };
    const angleDeg = surface === 'root' ? state.GrAngle : state.GfAngle;
    if (angleDeg !== 0) {
        const angRad = angleDeg * Math.PI / 180;
        const cx = offset, cy = getNominalSurfaceY(surface);
        const dx = pt.x - cx, dy = pt.y - cy;
        pt = { x: cx + dx * Math.cos(angRad) - dy * Math.sin(angRad), y: cy + dx * Math.sin(angRad) + dy * Math.cos(angRad) };
    }
    return pt;
}

function getReinforcementNormal(surface, x) {
    const half = (surface === 'root' ? state.Wroot : state.Wface) / 2;
    const halfAbs = Math.max(0.001, half);
    const offset = (surface === 'root' ? state.WrootOffset : state.WfaceOffset);
    const xRel = x - offset;
    const g = surface === 'root' ? state.Gr : state.Gf;
    const shapeName = surface === 'root' ? state.GrShape : state.GfShape;
    const power = REINFORCEMENT_SHAPES[shapeName]?.power || 2;
    const n = xRel / halfAbs;
    const baseNormal = surface === 'root' ? -Math.PI / 2 : Math.PI / 2;
    const crownSlope = surface === 'root'
        ? (-g * power * Math.pow(Math.abs(n), power - 1) * Math.sign(n) / halfAbs)
        : (g * power * Math.pow(Math.abs(n), power - 1) * Math.sign(n) / halfAbs);
    let normal = baseNormal + Math.atan(crownSlope);
    const angleDeg = surface === 'root' ? state.GrAngle : state.GfAngle;
    if (angleDeg !== 0) {
        normal += angleDeg * Math.PI / 180;
    }
    return normal;
}

function rayIntersectSegment(ox, oy, dx, dy, sx1, sy1, sx2, sy2) {
    const sdx = sx2 - sx1, sdy = sy2 - sy1;
    const denom = dx * sdy - dy * sdx;
    if (Math.abs(denom) < 1e-9) return [];
    const t = ((sx1 - ox) * sdy - (sy1 - oy) * sdx) / denom;
    const u = ((sx1 - ox) * dy - (sy1 - oy) * dx) / denom;
    if (t > 0.001 && u >= -0.001 && u <= 1.001) return [{ t, entry: true, normalAng: Math.atan2(sdy, sdx) + Math.PI / 2 }];
    return [];
}

function rayIntersectReinforcement(ox, oy, dx, dy, surface) {
    const half = (surface === 'root' ? state.Wroot : state.Wface) / 2;
    const gVal = surface === 'root' ? state.Gr : state.Gf;
    const offset = (surface === 'root' ? state.WrootOffset : state.WfaceOffset);
    if (half <= 0 || gVal <= 0) return null;
    let best = null, steps = 56;
    const leftX = offset - half;
    const rightX = offset + half;
    let prev = getReinforcementPoint(surface, leftX);
    for (let i = 1; i <= steps; i++) {
        const x = leftX + (2 * half * i) / steps;
        const cur = getReinforcementPoint(surface, x);
        const hit = rayIntersectSegment(ox, oy, dx, dy, prev.x, prev.y, cur.x, cur.y)[0];
        if (hit && (!best || hit.t < best.t)) best = { t: hit.t, x: ox + dx * hit.t, y: oy + dy * hit.t, normalAng: getReinforcementNormal(surface, x), surface };
        prev = cur;
    }
    return best;
}

function getSurfaceYAt(surface, x) {
    const baseY = surface === 'root' ? state.H : 0;
    if (x <= 0 || (state.edgeOffset === 0 && state.axisKink === 0)) return baseY;
    let y = baseY - state.edgeOffset;
    if (state.axisKink !== 0) {
        const kinkRad = state.axisKink * Math.PI / 180;
        const midY = state.H / 2;
        y = midY + x * Math.sin(kinkRad) + (y - midY) * Math.cos(kinkRad);
    }
    return y;
}

function rayIntersectFlatBoundary(ox, oy, dx, dy, surface) {
    const baseY = surface === 'root' ? state.H : 0;
    if (Math.abs(dy) < 1e-9) return null;
    const occupiedHalf = (surface === 'root' ? state.Wroot : state.Wface) / 2;
    const offset = (surface === 'root' ? state.WrootOffset : state.WfaceOffset);
    let best = null;
    const surfYs = [{ y: baseY, xMin: -Infinity, xMax: 0 }];
    if (state.edgeOffset !== 0 || state.axisKink !== 0) {
        const rightY = getSurfaceYAt(surface, 1);
        if (Math.abs(rightY - baseY) > 0.01) {
            surfYs.push({ y: rightY, xMin: 0, xMax: Infinity });
        }
    }
    for (const { y, xMin, xMax } of surfYs) {
        const t = (y - oy) / dy;
        if (t <= 0.001) continue;
        const x = ox + dx * t;
        if (x < xMin || x > xMax) continue;
        const reinfL = offset - occupiedHalf;
        const reinfR = offset + occupiedHalf;
        if (x >= reinfL && x <= reinfR) continue;
        if (!best || t < best.t) {
            best = { t, x, y, normalAng: surface === 'root' ? -Math.PI / 2 : Math.PI / 2, surface: surface + '-flat' };
        }
    }
    return best;
}

function rayIntersectStep(ox, oy, dx, dy) {
    const { edgeOffset, axisKink } = state;
    if (edgeOffset === 0 && axisKink === 0) return null;
    if (Math.abs(dx) < 1e-9) return null;
    const t = (0 - ox) / dx;
    if (t <= 0.001) return null;
    const hitY = oy + dy * t;
    const leftFaceY = 0, rightFaceY = getSurfaceYAt('face', 1);
    const leftRootY = state.H, rightRootY = getSurfaceYAt('root', 1);
    const faceStep = { min: Math.min(leftFaceY, rightFaceY), max: Math.max(leftFaceY, rightFaceY) };
    const rootStep = { min: Math.min(leftRootY, rightRootY), max: Math.max(leftRootY, rightRootY) };
    let isFaceHit = hitY >= faceStep.min - 0.5 && hitY <= faceStep.max + 0.5 && (faceStep.max - faceStep.min) > 0.1;
    let isRootHit = hitY >= rootStep.min - 0.5 && hitY <= rootStep.max + 0.5 && (rootStep.max - rootStep.min) > 0.1;
    if (!isFaceHit && !isRootHit) return null;
    if (isFaceHit && isRootHit) {
        if (Math.abs(hitY - leftFaceY) < Math.abs(hitY - leftRootY)) isRootHit = false;
        else isFaceHit = false;
    }
    const normalAng = edgeOffset > 0 ? Math.PI : 0;
    return { t, x: 0, y: hitY, normalAng, surface: 'step' };
}

function findBoundaryHit(ox, oy, dx, dy, surface) {
    const cand = [
        rayIntersectReinforcement(ox, oy, dx, dy, surface),
        rayIntersectFlatBoundary(ox, oy, dx, dy, surface),
        rayIntersectStep(ox, oy, dx, dy)
    ].filter(Boolean);
    cand.sort((a, b) => a.t - b.t);
    return cand[0];
}

function computeFullBeamPath(angleDeg) {
    const origin = getBeamOrigin();
    const alphaRad = Math.max(1, Math.min(88.5, angleDeg)) * Math.PI / 180;
    const entrySurf = getEntrySurface();
    const firstSurf = getOppositeSurface(entrySurf);
    const signX = getProbeHorizontalSign(), signY = isProbeBottom() ? -1 : 1;
    const dirIn = { dx: signX * Math.sin(alphaRad), dy: signY * Math.cos(alphaRad) };
    const firstY = getNominalSurfaceY(firstSurf);
    const firstHit = findBoundaryHit(origin.x, origin.y, dirIn.dx, dirIn.dy, firstSurf) || {
        x: origin.x + dirIn.dx * ((firstY - origin.y) / dirIn.dy),
        y: firstY,
        normalAng: firstSurf === 'root' ? -Math.PI / 2 : Math.PI / 2
    };
    if (state.mode === 'direct') return [origin, { x: firstHit.x, y: firstHit.y }];
    if (state.mode === 'reflected') {
        const refAng = reflectAngle(Math.atan2(dirIn.dy, dirIn.dx), firstHit.normalAng);
        const dirOut = { dx: Math.cos(refAng), dy: Math.sin(refAng) };
        const returnY = getNominalSurfaceY(entrySurf);
        const returnHit = findBoundaryHit(firstHit.x, firstHit.y, dirOut.dx, dirOut.dy, entrySurf) || {
            x: firstHit.x + dirOut.dx * ((returnY - firstHit.y) / dirOut.dy),
            y: returnY
        };
        return [origin, { x: firstHit.x, y: firstHit.y }, { x: returnHit.x, y: returnHit.y }];
    }
    if (state.mode === 'realistic') {
        let points = [origin];
        let currentPos = { x: origin.x, y: origin.y };
        let currentDir = { dx: dirIn.dx, dy: dirIn.dy };
        let currentAng = Math.atan2(dirIn.dy, dirIn.dx);
        const maxReflections = 8;
        const maxPath = state.H * 8;
        let totalPath = 0;
        for (let i = 0; i < maxReflections; i++) {
            let candidates = [];
            const faceHit = findBoundaryHit(currentPos.x, currentPos.y, currentDir.dx, currentDir.dy, 'face');
            const rootHit = findBoundaryHit(currentPos.x, currentPos.y, currentDir.dx, currentDir.dy, 'root');
            if (faceHit) candidates.push({ ...faceHit, surface: 'face' });
            if (rootHit) candidates.push({ ...rootHit, surface: 'root' });
            if (candidates.length === 0) break;
            candidates.sort((a, b) => a.t - b.t);
            const hit = candidates[0];
            totalPath += hit.t;
            if (totalPath > maxPath) break;
            points.push({ x: hit.x, y: hit.y });
            currentAng = reflectAngle(currentAng, hit.normalAng);
            currentDir = { dx: Math.cos(currentAng), dy: Math.sin(currentAng) };
            const epsilon = 0.1;
            currentPos = { x: hit.x + currentDir.dx * epsilon, y: hit.y + currentDir.dy * epsilon };
        }
        return points;
    }
    return [origin, { x: firstHit.x, y: firstHit.y }];
}

function getBeamSegments() {
    const points = computeFullBeamPath(state.alpha);
    let seg = [], acc = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i + 1].x - points[i].x, dy = points[i + 1].y - points[i].y;
        const len = Math.hypot(dx, dy);
        seg.push({ x1: points[i].x, y1: points[i].y, x2: points[i + 1].x, y2: points[i + 1].y, t1: acc, t2: acc + len, len });
        acc += len;
    }
    return seg;
}

function rayIntersectCircle(ox, oy, dx, dy, cx, cy, r) {
    const fx = ox - cx, fy = oy - cy;
    const a = dx * dx + dy * dy, b = 2 * (fx * dx + fy * dy), c = fx * fx + fy * fy - r * r;
    const D = b * b - 4 * a * c;
    if (D < 0) return [];
    const sqrtD = Math.sqrt(D);
    const t1 = (-b - sqrtD) / (2 * a), t2 = (-b + sqrtD) / (2 * a);
    let res = [];
    if (t1 > 0.001) res.push({ t: t1, entry: true });
    if (t2 > 0.001 && Math.abs(t2 - t1) > 0.001) res.push({ t: t2, entry: false });
    return res;
}

function getDefectIntersections(ox, oy, dx, dy, maxT) {
    let hits = [];
    for (let idx = 0; idx < state.defects.length; idx++) {
        const d = state.defects[idx];
        let inter = [];
        if (d.type === 'pore') {
            inter = rayIntersectCircle(ox, oy, dx, dy, d.x, d.y, d.size / 2);
            inter = inter.filter(ip => ip.entry);
        } else if (d.type === 'slag') {
            const pts = getSlagPoints(d);
            for (let p = 0; p < pts.length; p++) {
                const a = pts[p], b = pts[(p + 1) % pts.length];
                inter.push(...rayIntersectSegment(ox, oy, dx, dy, a.x, a.y, b.x, b.y));
            }
            if (inter.length > 0) inter = [inter[0]];
        } else {
            for (const seg of getLinearDefectSegments(d)) {
                inter.push(...rayIntersectSegment(ox, oy, dx, dy, seg.x1, seg.y1, seg.x2, seg.y2));
            }
        }
        for (const ip of inter) {
            if (ip.t < maxT) {
                let normalAng = ip.normalAng;
                if (d.type === 'pore') normalAng = Math.atan2(oy + dy * ip.t - d.y, ox + dx * ip.t - d.x);
                hits.push({ t: ip.t, defectIndex: idx, entry: ip.entry, normalAng });
            }
        }
    }
    hits.sort((a, b) => a.t - b.t);
    return hits;
}

function getReflectionFactor(def, incidenceAngle, normalAng) {
    let delta = incidenceAngle - normalAng, phi = Math.abs(delta);
    if (phi > Math.PI / 2) phi = Math.PI - phi;
    if (phi > Math.PI / 2) phi = Math.PI / 2;
    const cosPhi = Math.cos(phi);
    let factor;
    if (def.type === 'pore') {
        factor = 0.3 + 0.7 * cosPhi;
    } else if (def.type === 'slag') {
        factor = 0.4 + 0.5 * Math.pow(cosPhi, 1.5);
    } else {
        factor = 0.5 + 0.5 * Math.pow(cosPhi, 2);
        if (phi < Math.PI / 6) factor *= 1.3;
    }
    return Math.min(1.0, Math.max(0.0, factor));
}

function getBeamFactor(hitX, hitY, pathLength, origin, dir) {
    const px = hitX - origin.x, py = hitY - origin.y;
    const proj = px * dir.dx + py * dir.dy;
    if (proj < 0) return 0;
    const cross = Math.abs(px * dir.dy - py * dir.dx);
    const phiRad = state.phi * Math.PI / 180;
    const beamRadius = pathLength * Math.tan(phiRad);
    if (beamRadius < 1e-6) return cross < 0.1 ? 1.0 : 0.0;
    const rel = cross / beamRadius;
    if (rel >= 1.0) return 0.0;
    return (1 - rel * rel);
}

function calculateShadowTransmission(def_j, beam_dir, prior_defects) {
    const lambda = getWavelength();
    const beam_angle = Math.atan2(beam_dir.dy, beam_dir.dx);
    let total_T = 1.0;
    for (const def_i of prior_defects) {
        const dx_ij = def_j.x - def_i.x, dy_ij = def_j.y - def_i.y;
        const delta_z = dx_ij * beam_dir.dx + dy_ij * beam_dir.dy;
        if (delta_z <= 0.5) continue;
        const dx_perp = -beam_dir.dy, dy_perp = beam_dir.dx;
        const d_lat = Math.abs(dx_ij * dx_perp + dy_ij * dy_perp);
        let D_i = def_i.size;
        if (PLANAR_DEFECTS.includes(def_i.type)) {
            const angle_eff = Math.abs(Math.cos((def_i.angle * Math.PI / 180) - beam_angle));
            D_i = Math.max(def_i.size * angle_eff, 0.5);
        }
        const tan_phi = Math.tan(state.phi * Math.PI / 180);
        const R_geo = (D_i / 2) + delta_z * tan_phi;
        const R_diff = Math.sqrt(lambda * delta_z);
        const R_eff = Math.max(R_geo, R_diff);
        const xi = d_lat / R_eff;
        if (xi >= 2.0) continue;
        const geo_block = xi < 1 ? 1 - xi * xi : Math.max(0, (2 - xi) * (2 - xi));
        const freq_factor = D_i / (D_i + 0.8 * lambda);
        const dist_decay = Math.exp(-delta_z / (3 * D_i + 10));
        const shadow_S = geo_block * freq_factor * dist_decay;
        total_T *= (1 - shadow_S);
    }
    return Math.max(0.05, total_T);
}

function calculateAllSignals() {
    const origin = getBeamOrigin();
    const atten = getAttenuationCoeff();
    const gainFactor = Math.pow(10, state.gain / 20);
    const reflectionGainFactor = state.mode !== 'direct' ? Math.pow(10, (state.gain + state.reflectionBoost) / 20) : gainFactor;
    let results = [];

    if (state.mode === 'direct') {
        const seg = getBeamSegments()[0];
        const path = seg.t2;
        const att = Math.exp(-atten * 2 * path);
        const amp = Math.min(100, 40 * att * gainFactor * BOUNDARY_REFLECTION);
        results.push({ type: 'bottom', pathLength: path, amplitude: amp, amplitudeDb: amplitudeToDb(amp), depth: state.H, label: 'Дно' });
    }

    const segments = getBeamSegments();
    const detectedDefects = [];

    if (state.mode === 'realistic') {
        const beamPath = computeFullBeamPath(state.alpha);
        let accPath = 0;
        for (let i = 1; i < beamPath.length; i++) {
            const dx = beamPath[i].x - beamPath[i - 1].x;
            const dy = beamPath[i].y - beamPath[i - 1].y;
            const segLen = Math.hypot(dx, dy);
            accPath += segLen;
            const att = Math.exp(-atten * 2 * accPath);
            const boundaryAmp = Math.min(100, 35 * att * reflectionGainFactor * BOUNDARY_REFLECTION);
            if (boundaryAmp > 0.5) {
                const isStep = Math.abs(beamPath[i].x) < 1 && beamPath[i].y > 0.1 && beamPath[i].y < state.H - 0.1;
                const surfaceLabel = isStep ? 'Ступенька' : (Math.abs(beamPath[i].y - state.H) < 0.1 ? 'Корень' : 'Лицо');
                results.push({
                    type: isStep ? 'step' : 'boundary',
                    pathLength: accPath,
                    amplitude: boundaryAmp,
                    amplitudeDb: amplitudeToDb(boundaryAmp),
                    depth: beamPath[i].y,
                    label: `${surfaceLabel} (${i})`
                });
            }
        }
    }

    if (state.edgeOffset !== 0 && state.mode !== 'realistic') {
        const beamPath = computeFullBeamPath(state.alpha);
        let stepPath = 0;
        for (let i = 1; i < beamPath.length; i++) {
            const dx = beamPath[i].x - beamPath[i - 1].x;
            const dy = beamPath[i].y - beamPath[i - 1].y;
            stepPath += Math.hypot(dx, dy);
            if (Math.abs(beamPath[i].x) < 1 && beamPath[i].y > 0.1 && beamPath[i].y < state.H - 0.1) {
                const att = Math.exp(-atten * 2 * stepPath);
                const stepAmp = Math.min(100, 15 * Math.abs(state.edgeOffset) * att * reflectionGainFactor);
                if (stepAmp > 0.5) {
                    results.push({
                        type: 'step', pathLength: stepPath, amplitude: stepAmp, amplitudeDb: amplitudeToDb(stepAmp),
                        depth: beamPath[i].y, label: 'Ступенька'
                    });
                }
                break;
            }
        }
    }
    if (state.axisKink !== 0 && state.mode !== 'realistic') {
        const origin = getBeamOrigin();
        const alphaRad = state.alpha * Math.PI / 180;
        const signX = getProbeHorizontalSign();
        const signY = isProbeBottom() ? -1 : 1;
        const dirX = signX * Math.sin(alphaRad);
        const dirY = signY * Math.cos(alphaRad);
        if (dirX !== 0 && origin.x * dirX < 0) {
            const t = -origin.x / dirX;
            if (t > 0.001) {
                const hitY = origin.y + dirY * t;
                if (hitY > 0.1 && hitY < state.H - 0.1) {
                    const att = Math.exp(-atten * 2 * t);
                    const kinkAmp = Math.min(100, 6 * Math.abs(state.axisKink) * att * reflectionGainFactor);
                    if (kinkAmp > 0.5) {
                        results.push({
                            type: 'step', pathLength: t, amplitude: kinkAmp, amplitudeDb: amplitudeToDb(kinkAmp),
                            depth: hitY, label: 'Перелом оси'
                        });
                    }
                }
            }
        }
    }

    for (let si = 0; si < segments.length; si++) {
        const seg = segments[si];
        const ox = seg.x1, oy = seg.y1;
        const dx = (seg.x2 - seg.x1) / seg.len, dy = (seg.y2 - seg.y1) / seg.len;
        const hits = getDefectIntersections(ox, oy, dx, dy, seg.len);
        for (const hit of hits) {
            const def = state.defects[hit.defectIndex];
            const path = seg.t1 + hit.t;
            const att = Math.exp(-atten * 2 * path);
            const typeMod = DEFECT_AMP_MOD[def.type] || 1.4;
            const hitX = ox + dx * hit.t, hitY = oy + dy * hit.t;
            const beamFactor = getBeamFactor(hitX, hitY, path, { x: ox, y: oy }, { dx, dy });
            if (beamFactor <= 0) continue;
            const incidenceAngle = Math.atan2(dy, dx);
            const normalAng = hit.normalAng;
            const reflection = getReflectionFactor(def, incidenceAngle, normalAng);
            const shadow_T = calculateShadowTransmission(def, { dx, dy }, detectedDefects);
            let rawAmp = def.size * 12 * att * reflectionGainFactor * typeMod * beamFactor * reflection * shadow_T;
            if (state.mode === 'reflected') {
                const pathRatio = segments.length > 1 ? segments[segments.length - 1].t2 / segments[0].t2 : 2;
                rawAmp *= Math.sqrt(pathRatio);
            }
            const amp = Math.min(100, Math.max(0.5, rawAmp));

            if (!isSignalInGate(path)) continue;

            detectedDefects.push({ ...def, pathLength: path, effectiveSize: def.size * reflection * beamFactor });
            results.push({
                type: 'defect', pathLength: path, amplitude: amp, amplitudeDb: amplitudeToDb(amp), depth: def.y,
                defectIndex: hit.defectIndex, label: `${DEFECT_NAMES[def.type]} #${def.id}`,
                incidence: incidenceAngle, normalAng: hit.normalAng, shadowT: shadow_T
            });
        }
    }

    results.sort((a, b) => a.pathLength - b.pathLength);
    return { signals: results };
}

function getWorldBoundsExt() {
    const { edgeOffset, axisKink } = state;
    let rightFaceY = 0, rightRootY = state.H;
    if (edgeOffset !== 0 || axisKink !== 0) {
        const kinkRad = axisKink * Math.PI / 180;
        const cosA = Math.cos(kinkRad), sinA = Math.sin(kinkRad);
        const midY = state.H / 2;
        const farX = 150;
        const rxTop = farX, ryTop = -edgeOffset;
        const rxBot = farX, ryBot = state.H - edgeOffset;
        if (kinkRad !== 0) {
            const t = { x: rxTop * cosA - (ryTop - midY) * sinA, y: midY + rxTop * sinA + (ryTop - midY) * cosA };
            const b = { x: rxBot * cosA - (ryBot - midY) * sinA, y: midY + rxBot * sinA + (ryBot - midY) * cosA };
            rightFaceY = Math.min(t.y, b.y);
            rightRootY = Math.max(t.y, b.y);
        } else {
            rightFaceY = -edgeOffset;
            rightRootY = state.H - edgeOffset;
        }
    }
    let minX = -150, maxX = 150;
    let minY = Math.min(-20, rightFaceY - 5);
    let maxY = Math.max(state.H + 20, rightRootY + 5);
    for (let d of state.defects) {
        minX = Math.min(minX, d.x - d.size);
        maxX = Math.max(maxX, d.x + d.size);
        minY = Math.min(minY, d.y - d.size);
        maxY = Math.max(maxY, d.y + d.size);
    }
    return { minX: minX - 10, maxX: maxX + 10, minY: minY - 10, maxY: maxY + 10 };
}

function getDefectSizeRange(type) {
    const max = PLANAR_DEFECTS.includes(type) ? state.H : 10;
    return { min: 0.5, max: Math.max(0.5, max) };
}

function isSignalInGate(pathLength) {
    if (state.gate1Enabled && pathLength >= state.gate1Start && pathLength <= state.gate1End) return true;
    if (state.gate2Enabled && pathLength >= state.gate2Start && pathLength <= state.gate2End) return true;
    if (state.gate3Enabled && pathLength >= state.gate3Start && pathLength <= state.gate3End) return true;
    return false;
}
