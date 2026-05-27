const SKILL_COLORS = {
  C: 0x4cc9f0,
  "C++": 0x4cc9f0,
  Java: 0xf4d35e,
  HTML: 0xe55934,
  CSS: 0x4cc9f0,
  JavaScript: 0xf4d35e,
  MySQL: 0x4cc9f0,
  PHP: 0x8993be,
  "Node.js": 0x68a063,
  Express: 0xf4d35e,
  "Express.js": 0xa0c4ff,
  JWT: 0xff7eb6,
  PostgreSQL: 0x336791,
  EJS: 0xa91e22,
  "React.js": 0x61dafb,
  MongoDB: 0x4dbb78,
  "Next.js": 0xffffff,
  "Redux.js": 0x764abc,
  Supabase: 0x3ecf8e,
  TypeScript: 0x3178c6,
  Playwright: 0x2ead33,
  Prisma: 0x4c51bf,
  "Power Apps": 0x742774,
  "Power Automate": 0x0066ff,
  Dataverse: 0x0078d4,
  "Model-Driven Apps": 0x4cc9f0,
  "Canvas Apps": 0xf4d35e,
  "System Design": 0x4cc9f0,
  "System Architecture": 0xf4d35e,
  "Cloud Computing": 0x80d0ff,
  Docker: 0x2496ed,
  Kubernetes: 0x326ce5,
  DevOps: 0xff9966,
  "Virtual Machine": 0xb39ddb,
};

export function colorForSkill(name) {
  return SKILL_COLORS[name] || 0x4cc9f0;
}

export function drawSkillConstellation(scene, skills, x, y, width, opts = {}) {
  const cols = opts.cols ?? 6;
  const radius = opts.radius ?? 10;
  const spacingX = width / cols;
  const spacingY = opts.spacingY ?? 44;
  const objs = [];
  skills.forEach((skill, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const cx = x + col * spacingX + spacingX / 2;
    const cy = y + row * spacingY;
    const color = colorForSkill(skill);

    const halo = scene.add.circle(cx, cy, radius + 3, color, 0.25);
    const dot = scene.add.circle(cx, cy, radius, color, 1).setStrokeStyle(1, 0xffffff, 0.6);
    const label = scene.add
      .text(cx, cy + radius + 12, skill, {
        fontFamily: "monospace",
        fontSize: "9px",
        color: "#cbd5e0",
        align: "center",
        wordWrap: { width: spacingX - 6 },
      })
      .setOrigin(0.5, 0);

    scene.tweens.add({
      targets: halo,
      alpha: 0.5,
      scale: 1.15,
      duration: 900 + (i % 5) * 80,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    objs.push(halo, dot, label);
  });
  return objs;
}
