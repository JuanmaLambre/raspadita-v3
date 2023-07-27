precision mediump float;

#define PI 3.1415926538

uniform sampler2D uAlphaMap;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uAngle;
uniform float uLength;
uniform float uOffset;
uniform float uWidth;
uniform float uHeight;

varying vec2 vUv;

void gradientCenter(out vec2 result) {
  result = vec2(uWidth / 2.0 + uOffset, uHeight / 2.0);
}

void gradientLine(float t, out vec2 result) {
  vec2 center;
  gradientCenter(center);
  result = center + vec2(t * cos(uAngle), t * sin(uAngle));
} 

/** Returns parameter value */
void projectionToGradientLine(vec2 point, out float result) {
  vec2 center;
  gradientCenter(center);
  vec2 p = point - center;
  float pLength = sqrt(p.x * p.x + p.y * p.y);

  float angleToX = acos(p.x / pLength);
  if (p.y < 0.0) angleToX = 2.0 * PI - angleToX;

  result = pLength * cos(angleToX - uAngle);
}

void main() {
  // Linear gradient
  float starting = uLength / 2.0;
  float ending = -uLength / 2.0;
  float projected;
  projectionToGradientLine(gl_FragCoord.xy, projected);

  float m = 1.0 / (ending - starting);
  float c = -m * starting;
  float mixValue = min(max(0.0, m * projected + c), 1.0);

  vec3 color = mix(uColor1, uColor2, mixValue);

  float alpha = texture(uAlphaMap, vUv).r;

  gl_FragColor = vec4(color, alpha);
}