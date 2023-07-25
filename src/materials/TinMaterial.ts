import * as THREE from "three";
import vertShader from "./shaders/TinMaterialShader.vert";
import fragShader from "./shaders/TinMaterialShader.frag";

export type TinMaterialParams = {
  period?: number;
  color1?: THREE.ColorRepresentation;
  color2?: THREE.ColorRepresentation;
  angle?: number; // Grads
  alphaMap?: THREE.Texture;
};

const defaultParams: Required<TinMaterialParams> = {
  period: 1,
  color1: 0x666666,
  color2: 0x444444,
  angle: 0,
  alphaMap: undefined,
};

export class TinMaterial extends THREE.ShaderMaterial {
  private alphaUniform: THREE.Uniform<THREE.Texture>;

  constructor(params: TinMaterialParams = {}) {
    const { alphaMap, color1 } = { ...defaultParams, ...params };

    const alphaUniform = new THREE.Uniform(alphaMap);

    super({
      uniforms: {
        alphaMap: alphaUniform,
        color1: { value: new THREE.Color(color1) },
      },
      vertexShader: vertShader,
      fragmentShader: fragShader,
    });

    this.alphaUniform = alphaUniform;
  }

  get alphaMap(): THREE.Texture {
    return this.alphaUniform.value;
  }

  set alphaMap(map: THREE.Texture) {
    this.alphaUniform.value = map;
  }
}
