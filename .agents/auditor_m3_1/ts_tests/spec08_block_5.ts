// 2D Affine Transformation Matrix Class
export class Matrix2D {
  public a: number;  // Scale X (s)
  public b: number;  // Skew Y
  public c: number;  // Skew X
  public d: number;  // Scale Y (s)
  public tx: number; // Translate X
  public ty: number; // Translate Y

  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }

  public toArray(): [number, number, number, number, number, number] {
    return [this.a, this.b, this.c, this.d, this.tx, this.ty];
  }

  public screenToCanvas(screenX: number, screenY: number): { x: number; y: number } {
    // Inverse matrix computation assuming b=0, c=0 (standard scale + translate)
    const scale = this.a;
    return {
      x: (screenX - this.tx) / scale,
      y: (screenY - this.ty) / scale,
    };
  }

  public canvasToScreen(canvasX: number, canvasY: number): { x: number; y: number } {
    return {
      x: canvasX * this.a + this.tx,
      y: canvasY * this.d + this.ty,
    };
  }

  public zoomAtPoint(zoomFactorDelta: number, focalScreenX: number, focalScreenY: number, minZoom = 0.1, maxZoom = 5.0): void {
    const currentZoom = this.a;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom * zoomFactorDelta));
    const effectiveFactor = newZoom / currentZoom;

    // Adjust pan translation to anchor zoom centered at focal screen point
    this.tx = focalScreenX - (focalScreenX - this.tx) * effectiveFactor;
    this.ty = focalScreenY - (focalScreenY - this.ty) * effectiveFactor;
    this.a = newZoom;
    this.d = newZoom;
  }
}