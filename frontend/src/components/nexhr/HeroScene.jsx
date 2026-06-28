import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
function Core() {
    const mesh = useRef(null);
    useFrame((state) => {
        if (!mesh.current)
            return;
        mesh.current.rotation.y = state.clock.elapsedTime * 0.25;
        mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    });
    return (<Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <Sphere ref={mesh} args={[1.4, 96, 96]}>
        <MeshDistortMaterial color="#8b5cf6" distort={0.45} speed={2.2} roughness={0.15} metalness={0.85} emissive="#5b21b6" emissiveIntensity={0.6}/>
      </Sphere>
    </Float>);
}
function Shards() {
    const group = useRef(null);
    useFrame((state) => {
        if (!group.current)
            return;
        group.current.rotation.y = state.clock.elapsedTime * 0.08;
    });
    const positions = [
        [2.6, 1.1, -1], [-2.8, -0.6, -1.4], [2.2, -1.4, 1], [-2.4, 1.6, 0.4], [0.2, 2.4, -1.2], [0, -2.2, 1.4],
    ];
    return (<group ref={group}>
      {positions.map((p, i) => (<Float key={i} speed={1 + i * 0.2} rotationIntensity={1} floatIntensity={1.5}>
          <Icosahedron args={[0.28 + (i % 3) * 0.08, 0]} position={p}>
            <meshStandardMaterial color={i % 2 ? "#a78bfa" : "#22d3ee"} metalness={0.9} roughness={0.1} emissive={i % 2 ? "#7c3aed" : "#0891b2"} emissiveIntensity={0.4}/>
          </Icosahedron>
        </Float>))}
    </group>);
}
function CameraRig() {
    useFrame((state) => {
        const { camera, pointer } = state;
        camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.04;
        camera.position.y += (-pointer.y * 0.5 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
    });
    return null;
}
export function HeroScene() {
    return (<Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4}/>
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#a855f7"/>
        <pointLight position={[-5, -3, 4]} intensity={1.2} color="#22d3ee"/>
        <Core />
        <Shards />
        <Environment preset="night"/>
        <CameraRig />
      </Suspense>
    </Canvas>);
}
