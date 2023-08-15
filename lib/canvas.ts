import {
  ActionManager,
  Color3,
  Color4,
  CreateSphere,
  Engine,
  IncrementValueAction,
  Mesh,
  PBRMaterial,
  StandardMaterial,
} from "@babylonjs/core";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";

interface PlanetInfo {
  name: string;
  diameter: number;
  color: Color3;
  distance: number;
  angularVelocity: number;
}

type PlanetViewInfo = PlanetInfo & {
  diameterRadio: number;
  distanceRadio: number;
};

const data: PlanetInfo[] = [
  // 太阳
  {
    name: "Sun",
    diameter: 10,
    color: Color3.FromArray([1, 1, 224 / 255]),
    distance: 0,
    angularVelocity: 0,
  },
  // 水星
  {
    name: "Mercury",
    diameter: 5,
    color: Color3.Gray(),
    distance: 0.5791,
    // orbitalVelocity: 170503,       // 公转速度
    angularVelocity: 0.241, // 公转角速度
  },
  // 金星
  {
    name: "Venus",
    diameter: 8,
    color: Color3.FromArray([240, 230, 140].map((val) => val / 255)),
    distance: 1.082,
    // orbitalVelocity: 126074,
    angularVelocity: 0.615,
  },
  // 地球
  {
    name: "Earth",
    diameter: 4,
    color: Color3.Blue(),
    distance: 107218,
    angularVelocity: 0.986,
  },
  // 火星
  {
    name: "Mars",
    diameter: 3,
    color: Color3.FromArray([1, 0, 0]),
    distance: 2.279,
    // orbitalVelocity: 86677,
    angularVelocity: 0.524,
  },
  // 木星
  {
    name: "Jupiter",
    diameter: 2,
    color: Color3.FromArray([250, 250, 210].map((val) => val / 255)),
    distance: 7.783,
    // orbitalVelocity: 170503,
    angularVelocity: 0.083,
  },
  // 土星
  {
    name: "Saturn",
    diameter: 2,
    color: Color3.Yellow(),
    distance: 14.27,
    // orbitalVelocity: 170503,
    angularVelocity: 0.033,
  },
  // 天王
  {
    name: "Uranus",
    diameter: 1.5,
    color: Color3.FromArray([64, 224, 208].map((val) => val / 255)),
    distance: 28.72,
    // orbitalVelocity: 170503,
    angularVelocity: 0.012,
  },
  // 海王
  {
    name: "Neptune",
    diameter: 7,
    color: Color3.Blue(),
    distance: 45.87,
    // orbitalVelocity: 170503,
    angularVelocity: 0.006,
  },
];

function handleData(): PlanetViewInfo[] {
  const maxDiameter = Math.max(...data.map((item) => item.diameter));
  const maxDistance = Math.max(...data.map((item) => item.distance));
  return data.map((item, index) => {
    const diameterRadio = item.diameter / maxDiameter;
    const distanceRadio = index / data.length;
    return { ...item, diameterRadio, distanceRadio };
  });
}

export class CanvasUtil {
  freeCamera: null | FreeCamera;
  hemiLight: HemisphericLight | null = null;
  planetViewInfo: null | PlanetViewInfo[] = null;

  constructor(
    private scene: Scene,
    private engine: Engine,
  ) {
    this.planetViewInfo = handleData();
    const length = Math.min(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
    );
    this.scene.clearColor = Color4.FromArray([0, 0, 0, 0]);
    this.freeCamera = this.createFreeCamera(Vector3.FromArray([0, 300, -400]));

    this.hemiLight = new HemisphericLight(
      "hemi",
      Vector3.FromArray([0, 1, 0]),
      this.scene,
    );
    this.hemiLight.intensity = 0.7;

    
    this.planetViewInfo.map(
      (
        { name, diameterRadio, distanceRadio, angularVelocity, color },
        index,
      ) => {
        const planet = this.createPlanet(
          name,
          diameterRadio * length * 0.02,
          ((distanceRadio * length) / 2) * 0.8,
          color,
        );
        this.angularRotate(
          planet,
          angularVelocity,
          ((distanceRadio * length) / 2) * 0.8,
        );
      },
    );

    // Render every frame
    engine.runRenderLoop(() => {
      scene.render();
    });
  }

  createFreeCamera(pos: Vector3) {
    const camera = new FreeCamera("camera1", pos, this.scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(true);
    camera.invertRotation = true;
    return camera;
  }

  createPlanet(
    name: string,
    diameter: number,
    distance: number,
    color: Color3,
    emissiveIntensity = 0.5,
  ) {
    const sphere = CreateSphere(name, { diameter: diameter }, this.scene);
    sphere.position = Vector3.FromArray([distance, 0, 0]);

    const mat = new PBRMaterial("mat", this.scene);
    mat.emissiveColor = color;
    mat.emissiveIntensity = emissiveIntensity;
    sphere.material = mat;
    return sphere;
  }

  // 自转
  rotateMesh(mesh: Mesh, axis?: Vector3) {
    this.scene.actionManager = new ActionManager(this.scene);
    this.scene.actionManager.registerAction(
      new IncrementValueAction(
        ActionManager.OnEveryFrameTrigger,
        mesh,
        "rotation.y",
        0.01,
      ),
    );
  }

  // 公转
  angularRotate(mesh: Mesh, alpha: number, distance: number) {
    this.scene.registerBeforeRender(function () {
      mesh.position.x = distance * Math.cos(alpha);
      mesh.position.y = 0;
      mesh.position.z = distance * Math.sin(alpha);
      alpha += 0.01;
    });
  }
}
