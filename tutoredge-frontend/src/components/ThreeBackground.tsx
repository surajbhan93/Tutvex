import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Education-themed elements (subjects, classes, etc.)
const educationElements = [
  // Core Subjects
  { symbol: 'M', name: 'Mathematics', color: '#4F46E5', group: 'Sciences' },
  { symbol: 'P', name: 'Physics', color: '#7C3AED', group: 'Sciences' },
  { symbol: 'C', name: 'Chemistry', color: '#EC4899', group: 'Sciences' },
  { symbol: 'B', name: 'Biology', color: '#10B981', group: 'Sciences' },
  { symbol: 'CS', name: 'Computer Sci', color: '#3B82F6', group: 'Tech' },
  { symbol: 'E', name: 'English', color: '#F59E0B', group: 'Languages' },
  { symbol: 'H', name: 'Hindi', color: '#EF4444', group: 'Languages' },
  { symbol: 'S', name: 'Sanskrit', color: '#F97316', group: 'Languages' },
  { symbol: 'SS', name: 'Social Science', color: '#8B5CF6', group: 'Humanities' },
  { symbol: 'Ec', name: 'Economics', color: '#14B8A6', group: 'Commerce' },
  { symbol: 'Ac', name: 'Accounts', color: '#06B6D4', group: 'Commerce' },
  { symbol: 'BS', name: 'Business', color: '#6366F1', group: 'Commerce' },
  
  // Classes
  { symbol: '1', name: 'Class 1', color: '#FF6B6B', group: 'Primary' },
  { symbol: '2', name: 'Class 2', color: '#4ECDC4', group: 'Primary' },
  { symbol: '3', name: 'Class 3', color: '#45B7D1', group: 'Primary' },
  { symbol: '4', name: 'Class 4', color: '#FFA07A', group: 'Primary' },
  { symbol: '5', name: 'Class 5', color: '#98D8C8', group: 'Primary' },
  { symbol: '6', name: 'Class 6', color: '#F7DC6F', group: 'Middle' },
  { symbol: '7', name: 'Class 7', color: '#BB8FCE', group: 'Middle' },
  { symbol: '8', name: 'Class 8', color: '#85C1E2', group: 'Middle' },
  { symbol: '9', name: 'Class 9', color: '#F8B739', group: 'Secondary' },
  { symbol: '10', name: 'Class 10', color: '#52B788', group: 'Secondary' },
  { symbol: '11', name: 'Class 11', color: '#E63946', group: 'Senior' },
  { symbol: '12', name: 'Class 12', color: '#457B9D', group: 'Senior' },
  
  // Exam Prep
  { symbol: 'JEE', name: 'JEE Prep', color: '#D90429', group: 'Competitive' },
  { symbol: 'NET', name: 'NEET Prep', color: '#2A9D8F', group: 'Competitive' },
  { symbol: 'CA', name: 'CA Prep', color: '#E76F51', group: 'Professional' },
  { symbol: 'UP', name: 'UPSC', color: '#264653', group: 'Government' },
  
  // Skills
  { symbol: 'Py', name: 'Python', color: '#3776AB', group: 'Programming' },
  { symbol: 'Js', name: 'JavaScript', color: '#F7DF1E', group: 'Programming' },
  { symbol: 'Ml', name: 'Machine Learn', color: '#FF6F00', group: 'AI/ML' },
  { symbol: 'UI', name: 'UI/UX Design', color: '#FF4785', group: 'Design' },
  { symbol: 'Mu', name: 'Music', color: '#E91E63', group: 'Arts' },
  { symbol: 'Ar', name: 'Art & Craft', color: '#9C27B0', group: 'Arts' },
  { symbol: 'Yo', name: 'Yoga', color: '#4CAF50', group: 'Wellness' },
  { symbol: 'Sp', name: 'Spoken Eng', color: '#FF9800', group: 'Languages' },
];

const ThreeBackground: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<THREE.Mesh[]>([]);
  const targetPositionsRef = useRef<{ table: THREE.Vector3[]; sphere: THREE.Vector3[]; helix: THREE.Vector3[] }>({
    table: [],
    sphere: [],
    helix: [],
  });
  const currentLayoutRef = useRef<'table' | 'sphere' | 'helix'>('sphere');
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, compact ? 0.001 : 0.0008);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = compact ? 1000 : 1500;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Use fewer elements in compact mode
    const elementsToUse = compact ? educationElements.slice(0, 20) : educationElements;

    // Create particles/objects
    const objects: THREE.Mesh[] = [];
    const tablePositions: THREE.Vector3[] = [];
    const spherePositions: THREE.Vector3[] = [];
    const helixPositions: THREE.Vector3[] = [];

    elementsToUse.forEach((elem, i) => {
      // Create geometry - smaller in compact mode
      const size = compact ? 40 : 60;
      const geometry = new THREE.BoxGeometry(size, size, size);
      
      // Create material with element color
      const material = new THREE.MeshPhongMaterial({
        color: elem.color,
        emissive: elem.color,
        emissiveIntensity: 0.3,
        shininess: 30,
        transparent: true,
        opacity: 0.85,
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Random initial position
      mesh.position.x = Math.random() * 4000 - 2000;
      mesh.position.y = Math.random() * 4000 - 2000;
      mesh.position.z = Math.random() * 4000 - 2000;
      
      // Random rotation
      mesh.rotation.x = Math.random() * 2 * Math.PI;
      mesh.rotation.y = Math.random() * 2 * Math.PI;

      scene.add(mesh);
      objects.push(mesh);

      // Table layout (grid)
      const col = i % 8;
      const row = Math.floor(i / 8);
      tablePositions.push(
        new THREE.Vector3(
          col * 160 - 560,
          -row * 160 + 400,
          0
        )
      );

      // Sphere layout
      const phi = Math.acos(-1 + (2 * i) / elementsToUse.length);
      const theta = Math.sqrt(elementsToUse.length * Math.PI) * phi;
      spherePositions.push(
        new THREE.Vector3().setFromSphericalCoords(compact ? 600 : 1000, phi, theta)
      );

      // Helix layout
      const helixTheta = i * 0.175 + Math.PI;
      const y = -(i * 12) + 400;
      helixPositions.push(
        new THREE.Vector3().setFromCylindricalCoords(compact ? 600 : 900, helixTheta, y)
      );
    });

    objectsRef.current = objects;
    targetPositionsRef.current = {
      table: tablePositions,
      sphere: spherePositions,
      helix: helixPositions,
    };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x4F46E5, 0.5);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);

    // Mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      mouseXRef.current = (event.clientX - window.innerWidth / 2) * 0.05;
      mouseYRef.current = (event.clientY - window.innerHeight / 2) * 0.05;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation variables
    let animationProgress = 0;
    let targetLayout = currentLayoutRef.current;
    let animating = false;

    // Transform to layout
    const transformToLayout = (layout: 'table' | 'sphere' | 'helix') => {
      targetLayout = layout;
      animationProgress = 0;
      animating = true;
      currentLayoutRef.current = layout;
    };

    // Cycle through layouts
    let layoutTimer = 0;
    const layoutDuration = compact ? 3000 : 5000; // Faster in compact mode (3 seconds)

    // Start with helix (spiral animation)
    transformToLayout('helix');

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (!cameraRef.current || !rendererRef.current || !sceneRef.current) return;

      // Auto-cycle layouts (only helix and sphere, no table)
      layoutTimer += 16; // ~60fps
      if (layoutTimer >= layoutDuration) {
        layoutTimer = 0;
        const layouts: ('sphere' | 'helix')[] = ['helix', 'sphere']; // Only helix and sphere
        const currentIndex = layouts.indexOf(currentLayoutRef.current as 'sphere' | 'helix');
        const nextIndex = (currentIndex + 1) % layouts.length;
        const nextLayout = layouts[nextIndex] || 'helix';
        transformToLayout(nextLayout);
      }

      // Animate to target positions
      if (animating) {
        animationProgress += 0.01;
        
        const currentTargetPositions = targetPositionsRef.current[targetLayout] || [];
        objectsRef.current.forEach((obj, i) => {
          const targetPos = currentTargetPositions[i];
          if (!targetPos) return;
          const currentPos = obj.position;

          // Easing function (ease out cubic)
          const ease = 1 - Math.pow(1 - Math.min(animationProgress, 1), 3);

          obj.position.x = currentPos.x + (targetPos.x - currentPos.x) * ease * 0.1;
          obj.position.y = currentPos.y + (targetPos.y - currentPos.y) * ease * 0.1;
          obj.position.z = currentPos.z + (targetPos.z - currentPos.z) * ease * 0.1;
        });

        if (animationProgress >= 1) {
          animating = false;
        }
      }

      // Rotate objects
      objectsRef.current.forEach((obj) => {
        obj.rotation.x += 0.005;
        obj.rotation.y += 0.005;
      });

      // Camera movement based on mouse
      cameraRef.current.position.x += (mouseXRef.current - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y += (-mouseYRef.current - cameraRef.current.position.y) * 0.05;
      cameraRef.current.lookAt(scene.position);

      rendererRef.current.render(scene, cameraRef.current);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      objectsRef.current.forEach((obj) => {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      });

      rendererRef.current?.dispose();
    };
  }, [compact]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  );
};

export default ThreeBackground;
