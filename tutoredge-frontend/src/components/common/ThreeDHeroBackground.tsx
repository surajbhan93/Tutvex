import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

const PERIODIC_ELEMENTS = [
  { symbol: 'Math', name: 'Mathematics', details: 'Class 6-12 · JEE', col: 1, row: 1 },
  { symbol: 'Phy', name: 'Physics', details: 'Class 9-12 · NEET', col: 18, row: 1 },
  { symbol: 'Chem', name: 'Chemistry', details: 'Class 9-12 · Organic', col: 1, row: 2 },
  { symbol: 'Bio', name: 'Biology', details: 'Class 9-12 · Botany', col: 2, row: 2 },
  { symbol: 'Eng', name: 'English', details: 'Spoken · Grammar', col: 13, row: 2 },
  { symbol: 'NDA', name: 'NDA Exam', details: 'Maths & GAT Prep', col: 14, row: 2 },
  { symbol: 'NEET', name: 'NEET UG', details: 'Bio & Chemistry', col: 15, row: 2 },
  { symbol: 'JEE', name: 'JEE Main', details: 'Maths & Physics', col: 16, row: 2 },
  { symbol: 'C10', name: 'Class 10', details: 'All Subjects · CBSE', col: 17, row: 2 },
  { symbol: 'C12', name: 'Class 12', details: 'PCM / PCB / Commerce', col: 18, row: 2 },
  { symbol: 'Prg', name: 'Prayagraj', details: 'Civil Lines · Katra', col: 1, row: 3 },
  { symbol: 'Lkn', name: 'Lucknow', details: 'Gomti Nagar · Aliganj', col: 2, row: 3 },
  { symbol: 'Vns', name: 'Varanasi', details: 'Lanka · Bhelupur', col: 13, row: 3 },
  { symbol: 'Knp', name: 'Kanpur', details: 'Swaroop Nagar', col: 14, row: 3 },
  { symbol: 'Del', name: 'Delhi NCR', details: 'Noida · South Del', col: 15, row: 3 },
  { symbol: 'C8', name: 'Class 8', details: 'Foundation · All Sub', col: 16, row: 3 },
  { symbol: 'Sci', name: 'Science', details: 'Physics & Chem', col: 17, row: 3 },
  { symbol: 'Sst', name: 'Social Sci', details: 'History & Civics', col: 18, row: 3 },
  { symbol: 'Hindi', name: 'Hindi Lit', details: 'Vyakaran & Sahitya', col: 1, row: 4 },
  { symbol: 'Comp', name: 'Computer', details: 'Python · C++ · Java', col: 2, row: 4 },
  { symbol: 'Acc', name: 'Accounts', details: 'Class 11-12 · CA', col: 3, row: 4 },
  { symbol: 'Eco', name: 'Economics', details: 'Micro & Macro', col: 4, row: 4 },
  { symbol: 'Bst', name: 'Business', details: 'Class 11 & 12', col: 5, row: 4 },
  { symbol: 'Home', name: 'Home Tutor', details: '1-to-1 Personal', col: 6, row: 4 },
  { symbol: 'Online', name: 'Online Class', details: 'Live Interactive', col: 7, row: 4 },
  { symbol: 'CBSE', name: 'CBSE Board', details: 'NCERT Curriculum', col: 8, row: 4 },
  { symbol: 'ICSE', name: 'ICSE Board', details: 'CISCE Syllabus', col: 9, row: 4 },
  { symbol: 'UPB', name: 'UP Board', details: 'State Syllabus', col: 10, row: 4 },
  { symbol: 'CUET', name: 'CUET UG', details: 'General Test', col: 11, row: 4 },
  { symbol: 'SSC', name: 'SSC Exam', details: 'Reasoning & Quant', col: 12, row: 4 },
  { symbol: 'Bank', name: 'Bank PO', details: 'Aptitude & English', col: 13, row: 4 },
  { symbol: 'Cat', name: 'CAT / MBA', details: 'Quant & DILR', col: 14, row: 4 },
  { symbol: 'French', name: 'French', details: 'Foreign Language', col: 15, row: 4 },
  { symbol: 'German', name: 'German', details: 'A1-B2 Proficiency', col: 16, row: 4 },
  { symbol: 'Music', name: 'Music & Arts', details: 'Vocal & Instrument', col: 17, row: 4 },
  { symbol: 'Yoga', name: 'Fitness', details: 'Personal Trainer', col: 18, row: 4 },
];

export default function ThreeDHeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layoutMode, setLayoutMode] = useState<'sphere' | 'helix' | 'table' | 'grid'>('sphere');

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
    camera.position.z = 2400;

    // 2. CSS3D Renderer Setup
    const renderer = new CSS3DRenderer();
    renderer.setSize(width, height);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none'; // Keep buttons underneath clickable
    container.appendChild(renderer.domElement);

    const objects: CSS3DObject[] = [];
    const targets: { table: THREE.Object3D[]; sphere: THREE.Object3D[]; helix: THREE.Object3D[]; grid: THREE.Object3D[] } = {
      table: [],
      sphere: [],
      helix: [],
      grid: [],
    };

    // 3. Create Element Nodes
    PERIODIC_ELEMENTS.forEach((item, i) => {
      const element = document.createElement('div');
      element.className = 'element-card';
      element.style.width = '120px';
      element.style.height = '140px';
      element.style.boxShadow = '0px 0px 16px rgba(99, 102, 241, 0.4)';
      element.style.border = '1px solid rgba(129, 140, 248, 0.35)';
      element.style.borderRadius = '14px';
      element.style.backgroundColor = `rgba(15, 23, 42, ${Math.random() * 0.4 + 0.45})`;
      element.style.backdropFilter = 'blur(4px)';
      element.style.textAlign = 'center';
      element.style.fontFamily = 'sans-serif';
      element.style.position = 'relative';
      element.style.transition = 'all 0.3s ease';

      const number = document.createElement('div');
      number.style.position = 'absolute';
      number.style.top = '10px';
      number.style.right = '12px';
      number.style.fontSize = '10px';
      number.style.fontWeight = 'bold';
      number.style.color = 'rgba(165, 180, 252, 0.8)';
      number.textContent = (i + 1).toString();
      element.appendChild(number);

      const symbol = document.createElement('div');
      symbol.style.position = 'absolute';
      symbol.style.top = '28px';
      symbol.style.left = '0';
      symbol.style.right = '0';
      symbol.style.fontSize = '24px';
      symbol.style.fontWeight = '800';
      symbol.style.color = '#ffffff';
      symbol.style.textShadow = '0 0 12px rgba(129, 140, 248, 0.9)';
      symbol.textContent = item.symbol;
      element.appendChild(symbol);

      const details = document.createElement('div');
      details.style.position = 'absolute';
      details.style.bottom = '12px';
      details.style.left = '6px';
      details.style.right = '6px';
      details.style.fontSize = '10px';
      details.style.color = 'rgba(224, 231, 255, 0.85)';
      details.style.lineHeight = '1.2';
      details.innerHTML = `<strong>${item.name}</strong><br/>${item.details}`;
      element.appendChild(details);

      const objectCSS = new CSS3DObject(element);
      objectCSS.position.x = Math.random() * 3000 - 1500;
      objectCSS.position.y = Math.random() * 3000 - 1500;
      objectCSS.position.z = Math.random() * 3000 - 1500;
      scene.add(objectCSS);
      objects.push(objectCSS);

      // Target Layout: Periodic Table
      const objTable = new THREE.Object3D();
      objTable.position.x = item.col * 140 - 1330;
      objTable.position.y = -(item.row * 160) + 500;
      targets.table.push(objTable);
    });

    const vector = new THREE.Vector3();
    const l = objects.length;

    // Target Layout: Sphere
    for (let i = 0; i < l; i++) {
      const phi = Math.acos(-1 + (2 * i) / l);
      const theta = Math.sqrt(l * Math.PI) * phi;
      const object = new THREE.Object3D();
      object.position.setFromSphericalCoords(750, phi, theta);
      vector.copy(object.position).multiplyScalar(2);
      object.lookAt(vector);
      targets.sphere.push(object);
    }

    // Target Layout: Helix
    for (let i = 0; i < l; i++) {
      const theta = i * 0.22 + Math.PI;
      const y = -(i * 14) + 250;
      const object = new THREE.Object3D();
      object.position.setFromCylindricalCoords(850, theta, y);
      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;
      object.lookAt(vector);
      targets.helix.push(object);
    }

    // Target Layout: Grid
    for (let i = 0; i < l; i++) {
      const object = new THREE.Object3D();
      object.position.x = (i % 6) * 260 - 650;
      object.position.y = -Math.floor((i / 6) % 3) * 220 + 200;
      object.position.z = Math.floor(i / 18) * 450 - 800;
      targets.grid.push(object);
    }

    // 4. Animation Transform Helper
    let animationFrameId: number;

    const transform = (targetList: THREE.Object3D[]) => {
      objects.forEach((obj, i) => {
        const target = targetList[i];
        if (target) {
          obj.position.x += (target.position.x - obj.position.x) * 0.08;
          obj.position.y += (target.position.y - obj.position.y) * 0.08;
          obj.position.z += (target.position.z - obj.position.z) * 0.08;
          obj.rotation.x += (target.rotation.x - obj.rotation.x) * 0.08;
          obj.rotation.y += (target.rotation.y - obj.rotation.y) * 0.08;
          obj.rotation.z += (target.rotation.z - obj.rotation.z) * 0.08;
        }
      });
    };

    // 5. Mouse Interaction & Continuous Rotation
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.3;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Main Render Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow 3D scene rotation
      scene.rotation.y += 0.0025;
      scene.rotation.x += (mouseY * 0.0003 - scene.rotation.x) * 0.05;

      const currentTargets = targets[layoutMode] || targets.sphere;
      transform(currentTargets);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [layoutMode]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Mode Controls Bar */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-indigo-500/30 text-xs shadow-lg">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 px-2">3D View:</span>
        {(['sphere', 'helix', 'table', 'grid'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setLayoutMode(mode)}
            className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
              layoutMode === mode
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
