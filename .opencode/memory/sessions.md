# Сессии проекта

## 2026-05-30 — Создание локальной памяти + Стрела ПЭП

**Часть 1: Память**
- Перенос проектной памяти из глобального Obsidian vault (`Opencode Memory/Sessions/`) в `.opencode/memory/` самого проекта
- Создана структура `.opencode/memory/` (project.md, sessions.md, decisions.md, issues.md)
- `session-memory.md` из корня `.opencode/` перенесён сюда
- Обновлён Obsidian vault (ссылки на локальную память)
- Очистка корня: удалены `backups/`, оставлен `Opencode SI.html` как подстраховка

**Часть 2: Стрела ПЭП (`начато — не доделано`)**
- Проблема: `state.piezoArrow = 0`, а базовая стрела std=10мм, mini=8мм
- Переименовано `boom` → `baseArrow` в PROBE_MODELS
- `getBeamOrigin()` теперь использует `state.piezoArrow` как полную стрелу (а не смещение от нуля)
- Слайдер расширен до 2..25
- При смене ПЭП стрела сбрасывается на baseArrow
- **Нужно проверить и доработать** — пользователь сказал «Не так!»

---

## 2026-05-27 — Отрисовка пластины, валиков, ступеньки и поворота оси

### 1. Plate edges bounded by groove shape (`renderer.js:180-244`)
- Groove points split into left/right by root position
- Left plate draws from `-plateHalf` to left groove edge
- Right plate draws from right groove edge to `+plateHalf`
- Groove fill (weld pool) between plates

### 2. Reinforcement clamped to groove width (`renderer.js:252-254`, `304-306`)
- `leftX = Math.max(leftX, leftGP[0].x)` at face, `leftGP[leftGP.length-1].x` at root
- `rightX = Math.min(rightX, rightGP[0].x)` at face, `rightGP[rightGP.length-1].x` at root

### 3. Probe on real surface + rotated parallel to plate (`renderer.js:422-449`)
- `getBeamOrigin()` uses `getSurfaceYAt` (not `getNominalSurfaceY`)
- Probe drawn with `ctx.translate + ctx.rotate` — sits flush on tilted surface when `axisKink ≠ 0`
- Rotation angle: `atan(sin(kinkRad))` for `probeX > 0`

### 4. Axis kink signal fixed (`physics.js:516-539`)
- Old code relied on `rayIntersectStep` which fails for pure axis kink (no step at x=0)
- New code computes beam-x=0 intersection directly: `origin.x * dirX < 0` → crosses centerline
- Works for both left and right side probes

### 5. Step wall height fix (`physics.js` — `rayIntersectStep`)
- `getSurfaceYAt(..., 1)` instead of `getSurfaceYAt(..., 0)` — was always returning left face Y

### 6. Reinforcement detached from assembly defects (`physics.js:138-158`)
- `getReinforcementPoint/Normal` use `getNominalSurfaceY()` (not `getSurfaceYAt`)

### 7. Range changes
- Edge offset: −5..+5 mm
- Axis kink: −10..+10°

---

## 2026-05-26 — Создание монолитной standalone-версии

- Создан `Opencode SI.html` — монолитная версия (всё в одном файле)
- Начальный рефакторинг на модули (constants.js, physics.js, renderer.js, ui.js)
