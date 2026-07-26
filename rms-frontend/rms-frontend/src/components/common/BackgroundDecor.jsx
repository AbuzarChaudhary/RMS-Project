import bg from '@/assets/images/background_img.png';
import './BackgroundDecor.css';

// Figma body background. Covers the content area (sits below header/footer).
export default function BackgroundDecor() {
  return (
    <div className="bg-decor" aria-hidden="true">
      <img className="bg-decor__img" src={bg} alt="" />
    </div>
  );
}
