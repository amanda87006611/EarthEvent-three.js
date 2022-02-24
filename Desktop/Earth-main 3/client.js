import * as THREE from './node_modules/three/build/three.module.js'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'
import Stats from './node_modules/three/examples/jsm/libs/stats.module.js'
// global variables
let scene
let camera
let renderer
const canvas = document.querySelector('.webgl')
var mouseDown = false,
    mouseX = 0,
    mouseY = 0,
    mouseDeletaX = 0,
    mouseDeletaY = 0

function onMouseMove(evt) {
    if (!mouseDown) {
        return
    }
    // console.log(evt)
    evt.preventDefault()

    mouseDeletaX = evt.clientX - mouseX
    mouseDeletaY = evt.clientY - mouseY
    mouseX = evt.clientX
    mouseY = evt.clientY
    // rotateScene(deltaX, deltaY)
}

function onMouseDown(evt) {
    evt.preventDefault()
    mouseDown = true
    mouseX = evt.clientX
    mouseY = evt.clientY
}

function onMouseUp(evt) {
    evt.preventDefault()

    mouseDown = false
}

function addMouseHandler(canvas) {
    console.log(canvas)
    // canvas 內滑鼠操作事件
    canvas.addEventListener(
        'mousemove',
        function (e) {
            onMouseMove(e)
        },
        false
    )
    canvas.addEventListener(
        'mousedown',
        function (e) {
            onMouseDown(e)
            // console.log('onMouseDown')
        },
        false
    )
    canvas.addEventListener(
        'mouseup',
        function (e) {
            onMouseUp(e)
        },
        false
    )
}
addMouseHandler(window)

function rotateScene(deltaX, deltaY) {
    root.rotation.y += deltaX / 100
    root.rotation.x += deltaY / 100
}

// scene setup
scene = new THREE.Scene()

// camera setup
const fov = 60
const aspect = window.innerWidth / window.innerHeight
const near = 0.1
const far = 1000

camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 2
scene.add(camera)

// renderer setup
renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
renderer.autoClear = false
renderer.setClearColor(0x000000, 0.0)

// orbit control setup
const controls = new OrbitControls(camera, renderer.domElement)

// earth geometry
const earthGeometry = new THREE.SphereGeometry(0.6, 32, 32)

// earth material
const earthMaterial = new THREE.MeshPhongMaterial({
    roughness: 1,
    metalness: 0,
    map: THREE.ImageUtils.loadTexture('texture/earthmap1k.jpg'),
    bumpMap: THREE.ImageUtils.loadTexture('texture/earthbump.jpg'),
    bumpScale: 0.3,
})

// earth mesh
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earthMesh)

// cloud Geometry
const cloudGeometry = new THREE.SphereGeometry(0.63, 32, 32)

// cloud metarial
const cloudMetarial = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('texture/earthCloud.png'),
    transparent: true,
})

// cloud mesh
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMetarial)
scene.add(cloudMesh)

// galaxy geometry
const starGeometry = new THREE.SphereGeometry(80, 64, 64)

// galaxy material
const starMaterial = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('texture/galaxy.png'),
    side: THREE.BackSide,
})

// galaxy mesh
const starMesh = new THREE.Mesh(starGeometry, starMaterial)
scene.add(starMesh)

// ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientlight)

// point light
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(5, 3, 5)
scene.add(pointLight)

// point light helper
const Helper = new THREE.PointLightHelper(pointLight)
scene.add(Helper)

// handling resizing
window.addEventListener(
    'resize',
    () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    },
    false
)

// current fps
const stats = Stats()
document.body.appendChild(stats.dom)

// spinning animation
const animate = () => {
    requestAnimationFrame(animate)
    starMesh.rotation.y -= 0.0005
    earthMesh.rotation.y -= 0.0010
    cloudMesh.rotation.y -= 0.001
    if (mouseDown) {
        earthMesh.rotation.x += mouseDeletaY * 0.01
        earthMesh.rotation.y += mouseDeletaX * 0.01
        // starMesh.rotation.x += mouseDeletaY * 0.01
        // starMesh.rotation.y += mouseDeletay * 0.01
        cloudMesh.rotation.x += mouseDeletaY * 0.01
        cloudMesh.rotation.y += mouseDeletaX * 0.01
        mouseDeletaX = 0
        mouseDeletaY = 0
        // console.log(mouseDeletaX, mouseDeletaY)
    }

    controls.update()
    render()
    stats.update()
}

// rendering
const render = () => {
    renderer.render(scene, camera)
}

animate()
