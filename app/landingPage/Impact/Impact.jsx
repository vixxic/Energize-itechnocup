import "./Impact.css";

function Impact() {
  return (
    <div id="impact-section">
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
          <img src="/impact-img/impact1.png" alt="Dampak penggunaan energi" />
        </div>
        <div className="impact-box">
          <img
            src="/impact-img/impact2.png"
            alt="Dampak energi bagi masyarakat"
          />
        </div>
        <div className="impact-box">
          <img src="/impact-img/impact3.png" alt="Manfaat efisiensi energi" />
        </div>
        <div className="impact-box">
          <img
            src="/impact-img/impact4.png"
            alt="Dampak energi terhadap lingkungan"
          />
        </div>
      </div>
    </div>
  );
}

export default Impact;
