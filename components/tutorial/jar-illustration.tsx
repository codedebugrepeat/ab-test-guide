// Pre-computed, stable marble positions inside the jar (seeded RNG — never changes).

const N = 10;
const P = 0.2;

const JAR_W = 100;
const JAR_H = 155;
const MARBLE_R = 7;
const TOTAL_MARBLES = 48;

function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 4294967296;
    };
}

type JarMarble = { x: number; y: number; green: boolean };

function generateJarMarbles(): JarMarble[] {
    const rng = seededRandom(42);
    const marbles: JarMarble[] = [];
    const margin = MARBLE_R + 3;
    const rimH = 14;
    const xMin = 8 + margin;
    const xMax = JAR_W - 8 - margin;
    const yMin = rimH + margin;
    const yMax = JAR_H - margin - 2;
    let attempts = 0;
    while (marbles.length < TOTAL_MARBLES && attempts < 3000) {
        attempts++;
        const x = xMin + rng() * (xMax - xMin);
        const y = yMin + rng() * (yMax - yMin);
        if (marbles.every((m) => Math.hypot(m.x - x, m.y - y) > MARBLE_R * 2 + 1.5))
            marbles.push({ x, y, green: rng() < P });
    }
    return marbles;
}

const JAR_MARBLES = generateJarMarbles();

function jarShapePath(w: number, h: number): string {
    const rimH = 14;
    const topW = w - 10;
    const botW = w - 22;
    const topX = (w - topW) / 2;
    const botX = (w - botW) / 2;
    return `M ${topX} ${rimH} L ${topX + topW} ${rimH} L ${botX + botW} ${h - 4} Q ${w / 2} ${h + 2} ${botX} ${h - 4} Z`;
}

// ── Illustration sample configs ───────────────────────────────────────────────
const SAMPLE_CONFIGS: { greens: number[]; label: string }[] = [
    { greens: [3], label: "Sample 1" },
    { greens: [1, 6], label: "Sample 2" },
    { greens: [], label: "Sample 3" },
];

const MR = 6;
const MGAP = 3;
const MSTEP = MR * 2 + MGAP;
const ROW_YS = [32, 78, 124];
const OVAL_X = 148;
const OVAL_W = N * MSTEP - MGAP + 18;
const OVAL_H = 30;
const LABEL_X = OVAL_X + OVAL_W + 12;

// ── Component ─────────────────────────────────────────────────────────────────
export function JarIllustration() {
    const W = 460;
    const H = 160;
    const jarPath = jarShapePath(JAR_W, JAR_H);
    const rimH = 14;
    const topW = JAR_W - 10;
    const topX = (JAR_W - topW) / 2;
    const jarRight = JAR_W + 4;

    return (
        <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            style={{ display: "block", margin: "0 auto", overflow: "visible" }}
            aria-hidden="true"
        >
            <defs>
                <clipPath id="jar-clip">
                    <path d={jarPath} transform="translate(4,2)" />
                </clipPath>
                <marker id="jar-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="rgba(23,23,23,0.25)" />
                </marker>
            </defs>

            {/* ── Jar body ── */}
            <g transform="translate(4,2)">
                <path d={jarPath} fill="#f0f0ee" />
                <g clipPath="url(#jar-clip)">
                    {JAR_MARBLES.map((m, i) => (
                        <g key={i}>
                            <circle cx={m.x + 1} cy={m.y + 1.5} r={MARBLE_R} fill="rgba(0,0,0,0.07)" />
                            <circle cx={m.x} cy={m.y} r={MARBLE_R} fill={m.green ? "#16a34a" : "#d1d5db"} />
                            <circle
                                cx={m.x - 2} cy={m.y - 2} r={MARBLE_R * 0.35}
                                fill={m.green ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.65)"}
                            />
                        </g>
                    ))}
                </g>
                <path d={jarPath} fill="none" stroke="rgba(23,23,23,0.18)" strokeWidth="1.5" />
                <rect
                    x={topX - 2} y={0} width={topW + 4} height={rimH} rx={3}
                    fill="#e8e8e6" stroke="rgba(23,23,23,0.15)" strokeWidth="1.2"
                />
                <text
                    x={JAR_W / 2} y={rimH - 3} textAnchor="middle"
                    fontSize="8" fill="rgba(23,23,23,0.38)"
                    fontWeight="600" letterSpacing="0.1em"
                >
                    JAR
                </text>
            </g>

            {/* ── Dashed arrows from jar centre-right to each row ── */}
            {ROW_YS.map((ry, si) => (
                <path
                    key={si}
                    d={`M ${jarRight + 8} ${H / 2} C ${jarRight + 40} ${H / 2}, ${OVAL_X - 28} ${ry}, ${OVAL_X - 6} ${ry}`}
                    fill="none"
                    stroke="rgba(23,23,23,0.2)"
                    strokeWidth="1.2"
                    strokeDasharray="3 2"
                    markerEnd="url(#jar-arrow)"
                />
            ))}

            {/* ── Sample rows ── */}
            {SAMPLE_CONFIGS.map((s, si) => {
                const ry = ROW_YS[si];
                return (
                    <g key={si}>
                        {/* Dotted red oval */}
                        <ellipse
                            cx={OVAL_X + OVAL_W / 2} cy={ry}
                            rx={OVAL_W / 2 + 2} ry={OVAL_H / 2}
                            fill="rgba(239,68,68,0.04)"
                            stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3"
                        />
                        {/* Marbles */}
                        {Array.from({ length: N }, (_, mi) => {
                            const isGreen = s.greens.includes(mi);
                            const mx = OVAL_X + 9 + mi * MSTEP + MR;
                            return (
                                <g key={mi}>
                                    <circle cx={mx + 1} cy={ry + 1} r={MR} fill="rgba(0,0,0,0.06)" />
                                    <circle cx={mx} cy={ry} r={MR} fill={isGreen ? "#16a34a" : "#d1d5db"} />
                                    <circle
                                        cx={mx - 1.5} cy={ry - 1.5} r={MR * 0.35}
                                        fill={isGreen ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.65)"}
                                    />
                                </g>
                            );
                        })}
                        {/* Label */}
                        <text
                            x={LABEL_X} y={ry + 4}
                            fontSize="11" fill="rgba(23,23,23,0.45)" fontWeight="500"
                        >
                            {s.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
