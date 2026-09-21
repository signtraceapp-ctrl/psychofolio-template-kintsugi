"use client";

/**
 * KINTSUGI - 3D kase sahnesi (v3).
 * Havada asili duran kirik seramik parcalari, kaydirdikca birlesir;
 * birlesme cizgilerinde altin damarlar dolar.
 *
 * progressRef: 0 -> paramparca, 1 -> butun + altin damarlar dolu.
 * Aydinlik (kemik beyazi) zemin uzerinde calisir - canvas seffaftir.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const BOWL_R = 1.35;
const BOWL_H = 1.05;
const PROFILE_STEPS = 32;
const LATHE_SEGMENTS_PER_SHARD = 12;

/* -- Deterministik PRNG --------------------------------------------------- */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -- Kase profili ---------------------------------------------------------- */
function bowlRadius(t: number) {
  return 0.22 + (BOWL_R - 0.22) * Math.pow(Math.sin((t * Math.PI) / 2), 0.72);
}

function buildVariedProfile(
  rnd: () => number,
  isInner: boolean,
): THREE.Vector2[] {
  const scale = isInner ? 0.94 : 1.0;
  const powerShift = (rnd() - 0.5) * 0.12;
  const radiusWobbleAmp = 0.008 + rnd() * 0.018;
  const wobbleFreq = 2 + rnd() * 3;

  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= PROFILE_STEPS; i++) {
    const t = i / PROFILE_STEPS;
    const baseR =
      0.22 +
      (BOWL_R - 0.22) *
        Math.pow(Math.sin((t * Math.PI) / 2), 0.72 + powerShift);
    const wobble = Math.sin(t * wobbleFreq * Math.PI) * radiusWobbleAmp;
    pts.push(new THREE.Vector2((baseR + wobble) * scale, t * BOWL_H));
  }
  return pts;
}

/* -- Parca siniri verileri ------------------------------------------------- */
interface ShardDef {
  thetaStart: number;
  thetaLength: number;
  outerGeo: THREE.LatheGeometry;
  innerGeo: THREE.LatheGeometry;
  centroid: THREE.Vector3;
  offset: THREE.Vector3;
  quat: THREE.Quaternion;
  tumbleAxis: THREE.Vector3;
  tumbleSpeed: number;
  settleDelay: number;
  size: number;
}

interface SeamDef {
  geo: THREE.TubeGeometry;
  indexCount: number;
  fillStart: number;
  fillEnd: number;
}

interface SceneData {
  shards: ShardDef[];
  seams: SeamDef[];
}

function buildWavyBoundaries(
  baseAngles: number[],
  rnd: () => number,
): number[][] {
  const boundaries: number[][] = [];
  for (let b = 0; b < baseAngles.length; b++) {
    const baseTheta = baseAngles[b];
    const waveAmp1 = 0.03 + rnd() * 0.05;
    const waveFreq1 = 1.5 + rnd() * 2.5;
    const waveAmp2 = 0.01 + rnd() * 0.025;
    const waveFreq2 = 3.0 + rnd() * 4.0;
    const phaseOffset = rnd() * Math.PI * 2;

    const steps: number[] = [];
    for (let row = 0; row <= PROFILE_STEPS; row++) {
      const t = row / PROFILE_STEPS;
      const wave =
        Math.sin(t * waveFreq1 * Math.PI + phaseOffset) * waveAmp1 +
        Math.sin(t * waveFreq2 * Math.PI + phaseOffset * 1.7) * waveAmp2;
      steps.push(baseTheta + wave);
    }
    boundaries.push(steps);
  }
  return boundaries;
}

function buildSceneData(): SceneData {
  const rnd = mulberry32(20260817);
  const SHARD_COUNT = 12;
  const rawWidths: number[] = [];
  let totalWidth = 0;
  for (let i = 0; i < SHARD_COUNT; i++) {
    const w = 0.3 + rnd() * 1.4;
    rawWidths.push(w);
    totalWidth += w;
  }
  const scale = (Math.PI * 2) / totalWidth;
  const sliceWidths = rawWidths.map((w) => w * scale);

  const baseAngles: number[] = [];
  let cumTheta = 0;
  for (let s = 0; s < SHARD_COUNT; s++) {
    cumTheta += sliceWidths[s];
    baseAngles.push(cumTheta);
  }

  const wavyBoundaries = buildWavyBoundaries(baseAngles, rnd);

  const shards: ShardDef[] = [];
  let theta = 0;
  const tmpV = new THREE.Vector3();

  for (let s = 0; s < SHARD_COUNT; s++) {
    const thetaStart = theta;
    const thetaLength = sliceWidths[s];
    theta += thetaLength;

    const shardOuterProfile = buildVariedProfile(rnd, false);
    const shardInnerProfile = buildVariedProfile(rnd, true);

    const outerGeo = new THREE.LatheGeometry(
      shardOuterProfile,
      LATHE_SEGMENTS_PER_SHARD,
      thetaStart,
      thetaLength,
    );
    const innerGeo = new THREE.LatheGeometry(
      shardInnerProfile,
      LATHE_SEGMENTS_PER_SHARD,
      thetaStart,
      thetaLength,
    );

    const jitterGeometry = (geo: THREE.LatheGeometry) => {
      const pos = geo.getAttribute("position");
      const segCount = LATHE_SEGMENTS_PER_SHARD + 1;
      for (let row = 0; row <= PROFILE_STEPS; row++) {
        for (let col = 0; col < segCount; col++) {
          const idx = row * segCount + col;
          if (idx >= pos.count) continue;

          const isEdge = col === 0 || col === LATHE_SEGMENTS_PER_SHARD;

          if (isEdge) {
            const jx = (rnd() - 0.5) * (0.10 + rnd() * 0.05);
            const jy = (rnd() - 0.5) * (0.04 + rnd() * 0.02);
            const jz = (rnd() - 0.5) * (0.10 + rnd() * 0.05);
            pos.setXYZ(
              idx,
              pos.getX(idx) + jx,
              pos.getY(idx) + jy,
              pos.getZ(idx) + jz,
            );
          } else {
            const amp = 0.015 + rnd() * 0.01;
            const sx = (rnd() - 0.5) * amp;
            const sy = (rnd() - 0.5) * amp * 0.5;
            const sz = (rnd() - 0.5) * amp;
            pos.setXYZ(
              idx,
              pos.getX(idx) + sx,
              pos.getY(idx) + sy,
              pos.getZ(idx) + sz,
            );
          }
        }
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    };
    jitterGeometry(outerGeo);
    jitterGeometry(innerGeo);

    outerGeo.computeBoundingBox();
    const box = outerGeo.boundingBox!;
    const centroid = new THREE.Vector3();
    box.getCenter(centroid);

    const midTheta = thetaStart + thetaLength / 2;
    const verticalBias = (rnd() - 0.5) * 2.0;
    tmpV.set(
      Math.cos(midTheta),
      verticalBias * 0.4,
      Math.sin(midTheta),
    ).normalize();
    const offset = tmpV
      .clone()
      .multiplyScalar(2.5 + rnd() * 2.5)
      .add(
        new THREE.Vector3(
          (rnd() - 0.5) * 1.2,
          (rnd() - 0.5) * 2.4,
          (rnd() - 0.5) * 1.2,
        ),
      );

    const quat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(),
      1.2 + rnd() * 2.0,
    );

    const tumbleAxis = new THREE.Vector3(
      rnd() - 0.5,
      rnd() - 0.5,
      rnd() - 0.5,
    ).normalize();
    const tumbleSpeed = 0.15 + rnd() * 0.3;

    const size = thetaLength;
    const settleDelay =
      0.02 + (1 - size / ((Math.PI * 2) / 6)) * 0.25 + rnd() * 0.06;

    shards.push({
      thetaStart,
      thetaLength,
      outerGeo,
      innerGeo,
      centroid,
      offset,
      quat,
      tumbleAxis,
      tumbleSpeed,
      settleDelay,
      size,
    });
  }

  shards.sort((a, b) => b.size - a.size);
  for (let i = 0; i < shards.length; i++) {
    shards[i].settleDelay = 0.02 + (i / shards.length) * 0.3 + rnd() * 0.04;
  }

  const seams: SeamDef[] = [];
  for (let s = 0; s < SHARD_COUNT; s++) {
    const wavyThetas = wavyBoundaries[s];
    const pts: THREE.Vector3[] = [];
    const seamSteps = 16;
    for (let k = 0; k <= seamSteps; k++) {
      const t = k / seamSteps;
      const r = bowlRadius(t);
      const rOut = r * 1.012;
      const rowFloat = t * PROFILE_STEPS;
      const rowLow = Math.floor(rowFloat);
      const rowHigh = Math.min(rowLow + 1, PROFILE_STEPS);
      const frac = rowFloat - rowLow;
      const seamTheta =
        wavyThetas[rowLow] * (1 - frac) + wavyThetas[rowHigh] * frac;
      pts.push(
        new THREE.Vector3(
          Math.cos(seamTheta) * rOut,
          t * BOWL_H,
          Math.sin(seamTheta) * rOut,
        ),
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 32, 0.014, 5, false);
    const indexCount = geo.index ? geo.index.count : 0;

    const fillStart = 0.55 + s * 0.028;
    const fillEnd = 0.78 + s * 0.028;

    seams.push({ geo, indexCount, fillStart, fillEnd });
  }

  return { shards, seams };
}

/* -- Smoothstep ------------------------------------------------------------ */
const smoothstep = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

/* -- Ground shadow texture ------------------------------------------------- */
function buildShadowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(140,125,100,0.32)");
  gradient.addColorStop(0.5, "rgba(140,125,100,0.12)");
  gradient.addColorStop(1, "rgba(140,125,100,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/* -- Shard mesh component -------------------------------------------------- */
function Shard({
  shard,
  progressRef,
}: {
  shard: ShardDef;
  progressRef: React.RefObject<number>;
}) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const smoothP = useRef(0);
  const tumbleAngle = useRef(0);
  const springQuat = useRef(new THREE.Quaternion());

  const workPos = useRef(new THREE.Vector3());
  const workQuat = useRef(new THREE.Quaternion());
  const identityQuat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = progressRef.current ?? 0;
    smoothP.current += (target - smoothP.current) * 0.1;
    const p = smoothP.current;

    const settleEnd = shard.settleDelay + 0.35;
    const rawK = Math.min(
      1,
      Math.max(0, (p - shard.settleDelay) / (settleEnd - shard.settleDelay)),
    );

    const omega = 8.0;
    const zeta = 0.65;
    const springK =
      1 -
      Math.exp(-zeta * omega * rawK) *
        (Math.cos(omega * Math.sqrt(1 - zeta * zeta) * rawK) +
          (zeta / Math.sqrt(1 - zeta * zeta)) *
            Math.sin(omega * Math.sqrt(1 - zeta * zeta) * rawK));
    const k = Math.max(0, Math.min(1.08, springK));

    if (k < 0.99) {
      tumbleAngle.current += shard.tumbleSpeed * dt * (1 - k);
    }

    const tPos = workPos.current;
    tPos.set(
      shard.offset.x * (1 - k),
      shard.offset.y * (1 - k),
      shard.offset.z * (1 - k),
    );

    const tumbleQuat = workQuat.current;
    tumbleQuat.copy(shard.quat);
    const additionalTumble = new THREE.Quaternion().setFromAxisAngle(
      shard.tumbleAxis,
      tumbleAngle.current,
    );
    tumbleQuat.multiply(additionalTumble);

    springQuat.current.slerpQuaternions(identityQuat, tumbleQuat, 1 - k);

    const applyToMesh = (mesh: THREE.Mesh | null) => {
      if (!mesh) return;
      mesh.position.copy(tPos);
      mesh.quaternion.copy(springQuat.current);
    };

    applyToMesh(outerRef.current);
    applyToMesh(innerRef.current);
  });

  return (
    <group>
      <mesh ref={outerRef} geometry={shard.outerGeo} frustumCulled={false}>
        <meshPhysicalMaterial
          color="#f0e8d8"
          clearcoat={0.4}
          clearcoatRoughness={0.3}
          roughness={0.55}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={innerRef} geometry={shard.innerGeo} frustumCulled={false}>
        <meshPhysicalMaterial
          color="#d8cdb8"
          clearcoat={0.2}
          clearcoatRoughness={0.5}
          roughness={0.65}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* -- Gold seams component -------------------------------------------------- */
function GoldSeams({
  seams,
  progressRef,
}: {
  seams: SeamDef[];
  progressRef: React.RefObject<number>;
}) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const smoothP = useRef(0);

  useFrame(() => {
    const target = progressRef.current ?? 0;
    smoothP.current += (target - smoothP.current) * 0.1;
    const p = smoothP.current;

    seams.forEach((seam, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      const fill = smoothstep(seam.fillStart, seam.fillEnd, p);
      mesh.visible = fill > 0.001;
      seam.geo.setDrawRange(0, Math.floor(seam.indexCount * fill));
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = Math.min(1, fill * 2.5);
    });
  });

  return (
    <group>
      {seams.map((seam, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={seam.geo}
          frustumCulled={false}
        >
          <meshStandardMaterial
            color="#c79a35"
            emissive="#c79a35"
            emissiveIntensity={2.5}
            metalness={0.9}
            roughness={0.2}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -- Ground shadow --------------------------------------------------------- */
function GroundShadow() {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return buildShadowTexture();
  }, []);

  if (!texture) return null;

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.03, 0]}>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        opacity={0.7}
      />
    </mesh>
  );
}

/* -- Scene rig (camera + group rotation) ----------------------------------- */
function SceneRig({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const smoothP = useRef(0);
  const look = useMemo(() => new THREE.Vector3(0, 0.5, 0), []);
  const sceneData = useMemo(() => buildSceneData(), []);

  useFrame(({ clock }) => {
    const target = progressRef.current ?? 0;
    smoothP.current += (target - smoothP.current) * 0.08;
    const p = smoothP.current;
    const elapsed = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.06 + p * 1.9;
      groupRef.current.position.y = Math.sin(elapsed * 0.5) * 0.02 * (1 - p);
    }

    const az = -0.35 + p * 0.55;
    const radius = 5.4 - p * 2.0;
    const height = 2.4 - p * 1.2;
    camera.position.set(
      Math.sin(az) * radius,
      height,
      Math.cos(az) * radius,
    );
    look.set(0, 0.52 - p * 0.06, 0);
    camera.lookAt(look);
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#faf6ee" />
      <directionalLight
        intensity={1.2}
        position={[4, 6, 2]}
        color="#fffaf0"
      />
      <directionalLight
        intensity={0.4}
        position={[-3, 2, -4]}
        color="#d4c5a0"
      />

      <group ref={groupRef}>
        {sceneData.shards.map((shard, i) => (
          <Shard key={i} shard={shard} progressRef={progressRef} />
        ))}
        <GoldSeams seams={sceneData.seams} progressRef={progressRef} />
        <GroundShadow />
      </group>
    </>
  );
}

/* -- Exported scene -------------------------------------------------------- */
export function KintsugiScene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 2.4, 5.4], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <SceneRig progressRef={progressRef} />
    </Canvas>
  );
}
