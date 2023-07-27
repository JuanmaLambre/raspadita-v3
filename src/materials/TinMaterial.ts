import * as THREE from "three";
import vertShader from "./shaders/TinMaterialShader.vert";
import fragShader from "./shaders/TinMaterialShader.frag";

export type TinMaterialParams = {
  width: number;
  height: number;
  length?: number; // In pixels
  color1?: THREE.ColorRepresentation;
  color2?: THREE.ColorRepresentation;
  angle?: number; // Grads
  offset?: number;
  alphaMap?: THREE.Texture;
};

const defaultParams: Required<TinMaterialParams> = {
  length: 0,
  color1: 0x666666,
  color2: 0x444444,
  angle: 0,
  offset: 0,
  alphaMap: undefined,
  width: undefined,
  height: undefined,
};

export class TinMaterial extends THREE.ShaderMaterial {
  private alphaUniform: THREE.Uniform<THREE.Texture>;

  constructor(params: TinMaterialParams) {
    const { width, height, alphaMap, color1, color2, angle, length, offset } = { ...defaultParams, ...params };

    const alphaUniform = new THREE.Uniform(alphaMap);

    super({
      uniforms: {
        uWidth: { value: width },
        uHeight: { value: height },
        uAlphaMap: alphaUniform,
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
        uAngle: { value: angle % (2 * Math.PI) },
        uLength: { value: length },
        uOffset: { value: offset },
      },
      vertexShader: vertShader,
      fragmentShader: fragShader,
      transparent: true,
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
