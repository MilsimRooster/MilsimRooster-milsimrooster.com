const FT_TO_M = 0.3048;
        const M_TO_FT = 3.280839895;
        const G = 9.80665;
        const AIR_DENSITY = 1.225;
        const BB_DIAMETER_M = 0.006;
        const BB_AREA_M2 = Math.PI * Math.pow(BB_DIAMETER_M / 2, 2);
        const DT = 0.002;
        const MAX_TIME = 8;

        const els = {
            fps: document.getElementById("fps"),
            fpsNumber: document.getElementById("fpsNumber"),
            fpsOut: document.getElementById("fpsOut"),
            weight: document.getElementById("weight"),
            weightNumber: document.getElementById("weightNumber"),
            weightOut: document.getElementById("weightOut"),
            angle: document.getElementById("angle"),
            angleOut: document.getElementById("angleOut"),
            hop: document.getElementById("hop"),
            hopOut: document.getElementById("hopOut"),
            target: document.getElementById("target"),
            targetOut: document.getElementById("targetOut"),
            drag: document.getElementById("drag"),
            dragOut: document.getElementById("dragOut"),
            impactEnergy: document.getElementById("impactEnergy"),
            impactOut: document.getElementById("impactOut"),
            status: document.getElementById("modelStatus"),
            muzzleEnergy: document.getElementById("muzzleEnergy"),
            energyClass: document.getElementById("energyClass"),
            maxRange: document.getElementById("maxRange"),
            usefulRange: document.getElementById("usefulRange"),
            usefulText: document.getElementById("usefulText"),
            targetEnergy: document.getElementById("targetEnergy"),
            targetText: document.getElementById("targetText"),
            rangeRows: document.getElementById("rangeRows"),
            canvas: document.getElementById("trajectory")
        };

        const ctx = els.canvas.getContext("2d");

        function clamp(value, min, max) {
            return Math.min(max, Math.max(min, value));
        }

        function kgFromGrams(grams) {
            return grams / 1000;
        }

        function metersPerSecondFromFps(fps) {
            return fps * FT_TO_M;
        }

        function fpsFromMetersPerSecond(ms) {
            return ms * M_TO_FT;
        }

        function joulesFromFps(fps, grams) {
            const massKg = kgFromGrams(grams);
            const velocity = metersPerSecondFromFps(fps);
            return 0.5 * massKg * velocity * velocity;
        }

        function fpsForJoules(joules, grams) {
            const massKg = kgFromGrams(grams);
            return fpsFromMetersPerSecond(Math.sqrt((2 * joules) / massKg));
        }

        function energyFromSpeed(speedMS, grams) {
            const massKg = kgFromGrams(grams);
            return 0.5 * massKg * speedMS * speedMS;
        }

        function interpolate(a, b, distanceM) {
            if (!a || !b || b.x === a.x) return a || b;
            const t = (distanceM - a.x) / (b.x - a.x);
            return {
                x: distanceM,
                y: a.y + (b.y - a.y) * t,
                speed: a.speed + (b.speed - a.speed) * t,
                energy: a.energy + (b.energy - a.energy) * t,
                time: a.time + (b.time - a.time) * t
            };
        }

        function sampleAt(points, distanceFt) {
            const distanceM = distanceFt * FT_TO_M;
            if (distanceM <= 0) return points[0];
            for (let i = 1; i < points.length; i++) {
                if (points[i].x >= distanceM) {
                    return interpolate(points[i - 1], points[i], distanceM);
                }
            }
            return null;
        }

        function findRangeAtEnergy(points, minimumEnergy) {
            for (let i = 1; i < points.length; i++) {
                if (points[i].energy <= minimumEnergy) {
                    const prev = points[i - 1];
                    const cur = points[i];
                    const span = prev.energy - cur.energy;
                    const t = span === 0 ? 0 : (prev.energy - minimumEnergy) / span;
                    return (prev.x + (cur.x - prev.x) * t) * M_TO_FT;
                }
            }
            return points[points.length - 1].x * M_TO_FT;
        }

        function simulate(input) {
            const massKg = kgFromGrams(input.weight);
            const speed0 = metersPerSecondFromFps(input.fps);
            const angleRad = input.angle * Math.PI / 180;
            const effectiveG = G * (1 - input.hop / 100);
            const dragK = 0.5 * AIR_DENSITY * input.drag * BB_AREA_M2 / massKg;

            let x = 0;
            let y = 1.4;
            let vx = speed0 * Math.cos(angleRad);
            let vy = speed0 * Math.sin(angleRad);
            let time = 0;
            const points = [];

            while (time <= MAX_TIME && y >= 0 && x <= 220) {
                const speed = Math.hypot(vx, vy);
                points.push({
                    x,
                    y,
                    speed,
                    energy: energyFromSpeed(speed, input.weight),
                    time
                });

                const ax = -dragK * speed * vx;
                const ay = -effectiveG - dragK * speed * vy;
                vx += ax * DT;
                vy += ay * DT;
                x += vx * DT;
                y += vy * DT;
                time += DT;

                if (speed < 1) break;
            }

            if (points.length > 1 && y < 0) {
                const prev = points[points.length - 1];
                const speed = Math.hypot(vx, vy);
                points.push({
                    x,
                    y,
                    speed,
                    energy: energyFromSpeed(speed, input.weight),
                    time
                });
                const ground = interpolate(prev, points[points.length - 1], prev.x + (0 - prev.y) * (x - prev.x) / (y - prev.y));
                ground.y = 0;
                points[points.length - 1] = ground;
            }

            return points;
        }

        function getInput() {
            return {
                fps: Number(els.fps.value),
                weight: Number(els.weight.value),
                angle: Number(els.angle.value),
                hop: Number(els.hop.value),
                target: Number(els.target.value),
                drag: Number(els.drag.value),
                impactEnergy: Number(els.impactEnergy.value)
            };
        }

        function setOutputs(input) {
            els.fpsOut.textContent = `${input.fps.toFixed(0)} fps`;
            els.fpsNumber.value = input.fps.toFixed(0);
            els.weightOut.textContent = `${input.weight.toFixed(2)} g`;
            els.weightNumber.value = input.weight.toFixed(2);
            els.angleOut.textContent = `${input.angle.toFixed(1)} deg`;
            els.hopOut.textContent = `${input.hop.toFixed(0)}%`;
            els.targetOut.textContent = `${input.target.toFixed(0)} ft`;
            els.dragOut.textContent = input.drag.toFixed(2);
            els.impactOut.textContent = `${input.impactEnergy.toFixed(2)} J`;
        }

        function drawChart(points, input, usefulRangeFt) {
            const c = els.canvas;
            const width = c.width;
            const height = c.height;
            const pad = { left: 58, right: 22, top: 28, bottom: 48 };
            const plotW = width - pad.left - pad.right;
            const plotH = height - pad.top - pad.bottom;
            const maxX = Math.max(100, Math.ceil(points[points.length - 1].x * M_TO_FT / 25) * 25);
            const maxY = Math.max(20, Math.ceil(Math.max(...points.map(p => p.y * M_TO_FT)) / 10) * 10);

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "#fbfcfa";
            ctx.fillRect(0, 0, width, height);

            function px(xFt) {
                return pad.left + (xFt / maxX) * plotW;
            }

            function py(yFt) {
                return pad.top + plotH - (yFt / maxY) * plotH;
            }

            ctx.strokeStyle = "#d8ded6";
            ctx.lineWidth = 1;
            ctx.fillStyle = "#5d6962";
            ctx.font = "13px Arial";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";

            const xStep = maxX <= 150 ? 25 : 50;
            for (let x = 0; x <= maxX; x += xStep) {
                const xPos = px(x);
                ctx.beginPath();
                ctx.moveTo(xPos, pad.top);
                ctx.lineTo(xPos, pad.top + plotH);
                ctx.stroke();
                ctx.fillText(String(x), xPos + 8, pad.top + plotH + 24);
            }

            for (let y = 0; y <= maxY; y += 10) {
                const yPos = py(y);
                ctx.beginPath();
                ctx.moveTo(pad.left, yPos);
                ctx.lineTo(pad.left + plotW, yPos);
                ctx.stroke();
                ctx.fillText(String(y), pad.left - 10, yPos);
            }

            ctx.strokeStyle = "#1d6f63";
            ctx.lineWidth = 3;
            ctx.beginPath();
            points.forEach((p, index) => {
                const xFt = p.x * M_TO_FT;
                const yFt = Math.max(0, p.y * M_TO_FT);
                if (index === 0) ctx.moveTo(px(xFt), py(yFt));
                else ctx.lineTo(px(xFt), py(yFt));
            });
            ctx.stroke();

            const targetPoint = sampleAt(points, input.target);
            if (targetPoint) {
                drawMarker(input.target, Math.max(0, targetPoint.y * M_TO_FT), "#c0582a", "target");
            }
            drawVertical(usefulRangeFt, "#1d6f63", "useful");

            ctx.fillStyle = "#18211d";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Distance (ft)", pad.left + plotW / 2, height - 12);
            ctx.save();
            ctx.translate(18, pad.top + plotH / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText("Height above ground (ft)", 0, 0);
            ctx.restore();

            function drawMarker(xFt, yFt, color, label) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(px(xFt), py(yFt), 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.font = "13px Arial";
                ctx.textAlign = "left";
                ctx.fillText(label, px(xFt) + 9, py(yFt) - 9);
            }

            function drawVertical(xFt, color, label) {
                const xPos = px(clamp(xFt, 0, maxX));
                ctx.strokeStyle = color;
                ctx.setLineDash([6, 5]);
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(xPos, pad.top);
                ctx.lineTo(xPos, pad.top + plotH);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = color;
                ctx.font = "13px Arial";
                ctx.textAlign = "left";
                ctx.fillText(label, xPos + 8, pad.top + 18);
            }
        }

        function renderRows(points, input) {
            const distances = [50, 100, 150, 200, 250, 300].filter(d => d <= Math.max(300, input.target));
            els.rangeRows.innerHTML = distances.map(distance => {
                const point = sampleAt(points, distance);
                if (!point) {
                    return `<tr><td>${distance} ft</td><td colspan="4">past estimated flight path</td></tr>`;
                }
                const speedFps = fpsFromMetersPerSecond(point.speed);
                const dropFt = (1.4 - point.y) * M_TO_FT;
                return `<tr>
                    <td>${distance} ft</td>
                    <td>${speedFps.toFixed(0)} fps</td>
                    <td>${point.energy.toFixed(2)} J</td>
                    <td>${dropFt.toFixed(1)} ft</td>
                    <td>${point.time.toFixed(2)} s</td>
                </tr>`;
            }).join("");
        }

        function classifyEnergy(joules, weight) {
            const oneJouleFps = fpsForJoules(1, weight);
            if (joules < 0.8) return `Below 0.80 J. 1.00 J at this weight is ${oneJouleFps.toFixed(0)} fps.`;
            if (joules <= 1.5) return `Typical field-check territory. 1.00 J at this weight is ${oneJouleFps.toFixed(0)} fps.`;
            return `High energy setup. 1.00 J at this weight is ${oneJouleFps.toFixed(0)} fps.`;
        }

        function update() {
            const input = getInput();
            setOutputs(input);
            const points = simulate(input);
            const muzzleEnergy = joulesFromFps(input.fps, input.weight);
            const maxRangeFt = points[points.length - 1].x * M_TO_FT;
            const usefulRangeFt = findRangeAtEnergy(points, input.impactEnergy);
            const targetPoint = sampleAt(points, input.target);

            els.muzzleEnergy.textContent = `${muzzleEnergy.toFixed(2)} J`;
            els.energyClass.textContent = classifyEnergy(muzzleEnergy, input.weight);
            els.maxRange.textContent = `${maxRangeFt.toFixed(0)} ft`;
            els.usefulRange.textContent = `${usefulRangeFt.toFixed(0)} ft`;
            els.usefulText.textContent = `Until impact energy falls below ${input.impactEnergy.toFixed(2)} J.`;

            if (targetPoint) {
                const speedFps = fpsFromMetersPerSecond(targetPoint.speed);
                const dropFt = (1.4 - targetPoint.y) * M_TO_FT;
                els.targetEnergy.textContent = `${targetPoint.energy.toFixed(2)} J`;
                els.targetText.textContent = `${speedFps.toFixed(0)} fps, ${dropFt.toFixed(1)} ft drop, ${targetPoint.time.toFixed(2)} s flight.`;
            } else {
                els.targetEnergy.textContent = "Out";
                els.targetText.textContent = "Target is beyond the estimated flight path.";
            }

            els.status.textContent = `6 mm BB, Cd ${input.drag.toFixed(2)}, air density ${AIR_DENSITY} kg/m3`;
            drawChart(points, input, usefulRangeFt);
            renderRows(points, input);
        }

        function connectRangeAndNumber(range, number, min, max) {
            range.addEventListener("input", update);
            number.addEventListener("input", () => {
                const value = clamp(Number(number.value), min, max);
                if (Number.isFinite(value)) {
                    range.value = value;
                    update();
                }
            });
        }

        connectRangeAndNumber(els.fps, els.fpsNumber, 120, 650);
        connectRangeAndNumber(els.weight, els.weightNumber, 0.12, 0.50);
        [els.angle, els.hop, els.target, els.drag, els.impactEnergy].forEach(el => {
            el.addEventListener("input", update);
        });

        update();
