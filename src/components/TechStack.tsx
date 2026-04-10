import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const scalePool = [0.7, 0.8, 1];

const createSpheres = (count: number) =>
  [...Array(count)].map(() => ({
    scale: scalePool[Math.floor(Math.random() * scalePool.length)],
  }));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [sphereCount, setSphereCount] = useState(30);
  const [enablePostFx, setEnablePostFx] = useState(true);

  const isActive = isSectionVisible && isPageVisible;
  const spheres = useMemo(() => createSpheres(sphereCount), [sphereCount]);
  const materialIndexes = useMemo(
    () => Array.from({ length: sphereCount }, () => Math.floor(Math.random() * textures.length)),
    [sphereCount]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const tabletQuery = window.matchMedia("(max-width: 1024px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateDensity = () => {
      if (mediaQuery.matches) {
        setSphereCount(16);
      } else if (tabletQuery.matches) {
        setSphereCount(22);
      } else {
        setSphereCount(30);
      }

      setEnablePostFx(!tabletQuery.matches && !reducedMotionQuery.matches);
    };

    const onVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    const onWindowBlur = () => {
      setIsPageVisible(false);
    };

    const onWindowFocus = () => {
      setIsPageVisible(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === sectionRef.current) {
            setIsSectionVisible(entry.isIntersecting);
          }
        });
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    updateDensity();
    onVisibilityChange();

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    mediaQuery.addEventListener("change", updateDensity);
    tabletQuery.addEventListener("change", updateDensity);
    reducedMotionQuery.addEventListener("change", updateDensity);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("focus", onWindowFocus);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", updateDensity);
      tabletQuery.removeEventListener("change", updateDensity);
      reducedMotionQuery.removeEventListener("change", updateDensity);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("focus", onWindowFocus);
    };
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.2,
          metalness: 0.45,
          roughness: 1,
          clearcoat: 0.08,
        })
    );
  }, []);

  useEffect(() => {
    return () => {
      materials.forEach((material) => material.dispose());
    };
  }, [materials]);

  return (
    <div className="techstack" ref={sectionRef}>
      <h2> My Techstack</h2>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.4)}
        className="tech-canvas"
        dpr={[1, 1.5]}
        frameloop={isActive ? "always" : "demand"}
      >
        <ambientLight intensity={0.9} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={1.8} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={materials[materialIndexes[i]]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.45}
          environmentRotation={[0, 4, 2]}
        />
        {enablePostFx ? (
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#0f002c" aoRadius={1.8} intensity={1.05} />
          </EffectComposer>
        ) : null}
      </Canvas>
    </div>
  );
};

export default TechStack;
