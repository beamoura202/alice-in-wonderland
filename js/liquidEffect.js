let scene, camera, renderer;
let material, geometry, mesh;
let intensity = 0;
const maxScrollIntensity = 1.0;

const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('liquidCanvas'),
        antialias: true,
        alpha: true
    });
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load(document.getElementById('fundo-img2').src);
    
    material = new THREE.ShaderMaterial({
        uniforms: {
            uTexture: { value: texture },
            uTime: { value: 0 },
            uScrollIntensity: { value: 0 },
            uResolution: { value: new THREE.Vector2() }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D uTexture;
            uniform float uTime;
            uniform float uScrollIntensity;
            uniform vec2 uResolution;
            varying vec2 vUv;
            
            vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
            
            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy));
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod(i, 289.0);
                vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                    + i.x + vec3(0.0, i1.x, 1.0));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                    dot(x12.zw,x12.zw)), 0.0);
                m = m*m;
                m = m*m;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                vec3 g;
                g.x = a0.x * x0.x + h.x * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }
            
            void main() {
                vec2 uv = vUv;
                float time = uTime * 0.1; // Reduzido de 0.2 para 0.1
                
                // Reduzir força da distorção
                float distortionStrength = uScrollIntensity * 0.2; // Reduzido de 1.0 para 0.2
                
                // Reduzir valores de ondulação
                float noise1 = snoise(vec2(uv.x * 3.0 + time, uv.y * 2.0)) * distortionStrength;
                float noise2 = snoise(vec2(uv.y * 2.0 - time, uv.x * 3.0)) * distortionStrength;
                
                vec2 distortedUV = uv + vec2(noise1, noise2);
                distortedUV = clamp(distortedUV, 0.0, 1.0);
                
                vec4 texColor = texture2D(uTexture, distortedUV);
                gl_FragColor = texColor;
            }
        `
    });

    geometry = new THREE.PlaneGeometry(2, 2);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    window.addEventListener('resize', onResize);
    onResize();
    animate();
};

const onResize = () => {
    const { innerWidth, innerHeight } = window;
    renderer.setSize(innerWidth, innerHeight);
    material.uniforms.uResolution.value.set(innerWidth, innerHeight);
};

const animate = () => {
    requestAnimationFrame(animate);
    material.uniforms.uTime.value += 0.01;
    material.uniforms.uScrollIntensity.value = intensity;
    renderer.render(scene, camera);
};

// Initialize when document is loaded
window.addEventListener('DOMContentLoaded', init);

// Atualizar intensidade baseada na posição do scroll no container 2
window.addEventListener('scroll', () => {
    const container = document.getElementById('sticky-container-2');
    const rect = container.getBoundingClientRect();
    const containerHeight = container.offsetHeight;
    const scrollInContainer = -rect.top;
    
    // Calcular progresso do scroll no container (0 a 1)
    intensity = Math.max(0, Math.min(1, scrollInContainer / (containerHeight * 0.5))); // Aumentado para 0.5 para distorção mais gradual
});
