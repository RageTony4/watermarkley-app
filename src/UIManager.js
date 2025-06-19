import { gsap } from 'gsap';

export class UIManager {
  constructor() {
    this.textInput = document.getElementById('text-input');
    this.opacityControl = document.getElementById('opacity-control');
    this.downloadBtn = document.getElementById('download-btn');
  }
  
  showWorkshopUI() {
    gsap.to(this.textInput, {
      duration: 0.8,
      opacity: 1,
      scale: 1,
      ease: "back.out(1.7)",
      delay: 0.2
    });
    
    gsap.to(this.opacityControl, {
      duration: 0.8,
      opacity: 1,
      scale: 1,
      ease: "back.out(1.7)",
      delay: 0.4
    });
    
    this.textInput.classList.add('visible');
    this.opacityControl.classList.add('visible');
  }
  
  hideWorkshopUI() {
    gsap.to([this.textInput, this.opacityControl], {
      duration: 0.5,
      opacity: 0,
      scale: 0.8,
      ease: "power2.in"
    });
    
    setTimeout(() => {
      this.textInput.classList.remove('visible');
      this.opacityControl.classList.remove('visible');
    }, 500);
  }
  
  showExportUI() {
    gsap.to(this.downloadBtn, {
      duration: 0.8,
      opacity: 1,
      scale: 1,
      ease: "back.out(1.7)",
      delay: 0.5
    });
    
    this.downloadBtn.classList.add('visible');
  }
  
  hideExportUI() {
    gsap.to(this.downloadBtn, {
      duration: 0.5,
      opacity: 0,
      scale: 0.8,
      ease: "power2.in"
    });
    
    setTimeout(() => {
      this.downloadBtn.classList.remove('visible');
    }, 500);
  }
}