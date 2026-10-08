// Hero background: a soft sky gradient (blue -> lavender -> pink -> warm peach, like a
// risograph print) drawn with WebGL. It slowly flows, has a fine grain, and the mouse
// stirs it like water: ripples spread out from the pointer and fade when it stops.
// Falls back to the CSS gradient on .hero when WebGL isn't available.

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAGMENT = `
precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;     // 0..1, top-left origin
uniform float stir;     // 0..1, how strongly the mouse moves the water right now

// Soft value noise for the slow flow
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
}

// The sky, top to bottom
vec3 sky(float y) {
    vec3 c0 = vec3(0.62, 0.68, 0.98);  // light periwinkle (enough for white text)
    vec3 c1 = vec3(0.74, 0.77, 0.99);  // pale blue
    vec3 c2 = vec3(0.87, 0.82, 0.97);  // milky lavender
    vec3 c3 = vec3(1.00, 0.82, 0.87);  // blush pink
    vec3 c4 = vec3(1.00, 0.76, 0.66);  // soft apricot band
    vec3 c5 = vec3(1.00, 0.95, 0.92);  // almost white
    vec3 c = mix(c0, c1, smoothstep(0.0, 0.3, y));
    c = mix(c, c2, smoothstep(0.28, 0.55, y));
    c = mix(c, c3, smoothstep(0.52, 0.72, y));
    c = mix(c, c4, smoothstep(0.72, 0.84, y));
    c = mix(c, c5, smoothstep(0.84, 1.0, y));
    return c;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv.y = 1.0 - uv.y;
    float aspect = resolution.x / resolution.y;

    // Slow drifting flow: the colour bands gently wave
    float t = time * 0.04;
    float flow = fbm(vec2(uv.x * 2.0 + t, uv.y * 3.0 - t * 0.6)) - 0.5;
    float y = uv.y + flow * 0.08;

    // Water ripples around the mouse
    vec2 d = (uv - mouse) * vec2(aspect, 1.0);
    float dist = length(d);
    float ripple = sin(dist * 38.0 - time * 4.0) * exp(-dist * 3.2) * stir;
    // the whole area around the pointer swells a little, like a drop in water
    float swell = exp(-dist * 4.0) * stir;
    y += ripple * 0.06 + swell * 0.04;
    float x = uv.x + ripple * 0.03;

    vec3 colour = sky(y);
    // a soft caustic shimmer on the ripples
    colour += ripple * 0.09 + swell * 0.05;
    // a little horizontal banding, like the print in the reference
    colour += (noise(vec2(x * 3.0, y * 60.0)) - 0.5) * 0.015;
    // grain
    colour += (hash(gl_FragCoord.xy + fract(time) * 100.0) - 0.5) * 0.06;

    gl_FragColor = vec4(colour, 1.0);
}
`;

export function initHeroWater() {
    const hero = document.getElementById("hero");
    const canvas = hero?.querySelector<HTMLCanvasElement>("[data-hero-water]");
    if (!hero || !canvas || canvas.dataset.ready) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return; // keeps the CSS gradient
    canvas.dataset.ready = "true";

    const compile = (type: number, source: string) => {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One triangle pair covering the screen
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const u = {
        resolution: gl.getUniformLocation(program, "resolution"),
        time: gl.getUniformLocation(program, "time"),
        mouse: gl.getUniformLocation(program, "mouse"),
        stir: gl.getUniformLocation(program, "stir"),
    };

    // Render at a lower resolution: the gradient is soft, and it keeps it light
    const SCALE = 0.5;
    const resize = () => {
        const { width, height } = hero.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(width * SCALE));
        canvas.height = Math.max(1, Math.round(height * SCALE));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(u.resolution, canvas.width, canvas.height);
    };
    new ResizeObserver(resize).observe(hero);
    resize();

    // Mouse: the ripple centre eases after the pointer; stirring fades when it stops
    const target = { x: 0.7, y: 0.5 };
    const current = { x: 0.7, y: 0.5 };
    let stir = 0;
    let stirTarget = 0;
    hero.addEventListener("pointermove", (event) => {
        const box = hero.getBoundingClientRect();
        target.x = (event.clientX - box.left) / box.width;
        target.y = (event.clientY - box.top) / box.height;
        stirTarget = 1;
    });
    hero.addEventListener("pointerleave", () => (stirTarget = 0));

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(hero);

    const start = performance.now();
    const frame = (now: number) => {
        current.x += (target.x - current.x) * 0.08;
        current.y += (target.y - current.y) * 0.08;
        stir += (stirTarget - stir) * 0.04;
        stirTarget *= 0.985; // ripples calm down when the mouse rests
        gl.uniform1f(u.time, (now - start) / 1000);
        gl.uniform2f(u.mouse, current.x, current.y);
        gl.uniform1f(u.stir, stir);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    if (reduceMotion) {
        frame(start); // one still frame
        return;
    }
    const loop = (now: number) => {
        if (visible && !document.hidden) frame(now);
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}
