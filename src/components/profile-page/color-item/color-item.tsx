export const DEFAULT_COLOR_ID = 11;

export default function ColorItem(props: { color: string; colorId: number }) {
  return (
    <div
      data-testid={`color_item_${props.colorId}`}
      className="color-item"
      style={{ background: props.color }}
    ></div>
  );
}
