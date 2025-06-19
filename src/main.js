import * as THREE from 'three';
import { gsap } from 'gsap';
import { SceneManager } from './SceneManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { UIManager } from './UIManager.js';

class WatermarkelyApp {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.clock = new THREE.Clock();
    
    this.currentScene = 'nexus'; // nexus, workshop, export
    this.uploadedImage = null;
    this.watermarkText = '';
    this.watermarkOpacity = 0.5;
    
    this.init();
  }
  
  init() {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    
    // Setup camera
    this.camera.position.set(0, 0, 5);
    
    // Initialize managers
    this.sceneManager = new SceneManager(this.scene, this.camera, this.renderer);
    this.particleSystem = new ParticleSystem(this.scene);
    this.uiManager = new UIManager();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Start with nexus scene
    this.sceneManager.showNexusScene();
    
    // Start render loop
    this.animate();
  }
  
  setupEventListeners() {
    // Window resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Mouse movement for particles
    window.addEventListener('mousemove', (event) => this.onMouseMove(event));
    
    // File input
    document.getElementById('file-input').addEventListener('change', (event) => this.onFileUpload(event));
    
    // UI controls
    document.querySelector('#text-input input').addEventListener('input', (event) => {
      this.watermarkText = event.target.value;
      this.sceneManager.updateWatermark(this.watermarkText, this.watermarkOpacity);
    });
    
    document.getElementById('opacity-slider').addEventListener('input', (event) => {
      this.watermarkOpacity = event.target.value / 100;
      document.getElementById('opacity-value').textContent = event.target.value + '%';
      this.sceneManager.updateWatermark(this.watermarkText, this.watermarkOpacity);
    });
    
    document.getElementById('download-btn').addEventListener('click', () => this.downloadImage());
    
    // Canvas click for nexus interaction
    this.canvas.addEventListener('click', (event) => this.onCanvasClick(event));
  }
  
  onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update custom cursor
    const cursor = document.querySelector('.custom-cursor');
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY + 'px';
    
    // Update particle system
    this.particleSystem.updateMouse(mouseX, mouseY);
    
    // Update scene manager
    this.sceneManager.updateMouse(mouseX, mouseY);
  }
  
  onCanvasClick(event) {
    if (this.currentScene === 'nexus') {
      const rect = this.canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      
      const intersects = raycaster.intersectObjects(this.sceneManager.nexusInteractables);
      
      if (intersects.length > 0) {
        document.getElementById('file-input').click();
      }
    }
  }
  
  onFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedImage = e.target.result;
      this.transitionToWorkshop();
    };
    reader.readAsDataURL(file);
  }
  
  transitionToWorkshop() {
    this.currentScene = 'workshop';
    
    // Hide instructions
    document.getElementById('instructions').classList.add('hidden');
    
    // Animate particles to coalesce
    this.particleSystem.coalesce(() => {
      // Show the uploaded image
      this.sceneManager.showWorkshopScene(this.uploadedImage);
      
      // Show UI controls
      this.uiManager.showWorkshopUI();
      
      // Camera transition
      gsap.to(this.camera.position, {
        duration: 2,
        z: 3,
        ease: "power2.inOut"
      });
    });
  }
  
  transitionToExport() {
    this.currentScene = 'export';
    
    // Hide workshop UI
    this.uiManager.hideWorkshopUI();
    
    // Show export scene
    this.sceneManager.showExportScene();
    
    // Show download button
    this.uiManager.showExportUI();
    
    // Camera zoom
    gsap.to(this.camera.position, {
      duration: 1.5,
      z: 2,
      ease: "power2.inOut"
    });
  }
  
  downloadImage() {
    // Create a temporary canvas to render the final image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Get the image from scene manager
    const finalImage = this.sceneManager.getFinalImage();
    if (finalImage) {
      tempCanvas.width = finalImage.width;
      tempCanvas.height = finalImage.height;
      tempCtx.drawImage(finalImage, 0, 0);
      
      // Add watermark
      if (this.watermarkText) {
        tempCtx.globalAlpha = this.watermarkOpacity;
        tempCtx.fillStyle = 'white';
        tempCtx.font = '48px Arial';
        tempCtx.textAlign = 'center';
        tempCtx.fillText(this.watermarkText, tempCanvas.width / 2, tempCanvas.height / 2);
      }
      
      // Download
      const link = document.createElement('a');
      link.download = 'watermarked-image.png';
      link.href = tempCanvas.toDataURL();
      link.click();
      
      // Transition back to nexus
      setTimeout(() => this.transitionToNexus(), 1000);
    }
  }
  
  transitionToNexus() {
    this.currentScene = 'nexus';
    
    // Hide export UI
    this.uiManager.hideExportUI();
    
    // Camera transition back
    gsap.to(this.camera.position, {
      duration: 2,
      z: 5,
      ease: "power2.inOut"
    });
    
    // Dissolve image back to particles
    this.sceneManager.dissolveToParticles(() => {
      this.particleSystem.reset();
      this.sceneManager.showNexusScene();
      
      // Show instructions again
      document.getElementById('instructions').classList.remove('hidden');
      document.getElementById('instructions').textContent = 'Click the pulsating node to upload another image';
    });
    
    // Reset state
    this.uploadedImage = null;
    this.watermarkText = '';
    this.watermarkOpacity = 0.5;
    document.querySelector('#text-input input').value = '';
    document.getElementById('opacity-slider').value = 50;
    document.getElementById('opacity-value').textContent = '50%';
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    
    // Update systems
    this.particleSystem.update(deltaTime);
    this.sceneManager.update(deltaTime);
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize the app
new WatermarkelyApp();