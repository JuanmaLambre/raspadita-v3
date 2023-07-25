precision highp float;

uniform sampler2D alphaMap;
uniform vec3 color1;

varying vec2 vUv;

void main() {
  float alpha = texture(alphaMap, vUv).r;

  gl_FragColor = vec4(color1, alpha);
}