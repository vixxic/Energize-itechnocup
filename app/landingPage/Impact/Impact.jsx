import "./Impact.css";

function Impact() {
  return (
    <div className="impact-section">
      <div className="impact-text-con">
        <p>Dampak yang Kita Ciptakan</p>
        <p>
          Perubahan kecil dalam penggunaan energi hari ini dapat menciptakan
          masa depan yang lebih hemat, berkelanjutan, dan berdampak bagi
          lingkungan serta masyarakat.
        </p>
      </div>

      <div className="impact-grid-con">
        <div className="impact-box">
          <img src="/impact-img/impact1.png" />
        </div>
        <div className="impact-box">
          <img src="/impact-img/impact2.png" />
        </div>
        <div className="impact-box">
          <img src="/impact-img/impact3.png" />
        </div>
        <div className="impact-box">
          <img src="/impact-img/impact4.png" />
        </div>
      </div>
    </div>
  );
}

export default Impact;
