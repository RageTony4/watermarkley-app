import * as THREE from 'three';
import { gsap } from 'gsap';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = null;
    this.particleCount = 2000;
    this.mouse = new THREE.Vector2();
    
    this.createParticles();
  }
  
  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Color
      color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.5 + Math.random() * 0.3);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Size
      sizes[i] = Math.random() * 3 + 1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2() }
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform vec2 mouse;
        
        void main() {
          vColor = color;
          
          vec3 pos = position;
          
          // Mouse interaction
          vec2 mouseDistance = mouse - pos.xy;
          float dist = length(mouseDistance);
          if (dist < 2.0) {
            pos.xy += normalize(mouseDistance) * (2.0 - dist) * 0.5;
          }
          
          // Floating animation
          pos.y += sin(time + position.x * 0.5) * 0.1;
          pos.x += cos(time + position.y * 0.3) * 0.05;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - (dist * 2.0);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    
    this.particleMaterial = material;
    this.particleGeometry = geometry;
  }
  
  updateMouse(x, y) {
    this.mouse.set(x, y);
    if (this.particleMaterial) {
      this.particleMaterial.uniforms.mouse.value.set(x * 5, y * 5);
    }
  }
  
  coalesce(callback) {
    const positions = this.particleGeometry.attributes.position.array;
    const targetPositions = new Float32Array(positions.length);
    
    // Create target positions forming an image shape
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      const angle = (i / this.particleCount) * Math.PI * 2;
      const radius = 1 + Math.random() * 0.5;
      
      targetPositions[i3] = Math.cos(angle) * radius;
      targetPositions[i3 + 1] = Math.sin(angle) * radius;
      targetPositions[i3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    
    // Animate particles to target positions
    gsap.to(positions, {
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        for (let i = 0; i < positions.length; i++) {
          positions[i] = THREE.MathUtils.lerp(positions[i], targetPositions[i], 0.02);
        }
        this.particleGeometry.attributes.position.needsUpdate = true;
      },
      onComplete: () => {
        // Hide particles
        this.particles.visible = false;
        if (callback) callback();
      }
    });
  }
  
  reset() {
    if (!this.particles) return;
    
    this.particles.visible = true;
    
    const positions = this.particleGeometry.attributes.position.array;
    
    // Reset to random positions
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    this.particleGeometry.attributes.position.needsUpdate = true;
  }
  
  update(deltaTime) {
    if (this.particleMaterial) {
      this.particleMaterial.uniforms.time.value += deltaTime;
    }
    
    if (this.particles && this.particles.visible) {
      this.particles.rotation.y += deltaTime * 0.1;
    }
  }
}