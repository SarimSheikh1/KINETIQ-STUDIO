import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";
function Form() {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock, pointer, camera }, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.16;
    ref.current.rotation.x =
      Math.sin(clock.elapsedTime * 0.3) * 0.2 + pointer.y * 0.2;
    camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.35}>
      <mesh ref={ref} rotation={[0.5, 0, 0.3]}>
        <torusKnotGeometry args={[1.15, 0.42, 180, 28, 2, 3]} />
        <meshStandardMaterial
          color="#FF654F"
          roughness={0.23}
          metalness={0.35}
        />
      </mesh>
    </Float>
  );
}
export default function Sculpture() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      aria-label="Interactive coral sculptural knot"
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 5, 4]} intensity={4} />
      <directionalLight
        position={[-4, -2, 3]}
        intensity={1.5}
        color="#C7B8FF"
      />
      <Form />
    </Canvas>
  );
}
