import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'
import { MapControls } from 'three/addons/controls/MapControls.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { Compass, Layers3, LoaderCircle, RotateCcw, X } from 'lucide-react'
import type { AtlasHandle, AtlasProps } from './Atlas'
import {
  locationById,
  normalize,
  places,
  regionById,
  regions,
  subregionById,
} from './data'
import { featureById, featureLabels, mapFeatures } from './map-features'
import {
  forestZones,
  riverPaths,
  inPolygon,
  seededRandom,
  valueNoise,
  type UV,
} from './relief-data'
import {
  cinematicCameraKey,
  cinematicColdAt,
  cinematicColor,
  cinematicHeightAt,
  cinematicLandAt,
  cinematicRiverAt,
  cinematicTargets,
  loadCinematicField,
  settlementGround,
  WORLD_DEPTH,
  WORLD_WIDTH,
  worldPoint,
  type CinematicField,
} from './cinematic-atlas-data'
import { buildSettlement } from './relief-buildings'
import { inFarmland } from './relief-farms'
import { abandonedHonudPlaces } from './lore/honud-revision'
import './cinematic-atlas.css'

type Props = AtlasProps & { onExit: () => void; onUnavailable: () => void }
type Runtime = {
  home: () => void
  zoom: (factor: number) => void
  tilt: (flat: boolean) => void
  north: () => void
  refresh: (focus?: boolean) => void
}
const clamp = THREE.MathUtils.clamp
const mapPoint = (x: number, z: number): UV => [
  x / WORLD_WIDTH + 0.5,
  z / WORLD_DEPTH + 0.5,
]
const targets = cinematicTargets.filter((entry) => entry.point)

function riverRibbon(path: UV[], width: number, sample: (p: UV) => number) {
  const points: THREE.Vector3[] = []
  for (let i = 1; i < path.length; i++) {
    const a = new THREE.Vector3(...worldPoint(path[i - 1])),
      b = new THREE.Vector3(...worldPoint(path[i])),
      steps = Math.max(1, Math.ceil(a.distanceTo(b) / 0.035))
    for (let n = i === 1 ? 0 : 1; n <= steps; n++)
      points.push(a.clone().lerp(b, n / steps))
  }
  const vertices: number[] = [], indices: number[] = []
  for (let i = 0; i < points.length; i++) {
    const p = points[i],
      tangent = points[Math.min(points.length - 1, i + 1)].clone()
        .sub(points[Math.max(0, i - 1)]).normalize(),
      side = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(width / 2)
    for (const sign of [-1, 1]) {
      const x = p.x + side.x * sign, z = p.z + side.z * sign
      vertices.push(x, Math.max(0.01, sample(mapPoint(x, z))) + 0.075, z)
    }
    if (i) { const a = (i - 1) * 2, b = i * 2; indices.push(a, a + 1, b, a + 1, b + 1, b) }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function buildWorld(field: CinematicField, mobile: boolean) {
  const root = new THREE.Group(),
    cities = new THREE.Group(),
    roads = new THREE.Group()
  root.name = 'cinematic-rebuilt-world'
  cities.name = 'symbolic-settlements'
  roads.name = 'canonical-route-lines'
  const cols = mobile ? 256 : 448,
    rows = Math.round((cols * WORLD_DEPTH) / WORLD_WIDTH)
  const geometry = new THREE.PlaneGeometry(WORLD_WIDTH, WORLD_DEPTH, cols, rows)
  geometry.rotateX(-Math.PI / 2)
  const paint = new THREE.Color()
  const position = geometry.attributes.position,
    colors = new Float32Array(position.count * 3),
    elevations = new Float32Array(position.count)
  for (let i = 0; i < position.count; i++) {
    const point = mapPoint(position.getX(i), position.getZ(i)),
      height = cinematicHeightAt(point, field)
    position.setY(i, height)
    elevations[i] = height
    const rgb = cinematicColor(point, height, cinematicColdAt(point, height))
    paint.setRGB(rgb[0], rgb[1], rgb[2], THREE.SRGBColorSpace)
    colors.set([paint.r, paint.g, paint.b], i * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  const sample = (point: UV) => {
    const gx = clamp(point[0], 0, 1) * cols,
      gy = clamp(point[1], 0, 1) * rows,
      x = Math.min(cols - 1, Math.floor(gx)),
      y = Math.min(rows - 1, Math.floor(gy)),
      fx = gx - x,
      fy = gy - y,
      a = y * (cols + 1) + x,
      b = a + cols + 1
    return (
      (elevations[a] * (1 - fx) + elevations[a + 1] * fx) * (1 - fy) +
      (elevations[b] * (1 - fx) + elevations[b + 1] * fx) * fy
    )
  }
  const maskPixels = new Uint8Array(field.land.length * 4),
    waterPixels = new Uint8Array(field.land.length * 4)
  for (let y = 0; y < field.height; y++)
    for (let x = 0; x < field.width; x++) {
      const i = y * field.width + x,
        v = field.land[i] * 255,
        u = x / (field.width - 1),
        vv = y / (field.height - 1),
        freeze =
          u < 0.45 && vv > 0.55
            ? clamp((vv - 0.55) * 2.1, 0, 0.78)
            : u > 0.94 && vv > 0.65
              ? 0.22
              : 0,
        wave =
          (Math.sin(x * 0.13 + y * 0.09) + Math.sin(x * 0.027 - y * 0.045)) *
          0.7
      maskPixels.set(
        [v, v, v, 255],
        ((field.height - 1 - y) * field.width + x) * 4,
      )
      waterPixels.set(
        [
          19 * (1 - freeze) + 77 * freeze + wave,
          37 * (1 - freeze) + 91 * freeze + wave,
          44 * (1 - freeze) + 95 * freeze + wave,
          255,
        ],
        ((field.height - 1 - y) * field.width + x) * 4,
      )
    }
  const texture = (bytes: Uint8Array, srgb = false) => {
    const t = new THREE.DataTexture(
      bytes,
      field.width,
      field.height,
      THREE.RGBAFormat,
    )
    t.flipY = false
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    if (srgb) t.colorSpace = THREE.SRGBColorSpace
    t.needsUpdate = true
    return t
  }
  const ground = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      alphaMap: texture(maskPixels),
      alphaTest: 0.48,
      side: THREE.DoubleSide,
    }),
  )
  ground.receiveShadow = true
  ground.castShadow = !mobile
  ground.name = 'new-heightfield'
  root.add(ground)
  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD_WIDTH, WORLD_DEPTH),
    new THREE.MeshBasicMaterial({
      map: texture(waterPixels, true),
      color: '#c9d2cf',
    }),
  )
  sea.rotation.x = -Math.PI / 2
  sea.position.y = -0.015
  sea.name = 'muted-open-water'
  root.add(sea)
  const waters = new THREE.Group()
  waters.name = 'canonical-danstsud-rivers'
  const riverMaterial = new THREE.MeshStandardMaterial({ color: '#29474b', roughness: 0.7, side: THREE.DoubleSide })
  for (const river of riverPaths) {
    const mesh = new THREE.Mesh(riverRibbon(river.points, river.width, sample), riverMaterial)
    mesh.name = 'river:' + river.id
    mesh.userData.targetId = river.id
    waters.add(mesh)
  }
  root.add(waters)
  // Small buildings are a symbolic settlement view, not a claim of surveyed
  // urban footprints. No model is placed on a water cell.
  const stone = new THREE.MeshStandardMaterial({
      color: '#9d9988',
      roughness: 1,
    }),
    dark = new THREE.MeshStandardMaterial({ color: '#424c49', roughness: 1 }),
    roof = new THREE.MeshStandardMaterial({ color: '#41435a', roughness: 1 }),
    gold = new THREE.MeshStandardMaterial({ color: '#98805c', roughness: 0.9 })
  const box = new THREE.BoxGeometry(1, 1, 1),
    cone = new THREE.ConeGeometry(0.5, 1, 12),
    cylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 16)
  for (const place of places) {
    if (!place.point) continue
    const modelPoint = settlementGround(place.point, field)
    if (!modelPoint) continue
    if (place.region === 'danstsud') {
      const settlement = buildSettlement({ ...place, point: place.point }, sample)
      settlement.userData.major = !!place.major
      cities.add(settlement)
      continue
    }
    const group = new THREE.Group(),
      random = seededRandom('cinematic-' + place.id),
      major = !!place.major,
      size = place.id === 'morihael' ? 2.1 : major ? 0.9 : 0.38
    group.position.fromArray(
      worldPoint(modelPoint, Math.max(0.055, sample(modelPoint)) + 0.03),
    )
    group.userData = { targetId: place.id, major, canonicalPoint: [...place.point], modelPoint, offset: Math.hypot((modelPoint[0] - place.point[0]) * WORLD_WIDTH, (modelPoint[1] - place.point[1]) * WORLD_DEPTH) }
    const add = (
      g: THREE.BufferGeometry,
      m: THREE.Material,
      x: number,
      y: number,
      z: number,
      sx: number,
      sy: number,
      sz: number,
    ) => {
      const mesh = new THREE.Mesh(g, m)
      mesh.position.set(x, y, z)
      mesh.scale.set(sx, sy, sz)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData.targetId = place.id
      group.add(mesh)
      return mesh
    }
    const abandoned = abandonedHonudPlaces.has(place.id)
    const count =
      abandoned ? 7 : place.id === 'valdareth'
        ? 90
        : place.id === 'morihael'
          ? 240
          : major
            ? 28
            : 8
    for (let n = 0; n < count; n++) {
      const a = random() * Math.PI * 2,
        r = Math.sqrt(random()) * size,
        x = Math.cos(a) * r,
        z = Math.sin(a) * r,
        w = 0.07 + random() * 0.085,
        h = 0.07 + random() * 0.1,
        d = 0.07 + random() * 0.085
      const plot: UV = [modelPoint[0] + x / WORLD_WIDTH, modelPoint[1] + z / WORLD_DEPTH]
      if (!cinematicLandAt(plot, field)) continue
      add(box, place.region === 'honud' ? dark : stone, x, h / 2, z, w, h, d)
      if (!abandoned || n % 3 === 0) add(
        cone,
        place.region === 'honud' ? stone : roof,
        x,
        h + 0.035,
        z,
        w * 1.25,
        0.09,
        d * 1.25,
      ).rotation.y = Math.PI / 4
    }
    if (major && !abandoned) {
      add(cylinder, stone, 0, 0.23, 0, 0.22, 0.46, 0.22)
      add(cone, roof, 0, 0.5, 0, 0.28, 0.15, 0.28)
    }
    if (place.id === 'morihael') {
      // Two civic halls express the shared seat, rather than a royal keep.
      for (const side of [-1, 1]) {
        add(box, stone, side * 0.4, 0.15, 0, 0.42, 0.3, 0.55)
        add(cone, roof, side * 0.4, 0.38, 0, 0.48, 0.2, 0.6).rotation.y = Math.PI / 4
      }
    }
    if (place.id === 'valdareth') {
      for (const radius of [0.29, 0.45, 0.61, 0.77, 0.94])
        for (let n = 0; n < 40; n++) {
          const a = (n / 40) * Math.PI * 2,
            b = ((n + 1) / 40) * Math.PI * 2,
            m = add(
              box,
              stone,
              Math.cos(a) * radius,
              0.075,
              Math.sin(a) * radius,
              0.03,
              0.15,
              Math.hypot(Math.cos(b) - Math.cos(a), Math.sin(b) - Math.sin(a)) *
                radius +
                0.015,
            )
          m.rotation.y = -a
        }
      add(box, dark, 0.19, 0.19, -0.16, 0.2, 0.38, 0.3)
      add(cylinder, dark, 0.19, 0.52, -0.16, 0.075, 0.4, 0.075)
    }
    if (place.id === 'lirendil') {
      add(cylinder, stone, 0, 0.7, -0.15, 0.12, 1.4, 0.12)
      add(cylinder, gold, 0, 1.45, -0.15, 0.17, 0.12, 0.17)
    }
    if (place.id === 'elorwyn') {
      add(box, stone, 0, 0.2, 0, 0.38, 0.4, 0.6)
      add(cylinder, gold, -0.2, 0.35, 0, 0.08, 0.7, 0.08)
      add(cylinder, gold, 0.2, 0.35, 0, 0.08, 0.7, 0.08)
    }
    if (place.id === 'theramis')
      for (let n = 0; n < 8; n++) {
        const a = (n / 8) * Math.PI * 2
        add(
          cylinder,
          stone,
          Math.cos(a) * 0.4,
          0.25,
          Math.sin(a) * 0.4,
          0.09,
          0.5,
          0.09,
        )
      }
    if (place.id === 'frostbay')
      for (let n = 0; n < 6; n++) {
        const a = (n / 6) * Math.PI * 2
        add(
          cylinder,
          dark,
          Math.cos(a) * 0.5,
          0.18,
          Math.sin(a) * 0.5,
          0.12,
          0.36 + random() * 0.2,
          0.12,
        )
      }
    const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>()
    for (const child of group.children as THREE.Mesh[]) {
      child.updateMatrix()
      const material = child.material as THREE.Material,
        chunk = child.geometry.clone().applyMatrix4(child.matrix)
      buckets.set(material, [...(buckets.get(material) || []), chunk])
    }
    group.clear()
    for (const [material, chunks] of buckets) {
      const merged = mergeGeometries(chunks, false)
      chunks.forEach((chunk) => chunk.dispose())
      if (merged) {
        const mesh = new THREE.Mesh(merged, material)
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.userData.targetId = place.id
        group.add(mesh)
      }
    }
    group.userData.abandoned = abandoned
    cities.add(group)
  }
  box.dispose()
  cone.dispose()
  cylinder.dispose()
  root.add(cities)
  // Forest cover follows the known Danstsud groves and the wooded island
  // belts of Murgul/Garmirk. It does not populate Honud's dead interior.
  const forest = new THREE.Group(),
    random = seededRandom('cinematic-groves'),
    treePoints: { point: UV; height: number; scale: number }[] = []
  for (let n = 0; n < (mobile ? 9000 : 22000); n++) {
    const point: UV = [random(), random()],
      h = sample(point),
      [u, v] = point
    if (
      !cinematicLandAt(point, field) ||
      h > 2.1 || cinematicRiverAt(point) || (u > 0.34 && v > 0.414 && inFarmland(point))
    )
      continue
    const allowed =
      u > 0.34 && v > 0.414
        ? forestZones.some((zone) => inPolygon(point, zone.polygon))
        : (u < 0.35 && v > 0.24 && v < 0.48) || (u > 0.7 && v < 0.39)
    if (
      !allowed ||
      valueNoise(u * 50, v * 38) < 0.37 ||
      places.some(
        (p) =>
          p.point &&
          Math.hypot((p.point[0] - u) * 120, (p.point[1] - v) * 83) <
            (p.major ? 1.15 : 0.48),
      )
    )
      continue
    treePoints.push({ point, height: h, scale: 0.075 + random() * 0.075 })
  }
  const crowns = new THREE.InstancedMesh(
      new THREE.ConeGeometry(0.58, 1.9, 14),
      new THREE.MeshStandardMaterial({ color: '#273d33', roughness: 1 }),
      treePoints.length,
    ),
    leaves = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(0.78, 2),
      new THREE.MeshStandardMaterial({ color: '#304333', roughness: 1 }),
      treePoints.length,
    ),
    trunks = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.09, 0.13, 0.6, 7),
      new THREE.MeshStandardMaterial({ color: '#4b4131', roughness: 1 }),
      treePoints.length,
    ),
    matrix = new THREE.Matrix4()
  treePoints.forEach((tree, i) => {
    const [x, , z] = worldPoint(tree.point)
    matrix.compose(
      new THREE.Vector3(x, tree.height + tree.scale * 0.85, z),
      new THREE.Quaternion(),
      new THREE.Vector3(tree.scale, tree.scale, tree.scale),
    )
    const leafy = tree.point[0] < 0.35 || (tree.point[0] > 0.7 && tree.point[1] < 0.4)
    if (leafy) {
      leaves.setMatrixAt(i, matrix)
      crowns.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0))
    } else {
      crowns.setMatrixAt(i, matrix)
      leaves.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0))
    }
    matrix.compose(
      new THREE.Vector3(x, tree.height + tree.scale * 0.18, z),
      new THREE.Quaternion(),
      new THREE.Vector3(tree.scale, tree.scale, tree.scale),
    )
    trunks.setMatrixAt(i, matrix)
  })
  crowns.castShadow = true
  leaves.castShadow = true
  forest.add(trunks, crowns, leaves)
  forest.userData.count = treePoints.length
  root.add(forest)
  for (const feature of mapFeatures.filter(
    (f) => f.kind === 'route' && f.paths,
  )) {
    const group = new THREE.Group()
    group.userData.targetId = feature.id
    for (const path of feature.paths || []) {
      const linePoints: THREE.Vector3[] = []
      for (let i = 1; i < path.length; i++) {
        const a = path[i - 1],
          b = path[i],
          steps = Math.max(
            3,
            Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * 700),
          )
        for (let n = 0; n <= steps; n++) {
          const t = n / steps,
            p: UV = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
          linePoints.push(
            new THREE.Vector3(
              ...worldPoint(p, Math.max(0.03, sample(p)) + 0.065),
            ),
          )
        }
      }
      const material =
          feature.status === 'planned'
            ? new THREE.LineDashedMaterial({
                color: '#9b8a6c',
                dashSize: 0.22,
                gapSize: 0.2,
                transparent: true,
                opacity: 0.65,
              })
            : new THREE.LineBasicMaterial({
                color: feature.status === 'dangerous' ? '#95816c' : '#baaa80',
                transparent: true,
                opacity: 0.8,
              }),
        line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(linePoints),
          material,
        )
      line.computeLineDistances()
      group.add(line)
    }
    roads.add(group)
  }
  root.add(roads)
  return {
    root,
    cities,
    roads,
    sample,
    cityCount: cities.children.length,
    vertices: position.count,
    forestCount: treePoints.length,
  }
}
function dispose(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>(),
    materials = new Set<THREE.Material>(),
    textures = new Set<THREE.Texture>()
  root.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.geometry) geometries.add(m.geometry)
    if (m.material)
      for (const a of Array.isArray(m.material) ? m.material : [m.material])
        materials.add(a)
  })
  for (const m of materials) {
    for (const v of Object.values(m))
      if (v instanceof THREE.Texture) textures.add(v)
    m.dispose()
  }
  geometries.forEach((g) => g.dispose())
  textures.forEach((t) => t.dispose())
}

export default forwardRef<AtlasHandle, Props>(
  function CinematicAtlas(props, ref) {
    const host = useRef<HTMLDivElement>(null),
      pins = useRef<HTMLDivElement>(null),
      latest = useRef(props),
      runtime = useRef<Runtime | null>(null),
      previous = useRef(props.selected)
    const [ready, setReady] = useState(false),
      [flat, setFlat] = useState(false)
    latest.current = props
    useImperativeHandle(
      ref,
      () => ({
        home: () => runtime.current?.home(),
        zoom: (factor) => runtime.current?.zoom(factor),
      }),
      [],
    )
    useEffect(() => {
      const element = host.current,
        overlay = pins.current
      if (!element || !overlay) return
      let dead = false,
        frame = 0,
        dirty = true,
        project = true,
        lastTime = 0,
        baseHeight = 84,
        saveTimer = 0
      const abort = new AbortController(),
        mobile = element.clientWidth < 620
      let renderer: THREE.WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: !mobile,
          powerPreference: 'default',
        })
      } catch {
        latest.current.onUnavailable()
        return
      }
      renderer.setPixelRatio(
        Math.min(devicePixelRatio || 1, mobile ? 1.15 : 1.6),
      )
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.02
      renderer.shadowMap.enabled = !mobile
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.shadowMap.autoUpdate = false
      renderer.shadowMap.needsUpdate = true
      const canvas = renderer.domElement
      canvas.tabIndex = 0
      canvas.setAttribute(
        'aria-label',
        'Koyu dünya kabartması. Sürükle, tekerlekle yakınlaştır, sağ sürüklemeyle eğ.',
      )
      element.append(canvas)
      element.dataset.ready = 'false'
      element.dataset.scope = 'world'
      element.dataset.source = 'technical-coastline-and-new-heightfield'
      element.dataset.originalTexture = 'false'
      const scene = new THREE.Scene()
      scene.background = new THREE.Color('#111c21')
      scene.add(new THREE.HemisphereLight('#d1d5d0', '#424537', 1.25))
      const sun = new THREE.DirectionalLight('#eddfc8', 2.45)
      sun.position.set(-38, 60, 22)
      sun.castShadow = !mobile
      sun.shadow.mapSize.set(2048, 2048)
      sun.shadow.normalBias = 0.045
      sun.shadow.bias = -0.00025
      Object.assign(sun.shadow.camera, {
        left: -80,
        right: 80,
        top: 65,
        bottom: -65,
        near: 1,
        far: 180,
      })
      scene.add(sun, sun.target)
      const camera = new THREE.OrthographicCamera(-60, 60, 42, -42, 0.1, 400)
      camera.position.set(0, 92, 76)
      const controls = new MapControls(camera, canvas)
      controls.enableDamping = !latest.current.reducedMotion
      controls.dampingFactor = 0.13
      controls.minZoom = 0.8
      controls.maxZoom = 18
      controls.minPolarAngle = 0.055
      controls.maxPolarAngle = 1.05
      controls.screenSpacePanning = false
      controls.zoomSpeed = 0.9
      controls.update()
      let world: ReturnType<typeof buildWorld> | null = null,
        tween: {
          target: THREE.Vector3
          zoom: number
          eye?: THREE.Vector3
        } | null = null
      const markers = new Map<string, HTMLButtonElement>(),
        vectors = new Map<string, THREE.Vector3>(),
        raycaster = new THREE.Raycaster(),
        pointer = new THREE.Vector2()
      let down = { x: 0, y: 0 }
      function schedule() {
        if (!frame && !dead && !document.hidden)
          frame = requestAnimationFrame(tick)
      }
      function remember() {
        if (!world || dead) return
        try {
          sessionStorage.setItem(
            cinematicCameraKey,
            JSON.stringify({
              selected: latest.current.selected,
              target: controls.target.toArray(),
              position: camera.position.toArray(),
              zoom: camera.zoom,
            }),
          )
        } catch {
          /* optional */
        }
      }
      function changed() {
        dirty = true
        project = true
        renderer.shadowMap.needsUpdate = true
        clearTimeout(saveTimer)
        saveTimer = window.setTimeout(remember, 250)
        schedule()
      }
      function finish() {
        if (!tween) return
        const offset = camera.position.clone().sub(controls.target)
        controls.target.copy(tween.target)
        camera.position.copy(tween.target).add(tween.eye || offset)
        camera.zoom = tween.zoom
        camera.updateProjectionMatrix()
        tween = null
        controls.update()
        changed()
      }
      function move(target: THREE.Vector3, zoom: number, eye?: THREE.Vector3) {
        tween = { target, zoom: clamp(zoom, 0.8, 18), eye }
        latest.current.reducedMotion ? finish() : schedule()
      }
      function home() {
        move(new THREE.Vector3(), 1, new THREE.Vector3(0, 92, 76))
        setFlat(false)
      }
      function focus() {
        const id = latest.current.selected,
          entry =
            regionById(id || '') ||
            locationById(id || '') ||
            featureById(id || '')
        if (!entry?.point) {
          home()
          return
        }
        const box =
            regionById(id || '')?.box ||
            subregionById(id || '')?.box ||
            featureById(id || '')?.box,
          zoom = box
            ? Math.min(
                (camera.right - camera.left) /
                  (box[2] * WORLD_WIDTH * 1.15 + 3),
                baseHeight / (box[3] * WORLD_DEPTH * 0.85 + 4),
              )
            : mobile
              ? 9
              : 10
        move(
          new THREE.Vector3(
            ...worldPoint(
              entry.point,
              Math.max(0, world?.sample(entry.point) || 0),
            ),
          ),
          zoom,
          // This city occupies a narrow river gorge. A high viewpoint keeps
          // its two bank castles visible instead of hiding them behind rock.
          id === 'marhalden' ? new THREE.Vector3(0, 118, 6.5) : undefined,
        )
        if (id === 'marhalden') setFlat(true)
      }
      function projectMarkers() {
        if (!world) return
        const p = latest.current,
          width = element!.clientWidth,
          height = element!.clientHeight,
          needle = normalize(p.query),
          candidates: {
            button: HTMLButtonElement
            x: number
            y: number
            priority: number
          }[] = []
        for (const entry of targets) {
          const button = markers.get(entry.id)!,
            position = vectors.get(entry.id)!.clone().project(camera),
            x = (position.x * 0.5 + 0.5) * width,
            y = (-position.y * 0.5 + 0.5) * height,
            feature = featureById(entry.id),
            region = regions.some((r) => r.id === entry.id),
            subregion = !!subregionById(entry.id),
            chosen = p.selected === entry.id,
            match =
              !needle ||
              normalize(
                [
                  entry.name,
                  ...('aliases' in entry ? entry.aliases || [] : []),
                ].join(' '),
              ).includes(needle),
            enabled = feature
              ? feature.kind === 'route'
                ? p.showRoutes
                : p.showGeography
              : region
                ? camera.zoom < 2.2
                : subregion
                  ? p.showGeography
                  : p.showCities,
            visible =
              position.z > -1 &&
              position.z < 1 &&
              x > 0 &&
              x < width &&
              y > 0 &&
              y < height &&
              match &&
              (enabled || chosen || !!needle)
          button.style.left = x + 'px'
          button.style.top = y + 'px'
          button.style.zIndex = chosen ? '30' : region ? '8' : '6'
          button.classList.toggle('is-hidden', !visible)
          button.classList.toggle('selected', chosen)
          button.classList.toggle(
            'cinematic-distant',
            camera.zoom < 2.4 &&
              !chosen &&
              !region &&
              (!('major' in entry) || !entry.major),
          )
          button.setAttribute('aria-hidden', String(!visible))
          button.setAttribute('aria-pressed', String(chosen))
          button.tabIndex = visible ? 0 : -1
          if (visible)
            candidates.push({
              button,
              x,
              y,
              priority: chosen
                ? 100
                : region
                  ? 90
                  : 'major' in entry && entry.major
                    ? 80
                    : subregion
                      ? 65
                      : feature
                        ? 30
                        : 50,
            })
        }
        const used: {
          left: number
          right: number
          top: number
          bottom: number
        }[] = []
        let count = 0
        for (const c of candidates.sort((a, b) => b.priority - a.priority)) {
          const label = c.button.querySelector<HTMLElement>('.pin-label')!,
            w = label.offsetWidth || 110,
            h = label.offsetHeight || 21
          let show = false
          for (const left of [false, true]) {
            const l = left ? c.x - w - 20 : c.x + 20,
              r = {
                left: l,
                right: l + w,
                top: c.y - h / 2,
                bottom: c.y + h / 2,
              }
            if (
              ((!used.some(
                (o) =>
                  r.left < o.right + 6 &&
                  r.right > o.left - 6 &&
                  r.top < o.bottom + 6 &&
                  r.bottom > o.top - 6,
              ) &&
                count < (mobile ? 7 : 17)) ||
                c.button.classList.contains('selected')) &&
              r.left >= 4 &&
              r.right <= width - 4 &&
              r.top > 4 &&
              r.bottom < height - 4
            ) {
              used.push(r)
              c.button.classList.toggle('label-left', left)
              show = true
              count++
              break
            }
          }
          c.button.classList.toggle('label-muted', !show)
        }
        for (const group of world.cities.children)
          group.visible =
            !!group.userData.major ||
            camera.zoom > 2 ||
            group.userData.targetId === p.selected
        world.roads.visible = p.showRoutes
        for (const group of world.roads.children)
          group.visible =
            !p.selected ||
            !featureById(p.selected) ||
            group.userData.targetId === p.selected
        latest.current.onZoom(Math.round(camera.zoom * 100))
        element!.dataset.cameraZoom = String(camera.zoom)
        element!.dataset.cameraTarget = JSON.stringify(
          controls.target.toArray(),
        )
        element!.dataset.cameraProjection = JSON.stringify(
          camera.projectionMatrix.elements,
        )
        element!.dataset.cameraInverse = JSON.stringify(
          camera.matrixWorldInverse.elements,
        )
      }
      function tick(time: number) {
        frame = 0
        if (dead || document.hidden) return
        const dt = lastTime ? Math.min(0.08, (time - lastTime) / 1000) : 0.016
        lastTime = time
        if (tween) {
          const t = latest.current.reducedMotion ? 1 : Math.min(1, dt * 8),
            offset = camera.position.clone().sub(controls.target)
          controls.target.lerp(tween.target, t)
          camera.position
            .copy(controls.target)
            .add(tween.eye ? offset.lerp(tween.eye, t) : offset)
          camera.zoom = THREE.MathUtils.lerp(camera.zoom, tween.zoom, t)
          camera.updateProjectionMatrix()
          if (
            controls.target.distanceTo(tween.target) < 0.003 &&
            Math.abs(camera.zoom - tween.zoom) < 0.003
          )
            finish()
          dirty = true
          project = true
        }
        controls.update()
        if (dirty) {
          camera.updateMatrixWorld()
          if (project) {
            projectMarkers()
            project = false
          }
          renderer.render(scene, camera)
          element!.dataset.drawCalls = String(renderer.info.render.calls)
          element!.dataset.triangles = String(renderer.info.render.triangles)
          element!.dataset.visibleCityIds = JSON.stringify(world?.cities.children.filter(city => city.visible).map(city => city.userData.targetId) || [])
          dirty = false
        }
        if (tween) schedule()
      }
      function resize() {
        const w = element!.clientWidth,
          h = element!.clientHeight
        if (!w || !h || dead) return
        const aspect = w / h
        baseHeight = Math.max(WORLD_WIDTH / aspect, WORLD_DEPTH * 0.86) * 1.12
        camera.left = (-baseHeight * aspect) / 2
        camera.right = (baseHeight * aspect) / 2
        camera.top = baseHeight / 2
        camera.bottom = -baseHeight / 2
        camera.updateProjectionMatrix()
        renderer.setSize(w, h, false)
        changed()
      }
      function key(event: KeyboardEvent) {
        const direction = (
          {
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0],
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
          } as Record<string, number[]>
        )[event.key]
        if (!direction) return
        event.preventDefault()
        tween = null
        const d = new THREE.Vector3(
          (direction[0] * 2.5) / camera.zoom,
          0,
          (direction[1] * 2.5) / camera.zoom,
        )
        controls.target.add(d)
        camera.position.add(d)
        controls.update()
        changed()
      }
      function pointerDown(event: PointerEvent) {
        down = { x: event.clientX, y: event.clientY }
        tween = null
      }
      function pointerUp(event: PointerEvent) {
        if (
          !world ||
          Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5
        )
          return
        const r = canvas.getBoundingClientRect()
        pointer.set(
          ((event.clientX - r.left) / r.width) * 2 - 1,
          (-(event.clientY - r.top) / r.height) * 2 + 1,
        )
        raycaster.setFromCamera(pointer, camera)
        const hit = raycaster
          .intersectObjects(world.cities.children, true)
          .find((i) => typeof i.object.userData.targetId === 'string')
        if (hit) latest.current.onSelect(hit.object.userData.targetId)
      }
      function lost(event: Event) {
        event.preventDefault()
        if (!dead) latest.current.onUnavailable()
      }
      function visibility() {
        if (document.hidden) {
          cancelAnimationFrame(frame)
          frame = 0
        } else changed()
      }
      const observer = new ResizeObserver(resize)
      observer.observe(element)
      controls.addEventListener('change', changed)
      const start = () => {
        tween = null
      }
      controls.addEventListener('start', start)
      canvas.addEventListener('keydown', key)
      canvas.addEventListener('pointerdown', pointerDown)
      canvas.addEventListener('pointerup', pointerUp)
      canvas.addEventListener('webglcontextlost', lost)
      document.addEventListener('visibilitychange', visibility)
      runtime.current = {
        home,
        zoom: (factor) => {
          tween = null
          camera.zoom = clamp(camera.zoom * factor, 0.8, 18)
          camera.updateProjectionMatrix()
          controls.update()
          changed()
        },
        tilt: (top) => {
          const r = camera.position.distanceTo(controls.target),
            angle = top ? 0.055 : 0.69
          move(
            controls.target.clone(),
            camera.zoom,
            new THREE.Vector3(0, r * Math.cos(angle), r * Math.sin(angle)),
          )
          setFlat(top)
        },
        north: () => {
          const d = camera.position.clone().sub(controls.target)
          move(
            controls.target.clone(),
            camera.zoom,
            new THREE.Vector3(0, d.y, Math.hypot(d.x, d.z)),
          )
        },
        refresh: (select = false) => {
          if (select && world) focus()
          changed()
        },
      }
      resize()
      void loadCinematicField(abort.signal)
        .then((field) => {
          if (dead) return
          world = buildWorld(field, mobile)
          scene.add(world.root)
          for (const entry of targets) {
            const feature = featureById(entry.id),
              region = regions.some((r) => r.id === entry.id),
              subregion = !!subregionById(entry.id),
              button = document.createElement('button'),
              symbol = document.createElement('span'),
              label = document.createElement('span'),
              name =
                'mapLabel' in entry && entry.mapLabel
                  ? entry.mapLabel
                  : entry.name
            button.type = 'button'
            button.className = `map-pin ${feature ? `feature-pin ${feature.kind}-pin` : region ? 'region-pin' : `city-pin${subregion ? ' subregion-pin' : ''}`}`
            button.dataset.testid = 'marker-' + entry.id
            button.dataset.targetId = entry.id
            button.setAttribute(
              'aria-label',
              `${name} ${feature ? featureLabels[feature.kind].toLocaleLowerCase('tr') : region ? 'bölgesini' : 'yerleşimini'} keşfet`,
            )
            symbol.className = 'pin-symbol'
            symbol.textContent = feature
              ? ['mountain', 'ridge'].includes(feature.kind)
                ? '▲'
                : feature.kind === 'route'
                  ? '⌁'
                  : '≈'
              : region
                ? '✧'
                : '◆'
            label.className = 'pin-label'
            label.textContent = name
            button.append(symbol, label)
            button.addEventListener('click', () =>
              latest.current.onSelect(entry.id),
            )
            overlay.append(button)
            markers.set(entry.id, button)
            vectors.set(
              entry.id,
              new THREE.Vector3(
                ...worldPoint(
                  entry.point!,
                  Math.max(0.06, world.sample(entry.point!)) + 0.14,
                ),
              ),
            )
          }
          element.dataset.vertices = String(world.vertices)
          element.dataset.cityCount = String(world.cityCount)
          element.dataset.cityIds = JSON.stringify(world.cities.children.map(city => city.userData.targetId))
          element.dataset.cityOffsets = JSON.stringify(world.cities.children.filter(city => city.userData.offset > 0).map(city => ({ id: city.userData.targetId, point: city.userData.canonicalPoint, modelPoint: city.userData.modelPoint, distance: city.userData.offset })))
          element.dataset.forestCount = String(world.forestCount)
          element.dataset.targetCount = String(markers.size)
          element.dataset.textureWidth = '0'
          element.dataset.maskWidth = String(field.width)
          element.dataset.ready = 'true'
          setReady(true)
          let restored = false
          try {
            const s = JSON.parse(
              sessionStorage.getItem(cinematicCameraKey) || 'null',
            )
            if (
              s &&
              s.selected === latest.current.selected &&
              [s.target, s.position].every(
                (a: unknown) =>
                  Array.isArray(a) &&
                  a.length === 3 &&
                  a.every(
                    (v) =>
                      typeof v === 'number' &&
                      Number.isFinite(v) &&
                      Math.abs(v) < 350,
                  ),
              ) &&
              Number.isFinite(s.zoom) &&
              s.zoom >= 0.8 &&
              s.zoom <= 18
            ) {
              controls.target.fromArray(s.target)
              camera.position.fromArray(s.position)
              camera.zoom = s.zoom
              camera.updateProjectionMatrix()
              controls.update()
              restored = true
              setFlat(
                camera.position.clone().sub(controls.target).normalize().y >
                  0.98,
              )
            }
          } catch {
            /* invalid view ignored */
          }
          if (!restored) {
            latest.current.selected ? focus() : home()
            finish()
          }
          changed()
        })
        .catch((error) => {
          if (!dead && error.name !== 'AbortError')
            latest.current.onUnavailable()
        })
      return () => {
        remember()
        dead = true
        abort.abort()
        clearTimeout(saveTimer)
        cancelAnimationFrame(frame)
        observer.disconnect()
        controls.removeEventListener('change', changed)
        controls.removeEventListener('start', start)
        controls.dispose()
        canvas.removeEventListener('keydown', key)
        canvas.removeEventListener('pointerdown', pointerDown)
        canvas.removeEventListener('pointerup', pointerUp)
        canvas.removeEventListener('webglcontextlost', lost)
        document.removeEventListener('visibilitychange', visibility)
        if (world) dispose(world.root)
        renderer.dispose()
        renderer.forceContextLoss()
        canvas.remove()
        overlay.replaceChildren()
        runtime.current = null
      }
    }, [])
    useEffect(() => {
      if (previous.current === props.selected) return
      previous.current = props.selected
      runtime.current?.refresh(true)
    }, [props.selected])
    useEffect(() => {
      runtime.current?.refresh()
    }, [
      props.query,
      props.showCities,
      props.showGeography,
      props.showRoutes,
      props.effects,
      props.reducedMotion,
    ])
    return (
      <>
        <div
          className="cinematic-viewer"
          data-testid="cinematic-viewer"
          ref={host}
        />
        <div
          className="cinematic-pins"
          aria-label="Koyu dünya atlası yerleri"
          ref={pins}
        />
        {!ready && (
          <div className="map-loading" role="status">
            <LoaderCircle className="spin" size={25} />
            <span>Koyu dünya kabartması hazırlanıyor…</span>
          </div>
        )}
        <div className="cinematic-controls" aria-label="Koyu atlas kontrolleri">
          <button
            aria-pressed={flat}
            onClick={() => runtime.current?.tilt(!flat)}
          >
            <Layers3 size={16} />
            {flat ? 'Eğimli görünüm' : 'Üstten görünüm'}
          </button>
          <button onClick={() => runtime.current?.north()}>
            <Compass size={16} />
            Kuzey
          </button>
          <button
            onClick={() => runtime.current?.home()}
            aria-label="Koyu atlas kamerasını sıfırla"
          >
            <RotateCcw size={16} />
          </button>
        </div>
        <button className="cinematic-exit" onClick={props.onExit}>
          <X size={15} />
          Özgün haritaya dön
        </button>
        <div className="cinematic-caption">
          <strong>
            VALHUNAR <span>· KOYU KABARTMA</span>
          </strong>
          <small>Sürükle · yakınlaş · sağ sürüklemeyle eğ</small>
          <small className="cinematic-interpretation">Kıyılar kaynak haritadan yorumlandı · şehirler simgesel maket</small>
        </div>
      </>
    )
  },
)
