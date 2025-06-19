import * as THREE from 'three';
import { gsap } from 'gsap';

export class SceneManager {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    
    this.nexusNode = null;
    this.nexusInteractables = [];
    this.imageQuad = null;
    this.watermarkMesh = null;
    this.satellites = [];
    
    this.mouse = new THREE.Vector2();
    this.originalImage = null;
    
    this.setupLighting();
    this.createNexusNode();
  }
  
  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    this.scene.add(directionalLight);
  }
  
  createNexusNode() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x667eea,
      transparent: true,
      opacity: 0.8,
      emissive: 0x221144
    });
    
    this.nexusNode = new THREE.Mesh(geometry, material);
    this.nexusNode.position.set(0, 0, 0);
    this.scene.add(this.nexusNode);
    this.nexusInteractables.push(this.nexusNode);
    
    // Pulsating animation
    gsap.to(this.nexusNode.scale, {
      duration: 2,
      x: 1.2,
      y: 1.2,
      z: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
  }
  
  showNexusScene() {
    if (this.nexusNode) {
      this.nexusNode.visible = true;
    }
    
    // Hide other scene elements
    if (this.imageQuad) this.imageQuad.visible = false;
    if (this.watermarkMesh) this.watermarkMesh.visible = false;
    this.satellites.forEach(satellite => satellite.visible = false);
  }
  
  showWorkshopScene(imageDataUrl) {
    // Hide nexus node
    if (this.nexusNode) {
      this.nexusNode.visible = false;
    }
    
    // Create image quad
    this.createImageQuad(imageDataUrl);
    
    // Create orbital satellites
    this.createSatellites();
  }
  
  createImageQuad(imageDataUrl) {
    const loader = new THREE.TextureLoader();
    loader.load(imageDataUrl, (texture) => {
      this.originalImage = texture.image;
      
      // Calculate aspect ratio
      const aspect = texture.image.width / texture.image.height;
      const width = aspect > 1 ? 3 : 3 * aspect;
      const height = aspect > 1 ? 3 / aspect : 3;
      
      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      
      if (this.imageQuad) {
        this.scene.remove(this.imageQuad);
      }
      
      this.imageQuad = new THREE.Mesh(geometry, material);
      this.imageQuad.position.set(0, 0, 0);
      this.scene.add(this.imageQuad);
      
      // Create watermark mesh
      this.createWatermarkMesh(width, height);
    });
  }
  
  createWatermarkMesh(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.5
    });
    
    if (this.watermarkMesh) {
      this.scene.remove(this.watermarkMesh);
    }
    
    this.watermarkMesh = new THREE.Mesh(geometry, material);
    this.watermarkMesh.position.set(0, 0, 0.01);
    this.scene.add(this.watermarkMesh);
    
    this.watermarkCanvas = canvas;
    this.watermarkCtx = ctx;
    this.watermarkTexture = texture;
  }
  
  createSatellites() {
    // Clear existing satellites
    this.satellites.forEach(satellite => this.scene.remove(satellite));
    this.satellites = [];
    
    // Create text satellite
    const textSatellite = this.createSatellite(0x4CAF50, 2.5, 0);
    this.satellites.push(textSatellite);
    
    // Create opacity satellite
    const opacitySatellite = this.createSatellite(0xFF9800, 2.5, Math.PI);
    this.satellites.push(opacitySatellite);
    
    // Create finalize satellite
    const finalizeSatellite = this.createSatellite(0x9C27B0, 2.5, Math.PI / 2);
    this.satellites.push(finalizeSatellite);
    
    // Animate satellites
    this.animateSatellites();
  }
  
  createSatellite(color, radius, angle) {
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      emissive: color,
      emissiveIntensity: 0.2
    });
    
    const satellite = new THREE.Mesh(geometry, material);
    satellite.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    );
    
    this.scene.add(satellite);
    return satellite;
  }
  
  animateSatellites() {
    this.satellites.forEach((satellite, index) => {
      const angle = (index * Math.PI * 2) / this.satellites.length;
      const radius = 2.5;
      
      gsap.to(satellite.position, {
        duration: 10,
        repeat: -1,
        ease: "none",
        motionPath: {
          path: `M${Math.cos(angle) * radius},${Math.sin(angle) * radius} 
                 A${radius},${radius} 0 1,1 ${Math.cos(angle + Math.PI * 2) * radius},${Math.sin(angle + Math.PI * 2) * radius}`,
          autoRotate: false
        }
      });
      
      gsap.to(satellite.rotation, {
        duration: 2,
        repeat: -1,
        x: Math.PI * 2,
        y: Math.PI * 2,
        ease: "none"
      });
    });
  }
  
  updateWatermark(text, opacity) {
    if (!this.watermarkCanvas || !this.watermarkCtx) return;
    
    const ctx = this.watermarkCtx;
    const canvas = this.watermarkCanvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (text) {
      ctx.fillStyle = 'white';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }
    
    this.watermarkTexture.needsUpdate = true;
    
    if (this.watermarkMesh) {
      this.watermarkMesh.material.opacity = opacity;
    }
  }
  
  showExportScene() {
    // Add shimmer effect to image
    if (this.imageQuad) {
      const shimmerMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          texture: { value: this.imageQuad.material.map }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform sampler2D texture;
          varying vec2 vUv;
          
          void main() {
            vec4 color = texture2D(texture, vUv);
            float shimmer = sin(vUv.x * 10.0 + time * 5.0) * 0.1 + 0.9;
            gl_FragColor = vec4(color.rgb * shimmer, color.a);
          }
        `
      });
      
      this.imageQuad.material = shimmerMaterial;
      this.shimmerMaterial = shimmerMaterial;
    }
  }
  
  getFinalImage() {
    return this.originalImage;
  }
  
  dissolveToParticles(callback) {
    if (this.imageQuad) {
      gsap.to(this.imageQuad.material, {
        duration: 1.5,
        opacity: 0,
        onComplete: callback
      });
    }
    
    if (this.watermarkMesh) {
      gsap.to(this.watermarkMesh.material, {
        duration: 1.5,
        opacity: 0
      });
    }
  }
  
  updateMouse(x, y) {
    this.mouse.set(x, y);
    
    // Make nexus node react to mouse
    if (this.nexusNode && this.nexusNode.visible) {
      const distance = this.mouse.length();
      const intensity = Math.max(0, 1 - distance);
      this.nexusNode.material.emissiveIntensity = 0.2 + intensity * 0.3;
    }
  }
  
  update(deltaTime) {
    // Update shimmer effect
    if (this.shimmerMaterial) {
      this.shimmerMaterial.uniforms.time.value += deltaTime;
    }
    
    // Rotate nexus node
    if (this.nexusNode && this.nexusNode.visible) {
      this.nexusNode.rotation.y += deltaTime * 0.5;
      this.nexusNode.rotation.x += deltaTime * 0.3;
    }
  }
}